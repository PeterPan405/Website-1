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

/* ------------------------------------------------ Elliott: Sonderformen */

/**
 * Die Zeichnungen ab hier gehören zu den vier Elliott-Lektionen.
 *
 * ## Warum so viele
 *
 * Weil dieser Stoff ohne Bild nicht vermittelbar ist. „Eine Flat ist eine
 * 3-3-5-Korrektur, deren Welle B mindestens 90 Prozent von A zurückholt und
 * bei der erweiterten Form über deren Startpunkt hinausläuft“ – dieser Satz
 * ist korrekt und für jemanden, der die Form nicht vor Augen hat, nutzlos.
 * Die Unterschiede zwischen den Korrekturformen sind ausschließlich formal;
 * sie liegen in Proportionen und Überschneidungen, und beides sieht man.
 *
 * ## Warum die Formen schematisch und nicht als Kursverlauf gezeichnet sind
 *
 * Ein echter Chart müsste die Zählung bereits enthalten, die er belegen soll.
 * Genau das ist der Haupteinwand gegen die Theorie: Im Rückblick lässt sich
 * fast jeder Verlauf regelkonform auszählen. Eine erfundene, klar gezeichnete
 * Form behauptet nichts über die Wirklichkeit – sie zeigt die Definition.
 */

/** Ein nummerierter oder beschrifteter Punkt auf einem Wellenzug. */
function WellenMarke({
  x,
  y,
  text,
  farbe = MARKE,
  radius = 10,
}: {
  x: number
  y: number
  text: string
  farbe?: string
  radius?: number
}) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill="var(--c-surface)"
        stroke={farbe}
        strokeWidth={2}
      />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fontSize={radius > 9 ? 12 : 10}
        fontWeight={600}
        fill={farbe}
      >
        {text}
      </text>
    </g>
  )
}

/** Wo eine Impulswelle gestreckt wird – in 1, in 3 oder in 5. */
export function TaElliottExtension() {
  const zuege: { titel: string; punkte: [number, number][]; lang: number }[] = [
    {
      titel: 'Streckung in Welle 3',
      punkte: [
        [0, 130],
        [22, 96],
        [36, 112],
        [104, 34],
        [124, 62],
        [150, 38],
      ],
      lang: 3,
    },
    {
      titel: 'Streckung in Welle 5',
      punkte: [
        [0, 130],
        [26, 104],
        [40, 118],
        [78, 78],
        [94, 94],
        [150, 24],
      ],
      lang: 5,
    },
    {
      titel: 'Streckung in Welle 1',
      punkte: [
        [0, 130],
        [70, 48],
        [92, 84],
        [118, 54],
        [128, 68],
        [150, 44],
      ],
      lang: 1,
    },
  ]

  return (
    <FigureSvg id="ta-elliott-extension" viewBox="0 0 640 260">
      {zuege.map((zug, i) => {
        const dx = 30 + i * 205
        const verschoben = zug.punkte.map(
          ([x, y]) => [x + dx, y + 40] as [number, number]
        )
        return (
          <g key={zug.titel}>
            <Beschriftung x={dx + 75} y={32} anchor="middle" groesse={13}>
              {zug.titel}
            </Beschriftung>
            <path d={pfad(verschoben)} fill="none" stroke={MARKE} strokeWidth={2.2} />
            {verschoben.slice(1).map((punkt, index) => (
              <WellenMarke
                key={index}
                x={punkt[0]}
                y={punkt[1]}
                text={String(index + 1)}
                radius={9}
                farbe={index + 1 === zug.lang ? AKZENT : MARKE}
              />
            ))}
          </g>
        )
      })}
      <Beschriftung x={320} y={240} anchor="middle" ton="leise" groesse={12}>
        Genau eine der drei Impulswellen ist gestreckt – die anderen beiden ähneln
        einander dann in der Länge.
      </Beschriftung>
    </FigureSvg>
  )
}

/** Die verkürzte fünfte Welle: Welle 5 überbietet das Hoch von Welle 3 nicht. */
export function TaElliottVerkuerzung() {
  const punkte: [number, number][] = [
    [40, 210],
    [110, 140],
    [150, 172],
    [300, 60],
    [360, 108],
    [430, 76],
  ]
  return (
    <FigureSvg id="ta-elliott-verkuerzung" viewBox="0 0 640 260">
      <line
        x1={300}
        y1={60}
        x2={600}
        y2={60}
        stroke={GEFAHR}
        strokeWidth={1.2}
        strokeDasharray="5 4"
      />
      <Beschriftung x={462} y={52} ton="gefahr" groesse={12}>
        Hoch der Welle 3
      </Beschriftung>
      <path d={pfad(punkte)} fill="none" stroke={MARKE} strokeWidth={2.4} />
      {['1', '2', '3', '4', '5'].map((text, i) => (
        <WellenMarke
          key={text}
          x={punkte[i + 1][0]}
          y={punkte[i + 1][1]}
          text={text}
          farbe={text === '5' ? AKZENT : MARKE}
        />
      ))}
      <line x1={430} y1={76} x2={430} y2={60} stroke={AKZENT} strokeWidth={1.4} />
      <Beschriftung x={444} y={74} ton="akzent" groesse={12}>
        Welle 5 bleibt darunter
      </Beschriftung>
      <Beschriftung x={40} y={240} ton="leise" groesse={12}>
        Zulässig, aber selten – und ein Hinweis auf ungewöhnliche Schwäche im Trend. Der
        Impuls gilt trotzdem als abgeschlossen.
      </Beschriftung>
    </FigureSvg>
  )
}

/** Führende und endende Diagonale im Vergleich. */
export function TaElliottDiagonale() {
  return (
    <FigureSvg id="ta-elliott-diagonale" viewBox="0 0 640 280">
      {/* Führende Diagonale – in Welle 1 oder A */}
      <Beschriftung x={160} y={30} anchor="middle" groesse={13}>
        Führende Diagonale (Welle 1 oder A)
      </Beschriftung>
      <path
        d={pfad([
          [40, 200],
          [110, 110],
          [80, 158],
          [180, 78],
          [140, 130],
          [250, 60],
        ])}
        fill="none"
        stroke={MARKE}
        strokeWidth={2.2}
      />
      <path
        d={pfad([
          [40, 200],
          [250, 60],
        ])}
        fill="none"
        stroke={LEISE}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <path
        d={pfad([
          [80, 158],
          [140, 130],
        ])}
        fill="none"
        stroke={LEISE}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <Beschriftung x={44} y={228} ton="leise" groesse={12}>
        Keil, der sich verengt. Wellen 1, 3 und 5 sind je dreiteilig.
      </Beschriftung>

      {/* Endende Diagonale – in Welle 5 oder C */}
      <Beschriftung x={480} y={30} anchor="middle" groesse={13}>
        Endende Diagonale (Welle 5 oder C)
      </Beschriftung>
      <path
        d={pfad([
          [360, 190],
          [470, 96],
          [420, 140],
          [530, 70],
          [490, 104],
          [580, 56],
        ])}
        fill="none"
        stroke={AKZENT}
        strokeWidth={2.2}
      />
      <path
        d={pfad([
          [360, 190],
          [580, 56],
        ])}
        fill="none"
        stroke={LEISE}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <path
        d={pfad([
          [420, 140],
          [490, 104],
        ])}
        fill="none"
        stroke={LEISE}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <Beschriftung x={364} y={228} ton="leise" groesse={12}>
        Steht am Ende einer Bewegung. Welle 4 darf hier in Welle 1 hineinreichen –
      </Beschriftung>
      <Beschriftung x={364} y={246} ton="leise" groesse={12}>
        die einzige Stelle, an der die dritte Regel ausgesetzt ist.
      </Beschriftung>
    </FigureSvg>
  )
}

/** Zickzack: die scharfe Korrektur im 5-3-5-Aufbau. */
export function TaElliottZigzag() {
  const punkte: [number, number][] = [
    [50, 50],
    [180, 170],
    [270, 110],
    [420, 220],
  ]
  return (
    <FigureSvg id="ta-elliott-zigzag" viewBox="0 0 640 260">
      <path d={pfad(punkte)} fill="none" stroke={MARKE} strokeWidth={2.4} />
      <WellenMarke x={180} y={170} text="A" />
      <WellenMarke x={270} y={110} text="B" />
      <WellenMarke x={420} y={220} text="C" />
      <Beschriftung x={104} y={100} ton="leise" groesse={12}>
        5
      </Beschriftung>
      <Beschriftung x={228} y={128} ton="leise" groesse={12}>
        3
      </Beschriftung>
      <Beschriftung x={352} y={158} ton="leise" groesse={12}>
        5
      </Beschriftung>
      <line
        x1={50}
        y1={50}
        x2={600}
        y2={50}
        stroke={LEISE}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <Beschriftung x={452} y={196} ton="akzent" groesse={12}>
        C läuft klar unter A
      </Beschriftung>
      <Legende
        x={50}
        y={244}
        eintraege={[
          { farbe: MARKE, text: 'A und C fünfteilig, B dreiteilig – daher 5-3-5' },
          { farbe: AKZENT, text: 'B holt selten mehr als 61,8 % von A zurück' },
        ]}
      />
    </FigureSvg>
  )
}

/** Die drei Flat-Formen nebeneinander. */
export function TaElliottFlat() {
  const formen: {
    titel: string
    punkte: [number, number][]
    hinweis: string
  }[] = [
    {
      titel: 'Normale Flat',
      punkte: [
        [0, 30],
        [60, 120],
        [120, 36],
        [176, 126],
      ],
      hinweis: 'B ≈ A, C ≈ A',
    },
    {
      titel: 'Erweiterte Flat',
      punkte: [
        [0, 30],
        [56, 116],
        [116, 14],
        [176, 146],
      ],
      hinweis: 'B über dem Start, C unter A',
    },
    {
      titel: 'Laufende Flat',
      punkte: [
        [0, 30],
        [58, 112],
        [118, 12],
        [176, 88],
      ],
      hinweis: 'B über dem Start, C endet über A',
    },
  ]

  return (
    <FigureSvg id="ta-elliott-flat" viewBox="0 0 640 280">
      {formen.map((form, i) => {
        const dx = 22 + i * 205
        const verschoben = form.punkte.map(
          ([x, y]) => [x + dx, y + 46] as [number, number]
        )
        return (
          <g key={form.titel}>
            <Beschriftung x={dx + 88} y={30} anchor="middle" groesse={13}>
              {form.titel}
            </Beschriftung>
            {/* Höhe des Startpunktes – daran unterscheiden sich die Formen */}
            <line
              x1={dx}
              y1={76}
              x2={dx + 176}
              y2={76}
              stroke={LEISE}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <path
              d={pfad(verschoben)}
              fill="none"
              stroke={i === 0 ? MARKE : AKZENT}
              strokeWidth={2.2}
            />
            {['A', 'B', 'C'].map((text, index) => (
              <WellenMarke
                key={text}
                x={verschoben[index + 1][0]}
                y={verschoben[index + 1][1]}
                text={text}
                radius={9}
                farbe={i === 0 ? MARKE : AKZENT}
              />
            ))}
            <Beschriftung x={dx + 88} y={228} anchor="middle" ton="leise" groesse={12}>
              {form.hinweis}
            </Beschriftung>
          </g>
        )
      })}
      <Beschriftung x={320} y={262} anchor="middle" ton="leise" groesse={12}>
        Alle drei sind 3-3-5: A und B je dreiteilig, C fünfteilig. Die gestrichelte Linie
        ist der Startpunkt von A.
      </Beschriftung>
    </FigureSvg>
  )
}

/** Kontrahierendes, Barrier- und expandierendes Dreieck. */
export function TaElliottDreieck() {
  return (
    <FigureSvg id="ta-elliott-dreieck" viewBox="0 0 640 280">
      {/* Kontrahierend */}
      <Beschriftung x={110} y={30} anchor="middle" groesse={13}>
        Kontrahierend
      </Beschriftung>
      <path
        d={pfad([
          [30, 60],
          [190, 180],
          [50, 96],
          [180, 152],
          [78, 120],
        ])}
        fill="none"
        stroke={MARKE}
        strokeWidth={2}
      />
      <path
        d={pfad([
          [30, 60],
          [110, 118],
        ])}
        fill="none"
        stroke={LEISE}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <path
        d={pfad([
          [190, 180],
          [110, 126],
        ])}
        fill="none"
        stroke={LEISE}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <Beschriftung x={110} y={216} anchor="middle" ton="leise" groesse={12}>
        Beide Begrenzungen laufen aufeinander zu
      </Beschriftung>

      {/* Barrier */}
      <Beschriftung x={320} y={30} anchor="middle" groesse={13}>
        Barrier
      </Beschriftung>
      <path
        d={pfad([
          [245, 60],
          [400, 170],
          [262, 92],
          [398, 168],
          [288, 122],
        ])}
        fill="none"
        stroke={AKZENT}
        strokeWidth={2}
      />
      <path
        d={pfad([
          [400, 172],
          [240, 172],
        ])}
        fill="none"
        stroke={LEISE}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <Beschriftung x={320} y={216} anchor="middle" ton="leise" groesse={12}>
        Die Unterseite bleibt waagerecht
      </Beschriftung>

      {/* Expandierend */}
      <Beschriftung x={530} y={30} anchor="middle" groesse={13}>
        Expandierend
      </Beschriftung>
      <path
        d={pfad([
          [470, 110],
          [520, 148],
          [500, 84],
          [560, 176],
          [530, 60],
        ])}
        fill="none"
        stroke={GEFAHR}
        strokeWidth={2}
      />
      <path
        d={pfad([
          [468, 112],
          [534, 56],
        ])}
        fill="none"
        stroke={LEISE}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <path
        d={pfad([
          [518, 150],
          [564, 180],
        ])}
        fill="none"
        stroke={LEISE}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <Beschriftung x={530} y={216} anchor="middle" ton="leise" groesse={12}>
        Die Schwankung nimmt zu – selten
      </Beschriftung>

      <Beschriftung x={320} y={258} anchor="middle" ton="leise" groesse={12}>
        Jedes Dreieck hat fünf Abschnitte A bis E, und jeder davon ist dreiteilig. Es
        steht fast immer in Welle 4 oder in Welle B.
      </Beschriftung>
    </FigureSvg>
  )
}

/** Doppelte und dreifache Kombination: W-X-Y und W-X-Y-X-Z. */
export function TaElliottKombination() {
  return (
    <FigureSvg id="ta-elliott-kombination" viewBox="0 0 640 300">
      {/* W-X-Y */}
      <Beschriftung x={160} y={30} anchor="middle" groesse={13}>
        Doppelte Korrektur: W-X-Y
      </Beschriftung>
      <path
        d={pfad([
          [36, 56],
          [70, 118],
          [100, 88],
          [128, 132],
          [168, 84],
          [206, 148],
          [240, 116],
          [280, 176],
        ])}
        fill="none"
        stroke={MARKE}
        strokeWidth={2.2}
      />
      <WellenMarke x={128} y={132} text="W" radius={11} />
      <WellenMarke x={168} y={84} text="X" radius={11} farbe={AKZENT} />
      <WellenMarke x={280} y={176} text="Y" radius={11} />
      <Beschriftung x={36} y={216} ton="leise" groesse={12}>
        Zwei Korrekturen, verbunden durch X.
      </Beschriftung>
      <Beschriftung x={36} y={234} ton="leise" groesse={12}>
        Hier: Zickzack – X – Flat.
      </Beschriftung>

      {/* W-X-Y-X-Z */}
      <Beschriftung x={470} y={30} anchor="middle" groesse={13}>
        Dreifache Korrektur: W-X-Y-X-Z
      </Beschriftung>
      <path
        d={pfad([
          [340, 56],
          [368, 106],
          [392, 82],
          [414, 118],
          [446, 78],
          [474, 128],
          [498, 104],
          [520, 142],
          [552, 106],
          [580, 158],
          [604, 136],
          [624, 178],
        ])}
        fill="none"
        stroke={MARKE}
        strokeWidth={2.2}
      />
      <WellenMarke x={414} y={118} text="W" radius={10} />
      <WellenMarke x={446} y={78} text="X" radius={10} farbe={AKZENT} />
      <WellenMarke x={520} y={142} text="Y" radius={10} />
      <WellenMarke x={552} y={106} text="X" radius={10} farbe={AKZENT} />
      <WellenMarke x={624} y={178} text="Z" radius={10} />
      <Beschriftung x={340} y={216} ton="leise" groesse={12}>
        Drei Korrekturen, zwei X-Wellen dazwischen.
      </Beschriftung>
      <Beschriftung x={340} y={234} ton="leise" groesse={12}>
        Mehr als drei sind nicht vorgesehen.
      </Beschriftung>

      <Beschriftung x={320} y={276} anchor="middle" ton="leise" groesse={12}>
        Kombinationen laufen flacher und länger als eine einzelne Korrektur. Sie sind der
        Grund, warum sich fast jede Seitwärtsphase auszählen lässt.
      </Beschriftung>
    </FigureSvg>
  )
}

/**
 * Welche Welle welches Verhältnis anläuft.
 *
 * Die Zahlen sind die in der Literatur üblichen Erwartungswerte, keine
 * gemessenen Häufigkeiten. Sie stehen hier als Beschriftung an der Welle,
 * zu der sie gehören – das ist der ganze Zweck der Grafik: Ein Verhältnis
 * ohne die Welle, auf die es sich bezieht, ist keine Aussage.
 */
export function TaElliottZiele() {
  const punkte: [number, number][] = [
    [50, 240],
    [130, 168],
    [174, 208],
    [330, 76],
    [392, 128],
    [500, 58],
  ]
  /*
    Jede Beschriftung bekommt ihre eigene Höhe und ihren eigenen Anker.

    Der erste Entwurf setzte alle oberen Beschriftungen auf dieselbe Zeile und
    verankerte sie am Anfang. Ergebnis: Die Texte zu Welle 1, 3 und 5 lagen
    übereinander, und der letzte lief über den rechten Rand hinaus. Auffallen
    konnte das keiner Prüfung – der Ankerpunkt lag im Bild, nur das Textende
    nicht. Deshalb hier von Hand: `zeile` staffelt die Höhe, `anker` zieht die
    rechte Beschriftung nach innen.
  */
  const ziele: {
    x: number
    y: number
    text: string
    zeile: number
    anker: 'start' | 'middle' | 'end'
    ankerX: number
  }[] = [
    {
      x: 130,
      y: 168,
      text: 'Welle 1 – kein Verhältnis, sie ist der Maßstab',
      zeile: 26,
      anker: 'start',
      ankerX: 30,
    },
    {
      x: 330,
      y: 76,
      text: 'Welle 3 – 1,618 / 2,618 × Welle 1',
      zeile: 46,
      anker: 'middle',
      ankerX: 330,
    },
    {
      x: 500,
      y: 58,
      text: 'Welle 5 – 0,618 × (Start 1 bis Ende 3)',
      zeile: 26,
      anker: 'end',
      ankerX: 612,
    },
    {
      x: 174,
      y: 208,
      text: 'Welle 2 – 50 / 61,8 / 78,6 % von Welle 1',
      zeile: 278,
      anker: 'start',
      ankerX: 30,
    },
    {
      x: 392,
      y: 128,
      text: 'Welle 4 – 23,6 / 38,2 % von Welle 3',
      zeile: 296,
      anker: 'start',
      ankerX: 330,
    },
  ]

  return (
    <FigureSvg id="ta-elliott-ziele" viewBox="0 0 640 310">
      <path d={pfad(punkte)} fill="none" stroke={MARKE} strokeWidth={2.4} />
      {['1', '2', '3', '4', '5'].map((text, i) => (
        <WellenMarke key={text} x={punkte[i + 1][0]} y={punkte[i + 1][1]} text={text} />
      ))}
      {ziele.map((ziel) => {
        const oben = ziel.zeile < 150
        return (
          <g key={ziel.text}>
            <line
              x1={ziel.x}
              y1={ziel.y + (oben ? -12 : 12)}
              x2={ziel.x}
              y2={oben ? ziel.zeile + 6 : ziel.zeile - 14}
              stroke={LEISE}
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <Beschriftung
              x={ziel.ankerX}
              y={ziel.zeile}
              anchor={ziel.anker}
              ton="leise"
              groesse={11.5}
            >
              {ziel.text}
            </Beschriftung>
          </g>
        )
      })}
    </FigureSvg>
  )
}

/**
 * Der Wechsel: Ist Welle 2 scharf, wird Welle 4 flach – und umgekehrt.
 *
 * Elliotts „Alternation“ ist keine Regel, sondern eine Erwartung. Sie steht
 * hier trotzdem als eigene Grafik, weil sie die einzige Aussage der Theorie
 * ist, die eine Zählung im Voraus einschränkt statt sie nachträglich zu
 * rechtfertigen.
 */
export function TaElliottWechsel() {
  return (
    <FigureSvg id="ta-elliott-wechsel" viewBox="0 0 640 260">
      <path
        d={pfad([
          [50, 210],
          [150, 130],
          [186, 196],
          [340, 70],
          [400, 96],
          [430, 82],
          [460, 100],
          [560, 40],
        ])}
        fill="none"
        stroke={MARKE}
        strokeWidth={2.4}
      />
      <WellenMarke x={150} y={130} text="1" />
      <WellenMarke x={186} y={196} text="2" />
      <WellenMarke x={340} y={70} text="3" />
      <WellenMarke x={460} y={100} text="4" />
      <WellenMarke x={560} y={40} text="5" />

      <rect
        x={150}
        y={116}
        width={44}
        height={96}
        fill={AKZENT}
        fillOpacity={BAND_DECKKRAFT}
      />
      <Beschriftung x={172} y={232} anchor="middle" ton="akzent" groesse={12}>
        scharf und kurz
      </Beschriftung>

      <rect
        x={340}
        y={58}
        width={128}
        height={56}
        fill={MARKE}
        fillOpacity={BAND_DECKKRAFT}
      />
      <Beschriftung x={404} y={134} anchor="middle" groesse={12}>
        flach und lang
      </Beschriftung>

      <Beschriftung x={50} y={252} ton="leise" groesse={12}>
        Ist die eine Korrektur ein steiler Zickzack, wird die andere meist eine Flat oder
        ein Dreieck. Eine Erwartung, keine Regel.
      </Beschriftung>
    </FigureSvg>
  )
}

/** Die neun Wellengrade – dieselbe Form auf jeder Zeitebene. */
export function TaElliottGrade() {
  const gross: [number, number][] = [
    [40, 220],
    [180, 130],
    [250, 178],
    [450, 60],
    [520, 108],
    [600, 46],
  ]
  return (
    <FigureSvg id="ta-elliott-grade" viewBox="0 0 640 280">
      <path d={pfad(gross)} fill="none" stroke={MARKE} strokeWidth={3} />
      {['1', '2', '3', '4', '5'].map((text, i) => (
        <WellenMarke key={text} x={gross[i + 1][0]} y={gross[i + 1][1]} text={text} />
      ))}

      {/* Welle 1 zerfällt selbst in fünf – gezeichnet als Ausschnitt */}
      <rect
        x={36}
        y={116}
        width={150}
        height={110}
        fill="none"
        stroke={AKZENT}
        strokeWidth={1.2}
        strokeDasharray="4 3"
      />
      <path
        d={pfad([
          [44, 214],
          [72, 186],
          [86, 200],
          [128, 152],
          [150, 172],
          [176, 134],
        ])}
        fill="none"
        stroke={AKZENT}
        strokeWidth={1.6}
      />
      <Beschriftung x={44} y={110} ton="akzent" groesse={12}>
        Welle 1, eine Ebene tiefer: wieder fünf Wellen
      </Beschriftung>

      {/* Welle 2 zerfällt in drei */}
      <path
        d={pfad([
          [184, 134],
          [212, 164],
          [228, 148],
          [248, 176],
        ])}
        fill="none"
        stroke={GEFAHR}
        strokeWidth={1.6}
      />
      <Beschriftung x={214} y={206} ton="gefahr" groesse={12}>
        Welle 2: drei
      </Beschriftung>

      <Beschriftung x={40} y={266} ton="leise" groesse={12}>
        Elliott zählte neun Ebenen, vom Grand Supercycle über Jahrhunderte bis zur
        Subminuette über Minuten. Auf jeder gilt dieselbe Form.
      </Beschriftung>
    </FigureSvg>
  )
}
