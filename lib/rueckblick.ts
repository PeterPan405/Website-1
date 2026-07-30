/**
 * Was aus einem Betrag geworden wäre – gerechnet an echten Kursen.
 *
 * ## Warum ein Rückblick und keine Prognose
 *
 * Weil ein Rückblick belegbar ist. Die Kursreihen liegen im Repository, fünf
 * Jahre je Titel, aus derselben Quelle wie die Kurse auf jeder Seite. Was
 * daraus entsteht, ist keine Annahme über die Zukunft, sondern eine Division:
 * Anteile mal heutiger Kurs.
 *
 * Genau deshalb ist die Zahl auch nicht das, wofür sie gern gehalten wird. Sie
 * beschreibt **einen** Startzeitpunkt und **einen** Titel. Wer im März 2020
 * einstieg, hat eine andere Zahl als wer im Januar 2020 einstieg, und beide
 * sagen nichts darüber, was der nächste Fünfjahreszeitraum bringt. Die
 * Oberfläche schreibt das dazu; dieses Modul liefert die Zahlen, an denen es
 * sich zeigen lässt.
 *
 * ## Was nicht enthalten ist
 *
 * **Dividenden.** Die Kursreihe ist eine Kursreihe – bei einem Titel mit vier
 * Prozent Ausschüttung fehlen über fünf Jahre entsprechend viele Prozentpunkte.
 * Das ist keine Nachlässigkeit, sondern die Eigenschaft der Quelle, und es
 * gehört genannt, weil die Lücke groß ist.
 *
 * **Kosten und Steuern.** Ordergebühren, Spread, Abgeltungsteuer – nichts
 * davon steckt darin. Der Betrag ist ein Bruttoergebnis vor allem, was eine
 * Bank und ein Finanzamt davon nehmen.
 *
 * **Währungsschwankungen** dagegen stecken **doch** darin, wenn der Titel in
 * fremder Währung notiert: Gerechnet wird in der Notierungswährung, und wer
 * das Ergebnis in Euro liest, hat den Wechselkurs von heute darauf angewandt.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 */

/** Ein Punkt einer Kursreihe. */
export interface Kurspunkt {
  /** Handelstag, `JJJJ-MM-TT`. */
  d: string
  /** Schlusskurs. */
  c: number
}

export interface Einmalanlage {
  /** Der eingesetzte Betrag, in der Notierungswährung. */
  einsatz: number
  /** Was daraus geworden ist. */
  endwert: number
  /** Kurs am Starttag. */
  startkurs: number
  /** Kurs am letzten Tag der Reihe. */
  endkurs: number
  /** Der tatsächlich verwendete Starttag – der erste Handelstag ab dem Wunschtag. */
  startTag: string
  endTag: string
  /** Gesamtveränderung in Prozent. */
  gesamtProzent: number
  /**
   * Mittlere jährliche Veränderung in Prozent.
   *
   * `null` bei weniger als einem Jahr: Eine Jahresrate aus vier Monaten
   * hochzurechnen ergibt eine Zahl, die niemand gemessen hat.
   */
  jahresProzent: number | null
}

export interface Sparplan {
  /** Wie viel je Rate eingezahlt wurde. */
  rate: number
  /** Wie viele Raten geflossen sind. */
  raten: number
  /** Was insgesamt eingezahlt wurde. */
  eingezahlt: number
  /** Was daraus geworden ist. */
  endwert: number
  startTag: string
  endTag: string
  gesamtProzent: number
  /** Der mittlere Einstandskurs über alle Raten. */
  mittlererKurs: number
}

/** Tage zwischen zwei Kalendertagen. */
function tageZwischen(von: string, bis: string): number {
  return Math.round(
    (Date.parse(`${bis}T00:00:00Z`) - Date.parse(`${von}T00:00:00Z`)) / 86400000
  )
}

/**
 * Der erste Handelstag ab einem Datum.
 *
 * Nicht der nächstgelegene: Wer den 1. Januar wählt, meint „ab Anfang des
 * Jahres“ und nicht „den 30. Dezember“. Ein Kauf kann nicht vor dem gewünschten
 * Tag stattgefunden haben.
 */
export function abTag(reihe: readonly Kurspunkt[], ab: string): Kurspunkt | null {
  return reihe.find((punkt) => punkt.d >= ab) ?? null
}

/**
 * Was aus einer einmaligen Anlage geworden wäre.
 *
 * @returns `null`, wenn die Reihe den Zeitraum nicht abdeckt. Nicht etwa eine
 *   Null als Ergebnis – das wäre die Aussage „alles verloren“, und die wäre
 *   falsch.
 */
export function einmalanlage(
  reihe: readonly Kurspunkt[],
  betrag: number,
  ab: string
): Einmalanlage | null {
  if (reihe.length < 2 || betrag <= 0) return null

  const start = abTag(reihe, ab)
  const ende = reihe[reihe.length - 1]
  if (!start || !ende || start.c <= 0 || start.d >= ende.d) return null

  /*
    Anteile statt Stückzahlen: Es wird kein ganzes Stück gekauft, sondern der
    Betrag durch den Kurs geteilt. Auf ganze Stücke zu runden hieße, bei einer
    Aktie zu 800 Euro und einem Einsatz von 1.000 Euro zweihundert Euro
    liegenzulassen – und damit eine Nebenrechnung zur Hauptaussage zu machen.
  */
  const anteile = betrag / start.c
  const endwert = anteile * ende.c
  const jahre = tageZwischen(start.d, ende.d) / 365.25

  return {
    einsatz: betrag,
    endwert,
    startkurs: start.c,
    endkurs: ende.c,
    startTag: start.d,
    endTag: ende.d,
    gesamtProzent: (endwert / betrag - 1) * 100,
    jahresProzent: jahre >= 1 ? ((endwert / betrag) ** (1 / jahre) - 1) * 100 : null,
  }
}

/**
 * Was aus einem monatlichen Sparplan geworden wäre.
 *
 * Gekauft wird am ersten Handelstag jedes Monats ab dem Starttag. Das ist die
 * übliche Ausführung und zugleich die einzige, die sich aus Tagesschlusskursen
 * ehrlich nachbilden lässt – wer einen bestimmten Tag im Monat unterstellt,
 * trifft an Feiertagen ins Leere und muss doch verschieben.
 *
 * ## Warum der mittlere Einstandskurs mit ausgegeben wird
 *
 * Weil er die eigentliche Lehre dieses Rechners trägt: Er liegt bei
 * schwankenden Kursen **unter** dem Durchschnitt der Monatskurse, weil eine
 * feste Rate bei niedrigem Kurs mehr Anteile kauft als bei hohem. Das ist kein
 * Trick und kein Vorteil gegenüber der Einmalanlage – es ist die Rechenfolge
 * daraus, dass die Rate fest ist und der Kurs nicht.
 */
export function sparplan(
  reihe: readonly Kurspunkt[],
  rate: number,
  ab: string
): Sparplan | null {
  if (reihe.length < 2 || rate <= 0) return null

  const start = abTag(reihe, ab)
  const ende = reihe[reihe.length - 1]
  if (!start || !ende || start.d >= ende.d) return null

  const gekauft: Kurspunkt[] = []
  let letzterMonat = ''
  for (const punkt of reihe) {
    if (punkt.d < start.d || punkt.c <= 0) continue
    const monat = punkt.d.slice(0, 7)
    if (monat === letzterMonat) continue
    letzterMonat = monat
    gekauft.push(punkt)
  }
  if (gekauft.length === 0) return null

  const anteile = gekauft.reduce((summe, punkt) => summe + rate / punkt.c, 0)
  const eingezahlt = rate * gekauft.length
  const endwert = anteile * ende.c

  return {
    rate,
    raten: gekauft.length,
    eingezahlt,
    endwert,
    startTag: gekauft[0].d,
    endTag: ende.d,
    gesamtProzent: (endwert / eingezahlt - 1) * 100,
    /*
      Der mittlere Einstandskurs ist eingezahlt geteilt durch Anteile – das
      harmonische Mittel der Kurse, nicht das arithmetische. Wer die Kurse
      schlicht mittelt, bekommt eine zu hohe Zahl und verfehlt genau den
      Effekt, um den es geht.
    */
    mittlererKurs: eingezahlt / anteile,
  }
}
