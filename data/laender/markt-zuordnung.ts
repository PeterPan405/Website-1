import { weitereAktienLaender } from '@/data/markets-aktien'

/**
 * Zuordnung der Kurse zu ihrem Herkunftsland.
 *
 * ## Warum eine eigene Datei
 *
 * `data/markets.ts` beschreibt Instrumente, nicht Geografie. Ein Feld `land`
 * dort einzutragen hieße, 134 Einträge anzufassen, um eine Frage zu
 * beantworten, die nur der Globus stellt. Diese Datei hält die Zuordnung an
 * einer Stelle zusammen und lässt sich als Ganzes prüfen.
 *
 * ## Nach welcher Regel zugeordnet wird
 *
 * Nach dem **Sitz des Unternehmens**, nicht nach dem Handelsplatz. Die Frage
 * auf dem Globus lautet „welche Unternehmen kommen von hier“, und dafür ist
 * der Firmensitz die Antwort, die jemand erwartet. Beides fällt meist
 * zusammen; wo nicht, steht ein Hinweis dabei.
 *
 * Bei Indizes gilt das Land, dessen Markt der Index abbildet. Zwei Indizes
 * haben keins: Der Euro Stoxx 50 umfasst mehrere Länder der Eurozone, der
 * MSCI World 23 Industrieländer. Sie stehen unter `uebernational` – lieber
 * keine Zuordnung als eine willkürliche.
 */

/** Schlüssel ist das Kurssymbol, Wert die ISO-3166-1-numerische Kennung. */
export const marktLand: Record<string, string> = {
  // Die breite Auswahl bringt ihre Zuordnung selbst mit – erzeugt aus
  // derselben Liste, aus der auch die Kursdefinitionen entstehen. Damit kann
  // eine neue Aktie gar nicht erst ohne Herkunftsland auf den Globus geraten.
  ...weitereAktienLaender,

  // ------------------------------------------------------------- Indizes
  dax: '276',
  sp500: '840',
  'nasdaq-100': '840',
  'dow-jones': '840',
  'russell-2000': '840',
  'nikkei-225': '392',
  kospi: '410',
  'hang-seng': '156',

  // ------------------------------------------------ Vereinigte Staaten
  nvidia: '840',
  apple: '840',
  microsoft: '840',
  alphabet: '840',
  amazon: '840',
  meta: '840',
  tesla: '840',
  broadcom: '840',
  amd: '840',
  intel: '840',
  qualcomm: '840',
  'texas-instruments': '840',
  oracle: '840',
  salesforce: '840',
  adobe: '840',
  cisco: '840',
  ibm: '840',
  palantir: '840',
  netflix: '840',
  uber: '840',
  airbnb: '840',
  paypal: '840',
  visa: '840',
  mastercard: '840',
  'eli-lilly': '840',
  'johnson-johnson': '840',
  unitedhealth: '840',
  abbvie: '840',
  merck: '840',
  pfizer: '840',
  'thermo-fisher': '840',
  jpmorgan: '840',
  'bank-of-america': '840',
  'goldman-sachs': '840',
  berkshire: '840',
  blackrock: '840',
  walmart: '840',
  costco: '840',
  'procter-gamble': '840',
  'coca-cola': '840',
  pepsico: '840',
  mcdonalds: '840',
  nike: '840',
  'home-depot': '840',
  boeing: '840',
  caterpillar: '840',
  deere: '840',
  'ge-aerospace': '840',
  lockheed: '840',
  rtx: '840',
  'union-pacific': '840',
  ups: '840',
  exxon: '840',
  chevron: '840',
  nextera: '840',

  // ------------------------------------------------------- Deutschland
  sap: '276',
  siemens: '276',
  'siemens-energy': '276',
  'mercedes-benz': '276',
  bmw: '276',
  volkswagen: '276',
  'porsche-ag': '276',
  basf: '276',
  bayer: '276',
  'deutsche-telekom': '276',
  adidas: '276',
  infineon: '276',
  rheinmetall: '276',
  'deutsche-post': '276',
  'merck-kgaa': '276',
  beiersdorf: '276',
  henkel: '276',
  eon: '276',
  allianz: '276',
  'munich-re': '276',
  'deutsche-bank': '276',
  'hannover-rueck': '276',
  vonovia: '276',

  // ---------------------------------------------------------- Frankreich
  lvmh: '250',
  hermes: '250',
  totalenergies: '250',
  'schneider-electric': '250',
  'l-oreal': '250',
  safran: '250',

  // ------------------------------------------------------------ Schweiz
  nestle: '756',
  roche: '756',
  novartis: '756',
  ubs: '756',

  // ------------------------------------------- Vereinigtes Königreich
  hsbc: '826',
  shell: '826',
  astrazeneca: '826',
  unilever: '826',
  arm: '826',

  // -------------------------------------------------------- Niederlande
  asml: '528',
  airbus: '528',
  stellantis: '528',

  // -------------------------------------------------------------- übrige
  'novo-nordisk': '208',
  linde: '372',
  ferrari: '380',
  iberdrola: '724',
  santander: '724',
  tsmc: '158',
  umc: '158',
  samsung: '410',
  toyota: '392',
  sony: '392',
  alibaba: '156',
  tencent: '156',
}

/**
 * Kurse ohne einzelnes Herkunftsland.
 *
 * Steht hier ausdrücklich und nicht einfach als Lücke: Eine fehlende Zuordnung
 * soll ein Fehler sein, den die Prüfung meldet. Ein Index über 23 Länder ist
 * dagegen kein Versehen.
 */
export const uebernational: Record<string, string> = {
  'euro-stoxx-50': 'Die 50 größten Unternehmen der Eurozone – mehrere Länder.',
  'msci-world': 'Rund 1.400 Unternehmen aus 23 Industrieländern.',
}

/**
 * Erläuterungen, wo Sitz und landläufige Zuordnung auseinandergehen.
 *
 * Diese Fälle sind der Grund, warum die Regel im Kopfkommentar überhaupt
 * ausgeschrieben ist: Ohne sie wirkt jede einzelne Zuordnung wie ein Fehler.
 */
export const zuordnungshinweise: Record<string, string> = {
  'hang-seng':
    'Der Index bildet den Markt in Hongkong ab – einer Sonderverwaltungszone Chinas, die in der Kartengeometrie nicht getrennt ausgewiesen ist.',
  airbus:
    'Airbus SE hat seinen eingetragenen Sitz in den Niederlanden; die Konzernzentrale liegt in Frankreich, gefertigt wird an mehreren europäischen Standorten.',
  stellantis:
    'Stellantis entstand aus der Fusion von Fiat Chrysler und PSA und ist in den Niederlanden eingetragen; die Marken stammen aus Italien, Frankreich und den USA.',
  linde:
    'Linde plc ist in Irland eingetragen, geht aber auf die deutsche Linde AG zurück.',
  arm: 'Arm Holdings sitzt in Cambridge; die Aktie notiert an der US-Börse Nasdaq.',
  tencent: 'Firmensitz ist Shenzhen; gehandelt wird die Aktie in Hongkong.',
  'novo-nordisk':
    'Größtes Unternehmen Dänemarks – gemessen am Börsenwert zeitweise größer als die dänische Wirtschaftsleistung eines Jahres.',
}
