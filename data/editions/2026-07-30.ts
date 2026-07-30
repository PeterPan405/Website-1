import type { DailyEdition } from './types'

/**
 * Ausgabe vom 30. Juli 2026.
 *
 * Der Fed-Abend, der alles dominierte: Ein erwartetes Stillhalten mit drei
 * Abweichlern für eine Erhöhung, der schwerste Wall-Street-Tag seit April
 * 2025, ein Ölpreis, der nach Raketenangriffen um 7,9 Prozent springt – und
 * dazwischen zwei Tech-Berichte, die in entgegengesetzte Richtungen liefen.
 */
export const edition: DailyEdition = {
  date: '2026-07-30',
  intro:
    'Die Fed hält mit drei Abweichlern, die Wall Street erlebt den schwersten Tag seit April, Öl springt auf 90 Dollar – heute entscheidet die Bank of England.',
  top: [
    {
      headline: 'Fed hält die Zinsen mit 9 zu 3 – drei Stimmen für eine Erhöhung',
      summary: [
        'Die US-Notenbank beließ den Leitzins bei 3,50 bis 3,75 Prozent. Beth Hammack, Neel Kashkari und Lorie Logan stimmten für eine Erhöhung um einen Viertelpunkt – so viele Abweichler in eine Richtung wie zuletzt im September 2016.',
        'Der neue Vorsitzende Kevin Warsh erklärte, die Fed sei unter ihm „nicht im Prognosegeschäft“, versprach aber, gegen die Inflation notfalls zu handeln. Hinweise auf den weiteren Zinspfad gibt es damit nicht mehr.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Der Zinssatz war mit 77,7 Prozent Wahrscheinlichkeit eingepreist – das Stimmenverhältnis nicht. Ein 9-zu-3-Stillhalten und ein einstimmiges ergeben denselben Satz, aber verschiedene Wahrscheinlichkeiten für die nächste Sitzung. Gehandelt wurde die zweite.',
      relatedTopics: [
        'notenbanken-geldpolitik',
        'wie-funktioniert-der-markt',
        'inflation',
      ],
      relatedSymbols: ['sp500', 'dow-jones', 'eur-usd'],
      sources: [
        {
          label:
            'CNBC: Fed meeting recap – Warsh says Fed won’t hesitate to stop inflation (29.07.2026)',
          url: 'https://www.cnbc.com/2026/07/29/fed-meeting-today-live-updates.html',
        },
      ],
    },
    {
      headline: 'Wall Street: schwerster Tag seit April 2025, Renditen auf 2007er-Stand',
      summary: [
        'Der Dow Jones verlor 1.153 Punkte oder 2,19 Prozent auf 51.594,14, der S&P 500 gab 1,52 Prozent ab, der Nasdaq 1,74 Prozent. Die Rendite zehnjähriger US-Anleihen stieg über 4,67 Prozent, die der dreißigjährigen über 5,2 Prozent – der höchste Stand seit 2007.',
        'Der Anleihemarkt las den Fed-Abend als Zeichen, dass die Notenbank der Inflation hinterherläuft. Steigende Renditen drücken Aktienbewertungen über die Abzinsung künftiger Gewinne – hoch bewertete Werte trifft das am stärksten.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die Anleiherenditen desselben Tages sind die nüchternste Übersetzung einer Notenbanksitzung: Sie zeigen, was der Markt verstanden hat – unabhängig davon, was gesagt wurde. Wer Aktienreaktionen deuten will, liest zuerst diese Zeile.',
      relatedTopics: [
        'staatsanleihe',
        'wie-funktioniert-der-markt',
        'notenbanken-geldpolitik',
      ],
      relatedSymbols: ['dow-jones', 'sp500', 'nasdaq-100'],
      sources: [
        {
          label:
            'CNBC: Dow drops 1,100 points for worst day since April 2025 (29.07.2026)',
          url: 'https://www.cnbc.com/2026/07/28/stock-market-today-live-updates.html',
        },
        {
          label:
            'BBN Times: DJIA Plunges to 51,594.14 in Its Worst Session Since April 2025',
          url: 'https://www.bbntimes.com/global-economy/dow-jones-djia-plunges-to-51-594-14-in-its-worst-session-since-april-2025',
        },
      ],
    },
    {
      headline:
        'Öl springt 7,9 Prozent auf 90,74 Dollar – nach 16 Prozent Verlust in drei Tagen',
      summary: [
        'Irans Revolutionsgarden feuerten ballistische Raketen auf US-Stellungen, die abgefangen wurden; Präsident Trump kündigte Vergeltung an. Brent schloss 7,9 Prozent höher bei 90,74 Dollar, WTI stieg 6,6 Prozent auf 84,46 Dollar.',
        'In den drei Handelstagen zuvor hatte Brent 16 Prozent verloren – der größte Drei-Tage-Rückgang seit 2020 –, weil eine Verhandlungslösung möglich schien. Ausgefallen ist in dieser Zeit kein einziges Barrel.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Was sich hier bewegt, ist die Risikoprämie: der Aufschlag für eine Störung, die eintreten könnte. Sie handelt Wahrscheinlichkeiten statt Lieferungen – deshalb kann sie binnen Tagen entstehen und ebenso schnell wieder verschwinden.',
      relatedTopics: ['rohstoffe', 'wie-funktioniert-der-markt', 'inflation'],
      relatedSymbols: ['brent', 'wti', 'dax'],
      sources: [
        {
          label:
            'CNBC: Brent oil jumps back above $90 after Trump threatens to hit Iran hard (29.07.2026)',
          url: 'https://www.cnbc.com/2026/07/29/oil-prices-today-brent-wti-iran-us-hormuz.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Microsoft springt, Meta fällt – zwei Berichte, ein Abend',
      summary: [
        'Microsoft meldete 90,01 Milliarden Dollar Umsatz und 4,81 Dollar Gewinn je Aktie – beides über den Schätzungen, die Aktie legte nachbörslich deutlich zu, nachdem sie zuvor rund 30 Prozent unter ihrem Hoch notiert hatte. Meta übertraf beim Umsatz mit 60,8 Milliarden, verfehlte beim Gewinn je Aktie mit 6,18 statt 7,14 Dollar – die Kosten stiegen um 55 Prozent, die Aktie verlor rund acht Prozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Derselbe Abend, beide Umsätze über Erwartung, zwei entgegengesetzte Kursreaktionen: Gemessen wird ein Bericht an der Erwartung, die im Kurs steckt – und an dem, was unten in der Rechnung ankommt, nicht oben.',
      relatedTopics: ['aktie', 'wie-funktioniert-der-markt', 'risiko-und-rendite'],
      relatedSymbols: ['microsoft', 'meta', 'nasdaq-100'],
      sources: [
        {
          label:
            'Investing.com: Meta misses EPS in Q2 2026 as stock sinks after hours (29.07.2026)',
          url: 'https://www.investing.com/news/transcripts/earnings-call-transcript-meta-misses-eps-in-q2-2026-as-stock-sinks-after-hours-93CH-4821910',
        },
        {
          label:
            'Finanzmarktwelt: Microsoft-Quartalszahlen überzeugen auf den ersten Blick (29.07.2026)',
          url: 'https://finanzmarktwelt.de/microsoft-quartalszahlen-10-396841/',
        },
      ],
    },
    {
      headline:
        'Heute: Bank of England, BIP-Schnellmeldungen und Apple nach Börsenschluss',
      summary: [
        'Um 13 Uhr deutscher Zeit entscheidet die Bank of England – erwartet wird Stillhalten bei 3,75 Prozent, veröffentlicht werden Entscheid, Protokoll und Inflationsbericht gleichzeitig. Am Abend um 22:30 Uhr folgt Apple mit den Zahlen zum dritten Geschäftsquartal, die Aktie geht vom Rekordniveau in den Termin.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Nach dem Fed-Abend gilt an beiden Terminen dieselbe Regel: Der erwartete Ausgang steht bereits in den Kursen. Bewegen können nur Stimmenverhältnis, Prognosen und Ton – die Teile, für die es keine Wahrscheinlichkeitstabelle gibt.',
      relatedTopics: ['notenbanken-geldpolitik', 'aktie', 'waehrungen-wechselkurse'],
      relatedSymbols: ['eur-gbp', 'apple'],
      sources: [
        {
          label: 'Bank of England: Monetary Policy Summary and minutes – July 2026',
          url: 'https://www.bankofengland.co.uk/monetary-policy-summary-and-minutes/2026/july-2026',
        },
        {
          label: 'macprime: Nächste Quartalszahlen von Apple am 30. Juli 2026',
          url: 'https://www.macprime.ch/a/news/naechste-quartalszahlen-von-apple-am-30-juli-2026',
        },
      ],
    },
  ],
}
