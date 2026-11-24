/**
 * Die Balkenliste (22.11.2026): je Zeile ein Name und ein waagerechter
 * Balken ab einer senkrechten Nulllinie – Plus nach rechts in Grün, Minus
 * nach links in Rot, die genaue Zahl am Ende des Balkens. Unten eine
 * Prozentachse mit feinen Hilfslinien. Eine Seite.
 *
 * Anlass: Der Betreiber löschte am 22.11.2026 den Rangwechsel „US-Händler
 * 2026“ nach dem Post – „absolut beschissen, unübersichtlich und
 * uninteressant“. Elf Linien, die sich kreuzen, liest niemand auf dem
 * Telefon. Diese Art zeigt eine Rangfolge so, dass sie in zwei Sekunden
 * verstanden ist: wer vorn, wer hinten, wie weit.
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
  OBEN_FOLGE,
  UNTEN,
  prozent,
  pruefeGemeinsam,
  rahmen,
  type Art,
  type Element,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Balkenlistenkarte extends NeuGemeinsam {
  art: 'balkenliste'
  /** Absteigend nach Wert. `zusatz` klein unter dem Namen (Land, Börse). */
  zeilen: { name: string; zusatz?: string; wert: number; hervor?: boolean }[]
  /** Beschriftung der Achse, etwa „Veränderung in Prozent“. */
  achse: string
  /**
   * Nachkommastellen der Werte und der Achse (24.11.2026: Tagesdurchschnitte
   * je Wochentag liegen bei 0,01–0,07 % – mit einer Stelle stünde überall 0,1).
   */
  stellen?: number
  satz?: string
}

/** Achsenzahl ohne Gleitkommareste: 0,06 statt 0.060000000000000005. */
function zahlDe(v: number, stellen?: number): string {
  const n = stellen ?? (Number.isInteger(v) ? 0 : 1)
  return v.toLocaleString('de-DE', { minimumFractionDigits: n, maximumFractionDigits: n })
}

export const balkenliste: Art<Balkenlistenkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const folge = ((k as { _dossier?: { seite: number } })._dossier?.seite ?? 1) > 1
    const oben = folge ? OBEN_FOLGE + 60 : OBEN_ERSTE + 10
    const unten = UNTEN - (k.satz ? 120 : 70)
    const namenBreite = 260
    const links = STIL_RAND + namenBreite + 100
    const rechts = ZK_BREITE - STIL_RAND - 100
    const werte = k.zeilen.map((z) => z.wert)
    const s = achsenschritt(Math.max(...werte.map(Math.abs)), 4)
    const tief = Math.min(0, Math.floor(Math.min(...werte) / s - 1e-9) * s)
    const hoch = Math.max(0, Math.ceil(Math.max(...werte) / s - 1e-9) * s)
    const X = (v: number) => links + ((v - tief) / (hoch - tief)) * (rechts - links)
    const n = k.zeilen.length
    const zeilenHoehe = (unten - oben) / n
    const balkenHoehe = Math.min(44, zeilenHoehe * 0.56)
    const mitte = (i: number) => oben + (i + 0.5) * zeilenHoehe

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${unten + 50}">`
    const ticks: number[] = []
    for (let v = tief; v <= hoch + 1e-9; v += s) {
      ticks.push(v)
      if (Math.abs(v) > 1e-9)
        svg += `<line x1="${X(v)}" x2="${X(v)}" y1="${oben}" y2="${unten}" stroke="${STIL.rand}" stroke-width="1.5"/>`
    }
    for (const [i, z] of k.zeilen.entries()) {
      const x0 = Math.min(X(0), X(z.wert))
      const breite = Math.max(3, Math.abs(X(z.wert) - X(0)))
      const farbe = z.wert >= 0 ? STIL.gruen : STIL.rot
      svg += `<rect x="${x0}" y="${mitte(i) - balkenHoehe / 2}" width="${breite}" height="${balkenHoehe}" rx="4" fill="${farbe}" fill-opacity="${z.hervor ? 1 : 0.82}"/>`
    }
    svg += `<line x1="${X(0)}" x2="${X(0)}" y1="${oben - 10}" y2="${unten}" stroke="${STIL.tinte}" stroke-width="2.5"/>`
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
        ...k.zeilen.flatMap((z, i) => [
          h(
            'div',
            {
              style: {
                position: 'absolute',
                top: mitte(i) - (z.zusatz ? 26 : 16),
                left: STIL_RAND,
                width: namenBreite,
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Montserrat',
              },
            },
            h(
              'div',
              {
                style: {
                  display: 'flex',
                  fontSize: 26,
                  fontWeight: z.hervor ? 800 : 600,
                  color: STIL.tinte,
                },
              },
              z.name
            ),
            ...(z.zusatz
              ? [
                  h(
                    'div',
                    { style: { display: 'flex', fontSize: 18, color: STIL.hellgrau } },
                    z.zusatz
                  ),
                ]
              : [])
          ),
          text(prozent(z.wert, k.stellen ?? 1), {
            top: mitte(i) - 15,
            ...(z.wert >= 0
              ? { left: X(z.wert) + 12 }
              : { right: ZK_BREITE - X(z.wert) + 12 }),
            fontSize: 24,
            fontWeight: 700,
            color: z.wert >= 0 ? STIL.gruen : STIL.rot,
          }),
        ]),
        ...ticks.map((v) =>
          text(
            `${v > 0 ? '+' : v < 0 ? '−' : ''}${zahlDe(Math.abs(v), k.stellen === undefined ? undefined : Math.min(k.stellen, 2))} %`,
            {
              top: unten + 10,
              left: X(v) - 40,
              width: 80,
              justifyContent: 'center',
              fontSize: 18,
              color: STIL.hellgrau,
            }
          )
        ),
        text(k.achse, {
          top: oben - 46,
          left: links,
          fontSize: 20,
          color: STIL.grau,
        }),
      ],
    })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.zeilen.length < 3 || k.zeilen.length > 12)
      f.push(`${k.zeilen.length} Zeilen – drei bis zwölf.`)
    for (let i = 1; i < k.zeilen.length; i++)
      if (k.zeilen[i].wert > k.zeilen[i - 1].wert) {
        f.push('Die Zeilen stehen nicht absteigend nach Wert.')
        break
      }
    for (const z of k.zeilen)
      if (z.name.length > 16) f.push(`Name „${z.name}“ zu lang – höchstens 16 Zeichen.`)
    return f
  },
}
