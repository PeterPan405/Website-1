import { lernpfade, type Lernpfad, type Pfadschritt } from '@/data/learn/pfade'
import { learnTopics } from '@/data/learn'
import { learnLevelIds, learnLevelMeta } from '@/data/learn/types'
import { calculators } from '@/data/calculators'
import { validiereLernpfade } from '@/lib/lernpfade-validate'

/**
 * Service-Schicht für die Lernpfade.
 *
 * Ein Pfad enthält nur Verweise; alles Anzeigbare – Titel, Lesezeit,
 * Bearbeitungsstand – steht beim Ziel. Diese Datei setzt beides zusammen,
 * damit die Seiten nichts nachschlagen müssen.
 *
 * Die Prüfung läuft beim Laden des Moduls, also beim Bauen: Ein Pfad, der auf
 * ein nicht vorhandenes Thema zeigt, bricht den Build ab, statt eine Seite mit
 * einem toten Link zu erzeugen.
 */

validiereLernpfade(lernpfade, {
  themen: new Set(learnTopics.map((thema) => thema.slug)),
  stufen: new Set(learnLevelIds),
  rechner: new Set(calculators.map((rechner) => rechner.slug)),
})

export type { Lernpfad, Pfadschritt } from '@/data/learn/pfade'

/** Ein Schritt mit allem, was zur Anzeige gebraucht wird. */
export type AufgeloesterSchritt =
  | {
      art: 'stufe'
      /** Für den Fortschrittsspeicher: `thema:stufe`. */
      kennung: string
      thema: string
      themaTitel: string
      stufe: string
      stufeLabel: string
      titel: string
      lead: string
      lesezeit: number
      /** Ob der Fließtext vorliegt oder noch als Gliederung. */
      fertig: boolean
      href: string
      warum: string
    }
  | {
      art: 'rechner'
      kennung: string
      titel: string
      lead: string
      href: string
      warum: string
    }

export interface AufgeloesterPfad extends Lernpfad {
  aufgeloest: AufgeloesterSchritt[]
  /** Summe der Lesezeiten, ohne die Rechner. */
  lesezeit: number
  /** Wie viele Schritte auf eine Lernstufe zeigen. */
  stufenzahl: number
  /** Wie viele Schritte auf einen Rechner zeigen. */
  rechnerzahl: number
  /** Die Kennungen aller Stufenschritte – für die Fortschrittsanzeige. */
  stufenkennungen: string[]
}

function loeseAuf(schritt: Pfadschritt): AufgeloesterSchritt {
  if (schritt.art === 'rechner') {
    const rechner = calculators.find((eintrag) => eintrag.slug === schritt.rechner)
    // Dass es ihn gibt, hat die Prüfung oben bereits sichergestellt.
    if (!rechner) throw new Error(`Rechner ${schritt.rechner} fehlt`)
    return {
      art: 'rechner',
      kennung: `rechner:${rechner.slug}`,
      titel: rechner.title,
      lead: rechner.summary,
      href: `/rechner/${rechner.slug}`,
      warum: schritt.warum,
    }
  }

  const thema = learnTopics.find((eintrag) => eintrag.slug === schritt.thema)
  if (!thema) throw new Error(`Thema ${schritt.thema} fehlt`)
  const stufe = thema.levels[schritt.stufe]

  return {
    art: 'stufe',
    kennung: `${thema.slug}:${schritt.stufe}`,
    thema: thema.slug,
    themaTitel: thema.title,
    stufe: schritt.stufe,
    stufeLabel: learnLevelMeta[schritt.stufe].label,
    titel: stufe.title,
    lead: stufe.lead,
    lesezeit: stufe.readingMinutes,
    fertig: stufe.status === 'complete',
    href: `/lernen/${thema.slug}/${schritt.stufe}`,
    warum: schritt.warum,
  }
}

function ergaenze(pfad: Lernpfad): AufgeloesterPfad {
  const aufgeloest = pfad.schritte.map(loeseAuf)
  const stufen = aufgeloest.filter((schritt) => schritt.art === 'stufe')

  return {
    ...pfad,
    aufgeloest,
    lesezeit: stufen.reduce((summe, schritt) => summe + schritt.lesezeit, 0),
    stufenzahl: stufen.length,
    rechnerzahl: aufgeloest.length - stufen.length,
    stufenkennungen: stufen.map((schritt) => schritt.kennung),
  }
}

export async function getLernpfade(): Promise<AufgeloesterPfad[]> {
  return lernpfade.map(ergaenze)
}

export async function getLernpfad(slug: string): Promise<AufgeloesterPfad | null> {
  const pfad = lernpfade.find((eintrag) => eintrag.slug === slug)
  return pfad ? ergaenze(pfad) : null
}

export async function getLernpfadSlugs(): Promise<string[]> {
  return lernpfade.map((pfad) => pfad.slug)
}

/**
 * Die Pfade, auf denen eine bestimmte Stufe vorkommt.
 *
 * Damit steht auf einer Stufenseite, wozu sie gehört: Wer über die Suche auf
 * „Kosten und Gebühren, Fortgeschritten“ landet, sieht, dass diese Seite Teil
 * von zwei Wegen ist – und wo sie darin steht.
 */
export async function getPfadeMitStufe(
  thema: string,
  stufe: string
): Promise<{ pfad: AufgeloesterPfad; nummer: number }[]> {
  const kennung = `${thema}:${stufe}`
  const treffer: { pfad: AufgeloesterPfad; nummer: number }[] = []

  for (const pfad of lernpfade.map(ergaenze)) {
    const stelle = pfad.aufgeloest.findIndex((schritt) => schritt.kennung === kennung)
    if (stelle >= 0) treffer.push({ pfad, nummer: stelle + 1 })
  }
  return treffer
}
