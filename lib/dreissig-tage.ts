import { dreissigTage, type Programmtag } from '@/data/learn/dreissig-tage'
import { loeseSchrittAuf, type AufgeloesterSchritt } from '@/lib/lernpfade'

/**
 * Service-Schicht des 30-Tage-Programms.
 *
 * Die Verweise werden mit demselben Auflöser wie die Lernpfade beim Laden
 * des Moduls aufgelöst – ein Tippfehler in einem Slug bricht den Build ab.
 * Zusätzlich zwei eigene Zusicherungen: genau 30 Tage, lückenlos nummeriert.
 * Ein „30-Tage-Programm“ mit 28 Einträgen wäre genau die Art stiller
 * Fehler, den erst ein Besucher bemerkt.
 */

export interface AufgeloesterTag extends Programmtag {
  aufgeloest: AufgeloesterSchritt[]
}

export interface Programmwoche {
  nummer: number
  titel: string
  tage: AufgeloesterTag[]
}

const WOCHENTITEL = [
  'Das Fundament',
  'Der Markt',
  'Die Praxis',
  'Einordnung und Vertiefung',
]

const aufgeloest: AufgeloesterTag[] = dreissigTage.map((tag) => ({
  ...tag,
  aufgeloest: tag.schritte.map(loeseSchrittAuf),
}))

if (aufgeloest.length !== 30) {
  throw new Error(`30-Tage-Programm hat ${aufgeloest.length} Tage.`)
}
aufgeloest.forEach((tag, index) => {
  if (tag.tag !== index + 1) {
    throw new Error(`30-Tage-Programm: Tag ${index + 1} trägt die Nummer ${tag.tag}.`)
  }
})

export async function getProgrammwochen(): Promise<Programmwoche[]> {
  return WOCHENTITEL.map((titel, index) => ({
    nummer: index + 1,
    titel,
    // Woche 1–3 haben je 7 Tage, Woche 4 die restlichen 9 – der Schnitt
    // liegt bei den Kalenderwochen, nicht bei gleich großen Blöcken.
    tage: aufgeloest.slice(index * 7, index === 3 ? 30 : (index + 1) * 7),
  }))
}

/** Die Kennungen aller Stufen-Schritte – für die Fortschrittsanzeige. */
export async function getProgrammKennungen(): Promise<string[]> {
  return aufgeloest.flatMap((tag) =>
    tag.aufgeloest.flatMap((schritt) =>
      schritt.art === 'stufe' ? [schritt.kennung] : []
    )
  )
}

/** Summe der Lesezeiten über alle Stufen, in Minuten. */
export async function getProgrammLesezeit(): Promise<number> {
  return aufgeloest.reduce(
    (summe, tag) =>
      summe +
      tag.aufgeloest.reduce(
        (tagSumme, schritt) =>
          schritt.art === 'stufe' ? tagSumme + schritt.lesezeit : tagSumme,
        0
      ),
    0
  )
}
