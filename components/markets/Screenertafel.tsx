'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { cn } from '@/lib/cn'
import { formatNumber, formatPercent } from '@/lib/format'
import {
  screene,
  sortiere,
  type Filter,
  type Screenerzeile,
  type Sortierfeld,
} from '@/lib/screener'

/**
 * Der Filter über die Aktien, samt der Auskunft, worauf er sich stützt.
 *
 * ## Warum die Datenlage zwischen Filter und Tabelle steht
 *
 * Weil sie dort nicht zu übersehen ist. Unter der Tabelle stünde sie hinter
 * hundert Zeilen; als Fußnote läse sie niemand. Die Zeile „X von Y Titeln
 * dieser Auswahl haben ein KGV“ gehört zwischen die Frage und die Antwort,
 * weil sie erklärt, was die Antwort ist.
 *
 * Sie erscheint nur, wenn tatsächlich nach einer Kennzahl gefiltert wurde.
 * Eine Abfrage nach Branche und Land braucht sie nicht – die stehen im
 * Katalog und fehlen praktisch nie.
 *
 * ## Warum die Tabelle ohne JavaScript etwas zeigt
 *
 * Die Zeilen kommen fertig vom Server. Ohne JavaScript sieht ein Besucher die
 * ungefilterte Liste statt einer leeren Seite – dieselbe Bauart wie bei
 * `Jahresspannentafel`.
 */

const SPALTEN: {
  key: Sortierfeld
  label: string
  kurz: string
  zahl: boolean
  /** Wonach beim ersten Klick sortiert wird. */
  standard: 'auf' | 'ab'
}[] = [
  { key: 'name', label: 'Aktie', kurz: 'Aktie', zahl: false, standard: 'auf' },
  { key: 'kgv', label: 'KGV', kurz: 'KGV', zahl: true, standard: 'auf' },
  { key: 'kbv', label: 'KBV', kurz: 'KBV', zahl: true, standard: 'auf' },
  { key: 'kuv', label: 'KUV', kurz: 'KUV', zahl: true, standard: 'auf' },
  {
    key: 'marktwertMrdEur',
    label: 'Börsenwert',
    kurz: 'Wert',
    zahl: true,
    standard: 'ab',
  },
  {
    key: 'abstandHoch',
    label: 'Zum Hoch',
    kurz: 'Hoch',
    zahl: true,
    standard: 'auf',
  },
]

/** Wie viele Zeilen auf einmal – der Rest kommt auf Knopfdruck. */
const SEITE = 50

function Zahlenfeld({
  label,
  hinweis,
  wert,
  setzen,
  schritt = 'any',
}: {
  label: string
  hinweis: string
  wert: string
  setzen: (neu: string) => void
  schritt?: string
}) {
  return (
    <label className="block">
      <span className="text-fg block text-sm font-medium">{label}</span>
      <span className="text-fg-subtle mt-0.5 block text-xs">{hinweis}</span>
      <input
        type="number"
        inputMode="decimal"
        step={schritt}
        value={wert}
        onChange={(ereignis) => setzen(ereignis.target.value)}
        className="border-border bg-canvas text-fg focus:border-markets mt-1.5 w-full rounded-lg border px-3 py-2 text-sm tabular-nums outline-none"
      />
    </label>
  )
}

function Auswahlfeld({
  label,
  wert,
  setzen,
  optionen,
  alle,
}: {
  label: string
  wert: string
  setzen: (neu: string) => void
  optionen: readonly string[]
  alle: string
}) {
  return (
    <label className="block">
      <span className="text-fg block text-sm font-medium">{label}</span>
      <span className="text-fg-subtle mt-0.5 block text-xs">&nbsp;</span>
      <select
        value={wert}
        onChange={(ereignis) => setzen(ereignis.target.value)}
        className="border-border bg-canvas text-fg focus:border-markets mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none"
      >
        <option value="">{alle}</option>
        {optionen.map((eintrag) => (
          <option key={eintrag} value={eintrag}>
            {eintrag}
          </option>
        ))}
      </select>
    </label>
  )
}

/** Leere Eingabe heißt „egal“, eine Zahl heißt die Zahl – auch die Null. */
function alsZahl(eingabe: string): number | undefined {
  if (eingabe.trim() === '') return undefined
  const zahl = Number(eingabe)
  return Number.isFinite(zahl) ? zahl : undefined
}

export function Screenertafel({
  zeilen,
  branchen,
  laender,
  className,
}: {
  zeilen: readonly Screenerzeile[]
  branchen: readonly string[]
  laender: readonly string[]
  className?: string
}) {
  const [branche, setBranche] = useState('')
  const [land, setLand] = useState('')
  const [kgvBis, setKgvBis] = useState('')
  const [kbvBis, setKbvBis] = useState('')
  const [marktwertAb, setMarktwertAb] = useState('')
  const [abstandBis, setAbstandBis] = useState('')
  const [nach, setNach] = useState<Sortierfeld>('marktwertMrdEur')
  const [richtung, setRichtung] = useState<'auf' | 'ab'>('ab')
  const [sichtbar, setSichtbar] = useState(SEITE)

  const filter: Filter = useMemo(
    () => ({
      branche: branche === '' ? undefined : branche,
      land: land === '' ? undefined : land,
      kgvBis: alsZahl(kgvBis),
      kbvBis: alsZahl(kbvBis),
      marktwertAbMrdEur: alsZahl(marktwertAb),
      abstandHochBis: alsZahl(abstandBis),
    }),
    [branche, land, kgvBis, kbvBis, marktwertAb, abstandBis]
  )

  const ergebnis = useMemo(() => screene(zeilen, filter), [zeilen, filter])
  const sortiert = useMemo(
    () => sortiere(ergebnis.treffer, nach, richtung),
    [ergebnis.treffer, nach, richtung]
  )

  const gesetzt =
    branche !== '' ||
    land !== '' ||
    kgvBis !== '' ||
    kbvBis !== '' ||
    marktwertAb !== '' ||
    abstandBis !== ''

  function sortiereNach(feld: Sortierfeld): void {
    const spalte = SPALTEN.find((s) => s.key === feld)
    if (!spalte) return
    if (feld === nach) {
      setRichtung(richtung === 'auf' ? 'ab' : 'auf')
    } else {
      setNach(feld)
      setRichtung(spalte.standard)
    }
    setSichtbar(SEITE)
  }

  function zuruecksetzen(): void {
    setBranche('')
    setLand('')
    setKgvBis('')
    setKbvBis('')
    setMarktwertAb('')
    setAbstandBis('')
    setSichtbar(SEITE)
  }

  return (
    <div className={cn('fk-card p-5 sm:p-6', className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-fg text-lg font-semibold">Filtern</h2>
        {gesetzt ? (
          <button
            type="button"
            onClick={zuruecksetzen}
            className="text-fg-muted hover:text-markets text-sm underline underline-offset-2"
          >
            Alles zurücksetzen
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Auswahlfeld
          label="Branche"
          wert={branche}
          setzen={(neu) => {
            setBranche(neu)
            setSichtbar(SEITE)
          }}
          optionen={branchen}
          alle="Alle Branchen"
        />
        <Auswahlfeld
          label="Sitzland"
          wert={land}
          setzen={(neu) => {
            setLand(neu)
            setSichtbar(SEITE)
          }}
          optionen={laender}
          alle="Alle Länder"
        />
        <Zahlenfeld
          label="KGV höchstens"
          hinweis="Kurs geteilt durch Gewinn je Aktie"
          wert={kgvBis}
          setzen={(neu) => {
            setKgvBis(neu)
            setSichtbar(SEITE)
          }}
        />
        <Zahlenfeld
          label="KBV höchstens"
          hinweis="Kurs geteilt durch Eigenkapital je Aktie"
          wert={kbvBis}
          setzen={(neu) => {
            setKbvBis(neu)
            setSichtbar(SEITE)
          }}
        />
        <Zahlenfeld
          label="Börsenwert ab (Mrd €)"
          hinweis="Umgerechnet zum EZB-Referenzkurs"
          wert={marktwertAb}
          setzen={(neu) => {
            setMarktwertAb(neu)
            setSichtbar(SEITE)
          }}
        />
        <Zahlenfeld
          label="Abstand zum Hoch bis (%)"
          hinweis="Negativ: −20 heißt mindestens 20 % unter dem Zwölfmonatshoch"
          wert={abstandBis}
          setzen={(neu) => {
            setAbstandBis(neu)
            setSichtbar(SEITE)
          }}
        />
      </div>

      {/*
        Die Auskunft zwischen Frage und Antwort.

        Sie steht hier und nicht unter der Tabelle, weil sie sonst hinter
        hundert Zeilen verschwände – und weil sie erklärt, was die Antwort
        darunter überhaupt ist.
      */}
      <div className="border-border/60 mt-6 border-t pt-5">
        <p className="text-fg text-sm font-semibold">
          {formatNumber(sortiert.length)} {sortiert.length === 1 ? 'Treffer' : 'Treffer'}
          {gesetzt ? (
            <span className="text-fg-muted font-normal">
              {' '}
              aus {formatNumber(ergebnis.vorauswahl)} Titeln der Auswahl
            </span>
          ) : null}
        </p>

        {ergebnis.grundgesamtheiten.length > 0 ? (
          <div className="mt-3 space-y-3">
            {ergebnis.grundgesamtheiten.map((basis) => {
              const quote = (basis.belegt / Math.max(basis.gesamt, 1)) * 100
              return (
                <div key={basis.feld} className="text-sm">
                  <p className="text-fg-muted">
                    <strong className="text-fg">{basis.label}:</strong>{' '}
                    {formatNumber(basis.belegt)} von {formatNumber(basis.gesamt)} Titeln
                    dieser Auswahl haben die Kennzahl überhaupt ({formatPercent(quote, 0)}
                    ).{' '}
                    {basis.belegt < basis.gesamt ? (
                      <>
                        Die übrigen {formatNumber(basis.gesamt - basis.belegt)} sind nicht
                        „teurer“ – sie sind nicht gemessen.
                      </>
                    ) : null}
                  </p>
                  {basis.nachLand.length > 1 ? (
                    <ul className="text-fg-subtle mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs tabular-nums">
                      {basis.nachLand.slice(0, 8).map((eintrag) => (
                        <li key={eintrag.land}>
                          {eintrag.land} {formatNumber(eintrag.belegt)}/
                          {formatNumber(eintrag.gesamt)}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              )
            })}
          </div>
        ) : null}
      </div>

      {sortiert.length === 0 ? (
        <p className="text-fg-muted mt-6 text-sm leading-relaxed">
          Kein Titel erfüllt alle Bedingungen. Das kann heißen, dass es ihn nicht gibt –
          oder dass die Kennzahl für diese Auswahl nicht vorliegt. Die Zeilen darüber
          sagen, welches von beidem.
        </p>
      ) : (
        <>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[42rem] text-sm">
              <caption className="sr-only">Aktien nach Kennzahlen, sortierbar</caption>
              <thead>
                <tr className="text-fg-subtle border-border border-b text-left text-xs uppercase">
                  {SPALTEN.map((spalte) => (
                    <th
                      key={spalte.key}
                      scope="col"
                      className={cn(
                        'py-2 font-semibold',
                        spalte.zahl ? 'text-right' : 'text-left',
                        spalte.key === 'name' ? 'pr-4' : 'pl-3'
                      )}
                      aria-sort={
                        nach === spalte.key
                          ? richtung === 'auf'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      <button
                        type="button"
                        onClick={() => sortiereNach(spalte.key)}
                        className="hover:text-markets uppercase"
                      >
                        <span className="hidden sm:inline">{spalte.label}</span>
                        <span className="sm:hidden">{spalte.kurz}</span>
                        {nach === spalte.key ? (
                          <span aria-hidden="true">
                            {' '}
                            {richtung === 'auf' ? '▲' : '▼'}
                          </span>
                        ) : null}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortiert.slice(0, sichtbar).map((zeile) => (
                  <tr
                    key={zeile.symbol}
                    className="border-border/60 border-b align-middle last:border-0"
                  >
                    <th scope="row" className="py-3 pr-4 text-left font-semibold">
                      <Link
                        href={`/maerkte/${zeile.symbol}`}
                        className="text-fg hover:text-markets underline-offset-2 hover:underline"
                      >
                        {zeile.name}
                      </Link>
                      <span className="text-fg-subtle block text-xs font-normal">
                        {[zeile.branche, zeile.land].filter(Boolean).join(' · ')}
                      </span>
                    </th>
                    <td className="text-fg py-3 pl-3 text-right tabular-nums">
                      {zeile.kgv === null ? (
                        <span className="text-fg-subtle">–</span>
                      ) : (
                        formatNumber(zeile.kgv, 1)
                      )}
                    </td>
                    <td className="text-fg py-3 pl-3 text-right tabular-nums">
                      {zeile.kbv === null ? (
                        <span className="text-fg-subtle">–</span>
                      ) : (
                        formatNumber(zeile.kbv, 2)
                      )}
                    </td>
                    <td className="text-fg py-3 pl-3 text-right tabular-nums">
                      {zeile.kuv === null ? (
                        <span className="text-fg-subtle">–</span>
                      ) : (
                        formatNumber(zeile.kuv, 2)
                      )}
                    </td>
                    <td className="text-fg py-3 pl-3 text-right tabular-nums">
                      {zeile.marktwertMrdEur === null ? (
                        <span className="text-fg-subtle">–</span>
                      ) : (
                        `${formatNumber(zeile.marktwertMrdEur, 1)} Mrd €`
                      )}
                    </td>
                    <td className="text-fg py-3 pl-3 text-right tabular-nums">
                      {zeile.abstandHoch === null ? (
                        <span className="text-fg-subtle">–</span>
                      ) : (
                        formatPercent(zeile.abstandHoch, 1)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sichtbar < sortiert.length ? (
            <button
              type="button"
              onClick={() => setSichtbar(sichtbar + SEITE)}
              className="border-border text-fg hover:border-markets hover:text-markets mt-5 w-full rounded-lg border px-4 py-2.5 text-sm font-medium transition"
            >
              Weitere {formatNumber(Math.min(SEITE, sortiert.length - sichtbar))} von{' '}
              {formatNumber(sortiert.length - sichtbar)} anzeigen
            </button>
          ) : null}
        </>
      )}
    </div>
  )
}
