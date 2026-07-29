import { Beschriftung, FigureSvg, Legende } from '@/components/content/figures/Rahmen'
import {
  devisenumsatzTag,
  waehrungslebensdauern,
  welthandelJahr,
} from '@/lib/geldsystem-daten'
import { formatNumber } from '@/lib/format'

/**
 * Die Grafiken zum Lernthema Geldsystem.
 *
 * Die Zahlen liegen in `lib/geldsystem-daten.ts` und nicht hier: Sie stehen im
 * Fließtext derselben Seite noch einmal, und eine Grafik, die der Zeile über
 * ihr widerspricht, ist schlimmer als gar keine Grafik.
 */

const markenfarbe = 'var(--c-brand)'
const akzentfarbe = 'var(--c-accent)'
const gefahrfarbe = 'var(--c-danger)'
const rasterfarbe = 'var(--c-border)'

/* ------------------------------------------------ Giralgeld aus Kreditvergabe */

/*
  Die beiden Bausteine stehen ausserhalb der Zeichnung.

  Innerhalb einer Komponente definiert waeren sie bei jedem Rendern neue
  Komponenten – der React-Compiler weist das zurueck, und zwar zu Recht: React
  wuerde den Teilbaum jedes Mal neu aufbauen statt ihn zu aktualisieren.
*/

const GRUND_HOEHE = 34
const KREDIT_HOEHE = 74
const BASIS = 196

/** Ein Bilanzblock: Rechteck mit Beschriftung darin. */
function Block({
  x,
  y,
  breite,
  hoehe,
  farbe,
  deckkraft,
  text,
}: {
  x: number
  y: number
  breite: number
  hoehe: number
  farbe: string
  deckkraft: number
  text: string
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={breite}
        height={hoehe}
        rx={5}
        fill={farbe}
        fillOpacity={deckkraft}
        stroke={farbe}
        strokeOpacity={0.5}
      />
      <text
        x={x + breite / 2}
        y={y + hoehe / 2 + 4}
        textAnchor="middle"
        fontSize={12}
        fill="var(--c-fg)"
      >
        {text}
      </text>
    </g>
  )
}

/** Eine Bilanz aus Aktiv- und Passivseite. */
function Bilanz({
  links,
  breite,
  ueberschrift,
  kredit,
}: {
  links: number
  breite: number
  ueberschrift: string
  kredit: boolean
}) {
  const halb = (breite - 12) / 2
  const hoehe = kredit ? GRUND_HOEHE + KREDIT_HOEHE : GRUND_HOEHE

  return (
    <g>
      <Beschriftung x={links + breite / 2} y={30} anchor="middle" gewicht="kraeftig">
        {ueberschrift}
      </Beschriftung>

      {/* Die Seitenbeschriftung sitzt dicht über dem höchsten Block, nicht
          oben am Bildrand – sonst klafft über der linken Bilanz ein leeres
          Drittel, das wie ein Fehler aussieht. */}
      <Beschriftung
        x={links}
        y={BASIS - GRUND_HOEHE - KREDIT_HOEHE - 10}
        ton="leise"
        groesse={11}
      >
        Aktiva
      </Beschriftung>
      <Beschriftung
        x={links + breite}
        y={BASIS - GRUND_HOEHE - KREDIT_HOEHE - 10}
        anchor="end"
        ton="leise"
        groesse={11}
      >
        Passiva
      </Beschriftung>

      {/* Der Bestand vor der Buchung – auf beiden Seiten gleich hoch. */}
      <Block
        x={links}
        y={BASIS - GRUND_HOEHE}
        breite={halb}
        hoehe={GRUND_HOEHE}
        farbe={rasterfarbe}
        deckkraft={0.55}
        text="Bestand"
      />
      <Block
        x={links + halb + 12}
        y={BASIS - GRUND_HOEHE}
        breite={halb}
        hoehe={GRUND_HOEHE}
        farbe={rasterfarbe}
        deckkraft={0.55}
        text="Bestand"
      />

      {kredit && (
        <>
          <Block
            x={links}
            y={BASIS - hoehe}
            breite={halb}
            hoehe={KREDIT_HOEHE}
            farbe={markenfarbe}
            deckkraft={0.22}
            text="Forderung"
          />
          <Block
            x={links + halb + 12}
            y={BASIS - hoehe}
            breite={halb}
            hoehe={KREDIT_HOEHE}
            farbe={akzentfarbe}
            deckkraft={0.22}
            text="Guthaben"
          />
        </>
      )}

      <line
        x1={links - 6}
        y1={BASIS}
        x2={links + breite + 6}
        y2={BASIS}
        stroke={rasterfarbe}
        strokeWidth={1.5}
      />
    </g>
  )
}

/**
 * Wie aus einem Kredit Geld wird.
 *
 * Zwei Bilanzen nebeneinander, vorher und nachher. Die Aussage steckt nicht in
 * den Zahlen, sondern in der Länge: Beide Seiten wachsen gleichzeitig und um
 * denselben Betrag. Genau das ist der Punkt, den die Vorstellung „die Bank
 * verleiht Spargeld weiter“ nicht erklären kann – dort müsste eine Seite
 * kürzer werden.
 */
export function GeldsystemGiralgeld() {
  return (
    <FigureSvg id="geldsystem-giralgeld" viewBox="0 0 640 264">
      <Bilanz
        links={24}
        breite={232}
        ueberschrift="Vor der Kreditvergabe"
        kredit={false}
      />
      <Bilanz links={384} breite={232} ueberschrift="Nach der Kreditvergabe" kredit />

      {/* Der Pfeil dazwischen – die Buchung selbst. */}
      <line
        x1={286}
        y1={BASIS - 40}
        x2={368}
        y2={BASIS - 40}
        stroke={markenfarbe}
        strokeWidth={2}
      />
      <path d={`M 368 ${BASIS - 40} l -9 -5 l 0 10 z`} fill={markenfarbe} />
      <Beschriftung x={327} y={BASIS - 50} anchor="middle" ton="marke" groesse={12}>
        eine Buchung
      </Beschriftung>

      <Beschriftung x={320} y={230} anchor="middle" groesse={12.5}>
        Beide Seiten wachsen gleichzeitig und um denselben Betrag.
      </Beschriftung>
      <Beschriftung x={320} y={250} anchor="middle" ton="leise" groesse={12}>
        Niemandem wurde etwas weggenommen – das Guthaben gab es vorher nicht.
      </Beschriftung>
    </FigureSvg>
  )
}

/* -------------------------------------------- Lebensdauer von Währungen */

/**
 * Wie lange Währungen tatsächlich gehalten haben.
 *
 * Waagerechte Balken auf einer gemeinsamen Jahresachse. Die Reihenfolge ist
 * die der Dauer, nicht der Chronologie: Die Aussage der Grafik ist der Abstand
 * zwischen zwei Gruppen, und der verschwindet, sobald man nach Jahrhunderten
 * sortiert.
 *
 * Laufende Währungen tragen einen offenen Balken – ein geschlossener würde ein
 * Ende behaupten, das nicht eingetreten ist.
 */
export function GeldsystemLebensdauer() {
  const links = 168
  const rechts = 604
  const oben = 34
  const zeilenhoehe = 21

  const reihen = waehrungslebensdauern
  const maximum = 340
  const striche = [0, 50, 100, 150, 200, 250, 300]

  const x = (jahre: number) => links + (jahre / maximum) * (rechts - links)
  const y = (index: number) => oben + index * zeilenhoehe

  const unten = y(reihen.length - 1) + 18

  return (
    <FigureSvg id="geldsystem-lebensdauer" viewBox="0 0 640 360">
      {striche.map((wert) => (
        <g key={wert}>
          <line
            x1={x(wert)}
            y1={oben - 12}
            x2={x(wert)}
            y2={unten}
            stroke={rasterfarbe}
            strokeWidth={1}
            strokeOpacity={wert === 0 ? 1 : 0.5}
          />
          <text
            x={x(wert)}
            y={unten + 15}
            textAnchor="middle"
            fontSize={11}
            fill="var(--c-fg-subtle)"
          >
            {wert}
          </text>
        </g>
      ))}
      <text
        x={rechts}
        y={unten + 33}
        textAnchor="end"
        fontSize={11}
        fill="var(--c-fg-subtle)"
      >
        Jahre im Umlauf
      </text>

      {reihen.map((reihe, index) => {
        const breite = Math.max(x(reihe.jahre) - links, 2)
        const farbe = reihe.gescheitert ? gefahrfarbe : markenfarbe
        return (
          <g key={reihe.name}>
            <text
              x={links - 10}
              y={y(index) + 4}
              textAnchor="end"
              fontSize={12}
              fill="var(--c-fg)"
            >
              {reihe.name}
            </text>
            <rect
              x={links}
              y={y(index) - 7}
              width={breite}
              height={12}
              rx={2}
              fill={farbe}
              fillOpacity={0.75}
            />
            {/*
              Laufende Währungen bekommen statt einer Kante drei Punkte.
              Ein bündiger Balken hieße: hier war Schluss.
            */}
            {!reihe.gescheitert && (
              <g fill={farbe} fillOpacity={0.75}>
                <circle cx={links + breite + 7} cy={y(index) - 1} r={2} />
                <circle cx={links + breite + 15} cy={y(index) - 1} r={2} />
                <circle cx={links + breite + 23} cy={y(index) - 1} r={2} />
              </g>
            )}
            {reihe.gescheitert && (
              <text
                x={links + breite + 7}
                y={y(index) + 4}
                fontSize={11}
                fill="var(--c-fg-subtle)"
              >
                {formatNumber(reihe.jahre, 0)}
              </text>
            )}
          </g>
        )
      })}

      <Legende
        x={links - 4}
        y={unten + 52}
        eintraege={[
          { farbe: gefahrfarbe, text: 'zusammengebrochen oder ersetzt' },
          { farbe: markenfarbe, text: 'bis heute im Umlauf' },
        ]}
      />
    </FigureSvg>
  )
}

/* ------------------------------------------------ Größe des Devisenmarkts */

/**
 * Devisenumsatz eines Tages gegen den Welthandel eines Jahres.
 *
 * Der Vergleich ist absichtlich schief – ein Tag gegen ein Jahr –, und genau
 * das ist die Aussage. Zwei gleich lange Balken wären hier die ehrlichere
 * Darstellung derselben Zahl und würden nichts erklären.
 */
export function GeldsystemDevisenmarkt() {
  const links = 190
  /*
    Der rechte Rand liegt bei 512, nicht am Bildrand.

    Der laengste Balken ist der Massstab und fuellt die Strecke ganz aus –
    seine Wertangabe steht dahinter und braucht den Rest. Beim ersten Lauf
    stand dort „37,5 B“ und der Rest lag ausserhalb des Bildes.
  */
  const rechts = 512
  const maximum = Math.max(welthandelJahr, devisenumsatzTag * 5)
  const breite = (wert: number) => ((wert / maximum) * (rechts - links)) | 0

  const zeilen = [
    {
      text: 'Devisenmarkt, ein Tag',
      wert: devisenumsatzTag,
      farbe: markenfarbe,
      y: 52,
    },
    {
      text: 'Devisenmarkt, eine Woche',
      wert: devisenumsatzTag * 5,
      farbe: markenfarbe,
      y: 112,
    },
    {
      text: 'Welthandel, ein ganzes Jahr',
      wert: welthandelJahr,
      farbe: akzentfarbe,
      y: 172,
    },
  ]

  return (
    <FigureSvg id="geldsystem-devisenmarkt" viewBox="0 0 640 236">
      {zeilen.map((zeile) => (
        <g key={zeile.text}>
          <text
            x={links - 12}
            y={zeile.y + 5}
            textAnchor="end"
            fontSize={12.5}
            fill="var(--c-fg)"
          >
            {zeile.text}
          </text>
          <rect
            x={links}
            y={zeile.y - 14}
            width={breite(zeile.wert)}
            height={28}
            rx={4}
            fill={zeile.farbe}
            fillOpacity={0.75}
          />
          <text
            x={links + breite(zeile.wert) + 10}
            y={zeile.y + 5}
            fontSize={12.5}
            fill="var(--c-fg-muted)"
          >
            {formatNumber(zeile.wert, 1)} Bio. $
          </text>
        </g>
      ))}

      <Beschriftung x={24} y={214} groesse={12.5}>
        In gut vier Handelstagen wird so viel getauscht wie im Welthandel eines ganzen
        Jahres.
      </Beschriftung>
    </FigureSvg>
  )
}
