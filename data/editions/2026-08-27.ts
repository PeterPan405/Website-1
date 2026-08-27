import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-27.
 *
 * **Von Hand geschrieben, nicht vom nächtlichen Lauf.** In der Nacht auf den
 * 27. August hat GitHub den ganzen Zeitplan zwischen 00:00 und 02:00 UTC
 * verworfen: `quellen-pruefen`, `nachrichten-agent` (alle drei Anläufe) und
 * `nachrichten.yml` zur Hauptzeit sind nie gestartet. Die beiden
 * Rückfalltermine um 02:12 und 02:16 UTC liefen und brachen rot ab – ohne
 * Entwurf des Agenten und ohne `ANTHROPIC_API_KEY` gibt es keine Ausgabe, und
 * das ist so gewollt.
 *
 * `quellen-sammeln.yml` lief um 02:12 UTC durch. Die Quellenlage von heute lag
 * also vor; geschrieben ist diese Ausgabe aus genau diesem Text.
 *
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-27 02:12 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-27',
  intro:
    'Nvidia meldet Rekordzahlen und die Aktie gibt trotzdem nach, der DAX hält sich, die Wall Street schließt tiefer – dazu Gold über 4.600 Dollar.',
  top: [
    {
      headline: 'Nvidia übertrifft die Erwartungen – und die Aktie fällt trotzdem',
      summary: [
        'Nach Handelsschluss meldete Nvidia laut mehreren Tickern einen Quartalsumsatz von 96 Milliarden US-Dollar und rund 60 Milliarden US-Dollar Gewinn.',
        'Die Erwartungen wurden damit übertroffen; eine Meldung von 20:42 Uhr hält fest, dass die Aktie dennoch leicht im Minus notierte.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Kurs reagiert nicht auf die Zahl, sondern auf den Abstand zur Erwartung – und die war vor diesem Termin außergewöhnlich hoch gesteckt.',
      relatedTopics: ['aktie', 'anlegerpsychologie'],
      relatedSymbols: ['nvidia'],
      sources: [
        {
          label:
            'onvista, Index-Analysen vom 26.8.2026, 20:42 Uhr: „Quartalszahlen Q2/2026 – Nvidia schlägt Erwartungen – Aktie leicht im Minus“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'wallstreet-online.de, Nachricht vom 26.8.2026: „96 Milliarden US-Dollar Umsatz: Nvidia knackt erneut Rekorde“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'DAX beendet den Handel stabil, die Wall Street gibt nach',
      summary: [
        'Der DAX hielt laut Tagesrückblick einen kleinen Gewinn, während die US-Börsen vor den Nvidia-Zahlen stagnierten und letztlich tiefer schlossen.',
        'Am Morgen darauf steht der DAX bei 26.293 Punkten, der US-Tech-100 bei 29.224 und der US-30 bei 53.472 Zählern.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zwei Börsen laufen am selben Tag auseinander, weil sie zu verschiedenen Zeiten schließen – der DAX war längst fertig, als in New York noch gehandelt wurde.',
      relatedTopics: ['boerse', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dax', 'dow-jones'],
      sources: [
        {
          label:
            'finanzen.net, „Heute im Fokus“ vom 26.8.2026: „Tag der NVIDIA-Bilanz: DAX beendet Handel stabil – Wall Street letztlich tiefer“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label:
            'wallstreet-online.de, Kurstafel, Abruf 27.8.2026, 02:12 Uhr GMT: DAX 26.293,36 (+0,08 %), US Tech 100 29.224,19, US 30 53.472,15',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Gold steht über 4.600 Dollar – die 200-Tage-Linie rückt in den Blick',
      summary: [
        'Die Kurstafel weist den Goldpreis am Morgen mit 4.641,35 US-Dollar je Feinunze aus, ein Plus von 1,04 Prozent.',
        'Goldreporter schreibt am 26. August von einem kräftigen Kursanstieg im August und nennt die 200-Tage-Linie als erneut wichtige Unterstützung.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Für Anleger im Euroraum hat ein Goldpreis zwei Ursachen: den Dollarpreis und den Wechselkurs. Bei EUR/USD 1,1659 fällt der zweite Teil derzeit deutlich ins Gewicht.',
      relatedTopics: ['rohstoffe', 'waehrungen-wechselkurse'],
      relatedSymbols: ['gold', 'eur-usd'],
      sources: [
        {
          label:
            'Goldreporter, 26. August 2026: „Goldpreis: 200-Tage-Linie nach August-Rally erneut im Fokus“',
          url: 'https://www.goldreporter.de/',
        },
        {
          label:
            'wallstreet-online.de, Kurstafel, Abruf 27.8.2026, 02:12 Uhr GMT: Gold 4.641,35 (+1,04 %), EUR/USD 1,16587',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Der Ölpreis zieht nach einer Einigung zwischen Iran und Oman an',
      summary: [
        'Eine Meldung vom 26. August führt den steigenden Ölpreis auf eine Einigung zwischen Iran und Oman zurück.',
        'Die Kurstafel weist Brent am Morgen mit 86,56 US-Dollar aus, ein Plus von 0,94 Prozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Ölpreis reagiert auf Politik schneller als auf Angebot und Nachfrage – eine Vereinbarung ändert die Erwartung, bevor ein einziges Fass mehr fließt.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'wallstreet-online.de, Nachricht vom 26.8.2026: „Ölpreis klettert wieder nach Einigung zwischen Iran und Oman“; Kurstafel, Abruf 27.8.2026, 02:12 Uhr GMT: Brent 86,56 (+0,94 %)',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Bei Volkswagen laufen Krisengespräche',
      summary: [
        'Eine Agenturmeldung von 01:30 Uhr berichtet über Krisengespräche bei Volkswagen und über die Forderung nach einer Zukunftsperspektive.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Konzern im Umbau ist ein Einzelwertrisiko in Reinform: Was hier verhandelt wird, betrifft Beschäftigte und Aktionäre – und einen Index nur zu einem Bruchteil.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['volkswagen'],
      sources: [
        {
          label:
            'onvista, Agentur-Meldung (dpa-AFX) vom 27.8.2026, 01:30 Uhr: „Krisengespräche bei VW – Forderung nach Zukunftsperspektive“',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'UBS stuft SAP herab',
      summary: [
        'Ein Analysebeitrag vom 26. August, 15:18 Uhr, nimmt Bezug auf ein Downgrade der UBS für die SAP-Aktie.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Analystenurteil ist eine Meinung mit Kursziel, keine Nachricht über das Unternehmen. Es bewegt den Kurs trotzdem – weil andere darauf reagieren.',
      relatedTopics: ['aktie', 'anlegerpsychologie'],
      relatedSymbols: ['sap'],
      sources: [
        {
          label:
            'onvista, Aktien-Analysen vom 26.8.2026, 15:18 Uhr: „Nach UBS-Downgrade würde ich bei SAP Gewinne sichern“',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Im nordrhein-westfälischen Einzelhandel steht eine Tarifeinigung',
      summary: [
        'Eine Agenturmeldung von 22:01 Uhr meldet einen Durchbruch in den Tarifverhandlungen des Einzelhandels in Nordrhein-Westfalen.',
      ],
      category: 'Vorsorge',
      whyItMatters:
        'Für das eigene Sparen zählt nicht der Lohn, sondern was nach der Inflation davon übrig bleibt – ein Tarifabschluss ist erst dann eine Erhöhung, wenn er die Teuerung schlägt.',
      relatedTopics: ['inflation', 'budget-und-sparquote'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'onvista, Agentur-Meldung (dpa-AFX) vom 26.8.2026, 22:01 Uhr: „Tarifeinigung in NRW – Durchbruch im Einzelhandel“',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
  ],
}
