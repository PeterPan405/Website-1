import { getLiveSeries } from '@/lib/market-live'

/**
 * Die Jahresrenditen eines Instruments aus der gespeicherten Kursreihe.
 *
 * ## Wofür
 *
 * `lib/sequenzrisiko.ts` ist seit Langem gebaut und geprüft – und wurde an
 * genau einer Stelle benutzt: für eine Zeichnung in einer Lernstufe, mit
 * ausgedachten Renditen. Gleichzeitig rechnet der Zinsrechner mit einer
 * konstanten Annahme.
 *
 * Beides zusammenzubringen kostet nur diese Datei: echte Jahresrenditen statt
 * erfundener. Der Unterschied zwischen „sieben Prozent im Mittel“ und „diese
 * Jahre in dieser Reihenfolge“ ist das, worum es beim Sequenzrisiko geht, und
 * er lässt sich nicht behaupten, sondern nur zeigen.
 *
 * ## Warum nur fünf Jahre
 *
 * Weil die Momentaufnahme nicht weiter zurückreicht. Das ist wenig für eine
 * Aussage über Entnahmepläne, und deshalb steht es überall dabei, wo die
 * Zahlen erscheinen. Fünf echte Jahre sind trotzdem mehr wert als dreißig
 * ausgedachte: Sie sind passiert.
 */

export interface Jahresrendite {
  jahr: number
  /** Veränderung des Schlusskurses gegenüber dem Vorjahresende, in Prozent. */
  prozent: number
}

/**
 * Die Jahresrenditen eines Symbols, ältestes Jahr zuerst.
 *
 * Gerechnet wird von Jahresende zu Jahresende. Das laufende Jahr fällt heraus:
 * Eine Rendite über sieben Monate als Jahresrendite auszuweisen wäre falsch,
 * und sie wegzulassen ist die einzige Alternative, die keine Zahl erfindet.
 */
export function getJahresrenditen(symbol: string): Jahresrendite[] {
  const reihe = getLiveSeries(symbol)
  if (!reihe || reihe.daily.length < 2) return []

  /* Je Jahr der letzte vorhandene Schlusskurs. */
  const jahresende = new Map<number, number>()
  for (const punkt of reihe.daily) {
    const jahr = Number(punkt.t.slice(0, 4))
    if (!Number.isFinite(jahr)) continue
    jahresende.set(jahr, punkt.value)
  }

  const jahre = [...jahresende.keys()].sort((a, b) => a - b)
  const laufendesJahr = new Date().getFullYear()

  const ergebnis: Jahresrendite[] = []
  for (let index = 1; index < jahre.length; index += 1) {
    const jahr = jahre[index]
    if (jahr >= laufendesJahr) continue

    const vorher = jahresende.get(jahre[index - 1])
    const jetzt = jahresende.get(jahr)
    if (!vorher || !jetzt || vorher <= 0) continue

    /*
      Nur aufeinanderfolgende Jahre. Klafft eine Lücke, wäre die „Rendite“ die
      eines Zweijahreszeitraums – eine richtig gerechnete Zahl mit falscher
      Beschriftung, und das ist die gefährlichste Sorte.
    */
    if (jahr - jahre[index - 1] !== 1) continue

    ergebnis.push({ jahr, prozent: ((jetzt - vorher) / vorher) * 100 })
  }

  return ergebnis
}
