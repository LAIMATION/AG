import type { Metadata } from 'next';
import { Footer } from '@/components/sections';
import { site } from '@/lib/config';

/* Polityka prywatności (art. 13 RODO). Treść oparta na danych z lib/config.ts,
   przed publikacją do zatwierdzenia przez administratora danych. */

export const metadata: Metadata = {
  title: 'Polityka prywatności | ATRIUM Studio Aleksandra Niewińska',
  description: 'Jak ATRIUM Studio Aleksandra Niewińska przetwarza dane osobowe z formularza kontaktowego.',
  alternates: { canonical: '/polityka-prywatnosci' },
};

const { company: c } = site;
const adres = `${c.street}, ${c.postalCode} ${c.city}`;

export default function PolitykaPrywatnosci() {
  return (
    <>
      <main id="tresc" className="ag-section ag-legal">
        <article className="ag-section__wrap ag-legal__wrap">
          <header className="ag-section__head">
            <p className="ag-eyebrow ag-rule">RODO</p>
            <h1 className="ag-h2">Polityka prywatności</h1>
            <p className="ag-lead">
              Tu znajdziesz informacje o tym, co dzieje się z danymi, które podajesz w formularzu
              kontaktowym albo w wiadomości e-mail.
            </p>
          </header>

          <section>
            <h2 className="ag-h3">1. Administrator danych</h2>
            <p>
              Administratorem Twoich danych osobowych jest {c.name}, {adres}, NIP {c.nip}, REGON{' '}
              {c.regon}. We wszystkich sprawach dotyczących danych możesz pisać na{' '}
              <a href={`mailto:${site.email}`}>{site.email}</a> albo dzwonić pod numer{' '}
              <a href={`tel:${site.phoneHref}`}>{site.phone}</a>.
            </p>
          </section>

          <section>
            <h2 className="ag-h3">2. Jakie dane przetwarzam</h2>
            <p>
              Imię i nazwisko, adres e-mail, numer telefonu (jeśli go podasz) oraz treść wiadomości,
              w tym informacje o działce i planowanej inwestycji.
            </p>
          </section>

          <section>
            <h2 className="ag-h3">3. Cel i podstawa prawna</h2>
            <ul>
              <li>
                Odpowiedź na zapytanie i przygotowanie oferty, czyli działania podejmowane na Twoje
                żądanie przed zawarciem umowy (art. 6 ust. 1 lit. b RODO).
              </li>
              <li>
                Prowadzenie korespondencji i ewentualne ustalenie, dochodzenie lub obrona roszczeń,
                czyli prawnie uzasadniony interes administratora (art. 6 ust. 1 lit. f RODO).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="ag-h3">4. Dobrowolność</h2>
            <p>
              Podanie danych jest dobrowolne, ale bez imienia, adresu e-mail i treści wiadomości nie
              da się odpowiedzieć na zapytanie.
            </p>
          </section>

          <section>
            <h2 className="ag-h3">5. Odbiorcy danych</h2>
            <p>
              Dane powierzam wyłącznie dostawcom usług technicznych, bez których strona i poczta nie
              działają:
            </p>
            <ul>
              <li>Vercel Inc.: hosting strony,</li>
              <li>Google LLC: skrzynka e-mail (Gmail), na którą trafiają wiadomości z formularza.</li>
            </ul>
            <p>
              Ci dostawcy mogą przetwarzać dane w Stanach Zjednoczonych. Podstawą przekazania jest
              decyzja Komisji Europejskiej w sprawie programu EU-US Data Privacy Framework, a
              uzupełniająco standardowe klauzule umowne. Danych nie sprzedaję ani nie przekazuję w
              celach marketingowych.
            </p>
          </section>

          <section>
            <h2 className="ag-h3">6. Jak długo przechowuję dane</h2>
            <p>
              Do zakończenia rozmowy o zapytaniu. Jeśli dojdzie do współpracy, przez czas trwania
              umowy, a potem przez okres przedawnienia roszczeń i okres wymagany przepisami
              podatkowymi. Jeśli do współpracy nie dojdzie, korespondencję usuwam najpóźniej po
              roku od ostatniego kontaktu.
            </p>
          </section>

          <section>
            <h2 className="ag-h3">7. Twoje prawa</h2>
            <p>Masz prawo do:</p>
            <ul>
              <li>dostępu do swoich danych i otrzymania ich kopii,</li>
              <li>sprostowania danych,</li>
              <li>usunięcia danych,</li>
              <li>ograniczenia przetwarzania,</li>
              <li>przenoszenia danych,</li>
              <li>sprzeciwu wobec przetwarzania opartego na uzasadnionym interesie.</li>
            </ul>
            <p>
              Wystarczy napisać na <a href={`mailto:${site.email}`}>{site.email}</a>. Masz też prawo
              wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193
              Warszawa, <a href="https://uodo.gov.pl">uodo.gov.pl</a>).
            </p>
          </section>

          <section>
            <h2 className="ag-h3">8. Logi serwera, pliki cookies i pamięć przeglądarki</h2>
            <p>
              Strona nie używa plików cookies, narzędzi analitycznych ani reklamowych. Dostawca
              hostingu zapisuje w logach techniczne dane o połączeniu, takie jak adres IP i rodzaj
              przeglądarki, w celu zapewnienia działania i bezpieczeństwa strony. Wybór jasnego lub
              ciemnego motywu jest zapamiętywany wyłącznie w Twojej przeglądarce i nigdzie nie jest
              wysyłany.
            </p>
          </section>

          <section>
            <h2 className="ag-h3">9. Zautomatyzowane decyzje</h2>
            <p>Dane nie są wykorzystywane do profilowania ani zautomatyzowanego podejmowania decyzji.</p>
          </section>

          <p className="ag-legal__date">Obowiązuje od 24 listopada 2026 r.</p>
        </article>
      </main>
      <Footer />
    </>
  );
}
