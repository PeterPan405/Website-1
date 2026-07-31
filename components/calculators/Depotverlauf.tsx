'use client'

import { useEffect, useMemo, useState } from 'react'

import { Callout } from '@/components/ui/Callout'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { simuliere, type Kurspunkt, type Position } from '@/lib/depot-simulation'
import {
  formatCurrency,
  formatDateShort,
  formatPercent,
  formatPercentSigned,
} from '@/lib/format'
import { leseKursCsv } from '@/lib/normierung'

/**
 * Was aus der eingetragenen Zusammenstellung historisch geworden wäre.
 *
 * ## Warum das unter der Aufteilung steht und nicht darüber
 *
 * Weil es die Frage danach ist. Oben beantwortet die Analyse „wie ist das
 * gebaut“ – Branchen, Länder, Währungen, Konzentration. Hier steht, wie sich
 * dieselbe Zusammenstellung angefühlt hätte, und das ist eine andere Auskunft:
 * Zwei Depots mit identischer Streuung können durch völlig verschiedene Jahre
 * gegangen sein.
 *
 * ## Warum der Rückschlag genauso groß gesetzt ist wie der Endwert
 *
 * Weil Anlagepläne nicht an der Endrendite scheitern. Sie scheitern an dem
 * Moment, in dem das Depot dreißig Prozent unter Wasser steht und niemand
 * weiß, ob es weitergeht. Der Endwert allein erzählt diese Geschichte nicht –
 * er sieht danach aus, als wäre es eine gerade Linie gewesen.
 *
 * Neben der Tiefe steht deshalb die Dauer bis zur Erholung. Ein Rückschlag von
 * dreißig Prozent ist auszuhalten, wenn er nach acht Monaten aufgeholt ist,
 * und etwas ganz anderes, wenn er nach vier Jahren noch steht.
 */

const BREITE = 680
const HOEHE = 200
const RAND_OBEN = 8
const RAND_UNTEN = 20

export function Depotverlauf({
  positionen,
  namen,
}: {
  /** Symbol und Anteil in Prozent – aus der Analyse darüber. */
  positionen: Position[]
  /** Symbol → Anzeigename, für die Gewichtstabelle. */
  namen: ReadonlyMap<string, string>
}) {
  const symbole = useMemo(
    () =>
      [...new Set(positionen.filter((p) => p.anteil > 0).map((p) => p.symbol))].sort(),
    [positionen]
  )
  const kennung = symbole.join(',')

  /*
    Reihen und Fehler in einem Zustand, dazu die Kennung, zu der beides gehört.
    Der Grund steht ausführlich in `Sparplanverlauf.tsx`: Zwei getrennte
    Zustände bräuchten ein Zurücksetzen zu Beginn des Effekts, und genau das
    beanstandet React zu Recht.
  */
  const [stand, setzeStand] = useState<{
    fuer: string
    reihen?: Map<string, Kurspunkt[]>
    fehlend?: string[]
  } | null>(null)

  useEffect(() => {
    if (symbole.length === 0) return
    let abgebrochen = false

    Promise.all(
      symbole.map(async (symbol) => {
        try {
          const antwort = await fetch(`/maerkte/${symbol}/kurse.csv`)
          if (!antwort.ok) return [symbol, null] as const
          const punkte = leseKursCsv(await antwort.text()).map((p) => ({
            d: p.t.slice(0, 10),
            c: p.value,
          }))
          return [symbol, punkte] as const
        } catch {
          return [symbol, null] as const
        }
      })
    ).then((ergebnisse) => {
      if (abgebrochen) return
      const reihen = new Map<string, Kurspunkt[]>()
      const fehlend: string[] = []
      for (const [symbol, punkte] of ergebnisse) {
        if (punkte && punkte.length > 1) reihen.set(symbol, punkte)
        else fehlend.push(symbol)
      }
      setzeStand({ fuer: kennung, reihen, fehlend })
    })

    return () => {
      abgebrochen = true
    }
    /*
      `kennung` statt `symbole`: Das Feld entsteht bei jedem Rendern neu, die
      Zeichenkette daraus nicht. Ohne sie liefe der Abruf bei jedem Tastendruck
      im Betragsfeld erneut.
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kennung])

  const passt = stand?.fuer === kennung
  const reihen = passt ? stand?.reihen : undefined

  /*
    Der Einsatz ist bewusst fest: 10.000 Euro. Was jemand tatsächlich
    eingesetzt hat, steht oben als Summe – hier geht es um die Entwicklung, und
    die ist von der Höhe unabhängig. Ein zweites Eingabefeld für eine Zahl,
    die das Ergebnis nur linear streckt, wäre eine Bedienung ohne Auskunft.
  */
  const ergebnis = useMemo(
    () => (reihen ? simuliere(reihen, positionen, 10_000) : null),
    [reihen, positionen]
  )

  if (symbole.length === 0) return null

  if (!passt) {
    return <p className="text-fg-muted text-sm">Kursreihen werden geladen …</p>
  }

  if (!ergebnis) {
    return (
      <Callout variant="info" title="Kein gemeinsamer Zeitraum">
        <p>
          Für diese Zusammenstellung gibt es keinen Zeitraum, in dem alle Positionen
          gleichzeitig einen Kurs haben. Gerechnet wird nur über solche Tage – sonst
          stünde hier eine Rendite, in der eine Position zeitweise gefehlt hat.
        </p>
      </Callout>
    )
  }

  const werte = ergebnis.verlauf.map((p) => p.wert)
  const min = Math.min(...werte)
  const max = Math.max(...werte)
  const spanne = max - min || 1
  const x = (i: number) =>
    ergebnis.verlauf.length <= 1 ? 0 : (i / (ergebnis.verlauf.length - 1)) * BREITE
  const y = (wert: number) =>
    RAND_OBEN + (1 - (wert - min) / spanne) * (HOEHE - RAND_OBEN - RAND_UNTEN)
  const pfad = ergebnis.verlauf
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(p.wert).toFixed(1)}`)
    .join(' ')

  const gewachsen = ergebnis.endwert >= ergebnis.einsatz

  return (
    <div>
      <p className="text-fg-muted leading-relaxed">
        Gerechnet an den tatsächlichen Schlusskursen vom{' '}
        {formatDateShort(ergebnis.vonTag)} bis zum {formatDateShort(ergebnis.bisTag)}, mit
        einem Einsatz von {formatCurrency(ergebnis.einsatz, 0)} in der oben eingetragenen
        Gewichtung.{' '}
        <strong className="text-fg font-medium">
          Einmal gekauft, nicht umgeschichtet
        </strong>{' '}
        – die Gewichte verschieben sich dadurch über die Zeit.
      </p>

      {stand?.fehlend && stand.fehlend.length > 0 && (
        <Callout
          variant="warning"
          title="Nicht alle Positionen sind enthalten"
          className="mt-5"
        >
          <p>
            Für {stand.fehlend.map((s) => namen.get(s) ?? s).join(', ')} liegt keine
            abgerufene Kursreihe vor. Die Rechnung darunter lässt{' '}
            {stand.fehlend.length === 1 ? 'diese Position' : 'diese Positionen'} aus und
            verteilt den Einsatz auf den Rest.
          </p>
        </Callout>
      )}

      <StatGrid className="mt-6">
        <Stat
          label="Aus 10.000 €"
          value={formatCurrency(ergebnis.endwert, 0)}
          hint={`${formatPercentSigned(ergebnis.gesamtProzent)} über den ganzen Zeitraum.`}
        />
        {ergebnis.jahresProzent !== null && (
          <Stat
            label="Im Jahr"
            value={formatPercentSigned(ergebnis.jahresProzent)}
            hint="Mittlere jährliche Veränderung – nicht die Rendite eines einzelnen Jahres."
          />
        )}
        {ergebnis.groesster && (
          <>
            <Stat
              label="Größter Rückschlag"
              value={formatPercentSigned(ergebnis.groesster.prozent)}
              hint={`Vom ${formatDateShort(ergebnis.groesster.vonTag)} bis zum ${formatDateShort(ergebnis.groesster.bisTag)}.`}
            />
            <Stat
              label="Wieder aufgeholt"
              value={
                ergebnis.groesster.erholtAm
                  ? formatDateShort(ergebnis.groesster.erholtAm)
                  : 'noch nicht'
              }
              hint={
                ergebnis.groesster.erholtAm
                  ? 'Tag, an dem der alte Höchststand wieder erreicht war.'
                  : 'Der Stand von damals wurde bis zum Ende des Zeitraums nicht wieder erreicht.'
              }
            />
          </>
        )}
      </StatGrid>

      <figure className="mt-8">
        <svg
          viewBox={`0 0 ${BREITE} ${HOEHE}`}
          className="h-auto w-full"
          role="img"
          aria-label={`Wertverlauf des Depots von ${formatCurrency(ergebnis.einsatz, 0)} am ${formatDateShort(ergebnis.vonTag)} auf ${formatCurrency(ergebnis.endwert, 0)} am ${formatDateShort(ergebnis.bisTag)}${ergebnis.groesster ? `, mit einem größten Rückschlag von ${formatPercent(Math.abs(ergebnis.groesster.prozent), 1)}` : ''}.`}
        >
          <line
            x1={0}
            x2={BREITE}
            y1={y(ergebnis.einsatz)}
            y2={y(ergebnis.einsatz)}
            stroke="var(--color-border-strong)"
            strokeDasharray="4 4"
            strokeWidth={1}
          />
          <text
            x={4}
            y={y(ergebnis.einsatz) - 5}
            className="fill-fg-subtle"
            style={{ fontSize: 11 }}
          >
            Einsatz {formatCurrency(ergebnis.einsatz, 0)}
          </text>
          <path
            d={pfad}
            fill="none"
            stroke={gewachsen ? 'var(--color-success)' : 'var(--color-danger)'}
            strokeWidth={2}
          />
        </svg>
        <figcaption className="text-fg-subtle mt-3 text-sm leading-relaxed">
          Die gestrichelte Linie ist der Einsatz. Ohne Dividenden, ohne Kosten, ohne
          Steuern – und über einen Zeitraum, der so lang ist wie die kürzeste beteiligte
          Kursreihe.
        </figcaption>
      </figure>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[26rem] text-sm">
          <caption className="text-fg-subtle py-2 text-left">
            Wie sich die Gewichte ohne Umschichten verschoben haben
          </caption>
          <thead>
            <tr className="border-border border-b">
              <th scope="col" className="text-fg-subtle py-2.5 text-left font-medium">
                Position
              </th>
              <th scope="col" className="text-fg-subtle py-2.5 text-right font-medium">
                am Anfang
              </th>
              <th scope="col" className="text-fg-subtle py-2.5 text-right font-medium">
                am Ende
              </th>
            </tr>
          </thead>
          <tbody>
            {ergebnis.startgewichte.map((start, i) => (
              <tr key={start.symbol} className="border-border border-b">
                <th scope="row" className="text-fg py-2.5 text-left font-medium">
                  {namen.get(start.symbol) ?? start.symbol}
                </th>
                <td className="text-fg-muted py-2.5 text-right tabular-nums">
                  {formatPercent(start.prozent, 1)}
                </td>
                <td className="text-fg py-2.5 text-right font-medium tabular-nums">
                  {formatPercent(ergebnis.endgewichte[i]?.prozent ?? 0, 1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout variant="warning" title="Was dieser Rückblick nicht sagt" className="mt-8">
        <ul className="space-y-2">
          <li>
            <strong>Er ist ein Rückblick.</strong> Dieselbe Zusammenstellung durch andere
            Jahre geschickt ergibt andere Zahlen. Der größte Rückschlag von{' '}
            {ergebnis.groesster
              ? formatPercent(Math.abs(ergebnis.groesster.prozent), 1)
              : 'null'}{' '}
            ist der größte <em>dieses</em> Zeitraums – nicht der größte, der möglich ist.
          </li>
          <li>
            <strong>Ohne Dividenden.</strong> Die Kursreihen sind Kursreihen. Bei Titeln
            mit hoher Ausschüttung fehlen über den Zeitraum entsprechend viele
            Prozentpunkte. Ohne Kosten und Steuern gilt dasselbe.
          </li>
          <li>
            <strong>Der Zeitraum ist kurz.</strong> Die gespeicherten Reihen reichen fünf
            Jahre zurück, und der gemeinsame Zeitraum ist so lang wie die kürzeste
            beteiligte Reihe. Für eine Aussage über Anlagezeiträume von Jahrzehnten ist
            das wenig.
          </li>
        </ul>
      </Callout>
    </div>
  )
}
