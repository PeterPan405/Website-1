/**
 * Die Suche auf Wikimedia Commons – für `scripts/instagram-bilder.ts` (der
 * Morgenlauf) und `scripts/instagram-bilder-auswahl.ts` (Kandidaten zum
 * Ansehen, Wahl von Hand). Läuft nur auf einem Läufer; diese Umgebung
 * erreicht Commons nicht.
 */
import sharp from 'sharp'

import { BILDZONE } from '@/lib/instagram-bild'
import type { Kandidat } from '@/lib/instagram-tagesbilder'

export const UA = 'IM-Invests-Bildersuche/1.0 (https://iminvests.de)'
const API = 'https://commons.wikimedia.org/w/api.php'

export interface Seite {
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

export const ohneHtml = (s = '') =>
  s
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const BILDINFO = {
  action: 'query',
  format: 'json',
  prop: 'imageinfo',
  iiprop: 'url|size|extmetadata',
  iiurlwidth: '1600',
}

async function abfrage(parameter: Record<string, string>): Promise<Seite[]> {
  const url = new URL(API)
  for (const [k, v] of Object.entries({ ...BILDINFO, ...parameter }))
    url.searchParams.set(k, v)
  const antwort = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!antwort.ok) throw new Error(`Commons ${antwort.status}`)
  const daten = (await antwort.json()) as { query?: { pages?: Record<string, Seite> } }
  return Object.values(daten.query?.pages ?? {}).sort(
    (a, b) => (a.index ?? 0) - (b.index ?? 0)
  )
}

/*
  Zuerst unter den ausgezeichneten Fotos von Commons („Quality images"),
  dann im ganzen Bestand – die ausgezeichneten sind scharf, gut belichtet
  und fast immer Fotos.
*/
export async function suche(begriff: string): Promise<Seite[]> {
  return [
    ...(await sucheIn(`${begriff} incategory:Quality_images`)),
    ...(await sucheIn(begriff)),
  ]
}

export function sucheIn(begriff: string): Promise<Seite[]> {
  return abfrage({
    generator: 'search',
    gsrnamespace: '6',
    gsrsearch: `${begriff} filetype:bitmap`,
    gsrlimit: '50',
  })
}

/** Eine Datei beim Titel – für die Wahl von Hand. */
export async function datei(titel: string): Promise<Seite | null> {
  return (await abfrage({ titles: titel }))[0] ?? null
}

/** Was `taugt()` über eine Seite wissen muss. */
export function kandidatVon(seite: Seite): Kandidat | null {
  const info = seite.imageinfo?.[0]
  if (!info) return null
  const meta = info.extmetadata ?? {}
  return {
    titel: seite.title,
    breite: info.width,
    hoehe: info.height,
    lizenz: ohneHtml(meta.LicenseShortName?.value),
    einschraenkung: ohneHtml(meta.Restrictions?.value),
  }
}

/** Das Foto, zugeschnitten auf die Bildzone der Kachel. */
export async function zuschnitt(seite: Seite, breite = BILDZONE.breite, hoehe = 560) {
  const info = seite.imageinfo![0]
  const roh = await fetch(info.thumburl ?? info.url, { headers: { 'User-Agent': UA } })
  if (!roh.ok) return null
  return sharp(Buffer.from(await roh.arrayBuffer()))
    .resize(breite, hoehe, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer()
}

export function urheberVon(seite: Seite): string {
  return ohneHtml(seite.imageinfo?.[0]?.extmetadata?.Artist?.value) || 'unbekannt'
}

/**
 * Ein Firmenlogo als Bild der Kachel – zentriert auf einer ruhigen Fläche.
 *
 * Betreiber, 24.10.2026, nach dem dritten gelöschten Beitrag: Für Munich Re
 * kam ein unbekannter Redner, für American Express eine Kreditkarte mit dem
 * Namen eines Fremden. Freie Fotos, auf denen eine Marke gut zu sehen ist,
 * gibt es auf Commons für die wenigsten Unternehmen – die Logos selbst liegen
 * dort fast immer gemeinfrei (zu einfach für ein Schutzrecht). So arbeiten
 * auch Trade Republic und HKCM: das Logo, nicht ein Zufallsfoto.
 *
 * Commons rechnet ein SVG über `thumburl` in ein PNG um; das wird auf
 * `farbe` gelegt, höchstens 62 % breit und 46 % hoch.
 */
export async function logobild(
  seite: Seite,
  farbe: string,
  breite = BILDZONE.breite,
  hoehe = 560
) {
  const info = seite.imageinfo![0]
  const roh = await fetch(info.thumburl ?? info.url, { headers: { 'User-Agent': UA } })
  if (!roh.ok) return null
  const logo = await sharp(Buffer.from(await roh.arrayBuffer()))
    .resize(Math.round(breite * 0.62), Math.round(hoehe * 0.46), { fit: 'inside' })
    .png()
    .toBuffer()
  return sharp({
    create: { width: breite, height: hoehe, channels: 3, background: farbe },
  })
    .composite([{ input: logo, gravity: 'center' }])
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer()
}
