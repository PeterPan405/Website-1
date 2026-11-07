import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { aktuelleZahlenkarte } from '@/data/instagram-zahlenkarten'
import { zahlenkarteSeitePng } from '@/lib/instagram-zahlenkarte'

/**
 * Kachel 8 eines Zahlenstrahls (Sorte D, bis zu acht Kacheln). Hat die
 * Karte weniger Seiten, steht hier die letzte – damit die Datei beim
 * statischen Export immer entsteht. Wie viele es sind, sagt
 * `zahlenkarte.txt` („seiten N" in Zeile 2).
 */
export const dynamic = 'force-static'

export async function GET() {
  const karte = aktuelleZahlenkarte()
  if (!karte) return new Response('Keine Zahlenkarte.', { status: 404 })
  const logo = readFileSync(join(process.cwd(), 'public/logo.svg'), 'utf8')
  const { default: sharp } = await import('sharp')
  const jpeg = await sharp(await zahlenkarteSeitePng(karte, logo, 8))
    .jpeg({ quality: 92 })
    .toBuffer()
  return new Response(new Uint8Array(jpeg), {
    headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=300' },
  })
}
