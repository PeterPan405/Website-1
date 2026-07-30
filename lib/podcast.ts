import momentaufnahme from '@/data/snapshots/podcast.json'

import { dauerText, type Folge } from '@/lib/podcast-feed'

/**
 * Die Folgen des Podcasts.
 *
 * Die Momentaufnahme entsteht durch `.github/workflows/podcast.yml` aus dem
 * RSS-Feed des Podcasts. Zur Laufzeit gibt es keinen Server, der etwas
 * nachladen könnte – wie überall auf dieser Website.
 *
 * ## Solange keine Feed-Adresse hinterlegt ist
 *
 * ist die Liste leer, und das ist ein gültiger Zustand, kein Fehler. Die
 * Übersichtsseite steht dann trotzdem und sagt, wo der Podcast zu hören ist.
 * Der Bestand hier ist die einzige Stelle, die darüber entscheidet – keine
 * Seite zählt Folgen von Hand.
 *
 * ## Warum eine Seite mit Sprungmarken und nicht eine Seite je Folge
 *
 * Zwei Gründe, einer davon zwingend.
 *
 * Der zwingende: Ein `[slug]`-Verzeichnis, dessen `generateStaticParams()` eine
 * leere Liste zurückgibt, bricht den Build ab – `output: export` verlangt
 * mindestens eine vorgerenderte Adresse. Genau dieser Zustand liegt aber vor,
 * solange keine Feed-Adresse hinterlegt ist. Eine Platzhalterfolge zu erfinden,
 * nur damit der Build durchläuft, kam nicht in Frage.
 *
 * Der inhaltliche: Was der Feed je Folge hergibt, sind ein Titel, ein Datum und
 * ein Ankündigungsabsatz. Daraus entstünden dünne Seiten – für Suchmaschinen
 * ein Nachteil, und für einen Leser auch: Wer die Folgen überfliegen will,
 * klickt sich sonst durch fünfzig Seiten. Jede Folge hat trotzdem ihre eigene
 * Adresse, nämlich `/podcast#<slug>`; genau so hält es das Glossar mit seinen
 * Begriffen, und die Suche verweist ebenso dorthin.
 *
 * ## Was hier nicht passiert
 *
 * Keine Wiedergabe. Eingebettet wird nichts, weder ein Spotify-Abspieler noch
 * die Audiodatei: Ein Abspieler eines Drittanbieters lädt beim Seitenaufruf
 * dessen Skripte nach und setzt Kennungen, bevor jemand auf „Play“ drückt.
 * Verlinkt wird die Folge, gehört wird sie dort, wo der Podcast liegt.
 */

interface Momentaufnahme {
  abgerufenAm: string | null
  feed: string | null
  titel: string | null
  beschreibung: string | null
  folgen: Folge[]
}

const daten = momentaufnahme as Momentaufnahme

/** Wann der Feed zuletzt gelesen wurde – `null`, solange kein Lauf war. */
export const podcastStand: string | null = daten.abgerufenAm

/** Der Titel des Podcasts, wie er im Feed steht. */
export const podcastTitel: string | null = daten.titel

/** Die Beschreibung des Podcasts aus dem Feed. */
export const podcastBeschreibung: string | null = daten.beschreibung

export type { Folge }

/** Alle Folgen, jüngste zuerst. */
export function getFolgen(): Folge[] {
  return daten.folgen
}

/** Die Adresse einer Folge – die Übersicht mit ihrer Sprungmarke. */
export function folgenAdresse(folge: Folge): string {
  return `/podcast#${folge.slug}`
}

/** Die Dauer einer Folge als Text, oder `null`. */
export function folgenDauer(folge: Folge): string | null {
  return dauerText(folge.dauerSekunden)
}

/**
 * Kurzfassung der Beschreibung für Übersicht und Meta-Angaben.
 *
 * Gekürzt wird an der letzten Satzgrenze vor der Grenze, ersatzweise am
 * letzten Wort. Mitten im Wort abzuschneiden liest sich wie ein Fehler, und
 * eine Meta-Description darf 160 Zeichen nicht überschreiten – das prüft
 * `scripts/paket-pruefen.ts`.
 */
export function kurzfassung(text: string, grenze = 155): string {
  if (text.length <= grenze) return text

  const angeschnitten = text.slice(0, grenze)
  const satzende = Math.max(
    angeschnitten.lastIndexOf('. '),
    angeschnitten.lastIndexOf('! '),
    angeschnitten.lastIndexOf('? ')
  )
  if (satzende > grenze * 0.5) return angeschnitten.slice(0, satzende + 1)

  const wortende = angeschnitten.lastIndexOf(' ')
  return `${angeschnitten.slice(0, wortende > 0 ? wortende : grenze).trimEnd()} …`
}
