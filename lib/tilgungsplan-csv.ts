import type { Tilgungsmonat } from '@/lib/kredit'

/**
 * Der Tilgungsplan als CSV – nach denselben Regeln wie `kurse.csv` und die
 * Merkliste.
 *
 * Semikolon als Trenner, weil deutsche Tabellenkalkulationen mit dem Komma als
 * Dezimalzeichen arbeiten; Zahlen mit Punkt, weil das jede Weiterverarbeitung
 * liest; deutsche Spaltennamen, weil die Datei für Menschen bestimmt ist, die
 * diese Website lesen. **Gleiches Format, eine Erwartung** – wer zwei Dateien
 * von hier öffnet, soll nicht zwei Konventionen lernen.
 *
 * ## Warum überhaupt eine Tabelle
 *
 * Weil ein Tilgungsplan die einzige Stelle ist, an der ein Kredit ehrlich
 * aussieht. Auf der Seite stehen 360 Zeilen; wer damit rechnen will – gegen
 * ein Bankangebot halten, in eine eigene Tabelle einbauen, dem Steuerberater
 * geben –, braucht sie als Datei und nicht als Bild.
 *
 * Rein und geprüft, weil die Datei im Browser entsteht: Ein Fehler hier fiele
 * in keiner Bauprüfung auf, sondern erst in der Tabellenkalkulation eines
 * Besuchers.
 */

/** Ein Feld je Regelwerk: Semikolon oder Zeilenumbruch erzwingen Anführungszeichen. */
function feld(wert: string): string {
  if (/[";\n]/.test(wert)) return `"${wert.replaceAll('"', '""')}"`
  return wert
}

export interface Tilgungskopf {
  summe: number
  zinsProzent: number
  rate: number
  sondertilgungProJahr: number
}

export function baueTilgungsplanCsv(
  plan: readonly Tilgungsmonat[],
  kopfdaten: Tilgungskopf
): string {
  /*
    Die Annahmen stehen als Kommentarzeilen darüber.

    Ein Tilgungsplan ohne Zinssatz und Rate ist eine Zahlenkolonne, die man
    nach zwei Wochen keinem Angebot mehr zuordnen kann. Wer zwei Angebote
    vergleicht, hat dann zwei Dateien und weiß nicht mehr, welche welche ist.
  */
  const kopf = [
    `# Tilgungsplan – ${kopfdaten.summe.toFixed(2)} € zu ${kopfdaten.zinsProzent.toFixed(2)} % Nominalzins`,
    `# Monatliche Rate ${kopfdaten.rate.toFixed(2)} €` +
      (kopfdaten.sondertilgungProJahr > 0
        ? `, Sondertilgung ${kopfdaten.sondertilgungProJahr.toFixed(2)} € je Jahr (jeweils im 12. Monat)`
        : ', ohne Sondertilgung'),
    '# Modellrechnung ohne Nebenkosten, Gebühren und Restschuldversicherung.',
    'Monat;Jahr;Zins;Tilgung;Sondertilgung;Restschuld',
  ]

  const zeilen = plan.map((monat) =>
    [
      String(monat.monat),
      /* Das Kalenderjahr kennt die Rechnung nicht – gemeint ist das Kreditjahr. */
      String(Math.ceil(monat.monat / 12)),
      monat.zins.toFixed(2),
      monat.tilgung.toFixed(2),
      monat.sondertilgung.toFixed(2),
      monat.restschuld.toFixed(2),
    ]
      .map(feld)
      .join(';')
  )

  return [...kopf, ...zeilen].join('\n') + '\n'
}
