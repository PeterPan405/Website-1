import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  PHILOSOPHY_PUBLISHED,
  philosophySections,
  type PhilosophySection,
} from '@/data/philosophy'
import { buildMetadata, withBrand } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Unternehmensphilosophie'),
  description: `Wofür ${siteConfig.name} steht: Grundüberzeugungen zur Geldanlage, redaktionelle Grundsätze, klare Abgrenzung und offengelegte Finanzierung.`,
  path: '/unternehmensphilosophie',
  ogTitle: `Unternehmensphilosophie von ${siteConfig.name}`,
  // Solange der Text aussteht, bleibt die Seite aus dem Index. Sie ist über die
  // Fußzeile erreichbar, taucht aber nicht in Suchergebnissen auf.
  noIndex: !PHILOSOPHY_PUBLISHED,
})

function hasText(section: PhilosophySection): boolean {
  return Boolean(section.paragraphs && section.paragraphs.length > 0)
}

export default function PhilosophyPage() {
  const written = philosophySections.filter(hasText).length
  const total = philosophySections.length

  return (
    <>
      <PageHeader
        area="learn"
        eyebrow="Unternehmen"
        eyebrowIcon="compass"
        title="Unternehmensphilosophie"
        lead={`Wofür ${siteConfig.name} steht – und wofür ausdrücklich nicht.`}
        breadcrumbs={<Breadcrumbs items={[{ name: 'Unternehmensphilosophie' }]} />}
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="max-w-3xl">
          {!PHILOSOPHY_PUBLISHED && (
            <Callout variant="draft" title="Dieser Text wird noch verfasst">
              <p>
                Die Seite steht mit Struktur, Meta-Daten und Permalink bereit – der Inhalt
                folgt redaktionell. {written} von {total} Abschnitten sind bislang
                geschrieben.
              </p>
              <p>
                Bis dahin ist die Seite{' '}
                <strong className="text-fg font-semibold">nicht indexiert</strong> und
                nicht in der Sitemap enthalten: Eine fast leere Seite im Suchindex würde
                der Sichtbarkeit der gesamten Domain schaden. Über die Fußzeile bleibt sie
                zum Korrekturlesen erreichbar.
              </p>
              <p className="text-xs">
                Zum Bearbeiten: <code className="font-mono">data/philosophy.ts</code>.
                Dort je Abschnitt <code className="font-mono">paragraphs</code> füllen und
                anschließend <code className="font-mono">PHILOSOPHY_PUBLISHED</code> auf{' '}
                <code className="font-mono">true</code> setzen.
              </p>
            </Callout>
          )}

          <div className={PHILOSOPHY_PUBLISHED ? '' : 'mt-12'}>
            {philosophySections.map((section, index) => (
              <section
                key={section.heading}
                aria-labelledby={`abschnitt-${index}`}
                className={index === 0 ? '' : 'mt-12'}
              >
                <h2
                  id={`abschnitt-${index}`}
                  className="text-fg text-2xl font-bold sm:text-3xl"
                >
                  {section.heading}
                </h2>

                {hasText(section) ? (
                  <div className="text-fg-muted mt-4 space-y-4 leading-relaxed">
                    {section.paragraphs!.map((paragraph, paragraphIndex) => (
                      <p key={paragraphIndex}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  /*
                    Der Arbeitshinweis ist als solcher gekennzeichnet und wird nicht
                    als Aussage des Unternehmens gelesen – gestrichelter Rahmen,
                    gedämpfte Farbe, ausdrücklicher Vorspann.
                  */
                  <div className="rounded-card border-border-strong bg-surface-muted mt-4 border border-dashed p-5">
                    <p className="text-fg-subtle flex items-center gap-2 text-xs font-semibold tracking-wide uppercase">
                      <Icon name="clock" className="size-3.5" />
                      Noch zu schreiben
                    </p>
                    <p className="text-fg-muted mt-2 text-sm leading-relaxed italic">
                      {section.hint}
                    </p>
                  </div>
                )}
              </section>
            ))}
          </div>

          <div className="border-border mt-14 border-t pt-8">
            <h2 className="text-fg text-lg font-semibold">Passend dazu</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/ueber-uns" className="fk-btn-secondary">
                Über uns
                <Icon name="arrow-right" className="size-4" />
              </Link>
              <Link href="/kontakt" className="fk-btn-ghost">
                <Icon name="mail" className="size-4" />
                Kontakt
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
