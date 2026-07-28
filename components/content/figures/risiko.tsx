import { BalkenDiagramm, FARBEN } from '@/components/content/figures/Diagramme'
import { recoveryGainPercent } from '@/lib/finance'
import { formatPercent } from '@/lib/format'
import { risikoRueckgaenge } from '@/lib/lernszenarien'

/**
 * Warum ein Verlust mehr kostet, als er aussieht.
 *
 * Dieselbe Rechnung wie die Tabelle darüber, aus derselben Funktion
 * (`recoveryGainPercent` in `lib/finance.ts`) und über dieselben Stufen
 * (`lib/lernszenarien.ts`). Was die Grafik hinzufügt, ist die Länge: In der
 * Tabelle steht bei 90 Prozent Verlust die Zahl 900, in der Grafik ist der
 * Balken neunmal so lang wie der bei 50 Prozent. Das ist der Punkt, um den es
 * geht, und er lässt sich nicht lesen, sondern nur sehen.
 */

/** Ab hier liegt der nötige Gewinn in einer anderen Größenordnung als der Verlust. */
const SCHWELLE = 50

export function RisikoErholung() {
  const stufen = risikoRueckgaenge.map((verlust) => ({
    verlust,
    gewinn: recoveryGainPercent(verlust) ?? 0,
  }))

  return (
    <BalkenDiagramm
      id="risiko-erholung"
      balken={stufen.map(({ verlust, gewinn }) => ({
        label: `− ${formatPercent(verlust, 0)}`,
        wert: gewinn,
        wertText: `+ ${formatPercent(gewinn, 0)} nötig`,
        /*
          Ab der Hälfte wird die Farbe zur Warnung.

          Genau dort kippt die Sache: Bis dahin liegt der nötige Gewinn in
          derselben Größenordnung wie der Verlust, danach in einer anderen.
          Eine durchgehend gleichfarbige Reihe würde das verschweigen.
        */
        farbe: verlust >= SCHWELLE ? FARBEN.gefahr : FARBEN.marke,
      }))}
      labelBreite={92}
      beschreibung={
        'Wie viel Gewinn nötig ist, um einen Verlust wieder auszugleichen: ' +
        stufen
          .map(
            ({ verlust, gewinn }) =>
              `${formatPercent(verlust, 0)} Verlust brauchen ${formatPercent(gewinn, 0)} Gewinn`
          )
          .join(', ') +
        '. Bis zu einem Fünftel sind beide Zahlen fast gleich groß, ab der Hälfte laufen sie ' +
        'auseinander: Wer neunzig Prozent verliert, braucht eine Verzehnfachung, nur um wieder bei ' +
        'null zu sein.'
      }
    />
  )
}
