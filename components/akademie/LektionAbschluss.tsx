'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

import {
  lektionKey,
  toggleComplete,
  useCompletedLevels,
} from '@/components/learn/progress-store'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

/**
 * Abschluss einer Lektion: Erledigt-Schalter und der Weg zur nächsten.
 *
 * Dasselbe Muster wie `LevelComplete` im Lernbereich, und das ist Absicht –
 * wer den Lernbereich kennt, sucht den Schalter an derselben Stelle und
 * erkennt ihn an derselben Farbe. Unterschiedlich ist nur, worauf weitergeht:
 * hier auf die nächste Lektion desselben Bereichs, nicht auf eine Stufe.
 */
export function LektionAbschluss({
  bereich,
  lektionSlug,
  lektionTitel,
  naechste,
}: {
  bereich: string
  lektionSlug: string
  lektionTitel: string
  naechste?: { slug: string; titel: string }
}) {
  const erledigt = useCompletedLevels()
  const schluessel = lektionKey(bereich, lektionSlug)
  const fertig = erledigt.includes(schluessel)

  /** Kurze Rückmeldung direkt nach dem Markieren. */
  const [geradeFertig, setGeradeFertig] = useState(false)

  function umschalten() {
    const jetztFertig = toggleComplete(schluessel)
    setGeradeFertig(jetztFertig)
    if (jetztFertig) {
      window.setTimeout(() => setGeradeFertig(false), 4000)
    }
  }

  return (
    <section
      aria-labelledby="lektion-abschliessen"
      className={cn(
        'rounded-card mt-10 border p-6 transition-colors sm:p-7',
        fertig ? 'border-success/40 bg-success-soft' : 'border-border bg-surface-muted'
      )}
    >
      <h2 id="lektion-abschliessen" className="text-fg text-lg font-semibold">
        {fertig ? 'Diese Lektion ist erledigt' : 'Lektion durchgearbeitet?'}
      </h2>

      <p className="text-fg-muted mt-2 text-sm leading-relaxed">
        {fertig
          ? `„${lektionTitel}“ ist abgehakt. Der Haken erscheint in der Bereichsübersicht.`
          : 'Markiere die Lektion, wenn du sie durch hast. In der Bereichsübersicht siehst du dann auf einen Blick, was noch offen ist.'}
      </p>

      <AnimatePresence>
        {geradeFertig && (
          <motion.p
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            role="status"
            aria-live="polite"
            className="bg-success mt-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Icon name="sparkles" className="size-4" />
            {naechste
              ? 'Abgehakt. Weiter zur nächsten Lektion?'
              : 'Der Bereich ist durch.'}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={umschalten}
          aria-pressed={fertig}
          className={cn(fertig ? 'fk-btn-secondary' : 'fk-btn-primary')}
        >
          <Icon name={fertig ? 'close' : 'check'} className="size-4" />
          {fertig ? 'Markierung entfernen' : 'Als erledigt markieren'}
        </button>

        {naechste ? (
          <Link
            href={`/akademie/${bereich}/${naechste.slug}`}
            className={cn(fertig ? 'fk-btn-primary' : 'fk-btn-secondary')}
          >
            Weiter: {naechste.titel}
            <Icon name="arrow-right" className="size-4" />
          </Link>
        ) : (
          <Link href={`/akademie/${bereich}`} className="fk-btn-secondary">
            Zurück zur Übersicht
            <Icon name="arrow-right" className="size-4" />
          </Link>
        )}
      </div>
    </section>
  )
}
