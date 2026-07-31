/**
 * Findet Seiten, auf die von keiner anderen Seite ein Verweis führt.
 *
 * ## Warum das eine eigene Prüfung braucht
 *
 * Weil eine Seite, die niemand verlinkt, für Leser praktisch nicht existiert –
 * und für Suchmaschinen fast genauso wenig. Sie steht in der Sitemap, sie
 * antwortet mit Statuscode 200, sie ist fehlerfrei gebaut. Nur führt kein Weg
 * dorthin. Bei über 1.400 Seiten fällt so etwas nie von selbst auf: Niemand
 * vermisst eine Seite, die er nicht kennt.
 *
 * Entstanden ist die Lage typischerweise so, dass eine Rubrik umgebaut wurde
 * und die Übersicht danach auf die neuen Adressen zeigte – die alten Seiten
 * blieben, ihre Verweise nicht.
 *
 * ## Was gezählt wird
 *
 * Verweise **zwischen** Seiten des Pakets, aus dem gebauten HTML. Nicht die
 * Sitemap: Die listet definitionsgemäß alles und würde jede Verwaisung
 * zudecken. Genau darum geht es ja – in der Sitemap steht die Seite, im
 * Menü nicht.
 *
 * ## Was bewusst kein Befund ist
 *
 * - **Die Startseite.** Auf sie führt der Weg von außen.
 * - **Fehlerseiten.** `/404` wird vom Server ausgeliefert, nicht verlinkt.
 * - **Seiten mit eigener Bestimmung.** Die Druckansichten etwa werden aus dem
 *   Browser heraus geöffnet und stehen absichtlich in keinem Menü.
 *
 * Aufruf: `npm run verwaist`
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const PAKET = 'out'

/**
 * Adressen, die keinen eingehenden Verweis brauchen.
 *
 * Jeder Eintrag braucht einen Grund. Eine Ausnahmeliste ohne Begründungen wird
 * zur Ablage für alles, was gerade stört – und dann meldet die Prüfung nichts
 * mehr, was sie melden sollte.
 */
const OHNE_VERWEIS_IN_ORDNUNG: { muster: RegExp; grund: string }[] = [
  { muster: /^\/$/, grund: 'Die Startseite. Der Weg dorthin führt von außen.' },
  { muster: /^\/404$/, grund: 'Fehlerseite; wird ausgeliefert, nicht verlinkt.' },
  {
    muster: /^\/_not-found$/,
    grund:
      'Next.js legt diese Route selbst an und liefert sie bei unbekannten Adressen aus. ' +
      'Sie ist kein Ziel, sondern ein Auffangbecken.',
  },
  {
    muster: /^\/suchindex\.json$/,
    grund: 'Datenbestand der Suche, keine Seite zum Ansehen.',
  },
]

function alleSeiten(ordner: string): string[] {
  const gefunden: string[] = []
  const laufen = (pfad: string): void => {
    for (const eintrag of readdirSync(pfad)) {
      const voll = join(pfad, eintrag)
      // `_next` enthält Bündel, keine Seiten.
      if (eintrag === '_next') continue
      if (statSync(voll).isDirectory()) laufen(voll)
      else if (voll.endsWith('.html')) gefunden.push(voll)
    }
  }
  laufen(ordner)
  return gefunden
}

/** Aus einem Dateipfad die Adresse machen, unter der die Seite steht. */
function adresse(datei: string): string {
  const rel = '/' + relative(PAKET, datei).split('\\').join('/')
  const ohneIndex = rel.replace(/index\.html$/, '').replace(/\.html$/, '')
  return ohneIndex.length > 1 ? ohneIndex.replace(/\/$/, '') : '/'
}

/**
 * Alle internen Ziele aus einem Dokument.
 *
 * Nur `href`, nicht `src`: Ein Bild ist kein Weg zu einer Seite. Anker und
 * Abfrageteile fallen weg, damit `/lernen#stufen` und `/lernen` dasselbe Ziel
 * sind – für die Frage „führt hier ein Weg hin?“ sind sie es.
 */
function verweiseAus(html: string): Set<string> {
  const ziele = new Set<string>()
  for (const treffer of html.matchAll(/href="([^"]+)"/g)) {
    let ziel = treffer[1]
    if (!ziel.startsWith('/')) continue
    ziel = ziel.split('#')[0].split('?')[0]
    if (ziel === '') continue
    if (ziel.length > 1) ziel = ziel.replace(/\/$/, '')
    ziele.add(ziel)
  }
  return ziele
}

const seiten = alleSeiten(PAKET)
const bekannt = new Set(seiten.map(adresse))

/** Wie viele Seiten auf diese Adresse zeigen. */
const eingehend = new Map<string, number>()
for (const ziel of bekannt) eingehend.set(ziel, 0)

for (const datei of seiten) {
  const von = adresse(datei)
  const html = readFileSync(datei, 'utf8')
  for (const ziel of verweiseAus(html)) {
    // Ein Verweis auf sich selbst ist kein Weg zu sich selbst.
    if (ziel === von) continue
    if (!eingehend.has(ziel)) continue
    eingehend.set(ziel, (eingehend.get(ziel) ?? 0) + 1)
  }
}

const verwaist = [...eingehend.entries()]
  .filter(([, anzahl]) => anzahl === 0)
  .map(([ziel]) => ziel)
  .filter((ziel) => !OHNE_VERWEIS_IN_ORDNUNG.some(({ muster }) => muster.test(ziel)))
  .sort()

console.log(`Verweise geprüft: ${seiten.length} Seiten.\n`)

if (verwaist.length === 0) {
  console.log('Auf jede Seite führt mindestens ein Verweis.')
  process.exit(0)
}

/*
  Nach dem ersten Pfadglied gruppieren. Verwaisung tritt fast nie einzeln auf –
  sie trifft einen ganzen Zweig, weil dessen Übersicht fehlt oder umgebaut
  wurde. Zweihundert Adressen untereinander verdecken diesen Umstand; „204 unter
  /lernen/stufe“ zeigt ihn.
*/
const nachZweig = new Map<string, string[]>()
for (const ziel of verwaist) {
  const zweig = '/' + (ziel.split('/')[1] ?? '')
  nachZweig.set(zweig, [...(nachZweig.get(zweig) ?? []), ziel])
}

console.log(`${verwaist.length} Seiten ohne eingehenden Verweis:\n`)
for (const [zweig, ziele] of [...nachZweig.entries()].sort(
  (a, b) => b[1].length - a[1].length
)) {
  console.log(`  ${zweig}  –  ${ziele.length}`)
  for (const ziel of ziele.slice(0, 5)) console.log(`      ${ziel}`)
  if (ziele.length > 5) console.log(`      … und ${ziele.length - 5} weitere`)
}

console.log(
  '\nEine Seite ohne eingehenden Verweis steht in der Sitemap und sonst nirgends.\n' +
    'Entweder gehört sie verlinkt – aus einer Übersicht, einem Menü, einem Artikel –\n' +
    'oder sie gehört nicht gebaut. Ist sie mit Absicht nur direkt erreichbar, kommt\n' +
    'sie mit Begründung in die Ausnahmeliste dieses Skripts.'
)
process.exit(1)
