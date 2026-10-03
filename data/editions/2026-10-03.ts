import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-03.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-03 00:13 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-03',
  intro:
    'Ein schwacher US-Jobbericht beflügelt Nasdaq und Dax, die G7 öffnen ihre Ölreserven, und vor der Straße von Hormus droht neue Eskalation.',
  top: [
    {
      headline: 'Schwacher US-Jobbericht schickt Nasdaq und Dow auf Rekordkurs',
      summary: [
        'In den USA entstanden im September nur 29.000 neue Stellen, erwartet worden waren 90.000. Die Zahlen für Juli und August wurden zusammen um 60.000 Stellen nach unten korrigiert.',
        'Die Wall Street reagierte freundlich. Der Nasdaq 100 stieg um 1,00 Prozent auf ein Rekordhoch von 30.807,93 Punkten, der S&P 500 gewann 0,73 Prozent, der Dow Jones 0,49 Prozent.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Ein schwacher Arbeitsmarkt senkt die Wahrscheinlichkeit weiterer Zinserhöhungen – und genau diese Erwartung bewegt Kurse oft stärker als die Konjunkturzahl selbst.',
      relatedTopics: ['notenbanken-geldpolitik', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['nasdaq-100', 'sp500', 'dow-jones'],
      sources: [
        {
          label:
            'onvista, Meldung vom 02.10.2026, 20:30 Uhr: „ROUNDUP/Aktien New York Schluss: Rekorde bei Tech-Indizes - Zinssorgen gebremst“',
          url: 'https://www.onvista.de/news/2026/10-02-roundup-aktien-new-york-schluss-rekorde-bei-tech-indizes-zinssorgen-gebremst-0-10-26560130',
        },
        {
          label:
            'commondreams.org, Bericht vom 02.10.2026: „US Added Just 29,000 Jobs, Wage Growth Hit New 5-Year Low Last Month as Trump Economy Teeters“',
          url: 'https://www.commondreams.org/news/september-2026-jobs-report',
        },
      ],
    },
    {
      headline: 'G7-Staaten geben 100 Millionen Barrel Öl aus Reserven frei',
      summary: [
        'Die G7-Staaten einigten sich auf die Freigabe von 100 Millionen Barrel Öl und Diesel aus ihren strategischen Reserven. Koordiniert über vier Monate von der Internationalen Energieagentur, soll ein großer Teil des Diesels schon in den ersten 20 Tagen verfügbar sein.',
        'Vorausgegangen war Druck aus Washington und ein Telefonat zwischen den Präsidenten Trump und Macron. Das Paket enthält auch Zusagen zu mehr Raffineriekapazität und freiem Energiehandel zwischen den Partnerländern.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Rohöl aus der Reserve wird erst zu Diesel, wenn eine Raffinerie es verarbeitet – die Freigabe löst das Dieselproblem deshalb nicht sofort.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'euronews.com, Bericht vom 02.10.2026: „G7 agrees 100 million-barrel emergency oil release amid US pressure over diesel“',
          url: 'https://www.euronews.com/2026/10/02/g7-agrees-100-million-barrel-emergency-oil-release-amid-us-pressure-over-diesel',
        },
        {
          label:
            'ariva.de, Meldung vom 02.10.2026: „G7-Staaten wollen 100 Millionen Barrel Öl aus Reserven freigeben“',
          url: 'https://www.ariva.de/brent-crude-rohoel-ice-rolling-kurs/news/g7-staaten-wollen-100-millionen-barrel-oel-aus-reserven-12157025',
        },
      ],
    },
    {
      headline:
        'Dritter US-Flugzeugträger vor Hormus, zwei Tanker binnen zwei Tagen beschossen',
      summary: [
        'Die USA verlegen mit der USS Theodore Roosevelt eine dritte Flugzeugträgergruppe in den Nahen Osten, rund 9.000 Soldaten sind unterwegs. Treffen alle Schiffe ein, wären erstmals drei Träger gleichzeitig vor Ort.',
        'Die britische Behörde UKMTO meldete zwei beschossene Tanker in der Straße von Hormus binnen zwei Tagen, jeweils mit Feuer an Bord. Verletzte gab es nach bisherigen Angaben nicht. Brent-Öl verteuerte sich am Donnerstag um 4,4 Prozent auf 102,31 Dollar.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wie viel vom Ölpreisaufschlag echte Lieferausfälle abbildet und wie viel allein die Angst davor, lässt sich in solchen Lagen kaum trennen.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'aktien.news, Bericht vom 02.10.2026: „Dritter US-Flugzeugträger im Nahen Osten treibt Ölpreise nach oben“',
          url: 'https://www.aktien.news/dritter-us-flugzeugtrager-im-nahen-osten-treibt-olpreise-nach-oben',
        },
        {
          label:
            'spectrumlocalnews.com, Bericht vom 01.10.2026: „Third aircraft carrier and thousands of troops head to Mideast“',
          url: 'https://spectrumlocalnews.com/us/snplus/military/2026/10/01/third-aircraft-carrier-heads-middle-east',
        },
        {
          label:
            't-online.de, Bericht vom 02.10.2026: „Bericht: Erneut Schiff in Straße von Hormus unter Beschuss“',
          url: 'https://www.t-online.de/nachrichten/ausland/id_101462358/bericht-erneut-schiff-in-strasse-von-hormus-unter-beschuss.html',
        },
      ],
    },
    {
      headline: 'Dax klettert zurück über 25.000 Punkte, Infineon allein vorn',
      summary: [
        'Der Dax schloss 1,17 Prozent höher bei 25.231,20 Punkten, sein Wochenminus blieb bei 0,7 Prozent. Tags zuvor war er erstmals seit Juli unter 25.000 Punkte gefallen.',
        'Getragen wurde der Anstieg vor allem von Infineon mit einem Plus von 8,8 Prozent. Der MDax gewann 0,66 Prozent auf 30.450,00 Punkte.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Indexplus von über einem Prozent kann von vielen Werten getragen sein oder von einem einzigen – das Prozent allein verrät den Unterschied nicht.',
      relatedTopics: ['wie-funktioniert-der-markt'],
      relatedSymbols: ['dax', 'mdax', 'infineon'],
      sources: [
        {
          label:
            'onvista, Meldung vom 02.10.2026, 16:40 Uhr: „ROUNDUP 2/Aktien Frankfurt Schluss: Dax klar erholt vom tiefsten Stand seit Juli“',
          url: 'https://www.onvista.de/news/2026/10-02-roundup-2-aktien-frankfurt-schluss-dax-klar-erholt-vom-tiefsten-stand-seit-juli-0-10-26560104',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Goldpreis fällt trotz Aktienrally um 0,77 Prozent',
      summary: [
        'Während Dax und Wall Street zulegten, gab Gold nach. Eine Feinunze kostete am Nachmittag 4.142,18 Dollar, ein Minus von 0,77 Prozent. Silber verlor 1,25 Prozent auf 60,23 Dollar.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Gold und Aktien laufen oft, aber nicht immer gegenläufig – ein einzelner Tag widerlegt eine Korrelation nicht, die sich erst im Durchschnitt vieler Tage zeigt.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: ['gold', 'silber'],
      sources: [
        {
          label:
            'wallstreet-online.de, Meldung vom 02.10.2026, 17:29 Uhr: „Rohstoffpreise Überblick: Goldpreis, Silberpreis, Öl (Brent/WTI)“',
          url: 'https://www.wallstreet-online.de/nachricht/21468480-rohstoffpreise-ueberblick-goldpreis-silberpreis-oel-brent-wti-rohstoffe-02-10-2026',
        },
      ],
    },
    {
      headline: 'Bayer investiert 2,2 Milliarden Dollar in neues Werk in Ohio',
      summary: [
        'Bayer baut für 2,2 Milliarden Dollar ein neues Pharmawerk in New Albany, Ohio. Rund 600 Stellen sollen entstehen, Wirkstoff- und Arzneimittelproduktion liegen künftig an einem Ort.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Eine milliardenschwere Standortentscheidung bindet Kapital auf Jahre und sagt wenig über das nächste Quartalsergebnis aus.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['bayer'],
      sources: [
        {
          label:
            'onvista, Meldung vom 02.10.2026: „Bayer will über 2 Milliarden Dollar in US-Werk investieren“',
          url: 'https://www.onvista.de/news/2026/10-02-bayer-will-ueber-2-milliarden-dollar-in-us-werk-investieren-0-10-26560124',
        },
      ],
    },
  ],
}
