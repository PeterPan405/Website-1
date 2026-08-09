/**
 * Nimmt eine veröffentlichte Folge wieder zurück: von YouTube gelöscht,
 * aus dem Register entfernt, damit sie aus dem Feed und von Spotify
 * verschwindet.
 *
 * ## Warum es das gibt
 *
 * Am 9. August 2026 lagen zwei Videos desselben Tages auf dem Kanal – ein
 * verspäteter Zeitplan hatte den Lauf ein zweites Mal gestartet, nachdem
 * ein Handstart die Folge längst hochgeladen hatte. Das Register kannte
 * nur die zweite; die erste hing verwaist im Kanal.
 *
 * Von Hand ist das in der YouTube-Oberfläche zwar schnell erledigt, aber
 * die Hälfte der Arbeit: Der Eintrag im Register bleibt stehen, der Feed
 * verweist weiter auf eine Folge, und Spotify zeigt sie noch. Beides
 * gehört zusammen, also steht es an einer Stelle.
 *
 * ## Was zurückgenommen wird
 *
 *     DATUM=2026-08-09        die Folge dieses Tages (Register + YouTube)
 *     VIDEOS=abc123,def456    zusätzliche Videokennungen, die kein
 *                             Registereintrag mehr nennt – die verwaisten
 *
 * Beides lässt sich einzeln benutzen. Ohne `DATUM` wird nur gelöscht, was
 * unter `VIDEOS` steht; ohne `VIDEOS` nur, was am Datum hängt.
 *
 * ## Was **nicht** passiert
 *
 * Die MP3 auf dem Server bleibt liegen. Sie ist nach dem Entfernen aus dem
 * Register von nirgendwo mehr verlinkt und kostet ein paar Megabyte; sie
 * zu löschen bräuchte den SSH-Zugang, und ein fehlgeschlagener SSH-Schritt
 * dürfte die Rücknahme nicht aufhalten. Wer aufräumen will, tut es auf dem
 * Server.
 *
 * ## Löschen ist endgültig
 *
 * YouTube kennt keinen Papierkorb für die Schnittstelle. Deshalb nennt der
 * Lauf jede Kennung, bevor er sie löscht, und bricht bei einer abgelehnten
 * Löschung ab, statt weiterzumachen.
 *
 * Aufruf: DATUM=2026-08-09 npm run zuruecknehmen
 */

import { readFileSync, writeFileSync } from 'node:fs'

const CLIENT_ID = process.env.YT_CLIENT_ID?.trim()
const CLIENT_SECRET = process.env.YT_CLIENT_SECRET?.trim()
const REFRESH_TOKEN = process.env.YT_REFRESH_TOKEN?.trim()

const DATUM = process.env.DATUM?.trim() ?? ''
const VIDEOS = (process.env.VIDEOS ?? '')
  .split(/[,\s]+/)
  .map((eintrag) => eintrag.trim())
  .filter(Boolean)

/*
  **Zwei Dateien, nicht eine.** Das ist der Fehler vom 9. August 2026: Die
  Rücknahme räumte nur das Register auf, und auf `/podcast/` stand die Folge
  danach weiter – mit einem Knopf „Diese Folge auf YouTube", hinter dem nichts
  mehr lag. Aufgefallen ist es dem Betreiber auf der Website, nicht der
  Technik.

  Der Unterschied zwischen beiden:

  - **Das Register** ist die eigene Wahrheit. Aus ihm entsteht der RSS-Feed,
    den Spotify abonniert.
  - **Die Momentaufnahme** ist das, was `npm run podcast` von YouTube geholt
    hat. Sie füllt die Seite `/podcast/`.

  Ein gelöschtes Video verschwindet aus der Momentaufnahme erst beim nächsten
  Abruf – und der kommt zu spät, wenn er überhaupt kommt. Wer eine Folge
  zurücknimmt, nimmt sie aus beiden.
*/
const REGISTER = 'data/podcast-eigener-feed.json'
const MOMENTAUFNAHME = 'data/snapshots/podcast.json'

interface Folge {
  datum: string
  titel: string
  youtubeId?: string
}

interface Register {
  folgen: Folge[]
}

if (!DATUM && VIDEOS.length === 0) {
  console.error(
    '::error::Weder DATUM noch VIDEOS gesetzt – es gibt nichts zurückzunehmen.'
  )
  process.exit(1)
}

const register = JSON.parse(readFileSync(REGISTER, 'utf8')) as Register

/* Erst sammeln, dann löschen. So steht im Protokoll vollständig, was
   gleich verschwindet – und wenn nichts zusammenkommt, hört der Lauf auf,
   bevor er sich bei YouTube anmeldet. */
const betroffen = DATUM ? register.folgen.filter((folge) => folge.datum === DATUM) : []

const kennungen = [
  ...betroffen.map((folge) => folge.youtubeId).filter((id): id is string => Boolean(id)),
  ...VIDEOS,
]
const zuLoeschen = [...new Set(kennungen)]

if (DATUM) {
  if (betroffen.length === 0) {
    console.log(`[zurücknehmen] Im Register steht keine Folge vom ${DATUM}.`)
  } else {
    for (const folge of betroffen) {
      console.log(`[zurücknehmen] Register: „${folge.titel}" vom ${folge.datum}`)
    }
  }
}
for (const id of zuLoeschen) {
  console.log(`[zurücknehmen] YouTube: ${id} wird gelöscht – das ist endgültig.`)
}

/*
  Hier stand bis zum 9. August 2026 ein `process.exit(0)`, sobald das Register
  nichts Betroffenes enthielt. Genau das war die Falle: Am 9. August war das
  Register längst sauber und die Momentaufnahme nicht – der Lauf hätte
  „nichts zu tun" gemeldet und die Folge auf der Website stehengelassen.

  Ein vorzeitiges Aufhören darf sich nur auf **eine** von mehreren Stellen
  stützen, wenn es alle kennt. Deshalb hört der Lauf hier nicht mehr auf; er
  überspringt nur die Anmeldung bei YouTube, wenn es dort nichts zu löschen
  gibt. Aufräumen tut er in jedem Fall.
*/
if (zuLoeschen.length > 0) {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.error(
      '::error::[zurücknehmen] Videos zu löschen, aber keine YouTube-Zugangsdaten hinterlegt.\n' +
        '          Ohne sie bliebe das Video online, während der Eintrag verschwindet – ' +
        'das wäre schlechter als gar nichts zu tun.'
    )
    process.exit(1)
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
    console.error('::error::[zurücknehmen] Anmeldung bei YouTube abgelehnt.')
    process.exit(1)
  }

  for (const id of zuLoeschen) {
    const antwort = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${tokenAntwort.access_token}` },
      }
    )

    /* 204 heißt gelöscht, 404 heißt „war schon weg". Beides ist der
       gewünschte Zustand; nur alles andere ist ein Fehler. */
    if (antwort.status === 204) {
      console.log(`[zurücknehmen] ${id} gelöscht.`)
    } else if (antwort.status === 404) {
      console.log(`[zurücknehmen] ${id} gibt es nicht (mehr) – in Ordnung.`)
    } else {
      console.error(
        `::error::[zurücknehmen] ${id} ließ sich nicht löschen: ` +
          `${antwort.status} ${await antwort.text()}`
      )
      process.exit(1)
    }
  }
}

/**
 * Nimmt die Folge aus einer der beiden Dateien.
 *
 * Der Filter fragt **beides** ab – Datum und Videokennung. Nur nach dem
 * Datum zu gehen reicht nicht: Wer eine Folge über `VIDEOS` zurücknimmt,
 * ohne dass sie im Register steht (etwa ein Doppel-Upload), bekäme sonst das
 * Video gelöscht und den Eintrag stehengelassen.
 */
function ausmisten(pfad: string, name: string): void {
  let inhalt: string
  try {
    inhalt = readFileSync(pfad, 'utf8')
  } catch {
    console.log(`[zurücknehmen] ${name} gibt es nicht – nichts zu tun.`)
    return
  }

  const datei = JSON.parse(inhalt) as { folgen?: Folge[] }
  if (!Array.isArray(datei.folgen)) {
    console.log(`[zurücknehmen] ${name} führt keine Folgenliste – nichts zu tun.`)
    return
  }

  const vorher = datei.folgen.length
  datei.folgen = datei.folgen.filter(
    (folge) =>
      !(
        (DATUM && folge.datum === DATUM) ||
        (folge.youtubeId && kennungen.includes(folge.youtubeId))
      )
  )
  const entfernt = vorher - datei.folgen.length

  if (entfernt === 0) {
    console.log(`[zurücknehmen] In ${name} stand nichts Betroffenes.`)
    return
  }

  writeFileSync(pfad, `${JSON.stringify(datei, null, 2)}\n`)
  console.log(
    `[zurücknehmen] ${entfernt} Eintrag/Einträge aus ${name} entfernt – ` +
      `es bleiben ${datei.folgen.length}.`
  )
}

ausmisten(REGISTER, 'dem Register')
ausmisten(MOMENTAUFNAHME, 'der Momentaufnahme')
