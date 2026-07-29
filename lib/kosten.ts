/**
 * Was laufende Kosten über die Jahre aus einem Vermögen herausnehmen.
 *
 * Bewusst ohne Importe, damit `tests/` das Modul direkt laden kann.
 *
 * ## Warum das eine eigene Rechnung braucht
 *
 * Weil die naheliegende Antwort falsch ist. Eine Kostenquote von 1,5 Prozent
 * klingt nach 1,5 Prozent weniger Ertrag – tatsächlich sind es über dreißig
 * Jahre rund ein Drittel des Endvermögens. Der Grund ist, dass die Gebühr nicht
 * einmal anfällt, sondern jedes Jahr, und zwar auf den gesamten Bestand: Was
 * sie entnimmt, fehlt nicht nur selbst, es verzinst sich auch nie wieder.
 *
 * ## Wie die Kosten angesetzt werden
 *
 * Eine Fondskostenquote wird dem Vermögen entnommen, nicht dem Ertrag. Über ein
 * Jahr gerechnet heißt das:
 *
 *     netto = (1 + brutto) × (1 − kostenquote) − 1
 *
 * Bei 7 Prozent Bruttorendite und 1,5 Prozent Kosten bleiben damit 5,395
 * Prozent, nicht 5,5. Die Differenz ist klein und in dreißig Jahren spürbar –
 * sie ist genau der Betrag, den die Gebühr auf den Wertzuwachs des Jahres
 * zusätzlich erhebt.
 *
 * Nicht enthalten sind Ausgabeaufschläge, Depotgebühren, Transaktionskosten
 * und Steuern. Wer die mitrechnen will, erhöht die Kostenquote entsprechend;
 * hier geht es um die eine Größe, die im Factsheet steht.
 */

export interface Kostenannahmen {
  /** Einmalanlage zu Beginn, in Euro. */
  einmalanlage: number
  /** Monatlicher Sparbetrag, in Euro. */
  sparrate: number
  /** Anlagedauer in Jahren. */
  jahre: number
  /** Bruttorendite je Jahr als Dezimalzahl: 0,07 für 7 Prozent. */
  bruttorendite: number
  /** Laufende Kosten je Jahr als Dezimalzahl: 0,002 für 0,2 Prozent. */
  kostenquote: number
}

export interface Kostenergebnis {
  /** Vermögen am Ende der Laufzeit. */
  endwert: number
  /** Was insgesamt eingezahlt wurde. */
  eingezahlt: number
  /** Summe aller entnommenen Gebühren, ohne deren entgangenen Zinsertrag. */
  gebuehren: number
  /** Die Nettorendite, mit der tatsächlich gerechnet wurde. */
  nettorendite: number
}

/** Die Nettorendite nach laufenden Kosten. */
export function nettorendite(bruttorendite: number, kostenquote: number): number {
  return (1 + bruttorendite) * (1 - kostenquote) - 1
}

/**
 * Der Verlauf eines Sparplans, Jahr für Jahr.
 *
 * Monatliche Einzahlungen werden monatlich verzinst – nicht als Jahresbetrag am
 * Jahresende. Der Unterschied beträgt über dreißig Jahre mehrere Prozent, und
 * er geht immer zulasten der bequemeren Rechnung.
 */
export function verlauf(annahmen: Kostenannahmen): Kostenergebnis {
  const { einmalanlage, sparrate, jahre, bruttorendite, kostenquote } = annahmen

  if (!Number.isFinite(jahre) || jahre <= 0) {
    return {
      endwert: Math.max(einmalanlage, 0),
      eingezahlt: Math.max(einmalanlage, 0),
      gebuehren: 0,
      nettorendite: nettorendite(bruttorendite, kostenquote),
    }
  }

  const monate = Math.round(jahre * 12)
  const netto = nettorendite(bruttorendite, kostenquote)
  const brutto = bruttorendite

  // Monatszins als geometrischer Anteil des Jahreszinses, nicht als Zwölftel.
  const monatszinsNetto = (1 + netto) ** (1 / 12) - 1
  const monatszinsBrutto = (1 + brutto) ** (1 / 12) - 1

  let bestand = Math.max(einmalanlage, 0)
  let ohneKosten = Math.max(einmalanlage, 0)
  let eingezahlt = Math.max(einmalanlage, 0)
  const rate = Math.max(sparrate, 0)

  for (let monat = 0; monat < monate; monat += 1) {
    bestand = bestand * (1 + monatszinsNetto) + rate
    ohneKosten = ohneKosten * (1 + monatszinsBrutto) + rate
    eingezahlt += rate
  }

  return {
    endwert: bestand,
    eingezahlt,
    /*
      Die Gebühren als Differenz zum kostenfreien Verlauf.

      Nicht als Summe der jährlichen Entnahmen: Die wäre kleiner und damit
      irreführend. Was eine Gebühr wirklich kostet, ist der Betrag selbst
      **plus** alles, was er bis zum Ende noch erwirtschaftet hätte – und genau
      diese Differenz steht hier.
    */
    gebuehren: ohneKosten - bestand,
    nettorendite: netto,
  }
}

export interface Kostenvergleich {
  guenstig: Kostenergebnis
  teuer: Kostenergebnis
  /** Was die teurere Anlage am Ende weniger einbringt. */
  unterschied: number
  /**
   * Der Anteil am Endvermögen der günstigen Anlage, den der Unterschied
   * ausmacht – die Zahl, die den Unterschied begreifbar macht.
   */
  anteil: number
}

/** Zwei Kostenquoten bei sonst gleichen Annahmen gegeneinandergestellt. */
export function vergleiche(
  annahmen: Omit<Kostenannahmen, 'kostenquote'>,
  guenstigeQuote: number,
  teureQuote: number
): Kostenvergleich {
  const guenstig = verlauf({ ...annahmen, kostenquote: guenstigeQuote })
  const teuer = verlauf({ ...annahmen, kostenquote: teureQuote })
  const unterschied = guenstig.endwert - teuer.endwert

  return {
    guenstig,
    teuer,
    unterschied,
    anteil: guenstig.endwert > 0 ? unterschied / guenstig.endwert : 0,
  }
}
