/**
 * Kreditrechnung: Annuität, Tilgungsverlauf und Restschuld.
 *
 * Importfrei, damit `tests/kredit.test.ts` die Datei über
 * `node --experimental-strip-types` laden kann – dort löst der `@/`-Alias
 * nicht auf.
 *
 * ## Warum das gerechnet gehört
 *
 * Über Kredite kursieren zwei Sätze, die beide stimmen und die zusammen
 * niemand glaubt: „Eine niedrigere Rate ist bequemer“ und „eine niedrigere
 * Rate ist teurer“. Wie viel teurer, entscheidet über die Frage, ob ein
 * Angebot gut ist – und diese Zahl steht in keinem Werbetext. Sie ergibt
 * sich erst aus dem Tilgungsverlauf.
 *
 * ## Konventionen
 *
 * Gerechnet wird das in Deutschland übliche **Annuitätendarlehen** mit
 * monatlicher Zahlung: gleichbleibende Rate, wechselnde Zusammensetzung aus
 * Zins und Tilgung. Der angegebene Zins wird als nomineller Jahreszins
 * behandelt und durch zwölf geteilt – dieselbe Konvention wie im Zinsrechner
 * der Website.
 *
 * Der **anfängliche Tilgungssatz** ist die in Deutschland gebräuchliche
 * Angabe: der Tilgungsanteil des ersten Jahres, bezogen auf die
 * Darlehenssumme. Aus ihm und dem Zinssatz ergibt sich die Rate – nicht
 * umgekehrt.
 */

export interface Kreditparameter {
  /** Darlehenssumme. */
  summe: number
  /** Nomineller Jahreszins in Prozent. */
  zinsProzent: number
}

/** Eine Zeile des Tilgungsplans, jeweils für einen Monat. */
export interface Tilgungsmonat {
  monat: number
  zins: number
  tilgung: number
  restschuld: number
}

/**
 * Die monatliche Rate eines Annuitätendarlehens bei fester Laufzeit.
 *
 * Bei einem Zins von null ist es die schlichte Division – die
 * Annuitätenformel würde dort durch null teilen.
 */
export function rateBeiLaufzeit(kredit: Kreditparameter, jahre: number): number {
  const monate = Math.round(jahre * 12)
  if (monate <= 0) return 0

  const i = kredit.zinsProzent / 100 / 12
  if (i === 0) return kredit.summe / monate

  return (kredit.summe * i) / (1 - (1 + i) ** -monate)
}

/**
 * Die monatliche Rate aus dem anfänglichen Tilgungssatz.
 *
 * Zins plus Tilgung des ersten Jahres, durch zwölf. So werden
 * Immobilienkredite in Deutschland angeboten: „3,5 Prozent Zins, 2 Prozent
 * Anfangstilgung“ ergibt eine Rate von 5,5 Prozent der Summe pro Jahr.
 */
export function rateBeiTilgungssatz(
  kredit: Kreditparameter,
  tilgungssatzProzent: number
): number {
  return (kredit.summe * (kredit.zinsProzent + tilgungssatzProzent)) / 100 / 12
}

/**
 * Der Tilgungsverlauf bei gegebener Rate.
 *
 * Bricht ab, sobald der Kredit getilgt ist – die letzte Rate ist dann
 * kleiner. Bricht ebenfalls ab, wenn die Rate den Zins nicht deckt: Dann
 * wächst die Schuld, und ein Plan über tausend Jahre hilft niemandem. Genau
 * dieser Fall ist der stille Grund, warum ein überzogenes Konto nie kleiner
 * wird.
 */
export function tilgungsplan(
  kredit: Kreditparameter,
  rate: number,
  maxMonate = 12 * 60
): Tilgungsmonat[] {
  const i = kredit.zinsProzent / 100 / 12
  const plan: Tilgungsmonat[] = []
  let rest = kredit.summe

  /*
    Ein halber Cent gilt als getilgt.

    Ohne diese Schwelle bleibt nach der letzten regulären Rate ein
    Gleitkommarest von der Größenordnung 10⁻¹¹ stehen, und die Schleife
    hängt einen zusätzlichen Monat mit Nulltilgung an. Der Tilgungsplan
    eines Zwanzigjahresdarlehens hätte dann 241 Zeilen – falsch, und zwar
    genau an der Stelle, die niemand nachzählt.
  */
  const GETILGT = 0.005

  for (let monat = 1; monat <= maxMonate && rest > GETILGT; monat++) {
    const zins = rest * i
    if (rate <= zins) break

    let tilgung = Math.min(rate - zins, rest)
    rest -= tilgung

    // Den Rest der letzten Rate zuschlagen, damit die Summe aller Tilgungen
    // exakt die Darlehenssumme ergibt.
    if (rest <= GETILGT) {
      tilgung += rest
      rest = 0
    }

    plan.push({ monat, zins, tilgung, restschuld: rest })
  }

  return plan
}

export interface Kreditergebnis {
  rate: number
  /** Laufzeit in Monaten bis zur vollständigen Tilgung. */
  monate: number
  /** Summe aller Zinszahlungen über die gesamte Laufzeit. */
  zinsenGesamt: number
  /** Summe aus Darlehen und Zinsen. */
  gesamtkosten: number
}

/** Laufzeit und Gesamtkosten bei gegebener Rate. */
export function auswerten(kredit: Kreditparameter, rate: number): Kreditergebnis {
  const plan = tilgungsplan(kredit, rate)
  const zinsenGesamt = plan.reduce((summe, monat) => summe + monat.zins, 0)

  return {
    rate,
    monate: plan.length,
    zinsenGesamt,
    gesamtkosten: kredit.summe + zinsenGesamt,
  }
}

/**
 * Die verbleibende Schuld nach einer bestimmten Zahl von Jahren.
 *
 * Der wichtigste Wert bei Immobilienkrediten: Nach dem Ende der Zinsbindung
 * muss dieser Betrag zu dann geltenden Konditionen weiterfinanziert werden.
 * Wer nur auf die Rate schaut, sieht ihn nie.
 */
export function restschuldNach(
  kredit: Kreditparameter,
  rate: number,
  jahre: number
): number {
  const plan = tilgungsplan(kredit, rate)
  const monat = Math.round(jahre * 12)
  if (plan.length === 0) return kredit.summe
  if (monat >= plan.length) return 0
  return plan[monat - 1].restschuld
}
