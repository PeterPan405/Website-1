/**
 * Rechnet die Marktbreite für die zurückliegenden Handelstage nach.
 *
 * ## Warum es dieses Skript gibt
 *
 * Die laufende Aufzeichnung im Kursabruf beginnt an dem Tag, an dem sie
 * eingeführt wurde. Eine Einordnung braucht aber Geschichte – und die liegt
 * bereits vor: In `markets.json` steht für jede der geführten Aktien der
 * Schlusskurs je Handelstag. Was dort fehlt, ist nur die Zusammenfassung.
 *
 * Ohne dieses Skript wäre die Seite einen Monat lang eine leere Versprechung.
 * Mit ihm steht sie vom ersten Tag an mit echter Geschichte da.
 *
 * ## Warum nur der jüngere Teil der Reihe zählt
 *
 * Die Momentaufnahme führt die letzten rund vierhundert Tage vollständig und
 * davor einen Wert je Woche. Eine „Tagesveränderung“ aus zwei Punkten, die
 * eine Woche auseinanderliegen, wäre eine Wochenveränderung – und als
 * Tagesbreite ausgewiesen schlicht falsch.
 *
 * Gezählt wird ein Titel deshalb nur, wenn sein vorheriger Punkt **höchstens
 * vier Kalendertage** zurückliegt. Vier, weil ein Wochenende drei Tage
 * Abstand erzeugt und ein Feiertag am Montag vier.
 *
 * ## Warum es den Bestand nicht überschreibt
 *
 * Vorhandene Tage bleiben stehen. Der Kursabruf schreibt sie aus den
 * tatsächlichen Kursen zum Handelsschluss; diese Nachrechnung arbeitet mit den
 * gespeicherten Schlusskursen und ist die schwächere Quelle. Wo beide etwas zu
 * sagen haben, gewinnt die laufende Aufzeichnung.
 *
 * Aufruf: `npm run marktbreite`
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

import { marketDefinitions } from '../data/markets.ts'
import {
  nurZusammenhaengend,
  serialisiereBreite,
  type Breitenpunkt,
} from '../lib/marktbreite.ts'

const QUELLE = 'data/snapshots/markets.json'
const ZIEL = 'data/snapshots/marktbreite.json'

/** Größter Abstand zum Vorpunkt, der noch als „Vortag“ durchgeht. */
export const HOECHSTABSTAND_TAGE = 4

interface Punkt {
  d: string
  c: number
}

/**
 * Die Tagesveränderungen je Handelstag.
 *
 * Der Rückgabewert ist eine Zuordnung von Datum auf die Liste der
 * prozentualen Veränderungen aller Titel, die an diesem Tag gehandelt wurden
 * und einen brauchbaren Vortag haben.
 */
export function sammleVeraenderungen(
  reihen: readonly (readonly Punkt[])[],
  hoechstabstand = HOECHSTABSTAND_TAGE
): Map<string, number[]> {
  const jeTag = new Map<string, number[]>()

  for (const reihe of reihen) {
    for (let index = 1; index < reihe.length; index += 1) {
      const heute = reihe[index]
      const vorher = reihe[index - 1]
      if (vorher.c <= 0) continue

      const abstand =
        (Date.parse(`${heute.d}T00:00:00Z`) - Date.parse(`${vorher.d}T00:00:00Z`)) /
        86_400_000
      if (!Number.isFinite(abstand) || abstand <= 0 || abstand > hoechstabstand) continue

      const prozent = ((heute.c - vorher.c) / vorher.c) * 100
      const liste = jeTag.get(heute.d)
      if (liste) liste.push(prozent)
      else jeTag.set(heute.d, [prozent])
    }
  }

  return jeTag
}

/**
 * Macht aus den Veränderungen eines Tages einen Breitenpunkt.
 *
 * Dieselbe Rechnung wie in `lib/marktbericht.ts`: Die Breite ist der Anteil
 * der **bewegten** Titel, die in die Richtung des Tagesschnitts liefen.
 * Unveränderte zählen nicht mit – sie sind weder dafür noch dagegen.
 */
export function baueBreitenpunkt(
  tag: string,
  veraenderungen: readonly number[]
): Breitenpunkt | null {
  if (veraenderungen.length === 0) return null

  let steigend = 0
  let fallend = 0
  let unveraendert = 0
  for (const prozent of veraenderungen) {
    if (prozent > 0) steigend += 1
    else if (prozent < 0) fallend += 1
    else unveraendert += 1
  }

  const schnitt =
    veraenderungen.reduce((summe, wert) => summe + wert, 0) / veraenderungen.length
  const bewegt = steigend + fallend
  const mitDerRichtung = schnitt >= 0 ? steigend : fallend

  return {
    d: tag,
    steigend,
    fallend,
    unveraendert,
    schnitt: Math.round(schnitt * 100) / 100,
    breite: bewegt > 0 ? Math.round((mitDerRichtung / bewegt) * 1000) / 10 : 0,
  }
}

/**
 * Ab wie vielen Titeln ein Tag überhaupt gezählt wird.
 *
 * An den Rändern der Reihe – dem ältesten Tag, einem Feiertag an den meisten
 * Börsen – liegen nur eine Handvoll Kurse vor. Eine „Marktbreite“ aus zwanzig
 * Titeln ist keine Aussage über den Markt, sondern über zwanzig Titel.
 */
export const MINDESTZAHL_TITEL = 100

async function main(): Promise<void> {
  const bestand = JSON.parse(readFileSync(QUELLE, 'utf8')) as {
    instruments: Record<string, { points: Punkt[] }>
  }

  const aktien = marketDefinitions.filter((eintrag) => eintrag.kind === 'stock')
  const reihen = aktien
    .map((definition) => bestand.instruments[definition.symbol]?.points)
    .filter((punkte): punkte is Punkt[] => Array.isArray(punkte) && punkte.length > 1)

  console.log(`[breite] ${reihen.length} von ${aktien.length} Aktien mit Kursreihe.`)

  const jeTag = sammleVeraenderungen(reihen)
  const punkte: Breitenpunkt[] = []
  let verworfen = 0

  for (const [tag, veraenderungen] of [...jeTag].sort((a, b) =>
    a[0].localeCompare(b[0])
  )) {
    if (veraenderungen.length < MINDESTZAHL_TITEL) {
      verworfen += 1
      continue
    }
    const punkt = baueBreitenpunkt(tag, veraenderungen)
    if (punkt) punkte.push(punkt)
  }

  console.log(
    `[breite] ${punkte.length} Handelstage nachgerechnet, ` +
      `${verworfen} mit weniger als ${MINDESTZAHL_TITEL} Titeln verworfen.`
  )
  if (punkte.length === 0) {
    console.error('[breite] Nichts nachzutragen – Datei bleibt unberührt.')
    process.exitCode = 1
    return
  }

  /*
    Vorhandene Tage bleiben stehen: Die laufende Aufzeichnung kennt den
    tatsächlichen Stand zum Handelsschluss, diese Nachrechnung nur die
    gespeicherten Schlusskurse.
  */
  let vorhanden: { abgerufenAm: string | null; reihe: Breitenpunkt[] }
  try {
    vorhanden = JSON.parse(readFileSync(ZIEL, 'utf8'))
  } catch {
    vorhanden = { abgerufenAm: null, reihe: [] }
  }
  const schonDa = new Set(vorhanden.reihe.map((punkt) => punkt.d))
  /*
    Nur der zusammenhängende Teil. Am Rand der Momentaufnahme steht ein
    einzelner Tag aus dem Jahr 2021 – dort grenzt der letzte wöchentliche Punkt
    zufällig an einen benachbarten Handelstag. Richtig gerechnet, aber vier
    Jahre von allem anderen entfernt; die Begründung steht bei
    `nurZusammenhaengend`.
  */
  const ergaenzt = nurZusammenhaengend([
    ...vorhanden.reihe,
    ...punkte.filter((punkt) => !schonDa.has(punkt.d)),
  ])

  writeFileSync(
    ZIEL,
    serialisiereBreite({ abgerufenAm: new Date().toISOString(), reihe: ergaenzt })
  )

  const erster = ergaenzt[0]
  const letzter = ergaenzt[ergaenzt.length - 1]
  console.log(
    `[breite] ${ergaenzt.length} Tage in ${ZIEL} (${erster.d} bis ${letzter.d}), ` +
      `${ergaenzt.length - vorhanden.reihe.length} neu.`
  )
}

/*
  Nur ausführen, wenn dieses Skript direkt aufgerufen wurde – damit ein Test,
  der die Zerlegung prüft, keinen Bestand überschreibt.
*/
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}
