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
  /**
   * Das Ende des **Geschäftsjahres**, `JJJJ-MM-TT` – oder leer.
   *
   * Die Spalte heißt `決算期末 / Fiscal Year-end`, und sie meint genau das:
   * nicht das Ende des gemeldeten Quartals, sondern das Ende des
   * Geschäftsjahres, in dem es liegt. Ein Unternehmen mit Bilanzstichtag
   * 31. März, das am 29. Juli 2026 sein erstes Quartal meldet, steht mit
   * `2027-03-31` da.
   *
   * Der Unterschied ist kein Detail. Wer die Spalte für das Periodenende
   * hält, rechnet einen Abstand von **minus 245 Tagen** aus – die Meldung
   * läge vor dem Ende des Zeitraums, den sie meldet. Genau so ist es am
   * 24. August 2026 zuerst gemessen worden, und erst die negative Zahl hat
   * den Irrtum aufgedeckt.
   */
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
 * Weil über der Tabelle mehr steht als eine Beschriftung. Gemessen an
 * `kessan06_0807.xlsx` am 20. August 2026 stehen dort vier Dinge: der Titel
 * der Liste auf Japanisch und Englisch, der Satz `2026年8月6日 現在 As of
 * 2026/8/6`, und erst dann die Spaltennamen – die ihrerseits zweisprachig
 * sind, mit einem Zeilenumbruch **innerhalb** der Zelle
 * (`決算発表予定日\r\nScheduled Dates for Earnings Announcements`).
 *
 * Wer eine einzelne Zeile als Kopf nimmt, findet die eine Hälfte der Spalten
 * und die andere nicht – und merkt es nicht, weil die gefundenen Spalten
 * stimmen. Genau so ist der erste Lauf durchgegangen: 3.209 Zeilen gelesen,
 * Meldetag und Code richtig, Firmenname und Geschäftsjahresende still leer.
 *
 * Zusammengefasst über alle Zeilen davor stimmt es unabhängig davon, ob die
 * Börse den Kopf auf eine Zeile schreibt oder auf zwei.
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
 * ## Warum hier nichts zusammengefasst und nichts weggelassen wird
 *
 * Die erste Fassung behielt je Börsencode den **frühesten** Termin und
 * verwarf den Rest. Das klang richtig – „der spätere gehört nicht auf die
 * Seite, solange der frühere aussteht" – und war es nicht: Die Börse führt
 * zwei Dateien nebeneinander, und ein Unternehmen kann in beiden stehen, mit
 * einem zurückliegenden Tag in der einen und einem kommenden in der anderen.
 * Der frühere ist dann der vergangene, und der kommende fiel weg.
 *
 * Aus demselben Grund wird auch nicht nach der Zukunft gefiltert: Ob ein
 * Termin noch kommt, entscheidet der Aufrufer. Eine Quelle, die nur
 * zurückliegende Tage führt, ist etwas anderes als eine, die zu unseren
 * Titeln nichts sagt – und diese beiden Fälle dürfen nicht beide als leere
 * Liste ankommen.
 *
 * Was hier passiert, ist deshalb nur eines: doppelte Zeilen entfernen.
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

  const jeZeile = new Map<string, JpxTermin>()
  const koepfe: string[] = []
  let stand: string | null = null

  for (const adresse of adressen) {
    const tabelle = parseTabelle(blattZeilen(await holeRoh(adresse)))
    koepfe.push(tabelle.kopf.join(' | '))
    // Der älteste genannte Stand – die Liste ist nur so frisch wie ihr ältestes Blatt.
    if (tabelle.stand && (!stand || tabelle.stand < stand)) stand = tabelle.stand

    for (const termin of tabelle.termine) {
      jeZeile.set(`${termin.code}|${termin.termin}`, termin)
    }
  }

  if (jeZeile.size === 0) {
    throw new JpxOhneTabelle(
      `${adressen.length} Datei(en) gelesen, aber kein einziger Termin darin.`
    )
  }

  return { stand, kopf: koepfe, termine: [...jeZeile.values()] }
}

/* ------------------------------------------------- Der nächste Termin */

/**
 * Warum aus dieser Liste überhaupt etwas abgeleitet wird.
 *
 * Die Börse führt je Datei die Unternehmen, deren Quartal in einem bestimmten
 * **Monat** endete. Für unsere Titel – fast alle mit Bilanzstichtag 31. März –
 * heißt das: viermal im Jahr ein paar Wochen Vorlauf, dazwischen nichts. Am
 * 24. August 2026 stand die Liste voll mit Terminen, und **kein einziger** lag
 * noch in der Zukunft (`inListe: 67`, `kommend: 0`).
 *
 * Dieselbe Zeile sagt aber mehr, als sie auf den ersten Blick hergibt: Aus dem
 * Geschäftsjahresende folgen die vier Quartalsenden, und aus dem gemeldeten
 * Tag folgt, wie viele Tage nach einem Quartalsende dieses Unternehmen meldet.
 * Beides zusammen ergibt die nächsten Termine.
 *
 * Gemessen an den 67 geführten japanischen Titeln, Stand 6. August 2026:
 * 23 bis 43 Tage, Median 34. Das ist kein Streuwert, sondern ein Muster – und
 * es ist dasselbe Muster, aus dem die SEC-Ableitung ihre Termine bildet.
 *
 * **Was hier entsteht, ist eine Schätzung und wird als solche gekennzeichnet.**
 * Ein angekündigter Tag aus der Liste selbst geht ihr immer vor.
 */

/** Der letzte Tag des Monats, in dem `jahr`/`monat` liegt. */
function monatsende(jahr: number, monat: number): string {
  const naechster = new Date(Date.UTC(monat === 12 ? jahr + 1 : jahr, monat % 12, 1))
  naechster.setUTCDate(naechster.getUTCDate() - 1)
  return naechster.toISOString().slice(0, 10)
}

/**
 * Die vier Quartalsenden des Geschäftsjahres, das an `gjEnde` endet.
 *
 * Aufsteigend, das Geschäftsjahresende zuletzt. Gerechnet wird über
 * Monatsenden und nicht über Tagesabstände: Ein Geschäftsjahr, das am
 * 31. März endet, hat sein erstes Quartal am 30. Juni davor – und der
 * 30. Juni ist kein fester Abstand vom 31. März, sondern das Ende des
 * Monats drei Quartale vorher.
 */
export function quartalsenden(gjEnde: string): string[] {
  const [jahr, monat] = gjEnde.split('-').map(Number)
  if (!jahr || !monat) return []

  const enden: string[] = []
  for (let zurueck = 3; zurueck >= 0; zurueck--) {
    let m = monat - 3 * zurueck
    let j = jahr
    while (m <= 0) {
      m += 12
      j -= 1
    }
    enden.push(monatsende(j, m))
  }
  return enden
}

/** Tage zwischen zwei ISO-Tagen, `a` minus `b`. */
function tageZwischen(a: string, b: string): number {
  return Math.round((Date.parse(a) - Date.parse(b)) / 86_400_000)
}

/** Ein Tag plus `n` Tage. */
function plusTage(tag: string, n: number): string {
  const d = new Date(`${tag}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/** Was eine Zeile über das Meldeverhalten ihres Unternehmens sagt. */
export interface Meldemuster {
  code: string
  /** Das Quartalsende, das die gemeldete Zeile betrifft. */
  quartalsende: string
  /** Die Stelle dieses Quartals im Geschäftsjahr, 1 bis 4. */
  stelle: number
  /** Tage zwischen Quartalsende und Meldung. */
  abstand: number
}

/**
 * Welches Quartal eine Zeile meldet – und wie spät.
 *
 * Gesucht wird das Quartalsende **unmittelbar vor** dem gemeldeten Tag. Liegt
 * die Meldung vor dem ersten Quartalsende des Geschäftsjahres, gehört sie zum
 * Vorjahr; dann wird dessen letztes Quartal genommen.
 *
 * `null`, wenn die Zeile kein Geschäftsjahresende trägt oder der Abstand
 * unplausibel ist. Eine Meldung ein halbes Jahr nach dem Quartalsende ist
 * keine Quartalsmeldung, sondern ein Fehler in der Zuordnung – und ein Fehler
 * gehört verworfen, nicht gemittelt.
 */
export function meldemuster(termin: JpxTermin): Meldemuster | null {
  if (!termin.periodenende || !termin.termin) return null

  const enden = quartalsenden(termin.periodenende)
  if (enden.length !== 4) return null

  const [jahr, monat] = termin.periodenende.split('-').map(Number)
  const vorjahr = quartalsenden(monatsende(jahr - 1, monat))
  const alle = [...vorjahr, ...enden]

  const davor = alle.filter((ende) => ende < termin.termin)
  if (davor.length === 0) return null
  const quartal = davor[davor.length - 1]

  const abstand = tageZwischen(termin.termin, quartal)

  /*
    Die Grenze fängt kein „langsames Unternehmen", sondern ein falsches Datum.

    Quartalsenden liegen drei Monate auseinander; ein Abstand zum
    *unmittelbar vorangehenden* Ende kann strukturell nie über 92 Tage
    kommen. Wogegen die Grenze wirklich schützt, ist ein `periodenende`, das
    beim Lesen der Tabelle verrutscht ist – genau das ist in diesem Projekt
    schon passiert, als Toyotas Börsencode 7203 als Excel-Datum gelesen wurde
    und den 24. September 1919 ergab. Ein solcher Wert erzeugt einen Abstand
    von Zehntausenden Tagen, und ohne diese Zeile liefe er in den Median.
  */
  if (abstand < 1 || abstand > 92) return null

  return {
    code: termin.code,
    quartalsende: quartal,
    stelle:
      (enden.indexOf(quartal) === -1
        ? vorjahr.indexOf(quartal)
        : enden.indexOf(quartal)) + 1,
    abstand,
  }
}

/** Der mittlere Wert einer Reihe – robust gegen einzelne Ausreißer. */
function median(werte: number[]): number {
  if (werte.length === 0) return 0
  const sortiert = [...werte].sort((a, b) => a - b)
  return sortiert[Math.floor(sortiert.length / 2)]
}

/**
 * Wie lange der Markt je Quartalsstelle braucht.
 *
 * Der Abstand hängt an der Stelle im Geschäftsjahr: Das erste Quartal wird
 * schneller gemeldet als der Jahresabschluss, weil der geprüft werden muss.
 * Gemessen am 24. August 2026 lagen die Häufungen bei rund 29, 37, 42 und
 * 42 Tagen – zwischen dem ersten Quartal und dem Jahresabschluss also knapp
 * zwei Wochen.
 *
 * Wer den Abstand eines Unternehmens aus **einem** Quartal auf alle vier
 * überträgt, liegt deshalb bei dreien davon systematisch zu früh. Die
 * Verschiebung wird hier aus derselben Datei gemessen – über alle Zeilen,
 * nicht nur über unsere – und dann auf den eigenen Abstand angewandt.
 */
export function abstandJeStelle(termine: readonly JpxTermin[]): Map<number, number> {
  const jeStelle = new Map<number, number[]>()

  for (const termin of termine) {
    const muster = meldemuster(termin)
    if (!muster) continue
    const bisher = jeStelle.get(muster.stelle)
    if (bisher) bisher.push(muster.abstand)
    else jeStelle.set(muster.stelle, [muster.abstand])
  }

  return new Map([...jeStelle].map(([stelle, werte]) => [stelle, median(werte)]))
}

/**
 * Ein abgeleiteter Tag, der auf ein Wochenende fällt, wird vorgezogen.
 *
 * Keine Börse meldet am Samstag. Ein geschätzter Tag, der dort landet, ist
 * nicht bloß ungenau, sondern erkennbar falsch – und untergräbt das Vertrauen
 * in die übrigen Schätzungen, die richtig liegen.
 *
 * **Vorgezogen und nicht verschoben:** Japanische Unternehmen melden nach
 * Handelsschluss; der Freitag davor ist die wahrscheinlichere Wahl als der
 * Montag danach. Feiertage bleiben unberücksichtigt – eine japanische
 * Feiertagsliste führt dieses Projekt nicht, und eine geratene wäre schlechter
 * als keine.
 */
function aufWerktag(tag: string): string {
  const wochentag = new Date(`${tag}T00:00:00Z`).getUTCDay()
  if (wochentag === 6) return plusTage(tag, -1)
  if (wochentag === 0) return plusTage(tag, -2)
  return tag
}

/**
 * Wie weit die Abstände je Quartalsstelle streuen.
 *
 * Ein abgeleiteter Tag ohne Streuungsangabe behauptet eine Genauigkeit, die er
 * nicht hat. Genommen wird die halbe Spanne zwischen dem 10. und dem 90.
 * Hundertstel – nicht die volle Spanne, die an einem einzigen Ausreißer hängt,
 * und nicht die Standardabweichung, die eine Normalverteilung unterstellt, die
 * hier niemand geprüft hat.
 */
export function streuungJeStelle(termine: readonly JpxTermin[]): Map<number, number> {
  const jeStelle = new Map<number, number[]>()

  for (const termin of termine) {
    const muster = meldemuster(termin)
    if (!muster) continue
    const bisher = jeStelle.get(muster.stelle)
    if (bisher) bisher.push(muster.abstand)
    else jeStelle.set(muster.stelle, [muster.abstand])
  }

  return new Map(
    [...jeStelle].map(([stelle, werte]) => {
      const sortiert = [...werte].sort((a, b) => a - b)
      const unten = sortiert[Math.floor((sortiert.length - 1) * 0.1)]
      const oben = sortiert[Math.floor((sortiert.length - 1) * 0.9)]
      return [stelle, Math.max(1, Math.round((oben - unten) / 2))]
    })
  )
}

/** Ein abgeleiteter Termin, mit dem Quartal, auf das er sich bezieht. */
export interface AbgeleiteterTermin {
  quartalsende: string
  erwartet: string
  stelle: number
}

/**
 * Die nächsten Meldetermine eines Unternehmens, abgeleitet.
 *
 * Aus dem eigenen beobachteten Abstand, verschoben um das, was der Markt für
 * die jeweilige Quartalsstelle braucht. Ein Unternehmen, das sein erstes
 * Quartal nach 23 Tagen meldet, meldet seinen Jahresabschluss nicht nach 23,
 * sondern nach 23 plus der Differenz der beiden Medianwerte.
 *
 * Ausgegeben werden nur Tage nach `heute`, höchstens `anzahl`.
 */
export function abgeleiteteTermine(
  termin: JpxTermin,
  jeStelle: ReadonlyMap<number, number>,
  heute: string,
  anzahl = 4
): AbgeleiteterTermin[] {
  const muster = meldemuster(termin)
  if (!muster) return []

  const eigen = jeStelle.get(muster.stelle)
  const gefunden: AbgeleiteterTermin[] = []

  /*
    Zwei Geschäftsjahre durchgehen, nicht eines.

    Wer nur das laufende nimmt, bekommt gegen Jahresende ein oder zwei
    Termine statt vier – und ausgerechnet dann, wenn der Blick nach vorn am
    meisten wert ist.
  */
  const [jahr, monat] = termin.periodenende.split('-').map(Number)
  const enden = [
    ...quartalsenden(termin.periodenende),
    ...quartalsenden(monatsende(jahr + 1, monat)),
  ]

  for (const [i, quartal] of enden.entries()) {
    const stelle = (i % 4) + 1
    const marktStelle = jeStelle.get(stelle)

    /*
      Der eigene Abstand, verschoben – oder, wenn der Markt zu einer Stelle
      nichts hergibt, der eigene unverändert. Geraten wird nichts.
    */
    const abstand =
      marktStelle !== undefined && eigen !== undefined
        ? muster.abstand + (marktStelle - eigen)
        : muster.abstand

    const erwartet = aufWerktag(plusTage(quartal, Math.round(abstand)))
    if (erwartet <= heute) continue

    gefunden.push({ quartalsende: quartal, erwartet, stelle })
    if (gefunden.length >= anzahl) break
  }

  return gefunden
}
