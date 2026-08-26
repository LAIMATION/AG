'use client';

/* Przełącznik motywu. Renderowany wewnątrz pływającej warstwy `.ag-fab`, więc dziedziczy
   po niej pozycję, matowe szkło, chowanie przy scrollu i wykrywanie tonacji tła —
   zero powielonej mechaniki.

   Wybór trzyma `localStorage` i nakłada go skrypt w `app/layout.tsx`, wykonywany PRZED
   pierwszym malowaniem. Gdyby motyw ustawiał dopiero React po hydratacji, użytkownik
   trybu ciemnego dostawałby błysk jasnej strony przy każdym wejściu. */

import { useEffect, useState } from 'react';

export const KLUCZ_MOTYWU = 'ag-motyw';

type Motyw = 'light' | 'dark';

/* Pasek adresu na mobile barwi się tym meta-tagiem — bez tego w trybie ciemnym
   zostaje kremowy i odcina się od strony. Wartości muszą zgadzać się z `--c-bg`. */
const TLO: Record<Motyw, string> = { light: '#f5f2ea', dark: '#14202b' };

function Slonce() {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M7 1.1v1.3M7 11.6v1.3M1.1 7h1.3M11.6 7h1.3M2.9 2.9l.9.9M10.2 10.2l.9.9M11.1 2.9l-.9.9M3.8 10.2l-.9.9"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Ksiezyc() {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true">
      <path
        d="M11.6 8.7A5.3 5.3 0 0 1 5.3 2.4 5.3 5.3 0 1 0 11.6 8.7Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ThemeToggle() {
  /* Start zawsze z `light`, a prawdziwy stan dociągamy po zamontowaniu. Serwer nie zna
     `localStorage`, więc każde zgadywanie tutaj kończy się rozjazdem z HTML-em
     wyrenderowanym po jego stronie. Sam motyw jest już na `<html>` przed malowaniem —
     ten stan steruje wyłącznie ikoną i etykietą. */
  const [motyw, setMotyw] = useState<Motyw>('light');

  useEffect(() => {
    setMotyw(document.documentElement.dataset.motyw === 'dark' ? 'dark' : 'light');
  }, []);

  const przelacz = () => {
    const nowy: Motyw = motyw === 'dark' ? 'light' : 'dark';
    setMotyw(nowy);
    document.documentElement.dataset.motyw = nowy;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', TLO[nowy]);
    try {
      localStorage.setItem(KLUCZ_MOTYWU, nowy);
    } catch {
      /* tryb prywatny albo zablokowane dane witryny — motyw działa, po prostu się nie zapamięta */
    }
  };

  const naCiemny = motyw !== 'dark';

  return (
    <button
      type="button"
      className="ag-fab__btn ag-glass"
      onClick={przelacz}
      /* Etykieta mówi, co się STANIE po kliknięciu, nie jaki jest stan teraz —
         `aria-pressed` byłoby tu mylące, bo to nie włącznik jednej rzeczy,
         tylko przełącznik między dwoma równorzędnymi motywami. */
      aria-label={naCiemny ? 'Włącz tryb ciemny' : 'Włącz tryb jasny'}
      title={naCiemny ? 'Tryb ciemny' : 'Tryb jasny'}
    >
      {naCiemny ? <Ksiezyc /> : <Slonce />}
    </button>
  );
}
