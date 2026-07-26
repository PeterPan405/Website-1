'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { searchEntries, type SearchEntry } from '@/lib/search-match'

/**
 * Suche über alle Inhalte der Website.
 *
 * Sucht vollständig im Browser: Die Website wird statisch ausgeliefert, es gibt
 * keinen Server, der eine Anfrage beantworten könnte. Den Index baut
 * `lib/search.ts` beim Bauen, das Root-Layout reicht ihn durch.
 *
 * Bedienung mit der Tastatur ist der Regelfall, nicht die Ausnahme: Strg+K
 * beziehungsweise Cmd+K öffnet, Pfeiltasten wählen aus, Enter öffnet den
 * Treffer, Escape schließt.
 */
export function SearchDialog({
  index,
  open,
  onClose,
}: {
  index: SearchEntry[]
  open: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [aktiv, setAktiv] = useState(0)
  const [lastOpen, setLastOpen] = useState(open)
  const eingabe = useRef<HTMLInputElement>(null)
  const liste = useRef<HTMLUListElement>(null)

  const treffer = useMemo(() => searchEntries(index, query), [index, query])

  /*
    Beim Öffnen die vorherige Eingabe verwerfen.

    Die Anpassung erfolgt während des Renderns statt in einem Effekt – dasselbe
    Muster wie in der Kopfzeile beim Seitenwechsel. In einem Effekt wäre für
    einen Frame noch die alte Suche samt Treffern sichtbar, und React weist
    setState im Effekt zu Recht zurück.
  */
  if (open !== lastOpen) {
    setLastOpen(open)
    if (open) {
      setQuery('')
      setAktiv(0)
    }
  }

  // Fokus in das Feld, sonst müsste man nach dem Öffnen erst hineinklicken.
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => eingabe.current?.focus(), 20)
    return () => clearTimeout(timer)
  }, [open])

  // Solange die Suche offen ist, darf die Seite dahinter nicht scrollen.
  useEffect(() => {
    if (!open) return
    const vorher = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = vorher
    }
  }, [open])

  // Den ausgewählten Treffer im Blick behalten, auch bei langer Liste.
  useEffect(() => {
    const element = liste.current?.children[aktiv] as HTMLElement | undefined
    element?.scrollIntoView({ block: 'nearest' })
  }, [aktiv])

  function oeffnen(entry: SearchEntry) {
    onClose()
    router.push(entry.href)
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }
    if (treffer.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setAktiv((i) => (i + 1) % treffer.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setAktiv((i) => (i - 1 + treffer.length) % treffer.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const ziel = treffer[aktiv]
      if (ziel) oeffnen(ziel)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
        >
          {/*
            Die Fläche dahinter schließt beim Klick. Für Tastatur und
            Screenreader ist sie bedeutungslos – dort schließt Escape, und der
            Dialog selbst trägt die Beschriftung.
          */}
          <div
            aria-hidden="true"
            onClick={onClose}
            className="bg-canvas/70 absolute inset-0 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Suche"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onKeyDown={onKeyDown}
            className="fk-card relative w-full max-w-xl overflow-hidden"
          >
            <div className="border-border flex items-center gap-3 border-b px-4">
              <Icon name="search" className="text-fg-subtle size-5 shrink-0" />
              <input
                ref={eingabe}
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  // Neue Eingabe, neue Trefferliste – wieder oben anfangen.
                  setAktiv(0)
                }}
                placeholder="Thema, Rechner, Kurs oder Meldung suchen"
                aria-label="Suchbegriff"
                aria-controls="suchergebnisse"
                autoComplete="off"
                className="text-fg placeholder:text-fg-subtle w-full bg-transparent py-4 text-base outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                className="fk-btn-ghost size-8 shrink-0 rounded-full p-0"
              >
                <Icon name="close" className="size-4" />
                <span className="sr-only">Suche schließen</span>
              </button>
            </div>

            {query.trim() === '' ? (
              <p className="text-fg-muted px-4 py-6 text-sm">
                Durchsucht Lernthemen, Rechner, Kurse, Nachrichten und die Seiten der
                Plattform.
              </p>
            ) : treffer.length === 0 ? (
              <p className="text-fg-muted px-4 py-6 text-sm">
                Nichts gefunden zu <span className="text-fg font-medium">„{query}“</span>.
                Vielleicht hilft ein einzelnes Stichwort statt eines ganzen Satzes.
              </p>
            ) : (
              <ul
                ref={liste}
                id="suchergebnisse"
                className="max-h-[50vh] overflow-y-auto p-2"
              >
                {treffer.map((entry, i) => (
                  <li key={entry.href}>
                    {/*
                      Button statt Verweis: Die Auswahl folgt den Pfeiltasten,
                      und ein Verweis würde bei jedem Tastendruck den Fokus aus
                      dem Eingabefeld ziehen. Die Navigation übernimmt der
                      Router, das Ziel steht in title.
                    */}
                    <button
                      type="button"
                      onClick={() => oeffnen(entry)}
                      onMouseEnter={() => setAktiv(i)}
                      title={entry.href}
                      className={cn(
                        'flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition',
                        i === aktiv ? 'bg-surface-muted' : 'hover:bg-surface-muted'
                      )}
                    >
                      <span className="text-fg-subtle mt-0.5 shrink-0 text-[11px] font-semibold tracking-wide uppercase">
                        {entry.kind}
                      </span>
                      <span className="min-w-0">
                        <span className="text-fg block text-sm font-medium">
                          {entry.title}
                        </span>
                        {entry.hint && (
                          <span className="text-fg-muted line-clamp-1 block text-xs">
                            {entry.hint}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
