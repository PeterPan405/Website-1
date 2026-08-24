import { Beschriftung, FigureSvg, Legende } from '@/components/content/figures/Rahmen'
import {
  flaechenpfad,
  linienpfad,
  skaliereX,
  skaliereY,
  teilstriche,
  type Plotflaeche,
} from '@/lib/figure-geometry'
import { inflationsbeispiel, kaufkraftreihe } from '@/lib/inflations-beispiele'
import { formatCurrencyRounded, formatNumber } from '@/lib/format'

/**
 * Die Grafiken zum Lernthema Inflation.
 *
 * Alle Zahlen kommen aus `lib/inflations-beispiele.ts` – denselben Funktionen,
 * aus denen die Tabelle im Text daneben entsteht. Keine Zahl steht hier als
 * Literal.
 */

const markenfarbe = 'var(--c-brand)'
const akzentfarbe = 'var(--c-accent)'
const rasterfarbe = 'var(--c-border)'

// ------------------------------------------------- Kaufkraft über 30 Jahre

/**
 * Was aus einem festen Betrag wird, wenn er unverzinst liegen bleibt.
 *
 * Zwei Linien, weil die eine ohne die andere zu Missverständnissen einlädt:
 * Die waagerechte zeigt, dass die Zahl auf dem Konto sich nie ändert – genau
 * das ist der Grund, warum der Verlust niemandem auffällt. Die fallende zeigt,
 * was diese unveränderte Zahl noch kaufen kann.
 */
export function InflationKaufkraft() {
  const flaeche: Plotflaeche = { links: 74, oben: 22, breite: 508, hoehe: 188 }
  const unten = flaeche.oben + flaeche.hoehe
  const rechts = flaeche.links + flaeche.breite

  const reihe = kaufkraftreihe()
  const striche = teilstriche(inflationsbeispiel.betrag, 4)
  const achsenmaximum = striche[striche.length - 1]

  const punkt = (jahr: number, wert: number) => ({
    x: skaliereX(jahr, 0, inflationsbeispiel.jahre, flaeche),
    y: skaliereY(wert, 0, achsenmaximum, flaeche),
  })

  const kaufkraft = reihe.map((p) => punkt(p.jahr, p.kaufkraft))
  const nominal = [
    punkt(0, inflationsbeispiel.betrag),
    punkt(inflationsbeispiel.jahre, inflationsbeispiel.betrag),
  ]
  const ende = reihe[reihe.length - 1]

  return (
    <FigureSvg id="inflation-kaufkraft" viewBox="0 0 640 280">
      <Beschriftung x={flaeche.links - 2} y={13} ton="leise" groesse={12}>
        Euro
      </Beschriftung>

      {striche.map((wert) => {
        const y = skaliereY(wert, 0, achsenmaximum, flaeche)
        return (
          <g key={wert}>
            <line
              x1={flaeche.links}
              y1={y}
              x2={rechts}
              y2={y}
              stroke={rasterfarbe}
              strokeWidth={1}
            />
            <Beschriftung x={flaeche.links - 10} y={y + 4} anchor="end" ton="leise">
              {formatNumber(wert)}
            </Beschriftung>
          </g>
        )
      })}

      {[0, 10, 20, 30].map((jahr) => (
        <Beschriftung
          key={jahr}
          x={skaliereX(jahr, 0, inflationsbeispiel.jahre, flaeche)}
          y={unten + 20}
          anchor="middle"
          ton="leise"
        >
          {jahr === inflationsbeispiel.jahre ? `${jahr} Jahre` : String(jahr)}
        </Beschriftung>
      ))}

      {/*
        Die Fläche zwischen beiden Linien ist der Verlust.

        Sie zu füllen ist der eigentliche Zweck dieser Grafik: Der Abstand
        zwischen „steht auf dem Konto“ und „ist es noch wert“ wächst jedes
        Jahr, und als Fläche sieht man das in einem Blick.
      */}
      <path
        d={`${flaechenpfad(kaufkraft, unten)}`}
        fill={markenfarbe}
        fillOpacity={0.12}
      />
      <path
        d={linienpfad(nominal)}
        fill="none"
        stroke={akzentfarbe}
        strokeWidth={2}
        strokeDasharray="6 4"
      />
      <path
        d={linienpfad(kaufkraft)}
        fill="none"
        stroke={markenfarbe}
        strokeWidth={2.5}
      />

      <Beschriftung
        x={rechts - 6}
        y={skaliereY(ende.kaufkraft, 0, achsenmaximum, flaeche) + 20}
        anchor="end"
        gewicht="kraeftig"
      >
        {formatCurrencyRounded(ende.kaufkraft)}
      </Beschriftung>

      <Legende
        x={flaeche.links}
        y={unten + 46}
        eintraege={[
          { farbe: akzentfarbe, text: 'Zahl auf dem Konto' },
          { farbe: markenfarbe, text: 'Was sie noch kaufen kann' },
        ]}
      />
    </FigureSvg>
  )
}
