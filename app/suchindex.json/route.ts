import { buildSearchIndex } from '@/lib/search'

/**
 * Der Suchindex als eigene Datei.
 *
 * Vorher steckte er als Prop der Kopfzeile in den Daten **jeder** Seite. Bei
 * 129 Einträgen kostete das rund 32 KB pro Seite – gemessen an der Startseite:
 * 169 KB vorher, 136 KB danach. Bezahlt hat das jeder Seitenaufruf, genutzt hat
 * es nur, wer die Suche öffnet.
 *
 * Jetzt liegt er einmal unter `/suchindex.json` und wird erst geladen, wenn
 * jemand die Lupe anklickt. Danach liegt er im Browser-Cache und gilt für alle
 * weiteren Seiten.
 *
 * Route Handler sind beim statischen Export erlaubt, solange sie nur `GET`
 * anbieten und nichts aus der Anfrage lesen (siehe
 * `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`). Next
 * rendert die Antwort beim Bauen einmal und legt sie als Datei ab.
 */
export const dynamic = 'force-static'

export async function GET() {
  return Response.json(await buildSearchIndex())
}
