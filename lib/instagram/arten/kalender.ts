/**
 * Der Jahreskalender (15.11.2026, Vorschlag 3): jeder Handelstag ein
 * Kästchen, je Monat eine Zeile – grün im Plus, rot im Minus, kräftiger, je
 * größer die Bewegung. Unten zählt ein Satz die Tage; gerechnet, nicht
 * eingetragen.
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
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Kalenderkarte extends NeuGemeinsam {
  art: 'kalender'
  /** Je Handelstag die Veränderung zum Vortag in Prozent, alt nach neu. */
  tage: { t: string; wert: number }[]
}

const MONATE = [
  'Jan.',
  'Feb.',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'Aug.',
  'Sept.',
  'Okt.',
  'Nov.',
  'Dez.',
]

/** Grün oder Rot, von blass (kleine Bewegung) bis satt (ab 2 %). */
function farbe(wert: number): string {
  const s = Math.min(Math.abs(wert) / 2, 1)
  const mische = (a: number[], b: number[]) =>
    `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * (0.25 + 0.75 * s))).join(',')})`
  return wert >= 0
    ? mische([232, 240, 234], [32, 84, 55])
    : mische([244, 230, 230], [139, 34, 37])
}

export function zaehleTage(k: Kalenderkarte) {
  return {
    plus: k.tage.filter((d) => d.wert > 0).length,
    minus: k.tage.filter((d) => d.wert < 0).length,
  }
}

export const kalender: Art<Kalenderkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const monate = [...new Set(k.tage.map((d) => d.t.slice(0, 7)))]
    const oben = OBEN_ERSTE + 10
    const reihe = Math.min(60, Math.floor((UNTEN - 60 - oben) / monate.length))
    const kasten = reihe - 12
    const links = STIL_RAND + 96
    const spalte = Math.min(kasten + 6, Math.floor((ZK_BREITE - STIL_RAND - links) / 23))
    const inhalt = monate.flatMap((m, r) => {
      const tage = k.tage.filter((d) => d.t.startsWith(m))
      return [
        h(
          'div',
          {
            style: {
              position: 'absolute',
              top: oben + r * reihe + (kasten - 22) / 2,
              left: STIL_RAND,
              fontFamily: 'Montserrat',
              fontSize: 20,
              color: STIL.grau,
            },
          },
          MONATE[Number(m.slice(5, 7)) - 1]
        ),
        ...tage.map((d, i) =>
          h('div', {
            style: {
              position: 'absolute',
              top: oben + r * reihe,
              left: links + i * spalte,
              width: spalte - 6,
              height: kasten,
              borderRadius: 6,
              backgroundColor: farbe(d.wert),
            },
          })
        ),
      ]
    })
    const { plus, minus } = zaehleTage(k)
    return rahmen(k, logo, {
      seite: 1,
      seiten: 1,
      inhalt,
      satz: `${zahl(plus)} Tage im Plus, ${zahl(minus)} im Minus.`,
    })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    const monate = new Set(k.tage.map((d) => d.t.slice(0, 7)))
    if (monate.size < 3 || monate.size > 12)
      f.push(`${monate.size} Monate – drei bis zwölf.`)
    for (const m of monate)
      if (k.tage.filter((d) => d.t.startsWith(m)).length > 23)
        f.push(`${m}: mehr als 23 Handelstage.`)
    return f
  },
}
