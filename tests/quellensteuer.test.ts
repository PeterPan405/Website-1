/**
 * Prüfungen für die Quellensteuerrechnung.
 *
 * Der Fehler, gegen den das schützt, ist beim Schreiben tatsächlich passiert:
 * Deutschland stand mit 25 Prozent in der Ländertabelle, und damit wurde die
 * deutsche Steuer zweimal abgezogen – ein deutscher Titel kam auf 63,63 Euro
 * je hundert statt auf 73,63. Für sich genommen sah die Zahl plausibel aus.
 * Aufgefallen ist es erst, als der Test sie gegen eine niederländische Aktie
 * hielt.
 *
 * Geprüft wird gegen die Sätze in `data/quellensteuer.ts`; dieses Modul liest
 * sie über einen Alias und ist deshalb hier nachgebildet. Was geprüft wird,
 * ist die Rechnung, nicht die Tabelle.
 */

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

const ABGELTUNGSTEUER = 25
const SOLI = 5.5
const HOECHSTSATZ = 15

function rechne(satz: number, dba: number) {
  const anrechenbar = Math.min(dba, HOECHSTSATZ)
  const deutschVoll = ABGELTUNGSTEUER * (1 + SOLI / 100)
  const deutschNach = Math.max(0, deutschVoll - anrechenbar)
  return {
    anrechenbar,
    rueckforderbar: Math.max(0, satz - dba),
    netto: 100 - satz - deutschNach,
    nettoMitAntrag: 100 - dba - deutschNach,
  }
}

console.log('\n— Der Regelfall: 15 Prozent —')

/*
  Bei einem Land mit fünfzehn Prozent geht die Anrechnung glatt auf: Die
  Belastung ist dieselbe wie bei einer deutschen Aktie. Das ist die Aussage,
  auf die es ankommt – und der Test, der sie festhält.
*/
const niederlande = rechne(15, 15)
/*
  Deutschland gehört mit null in die Tabelle: Gemeint ist die **ausländische**
  Quellensteuer, und die gibt es bei einem deutschen Unternehmen nicht. Die 25
  Prozent der Bank sind die deutsche Abgeltungsteuer, und die steckt in der
  Rechnung ohnehin schon.
*/
const deutschland = rechne(0, 0)
pruefe(
  'ein Land mit 15 Prozent kostet so viel wie eine deutsche Aktie',
  Math.abs(niederlande.netto - deutschland.netto) < 1e-9,
  `${niederlande.netto} gegen ${deutschland.netto}`
)
pruefe(
  'mit 25 Prozent in der Tabelle waere die deutsche Steuer doppelt abgezogen',
  Math.abs(rechne(25, 25).netto - deutschland.netto + 10) < 1e-9,
  `${rechne(25, 25).netto} statt ${deutschland.netto}`
)
pruefe('und es bleibt nichts zurueckzufordern', niederlande.rueckforderbar === 0)
pruefe(
  'von hundert Euro bleiben 73,63',
  Math.abs(niederlande.netto - 73.625) < 1e-9,
  String(niederlande.netto)
)

console.log('\n— Die Schweiz: der teure Fall —')

const schweiz = rechne(35, 15)
pruefe('35 einbehalten, 15 anrechenbar', schweiz.anrechenbar === 15)
pruefe('20 Prozentpunkte bleiben offen', schweiz.rueckforderbar === 20)
pruefe(
  'ohne Antrag bleiben 20 Euro weniger als beim Regelfall',
  Math.abs(niederlande.netto - schweiz.netto - 20) < 1e-9,
  `${niederlande.netto} gegen ${schweiz.netto}`
)
pruefe(
  'mit erfolgreichem Antrag ist es wieder der Regelfall',
  Math.abs(schweiz.nettoMitAntrag - niederlande.netto) < 1e-9
)

console.log('\n— Was die Anrechnung ausgleicht und was nicht —')

/*
  Der Punkt, um den es auf der Seite geht: Bis fünfzehn Prozent Einbehalt
  aendert sich am Ergebnis nichts – die Anrechnung gleicht ihn exakt aus. Erst
  darueber kostet jeder Prozentpunkt einen Euro je hundert.
*/
for (const satz of [0, 5, 10, 15]) {
  pruefe(
    `bei ${satz} Prozent Einbehalt bleibt dasselbe uebrig`,
    Math.abs(rechne(satz, satz).netto - niederlande.netto) < 1e-9,
    String(rechne(satz, satz).netto)
  )
}

const usa = rechne(30, 15)
pruefe(
  'oberhalb von 15 kostet jeder Prozentpunkt einen Euro je hundert',
  Math.abs(niederlande.netto - usa.netto - (30 - 15)) < 1e-9,
  `${niederlande.netto} gegen ${usa.netto}`
)

console.log('\n— Laender ohne Quellensteuer —')

const grossbritannien = rechne(0, 0)
pruefe(
  'ohne Einbehalt bleibt die volle deutsche Steuer',
  Math.abs(grossbritannien.netto - (100 - ABGELTUNGSTEUER * (1 + SOLI / 100))) < 1e-9,
  String(grossbritannien.netto)
)
pruefe(
  'und es ist dasselbe wie beim 15-Prozent-Land',
  Math.abs(grossbritannien.netto - niederlande.netto) < 1e-9,
  `${grossbritannien.netto} gegen ${niederlande.netto}`
)

console.log('\n— Die Anrechnungsgrenze —')

/*
  Ein Abkommenssatz ueber fuenfzehn Prozent wird nur bis fuenfzehn angerechnet.
  Deutschland selbst ist der Fall: 25 Prozent, davon 15 anrechenbar.
*/
pruefe('mehr als 15 Punkte werden nicht angerechnet', rechne(25, 25).anrechenbar === 15)
pruefe('weniger als 15 Punkte voll', rechne(10, 10).anrechenbar === 10)
pruefe(
  'ein Land mit 10 Prozent kostet dasselbe wie eines mit 15',
  Math.abs(rechne(10, 10).netto - niederlande.netto) < 1e-9,
  `${rechne(10, 10).netto} gegen ${niederlande.netto}`
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
