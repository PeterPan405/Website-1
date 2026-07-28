/**
 * Die tägliche Abrechnung eines Terminkontrakts.
 *
 * ## Warum das eine eigene Datei ist
 *
 * Weil es gerechnet wird und nicht gezeichnet. Die Grafik im Lernbereich
 * zeigt den Verlauf eines Sicherheitskontos bis zum Margin Call; der Verlauf
 * selbst ist eine Schleife über Kursänderungen, die man prüfen kann und
 * deshalb auch prüfen sollte.
 *
 * ## Was hier abgebildet wird
 *
 * Ein Future wird täglich abgerechnet: Die Kursbewegung des Tages wird dem
 * Sicherheitskonto gutgeschrieben oder abgebucht (**Variation Margin**).
 * Fällt das Konto unter die **Maintenance Margin**, kommt der Margin Call –
 * nachschießen oder die Position wird geschlossen.
 *
 * Gerechnet wird der gesamte Verlauf, auch über den Margin Call hinaus. Das
 * ist Absicht: Was danach passiert, ist die eigentliche Aussage. Erholt sich
 * der Kurs, hätte sich das Konto mit ihm erholt – nur gibt es die Position
 * dann nicht mehr. Diese Fortsetzung ist eine Rechnung und kein Verlauf, und
 * wer sie verwendet, muss sie als solche kennzeichnen.
 *
 * ## Was hier bewusst fehlt
 *
 * Nachschüsse. Wer nachzahlt, hält die Position – dann gibt es kein Ereignis
 * zu zeigen. Der Fall, um den es geht, ist der, in dem nicht nachgezahlt
 * werden kann.
 */

export interface Margintag {
  /** Nullbasiert: Tag 0 ist der Tag der Eröffnung. */
  tag: number
  /** Der Kurs des Basiswerts, indexiert auf 100 am Eröffnungstag. */
  kurs: number
  /** Der Stand des Sicherheitskontos nach der Abrechnung des Abends. */
  konto: number
}

export interface Marginverlauf {
  tage: Margintag[]
  /**
   * Der Tag, an dem das Konto zum ersten Mal unter die Untergrenze fällt.
   *
   * `null`, wenn das nie passiert. Diesen Fall gibt der Aufrufer nicht
   * stillschweigend als „am letzten Tag“ aus: Ein Verlauf ohne Margin Call
   * erzählt eine andere Geschichte und soll auch anders aussehen.
   */
  margincall: number | null
}

/**
 * Rechnet den Verlauf eines Sicherheitskontos Tag für Tag durch.
 *
 * @param kontraktwert Der Wert des Kontrakts, auf den sich die Kursänderungen beziehen.
 * @param ersteinschussProzent Anfangssicherheit in Prozent des Kontraktwerts.
 * @param untergrenzeProzent Die Maintenance Margin in Prozent des Kontraktwerts.
 * @param kursaenderungen Tägliche Kursänderungen in Prozent; der erste Wert
 *   gehört zum Eröffnungstag und wird nicht abgerechnet.
 */
export function marginverlauf(
  kontraktwert: number,
  ersteinschussProzent: number,
  untergrenzeProzent: number,
  kursaenderungen: readonly number[]
): Marginverlauf {
  const untergrenze = kontraktwert * (untergrenzeProzent / 100)
  const tage: Margintag[] = []
  let margincall: number | null = null

  let kurs = 100
  let konto = kontraktwert * (ersteinschussProzent / 100)

  /*
    Ein Cent Toleranz an der Grenze.

    Ohne sie entscheidet die Gleitkommaarithmetik: Ein Konto, das rechnerisch
    genau auf der Untergrenze steht, landet je nach Rundungsrest ein
    Milliardstel darüber oder darunter – und im zweiten Fall meldet die
    Rechnung einen Margin Call, den es nicht gibt. Dieselbe Schwelle benutzt
    `lib/kredit.ts`, wo dasselbe Problem eine Rate zu viel erzeugt hat.
  */
  const CENT = 0.005

  for (const [tag, aenderung] of kursaenderungen.entries()) {
    const vorher = kurs
    kurs = kurs * (1 + aenderung / 100)

    /*
      Abgerechnet wird die Kursbewegung in Punkten, nicht in Prozent.

      Der Unterschied ist klein und trotzdem der richtige: Ein Kontrakt lautet
      auf eine Stückzahl, und deren Wert ändert sich mit dem Kurs. Fällt der
      Kurs von 99 auf 98,01, ist das ein Prozent – aber nur 990 Euro, nicht
      1.000. Über eine Woche summiert sich die Differenz auf einen Betrag, der
      bei der Frage nach dem Tag des Margin Calls den Ausschlag geben kann.

      Am Eröffnungstag wird nicht abgerechnet: Die erste Zahl der Reihe
      beschreibt den Stand bei Eröffnung, nicht eine Bewegung seither.
    */
    if (tag > 0) konto += ((kurs - vorher) / 100) * kontraktwert

    if (margincall === null && konto < untergrenze - CENT) margincall = tag
    tage.push({ tag, kurs, konto })
  }

  return { tage, margincall }
}
