import type { Metadata } from 'next'

import { Karteikarten } from '@/components/glossar/Karteikarten'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { getGlossar } from '@/lib/glossar'
import { buildMetadata, withBrand } from '@/lib/seo'

/**
 * Das Glossar zum Abfragen statt zum Nachschlagen.
 *
 * Die Glossarseite beantwortet „Was heißt das?“ im Moment des Lesens. Diese
 * Seite beantwortet die andere Frage: „Sitzen die Begriffe noch?“ – mit
 * Karteikarten und denselben wachsenden Abständen wie die Quiz-Wiederholung.
 */

export const metadata: Metadata = buildMetadata({
  title: withBrand('Glossar-Karteikarten'),
  description:
    'Die Fachbegriffe des Glossars als Karteikarten: Begriff lesen, Erklärung im Kopf formulieren, umdrehen, einordnen – mit wachsenden Abständen nach dem Leitner-Prinzip.',
  path: '/glossar/karteikarten',
  ogTitle: 'Glossar-Karteikarten',
})

export default async function KarteikartenSeite() {
  const glossar = await getGlossar()
  const begriffe = glossar.map((eintrag) => ({
    slug: eintrag.slug,
    begriff: eintrag.begriff,
    kurz: eintrag.kurz,
  }))

  return (
    <>
      <PageHeader
        area="learn"
        eyebrow="Glossar"
        eyebrowIcon="layers"
        title="Karteikarten"
        lead="Begriff lesen, Erklärung im Kopf formulieren, umdrehen, ehrlich einordnen. Was nicht saß, kommt morgen wieder – was saß, in wachsenden Abständen. Wie ein Karteikasten aus Papier, nur dass er sich selbst sortiert."
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Glossar', path: '/glossar' }, { name: 'Karteikarten' }]}
          />
        }
        meta={<span>{begriffe.length} Begriffe im Kasten</span>}
      />

      <div className="fk-container py-12 sm:py-16">
        <Karteikarten begriffe={begriffe} />
      </div>
    </>
  )
}
