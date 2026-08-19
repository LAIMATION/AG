/* Jedyne źródło treści i danych kontaktowych.
   Narracja na „Ty". Na pierwszym planie Aleksandra Gosk, ATRIUM STUDIO w drugim. */

export const site = {
  name: 'Aleksandra Gosk',
  role: 'Architekt',
  studio: 'ATRIUM STUDIO',
  region: 'Białystok · Zambrów',
  // TODO: podmienić na prawdziwy numer telefonu
  phone: '+48 000 000 000',
  phoneHref: '+48000000000',
  email: 'aleksandragosk.arch@gmail.com',
  instagram: 'https://www.instagram.com/architekt_gosk_aleksandra/',
  instagramHandle: '@architekt_gosk_aleksandra',
} as const;

export const nav = [
  { id: 'o-mnie', label: 'O mnie' },
  { id: 'uslugi', label: 'Zakres' },
  { id: 'realizacje', label: 'Realizacje' },
  { id: 'kontakt', label: 'Kontakt' },
] as const;

export const hero = {
  eyebrow: 'Architekt · Białystok, Zambrów',
  title: 'Aleksandra Gosk',
  script: 'Przestrzeń, która dojrzewa razem z Tobą',
  lead:
    'Projektuję budynki dopasowane do ludzi, którzy w nich mieszkają i pracują — domy, budynki wielorodzinne, usługowe, hale, obory i budynki gospodarcze.',
  cta: 'Napisz do mnie',
  scroll: 'Przewiń',
} as const;

export const about = {
  eyebrow: 'O mnie',
  title: 'Zaczynamy od tego, jak chcesz żyć',
  paragraphs: [
    'Nazywam się Aleksandra Gosk i projektuję budynki. Zanim cokolwiek narysuję, pytam, jak wygląda Twój zwykły dzień — bo z tego, a nie z modnego rzutu, wychodzi dom, w którym da się wygodnie mieszkać przez lata.',
    'Prowadzę Cię przez cały proces: od oceny działki i warunków zabudowy, przez projekt i pozwolenie, po koordynację prac na budowie. Masz jeden kontakt zamiast łańcucha pośredników i wiesz, na jakim etapie jesteś.',
    'Pracuję pod szyldem ATRIUM STUDIO, kameralnie, przy ograniczonej liczbie projektów naraz. Dzięki temu każdy dostaje tyle uwagi, ile faktycznie potrzebuje.',
  ],
  facts: [
    { value: 'Białystok · Zambrów', label: 'Obszar działania' },
    { value: 'Projekt i budowa', label: 'Pełen zakres prowadzenia' },
    { value: 'Kameralnie', label: 'Ograniczona liczba projektów' },
  ],
  photoAlt: 'Aleksandra Gosk — architekt',
} as const;

export const services = {
  eyebrow: 'Zakres',
  title: 'Projektuję każdy rodzaj budynku',
  lead:
    'Dom jednorodzinny, blok, hala, obora czy budynek gospodarczy — proces jest ten sam, zmienia się tylko to, co budynek ma robić.',
  items: [
    {
      no: '01',
      title: 'Budynki mieszkalne',
      desc: 'Domy jednorodzinne, bliźniaki, zabudowa szeregowa i budynki wielorodzinne. Od koncepcji, przez projekt budowlany i techniczny, po komplet dokumentacji do pozwolenia.',
    },
    {
      no: '02',
      title: 'Rolnictwo i gospodarka',
      desc: 'Obory, chlewnie, stodoły, wiaty, magazyny i budynki gospodarcze. Znam wymagania, jakie stawiają im przepisy — i to, że mają przede wszystkim działać, a nie ładnie wyglądać na wizualizacji.',
    },
    {
      no: '03',
      title: 'Usługi, produkcja, hale',
      desc: 'Budynki usługowe, warsztaty, hale produkcyjne i magazynowe. Projekt liczony pod realny sposób użytkowania, koszt budowy i późniejszą eksploatację.',
    },
    {
      no: '04',
      title: 'Organizacja budowy',
      desc: 'Koordynacja branż i wykonawców, harmonogram, kontrola zgodności realizacji z projektem. Prowadzę inwestycję także wtedy, gdy nie możesz być na budowie.',
    },
    {
      no: '05',
      title: 'Świadectwa energetyczne',
      desc: 'Charakterystyka i świadectwa energetyczne budynków — do odbioru, sprzedaży lub wynajmu, razem z wyjaśnieniem, co z wyniku realnie wynika.',
    },
    {
      no: '06',
      title: 'Konsultacje',
      desc: 'Ocena działki, warunków zabudowy i MPZP, weryfikacja gotowego projektu, doradztwo przed zakupem. Jedno spotkanie potrafi oszczędzić miesiące.',
    },
  ],
} as const;

export const manifesto = {
  script: 'Wygoda na lata',
  quote: 'Dobry budynek nie zwraca na siebie uwagi. Po prostu działa — i za dziesięć lat nadal jest wygodny.',
  attribution: 'Aleksandra Gosk · ATRIUM STUDIO',
  note: 'Projekt, pozwolenie, budowa — jeden proces i jedna osoba odpowiedzialna za jego przebieg.',
} as const;

export const projects = {
  eyebrow: 'Realizacje',
  title: 'Wybrane projekty',
  lead: 'Galeria w przygotowaniu — poniżej układ, w którym pojawią się zdjęcia zrealizowanych obiektów.',
  items: [
    {
      title: 'Dom pod lasem',
      meta: 'Podlaskie · 2024 · projekt i nadzór',
      desc: 'Dom dla rodziny, która chciała mieszkać blisko lasu, ale nie w cieniu. Bryła odsunięta od granicy drzew, salon otwarty na południe.',
    },
    {
      title: 'Obora wolnostanowiskowa',
      meta: 'Zambrów · 2024 · projekt budowlany',
      desc: 'Sto stanowisk, wentylacja kalenicowa, ciągi komunikacyjne policzone pod realną obsługę stada. Projekt liczony kosztem eksploatacji, nie efektem.',
    },
    {
      title: 'Budynek wielorodzinny',
      meta: 'Białystok · 2023 · koncepcja',
      desc: 'Osiemnaście mieszkań na działce, na której miało się zmieścić dwanaście. Rozwiązane układem klatki i doświetleniem od dwóch stron.',
    },
    {
      title: 'Hala magazynowa',
      meta: 'Podlaskie · 2023 · projekt i koordynacja',
      desc: 'Konstrukcja stalowa z zapasem na przyszłą rozbudowę o dwa pola. Wjazd i plac manewrowy ustawione pod naczepy, nie pod rysunek.',
    },
    {
      title: 'Rozbudowa siedliska',
      meta: 'Łomża · 2022 · projekt budowlany',
      desc: 'Stary budynek gospodarczy podpięty do nowej części mieszkalnej. Zachowana bryła i mur, zmieniona funkcja.',
    },
    {
      title: 'Dom minimalny',
      meta: 'Podlaskie · 2022 · koncepcja',
      desc: 'Osiemdziesiąt metrów, w których nie ma ani jednego metra korytarza. Budżet był sztywny, więc metraż pracował na każdy złoty.',
    },
  ],
} as const;

export const cta = {
  eyebrow: 'Zacznijmy',
  title: 'Pierwsza rozmowa jest bezpłatna i konkretna',
  action: 'Napisz wiadomość',
  phoneLabel: 'albo zadzwoń',
} as const;

export const contact = {
  eyebrow: 'Kontakt',
  title: 'Napisz, co chcesz zbudować',
  lead:
    'Opisz działkę i etap, na jakim jesteś — nawet jeśli to dopiero pomysł. Odpowiadam zwykle w ciągu jednego dnia roboczego.',
} as const;

/* Limity pól formularza. Jedno źródło dla klienta i serwera — `maxLength` w przeglądarce
   to wygoda, nie zabezpieczenie: żądanie da się wysłać z pominięciem formularza,
   więc te same progi obowiązują w `app/api/kontakt/route.ts`. */
export const formLimits = {
  imie: { min: 2, max: 80 },
  email: { max: 254 }, // RFC 5321: maksymalna długość adresu
  telefon: { max: 24 },
  wiadomosc: { min: 10, max: 1500 },
} as const;
