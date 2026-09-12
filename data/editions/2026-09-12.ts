import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-12.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-12 04:45 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-12',
  intro:
    'Ölpreise fallen trotz abgeschalteter Pipeline in Saudi-Arabien, US-Hypotheken klettern über sieben Prozent, und Notenbanken kaufen weiter Gold.',
  top: [
    {
      headline: 'US-Hypothekenzinsen springen über sieben Prozent',
      summary: [
        'Die US-Hypothekenzinsen sind wieder über die Marke von sieben Prozent gestiegen und drängen Käufer aus dem Markt, meldete wallstreet-online.',
        'Baukonzerne wie D.R. Horton und Lennar sowie Banken wie Wells Fargo gerieten daraufhin unter Druck, weil ein hoher Ölpreis zugleich die Anleiherenditen treibt.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Zeigt, wie Ölpreis, Anleiherenditen und Hypothekenzinsen über mehrere Stationen zusammenhängen, statt unabhängig voneinander zu schwanken.',
      relatedTopics: ['immobilien', 'staatsanleihe'],
      relatedSymbols: ['dr-horton', 'lennar'],
      sources: [
        {
          label: 'wallstreet-online, Private Finanzen, Meldung vom 11.09.2026',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline:
        'US-Inflation blieb hoch – Gold und Wall Street reagierten trotzdem entspannt',
      summary: [
        'Die US-Inflationsrate blieb im August stabil, doch die niedrigere Kernrate sorgte laut Goldreporter für Erleichterung und stützte den Goldpreis.',
        'Ein zusätzlich fallender Ölpreis half Dow Jones, S&P 500 und Nasdaq am selben Handelstag zu einem Plus, meldete onvista unter Berufung auf dpa-AFX.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Verdeutlicht, dass eine insgesamt hohe Inflationsrate und eine beruhigende Kernrate an Börsen und Goldmarkt unterschiedlich wirken können.',
      relatedTopics: ['inflation'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label: 'Goldreporter, Meldung vom 11.09.2026',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline: 'Saudi-Arabien schaltet Pipeline ab – der Ölpreis fällt trotzdem',
      summary: [
        'Nach Angriffen legte Saudi-Arabien eine wichtige Pipeline still, meldete dpa-AFX – der Ölpreis reagierte darauf mit einem Rückgang statt einem Anstieg.',
        'Zwei Kursleisten nannten für denselben Ölpreis von rund 104,50 Dollar unterschiedliche Tagesprozente: minus 2,8 und minus 4,06 Prozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt an einem konkreten Beispiel, dass dieselbe Kursbewegung je nach Bezugspunkt des Anbieters unterschiedlich groß ausgewiesen wird.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label: 'wallstreet-online, Rohstoffnachrichten vom 11.09.2026, dpa-AFX-Meldung',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline:
        'Polen und Brics-Staaten kaufen Gold, Norwegen will Dollar-Anleihen verkaufen',
      summary: [
        'Polens Notenbank peilt inzwischen 700 Tonnen Gold in ihren Reserven an, und auch China sowie andere Brics-Staaten kauften laut wallstreet-online zuletzt kräftig zu.',
        'Norwegens Staatsfonds will dagegen laut Goldreporter US-Anleihen im Wert von fast 80 Milliarden Dollar abstoßen.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Macht sichtbar, dass staatliche Akteure ihre Reserven zwischen Gold und Dollar-Anleihen zeitgleich in gegensätzliche Richtungen verschieben.',
      relatedTopics: ['rohstoffe', 'staatsanleihe'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label: 'Goldreporter, Top-News, Stand 12.09.2026, 04:45 Uhr',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline: 'Deutscher Leistungsbilanzüberschuss und Rentenmarkt wuchsen im Juli',
      summary: [
        'Die deutsche Leistungsbilanz verzeichnete im Juli einen Überschuss von 21,2 Milliarden Euro, 2,3 Milliarden Euro mehr als im Juni, meldete die Bundesbank.',
        'Der Bruttoabsatz am deutschen Rentenmarkt stieg im selben Monat auf 144,2 Milliarden Euro – die entsprechende Nettozahl nennt die ausgewertete Quelle nicht.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Zeigt an zwei Bundesbank-Zahlen, wie Außenhandel und Anleihemarkt sich im selben Monat entwickelten, und wo eine Überschrift mehr verspricht als der Text belegt.',
      relatedTopics: ['staatsanleihe', 'schuldverschreibung'],
      relatedSymbols: [],
      sources: [
        {
          label: 'Deutsche Bundesbank, Pressemitteilung vom 11.09.2026',
          url: 'https://www.bundesbank.de/de/presse/pressenotizen',
        },
      ],
    },
  ],
}
