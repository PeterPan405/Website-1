/**
 * Angst und Gier – die Rechnung hinter dem Tacho.
 *
 * ## Warum eine eigene Rechnung und keine abgeschriebene Zahl
 *
 * Der bekannteste Index dieser Art stammt von CNN. Er hat keine offene
 * Schnittstelle; ihn abzugreifen wäre weder erlaubt noch überprüfbar. Für
 * Kryptowährungen gibt es eine offene Quelle, aber auch die ist eine Blackbox:
 * Man bekommt eine Zahl und muss glauben, wie sie zustande kam.
 *
 * Auf einer Seite, die bei jeder Kennzahl das Bezugsjahr und die Quelle nennt,
 * wäre eine Stimmungszahl ohne nachvollziehbare Herkunft ein Fremdkörper.
 * Deshalb wird hier selbst gerechnet – aus denselben Tagesschlusskursen, die
 * ohnehin abgerufen werden, nach einem Verfahren, das auf der Seite steht.
 *
 * ## Die drei Bestandteile
 *
 * 1. **Abstand zum Trend.** Wie weit steht der Leitkurs des Bereichs über oder
 *    unter seinem Durchschnitt der letzten 125 Handelstage – rund ein halbes
 *    Börsenjahr. Weit darüber heißt Gier, weit darunter Angst.
 *
 * 2. **Schwankungsbreite.** Wie stark schwankt der Leitkurs in den letzten 30
 *    Handelstagen, gemessen an seiner eigenen Schwankung des letzten Jahres.
 *    Ruhige Märkte sind zuversichtliche Märkte; Angst zeigt sich zuerst in der
 *    Heftigkeit der Ausschläge, nicht in ihrer Richtung.
 *
 * 3. **Stand in der Jahresspanne.** Wo der Leitkurs zwischen seinem Jahrestief
 *    und seinem Jahreshoch liegt. Nahe am Tief ist Angst, nahe am Hoch Gier –
 *    unabhängig davon, wie ruhig es dort gerade zugeht.
 *
 * 4. **Marktbreite.** Welcher Anteil der Einzelwerte des Bereichs steht über
 *    seinem eigenen 50-Tage-Durchschnitt. Steigt der Index, während nur wenige
 *    Werte mitsteigen, ist die Zuversicht schmaler, als der Index behauptet.
 *
 * Jeder Bestandteil ergibt eine Zahl von 0 bis 100, das Ergebnis ist ihr
 * Mittel. Fehlt einer – zu wenige Werte mit echter Kurshistorie –, zählt er
 * nicht mit, statt mit einem geschätzten Wert einzugehen.
 *
 * ## Was das nicht ist
 *
 * Keine Prognose und kein Signal. Der Wert beschreibt eine Marktlage, die es
 * schon gibt. Extreme Werte sagen nichts darüber, wann sie enden.
 *
 * Import-frei wie `lib/market-quote.ts` und `lib/globus-geometrie.ts`, damit
 * `tests/` das Modul direkt laden kann.
 */

/** Ein Tagesschlusskurs. */
export interface Kurspunkt {
  /** ISO-Datum, aufsteigend sortiert. */
  d: string
  /** Schlusskurs. */
  c: number
}

/** Die fünf Stufen, wie man sie von solchen Anzeigen kennt. */
export type Stimmungsstufe =
  'extreme-angst' | 'angst' | 'neutral' | 'gier' | 'extreme-gier'

export interface Bestandteil {
  /** Beschriftung für die Seite. */
  label: string
  /** 0 bis 100. */
  wert: number
  /** Was gemessen wurde, im Klartext. */
  erklaerung: string
}

export interface Stimmung {
  /** 0 bis 100, gerundet. */
  wert: number
  stufe: Stimmungsstufe
  bestandteile: Bestandteil[]
}

/**
 * Wie empfindlich der Bereich auf die drei Größen reagiert.
 *
 * Aktien und Kryptowährungen brauchen verschiedene Maßstäbe: Zehn Prozent über
 * dem Halbjahresdurchschnitt sind bei einem Aktienindex viel und bei Bitcoin
 * ein ruhiger Monat. Ein gemeinsamer Maßstab hieße, dass der Kryptotacho immer
 * am Anschlag steht.
 */
export interface Massstab {
  /** Abstand zum Trend in Prozent, der als „extreme Angst“ gilt. */
  trendUnten: number
  /** … und als „extreme Gier“. */
  trendOben: number
  /**
   * Verhältnis der aktuellen zur üblichen Schwankung, das als Angst gilt.
   * Über diesem Wert steht der Bestandteil auf 0.
   */
  schwankungHoch: number
  /** … und darunter auf 100. */
  schwankungNiedrig: number
}

export const MASSSTAB_AKTIEN: Massstab = {
  trendUnten: -10,
  trendOben: 10,
  schwankungHoch: 1.7,
  schwankungNiedrig: 0.6,
}

export const MASSSTAB_KRYPTO: Massstab = {
  trendUnten: -30,
  trendOben: 30,
  schwankungHoch: 1.7,
  schwankungNiedrig: 0.6,
}

/** Auf 0 bis 100 begrenzen. */
export function begrenze(wert: number): number {
  if (!Number.isFinite(wert)) return 50
  return Math.max(0, Math.min(100, wert))
}

/**
 * Lineare Umrechnung einer Spanne auf 0 bis 100.
 *
 * `beiNull` darf über `beiHundert` liegen – dann dreht sich die Richtung um.
 * Genau das braucht die Schwankungsbreite: viel Schwankung, wenig Zuversicht.
 */
export function aufSkala(wert: number, beiNull: number, beiHundert: number): number {
  if (beiNull === beiHundert) return 50
  return begrenze(((wert - beiNull) / (beiHundert - beiNull)) * 100)
}

/** Durchschnitt der letzten `tage` Schlusskurse. */
export function gleitenderDurchschnitt(
  punkte: readonly Kurspunkt[],
  tage: number
): number | null {
  if (punkte.length < tage || tage < 1) return null
  const abschnitt = punkte.slice(-tage)
  const summe = abschnitt.reduce((wert, punkt) => wert + punkt.c, 0)
  return summe / tage
}

/**
 * Schwankungsbreite als Standardabweichung der Tagesveränderungen.
 *
 * Bewusst nicht auf ein Jahr hochgerechnet: Verglichen wird der Wert nur mit
 * sich selbst, und ein gemeinsamer Faktor auf beiden Seiten des Vergleichs
 * kürzt sich heraus. Die Hochrechnung würde eine Genauigkeit vortäuschen, die
 * bei 30 Beobachtungen nicht da ist.
 */
export function schwankung(punkte: readonly Kurspunkt[], tage: number): number | null {
  if (punkte.length < tage + 1 || tage < 2) return null
  const abschnitt = punkte.slice(-(tage + 1))
  const renditen: number[] = []
  for (let i = 1; i < abschnitt.length; i += 1) {
    const vorher = abschnitt[i - 1].c
    if (vorher > 0) renditen.push(abschnitt[i].c / vorher - 1)
  }
  if (renditen.length < 2) return null
  const mittel = renditen.reduce((a, b) => a + b, 0) / renditen.length
  const varianz =
    renditen.reduce((summe, r) => summe + (r - mittel) ** 2, 0) / (renditen.length - 1)
  return Math.sqrt(varianz)
}

/**
 * Abstand des letzten Kurses zu seinem Durchschnitt, in Prozent.
 *
 * `null`, wenn die Reihe zu kurz ist – lieber ein Bestandteil weniger als
 * einer, der auf drei Kursen beruht.
 */
export function abstandZumTrend(punkte: readonly Kurspunkt[], tage = 125): number | null {
  const schnitt = gleitenderDurchschnitt(punkte, tage)
  if (schnitt === null || schnitt <= 0) return null
  const letzter = punkte[punkte.length - 1]?.c
  if (!Number.isFinite(letzter)) return null
  return (letzter / schnitt - 1) * 100
}

/**
 * Die aktuelle Schwankung im Verhältnis zur üblichen.
 *
 * „Üblich“ ist der Median der 30-Tage-Schwankung über das letzte Jahr, nicht
 * ihr Durchschnitt: Ein einzelner Absturz zieht den Durchschnitt so weit nach
 * oben, dass ein anschließend nervöser Markt ruhig aussähe.
 */
export function schwankungsverhaeltnis(
  punkte: readonly Kurspunkt[],
  fenster = 30,
  vergleichszeitraum = 250
): number | null {
  const aktuell = schwankung(punkte, fenster)
  if (aktuell === null || aktuell <= 0) return null

  const werte: number[] = []
  const beginn = Math.max(fenster + 1, punkte.length - vergleichszeitraum)
  for (let ende = beginn; ende <= punkte.length; ende += 1) {
    const wert = schwankung(punkte.slice(0, ende), fenster)
    if (wert !== null && wert > 0) werte.push(wert)
  }
  if (werte.length < 20) return null

  werte.sort((a, b) => a - b)
  const mitte = Math.floor(werte.length / 2)
  const median =
    werte.length % 2 === 0 ? (werte[mitte - 1] + werte[mitte]) / 2 : werte[mitte]
  if (median <= 0) return null
  return aktuell / median
}

/**
 * Wo der Kurs innerhalb seiner Jahresspanne steht – 0 am Tief, 100 am Hoch.
 *
 * ## Warum es diesen vierten Bestandteil gibt
 *
 * Er ist als Gegengewicht entstanden. Für Kryptowährungen gibt es zu wenige
 * Reihen für eine Marktbreite, es blieben also Trend und Schwankung. Beim
 * ersten Lauf stand Bitcoin 7,4 Prozent unter seinem Halbjahrestrend – und der
 * Tacho zeigte trotzdem „Gier“, weil die Schwankung gerade niedrig war und bei
 * zwei Bestandteilen jeder die Hälfte wiegt. Ein ruhiger, fallender Markt sah
 * aus wie ein zuversichtlicher.
 *
 * Der Stand in der Jahresspanne ist gerichtet wie der Trend, misst aber etwas
 * anderes: nicht die Abweichung vom Durchschnitt, sondern die Lage zwischen
 * den Extremen des Jahres. Nahe am Jahrestief zu notieren ist Angst, auch wenn
 * es dort gerade ruhig zugeht.
 */
export function standInJahresspanne(
  punkte: readonly Kurspunkt[],
  tage = 250
): number | null {
  if (punkte.length < tage) return null
  const abschnitt = punkte.slice(-tage)
  let tief = Infinity
  let hoch = -Infinity
  for (const punkt of abschnitt) {
    if (punkt.c < tief) tief = punkt.c
    if (punkt.c > hoch) hoch = punkt.c
  }
  const letzter = abschnitt[abschnitt.length - 1]?.c
  if (!Number.isFinite(letzter) || !(hoch > tief)) return null
  return ((letzter - tief) / (hoch - tief)) * 100
}

/**
 * Anteil der Reihen, die über ihrem eigenen Durchschnitt stehen – in Prozent.
 *
 * `null` bei weniger als `mindestens` brauchbaren Reihen: Eine „Marktbreite“
 * aus drei Werten ist keine Breite.
 */
export function marktbreite(
  reihen: readonly (readonly Kurspunkt[])[],
  tage = 50,
  mindestens = 8
): number | null {
  let brauchbar = 0
  let darueber = 0
  for (const reihe of reihen) {
    const schnitt = gleitenderDurchschnitt(reihe, tage)
    const letzter = reihe[reihe.length - 1]?.c
    if (schnitt === null || schnitt <= 0 || !Number.isFinite(letzter)) continue
    brauchbar += 1
    if (letzter > schnitt) darueber += 1
  }
  if (brauchbar < mindestens) return null
  return (darueber / brauchbar) * 100
}

/**
 * Die Stufe zu einem Wert.
 *
 * Die Grenzen sind die gewohnten: Unter 25 extreme Angst, ab 75 extreme Gier,
 * und dazwischen ein schmaler neutraler Bereich. Sie sind Konvention, keine
 * Messgröße – deshalb stehen sie hier an einer Stelle und nicht verstreut in
 * der Anzeige.
 */
export function stufeFuer(wert: number): Stimmungsstufe {
  if (wert < 25) return 'extreme-angst'
  if (wert < 45) return 'angst'
  if (wert <= 55) return 'neutral'
  if (wert <= 75) return 'gier'
  return 'extreme-gier'
}

export const STUFEN_TEXT: Record<Stimmungsstufe, string> = {
  'extreme-angst': 'Extreme Angst',
  angst: 'Angst',
  neutral: 'Neutral',
  gier: 'Gier',
  'extreme-gier': 'Extreme Gier',
}

/**
 * Setzt die Stimmung aus den vorhandenen Bestandteilen zusammen.
 *
 * Fehlende zählen nicht mit. Bleibt keiner übrig, kommt `null` zurück – dann
 * zeigt die Seite den Tacho gar nicht erst, statt eine 50 hinzuschreiben, die
 * nach Neutralität aussieht und in Wahrheit Datenmangel ist.
 */
export function berechneStimmung(
  leitreihe: readonly Kurspunkt[],
  einzelreihen: readonly (readonly Kurspunkt[])[],
  massstab: Massstab
): Stimmung | null {
  const bestandteile: Bestandteil[] = []

  const trend = abstandZumTrend(leitreihe)
  if (trend !== null) {
    bestandteile.push({
      label: 'Abstand zum Trend',
      wert: aufSkala(trend, massstab.trendUnten, massstab.trendOben),
      erklaerung: `Der Leitkurs steht ${trend >= 0 ? '' : '−'}${Math.abs(trend).toFixed(1).replace('.', ',')} Prozent ${trend >= 0 ? 'über' : 'unter'} seinem Durchschnitt der letzten 125 Handelstage.`,
    })
  }

  const verhaeltnis = schwankungsverhaeltnis(leitreihe)
  if (verhaeltnis !== null) {
    bestandteile.push({
      label: 'Schwankungsbreite',
      wert: aufSkala(verhaeltnis, massstab.schwankungHoch, massstab.schwankungNiedrig),
      erklaerung: `Die Schwankung der letzten 30 Handelstage liegt beim ${verhaeltnis.toFixed(2).replace('.', ',')}-Fachen des üblichen Werts der letzten zwölf Monate.`,
    })
  }

  const spanne = standInJahresspanne(leitreihe)
  if (spanne !== null) {
    bestandteile.push({
      label: 'Stand in der Jahresspanne',
      wert: begrenze(spanne),
      erklaerung: `Der Leitkurs liegt ${spanne.toFixed(0)} Prozent des Weges zwischen seinem Jahrestief und seinem Jahreshoch.`,
    })
  }

  const breite = marktbreite(einzelreihen)
  if (breite !== null) {
    bestandteile.push({
      label: 'Marktbreite',
      wert: begrenze(breite),
      erklaerung: `${breite.toFixed(0)} Prozent der Einzelwerte stehen über ihrem eigenen 50-Tage-Durchschnitt.`,
    })
  }

  if (bestandteile.length === 0) return null

  const mittel =
    bestandteile.reduce((summe, teil) => summe + teil.wert, 0) / bestandteile.length
  const wert = Math.round(begrenze(mittel))

  return { wert, stufe: stufeFuer(wert), bestandteile }
}
