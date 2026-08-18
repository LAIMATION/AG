# DESIGN_SYSTEM.md — Aleksandra Gosk / ATRIUM STUDIO

Referencja tokenów. Źródło implementacji: `styles/tokens.css`.
System wyprowadzony z materiału ATRIUM STUDIO: techniczna precyzja architektury
plus bezpośrednia, ludzka rozmowa. Charakter: **rzeczowy, precyzyjny, ciepły,
transparentny, spokojny**.

Hierarchia marki: na pierwszym planie **Aleksandra Gosk**, ATRIUM STUDIO jako szyld
w drugim (lockup w stopce, podpis pod manifestem). Narracja na „Ty".

## Kolor

Paleta komplementarna: neutralna baza (krem/granat) i jeden nasycony akcent,
używany oszczędnie i konsekwentnie.

| Token | Wartość | Zastosowanie |
|---|---|---|
| `--c-bg` | `#f5f2ea` | krem — tło podstawowe |
| `--c-bg-alt` | `#ffffff` | biel — pas rozdzielający sąsiednie sekcje |
| `--c-surface` | `#ffffff` | karty, formularz |
| `--c-line` | `#c9c7be` | szarość kreślarska — linie, obrysy, tekstura blueprint |
| `--c-ink` | `#1b2733` | nagłówki |
| `--c-ink-soft` | `#33445a` | granat atramentowy — tekst ciągły |
| `--c-muted` | `#5c6b7d` | podpisy, meta, wersaliki |
| `--c-accent` | `#e07b2c` | pomarańcz sygnałowy — linie, wypełnienia CTA |
| `--c-accent-ink` | `#a85512` | **tekst** pisany akcentem |
| `--c-accent-soft` | `#f3d3b0` | akcent na ciemnym tle |
| `--c-inverse` | `#1f2a35` | głęboki granat — scrim, tekst na pomarańczu |
| `--c-inverse-ink` | `#f2eee4` | tekst na zdjęciach i granacie |

### Dwa odstępstwa od materiału źródłowego — oba wymuszone kontrastem

1. **`--c-muted` to `#5c6b7d`, nie `#6b7a8c`.** Oryginał na kremie daje **3,9:1**,
   a w tej roli chodzą 12 px wersaliki. Po przyciemnieniu **4,9:1**.
2. **`--c-accent` nigdy nie niesie tekstu.** `#e07b2c` na kremie to **2,7:1**.
   Do pisania akcentem służy `--c-accent-ink` (**4,8:1**); sam `--c-accent` jest
   od linii i pełnych wypełnień.

Na pomarańczowym pasie CTA tekst jest **granatowy**, nie biały: biel dałaby 3,0:1,
granat daje **4,9:1**. Tak samo aktywna zakładka w pasku nawigacji.

Zmierzone po wdrożeniu: akapit 8,9:1 · nagłówek 13,6:1 · lead 8,9–9,9:1 ·
wersaliki 4,9–5,5:1 · hasło CTA 4,9:1 · przycisk 18,1:1.

## Typografia

**Jedna rodzina groteskowa w skrajnych wagach** — Archivo (`latin-ext`, waga 400/500/600/900).
Krój skryptowy — Playball — **wyłącznie jako pojedyncza linia na fotografii**
(hero i manifest); poza wideo nie występuje. Sprawdzone: Playball ma komplet
polskich znaków łącznie z `ł`.

| Rola | Waga | Rozmiar | Interlinia |
|---|---|---|---|
| Display (hasło hero) | **900** | `clamp(2.75rem, 8vw, 7rem)` | `0.95` |
| Hasło CTA | **900** | `clamp(1.75rem, 3.4vw, 3rem)` | `1.06` |
| Nagłówek sekcji | 500 | `clamp(1.75rem, 3vw, 2.75rem)` | `1.08` |
| Nagłówek karty | 500 | `clamp(1.125rem, 1.25vw, 1.375rem)` | `1.08` |
| Lead | 400 | `clamp(1.0625rem, .5vw + .95rem, 1.25rem)` | `1.45` |
| Body | 400 | `clamp(1rem, .3vw + .92rem, 1.0625rem)` | `1.55` |
| Eyebrow / etykieta | 600 | `.75rem` uppercase, tracking `.1em` | — |
| Stopka / lockup | 500 | `.75rem` uppercase, tracking `.14em` | — |
| Skrypt (na foto) | 400 | `clamp(1.375rem, 2.6vw, 2rem)` | `1.2` |

Waga 900 jest zarezerwowana dla dwóch haseł — hero i pas CTA. Rozlana na nagłówki
sekcji straciłaby siłę.

Podłogi skali są w px, nie w `vh`: wysokość okna nie może decydować o tym, czy
tekst da się przeczytać. Luz oddają zdjęcia i odstępy, nigdy tekst.

Hasło CTA łamie się na kilka linii małymi literami, więc dostało `1.06` zamiast
systemowych `0.95` — przy tej ciasnocie `ł/ę` z jednej linii dotykały następnej.

## Kształt

**`--radius: 0` w całym systemie. Zero cieni.** Płaska, kreślarska precyzja —
głębię niosą linie i kontrast tła, nie rozmycie. Dotyczy też paska nawigacji
i przycisku powrotu: prostokąty na hairline, bez zaokrągleń i bez cienia.

### Matowe szkło (pasek nawigacji, przycisk powrotu)

Jedyne miejsce, gdzie system dopuszcza rozmycie. Tło ma **przebijać** przez płytkę,
więc krycie jest niskie (`.62` jasne / `.58` ciemne), a robotę robi
`backdrop-filter: blur(24px) saturate(1.2)`.

Zaznaczenie aktywnej zakładki to **półprzezroczysty pomarańcz, nie własny
`backdrop-filter`**. Element z `backdrop-filter` staje się backdrop rootem dla
potomków, więc zagnieżdżone rozmycie próbkowałoby płaskie tło paska i nie dałoby
nic. Przezroczysta plama przepuszcza już rozmyte tło paska, tylko podbarwione.

Krycie plamy różni się między tonacjami, bo różni się kolor tekstu — nad ciemnym
tłem plama wychodzi ciemna i granat na niej nie przechodzi:

| Tonacja | Plama | Tekst | Kontrast |
|---|---|---|---|
| jasna | `rgba(224,123,44,.62)` | granat `#1f2a35` | **7,2:1** |
| ciemna | `rgba(224,123,44,.45)` | krem `#f2eee4` | **4,7:1** |

Sam pasek: 13,0:1 na jasnym, 7,5–9,5:1 nad wideo (najgorsza z próbkowanych klatek).

### Linia spinająca

Sygnaturowy element: **48 × 2 px w akcencie**, nad etykietą i nad stopką.
W kodzie klasa `.ag-rule` (pseudoelement, zero dodatkowego markupu).

## Przestrzeń

Skala 4 px: `--s-1` … `--s-11` = `0.25 / 0.5 / 0.75 / 1 / 1.5 / 2 / 3 / 4 / 6 / 8 / 10 rem`.

| Token | Wartość |
|---|---|
| `--gutter` | `clamp(1.25rem, 9vw, 6rem)` — margines ~9–10 % szerokości kadru, jak w materiale |
| `--section-y-top` / `--section-y` | `clamp(3rem, 6.5vw, 6rem)` / `clamp(5rem, 11vw, 10rem)` |
| `--maxw` / `--maxw-text` | `1440px` / `62ch` |
| `--nav-h` / `--nav-offset` | `52px` / `clamp(.75rem, 2vh, 1.5rem)` |

Gęstość rozrzedzona, wyrównanie do lewej, blok treści w dolnej lub środkowej części kadru.

## Breakpointy

| Próg | Zmiana |
|---|---|
| `≤599px` | realizacje → 1 kolumna, wiersz formularza → 1 kolumna |
| `≤767px` | nawigacja na dół, pełna szerokość; `padding-bottom` na `body` |
| `≤899px` | zakres → 1 kolumna; „O mnie" i „Kontakt" → 1 kolumna; sekcja może urosnąć ponad ekran |
| `≤1023px` | zakres → 2 kolumny |

## Cele dotykowe

Każdy `<a>` i `<button>` ma co najmniej **44 px** wysokości — łącznie z linkami
`tel:`/`mailto:`, które jako sam wiersz tekstu mają ~25 px. Realizuje to
`display: inline-flex; align-items: center; min-height: 44px`.

## Ruch

Przejścia stanu (hover, nawigacja, focus) + sceny wideo sterowane scrollem
(GSAP ScrollTrigger — patrz SITE_STRUCTURE.md). Materiał źródłowy jest statyczny;
animacje pochodzą z wideo i zostały zachowane bez zmian.

## Zasady stosowania

1. Kolor niesie hierarchię, nie dekorację — pełne wypełnienie akcentem występuje
   na stronie **raz**, w pasie przed kontaktem.
2. Zero zaokrągleń, zero cieni. Rozdziela linia 1 px albo zmiana tonu tła.
3. Skrypt tylko na fotografii i tylko jedna linia.
4. Waga 900 tylko na hasła.
5. Nowe komponenty korzystają wyłącznie z tokenów.
