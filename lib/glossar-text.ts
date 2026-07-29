/**
 * Begriffe im Fließtext erkennen.
 *
 * Bewusst ohne Importe, damit `tests/` das Modul direkt laden kann.
 *
 * ## Warum kein `\b`
 *
 * Weil die Wortgrenze in JavaScript nur ASCII kennt. `\bÜberschuss\b` findet
 * nichts: Vor dem `Ü` steht ein Leerzeichen, und weil `Ü` für die Regex kein
 * Wortzeichen ist, entsteht dort gar keine Grenze. In einem deutschsprachigen
 * Text wäre das ein Fehler, der jeden zweiten Begriff beträfe. Geprüft wird
 * deshalb ausdrücklich gegen eine Zeichenklasse mit Umlauten.
 *
 * ## Warum nur exakte Formen
 *
 * Weil Raten hier teuer ist. Ein Stamm-Abgleich („alles, was mit *Aktie*
 * anfängt“) verlinkt „Aktienrückkauf“ auf „Aktie“ und „Optionsschein“ auf
 * „Option“ – beides ist etwas anderes als der Begriff, den man erklärt bekommt.
 * Die Wortformen stehen deshalb einzeln im Glossar; was nicht dortsteht, wird
 * nicht verlinkt.
 *
 * ## Warum nur das erste Vorkommen
 *
 * Ein Text, in dem jedes zweite Wort ein Link ist, wird nicht gelesen, sondern
 * überflogen. Ein Begriff braucht seine Erklärung genau einmal – beim ersten
 * Mal, an dem er auftaucht.
 */

/** Buchstaben und Ziffern, die an einer Wortgrenze nicht stehen dürfen. */
const WORTZEICHEN = 'A-Za-zÄÖÜäöüßÀ-ÿ0-9'

export interface Wortform {
  /** Die Form, wie sie im Text steht. */
  form: string
  /** Der Eintrag, auf den sie zeigt. */
  slug: string
}

export interface Begriffsindex {
  muster: RegExp
  /** Kleingeschriebene Form auf Slug. */
  nachForm: Map<string, string>
}

function maskiere(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Baut das Suchmuster für alle Wortformen.
 *
 * Sortiert nach Länge, absteigend: Sonst gewönne „Fonds“ gegen
 * „Geldmarktfonds“, weil die Alternative weiter links steht – und der Verweis
 * zeigte auf den allgemeineren Begriff.
 */
export function baueIndex(formen: Wortform[]): Begriffsindex {
  const nachForm = new Map<string, string>()
  for (const eintrag of formen) {
    const schluessel = eintrag.form.toLowerCase()
    if (!nachForm.has(schluessel)) nachForm.set(schluessel, eintrag.slug)
  }

  const sortiert = [...nachForm.keys()].sort((a, b) => b.length - a.length)
  const alternativen = sortiert.map(maskiere).join('|')

  return {
    muster: new RegExp(
      `(?<![${WORTZEICHEN}-])(${alternativen})(?![${WORTZEICHEN}])`,
      'gi'
    ),
    nachForm,
  }
}

export type Textteil = { text: string; slug?: string }

/**
 * Zerlegt einen Text in Stücke, von denen einige einen Begriff tragen.
 *
 * `benutzt` wird dabei erweitert: Wer die Menge über mehrere Aufrufe hinweg
 * mitgibt, bekommt je Begriff genau eine Verlinkung – über die ganze Seite
 * hinweg und nicht je Absatz.
 */
export function zerlege(
  text: string,
  index: Begriffsindex,
  benutzt: Set<string>,
  ausgenommen: ReadonlySet<string> = new Set()
): Textteil[] {
  if (!text) return [{ text }]

  const teile: Textteil[] = []
  let zuletzt = 0

  // Ein frisches lastIndex je Aufruf; das Muster ist global und wird geteilt.
  index.muster.lastIndex = 0

  let treffer: RegExpExecArray | null
  while ((treffer = index.muster.exec(text)) !== null) {
    const slug = index.nachForm.get(treffer[1].toLowerCase())
    if (!slug || benutzt.has(slug) || ausgenommen.has(slug)) continue

    benutzt.add(slug)
    if (treffer.index > zuletzt) teile.push({ text: text.slice(zuletzt, treffer.index) })
    teile.push({ text: treffer[1], slug })
    zuletzt = treffer.index + treffer[1].length
  }

  if (teile.length === 0) return [{ text }]
  if (zuletzt < text.length) teile.push({ text: text.slice(zuletzt) })
  return teile
}
