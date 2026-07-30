import { baueRss } from '@/lib/feed'
import { getNewsArticles } from '@/lib/news'
import { absoluteUrl, siteConfig } from '@/lib/site'

/**
 * Der Nachrichten-Feed unter `/feed.xml`.
 *
 * ## Warum es ihn bis Juli 2026 nicht gab
 *
 * Übersehen. Diese Website **liest** seit Kurzem einen Podcast-Feed und bot
 * selbst keinen – wer die Nachrichten verfolgen wollte, hatte nur den Weg über
 * die Seite. Ein Feed ist die einzige Möglichkeit, einer Website zu folgen,
 * ohne ihr eine E-Mail-Adresse zu geben, und das ist bei einer Seite, die über
 * Datensparsamkeit schreibt, kein Nebenaspekt.
 *
 * ## Warum der volle Bestand und nicht nur die aktuellen neun
 *
 * Weil ein Newsreader den Feed nicht ständig abruft. Wer eine Woche nicht
 * hinsieht und dann neun neue Artikel vorfindet, hat bei einem Feed mit neun
 * Einträgen den ältesten gerade verpasst. Der Bestand ist mit fünfundvierzig
 * Artikeln klein genug, um ihn vollständig auszuliefern.
 *
 * ## Warum nur der Teaser und nicht der ganze Text
 *
 * Ein Volltext-Feed nimmt dem Artikel seine Quellenangaben, seine Grafiken und
 * die Verweise ins Glossar – also alles, was ihn von einer Meldung
 * unterscheidet. Der Teaser sagt, worum es geht; gelesen wird auf der Seite.
 *
 * Route Handler sind beim statischen Export erlaubt, solange sie nur `GET`
 * anbieten und nichts aus der Anfrage lesen.
 */
export const dynamic = 'force-static'

export async function GET() {
  const artikel = await getNewsArticles()

  const feed = baueRss(
    {
      titel: `${siteConfig.name} – Nachrichten`,
      url: absoluteUrl('/news'),
      beschreibung:
        'Eingeordnete Meldungen zu Geldpolitik, Märkten, Geldanlage und Vorsorge – ' +
        'jede mit benannten Quellen und einem Lehrwinkel.',
      feedUrl: absoluteUrl('/feed.xml'),
      sprache: siteConfig.language,
    },
    artikel.map((eintrag) => ({
      titel: eintrag.title,
      url: absoluteUrl(`/news/${eintrag.slug}`),
      beschreibung: eintrag.teaser,
      /*
        Das Änderungsdatum gewinnt, wo es eines gibt. Ein Newsreader sortiert
        danach – und ein Artikel, der wegen einer Korrektur überarbeitet wurde,
        gehört dann nach oben und nicht an seinen alten Platz.
      */
      datum: eintrag.updatedAt ?? eintrag.publishedAt,
      kategorie: eintrag.category,
    }))
  )

  return new Response(feed, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
