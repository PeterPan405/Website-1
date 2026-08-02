'use client'

import Link from 'next/link'

import { useMerkliste } from '@/components/markets/merkliste-speicher'
import type { Merkdaten } from '@/components/markets/Merklistentafel'
import { formatDate, formatPercentSigned } from '@/lib/format'

/** Die jüngste Meldung der Website zu einem Symbol – für die Berichtszeile. */
export interface Merkmeldung {
  slug: string
  titel: string
  datum: string
}

/**
 * Der Wochenbericht zur eigenen Merkliste.
 *
 * ## Was er ist
 *
 * Die Antwort auf „Was war diese Woche mit meinen Titeln?“ – ohne dass
 * irgendjemand wissen muss, welche das sind. Der Server rechnet die
 * Wochenveränderung für **alle** Titel (dieselbe Wochenrechnung wie
 * /news/woche, geprüft in lib/wochenrechnung.ts); welche Zeilen der Bericht
 * zeigt, entscheidet erst der Browser anhand der lokalen Liste.
 *
 * ## Was er bewusst nicht ist
 *
 * Keine Depotrendite. Der Schnitt unten ist ungewichtet – er behandelt
 * jeden Titel gleich, weil diese Website nicht weiß und nicht wissen will,
 * wie viel jemand wovon hält. Wer gewichten will, trägt Stückzahlen in die
 * Depotanalyse ein; der Bericht hier beobachtet, er bilanziert nicht.
 */
export function Merkbericht({
  daten,
  wochen,
  meldungen,
  spanne,
}: {
  daten: Merkdaten[]
  /** Wochenveränderung je Symbol, in Prozent – null, wo die Reihe fehlt. */
  wochen: Record<string, number | null>
  meldungen: Record<string, Merkmeldung>
  spanne: { montag: string; freitag: string }
}) {
  const liste = useMerkliste()
  if (liste.length === 0) return null

  const gemerkt = new Set(liste.map((eintrag) => eintrag.symbol))
  const zeilen = daten
    .filter((eintrag) => gemerkt.has(eintrag.symbol))
    .map((eintrag) => ({ ...eintrag, woche: wochen[eintrag.symbol] ?? null }))
    .sort((a, b) => (b.woche ?? -Infinity) - (a.woche ?? -Infinity))
  if (zeilen.length === 0) return null

  const mitWoche = zeilen.filter(
    (zeile): zeile is (typeof zeilen)[number] & { woche: number } => zeile.woche !== null
  )
  const schnitt =
    mitWoche.length > 0
      ? mitWoche.reduce((summe, zeile) => summe + zeile.woche, 0) / mitWoche.length
      : null

  return (
    <section aria-labelledby="wochenbericht" className="mt-12">
      <h2 id="wochenbericht" className="text-fg text-2xl font-bold">
        Dein Wochenbericht
      </h2>
      <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
        Die Woche vom {formatDate(spanne.montag)} bis {formatDate(spanne.freitag)} für
        deine Titel – Wochenveränderung aus Schlusskursen, der nächste erwartete Termin
        und, wo es eine gibt, die jüngste Meldung dieser Website dazu.
      </p>

      {schnitt !== null && (
        <p className="text-fg mt-4 leading-relaxed">
          Im ungewichteten Schnitt{' '}
          <strong className={schnitt >= 0 ? 'text-success' : 'text-danger'}>
            {formatPercentSigned(schnitt)}
          </strong>{' '}
          über {mitWoche.length} {mitWoche.length === 1 ? 'Titel' : 'Titel'} – jeder zählt
          gleich, denn diese Website kennt keine Stückzahlen. Vorn{' '}
          <strong className="text-fg">{mitWoche[0].name}</strong> (
          {formatPercentSigned(mitWoche[0].woche)}), hinten{' '}
          <strong className="text-fg">{mitWoche[mitWoche.length - 1].name}</strong> (
          {formatPercentSigned(mitWoche[mitWoche.length - 1].woche)}).
        </p>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[36rem] text-sm">
          <thead>
            <tr className="border-border text-fg-subtle border-b text-left text-xs uppercase">
              <th scope="col" className="py-2 pr-4 font-medium">
                Titel
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-medium">
                Woche
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Nächster Termin
              </th>
              <th scope="col" className="py-2 font-medium">
                Jüngste Meldung
              </th>
            </tr>
          </thead>
          <tbody>
            {zeilen.map((zeile) => {
              const termin = zeile.termine[0]
              const meldung = meldungen[zeile.symbol]
              return (
                <tr key={zeile.symbol} className="border-border border-b">
                  <th scope="row" className="py-2.5 pr-4 text-left font-medium">
                    <Link
                      href={`/maerkte/${zeile.symbol}`}
                      className="text-fg hover:text-markets"
                    >
                      {zeile.name}
                    </Link>
                  </th>
                  <td
                    className={`py-2.5 pr-4 text-right font-semibold tabular-nums ${
                      zeile.woche === null
                        ? 'text-fg-subtle'
                        : zeile.woche >= 0
                          ? 'text-success'
                          : 'text-danger'
                    }`}
                  >
                    {zeile.woche === null ? '–' : formatPercentSigned(zeile.woche)}
                  </td>
                  <td className="text-fg-muted py-2.5 pr-4">
                    {termin ? (
                      <>
                        {formatDate(termin.tag)}{' '}
                        <span className="text-fg-subtle">({termin.art})</span>
                      </>
                    ) : (
                      <span className="text-fg-subtle">keiner erwartet</span>
                    )}
                  </td>
                  <td className="text-fg-muted py-2.5">
                    {meldung ? (
                      <Link
                        href={`/news/${meldung.slug}`}
                        className="hover:text-markets underline underline-offset-4"
                      >
                        {meldung.titel}
                      </Link>
                    ) : (
                      <span className="text-fg-subtle">keine</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="text-fg-subtle mt-3 text-xs leading-relaxed">
        Basis jeder Wochenzahl ist der letzte Schluss vor dem Montag; Titel ohne
        ausreichende Kursreihe zeigen einen Strich statt einer geratenen Zahl. Der ganze
        Markt in derselben Rechnung:{' '}
        <Link href="/news/woche" className="hover:text-markets underline">
          Wochenrückblick
        </Link>
        .
      </p>
    </section>
  )
}
