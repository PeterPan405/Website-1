import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-11.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-11 00:15 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-11',
  intro:
    'Die EZB erhöht die Zinsen, der DAX rutscht ab, und heute Nachmittag folgen die US-Verbraucherpreise – dazu Oracles KI-Boom gegen Adobes vorsichtige Prognose.',
  top: [
    {
      headline:
        'EZB erhöht Leitzins auf 2,5 Prozent – heute folgen die US-Verbraucherpreise',
      summary: [
        'Die EZB hat ihren Hauptrefinanzierungssatz um 0,25 Punkte auf 2,5 Prozent angehoben, weil Präsidentin Lagarde die Inflation als hartnäckiger als angenommen bezeichnete.',
        'Der DAX fiel daraufhin unter 25.500 Punkte, und heute um 14:30 Uhr folgt mit den US-Verbraucherpreisen die nächste marktbewegende Zahl.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Zeigt, wie eine europäische Zinsentscheidung und eine amerikanische Inflationszahl in derselben Woche zusammentreffen, ohne voneinander abzuhängen.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label: 'Handelsblatt, Bericht vom 10.09.2026',
          url: 'https://www.handelsblatt.com/finanzen/geldpolitik/ezb-zinsentscheid-leitzins-im-euro-raum-steigt-auf-25-prozent/100252594.html',
        },
      ],
    },
    {
      headline: 'Oracle übertrifft Erwartungen, Adobe dämpft sie',
      summary: [
        'Oracle steigerte den Quartalsumsatz um rund 30 Prozent auf 19,3 Milliarden Dollar, angetrieben von einem Sprung der Cloud-Infrastruktur-Umsätze um 121 Prozent.',
        'Adobe legte tags darauf zwar ein solides Quartal vor, stellte für das laufende Quartal aber einen Umsatz unterhalb der Analystenschätzung in Aussicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Verdeutlicht, dass Anleger oft stärker auf die Prognose eines Unternehmens reagieren als auf die tatsächlich erzielten Zahlen desselben Quartals.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['oracle', 'adobe'],
      sources: [
        {
          label: 'Oracle Investor Relations, Pressemitteilung vom 10.09.2026',
          url: 'https://www.prnewswire.com/news-releases/oracle-announces-q1-results-driven-by-triple-digit-growth-in-cloud-infrastructure-revenues-302875728.html',
        },
      ],
    },
    {
      headline: 'adidas meldet Rekordumsatz – die Marge sinkt trotzdem',
      summary: [
        'adidas setzte im jüngsten Quartal 6,74 Milliarden Euro um, so viel wie nie zuvor – die operative Marge fiel aber von 9,2 auf 8,5 Prozent.',
        'Die Aktie schloss 2,56 Prozent leichter, belastet auch von Branchensorgen nach einem Kurseinbruch beim US-Konkurrenten Lululemon.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt am selben Quartalsbericht, warum ein Rekordumsatz allein noch nichts über die Profitabilität eines Unternehmens aussagt.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['adidas'],
      sources: [
        {
          label: 'finanzen.net, Bericht vom 10.09.2026',
          url: 'https://www.finanzen.net/nachricht/aktien/margendruck-adidas-aktie-unter-den-schwaechsten-dax-werten-das-steckt-hinter-dem-kursrueckgang-00-15927426',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Bayer erhält FDA-Zulassung – die Aktie fällt trotzdem',
      summary: [
        'Die FDA erweiterte die Zulassung von Bayers Krebsmittel Sevabertinib auf zuvor unbehandelte Patienten, gestützt auf eine Studie mit 75 Prozent Ansprechrate.',
        'Trotz der positiven Nachricht notierte die Bayer-Aktie am selben Tag im Minus – eine Begründung dafür nennt die Quelle nicht.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Macht sichtbar, dass eine gute Unternehmensnachricht und ein fallender Kurs sich nicht ausschließen, wenn der Gesamtmarkt an diesem Tag stärker wiegt.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['bayer'],
      sources: [
        {
          label: 'FDA, Zulassungsmitteilung vom 09.09.2026',
          url: 'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-sevabertinib-locally-advanced-or-metastatic-non-squamous-non-small',
        },
      ],
    },
    {
      headline: 'Größter Gold-ETF verliert erstmals seit sieben Wochen Anleger',
      summary: [
        'Der größte Gold-ETF der Welt verzeichnete laut Goldreporter einen Wochenabfluss von 849 Millionen Dollar – die erste Abflusswoche nach sieben Wochen Wachstum.',
        'Der Goldpreis selbst blieb stabil und hielt sich über der Marke von 4.350 Dollar je Feinunze.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Zeigt, dass Mittelflüsse eines einzelnen ETF und die Preisentwicklung des zugrunde liegenden Rohstoffs auseinanderlaufen können.',
      relatedTopics: ['etf'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label: 'Goldreporter, Meldung vom 10.09.2026',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline: 'Apple-Aktie dreht nach drei Verlusttagen ins Plus',
      summary: [
        'Einen Tag nach der Vorstellung des ersten faltbaren iPhones stieg die Apple-Aktie um 3,56 Prozent auf 326,57 Dollar.',
        'Zuvor war die Aktie an drei aufeinanderfolgenden Handelstagen gefallen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Illustriert, dass die Kursreaktion auf eine lange angekündigte Produktvorstellung oft erst am Folgetag einsetzt, wenn erste Praxis-Eindrücke vorliegen.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['apple'],
      sources: [
        {
          label: 'finanzen.net, dpa-AFX-Meldung vom 10.09.2026',
          url: 'https://www.finanzen.net/nachricht/aktien/produktneuheit-apple-aktie-am-tag-nach-iphone-duo-praesentation-mit-kursplus-15928640',
        },
      ],
    },
  ],
}
