/**
 * Die Weltuhr (15.11.2026, Vorschlag 9): ein 24-Stunden-Ring in deutscher
 * Zeit. Jede Börse ein Bogen auf ihrer eigenen Spur, von der Eröffnung bis
 * zum Schluss; Termine des Tages als Punkte am Rand. Oben ist Mitternacht.
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

export interface Weltuhrkarte extends NeuGemeinsam {
  art: 'weltuhr'
  /** Von außen nach innen. „09:00“ bis „17:30“ deutscher Zeit; die erste in Navy. */
  boersen: { name: string; von: string; bis: string }[]
  /** Optional: Termine als Punkte am äußeren Rand. */
  termine?: { um: string; text: string }[]
}

export const minuten = (hhmm: string) => {
  const [a, b] = hhmm.split(':').map(Number)
  return a * 60 + b
}

export const weltuhr: Art<Weltuhrkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const cx = ZK_BREITE / 2
    const R = 330
    const cy = OBEN_ERSTE + 50 + R
    const spur = 44
    const w = (min: number) => (min / 1440) * 2 * Math.PI - Math.PI / 2
    const pt = (min: number, r: number) => [
      cx + r * Math.cos(w(min)),
      cy + r * Math.sin(w(min)),
    ]
    const farben = [STIL.navy, '#5b6472', '#8a93a0', '#b7bec8', '#cdd2da']
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${cy + R + 60}">`
    svg += `<circle cx="${cx}" cy="${cy}" r="${R + 26}" fill="none" stroke="${STIL.rand}" stroke-width="2"/>`
    for (let std = 0; std < 24; std++) {
      const [a1, b1] = pt(std * 60, R + 26)
      const [a2, b2] = pt(std * 60, R + (std % 6 === 0 ? 46 : 36))
      svg += `<line x1="${a1}" y1="${b1}" x2="${a2}" y2="${b2}" stroke="${STIL.hellgrau}" stroke-width="${std % 6 === 0 ? 3 : 1.5}"/>`
    }
    k.boersen.forEach((b, i) => {
      const r = R - i * (spur + 12)
      const v = minuten(b.von)
      const z = minuten(b.bis)
      const [x1, y1] = pt(v, r)
      const [x2, y2] = pt(z, r)
      const gross = (z - v + 1440) % 1440 > 720 ? 1 : 0
      svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#f1f3f6" stroke-width="${spur}"/>`
      svg += `<path d="M${x1} ${y1} A${r} ${r} 0 ${gross} 1 ${x2} ${y2}" fill="none" stroke="${farben[i] ?? farben.at(-1)}" stroke-width="${spur}" stroke-linecap="round"/>`
    })
    for (const t of k.termine ?? []) {
      const [x, y] = pt(minuten(t.um), R + 26)
      svg += `<circle cx="${x}" cy="${y}" r="11" fill="${STIL.rot}"/>`
    }
    svg += '</svg>'
    const stunde = (std: number, text: string) => {
      const [x, y] = pt(std * 60, R + 80)
      return h(
        'div',
        {
          style: {
            position: 'absolute',
            top: y - 14,
            left: x - 40,
            width: 80,
            display: 'flex',
            justifyContent: 'center',
            fontFamily: 'Montserrat',
            fontSize: 22,
            fontWeight: 700,
            color: STIL.grau,
          },
        },
        text
      )
    }
    const legende = k.boersen.map((b, i) =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            top: cy - (k.boersen.length * 34) / 2 + i * 34,
            left: cx - 120,
            width: 240,
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'Montserrat',
            fontSize: 18,
            color: i === 0 ? STIL.navy : STIL.grau,
            fontWeight: i === 0 ? 700 : 400,
          },
        },
        h('div', {}, b.name),
        h('div', {}, `${b.von}–${b.bis}`)
      )
    )
    return rahmen(k, logo, {
      seite: 1,
      seiten: 1,
      satz: k.termine?.length
        ? k.termine.map((t) => `${t.um} ${t.text}`).join(' · ')
        : undefined,
      inhalt: [
        h('img', {
          src: svgAdresse(svg),
          width: ZK_BREITE,
          height: cy + R + 60,
          style: { position: 'absolute', top: 0, left: 0 },
        }),
        stunde(0, '0 Uhr'),
        stunde(6, '6'),
        stunde(12, '12'),
        stunde(18, '18'),
        ...legende,
      ],
    })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.boersen.length < 2 || k.boersen.length > 5)
      f.push(`${k.boersen.length} Börsen – zwei bis fünf.`)
    const uhr = /^([01]\d|2[0-3]):[0-5]\d$/
    for (const b of k.boersen)
      if (!uhr.test(b.von) || !uhr.test(b.bis)) f.push(`${b.name}: Zeit nicht als HH:MM.`)
    return f
  },
}
