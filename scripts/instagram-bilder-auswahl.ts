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
 *
 *   MODUS=kurs  EINGABE="4|munich-re"
 *     Statt eines Fotos der Kursverlauf des Symbols (`kachelKurs()`).
 *
 *   MODUS=logo  EINGABE="4|File:…logo.svg|#FFFFFF"
 *     Das Firmenlogo auf einer Fläche in der genannten Farbe (`logobild()`),
 *     eingetragen wie eine Wahl. Nur freie Lizenzen; der Markenhinweis von
 *     Commons hält ein Logo nicht auf – er gilt jedem Logo.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { marketDefinitions } from '@/data/markets'
import {
  datei,
  kandidatVon,
  logobild,
  suche,
  urheberVon,
  zuschnitt,
} from '@/lib/commons-suche'
import {
  dateiname,
  doppelteBilder,
  leseRegister,
  REGISTER,
  type Tagesbild,
  TAGESBILDER,
  taugt,
  verwendeteTitel,
} from '@/lib/instagram-tagesbilder'

/**
 * Sortiert die Einträge des Tages und hält an, wenn zwei Kacheln dasselbe
 * Bild zeigten – dann bleibt das Register, wie es war. Am 26.10.2026 stand
 * das Audi-Werk zweimal im Beitrag, auch bei der Ifo-Kachel.
 */
function einmalig(heute: Tagesbild[]): Tagesbild[] {
  const fehler = doppelteBilder(heute)
  if (fehler.length) throw new Error(`Doppelt: ${fehler.join('; ')}`)
  return heute.sort((a, b) => a.stelle - b.stelle)
}

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
      if (!k || gesehen.has(k.titel) || !taugt(k, verwendet, undefined, undefined, true))
        continue
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
    /* Von Hand gewählt: ein Mensch sieht hin, Pressekonferenz und Treffen dürfen. */
    if (!taugt(k, verwendet, undefined, undefined, true))
      throw new Error(`${titel}: taugt nicht (Lizenz, Format oder verwendet)`)
    const jpeg = await zuschnitt(seite)
    if (!jpeg) throw new Error(`${titel}: nicht zu laden`)
    const name = dateiname(DATUM, stelle, seite.title)
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
  register[DATUM] = einmalig(heute)
  writeFileSync(REGISTER, `${JSON.stringify(register, null, 2)}\n`)
} else if (process.env.MODUS === 'kurs') {
  const heute = register[DATUM] ?? []
  for (const { stelle, wert: symbol } of zeilen) {
    if (!marketDefinitions.some((m) => m.symbol === symbol))
      throw new Error(`${symbol}: steht nicht im Kursbestand`)
    const eintrag = {
      stelle,
      datei: '',
      titel: `Kurs: ${symbol}`,
      seite: '',
      lizenz: 'Kursgrafik',
      urheber: '',
      suche: 'von Hand: Kursverlauf',
      kurs: symbol,
    }
    const alt = heute.findIndex((b) => b.stelle === stelle)
    if (alt >= 0) heute[alt] = eintrag
    else heute.push(eintrag)
    console.log(`Stelle ${stelle}: Kursverlauf ${symbol}`)
  }
  register[DATUM] = einmalig(heute)
  writeFileSync(REGISTER, `${JSON.stringify(register, null, 2)}\n`)
} else if (process.env.MODUS === 'logo') {
  mkdirSync(TAGESBILDER, { recursive: true })
  const heute = register[DATUM] ?? []
  for (const { stelle, wert } of zeilen) {
    const [titel, farbe = '#FFFFFF'] = wert.split('|').map((x) => x.trim())
    const seite = await datei(titel)
    const k = seite && kandidatVon(seite)
    if (!seite || !k) throw new Error(`${titel}: nicht gefunden`)
    if (!/^(Public domain|CC0|PD\b|PDM|CC BY(-SA)? \d)/i.test(k.lizenz))
      throw new Error(`${titel}: Lizenz „${k.lizenz}" ist nicht frei`)
    if (!/^#[0-9a-f]{6}$/i.test(farbe)) throw new Error(`${farbe}: keine Farbe`)
    const jpeg = await logobild(seite, farbe)
    if (!jpeg) throw new Error(`${titel}: nicht zu laden`)
    const name = dateiname(DATUM, stelle, seite.title)
    writeFileSync(join(TAGESBILDER, name), jpeg)
    const eintrag = {
      stelle,
      datei: name,
      titel: seite.title,
      seite: seite.imageinfo![0].descriptionurl,
      lizenz: k.lizenz,
      urheber: urheberVon(seite),
      suche: `Logo auf ${farbe}`,
    }
    const alt = heute.findIndex((b) => b.stelle === stelle)
    if (alt >= 0) heute[alt] = eintrag
    else heute.push(eintrag)
    console.log(`Stelle ${stelle}: ${seite.title} (${k.lizenz}) auf ${farbe}`)
  }
  register[DATUM] = einmalig(heute)
  writeFileSync(REGISTER, `${JSON.stringify(register, null, 2)}\n`)
} else {
  throw new Error('MODUS=kandidaten, wahl, logo oder kurs')
}
