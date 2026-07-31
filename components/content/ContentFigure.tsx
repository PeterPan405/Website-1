import { figureDrawings } from '@/components/content/figures'
import { figureMeta, type FigureId } from '@/data/figures'

/**
 * Eine Lerngrafik mit Bildunterschrift.
 *
 * Die Unterschrift ist nicht dekorativ. Eine Grafik zeigt eine Form; erst der
 * Satz darunter sagt, was daraus folgt – und genau das ist der Grund, warum
 * hier überhaupt gezeichnet wird. Sie steht deshalb im Verzeichnis neben der
 * Grafik und ist keine Option, die man weglassen kann.
 */
export function ContentFigure({ id, caption }: { id: FigureId; caption?: string }) {
  const Zeichnung = figureDrawings[id]
  const meta = figureMeta[id]

  return (
    <figure className="mt-6">
      {/*
        Die Zeichnung wird für Vorleseprogramme ausgeblendet.

        Das folgt aus der Entscheidung eine Ebene höher: Die Unterschrift trägt
        die Aussage, die Zeichnung zeigt nur die Form. Ohne diese Markierung
        liest ein Vorleseprogramm die losen Textstücke im SVG – Achsenwerte,
        Beschriftungen, Prozentzahlen – in der Reihenfolge vor, in der sie
        zufällig im Quelltext stehen, und danach erst die Unterschrift, die
        alles erklärt hätte.

        Ausgeblendet und nicht beschriftet: Ein `aria-label` auf einer Grafik
        mit zwanzig Textstücken müsste deren Inhalt zusammenfassen, und diese
        Zusammenfassung steht bereits als Unterschrift darunter – sichtbar für
        alle. Zweimal dasselbe zu sagen ist keine Barrierefreiheit.
      */}
      <div
        aria-hidden="true"
        className="rounded-card border-border bg-surface-muted border p-4 sm:p-6"
      >
        <Zeichnung />
      </div>
      <figcaption className="text-fg-subtle mt-2.5 text-sm leading-relaxed">
        {caption ?? meta.caption}
      </figcaption>
    </figure>
  )
}
