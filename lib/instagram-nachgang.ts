/**
 * Was nach jedem Beitrag geschieht – die Kommentare bleiben offen.
 *
 * Anordnung des Betreibers vom 15.10.2026, für die Tagesnews und die
 * Zahlenkarte: „Kommentare sind erlaubt" → `comment_enabled=true` am
 * Beitrag, damit eine Einstellung im Konto sie nicht still abschaltet. Das
 * Kennzeichen „KI-Inhalt" setzt der Veröffentlicher schon am Beitrag selbst
 * (`is_ai_generated`).
 *
 * **Keine Story von hier.** Der Betreiber will den Beitrag in der Story so
 * geteilt haben, „dass man das anklicken kann und dann zum Beitrag geleitet
 * wird". Das kann Metas Schnittstelle nicht: Sie stellt nur ein eigenes Bild
 * als Story ein (`media_type=STORIES`), ohne Verweis zum Beitrag – Sticker
 * sind laut Metas Content-Publishing-Referenz nicht unterstützt. Eine solche
 * Story stand einen Tag lang hier drin (#402) und ist wieder entfernt: Sie
 * wäre neben der geteilten des Betreibers eine zweite, ohne Verweis. Teilen
 * in die Story, Likes verbergen und Sound macht der Betreiber in der App.
 *
 * **Ein Fehlschlag hier ist eine Warnung, kein roter Lauf.** Der Beitrag
 * steht dann schon.
 */

export interface Nachgang {
  api: string
  token: string
  /** Die Kennung des veröffentlichten Beitrags. */
  beitrag: string
  melde: (text: string) => void
  /** Für Tests: statt `fetch`. */
  holen?: typeof fetch
}

export async function nachgang(n: Nachgang): Promise<{ kommentare: boolean }> {
  const holen = n.holen ?? fetch
  try {
    const antwort = await holen(`${n.api}/${n.beitrag}`, {
      method: 'POST',
      body: new URLSearchParams({ comment_enabled: 'true', access_token: n.token }),
    })
    const daten = (await antwort.json()) as {
      error?: { message?: string; code?: number }
    }
    /*
      Code 10 heißt: Dem Zugang fehlt die Berechtigung zum Verwalten von
      Kommentaren. So ist es seit dem ersten Lauf (15.10.2026) – jeden Tag
      eine Warnung dafür wäre Lärm, der eine echte überdeckt. Die Kommentare
      stehen auf Instagram ohnehin offen; gemeldet wird es als Hinweis.
    */
    if (daten.error?.code === 10) {
      n.melde(
        'Kommentare: nicht umgestellt – dem Zugang fehlt die Berechtigung; sie sind ohnehin offen.'
      )
      return { kommentare: false }
    }
    if (daten.error)
      throw new Error(
        `Meta lehnt ab (${daten.error.code ?? '?'}): ${daten.error.message ?? 'ohne Grund'}`
      )
    n.melde('Kommentare: an.')
    return { kommentare: true }
  } catch (fehler) {
    // Am Zeilenanfang, sonst erkennt GitHub die Warnung nicht.
    console.log(
      `::warning::Kommentare ließen sich nicht einschalten – ${(fehler as Error).message}`
    )
    return { kommentare: false }
  }
}
