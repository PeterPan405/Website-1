import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-26.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-26 00:44 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-26',
  intro:
    'Der Ölpreis fällt auf Nahost-Hoffnungen, BASF bestätigt eine mögliche Evonik-Übernahme, Gold rutscht unter die 50-Tage-Linie, und Xi lädt Trump nach China ein.',
  top: [
    {
      headline: 'Ölpreis fällt auf Nahost-Hoffnung, Streit um US-Diesel-Exportstopp',
      summary: [
        'Der Ölpreis der Sorte Brent ist am Freitag auf 97,47 US-Dollar je Fass gefallen, ein Minus von 3,01 Prozent, nachdem der Iran den USA laut wallstreet-online einen Fahrplan für die Straße von Hormus angeboten hatte.',
        'Zugleich erwägt US-Präsident Donald Trump einen Exportstopp für Diesel aus amerikanischer Produktion; die US-Ölindustrie wehrt sich dagegen, wie wallstreet-online berichtete.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein fallender Ölpreis wirkt sich über die Tankstellenpreise auf die Inflation aus, während ein Exportstopp genau in die entgegengesetzte Richtung wirken könnte.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'wallstreet-online, Aktuelle Rohstoffpreise, Stand 26.09.2026, 00:44 Uhr (GMT): Öl (Brent) 97,47 USD, -3,01 %',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'wallstreet-online, Rohstoffnachrichten, Meldung vom 25.09.2026: „Dieselexporte: US-Ölkonzerne wettern gegen möglichen Diesel-Export-Stopp“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Xi lädt Trump nach Peking – zweites Treffen im November geplant',
      summary: [
        'Nach ihrem Treffen am Donnerstag in Washington wollen sich US-Präsident Donald Trump und Chinas Staats- und Parteichef Xi Jinping im November erneut treffen, diesmal in China, wie finanzen.net und wallstreet-online berichteten.',
        'Ein genaues Datum oder eine Tagesordnung für das zweite Treffen nennen die Meldungen nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der zwischen den USA und China vereinbarte Zollwaffenstillstand läuft am 10. November aus; ein weiteres Treffen kurz davor gilt als Signal für den Umgang mit dieser Frist.',
      relatedTopics: ['aktie'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker, Meldung vom 25.09.2026: „ROUNDUP: Xi und Trump wollen sich im November in China treffen“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label:
            'wallstreet-online, Devisennachrichten, Meldung vom 25.09.2026: „Xi Jinping lädt Trump zu nächstem Treffen nach China ein“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Dax beendet Verlustserie, Wall Street schließt fester',
      summary: [
        'Der Dax hat die Woche laut onvista mit einem kleinen Plus beendet und damit seine vorherige Verlustserie gestoppt; dpa-AFX meldete um 16:27 Uhr, der Dax beende eine „durchwachsene Woche freundlich“.',
        'An der Wall Street zogen Dow Jones, S&P 500 und Nasdaq am Freitag laut dpa-AFX ebenfalls an – als Grund nannte die Agentur die Hoffnung auf eine Lösung im Nahost-Konflikt.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Wochengewinn nach vorherigen Verlusten zeigt, wie stark geopolitische Erwartungen die breite Marktstimmung derzeit prägen.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['dax', 'dow-jones', 'nasdaq-100', 'sp500'],
      sources: [
        {
          label:
            'onvista, Dax Tagesrückblick, Meldung vom 25.09.2026, 15:59 Uhr, onvista: „Verlustserie beendet: Dax erzielt kleines Wochenplus“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'onvista, Neueste Marktberichte, Meldung vom 25.09.2026, 20:37 Uhr, dpa-AFX: „ROUNDUP/Aktien New York Schluss: Dow erholt sich - Hoffnung auf Nahost-Lösung“',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Goldpreis rutscht unter 50-Tage-Linie',
      summary: [
        'Der Goldpreis ist laut Goldreporter unter seine 50-Tage-Linie gefallen; als Grund nennt die Quelle hohe Marktzinsen.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Steigende Zinsen erhöhen die Opportunitätskosten des zinslosen Goldbesitzes gegenüber einer verzinsten Anlage.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'Goldreporter, Top-News, Stand 26.09.2026, 00:44 Uhr (GMT): „Goldpreis rutscht unter 50-Tage-Linie – Hohe Marktzinsen belasten“',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline:
        'BASF bestätigt unverbindliche Ansprache für mögliche Übernahme von Evonik',
      summary: [
        'Evonik hat per Ad-hoc-Mitteilung bestätigt, von BASF unverbindlich wegen eines möglichen Übernahmeangebots angesprochen worden zu sein; auch der Ankeraktionär RAG-Stiftung veröffentlichte dazu eine eigene Mitteilung.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zwei Ad-hoc-Mitteilungen an einem Tag zeigen, dass beide Unternehmen den frühen Stand der Gespräche bereits für kursrelevant halten, auch ohne dass ein Preis genannt wird.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['basf', 'evonik'],
      sources: [
        {
          label:
            'wallstreet-online, Ad-hoc, Meldung vom 25.09.2026, EQS Group AG: „EQS-Adhoc: Evonik Industries AG bestätigt unverbindliche Ansprache durch die BASF SE zu einem möglichen Übernahmeangebot“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'wallstreet-online, Ad-hoc, Meldung vom 25.09.2026, EQS Group AG: „EQS-Adhoc: RAG-Stiftung: RAG-Stiftung zu einer möglichen Übernahme der Evonik durch BASF“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Anthropic-Deal mit Akamai zieht Chip-Aktien mit',
      summary: [
        'Die Akamai-Aktie ist laut finanzen.net nach einem Milliarden-Deal mit dem KI-Unternehmen Anthropic kräftig gestiegen; auch Aktien von ASML, AMD und Intel zogen im Sog der Nachricht an.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Kursgewinn mehrerer Zulieferer auf einen einzelnen Auftrag zeigt, wie sehr der Markt Wachstum bei Künstlicher Intelligenz derzeit als gemeinsames Thema ganzer Lieferketten einpreist.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['amd', 'intel', 'asml'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker, Meldung vom 25.09.2026: „Akamai-Aktie schießt nach Milliarden-Deal mit Anthropic kräftig hoch“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label:
            'finanzen.net, News-Ticker, Meldung vom 25.09.2026: „Aktien von ASML, AMD, Intel & Co.: Diese KI-Werte ziehen nach dem Anthropic-Deal mit“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
}
