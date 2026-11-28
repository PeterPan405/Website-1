import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-28.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-28 00:46 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-28',
  intro:
    'Tarifeinigung in der Metallindustrie, überraschend schwächere Inflation in Frankreich und Spanien, SAP-Stellenabbau und ein Kurssprung in China.',
  top: [
    {
      headline: 'IG Metall und Arbeitgeber einigen sich auf 4,3 Prozent mehr Lohn',
      summary: [
        'IG Metall und die Arbeitgeber haben sich geeinigt. Die Löhne in der Metall- und Elektroindustrie steigen in zwei Stufen um insgesamt 4,3 Prozent, zum 1. Mai 2027 und zum 1. April 2028. Dazu kommt eine Einmalzahlung bis 450 Euro.',
        'Der Pilotvertrag läuft 25 Monate. Er gilt zunächst für Baden-Württemberg und Nordrhein-Westfalen und soll auf weitere Bezirke übertragen werden. Voraus gingen die schärfsten Warnstreiks seit Jahren mit mehr als 950.000 Teilnehmenden.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die vereinbarte Steigerung von rund zwei Prozent pro Jahr liegt unter der aktuellen Teuerung in der Eurozone von etwa vier Prozent – nominale Lohnzuwächse sagen damit allein noch nichts über die reale Kaufkraft der Beschäftigten.',
      relatedTopics: ['aktie', 'inflation'],
      relatedSymbols: ['dax', 'mercedes-benz', 'volkswagen'],
      sources: [
        {
          label:
            'tagesschau.de, Wirtschaft, Meldung vom 26.11.2026, 17:43 Uhr: „Einigung im Tarifstreit der Metall- und Elektroindustrie"',
          url: 'https://www.tagesschau.de/wirtschaft/tarifabschluss-metall-elektroindustrie-100.html',
        },
        {
          label:
            'aktiencheck.de Redaktion, Meldung vom 27.11.2026, 11:32 Uhr: „Metall-Tarifabschluss: 4,3 Prozent in zwei Stufen für rund 1,7 Millionen Beschäftigte"',
          url: 'https://aktiencheck.de/artikel/metall-tarifabschluss-43-prozent-in-zwei-stufen-fuer-rund-17-millionen',
        },
      ],
    },
    {
      headline: 'Inflation in Frankreich und Spanien sinkt überraschend deutlich',
      summary: [
        'Frankreich und Spanien melden niedrigere Inflationsraten. Die Teuerung in Frankreich fiel im November auf 3,2 Prozent, nach 3,7 Prozent im Oktober. Spanien meldete einen Rückgang auf 4,1 Prozent, nach 4,9 Prozent im Oktober. Beide Werte fielen stärker als von Fachleuten erwartet.',
        'Die deutschen Zahlen folgen am Montag, die der gesamten Eurozone am Dienstag. Dort wird eine Rate von 4,0 Prozent erwartet – doppelt so hoch wie das Ziel der Europäischen Zentralbank.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Zwei einzelne Landeswerte sagen noch nichts über die Rate für die gesamte Eurozone, an der sich die EZB orientiert – Analysten erwarten zum Jahreswechsel wegen Gaspreisen und dem Ende des deutschen Tankrabatts ohnehin wieder einen Anstieg.',
      relatedTopics: ['inflation'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'Handelsblatt, Geldpolitik, Meldung vom 27.11.2026, 12:09 Uhr: „Konjunktur: Inflation in Spanien und Frankreich lässt überraschend nach"',
          url: 'https://www.handelsblatt.com/finanzen/geldpolitik/konjunktur-inflation-in-spanien-und-frankreich-laesst-ueberraschend-nach/100273264.html',
        },
      ],
    },
    {
      headline: 'SAP bereitet Insidern zufolge großen Stellenabbau vor',
      summary: [
        'SAP plant laut mehreren übereinstimmenden Medienberichten einen größeren Stellenabbau. Bloomberg nennt bis zu 10.000 Stellen, ein Insider sprach gegenüber dem Handelsblatt von bis zu 15.000. Eine endgültige Zahl steht nach diesen Berichten noch nicht fest.',
        'SAP selbst äußerte sich nicht zu den Zahlen. Konzernchef Christian Klein hatte zuvor bei Investoren signalisiert, dass die Belegschaft wegen Automatisierung durch Künstliche Intelligenz zurückgehen dürfte.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Sollten sich die kursierenden Zahlen bestätigen, wäre es einer der größten KI-bedingten Arbeitsplatzabbauten in der deutschen Industrie – ein Signal auch für andere Software- und Dienstleistungsunternehmen, die ihre Belegschaft neu bemessen.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['sap', 'dax'],
      sources: [
        {
          label:
            'tagesschau.de, Wirtschaft/Unternehmen, Meldung vom 27.11.2026, 12:09 Uhr: „SAP erwägt offenbar Abbau von Tausenden Stellen"',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/sap-stellenabbau-geplant-100.html',
        },
        {
          label:
            'CNBC, Meldung vom 27.11.2026, 14:52 Uhr GMT: „German software firm SAP is reportedly cutting at least 10,000 jobs in AI push"',
          url: 'https://www.cnbc.com/2026/11/27/sap-job-cuts-ai-restructuring.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Chinas Börsen springen nach seltenem Regierungskommentar',
      summary: [
        'Chinas Staatsrat forderte ungewöhnlich deutlich zusätzliche Maßnahmen zur Stützung der Kapitalmärkte. Der Leitindex CSI 300 legte daraufhin um mehr als vier Prozent zu, der größte Tagesgewinn seit Oktober 2024. Der Nikkei in Tokio stieg um 2,1 Prozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Kurssprung zeigt, wie stark Chinas Aktienmärkte an politischen Signalen hängen – der CSI 300 liegt trotz des Sprungs weiterhin mehr als 20 Prozent unter seinem Höchststand vom Juni.',
      relatedTopics: ['aktien-laender-branchen'],
      relatedSymbols: ['nikkei-225'],
      sources: [
        {
          label:
            'Handelsblatt, Märkte/Marktberichte, Meldung vom 27.11.2026, 10:16 Uhr: „Nikkei, Yen, CSI 300: Chinesische Märkte legen nach seltenem Regierungskommentar zu"',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/nikkei-yen-csi-300-chinesische-maerkte-legen-nach-seltenem-regierungskommentar-zu/100273175.html',
        },
        {
          label:
            'CNBC, Meldung vom 27.11.2026, 10:13 Uhr GMT: „Chinese chip stocks notch biggest ever one-day gains as Beijing signals broader market support"',
          url: 'https://www.cnbc.com/2026/11/27/china-chip-stocks-beijing-market-support.html',
        },
      ],
    },
    {
      headline: 'EU gibt grünes Licht für Deutsche Börses größte Übernahme',
      summary: [
        'Die EU-Kommission hat die Übernahme der Fondsplattform Allfunds durch die Deutsche Börse ohne Auflagen genehmigt. Es ist die größte Übernahme der Firmengeschichte, der Wert liegt bei gut fünf Milliarden Euro. Der Vollzug wird für das erste Quartal 2027 erwartet.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die Deutsche Börse baut damit ihr Geschäft außerhalb des reinen Aktienhandels aus – ein Schritt, um unabhängiger von den Schwankungen an den Börsen selbst zu werden.',
      relatedTopics: ['fonds', 'aktie'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'Handelsblatt, Märkte, Meldung vom 27.11.2026, 13:16 Uhr: „Märkte: EU erlaubt Deutscher Börse Milliarden-Übernahme von Allfunds"',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/maerkte-eu-erlaubt-deutscher-boerse-milliarden-uebernahme-von-allfunds/100273297.html',
        },
        {
          label:
            'WirtschaftsWoche, Börse, Meldung vom 27.11.2026, 13:43 Uhr: „Allfunds: Deutsche Börse darf Fondsplattform übernehmen"',
          url: 'https://www.wiwo.de/finanzen/boerse/deutsche-boerse-eu-genehmigt-rekorduebernahme-von-allfunds/100273302.html',
        },
      ],
    },
  ],
}
