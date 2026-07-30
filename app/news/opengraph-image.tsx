import { OG_GROESSE, OG_TYP, bereichsbild } from '@/lib/og-vorlage'

/**
 * Vorschaubild für alles unter /news.
 *
 * Auch für die einzelnen Artikel. Ein Bild je Artikel wäre eine Überlegung
 * wert – aber es gibt über 200 davon, und der Titel steht in der Vorschau
 * ohnehin daneben.
 */
export const dynamic = 'force-static'

export const size = OG_GROESSE
export const contentType = OG_TYP
export const alt = 'News bei IM Invests – die Meldung als Anlass, nicht als Inhalt'

export default function Bild() {
  return bereichsbild({
    bereich: 'News',
    titel: 'Die Meldung ist der Anlass',
    unterzeile:
      'Jeder Artikel erklärt an der Nachricht etwas, das danach dauerhaft bleibt.',
    farbe: '#8da4f0',
  })
}
