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
│   ├── SmoothScroll.tsx        # 'use client' — Lenis spięty z ScrollTriggerem
│   ├── ScrollVideoScene.tsx    # 'use client' — sticky wideo + scrub GSAP ScrollTrigger
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
│   ├── video/wideo-1.mp4       # hero — 720p, all-intra, 14,6 MB
│   ├── video/wideo-2.mp4       # sekcja manifest — 720p, all-intra, 17,2 MB
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

### 5. Realizacje
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
GSAP-em), tekst przewija się po nim. GSAP ScrollTrigger (`start: 'top top'`,
`end: 'bottom bottom'`, `scrub: 1.1`) mapuje postęp scrolla 0→1 na `video.currentTime`
0→`duration` — scroll w dół przewija wideo w przód, w górę w tył. Wideo dobiega do końca
dokładnie wtedy, gdy sekcja się kończy.

Wideo trwają po 8 s, więc `length={3}` (trzy ekrany scrolla) daje spokojne tempo.
Zmiana tempa = zmiana `length` w `components/sections.tsx`.

Warianty przez `gsap.matchMedia()` — **bez progu szerokości**, żeby wąskie okno i telefon
zachowywały się tak samo jak desktop (pliki są all-intra 720p, więc seek jest tani):

| Warunek | Zachowanie |
|---|---|
| `prefers-reduced-motion: no-preference` | scrub klatek scrollem, każda szerokość okna |
| `pointer: coarse` | `scrub: 0.35` zamiast `1.1` — na telefonie sekunda opóźnienia czyta się jak awaria |
| `prefers-reduced-motion: reduce` | wideo zatrzymane na pierwszej klatce |

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

## Kodowanie wideo pod scrub

Źródła (`../Wideo/Wideo 1.mp4`, `Wideo 2.mp4`) to 1920×1080, 24 fps, 8 s, ~25–40 Mb/s ze
standardowym GOP — każdy seek wymagał tam dekodowania od poprzedniej klatki kluczowej,
stąd lagi. Pliki w `public/video/` są przekodowane na **720p all-intra**: wszystkie
192 klatki to klatki kluczowe (`I`), więc każdy seek to dekodowanie jednej klatki.

`ffmpeg-static` i `ffprobe-static` siedzą w `devDependencies` (binarki lokalne, nie
trafiają na produkcję). Odtworzenie kodowania:

```bash
ffmpeg -y -i "../Wideo/Wideo 1.mp4" -an -vf "scale=1280:-2" -r 24 -c:v libx264 -preset slow -crf 22 -g 1 -keyint_min 1 -sc_threshold 0 -profile:v high -pix_fmt yuv420p -movflags +faststart public/video/wideo-1.mp4
```

`ScrollVideoScene` dodatkowo kwantyzuje `currentTime` do granicy klatki (prop `fps`,
domyślnie 24) — bez tego scrub wysyłał kilka seeków w obrębie tej samej klatki.

`motion` jest w `dependencies`, ale nie jest importowane — pozostałe animacje czekają
na osobne polecenie.

## Do uzupełnienia

- `site.phone` / `site.phoneHref` w `lib/config.ts` — obecnie `+48 000 000 000`.
- Zdjęcia realizacji (obecnie placeholdery).
- `public/video/*.mp4` to 64 MB — jeśli repo ma iść na GitHub, rozważyć Git LFS albo
  hosting wideo poza repozytorium.
