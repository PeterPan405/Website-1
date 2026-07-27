/**
 * Die Kennzahlen zu einem Kurs.
 *
 * Eigenes Modul ohne Importe, damit sich die Rechnung unter `tests/` direkt
 * prüfen lässt – dieselbe Aufteilung wie bei `lib/market-range.ts`. Der Anlass
 * ist derselbe: In dieser Rechnung steckten drei Fehler, die von außen nur als
 * „die Zahlen stimmen nicht“ auffielen.
 *
 * ## Was schiefging
 *
 * **Die Tagesveränderung wurde nach Börsenschluss null.** Verglichen wurde der
 * laufende Kurs mit dem letzten Schlusskurs der Reihe. Sobald der Anbieter den
 * heutigen Schluss geliefert hat, ist der laufende Kurs genau dieser Schluss –
 * die Zahl verglich sich also mit sich selbst. Jeder Abruf nach Handelsschluss
 * zeigte deshalb ±0,00 Prozent. Verglichen wird jetzt gegen den letzten
 * Schlusskurs eines **früheren** Tages.
 *
 * **Das 52-Wochen-Hoch waren 252 Punkte, nicht 52 Wochen.** Bei Aktien und
 * Indizes geht das ungefähr auf, weil ein Börsenjahr rund 252 Handelstage hat.
 * Bitcoin handelt an sieben Tagen die Woche: Dort waren 252 Punkte gut acht
 * Monate, ausgewiesen als Jahreshoch. Derselbe Fehler wie bei den
 * Chart-Zeiträumen, nur an einer zweiten Stelle.
 *
 * **Bezugspunkt war der letzte Schlusskurs statt des angezeigten Werts.** Wenn
 * ein laufender Kurs vorliegt, muss er auch die Grundlage für Jahreshoch und
 * Jahresvergleich sein – sonst widersprechen sich die Zahlen auf derselben
 * Kachel.
 */

/** Ein Punkt der Kursreihe. `t` beginnt mit `YYYY-MM-DD`. */
export interface QuotePoint {
  t: string
  value: number
}

/** Der zuletzt gehandelte Preis mit Zeitpunkt. */
export interface QuoteLatest {
  value: number
  /** ISO 8601 mit Zeitzone. */
  at: string
}

export interface QuoteFigures {
  /** Der angezeigte Kurs: laufender Preis, sonst letzter Schlusskurs. */
  value: number
  /** Der Schlusskurs, gegen den die Tagesveränderung gemessen wird. */
  previousClose: number
  change: number
  changePercent: number
  high52w: number
  low52w: number
  ytdPercent: number
  /** Ob `value` ein laufender Kurs ist. */
  intraday: boolean
}

/** Der Tagesanteil eines Zeitstempels. */
function tag(wert: string): string {
  return wert.slice(0, 10)
}

/** Wie weit das Fenster für Hoch und Tief zurückreicht. */
const JAHR_IN_TAGEN = 366

export function computeQuoteFigures(
  daily: readonly QuotePoint[],
  latest: QuoteLatest | null
): QuoteFigures {
  const letzter = daily[daily.length - 1]
  const wert = latest?.value ?? letzter.value

  /*
    Der Tag, auf den sich alles bezieht.

    Bei einem laufenden Kurs ist das sein Tag, sonst der des letzten
    Schlusskurses. Nicht der heutige: Die Website wird statisch gebaut, und an
    einem Montagmorgen ist der jüngste Schlusskurs der vom Freitag.
  */
  const bezugstag = latest ? tag(latest.at) : tag(letzter.t)

  /*
    Der Schlusskurs, gegen den gemessen wird.

    Entscheidend ist `< bezugstag`, nicht einfach „der vorletzte Punkt“. Nach
    Handelsschluss liefert der Anbieter den heutigen Schluss sowohl in der Reihe
    als auch als laufenden Kurs; ohne diese Bedingung verglich sich der Wert mit
    sich selbst und die Veränderung war null.
  */
  const vergleichspunkt =
    [...daily].reverse().find((punkt) => tag(punkt.t) < bezugstag) ??
    daily[daily.length - 2] ??
    letzter
  const vergleich = vergleichspunkt.value

  // Hoch und Tief über zwölf Monate – nach Datum, nicht nach Anzahl Punkte.
  const jahresgrenze = Date.parse(`${bezugstag}T00:00:00Z`) - JAHR_IN_TAGEN * 86_400_000
  const imJahr = daily.filter(
    (punkt) => Date.parse(`${tag(punkt.t)}T00:00:00Z`) >= jahresgrenze
  )
  /*
    Der angezeigte Wert zählt mit.

    Sonst könnte der Kurs auf der Kachel über dem darunter ausgewiesenen
    Jahreshoch liegen – und die Kennzahl „Abstand zum 52-Wochen-Hoch“ wäre
    positiv, obwohl sie den Abstand nach unten meint.
  */
  const werte = [...imJahr.map((punkt) => punkt.value), wert]

  // Letzter Schlusskurs des Vorjahres – Grundlage der Jahresveränderung.
  const jahr = bezugstag.slice(0, 4)
  const vorjahresschluss =
    [...daily].reverse().find((punkt) => punkt.t.slice(0, 4) < jahr)?.value ??
    daily[0].value

  const change = wert - vergleich

  return {
    value: wert,
    previousClose: vergleich,
    change,
    changePercent: vergleich === 0 ? 0 : (change / vergleich) * 100,
    high52w: Math.max(...werte),
    low52w: Math.min(...werte),
    ytdPercent:
      vorjahresschluss === 0 ? 0 : ((wert - vorjahresschluss) / vorjahresschluss) * 100,
    intraday: Boolean(latest),
  }
}
