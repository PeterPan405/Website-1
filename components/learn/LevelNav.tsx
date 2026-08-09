'use client'

import Link from 'next/link'

import { levelKey, useCompletedLevels } from '@/components/learn/progress-store'
import { Icon } from '@/components/ui/Icon'
import type { LearnContentStatus, LearnLevelId } from '@/data/learn/types'
import { learnLevelMeta } from '@/data/learn/types'
import { cn } from '@/lib/cn'

export interface LevelNavEntry {
  id: LearnLevelId
  title: string
  readingMinutes: number
  status: LearnContentStatus
  /** Ob die Stufe einen Wissenscheck enthält. */
  hasQuiz: boolean
}

/**
 * Navigation zwischen den drei Stufen eines Themas.
 *
 * Zeigt gleichzeitig den Bearbeitungsstand: erledigte Stufen bekommen ein
 * Häkchen, die aktuelle Stufe ist hervorgehoben. Als Client-Komponente, weil
 * der Fortschritt aus dem localStorage kommt.
 */
export function LevelNav({
  topicSlug,
  entries,
  currentLevelId,
  layout = 'list',
}: {
  topicSlug: string
  entries: LevelNavEntry[]
  /** Ohne Angabe wird keine Stufe als aktuell markiert (Themen-Einstiegsseite). */
  currentLevelId?: LearnLevelId
  /** `list` für die Seitenleiste, `cards` für die Themenseite. */
  layout?: 'list' | 'cards'
}) {
  const completed = useCompletedLevels()

  if (layout === 'cards') {
    return (
      <ul className="grid gap-5 md:grid-cols-3">
        {entries.map((entry, index) => {
          const done = completed.includes(levelKey(topicSlug, entry.id))
          return (
            <li key={entry.id}>
              <Link
                href={`/lernen/${topicSlug}/${entry.id}`}
                className={cn(
                  'fk-card-interactive group flex h-full flex-col p-6',
                  done && 'border-success/40'
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={cn(
                      'flex size-9 items-center justify-center rounded-full text-sm font-bold',
                      done ? 'bg-success text-on-fill' : 'bg-learn-soft text-learn'
                    )}
                  >
                    {done ? <Icon name="check" className="size-4" /> : index + 1}
                  </span>
                  {done && (
                    <span className="fk-chip bg-success-soft text-success">Erledigt</span>
                  )}
                  {!done && entry.status === 'outline' && (
                    <span className="fk-chip bg-surface-muted text-fg-subtle">
                      Gliederung
                    </span>
                  )}
                </div>

                <h3 className="text-fg mt-4 text-lg font-semibold">
                  {learnLevelMeta[entry.id].label}
                </h3>
                <p className="text-fg-muted mt-2 flex-1 text-sm leading-relaxed">
                  {learnLevelMeta[entry.id].promise}
                </p>

                {/*
                  Eine ruhige Fußzeile statt zweier, die um die Breite ringen.

                  Vorher standen links „9 Min. · Quiz“ und rechts „Stufe
                  öffnen →“ in derselben Zeile – auf Kartenbreite brachen
                  beide um, und aus einer Zeile wurden vier gequetschte
                  Halbzeilen. Die Karte ist ohnehin der Link; es bleibt die
                  Sachinformation.
                */}
                <span className="text-fg-subtle mt-4 flex items-center gap-1.5 text-sm">
                  {entry.readingMinutes} Min.
                  {entry.hasQuiz && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-learn flex items-center gap-1 font-medium">
                        <Icon name="target" className="size-3.5" />
                        Quiz
                      </span>
                    </>
                  )}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <nav aria-label="Lernstufen dieses Themas">
      <ul className="space-y-1.5">
        {entries.map((entry, index) => {
          const done = completed.includes(levelKey(topicSlug, entry.id))
          const active = entry.id === currentLevelId

          return (
            <li key={entry.id}>
              <Link
                href={`/lernen/${topicSlug}/${entry.id}`}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 transition',
                  active
                    ? 'bg-learn-soft text-learn font-semibold'
                    : 'text-fg-muted hover:bg-surface-muted hover:text-fg'
                )}
              >
                <span
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    done
                      ? 'bg-success text-on-fill'
                      : active
                        ? 'bg-learn text-on-fill'
                        : 'bg-surface-muted text-fg-subtle'
                  )}
                >
                  {done ? <Icon name="check" className="size-3" /> : index + 1}
                </span>
                <span className="min-w-0 flex-1 text-sm">
                  {learnLevelMeta[entry.id].label}
                </span>
                <span className="text-fg-subtle shrink-0 text-xs">
                  {entry.readingMinutes} Min.
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
