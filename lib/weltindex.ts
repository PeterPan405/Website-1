import { WELTINDEX_GROESSTE, WELTINDEX_LAENDER, type Landgewicht } from '@/data/weltindex'

/**
 * Was „weltweit gestreut" an Währungen bedeutet.
 *
 * ## Die Frage
 *
 * Ein Weltdepot klingt nach Ausgewogenheit. Tatsächlich notiert der größte
 * Teil in **einer** Währung, und wer den Anteil nicht kennt, hält eine
 * Währungswette, die er nie eingegangen ist. Das ist kein Einwand gegen das
 * Weltdepot – es ist eine Eigenschaft, die man kennen sollte, bevor man sie
 * zufällig entdeckt.
 *
 * ## Land ist nicht gleich Währung, und das steht dabei
 *
 * Gerechnet wird aus den **Ländergewichten** des Factsheets. Für die vier
 * genannten Einzelländer ist die Zuordnung eindeutig: Amerikanische Aktien
 * notieren in Dollar, japanische in Yen. Für die Sammelposition „Übrige" gilt
 * das nicht – dahinter stecken ein Dutzend Länder mit mindestens sechs
 * Währungen, und das Blatt schlüsselt sie nicht auf.
 *
 * Sie bleibt deshalb als eigene Position stehen, statt auf die Währungen
 * verteilt zu werden. Eine geschätzte Aufteilung wäre auf **dieser** Seite
 * besonders verkehrt: Sie handelt davon, dass man Währungsanteile kennen
 * sollte.
 *
 * ## Und Notierungswährung ist nicht gleich Währungsrisiko
 *
 * Ein Schweizer Konzern notiert in Franken und verdient sein Geld in Dollar;
 * ein amerikanischer Zulieferer notiert in Dollar und verkauft nach Asien. Die
 * Notierungswährung ist die, in der der Kurs steht – und damit die, deren
 * Schwankung im Depot ankommt. Die tiefere Frage beantwortet sie nicht, und
 * das gehört danebengeschrieben statt in eine Fußnote.
 */

/** Ein Währungsanteil, aus den Ländergewichten zusammengefasst. */
export interface Waehrungsanteil {
  waehrung: string | null
  /** Wie er auf der Seite heißt. */
  bezeichnung: string
  prozent: number
  /** Aus welchen Ländern er sich zusammensetzt. */
  laender: string[]
}

/**
 * Die Ländergewichte zu Währungsanteilen zusammengefasst.
 *
 * Länder mit derselben Währung werden addiert – im heutigen Blatt betrifft das
 * niemanden, weil von den Einzelländern nur Frankreich im Euroraum liegt. Die
 * Summierung steht trotzdem da: Sobald Deutschland oder die Niederlande in die
 * Top 5 rutschen, muss die Zahl stimmen, ohne dass jemand daran denkt.
 */
export function waehrungsanteile(
  laender: readonly Landgewicht[] = WELTINDEX_LAENDER
): Waehrungsanteil[] {
  const summe = new Map<string, { prozent: number; laender: string[] }>()
  let unbekannt = 0
  const unbekannteLaender: string[] = []

  for (const eintrag of laender) {
    if (eintrag.waehrung === null) {
      unbekannt += eintrag.prozent
      unbekannteLaender.push(eintrag.land)
      continue
    }
    const bisher = summe.get(eintrag.waehrung) ?? { prozent: 0, laender: [] }
    bisher.prozent += eintrag.prozent
    bisher.laender.push(eintrag.land)
    summe.set(eintrag.waehrung, bisher)
  }

  const anteile: Waehrungsanteil[] = [...summe.entries()]
    .map(([waehrung, eintrag]) => ({
      waehrung,
      bezeichnung: waehrung,
      prozent: eintrag.prozent,
      laender: eintrag.laender,
    }))
    .sort((a, b) => b.prozent - a.prozent)

  /*
    Die Sammelposition steht immer zuletzt – auch wenn sie größer ist als
    einzelne Währungen. Sie ist keine Währung, und sie zwischen zwei Währungen
    zu sortieren ließe sie wie eine aussehen.
  */
  if (unbekannt > 0) {
    anteile.push({
      waehrung: null,
      bezeichnung: 'Nicht aufgeschlüsselt',
      prozent: unbekannt,
      laender: unbekannteLaender,
    })
  }

  return anteile
}

/** Der Dollaranteil – die Zahl, um die es geht. */
export function dollaranteil(
  laender: readonly Landgewicht[] = WELTINDEX_LAENDER
): number {
  return laender
    .filter((l) => l.waehrung === 'USD')
    .reduce((summe, l) => summe + l.prozent, 0)
}

/**
 * Was die größten Einzelwerte zusammen wiegen.
 *
 * Die zweite Hälfte der Aussage: Nicht nur die Währung ist einseitig, auch die
 * Einzelwerte sind es. Zwei Unternehmen wiegen zusammen mehr als ganz Japan –
 * und das steht in demselben Blatt.
 */
export function gewichtGroesste(): number {
  return WELTINDEX_GROESSTE.reduce((summe, e) => summe + e.prozent, 0)
}
