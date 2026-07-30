/**
 * Was von den geführten Aktien belegt ist – und was nicht.
 *
 * ## Warum als Skript und nicht als Notiz
 *
 * Weil eine Notiz veraltet und niemandem etwas sagt, wenn sie es tut. Die
 * Abdeckung ändert sich mit jedem Abruf und mit jeder Aktie, die dazukommt;
 * eine Zahl im Fließtext ist deshalb spätestens nach einer Woche falsch, ohne
 * dass es auffiele.
 *
 * Dieses Skript rechnet sie aus, jederzeit, aus denselben Dateien, die auch die
 * Website liest. Es verändert nichts und ruft nichts ab.
 *
 * ## Wozu die Länderaufschlüsselung
 *
 * Weil sie die einzige Aufstellung ist, aus der sich ablesen lässt, wo Arbeit
 * lohnt. „534 Aktien ohne Kennzahlen“ ist eine Zahl zum Achselzucken; „86 davon
 * sind deutsch, und für die gibt es mit ESEF eine offene Quelle, die dieses
 * Projekt schon benutzt“ ist eine Aufgabe.
 *
 * Aufruf: `npm run abdeckung`
 */

import { laendernamen } from '../data/laender/namen.ts'
import { marketDefinitions } from '../data/markets.ts'

import { readFileSync } from 'node:fs'

/** Ein Bestand, so weit er hier gebraucht wird. */
function lade(pfad: string): Record<string, unknown> {
  try {
    return JSON.parse(readFileSync(pfad, 'utf8')) as Record<string, unknown>
  } catch {
    return {}
  }
}

/**
 * Welche offene Quelle für ein Sitzland in Frage kommt.
 *
 * Steht hier nur, wo es belegt ist: entweder weil das Projekt die Quelle
 * bereits nutzt, oder weil eine Sonde sie geprüft hat. Ein „vielleicht gibt es
 * da was“ gehört nicht in eine Tabelle, die als Arbeitsliste dient.
 */
const QUELLENLAGE: Record<string, string> = {
  '276': 'ESEF – Zuordnung fehlt noch',
  '250': 'ESEF – teilweise zugeordnet',
  '826': 'ESEF – teilweise zugeordnet',
  '528': 'ESEF – teilweise zugeordnet',
  '724': 'ESEF – teilweise zugeordnet',
  '752': 'ESEF – teilweise zugeordnet',
  '380': 'ESEF – teilweise zugeordnet',
  '392': 'EDINET – Schlüssel nötig, Abschluss steckt im ZIP',
  '410': 'DART – Schlüssel nötig, Skript steht',
  '158': 'Börse Taipeh – teilweise abgerufen',
  '756': 'keine offene Quelle (nicht EU, keine US-Notierung)',
  '356': 'keine geprüfte offene Quelle',
  '156': 'keine geprüfte offene Quelle',
}

function abschnitt(titel: string) {
  console.log(`\n${titel}\n${'─'.repeat(titel.length)}`)
}

function anteil(teil: number, ganz: number): string {
  return `${teil} von ${ganz} (${((teil / ganz) * 100).toFixed(0)} %)`
}

const aktien = marketDefinitions.filter((eintrag) => eintrag.kind === 'stock')

const fundamental = lade('data/snapshots/fundamentaldaten.json')
const dividenden = lade('data/snapshots/dividenden.json')
const quartale = lade('data/snapshots/quartalstermine.json')

const mitZahlen = new Set(
  Object.keys((fundamental.unternehmen as Record<string, unknown>) ?? {})
)
const mitDividenden = new Set(
  Object.keys((dividenden.titel as Record<string, unknown>) ?? {})
)
const heute = new Date().toISOString().slice(0, 10)
const mitTermin = new Set(
  Object.entries(
    (quartale.unternehmen as Record<string, { vorhersagen?: { erwartet: string }[] }>) ??
      {}
  )
    .filter(([, eintrag]) =>
      (eintrag.vorhersagen ?? []).some((vorhersage) => vorhersage.erwartet >= heute)
    )
    .map(([kuerzel]) => kuerzel)
)

abschnitt(`Abdeckung über ${aktien.length} Aktien`)
console.log(
  `Kursverlauf         ${anteil(aktien.length, aktien.length)} – jede Aktie, sonst stünde sie nicht im Katalog`
)
console.log(
  `Dividendenhistorie  ${anteil(aktien.filter((a) => mitDividenden.has(a.symbol)).length, aktien.length)}`
)
console.log(
  `Unternehmenszahlen  ${anteil(aktien.filter((a) => mitZahlen.has(a.ticker)).length, aktien.length)}`
)
console.log(
  `Quartalstermine     ${anteil(aktien.filter((a) => mitTermin.has(a.ticker)).length, aktien.length)}`
)

/*
  Die Aufschlüsselung nur für die Kennzahlen. Bei den Dividenden liegt die
  Abdeckung bei knapp neunzig Prozent und die Lücke ist verstreut; bei den
  Quartalsterminen ist die Ursache bekannt und steht in EINRICHTUNG.md. Die
  Kennzahlen sind der Fall, bei dem die Länderverteilung die Arbeit ordnet.
*/
abschnitt('Fehlende Unternehmenszahlen nach Sitzland')

const offen = aktien.filter((a) => !mitZahlen.has(a.ticker))
const nachLand = new Map<string, string[]>()
for (const aktie of offen) {
  const land = aktie.sitzland ?? '—'
  const liste = nachLand.get(land)
  if (liste) liste.push(aktie.ticker)
  else nachLand.set(land, [aktie.ticker])
}

const sortiert = [...nachLand.entries()].sort((a, b) => b[1].length - a[1].length)
console.log(`${offen.length} Aktien in ${sortiert.length} Ländern.\n`)
console.log(`${'Anzahl'.padStart(6)}  ${'Sitzland'.padEnd(24)}  Quellenlage`)
for (const [land, liste] of sortiert) {
  if (liste.length < 5) continue
  console.log(
    `${String(liste.length).padStart(6)}  ${(laendernamen[land] ?? land).padEnd(24)}  ${
      QUELLENLAGE[land] ?? 'nicht untersucht'
    }`
  )
}
const kleine = sortiert.filter(([, liste]) => liste.length < 5)
if (kleine.length > 0) {
  console.log(
    `${String(kleine.reduce((summe, [, l]) => summe + l.length, 0)).padStart(6)}  ` +
      `${`in ${kleine.length} weiteren Ländern`.padEnd(24)}  je unter fünf Titeln`
  )
}

abschnitt('Woran es liegt')
console.log(
  'Der größte Block ist Deutschland, und das ist der ärgerlichste: Deutsche\n' +
    'Emittenten melden nach ESEF wie alle anderen an einem geregelten EU-Markt.\n' +
    'Das Abrufskript nutzt ESEF bereits – aber seine Zuordnungsliste enthält 26\n' +
    'französische und 13 britische Titel und keinen einzigen deutschen.\n\n' +
    'Die Liste ist von Hand geführt, und das aus gutem Grund: Ein Namenstreffer\n' +
    'ist keine Zuordnung. Nestlé traf einmal die US-Finanzierungstochter mit 31\n' +
    'Milliarden Umsatz statt der Gruppe mit 91. Was fehlt, ist also nicht die\n' +
    'Quelle, sondern die geprüfte Zeile je Unternehmen.\n\n' +
    'Die Kandidaten dafür liefert `scripts/quellen-probe-esef.ts` über den\n' +
    'Workflow „Quellen abklopfen“ – aus der Entwicklungsumgebung ist\n' +
    'filings.xbrl.org nicht erreichbar.'
)
console.log()
