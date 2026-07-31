'use client'

import { useEffect, useState } from 'react'

import { absoluteUrl, siteConfig } from '@/lib/site'

/**
 * Die Herkunftszeile am Fuß eines Ausdrucks – **nur auf Papier sichtbar**.
 *
 * Ein ausgedrucktes Blatt wandert weiter: in einen Ordner, an einen Schüler,
 * über einen Schreibtisch. Ohne diese Zeile steht dort ein Text ohne Absender.
 * Wer ihn Wochen später wiederfindet, weiß nicht, woher er kam, und kann nicht
 * nachsehen, ob inzwischen etwas anderes dort steht.
 *
 * Am Bildschirm hat sie nichts zu suchen: Dort steht die Adresse in der
 * Adresszeile und der Absender in der Fußzeile der Website.
 *
 * ## Warum das Datum erst beim Drucken entsteht
 *
 * Die Website wird statisch ausgeliefert. Ein im Voraus gesetztes Datum wäre
 * der **Bautag** – bei einem Blatt, das jemand ein halbes Jahr später
 * ausdruckt, also eine falsche Antwort auf die einzige Frage, die das Datum
 * beantworten soll: Wie alt ist dieses Papier?
 *
 * `beforeprint` ist der richtige Zeitpunkt und nicht der Knopf daneben: Es
 * feuert auch bei Strg+P und beim Druckmenü des Browsers, und über die
 * Vorschau bekommt niemand ein Blatt ohne Datum.
 *
 * Ob sich der **Text** seither geändert hat, steht unter der angegebenen
 * Adresse – und nirgends sonst. Das Blatt behauptet dazu nichts.
 */
export function Druckquelle({ pfad }: { pfad: string }) {
  const [tag, setzeTag] = useState('')

  useEffect(() => {
    const setzen = () =>
      setzeTag(
        new Date().toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      )
    window.addEventListener('beforeprint', setzen)
    return () => window.removeEventListener('beforeprint', setzen)
  }, [])

  return (
    <p
      data-drucken="nur"
      className="border-border text-fg-subtle mt-10 border-t pt-3 text-xs"
    >
      {siteConfig.name} · {absoluteUrl(pfad)}
      {tag ? ` · Ausgedruckt am ${tag}` : ''}
    </p>
  )
}
