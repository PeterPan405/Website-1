/**
 * Schätzung fehlender Länderkennzahlen aus der Wirtschaftsleistung.
 *
 * ## Warum überhaupt geschätzt wird
 *
 * Die OECD veröffentlicht Durchschnittslöhne nur für ihre Mitglieder – 38 von
 * 249 Ländern. Das ist keine Lücke, die ein weiterer Abruf schließen könnte:
 * Für die übrigen erhebt schlicht niemand diese Zahl in vergleichbarer Form.
 * Ohne Schätzung stünde auf über 160 Ländertafeln „keine Angabe hinterlegt“,
 * obwohl sich aus der Wirtschaftsleistung sehr wohl eine Größenordnung ableiten
 * lässt.
 *
 * ## Wie geschätzt wird
 *
 * Über eine Regression im doppelt logarithmischen Raum: `log(Lohn)` gegen
 * `log(Wirtschaftsleistung je Kopf)`.
 *
 * **Beide Größen sind kaufkraftbereinigt, und daran hängt alles.** Der erste
 * Versuch nahm das Bruttonationaleinkommen nach der Atlas-Methode – eine
 * nominale Größe – und stellte es einem kaufkraftbereinigten Lohn gegenüber. Das
 * vermischt zwei Dinge: das Verhältnis von Lohn zu Wirtschaftsleistung und den
 * Preisniveauunterschied zwischen arm und reich. Der Exponent fiel dadurch auf
 * 0,48, und für Burundi kam ein Lohn vom Zwanzigfachen der Wirtschaftsleistung
 * je Kopf heraus. Mit derselben Bereinigung auf beiden Seiten liegt das
 * Verhältnis über alle 38 Länder zwischen 0,45 und 1,33.
 *
 * Angepasst wird bei jedem Bauen neu, an denselben gemessenen Werten, die auch
 * angezeigt werden. Es gibt keine gespeicherten Koeffizienten – eine Zahl, die
 * jemand beim nächsten Datenstand mitpflegen müsste, wäre irgendwann falsch.
 *
 * ## Was die Schätzung nicht ist
 *
 * Kein Messwert. Jeder geschätzte Wert trägt eine eigene Quellenangabe und ist
 * auf der Ländertafel als Schätzung ausgewiesen. Wo ein gemessener Wert
 * vorliegt, gewinnt er immer – geschätzt wird ausschließlich in die Lücke.
 *
 * ## Wo die Grenze liegt
 *
 * Beim Medianvermögen ist dieselbe Rechnung **nicht** angewandt, und das ist
 * eine bewusste Entscheidung. Die 30 Länder mit gemessenem Vermögen liegen alle
 * zwischen 23.850 und 97.310 Dollar Einkommen je Kopf; von den 172 ohne Wert
 * liegen 140 darunter, viele um den Faktor hundert. Ein Modell, das nur in
 * einem schmalen Reichtumsband angepasst wurde, sagt über ein Land mit 240
 * Dollar Einkommen nichts aus – es würde eine Zahl ausgeben, aber keine, die
 * etwas bedeutet. Hinzu kommt, dass Vermögen an Wohneigentumsquote,
 * Rentensystem und Verschuldung hängt und nicht am Einkommen: Dänemark liegt in
 * dieser Rechnung um 261 Prozent daneben, Luxemburg um 65 in die andere
 * Richtung.
 *
 * Import-frei wie `lib/stimmungsindex.ts` und `lib/market-quote.ts`, damit
 * `tests/` das Modul direkt laden kann.
 */

/** Ein beobachtetes Paar: bekannter Eingangswert, bekannter Zielwert. */
export interface Beobachtung {
  /** Der Wert, aus dem geschätzt wird – hier die Kaufkraft je Kopf. */
  x: number
  /** Der Wert, der geschätzt werden soll – hier der Durchschnittslohn. */
  y: number
}

/** Das angepasste Modell samt Gütemaßen. */
export interface Modell {
  /** Achsenabschnitt im logarithmischen Raum. */
  a: number
  /** Steigung – der Exponent im linearen Raum. */
  b: number
  /** Bestimmtheitsmaß, 0 bis 1. */
  bestimmtheit: number
  /** Zahl der Beobachtungen, aus denen es entstanden ist. */
  beobachtungen: number
  /** Kleinster und größter Eingangswert der Anpassung. */
  spanne: { von: number; bis: number }
}

/**
 * Passt `y = e^a · x^b` an, gerechnet als Gerade über den Logarithmen.
 *
 * `null` bei weniger als zehn brauchbaren Paaren. Eine Regression über fünf
 * Punkte ergibt immer eine Gerade – nur keine, die etwas über den sechsten
 * aussagt.
 */
export function passeAn(beobachtungen: readonly Beobachtung[]): Modell | null {
  const gueltig = beobachtungen.filter(
    (p) => Number.isFinite(p.x) && Number.isFinite(p.y) && p.x > 0 && p.y > 0
  )
  if (gueltig.length < 10) return null

  const xs = gueltig.map((p) => Math.log(p.x))
  const ys = gueltig.map((p) => Math.log(p.y))
  const n = xs.length
  const mx = xs.reduce((s, x) => s + x, 0) / n
  const my = ys.reduce((s, y) => s + y, 0) / n

  /*
    Ohne Streuung im Eingang gibt es keine Steigung, die etwas bedeutet.

    Geprüft wird die Spanne und nicht der Nenner der Steigung. Bei zwölf
    identischen Eingangswerten ist dieser Nenner rechnerisch null, tatsächlich
    aber eine Zahl der Größenordnung 10⁻³⁰: Der Mittelwert von zwölfmal
    demselben Logarithmus trifft ihn nicht auf das letzte Bit. Eine Abfrage auf
    exakte Null geht daran vorbei, und die Steigung wird zu einer Division
    winziger Zahlen – das Ergebnis ist beliebig.
  */
  const spanneLog = Math.max(...xs) - Math.min(...xs)
  if (spanneLog < 1e-9) return null

  const nenner = xs.reduce((s, x) => s + (x - mx) ** 2, 0)
  if (nenner === 0) return null
  const b = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0) / nenner
  const a = my - b * mx

  const gesamt = ys.reduce((s, y) => s + (y - my) ** 2, 0)
  const rest = ys.reduce((s, y, i) => s + (y - (a + b * xs[i])) ** 2, 0)

  const eingaenge = gueltig.map((p) => p.x)
  return {
    a,
    b,
    bestimmtheit: gesamt === 0 ? 0 : 1 - rest / gesamt,
    beobachtungen: n,
    spanne: { von: Math.min(...eingaenge), bis: Math.max(...eingaenge) },
  }
}

/** Wendet das Modell an. `null` bei unbrauchbarem Eingangswert. */
export function schaetze(modell: Modell, x: number): number | null {
  if (!Number.isFinite(x) || x <= 0) return null
  const wert = Math.exp(modell.a + modell.b * Math.log(x))
  return Number.isFinite(wert) && wert > 0 ? wert : null
}

/**
 * Der typische Fehler, gemessen durch Weglassen.
 *
 * Jede Beobachtung wird einmal aus der Anpassung genommen und anschließend aus
 * den übrigen geschätzt. Der Median dieser Abweichungen sagt, wie weit die
 * Schätzung bei einem Land danebenliegt, das das Modell nicht kennt – die
 * einzige Zahl, die man einer Schätzung ehrlich beilegen kann.
 *
 * An der Anpassung selbst gemessen wäre der Fehler kleiner und wertlos: Dort
 * kennt das Modell die Antwort bereits.
 */
export function typischerFehlerProzent(
  beobachtungen: readonly Beobachtung[]
): number | null {
  const gueltig = beobachtungen.filter(
    (p) => Number.isFinite(p.x) && Number.isFinite(p.y) && p.x > 0 && p.y > 0
  )
  if (gueltig.length < 11) return null

  const abweichungen: number[] = []
  for (let i = 0; i < gueltig.length; i += 1) {
    const ohne = [...gueltig.slice(0, i), ...gueltig.slice(i + 1)]
    const modell = passeAn(ohne)
    if (!modell) continue
    const geschaetzt = schaetze(modell, gueltig[i].x)
    if (geschaetzt === null) continue
    abweichungen.push((Math.abs(geschaetzt - gueltig[i].y) / gueltig[i].y) * 100)
  }
  if (abweichungen.length === 0) return null

  abweichungen.sort((p, q) => p - q)
  const mitte = Math.floor(abweichungen.length / 2)
  return abweichungen.length % 2 === 0
    ? (abweichungen[mitte - 1] + abweichungen[mitte]) / 2
    : abweichungen[mitte]
}
