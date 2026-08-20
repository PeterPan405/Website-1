import { indexZusammensetzung } from '@/data/index-zusammensetzung'
import { marketKindMeta } from '@/data/markets'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PriceChart } from '@/components/charts/PriceChart'
import { KursLive } from '@/components/markets/KursLive'
import { IndexLaendergewichtung } from '@/components/content/figures/index-laender'
import { TopicLinkList } from '@/components/learn/TopicLinkList'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Klappabschnitt } from '@/components/ui/Klappabschnitt'
import { Indexvergleichstafel } from '@/components/markets/Indexvergleichstafel'
import { Kennzahlentafel } from '@/components/markets/Kennzahlentafel'
import { Dividendentafel } from '@/components/markets/Dividendentafel'
import { Fondstafel } from '@/components/markets/Fondstafel'
import { Handelsfenster } from '@/components/markets/Handelsfenster'
import { Merkschalter } from '@/components/markets/Merkschalter'
import { Quartalstermin } from '@/components/markets/Quartalstermin'
import { Zahlenbald } from '@/components/markets/Zahlenbald'
import { Quellensteuertafel } from '@/components/markets/Quellensteuertafel'
import { Rueckblicktafel } from '@/components/markets/Rueckblicktafel'
import { Branchenvergleichstafel } from '@/components/markets/Branchenvergleichstafel'
import { EingepreistKarte } from '@/components/markets/EingepreistKarte'
import { Unternehmenszahlen } from '@/components/markets/Unternehmenszahlen'
import { Zeitfenstertafel } from '@/components/markets/Zeitfenstertafel'
import { getBranchenvergleich } from '@/lib/branchenvergleich'
import { getLiveSeries } from '@/lib/market-live'
import { jahresfenster } from '@/lib/zeitfenster'
import { getFundamentalquelle } from '@/lib/fundamentaldaten'
import { SourceSummary } from '@/components/markets/SourceNote'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { cn } from '@/lib/cn'
import {
  formatCurrency,
  formatDateShort,
  formatDate,
  formatNumber,
  formatPercentSigned,
} from '@/lib/format'
import { Datenstandsampel } from '@/components/ui/Datenstandsampel'
import { taktErwartung } from '@/lib/datenstand'
import { abstandZumHoch } from '@/lib/jahresspanne'
import { datasetSchema } from '@/lib/jsonld'
import { laendernamen } from '@/data/laender/namen'
import { getBrancheVon } from '@/lib/branchen'
import { getQuellensteuer } from '@/lib/quellensteuer'
import { inEuro, lohntEuroAngabe } from '@/lib/euro'
import { einmalanlage, sparplan } from '@/lib/rueckblick'
import {
  dividendenQuelle,
  getDividendenbefund,
  getDividendenverlauf,
} from '@/lib/dividendentermine'
import { getQuartalsterminbefund, quartalsterminLuecke } from '@/lib/quartalstermine'
import { getTopicsBySlugs } from '@/lib/learn'
import { getNewsArticles, getNewsForSymbol } from '@/lib/news'
import { MINDEST_ARTIKEL, strangFuer } from '@/lib/nachrichtenstrang'
import {
  getAllSeries,
  getDataCoverage,
  getInstrument,
  getInstrumentSymbols,
  getFundamentalkennzahlen,
  getIndexvergleich,
  getIndexvergleichsreihen,
  getKennzahlen,
  getQuote,
  getQuotes,
} from '@/lib/markets'
import { buildMetadata, withBrand } from '@/lib/seo'

type MarketPageProps = { params: Promise<{ symbol: string }> }

export async function generateStaticParams() {
  const symbols = await getInstrumentSymbols()
  return symbols.map((symbol) => ({ symbol }))
}

export async function generateMetadata({ params }: MarketPageProps): Promise<Metadata> {
  const { symbol } = await params
  const instrument = await getInstrument(symbol)

  if (!instrument) {
    return buildMetadata({
      title: withBrand('Kurs nicht gefunden'),
      description: 'Der gesuchte Kurs ist auf dieser Plattform nicht verfügbar.',
      path: `/maerkte/${symbol}`,
      noIndex: true,
    })
  }

  const kindLabel = marketKindMeta[instrument.kind].short

  return buildMetadata({
    // Der Zusatz „aktuell … über 5 Jahre“ hebt kurze Ticker wie „DAX“ auf eine
    // für Suchergebnisse brauchbare Titellänge, ohne Füllwörter zu verwenden.
    title: `${instrument.ticker} aktuell: ${kindLabel}, Chart und Verlauf über 5 Jahre`,
    description: instrument.metaDescription,
    path: `/maerkte/${symbol}`,
    ogTitle: `${instrument.ticker} – ${instrument.name}`,
  })
}

export default async function MarketDetailPage({ params }: MarketPageProps) {
  const { symbol } = await params

  const [instrument, quote, ranges] = await Promise.all([
    getInstrument(symbol),
    getQuote(symbol),
    getAllSeries(symbol),
  ])

  if (!instrument || !quote || !ranges) notFound()

  /*
    Die volle Tagesreihe für den Zeitfenstervergleich.

    `getLiveSeries` und nicht `getAllSeries`: Letzteres dünnt für die Charts
    aus, und ein fehlender Tag verschöbe den Anfang eines Kalenderjahres. Und
    es liefert für Instrumente ohne eingerichtete Quelle erzeugte Reihen –
    eine Jahresrendite daraus wäre eine erfundene Zahl.

    Fehlt die Reihe, entfällt der Abschnitt. Das betrifft eine Handvoll
    Instrumente; für alle übrigen liegt sie vor.
  */
  const volleReihe = getLiveSeries(symbol)?.daily ?? null

  /*
    Die Fenster: die fünf abgeschlossenen Kalenderjahre, dazu die letzten
    zwölf Monate gegen die zwölf davor.

    Das laufende Jahr fehlt mit Absicht – ein halbes Jahr als „2026" neben
    vollen Jahren zu stellen, wäre der Vergleich, gegen den diese Tafel
    gebaut ist.
  */
  /*
    Wie viele Meldungen es zu diesem Wert insgesamt gibt.

    Der Abschnitt unten zeigt vier. Der Verweis auf den Strang erscheint nur,
    wenn es mehr gibt – sonst führte er auf eine Seite mit derselben Liste.
  */
  const alleMeldungen = strangFuer(await getNewsArticles(), 'symbol', symbol)

  const heute = new Date()
  const jahr = heute.getUTCFullYear()
  const tagInMs = 86_400_000
  const alsTag = (versatz: number) =>
    new Date(heute.getTime() - versatz * tagInMs).toISOString().slice(0, 10)

  const zeitfenster = [
    { label: 'Letzte zwölf Monate', von: alsTag(364), bis: alsTag(0) },
    { label: 'Die zwölf Monate davor', von: alsTag(729), bis: alsTag(365) },
    ...jahresfenster(jahr - 5, jahr - 1),
  ]

  const [
    relatedTopics,
    allQuotes,
    coverage,
    meldungen,
    kennzahlen,
    fundamental,
    indexvergleich,
    branchenvergleich,
  ] = await Promise.all([
    getTopicsBySlugs(instrument.relatedTopics),
    getQuotes(),
    getDataCoverage(),
    getNewsForSymbol(symbol),
    getKennzahlen(symbol),
    getFundamentalkennzahlen(symbol),
    getIndexvergleich(symbol),
    getBranchenvergleich(symbol),
  ])

  /*
    Die beiden Kurven erst holen, wenn feststeht, dass es einen Vergleich gibt –
    sonst lüde jede der tausend Aktienseiten eine Indexreihe, die auf zwei
    Dritteln von ihnen nie gezeichnet wird.
  */
  const vergleichsreihen = indexvergleich
    ? await getIndexvergleichsreihen(symbol, indexvergleich.index.symbol)
    : null

  /*
    Der Dividendenbefund kommt aus einem Bestand im Repository, nicht über das
    Netz – deshalb synchron und nicht in `Promise.all` darüber.
  */
  const dividende = getDividendenbefund(symbol)
  const dividendenverlauf = getDividendenverlauf(symbol)
  const branche = getBrancheVon(symbol)
  /*
    Der Meldetermin wird beim Bauen gegen den Bautag gerechnet – anders als
    beim Handelsfenster, das seine Gegenwart im Browser holt.

    Der Unterschied ist beabsichtigt und hängt an der Feinheit der Aussage:
    „Die Börse hat gerade zu" kippt minütlich, „die Zahlen kommen in zwölf
    Tagen" nicht. Diese Seiten werden jede Nacht neu gebaut; die Zahl ist damit
    höchstens einen Tag alt, und ein Tag verschiebt in einem Zwei-Wochen-Fenster
    nichts, was jemand falsch verstünde.

    Der Preis dafür ist ein statisches HTML ohne JavaScript für diese Zeile –
    und der ist es wert.
  */
  const heuteTag = heute.toISOString().slice(0, 10)
  const quartalstermin = getQuartalsterminbefund(symbol, heuteTag)
  const quartalsterminfehlt = quartalsterminLuecke(symbol, heuteTag)
  /*
    Der Rückblick nutzt die Fünfjahresreihe, die für den Chart ohnehin
    geladen ist. Feste Beträge statt Eingabefeld: Die Antwort ist linear, und
    ein Regler auf tausend Seiten kostete JavaScript für eine Multiplikation.
  */
  const reihe = ranges['5J'].map((punkt) => ({ d: punkt.t.slice(0, 10), c: punkt.value }))
  const abTag5J = reihe[0]?.d ?? ''
  const einmal = einmalanlage(reihe, 1000, abTag5J)
  const monatsplan = sparplan(reihe, 100, abTag5J)
  /*
    Die Quellensteuer nur, wo sie eine Rolle spielt: bei Aktien, die auch
    Dividende zahlen. Bei einem Titel ohne Ausschüttung wäre die Tafel eine
    Antwort auf eine Frage, die sich nicht stellt.
  */
  const quellensteuerbefund = dividende ? getQuellensteuer(instrument.sitzland) : null
  const sitzlandName = instrument.sitzland
    ? (laendernamen[instrument.sitzland] ?? instrument.sitzland)
    : null
  /*
    Der Euro-Betrag nur, wo er etwas hinzufügt: nicht bei Titeln, die ohnehin
    in Euro notieren, und nicht bei Indizes – ein Indexstand ist kein
    Geldbetrag, und „7.374 Punkte, rund 6.480 €“ wäre schlicht falsch.
  */
  const euroKurs = lohntEuroAngabe(instrument.unit)
    ? inEuro(quote.value, instrument.unit)
    : null

  const positive = quote.changePercent >= 0
  const otherQuotes = allQuotes.filter((entry) => entry.symbol !== symbol).slice(0, 6)
  const kindLabel = marketKindMeta[instrument.kind].long
  /*
    Nur wenige Indizes haben eine hinterlegte Ländergewichtung.

    Der Abschnitt erscheint deshalb bedingt statt für jedes Instrument mit einem
    leeren Platzhalter – bei einem Währungspaar wäre die Frage ohnehin sinnlos.
  */
  const zusammensetzung = indexZusammensetzung[instrument.symbol]

  return (
    <>
      <PageHeader
        area="markets"
        eyebrow={kindLabel}
        eyebrowIcon="chart"
        title={`${instrument.ticker} – ${instrument.name}`}
        lead={instrument.summary}
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Märkte', path: '/maerkte' }, { name: instrument.ticker }]}
          />
        }
        meta={
          <>
            {/*
              Der Kurs kommt gebaut heraus und wird im Browser aufgefrischt.

              Bis August 2026 stand er ausschließlich im HTML. Jede
              Kursänderung hieß damit: 1.524 Seiten neu bauen, rund dreizehn
              Minuten – für eine Zahl. Jetzt liegt daneben `kurse-live.json`,
              63 KB, die sich in Sekunden hochladen lässt.

              Ausgeliefert wird trotzdem der gebaute Stand, nicht ein
              Platzhalter: Die Seite ist vollständig, bevor JavaScript läuft,
              und bleibt es, wenn keines läuft.
            */}
            <KursLive
              symbol={instrument.symbol}
              unit={instrument.unit}
              decimals={quote.decimals}
              value={quote.value}
              basis={quote.value - quote.change}
              asOf={quote.asOf}
              intraday={quote.intraday}
              hatQuelle={Boolean(quote.source)}
              euroFaktor={euroKurs ? euroKurs.euro / quote.value : null}
            />
            {/*
              Der Merkknopf steht in der Kopfzeile und nicht am Seitenende: Wer
              ihn drückt, hat sich nach den ersten Zahlen entschieden – nicht
              nach dem letzten Absatz.
            */}
            <Merkschalter symbol={instrument.symbol} name={instrument.name} />
            {/*
              Das Zeichen für „meldet bald" steht hier oben, weil es eine Frage
              beantwortet, die sich der Leser nicht gestellt hat – die
              ausführliche Antwort steht unten, dorthin springt der Verweis.
            */}
            <Zahlenbald befund={quartalstermin} />
          </>
        }
      />

      {/*
        Direkt unter dem Kurs, nicht am Seitenende: Wer eine Zahl sieht, die
        alt aussieht, fragt sofort – und soll die Antwort dort finden, wo die
        Frage entsteht.
      */}
      <div className="fk-container">
        <Handelsfenster
          symbol={instrument.symbol}
          ticker={instrument.ticker}
          kind={instrument.kind}
          stand={quote.asOf}
        />
      </div>

      <div className="fk-container py-12 sm:py-16">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            {/* ------------------------------------------------ Kennzahlen */}
            <section aria-labelledby="kennzahlen">
              <h2 id="kennzahlen" className="text-fg text-2xl font-bold">
                Kennzahlen
              </h2>
              <StatGrid columns={4} className="mt-5">
                {/*
                  Die Farbe gehört an den aktuellen Stand, nicht an den
                  Schlusskurs.

                  Vorher war es umgekehrt: Der aktuelle Stand stand neutral da,
                  und der Schlusskurs des Vortages wurde grün, wenn der Kurs
                  seitdem gestiegen war. Grün an einer Zahl heißt aber „diese
                  Zahl ist gestiegen“ – und der Vortagesschluss steht fest, der
                  steigt und fällt nicht mehr. Wer nur auf die Farben schaute,
                  las die Bewegung am falschen Wert ab.
                */}
                <Stat
                  label="Aktueller Stand"
                  value={`${formatNumber(quote.value, quote.decimals)}`}
                  /*
                    Der Euro-Betrag steht im Hinweis, nicht im Wert.

                    Er ist eine Umrechnung und keine Notierung: Gehandelt wird
                    dieser Titel in seiner Heimatwährung, und die große Zahl
                    soll die sein, die auch im Depotauszug steht. Im Hinweis
                    beantwortet er trotzdem die Frage, die sich beim Anschauen
                    zuerst stellt – was ist das in Euro?
                  */
                  hint={
                    euroKurs
                      ? `${instrument.unit} · rund ${formatCurrency(euroKurs.euro, euroKurs.euro < 10 ? 2 : 0)} · ${formatPercentSigned(quote.changePercent)} gegenüber dem Vortag`
                      : `${instrument.unit} · ${formatPercentSigned(quote.changePercent)} gegenüber dem Vortag`
                  }
                  hinweisFliesst
                  tone={positive ? 'positive' : 'negative'}
                />
                <Stat
                  label={quote.intraday ? 'Letzter Schlusskurs' : 'Vortagesschluss'}
                  value={formatNumber(quote.previousClose, quote.decimals)}
                  hint={instrument.unit}
                />
                <Stat
                  label="52-Wochen-Hoch"
                  value={formatNumber(quote.high52w, quote.decimals)}
                  hint="Höchster Schlusskurs der letzten zwölf Monate"
                />
                <Stat
                  label="52-Wochen-Tief"
                  value={formatNumber(quote.low52w, quote.decimals)}
                  hint="Niedrigster Schlusskurs der letzten zwölf Monate"
                />
              </StatGrid>
              <StatGrid columns={2} className="mt-3">
                <Stat
                  label="Seit Jahresbeginn"
                  value={formatPercentSigned(quote.ytdPercent)}
                  tone={quote.ytdPercent >= 0 ? 'positive' : 'negative'}
                  hint="Gegenüber dem letzten Schlusskurs des Vorjahres"
                />
                {/*
                  Die Rechnung stand bis zum 16. August 2026 hier als Ausdruck.
                  Seit es die Übersicht unter `/maerkte/52-wochen` gibt, wird
                  dieselbe Zahl an zwei Stellen gebraucht – und zwei Stellen,
                  die dasselbe rechnen, laufen irgendwann auseinander.
                */}
                <Stat
                  label="Abstand zum 52-Wochen-Hoch"
                  value={formatPercentSigned(abstandZumHoch(quote))}
                  hint="Wie weit der Kurs unter seinem Jahreshoch liegt"
                />
              </StatGrid>
            </section>

            {/* ----------------------------------------------------- Chart */}
            <section aria-labelledby="verlauf" className="mt-12">
              <h2 id="verlauf" className="text-fg text-2xl font-bold">
                Kursverlauf
              </h2>
              <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
                Wähle den Zeitraum. Alle Zeiträume zeigen Tagesschlusskurse – einen Wert
                je Handelstag, keinen Verlauf innerhalb eines Tages.
              </p>
              <div className="fk-card mt-5 p-5 sm:p-6">
                <PriceChart
                  ranges={ranges}
                  decimals={instrument.decimals}
                  unit={instrument.unit}
                  ticker={instrument.ticker}
                />
              </div>
            </section>

            {/* -------------------------------------- Nächste Quartalszahlen */}
            {/*
              Der vierte offene Abschnitt – und die Ausnahme ist gewollt.

              Der Betreiber hat am 20. August 2026 verlangt, dass bei jeder
              Aktie „immer noch dran steht, wann sie Zahlen bringt". Zugeklappt
              stünde es eben nicht dran; wer den Termin sucht, findet ihn dann,
              und wer ihn nicht sucht, läuft in ihn hinein.

              Dazu kommt ein handfester Grund: Das Zeichen im Seitenkopf springt
              hierher. Ein Sprungziel in einem `<details>`, das zu ist, führt
              ins Nichts – der Browser scrollt an eine Stelle, an der nichts
              steht.
            */}
            <Quartalstermin
              befund={quartalstermin}
              luecke={quartalsterminfehlt}
              name={instrument.name}
              className="mt-12"
            />

            {/* ----------------------------------------------- Erklärung */}
            {/*
              Ab hier ist jedes Unterthema eine zugeklappte Kachel – dasselbe
              Muster wie die Archivtage der Nachrichtenseite. Offen bleiben
              nur Kopf, Kennzahlenleiste und Kursverlauf: Sie sind der Grund,
              aus dem jemand die Seite öffnet. Begründung im Klappabschnitt.
            */}
            <Klappabschnitt
              titel={`Was ${instrument.ticker} eigentlich abbildet`}
              className="mt-12"
            >
              <section aria-labelledby="erklaerung">
                <h2 id="erklaerung" className="text-fg text-2xl font-bold">
                  Was {instrument.ticker} eigentlich abbildet
                </h2>
                <div className="text-fg-muted mt-4 space-y-4 leading-relaxed">
                  {instrument.description.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                  {/*
                  Der Verweis auf die Branche steht hier und nicht in der
                  Kopfzeile: Er beantwortet keine Frage über diese Aktie,
                  sondern führt weiter zu den vergleichbaren – und das ist eine
                  Bewegung, die nach dem Lesen kommt, nicht davor.
                */}
                  {branche && (
                    <p>
                      Diese Aktie führen wir unter{' '}
                      <Link
                        href={`/maerkte/branchen/${branche.slug}`}
                        className="text-markets font-medium underline underline-offset-2"
                      >
                        {branche.name}
                      </Link>
                      . Dort stehen die übrigen Titel derselben Branche – nützlich, um
                      eine Bewegung einzuordnen: Fällt nur dieser Kurs oder das ganze
                      Feld?
                    </p>
                  )}
                </div>
              </section>
            </Klappabschnitt>

            {volleReihe && volleReihe.length > 1 && (
              <Klappabschnitt titel="Dieselbe Zahl, andere Zeitfenster" className="mt-6">
                <section aria-labelledby="zeitfenster">
                  <h2 id="zeitfenster" className="text-fg text-2xl font-bold">
                    Dieselbe Zahl, andere Zeitfenster
                  </h2>
                  <p className="text-fg-muted mt-4 leading-relaxed">
                    Eine Renditeangabe klingt nach einer Eigenschaft des Werts. Sie ist
                    vor allem eine Aussage über den{' '}
                    <strong className="text-fg">Startpunkt</strong>: Wer ein Jahr früher
                    oder später angefangen hat, sieht eine andere Zahl – und beide sind
                    richtig gerechnet.
                  </p>
                  <div className="mt-6">
                    <Zeitfenstertafel
                      reihe={volleReihe}
                      fenster={zeitfenster}
                      einheit={instrument.unit}
                    />
                  </div>
                </section>
              </Klappabschnitt>
            )}

            {zusammensetzung && (
              <Klappabschnitt titel="Woher das Gewicht kommt" className="mt-6">
                <section aria-labelledby="zusammensetzung">
                  <h2 id="zusammensetzung" className="text-fg text-2xl font-bold">
                    Woher das Gewicht kommt
                  </h2>
                  <p className="text-fg-muted mt-4 leading-relaxed">
                    Gewichtet wird nach Börsenwert: Je mehr ein Unternehmen an der Börse
                    wert ist, desto stärker zählt es im Index. Nicht die Zahl der
                    enthaltenen Länder entscheidet also über die Aufteilung, sondern der
                    Marktwert der Unternehmen in ihnen.
                  </p>
                  <figure className="mt-6">
                    <div className="rounded-card border-border bg-surface-muted border p-4 sm:p-6">
                      <IndexLaendergewichtung symbol={instrument.symbol} />
                    </div>
                    <figcaption className="text-fg-subtle mt-2.5 text-sm leading-relaxed">
                      {zusammensetzung.hinweis}
                    </figcaption>
                  </figure>
                  {/*
                    Die Gewichtung wird von Hand gepflegt, nicht stündlich
                    abgerufen. Ohne sichtbares Datum wäre sie eine Behauptung.

                    Die Ampel sagt zusätzlich, ob das Datum in Ordnung ist –
                    ein Datum allein beantwortet die Frage nicht, die jemand
                    hat. Indizes werden vierteljährlich überprüft; nach dem
                    Doppelten davon steht die Pflege aus, nach dem Dreifachen
                    ist sie liegengeblieben.
                  */}
                  <Datenstandsampel
                    className="mt-4"
                    stand={zusammensetzung.stand}
                    erwartung={taktErwartung('vierteljährlich neue Gewichtungen', 91)}
                    quelle={zusammensetzung.quelle}
                  />
                  <p className="text-fg-subtle mt-3 text-sm leading-relaxed">
                    Anders als der Kurs wird dieser Datensatz nicht automatisch
                    aktualisiert.
                  </p>
                </section>
              </Klappabschnitt>
            )}

            {/*
              Nachrichten zu genau diesem Kurs.

              Die Zuordnung kommt aus `relatedSymbols` am Artikel, hier nur
              andersherum gelesen. Der Abschnitt erscheint deshalb bedingt: Zu
              den meisten der über fünfhundert Einzelwerte gibt es keine eigene
              Meldung, und eine leere Überschrift „Nachrichten“ auf jeder
              zweiten Seite behauptet mehr, als da ist.
            */}
            {meldungen.length > 0 && (
              <Klappabschnitt
                titel={`Nachrichten zu ${instrument.name}`}
                hinweis={`${meldungen.length} ${meldungen.length === 1 ? 'Meldung' : 'Meldungen'}`}
                className="mt-6"
              >
                <section aria-labelledby="meldungen">
                  <h2 id="meldungen" className="text-fg text-2xl font-bold">
                    Nachrichten zu {instrument.name}
                  </h2>
                  <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
                    Was zuletzt über diesen Kurs geschrieben wurde – mit der Einordnung,
                    warum es ihn bewegt.
                  </p>
                  <ul className="mt-5 space-y-3">
                    {meldungen.map((meldung) => (
                      <li key={meldung.slug}>
                        <Link
                          href={`/news/${meldung.slug}`}
                          className="fk-card hover:border-border-strong block p-5 transition-colors"
                        >
                          <span className="text-fg-subtle flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                            <span className="font-semibold tracking-wide uppercase">
                              {meldung.category}
                            </span>
                            <span aria-hidden="true">·</span>
                            <time dateTime={meldung.publishedAt}>
                              {formatDate(meldung.publishedAt)}
                            </time>
                            <span aria-hidden="true">·</span>
                            <span>{meldung.readingMinutes} Min. Lesezeit</span>
                          </span>
                          <span className="text-fg mt-1.5 block text-lg font-semibold">
                            {meldung.title}
                          </span>
                          <span className="text-fg-muted mt-1.5 block text-sm leading-relaxed">
                            {meldung.teaser}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {alleMeldungen.length >= MINDEST_ARTIKEL &&
                  alleMeldungen.length > meldungen.length ? (
                    <p className="text-fg-muted mt-5 text-sm leading-relaxed">
                      Insgesamt gibt es{' '}
                      <Link
                        href={`/news/strang/wert/${instrument.symbol}`}
                        className="text-news font-medium underline underline-offset-2"
                      >
                        {alleMeldungen.length} Meldungen zu {instrument.name}
                      </Link>{' '}
                      – chronologisch, von der jüngsten zurück bis zur ersten.
                    </p>
                  ) : null}
                </section>
              </Klappabschnitt>
            )}

            {/*
              Die Dividende steht vor den Unternehmenszahlen: Sie ist die
              Frage, die zuerst kommt, wenn jemand eine Aktienseite öffnet und
              wissen will, was sie abwirft.
            */}
            {dividende && (
              <Klappabschnitt titel="Dividende" className="mt-6">
                <Dividendentafel
                  befund={dividende}
                  einheit={instrument.unit}
                  name={instrument.name}
                  quelle={dividendenQuelle}
                  verlauf={dividendenverlauf}
                />
              </Klappabschnitt>
            )}

            {/*
              Bei einem Fonds stehen andere Angaben im Vordergrund als bei
              einer Aktie: Kennnummer, Umgang mit den Erträgen und vor allem
              die laufenden Kosten. Sie stehen weit oben, weil sie die Frage
              sind, mit der jemand eine ETF-Seite öffnet.
            */}
            {/*
              Die Rohdaten zum Nachrechnen.

              Wer seine Quellen offenlegt, kann auch die Zahlen herausgeben –
              alles andere wäre eine Offenheit, die an der bequemsten Stelle
              endet. Für den Lernbereich ist es obendrein die stärkste Übung:
              Eine Rendite selbst in einer Tabelle nachzurechnen lehrt mehr
              über Rendite als jeder Text darüber.
            */}
            <p className="text-fg-subtle mt-12 text-sm leading-relaxed">
              Die Kursreihe zum Selbernachrechnen:{' '}
              <a
                href={`/maerkte/${instrument.symbol}/kurse.csv`}
                className="text-markets font-medium underline underline-offset-2"
              >
                {instrument.symbol}-kurse.csv
              </a>{' '}
              – Schlusskurse je Handelstag über fünf Jahre, mit Quelle und Stand im Kopf
              der Datei.
            </p>

            {instrument.kind === 'etf' && (
              <Klappabschnitt titel="Was dieser Fonds ist" className="mt-6">
                <Fondstafel
                  symbol={instrument.symbol}
                  isin={instrument.isin}
                  ertragsverwendung={instrument.ertragsverwendung}
                />
              </Klappabschnitt>
            )}

            {quellensteuerbefund && sitzlandName && (
              <Klappabschnitt titel="Quellensteuer" className="mt-6">
                <Quellensteuertafel befund={quellensteuerbefund} land={sitzlandName} />
              </Klappabschnitt>
            )}

            {einmal && (
              <Klappabschnitt
                titel="Was daraus geworden wäre"
                hinweis="Rückblick: 1.000 € über echte Kursreihen"
                className="mt-6"
              >
                <Rueckblicktafel
                  einmal={einmal}
                  plan={monatsplan}
                  einheit={instrument.unit}
                  name={instrument.name}
                />
              </Klappabschnitt>
            )}

            {indexvergleich && (
              <Klappabschnitt
                titel={`Gegen den ${indexvergleich?.index.name ?? 'Index'}`}
                className="mt-6"
              >
                <Indexvergleichstafel
                  vergleich={indexvergleich}
                  name={instrument.name}
                  ticker={instrument.ticker}
                  reihen={vergleichsreihen}
                />
              </Klappabschnitt>
            )}

            {fundamental && (
              <Klappabschnitt titel="Unternehmenszahlen" className="mt-6">
                <Unternehmenszahlen
                  befund={fundamental}
                  name={instrument.name}
                  quelle={getFundamentalquelle(instrument.ticker)}
                />
              </Klappabschnitt>
            )}
            {branchenvergleich && (
              <Klappabschnitt titel="Im Branchenvergleich" className="mt-6">
                <Branchenvergleichstafel
                  vergleich={branchenvergleich}
                  name={instrument.name}
                />
              </Klappabschnitt>
            )}
            {/*
              Die vorgerechnete Bewertung direkt am Titel – unabhängig vom
              Branchenvergleich, denn ein KGV kann es auch geben, wenn die
              Branche zu klein für einen Median ist.
            */}
            {fundamental?.art === 'zahlen' &&
              fundamental.kennzahlen.kgv.wert !== null && (
                <Klappabschnitt
                  titel="Was der Kurs schon verspricht"
                  hinweis="Die Bewertung, bereits durchgerechnet"
                  className="mt-6"
                >
                  <EingepreistKarte kgv={fundamental.kennzahlen.kgv.wert} />
                </Klappabschnitt>
              )}
            {kennzahlen && (
              <Klappabschnitt titel="Wertentwicklung und Risiko" className="mt-6">
                <Kennzahlentafel kennzahlen={kennzahlen} />
              </Klappabschnitt>
            )}

            <div className="border-border mt-10 border-t pt-5">
              <SourceSummary
                quotes={[quote]}
                className="text-fg-subtle text-sm leading-relaxed"
              />
              <p className="text-fg-subtle mt-1 text-xs">
                Verlauf vom {formatDateShort(coverage.from)} bis{' '}
                {formatDateShort(coverage.to)}; ältere Abschnitte auf einen Wert je Woche
                verdichtet.
              </p>
              {/*
                Der Euro-Betrag braucht seine eigene Herkunftsangabe.

                Er entsteht aus zwei verschieden alten Zahlen: einem Kurs von
                vor höchstens einer halben Stunde und einem Wechselkurs, den die
                EZB einmal am Tag feststellt. „Rund“ allein sagt das nicht – erst
                das Datum daneben macht sichtbar, worauf die Umrechnung beruht.
              */}
              {euroKurs && (
                <p className="text-fg-subtle mt-1 text-xs">
                  Der Euro-Betrag ist mit dem Referenzkurs der EZB vom{' '}
                  {formatDateShort(euroKurs.stand)} gerechnet (1 € ={' '}
                  {formatNumber(euroKurs.jeEuro, 4)} {euroKurs.ausWaehrung}). Beim Kauf
                  gilt der Kurs deiner Bank samt Aufschlag, nicht dieser.
                </p>
              )}
            </div>
          </div>

          {/* -------------------------------------------------- Seitenleiste */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <TopicLinkList
              topics={relatedTopics}
              description="Was hinter diesem Kurs steckt – ausführlich erklärt."
            />

            <section aria-labelledby="weitere-kurse" className="fk-card p-6">
              <h2 id="weitere-kurse" className="text-fg text-lg font-semibold">
                Weitere Kurse
              </h2>
              <ul className="mt-4 space-y-1">
                {otherQuotes.map((entry) => {
                  const up = entry.changePercent >= 0
                  return (
                    <li key={entry.symbol}>
                      <Link
                        href={`/maerkte/${entry.symbol}`}
                        className="hover:bg-surface-muted flex items-center justify-between gap-3 rounded-xl p-2.5 transition"
                      >
                        <span className="min-w-0">
                          <span className="text-fg block text-sm font-semibold">
                            {entry.ticker}
                          </span>
                          <span className="text-fg-subtle block truncate text-xs">
                            {entry.name}
                          </span>
                        </span>
                        <span
                          className={cn(
                            'shrink-0 text-sm font-semibold tabular-nums',
                            up ? 'text-success' : 'text-danger'
                          )}
                        >
                          {formatPercentSigned(entry.changePercent)}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
              <p className="mt-4">
                <Link href="/maerkte" className="fk-btn-ghost w-full">
                  Alle Kurse
                  <Icon name="arrow-right" className="size-4" />
                </Link>
              </p>
            </section>
          </aside>
        </div>
      </div>

      <JsonLd
        data={datasetSchema({
          name: `${instrument.ticker} Kursverlauf (Beispieldaten)`,
          description: `Verlaufsdaten für ${instrument.name}. ${instrument.summary}`,
          path: `/maerkte/${symbol}`,
          temporalCoverage: `${coverage.from}/${coverage.to}`,
          keywords: [instrument.ticker, instrument.name, kindLabel, 'Kursverlauf'],
        })}
      />
    </>
  )
}
