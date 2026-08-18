/**
 * Die Handelsplätze hinter den Kürzeln.
 *
 * ## Was hier steht und was nicht
 *
 * Nur die Zuordnung „Kürzelendung → Name des Platzes und Land". Das ist eine
 * feste Eigenschaft der Quelle, kein Datenbestand, der veraltet: Yahoo hängt
 * seit jeher `.DE` an Xetra-Kürzel und `.T` an Tokioter.
 *
 * **Keine Feiertage.** Die stehen nirgends in diesem Projekt aufgeschrieben –
 * sie werden aus den Kursreihen abgelesen (`lib/handelsfreie-tage.ts`). Der
 * Grund steht dort: Die veröffentlichten Kalender sind aus dieser Umgebung
 * nicht erreichbar, und eine Feiertagsliste aus dem Gedächtnis behauptet
 * irgendwann „Börse geschlossen" an einem Handelstag.
 *
 * **Keine Handelszeiten.** Die stehen in `lib/handelszeiten.ts`.
 *
 * Wer einen Platz ergänzt, ergänzt nur Name und Land. Ob genug Kursreihen für
 * eine Auswertung da sind, entscheidet der Bestand und nicht diese Datei.
 */

export interface Handelsplatz {
  /** Die Endung, die Yahoo an das Kürzel hängt. `US` steht für keine Endung. */
  kuerzel: string
  /** Wie der Platz auf der Seite heißt. */
  name: string
  /** Das Land, in dem er liegt – für die Sortierung und die Anzeige. */
  land: string
}

export const handelsplaetze: Handelsplatz[] = [
  { kuerzel: 'US', name: 'New York (NYSE und Nasdaq)', land: 'Vereinigte Staaten' },
  { kuerzel: 'DE', name: 'Xetra (Frankfurt)', land: 'Deutschland' },
  { kuerzel: 'T', name: 'Tokio', land: 'Japan' },
  { kuerzel: 'L', name: 'London', land: 'Vereinigtes Königreich' },
  { kuerzel: 'PA', name: 'Euronext Paris', land: 'Frankreich' },
  { kuerzel: 'NS', name: 'National Stock Exchange', land: 'Indien' },
  { kuerzel: 'HK', name: 'Hongkong', land: 'Hongkong' },
  { kuerzel: 'TO', name: 'Toronto', land: 'Kanada' },
  { kuerzel: 'AX', name: 'Sydney (ASX)', land: 'Australien' },
  { kuerzel: 'SW', name: 'SIX Swiss Exchange (Zürich)', land: 'Schweiz' },
  { kuerzel: 'AS', name: 'Euronext Amsterdam', land: 'Niederlande' },
  { kuerzel: 'SA', name: 'B3 (São Paulo)', land: 'Brasilien' },
  { kuerzel: 'KS', name: 'Korea Exchange (Seoul)', land: 'Südkorea' },
  { kuerzel: 'ST', name: 'Nasdaq Stockholm', land: 'Schweden' },
  { kuerzel: 'MC', name: 'BME (Madrid)', land: 'Spanien' },
  { kuerzel: 'MI', name: 'Borsa Italiana (Mailand)', land: 'Italien' },
  { kuerzel: 'TW', name: 'Taiwan Stock Exchange', land: 'Taiwan' },
  { kuerzel: 'MX', name: 'Bolsa Mexicana de Valores', land: 'Mexiko' },
  { kuerzel: 'SI', name: 'Singapore Exchange', land: 'Singapur' },
  { kuerzel: 'CO', name: 'Nasdaq Kopenhagen', land: 'Dänemark' },
  { kuerzel: 'OL', name: 'Oslo Børs', land: 'Norwegen' },
  { kuerzel: 'HE', name: 'Nasdaq Helsinki', land: 'Finnland' },
  { kuerzel: 'BR', name: 'Euronext Brüssel', land: 'Belgien' },
  { kuerzel: 'VI', name: 'Wiener Börse', land: 'Österreich' },
  { kuerzel: 'IS', name: 'Borsa İstanbul', land: 'Türkei' },
  { kuerzel: 'JO', name: 'Johannesburg Stock Exchange', land: 'Südafrika' },
  { kuerzel: 'BK', name: 'Stock Exchange of Thailand', land: 'Thailand' },
  { kuerzel: 'JK', name: 'Indonesia Stock Exchange', land: 'Indonesien' },
  { kuerzel: 'KL', name: 'Bursa Malaysia', land: 'Malaysia' },
  { kuerzel: 'SZ', name: 'Shenzhen', land: 'China' },
  { kuerzel: 'SS', name: 'Schanghai', land: 'China' },
  { kuerzel: 'WA', name: 'Warschau', land: 'Polen' },
  { kuerzel: 'LS', name: 'Euronext Lissabon', land: 'Portugal' },
  { kuerzel: 'IR', name: 'Euronext Dublin', land: 'Irland' },
  { kuerzel: 'AT', name: 'Athex (Athen)', land: 'Griechenland' },
  { kuerzel: 'PR', name: 'Prager Börse', land: 'Tschechien' },
  { kuerzel: 'BD', name: 'Budapester Börse', land: 'Ungarn' },
  { kuerzel: 'SN', name: 'Santiago', land: 'Chile' },
  { kuerzel: 'TA', name: 'Tel Aviv Stock Exchange', land: 'Israel' },
  { kuerzel: 'NZ', name: 'NZX (Wellington)', land: 'Neuseeland' },
  { kuerzel: 'SR', name: 'Tadawul (Riad)', land: 'Saudi-Arabien' },
  { kuerzel: 'QA', name: 'Qatar Stock Exchange', land: 'Katar' },
]

const nachKuerzel = new Map(handelsplaetze.map((platz) => [platz.kuerzel, platz]))

/** Der Platz zu einer Kürzelendung, oder `null`. */
export function handelsplatz(kuerzel: string): Handelsplatz | null {
  return nachKuerzel.get(kuerzel) ?? null
}
