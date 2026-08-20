import { inflateRawSync } from 'node:zlib'

/**
 * Ein Tabellenblatt aus einer XLSX-Datei – ohne Fremdbibliothek.
 *
 * ## Warum selbst geschrieben
 *
 * Amtliche Termin- und Kennzahlenlisten kommen als Tabelle. Die Tokioter Börse
 * veröffentlicht die geplanten Meldetermine aller gelisteten Unternehmen als
 * XLSX und aktualisiert sie börsentäglich; ohne einen Leser dafür bleibt diese
 * Quelle zu.
 *
 * Eine XLSX ist ein ZIP aus XML-Dateien, und Node bringt beides mit: `zlib`
 * entpackt, ein regulärer Ausdruck liest. Das sind hundertfünfzig Zeilen gegen
 * eine Abhängigkeit mit Hunderttausenden – und dieses Projekt schreibt seinen
 * PDF-Erzeuger und seinen CSV-Zerleger aus demselben Grund selbst.
 *
 * ## Was dieser Leser nicht kann
 *
 * Formeln, Formatierungen, mehrere Blätter, Zip64. Er liest das erste
 * Arbeitsblatt als Text und sonst nichts. Für eine Terminliste ist das alles,
 * was gebraucht wird – und was er nicht kann, meldet er, statt es zu raten.
 */

/** Ein Eintrag im Zip-Verzeichnis, so weit er hier gebraucht wird. */
interface Zipeintrag {
  name: string
  /** 0 = unkomprimiert, 8 = deflate. Alles andere wird abgelehnt. */
  verfahren: number
  groesseGepackt: number
  /** Beginn des lokalen Dateikopfs. */
  kopfAb: number
}

const EOCD_SIGNATUR = 0x06054b50
const CD_SIGNATUR = 0x02014b50
const LOKAL_SIGNATUR = 0x04034b50

/** Wird geworfen, wenn die Datei kein lesbares ZIP ist. */
export class ZipUnlesbar extends Error {}

/**
 * Das Inhaltsverzeichnis eines ZIP.
 *
 * Gelesen wird vom **Ende** her: Ein ZIP führt sein Verzeichnis hinten, und
 * nur so lässt sich eine Datei lesen, an deren Anfang etwas anderes steht.
 * Der Abschluss trägt einen Kommentar veränderlicher Länge, deshalb wird die
 * Signatur rückwärts gesucht statt an einer festen Stelle erwartet.
 */
function verzeichnis(daten: Buffer): Zipeintrag[] {
  let eocd = -1
  const frueheste = Math.max(0, daten.length - 65_557)
  for (let i = daten.length - 22; i >= frueheste; i--) {
    if (daten.readUInt32LE(i) === EOCD_SIGNATUR) {
      eocd = i
      break
    }
  }
  if (eocd === -1) throw new ZipUnlesbar('Kein ZIP-Abschluss gefunden.')

  const anzahl = daten.readUInt16LE(eocd + 10)
  let ab = daten.readUInt32LE(eocd + 16)

  /*
    Zip64 wird nicht gelesen, aber erkannt.

    Bei mehr als 65.535 Einträgen oder über vier Gigabyte stehen an diesen
    Stellen lauter Einsen, und das Verzeichnis liegt woanders. Wer das
    übersieht, liest ab einer zufälligen Stelle weiter und bekommt Unsinn, der
    wie Daten aussieht.
  */
  if (ab === 0xffffffff || anzahl === 0xffff) {
    throw new ZipUnlesbar('Zip64 – diese Datei ist zu groß für diesen Leser.')
  }

  const eintraege: Zipeintrag[] = []
  for (let i = 0; i < anzahl; i++) {
    if (ab + 46 > daten.length || daten.readUInt32LE(ab) !== CD_SIGNATUR) {
      throw new ZipUnlesbar(`Verzeichniseintrag ${i} ist unlesbar.`)
    }
    const namensLaenge = daten.readUInt16LE(ab + 28)
    const extraLaenge = daten.readUInt16LE(ab + 30)
    const kommentarLaenge = daten.readUInt16LE(ab + 32)

    eintraege.push({
      name: daten.toString('utf8', ab + 46, ab + 46 + namensLaenge),
      verfahren: daten.readUInt16LE(ab + 10),
      groesseGepackt: daten.readUInt32LE(ab + 20),
      kopfAb: daten.readUInt32LE(ab + 42),
    })

    ab += 46 + namensLaenge + extraLaenge + kommentarLaenge
  }

  return eintraege
}

/**
 * Eine Datei aus dem ZIP, entpackt.
 *
 * Die Größe kommt aus dem **Verzeichnis** und nicht aus dem lokalen Kopf: Wer
 * beim Schreiben einen Datenanhang verwendet, lässt die Längen im lokalen Kopf
 * auf null stehen. Aus dem lokalen Kopf werden nur die beiden Längenfelder
 * gelesen, die sagen, wo die Daten anfangen.
 */
function entpacke(daten: Buffer, eintrag: Zipeintrag): Buffer {
  const ab = eintrag.kopfAb
  if (ab + 30 > daten.length || daten.readUInt32LE(ab) !== LOKAL_SIGNATUR) {
    throw new ZipUnlesbar(`Dateikopf von ${eintrag.name} ist unlesbar.`)
  }

  const namensLaenge = daten.readUInt16LE(ab + 26)
  const extraLaenge = daten.readUInt16LE(ab + 28)
  const beginn = ab + 30 + namensLaenge + extraLaenge
  const roh = daten.subarray(beginn, beginn + eintrag.groesseGepackt)

  if (eintrag.verfahren === 0) return Buffer.from(roh)
  if (eintrag.verfahren === 8) return inflateRawSync(roh)
  throw new ZipUnlesbar(
    `${eintrag.name} ist mit Verfahren ${eintrag.verfahren} gepackt – nur 0 und 8 werden gelesen.`
  )
}

/** Die Dateien eines ZIP, entpackt, nach Namen. */
export function dateienImZip(daten: Buffer): Map<string, Buffer> {
  const ergebnis = new Map<string, Buffer>()
  for (const eintrag of verzeichnis(daten)) {
    if (eintrag.name.endsWith('/')) continue
    ergebnis.set(eintrag.name, entpacke(daten, eintrag))
  }
  return ergebnis
}

/** XML-Entitäten auflösen – mehr braucht es für Zellinhalte nicht. */
function entzerre(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, ziffern: string) => String.fromCodePoint(Number(ziffern)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCodePoint(Number.parseInt(hex, 16))
    )
    .replace(/&amp;/g, '&')
}

/**
 * Die gemeinsame Zeichenkettentabelle.
 *
 * ## Die Falle, um die es hier geht
 *
 * Text steht in einer XLSX **nicht in der Zelle**. Die Zelle trägt eine Nummer
 * und das Merkmal `t="s"`; der Text liegt in `sharedStrings.xml`. Wer das
 * übersieht, bekommt eine Tabelle voller Zahlen, die wie Daten aussehen und
 * Indizes sind – und das fällt niemandem auf, weil eine Zahl an einer
 * Datumsstelle wie ein Datum aussieht.
 *
 * Ein Eintrag kann in mehrere Stücke zerfallen, wenn Teile des Textes anders
 * formatiert sind. Deshalb werden alle `<t>` eines `<si>` zusammengehängt.
 */
function zeichenketten(xml: string): string[] {
  const ergebnis: string[] = []
  for (const [, si] of xml.matchAll(/<si>([\s\S]*?)<\/si>/g)) {
    const stuecke = [...si.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((treffer) =>
      entzerre(treffer[1])
    )
    ergebnis.push(stuecke.join(''))
  }
  return ergebnis
}

/**
 * Das erste Arbeitsblatt als Zeilen von Zellen.
 *
 * Leere Zellen bleiben leer statt zu fehlen – sonst verschöbe eine
 * ausgelassene Zelle jede Spalte dahinter, und ein verschobenes Datum sieht
 * aus wie ein Datum. Dafür wird die Spalte aus dem Zellbezug gelesen
 * (`C7` → dritte Spalte) und nicht mitgezählt.
 */
export function blattZeilen(xlsx: Buffer): string[][] {
  const dateien = dateienImZip(xlsx)

  const blattName = [...dateien.keys()]
    .filter((name) => /^xl\/worksheets\/sheet\d+\.xml$/.test(name))
    .sort()[0]
  if (!blattName) throw new ZipUnlesbar('Keine Arbeitsblätter in der Datei.')

  const texte = dateien.has('xl/sharedStrings.xml')
    ? zeichenketten(dateien.get('xl/sharedStrings.xml')!.toString('utf8'))
    : []

  const blatt = dateien.get(blattName)!.toString('utf8')
  const zeilen: string[][] = []

  for (const [, roh] of blatt.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
    const felder: string[] = []
    for (const [, merkmale, koerper] of roh.matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)) {
      const bezug = /r="([A-Z]+)\d+"/.exec(merkmale)
      if (bezug) {
        // `A` = 0, `B` = 1, … `AA` = 26. Fehlende Zellen werden aufgefüllt.
        let spalte = 0
        for (const zeichen of bezug[1]) {
          spalte = spalte * 26 + (zeichen.charCodeAt(0) - 64)
        }
        while (felder.length < spalte - 1) felder.push('')
      }

      const wert = /<v>([\s\S]*?)<\/v>/.exec(koerper)
      if (/t="s"/.test(merkmale) && wert) {
        const nummer = Number(wert[1])
        felder.push(texte[nummer] ?? '')
      } else if (/t="inlineStr"/.test(merkmale)) {
        const stuecke = [...koerper.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((treffer) =>
          entzerre(treffer[1])
        )
        felder.push(stuecke.join(''))
      } else {
        felder.push(wert ? entzerre(wert[1]) : '')
      }
    }
    zeilen.push(felder)
  }

  return zeilen
}

/**
 * Ein Excel-Seriendatum als ISO-Tag.
 *
 * ## Warum der 30. Dezember 1899
 *
 * Excel zählt seit dem 1. Januar 1900 – und hält 1900 fälschlich für ein
 * Schaltjahr. Der Fehler stammt aus Lotus 1-2-3 und wurde absichtlich
 * übernommen, damit alte Dateien weiter stimmten. Wer vom 31. Dezember 1899
 * aus rechnet, liegt deshalb für jedes Datum nach dem Februar 1900 – also für
 * praktisch jedes – um einen Tag daneben. Der 30. Dezember gleicht das aus.
 *
 * Ein Tag daneben ist bei einem Meldetermin kein Schönheitsfehler: Wer am
 * Vortag kauft, kauft in die Zahlen hinein.
 */
export function ausExcelDatum(serie: number): string | null {
  if (!Number.isFinite(serie) || serie < 1) return null

  /*
    Vor dem 1. März 1900 stimmt die Zählung nicht – dort sitzt der erfundene
    29. Februar. Solche Daten kommen in Terminlisten nicht vor, und ein
    stillschweigend um einen Tag verschobener Wert wäre schlechter als keiner.
  */
  if (serie < 61) return null

  const zeitpunkt = Date.UTC(1899, 11, 30) + Math.floor(serie) * 86_400_000
  const tag = new Date(zeitpunkt)
  if (Number.isNaN(tag.getTime())) return null
  return tag.toISOString().slice(0, 10)
}
