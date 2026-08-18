import type { DailyEdition } from '@/data/editions/types'
import { formatEditionDate } from '@/lib/edition-date'
import type { PdfDokument, PdfZeile } from '@/lib/pdf'

/**
 * Das Ausgabenarchiv als ein Dokument zum Lesen am Stück.
 *
 * ## Warum das etwas anderes ist als das Archiv
 *
 * Das Archiv beantwortet „was war am 3. August?" – eine Seite je Tag, und
 * dazwischen jedes Mal ein Klick. Wer die Woche nachlesen will, klickt fünfmal
 * und hat fünfmal Kopfzeile, Navigation und Fußzeile dazwischen.
 *
 * Ein Band ist die andere Form derselben Inhalte: **eine Datei, die man
 * durchliest**, ausdruckt oder auf ein Lesegerät legt. Nichts daran ist neu
 * geschrieben; es ist dieselbe Ausgabe, nur ohne die Klicks.
 *
 * ## Was ein Band nicht tut
 *
 * Er **kürzt nicht**. Jede Meldung kommt mit ihrer vollständigen
 * Zusammenfassung, ihrem „warum es zählt" und ihren Quellen. Eine gekürzte
 * Fassung wäre ein zweiter Text neben dem ersten – und der zweite wäre der,
 * den niemand pflegt.
 *
 * Er **erfindet keine Übersicht.** Kein „die Woche in drei Sätzen", keine
 * Monatsbilanz. Beides müsste jemand schreiben, und geschrieben hat es
 * niemand.
 *
 * ## Warum die Quellen mitkommen
 *
 * Weil eine Zusammenfassung ohne nachprüfbare Herkunft bei Finanzthemen
 * wertlos ist – dieselbe Begründung wie in `data/editions/types.ts`. Auf
 * Papier ist eine Adresse unbequem, aber die Alternative wäre, sie
 * wegzulassen, und dann steht dort eine Behauptung.
 *
 * Ohne Laufzeitimporte außer den Typen, damit `tests/` das Modul direkt lädt.
 */

/** Ein Band deckt entweder einen Monat oder ein Jahr ab. */
export type Bandart = 'monat' | 'jahr'

export interface Band {
  art: Bandart
  /** `2026-08` beim Monat, `2026` beim Jahr. */
  schluessel: string
  /** Ausgeschrieben, z. B. „August 2026“. */
  label: string
  ausgaben: DailyEdition[]
}

const MONATE = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
]

/**
 * Der ausgeschriebene Name eines Schlüssels.
 *
 * Aus einer Liste und nicht aus `toLocaleDateString`: Das Ergebnis hinge sonst
 * an den Gebietsdaten des Servers und könnte sich zwischen Bau und Browser
 * unterscheiden. Dieselbe Begründung wie in `lib/editions.ts`.
 */
export function bandName(schluessel: string): string {
  if (schluessel.length === 4) return schluessel
  const monat = Number(schluessel.slice(5, 7))
  return `${MONATE[monat - 1] ?? schluessel} ${schluessel.slice(0, 4)}`
}

/**
 * Die Bände, die sich aus den vorhandenen Ausgaben bilden lassen.
 *
 * ## Wann es einen Jahresband gibt
 *
 * Nur, wenn das Jahr Ausgaben in **mehr als einem Monat** hat. Sonst wäre der
 * Jahresband Zeichen für Zeichen derselbe wie der eine Monatsband, nur mit
 * anderer Überschrift – zwei Dateien mit identischem Inhalt, von denen eine
 * beim nächsten Monat still falsch wird.
 *
 * Dieselbe Regel wie bei den Suchfiltern: Was nichts ausrichtet, wird nicht
 * angeboten.
 */
export function baende(ausgaben: readonly DailyEdition[]): Band[] {
  const nachMonat = new Map<string, DailyEdition[]>()
  const nachJahr = new Map<string, DailyEdition[]>()

  /*
    Absteigend sortiert, wie im Archiv – innerhalb des Bandes wird dann wieder
    aufsteigend gelesen. Ein Band, den man von hinten nach vorn liest, wäre
    eine Zeitung in umgekehrter Reihenfolge.
  */
  for (const ausgabe of [...ausgaben].sort((a, b) => a.date.localeCompare(b.date))) {
    const monat = ausgabe.date.slice(0, 7)
    const jahr = ausgabe.date.slice(0, 4)
    nachMonat.set(monat, [...(nachMonat.get(monat) ?? []), ausgabe])
    nachJahr.set(jahr, [...(nachJahr.get(jahr) ?? []), ausgabe])
  }

  const monatsbaende: Band[] = [...nachMonat.entries()].map(([schluessel, liste]) => ({
    art: 'monat' as const,
    schluessel,
    label: bandName(schluessel),
    ausgaben: liste,
  }))

  const jahresbaende: Band[] = [...nachJahr.entries()]
    .filter(
      ([jahr]) =>
        monatsbaende.filter((band) => band.schluessel.startsWith(jahr)).length > 1
    )
    .map(([schluessel, liste]) => ({
      art: 'jahr' as const,
      schluessel,
      label: bandName(schluessel),
      ausgaben: liste,
    }))

  return [...jahresbaende, ...monatsbaende].sort(
    (a, b) => b.schluessel.localeCompare(a.schluessel) || a.art.localeCompare(b.art)
  )
}

/** Wie viele Meldungen ein Band enthält. */
export function meldungszahl(band: Band): number {
  return band.ausgaben.reduce(
    (summe, ausgabe) => summe + ausgabe.top.length + ausgabe.further.length,
    0
  )
}

/**
 * Der Dateiname eines Bandes.
 *
 * Mit dem Schlüssel und nicht mit dem ausgeschriebenen Namen: „August 2026"
 * enthält ein Leerzeichen, und ein Dateiname mit Leerzeichen kommt aus jedem
 * zweiten Werkzeug anders wieder heraus.
 */
export function bandDateiname(band: Band): string {
  return `iminvests-ausgaben-${band.schluessel}.pdf`
}

/**
 * Das Band als PDF-Dokument.
 *
 * Jede Ausgabe beginnt auf einer **neuen Seite**. Das kostet Papier und ist
 * trotzdem richtig: Ein Band, in dem der 5. August mitten auf der Seite des
 * 4. anfängt, lässt sich nicht durchblättern, und genau dafür gibt es ihn.
 */
export function bandDokument(band: Band, erstelltAm: string, marke: string): PdfDokument {
  const zeilen: PdfZeile[] = []

  band.ausgaben.forEach((ausgabe, index) => {
    if (index > 0) zeilen.push({ art: 'seitenumbruch' })

    zeilen.push({ art: 'ueberschrift', text: formatEditionDate(ausgabe.date) })
    zeilen.push({ art: 'fliesstext', text: ausgabe.intro })
    zeilen.push({ art: 'linie' })

    for (const meldung of [...ausgabe.top, ...ausgabe.further]) {
      zeilen.push({ art: 'unterueberschrift', text: meldung.headline })

      for (const absatz of meldung.summary) {
        zeilen.push({ art: 'fliesstext', text: absatz })
      }

      zeilen.push({ art: 'fliesstext', text: `Warum es zählt: ${meldung.whyItMatters}` })

      /*
        Die Quellen als Hinweiszeilen – klein, aber vorhanden.

        Eine Zusammenfassung ohne nachprüfbare Herkunft ist bei Finanzthemen
        wertlos. Auf Papier ist eine Adresse unbequem; sie wegzulassen hieße,
        an ihre Stelle eine Behauptung zu setzen.
      */
      for (const quelle of meldung.sources) {
        zeilen.push({ art: 'hinweis', text: `${quelle.label} – ${quelle.url}` })
      }

      zeilen.push({ art: 'abstand' })
    }
  })

  return {
    titel: band.art === 'jahr' ? `Ausgaben ${band.label}` : `Ausgaben aus ${band.label}`,
    untertitel: `${band.ausgaben.length} ${band.ausgaben.length === 1 ? 'Ausgabe' : 'Ausgaben'}, ${meldungszahl(band)} Meldungen · Stand ${erstelltAm}`,
    marke,
    fusszeile: `${marke} · Ausgabenband ${band.label}`,
    zeilen,
  }
}
