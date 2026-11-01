import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-01.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-01 00:14 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-01',
  intro:
    'Japans Notenbank hält den Zins, Binance zahlt nach dem größten Krypto-Hack wieder aus, und Frankreichs Schuldenkrise drückt den Euro zum Pfund.',
  top: [
    {
      headline: 'Bank of Japan hält Leitzins, Markt erwartet Dezember-Schritt',
      summary: [
        'Japans Notenbank lässt ihren Leitzins unverändert. Sie hält ihn bei 1,25 Prozent, dem höchsten Stand seit 1995. Nach eigenen Angaben ist ihr Inflationsziel von zwei Prozent damit erreicht.',
        'Am Markt wird deshalb mit einer weiteren Zinserhöhung im Dezember gerechnet. Die Notenbank hatte den Satz erst im September angehoben, um 0,25 Prozentpunkte.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Weil die Entscheidung erwartet war, bewegt sie Kurse kaum. Entscheidend an Finanzmärkten ist meist nicht das Ergebnis selbst, sondern die Abweichung von dem, was Anleger schon eingepreist hatten.',
      relatedTopics: ['notenbanken-geldpolitik', 'waehrungen-wechselkurse'],
      relatedSymbols: ['nikkei-225', 'eur-jpy'],
      sources: [
        {
          label:
            'Handelsblatt, Inflation: Japans Notenbank hält Zinsen stabil – Inflationsrisiken im Blick, 30.10.2026, 07:55 Uhr',
          url: 'https://www.handelsblatt.com/finanzen/geldpolitik/inflation-japans-notenbank-haelt-zinsen-stabil-inflationsrisiken-im-blick/100266049.html',
        },
        {
          label:
            'WirtschaftsWoche, Japanische Aktien: Die Japan-Wette gerät ins Stocken, 29.10.2026, 13:25 Uhr',
          url: 'https://www.wiwo.de/finanzen/boerse/japanischer-index-nikkei-die-japan-wette-geraet-ins-stocken/100264300.html',
        },
      ],
    },
    {
      headline: 'Binance nimmt nach Rekord-Hack die Auszahlungen wieder auf',
      summary: [
        'Die Kryptobörse Binance lässt ab heute wieder Auszahlungen zu. Nach dem Hack vom Freitag erklärt sie neun von zehn gestohlenen Dollar für gedeckt. Insgesamt waren Werte von rund 6,3 Milliarden Dollar betroffen.',
        'Das FBI macht nordkoreanische Hacker für den Angriff verantwortlich. Ein deutscher Cybersicherheitsexperte geht im Interview mit der Tagesschau von einem höheren Schaden aus. Er schätzt, drei Milliarden Dollar seien endgültig verloren.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wer Geld bei einer Börse statt in der eigenen Wallet hält, verzichtet auf die Kontrolle über die Schlüssel und verlässt sich auf firmeneigene Sicherungsfonds statt auf eine staatliche Einlagensicherung.',
      relatedTopics: ['bitcoin-krypto', 'einlagensicherung'],
      relatedSymbols: ['bitcoin'],
      sources: [
        {
          label:
            'CNBC, Binance says 90% of $6.3 billion hack losses are now covered, plans to resume withdrawals Sunday, 31.10.2026, 23:27 Uhr',
          url: 'https://www.cnbc.com/2026/10/31/binance-hack-asset-coverage-withdrawals.html',
        },
        {
          label:
            'Tagesschau, Experte zum Krypto-Angriff: „Drei Milliarden sind definitiv weg“, 30.10.2026, 14:32 Uhr',
          url: 'https://www.tagesschau.de/wirtschaft/technologie/hackerangriff-binance-interview-100.html',
        },
      ],
    },
    {
      headline: 'Frankreichs Schuldenkrise drückt den Euro zum Pfund',
      summary: [
        'Der Euro fällt stark zum Pfund. Im Oktober verlor er laut Bloomberg mehr als zwei Prozent, den schwächsten Monat seit Juli 2022. Als Grund gilt Frankreichs Schuldenkrise.',
        'Die Finanzierungskosten Frankreichs liegen auf dem höchsten Stand seit 25 Jahren. Am Freitag demonstrierten landesweit 320.000 Menschen, nach Angaben der Polizei davon 70.000 in Paris. Dabei kam es in mehreren Städten zu Zusammenstößen mit der Polizei.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Währung spiegelt auch das Vertrauen in die Fähigkeit eines Staates, seine Schulden zu bedienen, nicht nur Zinsunterschiede zwischen Notenbanken.',
      relatedTopics: ['waehrungen-wechselkurse', 'staatsanleihe'],
      relatedSymbols: ['eur-gbp'],
      sources: [
        {
          label:
            'wallstreet-online (zitiert Bloomberg), Frankreichs Schuldenkrise: Euro vor schwächstem Monat zum Pfund seit 2022, 30.10.2026',
          url: 'https://www.wallstreet-online.de/nachricht/21609900-frankreichs-schuldenkrise-euro-schwaechstem-monat-pfund-2022',
        },
        {
          label:
            'onvista (dpa-AFX), ROUNDUP 3: 320.000 demonstrieren in Frankreich – erste Spannungen, 31.10.2026, 17:35 Uhr',
          url: 'https://www.onvista.de/news/2026/10-31-roundup-3-320-000-demonstrieren-in-frankreich-erste-spannungen-0-10-26570754',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Berkshire markiert Rekordhoch, Nasdaq verliert 5,3 Prozent im Oktober',
      summary: [
        'Die Berkshire-Hathaway-Aktie markierte im Oktober mehrere Rekordstände. Die Klasse-B-Aktie schloss am 26. Oktober bei 548,56 Dollar, ein Rekord. Am Freitag erreichte sie im Tagesverlauf mit 550,47 Dollar ein neues Hoch.',
        'Insgesamt legte Berkshire im Oktober um 8,9 Prozent zu. Der S&P 500 verlor im selben Monat 0,9 Prozent, der Nasdaq Composite 5,3 Prozent. Grund ist laut CNBC eine Umschichtung von Tech- und KI-Werten hin zu defensiveren Aktien.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dass eine Einzelaktie steigt, während der Gesamtmarkt fällt, zeigt, wie unterschiedlich Portfolios je nach Gewichtung auf dieselbe Marktphase reagieren können.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['berkshire', 'sp500'],
      sources: [
        {
          label:
            'CNBC, Berkshire ekes out some new highs, but October rally stalls, 31.10.2026, 13:26 Uhr',
          url: 'https://www.cnbc.com/2026/10/31/berkshire-ekes-out-some-new-highs-but-october-rally-stalls.html',
        },
        {
          label:
            '247wallst.com, Berkshire Hathaway Closes at a Record $548.56, Again, 26.10.2026',
          url: 'https://247wallst.com/cards/berkshire-s-class-b-shares-closed-at-a-record-548-56-toppi-brk-b-price-extreme-01m5x9ps6ese4czs18q8m01sxv',
        },
      ],
    },
    {
      headline: 'S&P senkt den Ausblick für Meta auf negativ',
      summary: [
        'Die Ratingagentur S&P Global Ratings hat ihren Ausblick für Meta gesenkt, von stabil auf negativ. Das Rating selbst, AA-, bleibt unverändert. Als Grund nennt S&P die hohen Investitionen und einen erstmals negativen freien Cashflow.',
        'Meta plant für das laufende Jahr Investitionen von 135 bis 145 Milliarden Dollar. Im dritten Quartal lag der freie Cashflow bei minus 2,12 Milliarden Dollar. Die Aktie verlor im Oktober rund 15 Prozent, ihren schlechtesten Monat seit vier Jahren.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein gesenkter Ausblick ist keine Herabstufung, sondern eine Warnung: Bleibt die Entwicklung so, könnte die nächste reguläre Prüfung zu einer niedrigeren Bonitätsnote führen.',
      relatedTopics: ['aktie', 'schulden-und-kredit'],
      relatedSymbols: ['meta'],
      sources: [
        {
          label:
            'CNBC, Meta outlook revised downward by S&P on cash flow and capex concerns, 30.10.2026, 23:42 Uhr',
          url: 'https://www.cnbc.com/2026/10/30/meta-outlook-to-revised-to-negative-by-sp-after-cash-flow-negative.html',
        },
      ],
    },
  ],
}
