import type { ReactNode } from 'react'

import { Beschriftung, FigureSvg, Legende } from '@/components/content/figures/Rahmen'
import {
  linienpfad,
  skaliereX,
  skaliereY,
  teilstriche,
  type Plotflaeche,
} from '@/lib/figure-geometry'
import type { FigureId } from '@/data/figures'

/**
 * Wiederverwendbare Diagrammformen für die Lerngrafiken.
 *
 * ## Warum es diese Datei gibt
 *
 * Die ersten zehn Grafiken sind jede für sich gezeichnet worden – Achse,
 * Raster, Beschriftung, Nulllinie, jedes Mal von Hand. Das ging, solange es
 * zehn waren. Für die übrigen Lernthemen kommen rund vierzig dazu, und
 * vierzigmal dieselbe Achse abzuschreiben heißt: vierzig Gelegenheiten, sie
 * einmal um zwei Pixel zu verschieben oder einen Teilstrich zu vergessen.
 *
 * Hier stehen deshalb die vier Formen, die sich wiederholen – Säulen, Balken,
 * Linien und eine Kette aus Kästen. Was nicht in dieses Raster passt, wird
 * weiterhin einzeln gezeichnet; ein Baukasten, der alles kann, kann nichts
 * mehr gut.
 *
 * ## Was diese Bausteine *nicht* tun
 *
 * Sie rechnen nicht. Jede Zahl kommt fertig herein, aus `lib/` – aus derselben
 * Funktion, aus der auch die Tabelle daneben entsteht. Eine Grafik, die ihre
 * Werte selbst ausrechnet, ist eine zweite Quelle für dieselbe Aussage, und
 * die geht irgendwann von der ersten ab.
 */

export const FARBEN = {
  marke: 'var(--c-brand)',
  akzent: 'var(--c-accent)',
  gefahr: 'var(--c-danger)',
  warnung: 'var(--c-warning)',
  ruhig: 'var(--c-fg-subtle)',
  raster: 'var(--c-border)',
  flaeche: 'var(--c-surface-muted)',
} as const

export type Farbe = string

// ------------------------------------------------------------------ Säulen

export interface Saeule {
  /** Beschriftung unter der Säule. Kurz halten – der Platz ist die Säulenbreite. */
  label: string
  /**
   * Die Abschnitte von unten nach oben.
   *
   * Eine einfache Säule hat genau einen Abschnitt. Gestapelt wird nur, wo der
   * Stapel etwas aussagt – „davon eingezahlt“ etwa. Ein Stapel aus Dingen, die
   * nichts miteinander zu tun haben, ist eine Säule, die man nicht ablesen
   * kann.
   */
  teile: { wert: number; farbe: Farbe }[]
  /** Steht über der Säule, meist der formatierte Gesamtwert. */
  wertText?: string
  /** Zweite, kleinere Zeile unter dem Label. */
  hinweis?: string
}

/**
 * Säulendiagramm mit gemeinsamer Werteachse.
 *
 * Die Achse beginnt immer bei null. Ein abgeschnittener Nullpunkt macht aus
 * einem Unterschied von drei Prozent optisch einen von dreißig – das ist die
 * häufigste Art, mit einer korrekten Zahl zu lügen, und auf einer Seite, die
 * genau davor warnt, hat sie nichts zu suchen.
 */
export function SaeulenDiagramm({
  id,
  saeulen,
  einheit,
  legende,
  beschreibung,
  hoehe = 280,
}: {
  id: FigureId
  saeulen: readonly Saeule[]
  /** Steht klein über der Werteachse, etwa „Euro“ oder „Prozent“. */
  einheit?: string
  legende?: readonly { farbe: Farbe; text: string }[]
  beschreibung?: string
  hoehe?: number
}) {
  /*
    Die Einheit bekommt eine eigene Zeile über der Zeichenfläche.

    Sie stand vorher dicht über der Achse, und das ging so lange gut, bis eine
    Säule die Achse voll ausfüllte: Dann sitzt ihre Beschriftung auf derselben
    Höhe wie die Einheit, und bei „Euro Darlehen“ neben „213.814 €“ liegen die
    beiden übereinander. Bei den gestapelten Säulen, die alle gleich hoch sind,
    ist das nicht der Ausnahmefall, sondern die Regel.
  */
  const obenFrei = legende ? 64 : 40
  const untenFrei = saeulen.some((s) => s.hinweis) ? 46 : 28
  const flaeche: Plotflaeche = {
    links: 66,
    oben: obenFrei,
    breite: 552,
    hoehe: hoehe - obenFrei - untenFrei,
  }
  const unten = flaeche.oben + flaeche.hoehe
  const rechts = flaeche.links + flaeche.breite

  const summe = (s: Saeule) => s.teile.reduce((a, t) => a + t.wert, 0)
  const striche = teilstriche(Math.max(...saeulen.map(summe)), 4)
  const maximum = striche[striche.length - 1]

  /*
    Die Säulenbreite folgt der Anzahl, nicht einem festen Wert.

    Bei drei Säulen sähen 40 Pixel verloren aus, bei zehn überlappten sie
    einander. Ein Fünftel Abstand hat sich als das Maß erwiesen, bei dem
    beides noch geht.
  */
  const fach = flaeche.breite / saeulen.length
  const breite = Math.min(fach * 0.62, 96)

  return (
    <FigureSvg id={id} viewBox={`0 0 640 ${hoehe}`} beschreibung={beschreibung}>
      {einheit && (
        <Beschriftung x={flaeche.links - 2} y={obenFrei - 24} ton="leise" groesse={12}>
          {einheit}
        </Beschriftung>
      )}
      {legende && <Legende x={flaeche.links} y={18} eintraege={legende} />}

      {striche.map((wert) => {
        const y = skaliereY(wert, 0, maximum, flaeche)
        return (
          <g key={wert}>
            <line
              x1={flaeche.links}
              y1={y}
              x2={rechts}
              y2={y}
              stroke={FARBEN.raster}
              strokeWidth={1}
            />
            <Beschriftung x={flaeche.links - 10} y={y + 4} anchor="end" ton="leise">
              {achsenwert(wert, maximum)}
            </Beschriftung>
          </g>
        )
      })}

      {saeulen.map((saeule, index) => {
        const mitte = flaeche.links + fach * (index + 0.5)
        const x = mitte - breite / 2
        let gestapelt = 0

        return (
          <g key={saeule.label}>
            {saeule.teile.map((teil, teilIndex) => {
              const y = skaliereY(gestapelt + teil.wert, 0, maximum, flaeche)
              const yUnten = skaliereY(gestapelt, 0, maximum, flaeche)
              gestapelt += teil.wert
              return (
                <rect
                  key={teilIndex}
                  x={x}
                  y={y}
                  width={breite}
                  height={Math.max(yUnten - y, 0)}
                  fill={teil.farbe}
                  /* Nur die oberste Kante wird gerundet – runde Ecken mitten
                     im Stapel sähen aus wie eine Lücke. */
                  rx={teilIndex === saeule.teile.length - 1 ? 4 : 0}
                />
              )
            })}

            {saeule.wertText && (
              <Beschriftung
                x={mitte}
                y={skaliereY(summe(saeule), 0, maximum, flaeche) - 8}
                anchor="middle"
                ton="stark"
                gewicht="kraeftig"
              >
                {saeule.wertText}
              </Beschriftung>
            )}

            <Beschriftung x={mitte} y={unten + 18} anchor="middle" ton="gedaempft">
              {saeule.label}
            </Beschriftung>
            {saeule.hinweis && (
              <Beschriftung
                x={mitte}
                y={unten + 34}
                anchor="middle"
                ton="leise"
                groesse={12}
              >
                {saeule.hinweis}
              </Beschriftung>
            )}
          </g>
        )
      })}

      <line
        x1={flaeche.links}
        y1={unten}
        x2={rechts}
        y2={unten}
        stroke={FARBEN.raster}
        strokeWidth={1.5}
      />
    </FigureSvg>
  )
}

// ------------------------------------------------------------------ Balken

export interface Balken {
  label: string
  wert: number
  /** Was am Balkenende steht. Ohne Angabe der Wert mit der Einheit. */
  wertText?: string
  farbe?: Farbe
}

/**
 * Liegende Balken – für Rangfolgen und lange Beschriftungen.
 *
 * Der Unterschied zur Säule ist keine Geschmacksfrage: „Vereinigte Staaten“
 * passt nicht unter eine Säule, neben einen Balken schon. Alles, was mehr als
 * ein Wort Beschriftung braucht, gehört hierher.
 */
export function BalkenDiagramm({
  id,
  balken,
  beschreibung,
  labelBreite = 150,
}: {
  id: FigureId
  balken: readonly Balken[]
  beschreibung?: string
  labelBreite?: number
}) {
  const zeilenhoehe = 34
  const oben = 16
  const hoehe = oben + balken.length * zeilenhoehe + 12
  const links = labelBreite + 12
  const breiteMax = 640 - links - 78
  const maximum = Math.max(...balken.map((b) => b.wert))

  return (
    <FigureSvg id={id} viewBox={`0 0 640 ${hoehe}`} beschreibung={beschreibung}>
      {balken.map((eintrag, index) => {
        const y = oben + index * zeilenhoehe
        const breite = maximum > 0 ? (eintrag.wert / maximum) * breiteMax : 0
        return (
          <g key={eintrag.label}>
            <Beschriftung x={labelBreite} y={y + 17} anchor="end" ton="gedaempft">
              {eintrag.label}
            </Beschriftung>
            <rect
              x={links}
              y={y + 4}
              width={Math.max(breite, 2)}
              height={20}
              rx={4}
              fill={eintrag.farbe ?? FARBEN.marke}
            />
            <Beschriftung
              x={links + Math.max(breite, 2) + 8}
              y={y + 19}
              ton="stark"
              gewicht="kraeftig"
              groesse={12}
            >
              {eintrag.wertText ?? String(eintrag.wert)}
            </Beschriftung>
          </g>
        )
      })}
    </FigureSvg>
  )
}

// ------------------------------------------------------------------ Linien

export interface Reihe {
  name: string
  farbe: Farbe
  punkte: readonly { x: number; y: number }[]
  /** Gestrichelt für alles, was nicht gemessen, sondern gerechnet ist. */
  gestrichelt?: boolean
  /** Beschriftung am rechten Ende der Linie statt in der Legende. */
  endText?: string
}

/**
 * Liniendiagramm mit gemeinsamer x- und y-Achse.
 *
 * Die y-Achse beginnt bei null, sofern nicht ausdrücklich anders angegeben.
 * Ein von null abgeschnittener Verlauf ist bei Kursen üblich und hier trotzdem
 * die Ausnahme: Er übertreibt jede Bewegung.
 */
export function LinienDiagramm({
  id,
  reihen,
  xVon,
  xBis,
  xTeilstriche,
  xLabel,
  yEinheit,
  yMinimum = 0,
  yFormat,
  nulllinie = false,
  beschreibung,
  hoehe = 280,
  rechterRand = 22,
}: {
  id: FigureId
  reihen: readonly Reihe[]
  xVon: number
  xBis: number
  /** Welche x-Werte einen Teilstrich bekommen, mit ihrer Beschriftung. */
  xTeilstriche: readonly { wert: number; text: string }[]
  xLabel?: string
  yEinheit?: string
  yMinimum?: number
  yFormat?: (wert: number) => string
  /**
   * Hebt die Null hervor.
   *
   * Nötig, sobald die Achse ins Negative reicht: Bei einem Auszahlungsprofil
   * ist die Null keine Rasterlinie unter vielen, sondern die Grenze zwischen
   * Gewinn und Verlust. Ohne Hervorhebung muss man sie suchen.
   */
  nulllinie?: boolean
  beschreibung?: string
  hoehe?: number
  /** Platz rechts für Endbeschriftungen an den Linien. */
  rechterRand?: number
}) {
  const oben = 26
  /*
    Unter der Zeichenfläche liegen drei Zeilen übereinander: die Teilstriche
    der x-Achse, die Legende und – falls vorhanden – die Achsenbeschriftung.

    Bis eben war dafür Platz für zwei eingeplant. Die Legende landete deshalb
    auf den Teilstrichen: Bei „etf-index-fassungen“ stand das Farbfeld des
    ersten Eintrags mitten in „Start“, bei „5 J.“ und „10 J.“ lief der
    Legendentext quer durch die Zahlen. Sichtbar war das auf jeder
    Liniengrafik der Seite.
  */
  const unten = xLabel ? 68 : 52
  const flaeche: Plotflaeche = {
    links: 66,
    oben,
    breite: 640 - 66 - rechterRand,
    hoehe: hoehe - oben - unten,
  }
  const grundlinie = flaeche.oben + flaeche.hoehe
  const rechts = flaeche.links + flaeche.breite

  const hoechster = Math.max(...reihen.flatMap((r) => r.punkte.map((p) => p.y)))
  const striche = teilstriche(hoechster - yMinimum, 4).map((s) => s + yMinimum)
  const maximum = striche[striche.length - 1]

  const abbilden = (punkt: { x: number; y: number }) => ({
    x: skaliereX(punkt.x, xVon, xBis, flaeche),
    y: skaliereY(punkt.y, yMinimum, maximum, flaeche),
  })

  return (
    <FigureSvg id={id} viewBox={`0 0 640 ${hoehe}`} beschreibung={beschreibung}>
      {yEinheit && (
        <Beschriftung x={flaeche.links - 2} y={13} ton="leise" groesse={12}>
          {yEinheit}
        </Beschriftung>
      )}

      {striche.map((wert) => {
        const y = skaliereY(wert, yMinimum, maximum, flaeche)
        return (
          <g key={wert}>
            <line
              x1={flaeche.links}
              y1={y}
              x2={rechts}
              y2={y}
              stroke={FARBEN.raster}
              strokeWidth={1}
            />
            <Beschriftung x={flaeche.links - 10} y={y + 4} anchor="end" ton="leise">
              {yFormat ? yFormat(wert) : achsenwert(wert, maximum)}
            </Beschriftung>
          </g>
        )
      })}

      {nulllinie && yMinimum < 0 && (
        <line
          x1={flaeche.links}
          y1={skaliereY(0, yMinimum, maximum, flaeche)}
          x2={rechts}
          y2={skaliereY(0, yMinimum, maximum, flaeche)}
          stroke="var(--c-fg-subtle)"
          strokeWidth={1.5}
        />
      )}

      {xTeilstriche.map((strich) => (
        <Beschriftung
          key={strich.wert}
          x={skaliereX(strich.wert, xVon, xBis, flaeche)}
          y={grundlinie + 20}
          anchor="middle"
          ton="leise"
        >
          {strich.text}
        </Beschriftung>
      ))}
      {xLabel && (
        <Beschriftung
          x={flaeche.links + flaeche.breite / 2}
          y={hoehe - 8}
          anchor="middle"
          ton="leise"
          groesse={12}
        >
          {xLabel}
        </Beschriftung>
      )}

      {reihen.map((reihe) => {
        const punkte = reihe.punkte.map(abbilden)
        const letzter = punkte[punkte.length - 1]
        return (
          <g key={reihe.name}>
            <path
              d={linienpfad(punkte)}
              fill="none"
              stroke={reihe.farbe}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={reihe.gestrichelt ? '6 5' : undefined}
            />
            {reihe.endText && letzter && (
              <Beschriftung
                x={letzter.x - 4}
                y={letzter.y - 10}
                anchor="end"
                ton="stark"
                gewicht="kraeftig"
                groesse={12}
              >
                {reihe.endText}
              </Beschriftung>
            )}
          </g>
        )
      })}

      <Legende
        x={flaeche.links}
        y={hoehe - (xLabel ? 30 : 14)}
        eintraege={reihen.map((r) => ({ farbe: r.farbe, text: r.name }))}
      />
      {/* Die Legende steht bewusst unter den Teilstrichen und nicht über der
          Zeichenfläche: Oben sitzt bei den meisten Liniengrafiken bereits die
          Einheit, und zwei Zeilen Vorspann vor dem eigentlichen Bild sind eine
          zu viel. */}
    </FigureSvg>
  )
}

// ------------------------------------------------------------------- Ablauf

export interface Station {
  titel: string
  /** Eine Zeile Erklärung unter dem Titel. Zwei Zeilen sind zu viel. */
  text?: string
  farbe?: Farbe
}

/**
 * Eine Kette aus Kästen mit Pfeilen dazwischen.
 *
 * Für alles, was ein Weg ist statt einer Menge: die Order vom Klick bis zur
 * Ausführung, eine Zahlung durch die Blockchain, ein Kredit von der Auszahlung
 * bis zur letzten Rate. Ein Balkendiagramm kann das nicht darstellen, ein
 * Fließtext kann es, aber langsamer.
 */
export function AblaufKette({
  id,
  stationen,
  beschreibung,
  hoehe = 150,
}: {
  id: FigureId
  stationen: readonly Station[]
  beschreibung?: string
  hoehe?: number
}) {
  const rand = 10
  const pfeil = 26
  const gesamt = 640 - rand * 2
  const breite = (gesamt - pfeil * (stationen.length - 1)) / stationen.length
  const kastenHoehe = hoehe - 40
  const oben = 20

  return (
    <FigureSvg id={id} viewBox={`0 0 640 ${hoehe}`} beschreibung={beschreibung}>
      {stationen.map((station, index) => {
        const x = rand + index * (breite + pfeil)
        const farbe = station.farbe ?? FARBEN.marke
        return (
          <g key={station.titel}>
            <rect
              x={x}
              y={oben}
              width={breite}
              height={kastenHoehe}
              rx={8}
              fill="var(--c-surface-muted)"
              stroke={farbe}
              strokeWidth={1.5}
            />
            <Beschriftung
              x={x + breite / 2}
              y={oben + 26}
              anchor="middle"
              ton="stark"
              gewicht="kraeftig"
            >
              {station.titel}
            </Beschriftung>
            {station.text && (
              <UmbrochenerText
                x={x + breite / 2}
                y={oben + 48}
                breite={breite - 16}
                text={station.text}
              />
            )}

            {index < stationen.length - 1 && (
              <g>
                <line
                  x1={x + breite + 6}
                  y1={oben + kastenHoehe / 2}
                  x2={x + breite + pfeil - 9}
                  y2={oben + kastenHoehe / 2}
                  stroke={FARBEN.ruhig}
                  strokeWidth={1.5}
                />
                <path
                  d={`M${x + breite + pfeil - 6} ${oben + kastenHoehe / 2} l-7 -4.5 v9 Z`}
                  fill={FARBEN.ruhig}
                />
              </g>
            )}
          </g>
        )
      })}
    </FigureSvg>
  )
}

/**
 * Text über mehrere Zeilen.
 *
 * SVG bricht nicht um: Ein `<text>`, das nicht passt, läuft aus dem Bild
 * heraus und wird abgeschnitten. Da beim statischen Bauen kein Browser
 * mitläuft, der Buchstaben ausmessen könnte, wird die Breite geschätzt –
 * 6,3 Pixel je Zeichen bei 12,5 Pixel Schriftgröße, gemessen an der
 * Seitenschrift.
 */
export function UmbrochenerText({
  x,
  y,
  breite,
  text,
  groesse = 12.5,
  ton = 'gedaempft',
  anchor = 'middle',
}: {
  x: number
  y: number
  breite: number
  text: string
  groesse?: number
  ton?: 'stark' | 'gedaempft' | 'leise'
  anchor?: 'start' | 'middle' | 'end'
}) {
  const proZeichen = groesse * 0.504
  const maxZeichen = Math.max(Math.floor(breite / proZeichen), 8)
  const zeilen: string[] = []
  let aktuell = ''

  for (const wort of text.split(' ')) {
    const versuch = aktuell ? `${aktuell} ${wort}` : wort
    if (versuch.length > maxZeichen && aktuell) {
      zeilen.push(aktuell)
      aktuell = wort
    } else {
      aktuell = versuch
    }
  }
  if (aktuell) zeilen.push(aktuell)

  return (
    <>
      {zeilen.map((zeile, index) => (
        <Beschriftung
          key={index}
          x={x}
          y={y + index * (groesse + 4)}
          anchor={anchor}
          ton={ton}
          groesse={groesse}
        >
          {zeile}
        </Beschriftung>
      ))}
    </>
  )
}

/**
 * Achsenbeschriftung mit passender Genauigkeit.
 *
 * Bis 20 mit einer Nachkommastelle, darüber ganzzahlig mit Tausenderpunkt.
 * Ohne diese Unterscheidung stünde an einer Prozentachse „0“, „0“, „1“, „1“ –
 * viermal dieselbe Zahl, weil 0,5 gerundet wird.
 *
 * Bei einem Maximum von zwei oder weniger reicht auch eine Nachkommastelle
 * nicht: Die Achse teilt in Vierteln, und aus 0,25 wurde damit „0,3“. Eine
 * Achse, an der eine andere Zahl steht, als die Linie bedeutet, ist schlimmer
 * als eine ohne Beschriftung.
 */
function achsenwert(wert: number, maximum: number): string {
  if (maximum <= 2 && !Number.isInteger(wert)) {
    return wert.toLocaleString('de-DE', { maximumFractionDigits: 2 })
  }
  if (maximum <= 20 && !Number.isInteger(wert)) {
    return wert.toLocaleString('de-DE', { maximumFractionDigits: 1 })
  }
  return Math.round(wert).toLocaleString('de-DE')
}

/** Ein Kasten mit Überschrift – Baustein für Gegenüberstellungen. */
export function Feld({
  x,
  y,
  breite,
  hoehe,
  farbe = FARBEN.marke,
  gefuellt = false,
  children,
}: {
  x: number
  y: number
  breite: number
  hoehe: number
  farbe?: Farbe
  gefuellt?: boolean
  children?: ReactNode
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={breite}
        height={hoehe}
        rx={8}
        fill={gefuellt ? farbe : 'var(--c-surface-muted)'}
        stroke={farbe}
        strokeWidth={1.5}
      />
      {children}
    </g>
  )
}
