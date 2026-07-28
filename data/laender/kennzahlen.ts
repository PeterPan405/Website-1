/**
 * Von Hand gepflegte Länderkennzahlen.
 *
 * ## Warum es diese Datei überhaupt gibt
 *
 * Bruttoinlandsprodukt, Einwohnerzahl und Schuldenquote holt
 * `scripts/laender-abrufen.ts` automatisch – die ersten beiden aus den
 * Weltbank-Reihen, die Schuldenquote aus der Datamapper-Schnittstelle des IWF.
 * Wo der Abruf einen Wert liefert, hat er Vorrang vor allem, was hier steht.
 *
 * Die Schuldenquoten unten sind deshalb nur noch der Rückfall für den Fall,
 * dass der Abruf nicht durchkommt. Für Durchschnittsgehalt und Vermögen gibt
 * es dagegen keine offene Schnittstelle: OECD und UBS veröffentlichen sie in
 * Berichten und hinter Abfragemasken.
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
  'imf-datamapper': {
    label: 'IWF, World Economic Outlook',
    url: 'https://www.imf.org/external/datamapper/GGXWDG_NGDP@WEO',
    abgrenzung:
      'Bruttoschuld des Gesamtstaats in Prozent des BIP, für alle Länder nach derselben Abgrenzung. Wird von scripts/laender-abrufen.ts geholt.',
  },
  'eurostat-2025': {
    label: 'Eurostat, öffentlicher Schuldenstand',
    url: 'https://ec.europa.eu/eurostat/web/products-euro-indicators/w/2-22042026-bp',
    abgrenzung:
      'Schuldenstand nach Maastricht-Abgrenzung in Prozent des BIP, Stand Ende 2025. Nicht deckungsgleich mit der IWF-Abgrenzung.',
  },
  'oecd-loehne-2024': {
    label: 'OECD, Durchschnittslöhne (Aufbereitung bei Visual Capitalist)',
    url: 'https://www.visualcapitalist.com/mapped-average-wages-in-oecd-countries/',
    abgrenzung:
      'Durchschnittlicher Jahreslohn einer vollzeitbeschäftigten Person, kaufkraftbereinigt in US-Dollar. Brutto, vor Steuern und Abgaben.',
  },
  'oecd-sdmx': {
    label: 'OECD, Durchschnittslöhne (AV_AN_WAGE)',
    url: 'https://data-explorer.oecd.org/',
    abgrenzung:
      'Durchschnittlicher Jahreslohn einer vollzeitbeschäftigten Person, kaufkraftbereinigt in US-Dollar, für alle OECD-Mitglieder nach derselben Abgrenzung. Wird von scripts/laender-abrufen.ts geholt.',
  },

  /**
   * Die Vermögensverteilungsdatenbank derselben Organisation.
   *
   * Eigener Schlüssel, obwohl derselbe Herausgeber: Es ist eine andere
   * Datenbank mit einer anderen Abgrenzung, und die Umrechnung in US-Dollar
   * kommt von einer zweiten Stelle. Beides gehört an den Wert, nicht in eine
   * Fußnote.
   */
  'oecd-vermoegen': {
    label: 'OECD, Vermögensverteilungsdatenbank',
    url: 'https://data-explorer.oecd.org/vis?fs[0]=Topic%2C1%7CSociety%23SOC%23%7CInequality%23SOC_INE%23&df[ds]=dsDisseminateFinalDMZ&df[id]=DSD_WEALTH%40DF_WEALTH',
    abgrenzung:
      'Median des Reinvermögens je Haushalt – Vermögen abzüglich Schulden, in der Mitte der Verteilung. Von der Quelle in Landeswährung gemeldet und mit dem Euro-Referenzkurs der Europäischen Zentralbank zum Ende des jeweiligen Erhebungsjahres in US-Dollar umgerechnet. Wird von scripts/laender-abrufen.ts geholt.',
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

  /*
    Alle aus derselben Veröffentlichung: Eurostat, Stand Ende 2025.

    Vorher standen hier Werte aus dem ersten, zweiten und dritten Quartal
    nebeneinander. Über die Quartale eines Jahres verschiebt sich eine
    Schuldenquote um mehrere Prozentpunkte – die Länder waren damit nicht
    vergleichbar, obwohl sie in einer Spalte standen.
  */
  '300': { wert: 146.1, zeitraum: 'Ende 2025', quelle: 'eurostat-2025' },
  '250': { wert: 115.6, zeitraum: 'Ende 2025', quelle: 'eurostat-2025' },
  '056': { wert: 107.9, zeitraum: 'Ende 2025', quelle: 'eurostat-2025' },
  '724': { wert: 100.7, zeitraum: 'Ende 2025', quelle: 'eurostat-2025' },
  '752': { wert: 35.1, zeitraum: 'Ende 2025', quelle: 'eurostat-2025' },
  '372': { wert: 32.9, zeitraum: 'Ende 2025', quelle: 'eurostat-2025' },
  '208': { wert: 27.9, zeitraum: 'Ende 2025', quelle: 'eurostat-2025' },
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
  /*
    Leer, und das ist kein Versehen.

    Hier standen drei Werte aus einem Bankenbericht: Medianvermögen je
    erwachsener Person. Seit `scripts/laender-abrufen.ts` die
    Vermögensverteilungsdatenbank der OECD holt, kommen dreißig Länder aus
    einer Reihe – allerdings **je Haushalt**, und das ist eine andere Größe.

    Beide nebeneinander wären nicht bloß ungenau, sondern eine falsche
    Rangfolge: Ein Haushaltswert liegt naturgemäß über einem Pro-Kopf-Wert,
    und die Schweiz – als einziges der drei Länder nicht in der Datenbank –
    stünde mit einer Pro-Kopf-Zahl unter der Überschrift „je Haushalt“ zu
    weit unten. Eine Zahl weniger ist besser als eine, die nicht dazugehört.

    Die Karte bleibt bestehen, weil sie der vorgesehene Weg für Werte ist, die
    sich nicht abrufen lassen. Wer hier etwas einträgt, muss dieselbe
    Abgrenzung treffen: Median des Reinvermögens je Haushalt, in US-Dollar.
  */
}
