# Designsprache IM Capital – zum Übertragen auf IM Invests

Stand 27.10.2026, ausgelesen aus dem ausgelieferten Stylesheet (`src/server/public/style.css`) und
`docs/GESTALTUNG.md`. Diese Datei ist **in sich vollständig**: Wer IM Invests im gleichen Stil baut,
braucht nichts anderes aus dem Repository von IM Capital – kein Code, keine Methode, nur Gestaltung.

**Die Haltung in einem Satz:** Schwarz, Weiss und EIN Grau tragen die Seite; Hierarchie entsteht
über Grösse, Gewicht und Luft, nicht über Kästen; Farbe steht nur dort, wo sie etwas bedeutet.

Vorbild ist die Sprache von Trade Republic (minimalistisch, Listen statt Kacheln) auf Apples
Textstilen – übernommen ist die SPRACHE, nicht die Marke: kein fremder Name, kein Logo, nicht deren
Hausschrift.

---

## 1. Zum Einfügen: alle Marken

```css
/* Schrift: Inter, SELBST ausgeliefert (keine Google-Fonts-Abfrage – Datenschutz, läuft offline).
   Inter steht unter der SIL Open Font License. Dateien: inter-latin.woff2 + inter-latin-ext.woff2 */
@font-face {
  font-family: 'Inter'; font-style: normal; font-weight: 400 700; font-display: swap;
  src: url(fonts/inter-latin.woff2) format('woff2');
}

:root {
  /* Flächen */
  --bg: #ffffff;            /* Seitengrund                                   */
  --bg-panel: #ffffff;      /* erhöht: Blatt, Menü, Dialog                   */
  --bg-panel-2: #f2f3f4;    /* Feld, Überfahren, Karte                       */
  --border: #e6e7e9;        /* Haarlinie                                     */
  --border-strong: #b5b7ba; /* nur Linie, NIE Text                           */

  /* Schrift – genau zwei Stufen */
  --text: #000000;          /* die Aussage                                   */
  --muted: #6a6b6d;         /* Beschriftung, Einheit, Zeitstempel (5,33 : 1) */

  /* Bedeutungsfarben – jede hält 4,5 : 1 auf ihrem Grund */
  --accent: #17296f;        /* Navy aus dem Logo: NUR Link, Fokus, Schreibmarke */
  --green: #018133;         /* Gewinn, positiv                               */
  --red: #cf342a;           /* Verlust, Löschen, Ausstieg – sonst NIE        */
  --auf-rot: #ffffff;       /* Schrift auf roter Fläche                      */
  --yellow: #a25e0e;        /* Warnung                                       */

  /* Nur was schwebt, wirft Schatten (Menü, Blatt, Dialog) */
  --schatten-hoch: 0 4px 40px #0000000d, 0 2px 8px #0000001a;

  --font-sans: 'Inter', ui-sans-serif, system-ui, 'Segoe UI', sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  /* Ecken */
  --radius-xs: 4px;   /* Abzeichen, Chips           */
  --radius-sm: 8px;   /* kleine Knöpfe              */
  --radius: 12px;     /* Knöpfe, Felder, Karten     */
  --radius-lg: 16px;  /* Blätter, Dialoge           */
  --radius-xl: 24px;  /* grosse Bühnen der Webseite */
  --pill: 999px;      /* Reiter, Filter, Rundknöpfe */

  /* Schriftskala – neun Stufen auf Apples Textstilen (Wurzel 15 px) */
  --t-1: 0.734rem;  /* 11 px  Etikett, Einheit          (Caption 2)   */
  --t-2: 0.800rem;  /* 12 px  Nebentext                 (Caption 1)   */
  --t-3: 0.867rem;  /* 13 px  Fliesstext in Listen      (Footnote)    */
  --t-4: 1.000rem;  /* 15 px  Zeile, Knopf, betont      (Subhead)     */
  --t-5: 1.133rem;  /* 17 px  Lauftext                  (Body)        */
  --t-6: 1.333rem;  /* 20 px  Abschnittsüberschrift     (Title 3)     */
  --t-7: 1.467rem;  /* 22 px  Kennzahl                  (Title 2)     */
  --t-8: 1.867rem;  /* 28 px  Seitentitel, grosse Zahl  (Title 1)     */
  --t-9: 2.267rem;  /* 34 px  die eine grösste Zahl     (Large Title) */
  /* nur für Werbe-/Startseiten, nie in der Anwendung: */
  --t-schau-1: 2.667rem;  /* 40 px  Abschnittstitel der Webseite */
  --t-schau-2: 3.733rem;  /* 56 px  Aufmacher                    */

  /* Laufweite gehört zur Stufe: gross zusammenziehen, klein spreizen */
  --track-1: 0.014em;  --track-2: 0.010em;  --track-3: 0.002em;
  --track-4: 0;        --track-5: -0.025em; --track-6: -0.030em;
  --track-7: -0.032em; --track-8: -0.029em; --track-9: -0.031em;
  --track-schau: -0.04em;

  /* Abstände – 8er-Raster mit Halbschritten; die Marke heisst wie ihr Wert */
  --s-2: 2px;   --s-4: 4px;   --s-6: 6px;   --s-8: 8px;   --s-10: 10px; --s-12: 12px;
  --s-16: 16px; --s-20: 20px; --s-24: 24px; --s-32: 32px; --s-48: 48px;
  /* Raum der Webseite (Abschnitte), nie in der Anwendung: */
  --raum-64: 64px; --raum-80: 80px; --raum-120: 120px; --raum-160: 160px;

  font-size: 15px;
  color-scheme: light;
}

:root[data-theme='dark'] {
  --bg: #000000;            /* echtes Schwarz          */
  --bg-panel: #121212;
  --bg-panel-2: #1e1e1f;
  --border: #202020;
  --border-strong: #4a4c4f;
  --text: #ffffff;
  --muted: #93969a;         /* 7,07 : 1 auf Schwarz    */
  --accent: #93a0ea;
  --green: #02ca50;
  --red: #ff4034;
  --auf-rot: #000000;       /* dunkle Schrift auf hellem Rot */
  --yellow: #ffb118;
  --schatten-hoch: none;    /* im Dunkeln trennt die Fläche, kein Schatten */
  color-scheme: dark;
}

/* Tönungen aus den Grundfarben – stimmen in beiden Modi von selbst */
:root {
  --green-soft: color-mix(in srgb, var(--green) 13%, var(--bg-panel));
  --red-soft:   color-mix(in srgb, var(--red)   13%, var(--bg-panel));
  --yellow-soft: color-mix(in srgb, var(--yellow) 14%, var(--bg-panel));
}

body {
  background: var(--bg); color: var(--text);
  font-family: var(--font-sans);
  font-feature-settings: 'cv05' 1;   /* offenes kleines l */
  -webkit-font-smoothing: antialiased;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
button { color: inherit; }           /* sonst malt iOS Knopftext systemblau */
```

---

## 2. Schrift

- **EINE Schrift: Inter**, für Text, Zahlen und Titel. Keine zweite Schrift für Überschriften.
- **Zahlen immer mit gleich breiten Ziffern:** `font-variant-numeric: tabular-nums` – Beträge und
  Prozente stehen untereinander bündig.
- **Gewichte:** 400 Lauftext · 500 grosse Zahlen und leise Werte · 600 Namen in Zeilen, betonte Werte ·
  700 Überschriften, Seitentitel, Knöpfe.
- **Jede Grösse kommt aus der Skala** (`--t-1` … `--t-9`), **immer mit ihrer Laufweite**
  (`font-size: var(--t-6); letter-spacing: var(--track-6);`). Wer eine Grösse braucht, die nicht
  dasteht, braucht sie nicht. Nichts unter 11 px.
- **Zeilenhöhe:** Lauftext 1,5 · Listen 1,45–1,55 · Titel und grosse Zahlen 1,15 · Kopfzahl 1.
- **Satzschreibung** in Überschriften („Mein Bestand“, nicht „MEIN BESTAND“), keine Versalien-Etiketten.

| Wofür | Stufe | Gewicht |
|---|---|---|
| Seitentitel | `--t-8` (28 px) | 700 |
| Abschnittsüberschrift | `--t-6` (20 px) | 700 |
| Name in einer Listenzeile | `--t-4` (15 px) | 600 |
| Wert in einer Listenzeile | `--t-4` (15 px) | 500, `--muted` |
| Lauftext | `--t-5` (17 px) bzw. `--t-3` in Listen | 400 |
| Beschriftung über einem Feld | `--t-1` (11 px) | 600, `--muted` |
| Die grosse Zahl (Kopfzahl) | `--t-8`–`--t-9` | 700 |
| Werbeseite: Aufmacher / Abschnitt | `--t-schau-2` / `--t-schau-1` | 700, `--track-schau` |

---

## 3. Abstände und Raster

- **8er-Raster mit Halbschritten**, nur die Marken `--s-2` … `--s-48` (in px, wachsen nicht mit der
  Schrift). Ein `--s-1`, `--s-3` usw. gibt es NICHT – eine unbekannte Marke macht die ganze
  Deklaration ungültig.
- **Regel der Nähe:** Der Abstand ÜBER einer Überschrift ist immer grösser als darunter. Was
  zusammengehört, steht enger als das Benachbarte – das gruppiert ohne Rahmen.
- **Seite:** Inhalt höchstens **1120 px** breit, mittig, Seitenrand **24 px** (`--s-24`).
- **Zwischen Abschnitten 48 px** (`--s-48`), zwischen Gruppen 24 px, Innenrand einer Karte 16–24 px.
- **Webseite (Startseite/Werbung):** Abschnitte mit `--raum-120`/`--raum-160` oben, `--raum-80` unten,
  `--raum-64` zwischen Kopf und Inhalt.

| Marke | Wofür |
|---|---|
| `--s-2` | Symbol zu Text im selben Wort |
| `--s-4` | Etikett zu Zahl |
| `--s-6` | enge Lücke in einer Zeile |
| `--s-8` | Grundabstand, Knopf zu Knopf |
| `--s-10` | Innenrand kleiner Elemente |
| `--s-12` | Listenzeilen, Innenrand mittlerer Elemente |
| `--s-16` | Innenrand einer Karte |
| `--s-20` | grosszügiger Innenrand |
| `--s-24` | zwischen Gruppen, Seitenrand |
| `--s-32` | zwischen Abschnitten (eng) |
| `--s-48` | zwischen Abschnitten, Seitenfuss |

---

## 4. Flächen, Linien, Ecken, Schatten

- **Abschnitt statt Kachel:** Ein Abschnitt hat keine Fläche, keinen Rahmen, keine Ecke, keinen
  Schatten – nur eine Haarlinie darüber (bündig mit der Schrift) und die fette Überschrift.
- **Linie statt Rahmen:** Zeilen einer Liste trennt `1px solid var(--border)` ZWISCHEN den Zeilen,
  bündig mit dem Text, nicht nach der letzten.
- **Rahmen oder Fläche, nie beides.** Eine getönte Fläche trägt keinen zusätzlichen Rahmen.
- **Karte nur, wo etwas abgesetzt werden MUSS** (Hinweis, Rechenweg, Urteil): `--bg-panel-2`, kein
  Rahmen, Ecke `--radius`, Innenrand 20–24 px, kein Schatten.
- **Schatten trägt nur, was schwebt** (Menü, Blatt, Dialog): `--schatten-hoch` + 1 px `--border`;
  im Dunkeln kein Schatten.
- **Ecke folgt der Grösse:** Chip 4 px, kleiner Knopf 8 px, Knopf/Feld/Karte 12 px, Blatt/Dialog 16 px,
  Reiter/Filter Pille.

---

## 5. Farbe

- **Monochrom.** Schwarz/Weiss/Grau tragen die Oberfläche. Gefüllte Knöpfe, eingeschaltete Schalter,
  gewählte Reiter und Balken tragen die **Textfarbe**, nicht die Akzentfarbe.
- **Navy (`--accent`) nur an Link, Fokusring und Schreibmarke.**
- **Grün/Rot nur am Ergebnis** (Gewinn/Verlust in Listen). Die Änderung neben der grossen Zahl steht
  neutral (Dreieck in der Textfarbe).
- **Rot gehört der Gefahr:** Verlust, Löschen, Ausstieg. Für nichts anderes.
- **Kontrast:** jede Kombination Text auf Fläche mindestens **4,5 : 1**, hell UND dunkel (die Werte
  oben halten das).
- **Hell ist der Normalfall**, Dunkel über `data-theme="dark"` am `<html>`. (Die Startseite von
  IM Capital ist bewusst immer dunkel – für IM Invests frei wählbar.)

---

## 6. Bauteile

| Bauteil | So sieht es aus |
|---|---|
| **Abschnittskopf** | `--t-6`/700 in `--text`, Satzschreibung; Klappzeichen RECHTS als Winkel (`--muted`); 48 px bis zum nächsten Abschnitt |
| **Listenzeile** | Name `--t-4`/600 links, Wert `--t-4`/500 `--muted` rechts (mit Auslassung `…`), dann Winkel/Schalter/nichts; Trennlinie dazwischen; Überfahren `--bg-panel-2` mit `--radius`; Höhe 56 px in Einstellungen, sonst ≥ 44 px |
| **Verweiszeile** | Name + Winkel rechts (in RTL gespiegelt) |
| **Schlüssel-Wert-Zeile** | Schlüssel `--t-4`/500 `--muted` links, Wert `--t-4`/600 rechts, tabular, 44 px |
| **Kopfzahl** | Beschriftung `--t-4`/500 `--muted` ÜBER der Zahl, Zahl `--t-8`/700 tabular, Änderung daneben auf der Grundlinie (am Telefon darunter) – ohne getönten Kasten |
| **Knopf gefüllt** (`.btn`) | Fläche `--text`, Schrift `--bg`, `--t-4`/700, 40 px hoch (44 px am Finger), Innenrand 8/16 px, Ecke `--radius`, kein Rahmen; Überfahren 82 % Text; Drücken `scale(.98)` (nur ohne „weniger Bewegung“) |
| **Knopf getönt** | Fläche `--bg-panel-2`, Schrift `--text` – gleichrangige Wahl |
| **Knopf leise** | ohne Fläche und Rahmen, beim Überfahren `--bg-panel-2` – Nebensache, Abbruch |
| **Knopf warnend** | `--red` mit `--auf-rot` – Löschen, Unwiderrufliches |
| **Zwei Knöpfe nebeneinander** | gleiche Höhe, Ecke, Schriftgrösse und Breite; verschieden ist nur der Stil. Je Bildschirm EINE gefüllte Hauptsache |
| **Eingabefeld** | Fläche `--bg-panel-2`, Rahmen 1 px transparent (Fokus färbt ihn `--accent`, Fläche wird `--bg-panel`), Ecke `--radius`, 44 px, Innenrand 10/12 px, `--t-4`; Platzhalter `--muted`; Beschriftung ÜBER dem Feld (`--t-1`/600 `--muted`), nie nur als Platzhalter |
| **Umschalter (eins von mehreren)** | Textreihe OHNE Spur; nicht gewählt `--muted`/500, gewählt `--text`/600 auf einer `--bg-panel-2`-Pille |
| **Schalter** | 44 × 26; AUS Spur `--border`, Knopf `--muted`; EIN Spur `--text`, Knopf `--bg` |
| **Navigation** | Text `--t-4`; nicht gewählt `--muted`/500, gewählt `--text`/600 mit 2-px-Strich in `--text` darunter; Kopfleiste Milchglas (`color-mix(var(--bg) 82%, transparent)` + Weichzeichner) |
| **Menü, Blatt, Dialog** | `--bg-panel`, hell mit `--schatten-hoch` + 1 px `--border`, Ecke `--radius-lg` (Menü `--radius`), Menüzeilen 44 px |
| **Avatar** | Kreis `--bg-panel-2`, Initiale `--text`/600 |
| **Abzeichen/Chip** | `--t-1`, Ecke `--radius-xs`, Innenrand 2/6 px |

---

## 7. Symbole

- **Nie Emoji, nie Schriftzeichen als Symbol** (kein ▶ ✓ ★ ⚠ als Text). Symbole sind SVG aus EINEM Satz:
- Raster `viewBox="0 0 24 24"`, Strich **1,75**, Enden und Ecken **rund**, Farbe `currentColor`, keine
  Füllung (Ausnahme: gefüllter Stern für „gemerkt“).
- Grössen: 16 px im Text, 20 px in Knopf/Navigation, 24 px in der Kopfleiste. Ein Symbol im Knopf
  steht RECHTS vom Text.
- Der Winkel (Klappzeichen, Verweis) als Maske:

```css
--winkel-rechts: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9.5 6l6 6-6 6'/%3E%3C/svg%3E");
--winkel-unten: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9.5l6 6 6-6'/%3E%3C/svg%3E");
/* Verwendung: width/height 16px; background: var(--muted); mask: var(--winkel-rechts) center / contain no-repeat; */
```

---

## 8. Bedienung

- **44 px Trefferfläche, wo ein Finger zielt** – festgemacht an `@media (pointer: coarse)`, nicht an
  der Bildschirmbreite (ein Tablet quer ist breit und wird trotzdem angetippt). Mit Maus reichen 40 px.
- **Fokusring sichtbar an allem Bedienbaren:** `outline: 2px solid var(--accent); outline-offset: 2px`.
- **Eingabefelder mindestens 16 px Schrift am Telefon**, sonst zoomt iOS beim Antippen hinein.
- **Bewegung zurückhaltend:** Übergänge 0,15 s; nichts federt oder zählt hoch; mit
  `prefers-reduced-motion` gar keine.
- **Aufklapper (`<summary>`)** mit `list-style: none` und eigenem Winkel – sonst zeichnet der Browser
  sein Dreieck in eine eigene Zeile.
- **Ausblenden für Bildschirmleser** über die 1×1-Technik mit `clip-path`, nie mit `left: -9999px`
  (das schiebt arabische Seiten Tausende Pixel zur Seite).

---

## 9. Was es NICHT gibt (häufigste Fehler)

1. Kein Kachelraster aus grauen Kästen, wo eine Liste reicht.
2. Keine Fläche UND Rahmen am selben Element.
3. Keine Schatten auf Dingen, die auf der Seite liegen.
4. Keine Farbe als Schmuck – keine blauen Knöpfe, keine farbigen Kästen um Zahlen.
5. Keine Grösse ausserhalb der Skala, keine Laufweite ohne ihre Stufe.
6. Keine zweite Schrift, keine Emoji.
7. Kein Grauton für Text ausser `--muted` (zwei Textstufen, nicht vier).
8. Kein Text unter 11 px.

**Prüffrage zum Schluss:** Sieht die Seite hell und dunkel, bei 390 px und bei 1440 px gleich ruhig
aus – und lässt sich jede Überschrift, jede Zahl und jeder Abstand einer Marke aus § 1 zuordnen?
