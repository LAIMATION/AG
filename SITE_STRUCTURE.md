# SITE_STRUCTURE.md — Aleksandra Gosk, architekt

One-page, Next.js 15 (App Router) + TypeScript, deploy na Vercel. Język: PL.

## Drzewo plików

```
WEB/
├── app/
│   ├── layout.tsx              # <html lang="pl">, fonty next/font, import CSS, Nav, JSON-LD
│   ├── page.tsx                # złożenie sekcji w jedną stronę
│   └── api/
│       └── kontakt/route.ts    # POST — wysyłka formularza przez Gmail SMTP (nodemailer)
├── components/
│   ├── Nav.tsx                 # 'use client' — pasek + pływający przycisk powrotu
│   ├── Preloader.tsx           # 'use client' — ekran startowy, schodzi gdy hero ma czym grać
│   ├── ThemeToggle.tsx         # 'use client' — przełącznik motywu, w warstwie .ag-fab
│   ├── SmoothScroll.tsx        # 'use client' — Lenis spięty z ScrollTriggerem
│   ├── ScrollVideoScene.tsx    # 'use client' — sticky wideo; tryb `loop` (aktywny) / `scrub` (zachowany)
│   ├── ProjectShelf.tsx        # 'use client' — regał plansz w Realizacjach
│   ├── ReadyGallery.tsx        # 'use client' — galeria biblioteki gotowych projektów
│   ├── ContactForm.tsx         # 'use client' — formularz + stan wysyłki
│   └── sections.tsx            # Hero, About, Services, Manifesto, Projects, Contact, Footer
├── lib/
│   └── config.ts               # WSZYSTKIE treści + dane kontaktowe (jedyne źródło prawdy)
├── styles/
│   ├── tokens.css              # zmienne CSS (patrz DESIGN_SYSTEM.md)
│   ├── base.css                # reset, typografia bazowa, klasy pomocnicze
│   ├── layout.css              # siatka strony, układy sekcji, responsywność
│   └── components.css          # przyciski, pola formularza, placeholdery
├── public/
│   ├── video/wideo-1.mp4       # hero — 4K/30fps, ping-pong 16 s, 44,3 MB
│   ├── video/wideo-2.mp4       # sekcja manifest — 4K/30fps, ping-pong 16 s, 59,9 MB
│   ├── img/poster-1.jpg        # pierwsza klatka wideo-1 (plakat)
│   ├── img/poster-2.jpg        # pierwsza klatka wideo-2 (plakat)
│   └── img/aleksandra-gosk.webp # portret bez tła (alfa) do sekcji "O mnie"
├── .claude/launch.json
├── .env.example
├── next.config.mjs
├── package.json
├── tsconfig.json
├── SITE_STRUCTURE.md
└── DESIGN_SYSTEM.md
```

## Kolejność sekcji

| # | Sekcja | id | Komponent | Uwagi |
|---|---|---|---|---|
| 1 | Hero | `top` | `Hero` | **Wideo 1** jako tło pełnoekranowe |
| 2 | O mnie | `o-mnie` | `About` | portret + tekst + 3 fakty |
| 3 | Usługi | `uslugi` | `Services` | 4 pozycje w siatce 2×2 |
| 4 | Manifest | — | `Manifesto` | **Wideo 2** jako tło, cytat |
| 5 | Realizacje | `realizacje` | `Projects` | 6 mock-placeholderów |
| 6 | Gotowe projekty | `gotowe` | `Gotowe` | biblioteka w przygotowaniu + etapy adaptacji |
| 7 | Pas CTA | — | `CallToAction` | akcent `--c-accent-deep`, przycisk + telefon |
| 8 | Kontakt | `kontakt` | `Contact` | formularz + telefon + e-mail + IG |
| 9 | Stopka | — | `Footer` | copyright, obszar działania |

### Rytm pasów

Sekcje rozdziela zmiana tonu tła, nie kreska — `border-top` na pełną szerokość czytał się
jak przypadkowy podział. Kolejność: `--c-bg` (O mnie) → `--c-bg-alt` (Usługi) → scena wideo
→ `--c-bg` (Realizacje) → `--c-accent-deep` (CTA) → `--c-bg-alt` (Kontakt).

`padding-top` sekcji jest mniejszy od `padding-bottom` (`--section-y-top` vs `--section-y`,
83 px vs 141 px na desktopie) — przy symetrycznym padding tytuł wisiał zbyt nisko względem
początku pasa.

### 1. Hero
Scena wideo (`ScrollVideoScene`, `length={3}`) na Wideo 1.
W górnej krawędzi pierwszego ekranu **znak studia** (`.ag-lockup`, ATRIUM / STUDIO) —
specyfikacja w DESIGN_SYSTEM.md. Stoi na tej samej osi pionowej co eyebrow, hasło
i nazwisko; treść znaku pochodzi z `site.studioMark`. Panel 1 (dosunięty do dołu):
eyebrow → imię i nazwisko (`clamp(3rem, 9vw, 8.5rem)`) → wskaźnik scrolla.
Panel 2: lead + CTA „Porozmawiajmy o projekcie". Trzeci ekran to samo wideo.

### 2. O mnie
Siatka 5/6: portret `4/5` po lewej, tekst po prawej. Trzy akapity budujące zaufanie
(proces, kameralność, podejście techniczne). Pod tekstem pasek trzech faktów
(obszar działania / zakres / kameralność). Poniżej 900 px — jedna kolumna.

### 3. Usługi
Pas `--c-bg-alt`, karty na `--c-surface` — dzięki temu sekcja odcina się od „O mnie"
i tłem, i jaśniejszymi kaflami. Siatka 2×2 (mobile: 1 kolumna) z 1 px liniami zamiast
odstępów — karty stykają się krawędziami. Pozycje: projekty architektoniczne, organizacja
budowy, świadectwa energetyczne, konsultacje. Każda z numerem `01–04`.

### 4. Manifest
Druga scena wideo (`length={3}`, przyciemnienie `soft`) na **Wideo 2**: panel z cytatem
i panel z krótką notą. Oddziela ofertę od portfolio i utrzymuje balans
„architektka ↔ architektura".

### 6. Gotowe projekty — galeria (`components/ReadyGallery.tsx`)

Biblioteka projektów do adaptacji. **Zdjęć jeszcze nie ma** — sekcja jest rusztowaniem
gotowym na wizualizacje.

**Płyty opisują TYPY budynków, nie zmyślone konkretne projekty.** To świadome: audyt
zgłosił, że Realizacje podają sześć wymyślonych obiektów z metryczkami tak, jakby były
prawdziwe. Tutaj sześć typów, które Aleksandra planuje wystawić, jest prawdą, a struktura
danych i tak jest gotowa na podmianę.

**Dodanie realnego projektu:** dopisz `foto` (ścieżka w `/public/img`) w `lib/config.ts`.
Kadr sam przełączy się z siatki kreślarskiej na zdjęcie — żaden plik komponentu ani CSS
nie wymaga wtedy zmiany.

#### Kolejność na wąskim ekranie

Siatka stoi na **nazwanych obszarach**, nie na zwykłych kolumnach. Dzięki temu poniżej
900 px da się rozdzielić spis i status: spis idzie **nad kadr**, status pod niego.
Wcześniej oba siedziały pod kadrem, więc wybranie ostatniego projektu wymagało
przewinięcia w dół i powrotu w górę, żeby zobaczyć wynik. Zmierzone po zmianie:
ostatni przycisk spisu kończy się **16 px nad kadrem**.

W jednej kolumnie bocznej (poprzednia wersja) było to niemożliwe — dlatego spis
i status są rodzeństwem kadru, a nie jego sąsiadami w jednym pudełku.

#### Dlaczego inaczej niż karuzela Realizacji

| | Realizacje | Gotowe projekty |
|---|---|---|
| czynność | przeglądasz opowieść | **wybierasz z listy** |
| forma | kafelki płyną, sąsiedzi w kadrze | **jeden duży kadr + spis obok** |
| tekstura pustej płyty | skos | **siatka prostokątna** |
| mechanika | natywny scroll + snap | stan Reacta |

Karuzela ma sens tam, gdzie sąsiednie kafelki są kontekstem. Tu się wybiera, więc obraz
bierze cały kadr, a reszta zwija się do ponumerowanego spisu — jak plansze w tece.

#### Rzeczy, które wyszły z pomiaru

- **Kadr potrzebuje `width: 100%` OBOK `max-height`.** Przy samym `aspect-ratio`
  ograniczona wysokość **zwęża** element, żeby utrzymać proporcję — kadr zszedł z 833
  na 718 px i zostawiał 115 px pustki w kolumnie. Definitywna szerokość sprawia, że
  proporcja rządzi już tylko wysokością.
- **`max-height: 36vh` na kadrze.** Bez sufitu 16:9 na szerokiej kolumnie wypychało
  sekcję do 1,11 ekranu przy 1,00 każdej innej.
- **CTA stoi przy opisie, nie w kolumnie bocznej.** W kolumnie bocznej wychodziła ona
  wyższa od sceny i przycisk wypadał pod krawędź ekranu po skoku z menu (zmierzone: dół
  na 911 px przy kadrze 900 px). Po przeniesieniu wszystko mieści się w kadrze, sekcja
  ma 1,04 ekranu.
- **Wejście kadru robi CSS, nie GSAP.** `gsap.fromTo` ustawia stan początkowy
  natychmiast, a do końcowego dochodzi tickerem — przy zdławionym tickerze płyta zostaje
  na `opacity: 0`, czyli główna treść sekcji jest niewidoczna. Animacja CSS nie zależy
  od wątku głównego, a stanem bazowym elementu jest pełna widoczność.

Wybór niesie kolor i waga, nie tło: pas jest biały, a plama tła zrobiłaby ze spisu sześć
kafelków — dokładnie to, czego ten układ miał uniknąć. Strzałki góra/dół i lewo/prawo
przechodzą po spisie.

### 5. Realizacje — regał plansz (`components/ProjectShelf.tsx`)

Trzeci sposób prezentacji na stronie i **celowo różny od dwóch pozostałych**:

| | Realizacje (regał) | Gotowe projekty (galeria) | karuzela (usunięta) |
|---|---|---|---|
| co robisz | **widzisz wszystko naraz** | wybierasz ze spisu | przewijasz |
| forma | sześć płyt, wybrana rozsuwa się w miejscu | jeden duży kadr + spis w kolumnie | kafelki płyną, sąsiedzi w kadrze |
| tytuł | **pionowo zawsze, grzbiet teczki** | poziomo pod kadrem | poziomo pod kadrem |
| pusta płyta | **bez tekstury** | siatka prostokątna | skos |

Metafora jest z warsztatu: sześć plansz stoi obok siebie jak grzbiety teczek na półce.
Wybrana wysuwa się i **obraca tytuł do poziomu** — tak jak wyciągniętą teczkę odwraca
się przodem do siebie.

**Regał bez zdjęć jest kompletny, a nie pusty** — niosą go typografia i podział na pola.
Dlatego jako jedyny z trzech układów nie dostał tekstury zastępczej: karuzela miała skos,
galeria biblioteki ma siatkę, trzeci deseń zrobiłby z warsztatu jarmark.

**Dodanie zdjęcia:** dopisz `foto` przy realizacji w `lib/config.ts`. Zdjęcie wypełni
płytę, przyciemnienie u dołu włączy się samo (`:not([data-pusta])`), a tekst przejdzie
na kremowy. Żaden plik komponentu ani CSS nie wymaga wtedy zmiany.

#### Pełne rozlanie

`margin-inline: calc(var(--gutter) * -1)` wyprowadza regał poza margines sekcji.
Zmierzone przy 1440 px: regał ma 1425 px i sięga od krawędzi do krawędzi. Powyżej
~1560 px szerokości okna ogranicza go `--maxw` sekcji, co jest w porządku — to nadal
1632 px pasa.

#### Cztery błędy i ich przyczyny

1. **Pionowe tytuły wychodziły poza płytę i były widoczne w połowie.** Dwie osobne
   przyczyny, jedna po drugiej. Najpierw ukryty opis: chowała go sama przezroczystość,
   więc mimo niewidoczności zajmował miejsce i wypychał tytuł w górę (zmierzone: 99 px
   ponad krawędź, 4 z 6 tytułów na numerze). Potem, po przejściu na obrót transformem,
   **transform w ogóle się nie nakładał** — `computed transform` wychodził macierzą
   jednostkową, więc tytuł leżał poziomo jako pasek 275 px w płycie szerokiej 177 px
   i połowa była przycięta.

   Uwaga metodyczna: `getBoundingClientRect()` na elemencie z `white-space: nowrap`
   mierzy PUDEŁKO, nie tekst — tekst wylewający się poza pudełko jest w tym pomiarze
   niewidoczny. Dlatego pierwszy pomiar fałszywie orzekł „mieści się". Rozstrzyga
   dopiero `Range` po zawartości.

2. **Obrót pion → poziom był toporny.** Usunięty w całości: tytuł zostaje pionowy
   zawsze. Przy wyborze i tak zmienia się szerokość płyty, akcent na numerze i pojawia
   się opis — obrót nie dokładał informacji, tylko ruch.

   Pion robi teraz **prawdziwy `writing-mode: vertical-rl`**, bez transformu. Różnica
   jest zasadnicza: `writing-mode` daje elementowi realne pudełko (wąskie i wysokie),
   więc układ wie, ile miejsca zajmuje, da się je wyśrodkować zwykłym `align-items`
   i ograniczyć `max-height`. Obrócony transformem tekst zachowuje pudełko poziome.

3. **Tytuły nie były na środku** — o 20 px, czyli dokładnie połowę różnicy między
   górnym (`--s-8`) a dolnym (`--s-5`) paddingiem płyty. Padding wyrównany do
   symetrycznego; numer jest pozycjonowany absolutnie, więc nie potrzebuje
   zarezerwowanego miejsca u góry. Po: odchyłka **0 px**.

4. **Na wąskim ekranie tytuł otwartej płyty zasłaniał numer.** Numer był absolutny,
   więc leżał w tej samej przestrzeni co tytuł. Na mobile **wraca do przepływu**
   i dostaje własną kolumnę siatki — zmierzone: numer x 16–32, tytuł x 48–359,
   zero nachodzenia na żadnej płycie.

Opis odkrywa się **rozmyciem i przesunięciem** (`blur(8px)` → ostro, `-0.75rem` → 0),
nie obrotem. Stan bazowy elementu jest widoczny, a chowana jest dopiero płyta zwinięta:
gdyby przejścia nie ruszyły, treść czynnej płyty i tak byłaby na ekranie.

#### Rzeczy, które trzeba wiedzieć przy modyfikacji

- **Rozsuwanie idzie po `flex-grow`, czyli po layoucie, nie po transformie.** To jedyny
  sposób, żeby sąsiednie płyty realnie ustąpiły miejsca — transform by je nałożył.
  Sześć pól reflow to koszt, na który stać tę jedną interakcję. Zmierzone: czynna
  539 px wobec 177 px pozostałych, stosunek 3,05.
- **Numer i treść są pozycjonowane absolutnie, nie flexem.** Opis jest w drzewie także
  na zwiniętej płycie (chowa go przezroczystość, nie `display`, żeby szerokość nie
  skakała w trakcie rozsuwania) — we flexie jego wysokość wypychałaby numer poza kadr.
- **Wybór jest wyłącznie kliknięciem**, na myszy i na dotyku tak samo. Najazd kursorem
  podświetla tytuł, ale niczego nie wybiera — inaczej nie dałoby się zamknąć płyty.

#### Na wąskim ekranie regał kładzie się na bok

Sześć pionowych płyt przy 375 px dałoby po ~55 px szerokości, czyli nic. Poniżej 900 px
płyty stają się wierszami (72 px), wybrany rozwija się w dół do 20 rem, a tytuły wracają
do poziomu. Zmierzone: sekcja 1,24 ekranu, cele dotykowe ≥ 44 px, zero przewijania
w poziomie.


### 5a. Realizacje — dane
Siatka 3 kolumn (1023 px → 2, 599 px → 1). Każdy kafel: ramka o proporcji `3/4` lub `4/3`
z placeholderem („Wkrótce") + tytuł i meta. Podmiana na prawdziwe zdjęcia = zamiana
`.ag-placeholder` na `next/image` w `components/sections.tsx` i uzupełnienie
`projects.items` w `lib/config.ts`.

### 6. Pas CTA
Jedyny pas w akcentującym kolorze na całej stronie (`--c-accent-deep`, ciemniejszy bronz
niż `--c-accent`, bo jasny tekst potrzebuje kontrastu). Tytuł + przycisk do formularza
+ numer telefonu. Bez niego Realizacje i Kontakt zlewały się w jeden blok.

### 7. Kontakt
Pas `--c-bg-alt`. Siatka 4/6: po lewej lead + telefon / e-mail / Instagram (klikalne
`tel:` i `mailto:`), po prawej formularz z akcentującą krawędzią górną 2 px
(imię, e-mail, telefon opcjonalny, wiadomość, honeypot `firma`).
Submit → `POST /api/kontakt` → nodemailer → Gmail SMTP.

## Nawigacja

### Pięć zakładek na mobile: `flex-grow`, nie `flex: 1`

`flex: 1` to `flex: 1 1 0%` — baza zerowa, czyli pozycje równe co do piksela. Działało
przy czterech zakładkach. Piąta („Gotowe") to psuje: zmierzone przy 375 px, slot spada
do 59 px, a „Realizacje" mają **73 px samego tekstu** — etykieta wychodzi poza swoje pole.
Zejście z krojem, które by to uratowało, kończy się na ~9 px, poniżej czytelności.

Dlatego `flex-grow: 1` z bazą `auto`: każda pozycja dostaje własną szerokość plus równy
udział w wolnym miejscu. Pasek nadal wypełnia się w całości (335 px na 334 px dostępnych),
ale nic się nie łamie — każda etykieta ma 5 px zapasu. Ceną są nierówne pola (55–86 px),
proporcjonalne do długości etykiety.

Stopień na mobile zszedł do `0.6875rem` z trackiem `.05em`. 11 px wersalików jest
w systemie (etykiety faktów i pól kontaktu), a cel dotykowy trzyma 44 px niezależnie
od stopnia pisma.

Etykiety w `nav` są krótkie z tego samego powodu — pełna nazwa („Gotowe projekty")
stoi w nagłówku sekcji.

`components/Nav.tsx` (client). Pływający, wyśrodkowany kafelek na mlecznym szkle
(`--radius-nav: 20px`, wysokość 43 px, `backdrop-filter: blur(28px) saturate(1.6)`,
warstwa połysku `::before` + cień pod spodem dają lekką wypukłość — szczegóły budowy
w DESIGN_SYSTEM.md). Desktop: u góry. Mobile (≤767 px): u dołu, pełna szerokość minus
margines, 4 zakładki równej szerokości.

Warstwa `.ag-nav` jest `pointer-events: none` — klikalny jest tylko `.ag-nav__bar`,
więc pasek nie blokuje treści pod sobą. Pierwszą pozycją paska jest ikona strzałki
w górę (`#top`, `aria-label="Początek strony"`), oddzielona od zakładek cienką kreską.

### Pływający przycisk powrotu (`.ag-fab`)

Okrągły przycisk 44 px w prawym dolnym rogu, `href="#top"`, na tej samej szklanej płytce
(`.ag-glass`) i sterowany **tym samym stanem** co pasek — chowa się i wraca równo z nim.
Na mobile siedzi nad dolnym paskiem (`--fab-bottom` = `nav-offset × 2 + nav-h + safe-area`,
17 px prześwitu); tam ikona z paska znika, bo byłaby duplikatem i rozbijała równe
szerokości zakładek.

Tonację liczy osobno — stoi w innym miejscu ekranu niż pasek, więc np. nad pasem CTA
przycisk jest już ciemny, gdy pasek u góry wciąż jest jasny.

**Transform siedzi na płytkach (`.ag-nav__bar`, `.ag-fab__btn`), nie na warstwach
pozycjonujących.** Dzięki temu `.ag-nav` i `.ag-fab` się nie przesuwają i JS może
zmierzyć na nich prawdziwą pozycję — przy transformie na wrapperze schowany element
raportowałby rect spoza ekranu i wracał z błędną tonacją.

- **Chowanie:** `data-hidden="true"` w trakcie scrollowania (próg 10 px odsiewa drgnięcia),
  powrót automatyczny po 420 ms ciszy — nie po scrollu w górę.
- **Aktywna zakładka:** sekcja przecinająca środek ekranu, liczona z `getBoundingClientRect()`
  w tym samym handlerze scrolla (nie `IntersectionObserver` — jeden listener, zero opóźnień
  przy Lenisie). Na scenach wideo żadna zakładka nie jest aktywna.
- **Tonacja:** `data-tone="dark"` gdy środek paska leży nad `.ag-scene` (wideo) lub
  `.ag-cta` → ciemne szkło i jasny tekst; poza nimi `light` → jasne szkło i ciemny tekst.
  Przy tak przeziernej warstwie jeden kolor tekstu nie wystarcza na oba tła. Ton musi
  siedzieć w `background-color`, nie w gradiencie — inaczej tło przeskakuje zamiast płynąć.
- **Chowanie animuje wyłącznie `transform`.** `opacity` na `.ag-nav` robiło z niej
  *backdrop root*, przez co `backdrop-filter` paska tracił tło do próbkowania: szkło
  gasło na czas animacji i „doładowywało się" dopiero na końcu.
- Sygnet „Aleksandra Gosk / Architekt" wypadł z paska — nazwisko niesie hero i stopka.

## Formularz kontaktowy — Vercel

`app/api/kontakt/route.ts`, runtime `nodejs`. Zmienne środowiskowe (Vercel → Settings →
Environment Variables, wszystkie środowiska):

| Zmienna | Znaczenie |
|---|---|
| `GMAIL_USER` | dodatkowe konto Gmail wyłącznie do wysyłki (nadawca) |
| `GMAIL_APP_PASSWORD` | hasło aplikacji z tego konta (2FA → Hasła aplikacji) |
| `CONTACT_TO` | adres odbiorcy zapytań; brak → wysyłka na `GMAIL_USER` |

`replyTo` ustawiany na adres nadawcy z formularza — odpowiedź idzie prosto do klienta.
Puste `GMAIL_*` → `500 mail-not-configured`, formularz pokazuje komunikat błędu.

## Sceny wideo (`components/ScrollVideoScene.tsx`)

```
.ag-scene               height: len × 100svh
├── .ag-scene__media    position: sticky; top: 0; height: 0     ← zerowa wysokość, patrz niżej
│   └── .ag-scene__frame  position: absolute; height: 100svh    ← wideo + przyciemnienie
└── .ag-scene__content                                          ← tekst przewija się po wideo
    └── .ag-scene__panel  min-height: 100svh   (× len−1)
```

Wideo trzyma się ekranu przez całą wysokość sceny (`position: sticky`, bez pinowania
GSAP-em), tekst przewija się po nim.

Scena ma dwa tryby, prop `mode`:

| `mode` | Stan | Mechanizm |
|---|---|---|
| **`loop`** | **domyślny, aktywny** | wideo leci samo, natywnym `loop`. Ping-pong (przód, potem tył) jest wpisany w plik, nie w JS |
| `scrub` | zachowany, nieaktywny | ScrollTrigger mapuje postęp scrolla 0→1 na `currentTime` 0→`duration` |

Tryb `loop` nie dotyka klatek z poziomu JS — zapętlanie robi atrybut `loop`, a ping-pong
jest już w pliku. Skrypt tylko uruchamia odtwarzanie przy `canplay` i ponawia przy
pierwszym dotknięciu ekranu (iOS Low Power Mode i Safari z „Auto-Play: Never" nie puszczą
startu bez gestu).

**W JSX celowo nie ma atrybutu `autoPlay`.** Renderuje go serwer, więc odtwarzanie
ruszało, zanim efekt zdążył odczytać `prefers-reduced-motion` — zmierzone **0,58 s ruchu
u kogoś, kto prosił o brak ruchu**. Start idzie wyłącznie z JS.

Zapętlone tło trwa 16 s i startuje samo, więc podlega **WCAG 2.2.2 (Pause, Stop, Hide)**.
Przy `prefers-reduced-motion: reduce` wideo nie rusza w ogóle — zostaje pierwsza klatka,
tak samo jak w trybie `scrub`. Zasłona startowa schodzi normalnie, bo gotowość melduje
się niezależnie od tego, czy coś gra.

Wideo trwają po 16 s (8 s materiału + 8 s odwrotki), `length={3}` daje spokojne tempo.
Zmiana tempa = zmiana `length` w `components/sections.tsx`.

Warianty `scrub` przez `gsap.matchMedia()` — **bez progu szerokości**, żeby wąskie okno
i telefon zachowywały się tak samo jak desktop:

| Warunek | Zachowanie |
|---|---|
| `prefers-reduced-motion: no-preference` | scrub klatek scrollem, każda szerokość okna |
| `pointer: coarse` | `scrub: 0.35` zamiast `1.1` — na telefonie sekunda opóźnienia czyta się jak awaria |
| `prefers-reduced-motion: reduce` | wideo zatrzymane na pierwszej klatce |

**Uwaga przy powrocie do `scrub`:** obecne pliki mają zwykły GOP (`-g 48`) i 4K, więc
seek wstecz kosztuje dekodowanie od poprzedniej klatki kluczowej na pełnej rozdzielczości.
Włączenie `mode="scrub"` wymaga przekodowania na all-intra i najpewniej zejścia z 4K —
patrz „Kodowanie wideo".

#### Bezpiecznik dekodera liczony od `loadstart`, nie od montażu

W trybie `scrub` po 3 s bez danych scena przechodzi na zwykłe odtwarzanie (`fellBack`),
żeby zamiast martwego prostokąta pokazać cokolwiek. Odliczanie startuje od zdarzenia
`loadstart`, czyli od chwili, w której przeglądarka **faktycznie ruszyła po plik**.

Wcześniej startowało od montażu komponentu. Przy `loading="lazy"` element nie ma wtedy
jeszcze `src`, więc bezpiecznik wypadał na pusto **zawsze**, ustawiał `fellBack` i na
trwałe wyłączał `applySeek` — scena manifestu zostawała zamrożona na pierwszej klatce,
choć plik dochodził chwilę później bez zarzutu. Zmierzone przed i po, ten sam scenariusz:

| | przed | po |
|---|---|---|
| `video.loop` po 4 s bez scrolla | `true` (fallback odpalił) | `false` |
| `currentTime` przy 60% sceny | 0,042 s | 18,0 s |

### Co musi być spełnione, żeby scrub działał na telefonie

0. **Plakat pierwszej klatki.** `<video poster="/img/poster-N.jpg">` — element `<video>`
   jest pusty, dopóki nie zdekodowano ani jednej klatki, więc przy 15 MB pliku widać było
   samo tło sceny aż do pierwszego scrolla (dopiero seek wymuszał dekodowanie). Plakaty
   (52 KB i 92 KB) wyciągnięte ffmpegiem z klatki 0, hero dodatkowo z `<link rel="preload">`.
   Pauza po rozgrzewce leci dopiero po pierwszej **wyrysowanej** klatce
   (`requestVideoFrameCallback`), z bezpiecznikiem 300 ms — bez niego w karcie, która nie
   kompozytuje, callback nie odpala i wideo dogrywa do końca.
1. **Odblokowanie dekodera gestem.** iOS nie dekoduje wideo, którego nigdy nie odtworzono,
   a `play()` przy montowaniu bywa odrzucane bez gestu (Low Power Mode, Safari →
   Auto-Play: Never). Rozgrzewka `play()` → `pause()` leci więc również przy pierwszym
   `pointerdown`/`touchstart`, a po jej powodzeniu od razu dociągamy klatkę.
2. **Seek w locie nie może gubić pozycji.** Wcześniej `onUpdate` przerywał działanie przy
   `video.seeking`, a że po wyhamowaniu scrolla nie ma już kolejnych `onUpdate`, wideo
   zostawało na starym kadrze — na desktopie seek trwa milisekundy i było to niewidoczne,
   na telefonie zawieszało obraz. Teraz nasłuchujemy `seeked` i po każdym zakończonym
   seeku dociągamy do bieżącej pozycji scrolla.
3. **Bezpiecznik.** Jeśli po 3 s `readyState < 2`, scena przechodzi na zwykłe odtwarzanie
   w pętli — lepszy ruch niż martwy prostokąt.

Zmierzone na profilu dotykowym (375×812, `pointer: coarse`): pozycje 0/25/50/75/100 %
scrolla dają klatki 0/48/96/144/191 z 192, w obie strony.

### Wyjście ze sceny: zatrzymana klatka pod wjeżdżającą sekcją

Scena nie odjeżdża do góry razem z treścią. Po dobiciu do końca wideo stoi na ostatniej
klatce, przypięte do ekranu, a kolejna sekcja po prostu na nie wjeżdża i je zasłania.

Mechanizm opiera się na dwóch rzeczach:

- `.ag-scene__media` ma **`height: 0`** — sticky odkleja się dopiero, gdy jego dolna
  krawędź dotknie dna kontenera, a przy zerowej wysokości nie następuje to przed samym
  końcem sceny. Sam kadr (`.ag-scene__frame`) jest w środku, `position: absolute`,
  `height: 100svh`. Przy poprzednim `height: 100svh` na sticky wideo odklejało się
  o cały ekran wcześniej i wyjeżdżało w górę razem ze stroną.
- `.ag-section` i `.ag-footer` mają `z-index: 1` i **nieprzezroczyste `background`** —
  są później w DOM, więc malują się nad przypiętym wideo.

Wejście w scenę działa symetrycznie i bez sztuczek: dopóki scena nie dojdzie górą do
krawędzi ekranu, kadr jedzie razem z nią od dołu.

Zmierzone na obu scenach: od momentu wyczerpania scrolla wideo stoi na klatce 191/192
i pozostaje przypięte (`top: 0`), a następna sekcja zakrywa je 0 → 22 → 50 → 78 → 100 %.

### Jednostki wysokości: `lvh` dla kadru, `svh` dla układu

To rozróżnienie jest celowe i nie wolno go ujednolicić:

| Element | Jednostka | Dlaczego |
|---|---|---|
| `.ag-scene__frame` (wideo) | **`100lvh`** | kryje ekran z **schowanym** paskiem adresu |
| `.ag-scene`, `.ag-scene__panel`, scrim | **`100svh`** | liczą się do ekranu z **rozwiniętym** paskiem |
| cokolwiek | ~~`dvh`~~ | zmienia się w trakcie chowania paska → tekst skakałby, a ScrollTrigger przeliczał długość sceny w locie |

Przy `100svh` na kadrze wideo miało wysokość ekranu z rozwiniętym paskiem adresu —
gdy pasek chował się przy scrollu, widoczny obszar rósł i pod wideo wychodził ciemny
pas (zgłoszone na Samsung Internet, gdzie pasek stoi u dołu). `100vh` zostaje przed
`100lvh` jako zapas dla starszych silników, gdzie i tak znaczy to samo.

Treść dosunięta do dołu (`.ag-scene__panel--bottom`) zostaje na `svh`, więc wracający
pasek adresu nigdy jej nie zasłania. Dochodzi do tego `--bottom-ui` — miejsce zajęte
przez **nasz** dolny pasek i przycisk powrotu: `0` na desktopie, `fab-bottom + 44px`
poniżej 768 px. Bez tego wskaźnik scrolla w hero wchodził pod oba (zmierzone).

Ważne: `overflow-x` siedzi na `html` jako `clip`, nie `hidden` na `body` — `hidden` robi
z `body` kontener scrolla i psuje `position: sticky`.

## Płynny scroll (`components/SmoothScroll.tsx`)

### `lerp`, nie `duration` + `easing`

Tryb `duration` to animacja o ustalonej długości: każde drgnięcie kółka startuje od
nowa przebieg do nowego celu. Przy szybkim kręceniu kolejne przebiegi nadpisują się
nawzajem, prędkość urywa się na każdym starcie i wychodzi z tego **pływanie
z opóźnieniem, nie gładkość**. Było `duration: 1.15` z krzywą sześcienną.

`lerp` to wygładzanie wykładnicze — co klatkę pokonujemy ułamek dystansu, jaki został
do celu. Nowe zdarzenie niczego nie przerywa, tylko przesuwa cel, więc ruch jest ciągły
i zawsze liczony od pozycji **aktualnie na ekranie**: bez skoku i bez ściany prędkości
przy zmianie kierunku. Lenis 1.x normalizuje `lerp` czasem klatki, więc 144 Hz nie
przewija szybciej niż 60 Hz.

### Dwa pokrętła, dwie różne sprawy

Mylenie ich to główny powód, dla którego gładki scroll wychodzi „lagujący".

| Pokrętło | Co robi | Wartość |
|---|---|---|
| `lerp` | jak szybko dojeżdżamy do celu | **0,14** |
| `wheelMultiplier` | dystans na kliknięcie kółka | **0,8** (~80 px) |

**Za wrażenie lagu odpowiada `lerp`, nie mnożnik.** Wygładzanie wykładnicze ma długi
ogon — przy 0,09 pojedynczy klik sunął jeszcze ~0,53 s po tym, jak kółko stanęło. Ruch
trwający dłużej niż wywołujący go gest nie czyta się jako gładki, tylko jako spóźniony,
i to on sprawia, że krok wygląda na „wielki skok": widać całą jego drogę. 0,14 skraca
dojazd do ~0,33 s.

Stałe czasowe przy 60 Hz (dojazd do 95%): `0,09` → 0,53 s · `0,13` → 0,36 s ·
**`0,14` → 0,33 s** · `0,16` → 0,29 s · `0,18` → 0,25 s.

**Mnożnika nie wolno ciąć mocno.** Strona ma **10,5 ekranu**, z czego 6 to dwie przypięte
sceny wideo. Zmierzone kliknięcia kółka do końca strony: `0,9` → 105, `0,8` → 118,
`0,7` → 135. 0,8 to cała rozsądna rezerwa — niżej strona robi się mozolna, nie gładsza.
Gdyby dalej było ospale, kręcić `lerp` (0,16–0,18).

Skok z menu (`scrollTo`) zostaje na **ustalonym czasie** — to ruch zakomenderowany, nie
gest, i `lerp` go nie dotyczy. Ma jednak własną krzywą i własne liczenie czasu, patrz
„Lądowanie kotwic".


Lenis zamontowany w `app/layout.tsx`. Bez niego jedno kliknięcie kółka to skok o ~100 px
— tekst i klatki wideo przeskakują. Lenis interpoluje ten skok, a `scrub` dostaje ciągły
strumień pozycji zamiast schodków.

- `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker` jako pętla `raf`,
  `gsap.ticker.lagSmoothing(0)` — jedna pętla animacji dla całej strony.
- `html { scroll-behavior: auto }` — natywne `smooth` koliduje z Lenisem.
- `prefers-reduced-motion: reduce` → Lenis w ogóle się nie montuje (scroll natywny).

### Lądowanie kotwic

Kotwice przechwytuje delegowany `click` — także przy wyłączonym Lenisie, żeby oba tryby
lądowały identycznie (`lenis.scrollTo` albo `window.scrollTo`).

Celem jest **`.ag-section__head`, nie krawędź sekcji**. Sekcje mają `--section-y` górnego
paddingu (~140 px na desktopie), więc równanie do krawędzi spychało treść nisko, pod pusty
pas. Nagłówek siada `scroll-padding-top` od góry ekranu, czyli tuż pod paskiem nawigacji:

```js
const top = Math.max(sectionTop, headTop - scrollPaddingTop);
```

`Math.max` pilnuje, żeby przy tym nigdy nie wjechał w kadr skrawek poprzedniej sekcji
(gdyby `--section-y` było mniejsze od prześwitu).

#### Krzywa: rozbieg ORAZ wyhamowanie

Było `expo.out`. Ta krzywa **startuje ze szczytową prędkością** — zmierzone 6,9× średniej
w pierwszej klatce — i nie ma fazy rozbiegu w ogóle, a potem pełznie: ostatnie 10% drogi
zajmowało jej **67% czasu**. Czyta się to jako zwłoka, nie jako hamowanie.

Teraz `smootherstep` ze skosem czasu `t^0.85`:

```js
easing: (t) => { const w = Math.pow(t, 0.85); return w*w*w*(w*(w*6-15)+10); }
```

| | expo.out (było) | teraz |
|---|---|---|
| szczyt prędkości | t = 0,00 | t = 0,42 |
| prędkość startowa | 6,86× średniej | **0** |
| szczyt prędkości | 6,91× średniej | **1,81×** |
| ostatnie 10% drogi | 67% czasu | 28% czasu |

`smootherstep` rusza i kończy z prędkością **oraz** przyspieszeniem równym zero, więc ani
start, ani lądowanie niczym nie szarpie. Skos `t^0.85` przesuwa szczyt przed połowę:
rozbieg dostaje 42% czasu, wyhamowanie 58%.

#### Czas zależny od dystansu

`duration = clamp(0.7, 0.45 + 0.011 * sqrt(dystans), 1.6)`

Stałe 1,2 s dawało ten sam czas skokowi o 2160 px i o 7052 px — czyli 1800 wobec
5877 px/s pod tym samym kliknięciem. Pierwiastek trzyma długie skoki w ryzach, zamiast
skalować czas wprost proporcjonalnie. Zmierzone cele na tej stronie:

| Skok z góry do | Dystans | Czas |
|---|---|---|
| O mnie | 2160 px | 0,96 s |
| Zakres | 2885 px | 1,04 s |
| Realizacje | 5897 px | 1,29 s |
| Kontakt | 6965 px | 1,37 s |
| powrót `#top` z dołu | 7052 px | 1,37 s |

`lock: true` zostaje — świadomy wyjątek od zasady „nigdy nie odbieraj sterowania". To
komenda z konkretnym celem, nie gest, a przy 10,5 ekranu strony walka scrolla z animacją
kończy się lądowaniem w losowym miejscu. Limit 1,6 s trzyma blokadę w rozsądku.

`scroll-padding-top` = `--nav-h + --nav-offset + --s-5` → 84 px na desktopie
(27 px prześwitu pod paskiem) i 32 px na mobile, gdzie pasek stoi u dołu.

Sprawdzone przy 1280×720 i 375×812: nagłówek każdej z czterech zakładek ląduje na stałej
wysokości, a w kadrze nie ma żadnej innej sekcji.

## Kodowanie wideo

Źródła: `../Wideo/Wideo v1.mp4` → hero, `../Wideo/Wideo v2.mp4` → manifest.
Mastery to **3840×2160, HEVC 10-bit, 24 fps, 10,04 s** (39 i 62 Mb/s).

Pliki w `public/video/` mają **ping-pong wpisany w plik**: za materiałem właściwym
(241 klatek) idzie ten sam materiał odwrócony i przycięty o klatkę z obu stron
(239 klatek). Razem 480 klatek / 16,0 s. Dzięki temu natywne `loop` odtwarza w kółko
tam i z powrotem — bez jednej linijki JS, bez seekowania i bez szansy na zacięcie.

Przycięcie odwrotki jest obowiązkowe: bez `trim` klatka skrajna leci dwa razy pod rząd
i na każdym zawrocie widać przytrzymanie.

**Rozdzielczość zostaje 4K — bez skalowania w dół.** Skoro nie scrubujemy, znika powód
dla all-intra, więc zwykły GOP (`-g 48`) kupuje budżet na pełne 3840×2160:

| | 720p all-intra, 24 fps, 8 s (pierwotnie) | 4K GOP, 30 fps, 16 s ping-pong (teraz) |
|---|---|---|
| wideo-1 | 15,3 MB @ 15,3 Mb/s | 44,3 MB @ 22,1 Mb/s |
| wideo-2 | 18,1 MB @ 18,0 Mb/s | 59,9 MB @ 30,0 Mb/s |

Master jest **HEVC 10-bit**, wynik to **H.264 High 8-bit, Level 5.1** — High10 odpada,
bo przeglądarki go nie dekodują. Konwersja do 8 bitów jest tu nieunikniona.

### Odwrotka idzie połówkami, nie naraz

`reverse` buforuje CAŁY strumień w pamięci: 241 klatek 4K to ~12,4 MB na klatkę, czyli
**~3 GB**. Dlatego odwrotka powstaje z dwóch kawałków po ~120 klatek (~1,5 GB każdy),
sklejanych w odwrotnej kolejności. Oba kawałki kodowane są **wprost z mastera**, nie
z już przekodowanego przodu — inaczej połowa materiału byłaby drugą generacją.

Odtworzenie (skrypt: `scratchpad/enkoduj4k.sh`, ten sam schemat dla obu plików):

```bash
Q="-c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -g 48 -profile:v high -level 5.1 -an"
ffmpeg -y -i "../Wideo/Wideo v1.mp4" $Q p0.mp4
ffmpeg -y -i "../Wideo/Wideo v1.mp4" -vf "trim=start_frame=121:end_frame=240,setpts=PTS-STARTPTS,reverse" $Q r1.mp4
ffmpeg -y -i "../Wideo/Wideo v1.mp4" -vf "trim=start_frame=1:end_frame=121,setpts=PTS-STARTPTS,reverse" $Q r2.mp4
printf "file 'p0.mp4'\nfile 'r1.mp4'\nfile 'r2.mp4'\n" > lista.txt
ffmpeg -y -f concat -safe 0 -i lista.txt -c copy -movflags +faststart public/video/wideo-1.mp4
```

`-movflags +faststart` jest obowiązkowe — bez niego `moov` ląduje za `mdat` i odtwarzanie
czeka na cały transfer. Sprawdzone: kolejność atomów to `ftyp → moov → free → mdat`.

### 30 fps przez przyspieszenie, nie przez interpolację

Źródło ma 24 fps. Na ekranie 60 Hz wychodzi **60 / 24 = 2,5**, więc klatki lecą
naprzemiennie po 3 i 2 odświeżenia (pulldown) — na powolnym najeździe widać to jako
szarpanie. Przy 30 fps jest równo **60 / 30 = 2** i judder znika.

Klatkaż podnosimy **tempem**: `setpts=PTS/1.25` plus `-r 30`. Wszystkie 241 klatek
źródła zostają co do jednej, tylko zajmują 8,03 s zamiast 10,04 s (241 / 8,0333 = 30
równo). Żadna klatka nie jest ani powielona, ani wymyślona, ani wyrzucona — sprawdzone:
`nb_read_frames` = 480 przed i po.

Interpolacja (`minterpolate`) zachowałaby tempo, ale na 4K liczy się w dziesiątkach
minut na plik i potrafi zostawić artefakty na krawędziach.

`-g 60` zamiast `-g 48` — ta sama odległość klatek kluczowych w sekundach (2 s).

Zmierzone w przeglądarce: `videoWidth × videoHeight` = **3840 × 2160**, **0 klatek
opuszczonych**, przejście przez punkt zawrotu bez przerwy.

Plakaty (`public/img/poster-*.jpg`) to pierwsza klatka pliku wynikowego, 1400 px, `-q:v 6`.
Muszą być regenerowane razem z wideo, inaczej pierwsza klatka nie zgadza się z plakatem.
Przy 4K plakat pełni też rolę siatki bezpieczeństwa: część urządzeń mobilnych nie
dekoduje 4K H.264 i wtedy plakat jest jedynym, co widać.

`ScrollVideoScene` kwantyzuje `currentTime` do granicy klatki (prop `fps`, domyślnie 24)
— dotyczy wyłącznie trybu `scrub`.

`motion` jest w `dependencies`, ale nie jest importowane.

## Ekran startowy (`components/Preloader.tsx`)

Zasłania stronę, dopóki hero nie ma czym grać — wideo waży kilkanaście MB i bez tego
pierwsze sekundy wyglądały jak zawieszony plakat.

Renderuje się **po stronie serwera**, więc jest już w pierwszym HTML-u. Gdyby montował
się dopiero na kliencie, przez moment widać by było hero, które ma zasłaniać.

Warunki zejścia:

| | Wartość | Po co |
|---|---|---|
| hero melduje `canplay` **oraz** `document.fonts.ready` | — | właściwy sygnał gotowości |
| dolna granica | 700 ms | przy pełnym cache ekran inaczej mrugnie i zniknie |
| sufit | 7 s | awaria sieci nie może zamknąć nikogo pod zasłoną |

Hero melduje gotowość zdarzeniem `ag:scena-gotowa`. Efekty dzieci lecą przed efektami
rodzica, więc scena potrafi zameldować, zanim zasłona zdąży się podpiąć — wyścig zamyka
flaga `stanScen.heroGotowe`, sprawdzana przy montażu.

Zdjęcie z drzewa idzie na zegarze (1 s), **nie na `transitionend`**: przy
`prefers-reduced-motion` zasłona gaśnie `opacity` zamiast jechać `transform`, więc
nasłuch na `transform` nigdy by nie odpalił, a pusty `inset: 0` zostałby na stałe nad
stroną i łapał wszystkie kliknięcia. `pointer-events: none` wchodzi już w chwili startu
ruchu, nie po jego końcu.

`<noscript>` chowa zasłonę — zdejmuje ją JavaScript, więc bez niego nie miałby jej kto zdjąć.

## Do uzupełnienia

- `site.phone` / `site.phoneHref` w `lib/config.ts` — obecnie `+48 000 000 000`.
- Zdjęcia realizacji (obecnie placeholdery).
- `public/video/*.mp4` to **104,2 MB** — GitHub ostrzega powyżej 50 MB na plik i twardo
  blokuje powyżej 100 MB. `wideo-2.mp4` (59,9 MB) siedzi między tymi progami, więc
  push przechodzi, ale kolejne podniesienie jakości już nie. Przy następnym kroku
  w górę: Git LFS albo hosting wideo poza repozytorium.

## Ładowanie wideo

**Gra zawsze najwyżej jedna scena.** Wideo pauzuje się, gdy jego sekcja wyjdzie
poza kadr, i wraca, gdy do niego wjedzie. Bez tego oba pliki 4K dekodowały się
równolegle przez cały czas — zmierzone: po powrocie na górę strony wideo manifestu
nadal leciało, choć było ekran niżej. Dwa strumienie 4K naraz to podwojony koszt
dekodera na każdą klatkę, a płaci się nim płynnością scrolla.

Hero (`loading="eager"`, domyślne) startuje razem ze stroną. Scena manifestu ma
`loading="lazy"` — atrybut `src` podpina się dopiero, gdy scena zbliży się do kadru
na jeden ekran. Bez tego strona ciągnęła **104,2 MB** przy samym wejściu; teraz **44,3 MB**,
i to pod zasłoną ekranu startowego.

Plakat hero **nie jest już wstępnie pobierany** (`<link rel="preload">` usunięty z
`app/layout.tsx`). Miał sens, gdy był pierwszą rzeczą na ekranie; teraz zasłania go ekran
startowy, więc plakat jest wyłącznie awaryjny — a priorytetowe 140 kB odbierało pasmo
plikowi 51 MB.

Wykrywanie zbliżenia stoi na zwykłym nasłuchu `scroll`, **nie na `IntersectionObserver`**.
Gdyby obserwator z jakiegokolwiek powodu nie zadziałał, cała scena zostałaby na samym
plakacie i scrub nie miałby czego przewijać — a tego trybu awarii nie widać na oko.
Nasłuch scrolla korzysta z tego samego zdarzenia, na którym stoi reszta strony.

## Walidacja formularza

Limity żyją w `formLimits` (`lib/config.ts`) i obowiązują po obu stronach:

| Pole | Min | Max | Dodatkowo |
|---|---|---|---|
| `imie` | 2 | 80 | — |
| `email` | — | 254 | `type="email"` + regexp na serwerze |
| `telefon` | — | 24 | opcjonalne |
| `wiadomosc` | 10 | 1500 | licznik pozostałych znaków |

`maxLength` i `type="email"` w przeglądarce to **afordancja, nie zabezpieczenie** —
żądanie da się wysłać z pominięciem formularza, więc `app/api/kontakt/route.ts`
sprawdza te same progi i odrzuca niepoprawne z `400 invalid-fields` oraz listą pól.
Sprawdza też typ: pole niebędące stringiem leci jako puste, nie wywala trasy.

Z `replyTo` i `subject` wycinane są znaki końca linii — obie wartości pochodzą
od użytkownika i trafiają do nagłówków wiadomości.

Zmierzone na żywej trasie: zły e-mail, za krótkie/za długie imię, za krótka/za długa
wiadomość i pole nietekstowe → `400`; honeypot → `200` (udawany sukces);
poprawne dane przechodzą walidację i idą do SMTP.
