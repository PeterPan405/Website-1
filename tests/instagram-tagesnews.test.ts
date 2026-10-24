/**
 * „Top-News des Tages" sieht aus wie immer – geprüft am echten Beitrag.
 *
 * ## Woran gemessen wird
 *
 * Am Tagesbeitrag vom 9. Oktober 2026, wie er im Kanal steht (Abzug über die
 * Graph-Schnittstelle am 11.10.2026): fünf Kacheln, die Beschriftung
 * zeichengenau. Der Betreiber wollte „keine neuen Experimente" – also muss
 * der Generator aus denselben Bausteinen denselben Beitrag ergeben.
 *
 * ## Was geprüft wird
 *
 *   1. Die Beschriftung des 9. Oktober entsteht **Zeichen für Zeichen** neu –
 *      Kopf, Rechtshinweis samt KI-Hinweis, fünf Schlagworte.
 *   2. Der Plan des 9. Oktober besteht die Prüfung; absichtlich verdorbene
 *      Pläne fallen durch. Eine Prüfung, die nie anschlägt, sähe aus wie Ruhe.
 *   3. Täglich seit dem 17.10.2026 – davor nur montags bis freitags.
 *   4. Gesetzte Kacheln: Überschriften wie im Original ein- oder zweizeilig,
 *      der Text unten bündig, nie mehr als fünf Zeilen.
 *   5. Die Anweisung an das Modell steht in beiden Wegen gleich.
 */

import { readFileSync } from 'node:fs'

import sharp from 'sharp'

import {
  deckblaetter,
  deckblatt,
  NEUTRALE_DECKBLAETTER,
  meldungskachel,
  NICHT_ALS_DECKBLATT,
} from '@/lib/instagram-bild'
import {
  ANWEISUNG_INSTAGRAM,
  type InstagramPlan,
  RECHTSHINWEIS,
  TEXT_MAX,
  TITEL_MAX,
  beschriftungTagesnews,
  istErscheinungstag,
  pruefeInstagramPlan,
  tagesstand,
} from '@/lib/instagram-plan'

let failed = 0
function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) console.log(`OK   ${was}`)
  else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/** Der Tagesbeitrag vom 9. Oktober 2026, abgeschrieben von den Kacheln. */
const NEUNTER: InstagramPlan = {
  zusammenfassung:
    'KI-Aktien unter Druck, Brasiliens Börse auf Rekordhoch und steigende Ölpreise. Gleichzeitig sorgen Frankreichs Haushaltsprobleme und die Entwicklungen rund um die EZB für Aufmerksamkeit.',
  kacheln: [
    {
      titel: 'KI-Werte unter Druck',
      text: 'Der Nasdaq gab wegen Sorgen um OpenAI und andere KI-Werte nach, während der Dow stabil blieb. TSMC meldete gleichzeitig einen Rekordumsatz.',
    },
    {
      titel: 'Brasilien auf Rekord',
      text: 'Brasiliens Leitindex Bovespa stieg am Montag um 7,7 % auf ein Rekordhoch. Flávio Bolsonaros Vorsprung im ersten Wahlgang weckte Hoffnungen auf einen strengeren Sparkurs.',
    },
    {
      titel: 'Öl',
      text: 'Brent stieg auf über 103 Dollar je Fass. Gleichzeitig senkten Irak und Saudi-Arabien ihre Verkaufspreise für Abnehmer in Asien.',
    },
    {
      titel: 'Frankreich unter Druck',
      text: 'In Frankreich demonstrierten 71.500 Menschen für bessere Schulen. Gleichzeitig bleibt der Anleihemarkt wegen der angespannten Haushaltslage unter Druck.',
    },
    {
      titel: 'EZB',
      text: 'Heute sprechen die EZB-Mitglieder Cipollone und Schnabel, während die EU-Finanzminister tagen. Zugleich läuft die Suche nach einer Nachfolge für Schnabel.',
    },
  ],
  schlagworte: ['daily', 'news', 'finance', 'investment', 'wirtschaft'],
}

/** Die Beschriftung, wie sie am 9.10.2026 im Kanal stand – wörtlich. */
const BESCHRIFTUNG_NEUNTER =
  'Die wichtigsten Börsennews des Tages. 📈\n\nKI-Aktien unter Druck, Brasiliens Börse auf Rekordhoch und steigende Ölpreise. Gleichzeitig sorgen Frankreichs Haushaltsprobleme und die Entwicklungen rund um die EZB für Aufmerksamkeit.\n\nAlle fünf Entwicklungen im Überblick. Quelle: iminvests.de\n\nKeine Anlageberatung – nur Wissensvermittlung\nAlle Inhalte dieses Accounts dienen der allgemeinen Information und Bildung. Sie stellen keine Anlage-, Rechts- oder Steuerberatung dar und berücksichtigen weder deine persönliche Situation noch deine Anlageziele. Kurse, Kennzahlen und Rechenergebnisse sind Beispielwerte beziehungsweise Schätzungen. Jede Kapitalanlage ist mit Risiken verbunden, bis zum vollständigen Verlust des eingesetzten Geldes. Hinweis: Die Inhalte wurden mit Unterstützung von KI erstellt. #daily #news #finance #investment #wirtschaft'

// ------------------------------------------------------------ 1. Beschriftung

pruefen(
  'Die Beschriftung des 9. Oktober entsteht zeichengenau neu',
  beschriftungTagesnews(NEUNTER) === BESCHRIFTUNG_NEUNTER,
  'Abweichung gegenüber dem Kanal – Kopf, Absätze oder Rechtshinweis stimmen nicht.'
)
pruefen(
  'Der KI-Hinweis steht im Rechtshinweis',
  RECHTSHINWEIS.endsWith('Hinweis: Die Inhalte wurden mit Unterstützung von KI erstellt.')
)

// ------------------------------------------------------------ 2. Prüfung

pruefen(
  'Der Plan des 9. Oktober besteht die Prüfung',
  pruefeInstagramPlan(NEUNTER).length === 0,
  pruefeInstagramPlan(NEUNTER).join(' ')
)

const verdorben: [string, InstagramPlan][] = [
  ['sechs Kacheln', { ...NEUNTER, kacheln: [...NEUNTER.kacheln, NEUNTER.kacheln[0]] }],
  [
    'eine zu lange Überschrift',
    {
      ...NEUNTER,
      kacheln: NEUNTER.kacheln.map((k, i) =>
        i ? k : { ...k, titel: 'Notenbanken weltweit im Fokus der Anleger' }
      ),
    },
  ],
  [
    'ein zu kurzer Text',
    {
      ...NEUNTER,
      kacheln: NEUNTER.kacheln.map((k, i) =>
        i ? k : { ...k, text: 'Nasdaq schwächer.' }
      ),
    },
  ],
  [
    'ein Emoji auf der Kachel',
    {
      ...NEUNTER,
      kacheln: NEUNTER.kacheln.map((k, i) => (i ? k : { ...k, titel: 'Öl 🛢️' })),
    },
  ],
  ['vier Schlagworte', { ...NEUNTER, schlagworte: NEUNTER.schlagworte.slice(0, 4) }],
  [
    'ein Schlagwort mit #',
    { ...NEUNTER, schlagworte: ['#news', 'top', 'daily', 'öl', 'ezb'] },
  ],
  [
    'ein großgeschriebenes Schlagwort',
    { ...NEUNTER, schlagworte: ['News', 'top', 'daily', 'öl', 'ezb'] },
  ],
  [
    'ein # in der Zusammenfassung',
    { ...NEUNTER, zusammenfassung: NEUNTER.zusammenfassung + ' #news' },
  ],
]
for (const [was, plan] of verdorben)
  pruefen(`Gegenprobe: ${was} fällt durch`, pruefeInstagramPlan(plan).length > 0)
pruefen(
  'Gegenprobe: ein fehlender Plan fällt durch',
  pruefeInstagramPlan(undefined).length > 0
)

// ------------------------------------------------------------ 3. Jeder Tag

pruefen('Freitag, 9.10.2026 ist ein Erscheinungstag', istErscheinungstag('2026-10-09'))
pruefen('Samstag, 17.10.2026 ist einer', istErscheinungstag('2026-10-17'))
pruefen('Sonntag, 18.10.2026 ist einer', istErscheinungstag('2026-10-18'))
pruefen('kein Datum ist keiner', !istErscheinungstag('17.10.2026'))
pruefen('Montag, 12.10.2026 ist einer', istErscheinungstag('2026-10-12'))

/* Sonntags und montags drei bis fünf Kacheln (Betreiber, 18.10.2026). */
const drei = { ...NEUNTER, kacheln: NEUNTER.kacheln.slice(0, 3) }
pruefen(
  'Sonntag mit drei Kacheln: in Ordnung',
  pruefeInstagramPlan(drei, '2026-10-18').length === 0,
  pruefeInstagramPlan(drei, '2026-10-18').join(' | ')
)
pruefen(
  'Montag mit drei Kacheln: in Ordnung',
  pruefeInstagramPlan(drei, '2026-10-19').length === 0
)
pruefen(
  'Samstag mit drei Kacheln: zu wenig',
  pruefeInstagramPlan(drei, '2026-10-17').length > 0
)
pruefen(
  'Sonntag mit zwei Kacheln: zu wenig',
  pruefeInstagramPlan({ ...NEUNTER, kacheln: NEUNTER.kacheln.slice(0, 2) }, '2026-10-18')
    .length > 0
)

const json = JSON.stringify(NEUNTER)
pruefen(
  'Werktag mit gültigem Plan → Tagesbeitrag',
  tagesstand('2026-10-09', json).status === 'tagesnews'
)
pruefen(
  'Wochenende mit Plan → Tagesbeitrag (seit 17.10.2026)',
  tagesstand('2026-10-17', json).status === 'tagesnews'
)
pruefen(
  'Werktag ohne Plan → kein Beitrag',
  tagesstand('2026-10-12', null).status === 'kein-beitrag'
)
pruefen(
  'Werktag mit kaputtem Plan → kein Beitrag',
  tagesstand('2026-10-12', '{').status === 'kein-beitrag'
)

// ------------------------------------------------------------ 4. Gesetzte Kacheln

/** Zeilen dunkler Schrift – oben die Überschrift, unten der Text. */
async function zeilen(png: Buffer): Promise<{ oben: number[][]; unten: number[][] }> {
  const { data, info } = await sharp(png)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const bloecke: number[][] = []
  let von = -1
  let bis = -1
  for (let y = 0; y < info.height; y++) {
    let dunkel = false
    for (let x = 0; x < info.width; x++)
      if (data[y * info.width + x] < 110) {
        dunkel = true
        break
      }
    if (dunkel) {
      if (von < 0) von = y
      bis = y
    } else if (von >= 0 && y - bis > 6) {
      bloecke.push([von, bis])
      von = -1
    }
  }
  if (von >= 0) bloecke.push([von, bis])
  return {
    oben: bloecke.filter((b) => b[0] < 600),
    unten: bloecke.filter((b) => b[0] >= 600),
  }
}

/** Zeilen je Kachel im Original vom 9.10.: Überschrift / Text. */
const ORIGINAL = [
  [1, 4],
  [1, 5],
  [1, 3],
  [2, 4],
  [1, 4],
]

for (const [i, k] of NEUNTER.kacheln.entries()) {
  const z = await zeilen(await meldungskachel(k.titel, k.text))
  pruefen(
    `„${k.titel}": ${z.oben.length} Zeile(n) Überschrift, ${z.unten.length} Zeilen Text wie im Original`,
    z.oben.length === ORIGINAL[i][0] && z.unten.length === ORIGINAL[i][1],
    `erwartet ${ORIGINAL[i][0]} / ${ORIGINAL[i][1]}`
  )
  const letzte = z.unten.at(-1)?.[1] ?? 0
  pruefen(
    `„${k.titel}": Text endet unten wie im Original (y ${letzte}, Original 1313–1335)`,
    letzte >= 1300 && letzte <= 1340
  )
}

/*
  Der ungünstige Fall: lange Wörter, die schlecht umbrechen. Mit 206
  Zeichen ergab dieser Satz sechs Zeilen – daher die Grenze bei 190.
*/
const schwer =
  'Die Bundesregierung beschließt eine Verbrauchsteuer auf Kunststoffverpackungen. Vorgesehen sind 550 Euro je Tonne. Verbraucherschutzorganisationen befürchten steigende Endkundenpreise bei Lebensmitteln.'
const lang = await zeilen(
  await meldungskachel(
    'Palantir: Bewertung im Fokus'.slice(0, TITEL_MAX),
    schwer.slice(0, TEXT_MAX)
  )
)
pruefen(
  `Längste Überschrift im Kanal (28 Zeichen) bleibt zweizeilig – ${lang.oben.length}`,
  lang.oben.length <= 2
)
pruefen(
  `Text an der Höchstgrenze bleibt bei höchstens fünf Zeilen – ${lang.unten.length}`,
  lang.unten.length <= 5
)

// ------------------------------------------------------------ Deckblätter

const liste = deckblaetter()
/* 28 Bilder, davon zehn aussortiert (`NICHT_ALS_DECKBLATT`) – 18 bleiben. */
pruefen(`Es liegen Deckblätter bereit (${liste.length})`, liste.length >= 15)

/*
  Lesbarkeit hinter der Überschrift – Richtlinie des Betreibers vom
  16.10.2026. Gemessen wie in `lib/instagram-bild.ts` beschrieben; jedes
  Deckblatt in der Reihe muss bestehen, und jedes, das wegen der Messung
  aussortiert ist, muss durchfallen. Sonst misst die Prüfung nichts.
*/
async function lesbarkeit(datei: string) {
  const { data, info } = await sharp(`lib/instagram/titelbilder/${datei}`)
    .extract({ left: 30, top: 40, width: 620, height: 300 })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const W = info.width
  const H = info.height
  let w = 0
  let b = 0
  for (const v of data) {
    if (v > 235) w++
    if (v < 35) b++
  }
  const weiss = w > b
  const nah = new Uint8Array(W * H)
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const v = data[y * W + x]
      if (weiss ? v > 200 : v < 70)
        for (let dy = -4; dy <= 4; dy++)
          for (let dx = -4; dx <= 4; dx++) {
            const yy = y + dy
            const xx = x + dx
            if (yy >= 0 && yy < H && xx >= 0 && xx < W) nah[yy * W + xx] = 1
          }
    }
  let n = 0
  let s = 0
  let s2 = 0
  let g = 0
  for (let y = 1; y < H - 1; y++)
    for (let x = 1; x < W - 1; x++) {
      const i = y * W + x
      if (nah[i]) continue
      const v = data[i]
      n++
      s += v
      s2 += v * v
      g += Math.abs(data[i + 1] - data[i - 1]) + Math.abs(data[i + W] - data[i - W])
    }
  if (n === 0) return { kontrast: 0, streuung: 0, unruhe: 0 }
  const m = s / n
  return {
    kontrast: weiss ? 255 - m : m,
    streuung: Math.sqrt(s2 / n - m * m),
    unruhe: g / n,
  }
}
const besteht = (l: { kontrast: number; streuung: number; unruhe: number }) =>
  l.kontrast >= 110 && !(l.unruhe > 8 && l.streuung > 40)
for (const datei of liste) {
  const l = await lesbarkeit(datei)
  pruefen(
    `Deckblatt ${datei} ist hinter der Überschrift ruhig genug`,
    besteht(l),
    JSON.stringify(l)
  )
}
for (const [datei, grund] of Object.entries(NICHT_ALS_DECKBLATT)) {
  if (grund.startsWith('mit dem Auge')) continue
  pruefen(`aussortiert fällt durch: ${datei}`, !besteht(await lesbarkeit(datei)))
}
pruefen(
  'die Reihe nimmt nur neutrale Deckblätter – kein Flugzeug ohne Flugmeldung (24.10.)',
  Array.from(
    { length: 30 },
    (_, i) => deckblatt(`2026-11-${String(i + 1).padStart(2, '0')}`).datei
  ).every((d) => NEUTRALE_DECKBLAETTER.includes(d)) &&
    !NEUTRALE_DECKBLAETTER.includes('2026-08-31.jpg')
)
pruefen(
  'jedes neutrale Deckblatt gibt es und ist lesbar',
  NEUTRALE_DECKBLAETTER.every((d) => liste.includes(d))
)
const montag = deckblatt('2026-10-12').datei
const dienstag = deckblatt('2026-10-13').datei
pruefen(
  'Zwei Werktage hintereinander haben verschiedene Deckblätter',
  montag !== dienstag
)
pruefen(
  'Freitag, Samstag und Sonntag haben drei verschiedene Deckblätter',
  new Set(['2026-10-16', '2026-10-17', '2026-10-18'].map((d) => deckblatt(d).datei))
    .size === 3
)
pruefen(
  'Dasselbe Datum ergibt dasselbe Deckblatt',
  deckblatt('2026-10-12').datei === montag
)
const meta = await sharp(deckblatt('2026-10-12').jpeg).metadata()
pruefen(
  `Deckblatt hat 1080 × 1350 (${meta.width} × ${meta.height})`,
  meta.width === 1080 && meta.height === 1350
)

// ------------------------------------------------------------ 5. Beide Wege

const ohneRaum = (s: string) => s.replace(/\r/g, '').replace(/\s+/g, ' ').trim()
const agent = readFileSync('.github/workflows/nachrichten-agent.yml', 'utf8')

/*
  GitHub verwirft einen Workflow, dessen Text mit Ausdruck (\${{ … }}) über
  21.000 **Bytes** lang ist – ohne Lauf, nur „No jobs were run" bei jedem
  Push. So geschehen am 18.10.2026: Die Wochenend-Regel brachte den Prompt
  von 20.898 auf 21.560 Bytes, und der Agent lief nicht mehr. Die erste
  Korrektur zählte Zeichen (20.680) und lag in Bytes noch darüber (21.142):
  „, ä, – sind zwei bis drei Bytes. Gezählt wird der Block unter
  `prompt: |`, eingerückt wie YAML ihn liest.
*/
{
  const zeilen = agent.split('\n')
  const start = zeilen.findIndex((z) => /^ {10}prompt: \|\s*$/.test(z))
  const block: string[] = []
  for (const z of zeilen.slice(start + 1)) {
    if (z.trim() && !z.startsWith(' '.repeat(12))) break
    block.push(z.slice(12))
  }
  const laenge = Buffer.byteLength(block.join('\n').trimEnd(), 'utf8')
  pruefen(
    `der Agenten-Prompt hat ${laenge} Bytes – GitHub nimmt höchstens 21.000, Puffer 200`,
    start > 0 && laenge > 10_000 && laenge <= 20_800,
    'Kürzen – sonst läuft nachrichten-agent.yml gar nicht.'
  )
}
pruefen(
  'Der Agent bekommt dieselbe Instagram-Anweisung wie der Weg über die Schnittstelle',
  ohneRaum(agent).includes(ohneRaum(ANWEISUNG_INSTAGRAM)),
  'Wer lib/instagram-plan.ts ändert, ändert nachrichten-agent.yml mit (Abschnitt „Der Instagram-Beitrag").'
)
const skript = readFileSync('scripts/nachrichten-erzeugen.ts', 'utf8')
pruefen(
  'nachrichten-erzeugen.ts setzt die Anweisung ein',
  skript.includes('${ANWEISUNG_INSTAGRAM}')
)

if (failed > 0) {
  console.log(`\n${failed} Prüfung(en) fehlgeschlagen.`)
  process.exit(1)
}
console.log('\nAlle Prüfungen bestanden.')
