import type { DailyEdition } from './types'

/**
 * Ausgabe vom 3. August 2026 – ein Montag mit ungewöhnlich dichter Lage.
 *
 * Drei Nachrichten aus derselben Nacht: Trumps Absage der Iran-Angriffe
 * drückt den Ölpreis um fünf Prozent, Washington und Tokio bestätigen die
 * gemeinsame Yen-Intervention, und die OPEC+ hat am Sonntag ihre
 * Erhöhungsserie abgeschlossen. Dazu der Kospi-Umschwung, der US-Freitag
 * und der Terminkalender.
 *
 * Zur Quellenlage: AP-Bericht über zwei unabhängige Angaben (WSLS-Abdruck,
 * per Läufer gelesen), OPEC über WirtschaftsWoche/dpa und Business
 * Recorder/Reuters unabhängig, Termine über dpa-AFX (ARIVA), DAX-Wochenbild
 * über XTB plus eigene Yahoo-Tagesdaten.
 */
export const edition: DailyEdition = {
  date: '2026-08-03',
  intro:
    'Trump sagt den Iran-Angriff ab und der Ölpreis bricht ein, Washington und Tokio stützen gemeinsam den Yen – und die OPEC+ beendet ihre Erhöhungsserie.',
  top: [
    {
      headline: 'Ölpreis bricht um fünf Prozent ein – Trump sagt Iran-Angriff ab',
      summary: [
        'Der Ölpreis ist am Montagmorgen eingebrochen: Brent fiel laut AP um fünf Prozent auf 83,87 Dollar, WTI um 4,8 Prozent auf 80,58 Dollar. Auslöser war die Erklärung von US-Präsident Trump, er werde die Streitkräfte anweisen, auf Angriffe gegen den Iran zu verzichten – eine Vereinbarung zur Beendigung der Kämpfe sei nah.',
        'Am Freitagabend hatte Brent nach den hier geführten Tagesdaten noch bei gut 90 Dollar notiert. Verschwunden ist über Nacht keine Ölmenge, sondern ein Teil der Risikoprämie – des Aufschlags für mögliche Lieferausfälle.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Im Ölpreis steckt ein Preis für Wahrscheinlichkeiten. Er fällt, sobald eine Eskalation unwahrscheinlicher wird – ohne dass ein Fass mehr fließt. Dieselbe Prämie kann zurückkehren, wenn die Einigung ausbleibt.',
      relatedTopics: ['rohstoffe', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'AP (via WSLS): „Asian stocks are mixed as yen jumps against the dollar, while oil prices slip“ (3. August 2026)',
          url: 'https://www.wsls.com/business/2026/08/03/asian-stocks-are-mixed-as-yen-jumps-against-the-dollar-while-oil-prices/',
        },
      ],
    },
    {
      headline: 'USA und Japan bestätigen gemeinsame Yen-Intervention',
      summary: [
        'Washington und Tokio haben bestätigt, in der vergangenen Woche gemeinsam am Devisenmarkt eingegriffen zu haben, um den Yen zu stützen. Der Dollar war auf ein 40-Jahres-Hoch nahe 164 Yen gestiegen; nach der Bestätigung fiel er zeitweise auf 155,20 Yen – der stärkste Yen-Stand seit Ende vergangenen Jahres.',
        'Japans Börse reagierte mit Verlusten: Der Nikkei 225 gab am Montagmorgen 1,9 Prozent auf rund 63.140 Punkte nach, weil ein stärkerer Yen die Auslandsgewinne der Exportkonzerne schmälert.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Gemeinsame Interventionen zweier großer Währungsräume sind selten und deshalb wirksam. Wechselkurse verschieben Gewinne zwischen Export und Import – wer japanische Aktien oder einen Welt-ETF hält, hält die Währungswette mit.',
      relatedTopics: ['waehrungen-wechselkurse', 'notenbanken-geldpolitik'],
      relatedSymbols: ['nikkei-225'],
      sources: [
        {
          label:
            'AP (via WSLS): „Asian stocks are mixed as yen jumps against the dollar, while oil prices slip“ (3. August 2026)',
          url: 'https://www.wsls.com/business/2026/08/03/asian-stocks-are-mixed-as-yen-jumps-against-the-dollar-while-oil-prices/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'OPEC+ beschließt 188.000 Barrel – und beendet die Serie',
      summary: [
        'Die sieben Kernstaaten der OPEC+ haben am Sonntag die September-Quote um rund 188.000 Barrel pro Tag angehoben – der letzte Schritt der Rücknahme der 2023er-Kürzung von 1,65 Millionen Barrel. Zum vierten Quartal sagte die Gruppe nichts; Analysten halten eine Pause für wahrscheinlich, während die Quoten für 2027 verhandelt werden. Kuwaits Förderung erholte sich im Juli auf 1,971 Millionen Barrel – ein Zeichen, dass wieder mehr Öl durch Hormus kommt.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Ölmarkt wechselt vom Fahrplan ins Verhandeln: Beschlüsse, Kapazitäten und echte Lieferungen sind drei verschiedene Zahlen – die Schlagzeilen der nächsten Monate entstehen aus ihren Differenzen.',
      relatedTopics: ['rohstoffe', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['brent', 'erdgas'],
      sources: [
        {
          label:
            'WirtschaftsWoche / dpa: „Opec+ erhöht Ölförderziele für September“ (2. August 2026)',
          url: 'https://www.wiwo.de/politik/ausland/opec-kartell-opec-erhoeht-oelfoerderziele-fuer-september/100244518.html',
        },
        {
          label:
            'Business Recorder / Reuters: „OPEC agrees September oil hike, completing rollback of voluntary cuts“ (2. August 2026)',
          url: 'https://www.brecorder.com/news/40432965/opec-agrees-september-oil-hike-completing-rollback-of-voluntary-cuts',
        },
      ],
    },
    {
      headline: 'Kospi: bester Tag der Geschichte, dann minus 4,5 Prozent',
      summary: [
        'Südkoreas Leitindex sprang am Freitag um 17,9 Prozent – sein bester Tag überhaupt – und verlor am Montagmorgen wieder 4,5 Prozent auf 6.298,75 Punkte. Hinter beiden Bewegungen stehen vor allem Samsung Electronics und SK Hynix: erst mehr als 25 Prozent Plus, dann rund 8 Prozent Minus. Hongkong legte dagegen zu, Shanghai und Sydney gaben leicht nach.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Landesindex mit zwei dominanten Titeln ist kein breiter Markt, sondern ein konzentriertes Branchenportfolio. Die Streuung eines ETF schützt nur so weit, wie der Index selbst gestreut ist.',
      relatedTopics: ['aktien-laender-branchen', 'risiko-und-rendite'],
      relatedSymbols: ['kospi', 'samsung'],
      sources: [
        {
          label:
            'AP (via WSLS): „Asian stocks are mixed as yen jumps against the dollar, while oil prices slip“ (3. August 2026)',
          url: 'https://www.wsls.com/business/2026/08/03/asian-stocks-are-mixed-as-yen-jumps-against-the-dollar-while-oil-prices/',
        },
      ],
    },
    {
      headline: 'US-Freitag: Amazon plus 15,3 Prozent, Apple minus 7,4',
      summary: [
        'Beide Konzerne meldeten mehr Gewinn als erwartet – doch Amazons Cloud-Beschleunigung überzeugte, während Apples Umsatzprognose wegen Komponentenengpässen im KI-Boom enttäuschte. Der S&P 500 schloss 0,7 Prozent fester und beendete seine erste Gewinnwoche nach zwei Verlustwochen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Kurse bewegen sich am Abstand zwischen Meldung und Erwartung, nicht an der absoluten Zahl – und der Ausblick wiegt schwerer als das abgelaufene Quartal.',
      relatedTopics: ['aktie', 'anlegerpsychologie'],
      relatedSymbols: ['amazon', 'apple', 'sp500'],
      sources: [
        {
          label:
            'AP (via WSLS): „Asian stocks are mixed as yen jumps against the dollar, while oil prices slip“ (3. August 2026)',
          url: 'https://www.wsls.com/business/2026/08/03/asian-stocks-are-mixed-as-yen-jumps-against-the-dollar-while-oil-prices/',
        },
      ],
    },
    {
      headline: 'DAX mit Wochenplus – und der Tag bringt ISM und Palantir',
      summary: [
        'Der DAX beendete die Woche rund 2,1 Prozent fester nahe dem Allzeithoch; je nach Quelle steht der Freitagsschluss bei 25.650 (XTB) oder 25.629 Punkten (eigene Yahoo-Tagesdaten) – beides richtig, nur anders gemessen. Heute folgen der deutsche Einzelhandelsumsatz, die PMI-Zweitveröffentlichungen, um 16 Uhr der US-ISM-Index und nach US-Schluss die Palantir-Zahlen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Terminkalender ist eine Landkarte möglicher Überraschungen: Kursrelevant ist, was von der Erwartung abweichen kann – deshalb zählt der ISM mehr als sechs PMI-Bestätigungen zusammen.',
      relatedTopics: ['boerse', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dax', 'palantir'],
      sources: [
        {
          label:
            'XTB Marktanalysen: „DAX Aktuell: Allzeithoch wieder im Blick – Wochenausblick KW 32“ (2. August 2026)',
          url: 'https://www.xtb.com/de/Marktanalysen/Trading-News/dax-allzeithoch-wieder-im-blick-chartanalyse-prognose-wochenausblick',
        },
        {
          label:
            'dpa-AFX (via ARIVA): „Tagesvorschau: Termine am 3. August 2026“ (31. Juli 2026)',
          url: 'https://www.ariva.de/news/tagesvorschau-termine-am-3-august-2026-12088514',
        },
      ],
    },
  ],
}
