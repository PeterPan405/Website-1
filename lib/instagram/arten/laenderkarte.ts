/**
 * Die Länderkarte (15.11.2026, Vorschlag 4): Europa als echte Karte mit
 * Landesumrissen, jedes Land gefärbt nach seinem Wert, die Zahl auf dem
 * Land. Erster Entwurf war ein Kachelraster – der Betreiber am 16.11.2026:
 * „was soll das für eine Darstellung sein“. Umrisse aus `world-atlas`
 * (Natural Earth, 1:50 Mio.), dieselben wie auf /globus.
 *
 * Kleine Länder (Malta, Luxemburg, Zypern …) sind auf der Karte kaum zu
 * sehen; ihre Werte stehen deshalb in der Zeile unter der Karte.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { geoConicConformal, geoPath } from 'd3-geo'
import { createElement as h } from 'react'
import { feature } from 'topojson-client'

import { STIL, STIL_RAND, ZK_BREITE, svgAdresse } from '../../instagram-zahlenkarte.ts'
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
  /** Wo die Farbe am hellsten ist; ohne Angabe der kleinste Wert. */
  von?: number
  /** Wo die Farbe am kräftigsten wird. */
  bis: number
  /** Ein Land hervorheben (Rahmen in Navy), meist Deutschland. */
  hervor?: string
}

/** Die Länder, die die Karte kennt, mit Kürzel (Spalte, Zeile aus dem ersten Entwurf). */
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

function farbe(s: number): string {
  const a = [228, 232, 242]
  const b = [23, 41, 111]
  return `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * Math.min(Math.max(s, 0), 1))).join(',')})`
}

/** ISO-Alpha-3 → numerischer Code (wie in world-atlas), aus laender.json. */
function numerisch(): Record<string, string> {
  const l = JSON.parse(
    readFileSync(join(process.cwd(), 'data/snapshots/laender.json'), 'utf8')
  ).laender as Record<string, { numerisch: string }>
  return Object.fromEntries(Object.entries(l).map(([iso, x]) => [iso, x.numerisch]))
}

/** Unter dieser Fläche (px²) steht die Zahl nicht auf dem Land, sondern darunter. */
export const KLEIN = 700

/** Wo die Zahl steht, wenn der Schwerpunkt auf einer Grenze oder im Meer läge (Länge, Breite). */
const ANKER: Record<string, [number, number]> = {
  NOR: [9, 61.3],
  SWE: [15.2, 62.8],
  FIN: [26.5, 63.5],
  GRC: [22, 39.6],
  ITA: [13.2, 42.6],
  HRV: [16, 45.6],
  DNK: [9.2, 56.1],
  GBR: [-1.6, 52.8],
}

export const laenderkarte: Art<Laenderkartenkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const welt = JSON.parse(
      readFileSync(
        join(process.cwd(), 'node_modules/world-atlas/countries-50m.json'),
        'utf8'
      )
    )
    const alle = (
      feature(welt, welt.objects.countries) as unknown as {
        features: { id: string; geometry: unknown }[]
      }
    ).features
    const nummer = numerisch()
    const zuIso = Object.fromEntries(Object.entries(nummer).map(([i, n]) => [n, i]))
    const oben = OBEN_ERSTE - 60
    const unten = UNTEN - 60
    const breite = ZK_BREITE
    const proj = geoConicConformal().parallels([35, 65]).rotate([-12, 0]).center([0, 52])
    /* Ausschnitt: Island bis Zypern, Nordkap bis Kreta. */
    const rahmenGeo = {
      type: 'Feature',
      geometry: {
        type: 'MultiPoint',
        coordinates: [
          [-24, 63],
          [34, 71],
          [-10, 35.5],
          [34, 34.2],
        ],
      },
    }
    proj.fitExtent(
      [
        [STIL_RAND - 20, oben],
        [breite - STIL_RAND + 20, unten],
      ],
      rahmenGeo as never
    )
    const pfad = geoPath(proj)
    const werte = Object.values(k.werte)
    const von = k.von ?? Math.min(...werte)
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${breite}" height="${unten + 10}"><defs><clipPath id="c"><rect x="0" y="${oben}" width="${breite}" height="${unten - oben}"/></clipPath></defs><g clip-path="url(#c)">`
    const beschriftung: ReturnType<typeof h>[] = []
    const klein: string[] = []
    let hervor = ''
    for (const f of alle) {
      const iso = zuIso[f.id]
      const d = pfad(f as never)
      if (!d) continue
      const v = iso ? k.werte[iso] : undefined
      const fuellung = v === undefined ? '#f1f2f5' : farbe((v - von) / (k.bis - von))
      svg += `<path d="${d}" fill="${fuellung}" stroke="#ffffff" stroke-width="1.2"/>`
      if (iso && iso === k.hervor) hervor = d
      if (v === undefined) continue
      const flaeche = pfad.area(f as never)
      const name = RASTER[iso]?.[2] ?? iso
      if (flaeche < KLEIN) {
        klein.push(`${name} ${zahl(v, k.stellen ?? 1)}${k.einheit}`)
        continue
      }
      /* Frankreich, Norwegen: Überseegebiete und Inseln verschieben den Schwerpunkt – der größte Teil zählt. */
      const [cx, cy] = ANKER[iso]
        ? (proj(ANKER[iso]) as [number, number])
        : pfad.centroid(groessterTeil(f) as never)
      const s = (v - von) / (k.bis - von)
      beschriftung.push(
        h(
          'div',
          {
            style: {
              position: 'absolute',
              top: cy - 13,
              left: cx - 40,
              width: 80,
              display: 'flex',
              justifyContent: 'center',
              fontFamily: 'Montserrat',
              fontSize: flaeche < 2500 ? 13 : flaeche < 9000 ? 15 : 19,
              fontWeight: 700,
              color: s > 0.45 ? '#ffffff' : STIL.tinte,
            },
          },
          zahl(v, k.stellen ?? 1)
        )
      )
    }
    if (hervor)
      svg += `<path d="${hervor}" fill="none" stroke="${STIL.tinte}" stroke-width="3.5"/>`
    svg += '</g></svg>'
    /* Farbleiste mit Anfang und Ende. */
    const leiste = h(
      'div',
      {
        style: {
          position: 'absolute',
          top: unten + 22,
          left: STIL_RAND,
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'Montserrat',
          fontSize: 18,
          color: STIL.grau,
        },
      },
      h(
        'div',
        { style: { marginRight: 10 } },
        `${zahl(von, k.stellen ?? 1)}${k.einheit}`
      ),
      h('div', {
        style: {
          width: 200,
          height: 14,
          borderRadius: 7,
          backgroundImage: `linear-gradient(90deg, ${farbe(0)}, ${farbe(1)})`,
        },
      }),
      h(
        'div',
        { style: { marginLeft: 10 } },
        `${zahl(k.bis, k.stellen ?? 1)}${k.einheit}`
      ),
      ...(klein.length
        ? [h('div', { style: { marginLeft: 28, fontSize: 17 } }, klein.join(' · '))]
        : [])
    )
    return rahmen(k, logo, {
      seite: 1,
      seiten: 1,
      inhalt: [
        h('img', {
          src: svgAdresse(svg),
          width: breite,
          height: unten + 10,
          style: { position: 'absolute', top: 0, left: 0 },
        }),
        ...beschriftung,
        leiste,
      ],
    })
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

/** Der größte Teil eines Landes (ohne Inseln und Überseegebiete) – für die Lage der Zahl. */
function groessterTeil(f: { geometry: unknown }) {
  const g = f.geometry as { type: string; coordinates: number[][][][] }
  if (g.type !== 'MultiPolygon') return f
  const flaeche = (ring: number[][]) =>
    Math.abs(
      ring.reduce((s, [x, y], i) => {
        const [x2, y2] = ring[(i + 1) % ring.length]
        return s + x * y2 - x2 * y
      }, 0)
    )
  const teil = g.coordinates.reduce((a, b) => (flaeche(b[0]) > flaeche(a[0]) ? b : a))
  return { type: 'Feature', geometry: { type: 'Polygon', coordinates: teil } }
}
