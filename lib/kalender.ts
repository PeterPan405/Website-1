import { termine as gepflegteTermine } from '@/data/kalender/termine'
import { terminArtReihenfolge, type Termin, type TerminArt } from '@/data/kalender/typen'
import { assertTermineValid } from '@/lib/kalender-validate'
import { getDividendentermine } from '@/lib/dividendentermine'
import { getQuartalstermine } from '@/lib/quartalstermine'

/**
 * Service-Schicht für den Börsenkalender.
 *
 * ## Warum hier nicht sortiert wird nach „heute“
 *
 * Die Seite wird statisch gebaut. „Heute“ wäre also der Tag des letzten
 * Builds, und ein Kalender, der vergangene Termine als kommende ausweist, ist
 * schlimmer als gar keiner. Was zurückkommt, ist deshalb die vollständige
 * Liste in zeitlicher Reihenfolge; ob ein Termin vorbei ist, entscheidet der
 * Browser mit dem echten Datum.
 *
 * Dieselbe Überlegung wie beim rollierenden System der Nachrichten – dort
 * führte sie zur umgekehrten Lösung, weil eine leere Startseite schlimmer
 * gewesen wäre als eine mit älteren Meldungen.
 */

export type { Termin, TerminArt } from '@/data/kalender/typen'
export { nurAufWunsch, terminArtMeta, terminArtReihenfolge } from '@/data/kalender/typen'

/*
  Prüfung beim Laden des Moduls und damit bei jedem Build.

  Ein verrutschter Zinsentscheid sieht aus wie ein richtiger. Deshalb bricht
  der Build ab, statt zu warnen.
*/
/*
  Von Hand gepflegte und abgeleitete Termine in einer Liste.

  Die abgeleiteten tragen `geschaetzt` und lassen sich dadurch überall
  unterscheiden – in der Anzeige, in der Zählung und in jeder Auswertung. Sie
  hier zusammenzuführen statt in der Seite ist Absicht: Sonst müsste jede
  Stelle, die Termine anzeigt, an zwei Quellen denken, und irgendwann würde
  eine davon vergessen.

  Geprüft wird die zusammengeführte Liste, nicht nur der gepflegte Teil. Die
  abgeleiteten Termine stammen aus einer wöchentlich neu gezogenen
  Momentaufnahme der SEC – also aus der Quelle, die niemand hier
  kontrolliert. Genau dort ist eine Prüfung beim Bauen etwas wert: Ein
  Unternehmen, das plötzlich zwei Termine im selben Quartal meldet, ist im
  ersten Lauf tatsächlich vorgekommen.
*/
/*
  Die Dividendentermine kommen aus derselben Art Quelle wie die
  Quartalstermine: hochgerechnet aus einem Muster, deshalb als `geschaetzt`
  gekennzeichnet. Sie sind aber ein Vielfaches an Zahl – siehe `nurAufWunsch`
  in den Typen, das sie in der Ansicht ausschaltet, bis jemand sie einschaltet.
*/
const termine: Termin[] = [
  ...gepflegteTermine,
  ...getQuartalstermine(),
  ...getDividendentermine(),
]

assertTermineValid(termine)

function nachDatum(a: Termin, b: Termin): number {
  if (a.datum !== b.datum) return a.datum.localeCompare(b.datum)
  // Bei gleichem Tag zuerst das, was den Handel bestimmt.
  const rang = (termin: Termin) => terminArtReihenfolge.indexOf(termin.art)
  return rang(a) - rang(b)
}

/** Alle Termine, zeitlich aufsteigend. */
export async function getTermine(): Promise<Termin[]> {
  return [...termine].sort(nachDatum)
}

export interface Monatsgruppe {
  /** `JJJJ-MM`. */
  monat: string
  termine: Termin[]
}

/** Termine nach Monat gruppiert, in zeitlicher Reihenfolge. */
export async function getTermineNachMonat(): Promise<Monatsgruppe[]> {
  const gruppen = new Map<string, Termin[]>()
  for (const termin of [...termine].sort(nachDatum)) {
    const monat = termin.datum.slice(0, 7)
    const liste = gruppen.get(monat) ?? []
    liste.push(termin)
    gruppen.set(monat, liste)
  }
  return [...gruppen.entries()].map(([monat, eintraege]) => ({
    monat,
    termine: eintraege,
  }))
}

/** Wie viele Termine es je Art gibt – für die Filterschalter. */
export async function getTerminAnzahl(): Promise<Record<TerminArt, number>> {
  const anzahl = Object.fromEntries(
    terminArtReihenfolge.map((art) => [art, 0])
  ) as Record<TerminArt, number>
  for (const termin of termine) anzahl[termin.art] += 1
  return anzahl
}

/** Der Zeitraum, den der Kalender abdeckt – gehört sichtbar auf die Seite. */
export async function getKalenderZeitraum(): Promise<{ von: string; bis: string }> {
  const sortiert = [...termine].sort(nachDatum)
  const letzter = sortiert[sortiert.length - 1]
  return {
    von: sortiert[0].datum,
    bis: letzter.bis ?? letzter.datum,
  }
}

/** Alle genannten Quellen, ohne Dopplungen. */
export async function getKalenderQuellen(): Promise<{ label: string; url: string }[]> {
  const nachUrl = new Map<string, { label: string; url: string }>()
  for (const termin of termine) nachUrl.set(termin.quelle.url, termin.quelle)
  return [...nachUrl.values()]
}
