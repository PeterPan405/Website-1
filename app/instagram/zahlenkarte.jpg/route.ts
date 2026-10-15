import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { aktuelleZahlenkarte } from '@/data/instagram-zahlenkarten'
import { zahlenkartePng } from '@/lib/instagram-zahlenkarte'

/**
 * Die Zahlenkarte des Tages als JPEG – Meta holt das Bild von hier.
 *
 * Gebaut wird beim Paketbau, nicht beim Veröffentlichen: Meta nimmt nur eine
 * öffentliche Adresse, und eine Datei, die erst im Lauf entsteht, hat keine.
 * Welche Karte das ist, sagt `zahlenkarte.txt` daneben (erste Zeile: Datum).
 */
export const dynamic = 'force-static'

export async function GET() {
  const karte = aktuelleZahlenkarte()
  if (!karte) return new Response('Keine Zahlenkarte.', { status: 404 })
  const logo = readFileSync(join(process.cwd(), 'public/logo.svg'), 'utf8')
  // Qualität 92 wie im abgenommenen Entwurf – an den Kanten von Anton fallen
  // Artefakte sonst zuerst auf.
  // Dynamisch geladen wie in `[nr]/route.ts`.
  const { default: sharp } = await import('sharp')
  const jpeg = await sharp(await zahlenkartePng(karte, logo))
    .jpeg({ quality: 92 })
    .toBuffer()
  return new Response(new Uint8Array(jpeg), {
    headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=300' },
  })
}
