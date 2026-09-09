import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-09.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-09 00:17 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-09',
  intro:
    'Öl springt nach Angriffen im Nahen Osten, Chipwerte laufen auseinander, Apple hält heute seine Keynote – dazu US-Jobdaten und eine Rede von Lagarde.',
  top: [
    {
      headline: 'Ölpreis springt nach Nahost-Angriffen, Gold reagiert kaum',
      summary: [
        'Nach gemeldeten Angriffen auf Öltanker und Huthi-Attacken auf Saudi-Arabien ist der Ölpreis laut zwei Kursleisten um rund 1,8 bis 2,1 Prozent gestiegen.',
        'Der Goldpreis, traditionell ein Krisengewinner, bewegte sich zur gleichen Zeit kaum – die Quellen liefern dafür keine Erklärung.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, dass ein geopolitischer Auslöser nicht automatisch alle Rohstoffe in dieselbe Richtung bewegt – eine verbreitete Faustregel hat an diesem Tag nicht gegriffen.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'gold'],
      sources: [
        {
          label:
            'onvista, News-Ticker vom 08.09.2026, 20:57 Uhr: „ROUNDUP/Iranische Medien: Mehrere Öltanker angegriffen“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'finanzen.net, Kursleiste vom 09.09.2026, gegen 2:17 Uhr (Öl 98,7 USD, +1,8 %; Gold 4.403 USD, -0,0 %)',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Qualcomm springt, Infineon fällt – am selben Chip-Tag',
      summary: [
        'Qualcomm gewann laut Ticker-Meldung nach einem KI-Chip-Deal mit Amazon, während Infineon nach einem Analystenvotum deutlich nachgab.',
        'Auch Intel und D-Wave Quantum bewegten sich am selben Tag – aber jeweils aus einem eigenen, unternehmensspezifischen Anlass.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein gemeinsames Sektor-Etikett wie „Chipwerte“ verdeckt, dass einzelne Aktien am selben Tag aus völlig unterschiedlichen Gründen steigen oder fallen können.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['qualcomm', 'infineon'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 08.09.2026: „QUALCOMM-Aktie mit Kurssprung nach KI-Chip-Deal mit Amazon für Rechenzentren“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label:
            'finanzen.net, News-Ticker vom 08.09.2026: „Infineon-Aktie deutlich schwächer - Analystenvotum belastet Chipwerte deutlich“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Apple hält heute seine erwartete Herbst-Keynote',
      summary: [
        'Analysten erwarten laut Ticker-Meldungen „die wichtigste Keynote seit dem iPhone X“, Berichten zufolge mit einem faltbaren iPhone.',
        'Die Apple-Aktie notiert bereits vor dem Event nahe ihrem Rekordhoch – ein Beispiel für eine bereits eingepreiste Erwartung.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Kurs kann eine erwartete gute Nachricht schon vorwegnehmen; bestätigt sich nur das Erwartete, bewegt er sich am Ereignistag oft kaum.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['apple'],
      sources: [
        {
          label:
            'wallstreet-online, News-Ticker vom 08.09.2026: „Aktie nah am Rekordhoch: Teurer, faltbar, historisch: Was Apple am 9. September plant“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'GameStop meldet Rekordgewinn dank eBay-Beteiligung',
      summary: [
        'GameStop verdiente im zweiten Quartal laut wallstreet-online so viel wie nie zuvor und hebt die Jahresprognose deutlich an.',
        'Die Meldung trennt nicht auf, wie viel davon aus dem laufenden Geschäft und wie viel aus der Kapitalbeteiligung an eBay stammt.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Rekordgewinn kann operative Verbesserung und einmalige Bewertungsgewinne einer Finanzbeteiligung vermischen – ohne Aufschlüsselung bleibt unklar, wie nachhaltig er ist.',
      relatedTopics: ['aktie'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'wallstreet-online, News-Ticker vom 08.09.2026: „Rekordgewinn statt Umsatzflaute: GameStop überrascht mit eBay-Coup“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'China kauft weiter Gold – zahlt in Shanghai aber weniger',
      summary: [
        'Russisches Gold fließt laut Goldreporter in Rekordmengen nach Hongkong, und Chinas offizielle Reserven sind auf 76,73 Millionen Unzen gewachsen.',
        'Trotzdem notiert Gold in Shanghai rund 38 US-Dollar unter dem westlichen Preis – die Quelle nennt dafür keinen Grund.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Zeigt, dass anhaltende offizielle Käufe nicht automatisch zu einem Preisaufschlag am jeweiligen Handelsplatz führen – ein Rohstoff kann mehrere Preise gleichzeitig haben.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'Goldreporter, 8. September 2026: „Goldmarkt: China-Spread fällt auf minus 38 US-Dollar“',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline: 'DAX stagniert, heute kommen US-Jobdaten und Lagarde',
      summary: [
        'Der DAX bewegte sich am Dienstag laut onvista kaum, obwohl der Ölpreis weiter stieg; zwei Kursleisten zeigen dazu leicht unterschiedliche Prozentwerte.',
        'Heute stehen um 14:15 Uhr der ADP-Bericht zur US-Beschäftigung und um 19:00 Uhr eine Rede von EZB-Präsidentin Lagarde an.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Ein ruhiger Indextag kann sich ändern, sobald am selben Nachmittag Arbeitsmarktdaten und eine Notenbank-Rede anstehen – beides mögliche Kursimpulse für den restlichen Tag.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'wallstreet-online, Wirtschaftskalender vom 09.09.2026: ADP Employment Change (4-week average), 14:15 Uhr; EZB-Präsidentin Lagarde spricht, 19:00 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
