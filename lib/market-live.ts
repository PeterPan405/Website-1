import kursstand from '@/data/snapshots/kurse-aktuell.json'
import snapshot from '@/data/snapshots/markets.json'

import type { SeriesPoint } from '@/data/markets'
import type {
  Kursstand,
  MarketSnapshot,
  SnapshotInstrument,
} from '@/lib/providers/snapshot'

/**
 * Zugriff auf die abgerufenen Kurse.
 *
 * Die Momentaufnahme liegt als JSON im Repository und wird beim Bauen
 * eingebunden – zur Laufzeit gibt es keinen Server, der etwas nachladen könnte.
 * Erneuert wird sie werktäglich durch `.github/workflows/kurse.yml`.
 *
 * Nicht jedes Instrument ist enthalten. Für `msci-world` gibt es keine frei
 * zugängliche Quelle; solche Instrumente liefern hier `null`, und die
 * Service-Schicht fällt auf die gekennzeichneten Demo-Daten zurück. Dieser
 * Zustand ist dauerhaft vorgesehen, nicht bloß ein Übergang.
 */

/*
  Zwei Dateien, eine Sicht nach außen.

  `markets.json` trägt die Tagesreihen und wächst einmal je Börsentag;
  `kurse-aktuell.json` trägt den zuletzt gehandelten Preis und die
  Devisenkurse und wird alle dreißig Minuten geschrieben. Der Grund für die
  Trennung steht am Typ `Kursstand` – kurz: eine Datei von neunzehn Megabyte
  zweiundvierzig Mal am Tag neu zu schreiben, lässt das Repository wachsen,
  ohne dass es jemandem auffällt.

  Zusammengeführt wird hier, damit der Rest der Website davon nichts merkt.
*/
const daten = snapshot as MarketSnapshot
const stand = kursstand as Kursstand

/**
 * Wann der Abruf zuletzt lief – `null`, solange noch keiner lief.
 *
 * Aus dem Kursstand, nicht aus der Historie: Er ist der jüngere von beiden,
 * und die Zeile „Stand …“ auf der Marktseite soll sagen, wie alt die Kurse
 * sind, nicht wann zuletzt ein Handelstag dazukam.
 */
export const snapshotFetchedAt: string | null = stand.fetchedAt ?? daten.fetchedAt

/**
 * Die Euro-Referenzkurse der EZB vom jüngsten Handelstag.
 *
 * `null`, solange die Momentaufnahme sie nicht enthält – geschrieben werden sie
 * erst seit dem Umbau des Kursabrufs. Wer damit rechnet, muss den Fall
 * behandeln, statt einen Kurs zu erfinden.
 */
export function getDevisenkurse(): {
  stand: string
  jeEuro: Record<string, number>
} | null {
  // Zuerst der Kursstand, ersatzweise die Historie – Letzteres nur, damit
  // eine Momentaufnahme von vor der Trennung noch gelesen werden kann.
  const tabelle = stand.devisen ?? daten.devisen
  if (!tabelle?.stand || !tabelle.jeEuro) return null
  return tabelle
}

/** Herkunft der Kurse eines Instruments, wie sie unter dem Chart steht. */
export interface QuoteSource {
  label: string
  url: string
}

export interface LiveSeries {
  /** Aufsteigend nach Datum, ein Wert je Handelstag. */
  daily: SeriesPoint[]
  source: QuoteSource
  /** Handelstag des jüngsten Schlusskurses, YYYY-MM-DD. */
  asOf: string
  /** Zuletzt gehandelter Preis samt Zeitpunkt, falls vorhanden. */
  latest: { value: number; at: string } | null
}

/**
 * Die abgerufene Reihe eines Instruments – oder `null`.
 *
 * `null` heißt: keine echten Daten vorhanden. Entweder gibt es für dieses
 * Instrument keine Quelle, oder der Workflow lief noch nie.
 */
export function getLiveSeries(symbol: string): LiveSeries | null {
  const eintrag: SnapshotInstrument | undefined = daten.instruments[symbol]
  if (!eintrag || eintrag.points.length < 2) return null

  return {
    /*
      Umbenennung von `d`/`c` auf das Format der Website.

      Die Momentaufnahme benutzt kurze Schlüssel, weil sie werktäglich neu im
      Repository landet und jedes Zeichen mal Anzahl Punkte mal Anzahl Commits
      zählt. Nach außen bleibt es beim ausgeschriebenen Format – dort wiegt
      Lesbarkeit mehr als Größe.
    */
    daily: eintrag.points.map((punkt) => ({ t: punkt.d, value: punkt.c })),
    source: { label: eintrag.sourceLabel, url: eintrag.sourceUrl },
    asOf: eintrag.asOf,
    /*
      Der aktuelle Preis kommt aus der zweiten Datei. `eintrag.latest` steht
      ersatzweise dahinter: Eine Momentaufnahme aus der Zeit vor der Trennung
      trägt ihn noch mit, und die soll lesbar bleiben.
    */
    latest: stand.latest[symbol] ?? eintrag.latest ?? null,
  }
}

/** Alle Instrumente, für die echte Kurse vorliegen. */
export function liveSymbols(): string[] {
  return Object.keys(daten.instruments)
}
