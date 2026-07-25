import type { JsonLdObject } from '@/lib/jsonld'

/**
 * Gibt strukturierte Daten als <script type="application/ld+json"> aus.
 *
 * `JSON.stringify` maskiert keine HTML-Tags. Damit ein Datensatz mit einem
 * `<`-Zeichen kein Script-Tag aufbrechen kann, wird `<` durch die
 * Unicode-Escape-Sequenz ersetzt – das ist im JSON-String äquivalent, aber im
 * HTML-Kontext harmlos.
 */
export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  const payload = Array.isArray(data) ? data : [data]

  return (
    <>
      {payload.map((entry, index) => (
        <script
          // Die Reihenfolge der Schemas pro Seite ist stabil, daher ist der
          // Index hier ein zulässiger Key.
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(entry).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  )
}
