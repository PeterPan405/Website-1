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
import { zinseszins } from '@/data/learn/topics/zinseszins'
import type { LearnTopic } from '@/data/learn/types'

/**
 * Alle Lernthemen in redaktioneller Reihenfolge.
 *
 * Die Reihenfolge bestimmt die Darstellung im Kachel-Grid und in der Sitemap.
 * `aktie` und `zinseszins` sind vollständig ausformuliert, die übrigen Themen
 * liegen als Gliederung vor (Status `outline` je Stufe).
 */
export const learnTopics: LearnTopic[] = [
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
