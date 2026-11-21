import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-21.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-21 00:12 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-21',
  intro:
    'IG Metall eskaliert mit Ganztagesstreiks, Trump droht Tech-Konzernen eine Steuer an, Bayer einigt sich vor Gericht – an den Börsen hält der Ausverkauf an.',
  top: [
    {
      headline: 'IG Metall weitet Warnstreiks aus: 150.000 im 24-Stunden-Streik',
      summary: [
        'Die IG Metall hat eskaliert. Mehr als 150.000 Beschäftigte legten am Freitag für 24 Stunden die Arbeit nieder. Rund 100 Betriebe waren betroffen, vor allem in Bayern und an den Werften im Norden. Es ist der erste Ganztagesstreik seit acht Jahren.',
        'Die Streikwelle geht weiter. Am Montag bestreikt die Gewerkschaft die Autobauer Opel und Ford, am Dienstag ganztägig Berlin-Brandenburg. Baden-Württemberg verhandelt am Mittwoch in Mannheim neu.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Streik, der den Mitgliedern Geld kostet, ist ein stärkeres Signal als ein kurzer Warnstreik ohne Streikgeld – er zeigt, wie ernst beide Seiten die Eskalation nehmen, bevor ein Tarifabschluss überhaupt absehbar ist.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['volkswagen', 'bmw'],
      sources: [
        {
          label:
            'Tagesschau, 20.11.2026, 20:58 Uhr: „Mehr als 100 Betriebe beteiligt: IG Metall setzt weiter auf ganztägige Warnstreiks“',
          url: 'https://www.tagesschau.de/wirtschaft/arbeitsmarkt/ig-metall-streik-112.html',
        },
        {
          label:
            'IG Metall, Pressemitteilung vom 19.11.2026: „Metall/Elektro: IG Metall startet Warnstreik-Druckwelle“',
          url: 'https://www.igmetall.de/presse/pressemitteilungen/2026/metallelektro-ig-metall-startet-warnstreik-druckwelle',
        },
      ],
    },
    {
      headline: 'Trump droht mit Steuer auf Rechenzentren im Ausland',
      summary: [
        'Donald Trump hat neue Pläne angekündigt. US-Firmen sollen keine Rechenzentren mehr im Ausland bauen dürfen. Wer es trotzdem tut, dem drohte er am Freitag im Weißen Haus eine gewaltige Steuer an.',
        'Der Vorstoß folgt auf Trumps Reise nach China. Dort traf er sich mit Xi Jinping und Wladimir Putin. Putin äußerte laut Trump den Wunsch nach einer diplomatischen Lösung im Ukraine-Krieg.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Steuer auf Auslandsinvestitionen verändert die Kostenrechnung genau jener Konzerne, die Milliarden in die weltweite KI-Infrastruktur stecken – noch bevor ein Gesetz beschlossen ist.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['microsoft', 'amazon', 'alphabet'],
      sources: [
        {
          label:
            "CNBC, 20.11.2026, 12:45 Uhr Ortszeit Washington: „Trump vows to stop U.S. companies from building data centers abroad, threatens 'tremendous tax'“",
          url: 'https://www.cnbc.com/2026/11/20/trump-data-centers-ai-companies-tax.html',
        },
        {
          label:
            'onvista/dpa-AFX, 20.11.2026, 21:56 Uhr: „ROUNDUP/Trump: Putin hat Wunsch nach diplomatischer Lösung geäußert“',
          url: 'https://www.onvista.de/news/2026/11-20-roundup-trump-putin-hat-wunsch-nach-diplomatischer-loesung-geaeussert-0-10-26579008',
        },
      ],
    },
    {
      headline:
        'US-Richter billigt Bayers Glyphosat-Vergleich über 7,25 Milliarden Dollar',
      summary: [
        'Ein US-Richter hat den Bayer-Vergleich in den Glyphosat-Klagen endgültig gebilligt. Er nannte die Einigung fair, vernünftig und angemessen. Der Vergleich deckt Zahlungen von 7,25 Milliarden Dollar über bis zu 21 Jahre ab.',
        'Die Bayer-Aktie reagierte sofort. Im nachbörslichen Handel auf der Plattform Tradegate stieg der Kurs um drei Prozent.',
      ],
      category: 'Steuern & Recht',
      whyItMatters:
        'Ein gerichtlich besiegelter Vergleich macht aus einem offenen Prozessrisiko eine feste Summe – das ist der Unterschied zwischen einer Rückstellung und einer Wette auf den Ausgang einzelner Klagen.',
      relatedTopics: ['aktie', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['bayer'],
      sources: [
        {
          label:
            'onvista/dpa-AFX, 20.11.2026, 22:01 Uhr: „Bayers Glyphosat-Sammelvergleich von Richter genehmigt“',
          url: 'https://www.onvista.de/news/2026/11-20-bayers-glyphosat-sammelvergleich-von-richter-genehmigt-0-10-26579007',
        },
        {
          label:
            'wallstreet-online/dpa-AFX, 20.11.2026: „Bayers Glyphosat-Sammelvergleich von Richter genehmigt“',
          url: 'https://www.wallstreet-online.de/nachricht/21726927-bayers-glyphosat-sammelvergleich-richter-genehmigt',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Bericht: CrowdStrike will Cybersicherheitsfirma Zscaler übernehmen',
      summary: [
        'Ein Bericht sorgte am Freitag für Bewegung. Bloomberg berichtete, CrowdStrike führe Gespräche über eine Übernahme von Zscaler. Die Zscaler-Aktie sprang im nachbörslichen Handel um 18 Prozent. CrowdStrike fiel um mehr als acht Prozent.',
        'Offiziell bestätigt ist der mögliche Deal nicht. CrowdStrike lehnte eine Stellungnahme ab. Zscaler reagierte zunächst nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dass zwei Kurse auf dieselbe Meldung gegensätzlich reagieren, zeigt, wie viel vom Aktienkurs eine eingepreiste Erwartung ist – lange bevor überhaupt ein Vertrag unterschrieben wäre, falls es dazu kommt.',
      relatedTopics: ['aktie'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'CNBC, 20.11.2026, 16:11 Uhr Ortszeit (22:11 Uhr MEZ): „Zscaler stock jumps 18% on report that CrowdStrike in talks to buy security vendor“',
          url: 'https://www.cnbc.com/2026/11/20/zscaler-crowdstrike-deal.html',
        },
      ],
    },
    {
      headline: 'Nasdaq verzeichnet schwächste Woche seit März 2020',
      summary: [
        'Der Ausverkauf bei Technologiewerten ging weiter. Der Nasdaq Composite fiel am Freitag um 5,3 Prozent. Das ist der schwächste Wochenverlust des Index seit März 2020.',
        'Auch der Dax traf es hart. Er fiel um 2,6 Prozent auf 24.803 Punkte und rutschte damit unter die Marke von 25.000 Punkten. Nvidia beendete die siebte Verlustwoche in Folge – die längste seit der Finanzkrise 2008.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Dax ist ein Performanceindex und rechnet Dividenden wieder ein, der Nasdaq Composite dagegen ein reiner Kursindex – ihre Prozentzahlen sind deshalb nicht eins zu eins vergleichbar, besonders über längere Zeiträume.',
      relatedTopics: ['wie-funktioniert-der-markt', 'aktie'],
      relatedSymbols: ['nvidia', 'nasdaq-100', 'dax'],
      sources: [
        {
          label:
            'WirtschaftsWoche, 20.11.2026, 23:15 Uhr: „Dow Jones, Nasdaq: Nasdaq mit stärkstem Wochenverlust seit März 2020“',
          url: 'https://www.wiwo.de/finanzen/boerse/dow-jones-nasdaq-nasdaq-mit-staerkstem-wochenverlust-seit-maerz-2020/100271639.html',
        },
        {
          label:
            'CNBC, 20.11.2026, 14:26 Uhr Ortszeit: „Nvidia stock plunges 14%, wraps up longest weekly losing streak since 2008 financial crisis“',
          url: 'https://www.cnbc.com/2026/11/20/nvidias-7-week-losing-streak-is-longest-since-2008-financial-crisis.html',
        },
        {
          label:
            'Handelsblatt, 20.11.2026, 18:40 Uhr: „Dax aktuell: Dax verliert 660 Punkte und schließt weit unter 26.000 Punkten“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dax-aktuell-dax-verliert-660-punkte-und-schliesst-weit-unter-26.000-punkten/100271464.html',
        },
      ],
    },
  ],
}
