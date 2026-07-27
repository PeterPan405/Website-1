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
const ZIEL = 'data/snapshots/fundamentaldaten.json'

/** Die Dateien, aus denen hervorgeht, welche Kürzel die Website überhaupt führt. */
const KATALOG = ['data/markets.ts', 'data/markets-aktien.ts']

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

  const inhalt = {
    abgerufenAm: new Date().toISOString(),
    quelle: {
      label: 'US-Börsenaufsicht SEC, XBRL-Pflichtmeldungen',
      url: 'https://www.sec.gov/edgar/sec-api-documentation',
      abgrenzung:
        'Umsatz, Nettogewinn und operativer Cashflow für das zuletzt gemeldete Geschäftsjahr; Eigenkapital und Aktienzahl zum jüngsten Stichtag. Nur Unternehmen, die nach US-Vorschriften bilanzieren.',
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
