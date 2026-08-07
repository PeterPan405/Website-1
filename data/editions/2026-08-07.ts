import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-07.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-07 03:33 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-07',
  intro:
    'Der 7.8.2026 in Zahlen aus dem eigenen Bestand. Was sich bewegt hat, wie breit es getragen war und was die Zahlen nicht verraten.',
  top: [
    {
      headline: 'Leitindizes: Nikkei 225 (Japan) vorn, Nasdaq 100 hinten',
      summary: [
        'Zum letzten abgerufenen Schluss steht Nikkei 225 (Japan) bei +3,66 Prozent, Nasdaq 100 bei −0,39 Prozent.',
        'Die Spanne zwischen beiden ist der eigentliche Befund des Tages, nicht der einzelne Indexstand.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Indexstand allein ist keine Aussage über einen Markt: Performance- und Kursindizes rechnen verschieden, und ein Vergleich zwischen ihnen misst die Rechenweise mit.',
      relatedTopics: ['boerse'],
      relatedSymbols: ['nikkei-225', 'nasdaq-100'],
      sources: [
        {
          label: 'Eigene Kursübersicht, Yahoo-Tagesdaten, Stand 7.8.2026, 01:06 Uhr UTC',
          url: 'https://iminvests.de/maerkte',
        },
      ],
    },
    {
      headline: '488 Titel im Plus, 528 im Minus',
      summary: [
        'Am 7.8.2026 lag der ungewichtete Schnitt über alle ausgewerteten Aktien bei −0,07 Prozent.',
        'Die Bewegung war zu 52,0 Prozent getragen – so groß ist der Anteil der Titel, die mit dem Gesamtschnitt liefen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ob ein Plus von allen Titeln getragen wird oder von drei schweren Werten, ist am Indexstand nicht ablesbar. Die Breite macht genau diesen Unterschied sichtbar.',
      relatedTopics: ['wie-funktioniert-der-markt'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label: 'Eigene Marktbreite-Aufzeichnung, Stand 7.8.2026, 01:06 Uhr UTC',
          url: 'https://iminvests.de/maerkte/tagesbild',
        },
      ],
    },
    {
      headline: 'Von +12,83 Prozent bis −19,03 Prozent: die Spanne des Tages',
      summary: [
        'Über 1026 geführte Aktien führte Kao, am Ende stand Datadog.',
        'Aus den Kursdaten geht die Bewegung hervor, nicht ihr Anlass.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Prozentzahlen ohne Bezugspunkt führen in die Irre: Bei einem niedrigen Kurs erzeugt eine kleine Bewegung eine große Zahl, und ein Minus wiegt schwerer als ein gleich großes Plus.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: [],
      sources: [
        {
          label: 'Eigene Kursübersicht, Yahoo-Tagesdaten, Stand 7.8.2026, 01:06 Uhr UTC',
          url: 'https://iminvests.de/maerkte',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Realzins bei rund -0,4 Prozentpunkten',
      summary: [
        'Leitzins 2,40 Prozent (Stand 5.8.2026) gegen eine deutsche Inflationsrate von 2,8 Prozent für 2026-07.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Der Kontostand steigt, die Kaufkraft kann trotzdem sinken. Erst die Differenz aus Zins und Inflation sagt, ob Erspartes tatsächlich mehr wert wird.',
      relatedTopics: ['inflation', 'tagesgeld'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'Europäische Zentralbank über die eigene Zinsübersicht, Stand 5.8.2026, 09:05 Uhr UTC',
          url: 'https://iminvests.de/maerkte/zinsen',
        },
      ],
    },
    {
      headline: 'Gold bei 4.290,40 Dollar, umgerechnet rund 3.717,21 Euro',
      summary: [
        'Der Euro notierte zuletzt bei 1,1542 Dollar (Stand 6.8.2026).',
        'Der Euro-Preis eines Dollar-Rohstoffs bewegt sich mit zwei Größen zugleich.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Wer einen in Dollar notierten Rohstoff hält, hält immer auch eine Währungsposition. Ein steigender Euro-Preis muss nichts über den Rohstoff selbst aussagen.',
      relatedTopics: ['rohstoffe', 'waehrungen-wechselkurse'],
      relatedSymbols: ['gold', 'eur-usd'],
      sources: [
        {
          label: 'Eigene Kursübersicht, Yahoo-Tagesdaten, Stand 7.8.2026, 01:06 Uhr UTC',
          url: 'https://iminvests.de/maerkte',
        },
        {
          label: 'Europäische Zentralbank, Referenzkurs vom 6.8.2026',
          url: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html',
        },
      ],
    },
  ],
}
