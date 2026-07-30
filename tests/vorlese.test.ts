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
import {
  bevorzugteStimme,
  klingtMaennlich,
  klingtNatuerlich,
  vorleseAbschnitte,
} from '../lib/vorlese-text.ts'

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

console.log('\n— Stimmwahl —')

/*
  Die Voreinstellung soll eine Männerstimme nehmen, wo es eine gibt – die
  Schnittstelle kennt kein Geschlecht, erkannt wird es am Namen. Geprüft wird
  die Rangfolge und die Falle, dass „female“ das Wort „male“ enthält.
*/
const anna = { name: 'Anna', lang: 'de-DE', voiceURI: 'anna', localService: true }
const conrad = {
  name: 'Microsoft Conrad Online (Natural)',
  lang: 'de-DE',
  voiceURI: 'conrad-netz',
  localService: false,
}
const stefan = { name: 'Stefan', lang: 'de-AT', voiceURI: 'stefan', localService: true }
const englisch = {
  name: 'Daniel',
  lang: 'en-GB',
  voiceURI: 'daniel-en',
  localService: true,
}
const unklarWeiblich = {
  name: 'Voice 3',
  lang: 'de-DE',
  voiceURI: 'de-DE-x-abc#female_2-local',
  localService: true,
}

const googleDeutsch = {
  name: 'Google Deutsch',
  lang: 'de-DE',
  voiceURI: 'google-de',
  localService: false,
}

const martina = {
  name: 'Martina',
  lang: 'de-DE',
  voiceURI: 'martina',
  localService: true,
}
const daniela = {
  name: 'Microsoft Daniela Online (Natural)',
  lang: 'de-AT',
  voiceURI: 'daniela-netz',
  localService: false,
}
const eddy = {
  name: 'Eddy (Deutsch (Deutschland))',
  lang: 'de-DE',
  voiceURI: 'com.apple.eloquence.de-DE.Eddy',
  localService: true,
}

pruefe('ein Männername wird erkannt', klingtMaennlich(stefan))
pruefe('„female“ in der Kennung zählt nicht als „male“', !klingtMaennlich(unklarWeiblich))
/*
  Die Namensfalle: „Martina“ enthält „martin“, „Daniela“ enthält „daniel“.
  Als Teilzeichenkette geprüft wären das Männerstimmen – und die Automatik
  wählte mit Vorrang eine Frauenstimme. Ganze Wörter, nicht Teilwörter.
*/
pruefe('„Martina“ ist keine Männerstimme', !klingtMaennlich(martina))
pruefe('„Daniela“ ist keine Männerstimme', !klingtMaennlich(daniela))
pruefe('Apples „Eddy“ wird erkannt', klingtMaennlich(eddy))
pruefe('„Online (Natural)“ gilt als natürlich', klingtNatuerlich(conrad))
pruefe('„Google Deutsch“ gilt als natürlich', klingtNatuerlich(googleDeutsch))
pruefe('eine schlichte Systemstimme nicht', !klingtNatuerlich(stefan))

/*
  Natürlich schlägt lokal – das ist die Umkehr gegenüber der ersten Fassung
  und der Kern dieser Rangfolge: Die lokalen Stimmen sind die synthetischen.
*/
pruefe(
  'die natürliche Männerstimme schlägt die lokale Männerstimme',
  bevorzugteStimme([anna, stefan, conrad])?.voiceURI === 'conrad-netz'
)
pruefe(
  'die Männerstimme schlägt die natürliche Frauenstimme',
  bevorzugteStimme([anna, googleDeutsch, stefan])?.voiceURI === 'stefan'
)
pruefe(
  'ohne Männerstimme gewinnt die natürliche vor der lokalen',
  bevorzugteStimme([anna, googleDeutsch])?.voiceURI === 'google-de'
)
pruefe(
  'ohne natürliche Stimme gewinnt die lokale Männerstimme',
  bevorzugteStimme([anna, stefan])?.voiceURI === 'stefan'
)
pruefe(
  'ohne Männerstimme bleibt die lokale deutsche',
  bevorzugteStimme([anna, unklarWeiblich])?.voiceURI === 'anna'
)
pruefe(
  'eine englische Männerstimme wird nicht gewählt',
  bevorzugteStimme([englisch]) === null
)
pruefe(
  'die natürliche „Daniela“ schlägt die männliche „Stefan“ nicht',
  bevorzugteStimme([daniela, stefan])?.voiceURI === 'stefan'
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
