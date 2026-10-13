import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-13.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-13 01:33 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-13',
  intro:
    'Drei Notenbanker sprechen, Deutschlands Inflation wird bestätigt, und am Rohstoffmarkt laufen Öl und Edelmetalle auseinander.',
  top: [
    {
      headline: 'Drei Notenbanker sprechen am Dienstag, deutsche Inflation im Fokus',
      summary: [
        'Der Dienstag ist dicht getaktet. Um 5 Uhr spricht ein Mitglied der Bank of England. Die EZB folgt um 9:15 Uhr, die US-Notenbank Fed um 9:45 Uhr.',
        'Um 8 Uhr veröffentlicht Deutschland seine endgültigen Verbraucherpreise für September. Die Prognose liegt bei 3,3 Prozent, genauso wie im Vormonat. In den Niederlanden soll die Inflation dagegen von 3,3 auf 3,4 Prozent steigen.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Wenn die tatsächlichen Zahlen von der Prognose abweichen, reagieren Anleihen und der Euro oft stärker als auf die Inflation selbst.',
      relatedTopics: ['notenbanken-geldpolitik', 'inflation'],
      relatedSymbols: ['eur-usd', 'dax'],
      sources: [
        {
          label: 'wallstreet-online, Wirtschaftskalender, Stand 13.10.2026, 01:33 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Öl steigt auf 106 Dollar, Gold und Silber geben nach',
      summary: [
        'Der Ölpreis zieht an. Brent kostet in der Nacht zum Dienstag 105,97 Dollar, ein Plus von 1,99 Prozent.',
        'Gold und Silber bewegen sich gegenläufig. Die Feinunze Gold kostet 4.153 Dollar, 0,44 Prozent weniger als zuvor. Silber fällt um 0,83 Prozent auf 60,33 Dollar. Laut Goldreporter bleiben die Anleiherenditen in Frankreich hoch, was auch den Goldpreis unter Druck hält.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dass Öl steigt und Edelmetalle gleichzeitig nachgeben, zeigt: Rohstoffe folgen nicht immer demselben Signal, selbst wenn Anleger sie beide als Absicherung nutzen.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'gold', 'silber'],
      sources: [
        {
          label:
            'wallstreet-online, Rohstoffpreise, Stand 13.10.2026, kurz nach 3 Uhr MESZ: Brent 105,97 USD (+1,99 %), Gold 4.153,37 USD (-0,44 %), Silber 60,33 USD (-0,83 %)',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'goldreporter.de, Top-News vom 12.10.2026: „Anleihezinsen bleiben hoch: Frankreich unter Druck – Gold kämpft um 4.200 USD“',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline: 'Dow im Plus, Technologiewerte unter Druck vor der Berichtssaison',
      summary: [
        'An der Wall Street ziehen zwei Indizes in verschiedene Richtungen. Am Montag schloss der Dow Jones im Plus. Technologiewerte gaben vor der anlaufenden Berichtssaison nach, meldete die Nachrichtenagentur dpa-AFX.',
        'Am frühen Dienstagmorgen zeigte sich das Bild erneut. Der Dow-Jones-Future notierte 0,29 Prozent höher bei 51.835 Punkten, der Nasdaq 100 lag 0,70 Prozent im Minus bei 30.671 Punkten.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Dow bildet nur 30 große Standardwerte ab, der Nasdaq 100 ist technologieschwer – deshalb können beide Indizes am selben Tag in unterschiedliche Richtungen laufen.',
      relatedTopics: ['wie-funktioniert-der-markt'],
      relatedSymbols: ['dow-jones', 'nasdaq-100'],
      sources: [
        {
          label:
            'onvista, News-Ticker vom 12.10.2026, 20:22 Uhr und 20:35 Uhr (dpa-AFX): „Aktien New York Schluss: Techwerte vor Berichtssaison unter Druck – Dow legt zu“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'wallstreet-online, Kursleiste, Stand 13.10.2026, 01:33 Uhr: US 30 51.835,63 Pkt. (+0,29 %), US Tech 100 30.670,97 Pkt. (-0,70 %)',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'US-Midterms: BofA sieht für Aktien ein Entweder-oder',
      summary: [
        'Am 3. November wählt die USA einen neuen Kongress. Die Bank of America rechnet laut einem Bericht von wallstreetONLINE je nach Machtverteilung mit zweistelligen Kursgewinnen oder einem heftigen Rückschlag für Aktien. Weitere Details nannte die Zusammenfassung nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Börsen beginnen solche Unsicherheiten oft schon Wochen vor der eigentlichen Wahl einzupreisen, nicht erst am Tag des Ergebnisses.',
      relatedTopics: ['risiko-und-rendite'],
      relatedSymbols: ['dow-jones'],
      sources: [
        {
          label:
            'wallstreet-online, Startseite „Nachrichten: Aktien & Indizes“, Stand 13.10.2026: „Die US-Midterms könnten für Anleger zur Zerreißprobe werden“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Dax erholt sich weiter, Rüstungswerte bleiben gefragt',
      summary: [
        'Der Dax setzt seine Erholung fort. Der Leitindex startete die Woche im Plus und erreichte am Montagvormittag rund 25.260 Punkte, laut einer Chartanalyse von onvista.',
        'Besonders gefragt waren laut onvista Rheinmetall und Nordex. Weitere Einzelheiten zu den Kursbewegungen nannte die Quelle nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Dax ist ein Performanceindex und rechnet Dividenden automatisch wieder ein – das unterscheidet ihn von reinen Kursindizes wie dem Dow Jones.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['dax', 'rheinmetall'],
      sources: [
        {
          label:
            'onvista, Dax Chartanalyse vom 12.10.2026, 08:25 Uhr: „Dax setzt seine Erholung fort und erreicht 25.260 Punkte“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'onvista, Dax Tagesrückblick vom 12.10.2026, 15:44 Uhr: „Leitindex startet Woche im Plus – Rüstung gefragt“',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
  ],
}
