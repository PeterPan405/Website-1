'use client'

import { useEffect, useRef, useState } from 'react'
import {
  AreaSeries,
  ColorType,
  CrosshairMode,
  LineStyle,
  createChart,
  type IChartApi,
  type Time,
} from 'lightweight-charts'

import type { SeriesPoint } from '@/data/markets'

/**
 * Kursverlauf mit TradingView Lightweight Charts.
 *
 * ## Warum nicht mehr Recharts
 *
 * Betreiber, 26.10.2026: Die Website solle „nicht mehr nach dem klassischen
 * 0815-Vibe-Coding aussehen", und dazu passende GitHub-Anwendungen suchen.
 * Das Recharts-Flächendiagramm mit Verlauf war genau das Diagramm, das jede
 * generierte Seite hat. Lightweight Charts (github.com/tradingview/
 * lightweight-charts, Apache-2.0) ist die Bibliothek hinter den Charts von
 * TradingView: Preisskala rechts mit Marke am letzten Kurs, Fadenkreuz mit
 * Wert und Datum an den Achsen, Zoom und Verschieben – so, wie Anleger
 * Kurse von ihrem Broker kennen.
 *
 * Kerzen gibt es nicht: Der Bestand führt je Tag einen Schlusskurs, kein
 * Eröffnung–Hoch–Tief–Schluss. Eine Kerze ohne diese vier Werte wäre erfunden.
 *
 * ## Farben
 *
 * Das Diagramm zeichnet auf eine Leinwand, und eine Leinwand kennt keine
 * CSS-Variablen. Gelesen werden sie deshalb einmal beim Aufbau aus dem
 * Dokument – der Umschalter für das Farbschema lädt die Seite neu
 * (`lib/theme.ts`), also stimmen sie danach.
 *
 * ## Das Logo unten links
 *
 * Bleibt an: Die Lizenz verlangt einen Hinweis auf TradingView, und das Logo
 * ist der Weg, den die Bibliothek dafür vorsieht (`attributionLogo`).
 */
/**
 * Eine Farbe mit Deckkraft – für die Fläche unter der Linie. Die Leinwand
 * versteht `color-mix` nicht überall, `rgba` überall.
 */
function durchscheinend(farbe: string, deckkraft: number): string {
  const hex = /^#([0-9a-f]{6})$/i.exec(farbe)?.[1]
  if (!hex) return farbe
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return `rgba(${r}, ${g}, ${b}, ${deckkraft})`
}

export function PriceArea({
  points,
  color,
  formatValue,
  formatTooltipLabel,
  height = 340,
}: {
  points: readonly SeriesPoint[]
  /** CSS-Variable oder Farbwert für Linie und Fläche. */
  color: string
  formatValue: (value: number) => string
  /** Bleibt in der Schnittstelle – die Zeitachse beschriftet die Bibliothek selbst. */
  formatAxisLabel?: (iso: string) => string
  formatTooltipLabel: (iso: string) => string
  height?: number
  /** Nicht mehr nötig – blieb von Recharts, damit `PriceChart` unverändert bleibt. */
  gradientId?: string
}) {
  const behaelter = useRef<HTMLDivElement>(null)
  const diagramm = useRef<IChartApi | null>(null)
  const [zeiger, setZeiger] = useState<{ tag: string; wert: number } | null>(null)

  /*
    Je Tag ein Punkt, aufsteigend: Die Bibliothek bricht bei doppelten oder
    ungeordneten Zeiten ab. Der Bestand hängt den laufenden Kurs an die
    Tagesreihe – fällt er auf denselben Tag, gilt der spätere Wert.
  */
  const daten = (() => {
    const jeTag = new Map<string, number>()
    for (const p of points) jeTag.set(p.t.slice(0, 10), p.value)
    return [...jeTag.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([tag, value]) => ({ time: tag as Time, value }))
  })()

  useEffect(() => {
    const ort = behaelter.current
    if (!ort) return
    const stil = getComputedStyle(document.documentElement)
    const farbe = (wert: string) => {
      const name = /^var\((--[^)]+)\)$/.exec(wert.trim())?.[1]
      return name ? stil.getPropertyValue(name).trim() : wert
    }
    const linie = farbe(color)
    const schrift = getComputedStyle(ort).fontFamily

    const chart = createChart(ort, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: farbe('var(--c-fg-subtle)'),
        fontFamily: schrift,
        fontSize: 12,
        attributionLogo: true,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: farbe('var(--c-border)'), style: LineStyle.Solid },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.12, bottom: 0.08 },
      },
      timeScale: { borderVisible: false, fixLeftEdge: true, fixRightEdge: true },
      crosshair: {
        mode: CrosshairMode.Magnet,
        vertLine: {
          color: farbe('var(--c-border-strong)'),
          labelBackgroundColor: farbe('var(--c-fg)'),
        },
        horzLine: {
          color: farbe('var(--c-border-strong)'),
          labelBackgroundColor: farbe('var(--c-fg)'),
        },
      },
      localization: {
        locale: 'de-DE',
        priceFormatter: formatValue,
        timeFormatter: (zeit: Time) => formatTooltipLabel(String(zeit)),
      },
      // Auf dem Telefon soll die Seite scrollen, nicht das Diagramm.
      handleScroll: { vertTouchDrag: false },
    })

    const reihe = chart.addSeries(AreaSeries, {
      lineColor: linie,
      lineWidth: 2,
      topColor: durchscheinend(linie, 0.22),
      bottomColor: durchscheinend(linie, 0),
      priceLineVisible: false,
      lastValueVisible: true,
    })
    reihe.setData(daten)
    chart.timeScale().fitContent()

    chart.subscribeCrosshairMove((ereignis) => {
      const punkt = ereignis.seriesData.get(reihe) as { value?: number } | undefined
      if (!ereignis.time || punkt?.value === undefined) setZeiger(null)
      else setZeiger({ tag: String(ereignis.time), wert: punkt.value })
    })

    diagramm.current = chart
    return () => {
      chart.remove()
      diagramm.current = null
    }
    // `daten` ändert sich mit `points`; die Formatierer hängen am Instrument.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, color])

  const letzter = daten.at(-1)
  const anzeige =
    zeiger ?? (letzter ? { tag: String(letzter.time), wert: letzter.value } : null)

  return (
    /* Zeichnet Kurse – vor dem Einfrieren abgedeckt, siehe Sparkline.tsx. */
    <div className="relative w-full" style={{ height }} data-fliesst="">
      {anzeige && (
        <p
          className="text-fg-muted pointer-events-none absolute top-1 left-1 z-10 text-sm tabular-nums"
          aria-live="polite"
        >
          <span className="text-fg font-semibold">{formatValue(anzeige.wert)}</span>
          <span className="ml-2">{formatTooltipLabel(anzeige.tag)}</span>
        </p>
      )}
      <div ref={behaelter} className="h-full w-full" />
    </div>
  )
}
