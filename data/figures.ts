/**
 * Verzeichnis der Grafiken im Lernbereich.
 *
 * ## Warum gezeichnetes SVG und keine Bilddateien
 *
 * Die Grafiken sind handgeschriebenes SVG im HTML, keine hochgeladenen Bilder.
 * Das hat vier Gründe, von denen jeder für sich schon reichen würde:
 *
 * - **Rechte.** Für ein fremdes Bild bräuchte es eine Lizenz und einen
 *   Bildnachweis. Was hier gezeichnet wird, gehört uns.
 * - **Zahlen.** Die Werte in den Grafiken stammen aus denselben Funktionen wie
 *   die Tabellen daneben (`lib/finance.ts`). Ein Bild wäre eine zweite,
 *   unabhängige Quelle für dieselbe Zahl – und die geht irgendwann auseinander.
 *   Eine Grafik, die der Tabelle über ihr widerspricht, ist schlimmer als gar
 *   keine Grafik.
 * - **Darstellung.** SVG bleibt bei jeder Spaltenbreite scharf, übernimmt die
 *   Farben des hellen wie des dunklen Themes und braucht kein JavaScript. Die
 *   Seiten werden statisch gebaut; die Grafik steht fertig im HTML.
 * - **Zugänglichkeit.** Jede Grafik trägt `<title>` und `<desc>`. Wer sie nicht
 *   sehen kann, bekommt den Inhalt vorgelesen statt „Bild“.
 *
 * ## Was hier bewusst fehlt
 *
 * Karikaturen und gezeichnete Illustrationen sind nicht dabei. Sie ließen sich
 * hier nicht ehrlich herstellen: Zeichnungen von Hand gibt es nicht, und
 * fremdes Bildmaterial hätte eine Lizenz- und Urheberfrage im Schlepptau, die
 * eine Bildungsseite sich nicht einhandeln sollte. Was diese Grafiken statt
 * dessen leisten, ist der eigentliche Zweck einer Karikatur: eine Aussage in
 * einem Blick sichtbar machen.
 *
 * ## Aufbau
 *
 * Hier stehen nur Kennung und Beschreibung – die Zeichnung selbst liegt unter
 * `components/content/figures/`. Die Trennung ist nicht kosmetisch: Daten
 * dürfen in diesem Projekt nicht von Komponenten abhängen, und `data/content.ts`
 * braucht die Kennungen für das Blockmodell.
 */

export type FigureId =
  /* -------------------------------------------------- Akademie: Charts */
  /** Aufbau einer Kerze: Körper, Dochte, die vier Kurse. */
  | 'ta-kerze-aufbau'
  /** Aufwärtstrend aus höheren Hochs und Tiefs, danach der Bruch. */
  | 'ta-trendstruktur'
  /** Eine Marke als Widerstand, nach dem Ausbruch als Unterstützung. */
  | 'ta-unterstuetzung-widerstand'
  /** Derselbe Kurs mit einfachem und exponentiellem Durchschnitt. */
  | 'ta-sma-vs-ema'
  /** MACD-Linie, Signallinie und Histogramm unter einem Kursverlauf. */
  | 'ta-macd'
  /** Der Elliott-Grundzyklus aus fünf Impuls- und drei Korrekturwellen. */
  | 'ta-elliott-zyklus'
  /** Wo eine Impulswelle gestreckt wird – in 1, in 3 oder in 5. */
  | 'ta-elliott-extension'
  /** Die verkürzte fünfte Welle, die das Hoch der dritten nicht überbietet. */
  | 'ta-elliott-verkuerzung'
  /** Führende und endende Diagonale nebeneinander. */
  | 'ta-elliott-diagonale'
  /** Der Zickzack im 5-3-5-Aufbau. */
  | 'ta-elliott-zigzag'
  /** Normale, erweiterte und laufende Flat. */
  | 'ta-elliott-flat'
  /** Kontrahierendes, Barrier- und expandierendes Dreieck. */
  | 'ta-elliott-dreieck'
  /** Doppelte und dreifache Korrektur: W-X-Y und W-X-Y-X-Z. */
  | 'ta-elliott-kombination'
  /** Welche Welle welches Fibonacci-Verhältnis anläuft. */
  | 'ta-elliott-ziele'
  /** Der Wechsel zwischen scharfer und flacher Korrektur. */
  | 'ta-elliott-wechsel'
  /** Die Wellengrade: dieselbe Form auf jeder Zeitebene. */
  | 'ta-elliott-grade'
  /** Wie tief die Korrekturwellen üblicherweise zurücklaufen. */
  | 'ta-elliott-ruecklaeufe'
  /** Wie weit die Impulswellen üblicherweise über die vorige hinauslaufen. */
  | 'ta-elliott-streckungen'
  /** Wo jede Welle dreht – der Umkehrbereich als Band. */
  | 'ta-elliott-umkehrbereiche'
  /** Umkehrbereiche in Dreieck, Kombination und Diagonale. */
  | 'ta-elliott-umkehr-weitere'
  /* ------------------------------------- Akademie: übrige Bereiche */
  /** Wie das Risiko mit der Zahl der Titel fällt – und wo es aufhört. */
  | 'pt-diversifikation'
  /** Die Effizienzlinie und die Mischungen darunter. */
  | 'pt-effizienzlinie'
  /** Gleichlauf, Unabhängigkeit und Gegenlauf zweier Anlagen. */
  | 'pt-korrelation'
  /** Der maximale Rückgang, gemessen vom Hoch zum Tief danach. */
  | 'pt-maximaler-rueckgang'
  /** Dieselben Renditen in anderer Reihenfolge – bei Entnahme. */
  | 'pt-sequenzrisiko'
  /** Normale, flache und inverse Zinsstrukturkurve. */
  | 'ma-zinsstruktur'
  /** Der Konjunkturzyklus in vier Phasen. */
  | 'ma-konjunkturzyklus'
  /** Die Wertfunktion: Verluste wiegen schwerer als Gewinne. */
  | 'av-wertfunktion'
  /** Wie Gewinnrechnung, Kapitalflussrechnung und Bilanz zusammenhängen. */
  | 'fa-drei-abschluesse'
  /** Einfacher Zins gegen Zinseszins über 40 Jahre. */
  | 'zins-gerade-vs-kurve'
  /** Drei Sparer mit gleicher Rate und unterschiedlichem Startalter. */
  | 'zins-frueh-vs-spaet'
  /** Endkapital bei vier Kostenquoten. */
  | 'zins-kosten'
  /** Plus 50 Prozent und minus 50 Prozent ergeben minus 25 Prozent. */
  | 'zins-volatilitaetsbremse'
  /** Hundert Anteile, davon wenige die eigenen. */
  | 'aktie-anteil'
  /** Der Kursabschlag am Ausschüttungstag. */
  | 'aktie-dividendenabschlag'
  /** Geldkurs, Briefkurs und die Spanne dazwischen. */
  | 'aktie-spread'
  /** Aktie, Anleihe, Immobilie und Rohstoff im Vergleich des laufenden Ertrags. */
  | 'rohstoffe-kein-ertrag'
  /** Terminkurve in Contango und in Backwardation. */
  | 'rohstoffe-rollkurve'
  /** Ländergewichtung des MSCI World. */
  | 'msci-world-laender'
  /** Kontostand und Kaufkraft desselben Betrags über 30 Jahre. */
  | 'inflation-kaufkraft'
  /** Anleihekurs über dem Marktzins, für drei Restlaufzeiten. */
  | 'anleihe-kurs-und-zins'
  /** Kursverlust je Restlaufzeit bei zwei Prozentpunkten mehr Zins. */
  | 'staatsanleihe-zinsschock'
  /** Ergebnis von Kauf- und Verkaufoption bei Verfall. */
  | 'option-auszahlung'
  /** Wie die Prämie mit der Restlaufzeit schrumpft. */
  | 'option-zeitwertverfall'
  /** Wie sich die gleichbleibende Kreditrate in Zins und Tilgung aufteilt. */
  | 'kredit-zins-und-tilgung'
  /** Laufzeit desselben Darlehens bei vier Anfangstilgungen. */
  | 'kredit-anfangstilgung'
  /** Welcher Gewinn nötig ist, um einen Verlust auszugleichen. */
  | 'risiko-erholung'
  /** Gesamtrendite ohne die besten Wochen. */
  | 'timing-beste-wochen'
  /** Heutiges Netto gegen gesetzliche Nettorente. */
  | 'rente-luecke'
  /** Der Weg einer Wertpapierorder vom Broker bis ins Depot. */
  | 'boerse-vom-klick-zur-buchung'
  /** Der Weg einer Zahlung durch ein Blockchain-Netz. */
  | 'blockchain-zahlung'
  /** Vom Leitzins über die Banken bis zu den Preisen. */
  | 'notenbank-transmission'
  /** Die Reihenfolge vor dem ersten Wertpapierkauf. */
  | 'einsteiger-reihenfolge'
  /** Kauf- und Verkaufseite eines Orderbuchs mit dem Spread dazwischen. */
  | 'markt-orderbuch'
  /** Zins aufs Tagesgeldkonto gegen die Inflation desselben Jahres. */
  | 'tagesgeld-realzins'
  /** Wie viele Anteile eine gleichbleibende Rate bei schwankendem Kurs kauft. */
  | 'sparplan-durchschnittspreis'
  /** Ergebnis einer Fremdwährungsanlage bei vier Wechselkursen. */
  | 'waehrung-ergebnis'
  /** Welchen Hebel eine Sicherheitsleistung ergibt – und wann der Einsatz weg ist. */
  | 'derivat-hebel'
  /** Gesicherte und ungesicherte Anteile eines Bankguthabens. */
  | 'einlagensicherung-grenze'
  /** Ordergebühr und Spread nach Ordergröße. */
  | 'depot-orderkosten'
  /** Endkapital desselben Sparplans bei fünf Kostenquoten. */
  | 'kosten-endkapital'
  /** Zwei Sparverläufe, die sich um einen Prozentpunkt unterscheiden. */
  | 'psychologie-verhaltensluecke'
  /** Mehr sparen gegen mehr Rendite, über vierzig Jahre. */
  | 'budget-hebel'
  /** Wie der Aktienanteil ohne Zutun über die geplante Quote steigt. */
  | 'portfolio-drift'
  /** Bis zu welchem Depotwert der Sparerpauschbetrag reicht. */
  | 'sparerpauschbetrag-grenze'
  /** Von der beworbenen Mietrendite zu dem, was übrig bleibt. */
  | 'immobilie-nettorendite'
  /** Die Bitcoin-Umlaufmenge nach dem Emissionsplan. */
  | 'bitcoin-angebot'
  /** Tiefe und Erholungsdauer der großen Kurseinbrüche. */
  | 'crashes-erholung'
  /** Warum das Fondsvermögen in keine Insolvenzmasse fällt. */
  | 'fonds-sondervermoegen'
  /** Dieselben Renditejahre in beiden Reihenfolgen, mit Entnahme. */
  | 'risiko-sequenz'
  /** Das Delta einer Kaufoption über dem Kurs des Basiswerts. */
  | 'option-delta'
  /** Tatsächliche Kursänderung gegen die Vorhersage der Duration. */
  | 'anleihe-konvexitaet'
  /** Jährlich versteuert gegen erst beim Verkauf versteuert. */
  | 'zinseszins-steuerstundung'
  /** Was von einer Nominalrendite nach Steuer und Inflation übrig bleibt. */
  | 'inflation-steuer'
  /** Wertänderung des Objekts, umgerechnet auf das Eigenkapital. */
  | 'immobilie-hebel'
  /** Warum ein Hebelprodukt nach Hin und Her zurückbleibt. */
  | 'derivat-pfadabhaengigkeit'
  /** Wie die Schwankung eines Depots mit der Zahl der Titel sinkt. */
  | 'streuung-titelzahl'
  /** Vier Entnahmeraten, gerechnet gegen beide Reihenfolgen. */
  | 'portfolio-entnahme'
  /** Steuerfreies Gold gegen ein Wertpapier auf denselben Preis. */
  | 'rohstoffe-gold-steuer'
  /** Die Rente je nach Zeitpunkt des Beginns. */
  | 'rente-rentenbeginn'
  /** Wie oft eine Timing-Strategie richtig liegen müsste. */
  | 'timing-trefferquote'
  /** Jahre bis zur Unabhängigkeit, allein nach der Sparquote. */
  | 'budget-sparquote-jahre'
  /** Schwankung einer Mischung über der Korrelation. */
  | 'risiko-korrelation'
  /** Dieselbe Option bei vier erwarteten Schwankungen. */
  | 'option-volatilitaet'
  /** Preis-, Netto- und Bruttoindex desselben Marktes über zwanzig Jahre. */
  | 'etf-index-fassungen'
  /** Beworbener Aktionszins gegen den, der übers Jahr ankommt. */
  | 'tagesgeld-aktionszins'
  /** Die Reihenfolge, in der eine Bank abgewickelt wird. */
  | 'einlagensicherung-kaskade'
  /** Was zwischen Geschäftsabschluss und Buchung im Depot passiert. */
  | 'boerse-abwicklung'
  /** Ein Haushalt, nach Größe der Ausgabenposten sortiert. */
  | 'budget-haushalt'
  /** Depot und Verrechnungskonto – zwei völlig verschiedene Rechtslagen. */
  | 'depot-und-konto'
  /** Die Bundeswertpapiere nach ihrer Laufzeit bei Ausgabe. */
  | 'staatsanleihe-laufzeiten'
  /** Warum eine geänderte alte Buchung die ganze Kette ungültig macht. */
  | 'blockchain-kette'
  /** Die drei Leitzinsen der EZB als Korridor. */
  | 'notenbank-zinskorridor'
  /** Wer in der Insolvenz in welcher Reihenfolge bedient wird. */
  | 'anleihe-rangfolge'
  /** Was vom Depot bleibt, je nach Aktienquote. */
  | 'portfolio-quote-rueckgang'
  /** Wie wenig nach dem Ende der Zinsbindung getilgt ist. */
  | 'immobilie-restschuld'
  /** Der eingefrorene Rentenfreibetrag gegen die steigende Rente. */
  | 'rente-freibetrag'
  /** Der Kreis aus Verkaufszwang, fallenden Preisen und Nachschusspflicht. */
  | 'crashes-spirale'
  /** Welcher Kostenblock in welchem Depot überwiegt. */
  | 'kosten-wahre-quote'
  /** Die Handelszeiten der drei Platzarten und die Stunden ohne Vergleichskurs. */
  | 'boerse-handelszeiten'
  /** Umfang der Sicherung gegen die Rechtsqualität des Anspruchs. */
  | 'einlagensicherung-anspruch'
  /** In welcher Reihenfolge der Freistellungsauftrag verteilt wird. */
  | 'sparerpauschbetrag-reihenfolge'
  /** Das Sicherheitskonto eines Futures bis zum Margin Call. */
  | 'derivat-margin'
  /** Was das Verteilen einer größeren Summe an Zeit am Markt kostet. */
  | 'sparplan-wartezeit'
  /** Zyklische und defensive Branchen im selben Konjunkturverlauf. */
  | 'branchen-zyklus'
  /** Was eine Währungsabsicherung über zehn Jahre kostet. */
  | 'waehrung-absicherung'
  /** Preisniveau und Teuerungsrate nach einem einmaligen Preissprung. */
  | 'inflation-basiseffekt'
  /** Verkaufsgründe, sortiert nach ihrer Herkunft. */
  | 'verkauf-gruende'
  /** Drei Zugangswege zu Krypto und das jeweils bleibende Risiko. */
  | 'krypto-zugangswege'
  /** Fünf Fragen an ein Basisinformationsblatt, nach Schärfe geordnet. */
  | 'einsteiger-pruefung'
  /** Täglicher Kurs gegen periodische Bewertung. */
  | 'fonds-bewertungsglaettung'
  /** Der Barwert derselben Zahlungsreihe über dem Kapitalkostensatz. */
  | 'aktie-barwert'
  /** Welche Bruttorendite eine Anlage braucht, um eine Tilgung zu schlagen. */
  | 'kredit-tilgen-oder-anlegen'
  /** Dieselbe Schuldenquote bei vier Zins-Wachstums-Differenzen. */
  | 'staatsschuld-dynamik'
  /** Endkapital bei gleichbleibender und bei wachsender Sparrate. */
  | 'sparplan-dynamisierung'
  /** Die drei Stufen der Informationseffizienz als ineinanderliegende Mengen. */
  | 'markt-effizienzstufen'
  /** Wer eine kostenlose Order bezahlt. */
  | 'broker-orderflow'
  /** Was in einem synthetischen Fonds liegt und wo das Risiko sitzt. */
  | 'etf-swap'
  /** Wohin die laufende Verwaltungsvergütung fließt. */
  | 'kosten-bestandsprovision'
  /** Die beiden Verlustverrechnungstöpfe und die Wand dazwischen. */
  | 'sparer-verlusttoepfe'
  /** Langer Aufbau, kurzer Absturz – Zwang gegen Zuversicht. */
  | 'psychologie-asymmetrie'
  /** Wie sich aus der Reihenfolge von Transaktionen Geld ziehen lässt. */
  | 'blockchain-reihenfolge'
  /** Die drei Bewertungsstufen eines Fonds nach Nachprüfbarkeit. */
  | 'fonds-bewertungsstufen'
  /** Die drei Wege vom Kurssturz in die Wirtschaft. */
  | 'crashes-ansteckung'
  /** Die Bezugsgrößen der Geldpolitik – zwei davon nicht messbar. */
  | 'notenbank-messgroessen'
  /** Vier Wege, Geld kurzfristig zu parken, nach Verfügbarkeit und Schutz. */
  | 'tagesgeld-parkplaetze'
  /** Die drei Paritätsbedingungen nach ihrem empirischen Rang. */
  | 'waehrung-paritaeten'
  /** Vier Kostenebenen, nach Sichtbarkeit statt nach Höhe geordnet. */
  | 'kosten-ebenen'
  /** Warum jede Bewertung eines Kryptowerts an derselben Stelle scheitert. */
  | 'krypto-bewertung'

  /* ------------------------------------------------ Lernbereich: Geldsystem */
  /** Zwei Bankbilanzen vor und nach einer Kreditvergabe. */
  | 'geldsystem-giralgeld'
  /** Wie lange einzelne Währungen tatsächlich im Umlauf waren. */
  | 'geldsystem-lebensdauer'
  /** Tagesumsatz am Devisenmarkt gegen den Welthandel eines Jahres. */
  | 'geldsystem-devisenmarkt'

export interface FigureMeta {
  /** Kurzer Titel – wird als `<title>` im SVG vorgelesen. */
  title: string
  /**
   * Was die Grafik zeigt, in einem Satz.
   *
   * Landet als `<desc>` im SVG und ersetzt die Grafik für alle, die sie nicht
   * sehen. Deshalb inhaltlich, nicht formal: „Die Kurve verdreifacht sich in
   * vierzig Jahren“ hilft, „Ein Liniendiagramm mit zwei Kurven“ nicht.
   *
   * Optional, weil viele Zeichnungen ihre Beschreibung selbst mitbringen: Wo
   * die Zahlen beim Bauen aus `lib/` entstehen, gehört die Beschreibung
   * dorthin, wo sie entstehen – sonst stünden hier Werte, die nach der
   * nächsten Änderung still danebenliegen. Fehlt beides, bricht der Build ab;
   * eine Grafik ohne Vorlesefassung darf es nicht geben.
   */
  description?: string
  /** Bildunterschrift unter der Grafik. */
  caption: string
}

export const figureMeta: Record<FigureId, FigureMeta> = {
  'zins-gerade-vs-kurve': {
    title: 'Einfacher Zins und Zinseszins im Vergleich',
    description:
      'Zwei Verläufe für 10.000 Euro bei 6 Prozent über 40 Jahre. Beim einfachen Zins wächst das Kapital als Gerade auf 34.000 Euro, weil die Erträge jedes Jahr entnommen werden. Bleiben sie liegen, wird daraus eine Kurve, die immer steiler wird und bei rund 103.000 Euro endet – dem Dreifachen.',
    caption:
      'Derselbe Zinssatz, derselbe Startbetrag. Der einzige Unterschied ist, ob die Erträge liegen bleiben.',
  },
  'zins-frueh-vs-spaet': {
    title: 'Startalter gegen Sparrate',
    description:
      'Drei Sparer zahlen bis 67 monatlich 200 Euro bei 6 Prozent ein. Wer mit 25 beginnt, zahlt rund das Doppelte ein wie jemand, der mit 45 beginnt, landet aber bei rund dem Vierfachen. Der dunkle Teil jedes Balkens ist das eingezahlte Geld, der helle sind die Erträge.',
    caption:
      'Die eingezahlten Beträge unterscheiden sich um den Faktor zwei, die Ergebnisse um den Faktor vier. Der Unterschied steckt vollständig in den Erträgen.',
  },
  'zins-kosten': {
    title: 'Wirkung laufender Kosten über 30 Jahre',
    description:
      'Vier Sparpläne über 200 Euro monatlich und 30 Jahre bei 6 Prozent Bruttorendite, belastet mit 0,2 bis 1,8 Prozent laufenden Kosten. Zwischen der günstigsten und der teuersten Variante liegen rund 50.000 Euro – etwa zwei Drittel aller Einzahlungen.',
    caption:
      'Der graue Teil jedes Balkens ist das, was die Kosten gegenüber einer Anlage ganz ohne Gebühren übrig gelassen hätten.',
  },
  'zins-volatilitaetsbremse': {
    title: 'Warum ein Durchschnitt von null Geld kostet',
    description:
      'Aus 100 Euro werden nach einem Plus von 50 Prozent 150 Euro und nach einem anschließenden Minus von 50 Prozent 75 Euro. Der Durchschnitt der beiden Jahresrenditen ist null, das Ergebnis ist ein Verlust von einem Viertel.',
    caption:
      'Plus 50 und minus 50 Prozent heben sich nicht auf: Das Minus wirkt auf den größeren Betrag.',
  },
  'aktie-anteil': {
    title: 'Was eine Aktie ist',
    description:
      'Ein Quadrat aus hundert gleichen Feldern steht für das ganze Unternehmen; jedes Feld ist ein Prozent. Fünf Felder sind hervorgehoben – so viel gehört jemandem, dem fünf Prozent der Aktien gehören: fünf Prozent der Fabriken, der Marken, der Patente, der Schulden und der künftigen Gewinne.',
    caption:
      'Wer Aktien kauft, kauft Anteile am Unternehmen – nicht ein Papier, dessen Preis grundlos schwankt.',
  },
  'aktie-dividendenabschlag': {
    title: 'Der Kursabschlag am Ausschüttungstag',
    description:
      'Vor der Ausschüttung steht die Aktie bei 50 Euro. Werden 2 Euro Dividende gezahlt, verlässt dieses Geld das Unternehmen: Der Kurs fällt rechnerisch auf 48 Euro, auf dem Konto liegen 2 Euro. Zusammen sind es wieder 50 Euro.',
    caption:
      'Eine Dividende ist kein zusätzliches Geld, sondern eine Umschichtung aus dem Unternehmenswert auf dein Konto.',
  },
  'aktie-spread': {
    title: 'Geldkurs, Briefkurs und die Spanne dazwischen',
    description:
      'Auf einer Preisachse liegt der Geldkurs bei 49,90 Euro – so viel bekommst du beim Verkauf. Der Briefkurs liegt bei 50,10 Euro – so viel zahlst du beim Kauf. Die Spanne von 20 Cent ist der Spread; wer sofort wieder verkaufte, wäre um diesen Betrag im Minus.',
    caption:
      'Es gibt nie einen einzigen Kurs. Zwischen Kauf und Verkauf liegt immer eine Spanne – sie ist der erste Kostenblock jeder Order.',
  },
  'rohstoffe-kein-ertrag': {
    title: 'Rohstoffe zahlen nichts',
    description:
      'Eine Aktie zahlt Dividende, eine Anleihe Zinsen, eine vermietete Wohnung Miete. Bei allen dreien entsteht Ertrag, ohne dass jemand kaufen muss. Ein Rohstoff zahlt nichts: Sein gesamter Ertrag muss aus einem höheren Preis kommen, den ein anderer bereit ist zu zahlen.',
    caption:
      'Der Unterschied ist kein Detail, sondern der Grund, warum sich ein Rohstoff nicht wie eine Aktie bewerten lässt.',
  },
  'rohstoffe-rollkurve': {
    title: 'Contango und Backwardation',
    description:
      'Zwei Terminkurven. Im Contango kosten spätere Liefermonate mehr als frühere: Beim Weiterrollen wird jedes Mal teurer nachgekauft, das kostet Rendite. In der Backwardation kosten spätere Monate weniger, dann bringt das Rollen einen Gewinn.',
    caption:
      'Deshalb kann der Rohstoffpreis steigen und das Produkt darauf trotzdem verlieren.',
  },
  'msci-world-laender': {
    title: 'Ländergewichtung des MSCI World',
    description:
      'Balken für die Länderanteile im MSCI World. Die USA stellen mit Abstand den größten Teil, danach folgen Japan, Großbritannien, Kanada und Frankreich mit jeweils wenigen Prozent; der Rest verteilt sich auf die übrigen Industrieländer. Die genauen Werte trägt die Grafik selbst nach, weil sie aus einem datierten Datensatz stammen.',
    caption:
      'Nach Börsenwert gewichtet heißt: Das Gewicht folgt dem Marktwert, nicht der Zahl der Länder.',
  },
  'inflation-kaufkraft': {
    title: 'Kontostand und Kaufkraft im Vergleich',
    description:
      'Ein fester Betrag bleibt 30 Jahre unverzinst liegen. Die Zahl auf dem Konto ändert sich nie – die gestrichelte Linie verläuft waagerecht. Was diese Zahl kaufen kann, fällt stetig; nach 30 Jahren ist gut die Hälfte verschwunden, ohne dass etwas abgebucht wurde.',
    caption:
      'Der Abstand zwischen beiden Linien ist der Verlust. Er steht auf keinem Kontoauszug.',
  },

  /*
    Ab hier tragen die Zeichnungen ihre Beschreibung selbst.

    Ihre Zahlen entstehen beim Bauen aus `lib/` – aus denselben Funktionen wie
    die Tabellen daneben. Eine hier hinterlegte Beschreibung müsste diese
    Zahlen wiederholen und wäre nach der ersten Änderung an einer Annahme
    still falsch, ohne dass es jemandem auffiele: Sie ist nur für die
    sichtbar, die die Grafik gerade nicht sehen können.
  */
  'anleihe-kurs-und-zins': {
    title: 'Anleihekurs und Marktzins',
    caption:
      'Der Kupon ist fest, der Kurs ist es nicht. Er stellt sich so ein, dass die Anleihe genau den Marktzins abwirft – und je länger sie läuft, desto weiter muss er dafür ausschlagen.',
  },
  'staatsanleihe-zinsschock': {
    title: 'Kursverlust bei steigendem Zins',
    caption:
      '„Sicher“ heißt bei einer Staatsanleihe: Der Staat zahlt zurück. Es heißt nicht, dass der Kurs bis dahin ruhig bleibt – wer vorher verkaufen muss, trägt diesen Verlust.',
  },
  'option-auszahlung': {
    title: 'Ergebnis von Kauf- und Verkaufoption bei Verfall',
    caption:
      'Der Knick ist der Basispreis, der waagerechte Teil die bezahlte Prämie. Nach unten ist der Verlust des Käufers begrenzt – für den Verkäufer der Option gilt genau das Gegenteil.',
  },
  'option-zeitwertverfall': {
    title: 'Wie die Prämie mit der Restlaufzeit schrumpft',
    caption:
      'Zeit ist bei Optionen ein Preisbestandteil, und sie läuft immer in dieselbe Richtung. Am Ende geht es am schnellsten.',
  },
  'kredit-zins-und-tilgung': {
    title: 'Zins und Tilgung innerhalb derselben Rate',
    caption:
      'Die Rate bleibt gleich – deshalb sind alle Säulen gleich hoch. Nur was darin steckt, verschiebt sich: erst fast alles Zins, am Ende fast alles Tilgung.',
  },
  'kredit-anfangstilgung': {
    title: 'Anfangstilgung und Laufzeit',
    caption:
      'Ein Prozentpunkt mehr Anfangstilgung kostet etwas mehr im Monat und spart Jahrzehnte. Das ist die folgenreichste Zahl im ganzen Kreditvertrag.',
  },
  'risiko-erholung': {
    title: 'Welcher Gewinn einen Verlust ausgleicht',
    caption:
      'Verlust und Erholung sind nicht symmetrisch. Deshalb ist es wichtiger, große Verluste zu vermeiden, als große Gewinne zu treffen.',
  },
  'timing-beste-wochen': {
    title: 'Rendite ohne die besten Wochen',
    caption:
      'Die guten Wochen sind wenige und lassen sich nicht ankündigen. Wer sie mitnehmen will, muss die schlechten aushalten – dazwischen liegen oft nur Tage.',
  },
  'rente-luecke': {
    title: 'Heutiges Einkommen und gesetzliche Rente',
    caption:
      'Auf der Renteninformation steht der obere Rand der zweiten Säule. Auf dem Konto landet der untere Abschnitt – die Lücke dazwischen ist kein Betriebsunfall, sondern die Bauart des Systems.',
  },
  'boerse-vom-klick-zur-buchung': {
    title: 'Der Weg einer Order',
    caption:
      'Die ersten drei Schritte dauern Sekundenbruchteile, die letzten beiden Tage. Deshalb steht nach einem Kauf sofort ein Kurs im Depot, aber noch nicht das Papier.',
  },
  'blockchain-zahlung': {
    title: 'Eine Zahlung im Blockchain-Netz',
    caption:
      'Anders als bei einer Überweisung gibt es keinen Moment, in dem eine Zahlung „durch“ ist. Sie wird mit jedem weiteren Block nur schwerer rückgängig zu machen.',
  },
  'notenbank-transmission': {
    title: 'Vom Leitzins zu den Preisen',
    caption:
      'Die Notenbank setzt nur den ersten Kasten. Alles danach entscheiden Banken, Unternehmen und Haushalte – und jede Übergabe kostet Monate.',
  },
  'einsteiger-reihenfolge': {
    title: 'Was vor dem ersten Kauf kommt',
    caption:
      'Jeder Schritt vor dem letzten bringt sicher etwas. Der letzte bringt vermutlich mehr – aber nur, wenn die vier davor stehen.',
  },
  'markt-orderbuch': {
    title: 'Kauf- und Verkaufseite eines Orderbuchs',
    caption:
      'Es gibt nie „den Kurs“. Es gibt zwei Seiten, eine Lücke dazwischen und für jede Stückzahl einen anderen Preis.',
  },
  'tagesgeld-realzins': {
    title: 'Zins und Inflation nebeneinander',
    caption:
      'Auf dem Kontoauszug steht nur die linke Säule. Die rechte steht nirgends – und entscheidet trotzdem, ob das Geld mehr oder weniger wert wird.',
  },
  'sparplan-durchschnittspreis': {
    title: 'Was eine gleichbleibende Rate kauft',
    caption:
      'Nicht der Sparplan ist klug, sondern die feste Rate: Sie kauft automatisch mehr, wenn es billig ist, und weniger, wenn es teuer ist.',
  },
  'waehrung-ergebnis': {
    title: 'Dasselbe Geschäft, vier Wechselkurse',
    caption:
      'Bei einer Anlage in fremder Währung wettet man immer auf zwei Dinge zugleich. Der Wechselkurs kann das eine vollständig auffressen.',
  },
  'derivat-hebel': {
    title: 'Sicherheitsleistung, Hebel und Totalverlust',
    caption:
      'Der Hebel ist der Kehrwert der Sicherheitsleistung. Der Preis dafür steht rechts: die Kursbewegung, nach der nichts mehr da ist.',
  },
  'einlagensicherung-grenze': {
    title: 'Was die Einlagensicherung deckt',
    caption:
      'Die Grenze gilt je Kunde und Bank, nicht je Konto. Zwei Konten bei derselben Bank werden zusammengezählt, zwei Banken verdoppeln den Schutz.',
  },
  'depot-orderkosten': {
    title: 'Ordergebühr und Spread nach Ordergröße',
    caption:
      'Der Kostenblock, der auf der Abrechnung steht, ist bei größeren Orders der kleinere. Der andere lässt sich durch Handelsplatz und Uhrzeit beeinflussen.',
  },
  'kosten-endkapital': {
    title: 'Endkapital bei fünf Kostenquoten',
    caption:
      'Der graue Sockel ist bei allen gleich – das eingezahlte Geld. Die Kosten zehren ausschließlich am Ertrag darüber, und zwar jedes Jahr erneut.',
  },
  'psychologie-verhaltensluecke': {
    title: 'Was ein Prozentpunkt im Jahr ausmacht',
    caption:
      'Zwanzig Jahre lang liegen die beiden Linien fast aufeinander. Genau deshalb merkt man die Verhaltenslücke nicht, während sie entsteht.',
  },
  'budget-hebel': {
    title: 'Mehr sparen oder mehr Rendite',
    caption:
      'Die Frage hat keine Antwort ohne Zeitangabe. Die Rate wirkt sofort und liegt in der eigenen Hand; die Rendite überholt sie erst später – und ist nicht bestellbar.',
  },
  'portfolio-drift': {
    title: 'Wie die Aufteilung von allein wandert',
    caption:
      'Niemand hat etwas entschieden, und trotzdem trägt das Depot mehr Risiko als geplant. Rebalancing ist die Antwort darauf – kein Renditewerkzeug.',
  },
  'sparerpauschbetrag-grenze': {
    title: 'Bis zu welchem Depotwert der Freibetrag reicht',
    caption:
      'Nicht die Depotgröße entscheidet, sondern wie viel laufender Ertrag anfällt. Zwei gleich große Depots können völlig unterschiedlich besteuert werden.',
  },
  'immobilie-nettorendite': {
    title: 'Von der beworbenen Mietrendite zur tatsächlichen',
    caption:
      'Beworben wird die linke Säule. Übrig bleibt der untere Abschnitt der rechten – und der Kredit ist darin noch nicht einmal enthalten.',
  },
  'bitcoin-angebot': {
    title: 'Die Umlaufmenge nach dem Emissionsplan',
    caption:
      'Die Knappheit ist kein Versprechen, sondern eine Regel im Programmcode. Was sie über den Preis aussagt, ist eine andere Frage.',
  },
  'crashes-erholung': {
    title: 'Tiefe und Dauer der großen Einbrüche',
    caption:
      'Die Balken sind nach der Tiefe sortiert – ihre Länge folgt dieser Reihenfolge nicht. Wie lange eine Erholung dauert, entscheidet sich nach dem Einbruch.',
  },
  'fonds-sondervermoegen': {
    title: 'Warum das Fondsvermögen geschützt ist',
    description:
      'Zwei getrennte Kästen. Links die Fondsgesellschaft: Sie verwaltet, entscheidet über Käufe und Verkäufe und kassiert die Verwaltungsgebühr. Wird sie insolvent, fällt in die Masse, was ihr gehört – Büros, Verträge, Forderungen. Rechts das Fondsvermögen: die Aktien und Anleihen selbst, verwahrt bei einer unabhängigen Depotbank. Es gehört den Anlegern und fällt in keine Insolvenzmasse, weder in die der Gesellschaft noch in die der Depotbank. Wovor die Trennung nicht schützt: Fallen die enthaltenen Aktien um 40 Prozent, fällt der eigene Anteil um 40 Prozent.',
    caption:
      'Die Trennung schützt vor der Pleite des Anbieters, nicht vor dem Markt. Beides wird regelmäßig verwechselt.',
  },
  'risiko-sequenz': {
    title: 'Dieselben Renditen, zwei Reihenfolgen',
    caption:
      'Ohne Entnahme wären beide Linien am Ende deckungsgleich. Mit Entnahme entscheidet die Reihenfolge – und sie ist niemand zu wählen gegeben.',
  },
  'option-delta': {
    title: 'Das Delta über dem Kurs des Basiswerts',
    caption:
      'Wie stark eine Option reagiert, hängt davon ab, wo der Basiswert steht. Kurz vor Verfall wird aus dem Übergang eine Stufe – das ist das Gamma.',
  },
  'anleihe-konvexitaet': {
    title: 'Näherung über die Duration gegen die exakte Rechnung',
    caption:
      'Die Gerade ist die Faustformel, die Kurve die Wirklichkeit. Der Abstand dazwischen fällt immer zugunsten des Anleihebesitzers aus.',
  },
  'zinseszins-steuerstundung': {
    title: 'Was Steuerstundung über dreißig Jahre wert ist',
    caption:
      'Derselbe Steuersatz, dasselbe Produkt. Der Unterschied entsteht allein daraus, dass der noch nicht abgeführte Betrag bis zum Verkauf mitarbeitet.',
  },
  'inflation-steuer': {
    title: 'Steuer auf Gewinne, die keine sind',
    caption:
      'Besteuert wird der nominale Ertrag – auch der Teil, der nur die Geldentwertung ausgleicht. Ein Zins, der die Inflation gerade deckt, ist real ein Verlust.',
  },
  'immobilie-hebel': {
    title: 'Der Hebel in beide Richtungen',
    caption:
      'Nach oben wird diese Rechnung in jedem Beratungsgespräch vorgeführt. Es ist dieselbe Rechnung wie nach unten – nur mit anderem Vorzeichen.',
  },
  'derivat-pfadabhaengigkeit': {
    title: 'Zwei Tage Hin und Her',
    caption:
      'Der Basiswert steht wieder bei hundert, die Produkte darauf nicht. Das Vielfache wird täglich neu angesetzt – und arbeitet ab dem zweiten Tag auf einer anderen Basis.',
  },
  'streuung-titelzahl': {
    title: 'Wie viele Titel Streuung braucht',
    caption:
      'Zwischen einem und zwanzig Titeln liegt fast der ganze Gewinn. Was danach bleibt, ist das Risiko des Marktes selbst – und dagegen hilft keine Zahl von Titeln.',
  },
  'portfolio-entnahme': {
    title: 'Vier Entnahmeraten, zwei Reihenfolgen',
    caption:
      'Eine Entnahmerate ist keine Zahl, sondern eine Zahl mit einer Spanne. Und die Spanne wächst mit der Rate.',
  },
  'rohstoffe-gold-steuer': {
    title: 'Physisches Gold und die Haltefrist',
    caption:
      'Bei gleicher Bruttorendite trennt die Steuer gut ein Viertel des Gewinns. Dem stehen Kosten gegenüber, die ein Wertpapier nicht hat.',
  },
  'rente-rentenbeginn': {
    title: 'Rentenbeginn und was er dauerhaft ausmacht',
    caption:
      'Der Abschlag endet nicht mit dem Regelalter. Er gilt lebenslang – und wirkt auch auf spätere Rentenerhöhungen und auf die Hinterbliebenenrente.',
  },
  'timing-trefferquote': {
    title: 'Wie oft es sitzen müsste',
    caption:
      'Ohne Kosten genügt die Hälfte, also der Münzwurf. Jeder Prozentpunkt an Kosten hebt die Schwelle darüber – und das ist erst die Frage nach dem Aufwand, nicht die nach der Prognosefähigkeit.',
  },
  'budget-sparquote-jahre': {
    title: 'Sparquote und die Zahl der Jahre',
    caption:
      'Das Einkommen kommt in dieser Rechnung nicht vor – es kürzt sich heraus. Entscheidend ist der Abstand zwischen Einnehmen und Ausgeben, nicht die Höhe.',
  },
  'risiko-korrelation': {
    title: 'Korrelation und die Schwankung der Mischung',
    caption:
      'Die erwartete Rendite bleibt der Durchschnitt, gleich wie die beiden zusammenhängen – die Schwankung nicht. Das ist der Hebel, für den niemand bezahlt.',
  },
  'option-volatilitaet': {
    title: 'Dieselbe Option, vier Erwartungen',
    caption:
      'Am Kurs hat sich nichts geändert. Die erwartete Schwankung ist der einzige Preisbestandteil, den man nicht ablesen kann – und deshalb der, über den man eine Meinung hat.',
  },
  'etf-index-fassungen': {
    title: 'Derselbe Index in drei Fassungen',
    caption:
      'Welcher Maßstab in einem Werbeblatt steht, entscheidet über das Urteil, bevor über den Fonds selbst gesprochen wird. Üblich und richtig ist der Nettoindex.',
  },
  'tagesgeld-aktionszins': {
    title: 'Beworben und tatsächlich',
    caption:
      'Beworben wird die erste Säule, gutgeschrieben die dritte. Wer die Frist im Kalender hat, bekommt den Aktionszins wirklich – in der Praxis wechseln viele nicht rechtzeitig, und dann ergibt sich die Mischrate.',
  },
  'einlagensicherung-kaskade': {
    title: 'Die Haftungskaskade',
    caption:
      'Wer ganz unten steht, ist nicht ein bisschen sicherer – er ist durch alles darüber geschützt. Die Kästen zeigen die Reihenfolge, nicht die Beträge.',
  },
  'boerse-abwicklung': {
    title: 'Zwischen Abschluss und Depot',
    caption:
      'Aus einem Geschäft werden rechtlich zwei, und die Gegenpartei steht in beiden. Deshalb trifft der Ausfall einer Seite nie die andere.',
  },
  'budget-haushalt': {
    title: 'Wohin das Geld geht',
    caption:
      'Die Reihenfolge ist die Aussage. Zehn Prozent beim größten Posten bringen mehr als der vollständige Verzicht auf die beiden kleinsten.',
  },
  'depot-und-konto': {
    title: 'Depot und Verrechnungskonto',
    description:
      'Zwei Kästen nebeneinander. Links das Depot: Die Wertpapiere gehören dir, die Bank verwahrt sie nur und führt sie getrennt von ihrem eigenen Vermögen. Bei einer Pleite fallen sie nicht in die Insolvenzmasse; du kannst Herausgabe verlangen oder das Depot übertragen. Rechts das Verrechnungskonto: Das Guthaben gehört der Bank, sie schuldet es dir – ein Anspruch, kein Eigentum. Genau deshalb greift hier die Einlagensicherung, und nur hier. Sie schützt also das, was du nicht besitzt, und wird ausgerechnet für das gesucht, was dir ohnehin gehört.',
    caption:
      'Die Einlagensicherung schützt das Konto, nicht das Depot. Das klingt nach einer Lücke und ist das Gegenteil: Was dir gehört, braucht keine Sicherung.',
  },
  'staatsanleihe-laufzeiten': {
    title: 'Bundeswertpapiere nach Laufzeit',
    caption:
      'Die Namen sagen nichts über die Sicherheit – dahinter steht überall derselbe Schuldner. Sie sagen etwas darüber, wie stark der Kurs auf Zinsänderungen reagiert.',
  },
  'blockchain-kette': {
    title: 'Warum sich eine alte Buchung nicht ändern lässt',
    description:
      'Zwei Ketten aus je drei Blöcken untereinander. Jeder Block trägt zwei Felder: die Prüfsumme, die er von seinem Vorgänger übernommen hat, und die Prüfsumme über seinen eigenen Inhalt. Oben die unveränderte Kette – die übernommene Prüfsumme stimmt jeweils mit der des Vorgängers überein, die Glieder passen zusammen. Unten dieselbe Kette, nachdem jemand eine Buchung im ersten Block geändert hat. Mit dem Inhalt ändert sich dessen Prüfsumme, aus A wird A′. Block 2 trägt aber weiterhin A, und damit ist die erste Verbindung gebrochen. Sie ist die einzige: Block 2 und 3 sind unverändert und passen weiter zueinander – gerade darin liegt der Aufwand für den Fälscher. Um den Bruch zu schließen, muss er Block 2 neu bilden, wodurch sich dessen Prüfsumme ändert und die nächste Verbindung bricht, dann Block 3, und so fort bis zum Ende der Kette. Und das gegen alle anderen Teilnehmer, die die richtige Kette haben. Nicht Verschlüsselung schützt hier, sondern die Verkettung.',
    caption:
      'Nicht ein einzelner Block ist geschützt, sondern die Reihenfolge. Eine geänderte Buchung macht alles danach ungültig – und zwar sichtbar.',
  },
  'notenbank-zinskorridor': {
    title: 'Die drei Leitzinsen als Korridor',
    description:
      'Die drei Leitzinsen der EZB übereinander als Korridor. Ganz oben der Spitzenrefinanzierungssatz: der Notfallkredit über Nacht und damit die Obergrenze – wer ihn zahlt, hat keine günstigere Quelle mehr. In der Mitte der Hauptrefinanzierungssatz, zu dem sich Banken wöchentlich Geld leihen. Ganz unten der Einlagesatz: was Banken bekommen, wenn sie Geld über Nacht bei der EZB parken. Er ist die Untergrenze, denn niemand verleiht Geld für weniger, als die Notenbank ohne jedes Risiko zahlt. Zwischen diesen beiden Linien bewegt sich der Geldmarktzins, und er liegt dicht über der unteren – deshalb hängt an ihr auch das Tagesgeld. Ist in Meldungen von „dem Leitzins“ die Rede, ist im Euroraum meist dieser untere Satz gemeint. Die Abstände sind nicht maßstäblich; sie ändern sich mit jedem Beschluss. Fest steht nur die Reihenfolge.',
    caption:
      'Von den drei Sätzen ist der unterste der wichtigste: Er ist die Untergrenze des Geldmarkts – und damit die Grenze, an der dein Tagesgeldzins hängt.',
  },
  'anleihe-rangfolge': {
    title: 'Wer in der Insolvenz zuerst bedient wird',
    description:
      'Fünf Stufen untereinander, von oben nach unten in der Reihenfolge der Bedienung. Erstens die Sicherheiten: Wer eine Sache als Pfand hat – eine Maschine, eine Immobilie –, verwertet sie und ist damit außen vor. Zweitens die Kosten des Verfahrens, Löhne und laufende Verbindlichkeiten. Drittens die einfachen Gläubiger; hier steht eine gewöhnliche Schuldverschreibung, und hier wird verteilt, was übrig ist. Viertens die nachrangigen Gläubiger, die erst an der Reihe sind, wenn die dritte Stufe vollständig bedient wurde – was selten vorkommt. Fünftens die Aktionäre, denen zusteht, was danach bleibt: meist nichts. Die Stufen werden nach unten schmaler, weil auf jeder weniger ankommt. „Vor den Aktionären“ heißt deshalb nicht „an erster Stelle“ – es heißt nur: nicht ganz zuletzt.',
    caption:
      'Vor dem Anleihegläubiger stehen zwei Stufen, hinter ihm zwei. Das ist der ganze Unterschied zur Aktie – und er ist kleiner, als „vorrangig“ klingt.',
  },
  'portfolio-quote-rueckgang': {
    title: 'Was die Aktienquote im Ernstfall bedeutet',
    caption:
      'Fünf Depots mit demselben Startwert. Was sie unterscheidet, ist keine Produktwahl, sondern eine einzige Zahl – und im Rückgang entscheidet sie alles.',
  },
  'immobilie-restschuld': {
    title: 'Was nach der Zinsbindung offen bleibt',
    caption:
      'Zehn Jahre zahlen fühlt sich nach der Hälfte an. Getilgt ist knapp ein Fünftel – der Rest wird zu Konditionen weiterfinanziert, die heute niemand kennt.',
  },
  'rente-freibetrag': {
    title: 'Der Freibetrag wächst nicht mit',
    caption:
      'Der steuerfreie Betrag wird einmal in Euro festgeschrieben. Jede spätere Rentenerhöhung ist voll steuerpflichtig – die Steuerlast steigt, ohne dass sich ein Gesetz ändert.',
  },
  'crashes-spirale': {
    title: 'Die Liquiditätsspirale',
    description:
      'Vier Stationen in einem geschlossenen Kreis, im Uhrzeigersinn. Erstens Verkäufe: Wer auf Kredit gekauft hat und nicht nachschießen kann, verkauft – nicht weil er will, sondern weil er muss. Zweitens fallen die Preise, weil viele Verkäufe auf einmal auf wenige Käufer treffen. Drittens schrumpfen dadurch die Sicherheiten: Was als Pfand hinterlegt ist, ist plötzlich weniger wert. Viertens fordert die Bank Nachschuss oder stellt die Position glatt – und damit ist der Kreis wieder bei den erzwungenen Verkäufen. Es gibt keinen letzten Kasten; die vierte Station ist die Ursache der ersten. Das ist der Grund, warum ein Einbruch schneller abläuft als der Anstieg davor: Ein erheblicher Teil der Verkäufe ist nicht entschieden, sondern erzwungen. Wer ohne Kredit gekauft hat, steht in diesem Kreis nicht drin. Zahlen stehen bewusst nicht daran – wie schnell sich der Kreis dreht, hängt daran, wie viel im Markt auf Kredit gekauft wurde.',
    caption:
      'Kein Ablauf, sondern ein Kreis: Die letzte Station ist die Ursache der ersten. Deshalb hört ein Crash nicht auf, wenn die Meinungen drehen.',
  },
  'kosten-wahre-quote': {
    title: 'Welcher Kostenblock überwiegt',
    caption:
      'Dieselben drei Kostenarten, zwei Depots, umgekehrte Rangfolge. Deshalb hat die Frage nach dem günstigeren Anbieter keine allgemeine Antwort.',
  },
  'boerse-handelszeiten': {
    title: 'Wann welcher Handelsplatz offen hat',
    caption:
      'Die Öffnungszeiten stehen in der Tabelle. Was erst übereinandergelegt sichtbar wird, sind die Stunden, in denen kein Vergleichskurs existiert.',
  },
  'einlagensicherung-anspruch': {
    title: 'Umfang gegen Rechtsanspruch',
    description:
      'Die drei Sicherungssysteme gegeneinander aufgetragen: waagerecht, wie weit die Zusage reicht, senkrecht, wie belastbar sie rechtlich ist. Die gesetzliche Einlagensicherung steht links oben – sie reicht nur bis zur gesetzlichen Grenze, ist dafür ein einklagbarer Anspruch, den jede Bank in der EU erfüllen muss. Der freiwillige Sicherungsfonds steht rechts unten – er reicht weit darüber hinaus, leistet aber nach seiner Satzung, und die kann er ändern; deutsche Fonds haben ihre Grenzen mehrfach abgesenkt. Die Institutssicherung liegt dazwischen und verfolgt einen anderen Ansatz: Sie stützt das Institut, damit ein Entschädigungsfall gar nicht erst eintritt. Die Anordnung zeigt den Zusammenhang, den die Tabelle nebeneinanderstellt: Je weiter die Zusage reicht, desto schwächer ist sie unterlegt. Das entwertet die freiwilligen Systeme nicht – sie haben in der Praxis zuverlässig gezahlt. Es heißt nur, dass man sich auf eine Zusage anderer Qualität verlässt. Beträge über der gesetzlichen Grenze stehen bewusst nicht daran: Wie weit ein Fonds reicht, hängt am Eigenkapital der einzelnen Bank.',
    caption:
      'Je weiter die Zusage reicht, desto schwächer ist sie rechtlich unterlegt. Beides zu wissen ist die ganze Aussage dieses Themas.',
  },
  'sparerpauschbetrag-reihenfolge': {
    title: 'Die Reihenfolge der Verteilung',
    caption:
      'Vorn steht, was ohne dein Zutun belastet wird, hinten, worüber du selbst entscheidest. Das Gefälle ist die Begründung für die Reihenfolge.',
  },
  'derivat-margin': {
    title: 'Der Margin Call',
    caption:
      'Die Position wird geschlossen, obwohl die Einschätzung dahinter am Ende zutrifft. Das ist der Unterschied zwischen einem Verlust- und einem Liquiditätsrisiko.',
  },
  'sparplan-wartezeit': {
    title: 'Was Wartezeit kostet',
    caption:
      'Gerechnet ohne jede Kursschwankung – deshalb ist der Rückstand kein Pech, sondern Arithmetik. Was das Verteilen dafür kauft, steht im Text daneben.',
  },
  'waehrung-absicherung': {
    title: 'Was die Absicherung kostet',
    caption:
      'Der Wechselkurs kommt in dieser Rechnung nicht vor – und das ist der Punkt. Die Absicherung kostet die Zinsdifferenz, wohin der Kurs auch läuft.',
  },
  'inflation-basiseffekt': {
    title: 'Der Basiseffekt',
    caption:
      'Die Rate fällt auf null, ohne dass ein einziger Preis gesunken wäre. „Die Inflation geht zurück“ und „es wird wieder billiger“ sind zwei verschiedene Aussagen.',
  },
  'verkauf-gruende': {
    title: 'Woher der Grund kommt',
    caption:
      'Die Herkunft ist das Erkennungsmerkmal: Was aus dem eigenen Plan stammt, trägt einen Verkauf. Was aus dem Markt kommt, steht bereits im Kurs.',
  },
  'krypto-zugangswege': {
    title: 'Drei Wege, drei Risiken',
    caption:
      'Das Risiko verschwindet auf keinem der drei Wege – es wechselt nur die Stelle. Die Frage ist, welches man lieber trägt.',
  },
  'einsteiger-pruefung': {
    title: 'Fünf Fragen an ein Produkt',
    caption:
      'Die Reihenfolge ist der eigentliche Rat: Die ersten beiden Fragen sortieren die meisten Produkte aus, und wer sie zuerst stellt, spart sich die übrigen drei.',
  },
  'aktie-barwert': {
    title: 'Warum eine Bewertung keine Zahl ist',
    caption:
      'Die Kurve steigt zum unteren Ende nicht, sie läuft davon. Ein halber Prozentpunkt an einer Stelle, die niemand kennt, verschiebt den Wert zweistellig.',
  },
  'kredit-tilgen-oder-anlegen': {
    title: 'Was die Anlage bringen müsste',
    caption:
      'Der ersparte Kreditzins ist steuerfrei, der Anlageertrag nicht. Wer beide Prozentzahlen nebeneinanderlegt, vergleicht netto mit brutto.',
  },
  'staatsschuld-dynamik': {
    title: 'Nicht die Höhe, die Richtung',
    caption:
      'Vier Wege aus derselben Startquote, alle bei ausgeglichenem Haushalt. Was sie trennt, ist eine einzige Differenz – und über die stimmt niemand ab.',
  },
  'sparplan-dynamisierung': {
    title: 'Wenn die Rate mitwächst',
    caption:
      'Der Unterschied entsteht nicht durch Rendite, sondern durch Einzahlung. Deshalb ist die Dynamisierung die einzige wirksame Stellschraube, die keine Prognose braucht.',
  },
  'broker-orderflow': {
    title: 'Wer die kostenlose Order bezahlt',
    description:
      'Der Weg einer gebührenfreien Order und der Weg des Geldes zurück. Oben drei Kästen nebeneinander: Du erteilst eine Order und zahlst dafür keine Gebühr. Der Broker leitet sie an einen bestimmten Handelsplatz weiter. Der Handelsplatz führt sie aus. Darunter der Rückweg: Der Handelsplatz zahlt dem Broker eine Vergütung für die Weiterleitung – das ist Payment for Order Flow. Bezahlt wird diese Vergütung aus dem Spread, also aus dem Kurs, zu dem deine Order ausgeführt wird. Das Geld, das der Broker nicht von dir nimmt, kommt damit über einen Umweg doch von dir. Das ist kein Vorwurf, sondern ein Geschäftsmodell, und es ist nicht automatisch nachteilig: Bei kleinen Orders ist die gesparte Gebühr oft mehr wert als ein etwas besserer Ausführungskurs. Bei großen kehrt sich das um – ein Zehntelprozent auf 50.000 Euro sind 50 Euro, und dann wären fünf Euro Ordergebühr am Referenzmarkt das bessere Geschäft. Die Gegenprobe ist immer dieselbe: erzielter Kurs gegen Referenzkurs zur selben Sekunde, plus alle Gebühren.',
    caption:
      'Das Geld, das der Broker nicht von dir nimmt, kommt über den Spread doch von dir. Kein Vorwurf – nur der Grund, „kostenlos“ nachzurechnen.',
  },
  'etf-swap': {
    title: 'Was in einem Swap-ETF liegt',
    description:
      'Der Aufbau eines synthetischen ETF in zwei Kästen. Links der Fonds: Er hält ein Trägerportfolio aus liquiden Wertpapieren – nicht die Werte des abgebildeten Index. Dieses Portfolio ist Sondervermögen wie bei jedem Fonds. Rechts der Swap-Partner, eine Bank: Er liefert dem Fonds die Wertentwicklung des Index und bekommt dafür die Wertentwicklung des Trägerportfolios. Zwei Pfeile zwischen den Kästen zeigen diesen Tausch in beide Richtungen. Darunter der entscheidende Satz: Das Risiko sitzt zwischen den beiden Kästen. Fällt der Swap-Partner aus, fehlt die zugesagte Indexrendite – das Trägerportfolio bleibt, es bildet aber etwas anderes ab. Die OGAW-Richtlinie begrenzt dieses Ausfallrisiko gegenüber einer einzelnen Gegenpartei auf zehn Prozent des Fondsvermögens; in der Praxis liegt es deutlich darunter, weil der Swap täglich oder bei Erreichen einer Schwelle zurückgesetzt und durch Sicherheiten unterlegt wird. Entscheidend ist deren Qualität: Ein mit Staatsanleihen bester Bonität besicherter Swap ist etwas anderes als einer, der mit Aktien zweiter Reihe unterlegt ist. Die Zusammensetzung steht im Jahresbericht.',
    caption:
      'Ein synthetischer Fonds hält nicht nichts – er hält etwas anderes. Das Risiko sitzt nicht im Kasten, sondern zwischen den beiden.',
  },
  'kosten-bestandsprovision': {
    title: 'Wohin die Vergütung fließt',
    description:
      'Der Weg der laufenden Fondskosten in drei Stationen. Dein Depot zahlt die laufende Verwaltungsvergütung – nicht als Rechnung, sondern täglich anteilig aus dem Fondsvermögen. Sie geht an die Fondsgesellschaft, die den Fonds verwaltet. Von dort fließt ein Teil zurück an die Bank oder den Vermittler, über den der Fonds verkauft wurde: die Bestandsprovision. Sie wird jährlich gezahlt, solange der Fonds im Depot liegt, und beträgt oft die Hälfte der Verwaltungsvergütung. Daraus folgt, warum eine Empfehlung erwartbar ist: Ein Berater, der davon lebt, verdient an einem Fonds mit 1,5 Prozent laufenden Kosten jährlich und an einem Indexfonds mit 0,15 Prozent praktisch nichts. Das macht ihn nicht unehrlich – beides zu wissen ist besser, als eines davon zu unterstellen. Seit MiFID II muss offengelegt werden, was tatsächlich geflossen ist; die Angabe steht in der jährlichen Kosteninformation, meist auf der letzten Seite. Die Alternative ist die Honorarberatung: sichtbar teurer, in der Summe häufig günstiger.',
    caption:
      'Die Beratung ist wörtlich kostenlos und wirtschaftlich nicht. Bezahlt wird sie jedes Jahr, aus dem Fondsvermögen, ohne dass es auf einer Rechnung steht.',
  },
  'psychologie-asymmetrie': {
    title: 'Zwang und Zuversicht',
    description:
      'Eine schematische Kurve über einen vollständigen Zyklus: ein langer, sich beschleunigender Aufbau und ein kurzer, steiler Absturz. Etwa drei Viertel der Zeitachse entfallen auf den Anstieg, ein Viertel auf den Einbruch. Die Erklärung steht unter den beiden Abschnitten: Steigende Kurse erzeugen Berichterstattung, Berichterstattung erzeugt Zuflüsse, Zuflüsse erzeugen steigende Kurse – dieser Kreis braucht Zeit. Fallende Kurse dagegen zwingen fremdfinanzierte Marktteilnehmer zu Verkäufen, und diese Verkäufe drücken die Kurse weiter. Ein Margin Call kennt keine Bedenkzeit. Deshalb sind Einbrüche schneller als Anstiege: Zwang wirkt sofort, Zuversicht braucht Zeit. An den Achsen stehen bewusst keine Zahlen – wie lange ein Aufbau dauert und wie tief ein Einbruch geht, ist von Fall zu Fall verschieden. Das Verhältnis der beiden Zeiträume ist es nicht.',
    caption:
      'Zwang wirkt sofort, Zuversicht braucht Zeit. Das ist der ganze Grund, warum Einbrüche schneller ablaufen als die Anstiege davor.',
  },
  'blockchain-reihenfolge': {
    title: 'Die Reihenfolge ist Geld wert',
    caption:
      'Bezahlt hat es der, dessen Auftrag sichtbar war, bevor er ausgeführt wurde. Verletzt wurde dabei keine Regel – und genau das ist der Punkt.',
  },
  'fonds-bewertungsstufen': {
    title: 'Wie sicher der Preis ist',
    caption:
      'Für eine DAX-Aktie gibt es einen Kurs. Für ein Papier, das zuletzt vor drei Wochen gehandelt wurde, wird bewertet statt abgelesen – und auf der untersten Stufe entscheidet, wer die Annahmen setzt.',
  },
  'crashes-ansteckung': {
    title: 'Kurssturz oder Krise',
    caption:
      'Drei Wege führen vom Markt in die Wirtschaft, und nur einer führt zu sich selbst zurück. Ist dieser Kreis geschlossen, entscheidet nur noch die Reaktion.',
  },
  'notenbank-messgroessen': {
    title: 'Navigation mit unsicherer Position',
    caption:
      'Zwei der drei Größen, aus denen sich der angemessene Zins ergeben soll, kann niemand messen. Notenbanken sagen das inzwischen selbst.',
  },
  'tagesgeld-parkplaetze': {
    title: 'Vier Parkplätze',
    caption:
      'Der Ertragsunterschied beträgt Bruchteile eines Prozentpunkts. Der Unterschied zwischen „am Tag X verfügbar“ und „nicht verfügbar“ kann teuer werden.',
  },
  'waehrung-paritaeten': {
    title: 'Drei Bedingungen, drei Ränge',
    caption:
      'Eine gilt immer, weil sie eine Arbitragebedingung ist. Eine gilt als langfristige Tendenz. Und eine gilt systematisch nicht – daraus lebt der Carry-Trade.',
  },
  'kosten-ebenen': {
    title: 'Vier Ebenen, nach Sichtbarkeit',
    caption:
      'Die Reihenfolge ist die der Sichtbarkeit, nicht die der Höhe. Wer nur auf die Ordergebühr schaut, betrachtet den kleinsten Betrag mit dem größten Aufhebens.',
  },
  'krypto-bewertung': {
    title: 'Ein Preis ohne Anker',
    caption:
      'Das Verfahren ist hier nicht ungenau, sondern nicht anwendbar. Das macht die Anlage nicht illegitim – es macht „fair bewertet“ gegenstandslos.',
  },
  'sparer-verlusttoepfe': {
    title: 'Zwei Töpfe, keine Verbindung',
    description:
      'Die beiden Verlustverrechnungstöpfe nebeneinander, getrennt durch eine durchgezogene Wand. Links der Aktienverlusttopf: Er enthält Verluste aus dem Verkauf einzelner Aktien und lässt sich ausschließlich gegen Gewinne aus dem Verkauf einzelner Aktien verrechnen – nicht gegen Dividenden und nicht gegen Fondsgewinne. Rechts der allgemeine Topf: Er enthält Verluste aus Fonds, ETFs, Anleihen und Zertifikaten und ist gegen alle übrigen Kapitalerträge verrechenbar, einschließlich Zinsen und Dividenden. Zwischen beiden gibt es keinen Übergang. Praktisch heißt das: Wer mit Einzelaktien Verluste macht und mit ETFs Gewinne, kann beides nicht gegeneinander stellen – der Aktienverlust bleibt liegen, der ETF-Gewinn wird versteuert. Vorgetragen wird der Aktienverlust unbegrenzt, aber immer topfgebunden. Wer nie wieder Einzelaktien mit Gewinn verkauft, nutzt ihn nie. Das ist die folgenreichste Einzelheit des deutschen Kapitalertragsteuerrechts und wird regelmäßig zu spät bemerkt.',
    caption:
      'Die Wand ist die Aussage. Ein Aktienverlust gleicht einen Fondsgewinn nicht aus – und das merken die meisten erst in der Abrechnung.',
  },
  'markt-effizienzstufen': {
    title: 'Drei Stufen, ineinander',
    description:
      'Die drei Stufen der Informationseffizienz als ineinanderliegende Rahmen. Innen die schwache Stufe: Aus vergangenen Kursen lässt sich nichts über künftige ableiten – weitgehend bestätigt, die dokumentierten Ausnahmen sind klein und nach Kosten meist verschwunden. Darum die halbstarke Stufe: Zusätzlich stecken alle öffentlich verfügbaren Informationen bereits im Kurs – überwiegend bestätigt, die Einpreisung erfolgt in Sekunden, nicht in Tagen. Ganz außen die strenge Stufe: Auch nicht öffentliche Informationen steckten im Kurs – klar widerlegt, sonst wäre Insiderhandel nicht einträglich und müsste nicht verfolgt werden. Die Verschachtelung ist die Aussage: Jede stärkere Stufe schließt die schwächere ein, denn wer behauptet, alle öffentlichen Informationen steckten im Kurs, behauptet damit auch, die vergangenen Kurse täten es. Dass die äußerste Stufe widerlegt ist, sagt deshalb nichts über die inneren beiden – ein Schluss, der in der Debatte über Markteffizienz regelmäßig gezogen wird und nicht trägt.',
    caption:
      'Jede stärkere Stufe schließt die schwächere ein. Dass die äußerste widerlegt ist, sagt deshalb nichts über die inneren beiden.',
  },
  'fonds-bewertungsglaettung': {
    title: 'Ruhiger Kurs, gleicher Wert',
    description:
      'Zwei Linien über denselben Verlauf. Die dünne graue Linie zeigt den Wert, wie er sich tatsächlich bewegt – laufend, mit allen Ausschlägen. Die kräftige Stufenlinie zeigt denselben Verlauf so, wie ihn eine Bewertung durch Gutachter erzeugt: Sie misst zu wenigen Stichtagen und schreibt den gemessenen Wert bis zur nächsten Messung fort. Das Ergebnis sieht deutlich ruhiger aus, obwohl es dieselbe Sache abbildet. Genau das passiert bei offenen Immobilienfonds: Ihr Preis schwankt kaum, weil Immobilien nicht täglich gehandelt, sondern periodisch bewertet werden. Das ist keine Stabilität der Anlage, sondern eine Eigenschaft des Messverfahrens. Wer einen solchen Fonds mit Tagesgeld vergleicht, weil der Kurs so ruhig aussieht, vergleicht eine Eigenschaft der Anlage mit einer Eigenschaft der Messung. Der Verlauf ist schematisch und behauptet keine Immobilienpreise – was er zeigt, gilt für jeden Verlauf.',
    caption:
      'Die ruhige Linie ist nicht ruhiger, sie ist seltener gemessen. Bei offenen Immobilienfonds ist das der ganze Unterschied.',
  },
  'branchen-zyklus': {
    title: 'Zyklisch und defensiv',
    description:
      'Zwei schematische Kurven über einen vollständigen Konjunkturzyklus, beide um dieselbe Mittellinie. Die zyklische Kurve schlägt weit aus: Im Aufschwung liegt sie deutlich oben, im Abschwung deutlich unten. Dazu gehören Automobil, Maschinenbau, Chemie, Banken und Luxusgüter – Branchen, deren Gewinne stark mit der Konjunktur schwanken. Die defensive Kurve folgt demselben Verlauf mit kleinem Ausschlag: Nahrungsmittel, Versorger, Gesundheit und Telekommunikation werden auch in einer Krise gebraucht, bleiben dafür in starken Aufschwüngen zurück. Beide Kurven enden auf derselben Höhe, weil die Aussage der Schwankung gilt und nicht der Rendite. An den Achsen stehen bewusst keine Zahlen: Wie stark eine Branche schwankt, hängt am Zyklus, am Land und am Zeitraum. Weil beide derselben Konjunktur folgen, ist eine Branchenwette fast immer eine Wette auf den Zeitpunkt der Wende – und der ist so wenig vorhersagbar wie alles andere am Markt.',
    caption:
      'Beide folgen derselben Konjunktur, nur mit verschiedenem Ausschlag. Wer auf eine Branche setzt, wettet deshalb meist auf einen Zeitpunkt.',
  },
  'ta-kerze-aufbau': {
    title: 'Was eine Kerze zeigt',
    description:
      'Zwei Kerzen nebeneinander, beschriftet. Die linke ist hell und steht für eine Periode mit steigendem Kurs: Der Körper reicht von der Eröffnung unten bis zum Schluss oben, die dünnen Dochte darüber und darunter reichen bis zum Hoch und zum Tief. Die rechte ist dunkel und steht für eine fallende Periode – dort liegt die Eröffnung oben und der Schluss unten, der Körper ist derselbe Kasten, nur die Bedeutung seiner Kanten hat sich vertauscht. Die Aussage steckt im Verhältnis: Ein langer Körper heißt, dass sich eine Seite von Anfang bis Ende durchgesetzt hat. Ein kurzer Körper mit langen Dochten heißt, dass in beide Richtungen gezogen wurde und am Ende fast nichts übrig blieb.',
    caption:
      'Vier Kurse in einem Zeichen: Eröffnung, Hoch, Tief, Schluss. Die Farbe sagt nur, welche der beiden Körperkanten die Eröffnung war.',
  },
  'ta-trendstruktur': {
    title: 'Woran ein Trend endet',
    description:
      'Ein schematischer Kursverlauf im Aufwärtstrend, in dem die Hoch- und Tiefpunkte markiert und nummeriert sind. Drei aufeinanderfolgende Hochs liegen jeweils höher als das vorige, ebenso die Tiefs dazwischen – das ist die Definition eines Aufwärtstrends. Eine Gerade durch die Tiefpunkte bildet die Trendlinie. Im rechten Teil bricht die Struktur: Das vierte Hoch bleibt unter dem dritten, und das darauffolgende Tief unterschreitet erstmals das vorherige Tief. Erst dieser zweite Schritt beendet den Trend, nicht schon der erste. Die Grafik zeigt damit, warum ein einzelner Kursrückgang keinen Trendbruch bedeutet: Solange ein Rücksetzer über dem letzten Tief endet, ist er eine Korrektur innerhalb des Trends.',
    caption:
      'Ein Aufwärtstrend endet nicht, wenn der Kurs fällt, sondern wenn ein Tief unter das vorige rutscht.',
  },
  'ta-unterstuetzung-widerstand': {
    title: 'Der Rollentausch einer Marke',
    description:
      'Ein waagerechtes Band liegt über den gesamten Chart. Links läuft der Kurs dreimal von unten an dieses Band heran und dreht jedes Mal wieder nach unten ab – das Band wirkt als Widerstand. In der Mitte bricht der Kurs darüber hinaus. Rechts fällt er zurück bis auf dasselbe Band und dreht dort nach oben – dieselbe Marke wirkt jetzt als Unterstützung. Das Band ist bewusst als Zone gezeichnet und nicht als Strich: Anleger haben nicht alle zum selben Kurs gekauft, sondern in einem Bereich darum herum. Die Erklärung für den Rollentausch steckt im Verhalten: Vor dem Ausbruch warten dort die Verkäufer, die zu diesem Kurs eingestiegen waren; nach dem Ausbruch sind es die Käufer, die dort zugegriffen haben.',
    caption:
      'Ein gebrochener Widerstand wird häufig zur Unterstützung. Der Grund liegt nicht im Chart, sondern bei den Anlegern, die dort ihren Einstand haben.',
  },
  'ta-sma-vs-ema': {
    title: 'Wie stark ein Durchschnitt nachläuft',
    description:
      'Ein schematischer Kursverlauf mit einem Anstieg, einem scharfen Einbruch und einer Erholung. Darüber liegen zwei geglättete Linien über dieselbe Periode: der einfache Durchschnitt, der alle Kurse gleich gewichtet, und der exponentielle, der neuere Kurse stärker gewichtet. Beide folgen dem Kurs mit Verzögerung, aber unterschiedlich stark: Am Einbruch dreht die exponentielle Linie früher nach unten und liegt danach näher am Kurs, während die einfache Linie länger oben bleibt und flacher verläuft. Der Preis für die schnellere Reaktion ist Unruhe – die exponentielle Linie folgt auch kleinen Bewegungen, die keine Bedeutung haben. Die Verzögerung beider Linien ist kein Fehler der Rechnung, sondern ihr Zweck: Wer glätten will, muss Vergangenheit mitnehmen.',
    caption:
      'Beide laufen dem Kurs hinterher. Der exponentielle Durchschnitt reagiert früher – und meldet dafür häufiger etwas, das keine Bewegung war.',
  },
  'ta-macd': {
    title: 'Der MACD unter dem Kurs',
    description:
      'Zwei übereinanderliegende Darstellungen desselben Zeitraums. Oben ein schematischer Kursverlauf mit Anstieg, Gipfel und Rückgang. Unten der daraus abgeleitete MACD: die MACD-Linie als Differenz zweier exponentieller Durchschnitte, die geglättete Signallinie und das Histogramm als Balken um die Nulllinie, das den Abstand zwischen beiden Linien zeigt. Zwei Stellen sind markiert: Wo die MACD-Linie die Signallinie von unten kreuzt, wechseln die Balken von negativ auf positiv – das ist das übliche Signal. Am Gipfel ist zu sehen, dass die Balken bereits schrumpfen, während der Kurs noch steigt: Die Bewegung verliert an Beschleunigung, bevor sie die Richtung wechselt. Genau darin liegt der Nutzen und zugleich die Schwäche des Indikators – dieselbe Beobachtung tritt auch auf, wenn der Kurs anschließend weitersteigt.',
    caption:
      'Der MACD misst die Beschleunigung, nicht die Richtung. Das Histogramm dreht vor den Linien – manchmal zu Recht, oft zu früh.',
  },
  'ta-elliott-extension': {
    title: 'Die gestreckte Impulswelle',
    description:
      'Drei schematische Impulsverläufe nebeneinander, jeder aus fünf Wellen. Im ersten ist Welle 3 die weitaus längste und steilste, im zweiten Welle 5, im dritten Welle 1. Die jeweils gestreckte Welle ist farblich hervorgehoben. In jedem Fall bleiben die beiden übrigen Impulswellen einander in der Länge ähnlich. Die Theorie erwartet, dass genau eine der drei Impulswellen gestreckt ist – am häufigsten die dritte. Welche es ist, lässt sich zuverlässig erst im Nachhinein sagen, und genau darin liegt die Schwierigkeit für jede Prognose.',
    caption:
      'Eine der drei Impulswellen ist gestreckt, meist die dritte. Welche, steht erst hinterher fest.',
  },
  'ta-elliott-verkuerzung': {
    title: 'Die verkürzte fünfte Welle',
    description:
      'Ein Impulsverlauf aus fünf Wellen. Vom Hoch der Welle 3 verläuft eine waagerechte gestrichelte Linie nach rechts. Welle 5 steigt zwar über das Tief der Welle 4 hinaus, bleibt aber unterhalb dieser Linie – sie überbietet das Hoch der dritten Welle nicht. Ein senkrechter Strich markiert den fehlenden Abstand. Diese Form ist zulässig und selten; sie gilt als Hinweis auf ungewöhnliche Schwäche im Trend. Der Impuls gilt trotzdem als vollständig abgeschlossen, und die anschließende Korrektur wird üblicherweise als kräftig erwartet.',
    caption:
      'Welle 5 erreicht das Hoch der Welle 3 nicht. Zulässig, selten – und ein Zeichen von Schwäche.',
  },
  'ta-elliott-diagonale': {
    title: 'Führende und endende Diagonale',
    description:
      'Zwei keilförmige Verläufe nebeneinander, beide aus fünf Wellen, deren Begrenzungslinien gestrichelt eingezeichnet sind. Links die führende Diagonale, die in Welle 1 oder in Welle A auftritt; rechts die endende Diagonale, die am Schluss einer Bewegung in Welle 5 oder in Welle C steht. Beide verengen sich zum Ende hin. In beiden Formen sind die Teilwellen dreiteilig statt fünfteilig, und in der endenden Diagonale darf Welle 4 in den Kursbereich von Welle 1 hineinreichen – die einzige Stelle, an der die sonst harte dritte Regel ausgesetzt ist.',
    caption:
      'Der Keil ist die einzige Impulsform, in der sich Welle 1 und Welle 4 überschneiden dürfen.',
  },
  'ta-elliott-zigzag': {
    title: 'Der Zickzack',
    description:
      'Eine dreiteilige Abwärtskorrektur mit den Punkten A, B und C. Von einem Hoch fällt Welle A steil, Welle B holt einen Teil davon zurück, Welle C fällt darunter deutlich weiter. An den drei Abschnitten stehen die Zahlen fünf, drei und fünf: Der Zickzack ist im Aufbau 5-3-5, also sind A und C selbst fünfteilig und B dreiteilig. Eine gestrichelte Linie auf Höhe des Ausgangspunkts zeigt, wie weit die Korrektur insgesamt trägt. Welle B holt üblicherweise nicht mehr als 61,8 Prozent von A zurück; läuft sie weiter, ist es meist keine Zickzack-Formation.',
    caption:
      'Die scharfe Korrekturform: 5-3-5, und C läuft klar unter A. Die häufigste Gestalt der Welle 2.',
  },
  'ta-elliott-flat': {
    title: 'Die drei Flat-Formen',
    description:
      'Drei seitwärts verlaufende Korrekturen nebeneinander, jeweils mit den Punkten A, B und C und einer gestrichelten Linie auf Höhe des Startpunkts. Bei der normalen Flat endet Welle B ungefähr am Startpunkt und Welle C ungefähr auf Höhe von A. Bei der erweiterten Flat läuft Welle B über den Startpunkt hinaus und Welle C unter das Tief von A. Bei der laufenden Flat läuft Welle B ebenfalls darüber hinaus, Welle C endet aber oberhalb des Tiefs von A – die Korrektur bleibt in Trendrichtung zurück. Alle drei haben denselben Aufbau 3-3-5.',
    caption:
      'Alle drei sind 3-3-5. Unterschieden werden sie allein daran, wo B und C relativ zum Startpunkt enden.',
  },
  'ta-elliott-dreieck': {
    title: 'Die Dreiecksformen',
    description:
      'Drei Dreiecksformationen nebeneinander, jeweils mit gestrichelten Begrenzungslinien. Links das kontrahierende Dreieck, bei dem obere und untere Begrenzung aufeinander zulaufen. In der Mitte das Barrier-Dreieck, bei dem eine der beiden Begrenzungen waagerecht bleibt. Rechts das expandierende Dreieck, bei dem die Schwankungsbreite zunimmt statt abzunehmen; es ist die seltenste Form. Jedes Dreieck besteht aus fünf Abschnitten A bis E, und jeder dieser Abschnitte ist selbst dreiteilig. Dreiecke stehen fast ausschließlich in Welle 4 oder in Welle B, also unmittelbar vor der letzten Bewegung einer Sequenz.',
    caption:
      'Fünf Abschnitte, jeder dreiteilig. Ein Dreieck steht fast immer direkt vor dem letzten Zug.',
  },
  'ta-elliott-kombination': {
    title: 'Doppelte und dreifache Korrektur',
    description:
      'Zwei zusammengesetzte Korrekturverläufe. Links die doppelte Korrektur mit den Punkten W, X und Y: Zwei einzelne Korrekturmuster – hier ein Zickzack und eine Flat – sind durch die Verbindungswelle X aneinandergehängt. Rechts die dreifache Korrektur mit W, X, Y, X und Z: drei Korrekturmuster, verbunden durch zwei X-Wellen. Mehr als drei Bestandteile sieht die Theorie nicht vor. Beide Formen verlaufen flacher und deutlich länger als eine einzelne Korrektur und sind der Hauptgrund, warum sich fast jede ausgedehnte Seitwärtsphase regelkonform auszählen lässt.',
    caption:
      'W-X-Y und W-X-Y-X-Z hängen fertige Korrekturen aneinander. Damit wird fast jede Seitwärtsphase zählbar.',
  },
  'ta-elliott-ziele': {
    title: 'Welche Welle welches Verhältnis anläuft',
    description:
      'Ein Impulsverlauf aus fünf Wellen, bei dem an jeder Welle das ihr zugeordnete Fibonacci-Verhältnis steht. Welle 1 dient als Maßstab und hat selbst kein Verhältnis. Welle 2 holt üblicherweise 50, 61,8 oder 78,6 Prozent der Welle 1 zurück. Welle 3 erreicht das 1,618-fache oder 2,618-fache der Welle 1. Welle 4 korrigiert flacher, meist 23,6 oder 38,2 Prozent der Welle 3. Welle 5 entspricht häufig dem 0,618-fachen der Strecke von Beginn Welle 1 bis Ende Welle 3 oder ungefähr der Länge der Welle 1. Diese Werte sind die in der Literatur üblichen Erwartungswerte, keine gemessenen Häufigkeiten.',
    caption:
      'Jede Welle hat ihre eigenen Erwartungswerte. Ein Verhältnis ohne die zugehörige Welle ist keine Aussage.',
  },
  'ta-elliott-wechsel': {
    title: 'Der Wechsel zwischen den Korrekturen',
    description:
      'Ein Impulsverlauf aus fünf Wellen, in dem die beiden Korrekturwellen farblich hinterlegt sind. Welle 2 ist ein kurzer, steiler Rücksetzer und schmal markiert. Welle 4 verläuft dagegen flach und über einen längeren Zeitraum und ist entsprechend breit markiert. Die Theorie erwartet diesen Wechsel: Ist die eine Korrektur ein scharfer Zickzack, wird die andere meist eine Flat oder ein Dreieck. Es handelt sich um eine Erwartung und nicht um eine der drei harten Regeln – eine Zählung, die sie verletzt, ist damit nicht ungültig.',
    caption:
      'Scharf und flach wechseln sich ab. Die einzige Aussage der Theorie, die eine Zählung im Voraus einschränkt.',
  },
  'ta-elliott-grade': {
    title: 'Die Wellengrade',
    description:
      'Ein großer Impulsverlauf aus fünf Wellen, in dem zwei Ausschnitte eine Ebene tiefer aufgelöst sind. Innerhalb der ersten Welle ist gestrichelt ein Rahmen gezogen, in dem derselbe fünfteilige Aufbau noch einmal im Kleinen erscheint. Die zweite Welle ist daneben in ihre drei Bestandteile zerlegt. Damit zeigt die Grafik den fraktalen Aufbau der Theorie: Jede Impulswelle besteht selbst aus fünf Wellen, jede Korrekturwelle aus dreien, und dasselbe wiederholt sich auf jeder Zeitebene. Elliott unterschied neun solcher Grade, vom Grand Supercycle über Jahrhunderte bis zur Subminuette über Minuten.',
    caption:
      'Dieselbe Form auf jeder Zeitebene – neun Grade vom Jahrhundert bis zur Minute.',
  },
  'ta-elliott-ruecklaeufe': {
    title: 'Wie tief welche Korrekturwelle zurückläuft',
    description:
      'Vier waagerechte Skalen untereinander, je eine für Welle 2, Welle 4, Welle B im Zickzack und Welle B in der Flat. Auf jeder Skala sind die gebräuchlichen Rücklaufmarken eingetragen: 23,6, 38,2, 50, 61,8, 78,6, 90 und 100 Prozent der jeweils vorigen Welle. Kräftig hervorgehoben ist der Wert, den die Wellenliteratur als Regelfall nennt, etwas schwächer die ebenfalls gebräuchlichen. Bei Welle 2 ist das 61,8 Prozent, daneben 50 und 78,6. Bei Welle 4 ist es 38,2 Prozent, daneben 23,6 und 50 – Welle 4 korrigiert also regelmäßig flacher als Welle 2. Bei Welle B im Zickzack liegt der Schwerpunkt bei 50 Prozent, in der Flat dagegen bei 100 Prozent, weil die Flat gerade dadurch definiert ist. Die Darstellung zeigt eine Rangfolge, keine gemessene Häufigkeit: Eine Auszählung mit Stichprobe und Methode liefert die Literatur nicht.',
    caption:
      'Welle 2 korrigiert tief, Welle 4 flach – das ist die verlässlichste Aussage der Reihe. Es ist eine Rangfolge, keine gemessene Wahrscheinlichkeit.',
  },
  'ta-elliott-streckungen': {
    title: 'Wie weit welche Impulswelle läuft',
    description:
      'Drei waagerechte Skalen untereinander für Welle 3, Welle 5 und Welle C. Eingetragen sind die gebräuchlichen Vielfachen 0,618, 1,0, 1,618, 2,618 und 4,236. Kräftig hervorgehoben ist jeweils der Regelfall der Wellenliteratur. Welle 3 erreicht danach üblicherweise das 1,618-fache der Welle 1, bei starken Bewegungen das 2,618- oder 4,236-fache. Welle 5 wird meist mit dem 0,618-fachen der Strecke von Beginn Welle 1 bis Ende Welle 3 angesetzt, seltener mit dem Einfachen. Welle C entspricht am häufigsten der Länge von Welle A, daneben dem 1,618-fachen. Auch hier ist eine Rangfolge dargestellt und keine gemessene Häufigkeit.',
    caption:
      'Welle 3 ist die einzige, für die regelmäßig ein Vielfaches über eins erwartet wird. Welle 5 bleibt meist darunter.',
  },
  'ta-elliott-umkehrbereiche': {
    title: 'Wo jede Welle dreht',
    description:
      'Ein Impulsverlauf aus fünf Wellen, über den vier waagerechte Bänder gelegt sind. Jedes Band markiert den Bereich, in dem die zugehörige Welle laut Wellenliteratur endet und die Richtung wechselt. Das Band für Welle 2 reicht von 50 bis 78,6 Prozent der Welle 1. Das Band für Welle 3 liegt zwischen dem 1,618-fachen und dem 2,618-fachen der Welle 1, gemessen ab dem Tief der Welle 2. Für Welle 4 liegt es bei 23,6 bis 38,2 Prozent der Welle 3 und damit deutlich flacher als bei Welle 2. Für Welle 5 reicht es vom 0,618-fachen der Strecke zwischen Beginn Welle 1 und Ende Welle 3 bis ungefähr zur Länge der Welle 1. Die Bänder sind bewusst breit: Zwischen 50 und 78,6 Prozent liegen bei einer Bewegung von hundert Punkten fast dreißig Punkte. Eine Welle endet in einem Bereich, nicht auf einem Punkt.',
    caption:
      'Jede Welle dreht in ihrem eigenen Bereich – und der ist breit. Wer auf den Punkt plant, plant genauer, als die Methode hergibt.',
  },
  'ta-elliott-umkehr-weitere': {
    title: 'Umkehrbereiche in den Sonderformen',
    description:
      'Drei schematische Formationen nebeneinander. Links ein kontrahierendes Dreieck mit den Abschnitten A bis E; jeder Abschnitt misst ungefähr das 0,618-fache des vorigen, weshalb sich die Form zum Ende hin verengt. In der Mitte eine doppelte Korrektur mit W, X und Y: Die Verbindungswelle X läuft 50 bis 78,6 Prozent der Welle W zurück, die zweite Korrektur Y entspricht dem 0,618- bis 1,618-fachen von W und am häufigsten ungefähr deren Länge. Rechts eine endende Diagonale mit ihren gestrichelten Begrenzungslinien; hier laufen die Wellen 2 und 4 mit 66 bis 81 Prozent deutlich tiefer zurück als im gewöhnlichen Impuls. Die Grafik macht damit den Grundsatz sichtbar, dass die Verhältnisse je Formation gelten und nicht je Wellennummer: Wer die Werte aus der Impulstabelle auf eine Diagonale überträgt, misst mit dem falschen Maßstab.',
    caption:
      'Die Verhältnisse hängen an der Formation, nicht an der Nummer. Eine Welle 2 in der Diagonale dreht tiefer als eine Welle 2 im Impuls.',
  },
  'pt-diversifikation': {
    title: 'Wie weit Streuung das Risiko senkt',
    description:
      'Eine fallende Kurve über einem Achsenkreuz. Waagerecht steht die Zahl der Titel im Depot, senkrecht die Schwankung. Bei wenigen Titeln ist die Schwankung hoch; mit jedem weiteren Titel fällt sie zunächst deutlich, dann immer flacher. Ab etwa zwanzig bis dreißig Titeln verläuft die Kurve nahezu waagerecht – jeder weitere Titel bringt kaum noch eine Verbesserung. Eine gestrichelte Linie darunter markiert das Marktrisiko: den Anteil, der sich durch Streuung nicht beseitigen lässt, weil er alle Titel gemeinsam betrifft. Die Kurve nähert sich dieser Linie an, erreicht die Nulllinie aber nie.',
    caption:
      'Streuung senkt das Risiko einzelner Titel, nicht das des Marktes. Nach etwa dreißig Titeln ist der Nutzen ausgereizt.',
  },
  'pt-effizienzlinie': {
    title: 'Die Effizienzlinie',
    description:
      'Ein Achsenkreuz mit dem Risiko waagerecht und der erwarteten Rendite senkrecht. Eine getönte Fläche zeigt alle möglichen Mischungen aus den verfügbaren Anlagen. Ihre obere Begrenzung ist die Effizienzlinie: Für jedes Risiko gibt es dort die höchstmögliche Rendite. Drei Punkte sind markiert. Punkt A liegt am linken Ende und hat das geringste Risiko. Punkt C liegt auf der Linie. Punkt B liegt darunter, bei gleichem Risiko wie C, aber mit geringerer Rendite – eine solche Mischung ist ineffizient, weil man ohne zusätzliches Risiko mehr bekommen könnte. Die Aussage gilt nur unter den Annahmen des Modells, insbesondere dass sich Risiko durch Schwankung messen lässt und die Verhältnisse stabil bleiben.',
    caption:
      'Alles unterhalb der Linie ist Verschwendung: dasselbe Risiko, weniger Ertrag. Ob die Linie stabil bleibt, ist die offene Frage.',
  },
  'pt-korrelation': {
    title: 'Gleichlauf, Unabhängigkeit, Gegenlauf',
    description:
      'Drei kleine Diagramme nebeneinander, in jedem zwei Kursverläufe übereinandergelegt – einer durchgezogen, einer gestrichelt. Links laufen beide Linien nahezu deckungsgleich: Korrelation nahe plus eins. In der Mitte bewegen sie sich ohne erkennbaren Zusammenhang: Korrelation nahe null. Rechts spiegeln sie einander, jeder Anstieg der einen fällt mit einem Rückgang der anderen zusammen: Korrelation nahe minus eins. Nur die beiden rechten Fälle senken das Risiko einer Mischung. Zwei Anlagen, die gleichlaufen, streuen nichts, auch wenn es formal zwei Positionen sind.',
    caption:
      'Zwei Positionen sind noch keine Streuung. Entscheidend ist, ob sie sich gemeinsam bewegen.',
  },
  'pt-maximaler-rueckgang': {
    title: 'Der maximale Rückgang',
    description:
      'Ein schwankender Depotverlauf über die Zeit. Das höchste Zwischenhoch ist markiert, ebenso der tiefste Punkt, der danach erreicht wird. Zwischen beiden ist der senkrechte Abstand als Pfeil eingezeichnet und als maximaler Rückgang beschriftet. Zwei waagerechte Hilfslinien verlängern Hoch und Tief nach rechts, damit der Abstand ablesbar wird. Wichtig ist die Reihenfolge: Gemessen wird vom Hoch zum tiefsten Punkt, der zeitlich danach liegt – nicht zum tiefsten Punkt des gesamten Zeitraums. Ein früheres, tieferes Tief zählt nicht, weil man dort noch nicht investiert gewesen sein muss.',
    caption:
      'Vom Hoch zum tiefsten Punkt danach. Die Kennzahl beschreibt, was man ausgehalten hätte – nicht, was man verloren hat.',
  },
  'pt-sequenzrisiko': {
    title: 'Dieselben Renditen, andere Reihenfolge',
    description:
      'Zwei Depotverläufe über dieselbe Zahl von Jahren, beide mit derselben Durchschnittsrendite. Der obere Verlauf hat die guten Jahre am Anfang und steigt trotz laufender Entnahmen deutlich an. Der untere Verlauf hat dieselben Jahre in umgekehrter Reihenfolge, mit den schlechten zuerst; er fällt zunächst und erholt sich danach nur teilweise. Am Ende liegen beide Verläufe weit auseinander. Der Grund ist die Entnahme: Wer in einem schlechten Jahr einen festen Betrag entnimmt, verkauft dafür mehr Anteile, und diese Anteile fehlen bei der späteren Erholung dauerhaft.',
    caption:
      'Gleiche Durchschnittsrendite, verschiedenes Ergebnis. Wer entnimmt, für den zählt die Reihenfolge der Jahre.',
  },
  'ma-zinsstruktur': {
    title: 'Die drei Gestalten der Zinsstrukturkurve',
    description:
      'Drei kleine Diagramme nebeneinander. In jedem steht waagerecht die Laufzeit von kurz nach lang und senkrecht der Zins. Links die normale Kurve: Sie steigt von links nach rechts an, längere Laufzeiten bringen mehr Zins. In der Mitte die flache Kurve, bei der sich kurze und lange Laufzeiten kaum unterscheiden. Rechts die inverse Kurve, die von links nach rechts fällt – kurze Laufzeiten zahlen mehr als lange. Die inverse Form gilt als der meistbeachtete Vorlaufindikator für eine Rezession, weil sie in der Vergangenheit mehreren Abschwüngen vorausging. Ein Beleg für Ursächlichkeit ist das nicht.',
    caption:
      'Fällt die Kurve von links nach rechts, ist sie invers. Das gilt als Warnzeichen – mit langem und unregelmäßigem Vorlauf.',
  },
  'ma-konjunkturzyklus': {
    title: 'Der Konjunkturzyklus',
    description:
      'Eine Wellenlinie, die um eine waagerechte Trendlinie schwingt. Vier senkrechte Hilfslinien teilen sie in Phasen: Aufschwung mit anziehendem Wachstum, Hochphase mit Auslastung am Anschlag, Abschwung mit abkühlendem Wachstum und Tiefphase mit Bodenbildung. Danach beginnt der Zyklus von vorn. Die Darstellung ist regelmäßig gezeichnet, tatsächliche Zyklen sind es nicht: Sie unterscheiden sich in Dauer und Ausschlag erheblich. Vor allem lässt sich die aktuelle Phase erst im Rückblick sicher bestimmen – wo man gerade steht, ist die eigentliche Frage und immer strittig.',
    caption:
      'Vier Phasen, im Rückblick sauber abgrenzbar. Die Frage, wo man gerade steht, beantwortet die Grafik nicht.',
  },
  'av-wertfunktion': {
    title: 'Die Wertfunktion der Prospect Theory',
    description:
      'Ein Achsenkreuz, dessen Ursprung den Bezugspunkt darstellt. Nach rechts sind Gewinne aufgetragen, nach links Verluste; senkrecht der empfundene Wert. Im Gewinnbereich verläuft die Kurve flach ansteigend und wird nach oben hin immer flacher. Im Verlustbereich fällt sie deutlich steiler ab. Zwei gestrichelte Hilfslinien zeigen denselben Betrag in beide Richtungen: Ein Gewinn von hundert Euro hebt die Kurve nur wenig, ein Verlust von hundert Euro drückt sie ungefähr doppelt so weit nach unten. Diese Unwucht ist die Verlustaversion. Sie erklärt, warum Anleger Verlustpositionen halten und Gewinnpositionen zu früh verkaufen.',
    caption:
      'Derselbe Betrag, ungefähr die doppelte Wirkung. Die Kurve ist im Verlustbereich steiler – das ist die Verlustaversion.',
  },
  'fa-drei-abschluesse': {
    title: 'Wie die drei Abschlüsse zusammenhängen',
    description:
      'Drei nebeneinanderstehende Kästen. Links die Gewinn- und Verlustrechnung mit Umsatz minus Kosten gleich Gewinn. In der Mitte die Kapitalflussrechnung, die beim Gewinn ansetzt, die nicht zahlungswirksamen Posten herausrechnet und den tatsächlichen Mittelzufluss ergibt. Rechts die Bilanz mit Vermögen minus Schulden gleich Eigenkapital. Ein Pfeil führt vom Gewinn in die Kapitalflussrechnung, ein zweiter vom Mittelzufluss in die Bilanz, wo er den Kassenbestand verändert. Eine gestrichelte Rückführung zeigt, dass der Gewinn zugleich das Eigenkapital erhöht und sich der Kreis damit schließt. Wer nur einen der drei Abschlüsse liest, sieht ein Drittel des Bildes.',
    caption:
      'Drei Sichten auf dasselbe Unternehmen, über zwei Größen verbunden: den Gewinn und die Kasse.',
  },
  'ta-elliott-zyklus': {
    title: 'Der Elliott-Grundzyklus',
    description:
      'Ein schematischer Verlauf aus acht Wellen, jede beschriftet. Fünf Impulswellen laufen in Trendrichtung nach oben, nummeriert von 1 bis 5: Welle 1 steigt, Welle 2 korrigiert, ohne den Anfang von Welle 1 zu unterschreiten, Welle 3 ist die längste und steilste, Welle 4 pendelt seitwärts, ohne in den Kursbereich von Welle 1 zu reichen, Welle 5 bringt den letzten Schub. Danach folgen drei Korrekturwellen gegen den Trend, mit A, B und C bezeichnet. Die drei festen Regeln der Theorie sind in der Zeichnung eingehalten und markiert: Welle 2 bleibt über dem Start, Welle 3 ist nicht die kürzeste, Welle 4 überlappt Welle 1 nicht. Alles Übrige an der Theorie ist auslegbar – und weil sie zahlreiche Sonderformen zulässt, lässt sich für fast jeden tatsächlichen Verlauf eine regelkonforme Zählung finden.',
    caption:
      'Fünf Wellen vor, drei zurück. Die drei harten Regeln stehen in der Grafik – die vielen erlaubten Ausnahmen sind der Grund, warum die Zählung selten eindeutig ist.',
  },
  'geldsystem-giralgeld': {
    title: 'Wie aus einem Kredit Geld wird',
    description:
      'Zwei Bankbilanzen nebeneinander. Links vor der Kreditvergabe: Aktiva und Passiva sind gleich hoch und bestehen nur aus dem bisherigen Bestand. Rechts nach der Kreditvergabe: Auf der Aktivseite ist eine Forderung an den Kreditnehmer hinzugekommen, auf der Passivseite ein Guthaben in exakt derselben Höhe. Beide Seiten sind gleichzeitig und um denselben Betrag gewachsen. Niemandem wurde etwas weggenommen – das Guthaben, mit dem der Kreditnehmer bezahlt, gab es vorher nicht. Genau diese gleichzeitige Verlängerung ist der Vorgang, den die verbreitete Vorstellung nicht erklären kann, die Bank verleihe eingelegtes Spargeld weiter: Dann müsste eine Seite kürzer werden.',
    caption:
      'Ein Kredit nimmt niemandem etwas weg. Beide Seiten der Bilanz wachsen gleichzeitig – das neue Guthaben ist das neue Geld.',
  },
  'geldsystem-lebensdauer': {
    title: 'Wie lange Währungen im Umlauf waren',
    description:
      'Waagerechte Balken auf einer Jahresachse, nach Dauer sortiert. Die längsten gehören zu Währungen, die bis heute gelten: das von der Bank of England ausgegebene Pfund Sterling seit 1694, der US-Dollar seit 1792, der Schweizer Franken seit 1850, der japanische Yen seit 1871. Ihre Balken enden offen, weil sie weiterlaufen. Deutlich kürzer sind die Balken der gescheiterten oder ersetzten Währungen: der Zimbabwe-Dollar mit 29 Jahren, die Reichsmark mit 24, der ungarische Pengő mit 19, die deutsche Papiermark mit 9 und der argentinische Austral mit 7. Der Euro steht mit seinen bisherigen Jahren am unteren Ende der laufenden Gruppe. Die Aussage der Grafik ist der Abstand zwischen beiden Gruppen: Währungen scheitern in Staaten, die in Krieg, Bürgerkrieg oder Systemzusammenbruch stehen – wo das nicht der Fall ist, halten sie Jahrhunderte.',
    caption:
      'Die kurzlebigen Währungen gehören fast alle zu Staaten im Ausnahmezustand. Ein Durchschnitt über beide Gruppen sagt über keine von beiden etwas aus.',
  },
  'geldsystem-devisenmarkt': {
    title: 'Devisenmarkt gegen Welthandel',
    description:
      'Drei Balken im Größenvergleich. Der Devisenmarkt setzt an einem einzigen Handelstag 7,5 Billionen US-Dollar um, in einer Woche entsprechend 37,5 Billionen. Der gesamte Welthandel mit Waren und Dienstleistungen kommt in einem ganzen Jahr auf rund 32 Billionen. In gut vier Handelstagen wird damit so viel Währung getauscht, wie der Welthandel in zwölf Monaten bewegt. Der Unterschied erklärt sich nicht durch Spekulation: Der größte Einzelposten sind Devisenswaps, also besicherte Geldaufnahmen in fremder Währung, dazu kommen Absicherungsgeschäfte und die Weitergabe von Aufträgen zwischen Banken.',
    caption:
      'Import und Export erklären nur einen Bruchteil des Umsatzes. Der größte Teil sind Swaps und Absicherung, nicht Spekulation.',
  },
}
