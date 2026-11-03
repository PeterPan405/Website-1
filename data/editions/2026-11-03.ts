import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-03.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-03 00:18 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-03',
  intro:
    'Öl bricht um mehr als sieben Prozent ein, die USA wählen neu, und die Fed stimmt künftig seltener über Zinsen ab.',
  top: [
    {
      headline: 'Ölpreis bricht um mehr als sieben Prozent ein',
      summary: [
        'Der Ölpreis ist am Montag so stark gefallen wie seit Monaten nicht. Brent-Öl verlor 7,6 Prozent und schloss bei 104,77 Dollar, die US-Sorte WTI gab 7,4 Prozent nach auf 96,46 Dollar.',
        'Grund sind Signale aus Washington und Teheran. Präsident Trump sagte, der Iran wolle eine Einigung. Außenminister Rubio erklärte, Trump bevorzuge eine friedliche Lösung des seit acht Monaten laufenden Konflikts. Irans Außenminister Araghchi nannte eine Einigung möglich, wenn die USA guten Willen zeigten.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Teil des Preisanstiegs im Oktober war eine eingepreiste Risikoprämie für eine militärische Eskalation. Schwächt sich diese Erwartung ab, kann der Preis schneller fallen, als sich am tatsächlichen Angebot etwas ändert.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'CNBC, 02.11.2026, 20:19 Uhr: „Crude oil prices sell off more than 7% on Iran peace talk hopes ahead of U.S. midterms"',
          url: 'https://www.cnbc.com/2026/11/02/oil-prices-fall-as-iran-us-pursue-diplomacy.html',
        },
        {
          label:
            'WirtschaftsWoche, 02.11.2026, 08:22 Uhr: „Ölpreis aktuell: Ölpreise starten mit Verlusten in die neue Handelswoche"',
          url: 'https://www.wiwo.de/finanzen/oelpreis-aktuell-oelpreise-starten-mit-verlusten-in-die-neue-handelswoche/100207502.html',
        },
      ],
    },
    {
      headline: 'Amerika wählt: Wall Street schwankt vor den Zwischenwahlen',
      summary: [
        'Am Dienstag wählen die Amerikaner ein neues Repräsentantenhaus und einen Teil des Senats neu. An der Wall Street schloss der Dow Jones am Montag 0,43 Prozent höher, der Nasdaq 100 gab 1,38 Prozent ab.',
        'Auf der Plattform Kalshi stieg die Wahrscheinlichkeit für eine demokratische Mehrheit im Senat auf 74 Prozent, den höchsten Stand seit Eröffnung des Marktes. Grundlage war unter anderem eine Umfrage der New York Times mit der Siena University, die Vorsprünge der Demokraten in mehreren umkämpften Bundesstaaten zeigte.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Historisch legte der S&P 500 im Jahr nach einer Zwischenwahl im Schnitt zu. Analysten weisen aber darauf hin, dass dabei oft die Geldpolitik der Fed und die Gewinnsaison mehr Gewicht haben als die Wahl selbst.',
      relatedTopics: ['anlegerpsychologie', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['sp500', 'dow-jones', 'nasdaq-100'],
      sources: [
        {
          label:
            'CNBC, 02.11.2026, 20:48 Uhr: „Prediction market traders now see nearly 75% chance of Democrats winning the Senate"',
          url: 'https://www.cnbc.com/2026/11/02/prediction-market-traders-now-see-nearly-75percent-chance-of-democrats-winning-the-senate.html',
        },
        {
          label:
            'WirtschaftsWoche, 02.11.2026, 12:56 Uhr: „US-Midterms: Wie Anleger von den US-Wahlen profitieren können"',
          url: 'https://www.wiwo.de/finanzen/geldanlage/midterms-2026-wie-anleger-von-den-us-zwischenwahlen-profitieren-koennen/100266139.html',
        },
      ],
    },
    {
      headline: 'Fed-Chef Warsh kündigt ab 2027 weniger Zinsentscheide an',
      summary: [
        'Die US-Notenbank Fed beließ ihren Leitzins vergangene Woche bei 3,75 bis 4 Prozent. Fed-Chef Kevin Warsh kündigte an, ab 2027 seltener über den Zins abzustimmen.',
        'Eine der acht jährlichen Sitzungen wird dann zur reinen Strategiesitzung ohne Zinsentscheid und ohne Erklärung. Ab 2028 sollen es zwei solcher Sitzungen sein, nur noch sechs behandeln die Zinsen.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Ein unveränderter Leitzins bedeutet nicht automatisch unveränderte Verbraucherzinsen. Kreditkartenanbieter passen ihre Sätze oft unabhängig von der Fed an, seltenere Sitzungen könnten diese Lücke vergrößern.',
      relatedTopics: ['notenbanken-geldpolitik', 'schulden-und-kredit'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'CNBC, 02.11.2026, 19:21 Uhr: „Fed will vote on rates less often. What that could mean for borrowers"',
          url: 'https://www.cnbc.com/2026/11/02/fed-rate-votes-consumer-borrowing-costs.html',
        },
        {
          label:
            'Goldreporter, 29.10.2026: „US-Notenbank hält Leitzins stabil – zwei Gegenstimmen"',
          url: 'https://www.goldreporter.de/fed-leitzins-unveraendert-warsh-oktober-2026/hot-links/262679/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Apple meldet Rekordumsatz mit iPhones – China bleibt schwach',
      summary: [
        'Apple hat am Montagabend die Erwartungen übertroffen. Der Umsatz stieg auf 114,5 Milliarden Dollar, der Gewinn je Aktie lag bei 2,10 Dollar – mehr als die von Analysten erwarteten 113,4 Milliarden Dollar und 1,99 Dollar. Der Umsatz in China blieb mit 17,54 Milliarden Dollar unter den erwarteten 18,8 Milliarden Dollar, die Aktie gab nachbörslich 1,1 Prozent nach.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dass ein Gewinn über der Prognose den Kurs nicht trägt, zeigt, wie viel Optimismus in einer hohen Bewertung schon steckt – Apples Kurs-Gewinn-Verhältnis liegt nahe dem höchsten Stand seit 2008.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['apple'],
      sources: [
        {
          label:
            'onvista, 02.11.2026, 21:43 Uhr: „Apple schlägt Gewinnerwartungen - Kurs dennoch schwächer"',
          url: 'https://www.onvista.de/news/2026/11-02-apple-schlaegt-gewinnerwartungen-kurs-dennoch-schwaecher-41121301-19-26571396',
        },
        {
          label:
            'wallstreet-online, 02.11.2026: „Trotz Lieferengpässen: Apple liefert ab: Starke iPhone-Verkäufe sorgen für Rekordquartal"',
          url: 'https://www.wallstreet-online.de/nachricht/21625203-trotz-lieferengpaessen-apple-liefert-ab-starke-iphone-verkaeufe-sorgen-rekordquartal',
        },
      ],
    },
    {
      headline: 'Palantir: Firmenkunden überholen erstmals den Staat',
      summary: [
        'Palantir hat im dritten Quartal erstmals mehr als 2 Milliarden Dollar Umsatz erzielt und damit die Erwartungen übertroffen. Der Gewinn stieg auf 1,13 Milliarden Dollar. Das Geschäft mit Firmenkunden in den USA wuchs um 148 Prozent auf 984 Millionen Dollar und überholte damit erstmals die Einnahmen aus Regierungsaufträgen von 953 Millionen Dollar.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Die höhere Wachstumsrate beim kleineren Geschäftsfeld Firmenkunden erklärt, warum es das größere, langsamer wachsende Regierungsgeschäft überholen konnte – ein Effekt der Ausgangsgröße, kein Einbruch im Staatsgeschäft.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['palantir'],
      sources: [
        {
          label:
            'CNBC, 02.11.2026, 22:53 Uhr: „Palantir reports booming U.S. commercial revenue growth, topping government for first time"',
          url: 'https://www.cnbc.com/2026/11/02/palantir-pltr-earnings-q3-2026.html',
        },
        {
          label:
            'wallstreet-online, 02.11.2026: „Palantir, AMD & Co: Rekordgewinne, null Steuern – diese US-Konzerne kassieren Milliarden"',
          url: 'https://www.wallstreet-online.de/nachricht/21623253-palantir-amd-co-rekordgewinne-null-steuern-us-konzerne-kassieren-milliarden',
        },
      ],
    },
  ],
}
