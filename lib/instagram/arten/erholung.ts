/**
 * Die Erholung (17.11.2026, Silber-Dossier – Betreiber: „wie lange Silber
 * immer braucht bis zum neuen Top nach einem Tief“): je Zeile vom Tief bis
 * zum ersten Schluss über dem alten Hoch, als grüner Balken in Jahren und
 * Tagen. Die Dauer rechnet die Karte aus den beiden Tagen.
 */
import { createElement as h } from 'react'

import { STIL, STIL_RAND, ZK_BREITE } from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  UNTEN,
  pruefeGemeinsam,
  rahmen,
  type Art,
  type Element,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Erholungkarte extends NeuGemeinsam {
  art: 'erholung'
  zeilen: {
    name: string
    /** Tag des Tiefs. */
    tief: string
    /** Erster Tag mit einem Schluss über dem alten Hoch. */
    zurueck: string
    /** Klein über dem Balken: „8,79 $ → über 20,69 $“. */
    zusatz: string
  }[]
  satz?: string
}

export const tageBis = (z: Erholungkarte['zeilen'][number]) =>
  Math.round((Date.parse(z.zurueck) - Date.parse(z.tief)) / 86400000)

/** „9,8 Jahre“ ab einem Jahr, sonst „112 Tage“. */
export function dauerText(tage: number): string {
  if (tage < 365) return `${tage} Tage`
  const j = tage / 365.25
  return `${j.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Jahre`
}

export const erholung: Art<Erholungkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const oben = OBEN_ERSTE + 30
    const abstand = Math.min(190, (UNTEN - 120 - oben) / k.zeilen.length)
    const breite = ZK_BREITE - 2 * STIL_RAND - 230
    const max = Math.max(...k.zeilen.map(tageBis))
    const aus: Element[] = []
    k.zeilen.forEach((z, i) => {
      const y = oben + i * abstand
      const t = tageBis(z)
      const b = Math.max((t / max) * breite, 8)
      aus.push(
        h(
          'div',
          {
            style: {
              position: 'absolute',
              top: y,
              left: STIL_RAND,
              right: STIL_RAND,
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'Montserrat',
            },
          },
          h(
            'div',
            { style: { fontSize: 26, fontWeight: 800, color: STIL.tinte } },
            z.name
          ),
          h('div', { style: { fontSize: 20, color: STIL.grau } }, z.zusatz)
        ),
        h('div', {
          style: {
            position: 'absolute',
            top: y + 46,
            left: STIL_RAND,
            width: b,
            height: 46,
            borderRadius: 8,
            backgroundColor: STIL.gruen,
          },
        }),
        h(
          'div',
          {
            style: {
              position: 'absolute',
              top: y + 50,
              left: STIL_RAND + b + 16,
              display: 'flex',
              fontFamily: 'Montserrat',
              fontSize: 30,
              fontWeight: 700,
              color: STIL.gruen,
            },
          },
          dauerText(t)
        )
      )
    })
    return rahmen(k, logo, { seite: 1, seiten: 1, satz: k.satz, inhalt: aus })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.zeilen.length < 2 || k.zeilen.length > 5)
      f.push(`${k.zeilen.length} Zeilen – zwei bis fünf.`)
    for (const z of k.zeilen)
      if (z.zurueck <= z.tief) f.push(`${z.name}: zurück liegt nicht nach dem Tief.`)
    return f
  },
}
