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
 * **Alles, was auf der Marktübersicht als Kachel steht** – Indizes, ETFs,
 * Rohstoffe, Devisen, Krypto. Nicht die Einzelaktien: davon gibt es über
 * tausend, und wer eine bestimmte sucht, landet auf ihrer eigenen Seite.
 *
 * Bis zum 10. August 2026 standen hier dreizehn Werte, ausgewählt nach
 * „was am meisten gesehen wird“. Der Betreiber hat gemeldet, was daraus
 * folgte: Auf derselben Seite stand der S&P 500 auf dem Stand von 17:43 und
 * Kupfer auf dem von 17:02. Der Unterschied war für niemanden nachvollziehbar,
 * denn beide Kacheln sehen gleich aus.
 *
 * Die Sorge, die hinter der kurzen Liste stand, hat sich erledigt: Teuer war
 * nie der Abruf, sondern der Neubau danach. Der Fünf-Minuten-Lauf baut nicht –
 * er legt `kurse-live.json` auf den Server, und der Browser holt sich die
 * Zahl. Ob diese Datei dreizehn oder sechsundvierzig Kurse enthält, ändert an
 * der Laufzeit Sekunden und am Bau gar nichts.
 *
 * Die acht `BEZUGSWERTE` aus `lib/wochenrechnung.ts` sind vollständig
 * enthalten – der Wochenbericht rechnet mit ihnen, und ein Wochenbericht aus
 * veralteten Zahlen wäre der auffälligste Fehler von allen. Der Test
 * `tests/leitwerte.test.ts` hält das fest.
 */
export const LEITWERTE = [
  // Indizes – alle, die als Kachel auf der Übersicht stehen.
  'dax',
  'sp500',
  'nasdaq-100',
  'euro-stoxx-50',
  'msci-world',
  'dow-jones',
  'nikkei-225',
  'hang-seng',
  'kospi',
  'russell-2000',
  'mdax',
  'tecdax',
  'sdax',
  'smi',
  'cac-40',
  'ftse-100',
  'nifty-50',
  'tsx-composite',
  'asx-200',
  'ibovespa',
  'omx-stockholm-30',
  'taiex',
  // ETFs – dieselbe Übersicht, dieselbe Erwartung an die Zahl darauf.
  'etf-msci-world',
  'etf-ftse-all-world',
  'etf-sp500',
  'etf-em-imi',
  'etf-dax',
  'etf-stoxx-600',
  'etf-world-small-cap',
  'etf-geldmarkt',
  // Rohstoffe – vollständig. Kupfer und Erdgas standen vorher zwei Stunden.
  'gold',
  'silber',
  'brent',
  'wti',
  'platin',
  'palladium',
  'kupfer',
  'erdgas',
  // Krypto – handelt an 365 Tagen und bewegt sich auch nachts.
  'bitcoin',
  'ethereum',
  'xrp',
  /*
    Devisen – im Fünf-Minuten-Lauf übersprungen, aber bewusst hier gelistet.

    Die EZB stellt einen Referenzkurs je Tag fest, keinen laufenden; ein Abruf
    alle fünf Minuten hätte nichts Neues. `scripts/kurse-abrufen.ts` lässt sie
    deshalb genau in diesem Lauf aus und holt sie im Zwei-Stunden-Lauf.

    Sie stehen hier, weil diese Liste beschreibt, was auf der Übersicht als
    Kachel erscheint – und weil ein Symbol, das hier fehlt, im Fünf-Minuten-
    Lauf gar nicht erst betrachtet wird.
  */
  'eur-usd',
  'eur-chf',
  'eur-gbp',
  'eur-jpy',
  'eur-cny',
] as const

export type Leitwert = (typeof LEITWERTE)[number]

/** Gehört dieses Symbol zu den stündlich aufgefrischten Leitwerten? */
export function istLeitwert(symbol: string): boolean {
  return (LEITWERTE as readonly string[]).includes(symbol)
}
