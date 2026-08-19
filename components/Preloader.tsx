'use client';

/* Ekran startowy. Zasłania stronę, dopóki hero nie ma czym grać — wideo waży
   kilkanaście MB i bez tego pierwsze sekundy wyglądały jak zawieszony plakat.

   Trzy warunki wyjścia, w tej kolejności:
   1. hero melduje `canplay` ORAZ kroje są gotowe — normalne wyjście,
   2. minimalny czas 700 ms — żeby przy pełnym cache ekran nie mrugnął i nie zniknął,
   3. sufit 7 s — awaria sieci nie może zamknąć nikogo pod zasłoną.

   Renderuje się po stronie serwera, więc jest w pierwszym HTML-u: gdyby montował się
   dopiero na kliencie, przez moment widać by było hero, które ma zasłaniać. */

import { useEffect, useState } from 'react';
import { SCENA_GOTOWA, stanScen } from '@/components/ScrollVideoScene';
import { site } from '@/lib/config';

const MIN_MS = 700;
const SUFIT_MS = 7000;

export function Preloader() {
  const [schodzi, setSchodzi] = useState(false);
  const [zdjety, setZdjety] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let wyszlo = false;

    const zejdz = () => {
      if (wyszlo) return;
      wyszlo = true;
      // dopilnuj dolnej granicy, żeby przy cache'u nie było mignięcia
      const zostalo = Math.max(0, MIN_MS - (performance.now() - start));
      window.setTimeout(() => setSchodzi(true), zostalo);
    };

    let wideo = stanScen.heroGotowe;
    let kroje = false;

    const sprawdz = () => {
      if (wideo && kroje) zejdz();
    };

    const naGotowe = () => {
      wideo = true;
      sprawdz();
    };

    window.addEventListener(SCENA_GOTOWA, naGotowe);
    // `document.fonts` nie ma w starszych silnikach — brak obietnicy nie może blokować
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      kroje = true;
      sprawdz();
    });
    sprawdz(); // hero mogło zdążyć przed tym nasłuchem — efekty dzieci lecą pierwsze

    const sufit = window.setTimeout(zejdz, SUFIT_MS);

    return () => {
      window.removeEventListener(SCENA_GOTOWA, naGotowe);
      window.clearTimeout(sufit);
    };
  }, []);

  /* Zdjęcie z drzewa po zakończonym ruchu liczymy zegarem, nie `transitionend`:
     przy `prefers-reduced-motion` zasłona gaśnie opacity zamiast jechać transformem,
     więc nasłuch na `transform` nigdy by nie odpalił i pusty `inset: 0` zostałby
     na stałe nad stroną, łapiąc wszystkie kliknięcia. */
  useEffect(() => {
    if (!schodzi) return;
    const t = window.setTimeout(() => setZdjety(true), 1000);
    return () => window.clearTimeout(t);
  }, [schodzi]);

  if (zdjety) return null;

  return (
    <div
      className="ag-boot"
      data-schodzi={schodzi || undefined}
      // treść pod spodem jest gotowa i czytelna — to zasłona, nie komunikat,
      // więc czytnik ma ją pominąć zamiast ogłaszać „ładowanie"
      aria-hidden="true"
    >
      <div className="ag-boot__inner">
        <p className="ag-boot__name">{site.name}</p>
        <p className="ag-boot__lockup">
          {site.studio} · {site.region}
        </p>
        <span className="ag-boot__line" />
      </div>
    </div>
  );
}
