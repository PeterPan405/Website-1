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
 * 1. **Slug und Titel eines Lernthemas.** Ein Wort, das ein Thema *benennt*,
 *    führt immer zu diesem Thema.
 * 2. **Zuordnungen von Hand** – bewusste redaktionelle Entscheidungen. Auch ein
 *    Rechner oder eine Kursseite ist dort ein zulässiges Ziel.
 * 3. **Stichwörter eines Lernthemas.** Das schwächste Signal: Ein Stichwort
 *    sagt nur, dass das Wort in diesem Thema vorkommt.
 * 4. **Kurse** über Symbol, Kürzel und Name – für „DAX“ oder „MSCI World“,
 *    wozu es kein Lernthema gibt.
 *
 * Die Reihenfolge der ersten beiden Stufen ist der Punkt, an dem es
 * ursprünglich schiefging: „Einlagensicherung“ ist Titel eines eigenen Themas
 * **und** Stichwort beim Tagesgeld. Solange beides gleich zählte, gewann das
 * Tagesgeld, weil es in der Lernreihenfolge früher steht – und der Begriff
 * führte auf der Tagesgeld-Seite nirgendwohin, statt auf die Seite, die ihn
 * erklärt.
 *
 * Kurse stehen bewusst zuletzt: „Gold“ ist ein Kurs, aber gefragt ist die
 * Erklärung im Lernthema Rohstoffe, nicht der Tagespreis.
 *
 * Innerhalb einer Stufe gewinnt das erste Thema der Lernreihenfolge. Das ist
 * willkürlich, aber stabil und folgt dem Lernweg: „Realzins“ steht bei
 * Zinseszins und bei Tagesgeld und führt zum früheren der beiden.
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
  // Notenbanken. „EZB“ und „Fed“ stehen als Stichwörter am richtigen Thema und
  // brauchen keinen Eintrag; diese beiden nicht.
  'dot plot': '/lernen/notenbanken-geldpolitik',
  'us-zinsen': '/lernen/notenbanken-geldpolitik',
  festgeld: '/lernen/tagesgeld',
  anleihen: '/lernen/staatsanleihe',

  // Vorsorge.
  fruehstartrente: '/lernen/rente',
  rentenluecke: '/rechner/rentenluecke',

  /*
    „Sparplan“ steht bei Zinseszins und bei Cost-Average in den Stichwörtern.
    Ohne diesen Eintrag gewänne Zinseszins, weil es früher im Lernweg steht –
    gemeint ist aber das Thema, das den Sparplan selbst behandelt.
  */
  sparplan: '/lernen/cost-average-sparplan',

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
let verzeichnis: Map<string, string[]> | null = null

/**
 * Trägt ein Ziel als weitere Möglichkeit für einen Begriff ein.
 *
 * Gespeichert wird eine Liste statt nur des ersten Treffers, weil das beste
 * Ziel manchmal die Seite ist, auf der man gerade steht. Beim Thema Rohstoffe
 * steht „Gold“ in den eigenen Stichwörtern – dort ist der Kurs das sinnvolle
 * Ziel, nicht ein Verweis auf sich selbst. Mit einer Liste kann die Auflösung
 * auf das nächstbeste Ziel ausweichen, statt aufzugeben.
 */
function eintragen(map: Map<string, string[]>, begriff: string, href: string): void {
  const schluessel = normalize(begriff).trim()
  if (!schluessel) return

  const ziele = map.get(schluessel)
  if (!ziele) {
    map.set(schluessel, [href])
  } else if (!ziele.includes(href)) {
    ziele.push(href)
  }
}

function buildIndex(): Map<string, string[]> {
  const map = new Map<string, string[]>()

  // 1. Lernthemen: Slug und Titel.
  for (const thema of learnTopics) {
    const href = `/lernen/${thema.slug}`
    eintragen(map, thema.slug, href)
    eintragen(map, thema.title, href)
  }

  // 2. Zuordnungen von Hand.
  for (const [begriff, href] of Object.entries(TAG_ALIASES)) {
    eintragen(map, begriff, href)
  }

  // 3. Lernthemen: Stichwörter.
  for (const thema of learnTopics) {
    const href = `/lernen/${thema.slug}`
    for (const stichwort of thema.keywords ?? []) eintragen(map, stichwort, href)
  }

  // 4. Kurse.
  for (const kurs of marketDefinitions) {
    const href = `/maerkte/${kurs.symbol}`
    eintragen(map, kurs.symbol, href)
    eintragen(map, kurs.ticker, href)
    eintragen(map, kurs.name, href)
  }

  return map
}

/**
 * Das Ziel eines Schlagworts – oder `null`, wenn es dazu nichts gibt.
 *
 * `null` ist kein Fehlerfall: Nicht jede Meldung hat zu jedem ihrer Begriffe
 * eine eigene Seite, und ein Schlagwort ohne Verweis ist immer noch eine
 * nützliche Beschreibung des Artikels.
 *
 * `exclude` ist der Pfad der Seite, auf der der Begriff steht. Zu sich selbst
 * verweist niemand; stattdessen greift das nächstbeste Ziel.
 */
export function resolveTagHref(tag: string, exclude?: string): string | null {
  verzeichnis ??= buildIndex()
  const ziele = verzeichnis.get(normalize(tag).trim())
  return ziele?.find((href) => href !== exclude) ?? null
}
