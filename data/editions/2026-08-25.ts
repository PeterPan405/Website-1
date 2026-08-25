import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-25.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-25 01:56 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-25',
  intro:
    'Trump droht Kanada mit neuen Zöllen auf Autos und Stahl, Gold hält trotz steigender Zinsen, und Alibaba wie Samsung fallen trotz eigentlich starker Nachrichten.',
  top: [
    {
      headline: 'Trump droht Kanada mit neuen Zöllen auf Autos, Lkw und Stahl',
      summary: [
        'Ein Ticker meldet eine neue Zoll-Drohung der USA gegen Kanada in Höhe von 50 Prozent, diesmal gerichtet gegen Autos, Lastwagen und Stahl.',
        'Erst vor Kurzem hatte Trump laut einer früheren Meldung Zölle gegen Kanada im Gegenzug für eine Öl-Pipeline pausiert – die neue Drohung betrifft einen anderen Bereich.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein eskalierender Handelsstreit zwischen zwei eng verflochtenen Volkswirtschaften kann Lieferketten und Kosten in der gesamten Autoindustrie beeinflussen, nicht nur in Kanada.',
      relatedTopics: ['aktien-laender-branchen'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 24.8.2026: „ROUNDUP 2/Autos, Lkw, Stahl: Trump droht Kanada mit 50-Prozent-Zoll“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Gold über 4.650 Dollar, obwohl die Anleiherenditen steigen',
      summary: [
        'Gold notiert laut Goldreporter und finanzen.net über 4.650 US-Dollar, während laut Goldreporter gleichzeitig die Renditen von US-Staatsanleihen und Bundesanleihen steigen – eigentlich ein Gegensatz zur üblichen Logik.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Steigende Zinsen gelten normalerweise als Belastung für zinslose Anlagen wie Gold – hält sich der Kurs trotzdem, deutet das auf andere, stärkere Kaufmotive hin.',
      relatedTopics: ['rohstoffe', 'staatsanleihe'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'Goldreporter, 24. August 2026: „Marktzinsen bleiben hoch – Goldpreis über 4.600 USD“',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline: 'Alibaba und Samsung fallen trotz eigentlich positiver Nachrichten',
      summary: [
        'Alibaba bricht laut Ticker nach einer milliardenschweren Kapitalerhöhung für die eigene KI-Offensive ein, statt davon zu profitieren.',
        'Samsung stürzt trotz einer angekündigten Rekord-Ausschüttung ab – Anleger zeigen sich laut Meldung enttäuscht, ohne dass der Grund genannt wird.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Beide Fälle zeigen, dass eine für sich genommen positiv klingende Unternehmensmeldung nicht automatisch zu einem steigenden Kurs führt, wenn die Erwartungen der Anleger höher lagen.',
      relatedTopics: ['anlegerpsychologie', 'risiko-und-rendite'],
      relatedSymbols: ['alibaba', 'samsung'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 24.8.2026: „Alibaba-Aktie bricht nach milliardenschwerer Kapitalerhöhung für KI-Offensive ein“ und „Samsung-Aktie stürzt ab: Anleger enttäuscht von Rekord-Ausschüttung“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
  further: [
    {
      headline:
        'FDA genehmigt Alzheimer-Bluttest von Roche und Eli Lilly – Aktien trotzdem rot',
      summary: [
        'Die US-Arzneimittelbehörde FDA lässt laut Ticker einen gemeinsam entwickelten Alzheimer-Bluttest von Roche und Eli Lilly zu, die Aktien beider Konzerne notieren trotzdem im Minus.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Der Fall zeigt, dass selbst eine behördliche Zulassung, an sich eine gute Nachricht, keine verlässliche Kursreaktion garantiert – der Markt kann Erwartungen längst eingepreist haben.',
      relatedTopics: ['anlegerpsychologie'],
      relatedSymbols: ['roche', 'eli-lilly'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 24.8.2026: „FDA genehmigt Alzheimer-Bluttest von Roche und Eli Lilly - Aktien in Rot“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Nvidia vor den Zahlen: Diesmal soll die Marge über den Kurs entscheiden',
      summary: [
        'Nvidia steht laut Ticker vor dem nächsten Quartalsbericht, die Aktie gerät zuvor bereits unter Verkaufsdruck.',
        'Eine weitere Meldung deutet an, dass sich der Engpass des KI-Booms von Speicherchips hin zu Energieversorgern wie Constellation Energy verschieben könnte.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Rückt bei einem etablierten Wachstumswert die Marge statt des Umsatzes in den Fokus, verändert das, woran Anleger einen guten oder schlechten Quartalsbericht künftig festmachen.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['nvidia', 'microsoft'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 24.8.2026: „NVIDIA-Aktie vor dem Quartalsbericht: Warum die Marge über den Börsenherbst entscheidet“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Ölpreis: Zwei Portale, zwei sehr unterschiedliche Prozentzahlen',
      summary: [
        'finanzen.net zeigt Öl in der Kursleiste mit 92,33 US-Dollar und einem Plus von 0,2 Prozent, wallstreet-online zeigt Öl (Brent) mit 90,39 US-Dollar und einem Minus von 3,73 Prozent – zur selben Nachtzeit abgerufen.',
        'Welche Referenz, welcher Vortagesschluss oder welche Kontraktlaufzeit die Abweichung erklärt, geht aus keiner der beiden Kursleisten hervor.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Wer zwei Quellen für denselben Rohstoffpreis vergleicht und dabei stark abweichende Prozentzahlen sieht, sollte zuerst prüfen, welche genaue Notierung und welcher Bezugspunkt gemeint sind, bevor er daraus eine Bewegung ableitet.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['wti', 'brent'],
      sources: [
        {
          label: 'finanzen.net, Kursleiste vom 25.8.2026, 01:56 Uhr',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label: 'wallstreet-online.de, Kursleiste vom 25.8.2026, 01:56 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
