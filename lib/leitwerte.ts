/**
 * Die Leitwerte – die Instrumente, die stündlich aufgefrischt werden.
 *
 * ## Warum es diese Liste gibt
 *
 * Bis August 2026 stand im Zeitplan „alle dreißig Minuten, alle tausend
 * Instrumente". Beides war zusammen nicht haltbar, und zwar aus einem Grund,
 * der nicht am Abruf liegt: Der Kursabruf selbst dauert Sekunden. Teuer ist,
 * was **danach** passiert – jeder Kurs-Commit stößt einen vollständigen
 * Neubau der 1.484 Seiten und eine Übertragung auf den Webspace an. Gemessen
 * am 3. August 2026: 0,6 Minuten Abruf, 7,1 Minuten Bau, 5,7 Minuten
 * Veröffentlichung. Dreißig Läufe am Werktag wären über 8.000 Minuten im
 * Monat gewesen – bei 2.000 enthaltenen.
 *
 * Die Folge war nicht etwa ein teurer Betrieb, sondern gar keiner: GitHub hat
 * die geplanten Läufe schlicht verworfen. Am 31. Juli kamen von dreißig
 * Läufen acht durch, am 3. August keiner.
 *
 * ## Die Aufteilung
 *
 * Deshalb zwei Takte statt einem (Nutzerentscheidung vom 3. August 2026):
 *
 * - **Stündlich** nur diese Leitwerte – die Zahlen, die auf der Startseite,
 *   in der Marktübersicht und im Wochenbericht stehen und die jeder sieht,
 *   der die Seite öffnet.
 * - **Alle zwei Stunden** der volle Bestand, damit auch die Einzelaktien
 *   nachziehen.
 *
 * ## Was hineingehört
 *
 * Was ein Besucher ohne Suche zu Gesicht bekommt. Nicht: jeder Titel, den
 * jemand interessant findet – die Liste ist keine Rangfolge nach Bedeutung,
 * sondern nach Sichtbarkeit. Wächst sie über etwa zwanzig Einträge, ist der
 * Unterschied zum vollen Abruf keiner mehr und die Aufteilung sinnlos.
 *
 * Die acht `BEZUGSWERTE` aus `lib/wochenrechnung.ts` sind vollständig
 * enthalten – der Wochenbericht rechnet mit ihnen, und ein Wochenbericht aus
 * veralteten Zahlen wäre der auffälligste Fehler von allen. Der Test
 * `tests/leitwerte.test.ts` hält das fest.
 */
export const LEITWERTE = [
  // Indizes – die sechs, die auf der Startseite und in der Übersicht stehen.
  'dax',
  'sp500',
  'nasdaq-100',
  'euro-stoxx-50',
  'msci-world',
  'nikkei-225',
  // Rohstoffe – Gold und Öl treiben die Schlagzeilen, Silber läuft mit Gold.
  'gold',
  'silber',
  'brent',
  // Krypto – handelt an 365 Tagen und bewegt sich auch nachts.
  'bitcoin',
  'ethereum',
  // Devisen – der Euro-Dollar-Kurs steht an jeder Fremdwährungsangabe.
  'eur-usd',
] as const

export type Leitwert = (typeof LEITWERTE)[number]

/** Gehört dieses Symbol zu den stündlich aufgefrischten Leitwerten? */
export function istLeitwert(symbol: string): boolean {
  return (LEITWERTE as readonly string[]).includes(symbol)
}
