# DESIGN_SYSTEM.md — Aleksandra Gosk

Referencja tokenów. Źródło implementacji: `styles/tokens.css`.
Kierunek: quiet luxury — jasna, ciepła paleta, wysoki kontrast typograficzny,
dużo powietrza, minimum ozdobników.

## Kolor

Paleta wyprowadzona z profilu IG (`architekt_gosk_aleksandra`): ciepłe beże, taupe,
brąz, off-white. Zero saturowanych akcentów.

| Token | Wartość | Zastosowanie |
|---|---|---|
| `--c-bg` | `#f6f3ee` | tło strony (alabaster) |
| `--c-bg-alt` | `#ece5da` | ciemniejszy pas rozdzielający sąsiadujące sekcje |
| `--c-surface` | `#fdfbf8` | karty, formularz |
| `--c-stone` | `#ebe5db` | wypełnienia, placeholdery |
| `--c-line` | `#ddd6ca` | linie, obrysy |
| `--c-line-soft` | `#e8e2d8` | linia pod nawigacją |
| `--c-ink` | `#1c1a17` | nagłówki, tekst mocny |
| `--c-ink-soft` | `#4a453e` | akapity |
| `--c-muted` | `#6f675d` | podpisy, meta, labelki |
| `--c-accent` | `#8a7358` | akcent (brąz/taupe): numery usług, focus, hover, krawędź formularza |
| `--c-accent-soft` | `#b9a88f` | zaznaczenie tekstu, obrys placeholdera |
| `--c-accent-deep` | `#6b563f` | tło pasa CTA — `--c-accent` daje z jasnym tekstem tylko 4,0:1 |

### Rytm pasów

Sekcje rozdziela zmiana tonu tła, nie kreska. Krok `--c-bg` → `--c-bg-alt` to **1,13:1**
luminancji — czytelna granica, która nie wprowadza drugiego koloru do palety. Karty usług
siedzą na tym pasie w `--c-surface` (**1,21:1** względem pasa), więc sekcja Usługi odcina
się od „O mnie" podwójnie: tłem i jaśniejszymi kaflami.

`--c-muted` zjechało z `#8b8378` na `#6f675d`, bo wersaliki na ciemniejszym pasie schodziły
poniżej 3:1. Po zmianie: **4,45:1** na `--c-bg-alt` i **5,03:1** na `--c-bg`.

### Na wideo (inverse)

| Token | Wartość |
|---|---|
| `--c-inverse` | `#14120f` |
| `--c-inverse-ink` | `#f6f3ee` |
| `--c-inverse-muted` | `rgba(246,243,238,.82)` |
| `--c-inverse-line` | `rgba(246,243,238,.30)` |
| `--c-overlay` | gradient `rgba(20,18,15,.62) → .44 → .72` |

Czytelność na wideo stoi na trzech warstwach: bazowe `--c-overlay` przypięte do ekranu
(sticky media), **jeden ciągły scrim** `.ag-scene__content::before` rozpięty na całą scenę
oraz `text-shadow` na treści. Scrim jest jednym gradientem ze stopami w `svh`
(`0 → .5 @60svh → .62 @100svh → .5 @140svh → 0 @100%`), a nie maską pod każdym panelem —
dzięki temu przyciemnienie przechodzi przez granice paneli bez widocznego cięcia.

Zmierzony najgorszy kontrast na najjaśniejszym pikselu w pasie tekstu, na próbkach
klatek obu wideo: **6,7:1** dla tekstu ciągłego, **10:1** pod nagłówkiem hero.

Kontrast: `--c-ink` na `--c-bg` ≈ 14.8:1, `--c-ink-soft` na `--c-bg` ≈ 8.4:1,
`--c-muted` na `--c-bg` ≈ 3.4:1 (tylko wersaliki ≥11 px, nie dla tekstu ciągłego).

## Typografia

Dwa kroje z Google Fonts, ładowane przez `next/font/google` (subsety `latin` + `latin-ext`).

| Rola | Krój | Waga | Token |
|---|---|---|---|
| Display / nagłówki / liczby | **Cormorant Garamond** | 300, 400 | `--f-display` |
| Tekst, UI, labelki | **Jost** | 300, 400, 500 | `--f-sans` |

Cormorant Garamond — wysokokontrastowa antykwa, „artystyczna" i ponadczasowa,
odpowiada serifom z grafik IG. Jost — geometryczny grotesk (linia Futury),
neutralny nośnik treści; w wersalikach z dużym trackingiem daje efekt „luxury label".

### Skala

| Token | Wartość | Użycie |
|---|---|---|
| `--fs-display` | `clamp(3rem, 9vw, 8.5rem)` | imię w hero |
| `--fs-h1` | `clamp(2.5rem, 6vw, 5rem)` | rezerwa |
| `--fs-h2` | `clamp(2rem, 3.4vw, 3.25rem)` | nagłówki sekcji |
| `--fs-h3` | `clamp(1.25rem, 1.4vw, 1.5rem)` | tytuły usług |
| `--fs-lead` | `clamp(1.125rem, .6vw + 1rem, 1.375rem)` | leady |
| `--fs-body` | `clamp(1rem, .35vw + .9rem, 1.125rem)` | tekst |
| `--fs-small` | `.875rem` | meta, stopka |
| `--fs-eyebrow` | `.75rem` | wersaliki nad nagłówkiem |

**Podłogi skali są w px, nie w `vh`.** Wcześniejsza wersja wiązała stopień pisma
z wysokością okna, żeby sekcja mieściła się w jednym ekranie — na 900 px wysokości
dawało to 14,4 px akapitu, czyli poniżej progu czytelności. Zasada jest odwrotna:
**luz oddają zdjęcia i odstępy, nigdy tekst**. Zmierzone po zmianie na 1440×900:
akapit 18 px / 72 znaki w wierszu, lead 22 px / 59 znaków, na 375 px — 16 px / 42 znaki.

### Interlinia i tracking

| Token | Wartość |
|---|---|
| `--lh-tight` | `1.1` (display) |
| `--lh-heading` | `1.2` |
| `--lh-lead` | `1.55` |
| `--lh-body` | `1.7` |

Interlinia nagłówków wzrosła z `1.14` na `1.2`, bo Cormorant przy tej ciasnocie obcinał
ogonki „ą/ę" i zejścia „j/y" — polski tekst potrzebuje tu więcej powietrza niż angielski.
| `--ls-display` | `-0.02em` |
| `--ls-heading` | `-0.01em` |
| `--ls-eyebrow` | `0.22em` |
| `--ls-label` | `0.14em` |

Zasady: nagłówki zawsze waga 300; wersaliki tylko dla eyebrow/labelek/przycisków;
długość wiersza tekstu ograniczona do `--maxw-text` = `62ch`.

### Cele dotykowe

Każdy `<a>` i `<button>` ma co najmniej **44 px** wysokości — łącznie z linkami
`tel:`/`mailto:`, które jako sam wiersz tekstu miały 25 px. Zapewnia to
`display: inline-flex; align-items: center; min-height: 44px`, więc wiersz nie rośnie
optycznie, a obszar kliknięcia tak. `--nav-h` to `52px` = 44 px celu + 4 px paddingu
płytki po obu stronach.

## Przestrzeń

Skala 4 px: `--s-1` … `--s-11` = `0.25 / 0.5 / 0.75 / 1 / 1.5 / 2 / 3 / 4 / 6 / 8 / 10 rem`.

| Token | Wartość | Znaczenie |
|---|---|---|
| `--section-y` | `clamp(5rem, 11vw, 10rem)` | dolny pion sekcji (mobile: `clamp(4rem, 14vw, 6rem)`) |
| `--section-y-top` | `clamp(3rem, 6.5vw, 6rem)` | górny pion sekcji — mniejszy, żeby tytuł nie wisiał nisko |
| `--gutter` | `clamp(1.25rem, 5vw, 5rem)` | margines boczny |
| `--maxw` | `1440px` | maks. szerokość kontenera `.ag-shell` |
| `--maxw-text` | `62ch` | maks. długość wiersza |

## Breakpointy

| Próg | Zmiana |
|---|---|
| `≤599px` | realizacje → 1 kolumna, wiersz formularza → 1 kolumna |
| `≤767px` | pasek nawigacji przenosi się na dół i rozciąga na pełną szerokość; usługi → 1 kolumna; `padding-bottom` na `body` |
| `≤899px` | „O mnie" i „Kontakt" → 1 kolumna; fakty → pionowo |
| `≤1023px` | realizacje → 2 kolumny |
| `≥1024px` | pełny układ desktopowy |

## Detal i ruch

| Token | Wartość |
|---|---|
| `--radius` | `2px` |
| `--radius-media` | `3px` |
| `--radius-nav` | `20px` |
| `--border` | `1px solid var(--c-line)` |
| `--nav-h` / `--nav-offset` | `46px` / `clamp(.75rem, 2vh, 1.5rem)` |
| `--fab-bottom` | `--nav-offset` (mobile: nad dolnym paskiem) |
| `--c-glass` | `rgba(250,247,242,.32)` |
| `--c-glass-edge` | `rgba(255,255,255,.50)` |
| `--c-glass-active` | `rgba(255,255,255,.44)` |
| `--c-glass-dark` | `rgba(26,23,19,.28)` |
| `--c-glass-dark-edge` | `rgba(255,255,255,.22)` |
| `--c-glass-dark-active` | `rgba(255,255,255,.16)` |
| `--shadow-glass` / `--shadow-glass-dark` | cień zewnętrzny + `inset` rozjaśnienie górnej krawędzi |

Mleczne szkło to jedyne miejsce w systemie, gdzie występuje cień — pasek unosi się nad
treścią i wideo, więc potrzebuje oderwania od tła. Reszta interfejsu nadal stoi na liniach.

Szkło żyje w jednej klasie `.ag-glass`, z której korzystają pasek nawigacji i pływający
przycisk powrotu — nie mogą się więc rozjechać wizualnie. Trzy warstwy, każda z osobnym
zadaniem:

1. `backdrop-filter: blur(28px) saturate(1.6)` — całe wrażenie „szkła" robi rozmycie tła,
   nie krycie warstwy.
2. `background-color` w tonacji (`--c-glass` / `--c-glass-dark`) — **płaski kolor, nigdy
   gradient**. Gradient siedzi w `background-image`, które się nie interpoluje, więc przy
   przełączaniu tonacji tło przeskakiwało, podczas gdy obrys i tekst jeszcze płynęły.
3. `.ag-nav__bar::before` — stały połysk (biel `.20` u góry → `0` w połowie → `.07` u dołu),
   identyczny w obu tonacjach, więc zmiana tonu nic tu nie rusza.

Wszystkie animowane właściwości (tło, obrys, cień, kolor tekstu) chodzą na `var(--dur)`.

Warstwa jest celowo przezierna (krycie .28–.32), więc **żaden pojedynczy kolor tekstu
nie jest czytelny i na wideo, i na jasnej stronie** — stąd dwie tonacje przełączane
atrybutem `data-tone`. Zmierzony kontrast napisów na 18 próbkowanych klatkach obu wideo:
**4,7:1** w najgorszym przypadku, mediana **5,2:1**; na jasnym szkle nad stroną **16:1**.
| `--ease` | `cubic-bezier(.22,.61,.36,1)` |
| `--dur-fast` / `--dur` / `--dur-slow` | `180ms` / `320ms` / `620ms` |
| `--z-nav` / `--z-overlay` | `100` / `50` |

Ruch: przejścia stanu (hover, nawigacja, focus) + sceny wideo sterowane scrollem
(GSAP ScrollTrigger, `scrub: 0.6`, `ease: 'none'` — patrz SITE_STRUCTURE.md).
`motion` zainstalowane, ale jeszcze nieużywane; pozostałe animacje czekają na osobny etap.

## Zasady stosowania

1. Kolor niesie hierarchię, nie dekorację — `--c-accent` maksymalnie kilka razy na ekran.
2. Linia 1 px zamiast cienia; jedyny wyjątek to szklany pasek nawigacji.
3. Sekcje rozdziela `--section-y` i zmiana tonu tła (`.ag-section--alt`), nie linie
   na pełną szerokość. Pas w kolorze akcentu występuje na stronie **raz** — przed kontaktem.
4. Wideo zawsze pod przyciemnieniem — tekst na wideo tylko w kolorach `inverse`.
5. Nowe komponenty korzystają wyłącznie z tokenów; brak wartości „na sztywno" w CSS sekcji.
