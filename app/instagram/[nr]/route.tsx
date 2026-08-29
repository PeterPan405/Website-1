import { editions } from '@/data/editions'
import { bildmeldungen, instagramBild, instagramMeldungsbild } from '@/lib/instagram-bild'

/**
 * Die Karussellkacheln der jüngsten Tagesausgabe, als PNG.
 *
 *     /instagram/1   Titelkachel mit den Schlagzeilen
 *     /instagram/2   erste Meldung samt Einordnung
 *     /instagram/3   …
 *
 * ## Warum eine Route und kein Skript
 *
 * `lib/instagram-bild.tsx` enthält JSX. Node kann die Datei nicht laden – das
 * Type-Stripping entfernt Typen, übersetzt aber kein JSX –, und ein Übersetzer
 * ist im Projekt nicht installiert. Ein Skript hätte also entweder eine neue
 * Abhängigkeit gebraucht oder eine zweite, JSX-freie Fassung derselben Kacheln.
 * Beides für etwas, das der Bau ohnehin kann.
 *
 * Route Handler werden bei `next build` **statisch gerendert** (nur `GET`,
 * siehe `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`). Die
 * Kacheln entstehen damit auf demselben Weg wie die Vorschaubilder unter
 * `app/**​/opengraph-image.tsx` und liegen nach dem Bau als Dateien in `out/`.
 *
 * ## Warum das getrennt vom Veröffentlichen bleibt
 *
 * Erzeugen braucht **kein Meta**: satori setzt den Text, resvg rastert ihn,
 * beides ohne Netz. Veröffentlichen hängt an einem Token, einer verknüpften
 * Facebook-Seite und zwei Berechtigungen – vier Stellen, an denen es klemmen
 * kann.
 *
 * Getrennt lässt sich **sehen, was hinausginge, bevor etwas hinausgeht.** Auf
 * einem Kanal unter eigenem Namen ist das kein Luxus: Ein schiefes Bild ist bei
 * Instagram nicht zurückzunehmen, nur zu löschen – gesehen haben es dann
 * schon welche.
 *
 * ## Warum die jüngste Ausgabe und nicht alle
 *
 * Ein Karussell wird am Erscheinungstag gepostet. Kacheln für hundert
 * vergangene Ausgaben zu rastern kostete Bauzeit für Bilder, die niemand
 * ansieht. Wer eine alte braucht, baut mit der Ausgabe im Bestand.
 */
export const dynamic = 'force-static'

/** Neueste Ausgabe – dieselbe Sortierung wie in `lib/editions.ts`. */
function juengste() {
  return [...editions].sort((a, b) => b.date.localeCompare(a.date))[0]
}

export function generateStaticParams() {
  const edition = juengste()
  if (!edition) return []
  // Titelkachel plus je eine Kachel pro Top-Meldung.
  const anzahl = 1 + bildmeldungen(edition).length
  return Array.from({ length: anzahl }, (_, i) => ({ nr: `${i + 1}.jpg` }))
}

export async function GET(_anfrage: Request, ctx: { params: Promise<{ nr: string }> }) {
  const { nr } = await ctx.params
  const edition = juengste()
  if (!edition) return new Response('Keine Ausgabe.', { status: 404 })

  /*
    Die Endung gehört in den Dateinamen, nicht nur in den Content-Type.

    Meta ruft die Bilder für einen Beitrag **selbst** ab. Ein Abrufer, der nach
    der Endung geht statt nach dem Kopf der Antwort, sieht bei `/instagram/1`
    keine Datei, die er verarbeiten will. `/instagram/1.jpg` ist eindeutig –
    für Meta, für den Webserver und für jeden, der die Adresse von Hand öffnet.
  */
  const stelle = Number(nr.replace(/\.jpg$/, ''))
  const meldungen = bildmeldungen(edition)

  /*
    Aus dem Rahmen fallende Nummern beantwortet die Route mit 404 statt mit
    einem leeren Bild. Im statischen Export entsteht ohnehin nur, was
    `generateStaticParams` nennt – die Prüfung gilt der Entwicklung.
  */
  if (!Number.isInteger(stelle) || stelle < 1 || stelle > meldungen.length + 1) {
    return new Response(`Kachel ${nr} gibt es nicht.`, { status: 404 })
  }

  const bild =
    stelle === 1
      ? await instagramBild(edition)
      : await instagramMeldungsbild(meldungen[stelle - 2], stelle - 1, meldungen.length)

  /*
    JPEG, nicht PNG – und das ist keine Geschmacksfrage.

    Hier stand bis zum 29. August 2026 PNG, mit der Begründung, Instagram nehme
    beides. Das ist nicht belegt: Metas eigene Anforderungen an ein Bild für
    einen Beitrag nennen **„Format: JPEG only"**, und dasselbe steht in der
    Dokumentation des Dienstes, über den der Beitrag hinausgeht.

    Was PNG gekostet hätte, wäre nicht ein roter Lauf gewesen, sondern ein
    Morgen ohne Beitrag – und die Fehlersuche hätte beim Token angefangen, wo
    nichts gewesen wäre.

    `ImageResponse` liefert PNG; `sharp` wandelt es um. Der Umweg passiert beim
    Bauen, nicht beim Veröffentlichen: Was auf dem Webspace liegt, ist dann
    schon das, was Meta abholt.

    Qualität 90 statt der Voreinstellung 80: Die Kacheln sind gesetzter Text
    auf einer Fläche, und dort fallen Artefakte an Buchstabenkanten auf. Bei
    rund 100 KB je Kachel ist der Platz nicht das Problem – Metas Grenze liegt
    bei 8 MiB.
  */
  const { default: sharp } = await import('sharp')
  const jpeg = await sharp(bild).jpeg({ quality: 90, mozjpeg: true }).toBuffer()

  return new Response(new Uint8Array(jpeg), {
    headers: {
      'Content-Type': 'image/jpeg',
      // Die Kachel gilt für einen Tag; danach steht eine neue Ausgabe.
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
