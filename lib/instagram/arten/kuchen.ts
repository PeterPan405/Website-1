/**
 * Der Kuchen (18.11.2026, Euro-Index EXY): ein Ring aus zwei bis acht
 * Stücken, Winkel nach Anteil, daneben die Legende mit dem genauen Wert.
 * Betreiber zur ersten Fassung als Punktraster: „du brauchst das nicht mit
 * solchen Punkten machen, sondern einfach nur vielleicht mit einem
 * Kuchendiagramm … nicht immer die gleichen Muster“. Keine Zahl in der
 * Mitte des Rings – die Legende trägt die Werte.
 */
import { createElement as h } from 'react'

import { STIL, STIL_RAND, ZK_BREITE, svgAdresse } from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  OBEN_FOLGE,
  pruefeGemeinsam,
  rahmen,
  type Art,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Kuchenkarte extends NeuGemeinsam {
  art: 'kuchen'
  /** Größtes zuerst. `wert` bestimmt den Winkel, `anzeige` steht in der Legende. */
  stuecke: { name: string; wert: number; anzeige: string; zusatz?: string }[]
  /** Ein Satz unten auf der Seite. */
  satz?: string
}

/** Navy für das größte Stück, dann von dunkel nach hell. */
const FARBEN = [
  '#17296F',
  '#3f5196',
  '#5b6472',
  '#8a93a0',
  '#b7bec8',
  '#d3d8df',
  '#e4e7ec',
  '#eef0f3',
]

export const kuchen: Art<Kuchenkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const folge = ((k as { _dossier?: { seite: number } })._dossier?.seite ?? 1) > 1
    const oben = folge ? OBEN_FOLGE + 110 : OBEN_ERSTE + 20
    const r = 230
    const innen = 120
    const cx = ZK_BREITE / 2
    const cy = oben + r
    const summe = k.stuecke.reduce((s, t) => s + t.wert, 0)
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${cy + r + 4}">`
    let w = -Math.PI / 2
    k.stuecke.forEach((t, i) => {
      const w2 = w + (t.wert / summe) * 2 * Math.PI
      const p = (a: number, rr: number) =>
        `${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`
      const gross = w2 - w > Math.PI ? 1 : 0
      svg += `<path d="M${p(w, r)} A${r},${r} 0 ${gross} 1 ${p(w2, r)} L${p(w2, innen)} A${innen},${innen} 0 ${gross} 0 ${p(w, innen)} Z" fill="${FARBEN[i] ?? FARBEN.at(-1)}" stroke="#ffffff" stroke-width="4"/>`
      w = w2
    })
    svg += '</svg>'
    const legendeOben = cy + r + 50
    const legende = k.stuecke.map((t, i) =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            top: legendeOben + i * 46,
            left: STIL_RAND,
            right: STIL_RAND,
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'Montserrat',
          },
        },
        h('div', {
          style: {
            width: 22,
            height: 22,
            borderRadius: 5,
            backgroundColor: FARBEN[i] ?? FARBEN.at(-1)!,
            marginRight: 16,
          },
        }),
        h(
          'div',
          {
            style: {
              fontSize: 26,
              fontWeight: i === 0 ? 700 : 400,
              color: i === 0 ? STIL.navy : STIL.tinte,
              flexGrow: 1,
            },
          },
          t.zusatz ? `${t.name} · ${t.zusatz}` : t.name
        ),
        h(
          'div',
          { style: { fontSize: 26, fontWeight: 700, color: STIL.tinte } },
          t.anzeige
        )
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
          height: cy + r + 4,
          style: { position: 'absolute', top: 0, left: 0 },
        }),
        ...legende,
      ],
    })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.stuecke.length < 2 || k.stuecke.length > 8)
      f.push(`${k.stuecke.length} Stücke – zwei bis acht.`)
    if (k.stuecke.some((t) => !(t.wert > 0)))
      f.push('Jedes Stück braucht einen Wert über null.')
    for (let i = 1; i < k.stuecke.length; i++)
      if (k.stuecke[i].wert > k.stuecke[i - 1].wert) {
        f.push('Die Stücke stehen nicht absteigend – das größte zuerst.')
        break
      }
    return f
  },
}
