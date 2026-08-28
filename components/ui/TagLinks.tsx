import Link from 'next/link'

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
 * Solche Wörter stehen ohne Unterstreichung da – sichtbar anders, damit
 * niemand darauf klickt und sich wundert.
 *
 * ## Warum keine Pillen mehr
 *
 * Bis zum 28. August 2026 war jedes Wort eine umrandete Kapsel mit Pfeil,
 * die nicht verlinkten gestrichelt. Unter einem Lernthema standen davon acht
 * in einer Reihe, unter einem Artikel bis zu sechs. Kapseln sind das
 * Erkennungszeichen des Baukastens – die Startseite hat ihre eigene schon im
 * Juli abgelegt („Stille Dachzeile statt farbiger Pille“), hier standen sie
 * weiter.
 *
 * Was die Kapsel leistete, leistet die Unterstreichung besser: Sie sagt
 * „Verweis“ in der Sprache, die jeder Browser seit dreißig Jahren spricht,
 * und sie braucht weder Rahmen noch Pfeil dafür. Der Unterschied zwischen
 * verlinkt und nicht verlinkt bleibt damit sogar deutlicher als vorher –
 * durchgezogen gegen gestrichelt war eine Feinheit, unterstrichen gegen
 * nicht unterstrichen ist keine.
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
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {tags.map((tag, i) => {
          const href = ziele[i]

          return (
            <li key={tag}>
              {href ? (
                <Link
                  href={href}
                  // Die Unterstreichung in der Textfarbe, nicht in der
                  // Rahmenfarbe: `decoration-border` war so hell, dass der
                  // Unterschied zwischen verlinkt und nicht verlinkt beim
                  // Nachsehen im Bild verschwand – genau die Auskunft, die
                  // dieser Baustein geben soll.
                  className="text-fg-muted hover:text-brand text-sm underline underline-offset-4 transition"
                >
                  {tag}
                </Link>
              ) : (
                <span className="text-fg-subtle text-sm">{tag}</span>
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
