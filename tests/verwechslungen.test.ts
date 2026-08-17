/**
 * Die Verwechslungspaare – prüft, ob sie wirklich vergleichen.
 *
 * ## Was hier schiefgehen kann
 *
 * Nicht die Datenstruktur. Sondern dass aus dem Vergleich zwei Erklärungen
 * nebeneinander werden:
 *
 * 1. **Die Zeilen laufen nicht parallel.** Der ganze Aufbau lebt davon, dass
 *    links und rechts **dieselbe** Frage beantworten. Steht rechts etwas zu
 *    einer anderen Frage, liest man wieder längs statt quer – und dann hätte
 *    es beim Glossar bleiben können.
 * 2. **Der Merksatz fehlt oder wiederholt die Tabelle.** Er ist das Ergebnis:
 *    die eine Zeile, an der man die beiden im Alltag auseinanderhält. Ohne ihn
 *    muss man beim nächsten Mal wieder nachschlagen.
 * 3. **Ein Verweis zeigt ins Leere.** Eine Seite über Genauigkeit, die auf
 *    einen Glossareintrag verlinkt, den es nicht gibt, ist die schlechteste
 *    Werbung dafür.
 */

import { existsSync } from 'node:fs'

import { getGlossar } from '@/lib/glossar'
import { VERWECHSLUNGEN } from '@/data/verwechslungen'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

console.log(`${VERWECHSLUNGEN.length} Paare\n`)

pruefen(
  'Es gibt Paare',
  VERWECHSLUNGEN.length >= 5,
  'Ohne Material prüft der Rest nichts.'
)

pruefen(
  'Jede Kennung kommt nur einmal vor',
  new Set(VERWECHSLUNGEN.map((p) => p.slug)).size === VERWECHSLUNGEN.length,
  'Die Kennung ist die Sprungmarke – zwei gleiche führen an dieselbe Stelle.'
)

/* --------------------------------------------------- Form und Vollständigkeit */

for (const paar of VERWECHSLUNGEN) {
  const name = `${paar.linksName} gegen ${paar.rechtsName}`

  pruefen(
    `${name}: mindestens drei Vergleichszeilen`,
    paar.zeilen.length >= 3,
    `${paar.zeilen.length} Zeilen. Unter drei ist es kein Vergleich, sondern eine Behauptung.`
  )

  /*
    Beide Seiten müssen gefüllt sein – und zwar beide.

    Eine leere rechte Spalte fällt beim Schreiben nicht auf: Die Tabelle sieht
    vollständig aus, die Zeile ist nur halb beantwortet.
  */
  const halbe = paar.zeilen.filter(
    (z) => z.links.trim().length < 10 || z.rechts.trim().length < 10
  )
  pruefen(
    `${name}: keine halb beantwortete Zeile`,
    halbe.length === 0,
    `${halbe.length} Zeile(n) mit einer leeren Seite: ${halbe.map((z) => z.was).join(', ')}`
  )

  pruefen(
    `${name}: jede Frage kommt nur einmal`,
    new Set(paar.zeilen.map((z) => z.was)).size === paar.zeilen.length,
    'Zwei gleiche Fragen sind eine doppelte Zeile – oder eine vergessene.'
  )

  /*
    Der Merksatz darf nicht die Tabelle wiederholen.

    Geprüft wird an der Länge und daran, dass er nicht wörtlich in einer Zelle
    steht. Eine strengere Prüfung gäbe es nicht, ohne Sprache zu bewerten – und
    diese fängt den Fall, um den es geht: eine Zeile kopiert statt einen Satz
    gefunden.
  */
  const zellen = paar.zeilen.flatMap((z) => [z.links, z.rechts])
  pruefen(
    `${name}: hat einen eigenen Merksatz`,
    paar.merksatz.trim().length > 60 && !zellen.includes(paar.merksatz.trim()),
    'Der Merksatz ist das Ergebnis der Gegenüberstellung, nicht ihre Zusammenfassung.'
  )

  pruefen(
    `${name}: sagt, was die Verwechslung kostet`,
    paar.warumEsZaehlt.trim().length > 60,
    'Ohne diesen Absatz ist es Begriffskunde.'
  )

  pruefen(
    `${name}: nennt beide Begriffe im Merksatz oder in „warum es zählt"`,
    [paar.merksatz, paar.warumEsZaehlt, paar.frage]
      .join(' ')
      .toLowerCase()
      .includes(paar.linksName.toLowerCase()),
    'Ein Text, der den eigenen Begriff nicht nennt, gehört zu einem anderen Paar.'
  )
}

/* ------------------------------------------------------- Die Verweise gehen irgendwohin */

console.log('')

const glossar = await getGlossar()
const bekannt = new Set(glossar.map((e) => e.slug))

for (const paar of VERWECHSLUNGEN) {
  for (const [seite, slug] of [
    ['links', paar.glossar?.links],
    ['rechts', paar.glossar?.rechts],
  ] as const) {
    if (!slug) continue
    pruefen(
      `${paar.slug}: Glossareintrag „${slug}" (${seite}) gibt es`,
      bekannt.has(slug),
      'Der Verweis führt auf eine Sprungmarke, die es auf /glossar nicht gibt.'
    )
  }
}

/*
  Die Seitenverweise gegen das gebaute Paket – wie im Änderungsprotokoll.

  Eine Liste erlaubter Adressen wäre dieselbe Annahme ein zweites Mal und ginge
  beim nächsten Umbenennen auseinander.
*/
if (!existsSync('out/index.html')) {
  console.log('HINW out/ fehlt – die Verweisprüfung braucht `npm run build`.')
} else {
  for (const paar of VERWECHSLUNGEN) {
    if (!paar.zuSehen) continue
    const pfad = `out${paar.zuSehen.href.replace(/\/$/, '')}/index.html`
    pruefen(
      `${paar.slug}: Verweis ${paar.zuSehen.href} existiert`,
      existsSync(pfad),
      `${pfad} gibt es nicht.`
    )
  }
}

/* --------------------------------------------- Die Gegenprobe zur Prüfung selbst */

console.log('')

/*
  Ohne sie stünde nicht fest, dass die Prüfungen oben überhaupt anschlagen
  können. Eine Absicherung, die nie anschlägt, sieht aus wie Ruhe.
*/
const kaputt = {
  slug: 'probe',
  linksName: 'A',
  rechtsName: 'B',
  frage: 'x',
  zeilen: [{ was: 'Frage', links: 'lang genug hier', rechts: '' }],
  merksatz: 'kurz',
  warumEsZaehlt: 'kurz',
}
pruefen(
  'Die Prüfungen erkennen ein unfertiges Paar',
  kaputt.zeilen.length < 3 &&
    kaputt.zeilen.some((z) => z.rechts.trim().length < 10) &&
    kaputt.merksatz.trim().length <= 60,
  'Die Bedingungen oben treffen auf ein offensichtlich unfertiges Paar nicht zu.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
