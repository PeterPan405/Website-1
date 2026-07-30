/**
 * Die laufenden Kosten der geführten ETFs.
 *
 * ## Warum diese Liste von Hand geführt wird
 *
 * Weil es keine frei zugängliche Schnittstelle dafür gibt. Kurse liefert Yahoo,
 * Bilanzzahlen die Börsenaufsichten, Zinsen die EZB – die Kostenquote eines
 * Fonds steht in einem PDF beim Anbieter und sonst nirgends, jedenfenfalls
 * nirgends, was man ohne Lizenz abfragen dürfte.
 *
 * Das ist dieselbe Lage wie bei der ESEF-Zuordnung der Unternehmenszahlen, und
 * die Antwort ist dieselbe: eine Liste, die jemand gelesen und eingetragen hat,
 * mit der Quelle daneben. Ein Namenstreffer ist keine Zuordnung, und eine
 * Kostenquote aus dem Gedächtnis ist keine Angabe.
 *
 * ## Warum sie leer beginnt
 *
 * Weil sie aus einer Umgebung heraus angelegt wurde, aus der die Anbieterseiten
 * nicht erreichbar sind. Eine Zahl einzutragen, die niemand nachgeschlagen hat,
 * wäre der Fehler, den dieses Projekt an keiner Stelle macht: Sie sähe aus wie
 * eine belegte Angabe und wäre eine Erinnerung.
 *
 * Solange ein Fonds hier fehlt, sagt seine Seite das – und verweist auf das
 * Basisinformationsblatt. Das ist die ehrliche Auskunft und obendrein die
 * rechtlich maßgebliche: Verbindlich ist ohnehin das Dokument des Anbieters,
 * nicht die Wiedergabe auf einer fremden Website.
 *
 * ## Wie ein Eintrag entsteht
 *
 * 1. Das Basisinformationsblatt (PRIIP-KID) des Fonds öffnen. Es steht auf der
 *    Produktseite des Anbieters, auffindbar über die ISIN aus `data/markets.ts`.
 * 2. Unter „Kosten“ die **laufenden Kosten** ablesen, nicht die
 *    Gesamtkostenquote einer Beispielanlage: Die zweite enthält
 *    Transaktionskosten und Ausgabeaufschläge des Vertriebs und ist damit eine
 *    andere Größe.
 * 3. Wert, Datum des Dokuments und dessen Adresse hier eintragen.
 *
 * `npm run frische` meldet Einträge, deren Stand älter als zwei Jahre ist –
 * Anbieter senken die Kosten regelmäßig, und eine zu hohe Angabe ist genauso
 * falsch wie eine zu niedrige.
 */

export interface EtfKosten {
  /** Laufende Kosten je Jahr in Prozent, wie im Basisinformationsblatt. */
  laufendeKostenProzent: number
  /** Datum des Dokuments, aus dem der Wert stammt (`JJJJ-MM-TT`). */
  stand: string
  /** Adresse des Dokuments oder der Produktseite. */
  quelle: string
}

/**
 * Schlüssel ist das Symbol aus `data/markets.ts`.
 *
 * Absichtlich leer. Siehe oben: Was hier stünde, ohne nachgeschlagen worden zu
 * sein, wäre schlechter als die Lücke.
 */
export const etfKosten: Readonly<Record<string, EtfKosten>> = {}

/** Die Kosten eines Fonds, oder `null`. */
export function kostenFuer(symbol: string): EtfKosten | null {
  return etfKosten[symbol] ?? null
}
