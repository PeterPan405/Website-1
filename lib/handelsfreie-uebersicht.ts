import { handelsplatz, type Handelsplatz } from '@/data/handelsplaetze'
import { marketDefinitions } from '@/data/markets'
import { boersenkuerzel, platzbefund, type Platzbefund } from '@/lib/handelsfreie-tage'
import { getLiveSeries } from '@/lib/market-live'

/**
 * Die handelsfreien Tage aller Plätze – aus den Kursreihen dieses Bestands.
 *
 * Die Rechenarbeit steckt in `lib/handelsfreie-tage.ts`; hier wird nur
 * zusammengesucht, was hineingeht. Die Trennung hat einen Grund: Dort ist
 * alles ohne Importe und damit direkt prüfbar, hier hängt alles am Kursbestand
 * und wäre in einem Test nur mit dem halben Projekt zu haben.
 *
 * ## Warum beim Bauen gerechnet und nicht in eine Datei geschrieben
 *
 * Eine erzeugte `data/handelsfreie-tage.ts` wäre eine zweite Wahrheit neben
 * den Kursreihen – und liefe beim nächsten Abruf auseinander, ohne dass es
 * jemandem auffiele. Genau dieser Fehler ist in diesem Projekt schon einmal
 * passiert (zwei Dateien mit denselben Ländergewichten des Weltindex). Die
 * Seite rechnet deshalb aus demselben Bestand, aus dem auch die Charts kommen.
 */

/** Wie weit zurück geschaut wird. Ein Jahr – so weit reichen die dichten Reihen. */
export const ZEITRAUM_TAGE = 364

/** Wie viele Kursreihen ein Platz mindestens braucht, um ausgewertet zu werden. */
export const MINDEST_REIHEN = 8

/**
 * Wie viele Punkte eine Reihe im Zeitraum haben muss, um mitzuzählen.
 *
 * Ein voller Jahrgang hat rund 250 Handelstage. Eine Reihe mit 100 Punkten ist
 * entweder neu im Bestand oder lückenhaft – in beiden Fällen erzeugte sie
 * lauter falsche Feiertage, wenn sie mitzählte. Die Grenze liegt deshalb weit
 * oben und nicht knapp über null.
 */
export const MINDEST_PUNKTE = 200

export interface Platzuebersicht {
  platz: Handelsplatz
  befund: Platzbefund
}

/** Der ausgewertete Zeitraum, als ISO-Daten. */
export function zeitraum(bis: Date): { von: string; bis: string } {
  const ende = Date.UTC(bis.getUTCFullYear(), bis.getUTCMonth(), bis.getUTCDate())
  return {
    von: new Date(ende - ZEITRAUM_TAGE * 86_400_000).toISOString().slice(0, 10),
    bis: new Date(ende).toISOString().slice(0, 10),
  }
}

/**
 * Alle Plätze mit ihrem Befund, die ausgewerteten zuerst.
 *
 * Die abgewiesenen fallen nicht weg – sie stehen auf der Seite mit ihrem
 * Grund. Ein Platz, der stillschweigend verschwindet, ist eine Lücke, die
 * niemand bemerkt; ein Platz mit Begründung ist eine Auskunft.
 */
export function handelsfreieUebersicht(stand: Date): {
  von: string
  bis: string
  plaetze: Platzuebersicht[]
} {
  const { von, bis } = zeitraum(stand)
  const aktien = marketDefinitions.filter((eintrag) => eintrag.kind === 'stock')

  const reihenJePlatz = new Map<string, Set<string>[]>()

  for (const eintrag of aktien) {
    /*
      `getLiveSeries` und nicht `getSeries` – zwei Gründe, beide ernst.

      `getSeries` dünnt die Reihe für das Chart aus: Für ein Jahr kommen 130
      statt 252 Punkte zurück. Jeder weggelassene Tag sähe hier aus wie ein
      Feiertag, und die Seite hätte für Xetra rund 120 statt acht gemeldet.

      Und `basisFor` fällt für Instrumente ohne eingerichtete Quelle auf
      **erzeugte** Reihen zurück. Bei einem Chart steht daneben, was es ist;
      hier wären es erfundene Börsenschließungen.

      Die Momentaufnahme kennt beides nicht: Sie enthält nur echte Kurse, und
      wo keine vorliegen, gibt sie `null` zurück.
    */
    const reihe = getLiveSeries(eintrag.symbol)
    if (!reihe) continue

    const tage = new Set(
      reihe.daily.map((punkt) => punkt.t).filter((tag) => tag >= von && tag <= bis)
    )
    if (tage.size < MINDEST_PUNKTE) continue

    const kuerzel = boersenkuerzel(eintrag.ticker)
    const bisher = reihenJePlatz.get(kuerzel) ?? []
    bisher.push(tage)
    reihenJePlatz.set(kuerzel, bisher)
  }

  const plaetze: Platzuebersicht[] = []
  for (const [kuerzel, reihen] of reihenJePlatz) {
    const platz = handelsplatz(kuerzel)
    if (!platz) continue
    plaetze.push({ platz, befund: platzbefund(reihen, von, bis, MINDEST_REIHEN) })
  }

  plaetze.sort((a, b) => {
    if (a.befund.art !== b.befund.art) return a.befund.art === 'ausgewertet' ? -1 : 1
    return b.befund.reihen - a.befund.reihen
  })

  return { von, bis, plaetze }
}
