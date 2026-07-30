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
 * Der Rhythmus einer Reihe, aus den Abständen der letzten drei Jahre.
 *
 * Drei Jahre, nicht alle Daten: Wer vor fünf Jahren jährlich zahlte und heute
 * vierteljährlich, soll als vierteljährlich gelten. Der Zeitraum ist lang genug
 * für ein Muster und kurz genug, um eine Umstellung nachzuvollziehen.
 *
 * Erwartet eine aufsteigend sortierte, geprüfte Reihe.
 */
function bestimmeRhythmus(
  gueltig: readonly Zahlung[],
  heute: string
): { rhythmus: Rhythmus; abstaende: number[] } {
  const grenze = plusTage(heute, -3 * 365)
  const jung = gueltig.filter((z) => z.date >= grenze)
  const fuerMuster = jung.length >= 2 ? jung : gueltig
  const abstaende: number[] = []
  for (let i = 1; i < fuerMuster.length; i += 1) {
    abstaende.push(tageZwischen(fuerMuster[i - 1].date, fuerMuster[i].date))
  }
  return {
    rhythmus: abstaende.length === 0 ? 'unregelmaessig' : zuRhythmus(median(abstaende)),
    abstaende,
  }
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

  const { rhythmus, abstaende } = bestimmeRhythmus(gueltig, heute)
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
    /*
      `findLast`, nicht `find`. Gesucht ist die Zahlung **ein** Zyklus vor der
      letzten, und die Liste ist aufsteigend sortiert: `find` liefert die
      älteste passende, also bei Allianz die von 2022. Im Text stand dann „im
      Zyklus davor am 05.05.2022“ – vier Jahre her und als Beleg für eine
      Jahresschätzung wertlos. `findLast` liefert die jüngste, die mindestens
      330 Tage zurückliegt, und das ist der Vorjahrestermin.
    */
    const basis =
      gueltig.findLast((z) => tageZwischen(z.date, letzte.date) >= 330) ?? null
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

/**
 * Ab welcher relativen Abweichung ein gespeicherter Betrag überschrieben wird.
 *
 * Ein halbes Prozent. Darunter liegt Wechselkursrauschen, darüber eine
 * Korrektur.
 */
const ZAHLUNG_TOLERANZ = 0.005

/**
 * Führt eine neu abgerufene Zahlungsreihe mit der gespeicherten zusammen.
 *
 * ## Warum nicht einfach ersetzen
 *
 * Weil dieselbe Zahlung bei jedem Abruf einen minimal anderen Betrag hat.
 * Qiagen schüttet in einer Währung aus und notiert in einer anderen; Yahoo
 * rechnet um, und zwar mit dem Kurs des Abrufzeitpunkts. Die Zahlung vom
 * 30.01.2024 kam deshalb einmal als 1,2023765 und eine halbe Stunde später als
 * 1,2020993 zurück – bei einer Zahlung, die vor zwei Jahren stattgefunden hat.
 *
 * Folge: `dividenden.json` änderte sich bei jedem der zweiundvierzig Läufe am
 * Tag, achthundert Kilobyte, wegen der siebten Nachkommastelle. Das ist
 * dasselbe stille Wachstum, das die Trennung von Kursstand und Historie
 * beheben sollte – nur eine Größenordnung kleiner und deshalb länger
 * unbemerkt.
 *
 * ## Was trotzdem durchkommt
 *
 * Neue Zahlungen, weggefallene Zahlungen und echte Korrekturen. Nur wenn
 * derselbe Tag mit einem Betrag zurückkommt, der um weniger als ein halbes
 * Prozent abweicht, behält der gespeicherte Wert seinen Platz. Eine
 * Dividende, die tatsächlich um mehr als ein halbes Prozent korrigiert wird,
 * ist eine Nachricht und keine Rundung.
 *
 * Die **neue** Liste bestimmt, welche Zahlungen es gibt – gespeicherte
 * Beträge werden nur übernommen, nicht wiederbelebt. Sonst stünde eine
 * zurückgezogene Zahlung für immer im Bestand.
 */
export function vereinigeZahlungen(
  bisher: readonly Zahlung[],
  neu: readonly Zahlung[]
): Zahlung[] {
  const gespeichert = new Map(bisher.map((z) => [z.date, z.amount]))

  return neu
    .map((zahlung) => {
      const alt = gespeichert.get(zahlung.date)
      if (alt === undefined || alt <= 0) return zahlung
      const abweichung = Math.abs(zahlung.amount - alt) / alt
      return abweichung < ZAHLUNG_TOLERANZ ? { date: zahlung.date, amount: alt } : zahlung
    })
    .sort((a, b) => a.date.localeCompare(b.date))
}

/** Was ein Kalenderjahr an Dividende gebracht hat. */
export interface Dividendenjahr {
  jahr: number
  /** Summe je Aktie, in der Einheit des Kurses. */
  summe: number
  zahlungen: number
  /**
   * Es fehlen noch Zahlungen – die Summe ist ein Zwischenstand.
   *
   * Nicht dasselbe wie „laufendes Kalenderjahr“: Ein Jahreszahler, der im Mai
   * ausgeschüttet hat, ist für dieses Jahr fertig, auch wenn der Dezember noch
   * aussteht. Sein Balken darf voll gezeichnet werden, denn er wird nicht mehr
   * wachsen.
   */
  laufend: boolean
}

export interface Dividendenjahre {
  /** Aufsteigend; das laufende Jahr steht am Ende und ist gekennzeichnet. */
  jahre: Dividendenjahr[]
  /**
   * Mittlere jährliche Veränderung über die abgeschlossenen Jahre, in Prozent.
   *
   * `null`, wenn weniger als zwei abgeschlossene Jahre vorliegen oder das
   * erste davon null war – aus einer Null lässt sich keine Wachstumsrate
   * bilden, und „unendlich viel Prozent“ ist keine Auskunft.
   */
  wachstumProzent: number | null
}

/**
 * Die Dividende je Kalenderjahr – für die Verlaufsgrafik.
 *
 * ## Warum das erste Jahr der Reihe meist fehlt
 *
 * Die Quelle liefert die Kurshistorie samt Dividenden für die letzten fünf
 * Jahre. Dieses Fenster beginnt mitten im Jahr, in der Regel Ende Juli. Wer die
 * Zahlungen dieses angebrochenen Jahres addiert, bekommt bei einem
 * Quartalszahler zwei statt vier – und ein Balken, der halb so hoch ist wie
 * seine Nachbarn, sieht aus wie eine Kürzung, die nie stattgefunden hat.
 *
 * Ein Jahr zählt deshalb nur, wenn das Fenster **vor** seinem 1. Januar begann.
 * Wo der Fensterbeginn nicht bekannt ist, wird das Jahr der ersten bekannten
 * Zahlung verworfen; das ist die vorsichtigere Annahme und verliert höchstens
 * einen Balken.
 *
 * ## Warum Jahre ohne Zahlung als Null erscheinen
 *
 * Weil sie eine Aussage sind. Ein Unternehmen, das die Dividende ein Jahr lang
 * ausgesetzt hat, hat nicht „keine Daten“ – es hat nichts gezahlt. Diese Lücke
 * zu überspringen, machte aus einer Aussetzung eine ununterbrochene Reihe.
 *
 * @param fensterBeginn Erster Tag, den die Quelle abdeckt (`JJJJ-MM-TT`), oder
 *   `null`. Er stammt aus der Kursreihe desselben Abrufs.
 */
export function jahresSummen(
  zahlungen: readonly Zahlung[],
  fensterBeginn: string | null,
  heute: string
): Dividendenjahre {
  const gueltig = zahlungen
    .filter((z) => /^\d{4}-\d{2}-\d{2}$/.test(z.date) && z.amount > 0)
    .sort((a, b) => a.date.localeCompare(b.date))
  if (gueltig.length === 0) return { jahre: [], wachstumProzent: null }

  const jahrVon = (datum: string) => Number(datum.slice(0, 4))
  const erstesZahljahr = jahrVon(gueltig[0].date)
  /*
    Der Fensterbeginn entscheidet, nicht die erste Zahlung. Bei einem
    Jahreszahler wie Allianz liegt die erste bekannte Zahlung im Mai 2022,
    das Fenster beginnt aber im Juli 2021 – 2022 ist damit vollständig
    erfasst, obwohl keine Zahlung aus 2021 vorliegt. Ohne diese Unterscheidung
    ginge ein vollständiges Jahr verloren.
  */
  const erstesJahr =
    fensterBeginn && /^\d{4}-\d{2}-\d{2}$/.test(fensterBeginn)
      ? jahrVon(fensterBeginn) + (fensterBeginn.slice(5) === '01-01' ? 0 : 1)
      : erstesZahljahr + 1

  const laufendesJahr = jahrVon(heute)
  if (erstesJahr > laufendesJahr) return { jahre: [], wachstumProzent: null }

  /*
    Ob das laufende Jahr noch etwas erwartet, entscheidet der Rhythmus.

    Bei Allianz stand sonst der höchste Balken der Reihe gestrichelt da: Die
    Firma zahlt einmal im Jahr, hatte im Mai gezahlt und war damit fertig – der
    gestrichelte Umriss behauptete trotzdem, da käme noch etwas. Ein
    Quartalszahler hat Ende Juli dagegen wirklich erst die Hälfte.
  */
  const erwartet = ZAHLUNGEN_JE_JAHR[bestimmeRhythmus(gueltig, heute).rhythmus]

  const jahre: Dividendenjahr[] = []
  for (let jahr = erstesJahr; jahr <= laufendesJahr; jahr += 1) {
    const treffer = gueltig.filter((z) => jahrVon(z.date) === jahr)
    jahre.push({
      jahr,
      summe: treffer.reduce((summe, z) => summe + z.amount, 0),
      zahlungen: treffer.length,
      laufend: jahr === laufendesJahr && (erwartet === 0 || treffer.length < erwartet),
    })
  }

  /*
    Führende Nulljahre gehören weg, nachlaufende nicht.

    Wer erst seit 2024 ausschüttet, hat 2022 und 2023 nicht ausgesetzt –
    dort gab es schlicht noch keine Dividende. Eine Null am Anfang wäre eine
    Behauptung über eine Entscheidung, die niemand getroffen hat. Eine Null am
    Ende dagegen ist genau so eine Entscheidung und bleibt stehen.
  */
  while (jahre.length > 0 && jahre[0].zahlungen === 0) jahre.shift()

  const abgeschlossen = jahre.filter((eintrag) => !eintrag.laufend)
  const wachstumProzent =
    abgeschlossen.length >= 2 && abgeschlossen[0].summe > 0
      ? ((abgeschlossen[abgeschlossen.length - 1].summe / abgeschlossen[0].summe) **
          (1 / (abgeschlossen.length - 1)) -
          1) *
        100
      : null

  return { jahre, wachstumProzent }
}
