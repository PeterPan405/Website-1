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

import { werteDividenden } from '../lib/dividenden.ts'
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

/* ---------------------------------------------------------------------------
   Der Börsenwert gegen das Eigenkapital
--------------------------------------------------------------------------- */

console.log('\n— Börsenwert gegen Eigenkapital —')

/*
  Diese Prüfung gibt es, weil die vorige eine Lücke hatte.

  Das Kurs-Umsatz-Verhältnis braucht einen Umsatz. Für die Werte an der Börse
  Taipeh liegt der in den ersten drei Quartalen eines Jahres nicht vor – und
  genau dort ist die Aktienzahl beim ersten Lauf um den Faktor tausend
  danebengelegen, ohne dass irgendetwas angeschlagen hätte. TSMC bekam 25,9
  Billionen Aktien statt 25,9 Milliarden.

  Das Kurs-Buchwert-Verhältnis braucht nur Eigenkapital und Aktienzahl. Es
  deckt damit auch die Datensätze ab, die noch keine Erfolgsrechnung haben.

  ## Warum die Obergrenze davon abhängt, ob ein Umsatz vorliegt

  Eine einzige Obergrenze für alle war zu grob, und das hat die Erweiterung
  der Aktienauswahl gezeigt: Colgate kam auf ein KBV von 516, Gartner auf 175,
  Alnylam auf 163, Seagate auf 157 – und in keinem der vier Fälle lag ein
  Datenfehler vor. Colgate kauft seit Jahrzehnten eigene Aktien zurück und hat
  deshalb ein Eigenkapital von 145 Millionen Dollar bei 20 Milliarden Umsatz;
  Alnylam trägt Verlustvorträge. Ein KBV in den Hundertern ist dort die
  Wahrheit über die Bilanz, keine Fehlmessung.

  Belegt ist das über die anderen beiden Kennzahlen: Alle drei entstehen aus
  demselben Kurs und derselben Aktienzahl. Wäre eine davon um den Faktor
  tausend falsch, wären alle drei es. Colgates Kurs-Umsatz-Verhältnis von 3,7
  und sein Kurs-Gewinn-Verhältnis von 35 sind unauffällig – also stimmen Kurs
  und Aktienzahl, und allein das Eigenkapital ist klein.

  Daraus folgt die Zweiteilung. Liegt ein Umsatz vor, prüft ihn schon die
  vorige Prüfung mit einer engen Grenze; das KBV darf dann weit sein, ohne
  dass ein Faktor tausend durchkäme – der müsste sich dort zeigen. Fehlt der
  Umsatz – der Fall der Börse Taipeh in den ersten drei Quartalen, wegen dem
  diese Prüfung überhaupt entstand –, ist das KBV die einzige Sicherung und
  bleibt streng.
*/
const KBV_MIN = 0.02
/** Ohne Umsatz zur Gegenprobe: streng, wie bisher. */
const KBV_MAX_OHNE_UMSATZ = 150
/** Mit Umsatz: weit, aber weit unter dem Faktor tausend, der gesucht wird. */
const KBV_MAX_MIT_UMSATZ = 800

const auffaelligKbv: string[] = []
let geprueftKbv = 0

for (const [ticker, zahlen] of eintraege) {
  const eintrag = katalog.get(ticker)
  if (!eintrag || HINTERLEGUNGSSCHEINE.has(ticker)) continue

  const berichtswaehrung = zahlen.waehrung ?? 'USD'
  if (!gleicheWaehrung(eintrag.waehrung, berichtswaehrung)) continue

  // Negatives Eigenkapital gibt es wirklich – dort sagt ein KBV nichts.
  if (!zahlen.aktien || !zahlen.eigenkapital || zahlen.eigenkapital <= 0) continue
  const roh = letzterKurs(eintrag.symbol)
  if (roh === null || roh <= 0) continue

  geprueftKbv += 1
  const kurs = inHauptwaehrung(roh, eintrag.waehrung)
  const kbv = (kurs.wert * zahlen.aktien) / zahlen.eigenkapital
  const grenze =
    zahlen.umsatz && zahlen.umsatz > 0 ? KBV_MAX_MIT_UMSATZ : KBV_MAX_OHNE_UMSATZ
  if (kbv < KBV_MIN || kbv > grenze) {
    auffaelligKbv.push(
      `${ticker} (${eintrag.symbol}): KBV ${kbv < 1 ? kbv.toFixed(3) : Math.round(kbv)} ` +
        `aus Kurs ${kurs.wert} ${kurs.waehrung} × ${zahlen.aktien} Aktien / Eigenkapital ${zahlen.eigenkapital}` +
        ` (Grenze ${grenze})`
    )
  }
}

pruefe(`es wurden überhaupt Buchwerte gerechnet (${geprueftKbv})`, geprueftKbv > 50)
pruefe(
  `jedes Kurs-Buchwert-Verhältnis liegt zwischen ${KBV_MIN} und ${KBV_MAX_OHNE_UMSATZ} ` +
    `beziehungsweise ${KBV_MAX_MIT_UMSATZ}, wo ein Umsatz gegenprüft`,
  auffaelligKbv.length === 0,
  `\n       ${auffaelligKbv.join('\n       ')}`
)

/* ---------------------------------------------------------------------------
   Die Dividendenrendite
--------------------------------------------------------------------------- */

console.log('\n— Dividendenrendite —')

/*
  Dieselbe Prüfung wie oben, für die dritte Quelle: die gemeldeten
  Dividendenzahlungen.

  Der Fehler, der hier gefangen wird, ist ein Einheitenfehler – und es hat
  ihn schon gegeben, wenn auch nur in der Anzeige: Weil `formatPercent` die
  Prozentzahl selbst erwartet und nicht den Anteil, wies Apple eine
  Dividendenrendite von 0,00 Prozent aus statt 0,31. Andersherum wäre er
  gefährlicher: Stünde bei Shell versehentlich der Kurs in Pfund und die
  Dividende in Pence, käme eine Rendite von 327 Prozent heraus.

  Eine reguläre Dividendenrendite über 20 Prozent gibt es praktisch nicht.
  Über 15 liegen einige Sonderfälle – geschlossene Fonds, einmalige
  Sonderausschüttungen –, deshalb ist die Grenze nicht knapp gesetzt. Ein
  Faktor 100 liegt weit darüber.
*/
const RENDITE_MAX = 25

const dividenden = JSON.parse(
  readFileSync(join(wurzel, 'data/snapshots/dividenden.json'), 'utf8')
) as { titel: Record<string, { date: string; amount: number }[]> }

const heute = new Date().toISOString().slice(0, 10)
const auffaelligeRendite: string[] = []
let geprueftRendite = 0

for (const [symbol, zahlungen] of Object.entries(dividenden.titel)) {
  const kurs = letzterKurs(symbol)
  if (kurs === null || kurs <= 0) continue
  const befund = werteDividenden(zahlungen, kurs, heute)
  if (!befund || befund.renditeProzent === null) continue

  geprueftRendite += 1
  if (befund.renditeProzent > RENDITE_MAX) {
    auffaelligeRendite.push(
      `${symbol}: ${befund.renditeProzent.toFixed(1)} % aus ` +
        `${befund.summeZwoelfMonate} je Aktie bei Kurs ${kurs}`
    )
  }
}

pruefe(`es wurden Renditen gerechnet (${geprueftRendite})`, geprueftRendite > 50)
pruefe(
  `jede Dividendenrendite liegt unter ${RENDITE_MAX} Prozent`,
  auffaelligeRendite.length === 0,
  `\n       ${auffaelligeRendite.join('\n       ')}`
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
