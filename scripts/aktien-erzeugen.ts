/**
 * Erzeugt die Aktien-Einträge für `data/markets-aktien.ts` aus einer knappen
 * Tabelle.
 *
 * ## Warum ein Generator und keine Handarbeit
 *
 * Ein Eintrag in `data/markets.ts` ist neunzehn Zeilen lang, von denen sich
 * fünfzehn aus vier Angaben ergeben. Vierhundert davon von Hand zu schreiben
 * hieße, achttausend Zeilen zu tippen, in denen sich nur an wenigen Stellen
 * etwas ändert – und jede dieser Stellen wäre eine Gelegenheit für einen
 * Zahlendreher, der niemandem auffällt.
 *
 * Die Quelle ist deshalb `data/aktien-liste.txt`: eine Zeile je Unternehmen,
 * mit senkrechtem Strich getrennt. Was sich daraus ableiten lässt, leitet
 * dieses Skript ab – einschließlich der Einträge in `marketSources` und in der
 * Länderzuordnung, die sonst gern vergessen werden.
 *
 * ## Spalten
 *
 * `symbol | ticker | Name | Länderkennung | Währung | Branche | Geschäftsmodell`
 *
 * - **symbol** – Kleinbuchstaben und Bindestriche, wird zur URL.
 * - **ticker** – so, wie ihn Yahoo Finance führt, inklusive Börsenkürzel
 *   (`.DE`, `.PA`, `.L`, `.T`, …). Bei US-Werten ohne Zusatz.
 * - **Länderkennung** – ISO 3166-1 numerisch, dieselbe wie auf dem Globus.
 * - **Geschäftsmodell** – ein Satz, ohne Punkt am Ende.
 *
 * ## Was das Skript bewusst nicht kann
 *
 * Es prüft Ticker nur auf Dopplungen, nicht auf Richtigkeit. Ob `SU.PA`
 * wirklich Schneider Electric ist, weiß nur die Datenquelle – ein falscher
 * Ticker fällt erst beim Kursabruf auf, und zwar als fehlender Kurs mit
 * Warnung, nicht als falscher Kurs. Das ist die ungefährliche Richtung, aber
 * es heißt: Nach dem ersten Abruf gehört ein Blick in das Protokoll dazu.
 *
 * ## Warum `npm run aktien` und nicht der nackte Skriptaufruf
 *
 * Der npm-Befehl hängt Prettier an. Das ist keine Kosmetik: Der Workflow prüft
 * die Formatierung des ganzen Repositories und bricht ab, wenn eine Datei
 * abweicht – dann entsteht kein Paket, und die Website lässt sich nicht
 * veröffentlichen. Genau das ist passiert, weil die erzeugte Datei nach einem
 * späteren Lauf des Skripts unformatiert im Commit lag.
 *
 * Aufruf: `npm run aktien`
 */

import { readFile, writeFile } from 'node:fs/promises'

const QUELLE = 'data/aktien-liste.txt'
const ZIEL = 'data/markets-aktien.ts'
const KERN = 'data/markets.ts'

interface Zeile {
  symbol: string
  ticker: string
  name: string
  land: string
  waehrung: string
  branche: string
  geschaeft: string
}

/**
 * Ein Startwert je Symbol – gleichbleibend über alle Läufe.
 *
 * Die erzeugten Reihen sind Platzhalter, bis der erste echte Kursabruf läuft;
 * sie werden auf der Seite als solche gekennzeichnet. Trotzdem sollen sie
 * plausibel aussehen und sich bei jedem Lauf gleich ergeben – ein Diff, in dem
 * sich vierhundert Zufallszahlen ändern, wäre nicht lesbar.
 */
function streuwert(text: string): number {
  let wert = 2166136261
  for (let i = 0; i < text.length; i += 1) {
    wert ^= text.charCodeAt(i)
    wert = Math.imul(wert, 16777619)
  }
  return Math.abs(wert)
}

function anfuehrung(text: string): string {
  // Einfache Anführungszeichen im Namen (McDonald's) brechen den String auf.
  return text.includes("'") ? `"${text}"` : `'${text}'`
}

function baueEintrag(zeile: Zeile): string {
  const streu = streuwert(zeile.symbol)
  const start = 18 + (streu % 38000) / 100
  const drift = 0.03 + (streu % 90) / 1000
  const schwankung = 0.18 + (streu % 240) / 1000

  return `  {
    symbol: '${zeile.symbol}',
    ticker: '${zeile.ticker}',
    name: ${anfuehrung(zeile.name)},
    kind: 'stock',
    unit: '${zeile.waehrung}',
    decimals: 2,
    summary: ${anfuehrung(`${zeile.branche}: ${zeile.geschaeft}.`)},
    metaDescription: ${anfuehrung(
      `Die Aktie von ${zeile.name} in ${zeile.waehrung}: aktueller Stand, Chart über fünf Jahre und eine kurze Einordnung des Geschäftsmodells.`
    )},
    description: [
      ${anfuehrung(`${zeile.name} – ${zeile.geschaeft}. Notiert wird die Aktie in ${zeile.waehrung} unter dem Kürzel ${zeile.ticker}.`)},
      'Eine einzelne Aktie trägt immer das Risiko genau dieses Unternehmens – anders als ein Index, in dem sich ein Ausfall auf viele Werte verteilt. Wer einzelne Titel hält, sollte das bewusst tun und wissen, welchen Anteil am eigenen Vermögen sie ausmachen.',
    ],
    relatedTopics: ['aktie', 'aktien-laender-branchen', 'risiko-und-rendite'],
    branche: ${anfuehrung(zeile.branche)},
    seed: {
      startValue: ${start.toFixed(2)},
      annualDrift: ${drift.toFixed(3)},
      annualVolatility: ${schwankung.toFixed(3)},
      seed: ${streu % 90000},
    },
  },`
}

async function main() {
  const roh = await readFile(QUELLE, 'utf8')
  const zeilen: Zeile[] = []
  const fehler: string[] = []

  roh.split('\n').forEach((text, nummer) => {
    const inhalt = text.trim()
    if (inhalt.length === 0 || inhalt.startsWith('#')) return
    const felder = inhalt.split('|').map((feld) => feld.trim())
    if (felder.length !== 7) {
      fehler.push(
        `Zeile ${nummer + 1}: ${felder.length} Felder statt 7 – „${inhalt.slice(0, 60)}“`
      )
      return
    }
    const [symbol, ticker, name, land, waehrung, branche, geschaeft] = felder
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(symbol)) {
      fehler.push(`Zeile ${nummer + 1}: „${symbol}“ ist kein gültiges Symbol.`)
      return
    }
    if (!/^\d{3}$/.test(land)) {
      fehler.push(`Zeile ${nummer + 1}: „${land}“ ist keine dreistellige Länderkennung.`)
      return
    }
    zeilen.push({ symbol, ticker, name, land, waehrung, branche, geschaeft })
  })

  const gesehen = new Set<string>()
  for (const zeile of zeilen) {
    if (gesehen.has(zeile.symbol))
      fehler.push(`Symbol „${zeile.symbol}“ kommt mehrfach vor.`)
    gesehen.add(zeile.symbol)
  }

  /*
    Zwei Einträge mit demselben Ticker wären zwei Seiten, die denselben Kurs
    unter zwei Namen zeigen. Auffallen würde das erst jemandem, der beide
    nebeneinander legt – deshalb prüft das hier eine Maschine.

    Beim Aufbau der Liste war es siebenmal passiert: Toyota, Sony und Tencent
    stehen längst in `data/markets.ts`, und Berkshire, Hermès, Shell sowie
    Samsung Electronics dort unter anderem Symbol. Die vier Letzten sind der
    Grund, warum der Ticker eigens geprüft wird: Ein Abgleich der Symbole
    allein hätte sie durchgelassen.

    Der Kern wird als Text gelesen, nicht importiert: `data/markets.ts` bindet
    die hier erzeugte Datei ein, ein Import wäre also ein Ring. Die
    Zusammenführung steht dort als `...weitereAktien`, deshalb enthält der Text
    nur die von Hand gepflegten Einträge – genau die, mit denen es sich nicht
    stoßen darf.
  */
  const tickerZuSymbol = new Map<string, string>()
  for (const zeile of zeilen) {
    const schon = tickerZuSymbol.get(zeile.ticker)
    if (schon)
      fehler.push(`Ticker „${zeile.ticker}“ steht bei „${schon}“ und „${zeile.symbol}“.`)
    else tickerZuSymbol.set(zeile.ticker, zeile.symbol)
  }

  const kernText = await readFile(KERN, 'utf8')
  const kernSymbole = new Set(
    [...kernText.matchAll(/^\s*symbol: '([^']+)',$/gm)].map((treffer) => treffer[1])
  )
  const kernTicker = new Set(
    [...kernText.matchAll(/^\s*ticker: '([^']+)',$/gm)].map((treffer) => treffer[1])
  )
  for (const zeile of zeilen) {
    if (kernSymbole.has(zeile.symbol)) {
      fehler.push(
        `„${zeile.symbol}“ steht schon in ${KERN} – dort ausführlich beschrieben.`
      )
    }
    if (kernTicker.has(zeile.ticker)) {
      fehler.push(
        `Ticker „${zeile.ticker}“ steht schon in ${KERN} (Zeile „${zeile.symbol}“).`
      )
    }
  }

  if (fehler.length > 0) {
    console.error(
      `Die Liste ist fehlerhaft:\n${fehler.map((f) => `  - ${f}`).join('\n')}`
    )
    process.exit(1)
  }

  // Relativ, nicht über den Alias `@/`: Diese Datei hängt an `data/markets.ts`,
  // und die wird auch von `scripts/kurse-abrufen.ts` mit blankem Node geladen.
  const kopf = `import type { MarketDefinition, MarketSourceRef } from './markets.ts'

/**
 * Die breite Aktienauswahl.
 *
 * **Erzeugt von \`scripts/aktien-erzeugen.ts\` aus \`data/aktien-liste.txt\` –
 * Änderungen gehören in die Liste, nicht hierher.** Wer hier von Hand
 * eingreift, verliert die Änderung beim nächsten Lauf.
 *
 * Ausgelagert aus \`data/markets.ts\`, weil diese Einträge nach demselben
 * Muster gebaut sind und die eigentliche Kursdatei sonst zwischen den
 * ausführlich beschriebenen Indizes und Rohstoffen nicht mehr zu lesen wäre.
 *
 * Die Beschreibungen sind bewusst kurz: ein Satz zum Geschäftsmodell und der
 * Hinweis auf das Einzelwertrisiko. Bei dieser Anzahl wäre alles andere
 * entweder abgeschrieben oder erfunden.
 */

export const weitereAktien: MarketDefinition[] = [
${zeilen.map(baueEintrag).join('\n')}
]

/** Kursquellen für die breite Auswahl – Yahoo als Regelweg, Twelve Data optional. */
export const weitereAktienQuellen: Record<string, MarketSourceRef> = {
${zeilen
  .map((zeile) => {
    // Twelve Data führt Titel ohne Börsenkürzel; der Teil vor dem Punkt genügt.
    const twelve = zeile.ticker.split('.')[0]
    return `  '${zeile.symbol}': { provider: 'market', yahoo: '${zeile.ticker}', twelvedata: '${twelve}' },`
  })
  .join('\n')}
}

/** Herkunftsland je Aktie – Schlüssel wie in \`data/laender/namen.ts\`. */
export const weitereAktienLaender: Record<string, string> = {
${zeilen.map((zeile) => `  '${zeile.symbol}': '${zeile.land}',`).join('\n')}
}
`

  await writeFile(ZIEL, kopf, 'utf8')

  const jeLand = new Map<string, number>()
  for (const zeile of zeilen) jeLand.set(zeile.land, (jeLand.get(zeile.land) ?? 0) + 1)
  console.log(`${zeilen.length} Aktien erzeugt, ${jeLand.size} Länder.`)
  console.log(`Geschrieben: ${ZIEL}`)
}

main().catch((fehler) => {
  console.error(fehler)
  process.exit(1)
})
