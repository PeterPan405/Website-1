/**
 * Kennzahlen, die sich aus einer Kursreihe rechnen lassen.
 *
 * Eigenes Modul ohne Importe, damit sich die Regeln unter `tests/` direkt
 * prüfen lassen – dieselbe Aufteilung wie bei `lib/market-range.ts` und
 * `lib/market-quote.ts`.
 *
 * ## Warum gerechnet und nicht abgerufen
 *
 * Die naheliegenden Kennzahlen einer Aktie wären Kurs-Gewinn-Verhältnis,
 * Marktkapitalisierung und Dividendenrendite. Die stehen aber in keiner frei
 * zugänglichen Quelle: Yahoo beantwortet Anfragen an seine Kennzahlen-
 * schnittstellen mit `401 Unauthorized` beziehungsweise `Invalid Crumb`, und
 * die Reihen, die wir bekommen, enthalten nur Kurse.
 *
 * Erfinden lässt sich so etwas nicht – ein geschätztes KGV wäre schlimmer als
 * keins. Was sich dagegen **vollständig aus den vorhandenen Kursen ergibt**,
 * ist die Risiko- und Verlaufsseite: Wie stark schwankt der Wert, wie tief war
 * der schlimmste Rückgang, wie hat er sich über verschiedene Zeiträume
 * entwickelt, wo steht er relativ zu seinem langfristigen Durchschnitt.
 *
 * Das ist für jemanden, der überlegt, ob ein Papier zu ihm passt, sogar die
 * nützlichere Hälfte: Ein KGV sagt etwas über die Bewertung, ein maximaler
 * Rückgang von 62 Prozent sagt etwas darüber, was man aushalten muss.
 *
 * Und es gilt für **alle** geführten Werte gleichermaßen – Aktien, Indizes,
 * Rohstoffe, Währungen, Kryptowährungen –, weil alle dieselbe Art von Reihe
 * haben.
 */

/** Ein Punkt einer Tagesreihe. `t` beginnt mit `YYYY-MM-DD`. */
export interface Kurspunkt {
  t: string
  value: number
}

export interface Kennzahlen {
  /**
   * Jahresschwankung in Prozent (annualisierte Standardabweichung der
   * Tagesrenditen des letzten Jahres).
   */
  schwankung: number | null
  /** Größter Rückgang vom Hoch zum darauffolgenden Tief, in Prozent. */
  maxRueckgang: number | null
  /** Zeitraum des größten Rückgangs, für die Einordnung. */
  maxRueckgangVon: string | null
  maxRueckgangBis: string | null
  /** Wertentwicklung über feste Zeiträume, in Prozent. */
  performance: { zeitraum: PerformanceId; prozent: number }[]
  /** Abstand zum Durchschnitt der letzten 200 Handelstage, in Prozent. */
  abstand200: number | null
  /** Anteil der Tage im letzten Jahr mit Gewinn, in Prozent. */
  anteilGewinntage: number | null
}

export type PerformanceId = '1M' | '6M' | '1J' | '3J' | '5J'

/** Kalendertage je Zeitraum – gezählt wird in Tagen, nicht in Punkten. */
const ZEITRAEUME: { id: PerformanceId; tage: number }[] = [
  { id: '1M', tage: 30 },
  { id: '6M', tage: 182 },
  { id: '1J', tage: 365 },
  { id: '3J', tage: 1095 },
  { id: '5J', tage: 1825 },
]

const HANDELSTAGE_JAHR = 252

function tagAls(zahl: string): number {
  return Date.parse(`${zahl.slice(0, 10)}T00:00:00Z`)
}

/**
 * Der letzte Punkt, der höchstens `tage` Kalendertage vor dem Ende liegt.
 *
 * ## Warum Kalendertage und nicht Punkte
 *
 * „Ein Jahr“ sind 365 Tage, nicht 252 Punkte. An Feiertagen und in Reihen mit
 * Lücken driftet die Zählung nach Punkten auseinander – bei fünf Jahren um
 * mehrere Monate. Derselbe Fehler saß schon einmal in `lib/market-range.ts`
 * und ist erst einem Nutzer aufgefallen.
 *
 * Gesucht wird der **jüngste** Punkt, der alt genug ist. Fehlt der Stichtag
 * selbst – Wochenende, Feiertag –, nimmt die Suche den davor.
 *
 * ## Und warum das allein nicht reicht
 *
 * Nimmt man einfach den jüngsten Punkt vor dem Stichtag, liefert eine Reihe
 * mit einer Lücke Unsinn: Klafft zwischen Januar und Juli nichts, gibt die
 * Suche nach „einem Monat“ den Januarwert zurück – und die Seite schriebe eine
 * Halbjahresentwicklung unter die Überschrift „1 Monat“. Der Test hat genau
 * das aufgedeckt.
 *
 * Deshalb eine Nachsicht von fünfzehn Prozent des Zeitraums, mindestens sieben
 * Tage: So viel Abstand darf ein Feiertagsblock oder eine Börsenpause
 * ausmachen. Alles darüber heißt, dass es zu diesem Zeitraum keinen
 * belastbaren Startwert gibt – dann kommt `null` zurück und die Kennzahl
 * entfällt, statt falsch beschriftet dazustehen.
 */
function punktVor(reihe: readonly Kurspunkt[], tage: number): Kurspunkt | null {
  if (reihe.length === 0) return null
  const ende = tagAls(reihe[reihe.length - 1].t)
  const grenze = ende - tage * 86_400_000
  const nachsicht = Math.max(7, tage * 0.15) * 86_400_000

  let treffer: Kurspunkt | null = null
  for (const punkt of reihe) {
    if (tagAls(punkt.t) <= grenze) treffer = punkt
    else break
  }
  if (!treffer) return null
  return tagAls(treffer.t) >= grenze - nachsicht ? treffer : null
}

/**
 * Tagesrenditen als einfache Veränderung.
 *
 * Bewusst nicht logarithmisch: Die Zahl wandert in eine
 * Standardabweichung, die auf der Seite als „so stark schwankt der Wert“
 * erklärt wird. Für diese Aussage ist die einfache Rendite die, die dem
 * entspricht, was jemand im Depot sieht.
 */
function renditen(reihe: readonly Kurspunkt[]): number[] {
  const werte: number[] = []
  for (let i = 1; i < reihe.length; i += 1) {
    const vorher = reihe[i - 1].value
    if (vorher > 0) werte.push(reihe[i].value / vorher - 1)
  }
  return werte
}

/**
 * Annualisierte Schwankungsbreite in Prozent.
 *
 * Standardabweichung der Tagesrenditen, hochgerechnet mit der Wurzel aus der
 * Zahl der Handelstage. Unter dreißig Werten wird nichts ausgegeben: Aus einer
 * Handvoll Tage eine Jahresschwankung zu rechnen ergäbe eine Zahl mit drei
 * Nachkommastellen und ohne Aussage.
 */
export function schwankungProzent(reihe: readonly Kurspunkt[]): number | null {
  const werte = renditen(reihe)
  if (werte.length < 30) return null

  const mittel = werte.reduce((summe, wert) => summe + wert, 0) / werte.length
  const varianz =
    werte.reduce((summe, wert) => summe + (wert - mittel) ** 2, 0) / (werte.length - 1)
  return Math.sqrt(varianz) * Math.sqrt(HANDELSTAGE_JAHR) * 100
}

/**
 * Größter Rückgang von einem Hoch bis zum darauffolgenden Tief.
 *
 * Die Zahl, die am ehesten beschreibt, was jemand tatsächlich aushalten
 * musste: nicht die Schwankung um einen Mittelwert, sondern der tiefste Punkt
 * nach dem besten. Zurück kommt ein **negativer** Wert, weil es ein Verlust
 * ist – eine positive Zahl mit dem Wort „Rückgang“ daneben liest sich falsch.
 */
export function maxRueckgang(
  reihe: readonly Kurspunkt[]
): { prozent: number; von: string; bis: string } | null {
  if (reihe.length < 2) return null

  let hoch = reihe[0].value
  let hochTag = reihe[0].t
  let schlimmster = 0
  let von = reihe[0].t
  let bis = reihe[0].t

  for (const punkt of reihe) {
    if (punkt.value > hoch) {
      hoch = punkt.value
      hochTag = punkt.t
      continue
    }
    if (hoch <= 0) continue
    const rueckgang = (punkt.value / hoch - 1) * 100
    if (rueckgang < schlimmster) {
      schlimmster = rueckgang
      von = hochTag
      bis = punkt.t
    }
  }

  if (schlimmster === 0) return null
  return { prozent: schlimmster, von, bis }
}

/** Abstand zum Durchschnitt der letzten `fenster` Punkte, in Prozent. */
export function abstandZumDurchschnitt(
  reihe: readonly Kurspunkt[],
  fenster = 200
): number | null {
  if (reihe.length < fenster) return null
  const letzte = reihe.slice(-fenster)
  const schnitt = letzte.reduce((summe, punkt) => summe + punkt.value, 0) / fenster
  if (schnitt <= 0) return null
  return (reihe[reihe.length - 1].value / schnitt - 1) * 100
}

/** Anteil der Tage mit positiver Veränderung, in Prozent. */
export function anteilGewinntage(reihe: readonly Kurspunkt[]): number | null {
  const werte = renditen(reihe)
  if (werte.length < 30) return null
  return (werte.filter((wert) => wert > 0).length / werte.length) * 100
}

/**
 * Alle Kennzahlen zu einer Reihe.
 *
 * Was sich aus der vorliegenden Reihe nicht ergibt, kommt als `null` zurück
 * und nicht als 0 – eine Reihe, die erst seit acht Monaten läuft, hat keine
 * Fünfjahresentwicklung, und `0 %` wäre an dieser Stelle eine Behauptung.
 */
export function berechneKennzahlen(reihe: readonly Kurspunkt[]): Kennzahlen {
  const sortiert = [...reihe].sort((a, b) => a.t.localeCompare(b.t))
  const letzter = sortiert[sortiert.length - 1] ?? null

  const einJahr = punktVor(sortiert, 365)
  const jahresreihe = einJahr
    ? sortiert.filter((punkt) => punkt.t >= einJahr.t)
    : sortiert

  const rueckgang = maxRueckgang(sortiert)

  const performance: { zeitraum: PerformanceId; prozent: number }[] = []
  for (const zeitraum of ZEITRAEUME) {
    const start = punktVor(sortiert, zeitraum.tage)
    if (!start || !letzter || start.value <= 0 || start.t === letzter.t) continue
    performance.push({
      zeitraum: zeitraum.id,
      prozent: (letzter.value / start.value - 1) * 100,
    })
  }

  return {
    schwankung: schwankungProzent(jahresreihe),
    maxRueckgang: rueckgang ? rueckgang.prozent : null,
    maxRueckgangVon: rueckgang ? rueckgang.von : null,
    maxRueckgangBis: rueckgang ? rueckgang.bis : null,
    performance,
    abstand200: abstandZumDurchschnitt(sortiert),
    anteilGewinntage: anteilGewinntage(jahresreihe),
  }
}
