/**
 * Reine Suchlogik ohne Abhängigkeiten.
 *
 * Eigenes Modul ohne Importe, damit sich die Regeln unter `tests/` direkt prüfen
 * lassen – dieselbe Aufteilung wie bei `lib/resolve-site-url.ts`. Die Daten
 * kommen aus `lib/search.ts`, hier steht nur, was als Treffer gilt und in
 * welcher Reihenfolge.
 */

export interface SearchEntry {
  title: string
  href: string
  /** Bereichsname für die Gruppierung in der Ergebnisliste. */
  kind: string
  /** Ein Satz unter dem Titel. */
  hint?: string
  /** Zusätzliche Begriffe, die auf den Eintrag führen sollen. */
  keywords?: string[]
  /**
   * Erscheinungstag im Format `JJJJ-MM-TT`, wo es einen gibt.
   *
   * Nur datierte Einträge tragen ihn – Nachrichten, Tagesausgaben,
   * Podcastfolgen, Jahresrückblicke. Ein Kurs oder ein Rechner hat kein
   * Erscheinungsdatum, und ein erfundenes wäre schlimmer als keines: Der
   * Altersfilter in `lib/such-filter.ts` behandelt „kein Datum" ausdrücklich
   * nicht wie „von heute".
   */
  datum?: string
  /** Die Lernstufe, wo es eine gibt – `beginner`, `fortgeschritten`, `profi`. */
  stufe?: string
}

/**
 * Vereinheitlicht Text für den Vergleich.
 *
 * Umlaute werden ausgeschrieben, nicht nur zerlegt: Wer „maerkte“ tippt, meint
 * „Märkte“, und wer „Märkte“ tippt, soll dasselbe finden. Eine reine
 * Diakritika-Entfernung machte daraus „markte“ und träfe die Eingabe „maerkte“
 * nicht.
 */
export function normalize(value: string): string {
  return (
    value
      .toLowerCase()
      .replaceAll('ä', 'ae')
      .replaceAll('ö', 'oe')
      .replaceAll('ü', 'ue')
      .replaceAll('ß', 'ss')
      .normalize('NFD')
      // Verbliebene Akzente entfernen, etwa in „Société“.
      .replace(/[\u0300-\u036f]/g, '')
  )
}

/** Zerlegt die Eingabe in Wörter und wirft Leeres weg. */
export function tokenize(query: string): string[] {
  return normalize(query)
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

/**
 * Bewertet einen Eintrag gegen die Suchbegriffe.
 *
 * Gibt `null` zurück, wenn nicht **jeder** Begriff vorkommt. Das ist Absicht:
 * Zwei Begriffe schränken ein, statt die Treffermenge zu erweitern – „aktie
 * steuern“ soll nicht alles zu Aktien und alles zu Steuern zeigen.
 */
export function scoreEntry(entry: SearchEntry, tokens: string[]): number | null {
  if (tokens.length === 0) return null

  const titel = normalize(entry.title)
  const rest = normalize([entry.hint ?? '', ...(entry.keywords ?? [])].join(' '))

  let punkte = 0

  for (const token of tokens) {
    const imTitel = titel.indexOf(token)
    const imRest = rest.indexOf(token)

    if (imTitel === -1 && imRest === -1) return null

    if (imTitel === 0) {
      // Titelanfang: Wer „zins“ tippt, will den Zinsrechner ganz oben sehen.
      punkte += 100
    } else if (imTitel > 0) {
      // Weiter hinten im Titel – gut, aber schwächer als der Anfang.
      punkte += 60
    } else {
      punkte += 20
    }
  }

  // Kürzere Titel gewinnen bei gleicher Trefferlage: „Aktie“ vor
  // „Aktie – Fortgeschritten“, weil das Allgemeinere der wahrscheinlichere
  // Einstieg ist.
  punkte -= Math.min(titel.length, 40) / 10

  return punkte
}

/**
 * Durchsucht den Index und liefert die besten Treffer.
 *
 * Bei Gleichstand entscheidet die Reihenfolge im Index. Die ist in
 * `lib/search.ts` bewusst gesetzt: erst Bereiche, dann Lernthemen, dann alles
 * Weitere.
 */
export function searchEntries(
  entries: SearchEntry[],
  query: string,
  limit = 8
): SearchEntry[] {
  const tokens = tokenize(query)
  if (tokens.length === 0) return []

  const bewertet: { entry: SearchEntry; punkte: number; position: number }[] = []

  entries.forEach((entry, position) => {
    const punkte = scoreEntry(entry, tokens)
    if (punkte !== null) bewertet.push({ entry, punkte, position })
  })

  bewertet.sort((a, b) => b.punkte - a.punkte || a.position - b.position)

  return bewertet.slice(0, limit).map((treffer) => treffer.entry)
}
