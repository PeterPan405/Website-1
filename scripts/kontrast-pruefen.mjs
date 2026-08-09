import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

/**
 * Prüft, ob Text auf seinem Hintergrund tatsächlich lesbar ist – in beiden
 * Darstellungen (Weiß und Schwarz).
 *
 * ## Warum das nicht schon geprüft war
 *
 * `tests/farbvariablen.test.ts` prüft, dass jede benutzte Farbvariable
 * **existiert**. Das ist eine andere Frage. Eine Variable kann tadellos
 * definiert sein und trotzdem grauen Text auf grauem Grund ergeben – und
 * zuverlässig fällt das nur in der Darstellung auf, die man selbst nicht
 * benutzt. Wer hell entwickelt, sieht den dunklen Fehler nie.
 *
 * Gerechnet wird das Kontrastverhältnis nach WCAG 2.1 aus den tatsächlich
 * gesetzten Farben im Browser, nicht aus dem Quelltext. Nur so sind Vererbung,
 * Deckkraft und Überschreibungen mit drin.
 *
 * ## Die Schwellen
 *
 * 4,5 für normalen Text, 3,0 für großen (ab 24 Pixel, oder ab 18,66 Pixel bei
 * Fettschrift) – das ist WCAG AA. Nicht AAA: Dessen 7,0 sind mit einer
 * abgestuften Grautreppe für Nebentexte kaum erreichbar, und eine Prüfung,
 * deren Schwelle man ständig unterschreiten muss, wird abgeschaltet.
 *
 * ## Was bewusst übergangen wird
 *
 * - **Text über Bild oder Verlauf.** Dort gibt es keinen einen Hintergrundwert,
 *   gegen den sich rechnen ließe. Der Hero der Startseite ist so ein Fall.
 *   Gemeldet würde eine Zahl, die nichts bedeutet.
 * - **Deaktivierte Bedienelemente.** Für die nimmt WCAG die Anforderung
 *   ausdrücklich zurück; blass ist dort die Botschaft.
 * - **Unsichtbares.** Zugeklappte Menüs, `sr-only`, alles ohne Fläche.
 *
 * Aufruf: `npm run kontrast [URL-Basis]`
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
          'Browser – Kontrast entsteht erst beim Setzen. Abhilfe: npm install -g playwright'
      )
      process.exit(2)
    }
  }
}

const chromium = await ladeChromium()

/** Die geprüften Seiten – je eine je Bauart. */
const SEITEN = [
  ['/', 'Startseite'],
  ['/maerkte/', 'Marktübersicht'],
  ['/maerkte/apple/', 'Einzelne Aktie'],
  ['/news/', 'Nachrichten'],
  ['/lernen/', 'Lernbereich'],
  ['/lernen/stand/', 'Lernstand'],
  ['/akademie/', 'Akademie'],
  ['/rechner/zinsrechner/', 'Rechner'],
  ['/staatsverschuldung/', 'Staatsverschuldung'],
  ['/glossar/', 'Glossar'],
  ['/anleihen/', 'Anleihen'],
  ['/news/jahr/2026/', 'Jahresrückblick'],
]

const basis = (process.argv[2] ?? 'http://127.0.0.1:4173').replace(/\/$/, '')

/**
 * Was im Browser läuft.
 *
 * Als Zeichenkette, weil `page.evaluate` die Funktion serialisiert – Hilfsmittel
 * von außen sind darin nicht sichtbar, sie müssen mit hinein.
 */
const IM_BROWSER = () => {
  /*
    Farben werden gemalt statt gelesen.

    Der naheliegende Weg – die Zahlen aus `getComputedStyle().color` mit einem
    regulären Ausdruck herausziehen – war der erste Versuch und lieferte
    zuverlässig falsche Werte. Chromium gibt für Farben aus Tailwind 4 nämlich
    nicht `rgb()` zurück, sondern

        oklab(0.978688 -0.00050202 -0.00570226 / 0.8)

    Ein Muster wie `[\d.]+` findet darin vier Zahlen, verschluckt dabei beide
    Minuszeichen und macht aus einem fast weißen Kopfzeilenton ein fast
    schwarzes Grau. Die Prüfung meldete daraufhin vierzig Stellen mit
    Kontrast 1,4 – allesamt erfunden.

    Eine Leinwand kennt jede CSS-Farbsyntax, weil derselbe Code sie auch
    darstellt: hineinmalen, Pixel auslesen, fertig. Das kann nicht auseinander-
    laufen, und es überlebt jede künftige Farbnotation.
  */
  const stift = document.createElement('canvas').getContext('2d', {
    willReadFrequently: true,
  })

  function zuRgba(farbe) {
    stift.clearRect(0, 0, 1, 1)
    /*
      Zuerst eine bekannt gültige Farbe setzen: Weist man `fillStyle` etwas
      Ungültiges zu, behält es stillschweigend den alten Wert. Ohne diesen
      Schritt erbte eine unlesbare Farbe die vorige und fiele nie auf.
    */
    stift.fillStyle = '#000000'
    stift.fillStyle = farbe
    if (
      stift.fillStyle === '#000000' &&
      !/^(#000000|black|rgb\(0, ?0, ?0\))$/i.test(farbe.trim())
    ) {
      return null
    }
    stift.fillRect(0, 0, 1, 1)
    const [r, g, b, a] = stift.getImageData(0, 0, 1, 1).data
    return [r, g, b, a / 255]
  }

  /** Relative Leuchtdichte nach WCAG 2.1. */
  function leuchtdichte([r, g, b]) {
    const anteil = [r, g, b].map((wert) => {
      const v = wert / 255
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * anteil[0] + 0.7152 * anteil[1] + 0.0722 * anteil[2]
  }

  function verhaeltnis(vorn, hinten) {
    const a = leuchtdichte(vorn)
    const b = leuchtdichte(hinten)
    const hell = Math.max(a, b)
    const dunkel = Math.min(a, b)
    return (hell + 0.05) / (dunkel + 0.05)
  }

  /** Halbdurchsichtiges Vorn über deckendem Hinten. */
  function ueberblenden(vorn, hinten) {
    const a = vorn[3]
    return [
      vorn[0] * a + hinten[0] * (1 - a),
      vorn[1] * a + hinten[1] * (1 - a),
      vorn[2] * a + hinten[2] * (1 - a),
      1,
    ]
  }

  /**
   * Der Hintergrund, den der Nutzer hinter diesem Element wirklich sieht.
   *
   * Läuft die Kette hoch bis zur ersten deckenden Farbe und blendet
   * halbdurchsichtige Schichten darüber. Gibt `null` zurück, sobald ein Bild
   * oder ein Verlauf im Weg ist – dann gibt es keinen einen Wert, und eine
   * gerechnete Zahl wäre eine erfundene.
   */
  function hintergrundVon(el) {
    const schichten = []
    for (let v = el; v; v = v.parentElement) {
      const stil = getComputedStyle(v)
      if (stil.backgroundImage && stil.backgroundImage !== 'none') return null
      const farbe = zuRgba(stil.backgroundColor)
      if (!farbe || farbe[3] === 0) continue
      schichten.push(farbe)
      if (farbe[3] === 1) {
        let ergebnis = schichten.pop()
        while (schichten.length > 0) ergebnis = ueberblenden(schichten.pop(), ergebnis)
        return ergebnis
      }
    }
    return null
  }

  const AUSGENOMMEN = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH', 'OPTION'])
  const funde = []

  for (const el of document.querySelectorAll('body *')) {
    if (AUSGENOMMEN.has(el.tagName)) continue
    if (el.closest('svg')) continue

    // Nur Elemente mit eigenem Text – sonst würde jeder Container mitzählen.
    const eigenerText = [...el.childNodes]
      .filter((k) => k.nodeType === Node.TEXT_NODE)
      .map((k) => k.textContent.trim())
      .join(' ')
      .trim()
    if (eigenerText.length === 0) continue

    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    /*
      Text nur für Vorleseprogramme zählt nicht.

      `sr-only` schrumpft das Element auf ein Pixel und schneidet es ab – es ist
      für kein Auge da, und sein Kontrast beschreibt nichts. Die Prüfung meldete
      hier zunächst die verborgenen Karussell-Beschriftungen („Schlagzeile 1 …“),
      und das ist eine Zahl über etwas, das niemand sieht.

      Die Kanten werden mitgeprüft und nicht nur die Klasse: Es gibt mehr als
      einen Weg, Text so zu verstecken, und die Prüfung soll die Wirkung sehen,
      nicht den Namen.
    */
    if (r.width <= 1 || r.height <= 1) continue
    if (el.closest('.sr-only')) continue

    const stil = getComputedStyle(el)
    if (stil.visibility === 'hidden' || stil.display === 'none') continue
    if (Number(stil.opacity) < 0.1) continue
    // Deaktiviertes ist von WCAG ausdrücklich ausgenommen.
    if (el.closest('[disabled], [aria-disabled="true"]')) continue
    // Zugeklapptes zählt nicht – es ist nicht zu sehen.
    if (el.closest('details:not([open]) > *:not(summary)')) continue

    const vorn = zuRgba(stil.color)
    const hinten = hintergrundVon(el)
    if (!vorn || !hinten) continue
    /*
      Durchsichtige Schrift ist keine schlecht lesbare Schrift.

      `text-transparent` steht an mehreren Stellen mit Absicht: als
      Platzhalter, der Höhe hält, oder unter einem Verlauf, der die Schrift
      einfärbt. Ein Kontrastverhältnis von 1 zu melden hieße, eine Zahl über
      etwas zu berichten, das gar nicht zu sehen sein soll.
    */
    if (vorn[3] === 0) continue

    const sichtbar = vorn[3] === 1 ? vorn : ueberblenden(vorn, hinten)
    const wert = verhaeltnis(sichtbar, hinten)

    const groesse = Number.parseFloat(stil.fontSize)
    const fett = Number(stil.fontWeight) >= 700
    const grossText = groesse >= 24 || (fett && groesse >= 18.66)
    const schwelle = grossText ? 3 : 4.5

    if (wert + 0.05 < schwelle) {
      funde.push({
        text: eigenerText.slice(0, 44),
        tag: el.tagName.toLowerCase(),
        klasse: (el.className?.toString?.() ?? '').slice(0, 56),
        wert: Math.round(wert * 100) / 100,
        schwelle,
        groesse: Math.round(groesse * 10) / 10,
        vorn: stil.color,
        hinten: `rgb(${hinten.slice(0, 3).map(Math.round).join(', ')})`,
      })
    }
  }

  /* Gleiche Ursache, gleiche Meldung: je Klasse und Farbpaar nur einmal. */
  const gesehen = new Set()
  return funde.filter((f) => {
    const kennung = `${f.klasse}|${f.vorn}|${f.hinten}`
    if (gesehen.has(kennung)) return false
    gesehen.add(kennung)
    return true
  })
}

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })

let beanstandungen = 0
let geprueft = 0

/* Das dritte Feld ist das Systemschema für den Browser-Kontext;
   `data-theme` setzt die Schleife selbst. */
for (const [thema, attribut, schema] of [
  ['weiss', 'weiss', 'light'],
  ['dunkel', 'dark', 'dark'],
]) {
  const kontext = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    colorScheme: schema,
  })
  const seite = await kontext.newPage()
  console.log(`\n─── Darstellung: ${thema} ───`)

  for (const [pfad, was] of SEITEN) {
    geprueft += 1
    let funde
    try {
      const antwort = await seite.goto(basis + pfad, { waitUntil: 'networkidle' })
      if (!antwort || !antwort.ok()) {
        console.error(`FEHL ${pfad} – ${antwort ? antwort.status() : 'keine Antwort'}`)
        beanstandungen += 1
        continue
      }
      /*
        Das Attribut setzen und nicht nur `colorScheme` verlassen: Der
        Umschalter der Website schreibt `data-theme` auf das Wurzelelement, und
        dessen Regeln gewinnen. Wer nur das Systemschema stellt, prüft den Fall
        nicht, den ein Nutzer per Knopf herstellt.
      */
      await seite.evaluate(
        (s) => document.documentElement.setAttribute('data-theme', s),
        attribut
      )
      funde = await seite.evaluate(IM_BROWSER)
    } catch (fehler) {
      console.error(`FEHL ${pfad} – ${fehler.message}`)
      beanstandungen += 1
      continue
    }

    if (funde.length === 0) {
      console.log(`OK   ${pfad}`)
      continue
    }

    beanstandungen += 1
    console.error(
      `\nFEHL ${pfad} – ${funde.length} Stellen unter der Schwelle\n     ${was}`
    )
    for (const f of funde.slice(0, 6)) {
      console.error(
        `     ${f.wert} statt ${f.schwelle}  ${f.tag} (${f.groesse}px)  ${f.vorn} auf ${f.hinten}`
      )
      console.error(`         „${f.text}"  ${f.klasse}`)
    }
  }

  await kontext.close()
}

await browser.close()

console.log(
  `\n${geprueft - beanstandungen} von ${geprueft} Prüfungen bestanden ` +
    `(${SEITEN.length} Seiten × 2 Darstellungen).`
)
if (beanstandungen > 0) {
  console.error(
    'Text unter der Kontrastschwelle ist nicht für alle lesbar. Das gehört behoben –\n' +
      'bei Nebentexten meist über eine Stufe dunkleres Grau, nicht über eine Ausnahme.'
  )
  process.exit(1)
}
