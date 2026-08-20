import { ausExcelDatum, blattZeilen } from '@/lib/xlsx'

/**
 * Angekündigte Meldetermine der Tokioter Börse.
 *
 * ## Warum diese Quelle
 *
 * Der Betreiber hat am 20. August 2026 auf Vollständigkeit bestanden – und
 * darauf, dass es dafür keinen bezahlten Tarif braucht. Für Japan stimmt das:
 * Die JPX führt die geplanten Meldetermine **aller** gelisteten Unternehmen
 * selbst und legt sie als Tabelle offen ins Netz. Die Seite sagt dazu: „The
 * schedule … will be updated at around 5:00 p.m. each business day."
 *
 * Amtlich, täglich, kostenlos, ohne Schlüssel und ohne Anmeldung. Das ist die
 * beste Art von Quelle, die es für diese Frage gibt – besser als jeder
 * Datenhändler, weil hier keine Zwischenhand mehr sitzt.
 *
 * 72 der 1.029 geführten Aktien notieren in Tokio.
 *
 * ## Was diese Quelle nicht hergibt: die Uhrzeit
 *
 * Die Tabelle nennt den **Tag** und sonst nichts. Es gibt in ihr keine Spalte
 * für die Uhrzeit, und es gibt auch keine zweite JPX-Datei, die sie hätte.
 *
 * Die Versuchung ist groß, sie zu ergänzen: In Tokio meldet fast jedes
 * Unternehmen nach Handelsschluss um 15:00 Uhr Ortszeit. Das wäre eine
 * Faustregel, keine Angabe – und dieses Projekt schreibt keine Zahl hin, die
 * niemand gelesen hat. Ein japanischer Termin trägt deshalb ein Datum und
 * keine Zeit, und die Aktienseite sagt das auch so.
 *
 * ## Die Adresse steht nicht fest
 *
 * Der Dateiname trägt ein Datum (`kessan06_0807.xlsx`), und es sind zwei
 * Dateien nebeneinander. Beides ändert sich. Fest verdrahtet hielte diese
 * Anbindung ein paar Wochen und lieferte danach still nichts mehr – der
 * teuerste Fehler ist nicht der rote Lauf, sondern der stille.
 *
 * Deshalb wird die Übersichtsseite gelesen und jeder Verweis auf eine XLSX
 * genommen, der dort steht. Gemessen am 20. August 2026: zwei Stück. Die
 * **englische** Fassung der Seite trägt keinen einzigen – sie verweist für die
 * Liste auf die japanische. Wer die englische nähme, bekäme kein Ergebnis und
 * keinen Fehler.
 */

/** Die Übersichtsseite – die japanische, denn nur sie führt die Dateien. */
export const JPX_TERMINSEITE =
  'https://www.jpx.co.jp/listing/event-schedules/financial-announcement/index.html'

/** Wird geworfen, wenn die Seite keine Tabelle mehr anbietet. */
export class JpxOhneTabelle extends Error {}

/** Ein angekündigter Meldetermin aus Tokio. */
export interface JpxTermin {
  /** Der Code der Tokioter Börse, vierstellig, z. B. `7203`. */
  code: string
  /** Der Name in lateinischer Schrift, wie die Börse ihn führt. */
  name: string
  /** Der angekündigte Meldetag, `JJJJ-MM-TT`. */
  termin: string
  /** Ende des Berichtszeitraums, `JJJJ-MM-TT` – oder leer. */
  periodenende: string
}

/**
 * Die Verweise auf die Terminlisten, absolut.
 *
 * Gesucht wird nach der Endung und nicht nach dem Namen: `kessan` ist der
 * heutige Name, nicht das Versprechen der Börse.
 */
export function tabellenAdressen(
  html: string,
  basis: string = JPX_TERMINSEITE
): string[] {
  const gefunden: string[] = []
  const gesehen = new Set<string>()

  for (const [, ziel] of html.matchAll(/href\s*=\s*["']([^"']+\.xlsx)["']/gi)) {
    let absolut: string
    try {
      absolut = new URL(ziel.trim(), basis).toString()
    } catch {
      continue
    }
    if (gesehen.has(absolut)) continue
    gesehen.add(absolut)
    gefunden.push(absolut)
  }

  return gefunden
}

/**
 * Ein Tabellenwert als ISO-Tag.
 *
 * Excel legt Daten als Zahl ab – 46206 ist der 3. Juli 2026. Manche Tabellen
 * führen daneben Textdaten, deshalb beide Wege. Was auf keinen von beiden
 * passt, wird abgelehnt statt geraten.
 */
function alsTag(wert: string): string {
  const roh = wert.trim()
  if (!roh) return ''

  if (/^\d+(\.\d+)?$/.test(roh)) {
    const zahl = Number(roh)
    /*
      Ein Seriendatum aus einer Terminliste liegt zwischen 1990 und 2100 –
      also zwischen 32.874 und 73.050. Ohne diese Schranke würde ein
      Börsencode wie 7203 zum 24. September 1919, und ein Datum aus dem Jahr
      1919 sieht in einer Datenbank aus wie ein Datum.
    */
    if (zahl < 32_874 || zahl > 73_050) return ''
    return ausExcelDatum(zahl) ?? ''
  }

  const iso = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/.exec(roh)
  if (iso) {
    return `${iso[1]}-${iso[2].padStart(2, '0')}-${iso[3].padStart(2, '0')}`
  }

  return ''
}

/** Kopfzeilen der JPX-Tabelle, japanisch und englisch. */
const SPALTEN = {
  termin: ['決算発表予定日', 'scheduled date'],
  code: ['コード', 'code'],
  name: ['issue name', '会社名', 'company name'],
  periodenende: ['決算期末', 'fiscal year end'],
}

/**
 * Findet eine Spalte über die Kopfzeile – nicht über eine feste Stelle.
 *
 * Gesucht wird in der Reihenfolge der **Namen**, nicht in der der Spalten: Die
 * Tabelle führt den Firmennamen zweimal, japanisch in `会社名` und lateinisch
 * in `Issue Name`, und `会社名` steht davor. Wer über die Spalten läuft, bekommt
 * „トヨタ自動車" – richtig, aber auf dieser Website unlesbar.
 */
function spalteMit(kopf: string[], namen: string[]): number {
  const klein = kopf.map((zelle) => zelle.trim().toLowerCase())
  for (const name of namen) {
    const gesucht = name.toLowerCase()
    const genau = klein.indexOf(gesucht)
    if (genau !== -1) return genau
    const enthalten = klein.findIndex((zelle) => zelle.includes(gesucht))
    if (enthalten !== -1) return enthalten
  }
  return -1
}

/** Ein Börsencode der JPX: vier Zeichen, das erste eine Ziffer. */
const CODE = /^[0-9][0-9A-Z]{3}$/

/**
 * Die Spaltenüberschriften – zusammengefasst über **alle** Kopfzeilen.
 *
 * ## Warum nicht eine Zeile
 *
 * Weil es keine ist. Gemessen an `kessan06_0807.xlsx` am 20. August 2026:
 * Zeile 5 trägt `決算発表予定日`, Zeile 6 trägt
 * `Scheduled Dates for Earnings Announcements` und daneben `コード`. Die
 * japanische und die englische Beschriftung stehen untereinander, und keine
 * der beiden Zeilen allein beschriftet die Tabelle vollständig.
 *
 * Wer eine davon nimmt, findet die eine Hälfte der Spalten und die andere
 * nicht – und merkt es nicht, weil die gefundenen Spalten stimmen. Genau so
 * ist der erste Lauf durchgegangen: 3.209 Zeilen gelesen, Meldetag und Code
 * richtig, Firmenname und Geschäftsjahresende still leer.
 */
function kopfBlock(zeilen: string[][], bis: number): string[] {
  const breite = Math.max(0, ...zeilen.slice(0, bis).map((zeile) => zeile.length))
  // Dicht gefüllt und nicht über Indexzuweisung: Ein Loch im Array ist beim
  // Durchlaufen `undefined`, und das hat keine Methoden.
  const spalten = Array.from({ length: breite }, () => '')

  for (const zeile of zeilen.slice(0, bis)) {
    zeile.forEach((zelle, i) => {
      const text = zelle.trim()
      if (!text) return
      spalten[i] = spalten[i] ? `${spalten[i]} ${text}` : text
    })
  }
  return spalten
}

/**
 * Der Stand, den die Datei selbst nennt.
 *
 * Über der Tabelle steht `As of 2026/8/6`. Das ist nicht dasselbe wie der Tag
 * des Abrufs, und der Unterschied ist die ganze Auskunft: Am 20. August war
 * die Datei zwei Wochen alt, weil die Berichtssaison vorbei war. Ohne diese
 * Angabe sähe eine leere Ausbeute nach einem Fehler aus statt nach dem, was
 * sie ist.
 */
function standAus(zeilen: string[][]): string | null {
  for (const zeile of zeilen.slice(0, 12)) {
    for (const zelle of zeile) {
      const treffer =
        /as of\s*(\d{4})\/(\d{1,2})\/(\d{1,2})/i.exec(zelle) ??
        /(\d{4})年(\d{1,2})月(\d{1,2})日/.exec(zelle)
      if (treffer) {
        return `${treffer[1]}-${treffer[2].padStart(2, '0')}-${treffer[3].padStart(2, '0')}`
      }
    }
  }
  return null
}

/** Was aus einer JPX-Datei herauskommt – samt dem, was über sie selbst dasteht. */
export interface JpxTabelle {
  /** Der Stand laut Datei, `JJJJ-MM-TT` – oder `null`, wenn sie keinen nennt. */
  stand: string | null
  /** Die erkannten Spaltenüberschriften. Gehört ins Protokoll, nicht auf die Seite. */
  kopf: string[]
  termine: JpxTermin[]
}

/**
 * Liest eine JPX-Terminliste.
 *
 * ## Warum die Spalten gesucht und nicht gezählt werden
 *
 * Die Tabelle hat elf Spalten, davon vier japanisch und vier englisch
 * beschriftet. Eine eingeschobene Spalte verschöbe alles dahinter, und ein
 * verschobenes Datum sieht aus wie ein Datum. Derselbe Grund wie beim
 * Sammelkalender: Der Kopf ist die einzige Stelle, an der die Quelle selbst
 * sagt, was wo steht.
 *
 * ## Warum die Datenzeilen den Kopf finden und nicht umgekehrt
 *
 * Weil der Kopf über mehrere Zeilen geht und über der Tabelle noch Titel und
 * Stand stehen. Eine Datenzeile dagegen ist unverwechselbar: Sie trägt einen
 * vierstelligen Börsencode **und** eine Zahl aus dem Datumsbereich. Ab der
 * ersten solchen Zeile beginnen die Daten; alles darüber ist Kopf.
 *
 * ## Warum ein Fehler statt einer leeren Liste
 *
 * Baut die Börse ihre Datei um, ist das Ergebnis kein „heute keine Termine" –
 * es ist ein Ausfall. Eine leere Liste wäre nicht von einem ruhigen Tag zu
 * unterscheiden, und der Lauf bliebe grün.
 */
export function parseTabelle(zeilen: string[][]): JpxTabelle {
  const datenAb = zeilen.findIndex(
    (zeile) =>
      zeile.some((zelle) => CODE.test(zelle.trim().toUpperCase())) &&
      zeile.some((zelle) => alsTag(zelle) !== '')
  )
  if (datenAb === -1) {
    throw new JpxOhneTabelle(
      'Keine Zeile mit Börsencode und Datum gefunden – die Datei hat ein anderes Format.'
    )
  }

  const kopf = kopfBlock(zeilen, datenAb)
  const iTermin = spalteMit(kopf, SPALTEN.termin)
  const iCode = spalteMit(kopf, SPALTEN.code)
  const iName = spalteMit(kopf, SPALTEN.name)
  const iEnde = spalteMit(kopf, SPALTEN.periodenende)

  if (iTermin === -1 || iCode === -1) {
    throw new JpxOhneTabelle(
      `Meldetag oder Code sind im Kopf nicht zu finden. Erkannt: ${kopf.join(' | ') || '(nichts)'}`
    )
  }

  const termine: JpxTermin[] = []
  for (const zeile of zeilen.slice(datenAb)) {
    const code = (zeile[iCode] ?? '').trim().toUpperCase()
    if (!CODE.test(code)) continue

    const termin = alsTag(zeile[iTermin] ?? '')
    if (!termin) continue

    termine.push({
      code,
      name: iName === -1 ? '' : (zeile[iName] ?? '').trim(),
      termin,
      periodenende: iEnde === -1 ? '' : alsTag(zeile[iEnde] ?? ''),
    })
  }

  return { stand: standAus(zeilen), kopf, termine }
}

/*
  Die Börse sieht einen Abruf ohne Kennung; ein Absender gehört dazu. Das ist
  eine Höflichkeit und keine Umgehung – wo eine Quelle eine Sperre setzt, wird
  sie in diesem Projekt nicht umgangen, sondern vermerkt.
*/
const KOPFZEILEN: Record<string, string> = {
  'User-Agent': 'im-invests.de Terminabgleich (Kontakt über iminvests.de)',
}

async function holeRoh(url: string): Promise<Buffer> {
  const antwort = await fetch(url, { headers: KOPFZEILEN })
  if (!antwort.ok) {
    throw new JpxOhneTabelle(`${url} antwortet mit ${antwort.status}.`)
  }
  return Buffer.from(await antwort.arrayBuffer())
}

/**
 * Holt alle Terminlisten der JPX und führt sie zusammen.
 *
 * Zu einem Code kann in zwei Dateien ein Termin stehen. Genommen wird der
 * **frühere**: Der spätere gehört nicht auf die Aktienseite, solange der
 * frühere noch aussteht.
 *
 * Gefiltert wird hier **nicht** nach der Zukunft. Ob ein Termin noch kommt,
 * entscheidet der Aufrufer – und er soll dabei sehen können, was in der Datei
 * stand. Eine Quelle, die nur zurückliegende Tage führt, ist etwas anderes als
 * eine, die zu unseren Titeln nichts sagt, und diese beiden Fälle dürfen nicht
 * beide als leere Liste ankommen.
 */
export async function holeTermine(): Promise<JpxTabelle> {
  const seite = await (await fetch(JPX_TERMINSEITE, { headers: KOPFZEILEN })).text()
  const adressen = tabellenAdressen(seite)

  if (adressen.length === 0) {
    throw new JpxOhneTabelle(
      `Die Übersichtsseite führt keine XLSX mehr (${JPX_TERMINSEITE}). ` +
        'Zu prüfen wäre, ob die Börse die Liste verschoben hat.'
    )
  }

  const jeCode = new Map<string, JpxTermin>()
  const koepfe: string[] = []
  let stand: string | null = null

  for (const adresse of adressen) {
    const tabelle = parseTabelle(blattZeilen(await holeRoh(adresse)))
    koepfe.push(tabelle.kopf.join(' | '))
    // Der älteste genannte Stand – die Liste ist nur so frisch wie ihr ältestes Blatt.
    if (tabelle.stand && (!stand || tabelle.stand < stand)) stand = tabelle.stand

    for (const termin of tabelle.termine) {
      const vorhanden = jeCode.get(termin.code)
      if (!vorhanden || termin.termin < vorhanden.termin) jeCode.set(termin.code, termin)
    }
  }

  if (jeCode.size === 0) {
    throw new JpxOhneTabelle(
      `${adressen.length} Datei(en) gelesen, aber kein einziger Termin darin.`
    )
  }

  return { stand, kopf: koepfe, termine: [...jeCode.values()] }
}
