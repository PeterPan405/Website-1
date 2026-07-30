import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { QuoteRow } from '@/components/markets/QuoteRow'
import { SourceSummary } from '@/components/markets/SourceNote'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { getBranche, getBranchen } from '@/lib/branchen'
import { formatPercent } from '@/lib/format'
import { collectionPageSchema } from '@/lib/jsonld'
import { getQuotes } from '@/lib/markets'
import { buildMetadata, withBrand } from '@/lib/seo'

export function generateStaticParams() {
  return getBranchen().map((branche) => ({ slug: branche.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const branche = getBranche(slug)
  if (!branche) return {}

  return buildMetadata({
    title: withBrand(`${branche.name}: ${branche.aktien.length} Aktien im Vergleich`),
    description:
      `Die hier geführten Aktien der Branche ${branche.name} – ${branche.aktien.length} Titel ` +
      `aus ${branche.waehrungen.length} Währungsräumen, mit Kurs und Tagesveränderung.`,
    path: `/maerkte/branchen/${branche.slug}`,
  })
}

export default async function BrancheSeite({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const branche = getBranche(slug)
  if (!branche) notFound()

  const quotes = await getQuotes(branche.aktien.map((aktie) => aktie.symbol))

  /*
    Der Tagesdurchschnitt ist ein ungewichteter Mittelwert der prozentualen
    Veränderungen – bewusst ungewichtet.

    Ein nach Börsenwert gewichteter Schnitt wäre bei den Halbleitern praktisch
    der Nvidia-Kurs und sagte nichts über die Branche. Der ungewichtete
    beantwortet dagegen genau die Frage, um die es hier geht: Bewegt sich das
    ganze Feld, oder ist es ein einzelner Wert? Prozentzahlen lassen sich
    außerdem über Währungen hinweg mitteln, Beträge nicht.
  */
  const schnitt =
    quotes.reduce((summe, quote) => summe + quote.changePercent, 0) / quotes.length
  const steigend = quotes.filter((quote) => quote.changePercent > 0).length
  const fallend = quotes.filter((quote) => quote.changePercent < 0).length

  const sortiert = [...quotes].sort((a, b) => b.changePercent - a.changePercent)

  return (
    <>
      <PageHeader
        area="markets"
        eyebrow="Branche"
        eyebrowIcon="layers"
        title={branche.name}
        lead={`${branche.aktien.length} Aktien, die im selben Geschäft sind. Was sie verbindet, sind nicht die Zahlen, sondern die Ursachen dahinter: derselbe Rohstoffpreis, dieselbe Regulierung, dieselbe Nachfrage. Deshalb bewegen sie sich oft gemeinsam – und deshalb streut ein Depot aus lauter Titeln einer Branche weniger, als seine Länge vermuten lässt.`}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Märkte', path: '/maerkte' },
              { name: 'Branchen', path: '/maerkte/branchen' },
              { name: branche.name },
            ]}
          />
        }
        meta={
          <>
            <span>{branche.aktien.length} Titel</span>
            <span aria-hidden="true">·</span>
            <span>
              {branche.waehrungen.length}{' '}
              {branche.waehrungen.length === 1 ? 'Währung' : 'Währungen'}
            </span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <StatGrid>
          <Stat
            label="Heute im Mittel"
            value={formatPercent(schnitt)}
            tone={schnitt >= 0 ? 'positive' : 'negative'}
            hint="Ungewichteter Durchschnitt der Tagesveränderungen – jede Aktie zählt gleich"
          />
          <Stat
            label="Im Plus"
            value={`${steigend} von ${quotes.length}`}
            hint="Wie breit die Bewegung getragen ist"
          />
          <Stat
            label="Im Minus"
            value={`${fallend} von ${quotes.length}`}
            hint="Bei einer echten Branchenbewegung sind es fast alle"
          />
          <Stat
            label="Währungsräume"
            value={branche.waehrungen.join(', ')}
            hint="Kurse stehen in der Währung ihrer Heimatbörse, nicht umgerechnet"
          />
        </StatGrid>

        <section aria-labelledby="titel" className="mt-12">
          <h2 id="titel" className="text-fg text-2xl font-bold">
            Die Titel, nach Tagesveränderung
          </h2>
          <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
            Sortiert ist nach der prozentualen Veränderung des Tages, nicht nach Größe. So
            steht oben, was sich heute bewegt hat – und man sieht auf einen Blick, ob das
            ganze Feld mitgegangen ist.
          </p>

          <ul className="mt-6">
            {sortiert.map((quote) => (
              <li key={quote.symbol}>
                <QuoteRow quote={quote} />
              </li>
            ))}
          </ul>

          <div className="border-border mt-8 border-t pt-5">
            <SourceSummary quotes={quotes} />
          </div>
        </section>

        <section aria-labelledby="einordnung" className="mt-12">
          <h2 id="einordnung" className="text-fg text-2xl font-bold">
            Was eine Branchenliste nicht ist
          </h2>
          <div className="text-fg-muted mt-3 max-w-2xl space-y-4 leading-relaxed">
            <p>
              Sie ist keine Auswahl und keine Empfehlung. Hier steht, was diese Website an
              Kursen führt – das ist weder der ganze Sektor noch zwangsläufig sein
              wichtigster Teil. Wer eine vollständige Übersicht braucht, findet sie bei
              einem Indexanbieter, der genau das als Geschäft betreibt.
            </p>
            <p>
              Und die Zuordnung selbst ist eine Vereinfachung. Große Unternehmen betreiben
              mehrere Geschäfte gleichzeitig; welches davon den Ausschlag gibt, ist eine
              Entscheidung, keine Messung. Bei der Frage, ob zwei Aktien wirklich am
              selben Faden hängen, hilft ein Blick auf die Umsatzquellen mehr als jede
              Kategorie.
            </p>
            <p>
              <Link
                href="/lernen/aktien-laender-branchen"
                className="text-markets font-medium underline underline-offset-2"
              >
                Warum Streuung über Branchen zählt
              </Link>{' '}
              – und warum zehn Titel aus einer Branche weniger streuen als drei aus
              dreien.
            </p>
          </div>
        </section>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: `Aktien der Branche ${branche.name}`,
          description: `${branche.aktien.length} Aktien im Bereich ${branche.name}, mit Kurs und Tagesveränderung.`,
          path: `/maerkte/branchen/${branche.slug}`,
          items: branche.aktien.map((aktie) => ({
            name: aktie.name,
            path: `/maerkte/${aktie.symbol}`,
          })),
        })}
      />
    </>
  )
}
