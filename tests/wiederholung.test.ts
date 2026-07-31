import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  ABSTAENDE,
  GEFESTIGT_AB,
  HOECHSTES_FACH,
  beantworte,
  faellige,
  fragenSchluessel,
  leseSchluessel,
  neueKarte,
  runde,
  stand,
  tagePlus,
  type Karte,
} from '../lib/wiederholung.ts'

/* ------------------------------------------------------------- Schlüssel */

test('Schlüssel setzt sich aus Thema, Stufe und Position zusammen', () => {
  assert.equal(fragenSchluessel('aktie', 'beginner', 0), 'aktie:beginner#0')
})

test('Schlüssel lässt sich wieder zerlegen', () => {
  assert.deepEqual(leseSchluessel('cost-average-sparplan:advanced#12'), {
    thema: 'cost-average-sparplan',
    stufe: 'advanced',
    position: 12,
  })
})

test('Ein fremder Schlüssel ergibt null statt geratener Teile', () => {
  assert.equal(leseSchluessel('irgendwas'), null)
  assert.equal(leseSchluessel('aktie:beginner'), null)
  assert.equal(leseSchluessel('Aktie:Beginner#1'), null)
})

/* ------------------------------------------------------------ Kalender */

test('tagePlus rechnet in Kalendertagen', () => {
  assert.equal(tagePlus('2026-07-30', 1), '2026-07-31')
  assert.equal(tagePlus('2026-07-30', 3), '2026-08-02')
  assert.equal(tagePlus('2026-12-30', 7), '2027-01-06')
})

test('tagePlus überspringt den 29. Februar nicht', () => {
  // 2028 ist ein Schaltjahr.
  assert.equal(tagePlus('2028-02-28', 1), '2028-02-29')
  assert.equal(tagePlus('2027-02-28', 1), '2027-03-01')
})

test('tagePlus übersteht die Umstellung auf Sommerzeit', () => {
  // Ende März: In lokaler Zeit gerechnet fiele hier eine Stunde aus.
  assert.equal(tagePlus('2026-03-28', 1), '2026-03-29')
  assert.equal(tagePlus('2026-03-29', 1), '2026-03-30')
  assert.equal(tagePlus('2026-10-24', 1), '2026-10-25')
  assert.equal(tagePlus('2026-10-25', 1), '2026-10-26')
})

test('Ein unbrauchbares Datum kommt unverändert zurück', () => {
  assert.equal(tagePlus('vorgestern', 1), 'vorgestern')
})

/* --------------------------------------------------------------- Fächer */

test('Eine neue Karte liegt in Fach 1 und ist sofort fällig', () => {
  const karte = neueKarte('aktie:beginner#0', '2026-07-30')
  assert.equal(karte.fach, 1)
  assert.equal(karte.faellig, '2026-07-30')
  assert.equal(karte.versuche, 0)
})

test('Eine richtige Antwort schiebt genau ein Fach weiter', () => {
  const karte = beantworte(neueKarte('a:beginner#0', '2026-07-30'), true, '2026-07-30')
  assert.equal(karte.fach, 2)
  assert.equal(karte.faellig, '2026-08-02') // +3 Tage
  assert.equal(karte.versuche, 1)
  assert.equal(karte.richtig, 1)
})

test('Die Abstände wachsen mit jedem Fach', () => {
  let karte = neueKarte('a:beginner#0', '2026-01-01')
  const faelligkeiten: string[] = []
  for (let runde = 0; runde < 5; runde += 1) {
    karte = beantworte(karte, true, karte.faellig)
    faelligkeiten.push(karte.faellig)
  }
  assert.deepEqual(faelligkeiten, [
    '2026-01-04', // Fach 2: +3
    '2026-01-11', // Fach 3: +7
    '2026-02-01', // Fach 4: +21
    '2026-04-02', // Fach 5: +60
    '2026-06-01', // Fach 5 bleibt: +60
  ])
})

test('Über das höchste Fach hinaus geht es nicht', () => {
  let karte: Karte = { id: 'a', fach: 5, faellig: '2026-07-30', versuche: 9, richtig: 9 }
  karte = beantworte(karte, true, '2026-07-30')
  assert.equal(karte.fach, HOECHSTES_FACH)
})

test('Eine falsche Antwort wirft auf Fach 1 zurück, nicht ein Fach herunter', () => {
  const karte: Karte = {
    id: 'a',
    fach: 4,
    faellig: '2026-07-30',
    versuche: 3,
    richtig: 3,
  }
  const danach = beantworte(karte, false, '2026-07-30')
  assert.equal(danach.fach, 1)
  assert.equal(danach.faellig, '2026-07-31')
  assert.equal(danach.richtig, 3, 'die richtigen Antworten von früher bleiben gezählt')
  assert.equal(danach.versuche, 4)
})

test('Die Abstandstabelle passt zur Zahl der Fächer', () => {
  assert.equal(ABSTAENDE.length, HOECHSTES_FACH + 1)
  for (let fach = 1; fach < ABSTAENDE.length; fach += 1) {
    assert.ok(
      ABSTAENDE[fach] > ABSTAENDE[fach - 1],
      `Fach ${fach} muss weiter liegen als Fach ${fach - 1}`
    )
  }
})

/* ------------------------------------------------------------ Fälligkeit */

const bestand: Karte[] = [
  { id: 'a', fach: 1, faellig: '2026-07-29', versuche: 2, richtig: 1 },
  { id: 'b', fach: 3, faellig: '2026-07-30', versuche: 4, richtig: 4 },
  { id: 'c', fach: 5, faellig: '2026-09-01', versuche: 6, richtig: 6 },
  { id: 'd', fach: 4, faellig: '2026-08-15', versuche: 4, richtig: 3 },
]

test('Fällig ist, was heute oder früher dran war', () => {
  assert.deepEqual(
    faellige(bestand, '2026-07-30').map((karte) => karte.id),
    ['a', 'b']
  )
})

test('An einem Tag ohne Fälligkeit kommt eine leere Liste, kein Fehler', () => {
  assert.deepEqual(faellige(bestand, '2026-07-28'), [])
})

/* ----------------------------------------------------------------- Stand */

test('Der Stand zählt begonnen, fällig und gefestigt getrennt', () => {
  const ergebnis = stand(bestand, '2026-07-30')
  assert.equal(ergebnis.begonnen, 4)
  assert.equal(ergebnis.faellig, 2)
  assert.equal(ergebnis.gefestigt, 2, 'c in Fach 5 und d in Fach 4')
  assert.equal(GEFESTIGT_AB, 4)
})

test('Die Trefferquote rechnet über alle Versuche, nicht über Karten', () => {
  const ergebnis = stand(bestand, '2026-07-30')
  // 1 + 4 + 6 + 3 = 14 von 2 + 4 + 6 + 4 = 16
  assert.ok(ergebnis.trefferProzent !== null)
  assert.ok(Math.abs(ergebnis.trefferProzent - 87.5) < 1e-9)
})

test('Ohne einen einzigen Versuch gibt es keine Quote statt einer Null', () => {
  const ergebnis = stand([neueKarte('a', '2026-07-30')], '2026-07-30')
  assert.equal(ergebnis.trefferProzent, null)
})

test('Der nächste Tag ist der früheste noch nicht fällige', () => {
  assert.equal(stand(bestand, '2026-07-30').naechsterTag, '2026-08-15')
})

test('Ist alles fällig, gibt es keinen nächsten Tag', () => {
  assert.equal(stand(bestand, '2026-12-31').naechsterTag, null)
})

test('Ohne Karten steht alles auf null', () => {
  const ergebnis = stand([], '2026-07-30')
  assert.deepEqual(ergebnis, {
    begonnen: 0,
    faellig: 0,
    gefestigt: 0,
    trefferProzent: null,
    naechsterTag: null,
  })
})

/* ----------------------------------------------------------------- Runde */

test('Fällige Karten kommen zuerst, die aus niedrigen Fächern vorneweg', () => {
  const ergebnis = runde(bestand, ['x', 'y'], '2026-07-30', 10)
  assert.deepEqual(
    ergebnis.wiederholung.map((karte) => karte.id),
    ['a', 'b']
  )
  assert.deepEqual(ergebnis.neu, ['x', 'y'])
})

test('Sind genug Wiederholungen fällig, kommt nichts Neues dazu', () => {
  const ergebnis = runde(bestand, ['x', 'y'], '2026-07-30', 2)
  assert.equal(ergebnis.wiederholung.length, 2)
  assert.deepEqual(ergebnis.neu, [], 'sonst wächst der Stapel schneller, als er abfließt')
})

test('Die Runde füllt nur bis zur gewünschten Länge auf', () => {
  const ergebnis = runde(bestand, ['x', 'y', 'z'], '2026-07-30', 3)
  assert.equal(ergebnis.wiederholung.length + ergebnis.neu.length, 3)
})

test('Bereits bekannte Fragen kommen nicht als neu zurück', () => {
  const ergebnis = runde(bestand, ['b', 'c', 'x'], '2026-07-30', 10)
  assert.deepEqual(ergebnis.neu, ['x'])
})

test('Neue Fragen behalten die Reihenfolge der Lernstufen', () => {
  const ergebnis = runde(
    [],
    ['aktie:beginner#0', 'aktie:beginner#1', 'etf:beginner#0'],
    '2026-07-30',
    3
  )
  assert.deepEqual(ergebnis.neu, [
    'aktie:beginner#0',
    'aktie:beginner#1',
    'etf:beginner#0',
  ])
})
