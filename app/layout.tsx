import type { Metadata, Viewport } from 'next';
import { Montserrat, Playball } from 'next/font/google';
import { Nav } from '@/components/Nav';
import { SmoothScroll } from '@/components/SmoothScroll';
import { site } from '@/lib/config';

import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/layout.css';
import '@/styles/components.css';

/* Jedna rodzina groteskowa w skrajnych wagach niesie cały system;
   krój skryptowy pojawia się wyłącznie jako pojedynczy akcent na fotografii. */
/* Montserrat: krój marki, którego klientka używa we wszystkich materiałach.
   Bez listy wag, bo to krój zmienny: jeden plik obsługuje całą oś 400–900. */
const sans = Montserrat({
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

/* Pora dnia wybierająca motyw przy wejściu (godziny lokalne odwiedzającego). */
const DZIEN_OD = 7;
const NOC_OD = 19;

export const metadata: Metadata = {
  /* bazowy adres dla canonical i bezwzględnych linków do obrazka udostępniania */
  metadataBase: new URL(site.url),
  alternates: { canonical: '/' },
  title: 'Aleksandra Niewińska, architekt | Białystok, Zambrów, Podlasie',
  description:
    'Projektuję domy, budynki wielorodzinne, usługowe, hale, budynki gospodarcze i inwentarskie. Organizacja budowy, nadzór autorski, świadectwa energetyczne, konsultacje. ATRIUM STUDIO, Białystok, Zambrów, Podlasie.',
  openGraph: {
    title: 'Aleksandra Niewińska, architekt',
    description: 'Przestrzeń, która dojrzewa razem z Tobą. ATRIUM STUDIO, Białystok, Zambrów, Podlasie.',
    locale: 'pl_PL',
    type: 'website',
    url: '/',
    siteName: 'ATRIUM Studio Aleksandra Niewińska',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#f5f2ea',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // motyw na <html> ustawia skrypt przed hydracją, więc atrybut celowo różni się od HTML-a z serwera
    <html lang="pl" className={`${sans.variable} ${script.variable}`} suppressHydrationWarning>
      <body>
        {/* Plakat hero NIE jest już wstępnie pobierany. Miał sens, gdy był pierwszą
            rzeczą na ekranie; teraz zasłania go ekran startowy i schodzi dopiero, gdy
            wideo ma czym grać — więc plakat jest wyłącznie awaryjny (nieudane
            dekodowanie 4K). Priorytetowe 140 kB odbierało pasmo plikowi 51 MB. */}
        {/* Motyw nakładany PRZED pierwszym malowaniem. Gdyby ustawiał go dopiero React
            po hydratacji, użytkownik trybu ciemnego dostawałby błysk jasnej strony przy
            każdym wejściu — a zasłona startowa też jest jasna, więc by go nie zakryła.
            Wartość tła musi zgadzać się z `--c-bg` obu motywów.

            Kolejność: ręczny wybór z tej wizyty (sessionStorage, przeżywa odświeżenie,
            znika po zamknięciu karty), a bez niego pora dnia u odwiedzającego: jasny
            od DZIEN_OD do NOC_OD, ciemny poza tym.
            ponytail: stałe godziny zamiast wschodu/zachodu słońca; liczyć astronomicznie,
            gdyby zimowe popołudnia (zmrok ~15:30) raziły jasnym motywem. */}
        <script
          dangerouslySetInnerHTML={{
            __html: [
              'var t;',
              'try{t=sessionStorage.getItem("ag-motyw")}catch(e){}',
              'if(t!=="dark"&&t!=="light"){',
              `var h=new Date().getHours();t=h>=${DZIEN_OD}&&h<${NOC_OD}?"light":"dark"}`,
              'document.documentElement.dataset.motyw=t;',
              'var m=document.querySelector(\'meta[name="theme-color"]\');',
              'if(m)m.setAttribute("content",t==="dark"?"#14202b":"#f5f2ea");',
            ].join(''),
          }}
        />

        {/* Zasłonę zdejmuje JavaScript. Bez niego nie miałby jej kto zdjąć,
            więc przy wyłączonych skryptach w ogóle się nie pokazuje. */}
        <noscript>
          <style>{`.ag-boot { display: none !important; }`}</style>
        </noscript>
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
              name: `${site.name}, ${site.role}`,
              telephone: site.phone,
              email: site.email,
              legalName: site.company.name,
              taxID: site.company.nip,
              address: {
                '@type': 'PostalAddress',
                streetAddress: site.company.street,
                postalCode: site.company.postalCode,
                addressLocality: site.company.city,
                addressCountry: 'PL',
              },
              areaServed: 'Białystok, Zambrów, Podlasie, Polska',
              sameAs: [site.instagram],
            }),
          }}
        />
      </body>
    </html>
  );
}
