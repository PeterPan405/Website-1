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
 * **Zwei** Breiten, weil es zwei verschiedene Fehler sind:
 *
 * 1. `body.scrollWidth` – die Seite lässt sich seitlich schieben.
 * 2. `documentElement.scrollWidth` – Safari auf dem iPhone zoomt heraus.
 *
 * Der zweite Fall stand hier bis August 2026 als ausdrückliche Ausnahme: Der
 * Wurzelknoten meldete auf `/maerkte/vergleich` 624 Pixel, `window.scrollTo`
 * bewegte die Seite aber um keinen Pixel, und daraus wurde geschlossen, der
 * Wert sei ein Chromium-Artefakt. Der Schluss war falsch. Auf dem iPhone kam
 * ein Foto: die ganze Seite auf 62 Prozent herausgezoomt, rechts ein Drittel
 * leer. 375/608 = 0,617 – genau das Verhältnis aus der gemeldeten Breite.
 *
 * Safari nimmt für den Anfangsmaßstab den Wurzelknoten, nicht den Body. Was
 * sich am Rechner nicht schieben lässt, kann auf dem Telefon trotzdem die
 * ganze Seite verkleinern, und dann ist jede Schrift zu klein, nicht nur die
 * in der Tabelle.
 *
 * Die Ursache dort war kein zu breiter Kasten, sondern ein aus dem Fluss
 * genommenes Kind: `sr-only` ist `position: absolute`. Ohne positionierten
 * Vorfahren bezieht es sich auf den Wurzelblock – es liegt dann gar nicht im
 * Scrollkasten, und der schneidet es folglich auch nicht ab. Abhilfe ist ein
 * `relative` am Kasten. Deshalb nennt die Meldung unten zu jedem Schuldigen
 * seine `position` und ob sein Scrollkasten positioniert ist.
 *
 * Aufruf: `node scripts/breite-pruefen.mjs [URL-Basis]`
 * Voreinstellung ist ein lokaler Server auf Port 4173 über `out/`.
 */

/**
 * Die geprüften Fensterbreiten.
 *
 * Bis Juli 2026 stand hier nur 375. Der Fehler, der dann kam, lag bei 1.080:
 * Auf dem iPad im Querformat zeigte die Kopfzeile ab 1.024 Pixeln die volle
 * Schreibtisch-Navigation, und die brauchte 1.268. Die Seite ließ sich seitlich
 * schieben – auf jedem Gerät zwischen 1.024 und rund 1.390 Pixeln, also auch
 * auf verbreiteten Notebooks mit 1.280 und 1.366.
 *
 * Eine Prüfung, die nur das schmalste Fenster kennt, findet so etwas nie. Also
 * beide Enden und die Mitte:
 *
 * - 375   iPhone SE, das schmalste Fenster, das ernsthaft vorkommt
 * - 768   iPad im Hochformat
 * - 1024  der Umschaltpunkt `lg` selbst – Fehler sitzen gern genau darauf
 * - 1080  iPad 10,2" im Querformat (der gemeldete Fall)
 * - 1280  Umschaltpunkt `xl` und die häufigste Notebook-Breite
 * - 1440  breiter Schreibtisch
 */
const BREITEN = [375, 768, 1024, 1080, 1280, 1440]
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
  /*
    Die breiteste Tabelle der Website: fünf Spalten, `min-w-[44rem]`, über
    tausend Zeilen. Sie liegt in einem `overflow-x-auto` und darf die Seite
    deshalb nicht schiebbar machen – aber genau diese Konstruktion ist es, die
    hier schon zweimal danebenging. Eine Tabelle, die breiter ist als der
    Bildschirm, gehört in die Prüfliste, nicht in die Hoffnung.
  */
  ['/maerkte/52-wochen/', '52 Wochen – breite Tabelle in einem Scrollbereich'],
  ['/news/', 'Nachrichten – Anrisse und Archiv'],
  ['/lernen/stand/', 'Lernstand – Tabelle mit 34 Zeilen'],
  ['/rechner/zinsrechner/', 'Rechner – Eingabefelder und Ergebnis'],
  ['/globus/', 'Globus – SVG in voller Breite'],
  ['/staatsverschuldung/', 'Staatsverschuldung – Ländertabelle'],
  ['/anleihen/', 'Anleihen – Rechner mit Laufzeitentabelle'],
  /*
    Der Kalender kam im August 2026 dazu – nach einem Foto vom Telefon, auf dem
    er falsch aussah. Er ist die einzige Seite, die ihre Gestalt erst im Browser
    bekommt: Was kommend, laufend und vorbei ist, entscheidet das Datum, nicht
    der Build. Genau solche Seiten gehören in eine Prüfung mit echtem Browser.

    In die Referenzbilder gehört er dagegen **nicht**: Sein Inhalt ändert sich
    an jedem Tag von selbst, und ein Vergleichsbild, das täglich rot wird, wird
    nach einer Woche ignoriert.
  */
  ['/kalender/', 'Kalender – Zeiträume, Filter und Vergangenheitsmarkierung'],
  /* Die breiteste Tabelle der Website: sieben Spalten mal zwölf Zeilen. */
  ['/news/jahr/2026/', 'Jahresrückblick – siebenspaltige Tabelle'],
  ['/umzug/', 'Datenumzug – zweispaltige Karten mit Dateiwahl'],
]

const basis = (process.argv[2] ?? 'http://127.0.0.1:4173').replace(/\/$/, '')

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
})

let beanstandungen = 0
let geprueft = 0
let schiebbare = 0
let herausgezoomte = 0

for (const BREITE of BREITEN) {
  const seite = await browser.newPage({ viewport: { width: BREITE, height: HOEHE } })
  console.log(`\n─── ${BREITE} Pixel ───`)

  for (const [pfad, was] of SEITEN) {
    geprueft += 1
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
        /*
          Die Schuldigen für den zweiten Fall werden getrennt gesucht.

          Oben werden Elemente in einem Scrollkasten übersprungen – zu Recht,
          denn für das seitliche Schieben zählen sie nicht. Für den
          Anfangsmaßstab von Safari zählen sie sehr wohl, sobald sie aus dem
          Fluss genommen sind und den Kasten deshalb gar nicht als Bezugsrahmen
          haben. Also hier: die am weitesten rechts liegenden Kästen, ohne
          Rücksicht auf Beschnitt, dafür mit `position` und mit der Angabe, ob
          ihr Scrollkasten positioniert ist.
        */
        const weit = []
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect()
          if (r.right <= fenster + toleranz) continue
          let kasten = null
          for (let v = el.parentElement; v && v !== document.body; v = v.parentElement) {
            const stil = getComputedStyle(v)
            if (['auto', 'scroll', 'hidden', 'clip'].includes(stil.overflowX)) {
              kasten = stil.position
              break
            }
          }
          weit.push({
            tag: el.tagName.toLowerCase(),
            klasse: (el.className?.toString?.() ?? '').slice(0, 60),
            text: (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 40),
            rechts: Math.round(r.right),
            position: getComputedStyle(el).position,
            kasten: kasten ?? '(keiner)',
          })
        }
        /*
          Gleich weit rechts stehen viele – die Tabelle, ihr Kopf, jede Zelle
          darin. Genannt gehört der, der dort *nicht hingehört*: das aus dem
          Fluss genommene Kind. Also erst nach rechter Kante, und bei gleicher
          Kante das nicht-statische zuerst. Sonst führt die Meldung zur
          Tabelle, und die ist unschuldig.
        */
        weit.sort(
          (a, b) =>
            b.rechts - a.rechts ||
            (a.position === 'static' ? 1 : 0) - (b.position === 'static' ? 1 : 0)
        )

        return {
          fenster,
          /*
          Beide Werte, und sie messen Verschiedenes: `body.scrollWidth` sagt,
          ob sich die Seite schieben lässt; `documentElement.scrollWidth` sagt,
          mit welchem Maßstab Safari sie überhaupt erst anzeigt.
        */
          scrollBreite: document.body.scrollWidth,
          wurzelBreite: document.documentElement.scrollWidth,
          weit: weit.slice(0, 5),
          /*
          Ohne `el`: Ein DOM-Knoten überlebt den Weg aus dem Browser heraus
          nicht. Gebraucht wurde er nur für `contains()` weiter oben.
        */
          schuldige: schuldige.slice(0, 5).map((s) => ({
            tag: s.tag,
            klasse: s.klasse,
            text: s.text,
            links: s.links,
            rechts: s.rechts,
          })),
        }
      }, TOLERANZ)
    } catch (fehler) {
      console.error(`FEHL ${pfad} – ${fehler.message}`)
      beanstandungen += 1
      continue
    }

    const ueberstand = befund.scrollBreite - befund.fenster
    const wurzelUeberstand = befund.wurzelBreite - befund.fenster

    if (ueberstand <= TOLERANZ && wurzelUeberstand <= TOLERANZ) {
      console.log(`OK   ${pfad}`)
      continue
    }

    beanstandungen += 1

    if (ueberstand > TOLERANZ) {
      schiebbare += 1
      console.error(
        `\nFEHL ${pfad} – ${befund.scrollBreite} statt ${befund.fenster} Pixel breit ` +
          `(${ueberstand} zu viel), die Seite lässt sich schieben\n     ${was}`
      )
      for (const s of befund.schuldige) {
        console.error(`     ${s.tag} [${s.links}…${s.rechts}]  ${s.klasse}`)
        console.error(`         „${s.text}"`)
      }
      console.error(
        '     Häufigste Ursache: ein Rasterfeld ohne `min-w-0` mit `truncate` darin,\n' +
          '     oder eine Kopfzeile, die für das Fenster zu viele Menüpunkte zeigt.'
      )
    }

    if (wurzelUeberstand > TOLERANZ) {
      herausgezoomte += 1
      /*
        Getrennte Meldung, weil es eine andere Ursache und eine andere Abhilfe
        ist. „Lässt sich schieben" führt zu `min-w-0`; „zoomt heraus" führt
        fast immer zu einem Scrollkasten ohne `relative`.
      */
      const maszstab = (befund.fenster / befund.wurzelBreite).toLocaleString('de-DE', {
        style: 'percent',
        maximumFractionDigits: 0,
      })
      console.error(
        `\nFEHL ${pfad} – Wurzelknoten ${befund.wurzelBreite} statt ${befund.fenster} ` +
          `Pixel breit\n     Safari zeigt die Seite dann auf ${maszstab} verkleinert.` +
          `\n     ${was}`
      )
      for (const s of befund.weit) {
        console.error(
          `     ${s.tag} bis x=${s.rechts}  position: ${s.position}  ` +
            `Scrollkasten: ${s.kasten}`
        )
        console.error(`         ${s.klasse}`)
        console.error(`         „${s.text}"`)
      }
      console.error(
        '     Häufigste Ursache: ein `overflow-x-auto`-Kasten ohne `relative`.\n' +
          '     Was darin `position: absolute` trägt – jedes `sr-only` –, hängt sonst\n' +
          '     am Wurzelblock statt im Kasten und wird nicht abgeschnitten.'
      )
    }
  }

  await seite.close()
}

await browser.close()

console.log(
  `\n${geprueft - beanstandungen} von ${geprueft} Prüfungen bestanden ` +
    `(${SEITEN.length} Seiten × ${BREITEN.length} Breiten).`
)
if (beanstandungen > 0) {
  if (schiebbare > 0) {
    console.error(`${schiebbare} × lässt sich die Seite seitlich schieben.`)
  }
  if (herausgezoomte > 0) {
    console.error(`${herausgezoomte} × zoomt Safari die Seite auf dem Telefon heraus.`)
  }
  console.error('Das gehört behoben.')
  process.exit(1)
}
