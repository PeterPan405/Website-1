/**
 * Prüfungen für die Depotanalyse.
 *
 * Ausführen mit `npm test`.
 *
 * Die interessanten Fälle sind nicht die glatten. Geprüft wird vor allem, was
 * passiert, wenn Stammdaten fehlen – denn das ist der Normalfall: Zu einem ETF
 * gibt es keine Branche, zu vielen Titeln keine Kostenquote, und ein Index hat
 * keine Währung. Eine Analyse, die solche Lücken stillschweigend wegkürzt,
 * liefert zu schöne Zahlen.
 */

import {
  analysiere,
  beobachtungen,
  type DepotStammdaten,
  type Position,
} from '../lib/depot.ts'

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

const stamm = new Map<string, DepotStammdaten>([
  [
    'nvidia',
    {
      symbol: 'nvidia',
      name: 'Nvidia',
      kind: 'stock',
      unit: 'USD',
      branche: 'Halbleiter',
      sitzland: '840',
      dividendenrendite: 0.03,
    },
  ],
  [
    'amd',
    {
      symbol: 'amd',
      name: 'AMD',
      kind: 'stock',
      unit: 'USD',
      branche: 'Halbleiter',
      sitzland: '840',
    },
  ],
  [
    'sap',
    {
      symbol: 'sap',
      name: 'SAP',
      kind: 'stock',
      unit: 'EUR',
      branche: 'Software',
      sitzland: '276',
      dividendenrendite: 1.2,
    },
  ],
  [
    'etf-world',
    {
      symbol: 'etf-world',
      name: 'ETF Welt',
      kind: 'etf',
      unit: 'EUR',
      kostenquote: 0.2,
    },
  ],
])

// ------------------------------------------------------------------ Grundlagen

const gleich: Position[] = [
  { symbol: 'nvidia', betrag: 1000 },
  { symbol: 'amd', betrag: 1000 },
  { symbol: 'sap', betrag: 1000 },
  { symbol: 'etf-world', betrag: 1000 },
]
const a1 = analysiere(gleich, stamm)

check('Summe stimmt', a1.summe, 4000)
check('Anzahl stimmt', a1.anzahl, 4)
check('Anteile stimmen', a1.positionen[0].anteil, 0.25)
check(
  'Herfindahl bei vier gleichen',
  Math.round(a1.konzentration.herfindahl * 1000) / 1000,
  0.25
)
check('wirksame Anzahl bei vier gleichen', Math.round(a1.konzentration.wirksameAnzahl), 4)

/*
  Ungültiges zählt nicht mit – aber es darf auch nicht die Summe verfälschen.
  Ein leeres Feld beim Tippen ist der häufigste Zustand einer Eingabemaske.
*/
const mitMuell = analysiere(
  [
    ...gleich,
    { symbol: 'sap', betrag: 0 },
    { symbol: '', betrag: 500 },
    { symbol: 'sap', betrag: Number.NaN },
  ],
  stamm
)
check('Null, Leeres und NaN fallen heraus', [mitMuell.summe, mitMuell.anzahl], [4000, 4])

// ----------------------------------------------------------------- Gruppierung

check(
  'Branchen werden zusammengefasst',
  a1.nachBranche.map((b) => [b.gruppe, b.betrag]),
  [
    ['Halbleiter', 2000],
    ['Software', 1000],
    [null, 1000],
  ]
)

/*
  „Nicht zugeordnet“ steht unten, auch wenn es die größte Gruppe wäre. Es ist
  eine Lücke im Datenbestand, keine Aussage über das Depot.
*/
const vielEtf = analysiere(
  [
    { symbol: 'etf-world', betrag: 9000 },
    { symbol: 'sap', betrag: 1000 },
  ],
  stamm
)
check(
  'ohne Zuordnung steht unten',
  vielEtf.nachBranche.map((b) => b.gruppe),
  ['Software', null]
)

check(
  'Währungen werden zusammengefasst',
  a1.nachWaehrung.map((w) => [w.gruppe, w.betrag]),
  [
    ['EUR', 2000],
    ['USD', 2000],
  ]
)

const mitIndex = analysiere(
  [{ symbol: 'dax', betrag: 1000 }],
  new Map([['dax', { symbol: 'dax', name: 'DAX', kind: 'index', unit: 'Punkte' }]])
)
check('Punkte sind keine Währung', mitIndex.nachWaehrung[0].gruppe, null)

check(
  'Anlagearten auf Deutsch',
  a1.nachArt.map((x) => x.gruppe),
  ['Aktien', 'ETFs']
)

// --------------------------------------------------------------- Konzentration

const schief = analysiere(
  [
    { symbol: 'nvidia', betrag: 6000 },
    { symbol: 'amd', betrag: 1000 },
    { symbol: 'sap', betrag: 1000 },
    { symbol: 'etf-world', betrag: 1000 },
    { symbol: 'gold', betrag: 1000 },
  ],
  stamm
)
check('größte Position', Math.round(schief.konzentration.groessterPosten * 100), 60)
check('drei größte zusammen', Math.round(schief.konzentration.dreiGroessten * 100), 80)
/*
  Fünf Zeilen, aber die Verteilung entspricht rund zweieinhalb gleich großen.
  Genau das ist der Grund, warum die Zahl der Positionen nichts über Streuung
  sagt.
*/
check(
  'wirksame Anzahl bei einer 60-Prozent-Position',
  Math.round(schief.konzentration.wirksameAnzahl * 10) / 10,
  // 0,6² + 4 × 0,1² = 0,40 – der Kehrwert davon ist 2,5.
  2.5
)

/* Ein unbekanntes Symbol zählt in Summe und Gewicht, aber in keiner Gruppe. */
check('unbekanntes Symbol zählt zur Summe', schief.summe, 10000)
check(
  'unbekanntes Symbol landet unter „nicht zugeordnet“',
  schief.nachArt.find((x) => x.gruppe === null)?.betrag,
  1000
)

// ------------------------------------------------------- Kosten und Ausschüttung

/*
  Der wichtigste Fall: Nur zu einem Viertel des Depots ist eine Kostenquote
  hinterlegt. Der gewichtete Wert bezieht sich auf dieses Viertel, und die
  Abdeckung steht daneben. Über das ganze Depot gerechnet käme 0,05 heraus –
  eine Zahl, die viel zu gut aussieht und nichts beschreibt.
*/
check('Kostenquote über den bekannten Teil', a1.kostenquote, 0.2)
check('Abdeckung wird ausgewiesen', a1.kostenAbdeckung, 0.25)
check(
  'ohne jede Angabe bleibt es null',
  analysiere([{ symbol: 'amd', betrag: 100 }], stamm).kostenquote,
  null
)

const div = analysiere(
  [
    { symbol: 'nvidia', betrag: 1000 },
    { symbol: 'sap', betrag: 1000 },
  ],
  stamm
)
check(
  'Dividendenrendite gewichtet',
  Math.round((div.dividendenrendite ?? 0) * 100) / 100,
  0.62
)
check('Dividenden-Abdeckung', div.dividendenAbdeckung, 1)

// ----------------------------------------------------------------- Leerer Fall

const leer = analysiere([], stamm)
check(
  'leere Aufstellung stürzt nicht ab',
  [leer.summe, leer.anzahl, leer.konzentration.wirksameAnzahl],
  [0, 0, 0]
)
check('leere Aufstellung erzeugt keine Beobachtungen', beobachtungen(leer).length, 0)

// ---------------------------------------------------------------- Beobachtungen

const b = beobachtungen(schief)
check(
  'Klumpen wird benannt',
  b.some((x) => x.text.includes('60 Prozent')),
  true
)
check(
  'Branchenhäufung wird benannt',
  b.some((x) => x.text.includes('Halbleiter')),
  true
)
/*
  Formulierung als Beobachtung, nie als Rat: Auf dieser Website findet keine
  Anlageberatung statt, und der Unterschied hängt am Verb.
*/
check(
  'kein Text enthält eine Empfehlung',
  b.every((x) => !/solltest|empfehl|kaufe|verkaufe|zu viel|besser wäre/i.test(x.text)),
  true
)

/*
  Vier gleich große Positionen erzeugen keinen Hinweis auf eine zu große
  Einzelposition – wohl aber einen auf die Branche: Nvidia und AMD sind
  zusammen die Hälfte und beide Halbleiter. Genau das soll auffallen, denn die
  Zahl der Positionen sagt nichts darüber, woran sie hängen.
*/
const ausgewogen = beobachtungen(a1)
check(
  'gleich große Positionen erzeugen keinen Hinweis auf eine Einzelposition',
  ausgewogen.some((x) => x.text.includes('größte Position')),
  false
)
check(
  'die halbe Summe in einer Branche fällt trotzdem auf',
  ausgewogen.some((x) => x.text.includes('Halbleiter')),
  true
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfungen fehlgeschlagen.`
)
if (failed > 0) process.exit(1)
