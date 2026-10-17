---
titel: X teilt, was Instagram zeigt
datum: 2026-10-17
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# X teilt, was Instagram zeigt – 17. Oktober 2026

Der Betreiber: „Ich möchte die News und Beiträge auch auf Twitter (X)
automatisch teilen." Eingerichtet wird das Konto in der Sitzung am PC des
Betreibers (`werkzeuge/x-einrichten.md`) – Anmeldung, Zahlung und Schlüssel
gehen nicht aus der Cloud.

**Dieselben Bilder, ein eigener Text.** X nimmt 280 Zeichen und vier Bilder
je Post; die Tagesnews werden zwei Posts (Deckblatt und drei Kacheln, als
Antwort die zwei übrigen). Der Text kommt aus `lib/x-text.ts`, gebaut mit
der Website (`/x/heute.json`), damit Bild und Text aus demselben Stand
stammen.

**Kein Link im Post.** Über die Schnittstelle kostet ein Post mit Link rund
0,20 $, ohne rund 0,015 $ (Stand Oktober 2026, Drittanbieter-Übersichten;
maßgeblich docs.x.com). Auch „iminvests.de" als Text nicht: X macht selbst
einen Link daraus. Der Link steht im Profil.

**Die Marke statt des Kanals.** Ob heute schon geteilt wurde, steht auf dem
wurzellosen Zweig `x-gepostet` – den eigenen Kanal zu lesen kostet bei X je
Post. Die Marke wird geschrieben, sobald der erste Post draußen ist, auch
wenn die Antwort scheitert.

**Ruhend, bis ein Mensch es gesehen hat.** Ohne Schlüssel endet jeder Lauf
grün mit Hinweis; angestoßen wird aus Bau und Zahlenkarte erst, wenn
`X_AKTIV` auf `ja` steht. Der Weg zu X war beim Schreiben nicht prüfbar –
nur die Signatur, gegen das Rechenbeispiel der X-Dokumentation. Wo die
einzige prüfbare Umgebung nicht die ist, in der es kaputtgeht, ist „müsste
jetzt gehen" keine Aussage; deshalb erst Trockenlauf, dann ein beobachteter
echter Lauf.
