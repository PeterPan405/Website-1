import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-06.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-06 00:59 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-06',
  intro:
    'Ein Fed-Satz und ein Jobbericht drehen die Zinswette zweimal, NetApp fällt trotz Rekordzahlen, und der S&P 500 tauscht drei Werte aus.',
  top: [
    {
      headline:
        'Ein Fed-Satz, ein Jobbericht: Die Zinswette dreht sich zweimal in einer Woche',
      summary: [
        'Fed-Gouverneur Waller dämpfte am Donnerstag laut ad-hoc-news die eingepreiste Wahrscheinlichkeit einer Zinserhöhung von rund 70 auf etwa 50 Prozent.',
        'Der überraschend starke US-Jobbericht vom Freitag drehte die Erwartung laut kapitalmarktexperten.de auf etwa 65 Prozent zurück, Anleiherenditen zogen an und Gold gab nach.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Zeigt, dass eine eingepreiste Zinswahrscheinlichkeit eine Momentaufnahme ist, die sich innerhalb weniger Tage zweimal drehen kann.',
      relatedTopics: ['notenbanken-geldpolitik', 'staatsanleihe'],
      relatedSymbols: ['gold', 'dow-jones'],
      sources: [
        {
          label:
            'ad-hoc-news.de, Unternehmensnachrichten vom 3.9.2026: „Gold: Waller bremst Zinssorgen“',
          url: 'https://www.ad-hoc-news.de/boerse/news/unternehmensnachrichten/gold-waller-bremst-zinssorgen/70052191',
        },
        {
          label:
            'U.S. Bureau of Labor Statistics, Employment Situation Summary, August 2026',
          url: 'https://www.bls.gov/news.release/empsit.nr0.htm',
        },
      ],
    },
    {
      headline:
        'NetApp übertrifft alle Prognosen – der Kurs fällt trotzdem um acht Prozent',
      summary: [
        'NetApp meldete laut onvista Umsatz, Gewinn und Ausblick klar über den Erwartungen des Marktes für das abgelaufene und das laufende Quartal.',
        'Die Aktie fiel dennoch um rund acht Prozent, weil der freie Cashflow um etwa 35 Prozent von 620 auf rund 400 Millionen Dollar sank.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ein Beispiel dafür, dass Umsatz und Gewinn nicht die einzigen Kennzahlen sind, auf die der Markt bei einer Bilanz schaut.',
      relatedTopics: ['risiko-und-rendite', 'aktie'],
      relatedSymbols: ['sp500'],
      sources: [
        {
          label:
            'onvista, News vom 3.9.2026, 15:18 Uhr: „Warum NetApp trotz starker Zahlen so deutlich fällt“',
          url: 'https://www.onvista.de/news/2026/09-03-warum-netapp-trotz-starker-zahlen-so-deutlich-faellt-40338625-19-26549606',
        },
      ],
    },
    {
      headline:
        'S&P 500 wechselt drei Mitglieder aus – Bloom Energy steigt allein durch die Aufnahme',
      summary: [
        'Bloom Energy, Everpure und Illumina rücken zum 21. September in den S&P 500 auf, wie S&P Dow Jones Indices mitteilte.',
        'Molson Coors, The Trade Desk und Builders FirstSource müssen den Index verlassen und wechseln in den kleineren S&P SmallCap 600.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Erklärt, warum allein die Aufnahme in einen Index einen Kurs bewegen kann, ohne dass sich am Geschäft etwas ändert.',
      relatedTopics: ['wie-funktioniert-der-markt', 'etf'],
      relatedSymbols: ['sp500'],
      sources: [
        {
          label:
            'StockTitan, 4.9.2026: „Bloom Energy, Illumina, and Everpure Set to Join S&P 500“',
          url: 'https://www.stocktitan.net/news/BE/bloom-energy-illumina-and-everpure-set-to-join-s-p-500-others-to-a0i4hthbnifg.html',
        },
      ],
    },
  ],
  further: [
    {
      headline:
        'Norwegens Staatsfonds schlägt vor: weniger US-Staatsanleihen, mehr Unternehmensanleihen',
      summary: [
        'Der 2,3 Billionen Dollar schwere norwegische Staatsfonds NBIM will laut Handelsblatt den Anteil von US-Staatsanleihen im eigenen Referenzindex von 70 auf 50 Prozent senken.',
      ],
      category: 'Vorsorge',
      whyItMatters:
        'Ein derart großer Investor kann mit seiner Neuausrichtung Signalwirkung für andere institutionelle Anleger am Anleihemarkt entfalten.',
      relatedTopics: ['staatsanleihe', 'rente'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'Handelsblatt, 4.9.2026: „Umschichtung: Norwegens Staatsfonds plant massiven Abbau von US-Staatsanleihen“',
          url: 'https://www.handelsblatt.com/finanzen/geldpolitik/umschichtung-norwegens-staatsfonds-plant-massiven-abbau-von-us-staatsanleihen/100252100.html',
        },
      ],
    },
    {
      headline:
        'Perth Mint: Absatz bricht ein, der Umsatz kaum – der Goldpreis erklärt den Unterschied',
      summary: [
        'Die Perth Mint verkaufte im August laut Goldreporter 22,5 Prozent weniger Gold als im Juli, weil der durchschnittliche Preis im selben Zeitraum um rund 8 Prozent stieg.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Zeigt, wie ein steigender Preis einen Mengenrückgang beim Umsatz ausgleichen kann – und warum ein einzelner Monat wenig über den Jahrestrend sagt.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: ['gold', 'silber'],
      sources: [
        {
          label:
            'Goldreporter, 5.9.2026: „Perth Mint: Gold- und Silberabsatz fällt im August deutlich“',
          url: 'https://www.goldreporter.de/perth-mint-gold-silber-absatz-august-2026/australien/261573/',
        },
      ],
    },
  ],
}
