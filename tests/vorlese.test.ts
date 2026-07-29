/**
 * Prüfungen für die Vorlesefassung der Inhaltsblöcke.
 *
 * Der Fehler, um den es hier geht, ist nicht sichtbar und nicht hörbar für
 * den, der ihn einbaut: Eine Formel aus Symbolen, eine Tabelle als
 * zusammenhanglose Zahlenreihe, eine Grafik als Stille. Wer die Seite liest,
 * merkt nichts davon – es trifft nur den, der sie hört.
 */

import { technischeAnalyseLektionen } from '../data/akademie/technische-analyse.ts'
import { figureMeta } from '../data/figures.ts'
import { vorleseAbschnitte } from '../lib/vorlese-text.ts'

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

console.log('\n— Blockarten —')

const probe = vorleseAbschnitte([
  { type: 'heading', level: 2, text: 'Der Rechenweg' },
  { type: 'paragraph', text: 'Ein **fetter** Satz ohne Schlusspunkt' },
  { type: 'list', ordered: true, items: ['erster Punkt.', 'zweiter Punkt.'] },
  {
    type: 'formula',
    expression: 'σ = √(Σ(x−μ)²÷n)',
    description: 'Die Streuung um den Mittelwert.',
  },
  {
    type: 'table',
    caption: 'Marken.',
    head: ['Marke', 'Herkunft'],
    rows: [['61,8 %', 'Zahl durch die nächste']],
  },
  { type: 'quote', text: 'Der Preis ist, was du zahlst.', source: 'Warren Buffett' },
  { type: 'keyfacts', items: [{ label: 'Risiko', value: 'hoch' }] },
])

pruefe(
  'Fettauszeichnung wird nicht mitgesprochen',
  probe.every((a) => !a.includes('**')),
  probe.find((a) => a.includes('**'))
)
pruefe(
  'ein Absatz ohne Schlusspunkt bekommt einen',
  probe.some((a) => a === 'Ein fetter Satz ohne Schlusspunkt.')
)
pruefe(
  'nummerierte Punkte werden angesagt',
  probe.some((a) => a.startsWith('Erstens:')) &&
    probe.some((a) => a.startsWith('Zweitens:'))
)
pruefe(
  'die Formel wird nicht als Zeichenfolge gesprochen',
  probe.every((a) => !a.includes('√') && !a.includes('σ')),
  probe.find((a) => a.includes('√'))
)
pruefe(
  'ihre Erläuterung dagegen schon',
  probe.some((a) => a.includes('Die Streuung um den Mittelwert.'))
)
pruefe(
  'Tabellenzellen tragen ihre Spaltenüberschrift',
  probe.some(
    (a) => a.includes('Marke: 61,8 %') && a.includes('Herkunft: Zahl durch die nächste')
  )
)
pruefe(
  'das Zitat nennt die Quelle',
  probe.some((a) => a.includes('Warren Buffett'))
)
pruefe('Faktenzeilen werden als Paar gelesen', probe.includes('Risiko: hoch.'))

console.log('\n— Grafiken —')

const mitGrafik = vorleseAbschnitte([{ type: 'figure', figure: 'ta-macd' }], figureMeta)
pruefe(
  'eine Grafik wird über ihre Vorlesefassung gesprochen',
  mitGrafik.length === 1 && mitGrafik[0].startsWith('Grafik:'),
  mitGrafik.join(' | ')
)
pruefe(
  'ohne Verzeichnis entsteht keine Stille mit leerem Abschnitt',
  vorleseAbschnitte([{ type: 'figure', figure: 'ta-macd' }]).length === 0
)

console.log('\n— Über die echten Lektionen —')

/*
  Jede Lektion muss vorlesbar sein und darf keine leeren Abschnitte
  enthalten. Das prüft nebenbei, dass keine künftige Blockart stumm
  verschluckt wird, ohne dass es auffällt.
*/
const leere: string[] = []
let gesamt = 0
for (const lektion of technischeAnalyseLektionen) {
  const abschnitte = vorleseAbschnitte(lektion.inhalt, figureMeta)
  gesamt += abschnitte.length
  if (abschnitte.length < 5) leere.push(lektion.slug)
  if (abschnitte.some((a) => a.trim() === '')) leere.push(`${lektion.slug} (leer)`)
}
pruefe(
  'jede Lektion der technischen Analyse ergibt mindestens fünf Abschnitte',
  leere.length === 0,
  leere.join(', ')
)
pruefe(`insgesamt entsteht Gesprochenes (${gesamt} Abschnitte)`, gesamt > 200)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
