import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-05.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-05 04:14 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-05',
  intro:
    'US-Jobdaten schicken die Wall Street ins Minus, doch der DAX hält über 26.000 – VW an der Spitze. Gold bricht ein, Öl bleibt stehen.',
  top: [
    {
      headline: 'VW-Aktie schließt die Woche als DAX-Spitzenreiter ab',
      summary: [
        'Nach der Zustimmung des Aufsichtsrats zum Sparprogramm am Donnerstag legte die VW-Vorzugsaktie laut dpa-AFX auch am Freitag weiter zu und führte den DAX an.',
        'Der DAX selbst hielt sich laut onvista trotz überraschend starker US-Arbeitsmarktdaten über der Marke von 26.000 Punkten.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, dass ein einzelner Konzern über zwei Handelstage hinweg einen ganzen Index stützen kann, wenn die übrige Nachrichtenlage eher dagegen spricht.',
      relatedTopics: ['aktie', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['volkswagen', 'dax'],
      sources: [
        {
          label:
            'onvista, Marktberichte vom 4.9.2026, 16:49 Uhr (dpa-AFX): „AKTIE IM FOKUS 2: Einigung auf Sparplan treibt Volkswagen an die Dax-Spitze“',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Ein Jobbericht, drei Börsen, drei Richtungen',
      summary: [
        'Der US-Arbeitsmarktbericht mit 162.000 neuen Stellen im August ließ Dow Jones und S&P 500 am Freitag laut dpa-AFX nachgeben.',
        'Der Wiener Leitindex ATX legte laut derselben Agentur an ebendiesem Tag zu – dieselben Daten wurden also nicht überall gleich verarbeitet.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Macht deutlich, dass eine einzelne Konjunkturzahl von verschiedenen Börsen unterschiedlich verarbeitet wird, je nachdem, was dort sonst zählt.',
      relatedTopics: ['aktie', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dow-jones', 'dax'],
      sources: [
        {
          label:
            'wallstreet-online, News-Ticker vom 4.9.2026: „162.000 neue Jobs im August: Wall Street startet nach US-Job-Hammer im Minus“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Gold gibt nach, Öl bleibt stehen – trotz derselben Meldung',
      summary: [
        'Nach dem überraschend starken US-Jobbericht brach der Goldpreis laut Goldreporter ein, weil die Zinserwartungen stiegen.',
        'Der Ölpreis bewegte sich laut der Kursleiste von finanzen.net zur gleichen Zeit in die entgegengesetzte Richtung nach oben.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Erklärt, warum nicht jeder Rohstoff auf dieselbe Nachricht gleich reagiert – Gold hängt an Zinserwartungen, Öl vor allem an Angebot und Nachfrage.',
      relatedTopics: ['rohstoffe', 'notenbanken-geldpolitik'],
      relatedSymbols: ['gold', 'brent'],
      sources: [
        {
          label:
            'goldreporter.de, Top-News vom 4.9.2026: „US-Arbeitsmarkt im August deutlich stärker als erwartet – Goldpreis bricht ein“',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'thyssenkrupp-Aktie springt nach angehobenem Kursziel',
      summary: [
        'Die Deutsche Bank hat ihr Kursziel für thyssenkrupp laut finanzen.net angehoben, die Aktie legte daraufhin deutlich zu – konkrete Zahlen zum neuen Ziel nennt die Meldung nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein angehobenes Kursziel ist die Einschätzung einer einzelnen Bank, keine Tatsachenfeststellung – trotzdem kann sie einen Kurs an ruhigen Tagen spürbar bewegen.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'finanzen.net, Unternehmens-Meldungen News-Ticker vom 4.9.2026: „thyssenkrupp-Aktie weit im Plus: Deutsche Bank hebt Ziel an“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Adobe bekommt neuen Chef – die Aktie fällt trotzdem',
      summary: [
        'Adobe hat laut finanzen.net einen Wechsel an der Konzernspitze bekanntgegeben: Chakravarthy wird neuer CEO, der bisherige Produktchef verlässt das Unternehmen. Die Aktie gab daraufhin nach.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, dass ein Führungswechsel an der Börse nicht automatisch positiv aufgenommen wird, selbst wenn der Nachfolger aus dem eigenen Haus kommt.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['adobe'],
      sources: [
        {
          label:
            'finanzen.net, Unternehmens-Meldungen News-Ticker vom 4.9.2026: „Adobe-Aktie fällt: Chakravarthy wird neuer CEO - Produktchef geht“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Gewinnwarnung von Lululemon zieht adidas und Puma mit runter',
      summary: [
        'Eine Gewinnwarnung des US-Sportartiklers Lululemon hat laut finanzen.net auch die Aktien von adidas und Puma belastet, obwohl beide Unternehmen selbst keine eigene Meldung veröffentlicht haben.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein konkretes Beispiel dafür, wie die Nachricht eines Konzerns über Branchengrenzen hinweg auf Konkurrenten abfärben kann, ohne dass diese selbst betroffen sein müssen.',
      relatedTopics: ['aktie', 'anlegerpsychologie'],
      relatedSymbols: ['adidas'],
      sources: [
        {
          label:
            'finanzen.net, Unternehmens-Meldungen News-Ticker vom 4.9.2026: „Gewinnwarnung von Lululemon lässt auch adidas und PUMA schwächeln“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Norwegens Staatsfonds will laut einer Meldung US-Anleihen abstoßen',
      summary: [
        'Der weltgrößte Staatsfonds aus Norwegen erwägt laut wallstreet-online, sich von US-Staatsanleihen zu trennen. Details zu Umfang oder Zeitplan nennt die Meldung nicht.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ein derart großer Investor kann mit seiner Positionierung Signalwirkung für andere institutionelle Anleger am Anleihemarkt entfalten.',
      relatedTopics: ['staatsanleihe', 'portfolio-aufbau'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'wallstreet-online, Nachrichten vom 4.9.2026: „Norwegischer Staatsfonds will US-Anleihen über Bord kippen“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
