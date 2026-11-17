/**
 * Die Linie (17.11.2026, für das Silber-Dossier): eine Kursreihe über lange
 * Zeit, mit waagerechten Marken (etwa einem alten Hoch) und beschrifteten
 * Punkten (Hoch, heute). Achsen mit Jahreszahlen und Werten. Eine Seite.
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
  UNTEN,
  pruefeGemeinsam,
  rahmen,
  zahl,
  type Art,
  type Element,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Linienkarte extends NeuGemeinsam {
  art: 'linie'
  reihe: readonly (readonly [string, number])[]
  einheit: string
  stellen?: number
  /** Waagerechte Linien, gestrichelt, mit Text links darüber. */
  marken?: { wert: number; text: string }[]
  /** Beschriftete Punkte; der Tag muss in der Reihe stehen. */
  punkte?: {
    d: string
    text: string
    farbe?: 'navy' | 'rot' | 'gruen'
    unten?: boolean
  }[]
}

export const wertAm = (k: Linienkarte, d: string) => k.reihe.find(([t]) => t === d)?.[1]

export const linie: Art<Linienkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const oben = OBEN_ERSTE + 40
    const unten = UNTEN - 80
    const links = STIL_RAND + 70
    const rechts = ZK_BREITE - STIL_RAND - 10
    const werte = k.reihe.map(([, v]) => v)
    const s = achsenschritt(Math.max(...werte), 5)
    const hoch = Math.ceil(Math.max(...werte) / s) * s
    const t0 = Date.parse(k.reihe[0][0])
    const t1 = Date.parse(k.reihe[k.reihe.length - 1][0])
    const X = (d: string) => links + ((Date.parse(d) - t0) / (t1 - t0)) * (rechts - links)
    const Y = (v: number) => unten - (v / hoch) * (unten - oben)
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${unten + 4}">`
    const ticks: number[] = []
    for (let v = 0; v <= hoch + 1e-9; v += s) {
      ticks.push(v)
      svg += `<line x1="${links}" x2="${rechts}" y1="${Y(v)}" y2="${Y(v)}" stroke="${v === 0 ? STIL.hellgrau : STIL.rand}" stroke-width="${v === 0 ? 2.5 : 1.5}"/>`
    }
    for (const m of k.marken ?? [])
      svg += `<line x1="${links}" x2="${rechts}" y1="${Y(m.wert)}" y2="${Y(m.wert)}" stroke="${STIL.rot}" stroke-width="2.5" stroke-dasharray="10 8"/>`
    svg += `<polyline fill="none" stroke="${STIL.navy}" stroke-width="3" stroke-linejoin="round" points="${k.reihe.map(([d, v]) => `${X(d).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')}"/>`
    const farbe = { navy: STIL.navy, rot: STIL.rot, gruen: STIL.gruen }
    for (const p of k.punkte ?? [])
      svg += `<circle cx="${X(p.d)}" cy="${Y(wertAm(k, p.d)!)}" r="10" fill="${farbe[p.farbe ?? 'navy']}" stroke="#ffffff" stroke-width="4"/>`
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
    const j0 = Number(k.reihe[0][0].slice(0, 4))
    const j1 = Number(k.reihe[k.reihe.length - 1][0].slice(0, 4))
    const jahre: number[] = []
    const abstand = Math.max(1, Math.ceil((j1 - j0) / 6))
    for (let j = Math.ceil((j0 + 1) / abstand) * abstand; j <= j1; j += abstand)
      jahre.push(j)
    return rahmen(k, logo, {
      seite: 1,
      seiten: 1,
      inhalt: [
        h('img', {
          src: svgAdresse(svg),
          width: ZK_BREITE,
          height: unten + 4,
          style: { position: 'absolute', top: 0, left: 0 },
        }),
        ...ticks.map((v) => klein(zahl(v), { top: Y(v) - 12, left: STIL_RAND })),
        ...jahre.map((j) =>
          klein(String(j), {
            top: unten + 10,
            left: X(`${j}-01-01`) - 30,
            width: 60,
            justifyContent: 'center',
          })
        ),
        klein(k.einheit, {
          top: oben - 44,
          left: STIL_RAND,
          fontSize: 20,
          color: STIL.grau,
        }),
        ...(k.marken ?? []).map((m) =>
          klein(m.text, {
            top: Y(m.wert) - 34,
            left: links + 8,
            fontSize: 20,
            fontWeight: 700,
            color: STIL.rot,
          })
        ),
        ...(k.punkte ?? []).map((p) => {
          const x = X(p.d)
          const rechtsBuendig = x > ZK_BREITE - 260
          return klein(p.text, {
            top: Y(wertAm(k, p.d)!) + (p.unten ? 18 : -46),
            ...(rechtsBuendig ? { right: ZK_BREITE - x + 4 } : { left: x - 20 }),
            fontSize: 20,
            fontWeight: 700,
            color: farbe[p.farbe ?? 'navy'],
          })
        }),
      ],
    })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.reihe.length < 10) f.push('Weniger als zehn Werte in der Reihe.')
    for (const p of k.punkte ?? [])
      if (wertAm(k, p.d) === undefined) f.push(`Punkt ${p.d} steht nicht in der Reihe.`)
    for (let i = 1; i < k.reihe.length; i++)
      if (k.reihe[i][0] <= k.reihe[i - 1][0]) {
        f.push('Die Reihe ist nicht aufsteigend nach Tag.')
        break
      }
    return f
  },
}
