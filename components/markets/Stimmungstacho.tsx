import type { Bestandteil, Stimmung, Stimmungsstufe } from '@/lib/markets'
import { STUFEN_TEXT } from '@/lib/markets'

/**
 * Angst und Gier als Halbkreis.
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

export function Stimmungstacho({
  stimmung,
  titel,
  beschreibung,
}: {
  stimmung: Stimmung
  titel: string
  beschreibung: string
}) {
  const zeiger = punkt(stimmung.wert, RADIUS)
  const stufentext = STUFEN_TEXT[stimmung.stufe]

  return (
    <div className="fk-card p-6">
      <h3 className="text-fg text-lg font-semibold">{titel}</h3>
      <p className="text-fg-muted mt-1 text-sm leading-relaxed">{beschreibung}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-4">
        <svg
          viewBox="0 0 220 124"
          className="h-auto w-[220px] shrink-0"
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
              // Der Abschnitt der aktuellen Stufe bleibt kräftig, die anderen
              // treten zurück – sonst konkurrieren fünf Farben mit dem Zeiger.
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
            y={MITTE_Y - 12}
            textAnchor="middle"
            className="fill-[var(--c-fg)] text-[34px] font-bold tabular-nums"
          >
            {stimmung.wert}
          </text>
          <text
            x={MITTE_X}
            y={MITTE_Y + 12}
            textAnchor="middle"
            className="fill-[var(--c-fg-subtle)] text-[13px] font-medium"
          >
            {stufentext}
          </text>
        </svg>

        <div className="min-w-[14rem] flex-1">
          {/*
            Dieselbe Aussage als Satz – das Diagramm ist aria-hidden.
          */}
          <p className="text-fg text-sm leading-relaxed">
            <strong className="font-semibold">
              {stimmung.wert} von 100 – {stufentext}.
            </strong>{' '}
            {stimmung.bestandteile.length === 1
              ? 'Grundlage ist ein Bestandteil:'
              : `Gemittelt aus ${stimmung.bestandteile.length} Bestandteilen:`}
          </p>
          <ul className="mt-3 space-y-2">
            {stimmung.bestandteile.map((teil) => (
              <Teil key={teil.label} teil={teil} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Teil({ teil }: { teil: Bestandteil }) {
  return (
    <li>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-fg-muted text-xs font-medium">{teil.label}</span>
        <span className="text-fg text-xs font-semibold tabular-nums">
          {Math.round(teil.wert)}
        </span>
      </div>
      {/* Der Balken wiederholt die Zahl daneben nur optisch. */}
      <div
        aria-hidden="true"
        className="bg-surface-muted mt-1 h-1.5 w-full overflow-hidden rounded-full"
      >
        <div
          className="bg-brand h-full rounded-full"
          style={{ width: `${Math.round(teil.wert)}%` }}
        />
      </div>
      <p className="text-fg-subtle mt-1 text-xs leading-relaxed">{teil.erklaerung}</p>
    </li>
  )
}
