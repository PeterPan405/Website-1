'use client'

import { useMemo, useState } from 'react'

import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import type { CountryDebt, DebtRegion, DebtSortKey } from '@/lib/debt'
import { formatBillionsEur, formatCurrencyRounded, formatPercent } from '@/lib/format'

/**
 * Interaktiver Ländervergleich zur Staatsverschuldung.
 *
 * Sortierung und Filterung laufen vollständig im Browser – der Datensatz ist
 * klein genug, dass sich Nachladen nicht lohnt. Die Tabelle bleibt dabei eine
 * echte HTML-Tabelle mit `<th scope>`, damit Screenreader Zeilen und Spalten
 * zuordnen können; die Balken sind rein dekorativ.
 */

type SortDirection = 'asc' | 'desc'

const columns: {
  key: DebtSortKey
  label: string
  /** Kurzform für schmale Bildschirme. */
  shortLabel: string
  numeric: boolean
  defaultDirection: SortDirection
}[] = [
  {
    key: 'name',
    label: 'Land',
    shortLabel: 'Land',
    numeric: false,
    defaultDirection: 'asc',
  },
  {
    key: 'debtToGdpPercent',
    label: 'Schulden in % des BIP',
    shortLabel: '% des BIP',
    numeric: true,
    defaultDirection: 'desc',
  },
  {
    key: 'debtBillionsEur',
    label: 'Schulden absolut',
    shortLabel: 'Absolut',
    numeric: true,
    defaultDirection: 'desc',
  },
  {
    key: 'debtPerCapitaEur',
    label: 'Schulden pro Kopf',
    shortLabel: 'Pro Kopf',
    numeric: true,
    defaultDirection: 'desc',
  },
]

export function DebtComparison({
  countries,
  regions,
}: {
  countries: CountryDebt[]
  regions: DebtRegion[]
}) {
  const [sortKey, setSortKey] = useState<DebtSortKey>('debtToGdpPercent')
  const [direction, setDirection] = useState<SortDirection>('desc')
  const [activeRegions, setActiveRegions] = useState<Set<DebtRegion>>(new Set())
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    const filtered = countries.filter((country) => {
      const regionMatch = activeRegions.size === 0 || activeRegions.has(country.region)
      const queryMatch =
        normalizedQuery === '' || country.name.toLowerCase().includes(normalizedQuery)
      return regionMatch && queryMatch
    })

    return [...filtered].sort((a, b) => {
      const factor = direction === 'asc' ? 1 : -1
      if (sortKey === 'name') {
        // Locale-bewusster Vergleich, damit Umlaute richtig einsortiert werden.
        return a.name.localeCompare(b.name, 'de-DE') * factor
      }
      return (a[sortKey] - b[sortKey]) * factor
    })
  }, [countries, activeRegions, query, sortKey, direction])

  /** Größter Wert der aktiven Spalte – Bezugsgröße für die Balkenbreite. */
  const maxValue = useMemo(() => {
    const key = sortKey === 'name' ? 'debtToGdpPercent' : sortKey
    return Math.max(...visible.map((country) => country[key]), 1)
  }, [visible, sortKey])

  const barKey: Exclude<DebtSortKey, 'name'> =
    sortKey === 'name' ? 'debtToGdpPercent' : sortKey

  function toggleSort(key: DebtSortKey) {
    if (key === sortKey) {
      setDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortKey(key)
    setDirection(columns.find((column) => column.key === key)?.defaultDirection ?? 'desc')
  }

  function toggleRegion(region: DebtRegion) {
    setActiveRegions((current) => {
      const next = new Set(current)
      if (next.has(region)) next.delete(region)
      else next.add(region)
      return next
    })
  }

  function formatColumnValue(country: CountryDebt, key: DebtSortKey): string {
    switch (key) {
      case 'debtToGdpPercent':
        return formatPercent(country.debtToGdpPercent, 0)
      case 'debtBillionsEur':
        return formatBillionsEur(country.debtBillionsEur)
      case 'debtPerCapitaEur':
        return formatCurrencyRounded(country.debtPerCapitaEur)
      case 'name':
        return country.name
    }
  }

  return (
    <div>
      {/* ------------------------------------------------------- Steuerung */}
      <div className="fk-card p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div>
            <label htmlFor="debt-search" className="text-fg block text-sm font-medium">
              Land suchen
            </label>
            <input
              id="debt-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="z. B. Japan"
              className="fk-input mt-1.5"
            />
          </div>
          <p className="text-fg-muted text-sm">
            <strong className="text-fg font-semibold tabular-nums">
              {visible.length}
            </strong>{' '}
            von {countries.length} Ländern sichtbar
          </p>
        </div>

        <fieldset className="border-border mt-5 border-t pt-5">
          <legend className="text-fg text-sm font-medium">Nach Region filtern</legend>
          <p className="text-fg-subtle mt-1 text-xs">
            Ohne Auswahl werden alle Regionen angezeigt. Mehrfachauswahl möglich.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {regions.map((region) => {
              const active = activeRegions.has(region)
              return (
                <button
                  key={region}
                  type="button"
                  onClick={() => toggleRegion(region)}
                  aria-pressed={active}
                  className={cn(
                    'fk-chip border transition',
                    active
                      ? 'border-debt bg-debt-soft text-debt'
                      : 'border-border text-fg-muted hover:border-debt/50 hover:text-fg'
                  )}
                >
                  {active && <Icon name="check" className="size-3.5" />}
                  {region}
                </button>
              )
            })}
            {activeRegions.size > 0 && (
              <button
                type="button"
                onClick={() => setActiveRegions(new Set())}
                className="fk-btn-ghost px-3 py-1 text-xs"
              >
                Filter zurücksetzen
              </button>
            )}
          </div>
        </fieldset>
      </div>

      {/* --------------------------------------------------------- Tabelle */}
      <div className="fk-card mt-6 overflow-hidden">
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-sm">
            <caption className="border-border bg-surface-muted text-fg-muted border-b px-4 py-3 text-left text-xs">
              Staatsverschuldung im Ländervergleich. Auf die Spaltenköpfe klicken, um zu
              sortieren. Die Balken beziehen sich auf die aktuell sortierte Spalte.
            </caption>
            <thead className="bg-surface-muted">
              <tr>
                {columns.map((column) => {
                  const active = column.key === sortKey
                  return (
                    <th
                      key={column.key}
                      scope="col"
                      // Screenreader kündigen die aktive Sortierrichtung an.
                      aria-sort={
                        active
                          ? direction === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                      className={cn(
                        'px-4 py-2.5',
                        column.numeric ? 'text-right' : 'text-left'
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort(column.key)}
                        className={cn(
                          'inline-flex items-center gap-1 text-xs font-semibold tracking-wide uppercase transition',
                          active ? 'text-fg' : 'text-fg-subtle hover:text-fg'
                        )}
                      >
                        <span className="hidden sm:inline">{column.label}</span>
                        <span className="sm:hidden">{column.shortLabel}</span>
                        <Icon
                          name="chevron-down"
                          className={cn(
                            'size-3.5 transition',
                            active ? 'opacity-100' : 'opacity-30',
                            active && direction === 'asc' && 'rotate-180'
                          )}
                        />
                      </button>
                    </th>
                  )
                })}
                <th scope="col" className="px-4 py-2.5 text-left">
                  <span className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
                    Region
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((country) => (
                <tr key={country.iso} className="border-border border-t">
                  <th scope="row" className="px-4 py-3 text-left">
                    <span className="text-fg font-semibold">{country.name}</span>
                    {country.note && (
                      <span className="text-fg-subtle mt-1 block max-w-md text-xs leading-relaxed">
                        {country.note}
                      </span>
                    )}
                  </th>

                  {/* Zahlenspalten; die sortierte Spalte erhält zusätzlich einen Balken. */}
                  {(
                    ['debtToGdpPercent', 'debtBillionsEur', 'debtPerCapitaEur'] as const
                  ).map((key) => (
                    <td key={key} className="px-4 py-3 text-right align-middle">
                      <span
                        className={cn(
                          'font-semibold tabular-nums',
                          key === barKey ? 'text-fg' : 'text-fg-muted'
                        )}
                      >
                        {formatColumnValue(country, key)}
                      </span>
                      {key === barKey && (
                        <span
                          aria-hidden="true"
                          className="bg-surface-muted mt-1.5 block h-1.5 overflow-hidden rounded-full"
                        >
                          <span
                            className="bg-debt block h-full rounded-full"
                            style={{ width: `${(country[key] / maxValue) * 100}%` }}
                          />
                        </span>
                      )}
                    </td>
                  ))}

                  <td className="text-fg-subtle px-4 py-3 text-xs">{country.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visible.length === 0 && (
          <p className="text-fg-muted px-4 py-8 text-center text-sm">
            Kein Land passt zu dieser Auswahl. Setze die Filter zurück oder ändere die
            Suche.
          </p>
        )}
      </div>
    </div>
  )
}
