import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-24.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-24 00:15 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-24',
  intro:
    'Ein brennendes Frachtschiff vor Hormus lässt den Ölpreis über 100 Dollar springen, Wall Street und Dax geben nach, und heute steht der deutsche Ifo-Index an.',
  top: [
    {
      headline: 'Ifo-Geschäftsklima und Reden von Fed und EZB stehen heute an',
      summary: [
        'Um 10 Uhr veröffentlicht das ifo-Institut das Geschäftsklima für die deutsche Wirtschaft; Analysten erwarten einen Anstieg auf 89 Punkte nach zuvor 88,8 Punkten, die Teilindizes für Lage und Erwartungen liegen bei 89 nach 88,5 und bei 89,3 nach 89,1.',
        'Vor der Veröffentlichung spricht um 9:15 Uhr EZB-Direktoriumsmitglied Isabel Schnabel, um 10:10 Uhr äußert sich Fed-Präsident John C. Williams und um 11 Uhr EZB-Chefvolkswirt Philip Lane.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Der ifo-Index gilt als früher Hinweis auf die deutsche Konjunktur und fließt zusammen mit den Aussagen von Notenbankern in die Erwartungen an die künftige Zinspolitik ein.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['dax', 'euro-stoxx-50'],
      sources: [
        {
          label:
            'wallstreet-online, Wichtige Termine / Kommende Termine, Stand 24.09.2026, 00:15 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Frachtschiff brennt vor Hormus – Ölpreis schnellt über 100 Dollar',
      summary: [
        'In der Straße von Hormus steht laut einer Behördenmeldung ein Frachtschiff in Flammen; Bundesaußenminister Wadephul forderte den Iran auf, die Blockade der Meerenge zu beenden.',
        'Die Ölsorte Brent stieg in der Nacht auf Donnerstag laut wallstreet-online um 4,87 Prozent auf 103,43 US-Dollar und damit erstmals seit fünf Tagen wieder über die Marke von 100 Dollar.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Durch die Straße von Hormus wird ein großer Teil der weltweiten Ölexporte verschifft, weshalb der Preis schon auf die Möglichkeit einer Blockade reagiert, nicht erst auf tatsächlich ausgefallene Lieferungen.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'wallstreet-online, Wirtschaftsnachrichten, Stand 24.09.2026, 00:15 Uhr: „Behörde: Frachtschiff in der Straße von Hormus in Flammen“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'wallstreet-online, Rohstoffpreise / Kursleiste, Stand 24.09.2026, 00:15 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'USA schieben neue Sonderzölle gegen China erneut auf',
      summary: [
        'Die US-Regierung hat zusätzliche Zölle gegen China einer Meldung von dpa-AFX zufolge erneut aufgeschoben; um welche Zölle es sich handelt und auf welchen Termin sie verschoben wurden, blieb in der Kurzmeldung offen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Selbst ein Zoll, der letztlich nie erhoben wird, beeinflusst Investitionsentscheidungen, solange Unternehmen mit ihm rechnen müssen – eine wiederholte Verschiebung verlängert diese Unsicherheit.',
      relatedTopics: ['wie-funktioniert-der-markt'],
      relatedSymbols: ['dax', 'nasdaq-100'],
      sources: [
        {
          label:
            'onvista, Aktuelle News, Meldung vom 23.09.2026, 23:24 Uhr, dpa-AFX: „US-Regierung: Zusatzzölle gegen China erneut aufgeschoben“',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline:
        'Steigende Ölpreise drücken Wall Street und Dax, der Euro fällt auf ein Vier-Monats-Tief',
      summary: [
        'Die US-Börsen schlossen am Mittwoch schwächer, Dow Jones, S&P 500 und Nasdaq gaben laut dpa-AFX nach; auch der Dax schloss in Frankfurt mit Verlusten, in beiden Fällen wegen steigender Ölpreise.',
        'Der Euro fiel laut dpa-AFX unter 1,14 US-Dollar und damit auf den tiefsten Stand seit Ende Juli; in der Nacht auf Donnerstag zeigte die Kursleiste von finanzen.net den Dax bei 25.411 Punkten, ein Minus von 0,7 Prozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Unterschiedliche Kursanbieter können für denselben Index je nach Zeitpunkt und Handelsplatz verschiedene Prozentangaben zeigen – wichtig für alle, die eine einzelne zitierte Zahl einordnen wollen.',
      relatedTopics: ['wie-funktioniert-der-markt', 'waehrungen-wechselkurse'],
      relatedSymbols: ['dax', 'dow-jones', 'nasdaq-100', 'eur-usd'],
      sources: [
        {
          label:
            'onvista, Index-Analysen, Meldung vom 23.09.2026, dpa-AFX: „ROUNDUP/Aktien New York Schluss: Schwächer - Steigende Ölpreise verunsichern“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'wallstreet-online, Devisennachrichten, Meldung vom 23.09.2026, dpa-AFX: „Devisen: Eurokurs fällt unter 1,14 US-Dollar auf tiefsten Stand seit Ende Juli“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Gold hält sich, Silber bricht in derselben Nacht deutlich ein',
      summary: [
        'Gold notierte in der Nacht auf Donnerstag laut wallstreet-online bei 4.289 US-Dollar, ein Plus von 0,03 Prozent, während Silber im selben Zeitraum um 3,86 Prozent auf 64,49 US-Dollar fiel.',
        'Bereits am Mittwoch war der Goldpreis laut Goldreporter unter 4.350 US-Dollar gefallen, mit Blick der Märkte auf US-Zinsen, Gespräche mit dem Iran und ein Treffen zwischen Trump und Xi.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Gold und Silber werden oft gemeinsam als Edelmetalle gehandelt, doch Silber hat durch seine industrielle Nutzung eine andere Nachfragebasis – deshalb können sich beide Preise auch gegenläufig entwickeln.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['gold', 'silber'],
      sources: [
        {
          label:
            'wallstreet-online, Rohstoffpreise / Kursleiste, Stand 24.09.2026, 00:15 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'Goldreporter, Marktberichte, Meldung vom 23.09.2026: „Der Goldpreis startet am Mittwoch erneut schwächer. Brent fällt unter 100 USD. Im Fokus stehen US-Zinsen, Iran-Gespräche und das Treffen Trump–Xi.“',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline:
        'Berkshire baut Beteiligung an Immobilienentwickler trotz Kursverlust von 32 Prozent aus',
      summary: [
        'Berkshire Hathaway hat laut wallstreet-online eine fast zehnprozentige Beteiligung am Immobilienentwickler Lennar mit Sitz in Miami aufgebaut, dessen Aktie innerhalb eines Jahres rund 32 Prozent verloren hat.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Dass ein bekannter Großinvestor eine stark gefallene Aktie aufstockt, zeigt eine einzelne Einschätzung zu einem bestimmten Zeitpunkt – keine Prognose für den weiteren Kursverlauf.',
      relatedTopics: ['aktie', 'anlegerpsychologie'],
      relatedSymbols: ['berkshire', 'lennar'],
      sources: [
        {
          label:
            'wallstreet-online, Nachrichten: Aktien & Indizes, Stand 24.09.2026, 00:15 Uhr: „Buffett-Nachfolger am Ruder: Berkshire kauft diese Absturz-Aktie nach“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
