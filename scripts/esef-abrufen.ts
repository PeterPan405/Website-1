/**
 * Holt Bilanzkennzahlen aus den ESEF-Pflichtmeldungen der EU.
 *
 * ## Warum es diesen zweiten Weg gibt
 *
 * `fundamentaldaten-abrufen.ts` liest bei der US-Börsenaufsicht. Das deckt
 * alles ab, was in New York notiert – auch Toyota und Shell, die dort einen
 * Hinterlegungsschein haben. Nicht abgedeckt ist, wer ausschließlich in Europa
 * gelistet ist: Airbus, L'Oréal, Enel, Kone, Ørsted.
 *
 * Für die gilt seit dem Geschäftsjahr 2021 das **European Single Electronic
 * Format**: Jeder Emittent an einem geregelten EU-Markt muss seinen
 * Konzernabschluss maschinenlesbar abgeben, ausgezeichnet nach `ifrs-full` –
 * derselben Taxonomie, aus der dieses Projekt bereits die IFRS-Melder der SEC
 * liest. XBRL International führt darüber unter `filings.xbrl.org` ein offenes
 * Verzeichnis.
 *
 * Damit ist es dieselbe Art von Quelle wie die SEC: amtlich veranlasst,
 * gebührenfrei, ohne Schlüssel, und die Zahlen sind die des Unternehmens selbst
 * und nicht die Aufbereitung eines Anbieters.
 *
 * ## Warum die Zuordnung von Hand kommt
 *
 * Weil ein Namenstreffer keine Zuordnung ist. Die Sonde hat 98 Kandidaten
 * gefunden, und darunter waren:
 *
 * - **Nestlé** traf `NESTLE HOLDINGS, INC.` – die US-Finanzierungstochter mit
 *   31 Milliarden Umsatz statt der Gruppe mit 91.
 * - **Volvo** traf `Volvo Car AB` – seit 1999 ein anderes Unternehmen als die
 *   Volvo AB, um die es hier geht.
 * - **SEB** (Skandinaviska Enskilda Banken) traf `SEB SA`, den französischen
 *   Haushaltsgerätehersteller.
 * - **SK Hynix** traf SK Telecom, **Hexagon** traf Hexagon Purus, **Sartorius**
 *   traf Sartorius Stedim Biotech, **Partners Group** traf einen gleichnamigen
 *   Fonds, **Macquarie Group** die Macquarie Bank.
 *
 * Jede dieser Zahlen sähe auf der Seite tadellos aus. Deshalb steht unten eine
 * geprüfte Liste und kein Namensabgleich zur Laufzeit.
 *
 * ## Die Aktienzahl
 *
 * Sie ist der wunde Punkt: Alle Verhältniszahlen dieser Website laufen über
 * sie, und ESEF verlangt sie nicht. Nur 11 der 98 Abschlüsse zeichnen
 * `NumberOfSharesOutstanding` aus.
 *
 * Deshalb der Umweg über das Ergebnis je Aktie: Es steht in praktisch jedem
 * Abschluss, weil IAS 33 es vorschreibt.
 *
 *     Aktienzahl = Ergebnisanteil der Eigentümer / Ergebnis je Aktie
 *
 * Das ergibt die gewichtete Durchschnittszahl des Jahres, nicht den Stand am
 * Stichtag. Für ein Kurs-Gewinn-Verhältnis ist das die richtige Größe – es ist
 * genau die Zahl, mit der auch das Ergebnis je Aktie gerechnet wurde.
 *
 * ## Warum im Zähler nicht der Jahresüberschuss steht
 *
 * Weil das um bis zu einem Fünftel danebengeht. IAS 33 definiert das Ergebnis
 * je Aktie als **Ergebnisanteil der Eigentümer des Mutterunternehmens** geteilt
 * durch die Aktienzahl – Minderheitsanteile sind darin nicht enthalten. Wer
 * oben den Jahresüberschuss samt Minderheiten einsetzt, teilt eine zu große
 * Zahl durch eine dazu passende kleine und bekommt zu viele Aktien heraus.
 *
 * Der erste Lauf hat genau das getan: Enel bekam 12,28 Milliarden Aktien statt
 * 10,17 – und damit ein Kurs-Gewinn-Verhältnis, das um ein Fünftel zu niedrig
 * war. Aufgefallen ist es beim Nachrechnen von Hand, nicht bei der
 * Plausibilitätsprüfung: Die fängt Faktoren wie 100 ab, keine 20 Prozent.
 * Betroffen sind alle Konzerne mit nennenswerten Minderheitsanteilen, also
 * gerade die Versorger und Banken.
 *
 * Aufruf: `npm run esef`
 */

import { readFile, writeFile } from 'node:fs/promises'

const VERZEICHNIS = 'https://filings.xbrl.org/api/filings'
const ZIEL = 'data/snapshots/fundamentaldaten.json'

const KOPFZEILEN = {
  'User-Agent': 'IM-Invests Datenabruf pm252543@gmail.com',
  Accept: 'application/vnd.api+json, application/json',
}

/**
 * Die geprüften Zuordnungen: Börsenkürzel dieser Website auf den Namen im
 * ESEF-Verzeichnis.
 *
 * Aufgenommen ist nur, was die Sonde mit vollständigen und der Größenordnung
 * nach stimmigen Zahlen gemeldet hat. Nicht aufgenommen sind:
 *
 * - **Rio Tinto** (`RIO.L`, `RIO.AX`) – eine Doppelnotierung aus zwei
 *   gemeinsam bilanzierenden Gesellschaften. Der Konzernumsatz zur Aktienzahl
 *   nur einer der beiden ergäbe eine Bewertung, die um den Anteil der anderen
 *   danebenliegt. Dieselbe Begründung wie schon beim SEC-Abruf.
 * - **Heineken** (`HEIA.AS`) – im Verzeichnis steht die Heineken Holding N.V.,
 *   eine eigenständig notierte Gesellschaft mit anderem Eigenkapital.
 * - **Carlsberg** (`CARL-B.CO`) – dort meldet die Carlsberg Breweries A/S, die
 *   Betriebstochter, nicht die börsennotierte Carlsberg A/S.
 * - **Nestlé, Volvo, SEB, SK Hynix, Hexagon, Sartorius, Partners Group,
 *   Macquarie** – Namensverwechslungen, siehe oben.
 * - **Intesa Sanpaolo** und **UniCredit** – beide melden kein Eigenkapital
 *   unter `ifrs-full:Equity`; ohne das bleibt zu wenig übrig.
 *
 * Ørsted, Vestas und Coloplast standen hier zunächst ebenfalls – angeblich
 * ohne auswertbare Fakten. Das war ein Fehler dieses Skripts und nicht der
 * Quelle: Ihr jüngster Verzeichniseintrag ist ein Halbjahresbericht, und
 * daraus wird zu Recht kein Jahresumsatz gelesen. Seit der Abruf die drei
 * jüngsten Meldungen durchgeht, sind sie dabei.
 *
 * ## Warum hier fast kein deutscher Wert steht
 *
 * Die Frage lag lange offen: In dieser Tabelle fehlten Allianz, BMW, Siemens
 * und 85 weitere deutsche Aktien, obwohl sie derselben ESEF-Pflicht
 * unterliegen wie ein französischer Emittent. Zwei Erklärungen waren möglich –
 * die Abschlüsse fehlen im Verzeichnis, oder der Namensabgleich trifft sie
 * nicht –, und sie führen zu gegensätzlichen Schlüssen.
 *
 * `scripts/quellen-probe-esef-de.ts` hat es am 31. Juli 2026 beantwortet:
 * **Von den geführten Abschlüssen trägt kein einziger das Land `DE`.** Die
 * Verteilung reicht von FI, SE und IT über HR, MT und LT bis CZ mit 29 – und
 * Deutschland kommt darin nicht vor. Der Grund liegt im Meldeweg: Deutsche
 * Emittenten reichen beim Unternehmensregister ein, und dessen Bestand fließt
 * nicht in dieses Verzeichnis.
 *
 * Damit ist die Lücke keine Nachlässigkeit dieser Tabelle, sondern eine
 * Eigenschaft der Quelle. Sie wird auf `/quellen` als solche ausgewiesen.
 *
 * Die Sonde meldete vier Namenstreffer. Drei davon sind Verwechslungen der
 * bekannten Art und stehen deshalb **nicht** in der Tabelle:
 *
 * - **Siemens** (`SIE.DE`) traf `SIEMENS GAMESA RENEWABLE ENERGY SA` – die
 *   spanische Windkrafttochter, die zu Siemens Energy gehört.
 * - **Deutsche Telekom** (`DTE.DE`) traf `Telekom Austria Aktiengesellschaft` –
 *   ein eigenständig notiertes Unternehmen, an dem die Telekom lediglich
 *   beteiligt ist.
 * - **Sartorius** (`SRT3.DE`) traf erneut `Sartorius Stedim Biotech`, die
 *   französische Mehrheitsbeteiligung.
 *
 * Der vierte ist echt und steht unten: Aroundtown.
 */
const ZUORDNUNG: Record<string, string> = {
  // Frankreich
  'AIR.PA': 'AIRBUS SE',
  'RMS.PA': 'HERMES INTERNATIONAL',
  'SU.PA': 'SCHNEIDER ELECTRIC SE',
  'OR.PA': "L'OREAL",
  'SAF.PA': 'SAFRAN',
  'CS.PA': 'AXA',
  'BNP.PA': 'BNP PARIBAS',
  'GLE.PA': 'SOCIETE GENERALE',
  'ACA.PA': 'CREDIT AGRICOLE SA',
  'DG.PA': 'VINCI',
  'EN.PA': 'BOUYGUES',
  'BN.PA': 'DANONE',
  'RI.PA': 'PERNOD RICARD',
  'KER.PA': 'KERING',
  'EL.PA': 'ESSILORLUXOTTICA',
  'CAP.PA': 'CAPGEMINI',
  'DSY.PA': 'DASSAULT SYSTEMES',
  'HO.PA': 'THALES',
  'LR.PA': 'LEGRAND',
  'PUB.PA': 'PUBLICIS GROUPE SA',
  'ORA.PA': 'ORANGE',
  'ENGI.PA': 'ENGIE',
  'VIE.PA': 'VEOLIA ENVIRONNEMENT',
  'SW.PA': 'SODEXO',
  'CA.PA': 'CARREFOUR',
  'AC.PA': 'ACCOR',

  // Vereinigtes Königreich
  'SGE.L': 'THE SAGE GROUP PLC.',
  'RKT.L': 'RECKITT BENCKISER GROUP PLC',
  'LGEN.L': 'LEGAL & GENERAL GROUP PLC',
  'AV.L': 'AVIVA PLC',
  'GLEN.L': 'GLENCORE PLC',
  'AAL.L': 'ANGLO AMERICAN PLC',
  'RR.L': 'ROLLS-ROYCE HOLDINGS PLC',
  'BA.L': 'BAE SYSTEMS PLC',
  'TSCO.L': 'TESCO PLC',
  'LSEG.L': 'LONDON STOCK EXCHANGE GROUP PLC',
  'CPG.L': 'COMPASS GROUP PLC',
  'EXPN.L': 'Experian plc',
  'SSE.L': 'SSE PLC',

  // Niederlande
  'WKL.AS': 'Wolters Kluwer N.V.',
  'ADYEN.AS': 'Adyen N.V.',
  'PRX.AS': 'Prosus N.V.',
  'ASM.AS': 'ASM International N.V.',
  'BESI.AS': 'BE Semiconductor Industries N.V.',
  'RAND.AS': 'Randstad N.V.',

  // Spanien
  'IBE.MC': 'IBERDROLA SA',
  'CABK.MC': 'CAIXABANK SA',
  'REP.MC': 'REPSOL SA',
  'AMS.MC': 'AMADEUS IT GROUP SOCIEDAD ANONIMA',
  'NTGY.MC': 'NATURGY ENERGY GROUP SA',

  // Italien
  'ENEL.MI': 'ENEL - SPA',
  'PRY.MI': 'PRYSMIAN S.P.A.',
  'MONC.MI': 'MONCLER S.P.A.',
  'LDO.MI': "LEONARDO - SOCIETA' PER AZIONI",
  'TRN.MI':
    '"TERNA - RETE ELETTRICA NAZIONALE SOCIETA\' PER AZIONI" (IN FORMA ABBREVIATA "TERNA S.P.A.")',

  // Skandinavien
  'ORSTED.CO': 'ØRSTED A/S',
  'VWS.CO': 'VESTAS WIND SYSTEMS A/S',
  'COLO-B.CO': 'COLOPLAST A/S',
  'ATCO-A.ST': 'ATLAS COPCO AKTIEBOLAG',
  'SAND.ST': 'Sandvik Aktiebolag',
  'INVE-B.ST': 'Investor Aktiebolag',
  'ASSA-B.ST': 'ASSA ABLOY AB',
  'EPI-A.ST': 'Epiroc Aktiebolag',
  'SWED-A.ST': 'Swedbank AB',
  'DNB.OL': 'DNB BANK ASA',
  'TEL.OL': 'TELENOR ASA',
  'NDA-FI.HE': 'Nordea Bank Abp',
  'KNEBV.HE': 'KONE OYJ',
  'NESTE.HE': 'Neste Oyj',
  'UPM.HE': 'UPM-KYMMENE OYJ',
  'SAMPO.HE': 'Sampo Oyj',

  // Belgien, Österreich, Irland, Portugal, Polen
  'UMI.BR': 'UMICORE',
  'SOLB.BR': 'SOLVAY',
  'EBS.VI': 'ERSTE GROUP BANK AG',
  'OMV.VI': 'OMV AKTIENGESELLSCHAFT',
  'VER.VI': 'VERBUND AG',
  'VOE.VI': 'voestalpine AG',
  'KYGA.IR': 'KERRY GROUP PUBLIC LIMITED COMPANY',
  'GALP.LS': 'Galp Energia, SGPS, S.A.',
  'PKN.WA': 'ORLEN SPÓŁKA AKCYJNA',

  // Australien
  'NAB.AX': 'NATIONAL AUSTRALIA BANK LIMITED',

  /*
    In Frankfurt notiert, aber anderswo einreichend.

    Aroundtown ist eine luxemburgische Aktiengesellschaft mit Notierung im
    Frankfurter Prime Standard; der Katalog führt sie mit Sitzland Luxemburg
    (`sitzland: '442'`). Ihr Abschluss geht deshalb an die luxemburgische
    Sammelstelle und steht im Verzeichnis unter `[LU]` – keine Namensgleichheit,
    sondern dieselbe Gesellschaft.

    Sie ist damit der einzige `.DE`-Ticker in dieser Tabelle, und das bleibt
    voraussichtlich so: Deutschland selbst liefert nichts an dieses Verzeichnis,
    siehe die Notiz oben.
  */
  'AT1.DE': 'Aroundtown SA',

  /* --------------------------------------------------------------------
     Lauf vom 23. August 2026: die zweite Runde

     Der Workflow „Quellen abklopfen" hat 114 Namenstreffer geliefert, davon
     89 mit vollständigen Zahlen. Aufgenommen ist davon, was zwei Prüfungen
     bestanden hat: Der Name im Verzeichnis bezeichnet **dieselbe**
     Gesellschaft, und die Größenordnung der Zahlen passt zu ihr.

     Die Ergebnisse liegen lesbar auf dem wurzellosen Zweig `sonden-ergebnis`
     (`git show origin/sonden-ergebnis:esef-werte.json`) – nicht nur als
     Artefakt, siehe AGENTS.md.

     Was **nicht** aufgenommen wurde, und warum, steht unter der Tabelle.
     -------------------------------------------------------------------- */

  // Frankreich, zweite Runde
  'AF.PA': 'AIR FRANCE - KLM',
  'AKE.PA': 'ARKEMA',
  'ALO.PA': 'ALSTOM',
  'BVI.PA': 'BUREAU VERITAS',
  'EDEN.PA': 'EDENRED',
  'FGR.PA': 'EIFFAGE',
  'IPN.PA': 'IPSEN',
  'NEX.PA': 'NEXANS',
  'RXL.PA': 'REXEL',
  'SOP.PA': 'SOPRA STERIA GROUP',
  'TEP.PA': 'TELEPERFORMANCE SE',
  'UBI.PA': 'UBISOFT ENTERTAINMENT',
  'VK.PA': 'VALLOUREC',
  'WLN.PA': 'WORLDLINE',

  // Vereinigtes Königreich, zweite Runde
  'ANTO.L': 'ANTOFAGASTA PLC',
  'BKG.L': 'THE BERKELEY GROUP HOLDINGS PLC',
  'BNZL.L': 'BUNZL PUBLIC LIMITED COMPANY',
  'BT-A.L': 'BT GROUP PLC',
  'CRDA.L': 'CRODA INTERNATIONAL PUBLIC LIMITED COMPANY',
  'EZJ.L': 'EASYJET PLC',
  'GAW.L': 'GAMES WORKSHOP GROUP PLC',
  'HLMA.L': 'HALMA PUBLIC LIMITED COMPANY',
  'IHG.L': 'INTERCONTINENTAL HOTELS GROUP PLC',
  'IMB.L': 'IMPERIAL BRANDS PLC',
  'INF.L': 'INFORMA PLC',
  'JMAT.L': 'JOHNSON MATTHEY PLC',
  'MKS.L': 'MARKS AND SPENCER GROUP P.L.C.',
  'MRO.L': 'MELROSE INDUSTRIES PLC',
  'NXT.L': 'NEXT PLC',
  'PSON.L': 'PEARSON PLC',
  'QQ.L': 'QINETIQ GROUP PLC',
  'RTO.L': 'RENTOKIL INITIAL PLC',
  'SDR.L': 'SCHRODERS PLC',
  'SGRO.L': 'SEGRO PUBLIC LIMITED COMPANY',
  'SMIN.L': 'SMITHS GROUP PLC',
  'SN.L': 'SMITH & NEPHEW PLC',
  'SPX.L': 'SPIRAX GROUP PLC',
  'SVT.L': 'SEVERN TRENT PLC',
  'UU.L': 'UNITED UTILITIES GROUP PLC',
  'WEIR.L': 'WEIR GROUP PLC(THE)',
  'WPP.L': 'WPP PLC',
  'WTB.L': 'WHITBREAD PLC',

  // Übriges Europa, zweite Runde
  'ALFA.ST': 'Alfa Laval AB',
  'ANDR.VI': 'Andritz AG',
  'ARCAD.AS': 'ARCADIS N.V.',
  'ARGX.BR': 'argenx SE',
  'CDR.WA': 'CD PROJEKT S.A.',
  'DEMANT.CO': 'DEMANT A/S',
  'ENX.PA': 'Euronext N.V.',
  'ERF.PA': 'EUROFINS SCIENTIFIC SE',
  'ESSITY-B.ST': 'Essity Aktiebolag (publ)',
  'GRF.MC': 'GRIFOLS S.A.',
  'JMT.LS': 'JERÓNIMO MARTINS SGPS SA',
  'KOG.OL': 'KONGSBERG GRUPPEN ASA',
  'KRX.IR': 'Kingspan Group plc',
  'LIGHT.AS': 'SIGNIFY N.V.',
  'LOTB.BR': 'LOTUS BAKERIES',
  'LPP.WA': 'LPP SA',
  'MOWI.OL': 'MOWI ASA',
  'MT.AS': 'ArcelorMittal',
  'SKF-B.ST': 'SKF Group',
  'STERV.HE': 'Stora Enso Oyj',
  'TIT.MI': 'TELECOM ITALIA SPA O TIM S.P.A.',
  'WIE.VI': 'Wienerberger AG',
  'WRT1V.HE': 'Wärtsilä Oyj Abp',
  'YAR.OL': 'YARA INTERNATIONAL ASA',

  /*
    Heineken Holding – und nur die.

    `HEIA.AS` steht weiter **nicht** in dieser Tabelle: Der Namenstreffer
    führt auf die Heineken Holding N.V., eine eigenständig notierte
    Gesellschaft mit anderem Eigenkapital. Für `HEIO.AS` ist genau diese
    Gesellschaft die richtige – dieselbe Zeile, umgekehrtes Vorzeichen.
  */
  'HEIO.AS': 'Heineken Holding N.V.',

  // Australien, zweite Runde – beide mit Londoner Notierung und ESEF-Meldung
  'S32.AX': 'SOUTH32 LIMITED',
  'WDS.AX': 'Woodside Energy Group Ltd',
}

/**
 * Was der Lauf vom 23. August 2026 sonst noch traf – und warum es draußen
 * bleibt.
 *
 * Steht als Liste da und nicht als Erinnerung: Jeder dieser Treffer sieht bei
 * der nächsten Sonde wieder wie ein Fund aus, und jeder ergäbe Zahlen, die auf
 * der Seite tadellos aussehen.
 *
 * - **Roche** (`ROG.SW`) traf `ROCHE BOBOIS` – den französischen Möbelhändler.
 *   403 Millionen Umsatz statt der sechzig Milliarden des Konzerns.
 * - **Wise** (`WISE.L`), der britische Zahlungsdienst, traf `Wise Group AB` –
 *   eine schwedische Gesellschaft mit 631 Millionen Kronen Umsatz.
 * - **Titan Company** (`TITAN.NS`, Indien) traf `Titan Cement International`
 *   in Belgien. Gemeinsam ist beiden nur das Wort.
 * - **SK Hynix** (`000660.KS`) und **SK Innovation** (`096770.KS`) trafen
 *   beide `SK텔레콤`, also SK Telecom – und damit dieselben Zahlen für zwei
 *   verschiedene Unternehmen. Schon 2026 einmal aufgefallen.
 * - **Nestlé** (`NESN.SW`) und **Nestlé India** (`NESTLEIND.NS`) trafen beide
 *   `NESTLE HOLDINGS, INC.`, die US-Finanzierungstochter.
 * - **Volvo** (`VOLV-B.ST`) traf `Volvo Car AB` – seit 1999 ein anderes
 *   Unternehmen als die Volvo AB.
 * - **SEB** (`SEB-A.ST`, Skandinaviska Enskilda Banken) traf `SEB SA`, den
 *   französischen Haushaltsgerätehersteller.
 * - **Hexagon** (`HEXA-B.ST`) traf `HEXAGON PURUS ASA`, **Sartorius**
 *   (`SRT3.DE`) traf `Sartorius Stedim Biotech`, **Siemens** (`SIE.DE`) traf
 *   `SIEMENS GAMESA RENEWABLE ENERGY SA`.
 * - **Rio Tinto** (`RIO.L`, `RIO.AX`) und **Carlsberg** (`CARL-B.CO`) bleiben
 *   aus den strukturellen Gründen draußen, die oben stehen: eine
 *   Doppelnotierung aus zwei gemeinsam bilanzierenden Gesellschaften, und die
 *   Betriebstochter statt der börsennotierten Mutter.
 * - **Heineken** (`HEIA.AS`) traf `Heineken Holding N.V.` Für `HEIA.AS` ist
 *   das die falsche Gesellschaft – für `HEIO.AS` ist es die richtige, und
 *   deshalb steht sie oben. Dieselbe Zeile, umgekehrtes Vorzeichen.
 */

/** Die gesuchten Größen nach IFRS, in der Rangfolge ihrer Bezeichner. */
const GROESSEN = [
  {
    feld: 'umsatz' as const,
    tags: ['Revenue', 'RevenueFromContractsWithCustomers'],
    zeitraum: true,
  },
  {
    /*
      Der Ergebnisanteil der Eigentümer zuerst, nicht der Jahresüberschuss.

      Aus dieser Zahl entsteht auf der Website das Kurs-Gewinn-Verhältnis, und
      der Kurs bezahlt genau diesen Anteil – nicht den Teil, der
      Minderheitsgesellschaftern gehört. Sie ist außerdem dieselbe Größe, auf
      der das Ergebnis je Aktie beruht, und damit die einzige, die zur
      Aktienzahl weiter unten passt. Der Jahresüberschuss bleibt Rückfallebene
      für Abschlüsse, die den Anteil nicht getrennt ausweisen.
    */
    feld: 'gewinn' as const,
    tags: ['ProfitLossAttributableToOwnersOfParent', 'ProfitLoss'],
    zeitraum: true,
  },
  {
    feld: 'cashflow' as const,
    tags: ['CashFlowsFromUsedInOperatingActivities'],
    zeitraum: true,
  },
  {
    feld: 'eigenkapital' as const,
    tags: ['Equity', 'EquityAttributableToOwnersOfParent'],
    zeitraum: false,
  },
]

/**
 * Bezeichner für die Aktienzahl.
 *
 * Anders als bei den übrigen Größen wird hier **nicht** nach Zeitpunkt oder
 * Zeitraum unterschieden: `NumberOfSharesOutstanding` ist ein Bestand zum
 * Stichtag, die gewichtete Durchschnittszahl dagegen eine Größe des Jahres.
 * Beide sind brauchbar, und wer hier filtert, verliert die Hälfte.
 */
const AKTIEN_TAGS = [
  'NumberOfSharesOutstanding',
  'NumberOfSharesIssued',
  'WeightedAverageNumberOfOrdinarySharesOutstanding',
  'WeightedAverageShares',
]

/**
 * Wie viele Meldungen je Unternehmen aufgehoben werden, um eine Jahreszahl zu
 * finden.
 *
 * Drei waren zu wenig: Coloplast schließt Ende September ab und hat seither
 * mehr Zwischenberichte im Verzeichnis, als das Fenster breit war. Die Zahl
 * kostet nichts, solange die neueste Meldung ein Jahresabschluss ist – dann
 * wird nur eine Datei geholt und der Rest gar nicht erst angefasst.
 */
const HOECHSTENS_MELDUNGEN = 6

/** Ergebnis je Aktie – der Umweg zur Aktienzahl, wenn sie nicht dasteht. */
const EPS_TAGS = ['BasicEarningsLossPerShare', 'DilutedEarningsLossPerShare']

/**
 * Der Zähler dieses Umwegs, in dieser Reihenfolge.
 *
 * Der Ergebnisanteil der Eigentümer zuerst, weil das Ergebnis je Aktie nach
 * IAS 33 genau darauf beruht. Der Jahresüberschuss ist nur die Rückfallebene
 * für Abschlüsse, die den Anteil nicht getrennt ausweisen – dort gibt es dann
 * meist auch keine nennenswerten Minderheiten.
 */
const EPS_ZAEHLER_TAGS = ['ProfitLossAttributableToOwnersOfParent', 'ProfitLoss']

interface Fakt {
  value?: unknown
  dimensions?: Record<string, string>
}
interface Bericht {
  facts?: Record<string, Fakt>
}

interface Eintrag {
  attributes?: Record<string, unknown>
  relationships?: { entity?: { data?: { id?: string } } }
}
interface Seite {
  data?: Eintrag[]
  included?: { id?: string; type?: string; attributes?: Record<string, unknown> }[]
  links?: { next?: string }
}

/**
 * Eine Adresse abrufen, mit drei Versuchen.
 *
 * ## Warum der Rumpf auch dann gelesen wird, wenn er nicht gebraucht wird
 *
 * Weil das Weglassen den ganzen Lauf umgebracht hat. Bei einer Antwort, die
 * nicht `ok` ist, stand hier ein `return null` – und der ungelesene Rumpf blieb
 * an einer offenen Verbindung hängen. Node bricht dann irgendwann mit
 * `assert(!this.paused)` aus dem HTTP-Unterbau ab, und zwar nicht als
 * abfangbarer Fehler an der Aufrufstelle, sondern als unbehandelte Ausnahme
 * aus dem Netzwerk-Rückruf. Der Lauf vom 29. Juli ist genau daran nach 60 von
 * 78 Unternehmen gestorben, ohne etwas zu committen.
 *
 * `cancel()` schließt den Rumpf ordentlich. Das ist eine Zeile, die nichts
 * bewirkt, solange alles gutgeht – und den Unterschied macht, sobald eine
 * Anfrage schiefläuft.
 */
async function hole(url: string): Promise<unknown | null> {
  for (let versuch = 1; versuch <= 3; versuch += 1) {
    try {
      const antwort = await fetch(url, {
        headers: KOPFZEILEN,
        signal: AbortSignal.timeout(60_000),
      })
      if (antwort.ok) return await antwort.json()

      await antwort.body?.cancel()
      if (antwort.status < 500) return null
    } catch (fehler) {
      console.log(
        `  Versuch ${versuch} bei ${url}: ${fehler instanceof Error ? fehler.message : fehler}`
      )
    }
    await new Promise((fertig) => setTimeout(fertig, versuch * 1000))
  }
  return null
}

/*
  Der letzte Rettungsanker.

  Sollte doch noch eine Ausnahme aus dem Netzwerk-Unterbau kommen, die sich an
  keiner Aufrufstelle abfangen lässt, bricht der Lauf mit einer verständlichen
  Meldung ab statt mit einem Stapelabzug aus den Interna von Node. Die
  Momentaufnahme bleibt dann unverändert – lieber alte Zahlen als halbe.
*/
process.on('uncaughtException', (fehler) => {
  console.error(`\nAbbruch durch einen unerwarteten Fehler: ${fehler.message}`)
  console.error('Die Momentaufnahme bleibt unverändert.')
  process.exit(1)
})

/** Dimensionen, die jeder Fakt trägt – alles Weitere ist eine Aufgliederung. */
const GRUNDDIMENSIONEN = new Set([
  'concept',
  'entity',
  'period',
  'unit',
  'language',
  'noteId',
])

function istKonzernwert(fakt: Fakt): boolean {
  return Object.keys(fakt.dimensions ?? {}).every((name) => GRUNDDIMENSIONEN.has(name))
}

/** Aus `2023-01-01T00:00:00/2024-01-01T00:00:00` wird `2024-01-01`. */
function periodenende(period: string | undefined): string {
  if (!period) return ''
  const teil = period.includes('/') ? period.split('/')[1] : period
  return teil.slice(0, 10)
}

function istJahr(period: string | undefined): boolean {
  if (!period?.includes('/')) return false
  const [von, bis] = period.split('/')
  const tage = (Date.parse(bis) - Date.parse(von)) / 86_400_000
  return tage > 300 && tage < 430
}

export interface Bilanzsatz {
  umsatz?: number
  gewinn?: number
  cashflow?: number
  eigenkapital?: number
  aktien?: number
  waehrung?: string
  stichtag?: string
  /** Woher die Aktienzahl kommt – für den Bericht am Ende. */
  aktienherkunft?: 'gemeldet' | 'ausErgebnisJeAktie'
}

function werteAus(bericht: Bericht): Bilanzsatz {
  const fakten = Object.values(bericht.facts ?? {})
  if (fakten.length === 0) return {}

  let stichtag = ''
  for (const fakt of fakten) {
    if (!istJahr(fakt.dimensions?.period)) continue
    const ende = periodenende(fakt.dimensions?.period)
    if (ende > stichtag) stichtag = ende
  }
  if (!stichtag) return {}

  const satz: Bilanzsatz = { stichtag }

  function suche(
    tags: readonly string[],
    zeitraum: boolean | null
  ): { zahl: number; einheit: string } | null {
    for (const tag of tags) {
      for (const fakt of fakten) {
        const dimensionen = fakt.dimensions ?? {}
        if (dimensionen.concept !== `ifrs-full:${tag}`) continue
        if (!istKonzernwert(fakt)) continue
        if (periodenende(dimensionen.period) !== stichtag) continue
        if (zeitraum === true && !istJahr(dimensionen.period)) continue
        if (zeitraum === false && dimensionen.period?.includes('/')) continue

        const zahl = Number(fakt.value)
        if (Number.isFinite(zahl)) return { zahl, einheit: dimensionen.unit ?? '' }
      }
    }
    return null
  }

  for (const groesse of GROESSEN) {
    const treffer = suche(groesse.tags, groesse.zeitraum)
    if (!treffer) continue
    satz[groesse.feld] = treffer.zahl
    // `iso4217:EUR` → `EUR`.
    if (!satz.waehrung && treffer.einheit.includes(':')) {
      satz.waehrung = treffer.einheit.split(':').pop() ?? ''
    }
  }

  const gemeldet = suche(AKTIEN_TAGS, null)
  if (gemeldet && gemeldet.zahl > 0) {
    satz.aktien = gemeldet.zahl
    satz.aktienherkunft = 'gemeldet'
  } else {
    /*
      Der Umweg über das Ergebnis je Aktie.

      Genommen wird nur, was zusammengehört: Zähler und Ergebnis je Aktie
      müssen dasselbe Vorzeichen haben. Sonst stammen die beiden Zahlen aus
      verschiedenen Größen, und herauskäme eine negative Aktienzahl.
    */
    const zaehler = suche(EPS_ZAEHLER_TAGS, true)
    const eps = suche(EPS_TAGS, true)
    if (
      zaehler &&
      eps &&
      eps.zahl !== 0 &&
      Math.sign(eps.zahl) === Math.sign(zaehler.zahl)
    ) {
      satz.aktien = Math.round(zaehler.zahl / eps.zahl)
      satz.aktienherkunft = 'ausErgebnisJeAktie'
    }
  }

  return satz
}

/**
 * Das Verzeichnis durchblättern: je Unternehmensname die jüngsten Abschlüsse.
 *
 * ## Warum mehrere und nicht nur der jüngste
 *
 * Weil der jüngste oft ein Halbjahresbericht ist. Coloplast schließt sein
 * Geschäftsjahr Ende September ab; im Verzeichnis stand als neuester Eintrag
 * der Bericht zum 31. März. Der enthält keinen Jahreszeitraum, und weil dieses
 * Skript einen Halbjahresumsatz zu Recht nicht als Jahresumsatz durchgehen
 * lässt, kam gar nichts an – Ørsted, Vestas und Coloplast standen deshalb ohne
 * Zahlen da, obwohl ihre Abschlüsse vollständig ausgezeichnet sind.
 *
 * Gehalten werden deshalb die drei jüngsten Meldungen je Unternehmen. Gelesen
 * wird von der neuesten an, bis eine einen Jahresabschluss hergibt.
 */
async function verzeichnis(): Promise<Map<string, { json: string; ende: string }[]>> {
  const namen = new Map<string, string>()
  const jeEntitaet = new Map<string, { json: string; ende: string; entitaet: string }[]>()

  let seite: string | null = `${VERZEICHNIS}?page%5Bsize%5D=500&include=entity`
  let seiten = 0

  while (seite && seiten < 60) {
    const antwort = (await hole(seite)) as Seite | null
    if (!antwort) break
    seiten += 1

    for (const e of antwort.included ?? []) {
      if (e.type !== 'entity' || !e.id) continue
      const name = String(e.attributes?.name ?? '')
      if (name) namen.set(e.id, name)
    }

    for (const f of antwort.data ?? []) {
      const entitaet = f.relationships?.entity?.data?.id
      const json = f.attributes?.json_url
      if (!entitaet || typeof json !== 'string' || !json) continue

      const eintraege = jeEntitaet.get(entitaet) ?? []
      eintraege.push({
        entitaet,
        ende: String(f.attributes?.period_end ?? ''),
        json: new URL(json, 'https://filings.xbrl.org/').toString(),
      })
      jeEntitaet.set(entitaet, eintraege)
    }

    seite = antwort.links?.next
      ? new URL(antwort.links.next, VERZEICHNIS).toString()
      : null
    await new Promise((fertig) => setTimeout(fertig, 150))
  }

  const nachName = new Map<string, { json: string; ende: string }[]>()
  for (const eintraege of jeEntitaet.values()) {
    const name = namen.get(eintraege[0].entitaet)
    if (!name) continue
    const jung = [...eintraege]
      .sort((a, b) => b.ende.localeCompare(a.ende))
      .slice(0, HOECHSTENS_MELDUNGEN)
      .map(({ json, ende }) => ({ json, ende }))
    const vorhanden = nachName.get(name) ?? []
    nachName.set(
      name,
      [...vorhanden, ...jung]
        .sort((a, b) => b.ende.localeCompare(a.ende))
        .slice(0, HOECHSTENS_MELDUNGEN)
    )
  }

  console.log(`${seiten} Seiten gelesen, ${nachName.size} Unternehmen mit Abschluss.\n`)
  return nachName
}

interface Momentaufnahme {
  abgerufenAm: string
  quelle: { label: string; url: string; abgrenzung: string }
  unternehmen: Record<string, Record<string, unknown>>
  /** Zweite Quelle, falls Einträge daraus stammen. */
  quelleEsef?: { label: string; url: string; abgrenzung: string }
  /** Welche Kürzel aus ESEF kommen – damit die Website die Herkunft nennen kann. */
  esefKuerzel?: string[]
}

async function main() {
  const nachName = await verzeichnis()
  if (nachName.size === 0) {
    console.error('Das Verzeichnis hat nichts geliefert. Abbruch ohne Änderung.')
    process.exit(1)
  }

  const alt = JSON.parse(await readFile(ZIEL, 'utf8')) as Momentaufnahme
  const neu: Record<string, Record<string, unknown>> = {}
  const fehlend: string[] = []

  for (const [ticker, name] of Object.entries(ZUORDNUNG)) {
    const abschluesse = nachName.get(name)
    if (!abschluesse || abschluesse.length === 0) {
      fehlend.push(`${ticker} (${name} steht nicht mehr im Verzeichnis)`)
      continue
    }

    /*
      Von der neuesten Meldung an, bis eine einen Jahresabschluss hergibt.
      Halbjahresberichte liefern hier nichts und werden übersprungen.
    */
    let satz: Bilanzsatz = {}
    for (const abschluss of abschluesse) {
      const bericht = (await hole(abschluss.json)) as Bericht | null
      await new Promise((fertig) => setTimeout(fertig, 200))
      if (!bericht) continue
      const gelesen = werteAus(bericht)
      if (gelesen.gewinn || gelesen.eigenkapital) {
        satz = gelesen
        break
      }
    }

    /*
      Ohne Aktienzahl ist der Datensatz für diese Website wertlos: Alle
      Verhältniszahlen laufen über sie. Er wird deshalb gar nicht erst
      aufgenommen – ein Eintrag mit vier Zahlen und ohne Kennzahl sähe auf der
      Seite aus wie ein Fehler.
    */
    if (!satz.aktien || !satz.waehrung) {
      fehlend.push(`${ticker} (${!satz.aktien ? 'keine Aktienzahl' : 'keine Währung'})`)
      continue
    }

    const eintrag: Record<string, unknown> = { waehrung: satz.waehrung }
    for (const feld of ['umsatz', 'gewinn', 'cashflow', 'eigenkapital'] as const) {
      if (typeof satz[feld] === 'number') eintrag[feld] = satz[feld]
    }
    eintrag.aktien = satz.aktien

    neu[ticker] = eintrag

    const mio = (wert: unknown) =>
      typeof wert === 'number' ? (wert / 1e6).toFixed(0).padStart(9) : '        –'
    console.log(
      `${ticker.padEnd(11)} ${satz.waehrung.padEnd(4)} Ums${mio(satz.umsatz)}` +
        ` Gew${mio(satz.gewinn)} EK${mio(satz.eigenkapital)}` +
        ` Aktien${(satz.aktien / 1e6).toFixed(0).padStart(8)} Mio.` +
        ` ${satz.aktienherkunft === 'gemeldet' ? '(gemeldet)' : '(aus EpA)'}` +
        `  ${satz.stichtag}`
    )
  }

  console.log(
    `\n${Object.keys(neu).length} von ${Object.keys(ZUORDNUNG).length} übernommen.`
  )
  if (fehlend.length > 0) console.log(`Ohne Zahlen: ${fehlend.join(', ')}`)

  /*
    Zusammenführen, ohne die SEC-Einträge anzurühren.

    Die SEC hat Vorrang: Wo ein Unternehmen dort meldet, sind die Zahlen
    geprüfter und die Aktienzahl steht auf dem Deckblatt. Überschneidungen
    sollte es nach der Zuordnung oben keine geben – falls doch, gewinnt der
    bestehende Eintrag, und die Stelle wird gemeldet.
  */
  const zusammen = { ...alt.unternehmen }
  const kollisionen: string[] = []
  const uebernommen: string[] = []

  for (const [ticker, eintrag] of Object.entries(neu)) {
    if (zusammen[ticker]) {
      kollisionen.push(ticker)
      continue
    }
    zusammen[ticker] = eintrag
    uebernommen.push(ticker)
  }

  if (kollisionen.length > 0) {
    console.log(`Bereits von der SEC gedeckt, übersprungen: ${kollisionen.join(', ')}`)
  }

  const ergebnis: Momentaufnahme = {
    ...alt,
    abgerufenAm: new Date().toISOString(),
    unternehmen: Object.fromEntries(
      Object.entries(zusammen).sort(([a], [b]) => a.localeCompare(b))
    ),
    quelleEsef: {
      label: 'ESEF-Pflichtmeldungen, Verzeichnis von XBRL International',
      url: 'https://filings.xbrl.org/',
      abgrenzung:
        'Umsatz, Nettogewinn, operativer Cashflow und Eigenkapital aus dem jüngsten Konzernabschluss, ausgezeichnet nach ifrs-full. Die Aktienzahl ist, wo sie nicht ausgezeichnet ist, aus Jahresüberschuss und Ergebnis je Aktie gerechnet – das ergibt die gewichtete Durchschnittszahl des Geschäftsjahres.',
    },
    esefKuerzel: [...new Set([...(alt.esefKuerzel ?? []), ...uebernommen])].sort(),
  }

  await writeFile(ZIEL, `${JSON.stringify(ergebnis, null, 2)}\n`)
  console.log(
    `\n${Object.keys(ergebnis.unternehmen).length} Unternehmen insgesamt in ${ZIEL}.`
  )
}

await main()
