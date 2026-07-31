/**
 * Was eine Zusammenstellung von Positionen über sich verrät.
 *
 * ## Was das hier ist – und was nicht
 *
 * Eine **Beschreibung**, keine Bewertung. Gerechnet wird ausschließlich, was
 * sich aus Gewichten und den hinterlegten Stammdaten ergibt: wie sich das Geld
 * auf Branchen, Länder, Währungen und Anlagearten verteilt, wie groß der
 * größte Klumpen ist, was an laufenden Kosten anfällt.
 *
 * Kein Risikomaß, keine Prognose, keine Note. `lib/streuung.ts` sagt dazu für
 * die Merkliste einen Satz, der hier genauso gilt: Das ist weniger, als ein
 * Anbieter mit Depotanbindung könnte, und mehr, als eine Zahl ohne Grundlage
 * wert wäre.
 *
 * ## Warum Gewichte und nicht Stückzahlen
 *
 * Weil die Frage, um die es geht, eine Frage nach Anteilen ist. Ob jemand 300
 * oder 30.000 Euro angelegt hat, ändert nichts daran, ob die Hälfte davon in
 * einer Branche steckt. Stückzahlen abzufragen hieße, nach dem Vermögen zu
 * fragen, um es dann wegzukürzen.
 *
 * Eingegeben werden trotzdem Beträge und nicht Prozente – Beträge kennt man,
 * Prozente muss man ausrechnen. Die Umrechnung macht das Modul.
 *
 * ## Der Herfindahl-Index
 *
 * Für die Konzentration wird die Summe der quadrierten Anteile genommen. Sie
 * ist 1 bei einer einzigen Position und 1/n bei n gleich großen. Quadriert
 * wird, damit große Anteile stärker zählen als viele kleine – genau das ist
 * die Eigenschaft, um die es bei Klumpenrisiko geht. Zehn Positionen, von
 * denen eine 60 Prozent ausmacht, sind nicht „zehn Positionen“.
 *
 * Der Kehrwert ist die anschaulichere Zahl und wird deshalb mit ausgegeben:
 * Er sagt, wie vielen **gleich großen** Positionen die Verteilung entspricht.
 * Bei einer 60-Prozent-Position und neun kleinen sind das keine zehn, sondern
 * etwa zweieinhalb.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 */

/** Ein Instrument, so weit die Analyse es braucht. */
export interface DepotStammdaten {
  symbol: string
  name: string
  /** `stock`, `etf`, `index`, `fx`, `commodity`, `crypto` … */
  kind: string
  /** Währung oder `Punkte`. */
  unit: string
  branche?: string
  /** Sitzland als ISO-3166-Zahl. */
  sitzland?: string
  /** Laufende Kosten in Prozent pro Jahr, sofern bekannt. */
  kostenquote?: number
  /** Dividendenrendite in Prozent, sofern bekannt. */
  dividendenrendite?: number
}

/** Eine Position, wie sie eingegeben wird. */
export interface Position {
  symbol: string
  /** Angelegter Betrag in Euro. Negatives und Null zählen nicht. */
  betrag: number
}

/** Ein Anteil an einer Gesamtheit. */
export interface Anteil {
  /** Der Name der Gruppe, oder `null` für „nicht zugeordnet“. */
  gruppe: string | null
  betrag: number
  /** Anteil zwischen 0 und 1. */
  anteil: number
  /** Wie viele Positionen in dieser Gruppe stecken. */
  posten: number
}

export interface Konzentration {
  /** Summe der quadrierten Anteile, zwischen 0 und 1. */
  herfindahl: number
  /**
   * Wie vielen gleich großen Positionen die Verteilung entspricht.
   *
   * Der Kehrwert des Herfindahl-Index. Bei einer leeren Aufstellung 0.
   */
  wirksameAnzahl: number
  /** Der Anteil der größten Einzelposition. */
  groessterPosten: number
  /** Der Anteil der drei größten zusammen. */
  dreiGroessten: number
}

export interface Depotanalyse {
  /** Summe aller gültigen Beträge. */
  summe: number
  /** Wie viele Positionen tatsächlich gezählt wurden. */
  anzahl: number
  positionen: (Position & { anteil: number; stammdaten: DepotStammdaten | null })[]
  nachArt: Anteil[]
  nachBranche: Anteil[]
  nachLand: Anteil[]
  nachWaehrung: Anteil[]
  konzentration: Konzentration
  /**
   * Gewichtete laufende Kosten in Prozent pro Jahr.
   *
   * `null`, wenn zu keiner Position eine Kostenquote hinterlegt ist. Sonst
   * über den Teil gerechnet, für den eine bekannt ist – mit `kostenAbdeckung`
   * daneben, damit sichtbar bleibt, worauf sich die Zahl bezieht. Eine
   * Kostenquote über das ganze Depot zu behaupten, wenn nur die Hälfte
   * hinterlegt ist, wäre eine zu gute Zahl.
   */
  kostenquote: number | null
  /** Welcher Anteil des Depots in die Kostenrechnung eingegangen ist. */
  kostenAbdeckung: number
  /** Gewichtete Dividendenrendite, nach derselben Regel. */
  dividendenrendite: number | null
  dividendenAbdeckung: number
}

/** Gruppiert Beträge und rechnet Anteile aus, absteigend sortiert. */
function gruppiere(
  eintraege: { gruppe: string | null; betrag: number }[],
  summe: number
): Anteil[] {
  const nach = new Map<string | null, { betrag: number; posten: number }>()
  for (const { gruppe, betrag } of eintraege) {
    const bisher = nach.get(gruppe) ?? { betrag: 0, posten: 0 }
    nach.set(gruppe, { betrag: bisher.betrag + betrag, posten: bisher.posten + 1 })
  }
  return [...nach.entries()]
    .map(([gruppe, { betrag, posten }]) => ({
      gruppe,
      betrag,
      anteil: summe > 0 ? betrag / summe : 0,
      posten,
    }))
    .sort((a, b) => {
      /*
        „Nicht zugeordnet“ steht immer unten, egal wie groß es ist. Es ist
        keine Gruppe, sondern eine Lücke im Datenbestand – oben zwischen den
        echten Gruppen sähe es aus wie eine Aussage über das Depot.
      */
      if (a.gruppe === null) return 1
      if (b.gruppe === null) return -1
      /*
        Bei gleichem Betrag alphabetisch, nicht nach Eingabereihenfolge.

        Zwei Gruppen mit je 2.000 Euro standen sonst mal so, mal so – je
        nachdem, welche Position zuerst getippt wurde. Dieselbe Aufstellung
        sähe nach dem Neuladen anders aus, und wer zweimal hinschaut, würde
        einen Unterschied vermuten, wo keiner ist.
      */
      return b.betrag - a.betrag || a.gruppe.localeCompare(b.gruppe, 'de')
    })
}

/** Deutsche Namen der Anlagearten. Unbekanntes bleibt, wie es ist. */
const ARTEN: Record<string, string> = {
  stock: 'Aktien',
  etf: 'ETFs',
  index: 'Indizes',
  fx: 'Währungen',
  commodity: 'Rohstoffe',
  crypto: 'Kryptowerte',
  bond: 'Anleihen',
}

/**
 * Rechnet eine Aufstellung durch.
 *
 * `stammdaten` bildet Symbole auf ihre Stammdaten ab. Fehlt ein Symbol, zählt
 * die Position trotzdem in Summe und Gewichtung – sie ist ja da –, taucht in
 * den Aufschlüsselungen aber unter „nicht zugeordnet“ auf. Sie stillschweigend
 * zu übergehen würde alle Anteile zu groß machen.
 */
export function analysiere(
  positionen: Position[],
  stammdaten: Map<string, DepotStammdaten>
): Depotanalyse {
  const gueltig = positionen.filter(
    (p) => Number.isFinite(p.betrag) && p.betrag > 0 && p.symbol.trim() !== ''
  )
  const summe = gueltig.reduce((s, p) => s + p.betrag, 0)

  const mitDaten = gueltig.map((p) => ({
    ...p,
    anteil: summe > 0 ? p.betrag / summe : 0,
    stammdaten: stammdaten.get(p.symbol) ?? null,
  }))

  const anteile = mitDaten.map((p) => p.anteil).sort((a, b) => b - a)
  const herfindahl = anteile.reduce((s, a) => s + a * a, 0)

  /** Gewichteter Mittelwert über den Teil, für den ein Wert bekannt ist. */
  function gewichtet(hole: (s: DepotStammdaten) => number | undefined): {
    wert: number | null
    abdeckung: number
  } {
    let gewicht = 0
    let produkt = 0
    for (const p of mitDaten) {
      const wert = p.stammdaten ? hole(p.stammdaten) : undefined
      if (wert === undefined || !Number.isFinite(wert)) continue
      gewicht += p.anteil
      produkt += p.anteil * wert
    }
    return gewicht > 0
      ? { wert: produkt / gewicht, abdeckung: gewicht }
      : { wert: null, abdeckung: 0 }
  }

  const kosten = gewichtet((s) => s.kostenquote)
  const dividende = gewichtet((s) => s.dividendenrendite)

  return {
    summe,
    anzahl: mitDaten.length,
    positionen: [...mitDaten].sort((a, b) => b.betrag - a.betrag),
    nachArt: gruppiere(
      mitDaten.map((p) => ({
        gruppe: p.stammdaten ? (ARTEN[p.stammdaten.kind] ?? p.stammdaten.kind) : null,
        betrag: p.betrag,
      })),
      summe
    ),
    nachBranche: gruppiere(
      mitDaten.map((p) => ({ gruppe: p.stammdaten?.branche ?? null, betrag: p.betrag })),
      summe
    ),
    nachLand: gruppiere(
      mitDaten.map((p) => ({ gruppe: p.stammdaten?.sitzland ?? null, betrag: p.betrag })),
      summe
    ),
    nachWaehrung: gruppiere(
      mitDaten.map((p) => ({
        /*
          `Punkte` ist keine Währung. Ein Index wird in Punkten notiert, und
          wer ihn hält, hält in Wahrheit einen Fonds darauf – die Währung
          steht dann an diesem Fonds. Als „Punkte“ in der Währungsaufteilung
          zu erscheinen wäre eine Kategorie, die niemand meint.
        */
        gruppe: p.stammdaten && p.stammdaten.unit !== 'Punkte' ? p.stammdaten.unit : null,
        betrag: p.betrag,
      })),
      summe
    ),
    konzentration: {
      herfindahl,
      wirksameAnzahl: herfindahl > 0 ? 1 / herfindahl : 0,
      groessterPosten: anteile[0] ?? 0,
      dreiGroessten: anteile.slice(0, 3).reduce((s, a) => s + a, 0),
    },
    kostenquote: kosten.wert,
    kostenAbdeckung: kosten.abdeckung,
    dividendenrendite: dividende.wert,
    dividendenAbdeckung: dividende.abdeckung,
  }
}

/** Ein Befund über die Verteilung – beschreibend, nicht wertend. */
export interface Beobachtung {
  /** `hinweis` färbt auffällig, `notiz` bleibt ruhig. */
  art: 'hinweis' | 'notiz'
  text: string
}

/**
 * Was an der Verteilung auffällt.
 *
 * Bewusst als Beobachtung formuliert und nie als Rat. „Die größte Position
 * macht 47 Prozent aus“ ist eine Tatsache; „das ist zu viel“ wäre
 * Anlageberatung, und die findet auf dieser Website nicht statt. Die Schwellen
 * sind Anlässe zum Hinsehen, keine Grenzwerte.
 */
export function beobachtungen(analyse: Depotanalyse): Beobachtung[] {
  const funde: Beobachtung[] = []
  if (analyse.anzahl === 0) return funde
  const prozent = (a: number) => `${Math.round(a * 100)} Prozent`

  if (analyse.konzentration.groessterPosten > 0.3) {
    const groesste = analyse.positionen[0]
    funde.push({
      art: 'hinweis',
      text:
        `Die größte Position – ${groesste.stammdaten?.name ?? groesste.symbol} – trägt ` +
        `${prozent(analyse.konzentration.groessterPosten)} der Summe. Was mit ihr geschieht, ` +
        'geschieht damit anteilig mit dem Ganzen.',
    })
  }

  if (
    analyse.anzahl >= 4 &&
    analyse.konzentration.wirksameAnzahl < analyse.anzahl * 0.6
  ) {
    funde.push({
      art: 'notiz',
      text:
        `${analyse.anzahl} Positionen, die sich aber verteilen wie ` +
        `${analyse.konzentration.wirksameAnzahl.toFixed(1)} gleich große. Die Anzahl der ` +
        'Zeilen sagt weniger über die Streuung als ihre Größen.',
    })
  }

  const grossteBranche = analyse.nachBranche.find((b) => b.gruppe !== null)
  if (grossteBranche && grossteBranche.anteil > 0.4) {
    funde.push({
      art: 'hinweis',
      text:
        `${prozent(grossteBranche.anteil)} entfallen auf die Branche ${grossteBranche.gruppe}. ` +
        'Titel derselben Branche hängen an derselben Nachfrage und derselben Lieferkette – ' +
        'an schlechten Tagen fallen sie gemeinsam.',
    })
  }

  const grossteWaehrung = analyse.nachWaehrung.find((w) => w.gruppe !== null)
  if (
    grossteWaehrung &&
    grossteWaehrung.gruppe !== 'EUR' &&
    grossteWaehrung.anteil > 0.5
  ) {
    funde.push({
      art: 'notiz',
      text:
        `${prozent(grossteWaehrung.anteil)} notieren in ${grossteWaehrung.gruppe}. Der Wert in ` +
        'Euro hat damit zwei Ursachen: den Kurs des Papiers und den Wechselkurs. Beide können ' +
        'in dieselbe Richtung zeigen – oder gegeneinander.',
    })
  }

  const ohneZuordnung = analyse.nachBranche.find((b) => b.gruppe === null)
  if (ohneZuordnung && ohneZuordnung.anteil > 0.2) {
    funde.push({
      art: 'notiz',
      text:
        `Zu ${prozent(ohneZuordnung.anteil)} der Summe ist keine Branche hinterlegt – meist ` +
        'ETFs und Rohstoffe, die keine einzelne haben. Die Branchenaufteilung beschreibt ' +
        'entsprechend nur den Rest.',
    })
  }

  return funde
}
