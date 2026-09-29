---
titel: Drei Listen für eine Kennzahl – und zwei, die seit Monaten fehlten
datum: 2026-09-16
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Drei Listen für eine Kennzahl – und zwei, die seit Monaten fehlten – 16. September 2026

Der Betreiber schickte einen Bildschirmabzug der Landtafel zu Spanien: acht
Kennzahlen, und die Eigentumsquote nicht dabei. Sie stand in `metriken`, sie
färbte die Karte, sie hatte eine Spalte in der Ländertabelle – nur die Tafel
zum angeklickten Land kannte sie nicht.

## Die Ursache: drei Listen, nichts verglich sie

Eine Kennzahl muss an drei Stellen auftauchen, damit sie vollständig ist:

    lib/laender.ts                   metriken + wertFuer
    components/globus/GlobusAnsicht  wertVon (Karte) + Landtafel
    components/globus/Laendertabelle die Spalten

Alle drei von Hand gepflegt. Genau der Fall, vor dem `AGENTS.md` warnt: _Eine
Doppelung mit guter Begründung altert trotzdem._ Und sie fiel nicht auf, weil
ein Land ohne Zeile aussieht wie ein Land ohne Angabe.

## Was der Test dann wirklich fand

`tests/globus-kennzahlen.test.ts` hält die drei Listen gegeneinander. Dafür
trägt jede Kennzahl den Namen ihres Feldes (`feld` in `Metrik`); zusammenführen
liesse sich das nur mit einem Umbau der Tafel, die je Kennzahl eine eigene
Schreibweise braucht („% des BIP", „US-$ je Erwachsenem", „Kinder je Frau").

Beim **ersten Lauf** fiel nicht die gemeldete Kennzahl durch, sondern zwei
andere:

    Einkommen je Kopf    (bneProKopf)      203 Länder
    Kaufkraft je Kopf    (bipProKopfKKP)   203 Länder

Beide standen in der Auswahl über der Karte. Beide trafen in `wertVon` auf
keinen Fall und fielen in `default: return null` – wer sie anklickte, bekam
eine **vollständig graue Weltkarte**. Von aussen sieht das aus wie eine
Kennzahl ohne Daten, nicht wie ein fehlender Zweig; die Legende schrieb
dazu brav „0 von 249 Ländern und Gebieten mit Wert". In der Landtafel und in
der Tabelle fehlten sie ebenso.

Wie lange, lässt sich nicht sagen. Gemeldet hat es niemand.

## Die eigentliche Lehre: `default` hat den Fehler verdeckt

Der `default: return null` war der Grund, dass es keinen Krach gab. Ohne ihn
hätte TypeScript beim Hinzufügen der beiden Kennzahlen sofort protestiert.

Er ist jetzt weg, und `AnsichtMetrik.id` trägt statt `string` den Typ
`MetrikId`. Damit prüft der Compiler die Vollständigkeit. Nachgemessen: Eine
erfundene dreizehnte Kennzahl bricht den Bau an **zwei** Stellen –

    components/globus/GlobusAnsicht.tsx  Function lacks ending return statement
    lib/laender.ts                       Function lacks ending return statement

– und zwar bevor irgendetwas gebaut wird. Das ist die stärkere Absicherung;
der Test daneben deckt ab, was der Compiler nicht sieht: Landtafel und
Tabelle, die keine `switch` sind, sondern Listen.

**Ein `default`-Zweig in einer Fallunterscheidung über einen geschlossenen
Typ ist keine Vorsicht, sondern ein abgeschalteter Compiler.**

## Und die Umbenennung

Die Geburtenziffer heisst auf Wunsch des Betreibers jetzt „Geburtenrate"
statt „Kinder je Frau". Der Einwand – Geburtenrate bezeichnet statistisch die
Geburten je tausend Einwohner – lag ihm vor; er hat den geläufigen Namen
trotzdem verlangt, und das ist vertretbar: Kaum jemand sucht auf einer Karte
nach „Kinder je Frau".

Die Genauigkeit wandert deshalb in die **Einheit**, und die steht überall
dort, wo die Zahl steht: in der Legende („Angaben in Kinder je Frau"), in der
Landtafel („1,36 Kinder je Frau"), in der Tabellenüberschrift und im ersten
Satz der Erklärung. Der Name ist geläufig, die Zahl bleibt eindeutig.

---
