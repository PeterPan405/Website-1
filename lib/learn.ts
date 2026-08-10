import { learnSections, learnTopics } from '@/data/learn'
import {
  learnLevelIds,
  type LearnLevelContent,
  type LearnLevelId,
  type LearnTopic,
} from '@/data/learn/types'

import { LEARN_TOPIC_COUNT } from '@/lib/site'

/**
 * Service-Schicht für den Lernbereich.
 *
 * Die Inhalte liegen im Repository, ein späterer Umzug in ein CMS ändert nur
 * diese Datei. Deshalb sind alle Funktionen asynchron.
 */

export type {
  LearnLevelContent,
  LearnLevelId,
  LearnTopic,
  LearnContentStatus,
} from '@/data/learn/types'
export { learnLevelIds, learnLevelMeta } from '@/data/learn/types'

/*
  Die Themenzahl in `lib/site.ts` gegen die Wirklichkeit prüfen.

  Dort steht sie als Zahl, weil die Kopfzeile eine Client-Komponente ist und ein
  Import der Lerndaten den kompletten Datensatz ins Browser-Bundle zöge. Der
  Preis dafür ist, dass die Zahl veralten kann – sie stand schon einmal monatelang
  auf einem falschen Wert. Diese Prüfung läuft bei jedem Build und bricht ab,
  statt eine falsche Zahl auf Startseite, Fußzeile und in die Meta-Daten zu
  schreiben.
*/
if (learnTopics.length !== LEARN_TOPIC_COUNT) {
  throw new Error(
    `LEARN_TOPIC_COUNT in lib/site.ts steht auf ${LEARN_TOPIC_COUNT}, es gibt aber ${learnTopics.length} Lernthemen. Bitte dort anpassen.`
  )
}

/** Prüft zur Laufzeit, ob ein URL-Segment eine gültige Stufe ist. */
export function isLearnLevelId(value: string): value is LearnLevelId {
  return (learnLevelIds as readonly string[]).includes(value)
}

export async function getLearnTopics(): Promise<LearnTopic[]> {
  return learnTopics
}

export async function getLearnTopic(slug: string): Promise<LearnTopic | null> {
  return learnTopics.find((topic) => topic.slug === slug) ?? null
}

export async function getLearnTopicSlugs(): Promise<string[]> {
  return learnTopics.map((topic) => topic.slug)
}

/** Ein Abschnitt des Lernwegs mit seinen Themen. */
export interface LearnSectionWithTopics {
  id: string
  label: string
  description: string
  topics: LearnTopic[]
  /**
   * Nummer des ersten Themas in der Gesamtliste, von 0 an.
   *
   * Die Kacheln sind durchnummeriert. Ohne diesen Versatz begänne jeder
   * Abschnitt wieder bei eins, und aus 34 Themen würden sechs kurze Listen –
   * genau der Eindruck, den die Reihenfolge vermeiden soll.
   */
  offset: number
}

/**
 * Die Themen in ihren Abschnitten.
 *
 * `getLearnTopics()` bleibt die flache Liste für Sitemap, Suche und alles
 * andere; diese Sicht ist nur für die Lernübersicht.
 */
export async function getLearnSections(): Promise<LearnSectionWithTopics[]> {
  const bySlug = new Map(learnTopics.map((topic) => [topic.slug, topic]))
  let offset = 0

  return learnSections.map((section) => {
    const topics = section.slugs
      .map((slug) => bySlug.get(slug))
      .filter((topic): topic is LearnTopic => Boolean(topic))
    const start = offset
    offset += topics.length

    return {
      id: section.id,
      label: section.label,
      description: section.description,
      topics,
      offset: start,
    }
  })
}

/** Alle Kombinationen aus Thema und Stufe – für `generateStaticParams`. */
export async function getLearnLevelParams(): Promise<{ thema: string; stufe: string }[]> {
  return learnTopics.flatMap((topic) =>
    learnLevelIds.map((stufe) => ({ thema: topic.slug, stufe }))
  )
}

export interface LearnLevelResult {
  topic: LearnTopic
  levelId: LearnLevelId
  level: LearnLevelContent
  /** Vorherige und nächste Stufe für die Weiter-Navigation. */
  previousLevelId: LearnLevelId | null
  nextLevelId: LearnLevelId | null
  /**
   * Das folgende Thema in der Lernreihenfolge – am Ende der Liste `null`.
   *
   * Für den zweiten Weg nach vorn: Wer sich einen Überblick verschaffen will,
   * nimmt lieber jedes Thema auf Beginner-Niveau mit, statt sich durch drei
   * Stufen einer einzigen Frage zu arbeiten. Ohne diesen Ausgang führte vom
   * Ende einer Stufe nur der Weg tiefer ins selbe Thema.
   */
  naechstesThema: { slug: string; title: string } | null
}

export async function getLearnLevel(
  slug: string,
  levelId: string
): Promise<LearnLevelResult | null> {
  const topic = await getLearnTopic(slug)
  if (!topic || !isLearnLevelId(levelId)) return null

  const index = learnLevelIds.indexOf(levelId)
  const themenIndex = learnTopics.findIndex((entry) => entry.slug === topic.slug)
  const folgend = themenIndex >= 0 ? learnTopics[themenIndex + 1] : undefined

  return {
    topic,
    levelId,
    level: topic.levels[levelId],
    previousLevelId: index > 0 ? learnLevelIds[index - 1] : null,
    nextLevelId: index < learnLevelIds.length - 1 ? learnLevelIds[index + 1] : null,
    naechstesThema: folgend ? { slug: folgend.slug, title: folgend.title } : null,
  }
}

/**
 * Verwandte Themen auflösen.
 *
 * Unbekannte Slugs werden stillschweigend übersprungen. So führt ein Tippfehler
 * in den Inhaltsdaten nicht zu einer kaputten Seite, sondern nur zu einem
 * fehlenden Querverweis.
 */
export async function getRelatedTopics(slug: string, limit = 4): Promise<LearnTopic[]> {
  const topic = await getLearnTopic(slug)
  if (!topic) return []

  return topic.related
    .map((relatedSlug) => learnTopics.find((entry) => entry.slug === relatedSlug))
    .filter((entry): entry is LearnTopic => Boolean(entry) && entry!.slug !== slug)
    .slice(0, limit)
}

/** Löst eine Liste von Slugs in Themen auf – für News- und Marktseiten. */
export async function getTopicsBySlugs(slugs: readonly string[]): Promise<LearnTopic[]> {
  return slugs
    .map((slug) => learnTopics.find((topic) => topic.slug === slug))
    .filter((topic): topic is LearnTopic => Boolean(topic))
}

export interface LearnStats {
  topicCount: number
  levelCount: number
  /** Anzahl Stufen mit vollständig ausformuliertem Text. */
  completeLevelCount: number
  /** Summierte Lesedauer aller Stufen in Minuten. */
  totalReadingMinutes: number
  /** Anzahl Stufen mit Wissenscheck. */
  levelsWithQuizCount: number
  /** Gesamtzahl der Quizfragen über alle Stufen. */
  quizQuestionCount: number
}

export async function getLearnStats(): Promise<LearnStats> {
  const levels = learnTopics.flatMap((topic) =>
    learnLevelIds.map((levelId) => topic.levels[levelId])
  )

  return {
    topicCount: learnTopics.length,
    levelCount: levels.length,
    completeLevelCount: levels.filter((level) => level.status === 'complete').length,
    totalReadingMinutes: levels.reduce((sum, level) => sum + level.readingMinutes, 0),
    levelsWithQuizCount: levels.filter((level) => (level.quiz?.length ?? 0) > 0).length,
    quizQuestionCount: levels.reduce((sum, level) => sum + (level.quiz?.length ?? 0), 0),
  }
}

/** Themen, deren Text vollständig vorliegt – auf der Übersicht hervorgehoben. */
export async function getCompleteTopics(): Promise<LearnTopic[]> {
  return learnTopics.filter((topic) =>
    learnLevelIds.every((levelId) => topic.levels[levelId].status === 'complete')
  )
}
