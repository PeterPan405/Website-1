import assert from 'node:assert/strict'
import { test } from 'node:test'

import { LEITWERTE, istLeitwert } from '../lib/leitwerte.ts'
import { BEZUGSWERTE } from '../lib/wochenrechnung.ts'

test('die Bezugswerte des Wochenberichts sind vollständig enthalten', () => {
  /*
    Der Wochenbericht rechnet mit den BEZUGSWERTE. Fiele einer aus dem
    Stundentakt heraus, stünde im Bericht eine Woche lang eine Zahl, die
    zwei Stunden älter ist als die daneben – der auffälligste Fehler von
    allen, weil er sich als Widerspruch auf derselben Seite zeigt.
  */
  for (const symbol of BEZUGSWERTE) {
    assert.ok(
      istLeitwert(symbol),
      `Bezugswert „${symbol}“ fehlt in LEITWERTE – der Wochenbericht bekäme veraltete Zahlen.`
    )
  }
})

test('keine Doppelung', () => {
  assert.equal(new Set(LEITWERTE).size, LEITWERTE.length)
})

test('die Liste bleibt kurz genug, dass die Aufteilung etwas bringt', () => {
  /*
    Die Aufteilung in Stunden- und Zweistundentakt lohnt nur, solange der
    Stundenlauf deutlich kleiner ist als der volle. Bei tausend Instrumenten
    im Bestand ist zwanzig die Grenze, ab der man auch gleich alles holen
    könnte.
  */
  assert.ok(
    LEITWERTE.length <= 20,
    `LEITWERTE hat ${LEITWERTE.length} Einträge – über zwanzig ist der Unterschied zum vollen Abruf keiner mehr.`
  )
})

test('istLeitwert erkennt Zugehörigkeit', () => {
  assert.equal(istLeitwert('dax'), true)
  assert.equal(istLeitwert('apple'), false)
  assert.equal(istLeitwert(''), false)
})
