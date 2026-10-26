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
 *   – Bis zum 16.10.2026 **nur montags bis freitags** (54 von 54
 *     Werktagen, 0 von 22 Wochenendtagen). Seit dem 17.10.2026 **täglich**,
 *     Anordnung des Betreibers: „mache aber jetzt täglich News des Tages".
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

  Text: drei bis fünf Zeilen Open Sans (bis 16.10.2026 Noto Sans, gleiche
  Umbrüche) bei 46 px – im Kanal nie mehr als
  fünf (am 9.10.: 127 bis 178 Zeichen, drei bis fünf Zeilen). Gemessen am
  gesetzten Bild mit langen Wörtern: 188 Zeichen sind fünf Zeilen, 206 schon
  sechs. Daher 190. Unter 100 ist es keine Meldung mehr, sondern eine Zeile.
*/
export const KACHELN = 5
/*
  Sonntags und montags dürfen es weniger sein (Betreiber, 18.10.2026): Der
  Samstag bildet den Freitag ab, Sonntag und Montag das Wochenende – „so
  viel Börsen-News gibt es am Wochenende nicht … mindestens aber vier
  Slides mit drei News". Lieber drei neue als fünf mit Wiederholungen.
*/
export const KACHELN_MIN_WOCHENENDE = 3

/** Wie viele Kacheln an diesem Tag erlaubt sind – sonntags und montags drei bis fünf. */
export function kachelnErlaubt(datum?: string): { min: number; max: number } {
  const tag = datum ? new Date(`${datum}T12:00:00Z`).getUTCDay() : -1
  return tag === 0 || tag === 1
    ? { min: KACHELN_MIN_WOCHENENDE, max: KACHELN }
    : { min: KACHELN, max: KACHELN }
}
export const TITEL_MAX = 28
export const TEXT_MIN = 100
export const TEXT_MAX = 190
export const ZUSAMMENFASSUNG_MIN = 60
export const ZUSAMMENFASSUNG_MAX = 300
export const SCHLAGWORTE = 5

/**
 * Höchstens so viele Sätze je Kachel.
 *
 * Bis zum 14. Oktober 2026 hieß es „zwei bis drei" – abgelesen an den 54
 * Beiträgen davor. Am 14. Oktober kam das Briefing des Betreibers: „Maximal
 * zwei kurze Sätze." Das ist keine Neuerung im Sinne von „keine
 * Experimente", sondern eine Anordnung derselben Stelle, die den Kanal führt.
 */
export const SAETZE_MAX = 2

/*
  Abkürzungen, nach denen ein Punkt kein Satzende ist. Dazu jede Zahl mit
  Punkt – „im 3. Quartal" ist eine Ordnungszahl, kein zweiter Satz – und
  jeder einzelne Buchstabe: „z. B.", „U.S.", „Donald J. Trump".
*/
const ABKUERZUNG =
  /(?:\b(?:Mrd|Mio|Tsd|Bio|Nr|Dr|Prof|bzw|ca|inkl|vgl|evtl|etc|Abs|Jh|St|[A-Za-zÄÖÜäöü])|\d)\.$/

/** Zählt die Sätze eines Kacheltexts. */
export function saetze(text: string): number {
  const teile = text.trim().split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ0-9„"])/)
  let anzahl = 0
  let davor = ''
  for (const teil of teile) {
    if (!davor || !ABKUERZUNG.test(davor)) anzahl++
    davor = teil
  }
  return text.trim() ? anzahl : 0
}

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
 * Der Überblick mit der wirklichen Zahl der Kacheln – sonntags und montags
 * sind es drei bis fünf. Am 26.10.2026 stand „Alle fünf" unter vier.
 */
export function ueberblick(anzahl: number): string {
  const zahl = ['', 'eine', 'zwei', 'drei', 'vier', 'fünf'][anzahl] ?? String(anzahl)
  return anzahl === 1
    ? 'Die Entwicklung im Überblick. Quelle: iminvests.de'
    : `Alle ${zahl} Entwicklungen im Überblick. Quelle: iminvests.de`
}

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
export const ANWEISUNG_INSTAGRAM = `Aus dem Feld \`instagram\` entsteht „Top-News des Tages" bei @im_invests: ein Deckblatt und fünf Kacheln, jeden Tag – auch samstags und sonntags.

- \`kacheln\`: **genau fünf**, So/Mo 3–5, nach Relevanz – was die breite Masse packt: Zins, Inflation, Öl, Gold, DAX, Bitcoin, Weltkonzerne; nicht EQT/Qiagen. **Kein Thema aus den Kacheln der letzten drei Tage** (\`data/instagram/\`), außer bei starker Veränderung – die Prüfung weist es zurück. Fehlt eine, nimm eine aus den Quellen. Krieg und Politik nur über die Marktfolge.
- **So/Mo** auch Politik und Termine der Woche (nur aus Quellen).
  - \`titel\`: höchstens ${TITEL_MAX} Zeichen, zwei bis vier Wörter, mit Zahl, wenn es eine gibt. Vorbilder aus dem Kanal: „KI-Werte unter Druck", „Öl +10 %", „Fresenius: Chefwechsel", „2,3 Mrd. für Siemens", „Euro nahe Tief", „EZB".
  - \`text\`: ${TEXT_MIN} bis ${TEXT_MAX} Zeichen, **höchstens ${SAETZE_MAX} kurze Sätze** – die Nachricht mit Zahl und Namen, ohne Einordnung, ohne Fachbegriff, den ein Laie nachschlagen müsste, nichts Reißerisches. Vorbild: „Der Nasdaq gab wegen Sorgen um OpenAI und andere KI-Werte nach, während der Dow stabil blieb. TSMC meldete gleichzeitig einen Rekordumsatz."
- \`zusammenfassung\`: ein bis zwei Sätze, ${ZUSAMMENFASSUNG_MIN} bis ${ZUSAMMENFASSUNG_MAX} Zeichen, die die fünf Themen nennen.
- \`schlagworte\`: **genau fünf** (mehr nimmt Instagram nicht), kleingeschrieben, ohne \`#\`. Alle **themenbezogen und reichweitenstark** (Betreiber 15.10.2026: „müssen viral sein und themenbezogen“): zwei bis drei zu den Themen des Tages, so wie danach gesucht wird (etwa \`ölpreis\`, \`gold\`, \`ezb\`, \`fed\`, \`dax\`, \`inflation\`), der Rest aus großen deutschen Finanz-Hashtags: \`börse\`, \`aktien\`, \`finanzen\`, \`investieren\`, \`geldanlage\`, \`wirtschaft\`. Keine Füllwörter wie \`news\`, \`top\` oder \`daily\` – danach sucht niemand.
- Kein Emoji, kein \`#\` im Text. Kopf, Rechtshinweis und KI-Hinweis setzt das Skript selbst.
- Es gelten dieselben Grundsätze wie für die Ausgabe: nur, was in den Quellen steht, keine Wertung.`

/** Emoji gehören in den Kopf, nicht in die Kacheln oder die Zusammenfassung. */
const BILDZEICHEN = /\p{Extended_Pictographic}/u

/**
 * Erscheint an diesem Tag ein Tagesbeitrag?
 *
 * Seit dem 17.10.2026 an **jedem** Tag – der Betreiber: „mache aber jetzt
 * täglich News des Tages". Bis dahin nur montags bis freitags, so wie es im
 * Kanal gewesen war. Die Frage bleibt stehen, damit eine Ausnahme (ein
 * Feiertag, eine Pause) wieder eine Stelle hat.
 */
export function istErscheinungstag(datum: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(datum)
}

/** Alle Verstöße gegen das Muster, als lesbare Sätze. Leer heißt: in Ordnung. */
export function pruefeInstagramPlan(plan: unknown, datum?: string): string[] {
  const { min, max } = kachelnErlaubt(datum)
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

  if (!Array.isArray(p.kacheln) || p.kacheln.length < min || p.kacheln.length > max) {
    fehler.push(
      `\`kacheln\` braucht ${min === max ? `genau ${max}` : `${min} bis ${max}`} Einträge, es sind ${Array.isArray(p.kacheln) ? p.kacheln.length : 0}.`
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
      if (saetze(text) > SAETZE_MAX)
        fehler.push(
          `Kachel ${nr}: ${saetze(text)} Sätze, höchstens ${SAETZE_MAX} – „maximal zwei kurze Sätze" (Briefing vom 14.10.2026).`
        )
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

/**
 * Wörter, die in vielen Überschriften stehen und kein Thema bezeichnen.
 */
const KEIN_THEMA = new Set([
  'rekord',
  'prognose',
  'zahlen',
  'aktie',
  'aktien',
  'jobs',
  'index',
  'heute',
  'woche',
  'bilanzwoche',
  'mrd',
  'mio',
  'milliarden',
  'millionen',
  'dollar',
  'euro',
  'prozent',
  'plus',
  'minus',
  'hoch',
  'tief',
  'streik',
  'warnstreik',
  'gewinn',
  'umsatz',
  'rendite',
  'inflation',
  'zins',
  'zinsen',
  'leitzins',
  'markt',
  'märkte',
  'börse',
  'börsen',
  'kurs',
  'kurse',
  'quartal',
  'neue',
  'neuer',
  'mehr',
  'weniger',
  'nach',
  'trotz',
  'über',
  'unter',
  'gegen',
  'banken',
  'bank',
  'werk',
  'chef',
  'co',
])

/** Die Themenwörter einer Überschrift: Namen von Ländern, Firmen, Rohstoffen. */
export function themenwoerter(titel: string): Set<string> {
  return new Set(
    (titel.match(/\p{Lu}[\p{L}&]*/gu) ?? [])
      .map((w) => w.toLowerCase())
      .filter((w) => (w.length >= 3 || w === 'öl') && !KEIN_THEMA.has(w))
  )
}

/**
 * Kacheln, deren Thema schon in den letzten Tagen dran war.
 *
 * Betreiber, 26.10.2026, nach dem dritten Frankreich-Beitrag in fünf Tagen
 * (22.10. „Frankreich: Rendite 5 %", 24.10. „Frankreich: Aa3 bestätigt",
 * 26.10. „Frankreich: Rendite-Rekord"): „schau darauf, dass es keine
 * Doppelungen zu den Vortagen gibt. Außer es hat sich irgendetwas stark
 * verändert." Ob es das hat, kann eine Prüfung nicht wissen – sie meldet
 * jede Überschneidung, und wer eine Ausnahme will, schreibt sie bewusst.
 */
export function themaWiederholt(
  kacheln: { titel: string }[],
  frueher: { datum: string; kacheln: { titel: string }[] }[]
): string[] {
  const meldungen: string[] = []
  for (const [i, k] of kacheln.entries()) {
    const jetzt = themenwoerter(k.titel)
    for (const tag of frueher)
      for (const alt of tag.kacheln) {
        const gleich = [...themenwoerter(alt.titel)].filter((w) => jetzt.has(w))
        if (gleich.length)
          meldungen.push(
            `Kachel ${i + 1} „${k.titel}" wiederholt „${alt.titel}" vom ${tag.datum} (${gleich.join(', ')}) – kein Thema der letzten drei Tage.`
          )
      }
  }
  return meldungen
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
      grund: `${datum} ist kein Datum der Form JJJJ-MM-TT.`,
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
  const fehler = pruefeInstagramPlan(plan, datum)
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
export function beschriftungTagesnews(plan: InstagramPlan, nachweis = ''): string {
  return [
    KOPF,
    '',
    plan.zusammenfassung.trim(),
    '',
    ueberblick(plan.kacheln.length),
    '',
    /* Seit 21.10.2026: Fotos unter CC BY/BY-SA verlangen Urheber und Lizenz. */
    ...(nachweis ? [nachweis, ''] : []),
    `${RECHTSHINWEIS} ${plan.schlagworte.map((w) => `#${w}`).join(' ')}`,
  ].join('\n')
}
