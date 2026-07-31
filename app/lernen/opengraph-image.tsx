import { OG_GROESSE, OG_TYP, bereichsbild } from '@/lib/og-vorlage'

/**
 * Vorschaubild für alles unter /lernen.
 *
 * Next zieht die Datei aus dem nächstgelegenen Segment: Sie gilt damit für die
 * Übersicht, alle 34 Themen, alle Stufen und die Lernpfade – ein Bild, kein
 * Bild je Seite. Warum das so gewählt ist, steht in `lib/og-vorlage.tsx`.
 */
export const dynamic = 'force-static'

export const size = OG_GROESSE
export const contentType = OG_TYP
export const alt = 'Lernen bei IM Invests – Finanzwissen in drei Stufen'

export default function Bild() {
  return bereichsbild({
    bereich: 'Lernen',
    titel: 'Finanzwissen in drei Stufen',
    unterzeile: 'Vom Begriff bis zum Sonderfall – mit Wissenscheck und Erklärgrafiken.',
    farbe: '#e0a649',
  })
}
