/**
 * Einstieg nach verfügbarer Zeit statt nach Thema.
 *
 * ## Warum es diese Sortierung braucht
 *
 * Weil „wo fange ich an?" fast nie eine Frage nach dem Thema ist. Wer eine
 * Viertelstunde hat, will nicht wissen, ob ihn ETFs oder Anleihen mehr
 * angehen – er will etwas, das in eine Viertelstunde passt und in sich
 * abgeschlossen ist. Eine Themenliste beantwortet diese Frage nicht.
 *
 * ## Die Messung, aus der der Aufbau folgt
 *
 * Am 18. August 2026 nachgezählt: **Die 102 Lernstufen brauchen zwischen 9 und
 * 15 Minuten**, im Mittel elf. Es gibt hier nichts, was fünf Minuten dauert und
 * eine Lernstufe wäre.
 *
 * Daraus folgt der ganze Aufbau dieser Seite. Das Fünf-Minuten-Fenster kann
 * keine Lernstufe anbieten, ohne zu lügen – es bietet eine Podcastfolge (3 bis
 * 6 Minuten, gemessen), einen Irrtum mit seiner Rechnung oder ein
 * Verwechslungspaar. Und es sagt ausdrücklich, dass die kürzeste Lernstufe
 * neun Minuten braucht, statt eine anzubieten und zu hoffen.
 *
 * ## Gemessen oder offen
 *
 * Jeder Vorschlag trägt eine von zwei Dauerarten:
 *
 * - **`gemessen`** – die Minuten stehen in den Daten: `readingMinutes` einer
 *   Lernstufe, `dauerSekunden` einer Podcastfolge, die Summe eines Lernpfads.
 * - **`offen`** – es gibt keine hinterlegte Dauer, und es wird auch keine
 *   erfunden. Ein Glossarbegriff dauert so lange, wie man ihn liest.
 *
 * Eine geschätzte Minutenzahl wäre hier besonders verlockend – die Seite
 * verspricht ja gerade, dass etwas in die Zeit passt – und deshalb besonders
 * schädlich. Ein Vorschlag ohne hinterlegte Dauer sagt „zum Stöbern" und
 * nennt keine Zahl.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 */

export interface Zeitfenster {
  id: string
  /** Wie viele Minuten zur Verfügung stehen. */
  minuten: number
  label: string
  /** Was in dieser Zeit realistisch drin ist. */
  lead: string
}

/**
 * Die vier Fenster.
 *
 * Nicht gleichmäßig gestuft, sondern nach dem, was Menschen tatsächlich haben:
 * die Wartezeit, die Mittagspause, der freie Nachmittag, der Abend. Eine
 * Stufung 5/10/15/20 wäre gleichmäßiger und träfe keinen dieser Fälle.
 */
export const ZEITFENSTER: Zeitfenster[] = [
  {
    id: 'fuenf',
    minuten: 5,
    label: 'Fünf Minuten',
    lead: 'Eine Sache, die für sich steht. Keine Lernstufe – die kürzeste braucht neun Minuten.',
  },
  {
    id: 'viertelstunde',
    minuten: 15,
    label: 'Eine Viertelstunde',
    lead: 'Genau eine Lernstufe, vollständig. Danach weiß man ein Thema auf einer Ebene.',
  },
  {
    id: 'stunde',
    minuten: 60,
    label: 'Eine Stunde',
    lead: 'Ein Thema über alle drei Stufen – oder der halbe Weg durch einen Lernpfad.',
  },
  {
    id: 'abend',
    minuten: 180,
    label: 'Ein Abend',
    lead: 'Ein ganzer Lernpfad, von der ersten Frage bis zum Rechner am Ende.',
  },
]

/** Wie lange etwas dauert – oder dass es dazu keine Angabe gibt. */
export type Dauer =
  { art: 'gemessen'; minuten: number } | { art: 'offen'; hinweis: string }

export interface Vorschlag {
  id: string
  titel: string
  /** Ein Satz dazu, worum es geht. */
  hinweis: string
  href: string
  /** Woher der Vorschlag kommt – „Lernstufe", „Podcastfolge", „Irrtum". */
  herkunft: string
  dauer: Dauer
}

/**
 * Passt ein Vorschlag in ein Zeitfenster?
 *
 * Gemessene Dauern müssen hineinpassen. Offene passen **nur ins kleinste
 * Fenster**: Wer eine Stunde hat, will nicht auf eine Begriffsliste geschickt
 * werden, sondern auf etwas mit Anfang und Ende.
 *
 * Das ist keine Willkür, sondern die Umkehrung des Versprechens: Die Seite
 * sagt, was in die Zeit passt. Bei fünf Minuten heißt „such dir was aus" noch
 * etwas; bei drei Stunden hieße es, dass die Seite die Frage nicht beantwortet.
 */
export function passt(dauer: Dauer, fenster: Zeitfenster, kleinstes: number): boolean {
  if (dauer.art === 'offen') return fenster.minuten === kleinstes
  return dauer.minuten <= fenster.minuten
}

/** Das kleinste Fenster – für die Regel über offene Dauern. */
export function kleinstesFenster(fenster: readonly Zeitfenster[] = ZEITFENSTER): number {
  return Math.min(...fenster.map((eintrag) => eintrag.minuten))
}

/**
 * Die Vorschläge eines Fensters, längster zuerst.
 *
 * Längster zuerst, weil er die Zeit am besten ausfüllt. Wer 60 Minuten hat und
 * als Erstes einen Elf-Minuten-Text angeboten bekommt, muss selbst
 * zusammenstellen – genau das, was die Seite abnehmen soll.
 *
 * `hoechstens` begrenzt die Liste je Fenster; ohne Grenze stünden im
 * Abend-Fenster alle 102 Lernstufen, weil jede hineinpasst.
 */
export function vorschlaegeFuer(
  alle: readonly Vorschlag[],
  fenster: Zeitfenster,
  hoechstens = 6,
  kleinstes: number = kleinstesFenster()
): Vorschlag[] {
  return alle
    .filter((vorschlag) => passt(vorschlag.dauer, fenster, kleinstes))
    .sort((a, b) => minutenVon(b) - minutenVon(a) || a.titel.localeCompare(b.titel, 'de'))
    .slice(0, hoechstens)
}

/** Die Minuten eines Vorschlags – offene zählen als null. */
function minutenVon(vorschlag: Vorschlag): number {
  return vorschlag.dauer.art === 'gemessen' ? vorschlag.dauer.minuten : 0
}

/**
 * Sekunden in ganze Minuten, aufgerundet.
 *
 * Aufgerundet und nicht gerundet: Eine Folge von 5 Minuten 40 Sekunden als
 * „6 Minuten" auszuweisen ist richtig herum falsch – wer fünf Minuten hat,
 * soll nicht in der Mitte abbrechen müssen.
 */
export function minutenAusSekunden(sekunden: number): number {
  return Math.ceil(sekunden / 60)
}

/** Die Dauer als Text. */
export function dauerText(dauer: Dauer): string {
  if (dauer.art === 'offen') return dauer.hinweis
  return dauer.minuten === 1 ? '1 Minute' : `${dauer.minuten} Minuten`
}
