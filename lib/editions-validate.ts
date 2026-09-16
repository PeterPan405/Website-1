import type { DailyEdition } from '@/data/editions'

/**
 * Prüft die Tagesausgaben beim Bauen.
 *
 * Eine Ausgabe wird geschrieben und nicht von einem zweiten Menschen
 * gegengelesen. Ein Tippfehler in einem Themen-Slug oder eine Meldung ohne
 * Quelle würde sonst still auf die Website gelangen – als toter Link oder als
 * Zusammenfassung ohne nachprüfbare Herkunft.
 *
 * Deshalb bricht der Build ab, statt zu warnen. Eine fehlende Ausgabe ist ein
 * sichtbares Problem, das jemand behebt; eine kaputte Ausgabe im Netz nicht.
 *
 * Geprüft wird alles, was der Compiler nicht sehen kann: ob Verweise ins Leere
 * zeigen, ob die Texte die Anforderungen erfüllen – und seit die Meldungszahl
 * nicht mehr im Typ steht, auch der Umfang der Ausgabe.
 *
 * ## Warum die Bezugslisten von außen kommen
 *
 * Die Lernthemen und Kurse stehen unter `data/`, das Modul holte sie sich früher
 * selbst. Damit war es nur noch im Next-Build lauffähig – ein Test hätte die
 * Alias-Pfade auflösen müssen. Ausgerechnet die Prüfung, die einen Fehler in
 * automatisch entstandenen Daten abfangen soll, war deshalb selbst ungeprüft.
 * Jetzt bekommt sie die beiden Mengen übergeben und läuft überall.
 */

/** Die Listen, gegen die eine Meldung ihre Verweise prüfen lassen muss. */
export interface Bezuege {
  /** Alle Slugs aus `data/learn`. */
  topicSlugs: ReadonlySet<string>
  /** Alle Symbole aus `data/markets`. */
  symbols: ReadonlySet<string>
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/**
 * Zielkorridor des `intro` – zugleich der Korridor der Meta-Description.
 *
 * `app/news/tag/[datum]/page.tsx` setzt `description: edition.intro`, **ohne
 * zu kürzen.** Die Obergrenze hier ist damit dieselbe Zahl wie
 * `BESCHREIBUNG_MAX` in `scripts/paket-pruefen.ts`, und sie darf sie nie
 * überschreiten.
 *
 * Bis zum 16. August 2026 stand hier 165 gegen 160 in der Bauprüfung. Fünf
 * Zeichen Unterschied, zwei Dateien – zwanzig Ausgaben lang fiel es nicht
 * auf, weil kein `intro` je über 160 kam. Am 16. August kam eines mit 165
 * heraus, der Bau brach ab, und die Ausgabe des Tages fehlte:
 *
 *     /news/tag/2026-08-16/: Meta-Description ist 165 Zeichen lang (erlaubt 160)
 *
 * Der Fehler war nicht die Zahl, sondern dass es zwei gab. Die Kopplung prüft
 * jetzt `tests/intro-grenze.test.ts`.
 */
const INTRO_MIN = 110
const INTRO_MAX = 160

/*
  Der erlaubte Umfang einer Ausgabe.

  Die Untergrenze ist die eigentliche Aussage: Unter drei Meldungen ist es kein
  Überblick über einen Tag, sondern eine einzelne Nachricht mit Beiwerk. Die
  Obergrenze ist keine redaktionelle Regel, sondern ein Notausgang – wer
  versehentlich eine Ausgabe zweimal einträgt, soll es beim Bauen erfahren und
  nicht daran, dass die Seite plötzlich doppelt so lang ist.
*/
const TOP_MIN = 1
const TOP_MAX = 6
const ITEMS_MIN = 3
const ITEMS_MAX = 12

/**
 * Wendungen, die in einer **gesprochenen Nachricht** nichts zu suchen haben.
 *
 * ## Warum das geprüft wird und nicht nur im Prompt steht
 *
 * `summary` wird wörtlich zur Podcastfolge (`lib/sprechfassung.ts`). Der
 * Betreiber hat am 16. September 2026 verlangt, dass dort **objektiv ohne
 * Positionierung oder Meinung** berichtet wird. Diese Anweisung steht seither
 * in `scripts/nachrichten-erzeugen.ts` und in `nachrichten-agent.yml` – und
 * eine Anweisung an ein Modell ist eine Bitte, keine Zusage. Deshalb hier
 * zusätzlich die Grenze.
 *
 * ## Warum die Liste so kurz ist
 *
 * Geprüft wird nur, was sich **mechanisch** entscheiden lässt und wofür es in
 * einer Nachrichtenmeldung keine zulässige Lesart gibt: eine Anlageempfehlung
 * und die eigene Meinung des Sprechers.
 *
 * Urteilende Adjektive – „rücksichtslos", „skandalös" – stehen bewusst
 * **nicht** hier. Sie sind ebenso unerwünscht, aber ihre Zulässigkeit hängt
 * am Satz: In einem Zitat mit Zuschreibung sind sie richtig. Eine Wortliste,
 * die das nicht unterscheiden kann, beanstandet irgendwann eine korrekte
 * Meldung und wird dann abgeschaltet statt befolgt. Dafür ist der Prompt da.
 *
 * Nachgezählt über alle 47 Ausgaben vom 16. September 2026: **kein einziger
 * Treffer** in `summary`. Die Regel kostet also nichts und fängt den Rückfall.
 * Dass sie überhaupt anschlagen kann, prüft `tests/editions-objektiv.test.ts`
 * an Sätzen, die sie beanstanden **muss**.
 */
const OHNE_POSITION: readonly { readonly art: string; readonly muster: RegExp }[] = [
  {
    art: 'Anlageempfehlung',
    muster:
      /\b(sollte[nst]? +(man|Anleger(innen)?|Sparer|du)\b|kaufempfehlung|verkaufsempfehlung|einstiegsgelegenheit|schnäppchen|ein klarer (kauf|verkauf)\b|jetzt +(kaufen|verkaufen|einsteigen|aussteigen)\b)/i,
  },
  {
    art: 'eigene Meinung',
    muster:
      /\b(meiner meinung nach|meines erachtens|aus meiner sicht|ich (denke|glaube|meine)\b|wir (glauben|denken|erwarten|halten)\b)/i,
  },
]

/**
 * Findet Positionierung und Meinung in einem Text – siehe `OHNE_POSITION`.
 *
 * Ausgeführt und exportiert, damit sie an **einer** Stelle steht:
 * `scripts/nachrichten-erzeugen.ts` prüft denselben Satz, bevor der Entwurf
 * überhaupt zur Ausgabe wird, und `AGENTS.md` verlangt, dass die Prüfung dort
 * diese hier spiegelt. Zwei Wortlisten mit demselben Zweck gehen auseinander;
 * eine Funktion tut das nicht.
 */
export function positionierungen(text: string): { art: string; fund: string }[] {
  const gefunden: { art: string; fund: string }[] = []
  for (const { art, muster } of OHNE_POSITION) {
    const treffer = text.match(muster)
    if (treffer) gefunden.push({ art, fund: treffer[0] })
  }
  return gefunden
}

export function validateEditions(
  editions: readonly DailyEdition[],
  { topicSlugs, symbols }: Bezuege
): string[] {
  const problems: string[] = []
  const seenDates = new Set<string>()

  for (const edition of editions) {
    const where = `Ausgabe ${edition.date}`

    if (!DATE_PATTERN.test(edition.date)) {
      problems.push(`${where}: Datum muss im Format JJJJ-MM-TT vorliegen.`)
    }
    if (seenDates.has(edition.date)) {
      problems.push(`${where}: Dieses Datum kommt mehrfach vor.`)
    }
    seenDates.add(edition.date)

    const introLength = [...edition.intro].length
    if (introLength < INTRO_MIN || introLength > INTRO_MAX) {
      problems.push(
        `${where}: intro hat ${introLength} Zeichen, erlaubt sind ${INTRO_MIN} bis ${INTRO_MAX}.`
      )
    }

    const items = [...edition.top, ...edition.further]

    if (edition.top.length < TOP_MIN || edition.top.length > TOP_MAX) {
      problems.push(
        `${where}: ${edition.top.length} Top-Meldungen, erlaubt sind ${TOP_MIN} bis ${TOP_MAX}.`
      )
    }
    if (items.length < ITEMS_MIN || items.length > ITEMS_MAX) {
      problems.push(
        `${where}: ${items.length} Meldungen insgesamt, erlaubt sind ${ITEMS_MIN} bis ${ITEMS_MAX}.`
      )
    }

    const headlines = new Set<string>()

    for (const item of items) {
      const at = `${where}, „${item.headline}“`

      if (headlines.has(item.headline)) {
        problems.push(`${at}: Diese Überschrift kommt in der Ausgabe doppelt vor.`)
      }
      headlines.add(item.headline)

      if (item.summary.length === 0 || item.summary.some((p) => p.trim().length < 40)) {
        problems.push(
          `${at}: Jede Zusammenfassung braucht mindestens einen echten Absatz.`
        )
      }
      if (item.whyItMatters.trim().length < 40) {
        problems.push(`${at}: whyItMatters fehlt oder ist zu knapp.`)
      }

      /*
        Nur `summary` – das ist der Text, der gesprochen wird.

        `whyItMatters` bleibt frei: Es ist die Einordnung auf der Website und
        darf sagen, worauf zu achten ist. In der Folge kommt es seit dem
        16. September 2026 ohnehin nicht mehr vor.
      */
      for (const { art, fund } of positionierungen(item.summary.join(' '))) {
        problems.push(
          `${at}: „${fund}“ in summary – ${art}. Die Zusammenfassung wird ` +
            `wörtlich zur Podcastfolge und berichtet ohne Positionierung. ` +
            `Gehört das in die Einordnung, steht es in whyItMatters richtig.`
        )
      }
      if (item.sources.length === 0) {
        problems.push(`${at}: Mindestens eine Quelle ist Pflicht.`)
      }

      for (const source of item.sources) {
        if (!source.url.startsWith('https://')) {
          problems.push(`${at}: Quelle „${source.label}“ ist kein https-Link.`)
        }
        if (source.label.trim().length === 0) {
          problems.push(`${at}: Eine Quelle hat keine Beschriftung.`)
        }
      }

      // Der häufigste Fehler beim automatischen Schreiben: ein plausibel
      // klingender Slug, den es nicht gibt. Der Link liefe dann ins Leere.
      for (const slug of item.relatedTopics) {
        if (!topicSlugs.has(slug)) {
          problems.push(`${at}: Lernthema „${slug}“ existiert nicht.`)
        }
      }
      for (const symbol of item.relatedSymbols) {
        if (!symbols.has(symbol)) {
          problems.push(`${at}: Kurs „${symbol}“ existiert nicht.`)
        }
      }
    }
  }

  return problems
}

/**
 * Wirft, wenn eine Ausgabe fehlerhaft ist.
 *
 * Wird beim Laden der Service-Schicht aufgerufen und damit bei jedem Build.
 */
export function assertEditionsValid(
  editions: readonly DailyEdition[],
  bezuege: Bezuege
): void {
  const problems = validateEditions(editions, bezuege)
  if (problems.length > 0) {
    throw new Error(
      `Die Tagesausgaben sind fehlerhaft:\n${problems.map((p) => `  - ${p}`).join('\n')}`
    )
  }
}
