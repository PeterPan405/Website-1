import type { Termin } from '@/data/kalender/typen'

/**
 * Prüft die Kalendertermine beim Bauen.
 *
 * Ein falsches Datum ist der Fehler, den ein Kalender am wenigsten verträgt
 * und am schlechtesten zeigt: Er sieht vollständig aus, und wer danach plant,
 * verpasst den echten Termin. Der Build bricht deshalb ab, statt zu warnen –
 * dasselbe Vorgehen wie bei Nachrichten, Tagesausgaben und Länderdaten.
 */

const DATUM = /^\d{4}-\d{2}-\d{2}$/

/**
 * Wochentage, an denen bestimmte Termine liegen müssen.
 *
 * Die stärkste Prüfung dieser Datei, und sie kostet nichts: Die EZB verkündet
 * ihre Zinsentscheide seit jeher donnerstags, die Fed mittwochs. Ein um einen
 * Tag verrutschtes Datum – der häufigste Tippfehler beim Abschreiben eines
 * Sitzungskalenders, der Zeiträume wie „15.–16. September“ nennt – fällt damit
 * sofort auf.
 */
const WOCHENTAG_REGELN: { muster: RegExp; tag: number; name: string }[] = [
  { muster: /^EZB-Zinsentscheid/, tag: 4, name: 'Donnerstag' },
  { muster: /^Fed-Zinsentscheid/, tag: 3, name: 'Mittwoch' },
  { muster: /^Großer Verfallstag/, tag: 5, name: 'Freitag' },
]

/** Wochentag eines ISO-Datums, 1 = Montag. Ohne Zeitzonenfallen. */
function wochentag(datum: string): number {
  const tag = new Date(`${datum}T12:00:00Z`).getUTCDay()
  return tag === 0 ? 7 : tag
}

export function validateTermine(eintraege: readonly Termin[]): string[] {
  const probleme: string[] = []
  const gesehen = new Set<string>()

  for (const termin of eintraege) {
    const wo = `Termin „${termin.titel}“ (${termin.datum})`

    if (!DATUM.test(termin.datum) || Number.isNaN(Date.parse(termin.datum))) {
      probleme.push(`${wo}: Das Datum ist nicht im Format JJJJ-MM-TT oder ungültig.`)
      continue
    }
    if (termin.bis) {
      if (!DATUM.test(termin.bis) || Number.isNaN(Date.parse(termin.bis))) {
        probleme.push(`${wo}: Das Enddatum ist ungültig.`)
      } else if (termin.bis < termin.datum) {
        probleme.push(`${wo}: Das Ende liegt vor dem Anfang.`)
      }
    }

    const schluessel = `${termin.datum}|${termin.titel}`
    if (gesehen.has(schluessel)) {
      probleme.push(`${wo}: Dieser Termin steht doppelt im Kalender.`)
    }
    gesehen.add(schluessel)

    for (const regel of WOCHENTAG_REGELN) {
      if (regel.muster.test(termin.titel) && wochentag(termin.datum) !== regel.tag) {
        probleme.push(
          `${wo}: Dieser Termin müsste auf einen ${regel.name} fallen, liegt aber nicht darauf. Wurde der Sitzungszeitraum mit dem Entscheidungstag verwechselt?`
        )
      }
    }

    // Ein Datum ohne Einordnung ist eine Zeile in einer Liste, kein Kalender.
    if (termin.bedeutung.trim().length < 40) {
      probleme.push(`${wo}: „bedeutung“ fehlt oder ist zu knapp.`)
    }
    if (!termin.quelle.url.startsWith('https://')) {
      probleme.push(`${wo}: Die Quelle ist kein https-Link.`)
    }
    if (termin.quelle.label.trim().length === 0) {
      probleme.push(`${wo}: Die Quelle hat keine Beschriftung.`)
    }
  }

  return probleme
}

export function assertTermineValid(eintraege: readonly Termin[]): void {
  const probleme = validateTermine(eintraege)
  if (probleme.length > 0) {
    throw new Error(
      `Die Kalendertermine sind fehlerhaft:\n${probleme.map((p) => `  - ${p}`).join('\n')}`
    )
  }
}
