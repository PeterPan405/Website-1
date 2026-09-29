---
titel: „Kinder je Frau" und nicht „Geburtenrate"
datum: 2026-09-16
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# „Kinder je Frau" und nicht „Geburtenrate" – 16. September 2026

Der Betreiber wollte die Geburtenrate auf den Globus, „also Kinder pro Kopf,
zum Beispiel in Deutschland sind hier 1,3". Die Zahl, die er meint, ist die
**zusammengefasste Geburtenziffer** – und genau daran hängt die einzige
Entscheidung, die hier zu treffen war.

## Zwei Zahlen, ein Wort

Umgangssprachlich ist beides „die Geburtenrate":

    rohe Geburtenziffer          Geburten je 1.000 Einwohner   Deutschland ~8
    zusammengefasste Ziffer      Kinder je Frau                Deutschland 1,36

Wer „Geburtenrate" über einer Karte liest und 1,36 sieht, hält die Zahl für
falsch – oder rechnet, schlimmer, mit ihr weiter. Deshalb heisst die Kennzahl
**„Kinder je Frau"**: Der Name sagt, was gemessen wird, statt den
gebräuchlichen Begriff zu übernehmen und die Verwechslung mitzuliefern.

Dass die Ziffer ein **Modellwert** ist, steht daneben: Sie sagt, wie viele
Kinder eine Frau bekäme, wenn für sie ihr Leben lang die Geburtenhäufigkeiten
dieses einen Jahres gälten. Einen solchen Jahrgang hat es nie gegeben. Das ist
kein Einwand gegen die Zahl – es ist die übliche Vergleichsgrösse –, aber es
gehört dazugesagt.

## Warum zwei Nachkommastellen

Arbeitslosigkeit und Inflation stehen mit einer Stelle da; eine zweite wäre
dort Scheingenauigkeit. Hier ist die erste zu grob. Die Hälfte aller Länder
liegt zwischen 1,2 und 2,1:

    Südkorea   0,75      Deutschland  1,36      Frankreich  1,61
    Israel     ~2,9      Nigeria      4,38      Niger       ~6,9

Auf eine Stelle gerundet fielen in Europa mehrere Klassengrenzen zusammen, und
der Unterschied zwischen 1,36 und 1,44 – der, über den jede Debatte zur
Bevölkerungsentwicklung geht – verschwände. Deshalb `FEINE_METRIKEN` in
`GlobusAnsicht.tsx` und `stellen: 2` im Abruf.

Der Betreiber erwartete 1,3 für Deutschland; die Weltbank führt 1,36 für 2024.
Die Karte zeigt die genauere Zahl, nicht die gerundete Erinnerung.

## Diesmal reicht eine Quelle für die Welt

Anders als beim Wohneigentum eine Woche zuvor: `SP.DYN.TFRT.IN` steht in den
World Development Indicators und deckt fast jedes Land ab. Die Weltbank trägt
sie aus den Bevölkerungsvorausberechnungen der Vereinten Nationen, den
nationalen Statistikämtern und Eurostat zusammen.

Der Abruf brauchte deshalb keine neue Funktion – nur einen Eintrag in
`RATENREIHEN` und einen Aufruf von `ladeWeltbankreihe`. Dass die Reihe
antwortet und was sie liefert, hat vor dem Schreiben ein Läufer geprüft:
Deutschland 1,36 · Frankreich 1,61 · Südkorea 0,748 · Nigeria 4,382, alle für 2024.

## Und auch hier wird nicht geschätzt

Der Zusammenhang mit dem Wohlstand ist stark – arme Länder haben mehr Kinder.
Die Ausnahmen sind aber genau die Fälle, wegen derer man auf die Karte sieht:
Südkorea liegt bei 0,75 und ist reich, Israel bei fast 3 und ebenso. Eine
Regression aus der Kaufkraft würde beide glattbügeln und dabei das
Interessante entfernen.
