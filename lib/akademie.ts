/**
 * Dienstschicht und Prüfungen für die Akademie.
 *
 * ## Warum hier geprüft wird und nicht getestet
 *
 * Ein Test läuft, wenn ihn jemand startet. Diese Prüfungen laufen bei jedem
 * Bau, weil das Modul beim Rendern der Seiten geladen wird – und sie brechen
 * ab statt zu warnen. Der Unterschied zählt: Eine Lektion, die auf ein nicht
 * vorhandenes Lernthema verweist, erzeugt eine tote Verlinkung im fertigen
 * Paket. Ein abgebrochener Bau ist gegenüber einer toten Verlinkung immer die
 * bessere Nachricht.
 *
 * Dasselbe Muster wie in `lib/learn.ts` und `lib/lernpfade-validate.ts`.
 */

import {
  bereiche,
  lektionen,
  type Bereich,
  type BereichId,
  type Lektion,
} from '@/data/akademie'
import { calculators } from '@/data/calculators'
import { figureMeta } from '@/data/figures'
import { learnTopics } from '@/data/learn'

/* ------------------------------------------------------------- Prüfungen */

function pruefe(bedingung: boolean, meldung: string) {
  if (!bedingung) throw new Error(`Akademie: ${meldung}`)
}

const rechnerSlugs = new Set(calculators.map((rechner) => rechner.slug))
const lernthemenSlugs = new Set(learnTopics.map((thema) => thema.slug))
const grafikIds = new Set(Object.keys(figureMeta))
const alleSlugs = new Set<string>()

for (const lektion of lektionen) {
  const wo = `Lektion „${lektion.slug}“`

  pruefe(
    /^[a-z0-9-]+$/.test(lektion.slug),
    `${wo}: Der Slug darf nur Kleinbuchstaben, Ziffern und Bindestriche enthalten.`
  )
  pruefe(!alleSlugs.has(lektion.slug), `Der Slug „${lektion.slug}“ kommt doppelt vor.`)
  alleSlugs.add(lektion.slug)

  /*
    Die Kernaussage ist Pflicht und darf kein Halbsatz sein.

    Sie steht oben auf der Seite hervorgehoben und ist für viele das Einzige,
    was hängen bleibt. Eine Lektion, für die sich kein Satz formulieren lässt,
    hat keinen Kern – dann fehlt nicht die Zeile, sondern der Inhalt.
  */
  pruefe(
    lektion.kernaussage.trim().length >= 40,
    `${wo}: Die Kernaussage ist zu kurz, um eine zu sein.`
  )
  pruefe(lektion.kurz.trim().length >= 30, `${wo}: Der Kurztext ist zu kurz.`)
  pruefe(
    lektion.dauer >= 3 && lektion.dauer <= 20,
    `${wo}: Die Lesezeit ist unplausibel.`
  )
  pruefe(lektion.stichworte.length >= 2, `${wo}: Mindestens zwei Stichworte angeben.`)
  pruefe(lektion.inhalt.length >= 4, `${wo}: Der Inhalt hat zu wenige Blöcke.`)

  for (const block of lektion.inhalt) {
    if (block.type === 'figure') {
      pruefe(
        grafikIds.has(block.figure),
        `${wo}: Die Grafik „${block.figure}“ steht nicht in data/figures.ts.`
      )
    }
  }

  for (const slug of lektion.rechner ?? []) {
    pruefe(rechnerSlugs.has(slug), `${wo}: Der Rechner „${slug}“ existiert nicht.`)
  }
  for (const slug of lektion.lernthemen ?? []) {
    pruefe(lernthemenSlugs.has(slug), `${wo}: Das Lernthema „${slug}“ existiert nicht.`)
  }
}

for (const bereich of bereiche) {
  const eigene = lektionen.filter((lektion) => lektion.bereich === bereich.id)
  const eigeneSlugs = new Set(eigene.map((lektion) => lektion.slug))

  pruefe(
    bereich.grenzen.length >= 2,
    `Bereich „${bereich.id}“: Mindestens zwei Grenzen nennen. Ein Verfahren ohne benannte Grenzen wird als Rezept gelesen.`
  )

  /*
    Die Reihenfolge muss vollständig sein – in beide Richtungen.

    Fehlt eine Lektion in `reihenfolge`, ist sie über die Bereichsseite nicht
    erreichbar und existiert nur noch für Suchmaschinen. Steht dort eine, die
    es nicht gibt, entsteht ein Verweis ins Leere.
  */
  for (const slug of bereich.reihenfolge) {
    pruefe(
      eigeneSlugs.has(slug),
      `Bereich „${bereich.id}“: Die Reihenfolge nennt „${slug}“, aber dazu gibt es keine Lektion.`
    )
  }
  for (const lektion of eigene) {
    pruefe(
      bereich.reihenfolge.includes(lektion.slug),
      `Bereich „${bereich.id}“: Die Lektion „${lektion.slug}“ fehlt in der Reihenfolge und wäre nicht erreichbar.`
    )
  }

  /*
    Voraussetzungen dürfen nur nach hinten zeigen.

    Eine Lektion, die eine spätere voraussetzt, schickt den Leser vorwärts und
    wieder zurück. Das ist kein Aufbau, sondern ein Kreis – und ein Kreis fällt
    beim Schreiben nicht auf, weil jede Lektion für sich stimmig ist.
  */
  for (const lektion of eigene) {
    const stelle = bereich.reihenfolge.indexOf(lektion.slug)
    for (const vorher of lektion.setztVoraus ?? []) {
      const stelleVorher = bereich.reihenfolge.indexOf(vorher)
      pruefe(
        stelleVorher !== -1,
        `Lektion „${lektion.slug}“: setzt „${vorher}“ voraus, das es im Bereich nicht gibt.`
      )
      pruefe(
        stelleVorher < stelle,
        `Lektion „${lektion.slug}“: setzt „${vorher}“ voraus, das erst später kommt.`
      )
    }
  }
}

/* ------------------------------------------------------------- Zugriffe */

export type { Bereich, BereichId, Lektion }
export { belegarten } from '@/data/akademie'

export function getBereiche(): Bereich[] {
  return bereiche
}

export function getBereich(id: string): Bereich | undefined {
  return bereiche.find((bereich) => bereich.id === id)
}

/** Die Lektionen eines Bereichs in der vorgesehenen Reihenfolge. */
export function getLektionen(bereich: BereichId): Lektion[] {
  const gefunden = getBereich(bereich)
  if (!gefunden) return []
  return gefunden.reihenfolge
    .map((slug) => lektionen.find((lektion) => lektion.slug === slug))
    .filter((lektion): lektion is Lektion => lektion !== undefined)
}

export function getLektion(bereich: string, slug: string): Lektion | undefined {
  return lektionen.find((lektion) => lektion.bereich === bereich && lektion.slug === slug)
}

export function getAlleLektionen(): Lektion[] {
  return lektionen
}

/**
 * Die Lektion davor und danach – innerhalb desselben Bereichs.
 *
 * Am Ende eines Bereichs wird bewusst nicht in den anderen weitergeleitet:
 * Technische und fundamentale Analyse bauen nicht aufeinander auf, und ein
 * „weiter“ würde das Gegenteil behaupten.
 */
export function nachbarn(lektion: Lektion): { vorher?: Lektion; nachher?: Lektion } {
  const reihe = getLektionen(lektion.bereich)
  const stelle = reihe.findIndex((eintrag) => eintrag.slug === lektion.slug)
  return {
    vorher: stelle > 0 ? reihe[stelle - 1] : undefined,
    nachher: stelle >= 0 && stelle < reihe.length - 1 ? reihe[stelle + 1] : undefined,
  }
}

/** Wie viele Lektionen es insgesamt gibt – für Übersichten und Meta-Texte. */
export function lektionenGesamt(): number {
  return lektionen.length
}
