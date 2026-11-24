/* Walidacja formularza kontaktowego. Te same reguły i te same komunikaty
   w przeglądarce (komunikat pod polem) i na serwerze (granica zaufania). */

import { formLimits } from '@/lib/config';

export type Pole = 'imie' | 'email' | 'telefon' | 'wiadomosc';
export type Dane = Record<Pole, string>;

/* Adres: część lokalna bez spacji i „@”, jedno „@”, domena z kropką i końcówką
   z co najmniej dwóch liter (jan@poczta.pl, a nie jan@poczta czy jan@@x.pl).
   Bez dwóch kropek pod rząd i bez kropki na początku albo końcu domeny. */
const EMAIL = /^[^\s@]+@(?!-)[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i;

/* Imię i nazwisko: litery (także polskie i obce), spacje, myślnik, apostrof, kropka.
   Cyfry i linki odpadają, bo w tym polu oznaczają bota albo pomyłkę. */
const IMIE = /^[\p{L}][\p{L}\s.'’-]*$/u;

export const KOMUNIKAT: Record<Pole, string> = {
  imie: `Wpisz imię i nazwisko: same litery, od ${formLimits.imie.min} do ${formLimits.imie.max} znaków.`,
  email: 'Nieprawidłowy adres e-mail. Sprawdź, czy ma „@” i domenę, np. jan@poczta.pl.',
  telefon: 'Nieprawidłowy numer telefonu. Użyj cyfr, spacji i ewentualnie +48.',
  wiadomosc: `Napisz kilka słów, minimum ${formLimits.wiadomosc.min} znaków.`,
};

export function sprawdzPole(pole: Pole, wartosc: string): string | null {
  const v = wartosc.trim();
  switch (pole) {
    case 'imie':
      return v.length >= formLimits.imie.min && v.length <= formLimits.imie.max && IMIE.test(v)
        ? null
        : KOMUNIKAT.imie;
    case 'email':
      return v.length <= formLimits.email.max && EMAIL.test(v) ? null : KOMUNIKAT.email;
    case 'telefon':
      return !v || (v.length <= formLimits.telefon.max && /^\+?[\d\s()-]{7,}$/.test(v))
        ? null
        : KOMUNIKAT.telefon;
    case 'wiadomosc':
      return v.length >= formLimits.wiadomosc.min && v.length <= formLimits.wiadomosc.max
        ? null
        : KOMUNIKAT.wiadomosc;
  }
}

/** Wszystkie błędy naraz: pole → komunikat. Pusty obiekt = dane poprawne. */
export function sprawdz(d: Dane): Partial<Record<Pole, string>> {
  const bledy: Partial<Record<Pole, string>> = {};
  for (const pole of Object.keys(d) as Pole[]) {
    const b = sprawdzPole(pole, d[pole]);
    if (b) bledy[pole] = b;
  }
  return bledy;
}

/* ponytail: samosprawdzenie reguł; uruchom `npx tsx lib/walidacja.ts`, gdy zmieniasz regexy */
if (typeof process !== 'undefined' && process.argv?.[1]?.endsWith('walidacja.ts')) {
  const ok = (p: Pole, v: string) => sprawdzPole(p, v) === null;
  const testy: [boolean, string][] = [
    [ok('email', 'jan@poczta.pl'), 'zwykły adres'],
    [ok('email', 'a.b-c+d@sub.firma.com.pl'), 'adres z kropkami i plusem'],
    [!ok('email', 'janpoczta.pl'), 'bez @'],
    [!ok('email', 'jan@poczta'), 'bez końcówki domeny'],
    [!ok('email', 'jan@@poczta.pl'), 'podwójne @'],
    [!ok('email', 'jan @poczta.pl'), 'spacja'],
    [!ok('email', 'jan@poczta..pl'), 'dwie kropki'],
    [!ok('email', 'jan@poczta.p'), 'końcówka z jednej litery'],
    [ok('imie', 'Anna Kowalska-Nowak'), 'imię z myślnikiem'],
    [ok('imie', "Zoë O'Neil"), 'apostrof i znaki obce'],
    [ok('imie', 'Łucja Żółć'), 'polskie znaki'],
    [!ok('imie', 'A'), 'za krótkie'],
    [!ok('imie', 'Jan123'), 'cyfry'],
    [!ok('imie', 'x'.repeat(61)), 'za długie'],
    [ok('telefon', ''), 'telefon pusty'],
    [ok('telefon', '+48 660 970 375'), 'telefon z +48'],
    [!ok('telefon', 'zadzwoń'), 'telefon bez cyfr'],
    [!ok('wiadomosc', 'krótko'), 'wiadomość za krótka'],
  ];
  const zle = testy.filter(([t]) => !t).map(([, n]) => n);
  console.log(zle.length ? `BŁĘDY: ${zle.join(', ')}` : `OK: ${testy.length} przypadków`);
  if (zle.length) process.exit(1);
}
