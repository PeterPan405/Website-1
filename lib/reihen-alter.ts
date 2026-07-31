/**
 * Wie alt der **Inhalt** einer Momentaufnahme sein darf – nicht ihr Abruf.
 *
 * ## Warum es das gibt
 *
 * Am 31. Juli 2026 stand auf der Website „Inflation 1,9 Prozent, Stand
 * Dezember 2025“. Der Abruf lief jeden Mittwoch, meldete Statuscode 200, holte
 * Werte und schrieb sie weg. Nichts war kaputt. Nur hatte Eurostat den
 * harmonisierten Verbraucherpreisindex zum 4. Februar 2026 methodisch
 * umgestellt, und die EZB hatte den alten Datensatz `ICP` am selben Tag
 * eingestellt – eingestellt, nicht abgeschaltet. Er antwortete weiter, die
 * Reihe endete nur im Dezember.
 *
 * Die bestehende Frischeprüfung sah das nicht, weil sie `abgerufenAm` misst:
 * wann zuletzt jemand gefragt hat. Gefragt wurde stündlich. Geantwortet wurde
 * mit einer sieben Monate alten Zahl.
 *
 * **Der Abruf kann tadellos sein und der Wert trotzdem tot.** Deshalb misst
 * diese Prüfung den jüngsten Wert *in* der Datei.
 *
 * ## Warum die Grenzen so weit sind
 *
 * Weil eine Prüfung, die grundlos anschlägt, abgeschaltet wird. Die Grenze
 * fragt nicht „ist der Wert von heute?“, sondern „ist diese Reihe erkennbar
 * tot?“. Ein Feiertag, ein Wochenende, eine verspätete Veröffentlichung
 * dürfen keinen roten Lauf erzeugen – sieben Monate schon.
 *
 * Als Faustregel: **das Doppelte des Veröffentlichungstakts, mindestens aber
 * eine Woche Luft.** Der HVPI erscheint monatlich mit zwei bis sechs Wochen
 * Verzug; 75 Tage lassen jede normale Verspätung durch und fangen den
 * eingestellten Datensatz trotzdem nach zweieinhalb Monaten.
 */

/** Ein Fund: eine Reihe, deren jüngster Wert zu alt ist. */
export interface Alterungsbefund {
  datei: string
  reihe: string
  /** Der jüngste Wert in der Datei, wie er dort steht. */
  stand: string
  alterTage: number
  hoechstalterTage: number
  takt: string
  begruendung: string
}

/** Eine überwachte Reihe. */
export interface Reihengrenze {
  /** Dateiname in `data/snapshots`. */
  datei: string
  reihe: string
  /** Wie oft die Quelle neue Werte liefert – nur zur Erklärung in der Meldung. */
  takt: string
  hoechstalterTage: number
  begruendung: string
  /** Zieht den jüngsten Wert aus dem geladenen Bestand. */
  neuester: (bestand: unknown) => string | null
}

/**
 * Ein Wert aus verschachtelten Objekten, ohne `any`.
 *
 * Gibt `null` zurück, sobald ein Glied der Kette fehlt oder am Ende kein
 * Zeichenkette steht – eine fehlende Reihe ist ein eigener Fall und wird
 * weiter unten gemeldet, nicht hier durch einen Absturz.
 */
export function pfad(wurzel: unknown, ...glieder: string[]): string | null {
  let hier: unknown = wurzel
  for (const glied of glieder) {
    if (typeof hier !== 'object' || hier === null) return null
    hier = (hier as Record<string, unknown>)[glied]
  }
  return typeof hier === 'string' ? hier : null
}

/**
 * Der jüngste Zeitstempel über alle Einträge eines Objekts.
 *
 * Für die Kursdatei: dort steht je Instrument ein eigener Zeitpunkt, und
 * maßgeblich ist der jüngste – ein einzelner Wert, der hängt, ist ein Problem
 * der Börse, nicht der Leitung.
 */
export function juengsterEintrag(
  wurzel: unknown,
  behaelter: string,
  feld: string
): string | null {
  if (typeof wurzel !== 'object' || wurzel === null) return null
  const eintraege = (wurzel as Record<string, unknown>)[behaelter]
  if (typeof eintraege !== 'object' || eintraege === null) return null
  let beste: string | null = null
  for (const wert of Object.values(eintraege as Record<string, unknown>)) {
    if (typeof wert !== 'object' || wert === null) continue
    const stand = (wert as Record<string, unknown>)[feld]
    if (typeof stand !== 'string') continue
    if (beste === null || stand > beste) beste = stand
  }
  return beste
}

/** Der jüngste Punkt einer Reihe, die als Liste vorliegt. */
export function letzterPunkt(
  wurzel: unknown,
  liste: string,
  feld: string
): string | null {
  if (typeof wurzel !== 'object' || wurzel === null) return null
  const punkte = (wurzel as Record<string, unknown>)[liste]
  if (!Array.isArray(punkte) || punkte.length === 0) return null
  const letzter = punkte[punkte.length - 1]
  if (typeof letzter !== 'object' || letzter === null) return null
  const stand = (letzter as Record<string, unknown>)[feld]
  return typeof stand === 'string' ? stand : null
}

/**
 * Alter in Tagen zwischen einem Stand und jetzt.
 *
 * Monatsangaben wie `2026-06` zählen ab dem **Ende** des Monats: Der Juniwert
 * beschreibt den Juni und ist bis zur Juliveröffentlichung der aktuelle. Ab
 * dem Monatsersten zu rechnen machte ihn dreißig Tage künstlich älter und
 * hätte für jede Monatsreihe eine entsprechend weitere Grenze erzwungen.
 *
 * Gibt `null` zurück, wenn sich aus der Angabe kein Datum lesen lässt.
 */
export function alterInTagen(stand: string, jetzt: Date): number | null {
  let zeit: number
  if (/^\d{4}-\d{2}$/.test(stand)) {
    const [jahr, monat] = stand.split('-').map(Number)
    // Tag 0 des Folgemonats ist der letzte Tag dieses Monats.
    zeit = Date.UTC(jahr, monat, 0, 23, 59, 59)
  } else if (/^\d{4}$/.test(stand)) {
    zeit = Date.UTC(Number(stand), 11, 31, 23, 59, 59)
  } else {
    zeit = Date.parse(stand)
  }
  if (!Number.isFinite(zeit)) return null
  return Math.floor((jetzt.getTime() - zeit) / 86_400_000)
}

/**
 * Die überwachten Reihen.
 *
 * Bewusst nur die, bei denen „jüngster Wert“ überhaupt etwas bedeutet.
 * Dividenden und Quartalstermine sind Ereignislisten mit Einträgen in der
 * Zukunft – dort ist das jüngste Datum kein Maß für Aktualität, und eine
 * Grenze darauf wäre eine Zahl ohne Aussage. Für sie bleibt es beim
 * bisherigen Blick auf `abgerufenAm`.
 */
export const REIHENGRENZEN: Reihengrenze[] = [
  {
    datei: 'zinsen.json',
    reihe: 'Leitzins der EZB',
    takt: 'werktäglich',
    hoechstalterTage: 10,
    begruendung:
      'Die Reihe trägt jeden Bankarbeitstag einen Wert, auch wenn der Zins gleich bleibt. ' +
      'Zehn Tage lassen Weihnachten und Ostern durch.',
    neuester: (b) => pfad(b, 'reihen', 'leitzins', 'aktuell', 't'),
  },
  {
    datei: 'zinsen.json',
    reihe: 'Inflation im Euroraum (HVPI)',
    takt: 'monatlich',
    hoechstalterTage: 75,
    begruendung:
      'Eurostat veröffentlicht monatlich mit zwei bis sechs Wochen Verzug. Genau diese ' +
      'Reihe stand im Juli 2026 sieben Monate still, weil der Datensatz ICP eingestellt ' +
      'worden war und trotzdem weiter antwortete.',
    neuester: (b) => pfad(b, 'reihen', 'inflation', 'aktuell', 't'),
  },
  {
    datei: 'zinsen.json',
    reihe: 'Inflation in Deutschland (HVPI)',
    takt: 'monatlich',
    hoechstalterTage: 75,
    begruendung: 'Dieselbe Quelle und derselbe Takt wie der Euroraum.',
    neuester: (b) => pfad(b, 'reihen', 'inflation-de', 'aktuell', 't'),
  },
  {
    datei: 'kurse-aktuell.json',
    reihe: 'Aktienkurse',
    takt: 'halbstündlich',
    hoechstalterTage: 5,
    begruendung:
      'Maßgeblich ist der jüngste Kurs über alle Werte. Fünf Tage überstehen ein langes ' +
      'Wochenende; ein einzelner hängender Wert fällt hier absichtlich nicht auf.',
    neuester: (b) => juengsterEintrag(b, 'latest', 'at'),
  },
  {
    datei: 'markets.json',
    reihe: 'Kursverläufe',
    takt: 'täglich',
    hoechstalterTage: 6,
    begruendung: 'Tagesschlusskurse; das Wochenende plus ein Feiertag sind drin.',
    neuester: (b) => juengsterEintrag(b, 'instruments', 'asOf'),
  },
  {
    datei: 'marktbreite.json',
    reihe: 'Marktbreite',
    takt: 'täglich',
    hoechstalterTage: 6,
    begruendung: 'Wird aus den Kursen fortgeschrieben und teilt deren Takt.',
    neuester: (b) => letzterPunkt(b, 'reihe', 'd'),
  },
]

/**
 * Prüft geladene Bestände gegen die Grenzen.
 *
 * `bestaende` bildet Dateinamen auf den geparsten Inhalt ab. Fehlt eine Datei,
 * wird sie übergangen: Ein leerer Ausgangszustand ist in diesem Projekt ein
 * gültiger Zustand, und ein fehlender Podcast-Feed soll keinen roten Lauf
 * erzeugen. Steht die Datei aber da und die **Reihe darin fehlt**, ist das ein
 * Befund – dann hat sich das Format geändert.
 */
export function pruefeReihenalter(
  bestaende: Map<string, unknown>,
  jetzt: Date = new Date(),
  grenzen: Reihengrenze[] = REIHENGRENZEN
): Alterungsbefund[] {
  const befunde: Alterungsbefund[] = []
  for (const grenze of grenzen) {
    const bestand = bestaende.get(grenze.datei)
    if (bestand === undefined) continue

    const stand = grenze.neuester(bestand)
    if (stand === null) {
      befunde.push({
        datei: grenze.datei,
        reihe: grenze.reihe,
        stand: '—',
        alterTage: Number.POSITIVE_INFINITY,
        hoechstalterTage: grenze.hoechstalterTage,
        takt: grenze.takt,
        begruendung:
          'Die Reihe ist in der Datei nicht zu finden. Das Format der Quelle hat sich ' +
          'geändert, oder der Abruf schreibt unter einem anderen Namen.',
      })
      continue
    }

    const alter = alterInTagen(stand, jetzt)
    if (alter === null) {
      befunde.push({
        datei: grenze.datei,
        reihe: grenze.reihe,
        stand,
        alterTage: Number.POSITIVE_INFINITY,
        hoechstalterTage: grenze.hoechstalterTage,
        takt: grenze.takt,
        begruendung: `Aus „${stand}“ lässt sich kein Datum lesen.`,
      })
      continue
    }

    if (alter > grenze.hoechstalterTage) {
      befunde.push({
        datei: grenze.datei,
        reihe: grenze.reihe,
        stand,
        alterTage: alter,
        hoechstalterTage: grenze.hoechstalterTage,
        takt: grenze.takt,
        begruendung: grenze.begruendung,
      })
    }
  }
  return befunde
}
