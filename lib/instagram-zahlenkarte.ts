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
  /** Statt `flagge`: ein Schlüssel in `FLAGGEN` – auch für Flaggen ohne Streifen (USA). */
  land?: string
}

interface KarteGemeinsam {
  /** Erscheinungstag, JJJJ-MM-TT. */
  datum: string
  /**
   * Die Überschrift in Stücken; `gruen` hebt die Pointe hervor – in der
   * Akzentfarbe des Tages (`akzentfarbe()`), seit dem 18.10.2026 nicht mehr
   * immer grün. Der Feldname blieb, damit die Karten im Bestand gelten.
   */
  titel: { text: string; gruen?: boolean }[]
  /** Unter der Linie, klein: „Stand: 2025 | Quelle: Eurostat …" */
  fusszeile: string
  /** Aufhänger, ein bis zwei Absätze, „Quellen: …" – ohne Rechtshinweis. */
  text: string
  /** Genau fünf, klein, ohne `#`. */
  schlagworte: string[]
  /**
   * Der Tag der Freigabe durch den Betreiber – erst dann geht die Karte
   * hinaus, und auch dann frühestens um 15 Uhr (`lib/zahlenkarten-wecker.ts`).
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
  /** Schlüssel in `FLAGGEN`: ISO-3, „EU27" oder „WELT" (Schnitt aller Länder). */
  land: string
  /** Die Zeile, um die es geht – dunkelgrün, umrandet. Genau eine. */
  hervor?: boolean
  /** Ein Durchschnitt, eingereiht – grau, gestrichelt. */
  schnitt?: boolean
  /** Nur Zeitleiste: die zweite Zahl unter dem Namen, etwa „Einbruch −86 %". */
  zusatz?: string
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
   * Die Balken zeigen eine gestrichelte Linie bei 100 %. Kacheln: ein
   * Raster aus Karten mit großer Zahl, zwei Spalten, ohne Grafik.
   */
  skala?: 'haeuser' | 'balken' | 'kacheln' | 'zeitleiste' | 'burger'
  /**
   * Was hinter der Zahl steht – voreingestellt „ %". Leer für Größen ohne
   * Einheit wie die Geburtenziffer (1,36 Kinder je Frau; die Einheit steht
   * dann in der Unterzeile). Nur mit Balken: Häuschen zählen Prozent.
   */
  einheit?: string
  /** Nachkommastellen der Werte – voreingestellt eine; die Geburtenziffer braucht zwei. */
  stellen?: number
  /**
   * Zwei, drei Sätze zwischen Überschrift und Unterzeile: was die Zahl ist,
   * von wem, seit wann. Betreiber, 26.10.2026, zum Big-Mac-Index: „Leute,
   * die davon das erste Mal hören, denken sonst, was ist das für ein …".
   * Nur bei zweizeiliger Überschrift – die dritte Zeile bräuchte den Platz.
   */
  erklaerung?: string
}

/** Eine Linie im Verlauf – ein Index oder Wert aus dem Kursbestand. */
export interface Verlaufreihe {
  name: string
  /** Symbol im Kursbestand (`data/markets.ts`). */
  symbol: string
  /** Schlüssel in `FLAGGEN`, am Ende der Linie. */
  land?: string
  /** Die Linie in der Akzentfarbe – genau eine; die andere ist schwarz. */
  akzent?: boolean
  /** So steht der Endwert am Linienende: „+11,9 %" – derselbe wie im Text. */
  endwert: string
}

/**
 * Zwei Linien seit Jahresbeginn, in Prozent (18.10.2026). Der Betreiber zum
 * Vergleich mit zwei Balken: „nein, mit Chart vergleich, bissl kreativer
 * werden!!"
 */
export interface Verlaufkarte extends KarteGemeinsam {
  art: 'verlauf'
  unterzeile: string
  /** Letzter Handelstag, der zählt – spätere Kurse bleiben draußen. */
  bis: string
  reihen: Verlaufreihe[]
}

/** Eine Seite im Duell: Schlusskurse eines Zeitraums, Tag für Tag. */
export interface Duellseite {
  name: string
  /** Kleine Zeile unter dem Namen: „Schweizer Leitindex". */
  zusatz: string
  land?: string
  /** Schlusskurse, alt nach neu; der erste ist der Bezug (0 %). */
  punkte: { t: string; wert: number }[]
}

/**
 * Zwei kleine Charts nebeneinander und die Differenz in einem Kasten
 * (19.10.2026, nach dem Vorbild HKCM „Konsumaktien schlagen Tech um 12,7
 * Prozentpunkte"). Steigt eine Seite, ist ihre Linie grün, fällt sie, rot –
 * die Logotöne; die Differenz steht in der Akzentfarbe.
 */
export interface Duellkarte extends KarteGemeinsam {
  art: 'duell'
  unterzeile: string
  links: Duellseite
  rechts: Duellseite
}

export type Zahlenkarte = Vergleichskarte | Rangkarte | Verlaufkarte | Duellkarte

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
  /** Farbe des Kürzels, sonst Gelb wie die Sterne der EU. */
  kuerzelFarbe?: string
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
/* Türkei (20.10.2026): Halbmond aus zwei Kreisen, Stern mit der Spitze zum Mond. */
const FLAGGE_TUERKEI = quadrat(
  '<rect width="60" height="60" fill="#E30A17"/><circle cx="25" cy="30" r="14" fill="#fff"/>' +
    '<circle cx="28.5" cy="30" r="11.2" fill="#E30A17"/><polygon points="35.00,30.00 39.73,28.35 39.84,23.34 42.87,27.34 47.66,25.89 44.80,30.00 47.66,34.11 42.87,32.66 39.84,36.66 39.73,31.65" fill="#fff"/>'
)
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

/** Ein fünfzackiger Stern als Pfad – für China. */
const stern = (cx: number, cy: number, r: number, drehung = 0) =>
  `<path d="${Array.from({ length: 10 }, (_, i) => {
    const w = drehung + (Math.PI * i) / 5 - Math.PI / 2
    const ri = i % 2 ? r * 0.38 : r
    return `${i ? 'L' : 'M'}${(cx + ri * Math.cos(w)).toFixed(2)} ${(cy + ri * Math.sin(w)).toFixed(2)}`
  }).join(' ')}Z" fill="#FFDE00"/>`
const FLAGGE_CHINA = quadrat(
  '<rect width="60" height="60" fill="#EE1C25"/>' +
    stern(16, 18, 9) +
    stern(28, 8, 2.6, 0.4) +
    stern(32, 14, 2.6, 0.9) +
    stern(32, 22, 2.6, 0) +
    stern(28, 28, 2.6, 0.4)
)
const FLAGGE_ISRAEL = quadrat(
  '<rect width="60" height="60" fill="#fff"/>' +
    '<rect y="9" width="60" height="7" fill="#0038B8"/><rect y="44" width="60" height="7" fill="#0038B8"/>' +
    '<path d="M30 19 L39.5 35.5 L20.5 35.5 Z M30 41 L20.5 24.5 L39.5 24.5 Z" fill="none" stroke="#0038B8" stroke-width="2.4"/>'
)
const FLAGGE_INDIEN = quadrat(
  '<rect width="60" height="20" fill="#FF9933"/><rect y="20" width="60" height="20" fill="#fff"/>' +
    '<rect y="40" width="60" height="20" fill="#138808"/>' +
    '<circle cx="30" cy="30" r="7" fill="none" stroke="#000080" stroke-width="1.6"/><circle cx="30" cy="30" r="1.6" fill="#000080"/>'
)
/* Südkorea: das Taegeuk (rot oben, blau unten) und die vier Trigramme als Striche. */
const FLAGGE_SUEDKOREA = quadrat(
  '<rect width="60" height="60" fill="#fff"/>' +
    '<path d="M18 30 A12 12 0 0 1 42 30 A6 6 0 0 1 30 30 A6 6 0 0 0 18 30 Z" fill="#CD2E3A"/>' +
    '<path d="M18 30 A6 6 0 0 0 30 30 A6 6 0 0 1 42 30 A12 12 0 0 1 18 30 Z" fill="#0047A0"/>' +
    [
      [10, 12, 45],
      [50, 12, -45],
      [10, 48, -45],
      [50, 48, 45],
    ]
      .map(
        ([x, y, w]) =>
          `<g transform="rotate(${w} ${x} ${y})">${[-3.5, 0, 3.5]
            .map(
              (d) =>
                `<rect x="${x - 5}" y="${y + d - 1}" width="10" height="2" fill="#000"/>`
            )
            .join('')}</g>`
      )
      .join('')
)

const FLAGGE_GROSSBRITANNIEN = quadrat(
  '<rect width="60" height="60" fill="#012169"/>' +
    '<path d="M0 0 L60 60 M60 0 L0 60" stroke="#fff" stroke-width="12"/>' +
    '<path d="M0 0 L60 60 M60 0 L0 60" stroke="#C8102E" stroke-width="4"/>' +
    '<path d="M30 0 V60 M0 30 H60" stroke="#fff" stroke-width="18"/>' +
    '<path d="M30 0 V60 M0 30 H60" stroke="#C8102E" stroke-width="10"/>'
)

const SYMBOL_OEL = quadrat(
  '<rect width="60" height="60" fill="#1b1b1b"/>' +
    '<path d="M30 12 C30 12 18 28 18 36 A12 12 0 0 0 42 36 C42 28 30 12 30 12 Z" fill="#fff"/>'
)

const FLAGGE_SCHWEIZ = quadrat(
  '<rect width="60" height="60" fill="#DA291C"/>' +
    '<rect x="25" y="12" width="10" height="36" fill="#fff"/><rect x="12" y="25" width="36" height="10" fill="#fff"/>'
)

/* Norwegen (26.10.2026, Big-Mac-Index): das skandinavische Kreuz, rot mit weiß-blauem Kreuz. */
const FLAGGE_NORWEGEN = quadrat(
  '<rect width="60" height="60" fill="#BA0C2F"/>' +
    '<rect x="16" width="14" height="60" fill="#fff"/><rect y="23" width="60" height="14" fill="#fff"/>' +
    '<rect x="20" width="6" height="60" fill="#00205B"/><rect y="27" width="60" height="6" fill="#00205B"/>'
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
  /* Keine Länder: Rohstoffe und Bitcoin als Zeichen im Kreis (19.10.2026). */
  OEL: { streifen: ['#1b1b1b'], svg: SYMBOL_OEL },
  GOLD: { streifen: ['#C9A227'], kuerzel: 'Au', kuerzelFarbe: '#FFFFFF' },
  SILBER: { streifen: ['#A7A9AC'], kuerzel: 'Ag', kuerzelFarbe: '#FFFFFF' },
  BTC: { streifen: ['#F7931A'], kuerzel: 'BTC', kuerzelFarbe: '#FFFFFF' },
  CHE: { streifen: ['#DA291C'], svg: FLAGGE_SCHWEIZ },
  BEL: { streifen: ['#000000', '#FAE042', '#ED2939'], senkrecht: true },
  CHN: { streifen: ['#EE1C25'], svg: FLAGGE_CHINA },
  DEU: { streifen: ['#000000', '#DD0000', '#FFCE00'] },
  ESP: { streifen: ['#AA151B', '#F1BF00', '#AA151B'], gewichte: [1, 2, 1] },
  EU27: { streifen: ['#003399'], kuerzel: 'EU' },
  WELT: { streifen: ['#555555'], kuerzel: 'Ø', kuerzelFarbe: '#FFFFFF' },
  FRA: { streifen: ['#002395', '#FFFFFF', '#ED2939'], senkrecht: true },
  HUN: { streifen: ['#CE2939', '#FFFFFF', '#477050'] },
  /* Großbritannien: das Kreuz des Union Jack, ohne die Diagonalen der Einzelflaggen. */
  GBR: { streifen: ['#012169'], svg: FLAGGE_GROSSBRITANNIEN },
  IND: { streifen: ['#FF9933'], svg: FLAGGE_INDIEN },
  IRL: { streifen: ['#169B62', '#FFFFFF', '#FF883E'], senkrecht: true },
  ISR: { streifen: ['#FFFFFF'], svg: FLAGGE_ISRAEL },
  ITA: { streifen: ['#009246', '#FFFFFF', '#CE2B37'], senkrecht: true },
  JPN: { streifen: ['#FFFFFF'], svg: FLAGGE_JAPAN },
  KOR: { streifen: ['#FFFFFF'], svg: FLAGGE_SUEDKOREA },
  LUX: { streifen: ['#EF3340', '#FFFFFF', '#00A3E0'] },
  LVA: { streifen: ['#9E3039', '#FFFFFF', '#9E3039'], gewichte: [2, 1, 2] },
  LIE: { streifen: ['#002B7F'], svg: FLAGGE_LIECHTENSTEIN },
  NLD: { streifen: ['#AE1C28', '#FFFFFF', '#21468B'] },
  NOR: { streifen: ['#BA0C2F'], svg: FLAGGE_NORWEGEN },
  POL: { streifen: ['#FFFFFF', '#DC143C'] },
  ROU: { streifen: ['#002B7F', '#FCD116', '#CE1126'], senkrecht: true },
  SVK: { streifen: ['#FFFFFF', '#0B4EA2', '#EE1C25'], wappen: WAPPEN_SLOWAKEI },
  /* Tschad: Streifen wie Rumänien, im Blau dunkler – so ist die Flagge. */
  TCD: { streifen: ['#002664', '#FECB00', '#C60C30'], senkrecht: true },
  TUR: { streifen: ['#E30A17'], svg: FLAGGE_TUERKEI },
  USA: { streifen: ['#B22234'], svg: FLAGGE_USA },
  VEN: { streifen: ['#FFCC00'], svg: FLAGGE_VENEZUELA },
}

const SCHWARZ = '#000000'
/*
  Die Akzentfarbe wechselt täglich durch die vier Farben des Logos – der
  Betreiber am 17.10.2026: „die Schriftfarben der Beiträge nicht nur grün,
  sondern abwechselnd mit den Farben aus dem Logo. Anthrazit, Navyblau und
  Rot … die gleichen Farbtöne." Die Werte stehen so in `public/logo.svg`;
  der Test vergleicht sie. Reihenfolge ab dem 17.10.2026 (grün): Grün,
  Navy, Rot, Anthrazit, dann wieder Grün.
*/
export const LOGOFARBEN = ['#205437', '#17296F', '#8B2225', '#6E6E6E'] as const
const FARBE_AB = Date.UTC(2026, 9, 17)

/** Die Akzentfarbe einer Karte – aus ihrem Datum, also stabil bei jedem Neubau. */
export function akzentfarbe(datum: string): string {
  const tage = Math.round((Date.parse(`${datum}T00:00:00Z`) - FARBE_AB) / 86_400_000)
  return LOGOFARBEN[((tage % 4) + 4) % 4]
}

/** Dieselbe Farbe, stark aufgehellt – der Grund der hervorgehobenen Zeile. */
function hell(farbe: string): string {
  const kanal = (i: number) =>
    Math.round(parseInt(farbe.slice(i, i + 2), 16) * 0.13 + 255 * 0.87)
      .toString(16)
      .padStart(2, '0')
  return `#${kanal(1)}${kanal(3)}${kanal(5)}`
}
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
/** Drei Zeilen Open Sans 25 px zwischen Überschrift und Unterzeile. */
export const ERKLAERUNG_MAX = 210
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
  if (!k.titel.some((t) => t.gruen))
    f.push('Die Überschrift braucht eine Pointe in der Akzentfarbe (`gruen`).')
  const zeichen = k.titel.map((t) => t.text).join(' ').length
  if (zeichen > 48)
    f.push(`Überschrift hat ${zeichen} Zeichen – mehr als drei Zeilen Anton.`)
  if (k.art === 'rangliste') f.push(...pruefeRangliste(k))
  else if (k.art === 'duell') {
    for (const sei of [k.links, k.rechts]) {
      if (sei.punkte.length < 3) f.push(`${sei.name}: zu wenige Kurse.`)
      if (sei.land && !FLAGGEN[sei.land])
        f.push(`${sei.name}: keine Flagge für „${sei.land}".`)
    }
  } else if (k.art === 'verlauf') {
    if (k.reihen.length < 2 || k.reihen.length > 3)
      f.push('Ein Verlauf trägt zwei oder drei Linien.')
    if (k.reihen.filter((r) => r.akzent).length !== 1)
      f.push('Genau eine Linie in der Akzentfarbe.')
    for (const r of k.reihen)
      if (r.land && !FLAGGEN[r.land]) f.push(`${r.name}: keine Flagge für „${r.land}".`)
  } else
    for (const s of [k.links, k.rechts]) {
      if (!(s.wert > 0)) f.push(`${s.name}: Wert muss größer als null sein.`)
      if (s.land && !FLAGGEN[s.land]) f.push(`${s.name}: keine Flagge für „${s.land}".`)
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
  /* Kacheln stehen in zwei Spalten – zwölf sind sechs Reihen. */
  const hoechstens = k.skala === 'kacheln' ? 12 : RL_ZEILEN_MAX
  if (n < 4 || n > hoechstens)
    f.push(`${n} Zeilen – die Rangliste trägt vier bis ${hoechstens}.`)
  if (k.zeilen.filter((z) => z.hervor).length !== 1)
    f.push('Die Rangliste braucht genau eine hervorgehobene Zeile.')
  if (k.zeilen.filter((z) => z.schnitt).length > 1) f.push('Höchstens ein Schnitt.')
  if (!k.unterzeile.trim()) f.push('Die Unterzeile fehlt.')
  if (k.erklaerung !== undefined) {
    if (k.erklaerung.length > ERKLAERUNG_MAX)
      f.push(
        `Erklärung hat ${k.erklaerung.length} Zeichen – höchstens ${ERKLAERUNG_MAX}, drei Zeilen.`
      )
    const titel = k.titel.map((t) => t.text).join(' ').length
    if (titel > 38)
      f.push(
        `Mit Erklärung höchstens 38 Zeichen Überschrift (zwei Zeilen) – sind ${titel}.`
      )
  }
  if (k.skala === 'burger' && k.zeilen.some((z) => z.wert > 10))
    f.push('Ein Burger je Einheit, höchstens zehn – größere Werte mit Balken.')
  if (k.einheit !== undefined && (k.skala ?? 'haeuser') === 'haeuser')
    f.push(
      "Eine andere Einheit als Prozent nur mit skala: 'balken' – Häuschen zählen Prozent."
    )
  for (const [i, z] of k.zeilen.entries()) {
    if (!(z.wert > 0) && !(k.skala === 'balken' && z.wert < 0))
      f.push(
        `${z.name}: ${z.wert} – der Wert muss größer als null sein (negativ nur mit Balken).`
      )
    else if ((k.skala ?? 'haeuser') === 'haeuser' && z.wert > 100)
      f.push(
        `${z.name}: ${z.wert} – ein Häuschen je zehn Prozent, also 0 bis 100; darüber skala: 'balken'.`
      )
    if (!FLAGGEN[z.land]) f.push(`${z.name}: keine Flagge für „${z.land}" in FLAGGEN.`)
    /* Eine Zeitleiste steht in der Reihenfolge der Zeit, nicht der Größe. */
    if (k.skala !== 'zeitleiste' && i > 0 && z.wert > k.zeilen[i - 1].wert)
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
                  fontSize: Math.round(groesse * (fl.kuerzel.length === 1 ? 0.6 : 0.35)),
                  color: fl.kuerzelFarbe ?? '#FFCC00',
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

/*
  Ein Burger (26.10.2026, Big-Mac-Index – Betreiber: „werde mal ein bisschen
  kreativer"): Brötchen oben, Salat, Fleisch, Brötchen unten, in einer Farbe.
*/
const burger = (farbe: string) =>
  svgAdresse(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">' +
      `<path d="M4 17 C4 7 36 7 36 17 Z" fill="${farbe}"/>` +
      `<path d="M3 20 L37 20 L34 23 L29 20.5 L24 23 L19 20.5 L14 23 L9 20.5 L5 23 Z" fill="${farbe}" opacity="0.55"/>` +
      `<rect x="4" y="24" width="32" height="6" rx="3" fill="${farbe}"/>` +
      `<path d="M5 32 L35 32 C35 36 33 37 30 37 L10 37 C7 37 5 36 5 32 Z" fill="${farbe}"/></svg>`
  )

const haus = (farbe: string) =>
  svgAdresse(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">' +
      `<path d="M20 3 L38 19 L33 19 L33 37 L7 37 L7 19 L2 19 Z" fill="${farbe}"/></svg>`
  )

/* Deutsch gesetzt, mit Tausenderpunkt – „812.822" für das Vermögen. */
const zahl = (w: number, stellen = 1) =>
  w.toLocaleString('de-DE', {
    minimumFractionDigits: stellen,
    maximumFractionDigits: stellen,
  })

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
  const rangliste = k.art !== undefined && k.art !== 'vergleich'
  const grafik =
    k.art === 'verlauf'
      ? await verlaufGrafik(k)
      : k.art === 'duell'
        ? duellGrafik(k)
        : k.art === 'rangliste'
          ? ranglistenGrafik(k)
          : vergleichsGrafik(k)
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
                  color: stueck.gruen ? akzentfarbe(k.datum) : SCHWARZ,
                  marginRight: rangliste ? 24 : 26,
                },
              },
              wort
            )
          )
      )
    ),
    ...(k.art === 'rangliste' && k.erklaerung
      ? [
          h(
            'div',
            {
              style: {
                position: 'absolute',
                top: 362,
                left: 60,
                right: 60,
                display: 'flex',
                fontFamily: 'Open',
                fontSize: 25,
                lineHeight: 1.3,
                color: GRAU,
              },
            },
            k.erklaerung
          ),
        ]
      : []),
    ...grafik,
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
        backgroundColor: akzentfarbe(k.datum),
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
        ...(s.land && FLAGGEN[s.land]
          ? [flagge(FLAGGEN[s.land], 86, 3)]
          : s.flagge
            ? [flagge({ streifen: s.flagge }, 86, 3)]
            : [])
      )
    ),
  ]
}

/**
 * Zehn Häuschen, das letzte anteilig – 47,2 % sind vier volle und eins zu 72 %.
 * Mit `symbol` und `je` dieselbe Reihe aus anderen Zeichen: zehn Burger, einer
 * je Euro (7,91 € sind sieben volle und einer zu 91 %).
 */
function haeuser(wert: number, farbe: string, symbol = haus, je = 10) {
  return h(
    'div',
    { style: { display: 'flex' } },
    ...Array.from({ length: 10 }, (_, i) => {
      const anteil = Math.max(0, Math.min(1, wert / je - i))
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
          src: symbol(LEER),
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
                h('img', { src: symbol(farbe), width: HAUS, height: HAUS })
              ),
            ]
          : [])
      )
    })
  )
}

/** Ein Balken, gemessen am größten Wert der Liste – mindestens ein Strich. */
/*
  Negative Werte (19.10.2026, „Öl schlägt alles"): Die Null steht dort, wo
  der kleinste Wert Platz lässt; Plus geht nach rechts, Minus nach links.
*/
function balken(wert: number, groesster: number, farbe: string, kleinster = 0) {
  const spanne = groesster - Math.min(kleinster, 0)
  const null_ = (RL_BALKEN * -Math.min(kleinster, 0)) / spanne
  const breite = Math.max(4, (RL_BALKEN * Math.abs(wert)) / spanne)
  return h(
    'div',
    { style: { display: 'flex', width: RL_BALKEN, height: 34 } },
    h('div', {
      style: {
        marginLeft: wert < 0 ? null_ - breite : null_,
        width: breite,
        height: 34,
        borderRadius: 4,
        backgroundColor: farbe,
      },
    })
  )
}

/*
  Die Kacheln (18.10.2026): Der Betreiber zur zweiten Balkenkarte in Folge:
  „gleiche Beitragsart vom Design her wie gestern … Das soll sich
  durchrotieren, genauso wie die Farben. Sonst wirkt das langweilig."
  Zwei Spalten, je Land eine Karte mit Flagge, Name und großer Zahl; die
  hervorgehobene ist in der Akzentfarbe gefüllt, der Schnitt gestrichelt.
*/
function kachelGrafik(k: Rangkarte) {
  const akzent = akzentfarbe(k.datum)
  const spalten = 2
  const reihen = Math.ceil(k.zeilen.length / spalten)
  const luecke = 18
  const breite = (ZK_BREITE - 80 - luecke) / spalten
  const hoehe = Math.min(150, Math.floor((RL_UNTEN + 20 - RL_OBEN) / reihen) - luecke)
  const karte = (z: Rang, i: number) => {
    const farbe = z.hervor ? '#ffffff' : z.schnitt ? MITTELGRAU : SCHWARZ
    return h(
      'div',
      {
        style: {
          position: 'absolute',
          left: 40 + (i % spalten) * (breite + luecke),
          top: RL_OBEN - 20 + Math.floor(i / spalten) * (hoehe + luecke),
          width: breite,
          height: hoehe,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 28,
          paddingRight: 22,
          borderRadius: 22,
          backgroundColor: z.hervor ? akzent : z.schnitt ? '#ffffff' : '#f1f3f0',
          border: z.schnitt
            ? '3px dashed #777'
            : `3px solid ${z.hervor ? akzent : '#f1f3f0'}`,
        },
      },
      /* Keine Rangnummer: Die Auswahl ist nicht die Rangliste – Deutschland
         stünde als „6." da und ist weltweit 183. */
      flagge(FLAGGEN[z.land] ?? { streifen: [LEER] }, 58, z.hervor ? 3 : 2),
      h(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            marginLeft: 16,
          },
        },
        h(
          'div',
          { style: { fontFamily: 'Open', fontWeight: 700, fontSize: 26, color: farbe } },
          z.name
        ),
        h(
          'div',
          {
            style: {
              fontFamily: 'Open',
              fontWeight: 800,
              fontStyle: 'italic',
              fontSize: 50,
              lineHeight: 1.05,
              color: farbe,
            },
          },
          `${zahl(z.wert, k.stellen)}${k.einheit ?? ' %'}`
        )
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
          fontFamily: 'Open',
          fontWeight: 700,
          fontSize: 28,
          color: GRAU,
        },
      },
      k.unterzeile
    ),
    ...k.zeilen.map(karte),
  ]
}

/**
 * Die Form einer Karte – zwei Tage hintereinander nie dieselbe (Betreiber,
 * 18.10.2026: „Das soll sich durchrotieren, genauso wie die Farben").
 */
export function form(
  k: Zahlenkarte
):
  | 'vergleich'
  | 'haeuser'
  | 'balken'
  | 'kacheln'
  | 'zeitleiste'
  | 'burger'
  | 'verlauf'
  | 'duell' {
  if (k.art === 'verlauf' || k.art === 'duell') return k.art
  return k.art === 'rangliste' ? (k.skala ?? 'haeuser') : 'vergleich'
}

/**
 * Die Zeitleiste: je Zeile ein Ereignis, eine Spur von null bis zum größten
 * Wert und darauf die Strecke dieser Zeile mit einem Punkt am Ende – für
 * Dauern („25 Jahre bis zum alten Hoch"). Unter dem Namen steht `zusatz`,
 * die zweite Zahl des Ereignisses. Eingeführt am 24.10.2026 für „Nach dem
 * Crash" (Betreiber: „kreativer werden, mal was Neues").
 */
function zeitleisteGrafik(k: Rangkarte) {
  const akzent = akzentfarbe(k.datum)
  const groesster = Math.max(...k.zeilen.map((z) => z.wert))
  const hoehe = Math.min(118, Math.floor((RL_UNTEN + 30 - RL_OBEN) / k.zeilen.length))
  const spurX = 370
  const spurBreite = ZK_BREITE - 40 - spurX - 240
  const zeile = (z: Rang, i: number) => {
    const farbe = z.hervor ? akzent : SCHWARZ
    const laenge = Math.max(16, (spurBreite * z.wert) / groesster)
    const oben = RL_OBEN - 30 + i * hoehe
    return [
      h('div', {
        style: {
          position: 'absolute',
          left: 40,
          right: 40,
          top: oben,
          height: hoehe - 10,
          borderRadius: 18,
          backgroundColor: z.hervor ? hell(akzent) : 'transparent',
          border: `3px solid ${z.hervor ? akzent : 'transparent'}`,
        },
      }),
      h(
        'div',
        {
          style: {
            position: 'absolute',
            left: 66,
            top: oben,
            height: hoehe - 10,
            width: spurX - 80,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          },
        },
        h(
          'div',
          { style: { fontFamily: 'Open', fontWeight: 800, fontSize: 29, color: farbe } },
          z.name
        ),
        ...(z.zusatz
          ? [
              h(
                'div',
                {
                  style: {
                    fontFamily: 'Open',
                    fontWeight: 700,
                    fontSize: 24,
                    color: ROT,
                  },
                },
                z.zusatz
              ),
            ]
          : [])
      ),
      /* Die Spur – grau, so lang wie der größte Wert. */
      h('div', {
        style: {
          position: 'absolute',
          left: spurX,
          top: oben + (hoehe - 10) / 2 - 4,
          width: spurBreite,
          height: 8,
          borderRadius: 4,
          backgroundColor: '#e3e5e1',
        },
      }),
      h('div', {
        style: {
          position: 'absolute',
          left: spurX,
          top: oben + (hoehe - 10) / 2 - 7,
          width: laenge,
          height: 14,
          borderRadius: 7,
          backgroundColor: farbe,
        },
      }),
      h('div', {
        style: {
          position: 'absolute',
          left: spurX + laenge - 13,
          top: oben + (hoehe - 10) / 2 - 13,
          width: 26,
          height: 26,
          borderRadius: 13,
          backgroundColor: '#ffffff',
          border: `6px solid ${farbe}`,
        },
      }),
      h(
        'div',
        {
          style: {
            position: 'absolute',
            right: 58,
            top: oben,
            height: hoehe - 10,
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'Open',
            fontWeight: 800,
            fontStyle: 'italic',
            fontSize: 38,
            color: farbe,
          },
        },
        `${zahl(z.wert, k.stellen)}${k.einheit ?? ' %'}`
      ),
    ]
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
          fontFamily: 'Open',
          fontWeight: 700,
          fontSize: 28,
          color: GRAU,
        },
      },
      k.unterzeile
    ),
    ...k.zeilen.flatMap(zeile),
  ]
}

function ranglistenGrafik(k: Rangkarte) {
  if (k.skala === 'kacheln') return kachelGrafik(k)
  if (k.skala === 'zeitleiste') return zeitleisteGrafik(k)
  const mitBalken = k.skala === 'balken'
  const akzent = akzentfarbe(k.datum)
  const groesster = Math.max(...k.zeilen.map((z) => z.wert), 0)
  const kleinster = Math.min(...k.zeilen.map((z) => z.wert), 0)
  const hundert = RL_BALKEN_X + (RL_BALKEN * 100) / groesster
  const nulllinie = RL_BALKEN_X + (RL_BALKEN * -kleinster) / (groesster - kleinster)
  const hoehe = zeilenhoehe(k.zeilen.length)
  const zeile = (z: Rang, i: number) => {
    const farbe = z.hervor
      ? akzent
      : z.schnitt
        ? MITTELGRAU
        : z.wert < 0
          ? '#8B2225'
          : SCHWARZ
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
          backgroundColor: z.hervor ? hell(akzent) : 'transparent',
          border: z.schnitt
            ? '3px dashed #777'
            : z.hervor
              ? `3px solid ${akzent}`
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
        ? balken(z.wert, groesster, z.schnitt ? '#777777' : farbe, kleinster)
        : k.skala === 'burger'
          ? haeuser(z.wert, z.schnitt ? '#777777' : farbe, burger, 1)
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
        `${kleinster < 0 && z.wert > 0 ? '+' : z.wert < 0 ? '−' : ''}${zahl(Math.abs(z.wert), k.stellen)}${k.einheit ?? ' %'}`
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
              src: k.skala === 'burger' ? burger(SCHWARZ) : haus(SCHWARZ),
              width: 30,
              height: 30,
              style: { marginLeft: 12 },
            }),
            h(
              'div',
              { style: { marginLeft: 8, fontWeight: 400 } },
              k.skala === 'burger' ? `= 1${k.einheit ?? ' %'}` : '= 10 %'
            ),
          ])
    ),
    /* Die Nulllinie, wenn es negative Werte gibt. */
    ...(mitBalken && kleinster < 0
      ? [
          h('div', {
            style: {
              position: 'absolute',
              left: nulllinie - 1,
              top: RL_OBEN - 10,
              width: 3,
              height: k.zeilen.length * hoehe + 4,
              backgroundColor: '#333',
            },
          }),
        ]
      : []),
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

/* ------------------------------------------------------------ Verlauf */

/**
 * Die Entwicklung seit Jahresbeginn in Prozent – aus dem Kursbestand.
 * Bezug ist der Jahresschluss, so wie `ytdPercent` ihn rechnet; der
 * Schlusskurs des Stichtags kommt aus dem Kurs, wenn die Tagesreihe ihn noch
 * nicht trägt. Was nach `bis` liegt, bleibt draußen.
 */
export async function verlaufSeitJahresbeginn(
  symbol: string,
  bis: string
): Promise<{ t: string; prozent: number }[]> {
  const { getQuote, getSeries } = await import('@/lib/markets')
  const [reihe, kurs] = await Promise.all([getSeries(symbol, '1J'), getQuote(symbol)])
  if (!kurs) return []
  const jahr = bis.slice(0, 4)
  const basis = kurs.value / (1 + kurs.ytdPercent / 100)
  const punkte = reihe
    .filter((p) => p.t.slice(0, 4) === jahr && p.t.slice(0, 10) <= bis)
    .map((p) => ({ t: p.t.slice(0, 10), wert: p.value }))
  const kursTag = kurs.asOf.slice(0, 10)
  if (kursTag === bis && punkte.at(-1)?.t !== bis)
    punkte.push({ t: bis, wert: kurs.value })
  return [
    { t: `${Number(jahr) - 1}-12-31`, prozent: 0 },
    ...punkte.map((p) => ({ t: p.t, prozent: (p.wert / basis - 1) * 100 })),
  ]
}

const MONATE = [
  'Jan',
  'Feb',
  'Mär',
  'Apr',
  'Mai',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Okt',
  'Nov',
  'Dez',
]

async function verlaufGrafik(k: Verlaufkarte) {
  const akzent = akzentfarbe(k.datum)
  const reihen = await Promise.all(
    k.reihen.map(async (r) => ({
      ...r,
      punkte: await verlaufSeitJahresbeginn(r.symbol, k.bis),
    }))
  )
  const alle = reihen.flatMap((r) => r.punkte.map((p) => p.prozent))
  const roh = Math.max(...alle) - Math.min(...alle, 0)
  const schritt = [2, 2.5, 5, 10, 20, 25, 50].find((x) => roh / x <= 5) ?? 100
  const unten = Math.floor(Math.min(...alle, 0) / schritt) * schritt
  const oben = Math.ceil(Math.max(...alle, 0) / schritt) * schritt
  const teil: number[] = []
  for (let w = unten; w <= oben + 1e-9; w += schritt) teil.push(Math.round(w * 10) / 10)

  /* Fläche: links die Y-Achse, rechts Platz für die Endwerte. */
  const X0 = 130
  const X1 = 780
  const Y0 = 580
  const Y1 = 1150
  const zeitAnfang = Date.parse(`${reihen[0].punkte[0].t}T00:00:00Z`)
  const zeitEnde = Date.parse(`${k.bis}T00:00:00Z`)
  const x = (t: string) =>
    X0 +
    ((Date.parse(`${t}T00:00:00Z`) - zeitAnfang) / (zeitEnde - zeitAnfang)) * (X1 - X0)
  const y = (p: number) => Y1 - ((p - unten) / (oben - unten)) * (Y1 - Y0)

  const linien = reihen
    .map((r) => {
      const farbe = r.akzent ? akzent : SCHWARZ
      const pfad = r.punkte
        .map((p) => `${(x(p.t) - X0).toFixed(1)},${(y(p.prozent) - Y0).toFixed(1)}`)
        .join(' ')
      return `<polyline points="${pfad}" fill="none" stroke="${farbe}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>`
    })
    .join('')
  const gitter = teil
    .map((w) => {
      const yy = (y(w) - Y0).toFixed(1)
      return w === 0
        ? `<line x1="0" x2="${X1 - X0}" y1="${yy}" y2="${yy}" stroke="#333" stroke-width="3"/>`
        : `<line x1="0" x2="${X1 - X0}" y1="${yy}" y2="${yy}" stroke="#c9c9c9" stroke-width="2" stroke-dasharray="7 7"/>`
    })
    .join('')
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${X1 - X0}" height="${Y1 - Y0}" viewBox="0 0 ${X1 - X0} ${Y1 - Y0}">` +
    gitter +
    `<line x1="1.5" x2="1.5" y1="0" y2="${Y1 - Y0}" stroke="#333" stroke-width="3"/>` +
    `<line x1="0" x2="${X1 - X0}" y1="${Y1 - Y0 - 1.5}" y2="${Y1 - Y0 - 1.5}" stroke="#333" stroke-width="3"/>` +
    linien +
    `</svg>`

  const zahl = (w: number) => `${w > 0 ? '+' : ''}${w.toLocaleString('de-DE')} %`
  const schrift = { fontFamily: 'Open', fontSize: 24, color: GRAU }

  /* Monatsanfänge auf der X-Achse – jeder zweite, damit nichts zusammenstößt. */
  const monate: { t: string; text: string }[] = []
  const bisMonat = Number(k.bis.slice(5, 7))
  for (let m = 1; m <= bisMonat; m += 2)
    monate.push({
      t: `${k.bis.slice(0, 4)}-${String(m).padStart(2, '0')}-01`,
      text: MONATE[m - 1],
    })

  /* Endwerte: an der Höhe ihres letzten Punktes, auseinandergeschoben, wenn sie sich zu nah kommen. */
  const enden = reihen
    .map((r) => ({ r, yy: y(r.punkte.at(-1)!.prozent) }))
    .sort((a, b) => a.yy - b.yy)
  for (let i = 1; i < enden.length; i++)
    if (enden[i].yy - enden[i - 1].yy < 96) enden[i].yy = enden[i - 1].yy + 96

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
          fontFamily: 'Open',
          fontWeight: 700,
          fontSize: 28,
          color: GRAU,
        },
      },
      k.unterzeile
    ),
    ...teil.map((w) =>
      h(
        'div',
        {
          style: {
            ...schrift,
            position: 'absolute',
            left: 20,
            width: X0 - 34,
            top: y(w) - 16,
            display: 'flex',
            justifyContent: 'flex-end',
            fontWeight: w === 0 ? 700 : 400,
          },
        },
        zahl(w)
      )
    ),
    h('img', {
      src: svgAdresse(svg),
      width: X1 - X0,
      height: Y1 - Y0,
      style: { position: 'absolute', left: X0, top: Y0 },
    }),
    ...monate.map(({ t, text }) =>
      h(
        'div',
        {
          style: {
            ...schrift,
            position: 'absolute',
            left: x(t) - 40,
            width: 80,
            top: Y1 + 14,
            display: 'flex',
            justifyContent: 'center',
          },
        },
        text
      )
    ),
    ...enden.map(({ r, yy }) =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            left: X1 + 22,
            top: yy - 44,
            display: 'flex',
            alignItems: 'center',
          },
        },
        r.land ? flagge(FLAGGEN[r.land], 50, 2) : h('div', {}),
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', marginLeft: 12 } },
          h(
            'div',
            {
              style: {
                fontFamily: 'Open',
                fontWeight: 700,
                fontSize: 26,
                color: SCHWARZ,
              },
            },
            r.name
          ),
          h(
            'div',
            {
              style: {
                fontFamily: 'Open',
                fontWeight: 800,
                fontStyle: 'italic',
                fontSize: 44,
                lineHeight: 1.05,
                color: r.akzent ? akzent : SCHWARZ,
              },
            },
            r.endwert
          )
        )
      )
    ),
  ]
}

/* ------------------------------------------------------------ Duell */

/** Veränderung vom ersten bis zum letzten Schlusskurs, in Prozent. */
export function duellProzent(sei: Duellseite): number {
  return (sei.punkte.at(-1)!.wert / sei.punkte[0].wert - 1) * 100
}

/** „+4,0 %" – eine Nachkommastelle, deutsches Komma, Vorzeichen. */
export const prozentText = (w: number, stellen = 1) =>
  `${w > 0 ? '+' : w < 0 ? '−' : ''}${Math.abs(w).toLocaleString('de-DE', { minimumFractionDigits: stellen, maximumFractionDigits: stellen })} %`

const LOGO_GRUEN = '#205437'
const LOGO_ROT = '#8B2225'

function duellGrafik(k: Duellkarte) {
  const akzent = akzentfarbe(k.datum)
  const seiten = [k.links, k.rechts].map((sei) => ({
    sei,
    reihe: sei.punkte.map((p) => ({
      t: p.t,
      p: (p.wert / sei.punkte[0].wert - 1) * 100,
    })),
    prozent: duellProzent(sei),
  }))
  /* Beide Felder auf derselben Skala – sonst sähe −5 % aus wie +4 %. */
  const alle = seiten.flatMap((x) => x.reihe.map((r) => r.p))
  const schritt =
    [1, 2, 2.5, 5, 10].find(
      (x) => (Math.max(...alle, 0) - Math.min(...alle, 0)) / x <= 4
    ) ?? 20
  const unten = Math.floor(Math.min(...alle, 0) / schritt) * schritt
  const oben = Math.ceil(Math.max(...alle, 0) / schritt) * schritt
  const teil: number[] = []
  for (let w = unten; w <= oben + 1e-9; w += schritt) teil.push(Math.round(w * 10) / 10)

  const FELD_B = 485
  const FELD_H = 470
  const OBEN = 560
  const P_L = 74
  const P_R = 18
  const P_O = 128
  const P_U = 46
  const pb = FELD_B - P_L - P_R
  const ph = FELD_H - P_O - P_U

  const feld = (x: (typeof seiten)[number], links: number) => {
    const farbe = x.prozent >= 0 ? LOGO_GRUEN : LOGO_ROT
    const n = x.reihe.length - 1
    /* 12 px Luft rechts, sonst schneidet der Rand den Endpunkt ab. */
    const px = (i: number) => (i / n) * (pb - 12)
    const py = (w: number) => ph - ((w - unten) / (oben - unten)) * ph
    const linie = x.reihe
      .map((r, i) => `${px(i).toFixed(1)},${py(r.p).toFixed(1)}`)
      .join(' ')
    const flaeche = `0,${py(0).toFixed(1)} ${linie} ${px(n).toFixed(1)},${py(0).toFixed(1)}`
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${pb}" height="${ph}" viewBox="0 0 ${pb} ${ph}">` +
      teil
        .map((w) =>
          w === 0
            ? `<line x1="0" x2="${pb}" y1="${py(w).toFixed(1)}" y2="${py(w).toFixed(1)}" stroke="#333" stroke-width="2.5"/>`
            : `<line x1="0" x2="${pb}" y1="${py(w).toFixed(1)}" y2="${py(w).toFixed(1)}" stroke="#d0d0d0" stroke-width="2" stroke-dasharray="6 6"/>`
        )
        .join('') +
      `<polygon points="${flaeche}" fill="${farbe}" fill-opacity="0.13"/>` +
      `<polyline points="${linie}" fill="none" stroke="${farbe}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>` +
      `<line x1="1.5" x2="1.5" y1="0" y2="${ph}" stroke="#333" stroke-width="3"/>` +
      `<line x1="0" x2="${pb}" y1="${ph - 1.5}" y2="${ph - 1.5}" stroke="#333" stroke-width="3"/>` +
      `<circle cx="${px(n).toFixed(1)}" cy="${py(x.reihe[n].p).toFixed(1)}" r="8" fill="${farbe}"/>` +
      `</svg>`
    const tage = [0, Math.round(n / 2), n]
    return h(
      'div',
      {
        style: {
          position: 'absolute',
          left: links,
          top: OBEN,
          width: FELD_B,
          height: FELD_H,
          borderRadius: 22,
          border: '2px solid #e2e2e2',
          display: 'flex',
        },
      },
      h(
        'div',
        {
          style: {
            position: 'absolute',
            left: 22,
            top: 16,
            display: 'flex',
            alignItems: 'center',
          },
        },
        x.sei.land ? flagge(FLAGGEN[x.sei.land], 44, 2) : h('div', {}),
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', marginLeft: 12 } },
          h(
            'div',
            {
              style: {
                fontFamily: 'Anton',
                fontSize: 38,
                color: SCHWARZ,
                lineHeight: 1.1,
              },
            },
            x.sei.name
          ),
          h(
            'div',
            { style: { fontFamily: 'Open', fontSize: 20, color: MITTELGRAU } },
            x.sei.zusatz
          )
        )
      ),
      h(
        'div',
        {
          style: {
            position: 'absolute',
            right: 18,
            top: 22,
            padding: '6px 14px',
            borderRadius: 10,
            backgroundColor: farbe,
            color: '#fff',
            fontFamily: 'Open',
            fontWeight: 800,
            fontStyle: 'italic',
            fontSize: 34,
            display: 'flex',
          },
        },
        prozentText(x.prozent, 2)
      ),
      ...teil.map((w) =>
        h(
          'div',
          {
            style: {
              position: 'absolute',
              left: 4,
              width: P_L - 12,
              top: P_O + py(w) - 13,
              display: 'flex',
              justifyContent: 'flex-end',
              fontFamily: 'Open',
              fontSize: 19,
              fontWeight: w === 0 ? 700 : 400,
              color: GRAU,
            },
          },
          `${w > 0 ? '+' : ''}${w.toLocaleString('de-DE')} %`
        )
      ),
      h('img', {
        src: svgAdresse(svg),
        width: pb,
        height: ph,
        style: { position: 'absolute', left: P_L, top: P_O },
      }),
      ...tage.map((i, j) =>
        h(
          'div',
          {
            style: {
              position: 'absolute',
              left: P_L + px(i) - (j === 0 ? 0 : j === 2 ? 70 : 35),
              width: 70,
              top: P_O + ph + 8,
              display: 'flex',
              justifyContent: j === 0 ? 'flex-start' : j === 2 ? 'flex-end' : 'center',
              fontFamily: 'Open',
              fontSize: 19,
              color: GRAU,
            },
          },
          `${x.reihe[i].t.slice(8, 10)}.${x.reihe[i].t.slice(5, 7)}.`
        )
      )
    )
  }

  const differenz = Math.abs(seiten[0].prozent - seiten[1].prozent)
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
          fontFamily: 'Open',
          fontWeight: 700,
          fontSize: 28,
          color: GRAU,
        },
      },
      k.unterzeile
    ),
    feld(seiten[0], 40),
    feld(seiten[1], 40 + FELD_B + 30),
    h(
      'div',
      {
        style: {
          position: 'absolute',
          left: 40,
          right: 40,
          top: OBEN + FELD_H + 24,
          height: 130,
          borderRadius: 22,
          border: '2px solid #e2e2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      },
      h(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            marginRight: 24,
          },
        },
        h(
          'div',
          { style: { fontFamily: 'Open', fontWeight: 700, fontSize: 26, color: GRAU } },
          'Differenz'
        ),
        h(
          'div',
          { style: { fontFamily: 'Open', fontSize: 20, color: MITTELGRAU } },
          `${k.links.name} vs. ${k.rechts.name}`
        )
      ),
      h(
        'div',
        { style: { fontFamily: 'Anton', fontSize: 92, color: akzent, lineHeight: 1 } },
        differenz.toLocaleString('de-DE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      ),
      h(
        'div',
        { style: { fontFamily: 'Anton', fontSize: 46, color: SCHWARZ, marginLeft: 16 } },
        'Prozentpunkte'
      )
    ),
  ]
}
