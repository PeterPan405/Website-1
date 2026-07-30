import { OG_GROESSE, OG_TYP, bereichsbild } from '@/lib/og-vorlage'

/** Vorschaubild für alles unter /rechner. */
export const dynamic = 'force-static'

export const size = OG_GROESSE
export const contentType = OG_TYP
export const alt = 'Rechner bei IM Invests – nachrechnen statt schätzen'

export default function Bild() {
  return bereichsbild({
    bereich: 'Rechner',
    titel: 'Nachrechnen statt schätzen',
    unterzeile:
      'Zinseszins, Kosten, Steuer und Rentenlücke – mit der Rechnung offen daneben.',
    farbe: '#aab0bc',
  })
}
