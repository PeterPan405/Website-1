import type { Stimmung, Stimmungsstufe } from '@/lib/markets'
import { STUFEN_TEXT } from '@/lib/markets'

/**
 * Der Halbkreis für Angst und Gier.
 *
 * ## Warum die Zeichnung eine eigene Datei hat
 *
 * Sie wird an zwei Stellen gebraucht: klein in der Kachelreihe der Marktseite
 * und groß auf der Seite, die sich beim Anklicken öffnet. Zweimal gezeichnet
 * wären es zwei Tachos, die dieselbe Zahl verschieden darstellen können –
 * etwa, weil jemand eine Farbgrenze nur an einer Stelle verschiebt.
 *
 * ## Warum von Hand gezeichnet
 *
 * Dieselbe Entscheidung wie bei den Erklärgrafiken im Lernbereich: Ein SVG im
 * Markup kennt die Themefarben, skaliert ohne Unschärfe, braucht keine
 * Bibliothek im Bundle und lässt sich beschreiben. Ein Bild könnte nichts
 * davon.
 *
 * Die Grafik ist `aria-hidden`; wer sie verwendet, muss dieselbe Aussage
 * daneben als Satz ausgeben. Ein Zeigerdiagramm ist für Screenreader nichts,
 * und „Tacho auf 20“ hilft auch sehenden Menschen wenig, wenn nicht
 * dabeisteht, was 20 bedeutet.
 */

const RADIUS = 84
const MITTE_X = 110
const MITTE_Y = 104
const STRICH = 18

/*
  Fünf Bögen, fünf Farben – dieselben Grenzen wie in `stufeFuer`.

  Die Zahlen stehen hier noch einmal, weil der Bogen sie als Winkel braucht;
  geändert werden dürfen sie nur gemeinsam mit der Rechnung. Deshalb liegen sie
  nebeneinander und nicht in zwei Dateien.
*/
export const BOEGEN: {
  von: number
  bis: number
  farbe: string
  stufe: Stimmungsstufe
}[] = [
  { von: 0, bis: 25, farbe: 'var(--c-danger)', stufe: 'extreme-angst' },
  { von: 25, bis: 45, farbe: 'var(--c-stimmung-angst)', stufe: 'angst' },
  { von: 45, bis: 55, farbe: 'var(--c-stimmung-neutral)', stufe: 'neutral' },
  { von: 55, bis: 75, farbe: 'var(--c-stimmung-gier)', stufe: 'gier' },
  { von: 75, bis: 100, farbe: 'var(--c-success)', stufe: 'extreme-gier' },
]

/** Die Farbe, die zu einer Stufe gehört – auch außerhalb des Tachos gebraucht. */
export function farbeFuerStufe(stufe: Stimmungsstufe): string {
  return BOEGEN.find((bogen) => bogen.stufe === stufe)?.farbe ?? 'var(--c-fg-subtle)'
}

/** Ein Wert von 0 bis 100 als Punkt auf dem Halbkreis. */
function punkt(wert: number, radius: number): { x: number; y: number } {
  // 0 liegt links (180°), 100 rechts (0°).
  const winkel = Math.PI * (1 - wert / 100)
  return {
    x: MITTE_X + Math.cos(winkel) * radius,
    y: MITTE_Y - Math.sin(winkel) * radius,
  }
}

function bogen(von: number, bis: number, radius: number): string {
  const a = punkt(von, radius)
  const b = punkt(bis, radius)
  // Immer der kurze Weg: Kein Abschnitt umfasst mehr als einen Halbkreis.
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${radius} ${radius} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`
}

export function Tacho({
  stimmung,
  className = 'h-auto w-[150px]',
  /** Beschriftet die Skalenenden – nur sinnvoll, wo Platz dafür ist. */
  mitSkala = false,
}: {
  stimmung: Stimmung
  className?: string
  mitSkala?: boolean
}) {
  const zeiger = punkt(stimmung.wert, RADIUS)
  const stufentext = STUFEN_TEXT[stimmung.stufe]

  return (
    <svg
      viewBox={`0 0 220 ${mitSkala ? 140 : 124}`}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {BOEGEN.map((abschnitt) => (
        <path
          key={abschnitt.stufe}
          d={bogen(abschnitt.von, abschnitt.bis, RADIUS)}
          fill="none"
          stroke={abschnitt.farbe}
          strokeWidth={STRICH}
          strokeLinecap="butt"
          /* Nur der zutreffende Abschnitt leuchtet. Alle in voller Farbe wären
             ein Farbkreis, auf dem der Zeiger untergeht. */
          opacity={abschnitt.stufe === stimmung.stufe ? 1 : 0.28}
        />
      ))}

      <circle
        cx={zeiger.x}
        cy={zeiger.y}
        r={9}
        fill="var(--c-surface)"
        stroke="var(--c-fg)"
        strokeWidth={3}
      />

      <text
        x={MITTE_X}
        y={MITTE_Y - 10}
        textAnchor="middle"
        className="fill-[var(--c-fg)] text-[38px] font-bold tabular-nums"
      >
        {stimmung.wert}
      </text>
      <text
        x={MITTE_X}
        y={MITTE_Y + 14}
        textAnchor="middle"
        className="fill-[var(--c-fg-subtle)] text-[14px] font-medium"
      >
        {stufentext}
      </text>

      {mitSkala && (
        <>
          <text
            x={MITTE_X - RADIUS}
            y={MITTE_Y + 32}
            textAnchor="middle"
            className="fill-[var(--c-fg-subtle)] text-[12px]"
          >
            0
          </text>
          <text
            x={MITTE_X + RADIUS}
            y={MITTE_Y + 32}
            textAnchor="middle"
            className="fill-[var(--c-fg-subtle)] text-[12px]"
          >
            100
          </text>
        </>
      )}
    </svg>
  )
}
