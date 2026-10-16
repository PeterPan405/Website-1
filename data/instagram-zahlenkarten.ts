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
      Thema: keine Wahl des Betreibers für den 16.10. – laut Ablauf der erste
      offene Vorschlag vom 15.10. („US-Inflation springt auf 3,7 %").

      Zahlen:
        3,7 %  US-Verbraucherpreise September, gegenüber Vorjahr – Handelsblatt
               und CNBC vom 14.10.2026, so in data/news.ts
               (us-inflation-september-ueberrascht-notenbank)
        2,0 %  Inflationsziel der US-Notenbank – im selben Artikel
        3,6 %  Prognose, 3,4 % Vormonat – ForexFactory, „CPI y/y" vom
               14.10.2026 (tests/fixtures/forexfactory-2026-10-16.json)
      Geprüft in tests/instagram-zahlenkarte.test.ts.
    */
    datum: '2026-10-16',
    titel: [
      { text: 'US-Inflation:' },
      { text: 'fast doppelt so hoch wie das Ziel', gruen: true },
    ],
    links: {
      name: 'Ziel der Fed',
      wert: 2,
      anzeige: '2,0 %',
      zusatz: 'Inflationsziel',
    },
    rechts: {
      name: 'US-Inflation',
      wert: 3.7,
      anzeige: '3,7 %',
      zusatz: 'im September',
    },
    differenz: { text: '+1,7', zusatz: 'Prozentpunkte' },
    fusszeile:
      'Stand: September 2026 | Quellen: Handelsblatt, CNBC (14.10.2026), ForexFactory',
    text:
      'Die US-Inflation liegt bei 3,7 % – fast doppelt so hoch wie das Ziel der US-Notenbank von 2 %. 📈\n\n' +
      'Die Verbraucherpreise sind im September stärker gestiegen als erwartet: Die Prognose lag bei 3,6 %, im August waren es 3,4 %. ' +
      'An den Anleihemärkten zogen die Renditen unmittelbar nach der Veröffentlichung an.\n\n' +
      'Quellen: Handelsblatt, CNBC (14.10.2026), ForexFactory (Prognose und Vormonat)',
    schlagworte: ['inflation', 'usa', 'fed', 'börse', 'finanzen'],
    titelbild: 'fed',
  },
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
    art: 'rangliste',
    datum: '2026-10-15',
    /*
      Freigegeben vom Betreiber am 15.10.2026 („so passt es", Entwurf 4).
      Nachgetragen um 17:06, als er fragte „wo bleibt der von heute" – die
      Karte war um 08:59 von Hand hinausgegangen, noch ohne dieses Feld.
      Steht sie noch im Kanal, hält der Veröffentlicher an (Riegel 4).
    */
    freigabe: '2026-10-15',
    /*
      Erster Entwurf: zwei Balken, Deutschland gegen Polen. Der Betreiber:
      „mache mehrere Länder in den Vergleich, es muss auch nicht immer so ein
      Balkendiagramm sein". Jetzt eine Auswahl aus den 30 Ländern – nur
      solche, deren Flagge sich im Kreis erkennen lässt (Kroatien mit seinem
      Schachbrett nicht), oben der Spitzenreiter, unten Deutschland als
      Schlusslicht, dazwischen der EU-Schnitt (EU27_2020, 68,5).
    */
    titel: [
      { text: 'Deutschland ist' },
      { text: 'Europas Land der Mieter', gruen: true },
    ],
    unterzeile: 'Von 10 Menschen wohnen so viele im Eigentum:',
    zeilen: [
      { name: 'Slowakei', wert: 93.8, land: 'SVK' },
      { name: 'Rumänien', wert: 93.2, land: 'ROU' },
      { name: 'Ungarn', wert: 89.8, land: 'HUN' },
      { name: 'Polen', wert: 87.2, land: 'POL' },
      { name: 'Italien', wert: 77.1, land: 'ITA' },
      { name: 'Spanien', wert: 73.6, land: 'ESP' },
      { name: 'Belgien', wert: 70.9, land: 'BEL' },
      { name: 'EU-Schnitt', wert: 68.5, land: 'EU27', schnitt: true },
      { name: 'Frankreich', wert: 61.4, land: 'FRA' },
      { name: 'Österreich', wert: 54.2, land: 'AUT' },
      { name: 'Deutschland', wert: 47.2, land: 'DEU', hervor: true },
    ],
    fusszeile:
      'Stand: 2025 | Quelle: Eurostat, EU-SILC (ilc_lvho02) | Auswahl aus 30 Ländern',
    text:
      'Deutschland ist Europas Land der Mieter: Nur 47,2 % der Menschen wohnen in den eigenen vier Wänden. 🏠\n\n' +
      'Das ist der niedrigste Wert aller 30 Länder in der Eurostat-Statistik – der EU-Schnitt liegt bei 68,5 %. ' +
      'Ganz oben stehen die Slowakei mit 93,8 % und Rumänien mit 93,2 %. ' +
      'Auch in Ungarn, Polen, Italien und Spanien wohnt die große Mehrheit im Eigentum.\n\n' +
      'Gezählt werden Personen, nicht Haushalte – mit und ohne laufenden Kredit.\n' +
      'Quellen: Eurostat, EU-SILC (ilc_lvho02), Stand 2025',
    schlagworte: ['wohneigentum', 'immobilien', 'miete', 'deutschland', 'finanzen'],
  },
]

/** Die jüngste Karte – die, um die es heute geht. */
export function aktuelleZahlenkarte(): Zahlenkarte | null {
  return [...zahlenkarten].sort((a, b) => b.datum.localeCompare(a.datum))[0] ?? null
}
