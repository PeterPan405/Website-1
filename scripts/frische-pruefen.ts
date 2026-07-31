/**
 * Prüft, was still veraltet: Zahlen im Fließtext, Stichtagswerte, Momentaufnahmen.
 *
 * ## Warum es diese Prüfung gibt
 *
 * Weil dies die einzige Fehlerklasse dieses Projekts ist, die schon zweimal
 * aufgetreten ist, und die keine der bestehenden Prüfungen fängt. Ein Text,
 * der „33 Lernthemen“ behauptet, ist nach dem vierunddreißigsten still falsch:
 * Der Build ist grün, ESLint ist grün, TypeScript ist grün, die Paketprüfung
 * ist grün. Nur die Aussage stimmt nicht mehr.
 *
 * Im Projektverzeichnis steht dazu seit Langem die Regel „Zahlen im Fließtext
 * gehören abgeleitet“ – und daneben stand, in derselben Datei, mehrfach die
 * Zahl 33. Eine Regel, die niemand prüft, ist eine Absichtserklärung.
 *
 * ## Was geprüft wird
 *
 * 1. **Zahlen im Fließtext.** Muster wie „34 Lernthemen“ oder „1.029 Aktien“
 *    werden gegen die tatsächliche Anzahl gehalten.
 * 2. **Stichtagswerte.** Der Basiszins und alles andere aus
 *    `data/stichtagswerte.ts`, das jährlich neu gesetzt wird.
 * 3. **Momentaufnahmen.** Wie alt der letzte erfolgreiche Abruf je Datei ist.
 *
 * ## Was bewusst nicht geprüft wird
 *
 * Ungefähre Angaben. „Über tausend Aktien“ bleibt richtig, solange es über
 * tausend sind, und genau dafür steht so ein Satz da. Geprüft werden nur
 * ausgeschriebene Zahlen – wer eine hinschreibt, behauptet Genauigkeit.
 *
 * Aufruf: `npm run frische`
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { alterInTagen, pruefeReihenalter, REIHENGRENZEN } from '../lib/reihen-alter.ts'
import { ueberholt } from '../lib/stichtag.ts'
import { stichtagswerte } from '../data/stichtagswerte.ts'

/** Verzeichnisse, in denen nach Zahlen im Fließtext gesucht wird. */
const DURCHSUCHEN = ['app', 'components', 'data', 'lib', 'scripts']
const EINZELDATEIEN = ['README.md', 'AGENTS.md', 'EINRICHTUNG.md']

const ENDUNGEN = ['.ts', '.tsx', '.md']

/** Verzeichnisse, die nie durchsucht werden. */
const AUSGENOMMEN = new Set(['node_modules', '.next', 'out', 'snapshots'])

interface Beanstandung {
  datei: string
  zeile: number
  gefunden: string
  erwartet: number
  was: string
}

/** Sammelt alle Textdateien unter einem Pfad. */
function dateien(pfad: string): string[] {
  const gefunden: string[] = []
  let eintraege: string[]
  try {
    eintraege = readdirSync(pfad)
  } catch {
    return gefunden
  }
  for (const name of eintraege) {
    if (AUSGENOMMEN.has(name)) continue
    const voll = join(pfad, name)
    if (statSync(voll).isDirectory()) {
      gefunden.push(...dateien(voll))
    } else if (ENDUNGEN.some((endung) => name.endsWith(endung))) {
      gefunden.push(voll)
    }
  }
  return gefunden
}

/**
 * Die Zählungen, gegen die geprüft wird.
 *
 * Jede kommt aus derselben Quelle wie die Website selbst. Eine hier
 * abgetippte Zahl wäre genau der Fehler, den dieses Skript sucht.
 */
interface Wahrheit {
  anzahl: number
  worte: string[]
  /**
   * Ob das Wort auch Teilmengen bezeichnen kann.
   *
   * „Lernthemen“ meint immer alle. „Aktien“ nicht: In den Abrufskripten steht
   * „534 Aktien in 42 Ländern“ für die Lücke, „190 Aktien“ für die taiwanischen.
   * Das sind richtige Sätze über Teilmengen, und sie als veraltete Gesamtzahl
   * zu melden hieße, drei Warnungen zu erzeugen, die niemand abstellen kann –
   * und nach der dritten liest niemand mehr hin.
   *
   * Bei mehrdeutigen Wörtern wird deshalb nur gemeldet, was **nahe** an der
   * Gesamtzahl liegt. Eine Angabe, die um wenige Prozent danebenliegt, ist so
   * gut wie sicher eine stehengebliebene Gesamtzahl; eine, die halb so groß
   * ist, war nie eine.
   */
  mehrdeutig?: boolean
}

/**
 * Wie nah eine mehrdeutige Angabe an der Gesamtzahl liegen muss, um zu zählen.
 *
 * Fünfzehn Prozent, und die Grenze ist an echten Sätzen geeicht: „817 Aktien“
 * steht in der Einrichtungsanleitung für die über Twelve Data erreichbaren –
 * knapp 21 Prozent unter der Gesamtzahl und damit außen vor. „99 Stufen“ und
 * „396 Fragen“ liegen unter drei Prozent daneben und sind genau das, was
 * gesucht wird: stehengebliebene Gesamtzahlen.
 */
const NAHE_GENUG = 0.15

async function wahrheiten(): Promise<Map<string, Wahrheit>> {
  const { marketDefinitions } = await import('../data/markets.ts')
  const { figureMeta } = await import('../data/figures.ts')

  /*
    Die Lernthemen über das Verzeichnis und nicht über `data/learn/index.ts`:
    Das Modul importiert über den Alias `@/`, den es außerhalb von Next.js
    nicht gibt. Eine Datei je Thema ist die Ordnung dieses Verzeichnisses, und
    `index.ts` gehört nicht dazu.
  */
  const themen = readdirSync('data/learn/topics').filter(
    (name) => name.endsWith('.ts') && name !== 'index.ts'
  ).length

  const aktien = marketDefinitions.filter((eintrag) => eintrag.kind === 'stock').length

  /*
    Die Rechner werden gezählt und nicht importiert: `data/calculators.ts`
    greift über den Alias `@/` auf die Service-Schicht zu, den es außerhalb von
    Next.js nicht gibt. Ein `slug` je Rechner ist die Struktur dieser Datei.
  */
  const rechner = (
    readFileSync('data/calculators.ts', 'utf8').match(/^ {4}slug: '/gm) ?? []
  ).length

  /*
    Quizfragen aus derselben Datei, aus der sie die Website nimmt. Gezählt
    wird über alle Stufen; die Zahl der Stufen fällt dabei mit ab.
  */
  const quizmodul = (await import('../data/learn/quizzes.ts')) as Record<string, unknown>
  const quizsammlung = Object.values(quizmodul).find(
    (wert) => wert && typeof wert === 'object' && !Array.isArray(wert)
  ) as Record<string, unknown[]> | undefined
  const stufen = quizsammlung ? Object.keys(quizsammlung).length : 0
  const fragen = quizsammlung
    ? Object.values(quizsammlung).reduce(
        (summe, liste) => summe + (Array.isArray(liste) ? liste.length : 0),
        0
      )
    : 0

  return new Map<string, Wahrheit>([
    ['themen', { anzahl: themen, worte: ['Lernthemen'] }],
    ['stufen', { anzahl: stufen, worte: ['Lernstufen'] }],
    ['stufen-kurz', { anzahl: stufen, worte: ['Stufen'], mehrdeutig: true }],
    ['fragen', { anzahl: fragen, worte: ['Quizfragen'] }],
    ['fragen-kurz', { anzahl: fragen, worte: ['Fragen'], mehrdeutig: true }],
    ['aktien', { anzahl: aktien, worte: ['Aktien'], mehrdeutig: true }],
    ['instrumente', { anzahl: marketDefinitions.length, worte: ['Instrumente'] }],
    /*
      Die Rechner. Sie sind der Grund, warum diese Zeile existiert: Im
      Projektverzeichnis stand ausgerechnet im Abschnitt „Zahlen im Fließtext
      gehören abgeleitet“ das Beispiel „fünf Rechner“ – zu einem Zeitpunkt, an
      dem es acht waren.
    */
    ['rechner', { anzahl: rechner, worte: ['Rechner'], mehrdeutig: true }],
    [
      'zeichnungen',
      {
        anzahl: Object.keys(figureMeta).length,
        worte: ['Zeichnungen', 'Erklärgrafiken'],
        mehrdeutig: true,
      },
    ],
  ])
}

/** Liest „1.029“ oder „1029“ als Zahl. */
function alsZahl(text: string): number {
  return Number(text.replace(/[.\s]/g, ''))
}

function pruefeTexte(soll: Map<string, Wahrheit>): Beanstandung[] {
  const beanstandet: Beanstandung[] = []
  const alle = [...DURCHSUCHEN.flatMap(dateien), ...EINZELDATEIEN]

  for (const datei of alle) {
    let inhalt: string
    try {
      inhalt = readFileSync(datei, 'utf8')
    } catch {
      continue
    }
    /*
      Die eigene Datei bleibt außen vor. In ihr stehen die Suchwörter selbst,
      und ein Skript, das sich an seiner eigenen Dokumentation stört, meldet
      nur Unfug.
    */
    if (datei.endsWith('frische-pruefen.ts')) continue

    const zeilen = inhalt.split('\n')
    for (const [index, zeile] of zeilen.entries()) {
      for (const [, { anzahl, worte, mehrdeutig }] of soll) {
        for (const wort of worte) {
          const muster = new RegExp(`(\\d[\\d.]*)\\s+${wort}\\b`, 'g')
          for (const treffer of zeile.matchAll(muster)) {
            const gefunden = alsZahl(treffer[1])
            if (!Number.isFinite(gefunden) || gefunden === anzahl) continue
            /*
              Kleine Zahlen sind fast nie eine Gesamtzahl. „vier Fragen je
              Stufe“ steht als Ziffer da, „drei Stufen“ ebenfalls – beides
              beschreibt einen Aufbau und keine Summe. Die Grenze ist gesetzt
              und nicht hergeleitet; sie soll Rauschen fernhalten.
            */
            if (gefunden < 10) continue
            /*
              Bei mehrdeutigen Wörtern zählt nur, was nahe an der Gesamtzahl
              liegt – siehe die Begründung an `Wahrheit.mehrdeutig`.
            */
            if (mehrdeutig && Math.abs(gefunden - anzahl) / anzahl > NAHE_GENUG) continue
            beanstandet.push({
              datei,
              zeile: index + 1,
              gefunden: treffer[0].trim(),
              erwartet: anzahl,
              was: wort,
            })
          }
        }
      }
    }
  }
  return beanstandet
}

/** Wie alt die Momentaufnahmen sind. */
function pruefeMomentaufnahmen(): { datei: string; tage: number; stand: string }[] {
  const ergebnis: { datei: string; tage: number; stand: string }[] = []
  const ordner = 'data/snapshots'
  for (const name of readdirSync(ordner)) {
    if (!name.endsWith('.json')) continue
    let bestand: Record<string, unknown>
    try {
      bestand = JSON.parse(readFileSync(join(ordner, name), 'utf8'))
    } catch {
      continue
    }
    const stand = bestand.abgerufenAm ?? bestand.stand ?? bestand.bezugsjahr
    if (typeof stand !== 'string') continue
    const zeit = Date.parse(stand)
    if (!Number.isFinite(zeit)) continue
    const tage = Math.floor((Date.now() - zeit) / 86_400_000)
    ergebnis.push({ datei: name, tage, stand: stand.slice(0, 10) })
  }
  return ergebnis.sort((a, b) => b.tage - a.tage)
}

async function main(): Promise<void> {
  const soll = await wahrheiten()

  console.log('\nZahlen im Fließtext')
  console.log('───────────────────')
  const gezeigt = new Set<number>()
  for (const [name, { anzahl }] of soll) {
    if (name.endsWith('-kurz')) continue
    gezeigt.add(anzahl)
    console.log(`  ${name.padEnd(14)} ${String(anzahl).padStart(5)}`)
  }

  const beanstandet = pruefeTexte(soll)
  if (beanstandet.length === 0) {
    console.log('\n  Keine abweichende Zahl gefunden.')
  } else {
    console.log(`\n  ${beanstandet.length} Abweichungen:\n`)
    for (const fund of beanstandet) {
      console.log(
        `  ${fund.datei}:${fund.zeile}\n` +
          `    steht „${fund.gefunden}“, tatsächlich sind es ${fund.erwartet}`
      )
    }
  }

  console.log('\nStichtagswerte')
  console.log('──────────────')
  const jahr = new Date().getFullYear()
  const alt = ueberholt(stichtagswerte, jahr)
  if (alt.length === 0) {
    console.log(`  Alle Werte gelten für ${jahr}.`)
  } else {
    for (const { wert, jahreZurueck } of alt) {
      console.log(
        `  ${wert.bezeichnung}\n` +
          `    zuletzt für ${wert.gilt} gesetzt, also ${jahreZurueck} Jahr(e) zurück\n` +
          `    ${wert.pflege}`
      )
    }
  }

  console.log('\nLaufende Kosten der ETFs')
  console.log('────────────────────────')
  const { etfKosten } = await import('../data/etf-kosten.ts')
  const { marketDefinitions: alleInstrumente } = await import('../data/markets.ts')
  const fonds = alleInstrumente.filter((eintrag) => eintrag.kind === 'etf')
  const ohneKosten = fonds.filter((eintrag) => !etfKosten[eintrag.symbol])
  console.log(`  ${fonds.length - ohneKosten.length} von ${fonds.length} hinterlegt.`)
  for (const eintrag of ohneKosten) {
    console.log(`  fehlt: ${eintrag.symbol.padEnd(22)} ISIN ${eintrag.isin ?? '—'}`)
  }
  /*
    Anbieter senken ihre Kosten regelmäßig. Eine zu hohe Angabe ist genauso
    falsch wie eine zu niedrige – nach zwei Jahren gehört jeder Wert erneut
    im Basisinformationsblatt nachgesehen.
  */
  const zweiJahre = new Date()
  zweiJahre.setFullYear(zweiJahre.getFullYear() - 2)
  for (const [symbol, kosten] of Object.entries(etfKosten)) {
    if (Date.parse(kosten.stand) < zweiJahre.getTime()) {
      console.log(`  alt:   ${symbol.padEnd(22)} Stand ${kosten.stand}`)
    }
  }

  console.log('\nMomentaufnahmen: wann zuletzt abgerufen')
  console.log('──────────────────────────────────────')
  for (const { datei, tage, stand } of pruefeMomentaufnahmen()) {
    console.log(`  ${datei.padEnd(26)} ${stand}  (${tage} Tage)`)
  }

  /*
    Und jetzt die andere Frage, die lange niemand gestellt hat.

    Oben steht, wann zuletzt **gefragt** wurde. Das sagt nichts darüber, wie alt
    die **Antwort** war: Die Inflationsreihe wurde bis Juli 2026 wöchentlich
    frisch abgerufen und lieferte dabei Werte vom Dezember 2025, weil die EZB
    den Datensatz eingestellt hatte, ohne ihn abzuschalten. Beide Zeilen sahen
    gesund aus, die Zahl auf der Website war ein halbes Jahr alt.
  */
  console.log('\nMomentaufnahmen: wie alt der jüngste Wert darin ist')
  console.log('──────────────────────────────────────────────────')
  const bestaende = new Map<string, unknown>()
  for (const grenze of REIHENGRENZEN) {
    if (bestaende.has(grenze.datei)) continue
    try {
      bestaende.set(
        grenze.datei,
        JSON.parse(readFileSync(join('data/snapshots', grenze.datei), 'utf8'))
      )
    } catch {
      /* Fehlt die Datei, wird die Reihe übergangen – so ist es gedacht. */
    }
  }
  for (const grenze of REIHENGRENZEN) {
    const bestand = bestaende.get(grenze.datei)
    const stand = bestand === undefined ? null : grenze.neuester(bestand)
    const alter = stand === null ? null : alterInTagen(stand, new Date())
    const anzeige =
      stand === null
        ? 'nicht gefunden'
        : `${stand}  (${alter ?? '?'} Tage, max ${grenze.hoechstalterTage})`
    console.log(`  ${grenze.reihe.padEnd(34)} ${anzeige}`)
  }

  const veraltet = pruefeReihenalter(bestaende)
  if (veraltet.length > 0) {
    console.log('')
    for (const befund of veraltet) {
      console.log(
        `  VERALTET  ${befund.reihe} (${befund.datei})\n` +
          `    jüngster Wert ${befund.stand}, das sind ${befund.alterTage} Tage – ` +
          `erlaubt sind ${befund.hoechstalterTage} bei einem Takt von ${befund.takt}.\n` +
          `    ${befund.begruendung}`
      )
    }
    console.log(
      '\n  Ein frischer Abruf ist kein frischer Wert. Wenn die Quelle mit Status 200\n' +
        '  antwortet und trotzdem nichts Neues liefert, ist der Datensatz vermutlich\n' +
        '  eingestellt oder umbenannt worden. Schlüssel gegen die Schnittstelle prüfen:\n' +
        '  npm run vertraege'
    )
  }

  console.log('')
  /*
    Was den Lauf scheitern lässt: Zahlen im Fließtext und tote Reihen.

    Ein überholter Stichtagswert ist eine Pflegeaufgabe, die von einer
    Bekanntmachung abhängt, und ein alter *Abruf* kann an einem Wochenende
    liegen – beides gehört gemeldet, aber keines ist ein Fehler im Bestand.
    Eine Reihe, die ihr Höchstalter überschreitet, ist einer: Dann steht auf der
    Website eine Zahl, die niemand mehr pflegt.
  */
  if (beanstandet.length > 0 || veraltet.length > 0) process.exitCode = 1
}

await main()
