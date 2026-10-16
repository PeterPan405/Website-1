import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { aktuelleZahlenkarte } from '@/data/instagram-zahlenkarten'
import { titelmotiv } from '@/lib/instagram-motive'
import {
  TITELBILD_FOTO_HOEHE,
  titelbildPng,
  ZK_BREITE,
} from '@/lib/instagram-zahlenkarte'

/**
 * Das Titelbild des Tagesbeitrags – die erste Seite des Karussells, vor der
 * Zahlenkarte (`zahlenkarte.jpg`). Meta holt beide von hier.
 *
 * Das Foto wird aus dem Deckblatt geschnitten, aus dem auch das Motiv der
 * Tageskacheln stammt – hier aber größer: unterhalb der eingebrannten
 * Überschrift auf die volle Breite (siehe `lib/instagram-motive.ts`).
 */
export const dynamic = 'force-static'

export async function GET() {
  const karte = aktuelleZahlenkarte()
  if (!karte) return new Response('Keine Zahlenkarte.', { status: 404 })
  const logo = readFileSync(join(process.cwd(), 'public/logo.svg'), 'utf8')
  const { default: sharp } = await import('sharp')
  const quelle = join(
    process.cwd(),
    'lib/instagram/titelbilder',
    titelmotiv(karte).quelle
  )
  const { width = 0, height = 0 } = await sharp(quelle).metadata()
  const oben = Math.round(height * 0.3)
  const foto = await sharp(quelle)
    .extract({ left: 0, top: oben, width, height: height - oben })
    .resize(ZK_BREITE, TITELBILD_FOTO_HOEHE, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 90 })
    .toBuffer()
  const jpeg = await sharp(await titelbildPng(karte, logo, foto))
    .jpeg({ quality: 92 })
    .toBuffer()
  return new Response(new Uint8Array(jpeg), {
    headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=300' },
  })
}
