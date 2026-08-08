/**
 * Holt die Folgen des Podcasts aus seinem RSS-Feed.
 *
 * ## Warum überhaupt hierher und nicht nur ein Verweis
 *
 * Der Verweis auf Spotify steht in der Fußzeile, und er bleibt. Nur: Ein
 * Verweis nach draußen ist alles, was er ist. Wer nach dem Titel einer Folge
 * sucht, landet bei Spotify oder nirgends – auf dieser Website ist der Podcast
 * unsichtbar, obwohl er zu ihr gehört. Mit den Folgen im Bestand hat jede eine
 * eigene Adresse, steht in der Suche, in der Sitemap und im Archiv.
 *
 * ## Warum der Feed und nicht die Spotify-Schnittstelle
 *
 * Siehe `lib/podcast-feed.ts`: Die Web-API verlangt eine Registrierung samt
 * Geheimnis, der Feed nicht. Und der Feed liegt beim Hoster des Podcasts, nicht
 * bei einer Abspielplattform – zieht der Podcast um, zieht die Adresse mit.
 *
 * ## Warum die Adresse nicht im Repository steht
 *
 * Weil ich sie nicht kenne. Die Feed-Adresse steht im Verwaltungsbereich des
 * Podcast-Hosters (bei „Spotify for Creators“ unter *Settings → Distribution*,
 * meist `https://anchor.fm/s/…/podcast/rss`). Aus der Spotify-Adresse allein
 * lässt sie sich nicht ableiten. Geraten wird sie nicht: Ein falscher Feed
 * brächte fremde Folgen unter unserem Namen auf die Seite.
 *
 * Sie gehört in eine **Variable**, nicht in ein Secret – anders als ein
 * Schlüssel. Ein Podcast-Feed ist öffentlich; jeder Abspieler liest ihn. Ein
 * Secret zu verwenden, wo nichts geheim ist, gewöhnt einem nur ab, den
 * Unterschied zu beachten:
 *
 *     GitHub → Settings → Secrets and variables → Actions → Variables
 *     Name: PODCAST_RSS_URL
 *
 * Ohne diese Angabe tut das Skript nichts und meldet das. Genau wie beim
 * Kursabruf ohne `TWELVEDATA_API_KEY`: Eine fehlende Einstellung ist kein
 * Fehler, sondern ein Zustand.
 *
 * Aufruf: `npm run podcast`
 */

import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

import { folgenSlug, leseFeed, nurText, type Folge } from '../lib/podcast-feed.ts'

const FEED_URL = process.env.PODCAST_RSS_URL?.trim() || undefined
const ZIEL = 'data/snapshots/podcast.json'

/**
 * Das eigene Folgenregister – seit dem Umzug die Wahrheit über den Podcast.
 *
 * ## Warum von hier und nicht mehr über das Netz
 *
 * Bis zum 8. August 2026 las dieses Skript einen fremden Feed über HTTP,
 * täglich um 04:41 UTC. Die Folge des Tages entsteht um 04:53 – zwölf
 * Minuten **später**. Auf der Website stand damit jeden Morgen die Folge
 * von gestern, und das war kein Fehler im Ablauf, sondern in der
 * Reihenfolge: Die Website fragte, bevor es etwas zu fragen gab.
 *
 * Seit der Podcast im eigenen Haus liegt, gibt es nichts mehr zu fragen.
 * `data/podcast-eigener-feed.json` wird von `podcast-feed-schreiben.ts`
 * geschrieben, sobald eine Folge veröffentlicht ist. Wer von dort liest,
 * ist per Bauart aktuell – keine Wartezeit, keine Netzverbindung, kein
 * Zeitplan, der in der falschen Reihenfolge steht.
 */
const REGISTER = 'data/podcast-eigener-feed.json'

/** Der YouTube-Kanal, sobald ein Upload ihn bestätigt hat. */
let kanalId: string | null = null
const AUDIO_BASIS = 'https://iminvests.de/podcast-audio'

interface Momentaufnahme {
  abgerufenAm: string | null
  feed: string | null
  titel: string | null
  beschreibung: string | null
  /* Der YouTube-Kanal – für den Verweis oben auf der Podcastseite. */
  youtubeKanalId?: string | null
  folgen: Folge[]
}

/** Holt den Inhalt des ersten Elements dieses Namens aus dem Kanalkopf. */
function kopffeld(xml: string, name: string): string | null {
  const kopf = xml.split(/<item(?:\s[^>]*)?>/i)[0]
  const treffer = kopf.match(
    new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i')
  )
  const text = nurText(treffer?.[1] ?? '')
  return text || null
}

/**
 * Baut die Momentaufnahme aus dem eigenen Register.
 *
 * Gibt `null` zurück, wenn das Register fehlt oder leer ist – dann bleibt
 * der Weg über den Feed als Rückfall.
 */
async function ausEigenemRegister(): Promise<Folge[] | null> {
  if (!existsSync(REGISTER)) return null

  const register = JSON.parse(await readFile(REGISTER, 'utf8')) as {
    folgen: {
      datum: string
      titel: string
      beschreibung: string
      dauerSekunden: number
      youtubeId?: string
    }[]
    youtubeKanalId?: string | null
  }
  if (register.folgen.length === 0) return null
  kanalId = register.youtubeKanalId ?? null

  /*
    Der Slug entsteht aus dem Titel, wie beim Feed auch – die Adressen
    `/podcast#<slug>` bleiben damit dieselben, die sie vor dem Umzug
    waren. Doppelte Titel bekommen eine Nummer angehängt; das ist bei
    einem täglichen Marktupdate nicht theoretisch.
  */
  const vergeben = new Set<string>()
  return register.folgen
    .map((eintrag) => {
      let slug = folgenSlug(eintrag.titel)
      if (vergeben.has(slug)) {
        let zaehler = 2
        while (vergeben.has(`${slug}-${zaehler}`)) zaehler += 1
        slug = `${slug}-${zaehler}`
      }
      vergeben.add(slug)
      return {
        slug,
        titel: eintrag.titel,
        beschreibung: eintrag.beschreibung,
        datum: eintrag.datum,
        dauerSekunden: eintrag.dauerSekunden,
        /* Die Folge selbst, nicht die Sendung: Wer „diese Folge anhören"
           drückt, soll diese Folge hören und nicht auf einer Übersicht
           landen, auf der er sie erst suchen muss. */
        url: `${AUDIO_BASIS}/${eintrag.datum}.mp3`,
        ...(eintrag.youtubeId ? { youtubeId: eintrag.youtubeId } : {}),
      }
    })
    .sort((a, b) => b.datum.localeCompare(a.datum))
}

async function main(): Promise<void> {
  const eigene = await ausEigenemRegister()
  if (eigene) {
    const bestand = JSON.parse(await readFile(ZIEL, 'utf8')) as Momentaufnahme
    const bekannt = new Set(eigene.map((folge) => folge.slug))
    const behalten = bestand.folgen.filter((folge) => !bekannt.has(folge.slug))
    const alle = [...eigene, ...behalten].sort((a, b) => b.datum.localeCompare(a.datum))

    const ergebnis: Momentaufnahme = {
      abgerufenAm: new Date().toISOString(),
      feed: `${AUDIO_BASIS}/feed.xml`,
      titel: bestand.titel,
      beschreibung: bestand.beschreibung,
      youtubeKanalId: kanalId,
      folgen: alle,
    }
    await writeFile(ZIEL, `${JSON.stringify(ergebnis, null, 2)}\n`)
    console.log(
      `[podcast] ${eigene.length} Folgen aus dem eigenen Register, ${alle.length} im Bestand.`
    )
    return
  }

  if (!FEED_URL) {
    console.log(
      '[podcast] Keine PODCAST_RSS_URL hinterlegt – nichts zu tun.\n' +
        '          Die Adresse steht im Verwaltungsbereich des Podcast-Hosters\n' +
        '          und gehört unter Settings → Secrets and variables → Actions\n' +
        '          in die Variablen (nicht in die Secrets: sie ist öffentlich).'
    )
    return
  }

  const bestand = JSON.parse(await readFile(ZIEL, 'utf8')) as Momentaufnahme

  const antwort = await fetch(FEED_URL, {
    headers: { 'User-Agent': 'IM-Invests Podcastabruf' },
  })
  if (!antwort.ok) {
    console.error(`[podcast] Feed nicht abrufbar (Status ${antwort.status}).`)
    process.exitCode = 1
    return
  }

  const xml = await antwort.text()
  const folgen = leseFeed(xml)

  /*
    Ein leeres Ergebnis überschreibt den Bestand nicht.

    Ein Feed kann kurzzeitig kaputt ausgeliefert werden – halb geschrieben, mit
    einer Fehlerseite unter Status 200, oder nach einem Umzug erst einmal ohne
    Einträge. Wer das übernimmt, löscht sämtliche Folgenseiten und damit jede
    Adresse, die je auf sie gesetzt wurde. Der alte Bestand ist in dem Fall die
    bessere Auskunft.
  */
  if (folgen.length === 0) {
    console.error(
      `[podcast] Der Feed enthält keine lesbaren Folgen (${xml.length} Zeichen).\n` +
        '          Der bisherige Bestand bleibt stehen.'
    )
    process.exitCode = 1
    return
  }

  /*
    Was einmal im Bestand war, bleibt darin.

    Viele Podcast-Hoster liefern nicht das ganze Archiv aus, sondern die
    letzten fünfzig oder hundert Folgen. Wer den Feed jedes Mal eins zu eins
    übernimmt, löscht damit die Seiten aller älteren Folgen – und jede Adresse,
    die je auf sie gesetzt wurde, zeigt ins Leere. Der Feed gewinnt bei allem,
    was er kennt; was er nicht mehr führt, bleibt stehen.
  */
  const bekannt = new Set(folgen.map((folge) => folge.slug))
  const behalten = bestand.folgen.filter((folge) => !bekannt.has(folge.slug))
  const alle = [...folgen, ...behalten].sort((a, b) => b.datum.localeCompare(a.datum))

  if (behalten.length > 0) {
    console.log(
      `[podcast] ${behalten.length} ältere Folgen stehen nicht mehr im Feed und ` +
        'bleiben aus dem bisherigen Bestand erhalten.'
    )
  }

  const ergebnis: Momentaufnahme = {
    abgerufenAm: new Date().toISOString(),
    feed: FEED_URL,
    titel: kopffeld(xml, 'title'),
    beschreibung: kopffeld(xml, 'description'),
    folgen: alle,
  }

  await writeFile(ZIEL, `${JSON.stringify(ergebnis, null, 2)}\n`)
  console.log(
    `[podcast] ${folgen.length} Folgen aus dem Feed, ${alle.length} im Bestand` +
      `${alle[0] ? `, jüngste vom ${alle[0].datum || '—'}` : ''}.`
  )
}

/*
  Nur ausführen, wenn dieses Skript direkt aufgerufen wurde – aus demselben
  Grund wie in `scripts/dart-abrufen.ts`: Ein Test, der die Datei importiert,
  soll keine Netzanfrage auslösen und keinen Bestand überschreiben.
*/
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}
