/**
 * Kreditrechnung: Annuität, Tilgungsverlauf und Restschuld.
 *
 * Importfrei. Ursprünglich, weil der `@/`-Alias außerhalb des Bündlers nicht
 * auflöste – das ist seit `scripts/alias-hook.mjs` erledigt. Geblieben ist es,
 * weil es hier ohnehin nichts zu importieren gibt: reine Rechnung, keine Daten.
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
  /** Zusätzliche Zahlung in diesem Monat, sonst 0. */
  sondertilgung: number
  restschuld: number
}

/**
 * Was die meisten Kreditverträge an Sondertilgung im Jahr erlauben.
 *
 * Fünf Prozent der ursprünglichen Darlehenssumme sind der Marktstandard –
 * mehr ist verhandelbar, kostet aber in aller Regel einen Zinsaufschlag. Die
 * Zahl steht hier, weil der Rechner sie zum Einordnen der Eingabe braucht:
 * Eine Sondertilgung, die kein Vertrag hergibt, rechnet einen Vorteil vor, den
 * es nicht gibt.
 */
export const UEBLICHE_SONDERTILGUNG_PROZENT = 5

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
  maxMonate = 12 * 60,
  sondertilgungProJahr = 0
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

    /*
      Die Sondertilgung am Ende des Jahres, nach der regulären Rate.

      Nicht zu Jahresbeginn: Die meisten Verträge sehen sie zum Jahresende vor,
      und es ist die vorsichtigere Annahme – wer früher zahlt, spart mehr, als
      hier steht. Ein Rechner, der zu viel verspricht, ist an dieser Stelle das
      größere Problem als einer, der ein paar Euro unterschlägt.
    */
    const sondertilgung =
      sondertilgungProJahr > 0 && monat % 12 === 0
        ? Math.min(sondertilgungProJahr, rest)
        : 0
    rest -= sondertilgung

    // Den Rest der letzten Rate zuschlagen, damit die Summe aller Tilgungen
    // exakt die Darlehenssumme ergibt.
    if (rest <= GETILGT) {
      tilgung += rest
      rest = 0
    }

    plan.push({ monat, zins, tilgung, sondertilgung, restschuld: rest })
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
export function auswerten(
  kredit: Kreditparameter,
  rate: number,
  sondertilgungProJahr = 0
): Kreditergebnis {
  const plan = tilgungsplan(kredit, rate, 12 * 60, sondertilgungProJahr)
  const zinsenGesamt = plan.reduce((summe, monat) => summe + monat.zins, 0)

  return {
    rate,
    monate: plan.length,
    zinsenGesamt,
    gesamtkosten: kredit.summe + zinsenGesamt,
  }
}

/** Was eine Sondertilgung bringt – gegen denselben Kredit ohne sie. */
export interface Sondertilgungswirkung {
  /** Zinsen, die durch die Sondertilgung nicht anfallen. */
  zinsersparnis: number
  /** Um wie viele Monate der Kredit früher abbezahlt ist. */
  monateFrueher: number
  /** Was insgesamt zusätzlich eingezahlt wurde. */
  eingezahlt: number
  /**
   * Was jeder zusätzlich gezahlte Euro an Zinsen erspart hat.
   *
   * Die Zahl, die den Vergleich mit einer Anlage erlaubt: Eine Sondertilgung
   * ist eine Geldanlage zum Kreditzins – steuerfrei und ohne Risiko. Ob sie
   * sich lohnt, entscheidet sich am Vergleich mit dem, was dasselbe Geld
   * anderswo nach Steuern gebracht hätte.
   */
  ersparnisJeEuro: number
}

/**
 * Der Vergleich mit und ohne Sondertilgung.
 *
 * Beide Läufe stehen nebeneinander, statt eine Formel für die Ersparnis
 * aufzustellen: Die gibt es in geschlossener Form nicht, sobald die Zahlung
 * jährlich statt monatlich erfolgt – und ein zweiter Durchlauf desselben
 * geprüften Tilgungsplans ist ehrlicher als eine Näherung, die aussieht wie
 * eine Formel.
 */
export function sondertilgungswirkung(
  kredit: Kreditparameter,
  rate: number,
  sondertilgungProJahr: number
): Sondertilgungswirkung {
  const ohne = auswerten(kredit, rate)
  const mit = auswerten(kredit, rate, sondertilgungProJahr)

  const plan = tilgungsplan(kredit, rate, 12 * 60, sondertilgungProJahr)
  const eingezahlt = plan.reduce((summe, monat) => summe + monat.sondertilgung, 0)
  const zinsersparnis = ohne.zinsenGesamt - mit.zinsenGesamt

  return {
    zinsersparnis,
    monateFrueher: ohne.monate - mit.monate,
    eingezahlt,
    ersparnisJeEuro: eingezahlt > 0 ? zinsersparnis / eingezahlt : 0,
  }
}

/** Was der Anschluss nach der Zinsbindung kostet. */
export interface Anschlussvergleich {
  restschuld: number
  /** Verbleibende Monate, wenn der ursprüngliche Plan weiterliefe. */
  restlaufzeitMonate: number
  /** Die Rate, die dafür beim alten Zins nötig wäre – in aller Regel die bisherige. */
  rateAlt: number
  /** Die Rate beim neuen Zins, bei gleicher Restlaufzeit. */
  rateNeu: number
  mehrProMonat: number
  /** Was der Zinsunterschied über die Restlaufzeit insgesamt kostet. */
  mehrGesamt: number
}

/**
 * Was ein höherer Zins beim Anschluss kostet.
 *
 * Die Frage, die bei einer Zinsbindung von zehn Jahren wirklich zählt und die
 * kein Angebot beantwortet: Nach der Bindung wird die Restschuld zu **dann**
 * geltenden Konditionen weiterfinanziert, und die kennt heute niemand.
 *
 * Verglichen wird bei **gleicher Restlaufzeit**, nicht bei gleicher Rate. Wer
 * die Rate gleich lässt, verschiebt die Mehrkosten nur ans Ende der Laufzeit
 * und sieht sie nicht – die Verlängerung ist dann der eigentliche Preis, und
 * sie fällt in keiner Monatsrate auf.
 */
export function anschlussvergleich(
  restschuld: number,
  zinsAltProzent: number,
  zinsNeuProzent: number,
  restlaufzeitMonate: number
): Anschlussvergleich {
  const jahre = restlaufzeitMonate / 12
  const rateAlt = rateBeiLaufzeit(
    { summe: restschuld, zinsProzent: zinsAltProzent },
    jahre
  )
  const rateNeu = rateBeiLaufzeit(
    { summe: restschuld, zinsProzent: zinsNeuProzent },
    jahre
  )

  return {
    restschuld,
    restlaufzeitMonate,
    rateAlt,
    rateNeu,
    mehrProMonat: rateNeu - rateAlt,
    mehrGesamt: (rateNeu - rateAlt) * restlaufzeitMonate,
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
  jahre: number,
  sondertilgungProJahr = 0
): number {
  const plan = tilgungsplan(kredit, rate, 12 * 60, sondertilgungProJahr)
  const monat = Math.round(jahre * 12)
  if (plan.length === 0) return kredit.summe
  if (monat >= plan.length) return 0
  return plan[monat - 1].restschuld
}
