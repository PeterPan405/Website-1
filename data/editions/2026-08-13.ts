import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-13.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-13 03:04 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-13',
  intro:
    'Nvidia warnt, HSBC beruhigt sich selbst, Gold testet die 200-Tage-Linie, und der Kalender bringt Applied Materials sowie zwei Konjunkturtermine.',
  top: [
    {
      headline: 'Oracle erholt sich deutlich – Sorgen um KI-Ausgaben bleiben',
      summary: [
        'Die Oracle-Aktie hat sich laut einer Ticker-Meldung vom Mittwochabend nach vorherigen Verlusten spürbar erholt.',
        'Dieselbe Meldung nennt zugleich weiterhin bestehende Sorgen der Anleger über die Höhe der Investitionen in KI-Infrastruktur, ohne diese näher zu beziffern.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Erholung trotz offener Sorgen zeigt, dass ein Kurs schon einen Teil einer schlechten Nachricht vorwegnehmen kann, bevor sie sich bestätigt oder auflöst.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['oracle'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 12.8.2026: „Oracle-Aktie erholt sich deutlich: Sorgen um KI-Ausgaben bleiben jedoch bestehen“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline:
        'Investor Temasek nimmt Chip-Konzerne ins Visier – Samsung und SK Hynix springen an',
      summary: [
        'Laut einer Ticker-Meldung vom Mittwoch hat der Staatsfonds Temasek offenbar Interesse an großen Chip-Herstellern gezeigt.',
        'Die Aktien von Samsung und SK Hynix legten der Meldung zufolge daraufhin deutlich zu; Details zum Umfang des Engagements nennt die Kurzmeldung nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein einzelner großer Investor kann mit seinem Einstieg den Kurs eines ganzen Sektors bewegen – wichtig zu wissen, wenn ein Kurssprung ohne eigene Unternehmensmeldung kommt.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['samsung'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 12.8.2026: „Milliarden-Coup? Temasek nimmt Chip-Giganten ins Visier - Aktien von Samsung und SK hynix schießen hoch“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline:
        'Ukraine attackiert russischen Ölhafen Noworossijsk – Ölpreis gibt trotzdem nach',
      summary: [
        'Laut einer Agenturmeldung vom Mittwoch hat die Ukraine den russischen Schwarzmeerhafen Noworossijsk angegriffen, über den Russland einen großen Teil seiner Ölexporte abwickelt.',
        'Der Ölpreis notiert heute Morgen dennoch mit einem Minus von rund einem Prozent bei knapp 88 Dollar je Barrel Brent, wie Kursdaten von finanzen.net zeigen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dass eine Attacke auf eine wichtige Exportroute den Ölpreis nicht steigen lässt, zeigt, dass der Markt gerade andere Faktoren stärker gewichtet als dieses eine Risiko.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'wallstreet-online, News-Ticker vom 12.8.2026: „ROUNDUP 3: Ukraine attackiert Schwarzmeerhafen Noworossijsk“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'finanzen.net, Kursleiste vom 13.8.2026, gegen 5:04 Uhr (Öl 87,99 USD, -1,1 %)',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Norwegens Staatsfonds erzielt beste Quartalsrendite seit sechs Jahren',
      summary: [
        'Der weltgrößte Staatsfonds aus Norwegen hat im zweiten Quartal die beste Rendite seit sechs Jahren erzielt, wie es in einer Meldung von wallstreet-online heißt.',
        'Getragen wurde das Ergebnis vor allem von Kursgewinnen bei Beteiligungen an großen Technologiekonzernen wie Nvidia, Microsoft und Apple.',
      ],
      category: 'Vorsorge',
      whyItMatters:
        'Ein Fonds, der die Altersvorsorge eines ganzen Landes mitträgt, zeigt hier, wie stark diese Vorsorge inzwischen von wenigen großen Tech-Aktien abhängt.',
      relatedTopics: ['rente', 'portfolio-aufbau'],
      relatedSymbols: ['nvidia', 'microsoft', 'apple'],
      sources: [
        {
          label:
            'wallstreet-online, News-Ticker vom 12.8.2026: „Norwegischer Staatsfonds: Beste Rendite seit sechs Jahren“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [],
}
