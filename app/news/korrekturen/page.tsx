import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatDate } from '@/lib/format'
import { getNewsArticles } from '@/lib/news'
import { buildMetadata, withBrand } from '@/lib/seo'

/**
 * Alle Korrekturen an einer Stelle.
 *
 * ## Warum eine eigene Seite
 *
 * Weil ein Änderungsvermerk am Fuß eines Artikels nur den erreicht, der den
 * Artikel noch einmal öffnet – und das tut fast niemand. Eine Sammelseite ist
 * die Stelle, an der sich nachsehen lässt, ob an einem Text etwas geändert
 * wurde, ohne ihn zu suchen.
 *
 * ## Warum sie auch dann steht, wenn sie leer ist
 *
 * Weil sie sonst genau dann erschiene, wenn der erste Fehler passiert – und
 * eine Seite, die erst mit dem Fehler entsteht, sieht aus wie eine Ausrede.
 * Sie steht von Anfang an da und sagt, wie mit Fehlern umgegangen wird. Das
 * ist eine Zusage, die man vorher gibt, nicht hinterher.
 */
export const metadata: Metadata = buildMetadata({
  title: withBrand('Korrekturen'),
  description:
    'Was nach der Veröffentlichung an Artikeln geändert wurde und warum – gesammelt an einer Stelle, statt still im Text verbessert.',
  path: '/news/korrekturen',
  ogTitle: 'Was wir korrigiert haben',
})

export default async function KorrekturenSeite() {
  const artikel = await getNewsArticles()

  const eintraege = artikel
    .flatMap((eintrag) =>
      (eintrag.korrekturen ?? []).map((korrektur) => ({
        slug: eintrag.slug,
        titel: eintrag.title,
        veroeffentlicht: eintrag.publishedAt,
        ...korrektur,
      }))
    )
    .sort((a, b) => b.am.localeCompare(a.am))

  return (
    <>
      <PageHeader
        area="news"
        eyebrow="Transparenz"
        eyebrowIcon="info"
        title="Was wir korrigiert haben"
        lead="Wer schreibt, macht Fehler. Was zählt, ist der Umgang damit: Eine still verbesserte Zahl erreicht niemanden, der den Artikel schon gelesen hat. Deshalb steht jede Änderung am Artikel selbst – und hier noch einmal zusammen."
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'News', path: '/news' }, { name: 'Korrekturen' }]}
          />
        }
        meta={
          <>
            <span>
              {eintraege.length} {eintraege.length === 1 ? 'Korrektur' : 'Korrekturen'}
            </span>
            <span aria-hidden="true">·</span>
            <span>bei {artikel.length} Artikeln</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <Callout variant="info" title="Was hier steht – und was nicht">
          <p>
            Eingetragen wird alles, was eine <strong>Zahl</strong>, eine{' '}
            <strong>Aussage</strong> oder eine <strong>Quelle</strong> betrifft. Also jede
            Änderung, die den Inhalt eines Satzes verändert – mit dem, was vorher dastand,
            und dem Grund.
          </p>
          <p>
            Nicht eingetragen werden Tippfehler, ein nachgezogener Absatz oder ein
            geänderter Zwischentitel. Wer solche Kleinigkeiten mitführt, macht die Liste
            unleserlich und versteckt die eine Änderung, auf die es ankommt, zwischen
            zwanzig, die niemanden angehen.
          </p>
        </Callout>

        {eintraege.length === 0 ? (
          <div className="text-fg-muted mt-10 max-w-2xl space-y-4 leading-relaxed">
            <p>
              Bisher gibt es keine Korrektur. Das ist keine Behauptung von Fehlerfreiheit,
              sondern eine Angabe über den bisherigen Bestand von {artikel.length}{' '}
              Artikeln.
            </p>
            <p>
              Wenn dir in einem Text ein Fehler auffällt – eine Zahl, die nicht zur
              verlinkten Quelle passt, eine Aussage, die so nicht stimmt –, dann schreib
              uns. Der Weg steht auf der{' '}
              <Link
                href="/kontakt"
                className="text-news font-medium underline underline-offset-2"
              >
                Kontaktseite
              </Link>
              . Eine gemeldete falsche Zahl ist wertvoller als zehn Komplimente.
            </p>
          </div>
        ) : (
          <ul className="border-border mt-10 border-t">
            {eintraege.map((eintrag) => (
              <li
                key={`${eintrag.slug}-${eintrag.am}`}
                className="border-border border-b py-5"
              >
                <time dateTime={eintrag.am} className="text-fg-subtle text-xs">
                  {formatDate(eintrag.am)}
                </time>
                <h2 className="mt-1">
                  <Link
                    href={`/news/${eintrag.slug}`}
                    className="text-fg hover:text-news font-semibold"
                  >
                    {eintrag.titel}
                  </Link>
                </h2>
                <p className="text-fg-muted mt-1.5 max-w-3xl leading-relaxed">
                  {eintrag.was}
                </p>
                <p className="text-fg-subtle mt-1 text-xs">
                  Ursprünglich veröffentlicht am {formatDate(eintrag.veroeffentlicht)}
                </p>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-10">
          <Link
            href="/news"
            className="text-news font-medium underline underline-offset-2"
          >
            Alle Nachrichten
          </Link>
        </p>
      </div>
    </>
  )
}
