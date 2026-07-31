import { inHauptwaehrung } from './waehrungseinheit.ts'

/**
 * Eine Aktie gegen den Leitindex ihres Marktes – über ein, drei und fünf Jahre.
 *
 * ## Wozu
 *
 * Weil „plus 40 Prozent in fünf Jahren“ für sich genommen nichts sagt. Lag der
 * Markt in denselben fünf Jahren bei plus 80, war das eine schwache Phase; lag
 * er bei minus 10, war es eine sehr gute. Die Zahl allein trägt keine Aussage,
 * der Vergleich schon – und genau diesen Bezugspunkt hatte die Aktienseite
 * bisher nicht.
 *
 * Der Lehrwinkel steht daneben: Ein Einzelwert weicht vom Index ab, und zwar in
 * beide Richtungen. Wer das über drei Zeiträume nebeneinander sieht, sieht auch,
 * dass „hat den Markt geschlagen“ eine Aussage über einen Zeitraum ist und nicht
 * über ein Unternehmen. Derselbe Titel steht über ein Jahr vorn und über fünf
 * hinten, oder umgekehrt.
 *
 * ## Welcher Index
 *
 * Der Leitindex des Marktes, an dem der Wert **notiert** – erkennbar an der
 * Notierungswährung, nicht am Sitzland. Das ist ein bewusster Unterschied:
 * Accenture hat den Sitz in Irland und wird in New York in Dollar gehandelt;
 * gegen den Euro Stoxx 50 gemessen enthielte die Differenz vor allem den
 * Wechselkurs Euro/Dollar. Gegen den S&P 500 gemessen enthält sie das, was
 * gemeint ist.
 *
 * Dadurch stehen beide Reihen immer in derselben Währung, und die Differenz ist
 * frei von Wechselkurseffekten. Das ist der eigentliche Grund für diese
 * Zuordnung – nicht Bequemlichkeit.
 *
 * Innerhalb des Euroraums entscheidet zusätzlich das Sitzland: Deutschland den
 * DAX, Frankreich den CAC 40, alles Übrige den Euro Stoxx 50. Für die anderen
 * Euro-Länder gibt es hier keinen eigenen Index, und der Euro Stoxx 50 ist der
 * nächstbeste Bezugspunkt – ihre größten Werte stehen darin.
 *
 * ## Was der Vergleich **nicht** behauptet
 *
 * Dass der Wert in diesem Index enthalten ist. Ein deutscher Nebenwert steht im
 * SDAX und nicht im DAX; verglichen wird trotzdem mit dem DAX, weil er der
 * Bezugspunkt seines Heimatmarktes ist. Die Oberfläche schreibt das dazu.
 *
 * ## Die schiefe Grundlage beim DAX
 *
 * Der DAX ist ein **Performanceindex**: Dividenden sind in seinem Stand
 * enthalten, so als würde jede Ausschüttung sofort wieder angelegt. Eine
 * Kursreihe einer Aktie enthält sie nicht. Über fünf Jahre summiert sich das
 * auf einen zweistelligen Prozentbetrag – eine deutsche Aktie sieht gegen den
 * DAX also systematisch schlechter aus, als sie war.
 *
 * Alle anderen Indizes hier sind Kursindizes und damit auf derselben Grundlage
 * wie die Aktie. Der Unterschied steht im Datensatz und wird angezeigt, statt
 * ihn in eine Fußnote zu schieben.
 *
 * Ohne Laufzeitimporte außer den Untereinheiten, damit `tests/` das Modul
 * direkt laden kann.
 */

/** Ein Punkt einer Kursreihe. */
export interface Kurspunkt {
  /** Handelstag, `JJJJ-MM-TT`. */
  d: string
  /** Schlusskurs. */
  c: number
}

export interface Leitindex {
  /** Slug des Instruments, also der Ziellink. */
  symbol: string
  /** Kurzname im Fließtext, z. B. „DAX“. */
  name: string
  /** Die Währung, in der der Index rechnet. */
  waehrung: string
  /**
   * Ob Dividenden im Indexstand stecken.
   *
   * `performance` heißt: enthalten. Dann ist der Vergleich mit einer reinen
   * Kursreihe schief, und das gehört gesagt.
   */
  art: 'kurs' | 'performance'
  /** Warum gerade dieser Index – ein Halbsatz für die Oberfläche. */
  grund: string
}

/**
 * Die Leitindizes, nach Währung des Handelsplatzes.
 *
 * Nur Indizes, für die es hier auch abgerufene Kurse gibt. Ein Eintrag ohne
 * Kursreihe erzeugte einen Abschnitt, der beim Bauen still leer bliebe.
 */
const JE_WAEHRUNG: Record<string, Leitindex> = {
  USD: {
    symbol: 'sp500',
    name: 'S&P 500',
    waehrung: 'USD',
    art: 'kurs',
    grund: 'der breite Index des amerikanischen Marktes',
  },
  EUR: {
    symbol: 'euro-stoxx-50',
    name: 'Euro Stoxx 50',
    waehrung: 'EUR',
    art: 'kurs',
    grund: 'der Index der größten Werte des Euroraums',
  },
  GBP: {
    symbol: 'ftse-100',
    name: 'FTSE 100',
    waehrung: 'GBP',
    art: 'kurs',
    grund: 'der Leitindex der Londoner Börse',
  },
  JPY: {
    symbol: 'nikkei-225',
    name: 'Nikkei 225',
    waehrung: 'JPY',
    art: 'kurs',
    grund: 'der bekannteste Index des japanischen Marktes',
  },
  CHF: {
    symbol: 'smi',
    name: 'SMI',
    waehrung: 'CHF',
    art: 'kurs',
    grund: 'der Leitindex der Schweizer Börse',
  },
  HKD: {
    symbol: 'hang-seng',
    name: 'Hang Seng',
    waehrung: 'HKD',
    art: 'kurs',
    grund: 'der Leitindex der Hongkonger Börse',
  },
  KRW: {
    symbol: 'kospi',
    name: 'KOSPI',
    waehrung: 'KRW',
    art: 'kurs',
    grund: 'der Leitindex der Börse in Seoul',
  },
  INR: {
    symbol: 'nifty-50',
    name: 'NIFTY 50',
    waehrung: 'INR',
    art: 'kurs',
    grund: 'der Leitindex der Börse in Mumbai',
  },
  CAD: {
    symbol: 'tsx-composite',
    name: 'S&P/TSX Composite',
    waehrung: 'CAD',
    art: 'kurs',
    grund: 'der breite Index der Börse in Toronto',
  },
  AUD: {
    symbol: 'asx-200',
    name: 'S&P/ASX 200',
    waehrung: 'AUD',
    art: 'kurs',
    grund: 'der Leitindex der australischen Börse',
  },
  BRL: {
    symbol: 'ibovespa',
    name: 'Ibovespa',
    waehrung: 'BRL',
    art: 'kurs',
    grund: 'der Leitindex der Börse in São Paulo',
  },
  SEK: {
    symbol: 'omx-stockholm-30',
    name: 'OMX Stockholm 30',
    waehrung: 'SEK',
    art: 'kurs',
    grund: 'der Leitindex der Stockholmer Börse',
  },
  TWD: {
    symbol: 'taiex',
    name: 'TAIEX',
    waehrung: 'TWD',
    art: 'kurs',
    grund: 'der Gesamtindex der Börse in Taipeh',
  },
}

/**
 * Innerhalb des Euroraums entscheidet das Sitzland.
 *
 * Zwei Länder haben hier einen eigenen Index, der Rest nicht. Wer ein weiteres
 * Land ergänzt, trägt es hier ein – und muss dafür einen Index mit echten
 * Kursen im Katalog haben.
 */
const EURO_JE_SITZLAND: Record<string, Leitindex> = {
  '276': {
    symbol: 'dax',
    name: 'DAX',
    waehrung: 'EUR',
    /*
      Der wichtigste Eintrag dieser Datei. Siehe den Modulkopf: Der DAX rechnet
      Dividenden mit, eine Aktienkursreihe nicht.
    */
    art: 'performance',
    grund: 'der Leitindex des deutschen Marktes',
  },
  '250': {
    symbol: 'cac-40',
    name: 'CAC 40',
    waehrung: 'EUR',
    art: 'kurs',
    grund: 'der Leitindex der Pariser Börse',
  },
}

/**
 * Der Leitindex zu einem Wert – oder `null`.
 *
 * `null` heißt: Für diesen Handelsplatz führt die Website keinen Index. Das ist
 * bei kleineren Märkten der Normalfall und kein Fehler; der Abschnitt entfällt
 * dann, statt einen Vergleich mit einem unpassenden Index zu zeigen.
 */
export function leitindexFuer(einheit: string, sitzland?: string): Leitindex | null {
  /*
    Über die Hauptwährung, nicht über die Einheit. Britische Aktien notieren in
    Pence (`GBp`), südafrikanische in Cent (`ZAc`) – ein Nachschlagen mit der
    Einheit fände den FTSE 100 für London nicht.
  */
  const waehrung = inHauptwaehrung(1, einheit).waehrung
  if (waehrung === 'EUR' && sitzland && EURO_JE_SITZLAND[sitzland]) {
    return EURO_JE_SITZLAND[sitzland]
  }
  return JE_WAEHRUNG[waehrung] ?? null
}

/** Für welche Symbole überhaupt Reihen geladen werden müssen. */
export function alleLeitindexSymbole(): string[] {
  const symbole = new Set<string>()
  for (const index of Object.values(JE_WAEHRUNG)) symbole.add(index.symbol)
  for (const index of Object.values(EURO_JE_SITZLAND)) symbole.add(index.symbol)
  return [...symbole].sort()
}

export interface Zeitraumvergleich {
  jahre: number
  /** „Ein Jahr“, „Drei Jahre“, „Fünf Jahre“. */
  label: string
  /** Der tatsächlich verwendete Anfangstag der Aktienreihe. */
  vonTag: string
  bisTag: string
  /** Veränderung des Kurses über den Zeitraum, in Prozent. */
  wertProzent: number
  /** Veränderung des Indexstandes über denselben Zeitraum, in Prozent. */
  indexProzent: number
  /** `wertProzent` minus `indexProzent`, in Prozentpunkten. */
  differenz: number
}

export interface Indexvergleich {
  index: Leitindex
  /** Aufsteigend nach Länge: ein Jahr, drei Jahre, fünf Jahre. */
  zeitraeume: Zeitraumvergleich[]
}

/** Die Zeiträume, die verglichen werden. */
export const VERGLEICHSJAHRE = [1, 3, 5] as const

const LABELS: Record<number, string> = {
  1: 'Ein Jahr',
  3: 'Drei Jahre',
  5: 'Fünf Jahre',
}

/**
 * Wie weit ein Punkt vom gesuchten Stichtag entfernt sein darf.
 *
 * Die gespeicherten Reihen tragen über fünf Jahre rund 480 Punkte, also etwa
 * alle vier Kalendertage einen. Ein Stichtag trifft deshalb fast nie genau auf
 * einen Punkt, und „letzter Punkt davor“ allein reicht auch nicht: Fünf Jahre
 * vor dem 30. Juli 2026 ist der 30. Juli 2021, und die Reihen beginnen am
 * 2. August 2021 – ein Punkt davor existiert nicht.
 *
 * Zehn Tage lassen diesen Fall durch und weisen den anderen ab, um den es geht:
 * einen Titel, der erst seit zwei Jahren notiert und für den ein
 * „Fünfjahresvergleich“ in Wahrheit zwei Jahre umfasst.
 */
const TOLERANZ_TAGE = 10

const MS_JE_TAG = 86_400_000

function alsZahl(tag: string): number {
  return Date.parse(`${tag.slice(0, 10)}T00:00:00Z`)
}

/** Abstand zweier Kalendertage in Tagen, immer positiv. */
export function tageZwischen(einer: string, anderer: string): number {
  return Math.abs(alsZahl(einer) - alsZahl(anderer)) / MS_JE_TAG
}

/**
 * Derselbe Kalendertag, `jahre` Jahre früher.
 *
 * Der 29. Februar wird dabei zum 1. März – die einzige Stelle, an der das
 * Ergebnis um einen Tag danebenliegt, und sie liegt weit innerhalb der
 * Toleranz.
 */
export function minusJahre(tag: string, jahre: number): string {
  const datum = new Date(alsZahl(tag))
  datum.setUTCFullYear(datum.getUTCFullYear() - jahre)
  return datum.toISOString().slice(0, 10)
}

/**
 * Der Punkt, der dem Stichtag am nächsten liegt – `null`, wenn keiner nah
 * genug liegt.
 *
 * Bewusst der nächste und nicht „der letzte davor“: Am Anfang einer Reihe gibt
 * es keinen davor, und der Punkt zwei Tage danach ist die richtige Antwort,
 * nicht das Fehlen einer Antwort.
 */
export function punktNahe(
  reihe: readonly Kurspunkt[],
  stichtag: string
): Kurspunkt | null {
  let bester: Kurspunkt | null = null
  let besterAbstand = Infinity
  for (const punkt of reihe) {
    const abstand = tageZwischen(punkt.d, stichtag)
    if (abstand < besterAbstand) {
      besterAbstand = abstand
      bester = punkt
    }
  }
  return bester && besterAbstand <= TOLERANZ_TAGE ? bester : null
}

/** Der letzte Punkt am oder vor `stichtag`. */
function letzterBis(reihe: readonly Kurspunkt[], stichtag: string): Kurspunkt | null {
  let bester: Kurspunkt | null = null
  for (const punkt of reihe) {
    if (alsZahl(punkt.d) <= alsZahl(stichtag)) bester = punkt
  }
  return bester
}

/**
 * Der Vergleich – `null`, wenn er sich nicht sauber rechnen lässt.
 *
 * Beide Reihen müssen aufsteigend nach Tag sortiert sein; so liegen sie in der
 * Momentaufnahme.
 *
 * `null` kommt zurück, wenn eine Reihe zu kurz ist oder die beiden Reihen
 * verschieden weit reichen. Ein Vergleich, bei dem die eine Seite bis gestern
 * und die andere bis vor drei Wochen läuft, ist keiner – und sieht doch aus wie
 * einer.
 */
export function vergleiche(
  wert: readonly Kurspunkt[],
  index: readonly Kurspunkt[],
  leitindex: Leitindex
): Indexvergleich | null {
  if (wert.length < 2 || index.length < 2) return null

  /*
    Beide Reihen müssen bis zum selben Zeitpunkt reichen.

    Sie kommen aus derselben Momentaufnahme und enden deshalb im Regelfall am
    selben Handelstag. Der Fall, den diese Abfrage abfängt, ist der andere:
    Für einen der beiden schlug der Abruf über Wochen fehl. Dann ließe sich der
    Vergleich zwar auf den gemeinsamen Zeitraum kürzen und wäre in sich richtig
    – er stünde aber unter einer Seitenüberschrift mit dem heutigen Kurs und
    läse sich als Aussage über heute. Lieber gar nichts zeigen.
  */
  const letzterWert = wert[wert.length - 1]
  const letzterIndex = index[index.length - 1]
  if (tageZwischen(letzterWert.d, letzterIndex.d) > TOLERANZ_TAGE) return null

  const bis =
    alsZahl(letzterWert.d) <= alsZahl(letzterIndex.d) ? letzterWert.d : letzterIndex.d
  const endeWert = letzterBis(wert, bis)
  const endeIndex = letzterBis(index, bis)
  if (!endeWert || !endeIndex) return null

  const zeitraeume: Zeitraumvergleich[] = []
  for (const jahre of VERGLEICHSJAHRE) {
    const stichtag = minusJahre(endeWert.d, jahre)
    const anfangWert = punktNahe(wert, stichtag)
    const anfangIndex = punktNahe(index, stichtag)
    if (!anfangWert || !anfangIndex) continue
    if (tageZwischen(anfangWert.d, anfangIndex.d) > TOLERANZ_TAGE) continue
    if (anfangWert.c <= 0 || anfangIndex.c <= 0) continue

    const wertProzent = (endeWert.c / anfangWert.c - 1) * 100
    const indexProzent = (endeIndex.c / anfangIndex.c - 1) * 100
    zeitraeume.push({
      jahre,
      label: LABELS[jahre] ?? `${jahre} Jahre`,
      vonTag: anfangWert.d,
      bisTag: endeWert.d,
      wertProzent,
      indexProzent,
      differenz: wertProzent - indexProzent,
    })
  }

  if (zeitraeume.length === 0) return null
  return { index: leitindex, zeitraeume }
}

/**
 * Ein Satz, der das Ergebnis zusammenfasst.
 *
 * Bewusst ohne Wertung: „lag in zwei von drei Zeiträumen vorn“ ist eine Zählung,
 * „hat sich besser entwickelt“ wäre eine Empfehlung in Verkleidung. Der
 * Unterschied ist klein im Text und groß in der Sache.
 */
export function zusammenfassung(vergleich: Indexvergleich, name: string): string {
  const vorn = vergleich.zeitraeume.filter((z) => z.differenz > 0).length
  const anzahl = vergleich.zeitraeume.length
  const zeitraumWort = anzahl === 1 ? 'einen Zeitraum' : `${anzahl} Zeiträume`

  if (vorn === 0) {
    return `${name} lag in keinem der betrachteten Zeiträume vor dem ${vergleich.index.name}.`
  }
  if (vorn === anzahl) {
    return `${name} lag in allen ${anzahl === 1 ? '' : `${anzahl} `}betrachteten Zeiträumen vor dem ${vergleich.index.name}.`
  }
  return `${name} lag in ${vorn} von ${anzahl} Zeiträumen vor dem ${vergleich.index.name} – gezählt über ${zeitraumWort}, nicht über die Zukunft.`
}
