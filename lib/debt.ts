import {
  countryDebtRecords,
  DEBT_REFERENCE_YEAR,
  type CountryDebtRecord,
  type DebtRegion,
} from '@/data/debt'

/**
 * Service-Schicht für den Staatsverschuldungs-Vergleich.
 *
 * Beim Umstieg auf echte Daten (Eurostat- oder IWF-Schnittstelle) wird nur
 * diese Datei angepasst; die abgeleiteten Kennzahlen bleiben identisch.
 */

export type { DebtRegion } from '@/data/debt'
export { DEBT_REFERENCE_YEAR } from '@/data/debt'

/** Datensatz inklusive der berechneten Kennzahlen. */
export interface CountryDebt extends CountryDebtRecord {
  /** Schuldenstand in Milliarden Euro. */
  debtBillionsEur: number
  /** Schulden pro Einwohner in Euro. */
  debtPerCapitaEur: number
  /** BIP pro Einwohner in Euro. */
  gdpPerCapitaEur: number
}

/** Spalten, nach denen die Tabelle sortiert werden kann. */
export type DebtSortKey =
  'name' | 'debtToGdpPercent' | 'debtBillionsEur' | 'debtPerCapitaEur'

function withDerivedValues(record: CountryDebtRecord): CountryDebt {
  const debtBillionsEur = (record.gdpBillionsEur * record.debtToGdpPercent) / 100
  return {
    ...record,
    debtBillionsEur,
    // Milliarden Euro / Millionen Einwohner ergibt Tausend Euro pro Kopf.
    debtPerCapitaEur: (debtBillionsEur / record.populationMillions) * 1000,
    gdpPerCapitaEur: (record.gdpBillionsEur / record.populationMillions) * 1000,
  }
}

/** Alle Länder, absteigend nach Schuldenquote. */
export async function getCountryDebts(): Promise<CountryDebt[]> {
  return countryDebtRecords
    .map(withDerivedValues)
    .sort((a, b) => b.debtToGdpPercent - a.debtToGdpPercent)
}

/** Verfügbare Regionen für den Filter, in fester Reihenfolge. */
export async function getDebtRegions(): Promise<DebtRegion[]> {
  const order: DebtRegion[] = [
    'Eurozone',
    'EU ohne Euro',
    'Europa außerhalb der EU',
    'Amerika',
    'Asien-Pazifik',
  ]
  const present = new Set(countryDebtRecords.map((record) => record.region))
  return order.filter((region) => present.has(region))
}

export interface DebtSummary {
  countryCount: number
  referenceYear: number
  /** Ungewichteter Durchschnitt der Quoten – nicht mit einer Gesamtquote verwechseln. */
  averageDebtToGdpPercent: number
  highest: CountryDebt
  lowest: CountryDebt
  /** Land mit den höchsten Schulden pro Kopf. */
  highestPerCapita: CountryDebt
}

/** Kennzahlen für den Kopfbereich der Vergleichsseite. */
export async function getDebtSummary(): Promise<DebtSummary> {
  const countries = await getCountryDebts()
  const average =
    countries.reduce((sum, country) => sum + country.debtToGdpPercent, 0) /
    countries.length

  const byPerCapita = [...countries].sort(
    (a, b) => b.debtPerCapitaEur - a.debtPerCapitaEur
  )

  return {
    countryCount: countries.length,
    referenceYear: DEBT_REFERENCE_YEAR,
    averageDebtToGdpPercent: average,
    highest: countries[0],
    lowest: countries[countries.length - 1],
    highestPerCapita: byPerCapita[0],
  }
}
