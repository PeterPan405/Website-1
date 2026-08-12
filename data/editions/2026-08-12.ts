import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-12.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-12 03:01 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-12',
  intro:
    'Der Dax markiert einen Rekord, während die Wall Street trotz derselben Nachricht fällt – dazu Gold, Öl, Unternehmenszahlen und die US-Inflation.',
  top: [
    {
      headline: 'Dax erstmals über 26.500 Punkten – Wall Street tut sich trotzdem schwer',
      summary: [
        'Der Dax kletterte am Dienstag erstmals über 26.500 Punkte, auch der Euro Stoxx 50 markierte ein Rekordhoch – getragen von Hoffnungen auf eine Entspannung im Nahen Osten.',
        'An der Wall Street reichten dieselben positiven Signale nicht: Dow Jones, S&P 500, Nasdaq Composite und Nasdaq 100 schlossen den Dienstag im Minus.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, dass dieselbe Nachricht in unterschiedlichen Märkten unterschiedlich wirkt, je nachdem, welche Erwartungen dort bereits eingepreist sind.',
      relatedTopics: ['aktie', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dax', 'dow-jones'],
      sources: [
        {
          label:
            'onvista, News-Ticker vom 11.8.2026, 16:07 Uhr: „ROUNDUP/Aktien Frankfurt Schluss: Dax steigt erstmals über 26.500 Punkte“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'finanzen.net, News-Ticker vom 11.8.2026: „DAX nach neuem Rekord letztlich höher -- US-Börsen enden leichter“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Goldpreis: China-Spread rutscht erstmals ins Minus',
      summary: [
        'Der Preisaufschlag, den Käufer in Shanghai normalerweise gegenüber dem Westen zahlen, ist laut Goldreporter auf minus 16 US-Dollar gefallen.',
        'Gleichzeitig steigt der Goldpreis weiter, am Mittwochmorgen auf rund 4.410 bis 4.414 US-Dollar je Feinunze.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ein negativer China-Spread zeigt, dass der jüngste Preisschub eher von westlichem Kapital als von chinesischer Nachfrage getragen wird.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'goldreporter.de, Startseite vom 11.8.2026: „Goldmarkt: China-Spread fällt deutlich ins Minus“',
          url: 'https://www.goldreporter.de/',
        },
        {
          label:
            'wallstreet-online, Rohstoffpreise vom 12.8.2026, 04:59 Uhr (Goldpreis 4.411,20 USD, +0,98 %)',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Öl nähert sich 90 Dollar nach Tankerangriff im Golf von Oman',
      summary: [
        'Ein US-Helikopter beschoss einen Tanker im Golf von Oman, bei einem Huthi-Angriff nahe dem Roten Meer gab es Tote – die Sorge um die Straße von Hormus wächst.',
        'Brent legte auf 88,96 US-Dollar zu und steht am Mittwochmorgen bereits bei 89,64 Dollar; parallel zog auch der Goldpreis an.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, wie geopolitische Risiken gleichzeitig auf Öl- und Goldpreis wirken können, statt sie wie sonst oft angenommen gegenläufig zu bewegen.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: ['brent', 'gold'],
      sources: [
        {
          label:
            'wallstreet-online, News-Ticker vom 11.8.2026: „US-Helikopter beschießt Tanker in Golf von Oman“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'finanzen.net, Kursleiste vom 12.8.2026, 03:01 Uhr (Öl 89,64 USD, +0,8 %; Gold 4.414 USD, +1,0 %)',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Super Micro Computer: Ausblick begeistert nach starkem Quartal',
      summary: [
        'Der Server-Hersteller übertraf laut Ticker-Meldungen die Gewinnerwartungen des Quartals deutlich, die Aktie sprang daraufhin kräftig nach oben.',
        'Im Mittelpunkt der Reaktion stand weniger das abgelaufene Quartal als der Ausblick, der die Anleger überzeugte.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Lehrbeispiel dafür, dass der Ausblick eines Unternehmens die Kursreaktion oft stärker prägt als das bereits abgeschlossene Quartal.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['nasdaq-100'],
      sources: [
        {
          label:
            'finanzen.net, Unternehmens-Meldungen News-Ticker vom 11.8.2026: „Super Micro Computer-Aktie legt kräftig zu: Gewinnerwartungen deutlich übertroffen - Ausblick sorgt für Begeisterung“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Thyssenkrupp Nucera rechnet mit mehr Verlust nach SOEC-Ausstieg',
      summary: [
        'Als Grund für die höhere Verlustprognose nennt das Unternehmen den Rückzug aus dem SOEC-Geschäft, einer Hochtemperatur-Elektrolyse-Technologie.',
        'Konkrete Zahlen zu Umsatz oder Verlust liegen aus der Ticker-Meldung nicht vor.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, dass eine erhöhte Verlustprognose unterschiedliche Ursachen haben kann – hier eine strategische Entscheidung, kein schwächeres Kerngeschäft.',
      relatedTopics: ['risiko-und-rendite'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'wallstreet-online, Unternehmensmeldungen vom 11.8.2026: „Thyssenkrupp Nucera rechnet wegen SOEC-Ausstieg mit noch mehr Verlust“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Hims & Hers: Marge bricht trotz Milliarden-Umsatz ein',
      summary: [
        'Die Aktie fiel, obwohl der Umsatz laut Meldung im Milliardenbereich lag – als Grund nennt die Meldung eine Kooperation mit Novo Nordisk, die auf die Marge drückt.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Erinnert daran, dass Umsatzwachstum allein nichts über die Profitabilität eines Geschäfts aussagt.',
      relatedTopics: ['risiko-und-rendite'],
      relatedSymbols: ['novo-nordisk'],
      sources: [
        {
          label:
            'finanzen.net, Unternehmens-Meldungen News-Ticker vom 11.8.2026: „Hims & Hers-Aktie knickt ein: Novo-Nordisk-Deal drückt Marge trotz Milliarden-Umsatz“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'US-Inflationsdaten heute: Kernrate mit Prognose 0,2 Prozent',
      summary: [
        'Um 14:30 Uhr deutscher Zeit veröffentlichen die USA ihre Verbraucherpreise für Juli, die Kernrate wird mit plus 0,2 Prozent im Monatsvergleich erwartet, nach 0,0 Prozent zuvor.',
        'Die Gesamtrate soll laut Prognose von minus 0,4 auf plus 0,1 Prozent drehen.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Die Abweichung von diesen Prognosen kann darüber entscheiden, ob die Woche mit einer Rallye oder einem Abverkauf endet.',
      relatedTopics: ['inflation', 'notenbanken-geldpolitik'],
      relatedSymbols: ['sp500'],
      sources: [
        {
          label:
            'wallstreet-online, Wirtschaftskalender vom 12.8.2026: Consumer Price Index (MoM) und Consumer Price Index ex Food & Energy (MoM), 14:30 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'JPMorgan hebt Kursziel für den S&P 500 an',
      summary: [
        'JPMorgan zeigt sich laut wallstreet-online angesichts guter Unternehmensergebnisse optimistisch und hat das Kursziel für den S&P 500 angehoben.',
        'Eine konkrete Zielmarke nennt die Ticker-Meldung nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine angehobene Kurszielspanne zeigt, wie Analysten die laufende Berichtssaison einordnen, bleibt aber eine Einschätzung, keine Garantie.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['sp500'],
      sources: [
        {
          label:
            'wallstreet-online, News-Ticker vom 12.8.2026: „Bullenthese bestätigt: JPMorgan lässt es krachen: Kursziel für den S&P 500 angehoben!“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
