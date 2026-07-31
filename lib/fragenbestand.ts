import { learnQuizzes } from '@/data/learn/quizzes'
import { learnTopics } from '@/data/learn'
import { learnLevelIds, learnLevelMeta, type LearnLevelId } from '@/data/learn/types'
import { fragenSchluessel } from '@/lib/wiederholung'

/**
 * Alle Quizfragen des Lernbereichs in einer flachen Liste.
 *
 * ## Wozu
 *
 * Die Fragen liegen nach Thema und Stufe sortiert in `data/learn/quizzes.ts`
 * und werden dort am Ende einer Lernstufe abgefragt. Zwei neue Angebote
 * brauchen sie quer dazu: die verteilte Wiederholung, die aus allen Themen
 * zusammenstellt, was heute fällig ist, und der Einstufungstest, der einen
 * Querschnitt zieht.
 *
 * Beide sollen nicht wissen müssen, wie die Fragen abgelegt sind.
 *
 * ## Warum das nicht ins Seitenbündel gehört
 *
 * 408 Fragen mit je vier Antworten und einer Begründung sind rund 250 KB. Sie
 * in eine Client-Komponente zu importieren hieße, sie jedem mitzuschicken, der
 * die Seite nur aufruft. Deshalb liegt der Bestand unter `/lernen/fragen.json`
 * und wird erst geladen, wenn jemand tatsächlich übt – dieselbe Aufteilung wie
 * beim Suchindex.
 */

export interface Bestandsfrage {
  /** `thema:stufe#position`, siehe `fragenSchluessel`. */
  id: string
  themaSlug: string
  themaTitel: string
  stufe: LearnLevelId
  stufeLabel: string
  frage: string
  antworten: string[]
  richtig: number
  begruendung: string
}

/**
 * Der gesamte Fragenbestand, in der Reihenfolge der Lernthemen.
 *
 * Erst nach Thema (in der Reihenfolge, in der die Themen aufeinander
 * aufbauen), dann nach Stufe von Beginner bis Profi. Wer den Bestand von vorn
 * durchgeht, geht ihn damit in der Reihenfolge durch, in der er gedacht ist.
 */
export function alleFragen(): Bestandsfrage[] {
  const bestand: Bestandsfrage[] = []

  for (const thema of learnTopics) {
    for (const stufe of learnLevelIds) {
      const fragen = learnQuizzes[`${thema.slug}:${stufe}`]
      if (!fragen) continue

      fragen.forEach((frage, position) => {
        bestand.push({
          id: fragenSchluessel(thema.slug, stufe, position),
          themaSlug: thema.slug,
          themaTitel: thema.title,
          stufe,
          stufeLabel: learnLevelMeta[stufe].label,
          frage: frage.question,
          antworten: frage.options,
          richtig: frage.correctIndex,
          begruendung: frage.explanation,
        })
      })
    }
  }

  return bestand
}

/** Wie viele Fragen es je Stufe gibt. */
export function fragenJeStufe(): Record<LearnLevelId, number> {
  const zahlen: Record<LearnLevelId, number> = {
    beginner: 0,
    fortgeschritten: 0,
    profi: 0,
  }
  for (const frage of alleFragen()) zahlen[frage.stufe] += 1
  return zahlen
}

/** Wie viele Themen mindestens eine Frage haben. */
export function themenMitFragen(): number {
  return new Set(alleFragen().map((frage) => frage.themaSlug)).size
}
