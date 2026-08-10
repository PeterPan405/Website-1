import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { marketDefinitions } from '@/data/markets'
import { formatNumber } from '@/lib/format'
import { collectionPageSchema } from '@/lib/jsonld'
import { matrixVon, schwankungVon } from '@/lib/reihenstatistik-daten'
import { MINDESTWOCHEN, zusammenhangSatz } from '@/lib/reihenstatistik'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Was läuft mit was: Zusammenhang und Schwankung'),
  description:
    'Wie stark elf Leitwerte gemeinsam schwankten und wie weit ihre Wochen auseinanderlagen – über fünf Jahre aus den eigenen Kursreihen gerechnet.',
  path: '/maerkte/zusammenhang',
  ogTitle: 'Streuung wirkt nur, wo die Korrelation unter eins liegt',
})

/*
  Welche Werte in der Matrix stehen.

  Nicht `LEITWERTE` aus `lib/leitwerte.ts`, obwohl die Liste fast dieselbe ist:
  Dort steht, was *häufig abgerufen* wird, hier, was *sinnvoll vergleichbar*
  ist. `msci-world` fehlt deshalb – für den Index liegt keine eigene Kursreihe
  vor, nur die Zusammensetzung, und eine Zeile aus lauter Strichen erklärt
  nichts.
*/
const WERTE = [
  'dax',
  'euro-stoxx-50',
  'sp500',
  'nasdaq-100',
  'nikkei-225',
  'gold',
  'silber',
  'brent',
  'bitcoin',
  'ethereum',
  'eur-usd',
] as const

/** Kurze Beschriftung für die Matrix – die vollen Namen sprengen jede Spalte. */
const KURZ: Record<string, string> = {
  dax: 'DAX',
  'euro-stoxx-50': 'Euro Stoxx',
  sp500: 'S&P 500',
  'nasdaq-100': 'Nasdaq 100',
  'nikkei-225': 'Nikkei',
  gold: 'Gold',
  silber: 'Silber',
  brent: 'Brent',
  bitcoin: 'Bitcoin',
  ethereum: 'Ethereum',
  'eur-usd': 'Euro/Dollar',
}

/**
 * Die Farbe einer Zelle.
 *
 * Bewusst eine Helligkeitsstufe und kein Rot-Grün: Ein hoher Gleichlauf ist
 * weder gut noch schlecht, sondern hoch. Rot und Grün würden hier eine
 * Wertung behaupten, die es nicht gibt – und wären für rund acht Prozent der
 * Männer ohnehin nicht unterscheidbar.
 */
function zellenfarbe(wert: number): string {
  const betrag = Math.abs(wert)
  if (betrag >= 0.8) return 'bg-accent/30'
  if (betrag >= 0.5) return 'bg-accent/18'
  if (betrag >= 0.2) return 'bg-accent/8'
  return ''
}

export default function ZusammenhangSeite() {
  const matrix = matrixVon(WERTE)
  const schwankungen = WERTE.map((symbol) => ({
    symbol,
    name:
      marketDefinitions.find((m) => m.symbol === symbol)?.name ?? KURZ[symbol] ?? symbol,
    wert: schwankungVon(symbol),
  })).sort((a, b) => (b.wert?.jahresProzent ?? -1) - (a.wert?.jahresProzent ?? -1))

  const zeitraum = schwankungen.find((s) => s.wert)?.wert

  /*
    Das Paar mit dem höchsten und das mit dem niedrigsten Gleichlauf. Sie
    stehen oben als Beispiel, weil eine Matrix aus 55 Zahlen ohne Einstieg
    niemanden erreicht.
  */
  let hoechstes: { a: string; b: string; wert: number } | null = null
  let niedrigstes: { a: string; b: string; wert: number } | null = null
  for (let i = 0; i < WERTE.length; i += 1) {
    for (let j = i + 1; j < WERTE.length; j += 1) {
      const zelle = matrix[i]![j]
      if (!zelle) continue
      const eintrag = { a: KURZ[WERTE[i]!]!, b: KURZ[WERTE[j]!]!, wert: zelle.wert }
      if (!hoechstes || zelle.wert > hoechstes.wert) hoechstes = eintrag
      if (!niedrigstes || zelle.wert < niedrigstes.wert) niedrigstes = eintrag
    }
  }

  return (
    <>
      <JsonLd
        data={collectionPageSchema({
          name: 'Zusammenhang und Schwankung',
          description:
            'Korrelation und Schwankungsbreite von elf Leitwerten, aus den eigenen Kursreihen gerechnet.',
          path: '/maerkte/zusammenhang',
          items: WERTE.map((symbol) => ({
            name: KURZ[symbol] ?? symbol,
            path: `/maerkte/${symbol}`,
          })),
        })}
      />

      <PageHeader
        area="markets"
        eyebrow="Zusammenhang"
        eyebrowIcon="chart"
        title="Was läuft mit was – und wie weit"
        lead="„Breit gestreut“ ist eine Behauptung, und sie lässt sich nachrechnen. Zwei Werte, die immer gemeinsam steigen und fallen, sind zusammen kaum ruhiger als jeder für sich. Diese Seite zeigt für elf Leitwerte, wie stark sie tatsächlich gemeinsam schwankten."
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Märkte', path: '/maerkte' }, { name: 'Zusammenhang' }]}
          />
        }
        meta={
          zeitraum && (
            <>
              <span>{zeitraum.wochen} Wochen</span>
              <span aria-hidden="true">·</span>
              <span>
                {zeitraum.von.slice(0, 4)} bis {zeitraum.bis.slice(0, 4)}
              </span>
              <span aria-hidden="true">·</span>
              <span>Wochenschlüsse, nicht Tage</span>
            </>
          )
        }
      />

      <div className="fk-container py-12 sm:py-16">
        {/*
          Hier stand ein Kasten über das Wochenraster – warum aus fünf Jahren
          Kursreihe keine Tagesschwankung zu rechnen ist und was Tokio damit zu
          tun hat.

          Er ist weg. Was er begründete, steht in drei Wörtern in der Kopfzeile
          darüber: „Wochenschlüsse, nicht Tage". Wer die Zahl liest, weiß damit,
          worauf sie beruht; wer wissen will, warum, findet es in der
          Methodenbeschreibung. Zwölf Zeilen Vorrede über einer Auswertung sind
          eine Hürde, keine Hilfe.
        */}
        {hoechstes && niedrigstes && (
          <section aria-labelledby="einstieg">
            <h2 id="einstieg" className="text-fg text-2xl font-bold">
              Die beiden Enden
            </h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div className="border-border bg-surface-muted rounded-xl border p-5">
                <p className="text-fg-muted text-sm">Am stärksten im Gleichschritt</p>
                <p className="text-fg mt-1 text-lg font-bold">
                  {hoechstes.a} und {hoechstes.b}
                </p>
                <p className="text-accent mt-1 text-3xl font-bold tabular-nums">
                  {formatNumber(hoechstes.wert, 2)}
                </p>
                <p className="text-fg-muted mt-1 text-sm">
                  {zusammenhangSatz(hoechstes.wert)}
                </p>
                <p className="text-fg-muted mt-2 text-sm leading-relaxed">
                  Wer beide hält, hält in der Sache fast einen Wert doppelt. Das ist keine
                  Streuung, sondern zwei Namen für dieselbe Bewegung.
                </p>
              </div>
              <div className="border-border bg-surface-muted rounded-xl border p-5">
                <p className="text-fg-muted text-sm">Am wenigsten miteinander</p>
                <p className="text-fg mt-1 text-lg font-bold">
                  {niedrigstes.a} und {niedrigstes.b}
                </p>
                <p className="text-accent mt-1 text-3xl font-bold tabular-nums">
                  {formatNumber(niedrigstes.wert, 2)}
                </p>
                <p className="text-fg-muted mt-1 text-sm">
                  {zusammenhangSatz(niedrigstes.wert)}
                </p>
                <p className="text-fg-muted mt-2 text-sm leading-relaxed">
                  Hier trägt Streuung tatsächlich: Die Wochen des einen sagen wenig über
                  die Wochen des anderen. Ob das so bleibt, sagt die Zahl nicht.
                </p>
              </div>
            </div>
          </section>
        )}

        <section aria-labelledby="matrix" className="mt-12">
          <h2 id="matrix" className="text-fg text-2xl font-bold">
            Alle Paare
          </h2>
          <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
            Ein Wert von 1 hieße: Die beiden liefen jede Woche im selben Verhältnis. Ein
            Wert von 0 hieße: Aus der Woche des einen folgt nichts über die des anderen.
            Ein negativer Wert heißt gegenläufig. Die Diagonale bleibt leer – dass ein
            Wert mit sich selbst gleichläuft, ist keine Erkenntnis.
          </p>

          {/*
            Eigener Rollbereich. Elf Spalten passen auf kein Telefon, und eine
            Tabelle, die die Seite waagerecht schiebt, macht die ganze Seite
            unbedienbar.
          */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[46rem] border-collapse text-sm">
              <caption className="sr-only">
                Korrelation der Wochenrenditen zwischen je zwei Leitwerten
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="border-border border-b p-2 text-left">
                    <span className="sr-only">Wert</span>
                  </th>
                  {WERTE.map((symbol) => (
                    <th
                      key={symbol}
                      scope="col"
                      className="border-border text-fg-muted border-b p-2 text-center font-medium"
                    >
                      {KURZ[symbol]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WERTE.map((zeile, i) => (
                  <tr key={zeile}>
                    <th
                      scope="row"
                      className="border-border text-fg border-b p-2 text-left font-medium whitespace-nowrap"
                    >
                      <Link href={`/maerkte/${zeile}`} className="hover:text-accent">
                        {KURZ[zeile]}
                      </Link>
                    </th>
                    {WERTE.map((spalte, j) => {
                      const zelle = matrix[i]![j]
                      return (
                        <td
                          key={spalte}
                          className={`border-border border-b p-2 text-center tabular-nums ${
                            i === j
                              ? 'bg-surface-muted'
                              : zelle
                                ? zellenfarbe(zelle.wert)
                                : ''
                          }`}
                        >
                          {i === j ? (
                            <span aria-hidden="true" className="text-fg-subtle">
                              ·
                            </span>
                          ) : zelle ? (
                            formatNumber(zelle.wert, 2)
                          ) : (
                            <span
                              className="text-fg-subtle"
                              title="zu wenige gemeinsame Wochen"
                            >
                              –
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="schwankung" className="mt-12">
          <h2 id="schwankung" className="text-fg text-2xl font-bold">
            Wie weit die Wochen auseinanderlagen
          </h2>
          <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
            Die Standardabweichung der Wochenrenditen, aufs Jahr gerechnet. Grob gesagt:
            In etwa zwei von drei Jahren lag die Jahresrendite um höchstens diesen Betrag
            neben ihrem Durchschnitt.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-sm">
              <caption className="sr-only">Jahresschwankung je Leitwert</caption>
              <thead>
                <tr className="border-border border-b">
                  <th scope="col" className="p-2 text-left font-medium">
                    Wert
                  </th>
                  <th scope="col" className="p-2 text-right font-medium">
                    Schwankung im Jahr
                  </th>
                  <th scope="col" className="p-2 text-right font-medium">
                    je Woche
                  </th>
                  <th scope="col" className="p-2 text-right font-medium">
                    Wochen
                  </th>
                </tr>
              </thead>
              <tbody>
                {schwankungen.map((eintrag) => (
                  <tr key={eintrag.symbol} className="border-border border-b">
                    <th scope="row" className="text-fg p-2 text-left font-medium">
                      <Link
                        href={`/maerkte/${eintrag.symbol}`}
                        className="hover:text-accent"
                      >
                        {eintrag.name}
                      </Link>
                    </th>
                    <td className="text-fg p-2 text-right font-bold tabular-nums">
                      {eintrag.wert
                        ? `${formatNumber(eintrag.wert.jahresProzent, 1)} %`
                        : '–'}
                    </td>
                    <td className="text-fg-muted p-2 text-right tabular-nums">
                      {eintrag.wert
                        ? `${formatNumber(eintrag.wert.wochenProzent, 1)} %`
                        : '–'}
                    </td>
                    <td className="text-fg-muted p-2 text-right tabular-nums">
                      {eintrag.wert?.wochen ?? '–'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <Callout variant="warning" title="Was diese Seite nicht sagt" className="mt-12">
          <p>
            <strong>Schwankung ist nicht Risiko.</strong> Sie misst, wie weit die Wochen
            auseinanderlagen – nach oben wie nach unten. Ein Wert, der nur steigt, aber in
            großen Sprüngen, bekommt hier eine hohe Zahl. Das eigentliche Risiko, sein
            Geld dauerhaft zu verlieren, steht in keiner dieser Spalten.
          </p>
          <p>
            <strong>Gleichlauf ist keine Ursache.</strong> Dass zwei Werte gemeinsam
            steigen, sagt nicht, dass einer den anderen bewegt. Meist bewegt beide
            dasselbe Dritte.
          </p>
          <p>
            <strong>Und die Zahl gilt für die Vergangenheit.</strong> Der bekannteste
            Einwand gegen Streuung ist, dass Korrelationen im Crash steigen: Wenn alle
            gleichzeitig verkaufen, fällt gleichzeitig fast alles. Genau dann, wenn
            Streuung helfen soll, hilft sie am wenigsten. Fünf Jahre ohne einen
            ausgewachsenen Crash können das nicht zeigen.
          </p>
          <p>
            Die Rechnung im Einzelnen steht in{' '}
            <code className="text-fg-muted text-sm">lib/reihenstatistik.ts</code>; ab{' '}
            {MINDESTWOCHEN} gemeinsamen Wochen entsteht eine Zahl, darunter ein Strich.
          </p>
        </Callout>
      </div>
    </>
  )
}
