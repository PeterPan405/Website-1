/**
 * Holt Bilanzkennzahlen bei der US-Börsenaufsicht und legt sie als
 * Momentaufnahme ab.
 *
 * ## Warum ausgerechnet die SEC
 *
 * Kurs-Gewinn-Verhältnis, Kurs-Umsatz-Verhältnis und Cashflow lassen sich
 * nicht aus Kursen rechnen – dafür braucht es Zahlen aus dem Unternehmen. Der
 * naheliegende Weg über Yahoo ist zu: Beide Kennzahlenschnittstellen antworten
 * mit `401 Unauthorized` beziehungsweise `Invalid Crumb`.
 *
 * Die SEC dagegen stellt die Pflichtmeldungen aller in den USA bilanzierenden
 * Unternehmen offen bereit – amtlich, gebührenfrei, ausdrücklich zur Nutzung
 * vorgesehen. Verlangt wird nur ein Absender mit Kontaktadresse, und den
 * schickt dieses Skript mit.
 *
 * ## Wie weit die SEC trägt
 *
 * Weiter, als hier lange stand. An dieser Stelle hieß es, die SEC kenne
 * ausschließlich Unternehmen, die in den USA bilanzieren – für Toyota, Shell
 * oder die Royal Bank of Canada gebe es nichts. Das stimmt nicht: Wer einen
 * Hinterlegungsschein in New York gelistet hat, reicht dort jedes Jahr einen
 * Geschäftsbericht ein, als `20-F` oder – aus Kanada – als `40-F`. Beide liegen
 * im selben XBRL-Format wie ein amerikanischer `10-K`.
 *
 * Was fehlte, war nicht die Quelle, sondern die Zuordnung: Die SEC kennt Toyota
 * als `TM`, diese Website als `7203.T`. Die Brücke unten hatte vier Einträge.
 *
 * Wirklich nichts gibt es für Unternehmen ohne US-Notierung – Nestlé, Allianz,
 * Samsung, die meisten deutschen und französischen Werte. Jedes Land hat seine
 * eigene Aufsicht mit eigenem Format, und die kommerziellen Anbieter verlangen
 * einen Schlüssel. Dort bleibt es bei „keine Angabe“: Ein geschätztes
 * Kurs-Gewinn-Verhältnis wäre schlimmer als gar keins, weil es aussähe wie eine
 * Tatsache.
 *
 * ## Warum `frames` und nicht `companyfacts`
 *
 * `companyfacts` liefert alles zu **einem** Unternehmen: bei 500 Werten also
 * 500 Abrufe. Die `frames`-Schnittstelle dreht das um und liefert **eine**
 * Kennzahl für **alle** Melder eines Quartals – im Test 2.543 Unternehmen in
 * einem Aufruf. Aus 500 Anfragen werden damit gut zwanzig.
 *
 * Aufruf: `npm run fundamentaldaten`
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

/**
 * Die SEC verlangt in ihren Nutzungshinweisen ausdrücklich einen Absender mit
 * Kontaktmöglichkeit. Ohne ihn wird gedrosselt oder gesperrt – und das zu Recht.
 */
const KOPFZEILEN: Record<string, string> = {
  'User-Agent': 'IM-Invests Datenabruf pm252543@gmail.com',
  'Accept-Encoding': 'gzip, deflate',
}

const TICKER_URL = 'https://www.sec.gov/files/company_tickers.json'
const RAHMEN_BASIS = 'https://data.sec.gov/api/xbrl/frames'
/**
 * Alles zu einem Unternehmen in einem Abruf.
 *
 * Der Weg fuer alle, die die Rahmenabfrage nicht erwischt: IFRS-Melder, weil
 * es fuer `ifrs-full` keine Rahmen gibt, und us-gaap-Melder, die nicht in
 * Dollar berichten.
 */
const FAKTEN_BASIS = 'https://data.sec.gov/api/xbrl/companyfacts'
const ZIEL = 'data/snapshots/fundamentaldaten.json'

/** Die Dateien, aus denen hervorgeht, welche Kürzel die Website überhaupt führt. */
const KATALOG = ['data/markets.ts', 'data/markets-aktien.ts']

/**
 * Kuerzelbruecke fuer Unternehmen, die hier anders heissen als bei der SEC.
 *
 * Diese Website fuehrt Toyota unter `7203.T` – dem Kuerzel der Boerse Tokio,
 * an der die Aktie tatsaechlich gehandelt wird. Die SEC kennt dasselbe
 * Unternehmen als `TM`, das Kuerzel seines US-Hinterlegungsscheins. Ohne diese
 * Zuordnung findet der Abgleich nichts, obwohl beide Seiten Daten haben.
 *
 * ## Warum die Tabelle so gewachsen ist
 *
 * Sie hatte vier Eintraege, und dahinter stand die Annahme, ausserhalb der USA
 * melde ohnehin kaum jemand bei der SEC. Das gilt nur fuer Unternehmen ohne
 * Hinterlegungsschein in New York. Wer einen hat, reicht jaehrlich einen
 * `20-F` ein, kanadische Gesellschaften einen `40-F` – im selben XBRL-Format
 * wie ein amerikanischer `10-K` und genauso frei abrufbar.
 *
 * `scripts/quellen-probe-fundamentaldaten.ts` hat die 357 Aktien ohne Zahlen
 * gegen das Kuerzelverzeichnis der SEC gehalten und jeden Treffer mit einem
 * echten Abruf geprueft. Von 114 Fundstellen sind die hier eingetragenen
 * uebriggeblieben; der Rest waren Namensverwechslungen, und die faellt auf
 * der Website niemandem auf, weil die Zahlen ja plausibel aussaehen:
 *
 * - `MRK.DE` (Merck KGaA, Darmstadt) traf `MRK` (Merck & Co., New Jersey) –
 *   zwei Unternehmen, die seit 1917 nichts miteinander zu tun haben.
 * - `0700.HK` (Tencent) traf `TME` (Tencent Music), eine Tochter.
 * - `RELIANCE.NS` (Reliance Industries, Mumbai) traf `RS` (Reliance Inc.,
 *   ein Stahlhaendler in Los Angeles).
 * - `WALMEX.MX` (Walmart de Mexico) traf die Mutter `WMT`.
 * - `DG.PA` (Vinci) traf `VINP` (Vinci Partners, Brasilien).
 * - `LDO.MI` (Leonardo) traf `DRS`, die US-Tochter.
 * - `8058.T` (Mitsubishi Corporation) traf `MUFG`, die Bankengruppe.
 * - `FRE.DE` (Fresenius SE) traf `FMS` – das ist Fresenius Medical Care und
 *   steht hier eigenstaendig als `FME.DE`.
 * - `CPG.L` (Compass Group) traf `COMP` (Compass Inc., ein Immobilienportal).
 * - `0386.HK` (Sinopec) traf eine boersennotierte Tochter statt der Mutter.
 * - `BN.TO` (Brookfield) traf zwoelf Brookfield-Gesellschaften; genau eine
 *   davon ist die richtige.
 *
 * Nicht aufgenommen sind ausserdem Rio Tinto und Rio Tinto Limited: Die Gruppe
 * ist eine Doppelnotierung aus zwei Gesellschaften, die gemeinsam bilanzieren.
 * Der Konzernumsatz zur Aktienzahl nur einer der beiden ergaebe eine Bewertung,
 * die um den Anteil der anderen danebenliegt.
 *
 * ## Waehrungen
 *
 * Aufgenommen ist auch, wo Melde- und Kurswaehrung auseinandergehen – Shell
 * berichtet in Dollar und notiert in London. Die Zahl wandert dann mit ihrer
 * Waehrung in die Momentaufnahme; ob sich damit rechnen laesst, entscheidet
 * `lib/markets.ts`.
 */
const KUERZELBRUECKE: Record<string, string> = {
  // ---- Japan ----
  '7203.T': 'TM', // Toyota
  '6758.T': 'SONY', // Sony
  '7267.T': 'HMC', // Honda
  '6501.T': 'HTHIY', // Hitachi
  '6857.T': 'ATEYY', // Advantest
  '7751.T': 'CAJPY', // Canon
  '8306.T': 'MUFG', // Mitsubishi UFJ Financial
  '8316.T': 'SMFG', // Sumitomo Mitsui Financial
  '8411.T': 'MFG', // Mizuho Financial
  '4502.T': 'TAK', // Takeda
  '9432.T': 'NTTYY', // Nippon Telegraph and Telephone

  // ---- Deutschland ----
  'DBK.DE': 'DB', // Deutsche Bank
  'FME.DE': 'FMS', // Fresenius Medical Care
  'QIA.DE': 'QGEN', // Qiagen

  // ---- Frankreich ----
  'SAN.PA': 'SNY', // Sanofi
  'ORA.PA': 'FNCTF', // Orange
  'TTE.PA': 'TTE', // TotalEnergies
  'STMPA.PA': 'STM', // STMicroelectronics

  // ---- Grossbritannien ----
  'GSK.L': 'GSK',
  'DGE.L': 'DEO', // Diageo
  'BATS.L': 'BTI', // British American Tobacco
  'BARC.L': 'BCS', // Barclays
  'LLOY.L': 'LYG', // Lloyds Banking Group
  'NWG.L': 'NWG', // NatWest Group
  'PRU.L': 'PUK', // Prudential plc
  'NG.L': 'NGG', // National Grid
  'REL.L': 'RELX',
  'HSBA.L': 'HSBC',
  'SHEL.L': 'SHEL', // Shell
  'AZN.L': 'AZN', // AstraZeneca
  'ULVR.L': 'UL', // Unilever
  'BP.L': 'BP',
  'VOD.L': 'VOD', // Vodafone

  // ---- Schweiz ----
  'UBSG.SW': 'UBS', // UBS Group
  'NOVN.SW': 'NVS', // Novartis
  'ABBN.SW': 'ABLZF', // ABB
  'ALC.SW': 'ALC', // Alcon

  // ---- Uebriges Europa ----
  'SAN.MC': 'SAN', // Banco Santander
  'TEF.MC': 'TEFOF', // Telefonica
  'FER.MC': 'FER', // Ferrovial
  'ENI.MI': 'E', // Eni
  'ERIC-B.ST': 'ERIC', // Ericsson
  'NOVO-B.CO': 'NVO', // Novo Nordisk
  'EQNR.OL': 'EQNR', // Equinor
  'ABI.BR': 'BUD', // Anheuser-Busch InBev

  // ---- Asien ausserhalb Japans ----
  '005490.KS': 'PKX', // POSCO Holdings
  '055550.KS': 'SHG', // Shinhan Financial
  '105560.KS': 'KB', // KB Financial
  '2303.TW': 'UMC', // United Microelectronics
  'WIPRO.NS': 'WIT', // Wipro
  'HDFCBANK.NS': 'HDB', // HDFC Bank
  'INFY.NS': 'INFY', // Infosys
  '9988.HK': 'BABA', // Alibaba
  '9618.HK': 'JD', // JD.com
  '9999.HK': 'NTES', // NetEase
  '2015.HK': 'LI', // Li Auto
  '2628.HK': 'CILJF', // China Life Insurance
  '0857.HK': 'PCCYF', // PetroChina

  // ---- Australien ----
  'BHP.AX': 'BHP', // BHP Group
  'WBC.AX': 'WEBNF', // Westpac Banking

  // ---- Kanada ----
  'RY.TO': 'RY', // Royal Bank of Canada
  'TD.TO': 'TD', // Toronto-Dominion Bank
  'BNS.TO': 'BNS', // Bank of Nova Scotia
  'BMO.TO': 'BMO', // Bank of Montreal
  'ENB.TO': 'ENB', // Enbridge
  'SU.TO': 'SU', // Suncor Energy
  'CNQ.TO': 'CNQ', // Canadian Natural Resources
  'CNR.TO': 'CNI', // Canadian National Railway
  'CP.TO': 'CP', // Canadian Pacific Kansas City
  'BN.TO': 'BN', // Brookfield Corporation
  'SHOP.TO': 'SHOP', // Shopify
  'ABX.TO': 'B', // Barrick Mining
  'AEM.TO': 'AEM', // Agnico Eagle Mines
  'NTR.TO': 'NTR', // Nutrien
  'TRI.TO': 'TRI', // Thomson Reuters

  // ---- Lateinamerika ----
  'ITUB4.SA': 'ITUB', // Itau Unibanco
  'ABEV3.SA': 'ABEV', // Ambev
  'SUZB3.SA': 'SUZ', // Suzano
  'PETR4.SA': 'PBR', // Petrobras
  'AMXB.MX': 'AMX', // America Movil
  'CEMEXCPO.MX': 'CX', // Cemex

  // ---- US-Kuerzel, die bei der SEC anders heissen ----
  FI: 'FISV', // Fiserv – die SEC fuehrt das alte Kuerzel
  MMC: 'MRSH', // Marsh & McLennan – ebenso
}

/**
 * Die Waehrung, in der ein Kurs auf dieser Website notiert.
 *
 * Wird beim Zuschnitt aus dem Katalog gelesen, damit die Umrechnung weiss,
 * wohin. Ohne sie liesse sich nicht entscheiden, ob ein Euro-Umsatz zu einem
 * Kurs passt oder erst umgerechnet werden muss.
 */
const waehrungJeKuerzel = new Map<string, string>()

/**
 * Die gesuchten Größen, jeweils mit den Bezeichnern, unter denen sie gemeldet
 * werden.
 *
 * Mehrere je Größe, weil die US-Rechnungslegung Wahlmöglichkeiten lässt: Der
 * eine meldet Umsatz als `Revenues`, der andere als
 * `RevenueFromContractWithCustomerExcludingAssessedTax`. Genommen wird der
 * erste Bezeichner, der für ein Unternehmen einen Wert liefert – nicht die
 * Summe, denn das wären dieselben Erlöse doppelt.
 */
const GROESSEN = [
  {
    feld: 'umsatz' as const,
    einheit: 'USD',
    taxonomie: 'us-gaap',
    tags: ['RevenueFromContractWithCustomerExcludingAssessedTax', 'Revenues'],
    /** Fließgrößen werden über vier Quartale summiert, Bestände nicht. */
    fliessgroesse: true,
  },
  {
    feld: 'gewinn' as const,
    einheit: 'USD',
    taxonomie: 'us-gaap',
    tags: ['NetIncomeLoss'],
    fliessgroesse: true,
  },
  {
    feld: 'cashflow' as const,
    einheit: 'USD',
    taxonomie: 'us-gaap',
    tags: [
      'NetCashProvidedByUsedInOperatingActivities',
      'NetCashProvidedByUsedInOperatingActivitiesContinuingOperations',
    ],
    fliessgroesse: true,
  },
  {
    feld: 'eigenkapital' as const,
    einheit: 'USD',
    taxonomie: 'us-gaap',
    tags: [
      'StockholdersEquity',
      'StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest',
    ],
    fliessgroesse: false,
  },
  {
    /*
      Die Aktienzahl steht nicht in `us-gaap`, sondern in `dei` – dem
      Begriffssatz für die Angaben auf dem Deckblatt einer Meldung. Genau dort
      steht, wie viele Aktien am Stichtag ausstanden.
    */
    feld: 'aktien' as const,
    einheit: 'shares',
    taxonomie: 'dei',
    tags: ['EntityCommonStockSharesOutstanding'],
    fliessgroesse: false,
  },
]

type Feld = (typeof GROESSEN)[number]['feld']

/**
 * Dieselben Groessen nach internationalen Vorschriften.
 *
 * ## Warum das eine zweite Runde braucht
 *
 * Wer als auslaendischer Emittent in den USA notiert und nach IFRS bilanziert,
 * meldet nicht in `us-gaap`, sondern in `ifrs-full`. Die erste Runde hat diese
 * Unternehmen deshalb gar nicht gesehen – SAP, Novo Nordisk, Toyota, Stellantis,
 * Ferrari und rund zwei Dutzend weitere standen auf der Seite ohne Kennzahlen.
 *
 * ## Warum je Unternehmen und nicht als Rahmen
 *
 * Weil es fuer `ifrs-full` keine Rahmen gibt: Jede Abfrage an
 * `frames/ifrs-full/...` antwortet mit 404, geprueft fuer Umsatz, Gewinn und
 * Eigenkapital. Der Sammelabruf, der die erste Runde auf zwanzig Anfragen
 * gedrueckt hat, faellt hier aus – es bleibt nur `companyconcept`, also eine
 * Abfrage je Unternehmen und Groesse.
 *
 * ## Warum die Waehrung mitkommt
 *
 * IFRS-Melder berichten in ihrer eigenen Waehrung: SAP in Euro, Novo Nordisk in
 * Kronen, Toyota in Yen. Eine Umrechnung in Dollar waere hier falsch, weil die
 * Kurse auf dieser Seite teils in derselben Waehrung notieren – Toyota in Yen,
 * Samsung in Won. Abgelegt wird deshalb der gemeldete Wert **mit** seiner
 * Waehrung; was damit geschieht, entscheidet die Website.
 */
const IFRS_GROESSEN = [
  {
    feld: 'umsatz' as const,
    tags: ['Revenue', 'RevenueFromContractsWithCustomers'],
    zeitraum: true,
  },
  {
    feld: 'gewinn' as const,
    tags: ['ProfitLoss', 'ProfitLossAttributableToOwnersOfParent'],
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

/** Nur Jahresberichte – ein Quartalswert unter derselben Ueberschrift waere falsch. */
const JAHRESBERICHTE = ['10-K', '20-F', '40-F']

/**
 * Dieselben Groessen, nach Rechnungslegung sortiert.
 *
 * Die zweite Runde fragt beide ab. Frueher nur `ifrs-full`, und das riss eine
 * Luecke, die niemand vermutet haette: Wer nach US-Vorschriften bilanziert,
 * aber **nicht in Dollar** meldet, fiel durch beide Runden. Die erste sucht in
 * Dollar-Rahmen und findet ihn dort nicht; die zweite suchte nur nach IFRS und
 * fand ihn auch nicht. Betroffen waren unter anderem Enbridge, die Canadian
 * National Railway und die drei japanischen Grossbanken – allesamt us-gaap,
 * allesamt in Landeswaehrung.
 */
const GROESSEN_JE_TAXONOMIE: Record<
  string,
  { feld: Feld; tags: readonly string[]; zeitraum: boolean }[]
> = {
  'us-gaap': GROESSEN.filter((g) => g.taxonomie === 'us-gaap').map((g) => ({
    feld: g.feld,
    tags: g.tags,
    zeitraum: g.fliessgroesse,
  })),
  'ifrs-full': IFRS_GROESSEN.map((g) => ({
    feld: g.feld,
    tags: g.tags,
    zeitraum: g.zeitraum,
  })),
}

interface Faktenreihe {
  start?: string
  end: string
  val: number
  form?: string
}

/** Die Antwort von `companyfacts`: alles zu einem Unternehmen in einem Abruf. */
interface Fakten {
  entityName?: string
  facts?: Record<string, Record<string, { units?: Record<string, Faktenreihe[]> }>>
}

/**
 * Der juengste Jahreswert einer Groesse, getrennt nach Waehrung.
 *
 * Getrennt, weil viele auslaendische Melder zweigleisig berichten: UBS in
 * Franken und Dollar, Wipro in Rupien und Dollar. Welche der beiden Reihen die
 * richtige ist, entscheidet sich erst spaeter am Kurs – hier werden beide
 * aufgehoben.
 */
function jahreswerteJeWaehrung(
  einheiten: Record<string, Faktenreihe[]>,
  zeitraum: boolean
): Map<string, { wert: number; ende: string }> {
  const je = new Map<string, { wert: number; ende: string }>()

  for (const [waehrung, eintraege] of Object.entries(einheiten)) {
    if (waehrung === 'shares' || waehrung === 'pure') continue
    for (const eintrag of eintraege) {
      if (!JAHRESBERICHTE.includes(eintrag.form ?? '')) continue
      if (typeof eintrag.val !== 'number' || !Number.isFinite(eintrag.val)) continue

      if (zeitraum) {
        if (!eintrag.start) continue
        const tage = (Date.parse(eintrag.end) - Date.parse(eintrag.start)) / 86_400_000
        if (!(tage > 300 && tage < 400)) continue
      }

      const bisher = je.get(waehrung)
      if (!bisher || eintrag.end > bisher.ende) {
        je.set(waehrung, { wert: eintrag.val, ende: eintrag.end })
      }
    }
  }

  return je
}

/**
 * Wie alt der juengste Abschluss einer Reihe hoechstens sein darf.
 *
 * Zwei Jahre und ein halbes. Wer laenger nichts gemeldet hat, ist entweder von
 * der Boerse verschwunden oder meldet unter anderem Namen weiter – in beiden
 * Faellen taugen die Zahlen nicht mehr, um einen heutigen Kurs einzuordnen.
 */
const HOECHSTALTER_TAGE = 900

/**
 * Der beste zusammenhaengende Satz Zahlen aus einer `companyfacts`-Antwort.
 *
 * „Zusammenhaengend“ heisst: eine Rechnungslegung, eine Waehrung. Ein Umsatz
 * in Euro neben einem Eigenkapital in Dollar ergaebe ein
 * Kurs-Buchwert-Verhaeltnis, das um den Wechselkurs danebenliegt, und dem
 * sieht man nichts an.
 *
 * ## Die Rangfolge unter mehreren Saetzen
 *
 * 1. **Nicht veraltet.** Diese Regel kam nachtraeglich dazu, und zwar wegen
 *    UBS. Die Bank meldet seit 2018 in Dollar, in den Meldungen davor stehen
 *    Franken. Der Franken-Satz war vollstaendig, passte zur Kurswaehrung und
 *    gewann deshalb – gerechnet ergab das ein Kurs-Gewinn-Verhaeltnis von 126
 *    aus einem Gewinn des Jahres 2017. Das sah aus wie eine teure Aktie und war
 *    eine acht Jahre alte Zahl.
 * 2. **Mehr belegte Groessen.** Vier Zahlen sind besser als zwei.
 * 3. **Juenger.** Bei gleicher Anzahl gewinnt der neuere Abschluss.
 * 4. **Kurswaehrung.** Erst zuletzt, und nur unter sonst Gleichen: Damit laesst
 *    sich ohne Umrechnung rechnen, aber es ist kein Grund, aeltere oder
 *    duennere Zahlen zu nehmen.
 */
function bestenSatz(
  fakten: Fakten,
  kurswaehrung: string | undefined
): {
  taxonomie: string
  waehrung: string
  werte: Partial<Record<Feld, number>>
  ende: string
} | null {
  const kandidaten: {
    taxonomie: string
    waehrung: string
    werte: Partial<Record<Feld, number>>
    ende: string
  }[] = []

  for (const [taxonomie, groessen] of Object.entries(GROESSEN_JE_TAXONOMIE)) {
    const jeWaehrung = new Map<
      string,
      { werte: Partial<Record<Feld, number>>; ende: string }
    >()

    for (const groesse of groessen) {
      for (const tag of groesse.tags) {
        const einheiten = fakten.facts?.[taxonomie]?.[tag]?.units
        if (!einheiten) continue
        const treffer = jahreswerteJeWaehrung(einheiten, groesse.zeitraum)
        if (treffer.size === 0) continue

        for (const [waehrung, gefunden] of treffer) {
          const eintrag = jeWaehrung.get(waehrung) ?? { werte: {}, ende: '' }
          // Erster Bezeichner gewinnt; ein zweiter waeren dieselben Erloese doppelt.
          if (eintrag.werte[groesse.feld] === undefined) {
            eintrag.werte[groesse.feld] = gefunden.wert
          }
          if (gefunden.ende > eintrag.ende) eintrag.ende = gefunden.ende
          jeWaehrung.set(waehrung, eintrag)
        }
        break
      }
    }

    for (const [waehrung, eintrag] of jeWaehrung) {
      kandidaten.push({ taxonomie, waehrung, ...eintrag })
    }
  }

  const grenze = Date.now() - HOECHSTALTER_TAGE * 86_400_000
  const aktuell = kandidaten.filter((k) => Date.parse(k.ende) >= grenze)
  if (aktuell.length === 0) return null

  aktuell.sort((a, b) => {
    const anzahl = Object.keys(b.werte).length - Object.keys(a.werte).length
    if (anzahl !== 0) return anzahl
    if (a.ende !== b.ende) return a.ende < b.ende ? 1 : -1
    const passtA = a.waehrung === kurswaehrung ? 1 : 0
    const passtB = b.waehrung === kurswaehrung ? 1 : 0
    return passtB - passtA
  })

  return aktuell[0]
}

/**
 * Wo eine Aktienzahl stehen kann, in der Reihenfolge, in der sie gesucht wird.
 *
 * Nur den ersten Bezeichner zu nehmen, hat 45 Unternehmen ohne Aktienzahl
 * dastehen lassen – darunter Meta, Alphabet, Visa und Mastercard, also
 * ausgerechnet die, die jeder zuerst aufschlaegt. Ohne Aktienzahl rechnet keine
 * der fuenf Kennzahlen, denn alle fuehren ueber den Wert je Aktie.
 *
 * `dei` steht vorn, weil es der Wert vom Deckblatt der juengsten Meldung ist
 * und damit der aktuellste. Danach die Bestandsangaben aus der Bilanz. Zuletzt
 * der gewichtete Jahresdurchschnitt: Der ist streng genommen etwas anderes –
 * ein Mittel ueber das Jahr statt ein Stand am Stichtag –, aber der Unterschied
 * liegt bei wenigen Prozent, und er ist die Zahl, mit der das Unternehmen
 * selbst seinen Gewinn je Aktie ausweist.
 */
const AKTIENZAHL_BEZEICHNER: [string, string][] = [
  ['dei', 'EntityCommonStockSharesOutstanding'],
  ['ifrs-full', 'NumberOfSharesOutstanding'],
  ['us-gaap', 'CommonStockSharesOutstanding'],
  ['us-gaap', 'CommonStockSharesIssued'],
  ['ifrs-full', 'WeightedAverageNumberOfOrdinarySharesOutstanding'],
  ['us-gaap', 'WeightedAverageNumberOfSharesOutstandingBasic'],
  ['us-gaap', 'WeightedAverageNumberOfDilutedSharesOutstanding'],
]

/**
 * Die Aktienzahl vom juengsten Stichtag – aber nur, wenn sie aktuell ist.
 *
 * Sony und Honda haben 2024 ihre Aktien gesplittet. Die juengste Angabe der
 * SEC stammte bei beiden von davor; gerechnet ergab das ein
 * Kurs-Gewinn-Verhaeltnis von 3,9 beziehungsweise 3,0, also den drei- bis
 * fuenffachen Fehler, und der sah aus wie eine Tatsache.
 *
 * Ein Split aendert die Aktienzahl schlagartig, den Kurs im selben Verhaeltnis
 * und den Boersenwert gar nicht. Wer beide aus verschiedenen Zeiten
 * kombiniert, bekommt genau diesen Faktor als Fehler. Deshalb: nur, was nicht
 * aelter als 15 Monate ist – und wenn der erste Bezeichner nur Veraltetes
 * hergibt, wird der naechste gefragt, statt aufzugeben.
 */
function aktienzahlAusFakten(fakten: Fakten, wo: string): number | undefined {
  const grenze = Date.now() - 450 * 86_400_000
  let aeltester: { wert: number; ende: string; woher: string } | null = null

  for (const [taxonomie, tag] of AKTIENZAHL_BEZEICHNER) {
    const einheiten = fakten.facts?.[taxonomie]?.[tag]?.units
    if (!einheiten) continue

    let bester: { wert: number; ende: string } | null = null
    for (const eintraege of Object.values(einheiten)) {
      for (const eintrag of eintraege) {
        if (typeof eintrag.val !== 'number' || !Number.isFinite(eintrag.val)) continue
        // Eine Aktienzahl unter tausend ist keine, sondern ein Lesefehler.
        if (eintrag.val < 1000) continue
        if (!bester || eintrag.end > bester.ende) {
          bester = { wert: eintrag.val, ende: eintrag.end }
        }
      }
    }
    if (!bester) continue

    if (Date.parse(bester.ende) >= grenze) return bester.wert
    if (!aeltester || bester.ende > aeltester.ende) {
      aeltester = { ...bester, woher: `${taxonomie}:${tag}` }
    }
  }

  if (aeltester) {
    console.log(
      `  ${wo}: juengste Aktienzahl vom ${aeltester.ende} (${aeltester.woher}) ist zu alt – ausgelassen.`
    )
  }
  return undefined
}

interface Rahmenantwort {
  data?: { cik: number; entityName?: string; val?: number }[]
}

async function hole(url: string, stillBei404 = false): Promise<unknown | null> {
  try {
    const antwort = await fetch(url, { headers: KOPFZEILEN })
    if (!antwort.ok) {
      /*
        Beim Durchprobieren von Bezeichnern ist 404 der Regelfall.

        Jeder Versuch, der ins Leere geht, waere sonst eine Zeile im Protokoll –
        bei zweihundert Unternehmen mal fuenf Bezeichnern waeren das tausend
        Zeilen, in denen die echten Fehler untergingen.
      */
      if (!(stillBei404 && antwort.status === 404)) {
        console.log(`  ${antwort.status} bei ${url.replace(RAHMEN_BASIS, '…')}`)
      }
      return null
    }
    return await antwort.json()
  } catch (fehler) {
    console.log(
      `  Fehler bei ${url}: ${fehler instanceof Error ? fehler.message : fehler}`
    )
    return null
  }
}

/**
 * Die zuletzt abgeschlossenen Quartale, jüngstes zuerst.
 *
 * Bewusst nicht das laufende: Wer im Juli nach `CY2026Q3` fragt, bekommt eine
 * halb gefüllte Antwort, weil die meisten noch nicht gemeldet haben. Für eine
 * Jahreszahl braucht es ohnehin vier zusammenhängende Quartale.
 */
function quartale(anzahl: number): string[] {
  const jetzt = new Date()
  // Ein Quartal Vorlauf: Meldungen kommen mit Wochen Verzug.
  let jahr = jetzt.getUTCFullYear()
  let q = Math.floor(jetzt.getUTCMonth() / 3) // 0..3, laufendes Quartal
  const liste: string[] = []
  for (let i = 0; i < anzahl; i += 1) {
    q -= 1
    if (q < 0) {
      q = 3
      jahr -= 1
    }
    liste.push(`CY${jahr}Q${q + 1}`)
  }
  return liste
}

/** Abgeschlossene Kalenderjahre, jüngstes zuerst. */
function jahre(anzahl: number): string[] {
  const jetzt = new Date().getUTCFullYear()
  return Array.from({ length: anzahl }, (_, i) => `CY${jetzt - 1 - i}`)
}

async function main() {
  console.log('Zuordnung Kürzel → Kennnummer holen …')
  const roh = (await hole(TICKER_URL)) as Record<
    string,
    { cik_str: number; ticker: string }
  > | null
  if (!roh) throw new Error('Die Zuordnungsdatei der SEC ist nicht erreichbar.')

  // Mehrere Kürzel können auf dieselbe Kennnummer zeigen (Vorzugsaktien).
  // Umgekehrt gilt: je Kennnummer ein Datensatz.
  const kuerzelJeCik = new Map<number, string[]>()
  for (const eintrag of Object.values(roh)) {
    const liste = kuerzelJeCik.get(eintrag.cik_str) ?? []
    liste.push(eintrag.ticker)
    kuerzelJeCik.set(eintrag.cik_str, liste)
  }
  console.log(`${kuerzelJeCik.size} Unternehmen gelistet.`)

  const werte = new Map<number, Partial<Record<Feld, number>> & { stand?: string }>()

  for (const groesse of GROESSEN) {
    console.log(`\n${groesse.feld} …`)
    /*
      Fließgrößen als **Jahresrahmen**, nicht als Summe von vier Quartalen.

      Der zweite Lauf hat gezeigt, warum: Die Quartalsrahmen der SEC enthalten
      nur Unternehmen, deren Geschäftsquartal auf das Kalenderquartal fällt.
      Wer sein Jahr im September beendet – und das sind viele –, taucht in
      `CY2025Q4` gar nicht auf, und die Bedingung „vier Quartale beisammen“
      warf ihn heraus. Von 1.199 Kürzeln mit Daten blieben so 127 vollständige.

      Der Jahresrahmen `CY2025` liefert dagegen den Zwölfmonatswert direkt,
      unabhängig davon, wann das Geschäftsjahr endet. Ein Aufruf statt vier,
      keine Summe, keine Bedingung.
    */
    const zeitraeume = groesse.fliessgroesse ? jahre(3) : quartale(4)
    const gesammelt = new Map<number, number>()
    let quelleGefunden = ''

    for (const tag of groesse.tags) {
      for (const zeitraum of zeitraeume) {
        /*
          Stichtagsgrößen brauchen ein angehängtes `I`.

          Die SEC unterscheidet Zeitraum- von Stichtagsangaben: Ein Umsatz gilt
          für ein Jahr (`CY2025`), ein Eigenkapital an einem Tag
          (`CY2025Q4I`). Ohne das `I` antwortet die Schnittstelle mit 404.
        */
        const periode = groesse.fliessgroesse ? zeitraum : `${zeitraum}I`
        const url = `${RAHMEN_BASIS}/${groesse.taxonomie}/${tag}/${groesse.einheit}/${periode}.json`
        const antwort = (await hole(url)) as Rahmenantwort | null
        if (!antwort?.data) continue
        if (!quelleGefunden) quelleGefunden = tag
        for (const eintrag of antwort.data) {
          if (typeof eintrag.val !== 'number' || !Number.isFinite(eintrag.val)) continue
          // Jüngster Zeitraum zuerst – wer schon einen Wert hat, behält ihn.
          if (!gesammelt.has(eintrag.cik)) gesammelt.set(eintrag.cik, eintrag.val)
        }
        // Zwischen den Abrufen kurz warten – die SEC bittet um Zurückhaltung.
        await new Promise((fertig) => setTimeout(fertig, 250))
      }
    }

    for (const [cik, wert] of gesammelt) {
      const eintrag = werte.get(cik) ?? {}
      eintrag[groesse.feld] = wert
      werte.set(cik, eintrag)
    }
    console.log(
      `  ${gesammelt.size} Unternehmen (Bezeichner: ${quelleGefunden || 'keiner'})`
    )
  }

  /*
    Nur die Kürzel behalten, die auf der Website vorkommen.

    Die SEC liefert gut 8.000 Unternehmen; geführt werden rund 200. Ungefiltert
    wären das 1,1 MB, die monatlich neu ins Repository wandern und beim Bauen
    eingelesen werden – für 2 Prozent Nutzen. Der Zuschnitt kostet nichts, weil
    ohnehin schon alles im Speicher liegt.
  */
  const gefuehrt = new Set<string>()
  for (const datei of KATALOG) {
    const text = await readFile(datei, 'utf8')
    /*
      Der Name steht in einfachen **oder** doppelten Anführungszeichen.

      "McDonald's", "L'Oréal" und "Sainsbury's" tragen ein Apostroph und stehen
      deshalb in doppelten. Ein Muster nur für einfache übersah sie – nicht
      hörbar, weil der Auffangdurchlauf darunter das Kürzel trotzdem aufnahm.
      Ohne Wirkung blieb das nicht: Die Währung wird nur hier gesetzt, und ohne
      sie fällt bei einem IFRS-Melder die Währungsprüfung aus.
    */
    for (const treffer of text.matchAll(
      /^\s*ticker: '([^']+)',\n\s*name: (?:'[^']*'|"[^"]*"),\n\s*kind: '([^']+)',\n\s*unit: '([^']+)',/gm
    )) {
      gefuehrt.add(treffer[1])
      if (treffer[2] === 'stock') waehrungJeKuerzel.set(treffer[1], treffer[3])
    }
    // Fallback fuer Eintraege, deren Felder in anderer Reihenfolge stehen.
    for (const treffer of text.matchAll(/^\s*ticker: '([^']+)',$/gm)) {
      gefuehrt.add(treffer[1])
    }
  }
  console.log(`\n${gefuehrt.size} Kürzel im Katalog der Website.`)

  // Nach Kürzel ablegen – die Website kennt Ticker, keine Kennnummern.
  const jeKuerzel: Record<string, Record<string, number>> = {}
  for (const [cik, eintrag] of werte) {
    const kuerzel = kuerzelJeCik.get(cik)
    if (!kuerzel) continue
    const sauber: Record<string, number> = {}
    for (const [feld, wert] of Object.entries(eintrag)) {
      if (typeof wert === 'number' && Number.isFinite(wert)) sauber[feld] = wert
    }
    if (Object.keys(sauber).length === 0) continue
    for (const k of kuerzel) if (gefuehrt.has(k)) jeKuerzel[k] = sauber
  }

  /*
    Zweite Runde: die IFRS-Melder.

    Gefragt wird nur nach Kuerzeln, die im Katalog stehen und aus der ersten
    Runde hoechstens eine Aktienzahl mitgebracht haben – die kommt aus `dei`
    und liegt auch bei IFRS-Meldern vor, sagt aber allein nichts.
  */
  const cikJeKuerzel = new Map<string, number>()
  for (const [cik, kuerzel] of kuerzelJeCik) {
    for (const k of kuerzel) if (gefuehrt.has(k)) cikJeKuerzel.set(k, cik)
  }

  /*
    Die Bruecke rueckwaerts: SEC-Kuerzel auf Katalogkuerzel.

    Gesucht wird bei der SEC unter `TM`, abgelegt wird das Ergebnis unter
    `7203.T` – dem Kuerzel, unter dem die Website Toyota kennt.
  
  */
  const katalogJeSecKuerzel = new Map<string, string>()
  for (const [katalog, sec] of Object.entries(KUERZELBRUECKE)) {
    const cik = [...kuerzelJeCik].find(([, liste]) => liste.includes(sec))?.[0]
    if (cik !== undefined) {
      cikJeKuerzel.set(sec, cik)
      katalogJeSecKuerzel.set(sec, katalog)
    }
  }

  /*
    Wer in die zweite Runde kommt.

    Zwei Faelle: keine Zahlen, oder Zahlen ohne Aktienzahl. Der zweite Fall
    stand lange unbemerkt in der Datei – 20 Unternehmen hatten Umsatz, Gewinn
    und Eigenkapital, aber keine Aktienzahl, darunter Meta, Alphabet, Visa und
    Mastercard. Auf der Website sah das aus wie „meldet nicht“, obwohl vier von
    fuenf Groessen dalagen: Alle Kennzahlen fuehren ueber den Wert je Aktie.

    Der Grund liegt in der Rahmenabfrage. Die Aktienzahl ist eine
    Bestandsgroesse und wird je Quartalsstichtag abgefragt; wer sein Deckblatt
    zu einem anderen Datum stellt, steht in keinem dieser Rahmen. Die
    Einzelabfrage kennt dieses Problem nicht.
  */
  const offen = [...cikJeKuerzel.keys()].filter((k) => {
    const eintrag = jeKuerzel[k]
    if (!eintrag) return true
    if (!eintrag.aktien) return true
    return !eintrag.umsatz && !eintrag.gewinn && !eintrag.eigenkapital
  })

  console.log(
    `\n${offen.length} gefuehrte Kuerzel ohne Zahlen aus der ersten Runde – einzeln nachfragen …`
  )

  /*
    Zweite Runde: ein Abruf je Unternehmen, beide Rechnungslegungen.

    Frueher waren das bis zu neun Abfragen je Unternehmen – eine je Bezeichner,
    und nur nach `ifrs-full`. `companyfacts` liefert dasselbe in einem einzigen
    Abruf, samt `dei` fuer die Aktienzahl und samt us-gaap. Das ist nicht nur
    schneller, es schliesst auch die Luecke: Wer nach US-Vorschriften bilanziert,
    aber nicht in Dollar meldet, fiel vorher durch beide Runden.
  */
  const nachwerte: Record<string, Record<string, number | string>> = {}
  let nachtreffer = 0

  for (const kuerzel of offen) {
    const cik = cikJeKuerzel.get(kuerzel)
    if (cik === undefined) continue
    const ziel = katalogJeSecKuerzel.get(kuerzel) ?? kuerzel

    const url = `${FAKTEN_BASIS}/CIK${String(cik).padStart(10, '0')}.json`
    const fakten = (await hole(url, true)) as Fakten | null
    // Zwischen den Abrufen kurz warten – die SEC bittet um Zurueckhaltung.
    await new Promise((fertig) => setTimeout(fertig, 130))
    if (!fakten) continue

    /*
      Die Aktienzahl steht in derselben Antwort – `companyfacts` liefert auch
      `dei`. Frueher war das ein eigener Abruf, und er lief ins Leere, wenn die
      erste Runde den Wert unter dem SEC-Kuerzel abgelegt hatte statt unter dem
      Katalogkuerzel. Toyota steht hier als `7203.T`, gemeldet wird unter `TM`.
    */
    const aktien = aktienzahlAusFakten(fakten, ziel)
    const bestand = jeKuerzel[kuerzel]

    /*
      Hat das Unternehmen schon Zahlen, fehlt also nur die Aktienzahl, wird
      genau die ergaenzt. Alles andere zu ueberschreiben waere ein Rueckschritt:
      Die Rahmenabfrage liefert Dollarwerte aus einem Jahresrahmen, und daran
      ist nichts auszusetzen.
    */
    if (bestand?.umsatz || bestand?.gewinn || bestand?.eigenkapital) {
      if (aktien) {
        nachwerte[ziel] = { ...bestand, aktien }
        nachtreffer += 1
        console.log(`  ${ziel.padEnd(12)} nur Aktienzahl ergaenzt: ${aktien}`)
      }
      continue
    }

    const kurswaehrung = waehrungJeKuerzel.get(ziel)
    const satz = bestenSatz(fakten, kurswaehrung)
    if (!satz || (!satz.werte.umsatz && !satz.werte.gewinn)) continue

    const gefunden: Record<string, number | string> = {
      ...satz.werte,
      waehrung: satz.waehrung,
    }
    if (aktien) gefunden.aktien = aktien

    nachwerte[ziel] = gefunden
    nachtreffer += 1
    console.log(
      `  ${ziel.padEnd(12)} ${satz.taxonomie.padEnd(9)} ${satz.waehrung}` +
        `${kurswaehrung && kurswaehrung !== satz.waehrung ? ` (Kurs in ${kurswaehrung})` : ''}` +
        `  ${Object.keys(satz.werte).length}/4 Groessen, Stand ${satz.ende}` +
        `${aktien ? '' : ', ohne Aktienzahl'}`
    )
  }

  console.log(`Einzelabfrage: ${nachtreffer} weitere Unternehmen mit Zahlen.`)

  const vollstaendig = Object.values(jeKuerzel).filter(
    (e) => e.umsatz && e.gewinn && e.aktien
  ).length
  console.log(
    `${Object.keys(jeKuerzel).length} geführte Kürzel mit Daten, davon ${vollstaendig} mit Umsatz, Gewinn und Aktienzahl.`
  )

  /*
    Untergrenze als Reißleine.

    Sie ist bewusst niedrig: Von rund 200 geführten Kürzeln sind über 20 Indizes,
    Rohstoffe und Währungspaare, weitere 300 Aktien notieren außerhalb der USA
    und tauchen hier nie auf. Was bleibt, sind etwa 130 vollständige Sätze. Fällt
    die Zahl deutlich darunter, hat sich an der Schnittstelle etwas geändert –
    dann soll der Lauf scheitern statt eine halbe Datei abzulegen.
  */
  if (vollstaendig < 100) {
    throw new Error(
      `Nur ${vollstaendig} vollständige Datensätze – das ist zu wenig, hier stimmt etwas nicht.`
    )
  }

  // Die nachgefragten Zahlen dazulegen. Sie ueberschreiben nichts: Gefragt
  // wurde nur nach Kuerzeln, zu denen aus der ersten Runde nichts kam.
  for (const [kuerzel, werte] of Object.entries(nachwerte)) {
    jeKuerzel[kuerzel] = werte as unknown as Record<string, number>
  }

  const inhalt = {
    abgerufenAm: new Date().toISOString(),
    quelle: {
      label: 'US-Börsenaufsicht SEC, XBRL-Pflichtmeldungen',
      url: 'https://www.sec.gov/edgar/sec-api-documentation',
      abgrenzung:
        'Umsatz, Nettogewinn und operativer Cashflow für das zuletzt gemeldete Geschäftsjahr; Eigenkapital und Aktienzahl zum jüngsten Stichtag. Erfasst sind Unternehmen, die bei der SEC melden – nach US-Vorschriften (us-gaap) oder nach internationalen (ifrs-full). IFRS-Melder berichten in ihrer eigenen Währung; sie steht dann am Datensatz.',
    },
    unternehmen: jeKuerzel,
  }

  await mkdir(dirname(ZIEL), { recursive: true })
  await writeFile(ZIEL, `${JSON.stringify(inhalt, null, 2)}\n`, 'utf8')
  console.log(`Geschrieben: ${ZIEL}`)
}

main().catch((fehler) => {
  console.error(fehler)
  process.exit(1)
})
