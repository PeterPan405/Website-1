/**
 * Die Zahlenkarte – ein einzelnes Bild, eine Zahl, die hängen bleibt.
 *
 * Vorbild ist der Beitrag vom 12.10.2026 („7 US-Giganten sind mehr Wert als
 * Europas 600"), über den der Betreiber am 15.10.2026 schrieb: „Ich wollte
 * nur sagen, dass ich sehr zufrieden bin." Beschrieben ist die Form in
 * `INSTAGRAM.md` unter „C — Zahlenkarte"; diese Datei setzt sie.
 *
 *   Kopf         Logo und Wortmarke „IM Invests", mittig
 *   Überschrift  Anton 112 px, schwarz, die Pointe dunkelgrün
 *   Grafik       schwarzer Balken gegen dunkelgrünen, Wert fett-kursiv darüber,
 *                die Differenz dunkelrot zwischen zwei gestrichelten Linien
 *   Fuß          Beschriftung unter den Balken, Fußzeile „Stand | Quelle"
 *
 * **Zwei Formen**, Kopf, Überschrift und Fuß bleiben gleich. Der Betreiber am
 * 15.10.2026 zum ersten Entwurf: „mache mehrere Länder in den Vergleich, es
 * muss auch nicht immer so ein Balkendiagramm sein … ich meinte mit Vorlage
 * Schrift und dass unser Logo oben drauf ist." Die Vorlage ist also Anton und
 * das Logo – nicht die zwei Balken. Daher neben dem `vergleich` die
 * `rangliste`: bis elf Zeilen mit Flagge, Name, zehn Häuschen (eins je zehn
 * Prozent, das letzte anteilig gefüllt) und Wert; eine Zeile hervorgehoben,
 * ein Schnitt gestrichelt eingereiht.
 *
 * Wann eine Karte hinausgeht, entscheidet **nicht** diese Datei: Jede Karte
 * wird vorher abgestimmt (Anordnung vom 15.10.2026: „Ich möchte, dass die
 * Themen der Beiträge mit mir bzw. mit unserer Social-Media-Abteilung
 * abgesprochen werden"). Der Ablauf steht in `INSTAGRAM.md`.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { ImageResponse } from 'next/og.js'
import { createElement as h } from 'react'

import { RECHTSHINWEIS } from './instagram-plan.ts'

export const ZK_BREITE = 1080
export const ZK_HOEHE = 1350

/** Eine Seite des Vergleichs. */
export interface Seite {
  /** Unter dem Balken: „Deutschland", „Magnificent Seven". */
  name: string
  /** Die Zahl, die die Balkenhöhe bestimmt. */
  wert: number
  /** So steht sie über dem Balken: „47,2 %", „24,9". */
  anzeige: string
  /** Kleine Zeile unter der Zahl: „im Eigentum", „Bio. US-$". */
  zusatz: string
  /** Kreisrunde Flagge aus waagrechten Streifen, von oben – oder keine. */
  flagge?: string[]
}

interface KarteGemeinsam {
  /** Erscheinungstag, JJJJ-MM-TT. */
  datum: string
  /** Die Überschrift in Stücken; `gruen` hebt die Pointe hervor. */
  titel: { text: string; gruen?: boolean }[]
  /** Unter der Linie, klein: „Stand: 2025 | Quelle: Eurostat …" */
  fusszeile: string
  /** Aufhänger, ein bis zwei Absätze, „Quellen: …" – ohne Rechtshinweis. */
  text: string
  /** Genau fünf, klein, ohne `#`. */
  schlagworte: string[]
  /**
   * Der Tag der Freigabe durch den Betreiber – erst dann geht die Karte
   * hinaus, und auch dann frühestens um 16 Uhr (`lib/zahlenkarten-wecker.ts`).
   * Gesetzt wird es **nach** seinem „passt", nie davor; ein Entwurf hat keins.
   */
  freigabe?: string
}

/** Zwei Balken gegeneinander – die Form des Vorbilds vom 12.10.2026. */
export interface Vergleichskarte extends KarteGemeinsam {
  art?: 'vergleich'
  /** Links schwarz, rechts dunkelgrün – wie im Vorbild. */
  links: Seite
  rechts: Seite
  /** Zwischen den Balken: „+40,0", darunter „Prozentpunkte". */
  differenz: { text: string; zusatz: string }
}

/** Eine Zeile der Rangliste. */
export interface Rang {
  name: string
  /** Prozent – bei Häuschen 0 bis 100, eins je zehn; bei Balken auch darüber. */
  wert: number
  /** Schlüssel in `FLAGGEN`: ISO-3 oder „EU27". */
  land: string
  /** Die Zeile, um die es geht – dunkelgrün, umrandet. Genau eine. */
  hervor?: boolean
  /** Ein Durchschnitt, eingereiht – grau, gestrichelt. */
  schnitt?: boolean
}

export interface Rangkarte extends KarteGemeinsam {
  art: 'rangliste'
  /** Die Zeile unter der Überschrift: „Von 10 Menschen wohnen so viele im Eigentum:" */
  unterzeile: string
  /** Absteigend, vier bis elf Zeilen. */
  zeilen: Rang[]
  /**
   * Häuschen (Voreinstellung) für Anteile bis 100 %, Balken für Werte, die
   * darüber gehen – Staatsschulden von 308,7 % des BIP wären 31 Häuschen.
   * Die Balken zeigen eine gestrichelte Linie bei 100 %.
   */
  skala?: 'haeuser' | 'balken'
}

export type Zahlenkarte = Vergleichskarte | Rangkarte

/** Eine kreisrunde Flagge: Streifen, von oben oder von links, wahlweise mit Wappen. */
export interface Flagge {
  streifen: string[]
  senkrecht?: boolean
  /** Breite der Streifen im Verhältnis – Spanien 1 : 2 : 1. */
  gewichte?: number[]
  /** Ein Bild darüber, als SVG – das slowakische Wappen. */
  wappen?: string
  /** Statt Streifen ein Kürzel auf der ersten Farbe – „EU". */
  kuerzel?: string
  /** Die ganze Flagge als SVG, quadratisch – für Flaggen ohne Streifen (Japan, USA). */
  svg?: string
}

/*
  Nur Länder, deren Flagge aus Streifen besteht – oder deren Wappen sich in
  46 px noch erkennen lässt. Ohne Wappen wäre die Slowakei Russland.
*/
/*
  Flaggen, die sich nicht aus Streifen legen lassen, als ganzes Bild –
  vereinfacht auf das, was in 46 px noch zu sehen ist: die Sterne als Punkte,
  die Krone Liechtensteins als Umriss.
*/
const quadrat = (inhalt: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">${inhalt}</svg>`
const FLAGGE_JAPAN = quadrat(
  '<rect width="60" height="60" fill="#fff"/><circle cx="30" cy="30" r="17" fill="#BC002D"/>'
)
const FLAGGE_USA = quadrat(
  Array.from(
    { length: 13 },
    (_, i) =>
      `<rect y="${((i * 60) / 13).toFixed(2)}" width="60" height="${(60 / 13 + 0.1).toFixed(2)}" fill="${i % 2 ? '#fff' : '#B22234'}"/>`
  ).join('') +
    '<rect width="30" height="32.3" fill="#3C3B6E"/>' +
    [8, 16, 24]
      .flatMap((y) =>
        [9, 17, 25].map((x) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#fff"/>`)
      )
      .join('')
)
const FLAGGE_LIECHTENSTEIN = quadrat(
  '<rect width="60" height="30" fill="#002B7F"/><rect y="30" width="60" height="30" fill="#CE1126"/>' +
    '<path d="M13 23 L13 15 L17 19 L20.5 12 L24 19 L28 15 L28 23 Z" fill="#FFD83D"/>'
)
const FLAGGE_VENEZUELA = quadrat(
  '<rect width="60" height="20" fill="#FFCC00"/><rect y="20" width="60" height="20" fill="#00247D"/>' +
    '<rect y="40" width="60" height="20" fill="#CF142B"/>' +
    Array.from({ length: 8 }, (_, i) => {
      const w = Math.PI * (1.1 + (0.8 * i) / 7)
      return `<circle cx="${(30 + 13 * Math.cos(w)).toFixed(1)}" cy="${(36 + 13 * Math.sin(w)).toFixed(1)}" r="1.6" fill="#fff"/>`
    }).join('')
)

const WAPPEN_SLOWAKEI =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 24">' +
  '<path d="M1 1H19V12C19 18 14 21 10 23C6 21 1 18 1 12Z" fill="#fff"/>' +
  '<path d="M2.5 2.5H17.5V12C17.5 17 13.5 19.7 10 21.3C6.5 19.7 2.5 17 2.5 12Z" fill="#EE1C25"/>' +
  '<rect x="9" y="4.5" width="2" height="11.5" fill="#fff"/>' +
  '<rect x="6.5" y="7" width="7" height="1.7" fill="#fff"/>' +
  '<rect x="5" y="10.5" width="10" height="1.9" fill="#fff"/>' +
  '<path d="M3.5 16C5 14.5 7 14.5 8 15.5C9 14 11 14 12 15.5C13 14.5 15 14.5 16.5 16L16 17.5C14.5 19.5 12 20.5 10 21.3C8 20.5 5.5 19.5 4 17.5Z" fill="#0B4EA2"/>' +
  '</svg>'

export const FLAGGEN: Record<string, Flagge> = {
  AUT: { streifen: ['#ED2939', '#FFFFFF', '#ED2939'] },
  BEL: { streifen: ['#000000', '#FAE042', '#ED2939'], senkrecht: true },
  DEU: { streifen: ['#000000', '#DD0000', '#FFCE00'] },
  ESP: { streifen: ['#AA151B', '#F1BF00', '#AA151B'], gewichte: [1, 2, 1] },
  EU27: { streifen: ['#003399'], kuerzel: 'EU' },
  FRA: { streifen: ['#002395', '#FFFFFF', '#ED2939'], senkrecht: true },
  HUN: { streifen: ['#CE2939', '#FFFFFF', '#477050'] },
  IRL: { streifen: ['#169B62', '#FFFFFF', '#FF883E'], senkrecht: true },
  ITA: { streifen: ['#009246', '#FFFFFF', '#CE2B37'], senkrecht: true },
  JPN: { streifen: ['#FFFFFF'], svg: FLAGGE_JAPAN },
  LIE: { streifen: ['#002B7F'], svg: FLAGGE_LIECHTENSTEIN },
  NLD: { streifen: ['#AE1C28', '#FFFFFF', '#21468B'] },
  POL: { streifen: ['#FFFFFF', '#DC143C'] },
  ROU: { streifen: ['#002B7F', '#FCD116', '#CE1126'], senkrecht: true },
  SVK: { streifen: ['#FFFFFF', '#0B4EA2', '#EE1C25'], wappen: WAPPEN_SLOWAKEI },
  USA: { streifen: ['#B22234'], svg: FLAGGE_USA },
  VEN: { streifen: ['#FFCC00'], svg: FLAGGE_VENEZUELA },
}

const SCHWARZ = '#000000'
const GRUEN = '#1f4a12'
const ROT = '#8e1b1b'
const GRAU = '#222222'
const MITTELGRAU = '#555555'
const LEER = '#dcdcdc'

/*
  Die Schriften der Vorlage: Anton für die Überschrift, Open Sans für alles
  andere – Wortmarke, Werte, Beschriftung, Fußzeile. Bis zum 15.10.2026 stand
  hier Noto Sans; der Betreiber: „die Schrift von IM Invests passt so noch
  nicht, das ist nicht wie in der Vorgabe". Gegen den Beitrag vom 12.10.
  gestellt kam Open Sans am nächsten (verglichen mit Montserrat, Inter,
  Albert Sans, Figtree).

  Die Vorlage ist in Canva gesetzt, in Canva Sans – und die verlangt der
  Betreiber seit dem 16.10.2026 für alle kleineren Texte. Sie ist eine
  Hausschrift von Canva und darf außerhalb von Canva nicht verwendet werden;
  Open Sans ist die Ersatzschrift, dieselbe wie in den Tageskacheln
  (`lib/instagram-bild.ts`).
*/
const ORDNER = join(process.cwd(), 'lib/instagram/schriften')
type Schrift = {
  name: string
  data: Buffer
  weight: 400 | 700 | 800
  style: 'normal' | 'italic'
}
let schriftVorrat: Schrift[] | null = null
function schriften() {
  schriftVorrat ??= [
    {
      name: 'Anton',
      data: readFileSync(join(ORDNER, 'anton-400.woff')),
      weight: 400,
      style: 'normal',
    },
    {
      name: 'Open',
      data: readFileSync(join(ORDNER, 'open-sans-400.woff')),
      weight: 400,
      style: 'normal',
    },
    {
      name: 'Open',
      data: readFileSync(join(ORDNER, 'open-sans-700.woff')),
      weight: 700,
      style: 'normal',
    },
    {
      name: 'Open',
      data: readFileSync(join(ORDNER, 'open-sans-800-kursiv.woff')),
      weight: 800,
      style: 'italic',
    },
  ]
  return schriftVorrat
}

/*
  Die Geometrie, gemessen am ersten Entwurf (15.10.2026): Im zweiten Anlauf
  stieß die Beschriftung des höheren Balkens an die Überschrift – 6,2 px je
  Prozentpunkt waren zu viel. Jetzt wird der höhere Balken auf 400 px
  gesetzt, der andere im Verhältnis; das gilt für jede Größenordnung.
*/
const BODEN = 1030
const HOECHSTER = 400
const BALKEN = 200
const LUECKE = 200
const XL = (ZK_BREITE - (2 * BALKEN + LUECKE)) / 2 - 2
const XR = XL + BALKEN + LUECKE

/*
  Die Rangliste: Überschrift in 104 statt 112 px, damit drei Zeilen Anton
  und die Unterzeile über der ersten Zeile enden (Entwurf vom 15.10.2026).
  Elf Zeilen zu 62 px enden bei 1242 – über der Fußlinie bei 1276.
*/
const RL_TITEL = 104
const RL_UNTERZEILE = 478
const RL_OBEN = 560
const RL_ZEILE = 62
/*
  Weniger als elf Zeilen verteilen sich auf dieselbe Höhe, bis 84 px je
  Zeile – sieben zu 62 px ließen unten ein Viertel der Karte leer
  (Entwurf vom 17.10.2026). Elf bleiben bei 62.
*/
export const RL_ZEILEN_MAX = 11
const RL_UNTEN = RL_OBEN + RL_ZEILEN_MAX * RL_ZEILE
const zeilenhoehe = (n: number) => Math.min(84, Math.floor((RL_UNTEN - RL_OBEN) / n))
const HAUS = 38
const HAUS_ABSTAND = 7
/*
  Die Balken beginnen, wo die Häuschen beginnen: Zeile ab 40, Rand 3,
  Innenabstand 18, Flagge 46, Abstand 16, Name 250. Der längste ist 430 px
  lang – Platz für „308,7 %" rechts daneben.
*/
const RL_BALKEN_X = 40 + 3 + 18 + 46 + 16 + 250
const RL_BALKEN = 430

/** Was an einer Karte nicht stimmt – leer heißt: in Ordnung. */
export function pruefeZahlenkarte(k: Zahlenkarte): string[] {
  const f: string[] = []
  if (!/^\d{4}-\d{2}-\d{2}$/.test(k.datum))
    f.push(`datum „${k.datum}" ist kein JJJJ-MM-TT.`)
  if (k.freigabe !== undefined && k.freigabe !== k.datum)
    f.push(
      `freigabe „${k.freigabe}" – freigegeben wird die Karte für ihren Tag (${k.datum}).`
    )
  if (!k.titel.some((t) => t.gruen)) f.push('Die Überschrift braucht eine grüne Pointe.')
  const zeichen = k.titel.map((t) => t.text).join(' ').length
  if (zeichen > 48)
    f.push(`Überschrift hat ${zeichen} Zeichen – mehr als drei Zeilen Anton.`)
  if (k.art === 'rangliste') f.push(...pruefeRangliste(k))
  else
    for (const s of [k.links, k.rechts]) {
      if (!(s.wert > 0)) f.push(`${s.name}: Wert muss größer als null sein.`)
      if (s.flagge && s.flagge.length < 2)
        f.push(`${s.name}: eine Flagge braucht mindestens zwei Streifen.`)
    }
  if (!/Quelle/.test(k.fusszeile)) f.push('Die Fußzeile nennt keine Quelle.')
  if (!/^Stand: /.test(k.fusszeile)) f.push('Die Fußzeile beginnt nicht mit „Stand: ".')
  if (!/\nQuellen?: /.test(k.text)) f.push('Der Text endet ohne Zeile „Quellen: …".')
  if (k.schlagworte.length !== 5)
    f.push(`${k.schlagworte.length} Schlagworte, genau fünf.`)
  for (const w of k.schlagworte)
    if (!/^[a-zäöüß0-9]{2,30}$/.test(w))
      f.push(`Schlagwort „${w}" – klein, ohne # und Leerzeichen.`)
  return f
}

function pruefeRangliste(k: Rangkarte): string[] {
  const f: string[] = []
  const n = k.zeilen.length
  if (n < 4 || n > RL_ZEILEN_MAX)
    f.push(`${n} Zeilen – die Rangliste trägt vier bis ${RL_ZEILEN_MAX}.`)
  if (k.zeilen.filter((z) => z.hervor).length !== 1)
    f.push('Die Rangliste braucht genau eine hervorgehobene Zeile.')
  if (k.zeilen.filter((z) => z.schnitt).length > 1) f.push('Höchstens ein Schnitt.')
  if (!k.unterzeile.trim()) f.push('Die Unterzeile fehlt.')
  for (const [i, z] of k.zeilen.entries()) {
    if (!(z.wert > 0))
      f.push(`${z.name}: ${z.wert} – der Wert muss größer als null sein.`)
    else if (k.skala !== 'balken' && z.wert > 100)
      f.push(
        `${z.name}: ${z.wert} – ein Häuschen je zehn Prozent, also 0 bis 100; darüber skala: 'balken'.`
      )
    if (!FLAGGEN[z.land]) f.push(`${z.name}: keine Flagge für „${z.land}" in FLAGGEN.`)
    if (i > 0 && z.wert > k.zeilen[i - 1].wert)
      f.push(`${z.name} steht unter ${k.zeilen[i - 1].name}, hat aber mehr – absteigend.`)
  }
  return f
}

/** Die Beschriftung, wie sie hinausgeht: Text, Rechtshinweis, Schlagworte. */
export function beschriftungZahlenkarte(k: Zahlenkarte): string {
  return `${k.text.trim()}\n\n${RECHTSHINWEIS} ${k.schlagworte.map((w) => `#${w}`).join(' ')}`
}

const svgAdresse = (svg: string) =>
  `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`

const flagge = (fl: Flagge, groesse: number, rand: number) =>
  h(
    'div',
    {
      style: {
        position: 'relative',
        width: groesse,
        height: groesse,
        borderRadius: groesse / 2,
        border: `${rand}px solid #000`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: fl.senkrecht ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: fl.streifen[0],
      },
    },
    ...(fl.svg
      ? [h('img', { src: svgAdresse(fl.svg), width: groesse, height: groesse })]
      : fl.kuerzel
        ? [
            h(
              'div',
              {
                style: {
                  fontFamily: 'Open',
                  fontWeight: 700,
                  fontSize: Math.round(groesse * 0.35),
                  color: '#FFCC00',
                },
              },
              fl.kuerzel
            ),
          ]
        : [
            ...fl.streifen.map((farbe, i) =>
              h('div', {
                style: {
                  flex: fl.gewichte?.[i] ?? 1,
                  alignSelf: 'stretch',
                  backgroundColor: farbe,
                },
              })
            ),
            ...(fl.wappen
              ? [
                  h('img', {
                    src: svgAdresse(fl.wappen),
                    width: groesse * 0.43,
                    height: groesse * 0.52,
                    style: {
                      position: 'absolute',
                      left: groesse * 0.15,
                      top: groesse * 0.2,
                    },
                  }),
                ]
              : []),
          ])
  )

const haus = (farbe: string) =>
  svgAdresse(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">' +
      `<path d="M20 3 L38 19 L33 19 L33 37 L7 37 L7 19 L2 19 Z" fill="${farbe}"/></svg>`
  )

const zahl = (w: number) => w.toFixed(1).replace('.', ',')

/*
  Der Kopf, nachgemessen am Beitrag vom 12.10.2026 (auf 1080 px gerechnet):
  Signet 46 px ab Zeile 24, Wortmarke mit 19 px Versalhöhe – Open Sans 27 px,
  schwarz – 11 px daneben. Das Signet dort trägt kein „IMI" in der Mitte.
*/
const KOPF_OBEN = 24
const KOPF_LOGO = 46

/**
 * Das Signet ohne den Schriftzug „IMI" in der Mitte – wie im Vorbild.
 * `public/logo.svg` führt ihn als letzte Fläche (grau); fehlt sie dort oder
 * steht sie anders, bleibt das Logo unverändert, statt eine Figur zu verlieren.
 */
export function signetOhneMitte(svg: string): string {
  const letzte = svg.lastIndexOf('<path')
  const ende = svg.indexOf('/>', letzte)
  if (letzte < 0 || ende < 0) return svg
  const flaeche = svg.slice(letzte, ende + 2)
  if (!flaeche.includes('fill="#6E6E6E"') || !/^\s*<\/svg>\s*$/.test(svg.slice(ende + 2)))
    return svg
  return svg.slice(0, letzte) + svg.slice(ende + 2)
}

/** Setzt die Karte; zurück kommt PNG – das JPEG macht der Aufrufer. */
export async function zahlenkartePng(k: Zahlenkarte, logoSvg: string): Promise<Buffer> {
  const rangliste = k.art === 'rangliste'
  const logo = svgAdresse(signetOhneMitte(logoSvg))
  const bild = h(
    'div',
    {
      style: {
        width: ZK_BREITE,
        height: ZK_HOEHE,
        display: 'flex',
        position: 'relative',
        backgroundColor: '#ffffff',
      },
    },
    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: KOPF_OBEN,
          left: 0,
          width: ZK_BREITE,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      },
      h('img', { src: logo, width: KOPF_LOGO, height: KOPF_LOGO }),
      h(
        'div',
        { style: { fontFamily: 'Open', fontSize: 27, color: SCHWARZ, marginLeft: 11 } },
        'IM Invests'
      )
    ),
    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: 120,
          left: 60,
          right: 60,
          display: 'flex',
          flexWrap: 'wrap',
          fontFamily: 'Anton',
          fontSize: rangliste ? RL_TITEL : 112,
          lineHeight: rangliste ? 1.1 : 1.12,
        },
      },
      ...k.titel.flatMap((stueck) =>
        stueck.text
          .split(' ')
          .filter(Boolean)
          .map((wort) =>
            h(
              'span',
              {
                style: {
                  color: stueck.gruen ? GRUEN : SCHWARZ,
                  marginRight: rangliste ? 24 : 26,
                },
              },
              wort
            )
          )
      )
    ),
    ...(k.art === 'rangliste' ? ranglistenGrafik(k) : vergleichsGrafik(k)),
    h('div', {
      style: {
        position: 'absolute',
        left: 40,
        right: 40,
        top: ZK_HOEHE - 74,
        height: 2,
        backgroundColor: '#333',
      },
    }),
    h(
      'div',
      {
        style: {
          position: 'absolute',
          left: 44,
          top: ZK_HOEHE - 62,
          fontFamily: 'Open',
          fontSize: 22,
          color: GRAU,
        },
      },
      k.fusszeile
    )
  )

  const antwort = new ImageResponse(bild, {
    width: ZK_BREITE,
    height: ZK_HOEHE,
    fonts: schriften(),
  })
  return Buffer.from(await antwort.arrayBuffer())
}

function vergleichsGrafik(k: Vergleichskarte) {
  const mass = HOECHSTER / Math.max(k.links.wert, k.rechts.wert)
  const hL = k.links.wert * mass
  const hR = k.rechts.wert * mass

  const wertKopf = (x: number, oben: number, s: Seite) =>
    h(
      'div',
      {
        style: {
          position: 'absolute',
          left: x - 40,
          top: oben - 128,
          width: BALKEN + 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
      },
      h(
        'div',
        {
          style: {
            fontFamily: 'Open',
            fontWeight: 800,
            fontStyle: 'italic',
            fontSize: 56,
            color: SCHWARZ,
            lineHeight: 1.1,
          },
        },
        s.anzeige
      ),
      h(
        'div',
        { style: { fontFamily: 'Open', fontWeight: 700, fontSize: 30, color: SCHWARZ } },
        s.zusatz
      )
    )
  const gestrichelt = (y: number) =>
    h('div', {
      style: {
        position: 'absolute',
        left: XL + BALKEN,
        top: y,
        width: LUECKE,
        height: 0,
        borderTop: '4px dashed #000',
      },
    })

  return [
    h('div', {
      style: {
        position: 'absolute',
        left: XL,
        top: BODEN - hL,
        width: BALKEN,
        height: hL,
        backgroundColor: SCHWARZ,
      },
    }),
    h('div', {
      style: {
        position: 'absolute',
        left: XR,
        top: BODEN - hR,
        width: BALKEN,
        height: hR,
        backgroundColor: GRUEN,
      },
    }),
    wertKopf(XL, BODEN - hL, k.links),
    wertKopf(XR, BODEN - hR, k.rechts),
    gestrichelt(BODEN - hR),
    gestrichelt(BODEN - hL),
    h(
      'div',
      {
        style: {
          position: 'absolute',
          left: XL + BALKEN,
          top: BODEN - (hR + hL) / 2 - 52,
          width: LUECKE,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
      },
      h(
        'div',
        { style: { fontFamily: 'Open', fontWeight: 700, fontSize: 46, color: ROT } },
        k.differenz.text
      ),
      h(
        'div',
        { style: { fontFamily: 'Open', fontWeight: 700, fontSize: 22, color: SCHWARZ } },
        k.differenz.zusatz
      )
    ),
    h('div', {
      style: {
        position: 'absolute',
        left: 50,
        right: 50,
        top: BODEN,
        height: 3,
        backgroundColor: '#555',
      },
    }),
    ...[
      { x: XL, s: k.links },
      { x: XR, s: k.rechts },
    ].map(({ x, s }) =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            left: x - 60,
            top: BODEN + 24,
            width: BALKEN + 120,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          },
        },
        h(
          'div',
          {
            style: {
              fontFamily: 'Open',
              fontWeight: 700,
              fontSize: 36,
              color: SCHWARZ,
              marginBottom: 18,
            },
          },
          s.name
        ),
        ...(s.flagge ? [flagge({ streifen: s.flagge }, 86, 3)] : [])
      )
    ),
  ]
}

/** Zehn Häuschen, das letzte anteilig – 47,2 % sind vier volle und eins zu 72 %. */
function haeuser(wert: number, farbe: string) {
  return h(
    'div',
    { style: { display: 'flex' } },
    ...Array.from({ length: 10 }, (_, i) => {
      const anteil = Math.max(0, Math.min(1, wert / 10 - i))
      return h(
        'div',
        {
          style: {
            position: 'relative',
            width: HAUS,
            height: HAUS,
            marginRight: HAUS_ABSTAND,
            display: 'flex',
          },
        },
        h('img', {
          src: haus(LEER),
          width: HAUS,
          height: HAUS,
          style: { position: 'absolute', left: 0, top: 0 },
        }),
        ...(anteil > 0
          ? [
              h(
                'div',
                {
                  style: {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: HAUS * anteil,
                    height: HAUS,
                    overflow: 'hidden',
                    display: 'flex',
                  },
                },
                h('img', { src: haus(farbe), width: HAUS, height: HAUS })
              ),
            ]
          : [])
      )
    })
  )
}

/** Ein Balken, gemessen am größten Wert der Liste – mindestens ein Strich. */
function balken(wert: number, groesster: number, farbe: string) {
  return h(
    'div',
    { style: { display: 'flex', width: RL_BALKEN, height: 34 } },
    h('div', {
      style: {
        width: Math.max(4, (RL_BALKEN * wert) / groesster),
        height: 34,
        borderRadius: 4,
        backgroundColor: farbe,
      },
    })
  )
}

function ranglistenGrafik(k: Rangkarte) {
  const mitBalken = k.skala === 'balken'
  const groesster = Math.max(...k.zeilen.map((z) => z.wert))
  const hundert = RL_BALKEN_X + (RL_BALKEN * 100) / groesster
  const hoehe = zeilenhoehe(k.zeilen.length)
  const zeile = (z: Rang, i: number) => {
    const farbe = z.hervor ? GRUEN : z.schnitt ? MITTELGRAU : SCHWARZ
    return h(
      'div',
      {
        style: {
          position: 'absolute',
          left: 40,
          right: 40,
          top: RL_OBEN + i * hoehe,
          height: hoehe - 6,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 18,
          paddingRight: 18,
          borderRadius: 14,
          backgroundColor: z.hervor ? '#e3eddc' : 'transparent',
          border: z.schnitt
            ? '3px dashed #777'
            : z.hervor
              ? `3px solid ${GRUEN}`
              : '3px solid transparent',
        },
      },
      flagge(FLAGGEN[z.land] ?? { streifen: [LEER] }, 46, 2),
      h(
        'div',
        {
          style: {
            width: 250,
            marginLeft: 16,
            fontFamily: 'Open',
            fontWeight: 700,
            fontSize: 30,
            color: farbe,
          },
        },
        z.name
      ),
      mitBalken
        ? balken(z.wert, groesster, z.schnitt ? '#777777' : farbe)
        : haeuser(z.wert, z.schnitt ? '#777777' : farbe),
      h(
        'div',
        {
          style: {
            marginLeft: 'auto',
            fontFamily: 'Open',
            fontWeight: 800,
            fontStyle: 'italic',
            fontSize: 36,
            color: farbe,
          },
        },
        `${zahl(z.wert)} %`
      )
    )
  }

  return [
    h(
      'div',
      {
        style: {
          position: 'absolute',
          top: RL_UNTERZEILE,
          left: 60,
          right: 60,
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'Open',
          fontWeight: 700,
          fontSize: 28,
          color: GRAU,
        },
      },
      k.unterzeile,
      ...(mitBalken
        ? []
        : [
            h('img', {
              src: haus(SCHWARZ),
              width: 30,
              height: 30,
              style: { marginLeft: 12 },
            }),
            h('div', { style: { marginLeft: 8, fontWeight: 400 } }, '= 10 %'),
          ])
    ),
    /* Die 100-%-Linie: links davon weniger Schulden als ein Jahr Wirtschaftsleistung. */
    ...(mitBalken && groesster > 100
      ? [
          h('div', {
            style: {
              position: 'absolute',
              left: hundert - 1,
              top: RL_OBEN - 14,
              width: 0,
              height: k.zeilen.length * hoehe + 8,
              borderLeft: '3px dashed #777',
            },
          }),
          h(
            'div',
            {
              style: {
                position: 'absolute',
                left: hundert - 60,
                top: RL_OBEN - 44,
                width: 120,
                display: 'flex',
                justifyContent: 'center',
                fontFamily: 'Open',
                fontWeight: 700,
                fontSize: 22,
                color: MITTELGRAU,
              },
            },
            '100 %'
          ),
        ]
      : []),
    ...k.zeilen.map(zeile),
  ]
}
