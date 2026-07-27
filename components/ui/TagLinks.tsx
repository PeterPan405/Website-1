import Link from 'next/link'

import { Icon } from '@/components/ui/Icon'
import { resolveTagHref } from '@/lib/tag-links'

/**
 * Schlagwörter als Verweise auf die passende Seite.
 *
 * Wird an zwei Stellen verwendet: unter einem Nachrichtenartikel („Schlagwörter“)
 * und unter einem Lernthema („Begriffe in diesem Thema“). Die Überschrift steht
 * jeweils in der Seite, weil sie sich unterscheidet – die Liste selbst soll sich
 * an beiden Stellen gleich verhalten.
 *
 * Nicht jedes Wort hat ein Ziel. „SAP“ oder „Geopolitik“ führen nirgendwohin,
 * und ein Verweis auf etwas nur ungefähr Passendes wäre schlechter als keiner.
 * Solche Wörter stehen gestrichelt und ohne Pfeil da – sichtbar anders, damit
 * niemand darauf klickt und sich wundert.
 */
export function TagLinks({
  tags,
  currentPath,
  note,
}: {
  tags: readonly string[]
  /**
   * Hinweis unter der Liste, was der Pfeil bedeutet.
   *
   * Erscheint nur, wenn überhaupt etwas verlinkt ist. Auf manchen Themenseiten
   * beschreiben alle Begriffe genau dieses Thema – bei „Aktie“ etwa Dividende,
   * KGV und Stammaktie. Dort führt keiner woandershin, und ein Hinweis auf
   * Pfeile, die es nicht gibt, wäre irreführend.
   */
  note?: string
  /**
   * Pfad der Seite, auf der die Liste steht.
   *
   * Auf einer Themenseite zeigen die eigenen Stichwörter zwangsläufig auf genau
   * diese Seite – „Tagesgeld“ steht bei den Begriffen des Themas Tagesgeld. Zu
   * sich selbst verweist niemand; die Auflösung weicht dann auf das nächstbeste
   * Ziel aus, beim Thema Rohstoffe etwa von „Gold“ auf den Goldkurs.
   */
  currentPath?: string
}) {
  if (tags.length === 0) return null

  const ziele = tags.map((tag) => resolveTagHref(tag, currentPath))

  return (
    <>
      <ul className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag, i) => {
          const href = ziele[i]

          return (
            <li key={tag}>
              {href ? (
                <Link
                  href={href}
                  className="border-border text-fg-muted hover:border-brand hover:bg-brand-soft hover:text-brand inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition"
                >
                  {tag}
                  <Icon name="chevron-right" className="size-3" aria-hidden="true" />
                </Link>
              ) : (
                <span className="border-border text-fg-subtle inline-block rounded-full border border-dashed px-3 py-1 text-xs">
                  {tag}
                </span>
              )}
            </li>
          )
        })}
      </ul>

      {note && ziele.some(Boolean) && (
        <p className="text-fg-subtle mt-3 text-xs">{note}</p>
      )}
    </>
  )
}
