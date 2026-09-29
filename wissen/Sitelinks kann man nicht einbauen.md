---
titel: Sitelinks kann man nicht einbauen
datum: 2026-08-28
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Sitelinks kann man nicht einbauen – 28. August 2026

Der Betreiber schickte einen Screenshot der Google-Suche nach „finanzfluss":
oben der Treffer, darunter sechs Unterseiten mit eigener Zeile – ETF Suche,
Rechner, Vergleiche, Copilot, Depot-Vergleich, Geldanlage. Dazu: _„Wenn man
uns auf Google sucht, sind wir nur schlecht zu finden und zudem gibt es nicht
diese Unterseiten wie im Bild zu sehen. Füge so was mal hinzu."_

## Was dazu ehrlich gesagt werden muss

**Diese Liste heißt Sitelinks, und sie lässt sich nicht hinzufügen.** Es gibt
keine Auszeichnung dafür, kein Meta-Element, keinen Eintrag in der
`sitemap.xml`. Google stellt sie selbst zusammen und zeigt sie nur, wenn es
eine Anfrage eindeutig dieser einen Website zuordnet – in aller Regel bei der
Suche nach dem Markennamen, und in aller Regel erst, wenn genug Leute nach
genau diesem Namen suchen und dann auch klicken.

Der Vergleich im Bild ist deshalb einer zwischen ungleichen Größen:
Finanzfluss hat einen YouTube-Kanal mit 1,6 Millionen Abonnenten, der im
selben Suchergebnis direkt darunter steht. Das ist der Grund für die
Sitelinks, nicht eine Auszeichnung im Quelltext, die hier fehlte.

Wer das anders darstellt, verkauft eine Maßnahme, die nichts bewirken kann.

## Was tatsächlich fehlte – und jetzt da ist

Eine Sache im Umfeld dieser Anzeige **ist** anforderbar: die **Suchbox im
Suchergebnis**, `SearchAction` im `WebSite`-Schema. Google verlangt dafür eine
Adresse, die eine Suchanfrage entgegennimmt und beantwortet.

Und genau die gab es nicht. In `lib/jsonld.ts` stand seit jeher:

> Hinweis: Eine SearchAction wird bewusst nicht ausgegeben, solange die
> Website keine eigene Suchfunktion hat. Google verlangt für sitelinks
> searchbox eine tatsächlich funktionierende Such-URL.

Der Satz war richtig. Die Suche dieser Website war ausschließlich ein Dialog:
Lupe, tippen, Treffer anklicken. Für den Besucher genügt das – nur hat eine
solche Suche keine Adresse.

Neu ist deshalb `/suche?q=…` (`app/suche/page.tsx`). Sie sucht im Browser,
gegen denselben `/suchindex.json` und mit derselben Bewertung aus
`lib/search-match.ts`, den auch der Dialog benutzt – zwei Suchen, die
verschieden ranken, wären schlimmer als eine. Damit ist die Bedingung erfüllt,
und die `SearchAction` darf stehen. **Nicht früher:** Eine `SearchAction` auf
eine Adresse, die nichts tut, ist kein Versehen, sondern eine falsche Angabe
an eine Suchmaschine.

Der Nebengewinn ist der größere: Ein Suchergebnis mit Adresse lässt sich
weitergeben, verlinken und aus der Adresszeile aufrufen. Das fehlte vorher
schlicht.

Dazu `alternateName` im `WebSite`-Schema. Die Domain heißt `iminvests.de`, der
Name „IM Invests" – wer das Wort einmal gelesen hat, tippt es später mal mit
und mal ohne Leerzeichen. Eine Suchmaschine erfährt von allein nicht, dass
beides dieselbe Marke meint. Keine erfundenen Varianten: Was dort steht, ist
der Name selbst oder die Domain ohne Endung.

## Was am Ranking hängt, und was nicht

„Schlecht zu finden" hat auf einer technisch sauberen Website selten
technische Gründe, und diese ist technisch sauber: `robots.txt` gibt alles
frei, die `sitemap.xml` führt 1.766 Seiten mit Datum und Änderungsfrequenz,
jede Seite trägt Titel und Beschreibung, und strukturierte Daten liegen an
über zwanzig Stellen – Organisation, Website, Breadcrumbs, Artikel,
Lerninhalte, Kurse, Datensätze, Anleitungen.

Was fehlt, ist nichts, was sich einbauen ließe: Alter der Domain, Verweise von
anderen Websites, und Leute, die den Namen suchen. Das entsteht durch
Veröffentlichen und Bekanntwerden, nicht durch Auszeichnung.

Die einzige technische Sache, die hier noch etwas bewegen könnte, ist keine
Codeänderung: **die Domain in der Google Search Console anmelden und die
`sitemap.xml` dort einreichen.** Das braucht einen Zugang und damit den
Betreiber; von hier aus ist es nicht zu machen.
