/**
 * Legt die Kartengeometrie für den Globus unter `public/globus/` ab.
 *
 * ## Warum kopiert und nicht importiert
 *
 * Die Geometrie kommt aus dem npm-Paket `world-atlas` (Natural Earth, von
 * Mike Bostock nach TopoJSON umgesetzt). Sie direkt im Code zu importieren
 * hieße, 108 Kilobyte – bei der feineren Stufe 756 – in das JavaScript-Bundle
 * zu legen, das jede Seite lädt. Als Datei unter `public/` holt der Browser
 * sie nur auf der Globusseite und legt sie in seinen Cache.
 *
 * Dass die Dateien im Repository liegen und nicht beim Bauen aus
 * `node_modules` kopiert werden, ist Absicht: Beim statischen Export muss
 * alles, was ausgeliefert wird, vorher da sein. Ein Build, der von einem
 * Skriptlauf abhängt, den jemand vergessen kann, wäre eine Falle.
 *
 * ## Zwei Auflösungen
 *
 * `welt-110m.json` ist die Grundlage – klein genug, um sofort da zu sein.
 * `welt-50m.json` wird erst geladen, wenn jemand über eine bestimmte
 * Vergrößerung hinaus zoomt. Bei 110m sind Küstenlinien vereinfacht; auf dem
 * ganzen Globus sieht man das nicht, bei dreifacher Vergrößerung schon.
 *
 * ## Herkunft und Lizenz
 *
 * Natural Earth ist gemeinfrei. Die TopoJSON-Umsetzung steht unter der
 * ISC-Lizenz; der Lizenztext wird mitkopiert, damit der Nachweis im
 * Repository steht und nicht nur in `node_modules`.
 *
 * Aufruf: `npm run globus-geometrie`
 */

import { copyFile, mkdir, readFile, stat } from 'node:fs/promises'

import { ersatzschluessel, laendernamen } from '../data/laender/namen.ts'

const QUELLE = 'node_modules/world-atlas'
const ZIEL = 'public/globus'

const DATEIEN: { von: string; nach: string }[] = [
  { von: 'countries-110m.json', nach: 'welt-110m.json' },
  { von: 'countries-50m.json', nach: 'welt-50m.json' },
  { von: 'LICENSE', nach: 'LIZENZ-world-atlas.txt' },
]

/**
 * Jede Form der Geometrie muss einen deutschen Namen haben.
 *
 * Die feine Auflösung führt 64 Formen mehr als die grobe – Kleinstaaten und
 * Gebiete, die auf der ganzen Kugel keine zwei Pixel groß wären. Ohne Namen
 * werden sie trotzdem gezeichnet und reagieren auf Klicks, nur öffnet sich
 * dann eine leere Tafel. Genau so war es, bis es jemandem auffiel: Wer weit
 * genug in den Pazifik zoomte, fand ein Dutzend Inseln, die auf nichts
 * antworteten.
 *
 * Ein neues `world-atlas` kann jederzeit weitere Formen mitbringen. Deshalb
 * wird hier geprüft und nicht darauf vertraut, dass es beim nächsten Mal
 * auffällt.
 */
async function pruefeNamen(pfad: string): Promise<string[]> {
  const topologie = JSON.parse(await readFile(pfad, 'utf8')) as {
    objects: {
      countries: { geometries: { id?: string; properties?: { name?: string } }[] }
    }
  }

  const ohneNamen: string[] = []
  for (const form of topologie.objects.countries.geometries) {
    const name = form.properties?.name ?? '?'
    if (form.id !== undefined && form.id !== null) {
      if (!(String(form.id) in laendernamen)) ohneNamen.push(`${form.id} (${name})`)
      continue
    }
    // Ohne ISO-Kennung bleibt nur der englische Name als Schlüssel.
    const ersatz = ersatzschluessel[name]
    if (!ersatz || !(ersatz in laendernamen)) ohneNamen.push(`ohne Kennung (${name})`)
  }
  return ohneNamen
}

async function main() {
  await mkdir(ZIEL, { recursive: true })

  for (const datei of DATEIEN) {
    const von = `${QUELLE}/${datei.von}`
    const nach = `${ZIEL}/${datei.nach}`
    await copyFile(von, nach)
    const groesse = (await stat(nach)).size
    console.log(`${nach} – ${Math.round(groesse / 1024)} kB`)
  }

  const fehlend: string[] = []
  for (const datei of DATEIEN.filter((eintrag) => eintrag.nach.endsWith('.json'))) {
    for (const eintrag of await pruefeNamen(`${ZIEL}/${datei.nach}`)) {
      fehlend.push(`${datei.nach}: ${eintrag}`)
    }
  }

  if (fehlend.length > 0) {
    console.error(
      `\nOhne Eintrag in data/laender/namen.ts:\n${fehlend.map((f) => `  - ${f}`).join('\n')}`
    )
    process.exit(1)
  }

  console.log(
    `\nAlle Formen haben einen Namen (${Object.keys(laendernamen).length} Kennungen).`
  )
  console.log(
    'Herkunft: Natural Earth (gemeinfrei), TopoJSON-Umsetzung world-atlas (ISC).'
  )
}

main().catch((fehler) => {
  console.error(fehler)
  process.exit(1)
})
