import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-31.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-31 00:53 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-31',
  intro:
    'Intel erlebt seinen schlechtesten Börsentag seit 1971, Binance meldet den größten Krypto-Diebstahl, und Deutschlands Wirtschaft überrascht positiv.',
  top: [
    {
      headline: 'Tech-Ausverkauf schickt Nasdaq auf Drei-Monats-Tief',
      summary: [
        'Intel brach am Freitag um 28,6 Prozent ein, nachdem der Chipkonzern eine schwache Prognose vorgelegt hatte. Es war der schlechteste Handelstag der Firmengeschichte seit dem Börsengang 1971.',
        'Der Nasdaq fiel um 2,9 Prozent auf ein Drei-Monats-Tief. Auch Gold und der Dax gaben nach, der deutsche Leitindex schloss 0,9 Prozent schwächer bei 25.808 Punkten.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dass Gold und Technologieaktien am selben Tag fielen, erinnert daran: Diversifikation schützt nicht an jedem Tag gleich gut.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['intel', 'nasdaq-100', 'dax', 'gold'],
      sources: [
        {
          label:
            'Handelsblatt, US-Börsen: „Absolut brutale Woche“ für Tech-Investoren – Nasdaq rutscht ab, Intel verliert rund 29 Prozent, 30.10.2026, 20:57 Uhr',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dow-jones-sp-500-nasdaq-nasdaq-100-auf-talfahrt-intel-aktie-verliert-29-prozent/100266181.html',
        },
        {
          label:
            'Handelsblatt, Dax aktuell: Dax schließt im Minus – und reißt die 26.000-Punkte-Marke, 30.10.2026, 18:39 Uhr',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dax-aktuell-dax-schliesst-im-minus-und-reisst-die-26.000-punkte-marke/100266086.html',
        },
      ],
    },
    {
      headline: 'Binance meldet größten Krypto-Diebstahl aller Zeiten',
      summary: [
        'Die Kryptobörse Binance wurde Opfer des bislang größten Diebstahls in der Geschichte digitaler Währungen. Betroffen sind nach eigenen Angaben Digitalwährungen im Wert von rund 6,3 Milliarden Dollar.',
        'Die Analysefirma TRM Labs macht nordkoreanische Hacker für den Angriff verantwortlich. Binance kündigte an, sämtliche Verluste aus eigenen Mitteln und einem Sicherheitsfonds auszugleichen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wer Geld bei einer Kryptobörse statt in einer eigenen Wallet hält, verzichtet auf die Kontrolle über die Schlüssel und verlässt sich auf das Unternehmen.',
      relatedTopics: ['bitcoin-krypto', 'einlagensicherung'],
      relatedSymbols: ['bitcoin'],
      sources: [
        {
          label:
            'Tagesschau, Größter Krypto-Hack trifft Börse Binance, 30.10.2026, 08:24 Uhr',
          url: 'https://www.tagesschau.de/wirtschaft/technologie/hackerangriff-kryptoboerse-binance-100.html',
        },
        {
          label:
            'Handelsblatt, Kryptobörse: Größter Krypto-Diebstahl aller Zeiten – Binance meldet Hackerangriff, 30.10.2026, 15:50 Uhr',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/devisen-rohstoffe/binance-kryptoboerse-meldet-hackerangriff-bitcoin-verliert-deutlich/100266046.html',
        },
      ],
    },
    {
      headline: 'Deutschlands BIP überrascht, die Teuerung lässt nach',
      summary: [
        'Das Bruttoinlandsprodukt wuchs im dritten Quartal um 0,2 Prozent zum Vorquartal, mehr als Volkswirte erwartet hatten. Die Inflation sank im Oktober auf 2,8 Prozent, begünstigt durch einen befristeten Tankrabatt der Bundesregierung.',
        'Beim Arbeitsmarkt sieht es gemischter aus. Rund 2,955 Millionen Menschen waren arbeitslos gemeldet, 44.000 mehr als vor einem Jahr.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Wachstum und sinkende Inflation beruhen derzeit auf befristeten Effekten, Fiskalprogrammen und einem Tankrabatt, nicht auf einem selbsttragenden Aufschwung.',
      relatedTopics: ['inflation', 'notenbanken-geldpolitik'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'Tagesschau, Deutsche Wirtschaft wächst überraschend, 30.10.2026, 10:50 Uhr',
          url: 'https://www.tagesschau.de/wirtschaft/konjunktur/entwicklung-bip-deutschland-sommer-100.html',
        },
        {
          label:
            'Tagesschau, Inflationsrate fällt im Oktober auf 2,8 Prozent, 30.10.2026, 15:08 Uhr',
          url: 'https://www.tagesschau.de/wirtschaft/verbraucher/inflationsrate-deutschland-oktober-100.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Fed-Präsidenten fordern weitere Zinserhöhungen',
      summary: [
        'Zwei Fed-Präsidenten forderten trotz der jüngsten Zinspause weitere Erhöhungen. Lorie Logan verlangte mindestens zwei weitere Schritte von je 0,25 Prozentpunkten, Alberto Musalem sprach von einer baldigen zusätzlichen Straffung.',
        'Musalem hat allerdings erst 2028 wieder ein Stimmrecht im Zinsausschuss, Logan stimmt im Dezember mit ab.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Nicht jeder Fed-Präsident, der öffentlich spricht, entscheidet auch mit. Wer Zinssignale deutet, sollte auf das Stimmrecht achten.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['dow-jones', 'nasdaq-100'],
      sources: [
        {
          label:
            "CNBC, Fed officials are already saying they'll need to get back to hiking rates, 30.10.2026, 22:53 Uhr",
          url: 'https://www.cnbc.com/2026/10/30/musalem-fed-monetary-policy-tightening.html',
        },
      ],
    },
    {
      headline: 'Chevron und Exxon verdienen Rekordsummen mit Diesel',
      summary: [
        'Chevron und Exxon haben ihre Quartalsgewinne fast verdoppelt, auf 9,9 beziehungsweise 15,4 Milliarden Dollar. Getrieben wurde das vor allem vom Raffineriegeschäft, nicht von der Öl- und Gasförderung.',
        'Angriffe im Ukraine-Krieg und im Nahost-Konflikt haben Raffinerien in Russland und im Nahen Osten getroffen. Der US-Dieselpreis liegt deshalb über 70 Prozent höher als vor einem Jahr.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Unterschied zwischen Förderung und Raffinerie zeigt, dass ein hoher Ölpreis allein noch nichts über die Gewinne eines Konzerns verrät.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['chevron', 'exxon', 'wti', 'brent'],
      sources: [
        {
          label:
            'CNBC, Chevron and Exxon hit all-time highs as refining profits soar in reaction to Iran and Ukraine wars, 30.10.2026, 17:44 Uhr',
          url: 'https://www.cnbc.com/2026/10/30/chevron-exxon-cvx-xom-earnings-q3-2026.html',
        },
        {
          label:
            'SEC-Mitteilung, Chevron Corporation, Form 8-K zum dritten Quartal 2026, 30.10.2026',
          url: 'https://www.sec.gov/Archives/edgar/data/0000093410/000009341026000196/a09302026ex9918-k.htm',
        },
      ],
    },
  ],
}
