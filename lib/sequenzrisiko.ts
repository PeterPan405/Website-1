/**
 * Warum die Reihenfolge der Renditejahre über das Ergebnis entscheidet.
 *
 * ## Was hier gerechnet wird
 *
 * Zwei Depots starten mit demselben Betrag, erleben dieselben Jahresrenditen
 * und entnehmen jedes Jahr denselben Betrag. Der einzige Unterschied ist die
 * **Reihenfolge**: einmal die schlechten Jahre zuerst, einmal zuletzt.
 *
 * Ohne Entnahme ist das Ergebnis identisch – Multiplikation ist kommutativ,
 * und daran ändert keine Umsortierung etwas. Mit Entnahme nicht mehr: Wer im
 * Rückgangsjahr Anteile verkaufen muss, verkauft sie billig, und diese Anteile
 * fehlen bei der späteren Erholung dauerhaft.
 *
 * ## Warum als eigenes Modul
 *
 * Der Lerntext behauptet diesen Zusammenhang bisher, ohne ihn vorzurechnen.
 * Das ist genau die Sorte Aussage, die eine Zahl braucht: Sie klingt
 * einleuchtend, und wie groß der Unterschied wird, ahnt niemand. Ohne Importe,
 * damit sich die Rechnung unter `tests/` direkt prüfen lässt – dieselbe
 * Aufteilung wie bei `lib/timing.ts` und `lib/kredit.ts`.
 */

export interface Verlauf {
  jahr: number
  /** Depotwert am Ende des Jahres, nach Rendite und Entnahme. */
  wert: number
  /** Die Rendite dieses Jahres in Prozent. */
  rendite: number
}

export interface Sequenzergebnis {
  verlauf: Verlauf[]
  /** Was am Ende übrig ist – null, wenn das Depot vorher aufgebraucht war. */
  endwert: number
  /** In welchem Jahr das Geld ausging, sonst `null`. */
  erschoepftImJahr: number | null
  /** Summe aller tatsächlich entnommenen Beträge. */
  entnommen: number
}

/**
 * Ein Depot über die gegebenen Jahresrenditen, mit fester Jahresentnahme.
 *
 * Reihenfolge im Jahr: erst die Rendite, dann die Entnahme. Das entspricht
 * einer Entnahme am **Jahresende** und ist damit die **freundlichere** der
 * beiden üblichen Konventionen: Bei einer Entnahme am Jahresanfang fällt das
 * Ergebnis in jedem Fall schlechter aus, weil der entnommene Betrag ein Jahr
 * weniger arbeitet.
 *
 * Hier stand bis zum 17. August 2026 „die vorsichtigere“ – dieselbe
 * Begründung, das umgekehrte Etikett. Wer sich auf das Wort verlassen und die
 * Begründung überlesen hätte, hätte ein Ergebnis für konservativ gehalten, das
 * es nicht ist. `lib/entnahme.ts` benutzt dieselbe Reihenfolge und nennt den
 * Preis dafür bei seinen Grenzen.
 *
 * Ist das Depot leer, wird nur noch entnommen, was da ist; danach bleibt es
 * bei null. Ein negativer Depotwert wäre eine Rechnung ohne Bezug zur
 * Wirklichkeit.
 */
export function entnahmeverlauf(
  startkapital: number,
  renditen: readonly number[],
  entnahmeProJahr: number
): Sequenzergebnis {
  const verlauf: Verlauf[] = []
  let wert = startkapital
  let entnommen = 0
  let erschoepftImJahr: number | null = null

  for (const [index, rendite] of renditen.entries()) {
    wert *= 1 + rendite / 100
    const entnahme = Math.min(entnahmeProJahr, Math.max(wert, 0))
    wert -= entnahme
    entnommen += entnahme

    if (wert <= 0 && erschoepftImJahr === null) {
      wert = 0
      erschoepftImJahr = index + 1
    }

    verlauf.push({ jahr: index + 1, wert, rendite })
  }

  return { verlauf, endwert: wert, erschoepftImJahr, entnommen }
}

/**
 * Der geometrische Mittelwert einer Renditereihe, in Prozent.
 *
 * Nicht der arithmetische: Über mehrere Jahre zählt, was sich verkettet
 * ergibt. Eine Reihe aus plus 50 und minus 50 Prozent hat arithmetisch den
 * Mittelwert null und geometrisch rund minus 13,4 Prozent – und nur die zweite
 * Zahl beschreibt, was am Ende im Depot liegt.
 */
export function mittlereRendite(renditen: readonly number[]): number {
  if (renditen.length === 0) return 0
  const faktor = renditen.reduce((produkt, r) => produkt * (1 + r / 100), 1)
  if (faktor <= 0) return -100
  return (faktor ** (1 / renditen.length) - 1) * 100
}

/**
 * Dieselben Renditen in beiden Richtungen, mit Entnahme.
 *
 * Zurück kommen beide Verläufe und der Unterschied. Genau darum geht es: Die
 * mittlere Rendite ist in beiden Fällen dieselbe Zahl, das Ergebnis nicht.
 */
export function reihenfolgevergleich(
  startkapital: number,
  renditen: readonly number[],
  entnahmeProJahr: number
): {
  schlechtZuerst: Sequenzergebnis
  gutZuerst: Sequenzergebnis
  mittlereRenditeProzent: number
  unterschied: number
} {
  const aufsteigend = [...renditen].sort((a, b) => a - b)
  const absteigend = [...aufsteigend].reverse()

  const schlechtZuerst = entnahmeverlauf(startkapital, aufsteigend, entnahmeProJahr)
  const gutZuerst = entnahmeverlauf(startkapital, absteigend, entnahmeProJahr)

  return {
    schlechtZuerst,
    gutZuerst,
    mittlereRenditeProzent: mittlereRendite(renditen),
    unterschied: gutZuerst.endwert - schlechtZuerst.endwert,
  }
}
