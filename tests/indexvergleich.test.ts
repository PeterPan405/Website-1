/**
 * Prüfungen für den Vergleich einer Aktie mit ihrem Leitindex.
 *
 * Ausführen mit `npm test`.
 *
 * Die Fälle, die zählen, sind die schiefen: eine Aktie, die erst seit zwei
 * Jahren notiert, aber einen Fünfjahresvergleich angeboten bekäme; zwei
 * Reihen, die verschieden weit reichen; ein Index, der Dividenden mitrechnet,
 * und ein Kurs, der es nicht tut. Jeder dieser Fälle ergibt eine Zahl, die
 * völlig normal aussieht.
 */

import {
  leitindexFuer,
  minusJahre,
  punktNahe,
  tageZwischen,
  vergleiche,
  zusammenfassung,
  alleLeitindexSymbole,
  type Kurspunkt,
  type Leitindex,
} from '../lib/indexvergleich.ts'
import { marketDefinitions, marketSources } from '../data/markets.ts'

let failed = 0
function check(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  const ok = a === e
  if (!ok) failed++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : `\n     erwartet ${e}\n     erhalten ${a}`}`
  )
}

/* ---------------------------------------------------------------- Zuordnung */

check('Dollar führt zum S&P 500', leitindexFuer('USD', '840')?.symbol, 'sp500')
check(
  'irischer Sitz, Dollarnotierung: trotzdem S&P 500',
  leitindexFuer('USD', '372')?.symbol,
  'sp500'
)
check('Euro und deutscher Sitz: DAX', leitindexFuer('EUR', '276')?.symbol, 'dax')
check(
  'Euro und französischer Sitz: CAC 40',
  leitindexFuer('EUR', '250')?.symbol,
  'cac-40'
)
check(
  'Euro ohne eigenen Landesindex: Euro Stoxx 50',
  leitindexFuer('EUR', '528')?.symbol,
  'euro-stoxx-50'
)
check('Euro ohne Sitzland: Euro Stoxx 50', leitindexFuer('EUR')?.symbol, 'euro-stoxx-50')
check('Pence findet den FTSE 100', leitindexFuer('GBp', '826')?.symbol, 'ftse-100')
check('Pfund findet den FTSE 100', leitindexFuer('GBP', '826')?.symbol, 'ftse-100')
check('Yen findet den Nikkei', leitindexFuer('JPY', '392')?.symbol, 'nikkei-225')
check(
  'Hongkong-Dollar findet den Hang Seng',
  leitindexFuer('HKD', '156')?.symbol,
  'hang-seng'
)
check('Franken findet den SMI', leitindexFuer('CHF', '756')?.symbol, 'smi')
check('Won findet den KOSPI', leitindexFuer('KRW', '410')?.symbol, 'kospi')
check('Rupie findet den NIFTY 50', leitindexFuer('INR', '356')?.symbol, 'nifty-50')
check(
  'kanadischer Dollar findet den TSX',
  leitindexFuer('CAD', '124')?.symbol,
  'tsx-composite'
)
check(
  'australischer Dollar findet den ASX 200',
  leitindexFuer('AUD', '036')?.symbol,
  'asx-200'
)
check('Real findet den Ibovespa', leitindexFuer('BRL', '076')?.symbol, 'ibovespa')
check('Krone findet den OMXS30', leitindexFuer('SEK', '752')?.symbol, 'omx-stockholm-30')
check('Taiwan-Dollar findet den TAIEX', leitindexFuer('TWD', '158')?.symbol, 'taiex')
/*
  Für kleinere Handelsplätze gibt es hier keinen Index. Das ist der vorgesehene
  Zustand und kein Mangel – ein Vergleich mit einem unpassenden Index wäre
  schlechter als keiner.
*/
check('mexikanischer Peso hat hier keinen Index', leitindexFuer('MXN', '484'), null)
check('Singapur-Dollar hat hier keinen Index', leitindexFuer('SGD', '702'), null)
check('Punkte sind keine Währung', leitindexFuer('Punkte'), null)
check(
  'nur der DAX rechnet Dividenden mit',
  leitindexFuer('EUR', '276')?.art,
  'performance'
)
check('der S&P 500 nicht', leitindexFuer('USD', '840')?.art, 'kurs')
check('alle Zielsymbole', alleLeitindexSymbole(), [
  'asx-200',
  'cac-40',
  'dax',
  'euro-stoxx-50',
  'ftse-100',
  'hang-seng',
  'ibovespa',
  'kospi',
  'nifty-50',
  'nikkei-225',
  'omx-stockholm-30',
  'smi',
  'sp500',
  'taiex',
  'tsx-composite',
])

/*
  Jedes Zielsymbol muss es im Katalog auch geben – als Index und mit einer
  eingetragenen Kursquelle.

  Ohne diese Prüfung wäre ein Tippfehler im Symbol unsichtbar: `getLiveSeries`
  liefert für ein unbekanntes Symbol `null`, der Vergleich entfällt, und die
  Seite sieht aus wie eine, für die es eben keinen Index gibt. Kein Build, kein
  Typprüfer und kein Lint würde etwas melden.
*/
const katalog = new Map(marketDefinitions.map((d) => [d.symbol, d]))
for (const symbol of alleLeitindexSymbole()) {
  check(`${symbol} steht als Index im Katalog`, katalog.get(symbol)?.kind, 'index')
  check(`${symbol} hat eine Kursquelle`, Boolean(marketSources[symbol]), true)
}

/* ------------------------------------------------------------------ Datum */

check('Abstand über einen Monatswechsel', tageZwischen('2026-07-30', '2026-08-02'), 3)
check('Abstand ist richtungslos', tageZwischen('2026-08-02', '2026-07-30'), 3)
check('fünf Jahre zurück', minusJahre('2026-07-30', 5), '2021-07-30')
check('ein Jahr zurück über den Jahreswechsel', minusJahre('2026-01-02', 1), '2025-01-02')
check(
  'der 29. Februar wird zum 1. März – innerhalb der Toleranz',
  minusJahre('2024-02-29', 1),
  '2023-03-01'
)

/* ----------------------------------------------------------- nächster Punkt */

const kurzeReihe: Kurspunkt[] = [
  { d: '2021-08-02', c: 100 },
  { d: '2021-08-09', c: 101 },
  { d: '2022-08-01', c: 120 },
]

check(
  'drei Tage vor dem ersten Punkt: der erste Punkt zählt',
  punktNahe(kurzeReihe, '2021-07-30')?.d,
  '2021-08-02'
)
check('genau getroffen', punktNahe(kurzeReihe, '2021-08-09')?.d, '2021-08-09')
check('ein Jahr daneben ist zu weit', punktNahe(kurzeReihe, '2019-07-30'), null)
check('leere Reihe', punktNahe([], '2021-08-02'), null)

/* -------------------------------------------------------------- Vergleich */

const sp500: Leitindex = {
  symbol: 'sp500',
  name: 'S&P 500',
  waehrung: 'USD',
  art: 'kurs',
  grund: 'der breite Index des amerikanischen Marktes',
}

/**
 * Fünf Jahre Reihe, ein Punkt je Kalenderjahr am 1. August, plus ein Ende am
 * 30. Juli 2026. Genug, um alle drei Zeiträume zu treffen, und wenig genug,
 * um die Zahlen im Kopf nachzurechnen.
 */
function jahresreihe(werte: number[]): Kurspunkt[] {
  const tage = [
    '2021-08-01',
    '2022-08-01',
    '2023-08-01',
    '2024-08-01',
    '2025-08-01',
    '2026-07-30',
  ]
  return tage.map((d, i) => ({ d, c: werte[i] }))
}

/* Aktie verdoppelt sich in fünf Jahren, Index legt 50 Prozent zu. */
const aktie = jahresreihe([100, 110, 120, 130, 160, 200])
const index = jahresreihe([1000, 1100, 1200, 1250, 1400, 1500])

const ergebnis = vergleiche(aktie, index, sp500)

check('es gibt drei Zeiträume', ergebnis?.zeitraeume.length, 3)
check(
  'die Zeiträume stehen aufsteigend',
  ergebnis?.zeitraeume.map((z) => z.jahre),
  [1, 3, 5]
)
check(
  'fünf Jahre: die Aktie hat sich verdoppelt',
  ergebnis?.zeitraeume[2].wertProzent,
  100
)
check(
  'fünf Jahre: der Index legte 50 Prozent zu',
  ergebnis?.zeitraeume[2].indexProzent,
  50
)
check('fünf Jahre: 50 Prozentpunkte Differenz', ergebnis?.zeitraeume[2].differenz, 50)
check(
  'der Anfangstag ist der tatsächliche Handelstag',
  ergebnis?.zeitraeume[2].vonTag,
  '2021-08-01'
)
check(
  'der Endtag ist der letzte gemeinsame',
  ergebnis?.zeitraeume[2].bisTag,
  '2026-07-30'
)
check(
  'ein Jahr: 200 gegen 160 sind 25 Prozent',
  Math.round((ergebnis?.zeitraeume[0].wertProzent ?? 0) * 100) / 100,
  25
)
check(
  'ein Jahr: der Index kam auf rund 7,14 Prozent',
  Math.round((ergebnis?.zeitraeume[0].indexProzent ?? 0) * 100) / 100,
  7.14
)
check('das Label steht am Zeitraum', ergebnis?.zeitraeume[1].label, 'Drei Jahre')

/* Ein Titel, der erst seit zwei Jahren notiert. */
const jung: Kurspunkt[] = [
  { d: '2024-08-01', c: 50 },
  { d: '2025-08-01', c: 60 },
  { d: '2026-07-30', c: 80 },
]
const jungesErgebnis = vergleiche(jung, index, sp500)
check(
  'ein junger Titel bekommt nur den Einjahresvergleich',
  jungesErgebnis?.zeitraeume.map((z) => z.jahre),
  [1]
)

/* Zwei Reihen, die verschieden weit reichen. */
const veralteterIndex = index.slice(0, -1)
check(
  'ein Index, der vier Wochen zurückliegt, ergibt keinen Vergleich',
  vergleiche(aktie, veralteterIndex, sp500),
  null
)

check(
  'eine Reihe mit einem Punkt ergibt nichts',
  vergleiche([aktie[0]], index, sp500),
  null
)
check('eine leere Indexreihe ergibt nichts', vergleiche(aktie, [], sp500), null)

/* Ein Startkurs von null würde durch null teilen. */
const mitNull = jahresreihe([0, 110, 120, 130, 160, 200])
check(
  'ein Startkurs von null lässt den Zeitraum ausfallen',
  vergleiche(mitNull, index, sp500)?.zeitraeume.map((z) => z.jahre),
  [1, 3]
)

/* -------------------------------------------------------- Zusammenfassung */

check(
  'in allen Zeiträumen vorn',
  zusammenfassung(ergebnis!, 'Nvidia'),
  'Nvidia lag in allen 3 betrachteten Zeiträumen vor dem S&P 500.'
)
check(
  'in keinem Zeitraum vorn',
  zusammenfassung(vergleiche(index, aktie, sp500)!, 'Der Index'),
  'Der Index lag in keinem der betrachteten Zeiträume vor dem S&P 500.'
)

/* Gemischt: über ein Jahr hinten, über drei und fünf vorn. */
const gemischt = jahresreihe([100, 110, 120, 130, 190, 200])
const gemischtesErgebnis = vergleiche(gemischt, index, sp500)!
check(
  'gemischt: über ein Jahr hinten',
  gemischtesErgebnis.zeitraeume[0].differenz < 0,
  true
)
check(
  'gemischt gezählt',
  zusammenfassung(gemischtesErgebnis, 'Ein Titel'),
  'Ein Titel lag in 2 von 3 Zeiträumen vor dem S&P 500 – gezählt über 3 Zeiträume, nicht über die Zukunft.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
