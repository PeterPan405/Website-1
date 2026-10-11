/**
 * Die Kacheln von „Top-News des Tages" – so, wie sie im Kanal immer aussahen.
 *
 * ## Abgemessen, nicht nachempfunden
 *
 * Bis zum 11. Oktober 2026 erzeugte diese Datei eine eigene Gestaltung –
 * weiße Titelkachel, „DIE MELDUNGEN DES TAGES" in blauen Versalien, Rubrik
 * und „1 von 3". Veröffentlicht wurde sie nie: Im Kanal standen 54
 * Tagesbeiträge in einer ganz anderen Form. Der Betreiber am 11.10.2026: „Du
 * sollst das gleiche Design wiedergeben … keine neuen Experimente."
 *
 * Die Maße hier sind deshalb an den veröffentlichten Kacheln gemessen
 * (1080 × 1350, 200 Meldungskacheln vom 17.08. bis 9.10.2026):
 *
 *     Überschrift  Anton 108 px, rechtsbündig, rechter Rand 42 px,
 *                  höchstens 900 px breit, Zeilenabstand 1,37,
 *                  Oberkante der Versalien bei y ≈ 46
 *     Text         Noto Sans 46 px, Zeilenabstand 1,4, links 35 px,
 *                  unten bündig, letzte Zeile endet bei y ≈ 1315
 *     Grund        weiß, das IMI-Wasserzeichen in der Mitte
 *
 * Gegengeprüft an „KI-Werte unter Druck" (9.10.): Original x 158–1045,
 * y 46–139; gesetzt x 148–1038, y 46–139.
 *
 * Das Wasserzeichen ist **ausgeschnitten, nicht nachgebaut**:
 * `lib/instagram/grundplatte.png` ist der Streifen y 150–1075 einer
 * veröffentlichten Kachel, auf Weiß gelegt. Verglichen mit vier anderen Tagen
 * weicht er im Mittel um 0,44 Graustufen ab – das ist das JPEG, nicht das
 * Zeichen.
 *
 * Die Schrift der Originale war nicht frei verfügbar; Noto Sans steht ihr am
 * nächsten (gleiche Zeilenumbrüche im Prüfsatz). Anton ist dieselbe.
 *
 * ## Warum kein JSX
 *
 * Damit Prüfungen die Kacheln wirklich setzen können: `tests/` läuft unter
 * Node mit `--experimental-strip-types`, und das übersetzt kein JSX. Mit
 * `createElement` geht dieselbe Datei durch den Bau **und** durch den Test.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { ImageResponse } from 'next/og.js'
import { createElement as h } from 'react'

export const IG_BREITE = 1080
export const IG_HOEHE = 1350

const ORDNER = join(process.cwd(), 'lib/instagram')

function datenUrl(datei: string, art: string): string {
  return `data:${art};base64,${readFileSync(join(ORDNER, datei)).toString('base64')}`
}

let schriftenVorrat: { name: string; data: Buffer; weight: 400 }[] | null = null
function schriften() {
  schriftenVorrat ??= [
    {
      name: 'Anton',
      data: readFileSync(join(ORDNER, 'schriften/anton-400.woff')),
      weight: 400,
    },
    {
      name: 'Noto Sans',
      data: readFileSync(join(ORDNER, 'schriften/noto-sans-400.woff')),
      weight: 400,
    },
  ]
  return schriftenVorrat
}

/** Maße, auf die `tests/instagram-tagesnews.test.ts` sich bezieht. */
export const UEBERSCHRIFT = {
  groesse: 108,
  zeilenabstand: 1.37,
  rechts: 42,
  breite: 900,
  oben: 20,
}
export const TEXT = { groesse: 46, zeilenabstand: 1.4, links: 35, rechts: 38, unten: 20 }

/** Eine Meldungskachel als PNG. */
export async function meldungskachel(titel: string, text: string): Promise<Buffer> {
  const bild = new ImageResponse(
    h(
      'div',
      {
        style: {
          width: IG_BREITE,
          height: IG_HOEHE,
          display: 'flex',
          position: 'relative',
          backgroundColor: '#ffffff',
        },
      },
      h('img', {
        src: datenUrl('grundplatte.png', 'image/png'),
        width: IG_BREITE,
        height: IG_HOEHE,
        style: { position: 'absolute', left: 0, top: 0 },
      }),
      h(
        'div',
        {
          style: {
            position: 'absolute',
            top: UEBERSCHRIFT.oben,
            right: UEBERSCHRIFT.rechts,
            width: UEBERSCHRIFT.breite,
            display: 'flex',
            justifyContent: 'flex-end',
            textAlign: 'right',
            fontFamily: 'Anton',
            fontSize: UEBERSCHRIFT.groesse,
            lineHeight: UEBERSCHRIFT.zeilenabstand,
            color: '#000000',
          },
        },
        titel.trim()
      ),
      h(
        'div',
        {
          style: {
            position: 'absolute',
            left: TEXT.links,
            right: TEXT.rechts,
            bottom: TEXT.unten,
            display: 'flex',
            fontFamily: 'Noto Sans',
            fontSize: TEXT.groesse,
            lineHeight: TEXT.zeilenabstand,
            color: '#000000',
          },
        },
        text.trim()
      )
    ),
    { width: IG_BREITE, height: IG_HOEHE, fonts: schriften() }
  )
  return Buffer.from(await bild.arrayBuffer())
}

/**
 * Die Deckblätter: veröffentlichte Titelkacheln aus dem Kanal, unverändert.
 *
 * ## Warum gebrauchte Deckblätter
 *
 * Das Deckblatt ist an jedem Tag dasselbe – „Top-News des Tages" in Anton,
 * links oben, auf einem Foto. Neu ist nur das Foto. Für ein neues Foto
 * bräuchte es eine Bildquelle, und jede neue Quelle wäre genau das
 * Experiment, das nicht gewünscht ist.
 *
 * Ausgewählt sind 28 von 37 Deckblättern seit dem 17. August, an denen nichts
 * an einen Tag gebunden ist: Skylines, Börsen- und Notenbankgebäude, Häfen,
 * Landschaften. Weggelassen wurden Menschen, Marken und Produkte (Trump und
 * Xi, Moderna, iPhone, Nike, VW, Dell, Paramount) und die älteren Deckblätter
 * mit Unterzeile, die zu einer früheren Form gehören.
 *
 * Bei 28 Bildern und fünf Beiträgen je Woche kehrt ein Deckblatt nach gut
 * fünf Wochen wieder.
 */
export function deckblaetter(): string[] {
  return readdirSync(join(ORDNER, 'titelbilder'))
    .filter((d) => d.endsWith('.jpg'))
    .sort()
}

/** Werktage seit einem festen Montag – damit jeder Tag sein eigenes Bild hat. */
function werktagNummer(datum: string): number {
  const anfang = Date.UTC(2026, 0, 5) // Montag, 5. Januar 2026
  const tage = Math.round((Date.parse(`${datum}T00:00:00Z`) - anfang) / 86_400_000)
  const wochen = Math.floor(tage / 7)
  return wochen * 5 + Math.min(((tage % 7) + 7) % 7, 4)
}

/** Das Deckblatt des Tages, als JPEG – reihum, an jedem Werktag ein anderes. */
export function deckblatt(datum: string): { datei: string; jpeg: Buffer } {
  const liste = deckblaetter()
  if (liste.length === 0) throw new Error('lib/instagram/titelbilder/ ist leer.')
  const datei =
    liste[((werktagNummer(datum) % liste.length) + liste.length) % liste.length]
  return { datei, jpeg: readFileSync(join(ORDNER, 'titelbilder', datei)) }
}
