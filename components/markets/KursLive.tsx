'use client'

import { useEffect, useState } from 'react'

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
 * ## Warum nur bei sichtbarer Seite nachgefragt wird
 *
 * Ein Abruf je Minute über zwanzig offene Tabs hinweg ist Verkehr ohne
 * Gegenwert. `document.hidden` beendet das; beim Zurückkehren wird sofort
 * einmal gefragt, damit niemand auf den nächsten Takt warten muss.
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

interface LiveDatei {
  latest?: Record<string, { value: number; at: string }>
}

/** Wie oft nachgefragt wird, solange die Seite sichtbar ist. */
const TAKT_MS = 60_000

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
  const [kurs, setKurs] = useState({ value, asOf, live: false })

  useEffect(() => {
    let abgebrochen = false

    async function holen() {
      if (document.hidden) return
      try {
        const antwort = await fetch('/kurse-live.json', { cache: 'no-store' })
        if (!antwort.ok) return
        const datei = (await antwort.json()) as LiveDatei
        const eintrag = datei.latest?.[symbol]
        if (abgebrochen || !eintrag) return

        /* Nur übernehmen, was neuer ist. Eine ältere Datei – etwa aus einem
           Zwischenspeicher – darf den gebauten Stand nicht zurückdrehen. */
        if (new Date(eintrag.at) <= new Date(kurs.asOf)) return
        setKurs({ value: eintrag.value, asOf: eintrag.at, live: true })
      } catch {
        /* Kein Netz, keine Datei, kaputtes JSON: Der gebaute Stand bleibt
           stehen. Ein Kurs von vorhin ist besser als eine Fehlermeldung. */
      }
    }

    void holen()
    const takt = window.setInterval(holen, TAKT_MS)
    document.addEventListener('visibilitychange', holen)
    return () => {
      abgebrochen = true
      window.clearInterval(takt)
      document.removeEventListener('visibilitychange', holen)
    }
  }, [symbol, kurs.asOf])

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
          ? `Stand ${formatDateTime(kurs.asOf)}`
          : `Schluss ${formatDate(kurs.asOf)}`}
      </span>
    </>
  )
}
