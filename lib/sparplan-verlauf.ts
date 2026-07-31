/**
 * Ein Sparplan am tatsächlichen Kursverlauf – gegen dieselbe Rechnung mit
 * gleichmäßiger Rendite.
 *
 * ## Wofür
 *
 * Weil der Unterschied die halbe Lektion ist. Der Zinsrechner nimmt eine feste
 * Rendite an und liefert eine glatte Kurve; ein echter Kursverlauf tut das nie.
 * Beide Rechnungen nebeneinander beantworten die Frage, die sonst offen bleibt:
 * **Wie viel von „sieben Prozent im Mittel“ kommt tatsächlich an?**
 *
 * Die Antwort ist nicht „weniger“ und auch nicht „mehr“. Sie hängt an der
 * Reihenfolge, und zwar so:
 *
 * - Bei einem Sparplan zahlt eine feste Rate bei niedrigem Kurs mehr Anteile
 *   ein als bei hohem. Fallen die Kurse zuerst und steigen sie später, schlägt
 *   der echte Verlauf die gleichmäßige Annahme.
 * - Steigen die Kurse zuerst und fallen sie später, ist es umgekehrt.
 *
 * Beides ist derselbe Durchschnitt. Wer nur die Durchschnittsrendite kennt,
 * kennt das Ergebnis nicht – und genau das lässt sich mit einer Zahl nicht
 * sagen, mit zwei nebeneinander schon.
 *
 * ## Welche gleichmäßige Rendite verglichen wird
 *
 * Die **tatsächlich erzielte** des Instruments über denselben Zeitraum, also
 * das geometrische Mittel aus Anfangs- und Endkurs. Nicht sieben Prozent, nicht
 * irgendeine Annahme: Nur so vergleicht die Rechnung zwei Wege durch dieselbe
 * Gesamtentwicklung und misst allein die Wirkung der Reihenfolge.
 *
 * Eine geratene Rendite daneben zu stellen würde zwei Dinge auf einmal ändern,
 * und aus dem Ergebnis ließe sich nichts mehr ablesen.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 */

/** Ein Punkt einer Kursreihe. */
export interface Kurspunkt {
  /** Handelstag, `JJJJ-MM-TT`. */
  d: string
  /** Schlusskurs. */
  c: number
}

export interface Verlaufsvergleich {
  /** Höhe einer einzelnen Rate. */
  rate: number
  /** Wie viele Raten geflossen sind – eine je Monat. */
  raten: number
  eingezahlt: number
  /** Erster und letzter tatsächlich verwendeter Handelstag. */
  vonTag: string
  bisTag: string
  /** Was am echten Kursverlauf herausgekommen wäre. */
  echt: number
  /**
   * Was bei gleichmäßiger Rendite herausgekommen wäre – bei **derselben**
   * Gesamtentwicklung, nur ohne Schwankung dazwischen.
   */
  gleichmaessig: number
  /** Die gleichmäßige Jahresrendite, die dafür angesetzt wurde, in Prozent. */
  jahresrenditeProzent: number
  /** `echt` minus `gleichmaessig`. */
  unterschied: number
  /** Der mittlere Einstandskurs über alle Raten. */
  mittlererKurs: number
  /**
   * Der Durchschnitt der Kurse an den Kauftagen.
   *
   * Steht neben `mittlererKurs`, weil der Unterschied zwischen beiden der
   * eigentliche Effekt eines Sparplans ist – und weil er ständig verwechselt
   * wird. Bei schwankenden Kursen liegt der Einstand **unter** dem
   * Durchschnitt, und zwar immer.
   */
  durchschnittskurs: number
}

/** Der letzte Handelstag je Monat ab dem Starttag – ein Kauf je Monat. */
function kauftage(reihe: readonly Kurspunkt[], ab: string): Kurspunkt[] {
  const gekauft: Kurspunkt[] = []
  let letzterMonat = ''
  for (const punkt of reihe) {
    if (punkt.d < ab || punkt.c <= 0) continue
    const monat = punkt.d.slice(0, 7)
    if (monat === letzterMonat) continue
    letzterMonat = monat
    gekauft.push(punkt)
  }
  return gekauft
}

/**
 * Vergleicht beide Wege.
 *
 * `null`, wenn die Reihe zu kurz ist, die Rate nicht positiv oder der Kurs
 * irgendwo nicht positiv – eine Division durch null ergäbe `Infinity`, und das
 * stünde als Endwert auf der Seite, ohne dass jemand sagen könnte, warum.
 */
export function vergleiche(
  reihe: readonly Kurspunkt[],
  rate: number,
  ab?: string
): Verlaufsvergleich | null {
  if (reihe.length < 2 || rate <= 0) return null

  const start = ab ?? reihe[0].d
  const gekauft = kauftage(reihe, start)
  if (gekauft.length < 2) return null

  const ende = reihe[reihe.length - 1]
  if (ende.c <= 0 || gekauft[0].c <= 0) return null

  /*
    Der echte Weg: je Rate so viele Anteile, wie der Kurs an dem Tag hergibt.
  */
  const anteile = gekauft.reduce((summe, punkt) => summe + rate / punkt.c, 0)
  const echt = anteile * ende.c
  const eingezahlt = rate * gekauft.length

  /*
    Der gleichmäßige Weg.

    Gesucht ist der Kursverlauf, der vom selben Anfangs- zum selben Endkurs
    führt, aber ohne Schwankung – also eine feste Rate je Monat. Sie ergibt
    sich aus der Gesamtentwicklung über die tatsächliche Anzahl Monate.
  */
  const monate = gekauft.length - 1
  const gesamtfaktor = ende.c / gekauft[0].c
  const monatsfaktor = gesamtfaktor ** (1 / Math.max(1, monate))

  let gleichmaessigeAnteile = 0
  for (let i = 0; i < gekauft.length; i += 1) {
    const kurs = gekauft[0].c * monatsfaktor ** i
    if (kurs <= 0) return null
    gleichmaessigeAnteile += rate / kurs
  }
  /*
    Der Endkurs des gleichmäßigen Wegs ist derselbe wie der echte – das ist
    die Bedingung, unter der überhaupt verglichen wird.
  */
  const gleichmaessig = gleichmaessigeAnteile * ende.c

  const jahre = tageZwischen(gekauft[0].d, ende.d) / 365.25
  const jahresrenditeProzent = jahre > 0 ? (gesamtfaktor ** (1 / jahre) - 1) * 100 : 0

  return {
    rate,
    raten: gekauft.length,
    eingezahlt,
    vonTag: gekauft[0].d,
    bisTag: ende.d,
    echt,
    gleichmaessig,
    jahresrenditeProzent,
    unterschied: echt - gleichmaessig,
    mittlererKurs: eingezahlt / anteile,
    durchschnittskurs:
      gekauft.reduce((summe, punkt) => summe + punkt.c, 0) / gekauft.length,
  }
}

/** Abstand zweier Kalendertage in Tagen. */
function tageZwischen(von: string, bis: string): number {
  const a = Date.parse(`${von}T00:00:00Z`)
  const b = Date.parse(`${bis}T00:00:00Z`)
  return Math.abs(b - a) / 86_400_000
}

/**
 * Ein Satz, der das Ergebnis einordnet.
 *
 * Bewusst ohne Empfehlung. Dass der echte Verlauf besser abgeschnitten hat,
 * heißt nicht, dass er das wieder tut – es heißt, dass die Kurse in dieser
 * Reihenfolge kamen. Der Satz sagt genau das und nicht mehr.
 */
export function einordnung(vergleich: Verlaufsvergleich, name: string): string {
  const abstand = Math.abs(vergleich.unterschied)
  const anteil = (abstand / vergleich.gleichmaessig) * 100

  if (anteil < 0.5) {
    return `Bei ${name} liegen beide Wege dicht beieinander – die Kurse sind über den Zeitraum vergleichsweise gleichmäßig gelaufen.`
  }
  if (vergleich.unterschied > 0) {
    return `Der tatsächliche Verlauf hat den gleichmäßigen um ${anteil.toFixed(1)} Prozent geschlagen: Bei ${name} kamen die schwachen Phasen früh, und eine feste Rate hat dort mehr Anteile gekauft. Dieselbe Gesamtentwicklung, andere Reihenfolge.`
  }
  return `Der tatsächliche Verlauf liegt ${anteil.toFixed(1)} Prozent unter dem gleichmäßigen: Bei ${name} kamen die starken Phasen früh, und die späteren Raten haben teurer gekauft. Dieselbe Gesamtentwicklung, andere Reihenfolge.`
}
