import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-01.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-01 00:10 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-01',
  intro:
    'Die deutsche Inflation springt über drei Prozent, US-Anleiherenditen erreichen den höchsten Stand seit 2007, und Öl und Gold laufen auseinander.',
  top: [
    {
      headline:
        'Deutsche Inflation steigt auf 3,3 Prozent, Dax verliert im September vier Prozent',
      summary: [
        'Die deutschen Verbraucherpreise sind im September um 3,3 Prozent gestiegen. Im August waren es noch 2,9 Prozent. Das ist der höchste Wert seit Ende 2023.',
        'Als Treiber gelten hohe Energiepreise. Der Dax schloss den Monat mit einem Minus von vier Prozent ab.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Eine Inflation über drei Prozent verengt den Spielraum der Europäischen Zentralbank für weitere Zinssenkungen.',
      relatedTopics: ['inflation', 'notenbanken-geldpolitik'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'onvista: Aktien Frankfurt Schluss – Dax beendet schwachen September im Minus, 30.09.2026',
          url: 'https://www.onvista.de/news/2026/09-30-roundup-aktien-frankfurt-schluss-dax-beendet-schwachen-september-im-minus-0-10-26559233',
        },
      ],
    },
    {
      headline: 'Dow verliert trotz guter US-Inflationsdaten, Tech-Werte legen zu',
      summary: [
        'Die US-Inflationsdaten fielen am Mittwoch besser aus als erwartet. Der technologielastige Nasdaq 100 stieg um 0,23 Prozent.',
        'Der Dow Jones fiel dennoch um 0,86 Prozent, auf 50.906 Punkte. Für den September bedeutet das den ersten Monatsverlust seit fünf Monaten, rund vier Prozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dass Tech-Werte und der Dow am selben Tag unterschiedlich reagieren, zeigt, wie verschieden beide Indizes zusammengesetzt sind.',
      relatedTopics: ['inflation', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dow-jones', 'nasdaq-100'],
      sources: [
        {
          label:
            'onvista: Aktien New York Schluss – Dow unter Druck, gute Inflationsdaten verpuffen, 30.09.2026',
          url: 'https://www.onvista.de/news/2026/09-30-aktien-new-york-schluss-dow-unter-druck-gute-inflationsdaten-verpuffen-0-10-26559261',
        },
      ],
    },
    {
      headline: 'US-Anleiherendite auf höchstem Stand seit 2007',
      summary: [
        'Die Rendite zehnjähriger US-Staatsanleihen liegt bei knapp 5,3 Prozent. Das ist der höchste Stand seit 2007.',
        'Allein im September stieg sie um mehr als 47 Basispunkte. Eine Analyse nennt sechs Prozent als mögliches nächstes Ziel.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Steigende, als sicher geltende Anleiherenditen machen hoch bewertete Wachstumsaktien im Vergleich weniger attraktiv.',
      relatedTopics: ['staatsanleihe', 'notenbanken-geldpolitik'],
      relatedSymbols: ['sp500'],
      sources: [
        {
          label:
            'wallstreet-online: Immobilien-Crash voraus – Der wichtigste Zins der Welt könnte schon bald über 6 % steigen, 30.09.2026',
          url: 'https://www.wallstreet-online.de/nachricht/21456528-immobilien-crash-voraus-wichtigste-zins-welt-6',
        },
      ],
    },
    {
      headline:
        'Ölpreis beendet das Quartal rund 40 Prozent höher, Gold bricht den Trend',
      summary: [
        'Brent-Öl kostet zum Quartalsende knapp 98 Dollar je Barrel. Vor Kriegsbeginn im Iran Ende Februar waren es noch rund 72 Dollar.',
        'Der Goldpreis lief in die andere Richtung. Er fiel unter die 50-Tage-Linie, auf zuletzt rund 4.150 Dollar je Feinunze.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Gold reagiert derzeit stärker auf steigende Anleiherenditen als auf die geopolitische Lage, während der Ölpreis das Angebot aus der Krisenregion direkt abbildet.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'gold'],
      sources: [
        {
          label:
            'boersennews.de: Ölpreis zum Quartalsende – Iran-Krieg hat den Markt verändert, 30.09.2026',
          url: 'https://www.boersennews.de/nachrichten/artikel/boersennews/oelpreis-zum-quartalsende-iran-krieg-hat-den-markt-veraendert/5295124/',
        },
        {
          label: 'goldreporter.de: Goldpreis – Kurzfristige Trends gebrochen, 30.09.2026',
          url: 'https://www.goldreporter.de/goldpreis-kurzfristige-trends-gebrochen-30-09-2026/charttechnik/262171/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Micron hebt Prognose an, Aktie reagiert kaum',
      summary: [
        'Der Speicherchip-Hersteller Micron erwartet für das kommende Quartal einen Umsatz von bis zu 63 Milliarden Dollar. Analysten hatten mit 56,8 Milliarden gerechnet.',
        'Die Aktie legte im nachbörslichen Handel trotzdem höchstens ein Prozent zu. Seit Jahresbeginn steht bereits ein Plus von rund 300 Prozent zu Buche.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Nach einer Vervielfachung des Kurses seit Jahresbeginn steckt in der Aktie bereits viel Optimismus, selbst eine starke Prognose bewegt dann wenig.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['nasdaq-100'],
      sources: [
        {
          label:
            'finanznachrichten.de: Micron überrascht mit Umsatzoptimismus – Aktienkurs legt dennoch nur leicht zu, 30.09.2026',
          url: 'https://www.finanznachrichten.de/nachrichten-2026-09/69723087-micron-ueberrascht-mit-umsatzoptimismus-aktienkurs-legt-dennoch-nur-leicht-zu-016.htm',
        },
      ],
    },
    {
      headline: 'Kanzler Merz sagt Investoren Reformen zu',
      summary: [
        "Bundeskanzler Merz hat sich mit der Initiative 'Made for Germany' in der Berliner Siemens-Zentrale getroffen. Der Bedarf an Strukturreformen sei groß, sagte er.",
        'Als Felder nannte er den Arbeitsmarkt, den EU-Binnenmarkt und die Rente. Einen Zeitplan nennt die Meldung nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Ankündigung wird erst zur Reform, wenn ihr ein Gesetz mit Zeitplan folgt, daran lässt sich die Zusage später messen.',
      relatedTopics: ['wie-funktioniert-der-markt'],
      relatedSymbols: ['siemens'],
      sources: [
        {
          label: 'ariva.de: ROUNDUP – Merz sagt Investoren Reformen zu, 30.09.2026',
          url: 'https://www.ariva.de/news/merz-sagt-investoren-reformen-zu-12154216',
        },
      ],
    },
    {
      headline: 'Deutschlands Auslandsvermögen erreicht Rekordwert',
      summary: [
        'Deutschlands Netto-Auslandsvermögen stieg Ende 2025 auf 3.661 Milliarden Euro. Das sind rund 81 Prozent der Wirtschaftsleistung.',
        'Ein starker Euro bremste den Zuwachs. Ohne die Aufwertung gegenüber Dollar, Yen und Pfund wäre das Plus größer ausgefallen, teilte die Bundesbank mit.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Ein stärkerer Euro schmälert rechnerisch den Wert von Auslandsvermögen, unabhängig davon, wie sich die zugrunde liegenden Investitionen tatsächlich entwickelt haben.',
      relatedTopics: ['waehrungen-wechselkurse'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'bundesbank.de: Pressemitteilung – Das deutsche Auslandsvermögen Ende 2025, 30.09.2026',
          url: 'https://www.bundesbank.de/de/presse/pressemitteilungen/das-deutsche-auslandsvermoegen-ende-2025--1009822',
        },
      ],
    },
  ],
}
