import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-26.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-26 00:12 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-26',
  intro:
    'Frankreichs Schuldenkrise treibt die Zinsen, der ifo-Index kommt heute, Audi baut in den USA, drei Tech-Riesen legen Zahlen vor.',
  top: [
    {
      headline: "Moody's hält Frankreich-Rating – Rendite auf höchstem Stand seit 2002",
      summary: [
        "Die Ratingagentur Moody's hat Frankreichs Kreditnote am Freitag unverändert bei Aa3 belassen. Der Ausblick bleibt negativ. Am Anleihemarkt zeigt sich trotzdem wenig Vertrauen: Die Rendite zehnjähriger Anleihen stieg erstmals seit 2002 über fünf Prozent.",
        'Der Risikoaufschlag gegenüber deutschen Anleihen erreichte den höchsten Stand seit der Eurokrise. Die ING-Bank nennt die Entwicklung ein „Zugunglück in Zeitlupe".',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Steigende Anleiherenditen verteuern die Schuldenaufnahme eines Staates unmittelbar und wirken wie eine schleichende zweite Herabstufung, auch ohne Entscheidung einer Ratingagentur.',
      relatedTopics: ['staatsanleihe', 'notenbanken-geldpolitik'],
      relatedSymbols: ['cac-40'],
      sources: [
        {
          label:
            'Handelsblatt, 23.10.2026, 23:48 Uhr: „Frankreichs Schuldenkrise verschärft sich – Moody\'s hält Kreditrating trotzdem stabil"',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/anleihen/frankreich-moodys-haelt-kreditrating-trotz-schuldenkrise-stabil/100264304.html',
        },
        {
          label:
            'Tagesschau, 23.10.2026, 11:13 Uhr: „Frankreichs Schuldenkrise: Droht eine neue Eurokrise?"',
          url: 'https://www.tagesschau.de/wirtschaft/finanzen/frankreich-anleiherenditen-schuldenkrise-eurokrise-ezb-100.html',
        },
      ],
    },
    {
      headline: 'Ifo-Institut veröffentlicht heute den Geschäftsklimaindex für Oktober',
      summary: [
        'Das ifo-Institut veröffentlicht heute um 10:30 Uhr den Geschäftsklimaindex für Oktober. Im September war die Stimmung in deutschen Unternehmen bereits gestiegen, auf 89,9 Punkte nach 88,8 im August.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der ifo-Index gilt als Frühindikator für die deutsche Konjunktur und bewegt häufig den Euro und deutsche Zinspapiere, weil er Erwartungen anpasst, bevor harte Wirtschaftsdaten vorliegen.',
      relatedTopics: ['wie-funktioniert-der-markt'],
      relatedSymbols: ['dax', 'eur-usd'],
      sources: [
        {
          label: 'ifo Institut, ifo-Geschäftsklima Deutschland, abgerufen 26.10.2026',
          url: 'https://www.ifo.de/umfrage/ifo-geschaeftsklima-deutschland',
        },
        {
          label:
            'Lebensmittel Praxis, 25.09.2026: „Konjunkturbarometer: ifo-Geschäftsklima steigt im September deutlich"',
          url: 'https://lebensmittelpraxis.de/handel-aktuell/49918-konjunkturbarometer-ifo-geschaeftsklima-steigt-im-september-deutlich.html',
        },
      ],
    },
    {
      headline:
        'Audi errichtet erstes eigenes US-Werk – vier Milliarden Dollar in Georgia',
      summary: [
        'Audi baut in Perry im US-Bundesstaat Georgia sein erstes eigenes Werk in den USA. Trump kündigte die Vier-Milliarden-Dollar-Investition am Samstag auf einer Wahlkampfveranstaltung an, mit Audi-Chef Gernot Döllner an seiner Seite.',
        'Geplant sind bis zu 200.000 Fahrzeuge im Jahr und rund 4.500 Arbeitsplätze. Audi zahlte zuletzt etwa 1,2 Milliarden Euro US-Zölle im Jahr, weil der Konzern bislang jedes US-Fahrzeug aus Europa oder Mexiko importiert.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die Investition zeigt, wie US-Zölle Konzerne zu teuren Standortentscheidungen zwingen – eine Vorabinvestition in Milliardenhöhe gegen laufende Zollkosten über viele Jahre.',
      relatedTopics: ['aktien-laender-branchen'],
      relatedSymbols: ['volkswagen'],
      sources: [
        {
          label:
            'CNBC, 25.10.2026: „Audi defends plans for a $4 billion Georgia plant amid VW restructuring, tariffs"',
          url: 'https://www.cnbc.com/2026/10/25/audi-georgia-us-plant-tariffs-volkswagen.html',
        },
        {
          label:
            'Reuters via Lufkin Daily News, 25.10.2026: „Audi defends decision to stand by Trump on $4 billion US factory in Georgia"',
          url: 'https://lufkindailynews.com/news_reuters/top_news/audi-defends-decision-to-stand-by-trump-on-4-billion-us-factory-in-georgia/article_30157037-d43c-5356-a51e-4c8d73948bbf.html',
        },
      ],
    },
  ],
  further: [
    {
      headline:
        'Alphabet, Microsoft und Amazon legen diese Woche ihre Quartalszahlen vor',
      summary: [
        'Alphabet und Microsoft berichten am Mittwoch über das dritte Quartal, Amazon folgt am Donnerstag. Analysten erwarten bei Alphabet rund 127,85 Milliarden Dollar Umsatz, bei Microsoft 90,72 Milliarden und bei Amazon 202,2 Milliarden Dollar.',
        'Der Optionsmarkt preist Kursausschläge von fünf bis acht Prozent am Tag danach ein. Microsoft wandelte sich zuletzt von einem Nettovermögen in eine Nettoschuld, Amazons freier Cashflow war zwei Quartale negativ.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die Zahlen zeigen, wie stark die Investitionen in Künstliche Intelligenz inzwischen die Bilanzen selbst der größten Technologiekonzerne verändern – vom Nettovermögen zur Nettoschuld.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['alphabet', 'microsoft', 'amazon'],
      sources: [
        {
          label:
            'wallstreet-online, 25.10.2026, 10:00 Uhr: „Earnings Preview: Retten Alphabet, Microsoft und Amazon den Markt jetzt vor dem Totalabsturz?"',
          url: 'https://www.wallstreet-online.de/nachricht/21552146-earnings-preview-retten-alphabet-microsoft-amazon-markt-totalabsturz',
        },
        {
          label: 'InsiderFinance, 2026: „Alphabet Q3 2026 Earnings Preview"',
          url: 'https://www.insiderfinance.io/news/alphabet-q3-2026-earnings-preview',
        },
      ],
    },
    {
      headline:
        'Verdi ruft vor zweiter Verhandlungsrunde zu Warnstreiks bei Privatbanken auf',
      summary: [
        'Die Gewerkschaft Verdi ruft zu bundesweiten Warnstreiks bei privaten Banken auf. Rund 150.000 Beschäftigte sind betroffen. Die erste Verhandlungsrunde am 8. Oktober endete ohne Angebot der Arbeitgeber.',
        'Verdi fordert sechs Prozent mehr Gehalt bei zwölf Monaten Laufzeit. Die zweite Runde findet am 2. November in Frankfurt statt, eine dritte am 23. November in Berlin.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Tarifabschluss in diesem Umfang wirkt sich auf die Kostenbasis der Banken aus und ist damit auch für die Gebühren- und Zinspolitik der Institute relevant.',
      relatedTopics: ['geldsystem'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'Handelsblatt, 23.10.2026, 11:47 Uhr: „Banken: Verdi ruft zu bundesweiten Warnstreiks bei privaten Banken auf"',
          url: 'https://www.handelsblatt.com/finanzen/banken-versicherungen/banken/banken-verdi-ruft-zu-bundesweiten-warnstreiks-bei-privaten-banken-auf/100264474.html',
        },
        {
          label:
            'DGB-Tarifticker, 08.10.2026: „Tarifrunde private Banken startet ohne Arbeitgeberangebot"',
          url: 'https://www.dgb.de/service/weiterer-service/tarifmeldungen/tarifmeldung/tarifrunde-private-banken-startet-ohne-arbeitgeberangebot/',
        },
      ],
    },
  ],
}
