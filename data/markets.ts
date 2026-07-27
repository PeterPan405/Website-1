/**
 * Demo-Datensatz für Wechselkurse und Indizes.
 *
 * ACHTUNG: Das sind bewusst keine echten Marktdaten. Die Kursverläufe werden
 * aus den unten definierten Startwerten deterministisch erzeugt (siehe
 * `lib/market-series.ts`), damit Server-Rendering und Browser identische
 * Zahlen sehen und Builds reproduzierbar bleiben.
 *
 * Um echte Daten anzubinden, muss ausschließlich `lib/markets.ts` angepasst
 * werden – die Signaturen dort sind bereits asynchron.
 */

export type MarketKind = 'fx' | 'index' | 'commodity'

/**
 * Bezeichnungen je Gattung.
 *
 * Ein Mapping statt verstreuter Abfragen: Bei zwei Gattungen genügte ein
 * Fragezeichen-Operator, bei drei wird daraus an jeder Stelle eine
 * verschachtelte Bedingung. Kommt eine vierte hinzu, meldet TypeScript hier
 * die Lücke – statt sie stillschweigend als „Index“ auszugeben.
 */
export const marketKindMeta: Record<
  MarketKind,
  { short: string; long: string; plural: string }
> = {
  fx: { short: 'Wechselkurs', long: 'Währungspaar', plural: 'Wechselkurse' },
  index: { short: 'Index', long: 'Aktienindex', plural: 'Indizes' },
  commodity: { short: 'Rohstoff', long: 'Rohstoff', plural: 'Rohstoffe' },
}

/** Auswählbare Zeiträume auf den Detailseiten. */
/**
 * Zeiträume der Charts.
 *
 * „Ein Handelstag“ gab es einmal und ist entfallen. Alle Quellen liefern einen
 * Wert je Handelstag, keinen fortlaufenden Handel. Aus
 * einem Punkt pro Tag lässt sich kein Intraday-Verlauf bilden; die Demo-Daten
 * hatten einen erzeugt, echte Daten geben ihn nicht her. Eine Kurve zu zeichnen,
 * für die keine Werte vorliegen, wäre genau die Schönfärberei, die diese Seite
 * sonst vermeidet.
 */
export type MarketRange = '1W' | '1M' | '1J' | '5J'

export const marketRanges: readonly MarketRange[] = ['1W', '1M', '1J', '5J']

export const marketRangeLabels: Record<MarketRange, string> = {
  '1W': 'Eine Woche',
  '1M': 'Ein Monat',
  '1J': 'Ein Jahr',
  '5J': 'Fünf Jahre',
}

/** Ein Punkt einer Zeitreihe. `t` ist ein ISO-8601-Zeitstempel. */
export interface SeriesPoint {
  t: string
  value: number
}

export interface MarketInstrument {
  /** URL-Slug und eindeutige ID, z. B. `eur-usd`. */
  symbol: string
  /** Kurzform für Tabellen und Kacheln, z. B. `EUR/USD`. */
  ticker: string
  /** Ausgeschriebener Name, z. B. `Euro / US-Dollar`. */
  name: string
  kind: MarketKind
  /** Einheit hinter dem Wert: Währungscode oder `Punkte`. */
  unit: string
  /** Anzahl Nachkommastellen in der Darstellung. */
  decimals: number
  /** Ein Satz für Übersichten und Kacheln. */
  summary: string
  /**
   * Meta-Description der Detailseite.
   *
   * Eigenes Feld statt einer Zusammensetzung aus `summary` plus Standardtext:
   * Nur so lässt sich der Zielkorridor von 110 bis 165 Zeichen pro Instrument
   * tatsächlich einhalten.
   */
  metaDescription: string
  /** Ausführliche Erklärung für die Detailseite (je Absatz ein Eintrag). */
  description: string[]
  /** Passende Lernthemen (Slugs aus `data/learn`). */
  relatedTopics: string[]
}

/** Parameter der deterministischen Kursgenerierung. */
export interface MarketSeed {
  /** Wert am Anfang des Fünfjahreszeitraums. */
  startValue: number
  /** Erwartete jährliche Veränderung, z. B. 0.07 für +7 %. */
  annualDrift: number
  /** Jährliche Schwankungsbreite (Standardabweichung). */
  annualVolatility: number
  /** Startwert des Zufallsgenerators – hält die Reihe reproduzierbar. */
  seed: number
}

export interface MarketDefinition extends MarketInstrument {
  seed: MarketSeed
}

/**
 * Stand der Demo-Daten.
 *
 * Fest verdrahtet, damit jeder Build dieselben Zahlen erzeugt. Bei echten
 * Daten liefert die API diesen Zeitstempel mit.
 */
export const MARKET_DATA_AS_OF = '2026-07-24T17:30:00+02:00'

/** Woher die Kurse eines Instruments kommen. */
export type MarketSourceRef =
  /** Devisen: Euro-Referenzkurse der EZB, angefragt über den Währungscode. */
  | { provider: 'ecb'; currency: string }
  /**
   * Indizes und Edelmetalle.
   *
   * Zwei Anbieter, weil einer allein sich als zu wenig erwiesen hat: Der erste
   * Versuch lief über Stooq und scheiterte an einer Bot-Prüfung, die einem
   * Server statt der Daten eine HTML-Seite schickt. Yahoo braucht keinen
   * Schlüssel und ist deshalb der Regelweg; Twelve Data braucht einen, ist dafür
   * aber eine dokumentierte Schnittstelle mit Nutzungsbedingungen.
   *
   * Welcher genommen wird, entscheidet allein das Vorhandensein des Schlüssels
   * in `TWELVEDATA_API_KEY` – ohne Codeänderung.
   */
  | { provider: 'market'; yahoo: string; twelvedata: string }

/**
 * Zuordnung der Instrumente zu ihrer Datenquelle.
 *
 * Wird vom Abruf-Skript gelesen (`scripts/kurse-abrufen.ts`). Ein Instrument
 * ohne Eintrag bekommt keine echten Kurse und bleibt bei den gekennzeichneten
 * Demo-Daten – das ist kein Versehen, sondern der vorgesehene Zustand für
 * Instrumente ohne frei zugängliche Quelle.
 */
export const marketSources: Record<string, MarketSourceRef> = {
  'eur-usd': { provider: 'ecb', currency: 'USD' },
  'eur-cny': { provider: 'ecb', currency: 'CNY' },
  'eur-chf': { provider: 'ecb', currency: 'CHF' },
  'eur-gbp': { provider: 'ecb', currency: 'GBP' },
  'eur-jpy': { provider: 'ecb', currency: 'JPY' },

  dax: { provider: 'market', yahoo: '^GDAXI', twelvedata: 'DAX' },
  sp500: { provider: 'market', yahoo: '^GSPC', twelvedata: 'SPX' },
  'euro-stoxx-50': { provider: 'market', yahoo: '^STOXX50E', twelvedata: 'STOXX50E' },
  'nasdaq-100': { provider: 'market', yahoo: '^NDX', twelvedata: 'NDX' },

  /*
    Gold und Silber als Terminkontrakt der COMEX, nicht als Kassakurs.

    Der Unterschied liegt üblicherweise im niedrigen einstelligen
    Prozentbereich, die Abdeckung bei den freien Quellen ist dafür deutlich
    besser. Twelve Data liefert dagegen den Kassakurs – deshalb stehen dort
    andere Kennungen. Beide Angaben sind vertretbar, aber sie sind nicht
    dieselbe Zahl; ein Anbieterwechsel ist an einem kleinen Sprung erkennbar.
  */
  gold: { provider: 'market', yahoo: 'GC=F', twelvedata: 'XAU/USD' },
  silber: { provider: 'market', yahoo: 'SI=F', twelvedata: 'XAG/USD' },

  /*
    `msci-world` fehlt hier mit Absicht.

    Der Index ist Eigentum von MSCI und in keiner frei zugänglichen Quelle
    enthalten. Naheliegend wäre, ersatzweise den Kurs eines ETF auf diesen Index
    zu nehmen – das wäre aber eine andere Zahl in einer anderen Größenordnung
    (rund 90 Euro je Anteil gegen rund 4.000 Indexpunkte) unter derselben
    Überschrift. Solange die Kachel „MSCI World“ heißt, bleibt sie bei den
    gekennzeichneten Demo-Daten.
  */
}

export const marketDefinitions: MarketDefinition[] = [
  {
    symbol: 'eur-usd',
    ticker: 'EUR/USD',
    name: 'Euro / US-Dollar',
    kind: 'fx',
    unit: 'USD',
    decimals: 4,
    summary:
      'Das meistgehandelte Währungspaar der Welt: Wie viele US-Dollar ein Euro kostet.',
    metaDescription:
      'Wie viele US-Dollar ein Euro kostet – das meistgehandelte Währungspaar der Welt. Mit Chart von 1 Tag bis 5 Jahren und Erklärung der Kurstreiber.',
    description: [
      'EUR/USD gibt an, wie viele US-Dollar du für einen Euro bekommst. Steht der Kurs bei 1,0850, kostet ein Euro 1,0850 US-Dollar. Steigt der Kurs, wird der Euro gegenüber dem Dollar stärker – die erste Währung im Paar ist immer die, deren Preis gemessen wird.',
      'Das Paar ist der mit Abstand umsatzstärkste Devisenmarkt überhaupt. Bewegt wird es vor allem vom Zinsunterschied zwischen Europäischer Zentralbank und US-Notenbank: Wer höhere Zinsen bietet, zieht Kapital an und stützt damit seine Währung. Dazu kommen Konjunkturdaten, Inflationszahlen und die Nachfrage nach dem Dollar als sicherer Hafen in Krisen.',
      'Für Privatanleger ist der Kurs auch dann relevant, wenn sie gar keine Devisen handeln: Wer einen ETF auf US-Aktien hält, trägt automatisch das Dollar-Risiko mit. Ein fallender Dollar schmälert die Rendite in Euro, ein steigender erhöht sie.',
    ],
    relatedTopics: ['wie-funktioniert-der-markt', 'aktien-laender-branchen'],
    seed: { startValue: 1.181, annualDrift: -0.017, annualVolatility: 0.075, seed: 1201 },
  },
  {
    symbol: 'eur-cny',
    ticker: 'EUR/CNY',
    name: 'Euro / Chinesischer Renminbi',
    kind: 'fx',
    unit: 'CNY',
    decimals: 4,
    summary:
      'Wie viele Renminbi ein Euro kostet – ein Kurs, den die chinesische Notenbank aktiv steuert.',
    metaDescription:
      'Wie viele Renminbi ein Euro kostet – ein Kurs, den Chinas Notenbank aktiv steuert. Mit Chart von 1 Tag bis 5 Jahren und Erklärung.',
    description: [
      'EUR/CNY zeigt, wie viele chinesische Renminbi (auch Yuan genannt) ein Euro kostet. Die Währung trägt zwei Namen: Renminbi ist die Währung, Yuan die Einheit – vergleichbar mit „Pfund Sterling“ und „Pfund“.',
      'Anders als Euro oder Dollar schwankt der Renminbi nicht völlig frei. Die chinesische Notenbank legt jeden Handelstag einen Referenzkurs fest und lässt den Kurs nur innerhalb eines Bandes darum schwanken. Deshalb verlaufen die Kurse ruhiger als bei frei gehandelten Paaren, können sich aber sprunghaft ändern, wenn die Notenbank ihr Ziel verschiebt.',
      'Für europäische Anleger ist der Kurs vor allem über den Umweg der Unternehmensgewinne wichtig: Viele deutsche Industriekonzerne erzielen einen erheblichen Teil ihres Umsatzes in China. Ein schwacher Renminbi verringert diese Umsätze, sobald sie in Euro umgerechnet werden.',
    ],
    relatedTopics: ['aktien-laender-branchen', 'wie-funktioniert-der-markt'],
    seed: { startValue: 7.63, annualDrift: 0.011, annualVolatility: 0.055, seed: 2202 },
  },
  {
    symbol: 'eur-chf',
    ticker: 'EUR/CHF',
    name: 'Euro / Schweizer Franken',
    kind: 'fx',
    unit: 'CHF',
    decimals: 4,
    summary:
      'Der Franken gilt als sicherer Hafen – in Krisen fällt dieser Kurs typischerweise.',
    metaDescription:
      'Wie viele Schweizer Franken ein Euro kostet. Warum der Franken in Krisen steigt, mit Chart von 1 Tag bis 5 Jahren und Einordnung.',
    description: [
      'EUR/CHF gibt an, wie viele Schweizer Franken ein Euro kostet. Fällt der Kurs, wird der Franken teurer – der Euro also schwächer.',
      'Der Franken ist eine klassische „Fluchtwährung“. Wenn Anleger nervös werden, verkaufen sie riskantere Anlagen und kaufen Franken, weil die Schweiz als politisch und finanziell stabil gilt. Deshalb sinkt EUR/CHF in Krisenphasen häufig, während Aktienkurse fallen.',
      'Diese Stärke ist für die Schweizer Wirtschaft ein Problem: Ein teurer Franken macht Exporte im Ausland teurer. Die Schweizerische Nationalbank hat deshalb über Jahre am Devisenmarkt eingegriffen – ein Lehrstück dafür, dass Wechselkurse nicht allein von Angebot und Nachfrage privater Marktteilnehmer bestimmt werden.',
    ],
    relatedTopics: ['wie-funktioniert-der-markt', 'worauf-achten-einsteiger'],
    seed: { startValue: 1.081, annualDrift: -0.021, annualVolatility: 0.045, seed: 3303 },
  },
  {
    symbol: 'eur-gbp',
    ticker: 'EUR/GBP',
    name: 'Euro / Britisches Pfund',
    kind: 'fx',
    unit: 'GBP',
    decimals: 4,
    summary:
      'Der Kurs zwischen Euro und Pfund Sterling – geprägt von Zins- und Handelspolitik.',
    metaDescription:
      'Wie viele Britische Pfund ein Euro kostet. Mit Chart von 1 Tag bis 5 Jahren und Erklärung, warum Zins- und Handelspolitik den Kurs bewegen.',
    description: [
      'EUR/GBP zeigt, wie viele Britische Pfund ein Euro kostet. Ein Kurs von 0,8500 bedeutet: Ein Euro ist 85 Pence wert.',
      'Weil das Vereinigte Königreich einer der wichtigsten Handelspartner der EU ist, reagiert das Paar deutlich auf handelspolitische Nachrichten und auf Zinsentscheidungen der Bank of England. Bewegungen sind meist kleiner als bei EUR/USD, weil beide Wirtschaftsräume ähnlichen Konjunkturzyklen folgen.',
      'Britische Aktien und Staatsanleihen notieren in Pfund. Wer sie kauft, geht damit zwei Wetten gleichzeitig ein: auf die Wertentwicklung des Papiers und auf den Wechselkurs.',
    ],
    relatedTopics: ['staatsanleihe', 'aktien-laender-branchen'],
    seed: {
      startValue: 0.8595,
      annualDrift: -0.004,
      annualVolatility: 0.052,
      seed: 4404,
    },
  },
  {
    symbol: 'eur-jpy',
    ticker: 'EUR/JPY',
    name: 'Euro / Japanischer Yen',
    kind: 'fx',
    unit: 'JPY',
    decimals: 2,
    summary:
      'Ein Paar, das stark am Zinsunterschied hängt – Japan hielt die Zinsen jahrzehntelang extrem niedrig.',
    metaDescription:
      'Wie viele Yen ein Euro kostet – ein Paar, das stark am Zinsunterschied hängt. Mit Chart von 1 Tag bis 5 Jahren und Einordnung.',
    description: [
      'EUR/JPY gibt an, wie viele japanische Yen ein Euro kostet. Weil ein Yen ein sehr kleiner Betrag ist, liegt der Kurs bei über 100 – üblich sind hier zwei Nachkommastellen.',
      'Kaum ein Währungspaar zeigt den Einfluss von Zinsen so deutlich. Japan hielt seinen Leitzins jahrzehntelang bei oder unter null. Solange in Europa deutlich höhere Zinsen zu holen waren, lieh sich Kapital günstig in Yen und wanderte in höher rentierende Währungen ab – der Yen wurde schwächer. Dreht die japanische Notenbank ihre Politik, kann sich das schnell umkehren.',
      'Solche zinsgetriebenen Positionen können sich abrupt auflösen. Für Einsteiger ist EUR/JPY vor allem ein Beispiel dafür, wie schnell scheinbar ruhige Trends kippen, wenn eine Notenbank ihren Kurs ändert.',
    ],
    relatedTopics: ['derivat', 'wie-funktioniert-der-markt'],
    seed: { startValue: 129.4, annualDrift: 0.041, annualVolatility: 0.095, seed: 5505 },
  },
  {
    symbol: 'dax',
    ticker: 'DAX',
    name: 'DAX (Deutscher Aktienindex)',
    kind: 'index',
    unit: 'Punkte',
    decimals: 2,
    summary: 'Die 40 größten börsennotierten Unternehmen Deutschlands in einer Kennzahl.',
    metaDescription:
      'Der Stand der 40 größten deutschen Börsenunternehmen. Mit Chart von 1 Tag bis 5 Jahren und Erklärung, warum der DAX Dividenden mitrechnet.',
    description: [
      'Der DAX bündelt die 40 größten und liquidesten börsennotierten Unternehmen Deutschlands. Sein Stand in Punkten ist keine Geldsumme, sondern ein Vergleichswert: Er zeigt, wie sich ein festgelegter Korb dieser Aktien seit dem Startdatum entwickelt hat.',
      'Ein wichtiges Detail unterscheidet den DAX von vielen anderen Indizes: Er wird standardmäßig als Performance-Index berechnet, das heißt Dividenden werden rechnerisch wieder angelegt. Der S&P 500 wird dagegen üblicherweise als Kursindex ohne Dividenden dargestellt. Ein direkter Vergleich der Prozentzahlen bevorteilt deshalb den DAX – wer korrekt vergleichen will, muss denselben Index-Typ wählen.',
      'Die Gewichtung richtet sich nach dem frei handelbaren Börsenwert, gedeckelt bei 10 Prozent je Unternehmen. Trotz 40 Titeln ist der DAX kein breit gestreutes Weltportfolio: Er hängt stark an Industrie, Autobau, Chemie und Software und damit am Exportgeschäft einer einzigen Volkswirtschaft.',
    ],
    relatedTopics: ['aktie', 'etf', 'aktien-laender-branchen'],
    seed: { startValue: 15720, annualDrift: 0.073, annualVolatility: 0.185, seed: 6606 },
  },
  {
    symbol: 'sp500',
    ticker: 'S&P 500',
    name: 'S&P 500',
    kind: 'index',
    unit: 'Punkte',
    decimals: 2,
    summary:
      '500 große US-Unternehmen – der wichtigste Maßstab für den amerikanischen Aktienmarkt.',
    metaDescription:
      '500 große US-Unternehmen als Maßstab des amerikanischen Aktienmarkts. Mit Chart von 1 Tag bis 5 Jahren und Hinweis zum Dollar-Risiko.',
    description: [
      'Der S&P 500 umfasst 500 große, in den USA börsennotierte Unternehmen und deckt damit einen erheblichen Teil des gesamten US-Aktienmarkts ab. Er gilt als Standardmaßstab, an dem sich Fondsmanager messen lassen.',
      'Die Gewichtung erfolgt nach Börsenwert. Das führt dazu, dass die größten Technologiekonzerne zusammen einen sehr großen Anteil des Index ausmachen. Wer den S&P 500 kauft, kauft also keine 500 gleich großen Anteile, sondern ein Portfolio mit deutlichem Schwerpunkt bei wenigen sehr großen Namen.',
      'Für Anleger im Euroraum kommt das Wechselkursrisiko hinzu: Der Index notiert in Dollar. Eine Wertsteigerung von 10 Prozent in Dollar kann in Euro deutlich kleiner ausfallen, wenn der Dollar im gleichen Zeitraum schwächer wird.',
    ],
    relatedTopics: ['etf', 'aktie', 'aktien-laender-branchen'],
    seed: { startValue: 4390, annualDrift: 0.098, annualVolatility: 0.165, seed: 7707 },
  },
  {
    symbol: 'msci-world',
    ticker: 'MSCI World',
    name: 'MSCI World',
    kind: 'index',
    unit: 'Punkte',
    decimals: 2,
    summary:
      'Rund 1.400 Unternehmen aus 23 Industrieländern – die Basis vieler Welt-ETFs.',
    metaDescription:
      'Rund 1.400 Unternehmen aus 23 Industrieländern – die Basis vieler Welt-ETFs. Mit Chart von 1 Tag bis 5 Jahren und Erklärung der Gewichtung.',
    description: [
      'Der MSCI World bündelt große und mittelgroße Unternehmen aus 23 Industrieländern. Er ist der Index, auf dem sehr viele als „Welt-ETF“ verkaufte Produkte aufbauen.',
      'Der Name führt allerdings leicht in die Irre: Schwellenländer wie China, Indien oder Brasilien sind nicht enthalten, dafür gibt es den MSCI Emerging Markets beziehungsweise den MSCI ACWI. Weil auch hier nach Börsenwert gewichtet wird, machen US-Unternehmen den größten Teil des Index aus – ein „Welt“-Investment ist damit vor allem ein US-Investment mit Beimischung.',
      'Für Einsteiger ist der MSCI World trotzdem der übliche Ausgangspunkt: Ein einzelnes Produkt streut über Hunderte Unternehmen, Branchen und mehrere Währungsräume und nimmt damit dem Einzelaktienrisiko die Spitze.',
    ],
    relatedTopics: ['etf', 'fonds', 'aktien-laender-branchen'],
    seed: { startValue: 2985, annualDrift: 0.086, annualVolatility: 0.15, seed: 8808 },
  },
  {
    symbol: 'euro-stoxx-50',
    ticker: 'Euro Stoxx 50',
    name: 'Euro Stoxx 50',
    kind: 'index',
    unit: 'Punkte',
    decimals: 2,
    summary:
      'Die 50 größten Unternehmen der Eurozone – ein Index ohne Währungsrisiko für Euro-Anleger.',
    metaDescription:
      'Die 50 größten Unternehmen der Eurozone – ohne Währungsrisiko für Euro-Anleger. Mit Chart von 1 Tag bis 5 Jahren und Einordnung.',
    description: [
      'Der Euro Stoxx 50 enthält 50 sehr große Unternehmen aus Ländern der Eurozone. Für Anleger, die in Euro rechnen, ist er insofern besonders: Alle enthaltenen Aktien notieren in Euro, ein Wechselkursrisiko entsteht auf Index-Ebene nicht.',
      'Zu verwechseln ist er leicht mit dem Stoxx Europe 600, der deutlich breiter aufgestellt ist und auch Länder außerhalb der Eurozone wie die Schweiz, Großbritannien oder Schweden abdeckt.',
      'Mit nur 50 Titeln aus wenigen Ländern ist die Streuung überschaubar; Banken, Industrie und Luxusgüter prägen das Bild. Als Ergänzung zu einem globalen Index kann er die Europa-Quote erhöhen, als Alleinanlage bleibt er ein konzentriertes Investment.',
    ],
    relatedTopics: ['aktien-laender-branchen', 'etf'],
    seed: { startValue: 4085, annualDrift: 0.066, annualVolatility: 0.175, seed: 9909 },
  },
  {
    symbol: 'nasdaq-100',
    ticker: 'Nasdaq 100',
    name: 'Nasdaq 100',
    kind: 'index',
    unit: 'Punkte',
    decimals: 2,
    summary:
      'Die 100 größten Nicht-Finanzunternehmen der Nasdaq – technologielastig und entsprechend schwankungsfreudig.',
    metaDescription:
      'Die 100 größten Nicht-Finanzunternehmen der Nasdaq – technologielastig und schwankungsfreudig. Mit Chart von 1 Tag bis 5 Jahren.',
    description: [
      'Der Nasdaq 100 umfasst die 100 größten Unternehmen der US-Börse Nasdaq, die keine Finanzdienstleister sind. In der Praxis ist er ein Technologie-Index: Software, Halbleiter, Internetplattformen und Biotechnologie dominieren.',
      'Diese Konzentration erklärt seine Kursausschläge. In Aufschwungphasen liegt er oft deutlich vor dem breiten Markt, in Abschwüngen fällt er entsprechend tiefer. Ein Blick auf die Jahre 2000 bis 2002 zeigt, wie lange die Erholung nach dem Platzen einer Technologieblase dauern kann.',
      'Der Index ist damit ein gutes Beispiel für den Zusammenhang von Konzentration und Risiko: Höhere erwartete Rendite bekommt man am Kapitalmarkt nicht geschenkt, sondern als Ausgleich für größere Schwankungen.',
    ],
    relatedTopics: ['aktien-laender-branchen', 'groesste-crashes', 'etf'],
    seed: { startValue: 14980, annualDrift: 0.121, annualVolatility: 0.235, seed: 10110 },
  },
  {
    symbol: 'gold',
    ticker: 'Gold',
    name: 'Gold (Feinunze)',
    kind: 'commodity',
    unit: 'USD',
    decimals: 2,
    summary:
      'Der Preis einer Feinunze Gold in US-Dollar – seit Jahrtausenden Wertaufbewahrung, ohne laufenden Ertrag.',
    metaDescription:
      'Der Goldpreis je Feinunze in US-Dollar. Mit Chart von 1 Tag bis 5 Jahren und Erklärung, warum Gold keine Zinsen zahlt und trotzdem gefragt ist.',
    description: [
      'Gold wird international je **Feinunze** gehandelt – 31,1035 Gramm – und fast immer in US-Dollar notiert. Für den Preis in Euro sind deshalb zwei Bewegungen maßgeblich: die des Goldpreises selbst und die des Wechselkurses EUR/USD. Steigt der Dollar, steigt der Goldpreis in Euro auch dann, wenn sich in Dollar gerechnet nichts getan hat.',
      'Der entscheidende Unterschied zu Aktien und Anleihen: Gold zahlt weder Zinsen noch Dividenden. Der gesamte Ertrag muss aus dem Preis kommen. Daraus folgt eine bemerkenswerte Regelmäßigkeit – je höher die realen Zinsen, also der Zins abzüglich Inflation, desto teurer wird das Halten von Gold, weil man auf sicheren Zinsertrag verzichtet. Fallen die realen Zinsen, entfällt dieser Nachteil und Gold wird attraktiver.',
      'Die Nachfrage teilt sich grob in Schmuck, Notenbankkäufe, industrielle Verwendung und Anlage. Der Angebotsseite steht eine Besonderheit gegenüber: Praktisch alles jemals geförderte Gold existiert noch. Die jährliche Minenförderung erhöht den vorhandenen Bestand nur um ein bis zwei Prozent, weshalb der Preis fast ausschließlich von der Nachfrage bestimmt wird – anders als bei Rohstoffen, die verbraucht werden.',
    ],
    relatedTopics: [
      'rohstoffe',
      'wie-funktioniert-der-markt',
      'worauf-achten-einsteiger',
    ],
    seed: { startValue: 2210, annualDrift: 0.086, annualVolatility: 0.145, seed: 11211 },
  },
  {
    symbol: 'silber',
    ticker: 'Silber',
    name: 'Silber (Feinunze)',
    kind: 'commodity',
    unit: 'USD',
    decimals: 2,
    summary:
      'Der Preis einer Feinunze Silber in US-Dollar – halb Edelmetall, halb Industrierohstoff und deutlich schwankungsfreudiger als Gold.',
    metaDescription:
      'Der Silberpreis je Feinunze in US-Dollar. Mit Chart von 1 Tag bis 5 Jahren und Erklärung, warum Silber stärker schwankt als Gold.',
    description: [
      'Silber wird wie Gold je Feinunze in US-Dollar notiert, ist aber ein anderes Gut. Rund die Hälfte der Nachfrage stammt aus der Industrie: Photovoltaik, Elektronik, Löttechnik und Medizin. Damit hängt der Preis nicht nur an der Anlagenachfrage, sondern auch an der Konjunktur – ein Abschwung trifft Silber doppelt.',
      'Silber schwankt deutlich stärker als Gold. Der Markt ist um ein Vielfaches kleiner, gemessen am gehandelten Wert, weshalb dieselbe Geldsumme den Preis stärker bewegt. Wer Gold und Silber vergleicht, sieht dieselbe Richtung bei größerem Ausschlag – in beide Richtungen.',
      'Eine gängige Kennzahl ist die **Gold-Silber-Ratio**: wie viele Unzen Silber eine Unze Gold kosten. Sie schwankt historisch etwa zwischen 40 und 100. Als Handelssignal taugt sie wenig, als Einordnung schon: Ein hoher Wert zeigt, dass Silber gegenüber Gold billig ist – was einen Grund haben kann und nicht automatisch eine Gelegenheit ist.',
    ],
    relatedTopics: ['rohstoffe', 'wie-funktioniert-der-markt', 'aktien-laender-branchen'],
    seed: { startValue: 25.4, annualDrift: 0.079, annualVolatility: 0.265, seed: 12312 },
  },
]

/** Reihenfolge für Übersichten: Kurse, Indizes, Rohstoffe. */
export const featuredSymbols = ['eur-usd', 'dax', 'sp500', 'gold'] as const
