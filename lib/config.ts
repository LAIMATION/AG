/* Jedyne źródło danych kontaktowych i treści sekcji.
   Zmiana tekstów na stronie = zmiana w tym pliku. */

export const site = {
  name: 'Aleksandra Gosk',
  role: 'Architekt',
  tagline: 'Architektura · Organizacja budowy',
  region: 'Zambrów · Białystok · Polska',
  // TODO: podmienić na prawdziwy numer telefonu
  phone: '+48 000 000 000',
  phoneHref: '+48000000000',
  email: 'aleksandragosk.arch@gmail.com',
  instagram: 'https://www.instagram.com/architekt_gosk_aleksandra/',
  instagramHandle: '@architekt_gosk_aleksandra',
} as const;

export const nav = [
  { id: 'o-mnie', label: 'O mnie' },
  { id: 'uslugi', label: 'Usługi' },
  { id: 'realizacje', label: 'Realizacje' },
  { id: 'kontakt', label: 'Kontakt' },
] as const;

export const hero = {
  eyebrow: 'Architekt · Zambrów, Białystok',
  title: 'Aleksandra Gosk',
  lead:
    'Projektuję domy i budynki, które starzeją się dobrze — spokojne w formie, przemyślane w detalu, wygodne w codziennym użytkowaniu.',
  cta: 'Porozmawiajmy o projekcie',
  scroll: 'Przewiń',
} as const;

export const about = {
  eyebrow: 'O mnie',
  title: 'Architektura zaczyna się od rozmowy',
  paragraphs: [
    'Nazywam się Aleksandra Gosk. Jestem architektem — projektuję budynki i prowadzę inwestorów przez cały proces: od pierwszego szkicu i warunków zabudowy, przez pozwolenie na budowę, aż po koordynację prac na budowie.',
    'Pracuję kameralnie, przy ograniczonej liczbie projektów jednocześnie. Dzięki temu każdy z nich dostaje uwagę, na jaką zasługuje — a Państwo mają jeden, stały kontakt zamiast łańcucha pośredników.',
    'Najbardziej zależy mi na tym, żeby budynek działał: dobrze ustawiony na działce, zgodny z przepisami, ekonomiczny w budowie i eksploatacji. Reszta — proporcje, światło, materiał — wynika z tych decyzji.',
  ],
  facts: [
    { value: 'Zambrów · Białystok', label: 'Obszar działania' },
    { value: 'Projekt · Budowa', label: 'Pełen zakres prowadzenia' },
    { value: 'Kameralnie', label: 'Ograniczona liczba projektów' },
  ],
  photoAlt: 'Aleksandra Gosk — architekt',
} as const;

export const services = {
  eyebrow: 'Usługi',
  title: 'Zakres współpracy',
  lead: 'Cztery obszary, które najczęściej łączą się w jeden proces — od pomysłu do odbioru budynku.',
  items: [
    {
      no: '01',
      title: 'Projekty architektoniczne',
      desc: 'Domy jednorodzinne i budynki usługowe. Koncepcja, projekt budowlany, projekt techniczny oraz komplet dokumentacji do pozwolenia na budowę.',
    },
    {
      no: '02',
      title: 'Organizacja budowy',
      desc: 'Koordynacja branż i wykonawców, harmonogram, kontrola zgodności realizacji z projektem. Prowadzę inwestycję także wtedy, gdy nie mogą Państwo być na budowie.',
    },
    {
      no: '03',
      title: 'Świadectwa energetyczne',
      desc: 'Charakterystyka i świadectwa energetyczne budynków — do odbioru, sprzedaży lub wynajmu, wraz z wyjaśnieniem, co realnie wynika z wyniku.',
    },
    {
      no: '04',
      title: 'Konsultacje architektoniczne',
      desc: 'Ocena działki, warunków zabudowy i MPZP, weryfikacja gotowego projektu, doradztwo przed zakupem. Jedno spotkanie potrafi oszczędzić miesiące.',
    },
  ],
} as const;

export const manifesto = {
  quote: 'Dobry budynek nie zwraca na siebie uwagi. Po prostu działa — i wygląda tak samo dobrze za dziesięć lat.',
  attribution: 'Aleksandra Gosk',
  note: 'Projekt, pozwolenie, budowa — jeden proces i jedna osoba odpowiedzialna za jego przebieg.',
} as const;

export const projects = {
  eyebrow: 'Realizacje',
  title: 'Wybrane projekty',
  lead: 'Galeria w przygotowaniu — poniżej układ, w którym pojawią się zdjęcia zrealizowanych obiektów.',
  items: [
    { title: 'Dom pod lasem', meta: 'Podlaskie · 2024 · projekt i nadzór', ratio: 'tall' },
    { title: 'Stodoła współczesna', meta: 'Zambrów · 2024 · projekt budowlany', ratio: 'wide' },
    { title: 'Dom z patio', meta: 'Białystok · 2023 · koncepcja', ratio: 'wide' },
    { title: 'Budynek usługowy', meta: 'Podlaskie · 2023 · projekt i koordynacja', ratio: 'tall' },
    { title: 'Rozbudowa siedliska', meta: 'Łomża · 2022 · projekt budowlany', ratio: 'wide' },
    { title: 'Dom minimalny', meta: 'Podlaskie · 2022 · koncepcja', ratio: 'tall' },
  ],
} as const;

export const cta = {
  title: 'Porozmawiajmy o Państwa projekcie',
  action: 'Napisz wiadomość',
  phoneLabel: 'lub proszę zadzwonić',
} as const;

export const contact = {
  eyebrow: 'Kontakt',
  title: 'Zacznijmy od rozmowy',
  lead:
    'Proszę napisać kilka zdań o działce i etapie, na jakim są Państwo dzisiaj. Odpowiadam zwykle w ciągu jednego dnia roboczego.',
} as const;
