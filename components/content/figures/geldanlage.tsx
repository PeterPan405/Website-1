import {
  BalkenDiagramm,
  FARBEN,
  SaeulenDiagramm,
} from '@/components/content/figures/Diagramme'
import {
  formatCurrency,
  formatCurrencyRounded,
  formatNumber,
  formatPercent,
} from '@/lib/format'
import { inflationsbeispiel, realzinsbeispiel } from '@/lib/inflations-beispiele'
import {
  ordergebuehrFest,
  ordergroessen,
  spreadProzent,
  derivatEinsatz,
  derivatSicherheitssaetze,
  einlagensicherungErhoeht,
  einlagensicherungGrenze,
  sparplanKurse,
  sparplanRate,
  waehrungEinsatz,
  waehrungKurse,
  waehrungKursgewinn,
  waehrungKursStart,
} from '@/lib/lernszenarien'

/**
 * Grafiken zu Tagesgeld, Sparplan, Währung, Hebel und Einlagensicherung.
 *
 * Fünf Themen, ein gemeinsamer Zug: Jedes von ihnen dreht sich um einen
 * Zusammenhang, den man an einer Zahl nicht sieht, an zwei nebeneinander
 * gestellten aber sofort. Die Zahlen selbst stehen als Annahmen in
 * `lib/lernszenarien.ts` und `lib/inflations-beispiele.ts` – gerechnet wird
 * hier, mit denselben Formeln wie im Text daneben.
 */

// ------------------------------------------------------ Nominal und real

export function TagesgeldRealzins() {
  /*
    Nominalzins und Inflation als zwei Säulen, die Differenz als dritte.

    Die Alternative wäre gewesen, den Realzins als negative Säule zu zeichnen.
    Das hätte eine Achse ins Minus verlangt und den eigentlichen Punkt
    verdeckt: Der Realzins ist keine eigene Größe, sondern das, was von der
    ersten Säule nach Abzug der zweiten übrig bleibt – hier eben nichts.
  */
  const fehlbetrag = inflationsbeispiel.rate - realzinsbeispiel.nominal

  return (
    <SaeulenDiagramm
      id="tagesgeld-realzins"
      saeulen={[
        {
          label: 'Zins aufs Konto',
          teile: [{ wert: realzinsbeispiel.nominal, farbe: FARBEN.marke }],
          wertText: formatPercent(realzinsbeispiel.nominal, 1),
          hinweis: 'was gutgeschrieben wird',
        },
        {
          label: 'Inflation',
          teile: [
            { wert: realzinsbeispiel.nominal, farbe: FARBEN.warnung },
            { wert: fehlbetrag, farbe: FARBEN.gefahr },
          ],
          wertText: formatPercent(inflationsbeispiel.rate, 1),
          hinweis: 'was an Kaufkraft verloren geht',
        },
      ]}
      einheit="Prozent im Jahr"
      legende={[
        { farbe: FARBEN.warnung, text: 'vom Zins gedeckt' },
        { farbe: FARBEN.gefahr, text: 'nicht gedeckt' },
      ]}
      hoehe={270}
      beschreibung={
        `Ein Tagesgeldkonto zu ${formatPercent(realzinsbeispiel.nominal, 1)} Zins bei ` +
        `${formatPercent(inflationsbeispiel.rate, 1)} Inflation. Der Zins deckt den unteren Teil der ` +
        `Inflationssäule; der obere Teil von ${formatPercent(fehlbetrag, 1)} bleibt ungedeckt. Der Realzins ` +
        `beträgt damit ${formatPercent(realzinsbeispiel.real, 2)}: Das Konto wächst, die Kaufkraft schrumpft. ` +
        `Auf dem Kontoauszug ist davon nichts zu sehen – dort steht nur die erste Säule.`
      }
    />
  )
}

// ------------------------------------------------ Durchschnittskosteneffekt

export function SparplanDurchschnittspreis() {
  const kaeufe = sparplanKurse.map((kurs) => ({ kurs, anteile: sparplanRate / kurs }))
  const anteile = kaeufe.reduce((summe, kauf) => summe + kauf.anteile, 0)
  const eingezahlt = sparplanRate * sparplanKurse.length
  const durchschnittspreis = eingezahlt / anteile
  const kursdurchschnitt =
    sparplanKurse.reduce((summe, kurs) => summe + kurs, 0) / sparplanKurse.length

  return (
    <SaeulenDiagramm
      id="sparplan-durchschnittspreis"
      saeulen={kaeufe.map((kauf, index) => ({
        label: `${index + 1}.`,
        teile: [{ wert: kauf.anteile, farbe: FARBEN.marke }],
        wertText: formatNumber(kauf.anteile, 1),
        hinweis: formatCurrency(kauf.kurs),
      }))}
      einheit="gekaufte Anteile je Rate"
      hoehe={280}
      beschreibung={
        `Sechs Raten zu je ${formatCurrency(sparplanRate)} bei Kursen von ` +
        sparplanKurse.map((kurs) => formatCurrency(kurs)).join(', ') +
        `. Die Rate bleibt gleich, also kauft sie bei niedrigem Kurs mehr Anteile – bei ` +
        `${formatCurrency(Math.min(...sparplanKurse))} sind es ${formatNumber(sparplanRate / Math.min(...sparplanKurse), 1)}, ` +
        `bei ${formatCurrency(Math.max(...sparplanKurse))} nur ${formatNumber(sparplanRate / Math.max(...sparplanKurse), 1)}. ` +
        `Nach ${formatCurrency(eingezahlt)} Einzahlung liegen ${formatNumber(anteile, 1)} Anteile im Depot, ` +
        `im Schnitt zu ${formatCurrency(durchschnittspreis)} gekauft. Der Durchschnitt der sechs Kurse liegt bei ` +
        `${formatCurrency(kursdurchschnitt)} – der bezahlte Preis liegt darunter, und zwar allein deshalb, ` +
        `weil die Rate gleich blieb.`
      }
    />
  )
}

// -------------------------------------------------- Ergebnis in Fremdwährung

export function WaehrungErgebnis() {
  /*
    Die Rechnung in drei Schritten, wie im Text.

    Der Einsatz wird zum Startkurs in Dollar getauscht, die Anlage gewinnt in
    Dollar, das Ergebnis wird zum Endkurs zurückgetauscht. Der Wechselkurs
    steht dabei zweimal in der Rechnung – der Grund, warum das Ergebnis in
    Euro nichts mit dem Kursgewinn zu tun haben muss.
  */
  const dollarStart = waehrungEinsatz * waehrungKursStart
  const dollarEnde = dollarStart * (1 + waehrungKursgewinn / 100)

  const saeulen = waehrungKurse.map((kursEnde) => {
    const euro = dollarEnde / kursEnde
    const ergebnis = ((euro - waehrungEinsatz) / waehrungEinsatz) * 100
    return {
      label: formatNumber(kursEnde, 2),
      teile: [
        {
          wert: euro,
          farbe: ergebnis >= waehrungKursgewinn ? FARBEN.marke : FARBEN.warnung,
        },
      ],
      wertText: `${ergebnis >= 0 ? '+' : '−'} ${formatPercent(Math.abs(ergebnis), 1)}`,
      hinweis: formatCurrencyRounded(euro),
    }
  })

  const schlechtester = waehrungKurse[waehrungKurse.length - 1]
  const euroSchlecht = dollarEnde / schlechtester

  return (
    <SaeulenDiagramm
      id="waehrung-ergebnis"
      saeulen={saeulen}
      einheit="Ergebnis in Euro"
      hoehe={290}
      beschreibung={
        `${formatCurrencyRounded(waehrungEinsatz)} werden bei einem Kurs von ` +
        `${formatNumber(waehrungKursStart, 2)} Dollar je Euro in eine Dollaranlage gesteckt. Die Anlage ` +
        `gewinnt ${formatPercent(waehrungKursgewinn, 0)} – in Dollar. Was in Euro ankommt, hängt vom Kurs ` +
        `beim Verkauf ab: ` +
        saeulen
          .map((s) => `bei ${s.label} sind es ${s.hinweis} (${s.wertText})`)
          .join(', ') +
        `. Wertet der Euro auf ${formatNumber(schlechtester, 2)} auf, bleiben von zehn Prozent Kursgewinn ` +
        `${formatCurrencyRounded(euroSchlecht)} – der Wechselkurs hat mehr entschieden als die Anlage.`
      }
    />
  )
}

// ------------------------------------------------------------------- Hebel

export function DerivatHebel() {
  /*
    Der Hebel ist der Kehrwert der Sicherheitsleistung.

    Wer zwei Prozent hinterlegt, bewegt das Fünfzigfache seines Einsatzes.
    Gezeichnet wird nicht der Hebel selbst, sondern was er bedeutet: der
    Kursrückgang, der den Einsatz vollständig aufzehrt.
  */
  const stufen = derivatSicherheitssaetze.map((satz) => ({
    satz,
    hebel: 100 / satz,
    /* Der Einsatz ist weg, sobald der Basiswert um die Sicherheitsleistung
       fällt – bei zwei Prozent Deckung also nach zwei Prozent Kursbewegung. */
    totalverlustBei: satz,
  }))

  return (
    <BalkenDiagramm
      id="derivat-hebel"
      balken={stufen.map(({ satz, hebel, totalverlustBei }) => ({
        label: `${formatPercent(satz, 0)} Sicherheit`,
        wert: hebel,
        wertText: `Hebel ${formatNumber(hebel, 0)} · Einsatz weg bei ${formatPercent(totalverlustBei, 0)}`,
        farbe: hebel >= 10 ? FARBEN.gefahr : FARBEN.marke,
      }))}
      labelBreite={132}
      beschreibung={
        `Wie viel Sicherheitsleistung welchen Hebel ergibt, bei ${formatCurrencyRounded(derivatEinsatz)} ` +
        `Einsatz. ` +
        stufen
          .map(
            ({ satz, hebel, totalverlustBei }) =>
              `${formatPercent(satz, 0)} Sicherheit bedeuten Hebel ${formatNumber(hebel, 0)}, und der Einsatz ` +
              `ist bei ${formatPercent(totalverlustBei, 0)} Kursbewegung gegen die Position vollständig weg`
          )
          .join('; ') +
        `. Der Hebel wirkt in beide Richtungen, aber nicht symmetrisch: Nach oben ist der Gewinn offen, ` +
        `nach unten endet die Position beim Einsatz – und zwar bei einer Bewegung, die bei einer Aktie ein ` +
        `gewöhnlicher Handelstag wäre.`
      }
    />
  )
}

// -------------------------------------------------------- Einlagensicherung

/** Guthaben, an denen die Grenze vorgeführt wird – eines darunter, zwei darüber. */
const GUTHABEN = [60_000, 100_000, 180_000] as const

export function EinlagensicherungGrenze() {
  const saeulen = GUTHABEN.map((guthaben) => {
    const gesichert = Math.min(guthaben, einlagensicherungGrenze)
    const offen = guthaben - gesichert
    return {
      label: formatCurrencyRounded(guthaben),
      teile: [
        { wert: gesichert, farbe: FARBEN.marke },
        { wert: offen, farbe: FARBEN.gefahr },
      ],
      wertText: offen > 0 ? `${formatCurrencyRounded(offen)} offen` : 'voll gesichert',
      hinweis: 'bei einer Bank',
    }
  })

  const groesstes = GUTHABEN[GUTHABEN.length - 1]

  return (
    <SaeulenDiagramm
      id="einlagensicherung-grenze"
      saeulen={saeulen}
      einheit="Guthaben in Euro"
      legende={[
        { farbe: FARBEN.marke, text: 'gesetzlich gesichert' },
        { farbe: FARBEN.gefahr, text: 'nicht gesichert' },
      ]}
      hoehe={290}
      beschreibung={
        `Die gesetzliche Einlagensicherung deckt ${formatCurrencyRounded(einlagensicherungGrenze)} je Kunde ` +
        `und Bank. Bei ${formatCurrencyRounded(GUTHABEN[0])} ist damit alles gesichert. Bei ` +
        `${formatCurrencyRounded(einlagensicherungGrenze)} ebenfalls, genau bis zum letzten Euro. Bei ` +
        `${formatCurrencyRounded(groesstes)} sind ` +
        `${formatCurrencyRounded(groesstes - einlagensicherungGrenze)} nicht gedeckt – dieser Teil hinge im ` +
        `Insolvenzfall an der Masse. Die Grenze gilt je Bank, nicht je Konto: Zwei Konten bei derselben Bank ` +
        `werden zusammengezählt. Vorübergehend, etwa nach einem Hausverkauf, sind bis zu ` +
        `${formatCurrencyRounded(einlagensicherungErhoeht)} gedeckt.`
      }
    />
  )
}

// ------------------------------------------------ Gebühr gegen Spread

export function DepotOrderkosten() {
  const saeulen = ordergroessen.map((volumen) => {
    const spread = volumen * (spreadProzent / 100)
    const gesamt = ordergebuehrFest + spread
    return {
      label: formatCurrencyRounded(volumen),
      teile: [
        { wert: ordergebuehrFest, farbe: FARBEN.marke },
        { wert: spread, farbe: FARBEN.warnung },
      ],
      wertText: formatPercent((gesamt / volumen) * 100, 2),
      hinweis: `${formatCurrency(gesamt)} zusammen`,
    }
  })

  const klein = ordergroessen[0]
  const gross = ordergroessen[ordergroessen.length - 1]

  return (
    <SaeulenDiagramm
      id="depot-orderkosten"
      saeulen={saeulen}
      einheit="Kosten einer Order in Euro"
      legende={[
        { farbe: FARBEN.marke, text: 'Ordergebühr – steht auf der Abrechnung' },
        { farbe: FARBEN.warnung, text: 'Spread – steht nirgends' },
      ]}
      hoehe={300}
      beschreibung={
        `Was eine Order kostet, aufgeteilt in die beiden Blöcke: einen Festpreis von ` +
        `${formatCurrency(ordergebuehrFest)} und einen Spread von ${formatPercent(spreadProzent, 1)} des ` +
        `Volumens. Bei ${formatCurrencyRounded(klein)} überwiegt die Gebühr deutlich, und die Gesamtkosten ` +
        `betragen ${saeulen[0].wertText} des Einsatzes. Bei ${formatCurrencyRounded(gross)} ist die Gebühr ` +
        `kaum noch zu sehen; fast alles ist Spread, und die Gesamtkosten sinken auf ` +
        `${saeulen[saeulen.length - 1].wertText}. Der Block, der auf der Abrechnung steht, ist also der ` +
        `kleinere – ausgerechnet der andere lässt sich durch die Wahl von Handelsplatz und Uhrzeit ` +
        `beeinflussen.`
      }
    />
  )
}
