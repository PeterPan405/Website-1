/**
 * Alle Bereiche und Lektionen der Akademie an einer Stelle.
 *
 * Die Prüfungen liegen bewusst nicht hier, sondern in `lib/akademie.ts`: In
 * diesem Projekt dürfen Daten nichts über die Dienstschicht wissen, und die
 * Prüfungen brauchen die Rechner- und Lernthemenlisten.
 */

import {
  anlegerverhalten,
  anlegerverhaltenLektionen,
} from '@/data/akademie/anlegerverhalten'
import {
  fundamentalanalyse,
  fundamentalanalyseLektionen,
} from '@/data/akademie/fundamentalanalyse'
import { makroanalyse, makroanalyseLektionen } from '@/data/akademie/makroanalyse'
import {
  portfoliotheorie,
  portfoliotheorieLektionen,
} from '@/data/akademie/portfoliotheorie'
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
 *
 * Danach die drei Zweige, die keine einzelne Anlage beurteilen, sondern das
 * Drumherum: die Zusammensetzung des Depots, die Lage der Wirtschaft und das
 * eigene Verhalten. Sie stehen hinten, weil sie sich leichter erschließen,
 * wenn die Begriffe der ersten beiden sitzen – und das Anlegerverhalten ganz
 * zum Schluss, weil es die Annahmen der übrigen vier in Frage stellt.
 */
export const bereiche: Bereich[] = [
  technischeAnalyse,
  fundamentalanalyse,
  portfoliotheorie,
  makroanalyse,
  anlegerverhalten,
]

export const lektionen: Lektion[] = [
  ...technischeAnalyseLektionen,
  ...fundamentalanalyseLektionen,
  ...portfoliotheorieLektionen,
  ...makroanalyseLektionen,
  ...anlegerverhaltenLektionen,
]

export type { Bereich, BereichId, Belegart, Lektion } from '@/data/akademie/types'
export { belegarten } from '@/data/akademie/types'
