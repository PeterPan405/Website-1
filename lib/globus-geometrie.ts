/**
 * Die Rechnung hinter dem Globus.
 *
 * Ohne Importe, damit sie sich unter `tests/` direkt prüfen lässt – dieselbe
 * Aufteilung wie bei `lib/market-range.ts`, `lib/market-quote.ts` und
 * `lib/figure-geometry.ts`. Der Anlass ist derselbe: Eine Drehung, die am
 * Pol umkippt, und eine Farbskala, die alles gleich einfärbt, stürzen nicht ab.
 * Sie sehen nur falsch aus, und zwar auf eine Weise, die man für Absicht halten
 * kann.
 *
 * Die eigentliche Projektion übernimmt `d3-geo`. Kugelgeometrie richtig zu
 * schneiden – ein Land, das halb hinter dem Horizont liegt, muss am Horizont
 * abgeschnitten werden, nicht weggelassen – ist keine Aufgabe, die man neben
 * einer Website noch einmal löst.
 */

/** Drehung des Globus in Grad. */
export interface Drehung {
  /** Drehung um die Polachse. Positiv nach Osten. */
  lambda: number
  /** Neigung. Positiv kippt den Nordpol zum Betrachter. */
  phi: number
}

/**
 * Wie weit sich der Globus neigen lässt.
 *
 * Ohne Grenze dreht ein Zug nach unten über den Pol hinaus – die Karte steht
 * dann auf dem Kopf, und die nächste Bewegung fühlt sich spiegelverkehrt an.
 * Bei 90 Grad blickt man genau auf den Pol; das ist die sinnvolle Grenze.
 */
export const MAX_NEIGUNG = 90

/** Kleinste und größte Vergrößerung. */
export const MIN_ZOOM = 1
export const MAX_ZOOM = 8

/**
 * Ab welcher Vergrößerung die feinere Geometrie gebraucht wird.
 *
 * Darunter ist der Unterschied zwischen 110m und 50m nicht zu sehen, darüber
 * werden Küstenlinien sichtbar eckig.
 */
export const FEINE_GEOMETRIE_AB = 2.2

/**
 * Wie viel Drehung ein Mausweg von einem Kugelradius auslöst.
 *
 * **Warum überhaupt ein Radiusbezug.** Der Weg wird durch den Radius geteilt
 * und nicht mit einem festen Faktor multipliziert: Auf einem großen Globus
 * soll derselbe Weg in Pixeln dieselbe Strecke auf der Kugel bedeuten wie auf
 * einem kleinen. Weil der Radius die Vergrößerung enthält, wird das Ziehen im
 * Zoom automatisch feiner – genau dann, wenn man es genauer braucht.
 *
 * **Warum 60 und nicht 90.** Physikalisch genau wäre 90: Vom Mittelpunkt der
 * Kugel bis zu ihrem Rand liegt eine Vierteldrehung, ein Zug über den ganzen
 * Radius müsste die Kugel also um 90 Grad drehen, damit der Punkt unter dem
 * Finger auch am Finger bleibt. In der Bedienung wirkt das trotzdem hektisch,
 * weil man beim Ziehen nicht nur einen Punkt verfolgt, sondern die ganze
 * Kugel im Blick hat. 60 Grad lassen sich noch mit zwei Zügen einmal
 * herumdrehen und fühlen sich dabei ruhig an.
 *
 * Vorher standen hier 180 – doppelt so schnell wie physikalisch richtig und
 * damit dreimal so schnell wie jetzt.
 */
export const ZUG_GRAD_JE_RADIUS = 60

/**
 * Neue Drehung nach einem Mausweg.
 *
 * Beide Achsen folgen derselben Vorstellung: **Die Kugel klebt am Zeiger.**
 * Nach rechts ziehen schiebt die Oberfläche nach rechts, nach unten ziehen
 * schiebt sie nach unten – und weil dabei das, was oberhalb war, in die Mitte
 * rutscht, blickt man anschließend weiter nach Norden.
 *
 * Genau daran hakte es: Die Neigung hatte das umgekehrte Vorzeichen. Nach
 * unten zu ziehen drehte den Globus nach oben. Waagerecht stimmte es, was den
 * Fehler noch merkwürdiger machte – eine Achse zog mit, die andere dagegen.
 */
export function drehungNachZug(
  start: Drehung,
  dx: number,
  dy: number,
  radius: number
): Drehung {
  const grad = ZUG_GRAD_JE_RADIUS / Math.max(radius, 1)
  return {
    lambda: normalisiereLaenge(start.lambda + dx * grad),
    phi: begrenze(start.phi + dy * grad, -MAX_NEIGUNG, MAX_NEIGUNG),
  }
}

/** Hält den Längengrad im Bereich −180 bis 180. */
export function normalisiereLaenge(grad: number): number {
  const rest = (((grad + 180) % 360) + 360) % 360
  return rest - 180
}

export function begrenze(wert: number, min: number, max: number): number {
  return Math.min(Math.max(wert, min), max)
}

/**
 * Zoom nach einem Rad- oder Tastenschritt.
 *
 * Multiplikativ, nicht additiv: Von zweifacher auf dreifache Vergrößerung ist
 * gefühlt ein kleinerer Schritt als von einfacher auf zweifache. Ein fester
 * Summand macht das Zoomen unten grob und oben zäh.
 */
export function zoomSchritt(aktuell: number, faktor: number): number {
  return begrenze(aktuell * faktor, MIN_ZOOM, MAX_ZOOM)
}

/**
 * Drehung, die ein Land in die Mitte holt.
 *
 * `lambda` ist das negative Längenmaß: Um den Punkt bei 10° Ost nach vorn zu
 * bringen, muss die Kugel um 10° nach Westen gedreht werden. Dieses Vorzeichen
 * ist die häufigste Verwechslung bei der orthografischen Projektion.
 */
export function drehungZu(laenge: number, breite: number): Drehung {
  return {
    lambda: normalisiereLaenge(-laenge),
    phi: begrenze(breite, -MAX_NEIGUNG, MAX_NEIGUNG),
  }
}

/**
 * Kürzester Weg zwischen zwei Längengraden.
 *
 * Für die Animation beim Anspringen eines Landes. Ohne diese Rechnung dreht
 * der Globus von 170° Ost nach 170° West einmal komplett herum, statt die
 * 20 Grad über die Datumsgrenze zu nehmen.
 */
export function kuerzesteStrecke(von: number, nach: number): number {
  return normalisiereLaenge(nach - von)
}

/** Zwischenschritt einer Drehbewegung, `anteil` von 0 bis 1. */
export function drehungZwischen(von: Drehung, nach: Drehung, anteil: number): Drehung {
  const t = begrenze(anteil, 0, 1)
  return {
    lambda: normalisiereLaenge(
      von.lambda + kuerzesteStrecke(von.lambda, nach.lambda) * t
    ),
    phi: von.phi + (nach.phi - von.phi) * t,
  }
}

/**
 * Weiches Ein- und Auslaufen für Animationen.
 *
 * `easeInOutCubic`. Eine lineare Bewegung wirkt auf einer Kugel mechanisch,
 * weil die Geschwindigkeit am Rand scheinbar zunimmt.
 */
export function weich(t: number): number {
  const x = begrenze(t, 0, 1)
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2
}

// --------------------------------------------------------------- Farbskala

/**
 * Klassengrenzen nach Quantilen.
 *
 * **Warum nicht gleich breite Klassen.** Die Kennzahlen dieses Globus sind
 * extrem schief verteilt: Das größte Bruttoinlandsprodukt ist rund
 * zwanzigtausendmal so groß wie das kleinste. Bei gleich breiten Klassen läge
 * alles außer den USA und China in der untersten – die Karte wäre einfarbig
 * und damit nutzlos.
 *
 * Quantile teilen stattdessen nach Rang. Der Preis: Die Farbe zeigt den
 * **Rang**, nicht den Abstand. Zwei benachbarte Farbstufen können 50 oder
 * 5.000 Milliarden auseinanderliegen. Deshalb steht die Zahl bei jedem Land
 * auch im Klartext daneben, und die Legende nennt die Grenzen.
 *
 * ## Der kleinste Wert bekommt seine eigene Klasse
 *
 * Reine Quantile versagen, sobald ein Wert die Mehrheit stellt. Bei der
 * Kennzahl „Kurse auf dieser Seite“ haben 163 von 177 Ländern den Wert null;
 * alle vier Quantilsgrenzen lagen damit bei null. Weil eine Grenze als
 * „erreicht“ gilt, sobald der Wert sie nicht unterschreitet, landeten diese
 * 163 Länder in der **höchsten** Klasse – die Karte behauptete, fast überall
 * gäbe es besonders viele Kurse. Aufgefallen ist das erst beim Draufschauen.
 *
 * Deshalb: Die unterste Klasse enthält genau den kleinsten Wert, die übrigen
 * teilen den Rest unter sich auf. Doppelte Grenzen fallen weg – dann gibt es
 * eben weniger Klassen, statt falscher.
 *
 * @returns Bis zu `stufen - 1` streng steigende Grenzen.
 */
export function quantilsgrenzen(werte: readonly number[], stufen: number): number[] {
  const brauchbar = werte.filter((wert) => Number.isFinite(wert)).sort((a, b) => a - b)
  if (brauchbar.length === 0 || stufen < 2) return []

  const kleinster = brauchbar[0]
  const darueber = brauchbar.filter((wert) => wert > kleinster)
  // Alle Werte gleich: eine einzige Klasse, keine Grenze.
  if (darueber.length === 0) return []

  // Die erste Grenze trennt den kleinsten Wert vom Rest.
  const grenzen = [darueber[0]]

  const restklassen = stufen - 1
  for (let i = 1; i < restklassen; i += 1) {
    const index = Math.min(
      Math.floor((darueber.length * i) / restklassen),
      darueber.length - 1
    )
    const kandidat = darueber[index]
    if (kandidat > grenzen[grenzen.length - 1]) grenzen.push(kandidat)
  }

  return grenzen
}

/**
 * Klasse eines Werts – 0 für die niedrigste.
 *
 * `null` und `undefined` bekommen `-1`: „keine Daten“ ist keine Klasse,
 * sondern eine eigene Aussage. Sie in die unterste Klasse zu legen wäre der
 * gefährlichste Fehler dieser ganzen Datei – ein Land ohne Daten sähe aus wie
 * ein Land ohne Wirtschaft.
 */
export function stufeFuer(
  wert: number | null | undefined,
  grenzen: readonly number[]
): number {
  if (wert === null || wert === undefined || !Number.isFinite(wert)) return -1
  let stufe = 0
  for (const grenze of grenzen) {
    if (wert >= grenze) stufe += 1
  }
  return stufe
}
