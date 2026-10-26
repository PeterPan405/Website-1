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

import {
  kandidatVon,
  type Seite,
  suche,
  sucheIn,
  urheberVon,
  zuschnitt,
} from '@/lib/commons-suche'
import { bebildere, kursZurKachel } from '@/lib/instagram-motive'
import {
  dateiname,
  doppelteBilder,
  type Tagesbild,
  leseRegister,
  MARKENBILD,
  REGISTER,
  suchenFuer,
  TAGESBILDER,
  taugt,
  verwendeteTitel,
} from '@/lib/instagram-tagesbilder'

const DATUM =
  process.env.DATUM ??
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(new Date())
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
/*
  Ein zweiter Lauf am selben Tag ersetzt die Bilder – mit anderen, denn die
  ersten bleiben verbraucht. Mit NUR=4,6 nur diese Stellen; die übrigen
  bleiben, wie sie sind (21.10.2026: vier passten, eins nicht).
*/
const nur = (process.env.NUR ?? '').split(',').map(Number).filter(Boolean)
const heute: Tagesbild[] = nur.length
  ? (register[DATUM] ?? []).filter((b) => !nur.includes(b.stelle))
  : []
mkdirSync(TAGESBILDER, { recursive: true })

const themen = bebildere(plan.kacheln)
for (const [i, kachel] of plan.kacheln.entries()) {
  const stelle = i + 2
  if (nur.length && !nur.includes(stelle)) continue
  let gefunden = false
  const suchen = suchenFuer(kachel.titel, themen[i].motiv ?? 'boerse', kachel.text)
  /*
    Ein Unternehmen ohne Markenfoto bekommt seinen Kursverlauf, nicht ein
    Foto aus den allgemeinen Begriffen (Betreiber, 24.10.2026: „Wenn sich da
    kein richtiges Bild finden lässt, dann einfach ein Chart"). Am selben Tag
    kamen für Munich Re ein unbekannter Redner und für American Express eine
    Kreditkarte mit fremdem Namen.
  */
  /*
    Und hat das Unternehmen einen Kurs im Bestand, kommt gleich der Verlauf –
    ohne Umweg über die Markensuche. Am 26.10.2026 fand „Alphabet sign" eine
    Tafel der tansanischen Gebärdensprache („Manual alphabet – F"): Wort und
    Schild standen beide im Titel, das Bild hatte mit Google nichts zu tun.
  */
  const symbol = suchen.some((s) => s.marke) ? kursZurKachel(kachel.titel) : null
  for (const s of suchen) {
    if (symbol) {
      heute.push({
        stelle,
        datei: '',
        titel: `Kurs: ${symbol}`,
        seite: '',
        lizenz: 'Kursgrafik',
        urheber: '',
        suche: 'kein Markenfoto – Kursverlauf',
        kurs: symbol,
      })
      console.log(
        `Kachel ${stelle} „${kachel.titel}": kein Markenfoto – Kursverlauf ${symbol}`
      )
      gefunden = true
      break
    }
    let seiten: Seite[]
    try {
      seiten = s.nurAusgezeichnet
        ? await sucheIn(`${s.begriff} incategory:Quality_images`)
        : await suche(s.begriff)
    } catch (fehler) {
      console.log(`  ${s.begriff}: ${(fehler as Error).message}`)
      continue
    }
    for (const seite of seiten) {
      const kandidat = kandidatVon(seite)
      if (
        !kandidat ||
        !taugt(kandidat, verwendet, s.mussEnthalten, s.stichwoerter, s.person)
      )
        continue
      if (s.marke && !MARKENBILD.test(seite.title)) continue
      const jpeg = await zuschnitt(seite)
      if (!jpeg) continue
      const datei = dateiname(DATUM, stelle, seite.title)
      writeFileSync(join(TAGESBILDER, datei), jpeg)
      heute.push({
        stelle,
        datei,
        titel: seite.title,
        seite: seite.imageinfo![0].descriptionurl,
        lizenz: kandidat.lizenz,
        urheber: urheberVon(seite),
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

const doppelt = doppelteBilder(heute)
if (doppelt.length) throw new Error(`Doppelt: ${doppelt.join('; ')}`)
register[DATUM] = heute.sort((a, b) => a.stelle - b.stelle)
writeFileSync(REGISTER, `${JSON.stringify(register, null, 2)}\n`)
console.log(`${heute.length} von ${plan.kacheln.length} Kacheln mit Tagesbild.`)
