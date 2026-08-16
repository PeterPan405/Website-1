'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { Icon } from '@/components/ui/Icon'
import { marketKindMeta, type MarketKind } from '@/data/markets'
import { cn } from '@/lib/cn'
import {
  formatDateShort,
  formatNumber,
  formatPercent,
  formatPercentSigned,
} from '@/lib/format'
import {
  sortiereSpanne,
  type SpannenSortierung,
  type Spannenwert,
} from '@/lib/jahresspanne'

/**
 * Alle Werte nach ihrer Lage in der Zwölfmonatsspanne, sortierbar.
 *
 * Sortierung und Filterung laufen im Browser; die Zeilen stehen vollständig im
 * HTML, damit die Seite ohne JavaScript lesbar bleibt und Suchmaschinen sie
 * sehen. Eine echte `<table>` mit `<th scope>`, keine Gitter aus `<div>`.
 *
 * ## Warum der Balken bei „Position“ liegt und nicht beim Abstand
 *
 * Ein Balken sagt „so viel von einem Ganzen“. Bei der Position stimmt das: Die
 * Spanne von Tief bis Hoch **ist** ein Ganzes, und der Kurs steht irgendwo
 * darin. Beim Abstand zum Hoch gäbe es kein Ganzes – 40 % unter dem Hoch wäre
 * ein Balken, dessen Bezugsgröße der schlechteste Wert der gerade sichtbaren
 * Auswahl ist. Der Balken änderte sich dann beim Filtern, ohne dass sich eine
 * Zahl geändert hat.
 */

type Richtung = 'asc' | 'desc'

const spalten: {
  key: SpannenSortierung
  label: string
  /** Kurzform für schmale Bildschirme. */
  kurz: string
  zahl: boolean
  /** Wonach beim ersten Klick sortiert wird. */
  standard: Richtung
}[] = [
  { key: 'name', label: 'Wert', kurz: 'Wert', zahl: false, standard: 'asc' },
  {
    key: 'abstandHoch',
    label: 'Abstand zum Hoch',
    kurz: 'Zum Hoch',
    zahl: true,
    standard: 'desc',
  },
  {
    key: 'abstandTief',
    label: 'Abstand zum Tief',
    kurz: 'Zum Tief',
    zahl: true,
    standard: 'desc',
  },
  {
    key: 'position',
    label: 'Position in der Spanne',
    kurz: 'Position',
    zahl: true,
    standard: 'desc',
  },
]

export function Jahresspannentafel({
  werte,
  className,
}: {
  werte: readonly Spannenwert[]
  className?: string
}) {
  const [nach, setNach] = useState<SpannenSortierung>('abstandHoch')
  const [richtung, setRichtung] = useState<Richtung>('desc')
  const [arten, setArten] = useState<Set<MarketKind>>(new Set())
  const [suche, setSuche] = useState('')

  /** Die Arten, die im Bestand tatsächlich vorkommen – in fester Reihenfolge. */
  const vorhandeneArten = useMemo(() => {
    const reihenfolge: MarketKind[] = [
      'index',
      'stock',
      'etf',
      'commodity',
      'crypto',
      'fx',
    ]
    const da = new Set(werte.map((w) => w.kind))
    return reihenfolge.filter((art) => da.has(art))
  }, [werte])

  const sichtbar = useMemo(() => {
    const begriff = suche.trim().toLowerCase()

    const gefiltert = werte.filter((wert) => {
      const artPasst = arten.size === 0 || arten.has(wert.kind)
      const begriffPasst =
        begriff === '' ||
        wert.name.toLowerCase().includes(begriff) ||
        wert.ticker.toLowerCase().includes(begriff)
      return artPasst && begriffPasst
    })

    return sortiereSpanne(gefiltert, nach, richtung)
  }, [werte, arten, suche, nach, richtung])

  function umschalten(key: SpannenSortierung) {
    if (key === nach) {
      setRichtung((jetzt) => (jetzt === 'asc' ? 'desc' : 'asc'))
      return
    }
    setNach(key)
    setRichtung(spalten.find((s) => s.key === key)?.standard ?? 'desc')
  }

  function artUmschalten(art: MarketKind) {
    setArten((jetzt) => {
      const neu = new Set(jetzt)
      if (neu.has(art)) neu.delete(art)
      else neu.add(art)
      return neu
    })
  }

  return (
    <div className={cn(className)}>
      {/* ---------------------------------------------------------- Filter */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-[14rem] flex-1">
          <label
            htmlFor="spanne-suche"
            className="text-fg-subtle text-xs font-semibold tracking-wide uppercase"
          >
            Suchen
          </label>
          <input
            id="spanne-suche"
            type="search"
            value={suche}
            onChange={(event) => setSuche(event.target.value)}
            placeholder="Name oder Kürzel"
            className="border-border bg-surface text-fg mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>

        <fieldset className="flex-1">
          <legend className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
            Art
          </legend>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {vorhandeneArten.map((art) => {
              const aktiv = arten.has(art)
              return (
                <button
                  key={art}
                  type="button"
                  onClick={() => artUmschalten(art)}
                  aria-pressed={aktiv}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs transition',
                    aktiv
                      ? 'border-accent bg-accent/10 text-fg'
                      : 'border-border text-fg-muted hover:text-fg'
                  )}
                >
                  {marketKindMeta[art].plural}
                </button>
              )
            })}
            {arten.size > 0 && (
              <button
                type="button"
                onClick={() => setArten(new Set())}
                className="fk-btn-ghost px-3 py-1 text-xs"
              >
                Filter zurücksetzen
              </button>
            )}
          </div>
        </fieldset>
      </div>

      {/* ---------------------------------------------------------- Tabelle */}
      <div className="rounded-card border-border mt-6 overflow-hidden border">
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-sm">
            <caption className="border-border bg-surface-muted text-fg-muted border-b px-4 py-3 text-left text-xs">
              {sichtbar.length === werte.length
                ? `Alle ${werte.length} Werte.`
                : `${sichtbar.length} von ${werte.length} Werten.`}{' '}
              Auf die Spaltenköpfe klicken, um zu sortieren. Ein Strich bei „Position“
              heißt, dass Hoch und Tief zusammenfallen – dann gibt es keine Spanne, in der
              etwas liegen könnte.
            </caption>
            <thead className="bg-surface-muted">
              <tr>
                {spalten.map((spalte) => {
                  const aktiv = spalte.key === nach
                  return (
                    <th
                      key={spalte.key}
                      scope="col"
                      // Screenreader kündigen die aktive Sortierrichtung an.
                      aria-sort={
                        aktiv ? (richtung === 'asc' ? 'ascending' : 'descending') : 'none'
                      }
                      className={cn(
                        'px-4 py-2.5',
                        spalte.zahl ? 'text-right' : 'text-left'
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => umschalten(spalte.key)}
                        className={cn(
                          'inline-flex items-center gap-1 text-xs font-semibold tracking-wide uppercase transition',
                          aktiv ? 'text-fg' : 'text-fg-subtle hover:text-fg'
                        )}
                      >
                        <span className="hidden sm:inline">{spalte.label}</span>
                        <span className="sm:hidden">{spalte.kurz}</span>
                        <Icon
                          name="chevron-down"
                          className={cn(
                            'size-3.5 transition',
                            aktiv ? 'opacity-100' : 'opacity-30',
                            aktiv && richtung === 'asc' && 'rotate-180'
                          )}
                        />
                      </button>
                    </th>
                  )
                })}
                <th scope="col" className="px-4 py-2.5 text-right">
                  <span className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
                    <span className="hidden sm:inline">Tief / Hoch</span>
                    <span className="sm:hidden">Spanne</span>
                  </span>
                </th>
                {/*
                  Der Stand gehört an die Zeile, nicht über die Seite.

                  Diese Tabelle zeigt Werte aus verschiedenen Quellen mit
                  verschiedenen Abrufzeiten nebeneinander. Eine Angabe für die
                  ganze Seite wäre für die meisten Zeilen falsch – und zwar in
                  beide Richtungen.
                */}
                <th scope="col" className="px-4 py-2.5 text-right">
                  <span className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
                    Stand
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sichtbar.map((wert) => (
                <tr key={wert.symbol} className="border-border border-t">
                  <th scope="row" className="px-4 py-2.5 text-left font-medium">
                    <Link href={`/maerkte/${wert.symbol}`} className="hover:text-accent">
                      {wert.name}
                    </Link>
                    <span className="text-fg-subtle ml-2 text-xs">
                      {marketKindMeta[wert.kind].short}
                    </span>
                  </th>
                  <td
                    className={cn(
                      'px-4 py-2.5 text-right tabular-nums',
                      wert.abstandHoch < -0.05 ? 'text-fg' : 'text-fg-muted'
                    )}
                  >
                    {formatPercentSigned(wert.abstandHoch, 1)}
                  </td>
                  <td className="text-fg-muted px-4 py-2.5 text-right tabular-nums">
                    {formatPercentSigned(wert.abstandTief, 1)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {wert.position === null ? (
                      <span
                        className="text-fg-subtle"
                        title="Hoch und Tief fallen zusammen"
                      >
                        –
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-end gap-2">
                        <span
                          aria-hidden
                          className="bg-surface-muted relative hidden h-1.5 w-16 overflow-hidden rounded-full sm:block"
                        >
                          <span
                            className="bg-accent absolute inset-y-0 left-0 rounded-full"
                            style={{ width: `${Math.max(2, wert.position)}%` }}
                          />
                        </span>
                        {formatPercent(wert.position, 0)}
                      </span>
                    )}
                  </td>
                  <td className="text-fg-muted px-4 py-2.5 text-right text-xs tabular-nums">
                    {formatNumber(wert.low52w, wert.decimals)} –{' '}
                    {formatNumber(wert.high52w, wert.decimals)}
                  </td>
                  <td className="text-fg-subtle px-4 py-2.5 text-right text-xs tabular-nums">
                    {wert.source ? (
                      formatDateShort(wert.asOf.slice(0, 10))
                    ) : (
                      <span title="Rechnerisch erzeugter Demo-Kurs, keine echten Marktdaten">
                        Demo
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sichtbar.length === 0 && (
        <p className="text-fg-muted mt-4 text-sm">
          Kein Wert passt zu dieser Auswahl. Suchbegriff kürzen oder den Artfilter
          zurücksetzen.
        </p>
      )}
    </div>
  )
}
