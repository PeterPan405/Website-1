/**
 * Klopft ab, ob `filings.xbrl.org` die deutschen Abschlüsse führt.
 *
 * ## Warum diese Sonde nötig ist
 *
 * Die erste ESEF-Runde hat 98 Unternehmen zugeordnet – Airbus, L'Oréal, Enel,
 * Ørsted, Kone, Erste Group, OMV. Kein einziges deutsches. In der Zuordnung in
 * `scripts/esef-abrufen.ts` steht deshalb kein einziger `.DE`-Ticker, obwohl
 * Allianz, BMW, SAP, Siemens und zwanzig weitere im Katalog stehen und
 * derselben ESEF-Pflicht unterliegen wie ein französischer Emittent.
 *
 * Für dieses Loch gibt es zwei mögliche Erklärungen, und sie führen zu
 * gegensätzlichen Schlüssen:
 *
 * 1. **Die Abschlüsse fehlen im Verzeichnis.** Dann ist nichts nachzutragen,
 *    und es braucht eine andere Quelle.
 * 2. **Sie stehen darin, aber unter Namen, die der Abgleich nicht trifft.**
 *    Dann fehlt nur die Zuordnung, und die lässt sich nachtragen.
 *
 * Der Unterschied ist nicht zu erraten, und geraten wird hier nichts: Eine
 * Zuordnungstabelle aus vermuteten Namen zusammenzuschreiben hieße, den
 * Zahlen eines möglicherweise gleichnamigen anderen Unternehmens einen Platz
 * auf einer Aktienseite zu geben. Genau dagegen steht die Tabelle in
 * `esef-abrufen.ts` – Nestlé traf dort die US-Finanzierungstochter, Volvo die
 * Volvo Car, SEB einen Hersteller von Haushaltsgeräten.
 *
 * ## Was die Sonde beantwortet
 *
 * 1. Wie verteilen sich die geführten Abschlüsse auf die Länder? Steht `DE`
 *    darunter, und mit wie vielen?
 * 2. Welche der deutschen Aktien ohne Zahlen lassen sich einem Eintrag
 *    zuordnen – und in welchem Land reicht dieser Eintrag ein?
 * 3. Wenn nichts zu finden ist: Antwortet das Unternehmensregister, das die
 *    deutschen ESEF-Meldungen entgegennimmt, auf einen unangemeldeten Abruf?
 *
 * Ausgegeben wird eine Kandidatenliste als Artefakt. Sie ist **kein**
 * Ergebnis, sondern die Grundlage für eine Zuordnung von Hand: Jeder Eintrag
 * gehört nachgesehen, bevor er in `esef-abrufen.ts` wandert.
 *
 * Aufruf über `.github/workflows/quellen-probe.yml`; aus der
 * Entwicklungsumgebung ist außer npm und GitHub nichts erreichbar.
 */

import { readFile, writeFile } from 'node:fs/promises'

const VERZEICHNIS = 'https://filings.xbrl.org/api/filings'
const SNAPSHOT = 'data/snapshots/fundamentaldaten.json'
const KATALOG = ['data/markets.ts', 'data/markets-aktien.ts']
const BERICHT = 'esef-kandidaten-de.json'

/** Die deutschen Sammelstellen, die als Ausweichquelle in Frage kämen. */
const AUSWEICHSTELLEN = [
  ['Unternehmensregister', 'https://www.unternehmensregister.de/ureg/'],
  ['Bundesanzeiger', 'https://www.bundesanzeiger.de/pub/de/start'],
  ['BaFin-Meldungen', 'https://portal.mvp.bafin.de/database/AnleiheInfo/'],
] as const

const KOPFZEILEN = {
  'User-Agent': 'IM-Invests Datenabruf pm252543@gmail.com',
  Accept: 'application/vnd.api+json, application/json',
}

/**
 * Rechtsformen und Beiwerk, die im Namensvergleich nichts zu suchen haben.
 *
 * Gegenüber der ersten Sonde um die deutschen Formen erweitert: `AG & CO`,
 * `KGAA`, `STIFTUNG`, `VORMALS`. „Merck KGaA“ und „Merck Kommanditgesellschaft
 * auf Aktien“ sind dasselbe Unternehmen, und ohne diese Wörter fällt es auf.
 */
const BEIWERK = new Set([
  'THE',
  'AG',
  'SE',
  'NV',
  'PLC',
  'SA',
  'SPA',
  'AB',
  'ASA',
  'AS',
  'OYJ',
  'ABP',
  'INC',
  'CORP',
  'CORPORATION',
  'CO',
  'COMPANY',
  'LTD',
  'LIMITED',
  'HOLDING',
  'HOLDINGS',
  'GROUP',
  'GRP',
  'GMBH',
  'KGAA',
  'KG',
  'KOMMANDITGESELLSCHAFT',
  'AKTIEN',
  'AUF',
  'STIFTUNG',
  'VORMALS',
  'BV',
  'AKTIENGESELLSCHAFT',
  'EUROPAEA',
  'SOCIETAS',
  'DEUTSCHE',
  'DEUTSCHLAND',
])

function normalisiere(name: string): string {
  return name
    .toUpperCase()
    .replace(/[ÄÀÁÂÃÅ]/g, 'A')
    .replace(/[ÖÒÓÔÕØ]/g, 'O')
    .replace(/[ÜÙÚÛ]/g, 'U')
    .replace(/[ÉÈÊË]/g, 'E')
    .replace(/[ÍÌÎÏ]/g, 'I')
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
}

async function katalog(): Promise<Aktie[]> {
  const aktien: Aktie[] = []
  for (const datei of KATALOG) {
    const text = await readFile(datei, 'utf8')
    for (const treffer of text.matchAll(
      /^\s*ticker: '([^']+)',\n\s*name: (?:'([^']*)'|"([^"]*)"),\n\s*kind: '([^']+)',/gm
    )) {
      if (treffer[4] !== 'stock') continue
      aktien.push({ ticker: treffer[1], name: treffer[2] ?? treffer[3] })
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
    console.log(
      `  Fehler bei ${url}: ${fehler instanceof Error ? fehler.message : fehler}`
    )
    return null
  }
}

interface Eintrag {
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
  console.log('Frage 1: Wie verteilen sich die Abschlüsse auf die Länder?\n')

  /*
    Das ganze Verzeichnis durchblättern und dabei zweierlei mitschreiben: das
    Land je Abschluss und den Namen je Unternehmen samt der Länder, in denen es
    einreicht. Das Land eines Abschlusses ist der Sitz der Sammelstelle – nicht
    zwingend der des Unternehmens –, und genau diese Unterscheidung ist hier
    die Frage.
  */
  const jeLand = new Map<string, number>()
  const unternehmen = new Map<
    string,
    { name: string; laender: Set<string>; letzte: string }
  >()
  const nachId = new Map<string, string>()

  let seite: string | null = `${VERZEICHNIS}?page%5Bsize%5D=500&include=entity`
  let seiten = 0
  let abschluesse = 0

  while (seite && seiten < 80) {
    const antwort = (await hole(seite)) as Seite | null
    if (!antwort) break
    seiten += 1

    for (const e of antwort.included ?? []) {
      if (e.type !== 'entity' || !e.id) continue
      const name = String(e.attributes?.name ?? '')
      if (name) nachId.set(e.id, name)
    }

    for (const f of antwort.data ?? []) {
      abschluesse += 1
      const land = String(f.attributes?.country ?? '??')
      jeLand.set(land, (jeLand.get(land) ?? 0) + 1)

      const id = f.relationships?.entity?.data?.id
      const name = id ? nachId.get(id) : undefined
      if (!name) continue
      const schluessel = normalisiere(name)
      if (!schluessel) continue

      const bestand = unternehmen.get(schluessel)
      const ende = String(f.attributes?.period_end ?? '')
      if (bestand) {
        bestand.laender.add(land)
        if (ende > bestand.letzte) bestand.letzte = ende
      } else {
        unternehmen.set(schluessel, {
          name,
          laender: new Set([land]),
          letzte: ende,
        })
      }
    }

    seite = antwort.links?.next
      ? new URL(antwort.links.next, VERZEICHNIS).toString()
      : null
    await new Promise((fertig) => setTimeout(fertig, 150))
  }

  console.log(
    `${seiten} Seiten, ${abschluesse} Abschlüsse, ${unternehmen.size} Unternehmen.\n`
  )
  const sortiert = [...jeLand.entries()].sort((a, b) => b[1] - a[1])
  for (const [land, zahl] of sortiert) {
    console.log(`  ${land.padEnd(4)} ${String(zahl).padStart(5)}`)
  }
  const deutsche = jeLand.get('DE') ?? 0
  console.log(
    `\nAbschlüsse mit Land DE: ${deutsche}${
      deutsche === 0
        ? ' – das erklärt die Lücke. Deutschland reicht über das Unternehmensregister ein, und dessen Bestand fließt nicht in dieses Verzeichnis.'
        : ' – die Lücke liegt also am Namensabgleich, nicht am Bestand.'
    }`
  )

  console.log('\n\nFrage 2: Welche deutschen Aktien lassen sich zuordnen?\n')

  const aktien = await katalog()
  const snapshot = JSON.parse(await readFile(SNAPSHOT, 'utf8')) as {
    unternehmen: Record<string, unknown>
  }
  const haben = new Set(Object.keys(snapshot.unternehmen))
  const offen = aktien.filter((a) => a.ticker.endsWith('.DE') && !haben.has(a.ticker))
  console.log(`${offen.length} deutsche Aktien ohne Zahlen.\n`)

  const treffer: {
    ticker: string
    name: string
    verzeichnis: string
    laender: string[]
    letzte: string
  }[] = []
  const daneben: Aktie[] = []

  for (const aktie of offen) {
    const gesucht = normalisiere(aktie.name)
    const gefunden =
      unternehmen.get(gesucht) ??
      [...unternehmen.entries()].find(
        ([k]) =>
          gesucht.length >= 5 &&
          (k.startsWith(`${gesucht} `) || gesucht.startsWith(`${k} `))
      )?.[1]

    if (gefunden) {
      treffer.push({
        ticker: aktie.ticker,
        name: aktie.name,
        verzeichnis: gefunden.name,
        laender: [...gefunden.laender],
        letzte: gefunden.letzte,
      })
    } else {
      daneben.push(aktie)
    }
  }

  console.log(`Kandidaten: ${treffer.length} von ${offen.length}`)
  for (const t of treffer) {
    console.log(
      `  ${t.ticker.padEnd(10)} ${t.name} = ${t.verzeichnis} [${t.laender.join(',')}] bis ${t.letzte}`
    )
  }
  console.log(`\nOhne Kandidat: ${daneben.map((a) => a.ticker).join(' ')}`)
  console.log(
    '\nAchtung: Ein Kandidat ist keine Zuordnung. Jeder Name gehört nachgesehen,' +
      ' bevor er in die Tabelle in scripts/esef-abrufen.ts wandert – die dortige' +
      ' Kommentarspalte nennt sieben Verwechslungen, die genau so entstanden wären.'
  )

  if (treffer.length === 0) {
    console.log('\n\nFrage 3: Antworten die deutschen Sammelstellen?\n')
    for (const [name, url] of AUSWEICHSTELLEN) {
      try {
        const antwort = await fetch(url, {
          headers: { 'User-Agent': KOPFZEILEN['User-Agent'] },
        })
        console.log(
          `  ${name.padEnd(22)} ${antwort.status} ${antwort.headers.get('content-type') ?? ''}`
        )
      } catch (fehler) {
        console.log(
          `  ${name.padEnd(22)} nicht erreichbar: ${fehler instanceof Error ? fehler.message : fehler}`
        )
      }
    }
    console.log(
      '\nEine antwortende Startseite ist noch keine Schnittstelle. Was hier zählt,' +
        ' ist eine maschinenlesbare Liste ohne Anmeldung – gibt es die nicht, bleibt' +
        ' die Lücke bestehen und wird auf /quellen ausgewiesen.'
    )
  }

  await writeFile(
    BERICHT,
    JSON.stringify({ jeLand: Object.fromEntries(sortiert), treffer, daneben }, null, 2)
  )
  console.log(`\nListe in ${BERICHT}.`)
}

await main()
