/**
 * Was sich aus den Kursreihen rechnen lässt – und was nicht.
 *
 * ## Der Befund, der dieses Modul geformt hat
 *
 * Die Momentaufnahme unter `data/snapshots/markets.json` reicht fünf Jahre
 * zurück, aber **nicht durchgehend im selben Takt.** Nachgezählt am DAX:
 *
 * | Jahr | Punkte | Medianabstand |
 * | ---- | ------ | ------------- |
 * | 2021 | 21     | 7 Tage        |
 * | 2022 | 52     | 7 Tage        |
 * | 2023 | 52     | 7 Tage        |
 * | 2024 | 53     | 7 Tage        |
 * | 2025 | 154    | 1 Tag         |
 * | 2026 | 149    | 1 Tag         |
 *
 * Bis Mitte 2025 wöchentlich, seither täglich. Eine „Tagesschwankung über fünf
 * Jahre" aus diesen Daten wäre keine Näherung, sondern eine falsche Zahl: In
 * den ersten vier Jahren wäre jeder „Tagesschritt" in Wahrheit eine Woche, und
 * Wochenschritte schwanken rund zweieinhalbmal so stark wie Tagesschritte.
 * Herausgekommen wäre eine Volatilität, die sauber aussieht und zu hoch ist.
 *
 * **Deshalb rechnet dieses Modul auf einem Wochenraster.** Es ist der einzige
 * Takt, den alle fünf Jahre hergeben, und er gilt für jedes Instrument gleich –
 * auch für Krypto, das an 365 Tagen handelt und dessen Tagesreihe deshalb mit
 * der einer Aktie ohnehin nicht vergleichbar wäre.
 *
 * ## Warum das Wochenraster auch inhaltlich das bessere ist
 *
 * Tagesrenditen über Zeitzonen hinweg sind schief. Schließt Tokio um 6 Uhr
 * unserer Zeit und New York um 22, dann liegen zwischen zwei „gleichen Tagen"
 * sechzehn Stunden Nachrichtenlage. Eine gemeinsame Woche haben beide dagegen
 * wirklich. Für eine Korrelation zwischen Nikkei und S&P 500 ist das der
 * Unterschied zwischen einer Zahl und einem Artefakt.
 *
 * ## Was hier bewusst nicht steht
 *
 * Keine Kennzahl, die wie eine Bewertung aussieht: kein Sharpe-Verhältnis,
 * kein Beta, keine Wertentwicklungsnote. Die Volatilität ist hier eine
 * beschreibende Größe – „so weit lagen die Wochen auseinander" –, keine
 * Aussage über Risiko. Der Unterschied steht auf der Seite ausdrücklich dabei.
 *
 * `lib/streuung.ts` verzichtet für die Merkliste ausdrücklich auf Korrelation
 * und Volatilität. Das gilt dort weiter und widerspricht diesem Modul nicht:
 * Eine Merkliste kennt keine Stückzahlen und ist kein Depot. Hier wird nichts
 * über ein Depot gesagt, sondern über zwei Kursreihen.
 *
 * ## Warum dieses Modul nichts lädt
 *
 * Es bekommt Reihen übergeben und holt sie nicht selbst. Das ist der Hausstil
 * (`lib/marktbreite.ts`, `lib/market-range.ts` machen es genauso) und hat einen
 * handfesten Grund: Tests laufen hier mit blankem Node, das den Alias `@/`
 * nicht auflöst. Ein Modul, das `@/lib/market-live` importiert, ist nicht
 * testbar – und eine Statistik ohne Test ist eine Behauptung.
 *
 * Die Verbindung zu den echten Reihen stellt `lib/reihenstatistik-daten.ts` her.
 */

/** Ein Punkt einer Kursreihe, so wie ihn `getLiveSeries` liefert. */
export interface Reihenpunkt {
  t: string
  value: number
}

/** Wie viele Wochen mindestens vorliegen müssen, damit eine Zahl entsteht. */
export const MINDESTWOCHEN = 30

/** Wochen im Jahr – der Faktor, mit dem eine Wochengröße aufs Jahr geht. */
const WOCHEN_JE_JAHR = 52

export interface Wochenpunkt {
  /** Der letzte Handelstag dieser Woche, als ISO-Datum. */
  t: string
  /** Schlusskurs an diesem Tag. */
  wert: number
}

export interface Renditepunkt {
  /** Ende der Woche, auf die sich die Rendite bezieht. */
  t: string
  /** Veränderung gegenüber der Vorwoche, als Faktor minus eins. */
  r: number
}

/**
 * Der Schlusskurs je Kalenderwoche, älteste zuerst.
 *
 * Genommen wird der **letzte** Punkt der Woche, nicht der erste und nicht der
 * Mittelwert: Ein Wochenschluss ist ein Kurs, den es gegeben hat. Ein
 * Wochenmittel ist eine Zahl, die an keinem Tag galt.
 */
export function wochenschluesse(reihe: readonly Reihenpunkt[]): Wochenpunkt[] {
  const jeWoche = new Map<string, Wochenpunkt>()
  for (const punkt of reihe) {
    if (!Number.isFinite(punkt.value) || punkt.value <= 0) continue
    const schluessel = kalenderwoche(punkt.t)
    if (!schluessel) continue
    /*
      Überschreiben statt Prüfen: Die Reihe kommt aufsteigend, der zuletzt
      geschriebene Eintrag ist damit der späteste der Woche.
    */
    jeWoche.set(schluessel, { t: punkt.t, wert: punkt.value })
  }

  return [...jeWoche.values()].sort((a, b) => a.t.localeCompare(b.t))
}

/**
 * Die ISO-Kalenderwoche eines Datums als `JJJJ-WNN`.
 *
 * Eigene Rechnung statt einer Bibliothek, weil die Regel kurz ist und eine
 * Abhängigkeit für vier Zeilen keine ist: Der Donnerstag entscheidet, zu
 * welchem Jahr eine Woche gehört.
 */
export function kalenderwoche(iso: string): string | null {
  const teile = iso.slice(0, 10).split('-').map(Number)
  if (teile.length !== 3 || teile.some((n) => !Number.isFinite(n))) return null
  const [jahr, monat, tag] = teile as [number, number, number]

  const datum = new Date(Date.UTC(jahr, monat - 1, tag))
  if (Number.isNaN(datum.getTime())) return null

  // Auf den Donnerstag derselben Woche schieben (Montag = 1 … Sonntag = 7).
  const wochentag = datum.getUTCDay() || 7
  datum.setUTCDate(datum.getUTCDate() + 4 - wochentag)

  const jahresanfang = new Date(Date.UTC(datum.getUTCFullYear(), 0, 1))
  const nummer = Math.ceil(
    ((datum.getTime() - jahresanfang.getTime()) / 86_400_000 + 1) / 7
  )
  return `${datum.getUTCFullYear()}-W${String(nummer).padStart(2, '0')}`
}

/**
 * Die Wochenrenditen eines Symbols, älteste zuerst.
 *
 * Zwei Wochenschlüsse, die mehr als **zehn Tage** auseinanderliegen, werden
 * übersprungen. Sonst entstünde aus einer Lücke im Bestand eine „Wochen"-
 * rendite über zwei oder drei Wochen – eine richtig gerechnete Zahl mit
 * falscher Beschriftung, und das ist die gefährlichste Sorte.
 */
export function wochenrenditen(
  reihe: readonly Reihenpunkt[],
  ab?: string
): Renditepunkt[] {
  const punkte = wochenschluesse(reihe)
  const ergebnis: Renditepunkt[] = []

  for (let i = 1; i < punkte.length; i += 1) {
    const vor = punkte[i - 1]!
    const jetzt = punkte[i]!
    if (ab && jetzt.t < ab) continue
    if (tageZwischen(vor.t, jetzt.t) > 10) continue
    if (vor.wert <= 0) continue
    ergebnis.push({ t: jetzt.t, r: jetzt.wert / vor.wert - 1 })
  }

  return ergebnis
}

function tageZwischen(a: string, b: string): number {
  return Math.abs(Date.parse(b) - Date.parse(a)) / 86_400_000
}

export interface Schwankung {
  /** Standardabweichung der Wochenrenditen, aufs Jahr gerechnet, in Prozent. */
  jahresProzent: number
  /** Standardabweichung der Wochenrenditen selbst, in Prozent. */
  wochenProzent: number
  /** Wie viele Wochen in die Rechnung eingegangen sind. */
  wochen: number
  von: string
  bis: string
}

/**
 * Wie weit die Wochen eines Werts auseinanderlagen.
 *
 * Aufs Jahr gerechnet wird mit der Wurzel aus 52 – der üblichen Annahme, dass
 * sich Schwankungen über die Zeit wie eine Zufallsbewegung addieren. Sie ist
 * eine Annahme und keine Tatsache: In Krisen häufen sich große Ausschläge, und
 * genau dann stimmt die Wurzelregel am wenigsten. Auf der Seite steht das
 * dabei.
 */
export function schwankung(
  reihe: readonly Reihenpunkt[],
  ab?: string
): Schwankung | null {
  const renditen = wochenrenditen(reihe, ab)
  if (renditen.length < MINDESTWOCHEN) return null

  const werte = renditen.map((p) => p.r)
  const abweichung = standardabweichung(werte)
  if (abweichung === null) return null

  return {
    jahresProzent: abweichung * Math.sqrt(WOCHEN_JE_JAHR) * 100,
    wochenProzent: abweichung * 100,
    wochen: renditen.length,
    von: renditen[0]!.t,
    bis: renditen[renditen.length - 1]!.t,
  }
}

/**
 * Die Stichproben-Standardabweichung (Nenner n−1).
 *
 * Nicht n: Die Reihe ist eine Stichprobe aus dem, was hätte passieren können,
 * keine Vollerhebung. Bei dreißig und mehr Wochen ist der Unterschied klein –
 * aber er ist der Unterschied zwischen richtig und ungefähr.
 */
export function standardabweichung(werte: readonly number[]): number | null {
  if (werte.length < 2) return null
  const mittel = werte.reduce((s, w) => s + w, 0) / werte.length
  const summe = werte.reduce((s, w) => s + (w - mittel) ** 2, 0)
  return Math.sqrt(summe / (werte.length - 1))
}

export interface Zusammenhang {
  /** Korrelationskoeffizient nach Pearson, zwischen −1 und 1. */
  wert: number
  /** Wie viele gemeinsame Wochen eingegangen sind. */
  wochen: number
  von: string
  bis: string
}

/**
 * Wie stark zwei Werte gemeinsam schwankten.
 *
 * Gerechnet wird nur über Wochen, in denen **beide** einen Schluss haben.
 * Fehlt einer, fällt die Woche für beide heraus – sonst würde eine Feiertags-
 * lücke in Tokio zu einem Zusammenhang mit New York verrechnet, den es nicht
 * gibt.
 *
 * Der Wert misst den **gleichzeitigen Gleichlauf**, nicht Ursache und Wirkung
 * und nicht, was im Crash passiert. Beides steht auf der Seite dabei, weil
 * beides der häufigste Fehlschluss ist.
 */
export function zusammenhang(
  a: readonly Reihenpunkt[],
  b: readonly Reihenpunkt[],
  ab?: string
): Zusammenhang | null {
  const eins = new Map(wochenrenditen(a, ab).map((p) => [kalenderwoche(p.t), p]))
  const zwei = new Map(wochenrenditen(b, ab).map((p) => [kalenderwoche(p.t), p]))

  const gemeinsam: { t: string; x: number; y: number }[] = []
  for (const [woche, punkt] of eins) {
    if (!woche) continue
    const gegen = zwei.get(woche)
    if (!gegen) continue
    gemeinsam.push({ t: punkt.t, x: punkt.r, y: gegen.r })
  }
  if (gemeinsam.length < MINDESTWOCHEN) return null

  gemeinsam.sort((p, q) => p.t.localeCompare(q.t))
  const xs = gemeinsam.map((p) => p.x)
  const ys = gemeinsam.map((p) => p.y)

  const mx = xs.reduce((s, w) => s + w, 0) / xs.length
  const my = ys.reduce((s, w) => s + w, 0) / ys.length

  let oben = 0
  let untenX = 0
  let untenY = 0
  for (let i = 0; i < xs.length; i += 1) {
    const dx = xs[i]! - mx
    const dy = ys[i]! - my
    oben += dx * dy
    untenX += dx * dx
    untenY += dy * dy
  }
  if (untenX === 0 || untenY === 0) return null

  return {
    wert: oben / Math.sqrt(untenX * untenY),
    wochen: gemeinsam.length,
    von: gemeinsam[0]!.t,
    bis: gemeinsam[gemeinsam.length - 1]!.t,
  }
}

/**
 * Ein Satz, der einen Korrelationswert einordnet, ohne ihn zu bewerten.
 *
 * Die Schwellen sind Konvention, keine Naturkonstante – deshalb beschreiben
 * die Sätze, was die Zahl bedeutet, statt sie in „gut" und „schlecht" zu
 * sortieren.
 */
export function zusammenhangSatz(wert: number): string {
  const betrag = Math.abs(wert)
  const richtung = wert < 0 ? 'gegenläufig' : 'gleichläufig'
  if (betrag >= 0.8)
    return `sehr ${richtung} – die beiden bewegten sich fast im Gleichschritt`
  if (betrag >= 0.5) return `deutlich ${richtung}`
  if (betrag >= 0.2) return `schwach ${richtung}`
  return 'kaum ein Zusammenhang – die Wochen liefen weitgehend unabhängig'
}
