/**
 * Kaufen oder mieten – und die Frage, ob der Vergleich fair ist.
 *
 * ## Was hier wirklich schiefgehen kann
 *
 * Nicht die Arithmetik. Sondern die **Gleichstellung**: Ein Vergleich, in dem
 * eine Seite mehr Geld ausgibt als die andere, hat sein Ergebnis schon vor der
 * ersten Zeile. Genau so werden Kaufen-oder-mieten-Rechner üblicherweise
 * falsch – der Mieter legt die Differenz nicht an, das Eigenkapital taucht auf
 * der Mietseite gar nicht auf, oder die Nebenkosten verschwinden im Kaufpreis.
 *
 * Geprüft wird deshalb an Eigenschaften, die ein fairer Vergleich haben muss:
 *
 * 1. **Beide geben gleich viel aus.** In jedem Jahr: Ausgaben des Käufers =
 *    Miete + angelegte Differenz.
 * 2. **Jeder Posten wirkt in die Richtung, die er haben muss.** Höhere
 *    Nebenkosten dürfen den Käufer nur schlechter stellen, eine höhere
 *    Anlagerendite nur den Mieter besser. Ein Rechner, bei dem ein Posten in
 *    die falsche Richtung zieht, ist an einer Stelle falsch verdrahtet, und
 *    das sieht man keiner Endzahl an.
 * 3. **Die notwendige Wertsteigerung ist wirklich der Schnittpunkt.** Setzt man
 *    sie ein, müssen beide Seiten gleich herauskommen – sonst ist es eine
 *    Zahl, die nur so aussieht.
 */

import {
  notwendigeWertsteigerung,
  vergleicheKaufMiete,
  type Kaufmietvergleich,
} from '@/lib/kaufen-mieten'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/** Ein Fall, der ungefähr der Wirklichkeit von 2026 entspricht. */
const basis: Kaufmietvergleich = {
  kaufpreis: 400_000,
  nebenkostenProzent: 10,
  eigenkapital: 100_000,
  zinsProzent: 3.8,
  tilgungProzent: 2,
  instandhaltungProzent: 1.2,
  wertsteigerungProzent: 2,
  mieteProMonat: 1_200,
  mietsteigerungProzent: 2,
  anlagerenditeProzent: 6,
  jahre: 20,
  kirchensteuersatz: 0,
}

const ergebnis = vergleicheKaufMiete(basis)

console.log(
  `Kauf: ${ergebnis.vermoegenKauf.toFixed(0)} €, Miete: ${ergebnis.vermoegenMiete.toFixed(0)} €\n` +
    `Nebenkosten ${ergebnis.nebenkosten.toFixed(0)} €, Darlehen ${ergebnis.darlehen.toFixed(0)} €, ` +
    `Rate + Unterhalt ${ergebnis.monatsrateKauf.toFixed(0)} €/Monat\n`
)

/* ---------------------------------------- Beide geben gleich viel aus */

/*
  Die Prüfung, an der alles hängt.

  Gibt der Mieter weniger aus als der Käufer und legt die Differenz **nicht**
  an, vergleicht der Rechner einen Sparer mit einem Nicht-Sparer. Das Ergebnis
  stünde dann vorher fest, und zwar für die Kaufseite.
*/
pruefen(
  'In jedem Jahr: Ausgaben des Käufers = Miete + Anlage',
  ergebnis.verlauf.every((j) => Math.abs(j.ausgabenKauf - (j.miete + j.anlage)) < 0.01),
  'Sonst geben die beiden Seiten verschieden viel aus, und der Vergleich ist keiner.'
)

pruefen(
  'Der Verlauf hat eine Zeile je Jahr',
  ergebnis.verlauf.length === basis.jahre,
  `${ergebnis.verlauf.length} statt ${basis.jahre}`
)

/* -------------------------------- Jeder Posten wirkt in seine Richtung */

console.log('')

function unterschiedBei(aenderung: Partial<Kaufmietvergleich>): number {
  return vergleicheKaufMiete({ ...basis, ...aenderung }).unterschied
}

const grund = ergebnis.unterschied

/*
  Jeder dieser Posten wird einzeln bewegt, und zwar in eine Richtung, deren
  Wirkung sich ohne Rechnung sagen lässt. Eine Kennzahl, die dabei in die
  falsche Richtung geht, ist falsch verdrahtet – und das sieht man keiner
  Endzahl an.
*/
const richtungen: {
  was: string
  aenderung: Partial<Kaufmietvergleich>
  besser: 'kauf' | 'miete'
}[] = [
  { was: 'höhere Nebenkosten', aenderung: { nebenkostenProzent: 15 }, besser: 'miete' },
  { was: 'höherer Kreditzins', aenderung: { zinsProzent: 5.5 }, besser: 'miete' },
  {
    was: 'höhere Instandhaltung',
    aenderung: { instandhaltungProzent: 2 },
    besser: 'miete',
  },
  {
    was: 'höhere Anlagerendite',
    aenderung: { anlagerenditeProzent: 9 },
    besser: 'miete',
  },
  {
    was: 'höhere Wertsteigerung',
    aenderung: { wertsteigerungProzent: 4 },
    besser: 'kauf',
  },
  { was: 'höhere Miete', aenderung: { mieteProMonat: 1_600 }, besser: 'kauf' },
  {
    was: 'stärker steigende Miete',
    aenderung: { mietsteigerungProzent: 4 },
    besser: 'kauf',
  },
]

for (const fall of richtungen) {
  const neu = unterschiedBei(fall.aenderung)
  const gewollt = fall.besser === 'kauf' ? neu > grund : neu < grund
  pruefen(
    `${fall.was} → besser für ${fall.besser === 'kauf' ? 'den Käufer' : 'den Mieter'}`,
    gewollt,
    `Unterschied ${grund.toFixed(0)} € → ${neu.toFixed(0)} €. Der Posten zieht in die ` +
      'falsche Richtung, und das sieht man keiner Endzahl an.'
  )
}

/* --------------------------------- Die Nebenkosten sind wirklich weg */

console.log('')

/*
  Der Lehrsatz des Rechners, nachgerechnet: Die Nebenkosten sind am Tag des
  Kaufs ausgegeben. Sie stecken nicht in der Immobilie und tauchen im
  Immobilienwert nie wieder auf.
*/
pruefen(
  'Ohne Nebenkosten steht der Käufer um deren Betrag samt Zinsen besser da',
  (() => {
    const ohne = vergleicheKaufMiete({ ...basis, nebenkostenProzent: 0 })
    const gewinn = ohne.unterschied - grund
    return gewinn > ergebnis.nebenkosten
  })(),
  'Die 40.000 € sind nicht nur weg – sie sind mitfinanziert und kosten 20 Jahre Zinsen.'
)

pruefen(
  'Das Eigenkapital steht auf beiden Seiten am Anfang',
  (() => {
    /*
      Ohne Eigenkapital muss der Käufer mehr finanzieren, der Mieter hat nichts
      im Depot. Beide werden schlechter – aber der Vergleich darf nicht
      zusammenbrechen, und niemand darf aus dem Nichts gewinnen.
    */
    const ohne = vergleicheKaufMiete({ ...basis, eigenkapital: 0 })
    return (
      ohne.vermoegenKauf < ergebnis.vermoegenKauf &&
      ohne.vermoegenMiete < ergebnis.vermoegenMiete &&
      ohne.darlehen > ergebnis.darlehen
    )
  })(),
  'Fehlt es auf einer Seite, ist der Vergleich verzerrt.'
)

/* --------------------------- Die notwendige Wertsteigerung ist ein Schnittpunkt */

console.log('')

const noetig = ergebnis.notwendigeWertsteigerungProzent
console.log(
  `  Notwendige Wertsteigerung: ${noetig === null ? 'keine im Suchbereich' : noetig.toFixed(2) + ' %'}\n`
)

pruefen(
  'Es gibt eine notwendige Wertsteigerung',
  noetig !== null,
  'Im Grundfall muss ein Schnittpunkt existieren – sonst prüft der Rest nichts.'
)

if (noetig !== null) {
  /*
    Die Probe aufs Exempel. Setzt man die Zahl ein, müssen beide Seiten gleich
    herauskommen – sonst ist es eine Zahl, die nur so aussieht.
  */
  const beim = vergleicheKaufMiete({ ...basis, wertsteigerungProzent: noetig })
  pruefen(
    'Bei dieser Wertsteigerung stehen beide gleich',
    Math.abs(beim.unterschied) < 1,
    `Unterschied ${beim.unterschied.toFixed(2)} € statt null.`
  )

  pruefen(
    'Ein Zehntelprozentpunkt darüber kippt es zum Käufer',
    vergleicheKaufMiete({ ...basis, wertsteigerungProzent: noetig + 0.1 }).unterschied >
      0,
    'Sonst ist es kein Schnittpunkt, sondern eine Zufallszahl.'
  )
  pruefen(
    'Ein Zehntelprozentpunkt darunter kippt es zum Mieter',
    vergleicheKaufMiete({ ...basis, wertsteigerungProzent: noetig - 0.1 }).unterschied < 0
  )
}

pruefen(
  'Außerhalb des Suchbereichs gibt es keine Zahl',
  notwendigeWertsteigerung({
    ...basis,
    /* Eine Miete, gegen die kein Kauf verlieren kann. */
    mieteProMonat: 9_000,
  }) === null,
  'Eine Randzahl auszugeben, die wie ein Ergebnis aussieht, wäre der schlechtere Weg.'
)

/* ------------------------------------------------- Steuer und Ränder */

console.log('')

pruefen(
  'Der Depotgewinn wird versteuert',
  ergebnis.steuerMieter > 0 &&
    vergleicheKaufMiete({ ...basis, kirchensteuersatz: 0.09 }).steuerMieter >
      ergebnis.steuerMieter,
  'Die Asymmetrie zur steuerfreien Wertsteigerung ist der Grund, warum sie dasteht.'
)

pruefen(
  'Ohne Depotgewinn keine Steuer',
  vergleicheKaufMiete({ ...basis, anlagerenditeProzent: 0, eigenkapital: 0 })
    .steuerMieter === 0,
  'Sonst wird auf Einzahlungen Steuer gerechnet.'
)

pruefen(
  'Ein Jahr Laufzeit läuft durch',
  (() => {
    const kurz = vergleicheKaufMiete({ ...basis, jahre: 1 })
    return (
      kurz.verlauf.length === 1 &&
      Number.isFinite(kurz.vermoegenKauf) &&
      Number.isFinite(kurz.vermoegenMiete)
    )
  })(),
  'Der kürzeste sinnvolle Zeitraum darf nicht in eine leere Schleife laufen.'
)

pruefen(
  'Ein Kauf ohne Kredit läuft durch',
  (() => {
    const bar = vergleicheKaufMiete({ ...basis, eigenkapital: 500_000 })
    return bar.darlehen === 0 && Number.isFinite(bar.vermoegenKauf)
  })(),
  'Wer bar zahlt, hat keine Rate – die Rechnung darf trotzdem nicht durch null teilen.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
