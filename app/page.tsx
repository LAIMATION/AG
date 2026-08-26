import {
  About,
  CallToAction,
  Contact,
  Footer,
  Gotowe,
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
        <Gotowe />
        <CallToAction />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
