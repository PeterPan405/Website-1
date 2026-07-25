/**
 * Demo-Datensatz zur Staatsverschuldung im Ländervergleich.
 *
 * ACHTUNG: Die Zahlen sind gerundete Näherungswerte zu Demonstrationszwecken
 * und ersetzen keine amtliche Statistik. Für belastbare Angaben sind Eurostat,
 * der IWF (World Economic Outlook) oder die nationalen Statistikämter die
 * richtigen Quellen. Die Übersichtsseite weist darauf sichtbar hin.
 *
 * Gespeichert werden nur BIP und Schuldenquote. Der absolute Schuldenstand und
 * die Schulden pro Kopf werden in `lib/debt.ts` daraus berechnet – so können
 * die drei Werte nicht auseinanderlaufen.
 */

export type DebtRegion =
  'Eurozone' | 'EU ohne Euro' | 'Europa außerhalb der EU' | 'Amerika' | 'Asien-Pazifik'

export interface CountryDebtRecord {
  /** ISO-3166-1 Alpha-2, dient auch als Schlüssel. */
  iso: string
  name: string
  region: DebtRegion
  currency: string
  /** Bruttoinlandsprodukt in Milliarden Euro. */
  gdpBillionsEur: number
  /** Schuldenstand in Prozent des BIP. */
  debtToGdpPercent: number
  /** Einwohner in Millionen. */
  populationMillions: number
  /** Optionaler Hinweis, wenn die Zahl erklärungsbedürftig ist. */
  note?: string
}

/** Bezugsjahr der Näherungswerte. */
export const DEBT_REFERENCE_YEAR = 2025

export const countryDebtRecords: CountryDebtRecord[] = [
  {
    iso: 'DE',
    name: 'Deutschland',
    region: 'Eurozone',
    currency: 'EUR',
    gdpBillionsEur: 4400,
    debtToGdpPercent: 63,
    populationMillions: 84.6,
    note: 'Die Schuldenbremse im Grundgesetz begrenzt die strukturelle Neuverschuldung des Bundes.',
  },
  {
    iso: 'FR',
    name: 'Frankreich',
    region: 'Eurozone',
    currency: 'EUR',
    gdpBillionsEur: 2950,
    debtToGdpPercent: 112,
    populationMillions: 68.5,
  },
  {
    iso: 'IT',
    name: 'Italien',
    region: 'Eurozone',
    currency: 'EUR',
    gdpBillionsEur: 2200,
    debtToGdpPercent: 136,
    populationMillions: 58.9,
    note: 'Hoher Schuldenstand bei gleichzeitig langer durchschnittlicher Restlaufzeit der Anleihen.',
  },
  {
    iso: 'ES',
    name: 'Spanien',
    region: 'Eurozone',
    currency: 'EUR',
    gdpBillionsEur: 1600,
    debtToGdpPercent: 103,
    populationMillions: 48.6,
  },
  {
    iso: 'NL',
    name: 'Niederlande',
    region: 'Eurozone',
    currency: 'EUR',
    gdpBillionsEur: 1150,
    debtToGdpPercent: 44,
    populationMillions: 17.9,
  },
  {
    iso: 'BE',
    name: 'Belgien',
    region: 'Eurozone',
    currency: 'EUR',
    gdpBillionsEur: 640,
    debtToGdpPercent: 105,
    populationMillions: 11.8,
  },
  {
    iso: 'AT',
    name: 'Österreich',
    region: 'Eurozone',
    currency: 'EUR',
    gdpBillionsEur: 500,
    debtToGdpPercent: 79,
    populationMillions: 9.2,
  },
  {
    iso: 'GR',
    name: 'Griechenland',
    region: 'Eurozone',
    currency: 'EUR',
    gdpBillionsEur: 250,
    debtToGdpPercent: 154,
    populationMillions: 10.4,
    note: 'Ein großer Teil der Schulden liegt bei öffentlichen Gläubigern mit sehr langen Laufzeiten und festen Zinsen.',
  },
  {
    iso: 'PT',
    name: 'Portugal',
    region: 'Eurozone',
    currency: 'EUR',
    gdpBillionsEur: 290,
    debtToGdpPercent: 92,
    populationMillions: 10.6,
  },
  {
    iso: 'IE',
    name: 'Irland',
    region: 'Eurozone',
    currency: 'EUR',
    gdpBillionsEur: 560,
    debtToGdpPercent: 40,
    populationMillions: 5.3,
    note: 'Das irische BIP ist durch internationale Konzernstrukturen stark überhöht – die Quote sieht dadurch günstiger aus, als sie wirtschaftlich ist.',
  },
  {
    iso: 'PL',
    name: 'Polen',
    region: 'EU ohne Euro',
    currency: 'PLN',
    gdpBillionsEur: 830,
    debtToGdpPercent: 55,
    populationMillions: 36.6,
  },
  {
    iso: 'SE',
    name: 'Schweden',
    region: 'EU ohne Euro',
    currency: 'SEK',
    gdpBillionsEur: 570,
    debtToGdpPercent: 33,
    populationMillions: 10.6,
  },
  {
    iso: 'GB',
    name: 'Vereinigtes Königreich',
    region: 'Europa außerhalb der EU',
    currency: 'GBP',
    gdpBillionsEur: 3350,
    debtToGdpPercent: 101,
    populationMillions: 68.4,
  },
  {
    iso: 'CH',
    name: 'Schweiz',
    region: 'Europa außerhalb der EU',
    currency: 'CHF',
    gdpBillionsEur: 850,
    debtToGdpPercent: 38,
    populationMillions: 9.0,
  },
  {
    iso: 'US',
    name: 'Vereinigte Staaten',
    region: 'Amerika',
    currency: 'USD',
    gdpBillionsEur: 27500,
    debtToGdpPercent: 122,
    populationMillions: 336,
    note: 'Der Dollar als Weltreservewährung verschafft den USA dauerhaft besonders günstige Finanzierungsbedingungen.',
  },
  {
    iso: 'CA',
    name: 'Kanada',
    region: 'Amerika',
    currency: 'CAD',
    gdpBillionsEur: 2100,
    debtToGdpPercent: 105,
    populationMillions: 41.3,
  },
  {
    iso: 'JP',
    name: 'Japan',
    region: 'Asien-Pazifik',
    currency: 'JPY',
    gdpBillionsEur: 3900,
    debtToGdpPercent: 250,
    populationMillions: 123.3,
    note: 'Höchste Quote der Industrieländer – aber überwiegend im Inland finanziert, ein großer Teil liegt bei der eigenen Notenbank.',
  },
  {
    iso: 'CN',
    name: 'China',
    region: 'Asien-Pazifik',
    currency: 'CNY',
    gdpBillionsEur: 16500,
    debtToGdpPercent: 88,
    populationMillions: 1409,
    note: 'Zusätzlich existieren erhebliche Schulden von Provinzen und staatsnahen Unternehmen, die in dieser Kennzahl nicht enthalten sind.',
  },
]
