import Link from 'next/link'

import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/format'
import type { NewsArticle } from '@/lib/news'

/** Teaser-Karte für die News-Übersicht und Querverweise. */
export function ArticleCard({
  article,
  featured = false,
}: {
  article: NewsArticle
  /** Hervorgehobene Darstellung für den jüngsten Artikel. */
  featured?: boolean
}) {
  return (
    <article
      className={cn(
        'fk-card-interactive group flex h-full flex-col p-6',
        featured && 'sm:p-8'
      )}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="fk-chip bg-news-soft text-news">{article.category}</span>
        <time dateTime={article.publishedAt} className="text-fg-subtle text-xs">
          {formatDate(article.publishedAt)}
        </time>
        <span aria-hidden="true" className="text-fg-subtle text-xs">
          ·
        </span>
        <span className="text-fg-subtle text-xs">{article.readingMinutes} Min.</span>
      </div>

      <h3
        className={cn(
          'text-fg mt-3 leading-snug font-bold',
          featured ? 'text-2xl sm:text-3xl' : 'text-lg'
        )}
      >
        <Link href={`/news/${article.slug}`} className="hover:text-brand transition">
          {/*
            Die gesamte Karte soll klickbar wirken; ein absolut positionierter
            Bereich über der Karte erweitert die Trefferfläche des Links, ohne
            verschachtelte Links zu erzeugen.
          */}
          <span className="absolute inset-0" aria-hidden="true" />
          {article.title}
        </Link>
      </h3>

      <p
        className={cn(
          'text-fg-muted mt-3 flex-1 leading-relaxed',
          featured ? 'text-base' : 'text-sm'
        )}
      >
        {article.teaser}
      </p>

      <p className="text-news mt-4 flex items-center gap-1 text-sm font-semibold">
        Weiterlesen
        <Icon
          name="arrow-right"
          className="size-4 transition-transform group-hover:translate-x-0.5"
        />
      </p>
    </article>
  )
}
