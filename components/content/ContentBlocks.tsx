import type { ReactNode } from 'react'
import Link from 'next/link'

import { ContentFigure } from '@/components/content/ContentFigure'
import { Icon } from '@/components/ui/Icon'
import { Callout } from '@/components/ui/Callout'
import { slugifyHeading, type ContentBlock } from '@/data/content'
import { zerlege, type Begriffsindex } from '@/lib/glossar-text'
import { rechnerlink } from '@/lib/rechner-vorbelegung'

/**
 * Rendert das Blockmodell aus `data/content.ts` als semantisches HTML.
 *
 * Die Komponente ist die einzige Stelle, an der Inhaltsdaten zu Markup werden.
 * Dadurch gilt die Überschriftenregel (h2 vor h3, keine Sprünge) automatisch
 * für jeden Text auf der Website.
 */

/**
 * Was der Renderer über das Glossar weiß.
 *
 * Der Zustand wandert bewusst als Parameter durch und liegt nicht im Modul:
 * `benutzt` gilt je Seite, und beim statischen Erzeugen werden mehrere Seiten
 * im selben Prozess gebaut. Ein Modulzustand hätte dazu geführt, dass die
 * zweite Seite keine Verweise mehr bekommt – ein Fehler, den man erst im
 * fertigen Paket sieht.
 */
interface Glossarlage {
  index: Begriffsindex
  /** Bereits verlinkte Begriffe dieser Seite. Wird beim Rendern erweitert. */
  benutzt: Set<string>
  /** Begriffe, die auf dieser Seite nicht verlinkt werden. */
  ausgenommen: ReadonlySet<string>
  /** Die Kurzerklärung eines Begriffs – sie steht als Titel am Verweis. */
  erklaerung: (slug: string) => string
}

/** Ein erkannter Begriff als Verweis auf die Glossarseite. */
function Begriff({ text, slug, titel }: { text: string; slug: string; titel: string }) {
  return (
    <Link
      href={`/glossar#${slug}`}
      title={titel}
      className="decoration-fg-subtle/60 hover:decoration-brand underline decoration-dotted underline-offset-4 transition"
    >
      {text}
    </Link>
  )
}

/**
 * Setzt `**fett**` in <strong> um und verlinkt Glossarbegriffe.
 *
 * Ein vollständiger Markdown-Parser wäre für diesen Zweck überdimensioniert.
 * Weil hier ausschließlich Text-Knoten erzeugt werden und niemals HTML
 * interpretiert wird, kann über die Inhalte kein Markup eingeschleust werden.
 *
 * Begriffe werden nur in den einfachen Textstücken gesucht. Was fett gesetzt
 * ist, bleibt unangetastet: Dort steht ohnehin schon eine Hervorhebung, und
 * zwei übereinander lesen sich als Fehler.
 */
function renderInline(text: string, glossar?: Glossarlage): ReactNode {
  const segments = text.split(/(\*\*[^*]+\*\*)/g)
  return segments.map((segment, index) => {
    if (segment.startsWith('**') && segment.endsWith('**') && segment.length > 4) {
      return (
        <strong key={index} className="text-fg font-semibold">
          {segment.slice(2, -2)}
        </strong>
      )
    }
    if (!glossar) return segment

    const teile = zerlege(segment, glossar.index, glossar.benutzt, glossar.ausgenommen)
    if (teile.length === 1 && !teile[0].slug) return segment

    return (
      <span key={index}>
        {teile.map((teil, stelle) =>
          teil.slug ? (
            <Begriff
              key={stelle}
              text={teil.text}
              slug={teil.slug}
              titel={glossar.erklaerung(teil.slug)}
            />
          ) : (
            teil.text
          )
        )}
      </span>
    )
  })
}

function Block({ block, glossar }: { block: ContentBlock; glossar?: Glossarlage }) {
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
        <p className="text-fg-muted mt-4 leading-relaxed">
          {renderInline(block.text, glossar)}
        </p>
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
                renderInline(item, glossar)
              ) : (
                <>
                  <span
                    aria-hidden="true"
                    className="bg-brand mt-2 size-1.5 shrink-0 rounded-full"
                  />
                  <span>{renderInline(item, glossar)}</span>
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
            <p key={index}>{renderInline(item, glossar)}</p>
          ))}
        </Callout>
      )

    case 'quote':
      return (
        <figure className="border-brand mt-6 border-l-2 pl-5">
          <blockquote className="text-fg text-lg leading-relaxed font-medium italic">
            {renderInline(block.text, glossar)}
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
        <div className="rounded-card border-border relative mt-6 overflow-x-auto border">
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
                      {renderInline(cell, glossar)}
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
          {/*
            `whitespace-pre-wrap`, weil eine Formel mehrzeilig sein darf.

            Der MACD besteht aus drei Zeilen, die True Range aus vier. Ohne
            diese Regel fasst der Browser die Zeilenumbrüche zu Leerzeichen
            zusammen, und aus drei Definitionen wird eine durchlaufende Zeile,
            die niemand mehr auseinandernehmen kann. `pre-wrap` statt `pre`:
            Einrückungen bleiben erhalten, eine zu lange Zeile bricht aber um,
            statt am Telefon rechts aus dem Kasten zu laufen.
          */}
          <p className="text-fg overflow-x-auto font-mono text-sm font-medium whitespace-pre-wrap sm:text-base">
            {block.expression}
          </p>
          <p className="text-fg-muted mt-2.5 text-sm leading-relaxed">
            {renderInline(block.description, glossar)}
          </p>
          {/*
            Der Verweis auf den Rechner steht **im** Formelkasten und nicht
            darunter als eigener Absatz: Er gehört zu diesem Beispiel und zu
            keinem anderen. Ein Satz weiter unten im Fließtext läse sich wie
            ein allgemeiner Hinweis auf die Rechnerseite – und davon gibt es
            am Ende jeder Lernstufe ohnehin einen.
          */}
          {block.rechner && (
            <Link
              href={rechnerlink(block.rechner.pfad, block.rechner.werte)}
              className="text-brand mt-4 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
            >
              <Icon name="calculator" className="size-4" aria-hidden="true" />
              {block.rechner.text}
            </Link>
          )}
        </div>
      )

    case 'figure':
      return <ContentFigure id={block.figure} caption={block.caption} />

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
                {renderInline(item.value, glossar)}
              </dd>
            </div>
          ))}
        </dl>
      )
  }
}

export function ContentBlocks({
  blocks,
  glossar,
}: {
  blocks: readonly ContentBlock[]
  /**
   * Verlinkt Fachbegriffe ins Glossar.
   *
   * Ohne diese Angabe bleibt der Text unverändert – die Verlinkung ist nichts,
   * was überall passt. In einer Methodik-Erläuterung unter einem Rechner etwa
   * stünde neben jeder Formel ein Verweis, und der Text erklärt den Begriff
   * gerade selbst.
   */
  glossar?: Glossarlage
}) {
  return (
    <div className="text-base sm:text-[1.0625rem]">
      {blocks.map((block, index) => (
        <Block key={index} block={block} glossar={glossar} />
      ))}
    </div>
  )
}

export type { Glossarlage }
