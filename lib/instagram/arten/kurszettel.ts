/**
 * Der Kurszettel (15.11.2026, Vorschlag 20): eine ruhige Liste wie in einer
 * Broker-App – Logo, Name, darunter klein die Branche, rechts Kurs und
 * Veränderung. Keine Grafik, keine große Zahl; die Farbe trägt die Richtung.
 */
import { createElement as h } from 'react'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

import {
  LOGO_ORDNER,
  STIL,
  STIL_RAND,
  ZK_BREITE,
  logoAdresse,
  logoVerhaeltnis,
  stilFarbe,
} from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  UNTEN,
  pruefeGemeinsam,
  prozent,
  rahmen,
  type Art,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Kurszettelkarte extends NeuGemeinsam {
  art: 'kurszettel'
  zeilen: {
    name: string
    /** Klein unter dem Namen: Branche oder Börse. */
    zusatz: string
    /** Wie er dastehen soll: „534,06 $“. */
    kurs: string
    /** Veränderung in Prozent – Vorzeichen und Farbe kommen daraus. */
    aenderung: number
    logo?: string
  }[]
  /** Ein Satz unten auf der Seite (16.11.2026, Silber-Dossier). */
  satz?: string
}

function zeile(z: Kurszettelkarte['zeilen'][number], oben: number, hoehe: number) {
  const logoH = Math.min(46, hoehe - 40)
  return h(
    'div',
    {
      style: {
        position: 'absolute',
        top: oben,
        left: STIL_RAND,
        width: ZK_BREITE - 2 * STIL_RAND,
        height: hoehe,
        display: 'flex',
        alignItems: 'center',
        borderBottom: `1.5px solid ${STIL.rand}`,
        fontFamily: 'Montserrat',
      },
    },
    h(
      'div',
      {
        style: {
          width: 150,
          height: hoehe,
          display: 'flex',
          alignItems: 'center',
        },
      },
      ...(z.logo
        ? [
            h('img', {
              src: logoAdresse(z.logo),
              height: logoH,
              width: Math.min(130, Math.round(logoH * logoVerhaeltnis(z.logo))),
              style: { objectFit: 'contain' },
            }),
          ]
        : [])
    ),
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', flexGrow: 1 } },
      h('div', { style: { fontSize: 30, fontWeight: 700, color: STIL.tinte } }, z.name),
      h('div', { style: { fontSize: 20, color: STIL.hellgrau, marginTop: 2 } }, z.zusatz)
    ),
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' } },
      h('div', { style: { fontSize: 28, color: STIL.tinte } }, z.kurs),
      h(
        'div',
        {
          style: {
            fontSize: 24,
            fontWeight: 700,
            marginTop: 2,
            color: stilFarbe(z.aenderung >= 0 ? 'steigt' : 'faellt'),
          },
        },
        prozent(z.aenderung)
      )
    )
  )
}

export const kurszettel: Art<Kurszettelkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const oben = OBEN_ERSTE + 20
    const hoehe = Math.min(110, Math.floor((UNTEN - oben) / k.zeilen.length))
    return rahmen(k, logo, {
      satz: k.satz,
      seite: 1,
      seiten: 1,
      inhalt: k.zeilen.map((z, i) => zeile(z, oben + i * hoehe, hoehe)),
    })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.zeilen.length < 3 || k.zeilen.length > 8)
      f.push(`${k.zeilen.length} Zeilen – drei bis acht.`)
    for (const z of k.zeilen)
      if (z.logo && !existsSync(join(LOGO_ORDNER, z.logo)))
        f.push(`Logo „${z.logo}" fehlt in lib/instagram/logos/.`)
    return f
  },
}
