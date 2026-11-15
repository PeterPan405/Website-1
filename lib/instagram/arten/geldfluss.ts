/**
 * Der Geldfluss (15.11.2026, Vorschlag 1): ein Sankey – links ein breites
 * Band (etwa der Umsatz), das sich nach rechts in seine Teile aufspaltet
 * (Gewinn, Kosten …). Die Breite ist der Betrag. Die Teile müssen das Ganze
 * genau ergeben; das prüft die Karte.
 */
import { createElement as h } from 'react'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

import {
  LOGO_ORDNER,
  STIL,
  STIL_RAND,
  ZK_BREITE,
  logoAdresse,
  logoVerhaeltnis,
  svgAdresse,
} from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  UNTEN,
  pruefeGemeinsam,
  rahmen,
  type Art,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Geldflusskarte extends NeuGemeinsam {
  art: 'geldfluss'
  quelle: { name: string; wert: number; anzeige: string; logo?: string }
  /** Zusammen genau `quelle.wert`. Der erste ist die Pointe (Navy). */
  ziele: { name: string; wert: number; anzeige: string }[]
}

export const geldfluss: Art<Geldflusskarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const oben = OBEN_ERSTE + 70
    const unten = UNTEN - 30
    const luecke = 40
    const hoehe = unten - oben - luecke * (k.ziele.length - 1)
    const s = hoehe / k.quelle.wert
    const knoten = 26
    const xl = STIL_RAND
    const xr = ZK_BREITE - STIL_RAND - 330
    const farben = [STIL.navy, '#8a93a0', '#b7bec8', '#dde1e7']
    const quelleH = k.quelle.wert * s
    const quelleO = oben + (unten - oben - quelleH) / 2
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${unten + 10}">`
    svg += `<rect x="${xl}" y="${quelleO}" width="${knoten}" height="${quelleH}" rx="4" fill="${STIL.tinte}"/>`
    let links = quelleO
    let rechts = oben
    const ziele = k.ziele.map((z, i) => {
      const dicke = z.wert * s
      const a1 = links
      const b1 = rechts
      const mx = (xl + knoten + xr) / 2
      svg +=
        `<path d="M${xl + knoten} ${a1} C${mx} ${a1} ${mx} ${b1} ${xr} ${b1} L${xr} ${b1 + dicke} C${mx} ${b1 + dicke} ${mx} ${a1 + dicke} ${xl + knoten} ${a1 + dicke} Z" fill="${farben[i] ?? farben.at(-1)}" opacity="0.35"/>` +
        `<rect x="${xr}" y="${b1}" width="${knoten}" height="${Math.max(dicke, 3)}" rx="4" fill="${farben[i] ?? farben.at(-1)}"/>`
      links += dicke
      rechts += dicke + luecke
      return { z, mitte: b1 + dicke / 2, i }
    })
    svg += '</svg>'
    const schilder = ziele.map(({ z, mitte, i }) =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            top: mitte - 36,
            left: xr + knoten + 20,
            width: 300,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Montserrat',
          },
        },
        h(
          'div',
          {
            style: {
              fontSize: 30,
              fontWeight: 700,
              color: i === 0 ? STIL.navy : STIL.tinte,
            },
          },
          z.anzeige
        ),
        h(
          'div',
          { style: { fontSize: 21, color: STIL.grau, marginTop: 2 } },
          `${z.name} · ${Math.round((z.wert / k.quelle.wert) * 100)} %`
        )
      )
    )
    const quelle = h(
      'div',
      {
        style: {
          position: 'absolute',
          top: quelleO - 100,
          left: xl,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Montserrat',
        },
      },
      ...(k.quelle.logo
        ? [
            h('img', {
              src: logoAdresse(k.quelle.logo),
              height: 40,
              width: Math.round(40 * logoVerhaeltnis(k.quelle.logo)),
              style: { marginBottom: 6 },
            }),
          ]
        : []),
      h(
        'div',
        { style: { fontSize: 24, color: STIL.grau } },
        `${k.quelle.name}: ${k.quelle.anzeige}`
      )
    )
    return rahmen(k, logo, {
      seite: 1,
      seiten: 1,
      inhalt: [
        h('img', {
          src: svgAdresse(svg),
          width: ZK_BREITE,
          height: unten + 10,
          style: { position: 'absolute', top: 0, left: 0 },
        }),
        quelle,
        ...schilder,
      ],
    })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    const summe = k.ziele.reduce((s, z) => s + z.wert, 0)
    if (Math.abs(summe - k.quelle.wert) > k.quelle.wert * 1e-9)
      f.push(`Die Teile ergeben ${summe}, das Ganze ist ${k.quelle.wert}.`)
    if (k.ziele.length < 2 || k.ziele.length > 4)
      f.push(`${k.ziele.length} Teile – zwei bis vier.`)
    if (k.ziele.some((z) => z.wert <= 0)) f.push('Jeder Teil muss größer als null sein.')
    if (k.quelle.logo && !existsSync(join(LOGO_ORDNER, k.quelle.logo)))
      f.push(`Logo „${k.quelle.logo}" fehlt in lib/instagram/logos/.`)
    return f
  },
}
