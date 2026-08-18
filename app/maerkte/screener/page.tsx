import type { Metadata } from 'next'
import Link from 'next/link'

import { Screenertafel } from '@/components/markets/Screenertafel'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { laendernamen } from '@/data/laender/namen'
import { marketDefinitions } from '@/data/markets'
import { rechneUm } from '@/lib/devisen'
import { formatDateTime, formatNumber, formatPercent } from '@/lib/format'
import { abstandZumHoch } from '@/lib/jahresspanne'
import { collectionPageSchema } from '@/lib/jsonld'
import { getDevisenkurse } from '@/lib/market-live'
import {
  fundamentalQuelle,
  fundamentalStand,
  getFundamentalkennzahlen,
  getQuotes,
} from '@/lib/markets'
import { baueZeile, grundgesamtheit, type Screenerzeile } from '@/lib/screener'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  // 149 Zeichen. Die Grenze liegt bei 160 (`scripts/paket-pruefen.ts`), und
  // sie zählt die zusammengesetzte Beschreibung – die erste Fassung kam auf
  // 161 und brach den Bau, nicht nur die Vorschau.
  title: withBrand('Aktien nach Kennzahlen filtern'),
  description:
    'Filtern nach KGV, Kurs-Buchwert, Börsenwert, Branche und Land – und zu jeder Abfrage steht dabei, wie viele Titel die Kennzahl überhaupt haben.',
  path: '/maerkte/screener',
  ogTitle: 'Aktien nach Kennzahlen filtern',
})

/**
 * Der Screener über den eigenen Bestand.
 *
 * ## Warum die Datenlage neben dem Ergebnis steht und nicht darunter
 *
 * Weil sie das Ergebnis ist. Bilanzzahlen liegen für amerikanische Titel
 * vollständig vor, für deutsche fast gar nicht – wer „die günstigsten Aktien
 * der Welt“ abfragt, bekommt eine amerikanische Liste, und ohne die Zahl
 * daneben sieht sie aus wie eine Aussage über den Markt.
 *
 * Dieselbe Falle hat auf `/maerkte/waehrungen-im-weltindex` schon einmal
 * zugeschnappt: 86,4 % Dollar, gerechnet aus einem Bestand, dessen Lücke
 * außerhalb der USA lag. Dort war es eine Zahl, hier wäre es jede Abfrage.
 *
 * ## Warum die Zeilen auf dem Server entstehen
 *
 * Filtern und Sortieren laufen im Browser, die Zeilen stehen vollständig im
 * HTML. Damit bleibt die Seite ohne JavaScript lesbar, und die Kennzahlen
 * stammen aus demselben Bau wie überall sonst – kein zweiter Rechenweg, der
 * irgendwann andere Zahlen liefert als die Detailseite.
 */
export default async function ScreenerSeite() {
  const quotes = await getQuotes()
  const devisen = getDevisenkurse()

  /*
    Umrechnen in Euro, damit Börsenwerte vergleichbar sind.

    Ohne Kurstabelle bleibt jeder Börsenwert leer. Das ist die richtige
    Antwort: Eine Liste, in der Yen-Beträge neben Dollar-Beträgen nach Größe
    sortiert stehen, ist schlimmer als eine Liste ohne diese Spalte.
  */
  const umrechnen = (betrag: number, von: string): number | null =>
    devisen ? rechneUm(betrag, von, 'EUR', devisen.jeEuro) : null

  const aktien = marketDefinitions.filter((eintrag) => eintrag.kind === 'stock')

  const zeilen: Screenerzeile[] = await Promise.all(
    aktien.map(async (eintrag) => {
      const quote = quotes.find((q) => q.symbol === eintrag.symbol)
      const abstand =
        quote && quote.high52w
          ? abstandZumHoch({ value: quote.value, high52w: quote.high52w })
          : null

      return baueZeile(
        {
          symbol: eintrag.symbol,
          name: eintrag.name,
          ticker: eintrag.ticker,
          branche: eintrag.branche ?? null,
          land: eintrag.sitzland
            ? (laendernamen[eintrag.sitzland] ?? eintrag.sitzland)
            : null,
        },
        await getFundamentalkennzahlen(eintrag.symbol),
        abstand,
        umrechnen
      )
    })
  )

  const branchen = [
    ...new Set(zeilen.map((z) => z.branche).filter((b): b is string => b !== null)),
  ].sort((a, b) => a.localeCompare(b, 'de'))
  const laender = [
    ...new Set(zeilen.map((z) => z.land).filter((l): l is string => l !== null)),
  ].sort((a, b) => a.localeCompare(b, 'de'))

  const basisKgv = grundgesamtheit(zeilen, 'kgv')
  const mitAbstand = zeilen.filter((z) => z.abstandHoch !== null).length

  /*
    Die drei Länder mit den meisten geführten Titeln – als Beleg dafür, dass
    die Lücke keine gleichmäßige Ausdünnung ist. Gerechnet und nicht
    aufgeschrieben: Eine abgetippte Quote ist nach dem nächsten Datenabruf
    falsch, ohne dass es jemandem auffiele.
  */
  const groessteLaender = basisKgv.nachLand.slice(0, 3)

  return (
    <>
      <PageHeader
        area="markets"
        eyebrow="Märkte"
        eyebrowIcon="chart"
        title="Aktien nach Kennzahlen filtern"
        lead="Ein Filter über die Zahlen, die hier ohnehin stehen – und zu jeder Abfrage die Auskunft, wie viele Titel die gefragte Kennzahl überhaupt haben."
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Märkte', path: '/maerkte' }, { name: 'Screener' }]}
          />
        }
        meta={
          <>
            <span>{formatNumber(zeilen.length)} Aktien</span>
            <span aria-hidden="true">·</span>
            <span>{formatNumber(basisKgv.belegt)} mit Bilanzzahlen</span>
            <span aria-hidden="true">·</span>
            <span>Stand {formatDateTime(fundamentalStand)}</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <StatGrid columns={3}>
          <Stat
            label="Aktien im Bestand"
            value={formatNumber(zeilen.length)}
            hint="Alle hier geführten Einzelaktien – unabhängig davon, ob Bilanzzahlen vorliegen."
          />
          <Stat
            label="Mit Bilanzkennzahlen"
            value={formatPercent((basisKgv.belegt / Math.max(zeilen.length, 1)) * 100, 0)}
            tone="negative"
            hint={`${formatNumber(basisKgv.belegt)} von ${formatNumber(zeilen.length)}. Der Rest hat Kurs und Chart, aber kein KGV.`}
          />
          <Stat
            label="Mit Abstand zum Hoch"
            value={formatPercent((mitAbstand / Math.max(zeilen.length, 1)) * 100, 0)}
            hint="Diese Zahl kommt aus dem Kursverlauf – sie hängt nicht an den Bilanzquellen."
          />
        </StatGrid>

        <Callout variant="warning" title="Warum jede Abfrage hier amerikanisch ausfällt">
          <p>
            Die Bilanzzahlen kommen aus Pflichtmeldungen, und die sind nicht überall
            gleich gut zugänglich. Von den {formatNumber(zeilen.length)} geführten Aktien
            haben <strong className="text-fg">{formatNumber(basisKgv.belegt)}</strong> ein
            Kurs-Gewinn-Verhältnis – und die Lücke ist keine gleichmäßige Ausdünnung:
          </p>
          <ul className="mt-3 space-y-1">
            {groessteLaender.map((land) => (
              <li key={land.land}>
                <strong className="text-fg">{land.land}</strong>:{' '}
                {formatNumber(land.belegt)} von {formatNumber(land.gesamt)} ={' '}
                {formatPercent((land.belegt / Math.max(land.gesamt, 1)) * 100, 0)}
              </li>
            ))}
          </ul>
          <p className="mt-3">
            Eine Abfrage „die zehn günstigsten Aktien“ über diesen Bestand liefert deshalb
            eine fast rein amerikanische Liste – und sie sieht aus wie eine Aussage über
            den Markt, obwohl sie eine über unsere Quellen ist. Unter jedem Ergebnis steht
            darum, auf wie viele Titel es sich stützt. Warum die Zahlen zu welchem Land
            fehlen, steht bei den{' '}
            <Link
              href="/quellen"
              className="hover:text-markets underline underline-offset-2"
            >
              Quellen
            </Link>
            .
          </p>
        </Callout>

        <Screenertafel
          zeilen={zeilen}
          branchen={branchen}
          laender={laender}
          className="mt-10"
        />

        <Callout variant="info" title="Was ein Filter nicht leistet">
          <p>
            Er findet, was günstig <strong className="text-fg">aussieht</strong>. Ein
            niedriges Kurs-Gewinn-Verhältnis entsteht auf zwei Wegen: Der Kurs ist
            gefallen, oder der Gewinn war einmalig hoch – ein Verkauf einer Sparte, eine
            Steuererstattung, ein Sondereffekt. In der Tabelle sehen beide gleich aus.
          </p>
          <p className="mt-3">
            Dazu kommt der Stichtag. Die Bilanzzahlen stammen aus dem zuletzt gemeldeten
            Geschäftsjahr, der Kurs ist von heute. Bei einem Unternehmen, dessen Geschäft
            sich seither gedreht hat, verhält sich das KGV zur Gegenwart wie ein Foto zum
            Film.
          </p>
          <p className="mt-3">
            Ein Screener ist deshalb ein Werkzeug zum <em>Fragenfinden</em>, nicht zum
            Antwortenfinden. Was hier oben steht, ist eine Liste zum Nachschauen – kein
            Ergebnis. Wie jede Kennzahl gerechnet wird, steht auf der{' '}
            <Link
              href="/methoden"
              className="hover:text-markets underline underline-offset-2"
            >
              Methodenseite
            </Link>
            .
          </p>
        </Callout>

        <div className="text-fg-muted mt-12 max-w-3xl space-y-4 text-sm leading-relaxed">
          <p>
            <strong className="text-fg">Quelle:</strong> {fundamentalQuelle.label},
            abgerufen {formatDateTime(fundamentalStand)}. {fundamentalQuelle.abgrenzung}
          </p>
          <p>
            Börsenwerte sind zum Referenzkurs der Europäischen Zentralbank in Euro
            umgerechnet, damit sie vergleichbar sind – ein Börsenwert ist eine Größe von
            heute, der Wechselkurs auch. Die gemeldeten Bilanzzahlen bleiben unangetastet
            in ihrer eigenen Währung; kein Wechselkurs berührt je eine Gewinnzahl.
          </p>
          <p>
            Wo jeder Wert in seiner Zwölfmonatsspanne steht, zeigt die{' '}
            <Link
              href="/maerkte/52-wochen"
              className="hover:text-markets underline underline-offset-2"
            >
              52-Wochen-Übersicht
            </Link>
            . Wie ungleich ein Weltindex gewichtet ist, steht unter{' '}
            <Link
              href="/maerkte/klumpenrisiko"
              className="hover:text-markets underline underline-offset-2"
            >
              Klumpenrisiko
            </Link>
            .
          </p>
        </div>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Aktien nach Kennzahlen filtern',
          description:
            'Ein Screener über die geführten Aktien – mit der Datenlage neben jedem Ergebnis.',
          path: '/maerkte/screener',
          items: branchen.map((branche) => ({
            name: branche,
            path: '/maerkte/screener',
          })),
        })}
      />
    </>
  )
}
