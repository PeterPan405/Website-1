/**
 * Die gezählten Zahlen – und der Wächter, der an ihnen hängt.
 *
 * ## Was hier wirklich schiefgehen kann
 *
 * Nicht die Zählung. Die liest aus denselben Funktionen wie die Seiten und
 * kann deshalb gar nicht abweichen. Schiefgehen können drei andere Dinge, und
 * alle drei bleiben unbemerkt:
 *
 * 1. **Ein Schlüssel wird umbenannt.** Der Abgleich in
 *    `data/zahlen-stand.json` hängt allein an `id`. Ein umbenannter Schlüssel
 *    meldet einmal einen Sturz auf null – und ist danach ein neuer Schlüssel,
 *    dessen alter Stand niemand mehr kennt. Der Wächter sieht danach für diese
 *    Größe nichts mehr und sagt es nicht.
 * 2. **Der Wächter schlägt nie an.** Eine Absicherung, die nie anschlägt,
 *    sieht aus wie Ruhe. Hier bekommt sie deshalb etwas vorgelegt, das sie
 *    beanstanden **muss** – und etwas, das sie durchlassen muss.
 * 3. **Eine Zahl steht auf null.** Ein leerer Bestand ist genau der Fall, für
 *    den es diese Seite gibt. Er darf nicht als „0" auf ihr landen.
 *
 * Was hier bewusst **nicht** geprüft wird: die Höhe der Zahlen. „Mindestens
 * 100 Kurse" wäre eine Grenze, die den guten Tag gerade eben trägt – und beim
 * nächsten Ausbau von Hand nachgezogen würde, bis sie nichts mehr sagt. Den
 * Rückgang findet der Wächter, nicht diese Datei.
 */

import { existsSync, readFileSync } from 'node:fs'

import { findeRueckgaenge, getWebsiteZahlen, type Zahl } from '@/lib/website-zahlen'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

const zahlen = await getWebsiteZahlen()

console.log(`${zahlen.length} gezählte Größen\n`)
for (const z of zahlen) console.log(`  ${String(z.wert).padStart(6)}  ${z.label}`)
console.log('')

/* ------------------------------------------------------------ Die Zählung */

pruefen(
  'Es wird überhaupt etwas gezählt',
  zahlen.length >= 8,
  'Ohne Material prüft der Rest nichts.'
)

for (const z of zahlen) {
  /*
    Null ist kein gültiger Wert.

    Eine Größe auf null heißt: Der Bestand dahinter ist leer. Genau der Fall,
    für den es diese Seite gibt – er gehört gemeldet und nicht angezeigt.
  */
  pruefen(
    `${z.label}: gezählt, nicht leer`,
    Number.isInteger(z.wert) && z.wert > 0,
    `wert = ${z.wert}. Eine Größe auf null heißt: der Bestand dahinter ist leer.`
  )
  pruefen(
    `${z.label}: der Hinweis sagt, was gezählt wurde`,
    z.hinweis.trim().length > 25,
    'Eine nackte Zahl ist keine Auskunft. „102 Lernstufen" heißt nichts,\n' +
      '     solange nicht dabeisteht, dass das einzelne Seiten sind.'
  )
}

pruefen(
  'Jeder Schlüssel kommt nur einmal vor',
  new Set(zahlen.map((z) => z.id)).size === zahlen.length,
  'Zwei gleiche Schlüssel überschreiben sich im Stand – der zweite Wert\n' +
    '     gewinnt, und der erste wird nie wieder verglichen.'
)

/* ------------------------------------------- Die Schlüssel bleiben stehen */

/*
  Der Abgleich hängt allein an `id`.

  Ein umbenannter Schlüssel meldet einmal einen Sturz auf null, sieht also aus
  wie ein Datenausfall – und danach ist er ein neuer Schlüssel ohne Vorgeschichte.
  Diese Prüfung fängt die Umbenennung im Pull Request, statt sie am nächsten
  Morgen als Fehlalarm auftauchen zu lassen.
*/
const STAND = 'data/zahlen-stand.json'
if (!existsSync(STAND)) {
  console.log(`\nHINW ${STAND} fehlt – Erstlauf. Anlegen mit ANWENDEN=1 npm run zahlen.`)
} else {
  const stand = JSON.parse(readFileSync(STAND, 'utf8')) as Record<string, number>
  const bekannt = new Set(zahlen.map((z) => z.id))
  console.log('')
  for (const id of Object.keys(stand)) {
    pruefen(
      `Der festgehaltene Schlüssel „${id}" wird noch gezählt`,
      bekannt.has(id),
      'Umbenannt oder entfernt? Ein verschwundener Schlüssel meldet sich als\n' +
        `     Sturz auf null. Gewollt: ${STAND} anpassen (ANWENDEN=1 npm run zahlen).`
    )
  }
}

/* --------------------------------------------------------- Der Wächter */

/*
  Ihm wird vorgelegt, was er beanstanden muss – und was er durchlassen muss.

  Ein Wächter, der nie anschlägt, sieht aus wie Ruhe; einer, der bei jedem Lauf
  etwas sagt, wird überlesen. Beide Hälften stehen hier.
*/
console.log('')

const probe: Zahl[] = [
  { id: 'a', label: 'Alpha', wert: 100, hinweis: '' },
  { id: 'b', label: 'Beta', wert: 50, hinweis: '' },
]

pruefen(
  'Wächter: ein Rückgang wird gemeldet',
  (() => {
    const r = findeRueckgaenge(probe, { a: 140, b: 50 })
    return r.length === 1 && r[0].id === 'a' && r[0].vorher === 140 && r[0].jetzt === 100
  })(),
  'Der einzige Fall, für den es den Wächter gibt.'
)

pruefen(
  'Wächter: ein Zuwachs wird nicht gemeldet',
  findeRueckgaenge(probe, { a: 90, b: 40 }).length === 0,
  'Der Normalfall. Eine Meldung bei jedem Lauf wird überlesen.'
)

pruefen(
  'Wächter: gleiche Zahlen sind kein Rückgang',
  findeRueckgaenge(probe, { a: 100, b: 50 }).length === 0,
  'Sonst meldet jeder Lauf ohne Änderung.'
)

pruefen(
  'Wächter: ein verschwundener Schlüssel ist ein Sturz auf null',
  (() => {
    const r = findeRueckgaenge(probe, { a: 100, b: 50, c: 7 })
    return r.length === 1 && r[0].id === 'c' && r[0].jetzt === 0
  })(),
  'Ein Bestand, den niemand mehr zählt, ist der Fall, den von Hand keiner bemerkt.'
)

pruefen(
  'Wächter: ein neuer Schlüssel ist kein Rückgang',
  findeRueckgaenge(probe, { a: 100 }).length === 0,
  'Er stand vorher nirgends – eine Meldung dazu wäre falsch.'
)

/* ------------------------------------------------------- Die Ziele gehen irgendwohin */

/*
  Gegen das gebaute Paket, wo vorhanden – wie im Änderungsprotokoll.

  Eine Liste erlaubter Adressen hier wäre dieselbe Annahme ein zweites Mal und
  ginge beim nächsten Umbenennen auseinander.
*/
console.log('')
if (!existsSync('out/index.html')) {
  console.log('HINW out/ fehlt – die Verweisprüfung braucht `npm run build`.')
} else {
  for (const z of zahlen) {
    if (!z.ziel) continue
    const pfad = `out${z.ziel.replace(/\/$/, '')}/index.html`
    pruefen(
      `Verweis ${z.label} → ${z.ziel} existiert`,
      existsSync(pfad),
      `${pfad} gibt es nicht.`
    )
  }
}

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
