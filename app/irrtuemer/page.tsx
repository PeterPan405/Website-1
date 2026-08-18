import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { IRRTUEMER } from '@/data/irrtuemer'
import {
  GRUPPEN,
  ergebniszeile,
  nachGruppe,
  type Einheit,
  type Irrtum,
  type Rechnung,
} from '@/lib/irrtuemer'
import { collectionPageSchema } from '@/lib/jsonld'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  // 152 Zeichen. Die Grenze liegt bei 160 (`scripts/paket-pruefen.ts`).
  title: withBrand('Das stimmt so nicht'),
  description:
    'Sätze, die man ständig hört – „minus 50 hole ich mit plus 50 wieder rein“, „ein Prozent Gebühr ist nichts“. Je Satz: was stimmt, was nicht, die Rechnung.',
  path: '/irrtuemer',
  ogTitle: 'Das stimmt so nicht',
})

/**
 * Verbreitete Irrtümer – und die Rechnung daneben.
 *
 * ## Warum der Satz zuerst kommt und nicht seine Korrektur
 *
 * Weil man sich an der eigenen Formulierung wiedererkennt, nicht an ihrer
 * Berichtigung. Wer glaubt, minus fünfzig Prozent seien mit plus fünfzig
 * wieder aufgeholt, sucht nicht nach „Erholung" – er hat die Frage bereits
 * beantwortet. Ein Glossar erreicht ihn nicht, weil ein Glossar voraussetzt,
 * dass jemand nachschlägt.
 *
 * ## Warum „was daran richtig ist" vor dem Einwand steht
 *
 * Weil fast jeder dieser Sätze eine verkürzte Wahrheit ist. Steht der Einwand
 * zuerst, liest sich die Seite als Belehrung – und dann liest sie niemand zu
 * Ende. Die Reihenfolge ist deshalb keine Höflichkeit, sondern die Bedingung
 * dafür, dass die Rechnung überhaupt ankommt.
 *
 * ## Warum jede Rechnung nachgerechnet wird
 *
 * Eine Seite, die falsche Zahlen richtigstellt, darf keine enthalten.
 * `tests/irrtuemer.test.ts` rechnet jede Rechnung mit denselben Funktionen
 * nach, mit denen die Rechner dieser Website rechnen, und vergleicht das
 * Ergebnis mit dem, was hier steht.
 */
export default function IrrtuemerSeite() {
  return (
    <>
      <PageHeader
        area="learn"
        eyebrow="Richtigstellungen"
        eyebrowIcon="info"
        title="Das stimmt so nicht"
        lead="Sätze, die man ständig hört. Je Satz: was daran richtig ist, was nicht – und die Rechnung, die es zeigt."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Irrtümer' }]} />}
        meta={
          <>
            <span>{IRRTUEMER.length} Sätze</span>
            <span aria-hidden="true">·</span>
            <span>jeder mit Beleg</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <Callout variant="info" title="Kein Spott">
          <p>
            Fast jeder dieser Sätze ist eine <strong>verkürzte Wahrheit</strong>, keine
            Dummheit. „Der Markt hat sich immer erholt“ stimmt für einen breiten Index
            über lange Zeiträume; falsch wird der Satz erst, wenn man ihn auf einen
            einzelnen Wert anwendet. Wer ihn übernommen hat, hat keinen Denkfehler
            gemacht, sondern einen Satz gehört, dem sein Geltungsbereich abhandengekommen
            ist.
          </p>
          <p className="mt-3">
            Deshalb steht hier bei jedem Eintrag zuerst, <em>was daran richtig ist</em> –
            und erst danach der Einwand.
          </p>
        </Callout>

        {/*
          Ein Inhaltsverzeichnis, weil die Seite lang ist.

          Nicht als Aufzählung aller Sätze: Das wäre die Seite noch einmal. Die
          sechs Gruppen reichen, um zu entscheiden, wo man einsteigt.
        */}
        <nav aria-label="Gruppen" className="mt-10">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {GRUPPEN.map((gruppe) => (
              <li key={gruppe.id}>
                <a
                  href={`#${gruppe.id}`}
                  className="border-border text-fg-muted hover:border-brand hover:text-fg inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors"
                >
                  {gruppe.titel}
                  <span className="text-fg-subtle tabular-nums">
                    {nachGruppe(IRRTUEMER, gruppe.id).length}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-12 space-y-20">
          {GRUPPEN.map((gruppe) => (
            <section key={gruppe.id} id={gruppe.id} aria-labelledby={`g-${gruppe.id}`}>
              <h2
                id={`g-${gruppe.id}`}
                className="text-fg border-border border-b pb-3 text-2xl font-bold"
              >
                {gruppe.titel}
              </h2>
              <p className="text-fg-muted mt-3 max-w-3xl leading-relaxed">
                {gruppe.lead}
              </p>

              <div className="mt-8 space-y-12">
                {nachGruppe(IRRTUEMER, gruppe.id).map((irrtum) => (
                  <IrrtumBlock key={irrtum.slug} irrtum={irrtum} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="text-fg-subtle mt-16 max-w-3xl text-sm leading-relaxed">
          Fehlt ein Satz, der dir aufgefallen ist – oder stimmt hier einer nicht?{' '}
          <Link href="/kontakt" className="underline underline-offset-2">
            Schreib uns
          </Link>
          . Zu jeder Behauptung auf dieser Seite gehört eine Rechnung oder eine
          Fundstelle; wenn eine fehlt, ist das ein Fehler.
        </p>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Das stimmt so nicht',
          description:
            'Verbreitete Irrtümer über Geldanlage – je Satz, was daran richtig ist, was nicht, und die Rechnung dazu.',
          path: '/irrtuemer',
          items: IRRTUEMER.map((irrtum) => ({
            name: irrtum.satz,
            path: `/irrtuemer#${irrtum.slug}`,
          })),
        })}
      />
    </>
  )
}

function IrrtumBlock({ irrtum }: { irrtum: Irrtum }) {
  return (
    <article id={irrtum.slug} aria-labelledby={`s-${irrtum.slug}`}>
      {/*
        Der Satz als Zitat, nicht als Überschrift.

        Er ist nicht die Aussage der Seite, sondern das, was widerlegt wird –
        und darf deshalb nicht so aussehen wie etwas, das hier behauptet wird.
      */}
      <blockquote
        id={`s-${irrtum.slug}`}
        className="border-border bg-surface text-fg rounded-lg border-l-4 p-5 text-lg leading-relaxed font-medium"
      >
        „{irrtum.satz}“
      </blockquote>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <p className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
            Was daran richtig ist
          </p>
          <p className="text-fg-muted mt-2 leading-relaxed">{irrtum.richtig}</p>
        </div>
        <div>
          <p className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
            Was nicht stimmt
          </p>
          <p className="text-fg-muted mt-2 leading-relaxed">{irrtum.falsch}</p>
        </div>
      </div>

      {irrtum.beleg.rechnung && <Rechenblock rechnung={irrtum.beleg.rechnung} />}

      <p className="text-fg-muted mt-4 max-w-3xl text-sm leading-relaxed">
        {irrtum.beleg.text}
      </p>

      <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {irrtum.beleg.quelle &&
          (irrtum.beleg.quelle.url ? (
            <Link
              href={irrtum.beleg.quelle.url}
              className="text-fg-subtle hover:text-fg underline underline-offset-2"
            >
              {irrtum.beleg.quelle.label}
            </Link>
          ) : (
            <span className="text-fg-subtle">{irrtum.beleg.quelle.label}</span>
          ))}
        {irrtum.lernen && (
          <Link
            href={irrtum.lernen.href}
            className="text-learn font-medium underline underline-offset-2"
          >
            {irrtum.lernen.text}
          </Link>
        )}
        {irrtum.glossar?.map((slug) => (
          <Link
            key={slug}
            href={`/glossar#${slug}`}
            className="text-fg-subtle hover:text-fg underline underline-offset-2"
          >
            {slug} im Glossar
          </Link>
        ))}
      </p>
    </article>
  )
}

/**
 * Die Rechnung – oder die Begründung, warum hier keine steht.
 *
 * Der zweite Fall ist kein Platzhalter. Bei der Korrelation in der Krise ist
 * die fehlende Zahl der eigentliche Inhalt: Sie hinzuschreiben hieße zu
 * behaupten, sie halte auch beim nächsten Mal.
 */
function Rechenblock({ rechnung }: { rechnung: Rechnung }) {
  if (rechnung.probe.art === 'keine') {
    return (
      <div className="border-border bg-surface-2 mt-5 rounded-lg border border-dashed p-5">
        <p className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
          {rechnung.titel}
        </p>
        <p className="text-fg-muted mt-2 max-w-3xl text-sm leading-relaxed">
          {rechnung.probe.warum}
        </p>
      </div>
    )
  }

  const ergebnis = ergebniszeile(rechnung)

  return (
    <div className="border-brand/40 bg-surface mt-5 rounded-lg border p-5">
      <p className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
        {rechnung.titel}
      </p>
      <dl className="mt-3 max-w-lg space-y-1.5 text-sm">
        {rechnung.zeilen.map((zeile) => (
          <div
            key={zeile.was}
            className={
              zeile.ergebnis
                ? 'border-border text-fg flex items-baseline justify-between gap-4 border-t pt-2 font-semibold'
                : 'text-fg-muted flex items-baseline justify-between gap-4'
            }
          >
            <dt>{zeile.was}</dt>
            <dd className="tabular-nums">{formatiere(zeile.wert, zeile.einheit)}</dd>
          </div>
        ))}
      </dl>
      {ergebnis && (
        <p className="text-fg-subtle mt-3 text-xs">
          Nachgerechnet beim Bauen – nicht abgeschrieben.
        </p>
      )}
    </div>
  )
}

/**
 * Zahl und Einheit für die Anzeige.
 *
 * Die Nachkommastellen hängen an der Einheit und nicht am Wert: Ein Endwert
 * über dreißig Jahre auf zwei Stellen genau vorzugaukeln wäre eine
 * Scheingenauigkeit, ein Realzins von „−1“ statt „−0,97“ dagegen genau die
 * Rundung, um die es in dem Eintrag geht.
 */
function formatiere(wert: number, einheit: Einheit): string {
  const stellen: Record<Einheit, number> = {
    prozent: 2,
    euro: 2,
    jahre: 0,
    faktor: 2,
    anzahl: 0,
  }

  const zahl = wert.toLocaleString('de-DE', {
    minimumFractionDigits: stellen[einheit],
    maximumFractionDigits: stellen[einheit],
  })

  switch (einheit) {
    case 'prozent':
      return `${zahl} %`
    case 'euro':
      return zahl
    case 'jahre':
      return wert === 1 ? '1 Jahr' : `${zahl} Jahre`
    case 'faktor':
      return `${zahl}-fach`
    case 'anzahl':
      return zahl
  }
}
