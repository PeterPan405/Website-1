/**
 * Der Münzstapel (15.11.2026, Vorschlag 11): je Wert ein Stapel aus Münzen,
 * jede Münze eine feste Einheit („eine Münze = 50 Mrd. $“). Gerundet wird
 * auf ganze Münzen – die genaue Zahl steht unter dem Stapel. Der größte
 * Stapel ist Navy, die anderen grau.
 */
import { createElement as h } from 'react'

import { STIL, ZK_BREITE, svgAdresse } from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  UNTEN,
  pruefeGemeinsam,
  rahmen,
  type Art,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Stapelkarte extends NeuGemeinsam {
  art: 'stapel'
  /** Was eine Münze wert ist, als Zahl in der Einheit von `wert`. */
  einheit: number
  /** Wie die Einheit unter der Grafik steht: „1 Münze = 50 Mrd. $“. */
  legende: string
  stapel: { name: string; wert: number; anzeige: string }[]
}

export const muenzen = (k: Stapelkarte, wert: number) =>
  Math.max(1, Math.round(wert / k.einheit))

export const stapel: Art<Stapelkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const n = k.stapel.length
    const boden = UNTEN - 110
    const spalte = (ZK_BREITE - 120) / n
    const breite = Math.min(150, spalte - 30)
    const dicke = breite * 0.28
    const meiste = Math.max(...k.stapel.map((s) => muenzen(k, s.wert)))
    const schritt = Math.min(dicke * 0.75, (boden - OBEN_ERSTE - 110) / meiste)
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${boden + dicke}">`
    const groesster = k.stapel.reduce((a, b) => (b.wert > a.wert ? b : a))
    k.stapel.forEach((s, i) => {
      const cx = 60 + spalte * (i + 0.5)
      const [rand, flaeche] =
        s === groesster ? ['#0e1c52', STIL.navy] : ['#9aa3b1', '#c9cfd8']
      for (let m = 0; m < muenzen(k, s.wert); m++) {
        const y = boden - m * schritt
        svg += `<rect x="${cx - breite / 2}" y="${y - dicke / 2}" width="${breite}" height="${dicke / 2}" fill="${rand}"/>`
        svg += `<ellipse cx="${cx}" cy="${y}" rx="${breite / 2}" ry="${dicke / 2}" fill="${rand}"/>`
        svg += `<ellipse cx="${cx}" cy="${y - dicke / 2}" rx="${breite / 2}" ry="${dicke / 2}" fill="${flaeche}" stroke="${rand}" stroke-width="2"/>`
      }
    })
    svg += '</svg>'
    const unter = k.stapel.map((s, i) =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            top: boden + dicke / 2 + 18,
            left: 60 + spalte * i,
            width: spalte,
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
              fontWeight: 800,
              color: s === groesster ? STIL.navy : STIL.tinte,
            },
          },
          s.name
        ),
        h('div', { style: { fontSize: 21, marginTop: 4, color: STIL.grau } }, s.anzeige)
      )
    )
    return rahmen(k, logo, {
      seite: 1,
      seiten: 1,
      inhalt: [
        h('img', {
          src: svgAdresse(svg),
          width: ZK_BREITE,
          height: boden + dicke,
          style: { position: 'absolute', top: 0, left: 0 },
        }),
        h(
          'div',
          {
            style: {
              position: 'absolute',
              top: OBEN_ERSTE,
              right: 72,
              display: 'flex',
              fontFamily: 'Montserrat',
              fontSize: 20,
              color: STIL.grau,
            },
          },
          k.legende
        ),
        ...unter,
      ],
    })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.stapel.length < 2 || k.stapel.length > 6)
      f.push(`${k.stapel.length} Stapel – zwei bis sechs.`)
    const meiste = Math.max(...k.stapel.map((s) => muenzen(k, s.wert)))
    if (meiste > 30)
      f.push(`${meiste} Münzen im höchsten Stapel – höchstens 30, Einheit größer wählen.`)
    if (meiste < 3)
      f.push('Der höchste Stapel hat unter drei Münzen – Einheit kleiner wählen.')
    for (const s of k.stapel)
      if (Math.abs(muenzen(k, s.wert) * k.einheit - s.wert) / s.wert > 0.5)
        f.push(`${s.name}: die Münzen verfälschen den Wert um mehr als die Hälfte.`)
    return f
  },
}
