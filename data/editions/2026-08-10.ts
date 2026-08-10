import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-10.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-10 03:19 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-10',
  intro:
    'Ein Bewerbungsrekord bei Rheinmetall, drei Signale beim Gold, Saudi-Rabatt trifft träge China-Nachfrage: der 10. August in fünf Lehrstücken.',
  top: [
    {
      headline:
        'Gold: CoT-Daten, ETF-Zuflüsse und ein Kommentar zeigen dieselbe Richtung',
      summary: [
        'Neue Terminmarkt-Daten vom 9. August zeigen laut Goldreporter zurückkehrende Spekulation, während der größte Gold-ETF bereits die dritte Woche in Folge wächst.',
        'Ein Kommentar der Société Générale vom 7. August hält zusätzlich fest, dass der Preisanstieg über das hinausgeht, was sinkende US-Zinserwartungen allein erklären würden.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Drei unabhängige Datenquellen, die in dieselbe Richtung zeigen, sind ein stärkeres Signal als eine einzelne Kursbewegung – auch wenn keine davon allein eine Ursache beweist.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label: 'Goldreporter, Analyse vom 9. August 2026',
          url: 'https://www.goldreporter.de/',
        },
        {
          label: 'onvista, Société-Générale-Kommentar vom 7. August 2026, 11:20 Uhr',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline:
        'Rheinmetall-Chef: 23.000 Bewerbungen im Monat, aber die Bundeswehr hinkt hinterher',
      summary: [
        'Laut einem Ticker-Eintrag von finanzen.net vom 9. August gehen bei Rheinmetall monatlich 23.000 Bewerbungen ein, während die Rüstungsbranche insgesamt boomt.',
        'Im selben Atemzug nennt die Meldung die Bundeswehr als Bremse – welche Aufträge konkret verzögert sind, liefert der Ticker nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Bewerbungsrekord zeigt Erwartungen auf dem Arbeitsmarkt, keine bestätigten Aufträge – für die Bilanz zählen erst unterschriebene Verträge.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['rheinmetall'],
      sources: [
        {
          label: 'finanzen.net, News-Ticker vom 9. August 2026',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Bank of America: eigene Ökonomen rügen Fed-Chef Warsh',
      summary: [
        'Ein Ticker-Eintrag von finanzen.net vom 9. August meldet scharfe Kritik der volkswirtschaftlichen Abteilung von Bank of America am amtierenden Fed-Vorsitzenden Warsh.',
        'Woran genau sich die Kritik entzündet, geht aus der kurzen Meldung nicht hervor.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Wenn die eigenen Ökonomen einer Großbank öffentlich vom Kurs der Notenbank abrücken, ist das ein Hinweis auf wachsende Uneinigkeit über die Geldpolitik – unabhängig davon, wer am Ende recht behält.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: [],
      sources: [
        {
          label: 'finanzen.net, News-Ticker vom 9. August 2026',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'SAP: 40 Prozent im Plus seit dem Mehrjahrestief',
      summary: [
        'Ein Ticker-Eintrag von finanzen.net vom 9. August beziffert die Erholung der SAP-Aktie seit ihrem Mehrjahrestief auf 40 Prozent.',
        'Welchen Zeitraum die Erholung genau umfasst und wie Analysten den weiteren Verlauf einschätzen, führt die kurze Meldung nicht näher aus.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Erholungsrate ist nur mit ihrem Ausgangspunkt aussagekräftig: 40 Prozent von einem Tiefstand aus sind etwas anderes als 40 Prozent von einem Hoch aus.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['sap'],
      sources: [
        {
          label: 'finanzen.net, News-Ticker vom 9. August 2026',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline:
        'Wallstreet-online-Kommentar: 2026 sollen plötzlich wieder Zinserhöhungen im Raum stehen',
      summary: [
        'Eine Redaktionsanalyse von wallstreet-online vom 9. August trägt den Titel „Noch 2026: Drei Zinserhöhungen stehen plötzlich im Raum“ – wenige Tage, nachdem ein schwacher US-Jobbericht die Märkte in die Gegenrichtung hatte reagieren lassen.',
        'Auf welche neuen Daten oder Aussagen sich diese These stützt, geht aus der Überschrift allein nicht hervor.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Zwei gegensätzliche Lesarten derselben Woche zeigen, wie schnell sich Zinserwartungen drehen können – und warum eine einzelne Schlagzeile selten die ganze Geschichte ist.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: [],
      sources: [
        {
          label: 'wallstreet-online Redaktion, 9. August 2026',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline:
        'Daimler Truck meldet einen Gewinneinbruch – mitten in der Rekordwoche der Börsen',
      summary: [
        'Eine Übersichtsmeldung von finanzen.net vom 7. August nennt neben DAX-Rekorden und höher geschlossenen US-Börsen auch einen Gewinneinbruch bei Daimler Truck.',
        'Zahlen zum Ausmaß des Rückgangs liefert die Kurzmeldung nicht; sie steht als Gegenpunkt neben den sonst freundlichen Nachrichten des Tages.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Gewinneinbruch bei einem einzelnen Industriewert erinnert daran, dass ein Rekord im Gesamtindex nicht automatisch heißt, dass es allen Unternehmen darin gut geht.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label: 'finanzen.net, Übersicht „Heute im Fokus“ vom 7. August 2026',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
}
