/**
 * Umrechnung zwischen Währungen mit den Euro-Referenzkursen der EZB.
 *
 * Bewusst ohne Importe, damit `tests/` das Modul direkt laden kann. Die Kurse
 * kommen als Argument herein; wer sie hat, weiß `lib/markets.ts`.
 *
 * ## Warum hier überhaupt umgerechnet wird
 *
 * An dieser Stelle stand lange das Gegenteil: Wo Bilanz- und Kurswährung
 * auseinandergehen, blieb es bei „keine Angabe“, mit der Begründung, eine
 * Umrechnung brächte einen zweiten Stichtag ins Spiel – den Kurs von heute und
 * die Bilanz vom Jahresende.
 *
 * Das trifft zu, wenn man die **Bilanz** umrechnet. Genau das passiert hier
 * aber nicht. Umgerechnet wird der **Börsenwert**, und der ist eine Größe von
 * heute: Kurs mal Aktienzahl, beides tagesaktuell. Ein heutiger Betrag zum
 * heutigen Kurs umgerechnet ist keine Näherung, sondern exakt. Erst danach wird
 * er dem gemeldeten Gewinn gegenübergestellt – und der bleibt in seiner eigenen
 * Währung stehen, unangetastet.
 *
 * Für Shell heißt das: Börsenwert in Pfund → in Dollar → geteilt durch den
 * Gewinn in Dollar. Kein Wechselkurs berührt je eine Bilanzzahl.
 *
 * ## Die verbleibende Ungenauigkeit
 *
 * Der EZB-Referenzkurs ist ein Tagesfixing von 16 Uhr. Wer eine Aktie zu einem
 * späteren Kurs sieht, rechnet mit einem Wechselkurs, der ein paar Stunden alt
 * ist. Das bewegt sich im Promillebereich und ist gegen den Nutzen – eine
 * Kennzahl statt eines Strichs – kein Argument.
 */

/** Wie viele Einheiten einer Währung ein Euro kostet. Euro selbst fehlt. */
export type EuroKurse = Readonly<Record<string, number>>

/**
 * Rechnet einen Betrag von einer Währung in eine andere.
 *
 * Beide Wege führen über den Euro, weil die EZB nur Euro-Kurse veröffentlicht.
 * `null` heißt: Für mindestens eine der beiden Währungen liegt kein Kurs vor –
 * dann wird nicht geraten.
 */
export function rechneUm(
  betrag: number,
  von: string,
  nach: string,
  kurse: EuroKurse
): number | null {
  if (!Number.isFinite(betrag)) return null
  if (von === nach) return betrag

  const jeEuroVon = von === 'EUR' ? 1 : kurse[von]
  const jeEuroNach = nach === 'EUR' ? 1 : kurse[nach]
  if (!jeEuroVon || !jeEuroNach) return null
  if (!Number.isFinite(jeEuroVon) || !Number.isFinite(jeEuroNach)) return null
  if (jeEuroVon <= 0 || jeEuroNach <= 0) return null

  return (betrag / jeEuroVon) * jeEuroNach
}
