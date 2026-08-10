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
    Die Aufteilung in Fünf-Minuten- und Zwei-Stunden-Takt lohnt nur, solange
    der häufige Lauf deutlich kleiner ist als der volle.

    Die Grenze lag bis zum 10. August 2026 bei zwanzig – aus der Zeit, als
    jeder Kursabruf einen Neubau auslöste und jeder zusätzliche Wert Bauzeit
    kostete. Das ist nicht mehr so: Der häufige Lauf baut nicht, er legt
    `kurse-live.json` auf den Server. Was ihn begrenzt, ist allein die Zahl
    der Abrufe.

    Der volle Bestand liegt über tausend. Hundert ist damit weit genug weg,
    um die Aufteilung sinnvoll zu halten, und weit genug oben, um alle
    Kacheln der Übersicht aufzunehmen – darum geht es.
  */
  assert.ok(
    LEITWERTE.length <= 100,
    `LEITWERTE hat ${LEITWERTE.length} Einträge – über hundert ist der Unterschied zum vollen Abruf keiner mehr.`
  )
})

test('istLeitwert erkennt Zugehörigkeit', () => {
  assert.equal(istLeitwert('dax'), true)
  assert.equal(istLeitwert('apple'), false)
  assert.equal(istLeitwert(''), false)
})
