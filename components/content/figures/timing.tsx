import {
  FARBEN,
  SaeulenDiagramm,
  UmbrochenerText,
} from '@/components/content/figures/Diagramme'
import { FigureSvg } from '@/components/content/figures/Rahmen'
import { formatPercent } from '@/lib/format'
import { timingAuslassungen, timingIndex } from '@/lib/lernszenarien'
import { getLiveSeries } from '@/lib/market-live'
import { ohneBestePerioden, type Kurspunkt } from '@/lib/timing'

/**
 * Was das Auslassen der besten Wochen kostet.
 *
 * ## Warum diese Grafik leer bleiben darf
 *
 * Die Kurse kommen aus der Service-Schicht, nicht aus einer Konstanten. Liegt
 * für den Index keine echte Reihe vor, gibt `getLiveSeries` `null` zurück –
 * dann wird hier nichts gezeichnet. Eine Aussage über Markttiming aus
 * Demo-Kursen wäre schlimmer als gar keine Grafik: Sie sähe genauso aus wie
 * eine belegte.
 *
 * Dieselbe Entscheidung trifft der Lerntext daneben, mit derselben Begründung.
 */

export function TimingBesteWochen() {
  const reihe = getLiveSeries(timingIndex)
  const punkte: Kurspunkt[] =
    reihe?.daily.map((punkt) => ({ d: punkt.t, c: punkt.value })) ?? []

  if (punkte.length === 0) {
    return (
      <FigureSvg
        id="timing-beste-wochen"
        viewBox="0 0 640 90"
        beschreibung="Für diesen Index liegen derzeit keine echten Kurse vor. Die Grafik bleibt deshalb leer."
      >
        <UmbrochenerText
          x={320}
          y={48}
          breite={560}
          text="Für diesen Index liegen derzeit keine echten Kurse vor. Sobald die Reihe wieder abrufbar ist, steht die Rechnung hier."
          ton="leise"
        />
      </FigureSvg>
    )
  }

  const auslassungen = ohneBestePerioden(punkte, [...timingAuslassungen])

  /*
    Negative Ergebnisse werden auf null gestellt – aber nur in der Säule.

    Eine Säule kann nicht unter die Grundlinie reichen, ohne dass die ganze
    Achse ins Negative geht; bei einer einzigen negativen Stufe wäre das
    viel Fläche für wenig Information. Der tatsächliche Wert steht deshalb
    über der Säule, mit Vorzeichen. Weggelassen wird nichts.
  */
  const saeulen = auslassungen.map((auslassung) => ({
    label:
      auslassung.ausgelassen === 0
        ? 'durchgehend dabei'
        : `ohne die ${auslassung.ausgelassen} besten`,
    teile: [
      {
        wert: Math.max(auslassung.rendite, 0),
        farbe: auslassung.ausgelassen === 0 ? FARBEN.marke : FARBEN.ruhig,
      },
    ],
    wertText: formatPercent(auslassung.rendite, 0),
  }))

  const voll = auslassungen[0]
  const ohneZehn = auslassungen.find((a) => a.ausgelassen === 10)

  return (
    <SaeulenDiagramm
      id="timing-beste-wochen"
      saeulen={saeulen}
      einheit="Gesamtrendite in Prozent"
      hoehe={280}
      beschreibung={
        `Die Gesamtrendite des ${timingIndex.toUpperCase()} über den betrachteten Zeitraum, jeweils ohne die ` +
        `besten Wochen. Wer durchgehend investiert war, erzielte ${formatPercent(voll.rendite, 1)}. ` +
        (ohneZehn
          ? `Ohne die zehn besten Wochen – von mehreren hundert – bleiben ${formatPercent(ohneZehn.rendite, 1)}. `
          : '') +
        `Die besten Wochen sind wenige und liegen fast immer unmittelbar nach den schlechtesten; wer nach ` +
        `einem Rückgang aussteigt, verpasst genau sie.`
      }
    />
  )
}
