'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

import {
  levelKey,
  toggleComplete,
  useCompletedLevels,
} from '@/components/learn/progress-store'
import { Icon } from '@/components/ui/Icon'
import { learnLevelMeta, type LearnLevelId } from '@/data/learn/types'
import { cn } from '@/lib/cn'

/**
 * Abschluss-Baustein am Ende einer Lernstufe.
 *
 * Verbindet drei Dinge: den Erledigt-Schalter, eine kurze Erfolgsmeldung mit
 * Animation und den Weg zur nächsten Stufe. Das ist die Stelle, an der der
 * Lernbereich Motivation erzeugt – deshalb bekommt sie sofortiges, sichtbares
 * Feedback.
 */
export function LevelComplete({
  topicSlug,
  topicTitle,
  levelId,
  nextLevelId,
}: {
  topicSlug: string
  topicTitle: string
  levelId: LearnLevelId
  nextLevelId: LearnLevelId | null
}) {
  const completed = useCompletedLevels()
  const key = levelKey(topicSlug, levelId)
  const isComplete = completed.includes(key)

  /** Kurzzeitige Erfolgsmeldung direkt nach dem Markieren. */
  const [justCompleted, setJustCompleted] = useState(false)

  function onToggle() {
    const nowComplete = toggleComplete(key)
    setJustCompleted(nowComplete)
    if (nowComplete) {
      window.setTimeout(() => setJustCompleted(false), 4000)
    }
  }

  return (
    <section
      aria-labelledby="stufe-abschliessen"
      className={cn(
        'rounded-card border p-6 transition-colors sm:p-7',
        isComplete
          ? 'border-success/40 bg-success-soft'
          : 'border-border bg-surface-muted'
      )}
    >
      <h2 id="stufe-abschliessen" className="text-fg text-lg font-semibold">
        {isComplete
          ? `Stufe „${learnLevelMeta[levelId].label}“ ist erledigt`
          : `Stufe „${learnLevelMeta[levelId].label}“ abgeschlossen?`}
      </h2>

      <p className="text-fg-muted mt-2 text-sm leading-relaxed">
        {isComplete
          ? `Du hast diese Stufe zu „${topicTitle}“ als erledigt markiert. Der Fortschritt erscheint auf der Themenseite und in der Übersicht.`
          : 'Markiere die Stufe, wenn du den Inhalt durchgearbeitet hast. Der Fortschritt wird nur in diesem Browser gespeichert.'}
      </p>

      {/* Erfolgsmeldung mit kurzer Einblendanimation. */}
      <AnimatePresence>
        {justCompleted && (
          <motion.p
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            // Höflich, damit die Meldung Screenreader nicht unterbricht.
            role="status"
            aria-live="polite"
            className="bg-success mt-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Icon name="sparkles" className="size-4" />
            {nextLevelId
              ? 'Geschafft. Weiter zur nächsten Stufe?'
              : 'Alle drei Stufen dieses Themas sind durch. Stark.'}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={isComplete}
          className={cn(
            isComplete ? 'fk-btn-secondary' : 'fk-btn-primary',
            'transition-transform'
          )}
        >
          <Icon name={isComplete ? 'close' : 'check'} className="size-4" />
          {isComplete ? 'Markierung entfernen' : 'Als erledigt markieren'}
        </button>

        {nextLevelId ? (
          <Link
            href={`/lernen/${topicSlug}/${nextLevelId}`}
            className={cn(isComplete ? 'fk-btn-primary' : 'fk-btn-secondary')}
          >
            Weiter zu „{learnLevelMeta[nextLevelId].label}“
            <Icon name="arrow-right" className="size-4" />
          </Link>
        ) : (
          <Link href="/lernen" className="fk-btn-secondary">
            Nächstes Thema wählen
            <Icon name="arrow-right" className="size-4" />
          </Link>
        )}
      </div>
    </section>
  )
}
