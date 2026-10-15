/**
 * Was nach jedem Beitrag geschieht – Kommentare offen, dann die Story.
 *
 * Anordnung des Betreibers vom 15.10.2026, für die Tagesnews und die
 * Zahlenkarte:
 *
 *   - „Kommentare sind erlaubt" → `comment_enabled=true` am Beitrag, damit
 *     eine Einstellung im Konto sie nicht still abschaltet.
 *   - „Beitrag danach in die Story posten" → dasselbe Bild als Story
 *     (`media_type=STORIES`); bei den Tagesnews die erste Kachel.
 *   - „Post als KI-Inhalt markieren" → `is_ai_generated` steht schon am
 *     Beitrag; die Story trägt es auch, und lehnt Meta es dort ab, geht sie
 *     ohne hinaus und der Lauf sagt es.
 *
 * **Was die Schnittstelle nicht kann** (nachgelesen am 15.10.2026, Metas
 * Referenz zu IG Media und Content Publishing): Like- und Teilen-Zahlen
 * verbergen – das gibt es nur in der App, je Beitrag. Musik an Beitrag oder
 * Story – ebenfalls nur in der App. Und die Story ist ein eigenes Bild, kein
 * geteilter Beitrag: Ein Verweis-Sticker auf den Beitrag lässt sich nicht
 * setzen.
 *
 * **Ein Fehlschlag hier ist eine Warnung, kein roter Lauf.** Der Beitrag
 * steht dann schon; ein zweiter Lauf würde ihn nicht doppelt schicken, die
 * Story aber auch nicht nachholen – deshalb sagt die Warnung, was fehlt.
 */

export interface Nachgang {
  api: string
  token: string
  konto: string
  /** Die Kennung des veröffentlichten Beitrags. */
  beitrag: string
  /** Öffentliche Adresse des Bildes für die Story (JPEG). */
  storyBild: string
  melde: (text: string) => void
  /** Für Tests: statt `fetch`. */
  holen?: typeof fetch
  /** Für Tests: Wartezeit zwischen zwei Zustandsabfragen. */
  takt_ms?: number
}

export async function nachgang(n: Nachgang): Promise<{
  kommentare: boolean
  story: string | null
}> {
  const holen = n.holen ?? fetch
  const takt = n.takt_ms ?? 3000
  // Am Zeilenanfang, sonst erkennt GitHub die Warnung nicht.
  const warne = (text: string) => console.log(`::warning::${text}`)

  async function post(pfad: string, felder: Record<string, string>) {
    const antwort = await holen(`${n.api}/${pfad}`, {
      method: 'POST',
      body: new URLSearchParams({ ...felder, access_token: n.token }),
    })
    const daten = (await antwort.json()) as Record<string, unknown> & {
      error?: { message?: string; code?: number }
    }
    if (daten.error)
      throw new Error(
        `Meta lehnt ab (${daten.error.code ?? '?'}): ${daten.error.message ?? 'ohne Grund'}`
      )
    return daten
  }

  let kommentare = false
  try {
    await post(n.beitrag, { comment_enabled: 'true' })
    kommentare = true
    n.melde('Kommentare: an.')
  } catch (fehler) {
    warne(`Kommentare ließen sich nicht einschalten – ${(fehler as Error).message}`)
  }

  let story: string | null = null
  try {
    let behaelter: string
    try {
      behaelter = String(
        (
          await post(`${n.konto}/media`, {
            media_type: 'STORIES',
            image_url: n.storyBild,
            is_ai_generated: 'true',
          })
        ).id
      )
    } catch (fehler) {
      warne(
        `Story mit KI-Kennzeichen abgelehnt – ${(fehler as Error).message}. Sie geht ohne hinaus.`
      )
      behaelter = String(
        (
          await post(`${n.konto}/media`, {
            media_type: 'STORIES',
            image_url: n.storyBild,
          })
        ).id
      )
    }
    for (let i = 0; ; i++) {
      const z = (await (
        await holen(
          `${n.api}/${behaelter}?fields=status_code&access_token=${encodeURIComponent(n.token)}`
        )
      ).json()) as { status_code?: string }
      if (z.status_code === 'FINISHED') break
      if (z.status_code === 'ERROR' || i >= 30)
        throw new Error(`Story-Behälter ${behaelter}: ${z.status_code ?? 'unbekannt'}`)
      await new Promise((r) => setTimeout(r, takt))
    }
    story = String(
      (await post(`${n.konto}/media_publish`, { creation_id: behaelter })).id
    )
    n.melde(`Story: ${story}`)
  } catch (fehler) {
    warne(
      `Die Story fehlt – ${(fehler as Error).message}. Der Beitrag steht; die Story bitte in der App nachreichen.`
    )
  }
  return { kommentare, story }
}
