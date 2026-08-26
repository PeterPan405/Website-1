import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-26.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-26 02:05 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-26',
  intro:
    'Nvidia legt heute seine Zahlen vor, am Nachmittag folgen die PCE-Inflationsdaten der Fed, dazu ein Gold-Preisrätsel und eine Siemens-Energy-Abspaltung.',
  top: [
    {
      headline: 'Nvidia legt heute die mit Spannung erwarteten Quartalszahlen vor',
      summary: [
        'Ein Ticker meldet, dass Nvidia heute sein Quartalsergebnis zum abgelaufenen Jahresviertel vorlegt.',
        'Laut einer weiteren Meldung deutet der Optionsmarkt schon vorher auf eine mögliche Kursbewegung im dreistelligen Milliardenbereich hin.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Nvidia gilt als Gradmesser für den gesamten KI-Sektor – wie der Markt die Zahlen aufnimmt, kann weit über die eigene Aktie hinaus wirken.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['nvidia'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 26.8.2026, 03:00 Uhr: „Ausblick: NVIDIA stellt Quartalsergebnis zum abgelaufenen Jahresviertel vor“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Um 14:30 Uhr steht die für die Fed wichtigste Inflationszahl an',
      summary: [
        'Der Wirtschaftskalender nennt für heute 14:30 Uhr mehrere US-Daten zum PCE-Preisindex, dem von der Fed bevorzugten Inflationsmaß.',
        'Um 12:10 Uhr spricht laut Kalender zudem EZB-Mitglied Cipollone.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Die PCE-Daten gelten für die Zinserwartungen der Fed als wichtiger als die bekanntere Verbraucherpreisrate, deshalb bewegen sie oft die Märkte stärker.',
      relatedTopics: ['inflation', 'notenbanken-geldpolitik'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'wallstreet-online.de, Wirtschaftskalender „Kommende Termine“, Abruf 26.8.2026, 02:05 Uhr GMT',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Gold steigt kräftig – nur nicht überall gleich stark',
      summary: [
        'Laut Goldreporter zieht der Goldpreis in China und Europa an, doch Shanghai bleibt zurück.',
        'Der sogenannte China-Spread fällt demnach auf minus 31 US-Dollar je Feinunze.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ein einheitlicher Weltmarktpreis gilt bei Gold nicht überall gleich stark – wer das ignoriert, unterschätzt regionale Handelsschranken.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'Goldreporter, 25. August 2026: „Goldpreis in China: Abschlag zum Westen steigt auf 31 USD“',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Siemens Energy will eine Sparte zu einem eigenen Unternehmen machen',
      summary: [
        'Mehrere Ticker melden übereinstimmend, dass Siemens Energy seine Sparte Transformation of Industry verselbstständigen will.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Abspaltung verändert, was Aktionäre am Ende im Depot halten – oft zwei Aktien statt einer, mit unterschiedlichen Geschäftsmodellen.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['siemens-energy'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 25.8.2026: „ROUNDUP: Siemens Energy will Tranformation of Industry verselbstständigen“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'AMD schießt um mehr als vier Prozent nach oben',
      summary: [
        'Ein Ticker beziffert den Kurssprung von Advanced Micro Devices auf 4,21 Prozent, im Zuge einer breiteren Erholung im Chip-Sektor.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wie unterschiedlich einzelne Werte auf dieselbe Sektorstimmung reagieren, zeigt, dass eine Branchen-Erholung nicht automatisch jede Aktie gleich stark trägt.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['amd'],
      sources: [
        {
          label:
            'wallstreet-online.de (Markt Bote), 25.8.2026: „Besonders beachtet!: Advanced Micro Devices - Aktie schießt in die Höhe +4,21 % - 25.08.2026“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Kaffeepreis erreicht ein 6-Monats-Hoch',
      summary: [
        'Ein Ticker meldet für Arabica-Kaffee ein 6-Monats-Hoch und nennt Ernteprobleme sowie ein mögliches El-Niño-Phänomen als möglichen Hintergrund.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Steigende Rohstoffpreise wandern mit der Zeit oft in die Margen von Konsumgüterkonzernen weiter – ein Kanal, den Anleger dabei im Blick behalten sollten.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['nestle', 'mcdonalds'],
      sources: [
        {
          label:
            'wallstreet-online.de, Marktüberblick, Abruf 26.8.2026, 02:05 Uhr GMT: „Arabica auf 6-Monats-Hoch – Kaffee wird zum Luxusgut? El-Niño-Chaos treibt Preise nach oben“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
