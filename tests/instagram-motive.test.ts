/**
 * Fotos und Kursverläufe in den Instagram-Kacheln – an echten Kacheln.
 *
 * Ausführen mit `npm test`. Anlass in `lib/instagram-motive.ts`.
 */
import { existsSync, readFileSync } from 'node:fs'

import sharp from 'sharp'

import {
  achsenTage,
  achsenTeilung,
  BILDZONE,
  meldungskachel,
  motivJpeg,
} from '@/lib/instagram-bild'
import {
  kachelKurs,
  kursFuerKachel,
  letzterHandelstag,
  preiseIn,
} from '@/lib/instagram-kurs'
import type { MarketQuote } from '@/lib/markets'
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
pruefe('… und einem Tag zu jedem Punkt', brent?.tage.length === brent?.punkte.length)

/*
  Der Fall vom 17.10.2026: „Brent nahe 110 $", die Grafik zeigte „105,92 $
  −2,6 %". Die Tagesreihe endete am 15.10., der Freitag stand nur im
  laufenden Kurs; die Prozentzahl galt 30 Tagen. Der Betreiber hat den
  Beitrag gelöscht. Nachgestellt mit den Zahlen von damals.
*/
const reihe1510 = [
  ['2026-10-09', 104.72],
  ['2026-10-12', 106.65],
  ['2026-10-13', 105.69],
  ['2026-10-14', 106.06],
  ['2026-10-15', 105.92],
].map(([t, value]) => ({ t: t as string, value: value as number }))
const freitag = {
  value: 109.69,
  changePercent: 3.5592900302114767,
  asOf: '2026-10-16T20:59:31.000Z',
} as MarketQuote
const brentKachel = {
  titel: 'Brent nahe 110 $',
  text: 'Die Sorte Brent näherte sich am Freitag 110 Dollar je Barrel. Iran hat seine Angriffe in der Straße von Hormus verstärkt.',
}
const fall = kursFuerKachel('brent', reihe1510, freitag, brentKachel, '2026-10-17')
pruefe(
  '17.10.: der Freitag schließt die Reihe ab – 109,69 $, +3,6 % zum Vortag',
  'kurs' in fall &&
    fall.kurs.wert === '109,69 $' &&
    fall.kurs.aenderung.toFixed(1) === '3.6' &&
    fall.kurs.tage.at(-1) === '2026-10-16' &&
    fall.kurs.unterzeile.includes('Stand 16.10.'),
  JSON.stringify(fall)
)
pruefe(
  '17.10.: ohne den laufenden Kurs keine Grafik – sie endete vor dem Tag der Meldung',
  'grund' in kursFuerKachel('brent', reihe1510, undefined, brentKachel, '2026-10-17')
)
pruefe(
  'eine Zahl der Kachel, die der Grafik widerspricht, verhindert sie',
  'grund' in
    kursFuerKachel(
      'brent',
      reihe1510,
      freitag,
      { titel: 'Brent über 120 $', text: brentKachel.text },
      '2026-10-17'
    )
)
pruefe(
  '„fällt" bei steigendem Kurs verhindert sie',
  'grund' in
    kursFuerKachel(
      'brent',
      reihe1510,
      freitag,
      { titel: 'Ölpreis fällt', text: 'Brent fiel am Freitag deutlich.' },
      '2026-10-17'
    )
)
pruefe(
  '„steigt" bei fallendem Kurs verhindert sie',
  'grund' in
    kursFuerKachel(
      'brent',
      reihe1510,
      { ...freitag, value: 102, changePercent: -3.7 },
      { titel: 'Ölpreis steigt', text: 'Brent stieg am Freitag.' },
      '2026-10-17'
    )
)
pruefe(
  'Preise: „110 Dollar", „4.200 $", „25.600 Punkte"',
  JSON.stringify(preiseIn('110 Dollar, 4.200 $ und 25.600 Punkte, 3,5 Prozent')) ===
    '[110,4200,25600]'
)
pruefe(
  'letzter Handelstag vor Samstag, Sonntag, Montag ist der Freitag',
  ['2026-10-17', '2026-10-18', '2026-10-19'].every(
    (d) => letzterHandelstag(d) === '2026-10-16'
  )
)
pruefe(
  'letzter Handelstag vor Mittwoch ist Dienstag',
  letzterHandelstag('2026-10-21') === '2026-10-20'
)

/* Achsen (Betreiber 17.10.: „immer eine X- und Y-Achse mit den Koordinaten"). */
const teilung = achsenTeilung(99.2, 109.69)
pruefe(
  'Y-Achse: runde Werte, die den Verlauf einschließen',
  teilung.werte[0] <= 99.2 &&
    teilung.werte.at(-1)! >= 109.69 &&
    teilung.werte.length >= 3 &&
    teilung.werte.length <= 6,
  JSON.stringify(teilung)
)
pruefe('Y-Achse bei Gold ohne Nachkommastellen', achsenTeilung(3900, 4200).stellen === 0)
pruefe(
  'Y-Achse bei kleinen Spannen mit Nachkommastellen',
  achsenTeilung(1.081, 1.093).stellen >= 2,
  JSON.stringify(achsenTeilung(1.081, 1.093))
)
const xTage = achsenTage([
  '2026-09-15',
  '2026-09-20',
  '2026-09-25',
  '2026-10-01',
  '2026-10-06',
  '2026-10-11',
  '2026-10-16',
])
pruefe(
  'X-Achse: erster und letzter Tag, dazwischen zwei',
  xTage.length === 4 && xTage[0].text === '15.09.' && xTage.at(-1)!.text === '16.10.',
  JSON.stringify(xTage)
)

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
