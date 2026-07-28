/**
 * Was das Verpassen der besten Perioden kostet.
 *
 * Importfrei, damit `tests/timing.test.ts` die Datei über
 * `node --experimental-strip-types` laden kann – dort löst der `@/`-Alias
 * nicht auf.
 *
 * ## Wozu das gebraucht wird
 *
 * Die Aussage „wer die zehn besten Tage verpasst, halbiert seine Rendite“
 * steht in Dutzenden Ratgebern, meist ohne Zeitraum, ohne Index und ohne
 * Rechenweg. Sie ist trotzdem richtig – und sie lässt sich mit den
 * Kursdaten, die diese Website ohnehin führt, selbst nachrechnen. Genau das
 * tut diese Datei.
 *
 * ## Was die Rechnung zeigt und was nicht
 *
 * Sie zeigt: Die Rendite eines Zeitraums hängt an sehr wenigen Perioden,
 * und wer nicht investiert ist, verpasst sie. Sie zeigt **nicht**, dass
 * Timing unmöglich ist – dafür wäre die Gegenrechnung nötig, wie es sich
 * auswirkt, die schlechtesten Perioden zu vermeiden. Der eigentliche Befund
 * liegt zwischen beidem: Die besten und die schlechtesten Perioden liegen
 * dicht beieinander, und wer die einen meiden will, verpasst die anderen.
 * Deshalb liefert `bestePerioden` beide Listen.
 */

export interface Kurspunkt {
  /** ISO-Datum. */
  d: string
  /** Schlusskurs. */
  c: number
}

export interface Periode {
  datum: string
  /** Veränderung gegenüber dem Vorpunkt in Prozent. */
  rendite: number
}

/** Die Veränderungen zwischen aufeinanderfolgenden Punkten. */
export function perioden(punkte: readonly Kurspunkt[]): Periode[] {
  const reihe: Periode[] = []
  for (let i = 1; i < punkte.length; i++) {
    const vorher = punkte[i - 1].c
    if (!Number.isFinite(vorher) || vorher <= 0) continue
    reihe.push({
      datum: punkte[i].d,
      rendite: (punkte[i].c / vorher - 1) * 100,
    })
  }
  return reihe
}

/** Gesamtrendite über alle Perioden, in Prozent. */
function verketten(reihe: readonly Periode[]): number {
  return (reihe.reduce((wert, p) => wert * (1 + p.rendite / 100), 1) - 1) * 100
}

export interface Auslassung {
  /** Wie viele der besten Perioden ausgelassen wurden. */
  ausgelassen: number
  /** Gesamtrendite in Prozent, wenn diese Perioden fehlen. */
  rendite: number
}

/**
 * Die Gesamtrendite, wenn die besten n Perioden fehlen.
 *
 * Ausgelassen heißt hier: Die Periode wird mit null Prozent angesetzt, als
 * hätte man an diesem Tag nicht am Markt teilgenommen. Das ist die übliche
 * Konvention und sie ist wohlwollend gegenüber dem Aussteigen – wer
 * tatsächlich aussteigt, hält währenddessen Bargeld und verliert real
 * zusätzlich Kaufkraft.
 */
export function ohneBestePerioden(
  punkte: readonly Kurspunkt[],
  stufen: readonly number[]
): Auslassung[] {
  const reihe = perioden(punkte)
  const sortiert = [...reihe].sort((a, b) => b.rendite - a.rendite)

  return stufen.map((ausgelassen) => {
    const raus = new Set(sortiert.slice(0, ausgelassen).map((p) => p.datum))
    return {
      ausgelassen,
      rendite: verketten(reihe.filter((p) => !raus.has(p.datum))),
    }
  })
}

/**
 * Die besten und die schlechtesten Perioden nebeneinander.
 *
 * Der interessante Teil ist nicht die Höhe, sondern die zeitliche Nähe: Die
 * stärksten Erholungen folgen regelmäßig unmittelbar auf die stärksten
 * Rückgänge. Wer aussteigt, weil es gerade schlecht lief, ist genau in der
 * Woche darauf nicht dabei.
 */
export function bestePerioden(
  punkte: readonly Kurspunkt[],
  anzahl: number
): { beste: Periode[]; schlechteste: Periode[] } {
  const reihe = perioden(punkte)
  return {
    beste: [...reihe].sort((a, b) => b.rendite - a.rendite).slice(0, anzahl),
    schlechteste: [...reihe].sort((a, b) => a.rendite - b.rendite).slice(0, anzahl),
  }
}

/**
 * Wie oft eine Timing-Strategie richtig liegen muss, um Kosten zu decken.
 *
 * Vereinfachtes Modell: Jede Entscheidung kostet `kostenProRunde` Prozent
 * (Spread, Gebühren, Steuer auf realisierte Gewinne). Ein Treffer bringt
 * `gewinnProTreffer`, ein Fehlschlag kostet dasselbe. Gesucht ist die
 * Trefferquote, bei der das Ergebnis gerade null ist.
 *
 * Die Formel ist bewusst grob. Ihr Zweck ist zu zeigen, dass die Schwelle
 * deutlich über fünfzig Prozent liegt – und zwar allein wegen der Kosten,
 * bevor überhaupt über Prognosefähigkeit gesprochen wird.
 */
export function noetigeTrefferquote(
  gewinnProTreffer: number,
  kostenProRunde: number
): number | null {
  if (gewinnProTreffer <= 0) return null
  const quote = (gewinnProTreffer + kostenProRunde) / (2 * gewinnProTreffer)
  return quote > 1 ? null : quote * 100
}
