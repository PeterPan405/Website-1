/**
 * Die Marktbreite über die Zeit.
 *
 * ## Warum das aufgezeichnet wird
 *
 * Das Tagesbild rechnet bei jedem Kursabruf neu und merkt sich nichts. Es sagt
 * „49 Prozent Breite“ – und das bedeutet für sich genommen **gar nichts**.
 * Ohne Bezugspunkt weiß niemand, ob 49 Prozent viel oder wenig sind, ob der
 * Markt heute geteilter ist als sonst oder ob das der Normalzustand ist.
 *
 * Genau diese Zahl ist es, die ein Indexstand verschweigt. Sie ohne
 * Vergleichsmaßstab hinzuschreiben verschweigt sie ein zweites Mal.
 *
 * Eine Zeile je Handelstag kostet über ein Jahr rund fünfzehn Kilobyte. Nach
 * wenigen Wochen steht neben der Tageszahl ein Median, nach einem Jahr ein
 * Verlauf. Was heute nicht aufgezeichnet wird, ist unwiederbringlich weg –
 * deshalb steht dieses Modul früh und nicht erst dann, wenn die Auswertung
 * gebraucht wird.
 *
 * ## Warum der letzte Lauf des Tages gewinnt
 *
 * Der Kursabruf läuft alle dreißig Minuten. Jeder Lauf schreibt den Stand des
 * Tages neu, statt eine zweite Zeile anzulegen: Was zählt, ist das Bild zum
 * Handelsschluss, und das liefert der letzte Lauf. Eine Zeile je Abruf wäre
 * zweiundvierzigmal so viel Daten für dieselbe Aussage.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 */

export interface Breitenpunkt {
  /** Handelstag als `JJJJ-MM-TT`. */
  d: string
  steigend: number
  fallend: number
  unveraendert: number
  /** Ungewichteter Mittelwert der Tagesveränderungen, in Prozent. */
  schnitt: number
  /** Anteil der bewegten Titel, die mit dem Markt liefen, in Prozent. */
  breite: number
}

/**
 * Wie viele Tage aufbewahrt werden.
 *
 * Fünf Jahre Handelstage. Dieselbe Tiefe wie bei den Kursreihen, und aus
 * demselben Grund: Alles Kürzere macht den Vergleich mit einer anderen
 * Marktphase unmöglich, und genau dafür ist die Reihe da.
 */
export const HOECHSTZAHL_TAGE = 1300

/**
 * Trägt einen Tag ein und gibt die Reihe zurück.
 *
 * Ein vorhandener Eintrag desselben Tages wird ersetzt, nicht ergänzt. Sortiert
 * wird aufsteigend; verlassen sollte man sich nicht darauf, dass die Aufrufe in
 * der richtigen Reihenfolge kommen.
 */
export function fuegeEin(
  reihe: readonly Breitenpunkt[],
  punkt: Breitenpunkt,
  hoechstzahl = HOECHSTZAHL_TAGE
): Breitenpunkt[] {
  const ohne = reihe.filter((eintrag) => eintrag.d !== punkt.d)
  const neu = [...ohne, punkt].sort((a, b) => a.d.localeCompare(b.d))
  return neu.slice(-hoechstzahl)
}

/**
 * Wie viele Tage Lücke eine Reihe noch zusammenhängend sein lässt.
 *
 * Vierzehn Kalendertage. Zwei Wochen ohne einen einzigen aufgezeichneten
 * Handelstag heißt: Dazwischen wurde nicht aufgezeichnet, nicht: Dazwischen
 * wurde nicht gehandelt.
 */
export const HOECHSTLUECKE_TAGE = 14

/**
 * Nur der zusammenhängende jüngste Teil der Reihe.
 *
 * ## Warum das nötig ist
 *
 * Die Nachrechnung aus der Kurshistorie liefert einen einzelnen Tag aus dem
 * Jahr 2021 – den Rand der Momentaufnahme, an dem zufällig zwei benachbarte
 * Handelstage nebeneinanderstehen, bevor die wöchentliche Ausdünnung beginnt.
 * Die Zahl für diesen Tag ist richtig gerechnet. In einer Linie neben den
 * Tagen der letzten Monate ist sie trotzdem falsch: Sie legt einen Verlauf
 * über vier Jahre nahe, den es nicht gibt.
 *
 * Ein einzelner Punkt vor einer Lücke von vier Jahren ist keine Geschichte,
 * sondern ein Artefakt.
 */
export function nurZusammenhaengend(
  reihe: readonly Breitenpunkt[],
  hoechstluecke = HOECHSTLUECKE_TAGE
): Breitenpunkt[] {
  if (reihe.length === 0) return []

  const sortiert = [...reihe].sort((a, b) => a.d.localeCompare(b.d))
  let beginn = 0
  for (let index = 1; index < sortiert.length; index += 1) {
    const abstand =
      (Date.parse(`${sortiert[index].d}T00:00:00Z`) -
        Date.parse(`${sortiert[index - 1].d}T00:00:00Z`)) /
      86_400_000
    if (abstand > hoechstluecke) beginn = index
  }
  return sortiert.slice(beginn)
}

/** Der Median einer Zahlenreihe, oder `null` bei leerer Reihe. */
export function median(werte: readonly number[]): number | null {
  if (werte.length === 0) return null
  const sortiert = [...werte].sort((a, b) => a - b)
  const mitte = Math.floor(sortiert.length / 2)
  return sortiert.length % 2 === 1
    ? sortiert[mitte]
    : (sortiert[mitte - 1] + sortiert[mitte]) / 2
}

export interface Einordnung {
  /** Wie viele Tage in den Vergleich eingegangen sind. */
  tage: number
  median: number
  niedrigster: number
  hoechster: number
  /**
   * Der Rang des heutigen Werts, in Prozent.
   *
   * 0 heißt: kein Tag im Vergleichszeitraum war geteilter. 100 heißt: keiner
   * war breiter getragen.
   */
  rangProzent: number
}

/**
 * Ab wie vielen Tagen ein Vergleich überhaupt etwas aussagt.
 *
 * Zwanzig Handelstage sind rund ein Monat. Darunter wird nichts eingeordnet,
 * sondern `null` zurückgegeben – ein Median aus drei Tagen ist kein Median,
 * sondern der mittlere von drei Zahlen, und ihn als Maßstab hinzuschreiben
 * wäre genau die Sorte Zahl, die diese Website nicht ausgibt.
 */
export const MINDESTTAGE = 20

/**
 * Wo der heutige Wert im Vergleich zur bisherigen Reihe liegt.
 *
 * `null`, solange zu wenig Geschichte da ist. Der aktuelle Tag zählt selbst
 * nicht mit: Verglichen wird gegen das, was vorher war.
 */
export function ordneBreiteEin(
  reihe: readonly Breitenpunkt[],
  heute: number,
  mindesttage = MINDESTTAGE
): Einordnung | null {
  const werte = reihe.map((punkt) => punkt.breite)
  if (werte.length < mindesttage) return null

  const mittelwert = median(werte)
  if (mittelwert === null) return null

  const darunter = werte.filter((wert) => wert < heute).length
  return {
    tage: werte.length,
    median: mittelwert,
    niedrigster: Math.min(...werte),
    hoechster: Math.max(...werte),
    rangProzent: (darunter / werte.length) * 100,
  }
}

/**
 * Ein Satz zur Einordnung.
 *
 * Der heutige Wert steckt bereits in `rangProzent` – er wird deshalb nicht
 * noch einmal übergeben. Ein zweiter Weg zu derselben Zahl ist ein zweiter
 * Weg, sie falsch zu bekommen.
 *
 * Bewusst ohne Wertung: „breiter getragen als an vier von fünf Tagen“ ist eine
 * Beobachtung. „Der Markt ist gesund“ wäre eine Behauptung, und sie ließe sich
 * aus dieser Zahl nicht ableiten.
 */
export function einordnungssatz(einordnung: Einordnung | null): string {
  if (!einordnung) {
    return (
      'Für einen Vergleich mit früheren Tagen reicht die Aufzeichnung noch nicht. ' +
      'Sie beginnt mit dem ersten Kursabruf nach Einführung dieser Seite und wächst ' +
      'um einen Tag je Handelstag.'
    )
  }

  const rang = Math.round(einordnung.rangProzent)
  const spanne = `zwischen ${Math.round(einordnung.niedrigster)} und ${Math.round(einordnung.hoechster)} Prozent`

  if (rang >= 80) {
    return `Breiter getragen als an ${rang} Prozent der letzten ${einordnung.tage} Handelstage. Die Spanne lag dort ${spanne}.`
  }
  if (rang <= 20) {
    return `Geteilter als an ${100 - rang} Prozent der letzten ${einordnung.tage} Handelstage. Die Spanne lag dort ${spanne}.`
  }
  return `Das liegt im mittleren Bereich der letzten ${einordnung.tage} Handelstage – deren Median beträgt ${Math.round(einordnung.median)} Prozent, die Spanne ${spanne}.`
}

/**
 * Schreibt die Reihe mit einer Zeile je Tag.
 *
 * Wie bei den Kursen und aus demselben Grund: Ein Handelstag mehr ist dann
 * genau eine neue Zeile im Diff und nicht eine neu formatierte Datei. Die
 * Datei steht deshalb in `.prettierignore`.
 */
export function serialisiereBreite(bestand: {
  abgerufenAm: string | null
  reihe: readonly Breitenpunkt[]
}): string {
  const zeilen = bestand.reihe.map(
    (punkt) =>
      `    { "d": "${punkt.d}", "steigend": ${punkt.steigend}, "fallend": ${punkt.fallend}, ` +
      `"unveraendert": ${punkt.unveraendert}, "schnitt": ${punkt.schnitt}, "breite": ${punkt.breite} }`
  )
  const kopf = `{\n  "abgerufenAm": ${JSON.stringify(bestand.abgerufenAm)},\n  "reihe": [\n`
  return `${kopf}${zeilen.join(',\n')}\n  ]\n}\n`
}
