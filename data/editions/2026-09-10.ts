import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-10.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-10 04:33 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-10',
  intro:
    'Öl treibt den DAX auf Talfahrt, Gas erreicht eine Marke aus der Energiekrise 2022, und um 14:15 Uhr entscheidet die EZB über die Zinsen.',
  top: [
    {
      headline: 'EZB entscheidet heute um 14:15 Uhr – Kalender zeigt Richtung nach oben',
      summary: [
        'Der Wirtschaftskalender nennt für die heutige EZB-Sitzung Prognosen von 2,65 Prozent beim Hauptrefinanzierungssatz und 2,5 Prozent beim Einlagesatz – beides höher als der bisherige Stand.',
        'Um 8 Uhr liefert die deutsche Inflationsrate von erwarteten 2,9 Prozent zum Vorjahr einen möglichen Hintergrund für den Kurswechsel.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Zeigt, wie ein Wirtschaftskalender schon Stunden vorher andeutet, in welche Richtung eine Zinsentscheidung gehen könnte – ohne dass das Ergebnis feststeht.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label: 'wallstreet-online, Wirtschaftskalender, Abruf 10.09.2026, 00:20 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'DAX rutscht so stark ab wie seit Anfang Juli nicht mehr',
      summary: [
        'Ein Ölpreis über 100 Dollar je Barrel hat dem DAX laut onvista seinen größten Tagesverlust seit Anfang Juli eingebracht.',
        'Zwei Kursleisten nennen für denselben Rückgang mit 1,7 und 1,40 Prozent leicht unterschiedliche Werte.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein hoher Ölpreis wirkt über Energiekosten und Inflationssorgen gleich zweifach auf einen Aktienindex – ein Mechanismus, der sich unabhängig von der exakten Prozentzahl beobachten lässt.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['dax', 'brent'],
      sources: [
        {
          label: 'onvista, Dax Tagesrückblick vom 09.09.2026, 15:55 Uhr',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Wall Street fällt wegen Öl, Meta läuft trotzdem nach oben',
      summary: [
        'Dow Jones, S&P 500 und NASDAQ Composite schlossen laut dpa-AFX niedriger, belastet vom hohen Ölpreis.',
        'Zur gleichen Zeit meldete dieselbe Quelle eine Meta-Rally an der Nasdaq – ein einzelner Wert gegen den breiten Trend.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Verdeutlicht, dass ein fallender Gesamtindex und ein steigender Einzelwert am selben Handelstag gleichzeitig wahr sein können, ohne sich zu widersprechen.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['meta', 'nasdaq-100'],
      sources: [
        {
          label: 'onvista, dpa-AFX-Meldung vom 09.09.2026, 20:16 Uhr',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Gaspreis steigt erstmals seit Ende 2022 über 80 Euro',
      summary: [
        'Während der Ölpreis die Schlagzeilen dominierte, kletterte der europäische Gaspreis laut dpa-AFX erstmals seit Ende 2022 über die Marke von 80 Euro.',
        'Erst Anfang September hatte dieselbe Quellenlage das Überschreiten der 70-Euro-Marke gemeldet.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Eine Krisenmarke aus dem Jahr 2022 wird erneut erreicht – unabhängig davon, ob die heutigen Ursachen dieselben sind, lohnt sich ein Blick auf den zweiten großen Energiepreis neben Öl.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['erdgas'],
      sources: [
        {
          label: 'onvista, dpa-AFX-Meldung vom 09.09.2026, 15:34 Uhr',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Apple stellt erstes faltbares iPhone vor – Aktie zuvor im Minus',
      summary: [
        'Apple hat laut mehreren Ticker-Meldungen sein erstes faltbares iPhone-Modell offiziell vorgestellt.',
        'Kurz zuvor notierte die Aktie noch leicht im Minus – ein möglicher Hinweis darauf, dass die Ankündigung bereits erwartet und damit eingepreist war.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, dass selbst ein historisch erstes Produkt eine Aktie nicht automatisch steigen lässt, wenn der Markt das Ereignis schon vorher erwartet hat.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['apple'],
      sources: [
        {
          label: 'wallstreet-online, dpa-AFX-Meldung vom 09.09.2026',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Booking verliert Gerichtsstreit um eTraveli-Übernahme',
      summary: [
        'Booking Holdings hat laut Ticker-Meldung eine Niederlage vor Gericht im Streit um die Übernahme von eTraveli kassiert.',
        'Die Aktie reagierte darauf deutlich leichter – Details zum Gericht oder zum weiteren Ablauf nennt die Quelle nicht.',
      ],
      category: 'Steuern & Recht',
      whyItMatters:
        'Zeigt, wie ein einzelner Gerichtsbeschluss eine bereits eingeleitete Übernahme wieder in Frage stellen und den Kurs kurzfristig belasten kann.',
      relatedTopics: ['aktie'],
      relatedSymbols: [],
      sources: [
        {
          label: 'finanzen.net, News-Ticker vom 09.09.2026',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
}
