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
  ausAltemFormat,
  bogen,
  dateiname,
  neueZeile,
  werteAuswerten,
  zeilenVon,
  type Werte,
} from '../lib/vermoegen.ts'

/** Kurzschreibweise: eine einzelne Zeile ohne Namen. */
function eine(betrag: number): ReturnType<typeof neueZeile>[] {
  return [neueZeile(betrag)]
}

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
  giro: eine(2_500),
  tagesgeld: eine(12_000),
  depot: eine(48_000),
  immobilie: eine(320_000),
  hypothek: eine(180_000),
  dispo: eine(1_500),
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
const ueberschuldet = werteAuswerten({ giro: eine(500), ratenkredit: eine(8_000) })
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
  giro: eine(Number.NaN),
  tagesgeld: eine(Number.POSITIVE_INFINITY),
  depot: eine(1_000),
})
pruefe(
  'NaN und Unendlich werden wie eine leere Zeile behandelt',
  unsinn.netto === 1_000,
  unsinn.netto.toString()
)

const unbekannt = werteAuswerten({ giro: eine(100), gibtEsNicht: eine(999_999) })
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

console.log('\n— Mehrere Zeilen je Posten —')

const mehrere: Werte = {
  giro: [
    neueZeile(2_000, 'Girokonto Sparkasse'),
    neueZeile(800, 'Gemeinschaftskonto'),
    neueZeile(150),
  ],
  depot: [neueZeile(48_000, 'Depot ING')],
}
const summeMehrere = werteAuswerten(mehrere)

pruefe(
  'alle Zeilen eines Postens werden addiert',
  summeMehrere.jeGruppe.liquide === 2_950,
  String(summeMehrere.jeGruppe.liquide)
)
pruefe(
  'jede ausgefüllte Zeile zählt einzeln',
  summeMehrere.ausgefuellt === 4,
  String(summeMehrere.ausgefuellt)
)

const tabelleMehrere = alsTabelle({
  werte: mehrere,
  stichtag: '2026-07-29',
  weitereSpalten: 2,
})
pruefe(
  'jede Zeile steht mit ihrem eigenen Namen in der Tabelle',
  tabelleMehrere.includes('Girokonto Sparkasse;2000,00') &&
    tabelleMehrere.includes('Gemeinschaftskonto;800,00'),
  tabelleMehrere
    .split('\r\n')
    .filter((zeile) => zeile.includes('Konten'))
    .join(' / ')
)
pruefe(
  'eine Zeile ohne Namen bekommt die Bezeichnung des Postens',
  tabelleMehrere.includes('Girokonto;150,00')
)

/*
  Die Spaltenzahl muss auch dann gleich bleiben, wenn ein Posten drei Zeilen
  hat und ein anderer keine – sonst verrutscht in der Tabellenkalkulation
  genau die Zeile, die jemand von Hand ergänzt hat.
*/
const spaltenMehrere = new Set(
  tabelleMehrere
    .split('\r\n')
    .filter((zeile) => zeile.length > 0)
    .map((zeile) => zeile.split(';').length)
)
pruefe(
  'auch bei mehreren Zeilen je Posten stimmen die Spalten',
  spaltenMehrere.size === 1 && spaltenMehrere.has(5),
  [...spaltenMehrere].join(', ')
)

pruefe(
  'ein Posten ohne Eintrag steht trotzdem mit seiner Zeile da',
  tabelleMehrere.includes('Bargeld;;')
)

console.log('\n— Die alte Speicherform —')

/*
  Wer den Bogen vor der Erweiterung ausgefüllt hat, hat eine Zahl je Posten
  auf seinem Gerät. Sie darf beim nächsten Besuch nicht verschwinden.
*/
const umgestellt = ausAltemFormat({ giro: 2_500, depot: 48_000, unsinn: Number.NaN })
pruefe(
  'aus einer Zahl wird eine Zeile',
  zeilenVon(umgestellt, 'giro').length === 1 &&
    zeilenVon(umgestellt, 'giro')[0].betrag === 2_500
)
pruefe('die umgestellte Zeile hat keinen Namen', !zeilenVon(umgestellt, 'giro')[0].name)
pruefe(
  'jede umgestellte Zeile bekommt eine eigene Nummer',
  zeilenVon(umgestellt, 'giro')[0].id !== zeilenVon(umgestellt, 'depot')[0].id
)
pruefe('unbrauchbare Zahlen fallen weg', zeilenVon(umgestellt, 'unsinn').length === 0)
pruefe(
  'die Summe bleibt nach der Umstellung dieselbe',
  werteAuswerten(umgestellt).netto === 50_500,
  String(werteAuswerten(umgestellt).netto)
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
  dateiname('2026-07-29', true) === 'vermoegensuebersicht-2026-07-29.pdf',
  dateiname('2026-07-29', true)
)
pruefe(
  'der leere Bogen ist als solcher erkennbar',
  dateiname('2026-07-29', false) === 'vermoegensuebersicht-2026-07-29-leer.pdf',
  dateiname('2026-07-29', false)
)
pruefe(
  'die Tabelle bekommt dieselbe Benennung mit anderer Endung',
  dateiname('2026-07-29', true, 'csv') === 'vermoegensuebersicht-2026-07-29.csv',
  dateiname('2026-07-29', true, 'csv')
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
