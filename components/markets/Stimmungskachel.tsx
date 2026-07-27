import type { Stimmung, Stimmungsstufe } from '@/lib/markets'
import { STUFEN_TEXT } from '@/lib/markets'

/**
 * Angst und Gier als Halbkreis, in Kursgröße.
 *
 * ## Warum von Hand gezeichnet
 *
 * Dieselbe Entscheidung wie bei den Erklärgrafiken im Lernbereich: Ein SVG im
 * Markup kennt die Themefarben, skaliert ohne Unschärfe, braucht keine
 * Bibliothek im Bundle und lässt sich mit `<title>` und `<desc>` beschreiben.
 * Ein Bild könnte nichts davon.
 *
 * ## Warum die Zahl auch im Text steht
 *
 * Die Grafik ist `aria-hidden`; darunter steht dasselbe als Satz. Ein
 * Zeigerdiagramm ist für Screenreader nichts, und „Tacho auf 20“ hilft auch
 * sehenden Menschen wenig, wenn nicht dabeisteht, was 20 bedeutet.
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
const BOEGEN: { von: number; bis: number; farbe: string; stufe: Stimmungsstufe }[] = [
  { von: 0, bis: 25, farbe: 'var(--c-danger)', stufe: 'extreme-angst' },
  { von: 25, bis: 45, farbe: 'var(--c-stimmung-angst)', stufe: 'angst' },
  { von: 45, bis: 55, farbe: 'var(--c-stimmung-neutral)', stufe: 'neutral' },
  { von: 55, bis: 75, farbe: 'var(--c-stimmung-gier)', stufe: 'gier' },
  { von: 75, bis: 100, farbe: 'var(--c-success)', stufe: 'extreme-gier' },
]

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

/**
 * Der Tacho als Kachel in Kursgröße.
 *
 * Über die volle Breite wirkte er wie die Hauptaussage der Seite – dabei ist er
 * eine Kennzahl unter vielen. In der Kachelreihe steht er da, wo er hingehört:
 * neben Hang Seng und Russell 2000, gleich groß, gleich gewichtet.
 *
 * Was dabei wegfällt, sind die Balken der einzelnen Bestandteile. Die Aufzählung
 * bleibt trotzdem – als Satz, nicht als Grafik. Eine Zahl ohne Angabe, woraus
 * sie entsteht, hätte auf dieser Seite nichts zu suchen.
 */
export function Stimmungskachel({
  stimmung,
  titel,
}: {
  stimmung: Stimmung
  titel: string
}) {
  const zeiger = punkt(stimmung.wert, RADIUS)
  const stufentext = STUFEN_TEXT[stimmung.stufe]
  const teile = stimmung.bestandteile.map((teil) => teil.label.toLowerCase()).join(', ')

  return (
    <div className="fk-card flex h-full flex-col p-5">
      <h3 className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
        {titel}
      </h3>

      <div className="mt-2 flex justify-center">
        <svg
          viewBox="0 0 220 124"
          className="h-auto w-[150px]"
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
        </svg>
      </div>

      {/* Dieselbe Aussage als Satz – das Diagramm ist aria-hidden. */}
      <p className="text-fg-subtle mt-auto pt-3 text-xs leading-relaxed">
        <span className="text-fg font-semibold">
          {stimmung.wert} von 100 – {stufentext}.
        </span>{' '}
        Gerechnet aus {teile} der Kurse dieser Seite.
      </p>
    </div>
  )
}
