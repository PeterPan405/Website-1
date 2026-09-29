import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-29.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-29 00:19 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-29',
  intro:
    'Hormus-Spannungen treiben Öl und Zinsen nach oben, Gold und Silber fallen. Trump erwägt einen Diesel-Exportstopp, die Wall Street rutscht ab.',
  top: [
    {
      headline: 'Spaniens Inflation und zwei EZB-Reden bestimmen den Dienstag',
      summary: [
        'Der Dienstag startet mit einer Zahl aus Spanien. Um 9 Uhr veröffentlicht das Land seine Verbraucherpreise für September. Ökonomen erwarten eine Jahresrate von 4,7 Prozent, nach 4,3 Prozent im Vormonat.',
        'Aus der Europäischen Zentralbank kommen zwei Reden. Um 9:45 Uhr spricht Direktoriumsmitglied Piero Cipollone. Um 13 Uhr folgt EZB-Präsidentin Christine Lagarde. Dazwischen, um 11 Uhr, meldet die EU-Kommission ihre monatlichen Umfragen zum Wirtschafts- und Verbrauchervertrauen in der Eurozone.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Reden von EZB-Vorständen gelten als Fingerzeig für den künftigen Kurs der Zinspolitik, noch bevor neue Konjunkturdaten vorliegen.',
      relatedTopics: ['notenbanken-geldpolitik', 'inflation'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label: 'wallstreet-online.de, Wirtschaftskalender, Stand 29.09.2026, 00:19 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Hormus-Spannungen treiben Öl und Renditen, Gold und Silber fallen',
      summary: [
        'Neue Spannungen um die Straße von Hormus trieben am Montag Öl und die Renditen von US-Staatsanleihen nach oben. Gold und Silber gerieten zeitgleich deutlich unter Druck, an einem Tag mit Futures-Verfall.',
        'Brent-Öl stand am frühen Dienstagmorgen bei 98,56 Dollar. Gold notierte bei 4.115 Dollar, Silber fiel um rund 5,8 Prozent auf 60,61 Dollar. Der Goldpreis rutschte unter seine 50-Tage-Linie.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Steigende Anleiherenditen erhöhen die Opportunitätskosten von Gold, weil das Edelmetall selbst keine Zinsen zahlt.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: ['brent', 'gold', 'silber'],
      sources: [
        {
          label: 'goldreporter.de, Marktbericht vom 28.09.2026',
          url: 'https://www.goldreporter.de/',
        },
        {
          label: 'wallstreet-online.de, Rohstoffkurse, Stand 29.09.2026, 00:19 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Trump erwägt Diesel-Exportstopp, Iran-Öl steuert auf die USA zu',
      summary: [
        'US-Präsident Trump hält weiter an einem möglichen Exportstopp für Diesel fest. Lobbyverbände warnen davor, ohne dass die Meldung eine Begründung Trumps nennt.',
        'Parallel dazu steuern fast 6 Millionen Barrel beschlagnahmtes Iran-Öl auf die USA zu, mit einem Warenwert von rund 600 Millionen Dollar.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Exportverbot dämpft zwar das Inlandsangebot, entzieht aber dem Weltmarkt Ware und kann dort die Preise anheben.',
      relatedTopics: ['rohstoffe', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['wti', 'brent'],
      sources: [
        {
          label: 'wallstreet-online.de, Nachrichten vom 28.09.2026',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Ölpreis und OpenAI-Rückzieher belasten die Wall Street',
      summary: [
        'Die Wall Street schloss am Montag im Minus. dpa-AFX nannte den Ölpreisanstieg und KI-Nachrichten als Belastung. OpenAI strich die Veröffentlichung eines neuen KI-Modells.',
        'Der US Tech 100 fiel um 1,05 Prozent, der US 30 nur um 0,63 Prozent. SoftBank Group ist laut einem Bericht so stark auf OpenAI gesetzt, dass dies die eigene Existenz gefährdet.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein technologielastiger Index reagiert auf KI-Nachrichten stärker als ein breiter gestreuter Index mit weniger Technologiewerten.',
      relatedTopics: ['risiko-und-rendite', 'aktie'],
      relatedSymbols: ['nasdaq-100', 'dow-jones'],
      sources: [
        {
          label: 'onvista.de, News-Ticker vom 28.09.2026, 20:32 Uhr',
          url: 'https://www.onvista.de/news/',
        },
        {
          label: 'onvista.de, News-Ticker vom 28.09.2026, 22:56 Uhr',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Indiens Goldimporte brechen ein, Silber bleibt gefragt',
      summary: [
        'Indiens Goldimporte sanken im August um 57,75 Prozent auf 2,3 Milliarden Dollar. Die Silberimporte des Landes stiegen im selben Monat um 127 Prozent.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Importstatistiken zeigen physische Nachfrage in einem einzelnen Markt, nicht die weltweite Preisbildung der Edelmetalle.',
      relatedTopics: ['rohstoffe', 'portfolio-aufbau'],
      relatedSymbols: ['gold', 'silber'],
      sources: [
        {
          label: 'goldreporter.de, Meldung vom 28.09.2026',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Boeing fällt ans Dow-Ende, JPMorgan hält an Kursziel fest',
      summary: [
        "Ein Software-Problem verzögert die Zulassung einer neuen Boeing-Variante. Die Aktie fiel ans Ende des Dow Jones. JPMorgan beließ Boeing dennoch auf 'Overweight', Kursziel 290 Dollar.",
      ],
      category: 'Märkte',
      whyItMatters:
        'Boeing zählt zu den höchstpreisigen Aktien im preisgewichteten Dow Jones und bewegt den Index deshalb überproportional.',
      relatedTopics: ['aktie', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['boeing', 'dow-jones'],
      sources: [
        {
          label: 'onvista.de, News-Ticker vom 28.09.2026, 23:30 Uhr',
          url: 'https://www.onvista.de/news/',
        },
        {
          label: 'wallstreet-online.de, Nachrichten vom 28.09.2026',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
