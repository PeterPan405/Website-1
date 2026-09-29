---
titel: Der erste Besuch ist weiß
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Der erste Besuch ist weiß

Wer die Website zum ersten Mal öffnet, sieht sie hell – **auch auf einem Gerät,
das auf Dunkel gestellt ist.** Der Betreiber hat das am 13. August 2026
festgelegt.

Die Rangfolge in `startSkript()` (`lib/theme.ts`) hat seither nur noch zwei
Stufen: gespeicherte Wahl, sonst Weiß. `prefers-color-scheme` kommt darin nicht
mehr vor.

(Der Satz stand hier bis zum 14. August 2026 anders: `viewport.themeColor`
nenne „jetzt eine einzige helle Farbe statt zweier nach Systemvorgabe". Das
galt einen Tag lang. Wie es weiterging, steht zwei Abschnitte tiefer – am Ende
liefert das Layout **gar keine** Farbe mehr aus.)

**Das ist die Stelle, an der der nächste Umbau danebengreift.** Die Fassung mit
der Systemvorgabe –

    var t = s==='dark' || (!s && matchMedia('(prefers-color-scheme: dark)').matches)
          ? 'dark' : 'weiss'

– steht in jeder Anleitung, sieht wie eine Verbesserung aus und fällt niemandem
auf, der auf einem hell gestellten Rechner entwickelt: Dort verhalten sich beide
Fassungen gleich. Genau deshalb führt `tests/farbschema-start.test.ts` das
Skript **aus** statt seinen Quelltext zu lesen, in allen vier Kombinationen aus
gespeicherter Wahl und Systemvorgabe, und schlägt schon beim bloßen Aufruf von
`matchMedia` an.

Der dunkle Modus ist damit nicht abgeschafft, nur nicht mehr vorgeschlagen: Der
Umschalter im Kopf ist einen Klick entfernt, und die Wahl überlebt jedes
Neuladen.

`colorScheme` steht aus demselben Grund auf `'light'` statt `'light dark'`. Die
Angabe entscheidet, in welcher Farbe der Browser malt, bevor das Stylesheet
gelesen ist; `light dark` hieße „nimm die Systemvorgabe“ und damit ein dunkles
Aufblitzen vor einer weißen Seite. Für den dunklen Modus ist das ohne Belang –
`[data-theme='dark']` in `app/globals.css` setzt `color-scheme: dark`, und die
CSS-Eigenschaft sticht die Meta-Angabe.

## Die Browserleiste wird ersetzt, nicht geändert

Am selben 13. August, wenige Stunden später, meldete der Betreiber einen
**weißen Balken über der dunklen Seite** auf dem Telefon. Eine Regression aus
genau der Umstellung darüber – und lehrreich genug für einen eigenen Abschnitt.

Vorher standen im `<head>` **zwei** `theme-color`-Angaben mit `media`-Bedingung.
Auf einem dunkel gestellten Gerät griff die dunkle schon beim Parsen, ohne eine
Zeile JavaScript. Daneben stand eine JS-Korrektur, die dasselbe noch einmal
tat – sie war nie nötig und wurde deshalb **nie geprüft**.

Seit der erste Besuch weiß ist, ist die Systemvorgabe bedeutungslos: Eine
`media`-Bedingung fragt genau das ab, worauf es nicht mehr ankommt. Also blieb
nur der JS-Weg übrig, und der trug nicht – **zweimal nicht:**

    setAttribute('content', …)   Chromium: wirkt   Safari: wirkt nicht
    Knoten austauschen           Chromium: wirkt   Safari: wirkt nicht

Der zweite Anlauf war der naheliegende Schluss aus dem ersten und ging live,
bevor jemand ihn auf einem Telefon gesehen hatte. Er half nichts. Vorher
ausgeschlossen: Zwischenspeicher scheiden aus, HTML geht mit `no-store`
heraus (`public/.htaccess`), und der Dienstarbeiter fasst die Startseite
nicht an.

**Safari liest `theme-color` beim Parsen und danach nicht mehr.** Damit kann
kein Skript eine Angabe retten, die schon im HTML steht – und ein statischer
Export weiß nicht, welches Schema der Besucher gewählt hat.

### Der dritte Anlauf: gar keine mehr – und warum das schiefging

Am 16. August 2026 wurde die Angabe **ganz gestrichen**. `app/layout.tsx`
lieferte keine `themeColor` mehr aus, angelegt wurde sie ausschließlich vom
Startskript. Die Begründung lautete:

> **Safari** sieht nie eine und färbt den Bereich nach dem
> **Seitenhintergrund**. Der steht schon vor dem ersten Malen richtig, weil
> das Startskript `data-theme` setzt und das CSS die Fläche.

**Das ist falsch.** Am 17. August 2026 hat der Betreiber die Startseite auf
dem Telefon gezeigt – im **hellen** Modus, beige Seite, und darüber ein
**schwarzer** Balken. `html` trägt `background-color: var(--c-canvas)`; der
Seitenhintergrund stand also richtig und wurde trotzdem nicht genommen. Ohne
`theme-color` malt Safari die Fläche schwarz, unabhängig vom Schema.

Bemerkenswert daran ist nicht der Irrtum, sondern **wie er zustande kam**: Er
war die einzige Erklärung, die zu den beiden gescheiterten JS-Anläufen passte,
und wurde deshalb für belegt gehalten. Belegt war aber nur, dass die JS-Wege
nicht tragen – über die Farbgebung ohne Angabe war nie eine Messung gemacht
worden. Eine Annahme, die eine Lücke füllt, sieht aus wie ein Befund.

### Der vierte Anlauf: die helle Farbe stand wieder im HTML – halb richtig

`app/layout.tsx` lieferte `themeColor: LEISTENFARBE.weiss` aus, und das
Startskript änderte den Knoten ab, statt ihn zu ersetzen.

**Ergebnis, am selben Tag gemessen:** Die helle Angabe wird von Safari
genommen – das war der Fortschritt. Die Änderung durch das Skript wird
ignoriert – auf einem dunkel geschalteten Telefon stand ein beiger Balken über
schwarzer Seite. Der alte Fehler, ein viertes Mal.

Damit war die Tabelle vollständig:

| Lage                                    | Safari       |
| --------------------------------------- | ------------ |
| keine Angabe im HTML                    | malt schwarz |
| feste Angabe im HTML                    | nimmt sie    |
| Skript ändert sie danach (setAttribute) | ignoriert    |
| Skript tauscht den Knoten aus           | ignoriert    |

**Safari friert den Wert beim Parsen ein.** Die gespeicherte Wahl steht erst
danach fest. Drei Anläufe waren Varianten desselben unmöglichen Vorhabens, und
das war nach dem ersten schon absehbar – es fehlte nur die Bereitschaft, die
Anforderung selbst infrage zu stellen statt immer neue Umgehungen zu suchen.

### Der fünfte Anlauf: `media` – und warum der Betreiber ihn zurückwies

Zwei Angaben nach `prefers-color-scheme`. Damit folgte der Balken dem **Gerät**
statt der Website. Der Betreiber hat das am selben Tag beanstandet:

> Der Balken soll im White Mode Beige sein, an dem Dark Mode dunkel wie die
> anderen Farben.

Er will, dass der Balken der **Wahl** folgt. Genau das schien unmöglich – und
war es auch, solange nur DOM-Wege versucht wurden.

### Der sechste Anlauf: `document.write`

Alle gescheiterten Wege haben das DOM **nach** dem Parsen verändert:
`setAttribute`, `appendChild`, Knoten austauschen. `document.write` in einem
Skript, das während des Parsens läuft, ist etwas anderes: Der Text geht in den
**Token-Strom des Parsers**, und der baut das Element selbst – wie bei
Quelltext. Genau daran hängt Safaris Auswertung.

Das Startskript steht im `<head>` und läuft synchron, während der Parser noch
im `<head>` ist. Es schreibt:

    <meta name="theme-color" content="#f2ebdd">

mit der Farbe, die zur gespeicherten Wahl gehört.

**Drei Stücke tragen das, und einzeln ist keines etwas wert:**

1. das `document.write` statt einer DOM-Änderung,
2. seine Stellung im `<head>` **vor** dem Rückfall,
3. der Rückfall in `<noscript>`.

Zu (3): Next zieht jede Meta-Angabe, die es sieht, an den Anfang des `<head>` –
also vor das Skript. Bei mehreren passenden Angaben nimmt der Browser die
erste; der Rückfall gewönne dann immer, und der ganze Umbau wäre wirkungslos,
und zwar lautlos. In `<noscript>` sieht Next ihn nicht. Inhaltlich gehört er
ohnehin dorthin: Wo das Skript läuft, schreibt es die richtige Farbe; wo es
nicht läuft, ist die Systemvorgabe die beste verfügbare Schätzung.

### Der Umschalter lädt neu

`document.write` wirkt nur, während geparst wird. Ohne Neuladen bliebe der
Balken nach einem Umschalten in der alten Farbe – und weil diese Website
clientseitig navigiert, die ganze Sitzung lang. Genau der Zustand, den der
Betreiber fünfmal gemeldet hat.

Der Preis ist ein kurzes Neuladen bei einem Klick, den kaum jemand öfter als
einmal macht. Verloren geht dabei wenig: Rechner, Merkliste und Lesezeichen
liegen im `localStorage`.

### Was die Prüfung daraus gelernt hat

`tests/farbschema-start.test.ts` hat drei kaputte Fassungen abgesegnet. Nicht
aus Nachlässigkeit: Sie maß das **Verhalten in einem Nachbau**, und der Nachbau
machte alles mit. Ein `setAttribute` wirkt dort immer.

Sie prüft jetzt die **Bauart**: dass zwei `media`-Angaben ausgeliefert werden,
dass beide Farben aus `LEISTENFARBE` kommen – und dass in `lib/theme.ts`,
`app/layout.tsx` und `ThemeToggle.tsx` außerhalb von Kommentaren kein
`theme-color` mehr vorkommt.

Dazu ist der Nachbau von einer Attrappe zu einer **Falle** geworden:
`document.head`, `createElement` und `querySelectorAll` werfen. Ein Skript, das
sie anfasst, bricht ab und meldet sich. Nachgestellt – die Falle schnappt zu.

**Die allgemeine Lehre:** Ein Nachbau, der alles mitmacht, bestätigt jede
Fassung. Wo die einzige prüfbare Umgebung nicht die ist, in der es kaputtgeht,
muss die Prüfung an der Bauart ansetzen, nicht am Verhalten.

`startSkript` setzt die Farbe außerdem **immer** statt nur bei gespeicherter
Wahl – ein Zweig, der fast nie durchlaufen wird, wird nie geprüft und trägt
beim ersten Mal nicht, an dem er zählt.

Die Arbeit gibt es zwangsläufig zweimal: einmal als Zeichenkette fürs
Startskript, einmal als Funktion für den Umschalter – das eine ist Text im
`<head>`, das andere eine React-Komponente, sie können sich keinen Aufruf
teilen. `tests/farbschema-start.test.ts` lässt deshalb **beide** über dieselbe
nachgebaute Seite laufen und vergleicht das Ergebnis.

**Die allgemeine Lehre:** Wer eine Absicherung entfernt, die etwas anderes
verdeckt hat, deckt damit den verdeckten Fehler auf – und zwar erst beim
Nutzer. Beim Streichen einer redundanten Stelle gehört geprüft, ob die
verbliebene je gearbeitet hat.

**Und die zweite:** Der zweite Anlauf ging live, weil er in Chromium grün war
und plausibel klang. Geprüft war damit nur, was ohnehin schon funktioniert
hatte. Wo die einzige Umgebung, in der sich etwas prüfen lässt, nicht die ist,
in der es kaputtgeht, ist ein „müsste jetzt gehen" keine Aussage – dann gehört
der Weg gewählt, der **ohne** die ungeprüfte Annahme auskommt.
