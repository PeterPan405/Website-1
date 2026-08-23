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

import { readFileSync } from 'node:fs'

import { laendernamen } from '../data/laender/namen.ts'
import { marketDefinitions } from '../data/markets.ts'
import { quellenlage } from '@/lib/abdeckung'

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
 * Kommt aus `lib/abdeckung.ts` – derselben Aufstellung, die `/quellen` zeigt.
 * Hier stand bis zum 23. August 2026 eine zweite, nach Ländernummern statt nach
 * Namen. Sie war um drei Wochen veraltet und behauptete für Deutschland eine
 * fehlende Zuordnung, wo die Quelle selbst nichts führt. Die Begründung für die
 * Doppelung – „ein Skript darf `@/` nicht benutzen“ – gilt seit
 * `scripts/alias-hook.mjs` nicht mehr.
 */
function quellenlageZu(land: string): string {
  return quellenlage[laendernamen[land] ?? land] ?? 'nicht untersucht'
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
    `${String(liste.length).padStart(6)}  ${(laendernamen[land] ?? land).padEnd(24)}  ${quellenlageZu(land)}`
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

/*
  Zusammengefasst und nicht getippt.

  Hier stand ein Absatz über Deutschland: die Zuordnungsliste enthalte keinen
  deutschen Titel, es fehle also nur „die geprüfte Zeile je Unternehmen“. Am
  31. Juli 2026 hat eine Sonde das widerlegt – im offenen ESEF-Verzeichnis
  steht kein einziger deutscher Abschluss –, und der Absatz stand drei Wochen
  später immer noch da. Ein Satz im Quelltext altert nicht sichtbar.

  Jetzt gruppiert das Skript, was in `quellenlage` steht. Es kann damit nichts
  anderes behaupten als `/quellen`, und wer eine Quellenlage berichtigt, ändert
  diesen Abschnitt mit.
*/
const nachLage = new Map<string, { name: string; anzahl: number }[]>()
for (const [land, liste] of sortiert) {
  const lage = quellenlageZu(land)
  const eintrag = { name: laendernamen[land] ?? land, anzahl: liste.length }
  const vorhanden = nachLage.get(lage)
  if (vorhanden) vorhanden.push(eintrag)
  else nachLage.set(lage, [eintrag])
}

const gruppen = [...nachLage.entries()]
  .map(([lage, laender]) => ({
    lage,
    laender,
    summe: laender.reduce((summe, l) => summe + l.anzahl, 0),
  }))
  .sort((a, b) => b.summe - a.summe)

for (const gruppe of gruppen) {
  console.log(`${String(gruppe.summe).padStart(6)}  ${gruppe.lage}`)
  console.log(
    `        ${gruppe.laender
      .slice(0, 8)
      .map((l) => `${l.name} ${l.anzahl}`)
      .join(
        ', '
      )}${gruppe.laender.length > 8 ? ` und ${gruppe.laender.length - 8} weitere` : ''}`
  )
}

console.log(
  '\nWo „teilweise zugeordnet“ steht, fehlt die geprüfte Zeile je Unternehmen –\n' +
    'ein Namenstreffer ist keine Zuordnung. Nestlé traf einmal die\n' +
    'US-Finanzierungstochter mit 31 Milliarden Umsatz statt der Gruppe mit 91.\n' +
    'Die Kandidaten liefert `scripts/quellen-probe-esef.ts` über den Workflow\n' +
    '„Quellen abklopfen“ – aus der Entwicklungsumgebung ist filings.xbrl.org\n' +
    'nicht erreichbar.\n\n' +
    'Wo „keine“ oder „Schlüssel nötig“ steht, hilft keine Zuordnung. Dort fehlt\n' +
    'eine Quelle oder ein Zugang, und das ist eine andere Aufgabe.'
)
console.log()
