/**
 * Eine Frage je Tag, gerechnet aus den eigenen Kursen.
 *
 * ## Was diese Datei schwierig macht
 *
 * Nicht das Auswählen. Das **Verwerfen**.
 *
 * Eine Quizfrage aus Marktdaten ist in dem Augenblick wertlos, in dem zwei
 * Antworten gleich gut sind. „Welcher der vier Indizes lag gestern vorn?" hat
 * keine richtige Antwort, wenn zwei um 0,41 und 0,42 Prozent gestiegen sind –
 * der Unterschied liegt unter dem, was die Anzeige überhaupt darstellt, und
 * wer die zweite anklickt, bekommt zu Unrecht „falsch" gesagt.
 *
 * Das ist kein Randfall: An einem ruhigen Tag liegen vier Indizes regelmäßig
 * innerhalb weniger Zehntel beieinander. Deshalb prüft **jede** Frageart ihren
 * eigenen Mindestabstand, und wo er nicht erreicht wird, entsteht die Frage
 * gar nicht erst. Lieber keine Tagesfrage als eine, die den Falschen tadelt.
 *
 * ## Warum nicht „gestern"
 *
 * Weil es das nicht ist. Die Seite entsteht beim Bauen; der jüngste
 * Handelstag in den Daten kann der Freitag sein, wenn heute Montag ist, und
 * am Feiertag liegt er noch weiter zurück. Jede Frage nennt deshalb **den
 * Tag, aus dem ihre Zahlen stammen**, und nicht ein „gestern", das sich
 * ausrechnet, wer die Frage stellt.
 *
 * ## Warum aus dem Datum gerechnet und nicht gezogen
 *
 * Dieselbe Überlegung wie beim Begriff des Tages: `Math.random()` ergäbe bei
 * jedem Bau eine andere Frage, und „Tagesfrage" heißt, dass es **die** Frage
 * dieses Tages ist. Der Streuwert ist hier ausgeschrieben und kommt nicht aus
 * einer Bibliothek – dieselbe Zeichenkette muss in fünf Jahren dieselbe Zahl
 * ergeben.
 *
 * ## Was eine Frage niemals tut
 *
 * Sie mischt keine Gattungen. Vier Indizes oder vier Rohstoffe – aber nicht
 * drei Indizes und eine Aktie: Dann wäre die Aktie die auffällige Antwort, und
 * geraten würde nach Aussehen statt nach Wissen.
 */

/** Wonach gefragt wird. */
export type Frageart = 'tagesgewinner' | 'jahresbester' | 'abstandZumHoch'

/** Was eine Frage über einen Wert braucht. */
export interface Kandidat {
  symbol: string
  name: string
  kind: string
  /** Veränderung zum vorherigen Schlusskurs, in Prozent. */
  changePercent: number
  /** Veränderung seit dem letzten Schlusskurs des Vorjahres, in Prozent. */
  ytdPercent: number
  value: number
  high52w: number
  /** Der Handelstag, aus dem die Zahlen stammen. */
  asOf: string
}

export interface Antwort {
  symbol: string
  label: string
  /** Der Zahlenwert, um den es geht – für die Auflösung. */
  wert: number
}

export interface Tagesfrage {
  art: Frageart
  frage: string
  antworten: Antwort[]
  richtigIndex: number
  /** Warum diese Antwort die richtige ist – mit der Zahl. */
  aufloesung: string
  /** Die Einheit der Zahlen, für die Auflösung. */
  einheit: '%'
  /** Der Handelstag, aus dem die Zahlen stammen. */
  stand: string
}

/**
 * Wie weit die beste Antwort von der zweitbesten entfernt sein muss.
 *
 * In Prozentpunkten, je Frageart verschieden – die Größen sind es auch.
 * Tagesbewegungen liegen bei Bruchteilen eines Prozents, Jahresrenditen bei
 * zweistelligen Zahlen. Ein gemeinsamer Wert wäre für die eine Frage zu streng
 * und für die andere zu lasch, und **zu lasch ist der gefährlichere Fehler**:
 * Dann steht eine Frage da, deren zweite Antwort genauso richtig ist.
 */
export const MINDESTABSTAND: Record<Frageart, number> = {
  tagesgewinner: 0.25,
  jahresbester: 2,
  abstandZumHoch: 2,
}

/** Wie viele Antworten zur Auswahl stehen. */
export const ANTWORTEN = 4

/**
 * Der Handelstag eines Datenstands.
 *
 * `asOf` ist mal ein Tag (`2026-08-18`), mal ein voller Zeitstempel
 * (`2026-08-18T19:35:36.000Z`) – je nachdem, ob der Kurs ein Tagesschluss ist
 * oder ein laufender. Verglichen werden darf nur der Tag; die Sekunde, in der
 * ein Kurs abgerufen wurde, sagt über den Handelstag nichts.
 *
 * Dieselbe Vorgehensweise wie `tagVon()` in `lib/news.ts`: die ersten zehn
 * Zeichen, kein Umweg über `new Date` – der würde die Zeitzone des Geräts
 * hereinziehen und den Tag westlich von Greenwich um eins verschieben.
 */
export function tagVon(asOf: string): string {
  return asOf.slice(0, 10)
}

/**
 * FNV-1a, 32 Bit – ausgeschrieben, damit er stabil bleibt.
 *
 * Dieselbe Begründung wie in `lib/begriff-des-tages.ts`: Er muss nicht sicher
 * sein, sondern in fünf Jahren dieselbe Zahl liefern.
 */
function streuwert(text: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** Die Reihenfolge, in der ein Tag seine Kandidaten sieht. */
function reihenfolge(kandidaten: readonly Kandidat[], saat: string): Kandidat[] {
  return [...kandidaten].sort(
    (a, b) => streuwert(`${a.symbol}#${saat}`) - streuwert(`${b.symbol}#${saat}`)
  )
}

/** Welche Zahl eine Frageart vergleicht. */
function messwert(kandidat: Kandidat, art: Frageart): number {
  switch (art) {
    case 'tagesgewinner':
      return kandidat.changePercent
    case 'jahresbester':
      return kandidat.ytdPercent
    case 'abstandZumHoch':
      /*
        Der Abstand ist negativ oder null – gefragt wird nach dem, der dem
        Hoch am nächsten ist, also nach dem größten (am wenigsten negativen)
        Wert. Dadurch gilt für alle drei Arten dieselbe Regel: Die größte Zahl
        gewinnt. Eine Frageart mit umgekehrter Ordnung wäre die Stelle, an der
        irgendwann jemand das Vorzeichen vergisst.
      */
      return kandidat.high52w > 0
        ? ((kandidat.value - kandidat.high52w) / kandidat.high52w) * 100
        : Number.NEGATIVE_INFINITY
  }
}

const FRAGETEXT: Record<Frageart, string> = {
  tagesgewinner: 'Welcher dieser Werte hat am letzten Handelstag am meisten zugelegt?',
  jahresbester: 'Welcher dieser Werte liegt seit Jahresbeginn am weitesten vorn?',
  abstandZumHoch: 'Welcher dieser Werte steht seinem Zwölfmonatshoch am nächsten?',
}

/** Die Reihenfolge, in der die Fragearten versucht werden. */
export const FRAGEARTEN: Frageart[] = ['tagesgewinner', 'jahresbester', 'abstandZumHoch']

/**
 * Baut aus vier Kandidaten eine Frage – oder `null`.
 *
 * `null` heißt: Diese vier taugen für diese Frage nicht. Entweder fehlt eine
 * Zahl, oder die beiden besten liegen zu dicht beieinander. Beides ist ein
 * Grund, die Frage nicht zu stellen, und keiner, sie trotzdem zu stellen.
 */
export function frageAus(
  kandidaten: readonly Kandidat[],
  art: Frageart
): Tagesfrage | null {
  if (kandidaten.length !== ANTWORTEN) return null

  const werte = kandidaten.map((kandidat) => messwert(kandidat, art))
  if (werte.some((wert) => !Number.isFinite(wert))) return null

  const sortiert = [...werte].sort((a, b) => b - a)
  const abstand = sortiert[0] - sortiert[1]
  if (abstand < MINDESTABSTAND[art]) return null

  const richtigIndex = werte.indexOf(sortiert[0])

  /*
    Alle Kandidaten müssen vom selben Handelstag stammen.

    Sonst verglichen zwei Zahlen zwei verschiedene Tage – und die Frage wäre
    nicht falsch beantwortet, sondern falsch gestellt. Das trifft echte Fälle:
    Unter den 22 geführten Indizes stand am 18. August 2026 einer mit einem
    Kurs vom 24. Juli.

    Verglichen wird der **Tag**, nicht der Zeitstempel. Beim ersten Anlauf
    stand hier `kandidat.asOf !== stand`, und weil laufende Kurse einen
    vollen Zeitstempel tragen – `2026-08-18T19:35:36.000Z` gegen
    `…:35:34.000Z` –, war nie eine Frage möglich. Der Build war grün, die
    Prüfungen waren grün, und die Startseite hatte still keine Tagesfrage.
    Gefunden nur durch Nachsehen im gebauten HTML.
  */
  const stand = tagVon(kandidaten[0].asOf)
  if (kandidaten.some((kandidat) => tagVon(kandidat.asOf) !== stand)) return null

  return {
    art,
    frage: FRAGETEXT[art],
    antworten: kandidaten.map((kandidat, index) => ({
      symbol: kandidat.symbol,
      label: kandidat.name,
      wert: werte[index],
    })),
    richtigIndex,
    aufloesung: aufloesungstext(kandidaten, werte, richtigIndex, art),
    einheit: '%',
    stand,
  }
}

/**
 * Die Auflösung nennt die Zahl – und die des Zweiten dazu.
 *
 * Ohne den Zweitplatzierten wäre die Auflösung eine Behauptung: „X lag vorn,
 * mit 1,2 Prozent." Erst der Abstand macht sie nachvollziehbar und zeigt
 * obendrein, ob es knapp war.
 */
function aufloesungstext(
  kandidaten: readonly Kandidat[],
  werte: readonly number[],
  richtigIndex: number,
  art: Frageart
): string {
  const sortiert = [...werte].sort((a, b) => b - a)
  const zweiter = kandidaten[werte.indexOf(sortiert[1])]

  const zahl = (wert: number) =>
    `${wert > 0 ? '+' : ''}${wert.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} %`

  const richtig = kandidaten[richtigIndex]

  switch (art) {
    case 'tagesgewinner':
      return `${richtig.name} mit ${zahl(sortiert[0])} gegenüber dem vorherigen Schlusskurs. Dahinter ${zweiter.name} mit ${zahl(sortiert[1])}.`
    case 'jahresbester':
      return `${richtig.name} mit ${zahl(sortiert[0])} seit dem letzten Schlusskurs des Vorjahres. Dahinter ${zweiter.name} mit ${zahl(sortiert[1])}.`
    case 'abstandZumHoch':
      return `${richtig.name} steht ${zahl(sortiert[0])} unter seinem Zwölfmonatshoch. Dahinter ${zweiter.name} mit ${zahl(sortiert[1])}.`
  }
}

/**
 * Die Frage des Tages.
 *
 * Aus dem Datum gerechnet: Frageart und Kandidaten stehen fest, sobald der Tag
 * feststeht. Führt die erste Wahl zu keiner brauchbaren Frage – weil die
 * beiden Besten zu dicht liegen –, wird die nächste Frageart versucht und
 * danach die nächste Vierergruppe.
 *
 * Kommt gar nichts zustande, ist die Antwort `null`, und die Seite zeigt keine
 * Frage. Eine Tagesfrage ohne eindeutige Antwort wäre schlechter als keine.
 */
export function tagesfrage(
  kandidaten: readonly Kandidat[],
  tag: string
): Tagesfrage | null {
  if (kandidaten.length < ANTWORTEN) return null

  const gemischt = reihenfolge(kandidaten, tag)

  /*
    Die Fragearten werden in einer aus dem Tag gedrehten Reihenfolge versucht.

    Ohne das Drehen käme an ruhigen Tagen immer dieselbe zweite Wahl heraus –
    die Tagesfrage wäre wochenlang „welcher liegt seit Jahresbeginn vorn?",
    weil die Tagesbewegungen zu dicht beieinander lagen.
  */
  const start = streuwert(`art#${tag}`) % FRAGEARTEN.length
  const arten = [...FRAGEARTEN.slice(start), ...FRAGEARTEN.slice(0, start)]

  for (const art of arten) {
    for (let i = 0; i + ANTWORTEN <= gemischt.length; i += ANTWORTEN) {
      const frage = frageAus(gemischt.slice(i, i + ANTWORTEN), art)
      if (frage) return frage
    }
  }

  return null
}

/**
 * Nur Werte derselben Gattung – und nur solche mit brauchbaren Zahlen.
 *
 * Vier Indizes oder vier Rohstoffe, nie gemischt: Sonst wäre die eine Aktie
 * unter drei Indizes die auffällige Antwort, und geraten würde nach Aussehen.
 */
export function gleicheGattung(
  kandidaten: readonly Kandidat[],
  kind: string
): Kandidat[] {
  return kandidaten.filter(
    (kandidat) =>
      kandidat.kind === kind &&
      Number.isFinite(kandidat.changePercent) &&
      Number.isFinite(kandidat.ytdPercent) &&
      kandidat.value > 0
  )
}
