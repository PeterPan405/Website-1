/**
 * Die Zeitkapsel (15.11.2026, Vorschlag 13): ein Karussell, jede Seite ein
 * Stichtag. Der Verlauf ist bis zu diesem Tag gezeichnet, danach nichts –
 * wer wischt, reist durch die Jahre. Achsen bleiben über alle Seiten gleich,
 * damit man die Seiten vergleichen kann. Wert und Veränderung zum vorigen
 * Stichtag rechnet die Karte selbst aus der Reihe.
 */
import { createElement as h } from 'react'

import {
  STIL,
  STIL_RAND,
  ZK_BREITE,
  achsenschritt,
  stilFarbe,
  svgAdresse,
} from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  OBEN_FOLGE,
  prozent,
  pruefeGemeinsam,
  rahmen,
  zahl,
  type Art,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Zeitkapselkarte extends NeuGemeinsam {
  art: 'zeitkapsel'
  /** Verlauf als [Tag, Wert], aufsteigend. */
  reihe: [string, number][]
  /** Stichtage, je einer pro Seite; jeder muss in `reihe` vorkommen. */
  stichtage: string[]
  einheit: string
  stellen?: number
}

export const wertAm = (k: Zeitkapselkarte, tag: string) =>
  k.reihe.find(([d]) => d === tag)?.[1]

const tagText = (d: string) => `${d.slice(8, 10)}.${d.slice(5, 7)}.${d.slice(0, 4)}`

export const zeitkapsel: Art<Zeitkapselkarte> = {
  seiten: (k) => k.stichtage.length,
  seite(k, logo, nr) {
    const tag = k.stichtage[nr - 1]
    const wert = wertAm(k, tag)!
    const vorher = nr > 1 ? wertAm(k, k.stichtage[nr - 2]) : undefined
    const oben = (nr === 1 ? OBEN_ERSTE : OBEN_FOLGE) + 150
    const unten = 1350 - 220
    const links = STIL_RAND + 90
    const rechts = ZK_BREITE - STIL_RAND - 10
    const werte = k.reihe.map(([, v]) => v)
    const s = achsenschritt(Math.max(...werte), 4)
    const hoch = Math.ceil(Math.max(...werte) / s) * s
    const t0 = Date.parse(k.reihe[0][0])
    const t1 = Date.parse(k.reihe.at(-1)![0])
    const X = (d: string) => links + ((Date.parse(d) - t0) / (t1 - t0)) * (rechts - links)
    const Y = (v: number) => unten - (v / hoch) * (unten - oben)
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${unten + 4}">`
    const ticks: number[] = []
    for (let v = 0; v <= hoch + 1e-9; v += s) {
      ticks.push(v)
      svg += `<line x1="${links}" x2="${rechts}" y1="${Y(v)}" y2="${Y(v)}" stroke="${v === 0 ? STIL.hellgrau : STIL.rand}" stroke-width="${v === 0 ? 3 : 1.5}"/>`
    }
    const bis = k.reihe.filter(([d]) => d <= tag)
    svg += `<polyline fill="none" stroke="${STIL.navy}" stroke-width="5" stroke-linejoin="round" points="${bis.map(([d, v]) => `${X(d)},${Y(v)}`).join(' ')}"/>`
    for (const st of k.stichtage.slice(0, nr - 1))
      svg += `<circle cx="${X(st)}" cy="${Y(wertAm(k, st)!)}" r="8" fill="${STIL.hellgrau}"/>`
    svg += `<circle cx="${X(tag)}" cy="${Y(wert)}" r="14" fill="${STIL.navy}" stroke="#ffffff" stroke-width="5"/>`
    svg += '</svg>'
    const jahre: string[] = []
    for (
      let j = Number(k.reihe[0][0].slice(0, 4)) + 1;
      j <= Number(k.reihe.at(-1)![0].slice(0, 4));
      j++
    )
      jahre.push(`${j}-01-01`)
    const klein = (text: string, stil: Record<string, string | number>) =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            display: 'flex',
            fontFamily: 'Montserrat',
            fontSize: 18,
            color: STIL.hellgrau,
            ...stil,
          },
        },
        text
      )
    const wertText = `${zahl(wert, k.stellen ?? 0)} ${k.einheit}`
    const aenderung = vorher !== undefined ? (wert / vorher - 1) * 100 : undefined
    return rahmen(k, logo, {
      seite: nr,
      seiten: k.stichtage.length,
      kopf: nr === 1 ? undefined : tagText(tag),
      satz:
        aenderung === undefined
          ? `Am ${tagText(tag)}: ${wertText}.`
          : `${wertText}, ${prozent(aenderung)} gegenüber dem ${tagText(k.stichtage[nr - 2])}.`,
      inhalt: [
        h('img', {
          src: svgAdresse(svg),
          width: ZK_BREITE,
          height: unten + 4,
          style: { position: 'absolute', top: 0, left: 0 },
        }),
        ...ticks.map((v) => klein(`${zahl(v)}`, { top: Y(v) - 12, left: STIL_RAND })),
        ...jahre.map((d) =>
          klein(d.slice(0, 4), {
            top: unten + 14,
            left: X(d) - 30,
            width: 60,
            justifyContent: 'center',
          })
        ),
        klein(k.einheit, {
          top: oben - 44,
          left: STIL_RAND,
          fontSize: 20,
          color: STIL.grau,
        }),
        h(
          'div',
          {
            style: {
              position: 'absolute',
              top: oben - 70,
              right: STIL_RAND,
              display: 'flex',
              alignItems: 'baseline',
              fontFamily: 'Montserrat',
            },
          },
          h(
            'div',
            { style: { fontSize: 34, fontWeight: 700, color: STIL.navy } },
            wertText
          ),
          ...(aenderung !== undefined
            ? [
                h(
                  'div',
                  {
                    style: {
                      fontSize: 24,
                      fontWeight: 700,
                      marginLeft: 16,
                      color: stilFarbe(aenderung >= 0 ? 'steigt' : 'faellt'),
                    },
                  },
                  prozent(aenderung)
                ),
              ]
            : [])
        ),
      ],
    })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.stichtage.length < 3 || k.stichtage.length > 8)
      f.push(`${k.stichtage.length} Stichtage – drei bis acht.`)
    for (const t of k.stichtage)
      if (wertAm(k, t) === undefined) f.push(`Stichtag ${t} steht nicht in der Reihe.`)
    for (let i = 1; i < k.reihe.length; i++)
      if (k.reihe[i][0] <= k.reihe[i - 1][0]) {
        f.push('Die Reihe ist nicht aufsteigend nach Tag.')
        break
      }
    if (k.reihe.some(([, v]) => v < 0))
      f.push('Negative Werte – dafür ist die Achse nicht gebaut.')
    return f
  },
}
