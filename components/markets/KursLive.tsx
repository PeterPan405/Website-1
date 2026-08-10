'use client'

import { useSyncExternalStore } from 'react'

import { Icon } from '@/components/ui/Icon'
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  formatNumberSigned,
  formatPercentSigned,
} from '@/lib/format'
import { cn } from '@/lib/cn'
import {
  abonniereKurse,
  juengerer,
  KEINE_KURSE,
  leseKurse,
} from '@/lib/kurse-live-speicher'

/**
 * Der Kurs in der Kopfzeile – gebaut ausgeliefert, im Browser aufgefrischt.
 *
 * ## Warum nicht einfach zur Laufzeit laden
 *
 * Weil ein Platzhalter schlechter ist als ein alter Kurs. Die Seite kommt
 * vollständig aus dem Bau: mit Preis, Veränderung und Stand. Erst danach
 * fragt der Browser `/kurse-live.json` und ersetzt die Zahlen, wenn dort
 * neuere stehen.
 *
 * Wer kein JavaScript ausführt, sieht den gebauten Stand. Suchmaschinen
 * sehen ihn auch. Niemand sieht ein leeres Feld, und niemand sieht ein
 * Zahlenskelett, das erst eine Sekunde später Werte bekommt.
 *
 * ## Warum die Veränderung gegen `basis` gerechnet wird
 *
 * Die Datei kennt nur den letzten Preis, nicht den Schlusskurs davor. Der
 * ändert sich innerhalb eines Handelstages aber ohnehin nicht – er kommt
 * deshalb einmal aus dem Bau mit (`basis`), und die Veränderung entsteht
 * hier aus beiden. So bleibt die Datei klein und die Rechnung stimmt.
 *
 * Am nächsten Handelstag ist `basis` überholt, bis der nächste Bau läuft.
 * Deshalb baut die Website weiterhin täglich – nur eben zweimal statt
 * sechzehnmal.
 *
 * ## Der Abruf liegt nicht hier
 *
 * Er steht in `lib/kurse-live-speicher.ts` und gilt für die ganze Seite. Bis
 * zum 10. August 2026 holte diese Komponente die Datei selbst – solange sie
 * die einzige Stelle war, die sie las, war das dasselbe. Seit auch jede
 * Kurskachel sie liest, wäre es ein Abruf je Kachel.
 */
interface Props {
  symbol: string
  unit: string
  decimals: number
  /** Der Preis aus dem Bau – bis der Browser einen neueren kennt. */
  value: number
  /** Der Bezugswert der Veränderung: Preis minus Veränderung. */
  basis: number
  asOf: string
  intraday: boolean
  hatQuelle: boolean
  /** Euro je Einheit der Notierungswährung, oder `null`. */
  euroFaktor: number | null
}

export function KursLive({
  symbol,
  unit,
  decimals,
  value,
  basis,
  asOf,
  intraday,
  hatQuelle,
  euroFaktor,
}: Props) {
  const kurse = useSyncExternalStore(abonniereKurse, leseKurse, () => KEINE_KURSE)
  const kurs = juengerer({ value, at: asOf }, kurse[symbol])

  const veraenderung = kurs.value - basis
  const prozent = basis === 0 ? 0 : veraenderung / basis
  const positiv = veraenderung >= 0
  const euro = euroFaktor === null ? null : kurs.value * euroFaktor

  return (
    <>
      <span className="text-fg text-lg font-bold tabular-nums">
        {formatNumber(kurs.value, decimals)} {unit}
      </span>
      {euro !== null && (
        <span className="tabular-nums">
          rund {formatCurrency(euro, euro < 10 ? 2 : 0)}
        </span>
      )}
      <span
        className={cn(
          'flex items-center gap-1 font-semibold tabular-nums',
          positiv ? 'text-success' : 'text-danger'
        )}
      >
        <Icon name={positiv ? 'trending-up' : 'trending-down'} className="size-4" />
        {formatNumberSigned(veraenderung, decimals)} ({formatPercentSigned(prozent)})
      </span>
      <span aria-hidden="true">·</span>
      {/* Ändert sich bei jedem Abruf – siehe scripts/referenzbilder.mjs. */}
      <span data-fliesst="">
        {intraday || !hatQuelle || kurs.live
          ? `Stand ${formatDateTime(kurs.at)}`
          : `Schluss ${formatDate(kurs.at)}`}
      </span>
    </>
  )
}
