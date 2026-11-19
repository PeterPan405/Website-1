/**
 * Das Punktraster (15.11.2026, Vorschlag 12): 100 Punkte, 10 × 10, gefärbt
 * nach Anteil – statt einer Torte, deren Winkel niemand schätzen kann.
 * Darunter die Legende, Zeile für Zeile, ohne große Zahl.
 */
import { createElement as h } from 'react'

import { STIL, STIL_RAND, ZK_BREITE } from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  OBEN_FOLGE,
  pruefeGemeinsam,
  rahmen,
  zahl,
  type Art,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Punktrasterkarte extends NeuGemeinsam {
  art: 'punktraster'
  /** Ganze Punkte, zusammen 100. Der erste ist die Pointe (Navy). */
  teile: {
    name: string
    punkte: number
    zusatz?: string
    /** Rechts statt „n von 100“, wenn der genaue Wert zählt („31,55 %“, 20.11.2026, EXY). */
    anzeige?: string
  }[]
  /** Ein Satz unten auf der Seite. */
  satz?: string
}

/** Navy für die Pointe, dann von dunkel nach hell. */
const FARBEN = ['#17296F', '#5b6472', '#8a93a0', '#b7bec8', '#dde1e7', '#eef0f3']

export const punktraster: Art<Punktrasterkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const groesse = 38
    const luecke = 14
    const breite = 10 * groesse + 9 * luecke
    const links = (ZK_BREITE - breite) / 2
    /* Ab Seite 2 im Dossier steht oben nur der kleine Kopf – das Raster rückt hoch. */
    const folge = ((k as { _dossier?: { seite: number } })._dossier?.seite ?? 1) > 1
    const oben = folge ? OBEN_FOLGE + 110 : OBEN_ERSTE + 10
    const farben: string[] = []
    k.teile.forEach((t, i) => {
      for (let n = 0; n < t.punkte; n++) farben.push(FARBEN[i] ?? FARBEN.at(-1)!)
    })
    const punkte = farben.map((farbe, i) =>
      h('div', {
        style: {
          position: 'absolute',
          top: oben + Math.floor(i / 10) * (groesse + luecke),
          left: links + (i % 10) * (groesse + luecke),
          width: groesse,
          height: groesse,
          borderRadius: groesse,
          backgroundColor: farbe,
        },
      })
    )
    const legendeOben = oben + 10 * (groesse + luecke) + 20
    const legende = k.teile.map((t, i) =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            top: legendeOben + i * 44,
            left: STIL_RAND,
            right: STIL_RAND,
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'Montserrat',
          },
        },
        h('div', {
          style: {
            width: 22,
            height: 22,
            borderRadius: 22,
            backgroundColor: FARBEN[i] ?? FARBEN.at(-1)!,
            marginRight: 16,
          },
        }),
        h(
          'div',
          {
            style: {
              fontSize: 26,
              fontWeight: i === 0 ? 700 : 400,
              color: i === 0 ? STIL.navy : STIL.tinte,
              flexGrow: 1,
            },
          },
          t.zusatz ? `${t.name} · ${t.zusatz}` : t.name
        ),
        h(
          'div',
          { style: { fontSize: 26, fontWeight: 700, color: STIL.tinte } },
          t.anzeige ?? `${zahl(t.punkte)} von 100`
        )
      )
    )
    return rahmen(k, logo, {
      seite: 1,
      seiten: 1,
      satz: k.satz,
      inhalt: [...punkte, ...legende],
    })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    const summe = k.teile.reduce((s, t) => s + t.punkte, 0)
    if (summe !== 100) f.push(`Die Teile ergeben ${summe} Punkte – genau 100.`)
    if (k.teile.length < 2 || k.teile.length > 5)
      f.push(`${k.teile.length} Teile – zwei bis fünf.`)
    if (k.teile.some((t) => !Number.isInteger(t.punkte) || t.punkte < 1))
      f.push('Jeder Teil braucht ganze Punkte, mindestens einen.')
    return f
  },
}
