import type { Metadata } from 'next'
import { Suspense } from 'react'

import { Suchergebnisse } from '@/components/layout/Suchergebnisse'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Suche'),
  description:
    'Durchsuche Lernthemen, Rechner, Kurse, Nachrichten und Podcastfolgen dieser Website. Die Ergebnisseite hat eine eigene Adresse und lässt sich weitergeben.',
  path: '/suche',
})

/**
 * Die Suchseite.
 *
 * ## Warum sie nachgereicht wurde
 *
 * Am 28. August 2026 fiel dem Betreiber auf, dass die Website bei Google nur
 * schlecht zu finden ist und dort keine Unterseiten-Verweise („Sitelinks")
 * unter dem Treffer stehen. Die Sitelinks selbst lassen sich nicht
 * herbeiprogrammieren – die stellt Google selbst zusammen, es gibt keine
 * Auszeichnung dafür (siehe `ENTSCHEIDUNGEN.md`).
 *
 * Was sich auszeichnen lässt, ist die **Suchbox im Suchergebnis**: die
 * `SearchAction` in `lib/jsonld.ts`. Google verlangt dafür eine Adresse, die
 * eine Suchanfrage tatsächlich entgegennimmt und beantwortet. Genau die fehlte
 * – die Suche dieser Website war ausschließlich ein Dialog ohne Adresse, und
 * der Kommentar im Schema-Baustein hielt seit jeher fest, dass die
 * Auszeichnung deshalb bewusst unterbleibt.
 *
 * Diese Seite schließt die Lücke, und sie tut es nicht nur für Google: Ein
 * Suchergebnis mit Adresse lässt sich weitergeben, verlinken und aus der
 * Adresszeile heraus aufrufen.
 *
 * ## Warum die Ergebnisse nicht im HTML stehen
 *
 * Weil sie nicht können. Die Website wird statisch exportiert, es gibt keinen
 * Server, der `?q=` beim Ausliefern läse. Gesucht wird deshalb im Browser,
 * gegen `/suchindex.json` und mit derselben Bewertung wie im Dialog.
 *
 * Für die Indexierung ist das richtig herum: Die Seite selbst ist statisch und
 * darf in den Index, ihre Trefferlisten sollen es nicht – sonst stünden
 * beliebig viele Adressen mit demselben Gerüst darin. Was indexiert gehört,
 * sind die Zielseiten, und die stehen vollständig im `sitemap.xml`.
 */
export default function SucheSeite() {
  return (
    <>
      <PageHeader
        area="learn"
        eyebrow="Suche"
        eyebrowIcon="search"
        title="Suche"
        lead="Lernthemen, Rechner, Kurse, Nachrichten, Podcastfolgen und Begriffe – alles auf einmal durchsucht."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Suche' }]} />}
      />

      <div className="fk-container pb-16 sm:pb-24">
        {/*
          `useSearchParams` verlangt eine Suspense-Grenze, sonst fällt die
          ganze Seite beim Bauen auf Client-Rendering zurück. Siehe
          `node_modules/next/dist/docs/` zu `useSearchParams`.
        */}
        <Suspense
          fallback={
            <p className="text-fg-subtle mt-8" aria-live="polite">
              Wird gesucht …
            </p>
          }
        >
          <Suchergebnisse />
        </Suspense>
      </div>
    </>
  )
}
