import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-17.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-17 00:17 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-17',
  intro:
    'Die Fed erhöht trotz Trump-Drucks den Leitzins, der Dow fällt, Gold zeigt zwei Gesichter – und am Donnerstag folgen Eurozone-Inflation und die Bank of England.',
  top: [
    {
      headline: 'US-Notenbank erhöht Leitzins einstimmig um 25 Basispunkte',
      summary: [
        'Die US-Notenbank Fed hat am Mittwoch unter ihrem Vorsitzenden Kevin Warsh einstimmig ihren Leitzins um 25 Basispunkte angehoben – die erste Erhöhung seit Juli 2023. Präsident Trump hatte zuvor öffentlich auf eine Zinssenkung gedrängt.',
        'Die Fed rechnet für 2026 nun mit einer höheren Inflation, und der neue Dot Plot signalisiert einen weiteren Zinsschritt noch in diesem Jahr.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Eine einstimmige Erhöhung gegen den ausdrücklichen Wunsch des Präsidenten zeigt, wie die Notenbank ihre Unabhängigkeit von der Politik gewichtet.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['dow-jones'],
      sources: [
        {
          label: 'onvista, Aktuelle News, 16.09.2026, 21:20 Uhr',
          url: 'https://www.onvista.de/news/',
        },
        {
          label: 'Goldreporter, Meldungen & Analysen vom 16. September 2026',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline: 'Donnerstag mit Euroraum-Inflation und BoE-Abstimmung',
      summary: [
        'Um 9 Uhr spricht EZB-Chefvolkswirt Philip Lane, um 11 Uhr veröffentlicht die Statistik die endgültige Kernrate der Verbraucherpreise für den Euroraum – Vorgabe im Kalender ist eine unveränderte Jahresrate von 2,4 Prozent.',
        'Um 13 Uhr folgt die Abstimmung des geldpolitischen Ausschusses der Bank of England; im Kalender stehen als Vorgabe drei Stimmen für eine Erhöhung und keine für eine Senkung.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Die Kernrate gilt als verlässlicherer Hinweis auf den zugrunde liegenden Preisdruck als die Gesamtinflation und prägt die nächste EZB-Entscheidung stärker als eine einzelne Schlagzeile.',
      relatedTopics: ['notenbanken-geldpolitik', 'inflation'],
      relatedSymbols: ['euro-stoxx-50'],
      sources: [
        {
          label: 'wallstreet-online, Wirtschaftskalender, Stand 17.09.2026, 02:17 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Dow verliert 600 Punkte, Gold zeigt zwei Vorzeichen',
      summary: [
        'Nach der Fed-Entscheidung fiel der Dow Jones laut wallstreet-online um 1,16 Prozent auf 51.478,28 Punkte, während der US Tech 100 mit minus 0,01 Prozent kaum nachgab. Brent-Rohöl verlor 2,67 Prozent auf 105,60 US-Dollar.',
        'Der Goldpreis fiel laut einer Meldung direkt nach der Entscheidung auf den tiefsten Stand seit Anfang August, zeigte in der Kursleiste derselben Seite über Nacht aber ein Plus von 0,48 Prozent auf 4.284,15 US-Dollar.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zwei unterschiedliche Vorzeichen für denselben Kurs zeigen, dass eine Prozentangabe ohne bekannten Vergleichszeitpunkt wenig über die tatsächliche Bewegung aussagt.',
      relatedTopics: ['rohstoffe', 'aktie'],
      relatedSymbols: ['dow-jones', 'gold', 'brent'],
      sources: [
        {
          label:
            'wallstreet-online, Kursleiste und Rohstoffpreise, Stand 17.09.2026, 02:17 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label: 'onvista, Aktuelle News, 16.09.2026, 20:34 Uhr',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
  ],
  further: [],
}
