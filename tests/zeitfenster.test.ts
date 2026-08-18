/**
 * Zwei Zeitfenster für denselben Wert – und ob die Zahlen halten, was sie sagen.
 *
 * ## Was hier schiefgehen kann
 *
 * 1. **Ein Quartal wird auf ein Jahr hochgerechnet.** Aus 8 Prozent in drei
 *    Monaten werden 36 im Jahr – eine Zahl, die nie jemand verdient hat und
 *    die wie eine Prognose aussieht.
 * 2. **Das gewünschte Datum wird als das gerechnete ausgegeben.** Wer den
 *    1. Januar angibt, bekommt den ersten Handelstag danach. Steht auf der
 *    Seite trotzdem „ab 1. Januar“, ist das eine kleine Lüge – und sie fällt
 *    niemandem auf.
 * 3. **Ein leeres Fenster wird zu null Prozent.** Das wäre eine Behauptung
 *    über einen Zeitraum, über den nichts bekannt ist.
 * 4. **Der Maximalrückgang wird als Hoch minus Tief gerechnet.** Ein Tief
 *    *vor* dem Hoch hat niemand erlebt.
 * 5. **Die Jahresrendite wird linear statt geometrisch gerechnet.** Bei zwei
 *    Jahren und 44 Prozent kämen 22 statt 20 heraus – plausibel und falsch.
 */

import {
  fensterbefund,
  jahresfenster,
  maxRueckgang,
  punkteImFenster,
  spanneJahresrendite,
  vergleicheFenster,
  type Kurspunkt,
} from '@/lib/zeitfenster'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/** Baut eine Reihe aus Paaren `['2020-01-02', 100]`. */
function reihe(paare: [string, number][]): Kurspunkt[] {
  return paare.map(([t, value]) => ({ t, value }))
}

/* ------------------------------------------------------- Der Ausschnitt */

const zweiJahre = reihe([
  ['2019-12-30', 90],
  ['2020-01-02', 100],
  ['2020-06-15', 120],
  ['2020-12-30', 110],
  ['2021-01-04', 111],
  ['2021-12-30', 144],
  ['2022-01-03', 145],
])

pruefen(
  'Das Fenster nimmt nur, was hineingehört',
  punkteImFenster(zweiJahre, '2020-01-01', '2020-12-31').length === 3,
  `${punkteImFenster(zweiJahre, '2020-01-01', '2020-12-31')
    .map((p) => p.t)
    .join(', ')}`
)

pruefen(
  'Die Grenzen zählen mit',
  punkteImFenster(zweiJahre, '2020-01-02', '2020-12-30').length === 3,
  'Ein Fenster, das seine eigenen Eckdaten ausschließt, ist um zwei Tage zu kurz.'
)

pruefen(
  'Ein umgedrehtes Fenster ergibt nichts',
  punkteImFenster(zweiJahre, '2021-01-01', '2020-01-01').length === 0
)

/* ----------------------------------------- Das gewünschte gegen das echte Datum */

console.log('')

const jahr2020 = fensterbefund(zweiJahre, '2020-01-01', '2020-12-31')

pruefen(
  'Der Befund nennt den ersten Handelstag, nicht das Wunschdatum',
  jahr2020?.von === '2020-01-02',
  `${jahr2020?.von} – gefragt war der 1. Januar, gehandelt wurde am 2.`
)

pruefen(
  'Und den letzten, nicht den 31. Dezember',
  jahr2020?.bis === '2020-12-30',
  `${jahr2020?.bis}`
)

pruefen(
  'Die Rendite rechnet zwischen diesen beiden',
  Math.abs((jahr2020?.rendite ?? 0) - 10) < 1e-9,
  `${jahr2020?.rendite} – von 100 auf 110 sind 10 Prozent.`
)

/* --------------------------------------- Unter einem Jahr wird nicht hochgerechnet */

console.log('')

const quartal = fensterbefund(
  reihe([
    ['2020-01-02', 100],
    ['2020-03-31', 108],
  ]),
  '2020-01-01',
  '2020-03-31'
)

pruefen(
  'Ein Quartal hat eine Rendite',
  Math.abs((quartal?.rendite ?? 0) - 8) < 1e-9,
  `${quartal?.rendite}`
)

pruefen(
  'Aber keine Jahresrendite',
  quartal?.jahresrendite === null,
  `${quartal?.jahresrendite} – hochgerechnet wären das über 36 Prozent im Jahr,\n` +
    '     und die hat niemand verdient.'
)

/*
  Die Gegenprobe: Ab einem Jahr wird gerechnet, und zwar geometrisch.

  Zwei Jahre von 100 auf 144 sind 20 Prozent im Jahr (1,2 × 1,2 = 1,44), nicht
  22 (44 geteilt durch 2). Der lineare Fehler ist klein genug, um plausibel
  auszusehen, und wächst mit der Laufzeit.
*/
const zweiJahreGenau = fensterbefund(
  reihe([
    ['2020-01-01', 100],
    ['2021-12-31', 144],
  ]),
  '2020-01-01',
  '2021-12-31'
)

pruefen(
  'Zwei Jahre von 100 auf 144 sind 20 Prozent im Jahr',
  Math.abs((zweiJahreGenau?.jahresrendite ?? 0) - 20) < 0.1,
  `${zweiJahreGenau?.jahresrendite?.toFixed(2)} – linear gerechnet kämen 22 heraus.`
)

pruefen(
  'Ein Jahr mit 10 Prozent hat 10 Prozent Jahresrendite',
  (() => {
    const eines = fensterbefund(
      reihe([
        ['2020-01-01', 100],
        ['2020-12-31', 110],
      ]),
      '2020-01-01',
      '2020-12-31'
    )
    return (
      eines?.jahresrendite !== null &&
      eines !== null &&
      Math.abs((eines.jahresrendite ?? 0) - 10) < 0.2
    )
  })(),
  'Der Fall, bei dem beide Rechenwege dasselbe ergeben müssen.'
)

/* ------------------------------------------------------- Die leeren Fenster */

console.log('')

pruefen(
  'Ein Fenster ohne Daten ergibt null, nicht null Prozent',
  fensterbefund(zweiJahre, '2015-01-01', '2015-12-31') === null,
  '„0 Prozent“ wäre eine Behauptung über einen Zeitraum ohne Kurse.'
)

/*
  Der Fall, der beim Nachlesen der gebauten DAX-Seite aufgefallen ist.

  Der Bestand reicht fünf Jahre zurück und begann am 17. August 2021. Das
  Fenster „2021" deckte damit nur viereinhalb Monate ab – und stand mit der
  Überschrift „2021" und einer Jahresrendite da. Die echten Eckdaten waren
  angegeben, und trotzdem war es falsch: Wer eine Tabelle mit Jahreszahlen
  liest, liest Jahre.
*/
pruefen(
  'Ein Jahr, das erst im August beginnt, ist kein Jahr',
  fensterbefund(
    reihe([
      ['2021-08-17', 100],
      ['2021-12-27', 120],
    ]),
    '2021-01-01',
    '2021-12-31'
  ) === null,
  'Ein Etikett, das die Fußnote braucht, um nicht zu täuschen, ist ein falsches.'
)

pruefen(
  'Ein Jahr mit Feiertagen an beiden Enden zählt weiter als Jahr',
  fensterbefund(
    reihe([
      ['2021-01-04', 100],
      ['2021-12-30', 120],
    ]),
    '2021-01-01',
    '2021-12-31'
  ) !== null,
  'Die Gegenprobe: Die Abdeckungsgrenze darf nicht jedes Kalenderjahr abweisen.'
)

pruefen(
  'Ein Fenster mit einem einzigen Kurs ergibt auch null',
  fensterbefund(zweiJahre, '2020-06-01', '2020-06-30') === null,
  'Aus einem Kurs lässt sich keine Veränderung bilden.'
)

pruefen(
  'Ein Startwert von null ergibt null statt unendlich',
  fensterbefund(
    reihe([
      ['2020-01-01', 0],
      ['2020-12-31', 50],
    ]),
    '2020-01-01',
    '2020-12-31'
  ) === null,
  'Sonst stünde „∞ Prozent“ auf der Seite.'
)

/* ------------------------------------------------------ Der Maximalrückgang */

console.log('')

/*
  Der Fall, der „Hoch minus Tief“ von „größter erlebter Rückgang“ trennt.

  Die Reihe fällt zuerst von 100 auf 80, steigt dann auf 200 und fällt auf 180.
  Hoch minus Tief wären 60 Prozent (200 auf 80). Erlebt hat das niemand: Wer
  beim Hoch von 100 einstieg, verlor 20 Prozent; wer beim Hoch von 200 einstieg,
  verlor 10.
*/
const zickzack = reihe([
  ['2020-01-01', 100],
  ['2020-02-01', 80],
  ['2020-06-01', 200],
  ['2020-09-01', 180],
])

pruefen(
  'Der Rückgang zählt nur ab einem Hoch, das vorher dastand',
  Math.abs(maxRueckgang(zickzack) - -20) < 1e-9,
  `${maxRueckgang(zickzack)} – „Hoch minus Tief“ ergäbe −60 Prozent,\n` +
    '     und diesen Verlust hat niemand erlebt.'
)

pruefen(
  'Eine nur steigende Reihe hat keinen Rückgang',
  maxRueckgang(
    reihe([
      ['2020-01-01', 100],
      ['2020-06-01', 150],
    ])
  ) === 0
)

pruefen(
  'Eine leere Reihe ergibt null und nicht NaN',
  maxRueckgang([]) === 0,
  'NaN käme als „NaN %“ auf die Seite.'
)

/*
  Und der Fall, der beim Nachlesen der gebauten Seite aufgefallen ist.

  Der gespeicherte Kursbestand ist für ältere Jahre ausgedünnt: Der DAX hat
  2025 rund 146 Punkte, 2022 bis 2024 je 52 – Wochenwerte. Die Rendite
  überlebt das, weil sie nur die Enden braucht. Der tiefste Rückgang nicht: Er
  sucht das Tief zwischen zwei Hochs, und bei Wochenwerten liegt jedes zweite
  Tief zwischen den Punkten.

  Ein solcher Wert wäre nicht ungenau, sondern immer zu klein – und stünde in
  derselben Spalte neben einem aus Tageswerten, als wäre er vergleichbar.
*/
const woechentlich = reihe(
  Array.from({ length: 52 }, (_, i) => {
    const tag = new Date(Date.UTC(2022, 0, 3) + i * 7 * 86_400_000)
    return [tag.toISOString().slice(0, 10), 100 + i] as [string, number]
  })
)
const grob = fensterbefund(woechentlich, '2022-01-01', '2022-12-31')

pruefen(
  'Aus Wochenwerten kommt kein Rückgang',
  grob !== null && grob.maxRueckgang === null,
  `${grob?.maxRueckgang} bei ${grob?.punkte} Punkten – Dichte ${grob?.dichte.toFixed(2)}.`
)

pruefen(
  'Die Rendite kommt trotzdem',
  grob !== null && Math.abs(grob.rendite - 51) < 1,
  `${grob?.rendite.toFixed(1)} – sie braucht nur die beiden Enden.`
)

/*
  Die Gegenprobe: Tageswerte müssen einen Rückgang liefern. Ohne sie wäre
  nicht ausgeschlossen, dass die Grenze einfach alles abweist.
*/
const taeglich = reihe(
  /*
    Werktage über das ganze Jahr, nicht 250 aufeinanderfolgende Kalendertage.

    Der erste Anlauf nahm 250 Tage am Stück – die reichten vom 3. Januar bis
    zum 9. September und deckten das Fenster „2022" nur zu zwei Dritteln ab.
    Die Abdeckungsprüfung hat das zu Recht abgewiesen, und der Testaufbau war
    schuld, nicht die Bibliothek.
  */
  Array.from({ length: 365 }, (_, i) => new Date(Date.UTC(2022, 0, 1) + i * 86_400_000))
    .filter((tag) => tag.getUTCDay() >= 1 && tag.getUTCDay() <= 5)
    .map(
      (tag, i) =>
        [tag.toISOString().slice(0, 10), i === 125 ? 50 : 100 + i] as [string, number]
    )
)
const fein = fensterbefund(taeglich, '2022-01-01', '2022-12-31')

pruefen(
  'Aus Tageswerten kommt einer',
  fein !== null && fein.maxRueckgang !== null && fein.maxRueckgang < -50,
  `${fein?.maxRueckgang?.toFixed(1)} bei Dichte ${fein?.dichte.toFixed(2)} –\n` +
    '     der eingebaute Einbruch auf 50 muss gefunden werden.'
)

/* --------------------------------------------------- Mehrere Fenster */

console.log('')

const fenster = jahresfenster(2020, 2021)
pruefen(
  'Jahresfenster stehen jüngstes zuerst',
  fenster.map((f) => f.label).join() === '2021,2020',
  `${fenster.map((f) => f.label).join()}`
)

const vergleiche = vergleicheFenster(zweiJahre, jahresfenster(2018, 2021))

pruefen(
  'Fenster ohne Daten bleiben in der Liste',
  vergleiche.length === 4 && vergleiche.filter((v) => v.befund === null).length === 2,
  `${vergleiche.map((v) => `${v.fenster.label}:${v.befund ? 'ja' : 'nein'}`).join(', ')}\n` +
    '     Dass es einen Wert 2018 noch nicht gab, ist eine Auskunft und keine Lücke.'
)

/*
  Die Kernaussage der Seite: Der Abstand zwischen dem besten und dem
  schlechtesten Fenster.

  Ohne diesen Abstand ist die Seite eine Tabelle. Mit ihm ist sie ein Argument.
*/
const langeReihe = reihe([
  ['2020-01-02', 100],
  ['2020-12-30', 130],
  ['2021-01-04', 130],
  ['2021-12-30', 143],
  ['2022-01-03', 143],
  ['2022-12-30', 100],
])
const spanne = spanneJahresrendite(
  vergleicheFenster(langeReihe, jahresfenster(2020, 2022))
)

pruefen(
  'Die Spanne nennt bestes und schlechtestes Jahr',
  spanne !== null && spanne.bis > 25 && spanne.von < -25,
  spanne
    ? `${spanne.von.toFixed(1)} bis ${spanne.bis.toFixed(1)} Prozent`
    : 'keine Spanne'
)

pruefen(
  'Der Abstand ist die Differenz der beiden',
  spanne !== null && Math.abs(spanne.abstand - (spanne.bis - spanne.von)) < 1e-9
)

pruefen(
  'Aus einem einzigen Fenster gibt es keine Spanne',
  spanneJahresrendite(vergleicheFenster(langeReihe, jahresfenster(2020, 2020))) === null,
  'Ein Abstand aus einer Zahl wäre null – und sähe aus, als machte der\n' +
    '     Startpunkt keinen Unterschied. Genau das Gegenteil der Aussage.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
