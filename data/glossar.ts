/**
 * Das Glossar – Begriffe, die in den Texten vorkommen und nicht jeder kennt.
 *
 * ## Wozu es das gibt
 *
 * Weil jeder Text an einer Stelle voraussetzt, dass ein Wort bekannt ist. Wer
 * es nicht kennt, hat zwei Möglichkeiten: weiterlesen und den Satz nicht
 * verstehen, oder die Seite verlassen und woanders nachsehen. Beides ist
 * vermeidbar, wenn die Erklärung einen Klick entfernt steht.
 *
 * ## Was ein Eintrag leisten muss
 *
 * `kurz` ist die Antwort auf „Was ist das?“ in einem Satz – so kurz, dass sie
 * im Vorbeigehen gelesen wird, und so genau, dass sie allein trägt. Sie darf
 * keinen anderen Fachbegriff enthalten, den sie nicht selbst erklärt; sonst
 * schickt der Eintrag den Lesenden nur weiter.
 *
 * `lang` steht daneben, wo ein Satz nicht reicht: bei Begriffen, deren
 * Missverständnis teuer ist, und bei denen, die im Alltag anders benutzt
 * werden als in der Fachsprache.
 *
 * ## Wie die Verlinkung entsteht
 *
 * Nicht von Hand. `formen` nennt die Wortformen, unter denen ein Begriff im
 * Text auftaucht – Einzahl, Mehrzahl, gebräuchliche Schreibweisen. Der
 * Textrenderer verlinkt daraufhin das **erste** Vorkommen je Seite und lässt
 * alle weiteren in Ruhe. Ein Text, in dem jedes zweite Wort blau ist, wird
 * nicht gelesen.
 *
 * Auf der Seite eines Themas wird der eigene Begriff nicht verlinkt: Ein
 * Verweis von der Aktien-Seite auf „Aktie“ führt zurück auf eine kürzere
 * Fassung dessen, was gerade dasteht.
 */

export interface Glossareintrag {
  /** Sprungmarke und Kennung, z. B. `abgeltungsteuer`. */
  slug: string
  begriff: string
  /** Die Erklärung in einem Satz. */
  kurz: string
  /** Wo ein Satz nicht reicht. */
  lang?: string
  /**
   * Wortformen, unter denen der Begriff im Fließtext erkannt wird.
   *
   * Ohne den Begriff selbst – der zählt immer. Groß- und Kleinschreibung
   * spielt keine Rolle, Wortgrenzen dagegen schon: „Fonds“ trifft nicht in
   * „Fondsgesellschaft“.
   */
  formen?: string[]
  /** Verwandte Einträge, als Slugs. */
  siehe?: string[]
  /** Passendes Lernthema, als Slug. */
  thema?: string
  /** Passender Rechner, als Slug. */
  rechner?: string
}

export const glossar: Glossareintrag[] = [
  {
    slug: 'abgeltungsteuer',
    begriff: 'Abgeltungsteuer',
    kurz: 'Die pauschale Steuer von 25 Prozent auf Kapitalerträge, die die Bank direkt einbehält und ans Finanzamt abführt.',
    lang: 'Mit Solidaritätszuschlag sind es 26,375 Prozent, mit Kirchensteuer knapp 28. „Abgeltend“ heißt: Damit ist die Steuer erledigt, der Ertrag muss nicht mehr in die Steuererklärung – es sei denn, man will etwas zurückholen.',
    formen: ['Kapitalertragsteuer', 'Kapitalertragssteuer', 'Abgeltungssteuer'],
    siehe: ['sparerpauschbetrag', 'teilfreistellung', 'vorabpauschale'],
    thema: 'sparerpauschbetrag',
    rechner: 'steuerrechner',
  },
  {
    slug: 'aktie',
    begriff: 'Aktie',
    kurz: 'Ein Anteil an einem Unternehmen – wer sie besitzt, ist Miteigentümer und nicht Gläubiger.',
    lang: 'Der Unterschied zur Anleihe steckt genau darin: Ein Gläubiger hat Anspruch auf einen festen Betrag, ein Miteigentümer auf einen Anteil an dem, was übrig bleibt. Deshalb schwankt der Wert einer Aktie stärker – und deshalb ist die langfristige Rendite höher.',
    formen: ['Aktien'],
    siehe: ['dividende', 'aktiengesellschaft', 'anleihe'],
    thema: 'aktie',
  },
  {
    slug: 'aktiengesellschaft',
    begriff: 'Aktiengesellschaft',
    kurz: 'Eine Unternehmensform, deren Eigenkapital in handelbare Anteile zerlegt ist.',
    formen: ['Aktiengesellschaften', 'AG'],
    siehe: ['aktie', 'hauptversammlung'],
    thema: 'aktie',
  },
  {
    slug: 'anleihe',
    begriff: 'Anleihe',
    kurz: 'Ein handelbarer Kredit: Wer sie kauft, leiht dem Herausgeber Geld und bekommt dafür Zinsen und am Ende den Nennwert zurück.',
    formen: ['Anleihen', 'Schuldverschreibung', 'Schuldverschreibungen', 'Bond', 'Bonds'],
    siehe: ['kupon', 'rendite', 'staatsanleihe', 'bonitaet'],
    thema: 'schuldverschreibung',
  },
  {
    slug: 'ausschuettung',
    begriff: 'Ausschüttung',
    kurz: 'Der Teil der Erträge, den ein Fonds an die Anteilseigner auszahlt, statt ihn wieder anzulegen.',
    formen: ['Ausschüttungen', 'ausschüttend'],
    siehe: ['thesaurierung', 'dividende'],
    thema: 'fonds',
  },
  {
    slug: 'basiszins',
    begriff: 'Basiszins',
    kurz: 'Ein jährlich vom Bundesfinanzministerium festgelegter Zinssatz, aus dem sich die Vorabpauschale berechnet.',
    siehe: ['vorabpauschale'],
    rechner: 'steuerrechner',
  },
  {
    slug: 'bonitaet',
    begriff: 'Bonität',
    kurz: 'Die Einschätzung, wie wahrscheinlich es ist, dass ein Schuldner seine Schulden zurückzahlt.',
    lang: 'Ausgedrückt wird sie in Buchstabencodes von AAA bis D. Je schlechter die Bonität, desto höher der Zins, den ein Schuldner bieten muss – der Aufschlag ist der Preis für das Ausfallrisiko.',
    formen: ['Kreditwürdigkeit', 'Rating', 'Ratings'],
    siehe: ['anleihe', 'staatsanleihe', 'risikopraemie'],
    thema: 'schuldverschreibung',
  },
  {
    slug: 'boerse',
    begriff: 'Börse',
    kurz: 'Ein organisierter Marktplatz, an dem Wertpapiere nach festen Regeln gehandelt werden.',
    formen: ['Börsen'],
    siehe: ['orderbuch', 'spread', 'liquiditaet'],
    thema: 'boerse',
  },
  {
    slug: 'broker',
    begriff: 'Broker',
    kurz: 'Ein Vermittler, über den private Anleger Wertpapiere kaufen und verkaufen; in Deutschland meist eine Bank mit Depotgeschäft.',
    formen: ['Neobroker', 'Onlinebroker'],
    siehe: ['depot', 'order'],
    thema: 'depot-und-broker',
  },
  {
    slug: 'buchwert',
    begriff: 'Buchwert',
    kurz: 'Das Eigenkapital eines Unternehmens laut Bilanz – was rechnerisch übrig bliebe, wenn alle Schulden bezahlt wären.',
    siehe: ['kbv', 'eigenkapital'],
  },
  {
    slug: 'cashflow',
    begriff: 'Cashflow',
    kurz: 'Der Betrag, der einem Unternehmen in einer Periode tatsächlich zugeflossen ist – im Unterschied zum Gewinn, der Buchungen ohne Zahlung enthält.',
    lang: 'Der operative Cashflow ist schwerer zu gestalten als der Gewinn: Abschreibungen und Rückstellungen mindern den Gewinn, ohne Geld zu kosten. Wer beide Größen nebeneinanderlegt, sieht, wie viel vom ausgewiesenen Erfolg wirklich angekommen ist.',
    siehe: ['kcv', 'gewinn'],
  },
  {
    slug: 'depot',
    begriff: 'Depot',
    kurz: 'Das Konto, auf dem Wertpapiere verwahrt werden – rechtlich bleiben sie dabei Eigentum des Anlegers.',
    lang: 'Das ist der Grund, warum ein Depot bei einer Bankpleite anders behandelt wird als Guthaben: Wertpapiere gehören nicht zur Insolvenzmasse. Die Einlagensicherung braucht es nur für Geld auf dem Verrechnungskonto.',
    formen: ['Depots', 'Wertpapierdepot'],
    siehe: ['broker', 'einlagensicherung', 'verrechnungskonto'],
    thema: 'depot-und-broker',
  },
  {
    slug: 'diversifikation',
    begriff: 'Diversifikation',
    kurz: 'Die Verteilung des Vermögens auf viele voneinander unabhängige Anlagen, damit ein einzelner Ausfall das Ganze nicht trifft.',
    lang: 'Das Besondere daran: Sie senkt das Risiko, ohne die erwartete Rendite zu senken. Das ist der einzige Vorteil an der Börse, den es umsonst gibt – alles andere kostet entweder Rendite oder Sicherheit.',
    formen: ['Streuung', 'diversifiziert', 'Risikostreuung'],
    siehe: ['portfolio', 'klumpenrisiko', 'korrelation'],
    thema: 'aktien-laender-branchen',
  },
  {
    slug: 'dividende',
    begriff: 'Dividende',
    kurz: 'Der Teil des Gewinns, den eine Aktiengesellschaft an ihre Aktionäre auszahlt.',
    lang: 'Am Tag der Auszahlung fällt der Kurs um ungefähr denselben Betrag – das Geld verlässt ja das Unternehmen. Eine Dividende ist deshalb kein zusätzlicher Ertrag obendrauf, sondern eine Umschichtung vom Depotwert aufs Konto.',
    formen: ['Dividenden', 'Dividendenrendite'],
    siehe: ['aktie', 'ausschuettung', 'ex-tag'],
    thema: 'aktie',
  },
  {
    slug: 'effektivzins',
    begriff: 'Effektivzins',
    kurz: 'Der Zinssatz eines Kredits einschließlich aller Nebenkosten – die einzige Zahl, mit der sich zwei Angebote vergleichen lassen.',
    formen: ['effektiver Jahreszins'],
    siehe: ['sollzins', 'tilgung'],
    thema: 'schulden-und-kredit',
  },
  {
    slug: 'eigenkapital',
    begriff: 'Eigenkapital',
    kurz: 'Der Teil des Vermögens, der nach Abzug aller Schulden übrig bleibt.',
    formen: ['Eigenkapitalquote'],
    siehe: ['buchwert', 'fremdkapital'],
  },
  {
    slug: 'einlagensicherung',
    begriff: 'Einlagensicherung',
    kurz: 'Die gesetzliche Garantie, dass Guthaben bei einer Bank bis 100.000 Euro je Person und Institut erstattet werden, wenn die Bank ausfällt.',
    formen: ['Einlagensicherungen'],
    siehe: ['depot', 'tagesgeld'],
    thema: 'einlagensicherung',
  },
  {
    slug: 'emittent',
    begriff: 'Emittent',
    kurz: 'Wer ein Wertpapier herausgibt – bei einer Aktie das Unternehmen, bei einer Anleihe der Schuldner, bei einem Zertifikat die Bank.',
    formen: ['Emittenten', 'Emission'],
    siehe: ['anleihe', 'emittentenrisiko'],
  },
  {
    slug: 'emittentenrisiko',
    begriff: 'Emittentenrisiko',
    kurz: 'Das Risiko, dass der Herausgeber eines Wertpapiers zahlungsunfähig wird und das Papier wertlos verfällt.',
    lang: 'Bei Zertifikaten und ETNs ist das der entscheidende Unterschied zum Fonds: Sie sind rechtlich Schuldverschreibungen der Bank, kein Sondervermögen. Geht die Bank unter, ist das Geld weg – unabhängig davon, wie sich der zugrunde liegende Wert entwickelt hat.',
    siehe: ['emittent', 'sondervermoegen', 'zertifikat'],
    thema: 'derivat',
  },
  {
    slug: 'etf',
    begriff: 'ETF',
    kurz: 'Ein börsengehandelter Fonds, der einen Index nachbildet, statt Wertpapiere auszuwählen.',
    lang: 'Die Abkürzung steht für Exchange Traded Fund. Weil niemand auswählen muss, ist er billiger als ein aktiv verwalteter Fonds – und genau diese Kostenersparnis ist der Grund, warum er über lange Zeiträume meist besser abschneidet.',
    formen: ['ETFs', 'Indexfonds'],
    siehe: ['index', 'fonds', 'ter', 'sondervermoegen'],
    thema: 'etf',
  },
  {
    slug: 'ex-tag',
    begriff: 'Ex-Tag',
    kurz: 'Der erste Handelstag, an dem eine Aktie ohne Anspruch auf die beschlossene Dividende gehandelt wird – erkennbar am Kursabschlag.',
    siehe: ['dividende'],
  },
  {
    slug: 'fondsgesellschaft',
    begriff: 'Kapitalverwaltungsgesellschaft',
    kurz: 'Das Unternehmen, das einen Fonds auflegt und verwaltet; das Fondsvermögen selbst liegt getrennt davon bei einer Verwahrstelle.',
    formen: ['Fondsgesellschaft', 'Fondsgesellschaften', 'KVG'],
    siehe: ['sondervermoegen', 'fonds'],
    thema: 'fonds',
  },
  {
    slug: 'fonds',
    begriff: 'Fonds',
    kurz: 'Ein gemeinsamer Topf vieler Anleger, aus dem Wertpapiere gekauft werden; jeder Anteil ist ein Bruchteil des Ganzen.',
    formen: ['Investmentfonds', 'Publikumsfonds'],
    siehe: ['etf', 'sondervermoegen', 'ter', 'ausschuettung'],
    thema: 'fonds',
  },
  {
    slug: 'freistellungsauftrag',
    begriff: 'Freistellungsauftrag',
    kurz: 'Die Anweisung an die Bank, Kapitalerträge bis zur Höhe des Sparerpauschbetrags ohne Steuerabzug auszuzahlen.',
    lang: 'Ohne ihn führt die Bank die Steuer ab, obwohl sie nicht anfiele – zurückholen lässt sie sich dann nur über die Steuererklärung. Wer mehrere Banken hat, muss den Betrag aufteilen; in der Summe bleibt es bei 1.000 Euro je Person.',
    formen: ['Freistellungsaufträge'],
    siehe: ['sparerpauschbetrag', 'abgeltungsteuer'],
    thema: 'sparerpauschbetrag',
  },
  {
    slug: 'fremdkapital',
    begriff: 'Fremdkapital',
    kurz: 'Der Teil des Kapitals eines Unternehmens, der geliehen ist und zurückgezahlt werden muss.',
    siehe: ['eigenkapital', 'verschuldungsgrad'],
  },
  {
    slug: 'geldmarkt',
    begriff: 'Geldmarkt',
    kurz: 'Der Markt für kurzfristige Ausleihungen mit Laufzeiten von einem Tag bis zu einem Jahr.',
    formen: ['Geldmarktfonds'],
    siehe: ['leitzins', 'tagesgeld'],
  },
  {
    slug: 'gewinn',
    begriff: 'Gewinn',
    kurz: 'Was einem Unternehmen nach allen Kosten, Zinsen und Steuern bleibt – die Grundlage für Dividende und Kurs-Gewinn-Verhältnis.',
    formen: ['Jahresüberschuss', 'Nettogewinn'],
    siehe: ['kgv', 'cashflow', 'marge'],
  },
  {
    slug: 'hauptversammlung',
    begriff: 'Hauptversammlung',
    kurz: 'Die jährliche Versammlung der Aktionäre, auf der über Dividende, Entlastung des Vorstands und Satzungsänderungen abgestimmt wird.',
    siehe: ['aktie', 'aktiengesellschaft'],
    thema: 'aktie',
  },
  {
    slug: 'hebel',
    begriff: 'Hebel',
    kurz: 'Das Verhältnis, um das ein Produkt die Bewegung des zugrunde liegenden Werts vervielfacht – in beide Richtungen.',
    lang: 'Ein Hebel von zehn bedeutet: fünf Prozent Kursgewinn werden zu fünfzig, fünf Prozent Verlust ebenso. Der Denkfehler steckt darin, nur die erste Hälfte des Satzes zu lesen.',
    formen: ['gehebelt', 'Hebelprodukt', 'Hebelprodukte', 'Leverage'],
    siehe: ['derivat', 'margin', 'nachschusspflicht'],
    thema: 'derivat',
  },
  {
    slug: 'index',
    begriff: 'Index',
    kurz: 'Eine Kennzahl, die die Entwicklung eines Marktes oder Marktteils in einer Zahl zusammenfasst.',
    formen: ['Indizes', 'Indices'],
    siehe: ['etf', 'marktkapitalisierung'],
    thema: 'etf',
  },
  {
    slug: 'inflation',
    begriff: 'Inflation',
    kurz: 'Der allgemeine Anstieg der Preise – dieselbe Summe kauft mit der Zeit weniger.',
    lang: 'Für Anleger ist sie die stille Vergleichsgröße: Eine Anlage mit zwei Prozent Zins bei drei Prozent Inflation verliert real an Wert, auch wenn der Kontostand steigt.',
    formen: ['Teuerung', 'Inflationsrate'],
    siehe: ['realzins', 'kaufkraft'],
    thema: 'inflation',
    rechner: 'inflationsrechner',
  },
  {
    slug: 'kaufkraft',
    begriff: 'Kaufkraft',
    kurz: 'Was man für einen Geldbetrag tatsächlich bekommt – die Größe, auf die es ankommt, nicht der Betrag selbst.',
    siehe: ['inflation', 'realzins'],
    rechner: 'inflationsrechner',
  },
  {
    slug: 'kbv',
    begriff: 'Kurs-Buchwert-Verhältnis',
    kurz: 'Der Börsenwert eines Unternehmens geteilt durch sein Eigenkapital – wie viel das Zehnfache dessen kostet, was in der Bilanz steht.',
    formen: ['KBV'],
    siehe: ['buchwert', 'kgv', 'marktkapitalisierung'],
  },
  {
    slug: 'kcv',
    begriff: 'Kurs-Cashflow-Verhältnis',
    kurz: 'Der Kurs im Verhältnis zum operativen Cashflow je Aktie – die schwerer zu gestaltende Alternative zum KGV.',
    formen: ['KCV'],
    siehe: ['cashflow', 'kgv'],
  },
  {
    slug: 'kgv',
    begriff: 'Kurs-Gewinn-Verhältnis',
    kurz: 'Der Kurs geteilt durch den Gewinn je Aktie – wie viele Jahresgewinne man für eine Aktie bezahlt.',
    lang: 'Ein niedriges KGV heißt nicht „günstig“, sondern nur „billig gemessen am letzten Gewinn“. Es kann ebenso bedeuten, dass der Markt mit sinkenden Gewinnen rechnet. Vergleichbar ist die Zahl nur innerhalb derselben Branche.',
    formen: ['KGV'],
    siehe: ['gewinn', 'kuv', 'kbv'],
  },
  {
    slug: 'klumpenrisiko',
    begriff: 'Klumpenrisiko',
    kurz: 'Die Häufung eines einzelnen Risikos im Depot – etwa zu viel von einer Aktie, einer Branche oder einem Land.',
    lang: 'Der häufigste Fall ist unsichtbar: Wer beim eigenen Arbeitgeber angestellt ist und dessen Aktien hält, hängt mit Einkommen und Vermögen an derselben Firma.',
    siehe: ['diversifikation', 'korrelation'],
    thema: 'portfolio-aufbau',
  },
  {
    slug: 'korrelation',
    begriff: 'Korrelation',
    kurz: 'Das Maß dafür, wie gleichläufig sich zwei Anlagen bewegen – von +1 (immer gemeinsam) bis −1 (immer gegenläufig).',
    lang: 'Streuung wirkt nur, soweit die Korrelation unter eins liegt. Der unangenehme Teil: In Krisen steigen die Korrelationen, gerade dann also, wenn man die Streuung bräuchte.',
    formen: ['korreliert', 'Korrelationen'],
    siehe: ['diversifikation', 'volatilitaet'],
    thema: 'portfolio-aufbau',
  },
  {
    slug: 'kupon',
    begriff: 'Kupon',
    kurz: 'Der feste Zins, den eine Anleihe auf ihren Nennwert zahlt – unabhängig davon, wie sich ihr Kurs entwickelt.',
    formen: ['Kupons', 'Coupon', 'Nominalzins'],
    siehe: ['anleihe', 'nennwert', 'rendite'],
    thema: 'schuldverschreibung',
  },
  {
    slug: 'kurs',
    begriff: 'Kurs',
    kurz: 'Der zuletzt an einer Börse zustande gekommene Preis eines Wertpapiers.',
    formen: ['Kurse', 'Börsenkurs'],
    siehe: ['spread', 'orderbuch'],
    thema: 'boerse',
  },
  {
    slug: 'kuv',
    begriff: 'Kurs-Umsatz-Verhältnis',
    kurz: 'Der Börsenwert geteilt durch den Jahresumsatz – die Kennzahl, die auch dann funktioniert, wenn ein Unternehmen noch keinen Gewinn macht.',
    formen: ['KUV'],
    siehe: ['kgv', 'marktkapitalisierung'],
  },
  {
    slug: 'leitzins',
    begriff: 'Leitzins',
    kurz: 'Der Zinssatz, zu dem sich Banken bei der Notenbank Geld leihen – der Ausgangspunkt für fast alle anderen Zinsen.',
    formen: ['Leitzinsen'],
    siehe: ['notenbank', 'geldmarkt', 'anleihe'],
    thema: 'notenbanken-geldpolitik',
  },
  {
    slug: 'liquiditaet',
    begriff: 'Liquidität',
    kurz: 'Wie leicht sich ein Wertpapier ohne Preisabschlag verkaufen lässt.',
    lang: 'Sie fällt genau dann auf, wenn sie fehlt: Ein dünn gehandeltes Papier lässt sich in ruhigen Zeiten problemlos verkaufen und in unruhigen nur mit Abschlag – also dann, wenn man verkaufen möchte.',
    formen: ['liquide', 'illiquide'],
    siehe: ['spread', 'orderbuch'],
    thema: 'boerse',
  },
  {
    slug: 'limit',
    begriff: 'Limit',
    kurz: 'Die Preisgrenze in einer Order: Gekauft wird höchstens, verkauft mindestens zu diesem Kurs.',
    formen: ['Limitorder', 'limitiert'],
    siehe: ['order', 'spread'],
    thema: 'depot-und-broker',
  },
  {
    slug: 'margin',
    begriff: 'Margin',
    kurz: 'Die Sicherheitsleistung, die ein Broker für gehebelte Geschäfte verlangt.',
    siehe: ['hebel', 'nachschusspflicht'],
    thema: 'derivat',
  },
  {
    slug: 'marge',
    begriff: 'Marge',
    kurz: 'Der Anteil des Umsatzes, der als Gewinn übrig bleibt.',
    formen: ['Margen', 'Gewinnmarge'],
    siehe: ['gewinn', 'umsatz'],
  },
  {
    slug: 'marktkapitalisierung',
    begriff: 'Marktkapitalisierung',
    kurz: 'Der Börsenwert eines Unternehmens: Aktienkurs mal Anzahl der Aktien.',
    formen: ['Börsenwert'],
    siehe: ['index', 'kgv', 'kuv'],
  },
  {
    slug: 'nachschusspflicht',
    begriff: 'Nachschusspflicht',
    kurz: 'Die Pflicht, bei bestimmten Hebelgeschäften Geld nachzuschießen, wenn die Sicherheit nicht mehr reicht – im Extremfall über den Einsatz hinaus.',
    lang: 'Für Privatanleger in der EU ist sie bei CFDs seit 2017 abgeschafft. Bei Termingeschäften und Wertpapierkrediten gibt es sie weiterhin.',
    siehe: ['hebel', 'margin'],
    thema: 'derivat',
  },
  {
    slug: 'nennwert',
    begriff: 'Nennwert',
    kurz: 'Der Betrag, auf den eine Anleihe lautet und der am Ende der Laufzeit zurückgezahlt wird.',
    formen: ['Nominalwert'],
    siehe: ['anleihe', 'kupon'],
    thema: 'schuldverschreibung',
  },
  {
    slug: 'notenbank',
    begriff: 'Notenbank',
    kurz: 'Die staatliche Institution, die den Leitzins setzt und die Geldmenge steuert – in der Eurozone die Europäische Zentralbank.',
    formen: ['Notenbanken', 'Zentralbank', 'Zentralbanken', 'EZB'],
    siehe: ['leitzins', 'inflation'],
    thema: 'notenbanken-geldpolitik',
  },
  {
    slug: 'order',
    begriff: 'Order',
    kurz: 'Der Auftrag an den Broker, ein Wertpapier zu kaufen oder zu verkaufen.',
    formen: ['Orders', 'Ordern'],
    siehe: ['limit', 'orderbuch', 'teilausfuehrung'],
    thema: 'depot-und-broker',
  },
  {
    slug: 'orderbuch',
    begriff: 'Orderbuch',
    kurz: 'Die Liste aller offenen Kauf- und Verkaufsaufträge – aus ihrer Überschneidung entsteht der Kurs.',
    siehe: ['kurs', 'spread', 'liquiditaet'],
    thema: 'wie-funktioniert-der-markt',
  },
  {
    slug: 'portfolio',
    begriff: 'Portfolio',
    kurz: 'Die Gesamtheit der Anlagen einer Person – die Ebene, auf der Risiko überhaupt erst beurteilt werden kann.',
    lang: 'Eine einzelne Anlage ist weder riskant noch sicher; entscheidend ist ihr Beitrag zum Ganzen. Eine schwankende Beimischung kann das Risiko des Portfolios sogar senken, wenn sie sich gegenläufig bewegt.',
    formen: ['Portfolios', 'Depotstruktur'],
    siehe: ['diversifikation', 'rebalancing', 'korrelation'],
    thema: 'portfolio-aufbau',
  },
  {
    slug: 'realzins',
    begriff: 'Realzins',
    kurz: 'Der Zins nach Abzug der Inflation – was an Kaufkraft tatsächlich hinzukommt.',
    formen: ['Realrendite', 'reale Rendite'],
    siehe: ['inflation', 'kaufkraft', 'rendite'],
    rechner: 'inflationsrechner',
  },
  {
    slug: 'rebalancing',
    begriff: 'Rebalancing',
    kurz: 'Das Zurücksetzen eines Depots auf die geplante Aufteilung, nachdem Kursbewegungen sie verschoben haben.',
    lang: 'Es zwingt dazu, das Gestiegene zu verkaufen und das Gefallene zu kaufen – also genau das, was einem am schwersten fällt. Darin liegt der Wert, nicht in der Rechnerei.',
    formen: ['Umschichtung'],
    siehe: ['portfolio', 'diversifikation'],
    thema: 'portfolio-aufbau',
  },
  {
    slug: 'rendite',
    begriff: 'Rendite',
    kurz: 'Der Ertrag einer Anlage im Verhältnis zum eingesetzten Kapital, meist auf ein Jahr bezogen.',
    formen: ['Renditen'],
    siehe: ['realzins', 'risikopraemie', 'volatilitaet'],
    thema: 'risiko-und-rendite',
  },
  {
    slug: 'risikopraemie',
    begriff: 'Risikoprämie',
    kurz: 'Der Renditeaufschlag, den eine schwankende Anlage gegenüber einer sicheren bieten muss, damit jemand sie kauft.',
    lang: 'Sie ist keine Belohnung fürs Aushalten, sondern ein Preis: Wer sie kassieren will, muss das Risiko tatsächlich tragen – auch dann, wenn es sich verwirklicht.',
    formen: ['Risikoprämien'],
    siehe: ['rendite', 'volatilitaet'],
    thema: 'risiko-und-rendite',
  },
  {
    slug: 'sondervermoegen',
    begriff: 'Sondervermögen',
    kurz: 'Das Vermögen eines Fonds, das rechtlich getrennt von der Fondsgesellschaft gehalten wird und bei deren Insolvenz nicht angetastet werden darf.',
    lang: 'Das ist der wichtigste Unterschied zwischen einem Fonds und einem Zertifikat. Beim Fonds gehört das Vermögen den Anlegern, beim Zertifikat sind sie Gläubiger einer Bank.',
    siehe: ['fonds', 'etf', 'emittentenrisiko'],
    thema: 'fonds',
  },
  {
    slug: 'sollzins',
    begriff: 'Sollzins',
    kurz: 'Der reine Zinssatz eines Kredits ohne Nebenkosten – zum Vergleich zweier Angebote ungeeignet.',
    siehe: ['effektivzins', 'tilgung'],
    thema: 'schulden-und-kredit',
  },
  {
    slug: 'sparerpauschbetrag',
    begriff: 'Sparerpauschbetrag',
    kurz: 'Der Betrag an Kapitalerträgen, der je Person steuerfrei bleibt: 1.000 Euro, für Zusammenveranlagte 2.000.',
    formen: ['Sparerfreibetrag', 'Freibetrag'],
    siehe: ['freistellungsauftrag', 'abgeltungsteuer'],
    thema: 'sparerpauschbetrag',
    rechner: 'steuerrechner',
  },
  {
    slug: 'sparplan',
    begriff: 'Sparplan',
    kurz: 'Ein Dauerauftrag ins Depot: Zu festen Terminen wird für einen festen Betrag gekauft, unabhängig vom Kurs.',
    formen: ['Sparpläne', 'Sparrate'],
    siehe: ['cost-average', 'etf'],
    thema: 'cost-average-sparplan',
    rechner: 'zinsrechner',
  },
  {
    slug: 'cost-average',
    begriff: 'Cost-Average-Effekt',
    kurz: 'Die Folge gleichbleibender Sparraten: Bei niedrigen Kursen werden mehr Anteile gekauft als bei hohen.',
    lang: 'Als Renditevorteil wird er häufig überschätzt – gegenüber einer Einmalanlage ist er im Mittel sogar nachteilig, weil Geld länger unangelegt bleibt. Sein Wert liegt woanders: Er nimmt die Frage nach dem richtigen Zeitpunkt aus der Entscheidung.',
    formen: ['Durchschnittskosteneffekt'],
    siehe: ['sparplan'],
    thema: 'cost-average-sparplan',
  },
  {
    slug: 'spread',
    begriff: 'Spread',
    kurz: 'Die Spanne zwischen Kauf- und Verkaufskurs – der Preis, den man bezahlt, ohne dass er als Gebühr auftaucht.',
    formen: ['Geld-Brief-Spanne', 'Spreads'],
    siehe: ['liquiditaet', 'orderbuch', 'kurs'],
    thema: 'boerse',
  },
  {
    slug: 'staatsanleihe',
    begriff: 'Staatsanleihe',
    kurz: 'Eine Anleihe, deren Schuldner ein Staat ist.',
    formen: ['Staatsanleihen', 'Bundesanleihe', 'Bundesanleihen'],
    siehe: ['anleihe', 'bonitaet', 'leitzins'],
    thema: 'staatsanleihe',
  },
  {
    slug: 'tagesgeld',
    begriff: 'Tagesgeld',
    kurz: 'Ein verzinstes Konto, von dem täglich abgehoben werden kann – der übliche Ort für den Notgroschen.',
    lang: 'Der Zins ist variabel: Die Bank darf ihn jederzeit ändern, nach oben wie nach unten. Ein Lockangebot für Neukunden sagt deshalb wenig darüber aus, was in einem Jahr gezahlt wird.',
    siehe: ['festgeld', 'einlagensicherung', 'geldmarkt'],
    thema: 'tagesgeld',
  },
  {
    slug: 'festgeld',
    begriff: 'Festgeld',
    kurz: 'Eine Einlage mit fester Laufzeit und festem Zins, an die man vor Ablauf nicht herankommt.',
    formen: ['Termingeld'],
    siehe: ['tagesgeld', 'einlagensicherung'],
    thema: 'tagesgeld',
  },
  {
    slug: 'teilausfuehrung',
    begriff: 'Teilausführung',
    kurz: 'Eine Order, die nur zum Teil ausgeführt wurde, weil nicht genug Gegenseite vorhanden war – oft mit doppelten Gebühren verbunden.',
    siehe: ['order', 'liquiditaet'],
    thema: 'depot-und-broker',
  },
  {
    slug: 'teilfreistellung',
    begriff: 'Teilfreistellung',
    kurz: 'Der Anteil des Fondsertrags, der von vornherein steuerfrei bleibt – bei Aktienfonds 30 Prozent.',
    lang: 'Sie gleicht die Steuer aus, die der Fonds bereits auf seiner Ebene zahlt. Maßgeblich ist die Aktienquote, die in den Anlagebedingungen als Mindestquote steht, nicht die tatsächlich gehaltene.',
    siehe: ['abgeltungsteuer', 'vorabpauschale', 'fonds'],
    rechner: 'steuerrechner',
  },
  {
    slug: 'ter',
    begriff: 'Gesamtkostenquote',
    kurz: 'Die laufenden Kosten eines Fonds in Prozent des Vermögens je Jahr – abgezogen wird sie täglich vom Fondsvermögen, nicht in Rechnung gestellt.',
    lang: 'Weil sie nie auf dem Kontoauszug erscheint, wird sie regelmäßig unterschätzt. Über dreißig Jahre kostet ein Unterschied von 1,3 Prozentpunkten rund ein Drittel des Endvermögens.',
    formen: ['TER', 'Total Expense Ratio', 'Kostenquote', 'laufende Kosten'],
    siehe: ['etf', 'fonds', 'trackingdifferenz'],
    thema: 'kosten-und-gebuehren',
    rechner: 'kostenrechner',
  },
  {
    slug: 'thesaurierung',
    begriff: 'Thesaurierung',
    kurz: 'Die Wiederanlage der Erträge im Fonds, statt sie auszuzahlen.',
    formen: ['thesaurierend', 'thesauriert'],
    siehe: ['ausschuettung', 'vorabpauschale', 'zinseszins'],
    thema: 'fonds',
  },
  {
    slug: 'tilgung',
    begriff: 'Tilgung',
    kurz: 'Der Teil einer Kreditrate, der die Schuld verringert – im Unterschied zum Zinsanteil, der nur die Nutzung bezahlt.',
    formen: ['tilgen', 'Tilgungsrate'],
    siehe: ['effektivzins', 'sollzins'],
    thema: 'schulden-und-kredit',
  },
  {
    slug: 'trackingdifferenz',
    begriff: 'Tracking-Differenz',
    kurz: 'Der tatsächliche Rückstand eines ETF gegenüber seinem Index über ein Jahr – die ehrlichere Zahl als die Kostenquote.',
    lang: 'Sie kann kleiner sein als die Kostenquote, wenn der Fonds Zusatzerträge erwirtschaftet, etwa aus Wertpapierleihe. Gemessen wird sie im Nachhinein, nicht versprochen.',
    formen: ['Tracking Difference', 'Trackingdifferenz'],
    siehe: ['etf', 'ter'],
    thema: 'etf',
  },
  {
    slug: 'umsatz',
    begriff: 'Umsatz',
    kurz: 'Was ein Unternehmen in einer Periode eingenommen hat, bevor Kosten abgezogen werden.',
    formen: ['Erlöse'],
    siehe: ['gewinn', 'marge', 'kuv'],
  },
  {
    slug: 'verrechnungskonto',
    begriff: 'Verrechnungskonto',
    kurz: 'Das Geldkonto, das zu einem Depot gehört und über das Käufe, Verkäufe und Ausschüttungen laufen.',
    siehe: ['depot', 'einlagensicherung'],
    thema: 'depot-und-broker',
  },
  {
    slug: 'verschuldungsgrad',
    begriff: 'Verschuldungsgrad',
    kurz: 'Das Verhältnis von Fremd- zu Eigenkapital – ein Maß dafür, wie viel Puffer ein Unternehmen bis zur Zahlungsunfähigkeit hat.',
    siehe: ['fremdkapital', 'eigenkapital'],
  },
  {
    slug: 'volatilitaet',
    begriff: 'Volatilität',
    kurz: 'Das Maß dafür, wie stark ein Kurs um seinen Mittelwert schwankt.',
    lang: 'Sie wird oft mit Risiko gleichgesetzt, und für kurze Zeiträume passt das. Über dreißig Jahre ist die größere Gefahr eine andere: nicht die Schwankung, sondern der dauerhafte Kaufkraftverlust einer Anlage, die nicht schwankt.',
    formen: ['volatil', 'Schwankungsbreite'],
    siehe: ['risikopraemie', 'korrelation', 'rendite'],
    thema: 'risiko-und-rendite',
  },
  {
    slug: 'vorabpauschale',
    begriff: 'Vorabpauschale',
    kurz: 'Ein jährlich als zugeflossen geltender Mindestertrag bei thesaurierenden Fonds, auf den Steuer anfällt, obwohl kein Geld geflossen ist.',
    lang: 'Sie sorgt dafür, dass thesaurierende und ausschüttende Fonds gleich behandelt werden. Sie ist keine zusätzliche Steuer: Beim Verkauf wird alles bereits Versteuerte vom Gewinn abgezogen. Fällt der Fonds im Jahr, fällt sie ganz aus.',
    siehe: ['thesaurierung', 'basiszins', 'abgeltungsteuer'],
    rechner: 'steuerrechner',
  },
  {
    slug: 'wertpapierleihe',
    begriff: 'Wertpapierleihe',
    kurz: 'Das befristete Verleihen von Wertpapieren gegen Gebühr und Sicherheiten – bei Fonds eine Quelle von Zusatzerträgen und ein zusätzliches Risiko.',
    siehe: ['etf', 'trackingdifferenz'],
    thema: 'etf',
  },
  {
    slug: 'zertifikat',
    begriff: 'Zertifikat',
    kurz: 'Eine Schuldverschreibung einer Bank, deren Rückzahlung von der Entwicklung eines anderen Werts abhängt.',
    lang: 'Anders als bei einem Fonds gibt es kein Sondervermögen: Geht die Bank pleite, ist das Geld verloren, egal wie sich der zugrunde liegende Wert entwickelt hat.',
    formen: ['Zertifikate'],
    siehe: ['emittentenrisiko', 'derivat', 'sondervermoegen'],
    thema: 'derivat',
  },
  {
    slug: 'derivat',
    begriff: 'Derivat',
    kurz: 'Ein Finanzprodukt, dessen Wert sich von einem anderen Wert ableitet – von einer Aktie, einem Index, einem Rohstoff.',
    formen: ['Derivate'],
    siehe: ['hebel', 'zertifikat', 'option'],
    thema: 'derivat',
  },
  {
    slug: 'option',
    begriff: 'Option',
    kurz: 'Das Recht, aber nicht die Pflicht, etwas zu einem festgelegten Preis zu kaufen oder zu verkaufen.',
    formen: ['Optionen', 'Optionsschein', 'Optionsscheine'],
    siehe: ['derivat', 'hebel'],
    thema: 'option',
  },
  {
    slug: 'zinseszins',
    begriff: 'Zinseszins',
    kurz: 'Zinsen auf bereits gutgeschriebene Zinsen – der Grund, warum sich Kapital über lange Zeiträume nicht linear, sondern beschleunigt vermehrt.',
    formen: ['Zinseszinseffekt'],
    siehe: ['rendite', 'thesaurierung'],
    thema: 'zinseszins',
    rechner: 'zinsrechner',
  },
]

/** Ein Eintrag nach seinem Slug. */
export function getGlossareintrag(slug: string): Glossareintrag | undefined {
  return glossar.find((eintrag) => eintrag.slug === slug)
}
