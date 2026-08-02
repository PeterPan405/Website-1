import { getFundamentalkennzahlen, getQuotes } from '@/lib/markets'
import { getBilanzzahlen } from '@/lib/fundamentaldaten'
import { median, platzVon } from '@/lib/vergleichsrechnung'

/**
 * Der Branchenvergleich einer Aktie: dieselben drei Kennzahlen, einmal für
 * den Titel und einmal als Median seiner Branche.
 *
 * ## Warum diese drei
 *
 * - **KGV** – was der Markt je Euro Gewinn bezahlt; die meistgenutzte und
 *   meistmissverstandene Zahl, gerade deshalb gehört sie eingeordnet.
 * - **Nettomarge** (Gewinn/Umsatz) – was vom Umsatz übrig bleibt. Ein
 *   Verhältnis zweier Größen derselben Bilanz, also währungsfrei.
 * - **Eigenkapitalrendite** (Gewinn/Eigenkapital) – was das eingesetzte
 *   Kapital verdient. Ebenfalls währungsfrei.
 *
 * Alle drei ergeben erst im Branchenvergleich einen Sinn: Eine Nettomarge
 * von acht Prozent ist im Handel stark und in der Software schwach. Genau
 * deshalb steht der Vergleich hier – und nicht ein absoluter „gut/schlecht“-
 * Stempel, den es ehrlicherweise nicht gibt.
 *
 * ## Warum Median und Platz, keine Note
 *
 * Der Median sagt, was in der Branche üblich ist (Begründung in
 * `lib/vergleichsrechnung.ts`); der Platz sagt, wo der Titel in der Reihe
 * steht – absteigend sortiert, was ausdrücklich eine Sortierung ist und
 * keine Wertung. Ob ein hohes KGV teuer oder verdient ist, entscheidet
 * keine Tabelle.
 *
 * Die Rechnung läuft einmal je Bau über den ganzen Katalog und wird
 * gemerkt – jede Aktienseite fragt dieselbe Karte ab.
 */

/** Ab so vielen Titeln mit Wert wird verglichen – wie beim Tagesbild. */
export const MINDESTZAHL = 4

interface Titelwerte {
  symbol: string
  kgv: number | null
  nettomarge: number | null
  ekRendite: number | null
}

export interface Vergleichszahl {
  /** Der Wert des Titels, oder null, wenn er sich nicht bilden lässt. */
  eigener: number | null
  median: number | null
  platz: { platz: number; von: number } | null
}

export interface Branchenvergleich {
  branche: string
  /** Wie viele Titel der Branche überhaupt Zahlen gemeldet haben. */
  titelMitZahlen: number
  kgv: Vergleichszahl
  nettomarge: Vergleichszahl
  ekRendite: Vergleichszahl
}

let karte: Promise<Map<string, Titelwerte[]>> | null = null

async function baueKarte(): Promise<Map<string, Titelwerte[]>> {
  const jeBranche = new Map<string, Titelwerte[]>()

  for (const quote of await getQuotes()) {
    if (quote.kind !== 'stock' || !quote.branche) continue
    const zahlen = getBilanzzahlen(quote.ticker)
    if (!zahlen) continue

    /*
      Marge und Eigenkapitalrendite sind Verhältnisse innerhalb derselben
      Bilanz – keine Währungsfrage. Das KGV braucht den Kurs in
      Bilanzwährung; das erledigt `getFundamentalkennzahlen` mitsamt allen
      dort begründeten Vorsichtsregeln (kein Demo-Kurs, Pence, Umrechnung).
    */
    const nettomarge =
      typeof zahlen.gewinn === 'number' &&
      typeof zahlen.umsatz === 'number' &&
      zahlen.umsatz > 0
        ? (zahlen.gewinn / zahlen.umsatz) * 100
        : null
    const ekRendite =
      typeof zahlen.gewinn === 'number' &&
      typeof zahlen.eigenkapital === 'number' &&
      zahlen.eigenkapital > 0
        ? (zahlen.gewinn / zahlen.eigenkapital) * 100
        : null

    const befund = await getFundamentalkennzahlen(quote.symbol)
    const kgv = befund?.art === 'zahlen' ? befund.kennzahlen.kgv.wert : null

    const eintrag: Titelwerte = { symbol: quote.symbol, kgv, nettomarge, ekRendite }
    const liste = jeBranche.get(quote.branche)
    if (liste) liste.push(eintrag)
    else jeBranche.set(quote.branche, [eintrag])
  }

  return jeBranche
}

function vergleiche(eigener: number | null, alle: (number | null)[]): Vergleichszahl {
  const werte = alle.filter((wert): wert is number => wert !== null)
  if (werte.length < MINDESTZAHL) return { eigener, median: null, platz: null }
  return {
    eigener,
    median: median(werte),
    platz: eigener === null ? null : platzVon(eigener, werte),
  }
}

export async function getBranchenvergleich(
  symbol: string
): Promise<Branchenvergleich | null> {
  karte ??= baueKarte()
  const jeBranche = await karte

  for (const [branche, titel] of jeBranche) {
    const eigener = titel.find((eintrag) => eintrag.symbol === symbol)
    if (!eigener) continue

    const ergebnis: Branchenvergleich = {
      branche,
      titelMitZahlen: titel.length,
      kgv: vergleiche(
        eigener.kgv,
        titel.map((eintrag) => eintrag.kgv)
      ),
      nettomarge: vergleiche(
        eigener.nettomarge,
        titel.map((eintrag) => eintrag.nettomarge)
      ),
      ekRendite: vergleiche(
        eigener.ekRendite,
        titel.map((eintrag) => eintrag.ekRendite)
      ),
    }

    // Ohne einen einzigen Vergleichswert gibt es nichts einzuordnen.
    if (
      ergebnis.kgv.median === null &&
      ergebnis.nettomarge.median === null &&
      ergebnis.ekRendite.median === null
    ) {
      return null
    }
    return ergebnis
  }
  return null
}
