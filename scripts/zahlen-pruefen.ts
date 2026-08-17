/**
 * Zählt die Website und vergleicht mit dem letzten festgehaltenen Stand.
 *
 * Aufruf:  npm run zahlen                          – zählen und vergleichen
 *          ANWENDEN=1 npm run zahlen               – den Stand fortschreiben
 *          ANWENDEN=1 TROTZDEM=1 npm run zahlen    – auch über einen Rückgang hinweg
 *
 * ## Was diese Prüfung findet, das keine andere findet
 *
 * Den stillen Datenausfall. Diese Zahlen fallen nicht von selbst: Ein Artikel
 * verschwindet nicht, ein Instrument wird nicht weniger, eine Podcastfolge
 * löscht sich nicht.
 *
 * Wenn eine trotzdem fällt, hat sich ein Bestand geleert – ein Abruf hat eine
 * Datei überschrieben, ein Import kam leer zurück, ein Verzeichnis ist beim
 * Umbau liegengeblieben. Die Seite baut trotzdem, alle Prüfungen sind grün, es
 * steht nur weniger da. Genau der Fehler, der teuer ist, weil ihn niemand
 * bemerkt.
 *
 * ## Warum ein Rückgang eine Meldung ist und kein Absturz
 *
 * Weil es legitime Rückgänge gibt: Ein Instrument ohne Quelle fliegt raus,
 * eine Lektion wird zusammengelegt. Eine Prüfung, die dabei rot wird, schaltet
 * jemand ab – und dann fängt sie auch den echten Fall nicht mehr.
 *
 * Sie meldet mit `::warning::`, nennt Zahl und Differenz und sagt, wie der
 * Stand fortgeschrieben wird. Wer den Rückgang gewollt hat, schreibt fort;
 * wer ihn nicht gewollt hat, hat seinen Befund.
 *
 * ## Warum ein Rückgang das Fortschreiben anhält
 *
 * Weil der Lauf sonst seinen eigenen Alarm verschluckt. Er läuft täglich und
 * schreibt den Stand fort; fiele eine Zahl, würde der gefallene Wert derselben
 * Nacht zum neuen Maßstab – die Warnung stünde einmal in einem Protokoll, das
 * niemand liest, und am nächsten Morgen wäre alles wieder ruhig. Genau der
 * stille Fehler, gegen den dieser Lauf gebaut ist.
 *
 * Deshalb: **Ein Rückgang hält das Fortschreiben an.** Der Stand bleibt auf
 * dem höheren Wert stehen, und die Warnung wiederholt sich bei jedem Lauf, bis
 * jemand entscheidet. Wer den Rückgang gewollt hat, sagt das mit `TROTZDEM=1`
 * – von Hand, nicht in einem Workflow.
 */

import { readFileSync, writeFileSync } from 'node:fs'

import { findeRueckgaenge, getWebsiteZahlen } from '../lib/website-zahlen.ts'

const STAND = 'data/zahlen-stand.json'
const ANWENDEN = process.env.ANWENDEN === '1'
const TROTZDEM = process.env.TROTZDEM === '1'

const zahlen = await getWebsiteZahlen()

let stand: Record<string, number> = {}
try {
  stand = JSON.parse(readFileSync(STAND, 'utf8')) as Record<string, number>
} catch {
  console.log(`[zahlen] ${STAND} gibt es noch nicht – der erste Lauf legt ihn an.`)
}

for (const zahl of zahlen) {
  const vorher = stand[zahl.id]
  const pfeil = vorher === undefined ? 'neu' : `${vorher} → ${zahl.wert}`
  console.log(`  ${String(zahl.wert).padStart(6)}  ${zahl.label.padEnd(32)} ${pfeil}`)
}

const rueckgaenge = findeRueckgaenge(zahlen, stand)

if (rueckgaenge.length > 0) {
  console.log('')
  for (const r of rueckgaenge) {
    console.log(
      `::warning::[zahlen] ${r.label}: ${r.vorher} → ${r.jetzt} ` +
        `(${r.jetzt - r.vorher}). Diese Zahl fällt nicht von selbst.`
    )
  }
  console.log(
    '\n           Gewollt? Dann ANWENDEN=1 TROTZDEM=1 npm run zahlen.\n' +
      '           Nicht gewollt? Dann fehlt ein Bestand.'
  )
}

if (!ANWENDEN) {
  console.log(`\n[zahlen] Nichts geschrieben. Fortschreiben mit ANWENDEN=1.`)
  process.exit(0)
}

/*
  Ein Rückgang hält das Fortschreiben an – sonst verschluckt der Lauf seinen
  eigenen Alarm. Ausführlich begründet oben im Kopf dieser Datei.
*/
if (rueckgaenge.length > 0 && !TROTZDEM) {
  console.log(
    `\n[zahlen] ${STAND} bleibt stehen: Ein Rückgang schreibt sich nicht selbst fort.\n` +
      '         Die Warnung wiederholt sich bei jedem Lauf, bis jemand entscheidet.\n' +
      '         Gewollt: ANWENDEN=1 TROTZDEM=1 npm run zahlen'
  )
  process.exit(0)
}

const neu = Object.fromEntries(zahlen.map((z) => [z.id, z.wert]))
writeFileSync(STAND, JSON.stringify(neu, null, 2) + '\n')
console.log(`\n[zahlen] ${STAND} fortgeschrieben.`)
