import type { Metadata } from 'next'
import Link from 'next/link'

import { PfadFortschritt, SchrittMarke } from '@/components/learn/PfadFortschritt'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  getProgrammKennungen,
  getProgrammLesezeit,
  getProgrammwochen,
} from '@/lib/dreissig-tage'
import { buildMetadata, withBrand } from '@/lib/seo'

/**
 * Das 30-Tage-Programm – der Rhythmus über dem Bestand.
 *
 * Die Seite zeigt vier Wochen mit je einer Tagesportion. Der Fortschritt ist
 * derselbe wie überall im Lernbereich (abgehakte Stufen); ein eigener
 * „Tag erledigt“-Speicher wäre eine zweite Wahrheit über dieselbe Sache.
 */

export const metadata: Metadata = buildMetadata({
  title: withBrand('Das 30-Tage-Programm'),
  description:
    'Eine Tagesportion Finanzwissen, vier Wochen lang: von Budget und Zinseszins über Aktien und ETFs bis zu Steuern und Portfolio – aus Lernstufen und Rechnern.',
  path: '/lernen/30-tage',
  ogTitle: 'Das 30-Tage-Programm',
})

export default async function DreissigTageSeite() {
  const [wochen, kennungen, lesezeit] = await Promise.all([
    getProgrammwochen(),
    getProgrammKennungen(),
    getProgrammLesezeit(),
  ])

  return (
    <>
      <PageHeader
        area="learn"
        eyebrow="Programm"
        eyebrowIcon="calculator"
        title="30 Tage, eine Portion am Tag"
        lead="Kein neuer Stoff, sondern ein Rhythmus über dem, was da ist: Jeder Tag verweist auf eine Lernstufe, oft mit dem passenden Rechner daneben. Klein genug für den Feierabend – und nach vier Wochen steht das Fundament."
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Lernen', path: '/lernen' }, { name: '30 Tage' }]}
          />
        }
        meta={
          <>
            <span>30 Tage</span>
            <span aria-hidden="true">·</span>
            <span>rund {Math.round(lesezeit / 30)} Minuten am Tag</span>
            <span aria-hidden="true">·</span>
            <span>alles aus vorhandenen Lernstufen und Rechnern</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0">
            {wochen.map((woche) => (
              <section
                key={woche.nummer}
                aria-labelledby={`woche-${woche.nummer}`}
                className={woche.nummer === 1 ? undefined : 'mt-12'}
              >
                <h2 id={`woche-${woche.nummer}`} className="text-fg text-2xl font-bold">
                  Woche {woche.nummer}: {woche.titel}
                </h2>
                <ol className="mt-6 space-y-4">
                  {woche.tage.map((tag) => (
                    <li key={tag.tag} className="fk-card p-5 sm:p-6">
                      <div className="flex items-start gap-4">
                        <span
                          className="bg-learn-soft text-learn flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                          aria-hidden="true"
                        >
                          {tag.tag}
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-fg font-semibold">{tag.titel}</h3>
                          <p className="text-fg-muted mt-1.5 text-sm leading-relaxed">
                            {tag.warum}
                          </p>
                        </div>
                      </div>
                      <ul className="mt-4 space-y-3 pl-0 sm:pl-13">
                        {tag.aufgeloest.map((schritt, index) => (
                          <li
                            key={schritt.kennung}
                            className="relative flex items-start gap-3"
                          >
                            <SchrittMarke
                              kennung={
                                schritt.art === 'stufe' ? schritt.kennung : undefined
                              }
                              nummer={index + 1}
                            />
                            <div className="min-w-0">
                              <p className="text-fg-subtle text-xs font-medium">
                                {schritt.art === 'stufe'
                                  ? `${schritt.themaTitel} · ${schritt.stufeLabel} · ${schritt.lesezeit} Min.`
                                  : 'Rechner'}
                              </p>
                              <p className="text-fg mt-0.5 text-sm font-semibold">
                                <Link
                                  href={schritt.href}
                                  className="hover:text-learn after:absolute after:inset-0"
                                >
                                  {schritt.titel}
                                </Link>
                              </p>
                              <p className="text-fg-subtle mt-0.5 text-sm leading-relaxed">
                                {schritt.warum}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="fk-card p-5">
              <h2 className="text-fg text-sm font-semibold">Dein Stand</h2>
              <PfadFortschritt kennungen={kennungen} className="mt-3" />
              <p className="text-fg-subtle mt-3 text-xs leading-relaxed">
                Gezählt wird derselbe Fortschritt wie im Lernbereich – was du dort
                abhakst, gilt auch hier. Ob du wirklich einen Tag pro Portion brauchst,
                entscheidest du; das Programm ist ein Rhythmus, kein Terminplan.
              </p>
            </div>
            <div className="fk-card mt-4 p-5">
              <h2 className="text-fg text-sm font-semibold">Lieber nach Frage?</h2>
              <p className="text-fg-subtle mt-2 text-xs leading-relaxed">
                Wer mit einer konkreten Frage kommt, fährt mit einem Lernpfad besser –
                kürzer und aufs Ziel geschnitten.
              </p>
              <Link href="/lernen/pfade" className="fk-btn-secondary mt-4 text-sm">
                Zu den Lernpfaden
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
