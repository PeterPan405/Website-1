/**
 * Optionsbewertung nach Black-Scholes und die zugehörigen Sensitivitäten.
 *
 * Importfrei, damit `tests/optionen.test.ts` die Datei über
 * `node --experimental-strip-types` laden kann – dort löst der `@/`-Alias
 * nicht auf.
 *
 * ## Warum überhaupt gerechnet wird
 *
 * Über Optionen lässt sich fast alles behaupten: dass der Zeitwert „gegen
 * Ende schneller“ verfällt, dass Volatilität den Preis „stark“ treibt, dass
 * die meisten Optionen wertlos verfallen. Die ersten beiden Sätze sind
 * nachrechenbar, der dritte ist eine verbreitete Legende. Wer die Zahlen
 * ausrechnet, kann sie auseinanderhalten.
 *
 * ## Was das Modell annimmt – und wo es bricht
 *
 * Black-Scholes unterstellt eine konstante Volatilität, stetige Kurse ohne
 * Sprünge, beliebige Teilbarkeit und keine Transaktionskosten. Keine dieser
 * Annahmen gilt. Das Modell ist trotzdem der Bezugsrahmen des gesamten
 * Marktes, weil es die einzige Größe isoliert, die sich nicht beobachten
 * lässt: die erwartete Schwankung. Genau deshalb wird es hier benutzt und
 * genau deshalb steht die Einschränkung im Lerntext.
 *
 * Gerechnet wird die europäische Variante ohne Dividenden. Für die
 * Größenordnungen, um die es geht, ändert das nichts Wesentliches.
 */

export type Optionsart = 'call' | 'put'

export interface Optionsparameter {
  /** Kurs des Basiswerts. */
  kurs: number
  /** Basispreis (Strike). */
  basispreis: number
  /** Restlaufzeit in Jahren. */
  jahre: number
  /** Erwartete Schwankung pro Jahr in Prozent. */
  volatilitaetProzent: number
  /** Risikofreier Zins pro Jahr in Prozent. */
  zinsProzent: number
}

/**
 * Verteilungsfunktion der Standardnormalverteilung.
 *
 * Über die Fehlerfunktion in der Näherung von Abramowitz und Stegun (7.1.26);
 * ihr Fehler liegt unter 1,5 · 10⁻⁷ und damit weit unter allem, was für
 * Anzeigezwecke zählt. Eine eigene Umsetzung ist nötig, weil die
 * JavaScript-Standardbibliothek keine hat.
 */
export function normalverteilung(x: number): number {
  const vorzeichen = x < 0 ? -1 : 1
  const z = Math.abs(x) / Math.SQRT2

  const t = 1 / (1 + 0.3275911 * z)
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-z * z)

  return 0.5 * (1 + vorzeichen * y)
}

/** Dichte der Standardnormalverteilung – wird für Gamma und Vega gebraucht. */
function dichte(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)
}

interface Hilfsgroessen {
  d1: number
  d2: number
  abgezinsterBasispreis: number
}

function hilfsgroessen(p: Optionsparameter): Hilfsgroessen {
  const sigma = p.volatilitaetProzent / 100
  const r = p.zinsProzent / 100
  const wurzelT = Math.sqrt(p.jahre)

  const d1 =
    (Math.log(p.kurs / p.basispreis) + (r + (sigma * sigma) / 2) * p.jahre) /
    (sigma * wurzelT)

  return {
    d1,
    d2: d1 - sigma * wurzelT,
    abgezinsterBasispreis: p.basispreis * Math.exp(-r * p.jahre),
  }
}

/**
 * Der sofort realisierbare Teil der Prämie.
 *
 * Bei einem Call der Betrag, um den der Kurs über dem Basispreis liegt; bei
 * einem Put umgekehrt. Nie negativ – das Recht muss niemand ausüben, und
 * genau darin besteht es.
 */
export function innererWert(art: Optionsart, kurs: number, basispreis: number): number {
  return art === 'call' ? Math.max(0, kurs - basispreis) : Math.max(0, basispreis - kurs)
}

/**
 * Der Optionspreis nach Black-Scholes.
 *
 * Bei einer Restlaufzeit von null gibt es keinen Zeitwert mehr; dann bleibt
 * der innere Wert. Dieser Sonderfall wird abgefangen, weil die Formel dort
 * durch null teilen würde.
 */
export function preis(art: Optionsart, p: Optionsparameter): number {
  if (p.jahre <= 0 || p.volatilitaetProzent <= 0) {
    return innererWert(art, p.kurs, p.basispreis)
  }

  const { d1, d2, abgezinsterBasispreis } = hilfsgroessen(p)

  return art === 'call'
    ? p.kurs * normalverteilung(d1) - abgezinsterBasispreis * normalverteilung(d2)
    : abgezinsterBasispreis * normalverteilung(-d2) - p.kurs * normalverteilung(-d1)
}

/** Der Teil der Prämie, der nur für die verbleibende Chance bezahlt wird. */
export function zeitwert(art: Optionsart, p: Optionsparameter): number {
  return preis(art, p) - innererWert(art, p.kurs, p.basispreis)
}

export interface Sensitivitaeten {
  /** Preisänderung je 1 Einheit Kursbewegung des Basiswerts. */
  delta: number
  /** Änderung des Delta je 1 Einheit Kursbewegung. */
  gamma: number
  /** Zeitwertverlust pro Kalendertag, als negative Zahl. */
  thetaProTag: number
  /** Preisänderung je Prozentpunkt mehr implizite Volatilität. */
  vegaProProzentpunkt: number
}

/**
 * Die vier gebräuchlichen Sensitivitäten.
 *
 * Theta und Vega werden bewusst in den Einheiten geliefert, in denen über sie
 * gesprochen wird: Theta pro Kalendertag, Vega je Prozentpunkt. Die
 * Rohableitungen beziehen sich auf ein Jahr beziehungsweise auf eine
 * Volatilität von 100 Prozentpunkten – und wer das verwechselt, liegt um den
 * Faktor 365 daneben.
 */
export function sensitivitaeten(art: Optionsart, p: Optionsparameter): Sensitivitaeten {
  if (p.jahre <= 0 || p.volatilitaetProzent <= 0) {
    const imGeld = innererWert(art, p.kurs, p.basispreis) > 0
    return {
      delta: imGeld ? (art === 'call' ? 1 : -1) : 0,
      gamma: 0,
      thetaProTag: 0,
      vegaProProzentpunkt: 0,
    }
  }

  const sigma = p.volatilitaetProzent / 100
  const r = p.zinsProzent / 100
  const { d1, d2, abgezinsterBasispreis } = hilfsgroessen(p)
  const wurzelT = Math.sqrt(p.jahre)

  const thetaProJahr =
    -(p.kurs * dichte(d1) * sigma) / (2 * wurzelT) +
    (art === 'call'
      ? -r * abgezinsterBasispreis * normalverteilung(d2)
      : r * abgezinsterBasispreis * normalverteilung(-d2))

  return {
    delta: art === 'call' ? normalverteilung(d1) : normalverteilung(d1) - 1,
    gamma: dichte(d1) / (p.kurs * sigma * wurzelT),
    thetaProTag: thetaProJahr / 365,
    vegaProProzentpunkt: (p.kurs * dichte(d1) * wurzelT) / 100,
  }
}

/**
 * Der Kurs, ab dem der Käufer beim Verfall in den Gewinn kommt.
 *
 * Die Prämie muss zuerst verdient werden. Bei einem Call also Basispreis plus
 * Prämie, beim Put Basispreis minus Prämie – der Punkt, an dem Anfänger am
 * häufigsten danebenliegen, weil sie den Basispreis selbst für die Schwelle
 * halten.
 */
export function gewinnschwelle(art: Optionsart, p: Optionsparameter): number {
  const praemie = preis(art, p)
  return art === 'call' ? p.basispreis + praemie : p.basispreis - praemie
}
