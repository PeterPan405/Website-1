import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { collectionPageSchema } from '@/lib/jsonld'
import { METHODEN } from '@/lib/methoden'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  // 154 Zeichen. Die Grenze liegt bei 160 (`scripts/paket-pruefen.ts`).
  title: withBrand('Methoden: wie jede Kennzahl gerechnet wird'),
  description:
    'Für jede Kennzahl dieser Website: die Formel, die Datenquelle, der Stichtag und was bewusst weggelassen wird – mit einem Beispiel, das mitgerechnet wird.',
  path: '/methoden',
  ogTitle: 'Wie jede Kennzahl gerechnet wird',
})

/**
 * Das Gegenstück zu `/quellen`.
 *
 * Dort steht **woher** die Zahlen kommen, hier steht **wie** daraus eine
 * Kennzahl wird.
 *
 * ## Warum die Beispiele mitgerechnet werden
 *
 * Jede Kachel zeigt eine Beispielrechnung, und die entsteht beim Bauen aus
 * derselben Funktion, die auch die Website benutzt. Ein hingeschriebenes
 * „ergibt −10 %" wäre eine Behauptung, die beim nächsten Umbau still falsch
 * wird – und ausgerechnet auf einer Methodenseite wäre das die schlechteste
 * Stelle dafür.
 *
 * ## Warum die Vereinfachungen so viel Platz bekommen
 *
 * Weil sie der Teil sind, den sonst niemand schreibt. Dass eine
 * Dividendenrendite zurückblickt, dass eine Marktbreite ungewichtet zählt,
 * dass ein Rückblick ohne Kosten und Steuern rechnet – das steht auf keiner
 * Finanzseite, und genau daran entscheidet sich, was eine Zahl wert ist.
 */
export default function MethodenSeite() {
  return (
    <>
      <PageHeader
        area="markets"
        eyebrow="Methoden"
        eyebrowIcon="chart"
        title="Wie jede Kennzahl gerechnet wird"
        lead="Für jede Zahl auf dieser Website: die Formel, woher die Daten kommen, auf welchen Stichtag sie sich bezieht – und was dabei bewusst weggelassen wird."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Methoden' }]} />}
        meta={
          <>
            <span>{METHODEN.length} Kennzahlen</span>
            <span aria-hidden="true">·</span>
            <span>Beispiele mitgerechnet</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <Callout variant="info" title="Was diese Seite von einem Glossar unterscheidet">
          <p>
            Ein Glossar erklärt, was ein Begriff bedeutet. Hier steht, was{' '}
            <strong className="text-fg">diese Website</strong> rechnet – mit den
            Entscheidungen, die dabei getroffen wurden. Zwei Anbieter können dieselbe
            Kennzahl nennen und verschiedene Zahlen zeigen, weil sie verschiedene
            Zeitfenster, Gewichtungen oder Stichtage nehmen.
          </p>
          <p className="mt-3">
            Die Beispielrechnungen sind nicht abgetippt, sondern werden beim Bauen aus
            derselben Funktion erzeugt, die auch die Kennzahl selbst rechnet. Wo die
            Zahlen herkommen, steht auf{' '}
            <Link href="/quellen" className="underline underline-offset-2">
              Quellen
            </Link>
            .
          </p>
        </Callout>

        {/* ---------------------------------------------------- Inhalt */}
        <nav aria-label="Kennzahlen auf dieser Seite" className="mt-10">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {METHODEN.map((methode) => (
              <li key={methode.slug}>
                <a
                  href={`#${methode.slug}`}
                  className="text-fg-muted hover:text-markets underline underline-offset-2 transition"
                >
                  {methode.titel}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 space-y-10">
          {METHODEN.map((methode) => {
            const beispiel = methode.beispiel()
            return (
              <section
                key={methode.slug}
                id={methode.slug}
                aria-labelledby={`${methode.slug}-titel`}
                className="fk-card scroll-mt-28 p-6 sm:p-8"
              >
                <h2 id={`${methode.slug}-titel`} className="text-fg text-2xl font-bold">
                  {methode.titel}
                </h2>
                <p className="text-fg-muted mt-2 leading-relaxed">{methode.frage}</p>

                <dl className="mt-6 space-y-4">
                  <div>
                    <dt className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
                      Formel
                    </dt>
                    {/*
                      Als `<code>`, weil es eine Rechnung ist und keine Prosa –
                      und weil die Zeichen − und ÷ in einer Fließschrift zu
                      leicht mit Bindestrich und Schrägstrich verwechselt werden.
                    */}
                    <dd className="mt-1">
                      <code className="bg-surface-muted text-fg rounded px-2 py-1 text-sm">
                        {methode.formel}
                      </code>
                    </dd>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
                        Datengrundlage
                      </dt>
                      <dd className="text-fg-muted mt-1 text-sm leading-relaxed">
                        {methode.quelle}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
                        Stichtag
                      </dt>
                      <dd className="text-fg-muted mt-1 text-sm leading-relaxed">
                        {methode.stichtag}
                      </dd>
                    </div>
                  </div>

                  <div>
                    <dt className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
                      Beispiel
                    </dt>
                    <dd className="border-border bg-surface-muted mt-1 rounded-lg border px-4 py-3 text-sm">
                      <span className="text-fg-muted">{beispiel.eingabe}</span>
                      <span aria-hidden="true" className="text-fg-subtle mx-2">
                        →
                      </span>
                      <strong className="text-fg tabular-nums">
                        {beispiel.ergebnis}
                      </strong>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
                      Was dabei wegfällt
                    </dt>
                    <dd className="mt-1">
                      <ul className="text-fg-muted list-disc space-y-2 pl-5 text-sm leading-relaxed">
                        {methode.vereinfachungen.map((satz) => (
                          <li key={satz}>{satz}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>

                <p className="text-fg-subtle mt-6 text-xs">
                  Gerechnet in{' '}
                  <code className="bg-surface-muted rounded px-1.5 py-0.5">
                    {methode.herkunft.datei}
                  </code>
                  , Funktion{' '}
                  <code className="bg-surface-muted rounded px-1.5 py-0.5">
                    {methode.herkunft.funktion}()
                  </code>
                  . Zu sehen bei{' '}
                  <Link
                    href={methode.zuSehen.href}
                    className="hover:text-markets underline underline-offset-2"
                  >
                    {methode.zuSehen.text}
                  </Link>
                  .
                </p>
              </section>
            )
          })}
        </div>

        <p className="text-fg-muted mt-12 text-sm leading-relaxed">
          Eine Kennzahl fehlt oder eine Angabe stimmt nicht?{' '}
          <Link
            href="/kontakt"
            className="hover:text-markets underline underline-offset-2"
          >
            Schreiben Sie uns
          </Link>
          . Diese Seite ist der Ort, an dem wir uns festlegen – Widerspruch dazu ist
          willkommen.
        </p>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Methoden: wie jede Kennzahl gerechnet wird',
          description:
            'Formel, Datenquelle, Stichtag und bewusste Vereinfachungen für jede Kennzahl dieser Website.',
          path: '/methoden',
          items: METHODEN.map((methode) => ({
            name: methode.titel,
            path: `/methoden#${methode.slug}`,
          })),
        })}
      />
    </>
  )
}
