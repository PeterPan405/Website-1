---
titel: Was die Schnittstelle nicht kann, steht dabei
datum: 2026-10-15
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Was die Schnittstelle nicht kann, steht dabei – 15. Oktober 2026

Der Betreiber ordnete für jeden Beitrag an: Hashtags viral und
themenbezogen, Likes und Teilen verborgen, Kommentare erlaubt, als KI-Inhalt
markiert, danach in die Story, bei den Tagesnews mit dem Sound „Walker" von
blackboxnorth.

Drei davon erledigt jetzt der Lauf (`lib/instagram-nachgang.ts`):
Kommentare, Kennzeichen und Story. Zwei kann Metas Schnittstelle nicht, und
zwar für **alle**, die sie benutzen, nicht nur für uns: Like- und
Teilen-Zahlen verbergen gibt es nur in der App, Musik nur bei Reels (Audio
API). Das steht in `INSTAGRAM.md` als Tabelle, damit keine spätere Sitzung
„erledigt" meldet, was nicht erledigt werden kann – und damit niemand ein
Feld errät, das Meta stillschweigend übergeht.

Die Story ist ein eigenes Bild, kein geteilter Beitrag. Ein Verweis-Sticker
zurück zum Beitrag lässt sich nicht setzen. Ein Fehlschlag bei Story oder
Kommentaren ist eine Warnung: Der Beitrag steht dann schon.
