import { learnTopics } from '@/data/learn'
import {
  learnLevelIds,
  type LearnLevelContent,
  type LearnLevelId,
  type LearnTopic,
} from '@/data/learn/types'

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
}

export async function getLearnLevel(
  slug: string,
  levelId: string
): Promise<LearnLevelResult | null> {
  const topic = await getLearnTopic(slug)
  if (!topic || !isLearnLevelId(levelId)) return null

  const index = learnLevelIds.indexOf(levelId)
  return {
    topic,
    levelId,
    level: topic.levels[levelId],
    previousLevelId: index > 0 ? learnLevelIds[index - 1] : null,
    nextLevelId: index < learnLevelIds.length - 1 ? learnLevelIds[index + 1] : null,
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
