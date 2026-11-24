import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-24.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-24 00:15 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-24',
  intro:
    'Jensen Huang ist zurück an der Spitze seines Chipkonzerns, Dax und Wall Street jubeln. Dazu eine Zinswarnung der Fed und ein eingefrorener US-Häusermarkt.',
  top: [
    {
      headline: 'Zurückgetretener Chip-Chef ist zurück, Dax und Wall Street jubeln',
      summary: [
        'Nvidia hat seinen zurückgetretenen Chef zurückgeholt. Jensen Huang übernimmt die Führung wieder, nur Tage nach seinem Rücktritt wegen eines Spionageskandals. Die Aktie sprang am Montag um 31 Prozent.',
        'Der Dax gewann mehr als 500 Punkte und schloss über 25.300 Zählern. Die Nasdaq legte über sechs Prozent zu. Präsident Trump reklamiert den Erfolg für sich, Abgeordnete beider Parteien kritisieren die Rückkehr scharf.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Weil Nvidia zu den größten Werten im Nasdaq-100 und S&P 500 zählt, bewegt eine einzelne Personalie über Indexfonds auch Depots, die nie bewusst in Nvidia investiert haben.',
      relatedTopics: ['aktie', 'anlegerpsychologie'],
      relatedSymbols: ['nvidia', 'nasdaq-100', 'dax'],
      sources: [
        {
          label:
            'tagesschau.de, 23.11.2026, 16:18 Uhr: „Nvidia setzt Jensen Huang wieder als Chef ein“',
          url: 'https://www.tagesschau.de/wirtschaft/huang-wieder-nvidia-chef-100.html',
        },
        {
          label:
            'CNBC, 23.11.2026, 22:08 Uhr: „Jensen Huang reinstated as Nvidia CEO. Stock skyrockets 31%“',
          url: 'https://www.cnbc.com/2026/11/23/nvidia-jensen-huang-ceo.html',
        },
      ],
    },
    {
      headline: 'Notenbanker Williams hält weitere Zinserhöhungen für wahrscheinlich',
      summary: [
        'Die US-Inflation bleibt hartnäckig hoch. Das sagte New Yorks Fed-Chef John Williams am Montag. Die Kernrate der Verbraucherpreise stieg im Oktober den dritten Monat in Folge um 0,3 Prozent.',
        'Williams hält weitere Zinserhöhungen für wahrscheinlich, einen Zeitpunkt nannte er nicht. Der Leitzins liegt seit Ende Oktober unverändert bei 3,75 bis 4 Prozent. Die nächste Fed-Sitzung ist am 8. und 9. Dezember.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Steigende Zinsen machen neue Kredite teurer und können Aktienbewertungen über die Abzinsung künftiger Gewinne belasten, während sie Anleihen und Festgeld attraktiver machen.',
      relatedTopics: ['notenbanken-geldpolitik', 'inflation'],
      relatedSymbols: ['sp500'],
      sources: [
        {
          label:
            "CNBC, 23.11.2026, 22:02 Uhr: „Fed's John Williams indicates higher interest rates likely 'over time' to address inflation“",
          url: 'https://www.cnbc.com/2026/11/23/john-williams-fed-inflation-rate-hikes.html',
        },
      ],
    },
    {
      headline: 'Amerikas Häusermarkt friert nach starkem Zinsschock ein',
      summary: [
        'Der amerikanische Häusermarkt steht praktisch still. Die Verkäufe bestehender Häuser fielen im Oktober um 5,5 Prozent zum Vormonat, auf den niedrigsten Stand seit August 2010.',
        'Auslöser war ein Zinssprung im September. Die 30-jährige Festzinshypothek stieg laut Freddie Mac von 6,86 auf 7,33 Prozent. NAR-Chefvolkswirt Yun nennt es den höchsten Zinsstand seit dem Jahr 2000.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Hohe Hypothekenzinsen bremsen nicht nur Käufer, sondern über den Lock-in-Effekt auch Verkäufer, die sonst umziehen würden – das trocknet das Angebot zusätzlich aus.',
      relatedTopics: ['immobilien', 'schulden-und-kredit'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'National Association of Realtors, 12.11.2026: „Existing Home Sales Decreased 5.5 Percent in October“',
          url: 'https://www.nar.realtor/newsroom/existing-home-sales-decreased-5-5-percent-october-nar-report',
        },
        {
          label:
            'CNBC, 23.11.2026, 16:22 Uhr: „Stuck: How a frozen housing market is hitting buyers, sellers and the economy“',
          url: 'https://www.cnbc.com/2026/11/23/housing-market-real-estate-economy.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Washington will ESG-Fonds aus der Altersvorsorge drängen',
      summary: [
        'Das US-Arbeitsministerium will ESG-Fonds einschränken. Die Neuregelung betrifft 401(k)-Rentenpläne für Millionen Beschäftigte. Anlageentscheidungen sollen künftig nur noch finanziellen Kriterien folgen, nicht sozialen oder politischen Zielen.',
        'Betroffen sind zwei bisherige Ausnahmeregeln. Schon heute bieten laut einem Branchenbericht nur rund 5 Prozent der Pläne überhaupt einen ESG-Fonds an. Berichtet hat das bislang nur eine Quelle.',
      ],
      category: 'Vorsorge',
      whyItMatters:
        'Die Regel zeigt, wie stark sich die US-Politik bei der Altersvorsorge von Nachhaltigkeitskriterien abwendet, unabhängig von der tatsächlichen Wertentwicklung solcher Fonds.',
      relatedTopics: ['rente', 'portfolio-aufbau'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'CNBC, 23.11.2026, 20:46 Uhr: „Trump administration proposes rule that could curb ESG investing in 401(k)s“',
          url: 'https://www.cnbc.com/2026/11/23/labor-department-esg-401k-rule.html',
        },
      ],
    },
    {
      headline: 'Clariant bestätigt Gespräche über eine mögliche Ashland-Übernahme',
      summary: [
        'Clariant führt Übernahmegespräche. Der Schweizer Konzern verhandelt mit dem Finanzinvestor CD&R über das US-Unternehmen Ashland. Ob daraus eine Akquisition wird, ist nach eigenen Angaben offen.',
        'Ashland ist an der Börse rund 3,2 Milliarden Dollar wert. Zuerst berichtet hatte Bloomberg unter Berufung auf Insider.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Zwischen bestätigten Gesprächen und einem festen Angebot liegen oft Wochen oder Monate – der Kurs kann beide Richtungen vorwegnehmen, ohne dass eine Einigung je zustande kommt.',
      relatedTopics: ['aktie'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'onvista, dpa-AFX, 23.11.2026, 22:08 Uhr: „Clariant bestätigt Gespräche über mögliche Ashland-Übernahme“',
          url: 'https://www.onvista.de/news/2026/11-23-clariant-bestaetigt-gespraeche-ueber-moegliche-ashland-uebernahme-0-10-26579667',
        },
        {
          label:
            'wallstreet-online, dpa-AFX, 23.11.2026: „Clariant bestätigt Gespräche über mögliche Ashland-Übernahme“',
          url: 'https://www.wallstreet-online.de/nachricht/21737458-clariant-bestaetigt-gespraeche-ashland-uebernahme',
        },
      ],
    },
  ],
}
