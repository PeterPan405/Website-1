/**
 * Nach dem Beitrag: Kommentare an, Story hinterher – an einer nachgebauten
 * Schnittstelle. Anlass in `lib/instagram-nachgang.ts`.
 *
 * Ausführen mit `npm test`. Geprüft wird, was hinausgeht, und dass ein
 * Fehlschlag den Lauf **nicht** abbricht – der Beitrag steht dann schon.
 */
import { nachgang } from '@/lib/instagram-nachgang'

let failed = 0
function pruefe(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) console.log(`OK   ${was}`)
  else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

type Aufruf = { pfad: string; felder: Record<string, string> }

/** Eine Schnittstelle, die sich aufschreibt, was ankommt. */
function attrappe(ablehnen: (a: Aufruf) => string | null) {
  const aufrufe: Aufruf[] = []
  const holen = (async (adresse: string, init?: RequestInit) => {
    const pfad = adresse.replace('https://graph.test/', '').split('?')[0]
    if (!init) return new Response(JSON.stringify({ status_code: 'FINISHED' }))
    const felder = Object.fromEntries(new URLSearchParams(String(init.body)))
    delete felder.access_token
    const a = { pfad, felder }
    aufrufe.push(a)
    const grund = ablehnen(a)
    if (grund)
      return new Response(JSON.stringify({ error: { code: 100, message: grund } }))
    return new Response(JSON.stringify({ id: `id-${aufrufe.length}` }))
  }) as typeof fetch
  return { aufrufe, holen }
}

const grund = {
  api: 'https://graph.test',
  token: 'geheim',
  konto: 'konto',
  beitrag: 'beitrag-1',
  storyBild: 'https://iminvests.de/instagram/zahlenkarte.jpg',
  melde: () => {},
  takt_ms: 0,
}

/* Der gute Fall. */
{
  const { aufrufe, holen } = attrappe(() => null)
  const e = await nachgang({ ...grund, holen })
  pruefe('Kommentare werden eingeschaltet', e.kommentare)
  pruefe(
    '… am Beitrag, mit comment_enabled=true',
    aufrufe[0]?.pfad === 'beitrag-1' && aufrufe[0]?.felder.comment_enabled === 'true',
    JSON.stringify(aufrufe[0])
  )
  const story = aufrufe.find((a) => a.felder.media_type === 'STORIES')
  pruefe('die Story bekommt dasselbe Bild', story?.felder.image_url === grund.storyBild)
  pruefe('die Story ist als KI-Inhalt markiert', story?.felder.is_ai_generated === 'true')
  pruefe(
    'die Story wird veröffentlicht',
    aufrufe.some((a) => a.pfad === 'konto/media_publish') && e.story !== null
  )
}

/* Meta lehnt das KI-Kennzeichen an der Story ab – sie geht ohne hinaus. */
{
  const { aufrufe, holen } = attrappe((a) =>
    a.felder.media_type === 'STORIES' && a.felder.is_ai_generated
      ? 'unbekanntes Feld'
      : null
  )
  const e = await nachgang({ ...grund, holen })
  const stories = aufrufe.filter((a) => a.felder.media_type === 'STORIES')
  pruefe(
    'zweiter Versuch ohne Kennzeichen',
    stories.length === 2 && !stories[1].felder.is_ai_generated
  )
  pruefe('und die Story steht trotzdem', e.story !== null)
}

/* Alles scheitert – der Lauf bricht nicht ab. */
{
  const { holen } = attrappe(() => 'kaputt')
  let geworfen = false
  let e: Awaited<ReturnType<typeof nachgang>> | null = null
  try {
    e = await nachgang({ ...grund, holen })
  } catch {
    geworfen = true
  }
  pruefe('ein Fehlschlag wirft nicht', !geworfen)
  pruefe(
    'und meldet: keine Kommentare, keine Story',
    e?.kommentare === false && e?.story === null
  )
}

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
