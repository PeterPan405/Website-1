import { PREISINDEX, WECHSELKURSE, type Waehrung, WAEHRUNGEN } from '@/data/preisindex'

/**
 * Kaufkraft und Wechselkurs – die beiden Wirkungen getrennt.
 *
 * ## Die Frage, die sonst falsch beantwortet wird
 *
 * „Was sind 100 € von 2015 heute wert?" wird üblicherweise mit einer Zahl
 * beantwortet, und diese Zahl vermischt zwei Dinge, die nichts miteinander zu
 * tun haben:
 *
 * 1. **Die Kaufkraft.** In Deutschland kosten dieselben Waren heute mehr. Das
 *    ist Inflation, gemessen am Verbraucherpreisindex.
 * 2. **Der Wechselkurs.** Was ein Euro im Ausland wert ist, hat sich ebenfalls
 *    verändert – aus ganz anderen Gründen, und oft in die andere Richtung.
 *
 * Wer beides in eine Zahl wirft, bekommt eine, die weder das eine noch das
 * andere ist. Deshalb steht hier jede Wirkung für sich, und die dritte Zahl
 * ist ausdrücklich die **Kombination** der beiden.
 *
 * ## Was hier nicht beantwortet wird
 *
 * Was 100 € von 2015 heute **in den USA kaufen**. Dafür bräuchte es den
 * amerikanischen Preisindex, und der ist etwas anderes als eine Umrechnung.
 * Diese Rechnung sagt, wie viele Dollar man bekommt – nicht, was man dafür
 * bekommt. Der Unterschied steht auf der Seite.
 */

/** Beide Wirkungen, einzeln und zusammen. */
export interface Kaufkraftvergleich {
  vonJahr: number
  nachJahr: number
  betrag: number

  /* ---------------------------------------------------- Kaufkraft */

  /**
   * Was der Betrag im Zieljahr kosten würde – dieselben Waren, andere Preise.
   *
   * Die Antwort auf „100 € von 2015 sind heute wie viel?": der Betrag, den man
   * heute braucht, um sich davon dasselbe zu kaufen.
   */
  gleicheKaufkraft: number
  /** Preisanstieg zwischen den beiden Jahren, in Prozent. */
  teuerungProzent: number
  /** Dieselbe Teuerung als jährliche Rate. */
  teuerungProJahrProzent: number

  /* -------------------------------------------------- Wechselkurs */

  /** Was der Betrag im Ausgangsjahr in Fremdwährung war. */
  fremdDamals: number
  /** Was derselbe Eurobetrag heute in Fremdwährung ist. */
  fremdHeute: number
  /** Veränderung allein aus dem Wechselkurs, in Prozent. */
  kurseffektProzent: number

  /* ------------------------------------------------------ Beides */

  /**
   * Der kaufkraftgleiche Betrag, in Fremdwährung des Zieljahres.
   *
   * Die Zahl für die eigentliche Frage: Wer den Lebensstandard von damals
   * halten und heute im Ausland zahlen will, braucht so viel Fremdwährung.
   */
  fremdMitKaufkraft: number

  kurse: { damals: number; heute: number }
}

export function findeWaehrung(code: string): Waehrung | undefined {
  return WAEHRUNGEN.find((w) => w.code === code)
}

/** Ob für dieses Jahr überhaupt Zahlen vorliegen. */
export function jahrVorhanden(jahr: number, waehrung: string): boolean {
  return PREISINDEX[jahr] !== undefined && WECHSELKURSE[waehrung]?.[jahr] !== undefined
}

/**
 * Der vollständige Vergleich zwischen zwei Jahren.
 *
 * Gibt `null` zurück, wenn für eines der Jahre Zahlen fehlen. Nicht null oder
 * eine Näherung: Eine ausgedachte Zwischenzahl wäre hier besonders schädlich,
 * weil die ganze Seite von sich behauptet, mit gemessenen Werten zu rechnen.
 */
export function vergleiche(
  betrag: number,
  vonJahr: number,
  nachJahr: number,
  waehrungscode: string
): Kaufkraftvergleich | null {
  const preisVon = PREISINDEX[vonJahr]
  const preisNach = PREISINDEX[nachJahr]
  const kursVon = WECHSELKURSE[waehrungscode]?.[vonJahr]
  const kursNach = WECHSELKURSE[waehrungscode]?.[nachJahr]

  if (
    preisVon === undefined ||
    preisNach === undefined ||
    kursVon === undefined ||
    kursNach === undefined ||
    preisVon <= 0
  ) {
    return null
  }

  const gleicheKaufkraft = (betrag * preisNach) / preisVon
  const jahre = nachJahr - vonJahr

  /*
    Die jährliche Rate als geometrisches Mittel, nicht als Teuerung durch
    Jahre.

    Über zehn Jahre macht das aus 2,0 Prozent im Jahr eine Teuerung von 21,9
    Prozent – geteilt durch zehn kämen 2,19 heraus, und die Zahl stünde
    dauerhaft ein Zehntel zu hoch da. Bei den Sprüngen ab 2022 wäre der
    Unterschied deutlich größer.
  */
  const teuerungProJahrProzent =
    jahre === 0 ? 0 : ((preisNach / preisVon) ** (1 / jahre) - 1) * 100

  const fremdDamals = betrag * kursVon
  const fremdHeute = betrag * kursNach

  return {
    vonJahr,
    nachJahr,
    betrag,
    gleicheKaufkraft,
    teuerungProzent: (preisNach / preisVon - 1) * 100,
    teuerungProJahrProzent,
    fremdDamals,
    fremdHeute,
    kurseffektProzent: (kursNach / kursVon - 1) * 100,
    fremdMitKaufkraft: gleicheKaufkraft * kursNach,
    kurse: { damals: kursVon, heute: kursNach },
  }
}

/**
 * Was ein Betrag von damals heute noch wert ist – die Gegenrichtung.
 *
 * Beide Blickwinkel gehören auf die Seite, weil sie verschieden klingen und
 * dasselbe sagen: „100 € von 2015 sind heute 132 € wert" (was ich heute
 * bräuchte) und „100 € von 2015 haben heute die Kaufkraft von 76 €" (was von
 * ihnen übrig ist). Die zweite Zahl trifft die meisten härter, und sie ist
 * genauso richtig.
 */
export function verbliebeneKaufkraft(
  betrag: number,
  vonJahr: number,
  nachJahr: number
): number | null {
  const preisVon = PREISINDEX[vonJahr]
  const preisNach = PREISINDEX[nachJahr]
  if (preisVon === undefined || preisNach === undefined || preisNach <= 0) return null
  return (betrag * preisVon) / preisNach
}
