import { Beschriftung, FigureSvg } from '@/components/content/figures/Rahmen'
import { linienpfad, skaliereX, skaliereY } from '@/lib/figure-geometry'

/**
 * Die Grafiken zum Lernthema Rohstoffe.
 *
 * Beide zeigen keinen Kurs, sondern eine Mechanik: den fehlenden laufenden
 * Ertrag und die Form der Terminkurve. Die Werte der Kurven sind Beispielwerte
 * und bewusst rund – eine echte Terminkurve wäre unruhiger und würde von dem
 * ablenken, worauf es ankommt: ob sie steigt oder fällt.
 */

const markenfarbe = 'var(--c-brand)'
const rasterfarbe = 'var(--c-border)'

// ------------------------------------------------- Kein laufender Ertrag

const anlagen = [
  { name: 'Aktie', ertrag: 'Dividende', zahlt: true },
  { name: 'Anleihe', ertrag: 'Zinsen', zahlt: true },
  { name: 'Vermietete Wohnung', ertrag: 'Miete', zahlt: true },
  { name: 'Rohstoff', ertrag: 'nichts', zahlt: false },
]

export function RohstoffeKeinErtrag() {
  const zeilenhoehe = 46
  const oben = 30
  const kastenbreite = 210
  const pfeilVon = kastenbreite + 16
  const pfeilBis = pfeilVon + 84

  return (
    <FigureSvg id="rohstoffe-kein-ertrag" viewBox="0 0 640 216">
      {anlagen.map((anlage, index) => {
        const y = oben + index * zeilenhoehe
        const mitte = y + 18
        const farbe = anlage.zahlt ? markenfarbe : 'var(--c-danger)'
        return (
          <g key={anlage.name}>
            <rect
              x={0}
              y={y}
              width={kastenbreite}
              height={36}
              rx={6}
              fill="var(--c-surface)"
              stroke={rasterfarbe}
              strokeWidth={1}
            />
            <Beschriftung x={16} y={mitte + 5} ton="stark" gewicht="kraeftig">
              {anlage.name}
            </Beschriftung>

            <line
              x1={pfeilVon}
              y1={mitte}
              x2={pfeilBis - 8}
              y2={mitte}
              stroke={farbe}
              strokeWidth={2}
              // Gestrichelt, wo nichts fließt: Der Pfeil zeigt hin, aber es
              // kommt nichts an.
              strokeDasharray={anlage.zahlt ? undefined : '5 5'}
            />
            <path d={`M${pfeilBis} ${mitte} l-9 -5 v10 Z`} fill={farbe} />

            <Beschriftung
              x={pfeilBis + 14}
              y={mitte + 5}
              ton={anlage.zahlt ? 'marke' : 'gefahr'}
              gewicht="kraeftig"
              groesse={14}
            >
              {anlage.ertrag}
            </Beschriftung>
          </g>
        )
      })}
    </FigureSvg>
  )
}

// ------------------------------------------------ Contango und Backwardation

const terminkurven = [
  {
    titel: 'Contango',
    werte: [100, 102, 103.5, 104.5, 105],
    folge: ['Nachkaufen wird jedes Mal teurer', '→ Rollverlust'],
    ton: 'gefahr' as const,
    farbe: 'var(--c-danger)',
  },
  {
    titel: 'Backwardation',
    werte: [100, 98, 96.5, 95.5, 95],
    folge: ['Nachkaufen wird jedes Mal billiger', '→ Rollgewinn'],
    ton: 'marke' as const,
    farbe: markenfarbe,
  },
]

const liefermonate = ['jetzt', '+1 M', '+2 M', '+3 M', '+4 M']

export function RohstoffeRollkurve() {
  const panelbreite = 286
  const luecke = 68

  return (
    <FigureSvg id="rohstoffe-rollkurve" viewBox="0 0 640 264">
      {terminkurven.map((kurve, panel) => {
        const links = panel * (panelbreite + luecke)
        const flaeche = {
          links: links + 16,
          oben: 56,
          breite: panelbreite - 32,
          hoehe: 118,
        }
        const punkte = kurve.werte.map((wert, index) => ({
          x: skaliereX(index, 0, kurve.werte.length - 1, flaeche),
          y: skaliereY(wert, 92, 108, flaeche),
        }))

        return (
          <g key={kurve.titel}>
            <Beschriftung x={links} y={22} ton="stark" gewicht="kraeftig" groesse={15}>
              {kurve.titel}
            </Beschriftung>
            <Beschriftung x={links} y={40} ton="leise" groesse={12}>
              Preis je Liefermonat
            </Beschriftung>

            <line
              x1={flaeche.links - 8}
              y1={flaeche.oben + flaeche.hoehe}
              x2={flaeche.links + flaeche.breite + 8}
              y2={flaeche.oben + flaeche.hoehe}
              stroke={rasterfarbe}
              strokeWidth={1}
            />

            <path
              d={linienpfad(punkte)}
              fill="none"
              stroke={kurve.farbe}
              strokeWidth={2.5}
            />
            {punkte.map((punkt, index) => (
              <circle key={index} cx={punkt.x} cy={punkt.y} r={4} fill={kurve.farbe} />
            ))}

            {liefermonate.map((monat, index) => (
              <Beschriftung
                key={monat}
                x={punkte[index].x}
                y={flaeche.oben + flaeche.hoehe + 20}
                anchor="middle"
                ton="leise"
                groesse={12}
              >
                {monat}
              </Beschriftung>
            ))}

            {kurve.folge.map((zeile, index) => (
              <Beschriftung
                key={zeile}
                x={links}
                y={224 + index * 20}
                ton={kurve.ton}
                gewicht="kraeftig"
                groesse={13}
              >
                {zeile}
              </Beschriftung>
            ))}
          </g>
        )
      })}
    </FigureSvg>
  )
}
