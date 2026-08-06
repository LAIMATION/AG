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
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      video.loop = false;
      // rozgrzewka dekodera: bez jednego play() Safari potrafi nie wyrenderować
      // pierwszej klatki i wideo stoi mimo poprawnych seeków
      const primed = video.play();
      if (primed) primed.then(() => video.pause()).catch(() => {});
      else video.pause();

      const proxy = { p: 0 };

      const tween = gsap.to(proxy, {
        p: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.1,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          const d = video.duration;
          if (!d || !Number.isFinite(d) || video.readyState < 1 || video.seeking) return;
          // przyciągnij do granicy klatki — bez tego lecą seeki w obrębie tej samej klatki
          const step = 1 / fps;
          const raw = Math.min(proxy.p * d, d - step);
          const t = Math.round(raw / step) * step;
          if (Math.abs(video.currentTime - t) >= step / 2) video.currentTime = t;
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

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
