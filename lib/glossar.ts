import { calculators } from '@/data/calculators'
import { glossar, type Glossareintrag } from '@/data/glossar'
import { learnTopics } from '@/data/learn'
import { baueIndex, type Begriffsindex, type Wortform } from '@/lib/glossar-text'

/**
 * Service-Schicht für das Glossar.
 *
 * Zwei Aufgaben: die Einträge für die Glossarseite aufbereiten und den Index
 * bereitstellen, mit dem der Textrenderer Begriffe erkennt.
 *
 * Die Prüfung läuft beim Laden des Moduls, also beim Bauen. Ein „siehe auch“,
 * das ins Leere zeigt, oder ein Themenverweis mit Tippfehler bricht damit den
 * Build ab, statt einen toten Link zu erzeugen – dieselbe Entscheidung wie bei
 * den Lernpfaden und aus demselben Grund: Beides sieht auf der fertigen Seite
 * völlig normal aus.
 */

function pruefe(): void {
  const fehler: string[] = []
  const slugs = new Set(glossar.map((eintrag) => eintrag.slug))
  const themen = new Set(learnTopics.map((thema) => thema.slug))
  const rechner = new Set(calculators.map((eintrag) => eintrag.slug))
  const formen = new Map<string, string>()

  for (const eintrag of glossar) {
    const wo = `Glossar ${eintrag.slug}`

    if (!/^[a-z0-9-]+$/.test(eintrag.slug)) {
      fehler.push(`${wo}: Slug enthält unerlaubte Zeichen`)
    }
    if (!eintrag.kurz.trim().endsWith('.')) {
      fehler.push(`${wo}: kurz ist kein vollständiger Satz`)
    }

    for (const verweis of eintrag.siehe ?? []) {
      if (verweis === eintrag.slug) fehler.push(`${wo}: verweist auf sich selbst`)
      else if (!slugs.has(verweis)) fehler.push(`${wo}: „siehe ${verweis}“ gibt es nicht`)
    }
    if (eintrag.thema && !themen.has(eintrag.thema)) {
      fehler.push(`${wo}: Thema „${eintrag.thema}“ gibt es nicht`)
    }
    if (eintrag.rechner && !rechner.has(eintrag.rechner)) {
      fehler.push(`${wo}: Rechner „${eintrag.rechner}“ gibt es nicht`)
    }

    /*
      Dieselbe Wortform bei zwei Einträgen wäre ein stiller Fehler: Welcher
      gewinnt, entschiede die Reihenfolge in der Datei.
    */
    for (const form of [eintrag.begriff, ...(eintrag.formen ?? [])]) {
      const schluessel = form.toLowerCase()
      const belegt = formen.get(schluessel)
      if (belegt) fehler.push(`${wo}: Form „${form}“ gehört auch zu ${belegt}`)
      else formen.set(schluessel, eintrag.slug)
    }
  }

  if (fehler.length > 0) {
    throw new Error(`Glossar fehlerhaft:\n– ${fehler.join('\n– ')}`)
  }
}

pruefe()

export type { Glossareintrag } from '@/data/glossar'

/** Ein Eintrag samt aufgelösten Verweisen. */
export interface Glossaransicht extends Glossareintrag {
  verwandt: { slug: string; begriff: string }[]
  themaTitel?: string
  rechnerTitel?: string
}

function ansicht(eintrag: Glossareintrag): Glossaransicht {
  return {
    ...eintrag,
    verwandt: (eintrag.siehe ?? []).map((slug) => {
      const ziel = glossar.find((kandidat) => kandidat.slug === slug)!
      return { slug, begriff: ziel.begriff }
    }),
    themaTitel: learnTopics.find((thema) => thema.slug === eintrag.thema)?.title,
    rechnerTitel: calculators.find((eintrag2) => eintrag2.slug === eintrag.rechner)
      ?.title,
  }
}

/** Alle Einträge, alphabetisch nach Begriff. */
export async function getGlossar(): Promise<Glossaransicht[]> {
  return [...glossar]
    .sort((a, b) => a.begriff.localeCompare(b.begriff, 'de'))
    .map(ansicht)
}

export interface Buchstabengruppe {
  buchstabe: string
  eintraege: Glossaransicht[]
}

/**
 * Die Einträge nach Anfangsbuchstaben.
 *
 * Umlaute werden dabei einsortiert, wo man sie sucht: „Überschuss“ unter U,
 * nicht in einer eigenen Gruppe hinter Z.
 */
export async function getGlossargruppen(): Promise<Buchstabengruppe[]> {
  const eintraege = await getGlossar()
  const gruppen = new Map<string, Glossaransicht[]>()

  for (const eintrag of eintraege) {
    const buchstabe = eintrag.begriff
      .charAt(0)
      .toUpperCase()
      .replace('Ä', 'A')
      .replace('Ö', 'O')
      .replace('Ü', 'U')
    const bestehend = gruppen.get(buchstabe)
    if (bestehend) bestehend.push(eintrag)
    else gruppen.set(buchstabe, [eintrag])
  }

  return [...gruppen.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'de'))
    .map(([buchstabe, gruppe]) => ({ buchstabe, eintraege: gruppe }))
}

/**
 * Der Suchindex für die Verlinkung im Fließtext.
 *
 * Einmal gebaut und wiederverwendet: Das Muster entsteht aus rund 130
 * Wortformen und wird auf jeder Textseite gebraucht.
 */
let index: Begriffsindex | null = null

export function getBegriffsindex(): Begriffsindex {
  if (!index) {
    const formen: Wortform[] = glossar.flatMap((eintrag) =>
      [eintrag.begriff, ...(eintrag.formen ?? [])].map((form) => ({
        form,
        slug: eintrag.slug,
      }))
    )
    index = baueIndex(formen)
  }
  return index
}

/**
 * Die Begriffe, die zu einem Lernthema gehören.
 *
 * Auf dessen Seiten werden sie nicht verlinkt: Ein Verweis von der
 * Aktien-Seite auf den Eintrag „Aktie“ führt auf eine kürzere Fassung dessen,
 * was gerade dasteht.
 */
export function begriffeZumThema(themaSlug: string): Set<string> {
  return new Set(
    glossar
      .filter((eintrag) => eintrag.thema === themaSlug)
      .map((eintrag) => eintrag.slug)
  )
}

/** Die Kurzerklärung eines Begriffs – für den Verweis im Fließtext. */
export function kurzerklaerung(slug: string): string {
  return glossar.find((eintrag) => eintrag.slug === slug)?.kurz ?? ''
}
