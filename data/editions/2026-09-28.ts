import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-28.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-28 00:55 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-28',
  intro:
    'Die USA weisen Irans Hormus-Angebot zurück, am Montag sprechen Notenbanker, und Mercedes-Benz drosselt die Produktion in Sindelfingen.',
  top: [
    {
      headline: 'USA weisen Irans Angebot zur Straße von Hormus zurück',
      summary: [
        'Die USA weisen Irans Hormus-Angebot zurück.',
        'Nach US-Angaben habe Teheran laut wallstreet-online alle Zugeständnisse im Voraus gefordert.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wer die Verantwortung dem anderen zuschiebt, verzögert eine Lösung, und damit bleibt die Risikoprämie im Ölpreis vorerst bestehen.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            "wallstreet-online, Rohstoffnachrichten, Meldung vom 27.09.2026: „'Verlangten alles im Voraus': USA über Irans Hormus-Angebot“",
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'finanzen.net, News-Ticker, Meldung vom 27.09.2026: „Straße von Hormus: Iran schiebt den Ball bei Öffnung den USA zu - Trump legt Angebot ab“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Notenbank-Termine am Montag: Ramsden spricht, Dallas Fed liefert Index',
      summary: [
        'Am Montag stehen mehrere Notenbank-Termine an.',
        'Um 12 Uhr spricht Bank-of-England-Vize Dave Ramsden, um 16:30 Uhr veröffentlicht die Dallas Fed ihren Industrieindex.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Reden von Notenbankern ohne Zinsentscheid können Erwartungen an künftige Sitzungen verschieben, auch ohne neue Beschlüsse.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'wallstreet-online, Startseite Nachrichten, Wirtschaftskalender „Kommende Termine“, Stand 28.09.2026',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Mercedes-Benz drosselt Produktion in Sindelfingen',
      summary: [
        'Mercedes-Benz hat die Produktion in Sindelfingen gedrosselt.',
        'Die Ursache nennt die Meldung laut finanzen.net nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ob eine Lieferkettenstörung oder schwache Nachfrage dahintersteckt, macht für die kommenden Quartalszahlen einen großen Unterschied.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['mercedes-benz'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker, Meldung vom 27.09.2026: „Mercedes-Benz: Werk Sindelfingen musste Produktion herunterfahren“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline:
        '53.000 Klagen von Passagieren gegen Fluglinien binnen eines halben Jahres',
      summary: [
        'Passagiere reichten binnen eines halben Jahres rund 53.000 Klagen gegen Fluglinien ein.',
        'Welches Land und welche Fluglinien gemeint sind, nennt die Meldung laut finanzen.net nicht.',
      ],
      category: 'Steuern & Recht',
      whyItMatters:
        'Ohne Angaben zu Land und Fluglinien lässt sich die Zahl schwer einordnen, sie zeigt aber, wie häufig Fluggastrechte eingeklagt werden.',
      relatedTopics: ['aktie'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker, Meldung vom 27.09.2026: „53.000 Klagen von Passagieren gegen Fluglinien im Halbjahr“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
}
