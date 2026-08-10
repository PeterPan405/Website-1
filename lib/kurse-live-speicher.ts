'use client'

/**
 * Die laufenden Kurse im Browser – ein Abruf für die ganze Seite.
 *
 * ## Warum es diesen Speicher gibt
 *
 * Die Kurse stehen im gebauten HTML, und das HTML ist so alt wie der letzte
 * Bau. Daneben liegt `/kurse-live.json` auf dem Server, die alle fünf Minuten
 * ersetzt wird. Bis zum 10. August 2026 las genau **eine** Stelle diese Datei:
 * die Kopfzeile einer Instrumentseite (`KursLive`).
 *
 * Die Marktübersicht las sie nicht. Dort standen dieselben Kurse als gebaute
 * Zahl – auf einer Seite, die zwei Dutzend Kacheln zeigt, alle mit dem Stand
 * des letzten Baus. Gemeldet wurde es am 10. August: Brent um 17:48 auf dem
 * Stand von 17:02.
 *
 * ## Warum ein Speicher und nicht ein Abruf je Kachel
 *
 * Weil die Übersicht vierzig Kacheln hat. Vierzig Komponenten mit eigenem
 * `fetch` wären vierzig Anfragen je Takt für **dieselbe** Datei – und vierzig
 * Timer. Hier fragt einer, alle hören zu.
 *
 * Der Abruf beginnt erst, wenn die erste Komponente ihn abonniert, und endet
 * mit der letzten. Eine Seite ohne Kurse holt nichts.
 *
 * ## Was er nicht tut
 *
 * Er ersetzt den gebauten Kurs nicht blind. Jede Komponente vergleicht den
 * Zeitstempel: Was älter ist als die gebaute Zahl, wird verworfen. Ein
 * Zwischenspeicher, der eine alte Datei ausliefert, darf den Stand nicht
 * zurückdrehen.
 */

export interface LiveKurs {
  value: number
  at: string
}

interface LiveDatei {
  latest?: Record<string, LiveKurs>
}

/** Wie oft nachgefragt wird, solange die Seite sichtbar ist. */
const TAKT_MS = 60_000

let bestand: Record<string, LiveKurs> = {}
let hoerer: (() => void)[] = []
let takt: number | null = null

/*
  Der Zustand wird als Objekt weitergereicht, nicht als Kopie je Abruf.

  `useSyncExternalStore` vergleicht mit `Object.is`. Gäbe `lesen()` bei jedem
  Aufruf ein frisches Objekt zurück, hielte React das für eine Änderung und
  liefe in eine Endlosschleife. Neu gesetzt wird deshalb nur, wenn der Abruf
  tatsächlich etwas Neues gebracht hat.
*/
function melden() {
  for (const hoer of hoerer) hoer()
}

async function holen() {
  if (typeof document === 'undefined' || document.hidden) return
  try {
    const antwort = await fetch('/kurse-live.json', { cache: 'no-store' })
    if (!antwort.ok) return
    const datei = (await antwort.json()) as LiveDatei
    if (!datei.latest) return
    bestand = datei.latest
    melden()
  } catch {
    /*
      Kein Netz, keine Datei, kaputtes JSON: Der gebaute Stand bleibt stehen.
      Ein Kurs von vorhin ist besser als eine Fehlermeldung – und besser als
      ein leeres Feld, wo eben noch eine Zahl stand.
    */
  }
}

/** Abonniert die laufenden Kurse. Der erste Abonnent startet den Abruf. */
export function abonniereKurse(melde: () => void): () => void {
  hoerer.push(melde)

  if (takt === null) {
    void holen()
    takt = window.setInterval(holen, TAKT_MS)
    document.addEventListener('visibilitychange', holen)
  }

  return () => {
    hoerer = hoerer.filter((eintrag) => eintrag !== melde)
    if (hoerer.length === 0 && takt !== null) {
      window.clearInterval(takt)
      document.removeEventListener('visibilitychange', holen)
      takt = null
    }
  }
}

/** Der aktuelle Bestand. Dieselbe Referenz, solange sich nichts geändert hat. */
export function leseKurse(): Record<string, LiveKurs> {
  return bestand
}

/** Für das Server-Rendering: dort gibt es keine laufenden Kurse. */
export const KEINE_KURSE: Record<string, LiveKurs> = {}

/**
 * Der Kurs, der gelten soll – der laufende, wenn er neuer ist als der gebaute.
 *
 * Die Prüfung auf „neuer“ ist der Kern und kein Beiwerk: Ein Browser mit
 * altem Zwischenspeicher, ein halb übertragener Ordner auf dem Server oder
 * ein Instrument, das im letzten Lauf übersprungen wurde – in allen drei
 * Fällen steht in der Datei etwas Älteres als im HTML.
 */
export function juengerer(
  gebaut: { value: number; at: string },
  live: LiveKurs | undefined
): { value: number; at: string; live: boolean } {
  if (!live) return { ...gebaut, live: false }
  if (new Date(live.at) <= new Date(gebaut.at)) return { ...gebaut, live: false }
  return { value: live.value, at: live.at, live: true }
}
