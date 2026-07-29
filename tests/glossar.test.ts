/**
 * Prüfungen für die Begriffserkennung im Fließtext.
 *
 * Hier entscheidet sich, ob die automatische Verlinkung eine Hilfe ist oder
 * eine Zumutung. Drei Fehler wären möglich, und alle drei sind stumm:
 *
 * 1. **Zu viel.** Jedes Vorkommen verlinken, statt nur das erste – der Text
 *    wird blau und unlesbar.
 * 2. **Falsch.** „Aktienrückkauf“ auf „Aktie“ verlinken, „Optionsschein“ auf
 *    „Option“. Beides ist etwas anderes.
 * 3. **Gar nicht.** Umlaute am Wortanfang, weil die Wortgrenze in JavaScript
 *    nur ASCII kennt.
 */

import { baueIndex, zerlege, type Wortform } from '../lib/glossar-text.ts'
import { glossar } from '../data/glossar.ts'

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

/** Alle Formen eines Eintrags: der Begriff selbst und seine Schreibweisen. */
function alleFormen(): Wortform[] {
  return glossar.flatMap((eintrag) =>
    [eintrag.begriff, ...(eintrag.formen ?? [])].map((form) => ({
      form,
      slug: eintrag.slug,
    }))
  )
}

const index = baueIndex(alleFormen())

function verlinkt(text: string, ausgenommen: string[] = []): string[] {
  const teile = zerlege(text, index, new Set(), new Set(ausgenommen))
  return teile.filter((teil) => teil.slug).map((teil) => teil.slug!)
}

console.log('\n— Erkennen —')

pruefe(
  'ein einzelner Begriff wird gefunden',
  verlinkt('Ein ETF bildet einen Index nach.').includes('etf')
)
pruefe(
  'auch die Mehrzahl, wenn sie als Form hinterlegt ist',
  verlinkt('Zwei ETFs im Vergleich.').includes('etf')
)
pruefe(
  'Groß- und Kleinschreibung spielt keine Rolle',
  verlinkt('das kurs-gewinn-verhältnis').includes('kgv')
)

/*
  Der Fall, an dem eine naive Umsetzung scheitert: `\b` kennt in JavaScript nur
  ASCII. Vor einem Ü entsteht damit keine Wortgrenze, und der Begriff wird nie
  gefunden.
*/
pruefe(
  'ein Begriff mit Umlaut am Anfang wird gefunden',
  verlinkt('Die Übersicht nennt die Volatilität.').includes('volatilitaet')
)
pruefe(
  'ein Begriff am Satzanfang wird gefunden',
  verlinkt('Diversifikation kostet nichts.').includes('diversifikation')
)
pruefe(
  'ein Begriff vor einem Satzzeichen wird gefunden',
  verlinkt('Das nennt man Rebalancing.').includes('rebalancing')
)
pruefe(
  'ein Begriff in Klammern wird gefunden',
  verlinkt('Die laufenden Kosten (TER) stehen im Factsheet.').includes('ter')
)

console.log('\n— Nicht erkennen —')

pruefe(
  'kein Treffer mitten in einem längeren Wort',
  verlinkt('Der Aktienrückkauf war umstritten.').length === 0,
  verlinkt('Der Aktienrückkauf war umstritten.').join(', ')
)
pruefe(
  'kein Treffer bei angehängtem Wortteil',
  verlinkt('Die Optionsprämie stieg.').length === 0,
  verlinkt('Die Optionsprämie stieg.').join(', ')
)
pruefe(
  'kein Treffer bei vorangestelltem Wortteil',
  verlinkt('Der Rentenfonds legte zu.').length === 0,
  verlinkt('Der Rentenfonds legte zu.').join(', ')
)
pruefe(
  'ein Bindestrich links zählt als Wortzeichen',
  verlinkt('Ein Themen-Index ist etwas anderes.').length === 0,
  verlinkt('Ein Themen-Index ist etwas anderes.').join(', ')
)

/*
  Dieselbe Regel muss rechts gelten – sie tat es zunächst nicht.

  Im Paket standen zwölf Stellen, an denen die erste Hälfte einer
  Zusammensetzung verlinkt war: „Squeeze-out“ zeigte auf den Squeeze,
  „Index-ETF“ auf den Index, „Gewinn- und Verlustrechnung“ auf den Gewinn.
  Der Ergänzungsstrich ist dabei der heimtückischere Fall, weil zwischen den
  beiden Hälften ein Leerzeichen steht und die Zeile deshalb richtig aussieht.
*/
pruefe(
  'ein Bindestrich rechts zählt ebenso als Wortzeichen',
  verlinkt('Ein Index-ETF bildet ihn nach.').length === 0,
  verlinkt('Ein Index-ETF bildet ihn nach.').join(', ')
)
pruefe(
  'auch der Ergänzungsstrich mit folgendem Leerzeichen',
  verlinkt('Die Aktien- und Anleihequote steht fest.').length === 0,
  verlinkt('Die Aktien- und Anleihequote steht fest.').join(', ')
)
pruefe(
  'eine Wortform mit eigenem Bindestrich bleibt erkennbar',
  verlinkt('Das Kurs-Gewinn-Verhältnis liegt bei 15.').includes('kgv'),
  verlinkt('Das Kurs-Gewinn-Verhältnis liegt bei 15.').join(', ')
)

console.log('\n— Nur einmal —')

const einmal = zerlege(
  'Ein ETF ist ein Fonds. Der ETF kostet weniger als ein aktiver Fonds.',
  index,
  new Set()
)
const slugs = einmal.filter((teil) => teil.slug).map((teil) => teil.slug)
pruefe(
  'jeder Begriff wird höchstens einmal verlinkt',
  slugs.length === new Set(slugs).size,
  slugs.join(', ')
)
pruefe(
  'der Text bleibt beim Zusammensetzen unverändert',
  einmal.map((teil) => teil.text).join('') ===
    'Ein ETF ist ein Fonds. Der ETF kostet weniger als ein aktiver Fonds.'
)

const benutzt = new Set<string>()
zerlege('Ein ETF.', index, benutzt)
const zweiterAbsatz = zerlege('Noch ein ETF.', index, benutzt)
pruefe(
  'die Sperre gilt über mehrere Absätze hinweg',
  zweiterAbsatz.every((teil) => !teil.slug)
)

console.log('\n— Ausnahmen —')

pruefe(
  'ausgenommene Begriffe werden nicht verlinkt',
  verlinkt('Ein ETF bildet einen Index nach.', ['etf']).includes('etf') === false
)
pruefe(
  'andere Begriffe im selben Satz bleiben verlinkt',
  verlinkt('Ein ETF bildet einen Index nach.', ['etf']).includes('index')
)

console.log('\n— Die längere Form gewinnt —')

const langeForm = verlinkt('Der Durchschnittskosteneffekt ist überschätzt.')
pruefe(
  'zusammengesetzte Formen schlagen ihre Bestandteile',
  langeForm.includes('cost-average'),
  langeForm.join(', ')
)

console.log('\n— Der Bestand —')

const slugsGesamt = glossar.map((eintrag) => eintrag.slug)
pruefe(
  'jeder Slug kommt genau einmal vor',
  new Set(slugsGesamt).size === slugsGesamt.length
)
pruefe(
  'jeder Slug besteht nur aus Kleinbuchstaben, Ziffern und Bindestrich',
  slugsGesamt.every((slug) => /^[a-z0-9-]+$/.test(slug)),
  slugsGesamt.filter((slug) => !/^[a-z0-9-]+$/.test(slug)).join(', ')
)

const bekannt = new Set(slugsGesamt)
const toteVerweise = glossar.flatMap((eintrag) =>
  (eintrag.siehe ?? [])
    .filter((slug) => !bekannt.has(slug))
    .map((slug) => `${eintrag.slug} → ${slug}`)
)
pruefe(
  'kein „siehe auch“ zeigt ins Leere',
  toteVerweise.length === 0,
  toteVerweise.join(', ')
)

pruefe(
  'kein Eintrag verweist auf sich selbst',
  glossar.every((eintrag) => !(eintrag.siehe ?? []).includes(eintrag.slug))
)

/*
  Zwei Einträge mit derselben Wortform wären ein stiller Fehler: Welcher gewinnt,
  entschiede die Reihenfolge in der Datei.
*/
const formenGesamt = alleFormen().map((eintrag) => eintrag.form.toLowerCase())
const doppelt = formenGesamt.filter((form, i) => formenGesamt.indexOf(form) !== i)
pruefe(
  'keine Wortform gehört zu zwei Einträgen',
  doppelt.length === 0,
  doppelt.join(', ')
)

pruefe(
  'jede Kurzerklärung ist ein vollständiger Satz',
  glossar.every((eintrag) => eintrag.kurz.trim().endsWith('.')),
  glossar
    .filter((eintrag) => !eintrag.kurz.trim().endsWith('.'))
    .map((eintrag) => eintrag.slug)
    .join(', ')
)
pruefe(
  'keine Kurzerklärung ist länger als 200 Zeichen',
  glossar.every((eintrag) => eintrag.kurz.length <= 200),
  glossar
    .filter((eintrag) => eintrag.kurz.length > 200)
    .map((eintrag) => `${eintrag.slug} (${eintrag.kurz.length})`)
    .join(', ')
)

console.log(`\n${glossar.length} Einträge geprüft.`)
console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
