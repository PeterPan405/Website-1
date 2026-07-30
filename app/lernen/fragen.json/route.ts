import { alleFragen } from '@/lib/fragenbestand'

/**
 * Der gesamte Fragenbestand als eigene Datei.
 *
 * Geladen wird er nur von zwei Seiten – der verteilten Wiederholung und dem
 * Einstufungstest –, und dort erst, wenn jemand tatsächlich anfängt. Ihn in
 * eine Client-Komponente zu importieren hieße, rund 250 KB an jeden
 * auszuliefern, der die Seite nur ansieht.
 *
 * Route Handler sind beim statischen Export erlaubt, solange sie nur `GET`
 * anbieten und nichts aus der Anfrage lesen (siehe
 * `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`). Next
 * rendert die Antwort beim Bauen einmal und legt sie als Datei ab.
 */
export const dynamic = 'force-static'

export function GET() {
  return Response.json(alleFragen())
}
