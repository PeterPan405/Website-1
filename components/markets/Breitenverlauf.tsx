import { formatDateShort } from '@/lib/format'
import type { Breitenpunkt } from '@/lib/marktbreite'

/**
 * Der Verlauf der Marktbreite als Linie.
 *
 * ## Warum reines SVG
 *
 * Aus demselben Grund wie beim Dividendenverlauf: Die Daten stehen zur Bauzeit
 * fest und ändern sich beim Betrachten nicht. Eine Diagrammbibliothek wäre eine
 * Client-Komponente und brächte hier über hundert Kilobyte JavaScript mit, um
 * eine Linie zu zeichnen.
 *
 * ## Warum die 50-Prozent-Linie eingezeichnet ist
 *
 * Weil sie die einzige Marke ist, die etwas bedeutet. Bei 50 Prozent ist der
 * Markt geteilt: Genauso viele Titel laufen mit der Richtung wie gegen sie.
 * Alles darüber heißt getragen, alles darunter heißt von wenigen Werten
 * geschoben. Ohne diese Linie ist eine Kurve zwischen 40 und 60 nur eine
 * Zackenlinie.
 */

const BREITE = 640
const HOEHE = 180
const RAND_UNTEN = 22
const RAND_OBEN = 8

export function Breitenverlauf({ reihe }: { reihe: readonly Breitenpunkt[] }) {
  if (reihe.length < 2) return null

  const zeichenhoehe = HOEHE - RAND_UNTEN - RAND_OBEN

  /*
    Die Achse geht immer von 0 bis 100 und nicht von Minimum bis Maximum.

    Eine gestauchte Achse macht aus einer Schwankung zwischen 47 und 53 Prozent
    ein Gebirge. Genau das ist der übliche Weg, eine belanglose Bewegung
    bedeutend aussehen zu lassen – und diese Seite ist dafür da, das Gegenteil
    zu tun.
  */
  const x = (index: number) => (index / (reihe.length - 1)) * BREITE
  const y = (wert: number) => RAND_OBEN + (1 - wert / 100) * zeichenhoehe

  const pfad = reihe
    .map(
      (punkt, index) =>
        `${index === 0 ? 'M' : 'L'}${x(index).toFixed(1)} ${y(punkt.breite).toFixed(1)}`
    )
    .join(' ')

  const erster = reihe[0]
  const letzter = reihe[reihe.length - 1]

  return (
    <figure className="mt-6">
      <svg
        viewBox={`0 0 ${BREITE} ${HOEHE}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Verlauf der Marktbreite über ${reihe.length} Handelstage, zuletzt ${Math.round(letzter.breite)} Prozent`}
      >
        {/* Die Marke, an der ein Markt geteilt ist. */}
        <line
          x1={0}
          x2={BREITE}
          y1={y(50)}
          y2={y(50)}
          stroke="var(--color-border-strong)"
          strokeDasharray="4 4"
          strokeWidth={1}
        />
        <text x={4} y={y(50) - 5} className="fill-fg-subtle" style={{ fontSize: 11 }}>
          50 % – geteilt
        </text>

        <path d={pfad} fill="none" stroke="var(--color-markets)" strokeWidth={2} />

        {/* Der jüngste Tag als Punkt, damit das Ende der Linie ablesbar ist. */}
        <circle
          cx={x(reihe.length - 1)}
          cy={y(letzter.breite)}
          r={3.5}
          fill="var(--color-markets)"
        />

        <text x={0} y={HOEHE - 6} className="fill-fg-subtle" style={{ fontSize: 11 }}>
          {formatDateShort(erster.d)}
        </text>
        <text
          x={BREITE}
          y={HOEHE - 6}
          textAnchor="end"
          className="fill-fg-subtle"
          style={{ fontSize: 11 }}
        >
          {formatDateShort(letzter.d)}
        </text>
      </svg>
      <figcaption className="text-fg-subtle mt-2.5 text-sm leading-relaxed">
        Die Marktbreite über {reihe.length} aufgezeichnete Handelstage. Die Skala reicht
        immer von 0 bis 100 Prozent – eine gestauchte Achse ließe jede Schwankung
        bedeutend aussehen.
      </figcaption>
    </figure>
  )
}
