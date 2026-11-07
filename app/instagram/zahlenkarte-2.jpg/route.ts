import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { aktuelleZahlenkarte } from '@/data/instagram-zahlenkarten'
import { zahlenkartePng } from '@/lib/instagram-zahlenkarte'

/**
 * Die zweite Seite der Zahlenkarte, wenn sie eine hat (`zweiteSeite`) –
 * dann geht die Karte als Karussell hinaus. Ob es sie gibt, sagt
 * `zahlenkarte.txt` („seiten 2" in Zeile 2); ohne zweite Seite steht hier
 * die erste, damit die Datei beim statischen Export immer entsteht.
 */
export const dynamic = 'force-static'

export async function GET() {
  const karte = aktuelleZahlenkarte()
  if (!karte) return new Response('Keine Zahlenkarte.', { status: 404 })
  const logo = readFileSync(join(process.cwd(), 'public/logo.svg'), 'utf8')
  const { default: sharp } = await import('sharp')
  const jpeg = await sharp(await zahlenkartePng(karte.zweiteSeite ?? karte, logo))
    .jpeg({ quality: 92 })
    .toBuffer()
  return new Response(new Uint8Array(jpeg), {
    headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=300' },
  })
}
