/**
 * Alle Bereiche und Lektionen der Akademie an einer Stelle.
 *
 * Die Prüfungen liegen bewusst nicht hier, sondern in `lib/akademie.ts`: In
 * diesem Projekt dürfen Daten nichts über die Dienstschicht wissen, und die
 * Prüfungen brauchen die Rechner- und Lernthemenlisten.
 */

import {
  fundamentalanalyse,
  fundamentalanalyseLektionen,
} from '@/data/akademie/fundamentalanalyse'
import {
  technischeAnalyse,
  technischeAnalyseLektionen,
} from '@/data/akademie/technische-analyse'
import type { Bereich, Lektion } from '@/data/akademie/types'

/**
 * Die Reihenfolge der Bereiche.
 *
 * Technische Analyse zuerst, nicht aus Vorliebe: Sie ist der Zweig, über den
 * die meisten stolpern, weil die Begriffe in jeder Börsenmeldung vorkommen.
 * Die Fundamentalanalyse braucht mehr Vorwissen und mehr Geduld – wer sie
 * zuerst aufschlägt, hört bei der Kapitalflussrechnung auf.
 */
export const bereiche: Bereich[] = [technischeAnalyse, fundamentalanalyse]

export const lektionen: Lektion[] = [
  ...technischeAnalyseLektionen,
  ...fundamentalanalyseLektionen,
]

export type { Bereich, BereichId, Belegart, Lektion } from '@/data/akademie/types'
export { belegarten } from '@/data/akademie/types'
