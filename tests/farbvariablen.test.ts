/**
 * Jede benutzte Farbvariable muss es auch geben.
 *
 * ## Warum diese Prüfung existiert
 *
 * In den Lerngrafiken stand über Wochen `fill="var(--c-bg-subtle)"`. Diese
 * Variable gibt es nicht – sie heißt `--c-surface-muted`. Der Fehler ist durch
 * jede andere Prüfung durchgegangen: TypeScript sieht eine Zeichenkette, ESLint
 * sieht ein gültiges Attribut, der Build läuft, und die Seite lädt.
 *
 * Sichtbar war er trotzdem, und zwar sofort: Eine unbekannte Variable macht die
 * CSS-Deklaration ungültig, und `fill` fällt auf seinen Anfangswert zurück –
 * **Schwarz**. Ein Dutzend Kästen in den Grafiken war schwarz gefüllt, mit
 * dunklem Text darauf. Aufgefallen ist es erst beim Betrachten der gebauten
 * Seite im Browser.
 *
 * Genau dagegen läuft diese Prüfung: Sie liest die Namen, die in TypeScript und
 * TSX in einem `var(--…)` stehen, und hält sie gegen die Namen, die in
 * `app/globals.css` definiert werden. Ein Tippfehler fällt damit in Sekunden
 * auf statt nach einem Blick auf die richtige Stelle.
 *
 * ## Was sie nicht prüft
 *
 * Farbvariablen, die nur in CSS-Dateien verwendet werden. Dort steht die
 * Definition daneben, und ein Rückfall auf Schwarz wäre beim Entwickeln sofort
 * zu sehen. Der gefährliche Fall ist der hier: eine Zeichenkette in einer
 * Komponente, weit weg von der Datei, in der die Namen vergeben werden.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const WURZEL = new URL('..', import.meta.url).pathname
const STILDATEI = join(WURZEL, 'app/globals.css')
const DURCHSUCHT = ['components', 'app', 'lib']

function dateien(ordner: string): string[] {
  const gefunden: string[] = []
  const laufen = (pfad: string): void => {
    for (const eintrag of readdirSync(pfad)) {
      const voll = join(pfad, eintrag)
      if (statSync(voll).isDirectory()) laufen(voll)
      else if (voll.endsWith('.ts') || voll.endsWith('.tsx')) gefunden.push(voll)
    }
  }
  laufen(ordner)
  return gefunden
}

const stil = readFileSync(STILDATEI, 'utf8')

/*
  Definiert ist eine Variable dort, wo sie einen Wert zugewiesen bekommt –
  `--c-brand: #17296f;`. Vorkommen in einem `var(--c-brand)` zählen nicht,
  sonst würde ein Tippfehler sich selbst bestätigen.
*/
const definiert = new Set(
  [...stil.matchAll(/(^|[;{\s])(--[a-z0-9-]+)\s*:/gm)].map((treffer) => treffer[2])
)

const verwendet = new Map<string, string[]>()
for (const ordner of DURCHSUCHT) {
  for (const datei of dateien(join(WURZEL, ordner))) {
    const inhalt = readFileSync(datei, 'utf8')
    for (const treffer of inhalt.matchAll(/var\((--[a-z0-9-]+)\)/g)) {
      const name = treffer[1]
      if (!verwendet.has(name)) verwendet.set(name, [])
      const stellen = verwendet.get(name)!
      const kurz = datei.slice(WURZEL.length)
      if (!stellen.includes(kurz)) stellen.push(kurz)
    }
  }
}

let failed = 0
const unbekannt: string[] = []

for (const [name, stellen] of [...verwendet].sort()) {
  if (definiert.has(name)) continue
  failed++
  unbekannt.push(`${name} – benutzt in ${stellen.join(', ')}`)
}

console.log(`${definiert.size} Farbvariablen definiert, ${verwendet.size} benutzt.`)
if (unbekannt.length > 0) {
  console.log('\nFEHL Diese Variablen gibt es nicht – der Wert fällt auf Schwarz zurück:')
  for (const zeile of unbekannt) console.log(`     ${zeile}`)
} else {
  console.log('OK   Jede benutzte Variable ist in app/globals.css definiert.')
}

/*
  Die Gegenrichtung ist bewusst keine Fehlermeldung.

  Eine definierte, aber nirgends benutzte Variable ist bestenfalls unaufgeräumt
  und schadet niemandem. Sie hier zu melden hieße, dass ein aufgeräumtes
  Farbschema den Build bricht – das wäre die falsche Richtung.
*/

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
