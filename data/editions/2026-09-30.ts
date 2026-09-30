import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-30.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-30 00:17 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-30',
  intro:
    'Die Anleiherenditen steigen trotz fallendem Ölpreis, der Euro fällt auf ein Mehrmonatstief, und vor den US-Inflationsdaten wächst die Nervosität am Markt.',
  top: [
    {
      headline: 'Anleiherenditen steigen trotz fallendem Ölpreis',
      summary: [
        'Der Ölpreis ist am Dienstag deutlich gefallen. Brent notierte am Mittwochmorgen bei 95,67 Dollar, rund drei Prozent leichter als am Vortag.',
        'Geholfen hat das der Wall Street kaum. Die Rendite zehnjähriger US-Anleihen stieg trotzdem weiter. Zuvor hatte der Dow Jones bereits nachgegeben, am Ende bewegte sich wenig.',
        'In Frankfurt rettete der Dax ein knappes Plus ins Ziel. Der EuroStoxx 50 schloss im Plus, der Wiener ATX verlor gut ein Prozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Anleihen und Aktien konkurrieren um dasselbe Anlegergeld: Eine höhere risikolose Rendite macht Aktien im Vergleich weniger attraktiv, unabhängig vom Ölpreis.',
      relatedTopics: ['staatsanleihe', 'risiko-und-rendite'],
      relatedSymbols: ['brent', 'dow-jones', 'dax'],
      sources: [
        {
          label: 'onvista.de, News-Ticker vom 29.09.2026, 20:18 Uhr',
          url: 'https://www.onvista.de/news/',
        },
        {
          label: 'wallstreet-online.de, Rohstoffkurse, Stand 30.09.2026, 02:16 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Euro fällt auf tiefsten Stand seit Mai 2025',
      summary: [
        'Der Euro ist zum Dollar auf den tiefsten Stand seit Mai 2025 gefallen. Am Mittwochmorgen kostete ein Euro noch 1,1338 Dollar.',
        'Der Mittwoch bringt zwei weitere Termine. Um 4:20 Uhr spricht EZB-Direktoriumsmitglied Elderson. Im Tagesverlauf folgen in den USA die PCE-Inflationsdaten, das bevorzugte Preismaß der Notenbank Fed.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Der PCE-Index gilt als das Inflationsmaß, dem die Fed selbst den größten Wert beimisst, mehr als dem bekannteren Verbraucherpreisindex CPI.',
      relatedTopics: ['notenbanken-geldpolitik', 'waehrungen-wechselkurse'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label: 'wallstreet-online.de, Devisennachrichten vom 29.09.2026',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label: 'wallstreet-online.de, Wirtschaftskalender, Stand 30.09.2026, 00:17 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'BASF könnte Evonik-Angebot auf 24 Euro erhöhen',
      summary: [
        'Im Übernahmepoker um Evonik gibt es eine neue Zahl. BASF könnte sein Angebot je Aktie auf 24 Euro erhöhen, berichtete onvista am Dienstagabend.',
        'Wie hoch das bisherige Angebot lag, nennt die Meldung nicht. Auch eine Begründung für die mögliche Erhöhung steht dort nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein höheres Angebot je Aktie senkt für die bietende Firma den Widerstand der Aktionäre, erhöht aber gleichzeitig die Kosten der Übernahme.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['basf'],
      sources: [
        {
          label: 'onvista.de, News-Ticker vom 29.09.2026, 16:14 Uhr',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Nvidia weitet Aktienrückkauf um 150 Milliarden Dollar aus',
      summary: [
        'Nvidia hat sein Aktienrückkaufprogramm um 150 Milliarden Dollar aufgestockt. Das meldete onvista am Dienstagabend unter Berufung auf den Chipkonzern.',
        'Ein genaues Gesamtvolumen oder einen Zeitrahmen nennt die Meldung nicht. Nvidia zählt zu den größten Werten im US Tech 100.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Aktienrückkauf senkt die Zahl der umlaufenden Aktien und lässt den Gewinn je Aktie rechnerisch steigen, ohne dass sich am operativen Geschäft etwas ändert.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['nvidia'],
      sources: [
        {
          label: 'onvista.de, News-Ticker vom 29.09.2026, 16:09 Uhr',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'AMD übernimmt das KI-Unternehmen World Labs',
      summary: [
        'AMD hat das KI-Unternehmen World Labs übernommen. Das berichtete onvista am Dienstagabend und ordnete den Kauf dem KI-Geschäft von AMD zu.',
        'Einen Kaufpreis nennt die Meldung nicht. Auch zum Geschäft von World Labs selbst liegen keine Angaben vor.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zukäufe beschleunigen für Halbleiterkonzerne den Zugang zu neuer KI-Technologie, verglichen mit einer eigenen Entwicklung von Grund auf.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['amd'],
      sources: [
        {
          label: 'onvista.de, News-Ticker vom 29.09.2026, 16:01 Uhr',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
  ],
}
