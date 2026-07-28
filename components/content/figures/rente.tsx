import { FARBEN, SaeulenDiagramm } from '@/components/content/figures/Diagramme'
import { calculatePension, pensionDefaults } from '@/lib/finance'
import { formatCurrencyRounded, formatNumber, formatPercent } from '@/lib/format'
import {
  renteErhoehungProzent,
  renteFreibetragJahre,
  rentenBeispiel,
} from '@/lib/lernszenarien'

/**
 * Was vom heutigen Einkommen als gesetzliche Rente übrig bleibt.
 *
 * ## Warum brutto gegen brutto und die Abzüge sichtbar
 *
 * Der naheliegende Vergleich wäre Nettoeinkommen gegen Nettorente. Er
 * scheitert daran, dass das heutige Netto von Steuerklasse, Kirchensteuer und
 * Kinderfreibeträgen abhängt – jede Zahl dafür wäre geschätzt, und eine
 * geschätzte Zahl neben lauter gerechneten sieht aus wie eine gerechnete.
 *
 * Gezeigt wird deshalb das heutige Bruttoeinkommen neben der Bruttorente, und
 * die Bruttorente aufgeteilt in das, was ankommt, und das, was noch abgeht.
 * Genau das ist der Punkt des Abschnitts: Auf der Renteninformation steht der
 * obere Rand der zweiten Säule, auf dem Konto landet der untere Abschnitt.
 *
 * Alle Werte kommen aus `calculatePension` in `lib/finance.ts` – derselben
 * Funktion wie im Rentenrechner der Website und in der Tabelle daneben. Die
 * Annahmen stehen in `lib/lernszenarien.ts`.
 */

export function RenteLuecke() {
  const rechnung = calculatePension({ ...rentenBeispiel })
  const bruttoMonat = rentenBeispiel.grossAnnualIncome / 12
  const luecke = bruttoMonat - rechnung.grossStatutoryMonthly

  return (
    <SaeulenDiagramm
      id="rente-luecke"
      saeulen={[
        {
          label: 'heute',
          teile: [{ wert: bruttoMonat, farbe: FARBEN.marke }],
          wertText: formatCurrencyRounded(bruttoMonat),
          hinweis: 'Bruttoeinkommen',
        },
        {
          label: 'gesetzliche Rente',
          teile: [
            { wert: rechnung.netStatutoryMonthly, farbe: FARBEN.akzent },
            { wert: rechnung.healthDeduction, farbe: FARBEN.warnung },
            { wert: rechnung.taxDeduction, farbe: FARBEN.gefahr },
            { wert: luecke, farbe: FARBEN.flaeche },
          ],
          wertText: formatCurrencyRounded(rechnung.netStatutoryMonthly),
          hinweis: 'davon kommt an',
        },
      ]}
      einheit="Euro im Monat"
      legende={[
        { farbe: FARBEN.akzent, text: 'Nettorente' },
        { farbe: FARBEN.warnung, text: 'Kranken- und Pflegeversicherung' },
        { farbe: FARBEN.gefahr, text: 'Steuer' },
      ]}
      hoehe={300}
      beschreibung={
        `Ein Bruttoeinkommen von ${formatCurrencyRounded(rentenBeispiel.grossAnnualIncome)} im Jahr, ` +
        `${rentenBeispiel.yearsWorked} Beitragsjahre hinter sich und ${rentenBeispiel.yearsRemaining} vor sich. ` +
        `Heute sind das ${formatCurrencyRounded(bruttoMonat)} brutto im Monat. Die Bruttorente daraus beträgt ` +
        `${formatCurrencyRounded(rechnung.grossStatutoryMonthly)} – das ist der Betrag, der auf der ` +
        `Renteninformation steht. Davon gehen ${formatCurrencyRounded(rechnung.healthDeduction)} für Kranken- ` +
        `und Pflegeversicherung und rund ${formatCurrencyRounded(rechnung.taxDeduction)} Steuer ab. Es bleiben ` +
        `${formatCurrencyRounded(rechnung.netStatutoryMonthly)} im Monat, also ` +
        `${formatPercent(rechnung.replacementRatePercent, 0)} des heutigen Bruttoeinkommens, erreicht mit ` +
        `${formatNumber(rechnung.totalPoints, 1)} Rentenpunkten.`
      }
    />
  )
}

// ------------------------------------------------------ Der Rentenfreibetrag

/**
 * Warum die Steuerlast im Ruhestand steigt, ohne dass sich ein Gesetz ändert.
 *
 * ## Was hier gerechnet wird
 *
 * Im ersten vollen Rentenjahr wird der steuerfreie Anteil **als Eurobetrag**
 * festgeschrieben. Dieser Betrag bleibt danach unverändert – jede
 * Rentenerhöhung ist deshalb vollständig steuerpflichtig.
 *
 * Die Folge lässt sich vollständig hinschreiben: Die Rente wächst, der
 * Freibetrag nicht, also wächst der steuerpflichtige Teil doppelt – einmal um
 * die Erhöhung selbst und einmal um den Anteil, den der eingefrorene Freibetrag
 * verliert.
 *
 * ## Woher die Zahlen kommen
 *
 * Die Ausgangsrente und der steuerpflichtige Anteil stammen aus derselben
 * Rechnung wie die Grafik weiter oben und wie der Rentenrechner der Website
 * (`calculatePension`, `pensionDefaults`). Die jährliche Erhöhung ist eine
 * bewusst niedrig angesetzte Annahme; sie steht in `lib/lernszenarien.ts`.
 * Wären die Erhöhungen größer, fiele der gezeigte Effekt stärker aus.
 */
export function RenteFreibetrag() {
  const rechnung = calculatePension({ ...rentenBeispiel })
  const start = rechnung.grossStatutoryMonthly

  /*
    Der Freibetrag ist der steuerfreie Anteil des ersten Jahres, in Euro
    festgeschrieben. Danach ist er eine Konstante – das ist der ganze Inhalt
    dieser Grafik.
  */
  const freibetrag = start * (1 - pensionDefaults.taxablePercent / 100)

  const jahre = [0, 5, 10, renteFreibetragJahre]
  const zeilen = jahre.map((jahr) => {
    const rente = start * (1 + renteErhoehungProzent / 100) ** jahr
    return {
      jahr,
      rente,
      freibetrag,
      steuerpflichtig: rente - freibetrag,
      anteil: ((rente - freibetrag) / rente) * 100,
    }
  })

  const erstes = zeilen[0]
  const letztes = zeilen[zeilen.length - 1]

  return (
    <SaeulenDiagramm
      id="rente-freibetrag"
      einheit="Euro Bruttorente im Monat"
      hoehe={300}
      legende={[
        { farbe: FARBEN.akzent, text: 'steuerfrei – der eingefrorene Freibetrag' },
        { farbe: FARBEN.gefahr, text: 'steuerpflichtig' },
      ]}
      saeulen={zeilen.map((zeile) => ({
        label: zeile.jahr === 0 ? 'Rentenbeginn' : `nach ${zeile.jahr} Jahren`,
        teile: [
          { wert: zeile.freibetrag, farbe: FARBEN.akzent },
          { wert: zeile.steuerpflichtig, farbe: FARBEN.gefahr },
        ],
        wertText: formatCurrencyRounded(zeile.rente),
        hinweis: `${formatPercent(zeile.anteil, 0)} steuerpflichtig`,
      }))}
      beschreibung={
        `Eine Bruttorente von ${formatCurrencyRounded(start)} im Monat, die jedes Jahr um ` +
        `${formatPercent(renteErhoehungProzent, 0)} steigt – eine bewusst vorsichtige Annahme. Im ersten ` +
        `Rentenjahr sind ${formatPercent(100 - pensionDefaults.taxablePercent, 0)} steuerfrei, das sind ` +
        `${formatCurrencyRounded(freibetrag)} im Monat. Dieser Eurobetrag wird festgeschrieben und bleibt ` +
        `lebenslang gleich; er ist in jeder Säule gleich hoch. Alles darüber ist steuerpflichtig. Dadurch ` +
        `steigt der steuerpflichtige Anteil von ${formatPercent(erstes.anteil, 0)} bei Rentenbeginn auf ` +
        `${formatPercent(letztes.anteil, 0)} nach ${renteFreibetragJahre} Jahren, und die Bruttorente ` +
        `wächst dabei von ${formatCurrencyRounded(erstes.rente)} auf ` +
        `${formatCurrencyRounded(letztes.rente)}. Am Steuerrecht muss sich dafür nichts ändern. Wer nur ` +
        `mit dem Prozentsatz des ersten Jahres plant, rechnet deshalb zu optimistisch.`
      }
    />
  )
}
