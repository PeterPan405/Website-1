/**
 * Erzeugt die Podcastfolge des Tages aus der Tagesausgabe.
 *
 * Aufruf:  npm run folge            – nimmt die Ausgabe von heute (UTC)
 *          STICHTAG=2026-08-08 npm run folge
 *
 * Schreibt nach `podcast-folge/`:
 *   sprechtext.txt    – der Text für die Vertonung
 *   titel.txt         – Titelzeile, erste Zeile; zweite Zeile „Folge N“
 *   beschreibung.txt  – mit Platzhalter [KAPITEL] für die Zeitmarken
 *   kapitel.txt       – ein Kapitelname je Zeile, Zeiten kommen aus der Audiodatei
 *   folge.json        – alles zusammen, maschinenlesbar
 *
 * Das Verzeichnis gehört nicht ins Repository (siehe .gitignore): Es ist das
 * Arbeitsmaterial eines einzelnen Laufs, kein Bestand.
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

import type { DailyEdition } from '../data/editions/types.ts'
import { baueFolge } from '../lib/sprechfassung.ts'

const stichtag = process.env.STICHTAG?.trim() || new Date().toISOString().slice(0, 10)

/*
  Die Ausgabedatei direkt laden, nicht über `data/editions/index.ts`: Dessen
  Importe stehen ohne Dateiendung, und das versteht nur der Next-Build. Die
  einzelne Tagesdatei importiert ausschließlich Typen – die entfernt das
  Type-Stripping, übrig bleibt reines Datenmodul.
*/
const pfad = `data/editions/${stichtag}.ts`
if (!existsSync(pfad)) {
  console.error(`[folge] Keine Tagesausgabe unter ${pfad} – ohne Ausgabe keine Folge.`)
  process.exit(1)
}
const { edition } = (await import(pathToFileURL(pfad).href)) as { edition: DailyEdition }

const folge = baueFolge(edition)

mkdirSync('podcast-folge', { recursive: true })
writeFileSync('podcast-folge/sprechtext.txt', folge.sprechtext + '\n')
writeFileSync('podcast-folge/titel.txt', `${folge.titel}\nFolge ${folge.nummer}\n`)
writeFileSync('podcast-folge/beschreibung.txt', folge.beschreibung + '\n')
writeFileSync('podcast-folge/kapitel.txt', folge.kapitel.join('\n') + '\n')
writeFileSync('podcast-folge/folge.json', JSON.stringify(folge, null, 2) + '\n')

console.log(`[folge] ${folge.datum} – Folge ${folge.nummer}: ${folge.titel}`)
console.log(`[folge] ${folge.wortzahl} Wörter, ${folge.kapitel.length} Kapitel.`)
if (folge.wortzahl < 710 || folge.wortzahl > 740) {
  console.log(
    `[folge] Hinweis: außerhalb des Zielfensters 710–740. Gekürzt wird nie durch\n` +
      `        Erfinden – eine ${folge.wortzahl < 710 ? 'kürzere' : 'längere'} ehrliche Folge ist gewollt.`
  )
}
