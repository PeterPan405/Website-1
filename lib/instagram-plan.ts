/**
 * Der Plan für den Instagram-Beitrag des Tages – „Top-News des Tages".
 *
 * ## Woher das Muster stammt
 *
 * Nicht ausgedacht, sondern abgelesen: an den 54 Tagesbeiträgen, die von
 * Ende Juli bis zum 9. Oktober 2026 bei @im_invests erschienen sind (Abzug
 * über die Graph-Schnittstelle am 11.10.2026). Der Betreiber hat es so
 * angeordnet: „Ich möchte keine neuen Experimente, sondern erstmal dabei
 * bleiben." Was hier steht, ist deshalb die Beschreibung dessen, was war –
 * Zahlen mit Herkunft, keine Geschmacksentscheidung. Die Herleitung steht in
 * `INSTAGRAM.md`.
 *
 *   – Ein Deckblatt und **genau fünf** Meldungskacheln. 54 von 54.
 *   – **Nur montags bis freitags.** 54 von 54 Werktagen, 0 von 22
 *     Wochenendtagen.
 *   – Jede Kachel: eine kurze Überschrift („KI-Werte unter Druck",
 *     „Öl +10 %") und zwei bis drei Sätze.
 *   – Die Beschriftung: fester Kopf, ein bis zwei Sätze zu den fünf Themen,
 *     „Alle fünf Entwicklungen im Überblick. Quelle: iminvests.de", der
 *     Rechtshinweis mit KI-Hinweis, **genau fünf** Schlagworte. 127 von 130
 *     Beiträgen tragen fünf.
 *
 * ## Warum diese Datei kein JSX enthält
 *
 * Sie wird von `scripts/nachrichten-erzeugen.ts` geladen, und Node übersetzt
 * kein JSX. Prüfung und Beschriftung stehen deshalb hier, das Setzen der
 * Bilder in `lib/instagram-bild.ts`.
 */

/** Ein Plan, wie ihn der Agent neben die Tagesausgabe legt. */
export interface InstagramPlan {
  /** Ein bis zwei Sätze, die die fünf Themen nennen – für die Beschriftung. */
  zusammenfassung: string
  /** Genau fünf Kacheln, in der Reihenfolge des Karussells. */
  kacheln: { titel: string; text: string }[]
  /** Genau fünf Schlagworte, klein, ohne `#`. */
  schlagworte: string[]
}

/*
  Die Grenzen sind am Bestand gemessen, nicht geschätzt.

  Überschriften im Kanal: von „Öl" (2 Zeichen) bis „Palantir: Bewertung im
  Fokus" (28). Mehr passt in Anton bei 108 px nicht in zwei Zeilen von 900 px
  Breite; das prüft `tests/instagram-tagesnews.test.ts` am gesetzten Bild,
  nicht an dieser Zahl.

  Text: drei bis fünf Zeilen Noto Sans bei 46 px – im Kanal nie mehr als
  fünf (am 9.10.: 127 bis 178 Zeichen, drei bis fünf Zeilen). Gemessen am
  gesetzten Bild mit langen Wörtern: 188 Zeichen sind fünf Zeilen, 206 schon
  sechs. Daher 190. Unter 100 ist es keine Meldung mehr, sondern eine Zeile.
*/
export const KACHELN = 5
export const TITEL_MAX = 28
export const TEXT_MIN = 100
export const TEXT_MAX = 190
export const ZUSAMMENFASSUNG_MIN = 60
export const ZUSAMMENFASSUNG_MAX = 300
export const SCHLAGWORTE = 5

/**
 * Der Rechtshinweis, **wörtlich** wie in 59 von 59 Beiträgen seit dem
 * 6. September 2026 – einschließlich des KI-Hinweises am Ende.
 *
 * Der Betreiber am 11.10.2026: „Der KI-Hinweis muss hin." Er steht deshalb
 * nicht im Plan, den ein Modell schreibt, sondern hier, wo ihn niemand
 * weglassen kann.
 */
export const RECHTSHINWEIS =
  'Keine Anlageberatung – nur Wissensvermittlung\n' +
  'Alle Inhalte dieses Accounts dienen der allgemeinen Information und Bildung. ' +
  'Sie stellen keine Anlage-, Rechts- oder Steuerberatung dar und berücksichtigen ' +
  'weder deine persönliche Situation noch deine Anlageziele. Kurse, Kennzahlen und ' +
  'Rechenergebnisse sind Beispielwerte beziehungsweise Schätzungen. Jede ' +
  'Kapitalanlage ist mit Risiken verbunden, bis zum vollständigen Verlust des ' +
  'eingesetzten Geldes. Hinweis: Die Inhalte wurden mit Unterstützung von KI erstellt.'

/** Der feste Kopf – so in den jüngsten Tagesbeiträgen (8. und 9. Oktober). */
export const KOPF = 'Die wichtigsten Börsennews des Tages. 📈'
export const UEBERBLICK = 'Alle fünf Entwicklungen im Überblick. Quelle: iminvests.de'

/**
 * Die Anweisung an das Modell – **eine** Fassung für beide Wege.
 *
 * Sie steht wörtlich in `scripts/nachrichten-erzeugen.ts` (Weg über die
 * Schnittstelle) und in `.github/workflows/nachrichten-agent.yml` (der
 * Agent). `tests/instagram-tagesnews.test.ts` prüft, dass der Workflow sie
 * enthält – zwei Fassungen derselben Anweisung laufen sonst auseinander.
 *
 * Die Vorbilder sind echte Kacheln aus dem Kanal, nicht ausgedacht.
 */
export const ANWEISUNG_INSTAGRAM = `Aus dem Feld \`instagram\` entsteht „Top-News des Tages" bei @im_invests: ein Deckblatt und fünf Kacheln, montags bis freitags. Er muss aussehen wie die 54 Beiträge davor – keine neue Form, keine Experimente.

- \`kacheln\`: **genau fünf** – die fünf wichtigsten Meldungen der Ausgabe für Anleger, wichtigste zuerst. Märkte, Notenbanken, Konjunktur und große Unternehmen gehen vor. Krieg und Politik kommen nur über ihre Marktfolge hinein – „Öl über 100 Dollar", „USA & Iran", nicht die Zahl der Opfer.
  - \`titel\`: höchstens ${TITEL_MAX} Zeichen, zwei bis vier Wörter, mit Zahl, wenn es eine gibt. Vorbilder aus dem Kanal: „KI-Werte unter Druck", „Öl +10 %", „Fresenius: Chefwechsel", „2,3 Mrd. für Siemens", „Euro nahe Tief", „EZB".
  - \`text\`: ${TEXT_MIN} bis ${TEXT_MAX} Zeichen, zwei bis drei Sätze – die Nachricht mit Zahl und Namen, ohne Einordnung. Vorbild: „Der Nasdaq gab wegen Sorgen um OpenAI und andere KI-Werte nach, während der Dow stabil blieb. TSMC meldete gleichzeitig einen Rekordumsatz."
- \`zusammenfassung\`: ein bis zwei Sätze, ${ZUSAMMENFASSUNG_MIN} bis ${ZUSAMMENFASSUNG_MAX} Zeichen, die die fünf Themen nennen. Vorbild: „KI-Aktien unter Druck, Brasiliens Börse auf Rekordhoch und steigende Ölpreise. Gleichzeitig sorgen Frankreichs Haushaltsprobleme und die Entwicklungen rund um die EZB für Aufmerksamkeit."
- \`schlagworte\`: **genau fünf**, kleingeschrieben, ohne \`#\`. Zwei bis drei passen zu den Themen des Tages (etwa \`öl\`, \`ezb\`, \`fed\`, \`dax\`, \`inflation\`), der Rest aus \`news\`, \`top\`, \`daily\`, \`finanzen\`, \`wirtschaft\`, \`investieren\`, \`aktien\`.
- Kein Emoji, kein \`#\` im Text. Kopf, Rechtshinweis und KI-Hinweis setzt das Skript selbst.
- Es gelten dieselben Grundsätze wie für die Ausgabe: nur, was in den Quellen steht, keine Wertung.`

/** Emoji gehören in den Kopf, nicht in die Kacheln oder die Zusammenfassung. */
const BILDZEICHEN = /\p{Extended_Pictographic}/u

/**
 * Erscheint an diesem Tag ein Tagesbeitrag?
 *
 * Gefragt wird das **Datum der Ausgabe** (deutscher Kalendertag), nicht die
 * Uhr des Läufers – der Lauf beginnt kurz nach Mitternacht UTC, und dann ist
 * es in Berlin schon der nächste Tag.
 */
export function istErscheinungstag(datum: string): boolean {
  const tag = new Date(`${datum}T12:00:00Z`).getUTCDay()
  return tag >= 1 && tag <= 5
}

/** Alle Verstöße gegen das Muster, als lesbare Sätze. Leer heißt: in Ordnung. */
export function pruefeInstagramPlan(plan: unknown): string[] {
  const fehler: string[] = []
  if (!plan || typeof plan !== 'object') return ['Der Plan fehlt.']
  const p = plan as Partial<InstagramPlan>

  if (typeof p.zusammenfassung !== 'string') {
    fehler.push('`zusammenfassung` fehlt.')
  } else {
    const n = p.zusammenfassung.trim().length
    if (n < ZUSAMMENFASSUNG_MIN || n > ZUSAMMENFASSUNG_MAX)
      fehler.push(
        `\`zusammenfassung\` hat ${n} Zeichen, erlaubt sind ${ZUSAMMENFASSUNG_MIN} bis ${ZUSAMMENFASSUNG_MAX}.`
      )
    if (BILDZEICHEN.test(p.zusammenfassung))
      fehler.push('`zusammenfassung` enthält ein Emoji – das steht nur im festen Kopf.')
    if (p.zusammenfassung.includes('#'))
      fehler.push(
        '`zusammenfassung` enthält ein `#` – Schlagworte gehören in `schlagworte`.'
      )
  }

  if (!Array.isArray(p.kacheln) || p.kacheln.length !== KACHELN) {
    fehler.push(
      `\`kacheln\` braucht genau ${KACHELN} Einträge, es sind ${Array.isArray(p.kacheln) ? p.kacheln.length : 0}.`
    )
  } else {
    p.kacheln.forEach((k, i) => {
      const nr = i + 1
      const titel = typeof k?.titel === 'string' ? k.titel.trim() : ''
      const text = typeof k?.text === 'string' ? k.text.trim() : ''
      if (!titel) fehler.push(`Kachel ${nr}: \`titel\` fehlt.`)
      else if (titel.length > TITEL_MAX)
        fehler.push(
          `Kachel ${nr}: \`titel\` „${titel}" hat ${titel.length} Zeichen, höchstens ${TITEL_MAX}. Kürzer – „KI-Werte unter Druck", „Öl +10 %".`
        )
      if (text.length < TEXT_MIN || text.length > TEXT_MAX)
        fehler.push(
          `Kachel ${nr}: \`text\` hat ${text.length} Zeichen, erlaubt sind ${TEXT_MIN} bis ${TEXT_MAX}.`
        )
      if (BILDZEICHEN.test(titel + text))
        fehler.push(`Kachel ${nr}: kein Emoji auf der Kachel.`)
    })
    const titel = p.kacheln.map((k) =>
      String(k?.titel ?? '')
        .trim()
        .toLowerCase()
    )
    if (new Set(titel).size !== titel.length)
      fehler.push('Zwei Kacheln tragen dieselbe Überschrift.')
  }

  if (!Array.isArray(p.schlagworte) || p.schlagworte.length !== SCHLAGWORTE) {
    fehler.push(
      `\`schlagworte\` braucht genau ${SCHLAGWORTE} Einträge, es sind ${Array.isArray(p.schlagworte) ? p.schlagworte.length : 0}.`
    )
  } else {
    for (const w of p.schlagworte) {
      if (typeof w !== 'string' || !/^[a-zäöüß0-9]{2,30}$/.test(w))
        fehler.push(
          `Schlagwort „${String(w)}" – nur Kleinbuchstaben und Ziffern, ohne \`#\` und ohne Leerzeichen.`
        )
    }
    if (new Set(p.schlagworte).size !== p.schlagworte.length)
      fehler.push('Ein Schlagwort steht doppelt.')
  }

  return fehler
}

/** Was an einem Tag für Instagram vorliegt – und wenn nichts, warum. */
export type Tagesstand =
  | { datum: string; status: 'tagesnews'; plan: InstagramPlan }
  | { datum: string; status: 'kein-beitrag'; grund: string }

/**
 * Der Stand eines Tages aus dem Rohtext von `data/instagram/<datum>.json`.
 *
 * Nimmt den Text, nicht den Pfad: So prüft der Test dieselbe Entscheidung,
 * die der Bau trifft, ohne Dateien anzulegen.
 */
export function tagesstand(datum: string, rohtext: string | null): Tagesstand {
  if (!istErscheinungstag(datum))
    return {
      datum,
      status: 'kein-beitrag',
      grund: 'Wochenende – Tagesbeiträge erscheinen montags bis freitags.',
    }
  if (rohtext === null)
    return {
      datum,
      status: 'kein-beitrag',
      grund: `Für den ${datum} liegt kein Instagram-Plan vor.`,
    }
  let plan: unknown
  try {
    plan = JSON.parse(rohtext)
  } catch {
    return {
      datum,
      status: 'kein-beitrag',
      grund: 'Der Instagram-Plan ist kein gültiges JSON.',
    }
  }
  const fehler = pruefeInstagramPlan(plan)
  if (fehler.length > 0)
    return {
      datum,
      status: 'kein-beitrag',
      grund: `Der Instagram-Plan ist fehlerhaft: ${fehler.join(' ')}`,
    }
  return { datum, status: 'tagesnews', plan: plan as InstagramPlan }
}

/**
 * Die Beschriftung unter dem Beitrag, in der Form der jüngsten Tagesbeiträge.
 *
 * Die Schlagworte hängen am letzten Satz des Rechtshinweises, durch ein
 * Leerzeichen getrennt – so stehen sie in allen Beiträgen seit August.
 */
export function beschriftungTagesnews(plan: InstagramPlan): string {
  return [
    KOPF,
    '',
    plan.zusammenfassung.trim(),
    '',
    UEBERBLICK,
    '',
    `${RECHTSHINWEIS} ${plan.schlagworte.map((w) => `#${w}`).join(' ')}`,
  ].join('\n')
}
