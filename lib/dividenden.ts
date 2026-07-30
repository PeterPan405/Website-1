/**
 * Was sich aus einer Reihe gezahlter Dividenden ablesen lässt – und was nicht.
 *
 * ## Die Quelle kennt nur die Vergangenheit
 *
 * Der Kursabruf liefert je Titel die Dividenden, die **gezahlt wurden**, mit
 * Tag und Betrag je Aktie. Das ist eine belegte Tatsache. Wann die nächste
 * kommt, steht dort nicht – Yahoo liefert im Chart keine künftigen Termine,
 * und ein Unternehmen kündigt seine Dividende erst wenige Wochen vorher an.
 *
 * Also wird gerechnet: Zahlt eine Firma seit Jahren im Februar, Mai, August
 * und November, ist der nächste Termin gut abschätzbar. Diese Schätzung ist
 * nützlich – aber sie ist eine Schätzung, und dieses Modul gibt deshalb immer
 * mit heraus, worauf sie beruht und wie weit das Muster streut. Der Kalender
 * kennzeichnet solche Termine sichtbar als abgeleitet; das ist dort schon für
 * die Quartalszahlen so geregelt und gilt hier genauso.
 *
 * ## Warum die Rendite ohne Währungsumrechnung stimmt
 *
 * Dividende und Kurs stehen in derselben Einheit – bei britischen Titeln
 * beide in Pence, in Johannesburg beide in Cent. Bei der Division kürzt sich
 * die Einheit heraus, und die Rendite ist richtig, ohne dass irgendetwas
 * umgerechnet werden müsste. Genau bei dieser Kennzahl entfällt damit die
 * Fehlerquelle, die bei Kurs-Gewinn- und Kurs-Buchwert-Verhältnis den Faktor
 * 100 verursacht hat.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 */

/** Eine gezahlte Dividende. */
export interface Zahlung {
  /** Tag des Dividendenabschlags, `JJJJ-MM-TT`. */
  date: string
  /** Betrag je Aktie, in der Einheit des Kurses. */
  amount: number
}

/**
 * Wie oft im Jahr gezahlt wird.
 *
 * `unregelmaessig` ist kein Sammelbecken für Fehler, sondern eine Aussage:
 * Es gibt Unternehmen, die einmalig ausschütten oder ihren Rhythmus wechseln.
 * Wer dort einen Termin hochrechnet, rechnet ins Blaue.
 */
export type Rhythmus =
  'monatlich' | 'quartalsweise' | 'halbjaehrlich' | 'jaehrlich' | 'unregelmaessig'

export const rhythmusLabel: Record<Rhythmus, string> = {
  monatlich: 'monatlich',
  quartalsweise: 'vierteljährlich',
  halbjaehrlich: 'halbjährlich',
  jaehrlich: 'jährlich',
  unregelmaessig: 'unregelmäßig',
}

/** Zahlungen je Jahr, für die Umrechnung auf eine Jahresrendite. */
const ZAHLUNGEN_JE_JAHR: Record<Rhythmus, number> = {
  monatlich: 12,
  quartalsweise: 4,
  halbjaehrlich: 2,
  jaehrlich: 1,
  unregelmaessig: 0,
}

export interface Dividendenbefund {
  /** Die jüngste Zahlung. */
  letzte: Zahlung
  rhythmus: Rhythmus
  /** Summe der Zahlungen der letzten zwölf Monate, in der Einheit des Kurses. */
  summeZwoelfMonate: number
  /** Wie viele Zahlungen in diese Summe eingegangen sind. */
  zahlungenZwoelfMonate: number
  /**
   * Jahresrendite in Prozent, oder `null` ohne brauchbaren Kurs.
   *
   * Grundlage ist die Summe der letzten zwölf Monate – die tatsächlich
   * gezahlte, nicht eine aus der letzten Zahlung hochgerechnete. Wer eine
   * Quartalsdividende mit vier multipliziert, unterstellt drei Zahlungen, die
   * noch nicht beschlossen sind.
   */
  renditeProzent: number | null
  /** Der geschätzte nächste Abschlagstag, `JJJJ-MM-TT`. */
  naechsterErwartet: string | null
  /** Woraus geschätzt wurde: der Tag vor einem Jahr im gleichen Zyklus. */
  schaetzungBasis: string | null
  /** Wie weit die Abstände bisher gestreut haben, in Tagen. */
  streuungTage: number
}

/** Tage zwischen zwei Kalendertagen, ohne Zeitzonenfallen. */
function tageZwischen(von: string, bis: string): number {
  const a = Date.parse(`${von}T00:00:00Z`)
  const b = Date.parse(`${bis}T00:00:00Z`)
  return Math.round((b - a) / 86400000)
}

/** Verschiebt einen Kalendertag um Tage. */
function plusTage(datum: string, tage: number): string {
  const zeit = Date.parse(`${datum}T00:00:00Z`) + tage * 86400000
  return new Date(zeit).toISOString().slice(0, 10)
}

function median(werte: number[]): number {
  const sortiert = [...werte].sort((a, b) => a - b)
  const mitte = Math.floor(sortiert.length / 2)
  return sortiert.length % 2 === 1
    ? sortiert[mitte]
    : (sortiert[mitte - 1] + sortiert[mitte]) / 2
}

/**
 * Ordnet den mittleren Abstand einem Rhythmus zu.
 *
 * Die Fenster sind großzügig, weil Abschlagstage an Wochenenden und
 * Feiertagen verrutschen: Ein Vierteljahr sind 91 Tage, gemessen werden je
 * nach Jahr 88 bis 95.
 */
function zuRhythmus(mittlererAbstand: number): Rhythmus {
  if (mittlererAbstand >= 20 && mittlererAbstand <= 45) return 'monatlich'
  if (mittlererAbstand >= 70 && mittlererAbstand <= 115) return 'quartalsweise'
  if (mittlererAbstand >= 150 && mittlererAbstand <= 225) return 'halbjaehrlich'
  if (mittlererAbstand >= 300 && mittlererAbstand <= 430) return 'jaehrlich'
  return 'unregelmaessig'
}

/**
 * Wertet die Zahlungsreihe eines Titels aus.
 *
 * @param zahlungen Alle bekannten Zahlungen, Reihenfolge beliebig.
 * @param kurs Der aktuelle Kurs in derselben Einheit wie die Beträge.
 * @param heute Bezugstag für „letzte zwölf Monate“ und die Schätzung.
 * @returns `null`, wenn es keine Zahlung gibt – dann zahlt der Titel keine
 *   Dividende, und es gibt nichts anzuzeigen.
 */
export function werteDividenden(
  zahlungen: readonly Zahlung[],
  kurs: number | null,
  heute: string
): Dividendenbefund | null {
  const gueltig = zahlungen
    .filter((z) => /^\d{4}-\d{2}-\d{2}$/.test(z.date) && z.amount > 0)
    .sort((a, b) => a.date.localeCompare(b.date))
  if (gueltig.length === 0) return null

  const letzte = gueltig[gueltig.length - 1]

  /*
    Der Rhythmus wird aus den letzten drei Jahren bestimmt, nicht aus allen
    Daten: Wer vor fünf Jahren jährlich zahlte und heute vierteljährlich,
    soll als vierteljährlich gelten. Drei Jahre sind lang genug für ein
    Muster und kurz genug, um eine Umstellung nachzuvollziehen.
  */
  const grenze = plusTage(heute, -3 * 365)
  const jung = gueltig.filter((z) => z.date >= grenze)
  const fuerMuster = jung.length >= 2 ? jung : gueltig
  const abstaende: number[] = []
  for (let i = 1; i < fuerMuster.length; i += 1) {
    abstaende.push(tageZwischen(fuerMuster[i - 1].date, fuerMuster[i].date))
  }

  const rhythmus =
    abstaende.length === 0 ? 'unregelmaessig' : zuRhythmus(median(abstaende))
  const streuungTage =
    abstaende.length === 0
      ? 0
      : Math.round(Math.max(...abstaende) - Math.min(...abstaende))

  const vorZwoelfMonaten = plusTage(heute, -365)
  const letztesJahr = gueltig.filter((z) => z.date > vorZwoelfMonaten)
  const summeZwoelfMonate = letztesJahr.reduce((summe, z) => summe + z.amount, 0)

  /*
    Die Rendite braucht ein vollständiges Jahr. Zahlt eine Firma
    vierteljährlich, liegen aber nur zwei Zahlungen in den letzten zwölf
    Monaten, dann fehlt die Hälfte – eine daraus gebildete Rendite wäre
    halbiert und sähe aus wie eine Aussage über das Unternehmen. Lieber keine
    Zahl als eine halbe.
  */
  const erwartet = ZAHLUNGEN_JE_JAHR[rhythmus]
  const vollstaendig = erwartet > 0 && letztesJahr.length >= erwartet
  const renditeProzent =
    kurs !== null && kurs > 0 && summeZwoelfMonate > 0 && vollstaendig
      ? (summeZwoelfMonate / kurs) * 100
      : null

  /*
    Geschätzt wird über den Tag im Vorjahreszyklus, nicht über „letzter Tag
    plus mittlerer Abstand“. Der Unterschied zeigt sich bei Firmen mit festen
    Monaten: Zahlt eine seit Jahren Anfang Mai, führt der Jahresbezug wieder
    auf Anfang Mai, während sich beim Addieren von Abständen der Fehler jedes
    Quartal weiterschiebt.
  */
  let naechsterErwartet: string | null = null
  let schaetzungBasis: string | null = null
  if (rhythmus !== 'unregelmaessig') {
    const schritt = Math.round(365 / ZAHLUNGEN_JE_JAHR[rhythmus])
    const basis = gueltig.find((z) => tageZwischen(z.date, letzte.date) >= 330) ?? null
    let kandidat = plusTage(letzte.date, schritt)
    // Bei sehr alten Reihen kann der geschätzte Termin in der Vergangenheit
    // liegen; dann wird weitergezählt, bis er in der Zukunft liegt.
    let sicherung = 0
    while (kandidat <= heute && sicherung < 40) {
      kandidat = plusTage(kandidat, schritt)
      sicherung += 1
    }
    naechsterErwartet = kandidat
    schaetzungBasis = basis?.date ?? gueltig[0].date
  }

  return {
    letzte,
    rhythmus,
    summeZwoelfMonate,
    zahlungenZwoelfMonate: letztesJahr.length,
    renditeProzent,
    naechsterErwartet,
    schaetzungBasis,
    streuungTage,
  }
}
