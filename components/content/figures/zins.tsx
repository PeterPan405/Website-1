import { Beschriftung, FigureSvg, Legende } from '@/components/content/figures/Rahmen'
import {
  linienpfad,
  skaliereX,
  skaliereY,
  teilstriche,
  type Plotflaeche,
} from '@/lib/figure-geometry'
import { formatCurrencyRounded, formatNumber, formatPercent } from '@/lib/format'
import {
  grundbeispiel,
  grundbeispielReihe,
  kostenbeispiel,
  kostenbeispielBrutto,
  kostenbeispielReihe,
  sparbeispiel,
  sparbeispielReihe,
} from '@/lib/zins-beispiele'

/**
 * Die Grafiken zum Lernthema Zinseszins.
 *
 * Alle Zahlen kommen aus `lib/zins-beispiele.ts` – denselben Funktionen, aus
 * denen auch die Tabellen im Text daneben entstehen. Keine Zahl steht in
 * dieser Datei als Literal, mit einer Ausnahme: das Beispiel zur
 * Volatilitätsbremse rechnet mit glatten 100 Euro und ±50 Prozent, weil genau
 * diese Zahlen im Text stehen und die Rechnung im Kopf nachvollziehbar sein
 * soll.
 */

const markenfarbe = 'var(--c-brand)'
const akzentfarbe = 'var(--c-accent)'
const rasterfarbe = 'var(--c-border)'

// ------------------------------------------- Einfacher Zins gegen Zinseszins

export function ZinsGeradeVsKurve() {
  /*
    Die Zeichenfläche endet vor dem rechten Rand.

    Der letzte Teilstrich trägt die Einheit („40 Jahre“) und steht mittig unter
    seinem Punkt. Reichte die Fläche bis zur Kante der viewBox, ragte die
    Beschriftung zur Hälfte hinaus – SVG schneidet dort ab, statt umzubrechen.
  */
  const flaeche: Plotflaeche = { links: 66, oben: 22, breite: 518, hoehe: 188 }
  const unten = flaeche.oben + flaeche.hoehe
  const rechts = flaeche.links + flaeche.breite

  const reihe = grundbeispielReihe()
  const striche = teilstriche(reihe[reihe.length - 1].zinseszins, 4)
  const achsenmaximum = striche[striche.length - 1]

  const punkt = (jahr: number, wert: number) => ({
    x: skaliereX(jahr, 0, grundbeispiel.maxJahre, flaeche),
    y: skaliereY(wert, 0, achsenmaximum, flaeche),
  })

  const kurve = reihe.map((p) => punkt(p.jahr, p.zinseszins))
  const gerade = reihe.map((p) => punkt(p.jahr, p.einfach))
  const ende = reihe[reihe.length - 1]

  return (
    <FigureSvg id="zins-gerade-vs-kurve" viewBox="0 0 640 280">
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

      {[0, 10, 20, 30, 40].map((jahr) => (
        <Beschriftung
          key={jahr}
          x={skaliereX(jahr, 0, grundbeispiel.maxJahre, flaeche)}
          y={unten + 20}
          anchor="middle"
          ton="leise"
        >
          {jahr === 40 ? '40 Jahre' : jahr}
        </Beschriftung>
      ))}

      <path d={linienpfad(gerade)} fill="none" stroke={akzentfarbe} strokeWidth={2} />
      <path
        d={linienpfad(kurve)}
        fill="none"
        stroke={markenfarbe}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />

      {/* Der Endpunkt bekommt einen Punkt und seine Zahl – ohne beides muss man
          die Kurve gegen die Achse ablesen, und genau darum geht es hier nicht. */}
      <circle cx={rechts} cy={punkt(40, ende.zinseszins).y} r={4} fill={markenfarbe} />
      <circle cx={rechts} cy={punkt(40, ende.einfach).y} r={4} fill={akzentfarbe} />
      <Beschriftung
        x={rechts - 6}
        y={punkt(40, ende.zinseszins).y - 12}
        anchor="end"
        ton="marke"
        gewicht="kraeftig"
      >
        {formatCurrencyRounded(ende.zinseszins)}
      </Beschriftung>
      <Beschriftung
        x={rechts - 6}
        y={punkt(40, ende.einfach).y - 12}
        anchor="end"
        ton="akzent"
        gewicht="kraeftig"
      >
        {formatCurrencyRounded(ende.einfach)}
      </Beschriftung>

      <Legende
        x={flaeche.links}
        y={266}
        eintraege={[
          { farbe: markenfarbe, text: 'Zinseszins – Erträge bleiben liegen' },
          { farbe: akzentfarbe, text: 'Einfacher Zins' },
        ]}
      />
    </FigureSvg>
  )
}

// ------------------------------------------------------ Startalter gegen Rate

export function ZinsFruehVsSpaet() {
  const faelle = sparbeispielReihe()
  const maximum = Math.max(...faelle.map((fall) => fall.endkapital))

  const beschriftungsbreite = 108
  const balkenStart = beschriftungsbreite + 12
  const balkenBreite = 400
  const balkenHoehe = 34
  const abstand = 22
  const oben = 46

  return (
    <FigureSvg id="zins-frueh-vs-spaet" viewBox="0 0 640 250">
      <Legende
        x={6}
        y={18}
        eintraege={[
          { farbe: markenfarbe, text: 'eingezahlt' },
          { farbe: akzentfarbe, text: 'Erträge' },
        ]}
      />

      {faelle.map((fall, index) => {
        const y = oben + index * (balkenHoehe + abstand)
        const gesamt = (fall.endkapital / maximum) * balkenBreite
        const anteilEinzahlung = (fall.eingezahlt / maximum) * balkenBreite
        return (
          <g key={fall.startalter}>
            <Beschriftung
              x={beschriftungsbreite}
              y={y + 16}
              anchor="end"
              ton="stark"
              gewicht="kraeftig"
            >
              Start mit {fall.startalter}
            </Beschriftung>
            <Beschriftung x={beschriftungsbreite} y={y + 32} anchor="end" ton="leise">
              {fall.jahre} Jahre
            </Beschriftung>

            <rect
              x={balkenStart}
              y={y}
              width={gesamt}
              height={balkenHoehe}
              rx={4}
              fill={akzentfarbe}
            />
            <rect
              x={balkenStart}
              y={y}
              width={anteilEinzahlung}
              height={balkenHoehe}
              rx={4}
              fill={markenfarbe}
            />
            <Beschriftung
              x={balkenStart + gesamt + 10}
              y={y + balkenHoehe / 2 + 5}
              ton="stark"
              gewicht="kraeftig"
            >
              {formatCurrencyRounded(fall.endkapital)}
            </Beschriftung>
          </g>
        )
      })}

      <Beschriftung x={6} y={238} ton="leise" groesse={12}>
        {formatCurrencyRounded(sparbeispiel.rate)} monatlich bei{' '}
        {formatPercent(sparbeispiel.zinssatz, 0)} bis zum {sparbeispiel.endalter}.
        Lebensjahr
      </Beschriftung>
    </FigureSvg>
  )
}

// ------------------------------------------------------- Wirkung der Kosten

export function ZinsKosten() {
  const faelle = kostenbeispielReihe()
  const brutto = kostenbeispielBrutto()

  const beschriftungsbreite = 96
  const balkenStart = beschriftungsbreite + 12
  const balkenBreite = 392
  const balkenHoehe = 30
  const abstand = 16
  const oben = 44

  return (
    <FigureSvg id="zins-kosten" viewBox="0 0 640 250">
      <Legende
        x={6}
        y={18}
        eintraege={[
          { farbe: markenfarbe, text: 'Endkapital' },
          { farbe: rasterfarbe, text: 'von den Kosten aufgezehrt' },
        ]}
      />

      {faelle.map((fall, index) => {
        const y = oben + index * (balkenHoehe + abstand)
        const erreicht = (fall.endkapital / brutto) * balkenBreite
        return (
          <g key={fall.quote}>
            <Beschriftung
              x={beschriftungsbreite}
              y={y + balkenHoehe / 2 + 5}
              anchor="end"
              ton="stark"
              gewicht="kraeftig"
            >
              {formatPercent(fall.quote, 2)}
            </Beschriftung>

            {/* Der volle Balken ist das Ergebnis ganz ohne Kosten. Was fehlt,
                ist damit sichtbar, ohne dass man zwei Zahlen abziehen muss. */}
            <rect
              x={balkenStart}
              y={y}
              width={balkenBreite}
              height={balkenHoehe}
              rx={4}
              fill={rasterfarbe}
            />
            <rect
              x={balkenStart}
              y={y}
              width={erreicht}
              height={balkenHoehe}
              rx={4}
              fill={markenfarbe}
            />
            <Beschriftung
              x={balkenStart + balkenBreite + 10}
              y={y + balkenHoehe / 2 + 5}
              ton="stark"
              gewicht="kraeftig"
            >
              {formatCurrencyRounded(fall.endkapital)}
            </Beschriftung>
          </g>
        )
      })}

      <Beschriftung x={6} y={236} ton="leise" groesse={12}>
        {formatCurrencyRounded(kostenbeispiel.rate)} monatlich über {kostenbeispiel.jahre}{' '}
        Jahre bei {formatPercent(kostenbeispiel.bruttoRendite, 0)} Bruttorendite – ohne
        Kosten wären es {formatCurrencyRounded(brutto)}
      </Beschriftung>
    </FigureSvg>
  )
}

// ------------------------------------------------------ Volatilitätsbremse

/*
  Die einzigen Literale unter den Zinsgrafiken.

  Start 100, plus 50 Prozent, minus 50 Prozent – dieselben Zahlen wie im Text.
  Sie aus einer Funktion zu holen, würde die Rechnung verstecken, die hier
  gerade sichtbar sein soll.
*/
const volaVerlauf = [
  { beschriftung: 'Start', wert: 100 },
  { beschriftung: 'nach Jahr 1', wert: 150, schritt: '+50 %' },
  { beschriftung: 'nach Jahr 2', wert: 75, schritt: '−50 %' },
]

export function ZinsVolatilitaetsbremse() {
  const balkenBreite = 96
  const abstand = 84
  const start = 96
  const grundlinie = 190
  const maximum = 160
  const hoehe = (wert: number) => (wert / maximum) * 150

  return (
    <FigureSvg id="zins-volatilitaetsbremse" viewBox="0 0 640 250">
      {/* Die Startlinie zieht sich durch: Ohne sie sieht der letzte Balken nach
          einem Ergebnis aus, nicht nach einem Verlust. */}
      <line
        x1={start}
        y1={grundlinie - hoehe(100)}
        x2={600}
        y2={grundlinie - hoehe(100)}
        stroke="var(--c-fg-subtle)"
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <Beschriftung x={600} y={grundlinie - hoehe(100) - 8} anchor="end" ton="leise">
        Ausgangswert 100 €
      </Beschriftung>

      {volaVerlauf.map((stufe, index) => {
        const x = start + index * (balkenBreite + abstand)
        const y = grundlinie - hoehe(stufe.wert)
        const negativ = stufe.wert < 100
        return (
          <g key={stufe.beschriftung}>
            <rect
              x={x}
              y={y}
              width={balkenBreite}
              height={hoehe(stufe.wert)}
              rx={4}
              fill={negativ ? 'var(--c-danger)' : markenfarbe}
            />
            <Beschriftung
              x={x + balkenBreite / 2}
              y={y - 10}
              anchor="middle"
              ton={negativ ? 'gefahr' : 'stark'}
              gewicht="kraeftig"
              groesse={15}
            >
              {formatCurrencyRounded(stufe.wert)}
            </Beschriftung>
            <Beschriftung
              x={x + balkenBreite / 2}
              y={grundlinie + 20}
              anchor="middle"
              ton="leise"
            >
              {stufe.beschriftung}
            </Beschriftung>

            {stufe.schritt && (
              <Beschriftung
                x={x - abstand / 2}
                y={grundlinie - 60}
                anchor="middle"
                ton="gedaempft"
                gewicht="kraeftig"
              >
                {stufe.schritt}
              </Beschriftung>
            )}
          </g>
        )
      })}

      <line
        x1={start}
        y1={grundlinie}
        x2={600}
        y2={grundlinie}
        stroke={rasterfarbe}
        strokeWidth={1}
      />
      <Beschriftung x={6} y={236} ton="gedaempft" groesse={13}>
        Durchschnitt der beiden Jahre: 0 Prozent. Tatsächliches Ergebnis: ein Viertel
        weniger.
      </Beschriftung>
    </FigureSvg>
  )
}
