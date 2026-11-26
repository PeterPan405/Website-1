/**
 * Die Zonen (26.11.2026): je Zeile ein Name und ein Punkt auf einer
 * waagerechten Achse, dahinter senkrechte Bänder mit festen Grenzen und
 * ihrem Namen oben – etwa „Rücksetzer / Korrektur / Bärenmarkt“ bei 10 und
 * 20 Prozent unter dem Hoch. So sieht man in zwei Sekunden, **in welchem
 * Fach** jeder Wert gerade liegt, nicht nur, wie groß er ist.
 *
 * Anlass: Begriffe der Woche (Ideenpool Nr. 3) am Tag, an dem der Dax unter
 * 25.000 Punkte fiel – die Wörter fielen überall, die Grenzen nannte kaum
 * jemand. Das Fach wird aus dem Wert gerechnet, nicht eingetragen.
 */
import { createElement as h } from 'react'

import { STIL, STIL_RAND, ZK_BREITE, svgAdresse } from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  OBEN_FOLGE,
  UNTEN,
  prozent,
  pruefeGemeinsam,
  rahmen,
  type Art,
  type Element,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Zonenkarte extends NeuGemeinsam {
  art: 'zonen'
  /**
   * Die Fächer von null aus, `bis` als Betrag (10 = bis 10 % darunter); das
   * letzte Fach ist offen und trägt kein `bis`.
   */
  zonen: { name: string; zusatz: string; bis?: number }[]
  /**
   * Werte als Betrag des Abstands (7,7 = 7,7 % unter dem Hoch), aufsteigend
   * nach `wert`. `wert` entscheidet das Fach (bei Korrektur und Bärenmarkt
   * der tiefste Schluss seit dem Hoch – beide enden erst mit einem neuen
   * Hoch); `jetzt` zeigt den letzten Stand als Ring daneben.
   */
  zeilen: { name: string; wert: number; jetzt?: number }[]
  /** Legende über der Grafik: Punkt und Ring. */
  legende?: { punkt: string; ring: string }
  /** Achsenende als Betrag, etwa 60. */
  bis: number
  achse: string
  satz?: string
}

/** In welchem Fach ein Wert liegt – Grenze zählt zum tieferen Fach (10,0 % ist Korrektur). */
export function zoneVon(k: Pick<Zonenkarte, 'zonen'>, wert: number): number {
  const i = k.zonen.findIndex((z) => z.bis !== undefined && wert < z.bis)
  return i === -1 ? k.zonen.length - 1 : i
}

/** Die Tönung der Fächer: je tiefer, desto röter – ruhig, ohne Ampelfarben. */
const TOENUNG = [0.03, 0.08, 0.15, 0.22]

export const zonen: Art<Zonenkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const folge = ((k as { _dossier?: { seite: number } })._dossier?.seite ?? 1) > 1
    const kopf = folge ? OBEN_FOLGE + 40 : OBEN_ERSTE
    const oben = kopf + 80
    const unten = UNTEN - (k.satz ? 130 : 70)
    const namenBreite = 330
    const links = STIL_RAND + namenBreite
    const rechts = ZK_BREITE - STIL_RAND - 20
    const X = (v: number) => links + (v / k.bis) * (rechts - links)
    const n = k.zeilen.length
    const zeilenHoehe = (unten - oben) / n
    const mitte = (i: number) => oben + (i + 0.5) * zeilenHoehe
    const grenzen = [0, ...k.zonen.map((z) => z.bis ?? k.bis)]
    const farbeVon = (i: number) =>
      i === 0 ? STIL.grau : i === 1 ? STIL.tinte : STIL.rot

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${unten + 50}">`
    for (const [i] of k.zonen.entries())
      svg += `<rect x="${X(grenzen[i])}" y="${kopf}" width="${X(grenzen[i + 1]) - X(grenzen[i])}" height="${unten - kopf}" fill="${STIL.rot}" fill-opacity="${TOENUNG[i] ?? 0.22}"/>`
    for (const g of grenzen.slice(1, -1))
      svg += `<line x1="${X(g)}" x2="${X(g)}" y1="${kopf}" y2="${unten}" stroke="${STIL.rot}" stroke-width="2" stroke-dasharray="8 7"/>`
    for (let v = 10; v < k.bis; v += 10)
      if (!grenzen.includes(v))
        svg += `<line x1="${X(v)}" x2="${X(v)}" y1="${oben}" y2="${unten}" stroke="#ffffff" stroke-width="1.5"/>`
    for (const [i, z] of k.zeilen.entries()) {
      const f = farbeVon(zoneVon(k, z.wert))
      svg += `<line x1="${X(0)}" x2="${X(z.wert)}" y1="${mitte(i)}" y2="${mitte(i)}" stroke="${f}" stroke-width="4" stroke-linecap="round" stroke-opacity="0.55"/>`
      if (z.jetzt !== undefined && Math.abs(z.jetzt - z.wert) >= 0.05)
        svg += `<circle cx="${X(z.jetzt)}" cy="${mitte(i)}" r="9" fill="#ffffff" stroke="${f}" stroke-width="3.5"/>`
      svg += `<circle cx="${X(z.wert)}" cy="${mitte(i)}" r="11" fill="${f}" stroke="#ffffff" stroke-width="3"/>`
    }
    svg += `<line x1="${X(0)}" x2="${X(0)}" y1="${kopf}" y2="${unten}" stroke="${STIL.tinte}" stroke-width="2.5"/>`
    svg += `<line x1="${links}" x2="${rechts}" y1="${unten}" y2="${unten}" stroke="${STIL.hellgrau}" stroke-width="2"/>`
    svg += '</svg>'

    const text = (inhalt: string, stil: Record<string, string | number>): Element =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            display: 'flex',
            fontFamily: 'Montserrat',
            ...stil,
          },
        },
        inhalt
      )
    const ticks: number[] = []
    for (let v = 0; v <= k.bis; v += 10) ticks.push(v)
    return rahmen(k, logo, {
      seite: 1,
      seiten: 1,
      satz: k.satz,
      inhalt: [
        h('img', {
          src: svgAdresse(svg),
          width: ZK_BREITE,
          height: unten + 50,
          style: { position: 'absolute', top: 0, left: 0 },
        }),
        ...k.zonen.flatMap((z, i) => {
          const x0 = X(grenzen[i])
          const breite = X(grenzen[i + 1]) - x0
          return [
            h(
              'div',
              {
                style: {
                  position: 'absolute',
                  top: kopf + 12,
                  left: x0,
                  width: breite,
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
                    display: 'flex',
                    fontSize: breite < 150 ? 18 : 22,
                    fontWeight: 800,
                    color: farbeVon(i),
                  },
                },
                z.name
              ),
              h(
                'div',
                {
                  style: {
                    display: 'flex',
                    fontSize: 17,
                    color: STIL.grau,
                    marginTop: 2,
                  },
                },
                z.zusatz
              )
            ),
          ]
        }),
        ...k.zeilen.flatMap((z, i) => {
          const zweite = z.jetzt !== undefined && Math.abs(z.jetzt - z.wert) >= 0.05
          return [
            text(z.name, {
              top: mitte(i) - (zweite ? 26 : 16),
              left: STIL_RAND,
              fontSize: 25,
              fontWeight: 600,
              color: STIL.tinte,
            }),
            text(prozent(-z.wert, 1), {
              top: mitte(i) - (zweite ? 26 : 16),
              right: ZK_BREITE - links + 22,
              fontSize: 24,
              fontWeight: 700,
              color: farbeVon(zoneVon(k, z.wert)),
            }),
            ...(zweite
              ? [
                  text(`heute ${prozent(-z.jetzt!, 1)}`, {
                    top: mitte(i) + 6,
                    right: ZK_BREITE - links + 22,
                    fontSize: 18,
                    color: STIL.hellgrau,
                  }),
                ]
              : []),
          ]
        }),
        ...ticks.map((v) =>
          text(v === 0 ? 'Hoch' : `−${v} %`, {
            top: unten + 10,
            left: X(v) - 40,
            width: 80,
            justifyContent: 'center',
            fontSize: 18,
            color: STIL.hellgrau,
          })
        ),
        ...(k.legende
          ? [
              h(
                'div',
                {
                  style: {
                    position: 'absolute',
                    top: kopf - 46,
                    left: STIL_RAND,
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: 'Montserrat',
                    fontSize: 20,
                    color: STIL.grau,
                  },
                },
                h('div', {
                  style: {
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: STIL.tinte,
                    marginRight: 10,
                  },
                }),
                k.legende.punkt,
                h('div', {
                  style: {
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    border: `3.5px solid ${STIL.tinte}`,
                    marginLeft: 30,
                    marginRight: 10,
                  },
                }),
                k.legende.ring
              ),
            ]
          : [
              text(k.achse, {
                top: kopf - 40,
                left: links,
                fontSize: 20,
                color: STIL.grau,
              }),
            ]),
      ],
    })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.zonen.length < 2 || k.zonen.length > 4)
      f.push(`${k.zonen.length} Fächer – zwei bis vier.`)
    if (
      k.zonen.slice(0, -1).some((z) => z.bis === undefined) ||
      k.zonen.at(-1)?.bis !== undefined
    )
      f.push('Nur das letzte Fach ist offen, alle davor brauchen „bis“.')
    for (let i = 1; i < k.zonen.length - 1; i++)
      if ((k.zonen[i].bis ?? 0) <= (k.zonen[i - 1].bis ?? 0))
        f.push('Die Grenzen der Fächer steigen nicht.')
    if (k.zeilen.length < 3 || k.zeilen.length > 10)
      f.push(`${k.zeilen.length} Zeilen – drei bis zehn.`)
    for (let i = 1; i < k.zeilen.length; i++)
      if (k.zeilen[i].wert < k.zeilen[i - 1].wert) {
        f.push('Die Zeilen stehen nicht aufsteigend nach Abstand.')
        break
      }
    for (const z of k.zeilen) {
      if (z.jetzt !== undefined && (z.jetzt > z.wert + 1e-9 || z.jetzt < 0))
        f.push(
          `${z.name}: „jetzt“ ${z.jetzt} liegt tiefer als der tiefste Stand ${z.wert}.`
        )
      if (z.wert < 0 || z.wert > k.bis)
        f.push(`${z.name}: ${z.wert} liegt außerhalb der Achse 0 bis ${k.bis}.`)
      if (z.name.length > 14) f.push(`Name „${z.name}“ zu lang – höchstens 14 Zeichen.`)
    }
    for (const z of k.zonen)
      if (z.name.length > 12) f.push(`Fach „${z.name}“ zu lang – höchstens 12 Zeichen.`)
    return f
  },
}
