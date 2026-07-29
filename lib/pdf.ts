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
 * Weil es aus vier Kreisbögen, vier Kreisen und nichts weiter besteht. Als
 * Bild müsste es in einer festen Auflösung mitgeliefert werden und wäre im
 * Ausdruck entweder pixelig oder unnötig groß. Als Vektor sind es zweihundert
 * Byte im Inhaltsstrom, und es druckt in jeder Größe scharf. Die Maße stammen
 * aus `public/logo.svg`; die Bögen sind dort dieselben.
 *
 * Ein Unterschied fällt beim Übertragen an: SVG zählt die y-Achse nach unten,
 * PDF nach oben. Ein Winkel im Logo wird hier deshalb zu seinem Gegenwinkel.
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

const GRAD = Math.PI / 180

/**
 * Ein Kreisbogen als kubische Bézierkurven.
 *
 * PDF kennt keinen Bogen, nur Kurven. Ein Viertelkreis lässt sich mit einer
 * Kurve so genau nachbilden, dass der Fehler unter einem Promille des Radius
 * bleibt; der Faktor dafür ist 4/3·tan(Winkel/4). Größere Bögen werden in
 * Stücke von höchstens 90 Grad zerlegt.
 */
function kreisbogen(mx: number, my: number, r: number, von: number, bis: number): string {
  const stuecke = Math.max(1, Math.ceil(Math.abs(bis - von) / 90))
  const schritt = (bis - von) / stuecke
  const k = (4 / 3) * Math.tan((schritt * GRAD) / 4)
  const px = (w: number) => mx + r * Math.cos(w * GRAD)
  const py = (w: number) => my + r * Math.sin(w * GRAD)

  let winkel = von
  let pfad = `${px(winkel).toFixed(2)} ${py(winkel).toFixed(2)} m\n`

  for (let i = 0; i < stuecke; i += 1) {
    const naechst = winkel + schritt
    const x1 = px(winkel) - k * r * Math.sin(winkel * GRAD)
    const y1 = py(winkel) + k * r * Math.cos(winkel * GRAD)
    const x2 = px(naechst) + k * r * Math.sin(naechst * GRAD)
    const y2 = py(naechst) - k * r * Math.cos(naechst * GRAD)
    pfad +=
      `${x1.toFixed(2)} ${y1.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)} ` +
      `${px(naechst).toFixed(2)} ${py(naechst).toFixed(2)} c\n`
    winkel = naechst
  }
  return pfad
}

/** Ein voller Kreis aus vier Kurven; 0,5523 ist der bekannte Näherungsfaktor. */
function kreis(mx: number, my: number, r: number): string {
  const k = r * 0.5523
  const z = (wert: number) => wert.toFixed(2)
  return (
    `${z(mx + r)} ${z(my)} m\n` +
    `${z(mx + r)} ${z(my + k)} ${z(mx + k)} ${z(my + r)} ${z(mx)} ${z(my + r)} c\n` +
    `${z(mx - k)} ${z(my + r)} ${z(mx - r)} ${z(my + k)} ${z(mx - r)} ${z(my)} c\n` +
    `${z(mx - r)} ${z(my - k)} ${z(mx - k)} ${z(my - r)} ${z(mx)} ${z(my - r)} c\n` +
    `${z(mx + k)} ${z(my - r)} ${z(mx + r)} ${z(my - k)} ${z(mx + r)} ${z(my)} c\n`
  )
}

/**
 * Die vier Figuren im Ring.
 *
 * Je Figur ein Viertelbogen als Körper und ein Kopfkreis, der mittig über dem
 * eigenen Körper auf der Diagonale sitzt und in ihn hineinreicht – gleiche
 * Farbe und Überlappung lassen beide zu einer Form verschmelzen. Die Maße sind
 * dieselben wie in `public/logo.svg`: Radius 60, Strichstärke 32, Köpfe mit
 * Radius 19 auf den Diagonalen, dazwischen 14 Grad Lücke.
 *
 * Die Winkel sind gegenüber der SVG-Fassung gespiegelt, weil PDF die y-Achse
 * nach oben zählt. Der Schriftzug „IMI“ aus dem Volllogo fehlt bewusst: In den
 * Größen, in denen das Zeichen hier steht, wäre er ein grauer Fleck – der Name
 * steht stattdessen als lesbarer Text daneben.
 *
 * @param x Linke Kante des Zeichens.
 * @param oben Obere Kante des Zeichens.
 * @param groesse Kantenlänge; das Zeichen ist quadratisch.
 */
function signet(x: number, oben: number, groesse: number): string {
  const s = groesse / 200
  const mx = x + 100 * s
  const my = oben - 100 * s

  const figuren = [
    { farbe: NAVY, von: 173, bis: 97, kopf: [43.43, 43.43] },
    { farbe: GRAU, von: 83, bis: 7, kopf: [156.57, 43.43] },
    { farbe: ROT, von: -7, bis: -83, kopf: [156.57, 156.57] },
    { farbe: GRUEN, von: -97, bis: -173, kopf: [43.43, 156.57] },
  ] as const

  // `q … Q` kapselt die runden Linienenden, damit sie nicht auf die Linien
  // der Tabelle abfärben.
  let heraus = 'q 1 J\n'
  for (const figur of figuren) {
    heraus +=
      strichfarbe(figur.farbe) +
      `${(32 * s).toFixed(2)} w\n` +
      kreisbogen(mx, my, 60 * s, figur.von, figur.bis) +
      'S\n'
    heraus +=
      fuellfarbe(figur.farbe) +
      kreis(x + figur.kopf[0] * s, oben - figur.kopf[1] * s, 19 * s) +
      'f\n'
  }
  return heraus + 'Q\n'
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
      const farbe = zeile.ton
        ? TOENE[zeile.ton]
        : REIHUM[gruppen % REIHUM.length]
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
