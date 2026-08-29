import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-29.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-29 07:11 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-29',
  intro:
    'Warsh warnt vor Inflation, der DAX jubelt trotzdem: ein Rückblick auf Rekorde, fallendes Gold, einen Öl-Deal und ein Rating für Frankreich.',
  top: [
    {
      headline: 'Rede von Fed-Chef Warsh spaltet DAX und Nasdaq',
      summary: [
        'Kevin Warsh warnt in Jackson Hole vor anhaltend hoher Inflation – ein Hinweis für viele Anleger auf eine mögliche Zinserhöhung statt einer Senkung.',
        'Der DAX schließt danach laut onvista auf einem Rekordhoch, die Nasdaq in New York fällt zur gleichen Zeit auf dieselbe Meldung hin.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Dieselbe Rede bewegte zwei große Börsen in entgegengesetzte Richtungen – ein Beleg dafür, wie unterschiedlich Zinserwartungen auf zinssensible Wachstumswerte und auf breiter gestreute Indizes wirken.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['dax', 'nasdaq-100'],
      sources: [
        {
          label:
            'onvista, News-Ticker vom 28.8.2026, 15:45 Uhr: „ROUNDUP/Aktien Frankfurt Schluss: Fed-Chef Warsh hievt Dax auf weitere Bestmarke“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'onvista, News-Ticker vom 28.8.2026, 20:27 Uhr: „ROUNDUP/Aktien New York Schluss: Signale für US-Zinserhöhung belasten Nasdaq“',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Gold und Bitcoin fallen am Tag des DAX-Rekords',
      summary: [
        'Während der DAX ein neues Hoch erreicht, geben Gold und Bitcoin laut finanzen.net-Kursleiste deutlich nach – Gold rund drei Prozent, Bitcoin knapp.',
        'Wallstreet-online nennt als Grund die gestiegene Erwartung einer baldigen US-Zinserhöhung, die zinslose Anlagen wie Gold und Bitcoin unattraktiver macht.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Gold und Bitcoin gelten oft als unabhängig von Aktienmärkten – an diesem Tag bewegte sie derselbe Auslöser wie DAX und Nasdaq, die gestiegene Zinserwartung.',
      relatedTopics: ['rohstoffe', 'bitcoin-krypto'],
      relatedSymbols: ['gold', 'bitcoin'],
      sources: [
        {
          label:
            'wallstreet-online, News-Ticker vom 28.8.2026: „Goldpreis fällt nach Erholung weiter - zeitnahe US-Zinserhöhung wahrscheinlicher“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'finanzen.net, Kursleiste „Heute im Fokus“, Abruf 29.8.2026, 09:11 Uhr: Gold 4.459 US-Dollar (-3,1 %), Bitcoin 66.873 US-Dollar (-0,3 %)',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Venezuela-Deal der USA lässt den Ölpreis kalt',
      summary: [
        'Die Trump-Administration sichert sich laut dpa-AFX langfristigen Zugang zu einem Teil der venezolanischen Ölreserven.',
        'Der Ölpreis reagiert darauf nicht mit einem Anstieg: Laut finanzen.net-Kursleiste stand Öl am Samstagmorgen bei 89,31 US-Dollar, ein Minus von 0,4 Prozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die Meldung zeigt, dass ein geopolitischer Zugriff auf künftige Reserven den Ölpreis nicht automatisch bewegt – kurzfristig zählen Angebot von heute und Zinserwartungen oft stärker.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 29.8.2026, 09:04 Uhr: „ROUNDUP/Trump: USA sichern sich riesige Ölvorkommen in Venezuela“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label:
            'finanzen.net, Kursleiste „Heute im Fokus“, Abruf 29.8.2026, 09:11 Uhr: Öl 89,31 US-Dollar (-0,4 %)',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Fitch lässt Frankreich bei A+ – Ausblick bleibt stabil',
      summary: [
        'Die Ratingagentur Fitch bestätigt laut finanzen.net-Ticker Frankreichs Bonitätsnote bei A+ mit stabilem Ausblick, eine Begründung nennt die Meldung nicht.',
        'Ein stabiler Ausblick bedeutet, dass die Agentur in absehbarer Zeit weder eine Herauf- noch eine Herabstufung erwartet.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ratingnoten und ihr Ausblick beeinflussen, zu welchen Zinsen sich ein Staat am Kapitalmarkt verschulden kann – relevant für jeden, der Staatsanleihen hält oder darüber nachdenkt.',
      relatedTopics: ['staatsanleihe'],
      relatedSymbols: ['cac-40'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 29.8.2026, 09:09 Uhr: „Fitch bestätigt Frankreich-Rating mit A+ - Ausblick stabil“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Deutschland: 3,9 Billionen Euro Kapital im Ausland',
      summary: [
        'Wallstreet-online beziffert das deutsche Auslandsvermögen auf 3,9 Billionen Euro und nennt Deutschland damit den größten Gläubiger der Welt.',
        'Zugleich fehlten laut Bericht zu Hause Milliarden für Infrastruktur und Wachstum – warum das Kapital dennoch abfließt, beantwortet die Meldung nicht.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Die Zahl zeigt, wie stark deutsches Sparkapital international angelegt ist – ein Ausgangspunkt, um die eigene Sparquote und deren Verteilung zwischen In- und Ausland zu hinterfragen.',
      relatedTopics: ['geldsystem', 'waehrungen-wechselkurse'],
      relatedSymbols: ['dax', 'eur-usd'],
      sources: [
        {
          label:
            'wallstreet-online, Nachricht vom 28.8.2026: „Größter Gläubiger der Welt: 3,9 Billionen im Ausland: Deutschlands gigantisches Geld-Dilemma“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Nemetschek: Zahlen widerlegen offenbar die KI-Angst',
      summary: [
        'Laut wallstreet-online übertreffen die jüngsten Zahlen von Nemetschek die Zweifel der Anleger an der KI-Bedrohung für das Bausoftware-Geschäft.',
        'Konkrete Kennzahlen nennt die Meldung nicht – nur, dass das Ergebnis die vorherige Skepsis am Markt entkräftet habe.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Fall zeigt, wie eine bereits im Kurs eingepreiste Sorge – hier vor KI-Konkurrenz – einen Kurs schon dann bewegen kann, wenn Zahlen diese Sorge lediglich nicht bestätigen.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['tecdax'],
      sources: [
        {
          label:
            'wallstreet-online, Gefragte Nachrichten vom 29.8.2026, 07:00 Uhr: „Doch keine KI-pocalypse: Bausoftware-Riese Nemetschek: Zahlen schlagen Zweifel“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
