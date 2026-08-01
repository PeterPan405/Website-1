import type { DailyEdition } from './types'

/**
 * Ausgabe vom 1. August 2026.
 *
 * Ein Monatswechsel, und damit ein Tag, an dem dieselben Kurse zwei
 * verschiedene Geschichten erzählen: Der Freitag schloss im Plus, der Juli
 * im Minus. Fast alle Meldungen dieser Ausgabe handeln davon, dass eine Zahl
 * ohne ihren Bezugsrahmen unvollständig ist – beim Zeitraum, beim Index, beim
 * Liefermonat eines Ölkontrakts und bei der Frage, ob eine Schätzung die erste
 * oder die zweite ist.
 *
 * Zur Quellenlage: Die Vorabprüfung meldete an diesem Morgen **alle sechs
 * Rubriken ohne brauchbare Quelle** – achtzehn Adressen, keine mit lesbarem
 * Text von heute. Was hier steht, stammt deshalb aus einzeln geholten
 * Artikelseiten, nicht aus den gepflegten Rubrikseiten. Gold und Kryptowährungen
 * fehlen in dieser Ausgabe, weil sich dazu keine Seite abrufen ließ, die mehr
 * als ihr eigenes Menü zurückgab.
 */
export const edition: DailyEdition = {
  date: '2026-08-01',
  intro:
    'Der letzte Handelstag im Juli endet im Plus, der Monat selbst im Minus. Dazu Öl mit zwei Preisen, die höchste US-Rendite seit 2007 und ein fester Yen.',
  top: [
    {
      headline: 'Wall Street schließt den Juli: starker Freitag, schwacher Monat',
      summary: [
        'Am letzten Handelstag des Juli stiegen alle drei großen US-Indizes: der S&P 500 um 0,7 Prozent auf 7.489,72 Punkte, der Dow Jones Industrial um 0,53 Prozent auf 52.485,03 und der Nasdaq Composite um 1 Prozent auf 25.373,85. Amazon legte nach Quartalszahlen 15 Prozent zu, Apple verlor über 7 Prozent.',
        'Für den Monat sieht die Rechnung anders aus. Der S&P 500 verlor im Juli 0,1 Prozent, der Nasdaq Composite 3,2 Prozent; nur der Dow schloss mit plus 0,3 Prozent und damit im vierten Monat in Folge im Plus.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Tag, Woche, Monat und Jahr ergeben zu denselben Kursen vier verschiedene Zahlen, und Schlagzeilen nennen meist nur eine davon. Wer eine Prozentangabe liest, sucht zuerst den Anfangspunkt – ohne ihn beschreibt sie eine Strecke, von der nur ein Ende bekannt ist.',
      relatedTopics: ['boerse', 'wie-funktioniert-der-markt', 'risiko-und-rendite'],
      relatedSymbols: ['sp500', 'nasdaq-100', 'dow-jones'],
      sources: [
        {
          label:
            'CNBC: „S&P 500 closes higher Friday as Amazon surges; Dow posts fourth straight winning month“ (Live-Blog, 31. Juli 2026)',
          url: 'https://www.cnbc.com/2026/07/30/stock-market-today-live-updates.html',
        },
        {
          label:
            'The Associated Press / The Epoch Times: „How Major US Stock Indexes Fared July 31“ (31. Juli 2026)',
          url: 'https://www.theepochtimes.com/bright/how-major-us-stock-indexes-fared-july-31-post-6070080',
        },
      ],
    },
    {
      headline: 'Dreißigjährige US-Rendite bei 5,25 Prozent – Höchststand seit 2007',
      summary: [
        'Die Rendite dreißigjähriger US-Staatsanleihen erreichte in dieser Woche den höchsten Stand seit 2007 und lag am Freitag rund vier Basispunkte höher bei 5,25 Prozent. Die zehnjährige Anleihe überschritt 4,7 Prozent, so viel wie zuletzt im Januar 2025.',
        'Als Grund nennt der Bericht Zweifel der Anleger an der Entschlossenheit der US-Notenbank im Kampf gegen die Inflation. Deren Vorsitzender Kevin Warsh sagte in dieser Woche, man habe keinen Zauberstab.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Steigende Renditen heißen fallende Anleihekurse – beides ist dieselbe Bewegung, von zwei Seiten betrachtet. Für Aktien ist die Anleiherendite zugleich der Maßstab: Je mehr es risikolos gibt, desto weniger ist ein Gewinn wert, der erst in Jahren anfällt.',
      relatedTopics: ['staatsanleihe', 'schuldverschreibung', 'risiko-und-rendite'],
      relatedSymbols: ['sp500'],
      sources: [
        {
          label:
            'CNBC: „S&P 500 closes higher Friday as Amazon surges; Dow posts fourth straight winning month“ (Live-Blog, 31. Juli 2026)',
          url: 'https://www.cnbc.com/2026/07/30/stock-market-today-live-updates.html',
        },
      ],
    },
    {
      headline: 'Inflation im Euroraum steigt im Juli auf 2,9 Prozent',
      summary: [
        'Nach einer ersten Schätzung von Eurostat lagen die Verbraucherpreise im Euroraum im Juli 2,9 Prozent über dem Vorjahresmonat, nach 2,8 Prozent im Juni. Volkswirte hatten den Anstieg im Schnitt erwartet; Treiber waren vor allem die wieder höheren Energiepreise.',
        'Am selben Tag meldete Italien für Juli ebenfalls 2,9 Prozent – dort allerdings nach 3,0 Prozent im Juni, also mit umgekehrtem Vorzeichen der Bewegung.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Der Euroraum ist eine Währungsunion, keine Preisunion: Die gemeldete Rate ist ein gewichteter Durchschnitt, den kein einzelnes Land treffen muss. Die eigene Kaufkraft hängt am nationalen Warenkorb, die Zinsen am europäischen Mittel – diese beiden Zahlen fallen regelmäßig auseinander.',
      relatedTopics: ['inflation', 'notenbanken-geldpolitik'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'dpa-AFX über onvista: „Überblick: KONJUNKTUR vom 31.07.2026 – 17.15 Uhr“ (31. Juli 2026)',
          url: 'https://www.onvista.de/news/2026/07-31-dpa-afx-ueberblick-konjunktur-vom-31-07-2026-17-15-uhr-0-10-26538472',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Bank of Japan hält bei 1,0 Prozent, der Yen wertet auf',
      summary: [
        'Die japanische Zentralbank ließ den Leitzins unverändert bei 1,0 Prozent – dem höchsten Stand seit 31 Jahren – und gab Hinweise auf eine weitere Erhöhung. Der Dollar notierte am Freitag nahe 158,15 Yen und verlor in der Woche 3,3 Prozent gegenüber der japanischen Währung, den stärksten Wochenrückgang seit Juli 2024.',
        'Der UBS-Ökonom Paul Donovan geht davon aus, dass das japanische Finanzministerium in dieser Woche am Devisenmarkt eingegriffen hat, um den Yen zu stützen.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Wer einen Welt-ETF oder japanische Aktien hält, hält immer auch eine Yen-Position. Ein Kursgewinn in Tokio kann im Euro-Depot verschwinden, ohne dass ein Unternehmen etwas dafür getan hätte.',
      relatedTopics: ['waehrungen-wechselkurse', 'notenbanken-geldpolitik'],
      relatedSymbols: ['eur-jpy', 'nikkei-225'],
      sources: [
        {
          label:
            'dpa-AFX über onvista: „Überblick: KONJUNKTUR vom 31.07.2026 – 17.15 Uhr“ (31. Juli 2026)',
          url: 'https://www.onvista.de/news/2026/07-31-dpa-afx-ueberblick-konjunktur-vom-31-07-2026-17-15-uhr-0-10-26538472',
        },
        {
          label:
            'CNBC: „S&P 500 closes higher Friday as Amazon surges; Dow posts fourth straight winning month“ (Live-Blog, 31. Juli 2026)',
          url: 'https://www.cnbc.com/2026/07/30/stock-market-today-live-updates.html',
        },
      ],
    },
    {
      headline: 'Öl beendet einen Monat zwischen 70 und über 100 Dollar bei 88,14',
      summary: [
        'Ein Barrel Brent zur Lieferung im September kostete am Freitag 88,14 US-Dollar und damit ein Prozent weniger als am Vortag. In den Monat gestartet war die Notierung bei etwa 70 Dollar; zeitweise lag sie im Juli über 100 Dollar.',
        'Rohstoffexperten der Commerzbank verwiesen auf Bloomberg-Daten, wonach in dieser Woche täglich rund 6,5 Millionen Barrel über Bab al-Mandab, die Straße von Hormus und den Suezkanal transportiert wurden. Eine Entwarnung sei das nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die Spannweite eines Zeitraums sagt mehr über das Risiko als die Differenz zwischen Anfang und Ende. Ein Monat, der von 70 über 100 auf 88 führt, sieht in der Bilanz nach einem soliden Plus aus und war für jeden, der darin gehandelt hat, etwas völlig anderes.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'APA/dpa-AFX über Energynewsmagazine: „Ölpreise geben weiter nach“ (31. Juli 2026)',
          url: 'https://www.energynewsmagazine.at/2026/07/31/oelpreise-geben-weiter-nach/',
        },
      ],
    },
    {
      headline: 'US-Konsumklima steigt in der zweiten Schätzung auf 55,2 Punkte',
      summary: [
        'Das von der Universität Michigan erhobene Konsumklima stieg im Juli laut der zweiten Schätzung um 5,7 Punkte auf 55,2 Punkte. Volkswirte hatten eine Revision auf 54,0 Punkte erwartet; die erste Schätzung hatte 54,4 Punkte ergeben. Trüber als vor einem Jahr ist die Stimmung dennoch.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Revision ist keine Korrektur eines Fehlers: Die erste Schätzung beruht auf einem Teil der Antworten, die zweite auf allen. Und ein Stimmungsindex misst, was Menschen sagen – nicht, was sie kaufen.',
      relatedTopics: ['anlegerpsychologie', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['sp500'],
      sources: [
        {
          label:
            'dpa-AFX über onvista: „Überblick: KONJUNKTUR vom 31.07.2026 – 17.15 Uhr“ (31. Juli 2026)',
          url: 'https://www.onvista.de/news/2026/07-31-dpa-afx-ueberblick-konjunktur-vom-31-07-2026-17-15-uhr-0-10-26538472',
        },
      ],
    },
  ],
}
