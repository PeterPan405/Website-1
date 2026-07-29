/**
 * Warum drei nordische Abschlüsse keine Zahlen hergeben.
 *
 * ## Der offene Rest
 *
 * Beim ESEF-Abruf sind Ørsted, Vestas und Coloplast als „liefert keine
 * auswertbaren Fakten“ zurückgestellt worden. Sie stehen im Verzeichnis, ihr
 * Name passt, und trotzdem kam nichts an. Das ist kein Zustand: Entweder es
 * gibt einen Weg, dann gehört er eingebaut, oder es gibt keinen, dann gehört
 * der Grund aufgeschrieben.
 *
 * ## Was diese Sonde zeigt
 *
 * Für jeden der drei den vollständigen Verzeichniseintrag – welche Adressen
 * dabeistehen, ob `json_url` überhaupt gefüllt ist – und, falls ja, den Anfang
 * der Datei samt der Begriffe, die am häufigsten darin vorkommen. Daran lässt
 * sich ablesen, ob die Abschlüsse nach `ifrs-full` ausgezeichnet sind oder nach
 * einer eigenen Erweiterung.
 *
 * Aufruf über `.github/workflows/quellen-probe.yml`.
 */

const VERZEICHNIS = 'https://filings.xbrl.org/api/filings'

const KOPFZEILEN = {
  'User-Agent': 'IM-Invests Datenabruf pm252543@gmail.com',
  Accept: 'application/vnd.api+json, application/json',
}

const GESUCHT = ['ØRSTED', 'VESTAS', 'COLOPLAST', 'CARLSBERG', 'NOVOZYMES']

interface Eintrag {
  id?: string
  attributes?: Record<string, unknown>
  relationships?: { entity?: { data?: { id?: string } } }
}
interface Seite {
  data?: Eintrag[]
  included?: { id?: string; type?: string; attributes?: Record<string, unknown> }[]
  links?: { next?: string }
}

async function hole(url: string): Promise<unknown | null> {
  try {
    const antwort = await fetch(url, {
      headers: KOPFZEILEN,
      signal: AbortSignal.timeout(60_000),
    })
    if (!antwort.ok) {
      console.log(`  ${antwort.status} bei ${url}`)
      await antwort.body?.cancel()
      return null
    }
    return await antwort.json()
  } catch (fehler) {
    console.log(`  Fehler: ${fehler instanceof Error ? fehler.message : fehler}`)
    return null
  }
}

async function main() {
  console.log('Suche die nordischen Einträge im Verzeichnis …\n')

  const namen = new Map<string, string>()
  const treffer: { name: string; attribute: Record<string, unknown> }[] = []

  let seite: string | null = `${VERZEICHNIS}?page%5Bsize%5D=500&include=entity`
  let seiten = 0

  while (seite && seiten < 60) {
    const antwort = (await hole(seite)) as Seite | null
    if (!antwort) break
    seiten += 1

    for (const e of antwort.included ?? []) {
      if (e.type !== 'entity' || !e.id) continue
      const name = String(e.attributes?.name ?? '')
      if (name) namen.set(e.id, name)
    }

    for (const f of antwort.data ?? []) {
      const entitaet = f.relationships?.entity?.data?.id
      if (!entitaet) continue
      const name = namen.get(entitaet)
      if (!name) continue
      const gross = name.toUpperCase()
      if (!GESUCHT.some((wort) => gross.includes(wort))) continue
      treffer.push({ name, attribute: f.attributes ?? {} })
    }

    seite = antwort.links?.next
      ? new URL(antwort.links.next, VERZEICHNIS).toString()
      : null
    await new Promise((fertig) => setTimeout(fertig, 120))
  }

  console.log(`${seiten} Seiten gelesen, ${treffer.length} passende Abschlüsse.\n`)

  for (const eintrag of treffer) {
    console.log(`\n── ${eintrag.name}`)
    for (const [feld, wert] of Object.entries(eintrag.attribute)) {
      if (typeof wert === 'string' || typeof wert === 'number' || wert === null) {
        console.log(`   ${feld}: ${wert === null ? '— (leer)' : wert}`)
      }
    }

    const json = eintrag.attribute.json_url
    if (typeof json !== 'string' || !json) {
      console.log('   → keine json_url. Damit ist der Abschluss nur als Paket da.')
      continue
    }

    const bericht = (await hole(
      new URL(json, 'https://filings.xbrl.org/').toString()
    )) as {
      facts?: Record<string, { dimensions?: Record<string, string> }>
    } | null
    if (!bericht) {
      console.log('   → json_url steht da, liefert aber nichts.')
      continue
    }

    const fakten = Object.values(bericht.facts ?? {})
    console.log(`   → ${fakten.length} Fakten in der Datei.`)

    /*
      Die Häufigkeit der Namensräume beantwortet die eigentliche Frage: Ein
      Abschluss, der fast nur eigene Begriffe verwendet, ist zwar formal
      ausgezeichnet, aber nicht mit `ifrs-full` auswertbar.
    */
    const raeume = new Map<string, number>()
    for (const fakt of fakten) {
      const begriff = fakt.dimensions?.concept ?? ''
      const raum = begriff.includes(':') ? begriff.split(':')[0] : '(ohne)'
      raeume.set(raum, (raeume.get(raum) ?? 0) + 1)
    }
    const sortiert = [...raeume.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
    console.log(`   → Namensräume: ${sortiert.map(([r, n]) => `${r} ${n}×`).join(', ')}`)

    for (const gesucht of ['Revenue', 'ProfitLoss', 'Equity']) {
      const anzahl = fakten.filter(
        (fakt) => fakt.dimensions?.concept === `ifrs-full:${gesucht}`
      ).length
      console.log(`   → ifrs-full:${gesucht}: ${anzahl}×`)
    }
  }

  console.log(
    '\n\nZu lesen ist das so: Fehlt `json_url`, gibt es die Datei nicht – dann bliebe'
  )
  console.log('nur das Paket, und das auszupacken wäre ein eigener Weg. Stehen dagegen')
  console.log('Fakten darin, aber keine mit `ifrs-full`, ist der Abschluss vollständig')
  console.log('in einer eigenen Erweiterung ausgezeichnet und für diese Zwecke nutzlos.')
}

await main()

export {}
