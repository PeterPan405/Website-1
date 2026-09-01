/**
 * Holt die Spotify-Adresse jeder Folge und schreibt sie nach
 * `data/podcast-spotify.json`.
 *
 * ## Warum das nicht aus dem Feed kommt
 *
 * Weil es dort nicht steht. Der Feed ist das, was **wir** senden; die Adresse
 * `open.spotify.com/episode/…` vergibt Spotify beim Einlesen. Sie lässt sich
 * nicht ausrechnen und nicht erraten – nur erfragen.
 *
 * Der Umweg über die Creator-Seite (`podcasters.spotify.com/pod/show/…`) ist
 * kein Ersatz: Dort landet ein Hörer im Verwaltungsbereich statt bei der
 * Folge. Genau das war der Anlass für dieses Skript.
 *
 * ## Was hinterlegt sein muss
 *
 * `SPOTIFY_CLIENT_ID` und `SPOTIFY_CLIENT_SECRET` – aus einer App unter
 * developer.spotify.com, kostenlos, ohne Nutzeranmeldung (Client Credentials).
 * Die Kennung der Sendung findet das Skript selbst über die Suche; wer sie
 * festnageln will, hinterlegt `SPOTIFY_SHOW_ID`.
 *
 * Fehlen die Zugangsdaten, endet der Lauf mit null und sagt, was fehlt. Eine
 * fehlende Einstellung ist ein Zustand, kein Fehler – die Website zeigt dann
 * den Verweis auf die Sendung statt auf die Folge.
 *
 * ## Warum nach Datum zugeordnet wird und nicht nach Titel
 *
 * Titel werden nachträglich geändert, Erscheinungstage nicht. Spotify liefert
 * `release_date` als `JJJJ-MM-TT` – dasselbe Format, in dem die Folgen hier
 * geführt werden. Der Titel dient nur als zweiter Weg, falls ein Tag zwei
 * Folgen trägt.
 *
 * Aufruf: npm run spotifylinks
 *         npm run spotifylinks -- --nur-zeigen   (fragt, schreibt nicht)
 */

import { writeFileSync } from 'node:fs'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID?.trim()
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET?.trim()
const SHOW_ID = process.env.SPOTIFY_SHOW_ID?.trim()
const SUCHNAME = process.env.SPOTIFY_SHOW_NAME?.trim() || 'Börse am Morgen - IM Invests'

const ZIEL = 'data/podcast-spotify.json'

/**
 * `--nur-zeigen` fragt und schreibt nichts.
 *
 * Der Anlass: Am 1. September 2026 meldete der Betreiber „Podcast bei
 * Spotify nicht online". Belegen ließ sich alles bis zur eigenen Haustür –
 * Folge erzeugt, hochgeladen, `feed.xml` von außen mit 200 und der jüngsten
 * Folge darin. Was **Spotify** daraus gemacht hat, konnte niemand sagen:
 * Dieses Skript lief nur innerhalb von `podcast-erzeugen.yml`, also einmal
 * am Morgen und nur zusammen mit einer neuen Folge.
 *
 * Mit dem Schalter fragt `podcast-schaufenster.yml` dieselbe Frage, wann
 * immer sie jemand stellt – ohne eine Folge zu erzeugen und ohne den
 * Bestand anzufassen.
 */
const NUR_ZEIGEN = process.argv.includes('--nur-zeigen')

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.log(
    '[spotify] Keine Zugangsdaten hinterlegt – nichts zu tun.\n' +
      '          Unter developer.spotify.com eine App anlegen und\n' +
      '          SPOTIFY_CLIENT_ID und SPOTIFY_CLIENT_SECRET als Secrets setzen.\n' +
      '          Solange verweist die Website auf die Sendung statt auf die Folge.'
  )
  process.exit(0)
}

/* Client Credentials: Das Programm meldet sich selbst an, ohne Nutzerkonto.
   Damit kommt man an alle öffentlichen Angaben – mehr braucht es nicht. */
const tokenAntwort = (await (
  await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  })
).json()) as { access_token?: string; error_description?: string }

if (!tokenAntwort.access_token) {
  console.error(
    `::error::[spotify] Anmeldung abgelehnt: ${tokenAntwort.error_description ?? 'unbekannter Grund'}`
  )
  process.exit(1)
}
const token = tokenAntwort.access_token
const kopf = { Authorization: `Bearer ${token}` }

/* Die Sendung finden, falls ihre Kennung nicht hinterlegt ist. Der Markt muss
   mitgegeben werden, sonst liefert Spotify für manche Konten nichts. */
let show = SHOW_ID
if (!show) {
  const suche = (await (
    await fetch(
      `https://api.spotify.com/v1/search?type=show&market=DE&limit=5&q=${encodeURIComponent(SUCHNAME)}`,
      { headers: kopf }
    )
  ).json()) as { shows?: { items?: { id: string; name: string }[] } }

  const treffer = suche.shows?.items ?? []
  show = treffer.find((eintrag) => eintrag.name === SUCHNAME)?.id ?? treffer[0]?.id
  if (!show) {
    console.error(
      `::error::[spotify] Keine Sendung namens „${SUCHNAME}" gefunden.\n` +
        '          Mit SPOTIFY_SHOW_ID die Kennung festlegen – sie steht in der\n' +
        '          Adresse hinter /show/.'
    )
    process.exit(1)
  }
  console.log(`[spotify] Sendung gefunden: ${show}`)
}

/* Alle Folgen holen, seitenweise. Fünfzig je Abruf ist das Maximum. */
interface Episode {
  id: string
  name: string
  release_date: string
  external_urls?: { spotify?: string }
}

const episoden: Episode[] = []
let weiter: string | null =
  `https://api.spotify.com/v1/shows/${show}/episodes?market=DE&limit=50`

while (weiter) {
  const antwort = await fetch(weiter, { headers: kopf })
  if (!antwort.ok) {
    console.error(
      `::error::[spotify] Abruf der Folgen fehlgeschlagen (Status ${antwort.status}).`
    )
    process.exit(1)
  }
  const seite = (await antwort.json()) as { items?: Episode[]; next?: string | null }
  episoden.push(...(seite.items ?? []))
  weiter = seite.next ?? null
}

/*
  Nach Erscheinungstag ordnen. Trägt ein Tag mehrere Folgen, gewinnt die
  zuerst gelesene – Spotify liefert die jüngste zuerst, und mehr als eine
  Folge am Tag gibt es hier nicht.
*/
const nachTag: Record<string, { url: string; titel: string }> = {}
for (const episode of episoden) {
  const adresse = episode.external_urls?.spotify
  if (!adresse || !episode.release_date) continue
  if (!nachTag[episode.release_date]) {
    nachTag[episode.release_date] = { url: adresse, titel: episode.name }
  }
}

const tage = Object.keys(nachTag).sort()

if (NUR_ZEIGEN) {
  console.log(
    `[spotify] ${tage.length} von ${episoden.length} Folgen mit Adresse.\n` +
      `          jüngste: ${tage.at(-1) ?? '(keine)'}` +
      (tage.length ? ` – ${nachTag[tage.at(-1)!].titel}` : '') +
      `\n          älteste: ${tage[0] ?? '(keine)'}\n` +
      `          Nur gezeigt – ${ZIEL} bleibt unverändert.`
  )
} else {
  writeFileSync(
    ZIEL,
    JSON.stringify(
      { abgerufenAm: new Date().toISOString(), showId: show, folgen: nachTag },
      null,
      2
    ) + '\n'
  )
  console.log(
    `[spotify] ${tage.length} von ${episoden.length} Folgen mit Adresse nach ${ZIEL}.`
  )
}
