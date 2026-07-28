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
/** Einzelabfrage je Unternehmen – der einzige Weg zu den IFRS-Zahlen. */
const BEGRIFF_BASIS = 'https://data.sec.gov/api/xbrl/companyconcept'
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
 * Aufgenommen ist nur, wo beide Bedingungen erfuellt sind: Das Unternehmen
 * meldet bei der SEC, **und** es berichtet in derselben Waehrung, in der hier
 * sein Kurs notiert. Toyota berichtet in Yen und notiert hier in Yen – da
 * passt es. Shell berichtet in Dollar und notiert hier in britischen Pence –
 * da braeuchte es eine Umrechnung ueber zwei Waehrungen, und der Gewinn an
 * Genauigkeit stuende in keinem Verhaeltnis zum Risiko, sie falsch zu machen.
 */
const KUERZELBRUECKE: Record<string, string> = {
  '7203.T': 'TM', // Toyota – berichtet in Yen
  '6758.T': 'SONY', // Sony – berichtet in Yen
  '7267.T': 'HMC', // Honda – berichtet in Yen
  'SAN.MC': 'SAN', // Banco Santander – berichtet in Euro
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

/** Ein Eintrag aus `companyconcept`. */
interface Begriffsantwort {
  units?: Record<
    string,
    { start?: string; end: string; val: number; form?: string; fy?: number }[]
  >
}

/**
 * Der juengste Jahreswert einer Groesse, samt Waehrung.
 *
 * Genommen wird nur, was aus einem Jahresbericht stammt (`20-F`, `40-F`, `10-K`)
 * und – bei Zeitraumgroessen – einen Zeitraum von ungefaehr zwoelf Monaten
 * abdeckt. Ohne diese Pruefung stuenden Halbjahres- oder Quartalswerte unter
 * derselben Ueberschrift, und ein Umsatz waere ploetzlich halb so gross.
 */
function juengsterJahreswert(
  antwort: Begriffsantwort,
  zeitraum: boolean
): { wert: number; waehrung: string } | null {
  let bester: { wert: number; waehrung: string; ende: string } | null = null

  for (const [waehrung, eintraege] of Object.entries(antwort.units ?? {})) {
    for (const eintrag of eintraege) {
      if (!['20-F', '40-F', '10-K'].includes(eintrag.form ?? '')) continue
      if (typeof eintrag.val !== 'number' || !Number.isFinite(eintrag.val)) continue

      if (zeitraum) {
        if (!eintrag.start) continue
        const tage = (Date.parse(eintrag.end) - Date.parse(eintrag.start)) / 86_400_000
        if (!(tage > 300 && tage < 400)) continue
      }

      if (!bester || eintrag.end > bester.ende) {
        bester = { wert: eintrag.val, waehrung, ende: eintrag.end }
      }
    }
  }

  return bester ? { wert: bester.wert, waehrung: bester.waehrung } : null
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
    for (const treffer of text.matchAll(
      /^\s*ticker: '([^']+)',\n\s*name: '[^']*',\n\s*kind: '([^']+)',\n\s*unit: '([^']+)',/gm
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

  const offen = [...cikJeKuerzel.keys()].filter((k) => {
    const eintrag = jeKuerzel[k]
    if (!eintrag) return true
    // Nur die Aktienzahl heisst: aus us-gaap kam nichts.
    return !eintrag.umsatz && !eintrag.gewinn && !eintrag.eigenkapital
  })

  console.log(`\n${offen.length} gefuehrte Kuerzel ohne us-gaap-Daten – IFRS pruefen …`)

  const ifrsWerte: Record<string, Record<string, number | string>> = {}
  let ifrsTreffer = 0

  for (const kuerzel of offen) {
    const cik = cikJeKuerzel.get(kuerzel)
    if (cik === undefined) continue
    const gefunden: Record<string, number | string> = {}

    for (const groesse of IFRS_GROESSEN) {
      for (const tag of groesse.tags) {
        const url = `${BEGRIFF_BASIS}/CIK${String(cik).padStart(10, '0')}/ifrs-full/${tag}.json`
        const antwort = (await hole(url, true)) as Begriffsantwort | null
        // Zwischen den Abrufen kurz warten – die SEC bittet um Zurueckhaltung.
        await new Promise((fertig) => setTimeout(fertig, 120))
        if (!antwort) continue
        const wert = juengsterJahreswert(antwort, groesse.zeitraum)
        if (!wert) continue

        /*
          Alle Groessen eines Unternehmens muessen dieselbe Waehrung haben.

          Manche melden zusaetzlich in Dollar. Ein Umsatz in Euro neben einem
          Eigenkapital in Dollar ergaebe ein Kurs-Buchwert-Verhaeltnis, das um
          den Wechselkurs danebenliegt – und dem sieht man nichts an.
        */
        if (gefunden.waehrung && gefunden.waehrung !== wert.waehrung) break
        gefunden.waehrung = wert.waehrung
        gefunden[groesse.feld] = wert.wert
        break
      }
    }

    if (gefunden.umsatz || gefunden.gewinn) {
      const ziel = katalogJeSecKuerzel.get(kuerzel) ?? kuerzel

      /*
        Die Aktienzahl braucht einen eigenen Abruf.

        Sie steht in `dei`, nicht in `ifrs-full`, und die erste Runde hat sie
        nur fuer Kuerzel abgelegt, die im Katalog stehen. Toyota steht dort als
        `7203.T`, gemeldet wird sie aber unter `TM` – der Wert lag also nie am
        richtigen Platz. Ohne ihn rechnet keine einzige der fuenf Kennzahlen,
        denn alle fuehren ueber den Wert je Aktie.
      */
      let aktien = jeKuerzel[kuerzel]?.aktien
      if (!aktien) {
        const url = `${BEGRIFF_BASIS}/CIK${String(cik).padStart(10, '0')}/dei/EntityCommonStockSharesOutstanding.json`
        const antwort = (await hole(url, true)) as Begriffsantwort | null
        await new Promise((fertig) => setTimeout(fertig, 120))
        if (antwort) {
          /*
            Hier zaehlt der juengste Stichtag, nicht der juengste Jahresbericht.

            Die Aktienzahl steht auf dem Deckblatt jeder Meldung, auch der
            unterjaehrigen. `juengsterJahreswert` filtert auf Jahresberichte und
            faende deshalb oft gar nichts.
          */
          let bester: { wert: number; ende: string } | null = null
          for (const eintraege of Object.values(antwort.units ?? {})) {
            for (const eintrag of eintraege) {
              if (typeof eintrag.val !== 'number' || !Number.isFinite(eintrag.val))
                continue
              if (!bester || eintrag.end > bester.ende) {
                bester = { wert: eintrag.val, ende: eintrag.end }
              }
            }
          }

          /*
            Eine veraltete Aktienzahl ist schlimmer als keine.

            Sony und Honda haben 2024 ihre Aktien gesplittet. Die juengste
            Angabe der SEC stammte bei beiden von davor – gerechnet ergab das
            ein Kurs-Gewinn-Verhaeltnis von 3,9 beziehungsweise 3,0, also den
            drei- bis fuenffachen Fehler, und der sah aus wie eine Tatsache.

            Ein Split aendert die Aktienzahl schlagartig, den Kurs im selben
            Verhaeltnis und den Boersenwert gar nicht. Wer beide aus
            verschiedenen Zeiten kombiniert, bekommt genau diesen Faktor als
            Fehler. Deshalb: nur, was nicht aelter als 15 Monate ist.
          */
          const grenze = Date.now() - 450 * 86_400_000
          if (bester && Date.parse(bester.ende) >= grenze) {
            aktien = bester.wert
          } else if (bester) {
            console.log(
              `  ${ziel}: Aktienzahl vom ${bester.ende} ist zu alt – ausgelassen.`
            )
          }
        }
      }
      if (aktien) gefunden.aktien = aktien

      /*
        Nur ablegen, wenn Melde- und Kurswaehrung uebereinstimmen.

        Ein Umsatz in Euro neben einem Kurs in Dollar ergaebe ein
        Kurs-Umsatz-Verhaeltnis, das um den Wechselkurs danebenliegt – und
        dem sieht man nichts an. Wo es auseinandergeht, bleibt es bei „keine
        Angabe“; das ist die ehrlichere Luecke.
      */
      const kurswaehrung = waehrungJeKuerzel.get(ziel)
      if (kurswaehrung && kurswaehrung === gefunden.waehrung) {
        ifrsWerte[ziel] = gefunden
        ifrsTreffer += 1
      } else {
        console.log(
          `  ${ziel}: meldet in ${gefunden.waehrung}, notiert in ${kurswaehrung ?? 'unbekannt'} – ausgelassen.`
        )
      }
    }
  }

  console.log(`IFRS: ${ifrsTreffer} weitere Unternehmen mit Zahlen.`)

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

  // IFRS-Zahlen dazulegen. Sie ueberschreiben nichts: Abgefragt wurden nur
  // Kuerzel, zu denen aus der ersten Runde nichts Brauchbares kam.
  for (const [kuerzel, werte] of Object.entries(ifrsWerte)) {
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
