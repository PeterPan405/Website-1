/**
 * Die Linie (17.11.2026, für das Silber-Dossier): eine Kursreihe über lange
 * Zeit, mit waagerechten Marken (etwa einem alten Hoch) und beschrifteten
 * Punkten (Hoch, heute). Achsen mit Jahreszahlen und Werten. Eine Seite.
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { createElement as h } from 'react'

import {
  LOGO_ORDNER,
  STIL,
  STIL_RAND,
  ZK_BREITE,
  achsenschritt,
  logoAdresse,
  logoVerhaeltnis,
  svgAdresse,
} from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  OBEN_FOLGE,
  UNTEN,
  pruefeGemeinsam,
  rahmen,
  zahl,
  type Art,
  type Element,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Linienkarte extends NeuGemeinsam {
  art: 'linie'
  /**
   * Freier Rand rechts in Pixeln: Ein Punkt am letzten Tag der Reihe bekommt
   * seinen Text rechts daneben statt über der Kurve (19.11.2026, GTA – die
   * Texte lagen auf der Linie).
   */
  platzRechts?: number
  /** Ein Satz unten auf der Seite (19.11.2026, GTA: die Entwicklung in Prozent). */
  satz?: string
  /** Logo aus lib/instagram/logos/, oben rechts über der Grafik (19.11.2026, GTA). */
  logo?: string
  reihe: readonly (readonly [string, number])[]
  einheit: string
  stellen?: number
  /**
   * Wo die Y-Achse beginnt (19.11.2026, Euro in Dollar: zwischen 1,09 und
   * 1,20 wäre die Kurve ab null eine flache Linie). Ohne Angabe bei null.
   * Die unterste Zahl steht an der Achse, damit niemand null annimmt.
   */
  achseAb?: number
  /** Waagerechte Linien, gestrichelt, mit Text links darüber. */
  marken?: {
    wert: number
    text: string
    /** Text rechts statt links – wenn links die Kurve auf der Linie liegt. */
    rechts?: boolean
  }[]
  /** Beschriftete Punkte; der Tag muss in der Reihe stehen. */
  punkte?: {
    d: string
    text: string
    farbe?: 'navy' | 'rot' | 'gruen'
    unten?: boolean
  }[]
}

export const wertAm = (k: Linienkarte, d: string) => k.reihe.find(([t]) => t === d)?.[1]

export const linie: Art<Linienkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    /* Ab Seite 2 im Dossier steht oben nur der kleine Kopf. */
    const folge = ((k as { _dossier?: { seite: number } })._dossier?.seite ?? 1) > 1
    const oben = folge ? OBEN_FOLGE + 120 : OBEN_ERSTE + 40
    const unten = UNTEN - 80
    const links = STIL_RAND + 70
    const rechts = ZK_BREITE - STIL_RAND - 10 - (k.platzRechts ?? 0)
    const werte = k.reihe.map(([, v]) => v)
    const s = achsenschritt(Math.max(...werte) - (k.achseAb ?? 0), 5)
    const tiefst = k.achseAb === undefined ? 0 : Math.floor(k.achseAb / s + 1e-9) * s
    const hoch = tiefst + Math.ceil((Math.max(...werte) - tiefst) / s - 1e-9) * s
    const t0 = Date.parse(k.reihe[0][0])
    const t1 = Date.parse(k.reihe[k.reihe.length - 1][0])
    const X = (d: string) => links + ((Date.parse(d) - t0) / (t1 - t0)) * (rechts - links)
    const Y = (v: number) => unten - ((v - tiefst) / (hoch - tiefst)) * (unten - oben)
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${unten + 4}">`
    const ticks: number[] = []
    for (let i = 0; tiefst + i * s <= hoch + 1e-9; i++) {
      const v = tiefst + i * s
      ticks.push(v)
      svg += `<line x1="${links}" x2="${rechts}" y1="${Y(v)}" y2="${Y(v)}" stroke="${i === 0 ? STIL.hellgrau : STIL.rand}" stroke-width="${i === 0 ? 2.5 : 1.5}"/>`
    }
    for (const m of k.marken ?? [])
      svg += `<line x1="${links}" x2="${rechts}" y1="${Y(m.wert)}" y2="${Y(m.wert)}" stroke="${STIL.rot}" stroke-width="2.5" stroke-dasharray="10 8"/>`
    svg += `<polyline fill="none" stroke="${STIL.navy}" stroke-width="3" stroke-linejoin="round" points="${k.reihe.map(([d, v]) => `${X(d).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')}"/>`
    const farbe = { navy: STIL.navy, rot: STIL.rot, gruen: STIL.gruen }
    for (const p of k.punkte ?? [])
      svg += `<circle cx="${X(p.d)}" cy="${Y(wertAm(k, p.d)!)}" r="10" fill="${farbe[p.farbe ?? 'navy']}" stroke="#ffffff" stroke-width="4"/>`
    svg += '</svg>'
    const klein = (text: string, stil: Record<string, string | number>): Element =>
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
    const j0 = Number(k.reihe[0][0].slice(0, 4))
    const j1 = Number(k.reihe[k.reihe.length - 1][0].slice(0, 4))
    /* Unter zwei Jahren: Monate statt Jahreszahlen (19.11.2026, Euro 2026). */
    const achse: [string, string][] = []
    if (t1 - t0 < 2 * 365 * 864e5) {
      const kurz = [
        'Jan.',
        'Feb.',
        'März',
        'Apr.',
        'Mai',
        'Juni',
        'Juli',
        'Aug.',
        'Sep.',
        'Okt.',
        'Nov.',
        'Dez.',
      ]
      for (let j = j0; j <= j1; j++)
        for (let m = 0; m < 12; m += 2) {
          const d = `${j}-${String(m + 1).padStart(2, '0')}-01`
          if (Date.parse(d) >= t0 && Date.parse(d) <= t1) achse.push([d, kurz[m]])
        }
    } else {
      const abstand = Math.max(1, Math.ceil((j1 - j0) / 6))
      for (let j = Math.ceil((j0 + 1) / abstand) * abstand; j <= j1; j += abstand)
        achse.push([`${j}-01-01`, String(j)])
    }
    return rahmen(k, logo, {
      seite: 1,
      seiten: 1,
      satz: k.satz,
      inhalt: [
        h('img', {
          src: svgAdresse(svg),
          width: ZK_BREITE,
          height: unten + 4,
          style: { position: 'absolute', top: 0, left: 0 },
        }),
        ...ticks.map((v) =>
          klein(zahl(v, k.achseAb === undefined ? 0 : (k.stellen ?? 2)), {
            top: Y(v) - 12,
            left: STIL_RAND,
          })
        ),
        ...achse.map(([d, text]) =>
          klein(text, {
            top: unten + 10,
            left: X(d) - 30,
            width: 60,
            justifyContent: 'center',
          })
        ),
        ...(k.logo
          ? [
              h('img', {
                src: logoAdresse(k.logo),
                height: 56,
                width: Math.min(220, Math.round(56 * logoVerhaeltnis(k.logo))),
                style: {
                  position: 'absolute',
                  top: oben - 120,
                  right: STIL_RAND,
                  objectFit: 'contain',
                },
              }),
            ]
          : []),
        klein(k.einheit, {
          top: oben - 44,
          left: STIL_RAND,
          fontSize: 20,
          color: STIL.grau,
        }),
        ...(k.marken ?? []).map((m) =>
          klein(m.text, {
            top: Y(m.wert) - 34,
            ...(m.rechts ? { right: ZK_BREITE - rechts + 8 } : { left: links + 8 }),
            fontSize: 20,
            fontWeight: 700,
            color: STIL.rot,
          })
        ),
        ...(k.punkte ?? []).map((p) => {
          const x = X(p.d)
          if (k.platzRechts && p.d === k.reihe[k.reihe.length - 1][0])
            return klein(p.text, {
              top: Y(wertAm(k, p.d)!) - 14,
              left: x + 18,
              fontSize: 20,
              fontWeight: 700,
              color: farbe[p.farbe ?? 'navy'],
            })
          const rechtsBuendig = x > ZK_BREITE - 260
          return klein(p.text, {
            top: Y(wertAm(k, p.d)!) + (p.unten ? 18 : -46),
            ...(rechtsBuendig ? { right: ZK_BREITE - x + 4 } : { left: x - 20 }),
            fontSize: 20,
            fontWeight: 700,
            color: farbe[p.farbe ?? 'navy'],
          })
        }),
      ],
    })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.reihe.length < 10) f.push('Weniger als zehn Werte in der Reihe.')
    if (k.logo && !existsSync(join(LOGO_ORDNER, k.logo)))
      f.push(`Logo „${k.logo}“ fehlt in lib/instagram/logos/.`)
    if (k.achseAb !== undefined && k.reihe.some(([, v]) => v < k.achseAb!))
      f.push(`Ein Wert liegt unter dem Achsenbeginn ${k.achseAb}.`)
    for (const p of k.punkte ?? [])
      if (wertAm(k, p.d) === undefined) f.push(`Punkt ${p.d} steht nicht in der Reihe.`)
    for (let i = 1; i < k.reihe.length; i++)
      if (k.reihe[i][0] <= k.reihe[i - 1][0]) {
        f.push('Die Reihe ist nicht aufsteigend nach Tag.')
        break
      }
    return f
  },
}
