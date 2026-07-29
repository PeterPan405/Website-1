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
 * Linien, Seitenumbruch. Ein PDF, das nur das kann, ist eine überschaubare
 * Datei – und niemand muss eine Abhängigkeit pflegen, deren Rest er nie
 * benutzt.
 *
 * ## Warum keine Schriftart eingebettet wird
 *
 * PDF-Betrachter müssen vierzehn Standardschriften mitbringen, darunter
 * Helvetica und Courier. Wer sie benutzt, spart das Einbetten vollständig –
 * die Datei bleibt bei wenigen Kilobyte, und es gibt keine Lizenzfrage.
 *
 * ## Warum die Beträge in Courier stehen
 *
 * Weil Zahlen rechtsbündig gehören und PDF keine Ausrichtung kennt: Man muss
 * die Textbreite selbst ausrechnen und die Startposition entsprechend
 * verschieben. Bei Helvetica hieße das, für jedes Zeichen eine Breitentabelle
 * mitzuführen. Courier ist dicktengleich – jedes Zeichen misst genau 0,6 der
 * Schriftgröße –, und damit ist die Breite eine Multiplikation. Nebenbei stehen
 * die Ziffern dadurch exakt untereinander, was in einer Tabelle ohnehin richtig
 * ist.
 *
 * ## Warum die Datei als Zeichenkette entsteht
 *
 * Eine PDF-Datei enthält am Ende eine Tabelle mit den Byte-Positionen aller
 * Objekte. Die auszurechnen ist nur dann einfach, wenn ein Zeichen genau einem
 * Byte entspricht. Deshalb wird alles zunächst als Zeichenkette gebaut, in der
 * jedes Zeichen einen Code unter 256 hat, und erst ganz am Ende Zeichen für
 * Zeichen in Bytes übersetzt.
 */

/** Eine Zeile im Dokument. */
export type PdfZeile =
  | { art: 'ueberschrift'; text: string }
  | { art: 'unterueberschrift'; text: string; betrag?: string }
  | { art: 'zeile'; text: string; betrag?: string; eingerueckt?: boolean }
  | { art: 'summe'; text: string; betrag?: string }
  | { art: 'hinweis'; text: string }
  | { art: 'abstand' }
  | { art: 'linie' }
  | { art: 'seitenumbruch' }

export interface PdfDokument {
  titel: string
  /** Steht klein unter dem Titel, etwa der Stichtag. */
  untertitel?: string
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

/** Schriftgrößen und Zeilenhöhen je Zeilenart. */
const MASSE = {
  ueberschrift: { groesse: 15, hoehe: 26, fett: true },
  unterueberschrift: { groesse: 11, hoehe: 20, fett: true },
  zeile: { groesse: 9.5, hoehe: 15, fett: false },
  summe: { groesse: 9.5, hoehe: 17, fett: true },
  hinweis: { groesse: 8, hoehe: 12, fett: false },
} as const

/** Breite eines Courier-Textes: dicktengleich, jedes Zeichen 0,6 der Größe. */
function courierBreite(text: string, groesse: number): number {
  return text.length * groesse * 0.6
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
 *
 * Rechtsbündige Beträge stehen deshalb weiterhin in Courier: Dort ist die
 * Breite exakt, und exakt muss sie sein, damit die Ziffern untereinander
 * stehen.
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

/** Ein Textbefehl im Inhaltsstrom. */
function text(schrift: string, groesse: number, x: number, y: number, inhalt: string) {
  return `BT /${schrift} ${groesse} Tf 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${kodiere(inhalt)}) Tj ET\n`
}

/** Eine waagerechte Linie in hellem Grau. */
function linie(y: number, staerke = 0.5, grau = 0.75) {
  return `${grau} G ${staerke} w ${RAND} ${y.toFixed(2)} m ${RECHTS} ${y.toFixed(2)} l S\n`
}

/**
 * Setzt das Dokument und gibt die fertige Datei als Bytes zurück.
 *
 * Die Aufteilung auf Seiten entsteht dabei von selbst: Reicht der Platz für die
 * nächste Zeile nicht mehr, beginnt eine neue Seite. Zwischenüberschriften
 * nehmen ihre erste Folgezeile mit – eine Überschrift allein am Seitenfuß ist
 * der klassische Satzfehler, den man beim Ausdrucken sofort sieht.
 */
export function erzeugePdf(dokument: PdfDokument): Uint8Array {
  const seiten: string[] = []
  let inhalt = ''
  let y = 0

  function neueSeite() {
    if (inhalt) seiten.push(inhalt)
    inhalt = ''
    y = HOEHE - RAND

    inhalt += text('F2', MASSE.ueberschrift.groesse, RAND, y, dokument.titel)
    y -= 16
    if (dokument.untertitel) {
      inhalt += text('F1', 9, RAND, y, dokument.untertitel)
      y -= 6
    }
    y -= 8
    inhalt += linie(y)
    y -= 18
  }

  function platzFuer(hoehe: number): boolean {
    return y - hoehe >= UNTEN
  }

  neueSeite()

  dokument.zeilen.forEach((zeile, stelle) => {
    if (zeile.art === 'seitenumbruch') {
      neueSeite()
      return
    }
    if (zeile.art === 'abstand') {
      y -= 8
      return
    }
    if (zeile.art === 'linie') {
      if (!platzFuer(10)) neueSeite()
      y -= 4
      inhalt += linie(y, 0.5, 0.85)
      y -= 6
      return
    }

    const mass = MASSE[zeile.art]

    /*
      Erklärungen sind ganze Sätze und passen selten in eine Zeile. Sie werden
      umbrochen, bevor irgendetwas gesetzt wird – sonst liefe der Satz über den
      rechten Rand hinaus, und beim Drucken wäre er dort abgeschnitten.
    */
    if (zeile.art === 'hinweis') {
      for (const stueck of umbrich(zeile.text, mass.groesse, RECHTS - RAND)) {
        if (!platzFuer(mass.hoehe)) neueSeite()
        inhalt += text('F1', mass.groesse, RAND, y, stueck)
        y -= mass.hoehe
      }
      return
    }

    /*
      Eine Überschrift braucht die nächste Zeile bei sich. Sonst steht sie
      unten allein und ihr Inhalt beginnt auf der nächsten Seite.
    */
    const zusammenhalt =
      zeile.art === 'unterueberschrift' || zeile.art === 'ueberschrift'
        ? mass.hoehe + MASSE.zeile.hoehe
        : mass.hoehe

    if (!platzFuer(zusammenhalt)) neueSeite()

    const schrift = mass.fett ? 'F2' : 'F1'
    const eingerueckt = zeile.art === 'zeile' && zeile.eingerueckt ? RAND + 14 : RAND

    if (zeile.art === 'summe') {
      y -= 3
      inhalt += linie(y + mass.groesse + 2, 0.5, 0.85)
    }

    inhalt += text(schrift, mass.groesse, eingerueckt, y, zeile.text)

    const betrag = 'betrag' in zeile ? zeile.betrag : undefined
    if (betrag) {
      const breite = courierBreite(betrag, mass.groesse)
      inhalt += text(mass.fett ? 'F4' : 'F3', mass.groesse, RECHTS - breite, y, betrag)
    }

    y -= mass.hoehe
    void stelle
  })

  seiten.push(inhalt)

  /* ------------------------------------------------------------------ Fuß */
  const mitFuss = seiten.map((seite, nummer) => {
    const links = dokument.fusszeile ?? ''
    const rechts = `Seite ${nummer + 1} von ${seiten.length}`
    return (
      seite +
      linie(UNTEN + 14, 0.5, 0.85) +
      // Ohne Fußzeile wird auch kein leerer Textbefehl gesetzt.
      (links ? text('F1', 8, RAND, UNTEN, links) : '') +
      text('F3', 8, RECHTS - courierBreite(rechts, 8), UNTEN, rechts)
    )
  })

  /* -------------------------------------------------------------- Objekte */
  const objekte: string[] = []
  const seitenIds: number[] = []

  // 1 Katalog, 2 Seitenbaum, 3–6 Schriften. Danach je Seite zwei Objekte.
  const ERSTE_SEITE = 7
  mitFuss.forEach((_, nummer) => seitenIds.push(ERSTE_SEITE + nummer * 2))

  objekte.push('<< /Type /Catalog /Pages 2 0 R >>')
  objekte.push(
    `<< /Type /Pages /Kids [${seitenIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${mitFuss.length} >>`
  )
  for (const schrift of ['Helvetica', 'Helvetica-Bold', 'Courier', 'Courier-Bold']) {
    objekte.push(
      `<< /Type /Font /Subtype /Type1 /BaseFont /${schrift} /Encoding /WinAnsiEncoding >>`
    )
  }

  mitFuss.forEach((seite, nummer) => {
    const id = seitenIds[nummer]
    objekte.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${BREITE} ${HOEHE}] ` +
        `/Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R /F4 6 0 R >> >> ` +
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
