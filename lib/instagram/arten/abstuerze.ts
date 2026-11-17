/**
 * Die Abstürze (17.11.2026, für das Silber-Dossier): je Zeile ein Absturz vom
 * Hoch zum Tief – Jahr, Kurs von → bis, Rückgang in Prozent als roter Balken
 * und die Dauer in Tagen. Ein laufender Absturz ist blass und heißt „bisher“.
 * Rückgang und Tage rechnet die Karte selbst.
 */
import { createElement as h } from 'react'

import { STIL, STIL_RAND, ZK_BREITE } from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  UNTEN,
  pruefeGemeinsam,
  rahmen,
  zahl,
  type Art,
  type Element,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Absturzkarte extends NeuGemeinsam {
  art: 'abstuerze'
  einheit: string
  stellen?: number
  zeilen: {
    name: string
    hoch: [string, number]
    tief: [string, number]
    laufend?: boolean
    /** Ist das Hoch nur als Untergrenze bekannt („über 50 $“), steht „mind.“ vor dem Rückgang. */
    mindestens?: boolean
    /** Statt der gerechneten Tage, wenn ein Tag nicht bekannt ist („Jan. bis 27. März“). */
    dauerText?: string
    /** Statt des Hochkurses („über 50“). */
    hochText?: string
  }[]
  /** Satz unten auf der Seite. */
  satz?: string
}

export const rueckgang = (z: Absturzkarte['zeilen'][number]) =>
  (z.tief[1] / z.hoch[1] - 1) * 100
export const dauer = (z: Absturzkarte['zeilen'][number]) =>
  Math.round((Date.parse(z.tief[0]) - Date.parse(z.hoch[0])) / 86400000)

const pz = (v: number) =>
  `${v < 0 ? '−' : '+'}${Math.abs(v).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`

export const abstuerze: Art<Absturzkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const oben = OBEN_ERSTE + 30
    const abstand = Math.min(190, (UNTEN - 120 - oben) / k.zeilen.length)
    const links = STIL_RAND
    const breite = ZK_BREITE - 2 * STIL_RAND - 330
    const max = Math.max(...k.zeilen.map((z) => Math.abs(rueckgang(z))))
    const st = k.stellen ?? 2
    const aus: Element[] = []
    k.zeilen.forEach((z, i) => {
      const y = oben + i * abstand
      const r = rueckgang(z)
      const b = (Math.abs(r) / max) * breite
      aus.push(
        h(
          'div',
          {
            style: {
              position: 'absolute',
              top: y,
              left: links,
              right: STIL_RAND,
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'Montserrat',
            },
          },
          h(
            'div',
            {
              style: {
                fontSize: 26,
                fontWeight: 800,
                color: z.laufend ? STIL.navy : STIL.tinte,
              },
            },
            z.name
          ),
          h(
            'div',
            { style: { fontSize: 20, color: STIL.grau } },
            `${z.hochText ?? zahl(z.hoch[1], st)} → ${zahl(z.tief[1], st)} ${k.einheit}${z.laufend ? ' (Tief bisher)' : ''}`
          )
        ),
        h('div', {
          style: {
            position: 'absolute',
            top: y + 46,
            left: links,
            width: b,
            height: 46,
            borderRadius: 8,
            backgroundColor: STIL.rot,
            opacity: z.laufend ? 0.55 : 1,
          },
        }),
        h(
          'div',
          {
            style: {
              position: 'absolute',
              top: y + 50,
              left: links + b + 16,
              display: 'flex',
              alignItems: 'baseline',
              fontFamily: 'Montserrat',
            },
          },
          h(
            'div',
            { style: { fontSize: 30, fontWeight: 700, color: STIL.rot } },
            `${z.mindestens ? 'mind. ' : ''}${pz(r)}${z.laufend ? ' bisher' : ''}`
          ),
          h(
            'div',
            { style: { fontSize: 19, color: STIL.grau, marginLeft: 12 } },
            z.dauerText ?? `${zahl(dauer(z))} Tage`
          )
        )
      )
    })
    return rahmen(k, logo, { seite: 1, seiten: 1, satz: k.satz, inhalt: aus })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.zeilen.length < 2 || k.zeilen.length > 5)
      f.push(`${k.zeilen.length} Zeilen – zwei bis fünf.`)
    for (const z of k.zeilen) {
      if (!(z.tief[1] < z.hoch[1])) f.push(`${z.name}: Tief liegt nicht unter dem Hoch.`)
      if (z.tief[0] <= z.hoch[0]) f.push(`${z.name}: Tief liegt nicht nach dem Hoch.`)
    }
    if (k.zeilen.slice(0, -1).some((z) => z.laufend))
      f.push('Nur die letzte Zeile darf noch laufen.')
    return f
  },
}
