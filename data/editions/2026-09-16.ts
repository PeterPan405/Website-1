import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-16.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-16 00:15 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-16',
  intro:
    'Öl springt vor der Fed-Entscheidung, Rheinmetall knackt die 1.000-Euro-Marke, und aus Klingbeils „Bedingungen“ werden im Text plötzlich Bitten.',
  top: [
    {
      headline:
        'Ölpreis springt vor der Fed-Entscheidung – zwei Portale, zwei Vorzeichen',
      summary: [
        'Brent-Rohöl legte laut wallstreet-online über Nacht um 2,18 Prozent auf 108,50 US-Dollar zu, während finanzen.net zur gleichen Zeit ein Minus von 0,4 Prozent zeigte.',
        'Bundeskanzler Merz kündigte laut dpa-AFX schnelle Entlastung bei den Spritpreisen an, während Wirtschaftsministerin Reiche zentrale Forderungen der SPD dazu ablehnte.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wer zwei Kursanzeigen zur gleichen Uhrzeit vergleicht, sieht: Prozentangaben hängen von der gewählten Vergleichsbasis ab – eine Zahl allein reicht nicht.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'wallstreet-online, Kursleiste und Rohstoffpreise, Stand 16.09.2026, 02:15 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label: 'finanzen.net, Kursleiste, Stand 16.09.2026, 02:15 Uhr',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Kevin Warsh entscheidet heute über die US-Zinsen',
      summary: [
        'Die US-Notenbank Fed trifft laut wallstreet-online heute unter ihrem Vorsitzenden Kevin Warsh ihre Zinsentscheidung, während die Rendite zehnjähriger US-Anleihen den höchsten Stand seit 2007 erreicht hat.',
        'Morgan Stanley rechnet laut derselben Übersicht mit zwei Zinserhöhungen, ein anderer Ökonom hält diese Einschätzung für übertrieben.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Eine Zinsentscheidung der Fed wirkt über den Dollar, die Anleihemärkte und die Aktienbewertung bis in europäische Depots hinein.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['sp500'],
      sources: [
        {
          label:
            'wallstreet-online, Politik, Wirtschaft & Konjunktur, Stand 16.09.2026, 02:15 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Rheinmetall über 1.000 Euro nach Rüstungsabkommen mit den USA',
      summary: [
        'Verteidigungsminister Pistorius unterzeichnete laut dpa-AFX eine Rüstungsvereinbarung mit den USA, und die Rheinmetall-Aktie überschritt laut finanzen.net die runde 1.000-Euro-Marke.',
        'Eine zweite Übersicht bezweifelte zur gleichen Zeit, ob der Kurs die Marke hält – ein Beispiel dafür, wie unterschiedlich Portale dieselbe Bewegung einordnen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein einzelner Auftrag oder ein politisches Abkommen kann einen Kurs kurzfristig treiben, ohne dass sich daraus automatisch ein dauerhaftes Niveau ableiten lässt.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['rheinmetall'],
      sources: [
        {
          label: 'finanzen.net, News-Ticker vom 15.09.2026',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label: 'wallstreet-online, Startseite Nachrichten, Stand 16.09.2026, 02:15 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Klingbeil und Orcel: Aus „Bedingungen“ werden im Text „Bitten“',
      summary: [
        'Finanzminister Klingbeil traf laut wallstreet-online UniCredit-Chef Orcel wegen der möglichen Commerzbank-Übernahme; finanzen.net titelte, er habe „Bedingungen“ gestellt.',
        'Im Fließtext derselben Übersicht ist dagegen nur von „Bitten“ die Rede – die Commerzbank-Aktie reagierte laut finanzen.net schwächer.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Schlagzeile und Fließtext derselben Meldung können unterschiedlich klingen – wer nur die Überschrift liest, überschätzt leicht, wie viel Einfluss der Bund tatsächlich hat.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['commerzbank'],
      sources: [
        {
          label:
            'wallstreet-online, Nachrichten: Aktien & Indizes, Stand 16.09.2026, 02:15 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label: 'finanzen.net, News-Ticker vom 15.09.2026',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Gold: Preisabschlag in Shanghai schrumpft binnen einer Woche',
      summary: [
        'Der Preisabschlag von Gold in Shanghai gegenüber dem Westen verringerte sich laut Goldreporter innerhalb einer Woche von 38 auf 22 US-Dollar je Feinunze.',
        'Grund ist laut derselben Quelle, dass der Goldpreis in Europa zuletzt stärker fiel als in China – nicht, dass China teurer eingekauft hätte.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ein Preisabschlag zwischen zwei Handelsplätzen für denselben Rohstoff zeigt, wie regional unterschiedlich Angebot und Nachfrage sein können, obwohl der Markt global genannt wird.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label: 'Goldreporter, Meldungen & Analysen vom 15. September 2026',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline: 'Bijou Brigitte hebt die Prognose an, Deutz holt sich frisches Kapital',
      summary: [
        'Bijou Brigitte passte laut Ad-hoc-Mitteilung die Gewinnprognose für 2026 nach oben an, ohne eine konkrete Zahl zu nennen.',
        'Deutz schloss am selben Abend laut Ad-hoc-Mitteilung eine Kapitalerhöhung gegen Bareinlagen per Accelerated Bookbuilding ab – ein schneller Weg zu neuem Geld über neue Aktien.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Eine angehobene Prognose und eine Kapitalerhöhung sind zwei ganz unterschiedliche Unternehmensentscheidungen – die eine ändert Erwartungen, die andere die Aktienzahl.',
      relatedTopics: ['aktie'],
      relatedSymbols: [],
      sources: [
        {
          label: 'wallstreet-online, Ad-hoc-Nachrichten, Stand 16.09.2026, 02:15 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
