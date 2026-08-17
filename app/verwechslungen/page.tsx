import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { VERWECHSLUNGEN } from '@/data/verwechslungen'
import { collectionPageSchema } from '@/lib/jsonld'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  // 156 Zeichen. Die Grenze liegt bei 160 (`scripts/paket-pruefen.ts`).
  title: withBrand('Verwechslungspaare'),
  description:
    'Sechs Begriffspaare, die im Alltag durcheinandergehen – ETF und Fonds, Zins und Rendite, nominal und real – zweispaltig, mit dem Satz zum Unterscheiden.',
  path: '/verwechslungen',
  ogTitle: 'Begriffe, die ständig verwechselt werden',
})

/**
 * Verwechslungspaare – zwei Begriffe nebeneinander.
 *
 * ## Warum das Glossar dafür nicht reicht
 *
 * Weil es Begriffe **einzeln** erklärt, und das ist genau die Form, in der
 * eine Verwechslung überlebt: Wer „Volatilität" nachschlägt, liest eine
 * richtige Erklärung und geht mit demselben Missverständnis weiter. Man sucht
 * nicht nach einem Unterschied, den man nicht vermutet.
 *
 * ## Warum die Zeilen parallel laufen
 *
 * Damit man **quer** liest statt zweimal längs. Links und rechts beantworten
 * dieselbe Frage – erst dadurch wird aus zwei Erklärungen ein Vergleich.
 */
export default function VerwechslungenSeite() {
  return (
    <>
      <PageHeader
        area="learn"
        eyebrow="Begriffe"
        eyebrowIcon="info"
        title="Begriffe, die ständig verwechselt werden"
        lead="Zwei Spalten, dieselben Fragen – und darunter der eine Satz, an dem man die beiden im Alltag auseinanderhält."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Verwechslungen' }]} />}
        meta={
          <>
            <span>{VERWECHSLUNGEN.length} Paare</span>
            <span aria-hidden="true">·</span>
            <span>jeweils mit Merksatz</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <Callout variant="info" title="Warum das nicht ins Glossar gehört">
          <p>
            Das{' '}
            <Link href="/glossar" className="underline underline-offset-2">
              Glossar
            </Link>{' '}
            erklärt Begriffe einzeln – und genau darin überlebt eine Verwechslung: Wer
            „Volatilität“ nachschlägt, liest eine richtige Erklärung und geht mit
            demselben Missverständnis weiter. Man sucht nicht nach einem Unterschied, den
            man nicht vermutet.
          </p>
          <p className="mt-3">
            Nebeneinander gestellt zeigt er sich, ohne dass man nach ihm gesucht hat.
          </p>
        </Callout>

        <div className="mt-12 space-y-16">
          {VERWECHSLUNGEN.map((paar) => (
            <section key={paar.slug} id={paar.slug} aria-labelledby={`t-${paar.slug}`}>
              <h2 id={`t-${paar.slug}`} className="text-fg text-2xl font-bold">
                {paar.linksName} <span className="text-fg-subtle">gegen</span>{' '}
                {paar.rechtsName}
              </h2>
              <p className="text-fg-muted mt-3 max-w-3xl leading-relaxed">{paar.frage}</p>

              {/*
                Eine Tabelle, keine zwei Listen nebeneinander.

                Der Vergleich lebt davon, dass links und rechts dieselbe Frage
                beantworten – das ist eine Zeile mit zwei Zellen und keine zwei
                Spalten, die zufällig gleich lang sind. Für Screenreader ist es
                derselbe Unterschied: eine Tabelle wird quer vorgelesen.
              */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[42rem] border-collapse text-sm">
                  <caption className="sr-only">
                    {paar.linksName} und {paar.rechtsName} im Vergleich
                  </caption>
                  <thead>
                    <tr className="border-border border-b text-left">
                      <th
                        scope="col"
                        className="text-fg-subtle w-[22%] py-2 pr-4 text-xs font-semibold tracking-wide uppercase"
                      >
                        Frage
                      </th>
                      <th scope="col" className="text-fg w-[39%] py-2 pr-4 font-semibold">
                        {paar.linksName}
                      </th>
                      <th scope="col" className="text-fg w-[39%] py-2 font-semibold">
                        {paar.rechtsName}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paar.zeilen.map((zeile) => (
                      <tr key={zeile.was} className="border-border/60 border-b align-top">
                        <th
                          scope="row"
                          className="text-fg-muted py-3 pr-4 text-left font-medium"
                        >
                          {zeile.was}
                        </th>
                        <td className="text-fg-muted py-3 pr-4 leading-relaxed">
                          {zeile.links}
                        </td>
                        <td className="text-fg-muted py-3 leading-relaxed">
                          {zeile.rechts}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/*
                Der Merksatz ist das Ergebnis, nicht die Zusammenfassung.

                Eine Gegenüberstellung ohne ihn ist eine Tabelle, die man beim
                nächsten Mal wieder nachschlagen muss. Deshalb steht er
                hervorgehoben und nicht als letzte Tabellenzeile.
              */}
              <div className="border-brand/40 bg-surface mt-6 rounded-lg border-l-4 p-5">
                <p className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
                  Der Satz zum Merken
                </p>
                <p className="text-fg mt-2 leading-relaxed font-medium">
                  {paar.merksatz}
                </p>
              </div>

              <p className="text-fg-muted mt-5 max-w-3xl text-sm leading-relaxed">
                <strong className="text-fg font-semibold">Warum es zählt:</strong>{' '}
                {paar.warumEsZaehlt}
              </p>

              <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {paar.zuSehen && (
                  <Link
                    href={paar.zuSehen.href}
                    className="text-learn font-medium underline underline-offset-2"
                  >
                    {paar.zuSehen.text}
                  </Link>
                )}
                {paar.glossar?.links && (
                  <Link
                    href={`/glossar#${paar.glossar.links}`}
                    className="text-fg-subtle hover:text-fg underline underline-offset-2"
                  >
                    {paar.linksName} im Glossar
                  </Link>
                )}
                {paar.glossar?.rechts && (
                  <Link
                    href={`/glossar#${paar.glossar.rechts}`}
                    className="text-fg-subtle hover:text-fg underline underline-offset-2"
                  >
                    {paar.rechtsName} im Glossar
                  </Link>
                )}
              </p>
            </section>
          ))}
        </div>

        <p className="text-fg-subtle mt-16 max-w-3xl text-sm leading-relaxed">
          Fehlt ein Paar, das dir selbst durcheinandergegangen ist?{' '}
          <Link href="/kontakt" className="underline underline-offset-2">
            Schreib uns
          </Link>{' '}
          – die Liste lebt davon, dass jemand sagt, wo er hängengeblieben ist.
        </p>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Begriffe, die ständig verwechselt werden',
          description:
            'Begriffspaare aus der Finanzwelt, zweispaltig gegenübergestellt, mit dem Satz zum Unterscheiden.',
          path: '/verwechslungen',
          items: VERWECHSLUNGEN.map((paar) => ({
            name: `${paar.linksName} gegen ${paar.rechtsName}`,
            path: `/verwechslungen#${paar.slug}`,
          })),
        })}
      />
    </>
  )
}
