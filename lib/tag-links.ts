import { learnTopics } from '@/data/learn'
import { marketDefinitions } from '@/data/markets'

import { normalize } from '@/lib/search-match'

/**
 * Verlinkung der Schlagwörter unter einem Artikel.
 *
 * Die Schlagwörter beschreiben die Meldung – „EZB“, „Leitzins“, „Gold“. Wo es
 * dazu eine Seite auf der Website gibt, soll das Schlagwort dorthin führen:
 * meist auf ein Lernthema, sonst auf einen Kurs oder einen Rechner.
 *
 * ## Warum eine Tabelle und keine Suche
 *
 * Naheliegend wäre, das Schlagwort in die Volltextsuche zu geben und den besten
 * Treffer zu nehmen. Das wäre aber nicht vorhersagbar: Derselbe Begriff könnte
 * nach einer Änderung an einem Lerntext plötzlich woanders landen, und niemand
 * merkte es. Hier ist stattdessen jede Zuordnung nachlesbar – und wo keine
 * passt, bleibt das Schlagwort bewusst ein Wort ohne Verweis. Ein Link, der zu
 * etwas nur ungefähr Passendem führt, ist schlechter als gar keiner.
 *
 * ## Reihenfolge
 *
 * Der erste Treffer gewinnt, in dieser Reihenfolge:
 *
 * 1. **Lernthemen** über Slug, Titel und Stichwörter. Das ist der Regelfall –
 *    gefragt ist die Erklärung, nicht der Tageskurs.
 * 2. **Kurse** über Symbol, Kürzel und Name. Greift für „DAX“ oder „Nasdaq“,
 *    wozu es kein eigenes Lernthema gibt.
 * 3. **Zuordnungen von Hand** für wiederkehrendes Nachrichtenvokabular, das in
 *    keinem Stichwortverzeichnis steht. Auch ein Rechner ist dort ein
 *    zulässiges Ziel.
 *
 * Kommt derselbe Begriff bei zwei Lernthemen vor – „Realzins“ steht bei
 * Zinseszins und bei Tagesgeld –, gewinnt das erste in der Lernreihenfolge.
 * Das ist willkürlich, aber stabil und folgt dem Lernweg: Dieselbe Eingabe
 * führt immer zum selben Ziel, und zwar zum früheren Thema.
 */

/**
 * Nachrichtenvokabular, für das es kein Stichwort gibt.
 *
 * Jede Zeile ist eine redaktionelle Entscheidung, keine Ableitung. Wer eine für
 * falsch hält, ändert sie hier – die Wirkung ist sofort auf allen Artikeln
 * sichtbar. Bewusst nicht enthalten sind Begriffe ohne echte Entsprechung
 * („SAP“, „Geopolitik“); sie bleiben unverlinkt.
 */
export const TAG_ALIASES: Record<string, string> = {
  // Notenbanken. Bis zum Lernthema „Notenbanken & Geldpolitik“ landeten diese
  // Begriffe behelfsweise beim Tagesgeld – jetzt gibt es die richtige Seite.
  ezb: '/lernen/notenbanken-geldpolitik',
  fed: '/lernen/notenbanken-geldpolitik',
  fomc: '/lernen/notenbanken-geldpolitik',
  'dot plot': '/lernen/notenbanken-geldpolitik',
  'us-zinsen': '/lernen/notenbanken-geldpolitik',
  festgeld: '/lernen/tagesgeld',
  anleihen: '/lernen/staatsanleihe',

  // Vorsorge.
  fruehstartrente: '/lernen/rente',
  rentenluecke: '/rechner/rentenluecke',

  // Markt und Handel.
  'wall street': '/lernen/boerse',
  aktienmarkt: '/lernen/boerse',
  aktien: '/lernen/aktie',
  quartalszahlen: '/lernen/aktie',
  indexgewichtung: '/lernen/aktien-laender-branchen',
  nasdaq: '/maerkte/nasdaq-100',

  // Rohstoffe.
  oelpreis: '/lernen/rohstoffe',
  rohoel: '/lernen/rohstoffe',
  brent: '/lernen/rohstoffe',

  // Krypto.
  krypto: '/lernen/bitcoin-krypto',
}

/**
 * Das Verzeichnis wird einmal gebaut und dann wiederverwendet.
 *
 * Beim statischen Export läuft das genau einmal pro Build, danach steht das
 * Ergebnis fest. Ein `Map` statt wiederholter Schleifen über alle Themen spart
 * bei über hundert Seiten mit je vier Schlagwörtern spürbar Zeit.
 */
let verzeichnis: Map<string, string> | null = null

function eintragen(map: Map<string, string>, begriff: string, href: string): void {
  const schluessel = normalize(begriff).trim()
  // Erster Treffer gewinnt – siehe Reihenfolge oben.
  if (schluessel && !map.has(schluessel)) map.set(schluessel, href)
}

function buildIndex(): Map<string, string> {
  const map = new Map<string, string>()

  // 1. Lernthemen.
  for (const thema of learnTopics) {
    const href = `/lernen/${thema.slug}`
    eintragen(map, thema.slug, href)
    eintragen(map, thema.title, href)
    for (const stichwort of thema.keywords ?? []) eintragen(map, stichwort, href)
  }

  // 2. Kurse.
  for (const kurs of marketDefinitions) {
    const href = `/maerkte/${kurs.symbol}`
    eintragen(map, kurs.symbol, href)
    eintragen(map, kurs.ticker, href)
    eintragen(map, kurs.name, href)
  }

  // 3. Zuordnungen von Hand.
  for (const [begriff, href] of Object.entries(TAG_ALIASES)) {
    eintragen(map, begriff, href)
  }

  return map
}

/**
 * Das Ziel eines Schlagworts – oder `null`, wenn es dazu nichts gibt.
 *
 * `null` ist kein Fehlerfall: Nicht jede Meldung hat zu jedem ihrer Begriffe
 * eine eigene Seite, und ein Schlagwort ohne Verweis ist immer noch eine
 * nützliche Beschreibung des Artikels.
 */
export function resolveTagHref(tag: string): string | null {
  verzeichnis ??= buildIndex()
  return verzeichnis.get(normalize(tag).trim()) ?? null
}
