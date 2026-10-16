---
titel: Die Kacheln bekommen Bilder
datum: 2026-10-16
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Die Kacheln bekommen Bilder – 16. Oktober 2026

Der Betreiber: „Insta-Beitrag ab heute mit etwas mehr Bildern, also
spannender gestalten" – für Tagesnews und Tagesbeitrag, mit Fotos und
Kursgrafiken. Bis dahin hatten die Meldungskacheln nur Überschrift, Text und
Wasserzeichen; die Form war am 11.10.2026 ausdrücklich festgeschrieben
(„keine neuen Experimente"). Diese Anordnung löst jene für die Bildzone ab;
Überschrift und Text bleiben, wo sie waren.

**Die Fotos kommen aus den eigenen Deckblättern.** Eine neue Bildquelle
(Fotodienst, Wikimedia) hätte je Bild eine Lizenz und eine Nennung verlangt
und eine Auswahl, die niemand abnimmt. Die Deckblätter sind im Kanal schon
veröffentlicht; geschnitten wird der Teil unter der eingebrannten
Überschrift. Menschen, das Schloss und leere Himmel sind weggelassen.

**Zugeordnet wird über den Inhalt, nicht über die Stelle.** Am 14.10.2026
standen Kacheln und Ausgabe gegeneinander verschoben; eine Zuordnung nach
Reihenfolge hätte dem Ölpreis das EZB-Gebäude gegeben.

**Ein Kurs nur, wenn die Überschrift ihn nennt.** Aus dem Text gezogen,
bekam „US-Midterms" den Verlauf der Bank of America, weil sie im Text als
Beispiel stand. Ein Verlauf neben einer Meldung behauptet einen
Zusammenhang; den soll die Meldung selbst herstellen.

**Wortgrenzen nach Unicode.** `\b` kennt nur ASCII; vor „Öl" fand es keine
Grenze. `woerter()` baut die Muster mit Buchstaben-Grenzen aus `\p{L}`. Und
ein Firmenname, der zugleich ein Beiname ist, gehört dem Beinamen: „Dow" ist
in einer Meldung der Index, nicht Dow Inc.
