/**
 * Prüfungen für die Rechnung hinter Angst und Gier.
 *
 * Der gefährlichste Fehler bei einer solchen Anzeige ist nicht ein falscher
 * Wert, sondern ein Wert, wo keiner sein dürfte: Eine 50 aus Datenmangel sieht
 * aus wie ein neutraler Markt. Mehrere Prüfungen hier gelten deshalb dem
 * Gegenteil eines Ergebnisses – dass bei zu kurzer Reihe `null` herauskommt.
 *
 * Die zweite Gruppe prüft die Richtung: Ein Kurs über seinem Durchschnitt muss
 * einen höheren Wert ergeben als einer darunter, und viel Schwankung einen
 * niedrigeren als wenig. Ein Vorzeichendreher wäre in der fertigen Anzeige
 * nicht zu erkennen – der Tacho sähe genauso plausibel aus.
 */

import {
  MASSSTAB_AKTIEN,
  MASSSTAB_KRYPTO,
  abstandZumTrend,
  aufSkala,
  begrenze,
  berechneStimmung,
  gleitenderDurchschnitt,
  marktbreite,
  schwankung,
  schwankungsverhaeltnis,
  standInJahresspanne,
  stufeFuer,
  type Kurspunkt,
} from '../lib/stimmungsindex.ts'

let failed = 0

function check(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  const ok = a === e
  if (!ok) failed++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : `\n     erwartet ${e}\n     erhalten ${a}`}`
  )
}

function pruefe(name: string, bedingung: boolean) {
  if (!bedingung) failed++
  console.log(`${bedingung ? 'OK  ' : 'FEHL'} ${name}`)
}

/**
 * Eine Reihe mit festem täglichen Zuwachs und einer kleinen Unruhe.
 *
 * Die Unruhe ist kein Beiwerk: Eine vollkommen glatte Reihe hat eine
 * Schwankung von exakt null, und dann fällt der Bestandteil
 * „Schwankungsbreite“ zu Recht weg – ein Verhältnis zu null ist keine Zahl.
 * Genau daran ist die erste Fassung dieser Prüfung gescheitert. Echte Kurse
 * sind nie glatt; eine Testreihe, die es ist, prüft einen Fall, den es nicht
 * gibt.
 *
 * Der Zickzack ist gleichbleibend und nicht zufällig – zwei Läufe müssen
 * dasselbe Ergebnis liefern.
 */
function reihe(anzahl: number, start: number, wachstumProTag: number): Kurspunkt[] {
  const punkte: Kurspunkt[] = []
  let wert = start
  for (let i = 0; i < anzahl; i += 1) {
    const unruhe = i % 2 === 0 ? 1.004 : 0.996
    punkte.push({
      d: `2026-01-${String((i % 28) + 1).padStart(2, '0')}`,
      c: wert * unruhe,
    })
    wert *= 1 + wachstumProTag
  }
  return punkte
}

/** Eine Reihe, die um einen Mittelwert schwankt – mit einstellbarer Weite. */
function zickzack(anzahl: number, mitte: number, weite: number): Kurspunkt[] {
  const punkte: Kurspunkt[] = []
  for (let i = 0; i < anzahl; i += 1) {
    punkte.push({ d: `2026-01-01`, c: mitte * (1 + (i % 2 === 0 ? weite : -weite)) })
  }
  return punkte
}

// ------------------------------------------------------------------ Skala

check('begrenze hält unten', begrenze(-20), 0)
check('begrenze hält oben', begrenze(140), 100)
check('begrenze macht aus Unsinn die Mitte', begrenze(Number.NaN), 50)
check('aufSkala trifft den unteren Anker', aufSkala(-10, -10, 10), 0)
check('aufSkala trifft den oberen', aufSkala(10, -10, 10), 100)
check('aufSkala trifft die Mitte', aufSkala(0, -10, 10), 50)
check('aufSkala dreht bei umgekehrten Ankern', aufSkala(1.7, 1.7, 0.6), 0)
check('und zwar vollständig', aufSkala(0.6, 1.7, 0.6), 100)

// --------------------------------------------------------- Durchschnitt

check(
  'Durchschnitt über drei Werte',
  gleitenderDurchschnitt(
    [
      { d: 'a', c: 1 },
      { d: 'b', c: 2 },
      { d: 'c', c: 3 },
    ],
    3
  ),
  2
)
check('zu kurze Reihe ergibt null', gleitenderDurchschnitt([{ d: 'a', c: 1 }], 5), null)
check(
  'Fenster kleiner eins ergibt null',
  gleitenderDurchschnitt(reihe(10, 100, 0), 0),
  null
)

// ------------------------------------------------------- Abstand zum Trend

pruefe(
  'steigende Reihe steht über ihrem Trend',
  (abstandZumTrend(reihe(200, 100, 0.002)) ?? 0) > 0
)
pruefe('fallende Reihe darunter', (abstandZumTrend(reihe(200, 100, -0.002)) ?? 0) < 0)
check(
  'flache Reihe hat keinen Abstand',
  Math.round(abstandZumTrend(reihe(200, 100, 0)) ?? -1),
  0
)
check('zu kurze Reihe ergibt null', abstandZumTrend(reihe(50, 100, 0.001)), null)

// -------------------------------------------------------- Schwankungsbreite

pruefe(
  'breite Zacken schwanken mehr als schmale',
  (schwankung(zickzack(60, 100, 0.05), 30) ?? 0) >
    (schwankung(zickzack(60, 100, 0.005), 30) ?? 1)
)
// Wirklich glatt – `reihe` trägt bewusst eine kleine Unruhe.
const glatt: Kurspunkt[] = Array.from({ length: 60 }, () => ({ d: '2026-01-01', c: 100 }))
const glatt250: Kurspunkt[] = Array.from({ length: 250 }, () => ({
  d: '2026-01-01',
  c: 100,
}))
check('konstante Reihe schwankt nicht', schwankung(glatt, 30), 0)
check('zu kurze Reihe ergibt null', schwankung(reihe(10, 100, 0.01), 30), null)
check('Fenster unter zwei ergibt null', schwankung(reihe(60, 100, 0.01), 1), null)

check(
  'Verhältnis braucht genug Vergleichswerte',
  schwankungsverhaeltnis(reihe(40, 100, 0.01)),
  null
)

/*
  Ruhiges Jahr, dann unruhige Wochen: Das Verhältnis muss über eins liegen.

  Genau dieser Fall ist der Grund für den Bestandteil – Angst zeigt sich zuerst
  in der Heftigkeit der Ausschläge.
*/
const ruhigDannUnruhig = [...zickzack(240, 100, 0.002), ...zickzack(31, 100, 0.06)]
pruefe(
  'unruhiges Ende hebt das Verhältnis',
  (schwankungsverhaeltnis(ruhigDannUnruhig) ?? 0) > 1
)

const unruhigDannRuhig = [...zickzack(240, 100, 0.06), ...zickzack(31, 100, 0.002)]
pruefe('ruhiges Ende senkt es', (schwankungsverhaeltnis(unruhigDannRuhig) ?? 9) < 1)

// -------------------------------------------------------------- Marktbreite

const steigend = reihe(60, 100, 0.004)
const fallend = reihe(60, 100, -0.004)

check(
  'alle über ihrem Schnitt sind hundert Prozent',
  marktbreite(Array.from({ length: 10 }, () => steigend)),
  100
)
check(
  'alle darunter sind null',
  marktbreite(Array.from({ length: 10 }, () => fallend)),
  0
)
check(
  'halb und halb ergibt fünfzig',
  marktbreite([
    ...Array.from({ length: 5 }, () => steigend),
    ...Array.from({ length: 5 }, () => fallend),
  ]),
  50
)
check('zu wenige Reihen ergeben null', marktbreite([steigend, fallend]), null)
check(
  'zu kurze Reihen zählen nicht mit',
  marktbreite(Array.from({ length: 10 }, () => reihe(10, 100, 0.01))),
  null
)

// --------------------------------------------------------- Jahresspanne

/*
  Nicht exakt 100 beziehungsweise 0: `reihe` trägt eine kleine Unruhe, der
  letzte Punkt kann also der abwärts gerichtete sein. Geprüft wird die
  Eigenschaft – nahe am Hoch, nahe am Tief –, nicht ein Zahlenzufall.
*/
pruefe(
  'eine steigende Reihe steht nahe an ihrem Jahreshoch',
  (standInJahresspanne(reihe(300, 100, 0.002)) ?? 0) > 95
)
pruefe(
  'eine fallende nahe an ihrem Jahrestief',
  (standInJahresspanne(reihe(300, 100, -0.002)) ?? 100) < 5
)
check('zu kurze Reihe ergibt null', standInJahresspanne(reihe(100, 100, 0.002)), null)
check('ohne Spanne ergibt null', standInJahresspanne(glatt250), null)

/*
  Der Fall, für den dieser Bestandteil gebaut wurde.

  Ein ruhiger, aber gefallener Markt darf nicht als Gier durchgehen. Vor dem
  vierten Bestandteil stand bei Bitcoin „Gier“, obwohl der Kurs unter seinem
  Halbjahrestrend lag – die niedrige Schwankung allein hatte den Wert getragen.
*/
const ruhigGefallen = berechneStimmung(reihe(300, 100, -0.001), [], MASSSTAB_KRYPTO)
pruefe(
  'ruhiger, aber gefallener Markt gilt nicht als Gier',
  (ruhigGefallen?.wert ?? 100) <= 55
)

// ------------------------------------------------------------------ Stufen

check('unter 25 ist extreme Angst', stufeFuer(24), 'extreme-angst')
check('25 ist Angst', stufeFuer(25), 'angst')
check('45 ist neutral', stufeFuer(45), 'neutral')
check('55 auch noch', stufeFuer(55), 'neutral')
check('56 ist Gier', stufeFuer(56), 'gier')
check('über 75 ist extreme Gier', stufeFuer(76), 'extreme-gier')

// ------------------------------------------------------------- Gesamtwert

const steigendeEinzelwerte = Array.from({ length: 12 }, () => reihe(300, 100, 0.003))
const fallendeEinzelwerte = Array.from({ length: 12 }, () => reihe(300, 100, -0.003))

const gierig = berechneStimmung(
  reihe(300, 100, 0.003),
  steigendeEinzelwerte,
  MASSSTAB_AKTIEN
)
const aengstlich = berechneStimmung(
  reihe(300, 100, -0.003),
  fallendeEinzelwerte,
  MASSSTAB_AKTIEN
)

pruefe(
  'steigender Markt ergibt einen höheren Wert als fallender',
  (gierig?.wert ?? 0) > (aengstlich?.wert ?? 100)
)
pruefe('und liegt im oberen Bereich', (gierig?.wert ?? 0) > 55)
pruefe('der fallende im unteren', (aengstlich?.wert ?? 100) < 45)
check('alle vier Bestandteile sind dabei', gierig?.bestandteile.length, 4)

/*
  Ohne Einzelwerte fällt die Marktbreite weg – aber kein erfundener Ersatz.
*/
const ohneBreite = berechneStimmung(reihe(300, 100, 0.003), [], MASSSTAB_AKTIEN)
check('ohne Einzelwerte bleiben drei Bestandteile', ohneBreite?.bestandteile.length, 3)

check('ohne jede Grundlage kommt null', berechneStimmung([], [], MASSSTAB_AKTIEN), null)

/*
  Derselbe Kursverlauf, zwei Maßstäbe.

  Zwanzig Prozent über dem Halbjahresdurchschnitt sind für einen Aktienindex
  ein Ausnahmezustand und für Bitcoin ein normaler Monat. Ohne getrennte
  Maßstäbe stünde der Kryptotacho dauerhaft am Anschlag.
*/
const kurs = reihe(300, 100, 0.0015)
const alsAktie = berechneStimmung(kurs, [], MASSSTAB_AKTIEN)
const alsKrypto = berechneStimmung(kurs, [], MASSSTAB_KRYPTO)
pruefe(
  'derselbe Verlauf wirkt bei Aktien gieriger als bei Krypto',
  (alsAktie?.wert ?? 0) > (alsKrypto?.wert ?? 0)
)

console.log(
  failed === 0 ? '\nAlle Pruefungen bestanden' : `\n${failed} Pruefung(en) fehlgeschlagen`
)
if (failed > 0) process.exit(1)
