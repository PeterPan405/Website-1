/**
 * Bringt den KI-Hinweis in den YouTube-Beschreibungen auf den heutigen Stand.
 *
 * ## Warum ein eigener Lauf
 *
 * Was in einer Folgenbeschreibung steht, wurde beim Upload hochgeladen und
 * lebt seitdem auf YouTube. Ändert sich der Text im Repository, ändert das an
 * den alten Videos nichts – sie tragen den Hinweis, der galt, als sie
 * entstanden.
 *
 * Am 10. August 2026 nachgesehen, acht Videos:
 *
 *     10.08.          der aktuelle Hinweis
 *     31.07.–07.08.   „Die Stimme in dieser Folge wurde mit künstlicher
 *                     Intelligenz erzeugt. Auswahl, Text und Einordnung
 *                     stammen von IM Invests."      (6 Folgen)
 *     30.07.          gar kein Hinweis
 *
 * Die mittlere Fassung sagt sinngemäß, der Text stamme von Menschen. Das war
 * einmal richtig und ist es seit dem 6. August nicht mehr – seither schreibt
 * ein Modell den Entwurf. Ein Hinweis, der die eigene Arbeitsweise falsch
 * beschreibt, ist schlechter als keiner.
 *
 * ## Was der Lauf anfasst – und was nicht
 *
 * **Nur den Hinweisabsatz.** Titel, Kapitelmarken, Hashtags, der
 * Haftungshinweis und alles andere bleiben Zeichen für Zeichen stehen. Wo der
 * Hinweis fehlt, wird er vor dem Haftungshinweis eingefügt; wo die alte
 * Fassung steht, wird sie ersetzt.
 *
 * `videos.update` verlangt das **ganze** `snippet` zurück: Wer nur die
 * Beschreibung schickt, löscht Titel, Kategorie und Schlagwörter. Deshalb
 * wird erst gelesen, dann das gelesene Objekt mit geänderter Beschreibung
 * zurückgeschrieben.
 *
 * ## Trockenlauf ist die Voreinstellung
 *
 * Der Lauf zeigt, was er ändern würde, und ändert nichts – bis `ANWENDEN=1`
 * gesetzt ist. Es geht um veröffentlichte Texte auf einem fremden Dienst;
 * die Vorschau kostet nichts und die Rücknahme wäre Handarbeit.
 *
 * Aufruf: `ANWENDEN=1 npm run hinweis`
 */

export {}

import { KI_HINWEIS } from '../lib/sprechfassung.ts'

/** Die Fassung, die bis zum 6. August 2026 unter jeder Folge stand. */
const ALTER_HINWEIS =
  'Hinweis: Die Stimme in dieser Folge wurde mit künstlicher Intelligenz ' +
  'erzeugt. Auswahl, Text und Einordnung stammen von IM Invests.'

/** Woran der Haftungshinweis zu erkennen ist – davor gehört der KI-Hinweis. */
const HAFTUNG_BEGINN = 'Hinweis: Dieser Podcast dient ausschließlich'

const ANWENDEN = process.env.ANWENDEN === '1'
const CLIENT_ID = process.env.YT_CLIENT_ID?.trim()
const CLIENT_SECRET = process.env.YT_CLIENT_SECRET?.trim()
const REFRESH_TOKEN = process.env.YT_REFRESH_TOKEN?.trim()

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.error('::error::[hinweis] Keine YouTube-Zugangsdaten hinterlegt.')
  process.exit(1)
}

/**
 * Die Beschreibung mit heutigem Hinweis – oder `null`, wenn nichts zu tun ist.
 *
 * Drei Fälle, in dieser Reihenfolge geprüft: Der heutige Hinweis steht schon
 * da; die alte Fassung steht da und wird ersetzt; keiner von beiden steht da
 * und der heutige wird eingesetzt.
 */
export function angeglichen(beschreibung: string): string | null {
  if (beschreibung.includes(KI_HINWEIS)) return null

  if (beschreibung.includes(ALTER_HINWEIS)) {
    return beschreibung.replace(ALTER_HINWEIS, KI_HINWEIS)
  }

  /*
    Kein Hinweis vorhanden. Er kommt vor den Haftungshinweis – dort steht er
    in jeder neueren Folge, und zwei Hinweise gehören zusammen.

    Fehlt auch der Haftungshinweis, wird angehängt statt geraten: Eine Stelle
    mitten im Fließtext zu erfinden, wäre schlimmer als ein Absatz am Ende.
  */
  const stelle = beschreibung.indexOf(HAFTUNG_BEGINN)
  if (stelle === -1) return `${beschreibung.trimEnd()}\n\n${KI_HINWEIS}\n`
  return beschreibung.slice(0, stelle) + KI_HINWEIS + '\n\n' + beschreibung.slice(stelle)
}

const tokenAntwort = (await (
  await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  })
).json()) as { access_token?: string }

if (!tokenAntwort.access_token) {
  console.error('::error::[hinweis] Anmeldung bei YouTube abgelehnt.')
  process.exit(1)
}

const kopf = { Authorization: `Bearer ${tokenAntwort.access_token}` }

const kanal = (await (
  await fetch(
    'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true',
    { headers: kopf }
  )
).json()) as {
  items?: { contentDetails?: { relatedPlaylists?: { uploads?: string } } }[]
}

const uploads = kanal.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
if (!uploads) {
  console.error('::error::[hinweis] Der Kanal nennt keine Upload-Liste.')
  process.exit(1)
}

const liste = (await (
  await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails` +
      `&playlistId=${encodeURIComponent(uploads)}&maxResults=50`,
    { headers: kopf }
  )
).json()) as { items?: { contentDetails?: { videoId?: string } }[] }

const kennungen = (liste.items ?? [])
  .map((eintrag) => eintrag.contentDetails?.videoId)
  .filter((id): id is string => Boolean(id))

interface Schnipsel {
  title?: string
  description?: string
  categoryId?: string
  tags?: string[]
  defaultLanguage?: string
  defaultAudioLanguage?: string
}

const einzelheiten = (await (
  await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${kennungen.join(',')}`,
    { headers: kopf }
  )
).json()) as { items?: { id: string; snippet?: Schnipsel }[] }

console.log(
  ANWENDEN
    ? `[hinweis] ${kennungen.length} Videos – Änderungen werden geschrieben.\n`
    : `[hinweis] ${kennungen.length} Videos – Trockenlauf, es wird nichts geändert.\n`
)

let geaendert = 0
let unveraendert = 0

for (const video of einzelheiten.items ?? []) {
  const snippet = video.snippet
  const alt = snippet?.description ?? ''
  const neu = angeglichen(alt)

  if (!snippet || neu === null) {
    unveraendert += 1
    console.log(`  ${video.id}  bereits aktuell  ${snippet?.title ?? ''}`)
    continue
  }

  geaendert += 1
  console.log(`  ${video.id}  wird angeglichen  ${snippet.title ?? ''}`)

  if (!ANWENDEN) continue

  /*
    Das gelesene `snippet` geht vollständig zurück, nur die Beschreibung ist
    ausgetauscht. `title` und `categoryId` sind bei `videos.update` Pflicht –
    fehlen sie, lehnt die Schnittstelle ab; fehlen `tags`, sind sie danach weg.
  */
  const antwort = await fetch(
    'https://www.googleapis.com/youtube/v3/videos?part=snippet',
    {
      method: 'PUT',
      headers: { ...kopf, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: video.id,
        snippet: { ...snippet, description: neu },
      }),
    }
  )

  if (!antwort.ok) {
    console.error(
      `::error::[hinweis] ${video.id} ließ sich nicht ändern ` +
        `(Status ${antwort.status}): ${await antwort.text()}`
    )
    process.exit(1)
  }
}

console.log(
  `\n[hinweis] ${geaendert} angeglichen, ${unveraendert} unverändert.` +
    (ANWENDEN || geaendert === 0 ? '' : '\n          Mit ANWENDEN=1 erneut starten.')
)
