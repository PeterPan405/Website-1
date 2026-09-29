---
titel: Der Kasten war das einzige Ordnungsmittel
datum: 2026-08-28
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Der Kasten war das einzige Ordnungsmittel – 28. August 2026

Der Betreiber: _„Die Webseite ist an vielen Stellen sehr unübersichtlich. Mache
sie ein wenig minimalistischer und somit auch hochwertiger."_

Statt zu raten, wurde gebaut und fotografiert: `npm run build`, `out/` über
einen lokalen Server, und Chromium – auf dem Läufer ohnehin vorhanden – schießt
zehn Seiten in voller Länge. Das Bild war eindeutig und an jeder Stelle
dasselbe.

**Auf dieser Website ist der Kasten das einzige Ordnungsmittel.** 1.020 Stellen
mit `border`, 78 mit `rounded-full`. Auf der Aktienseite standen sechs
gerundete Kacheln mit Rahmen und eigener Füllung, jede mit einem drei Zeilen
langen Erklärsatz darin – zwei Reihen ungleich hoher Kästen, bevor der erste
Kurs zu sehen war. In der Seitenleiste einer Lernthemenseite lagen vier bis
fünf Karten übereinander, jede mit Rahmen, Füllung, Radius und Schatten. Unter
dem Text acht Wörter in umrandeten Kapseln.

Nichts davon ist für sich falsch. Zusammen ergibt es eine Seite, auf der jedes
Element ruft „hier fängt etwas Neues an" – und wo alles ruft, ordnet nichts
mehr.

## Was geändert wurde, und warum an genau drei Stellen

Nicht Seite für Seite, sondern an den geteilten Bausteinen. 85 Seiten von Hand
umzuräumen wäre 85 Gelegenheiten gewesen, sie auseinanderlaufen zu lassen.

**1. Die Kennzahl verliert ihren Kasten** (`components/ui/Stat.tsx`). Aus der
gerundeten Kachel wird eine Haarlinie mit Etikett und großer Zahl darunter. Das
Muster ist nicht erfunden, sondern von der eigenen Startseite genommen: Die
drei Zahlen unter dem Titel („Themen, Lernstufen, Rechner") stehen seit jeher
so da und waren die ruhigste Stelle der Website. `Stat` wird an über zwanzig
Stellen benutzt – Kursdetails, alle Rechner, Ländervergleich, Anleihen –,
deshalb war das der größte Hebel.

**2. Die Karte hört auf zu schweben** (`fk-card` in `app/globals.css`). Der
Schatten stammt aus der Zeit, in der eine Karte sich von einer _weißen_ Fläche
abheben musste. Seit die Website auf Papierton steht, hebt die Füllung schon
eine Spur ab und die Linie zieht die Kante; der Schatten macht daraus einen
schwebenden Kasten. Er bleibt genau dort, wo etwas wirklich abhebt: unter dem
Zeiger (`fk-card-interactive`).

**3. Die Schlagwörter verlieren die Kapsel** (`components/ui/TagLinks.tsx`).
Was die Kapsel leistete, leistet die Unterstreichung besser – in der Sprache,
die jeder Browser seit dreißig Jahren spricht.

Dazu ein neuer Baustein `fk-block`: ein Abschnitt einer Seitenleiste ohne
Kasten, getrennt durch eine Linie über dem Titel, und keine über dem ersten.
Angewandt auf die beiden meistbesuchten Seitenleisten – Lernthema und
Einzelaktie.

## Der Fehler dabei, und wie er gefunden wurde

Die erste Fassung der Schlagwörter setzte die Unterstreichung auf
`decoration-border`, also auf die Rahmenfarbe und damit sehr hell. Im Bild
danach war der Unterschied zwischen verlinkt und nicht verlinkt praktisch weg.

Das ist keine Schönheitsfrage. Der Baustein trägt seit jeher eine Auskunft:
Nicht jedes Wort hat ein Ziel, und die ohne Ziel müssen erkennbar anders
aussehen, _„damit niemand darauf klickt und sich wundert"_. Die alte Kapsel
löste das über durchgezogen gegen gestrichelt. Meine erste Fassung hätte die
Auskunft stillschweigend kassiert – und der Kommentar darüber hätte weiter
behauptet, sie sei da.

Aufgefallen ist es nur, weil nach der Änderung noch einmal fotografiert wurde.
Beim Lesen des Codes wäre es nicht aufgefallen: Dort steht `underline`, und
`underline` klingt sichtbar.

**Die Lehre: Eine Gestaltungsänderung ist erst geprüft, wenn man sie gesehen
hat.** `tsc` grün, ESLint grün, 124 Testdateien grün, Paketprüfung ohne
Beanstandung – und die Seite hätte eine Auskunft weniger gegeben.

## Was ausdrücklich nicht geändert wurde

Kein Abschnitt, keine Zahl, keine Erklärung ist verschwunden. Der Auftrag hieß
„minimalistischer", nicht „weniger". Was auf der Seite stand, steht weiter
darauf; nur die Rahmen darum sind weg. Inhalt zu streichen wäre eine
Entscheidung über Bestand und damit eine Frage an den Betreiber, keine
Gestaltungsfrage.

Ebenfalls stehen geblieben: die Rahmen um Karten, die als Ganzes ein Link sind
– die drei Stufen eines Lernthemas, die Kurskacheln der Marktübersicht. Dort
ist der Rahmen kein Schmuck, sondern die Auskunft „das hier lässt sich
anfassen".
