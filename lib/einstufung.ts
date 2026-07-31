/**
 * Einstufungstest: Wo anfangen, wenn man nicht bei null anfängt?
 *
 * ## Das Problem
 *
 * Der Lernbereich hat 34 Themen mit je drei Stufen. Wer schon etwas weiß, steht
 * vor 102 Seiten und der Frage, welche davon ihm etwas bringen. Die naheliegende
 * Antwort – „fang vorn an“ – ist für ihn falsch und für einen Einsteiger
 * richtig, und die Seite kann die beiden nicht unterscheiden.
 *
 * Ein kurzer Test kann es. Nicht genau, aber genauer als die Vermutung, mit der
 * sonst gestartet wird.
 *
 * ## Warum die Auswahl fest ist und nicht gewürfelt
 *
 * Ein Test, der bei jedem Aufruf andere Fragen stellt, liefert bei jedem Aufruf
 * ein anderes Ergebnis – und niemand kann sagen, ob er dazugelernt hat oder
 * bloß leichtere Fragen bekam. Die Auswahl ist deshalb fest und über die Themen
 * gleichmäßig verteilt: Wer den Test in vier Wochen wiederholt, vergleicht sich
 * mit sich selbst.
 *
 * ## Was der Test nicht kann
 *
 * Er misst nicht Wissen, sondern das Beantworten von {@link TESTLAENGE} Fragen.
 * Wer eine Stufe knapp verfehlt, kann sie trotzdem können, und wer sie besteht,
 * hat nicht alle 34 Themen intus. Die Empfehlung ist eine Startlinie, kein
 * Zeugnis – und das steht auf der Seite genau so.
 */

/** Die Stufen in der Reihenfolge, in der sie aufeinander aufbauen. */
export const STUFEN = ['beginner', 'fortgeschritten', 'profi'] as const

export type Stufe = (typeof STUFEN)[number]

/** Wie viele Fragen je Stufe gestellt werden. */
export const FRAGEN_JE_STUFE = 5

/** Die Gesamtlänge des Tests. */
export const TESTLAENGE = FRAGEN_JE_STUFE * STUFEN.length

/**
 * Ab diesem Anteil richtiger Antworten gilt eine Stufe als sitzend.
 *
 * 0,7 heißt bei fünf Fragen: vier von fünf reichen, drei nicht. Ein niedrigerer
 * Wert schickte Leute in eine Stufe, deren Grundlagen ihnen fehlen; ein höherer
 * ließe jeden, der einmal danebenliegt, ganz vorn anfangen.
 */
export const SCHWELLE = 0.7

/** Das Mindestmaß, das eine Frage für die Auswahl mitbringen muss. */
export interface Testkandidat {
  id: string
  themaSlug: string
  stufe: string
}

/**
 * Wählt die Testfragen aus dem Gesamtbestand.
 *
 * Reihum über die Themen, damit die fünf Fragen einer Stufe nicht alle aus
 * einem Thema stammen: Fünf Fragen zu Aktien messen, ob jemand Aktien versteht,
 * nicht, ob er auf der Einsteigerstufe richtig ist.
 */
export function waehleTestfragen<T extends Testkandidat>(
  bestand: readonly T[],
  jeStufe: number = FRAGEN_JE_STUFE
): T[] {
  const auswahl: T[] = []

  for (const stufe of STUFEN) {
    /* Nach Thema gruppieren, Reihenfolge der Themen bleibt erhalten. */
    const nachThema = new Map<string, T[]>()
    for (const frage of bestand) {
      if (frage.stufe !== stufe) continue
      const liste = nachThema.get(frage.themaSlug)
      if (liste) liste.push(frage)
      else nachThema.set(frage.themaSlug, [frage])
    }

    const themen = [...nachThema.values()]
    if (themen.length === 0) continue

    /*
      Reihum je eine Frage: erste Runde die erste Frage jedes Themas, zweite
      Runde die zweite. Bei mehr Themen als gewünschten Fragen – der Regelfall –
      bleibt es bei der ersten Runde, und jede Frage kommt aus einem anderen
      Thema.
    */
    let genommen = 0
    for (let runde = 0; genommen < jeStufe; runde += 1) {
      let inDieserRunde = 0
      for (const fragen of themen) {
        if (genommen >= jeStufe) break
        const frage = fragen[runde]
        if (!frage) continue
        auswahl.push(frage)
        genommen += 1
        inDieserRunde += 1
      }
      /* Keine Frage mehr übrig: aufhören statt endlos drehen. */
      if (inDieserRunde === 0) break
    }
  }

  return auswahl
}

export interface Stufenergebnis {
  stufe: Stufe
  gestellt: number
  richtig: number
  /** Anteil richtiger Antworten, oder null ohne gestellte Frage. */
  quote: number | null
  /** Ob die Stufe die Schwelle erreicht hat. */
  bestanden: boolean
}

export interface Einstufung {
  jeStufe: Stufenergebnis[]
  richtigGesamt: number
  gestelltGesamt: number
  /**
   * Wo anzufangen ist.
   *
   * `null`, wenn alle drei Stufen über der Schwelle lagen – dann sagt der Test
   * nichts mehr aus, und eine Empfehlung zu erfinden wäre schlechter, als keine
   * zu geben.
   */
  empfehlung: Stufe | null
  /** Themen, in denen mindestens eine Antwort falsch war. */
  schwaechen: string[]
}

export interface Antwort {
  themaSlug: string
  stufe: string
  richtig: boolean
}

/**
 * Wertet die Antworten aus.
 *
 * Empfohlen wird die **unterste** Stufe, die die Schwelle verfehlt hat. Nicht
 * die oberste bestandene: Wer die Profifragen zufällig trifft, aber die
 * Grundlagen nicht hat, gehört nach vorn und nicht nach hinten. Lücken schließt
 * man von unten.
 */
export function werteAus(antworten: readonly Antwort[]): Einstufung {
  const jeStufe: Stufenergebnis[] = STUFEN.map((stufe) => {
    const eigene = antworten.filter((antwort) => antwort.stufe === stufe)
    const richtig = eigene.filter((antwort) => antwort.richtig).length
    const quote = eigene.length === 0 ? null : richtig / eigene.length
    return {
      stufe,
      gestellt: eigene.length,
      richtig,
      quote,
      bestanden: quote !== null && quote >= SCHWELLE,
    }
  })

  const verfehlt = jeStufe.find(
    (ergebnis) => ergebnis.gestellt > 0 && !ergebnis.bestanden
  )

  const schwaechen: string[] = []
  for (const antwort of antworten) {
    if (antwort.richtig) continue
    if (!schwaechen.includes(antwort.themaSlug)) schwaechen.push(antwort.themaSlug)
  }

  return {
    jeStufe,
    richtigGesamt: antworten.filter((antwort) => antwort.richtig).length,
    gestelltGesamt: antworten.length,
    empfehlung: verfehlt?.stufe ?? null,
    schwaechen,
  }
}

/**
 * Der Satz zum Ergebnis.
 *
 * Steht hier und nicht in der Komponente, damit er mitgeprüft wird: Ein Satz,
 * der bei einem bestimmten Ergebnis das Gegenteil behauptet, ist ein Fehler wie
 * jeder andere – nur einer, den niemand sieht, solange er nicht auftritt.
 */
export function einstufungssatz(einstufung: Einstufung): string {
  const { empfehlung, richtigGesamt, gestelltGesamt } = einstufung

  if (gestelltGesamt === 0) return 'Es wurde keine Frage beantwortet.'

  const auftakt = `${richtigGesamt} von ${gestelltGesamt} richtig.`

  if (empfehlung === null) {
    return `${auftakt} Alle drei Stufen sitzen – weiter kann dieser Test nicht messen. Such dir die Themen, die dich interessieren, oder sieh in der Akademie nach.`
  }
  if (empfehlung === 'beginner') {
    return `${auftakt} Fang bei den Einsteigerstufen an. Das ist keine schlechte Nachricht: Die Begriffe sitzen dort in ein paar Stunden, und ohne sie ist alles Weitere Raten.`
  }
  if (empfehlung === 'fortgeschritten') {
    return `${auftakt} Die Grundlagen sitzen. Steig bei den fortgeschrittenen Stufen ein – dort geht es um Varianten, Kennzahlen und die Umsetzung.`
  }
  return `${auftakt} Einsteiger- und Fortgeschrittenenstufe sitzen. Für dich sind die Profistufen gedacht: Sonderfälle, Steuer, Bewertung.`
}
