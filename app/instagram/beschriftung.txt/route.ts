import { instagramHeute } from '@/lib/instagram-heute'
import { beschriftungTagesnews } from '@/lib/instagram-plan'

/**
 * Der Text unter dem Instagram-Beitrag, als `/instagram/beschriftung.txt`.
 *
 * Er entsteht im selben Bau wie die Kacheln – Beschriftung und Bilder meinen
 * dieselbe Ausgabe, sonst stünden irgendwann die Schlagzeilen von heute unter
 * dem Datum von gestern.
 *
 * Die Form ist die der Tagesbeiträge im Kanal, Zeile für Zeile; sie steht in
 * `lib/instagram-plan.ts` samt Herkunft. Bis zum 11. Oktober 2026 stand hier
 * eine eigene Fassung mit Datum, Anreißer der Website und festen
 * Schlagworten – veröffentlicht wurde sie nie, im Kanal stand eine andere.
 *
 * Gibt es heute keinen Beitrag, steht hier der Grund, damit ein Blick auf die
 * Adresse ihn beantwortet.
 */
export const dynamic = 'force-static'

export function GET() {
  const stand = instagramHeute()
  const text =
    stand?.status === 'tagesnews'
      ? beschriftungTagesnews(stand.plan)
      : `Kein Beitrag. ${stand?.status === 'kein-beitrag' ? stand.grund : 'Es gibt keine Ausgabe.'}`
  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  })
}
