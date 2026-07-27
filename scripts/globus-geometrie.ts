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

import { copyFile, mkdir, stat } from 'node:fs/promises'

const QUELLE = 'node_modules/world-atlas'
const ZIEL = 'public/globus'

const DATEIEN: { von: string; nach: string }[] = [
  { von: 'countries-110m.json', nach: 'welt-110m.json' },
  { von: 'countries-50m.json', nach: 'welt-50m.json' },
  { von: 'LICENSE', nach: 'LIZENZ-world-atlas.txt' },
]

async function main() {
  await mkdir(ZIEL, { recursive: true })

  for (const datei of DATEIEN) {
    const von = `${QUELLE}/${datei.von}`
    const nach = `${ZIEL}/${datei.nach}`
    await copyFile(von, nach)
    const groesse = (await stat(nach)).size
    console.log(`${nach} – ${Math.round(groesse / 1024)} kB`)
  }

  console.log(
    '\nHerkunft: Natural Earth (gemeinfrei), TopoJSON-Umsetzung world-atlas (ISC).'
  )
}

main().catch((fehler) => {
  console.error(fehler)
  process.exit(1)
})
