import { aktie } from '@/data/learn/topics/aktie'
import { boerse } from '@/data/learn/topics/boerse'
import { costAverageSparplan } from '@/data/learn/topics/cost-average-sparplan'
import { tagesgeld } from '@/data/learn/topics/tagesgeld'
import { etf } from '@/data/learn/topics/etf'
import { fonds } from '@/data/learn/topics/fonds'
import { inflation } from '@/data/learn/topics/inflation'
import { risikoUndRendite } from '@/data/learn/topics/risiko-und-rendite'
import {
  aktienLaenderBranchen,
  anlegerpsychologie,
  bitcoinKrypto,
  blockchain,
  budgetUndSparquote,
  depotUndBroker,
  derivat,
  einlagensicherung,
  groessteCrashes,
  immobilien,
  kostenUndGebuehren,
  notenbankenGeldpolitik,
  option,
  portfolioAufbau,
  rente,
  schuldenUndKredit,
  schuldverschreibung,
  sparerpauschbetrag,
  staatsanleihe,
  waehrungenWechselkurse,
  wannKaufenVerkaufen,
  wieFunktioniertDerMarkt,
  woraufAchtenEinsteiger,
} from '@/data/learn/topics/outlines'
import { getQuizFor } from '@/data/learn/quizzes'
import { rohstoffe } from '@/data/learn/topics/rohstoffe'
import { zinseszins } from '@/data/learn/topics/zinseszins'
import { learnLevelIds, type LearnTopic } from '@/data/learn/types'

/**
 * Alle Lernthemen in einer Reihenfolge, die aufeinander aufbaut.
 *
 * Die Reihenfolge bestimmt die Darstellung im Kachel-Grid und in der Sitemap.
 * Sie folgt nicht dem Alphabet und nicht der Beliebtheit, sondern dem Weg, den
 * jemand tatsächlich geht: erst wissen, wie viel Geld überhaupt da ist, dann
 * einen sicheren Sockel bauen, dann verstehen, wie Märkte funktionieren, dann
 * die einzelnen Anlageklassen, dann daraus ein Depot – und am Ende Steuern und
 * Vorsorge.
 *
 * Die sechs Abschnitte stehen als Kommentar in der Liste und werden im
 * Lernbereich als Zwischenüberschriften ausgegeben; ohne sie wäre die
 * Reihenfolge für Besucher unsichtbar. Wer ein Thema verschiebt, verschiebt es
 * damit auch auf der Seite.
 *
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

/** Ein Abschnitt des Lernwegs mit den Themen, die dazugehören. */
export interface LearnSection {
  /** Sprungmarke auf der Lernübersicht. */
  id: string
  label: string
  /** Ein Satz darüber, wozu dieser Abschnitt gut ist. */
  description: string
  /** Die Themen dieses Abschnitts, in Lernreihenfolge. */
  slugs: string[]
}

/**
 * Der Lernweg in sechs Abschnitten.
 *
 * Diese Liste ist die einzige Stelle, an der die Reihenfolge steht – die
 * Themenliste unten wird daraus abgeleitet. Zwei getrennte Listen wären sonst
 * irgendwann auseinandergelaufen, ohne dass es jemandem aufgefallen wäre.
 */
export const learnSections: LearnSection[] = [
  {
    id: 'grundlagen',
    label: 'Bevor es losgeht',
    description:
      'Die Größen, die über das Ergebnis entscheiden, bevor überhaupt etwas gekauft wird: verfügbarer Betrag, Zeit, Kaufkraft, Risiko – und das eigene Verhalten.',
    slugs: [
      'worauf-achten-einsteiger',
      'budget-und-sparquote',
      'zinseszins',
      'inflation',
      'risiko-und-rendite',
      'anlegerpsychologie',
    ],
  },
  {
    id: 'sockel',
    label: 'Der sichere Sockel',
    description:
      'Notgroschen, Einlagensicherung und der Umgang mit Schulden. Was hier nicht steht, trägt später keine Anlage.',
    slugs: ['tagesgeld', 'einlagensicherung', 'schulden-und-kredit'],
  },
  {
    id: 'maerkte',
    label: 'Wie Märkte funktionieren',
    description:
      'Wo Kurse entstehen, wer den Preis des Geldes setzt und über welchen Weg eine Order überhaupt an den Markt kommt.',
    slugs: [
      'boerse',
      'wie-funktioniert-der-markt',
      'notenbanken-geldpolitik',
      'depot-und-broker',
    ],
  },
  {
    id: 'anlageklassen',
    label: 'Die Anlageklassen',
    description:
      'Die Bausteine einzeln – von der Aktie über Anleihen und Fonds bis zu Rohstoffen, Währungen und Derivaten. Jeweils mit dem Risiko, das dazugehört.',
    slugs: [
      'aktie',
      'schuldverschreibung',
      'staatsanleihe',
      'fonds',
      'etf',
      'immobilien',
      'rohstoffe',
      'waehrungen-wechselkurse',
      'bitcoin-krypto',
      'blockchain',
      'derivat',
      'option',
    ],
  },
  {
    id: 'depot',
    label: 'Aus Bausteinen ein Depot',
    description:
      'Streuung, Aufteilung, Sparplan und Kosten – und die Frage, was in einem Crash zu tun ist. Hier entscheidet sich mehr als bei der Produktauswahl.',
    slugs: [
      'aktien-laender-branchen',
      'portfolio-aufbau',
      'cost-average-sparplan',
      'kosten-und-gebuehren',
      'wann-kaufen-verkaufen',
      'groesste-crashes',
    ],
  },
  {
    id: 'steuern-vorsorge',
    label: 'Steuern und Vorsorge',
    description:
      'Was am Ende beim Finanzamt bleibt und wie sich daraus eine Altersvorsorge bauen lässt.',
    slugs: ['sparerpauschbetrag', 'rente'],
  },
]

/** Alle Themen, ungeordnet – die Reihenfolge kommt aus `learnSections`. */
const allTopics: LearnTopic[] = [
  aktie,
  aktienLaenderBranchen,
  anlegerpsychologie,
  bitcoinKrypto,
  blockchain,
  boerse,
  budgetUndSparquote,
  costAverageSparplan,
  depotUndBroker,
  derivat,
  einlagensicherung,
  etf,
  fonds,
  groessteCrashes,
  immobilien,
  inflation,
  kostenUndGebuehren,
  notenbankenGeldpolitik,
  option,
  portfolioAufbau,
  rente,
  risikoUndRendite,
  rohstoffe,
  schuldenUndKredit,
  schuldverschreibung,
  sparerpauschbetrag,
  staatsanleihe,
  tagesgeld,
  waehrungenWechselkurse,
  wannKaufenVerkaufen,
  wieFunktioniertDerMarkt,
  woraufAchtenEinsteiger,
  zinseszins,
]

/**
 * Bringt die Themen in die Reihenfolge der Abschnitte.
 *
 * Wirft, wenn ein Slug in keinem Abschnitt steht oder in zweien. Ein neu
 * angelegtes Thema wäre sonst still aus dem Lernbereich verschwunden – der
 * häufigste Fehler beim Erweitern einer solchen Liste.
 */
function orderBySections(): LearnTopic[] {
  const bySlug = new Map(allTopics.map((topic) => [topic.slug, topic]))
  const sortiert: LearnTopic[] = []
  const vergeben = new Set<string>()

  for (const section of learnSections) {
    for (const slug of section.slugs) {
      const topic = bySlug.get(slug)
      if (!topic) {
        throw new Error(
          `Lernabschnitt „${section.label}“ nennt das Thema „${slug}“, das es nicht gibt.`
        )
      }
      if (vergeben.has(slug)) {
        throw new Error(`Das Lernthema „${slug}“ steht in mehr als einem Abschnitt.`)
      }
      vergeben.add(slug)
      sortiert.push(topic)
    }
  }

  const fehlend = allTopics.filter((topic) => !vergeben.has(topic.slug))
  if (fehlend.length > 0) {
    throw new Error(
      `Diese Lernthemen stehen in keinem Abschnitt: ${fehlend
        .map((topic) => topic.slug)
        .join(', ')}`
    )
  }

  return sortiert
}

export const learnTopics: LearnTopic[] = orderBySections().map(attachQuizzes)
