/**
 * Vertont den Sprechtext mit der geklonten Stimme.
 *
 * ## Warum über eine Schnittstelle und nicht über ein Programm
 *
 * Weil es unbeaufsichtigt laufen soll. Ein Sprachstudio auf dem eigenen
 * Rechner ist kostenlos und liefert dieselbe Stimme – aber nur, wenn der
 * Rechner morgens um vier läuft. Ein GitHub-Läufer hat keine Grafikkarte,
 * keine dauerhafte Installation und kennt keine geklonte Stimme; er kann
 * nur fragen, wo eine liegt.
 *
 * ## Warum das Fehlen des Schlüssels kein Fehler ist
 *
 * Dasselbe Muster wie beim Kursabruf ohne `TWELVEDATA_API_KEY` und beim
 * Podcastabruf ohne `PODCAST_RSS_URL`: Ohne Zugang tut das Skript nichts,
 * meldet das verständlich und endet mit null. Der Sprechtext ist dann
 * trotzdem erzeugt und liegt bereit – die Folge entsteht von Hand in zwei
 * Minuten statt gar nicht.
 *
 *     GitHub → Settings → Secrets and variables → Actions → Secrets
 *     ELEVENLABS_API_KEY   der Zugangsschlüssel
 *     ELEVENLABS_VOICE_ID  die Kennung der geklonten Stimme
 *
 * Die Stimm-Kennung ist kein Geheimnis, sie steht aber neben dem Schlüssel
 * am wenigsten im Weg; sie darf auch als Variable hinterlegt werden.
 *
 * ## Warum das Modell festgeschrieben ist
 *
 * `eleven_multilingual_v2` steht in der bisherigen Arbeitsanweisung. Ein
 * anderes Modell klingt anders, und die Folgen sollen untereinander gleich
 * klingen – der Wechsel wäre eine Entscheidung, keine Kleinigkeit.
 *
 * Aufruf: npm run vertonen
 */

import { readFileSync, statSync, writeFileSync } from 'node:fs'

const SCHLUESSEL = process.env.ELEVENLABS_API_KEY?.trim()
const STIMME = process.env.ELEVENLABS_VOICE_ID?.trim()
const MODELL = 'eleven_multilingual_v2'
const QUELLE = 'podcast-folge/sprechtext.txt'
const ZIEL = 'podcast-folge/folge.mp3'

if (!SCHLUESSEL || !STIMME) {
  console.log(
    '[vertonen] Keine Zugangsdaten hinterlegt – nichts zu tun.\n' +
      `           Fehlt: ${[!SCHLUESSEL && 'ELEVENLABS_API_KEY', !STIMME && 'ELEVENLABS_VOICE_ID'].filter(Boolean).join(', ')}\n` +
      '           Der Sprechtext liegt trotzdem bereit und lässt sich von Hand vertonen.'
  )
  process.exit(0)
}

const text = readFileSync(QUELLE, 'utf8').trim()
if (text.length === 0) {
  console.error(`[vertonen] ${QUELLE} ist leer – ohne Text keine Aufnahme.`)
  process.exit(1)
}

console.log(`[vertonen] ${text.length} Zeichen, Modell ${MODELL}.`)

/*
  Drei Anläufe mit wachsendem Abstand. Eine Vertonung dauert je nach Länge
  eine halbe bis eine Minute; eine abgebrochene Verbindung ist der
  wahrscheinlichste Fehler und keiner, der beim zweiten Mal wiederkommt.
*/
let mp3: ArrayBuffer | null = null
for (const versuch of [1, 2, 3]) {
  const antwort = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(STIMME)}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': SCHLUESSEL,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: MODELL,
        voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0 },
      }),
    }
  ).catch((fehler: unknown) => {
    console.error(`[vertonen] Versuch ${versuch}: ${String(fehler)}`)
    return null
  })

  if (antwort?.ok) {
    mp3 = await antwort.arrayBuffer()
    break
  }

  if (antwort) {
    const grund = await antwort.text().catch(() => '')
    console.error(
      `[vertonen] Versuch ${versuch}: Status ${antwort.status}. ${grund.slice(0, 300)}`
    )
    /* Ein abgelehnter Schlüssel oder ein aufgebrauchtes Kontingent wird beim
       zweiten Versuch nicht besser – da lohnt kein Warten. */
    if (antwort.status === 401 || antwort.status === 403) break
  }
  if (versuch < 3) await new Promise((weiter) => setTimeout(weiter, versuch * 10_000))
}

if (!mp3) {
  console.error(
    '::error::[vertonen] Die Vertonung ist fehlgeschlagen.\n' +
      '           Der Sprechtext liegt unter podcast-folge/sprechtext.txt bereit.'
  )
  process.exit(1)
}

writeFileSync(ZIEL, Buffer.from(mp3))
const groesse = statSync(ZIEL).size
console.log(`[vertonen] ${ZIEL} geschrieben – ${(groesse / 1024 / 1024).toFixed(1)} MB.`)

/* Eine Datei unter 100 KB ist bei fünf Minuten Text keine Aufnahme, sondern
   eine Fehlermeldung im Audioformat. */
if (groesse < 100_000) {
  console.error(
    `::error::[vertonen] Die Datei ist mit ${groesse} Bytes zu klein für fünf Minuten.`
  )
  process.exit(1)
}
