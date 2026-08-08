/**
 * Die inhaltliche Durchsicht: was ist fällig, und was ist hart falsch.
 *
 * ## Warum es dieses Skript zusätzlich zu `frische-pruefen.ts` gibt
 *
 * `npm run frische` prüft **Zahlen**: Stichtagswerte mit Turnus, das Alter der
 * Momentaufnahmen, gezählte Mengen im Fließtext. Das ist die eine Hälfte.
 *
 * Die andere Hälfte sind Aussagen, die kein Datum tragen und trotzdem falsch
 * werden können – und die Pflichttexte, die einfach dasein müssen. Am
 * 9. August 2026 nachgezählt: **Keine einzige der sieben Podcastfolgen** trug
 * den KI-Hinweis, den der Betreiber festgelegt hatte; sechs trugen einen
 * überholten, eine gar keinen. Gefunden hat das ein Mensch beim Nachsehen,
 * nicht die Technik.
 *
 * Dieses Skript macht daraus eine Prüfung.
 *
 * ## Zwei Arten von Befund, und der Unterschied ist wichtig
 *
 * - **Mangel** – etwas ist nachweisbar falsch oder fehlt. Der Lauf wird rot.
 * - **Fällig** – ein Bereich ist länger nicht angesehen worden. Der Lauf
 *   bleibt grün und meldet es; es ist eine Erinnerung, kein Fehler.
 *
 * Wer beides gleich behandelt, bekommt einen Lauf, der immer rot ist, und
 * damit einen, auf den niemand mehr schaut.
 *
 * Aufruf: node --experimental-strip-types scripts/inhalte-pruefen.ts
 *         STICHTAG=2026-09-01 … (für Proben)
 */

import { readFileSync } from 'node:fs'

import { inhalteTurnus } from '../data/inhalte-turnus.ts'
import { KI_HINWEIS } from '../lib/sprechfassung.ts'

const STICHTAG = process.env.STICHTAG || new Date().toISOString().slice(0, 10)

const maengel: string[] = []
const faellig: string[] = []
const notizen: string[] = []

function lies(pfad: string): string {
  try {
    return readFileSync(pfad, 'utf8')
  } catch {
    maengel.push(`${pfad} fehlt.`)
    return ''
  }
}

/** Kalendertage zwischen zwei ISO-Daten, ohne Umweg über die Zeitzone. */
function tageSeit(datum: string): number {
  const ms = Date.parse(`${STICHTAG}T00:00:00Z`) - Date.parse(`${datum}T00:00:00Z`)
  return Math.round(ms / 86_400_000)
}

console.log(`\nInhaltliche Durchsicht — Stichtag ${STICHTAG}\n${'='.repeat(46)}`)

// ---------------------------------------------------------------- Pflichttexte
console.log('\nPflichtangaben')
console.log('──────────────')

/*
  § 5 DDG verlangt für eine natürliche Person Name, Anschrift und eine schnelle
  elektronische Kontaktmöglichkeit. Geprüft wird, dass die Felder **belegt**
  sind – nicht, ob der Inhalt stimmt; das kann nur ein Mensch.
*/
const anbieter = lies('lib/provider.ts')
for (const [feld, muster] of [
  ['Name', /name:\s*'[^']{3,}'/],
  ['Straße', /street:\s*'[^']{3,}'/],
  ['Ort', /city:\s*'[^']{3,}'/],
] as const) {
  if (muster.test(anbieter)) console.log(`  ✓ Anbieter: ${feld} belegt`)
  else maengel.push(`lib/provider.ts: ${feld} ist leer oder fehlt (§ 5 DDG).`)
}

const seite = lies('lib/site.ts')
if (/contactEmail:\s*'[^']*@[^']*'/.test(seite)) {
  console.log('  ✓ Anbieter: E-Mail belegt')
} else {
  maengel.push('lib/site.ts: contactEmail fehlt oder ist keine Adresse (§ 5 DDG).')
}

for (const [was, pfad, muster] of [
  ['Haftung für Inhalte', 'app/impressum/page.tsx', /Haftung für Inhalte/],
  ['Hinweis zu Finanzinhalten', 'app/impressum/page.tsx', /keine Anlageberatung/],
  ['Datenschutzerklärung', 'app/datenschutz/page.tsx', /[Dd]atenschutz/],
] as const) {
  if (muster.test(lies(pfad))) console.log(`  ✓ ${was}`)
  else maengel.push(`${pfad}: „${was}“ nicht gefunden.`)
}

// ------------------------------------------------------------- KI-Hinweise
console.log('\nKI-Hinweis auf den Podcastfolgen')
console.log('────────────────────────────────')

/*
  Der Wortlaut kommt aus `lib/sprechfassung.ts` – dieselbe Stelle, die ihn für
  neue Folgen setzt. Stünde er hier zum zweiten Mal, würde eine Änderung dort
  diese Prüfung stillschweigend wirkungslos machen.
*/
type Folge = { datum: string; nummer: number; beschreibung: string }
const register = JSON.parse(lies('data/podcast-eigener-feed.json') || '{}')
const folgen: Folge[] = register.folgen ?? register.episodes ?? []

if (folgen.length === 0) {
  maengel.push('data/podcast-eigener-feed.json: keine Folgen gefunden.')
} else {
  const ohne = folgen.filter((f) => !f.beschreibung?.includes(KI_HINWEIS))
  if (ohne.length === 0) {
    console.log(`  ✓ alle ${folgen.length} Folgen tragen den aktuellen Hinweis`)
  } else {
    maengel.push(
      `Ohne aktuellen KI-Hinweis: ${ohne.map((f) => f.datum).join(', ')} ` +
        `(${ohne.length} von ${folgen.length}).`
    )
  }

  const ohneHaftung = folgen.filter(
    (f) => !f.beschreibung?.includes('keine Anlageberatung')
  )
  if (ohneHaftung.length === 0) {
    console.log(`  ✓ alle ${folgen.length} Folgen tragen den Haftungsausschluss`)
  } else {
    maengel.push(
      `Ohne Haftungsausschluss: ${ohneHaftung.map((f) => f.datum).join(', ')}.`
    )
  }
}

// -------------------------------------------------- Widersprüche im Bestand
console.log('\nInnere Widersprüche')
console.log('───────────────────')

/*
  Nicht jede doppelte Zahl ist ein Fehler – dieselbe Zahl an zwei Stellen mit
  **verschiedenen** Werten ist einer. Geprüft werden die Konstanten, die
  erfahrungsgemäß wandern, weil sie in mehreren Themen vorkommen.

  Gesucht wird über den **Bezeichner**, nicht über den Begriff im Fließtext.
  Der erste Entwurf tat das Zweite (`/[Ss]parerpauschbetrag[^=]*=\s*(\d+)/`)
  und lief dabei über einen Kommentar hinweg bis zur nächsten Zuweisung: Er
  meldete „1000 gegen 25“ und verglich in Wahrheit den Freibetrag mit dem
  Steuersatz. Eine Prüfung, die falschen Alarm schlägt, ist schlimmer als
  keine – nach dem zweiten Fehlalarm sieht niemand mehr hin.
*/
const steuer = lies('lib/kapitalertragsteuer.ts')
const szenarien = lies('lib/lernszenarien.ts')

/** Der Wert einer `const`-Zuweisung, Unterstriche in Zahlen erlaubt. */
function konstante(text: string, bezeichner: string): number | null {
  const muster = new RegExp(`\\b${bezeichner}\\s*=\\s*([\\d_.]+)`)
  const treffer = text.match(muster)
  return treffer ? Number(treffer[1].replace(/_/g, '')) : null
}

const paare: [string, number | null, number | null][] = [
  [
    'Sparerpauschbetrag',
    konstante(steuer, 'SPARERPAUSCHBETRAG_EINZELN'),
    konstante(szenarien, 'sparerPauschbetrag'),
  ],
  [
    'Abgeltungsteuersatz',
    // Einmal als Dezimalzahl, einmal in Prozent – deshalb der Faktor.
    (konstante(steuer, 'ABGELTUNGSTEUERSATZ') ?? 0) * 100 || null,
    konstante(szenarien, 'abgeltungsteuer'),
  ],
  [
    'Solidaritätszuschlag',
    (konstante(steuer, 'SOLIDARITAETSZUSCHLAG') ?? 0) * 100 || null,
    konstante(szenarien, 'soliAufSteuer'),
  ],
]

for (const [was, a, b] of paare) {
  if (a === null || b === null) {
    notizen.push(`${was}: nur an einer Stelle gefunden – kein Vergleich möglich.`)
  } else if (a !== b) {
    maengel.push(`${was} steht zweimal verschieden: ${a} gegen ${b}.`)
  } else {
    console.log(`  ✓ ${was} überall ${a}`)
  }
}

// ----------------------------------------------------------- Was ist fällig
console.log('\nFällige Durchsichten')
console.log('────────────────────')

for (const eintrag of [...inhalteTurnus].sort(
  (a, b) => tageSeit(b.zuletztGeprueft) - tageSeit(a.zuletztGeprueft)
)) {
  /*
    Nie negativ: Der Stichtag kommt in UTC, die Eintragung entsteht in
    deutscher Zeit. Zwischen 0 und 2 Uhr nachts ergäbe das „−1 Tage alt“ –
    richtig gerechnet, aber unlesbar.
  */
  const alter = Math.max(tageSeit(eintrag.zuletztGeprueft), 0)
  const ueber = alter - eintrag.taktTage
  const marke = ueber >= 0 ? '▶' : ' '
  console.log(
    `  ${marke} ${eintrag.id.padEnd(20)} ${String(alter).padStart(3)} Tage alt ` +
      `(Takt ${eintrag.taktTage})`
  )
  if (ueber >= 0) {
    faellig.push(
      `**${eintrag.id}** — ${alter} Tage alt, Takt ${eintrag.taktTage}.\n` +
        `  ${eintrag.auftrag}\n` +
        `  Dateien: ${eintrag.dateien.join(', ')}` +
        (eintrag.quelle ? `\n  Quelle: ${eintrag.quelle}` : '')
    )
  }
}

// -------------------------------------------------------------- Das Ergebnis
console.log(`\n${'='.repeat(46)}`)

for (const notiz of notizen) console.log(`::notice::${notiz}`)

if (faellig.length > 0) {
  console.log(`\n${faellig.length} Durchsicht(en) fällig:\n`)
  for (const eintrag of faellig) console.log(`  ${eintrag.replace(/\n/g, '\n  ')}\n`)
  console.log(
    'Nach der Durchsicht `zuletztGeprueft` in data/inhalte-turnus.ts setzen –\n' +
      'auch dann, wenn nichts zu ändern war. Sonst steht der Bereich in vier\n' +
      'Wochen wieder da und wird zweimal umsonst geprüft.'
  )
}

if (maengel.length > 0) {
  console.log(`\n${maengel.length} Mangel/Mängel:\n`)
  for (const mangel of maengel) console.log(`::error::${mangel}`)
  process.exit(1)
}

console.log('\nKeine Mängel.')
