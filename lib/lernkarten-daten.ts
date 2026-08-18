import { glossar } from '@/data/glossar'
import { learnQuizzes } from '@/data/learn/quizzes'
import { learnLevelIds, learnLevelMeta } from '@/data/learn/types'
import { ausBegriffen, ausFragen, type Lernkarte } from '@/lib/lernkarten'

/**
 * Woraus die Lernkarten eines Themas entstehen.
 *
 * Getrennt von `lib/lernkarten.ts`, weil dort keine Importe stehen dürfen –
 * der Test lädt das Modul direkt. Hier wird nur eingesammelt; gerechnet und
 * angeordnet wird dort.
 *
 * ## Die Reihenfolge
 *
 * Zuerst die Begriffe, dann die Fragen in der Reihenfolge der Lernstufen.
 * Das ist die Reihenfolge des Stoffes und nicht die des Zufalls: Wer den
 * Bogen der Reihe nach durchgeht, hat erst die Vokabeln und dann die
 * Anwendung – und wer nur die ersten Karten ausschneidet, hat trotzdem einen
 * sinnvollen Satz.
 *
 * ## Warum nichts gemischt wird
 *
 * Eine zufällige Reihenfolge wäre beim Lernen besser und beim Drucken
 * schlechter: Der Bogen entsteht bei jedem Bau neu, und zwei Ausdrucke
 * desselben Themas hätten verschiedene Karten an derselben Stelle. Gemischt
 * wird beim Lernen, mit der Hand.
 */
export function kartenZumThema(themaSlug: string): Lernkarte[] {
  const begriffe = glossar
    .filter((eintrag) => eintrag.thema === themaSlug)
    .map((eintrag) => ({
      slug: eintrag.slug,
      begriff: eintrag.begriff,
      kurz: eintrag.kurz,
    }))

  const fragen = learnLevelIds.flatMap((stufe) =>
    ausFragen(learnQuizzes[`${themaSlug}:${stufe}`] ?? [], stufe, themaSlug)
  )

  return [...ausBegriffen(begriffe), ...fragen]
}

/** Die Beschriftung einer Stufe – für die Ecke der Karte. */
export function stufenName(stufe: string | undefined): string {
  if (!stufe) return ''
  const meta = learnLevelMeta[stufe as keyof typeof learnLevelMeta]
  return meta?.label ?? stufe
}

/** Zu welchen Themen es überhaupt Karten gibt – für `generateStaticParams`. */
export function themenMitKarten(slugs: readonly string[]): string[] {
  return slugs.filter((slug) => kartenZumThema(slug).length > 0)
}
