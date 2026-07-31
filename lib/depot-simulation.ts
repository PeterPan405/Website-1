/**
 * Was aus einer Zusammenstellung historisch geworden wäre.
 *
 * ## Wofür
 *
 * Weil eine Aufteilung nach Branchen und Ländern zeigt, **wie** ein Depot
 * gebaut ist, aber nicht, wie es sich angefühlt hätte. Zwei Depots mit
 * derselben Streuung können durch völlig verschiedene Jahre gegangen sein –
 * und was jemand tatsächlich durchhält, entscheidet sich nicht an der
 * Endrendite, sondern am größten Rückschlag unterwegs.
 *
 * Der Endwert steht deshalb hier nie allein. Neben ihm steht, wie tief es
 * zwischendurch ging und wie lange es dauerte, bis der alte Stand wieder
 * erreicht war. Das ist die Zahl, an der Anlagepläne scheitern.
 *
 * ## Kaufen und liegen lassen, ohne Umschichten
 *
 * Die Anteile werden am ersten gemeinsamen Tag gekauft und danach nicht mehr
 * angefasst. Das heißt: Die Gewichte verschieben sich über die Jahre – wer mit
 * zwanzig Prozent in einem Titel startet, der sich vervierfacht, hält am Ende
 * mehr davon.
 *
 * Regelmäßiges Umschichten wäre die Alternative und wäre eine **Annahme**:
 * über den Rhythmus, über Kosten, über Steuern auf jeden Verkauf. Ohne
 * Umschichten ist die Rechnung das, was sie zu sein vorgibt – ein Kauf und
 * fünf Jahre nichts tun.
 *
 * ## Warum der gemeinsame Zeitraum kürzer sein kann
 *
 * Gerechnet wird nur über Tage, an denen **alle** Positionen einen Kurs haben.
 * Ein Titel, der erst seit zwei Jahren notiert, kürzt die ganze Rechnung auf
 * zwei Jahre – sonst stünde im Ergebnis eine Fünfjahresrendite, in der ein
 * Titel drei Jahre lang gefehlt hat.
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

export interface Position {
  symbol: string
  /** Anteil am Depot in Prozent. Die Summe muss nicht 100 ergeben. */
  anteil: number
}

export interface Rueckschlag {
  /** Tag des Höchststands, von dem aus es abwärts ging. */
  vonTag: string
  /** Tag des Tiefpunkts. */
  bisTag: string
  /** Der Rückgang in Prozent, als negative Zahl. */
  prozent: number
  /**
   * Tag, an dem der alte Höchststand wieder erreicht war – `null`, wenn das
   * bis zum Ende der Reihe nicht mehr geschah.
   *
   * Die zweite Zahl ist die unangenehmere: Ein Rückschlag von dreißig Prozent
   * ist auszuhalten, wenn er nach acht Monaten aufgeholt ist, und etwas ganz
   * anderes, wenn er nach vier Jahren noch steht.
   */
  erholtAm: string | null
}

export interface Simulation {
  /** Der Wert des Depots je Handelstag. */
  verlauf: { d: string; wert: number }[]
  einsatz: number
  endwert: number
  vonTag: string
  bisTag: string
  gesamtProzent: number
  /** Mittlere jährliche Veränderung – `null` bei unter einem Jahr. */
  jahresProzent: number | null
  groesster: Rueckschlag | null
  /** Wie stark die einzelnen Positionen tatsächlich gewichtet waren, am Anfang. */
  startgewichte: { symbol: string; prozent: number }[]
  /** Und am Ende, nach der Verschiebung durch die Kursentwicklung. */
  endgewichte: { symbol: string; prozent: number }[]
}

/** Die Tage, an denen jede Reihe einen Kurs hat. */
function gemeinsameTage(reihen: ReadonlyMap<string, readonly Kurspunkt[]>): string[] {
  const listen = [...reihen.values()]
  if (listen.length === 0) return []

  let treffer = new Set(listen[0].filter((p) => p.c > 0).map((p) => p.d))
  for (const liste of listen.slice(1)) {
    const naechste = new Set(liste.filter((p) => p.c > 0).map((p) => p.d))
    treffer = new Set([...treffer].filter((tag) => naechste.has(tag)))
  }
  return [...treffer].sort()
}

/**
 * Der größte Rückschlag einer Wertreihe.
 *
 * Gemessen vom jeweils höchsten bis dahin erreichten Stand – nicht vom Anfang
 * und nicht vom Höchststand der ganzen Reihe. Nur so entspricht die Zahl dem,
 * was jemand tatsächlich erlebt hat: Wer im Hoch hineinsieht, misst von dort.
 */
export function groesserRueckschlag(
  verlauf: readonly { d: string; wert: number }[]
): Rueckschlag | null {
  if (verlauf.length < 2) return null

  let hoch = verlauf[0]
  let bester: Rueckschlag | null = null

  for (const punkt of verlauf) {
    if (punkt.wert >= hoch.wert) {
      hoch = punkt
      continue
    }
    const rueckgang = ((punkt.wert - hoch.wert) / hoch.wert) * 100
    if (!bester || rueckgang < bester.prozent) {
      bester = {
        vonTag: hoch.d,
        bisTag: punkt.d,
        prozent: rueckgang,
        erholtAm: null,
      }
    }
  }

  if (!bester) return null

  /*
    Die Erholung wird erst danach gesucht, weil sie vom endgültigen Tiefpunkt
    aus zählt. Sie währenddessen mitzuführen hieße, sie bei jedem neuen
    Zwischentief zu verwerfen und neu zu suchen – dasselbe Ergebnis mit mehr
    Gelegenheiten, es falsch zu machen.
  */
  const hoehe = verlauf.find((p) => p.d === bester.vonTag)?.wert ?? 0
  const danach = verlauf.filter((p) => p.d > bester.bisTag)
  const erholt = danach.find((p) => p.wert >= hoehe)
  return { ...bester, erholtAm: erholt?.d ?? null }
}

/**
 * Rechnet die Zusammenstellung über die gemeinsamen Tage.
 *
 * `null`, wenn zu wenig gemeinsame Tage vorliegen oder keine Position ein
 * positives Gewicht hat.
 */
export function simuliere(
  reihen: ReadonlyMap<string, readonly Kurspunkt[]>,
  positionen: readonly Position[],
  einsatz: number
): Simulation | null {
  const brauchbar = positionen.filter(
    (p) => p.anteil > 0 && (reihen.get(p.symbol)?.length ?? 0) > 1
  )
  if (brauchbar.length === 0 || einsatz <= 0) return null

  const nurGebrauchte = new Map(
    brauchbar.map((p) => [p.symbol, reihen.get(p.symbol)!] as const)
  )
  const tage = gemeinsameTage(nurGebrauchte)
  if (tage.length < 2) return null

  const summe = brauchbar.reduce((s, p) => s + p.anteil, 0)
  if (summe <= 0) return null

  /* Je Symbol ein Nachschlagewerk Tag → Kurs, damit die Schleife nicht sucht. */
  const kurse = new Map<string, Map<string, number>>()
  for (const [symbol, reihe] of nurGebrauchte) {
    kurse.set(symbol, new Map(reihe.map((p) => [p.d, p.c])))
  }

  const start = tage[0]
  const ende = tage[tage.length - 1]

  /* Anteile am ersten gemeinsamen Tag – danach wird nichts mehr angefasst. */
  const stueck = new Map<string, number>()
  for (const position of brauchbar) {
    const kurs = kurse.get(position.symbol)!.get(start)!
    stueck.set(position.symbol, (einsatz * (position.anteil / summe)) / kurs)
  }

  const verlauf = tage.map((tag) => ({
    d: tag,
    wert: brauchbar.reduce(
      (wert, position) =>
        wert + stueck.get(position.symbol)! * kurse.get(position.symbol)!.get(tag)!,
      0
    ),
  }))

  const endwert = verlauf[verlauf.length - 1].wert
  const jahre = tageZwischen(start, ende) / 365.25
  const gesamtProzent = ((endwert - einsatz) / einsatz) * 100

  const gewichteAm = (tag: string, gesamtwert: number) =>
    brauchbar.map((position) => ({
      symbol: position.symbol,
      prozent:
        gesamtwert > 0
          ? ((stueck.get(position.symbol)! * kurse.get(position.symbol)!.get(tag)!) /
              gesamtwert) *
            100
          : 0,
    }))

  return {
    verlauf,
    einsatz,
    endwert,
    vonTag: start,
    bisTag: ende,
    gesamtProzent,
    /*
      Eine Jahresrate aus vier Monaten hochzurechnen ergibt eine Zahl, die
      niemand gemessen hat – dieselbe Regel wie im Rückblick auf der
      Aktienseite.
    */
    jahresProzent: jahre >= 1 ? ((endwert / einsatz) ** (1 / jahre) - 1) * 100 : null,
    groesster: groesserRueckschlag(verlauf),
    startgewichte: gewichteAm(start, einsatz),
    endgewichte: gewichteAm(ende, endwert),
  }
}

function tageZwischen(von: string, bis: string): number {
  const a = Date.parse(`${von}T00:00:00Z`)
  const b = Date.parse(`${bis}T00:00:00Z`)
  return Math.abs(b - a) / 86_400_000
}
