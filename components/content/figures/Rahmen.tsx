import type { ReactNode } from 'react'

import { figureMeta, type FigureId } from '@/data/figures'
import { grafikBeschreibung } from '@/lib/grafik-beschreibungen'

/**
 * Gemeinsamer Rahmen aller Lerngrafiken.
 *
 * Nimmt jeder Zeichnung drei Dinge ab, die sonst neunmal einzeln richtig sein
 * müssten: das Skalieren auf die Spaltenbreite, die Vorlesefassung und die
 * Schriftgröße.
 *
 * Zur Vorlesefassung: Ein `<svg>` ohne `role="img"` wird von Screenreadern als
 * Ansammlung von Formen behandelt – im besten Fall stumm, im schlechteren als
 * Folge sinnloser Pfadnamen. Mit `role="img"` und `aria-labelledby` auf
 * `<title>` und `<desc>` wird daraus ein Bild mit Beschreibung. Genau deshalb
 * steht in `data/figures.ts` bei jeder Grafik ein inhaltlicher Satz und keine
 * Formbeschreibung.
 */
export function FigureSvg({
  id,
  viewBox,
  beschreibung,
  children,
}: {
  id: FigureId
  viewBox: string
  /**
   * Eine Beschreibung, die nur diese Zeichnung kennt.
   *
   * ## Wann sie hier steht – und wann nicht
   *
   * Seit dem 23. August 2026 fast nie. Vorher gaben 53 Zeichnungen ihre
   * gerechnete Beschreibung hier herein, weil sie fest in `data/figures.ts`
   * nach der ersten Aktualisierung falsch gewesen wäre. Für einen Screenreader
   * war das richtig; die **Vorlesefassung** sah diese Sätze aber nie –
   * `vorleseAbschnitte()` liest `figureMeta` und fiel für sie auf die
   * Bildunterschrift zurück.
   *
   * Die gerechneten Beschreibungen stehen deshalb jetzt in
   * `lib/grafik-beschreibungen.ts`, in reinem TypeScript, und beide Wege lesen
   * dieselbe Quelle. Dieser Parameter bleibt als Ausnahme für den Fall, dass
   * eine Zeichnung etwas weiß, was außerhalb von ihr nicht zu haben ist.
   */
  beschreibung?: string
  children: ReactNode
}) {
  const meta = figureMeta[id]
  const vorlesefassung = beschreibung ?? grafikBeschreibung(id) ?? meta.description
  if (!vorlesefassung) {
    throw new Error(
      `Die Grafik „${id}“ hat keine Beschreibung – weder in data/figures.ts noch in ` +
        'lib/grafik-beschreibungen.ts noch in der Zeichnung. Ohne sie ist sie für alle, ' +
        'die sie nicht sehen können, ein leerer Kasten.'
    )
  }

  return (
    <svg
      viewBox={viewBox}
      role="img"
      aria-labelledby={`${id}-titel ${id}-beschreibung`}
      className="block h-auto w-full"
      // Ohne diese Angabe erben SVG-Texte nicht zuverlässig die Seitenschrift.
      fontFamily="inherit"
    >
      <title id={`${id}-titel`}>{meta.title}</title>
      <desc id={`${id}-beschreibung`}>{vorlesefassung}</desc>
      {children}
    </svg>
  )
}

/**
 * Beschriftung innerhalb einer Grafik.
 *
 * Die Farben kommen aus denselben CSS-Variablen wie der übrige Text. Dadurch
 * wechselt eine Grafik mit dem hellen und dunklen Theme mit, ohne dass es
 * zwei Fassungen bräuchte – der Hauptgrund, warum hier gezeichnet und nicht
 * ein Bild eingebunden wird.
 */
export function Beschriftung({
  x,
  y,
  children,
  anchor = 'start',
  ton = 'gedaempft',
  gewicht = 'normal',
  groesse = 13,
}: {
  x: number
  y: number
  children: ReactNode
  anchor?: 'start' | 'middle' | 'end'
  ton?: 'stark' | 'gedaempft' | 'leise' | 'marke' | 'akzent' | 'gefahr'
  gewicht?: 'normal' | 'kraeftig'
  groesse?: number
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={groesse}
      fontWeight={gewicht === 'kraeftig' ? 600 : 400}
      fill={toene[ton]}
    >
      {children}
    </text>
  )
}

const toene = {
  stark: 'var(--c-fg)',
  gedaempft: 'var(--c-fg-muted)',
  leise: 'var(--c-fg-subtle)',
  marke: 'var(--c-brand)',
  akzent: 'var(--c-accent)',
  gefahr: 'var(--c-danger)',
} as const

/** Farbfeld mit Text – die Legende über einem Diagramm. */
export function Legende({
  x,
  y,
  eintraege,
}: {
  x: number
  y: number
  eintraege: readonly { farbe: string; text: string }[]
}) {
  /*
    Die Breite ist eine Schätzung aus der Zeichenzahl.

    Beschriftungen stehen fest im Code, und eine echte Textmessung gibt es
    beim statischen Bauen ohnehin nicht – dort rendert kein Browser, der
    Buchstaben ausmessen könnte. 7,2 Pixel je Zeichen bei 13 Pixel Schrift:
    Mit 6,6 stieß bei „Fondskosten – Ordergebühr – Spread“ das Farbfeld des
    folgenden Eintrags in den Text des vorigen. Die Schätzung muss in diese
    Richtung großzügig sein.
  */
  const JE_ZEICHEN = 7.2 / 13
  const VERFUEGBAR = 640 - x - 8

  const zeichen = eintraege.reduce((summe, e) => summe + e.text.length, 0)
  const gesamt = zeichen * JE_ZEICHEN * 13 + eintraege.length * 22

  /*
    Passt die Legende nicht, wird sie kleiner – nicht abgeschnitten.

    Bei der Margin-Grafik lief der dritte Eintrag über den rechten Rand hinaus
    und war zur Hälfte weg. Auffallen konnte das keiner Prüfung: Der
    Ankerpunkt des Textes liegt im Bild, nur sein Ende nicht. Elf Pixel sind
    die Untergrenze; darunter ist eine Legende ohnehin nicht mehr lesbar, und
    dann ist der Beschriftungstext zu lang und nicht die Zeichnung zu klein.
  */
  const groesse = gesamt > VERFUEGBAR ? Math.max((VERFUEGBAR / gesamt) * 13, 11) : 13
  const feld = Math.max(groesse - 1, 10)

  const positionen = eintraege.reduce<number[]>((liste, eintrag, index) => {
    const vorher = index === 0 ? x : liste[index - 1]
    const breite =
      index === 0
        ? 0
        : feld + 10 + eintraege[index - 1].text.length * JE_ZEICHEN * groesse
    liste.push(vorher + breite)
    return liste
  }, [])

  return (
    <g>
      {eintraege.map((eintrag, index) => {
        const links = positionen[index]
        return (
          <g key={eintrag.text}>
            <rect
              x={links}
              y={y - feld * 0.75}
              width={feld}
              height={feld}
              rx={3}
              fill={eintrag.farbe}
            />
            <text x={links + feld + 6} y={y} fontSize={groesse} fill="var(--c-fg-muted)">
              {eintrag.text}
            </text>
          </g>
        )
      })}
    </g>
  )
}
