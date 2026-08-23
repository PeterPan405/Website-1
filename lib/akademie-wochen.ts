import { getAlleLektionen, type Lektion } from '@/lib/akademie'

/**
 * Die Akademie, verteilt auf drei Wochen.
 *
 * ## Warum drei Wochen
 *
 * Der Betreiber hat es so gewünscht: Die Akademie soll parallel zum Lernweg
 * laufen – Woche 1 neben den Beginner-Stufen, Woche 2 neben Fortgeschritten,
 * Woche 3 neben Profi. Wer den Lernbereich in drei Wochen durcharbeitet,
 * bekommt hier die passende Beurteilungsseite dazu.
 *
 * Wie beim 30-Tage-Programm entsteht dabei **kein neuer Inhalt**, sondern eine
 * Reihenfolge über Bestehendem.
 *
 * ## Warum die Reihenfolge gerechnet und nicht aufgeschrieben ist
 *
 * Jede Lektion nennt in `setztVoraus`, was vorher verstanden sein muss. Eine
 * von Hand gepflegte Wochenliste müsste diese Angaben zum zweiten Mal
 * abbilden – und würde beim ersten neuen `setztVoraus` still danebenliegen.
 * Ein Leser bekäme dann eine Lektion vorgesetzt, deren Grundlage erst in der
 * folgenden Woche steht, und niemandem fiele es auf.
 *
 * Deshalb wird die Reihenfolge hier aus dem Voraussetzungsgraph selbst
 * abgeleitet. Sie ist damit per Konstruktion richtig, statt es zu sein,
 * solange jemand nachpflegt.
 *
 * ## Wie sie zustande kommt
 *
 * Für jede Lektion wird ihre **Tiefe** bestimmt: null, wenn sie nichts
 * voraussetzt, sonst eins mehr als die tiefste ihrer Voraussetzungen. Sortiert
 * wird nach Tiefe, dann nach Bereich, dann nach Kürzel – die letzten beiden
 * nur, damit die Reihenfolge bei gleicher Tiefe festliegt und sich nicht mit
 * der Aufzählungsreihenfolge der Datendateien ändert.
 *
 * Zwei Lektionen derselben Tiefe können einander nicht voraussetzen. Ein
 * Schnitt mitten durch eine Tiefe ist deshalb unbedenklich, und genau das
 * erlaubt gleich große Wochen statt der ungleichen Blöcke, die die Tiefen
 * selbst bilden.
 *
 * Gemessen am 23. August 2026: 70 Lektionen, Tiefen 0 bis 6, keine
 * Voraussetzung außerhalb der Akademie, kein Kreis.
 */

/** Eine Woche des Akademie-Wegs. */
export interface Akademiewoche {
  /** 1, 2 oder 3 – zugleich die Anzeigenummer. */
  nummer: number
  titel: string
  /** Welche Stufe des Lernbereichs in derselben Woche gelesen wird. */
  parallelZu: 'Beginner' | 'Fortgeschritten' | 'Profi'
  /** Was diese Woche leistet – der rote Faden. */
  warum: string
  lektionen: Lektion[]
}

/**
 * Wie tief eine Lektion im Voraussetzungsgraph liegt.
 *
 * Der Schutz gegen einen Kreis ist nicht Zierde: Ein Kreis in `setztVoraus`
 * ließe diese Rechnung sonst endlos laufen und den Bau ohne verständliche
 * Meldung sterben. Er wird stattdessen gemeldet – und die betroffene Lektion
 * so behandelt, als stünde sie am Anfang.
 */
function tiefen(lektionen: readonly Lektion[]): Map<string, number> {
  const nachSlug = new Map(lektionen.map((l) => [l.slug, l]))
  const tiefe = new Map<string, number>()

  const bestimme = (slug: string, unterwegs: Set<string>): number => {
    const bekannt = tiefe.get(slug)
    if (bekannt !== undefined) return bekannt
    if (unterwegs.has(slug)) {
      console.warn(
        `::warning::Kreis in setztVoraus bei „${slug}" – als Anfang behandelt.`
      )
      return 0
    }

    /*
      Voraussetzungen außerhalb der Akademie werden übergangen, nicht
      beanstandet: `setztVoraus` darf auf eine Lernstufe zeigen, und die hat
      in dieser Rechnung keine Tiefe.
    */
    const vorher = (nachSlug.get(slug)?.setztVoraus ?? []).filter((s) => nachSlug.has(s))
    const wert = vorher.length
      ? 1 + Math.max(...vorher.map((s) => bestimme(s, new Set([...unterwegs, slug]))))
      : 0

    tiefe.set(slug, wert)
    return wert
  }

  for (const l of lektionen) bestimme(l.slug, new Set())
  return tiefe
}

/** Alle Lektionen in einer Reihenfolge, die keine Voraussetzung verletzt. */
export function lehrreihenfolge(): Lektion[] {
  const alle = getAlleLektionen()
  const tiefe = tiefen(alle)

  return [...alle].sort(
    (a, b) =>
      (tiefe.get(a.slug) ?? 0) - (tiefe.get(b.slug) ?? 0) ||
      a.bereich.localeCompare(b.bereich) ||
      a.slug.localeCompare(b.slug)
  )
}

const RAHMEN: Omit<Akademiewoche, 'lektionen'>[] = [
  {
    nummer: 1,
    titel: 'Die Werkzeuge und ihre Grundbegriffe',
    parallelZu: 'Beginner',
    warum:
      'Was jedes der fünf Verfahren überhaupt behauptet – und die Begriffe, ohne die der Rest nicht lesbar ist: die drei Abschlüsse, Rendite richtig messen, die verbreitetsten Denkfehler.',
  },
  {
    nummer: 2,
    titel: 'Die Kennzahlen und was sie ausblenden',
    parallelZu: 'Fortgeschritten',
    warum:
      'Jetzt wird gerechnet: Bewertungskennzahlen, Risikomaße, Trendlinien, Konjunktur- und Preisdaten. Zu jeder gehört die Stelle, an der sie in die Irre führt.',
  },
  {
    nummer: 3,
    titel: 'Die Verfahren, die aufeinander aufbauen',
    parallelZu: 'Profi',
    warum:
      'Was ohne die Wochen davor nicht zu verstehen ist: Faktoren und Vergleichsmaßstäbe, die Zinsstrukturkurve, das Wellenprinzip und die Frage, was ein Portfolio zusammenhält.',
  },
]

/**
 * Die drei Wochen mit ihren Lektionen.
 *
 * Aufgeteilt wird in möglichst gleich große Teile. Der Rest fällt bewusst auf
 * die **letzte** Woche: Wer bis dorthin gekommen ist, verkraftet eine Lektion
 * mehr eher als jemand in der ersten.
 */
export function getAkademiewochen(): Akademiewoche[] {
  const reihe = lehrreihenfolge()
  const jeWoche = Math.floor(reihe.length / RAHMEN.length)

  return RAHMEN.map((rahmen, i) => ({
    ...rahmen,
    lektionen:
      i === RAHMEN.length - 1
        ? reihe.slice(i * jeWoche)
        : reihe.slice(i * jeWoche, (i + 1) * jeWoche),
  }))
}
