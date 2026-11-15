/**
 * Die Länderkarte (15.11.2026, Vorschlag 4): Europa als Kachelkarte – jedes
 * Land ein gleich großes Feld ungefähr an seinem Ort, gefärbt nach dem Wert,
 * darin Kürzel und Zahl. Eine echte Landkarte bräuchte Umrisse und machte
 * Malta unsichtbar; die Kacheln geben jedem Land denselben Platz.
 */
import { createElement as h } from 'react'

import { STIL, STIL_RAND, ZK_BREITE } from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  UNTEN,
  pruefeGemeinsam,
  rahmen,
  zahl,
  type Art,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Laenderkartenkarte extends NeuGemeinsam {
  art: 'laenderkarte'
  einheit: string
  stellen?: number
  /** ISO-Alpha-3 (DEU, FRA …) → Wert. Nur Länder aus `RASTER`. */
  werte: Record<string, number>
  /** Wo die Farbe am kräftigsten wird; darunter heller. */
  bis: number
  /** Ein Land hervorheben (Rahmen in Navy), meist Deutschland. */
  hervor?: string
}

/** Spalte, Zeile je Land – eine Kachelkarte Europas. */
export const RASTER: Record<string, [number, number, string]> = {
  ISL: [0, 0, 'IS'],
  NOR: [4, 0, 'NO'],
  SWE: [5, 0, 'SE'],
  FIN: [6, 0, 'FI'],
  IRL: [1, 1, 'IE'],
  GBR: [2, 1, 'UK'],
  DNK: [4, 1, 'DK'],
  EST: [6, 1, 'EE'],
  NLD: [3, 2, 'NL'],
  DEU: [4, 2, 'DE'],
  POL: [5, 2, 'PL'],
  LVA: [6, 2, 'LV'],
  BEL: [3, 3, 'BE'],
  LUX: [2, 3, 'LU'],
  CZE: [4, 3, 'CZ'],
  SVK: [5, 3, 'SK'],
  LTU: [6, 3, 'LT'],
  FRA: [2, 4, 'FR'],
  CHE: [3, 4, 'CH'],
  AUT: [4, 4, 'AT'],
  HUN: [5, 4, 'HU'],
  ROU: [6, 4, 'RO'],
  PRT: [0, 5, 'PT'],
  ESP: [1, 5, 'ES'],
  ITA: [3, 5, 'IT'],
  SVN: [4, 5, 'SI'],
  HRV: [5, 5, 'HR'],
  BGR: [6, 5, 'BG'],
  MLT: [3, 6, 'MT'],
  GRC: [5, 6, 'GR'],
  CYP: [6, 6, 'CY'],
}

function farbe(v: number, bis: number): string {
  const s = Math.min(Math.max(v, 0) / bis, 1)
  const a = [234, 237, 245]
  const b = [23, 41, 111]
  return `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * s)).join(',')})`
}

export const laenderkarte: Art<Laenderkartenkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const spalten = 7
    const luecke = 10
    const zeilen = 7
    const oben = OBEN_ERSTE + 10
    const groesse = Math.floor(
      Math.min(
        (ZK_BREITE - 2 * STIL_RAND - luecke * (spalten - 1)) / spalten,
        (UNTEN - 10 - oben - luecke * (zeilen - 1)) / zeilen
      )
    )
    const links = (ZK_BREITE - spalten * groesse - (spalten - 1) * luecke) / 2
    const inhalt = Object.entries(RASTER).map(([iso, [sp, ze, kurz]]) => {
      const v = k.werte[iso]
      const da = v !== undefined
      const s = da ? Math.min(Math.max(v, 0) / k.bis, 1) : 0
      return h(
        'div',
        {
          style: {
            position: 'absolute',
            left: links + sp * (groesse + luecke),
            top: oben + ze * (groesse + luecke),
            width: groesse,
            height: groesse,
            borderRadius: 12,
            backgroundColor: da ? farbe(v, k.bis) : '#f6f7f9',
            border: k.hervor === iso ? `5px solid ${STIL.tinte}` : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Montserrat',
            color: s > 0.5 ? '#ffffff' : STIL.tinte,
          },
        },
        h('div', { style: { fontSize: 22, fontWeight: 800 } }, kurz),
        h(
          'div',
          {
            style: { fontSize: 20, marginTop: 2, color: da ? undefined : STIL.hellgrau },
          },
          da ? `${zahl(v, k.stellen ?? 1)}${k.einheit}` : '–'
        )
      )
    })
    return rahmen(k, logo, { seite: 1, seiten: 1, inhalt })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    for (const iso of Object.keys(k.werte))
      if (!(iso in RASTER)) f.push(`„${iso}“ steht nicht im Raster der Karte.`)
    if (Object.keys(k.werte).length < 10)
      f.push('Weniger als zehn Länder – dafür ist es keine Karte.')
    if (k.hervor && !(k.hervor in k.werte))
      f.push(`Hervorgehoben ist „${k.hervor}“, aber ohne Wert.`)
    return f
  },
}
