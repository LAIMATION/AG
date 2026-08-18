'use client';

/* Karuzela realizacji: kafelek środkowy jest aktywny, sąsiednie cofają się w tło,
   a pod spodem pojawia się opis aktywnego projektu.

   Przewijaniem zajmuje się natywny scroll ze `scroll-snap-align: center` — stąd
   za darmo mamy centrowanie, pęd, przeciąganie palcem, klawiaturę i czytniki
   ekranu. GSAP robi to, w czym jest lepszy od CSS: mapuje odległość kafelka od
   środka kadru na skalę i przezroczystość, oraz przenika opis przy zmianie.

   Świadomie NIE ma tu pętli w nieskończoność ani przepisywania okna slotów —
   sześć realizacji to lista skończona, a przyciski gasną na końcach. */

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { projects } from '@/lib/config';

const DEPTH = 0.14; // ile skali traci kafelek na każdą pozycję od środka
const FADE = 0.34; // ile przezroczystości traci na każdą pozycję
const MAX = 2; // dalej niż 2 pozycje nie przygaszamy mocniej

export function ProjectRail() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  /* --- Głębia + wybór aktywnego kafelka ---------------------------------- */

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const cards = gsap.utils.toArray<HTMLElement>(viewport.querySelectorAll('.ag-rail__card'));
    const flat = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const set = cards.map((el) => gsap.quickSetter(el, 'css') as (v: object) => void);

    const paint = () => {
      const mid = viewport.scrollLeft + viewport.clientWidth / 2;
      let nearest = 0;
      let best = Infinity;

      cards.forEach((el, i) => {
        const d = (el.offsetLeft + el.offsetWidth / 2 - mid) / el.offsetWidth;
        const abs = Math.min(Math.abs(d), MAX);
        if (Math.abs(d) < best) {
          best = Math.abs(d);
          nearest = i;
        }
        set[i](flat ? { opacity: 1 } : { scale: 1 - abs * DEPTH, opacity: 1 - abs * FADE });
      });

      if (nearest !== activeRef.current) {
        activeRef.current = nearest;
        setActive(nearest);
      }
    };

    paint();
    viewport.addEventListener('scroll', paint, { passive: true });
    window.addEventListener('resize', paint);
    return () => {
      viewport.removeEventListener('scroll', paint);
      window.removeEventListener('resize', paint);
    };
  }, []);

  /* --- Przeciąganie myszą ------------------------------------------------- */
  /* Dotyk i gładzik obsługuje natywny scroll; kursor na desktopie nie, więc te
     kilka linii dokłada tylko brakujący przypadek. */

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

  const goTo = useCallback((i: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const card = viewport.querySelectorAll<HTMLElement>('.ag-rail__card')[i];
    if (!card) return;
    viewport.scrollTo({
      left: card.offsetLeft + card.offsetWidth / 2 - viewport.clientWidth / 2,
      behavior: 'smooth',
    });
  }, []);

  const item = projects.items[active];

  return (
    <div className="ag-rail">
      <div
        className="ag-rail__viewport"
        ref={viewportRef}
        data-lenis-prevent
        role="group"
        aria-roledescription="karuzela"
        aria-label="Realizacje"
      >
        <ul className="ag-rail__track">
          {projects.items.map((p, i) => (
            <li className="ag-rail__card" key={p.title} data-active={i === active}>
              <button
                className="ag-rail__frame"
                type="button"
                aria-label={`Pokaż: ${p.title}`}
                aria-current={i === active}
                onClick={() => goTo(i)}
              >
                <span className="ag-rail__no">{String(i + 1).padStart(2, '0')}</span>
                <span className="ag-rail__label">{p.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="ag-rail__detail">
        {/* `key` wymusza remount, więc przenikanie startuje od zera przy każdej zmianie */}
        <RailDetail key={item.title} title={item.title} meta={item.meta} desc={item.desc} />

        <div className="ag-rail__controls">
          <button
            className="ag-rail__btn"
            type="button"
            aria-label="Poprzednia realizacja"
            disabled={active === 0}
            onClick={() => goTo(active - 1)}
          >
            ←
          </button>
          <span className="ag-rail__count" aria-live="polite">
            {String(active + 1).padStart(2, '0')} / {String(projects.items.length).padStart(2, '0')}
          </span>
          <button
            className="ag-rail__btn"
            type="button"
            aria-label="Następna realizacja"
            disabled={active === projects.items.length - 1}
            onClick={() => goTo(active + 1)}
          >
            →
          </button>
        </div>
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
