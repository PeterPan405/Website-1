import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatDate, formatNumber, formatPercentSigned } from '@/lib/format'
import { buildMetadata, withBrand } from '@/lib/seo'
import { getWochenrueckblick } from '@/lib/wochenrueckblick'

/**
 * Der Wochenrückblick – gerechnet aus Kursreihen und Tagesausgaben.
 *
 * Wie das Tagesbild, nur eine Zoomstufe weiter weg: kein frei geschriebener
 * Satz, jede Zahl aus dem Bestand. Die Seite entsteht bei jedem Bau neu und
 * zeigt immer die letzte abgeschlossene Handelswoche – ein Rückblick auf
 * eine halbe Woche wäre eine Zahl, die sich bis Freitag noch dreimal dreht.
 */

export const metadata: Metadata = buildMetadata({
  title: withBrand('Wochenrückblick der Märkte'),
  description:
    'Die abgelaufene Handelswoche in Zahlen: Indizes, Gold, Öl, Bitcoin und Euro im Wochenvergleich, dazu die Tagesausgaben der Woche – gerechnet aus den Kursreihen, nicht geschrieben.',
  path: '/news/woche',
  ogTitle: 'Wochenrückblick der Märkte',
})

export default async function WochenrueckblickSeite() {
  const rueckblick = await getWochenrueckblick()
  const { spanne, werte, zahlDerWoche, ausgaben } = rueckblick

  return (
    <>
      <PageHeader
        area="news"
        eyebrow="Wochenrückblick"
        eyebrowIcon="chart"
        title={`Die Woche vom ${formatDate(spanne.montag)}`}
        lead={`Montag bis Freitag (${formatDate(spanne.montag)} bis ${formatDate(spanne.freitag)}) in Zahlen – gerechnet aus den Kursreihen dieser Website. Basis jeder Wochenzahl ist der letzte Schluss vor dem Montag.`}
        breadcrumbs={
          <Breadcrumbs items={[{ name: 'News', path: '/news' }, { name: 'Woche' }]} />
        }
        meta={
          <>
            <span>{werte.length} Bezugswerte</span>
            <span aria-hidden="true">·</span>
            <span>
              {ausgaben.length} {ausgaben.length === 1 ? 'Tagesausgabe' : 'Tagesausgaben'}
            </span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        {/* --------------------------------------------------- Zahl der Woche */}
        {zahlDerWoche && (
          <section aria-labelledby="zahl" className="fk-card p-6 sm:p-8">
            <h2
              id="zahl"
              className="text-fg-subtle text-xs font-semibold tracking-wide uppercase"
            >
              Die Zahl der Woche
            </h2>
            <p
              className={`mt-3 text-5xl font-bold tabular-nums sm:text-6xl ${
                zahlDerWoche.bewegung.prozent >= 0 ? 'text-success' : 'text-danger'
              }`}
            >
              {formatPercentSigned(zahlDerWoche.bewegung.prozent)}
            </p>
            <p className="text-fg mt-3 leading-relaxed">
              <Link
                href={`/maerkte/${zahlDerWoche.symbol}`}
                className="hover:text-markets font-semibold underline underline-offset-4"
              >
                {zahlDerWoche.name}
              </Link>{' '}
              hat sich in dieser Woche am stärksten bewegt: von{' '}
              {formatNumber(zahlDerWoche.bewegung.basis, zahlDerWoche.stellen)} auf{' '}
              {formatNumber(zahlDerWoche.bewegung.schluss, zahlDerWoche.stellen)}{' '}
              {zahlDerWoche.einheit}.
            </p>
            <p className="text-fg-subtle mt-2 text-sm leading-relaxed">
              Keine Auswahl einer Redaktion, sondern ein Maximum: der größte
              Wochenausschlag unter den {werte.length} festen Bezugswerten. Was er
              bedeutet, hängt am Instrument – ein Prozent beim Euro ist eine Nachricht,
              ein Prozent bei Bitcoin ein Dienstag.
            </p>
          </section>
        )}

        {/* ------------------------------------------------------ Die Tabelle */}
        <section aria-labelledby="werte" className="mt-12">
          <h2 id="werte" className="text-fg text-2xl font-bold">
            Die Woche in Zahlen
          </h2>
          <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
            Schlusskurse, keine Echtzeitdaten. Bei Werten, die durchhandeln (Bitcoin), ist
            die Basis der Sonntag davor statt des Freitags – deshalb steht der letzte
            gerechnete Tag mit dabei.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-sm">
              <thead>
                <tr className="border-border text-fg-subtle border-b text-left text-xs uppercase">
                  <th scope="col" className="py-2 pr-4 font-medium">
                    Wert
                  </th>
                  <th scope="col" className="py-2 pr-4 text-right font-medium">
                    Basis
                  </th>
                  <th scope="col" className="py-2 pr-4 text-right font-medium">
                    Schluss
                  </th>
                  <th scope="col" className="py-2 pr-4 text-right font-medium">
                    Woche
                  </th>
                  <th scope="col" className="py-2 text-right font-medium">
                    Stand
                  </th>
                </tr>
              </thead>
              <tbody>
                {werte.map((wert) => (
                  <tr key={wert.symbol} className="border-border border-b">
                    <th scope="row" className="py-2.5 pr-4 text-left font-medium">
                      <Link
                        href={`/maerkte/${wert.symbol}`}
                        className="text-fg hover:text-markets"
                      >
                        {wert.name}
                      </Link>
                    </th>
                    <td className="text-fg-muted py-2.5 pr-4 text-right tabular-nums">
                      {formatNumber(wert.bewegung.basis, wert.stellen)}
                    </td>
                    <td className="text-fg py-2.5 pr-4 text-right tabular-nums">
                      {formatNumber(wert.bewegung.schluss, wert.stellen)}
                    </td>
                    <td
                      className={`py-2.5 pr-4 text-right font-semibold tabular-nums ${
                        wert.bewegung.prozent >= 0 ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {formatPercentSigned(wert.bewegung.prozent)}
                    </td>
                    <td className="text-fg-subtle py-2.5 text-right tabular-nums">
                      {formatDate(wert.bewegung.schlussAm)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ------------------------------------------------------- Die Ausgaben */}
        <section aria-labelledby="ausgaben" className="mt-12">
          <h2 id="ausgaben" className="text-fg text-2xl font-bold">
            Was diese Woche geschrieben wurde
          </h2>
          {ausgaben.length === 0 ? (
            <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
              Für diese Woche liegt keine Tagesausgabe vor – das Archiv aller Ausgaben
              steht unter dem Tagesüberblick.
            </p>
          ) : (
            <ul className="mt-6 space-y-4">
              {ausgaben.map((ausgabe) => (
                <li key={ausgabe.date} className="fk-card relative p-5">
                  <p className="text-fg-subtle text-xs font-medium">
                    {formatDate(ausgabe.date)} ·{' '}
                    {ausgabe.top.length + ausgabe.further.length} Meldungen
                  </p>
                  <h3 className="text-fg mt-1.5 font-semibold">
                    <Link
                      href={`/news/tag/${ausgabe.date}`}
                      className="hover:text-news after:absolute after:inset-0"
                    >
                      {ausgabe.top[0]?.headline}
                    </Link>
                  </h3>
                  <p className="text-fg-muted mt-1.5 text-sm leading-relaxed">
                    {ausgabe.intro}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <nav aria-label="Weitere Zeitebenen" className="mt-12 flex flex-wrap gap-3">
          <Link href="/news/tag" className="fk-btn-secondary text-sm">
            Tagesüberblick
          </Link>
          <Link href="/news/monat" className="fk-btn-secondary text-sm">
            Nach Monaten
          </Link>
          <Link href="/news/jahr" className="fk-btn-secondary text-sm">
            Jahresrückblick
          </Link>
          <Link href="/maerkte/tagesbild" className="fk-btn-ghost text-sm">
            Das Tagesbild der Märkte
            <Icon name="arrow-right" className="size-4" />
          </Link>
        </nav>
      </div>
    </>
  )
}
