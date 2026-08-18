/**
 * An welchen Tagen eine Börse geschlossen war – abgelesen, nicht abgeschrieben.
 *
 * ## Warum abgelesen
 *
 * Weil die veröffentlichten Kalender aus dieser Umgebung nicht zu erreichen
 * sind. Am 17. und 18. August 2026 geprüft, jeweils über einen Läufer mit
 * vollem Netzzugang:
 *
 * - NYSE, Xetra, Euronext, London: liefern nur Navigationsmenüs, die Tabellen
 *   werden per JavaScript nachgeladen
 * - SIX Group, JPX: 404
 * - `api.boerse-frankfurt.de/v1/data/trading_calendar`: antwortet mit `{}`
 * - npm-Pakete: `fincal` zuletzt 2022 gepflegt, die beiden anderen Kandidaten
 *   sind Ein-Personen-Pakete in Version 1.0.0 – und alle drei decken nur die
 *   USA ab
 *
 * Eine Feiertagsliste aus dem Gedächtnis zu schreiben kam nicht in Frage: Ein
 * falsches Datum behauptet „Börse geschlossen" an einem Handelstag, und das
 * ist genau die Sorte stiller Fehler, gegen die dieses Projekt sonst überall
 * Riegel baut.
 *
 * ## Was stattdessen geht
 *
 * Die Kursreihen liegen ohnehin vor. Wenn an einem Werktag **keine einzige**
 * Aktie eines Handelsplatzes einen Kurs hat, war der Platz zu. Das ist keine
 * Schätzung, sondern eine Beobachtung – und sie deckt sich für die geprüften
 * Plätze exakt mit den bekannten Feiertagen: zehn für die USA, acht für Xetra,
 * acht für London.
 *
 * Der Preis dafür steht in der ersten Zeile jeder Ausgabe: Das ist die
 * **Vergangenheit**. Ein Blick nach vorn bräuchte den veröffentlichten
 * Kalender, und der ist von hier aus nicht zu haben.
 *
 * ## Die beiden Absicherungen
 *
 * **Erstens, innerhalb eines Platzes:** Ein Tag zählt nur dann als
 * handelsfrei, wenn keine einzige Reihe einen Kurs hat. Hat ein Teil der
 * Reihen einen und der Rest nicht, ist das eine Datenlücke und kein Feiertag –
 * solche Tage kommen als `unklar` heraus und nicht als Feiertag. Bei Toronto
 * greift das an echtem Material: An fünf kanadischen Feiertagen tragen 7 von
 * 33 Reihen trotzdem einen Kurs, weil diese Titel auch in New York notieren.
 *
 * **Zweitens, über den Platz selbst:** Wer Montag bis Freitag handelt, muss in
 * jeder dieser fünf Spalten ungefähr gleich viele Tage haben. Australien und
 * Neuseeland haben **null Freitage** und stattdessen Sonntage – dort ist das
 * Datum der Quelle um zwei Tage verschoben. Ein solcher Platz wird nicht
 * ausgewertet, sondern mit Grund abgewiesen: Sonst stünde auf der Seite
 * „Sydney war an 32 Tagen geschlossen", und jeder zweite davon wäre ein
 * ganz normaler Freitag.
 *
 * ## Warum nur Montag bis Freitag ausgewertet wird
 *
 * Saudi-Arabien und Katar haben ebenfalls keine Freitage – dort ist es aber
 * die echte Handelswoche von Sonntag bis Donnerstag. Der erste Anlauf wollte
 * beides auseinanderhalten, indem er den am besten besetzten Block von fünf
 * zusammenhängenden Tagen sucht. **Das geht nicht.** Neuseeland hat null
 * Freitage und 48 Sonntage; von den Wochentagszahlen her ist das von Tadawul
 * nicht zu unterscheiden. Die Prüfung ließ Neuseeland durch, und der Test hat
 * es gefunden.
 *
 * Verlangt wird deshalb Montag bis Freitag. Wessen Kurse woanders liegen, wird
 * abgewiesen – ohne Urteil darüber, ob es an der Quelle oder am Platz liegt.
 * Für die Golf-Börsen kostet das nichts: Tadawul führt hier vier Reihen, Katar
 * zwei, und damit liegen beide ohnehin unter der Mindestzahl. Eine
 * Fallunterscheidung über ein Merkmal, das der Bestand nicht hergibt, wäre
 * keine.
 *
 * Ohne Importe, damit `tests/` das Modul direkt laden kann.
 */

/** Die Handelswoche eines Platzes, als Wochentage (0 = Sonntag). */
export type Handelswoche = readonly number[]

/** Montag bis Freitag – die Woche fast aller Plätze. */
export const WOCHE_MO_FR: Handelswoche = [1, 2, 3, 4, 5]

/** Was an einem einzelnen Tag zu sehen war. */
export interface Tagbefund {
  /** ISO-Datum. */
  tag: string
  /** Wie viele der geprüften Reihen an diesem Tag einen Kurs haben. */
  mitKurs: number
  /** Wie viele Reihen geprüft wurden. */
  geprueft: number
  /**
   * `handelsfrei` – keine einzige Reihe hat einen Kurs.
   * `unklar` – ein Teil schon, der Rest nicht. Das ist eine Datenlücke oder
   * eine Zweitnotierung, kein Feiertag.
   */
  art: 'handelsfrei' | 'unklar'
}

/** Warum ein Platz nicht ausgewertet wird. */
export type Abweisungsgrund =
  /** Weniger Reihen als verlangt. */
  | 'zuWenigReihen'
  /** Die Wochentage sind ungleich besetzt – das Datum der Quelle stimmt nicht. */
  | 'datumVerschoben'

export type Platzbefund =
  | { art: 'ausgewertet'; tage: Tagbefund[]; reihen: number; werktage: number }
  | { art: 'abgewiesen'; grund: Abweisungsgrund; erlaeuterung: string; reihen: number }

/**
 * Zählt die Kurstage je Wochentag – die Grundlage der zweiten Absicherung.
 *
 * Ergebnis ist ein Feld mit sieben Zahlen, Index 0 ist Sonntag. Absichtlich
 * ohne `Date`-Arithmetik über Zeitzonen: Das ISO-Datum wird zerlegt und mit
 * `Date.UTC` gelesen, damit die Antwort nicht davon abhängt, wo der Bau läuft.
 */
export function nachWochentag(tage: Iterable<string>): number[] {
  const zaehler = [0, 0, 0, 0, 0, 0, 0]
  for (const tag of tage) {
    const wochentag = wochentagVon(tag)
    if (wochentag !== null) zaehler[wochentag] += 1
  }
  return zaehler
}

/** Der Wochentag eines ISO-Datums, 0 = Sonntag. `null`, wenn unlesbar. */
export function wochentagVon(tag: string): number | null {
  const treffer = /^(\d{4})-(\d{2})-(\d{2})$/.exec(tag)
  if (!treffer) return null
  const zeit = Date.UTC(Number(treffer[1]), Number(treffer[2]) - 1, Number(treffer[3]))
  return Number.isNaN(zeit) ? null : new Date(zeit).getUTCDay()
}

/**
 * Sitzt das Datum richtig?
 *
 * Zwei Bedingungen, und beide sind nötig:
 *
 * 1. **Fast alle Kurstage liegen von Montag bis Freitag.** Ein Platz mit
 *    Kursen am Wochenende hat entweder eine andere Handelswoche oder ein
 *    verschobenes Datum – auswerten lässt sich hier weder das eine noch das
 *    andere.
 * 2. **Keiner der fünf Tage ist auffällig leer.** Australien erfüllt die
 *    erste Bedingung nicht ganz und diese gar nicht: 26 Freitage gegen 52
 *    Dienstage.
 *
 * `anteilImBlock` ist bewusst streng: Ein Platz, dessen Kurse zu einem
 * Fünfzigstel außerhalb der Woche liegen, hat ein Datumsproblem und keine
 * Sonderöffnung.
 */
export function datumSitzt(
  jeWochentag: readonly number[],
  mindestanteil = 0.98
): { gut: boolean; woche: number[]; anteilImBlock: number; schwaechster: number } {
  const gesamt = jeWochentag.reduce((summe, zahl) => summe + zahl, 0)
  const imBlock = WOCHE_MO_FR.map((tag) => jeWochentag[tag])
  const anteilImBlock =
    gesamt === 0 ? 0 : imBlock.reduce((summe, zahl) => summe + zahl, 0) / gesamt

  const staerkster = Math.max(...imBlock)
  const schwaechster = staerkster === 0 ? 0 : Math.min(...imBlock) / staerkster

  /*
    Der schwächste Tag muss deutlich mehr als halb so voll sein wie der stärkste.

    Bei einem gesunden Platz liegt das Verhältnis nahe eins – ein paar
    Feiertage fallen mal auf den einen, mal auf den anderen Wochentag.
    Australien kommt auf 26 zu 52, also auf 0,5 genau. Die Grenze liegt deshalb
    **über** einem halb: Eine Grenze, die den kaputten Fall gerade eben trägt,
    wäre eine Wette.
  */
  return {
    gut: anteilImBlock >= mindestanteil && schwaechster > 0.55,
    woche: [...WOCHE_MO_FR],
    anteilImBlock,
    schwaechster,
  }
}

/** Alle Tage der Handelswoche zwischen zwei Daten, aufsteigend. */
export function werktageZwischen(
  von: string,
  bis: string,
  woche: Handelswoche = WOCHE_MO_FR
): string[] {
  const tage: string[] = []
  const erlaubt = new Set(woche)
  const ende = Date.parse(`${bis}T00:00:00Z`)
  let zeit = Date.parse(`${von}T00:00:00Z`)
  if (Number.isNaN(zeit) || Number.isNaN(ende)) return tage

  while (zeit <= ende) {
    const tag = new Date(zeit)
    if (erlaubt.has(tag.getUTCDay())) tage.push(tag.toISOString().slice(0, 10))
    zeit += 86_400_000
  }
  return tage
}

/**
 * Der Befund für einen Handelsplatz.
 *
 * `reihen` sind die Kurstage je Instrument, als Mengen von ISO-Daten. Eine
 * Reihe, die den Zeitraum gar nicht abdeckt, gehört nicht hinein – sie erzeugte
 * lauter Feiertage.
 */
export function platzbefund(
  reihen: readonly ReadonlySet<string>[],
  von: string,
  bis: string,
  mindestReihen = 5
): Platzbefund {
  if (reihen.length < mindestReihen) {
    return {
      art: 'abgewiesen',
      grund: 'zuWenigReihen',
      erlaeuterung:
        `${reihen.length} ${reihen.length === 1 ? 'Kursreihe reicht' : 'Kursreihen reichen'} nicht – ` +
        'ein einzelner Ausfall sähe aus wie ein Feiertag.',
      reihen: reihen.length,
    }
  }

  const alleTage = reihen.flatMap((menge) => [...menge])
  const sitzt = datumSitzt(nachWochentag(alleTage))

  if (!sitzt.gut) {
    return {
      art: 'abgewiesen',
      grund: 'datumVerschoben',
      erlaeuterung:
        `Die Kurstage verteilen sich ungleich über die Handelswoche ` +
        `(schwächster Tag ${(sitzt.schwaechster * 100).toFixed(0)} % des stärksten). ` +
        `Das Datum der Quelle ist verschoben; ein Feiertagsbefund daraus wäre erfunden.`,
      reihen: reihen.length,
    }
  }

  const tage: Tagbefund[] = []
  const werktage = werktageZwischen(von, bis, sitzt.woche)

  for (const tag of werktage) {
    const mitKurs = reihen.reduce((summe, menge) => summe + (menge.has(tag) ? 1 : 0), 0)
    if (mitKurs === 0) {
      tage.push({ tag, mitKurs, geprueft: reihen.length, art: 'handelsfrei' })
    } else if (mitKurs < reihen.length / 2) {
      tage.push({ tag, mitKurs, geprueft: reihen.length, art: 'unklar' })
    }
  }

  return { art: 'ausgewertet', tage, reihen: reihen.length, werktage: werktage.length }
}

/**
 * Die Börsenendung eines Kürzels – `BMW.DE` wird zu `DE`, `AAPL` zu `US`.
 *
 * Yahoo hängt an jedes Kürzel außerhalb der USA die Börse an. Das ist keine
 * offizielle Kennung, aber die einzige, die in diesem Bestand durchgängig
 * vorhanden ist – und sie trennt sauber, was hier getrennt werden muss.
 */
export function boersenkuerzel(ticker: string): string {
  const treffer = /\.([A-Z]+)$/.exec(ticker)
  return treffer ? treffer[1] : 'US'
}
