/* Jedyne źródło treści i danych kontaktowych.
   Narracja na „Ty". Na pierwszym planie Aleksandra Niewińska, ATRIUM STUDIO w drugim. */

export const site = {
  name: 'Aleksandra Niewińska',
  role: 'Architekt',
  studio: 'ATRIUM STUDIO',
  region: 'Białystok · Zambrów · Podlasie',
  /* dane rejestrowe: stopka i dane strukturalne dla Google */
  company: {
    name: 'ATRIUM Studio Aleksandra Niewińska',
    street: 'ul. Młynowa 40/21',
    postalCode: '15-404',
    city: 'Białystok',
    nip: '5381858922',
    regon: '381399082',
  },
  phone: '+48 660 970 375',
  phoneHref: '+48660970375',
  email: 'atriumkontakt@gmail.com',
  instagram: 'https://www.instagram.com/architekt_gosk_aleksandra/',
  instagramHandle: '@architekt_gosk_aleksandra',
} as const;

/* Etykiety są krótkie, bo na mobile pasek dzieli szerokość ekranu po równo między
   pozycje — „Gotowe projekty" w całości zdusiłoby pozostałe. Pełna nazwa stoi
   w nagłówku sekcji. */
export const nav = [
  { id: 'o-mnie', label: 'O mnie' },
  { id: 'uslugi', label: 'Usługi' },
  { id: 'realizacje', label: 'Realizacje' },
  { id: 'kontakt', label: 'Kontakt' },
] as const;

export const hero = {
  eyebrow: 'Architekt · Białystok, Zambrów, Podlasie',
  title: 'Aleksandra Niewińska',
  /* twarda spacja trzyma „z Tobą" razem — „Tobą" nie zostaje samo w drugim wierszu */
  script: 'Przestrzeń, która dojrzewa razem z Tobą',
  lead:
    'Projektuję budynki dopasowane do ludzi, którzy w nich mieszkają i pracują: domy, budynki wielorodzinne, usługowe, hale, budynki gospodarcze i inwentarskie.',
  cta: 'Napisz do mnie',
  scroll: 'Przewiń',
} as const;

export const about = {
  eyebrow: 'O mnie',
  title: 'Zaczynamy od tego, jak chcesz żyć',
  paragraphs: [
    'Nazywam się Aleksandra Niewińska i jestem architektem. Zanim cokolwiek narysuję, pytam, jak wygląda Twój zwykły dzień, bo z tego, a nie z ładnej wizualizacji, wychodzi dom, w którym da się wygodnie mieszkać przez lata.',
    'Przeprowadzę Cię przez cały proces: od analizy działki, przez projekt i pozwolenie na budowę, po nadzór autorski na budowie. Masz jeden kontakt zamiast łańcucha pośredników i wiesz, na jakim etapie jesteś.',
    'W ATRIUM Studio pracujemy kameralnie, przy ograniczonej liczbie projektów naraz. Dzięki temu każdy dostaje tyle uwagi, ile faktycznie potrzebuje.',
  ],
  facts: [
    { value: 'Białystok · Zambrów · Podlasie', label: 'Obszar działania' },
    { value: 'Projekt i budowa', label: 'Pełen zakres prowadzenia' },
    { value: 'Kameralnie', label: 'Ograniczona liczba projektów' },
  ],
  photoAlt: 'Aleksandra Niewińska, architekt',
} as const;

export const services = {
  eyebrow: 'Usługi',
  title: 'W czym mogę Ci pomóc?',
  items: [
    {
      no: '01',
      title: 'Budynki mieszkalne',
      desc: 'Domy jednorodzinne, bliźniaki, zabudowa szeregowa i budynki wielorodzinne. Od koncepcji, przez projekt budowlany i techniczny, po nadzór autorski na budowie.',
    },
    {
      no: '02',
      title: 'Rolnictwo i gospodarka',
      desc: 'Obory, chlewnie, stodoły, wiaty, magazyny i budynki gospodarcze. Znam wymagania, jakie stawiają im przepisy, i to, że mają przede wszystkim działać, a nie ładnie wyglądać na wizualizacji.',
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
      desc: 'Charakterystyka i świadectwa energetyczne budynków do odbioru, sprzedaży lub wynajmu.',
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
  quote: 'Dobry budynek nie zwraca na siebie uwagi. Po prostu działa i ułatwia Twoje codzienne życie.',
  attribution: 'Aleksandra Niewińska · ATRIUM STUDIO',
  note: 'Projekt, pozwolenie, budowa: jeden proces i jedna osoba odpowiedzialna za jego przebieg.',
} as const;

export const projects = {
  eyebrow: 'Realizacje',
  title: 'Wybrane projekty',
  lead: 'Galeria w przygotowaniu. Poniżej układ, w którym pojawią się zdjęcia zrealizowanych obiektów.',
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

/* Biblioteka gotowych projektów. Dziś to RUSZTOWANIE, nie katalog — dlatego płyty
   opisują typy budynków, które Aleksandra planuje wystawić, a nie zmyślone konkretne
   projekty z metryczkami. Zmyślony katalog czytałby się jak prawdziwy i byłby po prostu
   nieprawdą.

   Dodanie realnego projektu: dopisz `foto` (ścieżka w /public/img) i `dane`
   (pary etykieta–wartość, np. powierzchnia, kondygnacje). Płyta sama przełączy się
   z tekstury na zdjęcie, a panel pokaże specyfikację. Nic poza tym plikiem. */
export const katalog = {
  eyebrow: 'Gotowe projekty',
  title: 'Biblioteka projektów do adaptacji',
  lead:
    'Składam zestaw własnych projektów gotowych, takich, które kupujesz od ręki i które adaptuję do Twojej działki. Poniżej typy, które się w nim znajdą. Do czasu, aż zapełnię tę półkę, adaptuję też projekt kupiony w dowolnej innej pracowni.',
  stanLabel: 'Karta w przygotowaniu',
  stanText:
    'Wizualizacje, rzuty i metraże pojawią się tutaj, gdy projekt trafi do biblioteki. Szukasz czegoś z tej półki już teraz? Napisz.',
  action: 'Zapytaj o projekt',
  indeksLabel: 'Spis płyt',
  plyty: [
    {
      nazwa: 'Dom parterowy',
      opis: 'Bez schodów, z całą funkcją na jednym poziomie. Wygodny na lata, także wtedy, gdy wchodzenie na piętro przestaje być obojętne.',
    },
    {
      nazwa: 'Dom z poddaszem',
      opis: 'Ta sama powierzchnia użytkowa na mniejszym obrysie. Wybór na wąską działkę albo tam, gdzie plan miejscowy narzuca dach spadzisty.',
    },
    {
      nazwa: 'Dom z garażem',
      opis: 'Garaż wpisany w bryłę, nie doklejony obok. Wjazd, kotłownia i wejście gospodarcze policzone jako jeden ciąg, a nie trzy osobne decyzje.',
    },
    {
      nazwa: 'Budynek gospodarczy',
      opis: 'Stodoła, wiata, garaż wolnostojący, magazyn. Konstrukcja liczona pod to, co realnie ma stanąć w środku i wjechać do wnętrza.',
    },
    {
      nazwa: 'Budynek inwentarski',
      opis: 'Obora, chlewnia, kurnik. Wentylacja, ciągi obsługi i wymagania weterynaryjne wchodzą do projektu od pierwszego szkicu, nie na końcu.',
    },
    {
      nazwa: 'Hala',
      opis: 'Magazynowa, produkcyjna albo warsztatowa. Rozpiętość, wysokość i plac manewrowy ustawione pod naczepy i pod przyszłą rozbudowę.',
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
    'Opisz działkę i etap, na jakim jesteś, nawet jeśli to dopiero pomysł. Odpowiadam zwykle w ciągu jednego dnia roboczego.',
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
