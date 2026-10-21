/**
 * Tagesbilder: jeden Tag neue Fotos für die Kacheln der Tagesnews.
 *
 * Betreiber, 21.10.2026, nachdem er den Beitrag vom Morgen wieder
 * herausgenommen hatte: „Er hatte die gleichen Bilder drin wie … News vor
 * ein paar Tagen. Es soll immer neue Bilder geben. Es gibt ja genug Bilder
 * auf der Welt." Frankreich, Hafen und Euro-Geld waren am 20.10. schon
 * dagewesen – mit 21 festen Motiven kehrt jedes nach wenigen Tagen wieder.
 *
 * ## Woher
 *
 * Von Wikimedia Commons, jeden Morgen neu gesucht
 * (`scripts/instagram-bilder.ts`, `.github/workflows/instagram-bilder.yml`).
 * Genommen wird nur, was frei ist – gemeinfrei, CC0, und seit dem 21.10.2026
 * auch CC BY und CC BY-SA mit Nennung im Beitragstext (`bildnachweis()`;
 * Betreiber: „CC BY/BY-SA erlauben") –, im Querformat, groß genug,
 * ohne Einschränkung (Persönlichkeitsrecht, Marke) – und **was noch nie
 * genommen wurde**: Das Register `data/instagram/bilder.json` hält jede
 * Datei fest, die je auf einer Kachel stand.
 *
 * ## Wonach gesucht wird
 *
 * Nach dem Thema der Kachel, wie es `bebildere()` bestimmt, mit festen
 * englischen Suchbegriffen je Motiv (`SUCHE`) – Commons ist englisch
 * beschriftet. Nennt die Überschrift ein Land, kommt es vor den Begriff
 * („Japan container ship"); nennt sie ein Unternehmen aus dem Kursbestand,
 * wird zuerst nach dem Namen gesucht, und genommen wird nur eine Datei, deren
 * Titel den Namen trägt. Findet sich nichts Neues, bleibt das feste Motiv –
 * eins, das in den letzten Tagen nicht dran war.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { marketDefinitions } from '@/data/markets'
import { MOTIVE } from '@/lib/instagram-motive'

export const REGISTER = 'data/instagram/bilder.json'
export const TAGESBILDER = 'lib/instagram/tagesbilder'

export interface Tagesbild {
  /** Stelle im Karussell – 2 ist die erste Meldung (1 ist das Deckblatt). */
  stelle: number
  datei: string
  /** Titel der Datei auf Commons, „File:…" – daran hängt „nie zweimal". */
  titel: string
  seite: string
  lizenz: string
  urheber: string
  suche: string
}

export type Register = Record<string, Tagesbild[]>

export function leseRegister(pfad = REGISTER): Register {
  return existsSync(pfad) ? JSON.parse(readFileSync(pfad, 'utf8')) : {}
}

/**
 * Jede Commons-Datei, die je auf einer Kachel stand – auch die der festen
 * Motive: Am 21.10.2026 fand der erste Lauf für „Rekord bei
 * Haushaltsvermögen" genau das Euro-Foto, das am Vortag als Motiv stand.
 */
export function verwendeteTitel(register: Register): Set<string> {
  const motive = MOTIVE.flatMap((m) =>
    m.herkunft ? [titelAusSeite(m.herkunft.seite)] : []
  )
  return new Set([
    ...motive,
    ...Object.values(register).flatMap((tag) => tag.map((b) => b.titel)),
  ])
}

/** „https://commons.wikimedia.org/wiki/File:A_b.jpg" → „File:A b.jpg". */
export function titelAusSeite(seite: string): string {
  const name = decodeURIComponent(seite.split('/wiki/')[1] ?? '')
  return name.replace(/_/g, ' ')
}

/** Das Tagesbild für eine Stelle, wenn es eins gibt. */
export function tagesbild(
  datum: string,
  stelle: number,
  register = leseRegister()
): Buffer | null {
  const b = register[datum]?.find((x) => x.stelle === stelle)
  if (!b) return null
  const pfad = join(process.cwd(), TAGESBILDER, b.datei)
  return existsSync(pfad) ? readFileSync(pfad) : null
}

/** Englische Suchbegriffe je Motiv – in dieser Reihenfolge versucht. */
export const SUCHE: Record<string, string[]> = {
  oel: ['oil refinery', 'oil tanker ship', 'oil pumpjack', 'offshore oil platform'],
  ezb: ['euro banknotes', 'European Central Bank'],
  fed: ['Marriner S. Eccles Federal Reserve Board Building', 'Federal Reserve'],
  'wall-street': ['New York Stock Exchange', 'Wall Street New York'],
  trump: ['Donald Trump 2025 White House'],
  kapitol: ['United States Capitol'],
  'weisses-haus': ['White House Washington'],
  frankreich: ['Eiffel Tower', 'Arc de Triomphe', 'Paris Seine', 'French flag'],
  'bank-of-england': ['Bank of England', 'City of London'],
  gericht: ['gavel', 'courtroom', 'Lady Justice statue'],
  luftfahrt: ['airliner takeoff', 'Airbus aircraft', 'airport aircraft apron'],
  bahn: ['railway train', 'train station platform', 'ICE train'],
  tech: ['semiconductor wafer', 'printed circuit board', 'data center servers'],
  smartphone: ['smartphone hand', 'smartphone screen', 'mobile phone apps'],
  hafen: ['container ship', 'container terminal port', 'harbour cranes containers'],
  industrie: ['factory assembly line', 'car factory production', 'industrial plant'],
  wohnen: ['apartment buildings', 'residential houses street', 'house construction site'],
  euro: ['piggy bank', 'euro coins', 'coins money', 'euro banknotes'],
  konsum: ['supermarket', 'shopping cart', 'shopping street'],
  tresor: ['bank vault', 'gold bars', 'safe deposit boxes'],
  boerse: [
    'stock exchange trading floor',
    'stock market ticker',
    'stock exchange building',
  ],
}

/** Länder in der Überschrift – deutsch, wie sie dort stehen, und englisch. */
const LAENDER: [RegExp, string][] = [
  [/\bJapans?\b/u, 'Japan'],
  [/\bChinas?\b/u, 'China'],
  [/\bIndiens?\b/u, 'India'],
  [/\bFrankreichs?\b/u, 'France'],
  [/\bItaliens?\b/u, 'Italy'],
  [/\bSpaniens?\b/u, 'Spain'],
  [/\bGroßbritanniens?\b|\bBritannien\b/u, 'United Kingdom'],
  [/\bDeutschlands?\b/u, 'Germany'],
  [/\bSchweiz\b/u, 'Switzerland'],
  [/\bÖsterreichs?\b/u, 'Austria'],
  [/\bPolens?\b/u, 'Poland'],
  [/\bRusslands?\b/u, 'Russia'],
  [/\bUkraine\b/u, 'Ukraine'],
  [/\bTürkei\b/u, 'Turkey'],
  [/\bKanadas?\b/u, 'Canada'],
  [/\bBrasiliens?\b/u, 'Brazil'],
  [/\bIndonesiens?\b/u, 'Indonesia'],
  [/\bSüdkoreas?\b|\bKoreas?\b/u, 'South Korea'],
  [/\bMexikos?\b/u, 'Mexico'],
]

/** Unternehmen aus dem Kursbestand, wie sie in einer Überschrift stehen. */
function unternehmenIn(titel: string): string | null {
  for (const m of marketDefinitions) {
    if (m.kind !== 'stock') continue
    const name = m.name
      .replace(/\s*\(.*\)$/, '')
      .replace(
        /\s+(AG|SE|Inc\.?|Corp\.?|Corporation|plc|N\.V\.|S\.A\.|Holding|Group)$/i,
        ''
      )
      .trim()
    if (
      name.length >= 3 &&
      new RegExp(
        `(?<![\\p{L}])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}])`,
        'u'
      ).test(titel)
    )
      return name
  }
  /* Marken, die im Bestand unter dem Konzern stehen. */
  const marke = /\b(Google|YouTube|Instagram|WhatsApp|iPhone)\b/u.exec(titel)
  return marke?.[1] ?? null
}

export interface Suche {
  begriff: string
  /** Nur Dateien, deren Titel dieses Wort trägt – bei Firmennamen. */
  mussEnthalten?: string
  /**
   * Nur Dateien, deren Titel eins dieser Wörter trägt. Am 21.10.2026 fand
   * „Japan container ship" unter den ausgezeichneten Fotos einen Eisvogel –
   * die Suche trifft auch Beschreibung und Kategorien, der Titel nicht.
   */
  stichwoerter?: string[]
}

/** Die tragenden Wörter eines Suchbegriffs – ab vier Buchstaben. */
function stichwoerterVon(begriff: string): string[] {
  return begriff
    .split(/[\s.]+/)
    .map((w) => w.toLowerCase())
    .filter((w) => w.length >= 4)
}

/** Die Suchen für eine Kachel, die genaueste zuerst. */
export function suchenFuer(titel: string, motiv: string): Suche[] {
  const liste: Suche[] = []
  const firma = unternehmenIn(titel)
  if (firma) {
    liste.push({ begriff: `${firma} headquarters`, mussEnthalten: firma })
    liste.push({ begriff: firma, mussEnthalten: firma })
  }
  const land = LAENDER.find(([muster]) => muster.test(titel))?.[1]
  const begriffe = SUCHE[motiv] ?? SUCHE.boerse
  if (land)
    for (const b of begriffe)
      liste.push({ begriff: `${land} ${b}`, stichwoerter: stichwoerterVon(b) })
  for (const b of begriffe) liste.push({ begriff: b, stichwoerter: stichwoerterVon(b) })
  return liste
}

/** Was Commons über eine Datei liefert – das, was hier zählt. */
export interface Kandidat {
  titel: string
  breite: number
  hoehe: number
  lizenz: string
  einschraenkung: string
}

/*
  Frei heißt: gemeinfrei, CC0, CC BY, CC BY-SA. Nicht: NC (nicht kommerziell
  – der Kanal wirbt für die Website), ND (keine Bearbeitung – der Zuschnitt
  ist eine), GFDL allein (verlangt den ganzen Lizenztext).
*/
const FREI = /^(Public domain|CC0|PD\b|PDM|CC BY(-SA)? \d)/i

/** Braucht die Lizenz eine Nennung? Gemeinfrei und CC0 nicht. */
export function nennungNoetig(lizenz: string): boolean {
  return /^CC BY/i.test(lizenz.trim())
}

/**
 * Die Nennung unter dem Beitrag – je Foto mit CC-BY-Lizenz Urheber, Quelle
 * und Lizenz, wie die Lizenz es verlangt. Leer, wenn keins eine braucht.
 */
export function bildnachweis(datum: string, register = leseRegister()): string {
  const noetig = (register[datum] ?? []).filter((b) => nennungNoetig(b.lizenz))
  if (!noetig.length) return ''
  return [
    'Fotos (Wikimedia Commons):',
    ...noetig.map((b) => `Seite ${b.stelle}: ${b.urheber.slice(0, 60)}, ${b.lizenz}`),
  ].join('\n')
}

/*
  Was kein Foto zum Thema ist. Am 21.10.2026 fand der erste Lauf einen
  Stadtplan von Paris, ein Netflix-Diagramm und eine Gruppenaufnahme vor
  dem Googleplex – alle frei, alle quer, alle falsch.
*/
const KEIN_FOTO = new RegExp(
  '\\b(' +
    [
      'map',
      'karte',
      'plan',
      'diagram',
      'diagramm',
      'chart',
      'graph',
      'grafik',
      'logo',
      'poster',
      'stamp',
      'briefmarke',
      'coat of arms',
      'wappen',
      'seal',
      'document',
      'page',
      'p\\d+',
      'scan',
      'tabloid',
      'newspaper',
      'zeitung',
      'students',
      'visit',
      'visiting',
      'team',
      'group',
      'portrait',
      'meeting',
      'conference',
      'screenshot',
      'cartoon',
      'caricature',
      'drawing',
      'painting',
      'illustration',
      'engraving',
      'lithograph',
      'postcard',
      'tittar',
      'andel',
      'statistics',
      'infographic',
      'handshake',
      'hands shaking',
      'bribe',
      'bribery',
      'corruption',
      'crime',
      'bandit',
    ].join('|') +
    ')\\b',
  'i'
)

/**
 * Der Kern eines Dateititels – ohne Klammerzusatz, Endung und Zählnummer.
 * „Euro coins and banknotes (cropped).jpg" und „Euro coins and
 * banknotes.jpg" sind dasselbe Foto (21.10.2026).
 */
export function kern(titel: string): string {
  return titel
    .toLowerCase()
    .replace(/^file:/, '')
    .replace(/\.[a-z]+$/, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/[\s_-]*\d+$/, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

/** Taugt die Datei? – frei, Querformat, groß genug, unbelastet, neu. */
export function taugt(
  k: Kandidat,
  verwendet: Set<string>,
  mussEnthalten?: string,
  stichwoerter?: string[]
): boolean {
  if (verwendet.has(k.titel)) return false
  const kerne = new Set([...verwendet].map(kern))
  if (kerne.has(kern(k.titel))) return false
  if (
    stichwoerter?.length &&
    !stichwoerter.some((w) => k.titel.toLowerCase().includes(w))
  )
    return false
  if (!FREI.test(k.lizenz.trim())) return false
  if (k.einschraenkung.trim()) return false
  if (k.breite < 1200 || k.breite / k.hoehe < 1.25) return false
  if (!/\.jpe?g$/i.test(k.titel)) return false
  if (KEIN_FOTO.test(k.titel)) return false
  if (mussEnthalten && !k.titel.toLowerCase().includes(mussEnthalten.toLowerCase()))
    return false
  return true
}
