import bestand from '@/data/snapshots/marktbreite.json'

import {
  einordnungssatz,
  ordneBreiteEin,
  type Breitenpunkt,
  type Einordnung,
} from '@/lib/marktbreite'

/**
 * Der aufgezeichnete Verlauf der Marktbreite.
 *
 * Die Aufzeichnung entsteht beim Kursabruf (`scripts/kurse-abrufen.ts`) und
 * wächst um eine Zeile je Handelstag. Solange sie kurz ist, gibt es keine
 * Einordnung – siehe `MINDESTTAGE` in `lib/marktbreite.ts`.
 */

interface Momentaufnahme {
  abgerufenAm: string | null
  reihe: Breitenpunkt[]
}

const daten = bestand as Momentaufnahme

/** Alle aufgezeichneten Tage, ältester zuerst. */
export function getBreitenverlauf(): Breitenpunkt[] {
  return daten.reihe
}

/** Wann zuletzt aufgezeichnet wurde – `null`, solange kein Lauf war. */
export const breitenverlaufStand: string | null = daten.abgerufenAm

export type { Breitenpunkt, Einordnung }

/**
 * Wo die heutige Breite im bisherigen Verlauf liegt.
 *
 * Der heutige Tag wird aus dem Vergleich genommen: Verglichen wird gegen das,
 * was vorher war. Ohne diesen Schritt verglich sich der Tag zum Teil mit sich
 * selbst, und der Rang wäre systematisch zu niedrig.
 */
export function getBreiteneinordnung(
  heute: number,
  heutigerTag?: string
): { einordnung: Einordnung | null; satz: string } {
  const vorher = heutigerTag
    ? daten.reihe.filter((punkt) => punkt.d < heutigerTag)
    : daten.reihe
  const einordnung = ordneBreiteEin(vorher, heute)
  return { einordnung, satz: einordnungssatz(einordnung) }
}
