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
    'Inflation vorläufig 2,8 Prozent, zwei Zahlen zum Arbeitsmarkt – und an der Wall Street fällt Apple, während Amazon neun Prozent zulegt.',
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
      headline: 'Apple verliert sechs Prozent – trotz 22 Prozent mehr iPhones',
      summary: [
        'Der iPhone-Absatz stieg um 22 Prozent, der Quartalsumsatz übertraf die Schätzungen – und die Aktie fiel nachbörslich um mehr als sechs Prozent. Verfehlt wurden die Erwartungen bei den Umsätzen im Dienstleistungsbereich.',
        'Hardware verkauft sich einmalig und schwankt mit dem Produktzyklus. Dienstleistungen kommen wiederkehrend und mit höherer Marge – eine Enttäuschung dort wiegt schwerer als ein guter Hardware-Monat.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Kurs enthält die Erwartung bereits, bevor die Zahlen erscheinen. Erfüllt sie sich nur, ist das keine Nachricht. Bewegung entsteht allein durch die Abweichung – deshalb ist „gute Zahlen, fallender Kurs“ kein Widerspruch.',
      relatedTopics: ['aktie', 'wann-kaufen-verkaufen', 'anlegerpsychologie'],
      relatedSymbols: ['apple', 'nasdaq-100'],
      sources: [
        {
          label:
            'Trading Economics: US-Aktienmarktindex – Marktbericht vom 31. Juli 2026',
          url: 'https://de.tradingeconomics.com/united-states/stock-market',
        },
      ],
    },
    {
      headline: 'Amazon springt neun Prozent – nach Börsenschluss',
      summary: [
        'Amazon stieg im nachbörslichen Handel um mehr als neun Prozent, nach einem Quartalsumsatz über den Prognosen. Getragen hat ihn das Cloud-Geschäft und die Erwartung weiter steigender Ausgaben für künstliche Intelligenz.',
        'Große US-Unternehmen berichten fast immer nach Handelsschluss – damit alle dieselbe Zeit zum Lesen haben. Gehandelt wird trotzdem, nur mit sehr viel weniger Beteiligten.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Weniger Beteiligte heißen größere Ausschläge bei kleineren Aufträgen. Der nachbörsliche Kurs ist ein Signal, keine feststehende Bewertung – und selten der Eröffnungskurs des nächsten Tages.',
      relatedTopics: ['aktie', 'boerse', 'wann-kaufen-verkaufen'],
      relatedSymbols: ['amazon', 'nasdaq-100'],
      sources: [
        {
          label:
            'Trading Economics: US-Aktienmarktindex – Marktbericht vom 31. Juli 2026',
          url: 'https://de.tradingeconomics.com/united-states/stock-market',
        },
      ],
    },
    {
      headline: 'Nasdaq +2,8, Dow +1,2 – ein Tag, drei verschiedene Zahlen',
      summary: [
        'Am Donnerstag stieg der Nasdaq Composite um 2,78 Prozent, der S&P 500 um 1,66 und der Dow um 1,19. Vorn lagen Technologie-, Konsumgüter- und Industriewerte.',
        'Der Dow gewichtet nach Kurs je Aktie über dreißig Werte, der S&P 500 nach Marktwert über fünfhundert, der Nasdaq nach Marktwert mit Technologieschwerpunkt. Drei Baupläne, drei Ergebnisse.',
      ],
      category: 'Märkte',
      whyItMatters:
        '„Die Börse ist gestiegen“ ist unvollständig, solange nicht dabeisteht, welche. Der Abstand von 2,78 zu 1,19 Prozent an einem einzigen Tag ist kein Messfehler, sondern die Bauart.',
      relatedTopics: ['boerse', 'etf', 'aktien-laender-branchen'],
      relatedSymbols: ['nasdaq-100', 'sp500', 'dow-jones'],
      sources: [
        {
          label:
            'Trading Economics: US-Aktienmarktindex – Marktbericht vom 31. Juli 2026',
          url: 'https://de.tradingeconomics.com/united-states/stock-market',
        },
      ],
    },
    {
      headline: 'Chipwerte legen weiter zu – fünf Namen, fünf verschiedene Zahlen',
      summary: [
        'Im erweiterten Handel stiegen Sandisk um 5,4 Prozent, Intel um 4,3, Micron und AMD um je 3 – und Nvidia um 0,7. Die Schlagzeile lautet „Chipwerte steigen“, und sie stimmt.',
        'Zwischen 0,7 und 5,4 Prozent liegt aber ein Faktor von fast acht. Speicherhersteller, Auftragsfertiger und Entwickler von Grafikprozessoren liegen im selben Sammelbegriff, aber nicht im selben Geschäft.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Fünf Halbleiterwerte im Depot sind nicht fünffach gestreut: Sie hängen an derselben Nachfrage und derselben Lieferkette. An schlechten Tagen fallen sie gemeinsam, und die Spanne wird kleiner statt größer.',
      relatedTopics: [
        'aktien-laender-branchen',
        'portfolio-aufbau',
        'risiko-und-rendite',
      ],
      relatedSymbols: ['nvidia', 'amd', 'intel'],
      sources: [
        {
          label:
            'Trading Economics: US-Aktienmarktindex – Marktbericht vom 31. Juli 2026',
          url: 'https://de.tradingeconomics.com/united-states/stock-market',
        },
      ],
    },
  ],
}
