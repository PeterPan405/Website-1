/**
 * Damals und heute (15.11.2026, Vorschlag 6): je Zeile ein Wert an zwei
 * Tagen, als Hantel – grauer Punkt damals, Navy-Punkt heute, auf einer Spur,
 * die für jede Zeile bis zum größeren der beiden reicht. Rechts die
 * Veränderung. Keine Zeile braucht dieselbe Einheit wie die nächste.
 */
import { createElement as h } from 'react'

import {
  STIL,
  STIL_RAND,
  ZK_BREITE,
  stilFarbe,
  svgAdresse,
} from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  prozent,
  pruefeGemeinsam,
  rahmen,
  type Art,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Damalsheutekarte extends NeuGemeinsam {
  art: 'damalsheute'
  /** Die beiden Tage, wie sie über den Spalten stehen: „15.11.2021“. */
  damals: string
  heute: string
  zeilen: {
    name: string
    werte: [number, number]
    anzeige: [string, string]
  }[]
}

export const veraenderung = (z: { werte: [number, number] }) =>
  (z.werte[1] / z.werte[0] - 1) * 100

export const damalsheute: Art<Damalsheutekarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const links = STIL_RAND + 20
    const rechts = ZK_BREITE - STIL_RAND - 170
    const hoehe = Math.min(150, 700 / k.zeilen.length)
    const oben = OBEN_ERSTE + 60
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${oben + hoehe * k.zeilen.length}">`
    const texte: ReturnType<typeof h>[] = []
    k.zeilen.forEach((z, i) => {
      const y = oben + i * hoehe + 82
      const max = Math.max(...z.werte)
      const x = (v: number) => links + (v / max) * (rechts - links)
      const [a, b] = z.werte.map(x)
      svg += `<line x1="${links}" x2="${rechts}" y1="${y}" y2="${y}" stroke="${STIL.rand}" stroke-width="4" stroke-linecap="round"/>`
      svg += `<line x1="${a}" x2="${b}" y1="${y}" y2="${y}" stroke="${STIL.hellgrau}" stroke-width="8"/>`
      svg += `<circle cx="${a}" cy="${y}" r="13" fill="#ffffff" stroke="${STIL.hellgrau}" stroke-width="5"/>`
      svg += `<circle cx="${b}" cy="${y}" r="15" fill="${STIL.navy}"/>`
      const v = veraenderung(z)
      const schrift = {
        position: 'absolute',
        display: 'flex',
        fontFamily: 'Montserrat',
      } as const
      texte.push(
        h(
          'div',
          {
            style: {
              ...schrift,
              top: y - 72,
              left: STIL_RAND,
              fontSize: 28,
              fontWeight: 800,
              color: STIL.tinte,
            },
          },
          z.name
        ),
        h(
          'div',
          {
            style: {
              ...schrift,
              top: y - 68,
              left: STIL_RAND + 260,
              right: STIL_RAND + 170,
              justifyContent: 'flex-end',
              fontSize: 22,
              color: STIL.grau,
            },
          },
          `${z.anzeige[0]}  →  ${z.anzeige[1]}`
        ),
        h(
          'div',
          {
            style: {
              ...schrift,
              top: y - 16,
              right: STIL_RAND,
              width: 150,
              justifyContent: 'flex-end',
              fontSize: 26,
              fontWeight: 700,
              color: stilFarbe(v >= 0 ? 'steigt' : 'faellt'),
            },
          },
          prozent(v)
        )
      )
    })
    svg += '</svg>'
    const legende = h(
      'div',
      {
        style: {
          position: 'absolute',
          top: OBEN_ERSTE,
          left: STIL_RAND,
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'Montserrat',
          fontSize: 20,
          color: STIL.grau,
        },
      },
      h('div', {
        style: {
          width: 18,
          height: 18,
          borderRadius: 9,
          border: `4px solid ${STIL.hellgrau}`,
          marginRight: 10,
        },
      }),
      h('div', { style: { marginRight: 36 } }, k.damals),
      h('div', {
        style: {
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: STIL.navy,
          marginRight: 10,
        },
      }),
      h('div', {}, k.heute)
    )
    return rahmen(k, logo, {
      seite: 1,
      seiten: 1,
      inhalt: [
        h('img', {
          src: svgAdresse(svg),
          width: ZK_BREITE,
          height: oben + hoehe * k.zeilen.length,
          style: { position: 'absolute', top: 0, left: 0 },
        }),
        legende,
        ...texte,
      ],
    })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.zeilen.length < 3 || k.zeilen.length > 6)
      f.push(`${k.zeilen.length} Zeilen – drei bis sechs.`)
    for (const z of k.zeilen)
      if (z.werte.some((v) => !(v > 0))) f.push(`${z.name}: Werte müssen positiv sein.`)
    return f
  },
}
