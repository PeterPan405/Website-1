/**
 * Der Wasserfall (15.11.2026, Vorschlag 11): vom Anfang zum Ende in
 * Schritten – jeder Balken beginnt, wo der vorige aufhörte, grün nach oben,
 * rot nach unten. Anfang und Ende stehen dunkel auf dem Boden. Das Ende wird
 * gerechnet, nicht eingetragen.
 */
import { createElement as h } from 'react'

import { STIL, STIL_RAND, ZK_BREITE, svgAdresse } from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  UNTEN,
  pruefeGemeinsam,
  rahmen,
  zahl,
  type Art,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Wasserfallkarte extends NeuGemeinsam {
  art: 'wasserfall'
  start: { name: string; wert: number }
  schritte: { name: string; wert: number }[]
  /** Name des Endbalkens: „13.11.“ */
  ende: string
  /** Nachkommastellen der Beschriftung. */
  stellen?: number
  /** Unteres Ende der Achse – sonst null; bei Indexständen nahe am Tief. */
  boden?: number
}

export function wasserfallEnde(k: Wasserfallkarte): number {
  return k.start.wert + k.schritte.reduce((s, x) => s + x.wert, 0)
}

export const wasserfall: Art<Wasserfallkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const stellen = k.stellen ?? 0
    const ende = wasserfallEnde(k)
    const stufen: {
      name: string
      von: number
      bis: number
      art: 'basis' | 'plus' | 'minus'
    }[] = [{ name: k.start.name, von: k.boden ?? 0, bis: k.start.wert, art: 'basis' }]
    let stand = k.start.wert
    for (const s of k.schritte) {
      stufen.push({
        name: s.name,
        von: stand,
        bis: stand + s.wert,
        art: s.wert >= 0 ? 'plus' : 'minus',
      })
      stand += s.wert
    }
    stufen.push({ name: k.ende, von: k.boden ?? 0, bis: ende, art: 'basis' })
    const werte = stufen.flatMap((s) => [s.von, s.bis])
    const tief = k.boden ?? Math.min(0, ...werte)
    const hoch = Math.max(...werte)
    const oben = OBEN_ERSTE + 60
    const unten = UNTEN - 70
    const y = (v: number) => unten - ((v - tief) / (hoch - tief)) * (unten - oben)
    const breite = ZK_BREITE - 2 * STIL_RAND
    const fach = breite / stufen.length
    const balken = Math.min(70, fach * 0.66)
    const farbe = { basis: STIL.tinte, plus: STIL.gruen, minus: STIL.rot }
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${unten + 4}">`
    stufen.forEach((s, i) => {
      const x = STIL_RAND + i * fach + (fach - balken) / 2
      const a = y(Math.max(s.von, s.bis))
      const b = y(Math.min(s.von, s.bis))
      svg += `<rect x="${x}" y="${a}" width="${balken}" height="${Math.max(3, b - a)}" rx="4" fill="${farbe[s.art]}"/>`
      if (i < stufen.length - 1) {
        const yy = y(s.bis)
        svg += `<line x1="${x + balken}" x2="${x + fach}" y1="${yy}" y2="${yy}" stroke="${STIL.hellgrau}" stroke-width="2" stroke-dasharray="4 4"/>`
      }
    })
    svg += `<line x1="${STIL_RAND}" x2="${ZK_BREITE - STIL_RAND}" y1="${unten}" y2="${unten}" stroke="${STIL.rand}" stroke-width="2"/></svg>`
    const beschriftung = stufen.flatMap((s, i) => {
      const mitte = STIL_RAND + i * fach + fach / 2
      const wert =
        s.art === 'basis'
          ? zahl(s.bis, stellen)
          : `${s.bis >= s.von ? '+' : '−'}${zahl(Math.abs(s.bis - s.von), stellen)}`
      return [
        h(
          'div',
          {
            style: {
              position: 'absolute',
              top: y(Math.max(s.von, s.bis)) - 34,
              left: mitte - 70,
              width: 140,
              display: 'flex',
              justifyContent: 'center',
              fontFamily: 'Montserrat',
              fontSize: stufen.length > 10 ? 17 : 21,
              fontWeight: 700,
              color: farbe[s.art],
            },
          },
          wert
        ),
        h(
          'div',
          {
            style: {
              position: 'absolute',
              top: unten + 12,
              left: mitte - 60,
              width: 120,
              display: 'flex',
              justifyContent: 'center',
              fontFamily: 'Montserrat',
              fontSize: stufen.length > 10 ? 17 : 20,
              color: s.art === 'basis' ? STIL.tinte : STIL.grau,
              fontWeight: s.art === 'basis' ? 700 : 400,
            },
          },
          s.name
        ),
      ]
    })
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
        ...beschriftung,
      ],
    })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.schritte.length < 2 || k.schritte.length > 12)
      f.push(`${k.schritte.length} Schritte – zwei bis zwölf.`)
    if (k.boden !== undefined && k.boden > Math.min(k.start.wert, wasserfallEnde(k)))
      f.push('Der Boden liegt über Anfang oder Ende.')
    return f
  },
}
