import { learnLevelIds, type LearnTopic } from '@/data/learn/types'

/**
 * Prüft die Lerninhalte beim Bauen.
 *
 * Der Lernbereich ist der größte Teil dieser Website: 33 Themen, 99 Stufen,
 * fast 400 Wissensfragen. Er wächst nicht auf einmal, sondern Thema für
 * Thema – und genau dabei entstehen die Fehler, die niemandem auffallen:
 * eine Meta-Description, die im Suchergebnis abgeschnitten wird; ein
 * `related`-Slug mit Tippfehler, der als toter Link endet; ein Quiz, dessen
 * richtige Antwort immer an derselben Stelle steht.
 *
 * Keiner dieser Fehler ist beim Betrachten der Seite sichtbar. Deshalb
 * bricht diese Prüfung den Build ab, statt zu warnen – dasselbe Vorgehen wie
 * bei `lib/news-validate.ts` und `lib/laender-validate.ts`.
 *
 * ## Zur Verteilung der richtigen Antworten
 *
 * Stünde die richtige Antwort überwiegend an einer Position, ließe sich das
 * Quiz ohne Lesen bestehen. Eine exakte Gleichverteilung ist dafür nicht
 * nötig und wäre beim Schreiben auch nur mit künstlichem Umsortieren zu
 * erreichen. Geprüft wird deshalb eine Obergrenze: Keine Position darf mehr
 * als ein Drittel aller Fragen auf sich vereinen. Wer dann rät, liegt
 * schlechter als jemand, der liest – und mehr soll die Regel nicht leisten.
 */

/** Zielkorridor für die Meta-Description, damit sie nicht abgeschnitten wird. */
const BESCHREIBUNG_MIN = 70
const BESCHREIBUNG_MAX = 160

/** Ab dieser Länge schneidet die Suchmaschine den Titel ab. */
const TITEL_MAX = 60

/** Anteil, den eine einzelne Antwortposition höchstens haben darf. */
const HOECHSTANTEIL = 1 / 3

function pruefeText(
  fehler: string[],
  wo: string,
  feld: string,
  wert: string,
  min: number,
  max: number
): void {
  if (wert.trim().length === 0) {
    fehler.push(`${wo}: ${feld} ist leer`)
    return
  }
  if (wert.length > max) {
    fehler.push(`${wo}: ${feld} ist ${wert.length} Zeichen lang, erlaubt sind ${max}`)
  }
  if (wert.length < min) {
    fehler.push(
      `${wo}: ${feld} ist mit ${wert.length} Zeichen zu kurz (mindestens ${min})`
    )
  }
}

/**
 * Wirft, sobald ein Lernthema formal unbrauchbar ist.
 *
 * Geprüft wird, was sich prüfen lässt, ohne den Inhalt zu beurteilen:
 * Vollständigkeit der Stufen, Länge der Meta-Angaben, Auflösbarkeit der
 * Querverweise und die Form der Wissensfragen.
 */
export function assertLearnValid(topics: readonly LearnTopic[]): void {
  const fehler: string[] = []
  const slugs = new Set(topics.map((topic) => topic.slug))

  if (slugs.size !== topics.length) {
    fehler.push('Es gibt mindestens einen doppelt vergebenen Themen-Slug')
  }

  /* Über alle Themen hinweg gezählt – die Verteilung ist eine Eigenschaft
     des gesamten Quizbestands, nicht eines einzelnen Themas. */
  const positionen = new Map<number, number>()
  let fragenGesamt = 0

  for (const topic of topics) {
    pruefeText(fehler, topic.slug, 'metaTitle', topic.metaTitle, 1, TITEL_MAX)
    pruefeText(
      fehler,
      topic.slug,
      'metaDescription',
      topic.metaDescription,
      BESCHREIBUNG_MIN,
      BESCHREIBUNG_MAX
    )

    for (const verwandt of topic.related) {
      if (!slugs.has(verwandt)) {
        fehler.push(
          `${topic.slug}: related verweist auf „${verwandt}“ – dieses Thema gibt es nicht`
        )
      }
      if (verwandt === topic.slug) {
        fehler.push(`${topic.slug}: related verweist auf sich selbst`)
      }
    }

    for (const levelId of learnLevelIds) {
      const level = topic.levels[levelId]
      const wo = `${topic.slug}:${levelId}`

      if (!level) {
        fehler.push(`${wo}: Stufe fehlt`)
        continue
      }

      pruefeText(fehler, wo, 'metaTitle', level.metaTitle, 1, TITEL_MAX)
      pruefeText(
        fehler,
        wo,
        'metaDescription',
        level.metaDescription,
        BESCHREIBUNG_MIN,
        BESCHREIBUNG_MAX
      )

      if (level.blocks.length === 0) {
        fehler.push(`${wo}: keine Inhaltsblöcke`)
      }
      if (level.readingMinutes <= 0) {
        fehler.push(`${wo}: readingMinutes muss positiv sein`)
      }

      for (const [index, frage] of (level.quiz ?? []).entries()) {
        const wf = `${wo}, Frage ${index + 1}`
        if (frage.options.length < 2) {
          fehler.push(`${wf}: braucht mindestens zwei Antwortmöglichkeiten`)
          continue
        }
        if (new Set(frage.options).size !== frage.options.length) {
          fehler.push(`${wf}: enthält zwei gleiche Antwortmöglichkeiten`)
        }
        if (frage.correctIndex < 0 || frage.correctIndex >= frage.options.length) {
          fehler.push(
            `${wf}: correctIndex ${frage.correctIndex} liegt außerhalb der Antworten`
          )
          continue
        }
        if (frage.explanation.trim().length === 0) {
          fehler.push(`${wf}: ohne Begründung – sie ist der eigentliche Lernwert`)
        }

        fragenGesamt++
        positionen.set(frage.correctIndex, (positionen.get(frage.correctIndex) ?? 0) + 1)
      }
    }
  }

  if (fragenGesamt > 0) {
    const grenze = fragenGesamt * HOECHSTANTEIL
    for (const [position, anzahl] of [...positionen].sort((a, b) => a[0] - b[0])) {
      if (anzahl > grenze) {
        fehler.push(
          `Antwortposition ${position + 1} trägt ${anzahl} von ${fragenGesamt} Fragen ` +
            `(${Math.round((anzahl / fragenGesamt) * 100)} %) – erlaubt ist höchstens ein Drittel. ` +
            `Das Quiz wäre sonst teilweise durch Raten zu bestehen.`
        )
      }
    }
  }

  if (fehler.length > 0) {
    throw new Error(
      `Lerninhalte fehlerhaft:\n${fehler.map((zeile) => `  – ${zeile}`).join('\n')}`
    )
  }
}
