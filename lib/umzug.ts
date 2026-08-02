/**
 * Die Umzugsdatei: alle Browser-Bestände in einer Datei, ohne Konto.
 *
 * ## Warum es sie gibt
 *
 * Alles, was diese Website sich merkt, liegt im localStorage des einen
 * Browsers – das ist das Datenschutzversprechen, und es hat einen ehrlichen
 * Preis: Am zweiten Gerät fängt alles bei null an, und wer Browserdaten
 * löscht, löscht seinen Stand mit. Die Antwort darauf ist **kein Konto**
 * (siehe die Begründung am Merkaustausch), sondern eine Datei: hier
 * herunterladen, am anderen Gerät einlesen. Kein Byte läuft über einen
 * Server, außer der Mensch schickt die Datei selbst irgendwohin – und dann
 * weiß er es.
 *
 * ## Warum die Werte roh bleiben
 *
 * Die Datei speichert jeden Bestand als die Zeichenkette, die im Speicher
 * steht – sie wird nicht verstanden, nur getragen. Damit muss dieser Code
 * die Schemata der zehn Bestände nicht kennen und veraltet nicht, wenn
 * eines davon ein Feld dazubekommt. Geprüft wird beim Einlesen nur, dass
 * die Datei echt ist (Kennung, Fassung) und nur bekannte Schlüssel trägt.
 *
 * ## Warum Einlesen ersetzt statt ergänzt
 *
 * Der Merkcode ergänzt, weil zwei Merklisten zusammenzuführen der übliche
 * Anlass ist. Ein Umzug ist das Gegenteil: „Dieses Gerät soll aussehen wie
 * das alte." Zehn verschiedene Schemata generisch zu verschmelzen wäre
 * geraten – ersetzt wird deshalb je Bestand, und nur die Bestände, die in
 * der Datei stehen; alles andere bleibt unangetastet.
 */

export const UMZUG_KENNUNG = 'im-invests-umzug'
export const UMZUG_FASSUNG = 1

/**
 * Was mit umzieht. Ein Eintrag je Bestand, mit lesbarem Namen für die
 * Anzeige beim Einlesen.
 *
 * `fk-suchluecken` fehlt mit Absicht: Das Protokoll erfolgloser Suchen ist
 * eine Notiz über dieses Gerät, kein Stand, den jemand mitnehmen will.
 */
export const BESTAENDE = [
  { schluessel: 'fk-learn-progress', name: 'Lernfortschritt' },
  { schluessel: 'fk-quiz-results', name: 'Quiz-Bestleistungen' },
  { schluessel: 'fk-wiederholung-1', name: 'Wiederholungskarten' },
  { schluessel: 'fk-glossar-karten-1', name: 'Glossar-Karteikasten' },
  { schluessel: 'fk-merkliste', name: 'Merkliste' },
  { schluessel: 'fk-vermoegen', name: 'Vermögensübersicht' },
  { schluessel: 'fk-urkunde-name', name: 'Name auf Urkunden' },
  { schluessel: 'fk-theme', name: 'Farbschema' },
  { schluessel: 'fk-sprache', name: 'Sprache' },
  { schluessel: 'fk-vorlesen-stimme-2', name: 'Vorlesestimme' },
] as const

export interface Umzugsdatei {
  kennung: typeof UMZUG_KENNUNG
  fassung: typeof UMZUG_FASSUNG
  erstellt: string
  /** Schlüssel auf rohen Speicherinhalt. */
  bestaende: Record<string, string>
}

/** Baut die Datei aus einer Lesefunktion – im Browser `localStorage.getItem`. */
export function baueUmzug(
  lese: (schluessel: string) => string | null,
  erstellt: string
): Umzugsdatei {
  const bestaende: Record<string, string> = {}
  for (const { schluessel } of BESTAENDE) {
    const wert = lese(schluessel)
    if (wert !== null) bestaende[schluessel] = wert
  }
  return { kennung: UMZUG_KENNUNG, fassung: UMZUG_FASSUNG, erstellt, bestaende }
}

export interface Umzugsinhalt {
  /** Die übernehmbaren Bestände mit lesbarem Namen und Zählung, wo möglich. */
  eintraege: { schluessel: string; name: string; anzahl: number | null }[]
  /** Schlüssel aus der Datei, die hier niemand kennt – werden übersprungen. */
  unbekannt: string[]
  erstellt: string
}

/**
 * Prüft eine eingelesene Datei und beschreibt ihren Inhalt.
 *
 * Gibt entweder den beschriebenen Inhalt samt Beständen zurück oder einen
 * Satz, der sagt, woran es scheitert – nie beides.
 */
export function pruefeUmzug(
  text: string
): { inhalt: Umzugsinhalt; bestaende: Record<string, string> } | { fehler: string } {
  let roh: unknown
  try {
    roh = JSON.parse(text)
  } catch {
    return { fehler: 'Das ist keine lesbare Umzugsdatei (kein gültiges JSON).' }
  }

  if (typeof roh !== 'object' || roh === null) {
    return { fehler: 'Das ist keine Umzugsdatei dieser Website.' }
  }
  const datei = roh as Record<string, unknown>
  if (datei.kennung !== UMZUG_KENNUNG) {
    return { fehler: 'Das ist keine Umzugsdatei dieser Website.' }
  }
  if (datei.fassung !== UMZUG_FASSUNG) {
    return {
      fehler: `Diese Datei stammt aus einer anderen Fassung (${String(datei.fassung)}) – bitte am alten Gerät neu herunterladen.`,
    }
  }
  if (typeof datei.bestaende !== 'object' || datei.bestaende === null) {
    return { fehler: 'Die Datei enthält keine Bestände.' }
  }

  const bekannt = new Map<string, string>(
    BESTAENDE.map((eintrag) => [eintrag.schluessel, eintrag.name])
  )
  const bestaende: Record<string, string> = {}
  const eintraege: Umzugsinhalt['eintraege'] = []
  const unbekannt: string[] = []

  for (const [schluessel, wert] of Object.entries(datei.bestaende)) {
    if (typeof wert !== 'string') continue
    const name = bekannt.get(schluessel)
    if (!name) {
      unbekannt.push(schluessel)
      continue
    }
    bestaende[schluessel] = wert
    eintraege.push({ schluessel, name, anzahl: zaehleEintraege(wert) })
  }

  if (eintraege.length === 0) {
    return { fehler: 'Die Datei enthält keinen übernehmbaren Bestand.' }
  }

  return {
    inhalt: {
      eintraege,
      unbekannt,
      erstellt: typeof datei.erstellt === 'string' ? datei.erstellt : '',
    },
    bestaende,
  }
}

/**
 * Zählt Einträge eines Bestands, wo das ohne Schemawissen geht.
 *
 * Ein Feld (Liste) lässt sich zählen, ein Objekt an seinen Schlüsseln –
 * alles andere (Farbschema, Name) hat keine sinnvolle Anzahl und bekommt
 * `null`, nicht `1`: „1 Eintrag Farbschema“ wäre eine erfundene Präzision.
 */
export function zaehleEintraege(wert: string): number | null {
  try {
    const daten: unknown = JSON.parse(wert)
    if (Array.isArray(daten)) return daten.length
    if (typeof daten === 'object' && daten !== null) return Object.keys(daten).length
    return null
  } catch {
    return null
  }
}
