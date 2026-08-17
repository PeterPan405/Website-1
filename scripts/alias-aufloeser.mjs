/**
 * Der Auflöse-Haken selbst. Eingehängt wird er von `alias-hook.mjs`.
 *
 * Node lädt diese Datei in einem eigenen Faden, getrennt vom Programm – das
 * ist der Grund für die Zweiteilung und nicht Geschmack.
 */

import { statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

/**
 * Was an den Pfad angehängt wird, in der Reihenfolge von TypeScript.
 *
 * Der leere Eintrag steht vorn und ist kein Schönheitsfehler: Ein Import kann
 * seine Endung schon mitbringen (`@/data/snapshots/markets.json`), und dann
 * gibt es nichts anzuhängen.
 */
const ENDUNGEN = [
  '',
  '.ts',
  '.tsx',
  '.mts',
  '.js',
  '/index.ts',
  '/index.tsx',
  '/index.js',
]

let wurzel = ''

function istDatei(pfad) {
  try {
    return statSync(pfad).isFile()
  } catch {
    return false
  }
}

export function initialize(daten) {
  wurzel = daten.wurzel
}

export function resolve(spezifizierer, kontext, naechster) {
  if (spezifizierer.startsWith('@/')) {
    const basis = join(wurzel, spezifizierer.slice(2))
    for (const endung of ENDUNGEN) {
      const versuch = `${basis}${endung}`
      /*
        Nur Dateien. Ohne diese Frage träfe der leere Eintrag oben auf einen
        Ordner – `@/data/learn` ist einer –, und Node versuchte, ihn zu lesen:
        `EISDIR`. Gemeint ist in dem Fall `data/learn/index.ts`, und den
        findet die Schleife eine Runde später.
      */
      if (istDatei(versuch)) {
        return {
          url: pathToFileURL(versuch).href,
          shortCircuit: true,
          /*
            Node verlangt für JSON eine Import-Angabe (`with { type: 'json' }`),
            die im Quelltext dieses Projekts nirgends steht – Next.js braucht
            sie nicht. Statt 52 Dateien um einer Hilfsfunktion willen
            umzuschreiben, ergänzt der Haken sie hier.
          */
          importAttributes: versuch.endsWith('.json') ? { type: 'json' } : undefined,
        }
      }
    }
  }
  /*
    Relative Importe ohne Endung – seit dem 17. August 2026.

    `data/editions/index.ts` importiert seine Ausgaben als `'./2026-08-17'`.
    Der Bündler ergänzt die Endung, Node nicht: Jeder Lauf außerhalb von
    Next scheiterte an

        ERR_MODULE_NOT_FOUND … /data/editions/2026-07-25

    Damit war der gesamte Ausgabenbestand für Skripte und Prüfungen
    unerreichbar – und zwar so, dass es wie ein Fehler im aufrufenden Skript
    aussah und nicht wie eine Lücke im Haken.

    Aufgelöst wird nur, was **ohne Endung** dasteht und als `.ts`/`.tsx`
    wirklich existiert. Ein Import mit Endung geht unverändert weiter; ein
    Paketname ebenso, weil er nicht mit einem Punkt beginnt.
  */
  if (spezifizierer.startsWith('.') && !/\.[a-z]+$/i.test(spezifizierer)) {
    const basis = fileURLToPath(new URL(spezifizierer, kontext.parentURL))
    for (const endung of ENDUNGEN) {
      const versuch = `${basis}${endung}`
      if (istDatei(versuch)) {
        return {
          url: pathToFileURL(versuch).href,
          shortCircuit: true,
          importAttributes: versuch.endsWith('.json') ? { type: 'json' } : undefined,
        }
      }
    }
  }

  return naechster(spezifizierer, kontext)
}
