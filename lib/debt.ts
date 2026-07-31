import momentaufnahme from '@/data/snapshots/laender.json'

import { laendernamen } from '@/data/laender/namen'
import { euroraum, schuldenHinweise } from '@/data/schulden-hinweise'
import { getLiveSeries } from '@/lib/market-live'

/**
 * Service-Schicht für den Staatsverschuldungs-Vergleich.
 *
 * ## Was sich hier im Juli 2026 geändert hat
 *
 * Bis dahin lagen achtzehn handgeschriebene Länder in `data/debt.ts` – der
 * letzte Demo-Datensatz dieser Website. Die Zahlen kommen jetzt aus derselben
 * Momentaufnahme, aus der auch der Globus schöpft: Schuldenquote vom IWF,
 * Bruttoinlandsprodukt und Einwohnerzahlen von der Weltbank. Aus achtzehn
 * Ländern sind damit alle geworden, für die alle drei Größen vorliegen.
 *
 * ## Die beiden Entscheidungen, die dabei zu treffen waren
 *
 * **Mit welchem Wechselkurs.** Das BIP der Weltbank steht in laufenden
 * US-Dollar des Bezugsjahres. Umgerechnet wird deshalb mit dem
 * Durchschnittskurs **desselben Jahres** und nicht mit dem heutigen: Sonst
 * stünde eine Zahl von 2023 zu einem Kurs von heute da, und die Schulden eines
 * Landes änderten sich rückwirkend, sobald der Euro schwankt. Der Kurs kommt
 * aus der EZB-Reihe im Kursbestand – dieselbe Quelle wie überall sonst.
 *
 * **Welche Regionen.** Bei fast zweihundert Ländern greift die alte Einteilung
 * aus fünf handverlesenen Gruppen nicht mehr; Afrika allein bringt fünfzig
 * Länder mit. Grundlage sind deshalb die UN-Regionen aus der Momentaufnahme,
 * ergänzt um den Euroraum als eigene Gruppe. Der ist keine geografische,
 * sondern eine währungspolitische Einheit – und genau darum geht es bei
 * Staatsschulden: Wer seine Schulden in einer Währung aufnimmt, die er nicht
 * selbst druckt, steht anders da als jemand, der es kann.
 *
 * ## Was die Quote nicht sagt
 *
 * Sie ist eine Bruttoquote: Vermögen des Staates wird nicht gegengerechnet.
 * Norwegen erscheint deshalb verschuldet, obwohl sein Staatsfonds die Schulden
 * um ein Vielfaches übersteigt. Wo eine Zahl allein in die Irre führt, steht
 * ein Satz dazu in `data/schulden-hinweise.ts`.
 */

/** Regionen des Vergleichs, in der Reihenfolge der Anzeige. */
export type DebtRegion =
  'Euroraum' | 'Übriges Europa' | 'Amerika' | 'Asien' | 'Afrika' | 'Ozeanien'

const REGIONEN: DebtRegion[] = [
  'Euroraum',
  'Übriges Europa',
  'Amerika',
  'Asien',
  'Afrika',
  'Ozeanien',
]

/** UN-Region aus der Momentaufnahme auf die Gruppen dieser Seite. */
const REGIONSNAMEN: Record<string, DebtRegion> = {
  Europe: 'Übriges Europa',
  Americas: 'Amerika',
  Asia: 'Asien',
  Africa: 'Afrika',
  Oceania: 'Ozeanien',
}

export interface CountryDebtRecord {
  /** ISO-3166-1 Alpha-3, Schlüssel der Momentaufnahme. */
  iso: string
  name: string
  region: DebtRegion
  currency: string
  /** Bruttoinlandsprodukt in Milliarden Euro. */
  gdpBillionsEur: number
  /** Schuldenstand in Prozent des BIP. */
  debtToGdpPercent: number
  /** Das Jahr, für das der IWF die Quote ausweist. */
  debtYear: number
  /** Einwohner in Millionen. */
  populationMillions: number
  /** Erklärender Hinweis, wo die Zahl allein in die Irre führt. */
  note?: string
}

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

interface Momentaufnahmeland {
  alpha2?: string
  numerisch?: string
  region?: string
  waehrung?: string
  einwohner?: number
  bipUsd?: number
  schuldenquote?: { wert: number; jahr: number }
}

interface Bestand {
  bezugsjahr: number
  quelle: { label: string; urls?: string[]; url?: string }
  schuldenQuelle: { label: string; url: string; abgrenzung: string }
  laender: Record<string, Momentaufnahmeland>
}

const daten = momentaufnahme as unknown as Bestand

/** Das Jahr, aus dem BIP und Einwohnerzahlen stammen. */
export const DEBT_REFERENCE_YEAR = daten.bezugsjahr

/** Herkunft beider Größen, für die Angabe unter der Tabelle. */
export const DEBT_QUELLEN = {
  schulden: daten.schuldenQuelle,
  wirtschaft: daten.quelle,
}

/**
 * Der Durchschnittskurs des Euro zum Dollar im Bezugsjahr.
 *
 * Gemittelt über alle Punkte der EZB-Reihe aus diesem Jahr. Für 2023 ergibt
 * das 1,0814; der amtliche Jahresdurchschnitt der EZB liegt bei 1,0813. Die
 * Abweichung stammt daher, dass die gespeicherte Reihe für zurückliegende
 * Jahre ausgedünnt ist und einen Wert je Woche führt – ein Tausendstel, und
 * für eine Größe in Milliarden ohne Belang.
 *
 * Fällt die Reihe aus, wird nicht umgerechnet und die Seite bleibt leer. Ein
 * geschätzter Wechselkurs wäre hier das Schlechteste: Er sähe aus wie eine
 * Umrechnung und wäre eine Erfindung.
 */
function eurUsdImBezugsjahr(): number | null {
  const reihe = getLiveSeries('eur-usd')
  if (!reihe) return null

  const jahr = String(DEBT_REFERENCE_YEAR)
  const werte = reihe.daily
    .filter((punkt) => punkt.t.startsWith(jahr))
    .map((punkt) => punkt.value)
    .filter((wert) => Number.isFinite(wert) && wert > 0)

  if (werte.length === 0) return null
  return werte.reduce((summe, wert) => summe + wert, 0) / werte.length
}

const UMRECHNUNGSKURS = eurUsdImBezugsjahr()

/** Der verwendete Kurs, für die Angabe unter der Tabelle. */
export const DEBT_EUR_USD = UMRECHNUNGSKURS

function baueDatensaetze(): CountryDebtRecord[] {
  if (UMRECHNUNGSKURS === null) return []

  const ergebnis: CountryDebtRecord[] = []

  for (const [iso, land] of Object.entries(daten.laender)) {
    /*
      Alle drei Größen müssen vorliegen. Ein Land mit Quote, aber ohne BIP
      erschiene sonst mit einem Schuldenstand von null Euro – eine Zahl, die
      falscher ist als eine fehlende Zeile.
    */
    if (!land.schuldenquote || !land.bipUsd || !land.einwohner) continue
    if (land.einwohner <= 0 || land.bipUsd <= 0) continue

    const name = laendernamen[iso] ?? laendernamen[land.numerisch ?? ''] ?? iso
    const region = euroraum.has(iso)
      ? ('Euroraum' as const)
      : (REGIONSNAMEN[land.region ?? ''] ?? null)
    if (!region) continue

    ergebnis.push({
      iso,
      name,
      region,
      currency: land.waehrung ?? '—',
      /*
        `bipUsd` steht in Millionen Dollar. Geteilt durch den Kurs ergibt das
        Millionen Euro, geteilt durch tausend Milliarden Euro.
      */
      gdpBillionsEur: land.bipUsd / UMRECHNUNGSKURS / 1000,
      debtToGdpPercent: land.schuldenquote.wert,
      debtYear: land.schuldenquote.jahr,
      populationMillions: land.einwohner / 1_000_000,
      ...(schuldenHinweise[iso] ? { note: schuldenHinweise[iso] } : {}),
    })
  }

  return ergebnis
}

const datensaetze = baueDatensaetze()

/**
 * Die Datensätze auch synchron, für die Lerninhalte.
 *
 * `data/learn/topics/staatsanleihe.ts` rechnet mit den Quoten dreier Länder
 * und braucht sie beim Auswerten des Moduls. Die Alternative wäre, die Zahlen
 * dort abzutippen – und genau das war der Grund, warum die Lerntabelle und die
 * Übersichtsseite ursprünglich zusammengelegt wurden.
 */
export const countryDebtRecords: readonly CountryDebtRecord[] = datensaetze

/**
 * Das Jahr, für das die meisten Quoten ausgewiesen sind.
 *
 * Nicht dasselbe wie `DEBT_REFERENCE_YEAR`: Der IWF schreibt die Schuldenquote
 * fort, die Weltbank braucht für das Bruttoinlandsprodukt länger. Wer beide
 * Jahre in einen Satz schreibt, muss wissen, welches er meint.
 */
export const DEBT_QUOTE_YEAR: number = (() => {
  const jahre = new Map<number, number>()
  for (const eintrag of datensaetze) {
    jahre.set(eintrag.debtYear, (jahre.get(eintrag.debtYear) ?? 0) + 1)
  }
  return [...jahre.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? DEBT_REFERENCE_YEAR
})()

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
  return datensaetze
    .map(withDerivedValues)
    .sort((a, b) => b.debtToGdpPercent - a.debtToGdpPercent)
}

/** Verfügbare Regionen für den Filter, in fester Reihenfolge. */
export async function getDebtRegions(): Promise<DebtRegion[]> {
  const vorhanden = new Set(datensaetze.map((record) => record.region))
  return REGIONEN.filter((region) => vorhanden.has(region))
}

export interface DebtSummary {
  countryCount: number
  referenceYear: number
  /** Das Jahr, für das die meisten Quoten ausgewiesen sind. */
  debtYear: number
  /** Ungewichteter Durchschnitt der Quoten – nicht mit einer Gesamtquote verwechseln. */
  averageDebtToGdpPercent: number
  /** Der Median – bei fast zweihundert Ländern die ehrlichere Mitte. */
  medianDebtToGdpPercent: number
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

  /*
    Der Median steht neben dem Durchschnitt, weil beide bei dieser Verteilung
    weit auseinanderliegen: Eine Handvoll Länder mit Quoten über 200 Prozent
    zieht den Durchschnitt nach oben, während die meisten deutlich darunter
    liegen. Nur den Durchschnitt zu zeigen hieße, die Mitte falsch zu
    beschreiben – bei achtzehn handverlesenen Ländern fiel das nicht ins
    Gewicht, bei allen fällt es auf.
  */
  const quoten = countries
    .map((country) => country.debtToGdpPercent)
    .sort((a, b) => a - b)
  const mitte = Math.floor(quoten.length / 2)
  const median =
    quoten.length === 0
      ? 0
      : quoten.length % 2 === 1
        ? quoten[mitte]
        : (quoten[mitte - 1] + quoten[mitte]) / 2

  const byPerCapita = [...countries].sort(
    (a, b) => b.debtPerCapitaEur - a.debtPerCapitaEur
  )

  /*
    Das Jahr der Quoten wird aus den Daten genommen und nicht gesetzt: Der IWF
    weist für die meisten Länder dasselbe Jahr aus, für einzelne ein früheres.
    Genommen wird das häufigste – und dass es überhaupt eines gibt, das nicht
    das Bezugsjahr des BIP ist, gehört auf die Seite.
  */
  const jahre = new Map<number, number>()
  for (const country of countries) {
    jahre.set(country.debtYear, (jahre.get(country.debtYear) ?? 0) + 1)
  }
  const haeufigstesJahr =
    [...jahre.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? DEBT_REFERENCE_YEAR

  return {
    countryCount: countries.length,
    referenceYear: DEBT_REFERENCE_YEAR,
    debtYear: haeufigstesJahr,
    averageDebtToGdpPercent: average,
    medianDebtToGdpPercent: median,
    highest: countries[0],
    lowest: countries[countries.length - 1],
    highestPerCapita: byPerCapita[0],
  }
}
