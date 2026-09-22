import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-22.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-22 00:16 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-22',
  intro:
    'Öl fällt unter 100 Dollar, der Nasdaq 100 erreicht ein Dreimonatshoch, und am Dienstag sprechen Notenbank-Chefin Lagarde und Bundesbank-Präsident Nagel.',
  top: [
    {
      headline: 'Nagel und Lagarde sprechen am Dienstag, dazu mehrere US-Konjunkturdaten',
      summary: [
        'Am Dienstag sprechen laut wallstreet-online um 10:30 Uhr Bundesbank-Präsident und EZB-Ratsmitglied Joachim Nagel und um 14:00 Uhr EZB-Präsidentin Christine Lagarde.',
        'Am Nachmittag folgen der ADP-Beschäftigungsbericht der USA um 14:15 Uhr sowie um 16:00 Uhr das Verbrauchervertrauen der Eurozone und der Richmond-Fed-Index; um 16:05 Uhr spricht Fed-Vertreter John Williams, um 16:20 Uhr Fed-Vizechef Philip Jefferson.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Reden von Notenbankern und mehrere Konjunkturdaten an einem Tag liefern Hinweise auf den künftigen Zinskurs, auch ohne eine Zinsentscheidung an diesem Tag.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'wallstreet-online, Wirtschaftskalender „Wichtige Termine“ und „Kommende Termine“, Stand 22.09.2026',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline:
        'DAX steigt trotz Rückschlag der Union bei der Berlin-Wahl, Vonovia fällt',
      summary: [
        'Der DAX legte am Montag laut onvista kräftig zu, obwohl die Union bei der Wahl in Berlin laut wallstreet-online eine Niederlage erlitt; genaue Ergebniszahlen nennen die Quellen nicht.',
        'Die Vonovia-Aktie gehörte laut dpa-AFX im Zuge der Berlin-Wahl zu den größten Verlierern im DAX; eine Begründung für den Kursrückgang nennt die Meldung nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dass ein Index insgesamt steigt, heißt nicht, dass alle enthaltenen Werte profitieren – politische Ereignisse mit lokalem Bezug können einzelne Branchen treffen, ohne den Gesamtmarkt zu bewegen.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['dax', 'vonovia'],
      sources: [
        {
          label:
            'onvista, Marktberichte, Meldung vom 21.09.2026, 15:55 Uhr, onvista-Redaktion: „Dax Tagesrückblick 21.09.2026: Dax steigt kräftig - Vonovia schwächeln nach Berlin-Wahl“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'onvista, Aktuelle News, dpa-AFX, Meldung vom 21.09.2026, 16:24 Uhr: „AKTIE IM FOKUS 3: Vonovia-Titel nach Berlin-Wahl unter größten Dax-Verlierern“',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Ölpreis fällt unter 100 Dollar, Europas Börsen schließen im Plus',
      summary: [
        'Der Preis für ein Barrel Brent-Öl fiel am Montag laut wallstreet-online um 3,24 Prozent auf 100,08 US-Dollar und damit unter die Marke von 100 Dollar.',
        'dpa-AFX berichtete von klaren Gewinnen an den europäischen Börsen zum Handelsschluss und führte sie auf den sinkenden Ölpreis zurück; die Chevron-Aktie fiel laut Markt Bote am selben Tag um 4,17 Prozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein fallender Ölpreis senkt tendenziell Kosten für energieintensive Unternehmen, schmälert aber gleichzeitig die Erträge von Förderkonzernen – ein und dieselbe Bewegung wirkt deshalb je nach Branche unterschiedlich.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'dax'],
      sources: [
        {
          label:
            'wallstreet-online, Rohstoffnachrichten, Meldung vom 21.09.2026: „Ölpreise weiter unter Druck - Preis für Brent-Öl fällt unter 100 US-Dollar“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'onvista, Aktuelle News, dpa-AFX, Meldung vom 21.09.2026, 16:36 Uhr: „ROUNDUP/Aktien Europa Schluss: Klare Gewinne nach Ölpreisrückgang“',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Nasdaq 100 erreicht dank Tech-Rally ein Dreimonatshoch',
      summary: [
        'An der Wall Street setzten sich die Kursgewinne am Montagabend fort: Der Nasdaq 100 stieg laut dpa-AFX auf ein Dreimonatshoch, zunächst begünstigt vom fallenden Ölpreis, später von starken Technologiewerten.',
        'Der Dow Jones schloss laut wallstreet-online 0,75 Prozent höher, der Nasdaq-Auswahlindex US Tech 100 legte um 2,93 Prozent zu; auch beim S&P 500 und beim Nasdaq Composite berichtete dpa-AFX von Gewinnen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Mehrmonatshoch bei einem technologielastigen Index zeigt, wie viel künftiges Gewinnwachstum Anleger bereits einpreisen – bleibt es aus, kann derselbe Optimismus den Index ebenso schnell wieder drücken.',
      relatedTopics: ['wie-funktioniert-der-markt'],
      relatedSymbols: ['nasdaq-100', 'dow-jones'],
      sources: [
        {
          label:
            'onvista, Index-Analysen, dpa-AFX, Meldung vom 21.09.2026, 18:24 Uhr: „Aktien New York: Erholung dank Ölpreisrückgang - Nasdaq 100 auf Dreimonatshoch“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'wallstreet-online, Kursleiste, Stand 22.09.2026: US 30 52.079,12 (+0,75 %), US Tech 100 30.486,92 (+2,93 %)',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline:
        'Anleiherenditen geben nach, Blick auf ein Treffen zwischen USA und China',
      summary: [
        'Die Renditen von US-Staatsanleihen und Bundesanleihen gaben laut Goldreporter leicht nach; als Grund nennt die Quelle die Aufmerksamkeit der Märkte für ein bevorstehendes Treffen zwischen den USA und China, ohne ein genaues Datum zu nennen.',
        'Der Goldpreis notierte laut wallstreet-online zuletzt bei 4.366,48 US-Dollar je Feinunze, ein Plus von 0,53 Prozent; bei finanzen.net stand der Preis zur gleichen Stunde bei 4.375 Dollar, ein Plus von 0,7 Prozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Sinkende Anleiherenditen machen zinslose Anlagen wie Gold tendenziell attraktiver, weil die Opportunitätskosten des Goldbesitzes sinken.',
      relatedTopics: ['staatsanleihe'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'Goldreporter, Top-News, Meldung vom 22.09.2026: „Marktzinsen sinken leicht – Blicke auf USA-China-Gipfel gerichtet“',
          url: 'https://www.goldreporter.de/',
        },
        {
          label:
            'wallstreet-online, Aktuelle Rohstoffpreise, Stand 22.09.2026: Gold 4.366,48 USD (+0,53 %)',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [],
}
