import { KI_HINWEIS } from '@/lib/sprechfassung'

/**
 * Den KI-Hinweis in einer Folgenbeschreibung auf den heutigen Stand bringen.
 *
 * ## Warum das in `lib/` steht und nicht im Skript
 *
 * Bis zum 17. August 2026 stand `angeglichen()` mitten in
 * `scripts/podcast-hinweis-angleichen.ts` – zwischen einem `process.exit(1)`
 * bei fehlenden Zugangsdaten und einem `fetch` an Googles Token-Endpunkt, beide
 * auf oberster Ebene. **Damit war sie nicht prüfbar:** Wer sie importiert,
 * startet den ganzen Lauf.
 *
 * Aufgefallen ist das, als der Hinweis das zweite Mal geändert wurde und die
 * Funktion einen Fehler bekam, den ein Test in einer Zeile gefunden hätte.
 *
 * Die Regel dahinter: Was entscheidet, gehört nach `lib/`; was Zugangsdaten
 * braucht und mit der Außenwelt spricht, bleibt im Skript.
 *
 * ## Was hier angefasst wird – und was nicht
 *
 * **Nur der Hinweisabsatz.** Titel, Kapitelmarken, Hashtags, der
 * Haftungshinweis und alles andere bleiben Zeichen für Zeichen stehen.
 */

/**
 * Alle früheren Fassungen des Hinweises, neueste zuerst.
 *
 * **Eine Liste und keine einzelne Konstante**, und das ist der Kern.
 *
 * Vorher stand hier genau eine alte Fassung – die von vor dem 6. August 2026.
 * Als der Hinweis am 17. August zum zweiten Mal geändert wurde, wäre die
 * zweitletzte Fassung durch das Raster gefallen: `angeglichen()` hätte sie
 * nicht erkannt, den Zweig „kein Hinweis vorhanden" genommen und den neuen
 * **davorgesetzt**.
 *
 * Das Ergebnis wären zwei Hinweise in einer Beschreibung, die einander
 * widersprechen: Der eine sagt, ein Mensch prüfe vor der Veröffentlichung, der
 * andere sagt, es laufe automatisch. Auf vierzehn veröffentlichten Videos.
 *
 * **Jede neue Fassung gehört hier oben eingetragen, bevor `KI_HINWEIS` in
 * `lib/sprechfassung.ts` geändert wird.** `tests/podcast-hinweis.test.ts`
 * hält das fest.
 */
export const FRUEHERE_HINWEISE = [
  'Hinweis: Text und Vertonung dieser Folge entstehen mit Unterstützung von ' +
    'KI-Werkzeugen und werden vor der Veröffentlichung von einem Menschen ' +
    'inhaltlich geprüft; die redaktionelle Verantwortung liegt beim Betreiber.',
  'Hinweis: Die Stimme in dieser Folge wurde mit künstlicher Intelligenz ' +
    'erzeugt. Auswahl, Text und Einordnung stammen von IM Invests.',
]

/** Woran der Haftungshinweis zu erkennen ist – davor gehört der KI-Hinweis. */
export const HAFTUNG_BEGINN = 'Hinweis: Dieser Podcast dient ausschließlich'

/**
 * Die Beschreibung mit heutigem Hinweis – oder `null`, wenn nichts zu tun ist.
 *
 * Drei Fälle, in dieser Reihenfolge geprüft:
 *
 * 1. Der heutige Hinweis steht schon da → nichts tun.
 * 2. Eine frühere Fassung steht da → ersetzen.
 * 3. Keiner von beiden → vor dem Haftungshinweis einsetzen.
 *
 * Die Reihenfolge ist nicht beliebig: Fall 2 vor Fall 3, sonst entstünden zwei
 * Hinweise nebeneinander. Und Fall 1 zuerst, damit ein zweiter Lauf nichts
 * anfasst – der Lauf soll wiederholbar sein.
 */
export function angeglichen(beschreibung: string): string | null {
  if (beschreibung.includes(KI_HINWEIS)) return null

  for (const frueher of FRUEHERE_HINWEISE) {
    if (beschreibung.includes(frueher)) {
      return beschreibung.replace(frueher, KI_HINWEIS)
    }
  }

  /*
    Kein Hinweis vorhanden. Er kommt vor den Haftungshinweis – dort steht er
    in jeder neueren Folge, und zwei Hinweise gehören zusammen.

    Fehlt auch der Haftungshinweis, wird angehängt statt geraten: Eine Stelle
    mitten im Fließtext zu erfinden, wäre schlimmer als ein Absatz am Ende.
  */
  const stelle = beschreibung.indexOf(HAFTUNG_BEGINN)
  if (stelle === -1) return `${beschreibung.trimEnd()}\n\n${KI_HINWEIS}\n`
  return beschreibung.slice(0, stelle) + KI_HINWEIS + '\n\n' + beschreibung.slice(stelle)
}
