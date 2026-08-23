import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-23.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-23 02:05 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-23',
  intro:
    'Drei Banken nennen für den S&P 500 dieselbe Marke, der Russell 2000 hängt die Riesen ab, und die neue Woche bringt ifo-Index und deutsches BIP.',
  top: [
    {
      headline: 'Drei Banken sehen den S&P 500 bei 8.000 Punkten',
      summary: [
        'JPMorgan, Goldman Sachs und Fundstrat-Stratege Tom Lee nennen laut Nachrichtenticker unabhängig voneinander dieselbe Marke von 8.000 Punkten für den S&P 500 und verweisen dabei auf die hohen KI-Investitionen als Treiber.',
        'Zum Wochenschluss legten Dow Jones und Nasdaq 100 bereits um 0,95 beziehungsweise 0,32 Prozent zu.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, dass ein von mehreren Banken geteiltes Kursziel eher eine gemeinsame Erwartungshaltung beschreibt als eine gesicherte Vorhersage.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['sp500', 'dow-jones'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 23.8.2026, 02:14 Uhr: „JPMorgan sieht S&P-500-Ziel bei 8.000 Punkten“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Russell 2000 auf Rekordhoch, Magnificent Seven bleiben zurück',
      summary: [
        'Der Russell 2000 markiert laut Ticker ein Rekordhoch und lässt sowohl den S&P 500 als auch die Magnificent Seven mit Nvidia und Apple hinter sich, ohne dass die Meldung einen Grund dafür nennt.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Erinnert daran, dass kleine und große US-Aktien sich zeitweise gegenläufig entwickeln können, obwohl sie meist im Gleichschritt laufen.',
      relatedTopics: ['aktien-laender-branchen', 'risiko-und-rendite'],
      relatedSymbols: ['russell-2000', 'nvidia'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 23.8.2026, 01:41 Uhr: „Russell 2000 auf Rekordhoch“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Palantir nach starkem Quartal: Wächst die Bewertung mit?',
      summary: [
        'Ein Nachrichtenticker fragt, wie tragfähig die Bewertung von Palantir nach der jüngsten Rally und einem starken Quartal noch ist – konkrete Kennzahlen dazu liefert die Überschrift selbst nicht.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Macht deutlich, dass ein starkes Quartal und eine hohe Bewertung zwei getrennte Fragen sind, die ein Anleger einzeln beantworten muss.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['palantir'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 23.8.2026, 01:11 Uhr: „Palantir-Aktie nach starkem Quartal: Wie tragfähig ist die Bewertung nach der Rally?“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'TecDAX-Woche 34: große Unterschiede zwischen Gewinnern und Verlierern',
      summary: [
        'Ein Rückblick auf die Kalenderwoche 34 zeigt laut Ticker deutliche Unterschiede zwischen den Gewinnern und Verlierern im TecDAX, ohne dass die Überschrift einzelne Werte oder Prozentzahlen nennt.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Indexstand allein verdeckt oft, wie unterschiedlich sich die einzelnen Mitgliedsaktien in derselben Woche entwickelt haben.',
      relatedTopics: ['aktie', 'aktien-laender-branchen'],
      relatedSymbols: ['tecdax'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 23.8.2026, 03:15 Uhr: „Die Highlights und Lowlights im TecDAX: Gewinner und Verlierer der KW 34“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Tether kauft trotz Goldpreis-Rücksetzer weiter Gold',
      summary: [
        'Der Stablecoin-Emittent Tether baut laut Ticker seine Goldreserven auch nach einem Rücksetzer des Goldpreises weiter aus – einen Grund für diese Entscheidung nennt die Meldung nicht.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Zeigt eine ungewöhnliche Verbindung zwischen einem Krypto-Unternehmen und einem klassischen Krisenmetall als Reservewert.',
      relatedTopics: ['bitcoin-krypto', 'rohstoffe'],
      relatedSymbols: ['bitcoin', 'gold'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 22.8.2026: „Zentralbank als Vorbild? Tether ignoriert den Goldpreis-Rutsch und kauft weiter kräftig zu“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
}
