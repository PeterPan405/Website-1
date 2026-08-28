'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { Icon } from '@/components/ui/Icon'
import { searchEntries, type SearchEntry } from '@/lib/search-match'

/**
 * Die Ergebnisliste der Suchseite.
 *
 * ## Warum es diese Seite gibt
 *
 * Die Suche dieser Website war bis zum 28. August 2026 ausschließlich ein
 * Dialog: Lupe anklicken, tippen, Treffer anklicken. Für den Besucher reicht
 * das – nur hat eine solche Suche **keine Adresse**. Damit fehlte zweierlei:
 *
 * 1. Ein Suchergebnis lässt sich nicht weitergeben. Wer jemandem zeigen will,
 *    was diese Website zu „Vorabpauschale" hat, kann keinen Link schicken.
 * 2. Google kann die Suchbox im Suchergebnis (`SearchAction`) nur anbieten,
 *    wenn es eine Adresse gibt, die eine Suchanfrage entgegennimmt. Der
 *    Kommentar in `lib/jsonld.ts` hielt das seit jeher fest und verzichtete
 *    deshalb bewusst auf die Auszeichnung.
 *
 * Beides löst dieselbe Seite: `/suche?q=…`.
 *
 * ## Warum sie im Browser sucht
 *
 * Die Website wird statisch ausgeliefert – es gibt keinen Server, der eine
 * Suchanfrage beantworten könnte. Gesucht wird deshalb hier, gegen denselben
 * `/suchindex.json`, den auch der Dialog lädt, mit derselben Bewertung aus
 * `lib/search-match.ts`. Zwei Suchen, die verschieden ranken, wären schlimmer
 * als eine.
 *
 * Für Suchmaschinen ist das unproblematisch: Die Seite selbst ist statisch und
 * indexierbar, die Trefferliste ist es nicht – und soll es auch nicht sein.
 * Was indexiert gehört, sind die Zielseiten, und die stehen längst im
 * `sitemap.xml`.
 */
export function Suchergebnisse() {
  const params = useSearchParams()
  const query = params.get('q') ?? ''

  const [index, setIndex] = useState<SearchEntry[] | null>(null)
  const [ladefehler, setLadefehler] = useState(false)

  useEffect(() => {
    let abgebrochen = false
    fetch('/suchindex.json')
      .then((antwort) => {
        if (!antwort.ok) throw new Error(String(antwort.status))
        return antwort.json()
      })
      .then((daten: SearchEntry[]) => {
        if (!abgebrochen) setIndex(daten)
      })
      .catch(() => {
        if (!abgebrochen) setLadefehler(true)
      })

    return () => {
      abgebrochen = true
    }
  }, [])

  // Keine Obergrenze: Wer eine Seite mit Ergebnissen aufruft, will alle sehen.
  // Der Dialog kürzt auf acht, weil dort ein Ausschnitt genügt.
  const treffer = useMemo(
    () => (index ? searchEntries(index, query, Number.POSITIVE_INFINITY) : []),
    [index, query]
  )

  if (!query.trim()) {
    return (
      <p className="text-fg-muted mt-8 leading-relaxed">
        Diese Seite zeigt Treffer zu einem Suchwort. Ruf sie mit einem Suchwort auf – etwa{' '}
        <code className="text-fg">/suche?q=Vorabpauschale</code> – oder öffne die Suche
        oben in der Kopfzeile.
      </p>
    )
  }

  if (ladefehler) {
    return (
      <p className="text-fg-muted mt-8 leading-relaxed">
        Der Suchindex ließ sich nicht laden. Lade die Seite neu, oder geh über die
        Bereiche in der Kopfzeile.
      </p>
    )
  }

  if (!index) {
    return (
      <p className="text-fg-subtle mt-8" aria-live="polite">
        Wird gesucht …
      </p>
    )
  }

  if (treffer.length === 0) {
    return (
      <p className="text-fg-muted mt-8 leading-relaxed" aria-live="polite">
        Zu <strong className="text-fg">{query}</strong> steht hier nichts. Die Suche
        greift auf Titel und Stichwörter zu, nicht auf den vollen Text der Seiten – ein
        anderes Wort führt oft weiter.
      </p>
    )
  }

  return (
    <>
      <p className="text-fg-muted mt-3" aria-live="polite">
        {treffer.length === 1 ? 'Ein Treffer' : `${treffer.length} Treffer`} zu{' '}
        <strong className="text-fg">{query}</strong>
      </p>

      <ul className="border-border mt-8 border-t">
        {treffer.map((eintrag) => (
          <li key={eintrag.href}>
            <Link
              href={eintrag.href}
              className="group border-border hover:bg-surface-muted flex items-start gap-5 border-b px-1 py-4 transition sm:px-3"
            >
              <span className="min-w-0 flex-1">
                <span className="text-fg-subtle font-mono text-xs tracking-wide uppercase">
                  {eintrag.kind}
                </span>
                <span className="text-fg font-display mt-1 block text-lg font-semibold">
                  {eintrag.title}
                </span>
                {eintrag.hint && (
                  <span className="text-fg-muted mt-1 block text-sm leading-relaxed">
                    {eintrag.hint}
                  </span>
                )}
              </span>
              <Icon
                name="arrow-right"
                className="text-fg-subtle mt-1 size-4 shrink-0 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
