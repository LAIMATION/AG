'use client';

/* Sekcja z wideo na pełnym kadrze. Wideo jest sticky i wypełnia ekran przez całą
   wysokość sekcji, tekst przewija się po nim.

   Dwa tryby:

   `loop` (domyślny, aktywny) — wideo leci samo, w tle. Ping-pong (przód, potem tył)
   jest WPISANY W PLIK: za materiałem właściwym idzie ten sam materiał odwrócony,
   więc natywne `loop` odtwarza w kółko tam i z powrotem. Zero JS na klatkach, zero
   seekowania, zero szansy na zacięcie — i pliki mogą być zwykłym GOP-em zamiast
   all-intra, co kupuje budżet na pełne 4K.

   `scrub` (zachowany, nieaktywny) — postęp scrolla mapowany na `currentTime` przez
   ScrollTrigger. Wymaga plików all-intra, inaczej seek wstecz kosztuje dekodowanie
   od poprzedniej klatki kluczowej. Włącza się przez `mode="scrub"`. */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Scena hero melduje gotowość, żeby ekran startowy wiedział, kiedy zejść. */
export const SCENA_GOTOWA = 'ag:scena-gotowa';

/* Efekty dzieci lecą przed efektami rodzica, więc hero potrafi zameldować gotowość,
   zanim ekran startowy zdąży się podpiąć pod zdarzenie. Ta flaga zamyka ten wyścig. */
export const stanScen = { heroGotowe: false };

type Props = {
  id?: string;
  src: string;
  /** pierwsza klatka jako JPEG — widoczna natychmiast, zanim dojdzie wideo */
  poster: string;
  /** długość sekcji w wysokościach ekranu — ostatni ekran zostaje na samo wideo */
  length: number;
  /** klatki na sekundę pliku — kwantyzacja seeków, tylko dla `scrub`. Pliki mają 30. */
  fps?: number;
  /** `lazy` odkłada pobranie pliku, aż scena zbliży się do kadru */
  loading?: 'eager' | 'lazy';
  veil?: 'default' | 'soft';
  mode?: 'loop' | 'scrub';
  children: React.ReactNode;
};

export function ScrollVideoScene({
  id,
  src,
  poster,
  length,
  fps = 30,
  loading = 'eager',
  veil = 'default',
  mode = 'loop',
  children,
}: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* Wideo poniżej pierwszego ekranu nie może startować razem ze stroną — kilkanaście
     MB pobierane od razu to kilkanaście sekund transferu na komórce. Źródło podpinamy
     dopiero, gdy scena zbliży się do kadru na jeden ekran. */
  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video || loading !== 'lazy' || video.src) return;

    /* Zwykły nasłuch scrolla zamiast IntersectionObserver: jeśli obserwator z
       jakiegokolwiek powodu nie zadziała, cała scena zostaje na samym plakacie. */
    const check = () => {
      const rect = root.getBoundingClientRect();
      const zapas = window.innerHeight; // jeden ekran przed wejściem w kadr
      if (rect.top > window.innerHeight + zapas || rect.bottom < -zapas) return;
      window.removeEventListener('scroll', check);
      video.src = src;
      video.load();
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, [loading, src]);

  /* --- Tryb pętli ------------------------------------------------------- */

  useEffect(() => {
    const video = videoRef.current;
    if (!video || mode !== 'loop') return;

    /* Zapętlone tło trwa 16 s i startuje samo, więc podlega WCAG 2.2.2 (Pause, Stop,
       Hide). Przy `reduce` nie odtwarzamy nic — zostaje pierwsza klatka, tak samo jak
       robił to tryb `scrub`.

       Dlatego w JSX NIE MA atrybutu `autoPlay`: renderuje go serwer, więc odtwarzanie
       ruszało, zanim efekt zdążył odczytać media query — zmierzone 0,58 s ruchu u kogoś,
       kto prosił o brak ruchu. Start idzie wyłącznie stąd, przy `canplay`. */
    const bezRuchu = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Odrzucony `play()` to norma, nie awaria: iOS w Low Power Mode i Safari z
       ustawieniem „Auto-Play: Never" nie puszczą startu bez gestu. Stąd ponowienie
       przy pierwszym dotknięciu ekranu. */
    const graj = () => {
      if (bezRuchu) {
        video.pause();
        return;
      }
      if (!video.paused) return;
      video.play().catch(() => {});
    };

    const gotowe = () => {
      graj();
      if (loading === 'lazy') return;
      stanScen.heroGotowe = true;
      window.dispatchEvent(new Event(SCENA_GOTOWA));
    };

    if (video.readyState >= 3) gotowe();
    video.addEventListener('canplay', gotowe);
    // `loadeddata` domyka przypadek, w którym autoplay ruszył, zanim efekt zdążył wejść
    video.addEventListener('loadeddata', graj);
    if (!bezRuchu) {
      window.addEventListener('pointerdown', graj, { passive: true });
      window.addEventListener('touchstart', graj, { passive: true });
    }

    return () => {
      video.removeEventListener('canplay', gotowe);
      video.removeEventListener('loadeddata', graj);
      window.removeEventListener('pointerdown', graj);
      window.removeEventListener('touchstart', graj);
    };
  }, [mode, loading]);

  /* --- Tryb scrub (zachowany, nieaktywny) -------------------------------- */

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video || mode !== 'scrub') return;

    const onMeta = () => ScrollTrigger.refresh();
    video.addEventListener('loadedmetadata', onMeta);

    const mm = gsap.matchMedia();

    // przewijanie klatek scrollem — każda szerokość okna, także dotyk
    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        coarse: '(pointer: coarse)',
      },
      (ctx) => {
        const { motion, coarse } = ctx.conditions as { motion: boolean; coarse: boolean };
        if (!motion) return;

        video.loop = false;

        /* Element `<video>` jest pusty, dopóki nie zdekodowano ani jednej klatki —
           do tego momentu widać `poster`. Pauzujemy więc dopiero po pierwszej
           WYRYSOWANEJ klatce, inaczej przy wolnym łączu zatrzymywaliśmy odtwarzanie,
           zanim cokolwiek trafiło na ekran. */
        const frameGuards: number[] = [];

        const pauseOnFirstFrame = () => {
          const withRvfc = video as HTMLVideoElement & {
            requestVideoFrameCallback?: (cb: () => void) => number;
          };
          const stop = () => {
            if (video.paused) return;
            video.pause();
            applySeek();
          };

          if (typeof withRvfc.requestVideoFrameCallback === 'function') {
            withRvfc.requestVideoFrameCallback(stop);
            /* Bezpiecznik: `requestVideoFrameCallback` nie odpala się, gdy karta nie
               kompozytuje (np. jest w tle). Bez tego wideo grałoby aż do końca. */
            frameGuards.push(window.setTimeout(stop, 300));
            return;
          }
          stop();
        };

        let unlocked = false;
        const unlock = () => {
          if (unlocked) return;
          const started = video.play();
          if (!started) {
            unlocked = true;
            pauseOnFirstFrame();
            return;
          }
          started
            .then(() => {
              unlocked = true;
              pauseOnFirstFrame();
            })
            .catch(() => {});
        };

        /* Gdyby `play()` nie ruszył (polityka autoplay, oszczędzanie danych), samo
           dojście danych nie zawsze wymusza wyrysowanie klatki — drobny seek to robi. */
        const onLoadedData = () => {
          if (video.paused && video.currentTime === 0) video.currentTime = 1 / fps;
        };
        video.addEventListener('loadeddata', onLoadedData);

        let fellBack = false;
        const proxy = { p: 0 };

        const applySeek = () => {
          if (fellBack) return;
          const d = video.duration;
          if (!d || !Number.isFinite(d) || video.readyState < 1) return;

          // przyciągnij do granicy klatki — bez tego lecą seeki w obrębie tej samej
          const step = 1 / fps;
          const target = Math.round(Math.min(proxy.p * d, d - step) / step) * step;
          if (Math.abs(video.currentTime - target) < step / 2) return;

          /* Kluczowe dla telefonu: gdy seek trwa, NIE porzucamy pozycji — po
             wyhamowaniu scrolla nie byłoby już żadnego `onUpdate`, żeby ją nadgonić. */
          if (video.seeking) return;
          video.currentTime = target;
        };

        // po każdym zakończonym seeku dociągamy do aktualnej pozycji scrolla
        const onSeeked = () => applySeek();
        video.addEventListener('seeked', onSeeked);

        unlock();
        window.addEventListener('pointerdown', unlock, { passive: true });
        window.addEventListener('touchstart', unlock, { passive: true });

        /* Gdyby dekoder mimo wszystko nie ruszył, lepiej pokazać zwykłe odtwarzanie
           niż martwy prostokąt.

           Odliczanie startuje od `loadstart`, czyli od chwili, w której przeglądarka
           FAKTYCZNIE ruszyła po plik — nie od montażu komponentu. Przy `loading="lazy"`
           element nie ma w tym momencie jeszcze `src`, więc bezpiecznik liczony od
           montażu wypadał zawsze na pusto, ustawiał `fellBack` i na trwałe zabijał
           scrub tej sceny, choć plik dochodził chwilę później bez zarzutu. */
        let guard = 0;
        const startGuard = () => {
          window.clearTimeout(guard);
          guard = window.setTimeout(() => {
            if (video.readyState >= 2) return;
            fellBack = true;
            video.loop = true;
            video.play().catch(() => {});
          }, 3000);
        };
        if (video.currentSrc || video.src) startGuard();
        video.addEventListener('loadstart', startGuard);

        const tween = gsap.to(proxy, {
          p: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            // na dotyku krótszy scrub — 1.1 s opóźnienia na telefonie czyta się jak awaria
            scrub: coarse ? 0.35 : 1.1,
            invalidateOnRefresh: true,
          },
          onUpdate: applySeek,
        });

        return () => {
          frameGuards.forEach(window.clearTimeout);
          window.clearTimeout(guard);
          window.removeEventListener('pointerdown', unlock);
          window.removeEventListener('touchstart', unlock);
          video.removeEventListener('loadstart', startGuard);
          video.removeEventListener('seeked', onSeeked);
          video.removeEventListener('loadeddata', onLoadedData);
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      },
    );

    // ograniczony ruch — statyczna klatka
    mm.add('(prefers-reduced-motion: reduce)', () => {
      video.pause();
      video.currentTime = 0;
    });

    return () => {
      video.removeEventListener('loadedmetadata', onMeta);
      mm.revert();
    };
  }, [fps, mode]);

  return (
    <section
      id={id}
      className="ag-scene"
      ref={rootRef}
      style={{ '--scene-len': length } as React.CSSProperties}
    >
      {/* sticky o zerowej wysokości — kadr jest w środku, pozycjonowany absolutnie,
          dzięki czemu wideo zostaje przypięte aż do końca sceny */}
      <div className="ag-scene__media" aria-hidden="true">
        <div className="ag-scene__frame">
          <video
            ref={videoRef}
            src={loading === 'lazy' ? undefined : src}
            poster={poster}
            muted
            playsInline
            loop={mode === 'loop'}
            preload={loading === 'lazy' ? 'none' : 'auto'}
          />
          <div className="ag-scene__veil" data-veil={veil} />
        </div>
      </div>

      <div className="ag-scene__content">{children}</div>
    </section>
  );
}
