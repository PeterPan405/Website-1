/**
 * Holt Bilanzkennzahlen bei der Börse Taipeh.
 *
 * ## Warum ein dritter Weg
 *
 * Nach SEC und ESEF fehlen noch rund 190 Aktien. Die Sonde
 * `quellen-probe-asien.ts` hat für sie alle erreichbaren Aufsichtsstellen
 * abgeklopft, und genau eine antwortet ohne Schlüssel und mit brauchbaren
 * Daten: die Taiwan Stock Exchange. Sie stellt die Pflichtangaben aller
 * notierten Gesellschaften als offene Daten bereit.
 *
 * Die übrigen sind zu:
 *
 * - **Japan (EDINET)** – `401, invalid subscription key`. Ein kostenloser
 *   Schlüssel ist erhältlich; ihn zu beantragen ist eine Entscheidung des
 *   Betreibers, keine technische Frage.
 * - **Korea (DART)** – dasselbe Bild, Schlüssel nötig.
 * - **Hongkong, Indien** – Website beziehungsweise `403`.
 * - **Deutschland** – weder Unternehmensregister noch Bundesanzeiger haben
 *   eine offene Schnittstelle. Das ist die größte verbleibende Lücke, und sie
 *   ist von hier aus nicht zu schließen.
 *
 * ## Die Aktienzahl – hier ausnahmsweise exakt
 *
 * Taiwanesische Gesellschaften geben das eingezahlte Kapital und den Nennwert
 * je Aktie an. Beides zusammen ergibt die Aktienzahl ohne Umweg:
 *
 *     Aktienzahl = eingezahltes Kapital / Nennwert je Aktie
 *
 * Der Nennwert steht als Text da („新臺幣 10.0000元“, also 10 Neue
 * Taiwan-Dollar), das eingezahlte Kapital in Tausend. Beides wird unten
 * herausgelesen.
 *
 * ## Warum Umsatz und Gewinn oft fehlen
 *
 * Weil die Tabelle quartalsweise geführt wird und `季別` das Quartal nennt.
 * Ein Quartalsumsatz unter der Überschrift „Umsatz“ ergäbe ein
 * Kurs-Umsatz-Verhältnis, das um den Faktor vier danebenliegt. Übernommen wird
 * deshalb nur das vierte Quartal – in Taiwan ist das die kumulierte
 * Jahreszahl. In den ersten drei Quartalen eines Jahres bleiben Umsatz und
 * Gewinn deshalb leer, und es stehen nur Börsenwert und
 * Kurs-Buchwert-Verhältnis da. Eine unvollständige Tafel ist besser als eine
 * falsche.
 *
 * Aufruf: `npm run taiwan`
 */

import { readFile, writeFile } from 'node:fs/promises'

const BASIS = 'https://openapi.twse.com.tw/v1/opendata'
const ZIEL = 'data/snapshots/fundamentaldaten.json'

const KOPFZEILEN = {
  'User-Agent': 'IM-Invests Datenabruf pm252543@gmail.com',
  Accept: 'application/json',
}

/**
 * Die Zuordnung ergibt sich aus dem Kürzel selbst.
 *
 * `2330.TW` ist die Gesellschaft mit der Nummer 2330 – dieselbe Nummer, unter
 * der die Börse sie führt. Anders als bei SEC und ESEF braucht es hier keinen
 * Namensabgleich und damit auch keine Liste von Hand: Eine Verwechslung ist
 * ausgeschlossen, weil beide Seiten dieselbe amtliche Nummer benutzen.
 */
function nummerAus(ticker: string): string | null {
  const treffer = /^(\d{4})\.TW$/.exec(ticker)
  return treffer ? treffer[1] : null
}

interface Satz {
  [feld: string]: string | undefined
}

async function hole(pfad: string): Promise<Satz[]> {
  const antwort = await fetch(`${BASIS}/${pfad}`, {
    headers: KOPFZEILEN,
    signal: AbortSignal.timeout(120_000),
  })
  if (!antwort.ok) {
    await antwort.body?.cancel()
    throw new Error(`${antwort.status} bei ${pfad}`)
  }
  const gelesen: unknown = await antwort.json()
  if (!Array.isArray(gelesen)) throw new Error(`${pfad} liefert keine Liste`)
  return gelesen as Satz[]
}

/** Eine Zahl aus einem Feld, das als Text mit Tausendertrennung kommt. */
function zahl(wert: string | undefined): number | null {
  if (!wert) return null
  const bereinigt = wert.replace(/,/g, '').trim()
  if (!bereinigt) return null
  const gelesen = Number(bereinigt)
  return Number.isFinite(gelesen) ? gelesen : null
}

/** Aus „新臺幣 10.0000元“ wird 10. */
function nennwert(wert: string | undefined): number | null {
  if (!wert) return null
  const treffer = /(\d+(?:\.\d+)?)/.exec(wert.replace(/,/g, ''))
  if (!treffer) return null
  const gelesen = Number(treffer[1])
  return Number.isFinite(gelesen) && gelesen > 0 ? gelesen : null
}

interface Momentaufnahme {
  abgerufenAm: string
  quelle: { label: string; url: string; abgrenzung: string }
  unternehmen: Record<string, Record<string, unknown>>
  quelleEsef?: { label: string; url: string; abgrenzung: string }
  esefKuerzel?: string[]
  quelleTwse?: { label: string; url: string; abgrenzung: string }
  twseKuerzel?: string[]
}

/** Die Kürzel, die dieses Projekt an der Börse Taipeh führt. */
async function taiwanKuerzel(): Promise<string[]> {
  const text = await readFile('data/markets-aktien.ts', 'utf8')
  const kuerzel = new Set<string>()
  for (const treffer of text.matchAll(/ticker: '(\d{4}\.TW)'/g)) kuerzel.add(treffer[1])
  return [...kuerzel].sort()
}

async function main() {
  const kuerzel = await taiwanKuerzel()
  console.log(`${kuerzel.length} Werte an der Börse Taipeh im Katalog.\n`)
  if (kuerzel.length === 0) return

  const [erfolg, bilanz, stammdaten] = await Promise.all([
    hole('t187ap06_L_ci'),
    hole('t187ap07_L_ci'),
    hole('t187ap03_L'),
  ])
  console.log(
    `Gewinnrechnung: ${erfolg.length} Sätze, Bilanz: ${bilanz.length}, Stammdaten: ${stammdaten.length}\n`
  )

  const nachNummer = <T extends Satz>(liste: T[]) =>
    new Map(liste.map((satz) => [String(satz['公司代號'] ?? ''), satz]))

  const erfolgJe = nachNummer(erfolg)
  const bilanzJe = nachNummer(bilanz)
  const stammJe = nachNummer(stammdaten)

  const alt = JSON.parse(await readFile(ZIEL, 'utf8')) as Momentaufnahme
  const uebernommen: string[] = []
  const ohne: string[] = []

  for (const ticker of kuerzel) {
    const nummer = nummerAus(ticker)
    if (!nummer) continue

    const stamm = stammJe.get(nummer)
    const b = bilanzJe.get(nummer)
    const e = erfolgJe.get(nummer)

    /*
      Zwei Tabellen, zwei Einheiten – und das ist die Stelle, an der der erste
      Lauf danebenlag.

      Die Bilanz führt ihre Beträge in Tausend, die Stammdaten das eingezahlte
      Kapital in vollen Neuen Taiwan-Dollar. Wer beide gleich behandelt,
      bekommt für TSMC 25,9 Billionen Aktien statt 25,9 Milliarden – tausendmal
      zu viel, und weil Umsatz und Gewinn im laufenden Jahr fehlen, schlägt
      dabei keine der Bewertungsgrenzen an. Aufgefallen ist es an der
      Marktkapitalisierung; seitdem prüft `tests/fundamentalplausibel.test.ts`
      auch die.
    */
    const kapital = zahl(stamm?.['實收資本額'])
    const proAktie = nennwert(stamm?.['普通股每股面額'])
    const aktien =
      kapital !== null && proAktie !== null ? Math.round(kapital / proAktie) : null

    const eigenkapital = zahl(b?.['權益總額']) ?? zahl(b?.['權益總計'])

    /*
      Nur die kumulierte Jahreszahl. Steht dort ein anderes Quartal, bleiben
      Umsatz und Gewinn leer – siehe die Erklärung oben.
    */
    const jahreszahl = e?.['季別'] === '4'
    const umsatz = jahreszahl ? zahl(e?.['營業收入']) : null
    const gewinn = jahreszahl
      ? (zahl(e?.['母公司業主（淨利／損）']) ?? zahl(e?.['本期淨利（淨損）']))
      : null

    if (aktien === null || eigenkapital === null) {
      ohne.push(
        `${ticker} (${aktien === null ? 'keine Aktienzahl' : 'kein Eigenkapital'})`
      )
      continue
    }

    const eintrag: Record<string, unknown> = {
      waehrung: 'TWD',
      // Die Tabellen führen alle Beträge in Tausend.
      eigenkapital: eigenkapital * 1000,
      aktien,
    }
    if (umsatz !== null) eintrag.umsatz = umsatz * 1000
    if (gewinn !== null) eintrag.gewinn = gewinn * 1000

    alt.unternehmen[ticker] = eintrag
    uebernommen.push(ticker)

    const mio = (wert: unknown) =>
      typeof wert === 'number' ? (wert / 1e6).toFixed(0).padStart(10) : '         –'
    console.log(
      `${ticker.padEnd(9)} Ums${mio(eintrag.umsatz)} Gew${mio(eintrag.gewinn)}` +
        ` EK${mio(eintrag.eigenkapital)} Aktien${(aktien / 1e6).toFixed(0).padStart(8)} Mio.` +
        `  Quartal ${e?.['季別'] ?? '?'}/${e?.['年度'] ?? '?'}`
    )
  }

  console.log(`\n${uebernommen.length} von ${kuerzel.length} übernommen.`)
  if (ohne.length > 0) console.log(`Ohne Zahlen: ${ohne.join(', ')}`)

  const ergebnis: Momentaufnahme = {
    ...alt,
    abgerufenAm: new Date().toISOString(),
    unternehmen: Object.fromEntries(
      Object.entries(alt.unternehmen).sort(([a], [b]) => a.localeCompare(b))
    ),
    quelleTwse: {
      label: 'Taiwan Stock Exchange, offene Daten der Pflichtangaben',
      url: 'https://openapi.twse.com.tw/',
      abgrenzung:
        'Eigenkapital und Aktienzahl aus den Pflichtangaben der notierten Gesellschaften; die Aktienzahl aus eingezahltem Kapital und Nennwert je Aktie. Umsatz und Gewinn nur, wenn die Jahreszahl vorliegt – die Tabelle wird quartalsweise geführt, und ein Quartalsumsatz wäre als Jahreswert um den Faktor vier falsch.',
    },
    twseKuerzel: uebernommen.sort(),
  }

  await writeFile(ZIEL, `${JSON.stringify(ergebnis, null, 2)}\n`)
  console.log(
    `\n${Object.keys(ergebnis.unternehmen).length} Unternehmen insgesamt in ${ZIEL}.`
  )
}

await main()
