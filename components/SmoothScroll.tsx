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

         0,09 daje stałą czasową ~0,19 s. Niżej robi się ślisko i traci kontakt
         z kółkiem, wyżej wraca schodkowanie. */
      lenis = new Lenis({
        lerp: 0.09,
        smoothWheel: true,
        wheelMultiplier: 0.9,
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
         miejscu i `lerp` z konstruktora go nie dotyczy. Krzywa podana wprost, bo po
         wyrzuceniu `easing` z konstruktora `scrollTo` brałby domyślną z biblioteki.
         Wykładnicza, nie sześcienna: przy skoku przez pół strony mocniej wyhamowuje
         na końcu, więc sekcja „dojeżdża", a nie „dobija". */
      if (lenis) {
        lenis.scrollTo(top, {
          duration: 1.2,
          easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
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
