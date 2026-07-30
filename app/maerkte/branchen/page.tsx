import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { getBranchen, getBranchenAbdeckung } from '@/lib/branchen'
import { collectionPageSchema } from '@/lib/jsonld'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Aktien nach Branchen'),
  description:
    'Über tausend Aktien nach dem Geschäft geordnet, das sie betreiben – von Banken über Halbleiter bis Versorger. Mit dem Hinweis, wo die Einteilung endet.',
  path: '/maerkte/branchen',
  ogTitle: 'Welche Aktien betreiben dasselbe Geschäft?',
})

export default function BranchenSeite() {
  const branchen = getBranchen()
  const abdeckung = getBranchenAbdeckung()

  return (
    <>
      <PageHeader
        area="markets"
        eyebrow="Branchen"
        eyebrowIcon="layers"
        title="Wer macht eigentlich dasselbe?"
        lead="Ein Kurs allein sagt wenig darüber, wie ein Unternehmen dasteht. Aufschlussreich wird er im Vergleich mit denen, die im selben Geschäft sind: derselbe Ölpreis, dieselben Zinsen, dieselbe Nachfrage. Diese Seite gruppiert die hier geführten Aktien danach."
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Märkte', path: '/maerkte' }, { name: 'Branchen' }]}
          />
        }
        meta={
          <>
            <span>{branchen.length} Branchen</span>
            <span aria-hidden="true">·</span>
            <span>{abdeckung.zugeordnet} Aktien zugeordnet</span>
            <span aria-hidden="true">·</span>
            <span>Einteilung dieser Website</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <Callout variant="info" title="Eine Suchhilfe, keine amtliche Einteilung">
          <p>
            Für Branchen gibt es zwei etablierte Systeme, <strong>GICS</strong> und{' '}
            <strong>ICB</strong>. Beide sind lizenzpflichtig, und beide ordnen dieselbe
            Firma gelegentlich verschieden ein: Amazon betreibt Handel und Rechenzentren,
            Tesla baut Autos und verkauft Software. Wer eine solche Firma in genau eine
            Schublade legt, trifft eine Entscheidung – und keine, die sich beweisen ließe.
          </p>
          <p>
            Die Einteilung hier ist deshalb als <strong>Suchhilfe</strong> gedacht: Sie
            soll helfen, vergleichbare Titel nebeneinander zu sehen. Für die Frage, wie
            ein Index zusammengesetzt ist oder wie ein Fonds seine Branchenquote
            berechnet, ist sie nicht die Grundlage.
          </p>
        </Callout>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {branchen.map((branche, index) => (
            <li key={branche.slug}>
              <Reveal delay={Math.min(index, 12) * 0.03}>
                <Link
                  href={`/maerkte/branchen/${branche.slug}`}
                  className="border-border bg-surface hover:border-markets hover:bg-surface-muted flex h-full items-baseline justify-between gap-3 rounded-xl border p-4 transition"
                >
                  <span className="text-fg font-semibold">{branche.name}</span>
                  <span className="text-fg-subtle shrink-0 text-sm tabular-nums">
                    {branche.aktien.length}
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        {/*
          Die Zahl der nicht verlinkten Titel gehört dazu, sonst rechnet der
          Leser die Spalten zusammen und kommt auf weniger als tausend, ohne zu
          erfahren, wo der Rest geblieben ist.
        */}
        {abdeckung.zugeordnet >
          branchen.reduce((summe, branche) => summe + branche.aktien.length, 0) && (
          <p className="text-fg-subtle mt-8 text-sm leading-relaxed">
            {abdeckung.zugeordnet -
              branchen.reduce((summe, branche) => summe + branche.aktien.length, 0)}{' '}
            Aktien stehen in Branchen mit weniger als drei Titeln. Eine eigene Seite
            hätten sie nicht gefüllt; ihre Branche steht auf der jeweiligen Kursseite.
          </p>
        )}
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Aktien nach Branchen',
          description:
            'Die auf dieser Website geführten Aktien, gruppiert nach ihrem Geschäft.',
          path: '/maerkte/branchen',
          items: branchen.map((branche) => ({
            name: branche.name,
            path: `/maerkte/branchen/${branche.slug}`,
          })),
        })}
      />
    </>
  )
}
