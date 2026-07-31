'use client'

import { useMemo, useState } from 'react'
import { getCalculatorDefinition } from '@/data/calculators'

import {
  CalculatorGrid,
  HeadlineResult,
  InputPanel,
  ResultPanel,
} from '@/components/calculators/CalculatorPanels'
import { NumberField } from '@/components/calculators/NumberField'
import { useErgebnisbericht } from '@/components/calculators/ErgebnisDownload'
import { nachgeladen } from '@/components/charts/nachladen'
import { Callout } from '@/components/ui/Callout'
import { Icon } from '@/components/ui/Icon'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { calculateBudget, type BudgetEntry } from '@/lib/finance'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'

/*
  Nachgeladen statt mitgeliefert: `recharts` wiegt 338 Kilobyte und lag bis
  Juli 2026 im ersten Laden jeder Rechnerseite. Die Höhe hält den Platz frei,
  damit beim Eintreffen nichts springt.
*/
const BudgetChart = nachgeladen<
  React.ComponentProps<typeof import('@/components/charts/BudgetChart').BudgetChart>
>(
  () =>
    import('@/components/charts/BudgetChart').then((m) => ({ default: m.BudgetChart })),
  300
)

/**
 * Vorbelegte Kategorien.
 *
 * Die Auswahl enthält bewusst auch die Posten, die am häufigsten vergessen
 * werden – Versicherungen, Rücklagen für jährliche Ausgaben, Abos.
 */
const initialIncomes: BudgetEntry[] = [
  { id: 'netto', label: 'Nettoeinkommen', amount: 2600 },
  { id: 'nebeneinkuenfte', label: 'Nebeneinkünfte', amount: 0 },
  { id: 'sonstiges-einkommen', label: 'Sonstiges (Kindergeld, Miete …)', amount: 0 },
]

const initialExpenses: BudgetEntry[] = [
  { id: 'wohnen', label: 'Wohnen (Miete, Nebenkosten)', amount: 950 },
  { id: 'energie', label: 'Strom, Heizung, Wasser', amount: 130 },
  { id: 'lebensmittel', label: 'Lebensmittel und Haushalt', amount: 420 },
  { id: 'mobilitaet', label: 'Mobilität (Auto, ÖPNV)', amount: 220 },
  { id: 'versicherungen', label: 'Versicherungen', amount: 120 },
  { id: 'kommunikation', label: 'Internet, Mobilfunk, Abos', amount: 75 },
  { id: 'gesundheit', label: 'Gesundheit', amount: 40 },
  { id: 'freizeit', label: 'Freizeit und Urlaub', amount: 200 },
  { id: 'ruecklagen', label: 'Rücklagen für jährliche Posten', amount: 90 },
]

export function BudgetCalculator() {
  const [incomes, setIncomes] = useState(initialIncomes)
  const [expenses, setExpenses] = useState(initialExpenses)

  const result = useMemo(() => calculateBudget(incomes, expenses), [incomes, expenses])

  useErgebnisbericht({
    titel: 'Haushaltsrechner',
    pfad: '/rechner/haushaltsrechner',
    annahmen: [
      ...incomes
        .filter((e) => e.amount !== 0)
        .map((e) => ({
          bezeichnung: `Einnahme: ${e.label}`,
          wert: formatCurrency(e.amount),
        })),
      ...expenses
        .filter((e) => e.amount !== 0)
        .map((e) => ({
          bezeichnung: `Ausgabe: ${e.label}`,
          wert: formatCurrency(e.amount),
        })),
    ],
    ergebnisse: [
      { bezeichnung: 'Bleibt übrig im Monat', wert: formatCurrency(result.balance) },
      { bezeichnung: 'Einnahmen', wert: formatCurrency(result.totalIncome) },
      { bezeichnung: 'Ausgaben', wert: formatCurrency(result.totalExpenses) },
      { bezeichnung: 'Sparquote', wert: formatPercent(result.savingsRatePercent, 1) },
      {
        bezeichnung: 'Empfohlener Notgroschen',
        wert: `${formatCurrency(result.emergencyFundRange.min)} bis ${formatCurrency(result.emergencyFundRange.max)}`,
        hinweis: 'Drei bis sechs Monatsausgaben.',
      },
    ],
    bloecke: [
      {
        titel: 'Anteil der Ausgaben',
        zeilen: result.expenseShares.map((a) => ({
          bezeichnung: a.label,
          wert: `${formatPercent(a.sharePercent, 1)} · ${formatCurrency(a.amount)}`,
        })),
      },
    ],
    grenzen: getCalculatorDefinition('haushaltsrechner')!.grenzen,
  })

  function updateEntry(
    setter: typeof setIncomes,
    entries: BudgetEntry[],
    id: string,
    amount: number
  ) {
    setter(entries.map((entry) => (entry.id === id ? { ...entry, amount } : entry)))
  }

  function reset() {
    setIncomes(initialIncomes)
    setExpenses(initialExpenses)
  }

  const positive = result.balance >= 0

  return (
    <CalculatorGrid>
      <InputPanel onReset={reset} title="Monatliche Beträge">
        <fieldset>
          <legend className="text-fg text-sm font-semibold">Einnahmen</legend>
          <div className="mt-4 space-y-4">
            {incomes.map((entry) => (
              <NumberField
                key={entry.id}
                label={entry.label}
                value={entry.amount}
                onChange={(amount) => updateEntry(setIncomes, incomes, entry.id, amount)}
                min={0}
                max={1_000_000}
                suffix="€"
                allowEmpty
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="border-border border-t pt-5">
          <legend className="text-fg text-sm font-semibold">Ausgaben</legend>
          <div className="mt-4 space-y-4">
            {expenses.map((entry) => (
              <NumberField
                key={entry.id}
                label={entry.label}
                value={entry.amount}
                onChange={(amount) =>
                  updateEntry(setExpenses, expenses, entry.id, amount)
                }
                min={0}
                max={1_000_000}
                suffix="€"
                allowEmpty
              />
            ))}
          </div>
        </fieldset>
      </InputPanel>

      <ResultPanel>
        <HeadlineResult
          label={positive ? 'Monatlicher Überschuss' : 'Monatliches Defizit'}
          value={formatCurrency(result.balance, 0)}
          tone={positive ? 'positive' : 'negative'}
          hint={
            positive
              ? `Das ist eine Sparquote von ${formatPercent(result.savingsRatePercent, 1)} deiner Einnahmen.`
              : 'Die Ausgaben liegen über den Einnahmen. Der erste Schritt ist hier nicht die Geldanlage, sondern die Ausgabenseite.'
          }
        />

        <StatGrid columns={3}>
          <Stat label="Einnahmen" value={formatCurrency(result.totalIncome, 0)} />
          <Stat label="Ausgaben" value={formatCurrency(result.totalExpenses, 0)} />
          <Stat
            label="Sparquote"
            value={formatPercent(result.savingsRatePercent, 1)}
            tone={result.savingsRatePercent >= 10 ? 'positive' : 'negative'}
            hint="Überschuss im Verhältnis zu den Einnahmen."
          />
        </StatGrid>

        <div className="fk-card p-5 sm:p-6">
          <h3 className="text-fg text-base font-semibold">Wohin das Geld geht</h3>
          <p className="text-fg-muted mt-1.5 text-sm">
            Die drei größten Posten bestimmen den Handlungsspielraum. An kleinen Beträgen
            zu sparen bringt selten so viel wie eine Änderung bei Wohnen oder Mobilität.
          </p>
          <div className="mt-6">
            <BudgetChart slices={result.expenseShares} total={result.totalExpenses} />
          </div>
        </div>

        <div className="fk-card p-5 sm:p-6">
          <h3 className="text-fg text-base font-semibold">Notgroschen</h3>
          <p className="text-fg-muted mt-1.5 text-sm leading-relaxed">
            Der Puffer richtet sich nach deinen{' '}
            <strong className="text-fg font-semibold">Ausgaben</strong>, nicht nach dem
            Einkommen – entscheidend ist, wie lange du ohne Einkommen zurechtkommst.
          </p>
          <StatGrid columns={2} className="mt-5">
            <Stat
              label="Empfohlene Höhe"
              value={`${formatCurrency(result.emergencyFundRange.min, 0)} – ${formatCurrency(
                result.emergencyFundRange.max,
                0
              )}`}
              hint="Drei bis sechs Monatsausgaben, auf dem Tagesgeldkonto."
            />
            <Stat
              label="Aufbaudauer"
              value={
                result.monthsToEmergencyFund
                  ? `${formatNumber(result.monthsToEmergencyFund, 0)} Monate`
                  : 'nicht erreichbar'
              }
              tone={result.monthsToEmergencyFund ? 'neutral' : 'negative'}
              hint={
                result.monthsToEmergencyFund
                  ? 'Bis zur Untergrenze, wenn der Überschuss vollständig gespart wird.'
                  : 'Ohne Überschuss lässt sich kein Puffer aufbauen.'
              }
            />
          </StatGrid>
        </div>

        <Callout variant="tip" title="Die einfachste Gegenprobe">
          <p>
            Vergleiche den berechneten Überschuss mit dem tatsächlichen Zuwachs deines
            Kontostands über die letzten drei Monate. Weichen die Zahlen ab, fehlen
            Positionen – fast immer sind es jährliche Posten wie Versicherungsbeiträge,
            Kfz-Steuer, Urlaub oder Reparaturen.
          </p>
        </Callout>

        <p className="border-border bg-surface-muted text-fg-muted flex items-start gap-2.5 rounded-xl border p-4 text-sm">
          <Icon name="shield" className="text-brand mt-0.5 size-4 shrink-0" />
          <span>
            Alle Eingaben werden ausschließlich in deinem Browser verarbeitet. Es findet
            keine Übertragung an einen Server und keine Speicherung statt.
          </span>
        </p>
      </ResultPanel>
    </CalculatorGrid>
  )
}
