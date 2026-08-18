import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatDate, formatNumber } from '@/lib/format'
import { collectionPageSchema } from '@/lib/jsonld'
import {
  MINDEST_ARTIKEL,
  nachJahren,
  straenge,
  strangFuer,
  type Strangart,
} from '@/lib/nachrichtenstrang'
import { getNewsArticles } from '@/lib/news'
import { getInstruments } from '@/lib/markets'
import { getLearnTopics } from '@/lib/learn'
import { buildMetadata, withBrand } from '@/lib/seo'

/**
 * Alle Meldungen zu einem Wert oder einem Thema, chronologisch.
 *
 * ## Warum eine Route für beides
 *
 * Weil es dieselbe Seite ist. Der Unterschied zwischen „alles zum Ölpreis" und
 * „alles zur Inflation" ist das Feld, aus dem gebündelt wird – nicht die
 * Darstellung. Zwei Routen wären zwei Dateien, die beim nächsten Umbau
 * auseinanderlaufen.
 *
 * ## Warum nicht jeder Wert eine Seite bekommt
 *
 * Weil ein Strang aus einem Artikel keiner ist. Von 68 Werten mit Meldungen
 * haben 34 genau eine. Die Grenze steht in `lib/nachrichtenstrang.ts` und
 * begründet sich dort.
 */

type Params = { art: string; slug: string }

const ARTEN: Record<string, { art: Strangart; label: string; wort: string }> = {
  wert: { art: 'symbol', label: 'Wert', wort: 'diesem Wert' },
  thema: { art: 'thema', label: 'Thema', wort: 'diesem Thema' },
}

async function baueStrang(art: Strangart, slug: string) {
  const artikel = await getNewsArticles()
  const meldungen = strangFuer(artikel, art, slug)
  return { artikel, meldungen }
}

/** Der ausgeschriebene Name hinter dem Schlüssel. */
async function nameFuer(art: Strangart, slug: string): Promise<string | null> {
  if (art === 'symbol') {
    const instrumente = await getInstruments()
    return instrumente.find((eintrag) => eintrag.symbol === slug)?.name ?? null
  }
  const themen = await getLearnTopics()
  return themen.find((thema) => thema.slug === slug)?.title ?? null
}

export async function generateStaticParams(): Promise<Params[]> {
  const artikel = await getNewsArticles()
  return [
    ...straenge(artikel, 'symbol').map((strang) => ({
      art: 'wert',
      slug: strang.schluessel,
    })),
    ...straenge(artikel, 'thema').map((strang) => ({
      art: 'thema',
      slug: strang.schluessel,
    })),
  ]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { art, slug } = await params
  const eintrag = ARTEN[art]
  if (!eintrag) return {}

  const name = (await nameFuer(eintrag.art, slug)) ?? slug
  const { meldungen } = await baueStrang(eintrag.art, slug)

  return buildMetadata({
    title: withBrand(`${name}: alle Meldungen`),
    // Kurz gehalten – die Grenze liegt bei 160 (`scripts/paket-pruefen.ts`).
    description: `${formatNumber(meldungen.length)} Meldungen zu ${name}, chronologisch geordnet – was hier über die Zeit dazu geschrieben wurde.`,
    path: `/news/strang/${art}/${slug}`,
  })
}

export default async function StrangSeite({ params }: { params: Promise<Params> }) {
  const { art, slug } = await params
  const eintrag = ARTEN[art]
  if (!eintrag) notFound()

  const { artikel, meldungen } = await baueStrang(eintrag.art, slug)
  if (meldungen.length < MINDEST_ARTIKEL) notFound()

  const name = (await nameFuer(eintrag.art, slug)) ?? slug
  const jahre = nachJahren(meldungen)
  const aeltester = meldungen[meldungen.length - 1]
  const juengster = meldungen[0]

  /*
    Die übrigen Stränge derselben Art – als Weg weiter.

    Ohne sie ist die Seite eine Sackgasse: Wer den Ölstrang gelesen hat, findet
    von hier aus nicht zum Goldstrang.
  */
  const geschwister = straenge(artikel, eintrag.art).filter(
    (strang) => strang.schluessel !== slug
  )
  const geschwisterNamen = await Promise.all(
    geschwister.slice(0, 12).map(async (strang) => ({
      slug: strang.schluessel,
      anzahl: strang.artikel.length,
      name: (await nameFuer(eintrag.art, strang.schluessel)) ?? strang.schluessel,
    }))
  )

  return (
    <>
      <PageHeader
        area="news"
        eyebrow={`Strang · ${eintrag.label}`}
        eyebrowIcon="newspaper"
        title={name}
        lead={`Alles, was hier über die Zeit zu ${eintrag.wort} geschrieben wurde – von der jüngsten Meldung zurück bis zur ersten.`}
        breadcrumbs={<Breadcrumbs items={[{ name: 'News', path: '/news' }, { name }]} />}
        meta={
          <>
            <span>{formatNumber(meldungen.length)} Meldungen</span>
            <span aria-hidden="true">·</span>
            <span>
              {formatDate(aeltester.publishedAt)} bis {formatDate(juengster.publishedAt)}
            </span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        {eintrag.art === 'symbol' ? (
          <p className="text-fg-muted max-w-3xl leading-relaxed">
            Der aktuelle Kurs und die Kennzahlen stehen auf der{' '}
            <Link
              href={`/maerkte/${slug}`}
              className="hover:text-news underline underline-offset-2"
            >
              Marktseite zu {name}
            </Link>
            . Hier geht es um das, was dazu geschrieben wurde.
          </p>
        ) : (
          <p className="text-fg-muted max-w-3xl leading-relaxed">
            Die Erklärung von Grund auf steht im Lernthema{' '}
            <Link
              href={`/lernen/${slug}`}
              className="hover:text-news underline underline-offset-2"
            >
              {name}
            </Link>
            . Hier stehen die Meldungen, die es berührt haben.
          </p>
        )}

        {jahre.map((jahrgang) => (
          <section key={jahrgang.jahr} className="mt-10">
            <h2 className="text-fg-subtle text-sm font-semibold tracking-wide uppercase">
              {jahrgang.jahr}
              <span className="text-fg-subtle ml-2 font-normal normal-case">
                · {formatNumber(jahrgang.artikel.length)}{' '}
                {jahrgang.artikel.length === 1 ? 'Meldung' : 'Meldungen'}
              </span>
            </h2>
            <ul className="border-border mt-3 border-t">
              {jahrgang.artikel.map((meldung) => (
                <li key={meldung.slug}>
                  <Link
                    href={`/news/${meldung.slug}`}
                    className="border-border hover:bg-surface-subtle group block border-b px-2 py-5 transition-colors"
                  >
                    <span className="text-fg-subtle block text-xs">
                      {formatDate(meldung.publishedAt)}
                    </span>
                    <h3 className="text-fg group-hover:text-news mt-1.5 text-lg font-semibold">
                      {meldung.title}
                    </h3>
                    <p className="text-fg-muted mt-1.5 max-w-3xl leading-relaxed">
                      {meldung.teaser}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {geschwisterNamen.length > 0 ? (
          <nav aria-label="Weitere Stränge" className="mt-14">
            <h2 className="text-fg text-lg font-semibold">Weitere Stränge</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {geschwisterNamen.map((strang) => (
                <li key={strang.slug}>
                  <Link
                    href={`/news/strang/${art}/${strang.slug}`}
                    className="fk-chip bg-news-soft text-news hover:bg-news transition-colors hover:text-white"
                  >
                    {strang.name}{' '}
                    <span className="opacity-70">{formatNumber(strang.anzahl)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <p className="text-fg-muted mt-12 max-w-3xl text-sm leading-relaxed">
          Ein Strang entsteht aus den Angaben, die ohnehin an jedem Artikel stehen –
          welche Kurse und welche Themen er berührt. Er wird nicht gepflegt und kann
          deshalb auch nicht veralten. Was sich aus mehreren Meldungen zusammen ergibt,
          steht hier absichtlich nicht: Das stünde in keiner Quelle.
        </p>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: `${name}: alle Meldungen`,
          description: `Chronologischer Strang aller Meldungen zu ${name}.`,
          path: `/news/strang/${art}/${slug}`,
          items: meldungen.slice(0, 25).map((meldung) => ({
            name: meldung.title,
            path: `/news/${meldung.slug}`,
          })),
        })}
      />
    </>
  )
}
