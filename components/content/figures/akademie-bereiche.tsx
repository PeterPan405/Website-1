import { Beschriftung, FigureSvg, Legende } from '@/components/content/figures/Rahmen'

/**
 * Die Grafiken der übrigen vier Akademie-Bereiche.
 *
 * ## Warum eine eigene Datei
 *
 * `akademie.tsx` deckt die technische Analyse ab und ist mit den elf
 * Elliott-Zeichnungen auf über 1500 Zeilen gewachsen. Portfoliotheorie,
 * Makroanalyse, Fundamentalanalyse und Anlegerverhalten kommen hier hinein –
 * nicht aus Ordnungsliebe, sondern weil eine Datei, in der man scrollen muss
 * um den Import zu finden, beim nächsten Zusatz falsch bearbeitet wird.
 *
 * ## Was diese Grafiken zeigen dürfen und was nicht
 *
 * Dieselbe Regel wie nebenan: Die Zahlen sind erfunden und sollen es sein. Eine
 * Effizienzlinie mit echten Renditen wäre eine Aussage über konkrete Anlagen,
 * die sich mit jedem Handelstag ändert; gemeint ist die Form. Wo eine Zahl
 * dagegen aus einem Datensatz stammt, gehört sie in eine Grafik unter `lib/` –
 * dort laufen Bild und Tabelle nicht auseinander.
 */

const MARKE = 'var(--c-brand)'
const AKZENT = 'var(--c-accent)'
const GEFAHR = 'var(--c-danger)'
const LEISE = 'var(--c-fg-subtle)'
const RASTER = 'var(--c-border)'
const BAND_DECKKRAFT = 0.09

function pfad(punkte: readonly [number, number][]): string {
  return punkte.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
}

/** Ein schlichtes Achsenkreuz mit Beschriftung. */
function Achsen({
  x0,
  y0,
  breite,
  hoehe,
  unten,
  links,
}: {
  x0: number
  y0: number
  breite: number
  hoehe: number
  unten: string
  links: string
}) {
  return (
    <g>
      <line x1={x0} y1={y0} x2={x0} y2={y0 - hoehe} stroke={RASTER} strokeWidth={1.5} />
      <line x1={x0} y1={y0} x2={x0 + breite} y2={y0} stroke={RASTER} strokeWidth={1.5} />
      <Beschriftung x={x0 + breite} y={y0 + 20} anchor="end" ton="leise" groesse={12}>
        {unten}
      </Beschriftung>
      <Beschriftung x={x0 - 6} y={y0 - hoehe - 8} anchor="start" ton="leise" groesse={12}>
        {links}
      </Beschriftung>
    </g>
  )
}

/* ------------------------------------------------------ Portfoliotheorie */

/** Wie das Risiko mit der Zahl der Titel fällt – und wo es aufhört zu fallen. */
export function PtDiversifikation() {
  const punkte: [number, number][] = [
    [70, 60],
    [96, 96],
    [124, 122],
    [158, 142],
    [200, 156],
    [252, 165],
    [316, 172],
    [392, 176],
    [470, 178],
    [560, 179],
  ]
  return (
    <FigureSvg id="pt-diversifikation" viewBox="0 0 640 260">
      <Achsen
        x0={60}
        y0={200}
        breite={520}
        hoehe={160}
        unten="Zahl der Titel im Depot"
        links="Schwankung"
      />

      {/* Marktrisiko – der Boden, unter den es nicht geht */}
      <line
        x1={60}
        y1={182}
        x2={580}
        y2={182}
        stroke={GEFAHR}
        strokeWidth={1.4}
        strokeDasharray="5 4"
      />
      <rect
        x={60}
        y={182}
        width={520}
        height={18}
        fill={GEFAHR}
        fillOpacity={BAND_DECKKRAFT}
      />
      <Beschriftung x={574} y={176} anchor="end" ton="gefahr" groesse={12}>
        Marktrisiko – bleibt übrig
      </Beschriftung>

      <path d={pfad(punkte)} fill="none" stroke={MARKE} strokeWidth={2.4} />

      <line
        x1={200}
        y1={156}
        x2={200}
        y2={200}
        stroke={LEISE}
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <Beschriftung x={206} y={132} groesse={12}>
        Ab etwa 20 bis 30 Titeln
      </Beschriftung>
      <Beschriftung x={206} y={148} groesse={12}>
        bringt jeder weitere kaum noch etwas.
      </Beschriftung>

      <Beschriftung x={70} y={48} ton="marke" groesse={12}>
        Einzelrisiko – lässt sich wegstreuen
      </Beschriftung>
    </FigureSvg>
  )
}

/**
 * Die Effizienzlinie: welche Kombinationen überhaupt sinnvoll sind.
 *
 * ## Warum B genau unter C liegt
 *
 * Die Aussage der Grafik ist „gleiches Risiko, weniger Rendite“. Im ersten
 * Entwurf lagen die beiden Punkte auf verschiedenen x-Werten – die
 * Beschriftung behauptete also etwas, das die Zeichnung widerlegte. Beide
 * teilen sich jetzt dieselbe senkrechte Linie, und die ist mitgezeichnet:
 * Der Vergleich muss sichtbar sein, nicht behauptet.
 */
export function PtEffizienzlinie() {
  const linie: [number, number][] = [
    [130, 168],
    [160, 132],
    [206, 104],
    [268, 84],
    [346, 68],
    [438, 58],
    [530, 50],
  ]
  const unten: [number, number][] = [
    [130, 168],
    [166, 192],
    [222, 208],
    [268, 214],
    [330, 218],
    [392, 220],
  ]
  return (
    <FigureSvg id="pt-effizienzlinie" viewBox="0 0 640 330">
      <Achsen
        x0={90}
        y0={236}
        breite={480}
        hoehe={200}
        unten="Risiko (Schwankung)"
        links="Erwartete Rendite"
      />

      <path
        d={`${pfad(linie)} L 392 220 L 330 218 L 268 214 L 222 208 L 166 192 Z`}
        fill={MARKE}
        fillOpacity={BAND_DECKKRAFT}
        stroke="none"
      />
      <path
        d={pfad(unten)}
        fill="none"
        stroke={LEISE}
        strokeWidth={1.4}
        strokeDasharray="4 4"
      />
      <path d={pfad(linie)} fill="none" stroke={MARKE} strokeWidth={2.6} />

      {/* Der Vergleich selbst: gleiches Risiko, zwei Renditen */}
      <line
        x1={268}
        y1={84}
        x2={268}
        y2={214}
        stroke={GEFAHR}
        strokeWidth={1.6}
        strokeDasharray="4 3"
      />
      <Beschriftung x={278} y={154} ton="gefahr" groesse={11.5}>
        gleiches Risiko
      </Beschriftung>

      {[
        { x: 130, y: 168, text: 'A', farbe: MARKE },
        { x: 268, y: 84, text: 'C', farbe: AKZENT },
        { x: 268, y: 214, text: 'B', farbe: GEFAHR },
      ].map((p) => (
        <g key={p.text}>
          <circle
            cx={p.x}
            cy={p.y}
            r={9}
            fill="var(--c-surface)"
            stroke={p.farbe}
            strokeWidth={2.4}
          />
          <text
            x={p.x}
            y={p.y + 4}
            textAnchor="middle"
            fontSize={11}
            fontWeight={600}
            fill={p.farbe}
          >
            {p.text}
          </text>
        </g>
      ))}

      <Beschriftung x={460} y={44} anchor="middle" ton="marke" groesse={12}>
        Effizienzlinie
      </Beschriftung>

      {/* Die Erklärung steht unter der Zeichnung, nicht in ihr. */}
      <Beschriftung x={90} y={276} groesse={12}>
        <tspan fill={MARKE} fontWeight={600}>
          A
        </tspan>
        {'  geringstes Risiko überhaupt erreichbar'}
      </Beschriftung>
      <Beschriftung x={90} y={296} groesse={12}>
        <tspan fill={AKZENT} fontWeight={600}>
          C
        </tspan>
        {'  effizient – mehr Rendite geht bei diesem Risiko nicht'}
      </Beschriftung>
      <Beschriftung x={90} y={316} groesse={12}>
        <tspan fill={GEFAHR} fontWeight={600}>
          B
        </tspan>
        {'  ineffizient – dasselbe Risiko wie C, deutlich weniger Rendite'}
      </Beschriftung>
    </FigureSvg>
  )
}

/** Was Korrelation für zwei Kursreihen bedeutet. */
export function PtKorrelation() {
  const felder: { titel: string; wert: string; a: number[]; b: number[] }[] = [
    {
      titel: 'Gleichlauf',
      wert: 'Korrelation nahe +1',
      a: [70, 40, 60, 25, 45, 15],
      b: [66, 38, 58, 22, 42, 12],
    },
    {
      titel: 'Unabhängig',
      wert: 'Korrelation nahe 0',
      a: [70, 40, 60, 25, 45, 15],
      b: [30, 55, 20, 60, 28, 50],
    },
    {
      titel: 'Gegenlauf',
      wert: 'Korrelation nahe −1',
      a: [70, 40, 60, 25, 45, 15],
      b: [15, 45, 25, 60, 40, 70],
    },
  ]
  return (
    <FigureSvg id="pt-korrelation" viewBox="0 0 640 260">
      {felder.map((feld, i) => {
        const dx = 24 + i * 205
        const basis = 170
        const zuA = feld.a.map((v, k) => [dx + k * 32, basis - v] as [number, number])
        const zuB = feld.b.map((v, k) => [dx + k * 32, basis - v] as [number, number])
        return (
          <g key={feld.titel}>
            <Beschriftung
              x={dx + 80}
              y={30}
              anchor="middle"
              groesse={13}
              gewicht="kraeftig"
            >
              {feld.titel}
            </Beschriftung>
            <Beschriftung x={dx + 80} y={48} anchor="middle" ton="leise" groesse={12}>
              {feld.wert}
            </Beschriftung>
            <line
              x1={dx - 6}
              y1={basis + 8}
              x2={dx + 168}
              y2={basis + 8}
              stroke={RASTER}
              strokeWidth={1.2}
            />
            <path d={pfad(zuA)} fill="none" stroke={MARKE} strokeWidth={2.2} />
            <path
              d={pfad(zuB)}
              fill="none"
              stroke={AKZENT}
              strokeWidth={2.2}
              strokeDasharray="5 3"
            />
          </g>
        )
      })}
      <Legende
        x={24}
        y={218}
        eintraege={[
          { farbe: MARKE, text: 'Anlage 1' },
          { farbe: AKZENT, text: 'Anlage 2' },
        ]}
      />
    </FigureSvg>
  )
}

/** Der maximale Rückgang: gemessen vom Hoch bis zum tiefsten Punkt danach. */
export function PtMaximalerRueckgang() {
  const kurs: [number, number][] = [
    [60, 190],
    [110, 150],
    [150, 168],
    [210, 90],
    [260, 130],
    [300, 108],
    [340, 200],
    [390, 224],
    [440, 186],
    [500, 140],
    [560, 96],
  ]
  return (
    <FigureSvg id="pt-maximaler-rueckgang" viewBox="0 0 640 270">
      <Achsen x0={50} y0={240} breite={530} hoehe={200} unten="Zeit" links="Depotwert" />
      <path d={pfad(kurs)} fill="none" stroke={MARKE} strokeWidth={2.4} />

      {/* Hoch und darauffolgendes Tief */}
      <line
        x1={210}
        y1={90}
        x2={580}
        y2={90}
        stroke={LEISE}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <line
        x1={390}
        y1={224}
        x2={580}
        y2={224}
        stroke={LEISE}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <line x1={470} y1={90} x2={470} y2={224} stroke={GEFAHR} strokeWidth={2} />
      <path d="M 470 90 l -4 8 h 8 Z" fill={GEFAHR} />
      <path d="M 470 224 l -4 -8 h 8 Z" fill={GEFAHR} />
      <Beschriftung x={482} y={162} ton="gefahr" groesse={12} gewicht="kraeftig">
        maximaler Rückgang
      </Beschriftung>

      <circle cx={210} cy={90} r={5} fill={MARKE} />
      <Beschriftung x={196} y={78} anchor="end" groesse={12}>
        Hoch
      </Beschriftung>
      <circle cx={390} cy={224} r={5} fill={GEFAHR} />
      <Beschriftung x={390} y={244} anchor="middle" ton="gefahr" groesse={12}>
        tiefster Punkt danach
      </Beschriftung>
    </FigureSvg>
  )
}

/** Sequenzrisiko: dieselben Renditen, andere Reihenfolge. */
export function PtSequenzrisiko() {
  const gut: [number, number][] = [
    [70, 200],
    [150, 150],
    [230, 116],
    [310, 128],
    [390, 96],
    [470, 110],
    [550, 70],
  ]
  const schlecht: [number, number][] = [
    [70, 200],
    [150, 218],
    [230, 206],
    [310, 226],
    [390, 200],
    [470, 176],
    [550, 158],
  ]
  return (
    <FigureSvg id="pt-sequenzrisiko" viewBox="0 0 640 280">
      <Achsen
        x0={54}
        y0={250}
        breite={520}
        hoehe={210}
        unten="Jahre der Entnahme"
        links="Depotwert"
      />
      <path d={pfad(gut)} fill="none" stroke={MARKE} strokeWidth={2.4} />
      <path d={pfad(schlecht)} fill="none" stroke={GEFAHR} strokeWidth={2.4} />

      <Beschriftung x={560} y={64} anchor="end" ton="marke" groesse={12}>
        gute Jahre zuerst
      </Beschriftung>
      <Beschriftung x={560} y={176} anchor="end" ton="gefahr" groesse={12}>
        schlechte Jahre zuerst
      </Beschriftung>
    </FigureSvg>
  )
}

/* --------------------------------------------------------- Makroanalyse */

/** Die drei Gestalten der Zinsstrukturkurve. */
export function MaZinsstruktur() {
  const formen: {
    titel: string
    punkte: [number, number][]
    farbe: string
    hinweis: string
  }[] = [
    {
      titel: 'Normal',
      punkte: [
        [0, 110],
        [30, 82],
        [60, 62],
        [100, 48],
        [150, 40],
      ],
      farbe: MARKE,
      hinweis: 'Lange Laufzeit, mehr Zins',
    },
    {
      titel: 'Flach',
      punkte: [
        [0, 78],
        [30, 72],
        [60, 70],
        [100, 68],
        [150, 66],
      ],
      farbe: AKZENT,
      hinweis: 'Kaum ein Unterschied',
    },
    {
      titel: 'Invers',
      punkte: [
        [0, 42],
        [30, 56],
        [60, 74],
        [100, 92],
        [150, 104],
      ],
      farbe: GEFAHR,
      hinweis: 'Kurz zahlt mehr als lang',
    },
  ]
  return (
    <FigureSvg id="ma-zinsstruktur" viewBox="0 0 640 250">
      {formen.map((form, i) => {
        const dx = 40 + i * 200
        const dy = 60
        const verschoben = form.punkte.map(
          ([x, y]) => [x + dx, y + dy] as [number, number]
        )
        return (
          <g key={form.titel}>
            <Beschriftung
              x={dx + 75}
              y={34}
              anchor="middle"
              groesse={13}
              gewicht="kraeftig"
            >
              {form.titel}
            </Beschriftung>
            <line
              x1={dx}
              y1={186}
              x2={dx + 155}
              y2={186}
              stroke={RASTER}
              strokeWidth={1.2}
            />
            <line x1={dx} y1={186} x2={dx} y2={92} stroke={RASTER} strokeWidth={1.2} />
            <path
              d={pfad(verschoben)}
              fill="none"
              stroke={form.farbe}
              strokeWidth={2.6}
            />
            <Beschriftung x={dx + 75} y={206} anchor="middle" ton="leise" groesse={12}>
              {form.hinweis}
            </Beschriftung>
          </g>
        )
      })}
    </FigureSvg>
  )
}

/** Der Konjunkturzyklus in vier Phasen. */
export function MaKonjunkturzyklus() {
  const welle: [number, number][] = []
  for (let x = 0; x <= 520; x += 8) {
    const y = 130 - Math.sin((x / 520) * Math.PI * 2) * 62
    welle.push([60 + x, y])
  }
  const phasen = [
    { x: 125, text: 'Aufschwung', unter: 'Wachstum zieht an' },
    { x: 255, text: 'Hochphase', unter: 'Auslastung am Anschlag' },
    { x: 385, text: 'Abschwung', unter: 'Wachstum kühlt ab' },
    { x: 515, text: 'Tiefphase', unter: 'Bodenbildung' },
  ]
  return (
    <FigureSvg id="ma-konjunkturzyklus" viewBox="0 0 640 260">
      <line
        x1={60}
        y1={130}
        x2={580}
        y2={130}
        stroke={RASTER}
        strokeWidth={1.2}
        strokeDasharray="4 4"
      />
      <Beschriftung x={584} y={134} anchor="end" ton="leise" groesse={11}>
        Trend
      </Beschriftung>
      <path d={pfad(welle)} fill="none" stroke={MARKE} strokeWidth={2.6} />
      {phasen.map((p, i) => (
        <g key={p.text}>
          <line
            x1={p.x}
            y1={40}
            x2={p.x}
            y2={196}
            stroke={RASTER}
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          <Beschriftung x={p.x - 60} y={214} groesse={12} gewicht="kraeftig">
            {p.text}
          </Beschriftung>
          <Beschriftung x={p.x - 60} y={230} ton="leise" groesse={11.5}>
            {p.unter}
          </Beschriftung>
        </g>
      ))}
    </FigureSvg>
  )
}

/* --------------------------------------------------- Anlegerverhalten */

/**
 * Die Wertfunktion: Verluste wiegen schwerer als gleich große Gewinne.
 *
 * ## Warum die Höhe des Bildes aus der Kurve folgt
 *
 * Der Verlustast ist rund doppelt so steil wie der Gewinnast – das ist die
 * Aussage. Im ersten Entwurf lief er deshalb unten aus dem Bild heraus, und
 * der Schlusstext stand über der Kurve. Die Ausschläge und die Bildhöhe sind
 * jetzt aufeinander abgestimmt: 80 nach oben, 160 nach unten, darunter zwei
 * Zeilen Platz. Wer den Faktor ändert, ändert die Höhe mit.
 */
export function AvWertfunktion() {
  const ACHSE = 140
  const OBEN = 80
  const UNTEN = 160

  const gewinn: [number, number][] = []
  for (let x = 0; x <= 200; x += 5) {
    gewinn.push([320 + x, ACHSE - Math.pow(x / 200, 0.62) * OBEN])
  }
  const verlust: [number, number][] = []
  for (let x = 200; x >= 0; x -= 5) {
    verlust.push([320 - x, ACHSE + Math.pow(x / 200, 0.62) * UNTEN])
  }

  /* Der Punkt, an dem 100 Einheiten nach beiden Seiten liegen. */
  const hundert = Math.pow(0.5, 0.62)
  const yGewinn = ACHSE - hundert * OBEN
  const yVerlust = ACHSE + hundert * UNTEN

  return (
    <FigureSvg id="av-wertfunktion" viewBox="0 0 640 370">
      <line x1={100} y1={ACHSE} x2={560} y2={ACHSE} stroke={RASTER} strokeWidth={1.4} />
      <line x1={320} y1={40} x2={320} y2={312} stroke={RASTER} strokeWidth={1.4} />

      <Beschriftung x={556} y={ACHSE - 10} anchor="end" ton="leise" groesse={12}>
        Gewinn
      </Beschriftung>
      <Beschriftung x={106} y={ACHSE + 20} ton="leise" groesse={12}>
        Verlust
      </Beschriftung>
      <Beschriftung x={330} y={52} ton="leise" groesse={12}>
        empfundener Wert
      </Beschriftung>

      <path d={pfad(gewinn)} fill="none" stroke={MARKE} strokeWidth={2.6} />
      <path d={pfad(verlust)} fill="none" stroke={GEFAHR} strokeWidth={2.6} />

      {/* Derselbe Betrag nach beiden Seiten */}
      <line
        x1={420}
        y1={ACHSE}
        x2={420}
        y2={yGewinn}
        stroke={MARKE}
        strokeWidth={1.6}
        strokeDasharray="3 3"
      />
      <line
        x1={220}
        y1={ACHSE}
        x2={220}
        y2={yVerlust}
        stroke={GEFAHR}
        strokeWidth={1.6}
        strokeDasharray="3 3"
      />
      <circle cx={420} cy={yGewinn} r={4} fill={MARKE} />
      <circle cx={220} cy={yVerlust} r={4} fill={GEFAHR} />

      <Beschriftung x={430} y={yGewinn + 4} ton="marke" groesse={12}>
        +100 € wiegen so viel
      </Beschriftung>
      <Beschriftung x={210} y={yVerlust + 4} anchor="end" ton="gefahr" groesse={12}>
        −100 € wiegen so viel
      </Beschriftung>

      <Beschriftung x={100} y={340} ton="leise" groesse={12}>
        Derselbe Betrag, ungefähr die doppelte Wirkung.
      </Beschriftung>
      <Beschriftung x={100} y={358} ton="leise" groesse={12}>
        Die Kurve ist im Verlustbereich steiler – das ist die Verlustaversion.
      </Beschriftung>
    </FigureSvg>
  )
}

/* -------------------------------------------------- Fundamentalanalyse */

/** Wie die drei Abschlüsse zusammenhängen. */
export function FaDreiAbschluesse() {
  const kaesten = [
    {
      x: 40,
      titel: 'Gewinn- und Verlustrechnung',
      zeilen: ['Umsatz', '− Kosten', '= Gewinn'],
      farbe: MARKE,
    },
    {
      x: 240,
      titel: 'Kapitalflussrechnung',
      zeilen: ['Gewinn', '± nicht zahlungswirksam', '= Mittelzufluss'],
      farbe: AKZENT,
    },
    {
      x: 440,
      titel: 'Bilanz',
      zeilen: ['Vermögen', '− Schulden', '= Eigenkapital'],
      farbe: MARKE,
    },
  ]
  return (
    <FigureSvg id="fa-drei-abschluesse" viewBox="0 0 640 260">
      {kaesten.map((k) => (
        <g key={k.titel}>
          <rect
            x={k.x}
            y={54}
            width={160}
            height={116}
            rx={10}
            fill={k.farbe}
            fillOpacity={BAND_DECKKRAFT}
            stroke={k.farbe}
            strokeWidth={1.4}
          />
          <Beschriftung
            x={k.x + 80}
            y={44}
            anchor="middle"
            groesse={12}
            gewicht="kraeftig"
          >
            {k.titel}
          </Beschriftung>
          {k.zeilen.map((zeile, i) => (
            <Beschriftung key={zeile} x={k.x + 14} y={84 + i * 26} groesse={12.5}>
              {zeile}
            </Beschriftung>
          ))}
        </g>
      ))}

      {/* Verbindungen */}
      <path d="M 200 96 L 236 96" stroke={LEISE} strokeWidth={1.6} />
      <path d="M 236 96 l -8 -4 v 8 Z" fill={LEISE} />
      <Beschriftung x={218} y={86} anchor="middle" ton="leise" groesse={11}>
        Gewinn
      </Beschriftung>

      <path d="M 400 122 L 436 122" stroke={LEISE} strokeWidth={1.6} />
      <path d="M 436 122 l -8 -4 v 8 Z" fill={LEISE} />
      <Beschriftung x={418} y={112} anchor="middle" ton="leise" groesse={11}>
        Kasse
      </Beschriftung>

      <path
        d="M 520 174 L 520 200 L 120 200 L 120 174"
        fill="none"
        stroke={LEISE}
        strokeWidth={1.4}
        strokeDasharray="4 4"
      />
      <path d="M 120 174 l -4 8 h 8 Z" fill={LEISE} />
      <Beschriftung x={320} y={218} anchor="middle" ton="leise" groesse={11.5}>
        Der Gewinn erhöht das Eigenkapital – der Kreis schließt sich.
      </Beschriftung>
    </FigureSvg>
  )
}
