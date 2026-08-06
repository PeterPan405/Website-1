/**
 * Monatsrenditen über die Jahre – und warum sie fast nichts beweisen.
 *
 * ## Worum es geht
 *
 * „Sell in May and go away." „Die Jahresendrallye." „Der September ist der
 * schlechteste Börsenmonat." Solche Sätze stehen in jedem zweiten Ratgeber,
 * und sie lassen sich leicht mit einer Tabelle unterlegen: Man rechnet für
 * jeden Kalendermonat den Durchschnitt über die vorhandenen Jahre, sortiert
 * absteigend und hat ein Muster.
 *
 * **Das Muster entsteht auch dann, wenn es keine Saisonalität gibt.** Das ist
 * der Grund, warum dieses Modul existiert – nicht um die Zahlen zu liefern,
 * sondern um sie neben die Unschärfe zu stellen, aus der sie stammen.
 *
 * ## Die Rechnung, die den Ausschlag gibt
 *
 * Zwölf Mittelwerte aus je fünf Beobachtungen sind zwölf Zufallszahlen mit
 * einer Streuung von rund `s/√5`. Der **Abstand zwischen dem größten und dem
 * kleinsten** von zwölf solchen Zahlen ist keine kleine Größe: Für zwölf
 * unabhängige, normalverteilte Werte beträgt er im Mittel rund **3,26
 * Standardabweichungen** (die erwartete Spannweite `E[R]` einer Stichprobe
 * vom Umfang 12; nachschlagbar in jeder Tabelle für Spannweiten-Kontrollkarten,
 * dort als `d₂`).
 *
 * Bei einer Monatsstreuung von 5 Prozent und fünf Jahren sind das
 * `3,26 · 5/√5 ≈ 7,3` Prozentpunkte zwischen „bestem" und „schlechtestem"
 * Monat – **erwartet, bei vollständiger Abwesenheit jeder Saisonalität.**
 *
 * `spanneAusZufall()` rechnet genau diese Erwartung aus. Erst wenn die
 * beobachtete Spanne sie deutlich übersteigt, ist überhaupt etwas zu erklären.
 * Bei fünf Jahren Bestand tut sie das so gut wie nie, und die Seite sagt das.
 *
 * ## Warum trotzdem Monate und nicht Wochen
 *
 * `lib/reihenstatistik.ts` rechnet auf einem Wochenraster, weil der Bestand
 * bis Mitte 2025 nur wöchentlich ist. Für Monatsschlüsse ist das kein Problem:
 * Ein Monat enthält vier bis fünf Wochenpunkte, der letzte davon liegt
 * höchstens sechs Tage vor dem Monatsende. Die Monatsrendite ist damit leicht
 * unscharf abgegrenzt, aber nicht falsch – anders als eine Tagesrendite, die
 * in Wahrheit eine Woche wäre.
 *
 * ## Was hier bewusst nicht steht
 *
 * Keine Empfehlung, in einem Monat zu kaufen oder zu verkaufen. Keine
 * Hochrechnung auf das kommende Jahr. Und keine Auswahl des Zeitraums, bis
 * das Muster schön aussieht: Gerechnet wird über alles, was da ist.
 *
 * Das Modul lädt nichts, sondern bekommt Reihen übergeben – derselbe Grund
 * wie bei `lib/reihenstatistik.ts`: Tests laufen mit blankem Node, das den
 * Alias `@/` nicht auflöst.
 */

import { standardabweichung, type Reihenpunkt } from './reihenstatistik.ts'

/** Die deutschen Monatsnamen, Index 0 bleibt leer (Monate zählen ab 1). */
export const MONATSNAMEN = [
  '',
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
] as const

/**
 * Wie viele Jahre ein Kalendermonat mindestens hergeben muss.
 *
 * Drei Beobachtungen ergeben einen Mittelwert, aber keine Aussage. Vier ist
 * die Untergrenze, unterhalb derer die Zahl nicht einmal als Beschreibung
 * taugt – und selbst darüber steht die Unschärfe daneben.
 */
export const MINDESTJAHRE = 4

/**
 * Die erwartete Spannweite von zwölf unabhängigen Standardnormalwerten.
 *
 * Der Wert ist `d₂` für n = 12 aus der Spannweiten-Statistik: Zieht man zwölf
 * Zahlen aus derselben Verteilung, liegen größte und kleinste im Mittel um
 * diesen Faktor mal Standardabweichung auseinander. Er ist die Messlatte für
 * jedes Monatsmuster – alles darunter ist der Normalfall von reinem Zufall.
 */
export const SPANNE_AUS_ZUFALL_12 = 3.258

export interface Monatspunkt {
  /** Kalendermonat als `JJJJ-MM`. */
  m: string
  /** Der letzte Handelstag des Monats, als ISO-Datum. */
  t: string
  /** Schlusskurs an diesem Tag. */
  wert: number
}

export interface Monatsrendite {
  /** Der Monat, auf den sich die Rendite bezieht, als `JJJJ-MM`. */
  m: string
  jahr: number
  /** Kalendermonat, 1 bis 12. */
  monat: number
  /** Veränderung gegenüber dem Vormonatsschluss, als Faktor minus eins. */
  r: number
}

/**
 * Der Schlusskurs je Kalendermonat, ältester zuerst.
 *
 * **Der letzte Monat fällt heraus.** Er ist fast immer angebrochen: Am
 * 6. August wäre der „Augustschluss" der Kurs vom 6. August, und eine
 * Sechstagesrendite unter zwölf Monatsrenditen wäre eine falsch beschriftete
 * Zahl. Dass dabei gelegentlich ein tatsächlich vollständiger Monat verloren
 * geht – wenn die Reihe zufällig am Monatsletzten endet –, ist der billigere
 * Fehler.
 */
export function monatsschluesse(reihe: readonly Reihenpunkt[]): Monatspunkt[] {
  const jeMonat = new Map<string, Monatspunkt>()
  for (const punkt of reihe) {
    if (!Number.isFinite(punkt.value) || punkt.value <= 0) continue
    const m = punkt.t.slice(0, 7)
    if (!/^\d{4}-\d{2}$/.test(m)) continue
    // Überschreiben statt Prüfen: Die Reihe kommt aufsteigend.
    jeMonat.set(m, { m, t: punkt.t, wert: punkt.value })
  }

  const punkte = [...jeMonat.values()].sort((a, b) => a.m.localeCompare(b.m))
  return punkte.slice(0, -1)
}

/**
 * Die Monatsrenditen einer Reihe, älteste zuerst.
 *
 * Zwei Monatsschlüsse, die mehr als **45 Tage** auseinanderliegen, werden
 * übersprungen: Dann fehlt ein Monat im Bestand, und aus der Lücke entstünde
 * eine Zweimonatsrendite mit Monatsetikett.
 */
export function monatsrenditen(reihe: readonly Reihenpunkt[]): Monatsrendite[] {
  const punkte = monatsschluesse(reihe)
  const ergebnis: Monatsrendite[] = []

  for (let i = 1; i < punkte.length; i += 1) {
    const vor = punkte[i - 1]!
    const jetzt = punkte[i]!
    if (vor.wert <= 0) continue
    if (Math.abs(Date.parse(jetzt.t) - Date.parse(vor.t)) / 86_400_000 > 45) continue

    const [jahr, monat] = jetzt.m.split('-').map(Number) as [number, number]
    ergebnis.push({ m: jetzt.m, jahr, monat, r: jetzt.wert / vor.wert - 1 })
  }

  return ergebnis
}

export interface Monatsbefund {
  /** Kalendermonat, 1 bis 12. */
  monat: number
  name: string
  /** Wie viele Jahre für diesen Monat vorliegen. */
  jahre: number
  /** Durchschnittliche Monatsrendite in Prozent. */
  mittel: number
  /** Der mittlere Wert der Reihe, in Prozent – unempfindlich gegen Ausreißer. */
  median: number
  /** In wie vielen Jahren der Monat im Plus schloss. */
  imPlus: number
  /** Die schwächste einzelne Ausprägung, in Prozent. */
  tiefster: number
  /** Die stärkste einzelne Ausprägung, in Prozent. */
  hoechster: number
  /**
   * Die Unschärfe des Mittelwerts in Prozentpunkten (Standardfehler).
   *
   * `null`, wenn weniger als zwei Jahre vorliegen. Das ist die Zahl, die aus
   * dem Mittelwert eine Aussage oder eine Zufälligkeit macht.
   */
  unschaerfe: number | null
}

export interface Saisonbefund {
  /** Alle zwölf Monate, Januar zuerst. Monate ohne genug Jahre fehlen. */
  monate: Monatsbefund[]
  /** Wie viele Monatsrenditen insgesamt eingegangen sind. */
  beobachtungen: number
  von: string
  bis: string
  /** Der stärkste Monat im Mittel. */
  bester: Monatsbefund
  /** Der schwächste Monat im Mittel. */
  schwaechster: Monatsbefund
  /** Abstand zwischen beiden, in Prozentpunkten. */
  spanne: number
  /**
   * Der Abstand, den zwölf Monatsmittel **ohne jede Saisonalität** allein aus
   * Zufall erwarten lassen, in Prozentpunkten.
   */
  spanneAusZufall: number
}

/**
 * Was die Monate einer Reihe hergeben – und was davon Zufall ist.
 *
 * Gibt `null` zurück, wenn nicht jeder Kalendermonat mindestens
 * `MINDESTJAHRE` Beobachtungen hat. Eine Tabelle mit Lücken lädt dazu ein,
 * den Monat mit den wenigsten Daten für den auffälligsten zu halten.
 */
export function saisonalitaet(reihe: readonly Reihenpunkt[]): Saisonbefund | null {
  const renditen = monatsrenditen(reihe)
  if (renditen.length === 0) return null

  const monate: Monatsbefund[] = []
  for (let monat = 1; monat <= 12; monat += 1) {
    const werte = renditen.filter((p) => p.monat === monat).map((p) => p.r)
    if (werte.length < MINDESTJAHRE) return null

    const abweichung = standardabweichung(werte)
    const sortiert = [...werte].sort((a, b) => a - b)
    const mitte = Math.floor(sortiert.length / 2)

    monate.push({
      monat,
      name: MONATSNAMEN[monat]!,
      jahre: werte.length,
      mittel: (werte.reduce((s, w) => s + w, 0) / werte.length) * 100,
      median:
        (sortiert.length % 2 === 1
          ? sortiert[mitte]!
          : (sortiert[mitte - 1]! + sortiert[mitte]!) / 2) * 100,
      imPlus: werte.filter((w) => w > 0).length,
      tiefster: sortiert[0]! * 100,
      hoechster: sortiert[sortiert.length - 1]! * 100,
      unschaerfe:
        abweichung === null ? null : (abweichung / Math.sqrt(werte.length)) * 100,
    })
  }

  const nachMittel = [...monate].sort((a, b) => b.mittel - a.mittel)
  const bester = nachMittel[0]!
  const schwaechster = nachMittel[nachMittel.length - 1]!

  return {
    monate,
    beobachtungen: renditen.length,
    von: renditen[0]!.m,
    bis: renditen[renditen.length - 1]!.m,
    bester,
    schwaechster,
    spanne: bester.mittel - schwaechster.mittel,
    spanneAusZufall: spanneAusZufall(monate),
  }
}

/**
 * Wie weit bester und schwächster Monat allein aus Zufall auseinanderlägen.
 *
 * Genommen wird die **mittlere** Unschärfe der zwölf Monatsmittel, mal der
 * erwarteten Spannweite von zwölf Werten. Der Median statt des Durchschnitts,
 * damit ein einzelner sehr unruhiger Monat die Messlatte nicht anhebt und
 * damit ausgerechnet das Muster rechtfertigt, das er selbst erzeugt.
 */
export function spanneAusZufall(monate: readonly Monatsbefund[]): number {
  const unschaerfen = monate
    .map((m) => m.unschaerfe)
    .filter((u): u is number => u !== null)
    .sort((a, b) => a - b)
  if (unschaerfen.length === 0) return 0

  const mitte = Math.floor(unschaerfen.length / 2)
  const median =
    unschaerfen.length % 2 === 1
      ? unschaerfen[mitte]!
      : (unschaerfen[mitte - 1]! + unschaerfen[mitte]!) / 2

  return median * SPANNE_AUS_ZUFALL_12
}

export interface Halbjahresprobe {
  /** Mittel der Monatsmittel Mai bis Oktober, in Prozent. */
  sommer: number
  /** Mittel der Monatsmittel November bis April, in Prozent. */
  winter: number
  /** Wie viel das Winterhalbjahr vorn liegt, in Prozentpunkten. Negativ: hinten. */
  abstand: number
}

/**
 * „Sell in May and go away" – die Behauptung, nachgerechnet.
 *
 * Der Spruch besagt, dass die Monate Mai bis Oktober schwächer laufen als
 * November bis April. Genau diese beiden Hälften stellt die Probe gegenüber.
 *
 * Gemittelt werden die **Monatsmittel**, nicht alle Einzelrenditen. Der
 * Unterschied ist klein und die Wahl bewusst: So zählt jeder Kalendermonat
 * gleich viel, auch wenn für ihn ein Jahr mehr oder weniger vorliegt als für
 * seinen Nachbarn.
 */
export function halbjahresprobe(befund: Saisonbefund): Halbjahresprobe {
  const mittelVon = (monate: readonly number[]) => {
    const werte = befund.monate
      .filter((m) => monate.includes(m.monat))
      .map((m) => m.mittel)
    if (werte.length === 0) return 0
    return werte.reduce((s, w) => s + w, 0) / werte.length
  }

  const sommer = mittelVon([5, 6, 7, 8, 9, 10])
  const winter = mittelVon([11, 12, 1, 2, 3, 4])
  return { sommer, winter, abstand: winter - sommer }
}

/**
 * Der wievielt-stärkste Monat ein Kalendermonat war, 1 ist der stärkste.
 *
 * Nützlich, um einen Spruch am Bestand zu prüfen, statt ihn zu wiederholen:
 * Steht der September wirklich hinten, und wo steht der Dezember?
 */
export function rang(befund: Saisonbefund, monat: number): number | null {
  const sortiert = [...befund.monate].sort((a, b) => b.mittel - a.mittel)
  const stelle = sortiert.findIndex((m) => m.monat === monat)
  return stelle === -1 ? null : stelle + 1
}

/**
 * Eine Zahl mit einer Nachkommastelle und deutschem Komma.
 *
 * `toFixed` liefert einen Punkt, und „22.1 Prozentpunkte" in einem deutschen
 * Satz ist ein Fehler, den nur niemand meldet. `lib/format.ts` wäre der
 * richtige Ort dafür, steht aber hier nicht zur Verfügung: Dieses Modul bleibt
 * importfrei, damit es sich mit blankem Node testen lässt.
 */
function mitKomma(wert: number): string {
  return wert.toFixed(1).replace('.', ',')
}

/**
 * Der Satz, der den Befund einordnet, ohne ihn zu einer Regel zu machen.
 *
 * Die Schwelle ist bewusst großzügig zugunsten des Zufalls: Erst wenn die
 * beobachtete Spanne die erwartete um die Hälfte übersteigt, ist überhaupt
 * von einem Muster die Rede – und auch dann nur von einem, das „über den
 * Zufall hinausgeht", nicht von einer Regel für das kommende Jahr.
 */
export function saisonSatz(befund: Saisonbefund): string {
  const beobachtet = befund.spanne
  const erwartet = befund.spanneAusZufall

  if (erwartet <= 0) return 'Zu wenig Bestand, um Zufall von Muster zu trennen.'

  if (beobachtet < erwartet) {
    return (
      `Die Monate liegen ${mitKomma(beobachtet)} Prozentpunkte auseinander – ` +
      `weniger, als zwölf Mittelwerte aus so wenigen Jahren allein aus Zufall ` +
      `erwarten lassen (${mitKomma(erwartet)}). Hier ist kein Muster, das ` +
      `erklärt werden müsste.`
    )
  }

  if (beobachtet < erwartet * 1.5) {
    return (
      `Die Monate liegen ${mitKomma(beobachtet)} Prozentpunkte auseinander. ` +
      `Zufall allein lässt ${mitKomma(erwartet)} erwarten – der Abstand ist ` +
      `größer, aber nicht deutlich genug, um ihn von Zufall zu unterscheiden.`
    )
  }

  return (
    `Die Monate liegen ${mitKomma(beobachtet)} Prozentpunkte auseinander, ` +
    `deutlich mehr als die ${mitKomma(erwartet)}, die Zufall allein erwarten ` +
    `lässt. Das geht über Zufall hinaus – über die Ursache sagt es nichts, ` +
    `und über das kommende Jahr erst recht nicht.`
  )
}
