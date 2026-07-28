/**
 * Drei Rechnungen, die im Lernbereich behauptet statt gerechnet wurden.
 *
 * ## Warum sie hier stehen
 *
 * Jede von ihnen trägt eine Aussage, die im Text als Größenordnung auftaucht:
 * „ein halber Prozentpunkt mehr Kapitalkosten verschiebt den Wert leicht um
 * fünfzehn Prozent“, „aus sieben Prozent brutto werden nach Steuern gut fünf“,
 * „liegt der Zins unter dem Wachstum, sinkt die Quote von allein“. Solche Sätze
 * sind entweder richtig oder falsch, und das lässt sich ausrechnen. Wo eine
 * Zahl im Text steht, kommt sie deshalb von hier – und die Grafik daneben
 * zeichnet dieselbe Funktion.
 */

/**
 * Der Barwert einer ewig wachsenden Zahlungsreihe.
 *
 * Das Gordon-Wachstumsmodell in seiner einfachsten Form: Eine Zahlung, die
 * jedes Jahr um `wachstumProzent` steigt, abgezinst mit `kapitalkostenProzent`.
 *
 * ## Warum diese Vereinfachung zulässig ist
 *
 * Eine vollständige Unternehmensbewertung prognostiziert einzelne Jahre und
 * fasst erst den Rest in einem Endwert zusammen. Dieser Endwert ist genau die
 * Formel hier – und er macht in der Praxis 60 bis 80 Prozent des Ergebnisses
 * aus. Wer die Empfindlichkeit einer Bewertung zeigen will, zeigt sie also am
 * ehrlichsten an dieser Formel: Der große Rest verhält sich genauso.
 *
 * Der Wert existiert nur, solange die Kapitalkosten über dem Wachstum liegen.
 * Andernfalls wächst die Reihe schneller, als abgezinst wird, und die Summe
 * läuft davon – rechnerisch wie wirtschaftlich sinnlos. Die Funktion gibt
 * dann `null` zurück statt einer negativen Zahl, die wie ein Ergebnis aussähe.
 */
export function ewigeRente(
  zahlung: number,
  kapitalkostenProzent: number,
  wachstumProzent: number
): number | null {
  const nenner = (kapitalkostenProzent - wachstumProzent) / 100
  if (nenner <= 0) return null
  return zahlung / nenner
}

/**
 * Welche Bruttorendite eine Anlage bringen muss, um eine Tilgung zu schlagen.
 *
 * Der Ertrag einer Tilgung ist der ersparte Kreditzins – und er wird nicht
 * besteuert, weil eine ersparte Ausgabe kein Ertrag im Sinne des
 * Steuerrechts ist. Kapitalerträge werden besteuert. Ein Vergleich der beiden
 * Zahlen ohne diese Umrechnung stellt eine Nettogröße neben eine Bruttogröße.
 *
 * @param kreditzinsProzent Der Sollzins des Kredits.
 * @param steuersatzProzent Der effektive Satz auf Kapitalerträge, inklusive
 *   Solidaritätszuschlag.
 */
export function noetigeBruttorendite(
  kreditzinsProzent: number,
  steuersatzProzent: number
): number {
  return kreditzinsProzent / (1 - steuersatzProzent / 100)
}

/**
 * Die Schuldenquote über die Zeit, bei ausgeglichenem Primärsaldo.
 *
 * Die Quote verändert sich mit dem Verhältnis von Zins zu nominalem Wachstum:
 * Was der Staat an Zinsen zahlt, vergrößert den Zähler, was die Wirtschaft
 * wächst, den Nenner. Liegt der Zins darunter, schrumpft die Quote von
 * allein – ohne dass irgendwo gespart würde.
 *
 * Gerechnet wird bewusst ohne Primärsaldo. Nicht weil er unwichtig wäre – er
 * ist die einzige Größe, die eine Regierung steuern kann –, sondern weil die
 * Aussage ihm gerade nicht gilt: Auch bei einem ausgeglichenen Haushalt
 * bewegt sich die Quote, und in welche Richtung, entscheidet allein diese
 * Differenz.
 *
 * @returns Die Quote in Prozent für jedes Jahr von 0 bis `jahre`.
 */
export function schuldenquotenpfad(
  startquoteProzent: number,
  zinsProzent: number,
  wachstumProzent: number,
  jahre: number
): number[] {
  const faktor = (1 + zinsProzent / 100) / (1 + wachstumProzent / 100)
  return Array.from(
    { length: jahre + 1 },
    (_, jahr) => startquoteProzent * faktor ** jahr
  )
}
