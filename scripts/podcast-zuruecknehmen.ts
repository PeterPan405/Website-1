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

const REGISTER = 'data/podcast-eigener-feed.json'

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

if (zuLoeschen.length === 0 && betroffen.length === 0) {
  console.log('[zurücknehmen] Nichts gefunden – nichts zu tun.')
  process.exit(0)
}

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

if (betroffen.length > 0) {
  register.folgen = register.folgen.filter((folge) => folge.datum !== DATUM)
  writeFileSync(REGISTER, `${JSON.stringify(register, null, 2)}\n`)
  console.log(
    `[zurücknehmen] ${betroffen.length} Eintrag/Einträge aus dem Register entfernt – ` +
      `es bleiben ${register.folgen.length}.`
  )
}
