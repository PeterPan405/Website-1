import { instagramHeute } from '@/lib/instagram-heute'

/**
 * Für welchen Tag die Kacheln unter `/instagram/` gelten – und ob es einen
 * Beitrag gibt.
 *
 *     2026-10-12
 *     tagesnews
 *
 * oder
 *
 *     2026-10-11
 *     kein-beitrag
 *     Für den 2026-10-11 liegt kein Instagram-Plan vor.
 *
 * ## Warum eine eigene Datei
 *
 * Bis zum 11. Oktober 2026 stand das Datum in der ersten Zeile der
 * Beschriftung, und der erste Riegel las es dort. Die Beschriftung im Kanal
 * beginnt aber nicht mit einem Datum, sondern mit „Die wichtigsten
 * Börsennews des Tages. 📈" – wer sie unverändert übernehmen will, braucht
 * das Datum woanders. Hier steht es, und nur hier.
 */
export const dynamic = 'force-static'

export function GET() {
  const stand = instagramHeute()
  const zeilen = !stand
    ? ['-', 'kein-beitrag', 'Es gibt keine Ausgabe.']
    : stand.status === 'tagesnews'
      ? [stand.datum, 'tagesnews']
      : [stand.datum, 'kein-beitrag', stand.grund]
  return new Response(zeilen.join('\n') + '\n', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  })
}
