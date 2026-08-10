'use client'

import Link from 'next/link'

import { levelKey, markComplete } from '@/components/learn/progress-store'
import { Icon } from '@/components/ui/Icon'
import { learnLevelMeta, type LearnLevelId } from '@/data/learn/types'

/**
 * Der Fuß einer Lernstufe: zurück, weiter – und dabei gespeichert.
 *
 * ## Warum kein Erledigt-Schalter mehr
 *
 * Hier stand ein Kasten „Stufe ‚Beginner‘ abgeschlossen?“ mit einem Schalter
 * „Als erledigt markieren“. Er verlangte eine zweite Handlung für etwas, das
 * die erste schon aussagt: **Wer weiterblättert, ist fertig.** Der Kasten kam
 * am Seitenende zu einem Zeitpunkt, an dem der Leser gedanklich beim nächsten
 * Thema war, und wer ihn übersah, hatte gelernt und trotzdem keinen
 * Fortschritt.
 *
 * Gespeichert wird deshalb beim Weitergehen. `markComplete` schreibt
 * synchron in den localStorage; der Klick auf einen Link löst das aus, bevor
 * die nächste Seite übernimmt.
 *
 * **Zurück speichert nicht.** Wer eine Stufe erneut aufschlägt oder zur
 * Übersicht geht, sagt damit nichts über seinen Stand – nur der Schritt nach
 * vorn tut das.
 *
 * ## Warum zwei Wege nach vorn
 *
 * Die Stufen eines Themas laden dazu ein, sie der Reihe nach abzuarbeiten:
 * Beginner, Fortgeschritten, Profi. Das ist ein Weg, nicht der Weg. Wer sich
 * einen Überblick verschaffen will, nimmt lieber jedes Thema auf
 * Beginner-Niveau mit, statt sich durch drei Stufen einer einzigen Frage zu
 * arbeiten.
 *
 * Deshalb steht neben „Weiter zu ‚Fortgeschritten‘“ auch das nächste Thema –
 * auf derselben Stufe, auf der man gerade ist. Beide markieren die aktuelle
 * Stufe als erledigt; sie unterscheiden sich nur darin, wohin sie führen.
 */
export function StufeWeiter({
  topicSlug,
  levelId,
  previousLevelId,
  nextLevelId,
  naechstesThema,
}: {
  topicSlug: string
  levelId: LearnLevelId
  previousLevelId: LearnLevelId | null
  nextLevelId: LearnLevelId | null
  /** Das folgende Thema in der Lernreihenfolge – am Ende der Liste `null`. */
  naechstesThema: { slug: string; title: string } | null
}) {
  const key = levelKey(topicSlug, levelId)

  return (
    <nav
      data-drucken="aus"
      aria-label="Weiter im Lernbereich"
      className="border-border mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between"
    >
      {previousLevelId ? (
        <Link
          href={`/lernen/${topicSlug}/${previousLevelId}`}
          className="fk-btn-ghost justify-start"
        >
          <Icon name="arrow-left" className="size-4" />
          {learnLevelMeta[previousLevelId].label}
        </Link>
      ) : (
        <Link href={`/lernen/${topicSlug}`} className="fk-btn-ghost justify-start">
          <Icon name="arrow-left" className="size-4" />
          Themenübersicht
        </Link>
      )}

      <div className="flex flex-wrap gap-3 sm:justify-end">
        {naechstesThema && (
          <Link
            href={`/lernen/${naechstesThema.slug}/${levelId}`}
            onClick={() => markComplete(key)}
            className="fk-btn-secondary"
          >
            Nächstes Thema: {naechstesThema.title}
            <Icon name="arrow-right" className="size-4" />
          </Link>
        )}

        {nextLevelId ? (
          <Link
            href={`/lernen/${topicSlug}/${nextLevelId}`}
            onClick={() => markComplete(key)}
            className="fk-btn-primary"
          >
            Weiter zu „{learnLevelMeta[nextLevelId].label}“
            <Icon name="arrow-right" className="size-4" />
          </Link>
        ) : (
          !naechstesThema && (
            <Link
              href="/lernen"
              onClick={() => markComplete(key)}
              className="fk-btn-primary"
            >
              Zur Themenübersicht
              <Icon name="arrow-right" className="size-4" />
            </Link>
          )
        )}
      </div>
    </nav>
  )
}
