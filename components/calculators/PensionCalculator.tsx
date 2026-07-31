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
import { useErgebnisbericht } from '@/components/calculators/ErgebnisDownload'
import { Callout } from '@/components/ui/Callout'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { calculatePension, pensionDefaults } from '@/lib/finance'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'

const defaults = {
  grossAnnualIncome: 48_000,
  yearsWorked: 15,
  yearsRemaining: 25,
  additionalMonthlyPension: 0,
  averageIncome: pensionDefaults.averageIncome,
  pointValue: pensionDefaults.pointValue,
  healthInsurancePercent: pensionDefaults.healthInsurancePercent,
  taxablePercent: pensionDefaults.taxablePercent,
  personalTaxPercent: pensionDefaults.personalTaxPercent,
}

export function PensionCalculator() {
  const [grossAnnualIncome, setGrossAnnualIncome] = useState(defaults.grossAnnualIncome)
  const [yearsWorked, setYearsWorked] = useState(defaults.yearsWorked)
  const [yearsRemaining, setYearsRemaining] = useState(defaults.yearsRemaining)
  const [additional, setAdditional] = useState(defaults.additionalMonthlyPension)
  const [averageIncome, setAverageIncome] = useState(defaults.averageIncome)
  const [pointValue, setPointValue] = useState(defaults.pointValue)
  const [healthPercent, setHealthPercent] = useState(defaults.healthInsurancePercent)
  const [taxablePercent, setTaxablePercent] = useState(defaults.taxablePercent)
  const [personalTaxPercent, setPersonalTaxPercent] = useState(
    defaults.personalTaxPercent
  )

  const result = useMemo(
    () =>
      calculatePension({
        grossAnnualIncome,
        yearsWorked,
        yearsRemaining,
        additionalMonthlyPension: additional,
        averageIncome,
        pointValue,
        healthInsurancePercent: healthPercent,
        taxablePercent,
        personalTaxPercent,
      }),
    [
      grossAnnualIncome,
      yearsWorked,
      yearsRemaining,
      additional,
      averageIncome,
      pointValue,
      healthPercent,
      taxablePercent,
      personalTaxPercent,
    ]
  )

  useErgebnisbericht({
    titel: 'Rentenrechner',
    pfad: '/rechner/rentenrechner',
    annahmen: [
      { bezeichnung: 'Bruttojahreseinkommen', wert: formatCurrency(grossAnnualIncome) },
      { bezeichnung: 'Beitragsjahre bisher', wert: `${formatNumber(yearsWorked)} Jahre` },
      {
        bezeichnung: 'Beitragsjahre bis zur Rente',
        wert: `${formatNumber(yearsRemaining)} Jahre`,
      },
      { bezeichnung: 'Zusätzliche Rente monatlich', wert: formatCurrency(additional) },
      { bezeichnung: 'Durchschnittsentgelt', wert: formatCurrency(averageIncome) },
      { bezeichnung: 'Rentenwert je Punkt', wert: formatCurrency(pointValue) },
      {
        bezeichnung: 'Kranken- und Pflegeversicherung',
        wert: formatPercent(healthPercent, 2),
      },
      { bezeichnung: 'Steuerpflichtiger Anteil', wert: formatPercent(taxablePercent, 1) },
    ],
    ergebnisse: [
      {
        bezeichnung: 'Gesamte Nettorente monatlich',
        wert: formatCurrency(result.totalNetMonthly),
      },
      {
        bezeichnung: 'Gesetzliche Bruttorente',
        wert: formatCurrency(result.grossStatutoryMonthly),
      },
      {
        bezeichnung: 'Gesetzliche Nettorente',
        wert: formatCurrency(result.netStatutoryMonthly),
      },
      {
        bezeichnung: 'Rentenpunkte insgesamt',
        wert: formatNumber(result.totalPoints, 2),
      },
      {
        bezeichnung: 'Ersatzquote',
        wert: formatPercent(result.replacementRatePercent, 1),
      },
    ],
    grenzen: [
      'Eine Überschlagsrechnung, keine Rentenauskunft. Verbindlich ist allein die Renteninformation der Deutschen Rentenversicherung.',
      'Gerechnet wird mit gleichbleibendem Einkommen und gleichbleibendem Rentenwert. Beide ändern sich über die Jahre.',
      'Der Steuerabzug ist geschätzt. Die tatsächliche Steuer hängt vom Gesamteinkommen im Ruhestand ab.',
      'Zeiten für Kindererziehung, Arbeitslosigkeit, Ausbildung und Abschläge für einen vorzeitigen Beginn sind nicht enthalten.',
    ],
  })

  function reset() {
    setGrossAnnualIncome(defaults.grossAnnualIncome)
    setYearsWorked(defaults.yearsWorked)
    setYearsRemaining(defaults.yearsRemaining)
    setAdditional(defaults.additionalMonthlyPension)
    setAverageIncome(defaults.averageIncome)
    setPointValue(defaults.pointValue)
    setHealthPercent(defaults.healthInsurancePercent)
    setTaxablePercent(defaults.taxablePercent)
    setPersonalTaxPercent(defaults.personalTaxPercent)
  }

  return (
    <CalculatorGrid>
      <InputPanel onReset={reset}>
        <NumberField
          label="Aktuelles Bruttojahreseinkommen"
          value={grossAnnualIncome}
          onChange={setGrossAnnualIncome}
          min={0}
          max={1_000_000}
          suffix="€"
          hint="Der Rechner unterstellt, dass dieses Einkommen für alle Beitragsjahre gilt."
        />
        <NumberField
          label="Bereits gesammelte Beitragsjahre"
          value={yearsWorked}
          onChange={setYearsWorked}
          min={0}
          max={50}
          step={1}
          decimals={0}
          suffix="Jahre"
        />
        <NumberField
          label="Jahre bis zum Rentenbeginn"
          value={yearsRemaining}
          onChange={setYearsRemaining}
          min={0}
          max={50}
          step={1}
          decimals={0}
          suffix="Jahre"
        />
        <NumberField
          label="Zusatzrente aus bAV oder privat"
          value={additional}
          onChange={setAdditional}
          min={0}
          max={20_000}
          suffix="€/Monat"
          hint="Netto und monatlich. 0, wenn keine Zusatzversorgung besteht."
        />

        {/*
          Die Systemparameter ändern sich jährlich. Sie sind deshalb als Felder
          zugänglich und nicht fest verdrahtet.
        */}
        <details className="border-border border-t pt-5">
          <summary className="text-fg cursor-pointer text-sm font-semibold">
            Systemwerte anpassen
          </summary>
          <div className="mt-4 space-y-5">
            <NumberField
              label="Durchschnittsentgelt aller Versicherten"
              value={averageIncome}
              onChange={setAverageIncome}
              min={10_000}
              max={200_000}
              suffix="€"
              hint="Wer genau so viel verdient, erhält einen Rentenpunkt pro Jahr."
            />
            <NumberField
              label="Aktueller Rentenwert"
              value={pointValue}
              onChange={setPointValue}
              min={10}
              max={200}
              step={0.01}
              suffix="€"
              hint="Monatlicher Euro-Betrag je Rentenpunkt. Wird jährlich angepasst – aktuellen Wert prüfen."
            />
            <NumberField
              label="Kranken- und Pflegeversicherung"
              value={healthPercent}
              onChange={setHealthPercent}
              min={0}
              max={30}
              step={0.1}
              suffix="%"
            />
            <NumberField
              label="Steuerpflichtiger Anteil der Rente"
              value={taxablePercent}
              onChange={setTaxablePercent}
              min={0}
              max={100}
              step={1}
              decimals={0}
              suffix="%"
              hint="Hängt vom Jahr des Rentenbeginns ab und steigt für später beginnende Renten."
            />
            <NumberField
              label="Persönlicher Steuersatz im Ruhestand"
              value={personalTaxPercent}
              onChange={setPersonalTaxPercent}
              min={0}
              max={45}
              step={1}
              decimals={0}
              suffix="%"
              hint="Grobe Annahme. Der tatsächliche Satz ergibt sich aus allen Einkünften."
            />
          </div>
        </details>
      </InputPanel>

      <ResultPanel>
        <HeadlineResult
          label="Geschätztes monatliches Alterseinkommen (netto)"
          value={formatCurrency(result.totalNetMonthly, 0)}
          hint={`Das entspricht ${formatPercent(
            result.replacementRatePercent,
            1
          )} deines heutigen Bruttoeinkommens von ${formatCurrency(
            grossAnnualIncome / 12,
            0
          )} pro Monat.`}
        />

        <div className="fk-card p-5 sm:p-6">
          <h3 className="text-fg text-base font-semibold">Von brutto zu netto</h3>
          <p className="text-fg-muted mt-1.5 text-sm">
            Der Betrag auf der Renteninformation ist ein Bruttowert. Diese Abzüge kommen
            noch.
          </p>
          <div className="mt-5">
            <ComparisonBars
              bars={[
                {
                  label: 'Gesetzliche Bruttorente',
                  value: result.grossStatutoryMonthly,
                  display: formatCurrency(result.grossStatutoryMonthly, 0),
                  barClass: 'bg-brand',
                },
                {
                  label: 'abzüglich Kranken- und Pflegeversicherung',
                  value: result.healthDeduction,
                  display: `− ${formatCurrency(result.healthDeduction, 0)}`,
                  barClass: 'bg-warning',
                },
                {
                  label: 'abzüglich geschätzter Steuer',
                  value: result.taxDeduction,
                  display: `− ${formatCurrency(result.taxDeduction, 0)}`,
                  barClass: 'bg-danger',
                },
                {
                  label: 'Gesetzliche Nettorente',
                  value: result.netStatutoryMonthly,
                  display: formatCurrency(result.netStatutoryMonthly, 0),
                  barClass: 'bg-success',
                },
              ]}
            />
          </div>
        </div>

        <StatGrid columns={3}>
          <Stat
            label="Rentenpunkte pro Jahr"
            value={formatNumber(result.pointsPerYear, 2)}
            hint="Bei einem Punkt verdienst du genau das Durchschnittsentgelt."
          />
          <Stat
            label="Punkte insgesamt"
            value={formatNumber(result.totalPoints, 1)}
            hint={`Über ${formatNumber(yearsWorked + yearsRemaining, 0)} Beitragsjahre.`}
          />
          <Stat
            label="Ersatzquote"
            value={formatPercent(result.replacementRatePercent, 1)}
            tone={result.replacementRatePercent >= 60 ? 'positive' : 'negative'}
            hint="Nettorente im Verhältnis zum heutigen Bruttoeinkommen."
          />
        </StatGrid>

        {result.cappedAtCeiling && (
          <Callout variant="info" title="Beitragsbemessungsgrenze erreicht">
            <p>
              Dein Einkommen liegt über der Beitragsbemessungsgrenze. Auf den Teil darüber
              werden keine Rentenbeiträge erhoben – er erhöht deine Rentenpunkte deshalb
              nicht. Für dieses Einkommen ist zusätzliche private Vorsorge besonders
              relevant, weil die Ersatzquote der gesetzlichen Rente entsprechend niedriger
              ausfällt.
            </p>
          </Callout>
        )}

        <Callout variant="info" title="Was diese Zahl nicht ist">
          <p>
            Eine Größenordnung, keine Zusage. Nicht berücksichtigt sind unter anderem
            Einkommensveränderungen, Kindererziehungs- und Pflegezeiten,
            Ausbildungszeiten, Abschläge bei früherem Rentenbeginn, künftige
            Rentenanpassungen und Zeiten im Ausland.
          </p>
          <p>
            Verbindlich ist ausschließlich die Auskunft der Deutschen Rentenversicherung.
            Die Steuerschätzung ist eine vereinfachte Annahme und keine Steuerberatung.
          </p>
        </Callout>
      </ResultPanel>
    </CalculatorGrid>
  )
}
