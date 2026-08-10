import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatNumber } from '@/lib/format'
import { collectionPageSchema } from '@/lib/jsonld'
import { saisonalitaetVon } from '@/lib/reihenstatistik-daten'
import { MONATSNAMEN, halbjahresprobe, rang, saisonSatz } from '@/lib/saisonalitaet'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Gibt es gute und schlechte Börsenmonate?'),
  description:
    'Monatsrenditen von elf Leitwerten über fünf Jahre – und die Rechnung, die zeigt, wie viel davon reiner Zufall ist.',
  path: '/maerkte/saisonalitaet',
  ogTitle: 'Zwölf Mittelwerte aus fünf Jahren ergeben immer ein Muster',
})

/*
  Dieselben elf Werte wie auf `/maerkte/zusammenhang`, und das mit Absicht:
  Die beiden Seiten gehören zusammen. Der Abschnitt „Elf Belege sind einer"
  weiter unten beruht darauf, dass der Leser die Korrelationen dort nachsehen
  kann.
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
 * Die Einfärbung einer Monatszelle.
 *
 * Hier ist Grün und Rot ausnahmsweise richtig – anders als bei der Korrelation,
 * wo ein hoher Wert weder gut noch schlecht ist. Plus und Minus sind
 * gerichtet. Die Stufen sind trotzdem grob gehalten: Eine feine Abstufung
 * würde Unterschiede zeigen, die in den Daten nicht belegt sind.
 */
function zellenfarbe(prozent: number): string {
  if (prozent >= 3) return 'bg-emerald-500/20'
  if (prozent >= 1) return 'bg-emerald-500/10'
  if (prozent <= -3) return 'bg-rose-500/20'
  if (prozent <= -1) return 'bg-rose-500/10'
  return ''
}

export default function SaisonalitaetSeite() {
  const befunde = WERTE.map((symbol) => ({
    symbol,
    name: KURZ[symbol] ?? symbol,
    befund: saisonalitaetVon(symbol),
  })).filter((e) => e.befund !== null)

  const erster = befunde[0]?.befund

  /* Wie viele Werte über der Zufallserwartung liegen – die Kernzahl der Seite. */
  const ueberZufall = befunde.filter(
    (e) => e.befund!.spanne > e.befund!.spanneAusZufall
  ).length

  /*
    Die Werte, bei denen überhaupt etwas zu erklären ist: Spanne um mehr als die
    Hälfte über der Zufallserwartung. Nur für sie steht weiter unten ein Satz –
    elf fast gleichlautende Sätze wären eine Wand, und die Wand verstellte
    gerade den Befund, der die Seite trägt.
  */
  const auffaellige = befunde
    .filter((e) => e.befund!.spanne > e.befund!.spanneAusZufall * 1.5)
    /*
      Nach dem Verhältnis sortiert, nicht nach der rohen Spanne. Bitcoin
      schwankt in jedem Monat stark; dass seine Monate weit auseinanderliegen,
      ist deshalb weniger bemerkenswert als dieselbe Spanne bei einem ruhigen
      Wert. Erst das Verhältnis zur eigenen Zufallserwartung macht die Werte
      untereinander vergleichbar.
    */
    .sort(
      (a, b) =>
        b.befund!.spanne / b.befund!.spanneAusZufall -
        a.befund!.spanne / a.befund!.spanneAusZufall
    )

  /*
    Welcher Wert in ganzer Breite gezeigt wird: der auffälligste, sonst der
    erste. Gerade beim auffälligsten ist die Aufschlüsselung nach Einzeljahren
    das Entscheidende – sie zeigt, ob hinter dem Muster mehrere Jahre stehen
    oder ein einziges.
  */
  const detail = auffaellige[0] ?? befunde[0]

  /* „Sell in May" – für wie viele Werte stimmt die Richtung überhaupt? */
  const proben = befunde.map((e) => ({ ...e, probe: halbjahresprobe(e.befund!) }))
  const winterVorn = proben.filter((e) => e.probe.abstand > 0).length

  /* Der September: für wie viele Werte in der schwächeren Hälfte? */
  const septemberHinten = befunde.filter((e) => (rang(e.befund!, 9) ?? 0) >= 7).length

  /*
    Wie viele Jahre je Kalendermonat vorliegen. Nicht der erste Monat allein:
    Im Januar sind es fünf, im November vier, und „5 bis 5 Jahre" in der
    Kopfzeile wäre eine Zahl, die nichts sagt.
  */
  const jahreJeMonat = erster?.monate.map((m) => m.jahre) ?? []
  const wenigsteJahre = jahreJeMonat.length ? Math.min(...jahreJeMonat) : 0
  const meisteJahre = jahreJeMonat.length ? Math.max(...jahreJeMonat) : 0

  return (
    <>
      <JsonLd
        data={collectionPageSchema({
          name: 'Saisonalität der Leitwerte',
          description:
            'Monatsrenditen von elf Leitwerten über fünf Jahre, jeweils gegen die Spanne gestellt, die reiner Zufall erwarten lässt.',
          path: '/maerkte/saisonalitaet',
          items: WERTE.map((symbol) => ({
            name: KURZ[symbol] ?? symbol,
            path: `/maerkte/${symbol}`,
          })),
        })}
      />

      <PageHeader
        area="markets"
        eyebrow="Saisonalität"
        eyebrowIcon="chart"
        title="Gibt es gute und schlechte Börsenmonate?"
        lead="„Sell in May.“ „Der September ist der schwächste Monat.“ „Die Jahresendrallye.“ Solche Sätze lassen sich mit einer Tabelle belegen – auch dann, wenn nichts dahintersteckt. Diese Seite zeigt beides: die Tabelle und die Rechnung, die sie einordnet."
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Märkte', path: '/maerkte' }, { name: 'Saisonalität' }]}
          />
        }
        meta={
          erster && (
            <>
              <span>{erster.beobachtungen} Monate</span>
              <span aria-hidden="true">·</span>
              <span>
                {erster.von} bis {erster.bis}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                je Kalendermonat{' '}
                {wenigsteJahre === meisteJahre
                  ? `${meisteJahre}`
                  : `${wenigsteJahre} bis ${meisteJahre}`}{' '}
                Jahre
              </span>
            </>
          )
        }
      />

      <div className="fk-container py-12 sm:py-16">
        {/*
          Hier stand ein Warnkasten – fünf Beobachtungen je Monat, zwölf
          Durchschnitte liegen immer auseinander, das 3,26-fache der Unschärfe.

          Er ist weg, und der Inhalt geht dabei nicht verloren: Genau diese
          Erwartung steht als eigene Spalte in der Tabelle, direkt neben der
          beobachteten Spanne, und der Abschnitt „Die Probe: Muster oder
          Zufall?" gleich darunter sagt in zwei Sätzen, wie man beide liest.
          Wer die Zahlen nebeneinander sieht, versteht den Einwand; wer ihn
          vorher als Fließtext liest, hat ihn bis zur Tabelle vergessen.
        */}
        <section aria-labelledby="probe">
          <h2 id="probe" className="text-fg text-2xl font-bold">
            Die Probe: Muster oder Zufall?
          </h2>
          <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
            Links steht, wie weit stärkster und schwächster Monat auseinanderliegen.
            Rechts, wie weit sie <strong>ohne jede Saisonalität</strong> allein aus Zufall
            auseinanderlägen. Erst wenn links deutlich mehr steht als rechts, ist
            überhaupt etwas zu erklären.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[38rem] border-collapse text-sm">
              <caption className="sr-only">
                Beobachtete Monatsspanne und Zufallserwartung je Leitwert
              </caption>
              <thead>
                <tr className="text-fg-muted">
                  <th scope="col" className="border-border border-b p-2 text-left">
                    Wert
                  </th>
                  <th scope="col" className="border-border border-b p-2 text-left">
                    Stärkster Monat
                  </th>
                  <th scope="col" className="border-border border-b p-2 text-left">
                    Schwächster
                  </th>
                  <th scope="col" className="border-border border-b p-2 text-right">
                    Spanne
                  </th>
                  <th scope="col" className="border-border border-b p-2 text-right">
                    aus Zufall
                  </th>
                </tr>
              </thead>
              <tbody>
                {befunde.map(({ symbol, name, befund }) => {
                  const b = befund!
                  const auffaellig = b.spanne > b.spanneAusZufall * 1.5
                  return (
                    <tr key={symbol}>
                      <th
                        scope="row"
                        className="border-border text-fg border-b p-2 text-left font-medium whitespace-nowrap"
                      >
                        <Link href={`/maerkte/${symbol}`} className="hover:text-accent">
                          {name}
                        </Link>
                      </th>
                      <td className="border-border text-fg-muted border-b p-2">
                        {b.bester.name}{' '}
                        <span className="text-fg tabular-nums">
                          {b.bester.mittel >= 0 ? '+' : ''}
                          {formatNumber(b.bester.mittel, 1)} %
                        </span>
                      </td>
                      <td className="border-border text-fg-muted border-b p-2">
                        {b.schwaechster.name}{' '}
                        <span className="text-fg tabular-nums">
                          {b.schwaechster.mittel >= 0 ? '+' : ''}
                          {formatNumber(b.schwaechster.mittel, 1)} %
                        </span>
                      </td>
                      <td
                        className={`border-border border-b p-2 text-right tabular-nums ${
                          auffaellig ? 'text-fg font-bold' : 'text-fg'
                        }`}
                      >
                        {formatNumber(b.spanne, 1)}
                      </td>
                      <td className="border-border text-fg-muted border-b p-2 text-right tabular-nums">
                        {formatNumber(b.spanneAusZufall, 1)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <p className="text-fg-muted mt-4 max-w-2xl text-sm leading-relaxed">
            Beide Spalten in Prozentpunkten. Von {befunde.length} Werten liegen{' '}
            <strong>{ueberZufall}</strong> überhaupt über der Zufallserwartung, und nur{' '}
            <strong>{auffaellige.length}</strong> um mehr als die Hälfte darüber. Bei
            einem gerechten Münzwurf wären es etwa die Hälfte – das ist ungefähr das, was
            hier steht.
          </p>
        </section>

        <section aria-labelledby="monate" className="mt-12">
          <h2 id="monate" className="text-fg text-2xl font-bold">
            Alle Monate
          </h2>
          <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
            Die durchschnittliche Monatsrendite in Prozent. Die Farben helfen beim Lesen
            und sind grob gehalten: Eine feinere Abstufung würde Unterschiede zeigen, die
            der Bestand nicht hergibt.
          </p>

          {/*
            Eigener Rollbereich. Zwölf Spalten passen auf kein Telefon, und eine
            Tabelle, die die Seite waagerecht schiebt, macht die ganze Seite
            unbedienbar.
          */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[48rem] border-collapse text-sm">
              <caption className="sr-only">
                Durchschnittliche Monatsrendite je Leitwert und Kalendermonat
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="border-border border-b p-2 text-left">
                    <span className="sr-only">Wert</span>
                  </th>
                  {MONATSNAMEN.slice(1).map((name) => (
                    <th
                      key={name}
                      scope="col"
                      className="border-border text-fg-muted border-b p-2 text-center font-medium"
                    >
                      <abbr title={name} className="no-underline">
                        {name.slice(0, 3)}
                      </abbr>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {befunde.map(({ symbol, name, befund }) => (
                  <tr key={symbol}>
                    <th
                      scope="row"
                      className="border-border text-fg border-b p-2 text-left font-medium whitespace-nowrap"
                    >
                      <Link href={`/maerkte/${symbol}`} className="hover:text-accent">
                        {name}
                      </Link>
                    </th>
                    {befund!.monate.map((monat) => (
                      <td
                        key={monat.monat}
                        className={`border-border text-fg border-b p-2 text-center tabular-nums ${zellenfarbe(monat.mittel)}`}
                      >
                        {monat.mittel >= 0 ? '+' : ''}
                        {formatNumber(monat.mittel, 1)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="sprueche" className="mt-12">
          <h2 id="sprueche" className="text-fg text-2xl font-bold">
            Was die Sprüche wert sind
          </h2>

          <div className="mt-6 space-y-6">
            <div className="border-border bg-surface-muted rounded-xl border p-5">
              <h3 className="text-fg text-lg font-bold">„Sell in May and go away“</h3>
              <p className="text-fg-muted mt-2 leading-relaxed">
                Die Behauptung: Mai bis Oktober laufen schwächer als November bis April.
                Nachgerechnet stimmt die <strong>Richtung</strong> bei {winterVorn} von{' '}
                {proben.length} Werten – und bei den übrigen {proben.length - winterVorn}{' '}
                ist sie umgekehrt.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[24rem] border-collapse text-sm">
                  <caption className="sr-only">
                    Mittel des Sommer- und des Winterhalbjahrs je Leitwert
                  </caption>
                  <thead>
                    <tr className="text-fg-muted">
                      <th scope="col" className="border-border border-b p-2 text-left">
                        Wert
                      </th>
                      <th scope="col" className="border-border border-b p-2 text-right">
                        Mai–Okt
                      </th>
                      <th scope="col" className="border-border border-b p-2 text-right">
                        Nov–Apr
                      </th>
                      <th scope="col" className="border-border border-b p-2 text-right">
                        Abstand
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {proben.map(({ symbol, name, probe }) => (
                      <tr key={symbol}>
                        <th
                          scope="row"
                          className="border-border text-fg border-b p-2 text-left font-medium whitespace-nowrap"
                        >
                          {name}
                        </th>
                        <td className="border-border text-fg border-b p-2 text-right tabular-nums">
                          {probe.sommer >= 0 ? '+' : ''}
                          {formatNumber(probe.sommer, 1)}
                        </td>
                        <td className="border-border text-fg border-b p-2 text-right tabular-nums">
                          {probe.winter >= 0 ? '+' : ''}
                          {formatNumber(probe.winter, 1)}
                        </td>
                        <td className="border-border text-fg border-b p-2 text-right tabular-nums">
                          {probe.abstand >= 0 ? '+' : ''}
                          {formatNumber(probe.abstand, 1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-fg-muted mt-4 text-sm leading-relaxed">
                Alle Angaben in Prozent je Monat. Selbst dort, wo die Richtung stimmt,
                geht es um wenige Zehntel im Monatsmittel – gegen eine Unschärfe, die ein
                Vielfaches davon beträgt. Wer danach zweimal im Jahr umschichtet, zahlt
                Spesen und gegebenenfalls Steuer auf einen Unterschied, der in den Daten
                nicht sicher vorhanden ist.
              </p>
            </div>

            <div className="border-border bg-surface-muted rounded-xl border p-5">
              <h3 className="text-fg text-lg font-bold">
                „Der September ist der schwächste Monat“
              </h3>
              <p className="text-fg-muted mt-2 leading-relaxed">
                Das ist der Spruch, der sich hier am besten hält: Bei{' '}
                <strong>
                  {septemberHinten} von {befunde.length}
                </strong>{' '}
                Werten liegt der September in der schwächeren Tabellenhälfte. Es sieht
                nach dem stärksten Beleg der ganzen Seite aus – und ist in Wahrheit der
                schwächste.
              </p>
            </div>

            <div className="border-border bg-surface-muted rounded-xl border p-5">
              <h3 className="text-fg text-lg font-bold">Elf Belege sind ein Beleg</h3>
              <p className="text-fg-muted mt-2 leading-relaxed">
                Denn die elf Werte sind nicht elf unabhängige Zeugen. DAX und Euro Stoxx
                laufen fast im Gleichschritt, S&P 500 und Nasdaq erst recht; wie stark,
                steht auf der{' '}
                <Link
                  href="/maerkte/zusammenhang"
                  className="text-accent hover:underline"
                >
                  Seite zu Zusammenhang und Schwankung
                </Link>
                . Wenn ein September für alle schwach war, dann war es{' '}
                <strong>ein</strong> schwacher September, elfmal aufgeschrieben.
              </p>
              <p className="text-fg-muted mt-3 leading-relaxed">
                Das ist der häufigste Fehlschluss beim Lesen solcher Tabellen, und er ist
                unabhängig vom Thema: Elf Zeilen sehen aus wie elf Bestätigungen. Sie sind
                es nur, wenn die Zeilen voneinander unabhängig sind – und Aktienindizes
                sind das nie.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="einzeln" className="mt-12">
          <h2 id="einzeln" className="text-fg text-2xl font-bold">
            Was in einem Durchschnitt verschwindet
          </h2>
          <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
            Ein Monatsmittel ist eine Zahl aus vier bis fünf sehr verschiedenen Jahren.
            {detail && (
              <>
                {' '}
                Am {detail.name} in ganzer Breite
                {auffaellige.length > 0 && ' – dem Wert mit dem auffälligsten Muster'}:
                Neben dem Durchschnitt steht, in wie vielen Jahren der Monat im Plus
                schloss und wie weit tiefster und höchster Wert auseinanderlagen.
              </>
            )}
          </p>

          {detail && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-sm">
                <caption className="sr-only">
                  Monatsrenditen des {detail.name} mit Streuung und Unschärfe
                </caption>
                <thead>
                  <tr className="text-fg-muted">
                    <th scope="col" className="border-border border-b p-2 text-left">
                      Monat
                    </th>
                    <th scope="col" className="border-border border-b p-2 text-right">
                      Mittel
                    </th>
                    <th scope="col" className="border-border border-b p-2 text-right">
                      Median
                    </th>
                    <th scope="col" className="border-border border-b p-2 text-right">
                      im Plus
                    </th>
                    <th scope="col" className="border-border border-b p-2 text-right">
                      von … bis
                    </th>
                    <th scope="col" className="border-border border-b p-2 text-right">
                      Unschärfe
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {detail.befund!.monate.map((monat) => (
                    <tr key={monat.monat}>
                      <th
                        scope="row"
                        className="border-border text-fg border-b p-2 text-left font-medium"
                      >
                        {monat.name}
                      </th>
                      <td className="border-border text-fg border-b p-2 text-right tabular-nums">
                        {monat.mittel >= 0 ? '+' : ''}
                        {formatNumber(monat.mittel, 1)} %
                      </td>
                      <td className="border-border text-fg-muted border-b p-2 text-right tabular-nums">
                        {monat.median >= 0 ? '+' : ''}
                        {formatNumber(monat.median, 1)} %
                      </td>
                      <td className="border-border text-fg-muted border-b p-2 text-right tabular-nums">
                        {monat.imPlus} von {monat.jahre}
                      </td>
                      <td className="border-border text-fg-muted border-b p-2 text-right tabular-nums">
                        {formatNumber(monat.tiefster, 1)} bis{' '}
                        {monat.hoechster >= 0 ? '+' : ''}
                        {formatNumber(monat.hoechster, 1)}
                      </td>
                      <td className="border-border text-fg-muted border-b p-2 text-right tabular-nums">
                        ±
                        {monat.unschaerfe === null
                          ? '–'
                          : formatNumber(monat.unschaerfe, 1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-fg-muted mt-4 max-w-2xl text-sm leading-relaxed">
            Die letzte Spalte ist die wichtigste. Sie sagt, wie weit das Monatsmittel
            allein deshalb danebenliegen kann, weil es aus so wenigen Jahren stammt. Wo
            die Unschärfe größer ist als der Mittelwert selbst, hat die Zahl kein
            Vorzeichen, dem man trauen könnte.
          </p>
        </section>

        <section aria-labelledby="befunde" className="mt-12">
          <h2 id="befunde" className="text-fg text-2xl font-bold">
            Der Befund
          </h2>

          {auffaellige.length === 0 ? (
            <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
              Bei <strong>keinem</strong> der {befunde.length} Werte übersteigt die
              beobachtete Monatsspanne die Zufallserwartung deutlich. Das heißt nicht,
              dass es keine Saisonalität gibt – es heißt, dass fünf Jahre nicht
              ausreichen, um eine zu erkennen. Die Tabelle oben ist damit vollständig
              erklärt, ohne dass ein einziger Monat etwas Besonderes an sich hätte.
            </p>
          ) : (
            <>
              <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
                Von {befunde.length} Werten liegt bei{' '}
                <strong>
                  {auffaellige.length === 1
                    ? 'einem einzigen'
                    : `${auffaellige.length} Werten`}
                </strong>{' '}
                die Monatsspanne deutlich über dem, was Zufall erwarten lässt. Für alle
                übrigen ist die Tabelle oben vollständig erklärt, ohne dass ein einziger
                Monat etwas Besonderes an sich hätte.
              </p>
              <ul className="mt-4 space-y-3">
                {auffaellige.map(({ symbol, name, befund }) => (
                  <li
                    key={symbol}
                    className="border-border bg-surface-muted rounded-xl border p-4"
                  >
                    <p className="text-fg font-medium">{name}</p>
                    <p className="text-fg-muted mt-1 text-sm leading-relaxed">
                      {saisonSatz(befund!)}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="text-fg-muted mt-4 max-w-2xl text-sm leading-relaxed">
                Auch hier gilt die Einschränkung von oben, und sie wiegt schwerer als der
                Befund: Ein Monatsmittel aus vier bis fünf Jahren kann von einem einzigen
                außergewöhnlichen Jahr getragen sein. Die Spalte „von … bis“ in der
                Tabelle davor zeigt, wie weit die Einzeljahre auseinanderlagen – wer den
                Befund prüfen will, sieht dort zuerst nach.
              </p>
            </>
          )}
        </section>

        {/*
          Und hier stand „Was diese Seite nicht sagt" – nichts über das kommende
          Jahr, nichts über Ursachen, nichts über das Fenster hinaus.

          Auch weg. Die drei Einwände stehen ohnehin im Text darüber, dort wo
          sie zu einer Zahl gehören: Der Abschnitt über die Einzeljahre sagt,
          dass ein Monatsmittel von einem einzigen Jahr getragen sein kann, die
          Probe sagt, wann eine Spanne über Zufall hinausgeht, und dass eine
          Kursreihe keine Ursachen kennt, ist die Grundregel dieses Projekts und
          steht an jeder Stelle, an der sie greift.

          Als Kasten am Seitenende war es eine Zusammenfassung von Vorbehalten
          für jemanden, der bis dahin schon alles gelesen hat.
        */}
      </div>
    </>
  )
}
