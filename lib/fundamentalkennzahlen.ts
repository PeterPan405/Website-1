/**
 * Bewertungskennzahlen aus Bilanzzahlen und Kurs.
 *
 * Bewusst ohne Importe, damit `tests/` das Modul direkt laden kann – der
 * Alias `@/` steht dort nicht zur Verfügung.
 *
 * ## Was hier gerechnet wird und was nicht
 *
 * Fünf Zahlen: Marktkapitalisierung, Kurs-Gewinn-Verhältnis,
 * Kurs-Umsatz-Verhältnis, Kurs-Buchwert-Verhältnis und Cashflow je Aktie. Alle
 * fünf ergeben sich aus zwei Dingen – den Pflichtmeldungen des Unternehmens und
 * dem aktuellen Kurs. Nichts davon ist geschätzt, gerundet aus zweiter Hand
 * oder von einem Anbieter übernommen, der seine Methode nicht offenlegt.
 *
 * Nicht gerechnet werden Dividendenrendite und Verschuldungsgrad. Für die
 * Dividende bräuchte es die Ausschüttungen je Aktie, für die Verschuldung eine
 * saubere Trennung von zinstragenden und übrigen Verbindlichkeiten – beides
 * liefert die genutzte Quelle nicht verlässlich genug.
 *
 * ## Warum eine Kennzahl fehlen darf
 *
 * Ein Unternehmen im Verlust hat kein sinnvolles Kurs-Gewinn-Verhältnis. Die
 * Formel ergibt dann eine negative Zahl, und die liest sich wie „besonders
 * günstig“, obwohl sie das Gegenteil bedeutet. Solche Fälle liefern hier `null`
 * plus einen Grund, damit die Oberfläche sagen kann, was los ist, statt eine
 * irreführende Zahl zu zeigen.
 */

/** Die Rohgrößen, so wie sie aus den Pflichtmeldungen kommen. Alles in USD. */
export interface Bilanzzahlen {
  /** Umsatz des zuletzt gemeldeten Geschäftsjahres. */
  umsatz?: number
  /** Nettogewinn desselben Zeitraums, kann negativ sein. */
  gewinn?: number
  /** Operativer Cashflow desselben Zeitraums. */
  cashflow?: number
  /** Eigenkapital zum jüngsten Stichtag. */
  eigenkapital?: number
  /** Ausstehende Aktien zum jüngsten Stichtag. */
  aktien?: number
}

/**
 * Warum eine Kennzahl nicht dasteht.
 *
 * - `fehlt` – die Quelle meldet die nötige Größe nicht
 * - `verlust` – das Unternehmen hat im Berichtsjahr Verlust gemacht
 * - `negativesEigenkapital` – die Schulden übersteigen das Vermögen
 */
export type Ausfallgrund = 'fehlt' | 'verlust' | 'negativesEigenkapital'

export interface Kennwert {
  /** Der Wert, oder `null`, wenn er sich nicht sinnvoll bilden lässt. */
  wert: number | null
  /** Nur gesetzt, wenn `wert` null ist. */
  grund: Ausfallgrund | null
}

export interface Fundamentalkennzahlen {
  /** Kurs mal Aktienzahl, in USD. */
  marktkapitalisierung: Kennwert
  /** Kurs geteilt durch Gewinn je Aktie. */
  kgv: Kennwert
  /** Kurs geteilt durch Umsatz je Aktie. */
  kuv: Kennwert
  /** Kurs geteilt durch Eigenkapital je Aktie. */
  kbv: Kennwert
  /** Operativer Cashflow je Aktie, in USD. */
  cashflowJeAktie: Kennwert
  /** Wie viele der fünf Zahlen tatsächlich dastehen. */
  belegt: number
}

const FEHLT: Kennwert = { wert: null, grund: 'fehlt' }

function wert(zahl: number): Kennwert {
  return { wert: zahl, grund: null }
}

function ausfall(grund: Ausfallgrund): Kennwert {
  return { wert: null, grund }
}

/** Eine Zahl, mit der man rechnen kann: vorhanden, endlich, größer als null. */
function positiv(zahl: number | undefined): zahl is number {
  return typeof zahl === 'number' && Number.isFinite(zahl) && zahl > 0
}

/** Vorhanden und endlich – Vorzeichen egal, weil Gewinne negativ sein dürfen. */
function vorhanden(zahl: number | undefined): zahl is number {
  return typeof zahl === 'number' && Number.isFinite(zahl)
}

/**
 * Die fünf Kennzahlen zu einem Unternehmen.
 *
 * `kurs` ist der aktuelle Kurs **einer** Aktie in derselben Währung, in der die
 * Bilanzzahlen gemeldet sind. Stimmt das nicht überein, kommt Unsinn heraus –
 * wer diese Funktion aufruft, muss das vorher sicherstellen.
 */
export function berechneFundamentalkennzahlen(
  zahlen: Bilanzzahlen,
  kurs: number
): Fundamentalkennzahlen {
  const brauchbarerKurs = positiv(kurs)
  const aktien = positiv(zahlen.aktien) ? zahlen.aktien : null

  const marktkapitalisierung =
    brauchbarerKurs && aktien !== null ? wert(kurs * aktien) : FEHLT

  /*
    Alle Verhältniszahlen laufen über die Aktienzahl.

    Man könnte das Kurs-Gewinn-Verhältnis auch als Marktkapitalisierung geteilt
    durch Gewinn rechnen – rechnerisch dasselbe. Über den Wert je Aktie ist es
    aber die Formel, die in jedem Lehrbuch steht, und wer nachrechnen will,
    findet sie wieder.
  */
  const kgv =
    !brauchbarerKurs || aktien === null || !vorhanden(zahlen.gewinn)
      ? FEHLT
      : zahlen.gewinn <= 0
        ? ausfall('verlust')
        : wert(kurs / (zahlen.gewinn / aktien))

  const kuv =
    !brauchbarerKurs || aktien === null || !positiv(zahlen.umsatz)
      ? FEHLT
      : wert(kurs / (zahlen.umsatz / aktien))

  const kbv =
    !brauchbarerKurs || aktien === null || !vorhanden(zahlen.eigenkapital)
      ? FEHLT
      : zahlen.eigenkapital <= 0
        ? ausfall('negativesEigenkapital')
        : wert(kurs / (zahlen.eigenkapital / aktien))

  const cashflowJeAktie =
    aktien === null || !vorhanden(zahlen.cashflow)
      ? FEHLT
      : wert(zahlen.cashflow / aktien)

  const alle = [marktkapitalisierung, kgv, kuv, kbv, cashflowJeAktie]

  return {
    marktkapitalisierung,
    kgv,
    kuv,
    kbv,
    cashflowJeAktie,
    belegt: alle.filter((eintrag) => eintrag.wert !== null).length,
  }
}
