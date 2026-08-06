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
        <CallToAction />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
