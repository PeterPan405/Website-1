/**
 * Der Rangwechsel (15.11.2026, Vorschlag 5, „Bump-Chart“): Wer liegt wann
 * auf Platz 1, 2, 3 … – je Name eine Linie durch die Plätze, Zeitpunkt für
 * Zeitpunkt. Die Plätze werden aus den Werten gerechnet, nicht eingetragen.
 * Eine Linie (die erste) in Navy, die anderen grau; die Namen stehen rechts
 * am Ende, in der Reihenfolge des letzten Zeitpunkts.
 */
import { createElement as h } from 'react'

import { STIL, STIL_RAND, ZK_BREITE, svgAdresse } from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  UNTEN,
  pruefeGemeinsam,
  rahmen,
  type Art,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Rangwechselkarte extends NeuGemeinsam {
  art: 'rangwechsel'
  /** Beschriftung der Zeitpunkte: „Jan.“ … */
  zeitpunkte: string[]
  /** Je Name ein Wert je Zeitpunkt – der höchste ist Platz 1. Die erste Reihe ist die Pointe. */
  reihen: { name: string; werte: number[] }[]
}

/** Platz je Reihe und Zeitpunkt, 1 = höchster Wert. */
export function plaetze(k: Rangwechselkarte): number[][] {
  return k.reihen.map((r) =>
    r.werte.map((v, t) => 1 + k.reihen.filter((a) => a.werte[t] > v).length)
  )
}

export const rangwechsel: Art<Rangwechselkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const p = plaetze(k)
    const n = k.reihen.length
    const oben = OBEN_ERSTE + 40
    const unten = UNTEN - 60
    const links = STIL_RAND + 40
    const rechts = ZK_BREITE - STIL_RAND - 230
    const x = (t: number) => links + (t / (k.zeitpunkte.length - 1)) * (rechts - links)
    const y = (platz: number) => oben + ((platz - 1) / (n - 1)) * (unten - oben)
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${unten + 30}">`
    /* Erst die grauen, dann die Pointe obenauf. */
    for (const i of [...k.reihen.keys()].reverse()) {
      const farbe = i === 0 ? STIL.navy : '#b7bec8'
      const breite = i === 0 ? 9 : 5
      svg += `<path d="${p[i].map((pl, t) => `${t ? 'L' : 'M'}${x(t)} ${y(pl)}`).join(' ')}" fill="none" stroke="${farbe}" stroke-width="${breite}" stroke-linejoin="round" stroke-linecap="round"/>`
      for (const [t, pl] of p[i].entries())
        svg += `<circle cx="${x(t)}" cy="${y(pl)}" r="${i === 0 ? 12 : 8}" fill="${farbe}"/>`
    }
    svg += '</svg>'
    const namen = k.reihen.map((r, i) =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            top: y(p[i].at(-1)!) - 17,
            left: rechts + 26,
            display: 'flex',
            fontFamily: 'Montserrat',
            fontSize: 26,
            fontWeight: i === 0 ? 800 : 400,
            color: i === 0 ? STIL.navy : STIL.grau,
          },
        },
        `${p[i].at(-1)}. ${r.name}`
      )
    )
    const achse = k.zeitpunkte.map((z, t) =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            top: unten + 34,
            left: x(t) - 50,
            width: 100,
            display: 'flex',
            justifyContent: 'center',
            fontFamily: 'Montserrat',
            fontSize: 19,
            color: STIL.hellgrau,
          },
        },
        z
      )
    )
    const plaetzeLinks = Array.from({ length: n }, (_, i) =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            top: y(i + 1) - 13,
            left: STIL_RAND - 10,
            fontFamily: 'Montserrat',
            fontSize: 19,
            color: STIL.hellgrau,
          },
        },
        `${i + 1}.`
      )
    )
    return rahmen(k, logo, {
      seite: 1,
      seiten: 1,
      inhalt: [
        h('img', {
          src: svgAdresse(svg),
          width: ZK_BREITE,
          height: unten + 30,
          style: { position: 'absolute', top: 0, left: 0 },
        }),
        ...plaetzeLinks,
        ...namen,
        ...achse,
      ],
    })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.reihen.length < 3 || k.reihen.length > 7)
      f.push(`${k.reihen.length} Reihen – drei bis sieben.`)
    if (k.zeitpunkte.length < 3 || k.zeitpunkte.length > 13)
      f.push(`${k.zeitpunkte.length} Zeitpunkte – drei bis dreizehn.`)
    if (k.reihen.some((r) => r.werte.length !== k.zeitpunkte.length))
      f.push('Jede Reihe braucht einen Wert je Zeitpunkt.')
    for (let t = 0; t < k.zeitpunkte.length; t++) {
      const v = k.reihen.map((r) => r.werte[t])
      if (new Set(v).size !== v.length) f.push(`Gleichstand bei „${k.zeitpunkte[t]}“.`)
    }
    return f
  },
}
