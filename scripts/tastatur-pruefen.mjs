import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

/**
 * Ob sich die Seite mit der Tastatur bedienen lässt.
 *
 * ## Warum das nicht selbstverständlich ist
 *
 * Weil man es beim Entwickeln nie merkt. Wer eine Maus benutzt, klickt
 * einfach, und ein Bedienelement ohne sichtbaren Fokus sieht am Schreibtisch
 * genauso aus wie eines mit. Betroffen ist, wer keine Maus benutzen kann oder
 * will – und niemand davon schickt ein Foto.
 *
 * Die Kopfzeile ist der heikelste Ort: sieben Menüpunkte mit Untermenüs, ein
 * Suchknopf, ein Sprachumschalter, ein Themenschalter. Wenn dort etwas nicht
 * erreichbar ist, ist die halbe Website nicht erreichbar.
 *
 * ## Was geprüft wird
 *
 * 1. **Ein Sprungziel zum Inhalt.** Ohne es muss sich jeder Tastaturnutzer auf
 *    jeder Seite durch die vollständige Navigation tabben, bevor der Text
 *    beginnt.
 * 2. **Sichtbarer Fokus.** Jedes erreichbare Element muss sich beim Fokussieren
 *    erkennbar verändern – Umriss, Rahmen, Schatten oder Hintergrund. Ein
 *    `outline: none` ohne Ersatz ist der häufigste Fehler dieser Art.
 * 3. **Kein Fokus im Verborgenen.** Was zugeklappt ist, darf den Fokus nicht
 *    aufnehmen. Sonst wandert der Fokus scheinbar ins Nichts, und niemand kann
 *    sagen, wo er gerade ist.
 * 4. **Kein Fokus außerhalb des Fensters.** Ein Element, das beim Tabben
 *    angesprungen wird, aber neben dem Bildschirm liegt, ist dasselbe Problem
 *    in anderer Form.
 *
 * ## Was diese Prüfung nicht kann
 *
 * Sie sagt nichts darüber, ob die **Reihenfolge** sinnvoll ist. Ob es richtig
 * ist, dass der Sprachumschalter vor dem Themenschalter kommt, ist eine Frage
 * des Urteils und keine der Messung. Geprüft wird, was messbar ist: dass alles
 * erreichbar und alles sichtbar ist.
 *
 * Aufruf: `npm run tastatur`
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
      console.error('Playwright fehlt. Abhilfe: npm install -g playwright')
      process.exit(2)
    }
  }
}

const chromium = await ladeChromium()

const SEITEN = [
  ['/', 'Startseite'],
  ['/maerkte/', 'Marktübersicht'],
  ['/rechner/zinsrechner/', 'Rechner mit Eingabefeldern'],
  ['/rechner/depotanalyse/', 'Rechner mit Kombinationsfeld'],
  ['/news/', 'Nachrichten mit Archiv'],
  ['/lernen/', 'Lernbereich'],
]

/** Wie viele Tabschritte je Seite verfolgt werden. */
const SCHRITTE = 45

const basis = (process.argv[2] ?? 'http://127.0.0.1:4173').replace(/\/$/, '')
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })

let beanstandungen = 0

for (const [pfad, was] of SEITEN) {
  const seite = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  const funde = []

  try {
    const antwort = await seite.goto(basis + pfad, { waitUntil: 'networkidle' })
    if (!antwort || !antwort.ok()) {
      console.error(`FEHL ${pfad} – ${antwort ? antwort.status() : 'keine Antwort'}`)
      beanstandungen += 1
      await seite.close()
      continue
    }

    /* 1. Ein Sprungziel muss als Erstes kommen. */
    await seite.keyboard.press('Tab')
    const erstes = await seite.evaluate(() => {
      const el = document.activeElement
      return {
        text: (el?.textContent ?? '').trim().slice(0, 40),
        href: el?.getAttribute?.('href') ?? '',
      }
    })
    if (!erstes.href.startsWith('#')) {
      funde.push(
        `Das erste Ziel beim Tabben ist kein Sprunglink, sondern „${erstes.text}“. ` +
          'Ohne ihn muss sich jeder Tastaturnutzer durch die ganze Navigation tabben.'
      )
    }

    /* 2. bis 4. Der Rest der Tabkette. */
    for (let i = 0; i < SCHRITTE; i += 1) {
      const fund = await seite.evaluate(async () => {
        const el = document.activeElement
        if (!el || el === document.body) return null

        const beschreibe = () => {
          const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 34)
          const marke =
            el.getAttribute('aria-label') ||
            text ||
            el.getAttribute('placeholder') ||
            el.getAttribute('name') ||
            ''
          return `${el.tagName.toLowerCase()}${marke ? ` „${marke}“` : ''}`
        }

        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) {
          return { art: 'unsichtbar', was: beschreibe() }
        }
        if (r.right < 0 || r.left > document.documentElement.clientWidth) {
          return { art: 'außerhalb', was: beschreibe() }
        }
        /*
          Zugeklapptes darf den Fokus nicht bekommen. `details` ohne `open`
          versteckt seinen Inhalt, aber Browser halten die Elemente darin
          weiterhin fokussierbar, wenn sie per CSS verborgen werden statt
          über das Element selbst.
        */
        const zu = el.closest('details:not([open])')
        if (zu && !el.closest('summary')) {
          return { art: 'zugeklappt', was: beschreibe() }
        }

        /*
          Sichtbarer Fokus: Der gesetzte Stil muss sich vom ungesetzten
          unterscheiden. Verglichen werden die Eigenschaften, mit denen ein
          Fokus üblicherweise gezeigt wird.
        */
        /*
          Gemessen wird **ohne** Eingriff in den Fokus.

          Der erste Versuch verglich den Stil mit und ohne Fokus, indem er
          `blur()` und `focus()` aufrief – und meldete daraufhin jedes
          Eingabefeld der Website als „ohne sichtbaren Fokus“. Der Grund ist
          eine Feinheit von `:focus-visible`: Die Pseudoklasse greift nur bei
          echter Tastatur- oder Hilfsmittelbedienung, nicht bei einem
          programmatischen `focus()`. Wer sie zum Messen anfasst, misst sie weg.

          Es gibt in `globals.css` längst eine globale Regel mit zwei Pixel
          Umriss. Geprüft wird deshalb nur noch, ob sie hier tatsächlich
          greift.
        */
        const stil = getComputedStyle(el)
        const hatUmriss =
          stil.outlineStyle !== 'none' && parseFloat(stil.outlineWidth) > 0
        const hatRing = stil.boxShadow !== 'none'
        if (hatUmriss || hatRing) return null
        /*
          Noch einmal hinsehen, nachdem der Übergang durch ist.

          Die Punkte des Nachrichtenkarussells tragen `transition-all`, und
          das schließt die Umrissbreite ein: Unmittelbar nach dem Tabben steht
          sie noch bei null und wächst über 300 Millisekunden auf zwei Pixel.
          Wer sofort misst, misst den Anfang der Animation und meldet einen
          Fokusring als fehlend, den es gibt.
        */
        await new Promise((weiter) => setTimeout(weiter, 350))
        const spaeter = getComputedStyle(el)
        if (
          (spaeter.outlineStyle !== 'none' && parseFloat(spaeter.outlineWidth) > 0) ||
          spaeter.boxShadow !== 'none'
        ) {
          return null
        }
        return {
          art: 'ohne sichtbaren Fokus',
          was: beschreibe(),
          sichtbar: el.matches(':focus-visible'),
        }
      })

      if (fund) {
        funde.push(
          fund.art === 'ohne sichtbaren Fokus'
            ? `${fund.art}: ${fund.was}` +
                (fund.sichtbar
                  ? ' – die Regel greift hier nicht.'
                  : ' – das Element bekommt gar keinen Tastaturfokus angezeigt.')
            : `${fund.art}: ${fund.was}`
        )
      }

      await seite.keyboard.press('Tab')
    }
  } catch (fehler) {
    console.error(`FEHL ${pfad} – ${fehler.message}`)
    beanstandungen += 1
    await seite.close()
    continue
  }

  /* Gleiche Ursache nur einmal melden. */
  const eindeutig = [...new Set(funde)]
  if (eindeutig.length === 0) {
    console.log(`OK   ${pfad}`)
  } else {
    beanstandungen += 1
    console.error(`\nFEHL ${pfad} – ${eindeutig.length} Stelle(n)\n     ${was}`)
    for (const f of eindeutig.slice(0, 6)) console.error(`     ${f}`)
  }

  await seite.close()
}

await browser.close()

console.log(`\n${SEITEN.length - beanstandungen} von ${SEITEN.length} Seiten bestanden.`)
if (beanstandungen > 0) {
  console.error(
    'Wer keine Maus benutzt, kommt hier nicht durch – und meldet sich nicht,\n' +
      'sondern geht. Das gehört behoben.'
  )
  process.exit(1)
}
