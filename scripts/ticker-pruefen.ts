import { marketSources } from '../data/markets.ts'

/**
 * Klopft jedes Yahoo-Kürzel des Katalogs an der Chart-Schnittstelle ab.
 *
 * ## Warum es diese Prüfung gibt
 *
 * Am 1. August 2026 stellte sich per Zufallsbefund heraus, dass sechs Titel
 * seit Wochen bis Monaten keine Kurse mehr bekamen: Fiserv, BNY Mellon,
 * Marsh & McLennan, Kerry Group, Tata Motors und JBS hatten ihre Kürzel
 * gewechselt – Umbenennung, Börsenwechsel, Abspaltung. Der Kursabruf warnt
 * zwar bei jedem 404, aber eine Warnung in Lauf 30 von 30 am Tag liest
 * niemand. Die Titel standen still unter „erster Abruf steht aus“.
 *
 * Dieser Lauf stellt die Frage einmal im Monat systematisch: Antwortet jedes
 * Kürzel noch? Ein totes Kürzel ist fast immer eine Unternehmensnachricht
 * (neues Kürzel, neue Börse, Übernahme, Abspaltung) – die Abhilfe steht in
 * `data/aktien-liste.txt`, und wie der Austausch geht, zeigt der Commit
 * „Sechs Aktien wieder mit Kursquelle“.
 *
 * ## Was als tot gilt – und was nicht
 *
 * Nur 404 und 410: „dieses Kürzel gibt es nicht.“ Ratengrenzen (429),
 * Serverfehler und Zeitüberschreitungen sind Aussagen über den Moment, nicht
 * über das Kürzel, und zählen als unklar, ohne den Lauf rot zu machen.
 *
 * Der Takt ist derselbe wie im Kursabruf (`ABSTAND_MS` dort): gemessen am
 * 1. August 2026 verträgt die Schnittstelle 80 ms ohne ein einziges 429.
 *
 * Läuft auf einem GitHub-Läufer (`ticker-pruefen.yml`) – die
 * Entwicklungsumgebung erreicht nur GitHub. Mit `--nur-zaehlen` lässt sich
 * die Sammellogik ohne Netz prüfen.
 */

const NUR_ZAEHLEN = process.argv.includes('--nur-zaehlen')

const ABSTAND_MS = 80
const BASIS = 'https://query1.finance.yahoo.com/v8/finance/chart/'

/** Yahoo-Kürzel → Katalogsymbole, die daran hängen (meist genau eines). */
function sammleKuerzel(): Map<string, string[]> {
  const kuerzel = new Map<string, string[]>()
  for (const [symbol, quelle] of Object.entries(marketSources)) {
    if (!('yahoo' in quelle) || typeof quelle.yahoo !== 'string') continue
    const liste = kuerzel.get(quelle.yahoo) ?? []
    liste.push(symbol)
    kuerzel.set(quelle.yahoo, liste)
  }
  return kuerzel
}

async function status(ticker: string): Promise<number | 'stumm'> {
  try {
    const antwort = await fetch(`${BASIS}${encodeURIComponent(ticker)}?range=1d`, {
      signal: AbortSignal.timeout(20000),
    })
    return antwort.status
  } catch {
    return 'stumm'
  }
}

const kuerzel = sammleKuerzel()
console.log(`${kuerzel.size} Yahoo-Kürzel im Katalog.`)

if (NUR_ZAEHLEN) {
  const mehrfach = [...kuerzel.entries()].filter(([, symbole]) => symbole.length > 1)
  console.log(`${mehrfach.length} Kürzel mit mehr als einem Katalogsymbol.`)
  for (const [ticker, symbole] of mehrfach) {
    console.log(`  ${ticker}: ${symbole.join(', ')}`)
  }
  process.exit(0)
}

let tot = 0
let unklar = 0

for (const [ticker, symbole] of kuerzel) {
  const ergebnis = await status(ticker)
  if (ergebnis === 404 || ergebnis === 410) {
    tot++
    console.error(`TOT  ${ergebnis}  ${ticker}  (${symbole.join(', ')})`)
  } else if (ergebnis === 'stumm' || ergebnis >= 400) {
    unklar++
    console.log(`?    ${ergebnis}  ${ticker}`)
  }
  await new Promise((fertig) => setTimeout(fertig, ABSTAND_MS))
}

console.log(
  `\n${kuerzel.size - tot - unklar} Kürzel in Ordnung, ${unklar} unklar, ${tot} tot.`
)

if (tot > 0) {
  console.error(
    '\nEin totes Kürzel ist fast immer eine Unternehmensnachricht: Umbenennung,\n' +
      'Börsenwechsel, Übernahme oder Abspaltung. Das neue Kürzel recherchieren,\n' +
      'am Läufer gegenprüfen und in data/aktien-liste.txt eintragen; danach\n' +
      '`npm run aktien`. Vorbild: Commit „Sechs Aktien wieder mit Kursquelle“.'
  )
  process.exit(1)
}
