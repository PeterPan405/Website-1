import verzeichnis from '@/data/lese-audio.json'

/**
 * Welche Seiten mit der eigenen Stimme gesprochen vorliegen.
 *
 * ## Warum ein Verzeichnis und nicht einfach ein Abruf
 *
 * Die Aufnahmen liegen auf dem Webspace unter `/lese-audio/…`, nicht im
 * Paket – 280 Megabyte in jedem Bau wären eine Übertragung von zwanzig
 * Minuten für Dateien, die sich nie ändern. Damit weiß der Bau nichts von
 * ihnen, und die Seite müsste beim Öffnen erst nachfragen, ob es eine gibt.
 *
 * Ein Abruf, der meistens mit 404 antwortet, ist eine schlechte Auskunft: Er
 * kostet auf jeder Seite eine Anfrage, und bis sie beantwortet ist, weiß die
 * Vorleseleiste nicht, was sie anbieten soll – Knopf oder kein Knopf, und
 * beides sähe man nacheinander.
 *
 * Das Verzeichnis beantwortet die Frage beim Bauen. Es ist klein (ein Eintrag
 * je Seite), es entsteht in demselben Lauf, der die Aufnahmen erzeugt, und es
 * trägt nebenbei die Angaben, die die Leiste ohnehin braucht: Dauer, Größe und
 * die Marken der Abschnitte.
 */

export interface Aufnahme {
  /** Fingerabdruck des gesprochenen Textes – siehe `lese-texte-schreiben.ts`. */
  hash: string
  sekunden: number
  bytes: number
  /** Sekunde, in der jeder Abschnitt beginnt. Länge = Zahl der Abschnitte. */
  marken: number[]
}

const aufnahmen = verzeichnis.aufnahmen as Record<string, Aufnahme>

/**
 * Die Aufnahme zu einer Seite – oder nichts.
 *
 * Der Schlüssel ist der Pfad ohne führenden Schrägstrich, also genau die
 * Kennung aus der Arbeitsliste: `lernen/aktie/beginner`.
 */
export function aufnahmeFuer(id: string): Aufnahme | null {
  return aufnahmen[id] ?? null
}

/**
 * Die Adresse der Aufnahme auf dem Webspace.
 *
 * Absolut ab der Wurzel, nicht über `NEXT_PUBLIC_SITE_URL`: Die Dateien liegen
 * auf demselben Host wie die Seite, und ein absoluter Name würde beim Prüfen
 * einer Vorschau auf die veröffentlichte Fassung zeigen.
 */
export function aufnahmeAdresse(id: string): string {
  return `/lese-audio/${id}.m4a`
}

/**
 * Alles, was die Vorleseleiste über die Aufnahme einer Seite braucht.
 *
 * Eine Funktion statt zweier Aufrufe an der Aufrufstelle: Ob es eine Aufnahme
 * gibt und wie sie heißt, gehört zusammen – wer das trennt, baut die Stelle,
 * an der eine Adresse ohne Aufnahme entsteht.
 */
export function vorleseaufnahme(
  id: string
): { adresse: string; marken: number[]; sekunden: number } | null {
  const gefunden = aufnahmeFuer(id)
  if (!gefunden) return null
  return {
    adresse: aufnahmeAdresse(id),
    marken: gefunden.marken,
    sekunden: gefunden.sekunden,
  }
}

/** Wie viele Seiten gesprochen vorliegen – für die Betriebsübersicht. */
export function aufnahmenGesamt(): number {
  return Object.keys(aufnahmen).length
}

/** Der Zeitpunkt, an dem das Verzeichnis zuletzt ergänzt wurde. */
export const aufnahmenStand: string = verzeichnis.stand
