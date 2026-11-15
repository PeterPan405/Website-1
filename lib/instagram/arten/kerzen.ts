/**
 * Kerzen (15.11.2026, Vorschlag 15): je Woche eine Kerze – Körper vom
 * ersten zum letzten Schlusskurs der Woche, Docht vom tiefsten zum höchsten.
 * Grün, wenn die Woche höher schloss, rot, wenn tiefer. Eine Kerze kann
 * markiert werden, mit Anlass. Gebaut aus Tagesschlusskursen – der Bestand
 * hat keine Eröffnungs- und Tageshochs; das steht in der Fußzeile.
 */
import { createElement as h } from 'react'

import {
  STIL,
  STIL_RAND,
  ZK_BREITE,
  achsenschritt,
  svgAdresse,
} from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  UNTEN,
  pruefeGemeinsam,
  rahmen,
  zahl,
  type Art,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Kerzenkarte extends NeuGemeinsam {
  art: 'kerzen'
  einheit: string
  kerzen: { name: string; auf: number; zu: number; hoch: number; tief: number }[]
  /** Stelle der markierten Kerze und ihr Anlass. */
  marke?: { bei: number; text: string }
}

/** Wochenkerzen aus Tagesschlusskursen (Woche = Montag bis Freitag). */
export function wochenkerzen(punkte: { d: string; c: number }[]) {
  const wochen = new Map<string, { d: string; c: number }[]>()
  for (const p of punkte) {
    const t = new Date(`${p.d}T12:00:00Z`)
    t.setUTCDate(t.getUTCDate() - ((t.getUTCDay() + 6) % 7))
    const montag = t.toISOString().slice(0, 10)
    wochen.set(montag, [...(wochen.get(montag) ?? []), p])
  }
  return [...wochen.entries()].map(([montag, tage]) => ({
    montag,
    auf: tage[0].c,
    zu: tage.at(-1)!.c,
    hoch: Math.max(...tage.map((x) => x.c)),
    tief: Math.min(...tage.map((x) => x.c)),
  }))
}

export const kerzen: Art<Kerzenkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const tief = Math.min(...k.kerzen.map((x) => x.tief))
    const hoch = Math.max(...k.kerzen.map((x) => x.hoch))
    const schritt = achsenschritt(hoch - tief, 4)
    const a = Math.floor(tief / schritt) * schritt
    const b = Math.ceil(hoch / schritt) * schritt
    const oben = OBEN_ERSTE + 70
    const unten = UNTEN - 60
    const links = STIL_RAND + 90
    const breite = ZK_BREITE - STIL_RAND - links
    const fach = breite / k.kerzen.length
    const koerper = Math.min(40, fach * 0.6)
    const y = (v: number) => unten - ((v - a) / (b - a)) * (unten - oben)
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${unten + 4}">`
    const striche: number[] = []
    for (let v = a; v <= b + 1e-9; v += schritt) {
      striche.push(v)
      svg += `<line x1="${links}" x2="${ZK_BREITE - STIL_RAND}" y1="${y(v)}" y2="${y(v)}" stroke="${STIL.rand}" stroke-width="1.5"/>`
    }
    k.kerzen.forEach((c, i) => {
      const mx = links + i * fach + fach / 2
      const farbe = c.zu >= c.auf ? STIL.gruen : STIL.rot
      if (k.marke?.bei === i)
        svg += `<rect x="${mx - fach / 2 + 2}" y="${oben - 10}" width="${fach - 4}" height="${unten - oben + 10}" rx="8" fill="#eef1f8"/>`
      svg +=
        `<line x1="${mx}" x2="${mx}" y1="${y(c.hoch)}" y2="${y(c.tief)}" stroke="${farbe}" stroke-width="3"/>` +
        `<rect x="${mx - koerper / 2}" y="${y(Math.max(c.auf, c.zu))}" width="${koerper}" height="${Math.max(3, Math.abs(y(c.auf) - y(c.zu)))}" rx="3" fill="${farbe}"/>`
    })
    svg += '</svg>'
    const beschriftung = [
      ...striche.map((v) =>
        h(
          'div',
          {
            style: {
              position: 'absolute',
              top: y(v) - 12,
              left: STIL_RAND,
              fontFamily: 'Montserrat',
              fontSize: 17,
              color: STIL.hellgrau,
            },
          },
          `${zahl(v)} ${k.einheit}`
        )
      ),
      ...k.kerzen.map((c, i) =>
        i % Math.ceil(k.kerzen.length / 6) === 0 || i === k.kerzen.length - 1
          ? h(
              'div',
              {
                style: {
                  position: 'absolute',
                  top: unten + 12,
                  left: links + i * fach + fach / 2 - 50,
                  width: 100,
                  display: 'flex',
                  justifyContent: 'center',
                  fontFamily: 'Montserrat',
                  fontSize: 18,
                  color: STIL.hellgrau,
                },
              },
              c.name
            )
          : h('div', {})
      ),
      ...(k.marke
        ? [
            h(
              'div',
              {
                style: {
                  position: 'absolute',
                  top: oben - 52,
                  left: Math.min(
                    links + k.marke.bei * fach + fach / 2 - 160,
                    ZK_BREITE - STIL_RAND - 320
                  ),
                  width: 320,
                  display: 'flex',
                  justifyContent: 'center',
                  fontFamily: 'Montserrat',
                  fontSize: 21,
                  fontWeight: 700,
                  color: STIL.navy,
                },
              },
              k.marke.text
            ),
          ]
        : []),
    ]
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
    if (k.kerzen.length < 6 || k.kerzen.length > 30)
      f.push(`${k.kerzen.length} Kerzen – sechs bis dreißig.`)
    for (const c of k.kerzen)
      if (c.hoch < Math.max(c.auf, c.zu) || c.tief > Math.min(c.auf, c.zu))
        f.push(`Kerze „${c.name}“: Docht kürzer als Körper.`)
    if (k.marke && (k.marke.bei < 0 || k.marke.bei >= k.kerzen.length))
      f.push('Die Marke liegt außerhalb der Kerzen.')
    return f
  },
}
