/**
 * Das Deckblatt (18.11.2026, GTA V gegen GTA VI): ein Foto über die ganze
 * Breite, darauf ein Logo, darunter eine kurze Liste. Betreiber zur ersten
 * Fassung (Kreise auf Weiß): „keine Bilder von GTA … auf der Startseite,
 * die sieht sehr langweilig aus“. Foto aus lib/instagram/fotos/, Logo aus
 * lib/instagram/logos/ – nur gemeinfrei oder frei lizenziert, genannt in der
 * Beschriftung.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { createElement as h } from 'react'

import {
  LOGO_ORDNER,
  STIL,
  STIL_RAND,
  ZK_BREITE,
  logoAdresse,
  logoVerhaeltnis,
} from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  pruefeGemeinsam,
  rahmen,
  type Art,
  type Element,
  type NeuGemeinsam,
} from './rahmen.ts'

const FOTO_ORDNER = join(process.cwd(), 'lib/instagram/fotos')

export interface Deckblattkarte extends NeuGemeinsam {
  art: 'deckblatt'
  /** JPEG in lib/instagram/fotos/, mindestens 1080 breit. */
  foto: string
  /** Logo auf dem Foto, oben mittig (PNG mit Transparenz). */
  fotoLogo?: string
  /** Zwei Spalten unter dem Foto, höchstens acht Einträge. */
  liste?: { name: string; anzeige: string; logo?: string }[]
}

export const deckblatt: Art<Deckblattkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const fotoOben = OBEN_ERSTE - 70
    const fotoH = 560
    const bild = `data:image/jpeg;base64,${readFileSync(join(FOTO_ORDNER, k.foto)).toString('base64')}`
    const inhalt: Element[] = [
      h('img', {
        src: bild,
        width: ZK_BREITE,
        height: fotoH,
        style: { position: 'absolute', top: fotoOben, left: 0, objectFit: 'cover' },
      }),
    ]
    if (k.fotoLogo) {
      const lh = 175
      const lw = Math.round(lh * logoVerhaeltnis(k.fotoLogo))
      inhalt.push(
        h('img', {
          src: logoAdresse(k.fotoLogo),
          height: lh,
          width: lw,
          style: { position: 'absolute', top: fotoOben + 14, left: (ZK_BREITE - lw) / 2 },
        })
      )
    }
    const liste = k.liste ?? []
    const spalte = (ZK_BREITE - 2 * STIL_RAND - 40) / 2
    const zeilen = Math.ceil(liste.length / 2)
    liste.forEach((e, i) => {
      const r = i % zeilen
      const c = Math.floor(i / zeilen)
      inhalt.push(
        h(
          'div',
          {
            style: {
              position: 'absolute',
              top: fotoOben + fotoH + 34 + r * 58,
              left: STIL_RAND + c * (spalte + 40),
              width: spalte,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'Montserrat',
              borderBottom: `1.5px solid ${STIL.rand}`,
            },
          },
          h(
            'div',
            { style: { width: 64, display: 'flex', alignItems: 'center' } },
            ...(e.logo
              ? [
                  h('img', {
                    src: logoAdresse(e.logo),
                    height: 30,
                    width: Math.min(52, Math.round(30 * logoVerhaeltnis(e.logo))),
                    style: { objectFit: 'contain' },
                  }),
                ]
              : [])
          ),
          h(
            'div',
            { style: { fontSize: 24, fontWeight: 700, color: STIL.tinte, flexGrow: 1 } },
            e.name
          ),
          h('div', { style: { fontSize: 24, color: STIL.tinte } }, e.anzeige)
        )
      )
    })
    return rahmen(k, logo, { seite: 1, seiten: 1, inhalt })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (!existsSync(join(FOTO_ORDNER, k.foto)))
      f.push(`Foto „${k.foto}“ fehlt in lib/instagram/fotos/.`)
    for (const l of [k.fotoLogo, ...(k.liste ?? []).map((e) => e.logo)])
      if (l && !existsSync(join(LOGO_ORDNER, l)))
        f.push(`Logo „${l}“ fehlt in lib/instagram/logos/.`)
    if ((k.liste?.length ?? 0) > 8)
      f.push(`${k.liste!.length} Einträge – höchstens acht.`)
    return f
  },
}
