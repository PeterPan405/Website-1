/**
 * Lernkarten zum Ausdrucken – und die Frage, an der so etwas scheitert.
 *
 * ## Der eigentliche Inhalt dieser Datei
 *
 * Nicht die Karten. Die **Rückseiten**.
 *
 * Ein Bogen mit acht Karten wird beidseitig gedruckt. Druckt man die Rückseite
 * in derselben Reihenfolge wie die Vorderseite, landet die Antwort zu Karte 1
 * auf der Rückseite von Karte 2 – und zwar auf jedem einzelnen Blatt, ohne
 * dass am Bildschirm irgendetwas falsch aussieht. Man merkt es erst mit der
 * Schere in der Hand.
 *
 * Der Grund: Beim beidseitigen Druck über die lange Kante wird das Blatt um
 * seine **senkrechte** Achse gewendet. Was vorn links liegt, liegt hinten
 * rechts. Die Rückseite muss deshalb **zeilenweise gespiegelt** werden:
 *
 *     Vorderseite      Rückseite (gedruckt)     Nach dem Wenden liegt
 *     1  2             2  1                     hinter 1 die 1
 *     3  4             4  3                     hinter 2 die 2
 *     5  6             6  5
 *     7  8             8  7
 *
 * `rueckseiten()` macht genau das, und `tests/lernkarten.test.ts` prüft es
 * gegen eine ausgeschriebene Sollreihenfolge. Es ist eine Zeile Code und der
 * einzige Grund, warum diese Datei existiert.
 *
 * ## Warum acht und nicht zwölf
 *
 * Weil die Karte lesbar bleiben muss. Bei den Blatträndern dieser Website
 * (`@page { margin: 18mm 16mm }` in `app/globals.css`) bleiben auf A4 rund
 * 178 × 261 Millimeter. Auf zwei Spalten und vier Zeilen ergibt das Karten von
 * etwa 89 × 65 Millimetern – knapp größer als eine Visitenkarte. Bei zwölf
 * Karten wären es 89 × 43, und eine Quizfrage mit Begründung passt dort nicht
 * mehr in lesbarer Schrift.
 *
 * ## Woher die Karten kommen
 *
 * Aus dem, was schon da ist: den Glossarbegriffen eines Themas und den
 * Quizfragen seiner drei Stufen. Nichts wird für die Karten neu geschrieben –
 * eine zweite Fassung derselben Erklärung wäre eine zweite Wahrheit.
 */

/** Zwei Spalten, vier Zeilen. Beides steckt in der Spiegelung. */
export const SPALTEN = 2
export const ZEILEN = 4
export const KARTEN_JE_BOGEN = SPALTEN * ZEILEN

export type Kartenart = 'begriff' | 'frage'

export interface Lernkarte {
  /** Kennung, eindeutig innerhalb eines Themas. */
  id: string
  art: Kartenart
  /** Was auf der Vorderseite steht. */
  vorn: string
  /** Was auf der Rückseite steht. */
  hinten: string
  /** Die Stufe, aus der die Karte stammt – nur bei Fragen. */
  stufe?: string
}

/** Ein Platz auf dem Bogen – leere Plätze tragen `null`. */
export type Platz = Lernkarte | null

export interface Bogen {
  /** Von 1 an gezählt, wie es auf dem Blatt steht. */
  nummer: number
  /** Die Vorderseite, zeilenweise von links oben. */
  vorderseite: Platz[]
  /** Die Rückseite in Druckreihenfolge – zeilenweise gespiegelt. */
  rueckseite: Platz[]
}

/**
 * Die Karten eines Themas in Bögen zu acht.
 *
 * Der letzte Bogen wird mit leeren Plätzen aufgefüllt und nicht abgeschnitten:
 * Ein Bogen mit drei Karten ist ein Bogen mit drei Karten. Ihn wegzulassen
 * hieße, drei Karten verschwinden zu lassen, und sie auf sieben aufzustocken
 * hieße, vier Karten zu erfinden.
 */
export function boegen(karten: readonly Lernkarte[]): Bogen[] {
  const ergebnis: Bogen[] = []

  for (let start = 0; start < karten.length; start += KARTEN_JE_BOGEN) {
    const teil = karten.slice(start, start + KARTEN_JE_BOGEN)
    const vorderseite: Platz[] = [
      ...teil,
      ...Array<Platz>(KARTEN_JE_BOGEN - teil.length).fill(null),
    ]

    ergebnis.push({
      nummer: ergebnis.length + 1,
      vorderseite,
      rueckseite: rueckseiten(vorderseite),
    })
  }

  return ergebnis
}

/**
 * Die Rückseite in Druckreihenfolge: jede Zeile umgedreht.
 *
 * Das ist der ganze Trick, und er ist beim beidseitigen Druck über die lange
 * Kante zwingend. Wer ihn wegkürzt, weil „die Reihenfolge doch dieselbe ist“,
 * bekommt einen Bogen, auf dem jede Antwort hinter der falschen Frage steht –
 * und zwar erst nach dem Zuschneiden sichtbar.
 *
 * Leere Plätze werden mitgespiegelt. Ein Bogen mit drei Karten hat vorn
 * `1 2 / 3 _ / _ _ / _ _` und hinten `2 1 / _ 3 / _ _ / _ _`; ließe man die
 * Lücken weg, rutschte Karte 3 in die falsche Spalte.
 */
export function rueckseiten(vorderseite: readonly Platz[]): Platz[] {
  const gespiegelt: Platz[] = []

  for (let zeile = 0; zeile < vorderseite.length; zeile += SPALTEN) {
    gespiegelt.push(...vorderseite.slice(zeile, zeile + SPALTEN).reverse())
  }

  return gespiegelt
}

/**
 * Karten aus Glossarbegriffen.
 *
 * Vorn der Begriff, hinten der Ein-Satz-Erklärer. Genau die Form, die das
 * Glossar ohnehin hat – `kurz` ist dort schon als eigenständig tragender Satz
 * geschrieben.
 */
export function ausBegriffen(
  begriffe: readonly { slug: string; begriff: string; kurz: string }[]
): Lernkarte[] {
  return begriffe.map((eintrag) => ({
    id: `begriff-${eintrag.slug}`,
    art: 'begriff' as const,
    vorn: eintrag.begriff,
    hinten: eintrag.kurz,
  }))
}

/**
 * Karten aus Quizfragen.
 *
 * Vorn die Frage **ohne** die vier Antwortmöglichkeiten. Eine Karteikarte mit
 * Auswahlantworten prüft Wiedererkennen; ohne sie prüft sie Wissen, und das
 * ist der Zweck einer Karte. Hinten steht die richtige Antwort und darunter
 * die Begründung, die im Quiz ohnehin schon dabeisteht.
 *
 * Fragen ohne gültigen Antwortindex fallen heraus statt mit einer leeren
 * Rückseite zu erscheinen – eine Karte ohne Antwort ist keine.
 */
export function ausFragen(
  fragen: readonly {
    question: string
    options: string[]
    correctIndex: number
    explanation: string
  }[],
  stufe: string,
  praefix: string
): Lernkarte[] {
  return fragen
    .map((frage, index): Lernkarte | null => {
      const antwort = frage.options[frage.correctIndex]
      if (!antwort) return null
      return {
        id: `${praefix}-${stufe}-${index}`,
        art: 'frage',
        vorn: frage.question,
        hinten: `${antwort}\n\n${frage.explanation}`,
        stufe,
      }
    })
    .filter((karte): karte is Lernkarte => karte !== null)
}

/**
 * Wie viele Karten und Bögen ein Thema hergibt.
 *
 * Steht als eigene Funktion da, weil die Zahl an zwei Stellen gebraucht wird –
 * in der Übersicht und auf dem Bogen selbst – und zwei Zählungen irgendwann
 * zwei Ergebnisse liefern.
 */
export function umfang(karten: readonly Lernkarte[]): {
  karten: number
  begriffe: number
  fragen: number
  boegen: number
} {
  return {
    karten: karten.length,
    begriffe: karten.filter((karte) => karte.art === 'begriff').length,
    fragen: karten.filter((karte) => karte.art === 'frage').length,
    boegen: Math.ceil(karten.length / KARTEN_JE_BOGEN),
  }
}
