/**
 * Wann die Zahlenkarte hinausgeht – frühestens um 16 Uhr, und nur freigegeben.
 *
 * Am 15.10.2026 ging die erste Karte um 08:59 Uhr hinaus: Der Betreiber hatte
 * den Entwurf mit „so passt es" abgenommen, und das wurde als „jetzt
 * hochladen" gelesen. Seine Antwort: „warum hast du es schon hochgeladen" –
 * „der Beitrag des Tages kommt immer erst um 16 Uhr".
 *
 * Seitdem sind Freigabe und Veröffentlichung getrennt:
 *
 *   Freigabe          steht als Datum an der Karte (`freigabe` in
 *                     `data/instagram-zahlenkarten.ts`) und kommt mit dem
 *                     Bau auf die Website – Zeile 2 von `zahlenkarte.txt`
 *   Veröffentlichung  frühestens 16:00 Uhr deutscher Zeit; angestoßen vom
 *                     Dauerlauf (`kurse-dauerlauf.yml`, alle zehn Minuten),
 *                     der Cron in `instagram-zahlenkarte.yml` ist Rückfall
 *
 * Kommt die Freigabe nach 16 Uhr, geht die Karte beim nächsten Blick des
 * Dauerlaufs hinaus. Die Riegel stehen **auch** im Veröffentlicher
 * (`scripts/instagram-zahlenkarte.ts`) – ein Start von Hand vor 16 Uhr
 * schickt nichts.
 */

/** 16:00 Uhr deutscher Zeit, in Minuten seit Mitternacht. */
export const AB_MINUTE = 16 * 60

/** Kalendertag und Minute in Berlin – Sommer- und Winterzeit inklusive. */
export function berlinJetzt(jetzt: Date): { tag: string; minute: number } {
  const teile = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(jetzt)
      .map((t) => [t.type, t.value])
  )
  return {
    tag: `${teile.year}-${teile.month}-${teile.day}`,
    minute: Number(teile.hour) * 60 + Number(teile.minute),
  }
}

/**
 * `zahlenkarte.txt` gelesen:
 *
 *     Zeile 1     JJJJ-MM-TT – der Tag der Karte
 *     Zeile 2     „Freigabe: JJJJ-MM-TT" oder „Freigabe: -"
 *     ab Zeile 3  die Beschriftung, wie sie hinausgeht
 */
export function leseZahlenkarteText(text: string): {
  datum: string
  freigabe: string | null
  beschriftung: string
} {
  const [z1 = '', z2 = '', ...rest] = text.split('\n')
  const f = /^Freigabe: (\d{4}-\d{2}-\d{2})\s*$/.exec(z2)
  return {
    datum: z1.trim(),
    freigabe: f ? f[1] : null,
    beschriftung: rest.join('\n').trim(),
  }
}

export interface Zahlenkartenlage {
  /** Heute in Berlin, JJJJ-MM-TT. */
  tag: string
  /** Minute seit Mitternacht in Berlin. */
  minute: number
  /** Zeile 1 der Website. */
  datum: string
  /** Zeile 2 der Website. */
  freigabe: string | null
  /** Der Tag, an dem dieser Dauerlauf schon angestoßen hat – oder leer. */
  angestossenAm: string
}

/** Soll der Dauerlauf den Veröffentlicher jetzt anstoßen? */
export function sollZahlenkarteAnstossen(l: Zahlenkartenlage): {
  anstossen: boolean
  grund: string
} {
  if (l.minute < AB_MINUTE)
    return { anstossen: false, grund: 'vor 16 Uhr geht keine Zahlenkarte hinaus' }
  if (l.datum !== l.tag)
    return {
      anstossen: false,
      grund: `die Website zeigt die Karte vom ${l.datum || '–'}`,
    }
  if (l.freigabe !== l.tag)
    return { anstossen: false, grund: 'die Karte von heute ist nicht freigegeben' }
  if (l.angestossenAm === l.tag)
    return { anstossen: false, grund: 'heute schon angestoßen' }
  return { anstossen: true, grund: 'Karte von heute, freigegeben, 16 Uhr vorbei' }
}
