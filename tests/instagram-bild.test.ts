/**
 * Das Logo auf der Instagram-Kachel wird nicht verzerrt.
 *
 * ## Warum diese Prüfung existiert
 *
 * `lib/instagram-bild.tsx` lag vom 13. bis zum 16. August 2026 im Repository,
 * gemergt, von keiner Stelle importiert – **und damit nie ausgeführt.** Beim
 * ersten Rastern kam heraus:
 *
 *     public/logo.svg  viewBox 0 0 200 200   Verhältnis 1,00
 *     im Code          width 340 height 110  Verhältnis 3,09
 *
 * Das Logo wurde auf ein Drittel seiner Höhe gequetscht – der Ring zur
 * Ellipse, der Schriftzug „IMI" unlesbar breit. Auf einem Kanal unter eigenem
 * Namen wäre das hinausgegangen, und ein Beitrag bei Instagram ist nicht
 * zurückzunehmen, nur zu löschen; gesehen haben ihn dann schon welche.
 *
 * ## Was sie prüft
 *
 * Nicht, ob die Zahl 132 richtig ist – das ist Geschmack. Sondern **dass die
 * gerenderten Maße zum Seitenverhältnis der Datei passen.** Wer das Logo
 * austauscht oder die Größe ändert, bekommt hier Bescheid.
 *
 * ## Was sie nicht prüft
 *
 * Ob die Kachel schön aussieht. Das entscheidet ein Auge, und deshalb erzeugt
 * `npm run build` die Bilder nach `out/instagram/` – zum Ansehen, bevor etwas
 * veröffentlicht wird.
 *
 * ## Warum hier der Quelltext gelesen wird und nichts importiert
 *
 * `lib/instagram-bild.tsx` enthält JSX. Der Testläufer startet Node mit
 * `--experimental-strip-types`, und das entfernt Typen, übersetzt aber **kein
 * JSX** – ein Import endet mit `ERR_UNKNOWN_FILE_EXTENSION`. Ein Übersetzer
 * ist im Projekt nicht installiert.
 *
 * Dieselbe Grenze ist der Grund, warum die Kacheln über eine Route entstehen
 * (`app/instagram/[nr]/route.tsx`) und nicht über ein Skript: Was JSX rastern
 * soll, muss durch den Next-Bau.
 *
 * Für diese Prüfung ist das kein Verlust. Der Fehler bestand nicht in einem
 * Verhalten, sondern in **zwei Literalen nebeneinander** – und die stehen im
 * Quelltext.
 */

import { readFileSync } from 'node:fs'

const LOGO = 'public/logo.svg'
const QUELLE = 'lib/instagram-bild.tsx'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis: string): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}\n     ${hinweis}`)
  }
}

/** Das Seitenverhältnis aus der `viewBox` – Breite geteilt durch Höhe. */
function verhaeltnisDerDatei(): number {
  const treffer = readFileSync(LOGO, 'utf8').match(/viewBox="([\d.\s-]+)"/)
  if (!treffer)
    throw new Error(`${LOGO} hat keine viewBox – ohne sie ist kein Maß ableitbar.`)
  const [, , breite, hoehe] = treffer[1].trim().split(/\s+/).map(Number)
  return breite / hoehe
}

const quelle = readFileSync(QUELLE, 'utf8')

/** `export const LOGO_KANTE = 132` – aus dem Quelltext, siehe Kopf. */
function logoKante(): number {
  const treffer = quelle.match(/export const LOGO_KANTE\s*=\s*(\d+)/)
  if (!treffer) {
    throw new Error(
      `LOGO_KANTE steht nicht in ${QUELLE}. Entweder ist die Konstante ` +
        'umbenannt worden – dann gehört diese Prüfung angepasst – oder das ' +
        'Logo bekommt wieder eigene Zahlen, und genau das war der Fehler.'
    )
  }
  return Number(treffer[1])
}

const LOGO_KANTE = logoKante()
const soll = verhaeltnisDerDatei()
console.log(`${LOGO}: Seitenverhältnis ${soll.toFixed(3)}, LOGO_KANTE ${LOGO_KANTE}\n`)

pruefen(
  'Das Logo wird quadratisch gerendert, weil die Datei quadratisch ist',
  Math.abs(soll - 1) < 0.01,
  `${LOGO} hat das Verhältnis ${soll.toFixed(3)}, nicht 1,00. Dann ist eine ` +
    'einzelne Kantenlänge das falsche Maß – `LOGO_KANTE` gehört durch Breite ' +
    'und Höhe ersetzt, und diese Prüfung mit.'
)

pruefen(
  `LOGO_KANTE ist eine brauchbare Größe (ist ${LOGO_KANTE})`,
  Number.isFinite(LOGO_KANTE) && LOGO_KANTE >= 60 && LOGO_KANTE <= 400,
  `${LOGO_KANTE} px auf einer 1080 px breiten Kachel – unter 60 unsichtbar, ` +
    'über 400 erschlägt es die Schlagzeilen.'
)

/*
  Und der Rückfall in die alte Falle: zwei getrennte Zahlen am `<img>`.

  Gelesen wird der Quelltext, weil genau das die Stelle war – nicht ein
  Verhalten, sondern zwei Literale nebeneinander, die auseinanderlaufen
  konnten. Ein Test über das gerenderte Bild fände es auch, bräuchte dafür
  aber den ganzen Rasterweg.
*/

const getrennteMasse = quelle.match(/<img[^>]*\swidth=\{(?!LOGO_KANTE)[^}]+\}[^>]*>/)

pruefen(
  'Kein <img> mit eigenen Breiten- und Höhenzahlen',
  getrennteMasse === null,
  `Gefunden: ${getrennteMasse?.[0]?.slice(0, 80)}…\n` +
    '     Zwei Zahlen sind die Gelegenheit, sie auseinanderlaufen zu lassen –\n' +
    '     genau so ist die Verzerrung entstanden. `LOGO_KANTE` für beide.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
