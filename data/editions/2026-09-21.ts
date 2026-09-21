import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-21.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-21 00:19 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-21',
  intro:
    'Nach den Landtagswahlen wackelt die Koalition in Berlin, fünf Notenbank-Termine bündeln sich an einem Tag, und VW-Vorzüge fallen 7,7 Prozent.',
  top: [
    {
      headline:
        'CDU verliert nach Landtagswahlen an Boden, Linke stärkste Kraft in Berlin',
      summary: [
        'Bei den Landtagswahlen in Berlin und Mecklenburg-Vorpommern am Sonntag fiel die CDU einer ARD-Hochrechnung zufolge in Mecklenburg-Vorpommern erstmals unter fünf Prozent und damit aus dem Landtag; die AfD lag im Nordosten vor der SPD. In Berlin wurde die Linke laut dpa-AFX stärkste Kraft, das Bündnis Sahra Wagenknecht verpasste laut Hochrechnung den Einzug ins Abgeordnetenhaus.',
        'Der Berliner CDU-Spitzenkandidat Evers verlor sein Direktmandat, der SPD-Spitzenkandidat Krach verfehlte seines; Regierungschef Wegner gewann seines in Spandau. Um 21:35 Uhr meldete dpa-AFX, die schwarz-rote Koalition ringe nach der Wahl um ihren Reformkurs; zuvor hatte die Agentur um 21:20 Uhr eine Pressestimme der britischen Zeitung „The Times" verbreitet, wonach Kanzler Merz „schwer angeschlagen" sei.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein geschwächtes Regierungsbündnis kann geplante Reformen und Haushaltsentscheidungen verzögern, was für Anleger die Planbarkeit der Wirtschaftspolitik verringert.',
      relatedTopics: ['risiko-und-rendite'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'onvista, Aktuelle News, 20.09.2026, 21:35 Uhr, dpa-AFX: „ROUNDUP: Schwarz-rote Koalition ringt nach Wahl um Reformkurs"',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'finanzen.net, News-Ticker, Meldung vom 20.09.2026: „GESAMT-ROUNDUP 6: CDU im Nordosten unter fünf Prozent - Linke siegt in Berlin"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Fünf Termine mit Notenbank-Bezug an einem Tag',
      summary: [
        'Am 21. September sprechen laut wallstreet-online um 12:30 Uhr Fed-Mitglied Goolsbee, um 17:00 Uhr EZB-Präsidentin Lagarde und der Gouverneur der kanadischen Notenbank Macklem sowie um 17:10 Uhr EZB-Mitglied Cipollone; um 12:00 Uhr veröffentlicht die Deutsche Bundesbank ihren Monatsbericht.',
        'Die Termine folgen auf die Zinserhöhung der US-Notenbank Fed in der vergangenen Woche. Um 14:30 Uhr steht laut derselben Quelle zudem der Chicago Fed National Activity Index an, der zuletzt bei minus 0,08 Punkten lag.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Reden einzelner Notenbanker sind zwar keine Zinsentscheidungen, geben Marktteilnehmern aber Hinweise auf den künftigen Kurs der Geldpolitik und können deshalb Kurse bewegen.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'wallstreet-online, Wirtschaftskalender „Wichtige Termine", Stand 21.09.2026',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline:
        'Deutsche Autobauer verlieren weiter an Boden, VW-Vorzüge minus 7,7 Prozent',
      summary: [
        'Die deutschen Autobauer verloren laut einer Analyse von dpa-AFX vom 20. September weiter an Boden. Die Vorzugsaktie von Volkswagen verlor nach Angaben von Markt Bote 7,7 Prozent; einen Zeitraum nennt die Meldung nicht.',
        'Am selben Tag berichtete dpa-AFX, der Chef der VW-Tochter Skoda wechsle zu Volvo Cars; die Meldung bezeichnete dies als Verlust eines wichtigen Managers für den VW-Konzern.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Wechsel an der Konzernspitze fällt in eine Phase, in der Volkswagen und Porsche erst am Freitag ihre Gewinnprognose gesenkt hatten – zusammen erhöht das für Anleger die Unsicherheit über den weiteren Kurs.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['volkswagen'],
      sources: [
        {
          label:
            'wallstreet-online, Marktberichte, Markt Bote, Meldung vom 20.09.2026: „Die Bären übernehmen: Volkswagen (VW) Vz verliert 7,7 Prozent: Anleger suchen jetzt den Boden"',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'finanzen.net, News-Ticker, Meldung vom 20.09.2026: „VW-Konzern verliert wichtigen Manager: Skoda-Chef wechselt zu Volvo Cars"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Goldpreis über 4.350 Dollar, Terminmarkt-Positionierung stabil',
      summary: [
        'Der Goldpreis notierte laut Goldreporter zuletzt wieder über 4.350 US-Dollar je Feinunze. Die aktuellen CoT-Daten zeigten laut derselben Quelle eine stabile Positionierung großer Spekulanten an der Terminbörse Comex, deren Anteil am Gold-Futures-Handel aber hoch bleibe.',
        'Der Silberpreis stieg laut einer weiteren Goldreporter-Meldung vom 18. September um 2,3 Prozent.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Eine stabile Positionierung großer Terminmarkt-Akteure sagt nichts über die künftige Preisrichtung, zeigt aber, wie viel Handelsvolumen sich derzeit auf wenige große Adressen konzentriert.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['gold', 'silber'],
      sources: [
        {
          label:
            'Goldreporter, Top-News, Meldung vom 20.09.2026: „Goldmarkt: Goldpreis erholt, US-Terminmarkt-Positionierung bleibt stabil"',
          url: 'https://www.goldreporter.de/',
        },
        {
          label:
            'Goldreporter, 18. September 2026: „Goldpreis heute: Erholung setzt sich fort – Silber steigt um 2,3 Prozent"',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline: 'Rekordzuflüsse bei UCITS-ETFs: 43 Milliarden Euro im August',
      summary: [
        'In UCITS-ETFs flossen laut wallstreet-online allein im August 43 Milliarden Euro; die Meldung wirft die Frage auf, ob damit ein Rekordjahr für die Fondsgattung bevorsteht. Weitere Angaben nennt die Quelle nicht.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Hohe Mittelzuflüsse zeigen, wie gefragt ETFs bei Anlegern sind, sagen für sich genommen aber nichts darüber, in welche Märkte oder Anlageklassen das Geld tatsächlich fließt.',
      relatedTopics: ['etf'],
      relatedSymbols: ['etf-msci-world'],
      sources: [
        {
          label:
            'wallstreet-online, Nachrichten: Aktien & Indizes, Stand 21.09.2026: „Rekordzuflüsse bei UCITS-ETFs: 43 Milliarden Euro allein im August: Steht ein ETF-Rekordjahr bevor?"',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
