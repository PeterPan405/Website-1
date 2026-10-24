import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-24.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-24 00:52 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-24',
  intro:
    "Moody's lässt Frankreichs Rating trotz Schuldenkrise unverändert, Brentöl steigt auf ein Sechsmonatshoch, und Munich Re hebt die Gewinnprognose an.",
  top: [
    {
      headline: "Moody's bestätigt Frankreichs Rating trotz Schuldenkrise",
      summary: [
        "Die Ratingagentur Moody's hat Frankreichs Kreditwürdigkeit am Freitag bestätigt.",
        'Das Rating bleibt bei Aa3, sieben Stufen über Ramschniveau.',
        "Den Ausblick senkte Moody's aber von stabil auf negativ.",
        'Die Rendite zehnjähriger französischer Staatsanleihen stieg zuvor über 5 Prozent.',
        'Das ist der höchste Stand seit dem Jahr 2002.',
        'Die Ökonomen der Bank ING sprachen von einem „Zugunglück in Zeitlupe“.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Herabstufung hätte Frankreichs Finanzierungskosten weiter erhöht; der negative Ausblick zeigt aber, dass die Agentur die Lage kritisch beobachtet.',
      relatedTopics: ['staatsanleihe', 'schulden-und-kredit'],
      relatedSymbols: ['cac-40', 'dax'],
      sources: [
        {
          label:
            "Handelsblatt, Märkte/Anleihen, Friederike Hofmann und Andreas Neuhaus, Meldung vom 23.10.2026, 23:48 Uhr: „Staatsfinanzen: Frankreichs Schuldenkrise verschärft sich – Moody's hält Kreditrating trotzdem stabil“",
          url: 'https://www.handelsblatt.com/finanzen/maerkte/anleihen/frankreich-moodys-haelt-kreditrating-trotz-schuldenkrise-stabil/100264304.html',
        },
        {
          label:
            "CNBC, Meldung vom 23.10.2026, 22:49 Uhr GMT: „Moody's holds steady on France's credit rating as country grapples with turmoil and higher yields“",
          url: 'https://www.cnbc.com/2026/10/23/moodys-holds-steady-on-frances-credit-rating-as-country-grapples-with-turmoil-and-higher-yields.html',
        },
      ],
    },
    {
      headline:
        'Brentöl erreicht Sechsmonatshoch – Trump wirft Iran Marktmanipulation vor',
      summary: [
        'Die Ölsorte Brent ist am Freitag weiter gestiegen.',
        'Sie kostete zeitweise 116,83 Dollar pro Barrel, ein Plus von 3,3 Prozent.',
        'Das ist nach Angaben von CNBC der höchste Stand seit sechs Monaten.',
        'US-Präsident Trump warf Iran am Donnerstag vor, den Ölmarkt zu manipulieren.',
        'Welche Belege er dafür nannte, blieb in der Meldung offen.',
        'Die US-Notenbank entscheidet kommende Woche über ihren Leitzins.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein teurerer Ölpreis verteuert Sprit, Heizkosten und Vorprodukte gleichzeitig und erschwert es Notenbanken, die Inflation weiter zu senken.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'dax'],
      sources: [
        {
          label:
            'CNBC, Meldung vom 23.10.2026, 19:21 Uhr GMT: „Brent crude oil tops $116, a six-month high, as tensions swell in the Middle East“',
          url: 'https://www.cnbc.com/2026/10/23/oil-price-brent-wti-iran-war-saudi-arabia.html',
        },
        {
          label:
            'WirtschaftsWoche, Finanzen, Sören Imöhl, Live-Ticker vom 23.10.2026, 16:01 Uhr: „Ölpreis aktuell: Ölpreise steigen weiter“',
          url: 'https://www.wiwo.de/finanzen/oelpreis-aktuell-oelpreise-steigen-weiter-fed-zinsentscheid-im-fokus/100207502.html',
        },
      ],
    },
    {
      headline: 'Munich Re verdient mehr als erwartet, Jahresziel steigt',
      summary: [
        'Der Rückversicherer Munich Re hat im dritten Quartal mehr verdient als erwartet.',
        'Der vorläufige Gewinn liegt bei rund 1,7 Milliarden Euro.',
        'Analysten hatten im Schnitt nur 1,48 Milliarden Euro erwartet.',
        'Munich Re hebt deshalb die Jahresprognose von 6,3 auf 6,6 Milliarden Euro an.',
        'Großschäden blieben im Quartal unter dem langjährigen Durchschnitt.',
        'Die endgültigen Zahlen folgen am 12. November.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Prognoseanhebung beruht hier auf wenigen Großschäden im Quartal – reiner Zufall, der sich im nächsten Quartal ebenso schnell umkehren kann.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['munich-re', 'dax'],
      sources: [
        {
          label:
            'Munich Re, Medieninformation vom 23.10.2026: „Munich Re erzielt Quartalsergebnis von 1,7 Mrd. € und erhöht Jahresziel“',
          url: 'https://www.munichre.com/de/unternehmen/media-relations/medieninformationen-und-unternehmensnachrichten/medieninformationen/2026/media-release-2026-10-23.html',
        },
        {
          label:
            'Handelsblatt, Banken/Versicherungen/Versicherer, Meldung vom 23.10.2026, 13:39 Uhr: „Rückversicherung: Munich Re hebt nach starkem Quartal die Prognose“',
          url: 'https://www.handelsblatt.com/finanzen/banken-versicherungen/versicherer/rueckversicherung-munich-re-hebt-nach-starkem-quartal-die-prognose/100264519.html',
        },
      ],
    },
    {
      headline: 'American Express streicht 3500 Stellen trotz höherer Gewinnprognose',
      summary: [
        'American Express streicht rund 3500 Stellen.',
        'Das sind etwa fünf Prozent der weltweit 78.000 Beschäftigten.',
        'Konzernchef Steve Squeri nannte steigende Kosten als Grund.',
        'Nach CNBC-Angaben soll der Abbau den Konzern auf Künstliche Intelligenz vorbereiten.',
        'Dafür verbuchte Amex im dritten Quartal 336 Millionen Dollar Restrukturierungskosten.',
        'Die Gewinnprognose für 2026 stieg trotzdem auf 18,30 bis 18,60 Dollar pro Aktie.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Stellenabbau und eine höhere Gewinnprognose schließen sich nicht aus, wenn Technologie Arbeit ersetzt und zugleich Kosten senkt.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['dow-jones'],
      sources: [
        {
          label:
            'Handelsblatt, Banken/Versicherungen/Banken, Meldung vom 23.10.2026, 17:07 Uhr: „Banken: American Express streicht 3500 Stellen“',
          url: 'https://www.handelsblatt.com/finanzen/banken-versicherungen/banken/banken-american-express-streicht-3500-stellen/100264576.html',
        },
        {
          label:
            "CNBC, Meldung vom 23.10.2026, 18:57 Uhr GMT: „American Express is cutting 5% of its workforce to 'prepare for AI'“",
          url: 'https://www.cnbc.com/2026/10/23/american-express-job-cuts.html',
        },
      ],
    },
    {
      headline: 'Deutsches Baugewerbe meldet höchsten Auftragssprung seit 1991',
      summary: [
        'Das deutsche Bauhauptgewerbe hat im August so viele Aufträge erhalten wie nie zuvor.',
        'Der saisonbereinigte Auftragseingang stieg um 23 Prozent zum Vormonat.',
        'Das ist der höchste Anstieg seit Beginn der Erhebung 1991.',
        'Besonders stark wuchs der Tiefbau, mit einem Plus von 31,6 Prozent.',
        'Destatis nennt mehrere einzelne Großaufträge als Grund.',
        'Die Stimmung im Wohnungsbau bleibt laut Tagesschau trotzdem gedämpft.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ein einzelner Rekordmonat bei Großaufträgen sagt wenig über die breite Lage am Wohnungsmarkt aus, wo viele kleinere Bauherren weiter zurückhaltend sind.',
      relatedTopics: ['immobilien'],
      relatedSymbols: ['vonovia'],
      sources: [
        {
          label:
            'Statistisches Bundesamt (Destatis), Pressemitteilung Nr. 375 vom 23.10.2026: „Auftragseingang im Bauhauptgewerbe im August 2026: +23,0 % zum Vormonat“',
          url: 'https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/10/PD26_375_441.html',
        },
        {
          label:
            'Tagesschau, Wirtschaft/Konjunktur, Meldung vom 23.10.2026, 13:53 Uhr: „Deutsche Baubranche verzeichnet Rekordanstieg bei Großaufträgen“',
          url: 'https://www.tagesschau.de/wirtschaft/konjunktur/baugewerbe-grossauftraege-100.html',
        },
      ],
    },
  ],
  further: [],
}
