/**
 * Einheitliche Formatierung für Zahlen, Geldbeträge und Datumsangaben.
 *
 * Locale und Zeitzone sind bewusst fest verdrahtet ('de-DE' /
 * 'Europe/Berlin'). Dadurch liefern Server-Rendering und Browser exakt
 * dieselbe Zeichenkette – andernfalls entstehen Hydration-Fehler, sobald ein
 * Besucher eine andere Systemsprache oder Zeitzone eingestellt hat.
 */

const LOCALE = 'de-DE'
const TIME_ZONE = 'Europe/Berlin'

/** Intl-Instanzen sind teuer, daher pro Konfiguration nur einmal erzeugen. */
const numberFormatters = new Map<string, Intl.NumberFormat>()

function numberFormatter(options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = JSON.stringify(options)
  let formatter = numberFormatters.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat(LOCALE, options)
    numberFormatters.set(key, formatter)
  }
  return formatter
}

/**
 * Zahl mit Tausenderpunkten, z. B. `1.234,5`.
 *
 * Negative Werte bekommen das typografische Minuszeichen (U+2212), nicht den
 * Bindestrich. `Intl` liefert je nach Laufzeitumgebung das eine oder das
 * andere – und auf derselben Seite standen dadurch beide nebeneinander: ein
 * von Hand gesetztes „− 12 %“ neben einem gerechneten „-12 %“. Das ist
 * derselbe Anspruch wie bei `formatPercentSigned`, nur an der Stelle, an der
 * alle Zahlen vorbeikommen.
 */
export function formatNumber(value: number, fractionDigits = 0): string {
  return numberFormatter({
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
    .format(value)
    .replace('-', '−')
}

/**
 * Geldbetrag, z. B. `1.234,56 €`.
 *
 * Negative Beträge bekommen wie bei {@link formatNumber} das typografische
 * Minuszeichen. Sichtbar wird das vor allem in der Vermögensübersicht, wo ein
 * negatives Ergebnis der Normalfall und kein Ausrutscher ist – dort stünde
 * sonst ein Bindestrich neben lauter Minuszeichen.
 */
export function formatCurrency(
  value: number,
  fractionDigits = 2,
  currency = 'EUR'
): string {
  return numberFormatter({
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
    .format(value)
    .replace('-', '−')
}

/**
 * Geldbetrag ohne Nachkommastellen – für große Summen, bei denen Cent-Angaben
 * eine Scheingenauigkeit erzeugen würden.
 */
export function formatCurrencyRounded(value: number, currency = 'EUR'): string {
  return formatCurrency(value, 0, currency)
}

/** Prozentwert, der bereits in Prozentpunkten vorliegt: `7,25 %`. */
export function formatPercent(value: number, fractionDigits = 2): string {
  return `${formatNumber(value, fractionDigits)} %`
}

/** Prozentwert mit explizitem Vorzeichen: `+1,24 %` / `−0,80 %`. */
export function formatPercentSigned(value: number, fractionDigits = 2): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${formatNumber(Math.abs(value), fractionDigits)} %`
}

/** Zahl mit explizitem Vorzeichen, z. B. für Kursveränderungen. */
export function formatNumberSigned(value: number, fractionDigits = 2): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${formatNumber(Math.abs(value), fractionDigits)}`
}

/** Wechselkurs mit vier Nachkommastellen, wie im Devisenhandel üblich. */
export function formatRate(value: number): string {
  return formatNumber(value, 4)
}

/**
 * Milliardenbeträge lesbar machen: ab 1.000 Mrd. wird auf Billionen
 * umgestellt, damit die Zahlen im Ländervergleich vergleichbar bleiben.
 */
export function formatBillionsEur(valueInBillions: number): string {
  if (Math.abs(valueInBillions) >= 1000) {
    return `${formatNumber(valueInBillions / 1000, 2)} Bio. €`
  }
  return `${formatNumber(valueInBillions, 0)} Mrd. €`
}

/**
 * Große Beträge mit passender Stufe: `3,88 Bio. USD`, `412,5 Mrd. USD`.
 *
 * Anders als `formatBillionsEur` erwartet diese Funktion den vollen Betrag,
 * nicht schon Milliarden – Bilanzzahlen kommen so aus der Quelle, und eine
 * Umrechnung an jeder Aufrufstelle wäre eine Fehlerquelle mehr.
 */
export function formatLargeAmount(value: number, currency = 'USD'): string {
  const betrag = Math.abs(value)
  if (betrag >= 1e12) return `${formatNumber(value / 1e12, 2)} Bio. ${currency}`
  if (betrag >= 1e9) return `${formatNumber(value / 1e9, 1)} Mrd. ${currency}`
  if (betrag >= 1e6) return `${formatNumber(value / 1e6, 0)} Mio. ${currency}`
  return `${formatNumber(value, 0)} ${currency}`
}

const dateFormatters = new Map<string, Intl.DateTimeFormat>()

function dateFormatter(options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = JSON.stringify(options)
  let formatter = dateFormatters.get(key)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(LOCALE, { timeZone: TIME_ZONE, ...options })
    dateFormatters.set(key, formatter)
  }
  return formatter
}

/** `14. März 2026` */
export function formatDate(iso: string): string {
  return dateFormatter({ day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(iso)
  )
}

/** `14.03.2026` – kompakt, z. B. für Tabellen und Chart-Achsen. */
export function formatDateShort(iso: string): string {
  return dateFormatter({ day: '2-digit', month: '2-digit', year: 'numeric' }).format(
    new Date(iso)
  )
}

/** `14. März 2026, 09:35 Uhr` */
export function formatDateTime(iso: string): string {
  const formatted = dateFormatter({
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
  return `${formatted} Uhr`
}

/** `09:35` – für Intraday-Charts. */
export function formatTime(iso: string): string {
  return dateFormatter({ hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}

/** `Mär 26` – für Achsenbeschriftungen langer Zeiträume. */
export function formatMonthYear(iso: string): string {
  return dateFormatter({ month: 'short', year: '2-digit' }).format(new Date(iso))
}

/** `März 2026` – wo der Monat die Überschrift ist, nicht die Achsenmarke. */
export function formatMonthYearLong(iso: string): string {
  return dateFormatter({ month: 'long', year: 'numeric' }).format(new Date(iso))
}

/** Wandelt Minuten in eine Lesedauer-Angabe um. */
export function formatReadingTime(minutes: number): string {
  return `${minutes} Min. Lesezeit`
}
