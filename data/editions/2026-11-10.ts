import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-10.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-10 00:47 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-10',
  intro:
    'US-Verbraucherpreise, ein Dax über 26.000 Punkten, Nvidias Nachfolgefrage, Boeings Stellenabbau und die EZB-Nachfolge – der Überblick zum Dienstag.',
  top: [
    {
      headline: 'US-Verbraucherpreise für Oktober im Fokus',
      summary: [
        'Am Dienstag veröffentlicht das US-Arbeitsministerium die Verbraucherpreise für Oktober.',
        'Ökonomen erwarten laut CNBC einen Anstieg der Gesamtrate um 0,3 Prozent zum Vormonat und einen Anstieg der Kernrate um 0,2 Prozent.',
        'Schon der Arbeitsmarktbericht für Oktober war überraschend stark ausgefallen, wie CNBC und Goldreporter berichteten.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Die Kernrate ohne Energie und Lebensmittel gilt als verlässlicherer Maßstab für den Preisdruck und fließt stärker in die Zinsentscheidungen der US-Notenbank ein.',
      relatedTopics: ['inflation'],
      relatedSymbols: ['sp500'],
      sources: [
        {
          label:
            "CNBC, 9.11.2026, 21:03 Uhr: „A key report for where inflation stood in October comes out Tuesday. Here's what to expect“",
          url: 'https://www.cnbc.com/2026/11/09/october-cpi-report-2026-inflation.html',
        },
      ],
    },
    {
      headline: 'Dax über 26.000 Punkten, Ölpreis entlastet die Erholung',
      summary: [
        'Der Dax stieg am Montag über die Marke von 26.000 Punkten und schloss deutlich im Plus.',
        'Getragen wurde die Erholung von fallenden Ölpreisen.',
        'Zugleich legte die italienische Unicredit laut Tagesschau einen Zeitplan vor: Die Übernahme der Commerzbank soll Anfang 2027 abgeschlossen sein.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein fallender Ölpreis verbilligt Vorprodukte für die Industrie und wirkt wie eine Entlastung für Unternehmensgewinne. Eine Bankenübernahme verändert zugleich die Wettbewerbslandschaft im deutschen Finanzsektor.',
      relatedTopics: ['aktie', 'rohstoffe'],
      relatedSymbols: ['dax', 'brent'],
      sources: [
        {
          label:
            'Handelsblatt, 9.11.2026, 17:21 Uhr: „Dax aktuell: Dax klettert wieder über 26.000-Punkte-Marke und schließt deutlich im Plus – Chipaktie legt zu“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dax-aktuell-dax-klettert-wieder-ueber-26.000-punkte-marke-und-schliesst-im-plus/100268348.html',
        },
        {
          label:
            'tagesschau.de, 9.11.2026, 13:52 Uhr: „Commerzbank-Übernahme soll Anfang 2027 durch sein“',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/commerzbank-uebernahme-unicredit-100.html',
        },
      ],
    },
    {
      headline: 'Nvidia-Aktie fällt: Sorge um Nachfolge für Jensen Huang wächst',
      summary: [
        'Die Affäre um Nvidia-Chef Jensen Huang und eine mutmaßliche chinesische Spionin belastete am Montag die Aktie des Chipkonzerns.',
        'Laut CNBC gibt es bislang keinen klaren Nachfolger für Huang.',
        'Auch im US-Kongress wächst nach Angaben von CNBC das Interesse an dem Fall.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Nvidia gehört nach Marktkapitalisierung zu den wertvollsten Unternehmen der Welt und ist eng mit der Person seines Gründers verknüpft. Fragen zur Nachfolge wiegen deshalb schwerer als bei anderen Konzernen.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['nvidia'],
      sources: [
        {
          label:
            'Handelsblatt, 9.11.2026, 17:59 Uhr: „Huang-Affäre: ‚Jensen ist unersetzbar‘: Nvidia-Aktie fällt wegen Spionage-Skandal“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/aktien/huang-affaere-jensen-ist-unersetzbar-nvidia-aktie-faellt-wegen-skandal/100268280.html',
        },
        {
          label:
            "CNBC, 9.11.2026, 22:56 Uhr: „Jensen Huang affair puts Nvidia's future at risk, with no clear successor to the renowned CEO“",
          url: 'https://www.cnbc.com/2026/11/09/jensen-huang-affair-nvidia-succession.html',
        },
      ],
    },
    {
      headline: 'Boeing streicht fünf Prozent der Stellen im Zivilflugzeugbau',
      summary: [
        'Boeing baut nach Angaben von CNBC fünf Prozent der Stellen in seiner Sparte für Verkehrsflugzeuge ab.',
        'Grund ist laut dpa-AFX, dass die Produktion der 737 Max langsamer hochläuft als geplant.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Boeing ist neben Airbus einer von zwei großen Flugzeugbauern weltweit. Verzögerungen in der Produktion wirken sich über die Lieferkette auf Zulieferer in mehreren Ländern aus.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['boeing'],
      sources: [
        {
          label:
            'CNBC, 9.11.2026, 19:35 Uhr: „Boeing to cut 5% of commercial airplane workers as production increase takes longer than expected“',
          url: 'https://www.cnbc.com/2026/11/09/boeing-layoffs-commercial-airplane.html',
        },
        {
          label:
            'wallstreet-online, 9.11.2026, dpa-AFX: „Boeing streicht 5 Prozent der Stellen in der Verkehrsflugzeugsparte“',
          url: 'https://www.wallstreet-online.de/nachricht/21666096-boeing-streicht-5-prozent-stellen-verkehrsflugzeugsparte',
        },
      ],
    },
    {
      headline: 'EZB-Nachfolge: Finanzminister drängen auf schnelle Entscheidung',
      summary: [
        'Die Finanzminister der Eurozone berieten laut Handelsblatt über die Nachfolge von EZB-Chefin Christine Lagarde.',
        'Spanien und die Niederlande werben weiter für ihre nominierten Kandidaten.',
        'Eine Entscheidung soll laut Handelsblatt schon bald fallen.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Wer die EZB führt, bestimmt den Kurs der Zinspolitik für die gesamte Eurozone mit. Der Wechsel an der Spitze fällt zudem in eine Phase hoher Unsicherheit über das weitere Zinsniveau.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'Handelsblatt, 9.11.2026, 14:24 Uhr: „Geldpolitik: ‚Der Zeitplan ist eng‘: Finanzminister beraten über Lagardes Nachfolge an der EZB-Spitze“',
          url: 'https://www.handelsblatt.com/finanzen/geldpolitik/ezb-enger-zeitplan-finanzminister-beraten-ueber-neue-spitze/100268439.html',
        },
      ],
    },
  ],
  further: [],
}
