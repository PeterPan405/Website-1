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
      <div className="rounded-card border-border bg-surface-muted border p-4 sm:p-6">
        <Zeichnung />
      </div>
      <figcaption className="text-fg-subtle mt-2.5 text-sm leading-relaxed">
        {caption ?? meta.caption}
      </figcaption>
    </figure>
  )
}
