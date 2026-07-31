import { OG_GROESSE, OG_TYP, bereichsbild } from '@/lib/og-vorlage'

/** Vorschaubild für alles unter /akademie. */
export const dynamic = 'force-static'

export const size = OG_GROESSE
export const contentType = OG_TYP
export const alt = 'Akademie bei IM Invests – Verfahren statt Grundlagen'

export default function Bild() {
  return bereichsbild({
    bereich: 'Akademie',
    titel: 'Verfahren statt Grundlagen',
    unterzeile:
      'Technische und fundamentale Analyse, Portfoliotheorie, Makro und Anlegerverhalten.',
    farbe: '#f195c6',
  })
}
