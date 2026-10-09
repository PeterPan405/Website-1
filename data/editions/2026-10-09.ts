import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-09.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-09 00:16 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-09',
  intro:
    'EZB-Reden, Frankreichs Haushaltskrise, ein Ölpreis-Preiskrieg und Rekorde bei Gold und in Brasilien: ein dicht gefüllter Freitag für die Märkte.',
  top: [
    {
      headline: 'EZB-Tag: Cipollone und Schnabel sprechen, Nachfolge gesucht',
      summary: [
        'Um 10 Uhr kommen die EU-Finanzminister zum EcoFin-Rat zusammen. Um 12:15 Uhr spricht EZB-Direktoriumsmitglied Piero Cipollone. Um 15:30 Uhr folgt Isabel Schnabel.',
        'Die Euro-Finanzminister suchen schon eine Nachfolge für Schnabel. Das meldete dpa-AFX, einen Zeitplan nennt die Agentur nicht. Der Euro stieg zuletzt auf 1,1217 Dollar.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Reden von Notenbankern gelten als Fingerzeig für den nächsten Zinsschritt und bewegen Anleiherenditen und Wechselkurse auch ohne formale Entscheidung. Eine offene Nachfolgefrage verstärkt zusätzlich die Unsicherheit über die künftige Ausrichtung der EZB.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'wallstreet-online, Wirtschaftskalender und Politiknachrichten, Stand 09.10.2026 00:16 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Frankreich: Neue Proteste, während die Anleihemärkte nervös bleiben',
      summary: [
        'In Frankreich demonstrierten 71.500 Menschen für bessere Schulen. Das meldete dpa-AFX. Die Regierung setzte kurzfristig 3.000 Vertretungslehrer ein.',
        'Zugleich bleibt der französische Anleihemarkt angespannt. Das zeigt die Übersicht von wallstreet-online zur Haushaltskrise. Einen genauen Auslöser für die aktuelle Bewegung nennt sie nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Steigende Risikoaufschläge für französische Staatsanleihen gelten als Test für den Zusammenhalt der Eurozone und wirken über Zinsen und Wechselkurs auch auf andere Mitgliedstaaten.',
      relatedTopics: ['staatsanleihe'],
      relatedSymbols: ['cac-40'],
      sources: [
        {
          label:
            'wallstreet-online, Politik- und Devisennachrichten, Stand 09.10.2026 00:16 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline:
        'Ölpreis steigt trotz Rabatten: Irak und Saudi-Arabien senken Preise für Asien',
      summary: [
        'Brent-Rohöl kostete zuletzt 103,86 Dollar je Fass. Das ist 2,87 Prozent mehr als zuvor. Gleichzeitig senkten Irak und Saudi-Arabien ihre Verkaufspreise für Käufer in Asien deutlich.',
        'Das meldet die aktuelle Kursleiste von wallstreet-online. Laut der Redaktion verschärft sich der Preiskampf um Marktanteile in Asien. Die US-Regierung hält ihre strategische Reserve nach einem Bericht vom Vortag so niedrig wie zuletzt 1982.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dass der Weltmarktpreis steigt, während einzelne Anbieter ihre Preise für Großkunden senken, zeigt: Benchmark-Preis und regionaler Verkaufspreis folgen nicht derselben Logik. Ein historisch niedriger US-Lagerbestand kann den globalen Preis stützen, auch wenn einzelne Verkäufer um Marktanteile konkurrieren.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'wallstreet-online, Kursleiste und Rohstoffnachrichten, Stand 09.10.2026 00:16 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Dow stabil, Nasdaq schwächer: Sorgen um OpenAI drücken KI-Werte',
      summary: [
        'An der Wall Street schloss der Dow Jones stabil. Der Nasdaq gab wegen Sorgen um Künstliche Intelligenz nach. Das meldete dpa-AFX.',
        'Zuvor hatten Umsatzsorgen um OpenAI für Verluste bei KI-Werten gesorgt. Der US Tech 100 verlor zuletzt 1,38 Prozent, der US 30 gewann 0,10 Prozent. Chiphersteller TSMC meldete laut onvista zugleich einen Rekordumsatz, konkrete Zahlen nennt die Übersicht nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dass TSMC einen Rekordumsatz meldet und gleichzeitig andere KI-Werte unter Verlusten leiden, zeigt: Anleger bewerten einzelne Geschäftsmodelle innerhalb derselben Branche sehr unterschiedlich, je nachdem, wie abhängig sie von einzelnen Großkunden sind.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['nasdaq-100', 'dow-jones', 'tsmc'],
      sources: [
        {
          label:
            'onvista und wallstreet-online, Marktberichte vom 08.10.2026, Stand 09.10.2026 00:16 Uhr',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Gold hält sich über 4.100 Dollar, obwohl die Renditen steigen',
      summary: [
        'Gold notierte zuletzt bei 4.147,55 Dollar je Feinunze, ein Plus von 0,31 Prozent. Das zeigt die aktuelle Kursleiste von wallstreet-online.',
        'Der größte Gold-ETF verzeichnete laut Goldreporter einen Kapitalzufluss von 571 Millionen Dollar und baute seine Bestände aus. China stockte seine Goldreserven im September erneut auf, genaue Mengen nennt die Quelle nicht.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Steigende Anleiherenditen verteuern normalerweise das zinslose Halten von Gold und drücken damit den Preis. Dass Gold trotzdem Zuflüsse verzeichnet, deutet auf zusätzliche Nachfrage als Absicherung gegen andere Risiken hin.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label: 'goldreporter.de, Marktbericht und ETF-Meldung vom 08.10.2026',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Brasiliens Börse springt fast acht Prozent auf ein Rekordhoch',
      summary: [
        'Der brasilianische Leitindex Bovespa sprang laut wallstreet-online um fast acht Prozent auf ein Rekordhoch. Grund sind nach Angaben der Redaktion Umfragewerte, in denen Jair Bolsonaro an Amtsinhaber Lula vorbeizog.',
        'Investoren setzen demnach auf einen strikteren Sparkurs. Die Stichwahl ist nach Angaben der Quelle weiterhin offen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Kurssprung von fast acht Prozent allein wegen einer Umfrage zeigt, wie stark Schwellenmarktbörsen auf politische Erwartungen reagieren können, lange bevor eine Wahl tatsächlich entschieden ist.',
      relatedTopics: ['aktien-laender-branchen'],
      relatedSymbols: ['ibovespa'],
      sources: [
        {
          label:
            'wallstreet-online, Devisennachrichten vom 08.10.2026, Stand 09.10.2026 00:16 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
