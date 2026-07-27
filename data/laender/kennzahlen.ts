/**
 * Von Hand gepflegte Länderkennzahlen.
 *
 * ## Warum es diese Datei überhaupt gibt
 *
 * Bruttoinlandsprodukt und Einwohnerzahl holt `scripts/laender-abrufen.ts`
 * automatisch aus den Weltbank-Reihen – 184 Länder, ein Bezugsjahr, keine
 * Handarbeit. Für Staatsverschuldung, Durchschnittsgehalt und Vermögen gibt es
 * keine vergleichbar offene Datei: IWF, Eurostat, OECD und UBS veröffentlichen
 * sie in PDF-Berichten und hinter Abfragemasken.
 *
 * Diese Werte stehen deshalb hier, und zwar **einzeln mit Quelle und Zeitraum**.
 * Das ist kein Schmuck: Die Zahlen stammen aus verschiedenen Erhebungen mit
 * verschiedenen Definitionen und Stichtagen. Eine Schuldenquote nach Maastricht
 * (Eurostat) und eine nach IWF-Abgrenzung sind nicht dieselbe Größe – für die
 * USA unterscheiden sie sich um mehrere Prozentpunkte. Sie in eine Spalte zu
 * schreiben und „Staatsverschuldung“ darüberzusetzen wäre der bequeme Weg und
 * eine Fälschung.
 *
 * ## Was hier bewusst fehlt
 *
 * Die Abdeckung ist lückenhaft, und das bleibt sichtbar. Wo kein Wert steht,
 * zeigt der Globus „keine Angabe hinterlegt“ – nicht null, nicht geschätzt,
 * nicht aus einem Nachbarland abgeleitet. Ein Land ohne Datensatz darf nicht
 * aussehen wie ein Land ohne Schulden.
 *
 * Die naheliegende Abkürzung wäre gewesen, die Zahlen aus dem Gedächtnis zu
 * ergänzen und eine plausible Quelle darunterzuschreiben. Das wäre die
 * schlimmste Variante: nicht nachprüfbar und als Fehler nicht erkennbar.
 *
 * ## Wie sich das erweitern lässt
 *
 * Jeder neue Wert braucht drei Dinge – Zahl, Zeitraum, Quelle mit Link. Die
 * Prüfung in `lib/laender-validate.ts` besteht darauf. Wer eine vollständige
 * Tabelle aus einer amtlichen Quelle hat, kann sie hier eintragen; der Globus
 * zeigt sie ohne weitere Änderung.
 */

/** Ein einzelner Wert mit seiner Herkunft. */
export interface Kennwert {
  wert: number
  /** Zeitraum, auf den sich der Wert bezieht – Jahr oder Quartal. */
  zeitraum: string
  /** Schlüssel in `kennzahlenQuellen`. */
  quelle: string
}

export interface Quellenangabe {
  label: string
  url: string
  /** Was genau gemessen wird – bei Schuldenquoten entscheidend. */
  abgrenzung: string
}

export const kennzahlenQuellen: Record<string, Quellenangabe> = {
  'imf-weo-2025': {
    label: 'IWF, World Economic Outlook 2025 (Aufbereitung bei Visual Capitalist)',
    url: 'https://www.visualcapitalist.com/mapped-government-debt-to-gdp-by-country-in-2025/',
    abgrenzung:
      'Bruttoschuld des Gesamtstaats in Prozent des BIP nach Abgrenzung des IWF.',
  },
  'eurostat-2025': {
    label: 'Eurostat, öffentlicher Schuldenstand',
    url: 'https://ec.europa.eu/eurostat/de/web/products-euro-indicators/w/2-22012026-ap',
    abgrenzung:
      'Schuldenstand nach Maastricht-Abgrenzung in Prozent des BIP. Nicht deckungsgleich mit der IWF-Abgrenzung.',
  },
  'oecd-loehne-2024': {
    label: 'OECD, Durchschnittslöhne (Aufbereitung bei Visual Capitalist)',
    url: 'https://www.visualcapitalist.com/mapped-average-wages-in-oecd-countries/',
    abgrenzung:
      'Durchschnittlicher Jahreslohn einer vollzeitbeschäftigten Person, kaufkraftbereinigt in US-Dollar. Brutto, vor Steuern und Abgaben.',
  },
  'ubs-gwr-2025': {
    label: 'UBS Global Wealth Report 2025 (Aufbereitung bei Visual Capitalist)',
    url: 'https://www.visualcapitalist.com/wealth-per-person-by-country-2025/',
    abgrenzung:
      'Medianvermögen je erwachsener Person in US-Dollar: Nettovermögen einschließlich Immobilien, abzüglich Schulden. Der Median – nicht der Durchschnitt – zeigt die Mitte.',
  },
}

/**
 * Schuldenquote in Prozent des BIP.
 *
 * Schlüssel ist die ISO-3166-1-numerische Kennung wie in der Kartengeometrie.
 * Die Werte stammen aus zwei Erhebungen mit unterschiedlicher Abgrenzung –
 * deshalb steht die Quelle an jedem einzelnen Wert und wird auf der Seite auch
 * je Land angezeigt.
 */
export const schuldenquote: Record<string, Kennwert> = {
  '392': { wert: 226.8, zeitraum: '2025', quelle: 'imf-weo-2025' },
  '840': { wert: 128.7, zeitraum: '2025', quelle: 'imf-weo-2025' },
  '124': { wert: 113.0, zeitraum: '2025', quelle: 'imf-weo-2025' },
  '826': { wert: 104.8, zeitraum: '2025', quelle: 'imf-weo-2025' },
  '156': { wert: 84.0, zeitraum: '2025', quelle: 'imf-weo-2025' },
  '356': { wert: 81.0, zeitraum: '2025', quelle: 'imf-weo-2025' },

  '300': { wert: 149.7, zeitraum: '3. Quartal 2025', quelle: 'eurostat-2025' },
  '380': { wert: 137.8, zeitraum: '3. Quartal 2025', quelle: 'eurostat-2025' },
  '250': { wert: 117.7, zeitraum: '3. Quartal 2025', quelle: 'eurostat-2025' },
  '056': { wert: 107.1, zeitraum: '3. Quartal 2025', quelle: 'eurostat-2025' },
  '724': { wert: 103.2, zeitraum: '3. Quartal 2025', quelle: 'eurostat-2025' },
  '276': { wert: 62.3, zeitraum: '1. Quartal 2025', quelle: 'eurostat-2025' },
  '208': { wert: 29.7, zeitraum: '2. Quartal 2025', quelle: 'eurostat-2025' },
}

/** Durchschnittlicher Jahreslohn, kaufkraftbereinigt in US-Dollar. */
export const durchschnittsgehalt: Record<string, Kennwert> = {
  '442': { wert: 90_000, zeitraum: '2024', quelle: 'oecd-loehne-2024' },
  '352': { wert: 87_000, zeitraum: '2024', quelle: 'oecd-loehne-2024' },
  '756': { wert: 83_000, zeitraum: '2024', quelle: 'oecd-loehne-2024' },
  '840': { wert: 82_933, zeitraum: '2024', quelle: 'oecd-loehne-2024' },
  '276': { wert: 69_433, zeitraum: '2024', quelle: 'oecd-loehne-2024' },
  '124': { wert: 69_417, zeitraum: '2024', quelle: 'oecd-loehne-2024' },
  '250': { wert: 60_608, zeitraum: '2024', quelle: 'oecd-loehne-2024' },
  '380': { wert: 51_019, zeitraum: '2024', quelle: 'oecd-loehne-2024' },
  '392': { wert: 49_446, zeitraum: '2024', quelle: 'oecd-loehne-2024' },
}

/**
 * Medianvermögen je erwachsener Person in US-Dollar.
 *
 * Bewusst der Median und nicht der Durchschnitt. Beim Durchschnitt zieht eine
 * kleine Zahl sehr vermögender Personen den Wert nach oben: Die USA stehen
 * beim Durchschnittsvermögen weltweit auf Platz zwei, beim Median auf Platz
 * fünfzehn. Wer wissen will, wie es der Mitte einer Gesellschaft geht, braucht
 * den Median – genau deshalb steht diese Zahl hier und nicht die andere.
 */
export const medianvermoegen: Record<string, Kennwert> = {
  '442': { wert: 395_000, zeitraum: '2025', quelle: 'ubs-gwr-2025' },
  '756': { wert: 167_353, zeitraum: '2025', quelle: 'ubs-gwr-2025' },
  '840': { wert: 124_041, zeitraum: '2025', quelle: 'ubs-gwr-2025' },
}
