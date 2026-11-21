/**
 * Die Schere (21.11.2026, erste vollautomatisch gebaute Art): zwei Reihen
 * über dieselbe Zeit, die Fläche zwischen ihnen getönt – Navy, wo die erste
 * oben liegt, Grau, wo die zweite oben liegt. So sieht man nicht nur zwei
 * Kurven, sondern **wer vorn liegt und wann es kippt**. Dazu eine
 * gestrichelte Marke (etwa ein Ziel) und die letzten Werte rechts neben dem
 * Ende jeder Linie.
 *
 * Anlass: Inflation im Euroraum gegen Deutschland, Oktober 2026 – zum
 * ersten Mal seit Beginn der Reihe liegt der Euroraum mehr als einen
 * Prozentpunkt über Deutschland. Betreiber 20.11.2026: „gerne auch neue
 * bauen … abwechslungsreich“.
 */
import { createElement as h } from 'react'

import {
  STIL,
  STIL_RAND,
  ZK_BREITE,
  achsenschritt,
  svgAdresse,
} from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  OBEN_FOLGE,
  UNTEN,
  pruefeGemeinsam,
  rahmen,
  zahl,
  type Art,
  type Element,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Scherenreihe {
  name: string
  /** Tag (JJJJ-MM-TT) oder Monat (JJJJ-MM) und Wert. */
  werte: readonly (readonly [string, number])[]
}

export interface Scherenkarte extends NeuGemeinsam {
  art: 'schere'
  /** Die erste Reihe (Navy) und die zweite (Grau) – mit denselben Tagen. */
  a: Scherenreihe
  b: Scherenreihe
  einheit: string
  stellen?: number
  /** Text hinter dem letzten Wert, etwa „ %“. */
  endung?: string
  /** Eine waagerechte Marke, gestrichelt, Text links darüber (rechts liegen die Endwerte). */
  marke?: { wert: number; text: string }
  /** Beschriftete Punkte auf Reihe a oder b; der Tag muss in der Reihe stehen. */
  punkte?: { reihe: 'a' | 'b'; d: string; text: string; unten?: boolean }[]
  satz?: string
}

const tag = (d: string) => Date.parse(d.length === 7 ? `${d}-15` : d)

export const schere: Art<Scherenkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const folge = ((k as { _dossier?: { seite: number } })._dossier?.seite ?? 1) > 1
    const oben = folge ? OBEN_FOLGE + 170 : OBEN_ERSTE + 90
    const unten = UNTEN - 80
    const links = STIL_RAND + 60
    const rechts = ZK_BREITE - STIL_RAND - 120
    const alle = [...k.a.werte, ...k.b.werte].map(([, v]) => v)
    if (k.marke) alle.push(k.marke.wert)
    const s = achsenschritt(Math.max(...alle), 6)
    const hoch = Math.ceil(Math.max(...alle) / s - 1e-9) * s
    const t0 = tag(k.a.werte[0][0])
    const t1 = tag(k.a.werte[k.a.werte.length - 1][0])
    const X = (d: string) => links + ((tag(d) - t0) / (t1 - t0)) * (rechts - links)
    const Y = (v: number) => unten - (v / hoch) * (unten - oben)
    const TON_A = 'rgba(23,41,111,0.24)'
    const TON_B = 'rgba(138,147,160,0.26)'

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${unten + 4}">`
    const ticks: number[] = []
    for (let i = 0; i * s <= hoch + 1e-9; i++) {
      ticks.push(i * s)
      svg += `<line x1="${links}" x2="${rechts}" y1="${Y(i * s)}" y2="${Y(i * s)}" stroke="${i === 0 ? STIL.hellgrau : STIL.rand}" stroke-width="${i === 0 ? 2.5 : 1.5}"/>`
    }
    /* Die Fläche zwischen den Linien, Abschnitt für Abschnitt – kreuzen sie
       sich, wird am Schnittpunkt geteilt. */
    const p = (x: number, y: number) => `${x.toFixed(1)},${y.toFixed(1)}`
    for (let i = 0; i + 1 < k.a.werte.length; i++) {
      const [d0, a0] = k.a.werte[i]
      const [d1, a1] = k.a.werte[i + 1]
      const b0 = k.b.werte[i][1]
      const b1 = k.b.werte[i + 1][1]
      const x0 = X(d0)
      const x1 = X(d1)
      const u0 = a0 - b0
      const u1 = a1 - b1
      if (u0 * u1 < 0) {
        const t = u0 / (u0 - u1)
        const xc = x0 + t * (x1 - x0)
        const yc = Y(a0 + t * (a1 - a0))
        svg += `<polygon fill="${u0 > 0 ? TON_A : TON_B}" points="${p(x0, Y(a0))} ${p(xc, yc)} ${p(x0, Y(b0))}"/>`
        svg += `<polygon fill="${u1 > 0 ? TON_A : TON_B}" points="${p(xc, yc)} ${p(x1, Y(a1))} ${p(x1, Y(b1))}"/>`
      } else if (u0 + u1 !== 0) {
        svg += `<polygon fill="${u0 + u1 > 0 ? TON_A : TON_B}" points="${p(x0, Y(a0))} ${p(x1, Y(a1))} ${p(x1, Y(b1))} ${p(x0, Y(b0))}"/>`
      }
    }
    if (k.marke)
      svg += `<line x1="${links}" x2="${rechts}" y1="${Y(k.marke.wert)}" y2="${Y(k.marke.wert)}" stroke="${STIL.tinte}" stroke-width="2" stroke-dasharray="10 8"/>`
    const linie = (r: Scherenreihe, farbe: string, breite: number) =>
      `<polyline fill="none" stroke="${farbe}" stroke-width="${breite}" stroke-linejoin="round" points="${r.werte.map(([d, v]) => p(X(d), Y(v))).join(' ')}"/>`
    svg += linie(k.b, STIL.hellgrau, 3)
    svg += linie(k.a, STIL.navy, 3.5)
    const endeA = k.a.werte[k.a.werte.length - 1]
    const endeB = k.b.werte[k.b.werte.length - 1]
    svg += `<circle cx="${X(endeB[0])}" cy="${Y(endeB[1])}" r="8" fill="${STIL.hellgrau}" stroke="#ffffff" stroke-width="3"/>`
    svg += `<circle cx="${X(endeA[0])}" cy="${Y(endeA[1])}" r="8" fill="${STIL.navy}" stroke="#ffffff" stroke-width="3"/>`
    for (const q of k.punkte ?? []) {
      const r = q.reihe === 'a' ? k.a : k.b
      const v = r.werte.find(([d]) => d === q.d)![1]
      svg += `<circle cx="${X(q.d)}" cy="${Y(v)}" r="7" fill="${q.reihe === 'a' ? STIL.navy : STIL.hellgrau}" stroke="#ffffff" stroke-width="3"/>`
    }
    svg += '</svg>'

    const klein = (text: string, stil: Record<string, string | number>): Element =>
      h(
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
    /* Die beiden Endwerte rechts der Linien; liegen sie zu dicht, auseinander. */
    let yA = Y(endeA[1]) - 14
    let yB = Y(endeB[1]) - 14
    if (Math.abs(yA - yB) < 34) {
      const mitte = (yA + yB) / 2
      const oberA = endeA[1] >= endeB[1]
      yA = mitte + (oberA ? -17 : 17)
      yB = mitte + (oberA ? 17 : -17)
    }
    const endung = k.endung ?? ''
    const j0 = new Date(t0).getUTCFullYear()
    const j1 = new Date(t1).getUTCFullYear()
    const jahre: number[] = []
    for (let j = j0 + 1; j <= j1; j++) jahre.push(j)
    const legende = (name: string, farbe: string, links_: number) => [
      h('div', {
        style: {
          position: 'absolute',
          top: oben - 92,
          left: links_,
          width: 34,
          height: 6,
          backgroundColor: farbe,
          borderRadius: 3,
        },
      }),
      klein(name, {
        top: oben - 106,
        left: links_ + 46,
        fontSize: 22,
        fontWeight: 700,
        color: farbe === STIL.navy ? STIL.navy : STIL.grau,
      }),
    ]
    return rahmen(k, logo, {
      seite: 1,
      seiten: 1,
      satz: k.satz,
      inhalt: [
        h('img', {
          src: svgAdresse(svg),
          width: ZK_BREITE,
          height: unten + 4,
          style: { position: 'absolute', top: 0, left: 0 },
        }),
        ...legende(k.a.name, STIL.navy, STIL_RAND),
        ...legende(k.b.name, STIL.hellgrau, STIL_RAND + 360),
        klein(k.einheit, {
          top: oben - 44,
          left: STIL_RAND,
          fontSize: 20,
          color: STIL.grau,
        }),
        ...ticks.map((v) => klein(zahl(v, 0), { top: Y(v) - 12, left: STIL_RAND })),
        ...jahre.map((j) =>
          klein(String(j), {
            top: unten + 10,
            left: X(`${j}-01-01`) - 30,
            width: 60,
            justifyContent: 'center',
          })
        ),
        ...(k.marke
          ? [
              klein(k.marke.text, {
                top: Y(k.marke.wert) - 32,
                left: links + 8,
                fontSize: 20,
                fontWeight: 700,
                color: STIL.tinte,
              }),
            ]
          : []),
        klein(`${zahl(endeA[1], k.stellen ?? 1)}${endung}`, {
          top: yA,
          left: X(endeA[0]) + 16,
          fontSize: 22,
          fontWeight: 700,
          color: STIL.navy,
        }),
        klein(`${zahl(endeB[1], k.stellen ?? 1)}${endung}`, {
          top: yB,
          left: X(endeB[0]) + 16,
          fontSize: 22,
          fontWeight: 700,
          color: STIL.grau,
        }),
        ...(k.punkte ?? []).map((q) => {
          const r = q.reihe === 'a' ? k.a : k.b
          const v = r.werte.find(([d]) => d === q.d)![1]
          const x = X(q.d)
          return klein(q.text, {
            top: Y(v) + (q.unten ? 16 : -44),
            left: x - 20,
            fontSize: 20,
            fontWeight: 700,
            color: q.reihe === 'a' ? STIL.navy : STIL.grau,
          })
        }),
      ],
    })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.a.werte.length < 10) f.push('Weniger als zehn Werte in der Reihe.')
    if (k.a.werte.length !== k.b.werte.length)
      f.push('Die beiden Reihen sind verschieden lang.')
    else if (k.a.werte.some(([d], i) => d !== k.b.werte[i][0]))
      f.push('Die beiden Reihen haben nicht dieselben Tage.')
    if ([...k.a.werte, ...k.b.werte].some(([, v]) => v < 0))
      f.push('Ein Wert ist negativ – die Achse beginnt bei null.')
    for (let i = 1; i < k.a.werte.length; i++)
      if (k.a.werte[i][0] <= k.a.werte[i - 1][0]) {
        f.push('Die Reihe ist nicht aufsteigend nach Tag.')
        break
      }
    for (const q of k.punkte ?? []) {
      const r = q.reihe === 'a' ? k.a : k.b
      if (!r.werte.some(([d]) => d === q.d))
        f.push(`Punkt ${q.d} steht nicht in der Reihe.`)
    }
    return f
  },
}
