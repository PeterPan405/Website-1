import { formatNumber } from '@/lib/format'
import type { Land } from '@/lib/laender'

/**
 * Dieselben Daten als Tabelle.
 *
 * Kein Anhängsel, sondern der Grund, warum der Globus überhaupt eine
 * Zeichenfläche sein darf: Was in einem `canvas` steht, ist für Screenreader
 * nicht vorhanden und für Suchmaschinen ebenfalls nicht. Diese Tabelle steht
 * im HTML, wird beim Bauen erzeugt und braucht kein JavaScript.
 *
 * Sortiert nach Wirtschaftsleistung, weil das die Kennzahl mit der besten
 * Abdeckung ist. Länder ohne jede Angabe stehen am Ende – sie fehlen nicht,
 * aber sie tragen auch nichts bei.
 */
export function Laendertabelle({ laender }: { laender: readonly Land[] }) {
  const sortiert = [...laender].sort((a, b) => {
    const bipA = a.bipUsd ?? -1
    const bipB = b.bipUsd ?? -1
    if (bipA !== bipB) return bipB - bipA
    return a.name.localeCompare(b.name, 'de')
  })

  return (
    <div className="rounded-card border-border relative mt-6 overflow-x-auto border">
      <table className="w-full min-w-[52rem] border-collapse text-sm">
        <caption className="border-border bg-surface-muted text-fg-muted border-b px-4 py-2.5 text-left text-xs font-medium">
          Alle {laender.length} Länder der Karte. Leere Zellen bedeuten „keine Angabe
          hinterlegt“ – nicht null.
        </caption>
        <thead className="bg-surface-muted">
          <tr>
            {[
              'Land',
              'BIP (Mrd. US-$)',
              'Einwohner',
              'BIP pro Kopf (US-$)',
              'Schulden (% BIP)',
              'Gehalt (US-$/Jahr)',
              'Medianvermögen (US-$)',
              'Kurse',
            ].map((spalte, index) => (
              <th
                key={spalte}
                scope="col"
                className={`text-fg-subtle px-4 py-2.5 text-xs font-semibold tracking-wide uppercase ${
                  index === 0 ? 'text-left' : 'text-right'
                }`}
              >
                {spalte}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortiert.map((land) => {
            const kurse = land.indizes.length + land.aktien.length
            return (
              <tr key={land.id} className="border-border border-t">
                <th scope="row" className="text-fg px-4 py-2 text-left font-medium">
                  {land.name}
                </th>
                <Zelle wert={land.bipUsd ? formatNumber(land.bipUsd / 1000) : null} />
                <Zelle wert={land.einwohner ? formatNumber(land.einwohner) : null} />
                <Zelle
                  wert={land.bipProKopfUsd ? formatNumber(land.bipProKopfUsd) : null}
                />
                <Zelle
                  wert={
                    land.schuldenquote ? formatNumber(land.schuldenquote.wert, 1) : null
                  }
                />
                <Zelle
                  wert={
                    land.durchschnittsgehalt
                      ? formatNumber(land.durchschnittsgehalt.wert)
                      : null
                  }
                />
                <Zelle
                  wert={
                    land.medianvermoegen ? formatNumber(land.medianvermoegen.wert) : null
                  }
                />
                <Zelle wert={kurse > 0 ? String(kurse) : null} />
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function Zelle({ wert }: { wert: string | null }) {
  return (
    <td className="text-fg-muted px-4 py-2 text-right tabular-nums">
      {wert ?? <span className="text-fg-subtle">–</span>}
    </td>
  )
}
