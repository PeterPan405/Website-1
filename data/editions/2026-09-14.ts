import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-14.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-14 00:14 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-14',
  intro:
    'Evonik schließt zwei Werke, VW meldet Rekordbestellungen beim E-Polo, Tesla nennt einen fünften Roadster-Termin – und zwei EZB-Direktoren sprechen heute.',
  top: [
    {
      headline:
        'Evonik schließt Werke in Bitterfeld und Hamburg – rund 90 Stellen betroffen',
      summary: [
        'Evonik macht laut Handelsblatt zwei Standorte dicht: 40 Arbeitsplätze in Bitterfeld, 50 in Hamburg – Grund seien zu stark fragmentierte Strukturen.',
        'Zu erwarteten Einsparungen oder Restrukturierungskosten nennt die Meldung keine Zahl.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, dass eine Standortschließung zunächst etwas über einzelne Werke aussagt – nicht automatisch über den gesamten Konzern.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['evonik'],
      sources: [
        {
          label:
            'Handelsblatt, 11.09.2026: „Chemieindustrie: Evonik schließt Standorte in Hamburg und Bitterfeld“',
          url: 'https://www.handelsblatt.com/unternehmen/industrie/chemieindustrie-evonik-schliesst-standorte-in-hamburg-und-bitterfeld/100253946.html',
        },
      ],
    },
    {
      headline: 'Zwei EZB-Direktoren sprechen heute, dann kommt Kanadas Inflation',
      summary: [
        'Isabel Schnabel spricht laut wallstreet-online um 11:15 Uhr, Piero Cipollone um 15:00 Uhr – vier Tage nach der letzten EZB-Pressekonferenz am 10. September.',
        'Um 14:30 Uhr veröffentlicht Kanada seine Verbraucherpreise für August, unabhängig von den EZB-Terminen.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Macht den Unterschied zwischen einer Notenbank-Rede ohne neuen Beschluss und einem tatsächlichen Konjunkturdatenpunkt greifbar.',
      relatedTopics: ['notenbanken-geldpolitik', 'inflation'],
      relatedSymbols: [],
      sources: [
        {
          label: 'wallstreet-online, Kommende Termine, Stand 14.09.2026, 00:15 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'VW meldet mehr als 30.000 Bestellungen für den E-Polo',
      summary: [
        'Volkswagen zählt laut finanzen.net über 30.000 Bestellungen für den E-Polo, zusammen mit Schwestermodellen mehr als 100.000 Vorbestellungen.',
        'Ausgeliefert ist bislang nur ein Teil davon – die Produktion wird laut Unternehmen erst schrittweise hochgefahren.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Erinnert daran, dass ein hoher Auftragseingang ein Nachfragesignal ist und noch kein Umsatz.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['volkswagen'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 13.09.2026: „Starke Nachfrage: VW-Aktie: Mehr als 30.000 Bestellungen für E-Polo“',
          url: 'https://www.finanzen.net/nachricht/aktien/starke-nachfrage-vw-aktie-mehr-als-30-000-bestellungen-fuer-e-polo-15931522',
        },
      ],
    },
    {
      headline: 'Tesla nennt für den Roadster bereits den fünften Termin dieses Jahres',
      summary: [
        'Tesla will den Roadster laut finanzen.net nun am 1. Oktober zeigen – nach vier zuvor genannten und verstrichenen Terminen allein in diesem Jahr.',
        'Zu Preis oder Serienstart macht das Unternehmen weiterhin keine Angabe.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, dass eine wiederholt verschobene Produktankündigung anders zu lesen ist als eine bestätigte Zahl.',
      relatedTopics: ['aktie', 'anlegerpsychologie'],
      relatedSymbols: ['tesla'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 13.09.2026: „Tesla-Aktie im Fokus: Nach langer Wartezeit endlich neuer Roadster-Termin angekündigt“',
          url: 'https://www.finanzen.net/nachricht/aktien/roadster-termin-fixiert-tesla-aktie-im-fokus-nach-langer-wartezeit-endlich-neuer-roadster-termin-angekuendigt-00-15931635',
        },
      ],
    },
    {
      headline: 'Audi-Chef spricht von großem Interesse an F1-Team-Anteilen',
      summary: [
        'Gernot Döllner sagt laut finanzen.net, das Interesse an Anteilen des Formel-1-Teams sei „sehr groß“ – Audi will trotzdem nichts überstürzen.',
        'Zu einer Bewertung des Teams oder einem möglichen Anteil nennt die Meldung keine Zahl.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Verdeutlicht, dass eine Aussage über Nachfrage keine Aussage über den Preis eines Anteils ist.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['volkswagen'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 13.09.2026: „Audi-Boss über das Interesse an Anteilen am Formel-1-Team“',
          url: 'https://www.finanzen.net/nachricht/aktien/audi-boss-ueber-das-interesse-an-anteilen-am-formel-1-team-15931668',
        },
      ],
    },
  ],
}
