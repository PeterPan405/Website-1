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
import {
  baueFolge,
  folgengewicht,
  SATZ_KURZ,
  SATZ_LANG,
  satzrhythmus,
  verdaechtigeAnglizismen,
  WORTZIEL_MAX,
  WORTZIEL_MIN,
} from '../lib/sprechfassung.ts'

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
if (folge.wortzahl < WORTZIEL_MIN || folge.wortzahl > WORTZIEL_MAX) {
  console.log(
    `[folge] Hinweis: außerhalb des Zielfensters ${WORTZIEL_MIN}–${WORTZIEL_MAX}. ` +
      `Gekürzt wird nie durch\n        Erfinden – eine ` +
      `${folge.wortzahl < WORTZIEL_MIN ? 'kürzere' : 'längere'} ehrliche Folge ist gewollt.`
  )
}

/*
  Wiegt das Gerüst so viel wie die Nachricht?

  Am 28. September 2026 gemeldet: „Das Intro und die Aufklärung danach gehen
  genauso lange wie der Podcast." Nachgerechnet stimmte das auf das Wort –
  103 Wörter Gerüst gegen 86 Wörter Meldung. Warum die Grenze bei der Hälfte
  liegt und nicht woanders, steht bei `folgengewicht`.

  Eine Warnung, kein Abbruch: Hier ist die Ausgabe schon geschrieben. Der
  Riegel, der etwas ändern kann, sitzt in `scripts/nachrichten-erzeugen.ts`.
*/
const gewicht = folgengewicht(folge.sprechtext)
console.log(
  `[folge] Gerüst ${gewicht.geruest} Wörter, Meldungen ${gewicht.meldungen} Wörter ` +
    `(Gerüst ${Math.round(gewicht.anteil * 100)} %).`
)
if (gewicht.geruest >= gewicht.meldungen) {
  console.log(
    `::warning::[folge] Das Gerüst wiegt so viel wie die Meldungen – Begrüßung und ` +
      `Hinweise sind so lang wie die Nachrichten.`
  )
  console.log(`        Das Gerüst ist fester Text und war noch nie länger als 110`)
  console.log(`        Wörter. Zu kurz ist die Ausgabe, nicht zu lang der Rahmen.`)
}

/*
  Was englisch aussieht und keine Umschrift hat, kommt hier ins Protokoll –
  **vor** dem Sprechen, nicht nach dem Hören.

  Bis zum 11. August 2026 fiel jeder solche Fall dem Betreiber beim Hören auf:
  „Alphabet", „Goldman Sachs", zuletzt der eigene Name. Das kostet jedes Mal
  eine Folge, eine Meldung und einen zweiten Lauf. Eine Warnung im Protokoll
  kostet nichts.

  Sie bricht nichts ab: Ob ein Wort englisch gesprochen gehört, entscheidet
  ein Ohr, nicht ein Muster. Siehe `verdaechtigeAnglizismen`.
*/
/*
  Und der Satzrhythmus – aus demselben Grund und mit demselben Gewicht.

  Am 27. September 2026 hat der Betreiber gemeldet, der Podcast klinge
  „langweilig, monoton". Nachgemessen war es nicht die Stimme, sondern der
  Text: Median 24 Wörter je Satz, die Hälfte über 25, fast nie ein kurzer.
  Warum das die Pausen mitnimmt, steht bei `satzrhythmus`.

  Eine Warnung, kein Abbruch. Ob ein Absatz einen langen Satz braucht,
  entscheidet der Stoff; eine Folge wegen Prosa zurückzuhalten wäre der
  Tausch, den dieses Projekt nicht macht.
*/
const rhythmus = satzrhythmus(folge.sprechtext)
if (rhythmus.anzahl > 0) {
  console.log(
    `[folge] Satzrhythmus: ${rhythmus.anzahl} Sätze, Median ${rhythmus.median} Wörter, ` +
      `${Math.round(rhythmus.kurzeAnteil * 100)} % kurz (<=${SATZ_KURZ}), ` +
      `${Math.round(rhythmus.langeAnteil * 100)} % lang (>=${SATZ_LANG}), ` +
      `${rhythmus.geklebt} mit Semikolon`
  )
  if (rhythmus.langeAnteil > 0.5 || rhythmus.kurzeAnteil < 0.1) {
    console.log(
      `::warning::[folge] Der Rhythmus ist gleichmäßig – so klingt die Folge monoton.`
    )
    console.log(`        Gebraucht werden kurze Sätze zwischen den langen: An ihnen`)
    console.log(`        hängt die Pausenlänge in scripts/sprechstimme.py.`)
  }
}

const verdaechtig = verdaechtigeAnglizismen(folge.sprechtext)
if (verdaechtig.length) {
  console.log(
    `::warning::[folge] ${verdaechtig.length} Wort/Wörter sehen englisch aus und haben ` +
      `keine Umschrift: ${verdaechtig.join(', ')}`
  )
  console.log(`        Wenn sie englisch klingen sollen: ENGLISCHE_NAMEN in`)
  console.log(`        lib/sprechfassung.ts ergänzen. Wenn nicht, hier stehen lassen.`)
}
