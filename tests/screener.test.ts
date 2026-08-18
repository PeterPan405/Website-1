/**
 * Der Screener – und die Frage, ob er sagt, worauf er sich stützt.
 *
 * ## Was hier schiefgehen kann
 *
 * 1. **Ein fehlender Wert rutscht als Treffer durch.** `null <= 12` ist in
 *    JavaScript `true`, weil `null` zu 0 wird. Ein Titel ohne KGV stünde dann
 *    unter „KGV bis 12“ – als besonders günstig, weil er gar keines hat.
 * 2. **Fehlende Werte stehen beim Sortieren vorn.** Dasselbe Vorzeichen, eine
 *    andere Stelle: „aufsteigend nach KGV“ zeigte dann eine Seite voller
 *    Titel ohne KGV, und die günstigsten kämen danach.
 * 3. **Die Grundgesamtheit wird gegen den ganzen Katalog gerechnet.** Dann
 *    steht unter einer Abfrage „Deutschland, Chemie“ die Abdeckung aller 921
 *    Titel – eine wahre Zahl zur falschen Frage.
 * 4. **Der Börsenwert wird über Währungen hinweg verglichen.** 4 Billionen
 *    Yen sind nicht mehr als 3 Billionen Dollar.
 * 5. **Die Grundgesamtheit wird gar nicht mitgeliefert.** Der eigentliche
 *    Fehler dieser Seite, und der einzige, den man ihr nicht ansieht: Die
 *    Trefferliste sähe in jedem Fall plausibel aus.
 */

import {
  baueZeile,
  benutzteFelder,
  grundgesamtheit,
  kennzahlfilter,
  screene,
  sortiere,
  vorauswahl,
  type Screenerzeile,
} from '@/lib/screener'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/*
  Ein erfundener Bestand, der die echte Verzerrung nachbildet.

  Vier amerikanische Titel mit vollständigen Zahlen, vier deutsche und
  japanische ohne. Genau das Verhältnis, in dem der echte Bestand steht – und
  ohne solches Material greift keine der Prüfungen unten an einem echten Fall.
*/
function zeile(teil: Partial<Screenerzeile> & { symbol: string }): Screenerzeile {
  return {
    name: teil.symbol,
    ticker: teil.symbol.toUpperCase(),
    branche: null,
    land: null,
    waehrung: null,
    kgv: null,
    kuv: null,
    kbv: null,
    marktwertMrdEur: null,
    abstandHoch: null,
    ohneZahlen: null,
    ...teil,
  }
}

const bestand: Screenerzeile[] = [
  zeile({
    symbol: 'us-a',
    land: 'USA',
    branche: 'Technologie',
    kgv: 8,
    kbv: 1.2,
    marktwertMrdEur: 300,
    abstandHoch: -5,
  }),
  zeile({
    symbol: 'us-b',
    land: 'USA',
    branche: 'Technologie',
    kgv: 14,
    kbv: 3.1,
    marktwertMrdEur: 900,
    abstandHoch: -30,
  }),
  zeile({
    symbol: 'us-c',
    land: 'USA',
    branche: 'Banken',
    kgv: 11,
    kbv: 0.9,
    marktwertMrdEur: 120,
    abstandHoch: -12,
  }),
  zeile({
    symbol: 'us-d',
    land: 'USA',
    branche: 'Banken',
    kgv: 25,
    kbv: 2.0,
    marktwertMrdEur: 60,
    abstandHoch: -2,
  }),
  // Ohne Bilanzzahlen – der Regelfall außerhalb der USA.
  zeile({
    symbol: 'de-a',
    land: 'Deutschland',
    branche: 'Chemie',
    ohneZahlen: 'keineMeldung',
    abstandHoch: -22,
  }),
  zeile({
    symbol: 'de-b',
    land: 'Deutschland',
    branche: 'Banken',
    ohneZahlen: 'keineMeldung',
    abstandHoch: -9,
  }),
  zeile({
    symbol: 'jp-a',
    land: 'Japan',
    branche: 'Technologie',
    ohneZahlen: 'keineMeldung',
    abstandHoch: -18,
  }),
  zeile({
    symbol: 'jp-b',
    land: 'Japan',
    branche: 'Banken',
    ohneZahlen: 'keineMeldung',
    abstandHoch: -1,
  }),
]

console.log(
  `${bestand.length} Titel im Probebestand, ${bestand.filter((z) => z.kgv !== null).length} mit KGV\n`
)

/* ------------------------------------ Der Fehler, der wie ein Treffer aussieht */

const guenstig = kennzahlfilter(bestand, { kgvBis: 12 })

pruefen(
  'Ein Titel ohne KGV ist kein Treffer für „KGV bis 12“',
  guenstig.every((z) => z.kgv !== null),
  `Getroffen: ${guenstig.map((z) => `${z.symbol}=${z.kgv}`).join(', ')}\n` +
    '     `null <= 12` ist in JavaScript wahr – ein Titel ohne Kennzahl stünde\n' +
    '     dann als besonders günstig da, weil er gar keine hat.'
)

pruefen(
  'Und die richtigen sind dabei',
  guenstig
    .map((z) => z.symbol)
    .sort()
    .join() === 'us-a,us-c',
  `${guenstig.map((z) => z.symbol).join(', ')}`
)

pruefen(
  'Ohne Filter bleibt jeder Titel',
  kennzahlfilter(bestand, {}).length === bestand.length,
  'Ein leerer Filter darf nichts wegwerfen – auch nicht die Titel ohne Zahlen.'
)

pruefen(
  'Der Börsenwertfilter greift nach unten, nicht nach oben',
  kennzahlfilter(bestand, { marktwertAbMrdEur: 200 })
    .map((z) => z.symbol)
    .sort()
    .join() === 'us-a,us-b',
  'Bei vertauschtem Vergleich kämen die kleinen heraus – auch eine Liste.'
)

pruefen(
  'Der Abstand zum Hoch filtert auf „mindestens so weit darunter“',
  kennzahlfilter(bestand, { abstandHochBis: -20 })
    .map((z) => z.symbol)
    .sort()
    .join() === 'de-a,us-b',
  'Die Zahlen sind negativ; „bis −20“ heißt −22 ja, −5 nein.'
)

/* -------------------------------------------- Fehlende Werte beim Sortieren */

console.log('')

const aufsteigend = sortiere(bestand, 'kgv', 'auf')
pruefen(
  'Aufsteigend nach KGV beginnt mit dem günstigsten',
  aufsteigend[0].symbol === 'us-a',
  `${aufsteigend.map((z) => z.symbol).join(', ')}`
)

pruefen(
  'Titel ohne KGV stehen hinten – aufsteigend',
  aufsteigend.slice(0, 4).every((z) => z.kgv !== null),
  'Sonst ist die erste Seite voll mit Titeln, die gar kein KGV haben.'
)

const absteigend = sortiere(bestand, 'kgv', 'ab')
pruefen(
  'Titel ohne KGV stehen hinten – auch absteigend',
  absteigend.slice(0, 4).every((z) => z.kgv !== null),
  'In beide Richtungen hinten. `null` ist kein Wert, kein kleiner und kein großer.'
)

pruefen(
  'Absteigend beginnt mit dem teuersten',
  absteigend[0].symbol === 'us-d',
  `${absteigend.map((z) => z.symbol).join(', ')}`
)

pruefen(
  'Bei gleichem Wert entscheidet der Name',
  (() => {
    const gleich = [
      zeile({ symbol: 'zeta', name: 'Zeta', kgv: 10 }),
      zeile({ symbol: 'alpha', name: 'Alpha', kgv: 10 }),
    ]
    return sortiere(gleich, 'kgv', 'auf')[0].name === 'Alpha'
  })(),
  'Sonst wackelt die Reihenfolge zwischen zwei Bauten, ohne dass sich etwas ändert.'
)

/* ------------------------------------------------ Die Grundgesamtheit */

console.log('')

const alles = grundgesamtheit(bestand, 'kgv')
pruefen(
  `Über alles: ${alles.belegt} von ${alles.gesamt} haben ein KGV`,
  alles.belegt === 4 && alles.gesamt === 8
)

pruefen(
  'Die Aufschlüsselung nennt jedes Land',
  alles.nachLand
    .map((l) => l.land)
    .sort()
    .join() === 'Deutschland,Japan,USA',
  `${alles.nachLand.map((l) => l.land).join(', ')}`
)

pruefen(
  'Und sie zeigt die Verzerrung',
  alles.nachLand.find((l) => l.land === 'USA')?.belegt === 4 &&
    alles.nachLand.find((l) => l.land === 'Deutschland')?.belegt === 0,
  'Das ist der ganze Zweck: 50 % über alles, 100 % in den USA, 0 % in Deutschland.'
)

/*
  Der Kern: Die Grundgesamtheit gilt der Vorauswahl, nicht dem Katalog.

  Wer „Banken“ abfragt, will wissen, wie vollständig die Banken sind. Eine
  Abdeckung über alle Titel wäre eine wahre Zahl zur falschen Frage – und man
  sähe ihr nicht an, dass sie die falsche ist.
*/
const nurBanken = vorauswahl(bestand, { branche: 'Banken' })
const bankenBasis = grundgesamtheit(nurBanken, 'kgv')
pruefen(
  `Innerhalb „Banken“: ${bankenBasis.belegt} von ${bankenBasis.gesamt}`,
  bankenBasis.gesamt === 4 && bankenBasis.belegt === 2,
  'Vier Banken im Bestand, zwei davon mit KGV – nicht acht und vier.'
)

pruefen(
  'Die Länderaufschlüsselung folgt der Vorauswahl mit',
  bankenBasis.nachLand.every((l) => l.gesamt <= 2),
  `${bankenBasis.nachLand.map((l) => `${l.land} ${l.belegt}/${l.gesamt}`).join(', ')}`
)

/* ------------------------------------ Das Ergebnis bringt beides mit */

console.log('')

const ergebnis = screene(bestand, { land: 'USA', kgvBis: 12 })
pruefen(
  'Das Ergebnis nennt die Vorauswahl',
  ergebnis.vorauswahl === 4,
  `${ergebnis.vorauswahl} – vier amerikanische Titel, bevor das KGV greift.`
)

pruefen(
  'Das Ergebnis nennt die Grundgesamtheit der benutzten Kennzahl',
  ergebnis.grundgesamtheiten.length === 1 &&
    ergebnis.grundgesamtheiten[0].feld === 'kgv' &&
    ergebnis.grundgesamtheiten[0].belegt === 4,
  'Ohne diese Zahl ist die Trefferliste eine Behauptung.'
)

pruefen(
  'Ein Filter ohne Kennzahl braucht keine Grundgesamtheit',
  screene(bestand, { land: 'Japan' }).grundgesamtheiten.length === 0,
  'Branche und Land stehen im Katalog – da gibt es nichts aufzuklären.'
)

pruefen(
  'Zwei Kennzahlen ergeben zwei Grundgesamtheiten',
  screene(bestand, { kgvBis: 20, kbvBis: 2 }).grundgesamtheiten.length === 2
)

pruefen(
  'benutzteFelder nennt genau die gesetzten',
  benutzteFelder({ kgvBis: 1, abstandHochBis: -5 }).sort().join() === 'abstandHoch,kgv',
  `${benutzteFelder({ kgvBis: 1, abstandHochBis: -5 }).join(', ')}`
)

/*
  Die Gegenprobe zur Unterscheidung „nicht gesetzt“ gegen „auf null gesetzt“.

  `kgvBis: 0` ist eine sinnvolle, wenn auch leere Abfrage. Würde sie wie
  „nicht gesetzt“ behandelt, käme der ganze Bestand zurück – die gefährlichste
  Art von Antwort, weil sie nach einem Ergebnis aussieht.
*/
pruefen(
  'Ein Filterwert von null ist gesetzt und nicht „egal“',
  screene(bestand, { kgvBis: 0 }).treffer.length === 0 &&
    benutzteFelder({ kgvBis: 0 }).length === 1,
  'Sonst liefert eine unerfüllbare Abfrage den ganzen Bestand.'
)

/* ------------------------------------------------------ Die Zeile bauen */

console.log('')

const jeEuro = { USD: 1.1, JPY: 160 }
const umrechnen = (betrag: number, von: string): number | null => {
  if (von === 'EUR') return betrag
  const kurs = jeEuro[von as keyof typeof jeEuro]
  return kurs ? betrag / kurs : null
}

const ausZahlen = baueZeile(
  { symbol: 'x', name: 'X', ticker: 'X', branche: 'Technologie', land: 'USA' },
  {
    art: 'zahlen',
    waehrung: 'USD',
    kennzahlen: {
      marktkapitalisierung: { wert: 110_000_000_000, grund: null },
      kgv: { wert: 18, grund: null },
      kuv: { wert: 4, grund: null },
      kbv: { wert: null, grund: 'negativesEigenkapital' },
      cashflowJeAktie: { wert: 3, grund: null },
      belegt: 4,
    },
  },
  -7,
  umrechnen
)

pruefen(
  'Der Börsenwert wird in Euro umgerechnet',
  Math.abs((ausZahlen.marktwertMrdEur ?? 0) - 100) < 1e-9,
  `${ausZahlen.marktwertMrdEur} – 110 Mrd USD zu 1,10 sind 100 Mrd EUR.`
)

pruefen(
  'Eine Kennzahl mit Grund bleibt null und wird nicht zu einer Zahl',
  ausZahlen.kbv === null && ausZahlen.kgv === 18,
  'Negatives Eigenkapital ergibt kein KBV – und kein „0“.'
)

pruefen(
  'Ohne Wechselkurs bleibt der Börsenwert leer statt falsch',
  baueZeile(
    { symbol: 'y', name: 'Y', ticker: 'Y' },
    {
      art: 'zahlen',
      waehrung: 'KRW',
      kennzahlen: {
        marktkapitalisierung: { wert: 5_000_000_000_000, grund: null },
        kgv: { wert: 9, grund: null },
        kuv: { wert: null, grund: 'fehlt' },
        kbv: { wert: null, grund: 'fehlt' },
        cashflowJeAktie: { wert: null, grund: 'fehlt' },
        belegt: 2,
      },
    },
    null,
    umrechnen
  ).marktwertMrdEur === null,
  'Won ohne Kurs: Die Zahl unumgerechnet stehen zu lassen wäre der Vergleich,\n' +
    '     gegen den die ganze Umrechnung gebaut ist.'
)

pruefen(
  'Ein Titel ohne Meldung behält seinen Grund',
  baueZeile(
    { symbol: 'z', name: 'Z', ticker: 'Z', land: 'Deutschland' },
    { art: 'keineMeldung' },
    -14,
    umrechnen
  ).ohneZahlen === 'keineMeldung',
  '„Keine Angabe“ ohne Begründung ist auf einer Bildungsseite die schlechteste Antwort.'
)

pruefen(
  'Der Abstand zum Hoch überlebt auch ohne Bilanzzahlen',
  baueZeile(
    { symbol: 'z', name: 'Z', ticker: 'Z' },
    { art: 'keineMeldung' },
    -14,
    umrechnen
  ).abstandHoch === -14,
  'Er kommt aus dem Kurs, nicht aus der Bilanz – die Lücke betrifft ihn nicht.'
)

pruefen(
  'Kein Befund ergibt eine Zeile ohne Zahlen und ohne Grund',
  (() => {
    const ohne = baueZeile({ symbol: 'q', name: 'Q', ticker: 'Q' }, null, null, umrechnen)
    return ohne.kgv === null && ohne.ohneZahlen === null
  })(),
  'Für alles außer Aktien gibt es keinen Befund – und dann auch keinen Vorwurf.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
