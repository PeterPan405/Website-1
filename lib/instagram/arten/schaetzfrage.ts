/**
 * Die Schätzfrage (15.11.2026, Vorschlag 10): ein Karussell, je Frage zwei
 * Seiten. Erst die Frage über einer leeren Skala („Was schätzt du?“), dann
 * dieselbe Skala mit der Antwort als Punkt und einem Satz dazu. Zum
 * Mitmachen, ohne Rätselkurve – die Skala ist die Grafik.
 */
import { createElement as h } from 'react'

import { STIL, STIL_RAND, ZK_BREITE, svgAdresse } from '../../instagram-zahlenkarte.ts'
import {
  OBEN_FOLGE,
  pruefeGemeinsam,
  rahmen,
  zahl,
  type Art,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Schaetzfragekarte extends NeuGemeinsam {
  art: 'schaetzfrage'
  fragen: {
    frage: string
    /** Skala: Anfang, Ende, Einheit, Abstand der Striche. */
    von: number
    bis: number
    schritt: number
    einheit: string
    antwort: number
    /** Wie die Antwort dasteht: „1.089 €“. */
    anzeige: string
    satz: string
  }[]
}

function skala(
  q: Schaetzfragekarte['fragen'][number],
  oben: number,
  mitAntwort: boolean
) {
  const links = STIL_RAND + 20
  const rechts = ZK_BREITE - STIL_RAND - 20
  const x = (v: number) => links + ((v - q.von) / (q.bis - q.von)) * (rechts - links)
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${oben + 140}">`
  svg += `<line x1="${links}" x2="${rechts}" y1="${oben + 60}" y2="${oben + 60}" stroke="${STIL.rand}" stroke-width="14" stroke-linecap="round"/>`
  const striche: number[] = []
  for (let v = q.von; v <= q.bis + 1e-9; v += q.schritt) {
    striche.push(v)
    svg += `<line x1="${x(v)}" x2="${x(v)}" y1="${oben + 44}" y2="${oben + 76}" stroke="${STIL.hellgrau}" stroke-width="3"/>`
  }
  if (mitAntwort) {
    svg += `<line x1="${links}" x2="${x(q.antwort)}" y1="${oben + 60}" y2="${oben + 60}" stroke="${STIL.navy}" stroke-width="14" stroke-linecap="round"/>`
    svg += `<circle cx="${x(q.antwort)}" cy="${oben + 60}" r="26" fill="${STIL.navy}" stroke="#ffffff" stroke-width="6"/>`
  } else {
    svg += `<circle cx="${(links + rechts) / 2}" cy="${oben + 60}" r="26" fill="#ffffff" stroke="${STIL.hellgrau}" stroke-width="5" stroke-dasharray="8 7"/>`
  }
  svg += '</svg>'
  return [
    h('img', {
      src: svgAdresse(svg),
      width: ZK_BREITE,
      height: oben + 140,
      style: { position: 'absolute', top: 0, left: 0 },
    }),
    ...striche.map((v) =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            top: oben + 96,
            left: x(v) - 70,
            width: 140,
            display: 'flex',
            justifyContent: 'center',
            fontFamily: 'Montserrat',
            fontSize: 20,
            color: STIL.hellgrau,
          },
        },
        `${zahl(v)} ${q.einheit}`
      )
    ),
    ...(mitAntwort
      ? [
          h(
            'div',
            {
              style: {
                position: 'absolute',
                top: oben - 30,
                left: Math.min(
                  Math.max(x(q.antwort) - 150, STIL_RAND),
                  ZK_BREITE - STIL_RAND - 300
                ),
                width: 300,
                display: 'flex',
                justifyContent: 'center',
                fontFamily: 'Montserrat',
                fontSize: 40,
                fontWeight: 800,
                color: STIL.navy,
              },
            },
            q.anzeige
          ),
        ]
      : []),
  ]
}

export const schaetzfrage: Art<Schaetzfragekarte> = {
  seiten: (k) => 2 * k.fragen.length,
  seite(k, logo, nr) {
    const q = k.fragen[Math.ceil(nr / 2) - 1]
    const aufloesung = nr % 2 === 0
    const erste = nr === 1
    const fragTop = erste ? 470 : OBEN_FOLGE + 20
    const frage = h(
      'div',
      {
        style: {
          position: 'absolute',
          top: fragTop,
          left: STIL_RAND,
          right: STIL_RAND,
          display: 'flex',
          fontFamily: 'Montserrat',
          fontSize: 40,
          fontWeight: 700,
          lineHeight: 1.3,
          color: STIL.tinte,
        },
      },
      q.frage
    )
    const skalaOben = fragTop + 330
    return rahmen(k, logo, {
      seite: nr,
      seiten: 2 * k.fragen.length,
      kopf: erste ? undefined : aufloesung ? 'Die Antwort' : 'Und das?',
      satz: aufloesung ? q.satz : 'Was schätzt du? Erst überlegen, dann wischen.',
      inhalt: [
        ...(aufloesung ? [] : [frage]),
        ...skala(q, skalaOben, aufloesung),
        ...(aufloesung ? [frage] : []),
      ],
    })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.fragen.length < 1 || k.fragen.length > 3)
      f.push(`${k.fragen.length} Fragen – eine bis drei.`)
    for (const [i, q] of k.fragen.entries()) {
      if (q.antwort < q.von || q.antwort > q.bis)
        f.push(`Frage ${i + 1}: Antwort liegt außerhalb der Skala.`)
      if (q.frage.length > 110)
        f.push(`Frage ${i + 1}: ${q.frage.length} Zeichen – höchstens 110.`)
      if (q.satz.length > 120)
        f.push(`Frage ${i + 1}: Satz hat ${q.satz.length} Zeichen – höchstens 120.`)
      if ((q.bis - q.von) / q.schritt > 10)
        f.push(`Frage ${i + 1}: mehr als zehn Striche.`)
    }
    return f
  },
}
