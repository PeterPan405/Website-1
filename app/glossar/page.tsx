import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { collectionPageSchema } from '@/lib/jsonld'
import { getGlossar, getGlossargruppen } from '@/lib/glossar'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Finanzglossar: Fachbegriffe verständlich erklärt'),
  description:
    'Von Abgeltungsteuer bis Zinseszins: Fachbegriffe aus Börse, Fonds und Steuern – jeder in einem Satz erklärt, mit Verweis auf das passende Lernthema.',
  path: '/glossar',
  ogTitle: 'Finanzglossar: Begriffe in je einem Satz',
})

export default async function GlossarSeite() {
  const [gruppen, alle] = await Promise.all([getGlossargruppen(), getGlossar()])

  return (
    <>
      <PageHeader
        area="learn"
        eyebrow="Glossar"
        eyebrowIcon="book"
        title="Fachbegriffe, in je einem Satz"
        lead="Jeder Text setzt an irgendeiner Stelle voraus, dass ein Wort bekannt ist. Hier stehen die Wörter, um die es dabei geht – erklärt in einem Satz, ohne dafür wieder drei neue Begriffe zu brauchen."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Glossar' }]} />}
        meta={
          <>
            <span>{alle.length} Begriffe</span>
            <span aria-hidden="true">·</span>
            <span>{gruppen.length} Buchstaben</span>
            <span aria-hidden="true">·</span>
            <span>im Fließtext automatisch verlinkt</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        {/* ------------------------------------------------ Buchstabenleiste */}
        <nav
          aria-label="Nach Anfangsbuchstaben springen"
          className="bg-surface/85 border-border sticky top-16 z-10 -mx-4 border-b px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6"
        >
          <ul className="flex flex-wrap gap-1.5">
            {gruppen.map((gruppe) => (
              <li key={gruppe.buchstabe}>
                <a
                  href={`#buchstabe-${gruppe.buchstabe}`}
                  className="bg-surface-muted text-fg-muted hover:bg-learn-soft hover:text-learn flex size-8 items-center justify-center rounded-lg text-sm font-semibold transition"
                >
                  {gruppe.buchstabe}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {gruppen.map((gruppe) => (
          <section
            key={gruppe.buchstabe}
            aria-labelledby={`buchstabe-${gruppe.buchstabe}`}
            className="mt-10"
          >
            <h2
              id={`buchstabe-${gruppe.buchstabe}`}
              className="text-learn scroll-mt-32 text-2xl font-bold"
            >
              {gruppe.buchstabe}
            </h2>

            <dl className="mt-4 space-y-4">
              {gruppe.eintraege.map((eintrag) => (
                <div
                  key={eintrag.slug}
                  id={eintrag.slug}
                  className="fk-card scroll-mt-32 p-5 sm:p-6"
                >
                  <dt className="text-fg text-lg font-semibold">{eintrag.begriff}</dt>
                  <dd className="mt-1.5">
                    <p className="text-fg-muted leading-relaxed">{eintrag.kurz}</p>
                    {eintrag.lang && (
                      <p className="text-fg-subtle mt-2 text-sm leading-relaxed">
                        {eintrag.lang}
                      </p>
                    )}

                    {(eintrag.verwandt.length > 0 ||
                      eintrag.themaTitel ||
                      eintrag.lektionTitel ||
                      eintrag.rechnerTitel) && (
                      <div className="border-border mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-3 text-sm">
                        {eintrag.themaTitel && (
                          <Link
                            href={`/lernen/${eintrag.thema}`}
                            className="text-learn hover:text-brand font-semibold transition"
                          >
                            Lernthema: {eintrag.themaTitel}
                          </Link>
                        )}
                        {eintrag.lektionTitel && (
                          <Link
                            href={`/akademie/${eintrag.lektion}`}
                            className="text-akademie hover:text-brand font-semibold transition"
                          >
                            Akademie: {eintrag.lektionTitel}
                          </Link>
                        )}
                        {eintrag.rechnerTitel && (
                          <Link
                            href={`/rechner/${eintrag.rechner}`}
                            className="text-tools hover:text-brand font-semibold transition"
                          >
                            Rechner: {eintrag.rechnerTitel}
                          </Link>
                        )}
                        {eintrag.verwandt.length > 0 && (
                          <p className="text-fg-subtle">
                            Siehe auch:{' '}
                            {eintrag.verwandt.map((verweis, stelle) => (
                              <span key={verweis.slug}>
                                {stelle > 0 && ', '}
                                <a
                                  href={`#${verweis.slug}`}
                                  className="hover:text-brand underline decoration-dotted underline-offset-4"
                                >
                                  {verweis.begriff}
                                </a>
                              </span>
                            ))}
                          </p>
                        )}
                      </div>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}

        <section
          aria-labelledby="wie-verlinkt"
          className="rounded-card border-border bg-surface-muted mt-14 border p-6 sm:p-8"
        >
          <h2 id="wie-verlinkt" className="text-fg text-lg font-semibold">
            Wie das Glossar in die Texte kommt
          </h2>
          <p className="text-fg-muted mt-2 max-w-3xl text-sm leading-relaxed">
            In den Lerntexten ist jeder dieser Begriffe beim{' '}
            <strong className="text-fg font-semibold">ersten Vorkommen</strong> gepunktet
            unterstrichen und führt hierher. Nur beim ersten – ein Text, in dem jedes
            zweite Wort ein Link ist, wird nicht mehr gelesen. Auf der Seite eines Themas
            bleibt dessen eigener Begriff unverlinkt: Er wird dort gerade ausführlich
            erklärt.
          </p>
          <p className="text-fg-muted mt-3 max-w-3xl text-sm leading-relaxed">
            Erkannt werden nur die Wortformen, die hier hinterlegt sind. Deshalb wird
            „Aktienrückkauf“ nicht auf „Aktie“ verlinkt und „Optionsschein“ nicht auf
            „Option“ – das sind andere Begriffe, und ein Verweis darauf wäre eine falsche
            Auskunft.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/lernen" className="fk-btn-secondary">
              Zum Lernbereich
              <Icon name="arrow-right" className="size-4" />
            </Link>
            <Link href="/lernen/pfade" className="fk-btn-ghost">
              Zu den Lernpfaden
              <Icon name="arrow-right" className="size-4" />
            </Link>
          </div>
        </section>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Finanzglossar',
          description: `${alle.length} Fachbegriffe aus Börse, Fonds, Steuern und Vorsorge – jeder in einem Satz erklärt.`,
          path: '/glossar',
          items: alle.map((eintrag) => ({
            name: eintrag.begriff,
            path: `/glossar#${eintrag.slug}`,
          })),
        })}
      />
    </>
  )
}
