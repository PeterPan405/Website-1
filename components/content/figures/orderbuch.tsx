import { FARBEN } from '@/components/content/figures/Diagramme'
import { Beschriftung, FigureSvg, Legende } from '@/components/content/figures/Rahmen'
import { formatNumber } from '@/lib/format'
import { orderbuchBeispiel, orderbuchMarktauftrag } from '@/lib/lernszenarien'

/**
 * Das Orderbuch als Leiter.
 *
 * ## Warum eine eigene Zeichnung und kein Balkendiagramm
 *
 * Ein Orderbuch hat zwei Achsen, und beide sind wichtig: der Preis, sortiert
 * von oben nach unten, und die Stückzahl je Preis. Ein gewöhnliches
 * Balkendiagramm könnte nur eine davon. Vor allem aber fehlte ihm die Mitte –
 * die Lücke zwischen der besten Kaufseite und der besten Verkaufsseite. Genau
 * diese Lücke ist der Spread, und sie ist das Einzige, was man an einem
 * Orderbuch sofort sehen muss.
 *
 * ## Die Zahlen
 *
 * Sie sind ein Beispiel, kein Marktausschnitt – ein echtes Orderbuch ändert
 * sich mehrmals pro Sekunde und wäre als gedruckte Momentaufnahme sinnlos.
 * Geld- und Briefkurs stimmen mit der Spread-Grafik im Thema Aktie überein
 * (`lib/lernszenarien.ts`), damit beide Themen dasselbe Papier beschreiben.
 */

const ZEILENHOEHE = 30
const MITTE = 318
const SPALTE = 200
const SPRUNG = 18

export function MarktOrderbuch() {
  const { brief, geld } = orderbuchBeispiel
  const hoehe = (brief.length + geld.length) * ZEILENHOEHE + SPRUNG + 74
  const oben = 46
  const groesste = Math.max(...[...brief, ...geld].map((lage) => lage.stueck))

  /** Wo eine Zeile senkrecht sitzt – die Verkaufsseite oben, die Kaufseite unten. */
  const zeileY = (index: number) =>
    oben + index * ZEILENHOEHE + (index >= brief.length ? SPRUNG : 0)

  const balkenbreite = (stueck: number) => (stueck / groesste) * SPALTE

  const bester = { brief: brief[brief.length - 1], geld: geld[0] }
  const spread = bester.brief.preis - bester.geld.preis

  return (
    <FigureSvg
      id="markt-orderbuch"
      viewBox={`0 0 640 ${hoehe}`}
      beschreibung={
        'Ein Orderbuch als Leiter, Preise von oben nach unten. Oben stehen die Verkaufsaufträge: ' +
        brief
          .map(
            (lage) =>
              `${formatNumber(lage.stueck, 0)} Stück zu ${formatNumber(lage.preis, 2)} Euro`
          )
          .join(', ') +
        '. Unten die Kaufaufträge: ' +
        geld
          .map(
            (lage) =>
              `${formatNumber(lage.stueck, 0)} Stück zu ${formatNumber(lage.preis, 2)} Euro`
          )
          .join(', ') +
        `. Zwischen dem besten Gebot von ${formatNumber(bester.geld.preis, 2)} und der besten Forderung von ` +
        `${formatNumber(bester.brief.preis, 2)} Euro liegt niemand – diese Lücke von ` +
        `${formatNumber(spread, 2)} Euro ist der Spread. Wer nur wenige Stücke kauft, bekommt sie zum besten ` +
        `Briefkurs. Wer ${formatNumber(orderbuchMarktauftrag, 0)} Stück sofort kauft, räumt mehrere Lagen ab ` +
        `und zahlt im Schnitt mehr – das ist die Slippage.`
      }
    >
      <Legende
        x={MITTE - SPALTE - 24}
        y={20}
        eintraege={[
          { farbe: FARBEN.gefahr, text: 'Verkaufsaufträge (Brief)' },
          { farbe: FARBEN.marke, text: 'Kaufaufträge (Geld)' },
        ]}
      />

      {/* -------------------------------------------------- Verkaufsseite */}
      {brief.map((lage, index) => {
        const y = zeileY(index)
        const breite = balkenbreite(lage.stueck)
        return (
          <g key={`brief-${lage.preis}`}>
            <rect
              x={MITTE + 26}
              y={y + 5}
              width={breite}
              height={ZEILENHOEHE - 12}
              rx={3}
              fill={FARBEN.gefahr}
              opacity={0.75}
            />
            <Beschriftung
              x={MITTE + 26 + breite + 8}
              y={y + 19}
              ton="gedaempft"
              groesse={12}
            >
              {formatNumber(lage.stueck, 0)}
            </Beschriftung>
            <Beschriftung
              x={MITTE}
              y={y + 19}
              anchor="middle"
              ton="stark"
              gewicht="kraeftig"
            >
              {formatNumber(lage.preis, 2)}
            </Beschriftung>
          </g>
        )
      })}

      {/* ------------------------------------------------------ Der Spread */}
      <g>
        <rect
          x={MITTE - SPALTE - 26}
          y={zeileY(brief.length) - SPRUNG + 1}
          width={SPALTE * 2 + 52}
          height={SPRUNG - 3}
          rx={3}
          fill="var(--c-bg-subtle)"
        />
        <Beschriftung
          x={MITTE}
          y={zeileY(brief.length) - SPRUNG + 12}
          anchor="middle"
          ton="leise"
          groesse={11}
        >
          {`Spread ${formatNumber(spread, 2)} € – hier liegt niemand`}
        </Beschriftung>
      </g>

      {/* ---------------------------------------------------- Kaufseite */}
      {geld.map((lage, index) => {
        const y = zeileY(brief.length + index)
        const breite = balkenbreite(lage.stueck)
        return (
          <g key={`geld-${lage.preis}`}>
            <rect
              x={MITTE - 26 - breite}
              y={y + 5}
              width={breite}
              height={ZEILENHOEHE - 12}
              rx={3}
              fill={FARBEN.marke}
              opacity={0.75}
            />
            <Beschriftung
              x={MITTE - 26 - breite - 8}
              y={y + 19}
              anchor="end"
              ton="gedaempft"
              groesse={12}
            >
              {formatNumber(lage.stueck, 0)}
            </Beschriftung>
            <Beschriftung
              x={MITTE}
              y={y + 19}
              anchor="middle"
              ton="stark"
              gewicht="kraeftig"
            >
              {formatNumber(lage.preis, 2)}
            </Beschriftung>
          </g>
        )
      })}

      <Beschriftung x={MITTE} y={hoehe - 34} anchor="middle" ton="leise" groesse={12}>
        Stückzahl je Preis · Preis in der Mitte
      </Beschriftung>
      <Beschriftung x={MITTE} y={hoehe - 14} anchor="middle" ton="gedaempft" groesse={12}>
        {`Ein Marktauftrag über ${formatNumber(orderbuchMarktauftrag, 0)} Stück räumt die oberen Lagen ab – zum Durchschnittspreis ${formatNumber(durchschnittspreis(), 2)} €`}
      </Beschriftung>
    </FigureSvg>
  )
}

/**
 * Was ein sofort ausgeführter Kaufauftrag im Schnitt kostet.
 *
 * Arbeitet sich von der besten Verkaufslage aus nach oben durch das Buch, bis
 * die gewünschte Stückzahl zusammen ist. Der Abstand zum besten Briefkurs ist
 * die Slippage – der Grund, warum „der Kurs“ für große Aufträge eine
 * Vereinfachung ist.
 */
function durchschnittspreis(): number {
  let offen = orderbuchMarktauftrag
  let kosten = 0

  // Von der besten Verkaufslage aus, also von unten nach oben durch die Liste.
  for (const lage of [...orderbuchBeispiel.brief].reverse()) {
    const menge = Math.min(offen, lage.stueck)
    kosten += menge * lage.preis
    offen -= menge
    if (offen <= 0) break
  }

  return kosten / (orderbuchMarktauftrag - Math.max(offen, 0))
}
