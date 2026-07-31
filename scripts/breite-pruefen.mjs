import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

/**
 * Playwright laden, wo immer es liegt.
 *
 * Es steht bewusst **nicht** in den Abhängigkeiten des Projekts: Der
 * Veröffentlichungs-Workflow ruft `npm ci` bei jedem Deployment auf und lüde
 * dann rund fünfzig Megabyte mit, die dort nie gebraucht werden. Diese Prüfung
 * läuft von Hand und vor dem Ausliefern, nicht beim Ausliefern.
 *
 * Also erst der normale Weg, dann das globale Verzeichnis. Findet sich beides
 * nicht, sagt die Meldung, was zu tun ist – ein `ERR_MODULE_NOT_FOUND` mit
 * Stapelspur sagt es nicht.
 */
async function ladeChromium() {
  try {
    return (await import('playwright')).chromium
  } catch {
    try {
      /*
        `createRequire` und nicht `import` auf den Pfad: Ein ESM-Import löst
        keine Paketverzeichnisse auf – er will die Moduldatei selbst. `require`
        liest die `package.json` des Pakets und findet den Einstiegspunkt, ohne
        dass hier `index.mjs` fest hineingeschrieben werden muss.
      */
      const wurzel = execSync('npm root -g', { encoding: 'utf8' }).trim()
      const hole = createRequire(pathToFileURL(join(wurzel, 'platzhalter.js')).href)
      return hole('playwright').chromium
    } catch {
      console.error(
        'Playwright ist nicht auffindbar. Diese Prüfung braucht einen echten\n' +
          'Browser – der Fehler entsteht erst beim Setzen und ist im HTML nicht\n' +
          'zu sehen. Abhilfe: npm install -g playwright'
      )
      process.exit(2)
    }
  }
}

const chromium = await ladeChromium()

/**
 * Prüft, ob eine gebaute Seite breiter ist als das Telefonfenster.
 *
 * ## Warum es diese Prüfung gibt
 *
 * Weil derselbe Fehler zweimal zurückkam und beide Male nur auffiel, weil
 * jemand ein Foto vom Handy geschickt hat. Er sieht am Schreibtisch nicht
 * schlimm aus – er sieht dort überhaupt nicht aus.
 *
 * Die Ursache ist jedes Mal dieselbe Mechanik: Ein Rasterfeld hat von sich aus
 * `min-width: auto` und schrumpft nicht unter die kleinste Breite seines
 * Inhalts. Steht darin etwas mit `white-space: nowrap` – jedes `truncate` –,
 * ist diese kleinste Breite die **volle** Textbreite. Ein langer Name reicht,
 * und die Seite lässt sich seitlich schieben.
 *
 * Auffallen kann das keiner Prüfung, die HTML liest: Es entsteht erst beim
 * Setzen. Deshalb ein echter Browser.
 *
 * ## Was geprüft wird
 *
 * `scrollWidth` des Dokuments gegen die Fensterbreite. Ist die Seite breiter,
 * werden die schuldigen Elemente genannt – mit Position, Breite und
 * Klassennamen, damit die Meldung zur Ursache führt und nicht nur zum Symptom.
 *
 * Aufruf: `node scripts/breite-pruefen.mjs [URL-Basis]`
 * Voreinstellung ist ein lokaler Server auf Port 4173 über `out/`.
 */

/** Das schmalste Fenster, das ernsthaft vorkommt: iPhone SE. */
const BREITE = 375
const HOEHE = 812

/**
 * Ein Pixel Toleranz.
 *
 * Unterpixelbreiten aus `border` und Skalierung erzeugen sonst Fehlalarme, und
 * eine Prüfung, die manchmal grundlos anschlägt, wird bald abgeschaltet.
 */
const TOLERANZ = 1

/**
 * Die geprüften Seiten – je eine je Bauart, nicht alle 1.400.
 *
 * Ausgewählt nach dem, woran der Fehler entstehen kann: Kachelraster mit
 * fremden Namen, lange Tabellen, Diagramme, Formulare.
 */
const SEITEN = [
  ['/', 'Startseite'],
  ['/maerkte/', 'Marktübersicht – Kachelraster mit ETF-Namen'],
  ['/maerkte/apple/', 'Einzelne Aktie – Kennzahlen und Verlauf'],
  ['/maerkte/branchen/halbleiter/', 'Branchenseite – lange Kursliste'],
  ['/maerkte/dividenden/', 'Dividenden – zwei Ranglisten nebeneinander'],
  ['/maerkte/vergleich/', 'Vergleich – zwei Kurven und eine Gegenüberstellung'],
  ['/news/', 'Nachrichten – Anrisse und Archiv'],
  ['/lernen/stand/', 'Lernstand – Tabelle mit 34 Zeilen'],
  ['/rechner/zinsrechner/', 'Rechner – Eingabefelder und Ergebnis'],
  ['/globus/', 'Globus – SVG in voller Breite'],
  ['/staatsverschuldung/', 'Staatsverschuldung – Ländertabelle'],
]

const basis = (process.argv[2] ?? 'http://127.0.0.1:4173').replace(/\/$/, '')

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
})
const seite = await browser.newPage({ viewport: { width: BREITE, height: HOEHE } })

let beanstandungen = 0

for (const [pfad, was] of SEITEN) {
  let befund
  try {
    const antwort = await seite.goto(basis + pfad, { waitUntil: 'networkidle' })
    if (!antwort || !antwort.ok()) {
      console.error(`FEHL ${pfad} – ${antwort ? antwort.status() : 'keine Antwort'}`)
      beanstandungen += 1
      continue
    }
    befund = await seite.evaluate((toleranz) => {
      const fenster = document.documentElement.clientWidth
      const schuldige = []
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) continue
        if (r.right <= fenster + toleranz && r.left >= -toleranz) continue
        /*
          Was in einem scrollbaren Kasten steht, ist kein Fehler.

          Eine Vergleichstabelle mit `min-w-[38rem]` in einem
          `overflow-x-auto`-Kasten ragt zwangsläufig über das Fenster hinaus –
          und genau dafür ist der Kasten da. Verboten ist, dass sich die
          **Seite** schieben lässt, nicht dass ein Bestandteil breiter ist als
          das Fenster. Ohne diese Unterscheidung meldete die Prüfung jede
          absichtlich breite Tabelle und wäre nach einer Woche abgeschaltet.
        */
        let gefangen = false
        for (let v = el.parentElement; v && v !== document.body; v = v.parentElement) {
          const stil = getComputedStyle(v)
          if (stil.overflowX === 'auto' || stil.overflowX === 'scroll') {
            gefangen = true
            break
          }
        }
        if (gefangen) continue
        /*
          Nur das äußerste Element je Kette melden. Ein zu breiter Container
          macht jedes Kind darin ebenfalls zu breit – gemeldet gehört der, der
          es verursacht, nicht seine dreißig Nachkommen.
        */
        if (schuldige.some((s) => s.el.contains(el))) continue
        schuldige.push({
          el,
          tag: el.tagName.toLowerCase(),
          klasse: (el.className?.toString?.() ?? '').slice(0, 80),
          text: (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 50),
          links: Math.round(r.left),
          rechts: Math.round(r.right),
        })
      }
      return {
        fenster,
        scrollBreite: document.documentElement.scrollWidth,
        schuldige: schuldige.slice(0, 5).map(({ el: _weg, ...rest }) => rest),
      }
    }, TOLERANZ)
  } catch (fehler) {
    console.error(`FEHL ${pfad} – ${fehler.message}`)
    beanstandungen += 1
    continue
  }

  const ueberstand = befund.scrollBreite - befund.fenster
  if (ueberstand <= TOLERANZ) {
    console.log(`OK   ${pfad}`)
    continue
  }

  beanstandungen += 1
  console.error(
    `\nFEHL ${pfad} – ${befund.scrollBreite} statt ${befund.fenster} Pixel breit ` +
      `(${ueberstand} zu viel)\n     ${was}`
  )
  for (const s of befund.schuldige) {
    console.error(`     ${s.tag} [${s.links}…${s.rechts}]  ${s.klasse}`)
    console.error(`         „${s.text}"`)
  }
  console.error(
    '     Häufigste Ursache: ein Rasterfeld ohne `min-w-0` mit `truncate` darin.'
  )
}

await browser.close()

console.log(
  `\n${SEITEN.length - beanstandungen} von ${SEITEN.length} Seiten passen in ${BREITE} Pixel.`
)
if (beanstandungen > 0) {
  console.error(
    'Die Seite lässt sich auf dem Telefon seitlich schieben. Das gehört behoben.'
  )
  process.exit(1)
}
