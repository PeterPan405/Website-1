/**
 * Fotos und Kursverläufe in den Instagram-Kacheln – an echten Kacheln.
 *
 * Ausführen mit `npm test`. Anlass in `lib/instagram-motive.ts`.
 */
import { existsSync, readFileSync } from 'node:fs'

import sharp from 'sharp'

import { BILDZONE, meldungskachel, motivJpeg } from '@/lib/instagram-bild'
import { kachelKurs } from '@/lib/instagram-kurs'
import { bebildere, kursZurKachel, MOTIVE, woerter } from '@/lib/instagram-motive'

let failed = 0
function pruefe(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) console.log(`OK   ${was}`)
  else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/* Die Motive liegen bereit, und jedes stammt aus einem Deckblatt. */
for (const m of MOTIVE) {
  pruefe(`Motiv ${m.id} liegt bereit`, existsSync(`lib/instagram/motive/${m.id}.jpg`))
  pruefe(
    `… geschnitten aus ${m.quelle}`,
    existsSync(`lib/instagram/titelbilder/${m.quelle}`)
  )
}
pruefe(
  'kein Motiv doppelt angelegt',
  new Set(MOTIVE.map((m) => m.id)).size === MOTIVE.length
)

/* Wortgrenzen auch vor Umlauten – `\b` kennt nur ASCII. */
pruefe('„Öl: 104 Dollar" findet Öl', woerter('Öl*').test('Öl: 104 Dollar'))
pruefe(
  '„Kohle" findet kein „Öl"',
  !woerter('Öl*').test('Kohle und Ölz'.replace('Ölz', 'Holz'))
)
pruefe('„Fed" steckt nicht in „Federal"', !woerter('Fed').test('Federal Express'))

/* Kurse: nur aus der Überschrift, Beiname vor Firmenname. */
pruefe(
  'Dow ist der Index, nicht Dow Inc.',
  kursZurKachel('Dow vs. Nasdaq') === 'dow-jones'
)
pruefe('Öl ist Brent', kursZurKachel('Öl steigt, Gold fällt') === 'brent')
pruefe('Lufthansa beim Namen', kursZurKachel('Lufthansa gewinnt TAP') === 'lufthansa')
pruefe(
  'was zuerst steht, gewinnt',
  kursZurKachel('UniCredit: 50 % Commerzbank') === 'unicredit'
)
pruefe(
  'kein Kurs, wenn die Überschrift keinen nennt',
  kursZurKachel('US-Banken: Zahlen') === null
)

/* Die echten Kacheln vom 12. bis 16.10.2026. */
const tage = ['2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15', '2026-10-16']
let mitFoto = 0
let gesamt = 0
for (const tag of tage) {
  const plan = JSON.parse(readFileSync(`data/instagram/${tag}.json`, 'utf8'))
  const b = bebildere(plan.kacheln)
  const motive = b.map((x) => x.motiv).filter(Boolean)
  pruefe(
    `${tag}: kein Motiv zweimal`,
    new Set(motive).size === motive.length,
    JSON.stringify(motive)
  )
  mitFoto += motive.length
  gesamt += b.length
}
pruefe(
  `die meisten Kacheln bekommen ein Foto (${mitFoto} von ${gesamt})`,
  mitFoto >= gesamt * 0.7
)
const ukraine = bebildere([
  { titel: 'Ukraine: Neuer Angriff', text: 'Die US-Regierung …' },
])[0]
pruefe('„Ukraine" bekommt keine New Yorker Skyline', ukraine.motiv === null)

/* Der Kurs rechnet aus dem Bestand. */
const brent = await kachelKurs('brent')
pruefe('Brent hat einen Verlauf', (brent?.punkte.length ?? 0) >= 5, JSON.stringify(brent))
pruefe('… mit Dollarzeichen', brent?.wert.endsWith(' $') ?? false, brent?.wert)

/*
  Die Bildzone überdeckt den Text nicht – auch nicht bei fünf Zeilen. Unter
  der Zone bis zum Text muss die Kachel weiß sein.
*/
const lang =
  'Ein Text an der Höchstgrenze, mit langen Wörtern wie Kapitalmarktunion und Finanzstabilitätsbericht, damit er sicher fünf Zeilen füllt und bis nach oben reicht.'
const png = await meldungskachel('Brent über 107 $', lang, {
  foto: motivJpeg('oel'),
  kurs: brent,
})
const { data, info } = await sharp(png)
  .extract({ left: 0, top: BILDZONE.unten + 2, width: 1080, height: 40 })
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true })
const dunkel = [...data].filter((v) => v < 200).length
pruefe(
  'zwischen Bildzone und Text bleibt es frei',
  dunkel === 0,
  `${dunkel} dunkle Pixel`
)
pruefe('die Kachel hat 1080 × 1350', info.width === 1080)

/* Gegenprobe: Ohne Bild bleibt die Kachel, wie sie war – mit Wasserzeichen. */
const ohne = await meldungskachel('Gold', lang)
const mitte = await sharp(ohne)
  .extract({ left: 440, top: 560, width: 200, height: 200 })
  .greyscale()
  .raw()
  .toBuffer()
pruefe(
  'ohne Bild: Wasserzeichen in der Mitte',
  [...mitte].some((v) => v < 250)
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
