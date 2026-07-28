import { learnTopics } from '@/data/learn'
import { marketDefinitions } from '@/data/markets'

import type { NewsArticle } from '@/data/news'

/**
 * Prüft die Nachrichtenartikel beim Bauen.
 *
 * Nachrichten entstehen unter Zeitdruck: Morgens kommen fünf neue dazu, die
 * fünf vom Vortag rutschen nach hinten. Ein Tippfehler in einem Themen-Slug
 * oder ein Artikel ohne Quellenangabe würde still auf die Website gelangen –
 * als toter Link oder als Behauptung ohne nachprüfbare Herkunft.
 *
 * Deshalb bricht der Build ab, statt zu warnen. Eine fehlende Meldung ist ein
 * sichtbares Problem, das jemand behebt; eine kaputte im Netz nicht. Dasselbe
 * Vorgehen wie bei den Tagesausgaben (`lib/editions-validate.ts`).
 */

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * Zielkorridor für den Teaser.
 *
 * Er dient gleichzeitig als Meta-Description. Deutlich kürzer verschenkt Platz
 * im Suchergebnis, deutlich länger wird abgeschnitten.
 */
const TEASER_MIN = 100

/*
  160 und nicht 200.

  Die Obergrenze stand bis hierher bei 200 – und widersprach damit dem Satz
  direkt darüber: Wenn der Teaser als Meta-Description dient, ist die
  maßgebliche Grenze die, ab der die Suchmaschine abschneidet. Das sind rund
  160 Zeichen. Zwanzig Artikel lagen darüber, ohne dass es jemandem auffiel,
  weil im Suchergebnis eben nur der Anfang steht.

  Aufgefallen ist es erst `scripts/paket-pruefen.ts`, das die ausgelieferte
  Seite ansieht statt die Absicht.
*/
const TEASER_MAX = 160

/** Länge, ab der `metaTitle` nötig wird, weil `title` abgeschnitten würde. */
const TITLE_MAX_WITHOUT_META = 65

export function validateNews(articles: readonly NewsArticle[]): string[] {
  const problems: string[] = []
  const topicSlugs = new Set(learnTopics.map((topic) => topic.slug))
  const symbols = new Set(marketDefinitions.map((definition) => definition.symbol))
  const seenSlugs = new Set<string>()

  for (const article of articles) {
    const at = `Artikel „${article.slug}“`

    if (!SLUG_PATTERN.test(article.slug)) {
      problems.push(
        `${at}: Slug darf nur Kleinbuchstaben, Ziffern und Bindestriche enthalten.`
      )
    }
    if (seenSlugs.has(article.slug)) {
      problems.push(`${at}: Dieser Slug kommt mehrfach vor.`)
    }
    seenSlugs.add(article.slug)

    const teaserLength = [...article.teaser].length
    if (teaserLength < TEASER_MIN || teaserLength > TEASER_MAX) {
      problems.push(
        `${at}: teaser hat ${teaserLength} Zeichen, erlaubt sind ${TEASER_MIN} bis ${TEASER_MAX}.`
      )
    }

    const titleLength = [...article.title].length
    if (titleLength > TITLE_MAX_WITHOUT_META && !article.metaTitle) {
      problems.push(
        `${at}: title hat ${titleLength} Zeichen – ab ${TITLE_MAX_WITHOUT_META} wird ein metaTitle gebraucht.`
      )
    }

    /*
      Datum mit Zeitzone.

      `Date.parse` allein genügt nicht: „2026-07-24T18:10:00“ ohne Zonenangabe
      wird je nach Umgebung als Ortszeit oder als UTC gelesen. Beim statischen
      Export entscheidet dann die Zeitzone des Build-Servers über die auf der
      Seite angezeigte Uhrzeit.
    */
    if (Number.isNaN(Date.parse(article.publishedAt))) {
      problems.push(`${at}: publishedAt ist kein gültiges Datum.`)
    } else if (!/(Z|[+-]\d{2}:\d{2})$/.test(article.publishedAt)) {
      problems.push(`${at}: publishedAt braucht eine Zeitzonenangabe.`)
    }
    if (article.updatedAt && Number.isNaN(Date.parse(article.updatedAt))) {
      problems.push(`${at}: updatedAt ist kein gültiges Datum.`)
    }

    if (article.body.length === 0) {
      problems.push(`${at}: Der Artikel hat keinen Inhalt.`)
    }
    if (article.readingMinutes < 1) {
      problems.push(`${at}: readingMinutes muss mindestens 1 betragen.`)
    }

    // Eine Zusammenfassung ohne Beleg ist bei Finanzthemen wertlos – und
    // rechtlich ist die Verlinkung der Grund, warum zusammengefasst werden darf.
    if (article.sources.length === 0) {
      problems.push(`${at}: Mindestens eine Quelle ist Pflicht.`)
    }
    for (const source of article.sources) {
      if (!source.url.startsWith('https://')) {
        problems.push(`${at}: Quelle „${source.label}“ ist kein https-Link.`)
      }
      if (source.label.trim().length === 0) {
        problems.push(`${at}: Eine Quelle hat keine Beschriftung.`)
      }
    }

    // Der häufigste Fehler beim schnellen Schreiben: ein plausibel klingender
    // Slug, den es nicht gibt. Der Link liefe ins Leere.
    for (const slug of article.relatedTopics) {
      if (!topicSlugs.has(slug)) {
        problems.push(`${at}: Lernthema „${slug}“ existiert nicht.`)
      }
    }
    for (const symbol of article.relatedSymbols) {
      if (!symbols.has(symbol)) {
        problems.push(`${at}: Kurs „${symbol}“ existiert nicht.`)
      }
    }
  }

  return problems
}

/**
 * Wirft, wenn ein Artikel fehlerhaft ist.
 *
 * Wird beim Laden der Service-Schicht aufgerufen und damit bei jedem Build.
 */
export function assertNewsValid(articles: readonly NewsArticle[]): void {
  const problems = validateNews(articles)
  if (problems.length > 0) {
    throw new Error(
      `Die Nachrichtenartikel sind fehlerhaft:\n${problems.map((p) => `  - ${p}`).join('\n')}`
    )
  }
}
