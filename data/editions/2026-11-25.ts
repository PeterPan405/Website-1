import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-25.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-25 03:39 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-25',
  intro:
    'Sanofi kauft Insmed für 41 Milliarden Dollar, US-Verbrauchervertrauen springt, ein Urteil gegen Huawei und Dells Rekordquartal dank KI-Servern.',
  top: [
    {
      headline: 'Sanofi kauft Insmed für 41 Milliarden Dollar',
      summary: [
        'Sanofi übernimmt den US-Pharmakonzern Insmed.',
        'Der französische Konzern zahlt 41 Milliarden Dollar in bar, 175 Dollar je Aktie.',
        'Insmed stellt Mittel gegen seltene Lungenkrankheiten her, darunter Brinsupri und Arikayce.',
        'Die Insmed-Aktie sprang um 14,1 Prozent.',
        'Auch Sanofi-Aktien legten in Paris um 10,9 Prozent zu.',
        'Es ist laut CNBC der größte Pharma-Zukauf seit drei Jahren.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Sanofis Bestseller Dupixent verliert um das Jahr 2031 seinen Patentschutz – der Zukauf soll den drohenden Umsatzeinbruch zum Ende des Jahrzehnts abfedern, auch wenn Analysten die grundsätzlichen Fragen zur Forschungspipeline damit nicht als gelöst ansehen.',
      relatedTopics: ['aktie'],
      relatedSymbols: [],
      sources: [
        {
          label:
            "CNBC, 24.11.2026, 22:07 Uhr: „Drugmaker Insmed shares rally 14% after Sanofi agrees to buy it in pharma's biggest deal in three years“",
          url: 'https://www.cnbc.com/2026/11/24/insmed-sanofi-deal-stock-pharma.html',
        },
      ],
    },
    {
      headline: 'US-Verbrauchervertrauen springt nach den Zwischenwahlen deutlich',
      summary: [
        'Das Verbrauchervertrauen in den USA ist stark gestiegen.',
        'Der Index des Conference Board kletterte im November auf 103,3 Punkte, 11,4 Punkte mehr als im Oktober.',
        'Ökonomen hatten im Schnitt nur 92,2 Punkte erwartet.',
        'Der Sprung folgte auf Zwischenwahlen, bei denen die Demokraten deutlich zulegten.',
        'Die Inflationserwartung blieb trotzdem bei 5,7 Prozent hoch.',
        'Conference-Board-Ökonom Fergus McCormick sprach von anhaltendem Frust über hohe Preise.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die US-Notenbank entscheidet in zwei Wochen über den Leitzins und dürfte sowohl die gestiegene Zuversicht als auch die weiter hohen Inflationserwartungen genau beobachten, bevor sie über einen weiteren Zinsschritt entscheidet.',
      relatedTopics: ['inflation', 'notenbanken-geldpolitik'],
      relatedSymbols: ['sp500'],
      sources: [
        {
          label:
            "CNBC, 24.11.2026, 19:34 Uhr: „Consumer confidence shoots up after Democrats' midterm victories — though inflation worries persist“",
          url: 'https://www.cnbc.com/2026/11/24/consumer-confidence-november-election-midterm.html',
        },
      ],
    },
    {
      headline: 'US-Jury verurteilt Huawei wegen Betrugs und Geheimnisdiebstahls',
      summary: [
        'Ein US-Bundesgericht hat Huawei schuldig gesprochen.',
        'Die Geschworenen in New York sahen Bankbetrug, eine Geldwäsche-Verschwörung, Sanktionsverstöße und Geheimnisdiebstahl als erwiesen an.',
        'Vom Vorwurf organisierter Kriminalität sprachen sie Huawei frei.',
        'Laut Anklage täuschte Huawei Banken über sein Iran-Geschäft, um Zugang zu Dollar-Clearing zu behalten.',
        'Das Strafmaß wird erst im September 2027 verkündet.',
        'US-Justizminister Todd Blanche erklärte, niemand stehe über dem Gesetz.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Das Urteil verschärft den Konflikt zwischen den USA und China um Technologie und Handel zusätzlich und könnte weitere Sanktionen oder schärfere Kontrollen gegen chinesische Technologiekonzerne wahrscheinlicher machen.',
      relatedTopics: ['aktien-laender-branchen'],
      relatedSymbols: ['cisco'],
      sources: [
        {
          label:
            'CNBC, 25.11.2026, 03:43 Uhr: „U.S. jury convicts Huawei in a criminal trial over fraud and trade secrets“',
          url: 'https://www.cnbc.com/2026/11/25/huawei-fraud-trade-trial.html',
        },
        {
          label:
            'onvista, dpa-AFX, 24.11.2026, 22:46 Uhr: „US-Geschworene sprechen Huawei der Geldwäsche schuldig“',
          url: 'https://www.onvista.de/news/2026/11-24-us-geschworene-sprechen-huawei-der-geldwaesche-schuldig-0-10-26580178',
        },
      ],
    },
    {
      headline: 'Dell übertrifft Erwartungen deutlich und hebt Prognose an',
      summary: [
        'Dell hat die Erwartungen der Analysten klar übertroffen.',
        'Der Gewinn je Aktie lag bei 9,45 Dollar, der Umsatz bei 54,94 Milliarden Dollar.',
        'Analysten hatten im Schnitt nur 6,59 Dollar und 49,32 Milliarden erwartet.',
        'Treiber war die Nachfrage nach KI-Servern.',
        'Der Umsatz mit KI-optimierten Servern verdreifachte sich binnen eines Jahres auf 22 Milliarden Dollar.',
        'Dell hob die Jahresprognose für KI-Server auf 78 Milliarden Dollar an und genehmigte Aktienrückkäufe über 25 Milliarden Dollar.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine erneut angehobene Prognose zeigt, dass Dell dem eigenen KI-Geschäft mehr zutraut als noch vor einem Quartal, während ein Aktienrückkauf dieser Größe den Gewinn je Aktie steigert, ohne dass das operative Geschäft im gleichen Tempo wachsen muss.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['nvidia', 'amd', 'nasdaq-100'],
      sources: [
        {
          label:
            'CNBC, 24.11.2026, 23:07 Uhr: „Dell earnings beat on AI strength, company authorizes $25 billion buyback“',
          url: 'https://www.cnbc.com/2026/11/24/dell-earnings-report-q3-2027.html',
        },
      ],
    },
    {
      headline: 'Nvidia-Rally dreht sich: Dax und Asiens Börsen fallen',
      summary: [
        'Die Erleichterungsrally der vergangenen Tage bröckelt.',
        'Der Dax schloss am Dienstag 1,3 Prozent niedriger bei 25.018 Punkten.',
        'Am Montag war der Index nach Huangs überraschender Rückkehr an die Nvidia-Spitze noch um 2,2 Prozent gesprungen.',
        'Nvidia selbst verlor im US-Handel mehr als sieben Prozent.',
        'In Asien fiel die Reaktion heftiger aus: SoftBank Group gab 13,8 Prozent ab, Advantest 12,7 Prozent.',
        'Samsung und SK Hynix verloren ebenfalls mehr als sieben Prozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Rückschlag zeigt, wie konzentriert Indizes mit hoher Technologiegewichtung inzwischen auf den KI-Handel reagieren – Gewinne und Verluste bei einzelnen Chipwerten schlagen binnen Stunden auf ganze Börsen in Europa, den USA und Asien durch.',
      relatedTopics: ['aktie', 'anlegerpsychologie'],
      relatedSymbols: ['nvidia', 'dax', 'nikkei-225', 'kospi', 'tsmc'],
      sources: [
        {
          label:
            'Handelsblatt, 24.11.2026, 18:19 Uhr: „Dax aktuell: Dax schließt im Minus – Chip-Aktie verliert mehr als neun Prozent“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dax-aktuell-dax-schliesst-im-minus-chip-aktie-verliert-mehr-als-neun-prozent/100272268.html',
        },
        {
          label:
            'CNBC, 25.11.2026, 02:57 Uhr: „SoftBank drops 14% as Wall Street AI sell-off ripples across Asian tech names“',
          url: 'https://www.cnbc.com/2026/11/25/tech-stocks-softbank-group-advantest-sk-hynix-samsung.html',
        },
      ],
    },
  ],
  further: [],
}
