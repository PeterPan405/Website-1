/**
 * Objektiv, ohne Position – die Grenze, und ob sie überhaupt anschlägt.
 *
 * Ausführen mit `npm test`.
 *
 * ## Der Anlass
 *
 * Der Betreiber hat am 16. September 2026 zum Podcast gesagt: „aber alles
 * objektiv ohne positionierung oder meinung". Seither steht diese Anweisung
 * im Prompt – in `scripts/nachrichten-erzeugen.ts` und in
 * `nachrichten-agent.yml`.
 *
 * Eine Anweisung an ein Modell ist eine Bitte, keine Zusage. Dieselbe Lehre
 * wie bei den geplanten Läufen: Was zugesichert sein soll, darf nicht allein
 * daran hängen. `positionierungen()` in `lib/editions-validate.ts` ist die
 * Grenze dazu, und diese Datei prüft sie von **beiden** Seiten.
 *
 * ## Warum die Gegenprobe hier die eigentliche Prüfung ist
 *
 * Über alle 47 Ausgaben vom 16. September 2026 findet die Regel **keinen
 * einzigen** Treffer in `summary`. Das ist die gute Nachricht und zugleich
 * das Problem: Eine Absicherung, die nie anschlägt, sieht aus wie Ruhe. Ob
 * sie arbeitet, lässt sich am Bestand nicht ablesen – nur daran, dass man ihr
 * etwas vorlegt, das sie beanstanden **muss**.
 *
 * Deshalb stehen unten zwei Listen: Sätze, die durchgehen müssen, und Sätze,
 * die hängenbleiben müssen. Die zweite ist die wichtigere.
 */

import { positionierungen } from '@/lib/editions-validate'

let failed = 0
function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/* --------------------------------------------- Muss beanstandet werden */

const VERBOTEN: [string, string][] = [
  ['Anlageberatung im Klartext', 'Anleger sollten Anleger jetzt kaufen.'],
  ['Empfehlung an den Hörer', 'Wer den Einstieg sucht, sollte man hier zugreifen.'],
  ['Kaufempfehlung benannt', 'Die Bank sprach eine Kaufempfehlung aus – jetzt kaufen.'],
  ['Schnäppchen', 'Nach dem Rücksetzer ist das Papier ein Schnäppchen.'],
  ['Einstiegsgelegenheit', 'Der Rücksetzer ist eine Einstiegsgelegenheit.'],
  ['klarer Kauf', 'Für die Analysten ist das ein klarer Kauf.'],
  ['eigene Meinung, erste Person', 'Meiner Meinung nach war die Reaktion übertrieben.'],
  [
    'eigene Meinung, Redaktions-Wir',
    'Wir erwarten für das vierte Quartal eine Erholung.',
  ],
  ['ich glaube', 'Ich glaube, die Notenbank wartet noch eine Sitzung ab.'],
]

for (const [was, satz] of VERBOTEN) {
  const gefunden = positionierungen(satz)
  pruefen(
    `beanstandet: ${was}`,
    gefunden.length > 0,
    `„${satz}" ging durch – die Regel greift an diesem Satz nicht.`
  )
}

/* ------------------------------------------------ Muss durchgehen */

/*
  Die Gegenprobe zur Gegenprobe. Eine Wortliste, die zu weit greift, wird
  abgeschaltet statt befolgt – deshalb hier echte Nachrichtensätze, darunter
  die, an denen eine zu grobe Regel anschlagen würde.

  Der vierte und der fünfte sind die heiklen: „sollte" in einer sachlichen
  Erwartung und „halten" als Verb der Notenbank. Beides ist keine Meinung.
*/
const ERLAUBT: [string, string][] = [
  [
    'nackte Zahl',
    'Die Rendite zehnjähriger US-Anleihen stieg über 4,67 Prozent, die der dreißigjährigen über 5,2 Prozent.',
  ],
  [
    'Zitat mit Zuschreibung',
    'Der Vorsitzende erklärte, die Notenbank sei „nicht im Prognosegeschäft".',
  ],
  [
    'militärisches Ereignis, sachlich',
    'Russland griff Ziele in der Westukraine nahe der polnischen Grenze an. Polen meldete eine Verletzung seines Luftraums.',
  ],
  ['sachliche Erwartung mit „sollte"', 'Der Bericht sollte um 14:30 Uhr erscheinen.'],
  ['Notenbank hält still', 'Die Fed dürfte den Leitzins halten, erwartet der Markt.'],
  [
    'Analystenurteil mit Zuschreibung',
    'Die Bank hob das Kursziel an und bestätigte ihre Einstufung.',
  ],
  [
    'Blick lohnt sich – Einordnung, kein Kauf',
    'Ein Blick auf den zweiten Effekt lohnt sich.',
  ],
]

for (const [was, satz] of ERLAUBT) {
  const gefunden = positionierungen(satz)
  pruefen(
    `geht durch: ${was}`,
    gefunden.length === 0,
    `„${satz}" wurde beanstandet als ${gefunden.map((g) => `${g.art} („${g.fund}")`).join(', ')}.`
  )
}

/* ------------------------------------------------- Und der Bestand selbst */

/*
  Alle Ausgaben durch dieselbe Regel. Schlägt sie hier an, ist entweder eine
  Ausgabe zu korrigieren oder die Regel zu eng – beides gehört angesehen und
  nicht weggedrückt.
*/
const { editions } = await import('@/data/editions')
const treffer: string[] = []
for (const edition of editions) {
  for (const item of [...edition.top, ...edition.further]) {
    for (const { art, fund } of positionierungen(item.summary.join(' '))) {
      treffer.push(`${edition.date} „${item.headline}": ${art} – „${fund}"`)
    }
  }
}
pruefen(
  `alle ${editions.length} Ausgaben berichten ohne Positionierung`,
  treffer.length === 0,
  treffer.join('\n     ')
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
