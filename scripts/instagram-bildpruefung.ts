/**
 * Prüft die Kacheln, die hinausgingen, bevor sie hinausgehen – Anlass und
 * Regeln in `lib/instagram-bildpruefung.ts`.
 *
 * Liest aus `out/instagram/`, was `instagram-beitrag.yml` von der Website
 * geholt hat: die Kacheln `N.jpg`, `stand.txt`, das Gedächtnis
 * `bilder-frueher.txt` (vom Zweig `instagram-gepostet`) und den Befund der
 * Sichtprüfung `sichtpruefung.json`, falls es ihn gibt.
 *
 * Schreibt `bilder-heute.txt` – die Abdrücke des Tages, die nach dem
 * Veröffentlichen ins Gedächtnis kommen. Findet es etwas, endet es rot, und
 * nichts geht hinaus: Lieber ein Beitrag später als ein falscher.
 */
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import {
  type Abdruck,
  fingerabdruck,
  gerechneterBefund,
  liesFrueher,
  sichtBefund,
} from '@/lib/instagram-bildpruefung'

const ORDNER = 'out/instagram'
const lies = (name: string) => {
  const pfad = join(ORDNER, name)
  return existsSync(pfad) ? readFileSync(pfad, 'utf8') : null
}

const [datum = '', art = ''] = (lies('stand.txt') ?? '').split('\n').map((z) => z.trim())
if (!/^\d{4}-\d{2}-\d{2}$/.test(datum) || art !== 'tagesnews') {
  console.log('Kein Tagesbeitrag – nichts zu prüfen.')
  process.exit(0)
}

const heute: Abdruck[] = []
for (let n = 1; existsSync(join(ORDNER, `${n}.jpg`)); n++)
  heute.push(await fingerabdruck(n, readFileSync(join(ORDNER, `${n}.jpg`))))
writeFileSync(
  join(ORDNER, 'bilder-heute.txt'),
  heute
    .filter((k) => k.stelle >= 2 && !k.leer)
    .map((k) => `${datum} ${k.stelle} ${k.abdruck}\n`)
    .join('')
)

const gerechnet = gerechneterBefund(
  datum,
  heute,
  liesFrueher(lies('bilder-frueher.txt') ?? '')
)
const stellen = heute.filter((k) => k.stelle >= 2).map((k) => k.stelle)
const sicht = sichtBefund(lies('sichtpruefung.json'), stellen)

for (const k of heute)
  console.log(`Kachel ${k.stelle}: ${k.leer ? 'ohne Bild' : k.abdruck}`)
/*
  Das Urteil des Auges steht im Protokoll, nicht nur sein Ergebnis – sonst
  lässt sich einem „in Ordnung" nicht ansehen, ob es hingesehen hat.
*/
for (const u of sicht.urteile)
  console.log(`Sicht ${u.stelle}: ${u.passt ? 'passt' : 'passt nicht'} – ${u.grund}`)
if (sicht.ausgefallen)
  console.log(
    '::warning::Sichtprüfung ausgefallen – kein Urteil zu jeder Kachel. Es gilt nur die gerechnete Prüfung.'
  )

const fehler = [...gerechnet, ...sicht.fehler]
const zusammenfassung = process.env.GITHUB_STEP_SUMMARY
if (zusammenfassung)
  appendFileSync(
    zusammenfassung,
    `### Bildprüfung ${datum}\n\n` +
      (fehler.length ? fehler.map((f) => `- ${f}\n`).join('') : 'Alles in Ordnung.\n') +
      (sicht.ausgefallen ? '\nSichtprüfung ausgefallen.\n' : '') +
      '\n'
  )

if (fehler.length) {
  for (const f of fehler) console.log(`::error::${f}`)
  console.log(
    'Nichts geht hinaus. Bild austauschen (instagram-bilder-auswahl.yml), dann neu.'
  )
  process.exit(1)
}
console.log(`${stellen.length} Kacheln geprüft – in Ordnung.`)
