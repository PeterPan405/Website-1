/**
 * Prüft die Suchregeln aus `lib/search-match.ts`.
 *
 * Läuft ohne Testrahmen über `node --experimental-strip-types`, wie die
 * übrigen Tests des Projekts. Geprüft wird die Logik, nicht die Oberfläche:
 * was als Treffer gilt und in welcher Reihenfolge.
 */

import {
  normalize,
  scoreEntry,
  searchEntries,
  tokenize,
  type SearchEntry,
} from '../lib/search-match.ts'

let fehler = 0

function check(name: string, ist: unknown, soll: unknown) {
  const gleich = JSON.stringify(ist) === JSON.stringify(soll)
  console.log(`${gleich ? 'OK  ' : 'FEHL'} ${name}`)
  if (!gleich) {
    console.log(`     erwartet: ${JSON.stringify(soll)}`)
    console.log(`     erhalten: ${JSON.stringify(ist)}`)
    fehler++
  }
}

const index: SearchEntry[] = [
  { title: 'Märkte', href: '/maerkte', kind: 'Bereich', hint: 'Kurse und Indizes' },
  { title: 'Aktie', href: '/lernen/aktie', kind: 'Lernthema', keywords: ['anteil'] },
  { title: 'Aktie – Beginner', href: '/lernen/aktie/beginner', kind: 'Lernstufe' },
  {
    title: 'Zinsrechner',
    href: '/rechner/zinsrechner',
    kind: 'Rechner',
    keywords: ['zinseszins', 'sparplan'],
  },
]

// --- Normalisierung ---------------------------------------------------------

check('Umlaute werden ausgeschrieben', normalize('Märkte'), 'maerkte')
check('Eszett wird zu ss', normalize('Straße'), 'strasse')
check('Akzente fallen weg', normalize('Société'), 'societe')

// --- Zerlegung --------------------------------------------------------------

check('Eingabe wird in Wörter zerlegt', tokenize('aktie steuern'), ['aktie', 'steuern'])
check('Satzzeichen trennen ebenfalls', tokenize('EUR/USD'), ['eur', 'usd'])
check('Leere Eingabe ergibt nichts', tokenize('   '), [])

// --- Bewertung --------------------------------------------------------------

check('ohne Suchbegriff kein Treffer', scoreEntry(index[1] as SearchEntry, []), null)
check(
  'unbekanntes Wort trifft nicht',
  scoreEntry(index[1] as SearchEntry, ['anleihe']),
  null
)
check(
  'Treffer im Titel zählt',
  typeof scoreEntry(index[1] as SearchEntry, ['aktie']),
  'number'
)
check(
  'Treffer nur in den Schlagwörtern zählt auch',
  typeof scoreEntry(index[3] as SearchEntry, ['sparplan']),
  'number'
)

// Jeder Begriff muss vorkommen – zwei Begriffe schränken ein, statt zu erweitern.
check(
  'zweiter, nicht vorkommender Begriff schließt aus',
  scoreEntry(index[1] as SearchEntry, ['aktie', 'inflation']),
  null
)

// --- Reihenfolge ------------------------------------------------------------

check(
  'Titelanfang schlägt Fundstelle weiter hinten',
  searchEntries(index, 'aktie').map((e) => e.href),
  ['/lernen/aktie', '/lernen/aktie/beginner']
)

check(
  'Umlaut-Eingabe findet die Bereichsseite',
  searchEntries(index, 'maerkte').map((e) => e.href),
  ['/maerkte']
)

check(
  'Schlagwort führt auf den Rechner',
  searchEntries(index, 'zinseszins').map((e) => e.href),
  ['/rechner/zinsrechner']
)

check('leere Suche liefert nichts', searchEntries(index, ''), [])

check(
  'Begrenzung wird eingehalten',
  searchEntries(index, 'aktie', 1).map((e) => e.href),
  ['/lernen/aktie']
)

console.log()
if (fehler > 0) {
  console.log(`${fehler} Pruefung(en) fehlgeschlagen`)
  process.exit(1)
}
console.log('Alle Pruefungen bestanden')
