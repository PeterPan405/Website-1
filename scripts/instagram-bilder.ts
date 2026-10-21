/**
 * Sucht für jede Kachel der heutigen Tagesnews ein neues Foto auf Wikimedia
 * Commons und legt es ab – Gründe in `lib/instagram-tagesbilder.ts`.
 *
 * Läuft auf einem GitHub-Läufer (`instagram-bilder.yml`); diese Umgebung
 * erreicht Commons nicht. Schreibt `lib/instagram/tagesbilder/<tag>-<n>.jpg`
 * und trägt jede Datei ins Register ein. Was keine Datei findet, bekommt
 * keinen Eintrag – dort bleibt das feste Motiv.
 *
 *   DATUM=2026-10-21 node --experimental-strip-types \
 *     --import ./scripts/alias-hook.mjs scripts/instagram-bilder.ts
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import sharp from 'sharp'

import { BILDZONE } from '@/lib/instagram-bild'
import { bebildere } from '@/lib/instagram-motive'
import {
  type Kandidat,
  type Tagesbild,
  leseRegister,
  REGISTER,
  suchenFuer,
  TAGESBILDER,
  taugt,
  verwendeteTitel,
} from '@/lib/instagram-tagesbilder'

const DATUM =
  process.env.DATUM ??
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(new Date())
const UA = 'IM-Invests-Bildersuche/1.0 (https://iminvests.de)'
const API = 'https://commons.wikimedia.org/w/api.php'

interface Seite {
  title: string
  index?: number
  imageinfo?: {
    thumburl?: string
    url: string
    descriptionurl: string
    width: number
    height: number
    extmetadata?: Record<string, { value?: string }>
  }[]
}

const ohneHtml = (s = '') =>
  s
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

async function suche(begriff: string): Promise<Seite[]> {
  const url = new URL(API)
  for (const [k, v] of Object.entries({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrnamespace: '6',
    gsrsearch: `${begriff} filetype:bitmap`,
    gsrlimit: '50',
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: '1600',
  }))
    url.searchParams.set(k, v)
  const antwort = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!antwort.ok) throw new Error(`Commons ${antwort.status} für „${begriff}"`)
  const daten = (await antwort.json()) as { query?: { pages?: Record<string, Seite> } }
  return Object.values(daten.query?.pages ?? {}).sort(
    (a, b) => (a.index ?? 0) - (b.index ?? 0)
  )
}

const plan = JSON.parse(readFileSync(`data/instagram/${DATUM}.json`, 'utf8')) as {
  kacheln: { titel: string; text: string }[]
}
const register = leseRegister()
/*
  Steht der Tag schon im Register, bleibt er – ein zweiter Anstoß aus dem
  Bau ersetzte sonst Bilder, die schon geprüft oder veröffentlicht sind.
  Neu gesucht wird nur mit NEU=1.
*/
if (register[DATUM] && process.env.NEU !== '1') {
  console.log(
    `Für ${DATUM} stehen schon Tagesbilder im Register – nichts zu tun (NEU=1 sucht neu).`
  )
  process.exit(0)
}
const verwendet = verwendeteTitel(register)
/* Ein zweiter Lauf am selben Tag ersetzt die Bilder – mit anderen, denn die ersten bleiben verbraucht. */
const heute: Tagesbild[] = []
mkdirSync(TAGESBILDER, { recursive: true })

const themen = bebildere(plan.kacheln)
for (const [i, kachel] of plan.kacheln.entries()) {
  const stelle = i + 2
  let gefunden = false
  for (const s of suchenFuer(kachel.titel, themen[i].motiv ?? 'boerse')) {
    let seiten: Seite[]
    try {
      seiten = await suche(s.begriff)
    } catch (fehler) {
      console.log(`  ${s.begriff}: ${(fehler as Error).message}`)
      continue
    }
    for (const seite of seiten) {
      const info = seite.imageinfo?.[0]
      if (!info) continue
      const meta = info.extmetadata ?? {}
      const kandidat: Kandidat = {
        titel: seite.title,
        breite: info.width,
        hoehe: info.height,
        lizenz: ohneHtml(meta.LicenseShortName?.value),
        einschraenkung: ohneHtml(meta.Restrictions?.value),
      }
      if (!taugt(kandidat, verwendet, s.mussEnthalten)) continue
      const roh = await fetch(info.thumburl ?? info.url, {
        headers: { 'User-Agent': UA },
      })
      if (!roh.ok) continue
      const datei = `${DATUM}-${stelle}.jpg`
      const jpeg = await sharp(Buffer.from(await roh.arrayBuffer()))
        .resize(BILDZONE.breite, 560, { fit: 'cover', position: 'attention' })
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer()
      writeFileSync(join(TAGESBILDER, datei), jpeg)
      heute.push({
        stelle,
        datei,
        titel: seite.title,
        seite: info.descriptionurl,
        lizenz: kandidat.lizenz,
        urheber: ohneHtml(meta.Artist?.value) || 'unbekannt',
        suche: s.begriff,
      })
      verwendet.add(seite.title)
      console.log(
        `Kachel ${stelle} „${kachel.titel}": ${seite.title} (${kandidat.lizenz}, „${s.begriff}")`
      )
      gefunden = true
      break
    }
    if (gefunden) break
  }
  if (!gefunden)
    console.log(
      `::warning::Kachel ${stelle} „${kachel.titel}": kein neues Bild – das feste Motiv bleibt.`
    )
}

register[DATUM] = heute.sort((a, b) => a.stelle - b.stelle)
writeFileSync(REGISTER, `${JSON.stringify(register, null, 2)}\n`)
console.log(`${heute.length} von ${plan.kacheln.length} Kacheln mit Tagesbild.`)
