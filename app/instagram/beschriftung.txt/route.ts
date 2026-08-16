import { editions } from '@/data/editions'
import { bildmeldungen, datumLang } from '@/lib/instagram-bild'

/**
 * Der Text unter dem Instagram-Beitrag, als `/instagram/beschriftung.txt`.
 *
 * ## Warum aus demselben Bau wie die Bilder
 *
 * Beschriftung und Kacheln müssen dieselbe Ausgabe meinen. Entstünden sie an
 * zwei Stellen – die Bilder im Bau, der Text im Veröffentlichungslauf –, wäre
 * der Tag, an dem sie auseinanderlaufen, nur eine Frage der Zeit: ein Beitrag
 * mit den Schlagzeilen von heute und dem Datum von gestern.
 *
 * Beide kommen deshalb aus `generateStaticParams` desselben Laufs und liegen
 * nach dem Bau nebeneinander in `out/instagram/`.
 *
 * ## Warum der Text nicht ins Bild gehört
 *
 * Was im Bild steht, liest kein Vorleseprogramm, und Instagram durchsucht nur
 * den Text. Die Adresse gehört hinein, weil ein Beitrag ohne Weg zur Sache nur
 * ein Bild ist.
 */
export const dynamic = 'force-static'

export function GET() {
  const edition = [...editions].sort((a, b) => b.date.localeCompare(a.date))[0]
  if (!edition) return new Response('Keine Ausgabe.', { status: 404 })

  /*
    Schlagworte aus den Rubriken der Ausgabe – nicht ausgedacht.

    Erfundene Schlagworte holen Leser, die etwas anderes suchen, und das ist
    bei einer Website, die Einordnung verspricht, die falsche Reichweite.
  */
  const rubriken = [...new Set(bildmeldungen(edition).map((m) => m.category))]
    .filter(Boolean)
    .map((r) => `#${String(r).replace(/[^\p{L}\p{N}]/gu, '')}`)

  const text = [
    `${datumLang(edition.date)} – das Marktupdate von IM Invests.`,
    '',
    edition.intro,
    '',
    'Alle Themen ausführlich und mit Einordnung: iminvests.de',
    '',
    'Keine Anlageberatung.',
    '',
    /*
      Entdoppelt: Die Rubriken der Ausgabe heißen teils wie die festen
      Schlagworte – „Geldanlage" stand sonst zweimal im Beitrag.
    */
    [...new Set(['#Finanzen', '#Börse', '#Geldanlage', ...rubriken])].join(' '),
  ].join('\n')

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
