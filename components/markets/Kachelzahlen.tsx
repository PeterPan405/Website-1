'use client'

import type { ReactNode } from 'react'
import { useSyncExternalStore } from 'react'

import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { formatNumber, formatNumberSigned, formatPercentSigned } from '@/lib/format'
import {
  abonniereKurse,
  juengerer,
  KEINE_KURSE,
  leseKurse,
} from '@/lib/kurse-live-speicher'

/**
 * Der Inhalt einer Kurskachel – gebaut geliefert, im Browser aufgefrischt.
 *
 * ## Warum es diese Komponente gibt
 *
 * Bis zum 10. August 2026 zeigte die Marktübersicht den Kurs aus dem Bau.
 * Zwei Dutzend Kacheln, alle so alt wie die letzte Veröffentlichung. Die
 * Datei `/kurse-live.json` lag daneben auf dem Server und wurde alle fünf
 * Minuten ersetzt – gelesen hat sie nur die Kopfzeile der Instrumentseite.
 *
 * Jetzt liest sie jede Kachel, über einen gemeinsamen Speicher: ein Abruf für
 * die ganze Seite, nicht einer je Kachel.
 *
 * ## Warum die Zeichnung als `children` hereinkommt
 *
 * Der Verlaufsgraph ist reines SVG und wird auf dem Server erzeugt – so soll
 * es bleiben. Er steht auf der Startseite im sichtbaren Bereich; ihn ins
 * Client-Bündel zu ziehen, hieße den Bildaufbau für eine Farbe zu belasten.
 *
 * Seine Farbe folgt trotzdem dem laufenden Kurs: Die Kurve zeichnet in
 * `currentColor`, und diese Komponente setzt die Textfarbe. Damit passen
 * Zahl und Kurve zusammen, ohne dass die Zeichnung selbst in den Browser
 * wandern muss.
 *
 * ## Warum die Veränderung neu gerechnet wird
 *
 * Die Datei kennt nur den letzten Preis. Der Schlusskurs davor ändert sich
 * innerhalb eines Handelstages nicht – er kommt einmal aus dem Bau mit
 * (`basis`), und die Veränderung entsteht hier aus beiden. Sonst stünde neben
 * einem frischen Preis eine Veränderung von vorhin, und beide widersprächen
 * sich sichtbar.
 */
export function Kachelzahlen({
  symbol,
  ticker,
  name,
  decimals,
  unit,
  value,
  basis,
  at,
  children,
}: {
  symbol: string
  ticker: string
  name: string
  decimals: number
  unit: string
  /** Der Preis aus dem Bau – bis der Browser einen neueren kennt. */
  value: number
  /** Der Bezugswert der Veränderung: der Schlusskurs davor. */
  basis: number
  /** Zeitstempel des gebauten Preises. Älteres aus der Datei wird verworfen. */
  at: string
  /** Der Verlaufsgraph, auf dem Server erzeugt. */
  children?: ReactNode
}) {
  const kurse = useSyncExternalStore(abonniereKurse, leseKurse, () => KEINE_KURSE)
  const kurs = juengerer({ value, at }, kurse[symbol])

  const veraenderung = kurs.value - basis
  const prozent = basis === 0 ? 0 : veraenderung / basis
  const positiv = veraenderung >= 0

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        {/*
          `min-h`: Kacheln mit und ohne Namenszeile stehen im selben Raster.
          Ohne festes Maß säße die Kurszahl mal höher, mal tiefer – eine
          Reihe aus vier Kacheln bekäme drei Grundlinien.
        */}
        <div className="min-h-[2.625rem] min-w-0">
          <p className="font-display text-fg text-base font-semibold">{ticker}</p>
          {/*
            Nur, wenn der Name mehr sagt als der Ticker. „S&P 500" unter
            „S&P 500" stand auf einem Drittel der Kacheln doppelt – das las
            sich wie ein Versehen und kostete eine Zeile Platz.
          */}
          {name !== ticker && (
            <p className="text-fg-muted mt-0.5 line-clamp-1 text-xs">{name}</p>
          )}
        </div>
        {/*
          `data-fliesst` an jeder Stelle, die sich mit dem Kurs ändert. Ohne
          diese Kennzeichnung meldet der Referenzbildvergleich jeden
          Kursabruf als Layoutfehler – siehe scripts/referenzbilder.mjs.
        */}
        <span
          className={cn(
            'fk-chip shrink-0',
            positiv ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'
          )}
          data-fliesst=""
        >
          <Icon name={positiv ? 'trending-up' : 'trending-down'} className="size-3.5" />
          {formatPercentSigned(prozent)}
        </span>
      </div>

      <p className="text-fg mt-4 text-2xl font-bold tabular-nums" data-fliesst="">
        {formatNumber(kurs.value, decimals)}
        <span className="text-fg-subtle ml-1.5 text-sm font-medium">{unit}</span>
      </p>

      <p
        className={cn(
          'mt-1 text-sm font-medium tabular-nums',
          positiv ? 'text-success' : 'text-danger'
        )}
        data-fliesst=""
      >
        {formatNumberSigned(veraenderung, decimals)} zum Vortag
      </p>

      {children && (
        <div className={cn('mt-4', positiv ? 'text-success' : 'text-danger')}>
          {children}
        </div>
      )}
    </>
  )
}
