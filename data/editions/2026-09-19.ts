import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-19.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-19 00:20 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-19',
  intro:
    'Der DAX rutscht am großen Verfallstag ab, VW kappt die Gewinnprognose, Gold steigt nach der Fed-Zinserhöhung, und der Bund plant einen neuen Tankrabatt.',
  top: [
    {
      headline: 'Fed erhöht Leitzins, Goldpreis steigt auf 4.380 Dollar',
      summary: [
        'Die US-Notenbank Fed hat ihren Leitzins angehoben und laut Goldreporter zugleich einen weiteren Zinsschritt für dieses Jahr signalisiert. Präsident Trump forderte im Anschluss laut wallstreetONLINE einen Leitzins von rund 1 Prozent.',
        'Der Goldpreis stand zum Stand Samstagfrüh laut finanzen.net bei 4.380 Dollar je Feinunze, ein Plus von 0,9 Prozent. wallstreetONLINE berichtete zudem, China und andere Brics-Staaten hätten ihre Goldreserven zuletzt massiv aufgestockt.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Steigende Zinsen gelten normalerweise als Gegenwind für zinsloses Gold – dass der Preis trotzdem zulegt, zeigt, wie stark Zentralbankkäufe die reine Zinslogik derzeit überlagern können.',
      relatedTopics: ['notenbanken-geldpolitik', 'rohstoffe'],
      relatedSymbols: ['gold', 'eur-usd'],
      sources: [
        {
          label:
            'Goldreporter, 16. September 2026: „Fed hebt Leitzins an – weiterer Zinsschritt 2026 signalisiert"',
          url: 'https://www.goldreporter.de/',
        },
        {
          label:
            'wallstreetONLINE Redaktion, 17.09.2026: „Trump fordert 1% Zinsen!: Fed erhöht Zinsen, Börsen atmen auf, Ölpreis fällt"',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label: 'finanzen.net, Kursleiste, Stand 19.09.2026, 02:20 Uhr MESZ',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Bund und Länder einigen sich auf neuen Tankrabatt',
      summary: [
        'Bund und Länder haben sich laut finanzen.net am 18. September grundsätzlich auf einen neuen Tankrabatt und einen Spritpreisdeckel geeinigt. Zu Höhe oder Laufzeit machte die Meldung keine Angaben.',
        'Um 20:03 Uhr forderte der Politiker Lies laut derselben Quelle im Anschluss eine Übergewinnsteuer für Ölkonzerne. Eine Begründung dazu nannte die Meldung nicht.',
      ],
      category: 'Steuern & Recht',
      whyItMatters:
        'Ein staatlich finanzierter Rabatt an der Zapfsäule verändert nicht die Herstellkosten, sondern verschiebt sie in den Staatshaushalt – die geforderte Übergewinnsteuer wäre ein Versuch, einen Teil davon direkt von den Ölkonzernen zurückzuholen.',
      relatedTopics: ['inflation', 'schulden-und-kredit'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker, 18.09.2026: „ROUNDUP 3: Bund und Länder einigen sich auf neuen Tankrabatt"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label:
            'finanzen.net, News-Ticker, 18.09.2026, 20:03 Uhr: „Lies fordert Übergewinnsteuer für Ölkonzerne nach Tankrabatt"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'DAX fällt am großen Verfallstag, VW kappt die Gewinnprognose',
      summary: [
        'Der DAX ist am Freitag, dem großen Verfallstag, deutlich gefallen. Volkswagen und Porsche senkten am selben Tag ihre Gewinnprognose deutlich, wie finanzen.net und onvista übereinstimmend meldeten.',
        'Zum Stand Samstagfrüh nennt finanzen.net für den DAX 25.304 Punkte und ein Minus von 1,6 Prozent, wallstreet-online nennt für denselben Zeitpunkt 25.308,88 Punkte und ein Minus von 1,33 Prozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein großer Verfallstag kann Kurse unabhängig von Unternehmensnachrichten stärker ausschlagen lassen – wer an einem solchen Tag nach der Ursache eines Kursrückgangs sucht, findet oft mehr als einen Grund gleichzeitig.',
      relatedTopics: ['wie-funktioniert-der-markt', 'boerse'],
      relatedSymbols: ['dax', 'volkswagen', 'euro-stoxx-50'],
      sources: [
        {
          label:
            'onvista, Aktuelle News, 18.09.2026, 16:11 Uhr: „ROUNDUP/Aktien Frankfurt Schluss: Dax sackt am großen Verfallstag ab"',
          url: 'https://www.onvista.de/news/',
        },
        {
          label: 'finanzen.net, Kursleiste, Stand 19.09.2026, 02:20 Uhr MESZ',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label: 'wallstreet-online, Kursleiste, Stand 19.09.2026, 02:20 Uhr MESZ',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Erster deutscher F-35 ausgeliefert, Rheinmetall-Aktie im Minus',
      summary: [
        'Die Luftwaffe hat laut finanzen.net am 18. September den ersten F-35-Kampfjet erhalten. Am selben Tag notierte die Rheinmetall-Aktie laut einem weiteren Ticker der Quelle im Minus, eine Erklärung dafür nannte die Meldung nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der F-35 ist ein Produkt des US-Herstellers Lockheed Martin und kein Rheinmetall-Jet – zwei Schlagzeilen am selben Tag belegen für sich genommen noch keinen Zusammenhang zwischen beiden Ereignissen.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['rheinmetall'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker, 18.09.2026: „Rheinmetall-Aktie im Minus: Erster deutscher F-35-Kampfjet ausgeliefert"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Infineon nach 40 Prozent Verlust hochgestuft',
      summary: [
        'Die Infineon-Aktie wurde laut finanzen.net hochgestuft, nachdem sie zuvor rund 40 Prozent an Wert verloren hatte. Der Kurs reagierte positiv und zog auch die Aktie von Aixtron sowie weitere Chipwerte mit nach oben.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Welches Analysehaus die Hochstufung vorgenommen hat und mit welcher Begründung, nennt die Meldung nicht – das zeigt, wie wenig über eine Kursbewegung bekannt sein kann, obwohl der Markt bereits reagiert.',
      relatedTopics: ['aktie', 'anlegerpsychologie'],
      relatedSymbols: ['infineon'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker, 18.09.2026: „40 Prozent verloren – jetzt wird die Infineon-Aktie hochgestuft - Titel reagiert und zieht AIXTRON & Co. mit"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'US-Börsen zum Wochenschluss uneinheitlich',
      summary: [
        'Der Dow Jones schloss den Freitagshandel laut finanzen.net im Minus, während S&P 500 und Nasdaq Composite zulegten. wallstreet-online nennt für den Dow minus 0,23 Prozent und für den technologielastigen US Tech 100 plus 0,56 Prozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Weil der Dow Jones nach Aktienkurs und die anderen US-Indizes nach Marktkapitalisierung gewichtet sind, können sie am selben Handelstag in unterschiedliche Richtungen laufen.',
      relatedTopics: ['wie-funktioniert-der-markt'],
      relatedSymbols: ['dow-jones', 'sp500'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker, 18.09.2026: „Schwacher Handel: Dow Jones notiert letztendlich im Minus"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label: 'wallstreet-online, Kursleiste, Stand 19.09.2026, 02:20 Uhr MESZ',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
