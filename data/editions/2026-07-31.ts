import type { DailyEdition } from './types'

/**
 * Ausgabe vom 31. Juli 2026.
 *
 * Ein Tag der amtlichen Zahlen statt der Kurse: die vorläufige Inflationsrate
 * für Juli und der jüngste Arbeitsmarktbericht. Beide Meldungen eignen sich
 * weniger zum Nacherzählen als zum Erklären – es geht in beiden darum, was
 * eine Zahl eigentlich misst und was das Wort daneben bedeutet.
 *
 * Bewusst kurz. Um sieben Uhr morgens sind die Tageszahlen noch nicht
 * veröffentlicht: Der Arbeitsmarktbericht für Juli erscheint gegen zehn, die
 * Eurostat-Schnellschätzung gegen elf. Was hier steht, ist über die
 * angegebenen Quellen belegt – der Rest des Tages gehört in die Ausgabe von
 * morgen und nicht in eine Vermutung von heute.
 */
export const edition: DailyEdition = {
  date: '2026-07-31',
  intro:
    'Die Inflation liegt im Juli vorläufig bei 2,8 Prozent, und der Arbeitsmarktbericht nennt zwei Zahlen, die beide stimmen und Verschiedenes messen.',
  top: [
    {
      headline: 'Inflation im Juli: vorläufig 2,8 Prozent',
      summary: [
        'Das Statistische Bundesamt hat die Verbraucherpreise für Juli 2026 veröffentlicht. Die Inflationsrate liegt voraussichtlich bei 2,8 Prozent gegenüber dem Vorjahresmonat. Die endgültigen Ergebnisse erscheinen am 12. August 2026.',
        'Das Wort „voraussichtlich“ steht nicht aus Vorsicht in der Überschrift. Für die Schnellschätzung liegt noch nicht jede Preiserhebung vor; das Amt rechnet mit dem, was bis zum Monatsende eingetroffen ist, und schließt auf den Rest.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Wer eine vorläufige Zahl als feststehend zitiert, zitiert etwas, das noch nicht feststeht. In aller Regel bleibt sie gleich oder verschiebt sich um ein Zehntel – aber die Unterscheidung zwischen Schätzung und Ergebnis gehört zu jeder Wirtschaftszahl, die man liest.',
      relatedTopics: ['inflation', 'notenbanken-geldpolitik'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'Statistisches Bundesamt: Inflationsrate im Juli 2026 voraussichtlich +2,8 % (Pressemitteilung Nr. 270)',
          url: 'https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/07/PD26_270_611.html',
        },
      ],
    },
    {
      headline:
        'Arbeitsmarkt: 2,94 Millionen Arbeitslose, 3,61 Millionen Unterbeschäftigte',
      summary: [
        'Im jüngsten Monatsbericht der Bundesagentur für Arbeit stehen beide Zahlen nebeneinander: 2.936.000 Arbeitslose bei einer Quote von 6,2 Prozent – und 3.605.000 Unterbeschäftigte. Der Abstand beträgt fast siebenhunderttausend Menschen.',
        'Der Unterschied ist keine Ungenauigkeit, sondern die Abgrenzung. Wer in einer Fortbildung sitzt, in einer Maßnahme steckt oder kurzfristig arbeitsunfähig ist, zählt nicht als arbeitslos – in der Unterbeschäftigung aber schon.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die Arbeitslosenquote lässt sich durch mehr Maßnahmen senken, ohne dass eine einzige Stelle entsteht. Die Unterbeschäftigung nicht. Wer wissen will, wie der Arbeitsmarkt steht, liest deshalb beide Zahlen – und die zweite ist die robustere.',
      relatedTopics: ['budget-und-sparquote', 'notenbanken-geldpolitik'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'Bundesagentur für Arbeit: Arbeitsmarkt im Juni 2026 – „Verhaltener Ausklang der Frühjahrsbelebung“ (30.06.2026)',
          url: 'https://www.arbeitsagentur.de/news/arbeitsmarkt',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Minus 15.000 oder minus 1.000? Was Saisonbereinigung tut',
      summary: [
        'Derselbe Rückgang steht zweimal im Bericht: Die Arbeitslosigkeit sank um 15.000 – saisonbereinigt um 1.000. Der Arbeitsmarkt atmet im Jahresrhythmus, und die Bereinigung rechnet dieses regelmäßige Muster heraus.',
        'Übrig bleibt, was darüber hinaus geschah. Von fünfzehn Teilen des Rückgangs waren vierzehn Jahreszeit und einer Bewegung.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Unbereinigt beschreibt die Lage, saisonbereinigt die Richtung. Das Wort steht bei fast jeder Monatszahl dabei – Arbeitsmarkt, Auftragseingang, Einzelhandel – und ist fast nie das, was in der Überschrift landet.',
      relatedTopics: ['budget-und-sparquote', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'Bundesagentur für Arbeit: Arbeitsmarkt im Juni 2026 – Monatsbericht (30.06.2026)',
          url: 'https://www.arbeitsagentur.de/news/arbeitsmarkt',
        },
      ],
    },
    {
      headline: '22.000 mehr Arbeitslose – und die Quote bleibt gleich',
      summary: [
        'Gegenüber dem Vorjahr zählt der Bericht 22.000 Arbeitslose mehr und stellt zugleich fest, dass sich die Quote nicht verändert hat. Sie liegt bei 6,2 Prozent.',
        'Eine Quote ist ein Bruch, und beide Seiten bewegen sich: Arbeitslose im Zähler, Erwerbspersonen im Nenner. Rund 0,7 Prozent mehr Arbeitslose verschwinden in der Rundung auf ein Zehntelprozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dieselbe Falle steckt in der Dividendenrendite, der Schuldenquote und der Sparquote: Jede von ihnen bewegt sich auch dann, wenn sich nur der Nenner ändert. Bei jeder Quote lohnt die Frage, welche Seite gewandert ist.',
      relatedTopics: ['budget-und-sparquote', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'Bundesagentur für Arbeit: Arbeitsmarkt im Juni 2026 – Monatsbericht (30.06.2026)',
          url: 'https://www.arbeitsagentur.de/news/arbeitsmarkt',
        },
      ],
    },
    {
      headline: 'Kurzarbeit: 133.000 – aber die Zahl ist zwei Monate alt',
      summary: [
        'Der Bericht von Ende Juni nennt die Kurzarbeiterzahlen für April: 133.000 Beschäftigte, 17.000 weniger als im Vormonat und 101.000 weniger als ein Jahr zuvor. Ausgewiesen sind sie als vorläufig hochgerechnet.',
        'Arbeitslosigkeit wird gezählt, Kurzarbeit wird abgerechnet. Erst aus der Abrechnung ergibt sich, für wie viele Beschäftigte tatsächlich gezahlt wurde – daher der Nachlauf.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Konjunkturzahlen tragen zwei Daten: das der Meldung und das des Zeitraums. Sie fallen fast nie zusammen. Eine alte Zahl für einen aktuellen Zustand zu halten ist die häufigste Fehldeutung überhaupt.',
      relatedTopics: ['budget-und-sparquote', 'notenbanken-geldpolitik'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'Bundesagentur für Arbeit: Arbeitsmarkt im Juni 2026 – Monatsbericht (30.06.2026)',
          url: 'https://www.arbeitsagentur.de/news/arbeitsmarkt',
        },
      ],
    },
    {
      headline: 'Weniger Arbeitslose – und trotzdem weniger Beschäftigte',
      summary: [
        'Derselbe Bericht nennt eine dritte Zahl: 34,84 Millionen sozialversicherungspflichtig Beschäftigte, rund 71.000 weniger als ein Jahr zuvor. Die Arbeitslosigkeit ging im Berichtsmonat um 15.000 zurück, saisonbereinigt um 1.000.',
        'Beim konjunkturellen Kurzarbeitergeld setzt sich der Rückgang fort: 133.000 Beschäftigte im April, 17.000 weniger als im Vormonat und 101.000 weniger als ein Jahr zuvor.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Sinkende Arbeitslosigkeit bei gleichzeitig sinkender Beschäftigung heißt, dass Menschen aus der Zählung gefallen sind, ohne dass Arbeit entstanden ist. Der Widerspruch zwischen zwei Zahlen ist hier die Nachricht – nicht die Zahl, die besser aussieht.',
      relatedTopics: ['budget-und-sparquote'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'Bundesagentur für Arbeit: Arbeitsmarkt im Juni 2026 – Monatsbericht (30.06.2026)',
          url: 'https://www.arbeitsagentur.de/news/arbeitsmarkt',
        },
      ],
    },
  ],
}
