import { aktie } from '@/data/learn/topics/aktie'
import {
  aktienLaenderBranchen,
  bitcoinKrypto,
  blockchain,
  boerse,
  costAverageSparplan,
  derivat,
  einlagensicherung,
  etf,
  fonds,
  groessteCrashes,
  immobilien,
  option,
  rente,
  schuldverschreibung,
  sparerpauschbetrag,
  staatsanleihe,
  tagesgeld,
  wannKaufenVerkaufen,
  wieFunktioniertDerMarkt,
  woraufAchtenEinsteiger,
} from '@/data/learn/topics/outlines'
import { getQuizFor } from '@/data/learn/quizzes'
import { rohstoffe } from '@/data/learn/topics/rohstoffe'
import { zinseszins } from '@/data/learn/topics/zinseszins'
import { learnLevelIds, type LearnTopic } from '@/data/learn/types'

/**
 * Alle Lernthemen in redaktioneller Reihenfolge.
 *
 * Die Reihenfolge bestimmt die Darstellung im Kachel-Grid und in der Sitemap.
 * `aktie`, `zinseszins` und `rohstoffe` sind vollständig ausformuliert, die
 * übrigen Themen liegen als Gliederung vor (Status `outline` je Stufe).
 */
/**
 * Hängt die Quizfragen an die passenden Stufen.
 *
 * Die Fragen liegen in `quizzes.ts` und werden hier zusammengeführt, damit die
 * Inhaltsdateien ausschließlich Fließtext enthalten. Stufen ohne Fragen bleiben
 * unverändert – `quiz` ist optional.
 */
function attachQuizzes(topic: LearnTopic): LearnTopic {
  const levels = { ...topic.levels }
  let changed = false

  for (const levelId of learnLevelIds) {
    const quiz = getQuizFor(topic.slug, levelId)
    if (!quiz) continue
    levels[levelId] = { ...levels[levelId], quiz }
    changed = true
  }

  return changed ? { ...topic, levels } : topic
}

const topicsInOrder: LearnTopic[] = [
  aktie,
  fonds,
  rente,
  immobilien,
  aktienLaenderBranchen,
  etf,
  schuldverschreibung,
  staatsanleihe,
  derivat,
  option,
  bitcoinKrypto,
  rohstoffe,
  tagesgeld,
  wieFunktioniertDerMarkt,
  blockchain,
  costAverageSparplan,
  zinseszins,
  boerse,
  woraufAchtenEinsteiger,
  groessteCrashes,
  wannKaufenVerkaufen,
  einlagensicherung,
  sparerpauschbetrag,
]

export const learnTopics: LearnTopic[] = topicsInOrder.map(attachQuizzes)
