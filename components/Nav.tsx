'use client';

/* Pływający pasek nawigacji + okrągły przycisk powrotu w prawym dolnym rogu.
   Oba na tym samym mlecznym szkle i sterowane tym samym stanem, więc chowają się
   i wracają równo.

   Pasek: desktop u góry, mobile (≤767px) u dołu.
   Chowanie w trakcie scrollowania, powrót po ucichnięciu scrolla.
   Aktywna zakładka = sekcja przecinająca środek ekranu (sceny wideo nie mają
   odpowiednika w menu, więc tam zaznaczenie po prostu gaśnie). */

import { useEffect, useRef, useState } from 'react';
import { nav } from '@/lib/config';

const MOVE_THRESHOLD = 10; // px — drobne drgnięcie nie chowa paska
const IDLE_DELAY = 420; // ms ciszy po scrollu, po których pasek wraca
const TONE_INTERVAL = 100; // ms — trafienia w punkt są droższe niż odczyt scrolla
const DARK_BELOW = 0.32; // luminancja, poniżej której tło uznajemy za ciemne

const toLinear = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};

const luminance = (r: number, g: number, b: number) =>
  0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

/* Co realnie leży pod płytką w danym punkcie. Trafienie w punkt zamiast sprawdzania,
   w zasięgu której sekcji jesteśmy — sekcja przykrywająca przypięte wideo należy
   wciąż do zakresu scrolla sceny, więc test „czy jestem w .ag-scene" potrafił
   zwrócić ciemny ton na białym tle. */
function backdropIsDark(rect: DOMRect) {
  const y = rect.top + rect.height / 2;
  if (y < 0 || y > window.innerHeight) return false;

  let dark = 0;
  let seen = 0;

  for (const f of [0.12, 0.5, 0.88]) {
    const x = rect.left + rect.width * f;

    for (const el of document.elementsFromPoint(x, y)) {
      if (el.closest('.ag-nav, .ag-fab')) continue;

      const parts = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
      if (!parts) continue;
      const alpha = parts.length > 3 ? parseFloat(parts[3]) : 1;
      if (alpha < 0.5) continue; // przezroczyste — patrzymy głębiej

      seen += 1;
      if (luminance(+parts[0], +parts[1], +parts[2]) < DARK_BELOW) dark += 1;
      break;
    }
  }

  return seen > 0 && dark * 2 > seen;
}

function ArrowUp() {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true">
      <path
        d="M7 12V2m0 0L2.5 6.5M7 2l4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [navDark, setNavDark] = useState(true);
  const [fabDark, setFabDark] = useState(true);

  const lastY = useRef(0);
  // mierzymy warstwy pozycjonujące, nie same kafelki — kafelki są przesuwane
  // transformem przy chowaniu, więc ich `getBoundingClientRect` kłamie o tym,
  // co faktycznie leży pod spodem
  const navRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lastY.current = window.scrollY;
    let idle: ReturnType<typeof setTimeout>;

    const readActive = () => {
      const middle = window.innerHeight / 2;
      let current: string | null = null;
      for (const item of nav) {
        const rect = document.getElementById(item.id)?.getBoundingClientRect();
        if (rect && rect.top <= middle && rect.bottom >= middle) {
          current = item.id;
          break;
        }
      }
      setActive(current);
    };

    // przezierne szkło nie ma jednego koloru tekstu dobrego i na ciemnym wideo,
    // i na jasnej stronie — sprawdzamy więc, co realnie leży pod każdym z kafelków
    let lastTone = 0;

    const readTone = (force = false) => {
      const now = performance.now();
      if (!force && now - lastTone < TONE_INTERVAL) return;
      lastTone = now;

      const bar = navRef.current?.getBoundingClientRect();
      if (bar) setNavDark(backdropIsDark(bar));

      const fab = fabRef.current?.getBoundingClientRect();
      if (fab) setFabDark(backdropIsDark(fab));
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY.current) > MOVE_THRESHOLD) {
        lastY.current = y;
        setHidden(true);
      }
      readActive();
      readTone();
      clearTimeout(idle);
      idle = setTimeout(() => {
        setHidden(false);
        readTone(true); // ton na moment powrotu, nie sprzed ostatniego przewinięcia
      }, IDLE_DELAY);
    };

    const onResize = () => readTone(true);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    readActive();
    readTone(true);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      clearTimeout(idle);
    };
  }, []);

  return (
    <>
      <div
        className="ag-nav"
        ref={navRef}
        data-hidden={hidden}
        data-tone={navDark ? 'dark' : 'light'}
      >
        <nav className="ag-nav__bar ag-glass" aria-label="Menu główne">
          <ul className="ag-nav__links">
            <li className="ag-nav__home">
              <a className="ag-nav__link ag-nav__link--icon" href="#top" aria-label="Początek strony">
                <ArrowUp />
              </a>
            </li>

            {nav.map((item) => (
              <li key={item.id}>
                <a
                  className="ag-nav__link"
                  href={`#${item.id}`}
                  aria-current={active === item.id ? 'true' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div
        className="ag-fab"
        ref={fabRef}
        data-hidden={hidden}
        data-tone={fabDark ? 'dark' : 'light'}
      >
        <a className="ag-fab__btn ag-glass" href="#top" aria-label="Wróć na górę strony">
          <ArrowUp />
        </a>
      </div>
    </>
  );
}
