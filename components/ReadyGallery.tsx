'use client';

/* Galeria biblioteki gotowych projektów.

   Inna niż karuzela Realizacji i celowo: tam treścią jest opowieść o jednym obiekcie,
   więc kafelki płyną, a sąsiednie zostają w kadrze jako kontekst. Tutaj się WYBIERA
   z listy, więc obraz dostaje cały kadr, a reszta zwija się do spisu — jak plansze
   w tece projektowej, ponumerowane i wypisane obok.

   Zdjęcia jeszcze nie istnieją. Płyta bez `foto` pokazuje siatkę kreślarską; z chwilą,
   gdy w `lib/config.ts` pojawi się ścieżka, ten sam kadr wypełnia zdjęcie. Układ,
   proporcje i opis są już na to gotowe — nic w tym pliku nie wymaga wtedy zmiany. */

import { useState } from 'react';
import Image from 'next/image';
import { katalog } from '@/lib/config';

type Plyta = (typeof katalog.plyty)[number] & { foto?: string };

const nr = (i: number) => String(i + 1).padStart(2, '0');

export function ReadyGallery() {
  const [aktywna, setAktywna] = useState(0);
  const plyty = katalog.plyty as readonly Plyta[];
  const plyta = plyty[aktywna];

  return (
    <div className="ag-gal">
      <div className="ag-gal__stage">
        {/* `key` wymusza remount, więc przenikanie startuje od zera przy każdej zmianie */}
        <Kadr key={aktywna} plyta={plyta} indeks={aktywna} />

        {/* Przycisk stoi przy opisie, nie w kolumnie bocznej: tam kolumna wychodziła
            wyższa od sceny i CTA wypadało pod krawędź ekranu po skoku z menu
            (zmierzone: dół przycisku na 911 px przy kadrze 900 px). Tutaj sąsiaduje
            z treścią, do której się odnosi, a obie kolumny mieszczą się w kadrze. */}
        <a className="ag-btn ag-gal__cta" href="#kontakt">
          {katalog.action}
        </a>
      </div>

      <div className="ag-gal__side">
        <nav className="ag-gal__index" aria-label={katalog.indeksLabel}>
          <p className="ag-eyebrow ag-gal__index-label">{katalog.indeksLabel}</p>
          <ol>
            {plyty.map((p, i) => (
              <li key={p.nazwa}>
                <button
                  type="button"
                  className="ag-gal__pick"
                  /* `aria-current`, nie `aria-pressed` — to wybór jednej pozycji ze
                     spisu, a nie przełącznik włącz/wyłącz na każdym przycisku. */
                  aria-current={i === aktywna ? 'true' : undefined}
                  onClick={() => setAktywna(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                      e.preventDefault();
                      setAktywna((n) => (n + 1) % plyty.length);
                    }
                    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                      e.preventDefault();
                      setAktywna((n) => (n - 1 + plyty.length) % plyty.length);
                    }
                  }}
                >
                  <span className="ag-gal__pick-no">{nr(i)}</span>
                  <span className="ag-gal__pick-name">{p.nazwa}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="ag-gal__state">
          <p className="ag-gal__state-label">{katalog.stanLabel}</p>
          <p className="ag-gal__state-text">{katalog.stanText}</p>
        </div>
      </div>
    </div>
  );
}

/* Wejście kadru robi CSS, nie GSAP — świadomie.

   `gsap.fromTo` ustawia stan początkowy natychmiast, a do końcowego dochodzi dopiero
   tickerem. Jeśli ticker z jakiegokolwiek powodu nie ruszy, płyta zostaje na
   `opacity: 0`, czyli główna treść sekcji jest NIEWIDOCZNA. Animacja CSS nie ma tego
   trybu awarii: stanem bazowym elementu jest pełna widoczność, a animacja tylko go
   poprzedza. Przy `prefers-reduced-motion` globalna reguła i tak ścina ją do 1 ms. */
function Kadr({ plyta, indeks }: { plyta: Plyta; indeks: number }) {
  return (
    <figure className="ag-gal__plate">
      <div className="ag-gal__frame" data-pusta={plyta.foto ? undefined : 'true'}>
        {plyta.foto ? (
          <Image
            src={plyta.foto}
            alt={`${plyta.nazwa} — wizualizacja`}
            fill
            sizes="(max-width: 899px) 92vw, 62vw"
          />
        ) : null}
        <span className="ag-gal__plate-no">{nr(indeks)}</span>
      </div>

      {/* Zmiana płyty jest wywołana kliknięciem, ale czytnik nie zobaczy podmiany treści
          poza obszarem fokusa — stąd grzeczne ogłoszenie samej nazwy. */}
      <figcaption className="ag-gal__caption">
        <h3 className="ag-h3" aria-live="polite">
          {plyta.nazwa}
        </h3>
        <p className="ag-gal__desc">{plyta.opis}</p>
      </figcaption>
    </figure>
  );
}
