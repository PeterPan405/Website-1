/*
  Bewusst relativ statt über den Alias `@/`.

  Diese Datei wird nicht nur von Next geladen, sondern auch von
  `scripts/kurse-abrufen.ts` mit blankem Node. Dort gibt es keine
  Pfadauflösung für `@/`, und der Abruf brach mit ERR_MODULE_NOT_FOUND ab –
  seit dem Tag, an dem die Aktienliste hierher ausgelagert wurde. Sichtbar
  war das nur daran, dass die 400 neuen Aktien keine echten Kurse bekamen.
*/
import { weitereAktien, weitereAktienQuellen } from './markets-aktien.ts'

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

export type MarketKind = 'fx' | 'index' | 'stock' | 'commodity' | 'crypto' | 'etf'

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
  stock: { short: 'Aktie', long: 'Einzelaktie', plural: 'Einzelaktien' },
  crypto: {
    short: 'Kryptowährung',
    long: 'Kryptowährung',
    plural: 'Kryptowährungen',
  },
  etf: { short: 'ETF', long: 'Indexfonds (ETF)', plural: 'ETFs' },
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
  /**
   * Branche einer Aktie, z. B. `Halbleiter`.
   *
   * Nur bei `kind: 'stock'` gesetzt – ein Währungspaar hat keine Branche, und
   * ein leerer String wäre dort eine Aussage, die niemand gemeint hat.
   *
   * Die Einteilung ist die dieser Website und keine amtliche: Es gibt mit GICS
   * und ICB zwei etablierte Systeme, beide sind lizenzpflichtig und beide
   * ordnen dieselbe Firma gelegentlich verschieden ein. Amazon ist Handel oder
   * Technologie, je nachdem, wen man fragt. Die Zuordnung hier ist deshalb als
   * Suchhilfe gedacht und wird auf den Branchenseiten ausdrücklich so genannt.
   *
   * Geschrieben wird sie an zwei Stellen: für die breite Auswahl von
   * `scripts/aktien-erzeugen.ts` aus `data/aktien-liste.txt`, für die hier von
   * Hand geführten Titel im Eintrag selbst.
   */
  branche?: string
  /**
   * Sitzland einer Aktie als ISO-3166-Zahl, z. B. `840` für die USA.
   *
   * Entscheidend für die Quellensteuer, und deshalb **nicht** aus der Währung
   * oder der Börse abzuleiten: Shell notiert in London in Pfund, hat den Sitz
   * aber im Vereinigten Königreich und schüttet ohne Quellensteuer aus –
   * anders als vor dem Wegzug aus den Niederlanden. Stellantis notiert in New
   * York in Dollar und sitzt in Amsterdam. Wer nach der Börse ginge, käme bei
   * beiden auf den falschen Steuersatz.
   *
   * Nur bei `kind: 'stock'` gesetzt. Für die breite Auswahl kommt der Wert aus
   * `data/aktien-liste.txt`, für die hier geführten Titel steht er im Eintrag.
   */
  sitzland?: string
  /**
   * Kennnummer eines Fonds (ISIN), z. B. `IE00B4L5Y983`.
   *
   * Nur bei `kind: 'etf'`. Sie ist die einzige Angabe, unter der sich ein Fonds
   * zweifelsfrei nachschlagen lässt: Ein Fonds kann an mehreren Börsen unter
   * verschiedenen Kürzeln gehandelt werden, und derselbe Anbieter führt
   * Varianten mit gleichem Namen, die Erträge einmal ausschütten und einmal
   * ansammeln.
   */
  isin?: string
  /**
   * Wie der Fonds mit seinen Erträgen umgeht.
   *
   * `ansammelnd` legt Dividenden und Zinsen automatisch wieder an,
   * `ausschüttend` überweist sie. Steuerlich macht das in Deutschland weniger
   * Unterschied, als oft angenommen wird – die Vorabpauschale sorgt dafür,
   * dass auch beim ansammelnden Fonds jährlich etwas fällig wird. Für die
   * Handhabung macht es sehr wohl einen Unterschied.
   */
  ertragsverwendung?: 'ansammelnd' | 'ausschüttend'
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
  // Die breite Aktienauswahl aus `data/aktien-liste.txt`. Zuerst, damit ein
  // hier unten von Hand gesetzter Eintrag sie überschreiben kann.
  ...weitereAktienQuellen,

  'eur-usd': { provider: 'ecb', currency: 'USD' },
  'eur-cny': { provider: 'ecb', currency: 'CNY' },
  'eur-chf': { provider: 'ecb', currency: 'CHF' },
  'eur-gbp': { provider: 'ecb', currency: 'GBP' },
  'eur-jpy': { provider: 'ecb', currency: 'JPY' },

  dax: { provider: 'market', yahoo: '^GDAXI', twelvedata: 'DAX' },
  sp500: { provider: 'market', yahoo: '^GSPC', twelvedata: 'SPX' },
  'euro-stoxx-50': { provider: 'market', yahoo: '^STOXX50E', twelvedata: 'STOXX50E' },
  'nasdaq-100': { provider: 'market', yahoo: '^NDX', twelvedata: 'NDX' },
  'dow-jones': { provider: 'market', yahoo: '^DJI', twelvedata: 'DJI' },
  'russell-2000': { provider: 'market', yahoo: '^RUT', twelvedata: 'RUT' },
  /*
    Die deutschen Nebenwerte-Indizes und drei europäische Leitindizes.

    Sie fehlten bis Juli 2026, und die Lücke war bei einer deutschsprachigen
    Seite die auffälligste: Unter den geführten Aktien stehen deutsche
    Mittelständler, aber der Index, in dem sie notieren, gab es hier nicht –
    für den Russell 2000 mit US-Nebenwerten dagegen schon.
  */
  /*
    Die ETFs.

    Sie werden über ihr Xetra-Kürzel abgefragt – dieselbe Notierung, unter der
    sie in Deutschland gehandelt werden, und damit in Euro. Ein Fonds ist an
    mehreren Börsen unter verschiedenen Kürzeln zu haben; genommen wird die
    Heimatbörse der Leser dieser Seite.

    Ob ein Kürzel stimmt, zeigt der erste Abruf: Trifft es ins Leere, kommen
    keine Kurse, und das steht im Protokoll des Workflows. Genau deshalb steht
    hier ein Kürzel und keine geratene Kennzahl.
  */
  'etf-msci-world': { provider: 'market', yahoo: 'EUNL.DE', twelvedata: 'EUNL' },
  'etf-ftse-all-world': { provider: 'market', yahoo: 'VWCE.DE', twelvedata: 'VWCE' },
  'etf-sp500': { provider: 'market', yahoo: 'SXR8.DE', twelvedata: 'SXR8' },
  'etf-em-imi': { provider: 'market', yahoo: 'IS3N.DE', twelvedata: 'IS3N' },
  'etf-dax': { provider: 'market', yahoo: 'EXS1.DE', twelvedata: 'EXS1' },
  'etf-stoxx-600': { provider: 'market', yahoo: 'EXSA.DE', twelvedata: 'EXSA' },
  'etf-world-small-cap': { provider: 'market', yahoo: 'WSML.DE', twelvedata: 'WSML' },
  'etf-geldmarkt': { provider: 'market', yahoo: 'XEON.DE', twelvedata: 'XEON' },

  mdax: { provider: 'market', yahoo: '^MDAXI', twelvedata: 'MDAXI' },
  tecdax: { provider: 'market', yahoo: '^TECDAX', twelvedata: 'TECDAX' },
  sdax: { provider: 'market', yahoo: '^SDAXI', twelvedata: 'SDAXI' },
  smi: { provider: 'market', yahoo: '^SSMI', twelvedata: 'SSMI' },
  'cac-40': { provider: 'market', yahoo: '^FCHI', twelvedata: 'FCHI' },
  'ftse-100': { provider: 'market', yahoo: '^FTSE', twelvedata: 'FTSE' },
  'nikkei-225': { provider: 'market', yahoo: '^N225', twelvedata: 'N225' },
  kospi: { provider: 'market', yahoo: '^KS11', twelvedata: 'KS11' },
  /*
    Die sechs Leitindizes für den Indexvergleich auf den Aktienseiten.

    Jedes Kürzel ist am 31. Juli 2026 über den Läufer geprüft worden – Yahoo
    antwortete für alle sechs mit Status 200, der erwarteten Währung und dem
    ausgeschriebenen Namen (`quellen-holen.yml`). Geraten ist hier keines: Ein
    falsches Kürzel liefert stillschweigend keine Kurse, der Index fiele auf
    Demo-Daten zurück, und der Vergleich verschwände wortlos von 158
    Aktienseiten.
  */
  'nifty-50': { provider: 'market', yahoo: '^NSEI', twelvedata: 'NSEI' },
  'tsx-composite': { provider: 'market', yahoo: '^GSPTSE', twelvedata: 'GSPTSE' },
  'asx-200': { provider: 'market', yahoo: '^AXJO', twelvedata: 'AXJO' },
  ibovespa: { provider: 'market', yahoo: '^BVSP', twelvedata: 'BVSP' },
  'omx-stockholm-30': { provider: 'market', yahoo: '^OMX', twelvedata: 'OMX' },
  taiex: { provider: 'market', yahoo: '^TWII', twelvedata: 'TWII' },
  'hang-seng': { provider: 'market', yahoo: '^HSI', twelvedata: 'HSI' },

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
    Rohöl ebenfalls als Terminkontrakt – anders wird es gar nicht gehandelt.
    Einen „Kassakurs“ für ein Fass Öl gibt es nicht; was in Nachrichten als
    Ölpreis genannt wird, ist immer der nächstfällige Terminkontrakt.
  */
  brent: { provider: 'market', yahoo: 'BZ=F', twelvedata: 'BRENT' },
  wti: { provider: 'market', yahoo: 'CL=F', twelvedata: 'WTI' },
  platin: { provider: 'market', yahoo: 'PL=F', twelvedata: 'XPT/USD' },
  palladium: { provider: 'market', yahoo: 'PA=F', twelvedata: 'XPD/USD' },

  /*
    Kupfer notiert an der COMEX je Pfund, nicht je Feinunze wie die Edelmetalle
    – deshalb vier Nachkommastellen und eine eigene Einheit. Twelve Data
    rechnet in Tonnen; ein Anbieterwechsel wäre hier also kein kleiner Sprung,
    sondern ein anderer Maßstab. Steht als Warnung hier, weil es beim Umschalten
    sofort auffiele.
  */
  kupfer: { provider: 'market', yahoo: 'HG=F', twelvedata: 'COPPER' },
  erdgas: { provider: 'market', yahoo: 'NG=F', twelvedata: 'NG' },

  bitcoin: { provider: 'market', yahoo: 'BTC-USD', twelvedata: 'BTC/USD' },
  ethereum: { provider: 'market', yahoo: 'ETH-USD', twelvedata: 'ETH/USD' },
  xrp: { provider: 'market', yahoo: 'XRP-USD', twelvedata: 'XRP/USD' },

  // Die sieben schwersten Werte im S&P 500 – zusammen ein erheblicher Teil des
  // Index. Wer „weltweit gestreut“ anlegt, hält von diesen sieben mehr, als er
  // meist vermutet; genau deshalb stehen sie einzeln auf der Seite.
  apple: { provider: 'market', yahoo: 'AAPL', twelvedata: 'AAPL' },
  microsoft: { provider: 'market', yahoo: 'MSFT', twelvedata: 'MSFT' },
  nvidia: { provider: 'market', yahoo: 'NVDA', twelvedata: 'NVDA' },
  alphabet: { provider: 'market', yahoo: 'GOOGL', twelvedata: 'GOOGL' },
  amazon: { provider: 'market', yahoo: 'AMZN', twelvedata: 'AMZN' },
  meta: { provider: 'market', yahoo: 'META', twelvedata: 'META' },
  tesla: { provider: 'market', yahoo: 'TSLA', twelvedata: 'TSLA' },

  /*
    Die weiteren Einzelaktien.

    Die Twelve-Data-Kennung ist das Yahoo-Kürzel ohne Börsensuffix – dort wird
    der Handelsplatz über einen eigenen Parameter angegeben. Für die
    US-Werte stimmen beide überein, bei den europäischen und asiatischen ist
    das eine Annahme, die erst der erste Abruf mit Schlüssel bestätigt.
  */
  broadcom: { provider: 'market', yahoo: 'AVGO', twelvedata: 'AVGO' },
  amd: { provider: 'market', yahoo: 'AMD', twelvedata: 'AMD' },
  intel: { provider: 'market', yahoo: 'INTC', twelvedata: 'INTC' },
  qualcomm: { provider: 'market', yahoo: 'QCOM', twelvedata: 'QCOM' },
  'texas-instruments': { provider: 'market', yahoo: 'TXN', twelvedata: 'TXN' },
  oracle: { provider: 'market', yahoo: 'ORCL', twelvedata: 'ORCL' },
  salesforce: { provider: 'market', yahoo: 'CRM', twelvedata: 'CRM' },
  adobe: { provider: 'market', yahoo: 'ADBE', twelvedata: 'ADBE' },
  sap: { provider: 'market', yahoo: 'SAP', twelvedata: 'SAP' },
  asml: { provider: 'market', yahoo: 'ASML', twelvedata: 'ASML' },
  tsmc: { provider: 'market', yahoo: 'TSM', twelvedata: 'TSM' },
  cisco: { provider: 'market', yahoo: 'CSCO', twelvedata: 'CSCO' },
  ibm: { provider: 'market', yahoo: 'IBM', twelvedata: 'IBM' },
  palantir: { provider: 'market', yahoo: 'PLTR', twelvedata: 'PLTR' },
  netflix: { provider: 'market', yahoo: 'NFLX', twelvedata: 'NFLX' },
  uber: { provider: 'market', yahoo: 'UBER', twelvedata: 'UBER' },
  airbnb: { provider: 'market', yahoo: 'ABNB', twelvedata: 'ABNB' },
  paypal: { provider: 'market', yahoo: 'PYPL', twelvedata: 'PYPL' },
  visa: { provider: 'market', yahoo: 'V', twelvedata: 'V' },
  mastercard: { provider: 'market', yahoo: 'MA', twelvedata: 'MA' },
  'eli-lilly': { provider: 'market', yahoo: 'LLY', twelvedata: 'LLY' },
  'johnson-johnson': { provider: 'market', yahoo: 'JNJ', twelvedata: 'JNJ' },
  unitedhealth: { provider: 'market', yahoo: 'UNH', twelvedata: 'UNH' },
  abbvie: { provider: 'market', yahoo: 'ABBV', twelvedata: 'ABBV' },
  merck: { provider: 'market', yahoo: 'MRK', twelvedata: 'MRK' },
  pfizer: { provider: 'market', yahoo: 'PFE', twelvedata: 'PFE' },
  'thermo-fisher': { provider: 'market', yahoo: 'TMO', twelvedata: 'TMO' },
  'novo-nordisk': { provider: 'market', yahoo: 'NVO', twelvedata: 'NVO' },
  roche: { provider: 'market', yahoo: 'ROG.SW', twelvedata: 'ROG' },
  novartis: { provider: 'market', yahoo: 'NOVN.SW', twelvedata: 'NOVN' },
  jpmorgan: { provider: 'market', yahoo: 'JPM', twelvedata: 'JPM' },
  'bank-of-america': { provider: 'market', yahoo: 'BAC', twelvedata: 'BAC' },
  'goldman-sachs': { provider: 'market', yahoo: 'GS', twelvedata: 'GS' },
  berkshire: { provider: 'market', yahoo: 'BRK-B', twelvedata: 'BRK-B' },
  blackrock: { provider: 'market', yahoo: 'BLK', twelvedata: 'BLK' },
  allianz: { provider: 'market', yahoo: 'ALV.DE', twelvedata: 'ALV' },
  'munich-re': { provider: 'market', yahoo: 'MUV2.DE', twelvedata: 'MUV2' },
  'deutsche-bank': { provider: 'market', yahoo: 'DBK.DE', twelvedata: 'DBK' },
  ubs: { provider: 'market', yahoo: 'UBSG.SW', twelvedata: 'UBSG' },
  hsbc: { provider: 'market', yahoo: 'HSBA.L', twelvedata: 'HSBA' },
  walmart: { provider: 'market', yahoo: 'WMT', twelvedata: 'WMT' },
  costco: { provider: 'market', yahoo: 'COST', twelvedata: 'COST' },
  'procter-gamble': { provider: 'market', yahoo: 'PG', twelvedata: 'PG' },
  'coca-cola': { provider: 'market', yahoo: 'KO', twelvedata: 'KO' },
  pepsico: { provider: 'market', yahoo: 'PEP', twelvedata: 'PEP' },
  mcdonalds: { provider: 'market', yahoo: 'MCD', twelvedata: 'MCD' },
  nike: { provider: 'market', yahoo: 'NKE', twelvedata: 'NKE' },
  'home-depot': { provider: 'market', yahoo: 'HD', twelvedata: 'HD' },
  boeing: { provider: 'market', yahoo: 'BA', twelvedata: 'BA' },
  caterpillar: { provider: 'market', yahoo: 'CAT', twelvedata: 'CAT' },
  deere: { provider: 'market', yahoo: 'DE', twelvedata: 'DE' },
  'ge-aerospace': { provider: 'market', yahoo: 'GE', twelvedata: 'GE' },
  lockheed: { provider: 'market', yahoo: 'LMT', twelvedata: 'LMT' },
  rtx: { provider: 'market', yahoo: 'RTX', twelvedata: 'RTX' },
  'union-pacific': { provider: 'market', yahoo: 'UNP', twelvedata: 'UNP' },
  ups: { provider: 'market', yahoo: 'UPS', twelvedata: 'UPS' },
  exxon: { provider: 'market', yahoo: 'XOM', twelvedata: 'XOM' },
  chevron: { provider: 'market', yahoo: 'CVX', twelvedata: 'CVX' },
  shell: { provider: 'market', yahoo: 'SHEL.L', twelvedata: 'SHEL' },
  nextera: { provider: 'market', yahoo: 'NEE', twelvedata: 'NEE' },
  linde: { provider: 'market', yahoo: 'LIN', twelvedata: 'LIN' },
  siemens: { provider: 'market', yahoo: 'SIE.DE', twelvedata: 'SIE' },
  'siemens-energy': { provider: 'market', yahoo: 'ENR.DE', twelvedata: 'ENR' },
  'mercedes-benz': { provider: 'market', yahoo: 'MBG.DE', twelvedata: 'MBG' },
  bmw: { provider: 'market', yahoo: 'BMW.DE', twelvedata: 'BMW' },
  volkswagen: { provider: 'market', yahoo: 'VOW3.DE', twelvedata: 'VOW3' },
  'porsche-ag': { provider: 'market', yahoo: 'P911.DE', twelvedata: 'P911' },
  basf: { provider: 'market', yahoo: 'BAS.DE', twelvedata: 'BAS' },
  bayer: { provider: 'market', yahoo: 'BAYN.DE', twelvedata: 'BAYN' },
  'deutsche-telekom': { provider: 'market', yahoo: 'DTE.DE', twelvedata: 'DTE' },
  adidas: { provider: 'market', yahoo: 'ADS.DE', twelvedata: 'ADS' },
  airbus: { provider: 'market', yahoo: 'AIR.PA', twelvedata: 'AIR' },
  infineon: { provider: 'market', yahoo: 'IFX.DE', twelvedata: 'IFX' },
  rheinmetall: { provider: 'market', yahoo: 'RHM.DE', twelvedata: 'RHM' },
  'deutsche-post': { provider: 'market', yahoo: 'DHL.DE', twelvedata: 'DHL' },
  'merck-kgaa': { provider: 'market', yahoo: 'MRK.DE', twelvedata: 'MRK' },
  beiersdorf: { provider: 'market', yahoo: 'BEI.DE', twelvedata: 'BEI' },
  henkel: { provider: 'market', yahoo: 'HEN3.DE', twelvedata: 'HEN3' },
  eon: { provider: 'market', yahoo: 'EOAN.DE', twelvedata: 'EOAN' },
  'hannover-rueck': { provider: 'market', yahoo: 'HNR1.DE', twelvedata: 'HNR1' },
  vonovia: { provider: 'market', yahoo: 'VNA.DE', twelvedata: 'VNA' },
  lvmh: { provider: 'market', yahoo: 'MC.PA', twelvedata: 'MC' },
  hermes: { provider: 'market', yahoo: 'RMS.PA', twelvedata: 'RMS' },
  nestle: { provider: 'market', yahoo: 'NESN.SW', twelvedata: 'NESN' },
  astrazeneca: { provider: 'market', yahoo: 'AZN.L', twelvedata: 'AZN' },
  unilever: { provider: 'market', yahoo: 'ULVR.L', twelvedata: 'ULVR' },
  totalenergies: { provider: 'market', yahoo: 'TTE.PA', twelvedata: 'TTE' },
  'schneider-electric': { provider: 'market', yahoo: 'SU.PA', twelvedata: 'SU' },
  'l-oreal': { provider: 'market', yahoo: 'OR.PA', twelvedata: 'OR' },
  safran: { provider: 'market', yahoo: 'SAF.PA', twelvedata: 'SAF' },
  stellantis: { provider: 'market', yahoo: 'STLA', twelvedata: 'STLA' },
  ferrari: { provider: 'market', yahoo: 'RACE', twelvedata: 'RACE' },
  iberdrola: { provider: 'market', yahoo: 'IBE.MC', twelvedata: 'IBE' },
  santander: { provider: 'market', yahoo: 'SAN.MC', twelvedata: 'SAN' },
  samsung: { provider: 'market', yahoo: '005930.KS', twelvedata: '005930' },
  toyota: { provider: 'market', yahoo: '7203.T', twelvedata: '7203' },
  sony: { provider: 'market', yahoo: '6758.T', twelvedata: '6758' },
  alibaba: { provider: 'market', yahoo: 'BABA', twelvedata: 'BABA' },
  tencent: { provider: 'market', yahoo: '0700.HK', twelvedata: '0700' },
  umc: { provider: 'market', yahoo: 'UMC', twelvedata: 'UMC' },
  arm: { provider: 'market', yahoo: 'ARM', twelvedata: 'ARM' },

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

/**
 * Alle Instrumente in Anzeigereihenfolge.
 *
 * Sortiert nach Bedeutung, nicht nach Gattung im Alphabet: erst Aktienindizes,
 * dann Rohstoffe, dann Währungspaare, zuletzt Kryptowährungen. Innerhalb der
 * Indizes steht vorn, was ein deutschsprachiges Publikum zuerst sucht.
 *
 * Vorher standen die Devisen vorn – ein Ergebnis der Entstehungsgeschichte, das
 * beim Aufklappen des Menüs dazu führte, dass zuerst EUR/CNY zu sehen war und
 * der DAX weiter unten stand. Die Reihenfolge wirkt auf das Menü, die
 * Marktübersicht, die Suche und die Sitemap.
 */
export const marketDefinitions: MarketDefinition[] = [
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
    symbol: 'dow-jones',
    ticker: 'Dow Jones',
    name: 'Dow Jones Industrial Average',
    kind: 'index',
    unit: 'Punkte',
    decimals: 2,
    summary:
      'Der älteste bekannte Aktienindex der Welt – 30 US-Konzerne, gewichtet nach Aktienkurs statt nach Größe.',
    metaDescription:
      'Der Dow Jones mit 30 US-Konzernen: aktueller Stand, Chart über fünf Jahre und warum seine Preisgewichtung heute niemand mehr so bauen würde.',
    description: [
      'Der Dow Jones Industrial Average umfasst 30 große US-Unternehmen und ist mit Abstand der bekannteste Aktienindex der Welt. Berechnet wird er seit 1896 – aus einer Zeit, in der ein Index von Hand zu rechnen sein musste.',
      'Genau daher stammt seine Besonderheit: Der Dow ist **preisgewichtet**. Eine Aktie zählt umso mehr, je höher ihr Kurs steht – unabhängig davon, wie groß das Unternehmen ist. Eine Aktie zu 500 Dollar bewegt den Index also zehnmal so stark wie eine zu 50 Dollar, selbst wenn das zweite Unternehmen ein Vielfaches wert ist. Ein Aktiensplit, der am Wert des Unternehmens nichts ändert, verringert sein Gewicht im Index schlagartig.',
      'Für eine Einschätzung des US-Marktes ist der Dow deshalb die schwächere Wahl. Der S&P 500 bildet mit 500 Werten und Gewichtung nach Marktwert deutlich mehr ab. Der Dow bleibt trotzdem der Index, der in Nachrichten genannt wird – seine Bedeutung ist historisch und publizistisch, nicht methodisch.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'boerse'],
    seed: { startValue: 38400, annualDrift: 0.079, annualVolatility: 0.16, seed: 22301 },
  },
  {
    symbol: 'nikkei-225',
    ticker: 'Nikkei 225',
    name: 'Nikkei 225 (Japan)',
    kind: 'index',
    unit: 'Punkte',
    decimals: 2,
    summary:
      'Der Leitindex der Börse Tokio – und das Lehrstück darüber, wie lange ein Markt für die Erholung von einer Blase brauchen kann.',
    metaDescription:
      'Der Nikkei 225 aus Tokio: aktueller Stand, Chart über fünf Jahre und warum der Index über drei Jahrzehnte brauchte, um sein Hoch von 1989 zu erreichen.',
    description: [
      'Der Nikkei 225 bündelt 225 große japanische Unternehmen und ist der bekannteste Index Asiens. Wie der Dow Jones ist er **preisgewichtet** – eine Konstruktion, die einzelnen hochpreisigen Aktien ein Gewicht gibt, das mit ihrer wirtschaftlichen Bedeutung wenig zu tun hat. Der breiter aufgestellte TOPIX gilt fachlich als das bessere Maß für den japanischen Markt.',
      'Kein anderer Index eignet sich so gut, um die Dauer von Verlustphasen zu zeigen: Ende 1989 stand der Nikkei bei knapp 39.000 Punkten. Danach platzte eine Immobilien- und Aktienblase, und es dauerte **über 34 Jahre**, bis dieser Stand wieder erreicht war. Wer damals am Hoch kaufte, wartete länger als ein halbes Berufsleben auf den Ausgleich – nominal, vor Inflation.',
      'Für europäische Anlegerinnen und Anleger kommt der Yen hinzu. Japanische Aktien werden in Yen abgerechnet; ein schwacher Yen kann einen Kursgewinn in Euro vollständig aufzehren. Der Zusammenhang wirkt sogar doppelt, weil viele japanische Konzerne exportorientiert sind und von einem schwachen Yen profitieren – der Index steigt dann oft gerade deshalb.',
    ],
    relatedTopics: [
      'aktien-laender-branchen',
      'groesste-crashes',
      'waehrungen-wechselkurse',
    ],
    seed: { startValue: 27800, annualDrift: 0.093, annualVolatility: 0.19, seed: 22303 },
  },
  {
    symbol: 'hang-seng',
    ticker: 'Hang Seng',
    name: 'Hang Seng (Hongkong)',
    kind: 'index',
    unit: 'Punkte',
    decimals: 2,
    summary:
      'Der Leitindex Hongkongs – für viele der einzige praktikable Zugang zu chinesischen Aktien.',
    metaDescription:
      'Der Hang Seng aus Hongkong: aktueller Stand, Chart über fünf Jahre und warum er nicht dasselbe ist wie „der chinesische Aktienmarkt“.',
    description: [
      'Der Hang Seng bildet die größten in Hongkong notierten Unternehmen ab. Weil der Handel dort für ausländische Anleger offen ist, dient er häufig als Zugang zu chinesischen Aktien – die Festlandbörsen in Shanghai und Shenzhen sind schwerer erreichbar.',
      'Dabei ist er nicht dasselbe wie „der chinesische Markt“. Der Index enthält neben Festlandkonzernen auch Hongkonger Immobilien- und Finanzunternehmen, und viele große Festlandwerte fehlen. Wer breit in China investieren will, greift eher zu Indizes wie dem MSCI China oder dem CSI 300 – die decken andere Ausschnitte ab.',
      'Der Hang Seng zeigt außerdem etwas, das an westlichen Märkten leicht übersehen wird: das politische Risiko. Regulatorische Eingriffe haben ganze Branchen – Bildungsanbieter, Technologieplattformen – binnen Wochen um erhebliche Teile ihres Werts fallen lassen. Das ist keine Marktbewegung im üblichen Sinn, sondern eine Entscheidung, und sie lässt sich nicht aus Kennzahlen ableiten.',
    ],
    relatedTopics: ['aktien-laender-branchen', 'risiko-und-rendite', 'groesste-crashes'],
    seed: { startValue: 24900, annualDrift: -0.021, annualVolatility: 0.24, seed: 22305 },
  },
  {
    symbol: 'kospi',
    ticker: 'KOSPI',
    name: 'KOSPI (Südkorea)',
    kind: 'index',
    unit: 'Punkte',
    decimals: 2,
    summary:
      'Der Leitindex Südkoreas – stark abhängig von Halbleitern und damit ein Frühindikator für die weltweite Technologiekonjunktur.',
    metaDescription:
      'Der KOSPI aus Seoul: aktueller Stand, Chart über fünf Jahre und warum ein einzelner Halbleiterkonzern den ganzen Index bewegt.',
    description: [
      'Der KOSPI bildet die an der Börse Seoul notierten Unternehmen ab und ist nach Marktwert gewichtet. Südkorea ist eine Exportwirtschaft mit einem außergewöhnlich hohen Anteil an Halbleitern, Schiffbau, Automobilen und Chemie – der Index reagiert deshalb stärker auf den Welthandel als auf die Binnennachfrage.',
      'Bemerkenswert ist die Konzentration: Ein einzelner Halbleiterkonzern macht regelmäßig einen erheblichen Teil des gesamten Indexgewichts aus. Der KOSPI ist damit weniger ein Abbild der koreanischen Wirtschaft als eine Wette auf den Chipzyklus – ein Klumpenrisiko, das im Namen „Leitindex“ nicht steckt.',
      'Weil Halbleiter am Anfang fast jeder industriellen Wertschöpfungskette stehen, dreht der KOSPI häufig früher als westliche Indizes. Als Frühindikator wird er deshalb aufmerksam beobachtet, auch von Anlegern, die selbst gar nicht in Korea investiert sind.',
    ],
    relatedTopics: ['aktien-laender-branchen', 'aktie', 'wie-funktioniert-der-markt'],
    seed: { startValue: 2680, annualDrift: 0.055, annualVolatility: 0.2, seed: 22304 },
  },
  {
    symbol: 'russell-2000',
    ticker: 'Russell 2000',
    name: 'Russell 2000 (US-Nebenwerte)',
    kind: 'index',
    unit: 'Punkte',
    decimals: 2,
    summary:
      'Rund 2.000 kleinere US-Unternehmen – der Index, an dem sich die Lage der amerikanischen Binnenwirtschaft ablesen lässt.',
    metaDescription:
      'Der Russell 2000 mit rund 2.000 kleineren US-Unternehmen: Stand, Chart über fünf Jahre und warum er anders läuft als der S&P 500.',
    description: [
      'Der Russell 2000 enthält die kleineren 2.000 Unternehmen aus dem Russell 3000 und gilt als der Maßstab für US-Nebenwerte, im Fachjargon **Small Caps**. Zusammen kommen diese 2.000 Firmen auf einen Bruchteil des Börsenwerts der größten zehn Konzerne im S&P 500 – das sagt einiges über die Konzentration am US-Markt.',
      'Interessant ist er als Gegenprobe: Kleinere Unternehmen erzielen ihre Umsätze überwiegend im eigenen Land, sind stärker verschuldet und häufiger auf Bankkredite angewiesen. Steigende Zinsen treffen sie deshalb härter als die großen, international aufgestellten Konzerne. Läuft der S&P 500 gut und der Russell 2000 schlecht, trägt die Rally nur wenige Namen.',
      'Historisch haben Nebenwerte über sehr lange Zeiträume etwas höhere Renditen gebracht als Standardwerte – bei größeren Schwankungen und längeren Verlustphasen. Ob diese Prämie fortbesteht, ist unter Fachleuten umstritten; ein Automatismus ist sie jedenfalls nicht.',
    ],
    relatedTopics: ['aktien-laender-branchen', 'risiko-und-rendite', 'aktie'],
    seed: { startValue: 1980, annualDrift: 0.062, annualVolatility: 0.21, seed: 22302 },
  },
  /*
    Die ETFs.

    ## Warum sie hier bis Juli 2026 fehlten – und warum das ein Problem war

    Der Lernbereich erwähnt ETFs an über hundert Stellen, das Glossar führt
    einen eigenen Eintrag, der Kostenrechner rechnet mit ihrer Kostenquote –
    und im Katalog dieser Website stand kein einziger. Wer den Lernbereich
    gelesen hatte und nachsehen wollte, was ein MSCI-World-ETF kostet und wie
    er gelaufen ist, landete bei tausend Einzelaktien, also bei genau dem,
    wovon der Lernbereich abrät.

    ## Was hier bewusst nicht steht

    **Die laufenden Kosten.** Sie sind die wichtigste Zahl eines ETF und
    stehen trotzdem nicht in diesem Katalog, weil es keine frei zugängliche
    Schnittstelle dafür gibt und eine aus dem Gedächtnis geschriebene
    Kostenquote schlimmer wäre als keine: Sie sähe aus wie eine belegte
    Angabe. Der Ort dafür ist `data/etf-kosten.ts` – eine von Hand geführte
    Liste mit Quellenangabe je Fonds, so wie es die ESEF-Zuordnung bei den
    Unternehmenszahlen auch ist. Was dort fehlt, fehlt sichtbar.

    Ausgewählt sind acht breit gestreute Fonds, keine achtzig. Diese Website
    empfiehlt keine Produkte; sie zeigt, was die Begriffe des Lernbereichs in
    der Wirklichkeit bedeuten. Dafür reichen ein Welt-ETF, ein
    Schwellenländer-ETF, zwei Regionen, ein Nebenwerte- und ein Geldmarktfonds.
  */
  {
    symbol: 'etf-msci-world',
    ticker: 'MSCI World ETF',
    name: 'iShares Core MSCI World UCITS ETF',
    kind: 'etf',
    unit: 'EUR',
    decimals: 2,
    isin: 'IE00B4L5Y983',
    ertragsverwendung: 'ansammelnd',
    summary:
      'Rund 1.400 Unternehmen aus den Industrieländern in einem Papier – der meistgekaufte Sparplan-ETF in Deutschland.',
    metaDescription:
      'Der iShares Core MSCI World: Kurs in Euro, Verlauf über fünf Jahre und was „Industrieländer“ bei diesem Index tatsächlich heißt.',
    description: [
      'Dieser Fonds bildet den MSCI World nach – rund 1.400 große und mittelgroße Unternehmen aus 23 Industrieländern. Er ist der Fonds, den die meisten meinen, wenn sie „ich spare in einen Welt-ETF“ sagen.',
      'Der Name führt in die Irre: „World“ heißt Industrieländer, nicht Welt. China, Indien, Brasilien und alle übrigen Schwellenländer fehlen vollständig – zusammen ein erheblicher Teil der Weltbevölkerung und der Wirtschaftsleistung. Wer sie mit abdecken will, braucht einen zweiten Fonds oder einen Index, der beides enthält.',
      'Das zweite, was oft übersehen wird, ist die Gewichtung nach Börsenwert. Die Vereinigten Staaten machen deutlich über die Hälfte des Index aus, und die zehn größten Positionen wiegen zusammen schwerer als ganze Länder. „Weltweit gestreut“ ist deshalb eine ungenaue Beschreibung: Gestreut ist die Zahl der Titel, nicht das Gewicht.',
      'Der Fonds sammelt Erträge an, statt sie auszuschütten. In Deutschland heißt das nicht, dass keine Steuer anfällt – die Vorabpauschale sorgt dafür, dass jährlich ein Teil versteuert wird, auch ohne Ausschüttung. Wie das gerechnet wird, steht im Steuerrechner.',
    ],
    relatedTopics: ['etf', 'fonds', 'portfolio-aufbau'],
    seed: { startValue: 78, annualDrift: 0.09, annualVolatility: 0.16, seed: 51001 },
  },
  {
    symbol: 'etf-ftse-all-world',
    ticker: 'FTSE All-World ETF',
    name: 'Vanguard FTSE All-World UCITS ETF',
    kind: 'etf',
    unit: 'EUR',
    decimals: 2,
    isin: 'IE00BK5BQT80',
    ertragsverwendung: 'ansammelnd',
    summary:
      'Industrie- und Schwellenländer in einem Papier – der Fonds für alle, die es bei einem belassen wollen.',
    metaDescription:
      'Der Vanguard FTSE All-World: Kurs in Euro, Verlauf über fünf Jahre und der Unterschied zum MSCI World.',
    description: [
      'Der FTSE All-World enthält, anders als der MSCI World, auch die Schwellenländer – rund viertausend Unternehmen aus Industrie- und Schwellenländern zusammen. Für alle, die genau einen Fonds halten wollen, ist das der naheliegende Zuschnitt.',
      'Der Unterschied zum MSCI World fällt in der Rendite geringer aus, als die Namen vermuten lassen. Die Schwellenländer machen nach Börsenwert rund ein Zehntel des Index aus; sie verschieben das Bild, aber sie bestimmen es nicht. Wer eine deutlich andere Entwicklung erwartet, erwartet zu viel.',
      'Was er dagegen ändert, ist die Abhängigkeit von einem einzigen Land. Der US-Anteil liegt spürbar niedriger als beim MSCI World – nicht weil weniger amerikanische Firmen drin wären, sondern weil mehr andere dazukommen.',
    ],
    relatedTopics: ['etf', 'portfolio-aufbau', 'aktien-laender-branchen'],
    seed: { startValue: 92, annualDrift: 0.085, annualVolatility: 0.16, seed: 51002 },
  },
  {
    symbol: 'etf-sp500',
    ticker: 'S&P 500 ETF',
    name: 'iShares Core S&P 500 UCITS ETF',
    kind: 'etf',
    unit: 'EUR',
    decimals: 2,
    isin: 'IE00B5BMR087',
    ertragsverwendung: 'ansammelnd',
    summary:
      'Die 500 größten US-Unternehmen – der Index, an dem sich alle anderen messen lassen müssen.',
    metaDescription:
      'Der iShares Core S&P 500: Kurs in Euro, Verlauf über fünf Jahre und warum ein US-Index für Euro-Anleger zwei Risiken trägt.',
    description: [
      'Dieser Fonds bildet den S&P 500 nach, also die 500 größten börsennotierten Unternehmen der Vereinigten Staaten. Über die vergangenen Jahrzehnte hat kaum ein aktiv verwalteter Fonds ihn dauerhaft geschlagen – das ist das stärkste Argument, das für Indexfonds überhaupt vorgebracht wird.',
      'Für Anleger im Euroraum trägt er zwei Risiken statt einem. Der Kurs in Euro hängt am Index **und** am Dollar. Ein Jahr, in dem der S&P 500 zehn Prozent zulegt und der Dollar zehn Prozent nachgibt, endet für einen Euro-Anleger ungefähr bei null. Beides zusammen steht in der Prozentzahl, die dieser Fonds ausweist.',
      'Wer bereits einen Welt-ETF hält, hat einen großen Teil davon schon: Die USA machen dort den größten Block aus. Beides nebeneinander ist keine Streuung, sondern eine Verdopplung – ein Fehler, der häufiger gemacht wird als jeder andere beim Aufbau eines Depots.',
    ],
    relatedTopics: ['etf', 'aktien-laender-branchen', 'waehrungen-wechselkurse'],
    seed: { startValue: 380, annualDrift: 0.11, annualVolatility: 0.17, seed: 51003 },
  },
  {
    symbol: 'etf-em-imi',
    ticker: 'Schwellenländer-ETF',
    name: 'iShares Core MSCI EM IMI UCITS ETF',
    kind: 'etf',
    unit: 'EUR',
    decimals: 2,
    isin: 'IE00BKM4GZ66',
    ertragsverwendung: 'ansammelnd',
    summary:
      'Rund 3.000 Unternehmen aus Schwellenländern – das, was im MSCI World fehlt.',
    metaDescription:
      'Der iShares Core MSCI EM IMI: Kurs in Euro, Verlauf über fünf Jahre und warum Schwellenländer nicht automatisch mehr Rendite bringen.',
    description: [
      'Dieser Fonds deckt ab, was im MSCI World fehlt: Unternehmen aus Schwellenländern, von China und Taiwan über Indien bis Brasilien und Südafrika. Das „IMI“ im Namen heißt, dass auch mittlere und kleine Unternehmen enthalten sind, nicht nur die großen.',
      'Der übliche Gedanke dahinter lautet: Diese Volkswirtschaften wachsen schneller, also bringen ihre Aktien mehr. Der Zusammenhang ist schwächer, als er klingt. Über die vergangenen fünfzehn Jahre sind Schwellenländeraktien deutlich hinter den Industrieländern zurückgeblieben, obwohl die Wirtschaft dort schneller gewachsen ist. Wachstum eines Landes und Rendite seiner Aktien sind zwei verschiedene Dinge.',
      'Was er sicher bringt, ist ein anderes Risikoprofil: politische Eingriffe, weniger verlässliche Rechnungslegung, Währungen, die stärker schwanken. Wer ihn beimischt, tut das für die Streuung, nicht für eine sichere Mehrrendite.',
    ],
    relatedTopics: ['etf', 'aktien-laender-branchen', 'risiko-und-rendite'],
    seed: { startValue: 27, annualDrift: 0.04, annualVolatility: 0.19, seed: 51004 },
  },
  {
    symbol: 'etf-dax',
    ticker: 'DAX-ETF',
    name: 'iShares Core DAX UCITS ETF',
    kind: 'etf',
    unit: 'EUR',
    decimals: 2,
    isin: 'DE0005933931',
    ertragsverwendung: 'ansammelnd',
    summary:
      'Die 40 DAX-Unternehmen in einem Papier – und ein Lehrstück über Klumpenrisiko im eigenen Land.',
    metaDescription:
      'Der iShares Core DAX: Kurs in Euro, Verlauf über fünf Jahre und warum ein Heimatindex allein keine Streuung ist.',
    description: [
      'Der Fonds bildet den DAX nach. Weil der DAX ein Performance-Index ist, stecken die Dividenden bereits in seinem Stand – anders als bei den meisten anderen Indizes dieser Art.',
      'Als einziger Baustein eines Depots ist er ein Musterfall für das, was in der Lehre **Home Bias** heißt: die Neigung, überwiegend im eigenen Land anzulegen, weil einem die Namen vertraut sind. Deutschland macht an der Weltwirtschaft einen einstelligen Prozentsatz aus. Vierzig deutsche Unternehmen sind vierzig Titel, aber eine einzige Volkswirtschaft, eine Rechtsordnung und ein Exportmodell.',
      'Als Ergänzung ist er etwas anderes: Wer bewusst mehr Gewicht auf den Heimatmarkt legen will, weil er dort ausgibt und verdient, hat dafür ein Argument. Der Unterschied liegt darin, ob die Entscheidung getroffen oder nur nicht bemerkt wurde.',
    ],
    relatedTopics: ['etf', 'aktien-laender-branchen', 'portfolio-aufbau'],
    seed: { startValue: 130, annualDrift: 0.07, annualVolatility: 0.18, seed: 51005 },
  },
  {
    symbol: 'etf-stoxx-600',
    ticker: 'Europa-ETF',
    name: 'iShares STOXX Europe 600 UCITS ETF',
    kind: 'etf',
    unit: 'EUR',
    decimals: 2,
    isin: 'DE0002635307',
    ertragsverwendung: 'ausschüttend',
    summary:
      '600 europäische Unternehmen aus 17 Ländern – breiter als jeder nationale Leitindex.',
    metaDescription:
      'Der iShares STOXX Europe 600: Kurs in Euro, Verlauf über fünf Jahre und warum Europa im Welt-ETF untergewichtet wirkt.',
    description: [
      'Der STOXX Europe 600 enthält 600 große, mittlere und kleine Unternehmen aus siebzehn europäischen Ländern – auch aus solchen außerhalb der Eurozone wie der Schweiz, dem Vereinigten Königreich und Skandinavien. Er ist damit deutlich breiter als jeder einzelne nationale Leitindex.',
      'Für Anleger im Euroraum hat er einen praktischen Vorzug: Ein großer Teil der enthaltenen Unternehmen bilanziert in Euro, das Währungsrisiko ist geringer als bei einem Welt- oder US-Fonds. Ganz verschwunden ist es nicht, denn Franken, Pfund und Krone sind mit dabei.',
      'Dieser Fonds schüttet seine Erträge aus, statt sie anzusammeln. Für die Steuer ist das in Deutschland weniger entscheidend, als oft gedacht wird; für die Handhabung schon: Wer die Ausschüttungen wieder anlegen will, muss es selbst tun – und zahlt dabei unter Umständen erneut Ordergebühren.',
    ],
    relatedTopics: ['etf', 'aktien-laender-branchen', 'dividende'],
    seed: { startValue: 41, annualDrift: 0.06, annualVolatility: 0.15, seed: 51006 },
  },
  {
    symbol: 'etf-world-small-cap',
    ticker: 'Welt-Nebenwerte-ETF',
    name: 'iShares MSCI World Small Cap UCITS ETF',
    kind: 'etf',
    unit: 'EUR',
    decimals: 2,
    isin: 'IE00BF4RFH31',
    ertragsverwendung: 'ansammelnd',
    summary:
      'Kleinere Unternehmen der Industrieländer – die Ergänzung, die im MSCI World fehlt.',
    metaDescription:
      'Der iShares MSCI World Small Cap: Kurs in Euro, Verlauf über fünf Jahre und was die Nebenwerteprämie taugt.',
    description: [
      'Der MSCI World enthält große und mittelgroße Unternehmen. Die kleinen fehlen – und das sind nach Zahl der Firmen die meisten. Dieser Fonds deckt genau diesen Bereich ab.',
      'Das Argument dafür heißt **Size-Prämie**: Über sehr lange Zeiträume haben kleinere Unternehmen etwas höhere Renditen gebracht als große. Ob die Prämie fortbesteht, ist unter Fachleuten umstritten; in den vergangenen fünfzehn Jahren war davon wenig zu sehen. Belegt ist nur die Kehrseite – mehr Schwankung und tiefere Einbrüche in Krisen.',
      'Wer ihn beimischt, sollte wissen, dass er dafür bezahlt: Nebenwerte-Fonds haben durchweg höhere laufende Kosten als Standardfonds, weil ihre Bestandteile teurer zu handeln sind.',
    ],
    relatedTopics: ['etf', 'risiko-und-rendite', 'portfolio-aufbau'],
    seed: { startValue: 5.6, annualDrift: 0.06, annualVolatility: 0.19, seed: 51007 },
  },
  {
    symbol: 'etf-geldmarkt',
    ticker: 'Geldmarkt-ETF',
    name: 'Xtrackers II EUR Overnight Rate Swap UCITS ETF',
    kind: 'etf',
    unit: 'EUR',
    decimals: 2,
    isin: 'LU0290358497',
    ertragsverwendung: 'ansammelnd',
    summary:
      'Der Tagesgeldsatz des Euroraums als Fonds – kein Wachstumsbaustein, sondern ein Parkplatz.',
    metaDescription:
      'Der Xtrackers Overnight Rate ETF: Kurs in Euro, Verlauf über fünf Jahre und wofür ein Geldmarktfonds taugt – und wofür nicht.',
    description: [
      'Dieser Fonds bildet den Zinssatz nach, zu dem sich Banken im Euroraum über Nacht Geld leihen. Sein Kurs steigt in kleinen, gleichmäßigen Schritten, solange dieser Zins positiv ist – und er stand jahrelang still oder sank leicht, als der Zins bei null oder darunter lag.',
      'Er gehört hierher, weil er zeigt, was ein Zinssatz mit einem Kurs macht. Der Verlauf über fünf Jahre ist das beste Anschauungsstück für die Zinswende, das dieser Katalog hergibt: eine waagerechte Linie, die ab 2022 zu steigen beginnt.',
      'Was er nicht ist: ein Ersatz für Tagesgeld. Es gibt keine Einlagensicherung – ein Fonds ist Sondervermögen, was etwas anderes und in mancher Hinsicht Besseres ist, aber eben nicht dasselbe. Und es fallen Ordergebühren an, die bei kleinen Beträgen den Zinsvorteil auffressen.',
    ],
    relatedTopics: ['etf', 'tagesgeld', 'einlagensicherung'],
    seed: { startValue: 139, annualDrift: 0.025, annualVolatility: 0.004, seed: 51008 },
  },
  {
    symbol: 'mdax',
    ticker: 'MDAX',
    name: 'MDAX (deutsche Mittelwerte)',
    kind: 'index',
    unit: 'Punkte',
    decimals: 2,
    summary:
      'Die 50 Unternehmen unterhalb des DAX – der Index, an dem die deutsche Binnenwirtschaft am besten abzulesen ist.',
    metaDescription:
      'Der MDAX mit 50 mittelgroßen deutschen Unternehmen: Stand, Chart über fünf Jahre und warum er anders läuft als der DAX.',
    description: [
      'Der MDAX enthält die 50 Unternehmen, die nach Börsenwert und Handelsumsatz auf die 40 DAX-Werte folgen. Er ist damit kein Index zweiter Wahl, sondern ein anderer Ausschnitt derselben Volkswirtschaft – mit Maschinenbauern, Zulieferern, Immobiliengesellschaften und Handelsketten, die im DAX kaum vertreten sind.',
      'Der entscheidende Unterschied zum DAX liegt im Auslandsanteil. Die vierzig größten deutschen Konzerne erwirtschaften den Löwenanteil ihrer Umsätze außerhalb Deutschlands; der MDAX hängt spürbar stärker am Geschäft im Inland und in Europa. Wer wissen will, wie es der deutschen Wirtschaft geht und nicht dem Weltgeschäft deutscher Konzerne, sieht hier genauer hin.',
      'Wie der DAX wird auch der MDAX standardmäßig als Performance-Index geführt: Dividenden werden rechnerisch wieder angelegt. Ein Vergleich mit einem Kursindex wie dem CAC 40 fällt deshalb zwangsläufig zugunsten des MDAX aus, ohne dass die Unternehmen dahinter besser gelaufen wären.',
    ],
    relatedTopics: ['aktien-laender-branchen', 'aktie', 'risiko-und-rendite'],
    seed: { startValue: 26800, annualDrift: 0.055, annualVolatility: 0.19, seed: 41207 },
  },
  {
    symbol: 'tecdax',
    ticker: 'TecDAX',
    name: 'TecDAX (deutsche Technologiewerte)',
    kind: 'index',
    unit: 'Punkte',
    decimals: 2,
    summary:
      'Die 30 größten Technologieunternehmen an der deutschen Börse – mit erheblichen Überschneidungen zum DAX.',
    metaDescription:
      'Der TecDAX mit 30 deutschen Technologiewerten: Stand, Chart über fünf Jahre und warum er sich mit DAX und MDAX überschneidet.',
    description: [
      'Der TecDAX bündelt die 30 größten Technologieunternehmen der deutschen Börse. Anders als bei DAX, MDAX und SDAX entscheidet hier nicht allein die Größe, sondern die Branchenzuordnung – ein Unternehmen kann deshalb gleichzeitig im DAX und im TecDAX stehen.',
      'Genau das ist beim Lesen wichtig: Wer DAX und TecDAX nebeneinanderlegt, vergleicht keine getrennten Körbe. Schwergewichte wie SAP oder Infineon wirken in beiden, und ein guter Tag für sie hebt beide Indizes gleichzeitig.',
      '„Technologie“ ist dabei weiter gefasst als in der Alltagssprache: Neben Software und Halbleitern zählen auch Medizintechnik und Biotechnologie dazu. Ein TecDAX-Stand sagt deshalb weniger über die Digitalwirtschaft aus, als der Name nahelegt.',
    ],
    relatedTopics: ['aktien-laender-branchen', 'aktie'],
    seed: { startValue: 3400, annualDrift: 0.06, annualVolatility: 0.24, seed: 41208 },
  },
  {
    symbol: 'sdax',
    ticker: 'SDAX',
    name: 'SDAX (deutsche Nebenwerte)',
    kind: 'index',
    unit: 'Punkte',
    decimals: 2,
    summary:
      'Die 70 Unternehmen unterhalb des MDAX – die kleinste der vier Stufen der deutschen Indexfamilie.',
    metaDescription:
      'Der SDAX mit 70 kleineren deutschen Unternehmen: Stand, Chart über fünf Jahre und warum Nebenwerte anders schwanken.',
    description: [
      'Der SDAX führt die 70 Unternehmen, die nach DAX und MDAX folgen. Zusammen bilden die drei eine Rangfolge nach Größe, keine nach Qualität: Ein Unternehmen steigt auf und ab, wenn sich Börsenwert und Handelsumsatz ändern.',
      'Nebenwerte werden seltener gehandelt als Standardwerte. Das hat zwei Folgen, die sich im Chart zeigen: Einzelne größere Aufträge bewegen den Kurs stärker, und in nervösen Phasen fällt der Index tiefer, weil weniger Käufer bereitstehen. Wer Nebenwerte hält, kauft eine höhere Schwankung mit.',
      'Dafür sind kleinere Unternehmen weniger im Blick der großen Analysehäuser. Ob daraus ein Vorteil erwächst, ist umstritten – belegt ist nur, dass der Weg dorthin über mehr Schwankung führt.',
    ],
    relatedTopics: ['aktien-laender-branchen', 'risiko-und-rendite', 'aktie'],
    seed: { startValue: 13900, annualDrift: 0.05, annualVolatility: 0.2, seed: 41209 },
  },
  {
    symbol: 'smi',
    ticker: 'SMI',
    name: 'SMI (Swiss Market Index)',
    kind: 'index',
    unit: 'Punkte',
    decimals: 2,
    summary:
      'Die 20 größten Schweizer Unternehmen – ein Index, der zu weiten Teilen an drei Namen hängt.',
    metaDescription:
      'Der Swiss Market Index mit den 20 größten Schweizer Unternehmen: Stand, Chart über fünf Jahre und was die starke Konzentration bedeutet.',
    description: [
      'Der SMI enthält die 20 größten und meistgehandelten Schweizer Aktien. Er gilt als defensiver Index, weil Pharma und Basiskonsum schwer wiegen – Geschäfte, deren Nachfrage weniger am Konjunkturzyklus hängt als Industrie oder Autobau.',
      'Die Kehrseite ist die Konzentration: Nestlé, Roche und Novartis machen zusammen einen erheblichen Teil des Index aus. Eine Nachricht aus einem dieser drei Häuser bewegt den SMI stärker als eine Nachricht aus den übrigen siebzehn zusammen. Ein „Schweizer Markt“ ist er insofern nur bedingt.',
      'Für Anleger aus dem Euroraum kommt der Franken hinzu. Er gilt als sicherer Hafen und wertet in Krisen häufig auf – der Kurs in Euro kann dann steigen, obwohl der Index in Franken fällt. Wer die Prozentzahlen des SMI liest, liest sie in Franken.',
    ],
    relatedTopics: ['aktien-laender-branchen', 'waehrungen-wechselkurse', 'aktie'],
    seed: { startValue: 11200, annualDrift: 0.045, annualVolatility: 0.14, seed: 41210 },
  },
  {
    symbol: 'cac-40',
    ticker: 'CAC 40',
    name: 'CAC 40 (Frankreich)',
    kind: 'index',
    unit: 'Punkte',
    decimals: 2,
    summary:
      'Die 40 größten französischen Unternehmen – mit einem für Europa ungewöhnlich hohen Anteil an Luxusgütern.',
    metaDescription:
      'Der CAC 40 mit den 40 größten französischen Unternehmen: Stand, Chart über fünf Jahre und warum er ohne Dividenden gerechnet wird.',
    description: [
      'Der CAC 40 führt die 40 größten an der Pariser Börse notierten Unternehmen. Was ihn von anderen europäischen Leitindizes unterscheidet, ist sein Schwerpunkt: Luxusgüter, Kosmetik und Konsummarken wiegen hier so schwer wie nirgends sonst in Europa.',
      'Das macht ihn empfindlich für eine Größe, die sonst kaum eine Rolle spielt – die Nachfrage aus China. Ein schwaches Konsumklima dort schlägt auf den CAC 40 stärker durch als auf DAX oder FTSE 100.',
      'Wichtig beim Vergleichen: Der CAC 40 wird üblicherweise als **Kursindex** dargestellt, ohne Dividenden. Der DAX wird standardmäßig als Performance-Index geführt, mit Dividenden. Die Prozentzahlen der beiden nebeneinanderzulegen bevorteilt den DAX systematisch, ohne dass ein Unternehmen dahinter besser gewirtschaftet hätte.',
    ],
    relatedTopics: ['aktien-laender-branchen', 'aktie'],
    seed: { startValue: 7500, annualDrift: 0.05, annualVolatility: 0.17, seed: 41211 },
  },
  {
    symbol: 'ftse-100',
    ticker: 'FTSE 100',
    name: 'FTSE 100 (Vereinigtes Königreich)',
    kind: 'index',
    unit: 'Punkte',
    decimals: 2,
    summary:
      'Die 100 größten Unternehmen an der Londoner Börse – ein britischer Index, der kaum von Großbritannien lebt.',
    metaDescription:
      'Der FTSE 100 mit den 100 größten Unternehmen der Londoner Börse: Stand, Chart über fünf Jahre und warum er kein Spiegel der britischen Wirtschaft ist.',
    description: [
      'Der FTSE 100 enthält die 100 nach Börsenwert größten Unternehmen an der Londoner Börse. Der naheliegende Schluss, er zeige die Lage der britischen Wirtschaft, ist falsch: Die Mitglieder erwirtschaften den überwiegenden Teil ihrer Umsätze im Ausland, und viele bilanzieren in Dollar.',
      'Daraus folgt ein Zusammenhang, der Neulinge regelmäßig verwirrt: Ein schwaches Pfund lässt den FTSE 100 oft **steigen**, weil die im Ausland verdienten Erträge in Pfund umgerechnet mehr wert sind. Wer den Index als Stimmungsbarometer für die Insel liest, liest ihn falsch.',
      'Sein Schwerpunkt liegt auf Öl, Bergbau, Banken und Basiskonsum – klassische Dividendenzahler. Die Dividendenrendite des FTSE 100 liegt deshalb regelmäßig über der anderer Leitindizes, während der reine Kursverlauf schwächer aussieht als etwa der des S&P 500.',
    ],
    relatedTopics: ['aktien-laender-branchen', 'waehrungen-wechselkurse', 'aktie'],
    seed: { startValue: 8100, annualDrift: 0.04, annualVolatility: 0.15, seed: 41212 },
  },
  /*
    Sechs Leitindizes außerhalb der üblichen Verdächtigen.

    Sie kamen mit dem Indexvergleich auf den Aktienseiten dazu (`lib/indexvergleich.ts`).
    Der Vergleich misst eine Aktie am Leitindex ihres Handelsplatzes, und für
    Indien, Kanada, Australien, Brasilien, Schweden und Taiwan gab es hier
    keinen – 158 der geführten Aktien standen damit ohne Bezugspunkt da,
    obwohl sie zu den größten Unternehmen ihres Landes gehören.
  */
  {
    symbol: 'nifty-50',
    ticker: 'NIFTY 50',
    name: 'NIFTY 50 (Indien)',
    kind: 'index',
    unit: 'Punkte',
    decimals: 2,
    summary:
      'Die 50 größten Werte der National Stock Exchange in Mumbai – der meistbeachtete Index eines Marktes mit hohem Anteil privater Anleger.',
    metaDescription:
      'Der NIFTY 50 mit den 50 größten indischen Aktien: Stand, Chart über fünf Jahre und warum der Rupienkurs für Anleger aus dem Euroraum mitzählt.',
    description: [
      'Der NIFTY 50 führt die 50 nach Börsenwert und Handelsumsatz größten Unternehmen der National Stock Exchange in Mumbai. Banken und Finanzdienstleister wiegen darin besonders schwer, dazu Software-Dienstleister und Konsumgüter – die Schwerpunkte einer Volkswirtschaft, die stärker vom Binnenmarkt lebt als von Exporten.',
      'Für Anleger aus dem Euroraum kommt eine zweite Bewegung hinzu: die Rupie. Sie hat gegenüber Euro und Dollar über lange Zeiträume an Wert verloren; ein zweistelliger Zuwachs des Index in Rupien konnte in Euro gerechnet deutlich kleiner ausfallen. Die Prozentzahlen hier sind in Rupien gerechnet.',
      'Der indische Markt hat außerdem eine Eigenheit, die in den Zahlen nicht steht: Ein großer Teil des Handels geht auf inländische Privatanleger zurück, viele davon über monatliche Sparpläne. Das stützt die Kurse in Phasen, in denen ausländisches Kapital abfließt – und ändert nichts daran, dass ein einzelner Ländermarkt eine Wette auf ein Land ist.',
    ],
    relatedTopics: ['aktien-laender-branchen', 'waehrungen-wechselkurse', 'aktie'],
    seed: { startValue: 15500, annualDrift: 0.09, annualVolatility: 0.18, seed: 41213 },
  },
  {
    symbol: 'tsx-composite',
    ticker: 'S&P/TSX',
    name: 'S&P/TSX Composite (Kanada)',
    kind: 'index',
    unit: 'Punkte',
    decimals: 2,
    summary:
      'Der breite Index der Börse in Toronto – Banken, Energie und Rohstoffe machen den Großteil aus.',
    metaDescription:
      'Der S&P/TSX Composite der Börse Toronto: Stand, Chart über fünf Jahre und warum er stärker an Rohstoffpreisen hängt als an der Konjunktur.',
    description: [
      'Der S&P/TSX Composite umfasst den weit überwiegenden Teil des an der Börse in Toronto gehandelten Werts – deutlich mehr Titel als die Leitindizes anderer Länder, die sich auf 30 bis 100 Namen beschränken. „Composite“ heißt genau das: kein Auszug der Größten, sondern ein Querschnitt.',
      'Drei Blöcke bestimmen ihn: Banken, Energie und Bergbau. Damit hängt er stärker an den Preisen für Öl, Erdgas und Metalle als an der Binnenkonjunktur. Ein steigender Ölpreis hebt den Index oft an einem Tag, an dem der S&P 500 aus demselben Grund fällt – dieselbe Nachricht, entgegengesetzte Wirkung.',
      'Die kanadischen Großbanken gelten zudem als besonders stark reguliert und ausschüttungsfreudig. Wer den Index kauft, kauft deshalb ein Übergewicht in zwei Branchen und sollte wissen, wie es zum Rest des eigenen Bestandes steht.',
    ],
    relatedTopics: ['aktien-laender-branchen', 'risiko-und-rendite', 'aktie'],
    seed: { startValue: 20200, annualDrift: 0.07, annualVolatility: 0.15, seed: 41214 },
  },
  {
    symbol: 'asx-200',
    ticker: 'S&P/ASX 200',
    name: 'S&P/ASX 200 (Australien)',
    kind: 'index',
    unit: 'Punkte',
    decimals: 2,
    summary:
      'Die 200 größten Werte der australischen Börse – zwei Branchen, Banken und Bergbau, tragen den Index.',
    metaDescription:
      'Der S&P/ASX 200 mit den 200 größten australischen Aktien: Stand, Chart über fünf Jahre und warum er an der Nachfrage aus China hängt.',
    description: [
      'Der S&P/ASX 200 enthält die 200 größten und liquidesten Unternehmen der australischen Börse. Seine Zusammensetzung ist ungewöhnlich schmal für einen Index mit 200 Mitgliedern: Die vier großen Banken und die großen Bergbaukonzerne machen zusammen einen erheblichen Teil des Gewichts aus.',
      'Daraus folgt eine Abhängigkeit, die im Namen nicht steht – die von der Nachfrage aus China. Eisenerz und Kohle gehen zum großen Teil dorthin; eine schwächere chinesische Bauwirtschaft trifft den australischen Index deshalb schneller als die australische Konjunktur.',
      'Eine australische Besonderheit betrifft die Dividenden: Das dortige Steuersystem rechnet inländischen Anlegern die Körperschaftsteuer auf die Ausschüttung an. Ausländische Anleger bekommen diese Anrechnung nicht – die oft genannte hohe Dividendenrendite des Marktes ist für sie also weniger wert, als sie aussieht.',
    ],
    relatedTopics: ['aktien-laender-branchen', 'risiko-und-rendite', 'aktie'],
    seed: { startValue: 7400, annualDrift: 0.055, annualVolatility: 0.15, seed: 41215 },
  },
  {
    symbol: 'ibovespa',
    ticker: 'Ibovespa',
    name: 'Ibovespa (Brasilien)',
    kind: 'index',
    unit: 'Punkte',
    decimals: 2,
    summary:
      'Der Leitindex der Börse in São Paulo – hohe Ausschläge, hohe Zinsen und eine Währung, die vieles überlagert.',
    metaDescription:
      'Der Ibovespa der Börse São Paulo: Stand, Chart über fünf Jahre und warum sein Verlauf in Real etwas anderes zeigt als in Euro.',
    description: [
      'Der Ibovespa bildet die meistgehandelten Aktien der Börse in São Paulo ab. Rohstoffkonzerne und Banken bestimmen ihn; ein einzelner Bergbau- und ein einzelner Ölwert wiegen zusammen mehr als ganze Branchen anderswo.',
      'Wichtiger als die Zusammensetzung ist hier die Währung. Der Real hat gegenüber Euro und Dollar über Jahre erheblich an Wert verloren. Ein Index, der in Real deutlich zulegt, kann in Euro gerechnet auf der Stelle stehen – der Verlauf auf dieser Seite ist in Real gerechnet und sagt über das Ergebnis eines Anlegers aus dem Euroraum nur die halbe Wahrheit.',
      'Dazu kommen Leitzinsen, die über lange Strecken zweistellig lagen. Hohe Zinsen machen festverzinsliche Anlagen im Inland attraktiv und Aktien vergleichsweise unattraktiv; der brasilianische Aktienmarkt reagiert deshalb auf Zinsentscheidungen der eigenen Notenbank ungewöhnlich stark.',
    ],
    relatedTopics: ['aktien-laender-branchen', 'waehrungen-wechselkurse', 'aktie'],
    seed: { startValue: 121000, annualDrift: 0.075, annualVolatility: 0.24, seed: 41216 },
  },
  {
    symbol: 'omx-stockholm-30',
    ticker: 'OMXS30',
    name: 'OMX Stockholm 30 (Schweden)',
    kind: 'index',
    unit: 'Punkte',
    decimals: 2,
    summary:
      'Die 30 meistgehandelten Werte der Stockholmer Börse – Industrie und Maschinenbau prägen ihn.',
    metaDescription:
      'Der OMX Stockholm 30 mit den 30 meistgehandelten schwedischen Aktien: Stand, Chart über fünf Jahre und was die Krone damit zu tun hat.',
    description: [
      'Der OMX Stockholm 30 führt die 30 meistgehandelten Aktien der Stockholmer Börse. Anders als bei den meisten Leitindizes entscheidet hier nicht der Börsenwert allein, sondern der Handelsumsatz – ein großes, aber selten gehandeltes Unternehmen steht deshalb nicht zwangsläufig darin.',
      'Sein Schwerpunkt liegt auf Industrie, Maschinenbau und Telekommunikationstechnik: Unternehmen, die den überwiegenden Teil ihres Geschäfts außerhalb Schwedens machen. Der Index reagiert entsprechend auf die Weltkonjunktur, nicht auf die schwedische.',
      'Schweden gehört zur EU, aber nicht zum Euro. Wer aus dem Euroraum hier anlegt, trägt deshalb das Wechselkursrisiko der Krone mit – eine Bewegung, die in den Prozentzahlen des Index nicht auftaucht, im eigenen Depotauszug aber sehr wohl.',
    ],
    relatedTopics: ['aktien-laender-branchen', 'waehrungen-wechselkurse', 'aktie'],
    seed: { startValue: 2280, annualDrift: 0.06, annualVolatility: 0.18, seed: 41217 },
  },
  {
    symbol: 'taiex',
    ticker: 'TAIEX',
    name: 'TAIEX (Taiwan)',
    kind: 'index',
    unit: 'Punkte',
    decimals: 2,
    summary:
      'Der Gesamtindex der Börse in Taipeh – ein Markt, dessen Verlauf zu einem großen Teil an einem einzigen Unternehmen hängt.',
    metaDescription:
      'Der TAIEX der Börse Taipeh: Stand, Chart über fünf Jahre und warum ein einzelner Halbleiterhersteller den ganzen Index bewegt.',
    description: [
      'Der TAIEX – ausgeschrieben TWSE Capitalization Weighted Stock Index – umfasst praktisch alle an der Börse in Taipeh notierten Stammaktien. Trotz dieser Breite ist er einer der konzentriertesten Indizes überhaupt: Der größte Halbleiterhersteller der Insel macht allein einen erheblichen Teil des Gewichts aus.',
      'Wer den TAIEX liest, liest deshalb zu einem guten Teil den Kurs eines einzelnen Unternehmens. Ein starker Quartalsbericht von dort hebt den Index eines ganzen Landes; das ist der Grund, warum ein „breiter Ländermarkt“ nicht automatisch eine breite Streuung bedeutet.',
      'Dazu kommt ein Risiko, das sich nicht in Kennzahlen fassen lässt: die politische Lage in der Straße von Taiwan. Es taucht in keinem Kurs-Gewinn-Verhältnis auf, ist aber der Grund, warum taiwanische Werte gemessen an ihren Gewinnen häufig niedriger bewertet sind als vergleichbare amerikanische.',
    ],
    relatedTopics: ['aktien-laender-branchen', 'risiko-und-rendite', 'aktie'],
    seed: { startValue: 17300, annualDrift: 0.11, annualVolatility: 0.23, seed: 41218 },
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
  {
    symbol: 'brent',
    ticker: 'Brent',
    name: 'Brent Rohöl (Nordsee)',
    kind: 'commodity',
    unit: 'USD',
    decimals: 2,
    summary:
      'Der Preis eines Fasses Nordseeöl – die Referenz für rund zwei Drittel des weltweit gehandelten Rohöls.',
    metaDescription:
      'Der Brent-Ölpreis je Fass in US-Dollar: Stand, Chart über fünf Jahre und wie der Ölpreis über die Inflationsrate im eigenen Geldbeutel ankommt.',
    description: [
      'Brent bezeichnet Rohöl aus der Nordsee und ist die weltweit wichtigste Preisreferenz: Der überwiegende Teil des international gehandelten Rohöls wird gegen Brent abgerechnet. Notiert wird der Preis je **Barrel** – ein Fass zu 159 Litern – in US-Dollar.',
      'Was in Nachrichten als „der Ölpreis“ genannt wird, ist immer ein **Terminkontrakt** auf die nächste Lieferperiode, nie ein Kassapreis. Ein Fass Öl kauft man nicht spontan; gehandelt wird die Lieferung in einem bestimmten Monat. Das erklärt auch, warum für Anleger der Ölpreis schwer abzubilden ist: Wer über Terminkontrakte investiert, muss regelmäßig in den nächsten Monat wechseln und zahlt dabei häufig drauf.',
      'Der Weg zum eigenen Geldbeutel ist kürzer als bei den meisten Kursen: Teures Öl verteuert Kraftstoff und Heizen unmittelbar, danach über Transport und Produktion fast jedes Gut, und landet damit in der Inflationsrate. Die wiederum bestimmt, wie viel Spielraum die Notenbanken für Zinssenkungen haben. Ein geopolitisches Ereignis kann so binnen Monaten in einer Baufinanzierung ankommen.',
    ],
    relatedTopics: ['rohstoffe', 'inflation', 'notenbanken-geldpolitik'],
    seed: { startValue: 78.4, annualDrift: 0.048, annualVolatility: 0.34, seed: 22306 },
  },
  {
    symbol: 'wti',
    ticker: 'WTI',
    name: 'WTI Rohöl (USA)',
    kind: 'commodity',
    unit: 'USD',
    decimals: 2,
    summary:
      'Die amerikanische Ölsorte – leichter und schwefelärmer als Brent, und der Maßstab für den US-Markt.',
    metaDescription:
      'Der WTI-Ölpreis je Fass in US-Dollar: Stand, Chart über fünf Jahre und was der Preisunterschied zu Brent über die Lage am Ölmarkt verrät.',
    description: [
      'West Texas Intermediate ist die Referenzsorte für Rohöl in den Vereinigten Staaten. Chemisch ist WTI leichter und schwefelärmer als Brent – Eigenschaften, die die Weiterverarbeitung zu Benzin billiger machen. Gehandelt wird ebenfalls je Barrel in US-Dollar.',
      'Aufschlussreich ist weniger der Preis selbst als der **Abstand zu Brent**. Beide Sorten kosten normalerweise ähnlich viel; weicht der Abstand deutlich vom Üblichen ab, steckt fast immer etwas Konkretes dahinter: volle Lagerkapazitäten in den USA, ausgelastete Pipelines, oder eine Störung der Lieferwege außerhalb Amerikas, die nur Brent betrifft.',
      'Der WTI-Kontrakt hat 2020 Wirtschaftsgeschichte geschrieben: Als in der Pandemie die Lager überliefen und niemand die physische Lieferung annehmen konnte, fiel der Preis für den auslaufenden Kontrakt erstmals **unter null**. Verkäufer zahlten dafür, dass ihnen das Öl abgenommen wurde. Ein Lehrstück darüber, dass ein Terminkontrakt und die Ware dahinter nicht dasselbe sind.',
    ],
    relatedTopics: ['rohstoffe', 'derivat', 'inflation'],
    seed: { startValue: 74.9, annualDrift: 0.045, annualVolatility: 0.36, seed: 22307 },
  },
  {
    symbol: 'platin',
    ticker: 'Platin',
    name: 'Platin (Feinunze)',
    kind: 'commodity',
    unit: 'USD',
    decimals: 2,
    summary:
      'Seltener als Gold, aber überwiegend Industriemetall – der Preis hängt am Automobilbau, nicht an der Angst.',
    metaDescription:
      'Der Platinpreis je Feinunze in US-Dollar: Stand, Chart über fünf Jahre und warum Platin trotz größerer Seltenheit billiger ist als Gold.',
    description: [
      'Platin wird wie Gold je Feinunze in US-Dollar gehandelt und ist geologisch deutlich seltener – die jährliche Fördermenge beträgt einen Bruchteil der Goldförderung. Trotzdem kostet es seit Jahren weniger. Das wirkt widersprüchlich und hat einen einfachen Grund: Seltenheit allein bestimmt keinen Preis, sondern erst zusammen mit der Nachfrage.',
      'Der überwiegende Teil der Platinnachfrage kommt aus der Industrie, vor allem aus Abgaskatalysatoren für Dieselfahrzeuge, dazu Chemie, Glasherstellung und Medizintechnik. Platin ist damit **konjunkturabhängig**: In einem Abschwung sinkt die Nachfrage, während Gold in denselben Phasen oft gesucht ist. Wer Platin als „das bessere Gold“ kauft, kauft etwas anderes, als er denkt.',
      'Ein weiterer Punkt ist die Herkunft. Ein sehr großer Teil der Weltförderung stammt aus wenigen Ländern, allen voran Südafrika. Streiks, Stromausfälle oder politische Verwerfungen dort wirken unmittelbar auf den Preis – ein Klumpenrisiko auf der Angebotsseite, das es bei Gold in dieser Form nicht gibt.',
    ],
    relatedTopics: ['rohstoffe', 'risiko-und-rendite', 'aktien-laender-branchen'],
    seed: { startValue: 962, annualDrift: 0.041, annualVolatility: 0.24, seed: 22309 },
  },
  {
    symbol: 'palladium',
    ticker: 'Palladium',
    name: 'Palladium (Feinunze)',
    kind: 'commodity',
    unit: 'USD',
    decimals: 2,
    summary:
      'Das schwankungsfreudigste Edelmetall – ein winziger Markt, an dem eine einzelne Störung den Preis verdoppeln kann.',
    metaDescription:
      'Der Palladiumpreis je Feinunze in US-Dollar: Stand, Chart über fünf Jahre und warum dieser Markt so extrem schwankt.',
    description: [
      'Palladium gehört zur Platingruppe und wird ebenfalls je Feinunze in US-Dollar notiert. Der weitaus größte Teil der Nachfrage entfällt auf Abgaskatalysatoren für Benzinfahrzeuge – eine einzige Anwendung, die den Preis fast im Alleingang bestimmt.',
      'Das macht Palladium zum Lehrstück über dünne Märkte. Der weltweite Handel ist klein, das Angebot konzentriert sich auf Russland und Südafrika, und Recycling deckt einen erheblichen Teil ab. Wenn in einem solchen Markt eine Störung auftritt, gibt es keinen Puffer: In den vergangenen Jahren hat sich der Preis binnen weniger Monate verdoppelt und anschließend wieder gedrittelt.',
      'Für die Zukunft steht dabei eine strukturelle Frage im Raum. Elektrofahrzeuge brauchen keinen Abgaskatalysator. Je weiter deren Anteil steigt, desto stärker fällt die Hauptnachfrage weg – ein Risiko, das kein Chart der Vergangenheit zeigt, weil es noch nicht eingetreten ist.',
    ],
    relatedTopics: ['rohstoffe', 'risiko-und-rendite', 'wie-funktioniert-der-markt'],
    seed: { startValue: 1420, annualDrift: -0.055, annualVolatility: 0.38, seed: 22310 },
  },
  {
    symbol: 'kupfer',
    ticker: 'Kupfer',
    name: 'Kupfer (je Pfund)',
    kind: 'commodity',
    unit: 'USD/lb',
    decimals: 4,
    summary:
      'Das Metall mit dem Spitznamen „Dr. Copper“ – weil sein Preis die Weltkonjunktur oft früher anzeigt als jede Statistik.',
    metaDescription:
      'Der Kupferpreis je Pfund in US-Dollar: Stand, Chart über fünf Jahre und warum Kupfer als Frühindikator der Weltkonjunktur gilt.',
    description: [
      'Kupfer wird an der COMEX **je Pfund** notiert, nicht je Feinunze – rund 454 Gramm statt 31,1. An der Londoner Metallbörse gilt dagegen die Tonne. Wer Preise vergleicht, muss deshalb zuerst auf die Einheit schauen; dieselbe Ware kostet je nach Notierung Zahlen in völlig verschiedenen Größenordnungen.',
      'Der Spitzname **Dr. Copper** stammt daher, dass Kupfer in fast jeder industriellen Anwendung steckt: Gebäude, Stromnetze, Motoren, Elektronik. Wird gebaut und produziert, steigt die Nachfrage; kühlt die Wirtschaft ab, fällt sie. Weil Bestellungen den Statistiken vorauslaufen, gilt der Kupferpreis als Frühindikator für die Weltkonjunktur – mit dem üblichen Vorbehalt, dass kein Indikator zuverlässig ist.',
      'Hinzu gekommen ist in den letzten Jahren die Energiewende. Elektrofahrzeuge, Windkraftanlagen und der Ausbau der Stromnetze brauchen ein Vielfaches an Kupfer gegenüber der bisherigen Technik. Dem steht ein Angebot gegenüber, das sich nur langsam ausweiten lässt: Von der Entdeckung einer Lagerstätte bis zur Förderung vergehen typischerweise über zehn Jahre.',
    ],
    relatedTopics: ['rohstoffe', 'inflation', 'aktien-laender-branchen'],
    seed: { startValue: 3.86, annualDrift: 0.068, annualVolatility: 0.26, seed: 22311 },
  },
  {
    symbol: 'erdgas',
    ticker: 'Erdgas',
    name: 'Erdgas (Henry Hub)',
    kind: 'commodity',
    unit: 'USD/MMBtu',
    decimals: 3,
    summary:
      'Der amerikanische Gaspreis – notiert je Energieeinheit, nicht je Volumen, und der schwankungsreichste große Rohstoff.',
    metaDescription:
      'Der Erdgaspreis am Henry Hub in US-Dollar je MMBtu: Stand, Chart über fünf Jahre und warum Gas regional so unterschiedlich kostet.',
    description: [
      'Erdgas wird am Henry Hub in Louisiana in **US-Dollar je MMBtu** notiert – eine Energieeinheit, keine Volumeneinheit. Das ist sinnvoll, weil der Brennwert von Gas je nach Zusammensetzung schwankt; bezahlt wird die Energie, nicht der Kubikmeter.',
      'Anders als Öl hat Gas keinen wirklichen Weltmarktpreis. Es lässt sich nur über Pipelines oder als aufwendig verflüssigtes LNG transportieren, weshalb es in Amerika, Europa und Asien gleichzeitig völlig verschieden kosten kann. Der europäische Referenzpreis TTF und der Henry Hub liefen in den Energiekrisen um ein Vielfaches auseinander.',
      'Gas ist zugleich der schwankungsreichste unter den großen Rohstoffen. Ein kalter Winter, ein ausgefallenes Terminal oder eine volle Speicherlage bewegen den Preis um Größenordnungen, die es an Aktienmärkten nicht gibt – die Speicherfähigkeit ist begrenzt, und der Verbrauch lässt sich kurzfristig kaum anpassen.',
    ],
    relatedTopics: ['rohstoffe', 'inflation', 'notenbanken-geldpolitik'],
    seed: { startValue: 2.84, annualDrift: 0.031, annualVolatility: 0.62, seed: 22312 },
  },
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
    symbol: 'bitcoin',
    ticker: 'Bitcoin',
    name: 'Bitcoin (BTC/USD)',
    kind: 'crypto',
    unit: 'USD',
    decimals: 0,
    summary:
      'Die älteste und größte Kryptowährung – ein Preis ohne Bewertungsgrundlage, gebildet allein aus Angebot und Nachfrage.',
    metaDescription:
      'Der Bitcoin-Kurs in US-Dollar: Stand, Chart über fünf Jahre und warum sich für Bitcoin – anders als für Aktien – kein fairer Wert berechnen lässt.',
    description: [
      'Bitcoin wird rund um die Uhr gehandelt, auch an Wochenenden und Feiertagen. Damit unterscheidet er sich schon in der Mechanik von allen anderen Kursen auf dieser Seite: Es gibt keinen Handelsschluss, an dem sich ein Tageskurs festmachen ließe – der übliche Bezugspunkt ist Mitternacht UTC.',
      'Der entscheidende Unterschied liegt aber in der Bewertung. Bei einer Aktie lässt sich ein Wert herleiten: Ein Unternehmen erwirtschaftet Gewinne, zahlt Dividenden, besitzt Anlagen. Bei einer Anleihe stehen Zins und Rückzahlung im Vertrag. **Bitcoin hat nichts davon.** Der Preis ergibt sich vollständig daraus, was der nächste Käufer zu zahlen bereit ist. Das ist kein Werturteil, sondern eine Feststellung über die Methode: Kursziele für Bitcoin sind keine Bewertungen, sondern Erwartungen.',
      'Die Menge ist auf 21 Millionen Einheiten begrenzt, und die Neuausgabe halbiert sich in festen Abständen. Diese Knappheit ist der am häufigsten genannte Grund für steigende Preise – sie erklärt allerdings nur die Angebotsseite. Ohne Nachfrage ist auch ein knappes Gut nichts wert. Schwankungen von 60 Prozent und mehr innerhalb eines Jahres sind in beide Richtungen vorgekommen.',
    ],
    relatedTopics: ['bitcoin-krypto', 'blockchain', 'risiko-und-rendite'],
    seed: { startValue: 41200, annualDrift: 0.19, annualVolatility: 0.62, seed: 22308 },
  },
  {
    symbol: 'nvidia',
    ticker: 'NVDA',
    name: 'NVIDIA',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Der Hersteller der Chips, auf denen künstliche Intelligenz gerechnet wird – und zeitweise das wertvollste Unternehmen der Welt.',
    metaDescription:
      'Die NVIDIA-Aktie in US-Dollar: Stand, Chart über fünf Jahre und wie ein einzelnes Unternehmen einen ganzen Index bewegen kann.',
    description: [
      'NVIDIA stellt Grafik- und Rechenchips her. Ursprünglich für Computerspiele entwickelt, erwiesen sie sich als genau die Bauart, die das Training großer KI-Modelle braucht – tausende einfache Rechnungen gleichzeitig statt weniger komplexer nacheinander. Aus einem Zulieferer der Spielebranche wurde damit der Engpass einer ganzen Technologiewelle.',
      'Für die Geldanlage ist die Aktie vor allem als Beispiel lehrreich. Ein Unternehmen dieser Größe bewegt den S&P 500 und den Nasdaq 100 spürbar allein. Wer einen weltweit streuenden ETF hält, hält davon einen erheblichen Anteil, ohne es je entschieden zu haben – das ist der Unterschied zwischen Streuung nach Anzahl und Streuung nach Gewicht.',
      'Die Bewertung hängt an Erwartungen über Jahre hinaus. Wird die Nachfrage nach KI-Rechenleistung so weiterwachsen? Gelingt es Wettbewerbern, den Vorsprung aufzuholen? Beides sind Annahmen, keine Tatsachen. Kursstürze von 50 Prozent und mehr hat die Aktie mehrfach hinter sich – nach jeweils vorangegangenen Vervielfachungen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'anlegerpsychologie'],
    branche: 'Halbleiter',
    sitzland: '840',
    seed: { startValue: 49.2, annualDrift: 0.52, annualVolatility: 0.55, seed: 22401 },
  },
  {
    symbol: 'apple',
    ticker: 'AAPL',
    name: 'Apple',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Der Konzern hinter iPhone und Mac – ein Geschäftsmodell, das inzwischen weniger von Geräten lebt als von Diensten.',
    metaDescription:
      'Die Apple-Aktie in US-Dollar: Stand, Chart über fünf Jahre und was den Wandel vom Gerätehersteller zum Dienstleister für Anleger bedeutet.',
    description: [
      'Apple verkauft Geräte, verdient aber zunehmend an dem, was darauf läuft: App Store, Abonnements, Zahlungsdienste. Dieser Teil des Geschäfts hat höhere Margen als die Hardware und wiederholt sich jeden Monat, statt vom nächsten Produktzyklus abzuhängen – der Grund, warum die Aktie höher bewertet wird als andere Hardwarehersteller.',
      'Der Kern des Modells ist die Wechselhürde: Wer Geräte, Fotos, Käufe und Abonnements in einem System hat, wechselt selten. In der Unternehmensanalyse heißt so etwas **Burggraben** – ein struktureller Vorteil, den ein Wettbewerber nicht einfach durch ein besseres Produkt einreißt.',
      'Die Risiken liegen weniger im Wettbewerb als in der Regulierung. Kartellverfahren in Europa und den USA zielen genau auf die geschlossenen Teile des Systems, etwa den App Store. Eine Auflage kann eine Ertragsquelle über Nacht verändern – ein Risiko, das sich aus keiner Kennzahl ablesen lässt.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'wie-funktioniert-der-markt'],
    branche: 'Elektronik',
    sitzland: '840',
    seed: { startValue: 148.6, annualDrift: 0.16, annualVolatility: 0.28, seed: 22402 },
  },
  {
    symbol: 'microsoft',
    ticker: 'MSFT',
    name: 'Microsoft',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Vom Softwarehaus zum Vermieter von Rechenleistung – Microsofts Umbau ist das Lehrbeispiel für wiederkehrende Erlöse.',
    metaDescription:
      'Die Microsoft-Aktie in US-Dollar: Stand, Chart über fünf Jahre und warum der Wechsel von Lizenzen zu Abonnements die Bewertung veränderte.',
    description: [
      'Microsoft hat sein Geschäft in zwei Schritten umgebaut. Erst wanderte die Software vom einmal verkauften Datenträger ins Abonnement, dann kam mit der Cloud-Sparte das Vermieten von Rechenleistung dazu. Beides ersetzt einmalige Erlöse durch wiederkehrende – für die Bewertung einer Aktie der wichtigere Unterschied als die Höhe des Umsatzes.',
      'Warum das zählt: Ein Unternehmen mit planbaren monatlichen Einnahmen ist leichter zu bewerten und übersteht Abschwünge besser als eines, das jedes Quartal neu verkaufen muss. Anleger zahlen dafür regelmäßig einen Aufschlag – dieselbe Logik, die auch hinter der Bewertung von Versorgern oder Vermietern steht.',
      'Der Konzern ist zugleich einer der schwersten Werte in nahezu jedem breiten Aktienindex. Zusammen mit den übrigen großen Technologiewerten bestimmt er die Entwicklung von S&P 500 und MSCI World in einem Maß, das mit dem Wort „gestreut“ nur noch bedingt zu vereinbaren ist.',
    ],
    relatedTopics: ['aktie', 'etf', 'aktien-laender-branchen'],
    branche: 'Software',
    sitzland: '840',
    seed: { startValue: 288.4, annualDrift: 0.21, annualVolatility: 0.26, seed: 22403 },
  },
  {
    symbol: 'alphabet',
    ticker: 'GOOGL',
    name: 'Alphabet (Google)',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Die Google-Mutter – ein Konzern, dessen Gewinn fast vollständig aus einer einzigen Quelle stammt: Werbung.',
    metaDescription:
      'Die Alphabet-Aktie in US-Dollar: Stand, Chart über fünf Jahre und warum die Abhängigkeit von Werbeerlösen das zentrale Risiko ist.',
    description: [
      'Alphabet ist die Dachgesellschaft von Google, YouTube, Android und einer Reihe kleinerer Unternehmungen. Bei aller Breite kommt der ganz überwiegende Teil des Gewinns aus einem einzigen Geschäft: Werbung neben Suchergebnissen und Videos.',
      'Diese Konzentration ist das eigentliche Thema für Anleger. Werbebudgets sind **konjunkturempfindlich** – sie werden gekürzt, sobald Unternehmen sparen, und zwar früher als andere Ausgaben. Eine Rezession trifft Alphabet deshalb unmittelbarer als Unternehmen mit Abonnementerlösen.',
      'Hinzu kommt eine Frage, die es vor wenigen Jahren nicht gab: Wenn Antworten künftig direkt von einem Sprachmodell kommen statt aus einer Liste von Verweisen, was wird dann aus dem Anzeigenplatz neben dieser Liste? Alphabet baut die eigene Suche entsprechend um – ob das Geschäftsmodell den Umbau unbeschadet übersteht, ist offen.',
    ],
    relatedTopics: ['aktie', 'risiko-und-rendite', 'aktien-laender-branchen'],
    branche: 'Technologie',
    sitzland: '840',
    seed: { startValue: 118.9, annualDrift: 0.18, annualVolatility: 0.3, seed: 22404 },
  },
  {
    symbol: 'amazon',
    ticker: 'AMZN',
    name: 'Amazon',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Bekannt als Onlinehändler, verdient wird das Geld aber überwiegend mit Cloud-Diensten und Werbung.',
    metaDescription:
      'Die Amazon-Aktie in US-Dollar: Stand, Chart über fünf Jahre und warum der Handel den Umsatz bringt, der Gewinn aber woanders entsteht.',
    description: [
      'Amazon ist im Bewusstsein der meisten ein Versandhändler. Betriebswirtschaftlich stimmt das nur für den Umsatz: Der weitaus größte Teil des **Gewinns** stammt aus der Cloud-Sparte AWS, die Rechenleistung an andere Unternehmen vermietet, sowie zunehmend aus Werbung auf der eigenen Handelsplattform.',
      'Der Handel selbst arbeitet mit sehr dünnen Margen – ein Geschäft mit gewaltigem Volumen und wenig Ertrag je Verkauf. Wer die Aktie einordnen will, muss die Segmentzahlen im Quartalsbericht lesen, nicht die Gesamtsumme. Genau hier trennt sich das Bild, das die Marke erzeugt, von dem, was das Unternehmen wirtschaftlich ist.',
      'Über viele Jahre wies Amazon bewusst kaum Gewinn aus und investierte stattdessen in Lager, Logistik und Rechenzentren. Ein Kurs-Gewinn-Verhältnis war in dieser Zeit praktisch nicht zu bilden – ein gutes Beispiel dafür, dass eine gebräuchliche Kennzahl nicht auf jedes Unternehmen anwendbar ist.',
    ],
    relatedTopics: ['aktie', 'wie-funktioniert-der-markt', 'aktien-laender-branchen'],
    branche: 'Handel',
    sitzland: '840',
    seed: { startValue: 132.7, annualDrift: 0.19, annualVolatility: 0.32, seed: 22405 },
  },
  {
    symbol: 'meta',
    ticker: 'META',
    name: 'Meta Platforms',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Facebook, Instagram und WhatsApp – und ein Milliardenprojekt, dessen Ertrag noch niemand kennt.',
    metaDescription:
      'Die Meta-Aktie in US-Dollar: Stand, Chart über fünf Jahre und was der Kurssturz von 2022 über Erwartungen an der Börse zeigt.',
    description: [
      'Meta betreibt Facebook, Instagram, WhatsApp und Threads und verdient sein Geld nahezu vollständig mit Werbung. Daneben fließen jährlich zweistellige Milliardenbeträge in die Sparte für virtuelle Welten und KI-Infrastruktur – Investitionen, deren Ertrag bislang offen ist.',
      'Das Jahr 2022 ist als Beispiel lehrreich: Die Aktie verlor in der Spitze rund drei Viertel ihres Werts, nachdem das Nutzerwachstum stockte und die Ausgaben stiegen. In den beiden folgenden Jahren holte sie den Verlust vollständig auf. Wer damals verkaufte, verkaufte am Tiefpunkt einer Bewegung, die vor allem aus Erwartungen bestand.',
      'Für Anleger ist daran zweierlei interessant. Erstens: Ein Kurssturz dieser Größenordnung bei einem hochprofitablen Unternehmen ist keine Anomalie, sondern kommt regelmäßig vor. Zweitens: Wer eine einzelne Aktie hält, muss solche Phasen aushalten können – bei einem breit gestreuten Index verteilt sich derselbe Rückgang auf hunderte Werte.',
    ],
    relatedTopics: ['aktie', 'anlegerpsychologie', 'groesste-crashes'],
    branche: 'Technologie',
    sitzland: '840',
    seed: { startValue: 341.2, annualDrift: 0.22, annualVolatility: 0.42, seed: 22406 },
  },
  {
    symbol: 'tesla',
    ticker: 'TSLA',
    name: 'Tesla',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Der Elektroautohersteller mit der Bewertung eines Technologiekonzerns – und der schwankungsreichste Wert der Gruppe.',
    metaDescription:
      'Die Tesla-Aktie in US-Dollar: Stand, Chart über fünf Jahre und warum die Bewertung mehr über Erwartungen aussagt als über verkaufte Autos.',
    description: [
      'Tesla baut Elektrofahrzeuge, Batteriespeicher und Ladeinfrastruktur. Die Bewertung an der Börse liegt seit Jahren um ein Vielfaches über der klassischer Automobilhersteller – gemessen an verkauften Fahrzeugen ergibt das keinen Sinn, gemessen an den Erwartungen an autonomes Fahren, Energiespeicherung und Software durchaus.',
      'Genau darin liegt die Schwierigkeit für Anleger: Ein erheblicher Teil des Kurses beruht auf Vorhaben, die noch nicht eingetreten sind. Solche Bewertungen reagieren empfindlich auf Zinsen – steigen sie, werden weit in der Zukunft liegende Gewinne stärker abgezinst und damit weniger wert. Das erklärt einen Teil der außergewöhnlichen Schwankungen.',
      'Hinzu kommt ein Faktor, den es bei anderen Konzernen dieser Größe kaum gibt: Die Person an der Spitze bewegt den Kurs durch öffentliche Äußerungen messbar. Wer die Aktie hält, trägt dieses Risiko mit, und es lässt sich weder aus Bilanzen noch aus Absatzzahlen ableiten.',
    ],
    relatedTopics: ['aktie', 'risiko-und-rendite', 'anlegerpsychologie'],
    branche: 'Automobil',
    sitzland: '840',
    seed: { startValue: 214.8, annualDrift: 0.12, annualVolatility: 0.58, seed: 22407 },
  },
  {
    symbol: 'ethereum',
    ticker: 'Ethereum',
    name: 'Ethereum (ETH/USD)',
    kind: 'crypto',
    unit: 'USD',
    decimals: 2,
    summary:
      'Die zweitgrößte Kryptowährung – weniger als digitales Geld gedacht, mehr als Plattform für Programme auf der Blockchain.',
    metaDescription:
      'Der Ethereum-Kurs in US-Dollar: Stand, Chart über fünf Jahre und worin sich Ethereum grundlegend von Bitcoin unterscheidet.',
    description: [
      'Ethereum verfolgt einen anderen Zweck als Bitcoin. Während Bitcoin als knappes Wertaufbewahrungsmittel angelegt ist, dient Ethereum als Plattform: Auf ihr laufen **Smart Contracts** – Programme, die sich selbst ausführen, wenn festgelegte Bedingungen eintreten. Der Großteil dessen, was unter Begriffen wie dezentrale Finanzanwendungen firmiert, läuft darauf.',
      'Technisch unterscheidet sich Ethereum seit dem Umstieg auf ein Beteiligungsverfahren deutlich von Bitcoin: Neue Blöcke werden nicht mehr errechnet, sondern von Teilnehmern bestätigt, die eigene Einheiten als Sicherheit hinterlegen. Der Energieverbrauch sank dadurch um weit über 99 Prozent.',
      'Für die Bewertung gilt dasselbe wie bei Bitcoin: Es gibt keine Gewinne, keine Dividende, keinen Vertrag. Der Preis ergibt sich allein aus Angebot und Nachfrage. Wer Ethereum kauft, wettet auf die weitere Nutzung dieser Plattform – nicht auf ein Unternehmen, das damit Geld verdient.',
    ],
    relatedTopics: ['bitcoin-krypto', 'blockchain', 'risiko-und-rendite'],
    seed: { startValue: 1840, annualDrift: 0.14, annualVolatility: 0.72, seed: 22313 },
  },
  {
    symbol: 'xrp',
    ticker: 'XRP',
    name: 'XRP (XRP/USD)',
    kind: 'crypto',
    unit: 'USD',
    decimals: 4,
    summary:
      'Für schnelle grenzüberschreitende Zahlungen entworfen – und jahrelang Gegenstand eines Rechtsstreits mit der US-Börsenaufsicht.',
    metaDescription:
      'Der XRP-Kurs in US-Dollar: Stand, Chart über fünf Jahre und warum bei XRP die Rechtslage wichtiger war als die Technik.',
    description: [
      'XRP wurde für den schnellen Transfer von Werten zwischen Finanzinstituten entworfen. Eine Überweisung ist in Sekunden bestätigt, zu sehr geringen Gebühren – gedacht als Ersatz für die Vorhaltung von Guthaben in fremden Währungen, wie sie Banken für den Auslandszahlungsverkehr benötigen.',
      'Anders als bei Bitcoin und Ethereum existierte die Gesamtmenge von Anfang an; sie wurde nicht nach und nach ausgegeben. Ein erheblicher Teil liegt bei dem Unternehmen hinter der Technik, das die Bestände nach festgelegten Regeln freigibt – eine Konzentration, die es bei den beiden größeren Kryptowährungen so nicht gibt.',
      'Prägend war über Jahre nicht die Technik, sondern ein Verfahren der US-Börsenaufsicht zu der Frage, ob XRP als Wertpapier einzuordnen ist. Der Kurs folgte in dieser Zeit Gerichtsterminen statt Marktdaten – ein Beispiel dafür, dass bei Kryptowährungen die Rechtslage ein eigenständiger Risikofaktor ist.',
    ],
    relatedTopics: ['bitcoin-krypto', 'blockchain', 'risiko-und-rendite'],
    seed: { startValue: 0.52, annualDrift: 0.11, annualVolatility: 0.86, seed: 22314 },
  },
  {
    symbol: 'broadcom',
    ticker: 'AVGO',
    name: 'Broadcom',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Halbleiter: Entwickelt Chips für Netzwerke, Rechenzentren und Mobilgeräte und betreibt daneben ein großes Softwaregeschäft.',
    metaDescription:
      'Die Broadcom-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Broadcom entwickelt Chips für Netzwerke, Rechenzentren und Mobilgeräte und betreibt daneben ein großes Softwaregeschäft. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Der Umbau vom reinen Chiphersteller zum Mischkonzern mit Softwareanteil macht die Erträge planbarer als bei Wettbewerbern, die allein am Halbleiterzyklus hängen.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Halbleiter',
    sitzland: '840',
    seed: { startValue: 440.64, annualDrift: 0.082, annualVolatility: 0.42, seed: 23000 },
  },
  {
    symbol: 'amd',
    ticker: 'AMD',
    name: 'Advanced Micro Devices',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Halbleiter: Stellt Prozessoren und Grafikchips für Rechenzentren, Computer und Spielkonsolen her.',
    metaDescription:
      'Die Advanced Micro Devices-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Advanced Micro Devices stellt Prozessoren und Grafikchips für Rechenzentren, Computer und Spielkonsolen her. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'AMD ist der wichtigste Herausforderer in einem Markt mit sehr wenigen Anbietern – ein Wettbewerbsvorteil kann hier binnen einer Produktgeneration wechseln.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Halbleiter',
    sitzland: '840',
    seed: { startValue: 85.248, annualDrift: 0.082, annualVolatility: 0.42, seed: 23001 },
  },
  {
    symbol: 'intel',
    ticker: 'INTC',
    name: 'Intel',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Halbleiter: Entwickelt und fertigt Prozessoren und baut den Betrieb eigener Chipfabriken aus.',
    metaDescription:
      'Die Intel-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Intel entwickelt und fertigt Prozessoren und baut den Betrieb eigener Chipfabriken aus. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Anders als die meisten Wettbewerber produziert Intel selbst statt fertigen zu lassen – das bindet enorm viel Kapital und macht das Unternehmen schwerfälliger, aber unabhängiger.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Halbleiter',
    sitzland: '840',
    seed: { startValue: 23.688, annualDrift: 0.082, annualVolatility: 0.42, seed: 23002 },
  },
  {
    symbol: 'qualcomm',
    ticker: 'QCOM',
    name: 'Qualcomm',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Halbleiter: Liefert Mobilfunkchips und verdient zusätzlich an Patenten, die in nahezu jedem Smartphone stecken.',
    metaDescription:
      'Die Qualcomm-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Qualcomm liefert Mobilfunkchips und verdient zusätzlich an Patenten, die in nahezu jedem Smartphone stecken. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Die Lizenzerlöse sind margenstark und wiederkehrend, hängen aber an Patenten mit Laufzeit – ein Geschäft mit eingebautem Ablaufdatum.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Halbleiter',
    sitzland: '840',
    seed: {
      startValue: 120.384,
      annualDrift: 0.082,
      annualVolatility: 0.42,
      seed: 23003,
    },
  },
  {
    symbol: 'texas-instruments',
    ticker: 'TXN',
    name: 'Texas Instruments',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Halbleiter: Stellt analoge Chips her, die in Industrieanlagen, Autos und Haushaltsgeräten Strom und Signale steuern.',
    metaDescription:
      'Die Texas Instruments-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Texas Instruments stellt analoge Chips her, die in Industrieanlagen, Autos und Haushaltsgeräten Strom und Signale steuern. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Analogchips veralten langsamer als Prozessoren und werden über Jahrzehnte nachgefragt – ein unspektakuläres, aber bemerkenswert beständiges Geschäft.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Halbleiter',
    sitzland: '840',
    seed: {
      startValue: 135.792,
      annualDrift: 0.082,
      annualVolatility: 0.42,
      seed: 23004,
    },
  },
  {
    symbol: 'oracle',
    ticker: 'ORCL',
    name: 'Oracle',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Software: Betreibt Datenbanken und Unternehmenssoftware und vermietet zunehmend Rechenleistung.',
    metaDescription:
      'Die Oracle-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Oracle betreibt Datenbanken und Unternehmenssoftware und vermietet zunehmend Rechenleistung. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Der Wechsel vom Lizenzverkauf zur Vermietung verändert die Ertragsstruktur grundlegend – erst planbarer, aber zunächst kapitalintensiv.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Software',
    sitzland: '840',
    seed: {
      startValue: 110.016,
      annualDrift: 0.082,
      annualVolatility: 0.32,
      seed: 23005,
    },
  },
  {
    symbol: 'salesforce',
    ticker: 'CRM',
    name: 'Salesforce',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Software: Vermietet Software für Vertrieb, Kundenbetreuung und Marketing.',
    metaDescription:
      'Die Salesforce-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Salesforce vermietet Software für Vertrieb, Kundenbetreuung und Marketing. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Ein reines Abonnementgeschäft: Der Umsatz wiederholt sich, solange Kunden bleiben – die Abwanderungsquote ist deshalb die zentrale Kennzahl.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Software',
    sitzland: '840',
    seed: {
      startValue: 193.176,
      annualDrift: 0.082,
      annualVolatility: 0.32,
      seed: 23006,
    },
  },
  {
    symbol: 'adobe',
    ticker: 'ADBE',
    name: 'Adobe',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Software: Stellt Programme für Bild, Video und Dokumente bereit, überwiegend im Abonnement.',
    metaDescription:
      'Die Adobe-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Adobe stellt Programme für Bild, Video und Dokumente bereit, überwiegend im Abonnement. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Der Umstieg vom Kauf zur Miete gilt als Musterbeispiel dafür, wie ein Softwarehaus seine Bewertung durch wiederkehrende Erlöse verändert.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Software',
    sitzland: '840',
    seed: {
      startValue: 368.928,
      annualDrift: 0.082,
      annualVolatility: 0.32,
      seed: 23007,
    },
  },
  {
    symbol: 'sap',
    ticker: 'SAP',
    name: 'SAP',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Software: Liefert Software zur Steuerung von Geschäftsprozessen in Großunternehmen.',
    metaDescription:
      'Die SAP-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'SAP liefert Software zur Steuerung von Geschäftsprozessen in Großunternehmen. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Der schwerste Wert im DAX – die Aktie bewegt den deutschen Leitindex spürbar allein, was bei einem Index mit nur 40 Werten stark durchschlägt.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Software',
    sitzland: '276',
    seed: {
      startValue: 124.488,
      annualDrift: 0.082,
      annualVolatility: 0.32,
      seed: 23008,
    },
  },
  {
    symbol: 'asml',
    ticker: 'ASML',
    name: 'ASML',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Halbleiter: Baut die Belichtungsmaschinen, ohne die moderne Chips nicht herstellbar sind.',
    metaDescription:
      'Die ASML-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'ASML baut die Belichtungsmaschinen, ohne die moderne Chips nicht herstellbar sind. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Bei der modernsten Technik gibt es weltweit keinen zweiten Anbieter – ein Monopol, das zugleich zum Spielball von Exportbeschränkungen macht.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Halbleiter',
    sitzland: '528',
    seed: { startValue: 502.92, annualDrift: 0.082, annualVolatility: 0.42, seed: 23009 },
  },
  {
    symbol: 'tsmc',
    ticker: 'TSM',
    name: 'TSMC',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Halbleiter: Fertigt Chips im Auftrag fast aller großen Entwickler.',
    metaDescription:
      'Die TSMC-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'TSMC fertigt Chips im Auftrag fast aller großen Entwickler. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Der Engpass der gesamten Elektronikindustrie – und geografisch auf Taiwan konzentriert, was ein politisches Risiko ohne Entsprechung schafft.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Halbleiter',
    sitzland: '158',
    seed: {
      startValue: 102.744,
      annualDrift: 0.082,
      annualVolatility: 0.42,
      seed: 23010,
    },
  },
  {
    symbol: 'cisco',
    ticker: 'CSCO',
    name: 'Cisco Systems',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Netzwerktechnik: Stellt Router, Switches und Netzwerksicherheit für Unternehmen her.',
    metaDescription:
      'Die Cisco Systems-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Cisco Systems stellt Router, Switches und Netzwerksicherheit für Unternehmen her. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Ein reifes Geschäft mit stabilen Erträgen und Dividende – Wachstum kommt hier eher aus Zukäufen als aus dem Markt selbst.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Technologie',
    sitzland: '840',
    seed: { startValue: 40.392, annualDrift: 0.082, annualVolatility: 0.3, seed: 23011 },
  },
  {
    symbol: 'ibm',
    ticker: 'IBM',
    name: 'IBM',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'IT-Dienstleistungen: Betreibt Großrechner, Beratung und Software für Unternehmen.',
    metaDescription:
      'Die IBM-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'IBM betreibt Großrechner, Beratung und Software für Unternehmen. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Eines der ältesten Technologieunternehmen überhaupt, mehrfach neu ausgerichtet – ein Beispiel dafür, dass Größe allein keine Marktstellung sichert.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Technologie',
    sitzland: '840',
    seed: { startValue: 164.448, annualDrift: 0.082, annualVolatility: 0.3, seed: 23012 },
  },
  {
    symbol: 'palantir',
    ticker: 'PLTR',
    name: 'Palantir',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Software: Entwickelt Analysesoftware für Behörden, Militär und Industrie.',
    metaDescription:
      'Die Palantir-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Palantir entwickelt Analysesoftware für Behörden, Militär und Industrie. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Ein erheblicher Teil der Erlöse stammt von staatlichen Auftraggebern – planbar, solange Budgets bestehen, und politisch abhängig.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Software',
    sitzland: '840',
    seed: { startValue: 30.816, annualDrift: 0.082, annualVolatility: 0.32, seed: 23013 },
  },
  {
    symbol: 'netflix',
    ticker: 'NFLX',
    name: 'Netflix',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Medien: Betreibt einen weltweiten Abonnementdienst für Filme und Serien.',
    metaDescription:
      'Die Netflix-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Netflix betreibt einen weltweiten Abonnementdienst für Filme und Serien. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Wachstum kommt inzwischen weniger aus neuen Abonnenten als aus Preiserhöhungen und Werbung – ein Wechsel des Geschäftsmodells im laufenden Betrieb.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Unterhaltung',
    sitzland: '840',
    seed: { startValue: 513.072, annualDrift: 0.082, annualVolatility: 0.3, seed: 23014 },
  },
  {
    symbol: 'uber',
    ticker: 'UBER',
    name: 'Uber',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Plattform: Vermittelt Fahrten und Essenslieferungen über eine App.',
    metaDescription:
      'Die Uber-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Uber vermittelt Fahrten und Essenslieferungen über eine App. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Plattformgeschäfte skalieren stark, hängen aber an der arbeitsrechtlichen Einordnung der Fahrer – ein Urteil kann die Kostenstruktur über Nacht ändern.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Transport',
    sitzland: '840',
    seed: { startValue: 56.808, annualDrift: 0.082, annualVolatility: 0.3, seed: 23015 },
  },
  {
    symbol: 'airbnb',
    ticker: 'ABNB',
    name: 'Airbnb',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Plattform: Vermittelt private Unterkünfte weltweit.',
    metaDescription:
      'Die Airbnb-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Airbnb vermittelt private Unterkünfte weltweit. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Das Unternehmen besitzt keine Immobilien und trägt damit kaum Kapitalbindung – dafür ist es von lokalen Vermietungsverboten abhängig.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Reise',
    sitzland: '840',
    seed: { startValue: 95.4, annualDrift: 0.082, annualVolatility: 0.3, seed: 23016 },
  },
  {
    symbol: 'paypal',
    ticker: 'PYPL',
    name: 'PayPal',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Zahlungsdienste: Wickelt Online-Zahlungen für Händler und Privatpersonen ab.',
    metaDescription:
      'Die PayPal-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'PayPal wickelt Online-Zahlungen für Händler und Privatpersonen ab. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Der Vorsprung aus der Frühzeit des Onlinehandels schmilzt, seit Banken, Apple und Google eigene Bezahlwege anbieten.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Zahlungsverkehr',
    sitzland: '840',
    seed: { startValue: 49.104, annualDrift: 0.082, annualVolatility: 0.3, seed: 23017 },
  },
  {
    symbol: 'visa',
    ticker: 'V',
    name: 'Visa',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Zahlungsdienste: Betreibt das Netz, über das Kartenzahlungen weltweit abgewickelt werden.',
    metaDescription:
      'Die Visa-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Visa betreibt das Netz, über das Kartenzahlungen weltweit abgewickelt werden. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Visa vergibt keine Karten und trägt kein Kreditrisiko – verdient wird an jeder Transaktion, unabhängig davon, ob der Kunde zahlungsfähig bleibt.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Zahlungsverkehr',
    sitzland: '840',
    seed: { startValue: 208.584, annualDrift: 0.082, annualVolatility: 0.3, seed: 23018 },
  },
  {
    symbol: 'mastercard',
    ticker: 'MA',
    name: 'Mastercard',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Zahlungsdienste: Betreibt eines der beiden weltweiten Kartenzahlungsnetze.',
    metaDescription:
      'Die Mastercard-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Mastercard betreibt eines der beiden weltweiten Kartenzahlungsnetze. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Zusammen mit Visa ein faktisches Duopol – ein Wettbewerbsvorteil, der regelmäßig Kartellbehörden beschäftigt.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Zahlungsverkehr',
    sitzland: '840',
    seed: { startValue: 337.176, annualDrift: 0.082, annualVolatility: 0.3, seed: 23019 },
  },
  {
    symbol: 'eli-lilly',
    ticker: 'LLY',
    name: 'Eli Lilly',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Pharma: Entwickelt Medikamente, unter anderem gegen Diabetes und Adipositas.',
    metaDescription:
      'Die Eli Lilly-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Eli Lilly entwickelt Medikamente, unter anderem gegen Diabetes und Adipositas. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Der Erfolg hängt an wenigen Präparaten mit Patentschutz – läuft ein Patent aus, bricht der zugehörige Umsatz üblicherweise stark ein.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Pharma',
    sitzland: '840',
    seed: {
      startValue: 606.312,
      annualDrift: 0.082,
      annualVolatility: 0.26,
      seed: 23020,
    },
  },
  {
    symbol: 'johnson-johnson',
    ticker: 'JNJ',
    name: 'Johnson & Johnson',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Pharma: Stellt Medikamente und Medizintechnik her.',
    metaDescription:
      'Die Johnson & Johnson-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Johnson & Johnson stellt Medikamente und Medizintechnik her. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Ein breit aufgestelltes Gesundheitsunternehmen mit jahrzehntelang steigender Dividende – dafür immer wieder mit Produkthaftungsverfahren belastet.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Pharma',
    sitzland: '840',
    seed: {
      startValue: 116.928,
      annualDrift: 0.082,
      annualVolatility: 0.26,
      seed: 23021,
    },
  },
  {
    symbol: 'unitedhealth',
    ticker: 'UNH',
    name: 'UnitedHealth',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Krankenversicherung: Betreibt Krankenversicherungen und Gesundheitsdienstleistungen in den USA.',
    metaDescription:
      'Die UnitedHealth-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'UnitedHealth betreibt Krankenversicherungen und Gesundheitsdienstleistungen in den USA. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Das Geschäft hängt unmittelbar an der amerikanischen Gesundheitspolitik – eine Reform trifft es direkter als jedes Marktumfeld.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Gesundheit',
    sitzland: '840',
    seed: { startValue: 380.808, annualDrift: 0.082, annualVolatility: 0.3, seed: 23022 },
  },
  {
    symbol: 'abbvie',
    ticker: 'ABBV',
    name: 'AbbVie',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Pharma: Entwickelt Medikamente gegen Autoimmunerkrankungen und Krebs.',
    metaDescription:
      'Die AbbVie-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'AbbVie entwickelt Medikamente gegen Autoimmunerkrankungen und Krebs. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Der Konzern musste den Patentablauf seines wichtigsten Medikaments verkraften – ein Lehrstück über Klumpenrisiko in der Pharmabranche.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Pharma',
    sitzland: '840',
    seed: {
      startValue: 132.912,
      annualDrift: 0.082,
      annualVolatility: 0.26,
      seed: 23023,
    },
  },
  {
    symbol: 'merck',
    ticker: 'MRK',
    name: 'Merck & Co.',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Pharma: Forscht und produziert Medikamente, besonders in der Krebstherapie.',
    metaDescription:
      'Die Merck & Co.-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Merck & Co. forscht und produziert Medikamente, besonders in der Krebstherapie. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Nicht zu verwechseln mit der deutschen Merck KGaA – zwei getrennte Unternehmen mit gemeinsamer Geschichte und ähnlichem Namen.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Pharma',
    sitzland: '840',
    seed: { startValue: 81.216, annualDrift: 0.082, annualVolatility: 0.26, seed: 23024 },
  },
  {
    symbol: 'pfizer',
    ticker: 'PFE',
    name: 'Pfizer',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Pharma: Entwickelt und produziert Medikamente und Impfstoffe.',
    metaDescription:
      'Die Pfizer-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Pfizer entwickelt und produziert Medikamente und Impfstoffe. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Der Umsatzsprung der Pandemiejahre und sein anschließender Wegfall zeigen, wie schwer ein einzelnes Produkt planbar ist.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Pharma',
    sitzland: '840',
    seed: { startValue: 20.448, annualDrift: 0.082, annualVolatility: 0.26, seed: 23025 },
  },
  {
    symbol: 'thermo-fisher',
    ticker: 'TMO',
    name: 'Thermo Fisher Scientific',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Labortechnik: Liefert Geräte und Verbrauchsmaterial für Forschungslabore.',
    metaDescription:
      'Die Thermo Fisher Scientific-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Thermo Fisher Scientific liefert Geräte und Verbrauchsmaterial für Forschungslabore. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Verkauft wird an Forschung und Pharmaindustrie – ein Zulieferer, dessen Nachfrage an Forschungsbudgets hängt, nicht an Endverbrauchern.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Medizintechnik',
    sitzland: '840',
    seed: { startValue: 416.304, annualDrift: 0.082, annualVolatility: 0.3, seed: 23026 },
  },
  {
    symbol: 'novo-nordisk',
    ticker: 'NVO',
    name: 'Novo Nordisk',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Pharma: Stellt Medikamente gegen Diabetes und Adipositas her.',
    metaDescription:
      'Die Novo Nordisk-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Novo Nordisk stellt Medikamente gegen Diabetes und Adipositas her. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Zeitweise das wertvollste Unternehmen Europas – die Bewertung ruht auf sehr wenigen Präparaten in einem hart umkämpften Feld.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Pharma',
    sitzland: '208',
    seed: { startValue: 66.672, annualDrift: 0.082, annualVolatility: 0.26, seed: 23027 },
  },
  {
    symbol: 'roche',
    ticker: 'ROG.SW',
    name: 'Roche',
    kind: 'stock',
    unit: 'CHF',
    decimals: 2,
    summary:
      'Pharma: Forscht an Medikamenten und betreibt eines der größten Diagnostikgeschäfte.',
    metaDescription:
      'Die Roche-Aktie in CHF: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Roche forscht an Medikamenten und betreibt eines der größten Diagnostikgeschäfte. Notiert wird die Aktie an der Börse SIX Swiss Exchange in CHF.',
      'Die Kombination aus Medikamenten und Diagnostik ist in dieser Größe selten und macht das Unternehmen weniger abhängig von einzelnen Wirkstoffen.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Pharma',
    sitzland: '756',
    seed: {
      startValue: 200.448,
      annualDrift: 0.082,
      annualVolatility: 0.26,
      seed: 23028,
    },
  },
  {
    symbol: 'novartis',
    ticker: 'NOVN.SW',
    name: 'Novartis',
    kind: 'stock',
    unit: 'CHF',
    decimals: 2,
    summary: 'Pharma: Entwickelt und vertreibt verschreibungspflichtige Medikamente.',
    metaDescription:
      'Die Novartis-Aktie in CHF: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Novartis entwickelt und vertreibt verschreibungspflichtige Medikamente. Notiert wird die Aktie an der Börse SIX Swiss Exchange in CHF.',
      'Nach der Abspaltung des Generikageschäfts ein reiner Anbieter patentgeschützter Präparate – höhere Margen, höheres Patentrisiko.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Pharma',
    sitzland: '756',
    seed: { startValue: 71.064, annualDrift: 0.082, annualVolatility: 0.26, seed: 23029 },
  },
  {
    symbol: 'jpmorgan',
    ticker: 'JPM',
    name: 'JPMorgan Chase',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Bank: Betreibt Privatkunden-, Firmenkunden- und Investmentbanking.',
    metaDescription:
      'Die JPMorgan Chase-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'JPMorgan Chase betreibt Privatkunden-, Firmenkunden- und Investmentbanking. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Die größte US-Bank – Bankaktien reagieren stark auf Zinsen und auf Kreditausfälle, also gleich auf zwei Seiten der Konjunktur.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Banken',
    sitzland: '840',
    seed: {
      startValue: 167.616,
      annualDrift: 0.082,
      annualVolatility: 0.34,
      seed: 23030,
    },
  },
  {
    symbol: 'bank-of-america',
    ticker: 'BAC',
    name: 'Bank of America',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Bank: Betreibt vor allem das Privat- und Firmenkundengeschäft in den USA.',
    metaDescription:
      'Die Bank of America-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Bank of America betreibt vor allem das Privat- und Firmenkundengeschäft in den USA. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Stark vom Zinsniveau abhängig: Die Marge zwischen Einlagen- und Kreditzins ist die Hauptertragsquelle.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Banken',
    sitzland: '840',
    seed: { startValue: 31.824, annualDrift: 0.082, annualVolatility: 0.34, seed: 23031 },
  },
  {
    symbol: 'goldman-sachs',
    ticker: 'GS',
    name: 'Goldman Sachs',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Investmentbank: Berät bei Übernahmen, handelt Wertpapiere und verwaltet Vermögen.',
    metaDescription:
      'Die Goldman Sachs-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Goldman Sachs berät bei Übernahmen, handelt Wertpapiere und verwaltet Vermögen. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Das Geschäft schwankt stark mit der Zahl der Börsengänge und Übernahmen – in ruhigen Marktphasen bricht ein Ertragspfeiler weg.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Banken',
    sitzland: '840',
    seed: { startValue: 429.408, annualDrift: 0.082, annualVolatility: 0.3, seed: 23032 },
  },
  {
    symbol: 'berkshire',
    ticker: 'BRK-B',
    name: 'Berkshire Hathaway',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Beteiligungen: Hält Versicherungen, Industriebeteiligungen und ein großes Aktienportfolio.',
    metaDescription:
      'Die Berkshire Hathaway-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Berkshire Hathaway hält Versicherungen, Industriebeteiligungen und ein großes Aktienportfolio. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Eine Beteiligungsgesellschaft statt eines operativen Konzerns – wer sie kauft, kauft im Wesentlichen die Kapitalallokation ihrer Führung.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Beteiligungen',
    sitzland: '840',
    seed: { startValue: 337.608, annualDrift: 0.082, annualVolatility: 0.3, seed: 23033 },
  },
  {
    symbol: 'blackrock',
    ticker: 'BLK',
    name: 'BlackRock',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Vermögensverwaltung: Verwaltet Vermögen für Institutionen und Privatanleger, unter anderem über iShares-ETFs.',
    metaDescription:
      'Die BlackRock-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'BlackRock verwaltet Vermögen für Institutionen und Privatanleger, unter anderem über iShares-ETFs. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Der größte Vermögensverwalter der Welt – die Erträge hängen an den verwalteten Summen und damit an den Kursen selbst.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Finanzdienste',
    sitzland: '840',
    seed: { startValue: 697.104, annualDrift: 0.082, annualVolatility: 0.3, seed: 23034 },
  },
  {
    symbol: 'allianz',
    ticker: 'ALV.DE',
    name: 'Allianz',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary:
      'Versicherung: Betreibt Schaden-, Lebens- und Krankenversicherung sowie Vermögensverwaltung.',
    metaDescription:
      'Die Allianz-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Allianz betreibt Schaden-, Lebens- und Krankenversicherung sowie Vermögensverwaltung. Notiert wird die Aktie an der Börse Xetra in EUR.',
      'Versicherer verdienen an Prämien und an der Anlage der Beiträge – steigende Zinsen wirken deshalb doppelt positiv.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Versicherungen',
    sitzland: '276',
    seed: { startValue: 225.072, annualDrift: 0.082, annualVolatility: 0.3, seed: 23035 },
  },
  {
    symbol: 'munich-re',
    ticker: 'MUV2.DE',
    name: 'Münchener Rück',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary: 'Rückversicherung: Versichert Versicherungen gegen Großschäden.',
    metaDescription:
      'Die Münchener Rück-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Münchener Rück versichert Versicherungen gegen Großschäden. Notiert wird die Aktie an der Börse Xetra in EUR.',
      'Naturkatastrophen schlagen unmittelbar auf das Ergebnis durch – ein Geschäft, dessen Risiko sich mit dem Klima verändert.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Versicherungen',
    sitzland: '276',
    seed: { startValue: 369.216, annualDrift: 0.082, annualVolatility: 0.3, seed: 23036 },
  },
  {
    symbol: 'deutsche-bank',
    ticker: 'DBK.DE',
    name: 'Deutsche Bank',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary: 'Bank: Betreibt Firmenkunden-, Privatkunden- und Investmentbanking.',
    metaDescription:
      'Die Deutsche Bank-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Deutsche Bank betreibt Firmenkunden-, Privatkunden- und Investmentbanking. Notiert wird die Aktie an der Börse Xetra in EUR.',
      'Nach jahrelangem Umbau wieder profitabel – die Aktie ist ein Beispiel dafür, wie lange eine Erholung an der Börse dauern kann.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Banken',
    sitzland: '276',
    seed: { startValue: 13.248, annualDrift: 0.082, annualVolatility: 0.34, seed: 23037 },
  },
  {
    symbol: 'ubs',
    ticker: 'UBSG.SW',
    name: 'UBS',
    kind: 'stock',
    unit: 'CHF',
    decimals: 2,
    summary: 'Bank: Verwaltet Vermögen und betreibt Investmentbanking.',
    metaDescription:
      'Die UBS-Aktie in CHF: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'UBS verwaltet Vermögen und betreibt Investmentbanking. Notiert wird die Aktie an der Börse SIX Swiss Exchange in CHF.',
      'Nach der Übernahme der Credit Suisse die dominierende Schweizer Bank – Integrationen dieser Größe bergen jahrelange Risiken.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Banken',
    sitzland: '756',
    seed: { startValue: 21.456, annualDrift: 0.082, annualVolatility: 0.34, seed: 23038 },
  },
  {
    symbol: 'hsbc',
    ticker: 'HSBA.L',
    name: 'HSBC',
    kind: 'stock',
    unit: 'GBp',
    decimals: 2,
    summary: 'Bank: Betreibt Bankgeschäfte mit Schwerpunkt Asien und Großbritannien.',
    metaDescription:
      'Die HSBC-Aktie in GBp: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'HSBC betreibt Bankgeschäfte mit Schwerpunkt Asien und Großbritannien. Notiert wird die Aktie an der Börse London Stock Exchange in GBp.',
      'Die geografische Ausrichtung macht die Bank zum Spielball zwischen westlicher und chinesischer Regulierung.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Banken',
    sitzland: '826',
    seed: { startValue: 5.3424, annualDrift: 0.082, annualVolatility: 0.34, seed: 23039 },
  },
  {
    symbol: 'walmart',
    ticker: 'WMT',
    name: 'Walmart',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Einzelhandel: Betreibt Supermärkte und Onlinehandel in den USA und weiteren Ländern.',
    metaDescription:
      'Die Walmart-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Walmart betreibt Supermärkte und Onlinehandel in den USA und weiteren Ländern. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Der größte Einzelhändler der Welt arbeitet mit sehr dünnen Margen – schon kleine Kostenverschiebungen wirken stark auf den Gewinn.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Handel',
    sitzland: '840',
    seed: { startValue: 66.528, annualDrift: 0.082, annualVolatility: 0.3, seed: 23040 },
  },
  {
    symbol: 'costco',
    ticker: 'COST',
    name: 'Costco',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Einzelhandel: Betreibt Großhandelsmärkte, die nur Mitgliedern offenstehen.',
    metaDescription:
      'Die Costco-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Costco betreibt Großhandelsmärkte, die nur Mitgliedern offenstehen. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Ein erheblicher Teil des Gewinns stammt aus Mitgliedsbeiträgen statt aus dem Warenverkauf – planbare Erlöse in einem sonst margenschwachen Geschäft.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Handel',
    sitzland: '840',
    seed: { startValue: 642.672, annualDrift: 0.082, annualVolatility: 0.3, seed: 23041 },
  },
  {
    symbol: 'procter-gamble',
    ticker: 'PG',
    name: 'Procter & Gamble',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Konsumgüter: Stellt Wasch-, Reinigungs- und Körperpflegemittel her.',
    metaDescription:
      'Die Procter & Gamble-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Procter & Gamble stellt Wasch-, Reinigungs- und Körperpflegemittel her. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Klassischer defensiver Wert: Die Produkte werden auch in einer Rezession gekauft, das Wachstum bleibt dafür begrenzt.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Konsum',
    sitzland: '840',
    seed: {
      startValue: 118.656,
      annualDrift: 0.082,
      annualVolatility: 0.19,
      seed: 23042,
    },
  },
  {
    symbol: 'coca-cola',
    ticker: 'KO',
    name: 'Coca-Cola',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Getränke: Produziert und lizenziert alkoholfreie Getränke weltweit.',
    metaDescription:
      'Die Coca-Cola-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Coca-Cola produziert und lizenziert alkoholfreie Getränke weltweit. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Das Unternehmen stellt überwiegend Konzentrate her und überlässt die Abfüllung Partnern – ein margenstarkes Modell mit geringer Kapitalbindung.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Getränke',
    sitzland: '840',
    seed: { startValue: 49.104, annualDrift: 0.082, annualVolatility: 0.3, seed: 23043 },
  },
  {
    symbol: 'pepsico',
    ticker: 'PEP',
    name: 'PepsiCo',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Getränke und Snacks: Stellt Getränke und Snackprodukte her.',
    metaDescription:
      'Die PepsiCo-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'PepsiCo stellt Getränke und Snackprodukte her. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Anders als Coca-Cola steht neben den Getränken ein großes Snackgeschäft – breitere Aufstellung, dafür kapitalintensivere Produktion.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Getränke',
    sitzland: '840',
    seed: { startValue: 106.992, annualDrift: 0.082, annualVolatility: 0.3, seed: 23044 },
  },
  {
    symbol: 'mcdonalds',
    ticker: 'MCD',
    name: "McDonald's",
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Gastronomie: Betreibt und verpachtet Schnellrestaurants weltweit.',
    metaDescription:
      "Die McDonald's-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.",
    description: [
      "McDonald's betreibt und verpachtet Schnellrestaurants weltweit. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.",
      'Ein erheblicher Teil des Ertrags stammt aus Immobilien und Franchisegebühren, nicht aus dem Verkauf von Speisen.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Gastgewerbe',
    sitzland: '840',
    seed: { startValue: 214.848, annualDrift: 0.082, annualVolatility: 0.3, seed: 23045 },
  },
  {
    symbol: 'nike',
    ticker: 'NKE',
    name: 'Nike',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Sportartikel: Entwickelt und vertreibt Sportbekleidung und Schuhe.',
    metaDescription:
      'Die Nike-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Nike entwickelt und vertreibt Sportbekleidung und Schuhe. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Die Produktion liegt bei Auftragsfertigern in Asien – Zölle und Lieferketten wirken deshalb direkt auf die Marge.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Konsum',
    sitzland: '840',
    seed: { startValue: 55.296, annualDrift: 0.082, annualVolatility: 0.3, seed: 23046 },
  },
  {
    symbol: 'home-depot',
    ticker: 'HD',
    name: 'Home Depot',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Einzelhandel: Betreibt Baumärkte in Nordamerika.',
    metaDescription:
      'Die Home Depot-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Home Depot betreibt Baumärkte in Nordamerika. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Das Geschäft hängt am Immobilienmarkt: Steigende Bauzinsen bremsen Renovierungen und damit den Umsatz.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Handel',
    sitzland: '840',
    seed: { startValue: 278.064, annualDrift: 0.082, annualVolatility: 0.3, seed: 23047 },
  },
  {
    symbol: 'boeing',
    ticker: 'BA',
    name: 'Boeing',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Luftfahrt: Baut Verkehrsflugzeuge und Rüstungsgüter.',
    metaDescription:
      'Die Boeing-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Boeing baut Verkehrsflugzeuge und Rüstungsgüter. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Neben Airbus einer von nur zwei Herstellern großer Verkehrsflugzeuge – ein Duopol, das durch Qualitätsprobleme unter Druck geriet.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Luftfahrt',
    sitzland: '840',
    seed: { startValue: 128.448, annualDrift: 0.082, annualVolatility: 0.3, seed: 23048 },
  },
  {
    symbol: 'caterpillar',
    ticker: 'CAT',
    name: 'Caterpillar',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Maschinenbau: Baut Bau- und Bergbaumaschinen.',
    metaDescription:
      'Die Caterpillar-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Caterpillar baut Bau- und Bergbaumaschinen. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Ein Frühindikator der Bauwirtschaft: Bestellungen für Großgerät laufen der Konjunktur voraus.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Industrie',
    sitzland: '840',
    seed: { startValue: 265.608, annualDrift: 0.082, annualVolatility: 0.3, seed: 23049 },
  },
  {
    symbol: 'deere',
    ticker: 'DE',
    name: 'Deere & Company',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Landmaschinen: Baut Landmaschinen und Ausrüstung für die Landwirtschaft.',
    metaDescription:
      'Die Deere & Company-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Deere & Company baut Landmaschinen und Ausrüstung für die Landwirtschaft. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Der Absatz folgt den Agrarpreisen – gute Ernteerlöse führen mit Verzögerung zu Investitionen der Landwirte.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Industrie',
    sitzland: '840',
    seed: { startValue: 297.072, annualDrift: 0.082, annualVolatility: 0.3, seed: 23050 },
  },
  {
    symbol: 'ge-aerospace',
    ticker: 'GE',
    name: 'GE Aerospace',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Luftfahrt: Baut und wartet Flugzeugtriebwerke.',
    metaDescription:
      'Die GE Aerospace-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'GE Aerospace baut und wartet Flugzeugtriebwerke. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Das Wartungsgeschäft läuft über Jahrzehnte nach dem Verkauf weiter und ist margenstärker als das Neugeschäft.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Luftfahrt',
    sitzland: '840',
    seed: { startValue: 128.304, annualDrift: 0.082, annualVolatility: 0.3, seed: 23051 },
  },
  {
    symbol: 'lockheed',
    ticker: 'LMT',
    name: 'Lockheed Martin',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Rüstung: Entwickelt und baut Militärflugzeuge, Raketen und Satelliten.',
    metaDescription:
      'Die Lockheed Martin-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Lockheed Martin entwickelt und baut Militärflugzeuge, Raketen und Satelliten. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Der Auftraggeber ist überwiegend der US-Staat – planbare Aufträge, dafür politische Abhängigkeit und wenig Preisspielraum.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Rüstung',
    sitzland: '840',
    seed: {
      startValue: 337.248,
      annualDrift: 0.082,
      annualVolatility: 0.28,
      seed: 23052,
    },
  },
  {
    symbol: 'rtx',
    ticker: 'RTX',
    name: 'RTX',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Rüstung und Luftfahrt: Baut Triebwerke, Raketen und Luftverteidigungssysteme.',
    metaDescription:
      'Die RTX-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'RTX baut Triebwerke, Raketen und Luftverteidigungssysteme. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Zivile Luftfahrt und Rüstung in einem Konzern – die beiden Sparten laufen selten gleichzeitig schlecht.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Rüstung',
    sitzland: '840',
    seed: { startValue: 89.712, annualDrift: 0.082, annualVolatility: 0.3, seed: 23053 },
  },
  {
    symbol: 'union-pacific',
    ticker: 'UNP',
    name: 'Union Pacific',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Transport: Betreibt ein Güterbahnnetz im Westen der USA.',
    metaDescription:
      'Die Union Pacific-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Union Pacific betreibt ein Güterbahnnetz im Westen der USA. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Eisenbahnen sind faktisch nicht duplizierbar – wer das Netz besitzt, hat einen Wettbewerbsvorteil, den kein Kapital einholt.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Transport',
    sitzland: '840',
    seed: { startValue: 167.616, annualDrift: 0.082, annualVolatility: 0.3, seed: 23054 },
  },
  {
    symbol: 'ups',
    ticker: 'UPS',
    name: 'United Parcel Service',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Logistik: Befördert Pakete und Fracht weltweit.',
    metaDescription:
      'Die United Parcel Service-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'United Parcel Service befördert Pakete und Fracht weltweit. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Ein Frühindikator des Handels – und ein Geschäft mit hohen Fixkosten, das bei sinkendem Volumen schnell unter Druck gerät.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Transport',
    sitzland: '840',
    seed: { startValue: 92.448, annualDrift: 0.082, annualVolatility: 0.3, seed: 23055 },
  },
  {
    symbol: 'exxon',
    ticker: 'XOM',
    name: 'ExxonMobil',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Öl und Gas: Fördert und verarbeitet Erdöl und Erdgas.',
    metaDescription:
      'Die ExxonMobil-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'ExxonMobil fördert und verarbeitet Erdöl und Erdgas. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Gewinn und Aktienkurs folgen dem Ölpreis – ein Unternehmen, dessen Ertrag von einer Größe abhängt, die es selbst nicht beeinflusst.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Energie',
    sitzland: '840',
    seed: { startValue: 85.392, annualDrift: 0.082, annualVolatility: 0.3, seed: 23056 },
  },
  {
    symbol: 'chevron',
    ticker: 'CVX',
    name: 'Chevron',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Öl und Gas: Fördert Öl und Gas und betreibt Raffinerien.',
    metaDescription:
      'Die Chevron-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Chevron fördert Öl und Gas und betreibt Raffinerien. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Wie alle Ölkonzerne zwischen hoher Ausschüttung heute und der Frage nach dem Geschäftsmodell von morgen.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Energie',
    sitzland: '840',
    seed: { startValue: 113.904, annualDrift: 0.082, annualVolatility: 0.3, seed: 23057 },
  },
  {
    symbol: 'shell',
    ticker: 'SHEL.L',
    name: 'Shell',
    kind: 'stock',
    unit: 'GBp',
    decimals: 2,
    summary: 'Öl und Gas: Fördert und handelt Öl, Gas und Flüssiggas.',
    metaDescription:
      'Die Shell-Aktie in GBp: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Shell fördert und handelt Öl, Gas und Flüssiggas. Notiert wird die Aktie an der Börse London Stock Exchange in GBp.',
      'Einer der größten Händler von Flüssiggas weltweit – ein Geschäft, das seit den Energiekrisen strategische Bedeutung hat.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Energie',
    sitzland: '826',
    seed: { startValue: 20.592, annualDrift: 0.082, annualVolatility: 0.3, seed: 23058 },
  },
  {
    symbol: 'nextera',
    ticker: 'NEE',
    name: 'NextEra Energy',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Versorger: Betreibt Stromnetze in Florida und einen großen Bestand an Wind- und Solaranlagen.',
    metaDescription:
      'Die NextEra Energy-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'NextEra Energy betreibt Stromnetze in Florida und einen großen Bestand an Wind- und Solaranlagen. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Versorger gelten als zinsempfindlich: Sie sind hoch verschuldet und ihre Dividende konkurriert mit dem Anleihezins.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Versorger',
    sitzland: '840',
    seed: { startValue: 52.128, annualDrift: 0.082, annualVolatility: 0.22, seed: 23059 },
  },
  {
    symbol: 'linde',
    ticker: 'LIN',
    name: 'Linde',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Industriegase: Produziert und liefert technische Gase für Industrie und Medizin.',
    metaDescription:
      'Die Linde-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Linde produziert und liefert technische Gase für Industrie und Medizin. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Industriegase werden über Jahrzehntverträge direkt ans Werk geliefert – ein Geschäft mit außergewöhnlich planbaren Erlösen.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Chemie',
    sitzland: '826',
    seed: { startValue: 337.104, annualDrift: 0.082, annualVolatility: 0.3, seed: 23060 },
  },
  {
    symbol: 'siemens',
    ticker: 'SIE.DE',
    name: 'Siemens',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary:
      'Industrie: Liefert Automatisierungstechnik, Software für die Industrie und Bahntechnik.',
    metaDescription:
      'Die Siemens-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Siemens liefert Automatisierungstechnik, Software für die Industrie und Bahntechnik. Notiert wird die Aktie an der Börse Xetra in EUR.',
      'Der Konzern hat sich in Jahrzehnten mehrfach von Sparten getrennt – wer die Aktie über lange Zeit hielt, hält heute mehrere Unternehmen.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Industrie',
    sitzland: '276',
    seed: { startValue: 155.808, annualDrift: 0.082, annualVolatility: 0.3, seed: 23061 },
  },
  {
    symbol: 'siemens-energy',
    ticker: 'ENR.DE',
    name: 'Siemens Energy',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary: 'Energietechnik: Baut Turbinen, Netztechnik und Windkraftanlagen.',
    metaDescription:
      'Die Siemens Energy-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Siemens Energy baut Turbinen, Netztechnik und Windkraftanlagen. Notiert wird die Aktie an der Börse Xetra in EUR.',
      'Der Umbau der Stromnetze schafft langfristige Nachfrage – die Windsparte hat dem Konzern zugleich schwere Verluste eingetragen.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Industrie',
    sitzland: '276',
    seed: { startValue: 45.216, annualDrift: 0.082, annualVolatility: 0.3, seed: 23062 },
  },
  {
    symbol: 'mercedes-benz',
    ticker: 'MBG.DE',
    name: 'Mercedes-Benz Group',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary: 'Automobil: Baut Fahrzeuge im oberen Preissegment.',
    metaDescription:
      'Die Mercedes-Benz Group-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Mercedes-Benz Group baut Fahrzeuge im oberen Preissegment. Notiert wird die Aktie an der Börse Xetra in EUR.',
      'Deutsche Autobauer hängen stark am China-Geschäft – dort entscheidet sich, ob der Übergang zur Elektromobilität gelingt.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Automobil',
    sitzland: '276',
    seed: { startValue: 39.024, annualDrift: 0.082, annualVolatility: 0.36, seed: 23063 },
  },
  {
    symbol: 'bmw',
    ticker: 'BMW.DE',
    name: 'BMW',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary: 'Automobil: Baut Fahrzeuge und Motorräder.',
    metaDescription:
      'Die BMW-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'BMW baut Fahrzeuge und Motorräder. Notiert wird die Aktie an der Börse Xetra in EUR.',
      'Neben dem Fahrzeuggeschäft betreibt BMW eine große Finanzsparte für Leasing – faktisch eine Bank im Konzern.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Automobil',
    sitzland: '276',
    seed: { startValue: 59.472, annualDrift: 0.082, annualVolatility: 0.36, seed: 23064 },
  },
  {
    symbol: 'volkswagen',
    ticker: 'VOW3.DE',
    name: 'Volkswagen',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary:
      'Automobil: Baut Fahrzeuge unter mehreren Marken vom Kleinwagen bis zum Sportwagen.',
    metaDescription:
      'Die Volkswagen-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Volkswagen baut Fahrzeuge unter mehreren Marken vom Kleinwagen bis zum Sportwagen. Notiert wird die Aktie an der Börse Xetra in EUR.',
      'Die im Index enthaltene Vorzugsaktie hat kein Stimmrecht – ein Beispiel dafür, dass Aktie nicht gleich Aktie ist.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Automobil',
    sitzland: '276',
    seed: { startValue: 66.816, annualDrift: 0.082, annualVolatility: 0.36, seed: 23065 },
  },
  {
    symbol: 'porsche-ag',
    ticker: 'P911.DE',
    name: 'Porsche AG',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary: 'Automobil: Baut Sportwagen und Geländewagen im Luxussegment.',
    metaDescription:
      'Die Porsche AG-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Porsche AG baut Sportwagen und Geländewagen im Luxussegment. Notiert wird die Aktie an der Börse Xetra in EUR.',
      'Höhere Margen als Massenhersteller, dafür eine kleine Stückzahl – die Aktie wird eher wie ein Luxusgüterhersteller bewertet.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Automobil',
    sitzland: '276',
    seed: { startValue: 49.248, annualDrift: 0.082, annualVolatility: 0.36, seed: 23066 },
  },
  {
    symbol: 'basf',
    ticker: 'BAS.DE',
    name: 'BASF',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary: 'Chemie: Stellt Grundchemikalien, Kunststoffe und Agrarprodukte her.',
    metaDescription:
      'Die BASF-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'BASF stellt Grundchemikalien, Kunststoffe und Agrarprodukte her. Notiert wird die Aktie an der Börse Xetra in EUR.',
      'Der weltgrößte Chemiekonzern ist ein Großverbraucher von Erdgas – der Gaspreis wirkt direkt auf die Herstellkosten.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Chemie',
    sitzland: '276',
    seed: { startValue: 33.696, annualDrift: 0.082, annualVolatility: 0.3, seed: 23067 },
  },
  {
    symbol: 'bayer',
    ticker: 'BAYN.DE',
    name: 'Bayer',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary:
      'Pharma und Agrar: Stellt Medikamente, rezeptfreie Präparate und Pflanzenschutzmittel her.',
    metaDescription:
      'Die Bayer-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Bayer stellt Medikamente, rezeptfreie Präparate und Pflanzenschutzmittel her. Notiert wird die Aktie an der Börse Xetra in EUR.',
      'Die Übernahme von Monsanto brachte jahrelange Rechtsstreitigkeiten – ein Lehrstück über Haftungsrisiken bei Zukäufen.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Pharma',
    sitzland: '276',
    seed: { startValue: 19.008, annualDrift: 0.082, annualVolatility: 0.3, seed: 23068 },
  },
  {
    symbol: 'deutsche-telekom',
    ticker: 'DTE.DE',
    name: 'Deutsche Telekom',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary:
      'Telekommunikation: Betreibt Mobilfunk- und Festnetze in Europa und über T-Mobile in den USA.',
    metaDescription:
      'Die Deutsche Telekom-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Deutsche Telekom betreibt Mobilfunk- und Festnetze in Europa und über T-Mobile in den USA. Notiert wird die Aktie an der Börse Xetra in EUR.',
      'Das US-Geschäft ist inzwischen der größere Teil – die Aktie hängt mehr am amerikanischen Mobilfunkmarkt als am deutschen.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Telekommunikation',
    sitzland: '276',
    seed: { startValue: 24.912, annualDrift: 0.082, annualVolatility: 0.3, seed: 23069 },
  },
  {
    symbol: 'adidas',
    ticker: 'ADS.DE',
    name: 'adidas',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary: 'Sportartikel: Entwickelt und vertreibt Sportbekleidung und Schuhe.',
    metaDescription:
      'Die adidas-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'adidas entwickelt und vertreibt Sportbekleidung und Schuhe. Notiert wird die Aktie an der Börse Xetra in EUR.',
      'Modezyklen wirken hier stärker als Konjunktur – eine erfolgreiche Produktreihe kann das Ergebnis über Jahre tragen oder ihr Auslaufen es einbrechen lassen.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Konsum',
    sitzland: '276',
    seed: { startValue: 164.592, annualDrift: 0.082, annualVolatility: 0.3, seed: 23070 },
  },
  {
    symbol: 'airbus',
    ticker: 'AIR.PA',
    name: 'Airbus',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary: 'Luftfahrt: Baut Verkehrsflugzeuge, Hubschrauber und Raumfahrttechnik.',
    metaDescription:
      'Die Airbus-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Airbus baut Verkehrsflugzeuge, Hubschrauber und Raumfahrttechnik. Notiert wird die Aktie an der Börse Euronext Paris in EUR.',
      'Neben Boeing der zweite Hersteller großer Verkehrsflugzeuge – Auftragsbücher reichen üblicherweise viele Jahre voraus.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Luftfahrt',
    sitzland: '250',
    seed: { startValue: 124.128, annualDrift: 0.082, annualVolatility: 0.3, seed: 23071 },
  },
  {
    symbol: 'infineon',
    ticker: 'IFX.DE',
    name: 'Infineon',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary: 'Halbleiter: Stellt Chips für Autos, Industrie und Energietechnik her.',
    metaDescription:
      'Die Infineon-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Infineon stellt Chips für Autos, Industrie und Energietechnik her. Notiert wird die Aktie an der Börse Xetra in EUR.',
      'Leistungshalbleiter sind für Elektrofahrzeuge und Ladeinfrastruktur zentral – ein Wachstumsfeld mit konjunkturellem Auf und Ab.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Halbleiter',
    sitzland: '276',
    seed: { startValue: 25.056, annualDrift: 0.082, annualVolatility: 0.42, seed: 23072 },
  },
  {
    symbol: 'rheinmetall',
    ticker: 'RHM.DE',
    name: 'Rheinmetall',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary: 'Rüstung: Stellt Munition, Militärfahrzeuge und Fahrzeugtechnik her.',
    metaDescription:
      'Die Rheinmetall-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Rheinmetall stellt Munition, Militärfahrzeuge und Fahrzeugtechnik her. Notiert wird die Aktie an der Börse Xetra in EUR.',
      'Der Kurs folgt sicherheitspolitischen Entscheidungen – eine Abhängigkeit, die sich weder prognostizieren noch aus Bilanzen ableiten lässt.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Rüstung',
    sitzland: '276',
    seed: {
      startValue: 422.208,
      annualDrift: 0.082,
      annualVolatility: 0.28,
      seed: 23073,
    },
  },
  {
    symbol: 'deutsche-post',
    ticker: 'DHL.DE',
    name: 'DHL Group',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary: 'Logistik: Befördert Briefe, Pakete und Fracht weltweit.',
    metaDescription:
      'Die DHL Group-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'DHL Group befördert Briefe, Pakete und Fracht weltweit. Notiert wird die Aktie an der Börse Xetra in EUR.',
      'Das internationale Expressgeschäft ist ein Frühindikator des Welthandels – deutlich aussagekräftiger als das Briefgeschäft.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Transport',
    sitzland: '276',
    seed: { startValue: 27.504, annualDrift: 0.082, annualVolatility: 0.3, seed: 23074 },
  },
  {
    symbol: 'merck-kgaa',
    ticker: 'MRK.DE',
    name: 'Merck KGaA',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary:
      'Pharma und Spezialchemie: Stellt Medikamente, Laborbedarf und Materialien für die Chipherstellung her.',
    metaDescription:
      'Die Merck KGaA-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Merck KGaA stellt Medikamente, Laborbedarf und Materialien für die Chipherstellung her. Notiert wird die Aktie an der Börse Xetra in EUR.',
      'Drei sehr verschiedene Sparten unter einem Dach – die Halbleitersparte folgt einem völlig anderen Zyklus als das Pharmageschäft.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Pharma',
    sitzland: '276',
    seed: { startValue: 106.992, annualDrift: 0.082, annualVolatility: 0.3, seed: 23075 },
  },
  {
    symbol: 'beiersdorf',
    ticker: 'BEI.DE',
    name: 'Beiersdorf',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary:
      'Konsumgüter: Stellt Hautpflegeprodukte her, unter anderem unter der Marke Nivea.',
    metaDescription:
      'Die Beiersdorf-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Beiersdorf stellt Hautpflegeprodukte her, unter anderem unter der Marke Nivea. Notiert wird die Aktie an der Börse Xetra in EUR.',
      'Ein defensiver Wert mit starken Marken – Wachstum entsteht hier über Jahrzehnte, nicht über Quartale.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Konsum',
    sitzland: '276',
    seed: { startValue: 92.448, annualDrift: 0.082, annualVolatility: 0.19, seed: 23076 },
  },
  {
    symbol: 'henkel',
    ticker: 'HEN3.DE',
    name: 'Henkel',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary:
      'Konsumgüter und Klebstoffe: Stellt Wasch- und Reinigungsmittel, Körperpflege sowie Industrieklebstoffe her.',
    metaDescription:
      'Die Henkel-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Henkel stellt Wasch- und Reinigungsmittel, Körperpflege sowie Industrieklebstoffe her. Notiert wird die Aktie an der Börse Xetra in EUR.',
      'Das Klebstoffgeschäft für die Industrie ist der ertragsstärkere und weniger bekannte Teil des Konzerns.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Konsum',
    sitzland: '276',
    seed: { startValue: 56.592, annualDrift: 0.082, annualVolatility: 0.3, seed: 23077 },
  },
  {
    symbol: 'eon',
    ticker: 'EOAN.DE',
    name: 'E.ON',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary: 'Versorger: Betreibt Strom- und Gasnetze sowie den Energievertrieb.',
    metaDescription:
      'Die E.ON-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'E.ON betreibt Strom- und Gasnetze sowie den Energievertrieb. Notiert wird die Aktie an der Börse Xetra in EUR.',
      'Netzbetrieb ist reguliert: Die Rendite wird behördlich festgelegt – planbar, aber nach oben begrenzt.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Versorger',
    sitzland: '276',
    seed: { startValue: 9.936, annualDrift: 0.082, annualVolatility: 0.22, seed: 23078 },
  },
  {
    symbol: 'hannover-rueck',
    ticker: 'HNR1.DE',
    name: 'Hannover Rück',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary: 'Rückversicherung: Versichert Erstversicherer gegen Großschäden.',
    metaDescription:
      'Die Hannover Rück-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Hannover Rück versichert Erstversicherer gegen Großschäden. Notiert wird die Aktie an der Börse Xetra in EUR.',
      'Wie bei jeder Rückversicherung entscheidet die Schadenlast eines Jahres über das Ergebnis – Naturkatastrophen sind das eigentliche Geschäftsrisiko.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Versicherungen',
    sitzland: '276',
    seed: { startValue: 193.248, annualDrift: 0.082, annualVolatility: 0.3, seed: 23079 },
  },
  {
    symbol: 'vonovia',
    ticker: 'VNA.DE',
    name: 'Vonovia',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary: 'Immobilien: Besitzt und verwaltet Wohnimmobilien in Deutschland.',
    metaDescription:
      'Die Vonovia-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Vonovia besitzt und verwaltet Wohnimmobilien in Deutschland. Notiert wird die Aktie an der Börse Xetra in EUR.',
      'Ein hoch verschuldetes Geschäftsmodell: Steigende Zinsen treffen Immobilienkonzerne doppelt, über Finanzierungskosten und Bewertungen.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Immobilien',
    sitzland: '276',
    seed: { startValue: 20.448, annualDrift: 0.082, annualVolatility: 0.3, seed: 23080 },
  },
  {
    symbol: 'lvmh',
    ticker: 'MC.PA',
    name: 'LVMH',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary:
      'Luxusgüter: Vereint Mode-, Schmuck- und Spirituosenmarken unter einem Dach.',
    metaDescription:
      'Die LVMH-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'LVMH vereint Mode-, Schmuck- und Spirituosenmarken unter einem Dach. Notiert wird die Aktie an der Börse Euronext Paris in EUR.',
      'Luxusgüter hängen stark an der Nachfrage aus China – ein Konjunktureinbruch dort wirkt unmittelbar.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Konsum',
    sitzland: '250',
    seed: { startValue: 452.448, annualDrift: 0.082, annualVolatility: 0.3, seed: 23081 },
  },
  {
    symbol: 'hermes',
    ticker: 'RMS.PA',
    name: 'Hermès',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary:
      'Luxusgüter: Stellt Lederwaren, Seide und Uhren im obersten Preissegment her.',
    metaDescription:
      'Die Hermès-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Hermès stellt Lederwaren, Seide und Uhren im obersten Preissegment her. Notiert wird die Aktie an der Börse Euronext Paris in EUR.',
      'Die künstliche Verknappung des Angebots ist Teil des Geschäftsmodells – Umsatzwachstum ist hier eine Entscheidung, keine Folge der Nachfrage.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Konsum',
    sitzland: '250',
    seed: { startValue: 1572.48, annualDrift: 0.082, annualVolatility: 0.3, seed: 23082 },
  },
  {
    symbol: 'nestle',
    ticker: 'NESN.SW',
    name: 'Nestlé',
    kind: 'stock',
    unit: 'CHF',
    decimals: 2,
    summary: 'Lebensmittel: Stellt Lebensmittel, Getränke und Tiernahrung her.',
    metaDescription:
      'Die Nestlé-Aktie in CHF: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Nestlé stellt Lebensmittel, Getränke und Tiernahrung her. Notiert wird die Aktie an der Börse SIX Swiss Exchange in CHF.',
      'Der größte Lebensmittelkonzern der Welt – defensiv, mit langer Dividendenhistorie und begrenztem Wachstum.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Lebensmittel',
    sitzland: '756',
    seed: { startValue: 60.912, annualDrift: 0.082, annualVolatility: 0.3, seed: 23083 },
  },
  {
    symbol: 'astrazeneca',
    ticker: 'AZN.L',
    name: 'AstraZeneca',
    kind: 'stock',
    unit: 'GBp',
    decimals: 2,
    summary: 'Pharma: Forscht und produziert Medikamente, besonders in der Onkologie.',
    metaDescription:
      'Die AstraZeneca-Aktie in GBp: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'AstraZeneca forscht und produziert Medikamente, besonders in der Onkologie. Notiert wird die Aktie an der Börse London Stock Exchange in GBp.',
      'Eines der forschungsstärksten Pharmaunternehmen Europas – der Wert hängt an der Pipeline, nicht am heutigen Umsatz.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Pharma',
    sitzland: '826',
    seed: { startValue: 85.248, annualDrift: 0.082, annualVolatility: 0.26, seed: 23084 },
  },
  {
    symbol: 'unilever',
    ticker: 'ULVR.L',
    name: 'Unilever',
    kind: 'stock',
    unit: 'GBp',
    decimals: 2,
    summary:
      'Konsumgüter: Stellt Lebensmittel, Reinigungs- und Körperpflegeprodukte her.',
    metaDescription:
      'Die Unilever-Aktie in GBp: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Unilever stellt Lebensmittel, Reinigungs- und Körperpflegeprodukte her. Notiert wird die Aktie an der Börse London Stock Exchange in GBp.',
      'Ein erheblicher Teil des Umsatzes stammt aus Schwellenländern – Währungsschwankungen wirken deshalb stark auf das Ergebnis.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Konsum',
    sitzland: '826',
    seed: { startValue: 34.704, annualDrift: 0.082, annualVolatility: 0.19, seed: 23085 },
  },
  {
    symbol: 'totalenergies',
    ticker: 'TTE.PA',
    name: 'TotalEnergies',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary:
      'Öl und Gas: Fördert Öl und Gas und baut ein Geschäft mit erneuerbarem Strom auf.',
    metaDescription:
      'Die TotalEnergies-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'TotalEnergies fördert Öl und Gas und baut ein Geschäft mit erneuerbarem Strom auf. Notiert wird die Aktie an der Börse Euronext Paris in EUR.',
      'Der Konzern investiert stärker in Erneuerbare als die meisten Wettbewerber – ein Umbau bei laufendem Ölgeschäft.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Energie',
    sitzland: '250',
    seed: { startValue: 45.216, annualDrift: 0.082, annualVolatility: 0.3, seed: 23086 },
  },
  {
    symbol: 'schneider-electric',
    ticker: 'SU.PA',
    name: 'Schneider Electric',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary: 'Elektrotechnik: Liefert Technik zur Steuerung und Verteilung von Strom.',
    metaDescription:
      'Die Schneider Electric-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Schneider Electric liefert Technik zur Steuerung und Verteilung von Strom. Notiert wird die Aktie an der Börse Euronext Paris in EUR.',
      'Profitiert unmittelbar vom Ausbau der Stromnetze und der Elektrifizierung von Industrie und Gebäuden.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Elektronik',
    sitzland: '250',
    seed: { startValue: 164.592, annualDrift: 0.082, annualVolatility: 0.3, seed: 23087 },
  },
  {
    symbol: 'l-oreal',
    ticker: 'OR.PA',
    name: "L'Oréal",
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary: 'Kosmetik: Stellt Kosmetik- und Hautpflegeprodukte her.',
    metaDescription:
      "Die L'Oréal-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.",
    description: [
      "L'Oréal stellt Kosmetik- und Hautpflegeprodukte her. Notiert wird die Aktie an der Börse Euronext Paris in EUR.",
      'Der größte Kosmetikkonzern der Welt – ein defensives Geschäft mit ungewöhnlich hohen Werbeausgaben.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Konsum',
    sitzland: '250',
    seed: { startValue: 275.328, annualDrift: 0.082, annualVolatility: 0.3, seed: 23088 },
  },
  {
    symbol: 'safran',
    ticker: 'SAF.PA',
    name: 'Safran',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary: 'Luftfahrt: Baut Flugzeugtriebwerke und Ausrüstung.',
    metaDescription:
      'Die Safran-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Safran baut Flugzeugtriebwerke und Ausrüstung. Notiert wird die Aktie an der Börse Euronext Paris in EUR.',
      'Wie bei allen Triebwerksherstellern liegt der Ertrag in der jahrzehntelangen Wartung, nicht im Verkauf.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Luftfahrt',
    sitzland: '250',
    seed: { startValue: 153.216, annualDrift: 0.082, annualVolatility: 0.3, seed: 23089 },
  },
  {
    symbol: 'stellantis',
    ticker: 'STLA',
    name: 'Stellantis',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Automobil: Baut Fahrzeuge unter mehreren europäischen und amerikanischen Marken.',
    metaDescription:
      'Die Stellantis-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Stellantis baut Fahrzeuge unter mehreren europäischen und amerikanischen Marken. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Aus der Fusion mehrerer Hersteller entstanden – Zusammenschlüsse dieser Größe brauchen Jahre, bis Einsparungen sichtbar werden.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Automobil',
    sitzland: '528',
    seed: { startValue: 8.928, annualDrift: 0.082, annualVolatility: 0.36, seed: 23090 },
  },
  {
    symbol: 'ferrari',
    ticker: 'RACE',
    name: 'Ferrari',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Automobil: Baut Sportwagen in bewusst begrenzter Stückzahl.',
    metaDescription:
      'Die Ferrari-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Ferrari baut Sportwagen in bewusst begrenzter Stückzahl. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Wird an der Börse wie ein Luxusgüterhersteller bewertet, nicht wie ein Autobauer – die Wartelisten sind Teil der Preissetzung.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Automobil',
    sitzland: '380',
    seed: {
      startValue: 308.592,
      annualDrift: 0.082,
      annualVolatility: 0.36,
      seed: 23091,
    },
  },
  {
    symbol: 'iberdrola',
    ticker: 'IBE.MC',
    name: 'Iberdrola',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary:
      'Versorger: Betreibt Stromnetze und erneuerbare Erzeugung in Europa und Amerika.',
    metaDescription:
      'Die Iberdrola-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Iberdrola betreibt Stromnetze und erneuerbare Erzeugung in Europa und Amerika. Notiert wird die Aktie an der Börse Madrid in EUR.',
      'Einer der größten Betreiber erneuerbarer Anlagen weltweit – kapitalintensiv und damit zinsempfindlich.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Versorger',
    sitzland: '724',
    seed: { startValue: 9.216, annualDrift: 0.082, annualVolatility: 0.22, seed: 23092 },
  },
  {
    symbol: 'santander',
    ticker: 'SAN.MC',
    name: 'Banco Santander',
    kind: 'stock',
    unit: 'EUR',
    decimals: 2,
    summary: 'Bank: Betreibt Bankgeschäfte in Europa und Lateinamerika.',
    metaDescription:
      'Die Banco Santander-Aktie in EUR: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Banco Santander betreibt Bankgeschäfte in Europa und Lateinamerika. Notiert wird die Aktie an der Börse Madrid in EUR.',
      'Das Lateinamerikageschäft bringt höhere Margen und zugleich Währungs- und Länderrisiken.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Banken',
    sitzland: '724',
    seed: { startValue: 4.4928, annualDrift: 0.082, annualVolatility: 0.34, seed: 23093 },
  },
  {
    symbol: 'samsung',
    ticker: '005930.KS',
    name: 'Samsung Electronics',
    kind: 'stock',
    unit: 'KRW',
    decimals: 0,
    summary: 'Elektronik: Stellt Speicherchips, Smartphones und Displays her.',
    metaDescription:
      'Die Samsung Electronics-Aktie in KRW: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Samsung Electronics stellt Speicherchips, Smartphones und Displays her. Notiert wird die Aktie an der Börse Seoul in KRW.',
      'Der schwerste Wert im KOSPI – der koreanische Leitindex folgt der Aktie stärker als der koreanischen Wirtschaft.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Elektronik',
    sitzland: '410',
    seed: { startValue: 56448.0, annualDrift: 0.082, annualVolatility: 0.3, seed: 23094 },
  },
  {
    symbol: 'toyota',
    ticker: '7203.T',
    name: 'Toyota',
    kind: 'stock',
    unit: 'JPY',
    decimals: 2,
    summary: 'Automobil: Baut Fahrzeuge, mit Schwerpunkt auf Hybridantrieben.',
    metaDescription:
      'Die Toyota-Aktie in JPY: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Toyota baut Fahrzeuge, mit Schwerpunkt auf Hybridantrieben. Notiert wird die Aktie an der Börse Tokio in JPY.',
      'Toyota setzte länger als andere auf Hybride statt reine Elektroautos – eine Strategie, die je nach Marktentwicklung als Vorsicht oder Versäumnis gilt.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Automobil',
    sitzland: '392',
    seed: { startValue: 2059.2, annualDrift: 0.082, annualVolatility: 0.36, seed: 23095 },
  },
  {
    symbol: 'sony',
    ticker: '6758.T',
    name: 'Sony',
    kind: 'stock',
    unit: 'JPY',
    decimals: 2,
    summary:
      'Elektronik und Medien: Stellt Bildsensoren, Spielkonsolen her und betreibt Musik- und Filmgeschäft.',
    metaDescription:
      'Die Sony-Aktie in JPY: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Sony stellt Bildsensoren, Spielkonsolen her und betreibt Musik- und Filmgeschäft. Notiert wird die Aktie an der Börse Tokio in JPY.',
      'Die Bildsensoren stecken in einem Großteil der Smartphonekameras weltweit – ein Zulieferergeschäft hinter fremden Marken.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Elektronik',
    sitzland: '392',
    seed: { startValue: 2246.4, annualDrift: 0.082, annualVolatility: 0.3, seed: 23096 },
  },
  {
    symbol: 'alibaba',
    ticker: 'BABA',
    name: 'Alibaba',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary: 'Onlinehandel: Betreibt Handelsplattformen und Cloud-Dienste in China.',
    metaDescription:
      'Die Alibaba-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Alibaba betreibt Handelsplattformen und Cloud-Dienste in China. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Die Aktie steht stellvertretend für das Regulierungsrisiko chinesischer Technologiewerte – ein Eingriff kann den Kurs unabhängig vom Geschäft bewegen.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Handel',
    sitzland: '156',
    seed: { startValue: 60.912, annualDrift: 0.082, annualVolatility: 0.3, seed: 23097 },
  },
  {
    symbol: 'tencent',
    ticker: '0700.HK',
    name: 'Tencent',
    kind: 'stock',
    unit: 'HKD',
    decimals: 2,
    summary: 'Internet: Betreibt Messenger, Spiele und Zahlungsdienste in China.',
    metaDescription:
      'Die Tencent-Aktie in HKD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'Tencent betreibt Messenger, Spiele und Zahlungsdienste in China. Notiert wird die Aktie an der Börse Hongkong in HKD.',
      'Der schwerste Wert im Hang Seng – wer den Index kauft, kauft in erheblichem Umfang dieses eine Unternehmen.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Technologie',
    sitzland: '156',
    seed: { startValue: 278.208, annualDrift: 0.082, annualVolatility: 0.3, seed: 23098 },
  },
  {
    symbol: 'umc',
    ticker: 'UMC',
    name: 'United Microelectronics',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Halbleiter: Fertigt Chips im Auftrag, mit Schwerpunkt auf älteren Fertigungsstufen.',
    metaDescription:
      'Die United Microelectronics-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'United Microelectronics fertigt Chips im Auftrag, mit Schwerpunkt auf älteren Fertigungsstufen. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Ältere Fertigungstechnik ist weniger prestigeträchtig, aber für Autos und Industrie unverzichtbar.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Halbleiter',
    sitzland: '158',
    seed: { startValue: 5.6592, annualDrift: 0.082, annualVolatility: 0.42, seed: 23099 },
  },
  {
    symbol: 'arm',
    ticker: 'ARM',
    name: 'ARM Holdings',
    kind: 'stock',
    unit: 'USD',
    decimals: 2,
    summary:
      'Halbleiter: Entwirft Prozessorarchitekturen und vergibt Lizenzen daran, fertigt aber selbst keine Chips.',
    metaDescription:
      'Die ARM Holdings-Aktie in USD: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.',
    description: [
      'ARM Holdings entwirft Prozessorarchitekturen und vergibt Lizenzen daran, fertigt aber selbst keine Chips. Notiert wird die Aktie an der Börse NYSE bzw. Nasdaq in USD.',
      'Nahezu jedes Smartphone der Welt nutzt ein ARM-Design – verdient wird an Lizenzen und Stückgebühren statt an Hardware.',
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: 'Halbleiter',
    sitzland: '826',
    seed: { startValue: 92.448, annualDrift: 0.082, annualVolatility: 0.42, seed: 23100 },
  },
  /*
    Die breite Auswahl aus `data/aktien-liste.txt`.

    Angehängt statt eingemischt: Die Einträge oben sind einzeln geschrieben und
    ausführlich beschrieben, diese hier nach einem Muster erzeugt. Sie
    dazwischenzusetzen würde beides unleserlich machen. Für die Anzeige spielt
    die Reihenfolge keine Rolle – die Marktübersicht sortiert selbst.
  */
  ...weitereAktien,
]

/** Reihenfolge für Übersichten: Kurse, Indizes, Rohstoffe. */
/**
 * Die „Magnificent Seven“ – die sieben schwersten Werte im S&P 500.
 *
 * Sie stehen auf der Marktseite als eigener Abschnitt, nicht zwischen den
 * übrigen hundert Einzelaktien. Der Grund ist nicht Prominenz, sondern Gewicht:
 * Zusammen machen diese sieben Unternehmen einen erheblichen Teil des S&P 500
 * und damit auch eines weltweit streuenden ETF aus. Wer „breit gestreut“
 * anlegt, hält von ihnen mehr, als die Zahl der enthaltenen Titel vermuten
 * lässt – und genau das ist der Punkt, den ein eigener Abschnitt sichtbar macht.
 *
 * ## Diese Liste bestimmt die Zugehörigkeit, nicht die Reihenfolge
 *
 * Welche sieben dazugehören, ist eine Festlegung und ändert sich selten.
 * **In welcher Reihenfolge sie stehen, ist dagegen eine Tatsache, die sich
 * täglich ändert** – und deshalb steht sie nicht mehr hier. Die Marktseite
 * sortiert nach dem Börsenwert, den sie aus dem aktuellen Kurs und der
 * gemeldeten Aktienzahl selbst rechnet.
 *
 * Der Grund ist ein konkreter Fehler: Hier stand Nvidia an erster Stelle und
 * Microsoft vor Alphabet – beides war irgendwann richtig und beides war
 * irgendwann falsch, ohne dass es auffiel. Eine abgeschriebene Rangfolge
 * veraltet still; eine gerechnete kann es nicht.
 *
 * Die Reihenfolge hier ist deshalb bedeutungslos und alphabetisch, damit
 * niemand sie für eine Rangfolge hält.
 */
export const magnificentSeven = [
  'alphabet',
  'amazon',
  'apple',
  'meta',
  'microsoft',
  'nvidia',
  'tesla',
] as const

export const featuredSymbols = [
  'eur-usd',
  'dax',
  'sp500',
  'gold',
  'bitcoin',
  'brent',
] as const
