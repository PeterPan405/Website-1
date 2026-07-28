/**
 * Anleiherechnung: Kurs, Duration und die Grenzen der linearen Näherung.
 *
 * Diese Datei ist bewusst importfrei. Sie wird sowohl von den Lerninhalten
 * benutzt als auch von `tests/anleihen.test.ts` über
 * `node --experimental-strip-types` geladen, und dort löst der `@/`-Alias
 * nicht auf.
 *
 * ## Warum das gerechnet und nicht getippt wird
 *
 * „Steigen die Zinsen um einen Punkt, fällt eine zehnjährige Anleihe um etwa
 * neun Prozent“ steht so in vielen Texten und stimmt ungefähr. Ungefähr
 * reicht hier nicht: Der Unterschied zwischen der Näherung über die Duration
 * und dem tatsächlichen Barwert ist genau das, was Konvexität heißt – und der
 * lässt sich nur zeigen, wenn beide Zahlen aus derselben Rechnung kommen.
 *
 * ## Konventionen
 *
 * Gerechnet wird mit jährlicher Zinszahlung und ganzen Restlaufzeiten, also
 * ohne Stückzinsen und ohne Zinsstrukturkurve. Das ist die Schulbuchvariante:
 * Sie zeigt die Mechanik korrekt und blendet aus, was für das Verständnis
 * nichts beiträgt. Für die Bewertung einer konkreten Anleihe reicht sie nicht,
 * und genau das steht im Lerntext auch.
 */

export interface Anleihe {
  /** Kupon in Prozent des Nennwerts, jährlich gezahlt. */
  kuponProzent: number
  /** Restlaufzeit in ganzen Jahren. */
  jahre: number
}

/** Die Zahlungen einer Anleihe: Kupons, im letzten Jahr plus Nennwert. */
function zahlungen(anleihe: Anleihe): { jahr: number; betrag: number }[] {
  const reihe: { jahr: number; betrag: number }[] = []
  for (let jahr = 1; jahr <= anleihe.jahre; jahr++) {
    const tilgung = jahr === anleihe.jahre ? 100 : 0
    reihe.push({ jahr, betrag: anleihe.kuponProzent + tilgung })
  }
  return reihe
}

/**
 * Der Kurs in Prozent des Nennwerts bei gegebenem Marktzins.
 *
 * Nichts anderes als der Barwert aller Zahlungen. Steht der Marktzins genau
 * auf dem Kupon, kommt 100 heraus – das ist die Probe auf die Rechnung.
 */
export function kurs(anleihe: Anleihe, marktzinsProzent: number): number {
  const r = marktzinsProzent / 100
  return zahlungen(anleihe).reduce(
    (summe, zahlung) => summe + zahlung.betrag / (1 + r) ** zahlung.jahr,
    0
  )
}

/**
 * Macaulay-Duration in Jahren.
 *
 * Der mit den Barwerten gewichtete Durchschnitt der Zahlungszeitpunkte. Bei
 * einer Nullkuponanleihe ist sie gleich der Laufzeit; jeder Kupon zieht sie
 * nach vorn, weil ein Teil des Geldes früher zurückfließt.
 */
export function macaulayDuration(anleihe: Anleihe, marktzinsProzent: number): number {
  const r = marktzinsProzent / 100
  const preis = kurs(anleihe, marktzinsProzent)
  if (preis === 0) return 0

  const gewichtet = zahlungen(anleihe).reduce(
    (summe, zahlung) => summe + (zahlung.jahr * zahlung.betrag) / (1 + r) ** zahlung.jahr,
    0
  )
  return gewichtet / preis
}

/**
 * Modifizierte Duration – die Größe, mit der tatsächlich gerechnet wird.
 *
 * Sie gibt an, um wie viel Prozent der Kurs fällt, wenn der Marktzins um
 * einen Prozentpunkt steigt. Die Macaulay-Duration allein tut das nicht: Sie
 * muss noch um den Aufzinsungsfaktor bereinigt werden.
 */
export function modifizierteDuration(anleihe: Anleihe, marktzinsProzent: number): number {
  return macaulayDuration(anleihe, marktzinsProzent) / (1 + marktzinsProzent / 100)
}

export interface Zinsschock {
  /** Kurs vor der Zinsänderung. */
  vorher: number
  /** Tatsächlicher Kurs nach der Zinsänderung, exakt gerechnet. */
  nachher: number
  /** Tatsächliche Kursänderung in Prozent. */
  tatsaechlichProzent: number
  /** Was die Duration vorhergesagt hätte, in Prozent. */
  genaehertProzent: number
}

/**
 * Was eine Zinsänderung mit dem Kurs macht – exakt und in der Näherung.
 *
 * Die Differenz zwischen beiden Werten ist die Konvexität. Sie fällt immer zu
 * Gunsten des Anleihebesitzers aus: Bei steigenden Zinsen fällt der Kurs
 * weniger stark als vorhergesagt, bei fallenden steigt er stärker. Deshalb ist
 * die Näherung kein bloßer Rundungsfehler, sondern systematisch vorsichtig.
 */
export function zinsschock(
  anleihe: Anleihe,
  marktzinsProzent: number,
  aenderungProzentpunkte: number
): Zinsschock {
  const vorher = kurs(anleihe, marktzinsProzent)
  const nachher = kurs(anleihe, marktzinsProzent + aenderungProzentpunkte)

  return {
    vorher,
    nachher,
    tatsaechlichProzent: ((nachher - vorher) / vorher) * 100,
    genaehertProzent:
      -modifizierteDuration(anleihe, marktzinsProzent) * aenderungProzentpunkte,
  }
}
