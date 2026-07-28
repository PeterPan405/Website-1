import { FARBEN, SaeulenDiagramm } from '@/components/content/figures/Diagramme'
import { calculatePension } from '@/lib/finance'
import { formatCurrencyRounded, formatNumber, formatPercent } from '@/lib/format'
import { rentenBeispiel } from '@/lib/lernszenarien'

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
