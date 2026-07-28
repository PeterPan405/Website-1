import type { ReactNode } from 'react'

import { figureMeta, type FigureId } from '@/data/figures'

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
   * Ersetzt die Vorlesefassung aus `data/figures.ts`.
   *
   * Nur für Grafiken, deren Zahlen aus einem Datensatz kommen: Stünde die
   * Beschreibung dann fest im Verzeichnis, wäre sie nach der ersten
   * Aktualisierung falsch – und zwar unbemerkt, weil sie niemand sieht, der
   * die Grafik sehen kann.
   */
  beschreibung?: string
  children: ReactNode
}) {
  const meta = figureMeta[id]
  const vorlesefassung = beschreibung ?? meta.description
  if (!vorlesefassung) {
    throw new Error(
      `Die Grafik „${id}“ hat keine Beschreibung – weder in data/figures.ts noch in der Zeichnung. ` +
        'Ohne sie ist sie für alle, die sie nicht sehen können, ein leerer Kasten.'
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
    Die x-Position jedes Eintrags vorab, nicht als mitlaufende Summe.

    Die Breite ist eine Schätzung aus der Zeichenzahl: Beschriftungen stehen
    fest im Code, und eine echte Textmessung gibt es beim statischen Bauen
    ohnehin nicht – dort rendert kein Browser, der Buchstaben ausmessen könnte.
  */
  const positionen = eintraege.reduce<number[]>((liste, eintrag, index) => {
    const vorher = index === 0 ? x : liste[index - 1]
    /*
      7,2 Pixel je Zeichen, nicht 6,6.

      Mit 6,6 stieß bei „Fondskosten – Ordergebühr – Spread“ das Farbfeld des
      folgenden Eintrags in den Text des vorigen. Die Schätzung muss in diese
      Richtung großzügig sein: zu viel Abstand sieht luftig aus, zu wenig sieht
      kaputt aus.
    */
    const breite = index === 0 ? 0 : 22 + eintraege[index - 1].text.length * 7.2
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
              y={y - 9}
              width={12}
              height={12}
              rx={3}
              fill={eintrag.farbe}
            />
            <text x={links + 18} y={y} fontSize={13} fill="var(--c-fg-muted)">
              {eintrag.text}
            </text>
          </g>
        )
      })}
    </g>
  )
}
