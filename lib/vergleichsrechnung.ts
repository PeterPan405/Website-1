/**
 * Median und Platzierung – die zwei Rechenschritte des Branchenvergleichs.
 *
 * Der Median statt des Durchschnitts, weil Bilanzkennzahlen Ausreißer
 * haben, die jeden Mittelwert regieren würden: Ein einziges KGV von 400
 * zieht den Schnitt einer 40er-Branche um zehn Punkte, den Median um
 * nichts. Der Vergleich soll sagen, was in der Branche üblich ist – nicht,
 * was ihr seltsamster Titel gerade macht.
 */

export function median(werte: readonly number[]): number | null {
  if (werte.length === 0) return null
  const sortiert = [...werte].sort((a, b) => a - b)
  const mitte = Math.floor(sortiert.length / 2)
  return sortiert.length % 2 === 1
    ? sortiert[mitte]
    : (sortiert[mitte - 1] + sortiert[mitte]) / 2
}

/**
 * Der Platz eines Werts in der absteigend gedachten Reihe.
 *
 * Platz 1 ist der höchste Wert. Gleichstand teilt sich den Platz – wer
 * denselben Wert hat wie Platz 3, ist auch Platz 3. Der Wert selbst muss
 * in `werte` enthalten sein; „von“ zählt die ganze Reihe.
 *
 * Absteigend ist eine Sortierung, keine Wertung: Bei der Marge mag hoch
 * erfreulich sein, beim KGV ist es nur teuer bezahlt. Die Einordnung
 * gehört in den Text daneben, nicht in die Rechnung.
 */
export function platzVon(
  wert: number,
  werte: readonly number[]
): { platz: number; von: number } {
  const hoehere = werte.filter((eintrag) => eintrag > wert).length
  return { platz: hoehere + 1, von: werte.length }
}
