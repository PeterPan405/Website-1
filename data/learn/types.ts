import type { ContentBlock } from '@/data/content'

/** Die drei Lernstufen. Reihenfolge ist bedeutsam (Fortschritt, Navigation). */
export type LearnLevelId = 'beginner' | 'fortgeschritten' | 'profi'

export const learnLevelIds: readonly LearnLevelId[] = [
  'beginner',
  'fortgeschritten',
  'profi',
]

export interface LearnLevelMeta {
  id: LearnLevelId
  label: string
  /** Ein Satz darüber, was diese Stufe leistet. */
  promise: string
}

export const learnLevelMeta: Record<LearnLevelId, LearnLevelMeta> = {
  beginner: {
    id: 'beginner',
    label: 'Beginner',
    promise: 'Begriffe, Grundmechanik und die häufigsten Missverständnisse.',
  },
  fortgeschritten: {
    id: 'fortgeschritten',
    label: 'Fortgeschritten',
    promise: 'Varianten, Kennzahlen und die Praxis der Umsetzung.',
  },
  profi: {
    id: 'profi',
    label: 'Profi',
    promise: 'Sonderfälle, Steueraspekte, Risiken und Bewertungsdetails.',
  },
}

/**
 * Bearbeitungsstand einer Stufe.
 *
 * `outline` markiert Seiten, die bereits vollständig funktionieren (inklusive
 * Meta-Daten und Permalink), deren Fließtext aber noch aussteht. Diese Seiten
 * weisen den Zustand für Besucher sichtbar aus.
 */
export type LearnContentStatus = 'complete' | 'outline'

/**
 * Eine Quizfrage im Multiple-Choice-Format.
 *
 * Bewusst mit genau einer richtigen Antwort: Mehrfachauswahl macht die
 * Auswertung für Lernende undurchsichtig („zwei von drei richtig – zählt das?“).
 * Der eigentliche Lernwert steckt in `explanation` – sie wird nach dem
 * Beantworten immer gezeigt, auch bei richtiger Antwort.
 */
export interface QuizQuestion {
  question: string
  /** Antwortmöglichkeiten in fester Reihenfolge. */
  options: string[]
  /** Index der richtigen Antwort in `options`. */
  correctIndex: number
  /** Begründung, die nach dem Beantworten erscheint. */
  explanation: string
}

export interface LearnLevelContent {
  /** Vollständiger <title> dieser Stufenseite. */
  metaTitle: string
  metaDescription: string
  /** <h1> der Stufenseite. */
  title: string
  /** Einleitungssatz unter der Überschrift. */
  lead: string
  readingMinutes: number
  status: LearnContentStatus
  blocks: ContentBlock[]
  /**
   * Wissensfragen zum Abschluss der Stufe.
   *
   * Optional: Stufen, deren Fließtext noch als Gliederung vorliegt, haben noch
   * kein Quiz – Fragen zu einem ungeschriebenen Text wären nicht beantwortbar.
   */
  quiz?: QuizQuestion[]
}

export interface LearnTopic {
  /** URL-Slug, z. B. `aktie` für /lernen/aktie. */
  slug: string
  /** Kurzer Themenname für Kacheln und Navigation. */
  title: string
  /** <h1> der Themen-Einstiegsseite. */
  headline: string
  metaTitle: string
  metaDescription: string
  /** Einleitungssatz auf der Themenseite und in Kacheln. */
  lead: string
  /** Einordnende Absätze auf der Themen-Einstiegsseite. */
  overview: string[]
  keywords: string[]
  /** Slugs verwandter Themen. */
  related: string[]
  /** Pfade passender Rechner. */
  calculators?: string[]
  /** Symbole passender Kurse aus `data/markets.ts`. */
  symbols?: string[]
  levels: Record<LearnLevelId, LearnLevelContent>
}
