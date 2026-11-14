/**
 * Wann die Zahlenkarte hinausgeht – frühestens um 15 Uhr, und nur freigegeben.
 *
 * Am 15.10.2026 ging die erste Karte um 08:59 Uhr hinaus: Der Betreiber hatte
 * den Entwurf mit „so passt es" abgenommen, und das wurde als „jetzt
 * hochladen" gelesen. Seine Antwort: „warum hast du es schon hochgeladen" –
 * „der Beitrag des Tages kommt immer erst um 16 Uhr". Seit dem
 * 19.10.2026 ab 15 Uhr: „mach 15 Uhr, wenn es schon fertig ist, zukünftig".
 *
 * Seitdem sind Freigabe und Veröffentlichung getrennt:
 *
 *   Freigabe          steht als Datum an der Karte (`freigabe` in
 *                     `data/instagram-zahlenkarten.ts`) und kommt mit dem
 *                     Bau auf die Website – Zeile 2 von `zahlenkarte.txt`
 *   Veröffentlichung  frühestens 15:00 Uhr deutscher Zeit; angestoßen vom
 *                     Dauerlauf (`kurse-dauerlauf.yml`, alle zehn Minuten),
 *                     der Cron in `instagram-zahlenkarte.yml` ist Rückfall
 *
 * Kommt die Freigabe nach 15 Uhr, geht die Karte beim nächsten Blick des
 * Dauerlaufs hinaus. Die Riegel stehen **auch** im Veröffentlicher
 * (`scripts/instagram-zahlenkarte.ts`) – ein Start von Hand vor 15 Uhr
 * schickt nichts.
 */

/** 15:00 Uhr deutscher Zeit, in Minuten seit Mitternacht (bis 18.10.2026: 16:00). */
export const AB_MINUTE = 15 * 60

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
 *     Zeile 2     „Freigabe: JJJJ-MM-TT", „Freigabe: JJJJ-MM-TT ab HH:MM"
 *                 (Ausnahme vor 15 Uhr, `ab` an der Karte) oder „Freigabe: -"
 *     ab Zeile 3  die Beschriftung, wie sie hinausgeht
 */
export function leseZahlenkarteText(text: string): {
  datum: string
  freigabe: string | null
  /** Ab welcher Minute sie hinaus darf – `AB_MINUTE`, außer die Karte nennt eine eigene Zeit. */
  abMinute: number
  /** 2, wenn die Karte eine zweite Seite hat (Karussell), sonst 1. */
  seiten: number
  beschriftung: string
} {
  const [z1 = '', z2 = '', ...rest] = text.split('\n')
  const f =
    /^Freigabe: (\d{4}-\d{2}-\d{2})(?: ab (\d{2}):(\d{2}))?(?: seiten (\d))?\s*$/.exec(z2)
  return {
    datum: z1.trim(),
    freigabe: f ? f[1] : null,
    abMinute: f && f[2] ? Number(f[2]) * 60 + Number(f[3]) : AB_MINUTE,
    seiten: f && f[4] ? Number(f[4]) : 1,
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
  /** Frühestens ab dieser Minute; ohne Angabe 15 Uhr. */
  abMinute?: number
  /** Der Tag, an dem dieser Dauerlauf schon angestoßen hat – oder leer. */
  angestossenAm: string
  /**
   * Stehen die Daily News von heute schon im Kanal (`gepostet.txt` auf
   * `instagram-gepostet`)? Die Zahlenkarte folgt immer auf sie – Betreiber,
   * 14.11.2026: „die Struktur muss ja sauber bleiben, das ist immer ein
   * Beitrag, der auf einen Daily-News-Post folgt“.
   */
  newsGepostet: boolean
}

/** Steht der Tag in `gepostet.txt`? Zeile für Zeile, genau – nie als Teilzeichenkette. */
export function newsHeuteGepostet(gepostet: string, tag: string): boolean {
  return gepostet.split('\n').some((z) => z.trim() === tag)
}

/** Soll der Dauerlauf den Veröffentlicher jetzt anstoßen? */
export function sollZahlenkarteAnstossen(l: Zahlenkartenlage): {
  anstossen: boolean
  grund: string
} {
  const ab = l.abMinute ?? AB_MINUTE
  if (l.minute < ab)
    return {
      anstossen: false,
      grund: `vor ${String(Math.floor(ab / 60)).padStart(2, '0')}:${String(ab % 60).padStart(2, '0')} Uhr geht keine Zahlenkarte hinaus`,
    }
  if (l.datum !== l.tag)
    return {
      anstossen: false,
      grund: `die Website zeigt die Karte vom ${l.datum || '–'}`,
    }
  if (l.freigabe !== l.tag)
    return { anstossen: false, grund: 'die Karte von heute ist nicht freigegeben' }
  if (l.angestossenAm === l.tag)
    return { anstossen: false, grund: 'heute schon angestoßen' }
  if (!l.newsGepostet)
    return {
      anstossen: false,
      grund:
        'die Daily News von heute stehen noch nicht im Kanal – die Zahlenkarte folgt auf sie',
    }
  return { anstossen: true, grund: 'Karte von heute, freigegeben, 15 Uhr vorbei' }
}
