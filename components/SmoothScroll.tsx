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
      lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
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

      if (lenis) lenis.scrollTo(top, { duration: 1.2, lock: true });
      else window.scrollTo({ top });
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
