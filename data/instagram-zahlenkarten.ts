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
      Thema gewählt vom Betreiber am 19.10.2026: „Nehmen lieber Öl schlägt
      alles." – statt „SMI schlägt Nasdaq" (Duell), nach dem Vorbild HKCM.
      Form: Balken mit Plus und Minus (am Vortag Verlauf). Farbe: Anthrazit.

      Zahlen: Yahoo Finance, Tagesschlusskurse, abgerufen am 19.10.2026 über
      quellen-holen.yml (Lauf 39277296882). Letzter Schluss 2025 → 16.10.2026:
        Brent (BZ=F)       60,85 →    109,86   +80,54 %
        Nasdaq 100 (^NDX)  25.249,85 → 29.187,55 +15,59 %
        S&P 500 (^GSPC)    6.845,50 →  7.659,44  +11,89 %
        Dax (^GDAXI)       24.490,41 → 25.622,61 +4,62 % (Jahresschluss 30.12.)
        Gold (GC=F)        4.341,10 →  4.181,10  −3,69 %
        Bitcoin (BTC-USD)  87.508,83 → 81.500,80 −6,87 %
        Silber (SI=F)      70,13 →     56,99     −18,73 %
      Rohstoffe als Terminkontrakt in US-Dollar, Indizes in Landeswährung.
      S&P 500 und Dax decken sich mit der Karte vom 19.10.
    */
    art: 'rangliste',
    skala: 'balken',
    datum: '2026-10-20',
    titel: [
      { text: 'Öl schlägt alles:' },
      { text: 'Brent +80,5 % seit Januar', gruen: true },
    ],
    unterzeile: 'Wertentwicklung seit Jahresbeginn:',
    zeilen: [
      { name: 'Öl (Brent)', wert: 80.5, land: 'OEL', hervor: true },
      { name: 'Nasdaq 100', wert: 15.6, land: 'USA' },
      { name: 'S&P 500', wert: 11.9, land: 'USA' },
      { name: 'Dax', wert: 4.6, land: 'DEU' },
      { name: 'Gold', wert: -3.7, land: 'GOLD' },
      { name: 'Bitcoin', wert: -6.9, land: 'BTC' },
      { name: 'Silber', wert: -18.7, land: 'SILBER' },
    ],
    fusszeile:
      'Stand: Schlusskurse 16.10.2026 | Quelle: Yahoo Finance | Rohstoffe und Bitcoin in US-Dollar',
    text:
      'Ein Barrel der Nordseesorte Brent kostete am Freitag 109,86 Dollar – zum Jahresende 2025 waren es 60,85 Dollar. Ein Plus von 80,5 %. 🛢️\n\n' +
      'Kein anderer der großen Werte kommt annähernd heran: Der Nasdaq 100 legte seit Jahresbeginn um 15,6 % zu, der S&P 500 um 11,9 %, der Dax um 4,6 %. ' +
      'Gold liegt 3,7 % im Minus, Bitcoin 6,9 %, Silber sogar 18,7 %.\n\n' +
      'Indizes in Landeswährung, Rohstoffe als Terminkontrakt und Bitcoin in US-Dollar.\n' +
      'Quellen: Yahoo Finance (Schlusskurse vom 16.10.2026 und Jahresschluss 2025)',
    schlagworte: ['öl', 'brent', 'rohstoffe', 'börse', 'investieren'],
  },
  {
    /*
      Thema gewählt vom Betreiber am 19.10.2026 aus drei Vorschlägen („Dax
      gegen S&P 500"). Form: Verlauf – am Vortag Kacheln. Farbe: Rot
      (akzentfarbe('2026-10-19')).

      Zahlen: Kursbestand der Website (Yahoo Finance), getQuotes() –
      Schlusskurse vom Freitag, 16.10.2026, und die Veränderung seit dem
      letzten Schlusskurs 2025 (`ytdPercent`): Dax 25.622,61 Punkte, +4,62 %;
      S&P 500 7.659,44 Punkte, +11,89 %. Jeweils in Landeswährung.
      Geprüft in tests/instagram-zahlenkarte.test.ts.
    */
    /*
      Erster Entwurf: zwei Balken (Vergleich). Der Betreiber: „nein, mit Chart
      vergleich, bissl kreativer werden!!" – jetzt der Verlauf beider Indizes
      seit Jahresbeginn.
    */
    art: 'verlauf',
    datum: '2026-10-19',
    /* Freigegeben vom Betreiber am 19.10.2026: „ja passt" – hinaus ab 16 Uhr. */
    freigabe: '2026-10-19',
    titel: [{ text: 'Dax gegen S&P 500:' }, { text: 'Wall Street vorn', gruen: true }],
    unterzeile: 'Wertentwicklung seit Jahresbeginn, in Prozent:',
    bis: '2026-10-16',
    reihen: [
      { name: 'S&P 500', symbol: 'sp500', land: 'USA', akzent: true, endwert: '+11,9 %' },
      { name: 'Dax', symbol: 'dax', land: 'DEU', endwert: '+4,6 %' },
    ],
    fusszeile:
      'Stand: Schlusskurse 16.10.2026 | Quelle: Yahoo Finance | jeweils in Landeswährung',
    text:
      'Seit Jahresbeginn hat der S&P 500 um 11,9 % zugelegt – der Dax nur um 4,6 %. 📊\n\n' +
      'Der US-Leitindex schloss am Freitag bei 7.659 Punkten, der Dax bei 25.623 Punkten. Der Abstand beträgt 7,3 Prozentpunkte. ' +
      'Beide Werte sind in Landeswährung gerechnet; für Anleger aus dem Euroraum kommt beim S&P 500 die Entwicklung des Dollars hinzu.\n' +
      'Quellen: Yahoo Finance (Schlusskurse vom 16.10.2026 und Jahresschluss 2025)',
    schlagworte: ['dax', 'sp500', 'aktien', 'börse', 'investieren'],
  },
  {
    /*
      Thema gewählt vom Betreiber am 18.10.2026 aus den Vorschlägen
      („Vermögen"), nachdem er „Kinder je Frau" abgelehnt hatte („Nee, lieber
      ein anderes Thema"); dazu: „nehme aber noch ein paar weitere Länder
      dazu". Form: Kacheln – am Vortag waren es Balken.

      Zahlen: data/snapshots/laender.json, `medianvermoegen` – OECD, Wealth
      Distribution Database (Reinvermögen je Haushalt, Median), von der
      Quelle in Landeswährung, mit dem EZB-Referenzkurs zum Ende des
      Erhebungsjahres in US-Dollar umgerechnet. Erhebungsjahre je Land
      verschieden (hier 2016–2023). 30 Länder; Deutschland Platz 19.
      Geprüft in tests/instagram-zahlenkarte.test.ts.
    */
    art: 'rangliste',
    /*
      Freigegeben vom Betreiber am 18.10.2026: „direkt noch danach den
      Vermögensbeitrag" – nach dem neu gemachten Tagesbeitrag.
    */
    freigabe: '2026-10-18',
    skala: 'kacheln',
    einheit: ' $',
    stellen: 0,
    datum: '2026-10-18',
    titel: [{ text: 'Vermögen:' }, { text: 'Italien vor Deutschland', gruen: true }],
    unterzeile: 'Mittleres Vermögen je Haushalt, nach Abzug der Schulden:',
    zeilen: [
      { name: 'Luxemburg', wert: 812822, land: 'LUX' },
      { name: 'Belgien', wert: 297482, land: 'BEL' },
      { name: 'Großbritannien', wert: 246692, land: 'GBR' },
      { name: 'Italien', wert: 195109, land: 'ITA' },
      { name: 'USA', wert: 165700, land: 'USA' },
      { name: 'Frankreich', wert: 154213, land: 'FRA' },
      { name: 'Niederlande', wert: 148733, land: 'NLD' },
      { name: 'Österreich', wert: 144734, land: 'AUT' },
      { name: 'Spanien', wert: 144607, land: 'ESP' },
      { name: 'Deutschland', wert: 120795, land: 'DEU', hervor: true },
      { name: 'Polen', wert: 63085, land: 'POL' },
      { name: 'Lettland', wert: 38386, land: 'LVA' },
    ],
    fusszeile: 'Stand: 2016–2023 | Quelle: OECD (Reinvermögen, Median) | in US-Dollar',
    text:
      'Ein mittlerer Haushalt in Deutschland besitzt nach Abzug aller Schulden 120.795 Dollar – in Italien sind es 195.109 Dollar. 💶\n\n' +
      'Auch in Spanien (144.607), Österreich (144.734), den Niederlanden (148.733), Frankreich (154.213) und den USA (165.700) liegt das mittlere Vermögen höher. ' +
      'Belgien kommt auf 297.482, Großbritannien auf 246.692 Dollar. An der Spitze steht Luxemburg mit 812.822 Dollar; Polen (63.085) und Lettland (38.386) liegen darunter. ' +
      'Unter den 30 Ländern der OECD-Statistik steht Deutschland auf Platz 19.\n\n' +
      'Gezählt wird der Median – der Haushalt in der Mitte, nicht der Durchschnitt, den wenige Reiche nach oben ziehen. Zum Vergleich: In Deutschland wohnen nur 47,2 % der Menschen im Eigentum, so wenige wie in keinem anderen Land der Eurostat-Statistik (2025). ' +
      'Die Erhebungsjahre liegen je Land zwischen 2016 und 2023, umgerechnet zum EZB-Kurs am Jahresende; Haushalte sind je Land verschieden groß.\n' +
      'Quellen: OECD, Wealth Distribution Database; Europäische Zentralbank (Umrechnung); Eurostat (Wohneigentum)',
    schlagworte: ['vermögen', 'geldanlage', 'finanzen', 'deutschland', 'sparen'],
  },
  {
    /*
      Thema gewählt vom Betreiber am 16.10.2026 („Für morgen Thema 1 mit den
      Staatsschulden"), Zuschnitt am 17.10.: „Niedrigstes. Höchstes, so. Und
      vielleicht noch Frankreich, weil die machen Probleme." – also der
      niedrigste und der höchste Wert aller Länder, Frankreich und die vier
      aus dem Vorschlag (Deutschland, USA, Italien, Japan).

      Zahlen: data/snapshots/laender.json, `schuldenquote` – IWF, World
      Economic Outlook (GGXWDG_NGDP), Bruttoschuld des Gesamtstaats in % des
      BIP, Jahr 2025. 188 Länder haben einen Wert für 2025; oben Venezuela
      308,7, unten Liechtenstein 0,5. Eritrea (260,4) stammt aus 2019 und
      zählt nicht mit. Deutschland steht auf Platz 68 von 188.

      Der Schnitt („durchschnittlich noch", Betreiber 17.10.): einfacher
      Mittelwert dieser 188 Werte, 59,8 – nicht nach Wirtschaftskraft
      gewichtet; der gewichtete Weltwert des IWF steht nicht im Bestand.

      Frankreichs „Probleme": Goldreporter, Top-News vom 12.10.2026
      („Anleihezinsen bleiben hoch: Frankreich unter Druck"), so in
      data/news.ts.
      Geprüft in tests/instagram-zahlenkarte.test.ts.
    */
    art: 'rangliste',
    skala: 'balken',
    datum: '2026-10-17',
    /*
      Freigegeben vom Betreiber am 17.10.2026 um 11:49 („perfekt das passt",
      Entwurf 2 mit Länderschnitt). Hinaus geht sie frühestens um 16 Uhr.
    */
    freigabe: '2026-10-17',
    titel: [
      { text: 'Staatsschulden:' },
      { text: 'Wer am tiefsten drinsteckt', gruen: true },
    ],
    unterzeile: 'Schulden des Staates in % der Wirtschaftsleistung:',
    zeilen: [
      { name: 'Venezuela', wert: 308.7, land: 'VEN' },
      { name: 'Japan', wert: 206.5, land: 'JPN' },
      { name: 'Italien', wert: 137.1, land: 'ITA' },
      { name: 'USA', wert: 123.9, land: 'USA' },
      { name: 'Frankreich', wert: 116, land: 'FRA' },
      { name: 'Deutschland', wert: 62.9, land: 'DEU', hervor: true },
      { name: 'Länderschnitt', wert: 59.8, land: 'WELT', schnitt: true },
      { name: 'Liechtenstein', wert: 0.5, land: 'LIE' },
    ],
    fusszeile:
      'Stand: 2025 | Quelle: IWF, World Economic Outlook | Auswahl aus 188 Ländern',
    text:
      'Venezuela schuldet mehr als das Dreifache seiner Wirtschaftsleistung: 308,7 % des BIP – der höchste Wert aller Länder mit Zahlen für 2025. Dahinter folgt Japan mit 206,5 %. 📊\n\n' +
      'Auch Italien (137,1 %), die USA (123,9 %) und Frankreich (116,0 %) liegen über 100 %: Der Staat schuldet dort mehr, als das ganze Land in einem Jahr erwirtschaftet. ' +
      'In Frankreich bleiben die Anleiherenditen zudem hoch. ' +
      'Deutschland kommt auf 62,9 % – Platz 68 von 188 Ländern und knapp über dem Durchschnitt aller Länder von 59,8 %. Am wenigsten Schulden hat Liechtenstein mit 0,5 %.\n\n' +
      'Gezählt wird die Bruttoschuld des Gesamtstaats in der einheitlichen Abgrenzung des IWF; sie weicht von den Maastricht-Zahlen der EU ab. Der Durchschnitt ist der einfache Mittelwert der 188 Länder, nicht nach Wirtschaftskraft gewichtet.\n' +
      'Quellen: IWF, World Economic Outlook (Stand 2025); Goldreporter (12.10.2026) zu Frankreich',
    schlagworte: ['staatsschulden', 'schulden', 'wirtschaft', 'börse', 'finanzen'],
  },
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
    /*
      Freigegeben vom Betreiber am 16.10.2026: „Ja, das passt" – die Karte,
      nicht das Titelbild davor („das andere nicht"). Der Tagesbeitrag bleibt
      eine Seite.
    */
    freigabe: '2026-10-16',
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
