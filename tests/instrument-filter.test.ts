/**
 * Prüfungen für die Instrumentensuche.
 *
 * Ausführen mit `npm test`.
 *
 * Geprüft wird vor allem die **Reihenfolge**. Ob ein Eintrag überhaupt passt,
 * ist die leichte Frage; ob der gemeinte oben steht, entscheidet darüber, ob
 * die Suche etwas taugt. Wer „app“ tippt, will Apple – und nicht erst an
 * „Applied Materials“ vorbei.
 */

import { bewerte, filtere, type Suchbar } from '../lib/instrument-filter.ts'

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

const katalog: Suchbar[] = [
  { symbol: 'apple', name: 'Apple', ticker: 'AAPL', branche: 'Unterhaltungselektronik' },
  {
    symbol: 'applied-materials',
    name: 'Applied Materials',
    ticker: 'AMAT',
    branche: 'Halbleiter',
  },
  { symbol: 'amd', name: 'Advanced Micro Devices', ticker: 'AMD', branche: 'Halbleiter' },
  { symbol: 'sap', name: 'SAP', ticker: 'SAP', branche: 'Software' },
  { symbol: 'nvidia', name: 'NVIDIA', ticker: 'NVDA', branche: 'Halbleiter' },
  { symbol: 'nestle', name: 'Nestlé', ticker: 'NESN.SW', branche: 'Nahrungsmittel' },
  { symbol: 'aac', name: 'AAC Technologies', ticker: '2018.HK', branche: 'Elektronik' },
]

const namen = (eingabe: string) => filtere(katalog, eingabe).map((e) => e.name)

// ------------------------------------------------------------------ Rangfolge

check('genaues Kürzel steht vorn', namen('AMD')[0], 'Advanced Micro Devices')
check('Namensanfang schlägt Namensmitte', namen('app'), ['Apple', 'Applied Materials'])
/*
  Der Fall, an dem sich zeigt, ob die Rangfolge etwas taugt: „amat“ ist ein
  Kürzel, „Applied Materials“ der Name dazu. Ohne Kürzelabgleich fände man den
  Titel über sein eigenes Börsenkürzel nicht.
*/
check('Kürzelanfang findet den Titel', namen('amat')[0], 'Applied Materials')
check('ein Wort mitten im Namen zählt', namen('micro')[0], 'Advanced Micro Devices')

check('Teilzeichenkette im Namen zählt', namen('vidia')[0], 'NVIDIA')

// ------------------------------------------------------------------- Schreibung

check('Groß- und Kleinschreibung ist egal', namen('sap')[0], 'SAP')
/*
  Akzente und Umlaute werden vereinheitlicht – wer „nestle“ auf einer deutschen
  Tastatur tippt, hat nicht vor, das é zu suchen.
*/
check('Akzente werden vereinheitlicht', namen('nestle')[0], 'Nestlé')
check('und andersherum genauso', namen('nestlé')[0], 'Nestlé')

// -------------------------------------------------------------------- Branche

/*
  Die Branche findet, steht aber hinten an. Wer „Halbleiter“ tippt, sucht eine
  Auswahl; wer ein Kürzel tippt, sucht einen Titel. Beides in einer Liste, aber
  nicht in derselben Reihenfolge.
*/
const halbleiter = namen('halbleiter')
check('Branche findet alle drei', halbleiter.length, 3)
check('Branche findet die richtigen', [...halbleiter].sort(), [
  'Advanced Micro Devices',
  'Applied Materials',
  'NVIDIA',
])
check(
  'ein Namenstreffer schlägt einen Branchentreffer',
  bewerte(katalog[1], 'applied')! < bewerte(katalog[1], 'halbleiter')!,
  true
)

// ---------------------------------------------------------------- Randfälle

check('leere Eingabe zeigt alles', filtere(katalog, '').length, 7)
check('leere Eingabe sortiert alphabetisch', namen('')[0], 'AAC Technologies')
check('nur Leerzeichen zählt als leer', filtere(katalog, '   ').length, 7)
check('was nicht passt, kommt nicht', namen('xyzzy'), [])
check('kein Treffer gibt null', bewerte(katalog[0], 'xyzzy'), null)

/*
  Die Grenze ist der eigentliche Zweck: Eine Liste mit hundert Zeilen hat
  dasselbe Problem wie das Klappmenü, das sie ersetzt.
*/
check('die Grenze wird eingehalten', filtere(katalog, '', 3).length, 3)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfungen fehlgeschlagen.`
)
if (failed > 0) process.exit(1)
