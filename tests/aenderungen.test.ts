/**
 * Das Änderungsprotokoll ist für Leser geschrieben – und vollständig.
 *
 * ## Was hier wirklich schiefgehen kann
 *
 * Nicht die Datenstruktur. Sondern zwei Dinge, die beide unbemerkt bleiben:
 *
 * 1. **Ein Eintrag rutscht in Entwicklersprache.** Die Vorlage dafür liegt
 *    daneben: Der Vorschlagslauf zeigt Commit-Titel, und die abzuschreiben ist
 *    der bequemste Weg. „Refactoring", „useMemo", „lib/theme.ts" sagen einem
 *    Besucher nichts.
 * 2. **Ein Verweis zeigt ins Leere.** Eine Seite über Änderungen, die auf eine
 *    Adresse verlinkt, die es nicht gibt, ist die schlechteste Werbung für
 *    Sorgfalt, die sich denken lässt.
 *
 * Beides prüft diese Datei. Die Verweise gegen das **gebaute Paket**, wo
 * vorhanden – gegen eine Liste erlaubter Adressen zu prüfen hieße, dieselbe
 * Annahme zweimal aufzuschreiben.
 */

import { existsSync } from 'node:fs'

import { AENDERUNGEN } from '@/data/aenderungen'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

console.log(`${AENDERUNGEN.length} Einträge\n`)

pruefen(
  'Es gibt Einträge',
  AENDERUNGEN.length >= 3,
  'Ohne Material prüft der Rest nichts.'
)

/* -------------------------------------------------- Form und Reihenfolge */

for (const [i, e] of AENDERUNGEN.entries()) {
  pruefen(
    `[${i}] „${e.titel.slice(0, 40)}…": Datum ist ein Tag`,
    /^\d{4}-\d{2}-\d{2}$/.test(e.datum) && !Number.isNaN(Date.parse(e.datum)),
    `datum = „${e.datum}"`
  )
  pruefen(
    `[${i}] Titel und Text sind ausgefüllt`,
    e.titel.trim().length > 10 && e.text.trim().length > 40,
    'Ein Eintrag ohne Erklärung ist eine Überschrift, keine Auskunft.'
  )
}

/*
  Neueste zuerst.

  Die Datei sortiert nicht – zwei Änderungen am selben Tag haben eine
  Rangfolge, die kein Zeitstempel kennt. Umso wichtiger, dass die Tage stimmen:
  Ein Eintrag an der falschen Stelle sieht auf der Seite aus wie ein Fehler im
  Datum.
*/
pruefen(
  'Die Einträge stehen absteigend nach Datum',
  AENDERUNGEN.every((e, i) => i === 0 || AENDERUNGEN[i - 1].datum >= e.datum),
  AENDERUNGEN.map((e) => e.datum).join(' → ')
)

/* ------------------------------------------------------- Lesersprache */

/*
  Wörter, die verraten, dass ein Commit-Titel abgeschrieben wurde.

  Bewusst eng gehalten: Ein Filter, der bei jedem zweiten Eintrag anschlägt,
  wird abgeschaltet. Hier stehen nur Begriffe, die auf einer Seite für
  Besucher schlicht nichts zu suchen haben.
*/
const ENTWICKLERSPRACHE =
  /\b(refactor\w*|commit|merge|pull request|useMemo|useEffect|lint\w*|TypeScript|Regex|API|Repository|Workflow|Cron|null|undefined)\b|\b\w+\.tsx?\b|`[^`]+`/i

for (const e of AENDERUNGEN) {
  const text = `${e.titel} ${e.text}`
  const treffer = text.match(ENTWICKLERSPRACHE)
  pruefen(
    `„${e.titel.slice(0, 45)}…" spricht die Sprache des Lesers`,
    treffer === null,
    `„${treffer?.[0]}" steht in einem Eintrag. Was heißt das für jemanden, der\n` +
      '     nur die Website benutzt? Wenn sich das nicht in einem Satz sagen lässt,\n' +
      '     gehört die Änderung gar nicht ins Protokoll.'
  )
}

/*
  Die Gegenprobe: Der Filter muss überhaupt etwas finden können.

  Ein regulärer Ausdruck, der versehentlich nie passt, ließe jeden Eintrag
  durch – und diese Prüfung stünde auf Grün, ohne je etwas gesehen zu haben.
*/
pruefen(
  'Der Sprachfilter erkennt einen Commit-Titel als solchen',
  ENTWICKLERSPRACHE.test('Fehlersuche: elf Warnungen im lint aufgelöst, lib/theme.ts'),
  'Der Ausdruck passt auf nichts – die Prüfungen darüber sind wertlos.'
)

/* ----------------------------------------------------- Ziele gehen irgendwohin */

/*
  Geprüft wird gegen das gebaute Paket, wenn es da ist.

  Eine Liste erlaubter Adressen hier wäre dieselbe Annahme ein zweites Mal –
  und ginge beim nächsten Umbenennen auseinander. Ohne `out/` wird die Prüfung
  übersprungen und sagt das; sie im Stillen ausfallen zu lassen wäre der
  schlechtere Weg.
*/
const gebaut = existsSync('out/index.html')
if (!gebaut) {
  console.log('HINW out/ fehlt – die Verweisprüfung braucht `npm run build`.')
} else {
  for (const e of AENDERUNGEN) {
    if (!e.ziel) continue
    const pfad = `out${e.ziel.href.replace(/\/$/, '')}/index.html`
    pruefen(
      `Verweis „${e.ziel.text}" → ${e.ziel.href} existiert`,
      existsSync(pfad),
      `${pfad} gibt es nicht.`
    )
  }
}

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
