import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  FRAGEN_JE_STUFE,
  SCHWELLE,
  STUFEN,
  TESTLAENGE,
  einstufungssatz,
  waehleTestfragen,
  werteAus,
  type Antwort,
} from '../lib/einstufung.ts'

/* ---------------------------------------------------------------- Auswahl */

/** Ein Bestand mit `themen` Themen und `jeThema` Fragen je Thema und Stufe. */
function bestand(themen: number, jeThema: number) {
  const liste: { id: string; themaSlug: string; stufe: string }[] = []
  for (let t = 0; t < themen; t += 1) {
    for (const stufe of STUFEN) {
      for (let f = 0; f < jeThema; f += 1) {
        liste.push({ id: `thema${t}:${stufe}#${f}`, themaSlug: `thema${t}`, stufe })
      }
    }
  }
  return liste
}

test('Der Test hat die angekündigte Länge', () => {
  const auswahl = waehleTestfragen(bestand(10, 4))
  assert.equal(auswahl.length, TESTLAENGE)
  assert.equal(TESTLAENGE, FRAGEN_JE_STUFE * 3)
})

test('Jede Stufe kommt mit gleich vielen Fragen vor', () => {
  const auswahl = waehleTestfragen(bestand(10, 4))
  for (const stufe of STUFEN) {
    assert.equal(auswahl.filter((frage) => frage.stufe === stufe).length, FRAGEN_JE_STUFE)
  }
})

test('Bei genug Themen stammt keine zwei Fragen einer Stufe aus demselben Thema', () => {
  const auswahl = waehleTestfragen(bestand(10, 4))
  for (const stufe of STUFEN) {
    const themen = auswahl
      .filter((frage) => frage.stufe === stufe)
      .map((frage) => frage.themaSlug)
    assert.equal(new Set(themen).size, themen.length)
  }
})

test('Die Auswahl ist bei gleichem Bestand immer dieselbe', () => {
  const eingabe = bestand(10, 4)
  assert.deepEqual(waehleTestfragen(eingabe), waehleTestfragen(eingabe))
})

test('Weniger Themen als Fragen: es wird eine zweite Runde gedreht', () => {
  const auswahl = waehleTestfragen(bestand(2, 4))
  assert.equal(auswahl.length, TESTLAENGE)
  const beginner = auswahl.filter((frage) => frage.stufe === 'beginner')
  assert.equal(new Set(beginner.map((frage) => frage.id)).size, FRAGEN_JE_STUFE)
})

test('Ein zu kleiner Bestand liefert, was da ist – ohne Endlosschleife', () => {
  const auswahl = waehleTestfragen(bestand(1, 2))
  assert.equal(auswahl.length, 6, 'je Stufe die vorhandenen zwei')
})

test('Ein leerer Bestand ergibt einen leeren Test', () => {
  assert.deepEqual(waehleTestfragen([]), [])
})

/* -------------------------------------------------------------- Auswertung */

function antworten(muster: Record<string, boolean[]>): Antwort[] {
  const liste: Antwort[] = []
  for (const [stufe, treffer] of Object.entries(muster)) {
    treffer.forEach((richtig, index) => {
      liste.push({ themaSlug: `thema${index}`, stufe, richtig })
    })
  }
  return liste
}

const alleRichtig = [true, true, true, true, true]
const vierVonFuenf = [true, true, true, true, false]
const dreiVonFuenf = [true, true, true, false, false]

test('Wer schon die Einsteigerstufe verfehlt, wird dorthin geschickt', () => {
  const ergebnis = werteAus(
    antworten({
      beginner: dreiVonFuenf,
      fortgeschritten: alleRichtig,
      profi: alleRichtig,
    })
  )
  assert.equal(
    ergebnis.empfehlung,
    'beginner',
    'nicht die oberste bestandene Stufe – Lücken schließt man von unten'
  )
})

test('Vier von fünf reichen, drei nicht', () => {
  assert.equal(werteAus(antworten({ beginner: vierVonFuenf })).jeStufe[0].bestanden, true)
  assert.equal(
    werteAus(antworten({ beginner: dreiVonFuenf })).jeStufe[0].bestanden,
    false
  )
  assert.ok(SCHWELLE > 3 / 5 && SCHWELLE <= 4 / 5)
})

test('Sitzen die Grundlagen, geht es auf die fortgeschrittene Stufe', () => {
  const ergebnis = werteAus(
    antworten({
      beginner: alleRichtig,
      fortgeschritten: dreiVonFuenf,
      profi: dreiVonFuenf,
    })
  )
  assert.equal(ergebnis.empfehlung, 'fortgeschritten')
})

test('Sitzen zwei Stufen, bleibt die Profistufe', () => {
  const ergebnis = werteAus(
    antworten({
      beginner: alleRichtig,
      fortgeschritten: vierVonFuenf,
      profi: dreiVonFuenf,
    })
  )
  assert.equal(ergebnis.empfehlung, 'profi')
})

test('Sitzt alles, gibt es keine Empfehlung statt einer erfundenen', () => {
  const ergebnis = werteAus(
    antworten({
      beginner: alleRichtig,
      fortgeschritten: alleRichtig,
      profi: alleRichtig,
    })
  )
  assert.equal(ergebnis.empfehlung, null)
})

test('Die Gesamtzahlen zählen über alle Stufen', () => {
  const ergebnis = werteAus(
    antworten({
      beginner: alleRichtig,
      fortgeschritten: vierVonFuenf,
      profi: dreiVonFuenf,
    })
  )
  assert.equal(ergebnis.gestelltGesamt, 15)
  assert.equal(ergebnis.richtigGesamt, 12)
})

test('Eine Stufe ohne Frage gilt nicht als verfehlt', () => {
  const ergebnis = werteAus(antworten({ fortgeschritten: dreiVonFuenf }))
  assert.equal(ergebnis.jeStufe[0].gestellt, 0)
  assert.equal(ergebnis.jeStufe[0].quote, null)
  assert.equal(ergebnis.empfehlung, 'fortgeschritten')
})

test('Ohne jede Antwort gibt es keine Empfehlung', () => {
  const ergebnis = werteAus([])
  assert.equal(ergebnis.empfehlung, null)
  assert.equal(ergebnis.gestelltGesamt, 0)
})

test('Schwächen sind die Themen mit mindestens einer falschen Antwort, ohne Dopplung', () => {
  const ergebnis = werteAus([
    { themaSlug: 'aktie', stufe: 'beginner', richtig: false },
    { themaSlug: 'aktie', stufe: 'profi', richtig: false },
    { themaSlug: 'etf', stufe: 'beginner', richtig: true },
    { themaSlug: 'inflation', stufe: 'beginner', richtig: false },
  ])
  assert.deepEqual(ergebnis.schwaechen, ['aktie', 'inflation'])
})

/* ------------------------------------------------------------------- Satz */

test('Der Satz nennt immer Treffer und Gesamtzahl', () => {
  const ergebnis = werteAus(antworten({ beginner: dreiVonFuenf }))
  assert.ok(einstufungssatz(ergebnis).startsWith('3 von 5 richtig.'))
})

test('Der Satz passt zu jeder möglichen Empfehlung', () => {
  const faelle: [Record<string, boolean[]>, string][] = [
    [{ beginner: dreiVonFuenf }, 'Einsteigerstufen'],
    [{ beginner: alleRichtig, fortgeschritten: dreiVonFuenf }, 'fortgeschrittenen'],
    [
      { beginner: alleRichtig, fortgeschritten: alleRichtig, profi: dreiVonFuenf },
      'Profistufen',
    ],
    [
      { beginner: alleRichtig, fortgeschritten: alleRichtig, profi: alleRichtig },
      'Akademie',
    ],
  ]
  for (const [muster, erwartet] of faelle) {
    assert.ok(
      einstufungssatz(werteAus(antworten(muster))).includes(erwartet),
      `„${erwartet}“ fehlt im Satz zu ${JSON.stringify(muster)}`
    )
  }
})

test('Ohne Antwort behauptet der Satz kein Ergebnis', () => {
  assert.equal(einstufungssatz(werteAus([])), 'Es wurde keine Frage beantwortet.')
})
