import { aktuelleZahlenkarte } from '@/data/instagram-zahlenkarten'
import { beschriftungZahlenkarte } from '@/lib/instagram-zahlenkarte'

/**
 * Datum und Beschriftung der Zahlenkarte, aus demselben Bau wie das Bild.
 *
 *     Zeile 1   JJJJ-MM-TT – der Veröffentlicher prüft, dass es heute ist
 *     ab Zeile 2  die Beschriftung, wie sie hinausgeht
 */
export const dynamic = 'force-static'

export function GET() {
  const karte = aktuelleZahlenkarte()
  const rumpf = karte ? `${karte.datum}\n${beschriftungZahlenkarte(karte)}\n` : '-\n'
  return new Response(rumpf, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  })
}
