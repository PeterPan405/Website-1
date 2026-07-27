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
 * ## Warum das nur die halbe Miete ist
 *
 * Die SEC kennt ausschließlich Unternehmen, die in den USA bilanzieren. Für
 * SAP, Nestlé, Toyota oder Samsung gibt es keine vergleichbare offene Quelle:
 * Jedes Land hat seine eigene Aufsicht mit eigenem Format, und die
 * kommerziellen Anbieter verlangen einen Schlüssel.
 *
 * Für diese Werte bleibt es deshalb bei „keine Angabe“. Das ist unbefriedigend,
 * aber es ist die Wahrheit – ein geschätztes Kurs-Gewinn-Verhältnis wäre
 * schlimmer als gar keins, weil es aussähe wie eine Tatsache.
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
const ZIEL = 'data/snapshots/fundamentaldaten.json'

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
    tags: ['RevenueFromContractWithCustomerExcludingAssessedTax', 'Revenues'],
    /** Fließgrößen werden über vier Quartale summiert, Bestände nicht. */
    fliessgroesse: true,
  },
  {
    feld: 'gewinn' as const,
    einheit: 'USD',
    tags: ['NetIncomeLoss'],
    fliessgroesse: true,
  },
  {
    feld: 'cashflow' as const,
    einheit: 'USD',
    tags: [
      'NetCashProvidedByUsedInOperatingActivities',
      'NetCashProvidedByUsedInOperatingActivitiesContinuingOperations',
    ],
    fliessgroesse: true,
  },
  {
    feld: 'eigenkapital' as const,
    einheit: 'USD',
    tags: ['StockholdersEquity'],
    fliessgroesse: false,
  },
  {
    feld: 'aktien' as const,
    einheit: 'shares',
    tags: ['CommonStockSharesOutstanding', 'CommonStockSharesIssued'],
    fliessgroesse: false,
  },
]

type Feld = (typeof GROESSEN)[number]['feld']

interface Rahmenantwort {
  data?: { cik: number; entityName?: string; val?: number }[]
}

async function hole(url: string): Promise<unknown | null> {
  try {
    const antwort = await fetch(url, { headers: KOPFZEILEN })
    if (!antwort.ok) {
      console.log(`  ${antwort.status} bei ${url.replace(RAHMEN_BASIS, '…')}`)
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

/** Jahre, absteigend – für Bestandsgrößen und als Rückfall. */
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
      Fließgrößen über vier Quartale summieren.

      Ein Quartalsumsatz gegen einen Jahreskurs gerechnet ergäbe ein
      Kurs-Umsatz-Verhältnis, das um den Faktor vier danebenliegt. Bestände –
      Eigenkapital, Aktienzahl – gelten dagegen zum Stichtag und werden nicht
      summiert; dort zählt der jüngste Wert.
    */
    const zeitraeume = groesse.fliessgroesse ? quartale(5) : [...jahre(2), ...quartale(3)]
    const gesammelt = new Map<number, number[]>()
    let quelleGefunden = ''

    for (const tag of groesse.tags) {
      for (const zeitraum of zeitraeume) {
        // Bei Fließgrößen bis zu vier Quartale sammeln, sonst reicht eines.
        if (!groesse.fliessgroesse && gesammelt.size > 0) break
        const url = `${RAHMEN_BASIS}/us-gaap/${tag}/${groesse.einheit}/${zeitraum}.json`
        const antwort = (await hole(url)) as Rahmenantwort | null
        if (!antwort?.data) continue
        quelleGefunden = tag
        for (const eintrag of antwort.data) {
          if (typeof eintrag.val !== 'number' || !Number.isFinite(eintrag.val)) continue
          const bisher = gesammelt.get(eintrag.cik) ?? []
          if (groesse.fliessgroesse ? bisher.length < 4 : bisher.length < 1) {
            bisher.push(eintrag.val)
            gesammelt.set(eintrag.cik, bisher)
          }
        }
        // Zwischen den Abrufen kurz warten – die SEC bittet um Zurückhaltung.
        await new Promise((fertig) => setTimeout(fertig, 250))
      }
      if (gesammelt.size > 0) break
    }

    let uebernommen = 0
    for (const [cik, liste] of gesammelt) {
      // Fließgrößen nur, wenn wirklich vier Quartale zusammenkamen – aus zwei
      // Quartalen einen Jahreswert hochzurechnen wäre eine Schätzung.
      if (groesse.fliessgroesse && liste.length < 4) continue
      const wert = groesse.fliessgroesse
        ? liste.reduce((summe, zahl) => summe + zahl, 0)
        : liste[0]
      const eintrag = werte.get(cik) ?? {}
      eintrag[groesse.feld] = wert
      werte.set(cik, eintrag)
      uebernommen += 1
    }
    console.log(
      `  ${uebernommen} Unternehmen (Bezeichner: ${quelleGefunden || 'keiner'})`
    )
  }

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
    for (const k of kuerzel) jeKuerzel[k] = sauber
  }

  const vollstaendig = Object.values(jeKuerzel).filter(
    (e) => e.umsatz && e.gewinn && e.aktien
  ).length
  console.log(
    `\n${Object.keys(jeKuerzel).length} Kürzel mit Daten, davon ${vollstaendig} mit Umsatz, Gewinn und Aktienzahl.`
  )

  if (vollstaendig < 200) {
    throw new Error(
      `Nur ${vollstaendig} vollständige Datensätze – das ist zu wenig, hier stimmt etwas nicht.`
    )
  }

  const inhalt = {
    abgerufenAm: new Date().toISOString(),
    quelle: {
      label: 'US-Börsenaufsicht SEC, XBRL-Pflichtmeldungen',
      url: 'https://www.sec.gov/edgar/sec-api-documentation',
      abgrenzung:
        'Umsatz, Nettogewinn und operativer Cashflow als Summe der letzten vier gemeldeten Quartale; Eigenkapital und Aktienzahl zum jüngsten Stichtag. Nur Unternehmen, die in den USA bilanzieren.',
    },
    unternehmen: jeKuerzel,
  }

  const { writeFile, mkdir } = await import('node:fs/promises')
  const { dirname } = await import('node:path')
  await mkdir(dirname(ZIEL), { recursive: true })
  await writeFile(ZIEL, `${JSON.stringify(inhalt, null, 2)}\n`, 'utf8')
  console.log(`Geschrieben: ${ZIEL}`)
}

main().catch((fehler) => {
  console.error(fehler)
  process.exit(1)
})

/*
  Macht die Datei zu einem Modul.

  Ohne `import` oder `export` behandelt TypeScript eine Datei als globales
  Skript – und dann kollidieren `KOPFZEILEN`, `ZIEL` und `main` mit denselben
  Namen in `scripts/laender-abrufen.ts`. Eine leere Ausfuhr genügt, um den
  Gültigkeitsbereich auf diese Datei zu begrenzen.
*/
export {}
