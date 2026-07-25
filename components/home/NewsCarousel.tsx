'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/format'
import type { NewsHeadline } from '@/lib/news'

/** Anzeigedauer einer Schlagzeile in Millisekunden. */
const ROTATION_MS = 6000

/**
 * Rotierende News-Säule für die Startseite.
 *
 * Barrierefreiheit folgt dem Karussell-Muster der W3C-Empfehlungen:
 *
 * - Die Rotation stoppt bei Maus-Hover und sobald der Fokus in die Säule wandert.
 * - Ein expliziter Pause-Knopf hält sie dauerhaft an.
 * - `aria-live` ist während der automatischen Rotation abgeschaltet, sonst würde
 *   ein Screenreader alle sechs Sekunden ungefragt dazwischenreden. Erst wenn
 *   Nutzer selbst weiterschalten, werden Änderungen angekündigt.
 * - Links und Rechts auf der Tastatur blättern.
 */
export function NewsCarousel({ headlines }: { headlines: NewsHeadline[] }) {
  const [index, setIndex] = useState(0)
  const [hoverPaused, setHoverPaused] = useState(false)
  const [manuallyPaused, setManuallyPaused] = useState(false)
  /** Wird gesetzt, sobald jemand selbst blättert – schaltet aria-live frei. */
  const [interacted, setInteracted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const count = headlines.length
  const rotating = !hoverPaused && !manuallyPaused && count > 1

  const goTo = useCallback(
    (next: number) => {
      setInteracted(true)
      setIndex(((next % count) + count) % count)
    },
    [count]
  )

  useEffect(() => {
    if (!rotating) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count)
    }, ROTATION_MS)
    return () => window.clearInterval(timer)
  }, [rotating, count])

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goTo(index + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goTo(index - 1)
    }
  }

  if (count === 0) return null

  const current = headlines[index]

  return (
    <section
      ref={containerRef}
      aria-label="Aktuelle Schlagzeilen"
      aria-roledescription="Karussell"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocus={() => setHoverPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setHoverPaused(false)
        }
      }}
      onKeyDown={onKeyDown}
      className="fk-card relative flex flex-col overflow-hidden p-6 sm:p-7"
    >
      {/* Farbakzent in der News-Farbe. */}
      <div
        aria-hidden="true"
        className="from-news/20 to-news/0 pointer-events-none absolute inset-x-0 -top-24 h-48 bg-gradient-to-b blur-2xl"
      />

      <div className="relative flex items-center justify-between gap-3">
        <p className="fk-chip bg-news-soft text-news">
          <Icon name="newspaper" className="size-3.5" />
          Aktuelles
        </p>
        <button
          type="button"
          onClick={() => setManuallyPaused((paused) => !paused)}
          aria-pressed={manuallyPaused}
          className="fk-btn-ghost size-9 rounded-full p-0"
          title={manuallyPaused ? 'Rotation fortsetzen' : 'Rotation anhalten'}
        >
          <Icon
            name={manuallyPaused ? 'play' : 'pause'}
            className="size-4"
            filled={manuallyPaused}
          />
          <span className="sr-only">
            {manuallyPaused
              ? 'Automatischen Wechsel der Schlagzeilen fortsetzen'
              : 'Automatischen Wechsel der Schlagzeilen anhalten'}
          </span>
        </button>
      </div>

      {/*
        min-h verhindert, dass die Karte bei unterschiedlich langen Schlagzeilen
        in der Höhe springt.
      */}
      <div
        className="relative mt-5 min-h-[13rem] flex-1 sm:min-h-[12rem]"
        aria-live={interacted ? 'polite' : 'off'}
        aria-atomic="true"
      >
        <AnimatePresence mode="wait">
          <motion.article
            key={current.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            aria-roledescription="Folie"
            aria-label={`Schlagzeile ${index + 1} von ${count}`}
          >
            <p className="text-news text-xs font-semibold tracking-wide uppercase">
              {current.category}
            </p>
            <h2 className="text-fg mt-2 text-xl leading-snug font-bold sm:text-2xl">
              <Link
                href={`/news/${current.slug}`}
                className="hover:text-brand rounded transition"
              >
                {current.title}
              </Link>
            </h2>
            <p className="text-fg-muted mt-3 line-clamp-3 text-sm leading-relaxed">
              {current.teaser}
            </p>
            <p className="text-fg-subtle mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <time dateTime={current.publishedAt}>
                {formatDate(current.publishedAt)}
              </time>
              <span aria-hidden="true">·</span>
              <span>{current.readingMinutes} Min. Lesezeit</span>
            </p>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="border-border relative mt-5 flex items-center justify-between gap-3 border-t pt-4">
        {/* Punkt-Navigation: direkter Sprung zu einer Schlagzeile. */}
        <div className="flex items-center gap-1.5">
          {headlines.map((headline, dotIndex) => {
            const active = dotIndex === index
            return (
              <button
                key={headline.slug}
                type="button"
                onClick={() => goTo(dotIndex)}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  active ? 'bg-news w-6' : 'bg-border-strong hover:bg-news/60 w-1.5'
                )}
              >
                <span className="sr-only">
                  Schlagzeile {dotIndex + 1}: {headline.title}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="fk-btn-ghost size-9 rounded-full p-0"
            title="Vorherige Schlagzeile"
          >
            <Icon name="arrow-left" className="size-4" />
            <span className="sr-only">Vorherige Schlagzeile</span>
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="fk-btn-ghost size-9 rounded-full p-0"
            title="Nächste Schlagzeile"
          >
            <Icon name="arrow-right" className="size-4" />
            <span className="sr-only">Nächste Schlagzeile</span>
          </button>
        </div>
      </div>

      {/*
        Alle Schlagzeilen zusätzlich als statische Liste – so sind sie auch ohne
        JavaScript und für Suchmaschinen vollständig erreichbar.
      */}
      <h3 className="sr-only">Alle aktuellen Schlagzeilen</h3>
      <ul className="sr-only">
        {headlines.map((headline) => (
          <li key={headline.slug}>
            <Link href={`/news/${headline.slug}`}>{headline.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
