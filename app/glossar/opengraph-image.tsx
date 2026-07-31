import { OG_GROESSE, OG_TYP, bereichsbild } from '@/lib/og-vorlage'

/** Vorschaubild für das Glossar. */
export const dynamic = 'force-static'

export const size = OG_GROESSE
export const contentType = OG_TYP
export const alt = 'Glossar bei IM Invests – Begriffe in einem Satz'

export default function Bild() {
  return bereichsbild({
    bereich: 'Glossar',
    titel: 'Begriffe in einem Satz',
    unterzeile: 'Nachschlagen, was in den Artikeln vorausgesetzt wird – ohne Umweg.',
    farbe: '#e0a649',
  })
}
