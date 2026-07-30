import { marketDefinitions, type MarketDefinition } from '@/data/markets'
import { brancheSlug } from '@/lib/branche-slug'

/**
 * Die Aktien dieser Website nach Branchen.
 *
 * ## Woher die Einteilung kommt
 *
 * Aus `data/aktien-liste.txt` für die breite Auswahl und aus dem Eintrag selbst
 * für die von Hand geführten Titel. Sie stand schon immer da – sie war nur
 * nirgends sichtbar außer im ersten Wort des Zusammenfassungssatzes. Wer wissen
 * wollte, welche Halbleiterhersteller hier geführt werden, musste tausend
 * Kacheln durchsehen.
 *
 * ## Warum sie keine amtliche ist
 *
 * Es gibt zwei etablierte Systeme, GICS und ICB. Beide sind lizenzpflichtig,
 * und beide ordnen dieselbe Firma gelegentlich verschieden ein: Amazon ist
 * Handel oder Technologie, Tesla Automobil oder Konsum. Die Einteilung hier ist
 * eine Suchhilfe, keine Klassifikation – und auf den Branchenseiten steht das
 * ausdrücklich, weil eine Liste ohne diesen Hinweis mehr behauptet, als sie
 * hält.
 *
 * ## Warum sie nicht aus einer eigenen Datei kommt
 *
 * Weil sie sonst zweimal gepflegt werden müsste. Kommt eine Aktie dazu, bringt
 * sie ihre Branche mit; eine separate Zuordnungsdatei wäre am Tag darauf
 * unvollständig, ohne dass es jemandem auffiele.
 */

export { brancheSlug }

export interface Branche {
  /** URL-Slug, z. B. `halbleiter`. */
  slug: string
  /** Anzeigename, z. B. `Halbleiter`. */
  name: string
  /** Die Aktien dieser Branche, nach Namen sortiert. */
  aktien: MarketDefinition[]
  /** Die Sitzländer, aus denen die Titel stammen – als ISO-Codes der Währung. */
  waehrungen: string[]
}

/**
 * Ab wie vielen Titeln eine Branche eine eigene Seite bekommt.
 *
 * Zwei Aktien ergeben keine Branchenseite, sondern eine Liste mit zwei
 * Einträgen und viel Erklärtext drumherum. Solche Titel stehen auf der
 * Übersicht mit ihrer Branche als Text, aber ohne Verweis ins Leere.
 */
export const MINDESTZAHL = 3

let zwischenspeicher: Branche[] | null = null

/** Alle Branchen mit mindestens {@link MINDESTZAHL} Titeln, größte zuerst. */
export function getBranchen(): Branche[] {
  if (zwischenspeicher) return zwischenspeicher

  const nachName = new Map<string, MarketDefinition[]>()
  for (const eintrag of marketDefinitions) {
    if (eintrag.kind !== 'stock' || !eintrag.branche) continue
    const liste = nachName.get(eintrag.branche)
    if (liste) liste.push(eintrag)
    else nachName.set(eintrag.branche, [eintrag])
  }

  zwischenspeicher = [...nachName.entries()]
    .filter(([, aktien]) => aktien.length >= MINDESTZAHL)
    .map(([name, aktien]) => ({
      slug: brancheSlug(name),
      name,
      aktien: [...aktien].sort((a, b) => a.name.localeCompare(b.name, 'de')),
      waehrungen: [...new Set(aktien.map((eintrag) => eintrag.unit))].sort(),
    }))
    /*
      Größte zuerst, bei gleicher Größe alphabetisch. Ohne den zweiten
      Schlüssel hinge die Reihenfolge gleich großer Branchen an der Reihenfolge
      im Katalog – und änderte sich still, sobald eine Aktie dazukommt.
    */
    .sort(
      (a, b) => b.aktien.length - a.aktien.length || a.name.localeCompare(b.name, 'de')
    )

  return zwischenspeicher
}

/** Eine Branche über ihren Slug, oder `undefined`. */
export function getBranche(slug: string): Branche | undefined {
  return getBranchen().find((branche) => branche.slug === slug)
}

/**
 * Die Branche einer Aktie samt Slug – für den Verweis auf der Kursseite.
 *
 * `null`, wenn das Instrument keine Aktie ist oder seine Branche zu klein für
 * eine eigene Seite blieb. Ein Verweis auf eine Seite, die es nicht gibt, wäre
 * schlimmer als kein Verweis.
 */
export function getBrancheVon(symbol: string): { slug: string; name: string } | null {
  const eintrag = marketDefinitions.find((definition) => definition.symbol === symbol)
  if (!eintrag?.branche) return null
  const branche = getBranchen().find((kandidat) => kandidat.name === eintrag.branche)
  return branche ? { slug: branche.slug, name: branche.name } : null
}

/** Wie viele Aktien insgesamt einer Branche zugeordnet sind. */
export function getBranchenAbdeckung(): {
  aktien: number
  zugeordnet: number
  branchen: number
} {
  const aktien = marketDefinitions.filter((eintrag) => eintrag.kind === 'stock')
  return {
    aktien: aktien.length,
    zugeordnet: aktien.filter((eintrag) => eintrag.branche).length,
    branchen: getBranchen().length,
  }
}
