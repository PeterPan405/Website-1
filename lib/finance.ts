/**
 * Finanzmathematik für die Rechner.
 *
 * Reine Funktionen ohne Seiteneffekte und ohne Server-Abhängigkeiten – dadurch
 * sind sie sowohl in Server- als auch in Client-Komponenten nutzbar und
 * einzeln nachvollziehbar.
 *
 * Grundsatz für alle Funktionen: Sie liefern Modellrechnungen, keine
 * Prognosen. Renditen und Inflationsraten sind Annahmen des Nutzers.
 */

import { PAUSCHALE } from '@/lib/notgroschen'

/**
 * Der Gewinn, der einen Verlust genau ausgleicht – beides in Prozent.
 *
 * Nach einem Verlust von `v` ist der Anteil `1 − v` übrig; um wieder auf den
 * Ausgangswert zu kommen, muss dieser Rest um `1 / (1 − v) − 1` steigen. Bei
 * einem Totalverlust gibt es keinen solchen Gewinn – dann kommt `null`
 * zurück, und zwar bevor jemand durch null teilt.
 *
 * Steht als Funktion und nicht als Tabelle da, weil beides sonst auseinander
 * läuft: Der Satz „minus 50 verlangt plus 100“ wird beim Umschreiben still
 * falsch, sobald jemand eine der beiden Zahlen ändert.
 */
export function recoveryGainPercent(lossPercent: number): number | null {
  const rest = 1 - lossPercent / 100
  if (rest <= 0) return null
  return (1 / rest - 1) * 100
}

/** Wie oft im Jahr eingezahlt wird. */
export type ContributionInterval = 'monthly' | 'quarterly' | 'yearly'

export const contributionIntervalLabels: Record<ContributionInterval, string> = {
  monthly: 'monatlich',
  quarterly: 'vierteljährlich',
  yearly: 'jährlich',
}

const intervalMonths: Record<ContributionInterval, number> = {
  monthly: 1,
  quarterly: 3,
  yearly: 12,
}

// ---------------------------------------------------------------- Zinsrechner

export interface CompoundInterestInput {
  /** Einmalige Anlage zu Beginn. */
  principal: number
  /** Nominaler Zinssatz pro Jahr in Prozent. */
  annualRatePercent: number
  years: number
  /** Höhe einer einzelnen Einzahlung. */
  contribution: number
  interval: ContributionInterval
  /** Einzahlung am Anfang oder Ende der Periode. */
  timing?: 'start' | 'end'
}

export interface CompoundInterestYear {
  year: number
  startBalance: number
  /** Einzahlungen dieses Jahres. */
  contributions: number
  /** Zinsen dieses Jahres. */
  interest: number
  endBalance: number
  /** Kumulierte Einzahlungen inklusive Startkapital. */
  cumulativeDeposits: number
  cumulativeInterest: number
}

export interface CompoundInterestResult {
  finalBalance: number
  /** Startkapital plus alle Einzahlungen. */
  totalDeposits: number
  totalInterest: number
  /** Anteil der Zinsen am Endkapital in Prozent. */
  interestSharePercent: number
  years: CompoundInterestYear[]
}

/**
 * Zinseszins mit optionalem Sparplan.
 *
 * Gerechnet wird monatsweise: Der Jahreszins wird durch zwölf geteilt und
 * jeden Monat auf den aktuellen Stand angewendet. Einzahlungen fließen in den
 * Monaten, die zum gewählten Intervall passen. Diese Konvention ist bei
 * Sparplänen üblich und wird auf der Rechnerseite offengelegt.
 */
export function calculateCompoundInterest(
  input: CompoundInterestInput
): CompoundInterestResult {
  const { principal, annualRatePercent, years, contribution, interval } = input
  const timing = input.timing ?? 'end'

  const monthlyRate = annualRatePercent / 100 / 12
  const step = intervalMonths[interval]
  const totalMonths = Math.round(years * 12)

  let balance = principal
  let cumulativeDeposits = principal
  let cumulativeInterest = 0

  const yearRows: CompoundInterestYear[] = []

  let yearStartBalance = balance
  let yearContributions = 0
  let yearInterest = 0

  for (let month = 1; month <= totalMonths; month += 1) {
    const isContributionMonth = contribution > 0 && (month - 1) % step === 0

    // Vorschüssig: Die Rate liegt vor der Zinsgutschrift und verzinst sich mit.
    if (isContributionMonth && timing === 'start') {
      balance += contribution
      cumulativeDeposits += contribution
      yearContributions += contribution
    }

    const interest = balance * monthlyRate
    balance += interest
    cumulativeInterest += interest
    yearInterest += interest

    // Nachschüssig: Die Rate kommt erst nach der Zinsgutschrift hinzu.
    if (isContributionMonth && timing === 'end') {
      balance += contribution
      cumulativeDeposits += contribution
      yearContributions += contribution
    }

    if (month % 12 === 0 || month === totalMonths) {
      yearRows.push({
        year: Math.ceil(month / 12),
        startBalance: yearStartBalance,
        contributions: yearContributions,
        interest: yearInterest,
        endBalance: balance,
        cumulativeDeposits,
        cumulativeInterest,
      })
      yearStartBalance = balance
      yearContributions = 0
      yearInterest = 0
    }
  }

  return {
    finalBalance: balance,
    totalDeposits: cumulativeDeposits,
    totalInterest: cumulativeInterest,
    interestSharePercent: balance > 0 ? (cumulativeInterest / balance) * 100 : 0,
    years: yearRows,
  }
}

/**
 * Kapital bei einfachem Zins – die Erträge werden jedes Jahr entnommen.
 *
 * Der Gegenpol zur Zinseszinsrechnung und nur dafür da, den Unterschied
 * zwischen beiden zeigen zu können: Das Kapital bleibt gleich, der Zuwachs ist
 * jedes Jahr derselbe Betrag.
 */
export function simpleInterestBalance(
  principal: number,
  annualRatePercent: number,
  years: number
): number {
  return principal * (1 + (annualRatePercent / 100) * years)
}

/**
 * Kapital bei jährlicher Verzinsung mit Wiederanlage – die Grundformel.
 *
 * Bewusst jährlich und nicht monatlich wie `calculateCompoundInterest`: Diese
 * Funktion bedient die Lehrbeispiele im Lernbereich, und dort steht die Formel
 * `Startkapital × (1 + Zinssatz)^Jahre` im Text daneben. Eine monatliche
 * Verzinsung ergäbe ein anderes Ergebnis als die abgedruckte Formel.
 */
export function compoundBalance(
  principal: number,
  annualRatePercent: number,
  years: number
): number {
  return principal * (1 + annualRatePercent / 100) ** years
}

/**
 * Verdopplungszeit nach der 72er-Regel.
 *
 * @returns Jahre bis zur Verdopplung, oder `null` bei einem Zinssatz von null.
 */
export function doublingTimeYears(annualRatePercent: number): number | null {
  if (annualRatePercent <= 0) return null
  return 72 / annualRatePercent
}

/** Exakte Verdopplungszeit über den Logarithmus – zum Vergleich mit der Näherung. */
export function exactDoublingTimeYears(annualRatePercent: number): number | null {
  if (annualRatePercent <= 0) return null
  return Math.log(2) / Math.log(1 + annualRatePercent / 100)
}

// ----------------------------------------------------------- Inflationsrechner

export interface InflationInput {
  amount: number
  /** Angenommene Inflationsrate pro Jahr in Prozent. */
  annualRatePercent: number
  years: number
}

export interface InflationYear {
  year: number
  /** Kaufkraft des Betrags in heutigem Geld. */
  purchasingPower: number
  /** Betrag, der später nötig ist, um heute dieselbe Menge zu kaufen. */
  requiredAmount: number
  /** Kaufkraftverlust gegenüber heute in Prozent. */
  lossPercent: number
}

export interface InflationResult {
  /** Was der Betrag nach n Jahren real noch wert ist. */
  purchasingPower: number
  /** Was man nach n Jahren braucht, um heutige Kaufkraft zu erhalten. */
  requiredAmount: number
  /** Absoluter Kaufkraftverlust. */
  absoluteLoss: number
  lossPercent: number
  /** Jahre, bis sich die Kaufkraft halbiert hat. */
  halvingYears: number | null
  years: InflationYear[]
}

export function calculateInflation(input: InflationInput): InflationResult {
  const { amount, annualRatePercent, years } = input
  const rate = annualRatePercent / 100

  const factor = (1 + rate) ** years
  const purchasingPower = factor === 0 ? amount : amount / factor
  const requiredAmount = amount * factor

  const yearRows: InflationYear[] = []
  for (let year = 1; year <= Math.round(years); year += 1) {
    const yearFactor = (1 + rate) ** year
    const power = amount / yearFactor
    yearRows.push({
      year,
      purchasingPower: power,
      requiredAmount: amount * yearFactor,
      lossPercent: amount > 0 ? ((amount - power) / amount) * 100 : 0,
    })
  }

  return {
    purchasingPower,
    requiredAmount,
    absoluteLoss: amount - purchasingPower,
    lossPercent: amount > 0 ? ((amount - purchasingPower) / amount) * 100 : 0,
    // Gleiche Logik wie die 72er-Regel, nur in die andere Richtung.
    halvingYears: rate > 0 ? Math.log(2) / Math.log(1 + rate) : null,
    years: yearRows,
  }
}

/** Exakter Realzins – nicht die Differenz, sondern der Quotient. */
export function realRatePercent(
  nominalRatePercent: number,
  inflationRatePercent: number
): number {
  const nominal = 1 + nominalRatePercent / 100
  const inflation = 1 + inflationRatePercent / 100
  return (nominal / inflation - 1) * 100
}

// ------------------------------------------------------------- Rentenrechner

/**
 * Näherungswerte des deutschen Rentensystems.
 *
 * Diese Zahlen ändern sich jährlich. Sie sind hier als anpassbare Vorbelegung
 * hinterlegt und werden auf der Rechnerseite als Eingabefelder angeboten, damit
 * die Rechnung mit aktuellen Werten möglich bleibt.
 */
export interface PensionSystemDefaults {
  /** Durchschnittliches Bruttojahresentgelt aller Versicherten, in Euro. */
  averageIncome: number
  /** Monatlicher Rentenwert je Rentenpunkt, in Euro. */
  pointValue: number
  /** Beitragsbemessungsgrenze West, jährlich, in Euro. */
  contributionCeiling: number
  /** Beitragssatz zur Kranken- und Pflegeversicherung auf Renten, in Prozent. */
  healthInsurancePercent: number
  /** Anteil der Rente, der steuerpflichtig ist, in Prozent. */
  taxablePercent: number
  /** Angenommener persönlicher Steuersatz im Ruhestand, in Prozent. */
  personalTaxPercent: number
}

/**
 * Der Typ ist bewusst `number` und nicht `as const`: Die Werte sind
 * Vorbelegungen für Eingabefelder und werden vom Nutzer überschrieben.
 */
export const pensionDefaults: PensionSystemDefaults = {
  averageIncome: 50500,
  pointValue: 40.79,
  contributionCeiling: 96600,
  healthInsurancePercent: 11.6,
  taxablePercent: 85,
  personalTaxPercent: 12,
}

export interface PensionInput {
  /** Aktuelles Bruttojahreseinkommen. */
  grossAnnualIncome: number
  /** Bereits gesammelte Beitragsjahre. */
  yearsWorked: number
  /** Verbleibende Jahre bis zum Rentenbeginn. */
  yearsRemaining: number
  /** Bereits erworbene Rentenpunkte, falls aus der Renteninformation bekannt. */
  existingPoints?: number
  /** Monatliche Zusatzrente aus betrieblicher oder privater Vorsorge. */
  additionalMonthlyPension?: number
  averageIncome?: number
  pointValue?: number
  contributionCeiling?: number
  healthInsurancePercent?: number
  taxablePercent?: number
  personalTaxPercent?: number
}

export interface PensionResult {
  /** Rentenpunkte pro Beitragsjahr beim aktuellen Einkommen. */
  pointsPerYear: number
  totalPoints: number
  /** Monatliche Bruttorente aus der gesetzlichen Versicherung. */
  grossStatutoryMonthly: number
  /** Abzug für Kranken- und Pflegeversicherung. */
  healthDeduction: number
  /** Geschätzter Steuerabzug. */
  taxDeduction: number
  /** Geschätzte gesetzliche Nettorente. */
  netStatutoryMonthly: number
  /** Nettorente inklusive Zusatzversorgung. */
  totalNetMonthly: number
  /** Nettorente in Prozent des heutigen Bruttoeinkommens. */
  replacementRatePercent: number
  /** Hinweis, ob das Einkommen die Beitragsbemessungsgrenze übersteigt. */
  cappedAtCeiling: boolean
}

/**
 * Grobe Schätzung des Alterseinkommens.
 *
 * Absichtlich vereinfacht: konstantes Einkommen, konstanter Rentenwert, keine
 * Berücksichtigung von Kindererziehungszeiten, Abschlägen oder künftigen
 * Rentenanpassungen. Das Ergebnis ist eine Größenordnung, keine Zusage – die
 * verbindliche Auskunft erteilt ausschließlich die Deutsche Rentenversicherung.
 */
export function calculatePension(input: PensionInput): PensionResult {
  const averageIncome = input.averageIncome ?? pensionDefaults.averageIncome
  const pointValue = input.pointValue ?? pensionDefaults.pointValue
  const ceiling = input.contributionCeiling ?? pensionDefaults.contributionCeiling
  const healthPercent =
    input.healthInsurancePercent ?? pensionDefaults.healthInsurancePercent
  const taxablePercent = input.taxablePercent ?? pensionDefaults.taxablePercent
  const personalTaxPercent =
    input.personalTaxPercent ?? pensionDefaults.personalTaxPercent

  // Über der Beitragsbemessungsgrenze werden keine weiteren Punkte erworben.
  const cappedAtCeiling = input.grossAnnualIncome > ceiling
  const relevantIncome = Math.min(input.grossAnnualIncome, ceiling)
  const pointsPerYear = averageIncome > 0 ? relevantIncome / averageIncome : 0

  const totalPoints =
    typeof input.existingPoints === 'number'
      ? input.existingPoints + pointsPerYear * input.yearsRemaining
      : pointsPerYear * (input.yearsWorked + input.yearsRemaining)

  const grossStatutoryMonthly = totalPoints * pointValue
  const healthDeduction = grossStatutoryMonthly * (healthPercent / 100)
  const taxableBase = grossStatutoryMonthly * (taxablePercent / 100)
  const taxDeduction = taxableBase * (personalTaxPercent / 100)
  const netStatutoryMonthly = grossStatutoryMonthly - healthDeduction - taxDeduction

  const additional = input.additionalMonthlyPension ?? 0
  const totalNetMonthly = netStatutoryMonthly + additional
  const monthlyGrossIncome = input.grossAnnualIncome / 12

  return {
    pointsPerYear,
    totalPoints,
    grossStatutoryMonthly,
    healthDeduction,
    taxDeduction,
    netStatutoryMonthly,
    totalNetMonthly,
    replacementRatePercent:
      monthlyGrossIncome > 0 ? (totalNetMonthly / monthlyGrossIncome) * 100 : 0,
    cappedAtCeiling,
  }
}

// ------------------------------------------------------------- Rentenlücke

export interface RetirementGapInput {
  /** Gewünschtes monatliches Netto-Alterseinkommen in heutiger Kaufkraft. */
  desiredMonthlyNet: number
  /** Erwartete gesetzliche Nettorente in heutiger Kaufkraft. */
  expectedStatutoryNet: number
  /** Weitere gesicherte Einkünfte in heutiger Kaufkraft. */
  otherMonthlyIncome: number
  yearsUntilRetirement: number
  /** Erwartete Dauer des Ruhestands in Jahren. */
  yearsInRetirement: number
  /** Erwartete Nominalrendite der Anlage in Prozent. */
  returnRatePercent: number
  /** Erwartete Inflationsrate in Prozent. */
  inflationRatePercent: number
  /** Bereits vorhandenes Vorsorgevermögen. */
  existingCapital?: number
}

export interface RetirementGapResult {
  /** Monatliche Lücke in heutiger Kaufkraft. */
  monthlyGapToday: number
  /** Dieselbe Lücke, ausgedrückt in Euro zum Rentenbeginn. */
  monthlyGapAtRetirement: number
  /** Benötigtes Kapital zum Rentenbeginn, in heutiger Kaufkraft. */
  requiredCapitalToday: number
  /** Benötigtes Kapital zum Rentenbeginn, nominal. */
  requiredCapitalNominal: number
  /** Was das vorhandene Vermögen davon abdeckt, in heutiger Kaufkraft. */
  projectedExistingCapitalToday: number
  /** Verbleibende Kapitallücke in heutiger Kaufkraft. */
  remainingCapitalToday: number
  /** Nötige monatliche Sparrate in heutiger Kaufkraft. */
  requiredMonthlySaving: number
  /** Verwendeter realer Zinssatz pro Jahr in Prozent. */
  realRatePercent: number
}

/**
 * Rentenlücke und nötige Sparrate.
 *
 * Gerechnet wird durchgehend in **heutiger Kaufkraft**: Alle Beträge sind mit
 * dem realen Zinssatz bewertet. Das vermeidet die häufigste Fehlerquelle solcher
 * Rechnungen – große nominale Endsummen, deren Wert niemand einschätzen kann.
 * Die nominale Zielsumme wird zusätzlich ausgegeben.
 */
export function calculateRetirementGap(input: RetirementGapInput): RetirementGapResult {
  const monthlyGapToday = Math.max(
    0,
    input.desiredMonthlyNet - input.expectedStatutoryNet - input.otherMonthlyIncome
  )

  const inflationFactor =
    (1 + input.inflationRatePercent / 100) ** input.yearsUntilRetirement
  const real = realRatePercent(input.returnRatePercent, input.inflationRatePercent) / 100
  const monthlyReal = real / 12
  const retirementMonths = Math.round(input.yearsInRetirement * 12)

  // Barwert einer nachschüssigen Rente über die Dauer des Ruhestands.
  const requiredCapitalToday =
    Math.abs(monthlyReal) < 1e-9
      ? monthlyGapToday * retirementMonths
      : (monthlyGapToday * (1 - (1 + monthlyReal) ** -retirementMonths)) / monthlyReal

  const existingCapital = input.existingCapital ?? 0
  // Vorhandenes Kapital wächst real, bleibt aber in heutiger Kaufkraft bewertet.
  const projectedExistingCapitalToday =
    existingCapital * (1 + real) ** input.yearsUntilRetirement

  const remainingCapitalToday = Math.max(
    0,
    requiredCapitalToday - projectedExistingCapitalToday
  )

  // Sparrate aus der umgestellten Sparplanformel.
  const savingMonths = Math.round(input.yearsUntilRetirement * 12)
  let requiredMonthlySaving = 0
  if (savingMonths > 0 && remainingCapitalToday > 0) {
    requiredMonthlySaving =
      Math.abs(monthlyReal) < 1e-9
        ? remainingCapitalToday / savingMonths
        : (remainingCapitalToday * monthlyReal) / ((1 + monthlyReal) ** savingMonths - 1)
  }

  return {
    monthlyGapToday,
    monthlyGapAtRetirement: monthlyGapToday * inflationFactor,
    requiredCapitalToday,
    requiredCapitalNominal: requiredCapitalToday * inflationFactor,
    projectedExistingCapitalToday,
    remainingCapitalToday,
    requiredMonthlySaving,
    realRatePercent: real * 100,
  }
}

// ---------------------------------------------------------- Haushaltsrechner

export interface BudgetEntry {
  id: string
  label: string
  amount: number
}

export interface BudgetResult {
  totalIncome: number
  totalExpenses: number
  /** Was am Monatsende übrig bleibt (kann negativ sein). */
  balance: number
  /** Sparquote in Prozent der Einnahmen. */
  savingsRatePercent: number
  /** Empfohlener Notgroschen: drei bis sechs Monatsausgaben. */
  emergencyFundRange: { min: number; max: number }
  /** Anteil jeder Ausgabenposition an den Gesamtausgaben, in Prozent. */
  expenseShares: { label: string; amount: number; sharePercent: number }[]
  /** Monate, die der Überschuss braucht, um den Notgroschen aufzubauen. */
  monthsToEmergencyFund: number | null
}

export function calculateBudget(
  incomes: readonly BudgetEntry[],
  expenses: readonly BudgetEntry[]
): BudgetResult {
  const totalIncome = incomes.reduce((sum, entry) => sum + entry.amount, 0)
  const totalExpenses = expenses.reduce((sum, entry) => sum + entry.amount, 0)
  const balance = totalIncome - totalExpenses

  /*
    Die Faustregel steht in `lib/notgroschen.ts`, nicht hier.

    Dort ist sie der Ausgangspunkt einer begründeten Spanne; hier bleibt sie
    die grobe Angabe im Haushaltsrechner. Zweimal dieselben Zahlen
    hinzuschreiben hieße, dass sie auseinanderlaufen können – und dann stünden
    auf zwei Seiten derselben Website zwei Empfehlungen.
  */
  const emergencyFundRange = {
    min: totalExpenses * PAUSCHALE.min,
    max: totalExpenses * PAUSCHALE.max,
  }

  return {
    totalIncome,
    totalExpenses,
    balance,
    savingsRatePercent: totalIncome > 0 ? (balance / totalIncome) * 100 : 0,
    emergencyFundRange,
    expenseShares: expenses
      .filter((entry) => entry.amount > 0)
      .map((entry) => ({
        label: entry.label,
        amount: entry.amount,
        sharePercent: totalExpenses > 0 ? (entry.amount / totalExpenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount),
    monthsToEmergencyFund:
      balance > 0 ? Math.ceil(emergencyFundRange.min / balance) : null,
  }
}
