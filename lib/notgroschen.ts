/**
 * Wie viele Monatsausgaben der Notgroschen tragen muss – begründet.
 *
 * ## Warum „drei bis sechs Monatsgehälter" zu wenig ist
 *
 * Nicht falsch, sondern **unbeantwortet**. Die Faustregel ist derselbe Satz für
 * eine Beamtin mit zwei Einkommen im Haushalt und für einen Selbstständigen mit
 * zwei Kindern und achtzig Prozent Fixkosten. Für die eine ist sie zu
 * vorsichtig, für den anderen gefährlich zu knapp – und beide lesen dieselbe
 * Zahl und halten sie für eine Auskunft über sich.
 *
 * Hier bleibt die Faustregel der **Ausgangspunkt** (`PAUSCHALE`) und wird um
 * benannte Beiträge verschoben. Jeder Beitrag steht mit Grund und Erklärung in
 * der Ausgabe: Wer am Ende sieben bis zehn Monate herausbekommt, sieht, welche
 * vier Angaben das ergeben haben, und kann jeder einzeln widersprechen.
 *
 * ## Warum an den Ausgaben und nicht am Gehalt
 *
 * Weil der Notgroschen keine Einkommensfrage ist. Die Frage lautet: Wie lange
 * kommt dieser Haushalt ohne Einkommen zurecht? Wer 4.000 € verdient und 2.000 €
 * ausgibt, braucht einen halb so großen Puffer wie jemand mit demselben Gehalt
 * und 4.000 € Ausgaben. „Drei Monatsgehälter" rechnet die falsche Größe – die
 * gebräuchliche Formulierung ist an dieser Stelle schlicht ein Fehler.
 *
 * ## Warum der Fixkostenanteil das Wichtigste ist
 *
 * Weil er sagt, wie stark ein Haushalt bremsen kann. Wer 45 Prozent seiner
 * Ausgaben kurzfristig streichen kann – Restaurant, Kleidung, Urlaub,
 * Abonnements –, hält mit demselben Betrag fast doppelt so lange durch wie
 * jemand, dessen Geld zu neun Zehnteln in Miete, Kredit und Versicherungen
 * geht. Deshalb steht neben der Spanne auch, wie lange der Puffer im
 * **Sparmodus** trägt: dieselbe Summe, andere Ausgabenhöhe.
 *
 * ## Die Zahlen sind Setzungen, keine Messungen
 *
 * Es gibt keine Statistik, aus der „selbstständig = plus drei Monate" folgt.
 * Die Beiträge sind begründete Größenordnungen, und sie stehen hier an einer
 * Stelle, damit man ihnen widersprechen kann. Das ist der Unterschied zu einer
 * Faustregel: Die kann man nur glauben oder nicht.
 */

/** Die verbreitete Faustregel – der Ausgangspunkt, nicht das Ergebnis. */
export const PAUSCHALE = { min: 3, max: 6 } as const

/**
 * Nie unter zwei Monaten, nie über zwei Jahren.
 *
 * Nach unten: Ein Puffer unter zwei Monatsausgaben überbrückt keine
 * Gehaltsverzögerung und keine Reparatur – die Beiträge dürfen die Empfehlung
 * nicht in einen Bereich rechnen, in dem sie ihren Zweck verliert.
 *
 * Nach oben: Wer über zwei Jahresausgaben auf dem Tagesgeldkonto hält, hat
 * kein Sicherheitsproblem mehr, sondern ein Anlageproblem. Die Grenze ist
 * bewusst so hoch, dass sie nur in Kombinationen greift, die es kaum gibt –
 * eine Grenze, die den Normalfall gerade eben trägt, wäre eine Wette.
 */
export const SPANNE = { min: 2, max: 24 } as const

export type Beschaeftigung =
  'verbeamtet' | 'unbefristet' | 'befristet' | 'probezeit' | 'selbststaendig'

export interface Haushaltslage {
  beschaeftigung: Beschaeftigung
  /** Wie viele Einkommen den Haushalt tragen. */
  einkommen: number
  /** Gesamte Ausgaben je Monat. */
  ausgabenProMonat: number
  /** Davon der Teil, der sich kurzfristig nicht senken lässt. */
  fixkostenProMonat: number
  /** Menschen, die mitversorgt werden – Kinder, unterhaltsberechtigte Angehörige. */
  unterhaltspflichten: number
}

/** Ein benannter Zuschlag oder Abschlag in Monaten. */
export interface Beitrag {
  grund: string
  /** Monate, positiv oder negativ. */
  monate: number
  erklaerung: string
}

export interface Notgroschenergebnis {
  /** Empfohlene Spanne in Monatsausgaben. */
  monateVon: number
  monateBis: number
  /** Dieselbe Spanne in Euro. */
  euroVon: number
  euroBis: number
  /** Woraus sie sich zusammensetzt – die Faustregel zuerst. */
  beitraege: Beitrag[]
  fixkostenanteilProzent: number
  /**
   * Wie lange die **Obergrenze** trägt, wenn nur noch Fixkosten laufen.
   *
   * Die eigentliche Auskunft für den Ernstfall: Nicht der Betrag entscheidet,
   * sondern wie schnell ein Haushalt bremsen kann.
   */
  monateImSparmodus: number
}

/**
 * Die Beiträge zur Empfehlung, in der Reihenfolge ihres Gewichts.
 *
 * Ausgelagert, damit sie prüfbar sind: `tests/notgroschen.test.ts` legt jedem
 * Zweig einen Fall vor und zählt nach, dass jeder an echtem Material greift.
 * Eine Fallunterscheidung über Merkmale, die niemand hat, ist keine.
 */
export function beitraege(lage: Haushaltslage): Beitrag[] {
  const liste: Beitrag[] = [
    {
      grund: 'Die Faustregel als Ausgangspunkt',
      monate: 0,
      erklaerung: `${PAUSCHALE.min} bis ${PAUSCHALE.max} Monatsausgaben – von hier aus wird nach oben und unten verschoben.`,
    },
  ]

  /* ------------------------------------------------ Beschäftigung */

  if (lage.beschaeftigung === 'selbststaendig') {
    liste.push({
      grund: 'Selbstständig',
      monate: 3,
      erklaerung:
        'Kein Anspruch auf Arbeitslosengeld, keine Kündigungsfrist als Vorwarnzeit – und Einnahmen, die schwanken, ohne dass jemand kündigt. Der Puffer ist hier nicht nur Notfall, sondern Betriebsmittel.',
    })
  } else if (lage.beschaeftigung === 'probezeit') {
    liste.push({
      grund: 'In der Probezeit',
      monate: 2,
      erklaerung:
        'Zwei Wochen Kündigungsfrist statt Monaten, und der Anspruch auf Arbeitslosengeld setzt zwölf Versicherungsmonate in den letzten dreißig voraus – nach einem kurzen Arbeitsverhältnis ist das nicht selbstverständlich.',
    })
  } else if (lage.beschaeftigung === 'befristet') {
    liste.push({
      grund: 'Befristeter Vertrag',
      monate: 2,
      erklaerung:
        'Das Ende steht fest, die Anschlussstelle nicht. Ein befristeter Vertrag läuft aus, ohne dass jemand kündigen muss – und genau deshalb fehlt die Vorwarnzeit, die eine Kündigung gibt.',
    })
  } else if (lage.beschaeftigung === 'verbeamtet') {
    liste.push({
      grund: 'Verbeamtet',
      monate: -1,
      erklaerung:
        'Der Fall, für den der Notgroschen zuerst gedacht ist – der Wegfall des Einkommens – ist hier sehr unwahrscheinlich. Die anderen Fälle bleiben: Waschmaschine, Auto, Zahnersatz.',
    })
  }

  /* ------------------------------------------------ Zahl der Einkommen */

  if (lage.einkommen <= 1) {
    liste.push({
      grund: 'Ein Einkommen trägt den Haushalt',
      monate: 1,
      erklaerung:
        'Fällt es aus, fällt alles aus. Bei zwei Einkommen müssten beide gleichzeitig wegfallen, damit derselbe Fall eintritt.',
    })
  } else {
    liste.push({
      grund: `${lage.einkommen} Einkommen im Haushalt`,
      monate: -1,
      erklaerung:
        'Ein Ausfall wird zum Teil aufgefangen. Der Abschlag gilt aber nur, solange die Einkommen nicht am selben Arbeitgeber oder derselben Branche hängen – dann fallen sie zusammen aus, und der Vorteil ist keiner.',
    })
  }

  /* ------------------------------------------------ Fixkostenanteil */

  const anteil =
    lage.ausgabenProMonat > 0 ? (lage.fixkostenProMonat / lage.ausgabenProMonat) * 100 : 0

  if (anteil >= 75) {
    liste.push({
      grund: `Fixkosten machen ${Math.round(anteil)} % der Ausgaben aus`,
      monate: 2,
      erklaerung:
        'Bei diesem Anteil lässt sich kaum bremsen. Miete, Kredit und Versicherungen laufen weiter, egal was passiert – der Puffer muss deshalb fast die vollen Ausgaben tragen.',
    })
  } else if (anteil >= 60) {
    liste.push({
      grund: `Fixkosten machen ${Math.round(anteil)} % der Ausgaben aus`,
      monate: 1,
      erklaerung:
        'Ein guter Teil der Ausgaben lässt sich kurzfristig nicht senken. Was bleibt, reicht nicht, um den Ausfall aufzufangen.',
    })
  } else if (anteil > 0 && anteil < 45) {
    liste.push({
      grund: `Fixkosten machen nur ${Math.round(anteil)} % der Ausgaben aus`,
      monate: -1,
      erklaerung:
        'Mehr als die Hälfte der Ausgaben ist kurzfristig streichbar. Derselbe Betrag trägt dadurch deutlich länger – wie lange, steht als eigene Zahl daneben.',
    })
  }

  /* ------------------------------------------------ Unterhaltspflichten */

  if (lage.unterhaltspflichten > 0) {
    /*
      Gedeckelt bei zwei Monaten.

      Das zweite Kind erhöht das Risiko spürbar, das vierte kaum noch – die
      Ausgaben sind ohnehin schon in der Bezugsgröße enthalten, an der alles
      gerechnet wird. Ohne Deckel bekäme eine große Familie eine Empfehlung,
      die niemand aufbauen kann und die deshalb niemand befolgt.
    */
    const monate = Math.min(2, lage.unterhaltspflichten)
    liste.push({
      grund:
        lage.unterhaltspflichten === 1
          ? 'Eine Person wird mitversorgt'
          : `${lage.unterhaltspflichten} Personen werden mitversorgt`,
      monate,
      erklaerung:
        'Ein Umzug in eine kleinere Wohnung, ein Nebenjob, ein Umzug in eine andere Stadt – alles, was sonst schnell geht, dauert mit Unterhaltspflichten länger. Der Puffer muss diese Zeit überbrücken.',
    })
  }

  return liste
}

/**
 * Die Empfehlung: Spanne in Monaten und in Euro.
 *
 * Die Beiträge verschieben **beide** Enden der Faustregel gemeinsam. Die
 * Spannweite von drei Monaten bleibt damit erhalten – sie ist der ehrliche
 * Teil der Regel: Es gibt keine richtige Zahl, es gibt einen Bereich.
 */
export function notgroschen(lage: Haushaltslage): Notgroschenergebnis {
  const liste = beitraege(lage)
  const summe = liste.reduce((s, b) => s + b.monate, 0)

  const monateVon = Math.min(
    SPANNE.max - (PAUSCHALE.max - PAUSCHALE.min),
    Math.max(SPANNE.min, PAUSCHALE.min + summe)
  )
  const monateBis = Math.min(SPANNE.max, monateVon + (PAUSCHALE.max - PAUSCHALE.min))

  const anteil =
    lage.ausgabenProMonat > 0 ? (lage.fixkostenProMonat / lage.ausgabenProMonat) * 100 : 0

  const euroBis = monateBis * lage.ausgabenProMonat

  return {
    monateVon,
    monateBis,
    euroVon: monateVon * lage.ausgabenProMonat,
    euroBis,
    beitraege: liste,
    fixkostenanteilProzent: anteil,
    /*
      Im Sparmodus laufen nur die Fixkosten weiter.

      Ohne Fixkosten wäre das eine Division durch null – und die richtige
      Antwort darauf ist nicht „unendlich", sondern die Zahl, die ohne Sparen
      gilt. Ein Haushalt ohne jede Fixkosten ist keine Eingabe, die eine eigene
      Aussage verdient.
    */
    monateImSparmodus:
      lage.fixkostenProMonat > 0 ? euroBis / lage.fixkostenProMonat : monateBis,
  }
}
