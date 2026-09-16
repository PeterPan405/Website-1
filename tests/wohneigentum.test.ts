/**
 * Die Auswertung der Eurostat-Antwort – an der echten Antwort.
 *
 * Ausführen mit `npm test`.
 *
 * ## Warum hier eine Datei mit fremden Zahlen liegt
 *
 * `tests/fixtures/eurostat-ilc_lvho02-2025.json` ist die Antwort, die ein
 * GitHub-Läufer am 16. September 2026 von Eurostat geholt hat – gekürzt auf
 * die Teile, die `wohneigentumAusJsonStat()` liest, sonst unverändert.
 *
 * Sie liegt hier, weil diese Umgebung ausser GitHub nichts erreicht. Eine
 * Auswertung, die sich nur über das Netz prüfen liesse, wäre in der einzigen
 * Umgebung, in der geschrieben wird, gar nicht prüfbar – und dann bliebe
 * „müsste jetzt gehen", was `AGENTS.md` ausdrücklich nicht als Aussage gelten
 * lässt.
 *
 * ## Was geprüft wird
 *
 * Die erwarteten Zahlen unten sind **nicht ausgedacht**: Sie stehen so im
 * Protokoll des Abrufs. Deutschland 47,2 Prozent, Rumänien 93,2 – beides
 * passt zu dem, was Eurostat veröffentlicht, und beides ist genau der Fall,
 * an dem sich zeigt, dass eine hohe Quote kein Wohlstandszeichen ist.
 *
 * Dazu die Fälle, in denen die Auswertung **nichts** liefern muss. Der
 * wichtigste ist der zweite: Kommt eine Dimension mit mehreren Ausprägungen
 * zurück, stünde ohne die Prüfung bei jedem Land irgendein Wert – plausibel
 * aussehend, mit Nachkommastelle, und falsch.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { EUROSTAT_ISO, wohneigentumAusJsonStat, type JsonStat } from '@/lib/wohneigentum'

let failed = 0
function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

const ECHT = JSON.parse(
  readFileSync(
    join(import.meta.dirname, 'fixtures', 'eurostat-ilc_lvho02-2025.json'),
    'utf8'
  )
) as JsonStat

/* ------------------------------------------------- Die echte Antwort */

const { werte, beanstandung } = wohneigentumAusJsonStat(ECHT)

pruefen(
  'die echte Antwort wird ohne Beanstandung gelesen',
  beanstandung === null,
  String(beanstandung)
)
pruefen(
  `es kommen Länder heraus (${werte.size})`,
  werte.size >= 25,
  `${werte.size} Länder`
)

/*
  Die Stichproben. Drei Länder, die zusammen die Spannweite abdecken – und
  zeigen, dass die Zuordnung Land → Zelle stimmt. Läse die Rechnung um eine
  Position verschoben, stünde bei Deutschland der Wert Dänemarks.
*/
const ERWARTET: [string, number][] = [
  ['DE', 47.2],
  ['RO', 93.2],
  ['AT', 54.2],
  ['ES', 73.6],
  ['NO', 80.0],
]
for (const [code, soll] of ERWARTET) {
  const ist = werte.get(code)
  pruefen(
    `${code} steht bei ${soll} Prozent`,
    ist?.wert === soll,
    `erhalten ${ist?.wert ?? '(nichts)'}`
  )
}

pruefen(
  'alle Werte tragen dasselbe Jahr',
  new Set([...werte.values()].map((w) => w.jahr)).size === 1
)
pruefen('und das Jahr ist 2025', [...werte.values()][0]?.jahr === 2025)

/*
  Griechenland ist der Grund für `EUROSTAT_ISO`. Eurostat schreibt „EL", der
  Rest des Projekts „GR". Ohne die Umschlüsselung fiele das Land aus der
  Karte – und ein fehlendes Land sieht aus wie ein Land ohne Daten.
*/
pruefen(
  'Griechenland steht unter GR, nicht unter EL',
  werte.has('GR') && !werte.has('EL')
)
pruefen(
  'die Umschlüsselung kennt beide Sonderfälle',
  EUROSTAT_ISO.EL === 'GR' && EUROSTAT_ISO.UK === 'GB'
)

/* Aggregate sind keine Länder und dürfen nicht auf der Karte landen. */
for (const aggregat of ['EU27_2020', 'EA20', 'EA21']) {
  pruefen(`das Aggregat ${aggregat} fällt heraus`, !werte.has(aggregat))
}

/* Jede Quote liegt zwischen 0 und 100. */
pruefen(
  'keine Quote liegt ausserhalb von 0 bis 100',
  [...werte.values()].every((w) => w.wert >= 0 && w.wert <= 100)
)

/* ------------------------------------------ Was beanstandet werden muss */

/*
  Die Gegenprobe, und sie ist hier die wichtigere Hälfte: Eine Auswertung, die
  aus jeder Antwort irgendetwas macht, ist schlimmer als keine.
*/
pruefen(
  'eine leere Antwort wird beanstandet',
  wohneigentumAusJsonStat({}).beanstandung !== null
)

/*
  Der Fall, gegen den die Prüfung auf `size` gebaut ist: Eurostat liefert
  `tenure` ungefiltert mit sieben Ausprägungen. Ohne die Prüfung läse die
  Rechnung die falschen Zellen und schriebe plausible Zahlen an die falschen
  Länder – der stille Fehler.
*/
const MEHRDEUTIG: JsonStat = {
  ...ECHT,
  id: ECHT.id,
  size: (ECHT.size ?? []).map((n, i) => (ECHT.id?.[i] === 'tenure' ? 7 : n)),
}
const mehrdeutig = wohneigentumAusJsonStat(MEHRDEUTIG)
pruefen(
  'eine ungefilterte Dimension wird beanstandet',
  mehrdeutig.beanstandung !== null && mehrdeutig.werte.size === 0,
  String(mehrdeutig.beanstandung)
)
pruefen(
  '… und die Meldung nennt die Dimension',
  mehrdeutig.beanstandung?.includes('tenure') === true,
  String(mehrdeutig.beanstandung)
)

/* Eine Antwort ohne Werte ist ein Befund, kein leeres Ergebnis. */
pruefen(
  'eine Antwort ohne brauchbare Zahl wird beanstandet',
  wohneigentumAusJsonStat({ ...ECHT, value: {} }).beanstandung !== null
)

/* Und ein Wert ausserhalb der Skala fliegt raus statt eingefärbt zu werden. */
const UNSINN = wohneigentumAusJsonStat({
  ...ECHT,
  value: Object.fromEntries(Object.keys(ECHT.value ?? {}).map((k) => [k, 8000])),
})
pruefen(
  'Quoten ausserhalb 0 bis 100 werden verworfen',
  UNSINN.werte.size === 0 && UNSINN.beanstandung !== null
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
