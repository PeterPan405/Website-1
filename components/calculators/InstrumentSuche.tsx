'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'

import { Icon } from '@/components/ui/Icon'
import { filtere, type Suchbar } from '@/lib/instrument-filter'
import { cn } from '@/lib/cn'

/**
 * Ein Suchfeld statt eines Klappmenüs.
 *
 * ## Warum
 *
 * Weil ein `<select>` mit über tausend Einträgen keine Auswahl ist, sondern
 * eine Zumutung. Auf dem iPad öffnet es eine Liste, die bei „3M“ anfängt und
 * bei „Zurich“ aufhört, und wer SAP sucht, wischt sich durch das halbe
 * Alphabet. Genau darüber kam die Rückmeldung – zu Recht.
 *
 * Ein Textfeld mit gefilterter Liste dreht das um: drei Buchstaben statt
 * dreißig Wischbewegungen. Gesucht wird über Name, Kürzel und Branche.
 *
 * ## Warum kein fertiges Paket
 *
 * Ein Kombinationsfeld ist überschaubar, und die Fertiglösungen bringen
 * fünfzig Kilobyte und eigene Vorstellungen von Gestaltung mit. Was es
 * braucht, steht in der ARIA-Practices-Empfehlung und passt in eine Datei:
 * `role="combobox"` am Feld, eine Liste mit `role="listbox"`, der aktive
 * Eintrag über `aria-activedescendant` benannt.
 *
 * ## Bedienung
 *
 * Tippen filtert. Pfeil hoch und runter wandern, Enter übernimmt, Escape
 * schließt und stellt den vorigen Stand wieder her – letzteres ist der Punkt,
 * an dem selbstgebaute Felder gern scheitern: Wer die Liste abbricht, will
 * seine bisherige Auswahl behalten und nicht ein halb getipptes Wort.
 */
export function InstrumentSuche<T extends Suchbar>({
  eintraege,
  wert,
  onWaehle,
  platzhalter = 'Name oder Kürzel …',
  label,
}: {
  eintraege: readonly T[]
  /** Das gewählte Symbol, oder leer. */
  wert: string
  onWaehle: (symbol: string) => void
  platzhalter?: string
  label: string
}) {
  const id = useId()
  const gewaehlt = useMemo(
    () => eintraege.find((e) => e.symbol === wert) ?? null,
    [eintraege, wert]
  )

  /** Was im Feld steht, solange die Liste offen ist. */
  const [eingabe, setEingabe] = useState('')
  const [offen, setOffen] = useState(false)
  const [aktiv, setAktiv] = useState(0)
  const huelle = useRef<HTMLDivElement>(null)

  const treffer = useMemo(
    () => filtere(eintraege, offen ? eingabe : ''),
    [eintraege, eingabe, offen]
  )

  /*
    Klick nach außen schließt. Ohne das bliebe die Liste stehen, während man
    schon woanders tippt – und verdeckte dort das Feld, das gerade gefüllt wird.
  */
  useEffect(() => {
    if (!offen) return
    function beiKlick(ereignis: MouseEvent) {
      if (!huelle.current?.contains(ereignis.target as Node)) setOffen(false)
    }
    document.addEventListener('mousedown', beiKlick)
    return () => document.removeEventListener('mousedown', beiKlick)
  }, [offen])

  function uebernimm(symbol: string) {
    onWaehle(symbol)
    setOffen(false)
    setEingabe('')
  }

  function beiTaste(ereignis: React.KeyboardEvent<HTMLInputElement>) {
    if (ereignis.key === 'ArrowDown' || ereignis.key === 'ArrowUp') {
      ereignis.preventDefault()
      if (!offen) {
        setOffen(true)
        setAktiv(0)
        return
      }
      const richtung = ereignis.key === 'ArrowDown' ? 1 : -1
      /*
        Umlaufend, nicht anschlagend: Bei acht Treffern ist der letzte vom
        ersten aus einen Tastendruck entfernt, wenn die Liste umläuft – und
        sieben, wenn sie es nicht tut.
      */
      setAktiv((alt) => (alt + richtung + treffer.length) % Math.max(treffer.length, 1))
      return
    }
    if (ereignis.key === 'Enter' && offen && treffer[aktiv]) {
      ereignis.preventDefault()
      uebernimm(treffer[aktiv].symbol)
      return
    }
    if (ereignis.key === 'Escape' && offen) {
      ereignis.preventDefault()
      setOffen(false)
      setEingabe('')
    }
  }

  return (
    <div ref={huelle} className="relative min-w-0 flex-1">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <Icon
          name="search"
          aria-hidden="true"
          className="text-fg-subtle pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        />
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={offen}
          aria-controls={`${id}-liste`}
          aria-autocomplete="list"
          aria-activedescendant={offen && treffer[aktiv] ? `${id}-${aktiv}` : undefined}
          autoComplete="off"
          className="fk-input w-full pl-9"
          /*
            Im offenen Zustand steht die bisherige Wahl als Platzhalter da.

            Ohne das wirkte ein angeklicktes Feld schlagartig leer: Das Feld
            zeigt beim Öffnen die frische Eingabe, und die ist zunächst nichts.
            Wer „Apple“ antippt, um daneben etwas zu ändern, sah sein Apple
            verschwinden und musste raten, ob es noch gewählt ist.
          */
          placeholder={gewaehlt ? gewaehlt.name : platzhalter}
          /*
            Im geschlossenen Zustand steht der gewählte Name im Feld, im
            offenen die Eingabe. Sonst müsste man erst löschen, was schon
            richtig dasteht, um etwas anderes zu suchen.
          */
          value={offen ? eingabe : (gewaehlt?.name ?? '')}
          onChange={(e) => {
            setEingabe(e.target.value)
            setOffen(true)
            setAktiv(0)
          }}
          onFocus={() => {
            setOffen(true)
            setEingabe('')
            setAktiv(0)
          }}
          onKeyDown={beiTaste}
        />
      </div>

      {offen && (
        <ul
          id={`${id}-liste`}
          role="listbox"
          aria-label={label}
          /*
            Anderer Grund als die Eingabefelder – das ist der Punkt.

            `fk-input` steht auf `bg-surface`. Solange die Liste denselben Ton
            trug, sah sie exakt aus wie eine weitere Zeile des Formulars: Sie
            erscheint ja genau dort, wo die nächste Position steht, und daneben
            blieb deren Betragsfeld sichtbar. Ein kräftigerer Rand allein hat
            das nicht aufgelöst.

            `bg-surface-muted` ist in beiden Themen deutlich abgesetzt, und
            zusammen mit Schatten und Zählzeile darüber liest sich die Liste als
            das, was sie ist: etwas, das über dem Formular schwebt.
          */
          className="border-border-strong bg-surface-muted shadow-lift absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border p-2"
        >
          {/*
            Eine Kopfzeile über den Treffern.

            Sie zählt nicht nur – sie macht die Liste als Liste erkennbar. Bei
            genau einem Treffer füllte der markierte Eintrag sonst die ganze
            Fläche aus, und das Ergebnis sah exakt aus wie ein weiteres
            Eingabefeld des Formulars. Nebenbei steht hier die Tastenbedienung,
            die sonst niemand findet.
          */}
          <li
            aria-hidden="true"
            className="text-fg-subtle border-border flex items-baseline justify-between gap-2 border-b px-2 pt-1 pb-2 text-xs"
          >
            <span>
              {treffer.length === 0
                ? 'kein Treffer'
                : `${treffer.length} Treffer${treffer.length === 8 ? ' – weiter tippen grenzt ein' : ''}`}
            </span>
            <span className="shrink-0">↑↓ wählen · ⏎ übernehmen</span>
          </li>
          {treffer.length === 0 ? (
            <li className="text-fg-subtle px-3 py-3 text-sm">
              Nichts gefunden. Andere Schreibweise oder das Börsenkürzel probieren.
            </li>
          ) : (
            treffer.map((eintrag, i) => (
              <li key={eintrag.symbol}>
                <button
                  type="button"
                  id={`${id}-${i}`}
                  role="option"
                  aria-selected={i === aktiv}
                  /*
                    `onMouseDown` und nicht `onClick`: Ein Klick nimmt dem Feld
                    zuerst den Fokus, und der Fokusverlust schließt die Liste –
                    das `onClick` käme nie an.
                  */
                  onMouseDown={(e) => {
                    e.preventDefault()
                    uebernimm(eintrag.symbol)
                  }}
                  onMouseEnter={() => setAktiv(i)}
                  className={cn(
                    'mt-1 flex w-full items-baseline justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm',
                    i === aktiv ? 'bg-brand-soft text-fg' : 'text-fg-muted'
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">{eintrag.name}</span>
                  <span className="text-fg-subtle shrink-0 text-xs tabular-nums">
                    {eintrag.ticker}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
