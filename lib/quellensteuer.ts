import {
  ANRECHNUNG_HOECHSTSATZ,
  quellensteuer,
  type Quellensteuersatz,
} from '@/data/quellensteuer'

/**
 * Was von einer Auslandsdividende tatsächlich ankommt.
 *
 * ## Der Mechanismus in vier Schritten
 *
 * 1. Das Sitzland behält seine Quellensteuer ein, bevor überhaupt etwas
 *    überwiesen wird.
 * 2. Deutschland besteuert die **Bruttodividende** mit 25 Prozent
 *    Abgeltungsteuer plus Solidaritätszuschlag – nicht das, was übrig blieb.
 * 3. Die ausländische Quellensteuer wird darauf angerechnet, aber höchstens
 *    mit 15 Prozentpunkten (§ 32d Abs. 5 EStG).
 * 4. Was darüber hinaus einbehalten wurde, ist nur im Sitzland
 *    zurückzufordern. Wer den Antrag nicht stellt, zahlt es.
 *
 * Daraus folgt die Zahl, die kaum jemand kennt: Solange das Sitzland höchstens
 * 15 Prozent einbehält, kostet die Auslandsdividende **genauso viel** wie eine
 * deutsche – die Anrechnung geht glatt auf, und von hundert Euro bleiben in
 * beiden Fällen 73,63. Ob ein Land null, zehn oder fünfzehn Prozent einbehält,
 * ändert daran nichts.
 *
 * Erst oberhalb von 15 Prozent wird es teurer, und zwar genau um die
 * Differenz. Bei der Schweiz mit 35 Prozent bleiben 20 Prozentpunkte liegen,
 * solange niemand sie zurückholt: zwanzig Euro je hundert Euro Dividende. Auf
 * dem Kontoauszug steht nur der Nettobetrag – die Lücke sieht man dort nicht.
 *
 * ## Warum hier keine Steuerberatung steht
 *
 * Weil die Rechnung Annahmen enthält, die nicht für jeden gelten:
 * Sparer-Pauschbetrag ausgeschöpft, keine Kirchensteuer, Streubesitz einer
 * natürlichen Person. Die Beträge sollen zeigen, wo Geld hängen bleibt und
 * warum – nicht eine Steuererklärung ersetzen.
 */

/** Abgeltungsteuer auf Kapitalerträge, in Prozent. */
export const ABGELTUNGSTEUER = 25
/** Solidaritätszuschlag auf die Abgeltungsteuer, in Prozent. */
export const SOLI = 5.5

export interface Quellensteuerbefund {
  /** ISO-3166-Zahl des Sitzlands. */
  land: string
  satz: number
  dba: number
  hinweis?: string
  /** Wie viele Prozentpunkte Deutschland anrechnet. */
  anrechenbar: number
  /**
   * Wie viele Prozentpunkte über den Abkommenssatz hinaus einbehalten werden.
   *
   * Sie sind im Sitzland zurückzufordern – ein eigener Antrag, eigene
   * Formulare, oft eine Gebühr.
   */
  rueckforderbar: number
  /**
   * Was von hundert Euro Bruttodividende übrig bleibt, wenn niemand etwas
   * zurückfordert.
   */
  nettoJeHundert: number
  /** Dasselbe nach erfolgreicher Rückforderung. */
  nettoJeHundertMitAntrag: number
}

/**
 * Rechnet die Belastung einer Dividende aus diesem Sitzland aus.
 *
 * `null`, wenn für das Land kein Satz hinterlegt ist – dann steht auf der
 * Seite der Hinweis auf die amtliche Übersicht und keine Zahl. Ein geschätzter
 * Steuersatz wäre hier die schlechteste aller Möglichkeiten.
 */
export function getQuellensteuer(land: string | undefined): Quellensteuerbefund | null {
  if (!land) return null
  const eintrag: Quellensteuersatz | undefined = quellensteuer[land]
  if (!eintrag) return null

  const anrechenbar = Math.min(eintrag.dba, ANRECHNUNG_HOECHSTSATZ)
  const rueckforderbar = Math.max(0, eintrag.satz - eintrag.dba)

  /*
    Die deutsche Steuer bemisst sich an der Bruttodividende, nicht am
    ausgezahlten Rest – und die ausländische wird davon abgezogen, nicht von
    der Dividende. Beides zusammen ergibt: Bis fünfzehn Prozent Einbehalt
    ändert sich am Ergebnis nichts, darüber kostet jeder Prozentpunkt einen
    Euro je hundert.
  */
  const deutschVoll = ABGELTUNGSTEUER * (1 + SOLI / 100)
  const deutschNachAnrechnung = Math.max(0, deutschVoll - anrechenbar)

  return {
    land,
    satz: eintrag.satz,
    dba: eintrag.dba,
    hinweis: eintrag.hinweis,
    anrechenbar,
    rueckforderbar,
    nettoJeHundert: 100 - eintrag.satz - deutschNachAnrechnung,
    nettoJeHundertMitAntrag: 100 - eintrag.dba - deutschNachAnrechnung,
  }
}

/** Ob für ein Land überhaupt ein Satz hinterlegt ist. */
export function hatQuellensteuersatz(land: string | undefined): boolean {
  return Boolean(land && quellensteuer[land])
}
