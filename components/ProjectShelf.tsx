'use client';

/* Regał realizacji.

   Trzeci sposób prezentacji na stronie i celowo różny od dwóch pozostałych:

   - karuzela (poprzednia wersja tej sekcji) — kafelki płyną, sąsiedzi w kadrze,
   - galeria „Gotowych projektów" — jeden duży kadr plus spis w kolumnie obok,
   - regał (tu) — wszystkie płyty widoczne naraz, wybrana rozsuwa się w miejscu.

   Metafora jest z warsztatu: sześć plansz stoi obok siebie jak grzbiety teczek na
   półce, z tytułem czytanym pionowo. Wybrana wysuwa się i obraca tytuł do poziomu —
   tak jak wyciągniętą teczkę odwraca się przodem do siebie.

   Zdjęć jeszcze nie ma i to nie szkodzi: regał bez nich jest kompletny, bo niesie go
   typografia i podział na płyty, a nie obraz. Gdy w `lib/config.ts` pojawi się `foto`,
   wypełni płytę, a tekst dostanie przyciemnienie. Nic tutaj nie wymaga wtedy zmiany. */

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { projects } from '@/lib/config';

type Realizacja = (typeof projects.items)[number] & { foto?: string };

const nr = (i: number) => String(i + 1).padStart(2, '0');

export function ProjectShelf() {
  const [aktywna, setAktywna] = useState(0);
  const plyty = projects.items as readonly Realizacja[];

  /* Kliknięcie w otwartą płytę ją ZAMYKA (`-1` = żadna nie jest wybrana). Wcześniej
     wybór szedł też za kursorem — i to się wykluczało z zamykaniem: zamknięta płyta
     natychmiast otwierała się z powrotem, bo kursor wciąż nad nią stał. Najazd
     kursorem tylko podświetla tytuł, wybór jest kliknięciem. */
  const przelacz = useCallback((i: number) => {
    setAktywna((n) => (n === i ? -1 : i));
  }, []);

  const klawisz = useCallback(
    (e: React.KeyboardEvent) => {
      const krok = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (!krok) return;
      e.preventDefault();
      setAktywna((n) => (n + krok + plyty.length) % plyty.length);
    },
    [plyty.length],
  );

  return (
    <div className="ag-shelf" role="group" aria-label={projects.title}>
      {plyty.map((p, i) => {
        const czynna = i === aktywna;
        return (
          <button
            type="button"
            key={p.title}
            className="ag-shelf__plate"
            data-czynna={czynna || undefined}
            data-pusta={p.foto ? undefined : 'true'}
            aria-expanded={czynna}
            onClick={() => przelacz(i)}
            onKeyDown={klawisz}
          >
            {p.foto ? (
              <Image
                src={p.foto}
                alt={`${p.title} — ${p.meta}`}
                fill
                sizes="(max-width: 899px) 92vw, 45vw"
                className="ag-shelf__foto"
              />
            ) : null}

            <span className="ag-shelf__no">{nr(i)}</span>

            <span className="ag-shelf__body">
              <span className="ag-shelf__title">{p.title}</span>

              {/* Meta i opis są w drzewie zawsze — chowa je przezroczystość, nie
                  `display`, żeby szerokość płyty nie skakała w trakcie rozsuwania.
                  `aria-hidden` na nieczynnej płycie, bo wizualnie jej tu nie ma. */}
              <span className="ag-shelf__detail" aria-hidden={czynna ? undefined : 'true'}>
                <span className="ag-shelf__meta">{p.meta}</span>
                <span className="ag-shelf__desc">{p.desc}</span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
