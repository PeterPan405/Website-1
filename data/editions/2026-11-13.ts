import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-13.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-13 03:36 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-13',
  intro:
    'Die Bundesbank warnt vor Finanzrisiken, Mercedes stoppt Investitionen, ein Microsoft-Ausfall legt Outlook lahm – und Nvidia-Chef Huang tritt zurück.',
  top: [
    {
      headline: 'Bundesbank warnt vor erhöhten Risiken für die Finanzstabilität',
      summary: [
        'Die Bundesbank hat ihren Finanzstabilitätsbericht 2026 vorgelegt.',
        'Vorstandsmitglied Michael Theurer nennt hohe Marktbewertungen, steigende Kreditrisiken, hohe Staatsschulden und Künstliche Intelligenz als Risiken für die Finanzstabilität.',
        'Fast 40 Prozent der im zweiten Quartal vergebenen Immobilienkredite erreichten mehr als 90 Prozent des Beleihungswerts.',
        'Bei rund 11 Prozent der Kredite lag die Summe sogar über diesem Wert.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Ein Darlehen nahe am oder über dem Beleihungswert lässt kaum Spielraum, falls Immobilienpreise fallen oder Anschlusszinsen steigen.',
      relatedTopics: ['immobilien', 'schulden-und-kredit'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'Deutsche Bundesbank, Pressemitteilung vom 12.11.2026: „Bundesbank: Risiken für die Finanzstabilität bleiben erhöht“',
          url: 'https://www.bundesbank.de/de/presse/pressemitteilungen/bundesbank-risiken-fuer-die-finanzstabilitaet-bleiben-erhoeht-1014712',
        },
        {
          label:
            'Tagesschau, 12.11.2026, 18:31 Uhr: „Bundesbank warnt vor erhöhten Risiken für das deutsche Finanzsystem“',
          url: 'https://www.tagesschau.de/wirtschaft/finanzen/risiken-finanzsystem-bundesbank-100.html',
        },
      ],
    },
    {
      headline: 'Mercedes-Benz stoppt alle Investitionen in Deutschland',
      summary: [
        'Mercedes-Benz hat beschlossen, alle weiteren Investitionen an seinen deutschen Standorten zu stoppen.',
        'Produktionsvorstand Michael Schiebe sagte, der Vorstand habe das gemeinsam entschieden, nachdem Gespräche über niedrigere Arbeitskosten monatelang ohne Durchbruch blieben.',
        'Personalvorständin Britta Seeger erklärte, das Unternehmen prüfe nun konkret, welche Standorte es sich noch leisten könne.',
        'Komme es zu keiner Einigung, werde Mercedes „sehr harte Schritte“ gehen, sagte sie.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Investitionsstopp ist noch keine Werksschließung, gilt in der Praxis aber oft als ihr erster, öffentlich sichtbarer Schritt.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['mercedes-benz'],
      sources: [
        {
          label:
            'Handelsblatt, News-Ticker vom 12.11.2026, 18:09 Uhr: „Mercedes: Autohersteller stoppt alle Investitionen in Deutschland“',
          url: 'https://www.handelsblatt.com/unternehmen/industrie/mercedes-autohersteller-stoppt-alle-investitionen-in-deutschland/100269485.html',
        },
        {
          label:
            'ZDFheute, 12.11.2026, 22:10 Uhr: „Mercedes-Benz stoppt alle neuen Investitionen in Deutschland“',
          url: 'https://www.zdfheute.de/wirtschaft/unternehmen/mercedes-sparmassnahmen-100.html',
        },
      ],
    },
    {
      headline: 'Cisco übertrifft Erwartungen und hebt KI-Umsatzprognose an',
      summary: [
        'Cisco steigerte den Umsatz im ersten Geschäftsquartal um 24 Prozent auf 18,5 Milliarden Dollar, mehr als die erwarteten 18,1 Milliarden Dollar.',
        'Der bereinigte Gewinn je Aktie lag bei 1,40 Dollar, erwartet waren 1,33 Dollar.',
        'Für das laufende Quartal stellt Cisco einen Umsatz von 18,0 bis 18,2 Milliarden Dollar in Aussicht, über der Analystenschätzung von 17,88 Milliarden Dollar.',
        'Zudem hob der Konzern seine Erwartung für den KI-Infrastrukturumsatz mit Cloud-Großkunden auf 9 Milliarden Dollar an, mehr als doppelt so viel wie im Vorjahr.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Prognose für die Zukunft bewegt Kurse oft stärker als bereits bekannte Ist-Zahlen, weil in ihr die eigentlich neue Information steckt.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['cisco'],
      sources: [
        {
          label:
            'CNBC, News-Ticker vom 12.11.2026, 21:20 Uhr: „Cisco beats on earnings, says AI infrastructure revenue will double this fiscal year“',
          url: 'https://www.cnbc.com/2026/11/12/cisco-csco-q1-2027-earnings.html',
        },
        {
          label:
            'wallstreet-online, News-Ticker vom 12.11.2026 (dpa-AFX): „Cisco schwimmt weiter auf der KI-Welle – Jahresumsatzprognose angehoben“',
          url: 'https://www.wallstreet-online.de/nachricht/21685773-cisco-schwimmt-ki-welle-jahresumsatzprognose-angehoben',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Weltweiter Ausfall legt Microsofts Outlook und Teams lahm',
      summary: [
        'Ein weltweiter Ausfall legte am Donnerstagnachmittag Microsofts Online-Dienste lahm, darunter Outlook, Teams und weitere 365-Anwendungen.',
        'Microsoft sprach zunächst von erhöhter Last in mehreren Regionen, später von einer Zahl unerwartet ausgefallener Server.',
        'Der Marktbeobachter Downdetector zählte zeitweise rund 130.000 Meldungen allein zu Outlook.',
        'Amazon Web Services erklärte, die eigenen Dienste liefen normal.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wenn Millionen Unternehmen dieselben wenigen Cloud-Anbieter nutzen, reicht ein einzelner technischer Fehler, um weltweit viele Dienste gleichzeitig auszubremsen.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['microsoft'],
      sources: [
        {
          label:
            'CNBC, News-Ticker vom 12.11.2026, 22:24 Uhr: „Widespread Microsoft outage takes down Outlook and other 365 services“',
          url: 'https://www.cnbc.com/2026/11/12/microsoft-outage-outlook-aws-google.html',
        },
        {
          label:
            'Tagesschau, 13.11.2026, 04:22 Uhr: „Auch Outlook betroffen: Microsoft-Dienste weltweit mit Störungen“',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/microsoft-outlook-ausfall-100.html',
        },
      ],
    },
    {
      headline: 'Nvidia-Chef tritt nach Sicherheitsbedenken zurück',
      summary: [
        'Nvidia-Chef Jensen Huang ist mit sofortiger Wirkung als Vorstandsvorsitzender und als Mitglied des Verwaltungsrats zurückgetreten.',
        'Finanzvorständin Colette Kress übernimmt die Führung übergangsweise, Harvey Jones wird erster Vorsitzender des Verwaltungsrats.',
        'Dem Rücktritt ging laut übereinstimmenden Berichten eine Beziehung Huangs zu einer Frau voraus, die US-Behörden der Spionage für China verdächtigen.',
        'Die Nvidia-Aktie fiel am Donnerstag zeitweise um bis zu 14 Prozent und schloss rund 4,3 Prozent niedriger.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Weil Nvidia in Indizes wie dem Nasdaq 100 hoch gewichtet ist, spüren auch Sparer in breiten ETFs eine Führungskrise, die mit ihrem eigentlichen Depot nichts zu tun hat.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['nvidia'],
      sources: [
        {
          label:
            'Tagesschau, 12.11.2026, 18:20 Uhr: „Nvidia-Chef Huang tritt nach Spionageaffäre zurück“',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/nvidia-huang-ruecktritt-100.html',
        },
        {
          label:
            'CNBC, News-Ticker vom 12.11.2026, 21:17 Uhr: „Nvidia stock closes down over 4% after CEO Jensen Huang announces resignation“',
          url: 'https://www.cnbc.com/2026/11/12/nvidia-nvda-jensen-huang-second-affair.html',
        },
      ],
    },
  ],
}
