import { OG_GROESSE, OG_TYP, bereichsbild } from '@/lib/og-vorlage'

/** Vorschaubild für alles unter /maerkte – Übersicht, Aktien, Branchen, Vergleich. */
export const dynamic = 'force-static'

export const size = OG_GROESSE
export const contentType = OG_TYP
export const alt = 'Märkte bei IM Invests – Kurse, Kennzahlen und Termine'

export default function Bild() {
  return bereichsbild({
    bereich: 'Märkte',
    titel: 'Kurse, Kennzahlen, Termine',
    unterzeile:
      'Aktien, Indizes, Rohstoffe und Devisen – mit der Quelle und dem Stand jeder Zahl.',
    farbe: '#4fbe86',
  })
}
