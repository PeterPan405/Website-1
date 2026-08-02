import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Urkunde } from '@/components/learn/Urkunde'
import { Druckquelle } from '@/components/ui/Druckquelle'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { getLernpfad, getLernpfadSlugs } from '@/lib/lernpfade'
import { buildMetadata, withBrand } from '@/lib/seo'

/**
 * Die Abschluss-Urkunde eines Lernpfads.
 *
 * Eine eigene Adresse statt eines Kastens auf der Pfadseite, weil das Blatt
 * allein gedruckt werden soll: Die Druck-CSS blendet Kopf- und Fußzeile aus,
 * und was übrig bleibt, muss die Urkunde sein – nicht die Urkunde mitten in
 * einer Schrittliste.
 *
 * `noIndex`, weil die Seite für Suchmaschinen nichts enthält: Ihr Inhalt
 * entsteht aus dem Lernstand des Browsers, und ohne ihn zeigt sie nur den
 * Hinweis, was noch fehlt.
 */

export async function generateStaticParams() {
  const slugs = await getLernpfadSlugs()
  return slugs.map((pfad) => ({ pfad }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pfad: string }>
}): Promise<Metadata> {
  const { pfad: slug } = await params
  const pfad = await getLernpfad(slug)
  if (!pfad) return {}

  return buildMetadata({
    title: withBrand(`Urkunde: ${pfad.titel}`),
    description: `Die Abschluss-Urkunde zum Lernpfad „${pfad.titel}“ – zum Ausdrucken, wenn alle Stufen gelesen sind.`,
    path: `/lernen/pfade/${pfad.slug}/urkunde`,
    noIndex: true,
  })
}

export default async function UrkundenSeite({
  params,
}: {
  params: Promise<{ pfad: string }>
}) {
  const { pfad: slug } = await params
  const pfad = await getLernpfad(slug)
  if (!pfad) notFound()

  return (
    <div className="fk-container py-12 sm:py-16">
      <div data-drucken="aus">
        <Breadcrumbs
          items={[
            { name: 'Lernen', path: '/lernen' },
            { name: 'Pfade', path: '/lernen/pfade' },
            { name: pfad.titel, path: `/lernen/pfade/${pfad.slug}` },
            { name: 'Urkunde' },
          ]}
        />
        <h1 className="text-fg mt-6 text-3xl font-bold">Deine Urkunde</h1>
        <p className="text-fg-muted mt-3 max-w-2xl leading-relaxed">
          Wer alle {pfad.stufenzahl} Stufen dieses Pfads durchgearbeitet hat, darf das
          auch schwarz auf weiß haben. Name eintragen – oder das Feld leer lassen und von
          Hand schreiben –, drucken, fertig.
        </p>
      </div>

      <div className="mt-10">
        <Urkunde
          pfadTitel={pfad.titel}
          pfadSlug={pfad.slug}
          stufenkennungen={pfad.stufenkennungen}
        />
      </div>
      <Druckquelle pfad={`/lernen/pfade/${pfad.slug}/urkunde`} />
    </div>
  )
}
