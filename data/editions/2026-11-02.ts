import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-02.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-02 00:15 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-02',
  intro:
    'Vor den US-Midterms positionieren sich Anleger neu, IG Metall beginnt Warnstreiks, und Gold fällt ungewöhnlich im Gleichschritt mit Tech-Aktien.',
  top: [
    {
      headline: 'Vor den Midterms: Anleger in Asien sichern sich ab',
      summary: [
        'Am Dienstag wählen die USA einen neuen Kongress. Asiatische Anleger positionieren sich dafür bereits jetzt, mit möglichen Folgen für Technologie- und Energiewerte.',
        'Die Kryptobranche steckte laut CNBC mehr als 200 Millionen Dollar in die Zwischenwahlen. Neu gegründete Super-PACs gaben zusammen rund 637 Millionen Dollar aus.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die Zusammensetzung des neuen Kongresses entscheidet mit über Sozialversicherung, Kommunalanleihen und mögliche neue Kryptoregeln – Themen mit direkter Marktwirkung.',
      relatedTopics: ['wie-funktioniert-der-markt', 'risiko-und-rendite'],
      relatedSymbols: ['nasdaq-100', 'dow-jones'],
      sources: [
        {
          label:
            'handelsblatt.com, Artikel vom 1.11.2026, 15:38 Uhr: „Geldanlage: So schauen asiatische Profianleger auf die bevorstehenden US-Midterms“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/aktien/geldanlage-so-schauen-profianleger-auf-die-bevorstehenden-usmidterms/100266440.html',
        },
        {
          label:
            'cnbc.com, Artikel vom 31.10.2026, 14:04 Uhr: „Crypto industry pours more than $200 million into 2026 midterms“',
          url: 'https://www.cnbc.com/2026/10/31/crypto-industry-spends-more-than-200-million-to-sway-the-midterms.html',
        },
      ],
    },
    {
      headline: 'IG Metall beginnt Warnstreiks in der Metallindustrie',
      summary: [
        'Die IG Metall hat in der Nacht zum Sonntag Warnstreiks begonnen. Betroffen sind nach Angaben der Tagesschau wichtige Industriezweige wie die Auto- und die Maschinenbaubranche.',
        'Die Gewerkschaft hatte das erste Lohnangebot der Arbeitgeber in der vergangenen Woche abgelehnt. Die Warnstreiks sollen die laufenden Tarifverhandlungen nun unter Druck setzen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein länger anhaltender Tarifkonflikt in der Metall- und Elektroindustrie verändert die Kostenbasis zahlreicher Dax-Unternehmen dauerhafter als ein einzelner Warnstreik.',
      relatedTopics: ['inflation', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'tagesschau.de, Artikel vom 1.11.2026, 04:48 Uhr: „Warnstreiks der IG Metall kurz nach Mitternacht angelaufen“',
          url: 'https://www.tagesschau.de/wirtschaft/arbeitsmarkt/ig-metall-warnstreiks-108.html',
        },
        {
          label:
            'wallstreet-online.de, Meldung vom 1.11.2026 (dpa-AFX): „WDH/ROUNDUP 3: Metaller-Warnstreiks nehmen Fahrt auf“',
          url: 'https://www.wallstreet-online.de/nachricht/21617718-wdh-roundup-3-metaller-warnstreiks-fahrt',
        },
      ],
    },
    {
      headline: 'Gold und Silber fallen im Sog des Tech-Ausverkaufs',
      summary: [
        'Der Goldpreis ist am Freitag unter 4.000 Dollar gefallen. Nach Angaben von Goldreporter erfasste der Ausverkauf bei Technologieaktien auch die Edelmetalle.',
        'Der Silberpreis krachte laut wallstreet-online unter 50 Dollar. Das Handelsblatt berichtet, Gold und Silber lägen so niedrig wie seit einem Jahr nicht mehr.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Normalerweise gilt Gold als Gegenpol zu fallenden Aktien – diesmal fielen beide gemeinsam, ein Hinweis auf breite Gewinnmitnahmen statt gezielter Absicherung.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: ['gold', 'silber'],
      sources: [
        {
          label:
            'goldreporter.de, Marktbericht vom 30.10.2026: „Goldpreis fällt unter 4.000 USD – Tech-Ausverkauf belastet“',
          url: 'https://www.goldreporter.de/goldpreis-30-10-2026/marktbericht-gold/262690/',
        },
        {
          label:
            'handelsblatt.com, Artikel vom 30.10.2026, 20:57 Uhr: „US-Börsen: ‚Absolut brutale Woche‘ für Tech-Investoren“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dow-jones-sp-500-nasdaq-nasdaq-100-auf-talfahrt-intel-aktie-verliert-29-prozent/100266181.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Binance: FBI macht Nordkorea für Krypto-Hack verantwortlich',
      summary: [
        'Das FBI macht laut Handelsblatt die nordkoreanische Gruppe TraderTraitor für den Krypto-Diebstahl bei Binance verantwortlich. Betroffen sind rund 6,3 Milliarden Dollar.',
        'Binance hat die Auszahlungen wieder freigegeben. Der Börse flossen laut CNBC dabei netto 3,64 Milliarden Dollar ab, das sind 2,1 Prozent ihrer Vermögenswerte.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Anders als ein Bankkonto unterliegt ein Kryptobörsen-Guthaben keiner gesetzlichen Einlagensicherung – das Risiko eines Diebstahls trägt allein, wer dort Geld hält.',
      relatedTopics: ['bitcoin-krypto', 'einlagensicherung'],
      relatedSymbols: ['bitcoin'],
      sources: [
        {
          label:
            'handelsblatt.com, Artikel vom 1.11.2026, 14:30 Uhr: „FBI: Nordkoreanische Hacker stecken hinter milliardenschwerem Krypto-Diebstahl bei Binance“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/devisen-rohstoffe/binance-fbi-sieht-nordkoreanische-hacker-hinter-krypto-diebstahl/100266403.html',
        },
        {
          label:
            'cnbc.com, Artikel vom 2.11.2026, 01:11 Uhr: „Binance sees $3.64 billion in net outflows“',
          url: 'https://www.cnbc.com/2026/11/02/binance-outflow-hack-bitcoin.html',
        },
      ],
    },
    {
      headline: 'Private Credit: Steigende Zinsen werden zum Stresstest',
      summary: [
        'Steigende Zinsen werden laut einem Handelsblatt-Bericht zum neuen Stresstest für den Private-Credit-Markt. Investoren verdienen zunächst mehr, ihre Schuldner geraten aber stärker unter Druck.',
        'Nach Angaben des Berichts könnten die Risiken im Ernstfall über die Fondsinvestoren hinaus auch Steuerzahler betreffen.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Eine Rendite deutlich über dem Marktdurchschnitt trägt in der Regel ein ebenso überdurchschnittliches Risiko – das zeigt sich oft erst, wenn sich die Zinsen ändern.',
      relatedTopics: ['risiko-und-rendite', 'schulden-und-kredit'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'handelsblatt.com, Artikel vom 1.11.2026, 13:20 Uhr (Reuters, AFP): „Mehr Rendite, mehr Pleiten: Steigende Zinsen werden zum neuen Stresstest für Private Credit“',
          url: 'https://www.handelsblatt.com/finanzen/banken-versicherungen/zinsanstieg-auswirkungen-auf-private-credit-und-schuldner/100263351.html',
        },
      ],
    },
  ],
}
