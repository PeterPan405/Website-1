import Link from 'next/link'

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
        // Abschnitt statt Kachel: Haarlinie darüber, keine Fläche.
        'border-border group relative flex h-full flex-col border-t pt-5',
        featured && 'pt-6'
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
          featured ? 'text-3xl' : 'text-xl'
        )}
      >
        <Link
          href={`/news/${article.slug}`}
          className="underline-offset-4 group-hover:underline"
        >
          {/*
            Die gesamte Karte soll klickbar wirken; ein absolut positionierter
            Bereich über der Karte erweitert die Trefferfläche des Links, ohne
            verschachtelte Links zu erzeugen.
          */}
          <span className="absolute inset-0" aria-hidden="true" />
          {article.title}
        </Link>
      </h3>

      {/*
        Ohne „Weiterlesen →“-Fußzeile: Sie stand unter jeder Karte und trug
        nichts, was Titel-Link und Hover-Anhebung nicht längst sagen. Fünfmal
        derselbe Satz mit demselben Pfeil untereinander liest sich wie eine
        Schablone, nicht wie eine Redaktion.
      */}
      <p
        className={cn(
          'text-fg-muted mt-3 flex-1 leading-relaxed',
          featured ? 'text-base' : 'text-sm'
        )}
      >
        {article.teaser}
      </p>
    </article>
  )
}
