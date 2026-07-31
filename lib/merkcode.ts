/**
 * Die Merkliste als kurzer Text zum Kopieren.
 *
 * ## Warum das nötig war
 *
 * Die Merkliste liegt im Speicher des Browsers und verlässt das Gerät nicht.
 * Das ist die gute Nachricht – und die Seite sagt selbst dazu, was es kostet:
 * Am Telefon steht eine andere Liste als am Rechner, und wer die Browserdaten
 * löscht, löscht sie mit. Es gab nur keinen Weg, sie mitzunehmen.
 *
 * Ein Konto wäre die übliche Antwort. Es wäre auch die schlechteste: Dann
 * müsste jemand eine Datenbank betreiben, in der steht, welche Aktien welcher
 * Mensch beobachtet – eine Aussage über sein Geld, die niemanden etwas angeht.
 * Ein Textschnipsel zum Kopieren löst dasselbe Problem, ohne dass ein einziges
 * Byte das Gerät verlässt.
 *
 * ## Warum kein JSON und kein Base64
 *
 * JSON ist lang und voller Zeichen, die ein Nachrichtenprogramm umbricht.
 * Base64 ist kurz, aber unlesbar – und wer einen Code weitergibt, den er nicht
 * lesen kann, weiß nicht, was er weitergibt. Hier stehen die Kürzel im
 * Klartext, durch Komma getrennt, mit einer Kennung davor. Man sieht dem Code
 * an, was drinsteht.
 *
 * ## Was der Code nicht enthält
 *
 * Den Zeitpunkt des Merkens. Er steht im Speicher und sortiert die Liste, aber
 * er gehört nicht in einen Code, den jemand weitergibt: Wann man einen Titel
 * ins Auge gefasst hat, ist eine Angabe über den Menschen und nicht über die
 * Aktie. Beim Einlesen bekommen alle Einträge den Zeitpunkt des Einlesens.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 */

/** Die Kennung am Anfang jedes Codes. */
export const VORSATZ = 'IMI1:'

/**
 * Macht aus Symbolen einen Code.
 *
 * Die Reihenfolge bleibt erhalten – sie ist die Reihenfolge der Liste, und
 * eine sortierte Ausgabe verlöre sie ohne Not.
 */
export function baueMerkcode(symbole: readonly string[]): string {
  return VORSATZ + symbole.join(',')
}

/**
 * Liest einen Code und gibt die enthaltenen Symbole zurück.
 *
 * Ungültige Zeichen fallen heraus, statt den ganzen Code zu verwerfen: Ein
 * Code, der beim Kopieren einen Zeilenumbruch abbekommen hat, ist immer noch
 * fast vollständig, und „nichts erkannt“ wäre die unfreundlichste Antwort.
 *
 * Doppelte Einträge werden zusammengefasst. Wer zwei Codes hintereinander
 * einliest, hat sonst denselben Titel zweimal in der Liste.
 */
export function leseMerkcode(roh: string): string[] {
  const text = roh.trim()
  const ohneVorsatz = text.startsWith(VORSATZ) ? text.slice(VORSATZ.length) : text

  const gesehen = new Set<string>()
  const ergebnis: string[] = []

  for (const teil of ohneVorsatz.split(/[,\s]+/)) {
    /*
      Erlaubt ist, was ein Symbol dieser Website sein kann: Kleinbuchstaben,
      Ziffern, Bindestrich. Alles andere kommt nicht aus dieser Liste – und
      etwas anderes einzulesen hieße, fremde Zeichen in den Speicher zu
      schreiben, aus dem später Adressen gebaut werden.
    */
    const sauber = teil.trim().toLowerCase()
    if (!sauber || !/^[a-z0-9-]+$/.test(sauber)) continue
    if (gesehen.has(sauber)) continue
    gesehen.add(sauber)
    ergebnis.push(sauber)
  }

  return ergebnis
}

/**
 * Ob sich aus einem Text überhaupt etwas herauslesen ließ.
 *
 * Für die Rückmeldung an der Eingabe. Was diese Funktion **nicht** kann, ist
 * Fließtext von einem Code unterscheiden: „hallo wie geht es dir“ besteht aus
 * lauter erlaubten Zeichenfolgen. Das ist hingenommen, weil die eingelesenen
 * Symbole anschließend gegen den Katalog gehalten werden – dort fällt jedes
 * Wort heraus, das kein Instrument ist, und die Rückmeldung lautet dann „keiner
 * dieser Einträge ist ein geführtes Instrument“ statt „kein Code“.
 */
export function siehtWieCodeAus(roh: string): boolean {
  return leseMerkcode(roh).length > 0
}
