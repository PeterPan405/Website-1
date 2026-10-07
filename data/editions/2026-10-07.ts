import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-07.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-07 00:11 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-07',
  intro:
    'Frankreichs Zinslast nähert sich fünf Prozent, Wall Street schließt auf Rekordniveau, Irans Währung stürzt weiter, und Paramount übernimmt Warner.',
  top: [
    {
      headline: 'Frankreichs Anleiherenditen nähern sich fünf Prozent',
      summary: [
        'Frankreich zahlt für neue Staatsanleihen fast fünf Prozent Zinsen. Das meldete wallstreetONLINE am Dienstag. Die Schulden des Landes haben sich seit der Euro-Einführung verdoppelt.',
        'Investor Leonard Fischer warnt vor einem Eurokrisen-Risiko. Er sieht Griechenland heute besser aufgestellt als Frankreich. Am Vormittag sprechen die EZB-Ratsmitglieder Cipollone und Vujcic, um acht Uhr veröffentlicht Deutschland seine Industrieproduktion.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Unterschiedliche Zinsen auf Staatsanleihen in derselben Währung zeigen, wie der Markt das Ausfallrisiko einzelner Länder über einen Risikoaufschlag zum sichersten Schuldner bepreist.',
      relatedTopics: ['staatsanleihe', 'notenbanken-geldpolitik'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'wallstreet-online.de, Wirtschaftsnachrichten vom 07.10.2026 (wallstreetONLINE Redaktion, Meldung vom 06.10.2026): „Frankreichs 400-Milliarden-Falle: Jetzt kommt die Rechnung für Corona“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'goldreporter.de, Meldungen & Analysen, Eintrag vom 06.10.2026: „Hohe Anleihe-Renditen schüren Sorgen um Staatsfinanzierung in Europa“',
          url: 'https://www.goldreporter.de/',
        },
        {
          label:
            'wallstreet-online.de, Wirtschaftskalender „Kommende Termine“, Datenstand 07.10.2026, 00:11 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Wall Street schließt auf Rekordniveau, Ölpreis dreht am Morgen',
      summary: [
        'Der S&P 500 und der Nasdaq 100 erreichten am Dienstag neue Rekordhochs. Auch der Dow Jones gewann. Das meldete dpa-AFX am Abend.',
        'Europas Börsen profitierten zuvor von fallenden Ölpreisen. Am Mittwochmorgen steigt Brent aber wieder, auf 101,13 Dollar je Barrel. Zuvor hatte dpa-AFX einen Tankerbrand vor der russischen Schwarzmeerküste gemeldet.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dass ein Rohstoffpreis innerhalb eines Tages dreht, zeigt, wie stark einzelne Ereignisse kurzfristige Notierungen bewegen können, auch wenn sich der längerfristige Trend kaum ändert.',
      relatedTopics: ['wie-funktioniert-der-markt', 'rohstoffe'],
      relatedSymbols: ['sp500', 'nasdaq-100', 'brent'],
      sources: [
        {
          label:
            'onvista.de, Aktuelle News vom 07.10.2026 (dpa-AFX, Meldungen vom 06.10.2026, 20:34 und 15:49 Uhr): „ROUNDUP/Aktien New York Schluss: Gewinne - Rekorde bei S&P 500 und Nasdaq 100“, „Aktien Frankfurt Schluss: Gewinne dank Tech-Stärke und Entspannung bei Anleihen“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'onvista.de, Rohstoffnachrichten vom 07.10.2026 (dpa-AFX, Meldung vom 06.10.2026): „Tanker vor russischer Schwarzmeerküste in Brand“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'wallstreet-online.de, Kursleiste „Aktuelle Rohstoffpreise“, Datenstand 07.10.2026, 02:11 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Irans Währung fällt weiter, der Ölminister tritt zurück',
      summary: [
        'Irans Rial ist weiter gefallen, auf 2,7 Millionen je Dollar. Das berichtete wallstreetONLINE am Montag.',
        'Einen Tag später trat Irans Ölminister zurück. Im Land fehlen täglich zehn Millionen Liter Treibstoff. Eine Begründung nennt die Meldung nicht. wallstreetONLINE brachte den Rücktritt in Verbindung mit der Lage in der Straße von Hormus.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Währungskrise und eine Versorgungslücke beim selben Rohstoff, den ein Land exportiert, zeigen, dass Förderung und Verteilung eines Rohstoffs zwei getrennte Probleme sein können.',
      relatedTopics: ['waehrungen-wechselkurse', 'rohstoffe'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'wallstreet-online.de, Gefragte Nachrichten, Eintrag vom 05.10.2026: „Öldollar versiegen: 2,7 Millionen Rial für einen Dollar: Irans Währung stürzt ins Bodenlose“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'wallstreet-online.de, Gefragte Nachrichten, Eintrag vom 06.10.2026: „Hormus macht alles teurer: Irans Ölminister tritt ab – und es fehlen täglich 10 Millionen Liter Sprit“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Paramount schließt die Übernahme von Warner ab',
      summary: [
        'Paramount hat die Übernahme von Warner abgeschlossen. Das meldete dpa-AFX am Dienstagabend um 20:14 Uhr.',
        'Zu Kaufpreis oder Bedingungen nennt die Meldung keine Zahlen. Die Nachrichtenübersicht verknüpft den Vorgang mit dem Wertpapier Netflix.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine abgeschlossene Übernahme verschiebt Marktanteile in der Streaming-Branche, auch wenn der Effekt auf Umsatz und Gewinn erst in künftigen Quartalszahlen sichtbar wird.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['warner-bros-discovery', 'netflix'],
      sources: [
        {
          label:
            'onvista.de, Aktuelle News vom 07.10.2026 (dpa-AFX, Meldung vom 06.10.2026, 20:14 Uhr): „ROUNDUP 2: Paramount schließt Warner-Übernahme ab“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'wallstreet-online.de, Politik Nachrichten vom 07.10.2026 (dpa-AFX, Meldung vom 06.10.2026, Wertpapier: Netflix): „ROUNDUP 2: Paramount schließt Warner-Übernahme ab“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Deutz streicht 400 Stellen im Geschäft mit kleinen Motoren',
      summary: [
        'Der Motorenhersteller Deutz baut 400 Stellen ab. Das berichtete das Handelsblatt, weitergegeben von dpa-AFX.',
        'Betroffen ist vor allem das Geschäft mit kleinen Motoren. Eine Begründung nennt die Meldung nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Stellenabbau in einem einzelnen Geschäftsbereich zeigt, wie unterschiedlich sich Nachfrage innerhalb eines Unternehmens entwickeln kann, auch ohne dass der Konzern insgesamt in der Krise steckt.',
      relatedTopics: ['risiko-und-rendite'],
      relatedSymbols: [],
      sources: [
        {
          label:
            "wallstreet-online.de, Nachrichten „Aktien & Indizes“ vom 07.10.2026 (dpa-AFX unter Berufung auf Handelsblatt, Meldung vom 06.10.2026): „'HB': Deutz will 400 Stellen abbauen - vor allem bei kleinen Motoren“",
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
