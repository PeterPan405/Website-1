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
 *     Text         Open Sans 46 px, Zeilenabstand 1,4, links 35 px,
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
 * Die Schrift der Originale ist Canva Sans – eine Hausschrift von Canva, die
 * außerhalb von Canva nicht verwendet werden darf. Bis zum 16.10.2026 stand
 * hier Noto Sans (gleiche Zeilenumbrüche im Prüfsatz). Seit der Betreiber
 * „sämtliche kleineren Texte einheitlich in Canva Sans" verlangt, setzen
 * Kacheln und Zahlenkarte dieselbe Ersatzschrift: Open Sans. Sie bricht auf
 * allen 25 Kacheln der letzten Ausgaben an denselben Stellen um wie Noto
 * Sans (gemessen am 16.10.2026), und an der Zahlenkarte kam sie der Vorlage
 * am nächsten. Anton ist dieselbe.
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

let schriftenVorrat: { name: string; data: Buffer; weight: 400 | 700 }[] | null = null
function schriften() {
  schriftenVorrat ??= [
    {
      name: 'Anton',
      data: readFileSync(join(ORDNER, 'schriften/anton-400.woff')),
      weight: 400,
    },
    {
      name: 'Open Sans',
      data: readFileSync(join(ORDNER, 'schriften/open-sans-400.woff')),
      weight: 400,
    },
    {
      name: 'Open Sans',
      data: readFileSync(join(ORDNER, 'schriften/open-sans-700.woff')),
      weight: 700,
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

/** Ein Kursverlauf für die Kachel – Werte schon fertig zum Anzeigen. */
export interface KachelKurs {
  /** „Brent", „Commerzbank" */
  name: string
  /** Schlusskurse, alt nach neu. */
  punkte: number[]
  /** Die Tage zu `punkte`, als JJJJ-MM-TT – für die X-Achse. */
  tage: string[]
  /** „106,06 $" */
  wert: string
  /** Veränderung zum Vortag in Prozent – der Tag, von dem die Meldung handelt. */
  aenderung: number
  /** „am 16.10. · Verlauf 30 Tage" */
  unterzeile: string
}

/*
  Die Bildzone zwischen Überschrift und Text (16.10.2026, „mehr Bilder,
  spannender"). Die Überschrift endet bei zwei Zeilen um y 342, der Text
  beginnt bei fünf Zeilen um y 1008 – dazwischen liegt die Zone, mit Luft
  zu beiden Seiten. Ohne Bild und ohne Kurs bleibt die Kachel, wie sie war:
  weiß, mit dem Wasserzeichen.
*/
export const BILDZONE = { oben: 365, unten: 960, links: 35, breite: 1010 }
const KURSHOEHE = 340
const LUECKE = 20

const GRUEN = '#1f6b3a'
const ROT = '#a1262b'

/*
  Achsen (Betreiber 17.10.2026): „Die Charts müssen immer eine X- und
  Y-Achse mit den Koordinaten haben, sonst kann man damit nichts anfangen,
  einfach nur mit einer Kurve." Die Y-Achse trägt runde Kurswerte, die
  X-Achse vier Tage. Die Linien zeichnet das SVG, die Zahlen setzt satori
  als Text daneben – ein `<text>` im eingebetteten SVG fände keine Schrift.
*/
const Y_ACHSE = 104
const X_ACHSE = 34
/** Platz über dem obersten Teilstrich, damit seine Zahl nicht an die Unterzeile stößt. */
const PLOT_OBEN = 18

/** Runde Teilstriche: 1, 2, 2,5 oder 5 mal einer Zehnerpotenz, drei bis fünf Stück. */
export function achsenTeilung(
  min: number,
  max: number
): { werte: number[]; stellen: number } {
  const spanne = max - min || Math.abs(max) * 0.02 || 1
  const roh = spanne / 3
  const potenz = 10 ** Math.floor(Math.log10(roh))
  const schritt =
    [1, 2, 2.5, 5, 10].map((f) => f * potenz).find((x) => x >= roh) ?? 10 * potenz
  const unten = Math.floor(min / schritt) * schritt
  const oben = Math.ceil(max / schritt) * schritt
  const werte: number[] = []
  for (let w = unten; w <= oben + schritt / 2; w += schritt)
    werte.push(Number(w.toFixed(10)))
  const stellen = Math.max(
    0,
    -Math.floor(Math.log10(schritt) + 1e-9) + (schritt / potenz === 2.5 ? 1 : 0)
  )
  return { werte, stellen }
}

const zahlDe = (w: number, stellen: number) =>
  w.toLocaleString('de-DE', {
    minimumFractionDigits: stellen,
    maximumFractionDigits: stellen,
  })

function verlaufSvg(
  punkte: number[],
  breite: number,
  hoehe: number,
  farbe: string,
  teilung: number[]
): string {
  const min = teilung[0]
  const max = teilung.at(-1)!
  const spanne = max - min || 1
  const y = (p: number) => hoehe - ((p - min) / spanne) * hoehe
  const xy = punkte.map((p, i) => [(i / Math.max(1, punkte.length - 1)) * breite, y(p)])
  const linie = xy.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(' ')
  const flaeche = `0,${hoehe} ${linie} ${breite},${hoehe}`
  const gitter = teilung
    .map(
      (w) =>
        `<line x1="0" x2="${breite}" y1="${y(w).toFixed(1)}" y2="${y(w).toFixed(1)}" stroke="#c9cec7" stroke-width="2" stroke-dasharray="6 6"/>`
    )
    .join('')
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${breite}" height="${hoehe}" viewBox="0 0 ${breite} ${hoehe}">` +
    gitter +
    `<polygon points="${flaeche}" fill="${farbe}" fill-opacity="0.12"/>` +
    `<polyline points="${linie}" fill="none" stroke="${farbe}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<line x1="1.5" x2="1.5" y1="0" y2="${hoehe}" stroke="#333" stroke-width="3"/>` +
    `<line x1="0" x2="${breite}" y1="${hoehe - 1.5}" y2="${hoehe - 1.5}" stroke="#333" stroke-width="3"/>` +
    `</svg>`
  )
}

/** Die Tage für die X-Achse: erster, letzter und zwei dazwischen – „15.09." */
export function achsenTage(tage: string[]): { stelle: number; text: string }[] {
  if (tage.length === 0) return []
  const n = tage.length - 1
  const stellen = [...new Set([0, Math.round(n / 3), Math.round((2 * n) / 3), n])]
  return stellen.map((i) => ({
    stelle: n === 0 ? 0 : i / n,
    text: `${tage[i].slice(8, 10)}.${tage[i].slice(5, 7)}.`,
  }))
}

function kursKasten(kurs: KachelKurs, hoehe: number) {
  const farbe = kurs.aenderung >= 0 ? GRUEN : ROT
  const vorzeichen = kurs.aenderung > 0 ? '+' : ''
  const prozent = `${vorzeichen}${kurs.aenderung.toFixed(1).replace('.', ',')} %`
  const innen = BILDZONE.breite - 56
  const flaeche = hoehe - 116
  const plotBreite = innen - Y_ACHSE
  const plotHoehe = flaeche - X_ACHSE - PLOT_OBEN
  const { werte, stellen } = achsenTeilung(
    Math.min(...kurs.punkte),
    Math.max(...kurs.punkte)
  )
  const y = (w: number) =>
    PLOT_OBEN + plotHoehe - ((w - werte[0]) / (werte.at(-1)! - werte[0] || 1)) * plotHoehe
  const beschriftung = { fontFamily: 'Open Sans', fontSize: 21, color: '#444' }
  return h(
    'div',
    {
      style: {
        width: BILDZONE.breite,
        height: hoehe,
        display: 'flex',
        flexDirection: 'column',
        padding: '18px 28px',
        borderRadius: 28,
        backgroundColor: '#f3f5f2',
      },
    },
    h(
      'div',
      {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        },
      },
      h(
        'div',
        {
          style: {
            fontFamily: 'Open Sans',
            fontWeight: 700,
            fontSize: 34,
            color: '#000',
          },
        },
        kurs.name
      ),
      h(
        'div',
        {
          style: {
            display: 'flex',
            fontFamily: 'Open Sans',
            fontWeight: 700,
            fontSize: 34,
          },
        },
        h('span', { style: { color: '#000' } }, kurs.wert),
        h('span', { style: { color: farbe, marginLeft: 16 } }, prozent)
      )
    ),
    h(
      'div',
      { style: { fontFamily: 'Open Sans', fontSize: 22, color: '#555', marginTop: 2 } },
      kurs.unterzeile
    ),
    h(
      'div',
      {
        style: {
          position: 'relative',
          display: 'flex',
          width: innen,
          height: flaeche,
          marginTop: 14,
        },
      },
      ...werte.map((w) =>
        h(
          'div',
          {
            style: {
              ...beschriftung,
              position: 'absolute',
              left: 0,
              width: Y_ACHSE - 12,
              top: y(w) - 14,
              display: 'flex',
              justifyContent: 'flex-end',
            },
          },
          zahlDe(w, stellen)
        )
      ),
      h('img', {
        src: `data:image/svg+xml;base64,${Buffer.from(verlaufSvg(kurs.punkte, plotBreite, plotHoehe, farbe, werte)).toString('base64')}`,
        width: plotBreite,
        height: plotHoehe,
        style: { position: 'absolute', left: Y_ACHSE, top: PLOT_OBEN },
      }),
      ...achsenTage(kurs.tage).map(({ stelle, text }) =>
        h(
          'div',
          {
            style: {
              ...beschriftung,
              position: 'absolute',
              top: PLOT_OBEN + plotHoehe + 6,
              /* Der erste Tag beginnt an der Achse, der letzte endet am Rand. */
              left:
                Y_ACHSE +
                stelle * plotBreite -
                (stelle === 0 ? 0 : stelle === 1 ? 90 : 45),
              width: 90,
              display: 'flex',
              justifyContent:
                stelle === 0 ? 'flex-start' : stelle === 1 ? 'flex-end' : 'center',
            },
          },
          text
        )
      )
    )
  )
}

/** Eine Meldungskachel als PNG – wahlweise mit Foto und Kursverlauf. */
export async function meldungskachel(
  titel: string,
  text: string,
  bild: { foto?: Buffer | null; kurs?: KachelKurs | null } = {}
): Promise<Buffer> {
  /*
    Zahl und Einheit bleiben zusammen: „UK-Inflation auf 3,5 %" brach am
    22.10.2026 vor dem Prozentzeichen um, das dann allein in der Zeile stand.
  */
  titel = titel.replace(/(\d) (%|\$|€|Mrd\.|Mio\.|Prozent)/g, '$1\u00a0$2')
  const foto = bild.foto ?? null
  const kurs = bild.kurs && bild.kurs.punkte.length >= 2 ? bild.kurs : null
  const zone = BILDZONE.unten - BILDZONE.oben
  const fotoHoehe = foto ? (kurs ? zone - KURSHOEHE - LUECKE : zone) : 0
  const kursHoehe = kurs ? (foto ? KURSHOEHE : zone) : 0

  const bildzone =
    foto || kurs
      ? h(
          'div',
          {
            style: {
              position: 'absolute',
              top: BILDZONE.oben,
              left: BILDZONE.links,
              width: BILDZONE.breite,
              display: 'flex',
              flexDirection: 'column',
            },
          },
          ...(foto
            ? [
                h('img', {
                  src: `data:image/jpeg;base64,${foto.toString('base64')}`,
                  width: BILDZONE.breite,
                  height: fotoHoehe,
                  style: { objectFit: 'cover', borderRadius: 28 },
                }),
              ]
            : []),
          ...(kurs
            ? [
                h(
                  'div',
                  { style: { display: 'flex', marginTop: foto ? LUECKE : 0 } },
                  kursKasten(kurs, kursHoehe)
                ),
              ]
            : [])
        )
      : null

  const bildAntwort = new ImageResponse(
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
      ...(bildzone
        ? [bildzone]
        : [
            h('img', {
              src: datenUrl('grundplatte.png', 'image/png'),
              width: IG_BREITE,
              height: IG_HOEHE,
              style: { position: 'absolute', left: 0, top: 0 },
            }),
          ]),
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
            fontFamily: 'Open Sans',
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
  return Buffer.from(await bildAntwort.arrayBuffer())
}

/** Ein Fotomotiv aus `lib/instagram/motive/` (siehe `lib/instagram-motive.ts`). */
export function motivJpeg(id: string): Buffer {
  return readFileSync(join(ORDNER, 'motive', `${id}.jpg`))
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
 * Bei 18 Bildern und sieben Beiträgen je Woche (seit dem 17.10.2026 täglich)
 * kehrt ein Deckblatt nach gut zweieinhalb Wochen wieder.
 */
export function deckblaetter(): string[] {
  return readdirSync(join(ORDNER, 'titelbilder'))
    .filter((d) => d.endsWith('.jpg') && !(d in NICHT_ALS_DECKBLATT))
    .sort()
}

/**
 * Deckblätter, bei denen die Überschrift mit dem Bild kämpft.
 *
 * Gestaltungsrichtlinie des Betreibers vom 16.10.2026: „Achte darauf, dass
 * sich die Überschrift möglichst nicht mit auffälligen Bildelementen im
 * Hintergrund überschneidet. Der Bildhintergrund soll eine gute Lesbarkeit
 * ermöglichen." Die Überschrift ist in die Bilder eingebrannt; die Wahl
 * bleibt also nur zwischen den Bildern.
 *
 * Gemessen hinter der Überschrift (x 30–650, y 40–340, ohne die Schrift und
 * vier Pixel um sie herum), mit dem Wert, an dem es scheitert – geprüft in
 * `tests/instagram-tagesnews.test.ts`:
 *
 *   Kontrast   Abstand der Hintergrundhelligkeit zur Schrift; unter 110
 *              verschwimmt weiße Schrift im hellen Himmel
 *   Unruhe     mittlerer Helligkeitssprung zwischen Nachbarpixeln über 8
 *              **und** Streuung über 40 – Fassaden, Schilder, Menschen
 *
 * Drei weitere sind mit dem Auge aussortiert: Ein Motiv ragt in „des Tages"
 * hinein, nimmt dort aber zu wenig Fläche ein, um die Messung zu kippen.
 *
 * Die Dateien bleiben liegen; sie gehen nur nicht mehr in die Reihe.
 */
export const NICHT_ALS_DECKBLATT: Record<string, string> = {
  '2026-08-24.jpg': 'Kontrast 91, Unruhe 8,3 – weiße Schrift vor Fassade',
  '2026-09-02.jpg': 'Kontrast 62 – weiße Schrift im hellen Himmel',
  '2026-09-04.jpg': 'Kontrast nahe 0 – weiße Schrift auf Weiß',
  '2026-09-08.jpg': 'Unruhe 9,0, Streuung 75 – Schrift über Glasfassaden',
  '2026-09-15.jpg': 'Kontrast 102 – weiße Schrift, Gebäude dahinter',
  '2026-09-18.jpg': 'Unruhe 18,3 – Schrift über Laterne und Fassaden',
  '2026-10-05.jpg': 'Kontrast 74 – weiße Schrift im hellen Himmel',
  '2026-09-21.jpg': 'mit dem Auge: Schlossturm ragt in „des Tages"',
  '2026-09-24.jpg': 'mit dem Auge: Kräne ragen in „des Tages"',
  '2026-09-30.jpg': 'mit dem Auge: Dachkonstruktion ragt in „des Tages"',
}

/*
  Tage seit einem festen Montag – damit jeder Tag sein eigenes Bild hat.
  Bis zum 16.10.2026 zählten nur Werktage; seit die Tagesnews auch samstags
  und sonntags erscheinen, bekäme das Wochenende sonst das Bild vom Freitag.
*/
function tagNummer(datum: string): number {
  const anfang = Date.UTC(2026, 0, 5) // Montag, 5. Januar 2026
  return Math.round((Date.parse(`${datum}T00:00:00Z`) - anfang) / 86_400_000)
}

/**
 * Das Deckblatt zum Thema – das Titelbild, aus dem das Motiv geschnitten ist.
 * Ohne Thema (oder wenn sein Bild nicht als Deckblatt taugt) reihum.
 */
export function deckblattZumThema(
  datum: string,
  quelle: string | null
): { datei: string; jpeg: Buffer } {
  if (quelle && deckblaetter().includes(quelle))
    return { datei: quelle, jpeg: readFileSync(join(ORDNER, 'titelbilder', quelle)) }
  return deckblatt(datum)
}

/**
 * Die Deckblätter für die Reihe – nur, was zu jedem Tag passt: Skylines von
 * Frankfurt und New York, die Zeitung, der Himmel.
 *
 * Betreiber, 24.10.2026: Der Beitrag ging mit einem startenden Flugzeug
 * hinaus, an einem Tag ohne jede Luftfahrt-Meldung, und wurde gelöscht. Die
 * Reihe lief über **alle** Deckblätter, auch über die mit Thema – Zug,
 * Flugzeug, Fed, EZB, Fabrik, Barcelona. Die gibt es jetzt nur noch über
 * `deckblattMotiv()`, wenn die erste Meldung dazu passt.
 */
export const NEUTRALE_DECKBLAETTER = [
  '2026-08-21.jpg',
  '2026-08-26.jpg',
  '2026-08-27.jpg',
  '2026-09-01.jpg',
  '2026-09-07.jpg',
  '2026-09-14.jpg',
  '2026-09-23.jpg',
  '2026-09-25.jpg',
  '2026-10-09.jpg',
]

/** Das Deckblatt des Tages, als JPEG – reihum, an jedem Tag ein anderes. */
export function deckblatt(datum: string): { datei: string; jpeg: Buffer } {
  const liste = deckblaetter().filter((d) => NEUTRALE_DECKBLAETTER.includes(d))
  if (liste.length === 0) throw new Error('lib/instagram/titelbilder/ ist leer.')
  const datei = liste[((tagNummer(datum) % liste.length) + liste.length) % liste.length]
  return { datei, jpeg: readFileSync(join(ORDNER, 'titelbilder', datei)) }
}
