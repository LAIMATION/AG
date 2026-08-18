'use client';

/* Karuzela realizacji: kafelek środkowy jest aktywny, sąsiednie cofają się w tło,
   pod spodem pojawia się opis aktywnego projektu. Lista jest zapętlona.

   Przewijaniem zajmuje się natywny scroll ze `scroll-snap-align: center` — stąd za
   darmo mamy centrowanie, pęd, przeciąganie palcem, klawiaturę i czytniki ekranu.
   GSAP mapuje odległość kafelka od środka kadru na skalę i przezroczystość.

   Zapętlenie: lista renderuje się trzy razy, start na środkowej kopii. Gdy aktywny
   kafelek wyjdzie poza nią, `scrollLeft` przeskakuje o szerokość jednej kopii —
   treść jest identyczna, więc skok jest niewidoczny. Przeskok robimy dopiero po
   wyciszeniu scrolla, żeby nie przerwać trwającej animacji `scrollBy`. */

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { projects } from '@/lib/config';

const DEPTH = 0.14; // ile skali traci kafelek na każdą pozycję od środka
const FADE = 0.34; // ile przezroczystości traci na każdą pozycję
const MAX = 2; // dalej niż 2 pozycje nie przygaszamy mocniej
const SETS = 3; // kopie listy: poprzednia, właściwa, następna
const IDLE = 140; // ms ciszy, po których wolno przeskoczyć o kopię

const N = projects.items.length;
const loop = Array.from({ length: SETS * N }, (_, i) => ({
  ...projects.items[i % N],
  real: i % N,
  key: `${i}`,
}));

export function ProjectRail() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  // `projects` jest `as const`, więc bez adnotacji ref dostałby typ literalny `6`
  const nearestRef = useRef<number>(N); // indeks w pełnej, potrojonej liście

  const cards = useCallback(
    () =>
      gsap.utils.toArray<HTMLElement>(
        viewportRef.current?.querySelectorAll('.ag-rail__card') ?? [],
      ),
    [],
  );

  /* --- Głębia, wybór aktywnego, zapętlenie -------------------------------- */

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const els = cards();
    if (!els.length) return;

    const flat = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const set = els.map((el) => gsap.quickSetter(el, 'css') as (v: object) => void);
    const setWidth = () => els[N].offsetLeft - els[0].offsetLeft;

    const paint = () => {
      const mid = viewport.scrollLeft + viewport.clientWidth / 2;
      let nearest = 0;
      let best = Infinity;

      els.forEach((el, i) => {
        const d = (el.offsetLeft + el.offsetWidth / 2 - mid) / el.offsetWidth;
        const abs = Math.min(Math.abs(d), MAX);
        if (Math.abs(d) < best) {
          best = Math.abs(d);
          nearest = i;
        }
        set[i](flat ? { opacity: 1 } : { scale: 1 - abs * DEPTH, opacity: 1 - abs * FADE });
      });

      nearestRef.current = nearest;
      const real = nearest % N;
      if (real !== activeRef.current) {
        activeRef.current = real;
        setActive(real);
      }
    };

    /* Utrzymuj aktywny kafelek w środkowej kopii. Instant, bo treść po skoku jest
       identyczna — użytkownik widzi dokładnie ten sam kadr. */
    let idle: ReturnType<typeof setTimeout>;
    const recenter = () => {
      const i = nearestRef.current;
      const w = setWidth();
      if (i < N) viewport.scrollLeft += w;
      else if (i >= 2 * N) viewport.scrollLeft -= w;
    };

    const onScroll = () => {
      paint();
      clearTimeout(idle);
      idle = setTimeout(recenter, IDLE);
    };

    // start na pierwszym kafelku środkowej kopii
    viewport.scrollLeft = els[N].offsetLeft + els[N].offsetWidth / 2 - viewport.clientWidth / 2;
    paint();

    viewport.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', paint);
    return () => {
      clearTimeout(idle);
      viewport.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', paint);
    };
  }, [cards]);

  /* --- Przeciąganie myszą ------------------------------------------------- */
  /* Dotyk i gładzik obsługuje natywny scroll; kursor na desktopie nie. */

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let startX = 0;
    let startLeft = 0;
    let dragging = false;

    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      dragging = true;
      startX = e.clientX;
      startLeft = viewport.scrollLeft;
      viewport.setPointerCapture(e.pointerId);
      viewport.dataset.dragging = 'true';
      /* `scroll-snap-type: mandatory` cofa każdą pozycję pośrednią, więc podczas
         trzymania snap musi zniknąć — po puszczeniu wraca i dociąga do najbliższego. */
      viewport.style.scrollSnapType = 'none';
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      e.preventDefault();
      viewport.scrollLeft = startLeft - (e.clientX - startX);
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      delete viewport.dataset.dragging;
      viewport.style.scrollSnapType = '';
      if (viewport.hasPointerCapture(e.pointerId)) viewport.releasePointerCapture(e.pointerId);
    };

    viewport.addEventListener('pointerdown', down);
    viewport.addEventListener('pointermove', move);
    viewport.addEventListener('pointerup', up);
    viewport.addEventListener('pointercancel', up);
    return () => {
      viewport.removeEventListener('pointerdown', down);
      viewport.removeEventListener('pointermove', move);
      viewport.removeEventListener('pointerup', up);
      viewport.removeEventListener('pointercancel', up);
    };
  }, []);

  /* --- Sterowanie --------------------------------------------------------- */

  /* O jeden kafelek względem BIEŻĄCEJ pozycji, nie do bezwzględnego indeksu —
     przy zapętleniu docelowa kopia zmienia się w trakcie i skok bezwzględny
     potrafiłby przelecieć przez pół listy. */
  const step = useCallback((dir: 1 | -1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const els = cards();
    const from = els[nearestRef.current];
    const to = els[nearestRef.current + dir];
    if (!from || !to) return;
    viewport.scrollBy({ left: to.offsetLeft - from.offsetLeft, behavior: 'smooth' });
  }, [cards]);

  const item = projects.items[active];

  return (
    <div className="ag-rail">
      <div className="ag-rail__stage">
        <div
          className="ag-rail__viewport"
          ref={viewportRef}
          data-lenis-prevent
          role="group"
          aria-roledescription="karuzela"
          aria-label="Realizacje"
        >
          <ul className="ag-rail__track">
            {loop.map((p, i) => (
              <li className="ag-rail__card" key={p.key} data-active={i % N === active}>
                <div className="ag-rail__frame" aria-hidden={i < N || i >= 2 * N}>
                  <span className="ag-rail__no">{String(p.real + 1).padStart(2, '0')}</span>
                  <span className="ag-rail__label">{p.title}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Nakładka na kadrze, nie pod opisem — strzałki mają być widoczne
            niezależnie od tego, ile miejsca zostało pod karuzelą. */}
        <div className="ag-rail__nav">
          <button
            className="ag-rail__btn"
            type="button"
            aria-label="Poprzednia realizacja"
            onClick={() => step(-1)}
          >
            ←
          </button>
          <button
            className="ag-rail__btn"
            type="button"
            aria-label="Następna realizacja"
            onClick={() => step(1)}
          >
            →
          </button>
        </div>
      </div>

      <div className="ag-rail__detail">
        {/* `key` wymusza remount, więc przenikanie startuje od zera przy każdej zmianie */}
        <RailDetail key={item.title} title={item.title} meta={item.meta} desc={item.desc} />
        <span className="ag-rail__count" aria-live="polite">
          {String(active + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}

function RailDetail({ title, meta, desc }: { title: string; meta: string; desc: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tween = gsap.fromTo(
      ref.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out' },
    );
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div className="ag-rail__text" ref={ref}>
      <h3 className="ag-rail__title">{title}</h3>
      <p className="ag-rail__desc">{desc}</p>
      <p className="ag-rail__meta">{meta}</p>
    </div>
  );
}
