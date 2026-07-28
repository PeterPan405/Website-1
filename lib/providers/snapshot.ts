/**
 * Format und Prüfung der Kurs-Momentaufnahme.
 *
 * Die Website wird statisch exportiert – zur Laufzeit kann niemand Kurse
 * abrufen. Die Daten kommen deshalb beim Bauen aus einer Datei im Repository,
 * die ein zeitgesteuerter Workflow werktäglich erneuert
 * (`scripts/kurse-abrufen.ts`, `.github/workflows/kurse.yml`).
 *
 * ## Warum nicht direkt im Build abrufen
 *
 * Weil ein Build, der von fremden Servern abhängt, ausfällt, sobald einer davon
 * hustet – und bei Hostinger heißt das: Bereitstellung rot. Der Abruf läuft
 * deshalb im Workflow, wo ein Fehlschlag folgenlos bleibt: Dann wird nichts
 * committet, und der Build liest weiter die letzte gute Datei.
 *
 * ## Warum diese Datei importfrei ist
 *
 * Sie wird von zwei Seiten benutzt: vom Abruf-Skript, das über den
 * Typ-Entferner von Node läuft und keine Pfad-Aliase kennt, und von der
 * Service-Schicht der Website. Ohne Importe funktioniert beides.
 */

/** Ein Handelstag mit Schlusskurs. Kurze Schlüssel, weil es viele werden. */
export interface SnapshotPoint {
  /** Handelstag im Format YYYY-MM-DD. */
  d: string
  /** Schlusskurs. */
  c: number
}

/** Die Kursreihe eines Instruments samt Herkunft. */
export interface SnapshotInstrument {
  /**
   * Wie die Quelle genannt werden möchte.
   *
   * Steht so unter dem Chart. Die EZB verlangt eine Quellenangabe, und bei
   * einem freien Dienst gehört ohnehin sichtbar hin, woher die Zahl stammt.
   */
  sourceLabel: string
  /** Adresse der Quelle, für den Verweis unter dem Chart. */
  sourceUrl: string
  /** Handelstag des jüngsten Schlusskurses, YYYY-MM-DD. */
  asOf: string
  /**
   * Zuletzt gehandelter Preis mit Zeitpunkt, wenn die Quelle einen liefert.
   *
   * Etwas anderes als der letzte Schlusskurs: Während der Handelszeit steht
   * hier der Preis von eben. Die Kachel zeigt ihn, der Chart bleibt bei
   * Schlusskursen – ein Verlauf aus gemischten Preisarten hätte an der letzten
   * Stelle einen Knick, der nichts bedeutet.
   *
   * Fehlt bei der EZB: Referenzkurse sind Tagesfixings, einen „aktuellen“ Kurs
   * gibt es dort nicht.
   */
  latest?: { value: number; at: string }
  /** Aufsteigend nach Datum sortiert, verdichtet (siehe `thinPoints`). */
  points: SnapshotPoint[]
}

/**
 * Die Euro-Referenzkurse der EZB vom jüngsten Handelstag.
 *
 * ## Wozu sie in der Momentaufnahme stehen
 *
 * Nicht zur Anzeige – dafür gibt es die Währungspaare als eigene Instrumente.
 * Sondern zum Umrechnen: Shell berichtet in Dollar und notiert in London,
 * Enbridge berichtet in Kanada-Dollar und notiert dort auch, aber Brookfield
 * berichtet in US-Dollar bei kanadischer Notierung. Ohne Kurs lassen sich für
 * solche Werte keine Kennzahlen bilden.
 *
 * Die Tabelle kostet nichts: Der Kursabruf lädt die vollständige EZB-Tabelle
 * ohnehin, bisher wurden daraus nur fünf Paare übernommen und der Rest
 * weggeworfen. Abgelegt wird je Währung eine Zahl.
 */
export interface Devisenkurse {
  /** Handelstag der EZB-Fixings im Format YYYY-MM-DD. */
  stand: string
  /** Wie viele Einheiten dieser Währung ein Euro kostet. Euro selbst fehlt. */
  jeEuro: Record<string, number>
}

export interface MarketSnapshot {
  /** Wann der Abruf lief (ISO 8601 mit Zeitzone), `null` vor dem ersten Lauf. */
  fetchedAt: string | null
  /** Nach Instrument-Slug, z. B. `eur-usd`. */
  instruments: Record<string, SnapshotInstrument>
  /** Fehlt vor dem ersten Lauf, der sie schreibt. */
  devisen?: Devisenkurse
}

/** Eine Momentaufnahme ohne Daten – der Zustand vor dem ersten Workflow-Lauf. */
export const EMPTY_SNAPSHOT: MarketSnapshot = { fetchedAt: null, instruments: {} }

/**
 * Wie viele Tage am Ende in voller Auflösung erhalten bleiben.
 *
 * 400 Kalendertage decken die Zeiträume bis „ein Jahr“ vollständig mit
 * Tageswerten ab. Alles Ältere braucht nur noch die Form der Kurve – bei fünf
 * Jahren zeichnet der Chart ohnehin höchstens 260 Punkte.
 */
export const DAILY_WINDOW_DAYS = 400

/** Wie weit die Reihe insgesamt zurückreicht. */
export const HISTORY_YEARS = 5

/**
 * Verdichtet eine Kursreihe für die Ablage im Repository.
 *
 * Fünf Jahre Tageswerte wären rund 1.300 Punkte je Instrument. Bei zwölf
 * Instrumenten und einem Commit pro Börsentag wüchse das Repository schneller,
 * als irgendjemand davon hätte: Die Datei landet werktäglich neu in der
 * Historie.
 *
 * Deshalb: die letzten {@link DAILY_WINDOW_DAYS} Tage vollständig, davor nur
 * noch ein Wert je Woche. Sichtbar ist der Unterschied nicht – die betroffenen
 * Zeiträume werden vor dem Zeichnen ohnehin ausgedünnt.
 *
 * Der jüngste Punkt bleibt in jedem Fall erhalten. Er trägt den aktuellen Kurs.
 *
 * @param points Aufsteigend nach Datum sortiert.
 * @param today Bezugstag, Format YYYY-MM-DD. Vorgabe ist der heutige Tag.
 */
export function thinPoints(
  points: readonly SnapshotPoint[],
  today = new Date().toISOString().slice(0, 10)
): SnapshotPoint[] {
  if (points.length === 0) return []

  const bezug = Date.parse(`${today}T00:00:00Z`)
  const tagesGrenze = bezug - DAILY_WINDOW_DAYS * 86_400_000
  const historieGrenze = bezug - HISTORY_YEARS * 365.25 * 86_400_000

  const ergebnis: SnapshotPoint[] = []
  let letzteWoche = ''

  for (const point of points) {
    const zeit = Date.parse(`${point.d}T00:00:00Z`)
    if (!Number.isFinite(zeit) || zeit < historieGrenze) continue

    if (zeit >= tagesGrenze) {
      ergebnis.push(point)
      continue
    }

    // Älter als das Tagesfenster: höchstens ein Wert je Kalenderwoche.
    const woche = wochenSchluessel(zeit)
    if (woche !== letzteWoche) {
      letzteWoche = woche
      ergebnis.push(point)
    }
  }

  // Der jüngste Wert darf nie fehlen, auch wenn oben etwas schiefging.
  const letzter = points[points.length - 1]
  if (ergebnis[ergebnis.length - 1]?.d !== letzter.d) ergebnis.push(letzter)

  return ergebnis
}

/** Jahr und Wochennummer als Schlüssel, z. B. `2026-30`. */
function wochenSchluessel(zeit: number): string {
  const tage = Math.floor(zeit / 86_400_000)
  // Der 1.1.1970 war ein Donnerstag; +3 verschiebt den Wochenstart auf Montag.
  return String(Math.floor((tage + 3) / 7))
}

/**
 * Schreibt die Momentaufnahme als JSON – ein Kurspunkt je Zeile.
 *
 * `JSON.stringify(daten, null, 2)` verteilt jeden Punkt auf vier Zeilen und
 * bläht die Datei damit auf mehr als das Doppelte. Ohne Einrückung wäre sie
 * dagegen eine einzige endlose Zeile, in der jede Änderung als vollständige
 * Neufassung erschiene.
 *
 * Ein Punkt je Zeile ist beides: kompakt und in einem Diff lesbar. Ein
 * Börsentag mehr ist dann genau elf neue Zeilen – eine je Instrument.
 */
export function serializeSnapshot(snapshot: MarketSnapshot): string {
  const eintraege = Object.entries(snapshot.instruments).map(([symbol, eintrag]) => {
    const punkte = eintrag.points
      .map((punkt) => `        ${JSON.stringify(punkt)}`)
      .join(',\n')

    return [
      `    ${JSON.stringify(symbol)}: {`,
      `      "sourceLabel": ${JSON.stringify(eintrag.sourceLabel)},`,
      `      "sourceUrl": ${JSON.stringify(eintrag.sourceUrl)},`,
      `      "asOf": ${JSON.stringify(eintrag.asOf)},`,
      ...(eintrag.latest ? [`      "latest": ${JSON.stringify(eintrag.latest)},`] : []),
      `      "points": [`,
      punkte,
      `      ]`,
      `    }`,
    ].join('\n')
  })

  /*
    Die Devisentabelle kommt ans Ende und in eine Zeile je Währung.

    Ans Ende, weil sie sich taeglich in jeder Zahl aendert – stuende sie oben,
    begaenne jeder Diff mit dreissig geaenderten Zeilen, bevor die eigentliche
    Neuigkeit kaeme.
  */
  const devisen = snapshot.devisen
    ? [
        '  "devisen": {',
        `    "stand": ${JSON.stringify(snapshot.devisen.stand)},`,
        '    "jeEuro": {',
        Object.entries(snapshot.devisen.jeEuro)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([waehrung, kurs]) => `      ${JSON.stringify(waehrung)}: ${kurs}`)
          .join(',\n'),
        '    }',
        '  }',
      ]
    : null

  return [
    '{',
    `  "fetchedAt": ${JSON.stringify(snapshot.fetchedAt)},`,
    '  "instruments": {',
    eintraege.join(',\n'),
    devisen ? '  },' : '  }',
    ...(devisen ?? []),
    '}',
    '',
  ].join('\n')
}

/**
 * Prüft eine frisch abgerufene Reihe auf Plausibilität.
 *
 * Der Abruf läuft ohne Aufsicht. Ein Anbieter, der plötzlich Kurse in einer
 * anderen Einheit liefert – Cent statt Euro, ein verrutschtes Dezimalzeichen –,
 * würde sonst still eine falsche Zahl auf die Startseite schreiben. Eine
 * Momentaufnahme, die diese Prüfung nicht besteht, wird verworfen; der
 * bisherige Stand bleibt stehen.
 *
 * @param bisher Die zuletzt gespeicherte Reihe, falls vorhanden.
 * @returns Liste der Beanstandungen. Leer heißt: übernehmen.
 */
export function checkPoints(
  points: readonly SnapshotPoint[],
  bisher?: readonly SnapshotPoint[]
): string[] {
  const probleme: string[] = []

  if (points.length < 2) {
    probleme.push(`nur ${points.length} Werte – zu wenig für eine Kursreihe`)
    return probleme
  }

  for (const point of points) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(point.d)) {
      probleme.push(`ungültiges Datum „${point.d}“`)
      break
    }
    if (!Number.isFinite(point.c) || point.c <= 0) {
      probleme.push(`unbrauchbarer Kurs am ${point.d}: ${point.c}`)
      break
    }
  }

  /*
    Sprung gegen den zuletzt gespeicherten Wert.

    Die Schwelle liegt bei 35 Prozent. Das ist bewusst weit: Ein Wochenende mit
    einem Kurssturz soll durchgehen, ein um den Faktor zehn verrutschtes
    Dezimalzeichen nicht. Nach einer längeren Pause – Feiertage, ein Ausfall des
    Workflows – kann echte Bewegung diese Schwelle reißen; dann meldet sich der
    Workflow, und jemand sieht nach. Das ist der gewollte Ausgang.
  */
  const letzterAlt = bisher?.[bisher.length - 1]
  const letzterNeu = points[points.length - 1]
  if (letzterAlt && letzterAlt.c > 0) {
    const abweichung = Math.abs(letzterNeu.c - letzterAlt.c) / letzterAlt.c
    if (abweichung > 0.35) {
      probleme.push(
        `Sprung von ${letzterAlt.c} (${letzterAlt.d}) auf ${letzterNeu.c} (${letzterNeu.d}) – ${Math.round(abweichung * 100)} Prozent`
      )
    }
  }

  return probleme
}
