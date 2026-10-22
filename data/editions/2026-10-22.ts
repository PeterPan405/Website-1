import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-22.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-22 00:18 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-22',
  intro:
    'Großbritanniens Inflation springt auf 3,5 Prozent, Frankreichs Anleihen werden teurer, und Tesla legt Zahlen vor einer möglichen Fusion mit SpaceX vor.',
  top: [
    {
      headline: 'Großbritanniens Inflation steigt, Zinserhöhung rückt näher',
      summary: [
        'Großbritannien bekommt ein Preisproblem.',
        'Die Inflation stieg im September auf 3,5 Prozent, meldete das Statistikamt ONS.',
        'Im August hatte sie noch bei 3,1 Prozent gelegen.',
        'Haupttreiber waren höhere Kraftstoffpreise.',
        'Am Markt gilt eine Leitzinserhöhung der Bank of England von 3,75 auf 4,0 Prozent nun als nahezu sicher.',
        'Die nächste Sitzung der Notenbank ist Anfang November.',
        'Das britische Pfund stieg zum Euro auf den höchsten Stand seit siebzehn Monaten.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Steigende Inflation bringt Notenbanken in einen Zielkonflikt: Höhere Zinsen bremsen die Preise, verteuern aber zugleich Kredite für Verbraucher und den Staat.',
      relatedTopics: ['notenbanken-geldpolitik', 'inflation'],
      relatedSymbols: ['ftse-100', 'eur-gbp'],
      sources: [
        {
          label:
            'ONS (Office for National Statistics), Statistical bulletin „Consumer price inflation, UK: September 2026“, veröffentlicht am 21.10.2026',
          url: 'https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/consumerpriceinflation/september2026',
        },
        {
          label:
            'FAZ, Finanzmarkt, Philip Plickert, Meldung vom 21.10.2026, 15:08 Uhr: „3,5 Prozent Teuerung: England nähert sich einem Zinsanstieg“',
          url: 'https://www.faz.net/aktuell/finanzen/finanzmarkt/inflation-in-grossbritannien-bank-of-england-vor-mehreren-zinsschritten-201608676.html',
        },
      ],
    },
    {
      headline: 'Frankreich: Anleiherendite springt auf fünf Prozent',
      summary: [
        'Frankreichs Schulden werden sichtbar teurer.',
        'Die Rendite zehnjähriger Staatsanleihen kletterte am Mittwoch auf fünf Prozent.',
        'Das ist der höchste Stand seit dem Jahr 2002.',
        'Allein in dieser Woche stieg sie um 25 Basispunkte.',
        'Grund ist der Streit um den Haushalt 2027 mit geplanten Einsparungen von 43 Milliarden Euro.',
        'Premierminister Sébastien Lecornu hat dafür im Parlament noch keine Mehrheit.',
        'Frankreichs Schuldenquote dürfte 2026 auf knapp 120 Prozent der Wirtschaftsleistung steigen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Steigende Anleiherenditen bedeuten fallende Anleihekurse und wirken über die Abzinsung künftiger Gewinne auch auf Aktienbewertungen – ein Kanal, über den Staatsschulden die Börse erreichen.',
      relatedTopics: ['staatsanleihe', 'schulden-und-kredit'],
      relatedSymbols: ['cac-40'],
      sources: [
        {
          label:
            'Handelsblatt, Märkte/Anleihen, Meldung vom 21.10.2026, 13:39 Uhr: „Staatsanleihen: Erstmals seit 2002: Frankreichs Zehn-Jahres-Rendite erreicht fünf Prozent“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/anleihen/staatsanleihen-erstmals-seit-2002-frankreichs-rendite-erreicht-fuenf-prozent/100263898.html',
        },
        {
          label:
            'WirtschaftsWoche, Börse, dpa-AFX, Meldung vom 21.10.2026, 13:52 Uhr: „Staatsanleihen: Rendite französischer Staatsanleihen steigt auf über fünf Prozent“',
          url: 'https://www.wiwo.de/finanzen/boerse/franzoesische-staatsanleihen-rendite-steigt-auf-ueber-fuenf-prozent/100263359.html',
        },
      ],
    },
    {
      headline: 'Tesla übertrifft Erwartungen, Fusion mit SpaceX rückt näher',
      summary: [
        'Bei Tesla ging es am Mittwoch um zwei Dinge zugleich.',
        'Der Elektroautobauer übertraf mit den Quartalszahlen die Erwartungen der Analysten.',
        'Der Umsatz lag bei 28,05 Milliarden Dollar.',
        'Der Gewinn brach trotzdem um 29 Prozent auf 787 Millionen Dollar ein.',
        'Grund waren hohe Ausgaben für Roboter und Künstliche Intelligenz.',
        'Die Aktie fiel nachbörslich dennoch um mehr als drei Prozent.',
        'Einen Tag zuvor hatte Tesla-Chef Elon Musk eine Fusion mit SpaceX eine gute Idee genannt.',
        'Beide Unternehmen prüfen das in eigenen Ausschüssen.',
        'Zusammen wären sie rund 3,5 Billionen Dollar wert.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Kurs fiel trotz besser als erwarteter Kennzahlen, weil der Gewinn im Jahresvergleich einbrach – ein Beispiel dafür, dass der Markt oft stärker auf die Richtung einzelner Kennziffern reagiert als auf den reinen Vergleich mit Analystenschätzungen.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['tesla', 'nasdaq-100'],
      sources: [
        {
          label:
            'CNBC, Meldung vom 21.10.2026, 23:32 Uhr (MESZ): „Tesla beats on earnings and sales even as auto revenue declines“',
          url: 'https://www.cnbc.com/2026/10/21/tesla-tsla-q3-2026-earnings-report.html',
        },
        {
          label:
            'tagesschau.de, Wirtschaft/Unternehmen, Meldung vom 21.10.2026, 09:11 Uhr: „Tesla und SpaceX prüfen Zusammenschluss – noch mehr Macht für Musk?“',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/tesla-spacex-zusammenschluss-moeglich-100.html',
        },
        {
          label:
            'Handelsblatt, Technologie, Thomas Jahn, Meldung vom 21.10.2026, 16:28 Uhr: „USA: Fusion von SpaceX und Tesla rückt näher – JP Morgan verdoppelt Kursziel“',
          url: 'https://www.handelsblatt.com/technik/it-internet/usa-fusion-von-spacex-und-tesla-rueckt-naeher-jp-morgan-verdoppelt-kursziel/100263828.html',
        },
      ],
    },
    {
      headline: 'SAP hebt nach starkem Cloud-Quartal den Ausblick an',
      summary: [
        'SAP hat mehr Cloud-Verträge abgeschlossen als gedacht.',
        'Der Umsatz stieg im dritten Quartal um 13 Prozent auf 10,3 Milliarden Euro.',
        'Das ist das erste Quartal mit mehr als 10 Milliarden Euro Umsatz.',
        'Beim Cloud-Geschäft legten die Erlöse um 26 Prozent zu.',
        'Der Gewinn kletterte um 11 Prozent auf 2,27 Milliarden Euro.',
        'Vorstandschef Christian Klein rechnet beim Cloud-Ausblick nun mit dem oberen Ende der bisherigen Prognosespanne.',
        'Finanzchef Dominik Asam warnte zugleich vor Risiken im vierten Quartal.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Auftragsbestand gilt als Frühindikator für künftige Umsätze – deshalb reagierten Anleger stärker auf das Wachstum der Cloud-Verträge als auf den Quartalsgewinn selbst.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['sap', 'dax'],
      sources: [
        {
          label:
            'onvista, Unternehmensnachrichten, dpa-AFX, Meldung vom 21.10.2026, 22:24 Uhr: „ROUNDUP 2: SAP erwartet mit starkem Cloudbestand etwas mehr – Aktie steigt“',
          url: 'https://www.onvista.de/news/2026/10-21-roundup-2-sap-erwartet-mit-starkem-cloudbestand-etwas-mehr-aktie-steigt-0-10-26566960',
        },
        {
          label:
            'wallstreet-online, Unternehmensnachrichten, Meldung vom 21.10.2026: „Cloud-Wachstum sprengt alle Erwartungen: So stark sind die SAP-Zahlen“',
          url: 'https://www.wallstreet-online.de/nachricht/21561515-prognose-angehoben-cloud-wachstum-sprengt-erwartungen-stark-sap-zahlen',
        },
      ],
    },
    {
      headline: 'Finanzinvestor EQT will Qiagen für 10,8 Milliarden Euro übernehmen',
      summary: [
        'Der Finanzinvestor EQT greift nach dem Dax-Konzern Qiagen.',
        'EQT will je Aktie 46,50 Euro in bar zahlen.',
        'Das bewertet Qiagen mit rund 10,8 Milliarden Euro inklusive Schulden.',
        'Beteiligt sind auch der Staatsfonds von Abu Dhabi und der kanadische Pensionsfonds CPP.',
        'Die Qiagen-Aktie schloss in Frankfurt kaum verändert bei 42,80 Euro.',
        'In den USA gewann das Papier 2,3 Prozent.',
        'Qiagen setzte zugleich seinen Ausblick für 2026 bis auf Weiteres aus.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Übernahmeangebote werden meist mit einem Aufschlag auf den Börsenkurs bezahlt – hier fiel die Prämie mit rund 8,6 Prozent eher moderat aus, auch weil der Kurs die Spekulation bereits vorweggenommen hatte.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'onvista, Unternehmensnachrichten, dpa-AFX, Meldung vom 21.10.2026, 22:30 Uhr: „KORREKTUR: Finanzinvestor EQT will Qiagen übernehmen“',
          url: 'https://www.onvista.de/news/2026/10-21-korrektur-finanzinvestor-eqt-will-qiagen-uebernehmen-0-10-26566961',
        },
        {
          label:
            'Handelsblatt, Märkte/Marktberichte, Leonidas Exuzidis, Meldung vom 21.10.2026, 17:59 Uhr: „Dax aktuell: Dax schließt auf Vierwochenhoch – Bilanzsaison gibt Hoffnung“ (nennt Qiagen als Dax-Konzern im Übernahmefokus)',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dax-aktuell-dax-dreht-ins-plus-oelpreis-sinkt-nach-fuenf-monats-hoch/100263814.html',
        },
      ],
    },
  ],
  further: [],
}
