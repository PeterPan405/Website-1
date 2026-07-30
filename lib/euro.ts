import { getDevisenkurse } from '@/lib/market-live'
import { inHauptwaehrung } from '@/lib/waehrungseinheit'

/**
 * Kurse zusätzlich in Euro.
 *
 * ## Wozu
 *
 * Eine Aktie steht mit 849,85 USD da, eine andere mit 4.180 HKD, eine dritte
 * mit 24,55 GBp. Ob das viel oder wenig ist, lässt sich nicht vergleichen, ohne
 * drei Wechselkurse im Kopf zu haben – und der Betrag ist ohnehin das, was beim
 * Kauf vom Konto geht. Der Euro-Betrag beantwortet also die Frage, die sich
 * beim Anschauen zuerst stellt.
 *
 * ## Warum die Umrechnung ehrlicher ist als sie aussieht
 *
 * Sie ist eine Momentaufnahme aus zwei verschieden alten Zahlen. Der Aktienkurs
 * ist höchstens dreißig Minuten alt, der Wechselkurs ist der Referenzkurs der
 * EZB vom jüngsten Handelstag – festgestellt einmal täglich gegen 14:15 Uhr
 * MEZ. An einem bewegten Devisentag liegt das Ergebnis daneben, und wer wirklich
 * kauft, bekommt ohnehin den Kurs seiner Bank samt Aufschlag.
 *
 * Deshalb steht am Euro-Betrag überall „rund“ und das Datum des
 * Wechselkurses. Eine auf den Cent genaue Angabe wäre hier eine Genauigkeit,
 * die die Zahlen nicht hergeben.
 *
 * ## Warum manche Kurse keinen Euro-Betrag bekommen
 *
 * Die EZB veröffentlicht 29 Referenzkurse, und dieser Katalog führt Aktien in
 * vier weiteren Währungen: Chile, Katar, Saudi-Arabien und Taiwan. Für sie
 * einen Kurs aus dritter Hand zu nehmen, hieße die Quellenlage zu verschleiern
 * – dann lieber keine Zahl. Solche Titel stehen ohne Euro-Angabe da, und der
 * Grund steht dabei.
 */

/** Ein Betrag in Euro samt der Herkunft des benutzten Wechselkurses. */
export interface EuroBetrag {
  /** Der Betrag in Euro. */
  euro: number
  /** Die Währung, aus der umgerechnet wurde – die Hauptwährung, nicht die Notierung. */
  ausWaehrung: string
  /** Wie viele Einheiten dieser Währung auf einen Euro kommen. */
  jeEuro: number
  /** Handelstag des EZB-Referenzkurses, `JJJJ-MM-TT`. */
  stand: string
}

/**
 * Rechnet einen Betrag in Euro um – oder gibt `null` zurück.
 *
 * `null` heißt: Für diese Währung liegt kein Referenzkurs der EZB vor. Es heißt
 * **nicht**, dass der Betrag null wäre, und es heißt nicht, dass etwas
 * fehlgeschlagen ist. Wer das Ergebnis anzeigt, muss den Fall behandeln, statt
 * eine Zahl zu erfinden.
 *
 * Untereinheiten werden vorher aufgelöst: Ein Kurs in Pence wird durch hundert
 * geteilt und dann mit dem Pfundkurs umgerechnet. Ohne diesen Schritt wäre das
 * Ergebnis um genau den Faktor 100 zu hoch – derselbe Fehler, der bei den
 * Kurs-Gewinn-Verhältnissen britischer Titel schon einmal aufgetreten ist.
 *
 * @param wert Der Betrag in der Notierungseinheit.
 * @param einheit Die Notierungseinheit, z. B. `USD`, `GBp` oder `Punkte`.
 */
export function inEuro(wert: number, einheit: string): EuroBetrag | null {
  const tabelle = getDevisenkurse()
  if (!tabelle) return null

  const { wert: betrag, waehrung } = inHauptwaehrung(wert, einheit)

  /*
    Euro bleibt Euro. Die EZB führt den Euro nicht in ihrer eigenen Tabelle –
    ein Referenzkurs von sich selbst wäre auch eine seltsame Zahl –, und ohne
    diesen Zweig fiele jeder deutsche und französische Titel durchs Raster.
  */
  if (waehrung === 'EUR') {
    return { euro: betrag, ausWaehrung: 'EUR', jeEuro: 1, stand: tabelle.stand }
  }

  const jeEuro = tabelle.jeEuro[waehrung]
  if (!jeEuro || jeEuro <= 0) return null

  return { euro: betrag / jeEuro, ausWaehrung: waehrung, jeEuro, stand: tabelle.stand }
}

/**
 * Ob ein Euro-Betrag überhaupt etwas hinzufügt.
 *
 * Bei einem Titel, der ohnehin in Euro notiert, stünde sonst „24,55 EUR (rund
 * 24,55 €)“ – eine Zeile, die nichts sagt und die Seite unruhig macht. Ebenso
 * bei Indizes: Ein Indexstand ist kein Geldbetrag, und „7.374 Punkte, rund
 * 6.480 €“ wäre schlicht falsch.
 */
export function lohntEuroAngabe(einheit: string): boolean {
  if (einheit === 'Punkte') return false
  return inHauptwaehrung(1, einheit).waehrung !== 'EUR'
}
