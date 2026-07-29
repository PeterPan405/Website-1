/**
 * Untereinheiten einer Währung – Pence und Pfund.
 *
 * Bewusst ohne Importe, damit `tests/` das Modul direkt laden kann.
 *
 * ## Warum es das braucht
 *
 * Die Londoner Börse stellt Aktien in Pence. BP steht dort mit 525,70, gemeint
 * sind 5,26 Pfund. Das ist keine Umrechnung mit einem Wechselkurs, sondern
 * dieselbe Währung in kleinerer Einheit – wie Cent und Euro, nur dass in Europa
 * niemand auf die Idee käme, Aktien in Cent zu stellen.
 *
 * Für die Anzeige ist das harmlos, solange „GBp“ danebensteht. Sobald aber
 * gerechnet wird, ist es das nicht mehr: Die Bilanzzahlen aus den
 * Pflichtmeldungen lauten auf Pfund. Wer einen Kurs in Pence mit einer
 * Aktienzahl multipliziert und das Ergebnis einem Umsatz in Pfund
 * gegenüberstellt, bekommt ein Kurs-Umsatz-Verhältnis, das um genau den Faktor
 * 100 danebenliegt – bei RELX kam so ein Wert von 711 heraus statt 7,1.
 *
 * Aufgefallen ist das nicht beim Lesen, sondern durch
 * `tests/fundamentalplausibel.test.ts`: Sechs britische Werte lagen jenseits
 * jeder möglichen Bewertung.
 */

/**
 * Die bekannten Untereinheiten.
 *
 * Nur eine, aber die Tabelle ist der Ort, an dem die nächste stünde – die
 * Johannesburger Börse notiert in Cent (`ZAc`), die Tel Aviver in Agorot
 * (`ILA`). Beide führt diese Website derzeit nicht.
 */
const UNTEREINHEITEN: Record<string, { waehrung: string; jeEinheit: number }> = {
  GBp: { waehrung: 'GBP', jeEinheit: 100 },
}

export interface Betrag {
  wert: number
  waehrung: string
}

/**
 * Rechnet einen Kurs in die Hauptwährung um.
 *
 * Ist die Einheit bereits eine Hauptwährung, kommt sie unverändert zurück –
 * die Funktion darf deshalb bedenkenlos über jeden Kurs laufen.
 */
export function inHauptwaehrung(wert: number, einheit: string): Betrag {
  const untereinheit = UNTEREINHEITEN[einheit]
  if (!untereinheit) return { wert, waehrung: einheit }
  return { wert: wert / untereinheit.jeEinheit, waehrung: untereinheit.waehrung }
}

/**
 * Ob zwei Angaben dieselbe Währung meinen.
 *
 * `GBp` und `GBP` unterscheiden sich in einem Buchstaben und im Faktor 100.
 * Ein Vergleich mit `===` hält sie für verschieden und lässt die Kennzahlen
 * ausfallen; ein Vergleich ohne Rücksicht auf Groß- und Kleinschreibung hält
 * sie für gleich und rechnet um den Faktor 100 daneben. Beides ist falsch,
 * deshalb diese Funktion.
 */
export function gleicheWaehrung(einheit: string, andere: string): boolean {
  return inHauptwaehrung(1, einheit).waehrung === inHauptwaehrung(1, andere).waehrung
}
