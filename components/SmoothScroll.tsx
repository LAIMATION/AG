'use client';

/* Płynny scroll strony (Lenis) spięty z GSAP ScrollTriggerem.
   Bez tego pojedyncze kliknięcie kółka to skok o ~100 px — tekst i klatki wideo
   przeskakują zamiast płynąć. Lenis interpoluje te skoki, a scrub w scenach
   dostaje ciągły strumień pozycji zamiast schodków. */

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (!reduced) {
      /* `lerp`, nie `duration` + `easing`.

         Tryb `duration` to animacja o ustalonej długości: każde drgnięcie kółka
         startuje od nowa 1,15-sekundowy przebieg do nowego celu. Przy szybkim
         kręceniu kolejne przebiegi nadpisują się nawzajem, prędkość urywa się na
         każdym starcie i wychodzi z tego pływanie z opóźnieniem — nie gładkość.

         `lerp` to wygładzanie wykładnicze: co klatkę pokonujemy ułamek dystansu,
         jaki został do celu. Nowe zdarzenie nie przerywa niczego, tylko przesuwa
         cel — ruch jest ciągły i zawsze liczony od pozycji AKTUALNIE na ekranie,
         więc nie ma ani skoku, ani ściany prędkości przy zmianie kierunku.
         Lenis 1.x normalizuje `lerp` czasem klatki, więc 144 Hz nie przewija
         szybciej niż 60 Hz.

         Dwa pokrętła robią tu RÓŻNE rzeczy i mylenie ich to główny powód, dla
         którego gładki scroll wychodzi „lagujący":

         `lerp` — jak szybko dojeżdżamy do celu, i to ONO odpowiada za wrażenie lagu.
         Wygładzanie wykładnicze ma długi ogon: przy 0,09 pojedynczy klik sunął
         jeszcze ~0,6 s po tym, jak kółko już stanęło. Ruch trwający dłużej niż
         wywołujący go gest nie czyta się jako gładki, tylko jako spóźniony — i to
         on sprawia, że krok wygląda na „wielki skok", bo widać całą jego drogę.
         0,14 skraca dojazd do ~0,33 s.

         `wheelMultiplier` — DYSTANS na kliknięcie, zupełnie osobna sprawa. Kusi,
         żeby go ściąć, ale strona ma 10,5 ekranu (6 z tego to dwie przypięte sceny
         wideo). Zmierzone: 0,9 to 105 kliknięć do końca, 0,7 już 135. 0,8 ścina
         krok do ~80 px kosztem ~13 kliknięć i to jest cała rozsądna rezerwa.

         Gdyby dalej było ospale, kręcić `lerp` (0,16–0,18), nie mnożnikiem —
         mnożnik w dół robi stronę mozolną, nie gładką. */
      lenis = new Lenis({
        lerp: 0.14,
        smoothWheel: true,
        wheelMultiplier: 0.8,
        touchMultiplier: 1.4,
      });

      lenis.on('scroll', ScrollTrigger.update);

      const instance = lenis;
      tick = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // Kotwice z menu obsługujemy sami — także przy wyłączonym Lenisie, żeby oba tryby
    // lądowały identycznie.
    //
    // Celujemy w nagłówek sekcji, nie w jej krawędź: sekcje mają `--section-y` górnego
    // paddingu (~140 px na desktopie), więc równanie do krawędzi zostawiało treść
    // zepchniętą nisko pod pustym pasem. Nagłówek siada tuż pod paskiem nawigacji
    // (`scroll-padding-top`), a `Math.max` pilnuje, żeby przy tym nigdy nie wjechał
    // w kadr skrawek poprzedniej sekcji.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href')!.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();

      const sectionTop = target.getBoundingClientRect().top + window.scrollY;
      let top = sectionTop;

      // Sekcje z kartą to pełnoekranowe slajdy z wyśrodkowaną kartą — wystarczy
      // zrównać górę slajdu z górą ekranu, żeby w kadrze została sama karta.
      // Reszta kotwic celuje w nagłówek, żeby nie lądować pod pustym paddingiem.
      if (!target.querySelector('.ag-card')) {
        const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
        const head = target.querySelector<HTMLElement>('.ag-section__head') ?? target;
        top = Math.max(sectionTop, head.getBoundingClientRect().top + window.scrollY - pad);
      }

      /* Skok z menu to ruch ZAKOMENDEROWANY, nie gest — tu ustalony czas jest na
         miejscu i `lerp` z konstruktora go nie dotyczy.

         Czas MUSI zależeć od dystansu. Stałe 1,2 s dawało 750 px/s przy skoku do
         sąsiedniej sekcji i 7800 px/s przy skoku przez całą stronę — dziesięciokrotna
         różnica charakteru ruchu pod tym samym kliknięciem. Pierwiastek trzyma
         długie skoki w ryzach, zamiast skalować czas wprost proporcjonalnie. */
      const dystans = Math.abs(top - window.scrollY);
      const czas = Math.min(1.6, Math.max(0.7, 0.45 + 0.011 * Math.sqrt(dystans)));

      if (lenis) {
        lenis.scrollTo(top, {
          duration: czas,
          /* Rozbieg ORAZ wyhamowanie. Poprzednia krzywa (`expo.out`) startowała ze
             szczytową prędkością — 6,9× średniej w pierwszej klatce — i nie miała
             fazy rozbiegu w ogóle, a potem pełzła: ostatnie 10% drogi zajmowało jej
             67% czasu. To czyta się jako zwłoka, nie jako hamowanie.

             `smootherstep` rusza i kończy z prędkością ZERO i z zerowym
             przyspieszeniem, więc ani start, ani ląd niczym nie szarpie. Skos
             `t^0.85` przesuwa szczyt prędkości na t = 0,42: rozbieg dostaje 42%
             czasu, wyhamowanie 58%. Szczyt to tylko 1,8× średniej zamiast 6,9×. */
          easing: (t: number) => {
            const w = Math.pow(t, 0.85);
            return w * w * w * (w * (w * 6 - 15) + 10);
          },
          /* Zablokowane wejście na czas przelotu. Świadomy wyjątek od zasady
             „nigdy nie odbieraj sterowania": to komenda z konkretnym celem, nie gest,
             a przy 10,5 ekranu strony walka scrolla z animacją kończy się lądowaniem
             w losowym miejscu. Górny limit 1,6 s trzyma tę blokadę w rozsądku. */
          lock: true,
        });
      } else window.scrollTo({ top });
    };

    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      if (tick) {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
      }
      lenis?.destroy();
    };
  }, []);

  return null;
}
