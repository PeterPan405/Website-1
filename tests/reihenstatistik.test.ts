import assert from 'node:assert/strict'
import { test } from 'node:test'

import { readFileSync } from 'node:fs'

import {
  kalenderwoche,
  schwankung,
  standardabweichung,
  wochenrenditen,
  wochenschluesse,
  zusammenhang,
  zusammenhangSatz,
} from '../lib/reihenstatistik.ts'

/*
  Echte Reihen, direkt aus der Momentaufnahme gelesen.

  Nicht über `lib/market-live.ts`: Das Modul löst den Alias `@/` auf, den
  blankes Node nicht kennt. Die Datei selbst zu lesen ist zwei Zeilen und
  prüft nebenbei mit, dass der Bestand die erwartete Form hat.
*/
const bestand = JSON.parse(
  readFileSync(new URL('../data/snapshots/markets.json', import.meta.url), 'utf8')
) as { instruments: Record<string, { points: { d: string; c: number }[] }> }

function reihe(symbol: string) {
  const punkte = bestand.instruments[symbol]?.points ?? []
  return punkte.map((p) => ({ t: p.d, value: p.c }))
}

test('die Kalenderwoche folgt der Donnerstagsregel', () => {
  // 1. Januar 2021 war ein Freitag – die Woche gehört noch zu 2020.
  assert.equal(kalenderwoche('2021-01-01'), '2020-W53')
  // 4. Januar 2021, Montag: erste Woche des neuen Jahres.
  assert.equal(kalenderwoche('2021-01-04'), '2021-W01')
  // Ein Sonntag gehört zur Woche davor, nicht zur folgenden.
  assert.equal(kalenderwoche('2026-08-02'), '2026-W31')
  assert.equal(kalenderwoche('2026-08-03'), '2026-W32')
})

test('unsinnige Datumsangaben ergeben keine Woche', () => {
  assert.equal(kalenderwoche('kein Datum'), null)
  assert.equal(kalenderwoche(''), null)
})

test('die Standardabweichung rechnet mit n−1', () => {
  /*
    Von Hand: Werte 2, 4, 4, 4, 5, 5, 7, 9. Mittel 5, Summe der Quadrate 32.
    Mit n−1 = 7 ergibt das √(32/7) ≈ 2,138 – mit n wären es 2.
  */
  const wert = standardabweichung([2, 4, 4, 4, 5, 5, 7, 9])
  assert.ok(wert !== null)
  assert.ok(Math.abs(wert - Math.sqrt(32 / 7)) < 1e-12)
})

test('unter zwei Werten gibt es keine Streuung', () => {
  assert.equal(standardabweichung([5]), null)
  assert.equal(standardabweichung([]), null)
})

test('der DAX liefert Wochenschlüsse über die ganze Reihe', () => {
  const punkte = wochenschluesse(reihe('dax'))
  assert.ok(punkte.length > 200, `nur ${punkte.length} Wochen`)

  // Aufsteigend sortiert, ohne doppelte Woche.
  const wochen = punkte.map((p) => kalenderwoche(p.t))
  assert.equal(new Set(wochen).size, wochen.length, 'eine Woche kommt doppelt vor')
  for (let i = 1; i < punkte.length; i += 1) {
    assert.ok(punkte[i - 1]!.t < punkte[i]!.t, 'nicht aufsteigend')
  }
})

test('Wochenrenditen bleiben in einer plausiblen Spanne', () => {
  const renditen = wochenrenditen(reihe('dax'))
  assert.ok(renditen.length > 200)
  /*
    Kein Wert über 50 Prozent in einer Woche. Ginge einer darüber, hätte die
    Lückenprüfung versagt und eine Mehrwochenrendite wäre als Woche gezählt.
  */
  for (const punkt of renditen) {
    assert.ok(Math.abs(punkt.r) < 0.5, `${punkt.t}: ${punkt.r}`)
  }
})

test('Krypto schwankt stärker als ein Leitindex', () => {
  /*
    Keine Behauptung über die Zukunft, sondern eine Prüfung, dass die Rechnung
    das Naheliegende trifft. Wäre es umgekehrt, stimmte etwas am Raster.
  */
  const dax = schwankung(reihe('dax'))
  const bitcoin = schwankung(reihe('bitcoin'))
  assert.ok(dax !== null && bitcoin !== null)
  assert.ok(
    bitcoin.jahresProzent > dax.jahresProzent,
    `Bitcoin ${bitcoin.jahresProzent.toFixed(1)} gegen DAX ${dax.jahresProzent.toFixed(1)}`
  )
})

test('die Jahresschwankung ist die Wochenschwankung mal Wurzel 52', () => {
  const wert = schwankung(reihe('sp500'))
  assert.ok(wert !== null)
  const erwartet = wert.wochenProzent * Math.sqrt(52)
  assert.ok(Math.abs(wert.jahresProzent - erwartet) < 1e-9)
})

test('ein unbekanntes Symbol ergibt keine Zahl', () => {
  assert.equal(schwankung(reihe('gibt-es-nicht')), null)
  assert.equal(zusammenhang(reihe('gibt-es-nicht'), reihe('dax')), null)
})

test('ein Wert mit sich selbst korreliert vollständig', () => {
  const wert = zusammenhang(reihe('dax'), reihe('dax'))
  assert.ok(wert !== null)
  assert.ok(Math.abs(wert.wert - 1) < 1e-9, `${wert.wert}`)
})

test('zwei europäische Indizes laufen deutlich gleich', () => {
  const wert = zusammenhang(reihe('dax'), reihe('euro-stoxx-50'))
  assert.ok(wert !== null)
  assert.ok(wert.wert > 0.5, `nur ${wert.wert.toFixed(2)}`)
  assert.ok(wert.wochen >= 30)
})

test('die Korrelation bleibt im gültigen Bereich', () => {
  for (const paar of [
    ['dax', 'gold'],
    ['bitcoin', 'sp500'],
    ['gold', 'eur-usd'],
  ] as const) {
    const wert = zusammenhang(reihe(paar[0]), reihe(paar[1]))
    if (!wert) continue
    assert.ok(wert.wert >= -1 && wert.wert <= 1, `${paar.join('/')}: ${wert.wert}`)
  }
})

test('der einordnende Satz bewertet nicht, sondern beschreibt', () => {
  assert.match(zusammenhangSatz(0.95), /Gleichschritt/)
  assert.match(zusammenhangSatz(-0.9), /gegenläufig/)
  assert.match(zusammenhangSatz(0.05), /kaum ein Zusammenhang/)
  assert.match(zusammenhangSatz(-0.3), /schwach gegenläufig/)
})
