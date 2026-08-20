/**
 * Angekündigte Meldetermine aus dem Sammelkalender von Alpha Vantage.
 *
 * ## Warum es diesen Weg gibt
 *
 * Der Betreiber hat am 20. August 2026 widersprochen: „das kann ja nicht sein,
 * diese Daten sind für jeden zugänglich." Er hatte recht, und die Prüfung, die
 * daraufhin lief, hat eine Quelle gefunden, die keine der bisher geprüften war.
 *
 * `EARNINGS_CALENDAR` gibt **einen** CSV mit allen angekündigten Terminen der
 * nächsten drei Monate zurück – nicht je Unternehmen einen Abruf, sondern
 * einen für alle. Gemessen am 20. August 2026: 1.706 Zeilen, 95 KB, Spalten
 *
 *     symbol,name,reportDate,fiscalDateEnding,estimate,currency,timeOfTheDay
 *
 * ## Was daran besser ist als die eigene Hochrechnung
 *
 * Zwei Dinge, und beide sind wesentlich:
 *
 * 1. **Es sind angekündigte Termine, keine geschätzten.** Bisher rechnet diese
 *    Website den nächsten Meldetag aus dem Muster der Vorjahre hoch und weist
 *    ihn als `geschaetzt` aus. Hier steht der Tag, den das Unternehmen selbst
 *    genannt hat.
 * 2. **`timeOfTheDay` ist `pre-market` oder `post-market`** – dieselbe Aussage,
 *    die bisher mühsam aus dem Annahmezeitstempel der SEC abgeleitet wurde,
 *    nur direkt von der Quelle.
 *
 * ## Was es nicht abdeckt
 *
 * Gemessen, nicht vermutet. Von 41 europäischen und asiatischen Standardwerten
 * standen **drei** im Kalender: Novartis, Banco Santander und TotalEnergies –
 * jeweils unter ihrem US-Kürzel. Siemens, Allianz, Bayer, BASF, LVMH, Nestlé,
 * Roche, AstraZeneca, Unilever, Toyota, Sony, Samsung: nicht enthalten.
 *
 * Der Kalender führt also, was in New York notiert – einschließlich der
 * Hinterlegungsscheine ausländischer Unternehmen. Genau das ist die Lücke, die
 * die SEC-Quelle nicht schließen kann: Ein ausländischer Emittent reicht kein
 * `8-K` mit Punkt 2.02 ein, taucht hier aber trotzdem auf. **Alibaba**, der
 * Anlass der ganzen Sache, steht mit `2026-08-20, pre-market` darin.
 *
 * Für Unternehmen, die nur an ihrer Heimatbörse notieren, bleibt die Lücke.
 *
 * ## Warum ein eigener Fehler für die Tarifsperre
 *
 * Dieselbe Lehre wie bei Twelve Data, wo ein zweiter Weg drei Wochen lang jede
 * Nacht 75 Minuten lief und nie etwas lieferte, weil der Endpunkt im
 * kostenlosen Tarif gesperrt war – und der Lauf dabei grün blieb.
 *
 * Geprüft wurde hier mit dem öffentlichen Demo-Schlüssel. **Das beweist nicht,
 * dass ein echter kostenloser Schlüssel dieselbe Antwort bekommt** – genau
 * diese Verwechslung hat beim vorigen Anbieter drei Wochen gekostet. Deshalb
 * erkennt dieses Modul eine Tarif- oder Kontingentabsage am Text und wirft;
 * der Aufrufer bricht dann ab und sagt es laut, statt es zu protokollieren.
 */

export const ALPHAVANTAGE_BASIS = 'https://www.alphavantage.co/query'

/** Ein angekündigter Meldetermin. */
export interface Kalendereintrag {
  /** Das Kürzel, wie der Anbieter es führt – ein US-Kürzel. */
  symbol: string
  /** Der Name, wie der Anbieter ihn führt. */
  name: string
  /** Der angekündigte Meldetag, `JJJJ-MM-TT`. */
  reportDate: string
  /** Ende des Berichtszeitraums, `JJJJ-MM-TT`. */
  fiscalDateEnding: string
  /** `pre-market`, `post-market` – oder leer, wenn der Anbieter nichts sagt. */
  lage: 'vorboerse' | 'nachboerse' | null
}

/** Wird geworfen, wenn der Anbieter den Endpunkt nicht herausgibt. */
export class AlphaVantageGesperrt extends Error {}

/**
 * Ob eine Antwort eine Absage statt Daten ist.
 *
 * Alpha Vantage antwortet auf eine gesperrte oder erschöpfte Anfrage mit
 * **Statuscode 200** und einem JSON-Objekt – nicht mit 403 und nicht mit CSV.
 * Wer nur den HTTP-Code prüft, hält die Absage für ein Ergebnis und schreibt
 * eine leere Liste in den Bestand. Dieselbe Falle wie bei Twelve Data, nur an
 * anderer Stelle: Dort war es `{"status":"error"}` bei 200.
 */
export function istAbsage(text: string): boolean {
  const anfang = text.trimStart().slice(0, 1)
  if (anfang !== '{' && anfang !== '[') return false
  return /rate limit|premium|higher API call|Information|Note|Error Message/i.test(text)
}

/**
 * Die Spaltenwerte einer CSV-Zeile.
 *
 * Eigener Zerleger statt `split(',')`: Firmennamen enthalten Kommas
 * („BRASKEM SOCIEDAD ANÓNIMA, S.A."), und der Anbieter setzt sie dann in
 * Anführungszeichen. Ein blankes `split` verschöbe ab dieser Zeile jede Spalte
 * um eins – der Meldetag stünde in der Namensspalte, und auffallen würde es
 * niemandem, weil ein Datum an falscher Stelle immer noch wie ein Datum
 * aussieht.
 */
export function csvFelder(zeile: string): string[] {
  const felder: string[] = []
  let feld = ''
  let inAnfuehrung = false

  for (let i = 0; i < zeile.length; i++) {
    const zeichen = zeile[i]
    if (zeichen === '"') {
      // Zwei Anführungszeichen hintereinander sind ein echtes Anführungszeichen.
      if (inAnfuehrung && zeile[i + 1] === '"') {
        feld += '"'
        i++
      } else {
        inAnfuehrung = !inAnfuehrung
      }
      continue
    }
    if (zeichen === ',' && !inAnfuehrung) {
      felder.push(feld.trim())
      feld = ''
      continue
    }
    feld += zeichen
  }
  felder.push(feld.trim())
  return felder
}

function lageAus(wert: string): 'vorboerse' | 'nachboerse' | null {
  const gesäubert = wert.trim().toLowerCase()
  if (gesäubert === 'pre-market') return 'vorboerse'
  if (gesäubert === 'post-market') return 'nachboerse'
  return null
}

/**
 * Liest den Sammelkalender aus einer CSV-Antwort.
 *
 * Die Spalten werden über die **Kopfzeile** gefunden und nicht über feste
 * Positionen. Ein Anbieter, der eine Spalte einschiebt, verschöbe sonst alles
 * dahinter – und ein verschobenes Datum sieht aus wie ein Datum.
 *
 * @returns Die Einträge, oder `null`, wenn die Antwort kein Kalender ist.
 */
export function parseKalender(text: string): Kalendereintrag[] | null {
  const zeilen = text.trim().split(/\r?\n/)
  if (zeilen.length < 2) return null

  const kopf = csvFelder(zeilen[0]).map((feld) => feld.toLowerCase())
  const spalte = (name: string) => kopf.indexOf(name.toLowerCase())

  const iSymbol = spalte('symbol')
  const iName = spalte('name')
  const iDatum = spalte('reportDate')
  const iEnde = spalte('fiscalDateEnding')
  const iLage = spalte('timeOfTheDay')

  if (iSymbol === -1 || iDatum === -1) return null

  const ergebnis: Kalendereintrag[] = []
  for (const zeile of zeilen.slice(1)) {
    if (!zeile.trim()) continue
    const felder = csvFelder(zeile)
    const datum = (felder[iDatum] ?? '').slice(0, 10)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) continue

    const symbol = felder[iSymbol] ?? ''
    if (!symbol) continue

    ergebnis.push({
      symbol,
      name: iName === -1 ? '' : (felder[iName] ?? ''),
      reportDate: datum,
      fiscalDateEnding: iEnde === -1 ? '' : (felder[iEnde] ?? '').slice(0, 10),
      lage: iLage === -1 ? null : lageAus(felder[iLage] ?? ''),
    })
  }

  return ergebnis.length > 0 ? ergebnis : null
}

/** Baut die Abrufadresse. Der Schlüssel steht darin – nie protokollieren. */
export function kalenderUrl(apiKey: string, horizont = '3month'): string {
  const params = new URLSearchParams({
    function: 'EARNINGS_CALENDAR',
    horizon: horizont,
    apikey: apiKey,
  })
  return `${ALPHAVANTAGE_BASIS}?${params.toString()}`
}

/** Kürzt eine unerwartete Antwort für das Protokoll. */
function kurzfassung(text: string, hoechstlaenge = 240): string {
  const einzeilig = text.replace(/\s+/g, ' ').trim()
  return einzeilig.length > hoechstlaenge
    ? `${einzeilig.slice(0, hoechstlaenge)} … (${einzeilig.length} Zeichen)`
    : einzeilig
}

/**
 * Holt den Sammelkalender.
 *
 * @param apiKey Der Schlüssel aus der Umgebung. Fehlt er, wird nichts
 *   abgerufen – der Normalfall, solange keiner hinterlegt ist.
 * @throws AlphaVantageGesperrt, wenn der Anbieter statt Daten eine Absage
 *   schickt. Weiterzumachen wäre sinnlos: Es ist ein Abruf für alles, und der
 *   zweite bekäme dieselbe Antwort wie der erste.
 */
export async function holeKalender(
  apiKey: string | undefined,
  horizont = '3month'
): Promise<Kalendereintrag[] | null> {
  if (!apiKey) return null

  const antwort = await fetch(kalenderUrl(apiKey, horizont), {
    signal: AbortSignal.timeout(60_000),
    headers: { Accept: 'text/csv,application/json' },
  })

  const text = await antwort.text()

  if (istAbsage(text)) {
    throw new AlphaVantageGesperrt(kurzfassung(text))
  }

  if (!antwort.ok) {
    // Der Schlüssel steht in der Adresse – deshalb wird sie nicht ausgegeben.
    // Das Protokoll eines Workflows ist öffentlich lesbar.
    throw new AlphaVantageGesperrt(`${antwort.status} – ${kurzfassung(text)}`)
  }

  return parseKalender(text)
}
