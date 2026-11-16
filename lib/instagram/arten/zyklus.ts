/**
 * Der Zyklus (16.11.2026, für den Bitcoin-Vierjahreszyklus): ein Karussell
 * aus fünf Seiten über eine Reihe, die sich an wiederkehrenden Ereignissen
 * misst – bei Bitcoin das Halving.
 *
 *   1. Der ganze Verlauf, logarithmisch, mit den Ereignissen und den
 *      Phasen Bullen- und Bärenmarkt.
 *   2. Die Zyklen übereinandergelegt, ab dem Ereignis gezählt.
 *   3. Die Phasen je Zyklus als Zeitleiste in Tagen.
 *   4. Anstieg und Absturz je Zyklus im Vergleich.
 *   5. Stimmen: Lebt der Zyklus noch?
 *
 * Alle Zahlen außer den Stimmen rechnet die Karte selbst aus der Reihe –
 * Tage, Faktoren, Rückgänge. Die Musterkarte ist die Karte vom 17.11.2026.
 */
import { createElement as h } from 'react'

import { STIL, STIL_RAND, ZK_BREITE, svgAdresse } from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  OBEN_FOLGE,
  UNTEN,
  prozent,
  pruefeGemeinsam,
  rahmen,
  zahl,
  type Art,
  type Element,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Zykluskarte extends NeuGemeinsam {
  art: 'zyklus'
  /** [Tag, Wert], aufsteigend. Halving, Hoch und Boden müssen darin stehen. */
  reihe: readonly (readonly [string, number])[]
  einheit: string
  /** Wie das Ereignis heißt („Halving“). */
  ereignis: string
  /** Je Zyklus: Boden davor, Ereignis, Hoch, Boden danach (fehlt beim laufenden). */
  zyklen: {
    name: string
    bodenVorher: string
    ereignis: string
    hoch: string
    boden?: string
  }[]
  /** Satz unter Seite 1. */
  satz: string
  stimmen: {
    vorbei: { wer: string; text: string }[]
    lebt: { wer: string; text: string }[]
  }
  /**
   * Für die Seite „laengen“: Bullen- und Bärenmarkt je Zyklus in Tagen,
   * Boden bis Hoch und Hoch bis Boden. Eingetragen statt gerechnet, weil die
   * frühen Zyklen vor der Reihe liegen; der Test rechnet sie nach.
   */
  laengen?: { name: string; bulle: number; baer: number; laufend?: boolean }[]
  /** Kopf und Satz der Seite „laengen“. */
  laengenKopf?: string
  laengenSatz?: string
  /** Welche Seiten, in welcher Reihenfolge; ohne Angabe alle fünf. */
  seitenwahl?: Zyklusseite[]
}

const TAG = 86400000
export const tage = (a: string, b: string) =>
  Math.round((Date.parse(b) - Date.parse(a)) / TAG)
export const wert = (k: Zykluskarte, d: string) => k.reihe.find(([t]) => t === d)?.[1]
const letzter = (k: Zykluskarte) => k.reihe[k.reihe.length - 1]

/** Tiefster Wert nach dem Hoch des laufenden Zyklus (bis heute). */
export function tiefSeit(k: Zykluskarte, hoch: string): readonly [string, number] {
  return k.reihe.filter(([t]) => t > hoch).reduce((a, b) => (b[1] < a[1] ? b : a))
}

/** Kennzahlen je Zyklus – gerechnet, nicht eingetragen. */
export function kennzahlen(k: Zykluskarte) {
  return k.zyklen.map((z) => {
    const [heute] = letzter(k)
    const tief = z.boden ? ([z.boden, wert(k, z.boden)!] as const) : tiefSeit(k, z.hoch)
    return {
      name: z.name,
      bisHoch: tage(z.ereignis, z.hoch),
      faktor: wert(k, z.hoch)! / wert(k, z.ereignis)!,
      absturz: (tief[1] / wert(k, z.hoch)! - 1) * 100,
      bisBoden: z.boden ? tage(z.hoch, z.boden) : tage(z.hoch, heute),
      laufend: !z.boden,
      tief,
    }
  })
}

const GRUEN_HELL = 'rgba(32,84,55,0.10)'
const ROT_HELL = 'rgba(139,34,37,0.10)'

function klein(text: string, stil: Record<string, string | number>): Element {
  return h(
    'div',
    {
      style: {
        position: 'absolute',
        display: 'flex',
        fontFamily: 'Montserrat',
        fontSize: 18,
        color: STIL.hellgrau,
        ...stil,
      },
    },
    text
  )
}

function bild(svg: string, hoehe: number): Element {
  return h('img', {
    src: svgAdresse(svg),
    width: ZK_BREITE,
    height: hoehe,
    style: { position: 'absolute', top: 0, left: 0 },
  })
}

/** Logarithmische Achse: Zehnerpotenzen zwischen a und b. */
function zehner(a: number, b: number) {
  const aus: number[] = []
  for (let e = Math.floor(Math.log10(a)); e <= Math.ceil(Math.log10(b)); e++)
    aus.push(10 ** e)
  return aus
}

function seiteVerlauf(k: Zykluskarte): Element[] {
  const oben = OBEN_ERSTE + 50
  const unten = UNTEN - 150
  const links = STIL_RAND + 70
  const rechts = ZK_BREITE - STIL_RAND
  const t0 = Date.parse(k.reihe[0][0])
  const t1 = Date.parse(letzter(k)[0])
  const werte = k.reihe.map(([, v]) => v)
  const achse = zehner(Math.min(...werte), Math.max(...werte)).filter(
    (v) => v <= Math.max(...werte) * 1.5
  )
  const lo = Math.log10(achse[0])
  const hi = Math.log10(Math.max(...werte) * 1.5)
  const X = (d: string) => links + ((Date.parse(d) - t0) / (t1 - t0)) * (rechts - links)
  const Y = (v: number) => unten - ((Math.log10(v) - lo) / (hi - lo)) * (unten - oben)
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${unten + 4}">`
  for (const z of k.zyklen) {
    svg += `<rect x="${X(z.bodenVorher)}" y="${oben}" width="${X(z.hoch) - X(z.bodenVorher)}" height="${unten - oben}" fill="${GRUEN_HELL}"/>`
    const ende = z.boden ?? letzter(k)[0]
    svg += `<rect x="${X(z.hoch)}" y="${oben}" width="${X(ende) - X(z.hoch)}" height="${unten - oben}" fill="${ROT_HELL}"/>`
  }
  for (const v of achse)
    svg += `<line x1="${links}" x2="${rechts}" y1="${Y(v)}" y2="${Y(v)}" stroke="${STIL.rand}" stroke-width="1.5"/>`
  for (const z of k.zyklen)
    svg += `<line x1="${X(z.ereignis)}" x2="${X(z.ereignis)}" y1="${oben}" y2="${unten}" stroke="${STIL.grau}" stroke-width="2" stroke-dasharray="6 6"/>`
  svg += `<polyline fill="none" stroke="${STIL.navy}" stroke-width="3.5" stroke-linejoin="round" points="${k.reihe.map(([d, v]) => `${X(d).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')}"/>`
  for (const z of k.zyklen) {
    svg += `<circle cx="${X(z.hoch)}" cy="${Y(wert(k, z.hoch)!)}" r="8" fill="${STIL.gruen}"/>`
    const b = z.boden ?? z.bodenVorher
    svg += `<circle cx="${X(b)}" cy="${Y(wert(k, b)!)}" r="8" fill="${STIL.rot}"/>`
    if (z.boden === undefined) continue
  }
  svg += `<circle cx="${X(k.zyklen[0].bodenVorher)}" cy="${Y(wert(k, k.zyklen[0].bodenVorher)!)}" r="8" fill="${STIL.rot}"/>`
  svg += `<line x1="${links}" x2="${rechts}" y1="${unten}" y2="${unten}" stroke="${STIL.hellgrau}" stroke-width="2"/>`
  svg += '</svg>'
  const jahre: string[] = []
  for (
    let j = Number(k.reihe[0][0].slice(0, 4)) + 1;
    j <= Number(letzter(k)[0].slice(0, 4));
    j += 2
  )
    jahre.push(`${j}-01-01`)
  const legende = (farbe: string, text: string, links: number, kreis = false) =>
    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: unten + 52,
          left: links,
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'Montserrat',
          fontSize: 19,
          color: STIL.grau,
        },
      },
      h('div', {
        style: {
          width: kreis ? 14 : 26,
          height: 14,
          borderRadius: kreis ? 7 : 3,
          backgroundColor: farbe,
          marginRight: 8,
        },
      }),
      text
    )
  return [
    bild(svg, unten + 4),
    ...achse.map((v) => klein(zahl(v), { top: Y(v) - 12, left: STIL_RAND })),
    ...jahre.map((d) =>
      klein(d.slice(0, 4), {
        top: unten + 10,
        left: X(d) - 30,
        width: 60,
        justifyContent: 'center',
      })
    ),
    ...k.zyklen.map((z) =>
      klein(k.ereignis, {
        top: oben - 26,
        left: X(z.ereignis) - 50,
        width: 100,
        justifyContent: 'center',
        color: STIL.grau,
        fontWeight: 700,
      })
    ),
    klein(`${k.einheit}, logarithmisch`, {
      top: oben - 56,
      left: STIL_RAND,
      color: STIL.grau,
      fontSize: 19,
    }),
    legende('rgba(32,84,55,0.25)', 'Bullenmarkt', STIL_RAND),
    legende('rgba(139,34,37,0.25)', 'Bärenmarkt', STIL_RAND + 190),
    legende(STIL.gruen, 'Hoch', STIL_RAND + 380, true),
    legende(STIL.rot, 'Boden', STIL_RAND + 490, true),
  ]
}

function seiteUebereinander(k: Zykluskarte): Element[] {
  const oben = OBEN_FOLGE + 150
  const unten = UNTEN - 160
  const links = STIL_RAND + 70
  const rechts = ZK_BREITE - STIL_RAND - 60
  const lang = 1100
  const reihen = k.zyklen.map((z) => {
    const start = wert(k, z.ereignis)!
    return k.reihe
      .filter(([d]) => d >= z.ereignis && tage(z.ereignis, d) <= lang)
      .map(([d, v]) => [tage(z.ereignis, d), v / start] as const)
  })
  const alle = reihen.flat().map(([, f]) => f)
  const achse = [0.5, 1, 2, 5, 10, 20, 50].filter(
    (f) => f >= Math.min(...alle) / 1.2 && f <= Math.max(...alle) * 2
  )
  const lo = Math.log10(achse[0])
  const hi = Math.log10(achse[achse.length - 1])
  const X = (t: number) => links + (t / lang) * (rechts - links)
  const Y = (f: number) => unten - ((Math.log10(f) - lo) / (hi - lo)) * (unten - oben)
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${unten + 4}">`
  for (const f of achse)
    svg += `<line x1="${links}" x2="${rechts}" y1="${Y(f)}" y2="${Y(f)}" stroke="${f === 1 ? STIL.hellgrau : STIL.rand}" stroke-width="${f === 1 ? 2.5 : 1.5}"/>`
  for (let t = 0; t <= lang; t += 250)
    svg += `<line x1="${X(t)}" x2="${X(t)}" y1="${oben}" y2="${unten}" stroke="${STIL.rand}" stroke-width="1.5"/>`
  const farben = ['#b7bec8', '#8a93a0', STIL.navy]
  const kz = kennzahlen(k)
  reihen.forEach((r, i) => {
    const f = farben[i + 3 - reihen.length] ?? STIL.grau
    svg += `<polyline fill="none" stroke="${f}" stroke-width="${i === reihen.length - 1 ? 4.5 : 3}" stroke-linejoin="round" points="${r.map(([t, v]) => `${X(t).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')}"/>`
    svg += `<circle cx="${X(kz[i].bisHoch)}" cy="${Y(kz[i].faktor)}" r="8" fill="${f}"/>`
  })
  svg += '</svg>'
  const namen = reihen.map((r, i) => {
    const [t, v] = r[r.length - 1]
    const f = farben[i + 3 - reihen.length] ?? STIL.grau
    return klein(k.zyklen[i].name, {
      top: Y(v) - 12,
      left: X(t) + 8,
      color: i === reihen.length - 1 ? STIL.navy : STIL.grau,
      fontWeight: 800,
      fontSize: 20,
      ...(f ? {} : {}),
    })
  })
  return [
    bild(svg, unten + 4),
    ...achse.map((f) =>
      klein(`×${zahl(f, f < 1 ? 1 : 0)}`, { top: Y(f) - 12, left: STIL_RAND })
    ),
    ...[0, 250, 500, 750, 1000].map((t) =>
      klein(String(t), {
        top: unten + 10,
        left: X(t) - 30,
        width: 60,
        justifyContent: 'center',
      })
    ),
    klein(`Tage nach dem ${k.ereignis} →`, {
      top: unten + 40,
      right: STIL_RAND,
      color: STIL.grau,
      fontSize: 19,
    }),
    klein(`↑ Kurs, ein Vielfaches des Kurses am ${k.ereignis}-Tag`, {
      top: oben - 50,
      left: STIL_RAND,
      color: STIL.grau,
      fontSize: 19,
    }),
    ...namen,
  ]
}

function seitePhasen(k: Zykluskarte): Element[] {
  const kz = kennzahlen(k)
  const oben = OBEN_FOLGE + 230
  const links = STIL_RAND + 110
  const rechts = ZK_BREITE - STIL_RAND
  const zeilen = k.zyklen.map((z) => ({
    aufbau: tage(z.bodenVorher, z.ereignis),
    bulle: tage(z.ereignis, z.hoch),
    baer: z.boden ? tage(z.hoch, z.boden) : tage(z.hoch, letzter(k)[0]),
    laufend: !z.boden,
  }))
  const max = Math.max(...zeilen.map((z) => z.aufbau + z.bulle + z.baer))
  const s = (rechts - links) / max
  const hoehe = 84
  const abstand = 250
  const aus: Element[] = []
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${oben + abstand * zeilen.length}">`
  zeilen.forEach((z, i) => {
    const y = oben + i * abstand
    let x = links
    const teile = [
      { l: z.aufbau, f: '#d5d9e0', t: 'Aufbau', c: STIL.tinte },
      { l: z.bulle, f: STIL.gruen, t: 'Bulle', c: '#ffffff' },
      { l: z.baer, f: STIL.rot, t: z.laufend ? 'Bär, bisher' : 'Bär', c: '#ffffff' },
    ]
    for (const [j, p] of teile.entries()) {
      const b = p.l * s
      const offen = z.laufend && j === 2
      svg += `<rect x="${x}" y="${y}" width="${b - 4}" height="${hoehe}" rx="8" fill="${p.f}" ${offen ? 'fill-opacity="0.55"' : ''}/>`
      aus.push(
        h(
          'div',
          {
            style: {
              position: 'absolute',
              top: y + 8,
              left: x,
              width: b - 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontFamily: 'Montserrat',
              color: p.c,
            },
          },
          h(
            'div',
            { style: { fontSize: 24, fontWeight: 800, marginTop: 4 } },
            `${p.l} Tage`
          ),
          h('div', { style: { fontSize: 18 } }, p.t)
        )
      )
      x += b
    }
    aus.push(
      klein(k.zyklen[i].name, {
        top: y + 26,
        left: STIL_RAND,
        fontSize: 28,
        fontWeight: 800,
        color: i === zeilen.length - 1 ? STIL.navy : STIL.tinte,
      })
    )
    const zz = k.zyklen[i]
    aus.push(
      klein(
        `Boden ${datum(zz.bodenVorher)} · ${k.ereignis} ${datum(zz.ereignis)} · Hoch ${datum(zz.hoch)}${zz.boden ? ` · Boden ${datum(zz.boden)}` : ` · heute ${datum(letzter(k)[0])}`}`,
        { top: y + hoehe + 14, left: links, fontSize: 18, color: STIL.grau }
      )
    )
    void kz
  })
  svg += '</svg>'
  return [bild(svg, oben + abstand * zeilen.length), ...aus]
}

function seiteLaengen(k: Zykluskarte): Element[] {
  const l = k.laengen ?? []
  const oben = OBEN_FOLGE + 190
  const links = STIL_RAND + 150
  const rechts = ZK_BREITE - STIL_RAND
  const max = Math.max(...l.map((z) => z.bulle + z.baer))
  const s = (rechts - links) / max
  const hoehe = 96
  const abstand = Math.min(200, (UNTEN - 120 - oben) / Math.max(l.length, 1))
  const aus: Element[] = []
  const teil = (
    x: number,
    y: number,
    b: number,
    farbe: string,
    oben1: string,
    unten1: string,
    blass = false
  ) =>
    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: y,
          left: x,
          width: b - 6,
          height: hoehe,
          borderRadius: 10,
          backgroundColor: farbe,
          opacity: blass ? 0.55 : 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Montserrat',
          color: '#ffffff',
        },
      },
      h('div', { style: { fontSize: 30, fontWeight: 800 } }, oben1),
      h('div', { style: { fontSize: 18 } }, unten1)
    )
  l.forEach((z, i) => {
    const y = oben + i * abstand
    aus.push(
      klein(z.name, {
        top: y + hoehe / 2 - 18,
        left: STIL_RAND,
        fontSize: 26,
        fontWeight: 800,
        color: i === l.length - 1 ? STIL.navy : STIL.tinte,
      }),
      teil(links, y, z.bulle * s, STIL.gruen, `${zahl(z.bulle)} Tage`, 'Bullenmarkt'),
      teil(
        links + z.bulle * s,
        y,
        z.baer * s,
        STIL.rot,
        `${zahl(z.baer)} Tage`,
        z.laufend ? 'Bärenmarkt, bisher' : 'Bärenmarkt',
        z.laufend
      )
    )
    if (!z.laufend)
      aus.push(
        klein(`Ganzer Zyklus: ${zahl(z.bulle + z.baer)} Tage`, {
          top: y + hoehe + 10,
          left: links,
          fontSize: 18,
          color: STIL.grau,
        })
      )
  })
  return aus
}

const datum = (d: string) => `${d.slice(8, 10)}.${d.slice(5, 7)}.${d.slice(2, 4)}`

function seiteVergleich(k: Zykluskarte): Element[] {
  const kz = kennzahlen(k)
  const block = (
    titel: string,
    oben: number,
    werte: { name: string; v: number; text: string; laufend?: boolean }[],
    farbe: string
  ) => {
    const max = Math.max(...werte.map((w) => Math.abs(w.v)))
    const links = STIL_RAND + 110
    const breite = ZK_BREITE - STIL_RAND - links - 170
    const aus: Element[] = [
      klein(titel, {
        top: oben,
        left: STIL_RAND,
        fontSize: 24,
        fontWeight: 800,
        color: STIL.tinte,
      }),
    ]
    werte.forEach((w, i) => {
      const y = oben + 50 + i * 62
      aus.push(
        klein(w.name, {
          top: y + 6,
          left: STIL_RAND,
          fontSize: 22,
          fontWeight: 700,
          color: i === werte.length - 1 ? STIL.navy : STIL.grau,
        }),
        h('div', {
          style: {
            position: 'absolute',
            top: y,
            left: links,
            width: Math.max((Math.abs(w.v) / max) * breite, 6),
            height: 40,
            borderRadius: 6,
            backgroundColor: farbe,
            opacity: w.laufend ? 0.55 : 1,
          },
        }),
        klein(w.text, {
          top: y + 6,
          left: links + Math.max((Math.abs(w.v) / max) * breite, 6) + 14,
          fontSize: 22,
          fontWeight: 700,
          color: STIL.tinte,
        })
      )
    })
    return aus
  }
  const o = OBEN_FOLGE + 130
  return [
    ...block(
      `Vom ${k.ereignis} zum Hoch: Tage`,
      o,
      kz.map((z) => ({ name: z.name, v: z.bisHoch, text: `${z.bisHoch}` })),
      STIL.hellgrau
    ),
    ...block(
      `Vom ${k.ereignis} zum Hoch: Anstieg`,
      o + 280,
      kz.map((z) => ({ name: z.name, v: z.faktor, text: `×${zahl(z.faktor, 1)}` })),
      STIL.gruen
    ),
    ...block(
      'Vom Hoch zum Boden: Absturz',
      o + 560,
      kz.map((z) => ({
        name: z.name,
        v: z.absturz,
        text: `${prozent(z.absturz)}${z.laufend ? ' bisher' : ''}`,
        laufend: z.laufend,
      })),
      STIL.rot
    ),
  ]
}

function seiteStimmen(k: Zykluskarte): Element[] {
  const spalte = (
    titel: string,
    links: number,
    farbe: string,
    liste: { wer: string; text: string }[]
  ) => [
    klein(titel, {
      top: OBEN_FOLGE + 140,
      left: links,
      fontSize: 28,
      fontWeight: 800,
      color: farbe,
    }),
    ...liste.map((s, i) =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            top: OBEN_FOLGE + 230 + i * (liste.length <= 2 ? 330 : 190),
            left: links,
            width: (ZK_BREITE - 2 * STIL_RAND - 40) / 2,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Montserrat',
            borderLeft: `4px solid ${farbe}`,
            paddingLeft: 16,
          },
        },
        h(
          'div',
          {
            style: {
              fontSize: liste.length <= 2 ? 30 : 21,
              lineHeight: 1.35,
              color: STIL.tinte,
            },
          },
          s.text
        ),
        h(
          'div',
          {
            style: {
              fontSize: liste.length <= 2 ? 21 : 18,
              marginTop: 10,
              color: STIL.grau,
              fontWeight: 700,
            },
          },
          s.wer
        )
      )
    ),
  ]
  return [
    ...spalte('„Vorbei“', STIL_RAND, STIL.rot, k.stimmen.vorbei),
    ...spalte('„Lebt noch“', ZK_BREITE / 2 + 20, STIL.gruen, k.stimmen.lebt),
  ]
}

export type Zyklusseite =
  'verlauf' | 'takt' | 'phasen' | 'vergleich' | 'stimmen' | 'laengen'
const ALLE: Zyklusseite[] = ['verlauf', 'takt', 'phasen', 'vergleich', 'stimmen']
const auswahl = (k: Zykluskarte) => k.seitenwahl ?? ALLE

export const zyklus: Art<Zykluskarte> = {
  seiten: (k) => auswahl(k).length,
  seite(k, logo, nr) {
    const kz = kennzahlen(k)
    const jetzt = kz[kz.length - 1]
    const frueher = kz.slice(0, -1)
    const seiten = auswahl(k).length
    const welche = auswahl(k)[nr - 1]
    const r = (o: { kopf?: string; satz?: string; inhalt: Element[] }) =>
      rahmen(k, logo, { seite: nr, seiten, ...o })
    if (welche === 'verlauf') return r({ satz: k.satz, inhalt: seiteVerlauf(k) })
    if (welche === 'takt')
      return r({
        kopf: `Der Takt: Hoch nach ${frueher.map((z) => z.bisHoch).join(', ')} – und ${jetzt.bisHoch} Tagen`,
        satz: `Gleiche Uhr, andere Wucht: diesmal nur ×${zahl(jetzt.faktor, 1)} bis zum Hoch.`,
        inhalt: seiteUebereinander(k),
      })
    if (welche === 'phasen')
      return r({
        kopf: 'Die Phasen: Aufbau, Bulle, Bär',
        satz: `Der Bärenmarkt dauerte ${frueher.map((z) => z.bisBoden).join(' und ')} Tage. Diesmal sind es bisher ${jetzt.bisBoden}.`,
        inhalt: seitePhasen(k),
      })
    if (welche === 'laengen')
      return r({ kopf: k.laengenKopf, satz: k.laengenSatz, inhalt: seiteLaengen(k) })
    if (welche === 'vergleich')
      return r({
        kopf: 'Pünktlich, aber schwächer',
        satz: `Tiefster Kurs seit dem Hoch: ${zahl(jetzt.tief[1])} ${k.einheit} am ${datum(jetzt.tief[0])}.`,
        inhalt: seiteVergleich(k),
      })
    return r({
      kopf: 'Lebt der Zyklus noch?',
      satz: 'Beide Lager haben Argumente – die Zahlen zeigen beides.',
      inhalt: seiteStimmen(k),
    })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    for (const z of k.zyklen)
      for (const d of [z.bodenVorher, z.ereignis, z.hoch, z.boden])
        if (d && wert(k, d) === undefined)
          f.push(`${z.name}: ${d} steht nicht in der Reihe.`)
    if (k.zyklen.length < 2 || k.zyklen.length > 3)
      f.push(`${k.zyklen.length} Zyklen – zwei bis drei.`)
    if (k.zyklen.slice(0, -1).some((z) => !z.boden))
      f.push('Nur der letzte Zyklus darf noch laufen.')
    for (const s of [...k.stimmen.vorbei, ...k.stimmen.lebt])
      if (s.text.length > 120)
        f.push(`Stimme von ${s.wer}: ${s.text.length} Zeichen – höchstens 120.`)
    if (k.stimmen.vorbei.length > 3 || k.stimmen.lebt.length > 3)
      f.push('Höchstens drei Stimmen je Seite.')
    if (auswahl(k).includes('laengen') && !(k.laengen && k.laengen.length >= 2))
      f.push('Seite „laengen“ ohne mindestens zwei Zyklen.')
    if (k.laengen?.slice(0, -1).some((z) => z.laufend))
      f.push('Nur der letzte Zyklus darf bei den Längen noch laufen.')
    return f
  },
}
