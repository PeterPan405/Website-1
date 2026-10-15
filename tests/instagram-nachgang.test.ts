/**
 * Nach dem Beitrag: Kommentare an – und **keine** Story. Anlass in
 * `lib/instagram-nachgang.ts`.
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
function attrappe(fehler: string | null) {
  const aufrufe: Aufruf[] = []
  const holen = (async (adresse: string, init?: RequestInit) => {
    const felder = Object.fromEntries(new URLSearchParams(String(init?.body ?? '')))
    delete felder.access_token
    aufrufe.push({ pfad: adresse.replace('https://graph.test/', ''), felder })
    return new Response(
      JSON.stringify(
        fehler ? { error: { code: 100, message: fehler } } : { success: true }
      )
    )
  }) as typeof fetch
  return { aufrufe, holen }
}

const grund = {
  api: 'https://graph.test',
  token: 'geheim',
  beitrag: 'beitrag-1',
  melde: () => {},
}

{
  const { aufrufe, holen } = attrappe(null)
  const e = await nachgang({ ...grund, holen })
  pruefe('Kommentare werden eingeschaltet', e.kommentare)
  pruefe(
    '… am Beitrag, mit comment_enabled=true',
    aufrufe[0]?.pfad === 'beitrag-1' && aufrufe[0]?.felder.comment_enabled === 'true',
    JSON.stringify(aufrufe[0])
  )
  pruefe(
    'und sonst nichts – keine Story ohne Verweis zum Beitrag',
    aufrufe.length === 1 && !aufrufe.some((a) => a.felder.media_type === 'STORIES'),
    JSON.stringify(aufrufe)
  )
}

{
  const { holen } = attrappe('kaputt')
  let geworfen = false
  let e: { kommentare: boolean } | null = null
  try {
    e = await nachgang({ ...grund, holen })
  } catch {
    geworfen = true
  }
  pruefe('ein Fehlschlag wirft nicht', !geworfen)
  pruefe('und meldet: keine Kommentare', e?.kommentare === false)
}

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
