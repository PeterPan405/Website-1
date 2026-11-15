/**
 * Das Netz (15.11.2026, Vorschlag 16, „Radar“): zwei Unternehmen auf fünf
 * bis sechs Achsen übereinander. Jede Achse ist auf den größeren der beiden
 * Werte gestreckt (der füllt sie ganz) – das Netz vergleicht, es misst
 * nicht absolut. An jeder Achse stehen deshalb beide echten Zahlen.
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

export interface Netzkarte extends NeuGemeinsam {
  art: 'netz'
  /** Genau zwei; der erste in Navy. */
  namen: [string, string]
  achsen: { name: string; werte: [number, number]; anzeige: [string, string] }[]
}

export const netz: Art<Netzkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const n = k.achsen.length
    const cx = ZK_BREITE / 2
    const r = 265
    const cy = OBEN_ERSTE + 110 + r
    const w = (i: number) => -Math.PI / 2 + (2 * Math.PI * i) / n
    const p = (i: number, anteil: number) => [
      cx + r * anteil * Math.cos(w(i)),
      cy + r * anteil * Math.sin(w(i)),
    ]
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${cy + r + 20}">`
    for (const ring of [0.25, 0.5, 0.75, 1])
      svg += `<polygon points="${k.achsen.map((_, i) => p(i, ring).join(',')).join(' ')}" fill="none" stroke="${STIL.rand}" stroke-width="1.5"/>`
    for (let i = 0; i < n; i++)
      svg += `<line x1="${cx}" y1="${cy}" x2="${p(i, 1)[0]}" y2="${p(i, 1)[1]}" stroke="${STIL.rand}" stroke-width="1.5"/>`
    for (const j of [1, 0]) {
      const farbe = j === 0 ? STIL.navy : STIL.hellgrau
      const pts = k.achsen
        .map((a, i) =>
          p(
            i,
            Math.max(0, a.werte[j]) / Math.max(...a.werte.map((v) => Math.abs(v)))
          ).join(',')
        )
        .join(' ')
      svg += `<polygon points="${pts}" fill="${farbe}" fill-opacity="${j === 0 ? 0.22 : 0.18}" stroke="${farbe}" stroke-width="${j === 0 ? 5 : 4}" stroke-linejoin="round"/>`
    }
    svg += '</svg>'
    const schilder = k.achsen.map((a, i) => {
      const [x, y] = p(i, 1.18)
      const links = Math.cos(w(i)) < -0.2
      const rechts = Math.cos(w(i)) > 0.2
      return h(
        'div',
        {
          style: {
            position: 'absolute',
            top: y - 40,
            left: links ? x - 240 : rechts ? x : x - 120,
            width: 240,
            display: 'flex',
            flexDirection: 'column',
            alignItems: links ? 'flex-end' : rechts ? 'flex-start' : 'center',
            fontFamily: 'Montserrat',
          },
        },
        h('div', { style: { fontSize: 21, color: STIL.grau } }, a.name),
        h(
          'div',
          { style: { display: 'flex', fontSize: 22, fontWeight: 700 } },
          h('div', { style: { color: STIL.navy } }, a.anzeige[0]),
          h('div', { style: { color: STIL.hellgrau, marginLeft: 10 } }, a.anzeige[1])
        )
      )
    })
    const legende = h(
      'div',
      {
        style: {
          position: 'absolute',
          top: cy + r + 105,
          left: 0,
          width: ZK_BREITE,
          display: 'flex',
          justifyContent: 'center',
          fontFamily: 'Montserrat',
          fontSize: 26,
          fontWeight: 700,
        },
      },
      ...k.namen.map((name, j) =>
        h(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              marginRight: j === 0 ? 40 : 0,
            },
          },
          h('div', {
            style: {
              width: 20,
              height: 20,
              borderRadius: 20,
              marginRight: 12,
              backgroundColor: j === 0 ? STIL.navy : STIL.hellgrau,
            },
          }),
          h('div', { style: { color: j === 0 ? STIL.navy : STIL.hellgrau } }, name)
        )
      )
    )
    return rahmen(k, logo, {
      seite: 1,
      seiten: 1,
      inhalt: [
        h('img', {
          src: svgAdresse(svg),
          width: ZK_BREITE,
          height: cy + r + 20,
          style: { position: 'absolute', top: 0, left: 0 },
        }),
        ...schilder,
        legende,
      ],
    })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.achsen.length < 5 || k.achsen.length > 6)
      f.push(`${k.achsen.length} Achsen – fünf oder sechs.`)
    if (k.achsen.some((a) => a.werte.every((v) => v <= 0)))
      f.push('Eine Achse ohne positiven Wert lässt sich nicht strecken.')
    return f
  },
}
