/**
 * Wie breit eine Auswahl von Aktien streut.
 *
 * ## Warum das die Merkliste braucht
 *
 * Streuung ist auf dieser Website an mehreren Stellen erklärt – im Lernbereich,
 * in der Akademie, auf jeder Branchenseite. Immer am Beispiel. Eine Merkliste
 * ist der erste Ort, an dem sich dieselbe Rechnung an den Titeln vorführen
 * lässt, für die sich jemand tatsächlich interessiert, und das ist ein
 * Unterschied: „Zehn Titel aus einer Branche streuen weniger als drei aus
 * dreien“ liest sich anders, wenn die zehn die eigenen sind.
 *
 * ## Was hier ausdrücklich nicht gerechnet wird
 *
 * Kein Risikomaß. Keine Korrelation, keine Volatilität, kein Wert, der wie eine
 * Bewertung des Depots aussieht – schon deshalb nicht, weil eine Merkliste
 * keine Stückzahlen kennt und damit gar kein Depot ist. Gezählt wird, was
 * zählbar ist: wie viele Branchen, wie viele Länder, wie groß der größte
 * Klumpen.
 *
 * Das ist weniger, als ein Anbieter mit Depotanbindung könnte, und mehr, als
 * eine Zahl ohne Grundlage wert wäre.
 *
 * ## Warum der größte Klumpen die wichtigste Zahl ist
 *
 * Weil „acht Titel in fünf Branchen“ gut klingt und trotzdem eine Auswahl
 * beschreiben kann, die zur Hälfte an einem Faden hängt: vier Halbleiter und je
 * einer aus vier anderen Branchen. Die Zahl der Gruppen sagt nichts über ihre
 * Größe. Der Anteil der größten sagt genau das.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 */

/** Ein Titel, so weit die Streuung ihn braucht. */
export interface Streuposten {
  /** Die Branche, oder `null` wenn keine hinterlegt ist. */
  branche: string | null
  /** Das Sitzland als ISO-3166-Zahl, oder `null`. */
  sitzland: string | null
}

/** Eine Gruppe und ihr Gewicht in der Auswahl. */
export interface Gruppe {
  name: string
  anzahl: number
  /** Anteil an allen Titeln, in Prozent. */
  anteilProzent: number
}

export interface Streubefund {
  /** Wie viele Titel ausgewertet wurden. */
  titel: number
  /** Die Branchen, größte zuerst. */
  branchen: Gruppe[]
  /** Die Sitzländer, größtes zuerst. */
  laender: Gruppe[]
  /**
   * Der größte Branchenklumpen, oder `null` bei weniger als zwei Titeln.
   *
   * Bei einem einzigen Titel wäre er hundert Prozent – richtig gerechnet und
   * als Aussage wertlos. Wer einen Titel merkt, streut nicht, und das muss
   * ihm niemand ausrechnen.
   */
  groessterKlumpen: Gruppe | null
  /** Wie viele Titel keiner Branche zugeordnet sind. */
  ohneBranche: number
  /** Wie viele Titel kein Sitzland tragen. */
  ohneLand: number
}

function gruppiere(werte: readonly (string | null)[]): Gruppe[] {
  const gezaehlt = new Map<string, number>()
  let bekannt = 0
  for (const wert of werte) {
    if (!wert) continue
    bekannt += 1
    gezaehlt.set(wert, (gezaehlt.get(wert) ?? 0) + 1)
  }
  if (bekannt === 0) return []

  return [...gezaehlt.entries()]
    .map(([name, anzahl]) => ({
      name,
      anzahl,
      /*
        Bezugsgröße ist die Zahl der **zugeordneten** Titel, nicht die aller.
        Sonst ergäben fünf Halbleiter unter acht Titeln, von denen zwei keine
        Branche tragen, 63 Prozent statt der zutreffenden 83 – und der Klumpen
        sähe kleiner aus, weil Daten fehlen.
      */
      anteilProzent: (anzahl / bekannt) * 100,
    }))
    .sort((a, b) => b.anzahl - a.anzahl || a.name.localeCompare(b.name, 'de'))
}

/** Wertet eine Auswahl aus. */
export function werteStreuung(posten: readonly Streuposten[]): Streubefund {
  const branchen = gruppiere(posten.map((eintrag) => eintrag.branche))
  const laender = gruppiere(posten.map((eintrag) => eintrag.sitzland))

  return {
    titel: posten.length,
    branchen,
    laender,
    groessterKlumpen: posten.length >= 2 ? (branchen[0] ?? null) : null,
    ohneBranche: posten.filter((eintrag) => !eintrag.branche).length,
    ohneLand: posten.filter((eintrag) => !eintrag.sitzland).length,
  }
}

/**
 * Wie die Streuung einzuordnen ist.
 *
 * Die Schwellen sind keine Wissenschaft und geben sich auch nicht so. Sie
 * trennen drei Fälle, die sich sprachlich unterscheiden lassen, und der Text
 * dazu nennt jeweils den Grund – nicht eine Note.
 *
 * `null` bei weniger als zwei Titeln: Über eine Auswahl von einem lässt sich
 * nichts über Streuung sagen, außer dass es keine gibt, und das weiß der
 * Betreffende selbst.
 */
export type Einordnung = 'einseitig' | 'gemischt' | 'breit'

export function ordneEin(befund: Streubefund): Einordnung | null {
  if (befund.titel < 2 || !befund.groessterKlumpen) return null
  if (befund.groessterKlumpen.anteilProzent >= 50) return 'einseitig'
  if (befund.branchen.length >= 5 && befund.groessterKlumpen.anteilProzent < 35) {
    return 'breit'
  }
  return 'gemischt'
}
