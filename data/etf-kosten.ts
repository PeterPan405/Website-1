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
 *
 * ## Was am 9. August 2026 versucht wurde – und woran es lag
 *
 * Damit sich niemand dieselbe Stunde noch einmal nimmt.
 *
 * **fondsweb.com liefert eine Zahl, aber nicht diese.** Die Seiten sind ohne
 * JavaScript lesbar und über `quellen-holen.yml` mit `suche=Summe laufende
 * Kosten` in einem Lauf für alle acht Fonds abzufragen. Nur passen die Werte
 * nicht:
 *
 *     Fonds                       fondsweb   TER des Anbieters
 *     iShares Core S&P 500          0,07 %   0,07 %
 *     iShares Core MSCI EM IMI      0,22 %   0,18 %
 *     iShares Core DAX              0,17 %   0,16 %
 *     iShares STOXX Europe 600      0,21 %   0,20 %
 *     iShares MSCI World Small Cap  0,36 %   0,35 %
 *     Xtrackers EUR Overnight       0,10 %   0,10 %
 *
 * Die Abweichung geht immer in dieselbe Richtung und ist mal null, mal vier
 * Hundertstel. Das ist keine Rundung, sondern eine andere Größe – vermutlich
 * mit Transaktionskosten. Genau die Verwechslung, vor der Schritt 2 oben
 * warnt. Eingetragen wurde deshalb **nichts**.
 *
 * **Das Basisinformationsblatt kommt nicht durch.** Die Adresse ist
 * vorhersagbar:
 *
 *     https://www.ishares.com/de/privatanleger/de/literature/kiid/
 *       eu-priips-ishares-core-msci-world-ucits-etf-ie00b4l5y983-de.pdf
 *
 * Sie antwortet mit **200 und `text/html`** statt mit der PDF: iShares
 * schiebt die Anlegertyp-Abfrage davor. Der Läufer kann seit demselben Tag
 * PDFs lesen – hier bekommt er keine.
 *
 * **Der nächste Versuch** braucht also entweder eine Quelle, die das
 * Basisinformationsblatt ohne Zustimmungssperre ausliefert, oder einen
 * Menschen, der die acht Dokumente einmal im Browser öffnet und die Werte
 * hier einträgt. Das ist Arbeit von zwanzig Minuten und danach zwei Jahre
 * lang erledigt.
 *
 * ## Nachgetragen am 5. September 2026: wo der nächste Versuch anfängt
 *
 * Nicht bei fondsweb. **justETF antwortet einem Läufer** (200, ohne
 * JavaScript lesbar) und beschriftet die Zahl ausdrücklich mit „TER" – für
 * `IE00B4L5Y983` steht dort `TER 0,20% p.a.`. Das ist der Unterschied zu
 * fondsweb, dessen „Summe laufende Kosten" oben in sechs von sechs Fällen
 * daneben lag: Dort war die **Beschriftung** das Problem, nicht die Seite.
 *
 * Eingetragen ist trotzdem **nichts**, und zwar nicht aus Vorsicht, sondern
 * weil es die Angabe nicht vollständig macht: Schritt 3 oben verlangt Wert,
 * **Datum des Dokuments** und dessen Adresse. Ein Aggregator nennt kein
 * Dokument. Wer von dort abschreibt, hat eine Zahl ohne Stand – und
 * `npm run frische` kann sie dann nie als veraltet melden, weil sie nie ein
 * Alter hatte.
 *
 * justETF taugt damit als **Gegenprobe**, nicht als Quelle: Wer die acht
 * Blätter im Browser öffnet, kann die abgelesenen Werte dort gegenlesen und
 * merkt einen Tippfehler sofort.
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
