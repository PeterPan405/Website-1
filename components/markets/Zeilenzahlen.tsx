'use client'

import { useSyncExternalStore } from 'react'

import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { formatNumber, formatPercentSigned } from '@/lib/format'
import {
  abonniereKurse,
  juengerer,
  KEINE_KURSE,
  leseKurse,
} from '@/lib/kurse-live-speicher'

/**
 * Kurs und Tagesveränderung einer Aktienzeile – gebaut geliefert, im Browser
 * aufgefrischt.
 *
 * ## Warum es diese Komponente gibt
 *
 * Sie ist der Nachzügler zu `Kachelzahlen`, und ihr Fehlen war derselbe Fehler
 * eine Ebene tiefer. Am 10. August 2026 bekam die Marktübersicht ihre Kacheln
 * an den gemeinsamen Kursspeicher gehängt; die über tausend **Zeilen**
 * darunter blieben, wie sie waren. Sie zeigten weiter die Zahl aus dem Bau.
 *
 * Aufgefallen ist es am selben Abend, und wieder dem Betreiber: Amazon stand
 * um 20:12 deutscher Zeit auf dem Kurs von 19:05. Der Kurs in
 * `/kurse-live.json` war zu dem Zeitpunkt zwei Minuten alt – gelesen hat ihn
 * an dieser Stelle nur niemand.
 *
 * **Die Regel dazu steht in AGENTS.md und galt schon vorher:** Wer eine Stelle
 * baut, die einen Kurs zeigt, hängt sie an `lib/kurse-live-speicher.ts`. Es
 * gibt keine Kurse zweiter Klasse.
 *
 * ## Warum die Veränderung neu gerechnet wird
 *
 * Dieselbe Überlegung wie bei der Kachel: `/kurse-live.json` kennt nur den
 * letzten Preis. Der Schlusskurs davor ändert sich innerhalb eines
 * Handelstages nicht und kommt einmal aus dem Bau mit. Stünde die gebaute
 * Prozentzahl neben einem frischen Preis, widersprächen sich beide sichtbar.
 */
export function Zeilenzahlen({
  symbol,
  decimals,
  value,
  basis,
  at,
}: {
  symbol: string
  decimals: number
  /** Der Preis aus dem Bau – bis der Browser einen neueren kennt. */
  value: number
  /** Der Bezugswert der Veränderung: der Schlusskurs davor. */
  basis: number
  /** Zeitstempel des gebauten Preises. Älteres aus der Datei wird verworfen. */
  at: string
}) {
  const kurse = useSyncExternalStore(abonniereKurse, leseKurse, () => KEINE_KURSE)
  const kurs = juengerer({ value, at }, kurse[symbol])

  const veraenderung = kurs.value - basis
  const prozent = basis === 0 ? 0 : veraenderung / basis
  const positiv = veraenderung >= 0

  return (
    <>
      <span className="text-fg shrink-0 text-sm tabular-nums">
        {formatNumber(kurs.value, decimals)}
      </span>
      {/*
        `w-24` und `whitespace-nowrap`, nicht `w-20`.

        Bei zweistelligen Prozentzahlen brach „+19,50 %“ hinter dem Pfeil um,
        und die Zeile wurde doppelt so hoch – bei einem Dutzend Titeln
        nebeneinander sah die Liste aus, als sei sie kaputt. Aufgefallen ist es
        an einem Tag, an dem der ganze Halbleiterbereich zweistellig zulegte:
        Auf der Marktübersicht steht eine solche Zahl selten, auf einer
        Branchenseite stehen an so einem Tag vierzig davon untereinander.
      */}
      <span
        className={cn(
          'flex w-24 shrink-0 items-center justify-end gap-0.5 text-sm font-medium whitespace-nowrap tabular-nums',
          positiv ? 'text-success' : 'text-danger'
        )}
      >
        <Icon
          name={positiv ? 'trending-up' : 'trending-down'}
          className="size-3.5"
          aria-hidden="true"
        />
        {formatPercentSigned(prozent)}
      </span>
    </>
  )
}
