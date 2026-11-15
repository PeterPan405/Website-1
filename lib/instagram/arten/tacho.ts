/**
 * Der Tacho (15.11.2026, Vorschlag 6): ein Halbkreis von einem Ende zum
 * anderen – Tief und Hoch, null und Ziel –, darauf die Nadel beim heutigen
 * Wert. Wo die Nadel steht, sieht man, bevor man eine Zahl liest.
 */
import { createElement as h } from 'react'

import { STIL, ZK_BREITE, svgAdresse } from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  pruefeGemeinsam,
  rahmen,
  type Art,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Tachokarte extends NeuGemeinsam {
  art: 'tacho'
  von: { wert: number; zahl: string; text: string }
  bis: { wert: number; zahl: string; text: string }
  ist: { wert: number; zahl: string; text: string }
  /** Der Satz unten. */
  satz?: string
}

export const tacho: Art<Tachokarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const r = 380
    const cx = ZK_BREITE / 2
    const cy = OBEN_ERSTE + 80 + r
    const anteil = Math.min(
      1,
      Math.max(0, (k.ist.wert - k.von.wert) / (k.bis.wert - k.von.wert))
    )
    const winkel = Math.PI * (1 - anteil)
    const punkt = (w: number, rr: number) => [
      cx + rr * Math.cos(w),
      cy - rr * Math.sin(w),
    ]
    const [ax, ay] = punkt(Math.PI, r)
    const [bx, by] = punkt(0, r)
    const [ix, iy] = punkt(winkel, r)
    const [nx, ny] = punkt(winkel, r - 70)
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${cy + 40}">` +
      `<path d="M${ax} ${ay} A${r} ${r} 0 0 1 ${bx} ${by}" fill="none" stroke="${STIL.rand}" stroke-width="44" stroke-linecap="round"/>` +
      `<path d="M${ax} ${ay} A${r} ${r} 0 0 1 ${ix} ${iy}" fill="none" stroke="${STIL.navy}" stroke-width="44" stroke-linecap="round"/>` +
      `<line x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}" stroke="${STIL.tinte}" stroke-width="8" stroke-linecap="round"/>` +
      `<circle cx="${cx}" cy="${cy}" r="18" fill="${STIL.tinte}"/>` +
      `</svg>`
    const schild = (
      x: number,
      top: number,
      z: { zahl: string; text: string },
      ausrichtung: 'flex-start' | 'center' | 'flex-end',
      gross = false
    ) =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            top,
            left:
              ausrichtung === 'flex-start'
                ? x
                : ausrichtung === 'center'
                  ? x - 250
                  : x - 500,
            width: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: ausrichtung,
            fontFamily: 'Montserrat',
          },
        },
        h(
          'div',
          {
            style: {
              fontSize: gross ? 44 : 28,
              fontWeight: 700,
              color: gross ? STIL.navy : STIL.tinte,
            },
          },
          z.zahl
        ),
        h(
          'div',
          {
            style: {
              fontSize: gross ? 24 : 20,
              color: STIL.grau,
              marginTop: 4,
              textAlign:
                ausrichtung === 'center'
                  ? 'center'
                  : ausrichtung === 'flex-end'
                    ? 'right'
                    : 'left',
            },
          },
          z.text
        )
      )
    return rahmen(k, logo, {
      seite: 1,
      seiten: 1,
      satz: k.satz,
      inhalt: [
        h('img', {
          src: svgAdresse(svg),
          width: ZK_BREITE,
          height: cy + 40,
          style: { position: 'absolute', top: 0, left: 0 },
        }),
        schild(ax - 22, cy + 46, k.von, 'flex-start'),
        schild(bx + 22, cy + 46, k.bis, 'flex-end'),
        schild(cx, cy + 46, k.ist, 'center', true),
      ],
    })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (!(k.von.wert < k.bis.wert)) f.push('„von“ muss kleiner sein als „bis“.')
    if (k.ist.wert < k.von.wert || k.ist.wert > k.bis.wert)
      f.push('Der heutige Wert liegt außerhalb der Skala.')
    return f
  },
}
