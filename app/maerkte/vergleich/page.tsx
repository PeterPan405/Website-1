import type { Metadata } from 'next'
import Link from 'next/link'

import { Vergleichstafel } from '@/components/markets/Vergleichstafel'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { getDividendenbefund } from '@/lib/dividendentermine'
import { getBilanzwaehrung } from '@/lib/fundamentaldaten'
import {
  getFundamentalkennzahlen,
  getKennzahlen,
  getQuotes,
  type MarketQuote,
} from '@/lib/markets'
import { buildMetadata, withBrand } from '@/lib/seo'
import { inHauptwaehrung } from '@/lib/waehrungseinheit'
import type { Vergleichsposten } from '@/lib/vergleich'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Zwei Werte vergleichen'),
  description:
    'Zwei Werte nebeneinander – Aktien, Indizes, ETFs, Rohstoffe, Devisen, Krypto: Entwicklung, Schwankung und Bewertung, samt Angabe, was der Vergleich hergibt.',
  path: '/maerkte/vergleich',
  ogTitle: 'Welche der beiden – und was der Vergleich überhaupt hergibt',
})

/**
 * Die beiden Titel, die beim Aufruf schon dastehen.
 *
 * Eine leere Seite mit zwei Auswahlfeldern erklärt sich niemandem. Zwei
 * bekannte Namen **aus derselben Branche** zeigen die Tabelle in ihrem
 * vollständigen Fall: Nur dort tragen auch die Bewertungszeilen eine
 * Markierung.
 *
 * Hier standen zuerst Apple und Microsoft – der naheliegende Griff, und der
 * falsche: Die beiden stehen unter „Elektronik“ und „Software“, womit
 * ausgerechnet in der Voreinstellung drei der Zeilen leer blieben.
 */
const ANFANG_LINKS = 'nvidia'
const ANFANG_RECHTS = 'amd'

/**
 * Ein Datensatz je Aktie, aus dem der Browser zwei beliebige heraussucht.
 *
 * Die Felder sind knapp gehalten: Jedes von ihnen liegt tausendfach im
 * Seitenpaket. Ausgeschrieben werden nur Zahlen, keine Kursreihen – die
 * Wertentwicklung ist hier schon zu drei Zahlen verdichtet.
 */
/**
 * Alle Instrumente, nicht nur Aktien.
 *
 * Bis August 2026 stand hier `filter(kind === 'stock')`, und die Seite hieß
 * „Zwei Aktien vergleichen“. Die Einschränkung hatte keinen Grund in der
 * Sache: Wer wissen will, ob Gold in fünf Jahren mehr gebracht hat als der
 * DAX, stellt genau diese Frage – und die Zeilen, die dabei sinnlos wären,
 * lässt `ohneLeere()` in `lib/vergleich.ts` inzwischen weg.
 *
 * Es kommen rund fünfzig Einträge dazu: 22 Indizes, neun ETFs, acht Rohstoffe,
 * fünf Währungspaare, drei Kryptowährungen. Neben den 1.029 Aktien fällt das
 * im Seitenpaket nicht auf.
 */
async function baueDaten(): Promise<Vergleichsposten[]> {
  const quotes = await getQuotes()
  return Promise.all(quotes.map((quote) => baueEinen(quote)))
}

/**
 * Rundet auf die Stellen, die die Tabelle auch zeigt.
 *
 * Aus `10.234567890123456` wird `10.23`. Für die Anzeige ändert das nichts –
 * dort stehen ohnehin zwei Stellen. Für das Seitenpaket ändert es viel: Jede
 * Zahl liegt tausendfach darin, und ungerundet trägt jede zwölf Stellen mit
 * sich, die niemand sieht. Der erste Bau dieser Seite wog 772 Kilobyte.
 */
function rund(zahl: number | null | undefined, stellen = 2): number | null {
  if (zahl === null || zahl === undefined || !Number.isFinite(zahl)) return null
  const faktor = 10 ** stellen
  return Math.round(zahl * faktor) / faktor
}

async function baueEinen(quote: MarketQuote): Promise<Vergleichsposten> {
  const [kennzahlen, fundamental] = await Promise.all([
    getKennzahlen(quote.symbol),
    getFundamentalkennzahlen(quote.symbol),
  ])

  const performance: Vergleichsposten['performance'] = {}
  for (const eintrag of kennzahlen?.performance ?? []) {
    if (
      eintrag.zeitraum === '1J' ||
      eintrag.zeitraum === '3J' ||
      eintrag.zeitraum === '5J'
    ) {
      performance[eintrag.zeitraum] = rund(eintrag.prozent) ?? 0
    }
  }

  const zahlen = fundamental?.art === 'zahlen' ? fundamental.kennzahlen : null

  /*
    Der Kurs in seiner Hauptwährung, nicht in der Notierungseinheit. 525,70 GBp
    sind 5,26 GBP – wer den Rohwert nebeneinanderstellt, vergleicht Pence mit
    Euro. Für den Vergleich zweier Kurse spielt das ohnehin keine Rolle, weil
    diese Zeile nie markiert wird; für die Währungsangabe daneben schon.
  */
  const kurs = inHauptwaehrung(quote.value, quote.unit)

  return {
    symbol: quote.symbol,
    ticker: quote.ticker,
    name: quote.name,
    art: quote.kind,
    waehrung: kurs.waehrung,
    branche: quote.branche ?? null,
    sitzland: quote.sitzland ?? null,
    kurs: rund(kurs.wert) ?? 0,
    veraenderung: rund(quote.changePercent) ?? 0,
    rendite: rund(getDividendenbefund(quote.symbol)?.renditeProzent),
    performance,
    schwankung: rund(kennzahlen?.schwankung),
    maxRueckgang: rund(kennzahlen?.maxRueckgang),
    bilanzwaehrung: zahlen ? getBilanzwaehrung(quote.ticker) : null,
    // Der Börsenwert wird in Millionen angezeigt – Nachkommastellen wären hier Zierrat.
    marktkapitalisierung: rund(zahlen?.marktkapitalisierung.wert, 0),
    kgv: rund(zahlen?.kgv.wert),
    kuv: rund(zahlen?.kuv.wert),
    kbv: rund(zahlen?.kbv.wert),
  }
}

export default async function VergleichSeite() {
  const posten = (await baueDaten()).sort((a, b) => a.name.localeCompare(b.name, 'de'))

  const anfangLinks = posten.some((eintrag) => eintrag.symbol === ANFANG_LINKS)
    ? ANFANG_LINKS
    : (posten[0]?.symbol ?? '')
  const anfangRechts = posten.some((eintrag) => eintrag.symbol === ANFANG_RECHTS)
    ? ANFANG_RECHTS
    : (posten[1]?.symbol ?? '')

  return (
    <>
      <PageHeader
        area="markets"
        eyebrow="Vergleich"
        eyebrowIcon="scale"
        title="Welche der beiden?"
        lead="Zwei Werte nebeneinander – Aktien, Indizes, ETFs, Rohstoffe, Devisen oder Krypto – und dazu die Angabe, welche Gegenüberstellung überhaupt etwas bedeutet. Denn die meisten Zahlen, die man nebeneinanderlegen kann, vergleichen sich nicht."
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Märkte', path: '/maerkte' }, { name: 'Vergleich' }]}
          />
        }
        meta={
          <>
            <span>{posten.length} Werte zur Auswahl</span>
            <span aria-hidden="true">·</span>
            <span>Kein Sieger ohne Grund</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <Vergleichstafel
          posten={posten}
          anfangLinks={anfangLinks}
          anfangRechts={anfangRechts}
        />

        <Callout
          variant="warning"
          title="Was diese Tabelle nicht beantwortet"
          className="mt-12"
        >
          <p>
            Welche der beiden man kaufen sollte. Diese Seite stellt gegenüber, was sich
            messen lässt – und die messbaren Größen sind die Vergangenheit. Ob ein
            Unternehmen in fünf Jahren noch verdient, womit es heute verdient, steht in
            keiner dieser Zeilen.
          </p>
          <p>
            Und selbst dort, wo eine Markierung steht, heißt sie nur: In dieser einen
            Kennzahl liegt dieser Titel vorn. Ein Unternehmen ist keine Summe seiner
            Kennzahlen.
          </p>
        </Callout>

        <section aria-labelledby="regeln" className="mt-12">
          <h2 id="regeln" className="text-fg text-2xl font-bold">
            Wann hier niemand vorn liegt
          </h2>
          <div className="text-fg-muted mt-3 max-w-2xl space-y-4 leading-relaxed">
            <p>
              <strong>Wenn die Zahl keine Richtung hat.</strong> Ein Aktienkurs von 320
              gegen einen von 41 sagt nichts: Er hängt daran, in wie viele Stücke ein
              Unternehmen zerlegt wurde. Dasselbe gilt für den Börsenwert – groß ist weder
              ein Vorzug noch ein Mangel.
            </p>
            <p>
              <strong>Wenn der Abstand zu klein ist.</strong> Zwei Titel, die über fünf
              Jahre 61 und 62 Prozent zugelegt haben, haben dasselbe getan. Ein Haken
              hinter einer der beiden Zahlen behauptete einen Unterschied, den es nicht
              gibt.
            </p>
            <p>
              <strong>Wenn die Branchen auseinandergehen.</strong> Ein Versorger wird mit
              dem Zwölffachen seines Gewinns bewertet, ein Softwarehaus mit dem
              Achtunddreißigfachen – und beides ist begründet. Über Branchengrenzen hinweg
              bleiben Kurs-Gewinn-, Kurs-Umsatz- und Kurs-Buchwert-Verhältnis deshalb ohne
              Markierung. Welche Titel dasselbe Geschäft betreiben, steht bei den{' '}
              <Link
                href="/maerkte/branchen"
                className="text-markets font-medium underline underline-offset-2"
              >
                Branchen
              </Link>
              .
            </p>
            <p>
              <strong>Wenn einer der beiden die Angabe nicht hat.</strong> Ein leeres Feld
              heißt „nicht erfasst“ und nicht „null“. Wie viele der Aktien welche Angabe
              tragen, steht in der Abdeckung im Projektverzeichnis – bei den
              Unternehmenszahlen ist es rund die Hälfte.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
