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

Zwei davon erledigt der Lauf: Kommentare (`lib/instagram-nachgang.ts`) und
das Kennzeichen. Drei kann Metas Schnittstelle nicht, und zwar für **alle**,
die sie benutzen, nicht nur für uns: Like- und Teilen-Zahlen verbergen gibt
es nur in der App, Musik nur bei Reels (Audio API), und eine Story mit
Verweis zum Beitrag gar nicht. Das steht in `INSTAGRAM.md` als Tabelle, damit keine spätere Sitzung
„erledigt" meldet, was nicht erledigt werden kann – und damit niemand ein
Feld errät, das Meta stillschweigend übergeht.

## Eine Story, die nicht gemeint war

Zuerst stellte der Lauf das Bild selbst als Story ein (`media_type=STORIES`,
#402) – das geht über die Schnittstelle. Der Betreiber: „nein, der Beitrag
soll in die Story gehen, dass man das anklicken kann und dann zum Beitrag
geleitet wird". Gemeint war das Teilen des Beitrags, und das gibt es nur in
der App; ein Verweis-Sticker lässt sich per Schnittstelle nicht setzen. Die
lose Story ist wieder entfernt, sonst stünden zwei da, eine davon ohne
Verweis. Die Lehre: Was die Schnittstelle unter demselben Wort anbietet, ist
nicht unbedingt das, was gemeint ist – erst fragen, wie es aussehen soll.

Ein Fehlschlag beim Einschalten der Kommentare ist eine Warnung: Der Beitrag
steht dann schon.
