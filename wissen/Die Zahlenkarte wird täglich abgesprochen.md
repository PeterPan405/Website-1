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

## Warum es keinen Zeitplan gibt

Der Veröffentlicher der Zahlenkarte startet nur von Hand, mit dem Tag der
Freigabe als Datum. Ein Zeitplan um 17 Uhr hätte veröffentlicht, was
niemand abgenommen hat – genau das, was die Anordnung ausschließt. Ein
Datum läuft um Mitternacht ab; eine vergessene Freigabe lässt den Beitrag
ausfallen, statt ihn ungesehen hinauszuschicken.

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
