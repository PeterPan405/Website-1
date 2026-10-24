/**
 * Die Gegenprobe der Aktienzahlen, bevor die Momentaufnahme committet wird.
 *
 * Am 24.10.2026 kam Solvay (SOLB.BR) mit 1.099.057 statt 109.905.660 Aktien
 * aus dem Abruf – genau ein Hundertstel, ein Fehler in der Größenordnung der
 * Quelle. Der Lauf schrieb es ab, und `tests/fundamentalplausibel.test.ts`
 * hielt am nächsten Bau alles an: Kurs-Umsatz-Verhältnis 0,005. Ein
 * Bestand, den ein Bot jede Nacht schreibt, darf den Bau nicht anhalten;
 * der Fehler gehört dorthin, wo er entsteht.
 *
 * Eine Aktienzahl ändert sich durch Rückkäufe und Kapitalerhöhungen um
 * Prozente, durch einen Split um das Zwei- bis Zwanzigfache. Um das
 * Fünfzigfache nie. Springt sie so weit, bleibt die alte Zahl, und der Lauf
 * warnt mit Namen.
 *
 *     ALT=<Pfad zur letzten Fassung> node … scripts/fundamentaldaten-gegenprobe.ts
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

export const SPRUNG_GRENZE = 50

type Bestand = { unternehmen: Record<string, { aktien?: number }> }

/** Die Einträge, deren Aktienzahl um mindestens `SPRUNG_GRENZE` gesprungen ist. */
export function gesprungen(alt: Bestand, neu: Bestand): string[] {
  const treffer: string[] = []
  for (const [k, e] of Object.entries(neu.unternehmen)) {
    const vorher = alt.unternehmen[k]?.aktien
    if (!vorher || !e.aktien) continue
    const faktor = Math.max(e.aktien / vorher, vorher / e.aktien)
    if (faktor >= SPRUNG_GRENZE) treffer.push(k)
  }
  return treffer
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const ZIEL = 'data/snapshots/fundamentaldaten.json'
  const alt = JSON.parse(readFileSync(process.env.ALT!, 'utf8')) as Bestand
  const neu = JSON.parse(readFileSync(ZIEL, 'utf8')) as Bestand
  const liste = gesprungen(alt, neu)
  for (const k of liste) {
    console.log(
      `::warning::${k}: Aktienzahl ${neu.unternehmen[k].aktien} statt ${alt.unternehmen[k].aktien} – ` +
        `ein Sprung um das ${SPRUNG_GRENZE}fache und mehr ist kein Rückkauf und kein Split. Die alte Zahl bleibt.`
    )
    neu.unternehmen[k].aktien = alt.unternehmen[k].aktien
  }
  if (liste.length) writeFileSync(ZIEL, `${JSON.stringify(neu, null, 2)}\n`)
  console.log(`Gegenprobe Aktienzahlen: ${liste.length} zurückgesetzt.`)
}
