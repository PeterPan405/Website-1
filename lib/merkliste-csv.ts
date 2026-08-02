import type { Merkdaten } from '@/components/markets/Merklistentafel'

/**
 * Die Merkliste als CSV, nach denselben Regeln wie `kurse.csv`.
 *
 * Semikolon als Trenner, weil deutsche Tabellenkalkulationen mit dem Komma
 * als Dezimalzeichen arbeiten; Zahlen mit Punkt, weil das jede
 * Weiterverarbeitung liest; deutsche Spaltennamen, weil die Datei für
 * Menschen bestimmt ist, die diese Website lesen. Die Begründungen im
 * Einzelnen stehen bei der Kursreihen-Route – hier gilt: **gleiches Format,
 * eine Erwartung.** Wer beide Dateien öffnet, soll nicht zwei Konventionen
 * lernen.
 *
 * Rein und getestet, weil die Datei im Browser entsteht: Ein Fehler hier
 * fiele in keiner Bauprüfung auf, sondern erst in der Tabellenkalkulation
 * eines Besuchers.
 */

/** Ein Feld je Regelwerk: Semikolon oder Zeilenumbruch erzwingen Anführungszeichen. */
function feld(wert: string): string {
  if (/[";\n]/.test(wert)) return `"${wert.replaceAll('"', '""')}"`
  return wert
}

export function baueMerklisteCsv(zeilen: readonly Merkdaten[], stand: string): string {
  const kopf = [
    `# Merkliste – Stand ${stand}`,
    '# Kurse und Renditen wie auf der Seite; erwartete Termine sind aus dem bisherigen Muster gerechnet, keine Ankündigungen.',
    'Symbol;Ticker;Name;Kurs;Einheit;Veraenderung_Prozent;Dividendenrendite_Prozent;Naechster_Termin;Terminart',
  ]

  const daten = zeilen.map((zeile) => {
    const termin = zeile.termine[0]
    return [
      feld(zeile.symbol),
      feld(zeile.ticker),
      feld(zeile.name),
      zeile.wert.toFixed(zeile.stellen),
      feld(zeile.einheit),
      zeile.veraenderung.toFixed(2),
      zeile.rendite === null ? '' : zeile.rendite.toFixed(2),
      termin ? termin.tag : '',
      termin ? feld(termin.art) : '',
    ].join(';')
  })

  return [...kopf, ...daten].join('\n') + '\n'
}
