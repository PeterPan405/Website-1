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
  derivatSicherheitssaetze,
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
    />
  )
}

// ------------------------------------------------ Durchschnittskosteneffekt

export function SparplanDurchschnittspreis() {
  const kaeufe = sparplanKurse.map((kurs) => ({ kurs, anteile: sparplanRate / kurs }))

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

  return (
    <SaeulenDiagramm
      id="waehrung-ergebnis"
      saeulen={saeulen}
      einheit="Ergebnis in Euro"
      hoehe={290}
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
    />
  )
}
