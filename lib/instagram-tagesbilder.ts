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
 * Genommen wird nur, was gemeinfrei oder CC0 ist, im Querformat, groß genug,
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

/** Jede Commons-Datei, die je auf einer Kachel stand. */
export function verwendeteTitel(register: Register): Set<string> {
  return new Set(Object.values(register).flatMap((tag) => tag.map((b) => b.titel)))
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
  frankreich: ['Paris France landmark', 'French flag', 'Palais Bourbon'],
  'bank-of-england': ['Bank of England', 'City of London'],
  gericht: ['gavel', 'courtroom', 'Lady Justice statue'],
  luftfahrt: ['airliner takeoff', 'Airbus aircraft', 'airport aircraft apron'],
  bahn: ['railway train', 'train station platform', 'ICE train'],
  tech: ['semiconductor wafer', 'printed circuit board', 'data center servers'],
  smartphone: ['smartphone hand', 'smartphone screen', 'mobile phone apps'],
  hafen: ['container ship', 'container terminal port', 'harbour cranes containers'],
  industrie: ['factory assembly line', 'car factory production', 'industrial plant'],
  wohnen: ['apartment buildings', 'residential houses street', 'house construction site'],
  euro: ['euro coins', 'euro banknotes', 'coins money'],
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
  if (land) for (const b of begriffe) liste.push({ begriff: `${land} ${b}` })
  for (const b of begriffe) liste.push({ begriff: b })
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

const FREI = /^(Public domain|CC0|PD\b|PDM)/i

/** Taugt die Datei? – frei, Querformat, groß genug, unbelastet, neu. */
export function taugt(
  k: Kandidat,
  verwendet: Set<string>,
  mussEnthalten?: string
): boolean {
  if (verwendet.has(k.titel)) return false
  if (!FREI.test(k.lizenz.trim())) return false
  if (k.einschraenkung.trim()) return false
  if (k.breite < 1200 || k.breite / k.hoehe < 1.25) return false
  if (!/\.(jpe?g|png|tiff?|webp)$/i.test(k.titel)) return false
  if (mussEnthalten && !k.titel.toLowerCase().includes(mussEnthalten.toLowerCase()))
    return false
  return true
}
