import Link from 'next/link'

import { Icon } from '@/components/ui/Icon'
import type { LearnTopic } from '@/lib/learn'

/**
 * Querverweise auf Lernthemen.
 *
 * Wird von News- und Marktseiten genutzt, um von einer Meldung zur
 * dahinterliegenden Grundlage zu führen – die Verbindung, die Nachrichtenseiten
 * meistens fehlt.
 */
export function TopicLinkList({
  topics,
  title = 'Grundlagen zum Thema',
  description,
}: {
  topics: LearnTopic[]
  title?: string
  description?: string
}) {
  if (topics.length === 0) return null

  return (
    <section aria-labelledby="verwandte-themen" className="fk-block">
      <h2 id="verwandte-themen" className="text-fg text-lg font-semibold">
        {title}
      </h2>
      {description && <p className="text-fg-muted mt-2 text-sm">{description}</p>}

      <ul className="mt-4 space-y-2">
        {topics.map((topic) => (
          <li key={topic.slug}>
            <Link
              href={`/lernen/${topic.slug}`}
              className="group hover:bg-surface-muted flex items-start gap-3 rounded-xl p-2.5 transition"
            >
              <span className="bg-learn-soft text-learn mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg">
                <Icon name="book" className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="text-fg group-hover:text-brand block text-sm font-semibold">
                  {topic.title}
                </span>
                <span className="text-fg-muted mt-0.5 block text-xs leading-relaxed">
                  {topic.lead}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
