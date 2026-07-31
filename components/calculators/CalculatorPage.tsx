import Link from 'next/link'
import { Callout } from '@/components/ui/Callout'
import type { ReactNode } from 'react'

import { ContentBlocks } from '@/components/content/ContentBlocks'
import { TopicLinkList } from '@/components/learn/TopicLinkList'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import {
  ErgebnisAnbieter,
  ErgebnisDownload,
} from '@/components/calculators/ErgebnisDownload'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import type { CalculatorDefinition } from '@/data/calculators'
import { calculators } from '@/data/calculators'
import { howToSchema, webApplicationSchema } from '@/lib/jsonld'
import { getTopicsBySlugs } from '@/lib/learn'

/**
 * Gemeinsamer Rahmen aller Rechner-Seiten.
 *
 * Kopfbereich, Methodik-Abschnitt, Querverweise und die
 * WebApplication-Auszeichnung sind für alle Rechner identisch – nur das
 * eigentliche Bedienelement unterscheidet sich und wird als `children`
 * übergeben.
 */
export async function CalculatorPage({
  definition,
  children,
}: {
  definition: CalculatorDefinition
  children: ReactNode
}) {
  const relatedTopics = await getTopicsBySlugs(definition.relatedTopics)
  const otherCalculators = calculators.filter(
    (calculator) => calculator.slug !== definition.slug
  )

  return (
    <>
      <PageHeader
        area="tools"
        eyebrow="Rechner"
        eyebrowIcon="calculator"
        title={definition.headline}
        lead={definition.lead}
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Rechner', path: '/rechner' }, { name: definition.title }]}
          />
        }
      />

      <div className="fk-container py-12 sm:py-16">
        {/*
          Der Anbieter umschließt den Rechner **und** den Knopf darunter: Der
          Rechner meldet sein Ergebnis von innen an, der Knopf liest es von
          außen. Ohne gemeinsame Klammer sähe der eine nicht, was der andere
          meldet.
        */}
        <ErgebnisAnbieter>
          {children}
          <ErgebnisDownload />
        </ErgebnisAnbieter>

        {/* ------------------------------------------------------- Methodik */}
        <section aria-labelledby="methodik" className="mt-16 max-w-3xl">
          <h2 id="methodik" className="sr-only">
            Methodik
          </h2>
          <div className="fk-card p-6 sm:p-8">
            <p className="fk-chip bg-tools-soft text-tools">
              <Icon name="info" className="size-3.5" />
              Methodik offengelegt
            </p>
            <div className="mt-4">
              <ContentBlocks blocks={definition.methodology} />
            </div>
          </div>
        </section>

        {/* ------------------------------------------- Was er nicht sagt */}
        {/*
          Steht als eigener Kasten und nicht als Absatz in der Methodik.

          Wer eine Rechnerseite überfliegt, liest die Zahl und die
          Überschriften. Die Grenzen in einen Fließtext zu schreiben hieße, sie
          genau den Lesern vorzuenthalten, die sie am nötigsten haben. Derselbe
          Text steht auf dem heruntergeladenen PDF – aus derselben Quelle.
        */}
        <section aria-labelledby="grenzen" className="mt-8 max-w-3xl">
          <Callout variant="warning" title="Was dieser Rechner nicht sagt">
            <ul className="space-y-2">
              {definition.grenzen.map((satz) => (
                <li key={satz}>{satz}</li>
              ))}
            </ul>
          </Callout>
          <h2 id="grenzen" className="sr-only">
            Grenzen dieses Rechners
          </h2>
        </section>

        {/* ---------------------------------------------------- Querverweise */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <TopicLinkList
            topics={relatedTopics}
            title="Passende Grundlagen"
            description="Die Theorie hinter diesem Rechner – ausführlich erklärt."
          />

          <section aria-labelledby="weitere-rechner" className="fk-card p-6">
            <h2 id="weitere-rechner" className="text-fg text-lg font-semibold">
              Weitere Rechner
            </h2>
            <ul className="mt-4 space-y-2">
              {otherCalculators.map((calculator) => (
                <li key={calculator.slug}>
                  <Link
                    href={`/rechner/${calculator.slug}`}
                    className="group hover:bg-surface-muted flex items-start gap-3 rounded-xl p-2.5 transition"
                  >
                    <span className="bg-tools-soft text-tools mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg">
                      <Icon name="calculator" className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="text-fg group-hover:text-brand block text-sm font-semibold">
                        {calculator.title}
                      </span>
                      <span className="text-fg-muted mt-0.5 block text-xs leading-relaxed">
                        {calculator.summary}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/*
        Zwei Auszeichnungen: `WebApplication` sagt, was die Seite ist,
        `HowTo`, wie man sie bedient. Die Schritte stehen in
        `data/calculators.ts` und beschreiben ausschließlich Felder, die es
        auf dieser Seite gibt.
      */}
      <JsonLd
        data={webApplicationSchema({
          name: definition.title,
          description: definition.metaDescription,
          path: `/rechner/${definition.slug}`,
          featureList: definition.featureList,
        })}
      />
      <JsonLd
        data={howToSchema({
          name: definition.headline,
          description: definition.lead,
          path: `/rechner/${definition.slug}`,
          schritte: definition.schritte,
        })}
      />
    </>
  )
}
