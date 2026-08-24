/**
 * Vierte Runde: zwei offene Fragen, zwei Abrufe.
 *
 * ## Was die dritte Runde beantwortet hat
 *
 * Von fünf offenen Türen sind drei zugefallen – und zwar mit einer klaren
 * Auskunft, nicht mit einem Schweigen:
 *
 * - **ASX Australien** – `key-statistics` antwortet mit 200 und drei künftigen
 *   Datumsangaben. Beim Hinsehen sind es `dateExDate`, `datePayDate` und
 *   `dateRecordDate`: **Dividendentermine, kein Meldetermin.** Genau der Fall,
 *   vor dem die dritte Frage der zweiten Runde warnt – ein Kalender voller
 *   Kapitalmaßnahmen sieht aus wie ein Fund.
 * - **TWSE Taiwan** – das Verzeichnis führt **143 Datensätze**, und keiner ist
 *   ein Terminkalender. Der nächste, `t187ap04_L`, ist der tägliche Strom der
 *   Pflichtmitteilungen – dieselbe Bauart wie der indische Feed. Der
 *   Ankündigungskalender `TWT48U_ALL` nennt Dividendenstichtage.
 * - **KIND Südkorea** – 90 KB, aber **2 Tabellenzeilen, 3 Formulare und null
 *   Börsenkürzel**. Das ist eine Suchmaske, keine Liste. Die Zählung allein
 *   hätte das nicht gezeigt; erst der Blick hinein.
 *
 * Zwei Türen stehen noch offen, und beide lassen sich mit **einem** Abruf
 * schließen oder öffnen:
 *
 * 1. **SIX Schweiz** – `select=*` antwortet mit **200** und liefert
 *    `colNames`: das vollständige Feldverzeichnis der Abfrage. In der dritten
 *    Runde wurden davon nur die ersten sechshundert Zeichen aufgehoben – die
 *    Liste bricht mitten in den Namen ab, die mit „A" beginnen. Diesmal wird
 *    sie **ganz** gelesen und nach allem durchsucht, was ein Datum oder ein
 *    Ereignis sein könnte.
 * 2. **TMX Kanada** – alle drei Abfragen der dritten Runde kamen mit 400
 *    zurück, auch die Introspektion. Nur: Der **Text** der Absage wurde nicht
 *    aufgehoben, sondern nur nach Feldnamen durchsucht. Dabei ist gerade er
 *    die Auskunft – GraphQL schreibt in eine Absage, welches Feld es nicht
 *    gibt, und schlägt oft den richtigen Namen vor.
 *
 * ## Die Lehre, die zweimal in einer Runde zugeschlagen hat
 *
 * Beide offenen Fragen sind offen, weil die Sonde **die Antwort weggeworfen
 * hat, bevor jemand sie lesen konnte** – einmal durch einen Ausschnitt von 600
 * Zeichen, einmal durch einen Filter, der nur nach Feldnamen suchte. AGENTS.md
 * kennt den Satz dazu:
 *
 * > Der teuerste Fehler ist nicht der rote Lauf, sondern der stille.
 *
 * Hier wird deshalb bei beiden der **ganze** Text aufgehoben.
 *
 * Aufruf über `.github/workflows/quellen-probe.yml`, Sonde `boersen4`.
 */

import { writeFile } from 'node:fs/promises'

const BERICHT = 'boersen4-kalender.json'

const KOPFZEILEN = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/126.0 Safari/537.36',
  'Accept-Language': 'en,de;q=0.8',
  Accept: 'application/json, text/plain, */*',
}

/**
 * Feldnamen, die ein Datum oder ein Ereignis bezeichnen könnten.
 *
 * Bewusst weit gefasst: Es geht darum, aus mehreren hundert Namen die
 * Handvoll herauszuholen, die einen zweiten Blick verdienen – nicht darum,
 * schon zu entscheiden.
 */
const TERMINVERDACHT = /date|event|report|earning|result|calendar|termin|announc|publi/i

const bericht: Record<string, unknown> = { geprueft: new Date().toISOString() }

function warten() {
  return new Promise((f) => setTimeout(f, 1500))
}

async function hole(
  url: string,
  koerper?: string
): Promise<{ status: number; text: string }> {
  const antwort = await fetch(url, {
    method: koerper ? 'POST' : 'GET',
    headers: koerper ? { ...KOPFZEILEN, 'Content-Type': 'application/json' } : KOPFZEILEN,
    body: koerper,
    signal: AbortSignal.timeout(30_000),
    redirect: 'follow',
  })
  return { status: antwort.status, text: await antwort.text() }
}

/* ==================================================================== SIX */

/**
 * Schweiz, 27 Titel.
 *
 * Die Abfrage nennt ihre Felder selbst, sobald man `select=*` schickt. Die
 * Antwort trägt sie in `colNames`. Mehr als lesen ist hier nicht zu tun – und
 * genau das ist beim letzten Mal unterblieben.
 */
async function six() {
  console.log(`\n${'='.repeat(78)}`)
  console.log('SIX Schweiz (27 Titel) – das vollständige Feldverzeichnis')
  console.log('='.repeat(78))

  const url = 'https://www.six-group.com/fqs/ref.json?select=*&where=ValorSymbol=NESN'
  try {
    const { status, text } = await hole(url)
    console.log(`  STATUS ${status}, ${text.length} Zeichen`)

    const daten = JSON.parse(text) as { colNames?: string[]; rowData?: unknown[][] }
    const felder = daten.colNames ?? []
    console.log(`  ${felder.length} Felder.`)

    const verdaechtig = felder.filter((f) => TERMINVERDACHT.test(f))
    console.log(`\n  ${verdaechtig.length} davon könnten ein Datum oder Ereignis sein:`)
    for (const f of verdaechtig) {
      const stelle = felder.indexOf(f)
      const wert = daten.rowData?.[0]?.[stelle]
      console.log(`    ${f.padEnd(38)} ${JSON.stringify(wert)?.slice(0, 40) ?? '–'}`)
    }

    bericht.six = { status, anzahl: felder.length, felder, verdaechtig }
  } catch (fehler) {
    console.log(`  FEHLER ${(fehler as Error).message}`)
    bericht.six = { fehler: String(fehler) }
  }
  await warten()
}

/* ==================================================================== TMX */

/**
 * Kanada, 33 Titel.
 *
 * Drei Absagen, und der Text jeder einzelnen ist die eigentliche Auskunft.
 * GraphQL sagt bei einem unbekannten Feld, dass es das nicht gibt, und nennt
 * bei einem Tippfehler den nächstliegenden Namen. Eine abgeschaltete
 * Introspektion sagt das ebenfalls ausdrücklich.
 */
async function tmx() {
  console.log(`\n${'='.repeat(78)}`)
  console.log('TMX Kanada (33 Titel) – was steht wirklich in der Absage?')
  console.log('='.repeat(78))

  const versuche: { name: string; abfrage: string }[] = [
    {
      name: 'Introspektion',
      abfrage: '{ __schema { queryType { fields { name } } } }',
    },
    {
      name: 'ein erfundenes Feld – was schlägt die Absage vor?',
      abfrage:
        'query q($symbol: String, $locale: String) { getQuoteBySymbol(symbol: $symbol, locale: $locale) ' +
        '{ symbol nextEarningsDate } }',
    },
    {
      name: 'die Abfrage, die in Runde zwei funktioniert hat – zur Gegenprobe',
      abfrage:
        'query q($symbol: String, $locale: String) { getQuoteBySymbol(symbol: $symbol, locale: $locale) ' +
        '{ symbol name price } }',
    },
  ]

  const ergebnisse: unknown[] = []
  for (const versuch of versuche) {
    const koerper = JSON.stringify({
      query: versuch.abfrage,
      variables: { symbol: 'RY', locale: 'en' },
    })
    try {
      const { status, text } = await hole('https://app-money.tmx.com/graphql', koerper)
      console.log(`\n  ${versuch.name}`)
      console.log(`    STATUS ${status}, ${text.length} Zeichen`)
      console.log(`    ${text.slice(0, 1200).replace(/\s+/g, ' ')}`)
      ergebnisse.push({ versuch: versuch.name, status, antwort: text.slice(0, 4000) })
    } catch (fehler) {
      console.log(`    FEHLER ${(fehler as Error).message}`)
      ergebnisse.push({ versuch: versuch.name, fehler: String(fehler) })
    }
    await warten()
  }

  /*
    Die dritte Abfrage ist die Gegenprobe. Kommt auch sie mit 400 zurück,
    liegt es nicht am Feldnamen, sondern daran, dass die Schnittstelle diese
    Art von Anfrage inzwischen ablehnt – und dann sagt keine der drei Absagen
    etwas über Meldetermine.
  */
  bericht.tmx = ergebnisse
}

/* =================================================================== main */

async function main() {
  await six()
  await tmx()

  await writeFile(BERICHT, JSON.stringify(bericht, null, 2))
  console.log(`\nVollständig in ${BERICHT}.`)
}

await main()
