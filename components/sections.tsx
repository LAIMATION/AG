/* Sekcje strony. Treść pochodzi z lib/config.ts. */

import Image from 'next/image';
import { ContactForm } from '@/components/ContactForm';
import { ProjectRail } from '@/components/ProjectRail';
import { ScrollVideoScene } from '@/components/ScrollVideoScene';
import { about, contact, cta, hero, manifesto, projects, services, site } from '@/lib/config';

export function Hero() {
  return (
    <ScrollVideoScene id="top" src="/video/wideo-1.mp4" poster="/img/poster-1.jpg" length={3}>
      <div className="ag-scene__panel ag-scene__panel--bottom">
        <div className="ag-shell ag-hero__inner">
          <p className="ag-eyebrow ag-hero__eyebrow ag-rule">{hero.eyebrow}</p>
          <p className="ag-script ag-hero__script">{hero.script}</p>
          <h1 className="ag-hero__title">{hero.title}</h1>
          <p className="ag-hero__scroll">{hero.scroll} ↓</p>
        </div>
      </div>

      <div className="ag-scene__panel">
        <div className="ag-shell ag-hero__inner">
          <div className="ag-hero__row">
            <p className="ag-hero__lead">{hero.lead}</p>
            <a className="ag-btn ag-btn--ghost" href="#kontakt">
              {hero.cta}
            </a>
          </div>
        </div>
      </div>
    </ScrollVideoScene>
  );
}

export function About() {
  return (
    <section className="ag-section" id="o-mnie">
      <div className="ag-section__wrap">
        <div className="ag-section__head">
          <p className="ag-eyebrow ag-rule">{about.eyebrow}</p>
          <h2 className="ag-h2">{about.title}</h2>
        </div>

        <div className="ag-section__body ag-about__grid">
          <div className="ag-about__portrait">
            <Image
              src="/img/aleksandra-gosk.jpg"
              alt={about.photoAlt}
              width={900}
              height={1125}
              sizes="(max-width: 899px) 90vw, 40vw"
              priority
            />
          </div>

          <div className="ag-about__body">
            <div className="ag-about__text">
              {about.paragraphs.map((text) => (
                <p key={text.slice(0, 24)}>{text}</p>
              ))}
            </div>

            <ul className="ag-facts">
              {about.facts.map((fact) => (
                <li key={fact.label}>
                  <span className="ag-fact__value">{fact.value}</span>
                  <span className="ag-fact__label">{fact.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section className="ag-section ag-section--alt" id="uslugi">
      <div className="ag-section__wrap">
        <div className="ag-section__head">
          <p className="ag-eyebrow ag-rule">{services.eyebrow}</p>
          <h2 className="ag-h2">{services.title}</h2>
          <p className="ag-lead">{services.lead}</p>
        </div>

        <ul className="ag-section__body ag-services__list">
          {services.items.map((item) => (
            <li className="ag-service" key={item.no}>
              <span className="ag-service__no">{item.no}</span>
              <h3 className="ag-h3">{item.title}</h3>
              <p className="ag-service__desc">{item.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Manifesto() {
  return (
    <ScrollVideoScene
      src="/video/wideo-2.mp4"
      poster="/img/poster-2.jpg"
      length={3}
      loading="lazy"
      veil="soft"
    >
      <div className="ag-scene__panel">
        <div className="ag-shell ag-manifesto__inner">
          <p className="ag-script ag-manifesto__script">{manifesto.script}</p>
          <blockquote className="ag-manifesto__quote">{manifesto.quote}</blockquote>
          <p className="ag-manifesto__by">{manifesto.attribution}</p>
        </div>
      </div>

      <div className="ag-scene__panel">
        <div className="ag-shell ag-manifesto__inner">
          <p className="ag-manifesto__note">{manifesto.note}</p>
        </div>
      </div>
    </ScrollVideoScene>
  );
}

export function Projects() {
  return (
    <section className="ag-section" id="realizacje">
      <div className="ag-section__wrap">
        <div className="ag-section__head">
          <p className="ag-eyebrow ag-rule">{projects.eyebrow}</p>
          <h2 className="ag-h2">{projects.title}</h2>
          <p className="ag-lead">{projects.lead}</p>
        </div>

        <div className="ag-section__body">
          <ProjectRail />
        </div>
      </div>
    </section>
  );
}

export function CallToAction() {
  return (
    <section className="ag-cta" aria-labelledby="cta-title">
      <div className="ag-shell ag-cta__inner">
        <div>
          <p className="ag-eyebrow ag-rule ag-cta__eyebrow">{cta.eyebrow}</p>
          <h2 className="ag-cta__title" id="cta-title">
            {cta.title}
          </h2>
        </div>

        <div className="ag-cta__side">
          <a className="ag-btn" href="#kontakt">
            {cta.action}
          </a>
          <p className="ag-cta__phone">
            <span className="ag-cta__phone-label">{cta.phoneLabel}</span>
            <a className="ag-cta__phone-value" href={`tel:${site.phoneHref}`}>
              {site.phone}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="ag-section ag-section--alt" id="kontakt">
      <div className="ag-section__wrap">
        <div className="ag-section__head">
          <p className="ag-eyebrow ag-rule">{contact.eyebrow}</p>
          <h2 className="ag-h2">{contact.title}</h2>
        </div>

        <div className="ag-section__body ag-contact__grid">
          <div className="ag-contact__aside">
            <p className="ag-lead">{contact.lead}</p>

            <div className="ag-contact__direct">
              <div className="ag-contact__item">
                <span className="ag-contact__label">Telefon</span>
                <a className="ag-contact__value" href={`tel:${site.phoneHref}`}>
                  {site.phone}
                </a>
              </div>

              <div className="ag-contact__item">
                <span className="ag-contact__label">E-mail</span>
                <a className="ag-contact__value" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </div>

              <div className="ag-contact__item">
                <span className="ag-contact__label">Instagram</span>
                <a
                  className="ag-contact__value"
                  href={site.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {site.instagramHandle}
                </a>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="ag-footer">
      <div className="ag-shell ag-footer__inner">
        {/* lockup w tonacji stopki z systemu: nazwisko na pierwszym planie, studio obok */}
        <span className="ag-footer__lockup">
          {site.name} · {site.studio} · {site.region}
        </span>
        <span>
          © {new Date().getFullYear()} {site.role}
        </span>
      </div>
    </footer>
  );
}
