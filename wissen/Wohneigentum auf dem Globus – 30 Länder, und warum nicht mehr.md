---
titel: Wohneigentum auf dem Globus – 30 Länder, und warum nicht mehr
datum: 2026-09-16
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Wohneigentum auf dem Globus – 30 Länder, und warum nicht mehr – 16. September 2026

Der Betreiber wollte die Wohneigentumsquote auf der Karte, „für alle Länder".
Die Kennzahl ist jetzt da. **„Alle Länder" ist sie nicht**, und das ist keine
Nachlässigkeit, sondern der Stand der Quellenlage.

## Was tatsächlich geprüft wurde

Vom Läufer aus, weil diese Umgebung ausser GitHub nichts erreicht
(`quellen-holen.yml`, drei Durchgänge):

    Weltbank WDI              keine Reihe zum Wohneigentum
    OECD SDMX, OECD.ELS.HD    200 – aber das ist die Gesundheitsabteilung
    Eurostat ilc_lvho02       200, 30 Länder, Stand 2025

Die ersten beiden Versuche bei Eurostat kamen mit 400 zurück. Der Grund stand
nicht in der Fehlermeldung, sondern in der Antwort selbst: Die Dimensionen
heissen `rskpovth` und `hhcomp`, nicht `incgrp` und `hhtyp`. Abzulesen war das
erst, nachdem eine kleine Scheibe (`geo=DE`) vollständig durchs Protokoll
passte – eine grosse Antwort wird gekürzt, und die Struktur steht hinten.

**„Geprüft und nichts gefunden" ist ein Zwischenstand, kein Ergebnis.** Er
steht deshalb mit Datum und Liste hier und im Kopf von
`EUROSTAT_WOHNEIGENTUM_URL`, damit der Nächste nicht dieselben drei Runden
dreht. Wer die OECD anschliesst, holt USA, Japan, Korea, Kanada und Australien
dazu; ihre Zahlen stehen in der Affordable Housing Database und damit
ausserhalb der SDMX-Schnittstelle, die dieses Projekt sonst benutzt.

## Warum hier nicht geschätzt wird

Bei Lohn und Vermögen füllt eine Regression aus der Kaufkraft die Lücken. Das
trägt dort, weil beide mit dem Wohlstand steigen. Beim Wohneigentum ist der
Zusammenhang **umgekehrt** und stark:

    Rumänien      93,2 %        Slowakei   93,8 %
    Deutschland   47,2 %        Österreich 54,2 %

Rumänien ist nicht viermal so wohlhabend wie Deutschland. Hohe Quoten stammen
oft aus der Privatisierung von Staatswohnungen, niedrige aus einem grossen,
gut geschützten Mietmarkt. Eine aus der Kaufkraft geschätzte Quote wäre nicht
ungenau, sondern seitenverkehrt – und sähe mit ihrer Nachkommastelle genauso
aus wie eine gemessene.

Dieselbe Begründung wie bei Arbeitslosigkeit und Inflation, und derselbe
Ausgang: gemessen oder gar nicht.

## Personen, nicht Haushalte

`ilc_lvho02` ist „Distribution of **population** by tenure status". Gezählt
werden Menschen, die in einer Eigentumswohnung leben, Kinder eingeschlossen –
nicht Haushalte, die eine besitzen. Die Quote je Haushalt liegt regelmässig
niedriger, weil Eigentümerhaushalte im Schnitt grösser sind.

Wer die beiden verwechselt, hält den Unterschied für einen Fehler. Deshalb
steht er in der Erklärung auf der Seite, in der Abgrenzung der Quelle und in
der Momentaufnahme – an allen drei Stellen, an denen jemand die Zahl zum
ersten Mal sieht.

## Die Auswertung liegt getrennt vom Abruf

`scripts/laender-abrufen.ts` ruft beim Laden sofort `main()` auf; wer es
importiert, startet einen vollständigen Abruf. Eine Auswertung darin wäre in
der einzigen Umgebung, in der hier geschrieben wird, gar nicht prüfbar.

Also `lib/wohneigentum.ts` – dieselbe Bauart wie `lib/pruefvergleich.ts` und
`lib/tageswecker.ts`. `tests/wohneigentum.test.ts` legt ihr die **echte**
Antwort vor, die der Läufer geholt hat, und prüft fünf Länderwerte gegen das
Protokoll. Die Datei unter `tests/fixtures/` ist diese Antwort, gekürzt auf
die gelesenen Teile und sonst unverändert.

JSON-stat ist eine flache Liste; welche Zelle zu welchem Land gehört, ergibt
sich aus `size`. Die Abfrage legt jede Dimension ausser `geo` auf einen Wert
fest – **und die Auswertung prüft, dass sie das wirklich tut.** Ohne diese
Prüfung stünde, falls Eurostat die Filterung einmal anders behandelt, bei
jedem Land irgendein Wert: plausibel, mit Nachkommastelle, falsch. Genau die
Art Fehler, die niemand mehr findet. Der Test legt ihr diesen Fall vor.
