/**
 * Verteilte Wiederholung nach dem Leitner-Prinzip.
 *
 * ## Wozu
 *
 * Der Wissenscheck am Ende einer Lernstufe prüft, ob der Text gerade
 * verstanden wurde. Er prüft nicht, ob er in vier Wochen noch sitzt – und
 * genau das ist die Frage, auf die es ankommt. Wer eine Stufe abhakt und nie
 * wieder hinsieht, hat nach einem Monat den größten Teil vergessen; das ist
 * keine Meinung über Lerntypen, sondern der am besten belegte Befund der
 * Gedächtnisforschung seit Ebbinghaus.
 *
 * Dagegen hilft nicht mehr Lesen, sondern **Abrufen in wachsenden Abständen**:
 * Eine Frage, die man beantworten konnte, kommt später wieder; eine, an der
 * man gescheitert ist, morgen. Das ist das ganze Verfahren.
 *
 * ## Warum Leitner und nicht SM-2
 *
 * Der Algorithmus hinter Anki (SM-2) rechnet je Karte einen Leichtigkeitsfaktor
 * fort und verlangt vom Lernenden eine Selbsteinschätzung in vier Stufen
 * („schwer“, „gut“, „leicht“ …). Hier gibt es diese Selbsteinschätzung nicht:
 * Die Fragen sind Multiple-Choice, die Antwort ist richtig oder falsch, und
 * eine erfundene Zwischenstufe machte den Algorithmus genauer, ohne dass die
 * Eingabe genauer würde.
 *
 * Fünf Fächer mit festen Abständen brauchen ein Feld je Karte und lassen sich
 * in einem Satz erklären. Das ist der richtige Tausch für ein Lernangebot, das
 * niemand einrichtet, bevor er es benutzt.
 *
 * ## Warum die Abstände so und nicht anders
 *
 * 1 – 3 – 7 – 21 – 60 Tage. Jeder Schritt etwa das Zwei- bis Dreifache des
 * vorigen: eng genug, dass zwischen zwei Abrufen nichts verloren geht, weit
 * genug, dass die Zahl der täglich fälligen Karten nicht mitwächst. Wer alle
 * 408 Fragen einmal durchhat und nichts mehr falsch beantwortet, sieht danach
 * im Schnitt rund sieben Karten am Tag.
 *
 * ## Ohne Uhrzeit
 *
 * Gerechnet wird in Kalendertagen, nicht in Stunden. Wer abends um 23 Uhr
 * lernt, soll am nächsten Morgen wiederholen dürfen und nicht bis 23 Uhr
 * warten müssen – eine Fälligkeit auf die Minute wäre genauer und im Alltag
 * falsch.
 */

/** Das höchste Fach. Wer hier ankommt, kann die Frage. */
export const HOECHSTES_FACH = 5

/**
 * Abstand in Tagen bis zur nächsten Fälligkeit, je Fach.
 *
 * Index 0 bleibt unbenutzt: Fächer werden ab 1 gezählt, damit „Fach 1“ auch
 * in der Anzeige Fach 1 heißt und nicht Fach 0.
 */
export const ABSTAENDE: readonly number[] = [0, 1, 3, 7, 21, 60]

/** Ab diesem Fach gilt eine Frage als gefestigt. */
export const GEFESTIGT_AB = 4

export interface Karte {
  /** Schlüssel der Frage, siehe `fragenSchluessel`. */
  id: string
  /** 1 bis 5. */
  fach: number
  /** Tag, an dem die Karte wieder drankommt, als `JJJJ-MM-TT`. */
  faellig: string
  /** Wie oft die Karte insgesamt beantwortet wurde. */
  versuche: number
  /** Wie oft davon richtig. */
  richtig: number
}

/**
 * Schlüssel einer Frage.
 *
 * Aus Thema, Stufe und Position zusammengesetzt. Die Position ist der
 * verwundbare Teil: Wird eine Frage in der Mitte einer Stufe eingefügt,
 * verschieben sich alle folgenden Schlüssel, und der gespeicherte Lernstand
 * zeigt danach auf die jeweils nächste Frage.
 *
 * Das ist bewusst in Kauf genommen. Die Alternative wäre eine ausgeschriebene
 * Kennung je Frage in `data/learn/quizzes.ts` – 408 Zeilen mehr, die jemand
 * beim Anlegen einer Frage vergessen kann, gegen einen Schaden, der einmalig
 * ein paar Karten zu früh oder zu spät zeigt. Neue Fragen gehören deshalb ans
 * **Ende** einer Stufe.
 */
export function fragenSchluessel(
  themaSlug: string,
  stufe: string,
  position: number
): string {
  return `${themaSlug}:${stufe}#${position}`
}

/** Zerlegt einen Schlüssel wieder. `null`, wenn er nicht passt. */
export function leseSchluessel(
  schluessel: string
): { thema: string; stufe: string; position: number } | null {
  const treffer = /^([a-z0-9-]+):([a-z]+)#(\d+)$/.exec(schluessel)
  if (!treffer) return null
  return { thema: treffer[1], stufe: treffer[2], position: Number(treffer[3]) }
}

/**
 * Ein Datum um Tage verschieben, in Kalendertagen.
 *
 * Über `Date.UTC` gerechnet und nicht über die lokale Zeitzone: Sonst fiele
 * in der Nacht der Zeitumstellung ein Tag aus oder käme doppelt vor, und ein
 * „in einem Tag“ hieße dort 23 oder 25 Stunden.
 */
export function tagePlus(tag: string, tage: number): string {
  const teile = /^(\d{4})-(\d{2})-(\d{2})$/.exec(tag)
  if (!teile) return tag
  const zeit = Date.UTC(Number(teile[1]), Number(teile[2]) - 1, Number(teile[3]))
  return new Date(zeit + tage * 86_400_000).toISOString().slice(0, 10)
}

/** Eine noch nie beantwortete Frage, sofort fällig. */
export function neueKarte(id: string, heute: string): Karte {
  return { id, fach: 1, faellig: heute, versuche: 0, richtig: 0 }
}

/**
 * Die Karte nach einer Antwort.
 *
 * Richtig: ein Fach höher. Falsch: zurück auf Fach 1 – nicht ein Fach
 * herunter. Wer eine Frage aus Fach 4 nicht mehr beantworten kann, hat sie
 * nicht „fast“ gewusst; sie ist weg, und drei Wochen bis zum nächsten Versuch
 * sind dann zu viel.
 */
export function beantworte(karte: Karte, richtig: boolean, heute: string): Karte {
  const fach = richtig ? Math.min(karte.fach + 1, HOECHSTES_FACH) : 1
  return {
    id: karte.id,
    fach,
    faellig: tagePlus(heute, ABSTAENDE[fach] ?? 1),
    versuche: karte.versuche + 1,
    richtig: karte.richtig + (richtig ? 1 : 0),
  }
}

/** Alle Karten, die heute oder früher fällig waren. */
export function faellige(karten: readonly Karte[], heute: string): Karte[] {
  return karten.filter((karte) => karte.faellig <= heute)
}

export interface Stand {
  /** Karten, die schon einmal beantwortet wurden. */
  begonnen: number
  /** Davon heute fällig. */
  faellig: number
  /** Davon in Fach 4 oder 5. */
  gefestigt: number
  /** Anteil richtiger Antworten über alle Versuche, oder null ohne Versuch. */
  trefferProzent: number | null
  /** Der nächste Tag, an dem etwas fällig wird – null, wenn nichts offen ist. */
  naechsterTag: string | null
}

/** Der Lernstand über alle gespeicherten Karten. */
export function stand(karten: readonly Karte[], heute: string): Stand {
  let versuche = 0
  let richtig = 0
  let gefestigt = 0
  let naechster: string | null = null

  for (const karte of karten) {
    versuche += karte.versuche
    richtig += karte.richtig
    if (karte.fach >= GEFESTIGT_AB) gefestigt += 1
    if (karte.faellig > heute && (naechster === null || karte.faellig < naechster)) {
      naechster = karte.faellig
    }
  }

  return {
    begonnen: karten.length,
    faellig: faellige(karten, heute).length,
    gefestigt,
    trefferProzent: versuche === 0 ? null : (richtig / versuche) * 100,
    naechsterTag: naechster,
  }
}

/**
 * Die Reihenfolge einer Übungsrunde.
 *
 * Fällige Karten zuerst, darunter die aus den niedrigen Fächern – was man
 * gerade nicht konnte, ist das, was Wiederholung braucht. Danach, wenn noch
 * Platz ist, neue Fragen: Ein Tag ohne Fälligkeiten soll nicht mit „nichts zu
 * tun“ enden, solange 408 Fragen bereitliegen.
 *
 * `neueIds` kommt in der übergebenen Reihenfolge zum Zug. Sie zu mischen wäre
 * verlockend und wäre falsch: Die Fragen stehen in der Reihenfolge der
 * Lernstufen, und wer bei „Aktie, Einsteiger“ anfängt, lernt in der Reihenfolge
 * weiter, in der die Themen aufeinander aufbauen.
 */
export function runde(
  karten: readonly Karte[],
  neueIds: readonly string[],
  heute: string,
  laenge: number
): { wiederholung: Karte[]; neu: string[] } {
  const wiederholung = faellige(karten, heute).sort(
    (a, b) => a.fach - b.fach || a.faellig.localeCompare(b.faellig)
  )

  if (wiederholung.length >= laenge) {
    return { wiederholung: wiederholung.slice(0, laenge), neu: [] }
  }

  const bekannt = new Set(karten.map((karte) => karte.id))
  const neu: string[] = []
  for (const id of neueIds) {
    if (neu.length >= laenge - wiederholung.length) break
    if (!bekannt.has(id)) neu.push(id)
  }

  return { wiederholung, neu }
}
