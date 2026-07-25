import type { ReactNode } from 'react'

import { Callout } from '@/components/ui/Callout'
import { slugifyHeading, type ContentBlock } from '@/data/content'

/**
 * Rendert das Blockmodell aus `data/content.ts` als semantisches HTML.
 *
 * Die Komponente ist die einzige Stelle, an der Inhaltsdaten zu Markup werden.
 * Dadurch gilt die Überschriftenregel (h2 vor h3, keine Sprünge) automatisch
 * für jeden Text auf der Website.
 */

/**
 * Setzt `**fett**` in <strong> um.
 *
 * Ein vollständiger Markdown-Parser wäre für diesen Zweck überdimensioniert.
 * Weil hier ausschließlich Text-Knoten erzeugt werden und niemals HTML
 * interpretiert wird, kann über die Inhalte kein Markup eingeschleust werden.
 */
function renderInline(text: string): ReactNode {
  const segments = text.split(/(\*\*[^*]+\*\*)/g)
  return segments.map((segment, index) => {
    if (segment.startsWith('**') && segment.endsWith('**') && segment.length > 4) {
      return (
        <strong key={index} className="text-fg font-semibold">
          {segment.slice(2, -2)}
        </strong>
      )
    }
    return segment
  })
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'heading': {
      const id = slugifyHeading(block.text)
      if (block.level === 2) {
        return (
          <h2
            id={id}
            className="text-fg mt-10 scroll-mt-28 text-2xl font-bold first:mt-0 sm:text-3xl"
          >
            {block.text}
          </h2>
        )
      }
      return (
        <h3
          id={id}
          className="text-fg mt-8 scroll-mt-28 text-lg font-semibold sm:text-xl"
        >
          {block.text}
        </h3>
      )
    }

    case 'paragraph':
      return (
        <p className="text-fg-muted mt-4 leading-relaxed">{renderInline(block.text)}</p>
      )

    case 'list': {
      const ListTag = block.ordered ? 'ol' : 'ul'
      return (
        <ListTag
          className={
            block.ordered
              ? 'text-fg-muted marker:text-brand mt-4 list-decimal space-y-2 pl-5 marker:font-semibold'
              : 'text-fg-muted mt-4 space-y-2'
          }
        >
          {block.items.map((item, index) => (
            <li
              key={index}
              className={
                block.ordered ? 'pl-1 leading-relaxed' : 'flex gap-3 leading-relaxed'
              }
            >
              {block.ordered ? (
                renderInline(item)
              ) : (
                <>
                  <span
                    aria-hidden="true"
                    className="bg-brand mt-2 size-1.5 shrink-0 rounded-full"
                  />
                  <span>{renderInline(item)}</span>
                </>
              )}
            </li>
          ))}
        </ListTag>
      )
    }

    case 'callout':
      return (
        <Callout variant={block.variant} title={block.title} className="mt-6">
          {block.items.map((item, index) => (
            <p key={index}>{renderInline(item)}</p>
          ))}
        </Callout>
      )

    case 'quote':
      return (
        <figure className="border-brand mt-6 border-l-2 pl-5">
          <blockquote className="text-fg text-lg leading-relaxed font-medium italic">
            {renderInline(block.text)}
          </blockquote>
          {block.source && (
            <figcaption className="text-fg-subtle mt-2 text-sm">
              {block.source}
            </figcaption>
          )}
        </figure>
      )

    case 'table':
      return (
        // Breite Tabellen dürfen nur in ihrem eigenen Container scrollen,
        // nicht die ganze Seite horizontal verschieben.
        <div className="rounded-card border-border mt-6 overflow-x-auto border">
          <table className="w-full min-w-[32rem] border-collapse text-sm">
            {block.caption && (
              <caption className="border-border bg-surface-muted text-fg-muted border-b px-4 py-2.5 text-left text-xs font-medium">
                {block.caption}
              </caption>
            )}
            <thead className="bg-surface-muted">
              <tr>
                {block.head.map((cell) => (
                  <th
                    key={cell}
                    scope="col"
                    className="text-fg-subtle px-4 py-2.5 text-left text-xs font-semibold tracking-wide uppercase"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-border border-t">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={
                        cellIndex === 0
                          ? 'text-fg px-4 py-2.5 font-medium'
                          : 'text-fg-muted px-4 py-2.5 tabular-nums'
                      }
                    >
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'formula':
      return (
        <div className="rounded-card border-border bg-surface-muted mt-6 border p-4 sm:p-5">
          <p className="text-fg overflow-x-auto font-mono text-sm font-medium sm:text-base">
            {block.expression}
          </p>
          <p className="text-fg-muted mt-2.5 text-sm leading-relaxed">
            {renderInline(block.description)}
          </p>
        </div>
      )

    case 'keyfacts':
      return (
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          {block.items.map((item) => (
            <div
              key={item.label}
              className="border-border bg-surface-muted rounded-xl border px-4 py-3"
            >
              <dt className="text-fg-subtle text-xs font-medium tracking-wide uppercase">
                {item.label}
              </dt>
              <dd className="text-fg mt-1 text-sm font-semibold">
                {renderInline(item.value)}
              </dd>
            </div>
          ))}
        </dl>
      )
  }
}

export function ContentBlocks({ blocks }: { blocks: readonly ContentBlock[] }) {
  return (
    <div className="text-base sm:text-[1.0625rem]">
      {blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </div>
  )
}
