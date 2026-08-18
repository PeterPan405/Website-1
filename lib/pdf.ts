/**
 * Ein kleiner PDF-Erzeuger für Tabellen zum Abheften.
 *
 * Bewusst ohne Importe, damit `tests/` das Modul direkt laden kann – und
 * bewusst ohne Fremdbibliothek.
 *
 * ## Warum selbst geschrieben
 *
 * Weil die üblichen PDF-Bibliotheken zwischen 300 KB und einem Megabyte ins
 * Browser-Paket bringen, und zwar auf jeder Seite, die den Rechner lädt. Was
 * hier gebraucht wird, ist ein Bruchteil davon: Text in zwei Spalten, ein paar
 * Flächen, das Signet, Seitenumbruch. Ein PDF, das nur das kann, ist eine
 * überschaubare Datei – und niemand muss eine Abhängigkeit pflegen, deren Rest
 * er nie benutzt.
 *
 * ## Warum keine Schriftart eingebettet wird
 *
 * PDF-Betrachter müssen vierzehn Standardschriften mitbringen, darunter
 * Helvetica in allen drei hier benutzten Schnitten. Wer sie verwendet, spart
 * das Einbetten vollständig – die Datei bleibt bei wenigen Kilobyte, und es
 * gibt keine Lizenzfrage.
 *
 * ## Warum das Logo gezeichnet und nicht eingebettet wird
 *
 * Weil es aus Kurven besteht, und Kurven kann PDF von sich aus. Als Bild
 * müsste es in einer festen Auflösung mitgeliefert werden und wäre im Ausdruck
 * entweder pixelig oder unnötig groß. Als Vektor sind es knapp drei Kilobyte im
 * Inhaltsstrom, und es druckt in jeder Größe scharf.
 *
 * Die Pfade sind dieselben wie in `public/logo.svg` – wörtlich übernommen und
 * nicht nachgerechnet. Das ist die einzige Fassung, die nicht auseinanderlaufen
 * kann: Wer das Logo austauscht, tauscht drei Zeichenketten aus.
 *
 * Ein Unterschied fällt beim Übertragen an: SVG zählt die y-Achse nach unten,
 * PDF nach oben. Jeder y-Wert wird hier deshalb gespiegelt.
 *
 * ## Warum die Beträge sich exakt ausrichten lassen
 *
 * PDF kennt keine Ausrichtung: Wer rechtsbündig setzen will, muss die
 * Textbreite selbst ausrechnen. Für Fließtext ginge das nur mit der
 * vollständigen Breitentabelle der Schrift – 224 Zahlen für einen einzigen
 * Zweck. Für Beträge genügt ein Dutzend: Ziffern, Komma, Punkt, Leerzeichen,
 * Minus und die drei Buchstaben von „EUR“. Deren Breiten stehen unten exakt
 * da, und weil alle zehn Ziffern in Helvetica gleich breit sind, stehen die
 * Beträge zugleich sauber untereinander.
 *
 * Alles andere – Umbruch, Seitenzahl – kommt mit einer Schätzung nach
 * Zeichenklassen aus, die eher zu breit als zu schmal liegt.
 *
 * ## Warum die Datei als Zeichenkette entsteht
 *
 * Eine PDF-Datei enthält am Ende eine Tabelle mit den Byte-Positionen aller
 * Objekte. Die auszurechnen ist nur dann einfach, wenn ein Zeichen genau einem
 * Byte entspricht. Deshalb wird alles zunächst als Zeichenkette gebaut, in der
 * jedes Zeichen einen Code unter 256 hat, und erst ganz am Ende Zeichen für
 * Zeichen in Bytes übersetzt.
 */

/** Der Farbton eines Gruppenbalkens – die vier Farben des Logos. */
export type Ton = 'navy' | 'grau' | 'rot' | 'gruen'

/** Eine Zeile im Dokument. */
export type PdfZeile =
  | { art: 'ueberschrift'; text: string }
  | { art: 'unterueberschrift'; text: string; betrag?: string; ton?: Ton }
  | {
      art: 'zeile'
      text: string
      betrag?: string
      eingerueckt?: boolean
      /** Zieht statt eines Betrags eine Linie zum Eintragen mit der Hand. */
      schreiblinie?: boolean
    }
  | { art: 'summe'; text: string; betrag?: string; schreiblinie?: boolean }
  /** Das Ergebnis ganz unten – als ausgefüllter Kasten, damit man es findet. */
  | { art: 'abschluss'; text: string; betrag?: string; schreiblinie?: boolean }
  | { art: 'hinweis'; text: string }
  /**
   * Fließtext in Lesegröße, umbrochen.
   *
   * Für Dokumente, die man **liest** statt abhakt – das Ausgabenband etwa.
   * `hinweis` bricht zwar auch um, ist aber acht Punkt groß und grau: eine
   * Fußnote. Zwei Seiten Fußnote sind unlesbar.
   */
  | { art: 'fliesstext'; text: string }
  | { art: 'abstand' }
  | { art: 'linie' }
  | { art: 'seitenumbruch' }

export interface PdfDokument {
  titel: string
  /** Steht klein unter dem Titel, etwa der Stichtag. */
  untertitel?: string
  /** Der Markenname oben rechts, neben Signet und Titel. */
  marke?: string
  /** Steht auf jeder Seite unten links; die Seitenzahl kommt rechts dazu. */
  fusszeile?: string
  zeilen: PdfZeile[]
}

/* --------------------------------------------------------------------------
   Seitenmaße in Punkt (1/72 Zoll). A4 ist 595 × 842.
-------------------------------------------------------------------------- */
const BREITE = 595
const HOEHE = 842
const RAND = 52
const RECHTS = BREITE - RAND
const UNTEN = 64
/** Oberkante des Kopfes – Signet und Titel beginnen hier. */
const KOPF = HOEHE - 46

/* --------------------------------------------------------------------------
   Farben. Die vier Logofarben stammen aus `public/logo.svg`, die Grautöne
   sind so gewählt, dass sie im Schwarzweißdruck noch unterscheidbar bleiben.
-------------------------------------------------------------------------- */
type Farbe = readonly [number, number, number]

const NAVY: Farbe = [0.09, 0.161, 0.435] // #17296F
const GRAU: Farbe = [0.431, 0.431, 0.431] // #6E6E6E
const ROT: Farbe = [0.545, 0.133, 0.145] // #8B2225
const GRUEN: Farbe = [0.125, 0.329, 0.216] // #205437

const TEXT: Farbe = [0.13, 0.13, 0.14]
const LEISE: Farbe = [0.45, 0.45, 0.47]
const ZEBRA: Farbe = [0.965, 0.968, 0.976]
const BAND: Farbe = [0.918, 0.929, 0.949]
const HAARLINIE: Farbe = [0.84, 0.85, 0.87]
const WEISS: Farbe = [1, 1, 1]

const TOENE: Record<Ton, Farbe> = { navy: NAVY, grau: GRAU, rot: ROT, gruen: GRUEN }
/** Ohne eigene Angabe bekommt jede Gruppe der Reihe nach eine Logofarbe. */
const REIHUM: Farbe[] = [NAVY, GRAU, ROT, GRUEN]

/** Schriftgrößen und Zeilenhöhen je Zeilenart. */
const MASSE = {
  ueberschrift: { groesse: 14, hoehe: 26, fett: true },
  unterueberschrift: { groesse: 11.5, hoehe: 23, fett: true },
  zeile: { groesse: 9.5, hoehe: 16, fett: false },
  summe: { groesse: 10, hoehe: 20, fett: true },
  abschluss: { groesse: 12, hoehe: 34, fett: true },
  hinweis: { groesse: 8, hoehe: 11.5, fett: false },
  fliesstext: { groesse: 9.5, hoehe: 14, fett: false },
} as const

/* --------------------------------------------------------------------- Maße */

/**
 * Exakte Zeichenbreiten für alles, was in einem Betrag vorkommen kann.
 *
 * Die Werte stammen aus der AFM-Tabelle von Helvetica und sind in Tausendstel
 * der Schriftgröße angegeben. Für genau diese Zeichen hat Helvetica-Bold
 * dieselben Breiten – deshalb genügt eine Tabelle für beide Schnitte, und ein
 * fetter Summenbetrag steht bündig unter den mageren darüber.
 */
const BETRAGSBREITEN: Record<string, number> = {
  '0': 556,
  '1': 556,
  '2': 556,
  '3': 556,
  '4': 556,
  '5': 556,
  '6': 556,
  '7': 556,
  '8': 556,
  '9': 556,
  ' ': 278,
  '.': 278,
  ',': 278,
  '-': 333,
  '−': 333,
  E: 667,
  U: 722,
  R: 722,
}

/**
 * Geschätzte Breite eines Helvetica-Textes.
 *
 * ## Warum geschätzt
 *
 * Genau ginge es nur mit der Breitentabelle der Schrift – 224 Zahlen, die hier
 * für einen einzigen Zweck mitgeschleppt würden: zu wissen, wann eine Zeile
 * umgebrochen werden muss. Für diesen Zweck genügt eine Näherung nach
 * Zeichenklassen, solange sie eher zu breit schätzt als zu schmal. Ein Umbruch,
 * der zwei Zeichen zu früh kommt, fällt niemandem auf; einer, der zu spät
 * kommt, schiebt Text über den Rand.
 */
function helvetikaBreite(text: string, groesse: number): number {
  let breite = 0
  for (const zeichen of text) {
    if ("iljtI.,;:!|'`".includes(zeichen)) breite += 0.3
    else if ('fr()[]/\\-'.includes(zeichen)) breite += 0.36
    else if ('mwMW'.includes(zeichen)) breite += 0.87
    else if (zeichen >= 'A' && zeichen <= 'Z') breite += 0.71
    else if (zeichen === ' ') breite += 0.28
    else breite += 0.56
  }
  return breite * groesse
}

/**
 * Die Breite eines Textes, so genau es geht.
 *
 * Besteht er nur aus Zeichen, die in einem Betrag vorkommen, ist das Ergebnis
 * exakt; sonst die Schätzung. Genau das ist der Unterschied, auf den es
 * ankommt: Beträge stehen auf den Punkt am rechten Rand, eine Seitenzahl darf
 * einen halben Punkt daneben liegen.
 */
function breiteVon(text: string, groesse: number): number {
  let summe = 0
  for (const zeichen of text) {
    const breite = BETRAGSBREITEN[zeichen]
    if (breite === undefined) return helvetikaBreite(text, groesse)
    summe += breite
  }
  return (summe / 1000) * groesse
}

/**
 * Einen Text so umbrechen, dass er in die verfügbare Breite passt.
 *
 * Getrennt wird nur an Leerzeichen. Ein einzelnes Wort, das allein schon zu
 * breit ist, bleibt stehen und ragt heraus – das kommt in einem Vermögensbogen
 * nicht vor, und es zu zerschneiden sähe schlimmer aus als der Überstand.
 */
function umbrich(text: string, groesse: number, breite: number): string[] {
  const woerter = text.split(' ')
  const zeilen: string[] = []
  let laufend = ''

  for (const wort of woerter) {
    const versuch = laufend ? `${laufend} ${wort}` : wort
    if (laufend && helvetikaBreite(versuch, groesse) > breite) {
      zeilen.push(laufend)
      laufend = wort
    } else {
      laufend = versuch
    }
  }
  if (laufend) zeilen.push(laufend)
  return zeilen.length > 0 ? zeilen : ['']
}

/* ---------------------------------------------------------------- Kodierung */

/**
 * Zeichen in die Kodierung bringen, die PDF für die Standardschriften nutzt.
 *
 * WinAnsi entspricht Latin-1 mit einer Ausnahme: Im Bereich 0x80 bis 0x9F
 * stehen dort typografische Zeichen statt Steuerzeichen. Das Eurozeichen und
 * die deutschen Anführungszeichen liegen genau darin – ohne diese Tabelle
 * käme an ihrer Stelle nichts oder Unsinn heraus.
 */
const WINANSI: Record<string, number> = {
  '€': 0x80,
  '‚': 0x82,
  '„': 0x84,
  '…': 0x85,
  '†': 0x86,
  '‡': 0x87,
  '‰': 0x89,
  '‹': 0x8b,
  '‘': 0x91,
  '’': 0x92,
  '“': 0x93,
  '”': 0x94,
  '•': 0x95,
  '–': 0x96,
  '—': 0x97,
  '›': 0x9b,
  // Das typografische Minus kennt WinAnsi nicht; der Bindestrich tut es auch.
  '−': 0x2d,
}

function kodiere(text: string): string {
  let heraus = ''
  for (const zeichen of text) {
    const code = WINANSI[zeichen] ?? zeichen.codePointAt(0) ?? 63
    const byte = code <= 0xff ? code : 63 // '?' für alles, was nicht darstellbar ist
    const gesetzt = String.fromCharCode(byte)
    // In einer PDF-Zeichenkette müssen diese drei maskiert werden.
    heraus +=
      gesetzt === '(' || gesetzt === ')' || gesetzt === '\\' ? `\\${gesetzt}` : gesetzt
  }
  return heraus
}

/* ------------------------------------------------------------- Zeichenbefehle */

function fuellfarbe(farbe: Farbe): string {
  return `${farbe[0]} ${farbe[1]} ${farbe[2]} rg\n`
}

function strichfarbe(farbe: Farbe): string {
  return `${farbe[0]} ${farbe[1]} ${farbe[2]} RG\n`
}

/** Ein Textbefehl im Inhaltsstrom, in der gewünschten Farbe. */
function text(
  schrift: string,
  groesse: number,
  x: number,
  y: number,
  inhalt: string,
  farbe: Farbe = TEXT
) {
  return (
    fuellfarbe(farbe) +
    `BT /${schrift} ${groesse} Tf 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${kodiere(inhalt)}) Tj ET\n`
  )
}

/** Denselben Text rechtsbündig an einer Kante setzen. */
function rechtsbuendig(
  schrift: string,
  groesse: number,
  kante: number,
  y: number,
  inhalt: string,
  farbe: Farbe = TEXT
) {
  return text(schrift, groesse, kante - breiteVon(inhalt, groesse), y, inhalt, farbe)
}

/** Eine ausgefüllte Fläche – Grundlage für Zebrastreifen, Balken und Kästen. */
function flaeche(x: number, y: number, breite: number, hoehe: number, farbe: Farbe) {
  return (
    fuellfarbe(farbe) +
    `${x.toFixed(2)} ${y.toFixed(2)} ${breite.toFixed(2)} ${hoehe.toFixed(2)} re f\n`
  )
}

/** Eine waagerechte Linie zwischen zwei x-Werten. */
function strecke(x1: number, x2: number, y: number, staerke: number, farbe: Farbe) {
  return (
    strichfarbe(farbe) +
    `${staerke} w ${x1.toFixed(2)} ${y.toFixed(2)} m ${x2.toFixed(2)} ${y.toFixed(2)} l S\n`
  )
}

/** Eine waagerechte Linie über den ganzen Satzspiegel. */
function linie(y: number, staerke = 0.5, farbe: Farbe = HAARLINIE) {
  return strecke(RAND, RECHTS, y, staerke, farbe)
}

/**
 * Der Balken unter dem Kopf: vier gleich breite Felder in den Logofarben.
 *
 * Er ersetzt die frühere graue Linie und ist der einzige Schmuck auf der
 * Seite. Mehr braucht ein Formular nicht – und weniger sähe aus, als hätte
 * niemand hingesehen.
 */
function farbleiste(y: number, staerke = 2.5): string {
  const feld = (RECHTS - RAND) / 4
  let heraus = ''
  REIHUM.forEach((farbe, stelle) => {
    heraus += flaeche(RAND + stelle * feld, y, feld, staerke, farbe)
  })
  return heraus
}

/* -------------------------------------------------------------------- Signet */

/*
  Die Pfade des Logos, unveraendert aus `public/logo.svg` uebernommen.

  Bis hierher zeichnete dieses Modul das Zeichen selbst nach: vier Viertelboegen
  mit runden Enden und vier Kreise, zusammen zwanzig Bezierkurven aus einer
  Handvoll Winkel. Das war eine Annaeherung an das Logo und kam ohne die
  Verzahnung der Puzzleteile aus, weil sie sich aus Kreisboegen nicht ergibt.
  Seit die Originalvorlage vorliegt, stehen hier ihre nachgezeichneten Pfade –
  dieselben Daten wie in der SVG-Datei und in `components/ui/Logo.tsx`.

  Der Preis sind rund sechs Kilobyte im Modul und knapp drei im erzeugten PDF.
  Dafuer ist das Zeichen dasselbe wie auf der Website, in jeder Groesse scharf,
  und es muss keine Bilddatei mitgeliefert werden.
*/
const SIGNET_FIGUREN: { farbe: Farbe; d: string }[] = [
  {
    farbe: NAVY,
    d:
      'M 0.9 93.6 C 0.6 93.3 0.5 93.0 0.6 92.8 C 0.6 92.6 0.8 91.4 0.9 90.1 C 1.6 81.8 5.4 ' +
      '68.8 9.4 61.2 C 12.6 55.2 15.3 50.9 17.3 48.8 C 18.6 47.5 18.9 47.4 22.0 48.2 C 31.1 ' +
      '50.6 41.2 46.4 46.1 38.1 C 48.5 34.0 49.8 27.7 49.0 24.1 C 48.1 20.0 47.9 19.1 48.0 ' +
      '18.6 C 48.3 17.5 51.7 14.9 56.9 11.9 C 57.7 11.4 59.1 10.6 59.9 10.1 C 60.8 9.6 62.1 ' +
      '9.0 62.9 8.6 C 67.3 6.6 68.3 6.2 68.4 6.2 C 68.5 6.2 69.9 5.7 71.5 5.1 C 76.7 3.1 ' +
      '83.1 1.6 88.7 0.8 C 89.0 0.7 89.9 0.6 90.6 0.4 C 93.9 -0.3 94.4 0.3 94.5 5.3 C 94.7 ' +
      '12.2 96.2 14.1 101.2 14.1 C 111.0 14.1 116.0 25.0 109.2 31.6 C 107.1 33.6 103.9 34.8 ' +
      '101.8 34.4 C 101.2 34.3 98.2 34.8 97.6 35.1 C 95.8 36.1 95.0 38.1 94.9 41.2 C 94.9 ' +
      '44.8 96.9 42.6 69.8 69.7 C 45.5 93.9 45.5 93.9 44.0 94.0 C 42.0 94.1 41.7 93.9 41.0 ' +
      '92.1 C 39.1 87.4 35.6 83.7 31.4 82.0 C 28.9 81.0 25.3 80.4 23.3 80.7 C 16.3 81.6 ' +
      '11.3 85.3 8.8 91.3 C 7.6 94.1 7.6 94.1 4.1 94.1 C 1.6 94.1 1.3 94.0 0.9 93.6 Z M ' +
      '24.9 42.4 C 12.9 40.1 7.8 27.1 15.1 17.2 C 22.4 7.4 38.6 10.5 42.1 22.5 C 45.2 33.4 ' +
      '35.7 44.4 24.9 42.4 Z',
  },
  {
    farbe: GRAU,
    d:
      'M 172.4 111.1 C 167.9 109.7 165.3 105.7 165.3 100.5 C 165.3 96.0 163.4 94.4 157.7 ' +
      '94.1 C 155.0 93.9 153.3 93.0 150.9 90.2 C 150.3 89.5 148.6 87.8 147.1 86.4 C 145.7 ' +
      '85.0 143.8 83.1 143.0 82.2 C 142.1 81.4 140.7 79.9 139.8 79.0 C 131.6 71.1 112.2 ' +
      '51.6 111.0 50.2 C 110.1 49.3 109.2 48.3 108.8 48.0 C 108.4 47.8 107.6 46.8 106.9 ' +
      '45.9 C 104.8 43.2 105.0 41.7 107.7 40.7 C 110.8 39.6 113.9 37.7 114.6 36.5 C 114.9 ' +
      '36.1 115.4 35.3 115.9 34.8 C 122.8 26.1 118.3 11.4 107.6 7.9 C 106.2 7.5 105.9 6.7 ' +
      '105.9 3.8 C 105.9 0.2 106.7 -0.3 110.1 0.7 C 111.1 0.9 112.1 1.1 112.4 1.0 C 112.8 ' +
      '0.9 115.0 1.3 120.2 2.5 C 123.0 3.1 129.7 5.3 131.2 6.0 C 131.8 6.3 132.7 6.7 133.4 ' +
      '6.9 C 135.3 7.5 143.4 11.8 145.9 13.5 C 152.2 17.7 152.6 18.2 151.8 21.1 C 147.3 ' +
      '37.3 162.2 52.5 178.4 48.3 C 181.5 47.5 181.7 47.5 182.7 48.6 C 184.4 50.4 188.5 ' +
      '56.7 189.0 58.4 C 189.4 59.5 189.9 60.5 190.3 61.0 C 191.4 62.1 194.6 69.7 195.5 ' +
      '73.2 C 195.8 74.4 196.3 76.0 196.6 76.9 C 196.9 77.8 197.3 79.3 197.5 80.2 C 197.7 ' +
      '81.7 198.4 84.9 198.9 87.2 C 199.0 87.7 199.1 88.5 199.1 88.9 C 199.1 89.3 199.3 ' +
      '90.2 199.4 90.9 C 200.2 93.7 199.7 94.1 195.1 94.1 C 188.0 94.1 185.0 96.3 185.4 ' +
      '101.3 C 185.9 108.1 179.1 113.2 172.4 111.1 Z M 170.9 42.4 C 165.1 41.3 159.9 37.1 ' +
      '158.5 32.4 C 157.3 28.4 157.1 26.9 157.7 25.0 C 157.9 24.3 158.2 23.2 158.4 22.4 C ' +
      '158.6 21.6 159.0 20.4 159.4 19.9 C 159.7 19.3 160.2 18.5 160.3 18.1 C 160.8 17.0 ' +
      '162.9 14.8 164.1 14.2 C 164.5 14.0 165.3 13.5 165.8 13.2 C 173.3 8.0 185.9 13.7 ' +
      '188.0 23.3 C 190.5 34.1 181.4 44.3 170.9 42.4 Z',
  },
  {
    farbe: ROT,
    d:
      'M 106.0 198.6 C 105.5 198.0 105.5 198.0 105.5 194.0 C 105.5 187.5 104.2 185.8 99.1 ' +
      '185.5 C 95.0 185.2 93.7 184.7 91.2 182.2 C 84.3 175.3 89.1 164.8 99.1 164.8 C 103.4 ' +
      '164.8 105.5 162.5 105.5 157.6 C 105.5 156.0 105.6 155.3 105.9 154.6 C 106.3 153.7 ' +
      '151.4 108.5 154.1 106.3 C 156.7 104.1 157.9 104.6 159.7 108.4 C 162.0 113.1 163.8 ' +
      '114.9 168.0 116.9 C 177.6 121.5 188.2 117.1 191.8 107.1 C 192.4 105.2 192.8 105.1 ' +
      '195.9 105.1 C 199.8 105.1 200.5 106.0 199.5 109.9 C 199.3 110.6 199.1 111.5 199.1 ' +
      '111.8 C 199.1 113.7 196.6 123.8 195.3 127.4 C 194.7 128.9 194.3 130.1 194.3 130.2 C ' +
      '194.3 131.6 188.3 143.1 184.6 148.7 C 182.4 151.9 182.0 152.1 178.4 151.2 C 174.3 ' +
      '150.3 172.8 150.1 170.7 150.6 C 166.8 151.3 166.1 151.6 163.8 152.7 C 154.2 157.2 ' +
      '149.0 168.2 151.6 178.4 C 152.4 181.5 152.3 181.8 149.5 183.8 C 139.5 191.0 125.9 ' +
      '196.5 113.0 198.4 C 112.1 198.6 110.8 198.8 110.1 198.9 C 107.9 199.3 106.6 199.2 ' +
      '106.0 198.6 Z M 168.9 187.5 C 157.2 184.3 153.6 170.0 162.3 161.6 C 175.2 149.1 ' +
      '195.0 164.1 186.6 180.1 C 183.4 186.3 175.9 189.4 168.9 187.5 Z',
  },
  {
    farbe: GRUEN,
    d:
      'M 91.0 198.9 C 90.7 198.8 90.0 198.7 89.5 198.7 C 88.5 198.7 87.8 198.6 83.4 197.7 C ' +
      '72.0 195.5 60.0 190.3 50.9 183.8 C 47.8 181.6 47.9 181.7 48.8 177.8 C 51.1 167.4 ' +
      '46.2 157.2 36.7 152.7 C 34.4 151.6 33.6 151.3 29.7 150.6 C 27.3 150.1 24.2 150.4 ' +
      '20.3 151.5 C 18.3 152.1 18.2 152.1 15.8 148.6 C 13.5 145.3 12.6 143.9 9.6 138.3 C ' +
      '6.6 132.7 3.1 122.5 1.8 115.4 C 1.5 114.0 1.2 112.4 1.1 111.8 C 1.0 111.2 0.9 110.3 ' +
      '0.9 109.8 C 0.9 109.3 0.8 108.5 0.6 108.2 C -0.4 105.5 0.3 105.1 5.6 105.1 C 12.8 ' +
      '105.1 14.2 103.9 14.5 98.2 C 14.7 94.5 15.1 93.4 17.3 91.2 C 23.9 84.4 34.7 88.4 ' +
      '34.7 97.6 C 34.7 102.8 36.7 105.0 41.5 105.1 C 42.7 105.1 44.0 105.1 44.4 105.2 C ' +
      '45.4 105.4 93.8 153.6 94.5 155.1 C 95.5 157.1 95.0 157.9 92.3 158.9 C 77.3 164.3 ' +
      '77.2 185.6 92.2 191.2 C 94.8 192.2 94.9 192.4 94.9 195.5 C 94.9 199.0 93.9 199.8 ' +
      '91.0 198.9 Z M 24.4 187.8 C 7.6 184.1 7.6 160.8 24.5 157.2 C 32.3 155.6 40.5 161.0 ' +
      '42.3 169.0 C 44.7 179.9 35.0 190.1 24.4 187.8 Z',
  },
]

const SIGNET_SCHRIFTZUG =
  'M 65.1 111.6 C 64.5 111.1 64.5 109.5 65.0 108.4 C 65.3 107.8 65.3 107.6 65.0 106.8 C ' +
  '64.4 105.2 64.5 85.9 65.2 85.3 C 65.7 84.8 70.6 84.5 71.2 84.8 C 71.5 85.0 71.6 86.6 ' +
  '71.7 93.3 C 71.8 97.9 71.9 103.8 72.0 106.4 C 72.1 112.5 72.4 112.1 68.4 112.1 C 65.8 ' +
  '112.1 65.4 112.0 65.1 111.6 Z M 85.2 111.6 C 84.8 111.0 84.7 105.8 85.1 104.0 C 85.2 ' +
  '103.2 85.2 102.5 85.1 101.8 C 84.9 101.1 84.9 98.9 85.1 95.2 C 85.2 91.3 85.2 89.0 ' +
  '85.0 87.6 C 84.6 84.7 84.6 84.7 88.7 84.7 C 92.5 84.8 92.9 84.9 94.0 86.4 C 94.4 86.9 ' +
  '95.0 87.7 95.3 88.1 C 95.6 88.5 95.9 89.1 95.9 89.4 C 96.1 90.2 98.4 93.6 99.2 94.1 C ' +
  '100.2 94.9 100.9 94.3 103.8 89.1 C 105.8 85.7 107.0 84.9 110.4 84.9 C 114.8 84.9 114.3 ' +
  '83.3 114.3 98.6 C 114.3 113.7 114.7 112.1 110.5 112.1 C 106.4 112.1 106.8 113.0 106.7 ' +
  '103.1 C 106.7 99.3 106.7 98.6 106.3 98.3 C 105.6 97.6 105.7 97.6 102.0 103.5 C 99.7 ' +
  '107.2 99.3 107.6 98.7 107.3 C 98.2 107.0 97.8 106.2 97.8 105.3 C 97.8 104.9 97.5 104.5 ' +
  '96.9 103.8 C 95.4 102.4 94.5 101.2 93.6 99.5 C 91.8 95.8 91.4 96.6 91.4 104.6 C 91.4 ' +
  '108.2 91.3 111.2 91.3 111.4 C 90.7 112.2 85.8 112.4 85.2 111.6 Z M 128.3 111.8 C 128.0 ' +
  '111.7 127.6 111.4 127.6 111.1 C 127.4 110.4 127.6 99.3 127.9 96.8 C 128.0 95.1 128.0 ' +
  '94.5 127.8 93.9 C 127.4 93.0 127.6 86.4 127.9 85.7 C 128.3 85.0 132.8 84.4 134.2 84.9 ' +
  'C 135.2 85.2 135.2 86.0 135.3 98.9 C 135.4 113.7 135.9 112.1 131.7 112.1 C 130.2 112.1 ' +
  '128.6 112.0 128.3 111.8 Z'

/**
 * Einen SVG-Pfad in PDF-Zeichenbefehle uebersetzen.
 *
 * Beide Formate kennen dieselben Bausteine – Startpunkt, Gerade, kubische
 * Kurve, Schliessen –, nur unter anderen Namen und mit umgekehrter y-Achse.
 * Die Umrechnung ist deshalb eine Ersetzung Buchstabe fuer Buchstabe: `M` wird
 * `m`, `L` wird `l`, `C` wird `c`, `Z` wird `h`. Die Punkte kommen aus einer
 * 200er-Zeichenflaeche und werden auf die gewuenschte Kantenlaenge skaliert.
 *
 * Bewusst kein allgemeiner Parser: Er verarbeitet genau die vier Befehle, die
 * in diesen Pfaden vorkommen. Taucht ein fuenfter auf, faellt das beim ersten
 * Blick auf das erzeugte PDF auf – und die Pfade aendern sich nur, wenn jemand
 * das Logo austauscht.
 */
function pfadNachPdf(d: string, x: number, oben: number, groesse: number): string {
  const s = groesse / 200
  const stuecke = d.match(/[MCLZ][^MCLZ]*/g) ?? []
  let heraus = ''

  for (const stueck of stuecke) {
    const befehl = stueck[0]
    if (befehl === 'Z') {
      heraus += 'h\n'
      continue
    }
    const zahlen = stueck.slice(1).trim().split(/\s+/).map(Number)
    const punkte: string[] = []
    for (let i = 0; i + 1 < zahlen.length; i += 2) {
      // y gespiegelt: SVG zaehlt nach unten, PDF nach oben.
      punkte.push((x + zahlen[i] * s).toFixed(2), (oben - zahlen[i + 1] * s).toFixed(2))
    }
    heraus += `${punkte.join(' ')} ${befehl === 'M' ? 'm' : befehl === 'L' ? 'l' : 'c'}\n`
  }
  return heraus
}

/**
 * Die vier Figuren im Ring.
 *
 * Jede fuellt einen Quadranten, die Verzahnungen liegen bei 12, 3, 6 und 9 Uhr,
 * die Koepfe auf den Diagonalen dazwischen – oben links Navy, oben rechts Grau,
 * unten rechts Rot, unten links Gruen.
 *
 * Der Schriftzug „IMI“ kommt erst ab einer Kantenlaenge dazu, bei der er
 * lesbar ist. Darunter waere er ein grauer Fleck; der Name steht dort ohnehin
 * als Text daneben.
 *
 * @param x Linke Kante des Zeichens.
 * @param oben Obere Kante des Zeichens.
 * @param groesse Kantenlaenge; das Zeichen ist quadratisch.
 */
function signet(x: number, oben: number, groesse: number): string {
  let heraus = ''
  for (const figur of SIGNET_FIGUREN) {
    heraus += fuellfarbe(figur.farbe) + pfadNachPdf(figur.d, x, oben, groesse) + 'f\n'
  }
  if (groesse >= 34) {
    heraus += fuellfarbe(GRAU) + pfadNachPdf(SIGNET_SCHRIFTZUG, x, oben, groesse) + 'f\n'
  }
  return heraus
}

/* --------------------------------------------------------------------------
   Der Satz
-------------------------------------------------------------------------- */

/**
 * Setzt das Dokument und gibt die fertige Datei als Bytes zurück.
 *
 * Die Aufteilung auf Seiten entsteht dabei von selbst: Reicht der Platz für die
 * nächste Zeile nicht mehr, beginnt eine neue Seite. Zwischenüberschriften
 * nehmen ihre erste Folgezeile mit – eine Überschrift allein am Seitenfuß ist
 * der klassische Satzfehler, den man beim Ausdrucken sofort sieht.
 *
 * Die erste Seite bekommt den vollen Kopf mit Signet, Titel und Farbleiste,
 * jede weitere einen schmalen: Wer ein Formular abheftet, will auf Seite drei
 * noch erkennen, wozu sie gehört, aber nicht noch einmal den ganzen Titel.
 */
export function erzeugePdf(dokument: PdfDokument): Uint8Array {
  const seiten: string[] = []
  let inhalt = ''
  let y = 0
  /** Zählt die Posten innerhalb einer Gruppe – für die Zebrastreifen. */
  let streifen = 0
  /** Zählt die Gruppen – für die Farbe des Balkens, wenn keine genannt ist. */
  let gruppen = 0

  function neueSeite() {
    const erste = seiten.length === 0 && !inhalt
    if (inhalt) seiten.push(inhalt)
    inhalt = ''
    streifen = 0

    if (erste) {
      inhalt += signet(RAND, KOPF, 40)
      const spalte = RAND + 54
      inhalt += text('F2', 17, spalte, KOPF - 21, dokument.titel, NAVY)
      if (dokument.untertitel) {
        inhalt += text('F1', 9.5, spalte, KOPF - 35, dokument.untertitel, LEISE)
      }
      if (dokument.marke) {
        inhalt += rechtsbuendig('F2', 10, RECHTS, KOPF - 21, dokument.marke, GRAU)
      }
      y = KOPF - 54
      inhalt += farbleiste(y)
      y -= 26
    } else {
      inhalt += signet(RAND, KOPF, 16)
      inhalt += text('F2', 8.5, RAND + 24, KOPF - 12, dokument.titel, GRAU)
      if (dokument.untertitel) {
        inhalt += rechtsbuendig('F1', 8, RECHTS, KOPF - 12, dokument.untertitel, LEISE)
      }
      y = KOPF - 26
      inhalt += linie(y, 0.6)
      y -= 24
    }
  }

  function platzFuer(hoehe: number): boolean {
    return y - hoehe >= UNTEN
  }

  neueSeite()

  for (const zeile of dokument.zeilen) {
    if (zeile.art === 'seitenumbruch') {
      neueSeite()
      continue
    }
    if (zeile.art === 'abstand') {
      y -= 10
      continue
    }
    if (zeile.art === 'linie') {
      if (!platzFuer(12)) neueSeite()
      y -= 5
      inhalt += linie(y, 0.5)
      y -= 7
      continue
    }

    const mass = MASSE[zeile.art]

    /*
      Erklärungen sind ganze Sätze und passen selten in eine Zeile. Sie werden
      umbrochen, bevor irgendetwas gesetzt wird – sonst liefe der Satz über den
      rechten Rand hinaus, und beim Drucken wäre er dort abgeschnitten.
    */
    /*
      Fließtext wird umbrochen wie ein Hinweis, aber in Lesegröße und in der
      Textfarbe. Der einzige Unterschied zur Hinweiszeile – und der Grund,
      warum es beide gibt: Ein Absatz, der wie eine Fußnote aussieht, wird wie
      eine Fußnote gelesen, nämlich nicht.
    */
    if (zeile.art === 'fliesstext') {
      const links = RAND
      for (const stueck of umbrich(zeile.text, mass.groesse, RECHTS - links)) {
        if (!platzFuer(mass.hoehe)) neueSeite()
        inhalt += text('F3', mass.groesse, links, y, stueck, TEXT)
        y -= mass.hoehe
      }
      y -= 4
      continue
    }

    if (zeile.art === 'hinweis') {
      const links = RAND + 10
      for (const stueck of umbrich(zeile.text, mass.groesse, RECHTS - links)) {
        if (!platzFuer(mass.hoehe)) neueSeite()
        inhalt += text('F3', mass.groesse, links, y, stueck, LEISE)
        y -= mass.hoehe
      }
      y -= 3
      continue
    }

    /*
      Eine Überschrift nimmt ihren Anfang mit auf die Seite.

      Zuerst stand hier eine einzige Folgezeile – das reichte, um die Überschrift
      nicht allein am Fuß stehen zu lassen, und ergab trotzdem einen hässlichen
      Umbruch: Überschrift, Erklärung und ein einziger Posten unten auf der
      Seite, die restlichen vier auf der nächsten. Verlangt werden deshalb zwei
      Erklärungszeilen und zwei Posten. Passt das nicht mehr, fängt die Gruppe
      geschlossen auf der nächsten Seite an.
    */
    const zusammenhalt =
      zeile.art === 'unterueberschrift' || zeile.art === 'ueberschrift'
        ? mass.hoehe + 2 * MASSE.hinweis.hoehe + 2 * MASSE.zeile.hoehe
        : mass.hoehe

    if (!platzFuer(zusammenhalt)) neueSeite()

    /*
      Das Ergebnis steht in einem ausgefüllten Kasten.

      Ein Nettovermögen, das als eine weitere fette Zeile unter zwanzig anderen
      steht, findet beim Durchblättern niemand wieder. Der Kasten kostet nichts
      und beantwortet die Frage, wegen der das Blatt existiert, auf einen Blick.
    */
    if (zeile.art === 'abschluss') {
      /*
        Sechs Punkt Luft über dem Kasten.

        Ohne sie reichte seine Oberkante in die Zeile darüber und deckte deren
        Schreiblinie zu – auf dem leeren Bogen fehlte hinter „Schulden gesamt“
        die Linie, und zwar nur dort. Ein Fehler, den man in der Datei nicht
        sieht, sondern erst auf dem Blatt.
      */
      y -= 6
      inhalt += flaeche(RAND, y - 9, RECHTS - RAND, 30, NAVY)
      inhalt += text('F2', mass.groesse, RAND + 12, y, zeile.text, WEISS)
      if (zeile.betrag) {
        inhalt += rechtsbuendig('F2', 13, RECHTS - 12, y, zeile.betrag, WEISS)
      } else if (zeile.schreiblinie) {
        inhalt += strecke(RECHTS - 142, RECHTS - 12, y - 3, 0.6, WEISS)
      }
      y -= mass.hoehe - 6
      streifen = 0
      continue
    }

    /*
      Jede Gruppe bekommt links einen schmalen Balken in einer Logofarbe. Er
      trennt die Gruppen ohne eine weitere Linie und gibt dem Blatt die Farben
      der Marke, ohne dass irgendwo eine Fläche eingefärbt werden müsste.
    */
    if (zeile.art === 'unterueberschrift') {
      const farbe = zeile.ton ? TOENE[zeile.ton] : REIHUM[gruppen % REIHUM.length]
      gruppen += 1
      streifen = 0

      inhalt += flaeche(RAND, y - 2.5, 3.5, mass.groesse + 3, farbe)
      inhalt += text('F2', mass.groesse, RAND + 11, y, zeile.text, NAVY)
      if (zeile.betrag) {
        // Dieselbe Kante wie bei den Posten darunter: Eine Gruppensumme, die
        // acht Punkt weiter rechts endet als ihre eigenen Zeilen, sieht nach
        // Versehen aus und nicht nach Gliederung.
        inhalt += rechtsbuendig('F2', 10.5, RECHTS - 8, y, zeile.betrag, NAVY)
      }
      y -= mass.hoehe
      continue
    }

    if (zeile.art === 'ueberschrift') {
      inhalt += text('F2', mass.groesse, RAND, y, zeile.text, NAVY)
      y -= mass.hoehe
      continue
    }

    /*
      Summen liegen auf einem hellen Band statt unter einer Linie. Auf dem
      Papier ist der Unterschied deutlich: Eine Linie gehört zur Zeile darüber,
      ein Band gehört zur Zeile selbst.
    */
    if (zeile.art === 'summe') {
      inhalt += flaeche(RAND, y - 5.5, RECHTS - RAND, mass.hoehe, BAND)
      inhalt += text('F2', mass.groesse, RAND + 11, y, zeile.text, NAVY)
      if (zeile.betrag) {
        inhalt += rechtsbuendig('F2', mass.groesse, RECHTS - 8, y, zeile.betrag, NAVY)
      } else if (zeile.schreiblinie) {
        inhalt += strecke(RECHTS - 138, RECHTS - 8, y - 3, 0.6, GRAU)
      }
      y -= mass.hoehe + 4
      streifen = 0
      continue
    }

    /*
      Die Posten selbst: jede zweite Zeile bekommt einen sehr hellen Grund.
      Auf einer Liste mit sechsundzwanzig Einträgen und einer Betragsspalte am
      anderen Blattende ist das der Unterschied zwischen Nachschauen und
      Verrutschen.

      Auf dem Blatt zum Ausfüllen entfällt er: Dort führt schon die Schreiblinie
      das Auge, und beides zusammen war nicht nur zu viel, sondern mehrdeutig –
      die Linie einer ungestreiften Zeile endete unmittelbar über dem Streifen
      der nächsten und sah aus, als gehöre sie zu dieser.
    */
    if (streifen % 2 === 1 && !zeile.schreiblinie) {
      inhalt += flaeche(RAND, y - 4.5, RECHTS - RAND, mass.hoehe, ZEBRA)
    }
    streifen += 1

    const links = zeile.eingerueckt ? RAND + 11 : RAND
    inhalt += text('F1', mass.groesse, links, y, zeile.text, TEXT)

    if (zeile.betrag) {
      inhalt += rechtsbuendig('F1', mass.groesse, RECHTS - 8, y, zeile.betrag, TEXT)
    } else if (zeile.schreiblinie) {
      // Die Linie zum Eintragen mit der Hand – ohne sie weiß niemand, wie
      // weit die Spalte reicht.
      inhalt += strecke(RECHTS - 130, RECHTS - 8, y - 3, 0.5, HAARLINIE)
    }

    y -= mass.hoehe
  }

  seiten.push(inhalt)

  /* ------------------------------------------------------------------ Fuß */
  const mitFuss = seiten.map((seite, nummer) => {
    const links = dokument.fusszeile ?? ''
    const rechts = `Seite ${nummer + 1} von ${seiten.length}`
    return (
      seite +
      linie(UNTEN + 16, 0.5) +
      // Ohne Fußzeile wird auch kein leerer Textbefehl gesetzt.
      (links ? text('F1', 8, RAND, UNTEN, links, LEISE) : '') +
      rechtsbuendig('F1', 8, RECHTS, UNTEN, rechts, LEISE)
    )
  })

  /* -------------------------------------------------------------- Objekte */
  const objekte: string[] = []
  const seitenIds: number[] = []

  // 1 Katalog, 2 Seitenbaum, 3–5 Schriften. Danach je Seite zwei Objekte.
  const ERSTE_SEITE = 6
  mitFuss.forEach((_, nummer) => seitenIds.push(ERSTE_SEITE + nummer * 2))

  objekte.push('<< /Type /Catalog /Pages 2 0 R >>')
  objekte.push(
    `<< /Type /Pages /Kids [${seitenIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${mitFuss.length} >>`
  )
  for (const schrift of ['Helvetica', 'Helvetica-Bold', 'Helvetica-Oblique']) {
    objekte.push(
      `<< /Type /Font /Subtype /Type1 /BaseFont /${schrift} /Encoding /WinAnsiEncoding >>`
    )
  }

  mitFuss.forEach((seite, nummer) => {
    const id = seitenIds[nummer]
    objekte.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${BREITE} ${HOEHE}] ` +
        `/Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> ` +
        `/Contents ${id + 1} 0 R >>`
    )
    objekte.push(`<< /Length ${seite.length} >>\nstream\n${seite}endstream`)
  })

  /* ---------------------------------------------------------------- Datei */
  let datei = '%PDF-1.4\n'
  const positionen: number[] = []

  objekte.forEach((objekt, stelle) => {
    positionen.push(datei.length)
    datei += `${stelle + 1} 0 obj\n${objekt}\nendobj\n`
  })

  const xref = datei.length
  datei += `xref\n0 ${objekte.length + 1}\n0000000000 65535 f \n`
  for (const position of positionen) {
    datei += `${position.toString().padStart(10, '0')} 00000 n \n`
  }
  datei += `trailer\n<< /Size ${objekte.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`

  const bytes = new Uint8Array(datei.length)
  for (let i = 0; i < datei.length; i += 1) bytes[i] = datei.charCodeAt(i) & 0xff
  return bytes
}
