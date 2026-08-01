import { cn } from '@/lib/cn'
import type { Dividendenjahre } from '@/lib/dividenden'
import { formatNumber, formatPercent } from '@/lib/format'

/**
 * Die Dividende je Kalenderjahr als Balken.
 *
 * ## Warum als SVG und nicht mit einer Diagrammbibliothek
 *
 * Diese Grafik steht auf über tausend Aktienseiten. Ein Diagramm aus einer
 * Bibliothek wäre eine Client-Komponente: JavaScript, das auf jeder dieser
 * Seiten geladen und ausgeführt werden müsste, um sechs Rechtecke zu zeichnen.
 * Die Daten stehen zur Bauzeit fest und ändern sich beim Betrachten nicht –
 * also wird das SVG mitgebaut und kostet danach nichts mehr.
 *
 * Farben kommen als CSS-Variablen. Damit folgt die Grafik dem Hell- und
 * Dunkelmodus, ohne neu gezeichnet zu werden.
 *
 * ## Warum das laufende Jahr anders aussieht
 *
 * Weil es noch nicht fertig ist. Ein Quartalszahler hat Ende Juli zwei von
 * vier Zahlungen geleistet; der Balken ist deshalb zwangsläufig kürzer als
 * seine Nachbarn. Fiele er nicht sichtbar aus der Reihe, läse ihn jeder als
 * halbierte Dividende. Er steht deshalb nur umrissen da und trägt „läuft“.
 */

/*
  Feste Zeichenfläche, veränderliche Spaltenbreite – nicht umgekehrt.

  Mit einer festen Spaltenbreite hinge das Seitenverhältnis an der Zahl der
  Jahre: Vier Balken ergäben ein fast quadratisches Bild, das der Browser bei
  voller Breite auf Hüfthöhe streckt. So bleibt das Verhältnis gleich, und die
  Grafik füllt ihre Spalte, ohne dass eine feste Höhe sie zusammendrückt.
*/
/** Breite der Zeichenfläche in Nutzerkoordinaten. */
const BREITE = 560
/** Höhe der Zeichenfläche in Nutzerkoordinaten. */
const HOEHE = 168
/** Platz unter den Balken für die Jahreszahlen. */
const ACHSE = 26
/** Platz über den Balken für die Beträge. */
const KOPF = 22
/** So breit wird ein Balken höchstens – sonst werden aus zwei Jahren Klötze. */
const BALKEN_MAX = 84

export function Dividendenverlauf({
  verlauf,
  einheit,
  className,
}: {
  verlauf: Dividendenjahre
  /** Die Einheit der Beträge – dieselbe wie beim Kurs. */
  einheit: string
  className?: string
}) {
  const { jahre, wachstumProzent } = verlauf
  if (jahre.length < 2) return null

  const spalte = BREITE / jahre.length
  const balkenBreite = Math.min(spalte * 0.6, BALKEN_MAX)
  const hoechster = Math.max(...jahre.map((eintrag) => eintrag.summe))
  // Ein Nenner von null gäbe NaN in jedem Attribut und damit ein leeres Bild.
  const skala = hoechster > 0 ? (HOEHE - ACHSE - KOPF) / hoechster : 0

  /*
    Die Beträge tragen so viele Nachkommastellen, wie sie brauchen. Bei einem
    britischen Titel in Pence sind das null, bei Allianz in Euro zwei – feste
    zwei Stellen schrieben „6,00 Pence“, wo 6 gemeint ist.
  */
  const stellen = hoechster >= 100 ? 0 : hoechster >= 10 ? 1 : 2

  const beschreibung = jahre
    .map(
      (eintrag) =>
        `${eintrag.jahr}${eintrag.laufend ? ' (läuft noch)' : ''}: ` +
        `${formatNumber(eintrag.summe, stellen)} ${einheit}`
    )
    .join('; ')

  return (
    <figure className={cn('m-0', className)}>
      {/*
        Waagerecht scrollbar, nicht gestaucht: Sechs Balken auf einem
        Telefonbildschirm wären sonst je 40 Pixel breit, und die Jahreszahlen
        überlappten. Lieber schieben als unlesbar.
      */}
      <div className="relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${BREITE} ${HOEHE}`}
          role="img"
          aria-label={`Dividende je Jahr – ${beschreibung}`}
          className="w-full min-w-[340px]"
        >
          {/* Die Grundlinie, auf der die Balken stehen. */}
          <line
            x1={0}
            y1={HOEHE - ACHSE}
            x2={BREITE}
            y2={HOEHE - ACHSE}
            stroke="var(--c-border)"
            strokeWidth={1}
          />

          {jahre.map((eintrag, i) => {
            const balken = Math.max(eintrag.summe * skala, eintrag.summe > 0 ? 2 : 0)
            const w = balkenBreite
            const x = i * spalte + (spalte - w) / 2
            const y = HOEHE - ACHSE - balken

            return (
              <g key={eintrag.jahr}>
                {eintrag.summe > 0 && (
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={balken}
                    rx={3}
                    /*
                      Das laufende Jahr nur umrissen: Es ist ein Zwischenstand,
                      und ein voll gefüllter Balken behauptete ein Ergebnis.
                    */
                    fill={eintrag.laufend ? 'transparent' : 'var(--c-markets)'}
                    stroke="var(--c-markets)"
                    strokeWidth={eintrag.laufend ? 1.5 : 0}
                    strokeDasharray={eintrag.laufend ? '3 2' : undefined}
                  />
                )}

                <text
                  x={x + w / 2}
                  y={y - 7}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={600}
                  fill="var(--c-fg)"
                >
                  {formatNumber(eintrag.summe, stellen)}
                </text>

                <text
                  x={x + w / 2}
                  y={HOEHE - ACHSE + 15}
                  textAnchor="middle"
                  fontSize={12}
                  fill="var(--c-fg-subtle)"
                >
                  {eintrag.jahr}
                </text>
                {eintrag.laufend && (
                  <text
                    x={x + w / 2}
                    y={HOEHE - ACHSE + 25}
                    textAnchor="middle"
                    fontSize={9}
                    fill="var(--c-fg-subtle)"
                  >
                    läuft
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      <figcaption className="text-fg-subtle mt-3 text-xs leading-relaxed">
        Summe je Kalenderjahr in {einheit}, je Aktie und brutto.
        {wachstumProzent !== null && (
          <>
            {' '}
            Über die abgeschlossenen Jahre entspricht das im Mittel{' '}
            <strong className="text-fg font-semibold">
              {wachstumProzent >= 0 ? '+' : ''}
              {formatPercent(wachstumProzent)}
            </strong>{' '}
            im Jahr. Das ist ein Rückblick, keine Zusage: Eine Dividende wird beschlossen,
            nicht fortgeschrieben.
          </>
        )}{' '}
        Das laufende Jahr steht gestrichelt, weil es noch nicht abgeschlossen ist.
        {jahre.some((eintrag) => !eintrag.laufend && eintrag.summe === 0) && (
          <> Ein Jahr ohne Balken heißt: In diesem Jahr wurde nichts gezahlt.</>
        )}
      </figcaption>
    </figure>
  )
}
