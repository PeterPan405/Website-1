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

## Der vierte Riegel ist ein Datum, kein Schalter

Anordnung des Betreibers vom 11. Oktober 2026, am selben Abend, an dem der
direkte Weg zu Meta zum ersten Mal stand: **Es geht kein Beitrag mehr hinaus,
den er nicht vorher gesehen hat.** Täglich wird besprochen, was hinausgeht –
Nachrichten oder ein Wissensbeitrag –, und erst danach wird freigegeben.

Der naheliegende Weg wäre ein Schalter gewesen: `INSTAGRAM_AUTOMATISCH` auf
`aus`, und wer veröffentlichen will, stellt ihn kurz an. Genau das ist die
Falle. **Ein `true` bleibt stehen.** Wer es einmal setzt und nicht
zurückstellt, hat die Automatik dauerhaft wieder eingeschaltet, ohne es zu
merken – und der nächste Beitrag geht ungesehen hinaus. Dasselbe Muster wie
bei `TROTZDEM=1` im Zahlenwächter, nur ohne dessen Gegenprobe.

Freigegeben wird deshalb ein **Tag**: `INSTAGRAM_FREIGABE` trägt ein Datum,
und der Lauf vergleicht es mit `date -u +%F`. Das läuft um Mitternacht von
selbst ab. Freigegeben ist immer nur ein Tag, und die Freigabe muss jeden Tag
neu erteilt werden. Vergisst sie jemand, bleibt der Beitrag aus – **das ist
der gewollte Ausgang, nicht der Fehler.**

Der Riegel sitzt im Workflow und nicht im Skript, und das ist Absicht: Er
betrifft nicht die Frage „ist dieser Beitrag in Ordnung?" – die stellen die
drei Riegel im Skript –, sondern „darf heute überhaupt etwas hinaus?". Diese
Frage gehört vor den Lauf, nicht hinein. Nebenbei greift er dadurch auch für
den Weg über den Dienst, der im Skript einen anderen Zweig nimmt.

Ohne gesetzte Variable ist nichts freigegeben. Das ist der Normalzustand, und
der Lauf sagt in der Zusammenfassung, was hinausginge und mit welchem Befehl
man es freigibt.

**Nachtrag, derselbe Abend:** Für den Tagesbeitrag gilt die Freigabe seither
von selbst. Der Betreiber, nachdem „Top-News des Tages" nach dem Muster der
54 bisherigen Beiträge nachgebaut war: „Sobald die Daily News nachts gemacht
werden … soll bei Instagram die Daily News nun vollautomatisch erscheinen.
Du hast ja alle Vorgaben von mir jetzt bekommen. Diese müssen zwingend
beachtet werden."

Das ist kein Widerruf der Regel oben, sondern ihre Anwendung: Die Freigabe
gilt einer **Form**, die er gesehen und abgenommen hat – sechs Kacheln, die
feste Beschriftung, der KI-Hinweis, fünf Schlagworte, nur werktags –, und
diese Form erzwingt jetzt `lib/instagram-plan.ts`. Ein Plan, der sie nicht
einhält, ergibt „kein-beitrag" statt eines abweichenden Beitrags. Für alles
andere – Erklärbeiträge, Zahlenkarten – gilt weiter das Datum.

Deshalb fragt der Riegel die **Art** aus `/instagram/stand.txt` und keinen
neuen Schalter: „tagesnews" steht dort nur, wenn die Prüfung bestanden ist.

## „Top-News des Tages" wird nachgebaut, nicht neu gestaltet

Am Abend des 11. Oktober 2026 stellte sich heraus, dass der Generator in
`lib/instagram-bild.tsx` seit August Kacheln erzeugte, die im Kanal **nie**
erschienen waren: weiß, „DIE MELDUNGEN DES TAGES" in blauen Versalien, drei
Schlagzeilen. Im Kanal standen 54 Tagesbeiträge in einer ganz anderen Form –
Foto-Deckblatt, fünf weiße Kacheln mit Wasserzeichen. Veröffentlicht hatte sie
der Dienst; was das Repository baute, sah niemand.

Der Betreiber dazu: „Du sollst das gleiche Design wiedergeben … keine neuen
Experimente, sondern erstmal dabei bleiben."

Deshalb ist der neue Generator **abgemessen, nicht entworfen.** Alle 130
Beiträge wurden über die Graph-Schnittstelle abgezogen und ausgewertet; die
Maße stehen in `lib/instagram-bild.ts`, das Muster in `INSTAGRAM.md`. Drei
Entscheidungen darin sind keine Selbstverständlichkeit:

**Das Wasserzeichen ist ausgeschnitten.** `lib/instagram/grundplatte.png` ist
ein Streifen aus einer veröffentlichten Kachel. Nachgebaut aus
`public/logo.svg` hätte es ähnlich ausgesehen – und ähnlich ist genau das, was
im Raster neben 270 echten Kacheln auffällt.

**Die Deckblätter sind gebraucht.** Das Deckblatt unterscheidet sich von Tag
zu Tag nur im Foto. Ein neues Foto braucht eine Bildquelle – Bilddienst,
Bildgenerator –, und jede davon wäre die neue Form, die nicht gewünscht war.
Genommen sind 28 der 37 Deckblätter seit dem 17. August, an denen nichts an
einen Tag gebunden ist; Menschen, Marken und Produkte sind weggelassen.

**Der Plan hält die Ausgabe nie auf.** Die Kurztexte für die Kacheln schreibt
der Nachrichten-Agent neben die Ausgabe. Prüft `nachrichten-erzeugen.ts` sie
und findet einen Fehler, wird er laut gesagt – aber `process.exit(1)` gibt es
dafür nicht. Die Ausgabe ist Website, Podcast und der Rest des Tages; der
Beitrag ist einer von fünf Abnehmern. Fiele der Tag wegen einer zu langen
Kachelüberschrift aus, wäre das der teuerste denkbare Tausch.

Dass es **nur werktags** einen Tagesbeitrag gibt, ist ebenfalls gemessen:
54 von 54 Werktagen, 0 von 22 Wochenendtagen. Am 11.10.2026 wurde das
Wochenende zuerst für einen Ausfall gehalten – es war keiner.

**Seit dem 17.10.2026 gilt das nicht mehr:** Der Betreiber hat angeordnet
„mache aber jetzt täglich News des Tages". Die Messung beschrieb, was war;
sie war keine Regel, die er sich gesetzt hatte. `istErscheinungstag()` bleibt
als Stelle für eine künftige Ausnahme stehen, die Deckblätter zählen Tage
statt Werktage – sonst bekäme das Wochenende das Bild vom Freitag.

Der Tag, für den die Kacheln gelten, steht seither in `/instagram/stand.txt`
statt in der ersten Zeile der Beschriftung: Die Beschriftung beginnt wie im
Kanal mit „Die wichtigsten Börsennews des Tages. 📈". `lib/datum-lang.ts`, das
nur für den alten Abgleich existierte, ist damit entfallen.

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
