import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import { Nav } from '@/components/Nav';
import { SmoothScroll } from '@/components/SmoothScroll';
import { site } from '@/lib/config';

import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/layout.css';
import '@/styles/components.css';

const display = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400'],
  display: 'swap',
  variable: '--font-display',
});

const sans = Jost({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Aleksandra Gosk — architekt | Zambrów, Białystok',
  description:
    'Projekty architektoniczne domów i budynków, organizacja budowy, świadectwa energetyczne i konsultacje. Zambrów, Białystok i okolice.',
  openGraph: {
    title: 'Aleksandra Gosk — architekt',
    description: 'Architektura i organizacja budowy. Zambrów, Białystok.',
    locale: 'pl_PL',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#f6f3ee',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${display.variable} ${sans.variable}`}>
      <body>
        {/* plakat hero to pierwsza rzecz, jaką widać — React 19 wynosi ten link do <head> */}
        <link rel="preload" as="image" href="/img/poster-1.jpg" />
        <a className="ag-skip" href="#tresc">
          Przejdź do treści
        </a>
        <SmoothScroll />
        <Nav />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: `${site.name} — ${site.role}`,
              telephone: site.phone,
              email: site.email,
              areaServed: 'Zambrów, Białystok, Polska',
              sameAs: [site.instagram],
            }),
          }}
        />
      </body>
    </html>
  );
}
