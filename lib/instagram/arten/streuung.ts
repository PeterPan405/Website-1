/**
 * Das Streudiagramm (15.11.2026, Vorschlag 14): jedes Unternehmen ein Punkt
 * in zwei Achsen – etwa Bewertung (x) gegen Kursentwicklung (y). Feine
 * Linien teilen in vier Felder, an jedem Punkt der Name. Eine Achse darf
 * negativ werden; die Nulllinie ist dann kräftiger.
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
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Streuungkarte extends NeuGemeinsam {
  art: 'streuung'
  x: { name: string; einheit: string }
  y: { name: string; einheit: string }
  punkte: { name: string; x: number; y: number }[]
  /** Name des hervorgehobenen Punkts (Navy). */
  hervor?: string
}

function bereich(werte: number[]) {
  const tief = Math.min(0, ...werte)
  const hoch = Math.max(...werte)
  const s = achsenschritt(hoch - tief, 4)
  return { a: Math.floor(tief / s) * s, b: Math.ceil(hoch / s) * s, s }
}

export const streuung: Art<Streuungkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const bx = bereich(k.punkte.map((p) => p.x))
    const by = bereich(k.punkte.map((p) => p.y))
    const links = STIL_RAND + 80
    const rechts = ZK_BREITE - STIL_RAND - 20
    const oben = OBEN_ERSTE + 40
    const unten = UNTEN - 90
    const X = (v: number) => links + ((v - bx.a) / (bx.b - bx.a)) * (rechts - links)
    const Y = (v: number) => unten - ((v - by.a) / (by.b - by.a)) * (unten - oben)
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${unten + 4}">`
    const tx: number[] = []
    const ty: number[] = []
    for (let v = bx.a; v <= bx.b + 1e-9; v += bx.s) {
      tx.push(v)
      svg += `<line x1="${X(v)}" x2="${X(v)}" y1="${oben}" y2="${unten}" stroke="${STIL.rand}" stroke-width="1.5"/>`
    }
    for (let v = by.a; v <= by.b + 1e-9; v += by.s) {
      ty.push(v)
      svg += `<line x1="${links}" x2="${rechts}" y1="${Y(v)}" y2="${Y(v)}" stroke="${v === 0 ? STIL.hellgrau : STIL.rand}" stroke-width="${v === 0 ? 3 : 1.5}"/>`
    }
    for (const p of k.punkte) {
      const navy = p.name === k.hervor
      svg += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="${navy ? 16 : 12}" fill="${navy ? STIL.navy : STIL.grau}"/>`
    }
    svg += '</svg>'
    const klein = (inhalt: string, stil: Record<string, string | number>) =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            display: 'flex',
            fontFamily: 'Montserrat',
            fontSize: 17,
            color: STIL.hellgrau,
            ...stil,
          },
        },
        inhalt
      )
    const inhalt = [
      h('img', {
        src: svgAdresse(svg),
        width: ZK_BREITE,
        height: unten + 4,
        style: { position: 'absolute', top: 0, left: 0 },
      }),
      ...tx.map((v) =>
        klein(`${zahl(v)}${k.x.einheit}`, {
          top: unten + 10,
          left: X(v) - 40,
          width: 80,
          justifyContent: 'center',
        })
      ),
      ...ty.map((v) =>
        klein(`${zahl(v)}${k.y.einheit}`, { top: Y(v) - 12, left: STIL_RAND })
      ),
      klein(`${k.x.name} →`, {
        top: unten + 40,
        right: STIL_RAND,
        fontSize: 20,
        color: STIL.grau,
      }),
      klein(`↑ ${k.y.name}`, {
        top: oben - 44,
        left: STIL_RAND,
        fontSize: 20,
        color: STIL.grau,
      }),
      ...k.punkte.map((p) => {
        const navy = p.name === k.hervor
        const nachLinks = X(p.x) > rechts - 170
        return h(
          'div',
          {
            style: {
              position: 'absolute',
              top: Y(p.y) - 16,
              left: nachLinks ? X(p.x) - 200 - 22 : X(p.x) + 22,
              width: 200,
              display: 'flex',
              justifyContent: nachLinks ? 'flex-end' : 'flex-start',
              fontFamily: 'Montserrat',
              fontSize: 24,
              fontWeight: navy ? 800 : 700,
              color: navy ? STIL.navy : STIL.tinte,
            },
          },
          p.name
        )
      }),
    ]
    return rahmen(k, logo, { seite: 1, seiten: 1, inhalt })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.punkte.length < 4 || k.punkte.length > 10)
      f.push(`${k.punkte.length} Punkte – vier bis zehn.`)
    if (k.hervor && !k.punkte.some((p) => p.name === k.hervor))
      f.push(`Hervorgehoben ist „${k.hervor}“, aber kein Punkt heißt so.`)
    return f
  },
}
