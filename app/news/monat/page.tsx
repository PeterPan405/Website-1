import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { formatMonthYearLong } from '@/lib/format'
import { getNewsByMonth } from '@/lib/news'
import { buildMetadata, withBrand } from '@/lib/seo'

/**
 * Das Register aller Nachrichtenmonate.
 *
 * ## Warum es diese Ebene braucht
 *
 * Das Archiv wächst und schrumpft nie – jeder Tag bleibt. Die Tagesliste auf
 * `/news` trägt das ein paar Wochen, dann wird sie lang; die Rubrikseiten
 * schneiden quer und beantworten „Was gab es zu Geldpolitik?“, aber nicht
 * „Was war im Juli?“. Der Monat ist die fehlende mittlere Ebene: grob genug,
 * um dauerhaft übersichtlich zu bleiben, fein genug, um etwas wiederzufinden,
 * von dem man nur noch weiß, wann es ungefähr war.
 */

export const metadata: Metadata = buildMetadata({
  title: withBrand('Nachrichten-Archiv nach Monaten'),
  description:
    'Alle Nachrichtenartikel nach Erscheinungsmonat geordnet – das dauerhafte Archiv, aus dem kein Artikel herausfällt.',
  path: '/news/monat',
  ogTitle: 'Archiv nach Monaten',
})

export default async function MonatsRegisterSeite() {
  const monate = await getNewsByMonth()

  return (
    <>
      <PageHeader
        area="news"
        eyebrow="Archiv"
        eyebrowIcon="newspaper"
        title="Alle Monate"
        lead="Jeder Monat versammelt seine Artikel vollständig – auch die, die auf der Nachrichtenseite längst ins Archiv gerückt sind. Es fällt nichts heraus."
        breadcrumbs={
          <Breadcrumbs items={[{ name: 'News', path: '/news' }, { name: 'Monate' }]} />
        }
        meta={
          <span>
            {monate.length} {monate.length === 1 ? 'Monat' : 'Monate'} ·{' '}
            {monate.reduce((summe, eintrag) => summe + eintrag.artikel.length, 0)} Artikel
          </span>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {monate.map((eintrag, index) => (
            <li key={eintrag.monat} className="relative">
              <Reveal delay={Math.min(index, 8) * 0.04}>
                <Link
                  href={`/news/monat/${eintrag.monat}`}
                  className="fk-card hover:border-news block p-5 transition-colors"
                >
                  <h2 className="text-fg text-lg font-semibold">
                    {formatMonthYearLong(`${eintrag.monat}-01`)}
                  </h2>
                  <p className="text-fg-subtle mt-1 text-sm">
                    {eintrag.artikel.length}{' '}
                    {eintrag.artikel.length === 1 ? 'Artikel' : 'Artikel'}
                  </p>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

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
