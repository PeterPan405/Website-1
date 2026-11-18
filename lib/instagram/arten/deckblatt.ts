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
  ZK_HOEHE,
  logoAdresse,
  logoVerhaeltnis,
  svgAdresse,
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
  /** JPEG in lib/instagram/fotos/, mindestens 1080 breit. Ohne Foto steht das Logo groß auf Weiß. */
  foto?: string
  /**
   * Foto mit Rand und runden Ecken statt randlos – ruhiger im Feed, passt zu
   * den weißen Startseiten (Betreiber 18.11.2026 zur bunten Vollbild-Fassung:
   * „Das würde zu sehr rausstechen … unästhetisch“).
   */
  rund?: boolean
  /** Logo auf dem Foto, oben mittig (PNG mit Transparenz). */
  fotoLogo?: string
  /**
   * Bild über die ganze Seite, Titel weiß darauf, unten abgedunkelt – wie
   * das Vorbild des Betreibers (finanzen.net, GTA VI, 18.11.2026: „so ein
   * ähnliches Bild wie aus … der Content-Inspiration“). Ohne Liste.
   */
  vollbild?: {
    /** Groß, weiß, in Versalien: „GTA VI ist da“. */
    zeile: string
    /** Darunter in der Akzentfarbe. */
    pointe: string
    /** Klein darunter. */
    unter?: string
  }
  /** Zwei Spalten unter dem Foto, höchstens acht Einträge. */
  liste?: { name: string; anzeige: string; logo?: string }[]
}

export const deckblatt: Art<Deckblattkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    if (k.vollbild) return vollbild(k, logo)
    const fotoOben = OBEN_ERSTE - 70 + (k.rund ? 20 : 0)
    const fotoH = 560
    const rand = k.rund ? STIL_RAND : 0
    const inhalt: Element[] = []
    if (k.foto) {
      const bild = `data:image/jpeg;base64,${readFileSync(join(FOTO_ORDNER, k.foto)).toString('base64')}`
      inhalt.push(
        h('img', {
          src: bild,
          width: ZK_BREITE - 2 * rand,
          height: fotoH,
          style: {
            position: 'absolute',
            top: fotoOben,
            left: rand,
            objectFit: 'cover',
            borderRadius: k.rund ? 28 : 0,
          },
        })
      )
    }
    if (k.fotoLogo) {
      const lh = k.foto ? 175 : 380
      const lw = Math.round(lh * logoVerhaeltnis(k.fotoLogo))
      inhalt.push(
        h('img', {
          src: logoAdresse(k.fotoLogo),
          height: lh,
          width: lw,
          style: {
            position: 'absolute',
            top: k.foto ? fotoOben + 24 : fotoOben + (fotoH - lh) / 2,
            left: (ZK_BREITE - lw) / 2,
          },
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
    if (k.foto && !existsSync(join(FOTO_ORDNER, k.foto)))
      f.push(`Foto „${k.foto}“ fehlt in lib/instagram/fotos/.`)
    for (const l of [k.fotoLogo, ...(k.liste ?? []).map((e) => e.logo)])
      if (l && !existsSync(join(LOGO_ORDNER, l)))
        f.push(`Logo „${l}“ fehlt in lib/instagram/logos/.`)
    if ((k.liste?.length ?? 0) > 8)
      f.push(`${k.liste!.length} Einträge – höchstens acht.`)
    return f
  },
}

const PINK = '#ff4fb5'

function vollbild(k: Deckblattkarte, logo: string): Element {
  const v = k.vollbild!
  const d = (k as { _dossier?: { seite: number; seiten: number } })._dossier
  const bild = `data:image/jpeg;base64,${readFileSync(join(FOTO_ORDNER, k.foto!)).toString('base64')}`
  const schatten = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${ZK_HOEHE}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.55"/><stop offset="0.25" stop-color="#000" stop-opacity="0"/><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#0b0420" stop-opacity="0.92"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`
  const kinder: Element[] = [
    h('img', {
      src: bild,
      width: ZK_BREITE,
      height: ZK_HOEHE,
      style: { position: 'absolute', top: 0, left: 0, objectFit: 'cover' },
    }),
    h('img', {
      src: svgAdresse(schatten),
      width: ZK_BREITE,
      height: ZK_HOEHE,
      style: { position: 'absolute', top: 0, left: 0 },
    }),
    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: 48,
          left: 0,
          width: ZK_BREITE,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Montserrat',
        },
      },
      h('img', { src: logo, width: 44, height: 44 }),
      h(
        'div',
        { style: { fontWeight: 700, fontSize: 26, color: '#ffffff', marginLeft: 12 } },
        'IM Invests'
      )
    ),
  ]
  if (d && d.seiten > 1)
    kinder.push(
      h(
        'div',
        {
          style: {
            position: 'absolute',
            top: 58,
            right: STIL_RAND,
            display: 'flex',
            fontFamily: 'Montserrat',
            fontSize: 19,
            color: '#ffffffcc',
          },
        },
        `${d.seite} / ${d.seiten}`
      )
    )
  if (k.fotoLogo) {
    const lh = 300
    const lw = Math.round(lh * logoVerhaeltnis(k.fotoLogo))
    kinder.push(
      h('img', {
        src: logoAdresse(k.fotoLogo),
        height: lh,
        width: lw,
        style: { position: 'absolute', top: 150, left: (ZK_BREITE - lw) / 2 },
      })
    )
  }
  kinder.push(
    h(
      'div',
      {
        style: {
          position: 'absolute',
          left: STIL_RAND,
          right: STIL_RAND,
          bottom: 120,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Montserrat',
        },
      },
      h(
        'div',
        {
          style: {
            fontSize: 92,
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.0,
            letterSpacing: -1,
          },
        },
        v.zeile.toUpperCase()
      ),
      h(
        'div',
        {
          style: {
            fontSize: 46,
            fontWeight: 800,
            color: PINK,
            marginTop: 18,
            lineHeight: 1.1,
          },
        },
        v.pointe
      ),
      ...(v.unter
        ? [
            h(
              'div',
              { style: { fontSize: 26, color: '#ffffffd9', marginTop: 18 } },
              v.unter
            ),
          ]
        : [])
    ),
    h(
      'div',
      {
        style: {
          position: 'absolute',
          left: STIL_RAND,
          right: 200,
          bottom: 44,
          display: 'flex',
          fontFamily: 'Montserrat',
          fontSize: 15,
          color: '#ffffffa6',
        },
      },
      k.fusszeile
    ),
    h(
      'div',
      {
        style: {
          position: 'absolute',
          right: STIL_RAND,
          bottom: 40,
          display: 'flex',
          fontFamily: 'Montserrat',
          fontSize: 22,
          fontWeight: 700,
          color: '#ffffff',
        },
      },
      'Weiter →'
    )
  )
  return h(
    'div',
    {
      style: {
        width: ZK_BREITE,
        height: ZK_HOEHE,
        display: 'flex',
        position: 'relative',
        backgroundColor: '#0b0420',
        overflow: 'hidden',
      },
    },
    ...kinder
  )
}
