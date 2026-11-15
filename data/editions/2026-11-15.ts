import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-15.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-15 00:15 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-15',
  intro:
    'Gold verliert sein Kursziel, Bitcoin ein Drittel Vertrauen, Trump einen Flug nach China – und Berkshire bricht Rekorde gegen den Trend.',
  top: [
    {
      headline: 'Goldman Sachs senkt Goldpreisziele für 2026 und 2027',
      summary: [
        'Goldman Sachs hat seine Goldpreisziele gesenkt: für Ende 2026 um 500 auf 4.150 Dollar je Feinunze, für Ende 2027 von 5.400 auf 4.800 Dollar.',
        'Als Grund nennt die Bank eine strengere US-Notenbank mit einer erwarteten weiteren Zinserhöhung im Dezember. Der Goldpreis selbst schloss am Freitag bei 3.883 Dollar.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Ein Kursziel ist die gebündelte Zinserwartung einer Bank, keine Prognose des Goldpreises selbst – es ändert sich, wenn sich die Zinserwartung ändert.',
      relatedTopics: ['rohstoffe', 'notenbanken-geldpolitik'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'Kitco News, 13. November 2026, 18:09 Uhr: „Goldman Sachs cuts year-end gold price target to $4,150/oz, 2027 target to $4,800/oz"',
          url: 'https://www.kitco.com/news/article/2026-11-13/goldman-sachs-cuts-year-end-gold-price-target-4150oz-2027-target-4800oz',
        },
        {
          label:
            'goldreporter.de, 14. November 2026: „Goldman Sachs senkt Goldpreis-Ziel erneut"',
          url: 'https://www.goldreporter.de/goldman-sachs-senkt-goldpreis-ziel-erneut/banken/263102/',
        },
      ],
    },
    {
      headline: 'Trump reist zu erstem Dreiertreffen mit Xi und Putin',
      summary: [
        'Donald Trump reist am 18. und 19. November zum APEC-Gipfel nach Shenzhen. Dort soll es nach Angaben des Weißen Hauses zu einem ersten Dreiertreffen mit Xi Jinping und Wladimir Putin kommen.',
        'Im Fokus stehen laut US-Beamten die Umsetzung des Handelsabkommens mit China sowie eine mögliche Reduzierung der Atomwaffenbestände mit Russland. Zu einem konkreten Ergebnis kam es nach Angaben eines Beamten bislang nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Treffen mit beiden Großmächten zugleich kann Handels- und Sicherheitsfragen verknüpfen, die sonst getrennt verhandelt werden – mit Folgen für Zölle und Rohstoffmärkte.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'CNBC, 13. November 2026: „Trump doesn\'t plan to raise Nvidia, spy issue during China trip: U.S. officials"',
          url: 'https://www.cnbc.com/2026/11/13/trump-nvidia-huang-china.html',
        },
        {
          label:
            'wallstreet-online, dpa-AFX ROUNDUP vom 14.11.2026: „Trump trifft Xi und Putin in China"',
          url: 'https://www.wallstreet-online.de/nachricht/21693273-roundup-trump-trifft-xi-putin-china',
        },
      ],
    },
    {
      headline: 'Bitcoin fällt auf Dreimonatstief',
      summary: [
        'Bitcoin fiel in der Nacht auf Freitag zeitweise auf 67.757 Dollar, den tiefsten Stand seit drei Monaten. Am Nachmittag erholte sich der Kurs nur leicht auf rund 69.000 Dollar.',
        'Als Belastung gelten Spekulationen auf weitere Zinserhöhungen der US-Notenbank nach den US-Inflationsdaten vom 9. November sowie die Unsicherheit um einen Führungswechsel in der Chipbranche.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Bitcoin reagiert zunehmend wie eine klassische Risikoanlage auf Zinserwartungen – wer hier nach Sicherheit sucht, sollte diese Korrelation kennen.',
      relatedTopics: ['bitcoin-krypto', 'risiko-und-rendite'],
      relatedSymbols: ['bitcoin'],
      sources: [
        {
          label:
            'WirtschaftsWoche, 13. November 2026: „Bitcoin-Kurs aktuell: Bitcoin fällt auf Drei-Monats-Tief zurück"',
          url: 'https://www.wiwo.de/finanzen/boerse/bitcoin-kurs-aktuell-bitcoin-faellt-auf-drei-monats-tief-zurueck/27382428.html',
        },
        {
          label:
            'Handelsblatt, 13. November 2026: „Kryptowährung: Bitcoin rutscht unter 70.000 Dollar – Inflationssorgen belasten"',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/kryptowaehrung-bitcoin-rutscht-unter-70.000-dollar-inflationssorgen-belasten/100269634.html',
        },
      ],
    },
    {
      headline: 'Berkshire Hathaway erreicht viertes Rekordhoch in Folge',
      summary: [
        'Berkshire Hathaway schloss am Freitag zum vierten Mal in Folge auf einem Rekordhoch, die A-Aktie bei rund 889.794 Dollar, die B-Aktie bei etwa 592,94 Dollar.',
        'Seit Anfang Oktober legten beide Aktienklassen rund 19,1 Prozent zu, während der S&P 500 im selben Zeitraum rund 1,2 Prozent verlor. Als Grund gilt die Rolle als sicherer Hafen gegenüber hoch bewerteten Technologiewerten.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wenn eine einzelne Aktie den Gesamtmarkt deutlich abhängt, zeigt das, wie unterschiedlich Anleger Risiken in derselben Marktphase einschätzen können.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['berkshire', 'sp500'],
      sources: [
        {
          label:
            'CNBC, 14. November 2026: „Berkshire breaks out to record high with fourth-quarter rally reaching 19%"',
          url: 'https://www.cnbc.com/2026/11/14/berkshire-breaks-out-to-record-high-with-fourth-quarter-rally-reaching-19percent.html',
        },
        {
          label: 'Yahoo Finance, Kursseite BRK-B, Schlusskurs vom 13. November 2026',
          url: 'https://finance.yahoo.com/quote/BRK-B/',
        },
      ],
    },
    {
      headline: 'KI-Agenten drängen in den Zahlungsverkehr',
      summary: [
        'KI-Assistenten können bereits eigenständig einkaufen und mit einer Kreditkarte bezahlen. Einem bislang unbestätigten Bericht zufolge blockiert JPMorgan solche Zahlungen, wenn Kunden ihre Kartendaten direkt weitergeben, während andere Banken sie bereits zulassen.',
        'Visa und Mastercard entwickeln eigene Systeme für automatisierte Zahlungen, Stripe setzt auf seine digitale Geldbörse Link mit mehr als 300 Millionen Nutzern. Die US-Bankenaufsicht OCC veröffentlichte dazu Anfang November einen ersten Prüfrahmen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wer die Technik hinter einem KI-Einkauf kontrolliert, bestimmt mit, wie Gebühren zwischen Banken, Kartennetzwerken und Händlern künftig verteilt werden.',
      relatedTopics: ['kosten-und-gebuehren'],
      relatedSymbols: ['jpmorgan', 'visa', 'mastercard'],
      sources: [
        {
          label:
            'wallstreet-online, 14.11.2026: „KI-Bots übernehmen Kreditkarten: Banken zittern vor der Zahlungs-Revolution"',
          url: 'https://www.wallstreet-online.de/nachricht/21689457-ki-bots-greifen-banken-an-ki-bots-uebernehmen-kreditkarten-banken-zittern-zahlungs-revolution',
        },
      ],
    },
  ],
  further: [],
}
