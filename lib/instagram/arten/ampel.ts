/**
 * Die Ampel (15.11.2026, Vorschlag 17): eine Liste, je Zeile eine kleine
 * Ampel – grün, gelb oder rot nach einer **genannten** Regel (etwa die
 * Maastricht-Grenze von 60 %). Die Regel steht in `regel` und wird geprüft:
 * Die Farbe folgt aus dem Wert, nicht aus dem Gefühl.
 */
import { createElement as h } from 'react'

import { STIL, STIL_RAND, ZK_BREITE } from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  UNTEN,
  pruefeGemeinsam,
  rahmen,
  type Art,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Ampelkarte extends NeuGemeinsam {
  art: 'ampel'
  /** Grün bis `gruenBis`, gelb bis `gelbBis`, darüber rot (oder umgekehrt mit `hochIstGut`). */
  regel: { gruenBis: number; gelbBis: number; hochIstGut?: boolean }
  zeilen: { name: string; wert: number; anzeige: string; zusatz?: string }[]
}

const LICHT = { gruen: '#2e7d4f', gelb: '#d9a514', rot: '#b3261e' }

export function ampelFarbe(k: Ampelkarte, wert: number): 'gruen' | 'gelb' | 'rot' {
  const v = k.regel.hochIstGut ? -wert : wert
  const g = k.regel.hochIstGut ? -k.regel.gruenBis : k.regel.gruenBis
  const y = k.regel.hochIstGut ? -k.regel.gelbBis : k.regel.gelbBis
  return v <= g ? 'gruen' : v <= y ? 'gelb' : 'rot'
}

export const ampel: Art<Ampelkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const oben = OBEN_ERSTE + 10
    const hoehe = Math.min(96, Math.floor((UNTEN - oben) / k.zeilen.length))
    const inhalt = k.zeilen.map((z, i) => {
      const an = ampelFarbe(k, z.wert)
      const lampe = (farbe: 'gruen' | 'gelb' | 'rot') =>
        h('div', {
          style: {
            width: 22,
            height: 22,
            borderRadius: 22,
            marginRight: 6,
            backgroundColor: an === farbe ? LICHT[farbe] : '#eceef2',
          },
        })
      return h(
        'div',
        {
          style: {
            position: 'absolute',
            top: oben + i * hoehe,
            left: STIL_RAND,
            width: ZK_BREITE - 2 * STIL_RAND,
            height: hoehe,
            display: 'flex',
            alignItems: 'center',
            borderBottom: `1.5px solid ${STIL.rand}`,
            fontFamily: 'Montserrat',
          },
        },
        h(
          'div',
          {
            style: {
              display: 'flex',
              padding: '8px 10px',
              borderRadius: 24,
              backgroundColor: '#f6f7f9',
              marginRight: 26,
            },
          },
          lampe('rot'),
          lampe('gelb'),
          lampe('gruen')
        ),
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', flexGrow: 1 } },
          h(
            'div',
            { style: { fontSize: 29, fontWeight: 700, color: STIL.tinte } },
            z.name
          ),
          ...(z.zusatz
            ? [h('div', { style: { fontSize: 19, color: STIL.hellgrau } }, z.zusatz)]
            : [])
        ),
        h(
          'div',
          { style: { fontSize: 28, fontWeight: 700, color: LICHT[an] } },
          z.anzeige
        )
      )
    })
    return rahmen(k, logo, { seite: 1, seiten: 1, inhalt })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.zeilen.length < 3 || k.zeilen.length > 9)
      f.push(`${k.zeilen.length} Zeilen – drei bis neun.`)
    if (
      k.regel.hochIstGut
        ? k.regel.gelbBis > k.regel.gruenBis
        : k.regel.gelbBis < k.regel.gruenBis
    )
      f.push('Die Regel ist verdreht: gelb muss hinter grün liegen.')
    return f
  },
}
