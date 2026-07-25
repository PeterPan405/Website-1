/**
 * Zahleneingaben im deutschen Format lesen und schreiben.
 *
 * Ein `<input type="number">` akzeptiert je nach Browser-Locale kein Komma.
 * Deshalb nutzen die Rechner Textfelder mit `inputMode="decimal"` und werten die
 * Eingabe hier selbst aus: Punkt ist Tausendertrennzeichen, Komma ist
 * Dezimaltrennzeichen – so, wie es im deutschsprachigen Raum erwartet wird.
 */

export interface ParseResult {
  ok: boolean
  value: number
  /** Fehlermeldung für die Anzeige am Feld. */
  error?: string
}

export interface ParseOptions {
  min?: number
  max?: number
  /** Erlaubt ein leeres Feld und liefert dann 0. */
  allowEmpty?: boolean
  /** Bezeichnung des Feldes für verständliche Fehlermeldungen. */
  label?: string
}

export function parseGermanNumber(
  input: string,
  options: ParseOptions = {}
): ParseResult {
  const trimmed = input.trim()

  if (trimmed === '') {
    return options.allowEmpty
      ? { ok: true, value: 0 }
      : { ok: false, value: 0, error: 'Bitte einen Wert eingeben.' }
  }

  // Tausenderpunkte und Leerzeichen entfernen, Komma zum Dezimalpunkt machen.
  const normalized = trimmed.replace(/\s/g, '').replace(/\./g, '').replace(',', '.')

  if (!/^-?\d*\.?\d*$/.test(normalized) || normalized === '' || normalized === '-') {
    return { ok: false, value: 0, error: 'Bitte nur Zahlen eingeben.' }
  }

  const value = Number(normalized)
  if (!Number.isFinite(value)) {
    return { ok: false, value: 0, error: 'Bitte nur Zahlen eingeben.' }
  }

  if (typeof options.min === 'number' && value < options.min) {
    return {
      ok: false,
      value,
      error: `Wert muss mindestens ${formatForInput(options.min)} betragen.`,
    }
  }

  if (typeof options.max === 'number' && value > options.max) {
    return {
      ok: false,
      value,
      error: `Wert darf höchstens ${formatForInput(options.max)} betragen.`,
    }
  }

  return { ok: true, value }
}

/**
 * Zahl für die Anzeige in einem Eingabefeld formatieren.
 *
 * Absichtlich ohne Tausenderpunkte: Sie würden beim Tippen ständig
 * hineinspringen und den Cursor verschieben.
 */
export function formatForInput(value: number, maxDecimals = 2): string {
  if (!Number.isFinite(value)) return ''
  const rounded = Math.round(value * 10 ** maxDecimals) / 10 ** maxDecimals
  return String(rounded).replace('.', ',')
}
