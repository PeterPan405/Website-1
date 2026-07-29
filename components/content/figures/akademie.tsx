import { Beschriftung, FigureSvg, Legende } from '@/components/content/figures/Rahmen'

/**
 * Die Grafiken der Akademie.
 *
 * ## Warum hier Zahlen im Quelltext stehen dürfen
 *
 * Die übrigen Lerngrafiken holen ihre Werte aus `lib/`, damit Grafik und
 * Tabelle daneben nicht auseinanderlaufen. Hier gibt es keine Tabelle daneben:
 * Diese Zeichnungen zeigen kein Rechenergebnis, sondern eine Form – wie ein
 * Aufwärtstrend aussieht, was ein Rollentausch ist, wie ein Elliott-Zyklus
 * gezählt wird. Die Kurse sind erfunden und sollen es sein.
 *
 * Aus demselben Grund tragen sie keine Achsenbeschriftung mit Zahlen. Ein
 * Kursverlauf mit einer Euro-Achse würde behaupten, eine konkrete Aktie zu
 * zeigen; gemeint ist die Form, nicht der Wert.
 */

const MARKE = 'var(--c-brand)'
const AKZENT = 'var(--c-accent)'
const GEFAHR = 'var(--c-danger)'
const RASTER = 'var(--c-border)'
const LEISE = 'var(--c-fg-subtle)'
/*
  Nicht `--c-surface-muted`: Genau diese Farbe hat der Kasten, in dem die
  Grafiken stehen. Eine Fläche darin war unsichtbar – der markierte Bereich im
  Elliott-Zyklus und das Band bei Unterstützung und Widerstand fehlten
  vollständig, ohne dass an der Zeichnung etwas falsch gewesen wäre.
  Stattdessen die Markenfarbe mit niedriger Deckkraft: sichtbar auf hellem wie
  auf dunklem Grund.
*/
const BAND_DECKKRAFT = 0.09

/** Ein Polygonzug aus Punkten. */
function pfad(punkte: readonly [number, number][]): string {
  return punkte.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
}

/**
 * Ein geglätteter Pfad durch Stützstellen.
 *
 * Kursverläufe aus geraden Strecken sehen aus wie ein Fieberkurvenblatt. Die
 * Glättung nimmt jedem Punkt die Ecke, ohne die Stützstellen zu verschieben –
 * die markierten Hoch- und Tiefpunkte liegen weiterhin genau dort, wo die
 * Beschriftung sie behauptet.
 */
function weich(punkte: readonly [number, number][], spannung = 0.35): string {
  if (punkte.length < 3) return pfad(punkte)
  let d = `M ${punkte[0][0]} ${punkte[0][1]}`
  for (let i = 0; i < punkte.length - 1; i += 1) {
    const vorher = punkte[i - 1] ?? punkte[i]
    const von = punkte[i]
    const bis = punkte[i + 1]
    const danach = punkte[i + 2] ?? bis
    const c1x = von[0] + (bis[0] - vorher[0]) * spannung * 0.5
    const c1y = von[1] + (bis[1] - vorher[1]) * spannung * 0.5
    const c2x = bis[0] - (danach[0] - von[0]) * spannung * 0.5
    const c2y = bis[1] - (danach[1] - von[1]) * spannung * 0.5
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${bis[0]} ${bis[1]}`
  }
  return d
}

/* ==================================================== Aufbau einer Kerze */

/*
  Kerze und Maßlinie stehen außerhalb von TaKerzeAufbau.

  Innerhalb wären es Komponenten, die bei jedem Rendern neu entstehen – React
  könnte sie nicht wiedererkennen und würde den Teilbaum jedes Mal verwerfen.
  Der React-Compiler weist das zurecht als Fehler zurück.
*/

/** Eine Kerze mit Körper, Dochten und Beschriftung. */
function Kerze({
  x,
  hoch,
  tief,
  oben,
  unten,
  steigend,
  titel,
}: {
  x: number
  hoch: number
  tief: number
  /** y des oberen Körperrands. */
  oben: number
  /** y des unteren Körperrands. */
  unten: number
  steigend: boolean
  titel: string
}) {
  const breite = 46
  const farbe = steigend ? MARKE : GEFAHR
  return (
    <g>
      <line x1={x} y1={hoch} x2={x} y2={tief} stroke={farbe} strokeWidth={2} />
      <rect
        x={x - breite / 2}
        y={oben}
        width={breite}
        height={unten - oben}
        fill={steigend ? 'var(--c-surface)' : farbe}
        stroke={farbe}
        strokeWidth={2.5}
        rx={2}
      />
      <Beschriftung x={x} y={tief + 26} anchor="middle" gewicht="kraeftig">
        {titel}
      </Beschriftung>
    </g>
  )
}

/** Waagerechte Hilfslinie mit Text am linken Ende. */
function Kursmarke({ y, text, bis }: { y: number; text: string; bis: number }) {
  return (
    <g>
      <line
        x1={120}
        y1={y}
        x2={bis}
        y2={y}
        stroke={RASTER}
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <Beschriftung x={112} y={y + 4} anchor="end" ton="leise" groesse={12}>
        {text}
      </Beschriftung>
    </g>
  )
}

export function TaKerzeAufbau() {
  return (
    <FigureSvg id="ta-kerze-aufbau" viewBox="0 0 640 300">
      <Kursmarke y={40} text="Hoch" bis={560} />
      <Kursmarke y={90} text="Schluss / Eröffnung" bis={560} />
      <Kursmarke y={190} text="Eröffnung / Schluss" bis={560} />
      <Kursmarke y={236} text="Tief" bis={560} />

      <Kerze
        x={230}
        hoch={40}
        tief={236}
        oben={90}
        unten={190}
        steigend
        titel="steigend"
      />
      <Kerze
        x={430}
        hoch={40}
        tief={236}
        oben={90}
        unten={190}
        steigend={false}
        titel="fallend"
      />

      {/* Körper- und Dochtbeschriftung an der linken Kerze */}
      <g>
        <line x1={196} y1={90} x2={176} y2={90} stroke={LEISE} strokeWidth={1} />
        <line x1={196} y1={190} x2={176} y2={190} stroke={LEISE} strokeWidth={1} />
        <line x1={176} y1={90} x2={176} y2={190} stroke={LEISE} strokeWidth={1} />
        <Beschriftung x={170} y={144} anchor="end" ton="leise" groesse={12}>
          Körper
        </Beschriftung>
      </g>
      <Beschriftung x={252} y={62} ton="leise" groesse={12}>
        Docht
      </Beschriftung>

      <Legende
        x={120}
        y={286}
        eintraege={[
          { farbe: MARKE, text: 'Schluss über Eröffnung' },
          { farbe: GEFAHR, text: 'Schluss unter Eröffnung' },
        ]}
      />
    </FigureSvg>
  )
}

/* ================================================== Trend und Trendbruch */

export function TaTrendstruktur() {
  /*
    Der Verlauf ist so gelegt, dass er die Aussage trägt: drei höhere Hochs mit
    höheren Tiefs dazwischen, dann ein tieferes Hoch – und erst danach das Tief,
    das unter das vorige rutscht. Genau dieser zweite Schritt beendet den Trend.
  */
  const verlauf: [number, number][] = [
    [40, 236],
    [78, 200],
    [110, 218],
    [156, 168],
    [192, 190],
    [240, 128],
    [280, 152],
    [330, 82],
    [372, 118],
    [418, 96],
    [452, 150],
    [492, 132],
    [536, 196],
    [584, 176],
  ]
  const hochs: [number, number, string][] = [
    [156, 168, 'H1'],
    [240, 128, ''],
    [330, 82, 'H3'],
    [418, 96, 'H4'],
  ]
  const tiefs: [number, number, string][] = [
    [110, 218, 'T1'],
    [192, 190, ''],
    [280, 152, 'T3'],
    [372, 118, ''],
    [536, 196, 'T5'],
  ]

  return (
    <FigureSvg id="ta-trendstruktur" viewBox="0 0 640 300">
      {/* Trendlinie durch die Tiefpunkte */}
      <line
        x1={100}
        y1={224}
        x2={400}
        y2={106}
        stroke={AKZENT}
        strokeWidth={1.5}
        strokeDasharray="5 4"
      />
      <Beschriftung x={196} y={228} ton="akzent" groesse={12}>
        Trendlinie durch die Tiefs
      </Beschriftung>

      <path d={weich(verlauf)} fill="none" stroke={MARKE} strokeWidth={2.5} />

      {hochs.map(([x, y, text]) => (
        <g key={`h${x}`}>
          <circle cx={x} cy={y} r={4} fill={MARKE} />
          {text ? (
            <Beschriftung x={x} y={y - 12} anchor="middle" ton="stark" groesse={12}>
              {text}
            </Beschriftung>
          ) : null}
        </g>
      ))}
      {tiefs.map(([x, y, text]) => (
        <g key={`t${x}`}>
          <circle cx={x} cy={y} r={4} fill={AKZENT} />
          {text ? (
            <Beschriftung x={x} y={y + 20} anchor="middle" ton="leise" groesse={12}>
              {text}
            </Beschriftung>
          ) : null}
        </g>
      ))}

      {/* Die Stelle, an der die Struktur bricht */}
      <line
        x1={280}
        y1={152}
        x2={600}
        y2={152}
        stroke={GEFAHR}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <circle cx={536} cy={196} r={6} fill="none" stroke={GEFAHR} strokeWidth={2} />
      <Beschriftung x={600} y={134} anchor="end" ton="gefahr" groesse={12}>
        Höhe des letzten Tiefs
      </Beschriftung>
      <Beschriftung x={536} y={240} anchor="middle" ton="gefahr" groesse={12}>
        darunter: Trend gebrochen
      </Beschriftung>

      <Legende
        x={40}
        y={286}
        eintraege={[
          { farbe: MARKE, text: 'Hochpunkte' },
          { farbe: AKZENT, text: 'Tiefpunkte' },
        ]}
      />
    </FigureSvg>
  )
}

/* ============================================ Unterstützung / Widerstand */

export function TaUnterstuetzungWiderstand() {
  const bandOben = 118
  const bandUnten = 138
  const verlauf: [number, number][] = [
    [40, 214],
    [80, 130],
    [116, 190],
    [156, 128],
    [196, 204],
    [244, 132],
    [286, 178],
    [330, 126],
    [368, 74],
    [408, 60],
    [446, 96],
    [482, 132],
    [516, 106],
    [556, 66],
    [596, 82],
  ]

  return (
    <FigureSvg id="ta-unterstuetzung-widerstand" viewBox="0 0 640 300">
      <rect
        x={30}
        y={bandOben}
        width={580}
        height={bandUnten - bandOben}
        fill={MARKE}
        fillOpacity={BAND_DECKKRAFT}
      />
      <line
        x1={30}
        y1={bandOben}
        x2={610}
        y2={bandOben}
        stroke={RASTER}
        strokeWidth={1}
      />
      <line
        x1={30}
        y1={bandUnten}
        x2={610}
        y2={bandUnten}
        stroke={RASTER}
        strokeWidth={1}
      />

      <path d={weich(verlauf)} fill="none" stroke={MARKE} strokeWidth={2.5} />

      {/* Drei Anläufe von unten */}
      {[80, 156, 244].map((x) => (
        <circle
          key={x}
          cx={x}
          cy={x === 80 ? 130 : x === 156 ? 128 : 132}
          r={4}
          fill={GEFAHR}
        />
      ))}
      {/*
        Die Rollen stehen an den Rändern, nicht in der Mitte.

        Zuerst standen beide Beschriftungen mittig über dem Band – und liefen
        genau dort durch den Kursverlauf, weil der Kurs an dieser Stelle sein
        Hoch hat. Links unten und rechts unten ist die Fläche frei.
      */}
      <Beschriftung x={36} y={106} ton="gefahr" gewicht="kraeftig" groesse={13}>
        Widerstand
      </Beschriftung>
      <Beschriftung
        x={604}
        y={232}
        anchor="end"
        ton="akzent"
        gewicht="kraeftig"
        groesse={13}
      >
        jetzt Unterstützung
      </Beschriftung>

      {/* Ausbruch */}
      <line
        x1={340}
        y1={40}
        x2={340}
        y2={244}
        stroke={LEISE}
        strokeWidth={1}
        strokeDasharray="3 4"
      />
      <Beschriftung x={348} y={256} ton="leise" groesse={12}>
        Ausbruch
      </Beschriftung>

      {/* Rücklauf auf dieselbe Marke */}
      <circle cx={482} cy={132} r={6} fill="none" stroke={AKZENT} strokeWidth={2} />

      <Beschriftung x={36} y={278} ton="leise" groesse={12}>
        Dreimal von unten angelaufen, dreimal abgeprallt – nach dem Ausbruch trägt
      </Beschriftung>
      <Beschriftung x={36} y={294} ton="leise" groesse={12}>
        dieselbe Zone von unten. Sie ist ein Bereich, kein Strich.
      </Beschriftung>
    </FigureSvg>
  )
}

/* ============================================== Gleitende Durchschnitte */

export function TaSmaVsEma() {
  /*
    Kurs, einfacher und exponentieller Durchschnitt über denselben Verlauf.

    Die beiden Linien sind nicht gerechnet, sondern gezeichnet – siehe der
    Hinweis oben in dieser Datei. Was sie zeigen müssen, ist der Unterschied im
    Nachlauf: Am Einbruch dreht die exponentielle Linie früher und kommt dem
    Kurs näher, die einfache bleibt länger oben und verläuft flacher.
  */
  const kurs: [number, number][] = [
    [40, 200],
    [76, 178],
    [112, 190],
    [148, 150],
    [184, 162],
    [220, 120],
    [256, 134],
    [292, 96],
    [320, 108],
    [348, 178],
    [376, 214],
    [404, 196],
    [440, 208],
    [476, 172],
    [512, 152],
    [548, 160],
    [590, 128],
  ]
  const ema: [number, number][] = [
    [76, 196],
    [112, 190],
    [148, 180],
    [184, 172],
    [220, 158],
    [256, 148],
    [292, 132],
    [320, 124],
    [348, 142],
    [376, 168],
    [404, 180],
    [440, 190],
    [476, 186],
    [512, 176],
    [548, 170],
    [590, 158],
  ]
  const sma: [number, number][] = [
    [112, 198],
    [148, 194],
    [184, 188],
    [220, 180],
    [256, 172],
    [292, 162],
    [320, 156],
    [348, 156],
    [376, 162],
    [404, 170],
    [440, 178],
    [476, 182],
    [512, 182],
    [548, 180],
    [590, 176],
  ]

  return (
    <FigureSvg id="ta-sma-vs-ema" viewBox="0 0 640 300">
      {/*
        Drei unterscheidbare Töne statt zweier Grautöne.

        Zuerst war der Kurs in der Rasterfarbe gezeichnet und der einfache
        Durchschnitt im selben Grau – der Kurs war kaum zu sehen, und wer ihn
        sah, hielt ihn für dieselbe Linie. Jetzt: Kurs blass im Hintergrund,
        die beiden Durchschnitte in zwei klar verschiedenen Farben.
      */}
      <path
        d={weich(kurs, 0.2)}
        fill="none"
        stroke={LEISE}
        strokeOpacity={0.45}
        strokeWidth={1.5}
      />
      <path d={weich(sma)} fill="none" stroke={AKZENT} strokeWidth={2.5} />
      <path d={weich(ema)} fill="none" stroke={MARKE} strokeWidth={2.5} />

      <line
        x1={320}
        y1={60}
        x2={320}
        y2={250}
        stroke={AKZENT}
        strokeWidth={1}
        strokeDasharray="3 4"
      />
      <Beschriftung x={328} y={72} ton="akzent" groesse={12}>
        Wendepunkt des Kurses
      </Beschriftung>
      <Beschriftung x={328} y={244} ton="leise" groesse={12}>
        beide Linien drehen später – die exponentielle früher
      </Beschriftung>

      <Legende
        x={40}
        y={286}
        eintraege={[
          { farbe: LEISE, text: 'Kurs' },
          { farbe: MARKE, text: 'exponentiell (EMA)' },
          { farbe: AKZENT, text: 'einfach (SMA)' },
        ]}
      />
    </FigureSvg>
  )
}

/* =============================================================== MACD */

export function TaMacd() {
  const kurs: [number, number][] = [
    [40, 132],
    [86, 116],
    [132, 124],
    [178, 96],
    [224, 104],
    [270, 72],
    [316, 60],
    [362, 66],
    [408, 88],
    [454, 82],
    [500, 104],
    [546, 126],
    [592, 118],
  ]
  const macd: [number, number][] = [
    [40, 244],
    [86, 238],
    [132, 236],
    [178, 226],
    [224, 220],
    [270, 208],
    [316, 202],
    [362, 206],
    [408, 218],
    [454, 226],
    [500, 238],
    [546, 250],
    [592, 252],
  ]
  const signal: [number, number][] = [
    [40, 248],
    [86, 246],
    [132, 242],
    [178, 238],
    [224, 232],
    [270, 224],
    [316, 214],
    [362, 208],
    [408, 210],
    [454, 216],
    [500, 224],
    [546, 234],
    [592, 244],
  ]
  const null_ = 232
  const balken = [
    [64, 234],
    [98, 236],
    [132, 238],
    [166, 240],
    [200, 243],
    [234, 246],
    [268, 248],
    [302, 246],
    [336, 240],
    [370, 234],
    [404, 228],
    [438, 224],
    [472, 226],
    [506, 229],
    [540, 231],
  ] as const

  return (
    <FigureSvg id="ta-macd" viewBox="0 0 640 320">
      {/* Kursverlauf oben */}
      <path d={weich(kurs)} fill="none" stroke={MARKE} strokeWidth={2.5} />
      <Beschriftung x={40} y={36} ton="leise" groesse={12}>
        Kurs
      </Beschriftung>
      <line x1={30} y1={160} x2={610} y2={160} stroke={RASTER} strokeWidth={1} />

      {/* Histogramm */}
      {balken.map(([x, y]) => (
        <rect
          key={x}
          x={x - 9}
          y={Math.min(y, null_)}
          width={18}
          height={Math.max(2, Math.abs(null_ - y))}
          fill={y < null_ ? MARKE : GEFAHR}
          opacity={0.35}
        />
      ))}
      <line x1={30} y1={null_} x2={610} y2={null_} stroke={LEISE} strokeWidth={1} />

      <path d={weich(macd)} fill="none" stroke={MARKE} strokeWidth={2.5} />
      <path d={weich(signal)} fill="none" stroke={AKZENT} strokeWidth={2} />

      {/* Die Kreuzung */}
      <circle cx={340} cy={210} r={6} fill="none" stroke={AKZENT} strokeWidth={2} />
      <Beschriftung x={352} y={200} ton="akzent" groesse={12}>
        Kreuzung
      </Beschriftung>

      {/* Das Histogramm dreht vor dem Kurs */}
      <line
        x1={438}
        y1={40}
        x2={438}
        y2={276}
        stroke={LEISE}
        strokeWidth={1}
        strokeDasharray="3 4"
      />
      <Beschriftung x={446} y={52} ton="leise" groesse={12}>
        Balken schrumpfen bereits
      </Beschriftung>

      <Beschriftung x={40} y={186} ton="leise" groesse={12}>
        MACD
      </Beschriftung>

      <Legende
        x={40}
        y={306}
        eintraege={[
          { farbe: MARKE, text: 'MACD-Linie' },
          { farbe: AKZENT, text: 'Signallinie' },
          { farbe: RASTER, text: 'Histogramm: Abstand beider' },
        ]}
      />
    </FigureSvg>
  )
}

/* ==================================================== Elliott-Grundzyklus */

export function TaElliottZyklus() {
  /*
    Die drei harten Regeln sind in den Koordinaten eingehalten:
    Welle 2 (y=214) bleibt über dem Start (y=250), Welle 3 ist die längste,
    und Welle 4 (y=142) reicht nicht in den Bereich von Welle 1 (Gipfel y=196).
  */
  const punkte: [number, number][] = [
    [40, 250],
    [116, 196],
    [172, 214],
    [300, 92],
    [364, 142],
    [432, 74],
    [502, 150],
    [548, 112],
    [600, 200],
  ]
  const marken: { x: number; y: number; text: string; oben: boolean }[] = [
    { x: 116, y: 196, text: '1', oben: true },
    { x: 172, y: 214, text: '2', oben: false },
    { x: 300, y: 92, text: '3', oben: true },
    { x: 364, y: 142, text: '4', oben: false },
    { x: 432, y: 74, text: '5', oben: true },
    { x: 502, y: 150, text: 'A', oben: false },
    { x: 548, y: 112, text: 'B', oben: true },
    { x: 600, y: 200, text: 'C', oben: false },
  ]

  return (
    <FigureSvg id="ta-elliott-zyklus" viewBox="0 0 640 300">
      {/* Trennung zwischen Impuls und Korrektur */}
      {/*
        Der Bereich beginnt hinter Welle 5, nicht auf ihr: Welle 5 gehört zum
        Impuls. Auf der Kante gezeichnet sah es aus, als zählte sie zur
        Korrektur.
      */}
      <rect
        x={446}
        y={30}
        width={172}
        height={220}
        fill={MARKE}
        fillOpacity={BAND_DECKKRAFT}
      />
      <Beschriftung x={532} y={48} anchor="middle" ton="leise" groesse={12}>
        Korrektur
      </Beschriftung>
      <Beschriftung x={236} y={48} anchor="middle" ton="leise" groesse={12}>
        fünf Impulswellen
      </Beschriftung>

      <path d={pfad(punkte)} fill="none" stroke={MARKE} strokeWidth={2.5} />

      {marken.map((marke) => (
        <g key={marke.text}>
          <circle
            cx={marke.x}
            cy={marke.y}
            r={11}
            fill="var(--c-surface)"
            stroke={MARKE}
            strokeWidth={2}
          />
          <text
            x={marke.x}
            y={marke.y + 4}
            textAnchor="middle"
            fontSize={12}
            fontWeight={600}
            fill={MARKE}
          >
            {marke.text}
          </text>
        </g>
      ))}

      {/* Regel 1: Welle 2 unterschreitet den Start nicht */}
      <line
        x1={40}
        y1={250}
        x2={210}
        y2={250}
        stroke={GEFAHR}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <Beschriftung x={46} y={270} ton="gefahr" groesse={12}>
        Welle 2 bleibt darüber
      </Beschriftung>

      {/* Regel 3: Welle 4 überlappt Welle 1 nicht */}
      <line
        x1={116}
        y1={196}
        x2={400}
        y2={196}
        stroke={GEFAHR}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <Beschriftung x={400} y={184} anchor="end" ton="gefahr" groesse={12}>
        Welle 4 reicht nicht bis hierher
      </Beschriftung>

      <Beschriftung x={30} y={292} ton="leise" groesse={12}>
        Regel 2 steckt in der Form: Welle 3 ist nie die kürzeste der drei Impulswellen.
      </Beschriftung>
    </FigureSvg>
  )
}
