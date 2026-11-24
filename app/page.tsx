import {
  About,
  CallToAction,
  Contact,
  Footer,
  Hero,
  Manifesto,
  Projects,
  Services,
} from '@/components/sections';

export default function Page() {
  return (
    <>
      <Hero />
      <main id="tresc">
        <About />
        <Services />
        <Manifesto />
        <Projects />
        {/* Gotowe projekty: schowane do czasu, aż powstaną pierwsze projekty.
            Przywrócenie: <Gotowe /> tutaj + pozycja "gotowe" w `nav` (lib/config.ts). */}
        <CallToAction />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
