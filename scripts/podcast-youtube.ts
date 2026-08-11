/**
 * Lädt das fertige Video der Tagesfolge auf YouTube hoch.
 *
 * ## Was beim Hochladen gleich mitgesetzt wird
 *
 * Die Häkchen aus der Upload-Checkliste, damit sie nie vergessen werden:
 * nicht für Kinder, KI-Kennzeichnung (`containsSyntheticMedia`), der
 * Aufnahmeort Stuttgart und – falls `YT_PLAYLIST_ID` hinterlegt ist – die
 * Playlist. Der Titel kommt aus `titel.txt`, die Beschreibung samt
 * Kapitelmarken aus `beschreibung.txt`.
 *
 * ## Warum Ort und Playlist erst nach dem Hochladen kommen
 *
 * Beides sind Zutaten, nicht Bedingungen. Stünden sie im Anmeldeaufruf,
 * würde ein abgelehntes Feld den ganzen Upload verhindern – und dann fehlt
 * die Folge, weil eine Ortsangabe nicht durchging. Nachgereicht ist ein
 * Fehlschlag eine Warnung: Das Video ist online, nur ohne Fähnchen.
 *
 * ## Ohne Zugangsdaten kein Fehler
 *
 * Dasselbe Muster wie überall: Fehlen die Secrets, endet das Skript mit
 * null und sagt, was fehlt. Die Anmeldung ist ein einmaliger Schritt auf
 * dem eigenen Rechner – `scripts/youtube-anmelden.mjs` führt hindurch.
 *
 * ## Warum in zwei Schritten hochgeladen wird
 *
 * YouTube verlangt für Dateien den „resumable upload“: erst die Metadaten
 * anmelden, dann die Bytes an die zurückgegebene Adresse schicken. Ein
 * einzelner Multipart-Aufruf bricht bei fünf Minuten Video zu oft ab.
 *
 * Aufruf: npm run youtube
 */

import { readFileSync, statSync, writeFileSync } from 'node:fs'

const CLIENT_ID = process.env.YT_CLIENT_ID?.trim()
const CLIENT_SECRET = process.env.YT_CLIENT_SECRET?.trim()
const REFRESH_TOKEN = process.env.YT_REFRESH_TOKEN?.trim()
const PLAYLIST = process.env.YT_PLAYLIST_ID?.trim()

const VIDEO = 'podcast-folge/video.mp4'

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.log(
    '[youtube] Keine Zugangsdaten hinterlegt – nichts zu tun.\n' +
      '          Einmalig anmelden mit: node scripts/youtube-anmelden.mjs\n' +
      '          Danach YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN als Secrets.'
  )
  process.exit(0)
}

/*
  Kein Video, aber Zugangsdaten? Dann ist das die Gelegenheit, sie zu prüfen.

  Sonst stellt sich erst am ersten echten Morgen heraus, ob Schlüssel und
  Token stimmen – und dann fehlt die Folge. Die Probe fragt nur den
  Kanalnamen ab; sie ändert nichts und kostet nichts.
*/
let video: Buffer | null = null
try {
  video = readFileSync(VIDEO)
} catch {
  console.log('[youtube] Kein Video unter podcast-folge/ – stattdessen Zugangsprobe.')
}

/* Zugangs-Token aus dem Refresh-Token – der einzige Schritt, der das
   Client-Secret braucht. */
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
).json()) as { access_token?: string; error?: string }

if (!tokenAntwort.access_token) {
  console.error(`::error::[youtube] Anmeldung abgelehnt: ${JSON.stringify(tokenAntwort)}`)
  process.exit(1)
}
const token = tokenAntwort.access_token

if (!video) {
  const kanal = (await (
    await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&mine=true',
      { headers: { Authorization: `Bearer ${token}` } }
    )
  ).json()) as {
    items?: {
      id?: string
      snippet?: { title?: string }
      contentDetails?: { relatedPlaylists?: { uploads?: string } }
    }[]
  }

  const name = kanal.items?.[0]?.snippet?.title
  if (!name) {
    console.error(
      '::error::[youtube] Anmeldung ging durch, aber kein Kanal gefunden.\n' +
        '          Vermutlich wurde bei der Zustimmung das falsche Google-Konto gewählt.'
    )
    process.exit(1)
  }
  console.log(
    `[youtube] Zugang geprüft. Hochgeladen würde auf den Kanal: „${name}“ ` +
      `(${kanal.items?.[0]?.id ?? 'ohne Kennung'})`
  )

  /*
    Was liegt auf dem Kanal schon?

    Aus einer konkreten Unklarheit entstanden: Am 8. August 2026 stand die
    Frage im Raum, ob die bisherigen Folgen bereits als Video auf YouTube
    liegen – etwa über eine Verteilung des Podcast-Hosters. Von außen ist
    das nicht zu beantworten: Im Repository steht nur, was **diese**
    Automatik hochgeladen hat, und das war nichts.

    Der Kanal führt seine Uploads in einer eigenen Playlist. Die
    aufzuzählen kostet einen Aufruf und beantwortet die Frage endgültig –
    mit Kennung und Datum, an denen sich jedes Video einer Folge zuordnen
    lässt.
  */
  const uploads = kanal.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
  if (uploads) {
    const liste = (await (
      await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=25&playlistId=${encodeURIComponent(uploads)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
    ).json()) as {
      items?: {
        snippet?: {
          title?: string
          publishedAt?: string
          resourceId?: { videoId?: string }
        }
      }[]
    }

    const videos = liste.items ?? []
    if (videos.length === 0) {
      console.log('[youtube] Auf dem Kanal liegt bisher kein einziges Video.')
    } else {
      console.log(
        `[youtube] Auf dem Kanal liegen ${videos.length} Videos (jüngste zuerst):`
      )
      for (const eintrag of videos) {
        const tag = eintrag.snippet?.publishedAt?.slice(0, 10) ?? '????-??-??'
        console.log(
          `           ${tag}  ${eintrag.snippet?.resourceId?.videoId ?? '???'}  ${eintrag.snippet?.title ?? ''}`
        )
      }
    }
  }

  /*
    Die Playlist gleich mit prüfen.

    Eine falsch abgetippte Kennung fällt sonst erst beim ersten echten
    Upload auf – und dort ist das Einsortieren bewusst nur eine Warnung,
    damit ein abgelehntes Feld nie die Folge kostet. Genau deshalb würde
    sie leise danebenliegen: Das Video wäre online, die Playlist leer, und
    niemand bekäme davon etwas mit.

    In der Kennung stecken Groß- und Kleinbuchstaben; `I` und `l` sehen in
    vielen Schriften gleich aus. Das ist kein theoretischer Fehler.
  */
  if (!PLAYLIST) {
    console.log('[youtube] Keine YT_PLAYLIST_ID – Folgen landen in keiner Playlist.')
    process.exit(0)
  }

  const liste = (await (
    await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${encodeURIComponent(PLAYLIST)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
  ).json()) as { items?: { snippet?: { title?: string; channelTitle?: string } }[] }

  const eintrag = liste.items?.[0]?.snippet
  if (!eintrag) {
    console.error(
      `::error::[youtube] Die Playlist „${PLAYLIST}“ gibt es nicht.\n` +
        '          Die Kennung steht in der Adresse hinter /playlist/ bzw. list=\n' +
        '          und unterscheidet Groß- und Kleinschreibung.'
    )
    process.exit(1)
  }
  console.log(
    `[youtube] Playlist geprüft: „${eintrag.title}“ auf „${eintrag.channelTitle}“.`
  )
  process.exit(0)
}

const titelDatei = readFileSync('podcast-folge/titel.txt', 'utf8').split('\n')
const titel = titelDatei[0].trim()
const folgennummer = titelDatei[1]?.trim() ?? ''
const beschreibung = readFileSync('podcast-folge/beschreibung.txt', 'utf8').trim()
const videotitel = folgennummer ? `${titel} | Marktupdate ${folgennummer}` : titel

/*
  Liegt für heute schon ein Video auf dem Kanal?

  ## Warum diese Frage hier steht und nicht nur im Workflow

  Weil sie an dieser Stelle die **richtige Quelle** hat. Am 9. und am
  10. August 2026 erschienen zwei Videos desselben Tages auf dem Kanal. Beide
  Male gab es einen Riegel, beide Male hat er nicht getragen – und beide Male
  aus demselben Grund: Er fragte einen **Stellvertreter**.

      9. August    gefragt: der eigene Checkout des Feeds
                   Problem: ein Handstart hatte längst hochgeladen
      10. August   gefragt: origin/main beim Auslösen des Laufs
                   Problem: Lauf 1 trug erst dreißig Sekunden später ein

  Nach dem zweiten Mal wurde der Riegel auf `origin/main` von jetzt umgestellt.
  Das ist richtig und reicht trotzdem nicht, denn der Feed ist immer noch ein
  Stellvertreter für das, worum es geht. Am 10. August ist genau das schiefe
  Verhältnis auch aufgetreten: Ein Lauf hatte hochgeladen, den Feed
  geschrieben – und **scheiterte danach am Commit**. Auf dem Kanal lag ein
  Video, im Register stand es nicht. Jeder Riegel, der das Register liest,
  hätte danach „nein, gibt es noch nicht" gesagt.

  **Wer wissen will, ob ein Video auf dem Kanal liegt, fragt den Kanal.**
  Diese Prüfung sitzt unmittelbar vor dem Upload – nicht vierzig Minuten
  davor in einem anderen Job – und sie fragt die Stelle, an der die Doppelung
  sichtbar wird.

  ## Woran „dieselbe Folge" erkannt wird

  An zweierlei, und es genügt eins davon:

  - **derselbe Titel** – er ist aus der Tagesausgabe gebaut und für einen Tag
    eindeutig;
  - **dasselbe Veröffentlichungsdatum** – bei einer Sendung mit genau einer
    Folge je Tag ist ein Video von heute die Folge von heute.

  Der zweite Punkt fängt auch den Fall, in dem ein zweiter Lauf einen
  abgewandelten Titel erzeugt. Er kann daneben liegen, wenn jemand am selben
  Tag von Hand ein anderes Video hochlädt – dann sagt der Lauf genau das, und
  `nochmal: true` setzt ihn außer Kraft.
*/
const STICHTAG =
  process.env.PODCAST_STICHTAG?.trim() || new Date().toISOString().slice(0, 10)
const NOCHMAL = process.env.PODCAST_NOCHMAL?.trim() === 'true'

async function schonAufDemKanal(): Promise<string | null> {
  const kanal = (await (
    await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true',
      { headers: { Authorization: `Bearer ${token}` } }
    )
  ).json()) as {
    items?: { contentDetails?: { relatedPlaylists?: { uploads?: string } } }[]
  }

  const uploads = kanal.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
  if (!uploads) {
    console.log('[youtube] Keine Upload-Playlist gefunden – die Doppelprüfung entfällt.')
    return null
  }

  const liste = (await (
    await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=15&playlistId=${encodeURIComponent(uploads)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
  ).json()) as {
    items?: {
      snippet?: {
        title?: string
        publishedAt?: string
        resourceId?: { videoId?: string }
      }
    }[]
  }

  for (const eintrag of liste.items ?? []) {
    const vorhanden = eintrag.snippet?.title?.trim() ?? ''
    const tag = eintrag.snippet?.publishedAt?.slice(0, 10) ?? ''
    const kennung = eintrag.snippet?.resourceId?.videoId ?? '???'
    if (vorhanden === videotitel) return `${kennung} trägt denselben Titel`
    if (tag && tag === STICHTAG) return `${kennung} wurde am ${tag} veröffentlicht`
  }

  return null
}

const doppelt = await schonAufDemKanal()
if (doppelt) {
  if (NOCHMAL) {
    console.log(
      `::warning::[youtube] Auf dem Kanal liegt bereits ein Video für den ${STICHTAG} ` +
        `(${doppelt}) – wegen 'nochmal' wird trotzdem hochgeladen.`
    )
  } else {
    // **Kein roter Lauf.** Dass die Folge schon oben ist, ist der Zustand,
    // den dieser Riegel herstellen soll, kein Fehler. Rot wäre er hier nur
    // ein Alarm für etwas, das genau richtig gelaufen ist – und nach der
    // Regel „ein roter Lauf ist ein Vorrat" wäre er verschwendet.
    console.log(
      `[youtube] Für den ${STICHTAG} liegt schon ein Video auf dem Kanal (${doppelt}).`
    )
    console.log('          Es wird nichts hochgeladen – sonst stünde die Folge doppelt.')
    process.exit(0)
  }
}

/* Schritt 1: Metadaten anmelden, Upload-Adresse entgegennehmen. */
const start = await fetch(
  'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Length': String(statSync(VIDEO).size),
      'X-Upload-Content-Type': 'video/mp4',
    },
    body: JSON.stringify({
      snippet: {
        title: videotitel,
        description: beschreibung,
        categoryId: '25',
        defaultLanguage: 'de',
        defaultAudioLanguage: 'de',
      },
      status: {
        privacyStatus: 'public',
        selfDeclaredMadeForKids: false,
        containsSyntheticMedia: true,
      },
    }),
  }
)

const uploadAdresse = start.headers.get('location')
if (!start.ok || !uploadAdresse) {
  console.error(
    `::error::[youtube] Upload-Anmeldung fehlgeschlagen (Status ${start.status}): ` +
      (await start.text()).slice(0, 400)
  )
  process.exit(1)
}

/* Schritt 2: die Bytes. */
const hochladen = await fetch(uploadAdresse, {
  method: 'PUT',
  headers: { 'Content-Type': 'video/mp4', 'Content-Length': String(video.length) },
  body: new Uint8Array(video),
})

const ergebnis = (await hochladen.json().catch(() => ({}))) as { id?: string }
if (!hochladen.ok || !ergebnis.id) {
  console.error(
    `::error::[youtube] Hochladen fehlgeschlagen (Status ${hochladen.status}).`
  )
  process.exit(1)
}

console.log(`[youtube] Hochgeladen: https://youtu.be/${ergebnis.id}`)

/*
  Die Kennungen festhalten, damit die Website auf die Folge verweisen kann.

  Ohne diesen Schritt wüsste niemand außerhalb dieses Laufs, wo das Video
  liegt: Die Adresse stand nur im Protokoll, und ein Protokoll wird nach
  Tagen gelöscht. Die Kanalkennung kommt gleich mit – die Website
  verlinkt oben den Kanal, und ihn aus dem Video zu erraten geht nicht.
*/
const kanal = (await (
  await fetch('https://www.googleapis.com/youtube/v3/channels?part=id&mine=true', {
    headers: { Authorization: `Bearer ${token}` },
  })
).json()) as { items?: { id?: string }[] }

writeFileSync(
  'podcast-folge/youtube.json',
  JSON.stringify(
    { videoId: ergebnis.id, kanalId: kanal.items?.[0]?.id ?? null },
    null,
    2
  ) + '\n'
)

/* Aufnahmeort nachtragen. `recordingDetails` lässt sich beim Anmelden nicht
   mitgeben, ohne den Teil vollständig zu senden; als eigener Aufruf ist es
   sowohl kürzer als auch ungefährlicher. */
const ort = await fetch(
  'https://www.googleapis.com/youtube/v3/videos?part=recordingDetails',
  {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      id: ergebnis.id,
      recordingDetails: {
        locationDescription: 'Stuttgart, Deutschland',
        location: { latitude: 48.7758, longitude: 9.1829 },
      },
    }),
  }
)
if (ort.ok) {
  console.log('[youtube] Aufnahmeort auf Stuttgart gesetzt.')
} else {
  console.log(
    `::warning::[youtube] Aufnahmeort fehlgeschlagen (Status ${ort.status}) – Video ist trotzdem online.`
  )
}

/* In die Playlist einsortieren – Scheitern ist eine Warnung, kein Abbruch:
   Das Video ist dann trotzdem online. */
if (PLAYLIST) {
  const einsortieren = await fetch(
    'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        snippet: {
          playlistId: PLAYLIST,
          resourceId: { kind: 'youtube#video', videoId: ergebnis.id },
        },
      }),
    }
  )
  if (einsortieren.ok) {
    console.log('[youtube] In die Playlist einsortiert.')
  } else {
    console.log(
      `::warning::[youtube] Playlist fehlgeschlagen (Status ${einsortieren.status}) – Video ist trotzdem online.`
    )
  }
}
