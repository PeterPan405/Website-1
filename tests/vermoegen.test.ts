/**
 * Prüfungen für den Vermögensbogen.
 *
 * Zwei Dinge müssen hier stimmen, und beide fallen sonst niemandem auf:
 *
 * 1. **Das Vorzeichen.** Schulden werden als positive Beträge eingetragen und
 *    beim Nettovermögen abgezogen. Wer sie stattdessen addiert, bekommt eine
 *    Zahl, die stetig steigt, je mehr er schuldet.
 * 2. **Die Datei.** Sie soll in einer deutschen Tabellenkalkulation aufgehen,
 *    ohne dass jemand einen Importdialog bedient. Das hängt an drei Details –
 *    Semikolon, Dezimalkomma und der Maskierung von Feldern, in denen selbst
 *    ein Semikolon steckt.
 */

import {
  alsTabelle,
  bogen,
  dateiname,
  werteAuswerten,
  type Werte,
} from '../lib/vermoegen.ts'

let bestanden = 0
let gescheitert = 0

function pruefe(name: string, bedingung: boolean, hinweis?: string) {
  if (bedingung) {
    bestanden++
    console.log(`OK   ${name}`)
  } else {
    gescheitert++
    console.error(`FEHL ${name}${hinweis ? ` – ${hinweis}` : ''}`)
  }
}

console.log('\n— Der Aufbau des Bogens —')

const alleIds = bogen.flatMap((gruppe) => gruppe.posten.map((posten) => posten.id))
pruefe(
  'jede Postennummer kommt genau einmal vor',
  new Set(alleIds).size === alleIds.length,
  `${alleIds.length} Posten, ${new Set(alleIds).size} verschiedene`
)
pruefe(
  'jede Gruppennummer kommt genau einmal vor',
  new Set(bogen.map((gruppe) => gruppe.id)).size === bogen.length
)
pruefe(
  'es gibt Gruppen beider Arten',
  bogen.some((gruppe) => gruppe.art === 'besitz') &&
    bogen.some((gruppe) => gruppe.art === 'schulden')
)
pruefe(
  'jede Gruppe hat eine Erklärung und mindestens einen Posten',
  bogen.every((gruppe) => gruppe.erklaerung.length > 0 && gruppe.posten.length > 0)
)
pruefe(
  'keine Postennummer enthält ein Zeichen, das im Speicher stört',
  alleIds.every((id) => /^[a-zA-Z]+$/.test(id)),
  alleIds.filter((id) => !/^[a-zA-Z]+$/.test(id)).join(', ')
)

console.log('\n— Die Summen —')

const beispiel: Werte = {
  giro: 2_500,
  tagesgeld: 12_000,
  depot: 48_000,
  immobilie: 320_000,
  hypothek: 180_000,
  dispo: 1_500,
}

const auswertung = werteAuswerten(beispiel)

pruefe(
  'der Besitz ist die Summe aller Besitzgruppen',
  auswertung.besitz === 2_500 + 12_000 + 48_000 + 320_000,
  auswertung.besitz.toString()
)
pruefe(
  'die Schulden sind die Summe aller Schuldengruppen',
  auswertung.schulden === 180_000 + 1_500,
  auswertung.schulden.toString()
)
pruefe(
  'das Nettovermögen ist Besitz minus Schulden',
  auswertung.netto === 382_500 - 181_500,
  auswertung.netto.toString()
)
pruefe(
  'die Gruppensummen stimmen einzeln',
  auswertung.jeGruppe.liquide === 14_500 &&
    auswertung.jeGruppe.anlagen === 48_000 &&
    auswertung.jeGruppe.sachwerte === 320_000 &&
    auswertung.jeGruppe.immobilienkredite === 180_000
)
pruefe(
  'leere Gruppen stehen mit null in der Auswertung',
  auswertung.jeGruppe.vorsorge === 0
)
pruefe(
  'gezählt wird, wie viele Zeilen ausgefüllt sind',
  auswertung.ausgefuellt === 6,
  auswertung.ausgefuellt.toString()
)

/*
  Der Fall, der beim ersten Ausfüllen häufig eintritt: mehr Schulden als
  Besitz. Das Ergebnis muss negativ herauskommen und darf nicht auf null
  begrenzt werden – eine geschönte Null wäre hier die schlechtere Auskunft.
*/
const ueberschuldet = werteAuswerten({ giro: 500, ratenkredit: 8_000 })
pruefe(
  'mehr Schulden als Besitz ergeben ein negatives Nettovermögen',
  ueberschuldet.netto === -7_500,
  ueberschuldet.netto.toString()
)

const leer = werteAuswerten({})
pruefe(
  'ein leerer Bogen ergibt überall null',
  leer.besitz === 0 && leer.schulden === 0 && leer.netto === 0 && leer.ausgefuellt === 0
)

console.log('\n— Was nicht schiefgehen darf —')

const unsinn = werteAuswerten({
  giro: Number.NaN,
  tagesgeld: Number.POSITIVE_INFINITY,
  depot: 1_000,
} as Werte)
pruefe(
  'NaN und Unendlich werden wie eine leere Zeile behandelt',
  unsinn.netto === 1_000,
  unsinn.netto.toString()
)

const unbekannt = werteAuswerten({ giro: 100, gibtEsNicht: 999_999 })
pruefe(
  'eine unbekannte Postennummer fließt in keine Summe ein',
  unbekannt.besitz === 100,
  unbekannt.besitz.toString()
)

console.log('\n— Die Tabelle —')

const gefuellt = alsTabelle({
  werte: beispiel,
  stichtag: '2026-07-29',
  weitereSpalten: 3,
})
const zeilen = gefuellt.split('\r\n')

pruefe('die Zeilen sind mit CRLF getrennt', gefuellt.includes('\r\n'))
pruefe('die Datei endet mit einem Zeilenumbruch', gefuellt.endsWith('\r\n'))
pruefe(
  'die Kopfzeile trägt den Stichtag',
  zeilen[0].startsWith('Bereich;Posten;2026-07-29'),
  zeilen[0]
)
pruefe(
  'für die nächsten Male stehen drei leere Spalten bereit',
  zeilen[0] === 'Bereich;Posten;2026-07-29;;;',
  zeilen[0]
)

/*
  Alle Zeilen mit Inhalt müssen gleich viele Trennzeichen haben. Sonst
  verschiebt sich in der Tabellenkalkulation eine einzelne Zeile gegenüber allen
  anderen – und man sieht es erst, wenn man addiert.
*/
const spaltenzahlen = new Set(
  zeilen.filter((zeile) => zeile.length > 0).map((zeile) => zeile.split(';').length)
)
pruefe(
  'alle gefüllten Zeilen haben gleich viele Spalten',
  spaltenzahlen.size === 1 && spaltenzahlen.has(6),
  [...spaltenzahlen].join(', ')
)

pruefe(
  'jeder Posten steht mit seinem Namen in der Tabelle',
  bogen.every((gruppe) =>
    gruppe.posten.every((posten) => gefuellt.includes(posten.label))
  )
)
pruefe(
  'Beträge stehen mit Dezimalkomma da',
  gefuellt.includes(';48000,00'),
  zeilen.find((zeile) => zeile.includes('Depot')) ?? '—'
)
pruefe('kein Betrag enthält einen Dezimalpunkt', !/;\d+\.\d/.test(gefuellt))
pruefe(
  'nicht ausgefüllte Zeilen bleiben leer und werden nicht zu 0,00',
  gefuellt.includes('Bargeld;;') && !gefuellt.includes('Bargeld;0,00'),
  zeilen.find((zeile) => zeile.includes(';Bargeld;')) ?? '—'
)
pruefe(
  'die Gruppensumme steht auch dann da, wenn die Gruppe leer ist',
  gefuellt.includes('Summe Altersvorsorge;0,00'),
  zeilen.find((zeile) => zeile.includes('Summe Altersvorsorge')) ?? '—'
)
pruefe(
  'das Nettovermögen steht am Ende',
  gefuellt.includes('NETTOVERMÖGEN;201000,00'),
  zeilen.at(-2) ?? '—'
)
pruefe(
  'jede Gruppe bekommt eine Summenzeile',
  bogen.every((gruppe) => gefuellt.includes(`Summe ${gruppe.titel}`))
)

const blanko = alsTabelle({ stichtag: '2026-07-29', weitereSpalten: 3 })
pruefe(
  'der leere Bogen enthält dieselben Zeilen',
  blanko.split('\r\n').length === zeilen.length
)
// Ohne die Kopfzeile: In ihr steht der Stichtag, und der besteht aus Ziffern.
const blankoRumpf = blanko.split('\r\n').slice(1).join('\r\n')
pruefe(
  'der leere Bogen enthält keinen einzigen Betrag',
  !/;-?\d/.test(blankoRumpf),
  blankoRumpf.split('\r\n').find((zeile) => /;-?\d/.test(zeile)) ?? '—'
)
pruefe(
  'auch der leere Bogen trägt den Stichtag',
  blanko.startsWith('Bereich;Posten;2026-07-29')
)

const ohneWeitereSpalten = alsTabelle({ stichtag: '2026-07-29', weitereSpalten: 0 })
pruefe(
  'ohne weitere Spalten bleiben genau drei',
  ohneWeitereSpalten.split('\r\n')[0] === 'Bereich;Posten;2026-07-29'
)

console.log('\n— Maskierung —')

/*
  Der Text „Raten- und Konsumkredite“ ist harmlos, aber sobald jemand einen
  Posten mit Semikolon oder Anführungszeichen ergänzt, muss die Maskierung
  greifen. Geprüft wird sie deshalb an einer eigens gebauten Zeile.
*/
const heikel = bogen.some((gruppe) =>
  gruppe.posten.some((posten) => /[";\n]/.test(posten.label))
)
pruefe('kein vorhandener Posten braucht Maskierung', !heikel)

console.log('\n— Der Dateiname —')

pruefe(
  'der ausgefüllte Bogen heißt nach dem Stichtag',
  dateiname('2026-07-29', true) === 'vermoegensuebersicht-2026-07-29.csv',
  dateiname('2026-07-29', true)
)
pruefe(
  'der leere Bogen ist als solcher erkennbar',
  dateiname('2026-07-29', false) === 'vermoegensuebersicht-2026-07-29-leer.csv',
  dateiname('2026-07-29', false)
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
