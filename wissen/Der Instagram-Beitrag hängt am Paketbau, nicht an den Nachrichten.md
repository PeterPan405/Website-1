---
titel: Der Instagram-Beitrag hängt am Paketbau, nicht an den Nachrichten
datum: 2026-08-29
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Der Instagram-Beitrag hängt am Paketbau, nicht an den Nachrichten – 29. August 2026

Der Betreiber wollte den Beitrag vollautomatisch: morgens die Top-Meldungen des
Tages als Karussell bei `@im_invests`, ohne Handgriff. Der Lauf lag bis dahin
auf `workflow_dispatch` und hatte genau einen Trockenlauf hinter sich.

## Warum nicht dort, wo der Podcast hängt

Der Kopf von `instagram-beitrag.yml` nannte `nachrichten.yml` als künftiges
Ziel – dorthin, wo auch der Podcast angestoßen wird. Das wäre falsch gewesen,
und zwar auf die Art, die niemand bemerkt:

**Meta holt die Bilder selbst.** Übergeben wird eine Adresse, keine Datei.
`iminvests.de/instagram/1.jpg` antwortet jeden Tag – vor der Übertragung eben
mit der Kachel von gestern. `nachrichten.yml` endet aber, während der Paketbau
noch läuft; es stößt ihn nur an. Ein Anstoß von dort hätte an vielen Tagen die
Schlagzeilen von gestern gepostet, **ohne dass ein Lauf rot geworden wäre.**

Der Podcast darf dort hängen, weil er die Ausgabe aus dem Repository liest. Der
Instagram-Beitrag liest sie vom Webspace. Das ist der ganze Unterschied – und
er entscheidet über die Stelle in der Kette. Angestoßen wird jetzt vom letzten
Schritt in `paket-bauen.yml`, **nach** „Ergebnis von außen prüfen": Zu diesem
Zeitpunkt ist nachgewiesen, dass der neue Stand ausgeliefert wird.

## Zwei Riegel, und beide fragen etwas Äußeres

Der Paketbau läuft mehrmals täglich, dazu kommt ein Rückfalltermin um 04:52.
Ein Beitrag ist nicht zurückzunehmen, nur zu löschen. Also:

1. **Zeigt die Website schon heute?** Geprüft wird die erste Zeile von
   `/instagram/beschriftung.txt` – sie trägt den Tag und stammt aus demselben
   Bau wie die Kacheln. Steht dort gestern, ist die Übertragung nicht durch.
2. **Steht der Beitrag schon im Kanal?** Gefragt wird die Graph-Schnittstelle
   nach den letzten zehn Beiträgen, nicht eine Datei im Repository. _Ein Riegel
   ist so gut wie die Quelle, die er fragt_ – dieselbe Lehre wie beim
   Podcast-Upload, der den YouTube-Kanal fragt und nicht das Register.

Beide enden mit Code 0. **Ein Beitrag, der ausbleibt, weil er schon draußen
ist, ist kein Fehlschlag** – rot wäre hier eine Mail an jedem richtigen Tag,
und die liest nach zwei Wochen niemand mehr. Rot wird nur, wer den Bestand
nicht lesen kann: Wer nicht weiß, was im Kanal steht, weiß auch nicht, ob er
doppelt postet.

Riegel 1 wurde gegen einen falschen Tag geprüft und hielt. Riegel 2 wurde gegen
ein ungültiges Token geprüft und brach ab, wie er soll – gegen einen echten
Doppelpost prüfen kann erst, wer ein Token hat.

## `datumLang` musste umziehen

Riegel 1 vergleicht eine Zeile, die `app/instagram/beschriftung.txt/route.ts`
geschrieben hat. Beide brauchen dieselbe Schreibweise – „29. August 2026" –,
sonst hält der Riegel entweder alles zurück oder nichts.

Die Funktion stand in `lib/instagram-bild.tsx`, und dort kommt sie für ein
Skript nicht heraus: Die Datei enthält JSX, Node lädt sie nicht. Also nach
`lib/datum-lang.ts`, von dort weitergereicht. **Eine zweite Fassung wäre genau
die Doppelung gewesen, die an der Stelle auseinanderläuft, an der es niemandem
auffällt.**

Nicht zu verwechseln mit dem gleichnamigen `datumLang` in
`scripts/nachrichten-aus-bestand.ts`: Das schreibt `29.8.2026`, ist eine andere
Funktion und bleibt, wo es ist.

## Was offen bleibt

`IG_ACCESS_TOKEN` und `IG_USER_ID` sind nicht hinterlegt. Bis dahin läuft die
Kette jeden Morgen durch und hört mit einer Warnung auf. **Die Automatik ist
fertig, die Zugangsdaten fehlen** – und die kann nur holen, wer sich bei
Facebook anmeldet und eine Meta-App anlegt.
