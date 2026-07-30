/**
 * Holt Bilanzkennzahlen bei der koreanischen Finanzaufsicht (DART).
 *
 * ## Warum diese Quelle
 *
 * Nach SEC, ESEF und Taipeh fehlen die koreanischen Werte fast vollständig –
 * 15 von 18, darunter Samsung Electronics. Das Open-DART-Portal der Financial
 * Supervisory Service stellt die Pflichtmeldungen aller notierten
 * Gesellschaften bereit, als JSON und gebührenfrei. Verlangt wird eine
 * Registrierung mit E-Mail-Adresse; der Schlüssel ist kostenlos.
 *
 * ## Warum das Skript ohne Schlüssel nichts tut
 *
 * Weil es ohne ihn nichts tun **kann** – die Schnittstelle antwortet mit
 * `013, 조회된 데이타가 없습니다` beziehungsweise einem Fehlerstatus. Ohne
 * `DART_API_KEY` bricht der Lauf deshalb nicht ab, sondern meldet die fehlende
 * Einstellung und endet erfolgreich. Genauso ist es beim Kursabruf mit
 * `TWELVEDATA_API_KEY` geregelt: Eine fehlende Zugangsdatei ist kein Fehler,
 * sondern ein Zustand.
 *
 * **Der Schlüssel gehört in die GitHub-Secrets**, nicht in eine Datei im
 * Repository und nicht in eine Chatnachricht. Protokolle von Workflow-Läufen
 * sind bei einem öffentlichen Repository für jeden lesbar; dieses Skript gibt
 * den Schlüssel deshalb an keiner Stelle aus.
 *
 * ## Wie die Zuordnung läuft
 *
 * DART kennt Unternehmen unter einem eigenen achtstelligen `corp_code`, diese
 * Website unter `005930.KS`. Die Brücke ist `stock_code`, das
 * sechsstellige Börsenkürzel – es steht im Verzeichnis `corpCode.xml`, das die
 * Aufsicht als ZIP ausliefert.
 *
 * ## Was übernommen wird und was nicht
 *
 * Aus dem Jahresabschluss (`reprt_code=11011`, Konzernabschluss `CFS`):
 * Umsatz, Jahresüberschuss, Eigenkapital. **Nicht** die Aktienzahl – sie steht
 * in einer anderen Meldung, und eine geratene Aktienzahl ergäbe einen falschen
 * Börsenwert. Wo sie fehlt, bleibt sie leer, und die Kennzahlentafel zeigt nur
 * das, was sie belegen kann.
 *
 * Geschrieben wird nur, was noch fehlt: Ein Titel, für den bereits Zahlen aus
 * SEC oder ESEF vorliegen, bleibt unangetastet. Diese Quellen sind geprüft, die
 * hier ist es noch nicht.
 *
 * Aufruf: `npm run dart`
 */

import { readFile, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

const SCHLUESSEL = process.env.DART_API_KEY?.trim() || undefined
const ZIEL = 'data/snapshots/fundamentaldaten.json'

const VERZEICHNIS_URL = 'https://opendart.fss.or.kr/api/corpCode.xml'
const ABSCHLUSS_URL = 'https://opendart.fss.or.kr/api/fnlttSinglAcntAll.json'

export const dartQuelle = {
  label: 'Financial Supervisory Service Korea (Open DART), Pflichtmeldungen',
  url: 'https://opendart.fss.or.kr/',
  abgrenzung:
    'Umsatz, Jahresüberschuss und Eigenkapital aus dem Konzernabschluss des Jahresberichts. Die Aktienzahl steht in einer anderen Meldung und wird hier nicht übernommen – ohne sie bleiben Börsenwert und die daraus gebildeten Kennzahlen leer.',
}

interface Kennzahlen {
  umsatz?: number
  gewinn?: number
  cashflow?: number
  eigenkapital?: number
  waehrung?: string
  aktien?: number
}

interface Momentaufnahme {
  abgerufenAm: string
  quelle: unknown
  unternehmen: Record<string, Kennzahlen>
  [weitere: string]: unknown
}

/** Ein Posten aus dem Abschluss, wie DART ihn liefert. */
export interface DartPosten {
  /** Kennung des Postens im Rechnungslegungsstandard, z. B. `ifrs-full_Revenue`. */
  account_id?: string
  /** Der ausgeschriebene Name, z. B. `수익(매출액)`. */
  account_nm?: string
  /** `BS` für Bilanz, `IS`/`CIS` für Gewinn- und Verlustrechnung. */
  sj_div?: string
  /** Betrag des laufenden Geschäftsjahres, als Text mit Tausenderpunkten. */
  thstrm_amount?: string
}

/**
 * Liest eine Betragsangabe von DART.
 *
 * Die Beträge kommen als Text mit Tausendertrennzeichen und – bei negativen
 * Werten – in runden Klammern statt mit Minus: `(1,234,567)`. Wer das mit
 * `Number()` liest, bekommt `NaN`, und ein `NaN` im Bestand macht aus einer
 * Kennzahl eine leere Zelle, ohne dass jemand erführe, warum.
 */
export function leseBetrag(roh: string | undefined): number | null {
  if (!roh) return null
  const text = roh.trim()
  if (text === '' || text === '-') return null

  const negativ = text.startsWith('(') && text.endsWith(')')
  const zahl = Number(text.replace(/[(),\s]/g, ''))
  if (!Number.isFinite(zahl)) return null
  return negativ ? -zahl : zahl
}

/**
 * Sucht den ersten Posten, dessen Kennung zu einem der Muster passt.
 *
 * Über `account_id` und nicht über den Namen: Die Namen stehen auf Koreanisch
 * und unterscheiden sich zwischen Unternehmen, die Kennungen folgen dem
 * IFRS-Schema. Wo ein Unternehmen eine eigene Kennung vergibt (`-표준계정코드
 * 미사용-`), greift der Namensvergleich als zweiter Weg.
 */
export function findePosten(
  posten: readonly DartPosten[],
  kennungen: readonly string[],
  namen: readonly string[] = []
): number | null {
  for (const kennung of kennungen) {
    const treffer = posten.find((eintrag) => eintrag.account_id === kennung)
    const wert = leseBetrag(treffer?.thstrm_amount)
    if (wert !== null) return wert
  }
  for (const name of namen) {
    const treffer = posten.find((eintrag) => eintrag.account_nm?.includes(name))
    const wert = leseBetrag(treffer?.thstrm_amount)
    if (wert !== null) return wert
  }
  return null
}

/** Wandelt die Postenliste eines Abschlusses in Kennzahlen um. */
export function werteAbschluss(posten: readonly DartPosten[]): Kennzahlen | null {
  const umsatz = findePosten(
    posten,
    ['ifrs-full_Revenue', 'ifrs_Revenue', 'ifrs-full_RevenueFromContractsWithCustomers'],
    ['매출액', '수익']
  )
  const gewinn = findePosten(
    posten,
    ['ifrs-full_ProfitLoss', 'ifrs_ProfitLoss'],
    ['당기순이익']
  )
  const eigenkapital = findePosten(
    posten,
    ['ifrs-full_Equity', 'ifrs_Equity'],
    ['자본총계']
  )

  /*
    Ohne wenigstens eine belegte Zahl entsteht kein Eintrag. Ein leerer
    Datensatz sähe im Bestand aus wie „geprüft, nichts gefunden“ – tatsächlich
    heißt er „nicht gelesen“, und das ist ein Unterschied.
  */
  if (umsatz === null && gewinn === null && eigenkapital === null) return null

  return {
    ...(umsatz !== null ? { umsatz } : {}),
    ...(gewinn !== null ? { gewinn } : {}),
    ...(eigenkapital !== null ? { eigenkapital } : {}),
    waehrung: 'KRW',
  }
}

/**
 * Liest die Zuordnung Börsenkürzel → `corp_code` aus dem Verzeichnis.
 *
 * Das Verzeichnis kommt als ZIP mit einer XML-Datei darin. Statt einen
 * ZIP-Leser mitzubringen, wird die XML-Struktur aus dem Rohpuffer gelesen: Die
 * Datei ist unkomprimiert lesbar, sobald man sie als Text betrachtet, und die
 * gesuchten Felder stehen als schlichte Tagpaare da. Schlägt das fehl, meldet
 * es der Lauf und bricht ab – ein halb gelesenes Verzeichnis führte zu
 * Zahlen unter falschen Kürzeln, und das wäre der schlimmste mögliche Ausgang.
 */
export function leseVerzeichnis(xml: string): Map<string, string> {
  const zuordnung = new Map<string, string>()
  for (const treffer of xml.matchAll(
    /<corp_code>\s*(\d{8})\s*<\/corp_code>[\s\S]*?<stock_code>\s*(\d{6})\s*<\/stock_code>/g
  )) {
    zuordnung.set(treffer[2], treffer[1])
  }
  return zuordnung
}

async function hole(url: string, felder: Record<string, string>): Promise<Response> {
  const adresse = new URL(url)
  for (const [name, wert] of Object.entries(felder)) {
    adresse.searchParams.set(name, wert)
  }
  /*
    Die Adresse trägt den Schlüssel. Sie darf deshalb nirgends ins Protokoll –
    weder bei Erfolg noch im Fehlerfall. Gemeldet wird nur der Statuscode.
  */
  return fetch(adresse, { headers: { 'User-Agent': 'IM-Invests Datenabruf' } })
}

async function main(): Promise<void> {
  if (!SCHLUESSEL) {
    console.log(
      '[dart] Kein DART_API_KEY hinterlegt – nichts zu tun.\n' +
        '       Der Schlüssel ist bei https://opendart.fss.or.kr/ kostenlos zu\n' +
        '       bekommen und gehört in die GitHub-Secrets, nicht ins Repository.'
    )
    return
  }

  const bestand = JSON.parse(await readFile(ZIEL, 'utf8')) as Momentaufnahme

  const { marketDefinitions } = await import('../data/markets.ts')
  const koreanisch = marketDefinitions.filter(
    (eintrag) => eintrag.kind === 'stock' && eintrag.sitzland === '410'
  )
  const offen = koreanisch.filter((eintrag) => !bestand.unternehmen[eintrag.ticker])

  console.log(
    `[dart] ${koreanisch.length} koreanische Titel, davon ${offen.length} ohne Zahlen.`
  )
  if (offen.length === 0) return

  const verzeichnisAntwort = await hole(VERZEICHNIS_URL, { crtfc_key: SCHLUESSEL })
  if (!verzeichnisAntwort.ok) {
    console.error(`[dart] Verzeichnis nicht abrufbar (${verzeichnisAntwort.status}).`)
    process.exitCode = 1
    return
  }
  const verzeichnis = leseVerzeichnis(
    Buffer.from(await verzeichnisAntwort.arrayBuffer()).toString('latin1')
  )
  console.log(`[dart] Verzeichnis: ${verzeichnis.size} Gesellschaften.`)
  if (verzeichnis.size === 0) {
    console.error(
      '[dart] Das Verzeichnis kam leer zurück – vermutlich liegt es komprimiert vor.\n' +
        '       Ohne Zuordnung wird nichts geschrieben; Zahlen unter falschen\n' +
        '       Kürzeln wären schlimmer als fehlende.'
    )
    process.exitCode = 1
    return
  }

  const jahr = String(new Date().getUTCFullYear() - 1)
  const neu: Record<string, Kennzahlen> = {}
  const ohneTreffer: string[] = []

  for (const eintrag of offen) {
    const boersenkuerzel = eintrag.ticker.replace(/\.KS$/, '')
    const corpCode = verzeichnis.get(boersenkuerzel)
    if (!corpCode) {
      ohneTreffer.push(`${eintrag.ticker} (nicht im Verzeichnis)`)
      continue
    }

    const antwort = await hole(ABSCHLUSS_URL, {
      crtfc_key: SCHLUESSEL,
      corp_code: corpCode,
      bsns_year: jahr,
      reprt_code: '11011',
      fs_div: 'CFS',
    })
    if (!antwort.ok) {
      ohneTreffer.push(`${eintrag.ticker} (Status ${antwort.status})`)
      continue
    }

    const gelesen = (await antwort.json()) as { status?: string; list?: DartPosten[] }
    if (gelesen.status !== '000' || !Array.isArray(gelesen.list)) {
      ohneTreffer.push(`${eintrag.ticker} (Antwortstatus ${gelesen.status ?? '—'})`)
      continue
    }

    const kennzahlen = werteAbschluss(gelesen.list)
    if (!kennzahlen) {
      ohneTreffer.push(`${eintrag.ticker} (keine verwertbaren Posten)`)
      continue
    }
    neu[eintrag.ticker] = kennzahlen
    console.log(`[dart] ${eintrag.ticker}: ${Object.keys(kennzahlen).join(', ')}`)

    // Die Aufsicht bittet um zurückhaltende Nutzung; eine Pause je Abruf.
    await new Promise((weiter) => setTimeout(weiter, 300))
  }

  if (ohneTreffer.length > 0) {
    console.log(`[dart] Ohne Ergebnis: ${ohneTreffer.join(', ')}`)
  }
  if (Object.keys(neu).length === 0) {
    console.log('[dart] Nichts Neues – Datei bleibt unberührt.')
    return
  }

  const ergebnis: Momentaufnahme = {
    ...bestand,
    abgerufenAm: new Date().toISOString(),
    // Nur ergänzen, nie überschreiben: SEC und ESEF sind geprüft, diese Quelle
    // ist neu. Bei einem Widerspruch gewinnt die ältere, bewährte Angabe.
    unternehmen: { ...neu, ...bestand.unternehmen },
    quelleDart: dartQuelle,
    dartKuerzel: Object.keys(neu),
  }
  await writeFile(ZIEL, `${JSON.stringify(ergebnis, null, 2)}\n`)
  console.log(
    `[dart] ${Object.keys(neu).length} Titel ergänzt, ` +
      `${Object.keys(ergebnis.unternehmen).length} Unternehmen insgesamt in ${ZIEL}.`
  )
}

/*
  Nur ausführen, wenn dieses Skript direkt aufgerufen wurde.

  Ohne diese Wache lief `main()` auch beim Importieren – und `tests/dart.test.ts`
  importiert die Datei, um das Lesen der Beträge zu prüfen. Ohne Schlüssel war
  das folgenlos, weil `main()` sofort zurückkehrt. Mit gesetztem `DART_API_KEY`
  hätte ein Testlauf dagegen die Aufsicht angefragt und den Kennzahlenbestand
  überschrieben: ein Test, der Daten verändert.
*/
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}
