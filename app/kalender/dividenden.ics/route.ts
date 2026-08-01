import { baueIcs, type Termineintrag } from '@/lib/feed'
import { getTermine } from '@/lib/kalender'
import { absoluteUrl, siteConfig } from '@/lib/site'

/**
 * Die Dividendentermine als eigenes Kalenderabo.
 *
 * ## Warum ein zweites Abo statt eines Schalters
 *
 * Aus `termine.ics` sind die gut achthundert geschätzten Dividendentermine
 * bewusst ausgeschlossen: Wer Zinsentscheide abonniert, will nicht an jedem
 * zweiten Werktag drei Ex-Tage im Kalender stehen haben. Ein ICS-Abo kennt
 * aber keine Schalter – die Adresse **ist** die Auswahl. Wer Dividenden will,
 * abonniert also diese zweite Adresse, zusätzlich oder allein.
 *
 * ## Was ein Eintrag bedeutet – und was nicht
 *
 * Jeder Termin hier ist aus dem bisherigen Zahlungsmuster hochgerechnet, so
 * wie auf der Dividendenseite auch. Deshalb trägt ausnahmslos jeder Titel das
 * „(erwartet)“ – im fremden Kalender ist der Titel oft alles, was gelesen
 * wird. Der Tag ist der **Ex-Tag**: Wer die Aktie an diesem Tag kauft, kauft
 * sie ohne den laufenden Dividendenanspruch.
 */
export const dynamic = 'force-static'

export async function GET() {
  const alle = await getTermine()
  const dividenden = alle.filter((termin) => termin.art === 'dividende')

  const eintraege: Termineintrag[] = dividenden.map((termin) => ({
    /* Wie im Hauptkalender: stabil über Läufe, sonst legt das Programm bei
       jedem Abgleich Duplikate an. */
    uid: `${termin.datum}-${termin.art}-${termin.titel}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .concat('@iminvests.de'),
    datum: termin.datum,
    bis: termin.bis,
    titel: `(erwartet) ${termin.titel}`,
    beschreibung: [
      termin.bedeutung,
      termin.geschaetzt
        ? `Abgeleitet aus dem bisherigen Zahlungsmuster – im Vorjahr am ${termin.geschaetzt.basis}. Keine Ankündigung des Unternehmens.`
        : null,
      `Quelle: ${termin.quelle.label}`,
    ]
      .filter((zeile): zeile is string => zeile !== null)
      .join('\n'),
    url: absoluteUrl('/maerkte/dividenden'),
  }))

  const datei = baueIcs(
    `${siteConfig.name} – Dividendentermine`,
    'Erwartete Ex-Tage, hochgerechnet aus dem bisherigen Zahlungsmuster. ' +
      'Keine Ankündigungen der Unternehmen.',
    eintraege
  )

  return new Response(datei, {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  })
}
