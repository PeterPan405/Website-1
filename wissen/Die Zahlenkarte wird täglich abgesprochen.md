---
titel: Die Zahlenkarte wird täglich abgesprochen
datum: 2026-10-15
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Die Zahlenkarte wird täglich abgesprochen – 15. Oktober 2026

Der Betreiber war mit der ersten Zahlenkarte („7 US-Giganten sind mehr Wert
als Europas 600", 12.10.) „sehr zufrieden" und ordnete an: täglich eine,
das Thema vorher abgesprochen, der Entwurf um 16 Uhr im Chat, nach der
Freigabe bis 17 Uhr online. Die Tagesnews dagegen gehen weiter von selbst
hinaus, gleich nach der nächtlichen Ausgabe.

## Freigabe und Veröffentlichung sind zwei Dinge

Zuerst startete der Veröffentlicher nur von Hand, mit dem Tag der Freigabe
als Datum – „eine Uhr kann nicht abnehmen". Am ersten Tag ging die Karte
deshalb dann hinaus, als der Betreiber „so passt es" schrieb: um 08:59 Uhr.
Seine Antwort: „warum hast du es schon hochgeladen" – „der Beitrag des Tages
kommt immer erst um 16 Uhr".

Der Fehler war, eine Abnahme als Auftrag zu lesen. Jetzt trägt sie nur noch
ein Datum ein (`freigabe` an der Karte, mit dem Bau auf der Website), und
die Uhrzeit hängt an der Uhr: Der Dauerlauf stößt ab 16 Uhr an, der
Veröffentlicher hält vorher an – auch von Hand gestartet. Die Uhr nimmt
weiterhin nichts ab: Ohne Datum von heute geht nichts hinaus, und ein Datum
läuft um Mitternacht ab. Die Entscheidung steht in
`lib/zahlenkarten-wecker.ts`, geprüft in `tests/zahlenkarten-wecker.test.ts`
mit dem Fall 08:59 als Gegenprobe.

Damit 16 Uhr auch gehalten wird, kommt der Entwurf seitdem gegen 14 Uhr in
den Chat statt um 16 („14:00 Uhr passt"): Nach dem „passt" braucht es noch
einen Eintrag, einen Pull Request und einen Bau von gut zwanzig Minuten.

Zwei Crons (14:07 und 15:07 UTC, also 16:07 im Sommer und im Winter) sind
Rückfall für den Dauerlauf; der jeweils falsche hält am Riegel. Die
Zeitumstellung muss hier nichts nachziehen.

## Warum die Karte über die Website geht

Meta holt ein Bild von einer öffentlichen Adresse ab. Die Karte wird
deshalb beim Paketbau gesetzt (`/instagram/zahlenkarte.jpg`), mit der
Beschriftung daneben (`/instagram/zahlenkarte.txt`, erste Zeile das Datum).
Der Veröffentlicher prüft, dass die Website die Karte **von heute** zeigt –
die Adresse antwortet auch mit gestern.

## Was beim Bauen auffiel

Für die fett-kursiven Zahlen des Vorbilds fehlte Noto Sans in Fett; sie
kam als WOFF aus `@fontsource/noto-sans` (OFL, Lizenz liegt bei). Und der
erste Entwurf setzte den höheren Balken so hoch, dass seine Beschriftung in
die Überschrift ragte – jetzt wird der höhere Balken immer auf 400 px
gesetzt, der andere im Verhältnis.

Die Zahlen der ersten täglichen Karte (Wohneigentum, Eurostat 2025) prüft
`tests/instagram-zahlenkarte.test.ts` gegen `data/snapshots/laender.json`;
die Differenz ist gerechnet, nicht getippt.
