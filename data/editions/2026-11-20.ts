import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-20.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-20 00:18 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-20',
  intro:
    'Berlin schlägt einen EZB-Chefvolkswirt vor, VW und IG Metall ringen um die Tarifrunde, BASF lässt Evonik los, und Anthropics Börsengang bewegt die Weltmärkte.',
  top: [
    {
      headline: 'Bundesregierung schlägt Brunnermeier als EZB-Chefvolkswirt vor',
      summary: [
        'Die Bundesregierung hat den Ökonomen Markus Brunnermeier für den Posten des EZB-Chefvolkswirts vorgeschlagen. Der Princeton-Professor hat wesentlich zum Verständnis vergangener Finanzkrisen beigetragen.',
        'Ob er den Posten am Ende bekommt, entscheidet ein Personalpaket unter allen Euro-Ländern – Deutschland allein kann die Besetzung nicht durchsetzen.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Der Chefvolkswirt bereitet die Inflationsprognosen vor, auf die sich der EZB-Rat bei Zinsentscheidungen stützt – seine wirtschaftliche Grundhaltung prägt die Geldpolitik der kommenden Jahre mit. Bislang berichtet nur die FAZ darüber, eine zweite Quelle lag bei Redaktionsschluss nicht vor.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'FAZ, 19.11.2026, 14:15 Uhr: „Princeton-Ökonom: Dieser Aufsatz machte EZB-Kandidat Markus Brunnermeier berühmt“',
          url: 'https://www.faz.net/aktuell/finanzen/finanzmarkt/markus-brunnermeier-der-aufsatz-der-den-ezb-kandidaten-beruehmt-machte-201691457.html',
        },
        {
          label:
            'FAZ, 17.11.2026, 19:06 Uhr: „Neuer EZB-Chefvolkswirt: Ein pragmatischer Ökonom“',
          url: 'https://www.faz.net/aktuell/finanzen/finanzmarkt/markus-brunnermeier-deutschlands-kandidat-fuer-die-ezb-201691095.html',
        },
      ],
    },
    {
      headline: 'IG Metall startet Warnstreiks gegen VW-Sparplan',
      summary: [
        'Volkswagen will in der laufenden Tarifrunde zwei Jahre ohne Lohnerhöhung durchsetzen, dazu weniger Zulagen und Änderungen bei der Arbeitszeit.',
        'Die IG Metall wirft dem Konzern vor, Beschäftigten in den Rücken zu fallen, und lässt an diesem Freitag ganztägige Warnstreiks rollen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Tarifabschlüsse in der Industrie geben vor, wie stark Löhne branchenweit steigen – und damit auch, wie viel Kaufkraft und Preisdruck von der Lohnseite in die Wirtschaft kommen.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['volkswagen'],
      sources: [
        {
          label:
            'Tagesschau, 19.11.2026, 17:11 Uhr: „Volkswagen will Nullrunden für zwei Jahre“',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/vw-nullrunde-100.html',
        },
        {
          label:
            'onvista/dpa-AFX, 19.11.2026, 23:15 Uhr: „IG Metall lässt ganztägige Warnstreiks rollen“',
          url: 'https://www.onvista.de/news/2026/11-19-ig-metall-laesst-ganztaegige-warnstreiks-rollen-0-10-26578557',
        },
      ],
    },
    {
      headline: 'BASF beendet Übernahmepläne für Evonik',
      summary: [
        'BASF hat seine Pläne aufgegeben, den Konkurrenten Evonik zu übernehmen. Der Chemiekonzern zieht sich zurück, nachdem Evonik zwei unverbindliche Kaufangebote zurückgewiesen hatte.',
        'Die Evonik-Aktie brach am selben Tag deutlich ein, während auch der Dax insgesamt ins Minus drehte.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zwei abgelehnte Angebote zeigen, dass bei einer Übernahme am Ende der Preis entscheidet – nicht allein der strategische Wille des Käufers zu einer Fusion.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['basf'],
      sources: [
        {
          label: 'Tagesschau, 19.11.2026, 17:55 Uhr: „BASF bläst Evonik-Übernahme ab“',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/basf-evonik-uebernahme-absage-100.html',
        },
        {
          label:
            'onvista, 19.11.2026, 16:54 Uhr: „Evonik-Aktienkurs bricht ein – Dax schließt im Minus“',
          url: 'https://www.onvista.de/news/2026/11-19-evonik-aktienkurs-bricht-ein-dax-schliesst-im-minus-41121301-19-26578474',
        },
      ],
    },
    {
      headline: 'Japans Kerninflation steigt auf Jahreshoch',
      summary: [
        'Japans Kerninflation – also die Teuerung ohne Frischware – ist im Oktober auf den höchsten Stand des Jahres gestiegen. Grund ist nach Angaben von CNBC das Auslaufen staatlicher Energiesubventionen.',
        'Der Wert blieb damit trotzdem unter den 2,3 Prozent, die von Reuters befragte Ökonomen erwartet hatten.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Eine Kerninflation, die trotz auslaufender Subventionen unter der Markterwartung bleibt, verändert das Bild für die japanische Notenbank weniger stark, als die Schlagzeile zunächst vermuten lässt. Gemeldet hat das bislang nur CNBC, eine zweite Quelle lag nicht vor.',
      relatedTopics: ['inflation'],
      relatedSymbols: ['eur-jpy'],
      sources: [
        {
          label:
            'CNBC, 20.11.2026, 00:59 Uhr: „Japan core inflation soars to highest this year as energy subsidy expiry pushes up consumer prices“',
          url: 'https://www.cnbc.com/2026/11/20/japan-inflation-cpi-october.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Anthropic-Rekord-IPO hebt die Börsen nicht – Dax und Dow im Minus',
      summary: [
        'Anthropic eröffnete den Handel bei 111,50 Dollar und legte zeitweise um mehr als 30 Prozent zu. Am Ende des Tages blieb ein Plus von 17 Prozent beim größten Börsengang der Geschichte.',
        'Dow, Nasdaq und Dax schlossen trotzdem im Minus. Zusätzlichen Druck brachte AMD: Die Aktie fiel nach einem Shortseller-Bericht über angebliche Chinageschäfte um mehr als 7 Prozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein starker Börsengang reicht nicht, um eine ganze Branche zu stützen, wenn Anleger an anderer Stelle gleichzeitig Risiken neu einpreisen – IPO und Gesamtmarkt folgen eigenen Logiken.',
      relatedTopics: ['boerse'],
      relatedSymbols: ['dax', 'amd', 'nvidia'],
      sources: [
        {
          label:
            'onvista, 19.11.2026, 17:00 Uhr: „Erster Anthropic-Kurs an der Nasdaq festgestellt“',
          url: 'https://www.onvista.de/news/2026/11-19-erster-anthropic-kurs-an-der-nasdaq-festgestellt-41121763-19-26578478',
        },
        {
          label:
            'Handelsblatt, 19.11.2026, 22:20 Uhr: „Rekord-Börsengang: Anthropic-Aktie schließt 17 Prozent im Plus“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/aktien/boersengang-anthropic-schliesst-17-prozent-im-plus-kursrueckgang-im-handelsverlauf/100270027.html',
        },
        {
          label:
            'Handelsblatt, 19.11.2026, 16:53 Uhr: „US-Börsen schließen deutlich im Minus – Anthropic drückt Kurse“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dow-jones-sp-500-nasdaq-us-boersen-schliessen-deutlich-im-minus-anthropic-drueckt-kurse/100271288.html',
        },
        {
          label:
            'CNBC, 20.11.2026, 01:08 Uhr: „AMD dives on short seller report of alleged China exposure“',
          url: 'https://www.cnbc.com/2026/11/19/amd-falls-on-short-seller-report-of-alleged-china-exposure.html',
        },
      ],
    },
  ],
}
