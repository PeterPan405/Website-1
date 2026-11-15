/**
 * Die Marktkarte (15.11.2026, Vorschlag 2, „Heatmap“): Kacheln, deren
 * Fläche dem Gewicht entspricht (etwa dem Börsenwert), gefärbt nach der
 * Veränderung – grün, rot, je kräftiger, desto größer. In der Kachel Name und
 * Veränderung. Aufgeteilt nach dem „Squarify“-Verfahren, damit die Kacheln
 * möglichst quadratisch bleiben.
 */
import { createElement as h } from 'react'

import { STIL, STIL_RAND, ZK_BREITE } from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  UNTEN,
  prozent,
  pruefeGemeinsam,
  rahmen,
  type Art,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Marktkartenkarte extends NeuGemeinsam {
  art: 'marktkarte'
  /** Absteigend nach Gewicht. */
  felder: { name: string; gewicht: number; aenderung: number }[]
}

interface Rechteck {
  x: number
  y: number
  b: number
  h: number
}

/** Squarify (Bruls, Huizing, van Wijk 2000) – Flächen proportional, Seiten möglichst gleich. */
export function aufteilen(werte: number[], r: Rechteck): Rechteck[] {
  const summe = werte.reduce((s, v) => s + v, 0)
  const flaechen = werte.map((v) => (v / summe) * r.b * r.h)
  const aus: Rechteck[] = []
  let rest = { ...r }
  let i = 0
  const schlechteste = (reihe: number[], seite: number) => {
    const s = reihe.reduce((a, b) => a + b, 0)
    return Math.max(
      ...reihe.map((f) =>
        Math.max((seite * seite * f) / (s * s), (s * s) / (seite * seite * f))
      )
    )
  }
  while (i < flaechen.length) {
    const seite = Math.min(rest.b, rest.h)
    const reihe = [flaechen[i]]
    let j = i + 1
    while (
      j < flaechen.length &&
      schlechteste([...reihe, flaechen[j]], seite) <= schlechteste(reihe, seite)
    ) {
      reihe.push(flaechen[j])
      j++
    }
    const s = reihe.reduce((a, b) => a + b, 0)
    if (rest.b >= rest.h) {
      const breite = s / rest.h
      let y = rest.y
      for (const f of reihe) {
        aus.push({ x: rest.x, y, b: breite, h: f / breite })
        y += f / breite
      }
      rest = { x: rest.x + breite, y: rest.y, b: rest.b - breite, h: rest.h }
    } else {
      const hoehe = s / rest.b
      let x = rest.x
      for (const f of reihe) {
        aus.push({ x, y: rest.y, b: f / hoehe, h: hoehe })
        x += f / hoehe
      }
      rest = { x: rest.x, y: rest.y + hoehe, b: rest.b, h: rest.h - hoehe }
    }
    i = j
  }
  return aus
}

function farbe(v: number): string {
  const s = Math.min(Math.abs(v) / 10, 1)
  const mische = (a: number[], b: number[]) =>
    `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * (0.3 + 0.7 * s))).join(',')})`
  return v >= 0
    ? mische([214, 232, 220], [32, 84, 55])
    : mische([240, 214, 214], [139, 34, 37])
}

export const marktkarte: Art<Marktkartenkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const flaeche = {
      x: STIL_RAND,
      y: OBEN_ERSTE + 20,
      b: ZK_BREITE - 2 * STIL_RAND,
      h: UNTEN - 20 - (OBEN_ERSTE + 20),
    }
    const teile = aufteilen(
      k.felder.map((f) => f.gewicht),
      flaeche
    )
    const inhalt = k.felder.map((f, i) => {
      const r = teile[i]
      const klein = Math.min(r.b, r.h) < 150
      /* Der Name muss in die Kachel passen – Montserrat 800 ist rund 0,7 em breit je Zeichen. */
      const namensgroesse = Math.max(
        14,
        Math.min(klein ? 20 : 30, (r.b - 20) / (0.7 * f.name.length))
      )
      const hell = Math.abs(f.aenderung) < 3
      return h(
        'div',
        {
          style: {
            position: 'absolute',
            left: r.x + 3,
            top: r.y + 3,
            width: r.b - 6,
            height: r.h - 6,
            borderRadius: 10,
            backgroundColor: farbe(f.aenderung),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Montserrat',
            color: hell ? STIL.tinte : '#ffffff',
          },
        },
        h('div', { style: { fontSize: namensgroesse, fontWeight: 800 } }, f.name),
        h(
          'div',
          { style: { fontSize: Math.min(klein ? 18 : 24, namensgroesse), marginTop: 4 } },
          prozent(f.aenderung)
        )
      )
    })
    return rahmen(k, logo, { seite: 1, seiten: 1, inhalt })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.felder.length < 4 || k.felder.length > 16)
      f.push(`${k.felder.length} Felder – vier bis sechzehn.`)
    for (let i = 1; i < k.felder.length; i++)
      if (k.felder[i].gewicht > k.felder[i - 1].gewicht)
        f.push('Die Felder stehen nicht absteigend nach Gewicht.')
    return f
  },
}
