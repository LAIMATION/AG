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
| `--c-inverse-rgb` | `31 42 53` | ta sama barwa w składowych — do przyciemnień z alfą, `rgb(var(--c-inverse-rgb) / .74)` |
| `--c-inverse-ink` | `#f2eee4` | tekst na zdjęciach i granacie |
| `--c-error` | `#b03a2e` | stan błędu formularza — 5,4:1 na kremie, 6,0:1 na bieli |

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

## Tryb ciemny

**To nie jest inwersja jasnego motywu, tylko druga historyczna postać tego samego
rysunku: blueprint.** Krem z granatowym tuszem odwraca się w granat z jasną kreską —
dlatego bazą jest ten sam granat, który w jasnym motywie niesie scrim.

Włącza go przycisk (`components/ThemeToggle.tsx`), wybór trzyma `localStorage`.
Domyślny jest motyw jasny; przejście na `prefers-color-scheme` to jedna linia
w skrypcie w `app/layout.tsx`, gdyby kiedyś miało iść za ustawieniem systemu.

### Odwracają się wyłącznie tokeny strony

| Token | Jasny | Ciemny | Kontrast w ciemnym |
|---|---|---|---|
| `--c-bg` | `#f5f2ea` | `#14202b` | — |
| `--c-bg-alt` / `--c-surface` | `#ffffff` | `#1b2a37` | 1,13 wobec tła (jasny ma 1,12) |
| `--c-line` | `#c9c7be` | `#44586c` | **2,25** (jasny: 1,51) |
| `--c-line-soft` | `#e2e0d6` | `#2c4152` | tekstury kreślarskie |
| `--c-ink` | `#1b2733` | `#f2eee4` | **14,3:1** |
| `--c-ink-soft` | `#33445a` | `#dcd8ce` | **11,6:1** |
| `--c-muted` | `#5c6b7d` | `#93a1af` | **6,3:1** |
| `--c-accent-ink` | `#a85512` | `#f0a45a` | **8,0:1** (jasny: 4,8:1) |
| `--c-error` | `#b03a2e` | `#f0847a` | **6,5:1** |

**Rodzina `--c-inverse*`, `--c-overlay` i szkło zostają nietknięte.** Nie znaczą
„przeciwieństwo motywu", tylko „stała para nad zdjęciem i nad pomarańczowym pasem".
Dzięki temu scena wideo i pas CTA wyglądają w obu motywach identycznie — i tak mają.
To ta jedna decyzja sprawia, że cały tryb ciemny mieści się w kilkunastu liniach.

**Pomarańcz wypełnień się nie zmienia** — to sygnatura marki i na granacie działa.
Zmienia się tylko odmiana tekstowa: na kremie musiała ciemnieć do brązu (4,8:1),
na granacie może pojaśnieć i wychodzi 8,0:1.

**Hairline jest mocniejszy niż w jasnym motywie** (2,25 wobec 1,51 na kremie): na ciemnym
tle cienka linia gubi się szybciej, a to na niej stoi cały podział na pola. Tekstury
kreślarskie w Realizacjach i bibliotece odwracają się same, bo stoją na tych tokenach —
i dopiero na granacie wyglądają jak to, czym są, czyli blueprint.

`color-scheme: dark` ustawiane razem z motywem — bez tego paski przewijania i natywne
pola formularza zostają jasne i odcinają się od strony.

### Zmierzone

Przemiat kontrastu przez sekcje, stopkę, formularz, regał i galerię:
**149 elementów w każdym motywie, zero poniżej progu WCAG AA.**

### Bez błysku przy wejściu

Motyw nakłada skrypt w `app/layout.tsx` wykonywany **przed pierwszym malowaniem**.
Gdyby ustawiał go dopiero React po hydratacji, użytkownik trybu ciemnego dostawałby
błysk jasnej strony przy każdym wejściu — a zasłona startowa też jest jasna, więc by
go nie zakryła. Skrypt ustawia też `theme-color`, czyli barwę paska adresu na mobile.

Sam `ThemeToggle` startuje ze stanem `light` i dociąga prawdziwy po zamontowaniu:
serwer nie zna `localStorage`, więc każde zgadywanie w renderze kończy się rozjazdem
z HTML-em. Ten stan steruje wyłącznie ikoną i etykietą — motyw jest już na `<html>`.

## Typografia

**Jedna rodzina groteskowa w skrajnych wagach** — Archivo jako **krój zmienny**
(oś 100–900, jeden plik na subset zamiast pliku na wagę).
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

### Znak studia — lockup ATRIUM / STUDIO

Dwuwierszowy znak w hero, odwzorowany z logotypu. Jego tożsamość to trzy rzeczy:
**wersaliki w wadze regularnej, szerokie światło międzyliterowe i „STUDIO" dosunięte
do prawej krawędzi „ATRIUM"**.

| | Stopień | Waga | Światło |
|---|---|---|---|
| ATRIUM | `clamp(1.625rem, 2.6vw, 2.25rem)` | 400 | `.16em` |
| STUDIO | `max(.6875rem, .34em)` | 400 | `.26em` |

**Stopień niesie cały znak, wiersze liczą się w `em` od niego.** Przy dwóch niezależnych
`clamp`ach stosunek wierszy pływał z szerokością okna (zmierzone 0,55 na wąskim wobec
0,33 na szerokim), a w logotypie jest stały. Teraz 0,34 na szerokim i 0,42 na wąskim —
`max()` nie pozwala drugiemu wierszowi zejść poniżej 11 px, bo w tym systemie
czytelność wygrywa z wiernością odwzorowania.

Światło **rośnie** wraz ze zmniejszeniem stopnia (`.16em` → `.26em`): mniejszy stopień
znosi więcej światła, więc przy równej wartości drugi wiersz czytałby się jako ciaśniejszy.
To jedyne miejsce w systemie, gdzie tracking idzie w górę — w znaku światło nie jest
dostrojeniem, tylko samą tożsamością.

**Oba wiersze mają ujemny margines prawy równy własnemu światłu.** `letter-spacing`
dokłada światło także za ostatnią literą, więc bez tej korekty „STUDIO" wyrównywałoby
się do pustki za „M", a nie do samego „M". Sprawdzone eksperymentem: bez korekty tusz
rozjeżdża się o 1,3 px, z korektą stoi równo na wszystkich trzech szerokościach.

Znak stoi w górnej krawędzi pierwszego ekranu, na **tej samej osi pionowej** co eyebrow,
hasło i nazwisko. Hierarchia marki zostaje nietknięta: znak ma 36 px w wadze 400,
nazwisko `clamp(2.75rem, 8vw, 7rem)` w wadze 900. Kolor kremowy `--c-inverse-ink`,
kontrast **12,6:1** na scrimie sceny.

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

Kafle w sekcji „Zakres" są **kremowe na białym pasie**. Wcześniej stały na
`--c-surface`, czyli tym samym `#ffffff` co pas pod nimi — znikały w tle, a hover
prowadził do koloru, który już tam był.

### Linia spinająca

Sygnaturowy element: **48 × 2 px w akcencie**, nad etykietą i nad stopką.
W kodzie klasa `.ag-rule` (pseudoelement, zero dodatkowego markupu).

## Ruch

Strona ma **jeden autorski moment ruchu**: zejście ekranu startowego. Reszta to
przejścia stanów — hover, ton paska, zmiana opisu w karuzeli — na `--dur` i `--ease`.

| Token | Wartość | Zastosowanie |
|---|---|---|
| `--ease` | `cubic-bezier(.22,.61,.36,1)` | wszystkie przejścia stanów |
| `--dur-fast` / `--dur` / `--dur-slow` | `180` / `320` / `620 ms` | jw. |
| `--dur-boot` | `900ms` | zejście ekranu startowego |
| `--ease-boot` | `cubic-bezier(.76,0,.24,1)` | jw. — rusza wolno, wyhamowuje |

### Ekran startowy

Zasłona w `--c-bg` na czas dociągania hero (wideo waży kilkanaście MB). Wychodzi
**jednym ruchem w górę**, jak arkusz zdejmowany z deski kreślarskiej — nie wygaszeniem.
Krzywa `--ease-boot` jest symetryczna i wolna na starcie, żeby ruch czytał się jak
podniesienie, a nie jak zamknięcie okna.

Treść: nazwisko (`--fs-h2`, waga 500, **13,6:1**), pod nim lockup studia i regionu
(`--fs-eyebrow`, wersaliki, **4,9:1**). Zero logotypu, zero spinnera.

Pasek postępu to **linia spinająca systemu** — ten sam element, który stoi nad każdą
etykietą, tutaj po prostu pracuje: 2 px, `--c-accent` na torze `--c-line`, rośnie
`scaleX` (kompozytor, zero layoutu). Zatrzymuje się na **92%**, nie na 100% — pasek
nie ma prawa zameldować końca, zanim hero faktycznie nie ma czym grać. Domyka go
dopiero moment zejścia.

Przy `prefers-reduced-motion: reduce` arkusz nie jedzie przez ekran i pasek nie rośnie:
zasłona gaśnie, linia stoi pełna.

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
| `≤599px` | wiersz formularza → 1 kolumna |
| `≤899px` | nawigacja na dół; zakres → 1 kolumna; „O mnie" i „Kontakt" → 1 kolumna; strzałki karuzeli pod kadr; sekcja może urosnąć ponad ekran |
| `≤1199px` | zakres → 2 kolumny |

Skala to **600 / 900 / 1200**. Wcześniej progi stały na 599 / 767 / 899 / 1023, przez co
między 768 a 899 px wychodziła strefa niczyja: górny pasek nawigacji przy w pełni
jednokolumnowym układzie i strzałkach karuzeli już zepchniętych pod kadr. Nawigacja
przełącza się teraz razem z układem.
