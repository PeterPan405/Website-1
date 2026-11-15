/**
 * Der Stammbaum (15.11.2026, Vorschlag 12): eine Wurzel oben, darunter zwei
 * bis vier Äste, an jedem Ast eine Liste von Blättern – mit Logo, wenn eins
 * im Ordner liegt. Für Konzerne und ihre Teile ebenso wie für Gruppen, die
 * sich aus Zahlen ergeben (Klassen nach Börsenwert, Branchen).
 */
import { createElement as h } from 'react'

import {
  STIL,
  STIL_RAND,
  ZK_BREITE,
  logoAdresse,
  svgAdresse,
} from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  pruefeGemeinsam,
  rahmen,
  type Art,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Stammbaumkarte extends NeuGemeinsam {
  art: 'stammbaum'
  wurzel: string
  aeste: { name: string; zusatz?: string; blaetter: { name: string; logo?: string }[] }[]
}

export const stammbaum: Art<Stammbaumkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const n = k.aeste.length
    const spalte = (ZK_BREITE - 2 * STIL_RAND) / n
    const wurzelY = OBEN_ERSTE + 10
    const astY = wurzelY + 160
    const blattY = astY + 140
    const mitte = (i: number) => STIL_RAND + spalte * (i + 0.5)
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${blattY}">`
    const knick = wurzelY + 110
    svg += `<line x1="${ZK_BREITE / 2}" x2="${ZK_BREITE / 2}" y1="${wurzelY + 70}" y2="${knick}" stroke="${STIL.hellgrau}" stroke-width="3"/>`
    svg += `<line x1="${mitte(0)}" x2="${mitte(n - 1)}" y1="${knick}" y2="${knick}" stroke="${STIL.hellgrau}" stroke-width="3"/>`
    for (let i = 0; i < n; i++)
      svg += `<line x1="${mitte(i)}" x2="${mitte(i)}" y1="${knick}" y2="${astY}" stroke="${STIL.hellgrau}" stroke-width="3"/>`
    svg += '</svg>'
    const kasten = (
      text: string,
      top: number,
      left: number,
      breite: number,
      navy: boolean,
      zusatz?: string
    ) =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            top,
            left,
            width: breite,
            minHeight: 70,
            borderRadius: 14,
            backgroundColor: navy ? STIL.navy : '#ffffff',
            border: navy ? 'none' : `3px solid ${STIL.rand}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Montserrat',
            padding: '10px 8px',
          },
        },
        h(
          'div',
          {
            style: {
              fontSize: navy ? 30 : 24,
              fontWeight: 800,
              color: navy ? '#ffffff' : STIL.tinte,
            },
          },
          text
        ),
        ...(zusatz
          ? [
              h(
                'div',
                { style: { fontSize: 19, color: STIL.grau, marginTop: 2 } },
                zusatz
              ),
            ]
          : [])
      )
    const inhalt = [
      h('img', {
        src: svgAdresse(svg),
        width: ZK_BREITE,
        height: blattY,
        style: { position: 'absolute', top: 0, left: 0 },
      }),
      kasten(k.wurzel, wurzelY, ZK_BREITE / 2 - 230, 460, true),
      ...k.aeste.map((a, i) =>
        kasten(a.name, astY, mitte(i) - spalte / 2 + 10, spalte - 20, false, a.zusatz)
      ),
      ...k.aeste.flatMap((a, i) =>
        a.blaetter.map((b, j) =>
          h(
            'div',
            {
              style: {
                position: 'absolute',
                top: blattY + j * 62,
                left: mitte(i) - spalte / 2 + 30,
                width: spalte - 40,
                height: 50,
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'Montserrat',
                fontSize: 23,
                color: STIL.tinte,
                borderLeft: `3px solid ${STIL.rand}`,
                paddingLeft: 16,
              },
            },
            ...(b.logo
              ? [
                  h('img', {
                    src: logoAdresse(b.logo),
                    height: 30,
                    style: { marginRight: 12, maxWidth: 60, objectFit: 'contain' },
                  }),
                ]
              : []),
            b.name
          )
        )
      ),
    ]
    return rahmen(k, logo, { seite: 1, seiten: 1, inhalt })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.aeste.length < 2 || k.aeste.length > 4)
      f.push(`${k.aeste.length} Äste – zwei bis vier.`)
    for (const a of k.aeste) {
      if (a.blaetter.length < 1) f.push(`Ast „${a.name}“ hat keine Blätter.`)
      if (a.blaetter.length > 7)
        f.push(`Ast „${a.name}“ hat ${a.blaetter.length} Blätter – höchstens sieben.`)
    }
    return f
  },
}
