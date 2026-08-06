import assert from 'node:assert/strict'
import { test } from 'node:test'

import { readFileSync } from 'node:fs'

import {
  MINDESTJAHRE,
  MONATSNAMEN,
  halbjahresprobe,
  monatsrenditen,
  monatsschluesse,
  rang,
  saisonSatz,
  saisonalitaet,
  spanneAusZufall,
  type Monatsbefund,
} from '../lib/saisonalitaet.ts'

/*
  Echte Reihen aus der Momentaufnahme – wie in `reihenstatistik.test.ts` und
  aus demselben Grund: `lib/market-live.ts` löst den Alias `@/` auf, den
  blankes Node nicht kennt.
*/
const bestand = JSON.parse(
  readFileSync(new URL('../data/snapshots/markets.json', import.meta.url), 'utf8')
) as { instruments: Record<string, { points: { d: string; c: number }[] }> }

function reihe(symbol: string) {
  const punkte = bestand.instruments[symbol]?.points ?? []
  return punkte.map((p) => ({ t: p.d, value: p.c }))
}

test('je Monat bleibt genau ein Schluss übrig, aufsteigend sortiert', () => {
  const punkte = monatsschluesse(reihe('dax'))
  assert.ok(punkte.length > 40, `nur ${punkte.length} Monate`)

  const monate = punkte.map((p) => p.m)
  assert.equal(new Set(monate).size, monate.length, 'ein Monat kommt doppelt vor')
  for (let i = 1; i < punkte.length; i += 1) {
    assert.ok(punkte[i - 1]!.m < punkte[i]!.m, 'nicht aufsteigend')
  }
})

test('der angebrochene letzte Monat fällt heraus', () => {
  const roh = reihe('dax')
  const letzterTag = roh[roh.length - 1]!.t
  const punkte = monatsschluesse(roh)
  const letzterMonat = punkte[punkte.length - 1]!.m

  assert.ok(
    letzterMonat < letzterTag.slice(0, 7),
    `${letzterMonat} ist der Monat des letzten Kurses (${letzterTag}) – er müsste fehlen`
  )
})

test('ein Monatsschluss ist ein Kurs, den es gegeben hat', () => {
  const roh = reihe('dax')
  const vorhanden = new Set(roh.map((p) => `${p.t}|${p.value}`))
  for (const punkt of monatsschluesse(roh)) {
    assert.ok(
      vorhanden.has(`${punkt.t}|${punkt.wert}`),
      `${punkt.t} steht nicht in der Reihe`
    )
  }
})

test('Monatsrenditen bleiben in einer plausiblen Spanne', () => {
  const renditen = monatsrenditen(reihe('dax'))
  assert.ok(renditen.length > 40)
  /*
    Kein Leitindex hat in einem Monat mehr als 60 Prozent gemacht oder
    verloren. Ginge einer darüber, hätte die 45-Tage-Prüfung versagt und eine
    Mehrmonatsrendite trüge ein Monatsetikett.
  */
  for (const punkt of renditen) {
    assert.ok(Math.abs(punkt.r) < 0.6, `${punkt.m}: ${punkt.r}`)
    assert.equal(punkt.m, `${punkt.jahr}-${String(punkt.monat).padStart(2, '0')}`)
  }
})

test('eine Lücke im Bestand erzeugt keine Monatsrendite', () => {
  /*
    Januar, Februar – dann fehlen März und April – dann Mai. Aus Februar auf
    Mai wären 90 Tage; die Prüfung muss den Sprung verwerfen. Der letzte Monat
    fällt ohnehin heraus, deshalb reicht die Reihe bis Juni.
  */
  const kuenstlich = [
    { t: '2024-01-31', value: 100 },
    { t: '2024-02-29', value: 110 },
    { t: '2024-05-31', value: 200 },
    { t: '2024-06-28', value: 210 },
  ]
  const renditen = monatsrenditen(kuenstlich)
  const monate = renditen.map((p) => p.m)

  assert.ok(!monate.includes('2024-05'), 'der Sprung über zwei Monate wurde gezählt')
  assert.deepEqual(monate, ['2024-02'])
})

test('ein Monat mit zu wenig Jahren lässt den ganzen Befund entfallen', () => {
  // Zwei Jahre reichen für keinen Kalendermonat.
  const kurz = Array.from({ length: 24 }, (_, i) => ({
    t: `${2024 + Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, '0')}-28`,
    value: 100 + i,
  }))
  assert.equal(saisonalitaet(kurz), null)
})

test('eine leere Reihe ergibt keinen Befund', () => {
  assert.equal(saisonalitaet([]), null)
  assert.equal(saisonalitaet(reihe('gibt-es-nicht')), null)
})

test('der DAX ergibt einen vollständigen Befund über zwölf Monate', () => {
  const befund = saisonalitaet(reihe('dax'))
  assert.ok(befund !== null, 'kein Befund – reicht der Bestand nicht mehr?')

  assert.equal(befund.monate.length, 12)
  for (let i = 0; i < 12; i += 1) {
    /*
      Die Annotation ist nötig, nicht schmückend: `assert.ok` ist eine
      Zusicherungsfunktion, und ohne erklärten Typ hielte TypeScript die
      Verengung von `monat` für zirkulär (TS7022).
    */
    const monat: Monatsbefund = befund.monate[i]!
    assert.equal(monat.monat, i + 1)
    assert.equal(monat.name, MONATSNAMEN[i + 1])
    assert.ok(monat.jahre >= MINDESTJAHRE)
    assert.ok(monat.imPlus <= monat.jahre)
    assert.ok(monat.tiefster <= monat.median && monat.median <= monat.hoechster)
    assert.ok(monat.tiefster <= monat.mittel && monat.mittel <= monat.hoechster)
  }
})

test('bester und schwächster Monat spannen genau die ausgewiesene Spanne auf', () => {
  const befund = saisonalitaet(reihe('dax'))
  assert.ok(befund !== null)

  const mittel = befund.monate.map((m) => m.mittel)
  assert.equal(befund.bester.mittel, Math.max(...mittel))
  assert.equal(befund.schwaechster.mittel, Math.min(...mittel))
  assert.ok(Math.abs(befund.spanne - (Math.max(...mittel) - Math.min(...mittel))) < 1e-12)
})

test('die Zufallsspanne wächst mit der Unruhe der Monate', () => {
  const ruhig: Monatsbefund[] = Array.from({ length: 12 }, (_, i) => bau(i + 1, 1))
  const unruhig: Monatsbefund[] = Array.from({ length: 12 }, (_, i) => bau(i + 1, 4))

  assert.ok(spanneAusZufall(unruhig) > spanneAusZufall(ruhig))
  // Der Faktor ist linear: viermal so unscharf, viermal so weite Spanne.
  assert.ok(Math.abs(spanneAusZufall(unruhig) - 4 * spanneAusZufall(ruhig)) < 1e-9)
})

test('ein einzelner sehr unruhiger Monat hebt die Messlatte nicht an', () => {
  /*
    Der Median statt des Durchschnitts – sonst würde ausgerechnet der Monat,
    der das Muster erzeugt, es auch noch rechtfertigen.
  */
  const normal: Monatsbefund[] = Array.from({ length: 12 }, (_, i) => bau(i + 1, 2))
  const mitAusreisser = [...normal]
  mitAusreisser[6] = bau(7, 40)

  assert.equal(spanneAusZufall(mitAusreisser), spanneAusZufall(normal))
})

test('ohne Unschärfe gibt es keine Zufallsspanne', () => {
  assert.equal(spanneAusZufall([]), 0)
})

test('der Satz nennt Zufall beim Namen, wenn die Spanne klein ist', () => {
  const satz = saisonSatz({
    monate: [],
    beobachtungen: 60,
    von: '2021-09',
    bis: '2026-07',
    bester: bau(4, 2),
    schwaechster: bau(9, 2),
    spanne: 3,
    spanneAusZufall: 7.3,
  })
  assert.match(satz, /kein Muster/)
  // Deutsches Dezimalkomma, kein englischer Punkt.
  assert.match(satz, /3,0 Prozentpunkte/)
  assert.match(satz, /\(7,3\)/)
  assert.ok(!/\d\.\d/.test(satz), `englischer Dezimalpunkt im Satz: ${satz}`)
})

test('der Satz verspricht auch beim deutlichen Muster nichts über die Zukunft', () => {
  const satz = saisonSatz({
    monate: [],
    beobachtungen: 60,
    von: '2021-09',
    bis: '2026-07',
    bester: bau(4, 2),
    schwaechster: bau(9, 2),
    spanne: 20,
    spanneAusZufall: 7.3,
  })
  assert.match(satz, /über Zufall hinaus/)
  assert.match(satz, /kommende Jahr/)
})

test('ohne Bestand sagt der Satz genau das', () => {
  const satz = saisonSatz({
    monate: [],
    beobachtungen: 0,
    von: '',
    bis: '',
    bester: bau(1, 0),
    schwaechster: bau(1, 0),
    spanne: 0,
    spanneAusZufall: 0,
  })
  assert.match(satz, /Zu wenig Bestand/)
})

test('die Halbjahresprobe trennt Mai–Oktober von November–April', () => {
  const befund = saisonalitaet(reihe('dax'))
  assert.ok(befund !== null)

  const probe = halbjahresprobe(befund)
  const mittelVon = (monate: number[]) => {
    const werte = befund.monate
      .filter((m) => monate.includes(m.monat))
      .map((m) => m.mittel)
    return werte.reduce((s, w) => s + w, 0) / werte.length
  }

  assert.ok(Math.abs(probe.sommer - mittelVon([5, 6, 7, 8, 9, 10])) < 1e-12)
  assert.ok(Math.abs(probe.winter - mittelVon([11, 12, 1, 2, 3, 4])) < 1e-12)
  assert.ok(Math.abs(probe.abstand - (probe.winter - probe.sommer)) < 1e-12)
})

test('der Rang zählt von 1 für den stärksten bis 12 für den schwächsten', () => {
  const befund = saisonalitaet(reihe('dax'))
  assert.ok(befund !== null)

  assert.equal(rang(befund, befund.bester.monat), 1)
  assert.equal(rang(befund, befund.schwaechster.monat), 12)

  // Jeder Monat hat genau einen Rang, und alle zwölf sind vergeben.
  const raenge = befund.monate.map((m) => rang(befund, m.monat))
  assert.deepEqual(
    [...raenge].sort((a, b) => a! - b!),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  )
})

test('ein Monat, den es nicht gibt, hat keinen Rang', () => {
  const befund = saisonalitaet(reihe('dax'))
  assert.ok(befund !== null)
  assert.equal(rang(befund, 13), null)
})

function bau(monat: number, unschaerfe: number): Monatsbefund {
  return {
    monat,
    name: MONATSNAMEN[monat]!,
    jahre: 5,
    mittel: 0,
    median: 0,
    imPlus: 3,
    tiefster: -1,
    hoechster: 1,
    unschaerfe,
  }
}
