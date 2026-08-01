import Link from 'next/link'

import { brancheSlug } from '@/lib/branchen'
import { formatPercentSigned } from '@/lib/format'
import type { Branchenbewegung } from '@/lib/marktbericht'

/**
 * Die Branchenbewegung des Tages als Farbfeld-Raster.
 *
 * ## Warum gleich große Kacheln und kein Treemap
 *
 * Ein Treemap skaliert die Fläche nach Marktgewicht – das Gewicht gibt es
 * hier nicht: Der Schnitt je Branche ist ungewichtet, und eine Fläche, die
 * Gewicht suggeriert, wo keines gerechnet wird, wäre eine Zeichnung, die
 * mehr behauptet als die Zahl darunter. Gleich große Kacheln, sortiert von
 * stark nach schwach, zeigen genau das, was gerechnet wurde.
 *
 * ## Farbe
 *
 * Die Tönung skaliert mit dem Betrag des Schnitts **relativ zum stärksten
 * Ausschlag des Tages** – an einem ruhigen Tag bleiben die Kacheln blass,
 * und das ist die richtige Auskunft. Gemischt wird per `color-mix` aus den
 * Kursfarben und dem Flächengrund, gedeckelt bei 30 Prozent, damit die
 * Schrift in beiden Farbschemata lesbar bleibt (die Kontrastprüfung misst
 * die gebauten Seiten). Die Zahl steht immer dabei – Farbe ist hier
 * Verstärkung, nie einzige Auskunft.
 */
export function BranchenHeatmap({ branchen }: { branchen: Branchenbewegung[] }) {
  const staerkster = Math.max(...branchen.map((branche) => Math.abs(branche.schnitt)), 0)

  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {branchen.map((branche) => {
        const anteil =
          staerkster > 0 ? Math.round((Math.abs(branche.schnitt) / staerkster) * 30) : 0
        const farbe = branche.schnitt >= 0 ? '--c-success' : '--c-danger'
        return (
          <li key={branche.name}>
            <Link
              href={`/maerkte/branchen/${brancheSlug(branche.name)}`}
              className="border-border hover:border-border-strong block h-full rounded-xl border p-3 transition-colors"
              style={{
                backgroundColor: `color-mix(in oklab, var(${farbe}) ${anteil}%, var(--c-surface-muted))`,
              }}
            >
              <span className="text-fg block truncate text-sm font-medium">
                {branche.name}
              </span>
              <span className="text-fg mt-1 block text-lg font-bold tabular-nums">
                {formatPercentSigned(branche.schnitt)}
              </span>
              <span className="text-fg-muted block text-xs">{branche.titel} Titel</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
