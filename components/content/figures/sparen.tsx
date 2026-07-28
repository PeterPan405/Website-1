import {
  FARBEN,
  LinienDiagramm,
  SaeulenDiagramm,
} from '@/components/content/figures/Diagramme'
import { calculateCompoundInterest } from '@/lib/finance'
import { formatCurrencyRounded, formatNumber, formatPercent } from '@/lib/format'
import {
  hebelAusgang,
  hebelMehrRate,
  hebelMehrRendite,
  kostenfaelle,
  kostenFondsquote,
  kostenstufen,
  ordergebuehrFest,
  portfolioJahre,
  portfolioRenditeAktien,
  portfolioRenditeSicher,
  portfolioStart,
  sparfall,
  spreadProzent,
  verhaltensluecke,
} from '@/lib/lernszenarien'

/**
 * Grafiken zum Sparen: Kosten, Verhalten, Hebel und Drift.
 *
 * Vier Themen, die alle dieselbe Sorte Aussage machen – „ein kleiner
 * Unterschied pro Jahr wird über Jahrzehnte groß“. Genau diese Sorte ist es,
 * die in einer Tabelle nicht ankommt: Zwischen 6,0 und 5,0 Prozent liegt
 * optisch nichts, zwischen den beiden Kurven nach dreißig Jahren liegt ein
 * Kleinwagen.
 *
 * Gerechnet wird mit `calculateCompoundInterest` aus `lib/finance.ts` –
 * derselben Funktion wie im Zinsrechner der Website und in den Tabellen der
 * Themen. Die Annahmen stehen in `lib/lernszenarien.ts`.
 */

function endkapital(rate: number, rendite: number, jahre: number): number {
  return calculateCompoundInterest({
    principal: 0,
    contribution: rate,
    interval: 'monthly',
    annualRatePercent: rendite,
    years: jahre,
  }).finalBalance
}

// ---------------------------------------------------- Wirkung der Kosten

export function KostenEndkapital() {
  const eingezahlt = sparfall.rate * 12 * sparfall.jahre

  const saeulen = kostenstufen.map((kosten) => {
    const ergebnis = endkapital(sparfall.rate, sparfall.brutto - kosten, sparfall.jahre)
    return {
      label: formatPercent(kosten, 1),
      teile: [
        /*
          Der eingezahlte Teil bleibt unten stehen.

          Ohne ihn sähen die Säulen aus, als schrumpfte das gesamte Vermögen.
          Tatsächlich zehren die Kosten ausschließlich am Ertrag – der
          eingezahlte Sockel ist bei allen fünf derselbe, und erst dadurch
          wird sichtbar, wie viel vom Ertrag jeweils übrig bleibt.
        */
        { wert: eingezahlt, farbe: FARBEN.ruhig },
        { wert: Math.max(ergebnis - eingezahlt, 0), farbe: FARBEN.marke },
      ],
      wertText: formatCurrencyRounded(ergebnis),
    }
  })

  const guenstigste = endkapital(
    sparfall.rate,
    sparfall.brutto - kostenstufen[0],
    sparfall.jahre
  )
  const teuerste = endkapital(
    sparfall.rate,
    sparfall.brutto - kostenstufen[kostenstufen.length - 1],
    sparfall.jahre
  )

  return (
    <SaeulenDiagramm
      id="kosten-endkapital"
      saeulen={saeulen}
      einheit="Endkapital in Euro"
      legende={[
        { farbe: FARBEN.ruhig, text: 'eingezahlt' },
        { farbe: FARBEN.marke, text: 'Ertrag' },
      ]}
      hoehe={300}
      beschreibung={
        `${formatCurrencyRounded(sparfall.rate)} monatlich über ${sparfall.jahre} Jahre bei ` +
        `${formatPercent(sparfall.brutto, 0)} Bruttorendite, belastet mit ` +
        `${formatPercent(kostenstufen[0], 1)} bis ${formatPercent(kostenstufen[kostenstufen.length - 1], 1)} ` +
        `laufenden Kosten. Der graue Sockel ist bei allen fünf gleich – das eingezahlte Geld von ` +
        `${formatCurrencyRounded(eingezahlt)}. Unterschiedlich ist allein der Ertrag darüber: ` +
        `${formatCurrencyRounded(guenstigste - eingezahlt)} bei der günstigsten Variante, ` +
        `${formatCurrencyRounded(teuerste - eingezahlt)} bei der teuersten. Am Ende stehen damit ` +
        `${formatCurrencyRounded(guenstigste)} gegen ${formatCurrencyRounded(teuerste)}. Die Differenz von ` +
        `${formatCurrencyRounded(guenstigste - teuerste)} entspricht ` +
        `${formatPercent(((guenstigste - teuerste) / eingezahlt) * 100, 0)} aller Einzahlungen – ` +
        `abgeflossen für einen Unterschied von ` +
        `${formatPercent(kostenstufen[kostenstufen.length - 1] - kostenstufen[0], 1)} pro Jahr.`
      }
    />
  )
}

// ----------------------------------------------------- Die Verhaltenslücke

export function PsychologieVerhaltensluecke() {
  const jahre = Array.from({ length: sparfall.jahre + 1 }, (_, index) => index)
  const ohne = sparfall.brutto
  const mit = sparfall.brutto - verhaltensluecke

  const reihe = (rendite: number) =>
    jahre.map((jahr) => ({ x: jahr, y: endkapital(sparfall.rate, rendite, jahr) }))

  const endeOhne = endkapital(sparfall.rate, ohne, sparfall.jahre)
  const endeMit = endkapital(sparfall.rate, mit, sparfall.jahre)

  return (
    <LinienDiagramm
      id="psychologie-verhaltensluecke"
      reihen={[
        {
          name: `${formatPercent(ohne, 0)} – durchgehalten`,
          farbe: FARBEN.marke,
          punkte: reihe(ohne),
          endText: formatCurrencyRounded(endeOhne),
        },
        {
          name: `${formatPercent(mit, 0)} – mit Verhaltenslücke`,
          farbe: FARBEN.warnung,
          punkte: reihe(mit),
          gestrichelt: true,
        },
      ]}
      xVon={0}
      xBis={sparfall.jahre}
      xTeilstriche={[0, 10, 20, 30].map((wert) => ({
        wert,
        text: wert === 0 ? 'Start' : `${wert} J.`,
      }))}
      yEinheit="Depotwert in Euro"
      hoehe={300}
      rechterRand={96}
      beschreibung={
        `Zwei Sparpläne über ${formatCurrencyRounded(sparfall.rate)} monatlich und ${sparfall.jahre} Jahre. ` +
        `Der eine erzielt ${formatPercent(ohne, 0)} im Jahr, der andere ` +
        `${formatPercent(mit, 0)} – dasselbe Produkt, nur schlechter getroffene Ein- und Ausstiege. ` +
        `Zwanzig Jahre lang liegen beide Linien fast aufeinander. Am Ende stehen ` +
        `${formatCurrencyRounded(endeOhne)} gegen ${formatCurrencyRounded(endeMit)}: ` +
        `${formatCurrencyRounded(endeOhne - endeMit)} Unterschied, ` +
        `${formatPercent(((endeOhne - endeMit) / endeOhne) * 100, 0)} des Ergebnisses, für einen einzigen ` +
        `Prozentpunkt im Jahr.`
      }
    />
  )
}

// -------------------------------------------- Sparen gegen mehr Rendite

export function BudgetHebel() {
  const jahre = Array.from({ length: 41 }, (_, index) => index)

  const zugewinn = (variante: 'rate' | 'rendite') =>
    jahre.map((jahr) => {
      const basis = endkapital(hebelAusgang.rate, hebelAusgang.rendite, jahr)
      const mit =
        variante === 'rate'
          ? endkapital(hebelAusgang.rate + hebelMehrRate, hebelAusgang.rendite, jahr)
          : endkapital(hebelAusgang.rate, hebelAusgang.rendite + hebelMehrRendite, jahr)
      return { x: jahr, y: mit - basis }
    })

  const durchRate = zugewinn('rate')
  const durchRendite = zugewinn('rendite')

  /*
    Der Wechselpunkt wird gesucht, nicht behauptet.

    „Mehr Rendite schlägt mehr Sparen“ steht in vielen Ratgebern ohne
    Zeitangabe – und ohne sie ist der Satz nicht wahr oder falsch, sondern
    leer. Das erste Jahr, in dem der Renditehebel vorn liegt, ist die
    eigentliche Antwort.
  */
  const wechsel = jahre.find((jahr) => durchRendite[jahr].y > durchRate[jahr].y) ?? null

  return (
    <LinienDiagramm
      id="budget-hebel"
      reihen={[
        {
          name: `${formatCurrencyRounded(hebelMehrRate)} mehr im Monat`,
          farbe: FARBEN.marke,
          punkte: durchRate,
        },
        {
          name: `${formatNumber(hebelMehrRendite, 0)} Prozentpunkt mehr Rendite`,
          farbe: FARBEN.akzent,
          punkte: durchRendite,
        },
      ]}
      xVon={0}
      xBis={40}
      xTeilstriche={[0, 10, 20, 30, 40].map((wert) => ({
        wert,
        text: wert === 0 ? 'Start' : `${wert} J.`,
      }))}
      yEinheit="Zugewinn gegenüber dem Ausgangsplan, in Euro"
      hoehe={300}
      beschreibung={
        `Ausgangslage: ${formatCurrencyRounded(hebelAusgang.rate)} monatlich bei ` +
        `${formatPercent(hebelAusgang.rendite, 0)}. Zwei Hebel im Vergleich – ` +
        `${formatCurrencyRounded(hebelMehrRate)} mehr sparen oder einen Prozentpunkt mehr Rendite erzielen. ` +
        (wechsel === null
          ? 'Über vierzig Jahre bleibt der Sparhebel durchgehend vorn.'
          : `In den ersten ${wechsel - 1} Jahren bringt die höhere Rate mehr; ab Jahr ${wechsel} zieht die ` +
            `höhere Rendite vorbei und läuft danach immer weiter davon.`) +
        ` Nach zehn Jahren liegt der Sparhebel bei ${formatCurrencyRounded(durchRate[10].y)} gegen ` +
        `${formatCurrencyRounded(durchRendite[10].y)}, nach vierzig bei ` +
        `${formatCurrencyRounded(durchRate[40].y)} gegen ${formatCurrencyRounded(durchRendite[40].y)}. ` +
        `Die höhere Rate wirkt sofort, die höhere Rendite erst mit der Zeit – und nur die Rate hat man ` +
        `selbst in der Hand.`
      }
    />
  )
}

// --------------------------------------------------------- Portfolio-Drift

export function PortfolioDrift() {
  const jahre = Array.from({ length: portfolioJahre + 1 }, (_, index) => index)

  const quote = jahre.map((jahr) => {
    const aktien = portfolioStart.aktien * (1 + portfolioRenditeAktien / 100) ** jahr
    const sicher = portfolioStart.sicher * (1 + portfolioRenditeSicher / 100) ** jahr
    return { x: jahr, y: (aktien / (aktien + sicher)) * 100 }
  })

  const ende = quote[quote.length - 1].y
  const nachFuenf = quote[5].y

  return (
    <LinienDiagramm
      id="portfolio-drift"
      reihen={[
        {
          name: 'Aktienanteil ohne Eingriff',
          farbe: FARBEN.warnung,
          punkte: quote,
          endText: formatPercent(ende, 0),
        },
        {
          name: 'geplante Aufteilung',
          farbe: FARBEN.ruhig,
          gestrichelt: true,
          punkte: jahre.map((jahr) => ({ x: jahr, y: portfolioStart.aktien })),
        },
      ]}
      xVon={0}
      xBis={portfolioJahre}
      xTeilstriche={[0, 2, 4, 6, 8, 10].map((wert) => ({
        wert,
        text: wert === 0 ? 'Start' : `${wert} J.`,
      }))}
      /*
        Hier beginnt die Achse ausnahmsweise nicht bei null.

        Es geht um die Abweichung von einer geplanten Quote, nicht um die
        Quote selbst. Bei einer Achse von null bis hundert lägen beide Linien
        so dicht beieinander, dass die Verschiebung – der ganze Inhalt der
        Grafik – nicht mehr zu sehen wäre. Die Grundlinie ist deshalb die
        geplante Quote, und sie ist als solche beschriftet.
      */
      yMinimum={portfolioStart.aktien - 10}
      yFormat={(wert) => formatPercent(wert, 0)}
      hoehe={290}
      rechterRand={64}
      beschreibung={
        `Ein Depot startet mit ${formatPercent(portfolioStart.aktien, 0)} Aktien und ` +
        `${formatPercent(portfolioStart.sicher, 0)} sicherem Teil. Angenommen, der Aktienteil wächst über ` +
        `zehn gute Jahre mit ${formatPercent(portfolioRenditeAktien, 0)} im Jahr, der sichere mit ` +
        `${formatPercent(portfolioRenditeSicher, 0)}. Ohne dass jemand etwas entscheidet, steigt der ` +
        `Aktienanteil nach fünf Jahren auf ${formatPercent(nachFuenf, 0)} und nach zehn auf ` +
        `${formatPercent(ende, 0)}. Das Depot trägt dann mehr Risiko als geplant – und zwar am Ende einer ` +
        `guten Phase, also genau dann, wenn ein Rückschlag am wahrscheinlichsten ist. Die gestrichelte ` +
        `Linie ist die geplante Quote, auf die Rebalancing zurücksetzt.`
      }
    />
  )
}

// -------------------------------------------- Welcher Kostenblock überwiegt

/**
 * Warum die Frage nach dem günstigeren Anbieter keine allgemeine Antwort hat.
 *
 * ## Was die Grafik zeigt
 *
 * Zwei Depots, beide üblich, und in beiden dieselben drei Kostenarten – nur
 * in umgekehrter Rangfolge. Beim kleinen Depot mit monatlichem Sparplan
 * überwiegen Ordergebühr und Spread; beim großen mit zwei Käufen im Jahr sind
 * sie neben den laufenden Fondskosten kaum noch sichtbar.
 *
 * ## Warum in Prozent und nicht in Euro
 *
 * In Euro wäre der Vergleich sinnlos: Ein Depot ist fünfzehnmal so groß wie
 * das andere, die Säule daneben wäre ein Strich. Bezogen auf den Depotwert
 * werden beide vergleichbar – und genau diese Bezugsgröße meint der Abschnitt,
 * wenn er von der „wahren Quote“ spricht.
 *
 * Der Text daneben sagt allerdings ausdrücklich, dass man *rechnen* muss, statt
 * Prozentzahlen zu addieren. Das ist kein Widerspruch: Hier wird in Euro
 * gerechnet und erst das Ergebnis durch den Depotwert geteilt. Genau die
 * Reihenfolge, die dort steht.
 */
export function KostenWahreQuote() {
  const faelle = kostenfaelle.map((fall) => {
    const umsatz = fall.kaeufeJeJahr * fall.kaufbetrag
    const fondskosten = fall.depotwert * (kostenFondsquote / 100)
    const ordergebuehren = fall.kaeufeJeJahr * ordergebuehrFest
    const spread = umsatz * (spreadProzent / 100)
    const summe = fondskosten + ordergebuehren + spread
    const alsQuote = (betrag: number) => (betrag / fall.depotwert) * 100
    return {
      ...fall,
      umsatz,
      teile: [
        { name: 'Fondskosten', wert: alsQuote(fondskosten), euro: fondskosten },
        { name: 'Ordergebühr', wert: alsQuote(ordergebuehren), euro: ordergebuehren },
        { name: 'Spread', wert: alsQuote(spread), euro: spread },
      ],
      summe,
      quote: alsQuote(summe),
    }
  })

  const farben = [FARBEN.marke, FARBEN.gefahr, FARBEN.warnung]

  return (
    <SaeulenDiagramm
      id="kosten-wahre-quote"
      einheit="Prozent des Depotwerts im Jahr"
      hoehe={310}
      legende={faelle[0].teile.map((teil, index) => ({
        farbe: farben[index],
        text: teil.name,
      }))}
      saeulen={faelle.map((fall) => ({
        label: formatCurrencyRounded(fall.depotwert),
        teile: fall.teile.map((teil, index) => ({
          wert: teil.wert,
          farbe: farben[index],
        })),
        wertText: formatPercent(fall.quote, 2),
        hinweis: `${fall.kaeufeJeJahr} Käufe im Jahr`,
      }))}
      beschreibung={
        `Dieselben drei Kostenarten in zwei Depots, jeweils auf ein Jahr gerechnet und durch den ` +
        `Depotwert geteilt. ` +
        faelle
          .map(
            (fall) =>
              `Beim ${fall.name} – ${formatCurrencyRounded(fall.depotwert)} Depotwert, ` +
              `${fall.kaeufeJeJahr} Käufe zu je ${formatCurrencyRounded(fall.kaufbetrag)} – kostet ein ` +
              `Jahr ${formatCurrencyRounded(fall.summe)}, also ${formatPercent(fall.quote, 2)}: ` +
              fall.teile
                .map((teil) => `${teil.name} ${formatCurrencyRounded(teil.euro)}`)
                .join(', ')
          )
          .join('. ') +
        `. Die Rangfolge dreht sich um: Im kleinen Depot machen Ordergebühr und Spread den größten ` +
        `Teil aus, im großen sind sie neben den laufenden Fondskosten kaum noch zu sehen. Deshalb hat ` +
        `die Frage, welcher Anbieter günstiger ist, keine allgemeine Antwort – sie hängt an Depotgröße ` +
        `und Handelshäufigkeit. Gerechnet ist mit ${formatPercent(kostenFondsquote, 1)} Fondskosten, ` +
        `${formatCurrencyRounded(ordergebuehrFest)} je Order und ${formatPercent(spreadProzent, 1)} ` +
        `Spread; eine Depotgebühr fällt bei den üblichen Anbietern nicht an.`
      }
    />
  )
}
