/**
 * Die Texte für X (Twitter) – aus denselben Daten wie die Instagram-Beiträge.
 *
 * Anordnung des Betreibers vom 17.10.2026: „Ich möchte die News und Beiträge
 * auch auf Twitter (X) automatisch teilen." Bilder und Inhalt sind die von
 * Instagram; nur der Text ist ein anderer, weil X höchstens 280 Zeichen nimmt
 * und höchstens vier Bilder je Post.
 *
 * ## Was X anders zählt
 *
 * Ein Emoji zählt doppelt, ein Link immer 23 Zeichen. **Ein Link steht nicht
 * drin:** Ein Post mit Link kostet über die Schnittstelle rund 0,20 $ statt
 * 0,015 $ (Stand Oktober 2026, Preisübersichten von Drittanbietern – gilt,
 * was auf docs.x.com steht). Auch kein „iminvests.de" als Text: X macht
 * daraus selbst einen Link.
 *
 * ## Was immer drinsteht
 *
 * Der KI-Hinweis und „Keine Anlageberatung" – dieselbe Regel wie für jeden
 * Instagram-Beitrag (`RECHTSHINWEIS` in `lib/instagram-plan.ts`), nur kurz.
 *
 * Gesetzt wird von `app/x/heute.json/route.ts`, veröffentlicht von
 * `scripts/x-veroeffentlichen.ts`.
 */
import type { InstagramPlan } from './instagram-plan.ts'
import type { Zahlenkarte } from './instagram-zahlenkarte.ts'

export const X_MAX = 280
export const X_HINWEIS = 'Keine Anlageberatung · mit KI erstellt'

/**
 * Die Länge, wie X sie zählt: ein Zeichen je Graphem, ein Emoji doppelt.
 * Links kommen in unseren Texten nicht vor.
 */
export function xLaenge(text: string): number {
  let n = 0
  for (const { segment } of new Intl.Segmenter('de', { granularity: 'grapheme' }).segment(
    text
  ))
    n += /\p{Extended_Pictographic}/u.test(segment) ? 2 : 1
  return n
}

const datumDe = (iso: string) =>
  `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}`
const schlagzeile = (worte: string[]) => worte.map((w) => `#${w}`).join(' ')

/**
 * Die Tagesnews als zwei Posts: der erste mit Deckblatt und drei Kacheln,
 * die Antwort darauf mit den zwei übrigen – X nimmt vier Bilder je Post.
 */
export function xTagesnews(
  datum: string,
  plan: InstagramPlan
): { haupt: string; antwort: string; bilder: { haupt: number[]; antwort: number[] } } {
  const titel = plan.kacheln.map((k) => k.titel)
  const kopf = `📈 Top-News des Tages · ${datumDe(datum)}`
  const liste = titel.map((t) => `▸ ${t}`).join('\n')
  const mitTags = `${kopf}\n\n${liste}\n\n${X_HINWEIS}\n${schlagzeile(plan.schlagworte.slice(0, 2))}`
  const haupt =
    xLaenge(mitTags) <= X_MAX ? mitTags : `${kopf}\n\n${liste}\n\n${X_HINWEIS}`
  const antwort = `Teil 2/2: ${titel.slice(3).join(' · ')}`
  return {
    haupt,
    antwort,
    bilder: {
      haupt: [1, 2, 3, 4],
      antwort: [5, 6].slice(0, Math.max(0, titel.length - 3)),
    },
  }
}

/**
 * Die Zahlenkarte als ein Post. Pflicht sind Überschrift, Fußzeile (Stand
 * und Quelle) und Hinweis; der erste Satz der Beschriftung und zwei
 * Schlagworte kommen dazu, solange es passt.
 */
export function xZahlenkarte(k: Zahlenkarte): string {
  const titel = k.titel.map((t) => t.text).join(' ')
  const satz =
    k.text
      .split('\n')[0]
      .match(/^.*?[.!?](?=\s|$)/)?.[0]
      ?.trim() ?? ''
  const fuss = `${k.fusszeile}\n${X_HINWEIS}`
  const tags = schlagzeile(k.schlagworte.slice(0, 2))
  const fassungen = [
    `${titel}\n\n${satz}\n\n${fuss}\n${tags}`,
    `${titel}\n\n${satz}\n\n${fuss}`,
    `${titel}\n\n${fuss}\n${tags}`,
    `${titel}\n\n${fuss}`,
  ]
  return fassungen.find((f) => xLaenge(f) <= X_MAX) ?? fassungen.at(-1)!
}
