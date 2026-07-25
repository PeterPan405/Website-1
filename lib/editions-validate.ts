import { learnTopics } from '@/data/learn'
import { marketDefinitions } from '@/data/markets'

import type { DailyEdition } from '@/data/editions'

/**
 * Prüft die Tagesausgaben beim Bauen.
 *
 * Diese Daten entstehen automatisch: Jeden Morgen legt eine Routine eine neue
 * Ausgabe an, ohne dass vorher jemand darüberliest. Ein Tippfehler in einem
 * Themen-Slug oder eine Meldung ohne Quelle würde sonst still auf die Website
 * gelangen – als toter Link oder als Zusammenfassung ohne nachprüfbare Herkunft.
 *
 * Deshalb bricht der Build ab, statt zu warnen. Eine fehlende Ausgabe ist ein
 * sichtbares Problem, das jemand behebt; eine kaputte Ausgabe im Netz nicht.
 *
 * Der Typ deckt bereits die Struktur ab (drei plus zwei Meldungen). Hier geht es
 * um alles, was der Compiler nicht sehen kann: ob Verweise ins Leere zeigen und
 * ob die Texte die Anforderungen erfüllen.
 */

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/** Zielkorridor der Meta-Description aus `lib/seo.ts`. */
const INTRO_MIN = 110
const INTRO_MAX = 165

export function validateEditions(editions: readonly DailyEdition[]): string[] {
  const problems: string[] = []
  const topicSlugs = new Set(learnTopics.map((topic) => topic.slug))
  const symbols = new Set(marketDefinitions.map((definition) => definition.symbol))
  const seenDates = new Set<string>()

  for (const edition of editions) {
    const where = `Ausgabe ${edition.date}`

    if (!DATE_PATTERN.test(edition.date)) {
      problems.push(`${where}: Datum muss im Format JJJJ-MM-TT vorliegen.`)
    }
    if (seenDates.has(edition.date)) {
      problems.push(`${where}: Dieses Datum kommt mehrfach vor.`)
    }
    seenDates.add(edition.date)

    const introLength = [...edition.intro].length
    if (introLength < INTRO_MIN || introLength > INTRO_MAX) {
      problems.push(
        `${where}: intro hat ${introLength} Zeichen, erlaubt sind ${INTRO_MIN} bis ${INTRO_MAX}.`
      )
    }

    const items = [...edition.top, ...edition.further]
    const headlines = new Set<string>()

    for (const item of items) {
      const at = `${where}, „${item.headline}“`

      if (headlines.has(item.headline)) {
        problems.push(`${at}: Diese Überschrift kommt in der Ausgabe doppelt vor.`)
      }
      headlines.add(item.headline)

      if (item.summary.length === 0 || item.summary.some((p) => p.trim().length < 40)) {
        problems.push(
          `${at}: Jede Zusammenfassung braucht mindestens einen echten Absatz.`
        )
      }
      if (item.whyItMatters.trim().length < 40) {
        problems.push(`${at}: whyItMatters fehlt oder ist zu knapp.`)
      }
      if (item.sources.length === 0) {
        problems.push(`${at}: Mindestens eine Quelle ist Pflicht.`)
      }

      for (const source of item.sources) {
        if (!source.url.startsWith('https://')) {
          problems.push(`${at}: Quelle „${source.label}“ ist kein https-Link.`)
        }
        if (source.label.trim().length === 0) {
          problems.push(`${at}: Eine Quelle hat keine Beschriftung.`)
        }
      }

      // Der häufigste Fehler beim automatischen Schreiben: ein plausibel
      // klingender Slug, den es nicht gibt. Der Link liefe dann ins Leere.
      for (const slug of item.relatedTopics) {
        if (!topicSlugs.has(slug)) {
          problems.push(`${at}: Lernthema „${slug}“ existiert nicht.`)
        }
      }
      for (const symbol of item.relatedSymbols) {
        if (!symbols.has(symbol)) {
          problems.push(`${at}: Kurs „${symbol}“ existiert nicht.`)
        }
      }
    }
  }

  return problems
}

/**
 * Wirft, wenn eine Ausgabe fehlerhaft ist.
 *
 * Wird beim Laden der Service-Schicht aufgerufen und damit bei jedem Build.
 */
export function assertEditionsValid(editions: readonly DailyEdition[]): void {
  const problems = validateEditions(editions)
  if (problems.length > 0) {
    throw new Error(
      `Die Tagesausgaben sind fehlerhaft:\n${problems.map((p) => `  - ${p}`).join('\n')}`
    )
  }
}
