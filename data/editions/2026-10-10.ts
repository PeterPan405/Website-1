import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-10.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-10 00:44 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-10',
  intro:
    'Trump schwenkt beim Iran und bei russischem Diesel um, Frankreichs Anleihen beruhigen sich, und der Dax klettert zurück über 25.000 Punkte.',
  top: [
    {
      headline: 'Trump verschiebt möglichen Iran-Angriff auf die Zeit nach den Midterms',
      summary: [
        'Donald Trump will vor den US-Zwischenwahlen keine Angriffe auf den Iran mehr.',
        'Das berichtete wallstreet-online am Freitagmorgen. Ein dritter amerikanischer Flugzeugträger ist unterwegs in die Region.',
        'Einen Zeitplan für die Fahrt nennt die Übersicht nicht. Auch zu den Zielen äußert sie sich nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Angriff auf den Iran gilt an den Rohstoffmärkten als Risiko für Öllieferungen durch die Straße von Hormus. Bleibt er aus, sinkt kurzfristig die Sorge vor einem Angebotsschock – auch wenn die Spannungen insgesamt bestehen bleiben.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'wallstreet-online, Politik- und Rohstoffnachrichten, Stand 10.10.2026 00:44 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline:
        'Trump kündigt russische Diesellieferungen an, Selenskyj übt scharfe Kritik',
      summary: [
        'Donald Trump hat Diesellieferungen aus Russland angekündigt.',
        'Das meldete dpa-AFX. Der ukrainische Präsident Wolodymyr Selenskyj kritisierte den Deal daraufhin scharf.',
        'Details zu Mengen, Zeitplan oder der genauen Kritik nennen die gesichteten Agenturmeldungen nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Energielieferungen aus Russland sind seit dem Angriff auf die Ukraine politisch hochsensibel. Jede neue Ankündigung berührt die Frage, wie weit westliche Sanktionen gegen russische Energieexporte noch greifen.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label: 'onvista, News-Ticker vom 09.10.2026, 20:25 Uhr (dpa-AFX)',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline:
        'Französische Anleihen entspannen sich, DWS erwartet keine neue Eurokrise',
      summary: [
        'Frankreichs Anleihemarkt hat sich am Donnerstag etwas beruhigt.',
        'Das meldeten dpa-AFX und Reuters zum europäischen Börsenschluss, ohne einen genauen Grund zu nennen.',
        'Die DWS erwartet nach Angaben von wallstreet-online trotz Frankreichs Schuldenproblem keine neue Eurokrise. Eine Begründung dafür nennt die Meldung nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Steigende Risikoaufschläge für französische Staatsanleihen gelten als Test für den Zusammenhalt der Eurozone. Eine Entspannung an einem einzelnen Handelstag sagt noch nichts darüber, ob sich das zugrunde liegende Haushaltsproblem löst.',
      relatedTopics: ['staatsanleihe'],
      relatedSymbols: ['cac-40'],
      sources: [
        {
          label: 'onvista, News-Ticker vom 09.10.2026, 16:22 Uhr (dpa-AFX)',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Dax überspringt wieder die Marke von 25.000 Punkten',
      summary: [
        'Der Dax hat die Marke von 25.000 Punkten zurückerobert.',
        'Dpa-AFX und Reuters nennen als Grund eine Verschnaufpause bei Öl- und Anleihekursen. Auch der französische Anleihemarkt entspannte sich zeitweise.',
        'Zuletzt stand der Index laut wallstreet-online bei 25.170,31 Punkten, ein Plus von 0,80 Prozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine runde Marke wie 25.000 Punkte hat keinen eigenen wirtschaftlichen Wert. An der Börse wirkt sie trotzdem oft als psychologischer Orientierungspunkt für weitere Käufe oder Verkäufe.',
      relatedTopics: ['staatsanleihe'],
      relatedSymbols: ['dax', 'brent'],
      sources: [
        {
          label:
            'onvista, News-Ticker vom 09.10.2026, 16:05 und 16:20 Uhr (dpa-AFX, Reuters)',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Dow und Nasdaq legen trotz KI-Sorgen zu',
      summary: [
        'Die US-Börsen schlossen am Donnerstag im Plus.',
        'Dpa-AFX nannte sinkende Ölpreise und Sorgen um Künstliche Intelligenz als Hintergrund. Der US 30 gewann 0,89 Prozent auf 51.683,33 Punkte.',
        'Der US Tech 100 legte um 0,50 Prozent auf 30.887,05 Punkte zu. Das zeigt die aktuelle Kursleiste von wallstreet-online.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dass ein Technologieindex trotz einer Schlagzeile über KI-Sorgen zulegt, zeigt: Ein belastendes Thema wirkt nicht automatisch auf den gesamten Index, wenn einzelne Schwergewichte anders laufen als die Stimmung vermuten lässt.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['dow-jones', 'nasdaq-100'],
      sources: [
        {
          label: 'onvista, News-Ticker vom 09.10.2026, 18:09 und 20:21 Uhr (dpa-AFX)',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Gold steigt Richtung 4.200 Dollar, Anleiherenditen ziehen trotzdem an',
      summary: [
        'Der Goldpreis ist zuletzt kräftig gestiegen.',
        'Das berichtet Goldreporter. Die Marke von 4.200 Dollar je Feinunze rückte damit näher, einen Tag nach einer Stabilisierung bei 4.100 Dollar.',
        'Zuletzt notierte die Feinunze laut wallstreet-online bei 4.195,82 Dollar. China stockte seine Goldreserven im September laut Goldreporter erneut auf.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Steigende Anleiherenditen verteuern normalerweise das zinslose Halten von Gold und drücken den Preis. Legt er trotzdem zu, deutet das auf Nachfrage hin, die über reine Zinsüberlegungen hinausgeht.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label: 'goldreporter.de, Marktbericht vom 9. Oktober 2026',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline: 'SDax tauscht Mitglied: Procredit ersetzt Nagarro ab 14. Oktober',
      summary: [
        'Der SDax bekommt ab dem 14. Oktober ein neues Mitglied.',
        'Procredit ersetzt Nagarro. Das meldete dpa-AFX im Rahmen seines Index-Monitors. Einen Grund für den Tausch nennt die Agentur nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Fonds, die den SDax nachbilden, müssen ihre Bestände wegen des Wechsels anpassen. Das kann für beide Aktien kurzfristig Kursschwankungen auslösen, unabhängig von ihrer eigentlichen Geschäftsentwicklung.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['sdax'],
      sources: [
        {
          label:
            'onvista, News-Ticker vom 09.10.2026, 18:20 Uhr (dpa-AFX, Index-Monitor)',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Bundesbank startet einmonatige Kampagne gegen Zahlungsbetrug',
      summary: [
        'Die Bundesbank startet heute eine Kampagne gegen Zahlungsbetrug.',
        'Einen Monat lang informieren Unternehmen aus Finanzwirtschaft, Telekommunikation und Handel sowie öffentliche Institutionen über typische Betrugsmaschen. Das teilte die Bundesbank mit.',
        'Träger sind die Bundesbank und das Bundesministerium der Finanzen.',
      ],
      category: 'Vorsorge',
      whyItMatters:
        'Phishing zielt häufig auf Zugangsdaten zu Bankkonten oder Depots. Wer typische Betrugsmuster kennt, kann verdächtige Nachrichten eher erkennen und einen finanziellen Schaden mitunter noch verhindern.',
      relatedTopics: ['depot-und-broker'],
      relatedSymbols: [],
      sources: [
        {
          label: 'Deutsche Bundesbank, Pressemitteilung vom 08.10.2026',
          url: 'https://www.bundesbank.de/de/presse/pressenotizen',
        },
      ],
    },
  ],
}
