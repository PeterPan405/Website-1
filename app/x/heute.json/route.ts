import { aktuelleZahlenkarte } from '@/data/instagram-zahlenkarten'
import { instagramHeute } from '@/lib/instagram-heute'
import { xTagesnews, xZahlenkarte } from '@/lib/x-text'

/**
 * Was heute auf X hinausginge – aus demselben Bau wie die Bilder unter
 * `/instagram/`. Gelesen von `scripts/x-veroeffentlichen.ts`; die Bilder
 * holt X nicht selbst, das Skript lädt sie hoch.
 *
 *     {
 *       "tagesnews":   { datum, haupt, antwort, bilder } | { datum, grund },
 *       "zahlenkarte": { datum, freigabe, text } | null
 *     }
 */
export const dynamic = 'force-static'

export function GET() {
  const stand = instagramHeute()
  const karte = aktuelleZahlenkarte()
  const rumpf = {
    tagesnews: !stand
      ? { datum: '-', grund: 'Es gibt keine Ausgabe.' }
      : stand.status === 'tagesnews'
        ? { datum: stand.datum, ...xTagesnews(stand.datum, stand.plan) }
        : { datum: stand.datum, grund: stand.grund },
    zahlenkarte: karte
      ? {
          datum: karte.datum,
          freigabe: karte.freigabe ?? null,
          text: xZahlenkarte(karte),
        }
      : null,
  }
  return new Response(JSON.stringify(rumpf, null, 2) + '\n', {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  })
}
