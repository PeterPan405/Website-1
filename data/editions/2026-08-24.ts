import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-24.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-24 02:02 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-24',
  intro:
    'Gold und Silber legen zu, während Öl nachgibt, Tesla zeigt ein neues Produkt und einen Rückruf zugleich, und Commerzbank-Chefaufseher Weidmann bremst den Bund.',
  top: [
    {
      headline: 'Gold und Silber ziehen an, Öl gibt am selben Morgen nach',
      summary: [
        'Citi bleibt laut Ticker beim Silberpreis „bullish“, Gold notiert bei 4.636 US-Dollar (+0,7 %), während Öl mit 92,54 US-Dollar um 2,0 Prozent nachgibt.',
        'Goldreporter berichtet, dass Spekulanten ihre Long-Positionen bei Gold ausgebaut haben – das Open Interest am US-Terminmarkt liegt auf einem Sechsmonatshoch.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ein hohes Open Interest zeigt, wie stark Marktteilnehmer bereits auf steigende Kurse gewettet haben – ein Stimmungssignal, das auch Rückschlagsrisiken erhöht.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: ['gold', 'silber', 'brent'],
      sources: [
        {
          label: 'Goldreporter, 23. August 2026',
          url: 'https://www.goldreporter.de/',
        },
        {
          label: 'finanzen.net, News-Ticker vom 24.8.2026, 03:54 Uhr',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Tesla: Cybercab-Start im August geplant, Rückruf in China gemeldet',
      summary: [
        'Der Robotaxi-Dienst Cybercab soll laut Ticker noch im August starten – zunächst nur für Tesla-Mitarbeiter, nicht für Kunden.',
        'Am Wochenende zuvor meldete ein anderer Ticker einen Massenrückruf von Tesla-Fahrzeugen in China, ohne Details zu Umfang oder Grund zu nennen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein neues Produkt und ein Rückruf gleichzeitig zeigen, wie Wachstumsgeschichte und operative Probleme bei Tesla nebeneinander bestehen können.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['tesla'],
      sources: [
        {
          label: 'finanzen.net, News-Ticker vom 24.8.2026, 03:37 Uhr',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Inflation trotz KI-Versprechen: Frage nach dem Fed-Zinskurs',
      summary: [
        'Ein Ticker fragt, welcher Zinskurs der Fed jetzt bevorsteht, weil die Inflation offenbar trotz der von der KI erhofften Produktivitätsgewinne anhält.',
        'Für morgen, den 25.8., stehen laut Wirtschaftskalender deutsches BIP und drei ifo-Teilindizes an – konkrete Zahlen zu heute nennt keine Quelle.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Ob KI-getriebene Produktivität Inflation tatsächlich dämpft, beeinflusst, wie schnell die Fed ihre Zinsen senken könnte – ein zentraler Faktor für Aktien- und Anleihekurse.',
      relatedTopics: ['notenbanken-geldpolitik', 'inflation'],
      relatedSymbols: ['dow-jones', 'sp500'],
      sources: [
        {
          label: 'finanzen.net, News-Ticker vom 24.8.2026, 03:34 Uhr',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Bitcoin fällt moderat, der breite Kryptoindex deutlich stärker',
      summary: [
        'Bitcoin notiert bei 66.105 US-Dollar (-0,5 %), der finanzen.net Top 10 Crypto Index verliert mit -2,0 Prozent viermal so stark.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Die Lücke zwischen Bitcoin und dem breiteren Index deutet darauf hin, dass kleinere Kryptowährungen heute stärker unter Druck stehen als Bitcoin selbst.',
      relatedTopics: ['bitcoin-krypto'],
      relatedSymbols: ['bitcoin'],
      sources: [
        {
          label: 'finanzen.net, Kursleiste vom 24.8.2026, 04:02 Uhr',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Commerzbank: Weidmann will Verkauf der Bundesanteile pausieren',
      summary: [
        'Aufsichtsratschef Jens Weidmann fordert laut Ticker, die schrittweisen Verkäufe der Bundesbeteiligung an der Commerzbank auszusetzen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein möglicher Verkaufsstopp kann den Überhang durch künftige Anteilsverkäufe nehmen und damit die Commerzbank-Aktie kurzfristig stützen.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label: 'finanzen.net, News-Ticker vom 23.8.2026',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Fondsmanager positioniert sich laut Ticker gegen den KI-Hype',
      summary: [
        'National Grid und weitere, nicht genannte Aktien sollen laut einer Kurzmeldung Teil einer Wette gegen die anhaltende KI-Euphorie an den Börsen sein.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Eine öffentlich bekannte Contrarian-Wette zeigt, dass nicht alle professionellen Anleger den KI-Trend gleich einschätzen – auch wenn die genaue Begründung offenbleibt.',
      relatedTopics: ['anlegerpsychologie'],
      relatedSymbols: [],
      sources: [
        {
          label: 'finanzen.net, News-Ticker vom 24.8.2026, 03:54 Uhr',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline:
        'Greenlight Capital: Wie sich David Einhorn im 2. Quartal positioniert hat',
      summary: [
        'Ein Ticker verweist auf die neue Positionierung von Greenlight Capital im zweiten Quartal, ohne einzelne Positionen oder Veränderungen zu nennen.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Positionierungen bekannter Value-Investoren wie David Einhorn werden von vielen Marktteilnehmern als Stimmungssignal gelesen, auch wenn Details hier fehlen.',
      relatedTopics: ['portfolio-aufbau'],
      relatedSymbols: [],
      sources: [
        {
          label: 'finanzen.net, News-Ticker vom 24.8.2026, 03:22 Uhr',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
}
