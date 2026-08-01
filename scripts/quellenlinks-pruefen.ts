import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

import { newsArticles } from '../data/news.ts'
import type { DailyEdition } from '../data/editions/types.ts'

/**
 * Prüft, ob die Quellen-Links des Nachrichtenarchivs noch erreichbar sind.
 *
 * ## Warum es diese Prüfung gibt
 *
 * Das Archiv ist dauerhaft – ein einmal veröffentlichter Artikel bleibt, samt
 * seiner Belege. Die Belege sind aber fremde Adressen, und fremde Adressen
 * sterben: Portale räumen um, Agenturmeldungen verfallen, Pressebereiche
 * ziehen um. Der Artikel behauptet dann weiter „nachprüfbar über diese
 * Quelle“, und der Klick endet im Nichts. Genau dieses Versprechen ist der
 * rechtliche und redaktionelle Grund, warum die Zusammenfassungen zulässig
 * sind – es soll nicht still verfallen.
 *
 * ## Was gemeldet wird – und was nicht
 *
 * Gemeldet wird, was mit 404 oder 410 antwortet: Das ist die Aussage „gibt es
 * nicht mehr“. Alles andere – 403, 429, Zeitüberschreitungen, Bot-Sperren –
 * ist eine Aussage über den Abrufweg, nicht über die Seite, und erzeugt hier
 * bewusst keinen Fehlschlag. Eine Prüfung, die bei jeder Laune eines
 * Bot-Schutzes rot wird, wird nach zwei Wochen ignoriert; eine, die nur bei
 * echtem Verfall anschlägt, behält ihre Bedeutung.
 *
 * Der Lauf braucht freien Netzzugang und gehört deshalb auf einen
 * GitHub-Läufer (`quellenlinks.yml`), nicht in die Entwicklungsumgebung –
 * die erreicht nur GitHub.
 *
 * Aufruf: `node --experimental-strip-types scripts/quellenlinks-pruefen.ts`
 * Mit `--nur-sammeln` werden die Adressen nur gezählt und gelistet (das geht
 * auch ohne Netz und dient dem lokalen Test der Sammellogik).
 */

const NUR_SAMMELN = process.argv.includes('--nur-sammeln')

/** Abstand zwischen zwei Abrufen – fremde Server, fremde Regeln. */
const ABSTAND_MS = 400

/**
 * Die Tagesausgaben einzeln laden statt über ihren Index.
 *
 * Der Index importiert seine Dateien ohne Endung – für den Bundler richtig,
 * für `node --experimental-strip-types` unauflösbar. Die Testsuite liest ihn
 * aus demselben Grund als Text. Hier werden die Ausgabedateien direkt aus dem
 * Ordner geladen; ob Index und Ordner übereinstimmen, prüft bereits
 * `tests/editions.test.ts`.
 */
async function ladeAusgaben(): Promise<DailyEdition[]> {
  const ordner = join(import.meta.dirname, '..', 'data', 'editions')
  const dateien = readdirSync(ordner)
    .filter((name) => /^\d{4}-\d{2}-\d{2}\.ts$/.test(name))
    .sort()
  const ausgaben: DailyEdition[] = []
  for (const datei of dateien) {
    const modul = await import(pathToFileURL(join(ordner, datei)).href)
    ausgaben.push(modul.edition)
  }
  return ausgaben
}

function sammleAdressen(ausgaben: DailyEdition[]): Map<string, string[]> {
  /* Adresse → wo sie verwendet wird. Eine Adresse kann in mehreren
     Artikeln stehen; gemeldet wird sie einmal, mit allen Fundstellen. */
  const fundstellen = new Map<string, string[]>()
  const merke = (url: string, wo: string) => {
    const liste = fundstellen.get(url) ?? []
    liste.push(wo)
    fundstellen.set(url, liste)
  }

  for (const artikel of newsArticles) {
    for (const quelle of artikel.sources) merke(quelle.url, `/news/${artikel.slug}`)
  }
  for (const ausgabe of ausgaben) {
    for (const teil of [...ausgabe.top, ...ausgabe.further]) {
      for (const quelle of teil.sources) merke(quelle.url, `/news/tag/${ausgabe.date}`)
    }
  }
  return fundstellen
}

async function pruefe(url: string): Promise<number | 'stumm'> {
  /*
    GET statt HEAD: Etliche Portale beantworten HEAD mit 404 oder 405, obwohl
    die Seite existiert – die Prüfung würde Verfall melden, wo nur das
    Werkzeug abgewiesen wurde.
  */
  try {
    const antwort = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(20000),
    })
    return antwort.status
  } catch {
    return 'stumm'
  }
}

const fundstellen = sammleAdressen(await ladeAusgaben())
console.log(`${fundstellen.size} eindeutige Quellen-Adressen im Archiv.`)

if (NUR_SAMMELN) {
  for (const [url, wo] of fundstellen) {
    console.log(`  ${url}  (${wo.length} Fundstelle${wo.length === 1 ? '' : 'n'})`)
  }
  process.exit(0)
}

let verfallen = 0
let unklar = 0

for (const [url, wo] of fundstellen) {
  const status = await pruefe(url)
  if (status === 404 || status === 410) {
    verfallen++
    console.error(`TOT  ${status}  ${url}`)
    for (const stelle of wo) console.error(`           verwendet in ${stelle}`)
  } else if (status === 'stumm' || status >= 400) {
    /* Kein Fehlschlag – siehe Kopfkommentar. Aber sichtbar, damit ein Muster
       auffällt, bevor es zum 404 wird. */
    unklar++
    console.log(`?    ${status}  ${url}`)
  } else {
    console.log(`OK   ${status}  ${url}`)
  }
  await new Promise((fertig) => setTimeout(fertig, ABSTAND_MS))
}

console.log(
  `\n${fundstellen.size - verfallen - unklar} erreichbar, ${unklar} unklar (Sperre oder stumm), ${verfallen} verfallen.`
)

if (verfallen > 0) {
  console.error(
    '\nVerfallene Belege gehören ersetzt: Meist findet sich dieselbe Meldung\n' +
      'unter neuer Adresse oder bei einer zweiten Quelle. Der Austausch gehört\n' +
      'als Eintrag in das korrekturen-Feld des Artikels.'
  )
  process.exit(1)
}
