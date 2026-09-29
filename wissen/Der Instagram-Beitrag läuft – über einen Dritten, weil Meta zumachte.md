---
titel: Der Instagram-Beitrag läuft – über einen Dritten, weil Meta zumachte
datum: 2026-08-29
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Der Instagram-Beitrag läuft – über einen Dritten, weil Meta zumachte – 29. August 2026

Am selben Tag noch fertiggestellt. Der Reihe nach, weil an jeder Station etwas
lag, das man nicht vorhersieht.

## Das Entwicklerkonto war nicht zu bekommen

`developers.facebook.com` ließ sich nicht anmelden: „Register" grün, „Verify
account" nicht. Meta schickte den SMS-Code nicht und meldete stattdessen, das
Gerät werde normalerweise nicht benutzt – auf einem zweiten ebenso. **Gegen
diese Sperre hilft kein weiterer Versuch.**

Erst die Nummer prüfen: Der Code ging an 01575 2738970, die Geschäftsnummer in
`lib/site.ts` ist 01523 3570545. Das war es nicht, aber es war die richtige
erste Frage.

## Was vorher schon stand, ohne dass es jemand wusste

Bevor irgendetwas gebaut wurde, kam die Bestandsaufnahme – und drei von drei
Vorbedingungen aus `EINRICHTUNG.md` 3.2 waren längst erfüllt: das
Instagram-Konto ist ein **Profi-Konto vom Typ Unternehmen**, die Facebook-Seite
`IM Invests` existiert, und beide hängen zusammen. Letzteres bestätigte sich
erst, als Make die Seite in seinem Auswahlfeld anbot – das ist die Probe, die
3.2 c bewusst offenlässt.

**Eine halbe Stunde Nachsehen hat eine Stunde Bauen gespart.**

## Der Dienst bringt die genehmigte App mit

Make hat eine eigene, von Meta genehmigte App; eigene Zugangsdaten sind dort
ausdrücklich optional. Das Szenario „IM Invests Tagesbeitrag" nimmt den
Webhook, fragt den Kanal und veröffentlicht das Karussell.

**Der Doppelriegel liegt hier im Szenario, nicht im Repository** – ohne Token
kann der Lauf den Kanal nicht selbst fragen. Er ist dieselbe Regel an anderer
Stelle: _Ein Riegel ist so gut wie die Quelle, die er fragt._

## Zwei Dinge, die beinahe still danebengegangen wären

**PNG.** Makes Anforderungen an ein Karussellbild sagen „Format: JPEG only".
Der Kommentar im Code behauptete, Instagram nehme beides. Das ist jetzt
umgestellt – die Kacheln sind JPEG, 1080×1350, rund 85 KB.

**Die Warteschlange.** Beim Scharfschalten fragte Make, ob die im Webhook
liegenden Daten verarbeitet werden sollen. Das war die Testübergabe von vorhin
– „Process old data" hätte auf der Stelle einen echten Beitrag veröffentlicht,
mitten am Nachmittag, ohne dass jemand ihn gesehen hätte. Verworfen.

## Die Lehre

**Eine Oberfläche, die man nicht zuverlässig bedienen kann, bedient man nicht.**
Das Karussell-Modul brauchte vier Bilder; nach etlichen Fehlklicks und einem
`Escape`, das alles Ungespeicherte verwarf, war der Weg über die
Szenario-Vorlage als Text in einem Zug fertig. Wer merkt, dass er dieselbe
Handbewegung zum dritten Mal wiederholt, sucht die Textform.

Und: **Ein Formular, das nicht speichert, hat oft recht.** Make legt das Modul
erst an, wenn zwei Bilder drin sind – die verlorenen Zwischenstände waren kein
Bedienfehler, sondern eine Prüfung, die arbeitete.
