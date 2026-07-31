import { OG_GROESSE, OG_TYP, bereichsbild } from '@/lib/og-vorlage'

/** Vorschaubild für den Podcast. */
export const dynamic = 'force-static'

export const size = OG_GROESSE
export const contentType = OG_TYP
export const alt = 'Der Podcast von IM Invests'

export default function Bild() {
  return bereichsbild({
    bereich: 'Podcast',
    titel: 'Zum Hören statt zum Lesen',
    unterzeile:
      'Alle Folgen mit Beschreibung und Länge – abspielbar direkt auf der Seite.',
    farbe: '#4fbe86',
  })
}
