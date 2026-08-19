import type { Metadata, Viewport } from 'next';
import { Archivo, Playball } from 'next/font/google';
import { Nav } from '@/components/Nav';
import { SmoothScroll } from '@/components/SmoothScroll';
import { site } from '@/lib/config';

import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/layout.css';
import '@/styles/components.css';

/* Jedna rodzina groteskowa w skrajnych wagach niesie cały system;
   krój skryptowy pojawia się wyłącznie jako pojedynczy akcent na fotografii. */
/* Bez listy wag — Archivo jest krojem zmiennym, więc jeden plik obsługuje całą oś
   400–900. Wyliczanie wag pobierało cztery osobne pliki statyczne. */
const sans = Archivo({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-sans',
});

const script = Playball({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-script',
});

export const metadata: Metadata = {
  title: 'Aleksandra Gosk — architekt | Białystok, Zambrów',
  description:
    'Projektuję każdy rodzaj budynku: domy, budynki wielorodzinne, hale, obory i budynki gospodarcze. Organizacja budowy, świadectwa energetyczne, konsultacje. ATRIUM STUDIO — Białystok, Zambrów.',
  openGraph: {
    title: 'Aleksandra Gosk — architekt',
    description: 'Przestrzeń, która dojrzewa razem z Tobą. ATRIUM STUDIO, Białystok i Zambrów.',
    locale: 'pl_PL',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#f5f2ea',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${sans.variable} ${script.variable}`}>
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
