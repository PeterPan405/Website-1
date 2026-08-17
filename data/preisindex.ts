/**
 * Verbraucherpreise und Wechselkurse als Jahresreihen.
 *
 * ## Woher die Zahlen kommen
 *
 * Beide Reihen stammen von **Eurostat** und wurden am 17. August 2026 über
 * `.github/workflows/quellen-holen.yml` abgerufen – die Entwicklungsumgebung
 * dieses Projekts erreicht nur GitHub, und eine Zahl, die niemand abgerufen
 * hat, gehört nicht in dieses Repository:
 *
 * - **Verbraucherpreise:** Datensatz `prc_hicp_aind`, Harmonisierter
 *   Verbraucherpreisindex für Deutschland, Jahresdurchschnitt, Basis 2015 =
 *   100. Stand der Daten laut Eurostat: 6. Februar 2026.
 * - **Wechselkurse:** Datensatz `ert_bil_eur_a`, Jahresdurchschnitte der
 *   Euro-Referenzkurse der EZB. Stand laut Eurostat: 8. Juli 2026.
 *
 * ## Warum Jahresdurchschnitte und keine Tagesstände
 *
 * Weil die Frage „was waren 100 € von 2015 wert?" kein Datum hat. Ein
 * Tagesstand aus dem Mai 2015 wäre eine Scheingenauigkeit: Er beantwortet
 * dieselbe Frage anders als der aus dem November, ohne dass jemand den
 * Unterschied erklären könnte. Der Jahresdurchschnitt ist die Größe, die zur
 * Frage passt.
 *
 * Beide Reihen sind **Jahresdurchschnitte**, und das ist kein Zufall: Nur so
 * lassen sich die beiden Wirkungen sauber gegeneinanderstellen. Ein
 * Preisindex als Jahresmittel neben einem Wechselkurs vom Stichtag wäre ein
 * Vergleich zweier verschiedener Dinge.
 *
 * ## Warum die Reihe nicht mitwächst
 *
 * Sie ist eine gepflegte Datei, kein Abruf. Eine Jahreszahl ändert sich
 * einmal im Jahr, und ein täglicher Abruf für einen jährlichen Wert wäre
 * Aufwand ohne Ertrag. Wenn Eurostat das Jahr 2026 veröffentlicht, kommt eine
 * Zeile dazu – bis dahin sagt der Rechner, bis wann er reicht.
 */

/** Der Bezugspunkt beider Reihen: Wo der Preisindex auf 100 steht. */
export const BASISJAHR = 2015

/**
 * Harmonisierter Verbraucherpreisindex Deutschland, Jahresdurchschnitt.
 *
 * Eurostat `prc_hicp_aind`, `geo=DE`, `coicop=CP00`, `unit=INX_A_AVG`.
 * Basis 2015 = 100.
 */
export const PREISINDEX: Readonly<Record<number, number>> = {
  1996: 75.7,
  1997: 76.9,
  1998: 77.3,
  1999: 77.8,
  2000: 78.9,
  2001: 80.4,
  2002: 81.5,
  2003: 82.4,
  2004: 83.8,
  2005: 85.5,
  2006: 87.0,
  2007: 89.0,
  2008: 91.4,
  2009: 91.6,
  2010: 92.7,
  2011: 95.0,
  2012: 97.0,
  2013: 98.6,
  2014: 99.3,
  2015: 100.0,
  2016: 100.4,
  2017: 102.1,
  2018: 104.0,
  2019: 105.5,
  2020: 105.8,
  2021: 109.2,
  2022: 118.7,
  2023: 125.9,
  2024: 129.0,
  2025: 131.9,
}

/** Eine Währung, in die umgerechnet werden kann. */
export interface Waehrung {
  code: string
  name: string
  /** Nachkommastellen der Anzeige – beim Yen wären zwei eine Scheingenauigkeit. */
  stellen: number
}

export const WAEHRUNGEN: readonly Waehrung[] = [
  { code: 'USD', name: 'US-Dollar', stellen: 2 },
  { code: 'CHF', name: 'Schweizer Franken', stellen: 2 },
  { code: 'GBP', name: 'Britisches Pfund', stellen: 2 },
  { code: 'JPY', name: 'Japanischer Yen', stellen: 0 },
]

/**
 * Wie viele Einheiten Fremdwährung ein Euro im Jahresdurchschnitt kostete.
 *
 * Eurostat `ert_bil_eur_a`, `statinfo=AVG`. Vor 1999 sind es Kurse der ECU,
 * der Rechnungseinheit, aus der der Euro hervorgegangen ist – Eurostat führt
 * beide in derselben Reihe, und für einen Kaufkraftvergleich ist das die
 * richtige Verkettung.
 */
export const WECHSELKURSE: Readonly<Record<string, Readonly<Record<number, number>>>> = {
  USD: {
    1996: 1.2697,
    1997: 1.134,
    1998: 1.1211,
    1999: 1.0658,
    2000: 0.9236,
    2001: 0.8956,
    2002: 0.9456,
    2003: 1.1312,
    2004: 1.2439,
    2005: 1.2441,
    2006: 1.2556,
    2007: 1.3705,
    2008: 1.4708,
    2009: 1.3948,
    2010: 1.3257,
    2011: 1.392,
    2012: 1.2848,
    2013: 1.3281,
    2014: 1.3285,
    2015: 1.1095,
    2016: 1.1069,
    2017: 1.1297,
    2018: 1.181,
    2019: 1.1195,
    2020: 1.1422,
    2021: 1.1827,
    2022: 1.053,
    2023: 1.0813,
    2024: 1.0824,
    2025: 1.13,
  },
  CHF: {
    1996: 1.5679,
    1997: 1.644,
    1998: 1.622,
    1999: 1.6003,
    2000: 1.5579,
    2001: 1.5105,
    2002: 1.467,
    2003: 1.5212,
    2004: 1.5438,
    2005: 1.5483,
    2006: 1.5729,
    2007: 1.6427,
    2008: 1.5874,
    2009: 1.51,
    2010: 1.3803,
    2011: 1.2326,
    2012: 1.2053,
    2013: 1.2311,
    2014: 1.2146,
    2015: 1.0679,
    2016: 1.0902,
    2017: 1.1117,
    2018: 1.155,
    2019: 1.1124,
    2020: 1.0705,
    2021: 1.0811,
    2022: 1.0047,
    2023: 0.9718,
    2024: 0.9526,
    2025: 0.937,
  },
  GBP: {
    1996: 0.8138,
    1997: 0.6923,
    1998: 0.67643,
    1999: 0.65874,
    2000: 0.60948,
    2001: 0.62187,
    2002: 0.62883,
    2003: 0.69199,
    2004: 0.67866,
    2005: 0.6838,
    2006: 0.68173,
    2007: 0.68434,
    2008: 0.79628,
    2009: 0.89094,
    2010: 0.85784,
    2011: 0.86788,
    2012: 0.81087,
    2013: 0.84926,
    2014: 0.80612,
    2015: 0.72584,
    2016: 0.81948,
    2017: 0.87667,
    2018: 0.88471,
    2019: 0.87777,
    2020: 0.8897,
    2021: 0.8596,
    2022: 0.85276,
    2023: 0.86979,
    2024: 0.84662,
    2025: 0.85679,
  },
  JPY: {
    1996: 138.08,
    1997: 137.08,
    1998: 146.41,
    1999: 121.32,
    2000: 99.47,
    2001: 108.68,
    2002: 118.06,
    2003: 130.97,
    2004: 134.44,
    2005: 136.85,
    2006: 146.02,
    2007: 161.25,
    2008: 152.45,
    2009: 130.34,
    2010: 116.24,
    2011: 110.96,
    2012: 102.49,
    2013: 129.66,
    2014: 140.31,
    2015: 134.31,
    2016: 120.2,
    2017: 126.71,
    2018: 130.4,
    2019: 122.01,
    2020: 121.85,
    2021: 129.88,
    2022: 138.03,
    2023: 151.99,
    2024: 163.85,
    2025: 169.04,
  },
}

/**
 * Der abgedeckte Zeitraum – aus den Daten gelesen, nicht danebengeschrieben.
 *
 * Eine hingeschriebene Jahreszahl wäre beim nächsten Nachtragen falsch, und
 * zwar an der Stelle, an der die Eingabefelder ihre Grenzen holen.
 */
const jahre = Object.keys(PREISINDEX).map(Number)
export const ERSTES_JAHR = Math.min(...jahre)
export const LETZTES_JAHR = Math.max(...jahre)

/** Wann die Reihen abgerufen wurden und was Eurostat als Datenstand nennt. */
export const HERKUNFT = {
  abgerufenAm: '2026-08-17',
  preise: {
    datensatz: 'prc_hicp_aind',
    bezeichnung: 'Harmonisierter Verbraucherpreisindex Deutschland, Jahresdurchschnitt',
    stand: '2026-02-06',
  },
  kurse: {
    datensatz: 'ert_bil_eur_a',
    bezeichnung: 'Euro-Referenzkurse der EZB, Jahresdurchschnitt',
    stand: '2026-07-08',
  },
} as const
