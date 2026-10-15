/**
 * Die Zahlenkarten – je Erscheinungstag eine, abgestimmt **bevor** sie hier
 * steht.
 *
 * Ablauf (Anordnung des Betreibers vom 15.10.2026, beschrieben in
 * `INSTAGRAM.md`): Thema aus den Vorschlägen gewählt → Karte hier eingetragen
 * → Entwurf um 16 Uhr im Chat → Freigabe → bis 17 Uhr im Kanal über
 * `instagram-zahlenkarte.yml`. Gesetzt wird die Karte von
 * `lib/instagram-zahlenkarte.ts`, ausgeliefert unter `/instagram/zahlenkarte.jpg`.
 *
 * **Jede Zahl mit Quelle und Stand.** Was hier steht, geht unter dem Namen
 * IM Invests hinaus – dieselbe Regel wie für die Nachrichten.
 */
import type { Zahlenkarte } from '../lib/instagram-zahlenkarte.ts'

export const zahlenkarten: Zahlenkarte[] = [
  {
    /*
      Thema gewählt vom Betreiber am 15.10.2026 aus fünf Vorschlägen
      („Wir machen das Thema Wohneigentum").

      Zahlen: data/snapshots/laender.json, Eurostat EU-SILC ilc_lvho02,
      Bezugsjahr 2025 – Anteil der Bevölkerung (Personen, nicht Haushalte)
      in einer Wohnung im Eigentum des eigenen Haushalts, mit und ohne Kredit.
      Deutschland 47,2 % ist der niedrigste Wert aller 30 Länder der Reihe;
      oben Slowakei 93,8, Rumänien 93,2, Kroatien 91,4.
    */
    datum: '2026-10-15',
    titel: [
      { text: 'Nur 47 % der Deutschen' },
      { text: 'wohnen im Eigentum', gruen: true },
    ],
    links: {
      name: 'Deutschland',
      wert: 47.2,
      anzeige: '47,2 %',
      zusatz: 'im Eigentum',
      flagge: ['#000000', '#dd0000', '#ffce00'],
    },
    rechts: {
      name: 'Polen',
      wert: 87.2,
      anzeige: '87,2 %',
      zusatz: 'im Eigentum',
      flagge: ['#ffffff', '#dc143c'],
    },
    differenz: { text: '+40,0', zusatz: 'Prozentpunkte' },
    fusszeile:
      'Stand: 2025 | Quelle: Eurostat, EU-SILC (ilc_lvho02), Anteil der Bevölkerung',
    text:
      'Nur 47 % der Deutschen wohnen in den eigenen vier Wänden – in Polen sind es 87 %. 🏠\n\n' +
      'Deutschland hat die niedrigste Eigentumsquote aller 30 Länder in der Eurostat-Statistik. ' +
      'Mehr als die Hälfte der Menschen hierzulande wohnt zur Miete oder mietfrei. ' +
      'Am oberen Ende stehen die Slowakei, Rumänien und Kroatien mit über 90 %.\n\n' +
      'Gezählt werden Personen, nicht Haushalte – mit und ohne laufenden Kredit.\n' +
      'Quellen: Eurostat, EU-SILC (ilc_lvho02), Stand 2025',
    schlagworte: ['wohneigentum', 'immobilien', 'miete', 'deutschland', 'finanzen'],
  },
]

/** Die jüngste Karte – die, um die es heute geht. */
export function aktuelleZahlenkarte(): Zahlenkarte | null {
  return [...zahlenkarten].sort((a, b) => b.datum.localeCompare(a.datum))[0] ?? null
}
