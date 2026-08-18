import type { SearchEntry } from '@/lib/search-match'

/**
 * Filter über die Suchtreffer – nach Art, Lernstufe und Alter.
 *
 * ## Warum es sie braucht
 *
 * Der Suchindex hat 2.002 Einträge, und **1.075 davon sind Kurse** – mehr als
 * die Hälfte. Wer „Gold" tippt, bekommt Instrumente; das Lernthema Rohstoffe
 * und der Glossarbegriff stehen dahinter. Die Trefferliste zeigt acht Zeilen,
 * in denen alles gleich aussieht, und die Art steht zwar links, sortiert aber
 * nichts.
 *
 * Die Verteilung, am 18. August 2026 gezählt:
 *
 * | Art        | Einträge |
 * | ---------- | -------: |
 * | Kurs       |    1.075 |
 * | Land       |      214 |
 * | News       |      209 |
 * | Begriff    |      124 |
 * | Lernstufe  |      102 |
 * | übrige 12  |      278 |
 *
 * ## Die Regel, nach der ein Filter erscheint
 *
 * **Ein Filter, der nichts ausrichten kann, wird nicht gezeigt.** Konkret:
 *
 * - Eine Art erscheint nur, wenn die aktuellen Treffer sie enthalten.
 * - Sie erscheint nur, wenn es **mehr als eine** Art gibt – bei einer einzigen
 *   wäre der Filter ein Knopf, der die Liste unverändert lässt.
 * - Die Lernstufe erscheint nur, wenn Lernstufen unter den Treffern sind.
 * - Das Alter erscheint nur, wenn datierte Einträge darunter sind.
 *
 * Das ist dieselbe Haltung wie beim Screener: Jede Angabe nennt ihre eigene
 * Grundgesamtheit, und was nichts misst, steht nicht da. Ein Zeitfilter über
 * eine Liste aus Kursen und Lernthemen würde 87 Prozent der Treffer
 * stillschweigend wegwerfen – die Kurse haben kein Datum, und „ohne Datum"
 * heißt nicht „alt".
 *
 * ## Was ein Filter nicht ist
 *
 * Keine zweite Suche. Gefiltert wird, was die Suche gefunden hat – die
 * Bewertung bleibt unangetastet, die Reihenfolge auch. Wer filtert, streicht;
 * er sucht nicht neu.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 */

/** Wonach gefiltert wird. Fehlt ein Feld, ist diese Achse „egal“. */
export interface Suchfilter {
  /** Der `kind` eines Eintrags, z. B. `Rechner`. */
  art?: string
  /** Die Lernstufe, z. B. `beginner`. */
  stufe?: string
  /** Wie alt ein datierter Eintrag höchstens sein darf, in Tagen. */
  hoechstensTageAlt?: number
}

/** Eine Filtermöglichkeit mit ihrer Zahl in der aktuellen Trefferliste. */
export interface Filtermoeglichkeit {
  wert: string
  label: string
  anzahl: number
}

/**
 * Wie viele Treffer je Art – absteigend, bei Gleichstand alphabetisch.
 *
 * Absteigend, weil die häufigste Art die ist, die den Rest verdeckt: Wer
 * filtern will, will meistens genau die wegklicken.
 */
export function artenMitAnzahl(treffer: readonly SearchEntry[]): Filtermoeglichkeit[] {
  const zaehler = new Map<string, number>()
  for (const eintrag of treffer) {
    zaehler.set(eintrag.kind, (zaehler.get(eintrag.kind) ?? 0) + 1)
  }

  return [...zaehler.entries()]
    .map(([wert, anzahl]) => ({ wert, label: wert, anzahl }))
    .sort((a, b) => b.anzahl - a.anzahl || a.wert.localeCompare(b.wert, 'de'))
}

/**
 * Die Lernstufen unter den Treffern – in der Reihenfolge des Lernwegs.
 *
 * Nicht nach Häufigkeit: Beginner, Fortgeschritten, Profi ist eine Ordnung,
 * die der Stoff vorgibt. Sie nach Trefferzahl umzusortieren hieße, den Lernweg
 * nach dem Zufall des Suchbegriffs zu ordnen.
 */
export function stufenMitAnzahl(
  treffer: readonly SearchEntry[],
  reihenfolge: readonly { id: string; label: string }[]
): Filtermoeglichkeit[] {
  const zaehler = new Map<string, number>()
  for (const eintrag of treffer) {
    if (!eintrag.stufe) continue
    zaehler.set(eintrag.stufe, (zaehler.get(eintrag.stufe) ?? 0) + 1)
  }

  return reihenfolge
    .filter((stufe) => zaehler.has(stufe.id))
    .map((stufe) => ({
      wert: stufe.id,
      label: stufe.label,
      anzahl: zaehler.get(stufe.id) ?? 0,
    }))
}

/** Wie viele Treffer überhaupt ein Datum tragen. */
export function mitDatum(treffer: readonly SearchEntry[]): number {
  return treffer.filter((eintrag) => typeof eintrag.datum === 'string').length
}

/**
 * Wie alt ein Eintrag am Stichtag ist, in Tagen – oder `null` ohne Datum.
 *
 * Gerechnet über ISO-Daten und `Date.UTC`, nicht über `new Date(text)`: Sonst
 * hinge das Ergebnis an der Zeitzone des Geräts, und ein Artikel wäre je nach
 * Standort einen Tag älter.
 */
export function alterInTagen(datum: string | undefined, stichtag: string): number | null {
  if (!datum) return null
  const eintrag = Date.parse(`${datum.slice(0, 10)}T00:00:00Z`)
  const heute = Date.parse(`${stichtag.slice(0, 10)}T00:00:00Z`)
  if (Number.isNaN(eintrag) || Number.isNaN(heute)) return null
  return Math.round((heute - eintrag) / 86_400_000)
}

/**
 * Die Treffer, die den Filter erfüllen.
 *
 * ## Die Entscheidung, die hier drinsteckt
 *
 * Ein Eintrag **ohne** Datum fällt aus dem Altersfilter heraus – er erfüllt
 * ihn nicht, und er erfüllt ihn auch nicht „vielleicht". Ein Kurs ist nicht
 * sieben Tage alt und auch nicht älter; er hat kein Alter. Ihn mitzuzählen
 * hieße zu behaupten, er sei von heute.
 *
 * Damit das keine stille Streichung wird, zeigt die Oberfläche den Altersfilter
 * nur, wenn datierte Treffer dabei sind, und nennt daneben, wie viele es sind.
 */
export function filtere(
  treffer: readonly SearchEntry[],
  filter: Suchfilter,
  stichtag: string
): SearchEntry[] {
  return treffer.filter((eintrag) => {
    if (filter.art !== undefined && eintrag.kind !== filter.art) return false
    if (filter.stufe !== undefined && eintrag.stufe !== filter.stufe) return false

    if (filter.hoechstensTageAlt !== undefined) {
      const alter = alterInTagen(eintrag.datum, stichtag)
      if (alter === null || alter > filter.hoechstensTageAlt) return false
    }

    return true
  })
}

/**
 * Lohnt sich die Filterleiste überhaupt?
 *
 * Bei einer einzigen Art wäre jeder Knopf ein Knopf ohne Wirkung. Die Leiste
 * erscheint deshalb erst ab zwei – dieselbe Regel wie beim Altersfilter und
 * bei den Stufen.
 */
export function filterLohntSich(treffer: readonly SearchEntry[]): boolean {
  return artenMitAnzahl(treffer).length > 1
}
