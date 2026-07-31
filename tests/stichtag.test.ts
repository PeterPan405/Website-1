/**
 * Prüfungen für die Stichtagswerte.
 *
 * Der Fehler, um den es geht, ist der leiseste, den diese Website kennt: eine
 * Zahl, die richtig war und es zu einem vorhersehbaren Termin nicht mehr ist.
 * Kein Build bricht ab, keine Prüfung wird rot, das Ergebnis stimmt trotzdem
 * nicht mehr.
 */

import { geltungssatz, ueberholt, type GeprueferterWert } from '../lib/stichtag.ts'

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

function wert(teil: Partial<GeprueferterWert> = {}): GeprueferterWert {
  return {
    id: 'test',
    bezeichnung: 'Ein Wert',
    gilt: 2025,
    turnus: 'jaehrlich',
    pflege: 'Steht im Bundessteuerblatt.',
    ...teil,
  }
}

console.log('\n— Was ueberholt ist —')

pruefe(
  'ein jaehrlicher Wert aus dem Vorjahr ist ueberholt',
  ueberholt([wert({ gilt: 2025 })], 2026).length === 1
)
pruefe('im selben Jahr nicht', ueberholt([wert({ gilt: 2026 })], 2026).length === 0)
/*
  Ein Wert, der schon fuer das kommende Jahr bekanntgegeben wurde, ist nicht
  ueberholt, sondern voraus. Das kommt vor: Manche Bekanntmachungen erscheinen
  im Dezember.
*/
pruefe(
  'ein Wert fuer das kommende Jahr auch nicht',
  ueberholt([wert({ gilt: 2027 })], 2026).length === 0
)

/*
  Der Kern der Unterscheidung: Ein Betrag aus dem Gesetz laeuft nicht ab. Der
  Sparerpauschbetrag steht seit 2023 bei 1.000 Euro und ist 2026 genauso
  richtig. Wer ihn als „ueberholt“ meldet, erzeugt eine Warnung, die niemand
  abstellen kann — und drei davon spaeter liest niemand mehr hin.
*/
pruefe(
  'unbestimmte Werte laufen nie ab',
  ueberholt([wert({ gilt: 2023, turnus: 'unbestimmt' })], 2030).length === 0
)

pruefe(
  'der Abstand wird mitgegeben',
  ueberholt([wert({ gilt: 2023 })], 2026)[0]?.jahreZurueck === 3
)

pruefe(
  'der aelteste steht vorn',
  ueberholt([wert({ id: 'neu', gilt: 2025 }), wert({ id: 'alt', gilt: 2022 })], 2026)[0]
    ?.wert.id === 'alt'
)

pruefe('nichts zu melden bei leerer Liste', ueberholt([], 2026).length === 0)

console.log('\n— Der Satz beim Wert —')

pruefe(
  'im Geltungsjahr ohne Warnung',
  geltungssatz('Basiszins', 2026, '2,53 Prozent', 2026) ===
    'Basiszins: für 2026 bekanntgegeben mit 2,53 Prozent.'
)

{
  const satz = geltungssatz('Basiszins', 2025, '2,53 Prozent', 2026)
  pruefe('danach mit Jahr', satz.includes('zuletzt für 2025'))
  pruefe('und mit dem Hinweis', satz.includes('Für 2026 liegt hier noch kein Wert vor'))
  /*
    Der Wert selbst bleibt im Satz stehen. Ihn wegzulassen waere die
    naheliegende Reaktion und die falsche: Ein Rechner ohne Vorbelegung ist
    unbenutzbar, und der Wert des Vorjahres ist die beste verfuegbare
    Naeherung — solange danebensteht, dass er es ist.
  */
  pruefe('der Wert bleibt sichtbar', satz.includes('2,53 Prozent'))
}

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
