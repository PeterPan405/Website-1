/**
 * Prüft die Unternehmenszahlen gegen den Kurs auf Plausibilität.
 *
 * ## Wogegen das läuft
 *
 * Die Zahlen kommen aus den XBRL-Pflichtmeldungen bei der SEC, zugeordnet über
 * eine Tabelle von Börsenkürzel zu Börsenkürzel. Diese Zuordnung ist die
 * gefährlichste Stelle im ganzen Vorgang, denn sie kann falsch sein, ohne dass
 * irgendetwas fehlschlägt: `MRK.DE` ist Merck in Darmstadt, `MRK` ist Merck &
 * Co. in New Jersey. Beide melden echte Zahlen, beide sind Pharmakonzerne, und
 * beide Datensätze sehen für sich genommen tadellos aus.
 *
 * Auffliegen kann so etwas nur im Verhältnis zum Kurs. Ein Unternehmen, das an
 * der Börse das Zweihundertfache seines Jahresumsatzes kostet, gibt es –
 * dieselbe Zahl entsteht aber auch, wenn ein Umsatz in Yen neben einem Kurs in
 * Dollar steht oder wenn die Aktienzahl von vor einem Split stammt. Der
 * Unterschied ist von außen nicht zu sehen, und genau deshalb steht hier eine
 * Grenze und kein Kommentar.
 *
 * ## Warum die Grenzen so weit sind
 *
 * Sie sollen nicht beurteilen, ob eine Aktie teuer ist. Sie sollen den Fall
 * abfangen, in dem eine Größenordnung nicht stimmt – und Größenordnungen
 * verfehlt man um Faktoren wie 100 (Pence statt Pfund), 150 (Yen statt Dollar)
 * oder 5 (ein Aktiensplit).
 *
 * Die Obergrenze liegt bei 120. Der höchste echte Wert im Bestand ist Palantir
 * mit 66 – eine Aktie, die tatsächlich das Sechsundsechzigfache ihres
 * Jahresumsatzes kostet. Eine Grenze von 60 hätte den gemeldet, und eine
 * Prüfung, die Richtiges anschlägt, schaut man nach dem zweiten Mal nicht mehr
 * an. Der Median liegt bei 4, der niedrigste Wert bei 0,19.
 *
 * ## Was diese Prüfung schon gefunden hat
 *
 * Beim ersten Lauf sechs britische Aktien mit Werten zwischen 173 und 711.
 * Ursache war keine Fehlzuordnung, sondern die Einheit: Die Londoner Börse
 * stellt Aktien in Pence, im Katalog stand `GBP`. Die Website zeigte damit für
 * 26 Werte den hundertfachen Kurs – mit korrekt aussehendem Währungskürzel
 * daneben.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { HINTERLEGUNGSSCHEINE } from '../lib/hinterlegungsscheine.ts'
import { gleicheWaehrung, inHauptwaehrung } from '../lib/waehrungseinheit.ts'

const wurzel = join(import.meta.dirname, '..')

let bestanden = 0
let gescheitert = 0

function pruefe(name: string, bedingung: boolean, hinweis?: string) {
  if (bedingung) {
    bestanden++
    console.log(`OK   ${name}`)
  } else {
    gescheitert++
    console.error(`FEHL ${name}${hinweis ? ` – ${hinweis}` : ''}`)
  }
}

interface Zahlen {
  umsatz?: number
  gewinn?: number
  cashflow?: number
  eigenkapital?: number
  aktien?: number
  waehrung?: string
}

const momentaufnahme = JSON.parse(
  readFileSync(join(wurzel, 'data/snapshots/fundamentaldaten.json'), 'utf8')
) as { unternehmen: Record<string, Zahlen> }

/** Kürzel, Symbol und Kurswährung aus dem Katalog. */
const katalog = new Map<string, { symbol: string; waehrung: string }>()
for (const datei of ['data/markets.ts', 'data/markets-aktien.ts']) {
  const text = readFileSync(join(wurzel, datei), 'utf8')
  for (const treffer of text.matchAll(
    /^\s*symbol: '([^']+)',\n\s*ticker: '([^']+)',\n\s*name: (?:'[^']*'|"[^"]*"),\n\s*kind: '([^']+)',\n\s*unit: '([^']+)',/gm
  )) {
    if (treffer[3] !== 'stock') continue
    katalog.set(treffer[2], { symbol: treffer[1], waehrung: treffer[4] })
  }
}

const kurse = JSON.parse(
  readFileSync(join(wurzel, 'data/snapshots/markets.json'), 'utf8')
) as { instruments: Record<string, { points?: { d: string; c: number }[] }> }

function letzterKurs(symbol: string): number | null {
  const punkte = kurse.instruments[symbol]?.points
  if (!punkte || punkte.length === 0) return null
  const letzter = punkte[punkte.length - 1]?.c
  return typeof letzter === 'number' && Number.isFinite(letzter) ? letzter : null
}

/* ---------------------------------------------------------------------------
   Die Zahlen für sich – ohne Kurs
--------------------------------------------------------------------------- */

console.log('\n— Jeder Datensatz für sich —')

const eintraege = Object.entries(momentaufnahme.unternehmen)
pruefe('es stehen überhaupt Unternehmen in der Momentaufnahme', eintraege.length > 100)

const winzigeAktienzahl = eintraege.filter(
  ([, z]) => typeof z.aktien === 'number' && z.aktien < 1000
)
pruefe(
  'keine Aktienzahl unter tausend',
  winzigeAktienzahl.length === 0,
  winzigeAktienzahl.map(([k, z]) => `${k}: ${z.aktien}`).join(', ')
)

const negativerUmsatz = eintraege.filter(
  ([, z]) => typeof z.umsatz === 'number' && z.umsatz <= 0
)
pruefe(
  'kein Umsatz von null oder darunter',
  negativerUmsatz.length === 0,
  negativerUmsatz.map(([k]) => k).join(', ')
)

/*
  Ein Gewinn größer als der Umsatz kommt vor – bei Beteiligungsgesellschaften,
  die ihre Erträge nicht als Umsatz ausweisen. Das Fünffache nicht mehr; dann
  stammen die beiden Zahlen aus verschiedenen Meldungen.
*/
const gewinnUeberUmsatz = eintraege.filter(
  ([, z]) =>
    typeof z.gewinn === 'number' &&
    typeof z.umsatz === 'number' &&
    z.umsatz > 0 &&
    Math.abs(z.gewinn) > z.umsatz * 5
)
pruefe(
  'kein Gewinn über dem Fünffachen des Umsatzes',
  gewinnUeberUmsatz.length === 0,
  gewinnUeberUmsatz
    .map(([k, z]) => `${k}: ${Math.round((z.gewinn! / z.umsatz!) * 10) / 10}×`)
    .join(', ')
)

const waehrungen = new Set(
  eintraege.map(([, z]) => z.waehrung).filter((w): w is string => Boolean(w))
)
pruefe(
  'jede Berichtswährung ist ein Dreibuchstabencode',
  [...waehrungen].every((w) => /^[A-Z]{3}$/.test(w)),
  [...waehrungen].filter((w) => !/^[A-Z]{3}$/.test(w)).join(', ')
)

/* ---------------------------------------------------------------------------
   Die Zahlen im Verhältnis zum Kurs
--------------------------------------------------------------------------- */

console.log('\n— Bewertung im Verhältnis zum Kurs —')

/** Untere und obere Grenze für das Kurs-Umsatz-Verhältnis. */
const KUV_MIN = 0.05
const KUV_MAX = 120

const auffaellig: string[] = []
let geprueft = 0

for (const [ticker, zahlen] of eintraege) {
  const eintrag = katalog.get(ticker)
  if (!eintrag) continue

  /*
    Hinterlegungsscheine bleiben draußen – aus demselben Grund wie auf der
    Website: Ein Papier von Taiwan Semiconductor verbrieft fünf Stammaktien,
    die Aktienzahl der Meldung zählt Stammaktien. Das Kurs-Umsatz-Verhältnis
    liegt dadurch beim Fünffachen und würde hier zu Recht auffallen – nur ist
    es eben schon bekannt und wird gar nicht erst angezeigt.
  */
  if (HINTERLEGUNGSSCHEINE.has(ticker)) continue

  // Nur rechnen, wo Bilanz- und Kurswährung übereinstimmen – wie die Website.
  const berichtswaehrung = zahlen.waehrung ?? 'USD'
  if (!gleicheWaehrung(eintrag.waehrung, berichtswaehrung)) continue

  if (!zahlen.aktien || !zahlen.umsatz || zahlen.umsatz <= 0) continue
  const roh = letzterKurs(eintrag.symbol)
  if (roh === null || roh <= 0) continue

  geprueft += 1
  const kurs = inHauptwaehrung(roh, eintrag.waehrung)
  const kuv = (kurs.wert * zahlen.aktien) / zahlen.umsatz
  if (kuv < KUV_MIN || kuv > KUV_MAX) {
    auffaellig.push(
      `${ticker} (${eintrag.symbol}): KUV ${kuv < 1 ? kuv.toFixed(3) : Math.round(kuv)} ` +
        `aus Kurs ${kurs.wert} ${kurs.waehrung} × ${zahlen.aktien} Aktien / Umsatz ${zahlen.umsatz}`
    )
  }
}

pruefe(`es wurden überhaupt Bewertungen gerechnet (${geprueft})`, geprueft > 50)
pruefe(
  `jedes Kurs-Umsatz-Verhältnis liegt zwischen ${KUV_MIN} und ${KUV_MAX}`,
  auffaellig.length === 0,
  `\n       ${auffaellig.join('\n       ')}`
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
