/**
 * Datumsformatierung für die Tagesausgaben.
 *
 * Bewusst ein eigenes Modul ohne Importe: Diese Funktionen sind reine Rechnung
 * und lassen sich damit unter `tests/` direkt prüfen, ohne dass dafür die
 * Pfad-Aliase oder die Datenschicht aufgelöst werden müssten.
 */

export const monthNames = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
]

const weekdayNames = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
]

/** Ausgeschriebener Monat mit Jahr aus einem Schlüssel `YYYY-MM`, z. B. „Juli 2026“. */
export function formatMonthKey(key: string): string {
  const [year, month] = key.split('-')
  return `${monthNames[Number(month) - 1]} ${year}`
}

/**
 * Formatiert einen Erscheinungstag, z. B. „Samstag, 25. Juli 2026“.
 *
 * Ohne `toLocaleDateString` und ohne `new Date(...)`, und das aus zwei Gründen:
 * Die Ausgabe von `toLocaleDateString` hängt von den installierten Gebietsdaten
 * des Systems ab und kann zwischen Build und Browser abweichen. Und ein Datum
 * ohne Zeitangabe liest JavaScript als UTC – in westlichen Zeitzonen fiele der
 * Wochentag damit um einen Tag daneben.
 *
 * Der Wochentag kommt deshalb aus einer reinen Rechnung (Zellers Kongruenz).
 */
export function formatEditionDate(date: string, withWeekday = true): string {
  const [year, month, day] = date.split('-').map(Number)
  const long = `${day}. ${monthNames[month - 1]} ${year}`
  if (!withWeekday) return long

  // Januar und Februar zählen in dieser Formel als 13. und 14. Monat des Vorjahrs.
  const shiftedMonth = month < 3 ? month + 12 : month
  const y = month < 3 ? year - 1 : year
  const k = y % 100
  const j = Math.floor(y / 100)
  const h =
    (day +
      Math.floor((13 * (shiftedMonth + 1)) / 5) +
      k +
      Math.floor(k / 4) +
      Math.floor(j / 4) +
      5 * j) %
    7
  // Zeller liefert 0 = Samstag; die Namensliste beginnt bei Sonntag.
  return `${weekdayNames[(h + 6) % 7]}, ${long}`
}
