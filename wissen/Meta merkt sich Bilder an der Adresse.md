---
titel: Meta merkt sich Bilder an der Adresse
datum: 2026-10-18
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Meta merkt sich Bilder an der Adresse – 18. Oktober 2026

Der neu gemachte Sonntagsbeitrag ging mit Kacheln hinaus, die es auf der
Website nicht mehr gab: „Öl: Neue Angriffe" vom Vormittag, sogar „Brent nahe
110 $" vom Freitag. Die Website stimmte; der Riegel „zeigt sie heute?"
fragte richtig. Aber `instagram-veroeffentlichen.ts` gab Meta jeden Tag
dieselben Adressen (`/instagram/2.jpg`), und Meta nahm, was es unter dieser
Adresse schon kannte.

Seitdem trägt jede Kachel-Adresse `?v=` mit dem SHA-1 des Bildes, das der
Lauf selbst von der Website geholt hat; die Zahlenkarte `?d=…&t=…`. Neuer
Inhalt, neue Adresse. **Ein Riegel, der die eigene Website fragt, sagt
nichts darüber, was ein Dritter von ihr behalten hat.**
