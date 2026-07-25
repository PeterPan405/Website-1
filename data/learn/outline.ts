import type { ContentBlock } from '@/data/content'
import type { LearnLevelContent, LearnLevelId, LearnTopic } from '@/data/learn/types'

/**
 * Hilfsfunktionen für Themen, deren Fließtext noch aussteht.
 *
 * Diese Seiten sind vollständig funktionsfähig: eigener Permalink, eigene
 * Meta-Daten, Breadcrumbs, strukturierte Daten und Fortschrittslogik. Statt des
 * ausformulierten Textes enthalten sie eine Gliederung, die der Redaktion als
 * Arbeitsgrundlage dient. Der Status `outline` sorgt dafür, dass die Stufenseite
 * diesen Zustand für Besucher sichtbar ausweist.
 */

export interface OutlineSection {
  heading: string
  points: string[]
}

export interface OutlineLevelInput {
  metaTitle: string
  metaDescription: string
  title: string
  lead: string
  /** Geschätzte Lesedauer des fertigen Textes. */
  readingMinutes: number
  sections: OutlineSection[]
}

/** Baut aus einer Gliederung die Inhaltsblöcke einer Stufenseite. */
function outlineBlocks(input: OutlineLevelInput): ContentBlock[] {
  const blocks: ContentBlock[] = [
    {
      type: 'paragraph',
      text: `Diese Stufe ist als Gliederung angelegt. Die folgenden Punkte umreißen, was der ausformulierte Text behandeln wird – inhaltlich abgestimmt auf die Stufe, damit sich Beginner, Fortgeschritten und Profi nicht wiederholen.`,
    },
  ]

  for (const section of input.sections) {
    blocks.push({ type: 'heading', level: 2, text: section.heading })
    blocks.push({ type: 'list', items: section.points })
  }

  return blocks
}

export function outlineLevel(input: OutlineLevelInput): LearnLevelContent {
  return {
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    title: input.title,
    lead: input.lead,
    readingMinutes: input.readingMinutes,
    status: 'outline',
    blocks: outlineBlocks(input),
  }
}

export interface OutlineTopicInput extends Omit<
  LearnTopic,
  'levels' | 'related' | 'calculators' | 'symbols'
> {
  related?: string[]
  calculators?: string[]
  symbols?: string[]
  levels: Record<LearnLevelId, OutlineLevelInput>
}

/** Erzeugt ein vollständiges Thema, dessen drei Stufen als Gliederung vorliegen. */
export function outlineTopic(input: OutlineTopicInput): LearnTopic {
  return {
    slug: input.slug,
    title: input.title,
    headline: input.headline,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    lead: input.lead,
    overview: input.overview,
    keywords: input.keywords,
    related: input.related ?? [],
    calculators: input.calculators,
    symbols: input.symbols,
    levels: {
      beginner: outlineLevel(input.levels.beginner),
      fortgeschritten: outlineLevel(input.levels.fortgeschritten),
      profi: outlineLevel(input.levels.profi),
    },
  }
}
