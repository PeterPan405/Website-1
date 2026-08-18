/**
 * Aktien nach ihren Kennzahlen filtern – und nach ihrer Datenlage.
 *
 * ## Warum jede Antwort ihre eigene Grundgesamtheit mitbringt
 *
 * Ein Screener beantwortet Fragen der Form „zeig mir alle mit KGV unter 12“.
 * Was er tatsächlich zeigt, sind alle **mit Kennzahl** und KGV unter 12 – und
 * das ist etwas anderes, sobald die Kennzahl nicht überall dasteht.
 *
 * Hier steht sie nicht überall. Am 18. August 2026 gemessen:
 *
 * | Sitzland        | geführt | mit Bilanzzahlen |
 * | --------------- | ------: | ---------------: |
 * | USA             |     248 |     248 (100 %)  |
 * | Japan           |      70 |       5 (7 %)    |
 * | Deutschland     |      67 |       2 (3 %)    |
 * | Großbritannien  |      58 |      22 (38 %)   |
 * | Indien          |      50 |       3 (6 %)    |
 *
 * Wer danach „die zehn günstigsten Aktien der Welt“ abfragt, bekommt eine fast
 * rein amerikanische Liste – und sie sieht aus wie eine Aussage über den Markt,
 * obwohl sie eine über unsere Quellen ist. Genau dieser Fehler ist auf
 * `/maerkte/waehrungen-im-weltindex` schon einmal passiert: 86,4 % Dollar aus
 * dem eigenen Kursbestand, gemessen war die Datenlücke.
 *
 * Deshalb liefert `screene()` nicht nur Zeilen, sondern zu jeder benutzten
 * Kennzahl eine `Grundgesamtheit` – wie viele Titel sie überhaupt haben, nach
 * Land aufgeschlüsselt. Die Seite zeigt sie neben dem Ergebnis, nicht in einer
 * Fußnote.
 *
 * ## Warum der Börsenwert in Euro steht
 *
 * `Fundamentalkennzahlen.marktkapitalisierung` steht in der **Bilanzwährung**.
 * Ein Filter „ab 100 Milliarden“ über einen gemischten Bestand vergliche damit
 * Yen mit Dollar – 4 Billionen Yen sind nicht mehr als 3 Billionen Dollar.
 *
 * Umgerechnet wird deshalb, und zwar in Euro: Der Börsenwert ist eine Größe von
 * heute, der Wechselkurs auch. Das ist exakt und nicht geschätzt – dieselbe
 * Begründung wie in `lib/devisen.ts`. Wo kein Kurs vorliegt, bleibt der Wert
 * `null` und die Zeile fällt aus diesem einen Filter, statt mit einer falschen
 * Zahl darin zu bleiben.
 *
 * ## Was ein Filter nicht leistet
 *
 * Er findet, was billig **aussieht**. Ein niedriges KGV entsteht auf zwei
 * Wegen: Der Kurs ist gefallen, oder der Gewinn war einmalig hoch. Beide sehen
 * in der Tabelle gleich aus. Das gehört auf die Seite, und es ist kein
 * Kleingedrucktes – es ist der halbe Zweck der Seite.
 */

import { type Fundamentalbefund } from '@/lib/markets'

/** Eine Zeile im Screener – alles, wonach gefiltert oder sortiert wird. */
export interface Screenerzeile {
  symbol: string
  name: string
  ticker: string
  branche: string | null
  /** Deutscher Ländername, nicht der ISO-Code. */
  land: string | null
  /** Die Währung, in der die Bilanzzahlen stehen. */
  waehrung: string | null
  kgv: number | null
  kuv: number | null
  kbv: number | null
  /** Börsenwert in Milliarden Euro – umgerechnet, damit vergleichbar. */
  marktwertMrdEur: number | null
  /** Abstand zum Zwölfmonatshoch in Prozent, negativ oder null. */
  abstandHoch: number | null
  /** Warum keine Kennzahlen dastehen – für die Zeile ohne Zahlen. */
  ohneZahlen: 'keineMeldung' | 'keinEchterKurs' | null
}

/** Die Kennzahlen, nach denen gefiltert werden kann. */
export type Kennzahlfeld = 'kgv' | 'kuv' | 'kbv' | 'marktwertMrdEur' | 'abstandHoch'

export const KENNZAHL_LABEL: Readonly<Record<Kennzahlfeld, string>> = {
  kgv: 'Kurs-Gewinn-Verhältnis',
  kuv: 'Kurs-Umsatz-Verhältnis',
  kbv: 'Kurs-Buchwert-Verhältnis',
  marktwertMrdEur: 'Börsenwert',
  abstandHoch: 'Abstand zum Hoch',
}

/**
 * Was gefiltert wird.
 *
 * Jedes Feld ist auslassbar, und ausgelassen heißt „egal“ – nicht „null“. Der
 * Unterschied ist der Grund, warum hier `undefined` und nicht `null` steht:
 * `null` ist in diesem Projekt ein Wert („die Kennzahl gibt es nicht“), und
 * beides in einem Feld wäre eine Fallunterscheidung, die niemand richtig trifft.
 */
export interface Filter {
  branche?: string
  land?: string
  kgvBis?: number
  kbvBis?: number
  kuvBis?: number
  marktwertAbMrdEur?: number
  /** Höchstens so nah am Hoch, in Prozent. `-20` heißt „mindestens 20 % darunter“. */
  abstandHochBis?: number
}

/** Wie viele Titel eine Kennzahl überhaupt haben – die Antwort hinter der Antwort. */
export interface Grundgesamtheit {
  feld: Kennzahlfeld
  label: string
  belegt: number
  gesamt: number
  /** Nach Land, absteigend nach Zahl der geführten Titel. */
  nachLand: { land: string; belegt: number; gesamt: number }[]
}

export type Sortierfeld = 'name' | Kennzahlfeld

/**
 * Baut die Zeile zu einer Aktie.
 *
 * `jeEuro` sind die EZB-Referenzkurse (wie viele Einheiten ein Euro kostet).
 * Fehlen sie, bleibt der Börsenwert `null` – geraten wird nicht.
 */
export function baueZeile(
  stamm: {
    symbol: string
    name: string
    ticker: string
    branche?: string | null
    land?: string | null
  },
  befund: Fundamentalbefund | null,
  abstandHoch: number | null,
  umrechnen: (betrag: number, von: string) => number | null
): Screenerzeile {
  const grund =
    befund === null
      ? null
      : befund.art === 'keineMeldung'
        ? 'keineMeldung'
        : befund.art === 'keinEchterKurs'
          ? 'keinEchterKurs'
          : null

  if (befund === null || befund.art !== 'zahlen') {
    return {
      symbol: stamm.symbol,
      name: stamm.name,
      ticker: stamm.ticker,
      branche: stamm.branche ?? null,
      land: stamm.land ?? null,
      waehrung: null,
      kgv: null,
      kuv: null,
      kbv: null,
      marktwertMrdEur: null,
      abstandHoch,
      ohneZahlen: grund,
    }
  }

  const marktwert = befund.kennzahlen.marktkapitalisierung.wert
  const inEuro = marktwert === null ? null : umrechnen(marktwert, befund.waehrung)

  return {
    symbol: stamm.symbol,
    name: stamm.name,
    ticker: stamm.ticker,
    branche: stamm.branche ?? null,
    land: stamm.land ?? null,
    waehrung: befund.waehrung,
    kgv: befund.kennzahlen.kgv.wert,
    kuv: befund.kennzahlen.kuv.wert,
    kbv: befund.kennzahlen.kbv.wert,
    marktwertMrdEur: inEuro === null ? null : inEuro / 1_000_000_000,
    abstandHoch,
    ohneZahlen: null,
  }
}

/** Welche Kennzahlen ein Filter tatsächlich benutzt. */
export function benutzteFelder(filter: Filter): Kennzahlfeld[] {
  const felder: Kennzahlfeld[] = []
  if (filter.kgvBis !== undefined) felder.push('kgv')
  if (filter.kuvBis !== undefined) felder.push('kuv')
  if (filter.kbvBis !== undefined) felder.push('kbv')
  if (filter.marktwertAbMrdEur !== undefined) felder.push('marktwertMrdEur')
  if (filter.abstandHochBis !== undefined) felder.push('abstandHoch')
  return felder
}

/**
 * Die Grundgesamtheit einer Kennzahl innerhalb der Vorauswahl.
 *
 * „Innerhalb der Vorauswahl“ ist wichtig: Wer nach Branche und Land
 * eingeschränkt hat, will wissen, wie vollständig **dieser** Ausschnitt ist,
 * nicht der ganze Katalog. Eine Abdeckung von 45 % über alles sagt nichts
 * darüber, ob die zwölf deutschen Chemiewerte belegt sind.
 */
export function grundgesamtheit(
  zeilen: readonly Screenerzeile[],
  feld: Kennzahlfeld
): Grundgesamtheit {
  const nachLand = new Map<string, { belegt: number; gesamt: number }>()

  let belegt = 0
  for (const zeile of zeilen) {
    const land = zeile.land ?? 'ohne Sitzland'
    const eintrag = nachLand.get(land) ?? { belegt: 0, gesamt: 0 }
    eintrag.gesamt += 1
    if (zeile[feld] !== null) {
      eintrag.belegt += 1
      belegt += 1
    }
    nachLand.set(land, eintrag)
  }

  return {
    feld,
    label: KENNZAHL_LABEL[feld],
    belegt,
    gesamt: zeilen.length,
    nachLand: [...nachLand.entries()]
      .map(([land, eintrag]) => ({ land, ...eintrag }))
      .sort((a, b) => b.gesamt - a.gesamt || a.land.localeCompare(b.land, 'de')),
  }
}

/**
 * Die Vorauswahl: alles, was **ohne** Kennzahl entschieden werden kann.
 *
 * Branche und Land stehen im Katalog und fehlen praktisch nie. Sie zuerst
 * anzuwenden ist nicht schneller, sondern ehrlicher: Die Grundgesamtheit einer
 * Kennzahl wird gegen diese Auswahl gerechnet, nicht gegen den ganzen Katalog.
 */
export function vorauswahl(
  zeilen: readonly Screenerzeile[],
  filter: Filter
): Screenerzeile[] {
  return zeilen.filter((zeile) => {
    if (filter.branche !== undefined && zeile.branche !== filter.branche) return false
    if (filter.land !== undefined && zeile.land !== filter.land) return false
    return true
  })
}

/**
 * Die Kennzahlfilter auf eine Vorauswahl.
 *
 * Eine Zeile ohne die gefragte Kennzahl fällt heraus – sie erfüllt die
 * Bedingung nicht, und sie erfüllt sie auch nicht „vielleicht“. Wie viele das
 * waren, sagt `grundgesamtheit`; hier wird nur gefiltert.
 */
export function kennzahlfilter(
  zeilen: readonly Screenerzeile[],
  filter: Filter
): Screenerzeile[] {
  return zeilen.filter((zeile) => {
    if (
      filter.kgvBis !== undefined &&
      !(zeile.kgv !== null && zeile.kgv <= filter.kgvBis)
    )
      return false
    if (
      filter.kuvBis !== undefined &&
      !(zeile.kuv !== null && zeile.kuv <= filter.kuvBis)
    )
      return false
    if (
      filter.kbvBis !== undefined &&
      !(zeile.kbv !== null && zeile.kbv <= filter.kbvBis)
    )
      return false
    if (
      filter.marktwertAbMrdEur !== undefined &&
      !(
        zeile.marktwertMrdEur !== null &&
        zeile.marktwertMrdEur >= filter.marktwertAbMrdEur
      )
    )
      return false
    if (
      filter.abstandHochBis !== undefined &&
      !(zeile.abstandHoch !== null && zeile.abstandHoch <= filter.abstandHochBis)
    )
      return false
    return true
  })
}

/** Das Ergebnis einer Abfrage – Zeilen **und** worauf sie sich stützen. */
export interface Screenerergebnis {
  /** Die Treffer. */
  treffer: Screenerzeile[]
  /** Wie viele Titel die Vorauswahl umfasst, bevor Kennzahlen greifen. */
  vorauswahl: number
  /** Zu jeder benutzten Kennzahl: wie vollständig sie in der Vorauswahl ist. */
  grundgesamtheiten: Grundgesamtheit[]
}

/**
 * Filtern in einem Zug, mit der Grundgesamtheit im Ergebnis.
 *
 * Die beiden gehören zusammen und werden deshalb zusammen zurückgegeben. Wer
 * nur die Treffer will, kann die Zahlen weglassen – aber er muss es tun,
 * anstatt sie nie gesehen zu haben.
 */
export function screene(
  zeilen: readonly Screenerzeile[],
  filter: Filter
): Screenerergebnis {
  const vor = vorauswahl(zeilen, filter)
  return {
    treffer: kennzahlfilter(vor, filter),
    vorauswahl: vor.length,
    grundgesamtheiten: benutzteFelder(filter).map((feld) => grundgesamtheit(vor, feld)),
  }
}

/**
 * Sortieren. Fehlende Werte stehen immer hinten, in beiden Richtungen.
 *
 * Sonst wäre „aufsteigend nach KGV“ eine Liste von Titeln ohne KGV, und die
 * günstigsten stünden auf Seite zwei. `null` ist hier kein kleiner Wert,
 * sondern gar keiner.
 */
export function sortiere(
  zeilen: readonly Screenerzeile[],
  nach: Sortierfeld,
  richtung: 'auf' | 'ab'
): Screenerzeile[] {
  const vorzeichen = richtung === 'auf' ? 1 : -1

  return [...zeilen].sort((a, b) => {
    if (nach === 'name') return a.name.localeCompare(b.name, 'de') * vorzeichen

    const links = a[nach]
    const rechts = b[nach]
    if (links === null && rechts === null) return a.name.localeCompare(b.name, 'de')
    if (links === null) return 1
    if (rechts === null) return -1
    return (links - rechts) * vorzeichen || a.name.localeCompare(b.name, 'de')
  })
}
