/**
 * Der Größenvergleich (15.11.2026, Vorschlag 7): Kreise, deren **Fläche**
 * dem Wert entspricht – nicht der Durchmesser, sonst wirkt das Doppelte wie
 * das Vierfache. In bis zu zwei Reihen, der größte zuerst, darunter Name und
 * Betrag.
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
} from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  UNTEN,
  pruefeGemeinsam,
  rahmen,
  type Art,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Kreiskarte extends NeuGemeinsam {
  art: 'kreise'
  /** Absteigend. Der erste ist die Pointe (Navy). */
  kreise: { name: string; wert: number; anzeige: string; logo?: string }[]
}

export const kreise: Art<Kreiskarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const n = k.kreise.length
    const reihen = n > 3 ? 2 : 1
    const jeReihe = Math.ceil(n / reihen)
    const breite = ZK_BREITE - 2 * STIL_RAND
    const platzH = (UNTEN - OBEN_ERSTE - 20) / reihen - 90
    const groesster = Math.sqrt(k.kreise[0].wert)
    /* Maßstab: die breiteste Reihe passt in die Breite, der größte Kreis in die Höhe. */
    const reihenSummen = Array.from({ length: reihen }, (_, r) =>
      k.kreise
        .slice(r * jeReihe, (r + 1) * jeReihe)
        .reduce((s, x) => s + 2 * Math.sqrt(x.wert), 0)
    )
    const s = Math.min(
      (breite - 30 * (jeReihe - 1)) / Math.max(...reihenSummen),
      platzH / (2 * groesster)
    )
    const inhalt = k.kreise.flatMap((kr, i) => {
      const r = Math.floor(i / jeReihe)
      const inReihe = k.kreise.slice(r * jeReihe, (r + 1) * jeReihe)
      const gesamt =
        inReihe.reduce((t, x) => t + 2 * Math.sqrt(x.wert) * s, 0) +
        30 * (inReihe.length - 1)
      let x = STIL_RAND + (breite - gesamt) / 2
      for (const v of inReihe.slice(0, i - r * jeReihe))
        x += 2 * Math.sqrt(v.wert) * s + 30
      const d = 2 * Math.sqrt(kr.wert) * s
      const grundlinie = OBEN_ERSTE + 20 + (r + 1) * (platzH + 90) - 90
      const logoH = Math.min(d * 0.28, 60)
      return [
        h(
          'div',
          {
            style: {
              position: 'absolute',
              top: grundlinie - d,
              left: x,
              width: d,
              height: d,
              borderRadius: d,
              backgroundColor: i === 0 ? STIL.navy : '#e9ecf1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          },
          /*
            Im Navy-Kreis der Pointe und ohne Logo steht der Name selbst –
            ein leerer Kreis sagt nichts.
          */
          ...(kr.logo && i > 0 && d > 70
            ? [
                h('img', {
                  src: logoAdresse(kr.logo),
                  height: logoH,
                  width: Math.min(d * 0.7, Math.round(logoH * logoVerhaeltnis(kr.logo))),
                  style: { objectFit: 'contain' },
                }),
              ]
            : d > 70
              ? [
                  h(
                    'div',
                    {
                      style: {
                        fontFamily: 'Montserrat',
                        fontWeight: 800,
                        fontSize: Math.min(44, d * 0.2),
                        color: i === 0 ? '#ffffff' : STIL.tinte,
                      },
                    },
                    kr.name
                  ),
                ]
              : [])
        ),
        h(
          'div',
          {
            style: {
              position: 'absolute',
              top: grundlinie + 10,
              left: x + d / 2 - 110,
              width: 220,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontFamily: 'Montserrat',
            },
          },
          h(
            'div',
            {
              style: {
                fontSize: 24,
                fontWeight: 700,
                color: i === 0 ? STIL.navy : STIL.tinte,
              },
            },
            kr.name
          ),
          h('div', { style: { fontSize: 20, color: STIL.grau } }, kr.anzeige)
        ),
      ]
    })
    return rahmen(k, logo, { seite: 1, seiten: 1, inhalt })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.kreise.length < 2 || k.kreise.length > 6)
      f.push(`${k.kreise.length} Kreise – zwei bis sechs.`)
    for (let i = 1; i < k.kreise.length; i++)
      if (k.kreise[i].wert > k.kreise[i - 1].wert)
        f.push('Die Kreise stehen nicht absteigend.')
    for (const kr of k.kreise)
      if (kr.logo && !existsSync(join(LOGO_ORDNER, kr.logo)))
        f.push(`Logo „${kr.logo}" fehlt in lib/instagram/logos/.`)
    return f
  },
}
