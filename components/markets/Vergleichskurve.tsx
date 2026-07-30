import { formatDateShort, formatNumber } from '@/lib/format'
import { normiere, spanne, type Kurspunkt } from '@/lib/normierung'

/**
 * Zwei Kursverläufe, beide auf 100 gesetzt.
 *
 * ## Was die Tabelle verschweigt
 *
 * Sie sagt, dass ein Titel über fünf Jahre 130 Prozent zugelegt hat und der
 * andere 40. Sie sagt nicht, **wann**. Ein Titel, der vier Jahre nichts tat
 * und dann in zwei Monaten sprang, hat dieselbe Fünfjahreszahl wie einer, der
 * stetig lief – und wer beide hält, hat sehr verschiedene Jahre hinter sich.
 *
 * ## Warum reines SVG
 *
 * Wie überall in diesem Projekt: Die Daten stehen zur Bauzeit fest. Eine
 * Diagrammbibliothek wäre eine Client-Komponente und brächte über hundert
 * Kilobyte JavaScript mit, um zwei Linien zu zeichnen.
 */

const BREITE = 680
const HOEHE = 260
const RAND_UNTEN = 24
const RAND_OBEN = 10

export function Vergleichskurve({
  links,
  rechts,
  namelinks,
  namerechts,
}: {
  links: readonly Kurspunkt[]
  rechts: readonly Kurspunkt[]
  namelinks: string
  namerechts: string
}) {
  const werte = normiere(links, rechts)
  if (!werte || werte.links.length < 2) return null

  const grenzen = spanne(werte)
  /*
    Die Achse bekommt oben und unten etwas Luft, und die 100er-Linie liegt
    immer im Bild. Ohne sie fehlte der Bezugspunkt: Eine Kurve zwischen 118 und
    132 sieht ohne die Marke bei 100 aus wie eine Halbierung.
  */
  const min = Math.min(grenzen.min, 100) * 0.97
  const max = Math.max(grenzen.max, 100) * 1.03
  const hoehe = HOEHE - RAND_UNTEN - RAND_OBEN

  const x = (index: number, laenge: number) =>
    laenge <= 1 ? 0 : (index / (laenge - 1)) * BREITE
  const y = (wert: number) => RAND_OBEN + (1 - (wert - min) / (max - min)) * hoehe

  const pfad = (punkte: readonly Kurspunkt[]) =>
    punkte
      .map(
        (punkt, index) =>
          `${index === 0 ? 'M' : 'L'}${x(index, punkte.length).toFixed(1)} ${y(punkt.value).toFixed(1)}`
      )
      .join(' ')

  const endeLinks = werte.links[werte.links.length - 1]
  const endeRechts = werte.rechts[werte.rechts.length - 1]

  return (
    <figure className="mt-8">
      <svg
        viewBox={`0 0 ${BREITE} ${HOEHE}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Wertentwicklung ab ${werte.ab}, beide auf 100 gesetzt: ${namelinks} steht bei ${Math.round(endeLinks.value)}, ${namerechts} bei ${Math.round(endeRechts.value)}.`}
      >
        <line
          x1={0}
          x2={BREITE}
          y1={y(100)}
          y2={y(100)}
          stroke="var(--color-border-strong)"
          strokeDasharray="4 4"
          strokeWidth={1}
        />
        <text x={4} y={y(100) - 5} className="fill-fg-subtle" style={{ fontSize: 11 }}>
          100 – Stand am {formatDateShort(werte.ab)}
        </text>

        <path
          d={pfad(werte.rechts)}
          fill="none"
          stroke="var(--color-fg-subtle)"
          strokeWidth={2}
        />
        <path
          d={pfad(werte.links)}
          fill="none"
          stroke="var(--color-markets)"
          strokeWidth={2}
        />

        <text x={0} y={HOEHE - 6} className="fill-fg-subtle" style={{ fontSize: 11 }}>
          {formatDateShort(werte.ab)}
        </text>
        <text
          x={BREITE}
          y={HOEHE - 6}
          textAnchor="end"
          className="fill-fg-subtle"
          style={{ fontSize: 11 }}
        >
          {formatDateShort(werte.links[werte.links.length - 1].t)}
        </text>
      </svg>

      <figcaption className="text-fg-subtle mt-3 text-sm leading-relaxed">
        <span className="text-markets font-medium">{namelinks}</span> steht bei{' '}
        {formatNumber(endeLinks.value, 0)},{' '}
        <span className="text-fg font-medium">{namerechts}</span> bei{' '}
        {formatNumber(endeRechts.value, 0)} – beide beginnen am{' '}
        {formatDateShort(werte.ab)} bei 100. Normiert wird auf den ersten Tag, den beide
        haben; wer jede Reihe bei ihrem eigenen Anfang beginnen ließe, verglich
        verschiedene Zeiträume. Ohne Dividenden.
      </figcaption>
    </figure>
  )
}
