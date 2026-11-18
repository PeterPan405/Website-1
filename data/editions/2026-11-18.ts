import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-18.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-18 00:13 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-18',
  intro:
    'Ein Datenleck trifft die Deutsche Bank, die USA verschärfen Chip-Exporte nach Asien, die Fed droht mit vier Zinsschritten – und Nvidia liefert Rekordzahlen.',
  top: [
    {
      headline: 'Datenleck erschüttert die Deutsche Bank',
      summary: [
        'Ein Datenleck erschüttert die Deutsche Bank. Journalisten werteten mehr als 15 Millionen interne Dokumente und über neun Millionen E-Mails aus, zugespielt von Whistleblowern. Die Unterlagen zeigen, wie die Bank plante, ihre Einnahmen mit vermögenden russischen Kunden bis 2023 von 28 auf 50 Millionen Euro zu steigern. Das geschah trotz Warnungen der New Yorker Finanzaufsicht.',
        'Die Dokumente erwähnen weitere Geschäfte. Darunter sind der verurteilte Sexualstraftäter Jeffrey Epstein und der heutige US-Präsident Donald Trump. Die Aktie der Deutschen Bank fiel am Dienstag um bis zu 6,2 Prozent auf 30,88 Euro. Damit war sie der größte Verlierer im Dax. Die Bank erwartet nach eigenen Angaben keine nennenswerten finanziellen Folgen. Sie verweist auf Investitionen von sieben Milliarden Euro in ihre Kontrollen seit 2019.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Datenleck ohne neue Zahl zur Bilanz bewegte die Aktie trotzdem um mehr als sechs Prozent – ein Beispiel, wie stark Reputationsrisiko den Kurs einer Bank treiben kann, unabhängig vom laufenden Geschäft.',
      relatedTopics: ['risiko-und-rendite'],
      relatedSymbols: ['deutsche-bank'],
      sources: [
        {
          label:
            'Tagesschau, 17. November 2026, 10:42 Uhr: „Datenleck: Interne Dokumente belasten die Deutsche Bank"',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/deutsche-bank-datenleak-100.html',
        },
        {
          label:
            'Handelsblatt, 17. November 2026, 17:57 Uhr: „Interview: 15 Millionen Dokumente und neun Millionen Mails abgeflossen: Wie konnte das passieren, Herr Sewing?"',
          url: 'https://www.handelsblatt.com/finanzen/banken-versicherungen/banken/deutsche-bank-wie-konnte-das-passieren-herr-sewing/100270599.html',
        },
      ],
    },
    {
      headline: 'USA verschärfen Exportregeln für KI-Chips',
      summary: [
        'Die USA verschärfen die Exportregeln für Hochleistungs-Chips. Firmen brauchen künftig eine Lizenz, um solche Chips nach Malaysia, Singapur, Indonesien, Thailand oder Brasilien zu liefern. Das ordnete das US-Handelsministerium an. Betreiber von Rechenzentren mit amerikanischen KI-Chips müssen ihre Kunden künftig genauer prüfen. Ziel ist, Schlupflöcher zu schließen. Chips gelangten bisher über Umwege nach China.',
        'Die Nachricht traf Asiens Börsen noch am selben Tag. Der Nikkei fiel um 1,1 Prozent auf 58.994 Punkte. Der Topix gab 1,4 Prozent nach. Shanghai und der chinesische CSI 300 bewegten sich kaum. Die neue Regel kommt kurz vor Donald Trumps Treffen mit Xi Jinping in Asien.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine einzelne Exportregel aus Washington bewegte am selben Tag Börsen in Tokio und Shanghai – ein Beispiel dafür, wie eng globale Halbleiter-Lieferketten und politische Entscheidungen inzwischen verknüpft sind.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['nvidia', 'nikkei-225'],
      sources: [
        {
          label:
            'Tagesschau, 17. November 2026, 08:59 Uhr: „US-Regierung verhängt neue Exportbeschränkungen für KI-Chips"',
          url: 'https://www.tagesschau.de/wirtschaft/weltwirtschaft/usa-einschraenkungen-export-ki-chips-nvidia-100.html',
        },
        {
          label:
            'Handelsblatt, 17. November 2026, 09:32 Uhr: „Nikkei, Topix, CSI 300: Asiens Börsen geben nach – US-Chip-Sanktionen und Nvidia belasten"',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/nikkei-topix-csi-300-asiens-boersen-geben-nach-us-chip-sanktionen-und-nvidia-belasten/100270404.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Musalem bringt vier weitere Zinserhöhungen ins Spiel',
      summary: [
        'St.-Louis-Fed-Chef Alberto Musalem hält weitere Zinserhöhungen für nötig. In einer Rede in Argentinien sagte er, bis zum Frühjahr 2027 könnten bis zu vier weitere Zinsschritte folgen. Das wäre möglich bei den Sitzungen im Dezember, Januar, März und April. Der Leitzins liegt derzeit zwischen 3,75 und 4 Prozent.',
        'Musalem stimmt in diesem Zeitraum nicht ab. Er äußert aber Einschätzungen, die einfließen. Die Rendite zehnjähriger US-Anleihen stieg am selben Tag auf 5,13 Prozent. Der Goldpreis fiel zuvor auf ein Jahrestief von 3.856 Dollar je Feinunze.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Für die Fed zählt nicht der Leitzins allein, sondern der Realzins – der Leitzins abzüglich der Inflationsrate. Erst wenn dieser hoch genug ist, wirkt die Geldpolitik nach Musalems Lesart wirklich dämpfend.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'CNBC, 17. November 2026, 14:34 Uhr MEZ: „St. Louis Fed\'s Musalem says four more rate hikes may be needed in coming months"',
          url: 'https://www.cnbc.com/2026/11/17/alberto-musalem-fed-interest-rates.html',
        },
        {
          label:
            'Goldreporter, 16. November 2026: „Goldpreis testet Jahrestief – US-Rendite steigt auf 5,13 Prozent"',
          url: 'https://www.goldreporter.de/goldpreis-jahrestief-us-rendite-16-11-2026/news/263131/',
        },
      ],
    },
    {
      headline: 'US-Hausbauer so pessimistisch wie seit 14 Jahren nicht',
      summary: [
        'Amerikas Bauunternehmer sind so pessimistisch wie seit 14 Jahren nicht. Der Stimmungsindex von NAHB und Wells Fargo fiel im November auf 25 Punkte, den tiefsten Stand seit April 2012. Im Vorjahresmonat lag er noch bei 38. Fast jeder zweite Baukonzern senkt inzwischen die Preise für neue Häuser. 68 Prozent bieten zusätzliche Kaufanreize.',
        'Die Unternehmen nennen mehrere Gründe. Dazu zählen höhere Zinsen, teurere Energie, teureres Material und knappe Arbeitskräfte. Ein 30 Jahre fest verzinster Hypothekenkredit kostet derzeit 7,51 Prozent Zinsen. Vor einem Jahr waren es noch 6,38 Prozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Stimmungsindizes wie dieser gelten als Frühindikator: Sie zeigen oft schon Monate vorher, wohin sich Baubeginne und Immobilienpreise entwickeln könnten – lange bevor die amtlichen Zahlen das bestätigen.',
      relatedTopics: ['immobilien'],
      relatedSymbols: ['dow-jones'],
      sources: [
        {
          label:
            'CNBC, 17. November 2026, 16:36 Uhr MEZ: „Homebuilder sentiment plunges to 14-year low, leading more builders to drop prices"',
          url: 'https://www.cnbc.com/2026/11/17/homebuilder-sentiment-plunges-to-14-year-low-leading-more-builders-to-drop-prices.html',
        },
      ],
    },
    {
      headline: 'Nvidia verdoppelt Umsatz und Gewinn – SEC ermittelt',
      summary: [
        'Nvidia hat Umsatz und Gewinn im dritten Quartal erneut verdoppelt. Der Umsatz stieg auf 115,8 Milliarden Dollar, der Gewinn auf 65,3 Milliarden Dollar. Beide Werte lagen über den Erwartungen der Analysten. Für das laufende Quartal stellt Nvidia einen Umsatz von rund 130 Milliarden Dollar in Aussicht. Die Aktie legte nachbörslich bis zu drei Prozent zu.',
        'Zugleich ermittelt die US-Börsenaufsicht SEC gegen Nvidia. Sie prüft, ob öffentliche Aussagen des Konzerns Anleger in die Irre führten. Der Anlass ist der Rücktritt von Firmenchef Jensen Huang. US-Finanzminister Scott Bessent verlangt vom Vorstand binnen zehn Tagen Antworten.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Obwohl Nvidia Umsatz und Gewinn erneut verdoppelte und die eigene Prognose übertraf, legte die Aktie nur moderat zu – ein Zeichen, dass ein Rekordquartal schon weitgehend erwartet war und die SEC-Ermittlung zusätzliche Unsicherheit bringt.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['nvidia'],
      sources: [
        {
          label:
            'onvista/dpa-AFX, 17. November 2026, 22:03 Uhr: „ROUNDUP: Nvidia verdoppelt erneut Umsatz und Gewinn"',
          url: 'https://www.onvista.de/news/2026/11-17-roundup-nvidia-verdoppelt-erneut-umsatz-und-gewinn-0-10-26577551',
        },
        {
          label:
            'wallstreetONLINE Redaktion, 17.11.2026: „Aktie erholt sich: Wieder ein Rekordquartal! Doch jetzt ermittelt die SEC"',
          url: 'https://www.wallstreet-online.de/nachricht/21708693-aktie-erholt-sich-rekordquartal-ermittelt-sec',
        },
      ],
    },
  ],
}
