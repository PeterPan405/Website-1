/**
 * Bilder von Hand wählen – wenn der Morgenlauf nichts Gutes gefunden hat.
 *
 * Betreiber, 21.10.2026, nach dem dritten Anlauf: „was sind das denn jetzt
 * für Bilder bei Google und Haushalt, die anderen waren auch nicht wirklich
 * gut." Der Morgenlauf nimmt den ersten Treffer, der die Regeln erfüllt –
 * ob er gut aussieht, sieht er nicht. Das sieht nur, wer hinschaut.
 *
 * Zwei Schritte, beide auf dem Läufer (`instagram-bilder-auswahl.yml`):
 *
 *   MODUS=kandidaten  EINGABE="2|French soldiers patrol\n4|piggy bank"
 *     Je Zeile bis zu acht Kandidaten, die `taugt()` besteht, verkleinert
 *     auf den wurzellosen Zweig `bilder-kandidaten` – zum Ansehen.
 *
 *   MODUS=wahl  EINGABE="2|File:…jpg\n4|File:…jpg"
 *     Holt genau diese Dateien, prüft sie noch einmal mit `taugt()` und
 *     trägt sie für die Stelle ins Register ein; die übrigen Stellen bleiben.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { datei, kandidatVon, suche, urheberVon, zuschnitt } from '@/lib/commons-suche'
import {
  leseRegister,
  REGISTER,
  TAGESBILDER,
  taugt,
  verwendeteTitel,
} from '@/lib/instagram-tagesbilder'

const DATUM =
  process.env.DATUM ??
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(new Date())
const zeilen = (process.env.EINGABE ?? '')
  .split(/\n|;/)
  .map((z) => z.trim())
  .filter(Boolean)
  .map((z) => {
    const [stelle, ...rest] = z.split('|')
    return { stelle: Number(stelle), wert: rest.join('|').trim() }
  })
  .filter((z) => z.stelle >= 2 && z.wert)

const register = leseRegister()
const verwendet = verwendeteTitel(register)

if (process.env.MODUS === 'kandidaten') {
  const ordner = 'kandidaten'
  mkdirSync(ordner, { recursive: true })
  const liste: {
    stelle: number
    begriff: string
    nr: number
    name: string
    titel: string
    lizenz: string
  }[] = []
  for (const [q, { stelle, wert: begriff }] of zeilen.entries()) {
    let nr = 0
    const gesehen = new Set<string>()
    for (const seite of await suche(begriff)) {
      if (nr >= 8) break
      const k = kandidatVon(seite)
      if (!k || gesehen.has(k.titel) || !taugt(k, verwendet)) continue
      gesehen.add(k.titel)
      const bild = await zuschnitt(seite, 505, 280)
      if (!bild) continue
      nr++
      const name = `${stelle}-${q + 1}-${nr}.jpg`
      writeFileSync(join(ordner, name), bild)
      liste.push({ stelle, begriff, nr, name, titel: k.titel, lizenz: k.lizenz })
    }
    console.log(`Stelle ${stelle}, „${begriff}": ${nr} Kandidaten`)
  }
  writeFileSync(join(ordner, 'kandidaten.json'), `${JSON.stringify(liste, null, 2)}\n`)
} else if (process.env.MODUS === 'wahl') {
  mkdirSync(TAGESBILDER, { recursive: true })
  const heute = register[DATUM] ?? []
  for (const { stelle, wert: titel } of zeilen) {
    const seite = await datei(titel)
    const k = seite && kandidatVon(seite)
    if (!seite || !k) throw new Error(`${titel}: nicht gefunden`)
    if (!taugt(k, verwendet))
      throw new Error(`${titel}: taugt nicht (Lizenz, Format oder verwendet)`)
    const jpeg = await zuschnitt(seite)
    if (!jpeg) throw new Error(`${titel}: nicht zu laden`)
    const name = `${DATUM}-${stelle}.jpg`
    writeFileSync(join(TAGESBILDER, name), jpeg)
    const eintrag = {
      stelle,
      datei: name,
      titel: seite.title,
      seite: seite.imageinfo![0].descriptionurl,
      lizenz: k.lizenz,
      urheber: urheberVon(seite),
      suche: 'von Hand gewählt',
    }
    const alt = heute.findIndex((b) => b.stelle === stelle)
    if (alt >= 0) heute[alt] = eintrag
    else heute.push(eintrag)
    verwendet.add(seite.title)
    console.log(`Stelle ${stelle}: ${seite.title} (${k.lizenz})`)
  }
  register[DATUM] = heute.sort((a, b) => a.stelle - b.stelle)
  writeFileSync(REGISTER, `${JSON.stringify(register, null, 2)}\n`)
} else {
  throw new Error('MODUS=kandidaten oder MODUS=wahl')
}
