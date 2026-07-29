import type { DailyEdition } from './types'

/**
 * Ausgabe vom 29. Juli 2026.
 *
 * Ein Tag mit zwei Bewegungen, die auseinanderlaufen: Der Chip-Ausverkauf vom
 * Vortag setzt sich in Seoul und New York fort, während der DAX vom fallenden
 * Ölpreis getragen wird und sich seinem Rekordhoch nähert. Darüber steht die
 * Fed-Entscheidung am Abend – die erste unter Kevin Warsh.
 */
export const edition: DailyEdition = {
  date: '2026-07-29',
  intro:
    'Drei Notenbanken entscheiden diese Woche, der Ölpreis fällt weiter, und der Chip-Ausverkauf verschärft sich – während der DAX davon profitiert.',
  top: [
    {
      headline: 'Fed entscheidet heute – 77,7 Prozent rechnen mit unverändert',
      summary: [
        'Um 20 Uhr deutscher Zeit gibt die US-Notenbank ihren Zinsentscheid bekannt, um 20:30 Uhr beginnt die Pressekonferenz. Es ist die erste Entscheidung unter dem neuen Vorsitzenden Kevin Warsh. Der Leitzins liegt seit dem 10. Dezember 2025 bei 3,50 bis 3,75 Prozent.',
        'Nach dem FedWatch-Instrument der CME Group liegt die Wahrscheinlichkeit für unveränderte Zinsen bei 77,7 Prozent. Die im Juni aktualisierten Projektionen zeigten eine straffere Haltung – dann fiel der Arbeitsmarktbericht für Juli überraschend schwach aus.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Was drei Viertel des Marktes erwarten, steht bereits in jedem Kurs. Bewegung entsteht deshalb nicht durch den Zinssatz, sondern durch die Abweichung davon – und durch die Pressekonferenz, für die es keine Wahrscheinlichkeitstabelle gibt.',
      relatedTopics: [
        'notenbanken-geldpolitik',
        'wie-funktioniert-der-markt',
        'inflation',
      ],
      relatedSymbols: ['sp500', 'eur-usd', 'gold'],
      sources: [
        {
          label:
            'LBBW: Fed-Zinsentscheid – Uhrzeit, Ablaufplan und Prognose (29.07.2026)',
          url: 'https://www.lbbw.de/artikel/maerkte-verstehen/fed-zinsentscheid-uhrzeit-ablaufplan-29-07-2026_am7r939aon_d.html',
        },
      ],
    },
    {
      headline: 'Chip-Ausverkauf verschärft sich – Seoul verliert über zwölf Prozent',
      summary: [
        'Die Speicherhersteller SK Hynix und Samsung Electronics verloren am Dienstag mehr als zwölf Prozent. In den USA fiel SanDisk um 11,02 Prozent, AMD um 5,17 Prozent, Nvidia um 4,99 Prozent, Lam Research um 4,46 Prozent; der Chipindex SOX gab 2,20 Prozent nach.',
        'Als Gründe gelten Zweifel an der Rentabilität der KI-Investitionen, die wachsende Verschuldung für neue Rechenzentren und die Konkurrenz aus China – der Börsengang des Speicherherstellers CXMT verlief stark.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein weltweit streuender Index gewichtet nach Börsenwert. Wächst eine Branche jahrelang schneller als der Rest, wächst ihr Anteil mit – ohne dass jemand eine Entscheidung getroffen hätte. Ein solcher Tag ist der Anlass, im eigenen Factsheet nachzusehen.',
      relatedTopics: ['etf', 'aktien-laender-branchen', 'risiko-und-rendite'],
      relatedSymbols: ['nvidia', 'amd', 'micron', 'sk-hynix', 'samsung'],
      sources: [
        {
          label:
            'MarketScreener: Weltweite Aktien fallen auf Einmonatstief, Chip-Ausverkauf verschärft sich',
          url: 'https://de.marketscreener.com/boerse-nachrichten/weltaktien-fallen-auf-einmonatstief-chip-ausverkauf-verschaerft-sich-ce7f51ddda80ff24',
        },
        {
          label: 'TradingKey: US-Chip-Aktien brechen vorbörslich ein (28.07.2026)',
          url: 'https://www.tradingkey.com/de/analysis/stocks/us-stocks/262058366-us-chip-stocks-plunged-pre-market-trading-micron-fell-5-amd-intel-fell-4-tradingkey',
        },
      ],
    },
    {
      headline: 'Brent fällt auf 83,74 Dollar – und trägt den DAX nach oben',
      summary: [
        'Ein Barrel Brent zur September-Lieferung kostete am Dienstag 83,74 US-Dollar, 1,8 Prozent weniger als am Montagabend. Auslöser war die Hoffnung, die USA und der Iran könnten nach der Pause der Angriffe am Wochenende wieder verhandeln.',
        'Der DAX schloss 0,52 Prozent fester bei 25.492,59 Punkten und näherte sich seinem Rekordhoch. Größter Verlierer im Index war Siemens Energy, SAP legte zu.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Rohstoff hat keinen Gewinn und kein Eigenkapital – nichts, was seinen Preis von unten stützt. Deshalb dreht er auf eine einzelne Nachricht hin schneller als eine Aktie. Für europäische Industriewerte ist billigere Energie unmittelbar ein Kostenvorteil.',
      relatedTopics: ['rohstoffe', 'aktien-laender-branchen', 'inflation'],
      relatedSymbols: ['brent', 'dax', 'wti'],
      sources: [
        {
          label:
            'Energynewsmagazine: Brent-Ölpreis gibt auf 83,74 Dollar nach (28.07.2026)',
          url: 'https://www.energynewsmagazine.at/2026/07/28/brent-oelpreis-gibt-auf-8374-dollar-nach/',
        },
        {
          label:
            'ARIVA: DAX-FLASH – Dax nähert sich Rekordhoch, Ölpreisrückgang hilft (28.07.2026)',
          url: 'https://www.ariva.de/dax-index/news/dax-flash-dax-naehert-sich-rekordhoch-oelpreisrueckgang-12082208',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Bitcoin unter 64.000 Dollar – 670 Millionen Dollar liquidiert',
      summary: [
        'Bitcoin notierte am Dienstag zwischen 63.150 und 63.566 US-Dollar, knapp drei Prozent unter dem Vortag. Rund 670 Millionen Dollar an gehebelten Positionen wurden zwangsweise glattgestellt, der Angst-und-Gier-Index stand bei 29.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Eine Liquidation ist ein erzwungener Verkauf – und er kommt genau dann, wenn der Kurs ohnehin fällt. Dadurch bewegt sich der Kurs am Ende nicht mehr wegen der Nachricht, sondern wegen der Positionen, die sie ausgelöst hat. Wer ohne Hebel investiert ist, wird nie liquidiert.',
      relatedTopics: ['bitcoin-krypto', 'derivat', 'anlegerpsychologie'],
      relatedSymbols: ['bitcoin', 'ethereum'],
      sources: [
        {
          label:
            'wallstreetONLINE: BTC stürzt auf 63.400 Dollar, 670 Millionen Dollar werden liquidiert',
          url: 'https://www.wallstreet-online.de/nachricht/21162731-bitcoin-prognose-2026-btc-stuerzt-63-400-dollar-670-millionen-dollar-liquidiert',
        },
      ],
    },
    {
      headline: 'Gold gibt auf 4.034 Dollar nach – der Dollar ist der Grund',
      summary: [
        'Eine Feinunze kostete in London 4.034 US-Dollar, 41 Dollar weniger als am Vortag und damit 0,88 Prozent im Minus. Der US-Dollar rückte in die Nähe eines Ein-Monats-Hochs, weil Handelsdaten zunehmend auf eine Zinserhöhung im September hindeuten.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Der Euro-Preis von Gold entsteht aus zwei unabhängigen Größen: dem Dollarpreis der Unze und dem Wechselkurs. Beide können gegenläufig laufen – wer nur die Dollarnotierung liest, sieht deshalb nicht, was im eigenen Depot passiert ist.',
      relatedTopics: ['rohstoffe', 'waehrungen-wechselkurse'],
      relatedSymbols: ['gold', 'eur-usd'],
      sources: [
        {
          label:
            'ARIVA: Goldpreis gibt nach – Warten auf US-Zinsentscheidung (28.07.2026)',
          url: 'https://www.ariva.de/gold-kurs/news/goldpreis-gibt-nach-warten-auf-us-zinsentscheidung-12082963',
        },
      ],
    },
  ],
}
