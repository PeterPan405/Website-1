import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { AENDERUNGEN, type Aenderungsart } from '@/data/aenderungen'
import { formatDate } from '@/lib/format'
import { collectionPageSchema } from '@/lib/jsonld'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  // 149 Zeichen. Grenze 160 (`scripts/paket-pruefen.ts`).
  title: withBrand('Was sich geändert hat'),
  description:
    'Neue Seiten, geänderte Darstellung und korrigierte Angaben – in der Sprache des Lesers, mit den Korrekturen an uns selbst, nicht nur den Verbesserungen.',
  path: '/aenderungen',
  ogTitle: 'Was sich an dieser Website geändert hat',
})

/**
 * Das Änderungsprotokoll.
 *
 * ## Warum es die Korrekturen mitnennt
 *
 * Weil eine Liste, die nur Verbesserungen aufzählt, Werbung ist. Diese Seite
 * setzt fort, was `/news/korrekturen` für einzelne Artikel begonnen hat: Wer
 * sagt, was er geändert hat, sagt auch, was vorher falsch war.
 *
 * ## Warum die Einträge von Hand geschrieben sind
 *
 * Ein Commit-Titel ist für Entwickler geschrieben. Was ein Besucher wissen
 * will, ist etwas anderes – und eine automatische Übersetzung erfände
 * Bedeutung, wo im Titel keine steht. `npm run aenderungen` sorgt dafür, dass
 * nichts untergeht; geschrieben wird `data/aenderungen.ts` von Hand.
 */

const ARTEN: Record<Aenderungsart, { wort: string; klasse: string }> = {
  neu: { wort: 'Neu', klasse: 'border-success/40 text-success' },
  geaendert: { wort: 'Geändert', klasse: 'border-border-strong text-fg-muted' },
  /*
    Korrekturen tragen die Warnfarbe und nicht die Fehlerfarbe.

    Rot hieße „hier ist etwas kaputt". Eine Korrektur ist das Gegenteil: die
    Stelle, an der etwas repariert wurde. Sie soll auffallen, ohne zu alarmieren.
  */
  korrigiert: { wort: 'Korrigiert', klasse: 'border-warning/40 text-warning' },
}

export default function AenderungenSeite() {
  const korrekturen = AENDERUNGEN.filter((a) => a.art === 'korrigiert').length

  /* Nach Tagen gruppiert, Reihenfolge aus der Datei – siehe dort. */
  const tage = [...new Set(AENDERUNGEN.map((a) => a.datum))]

  return (
    <>
      <PageHeader
        area="markets"
        eyebrow="Änderungen"
        eyebrowIcon="info"
        title="Was sich geändert hat"
        lead="Neue Seiten, geänderte Darstellung, korrigierte Angaben – und ausdrücklich auch das, was vorher falsch war."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Änderungen' }]} />}
        meta={
          <>
            <span>{AENDERUNGEN.length} Einträge</span>
            <span aria-hidden="true">·</span>
            <span>{korrekturen} davon Korrekturen an uns selbst</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <Callout variant="info" title="Warum hier auch Fehler stehen">
          <p>
            Eine Liste, die nur Verbesserungen aufzählt, ist Werbung. Wenn wir eine Angabe
            korrigieren, steht hier, was vorher dastand und warum es nicht stimmte – so
            wie bei einzelnen Artikeln auf{' '}
            <Link href="/news/korrekturen" className="underline underline-offset-2">
              Korrekturen
            </Link>
            .
          </p>
          <p className="mt-3">
            Was nur unter der Haube passiert, steht nicht hier. Ein Umbau, den niemand
            merkt, ist keine Änderung an der Website, sondern an ihrem Innenleben.
          </p>
        </Callout>

        <div className="mt-12 space-y-12">
          {tage.map((tag) => (
            <section key={tag} aria-labelledby={`tag-${tag}`}>
              <h2
                id={`tag-${tag}`}
                className="text-fg-subtle border-border border-b pb-2 text-sm font-semibold tracking-wide uppercase"
              >
                {formatDate(tag)}
              </h2>

              <ul className="mt-6 space-y-8">
                {AENDERUNGEN.filter((a) => a.datum === tag).map((eintrag) => {
                  const art = ARTEN[eintrag.art]
                  return (
                    <li key={eintrag.titel}>
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${art.klasse}`}
                      >
                        {art.wort}
                      </span>
                      <h3 className="text-fg mt-2 text-lg font-bold">{eintrag.titel}</h3>
                      <p className="text-fg-muted mt-2 max-w-3xl leading-relaxed">
                        {eintrag.text}
                      </p>
                      {eintrag.ziel && (
                        <p className="mt-2">
                          <Link
                            href={eintrag.ziel.href}
                            className="text-markets text-sm font-medium underline underline-offset-2"
                          >
                            {eintrag.ziel.text}
                          </Link>
                        </p>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>

        <p className="text-fg-subtle mt-14 text-sm leading-relaxed">
          Die Liste beginnt am 11. August 2026. Ältere Änderungen sind nicht nachgetragen
          – ein rückwirkend geschriebenes Protokoll wäre eine Erzählung, keine
          Aufzeichnung.
        </p>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Was sich geändert hat',
          description:
            'Neue Seiten, geänderte Darstellung und korrigierte Angaben an dieser Website.',
          path: '/aenderungen',
          items: AENDERUNGEN.map((eintrag) => ({
            name: eintrag.titel,
            path: '/aenderungen',
          })),
        })}
      />
    </>
  )
}
