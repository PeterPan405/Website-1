/**
 * Trägt die Tagesfolge ins eigene Folgenregister ein und schreibt den
 * Podcast-Feed, den Spotify und jeder andere Abspieler abonnieren.
 *
 * ## Warum ein eigener Feed
 *
 * Spotify for Creators hat keine Schnittstelle zum Hochladen – wer dort
 * hostet, lädt jede Folge von Hand hoch. Ein Podcast braucht aber gar
 * keinen Hoster, nur einen Feed und erreichbare Audiodateien. Beides
 * liefert iminvests.de selbst; Spotify wird zum Abonnenten wie jeder
 * Podcast-Abspieler auch. Veröffentlichen heißt dann: eine Datei mehr.
 *
 * ## Wo die Dateien liegen
 *
 * Die MP3s liegen auf dem Server unter `~/podcast-audio/`, **außerhalb**
 * des Ordners, den der Paketbau bei jedem Deploy austauscht – sonst wären
 * sie nach dem nächsten Bau weg. In den Webpfad kommt der Ordner über
 * einen Symlink, den der Paketbau nach jedem Umhängen neu setzt.
 *
 * ## Zwei Betriebsarten
 *
 *     … eintragen   nimmt podcast-folge/ (Titel, Beschreibung, MP3) und
 *                   trägt die Folge ins Register ein; Dauer und Größe
 *                   werden aus der Datei gemessen (DAUER_SEKUNDEN kommt
 *                   vom Workflow, der ffprobe hat)
 *     … schreiben   baut nur den Feed aus dem Register
 *
 * Das Register `data/podcast-eigener-feed.json` ist versioniert – der
 * Feed ist damit jederzeit aus dem Repository reproduzierbar, und eine
 * verlorene Serverdatei ist kein Datenverlust.
 */

import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'

import { ohneHashtags } from '../lib/podcast-feed.ts'

const REGISTER = 'data/podcast-eigener-feed.json'
const BASIS = 'https://iminvests.de/podcast-audio'

interface Folge {
  datum: string
  titel: string
  nummer: number
  beschreibung: string
  dauerSekunden: number
  bytes: number
  /* Die YouTube-Kennung der Folge, sobald sie hochgeladen ist. Fehlt sie,
     hat es den Upload an diesem Tag nicht gegeben – kein Fehler, nur ein
     Verweis weniger auf der Website. */
  youtubeId?: string
}

interface Register {
  folgen: Folge[]
  /* Der Kanal, einmal für alle Folgen. Er ändert sich nicht, wird aber bei
     jedem Upload neu bestätigt. */
  youtubeKanalId?: string | null
}

function entschaerfen(text: string): string {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

const register = JSON.parse(readFileSync(REGISTER, 'utf8')) as Register
const modus = process.argv[2]

if (modus === 'eintragen') {
  const titelZeilen = readFileSync('podcast-folge/titel.txt', 'utf8').split('\n')
  const meta = JSON.parse(readFileSync('podcast-folge/folge.json', 'utf8')) as {
    datum: string
    nummer: number
  }
  const beschreibung = ohneHashtags(
    readFileSync('podcast-folge/beschreibung.txt', 'utf8')
  )

  const dauer = Number(process.env.DAUER_SEKUNDEN)
  if (!Number.isFinite(dauer) || dauer < 30) {
    console.error(`[feed] DAUER_SEKUNDEN fehlt oder ist unglaubwürdig: ${dauer}`)
    process.exit(1)
  }

  /* Die YouTube-Kennungen, falls der Upload vor diesem Schritt lief. Fehlen
     sie, bleibt alles wie bisher – die Folge erscheint im Feed, nur ohne
     Verweis auf das Video. */
  let youtube: { videoId?: string; kanalId?: string | null } = {}
  try {
    youtube = JSON.parse(readFileSync('podcast-folge/youtube.json', 'utf8'))
  } catch {
    /* kein Upload gelaufen – kein Fehler */
  }

  const eintrag: Folge = {
    datum: meta.datum,
    titel: titelZeilen[0].trim(),
    nummer: meta.nummer,
    beschreibung,
    dauerSekunden: Math.round(dauer),
    bytes: statSync('podcast-folge/folge.mp3').size,
    ...(youtube.videoId ? { youtubeId: youtube.videoId } : {}),
  }
  if (youtube.kanalId) register.youtubeKanalId = youtube.kanalId

  /* Ein zweiter Lauf am selben Tag ersetzt die Folge, statt sie zu doppeln. */
  register.folgen = register.folgen.filter((folge) => folge.datum !== eintrag.datum)
  register.folgen.push(eintrag)
  register.folgen.sort((a, b) => (a.datum < b.datum ? 1 : -1))
  writeFileSync(REGISTER, JSON.stringify(register, null, 2) + '\n')
  console.log(`[feed] Folge ${eintrag.nummer} (${eintrag.datum}) eingetragen.`)
}

/* Der Feed – in beiden Betriebsarten neu geschrieben. */
const kopfBeschreibung =
  'Dein tägliches Marktupdate von IM Investments. Werktäglich am Morgen fassen wir ' +
  'kompakt in rund fünf Minuten die wichtigsten Entwicklungen an den Finanzmärkten ' +
  'zusammen: Aktien, Anleihen, Rohstoffe, Notenbanken – immer mit Einordnung, was ' +
  'das für Privatanleger bedeutet. Text und Vertonung entstehen mit Unterstützung ' +
  'von KI-Werkzeugen und werden vor der Veröffentlichung von einem Menschen ' +
  'inhaltlich geprüft; die redaktionelle Verantwortung liegt beim Betreiber. ' +
  'Keine Anlageberatung.'

const eintraege = register.folgen
  .map((folge) => {
    const url = `${BASIS}/${folge.datum}.mp3`
    const datum = new Date(`${folge.datum}T04:30:00Z`).toUTCString()
    return `    <item>
      <title>${entschaerfen(folge.titel)}</title>
      <link>${url}</link>
      <guid isPermaLink="false">iminvests-marktupdate-${folge.datum}</guid>
      <pubDate>${datum}</pubDate>
      <enclosure url="${url}" length="${folge.bytes}" type="audio/mpeg"/>
      <itunes:duration>${folge.dauerSekunden}</itunes:duration>
      <itunes:episode>${folge.nummer}</itunes:episode>
      <itunes:explicit>false</itunes:explicit>
      <description>${entschaerfen(folge.beschreibung)}</description>
    </item>`
  })
  .join('\n')

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Börse am Morgen - IM Invests</title>
    <link>https://iminvests.de/podcast/</link>
    <atom:link href="${BASIS}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>de</language>
    <copyright>IM Invests</copyright>
    <itunes:author>IM Invests</itunes:author>
    <itunes:owner>
      <itunes:name>IM Invests</itunes:name>
      <itunes:email>maier.ptw@gmail.com</itunes:email>
    </itunes:owner>
    <itunes:image href="${BASIS}/cover.jpg"/>
    <itunes:category text="Business"><itunes:category text="Investing"/></itunes:category>
    <itunes:explicit>false</itunes:explicit>
    <description>${entschaerfen(kopfBeschreibung)}</description>
${eintraege}
  </channel>
</rss>
`

/*
  Im täglichen Lauf legt `npm run folge` den Ordner an, bevor dieses Skript
  drankommt. Beim Umzug gibt es keine Folge – nur das Register –, und dann
  gab es den Ordner nicht:

      Error: ENOENT: no such file or directory, open 'podcast-folge/feed.xml'

  Ein Feed lässt sich aus dem Register allein schreiben; der Ordner ist eine
  Ablage, keine Voraussetzung.
*/
mkdirSync('podcast-folge', { recursive: true })
writeFileSync('podcast-folge/feed.xml', feed)
console.log(`[feed] feed.xml geschrieben – ${register.folgen.length} Folge(n).`)
