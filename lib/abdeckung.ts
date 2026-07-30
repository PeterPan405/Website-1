import { marketDefinitions } from '@/data/markets'
import { getBilanzzahlen } from '@/lib/fundamentaldaten'

/**
 * Wie vollständig die Daten sind – als Auskunft für die Website.
 *
 * ## Warum das öffentlich gehört
 *
 * `npm run abdeckung` rechnet diese Zahlen seit Juli 2026 aus, und sie standen
 * im Projektverzeichnis und in einem Terminal. Auf der Website kam das Wort
 * „Abdeckung“ auf genau einer von über tausend Seiten vor – auf der
 * Vergleichsseite, wo der Satz stand, die Zahlen fänden sich „in der Abdeckung
 * im Projektverzeichnis“. Also an einem Ort, den ein Besucher nicht erreicht.
 *
 * Kein anderer deutschsprachiger Anbieter schreibt hin, dass er zu jeder
 * zweiten Aktie keine Bilanzzahlen hat. Genau deshalb ist es glaubwürdig – und
 * es ist dieselbe Haltung, die geschätzte Termine kennzeichnet und beim
 * Vergleich keinen Sieger kürt, wo es keinen gibt.
 *
 * ## Warum abgeleitet und nicht abgetippt
 *
 * Weil eine abgetippte Abdeckung nach einer Woche falsch ist, ohne dass es
 * jemandem auffiele. Diese Funktionen zählen dieselben Bestände, aus denen die
 * Seiten ihre Zahlen nehmen.
 */

export interface Feldabdeckung {
  feld: string
  /** Wie viele der Aktien diese Angabe haben. */
  belegt: number
  gesamt: number
  /** Ein Satz dazu, was fehlt und warum. */
  erlaeuterung: string
}

/** Alle Aktien im Katalog – der mögliche Höchstwert für jedes Feld. */
export function aktienGesamt(): number {
  return marketDefinitions.filter((eintrag) => eintrag.kind === 'stock').length
}

/**
 * Die Abdeckung der Unternehmenszahlen.
 *
 * Die übrigen Felder – Kursverlauf, Dividenden, Quartalstermine – liefern ihre
 * eigenen Module; siehe `getDividendenAbdeckung` und
 * `getQuartalsterminAbdeckung`. Hier steht nur, was sonst nirgends steht.
 */
export function fundamentalAbdeckung(): { belegt: number; gesamt: number } {
  const aktien = marketDefinitions.filter((eintrag) => eintrag.kind === 'stock')
  const belegt = aktien.filter((eintrag) => getBilanzzahlen(eintrag.ticker)).length
  return { belegt, gesamt: aktien.length }
}

/**
 * Die fehlenden Unternehmenszahlen nach Sitzland.
 *
 * Nach Anzahl absteigend. Erst diese Aufschlüsselung macht aus „48 Prozent“
 * eine Auskunft: Die Lücke ist keine gleichmäßige Ausdünnung, sondern hängt an
 * einzelnen Ländern und ihren Meldepflichten.
 */
export function fehlendeNachLand(
  laendernamen: Readonly<Record<string, string>>
): { land: string; anzahl: number }[] {
  const zaehler = new Map<string, number>()

  for (const eintrag of marketDefinitions) {
    if (eintrag.kind !== 'stock') continue
    if (getBilanzzahlen(eintrag.ticker)) continue
    const land = eintrag.sitzland
      ? (laendernamen[eintrag.sitzland] ?? eintrag.sitzland)
      : 'ohne Sitzland'
    zaehler.set(land, (zaehler.get(land) ?? 0) + 1)
  }

  return [...zaehler.entries()]
    .map(([land, anzahl]) => ({ land, anzahl }))
    .sort((a, b) => b.anzahl - a.anzahl)
}

/**
 * Warum die Zahlen zu einem Land fehlen.
 *
 * Dieselbe Aufstellung wie in `scripts/abdeckung.ts`. Sie steht hier ein
 * zweites Mal, und das ist eine bewusste Doppelung: Das Skript läuft ohne
 * Next.js und darf den Alias `@/` nicht benutzen, diese Datei muss ihn
 * benutzen. Was beide teilen, sind die Sätze – und die ändern sich nur, wenn
 * sich die Quellenlage ändert.
 */
export const quellenlage: Readonly<Record<string, string>> = {
  /*
    Präziser als „die Zuordnung fehlt noch“: Der Abgleich gegen das
    ESEF-Verzeichnis hat 98 Unternehmen gefunden, darunter kein einziges
    deutsches. Ob die Abschlüsse dort fehlen oder nur unter Namen stehen, die
    der Abgleich nicht trifft, klärt `scripts/quellen-probe-esef-de.ts` – bis
    dahin wird hier nichts behauptet, was noch niemand gesehen hat.
  */
  Deutschland: 'ESEF – im offenen Verzeichnis bisher kein deutscher Abschluss gefunden',
  Japan: 'EDINET – Schlüssel nötig, der Abschluss steckt in einem ZIP-Archiv',
  Indien: 'keine geprüfte offene Quelle',
  China: 'keine geprüfte offene Quelle',
  'Vereinigtes Königreich': 'ESEF – teilweise zugeordnet',
  Frankreich: 'ESEF – teilweise zugeordnet',
  Schweiz: 'keine offene Quelle: nicht EU, keine US-Notierung',
  Südkorea: 'DART – Schlüssel nötig, das Skript steht',
  Niederlande: 'ESEF – teilweise zugeordnet',
  Schweden: 'ESEF – teilweise zugeordnet',
  Italien: 'ESEF – teilweise zugeordnet',
  Spanien: 'ESEF – teilweise zugeordnet',
  Taiwan: 'Börse Taipeh – eingebunden, nicht alle Titel gemeldet',
}
