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
│   ├── SmoothScroll.tsx        # 'use client' — Lenis spięty z ScrollTriggerem
│   ├── ScrollVideoScene.tsx    # 'use client' — sticky wideo; tryb `loop` (aktywny) / `scrub` (zachowany)
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
│   ├── video/wideo-1.mp4       # hero — 4K, ping-pong 20 s, 51,2 MB
│   ├── video/wideo-2.mp4       # sekcja manifest — 4K, ping-pong 20 s, 68,6 MB
│   ├── img/poster-1.jpg        # pierwsza klatka wideo-1 (plakat)
│   ├── img/poster-2.jpg        # pierwsza klatka wideo-2 (plakat)
│   └── img/aleksandra-gosk.jpg # portret do sekcji "O mnie"
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
| 6 | Pas CTA | — | `CallToAction` | akcent `--c-accent-deep`, przycisk + telefon |
| 7 | Kontakt | `kontakt` | `Contact` | formularz + telefon + e-mail + IG |
| 8 | Stopka | — | `Footer` | copyright, obszar działania |

### Rytm pasów

Sekcje rozdziela zmiana tonu tła, nie kreska — `border-top` na pełną szerokość czytał się
jak przypadkowy podział. Kolejność: `--c-bg` (O mnie) → `--c-bg-alt` (Usługi) → scena wideo
→ `--c-bg` (Realizacje) → `--c-accent-deep` (CTA) → `--c-bg-alt` (Kontakt).

`padding-top` sekcji jest mniejszy od `padding-bottom` (`--section-y-top` vs `--section-y`,
83 px vs 141 px na desktopie) — przy symetrycznym padding tytuł wisiał zbyt nisko względem
początku pasa.

### 1. Hero
Scena wideo (`ScrollVideoScene`, `length={3}`) na Wideo 1. Panel 1 (dosunięty do dołu):
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

### 5. Realizacje — karuzela (`components/ProjectRail.tsx`)

Kafelek środkowy jest aktywny, sąsiednie cofają się w tło, pod spodem pojawia się
opis aktywnej realizacji. Sterowanie: przyciski, przeciąganie i klawiatura.

Podział pracy — **natywny scroll robi mechanikę, GSAP robi głębię**:

| Zadanie | Kto |
|---|---|
| centrowanie kafelka | `scroll-snap-align: center` |
| przeciąganie palcem, pęd, klawiatura, czytniki | natywny scroll |
| przeciąganie myszą | ~20 linii `pointerdown/move/up` na `scrollLeft` |
| skala + przezroczystość wg odległości od środka | `gsap.quickSetter` |
| przenikanie opisu przy zmianie | `gsap.fromTo` |

Nie przeniosłem karuzeli na `Flip` + `Observer` ze starego repo (230 linii, rotujące
okno pięciu slotów, blokady `busy`, bezpiecznik `delayedCall` i udokumentowana pułapka
z `overwrite`). Sześć realizacji to lista skończona — przyciski gasną na końcach,
zamiast udawać nieskończoną pętlę.

**Zapętlenie:** lista renderuje się trzy razy, start na środkowej kopii. Gdy aktywny
kafelek wyjdzie poza nią, `scrollLeft` przeskakuje o szerokość jednej kopii — treść jest
identyczna, więc skok jest niewidoczny. Przeskok idzie dopiero po 140 ms ciszy, żeby nie
przerwać trwającej animacji `scrollBy`. Licznik pokazuje `indeks % 6`.

**Strzałki** leżą nakładką na kadrze (`.ag-rail__nav`, `position: absolute`), przy jego
skrajach i wyśrodkowane w pionie — wcześniej siedziały pod opisem i przy niskim oknie
schodziły poniżej krawędzi ekranu. Poniżej 900 px przechodzą pod karuzelę (`position: static`),
bo nakładka zabierałaby zbyt dużo z i tak małego kafelka.

Cztery rzeczy, które trzeba wiedzieć przy modyfikacji:

- **`.ag-rail__track` musi mieć `width: max-content`.** Bez tego tor ma szerokość kadru,
  kafelki wystają poza jego border-box, a `padding-right` ląduje POD nimi zamiast za
  ostatnim — ostatni kafelek nie daje się dosunąć do środka i przewijanie „zatrzymuje się"
  przed końcem listy (zgłoszone jako „nie działa przejście z 5 na 6").
- **Cały łańcuch potrzebuje `min-width: 0`** (`.ag-section__body`, `.ag-rail`
  z `grid-template-columns: minmax(0, 1fr)`, `.ag-rail__stage`, `.ag-rail__viewport`).
  Domyślne `min-width: auto` przepuszcza `max-content` toru w górę drzewa i rozpycha
  sekcję na 8000 px zamiast włączyć przewijanie.

- **`.ag-rail__viewport` musi mieć `position: relative`.** Bez tego `offsetLeft`
  kafelków liczy się od `.ag-section` (ona jest pozycjonowana), a JS porównuje je
  ze `scrollLeft` kadru — środek wychodzi przesunięty i aktywny kafelek nigdy nie
  dochodzi do skali 1.
- **Przeciąganie wyłącza `scroll-snap-type` na czas trzymania.** Przy `mandatory`
  każda pozycja pośrednia jest natychmiast cofana do punktu snapu, więc `scrollLeft`
  nie drgnie. Po puszczeniu snap wraca i dociąga do najbliższego kafelka.

**Kadr NIE ma `data-lenis-prevent` — i nie wolno go dodać z powrotem.** Ten atrybut
jest dla elementów z własnym przewijaniem **w pionie**; karuzela ma `overflow-y: hidden`,
więc oddawał tylko koło przeglądarce: strona przewijała się natywnie i skokowo, a Lenis
animował dalej ze swojej nieaktualnej pozycji. Objaw — zacinanie scrolla, gdy kursor stał
nad sekcją Realizacje. Test rozstrzygający: zdarzenie `wheel` nad kadrem musi mieć
`defaultPrevented === true`, tak samo jak nad zwykłą sekcją.

Kosztem jest poziome przewijanie gładzikiem nad karuzelą — Lenis przechwytuje całe
zdarzenie `wheel`. Sterowanie niosą przyciski, przeciąganie i swipe.

Dwie rzeczy zrobione pod płynność samej karuzeli:

- **Bez `will-change` na kafelkach.** Jest ich 18 (potrojona lista), a każdy promowany
  do własnej warstwy kompozytora kosztuje pamięć i sam potrafi wywołać zacinanie.
- **Geometria kafelków czytana raz**, nie przy każdym zdarzeniu `scroll` — wcześniej
  każde przewinięcie wymuszało 18 odczytów layoutu. Przeliczana ponownie na `resize`.

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

Zapętlone tło trwa 20 s i startuje samo, więc podlega **WCAG 2.2.2 (Pause, Stop, Hide)**.
Przy `prefers-reduced-motion: reduce` wideo nie rusza w ogóle — zostaje pierwsza klatka,
tak samo jak w trybie `scrub`. Zasłona startowa schodzi normalnie, bo gotowość melduje
się niezależnie od tego, czy coś gra.

Wideo trwają po 20 s (10 s materiału + 10 s odwrotki), `length={3}` daje spokojne tempo.
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
(gdyby `--section-y` było mniejsze od prześwitu). `lock: true` nie pozwala przypadkowemu
ruchowi kółka zatrzymać widoku w pół drogi.

`scroll-padding-top` = `--nav-h + --nav-offset + --s-5` → 84 px na desktopie
(27 px prześwitu pod paskiem) i 32 px na mobile, gdzie pasek stoi u dołu.

Sprawdzone przy 1280×720 i 375×812: nagłówek każdej z czterech zakładek ląduje na stałej
wysokości, a w kadrze nie ma żadnej innej sekcji.

## Kodowanie wideo

Źródła: `../Wideo/Wideo v1.mp4` → hero, `../Wideo/Wideo v2.mp4` → manifest.
Mastery to **3840×2160, HEVC 10-bit, 24 fps, 10,04 s** (39 i 62 Mb/s).

Pliki w `public/video/` mają **ping-pong wpisany w plik**: za materiałem właściwym
(241 klatek) idzie ten sam materiał odwrócony i przycięty o klatkę z obu stron
(239 klatek). Razem 480 klatek / 20,0 s. Dzięki temu natywne `loop` odtwarza w kółko
tam i z powrotem — bez jednej linijki JS, bez seekowania i bez szansy na zacięcie.

Przycięcie odwrotki jest obowiązkowe: bez `trim` klatka skrajna leci dwa razy pod rząd
i na każdym zawrocie widać przytrzymanie.

**Rozdzielczość zostaje 4K — bez skalowania w dół.** Skoro nie scrubujemy, znika powód
dla all-intra, więc zwykły GOP (`-g 48`) kupuje budżet na pełne 3840×2160:

| | 720p all-intra, 8 s (pierwotnie) | 4K GOP, 20 s ping-pong (teraz) |
|---|---|---|
| wideo-1 | 15,3 MB @ 15,3 Mb/s | 51,2 MB @ 20,5 Mb/s |
| wideo-2 | 18,1 MB @ 18,0 Mb/s | 68,6 MB @ 27,4 Mb/s |

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

Zmierzone w przeglądarce: `videoWidth × videoHeight` = **3840 × 2160**, 356 klatek
zdekodowanych, **0 opuszczonych**, przejście przez punkt zawrotu (10,04 s) bez przerwy.

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
- `public/video/*.mp4` to **119,8 MB** — GitHub ostrzega powyżej 50 MB na plik i twardo
  blokuje powyżej 100 MB. `wideo-2.mp4` (68,6 MB) siedzi między tymi progami, więc
  push przechodzi, ale kolejne podniesienie jakości już nie. Przy następnym kroku
  w górę: Git LFS albo hosting wideo poza repozytorium.

## Ładowanie wideo

Hero (`loading="eager"`, domyślne) startuje razem ze stroną. Scena manifestu ma
`loading="lazy"` — atrybut `src` podpina się dopiero, gdy scena zbliży się do kadru
na jeden ekran. Bez tego strona ciągnęła **119,8 MB** przy samym wejściu; teraz **51,2 MB**,
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
