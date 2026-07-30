/**
 * Prüft das fertig gebaute Paket unter `out/`.
 *
 * ## Warum am Ergebnis und nicht am Quelltext
 *
 * Die übrigen Prüfungen dieses Projekts setzen früher an: ESLint am Stil,
 * TypeScript an den Typen, `lib/learn-validate.ts` und die übrigen
 * `*-validate`-Module an den Daten. Sie alle sehen die Absicht.
 *
 * Diese hier sieht das Ergebnis. Sie öffnet die ausgelieferten Dateien und
 * fragt, was ein Besucher bekäme – ein toter Link, eine abgeschnittene
 * Beschreibung im Suchergebnis, eine Seite ohne Überschrift, ein Bild ohne
 * Alternativtext. Nichts davon fällt beim Betrachten der Seite auf, und
 * nichts davon fangen die früheren Prüfungen ab.
 *
 * Der Anlass ist konkret: Ein früherer Lauf hat eine Website ohne Stylesheet
 * ausgeliefert, und niemand hat es vor dem Hochladen bemerkt.
 *
 * ## Ohne zusätzliche Abhängigkeit
 *
 * Geprüft wird über Zeichenkettensuche im HTML, nicht über einen Browser.
 * Ein echter Browser fände zusätzlich Konsolenfehler – dafür bräuchte es
 * Playwright im Projekt, und das wiegt schwerer als der Zugewinn. Was hier
 * steht, findet die Fehlerklassen, die ohne Ausführung sichtbar sind, und
 * läuft dafür in Sekunden.
 *
 * Aufruf: `npm run pruefen`
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

/*
  Über den relativen Pfad und nicht über `@/lib/site`: Dieses Skript läuft
  ohne Next.js, der Alias existiert dort nicht. `resolve-site-url.ts` ist
  bewusst importfrei und lässt sich deshalb direkt laden.
*/
import { resolveSiteUrl } from '../lib/resolve-site-url.ts'

const PAKET = 'out'

/** Diese Dateien müssen im Paket liegen, sonst ist es unbrauchbar. */
const PFLICHTDATEIEN = [
  'index.html',
  '404.html',
  'sitemap.xml',
  'robots.txt',
  'version.txt',
  /*
    Versteckte Datei, deshalb ausdrücklich geprüft: Sie ist schon einmal
    unbemerkt aus dem Artefakt gefallen, weil `upload-artifact` versteckte
    Dateien standardmäßig überspringt. Ohne sie liefert der Server bei
    unbekannten Adressen seine eigene Fehlerseite statt der gestalteten.
  */
  '.htaccess',
]

/** Zielkorridor für die Meta-Description – darüber schneidet die Suche ab. */
const BESCHREIBUNG_MAX = 160
const TITEL_MAX = 65

/**
 * Untergrenze für die Zahl der Seiten.
 *
 * Ein Export, der zwar durchläuft, aber nur eine Handvoll Seiten erzeugt, ist
 * kaputt – und sieht im Log genauso aus wie ein guter. Die Zahl ist bewusst
 * weit unter dem tatsächlichen Umfang angesetzt: Sie soll den Totalausfall
 * fangen, nicht jede Schwankung melden.
 */
const MINDESTSEITEN = 100

/**
 * Textmuster, die im ausgelieferten Text nichts zu suchen haben.
 *
 * `undefined` und `NaN` stehen hier, weil sie die typische Spur einer
 * fehlgeschlagenen Formatierung sind: Die Seite baut durch, und im Text
 * steht dann „NaN %“.
 */
const VERBOTENE_MUSTER: { name: string; muster: RegExp }[] = [
  { name: 'TODO', muster: /\bTODO\b/ },
  { name: 'FIXME', muster: /\bFIXME\b/ },
  { name: 'Lorem ipsum', muster: /Lorem ipsum/i },
  { name: 'Platzhalter', muster: /\bPLATZHALTER\b/i },
  { name: 'undefined', muster: /\bundefined\b/ },
  { name: 'NaN', muster: /\bNaN\b/ },
  { name: '[object Object]', muster: /\[object Object\]/ },
]

/*
  Die Fehlerseite gibt es dreimal – als `404.html`, unter `/404/` und unter
  `/_not-found/`. Dass die drei denselben Titel tragen, ist richtig und keine
  Dublette im Sinne der Suchmaschine.
*/
const FEHLERSEITEN = /(^\/404)|(^\/_not-found)/

function alleDateien(wurzel: string, endung: string): string[] {
  const gefunden: string[] = []
  const laufen = (ordner: string): void => {
    for (const eintrag of readdirSync(ordner)) {
      const pfad = join(ordner, eintrag)
      if (statSync(pfad).isDirectory()) laufen(pfad)
      else if (pfad.endsWith(endung)) gefunden.push(pfad)
    }
  }
  laufen(wurzel)
  return gefunden
}

/** Aus einem Dateipfad die Adresse machen, unter der die Seite erreichbar ist. */
function adresse(datei: string): string {
  const rel = '/' + relative(PAKET, datei).split('\\').join('/')
  return rel.replace(/index\.html$/, '').replace(/\.html$/, '')
}

/**
 * Prüft die Lerngrafiken auf Geometrie, die aus dem Bild läuft.
 *
 * ## Warum das eine eigene Prüfung braucht
 *
 * SVG bricht nicht um und schiebt nichts zurecht: Ein `<text>`, dessen
 * Grundlinie zwei Pixel unter dem unteren Rand liegt, wird abgeschnitten. Im
 * Quelltext sieht das völlig unauffällig aus – eine Zahl unter einer anderen –,
 * und beim Betrachten am großen Bildschirm fällt es ebenfalls nicht auf, weil
 * dort nur der letzte Buchstabenrest fehlt.
 *
 * Genau das ist bei `staatsanleihe-laufzeiten` passiert: Die zweite Zeile des
 * Fußtextes ragte zweieinhalb Pixel heraus. Gefunden hat es nicht das Auge,
 * sondern diese Rechnung.
 *
 * ## Was geprüft wird
 *
 * - Jede Textgrundlinie muss samt Oberlänge und Unterlänge in die viewBox
 *   passen.
 * - Kein Rechteck darf eine negative Höhe oder Breite haben. Negative Maße
 *   zeichnen nichts – eine Säule verschwindet dann stillschweigend, statt
 *   falsch zu stehen.
 * - In keinem Zahlenattribut darf `NaN` stehen. Eine fehlgeschlagene Rechnung
 *   macht sonst aus einer Grafik ein leeres Feld.
 *
 * Die Breite von Text lässt sich hier nicht prüfen: Wie breit eine Zeile
 * wirklich wird, weiß erst der Browser. Geprüft wird deshalb nur der
 * Ankerpunkt.
 *
 * ## Warum je Grafik nur einmal gemeldet wird
 *
 * Dieselbe Grafik steht auf vielen Seiten. Ohne die Sammlung stünde ein
 * einziger Fehler hundertfach in der Ausgabe und verdeckte alles andere.
 */
function grafikenPruefen(html: string, gemeldet: Set<string>): string[] {
  const fehler: string[] = []

  for (const treffer of html.matchAll(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/g)) {
    const kopf = treffer[1]
    const inhalt = treffer[2]

    // Nur die Lerngrafiken – Symbole im Seitengerüst tragen kein aria-labelledby.
    const kennung = kopf.match(/aria-labelledby="([^"\s]+)-titel/)?.[1]
    if (!kennung || gemeldet.has(kennung)) continue

    const box = kopf.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)
    if (!box) continue
    const breite = Number(box[1])
    const hoehe = Number(box[2])

    const melden = (text: string): void => {
      fehler.push(`Grafik „${kennung}“: ${text}`)
      gemeldet.add(kennung)
    }

    if (/(^|["\s])NaN|>NaN</.test(inhalt)) {
      melden('enthält NaN – eine Rechnung darin ist fehlgeschlagen.')
      continue
    }

    for (const text of inhalt.matchAll(/<text\b([^>]*)>/g)) {
      const attribute = text[1]
      const y = Number(attribute.match(/\by="(-?[\d.]+)"/)?.[1])
      const x = Number(attribute.match(/\bx="(-?[\d.]+)"/)?.[1])
      const groesse = Number(attribute.match(/font-size="([\d.]+)"/)?.[1] ?? 13)
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue

      // Oberlänge über der Grundlinie, Unterlänge darunter – grob, aber in die
      // sichere Richtung gerundet.
      if (y - groesse < -0.5 || y + groesse * 0.22 > hoehe + 0.5) {
        melden(
          `Text bei y=${y} (Schriftgröße ${groesse}) passt nicht in die Höhe ${hoehe} – er wird abgeschnitten.`
        )
        break
      }
      if (x < -0.5 || x > breite + 0.5) {
        melden(`Text bei x=${x} liegt außerhalb der Breite ${breite}.`)
        break
      }
    }

    for (const rechteck of inhalt.matchAll(/<rect\b([^>]*)>/g)) {
      const attribute = rechteck[1]
      const h = Number(attribute.match(/\bheight="(-?[\d.]+)"/)?.[1])
      const b = Number(attribute.match(/\bwidth="(-?[\d.]+)"/)?.[1])
      if (h < 0 || b < 0) {
        melden(`Rechteck mit negativer Kantenlänge (${b} × ${h}) – es zeichnet nichts.`)
        break
      }
    }
  }

  return fehler
}

/** Sichtbarer Text – Skripte und Stilblöcke zählen nicht als Inhalt. */
function nurText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
}

function pruefen(): string[] {
  const fehler: string[] = []

  for (const datei of PFLICHTDATEIEN) {
    try {
      statSync(join(PAKET, datei))
    } catch {
      fehler.push(`Pflichtdatei fehlt: ${datei}`)
    }
  }

  if (alleDateien(join(PAKET, '_next'), '.css').length === 0) {
    fehler.push('Kein Stylesheet im Paket – die Seite käme ohne Formatierung heraus.')
  }

  const seiten = alleDateien(PAKET, '.html')
  if (seiten.length === 0) {
    return ['Keine einzige HTML-Seite im Paket.']
  }
  if (seiten.length < MINDESTSEITEN) {
    fehler.push(
      `Nur ${seiten.length} Seiten im Paket – der Export ist unvollständig ` +
        `(erwartet werden mindestens ${MINDESTSEITEN}).`
    )
  }

  const erreichbar = new Set(seiten.map(adresse))
  const titel = new Map<string, string[]>()
  const beschreibungen = new Map<string, string[]>()
  const grafikGemeldet = new Set<string>()

  for (const datei of seiten) {
    const pfad = adresse(datei)
    const html = readFileSync(datei, 'utf8')
    const text = nurText(html)

    // ---------------------------------------------------------- interne Links
    for (const treffer of html.matchAll(/href="(\/[^"#?]*)"/g)) {
      const ziel = treffer[1]
      if (ziel.startsWith('/_next') || /\.[a-z0-9]{2,5}$/i.test(ziel)) continue
      const normiert = ziel.endsWith('/') ? ziel : `${ziel}/`
      if (!erreichbar.has(normiert) && !erreichbar.has(ziel)) {
        fehler.push(`${pfad}: Link ins Leere → ${ziel}`)
      }
    }

    // ------------------------------------------------------------ Meta-Angaben
    const t = html.match(/<title>([^<]*)<\/title>/)?.[1]
    const d = html.match(/<meta name="description" content="([^"]*)"/)?.[1]

    if (!t) fehler.push(`${pfad}: kein <title>`)
    else {
      if (t.length > TITEL_MAX) {
        fehler.push(
          `${pfad}: <title> ist ${t.length} Zeichen lang (erlaubt ${TITEL_MAX})`
        )
      }
      if (!FEHLERSEITEN.test(pfad)) {
        if (!titel.has(t)) titel.set(t, [])
        titel.get(t)!.push(pfad)
      }
    }

    if (!d) fehler.push(`${pfad}: keine Meta-Description`)
    else {
      if (d.length > BESCHREIBUNG_MAX) {
        fehler.push(
          `${pfad}: Meta-Description ist ${d.length} Zeichen lang (erlaubt ${BESCHREIBUNG_MAX})`
        )
      }
      if (!FEHLERSEITEN.test(pfad)) {
        if (!beschreibungen.has(d)) beschreibungen.set(d, [])
        beschreibungen.get(d)!.push(pfad)
      }
    }

    // ------------------------------------------------------------- Gliederung
    const ueberschriften = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]))
    const anzahlH1 = ueberschriften.filter((stufe) => stufe === 1).length
    if (anzahlH1 === 0) fehler.push(`${pfad}: keine <h1>`)
    if (anzahlH1 > 1)
      fehler.push(`${pfad}: ${anzahlH1} mal <h1> – erlaubt ist genau eine`)

    for (let i = 1; i < ueberschriften.length; i++) {
      const sprung = ueberschriften[i] - ueberschriften[i - 1]
      if (sprung > 1) {
        fehler.push(
          `${pfad}: Überschriftensprung h${ueberschriften[i - 1]} → h${ueberschriften[i]}`
        )
        break
      }
    }

    // ------------------------------------------------------- Barrierefreiheit
    if (!/<html[^>]+lang="/.test(html)) fehler.push(`${pfad}: <html> ohne lang-Attribut`)

    const ohneAlt = (html.match(/<img(?![^>]*\balt=)[^>]*>/g) ?? []).length
    if (ohneAlt > 0) fehler.push(`${pfad}: ${ohneAlt} Bild(er) ohne alt-Attribut`)

    for (const treffer of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
      const inhalt = treffer[2]
      const beschriftet =
        /aria-label=|title=/.test(treffer[1]) || /<(svg|img)/.test(inhalt)
      if (!inhalt.replace(/<[^>]+>/g, '').trim() && !beschriftet) {
        fehler.push(`${pfad}: Link ohne erkennbaren Namen`)
        break
      }
    }

    for (const treffer of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
      const beschriftet = /aria-label=/.test(treffer[1]) || /<(svg|img)/.test(treffer[2])
      if (!treffer[2].replace(/<[^>]+>/g, '').trim() && !beschriftet) {
        fehler.push(`${pfad}: Schaltfläche ohne erkennbaren Namen`)
        break
      }
    }

    for (const tabelle of html.matchAll(/<table\b[\s\S]*?<\/table>/g)) {
      if (!/<th[\s>]/.test(tabelle[0])) {
        fehler.push(`${pfad}: Tabelle ohne Kopfzelle (<th>)`)
        break
      }
    }

    // ------------------------------------------------------------ Platzhalter
    for (const { name, muster } of VERBOTENE_MUSTER) {
      if (muster.test(text)) fehler.push(`${pfad}: „${name}“ steht im sichtbaren Text`)
    }

    /*
      Mehrzeilige Formeln, die zu einer Zeile zusammenfallen.

      HTML macht aus einem Zeilenumbruch ein Leerzeichen, sofern die
      Weißraumbehandlung nichts anderes sagt. Der MACD besteht aus drei
      Definitionen, die True Range aus vier Zeilen – ohne `whitespace-pre-*`
      wird daraus eine durchlaufende Zeile, in der die Gleichheitszeichen
      wahllos verteilt scheinen.

      Der Fehler ist im Quelltext unsichtbar: Dort stehen die Umbrüche ja. Er
      entsteht erst beim Anzeigen, und beim Überfliegen der Seite sieht eine
      lange Formel nicht falsch aus, sondern nur lang. Deshalb steht die
      Prüfung hier und nicht bei den Daten.
    */
    for (const treffer of html.matchAll(/<p\b([^>]*)>([^<]*)<\/p>/g)) {
      if (!treffer[2].includes('\n')) continue
      if (/white-?space[-:]\s*(pre|break)/.test(treffer[1])) continue
      fehler.push(
        `${pfad}: Ein Absatz enthält Zeilenumbrüche, die der Browser zu Leerzeichen ` +
          'macht – vermutlich eine mehrzeilige Formel ohne `whitespace-pre-wrap`.'
      )
      break
    }

    // ----------------------------------------------------------- Lerngrafiken
    fehler.push(...grafikenPruefen(html, grafikGemeldet))

    /*
      Das Startskript für das Farbschema.

      Es steht als Zeichenkette im Layout und wird beim Bauen zusammengesetzt.
      Genau das ist einmal schiefgegangen: Der Schlüssel für den localStorage
      kam aus einer `'use client'`-Datei, über diese Grenze reicht der Server
      keinen Wert – im HTML stand `localStorage.getItem(undefined)`.

      Gültiges JavaScript, keine Fehlermeldung, kein Absturz. Nur hat der
      Umschalter unter `fk-theme` geschrieben und das Startskript unter
      `"undefined"` gelesen: Die Wahl des Besuchers überlebte kein Neuladen.
      Aufgefallen ist es erst, als jemand das ausgelieferte HTML gelesen hat.

      Die Prüfung sieht deshalb ins Skript selbst, nicht in den sichtbaren Text
      – dort kommt sie mit `nurText` gar nicht an.
    */
    const startskript = html.match(
      /<script>\(function\(\)\{try\{[\s\S]{0,600}?<\/script>/
    )?.[0]
    if (startskript && /getItem\((undefined|null|""|'')\)/.test(startskript)) {
      fehler.push(
        `${pfad}: Das Farbschema-Startskript liest einen leeren Speicherschlüssel – ` +
          'die Wahl des Besuchers überlebt kein Neuladen.'
      )
    }
  }

  for (const [wert, pfade] of titel) {
    if (pfade.length > 1) {
      fehler.push(
        `Titel „${wert}“ steht auf ${pfade.length} Seiten: ${pfade.slice(0, 4).join(', ')}`
      )
    }
  }
  for (const [, pfade] of beschreibungen) {
    if (pfade.length > 1) {
      fehler.push(
        `Gleiche Meta-Description auf ${pfade.length} Seiten: ${pfade.slice(0, 4).join(', ')}`
      )
    }
  }

  // ----------------------------------------------------------------- Sitemap
  const sitemap = readFileSync(join(PAKET, 'sitemap.xml'), 'utf8')

  /*
    Eine echte Domain muss im Ergebnis stehen, kein Platzhalter.

    Sonst zeigt jede Seite auf eine Adresse, die es nicht gibt – im Browser
    unsichtbar, für Suchmaschinen fatal. Seit die Basis-URL in
    `lib/resolve-site-url.ts` auf die echte Domain zeigt, kann das eigentlich
    nicht mehr passieren. Die Prüfung bleibt trotzdem: Sie hat den Fehler
    zweimal gefunden, und die reservierte `.example`-TLD gehört unter keinen
    Umständen in eine Sitemap.
  */
  if (sitemap.includes('.example/')) {
    fehler.push(
      'Die Sitemap enthält eine Platzhalter-Domain (.example). ' +
        'NEXT_PUBLIC_SITE_URL prüfen oder lib/resolve-site-url.ts.'
    )
  }

  const eingetragen = new Set(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
  )
  for (const pfad of erreichbar) {
    if (FEHLERSEITEN.test(pfad)) continue
    if (!eingetragen.has(pfad)) fehler.push(`Nicht in der Sitemap: ${pfad}`)
  }
  for (const pfad of eingetragen) {
    if (!erreichbar.has(pfad)) fehler.push(`Sitemap zeigt ins Leere: ${pfad}`)
  }

  /*
    ------------------------------------------------------------- Suchindex

    Dieselbe Frage wie bei der Sitemap, nur für die Lupe: Findet die Suche
    jede Seite, die es gibt?

    Der Anlass ist konkret. Der Index wird in `lib/search.ts` abschnittsweise
    zusammengesetzt – Bereiche, Lernthemen, Rechner, Kurse, Länder. Wer eine
    neue Seite baut, denkt an die Sitemap, weil sie abgeleitet ist, und
    vergisst die Suche, weil sie es nicht ist. Vier Seiten hatten deshalb
    keinen Eintrag: die beiden Stimmungsindizes, die Lernpfad-Übersicht und
    die Startseite. Aufgefallen ist es niemandem, denn eine Suche, die nichts
    findet, sieht aus wie eine Suche ohne Treffer.
  */
  const suchindex: { href: string }[] = JSON.parse(
    readFileSync(join(PAKET, 'suchindex.json'), 'utf8')
  )
  const gelistet = new Set(
    suchindex.map((eintrag) => {
      const ohneAnker = eintrag.href.split('#')[0]
      return ohneAnker.endsWith('/') ? ohneAnker : `${ohneAnker}/`
    })
  )
  for (const pfad of erreichbar) {
    if (FEHLERSEITEN.test(pfad)) continue
    if (!gelistet.has(pfad)) fehler.push(`Nicht im Suchindex: ${pfad}`)
  }
  for (const pfad of gelistet) {
    if (!erreichbar.has(pfad)) fehler.push(`Suchindex zeigt ins Leere: ${pfad}`)
  }

  /*
    ------------------------------------------------- Adressen, die es nicht gibt

    In der Fußzeile der herunterladbaren Vermögensübersicht stand über Monate
    `im-invests.de` – mit Bindestrich. Diese Domain existiert nicht und löst
    nicht einmal auf; wer den ausgedruckten Bogen später zur Hand nahm und die
    Adresse eintippte, landete im Nichts.

    Der Fehler ist von der gebauten Seite aus unsichtbar: Die Zeile entsteht
    erst im Browser beim Erzeugen der PDF-Datei. Sichtbar ist sie nur als Text
    im JavaScript-Paket – und genau dort wird jetzt nachgesehen. Geprüft werden
    HTML und JavaScript, weil eine falsche Adresse in beiden landen kann.
  */
  const falscheAdressen = ['im-invests.de', 'im-invests.example', 'iminvests.com']
  for (const datei of [...seiten, ...alleDateien(join(PAKET, '_next'), '.js')]) {
    const inhalt = readFileSync(datei, 'utf8')
    for (const falsch of falscheAdressen) {
      if (inhalt.includes(falsch)) {
        fehler.push(
          `Adresse „${falsch}“ steht in ${adresse(datei)} – die Website heißt ` +
            `${new URL(resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)).host}.`
        )
      }
    }
  }

  return fehler
}

const gefunden = pruefen()
const seitenzahl = alleDateien(PAKET, '.html').length

if (gefunden.length === 0) {
  console.log(`Paket geprüft: ${seitenzahl} Seiten, keine Beanstandung.`)
  console.log(`Stylesheets:   ${alleDateien(join(PAKET, '_next'), '.css').length}`)
  console.log(`Dateien:       ${alleDateien(PAKET, '').length}`)
  process.exit(0)
}

console.error(
  `Paket fehlerhaft – ${gefunden.length} Beanstandung(en) bei ${seitenzahl} Seiten:\n`
)
/*
  Gleichartige Fehler treten oft hundertfach auf – ein Link im Fußbereich
  steht auf jeder Seite. Die Ausgabe wird gekürzt, damit der wesentliche
  Befund nicht in der Wiederholung untergeht.
*/
for (const zeile of gefunden.slice(0, 40)) console.error(`  – ${zeile}`)
if (gefunden.length > 40) console.error(`  … und ${gefunden.length - 40} weitere`)
process.exit(1)
