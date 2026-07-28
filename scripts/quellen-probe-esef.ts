/**
 * Klopft `filings.xbrl.org` als Quelle für die europäischen Werte ab.
 *
 * ## Warum diese Quelle in Frage kommt
 *
 * Nach der SEC-Runde fehlen rund 280 Aktien. Der größte Block davon notiert in
 * der EU: Allianz, BMW, LVMH, Inditex, Enel, Ørsted, Kone – Unternehmen ohne
 * US-Notierung, die deshalb auch nichts bei der SEC einreichen.
 *
 * Sie reichen aber woanders etwas ein. Seit dem Geschäftsjahr 2021 gilt in der
 * EU das **European Single Electronic Format**: Jeder Emittent an einem
 * geregelten Markt muss seinen Konzernabschluss maschinenlesbar als XBRL
 * abgeben, ausgezeichnet nach `ifrs-full` – derselben Taxonomie, aus der dieses
 * Projekt bereits die IFRS-Melder der SEC liest. Die Pflicht liegt bei den
 * nationalen Sammelstellen, und XBRL International führt unter
 * `filings.xbrl.org` ein offenes Verzeichnis darüber.
 *
 * Das ist damit dieselbe Art von Quelle wie die SEC: amtlich veranlasst,
 * kostenfrei, ohne Schlüssel, und die Zahlen sind die des Unternehmens selbst
 * und nicht die Aufbereitung eines Anbieters.
 *
 * ## Was diese Sonde beantworten soll
 *
 * Drei Fragen, in dieser Reihenfolge:
 *
 * 1. Antwortet das Verzeichnis überhaupt, und wie viele Abschlüsse führt es?
 * 2. Wie viele der hier fehlenden Unternehmen stehen darin? Der Abgleich läuft
 *    wieder über den Namen – eine Kennung, die beide Seiten teilen, gibt es
 *    nicht.
 * 3. Stehen in einem einzelnen Abschluss die fünf gesuchten Größen, und in
 *    welcher Währung?
 *
 * Erst wenn alle drei mit Ja beantwortet sind, lohnt ein Abrufskript.
 *
 * Aufruf über `.github/workflows/quellen-probe.yml`; aus der
 * Entwicklungsumgebung ist außer npm und GitHub nichts erreichbar.
 */

import { readFile, writeFile } from 'node:fs/promises'

const VERZEICHNIS = 'https://filings.xbrl.org/api/filings'
const SNAPSHOT = 'data/snapshots/fundamentaldaten.json'
const KATALOG = ['data/markets.ts', 'data/markets-aktien.ts']
const BERICHT = 'esef-kandidaten.json'

const KOPFZEILEN = {
  'User-Agent': 'IM-Invests Datenabruf pm252543@gmail.com',
  Accept: 'application/vnd.api+json, application/json',
}

/** Rechtsformen und Beiwerk, die im Namensvergleich nichts zu suchen haben. */
const BEIWERK = new Set([
  'THE','AG','SE','NV','PLC','SA','SAB','SPA','AB','ASA','AS','OYJ','ABP','INC',
  'CORP','CORPORATION','CO','COMPANY','LTD','LIMITED','HOLDING','HOLDINGS',
  'GROUP','GROUPE','GRP','PUBLIC','GMBH','KGAA','BV','CV','NA','SASA','SPOLKA',
  'AKCYJNA','AKTIENGESELLSCHAFT','SOCIETE','ANONYME','KONZERN','SANV','SAB',
])

function normalisiere(name: string): string {
  return name
    .toUpperCase()
    .replace(/[ÄÀÁÂÃÅ]/g, 'A')
    .replace(/[ÖÒÓÔÕØ]/g, 'O')
    .replace(/[ÜÙÚÛ]/g, 'U')
    .replace(/[ÉÈÊË]/g, 'E')
    .replace(/[ÍÌÎÏ]/g, 'I')
    .replace(/Ç/g, 'C')
    .replace(/Ñ/g, 'N')
    .replace(/ß/g, 'SS')
    .replace(/&/g, ' AND ')
    .replace(/[^A-Z0-9]+/g, ' ')
    .split(' ')
    .filter((wort) => wort && !BEIWERK.has(wort))
    .join(' ')
    .trim()
}

interface Aktie {
  ticker: string
  name: string
  waehrung: string
}

async function katalog(): Promise<Aktie[]> {
  const aktien: Aktie[] = []
  for (const datei of KATALOG) {
    const text = await readFile(datei, 'utf8')
    for (const treffer of text.matchAll(
      /^\s*ticker: '([^']+)',\n\s*name: (?:'([^']*)'|"([^"]*)"),\n\s*kind: '([^']+)',\n\s*unit: '([^']+)',/gm
    )) {
      if (treffer[4] !== 'stock') continue
      aktien.push({
        ticker: treffer[1],
        name: treffer[2] ?? treffer[3],
        waehrung: treffer[5],
      })
    }
  }
  return aktien
}

async function hole(url: string): Promise<unknown | null> {
  try {
    const antwort = await fetch(url, { headers: KOPFZEILEN })
    if (!antwort.ok) {
      console.log(`  ${antwort.status} bei ${url}`)
      return null
    }
    return await antwort.json()
  } catch (fehler) {
    console.log(`  Fehler bei ${url}: ${fehler instanceof Error ? fehler.message : fehler}`)
    return null
  }
}

/** Ein Eintrag im Verzeichnis, so weit er hier gebraucht wird. */
interface Eintrag {
  id?: string
  attributes?: Record<string, unknown>
  relationships?: { entity?: { data?: { id?: string } } }
}
interface Seite {
  data?: Eintrag[]
  included?: { id?: string; type?: string; attributes?: Record<string, unknown> }[]
  links?: { next?: string }
  meta?: { count?: number }
}

async function main() {
  console.log('Frage 1: Antwortet das Verzeichnis?\n')

  const erste = (await hole(
    `${VERZEICHNIS}?page%5Bsize%5D=5&include=entity`
  )) as Seite | null
  if (!erste) {
    console.log('\nNein. Damit erübrigt sich der Rest.')
    return
  }

  console.log(`Ja. Gemeldete Gesamtzahl: ${erste.meta?.count ?? 'unbekannt'}`)
  console.log('\nAufbau eines Eintrags:')
  console.log(JSON.stringify(erste.data?.[0], null, 2).slice(0, 1200))
  console.log('\nAufbau eines mitgelieferten Unternehmens:')
  console.log(JSON.stringify(erste.included?.[0], null, 2).slice(0, 600))

  console.log('\n\nFrage 2: Wie viele der fehlenden Unternehmen stehen darin?\n')

  const aktien = await katalog()
  const snapshot = JSON.parse(await readFile(SNAPSHOT, 'utf8')) as {
    unternehmen: Record<string, unknown>
  }
  const haben = new Set(Object.keys(snapshot.unternehmen))
  const offen = aktien.filter((a) => !haben.has(a.ticker))
  console.log(`${offen.length} Aktien ohne Zahlen.`)

  /*
    Das ganze Verzeichnis durchblättern.

    Gefiltert wird nicht: Ein Filter nach Land hülfe nur, wenn feststünde, unter
    welchem Land ein Unternehmen einreicht – und das ist der Sitz der
    Sammelstelle, nicht der des Unternehmens.
  */
  const unternehmen = new Map<string, { name: string; land: string; letzte: string }>()
  let seite: string | null = `${VERZEICHNIS}?page%5Bsize%5D=500&include=entity`
  let seiten = 0

  while (seite && seiten < 60) {
    const antwort = (await hole(seite)) as Seite | null
    if (!antwort) break
    seiten += 1

    for (const e of antwort.included ?? []) {
      if (e.type !== 'entity') continue
      const name = String(e.attributes?.name ?? '')
      if (!name) continue
      const schluessel = normalisiere(name)
      if (!schluessel) continue
      if (!unternehmen.has(schluessel)) {
        unternehmen.set(schluessel, { name, land: '', letzte: '' })
      }
    }

    for (const f of antwort.data ?? []) {
      void f
    }

    seite = antwort.links?.next
      ? new URL(antwort.links.next, VERZEICHNIS).toString()
      : null
    await new Promise((fertig) => setTimeout(fertig, 150))
  }

  console.log(`${seiten} Seiten gelesen, ${unternehmen.size} verschiedene Unternehmen.`)

  const treffer: { ticker: string; name: string; verzeichnis: string }[] = []
  const daneben: Aktie[] = []
  for (const aktie of offen) {
    const gesucht = normalisiere(aktie.name)
    const gefunden =
      unternehmen.get(gesucht) ??
      [...unternehmen.entries()].find(
        ([k]) =>
          gesucht.length >= 5 && (k.startsWith(gesucht + ' ') || gesucht.startsWith(k + ' '))
      )?.[1]
    if (gefunden) treffer.push({ ticker: aktie.ticker, name: aktie.name, verzeichnis: gefunden.name })
    else daneben.push(aktie)
  }

  console.log(`\nGefunden: ${treffer.length} von ${offen.length}`)
  for (const t of treffer) console.log(`  ${t.ticker.padEnd(14)} ${t.name} = ${t.verzeichnis}`)
  console.log(`\nNicht gefunden: ${daneben.length}`)
  console.log(daneben.map((a) => a.ticker).join(' '))

  await writeFile(BERICHT, JSON.stringify({ treffer, daneben }, null, 2))
  console.log(`\nListe in ${BERICHT}.`)
}

await main()
