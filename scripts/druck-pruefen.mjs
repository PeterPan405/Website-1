import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

/**
 * Prüft, was aus einer Seite wird, wenn jemand sie ausdruckt oder als PDF
 * speichert.
 *
 * ## Warum das eine eigene Prüfung ist
 *
 * Weil `@media print` die einzige Darstellung der Website ist, die niemand
 * beim Arbeiten sieht. Ein Fehler dort fällt frühestens auf, wenn ein Blatt
 * aus dem Drucker kommt – und dann bei jemandem, der nicht am Quelltext sitzt.
 *
 * Beim Bau dieser Ansicht sind genau zwei Dinge schiefgegangen, und beide
 * sahen im Quelltext richtig aus:
 *
 * 1. **Die Akzentfarben blieben dunkel.** Die Druckregel setzte `--c-fg` und
 *    `--c-surface` auf helle Werte zurück, vergaß aber `--c-learn-soft`,
 *    `--c-brand-soft` und die übrigen. Ein Hinweiskasten druckte dunkelblaue
 *    Fläche mit dunkelblauer Schrift. Behoben ist das nicht durch eine
 *    längere Liste, sondern dadurch, dass der ganze dunkle Satz in
 *    `@media not print` steht – deshalb prüft der Test hier die Farben, nicht
 *    die Regel.
 * 2. **`data-drucken` an einer Komponente, die es nicht weiterreicht.**
 *    `LektionAbschluss` nimmt vier benannte Eigenschaften entgegen und wirft
 *    alles übrige weg. Das Attribut verschwand still, und der Abschlussknopf
 *    stand auf dem Ausdruck.
 *
 * Beides fällt hier auf, weil gegen den **gerenderten** Zustand geprüft wird:
 * Ist das Element auf Papier sichtbar, ja oder nein.
 *
 * ## Beide Darstellungen
 *
 * Geprüft wird hell **und** dunkel, denn der Fehler oben trat nur im dunklen
 * auf. Wer hell entwickelt, druckt hell und sieht ihn nie.
 *
 * Aufruf: `npm run druck [URL-Basis]`
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
          'Browser – die Druckansicht entsteht erst beim Setzen. Abhilfe:\n' +
          'npm install -g playwright'
      )
      process.exit(2)
    }
  }
}

const chromium = await ladeChromium()

/** Je eine Seite der beiden Bauarten, die einen Druckknopf tragen. */
const SEITEN = [
  ['/lernen/aktie/beginner/', 'Lernstufe'],
  ['/akademie/fundamentalanalyse/kurs-gewinn-verhaeltnis/', 'Akademie-Lektion'],
]

/** Was auf Papier verschwunden sein muss. */
const WEG = [
  ['Kopfzeile', 'header'],
  ['Fußzeile', 'footer'],
  ['Druckknopf', 'button:has-text("Drucken")'],
  ['Vorlesen', 'button:has-text("Vorlesen")'],
  ['Blätternavigation', 'nav[data-drucken="aus"]'],
  ['Seitenleiste', 'aside[data-drucken="aus"]'],
]

/** Und was dastehen muss. */
const DA = [
  ['Überschrift', 'h1'],
  ['Fließtext', 'article p'],
  ['Herkunftszeile', '[data-drucken="nur"]'],
]

const basis = (process.argv[2] ?? 'http://127.0.0.1:4173').replace(/\/$/, '')

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })

let geprueft = 0
let beanstandungen = 0

const melde = (ok, text) => {
  geprueft += 1
  if (ok) return
  beanstandungen += 1
  console.error(`     ${text}`)
}

for (const schema of ['light', 'dark']) {
  for (const [pfad, name] of SEITEN) {
    const vorher = beanstandungen
    const seite = await browser.newPage({
      viewport: { width: 1200, height: 1000 },
      colorScheme: schema,
    })

    try {
      await seite.goto(`${basis}${pfad}`, { waitUntil: 'networkidle' })

      /* Am Bildschirm: Knopf da, Herkunftszeile weg. */
      melde(
        await seite.locator('button:has-text("Drucken")').first().isVisible(),
        'Der Druckknopf fehlt am Bildschirm.'
      )
      melde(
        !(await seite.locator('[data-drucken="nur"]').first().isVisible()),
        'Die Herkunftszeile steht am Bildschirm – sie gehört nur auf Papier.'
      )

      await seite.emulateMedia({ media: 'print' })
      /*
        `beforeprint` feuert bei `page.pdf()` nicht. Das Druckdatum entsteht
        aber genau daran, also wird es hier von Hand ausgelöst – sonst prüfte
        der Test einen Zustand, den kein Drucker je sieht.
      */
      await seite.evaluate(() => window.dispatchEvent(new Event('beforeprint')))
      await seite.waitForTimeout(150)

      for (const [was, wahl] of WEG) {
        const sichtbar = await seite
          .locator(wahl)
          .first()
          .isVisible()
          .catch(() => false)
        melde(!sichtbar, `${was} steht auf dem Ausdruck.`)
      }

      for (const [was, wahl] of DA) {
        const sichtbar = await seite
          .locator(wahl)
          .first()
          .isVisible()
          .catch(() => false)
        melde(sichtbar, `${was} fehlt auf dem Ausdruck.`)
      }

      const zeile = await seite.locator('[data-drucken="nur"]').first().innerText()
      melde(zeile.includes('IM Invests'), 'Die Herkunftszeile nennt keinen Absender.')
      melde(/https?:\/\/\S+/.test(zeile), 'Die Herkunftszeile nennt keine Adresse.')
      melde(/\d{2}\.\d{2}\.\d{4}/.test(zeile), 'Die Herkunftszeile trägt kein Datum.')

      melde(
        (await seite.evaluate(() => getComputedStyle(document.body).backgroundColor)) ===
          'rgb(255, 255, 255)',
        'Der Blattgrund ist nicht weiß.'
      )

      /*
        Die eigentliche Falle: eine Fläche, die dunkel geblieben ist. Gemessen
        wird die wahrgenommene Helligkeit jeder sichtbaren Fläche im
        Blattbereich; alles unter der Hälfte ist auf Papier eine Tonerfläche
        und trägt fast immer Schrift, die für Dunkles gedacht war.
      */
      const dunkleFlaechen = await seite.evaluate(() => {
        const helligkeit = (farbe) => {
          const t = farbe.match(/[\d.]+/g)
          if (!t || t.length < 3) return 1
          if (t.length > 3 && Number(t[3]) === 0) return 1
          const [r, g, b] = t.slice(0, 3).map(Number)
          return (0.299 * r + 0.587 * g + 0.114 * b) / 255
        }
        const funde = []
        for (const el of document.querySelectorAll('body *')) {
          const s = getComputedStyle(el)
          if (s.display === 'none' || s.visibility === 'hidden') continue
          const r = el.getBoundingClientRect()
          if (r.width < 24 || r.height < 24) continue
          if (helligkeit(s.backgroundColor) >= 0.5) continue
          funde.push(
            `${el.tagName}.${(el.className.baseVal ?? el.className ?? '').toString().slice(0, 40)} – ${s.backgroundColor}`
          )
        }
        return funde
      })
      for (const fund of dunkleFlaechen) {
        melde(false, `Dunkle Fläche auf dem Ausdruck: ${fund}`)
      }
    } catch (fehler) {
      beanstandungen += 1
      geprueft += 1
      console.error(`FEHL ${name} (${schema}) – ${fehler.message}`)
      await seite.close()
      continue
    }

    console.log(
      `${beanstandungen === vorher ? 'OK  ' : 'FEHL'} ${name} (${schema === 'dark' ? 'dunkel' : 'hell'})`
    )
    await seite.close()
  }
}

await browser.close()

console.log(
  `\n${geprueft - beanstandungen} von ${geprueft} Prüfungen bestanden ` +
    `(${SEITEN.length} Seiten × 2 Darstellungen).`
)
if (beanstandungen > 0) {
  console.error(
    'Die Druckansicht ist die einzige Darstellung, die beim Arbeiten niemand sieht.\n' +
      'Was hier auffällt, fiele sonst erst am Drucker auf – bei jemandem, der es\n' +
      'nicht beheben kann.'
  )
  process.exit(1)
}
