import type { Monatsschritt } from '@/lib/jahresrueckblick'

import { cn } from '@/lib/cn'
import { formatPercentSigned } from '@/lib/format'
import { MONATSNAMEN } from '@/lib/jahresrueckblick'

/**
 * Die Monate eines Jahres als Balken über und unter einer Nulllinie.
 *
 * ## Warum Monatsschritte und keine Kurve
 *
 * Weil eine Kurve zeigt, **wo** der Index stand, und ein Rückblick beantworten
 * soll, **wann** etwas passiert ist. Auf einer Kurve verschwindet ein
 * Märzeinbruch, der bis Juni aufgeholt war, im Rauschen; als Balken steht er
 * da, und daneben steht der Balken, der ihn aufgeholt hat.
 *
 * Jeder Balken bezieht sich auf den Schlusskurs des Vormonats, nicht auf den
 * Jahresanfang. Die zwölf Zahlen sind deshalb Schritte und keine Stände – und
 * ihre Summe ergibt nicht die Jahresveränderung, weil Prozente sich
 * multiplizieren und nicht addieren. Das steht so unter der Grafik.
 *
 * ## Warum als SVG ohne Bibliothek
 *
 * Dieselbe Überlegung wie beim `Dividendenverlauf`: zwölf Rechtecke, die zur
 * Bauzeit feststehen. Eine Diagrammbibliothek dafür zu laden hieße,
 * JavaScript auszuliefern, damit der Browser rechnet, was der Build schon
 * gerechnet hat. Farben kommen als CSS-Variablen und folgen damit dem Hell-
 * und Dunkelmodus, ohne neu gezeichnet zu werden.
 */

/** Breite der Zeichenfläche in Nutzerkoordinaten. */
const BREITE = 720
/** Höhe der Balkenfläche – je Hälfte über und unter der Null. */
const HALB = 74
/** Platz unter der Grafik für die Monatskürzel. */
const ACHSE = 22

const KUERZEL = [
  '',
  'Jan',
  'Feb',
  'Mär',
  'Apr',
  'Mai',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Okt',
  'Nov',
  'Dez',
] as const

export function Monatsstreifen({
  schritte,
  jahr,
  name,
  className,
}: {
  schritte: readonly Monatsschritt[]
  jahr: number
  /** Name des Index, für die Beschriftung des Bildes. */
  name: string
  className?: string
}) {
  if (schritte.length === 0) return null

  /*
    Der Maßstab kommt aus dem größten Ausschlag des Jahres, nicht aus einem
    festen Wert. Ein ruhiges Jahr mit Ausschlägen von zwei Prozent sähe an
    einer Zehn-Prozent-Achse aus wie eine gerade Linie – und ein Jahr mit
    minus zwanzig Prozent im März spränge aus dem Bild.

    Mindestens zwei Prozent, damit ein Jahr ohne jede Bewegung nicht seine
    Rundungsreste zu Türmen aufbläst.
  */
  const groesster = Math.max(2, ...schritte.map((s) => Math.abs(s.prozent)))

  /* Zwölf feste Spalten, damit ein unvollständiges Jahr auch so aussieht. */
  const spalte = BREITE / 12
  const balken = Math.min(spalte * 0.56, 34)

  const hoehe = HALB * 2 + ACHSE

  return (
    <figure className={cn('not-prose', className)}>
      <svg
        viewBox={`0 0 ${BREITE} ${hoehe}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Monatsschritte des ${name} im Jahr ${jahr}: ${schritte
          .map((s) => `${MONATSNAMEN[s.monat]} ${formatPercentSigned(s.prozent, 1)}`)
          .join(', ')}.`}
      >
        {/* Nulllinie – der Bezugspunkt jedes Balkens. */}
        <line
          x1="0"
          y1={HALB}
          x2={BREITE}
          y2={HALB}
          stroke="var(--c-border-strong)"
          strokeWidth="1"
        />

        {schritte.map((schritt) => {
          const mitte = (schritt.monat - 0.5) * spalte
          const laenge = (Math.abs(schritt.prozent) / groesster) * (HALB - 12)
          const rauf = schritt.prozent >= 0
          return (
            <g key={schritt.monat}>
              <rect
                x={mitte - balken / 2}
                y={rauf ? HALB - laenge : HALB}
                width={balken}
                height={Math.max(1.5, laenge)}
                rx="2"
                fill={rauf ? 'var(--c-success)' : 'var(--c-danger)'}
              />
              <text
                x={mitte}
                y={rauf ? HALB - laenge - 5 : HALB + laenge + 12}
                textAnchor="middle"
                fontSize="11"
                fill="var(--c-fg-muted)"
              >
                {formatPercentSigned(schritt.prozent, 1)}
              </text>
            </g>
          )
        })}

        {/* Monatskürzel: alle zwölf, auch die ohne Balken. */}
        {Array.from({ length: 12 }, (_, i) => i + 1).map((monat) => (
          <text
            key={monat}
            x={(monat - 0.5) * spalte}
            y={HALB * 2 + 15}
            textAnchor="middle"
            fontSize="11"
            fill="var(--c-fg-subtle)"
          >
            {KUERZEL[monat]}
          </text>
        ))}
      </svg>

      <figcaption className="text-fg-subtle mt-3 text-xs leading-relaxed">
        Jeder Balken ist die Veränderung gegenüber dem Schlusskurs des Vormonats; der
        Januar bezieht sich auf den letzten Kurs des Vorjahres. Die zwölf Werte addieren
        sich <strong>nicht</strong> zur Jahresveränderung – Prozente werden multipliziert,
        nicht summiert. Ein Monat ohne Kurs fehlt, statt als Null zu erscheinen.
      </figcaption>
    </figure>
  )
}
