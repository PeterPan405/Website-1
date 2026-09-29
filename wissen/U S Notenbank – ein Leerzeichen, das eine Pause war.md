---
titel: „U S Notenbank" – ein Leerzeichen, das eine Pause war
datum: 2026-09-28
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# „U S Notenbank" – ein Leerzeichen, das eine Pause war – 28. September 2026

Gemeldet vom Betreiber, am selben Morgen wie die zu kurze Folge:

> „Die Anglizismen werden noch immer nicht korrekt ausgesprochen, zum Beispiel
> auch US-Notenbank – spricht er ,U S Notenbank' aus, mit einer sehr
> langen Pause. Das ist falsch. Aber US soll es auch nicht heißen, also das
> englische U und S, mit die Buchstaben einzeln, aber schnell nacheinander
> aussprechen. Aber das ist nur einer von vielen Punkten."

Er beschreibt zwei verschiedene Fehler, und beide steckten in **einem**
Tabelleneintrag, der am Tag zuvor entstanden war.

## Erstens: das Leerzeichen zerlegt die Zusammensetzung

`[/\bUS\b/g, 'Uh Ess']` sieht harmlos aus. Was es mit dem Text macht, sieht
man erst, wenn man ihn ausdruckt:

    US-Notenbank      →  Uh Ess-Notenbank
    US-Dollar         →  Uh Ess-Dollar
    US-Jobbericht     →  Uh Ess-Jobbericht

Aus **einem** Wort werden **drei** Zeichenketten, und der Bindestrich klebt
am zweiten Buchstaben statt am Kürzel. Ein Sprachmodell liest, was dasteht:
„Uh", Wortgrenze, „Ess-Notenbank". Die Wortgrenze ist die Pause.

Das war keine Ausnahme. Nachgezählt an allen 65 Ausgaben, mit der Tabelle von
heute gerechnet: **176 solche Stellen**, davon 72 Mal „US-Dollar", 8 Mal
„US-Staatsanleihen", 8 Mal „US-Notenbank". Deutsche Nachrichten schreiben
Kürzel fast immer als erstes Glied einer Zusammensetzung; der Fehler war
nicht selten, er war täglich.

Und er war nicht auf „US" beschränkt. Dieselbe Bauart hatten **19 von 131**
Einträgen:

    WTI → Weh Teh Ih          CEO → Sieh Ie Ou
    PCE → Peh Zeh Eh          CFO → Sieh Eff Ou
    ASML → Ah Ess Emm Ell     IPO → Ei Pie Ou
    AMD → Ah Emm Deh          BoE → Bie Ou Ie
    GLD → Geh Ell Deh         OpenAI → Ohpen Ej Ei
    SLV → Ess Ell Fau         BofA → Bänk of Amerika
    VW  → Fau Weh             BlackRock → Bläck Rock
    AFX → Ah Eff Ix           Coca-Cola → Koka Kohla
    dpa-AFX → deh peh ah Ah Eff Ix
    Big-Tech → Bigg Teck      Fear-and-Greed → Fier and Griedd
    wallstreet-online → Uallstriet onlein
    IM Invests → Ei Emm Inwests

„CEO-Wechsel" wäre „Sieh Ie Ou-Wechsel" geworden, „IPO-Kandidat" „Ei Pie
Ou-Kandidat". Alle 19 sind zusammengezogen.

Die Regel dahinter steht jetzt in `AGENTS.md` und wird geprüft:
**Eine Umschrift hat so viele Wörter wie ihr Muster.** Buchstabennamen werden
mit Bindestrichen verbunden, nie mit Leerzeichen – so, wie `JPMorgan →
Dschej-Pi-Morgen` es seit jeher vormacht, ohne dass jemand die Regel
aufgeschrieben hätte. `tests/sprechfassung-aussprache.test.ts` zählt für jeden
Eintrag nach und bekommt als Gegenprobe den alten Zustand vorgelegt.

## Warum Bindestrich und nicht Zusammenschreiben

Gemessen, nicht geraten – aber mit einer Einschränkung, die dazugehört.

`hoerprobe.yml` hat denselben Trägersatz mit fünf Schreibweisen gesprochen:
„Die X-Notenbank senkt den Zins." Die Aufnahme liegt auf dem wurzellosen
Zweig `hoerprobe`; gemessen wurden die Lücken **innerhalb** jedes Stücks
(Lautstärke unter 3 % der Spitze, mindestens 60 ms):

    Die Uh Ess-Notenbank …     längste Lücke 360 ms     ← Ist-Zustand
    Die Uh-Ess-Notenbank …     längste Lücke 150 ms
    Die Juh-Ess-Notenbank …    längste Lücke 310 ms
    Die Juhess-Notenbank …     längste Lücke 260 ms
    Die Ost-Notenbank …        längste Lücke 300 ms     ← Vergleichsmaß

Das Vergleichsmaß ist die gewöhnliche deutsche Zusammensetzung: Auch sie hat
rund 300 ms Luft, vor „senkt". Eine Lücke dieser Größe ist also normal. Die
einzige Schreibweise, die darüber hinausgeht, ist die mit dem **Leerzeichen**.

**Die Einschränkung:** Das ist **eine** Aufnahme je Schreibweise, und das
Modell erzeugt nicht zweimal dasselbe. Der Unterschied zwischen 260 und
310 ms trägt nichts. Was die Messung trägt, ist der Vergleich mit dem
Leerzeichen – und das deckt sich mit dem, was ohne Ohr feststeht: Das
Leerzeichen ist eine Wortgrenze, der Bindestrich ist keine.

Gewählt ist der Bindestrich und nicht das Zusammenschreiben, weil er dem
Modell die Silbengrenze nennt („Juh-Ess") statt sie raten zu lassen
(„Juhess" könnte /juˈhɛs/ werden) – und weil ein Mensch die Tabelle noch
lesen kann.

## Zweitens: die Buchstaben waren deutsch

„Uh Ess" sind die deutschen Buchstabennamen, /uː/ und /ɛs/. Der Betreiber
verlangt die englischen. Das U heißt dort /juː/ und wird „Juh" geschrieben –
das deutsche „J" ist /j/, und genau den Laut braucht es.

„USA" bleibt deutsch und steht weiter in `KUERZEL_IN_ORDNUNG`: Im Deutschen
heißt es „U-S-A". Der Betreiber hat „US" gemeint, nicht jedes Kürzel mit
einem U.

## „Nur einer von vielen Punkten" – was daraus geworden ist

`verdaechtigeAnglizismen` meldet seit dem 11. August. Über 65 Folgen hat die
Meldung **78 verschiedene** Wörter angezeigt, und **kein einziges** davon ist
je entschieden worden. Eine Warnung ohne Entscheidung ist ein Zettel.

Aufgeteilt wurde nach der Frage, **was sich ohne Ohr entscheiden lässt**:

- **Englische Wörter** – dass „Energy", „Industry", „Shopify", „Bookbuilding",
  „bullish" nicht deutsch gesprochen gehören, folgt aus der Regel in
  `AGENTS.md` und braucht niemanden, der es sich anhört. Siebzehn davon sind
  eingetragen; die Meldung ist damit von 78 auf 63 Wörter gefallen.
- **Kürzel aus Großbuchstaben** – SAP (6×), EQS (4×), USD (4×), ADP (3×),
  ATX, FDA, IBM, UBS, CME, ISM, PMI und dreißig weitere. Ob die Stimme sie
  buchstabiert oder als Silbe liest, **steht nicht in der Schreibweise**:
  „EZB" buchstabiert sie von selbst richtig, „DAX" spricht sie als Wort, und
  beide stehen deshalb in `KUERZEL_IN_ORDNUNG`. Welches Kürzel zu welcher
  Gruppe gehört, entscheidet ein Ohr.

Diese zweite Gruppe bleibt offen, und zwar ausdrücklich: **Eine erfundene
Umschrift ist schlimmer als eine fehlende**, weil sie die Meldung zum
Schweigen bringt, ohne dass jemand hingehört hat. Der Weg dorthin steht
bereit – `hoerprobe.yml` spricht eine Liste und legt sie als MP3 auf den
Zweig `hoerprobe`. Gehört werden muss sie von einem Menschen.

## Und warum die Hörprobe bis heute stumm war

Der Schritt „Klangkette anwenden" in `hoerprobe.yml` ist seit seinem ersten
Tag, dem 9. August 2026, **nie gelaufen**:

    FileNotFoundError: [Errno 2] No such file or directory: 'ffmpeg'

Dieselbe Falle wie am 8. August im Podcastlauf – ffmpeg liegt seither nicht
mehr auf dem Ubuntu-Abbild. Dort wurde sie behoben, hier nicht. Weil der
Schritt `if: always()` trägt, lief der Rest weiter, und neben dem roten
Schritt lag jedes Mal eine WAV-Datei, die aussah wie das Ergebnis.

Sie war es nicht: Was auf Spotify landet, ist die Aufnahme **nach** der
Klangkette. Wer die Hörprobe abspielte, hörte das Modell, nicht die Folge –
also die falsche Antwort auf die einzige Frage, für die es den Lauf gibt.

**Ein Schritt, der nie gelaufen ist, sieht aus wie ein Schritt.** Die
Installation steht jetzt **vor** dem Sprechen: sechs Minuten rechnen und dann
an einem fehlenden Paket scheitern wäre die teure Reihenfolge.

---
