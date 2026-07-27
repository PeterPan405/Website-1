import { Beschriftung, FigureSvg } from '@/components/content/figures/Rahmen'
import { indexZusammensetzung } from '@/data/index-zusammensetzung'
import { formatPercent } from '@/lib/format'

/**
 * Ländergewichtung eines Index als Balken.
 *
 * Bewusst waagerechte Balken und kein Tortendiagramm. Bei einem Anteil von über
 * siebzig Prozent zeigt eine Torte vor allem, dass ein Stück fast alles ist –
 * die kleinen Anteile daneben lassen sich weder ablesen noch beschriften.
 * Balken haben eine gemeinsame Grundlinie, und genau der Vergleich ist hier die
 * Aussage.
 */
export function IndexLaendergewichtung({ symbol = 'msci-world' }: { symbol?: string }) {
  const satz = indexZusammensetzung[symbol]
  /*
    Werfen statt still nichts zeichnen.

    Die Grafik wird beim Bauen erzeugt. Ein fehlender Datensatz fiele sonst erst
    dem Besucher auf – als leerer Kasten mit Bildunterschrift.
  */
  if (!satz) throw new Error(`Keine Ländergewichtung für ${symbol} hinterlegt.`)
  const groesster = Math.max(...satz.laender.map((land) => land.anteil))

  const beschriftungsbreite = 168
  const balkenStart = beschriftungsbreite + 12
  const balkenBreite = 372
  const balkenHoehe = 26
  const abstand = 12
  const oben = 16

  const hoehe = oben + satz.laender.length * (balkenHoehe + abstand) + 4

  /*
    Die Vorlesefassung entsteht aus denselben Daten wie die Balken.

    Sonst wäre sie nach der ersten Aktualisierung der Gewichtung falsch – und
    zwar unbemerkt, weil sie nur hört, wer die Grafik nicht sieht.
  */
  const beschreibung = `Ländergewichtung zum ${satz.stand}: ${satz.laender
    .map((land) => `${land.land} ${formatPercent(land.anteil, 2)}`)
    .join(', ')}.`

  return (
    <FigureSvg
      id="msci-world-laender"
      viewBox={`0 0 640 ${hoehe}`}
      beschreibung={beschreibung}
    >
      {satz.laender.map((land, index) => {
        const y = oben + index * (balkenHoehe + abstand)
        return (
          <g key={land.land}>
            <Beschriftung
              x={beschriftungsbreite}
              y={y + balkenHoehe / 2 + 5}
              anchor="end"
              ton={land.sammelposten ? 'gedaempft' : 'stark'}
              gewicht={land.sammelposten ? 'normal' : 'kraeftig'}
            >
              {land.land}
            </Beschriftung>
            <rect
              x={balkenStart}
              y={y}
              width={(land.anteil / groesster) * balkenBreite}
              height={balkenHoehe}
              rx={4}
              // Die Sammelposition ist keine gleichrangige Größe wie ein Land,
              // sondern ein Rest. Sie steht deshalb zurückgenommen da.
              fill={land.sammelposten ? 'var(--c-border-strong)' : 'var(--c-brand)'}
            />
            <Beschriftung
              x={balkenStart + (land.anteil / groesster) * balkenBreite + 10}
              y={y + balkenHoehe / 2 + 5}
              ton="stark"
              gewicht="kraeftig"
            >
              {formatPercent(land.anteil, 2)}
            </Beschriftung>
          </g>
        )
      })}
    </FigureSvg>
  )
}
