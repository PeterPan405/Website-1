/**
 * Die Jahreskacheln (25.11.2026): je Jahr ein Feld mit der Jahreszahl und
 * einem Wert – grün getönt im Plus, rot im Minus. Für Fragen der Art „Wie
 * lief X in den letzten 20 Jahren immer zur selben Zeit?“ (Thanksgiving-
 * Woche, Dezember, Wahljahre …). Eine Zeile oben kann den laufenden Fall
 * hervorheben (dieses Jahr bisher), damit die Karte eine Brücke zum Tag hat
 * (Betreiber 24.11.2026: Thema muss zur Marktlage passen).
 *
 * Gezählt wird aus den Werten, nicht eingetragen: „14 von 20 im Plus“
 * steht nur im Satz, und der Test rechnet ihn nach.
 */
import { createElement as h } from 'react'

import { STIL, STIL_RAND, ZK_BREITE } from '../../instagram-zahlenkarte.ts'
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

export interface Jahreskachelkarte extends NeuGemeinsam {
  art: 'jahreskacheln'
  /** Aufsteigend nach Jahr. */
  jahre: { jahr: number; wert: number }[]
  /** Nachkommastellen in den Kacheln (Werte nahe null brauchen zwei). */
  stellen?: number
  /** Der laufende Fall, oben über dem Raster: „2026 bisher (Fr.–Di.)“. */
  aktuell?: { text: string; wert: number }
  satz?: string
}

const SPALTEN = 5

export const jahreskacheln: Art<Jahreskachelkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const folge = ((k as { _dossier?: { seite: number } })._dossier?.seite ?? 1) > 1
    let oben = folge ? OBEN_FOLGE + 40 : OBEN_ERSTE - 10
    const unten = UNTEN - (k.satz ? 110 : 50)
    const inhalt: Element[] = []
    const farbe = (v: number) => (v >= 0 ? STIL.gruen : STIL.rot)
    if (k.aktuell) {
      inhalt.push(
        h(
          'div',
          {
            style: {
              position: 'absolute',
              top: oben,
              left: STIL_RAND,
              width: ZK_BREITE - 2 * STIL_RAND,
              height: 84,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 28px',
              border: `2.5px solid ${STIL.navy}`,
              borderRadius: 16,
              fontFamily: 'Montserrat',
            },
          },
          h(
            'div',
            {
              style: { display: 'flex', fontSize: 26, fontWeight: 700, color: STIL.navy },
            },
            k.aktuell.text
          ),
          h(
            'div',
            {
              style: {
                display: 'flex',
                fontSize: 30,
                fontWeight: 800,
                color: farbe(k.aktuell.wert),
              },
            },
            prozent(k.aktuell.wert, k.stellen ?? 1)
          )
        )
      )
      oben += 120
    }
    const zeilen = Math.ceil(k.jahre.length / SPALTEN)
    const luecke = 14
    const breite = (ZK_BREITE - 2 * STIL_RAND - (SPALTEN - 1) * luecke) / SPALTEN
    const hoehe = Math.min(150, (unten - oben - (zeilen - 1) * luecke) / zeilen)
    for (const [i, j] of k.jahre.entries()) {
      const x = STIL_RAND + (i % SPALTEN) * (breite + luecke)
      const y = oben + Math.floor(i / SPALTEN) * (hoehe + luecke)
      inhalt.push(
        h(
          'div',
          {
            style: {
              position: 'absolute',
              top: y,
              left: x,
              width: breite,
              height: hoehe,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              backgroundColor:
                j.wert >= 0 ? 'rgba(32,84,55,0.10)' : 'rgba(139,34,37,0.10)',
              fontFamily: 'Montserrat',
            },
          },
          h(
            'div',
            { style: { display: 'flex', fontSize: 20, color: STIL.grau } },
            String(j.jahr)
          ),
          h(
            'div',
            {
              style: {
                display: 'flex',
                fontSize: 25,
                fontWeight: 700,
                color: farbe(j.wert),
                marginTop: 6,
              },
            },
            prozent(j.wert, k.stellen ?? 1)
          )
        )
      )
    }
    return rahmen(k, logo, { seite: 1, seiten: 1, satz: k.satz, inhalt })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.jahre.length < 5 || k.jahre.length > 25)
      f.push(`${k.jahre.length} Jahre – fünf bis 25.`)
    for (let i = 1; i < k.jahre.length; i++)
      if (k.jahre[i].jahr <= k.jahre[i - 1].jahr) {
        f.push('Die Jahre stehen nicht aufsteigend.')
        break
      }
    const n = k.stellen ?? 1
    for (const j of k.jahre)
      if (j.wert !== 0 && Number(Math.abs(j.wert).toFixed(n)) === 0)
        f.push(
          `${j.jahr}: ${j.wert} sähe mit ${n} Stelle(n) wie 0 aus – mehr Stellen nehmen.`
        )
    return f
  },
}
