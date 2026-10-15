import { aktuelleZahlenkarte } from '@/data/instagram-zahlenkarten'
import { beschriftungZahlenkarte } from '@/lib/instagram-zahlenkarte'

/**
 * Datum und Beschriftung der Zahlenkarte, aus demselben Bau wie das Bild.
 *
 *     Zeile 1     JJJJ-MM-TT – der Veröffentlicher prüft, dass es heute ist
 *     Zeile 2     „Freigabe: JJJJ-MM-TT" oder „Freigabe: -"
 *     ab Zeile 3  die Beschriftung, wie sie hinausgeht
 *
 * Gelesen von `leseZahlenkarteText()` in `lib/zahlenkarten-wecker.ts`.
 */
export const dynamic = 'force-static'

export function GET() {
  const karte = aktuelleZahlenkarte()
  const rumpf = karte
    ? `${karte.datum}\nFreigabe: ${karte.freigabe ?? '-'}\n${beschriftungZahlenkarte(karte)}\n`
    : '-\nFreigabe: -\n'
  return new Response(rumpf, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  })
}
