'use client'

import { useId, useState } from 'react'

import { cn } from '@/lib/cn'
import { formatForInput, parseGermanNumber } from '@/lib/parse-number'

/**
 * Zahleneingabe mit Validierung.
 *
 * Die Komponente hält den Rohtext selbst, damit während des Tippens auch
 * ungültige Zwischenzustände möglich sind („1,“). Nach außen wird nur ein
 * gültiger Zahlenwert gemeldet; bei ungültiger Eingabe bleibt der letzte
 * gültige Wert im Ergebnis stehen und das Feld zeigt eine Fehlermeldung.
 */
export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  suffix,
  hint,
  step,
  decimals = 2,
  allowEmpty = false,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  /** Einheit, die rechts im Feld steht (z. B. „€“ oder „%“). */
  suffix?: string
  hint?: string
  /** Schrittweite des optionalen Schiebereglers. Ohne Angabe kein Regler. */
  step?: number
  decimals?: number
  allowEmpty?: boolean
}) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`

  const [text, setText] = useState(() => formatForInput(value, decimals))
  const [error, setError] = useState<string | undefined>(undefined)
  /** Letzter von außen gesehener Wert – erkennt Änderungen durch die Elternkomponente. */
  const [lastValue, setLastValue] = useState(value)

  // Wird der Wert von außen gesetzt (Schieberegler, Zurücksetzen), das Textfeld
  // nachziehen. Das geschieht bewusst während des Renderns und nicht in einem
  // Effekt: React empfiehlt dieses Muster zum Anpassen von State an geänderte
  // Props, weil es ohne zusätzlichen Render-Durchlauf und ohne Aufblitzen des
  // alten Werts auskommt.
  if (value !== lastValue) {
    setLastValue(value)
    const parsed = parseGermanNumber(text, { min, max, allowEmpty })
    // Nur überschreiben, wenn das Feld etwas anderes anzeigt – sonst würde eine
    // gerade getippte Eingabe wie „1,“ zerstört.
    if (!parsed.ok || parsed.value !== value) {
      setText(formatForInput(value, decimals))
      setError(undefined)
    }
  }

  function handleTextChange(next: string) {
    setText(next)
    const parsed = parseGermanNumber(next, { min, max, allowEmpty, label })
    setError(parsed.error)
    if (parsed.ok) onChange(parsed.value)
  }

  return (
    <div>
      <label htmlFor={id} className="text-fg block text-sm font-medium">
        {label}
      </label>

      <div className="relative mt-1.5">
        <input
          id={id}
          // Textfeld statt type="number": erlaubt Komma als Dezimaltrennzeichen.
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={text}
          onChange={(event) => handleTextChange(event.target.value)}
          aria-describedby={cn(hint && hintId, error && errorId) || undefined}
          aria-invalid={error ? true : undefined}
          className={cn(
            'fk-input tabular-nums',
            suffix && 'pr-12',
            error && 'border-danger focus:border-danger'
          )}
        />
        {suffix && (
          <span
            aria-hidden="true"
            className="text-fg-subtle pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm"
          >
            {suffix}
          </span>
        )}
      </div>

      {/* Optionaler Schieberegler für schnelle, grobe Anpassungen. */}
      {typeof step === 'number' && typeof min === 'number' && typeof max === 'number' && (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Math.min(max, Math.max(min, value))}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label={`${label} – Schieberegler`}
          className="accent-brand mt-2.5 w-full"
        />
      )}

      {hint && !error && (
        <p id={hintId} className="text-fg-subtle mt-1.5 text-xs leading-relaxed">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-danger mt-1.5 text-xs font-medium">
          {error}
        </p>
      )}
    </div>
  )
}

/** Auswahlfeld im selben Stil wie {@link NumberField}. */
export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
  hint?: string
}) {
  const id = useId()
  const hintId = `${id}-hint`

  return (
    <div>
      <label htmlFor={id} className="text-fg block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        aria-describedby={hint ? hintId : undefined}
        className="fk-input mt-1.5"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && (
        <p id={hintId} className="text-fg-subtle mt-1.5 text-xs leading-relaxed">
          {hint}
        </p>
      )}
    </div>
  )
}
