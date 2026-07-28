import {
  FARBEN,
  LinienDiagramm,
  type Reihe,
} from '@/components/content/figures/Diagramme'
import { kurs, zinsschock } from '@/lib/anleihen'
import { formatCurrencyRounded, formatNumber, formatPercent } from '@/lib/format'
import {
  anleiheBeispiel,
  anleiheMarktzins,
  optionBasis,
  sequenzEntnahme,
  sequenzRenditen,
  sequenzStartkapital,
} from '@/lib/lernszenarien'
import { sensitivitaeten } from '@/lib/optionen'
import { mittlereRendite, reihenfolgevergleich } from '@/lib/sequenzrisiko'

/**
 * Grafiken für die Profi-Stufen.
 *
 * ## Warum diese Stufe eigene Grafiken braucht
 *
 * Bis hierher hatte keine einzige Profi-Stufe eine – dabei ist sie die, in der
 * am meisten gerechnet wird. Die Beispiele dort sind auch die, bei denen eine
 * Tabelle am schnellsten an ihre Grenze kommt: Ein Auszahlungsprofil, eine
 * Delta-Kurve, der Unterschied zwischen Näherung und exakter Rechnung – das
 * sind Verläufe, und Verläufe zeigen sich nicht in fünf Zeilen.
 */

// ------------------------------------------------------------ Sequenzrisiko

export function RisikoSequenz() {
  const vergleich = reihenfolgevergleich(
    sequenzStartkapital,
    sequenzRenditen,
    sequenzEntnahme
  )

  const zuPunkten = (verlauf: { jahr: number; wert: number }[]) => [
    { x: 0, y: sequenzStartkapital },
    ...verlauf.map((z) => ({ x: z.jahr, y: z.wert })),
  ]

  const reihen: Reihe[] = [
    {
      name: 'gute Jahre zuerst',
      farbe: FARBEN.marke,
      punkte: zuPunkten(vergleich.gutZuerst.verlauf),
      endText: formatCurrencyRounded(vergleich.gutZuerst.endwert),
    },
    {
      name: 'schlechte Jahre zuerst',
      farbe: FARBEN.gefahr,
      punkte: zuPunkten(vergleich.schlechtZuerst.verlauf),
      endText: formatCurrencyRounded(vergleich.schlechtZuerst.endwert),
    },
  ]

  const jahre = sequenzRenditen.length

  return (
    <LinienDiagramm
      id="risiko-sequenz"
      reihen={reihen}
      xVon={0}
      xBis={jahre}
      xTeilstriche={[0, 3, 6, 9, jahre].map((wert) => ({
        wert,
        text: wert === 0 ? 'Start' : `${wert} J.`,
      }))}
      yEinheit="Depotwert in Euro"
      hoehe={310}
      rechterRand={92}
      beschreibung={
        `Zwei Ruhestandsdepots über ${jahre} Jahre. Beide starten mit ` +
        `${formatCurrencyRounded(sequenzStartkapital)}, beide entnehmen jedes Jahr ` +
        `${formatCurrencyRounded(sequenzEntnahme)}, und beide erleben genau dieselben ` +
        `${jahre} Jahresrenditen – im Mittel ` +
        `${formatPercent(vergleich.mittlereRenditeProzent, 1)} im Jahr. Der einzige Unterschied ist die ` +
        `Reihenfolge. Wer die guten Jahre zuerst hat, steht am Ende bei ` +
        `${formatCurrencyRounded(vergleich.gutZuerst.endwert)}; wer die schlechten zuerst hat, bei ` +
        `${formatCurrencyRounded(vergleich.schlechtZuerst.endwert)} – ein Unterschied von ` +
        `${formatCurrencyRounded(vergleich.unterschied)}. Der Grund ist, dass in einem Rückgangsjahr ` +
        `Anteile billig verkauft werden müssen; die fehlen bei der späteren Erholung dauerhaft. Ohne ` +
        `Entnahme wären beide Linien am Ende deckungsgleich.`
      }
    />
  )
}

// -------------------------------------------------------------- Delta-Kurve

const KURS_VON = 60
const KURS_BIS = 140
const SCHRITTE = 80

export function OptionSensitivitaeten() {
  const kurse = Array.from(
    { length: SCHRITTE + 1 },
    (_, index) => KURS_VON + ((KURS_BIS - KURS_VON) * index) / SCHRITTE
  )

  /*
    Gezeichnet wird Delta, nicht alle vier Sensitivitäten.

    Sie haben völlig verschiedene Einheiten – Delta ist ein Anteil, Vega ein
    Eurobetrag je Prozentpunkt, Theta ein Eurobetrag je Tag. In ein Diagramm
    gezwungen ergäben sie ein Bild, das man nur mit vier Achsen lesen könnte.

    Delta allein trägt ohnehin die Aussage, um die es geht: Wie stark eine
    Option auf den Basiswert reagiert, hängt davon ab, wo der Basiswert steht.
    Und die Steigung dieser Kurve ist Gamma – es steckt also mit im Bild.
  */
  const deltaReihe = (art: 'call' | 'put', jahre: number) =>
    kurse.map((k) => ({
      x: k,
      y: sensitivitaeten(art, { ...optionBasis, kurs: k, jahre }).delta,
    }))

  const kurzeLaufzeit = 1 / 52

  const amGeld = sensitivitaeten('call', optionBasis)
  const tiefImGeld = sensitivitaeten('call', { ...optionBasis, kurs: KURS_BIS })
  const weitAusDemGeld = sensitivitaeten('call', { ...optionBasis, kurs: KURS_VON })

  return (
    <LinienDiagramm
      id="option-delta"
      reihen={[
        {
          name: `Kaufoption, ${formatNumber(optionBasis.jahre * 12, 0)} Monate`,
          farbe: FARBEN.marke,
          punkte: deltaReihe('call', optionBasis.jahre),
        },
        {
          name: 'Kaufoption, eine Woche vor Verfall',
          farbe: FARBEN.akzent,
          gestrichelt: true,
          punkte: deltaReihe('call', kurzeLaufzeit),
        },
      ]}
      xVon={KURS_VON}
      xBis={KURS_BIS}
      xTeilstriche={[60, 80, 100, 120, 140].map((wert) => ({
        wert,
        text: formatNumber(wert, 0),
      }))}
      xLabel={`Kurs des Basiswerts · Basispreis ${formatNumber(optionBasis.basispreis, 0)}`}
      yEinheit="Delta"
      yFormat={(wert) => formatNumber(wert, 1)}
      hoehe={310}
      beschreibung={
        `Das Delta einer Kaufoption über dem Kurs des Basiswerts, bei einem Basispreis von ` +
        `${formatNumber(optionBasis.basispreis, 0)}. Weit aus dem Geld liegt es nahe null ` +
        `(${formatNumber(weitAusDemGeld.delta, 2)} bei einem Kurs von ${KURS_VON}): Die Option reagiert ` +
        `kaum. Tief im Geld liegt es nahe eins (${formatNumber(tiefImGeld.delta, 2)} bei ${KURS_BIS}): ` +
        `Sie bewegt sich fast wie die Aktie selbst. Am Geld liegt es bei ` +
        `${formatNumber(amGeld.delta, 2)}. Die gestrichelte Linie zeigt dieselbe Option eine Woche vor ` +
        `Verfall – der Übergang wird zur Stufe. Genau diese Verschärfung ist das Gamma, und sie ist der ` +
        `Grund, warum eine Absicherung kurz vor Verfall dauernd nachjustiert werden muss.`
      }
    />
  )
}

// ------------------------------------------------------ Näherung und Konvexität

/** Zinsänderungen in Prozentpunkten, von deutlich fallend bis deutlich steigend. */
const AENDERUNGEN = Array.from({ length: 33 }, (_, index) => -4 + index * 0.25)

export function AnleiheKonvexitaet() {
  const punkte = AENDERUNGEN.map((aenderung) => {
    const ergebnis = zinsschock(anleiheBeispiel, anleiheMarktzins, aenderung)
    return { aenderung, ...ergebnis }
  })

  const beiPlusZwei = punkte.find((p) => p.aenderung === 2)!
  const beiMinusZwei = punkte.find((p) => p.aenderung === -2)!

  return (
    <LinienDiagramm
      id="anleihe-konvexitaet"
      reihen={[
        {
          name: 'tatsächlicher Kurs (Barwert)',
          farbe: FARBEN.marke,
          punkte: punkte.map((p) => ({ x: p.aenderung, y: p.tatsaechlichProzent })),
        },
        {
          name: 'was die Duration vorhersagt',
          farbe: FARBEN.ruhig,
          gestrichelt: true,
          punkte: punkte.map((p) => ({ x: p.aenderung, y: p.genaehertProzent })),
        },
      ]}
      xVon={-4}
      xBis={4}
      xTeilstriche={[-4, -2, 0, 2, 4].map((wert) => ({
        wert,
        text: `${wert > 0 ? '+' : ''}${formatNumber(wert, 0)}`,
      }))}
      xLabel="Zinsänderung in Prozentpunkten"
      yEinheit="Kursänderung in Prozent"
      /*
        Der Achsenboden folgt dem tiefsten tatsächlichen Wert, auf zehn
        abgerundet. Fest gesetzt wäre er nach der ersten Änderung an der
        Beispielanleihe entweder zu eng oder unnötig weit.
      */
      yMinimum={Math.floor(Math.min(...punkte.map((p) => p.genaehertProzent)) / 10) * 10}
      yFormat={(wert) => `${wert > 0 ? '+' : ''}${formatNumber(wert, 0)}`}
      nulllinie
      hoehe={310}
      beschreibung={
        `Für eine Anleihe mit ${formatPercent(anleiheBeispiel.kuponProzent, 0)} Kupon und ` +
        `${anleiheBeispiel.jahre} Jahren Restlaufzeit: die tatsächliche Kursänderung gegen das, was die ` +
        `Duration vorhersagt. Die Näherung ist eine Gerade, der wirkliche Verlauf eine Kurve – und die ` +
        `Kurve liegt auf beiden Seiten über der Geraden. Bei ` +
        `${formatNumber(2, 0)} Prozentpunkten mehr Zins fällt der Kurs um ` +
        `${formatNumber(Math.abs(beiPlusZwei.tatsaechlichProzent), 1)} Prozent statt der vorhergesagten ` +
        `${formatNumber(Math.abs(beiPlusZwei.genaehertProzent), 1)}; bei zwei Punkten weniger steigt er um ` +
        `${formatNumber(beiMinusZwei.tatsaechlichProzent, 1)} statt ` +
        `${formatNumber(beiMinusZwei.genaehertProzent, 1)}. Dieser Abstand ist die Konvexität. Sie fällt ` +
        `immer zugunsten des Anleihebesitzers aus: Es fällt weniger als gedacht und steigt mehr als ` +
        `gedacht. Die Duration allein ist deshalb keine grobe Schätzung, sondern eine systematisch ` +
        `vorsichtige.`
      }
    />
  )
}
