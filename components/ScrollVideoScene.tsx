'use client';

/* Sekcja z wideo sterowanym scrollem.
   Wideo jest sticky i wypełnia ekran przez całą wysokość sekcji, tekst przewija się po nim.
   Postęp scrolla mapuje się na `currentTime` — scroll w dół przewija wideo w przód,
   scroll w górę w tył (ScrollTrigger, scrub).

   Scrub działa niezależnie od szerokości okna — pliki są all-intra 720p, więc seek to
   dekodowanie jednej klatki. Jedyny wyjątek to prefers-reduced-motion: wideo stoi
   na pierwszej klatce. */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  id?: string;
  src: string;
  /** długość sekcji w wysokościach ekranu — ostatni ekran zostaje na samo wideo */
  length: number;
  /** klatki na sekundę pliku — służy do kwantyzacji seeków */
  fps?: number;
  veil?: 'default' | 'soft';
  children: React.ReactNode;
};

export function ScrollVideoScene({ id, src, length, fps = 24, veil = 'default', children }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

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

      /* iOS nie dekoduje wideo, którego nigdy nie odtworzono, a samo `play()`
         przy montowaniu bywa odrzucane bez gestu użytkownika (Low Power Mode,
         Safari → Auto-Play: Never). Dlatego rozgrzewkę ponawiamy przy pierwszym
         dotknięciu ekranu — bez tego telefon pokazuje zamrożony kadr. */
      let unlocked = false;
      const unlock = () => {
        if (unlocked) return;
        const started = video.play();
        if (!started) {
          unlocked = true;
          video.pause();
          return;
        }
        started
          .then(() => {
            unlocked = true;
            video.pause();
            applySeek();
          })
          .catch(() => {});
      };

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

        /* Kluczowe dla telefonu: gdy seek trwa, NIE porzucamy pozycji. Wcześniej
           taka klatka przepadała, a po wyhamowaniu scrolla nie było już żadnego
           `onUpdate`, żeby ją nadgonić — wideo zostawało na starym kadrze. */
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
         niż martwy prostokąt. */
      const guard = window.setTimeout(() => {
        if (video.readyState >= 2) return;
        fellBack = true;
        video.loop = true;
        video.play().catch(() => {});
      }, 3000);

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
        window.clearTimeout(guard);
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('touchstart', unlock);
        video.removeEventListener('seeked', onSeeked);
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
  }, [fps]);

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
          <video ref={videoRef} src={src} muted playsInline preload="auto" />
          <div className="ag-scene__veil" data-veil={veil} />
        </div>
      </div>

      <div className="ag-scene__content">{children}</div>
    </section>
  );
}
