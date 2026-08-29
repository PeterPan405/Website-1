/**
 * Veröffentlicht das Karussell der jüngsten Tagesausgabe bei @im_invests.
 *
 * Aufruf:  npm run instagram            – Trockenlauf, es geht nichts hinaus
 *          VEROEFFENTLICHEN=ja npm run instagram
 *
 * ## Der Weg bei Meta hat drei Stufen
 *
 * Ein Karussell entsteht nicht in einem Zug. Meta verlangt:
 *
 *   1. je Bild einen **Behälter** (`is_carousel_item=true`) → Kennung
 *   2. einen **Sammelbehälter** (`media_type=CAROUSEL`) mit diesen Kennungen
 *      und der Beschriftung → Kennung
 *   3. **Veröffentlichen** (`media_publish`) mit der Sammelkennung
 *
 * Erst Schritt 3 macht den Beitrag sichtbar. Die Schritte 1 und 2 lassen sich
 * also fahren, ohne dass jemand etwas sieht – genau das tut der Trockenlauf
 * nicht, denn auch ein unveröffentlichter Behälter kostet Kontingent. Er hört
 * vorher auf.
 *
 * ## Meta holt die Bilder selbst
 *
 * Übergeben wird eine **Adresse**, keine Datei. Die Bilder müssen also
 * öffentlich erreichbar sein, bevor dieser Lauf startet – sie entstehen beim
 * Bau unter `/instagram/1.jpg` und liegen nach der Übertragung auf dem
 * Webspace.
 *
 * Daraus folgt die Reihenfolge im Workflow: **erst bauen und übertragen, dann
 * veröffentlichen.** Wer das dreht, schickt Meta auf Adressen, die es noch
 * nicht gibt, und bekommt einen Beitrag mit Lücken oder gar keinen.
 *
 * ## Warum der Trockenlauf die Voreinstellung ist
 *
 * Ein Beitrag bei Instagram ist nicht zurückzunehmen, nur zu löschen – und
 * gesehen haben ihn dann schon welche. Der Lauf muss deshalb ausdrücklich
 * scharf gestellt werden. Dieselbe Vorsicht wie beim Podcast-Upload.
 */

import { existsSync, readFileSync } from 'node:fs'

import { datumLang } from '../lib/datum-lang.ts'

const API = 'https://graph.facebook.com/v21.0'

const TOKEN = process.env.IG_ACCESS_TOKEN?.trim() ?? ''
const KONTO = process.env.IG_USER_ID?.trim() ?? ''
const SCHARF = process.env.VEROEFFENTLICHEN?.trim().toLowerCase() === 'ja'
const BASIS = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://iminvests.de').replace(
  /\/+$/,
  ''
)

/**
 * Der Tag, für den dieser Lauf gilt – Vorgabe oder heute.
 *
 * `STICHTAG` setzt der Workflow nicht; das Feld gibt es für den Fall, dass
 * jemand einen Beitrag für einen bestimmten Tag nachreichen will, und für die
 * Prüfung von Hand.
 */
const STICHTAG = process.env.STICHTAG?.trim() || new Date().toISOString().slice(0, 10)

/**
 * Beendet den Lauf, ohne ihn rot zu machen.
 *
 * Ein Beitrag, der heute nicht hinausgeht, weil er schon draußen ist oder
 * weil die Website noch die Ausgabe von gestern zeigt, ist kein Fehler – es
 * ist der Riegel, der arbeitet. Rot wäre hier eine Mail an jedem Tag, an dem
 * alles richtig läuft, und nach zwei Wochen sieht sie niemand mehr an.
 */
function haltAn(grund: string): never {
  melde('')
  melde(grund)
  melde('Es geht nichts hinaus. Das ist kein Fehler.')
  process.exit(0)
}

function melde(text: string): void {
  console.log(`[instagram] ${text}`)
}

/**
 * Ein Aufruf an die Graph-Schnittstelle, mit sprechendem Fehler.
 *
 * Meta antwortet auf fast jeden Fehler mit `200` und einem `error`-Feld im
 * Rumpf – wer nur den Statuscode ansieht, hält einen Fehlschlag für Erfolg.
 */
async function graph(
  pfad: string,
  felder: Record<string, string>
): Promise<Record<string, unknown>> {
  const rumpf = new URLSearchParams({ ...felder, access_token: TOKEN })
  const antwort = await fetch(`${API}/${pfad}`, { method: 'POST', body: rumpf })
  const daten = (await antwort.json()) as Record<string, unknown>

  const fehler = daten.error as { message?: string; code?: number } | undefined
  if (fehler) {
    throw new Error(
      `Meta lehnt ab (${fehler.code ?? '?'}): ${fehler.message ?? 'ohne Grund'}`
    )
  }
  if (!antwort.ok) {
    throw new Error(`Meta antwortet mit ${antwort.status}.`)
  }
  return daten
}

/**
 * Wartet, bis Meta ein Bild geholt und verarbeitet hat.
 *
 * `media_publish` auf einen Behälter, der noch `IN_PROGRESS` ist, scheitert.
 * Meta lädt das Bild von der übergebenen Adresse – das dauert, und wie lange,
 * hängt an ihrem Server, nicht an unserem.
 */
async function warteAufFertig(kennung: string, sekunden = 60): Promise<void> {
  const frist = Date.now() + sekunden * 1000
  while (Date.now() < frist) {
    const antwort = await fetch(
      `${API}/${kennung}?fields=status_code&access_token=${encodeURIComponent(TOKEN)}`
    )
    const daten = (await antwort.json()) as {
      status_code?: string
      error?: { message?: string }
    }
    if (daten.error) throw new Error(`Zustand nicht lesbar: ${daten.error.message}`)
    if (daten.status_code === 'FINISHED') return
    if (daten.status_code === 'ERROR') {
      throw new Error(`Meta konnte das Bild nicht verarbeiten (Behälter ${kennung}).`)
    }
    await new Promise((r) => setTimeout(r, 3000))
  }
  throw new Error(`Behälter ${kennung} wurde in ${sekunden} s nicht fertig.`)
}

// ---------------------------------------------------------------- Vorbereiten

if (!existsSync('out/instagram')) {
  melde('Kein Verzeichnis out/instagram – erst `npm run build`, dann dieser Lauf.')
  process.exit(1)
}

const { readdirSync } = await import('node:fs')
const kacheln = readdirSync('out/instagram')
  .filter((n) => /^\d+\.jpg$/.test(n))
  .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))

if (kacheln.length < 2) {
  melde(`Nur ${kacheln.length} Kachel(n) – ein Karussell braucht mindestens zwei.`)
  process.exit(1)
}
if (kacheln.length > 10) {
  // Instagram nimmt höchstens zehn. Mehr wäre ein Fehler, der erst bei Meta
  // auffiele – also hier abfangen, wo der Grund noch sichtbar ist.
  melde(`${kacheln.length} Kacheln – Instagram nimmt höchstens zehn.`)
  process.exit(1)
}

/*
  Die Beschriftung kommt aus demselben Bau wie die Kacheln
  (`app/instagram/beschriftung.txt/route.ts`). Fehlt sie, wird ohne Text
  veröffentlicht – ein Beitrag ohne Beschriftung ist mager, aber kein Grund,
  die Bilder zurückzuhalten.
*/
const TEXTDATEI = 'out/instagram/beschriftung.txt'
const beschriftung = existsSync(TEXTDATEI) ? readFileSync(TEXTDATEI, 'utf8').trim() : ''

const adressen = kacheln.map((n) => `${BASIS}/instagram/${n}`)

melde(`${kacheln.length} Kacheln, Basis ${BASIS}`)
for (const a of adressen) melde(`  ${a}`)

/*
  Riegel 1: Zeigt die Website überhaupt schon die Ausgabe von heute?

  Meta holt die Bilder **selbst** von `iminvests.de`. Die Adressen sind jeden
  Tag dieselben – `/instagram/1.jpg` und so weiter –, und sie antworten immer.
  Läuft dieser Schritt, bevor der Paketbau den neuen Stand übertragen hat,
  liefert der Server die Kacheln von **gestern**, Meta holt sie anstandslos,
  und der Beitrag geht mit den Schlagzeilen von gestern hinaus.

  Das wäre kein roter Lauf, sondern ein stiller Fehler: Alles meldet Erfolg,
  und nur die 1.680 Leute im Feed sehen, dass etwas nicht stimmt.

  Geprüft wird deshalb der einzige Zeuge, der den Tag kennt: die erste Zeile
  der Beschriftung, die derselbe Bau erzeugt hat wie die Kacheln. Steht dort
  nicht der erwartete Tag, ist die Übertragung noch nicht durch.
*/
const erwartet = `${datumLang(STICHTAG)} –`
const ersteZeile = beschriftung.split('\n')[0]?.trim() ?? ''

if (!beschriftung) {
  haltAn(
    'Unter /instagram/beschriftung.txt liegt nichts. Ohne sie lässt sich nicht ' +
      'feststellen, von welchem Tag die Kacheln sind.'
  )
}
if (!ersteZeile.startsWith(erwartet)) {
  haltAn(
    `Die Website zeigt noch nicht den ${STICHTAG}.\n` +
      `[instagram]   erwartet: ${erwartet} …\n` +
      `[instagram]   gefunden: ${ersteZeile}\n` +
      '[instagram] Der Paketbau ist noch nicht übertragen – ein Beitrag jetzt trüge ' +
      'die Schlagzeilen von gestern.'
  )
}
melde(`Die Website zeigt den ${STICHTAG}: ${ersteZeile}`)

if (!SCHARF) {
  melde('')
  melde('Trockenlauf – es geht nichts hinaus.')
  melde('Scharf stellen mit VEROEFFENTLICHEN=ja.')
  process.exit(0)
}

/*
  Der zweite Weg: über einen Dienst, der eine genehmigte Meta-App mitbringt.

  ## Warum es ihn gibt

  Der direkte Weg braucht ein Meta-Entwicklerkonto. Am 29. August 2026 ließ
  sich keines anlegen: Die Registrierung hängt an einer SMS-Bestätigung, und
  Meta verweigerte sie – auf mehreren Geräten, mit dem Hinweis, das Gerät
  werde normalerweise nicht benutzt. Gegen diese Sperre hilft kein Code.

  Dienste wie Make bringen ihre eigene, von Meta genehmigte App mit; eigene
  Zugangsdaten sind dort ausdrücklich optional. Übergeben wird ein Haken
  (`MAKE_WEBHOOK_URL`), an dem die fertigen Adressen und die Beschriftung
  hängen – veröffentlicht wird dort.

  ## Was dieser Weg nicht kann

  **Riegel 2 fehlt hier.** Ohne Token lässt sich der Kanal von hier aus nicht
  fragen, ob der Beitrag von heute schon steht. Diese Prüfung gehört deshalb
  in das Szenario beim Dienst – dort liegt die Verbindung, die den Kanal lesen
  darf. Wer das Szenario ohne sie baut, bekommt an jedem Tag so viele
  Beiträge, wie der Paketbau läuft.

  Der Riegel 1 oben greift auch hier: Er hängt an der Website, nicht am Token.
*/
const HAKEN = process.env.MAKE_WEBHOOK_URL?.trim() ?? ''

if (!TOKEN || !KONTO) {
  if (!HAKEN) {
    melde('Weder IG_ACCESS_TOKEN/IG_USER_ID noch MAKE_WEBHOOK_URL gesetzt.')
    melde('Der eine Weg steht in EINRICHTUNG.md 3.4/3.5, der andere in 3.11.')
    process.exit(1)
  }

  if (!HAKEN.startsWith('https://')) {
    // Der Haken bekommt die Beschriftung und die Adressen. Über `http://`
    // ginge beides im Klartext durch fremde Netze – dieselbe Vorsicht wie bei
    // `ANTHROPIC_BASE_URL`.
    melde('MAKE_WEBHOOK_URL ist nicht https:// – abgebrochen.')
    process.exit(1)
  }

  melde('')
  melde('Kein eigenes Token – der Beitrag geht über den Haken beim Dienst.')

  const antwort = await fetch(HAKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stichtag: STICHTAG, beschriftung, bilder: adressen }),
  })
  const rumpf = (await antwort.text()).trim()

  if (!antwort.ok) {
    melde(`Der Dienst antwortet mit ${antwort.status}: ${rumpf.slice(0, 200)}`)
    process.exit(1)
  }

  melde(`Übergeben (${antwort.status}): ${rumpf.slice(0, 200) || '(leere Antwort)'}`)
  melde('')
  melde('Ob daraus ein Beitrag wurde, sagt das Protokoll beim Dienst –')
  melde('von hier aus ist nur die Übergabe belegt, nicht die Veröffentlichung.')
  process.exit(0)
}

/*
  Riegel 2: Steht der Beitrag von heute schon bei Instagram?

  Der Lauf hängt an der Kette und hat daneben einen Rückfalltermin. Beide
  können am selben Tag greifen; ein Beitrag ist aber nicht zurückzunehmen,
  nur zu löschen, und gesehen haben ihn dann schon welche.

  **Gefragt wird der Kanal selbst, nicht ein Register im Repository.** Das ist
  dieselbe Lehre wie beim Podcast-Upload: Ein Riegel ist so gut wie die
  Quelle, die er fragt. Ein Vermerk in einer Datei sagt, dass wir gepostet zu
  haben glauben – der Kanal sagt, ob dort etwas steht.

  Verglichen wird der Kalendertag der Zeitstempel. Meta liefert sie mit
  Zeitzonen-Anhang; die ersten zehn Zeichen sind der Tag in UTC, und in dieser
  Zeitzone rechnet auch `STICHTAG`. Der Beitrag geht morgens gegen 4 Uhr
  deutscher Zeit hinaus, also 2 Uhr UTC – von einer Tagesgrenze weit genug
  entfernt, dass die Umrechnung nichts verschiebt.
*/
const bestand = await fetch(
  `${API}/${KONTO}/media?fields=timestamp,permalink&limit=10` +
    `&access_token=${encodeURIComponent(TOKEN)}`
)
const bestandDaten = (await bestand.json()) as {
  data?: { timestamp?: string; permalink?: string }[]
  error?: { message?: string; code?: number }
}

if (bestandDaten.error) {
  // Hier **nicht** stillschweigend weiterlaufen: Wer den Bestand nicht lesen
  // kann, kann auch nicht wissen, ob er doppelt postet. Das ist der Fall, in
  // dem ein roter Lauf richtig ist – meist ein abgelaufenes Token.
  melde(
    `Der Bestand ist nicht lesbar (${bestandDaten.error.code ?? '?'}): ` +
      `${bestandDaten.error.message ?? 'ohne Grund'}`
  )
  melde('Ohne ihn lässt sich ein doppelter Beitrag nicht ausschließen.')
  process.exit(1)
}

const schonHeute = (bestandDaten.data ?? []).find(
  (m) => (m.timestamp ?? '').slice(0, 10) === STICHTAG
)
if (schonHeute) {
  haltAn(
    `Für den ${STICHTAG} steht schon ein Beitrag im Kanal: ` +
      `${schonHeute.permalink ?? '(ohne Adresse)'}`
  )
}
melde(`Im Kanal steht für den ${STICHTAG} noch nichts.`)

// ---------------------------------------------------------------- Hochladen

melde('')
const kennungen: string[] = []
for (const [i, adresse] of adressen.entries()) {
  const antwort = await graph(`${KONTO}/media`, {
    image_url: adresse,
    is_carousel_item: 'true',
  })
  const kennung = String(antwort.id)
  await warteAufFertig(kennung)
  kennungen.push(kennung)
  melde(`Kachel ${i + 1}/${adressen.length} bei Meta: ${kennung}`)
}

const sammel = await graph(`${KONTO}/media`, {
  media_type: 'CAROUSEL',
  children: kennungen.join(','),
  ...(beschriftung ? { caption: beschriftung } : {}),
})
const sammelKennung = String(sammel.id)
await warteAufFertig(sammelKennung, 120)
melde(`Sammelbehälter: ${sammelKennung}`)

const veroeffentlicht = await graph(`${KONTO}/media_publish`, {
  creation_id: sammelKennung,
})

melde('')
melde(`Veröffentlicht: ${String(veroeffentlicht.id)}`)
melde('https://www.instagram.com/im_invests/')
