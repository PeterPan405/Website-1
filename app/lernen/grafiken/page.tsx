import type { Metadata } from 'next'
import Link from 'next/link'

import { ContentFigure } from '@/components/content/ContentFigure'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { figureMeta, type FigureId } from '@/data/figures'
import { collectionPageSchema } from '@/lib/jsonld'
import { buildMetadata, withBrand } from '@/lib/seo'

/**
 * Alle Erklärgrafiken an einer Stelle.
 *
 * ## Warum es diese Seite gibt
 *
 * Die Zeichnungen waren ausschließlich über die Lernstufe erreichbar, in der
 * sie stehen. Wer die Zinseszinskurve oder das Bild zur Streuung wiederfinden
 * wollte, musste wissen, in welcher Stufe sie stand – und die Stufe kennt man
 * erst, wenn man sie gelesen hat.
 *
 * Nebenbei ist es das beste Schaufenster, das diese Website hat. Über hundert
 * eigene Zeichnungen sind etwas, das sich nicht in einer Stunde nachbauen
 * lässt, und bisher sah sie niemand als Ganzes.
 *
 * ## Warum sie hier ohne ihre Lernstufe stehen
 *
 * Weil eine Zeichnung mit ihrer Unterschrift für sich verständlich ist – das
 * ist der Anspruch, unter dem sie entstanden sind. Wo sie es nicht ist, ist
 * das ein Befund über die Zeichnung und nicht über diese Seite.
 */

export const metadata: Metadata = buildMetadata({
  title: withBrand('Alle Erklärgrafiken'),
  description:
    'Über hundert eigene Zeichnungen zu Zins, Risiko, Steuern und Börse – jede mit dem Satz darunter, der sagt, was aus ihr folgt.',
  path: '/lernen/grafiken',
  ogTitle: 'Über hundert Zeichnungen, die Finanzen erklären',
})

/**
 * Die Gruppen, nach denen die Zeichnungen geordnet stehen.
 *
 * Abgeleitet aus dem Namensschema der Kennungen. Die Alternative wäre eine
 * Zuordnung von Hand für über hundert Einträge – und jede neue Zeichnung
 * fiele dann still hinten herunter, statt in ihrer Gruppe zu erscheinen.
 */
const GRUPPEN: { titel: string; einleitung: string; praefixe: string[] }[] = [
  {
    titel: 'Grundlagen',
    einleitung:
      'Zins, Inflation, Risiko und Rendite – die Begriffe, auf denen alles andere aufbaut.',
    praefixe: ['zins', 'inflation', 'risiko', 'sparen', 'budget', 'geld'],
  },
  {
    titel: 'Börse und Wertpapiere',
    einleitung: 'Wie Aktien, Anleihen, Fonds und Derivate funktionieren.',
    praefixe: [
      'aktie',
      'anleihe',
      'etf',
      'fonds',
      'derivat',
      'option',
      'boerse',
      'markt',
      'krypto',
      'rohstoff',
      'immobilie',
    ],
  },
  {
    titel: 'Steuern, Kosten und Vorsorge',
    einleitung:
      'Was vom Ertrag übrig bleibt – und was für später zurückgelegt werden muss.',
    praefixe: ['steuer', 'kosten', 'rente', 'vorsorge', 'depot', 'einlagen'],
  },
  {
    titel: 'Akademie',
    einleitung:
      'Charttechnik, Kennzahlen, Portfoliotheorie, Makroanalyse und Anlegerverhalten.',
    praefixe: ['ta-', 'fa-', 'pt-', 'ma-', 'av-'],
  },
]

function gruppeFuer(id: string): string {
  for (const gruppe of GRUPPEN) {
    if (gruppe.praefixe.some((praefix) => id.startsWith(praefix))) return gruppe.titel
  }
  /*
    Was in keine Gruppe passt, verschwindet nicht, sondern landet sichtbar in
    „Weitere“. Eine Zeichnung, die durch das Raster fällt, soll auffallen –
    nicht fehlen.
  */
  return 'Weitere'
}

export default function GrafikenSeite() {
  const alle = Object.entries(figureMeta) as [FigureId, (typeof figureMeta)[FigureId]][]

  const nachGruppe = new Map<string, typeof alle>()
  for (const eintrag of alle) {
    const gruppe = gruppeFuer(eintrag[0])
    const bisher = nachGruppe.get(gruppe)
    if (bisher) bisher.push(eintrag)
    else nachGruppe.set(gruppe, [eintrag])
  }

  const reihenfolge = [...GRUPPEN.map((gruppe) => gruppe.titel), 'Weitere'].filter(
    (titel) => nachGruppe.has(titel)
  )

  return (
    <>
      <PageHeader
        area="learn"
        eyebrow="Erklärgrafiken"
        eyebrowIcon="lightbulb"
        title="Über hundert Zeichnungen"
        lead="Jede davon steht in einer Lernstufe und erklärt dort eine Sache. Hier stehen sie alle nebeneinander – zum Wiederfinden und zum Durchsehen."
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Lernen', path: '/lernen' }, { name: 'Grafiken' }]}
          />
        }
        meta={
          <>
            <span>{alle.length} Zeichnungen</span>
            <span aria-hidden="true">·</span>
            <span>{reihenfolge.length} Gruppen</span>
            <span aria-hidden="true">·</span>
            <span>alle selbst gezeichnet</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <p className="text-fg-muted max-w-2xl leading-relaxed">
          Alle Zeichnungen dieser Website sind selbst angelegt – als SVG, ohne
          Fremdbibliothek und ohne Bilddatei. Das hat zwei Gründe: Sie folgen dem hellen
          und dunklen Farbschema, ohne neu gezeichnet zu werden, und sie kosten beim Laden
          nichts, weil sie Teil der Seite sind statt eines zusätzlichen Abrufs.
        </p>
        <p className="text-fg-muted mt-3 max-w-2xl leading-relaxed">
          Der Satz unter jeder Zeichnung ist nicht schmückend. Eine Grafik zeigt eine
          Form; erst die Unterschrift sagt, was daraus folgt – und genau deshalb wird hier
          überhaupt gezeichnet.
        </p>

        {reihenfolge.map((titel) => {
          const gruppe = GRUPPEN.find((eintrag) => eintrag.titel === titel)
          const eintraege = nachGruppe.get(titel) ?? []
          return (
            <section
              key={titel}
              aria-labelledby={`gruppe-${titel}`}
              className="mt-14 scroll-mt-24"
            >
              <h2 id={`gruppe-${titel}`} className="text-fg text-2xl font-bold">
                {titel}
              </h2>
              <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
                {gruppe?.einleitung ??
                  'Zeichnungen, die sich keiner der übrigen Gruppen zuordnen ließen.'}{' '}
                <span className="text-fg-subtle">
                  {eintraege.length}{' '}
                  {eintraege.length === 1 ? 'Zeichnung' : 'Zeichnungen'}
                </span>
              </p>

              <div className="mt-6 grid gap-8 lg:grid-cols-2">
                {eintraege.map(([id, meta], index) => (
                  <div key={id} id={id} className="scroll-mt-24">
                    <Reveal delay={Math.min(index, 8) * 0.03}>
                      <h3 className="text-fg text-base font-semibold">{meta.title}</h3>
                      <ContentFigure id={id} />
                    </Reveal>
                  </div>
                ))}
              </div>
            </section>
          )
        })}

        <p className="mt-14">
          <Link
            href="/lernen"
            className="text-learn font-medium underline underline-offset-2"
          >
            Zum Lernbereich
          </Link>
        </p>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Alle Erklärgrafiken',
          description:
            'Über hundert selbst gezeichnete Erklärgrafiken zu Zins, Risiko, Steuern und Börse.',
          path: '/lernen/grafiken',
          items: [{ name: 'Lernbereich', path: '/lernen' }],
        })}
      />
    </>
  )
}
