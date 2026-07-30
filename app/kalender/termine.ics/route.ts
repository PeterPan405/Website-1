import { nurAufWunsch, terminArtMeta } from '@/data/kalender/typen'
import { baueIcs, type Termineintrag } from '@/lib/feed'
import { getTermine } from '@/lib/kalender'
import { absoluteUrl, siteConfig } from '@/lib/site'

/**
 * Der Börsenkalender zum Abonnieren.
 *
 * ## Warum als Datei und nicht als Knopf
 *
 * Ein Kalenderprogramm holt eine abonnierte Adresse in regelmäßigen Abständen
 * neu. Die Datei wird bei jedem Bau der Website erzeugt – neue Termine landen
 * damit von selbst im Kalender, ohne dass jemand etwas herunterlädt.
 *
 * ## Was hier nicht drinsteht
 *
 * Die geschätzten Dividendentermine – über achthundert der rund tausend
 * Einträge. Sie sind aus dem bisherigen Zahlungsmuster hochgerechnet, und
 * genau das ist der Grund: Ein Kalendereintrag sieht nach drei Wochen aus wie
 * ein Zahnarzttermin. Wer sie will, findet sie auf der Kalenderseite, wo der
 * Vorbehalt danebensteht.
 *
 * Was bleibt, trägt seinen Vorbehalt im Titel: Ein abgeleiteter Termin beginnt
 * mit „(erwartet)“. Im Kalender eines Fremden ist der Titel oft alles, was
 * gelesen wird.
 *
 * Route Handler sind beim statischen Export erlaubt, solange sie nur `GET`
 * anbieten und nichts aus der Anfrage lesen.
 */
export const dynamic = 'force-static'

export async function GET() {
  const alle = await getTermine()

  /*
    Dieselbe Auswahl wie auf der Kalenderseite in der Voreinstellung: alles
    außer den Arten, die nur auf Wunsch erscheinen. Die Liste dafür steht in
    `data/kalender/typen.ts` und wird nicht hier wiederholt – zwei Listen
    liefen auseinander, und dann stünde im Abo etwas anderes als auf der Seite.
  */
  const termine = alle.filter((termin) => !nurAufWunsch.includes(termin.art))

  const eintraege: Termineintrag[] = termine.map((termin) => {
    const geschaetzt = Boolean(termin.geschaetzt)
    return {
      /*
        Die Kennung muss über Läufe hinweg stabil bleiben, sonst legt das
        Kalenderprogramm bei jedem Abgleich neue Einträge an, statt die
        vorhandenen zu aktualisieren. Sie besteht deshalb aus Datum, Art und
        Titel – Angaben, die sich nicht bei jedem Bau ändern.
      */
      uid: `${termin.datum}-${termin.art}-${termin.titel}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .concat('@iminvests.de'),
      datum: termin.datum,
      bis: termin.bis,
      titel: geschaetzt ? `(erwartet) ${termin.titel}` : termin.titel,
      beschreibung: [
        termin.bedeutung,
        geschaetzt
          ? `Abgeleitet aus dem bisherigen Meldemuster – im Vorjahr am ${termin.geschaetzt?.basis}. Kein angekündigter Termin.`
          : null,
        termin.uhrzeit ? `Uhrzeit (deutsche Zeit): ${termin.uhrzeit}` : null,
        `Art: ${terminArtMeta[termin.art].label}`,
        `Quelle: ${termin.quelle.label}`,
      ]
        .filter((zeile): zeile is string => zeile !== null)
        .join('\n'),
      url: absoluteUrl('/kalender'),
    }
  })

  const datei = baueIcs(
    `${siteConfig.name} – Börsenkalender`,
    'Zinsentscheide, Berichtssaison, Verfallstage, Börsenfeiertage und Wahlen. ' +
      'Termine mit „(erwartet)“ sind abgeleitet und keine Ankündigung.',
    eintraege
  )

  return new Response(datei, {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  })
}
