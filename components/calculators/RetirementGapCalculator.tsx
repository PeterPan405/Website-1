'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorGrid,
  ComparisonBars,
  HeadlineResult,
  InputPanel,
  ResultPanel,
} from '@/components/calculators/CalculatorPanels'
import { NumberField } from '@/components/calculators/NumberField'
import { Callout } from '@/components/ui/Callout'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { calculateRetirementGap } from '@/lib/finance'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'

const defaults = {
  desiredMonthlyNet: 2400,
  expectedStatutoryNet: 1400,
  otherMonthlyIncome: 0,
  yearsUntilRetirement: 25,
  yearsInRetirement: 25,
  returnRatePercent: 5,
  inflationRatePercent: 2,
  existingCapital: 10_000,
}

export function RetirementGapCalculator() {
  const [desired, setDesired] = useState(defaults.desiredMonthlyNet)
  const [statutory, setStatutory] = useState(defaults.expectedStatutoryNet)
  const [other, setOther] = useState(defaults.otherMonthlyIncome)
  const [yearsUntil, setYearsUntil] = useState(defaults.yearsUntilRetirement)
  const [yearsIn, setYearsIn] = useState(defaults.yearsInRetirement)
  const [returnRate, setReturnRate] = useState(defaults.returnRatePercent)
  const [inflation, setInflation] = useState(defaults.inflationRatePercent)
  const [existingCapital, setExistingCapital] = useState(defaults.existingCapital)

  const result = useMemo(
    () =>
      calculateRetirementGap({
        desiredMonthlyNet: desired,
        expectedStatutoryNet: statutory,
        otherMonthlyIncome: other,
        yearsUntilRetirement: yearsUntil,
        yearsInRetirement: yearsIn,
        returnRatePercent: returnRate,
        inflationRatePercent: inflation,
        existingCapital,
      }),
    [
      desired,
      statutory,
      other,
      yearsUntil,
      yearsIn,
      returnRate,
      inflation,
      existingCapital,
    ]
  )

  const hasGap = result.monthlyGapToday > 0

  function reset() {
    setDesired(defaults.desiredMonthlyNet)
    setStatutory(defaults.expectedStatutoryNet)
    setOther(defaults.otherMonthlyIncome)
    setYearsUntil(defaults.yearsUntilRetirement)
    setYearsIn(defaults.yearsInRetirement)
    setReturnRate(defaults.returnRatePercent)
    setInflation(defaults.inflationRatePercent)
    setExistingCapital(defaults.existingCapital)
  }

  return (
    <CalculatorGrid>
      <InputPanel onReset={reset}>
        <NumberField
          label="Gewünschtes Alterseinkommen (netto)"
          value={desired}
          onChange={setDesired}
          min={0}
          max={50_000}
          suffix="€/Monat"
          hint="In heutiger Kaufkraft. Als erste Orientierung dienen etwa 80 Prozent des heutigen Nettoeinkommens – wer zur Miete wohnt, liegt oft darüber."
        />
        <NumberField
          label="Erwartete gesetzliche Rente (netto)"
          value={statutory}
          onChange={setStatutory}
          min={0}
          max={50_000}
          suffix="€/Monat"
          hint="Den Wert liefert der Rentenrechner. Wichtig: netto, nicht der Bruttowert der Renteninformation."
        />
        <NumberField
          label="Weitere gesicherte Einkünfte"
          value={other}
          onChange={setOther}
          min={0}
          max={50_000}
          suffix="€/Monat"
          hint="Betriebsrente, Mieteinnahmen, private Rentenversicherung."
        />
        <NumberField
          label="Bereits vorhandenes Vorsorgevermögen"
          value={existingCapital}
          onChange={setExistingCapital}
          min={0}
          max={10_000_000}
          suffix="€"
        />

        <div className="border-border space-y-5 border-t pt-5">
          <NumberField
            label="Jahre bis zum Rentenbeginn"
            value={yearsUntil}
            onChange={setYearsUntil}
            min={1}
            max={50}
            step={1}
            decimals={0}
            suffix="Jahre"
          />
          <NumberField
            label="Erwartete Dauer des Ruhestands"
            value={yearsIn}
            onChange={setYearsIn}
            min={5}
            max={50}
            step={1}
            decimals={0}
            suffix="Jahre"
            hint="Die Rechnung unterstellt, dass das Kapital nach dieser Zeit aufgebraucht ist."
          />
          <NumberField
            label="Erwartete Rendite (nominal)"
            value={returnRate}
            onChange={setReturnRate}
            min={0}
            max={15}
            step={0.1}
            suffix="%"
          />
          <NumberField
            label="Erwartete Inflationsrate"
            value={inflation}
            onChange={setInflation}
            min={0}
            max={10}
            step={0.1}
            suffix="%"
          />
        </div>
      </InputPanel>

      <ResultPanel>
        <HeadlineResult
          label="Nötige monatliche Sparrate"
          value={formatCurrency(result.requiredMonthlySaving, 0)}
          tone={hasGap ? 'brand' : 'positive'}
          hint={
            hasGap
              ? `In heutiger Kaufkraft, um die Lücke von ${formatCurrency(
                  result.monthlyGapToday,
                  0
                )} pro Monat zu schließen. Gerechnet mit ${formatPercent(
                  result.realRatePercent,
                  2
                )} Realzins.`
              : 'Nach diesen Angaben besteht keine Rentenlücke – die erwarteten Einkünfte deckten den Bedarf bereits.'
          }
        />

        <div className="fk-card p-5 sm:p-6">
          <h3 className="text-fg text-base font-semibold">Bedarf gegen Erwartung</h3>
          <p className="text-fg-muted mt-1.5 text-sm">
            Alle Beträge pro Monat und in heutiger Kaufkraft.
          </p>
          <div className="mt-5">
            <ComparisonBars
              bars={[
                {
                  label: 'Gewünschtes Alterseinkommen',
                  value: desired,
                  display: formatCurrency(desired, 0),
                  barClass: 'bg-brand',
                },
                {
                  label: 'Erwartete gesetzliche Rente',
                  value: statutory,
                  display: formatCurrency(statutory, 0),
                  barClass: 'bg-markets',
                },
                {
                  label: 'Weitere Einkünfte',
                  value: other,
                  display: formatCurrency(other, 0),
                  barClass: 'bg-accent',
                },
                {
                  label: 'Verbleibende Lücke',
                  value: result.monthlyGapToday,
                  display: formatCurrency(result.monthlyGapToday, 0),
                  barClass: 'bg-danger',
                },
              ]}
            />
          </div>
        </div>

        <StatGrid columns={3}>
          <Stat
            label="Benötigtes Kapital"
            value={formatCurrency(result.requiredCapitalToday, 0)}
            hint="In heutiger Kaufkraft, zum Rentenbeginn verfügbar."
          />
          <Stat
            label="Davon schon gedeckt"
            value={formatCurrency(result.projectedExistingCapitalToday, 0)}
            tone="positive"
            hint="Vorhandenes Vermögen, real fortgeschrieben."
          />
          <Stat
            label="Noch aufzubauen"
            value={formatCurrency(result.remainingCapitalToday, 0)}
            tone={result.remainingCapitalToday > 0 ? 'negative' : 'positive'}
            hint="Die Basis für die Sparrate oben."
          />
        </StatGrid>

        <StatGrid columns={3}>
          <Stat
            label="Realzins"
            value={formatPercent(result.realRatePercent, 2)}
            hint={`Aus ${formatPercent(returnRate, 1)} Rendite und ${formatPercent(
              inflation,
              1
            )} Inflation.`}
          />
          <Stat
            label="Lücke zum Rentenbeginn (nominal)"
            value={formatCurrency(result.monthlyGapAtRetirement, 0)}
            hint={`Dieselbe Lücke in Euro von in ${formatNumber(yearsUntil, 0)} Jahren.`}
          />
          <Stat
            label="Zielsumme nominal"
            value={formatCurrency(result.requiredCapitalNominal, 0)}
            hint="Der Betrag, der dann auf dem Konto stehen müsste."
          />
        </StatGrid>

        <Callout variant="tip" title="Rechne mehrere Szenarien">
          <p>
            Eine einzelne Zahl ist über 25 Jahre wertlos. Aussagekräftig ist die
            Spannweite: Setze die Rendite einen Prozentpunkt niedriger, die Inflation
            einen Prozentpunkt höher und die Ruhestandsdauer fünf Jahre länger – und plane
            mit dem Ergebnis, nicht mit dem freundlichsten Fall.
          </p>
        </Callout>

        <Callout variant="info" title="Was die Rechnung nicht abbildet">
          <p>
            Nicht enthalten sind Steuern in der Entnahmephase, Produktkosten und das
            Sequenzrisiko: Schwache Renditejahre unmittelbar nach Rentenbeginn wirken
            deutlich stärker als dieselben Jahre später. Auch das Langlebigkeitsrisiko
            bleibt offen – wer länger lebt als die eingegebene Dauer, braucht mehr.
          </p>
        </Callout>
      </ResultPanel>
    </CalculatorGrid>
  )
}
