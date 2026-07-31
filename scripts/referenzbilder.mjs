import { execSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

/**
 * Friert wichtige Seiten als Bild ein und vergleicht sie bei jedem Lauf.
 *
 * ## Warum es das braucht
 *
 * Weil derselbe Layoutfehler zweimal zurückkam und beide Male dadurch
 * auffiel, dass jemand ein Foto vom Handy geschickt hat. `npm run breite`
 * fängt seither den einen Fall, den man messen kann: Die Seite ist breiter
 * als das Fenster. Alles andere fängt es nicht.
 *
 * Ein Kasten, der zusammenklappt. Eine Überschrift, die auf drei Zeilen
 * umbricht. Eine Kachel, die verschwindet, weil eine Bedingung kippte. Eine
 * Fußzeile, die plötzlich am Text klebt. Nichts davon ist ein Fehler, den eine
 * Regel beschreiben kann – aber jeder davon sieht man sofort, wenn man das
 * Bild von vorher danebenhält.
 *
 * ## Was verglichen wird
 *
 * Sechs Seiten in vier Ansichten: schmal, Tablet quer, breit – und breit im
 * dunklen Thema. Die 1.080 Pixel sind nicht willkürlich: Genau dort saß der
 * gemeldete Kopfzeilenfehler, zwischen dem Umschaltpunkt bei 1.024 und der
 * Breite, ab der die volle Navigation passt.
 *
 * Aufgenommen wird der **sichtbare Ausschnitt**, nicht die ganze Seite. Zwei
 * Gründe: Die Bilder bleiben klein genug fürs Repository, und alles, was noch
 * nicht hereingescrollt wurde, steht wegen `Reveal` ohnehin auf
 * `opacity: 0` – eine ganze Seite wäre halb unsichtbar und trotzdem
 * unterschiedlich groß.
 *
 * ## Warum Zahlen abgedeckt werden
 *
 * Weil die Kurse alle dreißig Minuten neu abgerufen werden. Ohne Abdeckung
 * wäre jedes Referenzbild binnen einer halben Stunde veraltet, und eine
 * Prüfung, die täglich grundlos anschlägt, wird abgeschaltet – dann hat man
 * die Bilder und die Sicherheit nicht.
 *
 * Abgedeckt wird dreierlei, siehe `MASKEN`: alles mit `tabular-nums` (so
 * setzt die Website ihre Zahlen), jeder `fk-chip` (dort steht die
 * Tagesveränderung) und alles mit `data-fliesst` – dem Merkmal, das an
 * Kurszeichnungen und der „Stand …“-Zeile hängt.
 *
 * Das Rechteck hat die **genauen Maße des Elements**: Eine Zahl, die durch
 * einen Umbau plötzlich doppelt so breit steht oder auf zwei Zeilen geht,
 * verändert das Rechteck und fällt weiterhin auf. Verdeckt ist der Wert, nicht
 * der Platz, den er braucht – und Platz ist das, worum es hier geht.
 *
 * Kommt eine neue Stelle mit laufenden Daten dazu, ohne dass sie markiert
 * wird, schlägt die Prüfung an. Das ist kein Fehlalarm, sondern die Meldung:
 * Hier fehlt ein `data-fliesst`.
 *
 * ## Toleranz
 *
 * Ein Pixel gilt als verschieden, wenn ein Farbkanal um mehr als
 * `KANAL_TOLERANZ` abweicht – Kantenglättung erzeugt sonst bei jedem Lauf ein
 * paar Prozent Rauschen. Angeschlagen wird ab `ANTEIL_GRENZE` verschiedener
 * Pixel: Ein verrutschter Kasten trifft Tausende, ein neu gerenderter
 * Buchstabe ein paar Dutzend.
 *
 * ## Aufruf
 *
 * ```
 * npm run bilder             # vergleichen
 * npm run bilder -- --neu    # Referenzbilder neu aufnehmen
 * ```
 *
 * Nach einer **gewollten** Änderung am Layout werden die Bilder neu
 * aufgenommen, und der Commit zeigt im Bildvergleich, was sich geändert hat.
 * Genau das ist der Zweck: Die Änderung steht im Diff, statt unbemerkt zu
 * passieren.
 */

async function ladeChromium() {
  try {
    return (await import('playwright')).chromium
  } catch {
    try {
      const wurzel = execSync('npm root -g', { encoding: 'utf8' }).trim()
      const hole = createRequire(pathToFileURL(join(wurzel, 'platzhalter.js')).href)
      return hole('playwright').chromium
    } catch {
      console.error(
        'Playwright ist nicht auffindbar. Diese Prüfung braucht einen echten\n' +
          'Browser – ein Layout entsteht erst beim Setzen. Abhilfe:\n' +
          'npm install -g playwright'
      )
      process.exit(2)
    }
  }
}

/** Die eingefrorenen Seiten – je eine je Bauart. */
const SEITEN = [
  ['startseite', '/'],
  ['marktuebersicht', '/maerkte/'],
  ['einzelne-aktie', '/maerkte/apple/'],
  ['nachrichten', '/news/'],
  ['lernstufe', '/lernen/aktie/beginner/'],
  ['jahresrueckblick', '/news/jahr/2026/'],
]

/**
 * Die Ansichten.
 *
 * 375 ist das schmalste Fenster, das ernsthaft vorkommt; 1.080 die Breite des
 * gemeldeten Fehlers; 1.440 der breite Schreibtisch. Das dunkle Thema nur
 * einmal – seine Fehler sind Farbfehler, und dafür gibt es `npm run kontrast`.
 * Was hier zusätzlich auffallen soll, ist ein Kasten, den nur das dunkle Thema
 * verschiebt.
 */
const ANSICHTEN = [
  { name: '375', breite: 375, thema: 'light' },
  { name: '1080', breite: 1080, thema: 'light' },
  { name: '1440', breite: 1440, thema: 'light' },
  { name: '1440-dunkel', breite: 1440, thema: 'dark' },
]

const HOEHE = 900

/**
 * Was vor dem Einfrieren abgedeckt wird.
 *
 * Playwright legt über jeden Treffer ein Rechteck in `maskColor` – exakt in
 * den Maßen des Elements.
 */
const MASKEN = [
  /* Zahlen: Kurse, Stände, Prozente, Kennzahlen. */
  '[class*="tabular-nums"]',
  /* Die Chips tragen die Tagesveränderung. */
  '.fk-chip',
  /* Kurszeichnungen und die „Stand …“-Zeile, von Hand markiert. */
  '[data-fliesst]',
]

/** Ab dieser Abweichung je Farbkanal gilt ein Pixel als verschieden. */
const KANAL_TOLERANZ = 12

/** Ab diesem Anteil verschiedener Pixel schlägt die Prüfung an. */
const ANTEIL_GRENZE = 0.002

const ORDNER = 'tests/referenzbilder'
const ABWEICHUNGEN = 'tests/referenzbilder/abweichungen'

const argumente = process.argv.slice(2)
const schreiben = argumente.includes('--neu')
const basis = (
  argumente.find((a) => a.startsWith('http')) ?? 'http://127.0.0.1:4173'
).replace(/\/$/, '')

/**
 * Vergleicht zwei PNG im Browser.
 *
 * Die Bilder werden dort dekodiert, wo sie ohnehin entstanden sind. Die
 * Alternative wäre eine PNG-Bibliothek in den Abhängigkeiten – für eine
 * Prüfung, die von Hand läuft und Playwright schon voraussetzt, ist das eine
 * Abhängigkeit zu viel.
 */
async function vergleiche(seite, altBase64, neuBase64) {
  return seite.evaluate(
    async ([alt, neu, toleranz]) => {
      const lade = (daten) =>
        new Promise((fertig, fehler) => {
          const bild = new Image()
          bild.onload = () => fertig(bild)
          bild.onerror = fehler
          bild.src = `data:image/png;base64,${daten}`
        })

      const [a, b] = await Promise.all([lade(alt), lade(neu)])
      if (a.width !== b.width || a.height !== b.height) {
        return {
          masse: `${a.width}×${a.height} gegen ${b.width}×${b.height}`,
          anteil: 1,
          abweichung: null,
        }
      }

      const zeichne = (bild) => {
        const c = document.createElement('canvas')
        c.width = bild.width
        c.height = bild.height
        const ctx = c.getContext('2d', { willReadFrequently: true })
        ctx.drawImage(bild, 0, 0)
        return ctx.getImageData(0, 0, bild.width, bild.height)
      }

      const da = zeichne(a)
      const db = zeichne(b)

      const ziel = document.createElement('canvas')
      ziel.width = a.width
      ziel.height = a.height
      const zctx = ziel.getContext('2d')
      const raus = zctx.createImageData(a.width, a.height)

      let verschieden = 0
      for (let i = 0; i < da.data.length; i += 4) {
        const dr = Math.abs(da.data[i] - db.data[i])
        const dg = Math.abs(da.data[i + 1] - db.data[i + 1])
        const dbl = Math.abs(da.data[i + 2] - db.data[i + 2])
        const anders = dr > toleranz || dg > toleranz || dbl > toleranz
        if (anders) verschieden += 1
        /*
          Das Abweichungsbild: das neue Bild ausgegraut, die Unterschiede in
          Magenta. Ein reines Schwarz-Weiß-Bild zeigt, *dass* etwas anders ist,
          und ein Bild mit Umgebung zeigt, *wo*.
        */
        if (anders) {
          raus.data[i] = 255
          raus.data[i + 1] = 0
          raus.data[i + 2] = 170
          raus.data[i + 3] = 255
        } else {
          const grau = (db.data[i] + db.data[i + 1] + db.data[i + 2]) / 3
          const blass = 200 + (grau - 200) * 0.25
          raus.data[i] = blass
          raus.data[i + 1] = blass
          raus.data[i + 2] = blass
          raus.data[i + 3] = 255
        }
      }
      zctx.putImageData(raus, 0, 0)

      return {
        masse: null,
        anteil: verschieden / (a.width * a.height),
        abweichung: ziel.toDataURL('image/png').split(',')[1],
      }
    },
    [altBase64, neuBase64, KANAL_TOLERANZ]
  )
}

const chromium = await ladeChromium()
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })

mkdirSync(ORDNER, { recursive: true })
if (schreiben && existsSync(ABWEICHUNGEN)) rmSync(ABWEICHUNGEN, { recursive: true })

/* Eine leere Seite, auf der die Bildvergleiche laufen. */
const werkbank = await browser.newPage()
await werkbank.setContent('<!doctype html><title>Vergleich</title>')

let geprueft = 0
let beanstandungen = 0
let geschrieben = 0

for (const ansicht of ANSICHTEN) {
  const kontext = await browser.newContext({
    viewport: { width: ansicht.breite, height: HOEHE },
    colorScheme: ansicht.thema,
    /*
      Kein `reducedMotion: 'reduce'`: Das änderte die Darstellung gegenüber
      dem, was ein normaler Besucher sieht, und genau die soll eingefroren
      werden. Stattdessen wird gewartet, bis die Einblendungen durch sind.
    */
  })
  const seite = await kontext.newPage()

  for (const [name, pfad] of SEITEN) {
    geprueft += 1
    const datei = join(ORDNER, `${name}-${ansicht.name}.png`)

    let aufnahme
    try {
      const antwort = await seite.goto(basis + pfad, { waitUntil: 'networkidle' })
      if (!antwort || !antwort.ok()) {
        console.error(
          `FEHL ${name} ${ansicht.name} – ${antwort ? antwort.status() : 'keine Antwort'}`
        )
        beanstandungen += 1
        continue
      }
      /* Die Einblendungen dauern bis 0,45 s, gestaffelt bis etwa 0,5 s. */
      await seite.waitForTimeout(1800)

      aufnahme = await seite.screenshot({
        mask: MASKEN.map((wahl) => seite.locator(wahl)),
        maskColor: '#7f7f7f',
        animations: 'disabled',
        caret: 'hide',
      })
    } catch (fehler) {
      console.error(`FEHL ${name} ${ansicht.name} – ${fehler.message}`)
      beanstandungen += 1
      continue
    }

    if (schreiben) {
      writeFileSync(datei, aufnahme)
      geschrieben += 1
      console.log(
        `neu  ${name}-${ansicht.name}.png  ${Math.round(aufnahme.length / 1024)} KB`
      )
      continue
    }

    if (!existsSync(datei)) {
      console.error(
        `FEHL ${name}-${ansicht.name}.png fehlt – einmalig aufnehmen mit: npm run bilder -- --neu`
      )
      beanstandungen += 1
      continue
    }

    const ergebnis = await vergleiche(
      werkbank,
      readFileSync(datei).toString('base64'),
      aufnahme.toString('base64')
    )

    if (ergebnis.masse) {
      console.error(`FEHL ${name}-${ansicht.name}: andere Maße – ${ergebnis.masse}`)
      beanstandungen += 1
      continue
    }

    const prozent = (ergebnis.anteil * 100).toFixed(3)
    if (ergebnis.anteil <= ANTEIL_GRENZE) {
      console.log(`OK   ${name}-${ansicht.name}  ${prozent} % anders`)
      continue
    }

    beanstandungen += 1
    mkdirSync(ABWEICHUNGEN, { recursive: true })
    const jetzt = join(ABWEICHUNGEN, `${name}-${ansicht.name}-jetzt.png`)
    const diff = join(ABWEICHUNGEN, `${name}-${ansicht.name}-abweichung.png`)
    writeFileSync(jetzt, aufnahme)
    writeFileSync(diff, Buffer.from(ergebnis.abweichung, 'base64'))
    console.error(
      `FEHL ${name}-${ansicht.name}  ${prozent} % anders (Grenze ${(ANTEIL_GRENZE * 100).toFixed(3)} %)\n` +
        `     ${jetzt}\n     ${diff}`
    )
  }

  await kontext.close()
}

await browser.close()

if (schreiben) {
  const dateien = readdirSync(ORDNER).filter((d) => d.endsWith('.png'))
  const bytes = dateien.reduce((s, d) => s + readFileSync(join(ORDNER, d)).length, 0)
  console.log(
    `\n${geschrieben} Bilder aufgenommen, ${dateien.length} im Bestand, zusammen ${Math.round(bytes / 1024)} KB.`
  )
  process.exit(beanstandungen > 0 ? 1 : 0)
}

console.log(`\n${geprueft - beanstandungen} von ${geprueft} Bildern unverändert.`)
if (beanstandungen > 0) {
  console.error(
    'Das Layout hat sich geändert. Wenn das gewollt war, die Bilder neu aufnehmen:\n' +
      '  npm run bilder -- --neu\n' +
      'Der Commit zeigt dann im Bildvergleich, was anders geworden ist. Wenn es\n' +
      'nicht gewollt war, steht die Ursache im Abweichungsbild – magenta.'
  )
  process.exit(1)
}
