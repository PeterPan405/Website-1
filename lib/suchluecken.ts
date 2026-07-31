/**
 * Suchanfragen, die nichts gefunden haben.
 *
 * ## Wofür
 *
 * Für die ehrlichste Liste fehlender Inhalte, die zu bekommen ist. Was jemand
 * sucht und nicht findet, ist eine Angabe über eine Lücke – und zwar eine, die
 * von außen kommt statt aus der eigenen Vorstellung davon, was fehlen könnte.
 * Zwei Dutzend vergebliche Suchen nach „Rürup“ sagen mehr als jede Themenliste,
 * die am Schreibtisch entsteht.
 *
 * ## Warum das Protokoll auf dem Gerät bleibt
 *
 * Weil es sonst eine Wanze wäre. Ein Suchfeld nimmt entgegen, was jemand
 * eintippt, und das ist gelegentlich mehr als ein Stichwort. Es unbemerkt
 * fortzuschicken wäre genau das Tracking, das diese Website an keiner Stelle
 * betreibt – dieselbe Entscheidung wie bei Merkliste, Lernfortschritt und
 * Quiz-Ergebnissen.
 *
 * Das Protokoll liegt deshalb im Browser, sichtbar unter `/suche/luecken`, und
 * geht nur weg, wenn jemand es selbst kopiert und schickt. Wer es abschickt,
 * hat es vorher vollständig gelesen; das ist der ganze Punkt.
 *
 * ## Warum nicht jede fehlgeschlagene Suche gezählt wird
 *
 * Weil beim Tippen jede Vorsilbe eine fehlgeschlagene Suche ist. Wer „nestle“
 * eingibt, erzeugt unterwegs „n“, „ne“, „nes“, „nest“ und „nestl“ – und findet
 * dann. Ein Protokoll, das alles mitschreibt, besteht zu neun Zehnteln aus
 * Bruchstücken und ist unlesbar.
 *
 * Dagegen hilft zweierlei, und beides steckt hier:
 *
 * 1. **Mindestlänge.** Unter drei Zeichen wird nichts aufgenommen.
 * 2. **Nachträgliches Aufräumen.** Findet eine spätere, längere Eingabe etwas,
 *    verschwinden ihre bereits protokollierten Vorsilben wieder
 *    (`entferneVorsilben`). Aus „nes“, „nest“, „nestl“ + Treffer bei „nestle“
 *    wird: nichts. Aus „rürup“ ohne Treffer wird: ein Eintrag.
 *
 * Der Rest – nicht bei jedem Tastendruck aufzeichnen – ist Sache der
 * Oberfläche und steht in `SuchprotokollSpeicher`.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 */

export interface Suchluecke {
  /** Die vereinheitlichte Anfrage – kleingeschrieben, Leerraum zusammengefasst. */
  anfrage: string
  /** Wie oft sie erfolglos gesucht wurde. */
  anzahl: number
  /** Wann zuletzt, als ISO-Zeitstempel. */
  zuletzt: string
}

/**
 * Kürzeste Eingabe, die aufgezeichnet wird.
 *
 * Zwei Zeichen sind fast immer ein Tippzwischenstand. Drei sind die Grenze, ab
 * der eine Eingabe gemeint sein kann – „ETF“, „AGB“, „BIP“.
 */
export const MINDESTLAENGE = 3

/**
 * Längste Eingabe, die aufgezeichnet wird.
 *
 * Wer einen ganzen Absatz in ein Suchfeld kopiert, hat sich vertan – und was
 * dabei im Protokoll landete, wäre der Fall, in dem versehentlich etwas
 * Persönliches darin stünde. Achtzig Zeichen decken jede echte Suchanfrage ab.
 */
export const HOECHSTLAENGE = 80

/**
 * Wie viele verschiedene Anfragen aufbewahrt werden.
 *
 * Beim Überschreiten fällt die seltenste und älteste heraus. Eine Liste, die
 * unbegrenzt wächst, ist keine Liste mehr, sondern ein Speicherleck mit
 * Aussagekraft null.
 */
export const HOECHSTZAHL = 60

/** Nach wie vielen Tagen ein Eintrag verfällt. */
export const HALTBARKEIT_TAGE = 180

/**
 * Vereinheitlicht eine Anfrage für den Vergleich.
 *
 * Bewusst **nicht** dieselbe Normalisierung wie in `lib/search-match.ts`: Die
 * schreibt Umlaute aus und entfernt Akzente, weil sie Treffer finden soll. Hier
 * geht es darum, die Lücke lesbar zu machen – aus „Rürup“ soll im Protokoll
 * „rürup“ werden und nicht „ruerup“, sonst rät später jemand, was gemeint war.
 */
export function vereinheitliche(anfrage: string): string {
  return anfrage.trim().replace(/\s+/g, ' ').toLowerCase()
}

/** Ob eine Anfrage überhaupt aufgezeichnet werden darf. */
export function aufzeichenswert(anfrage: string): boolean {
  const rein = vereinheitliche(anfrage)
  return rein.length >= MINDESTLAENGE && rein.length <= HOECHSTLAENGE
}

/**
 * Ordnet das Protokoll: häufigste zuerst, bei Gleichstand die jüngere.
 *
 * Die Reihenfolge ist zugleich die Rangfolge beim Aussortieren – was hier unten
 * steht, fällt beim Überschreiten der Höchstzahl heraus.
 */
function sortiert(eintraege: readonly Suchluecke[]): Suchluecke[] {
  return [...eintraege].sort(
    (a, b) => b.anzahl - a.anzahl || b.zuletzt.localeCompare(a.zuletzt)
  )
}

/**
 * Nimmt eine erfolglose Anfrage auf.
 *
 * Gibt das Protokoll unverändert zurück, wenn die Anfrage nicht aufgezeichnet
 * werden darf – Aufrufer müssen nicht selbst prüfen.
 */
export function zaehle(
  protokoll: readonly Suchluecke[],
  anfrage: string,
  jetzt = new Date()
): Suchluecke[] {
  if (!aufzeichenswert(anfrage)) return [...protokoll]

  const rein = vereinheitliche(anfrage)
  const zeitpunkt = jetzt.toISOString()
  const vorhanden = protokoll.find((eintrag) => eintrag.anfrage === rein)

  const naechste = vorhanden
    ? protokoll.map((eintrag) =>
        eintrag.anfrage === rein
          ? { ...eintrag, anzahl: eintrag.anzahl + 1, zuletzt: zeitpunkt }
          : eintrag
      )
    : [...protokoll, { anfrage: rein, anzahl: 1, zuletzt: zeitpunkt }]

  return sortiert(naechste).slice(0, HOECHSTZAHL)
}

/**
 * Entfernt Vorsilben einer Anfrage, die inzwischen etwas gefunden hat.
 *
 * Der Grund steht im Modulkopf: Beim Tippen von „nestle“ entstehen unterwegs
 * erfolglose Anfragen, die keine Lücke sind, sondern ein Zwischenstand. Sobald
 * die vollständige Eingabe trifft, gehören sie weg.
 *
 * Entfernt wird nur, was **echte** Vorsilbe ist – „nest“ bei „nestle“, aber
 * nicht „nestle“ selbst und nicht „test“. Damit bleibt eine Anfrage, die für
 * sich genommen nichts fand und zufällig kürzer ist, unangetastet, solange sie
 * kein Anfangsstück ist.
 */
export function entferneVorsilben(
  protokoll: readonly Suchluecke[],
  erfolgreich: string
): Suchluecke[] {
  const rein = vereinheitliche(erfolgreich)
  if (rein === '') return [...protokoll]
  return protokoll.filter(
    (eintrag) =>
      !(rein.startsWith(eintrag.anfrage) && eintrag.anfrage.length < rein.length)
  )
}

/**
 * Wirft Einträge weg, die älter sind als die Haltbarkeit.
 *
 * Eine Lücke, nach der seit einem halben Jahr niemand mehr gesucht hat, ist
 * entweder geschlossen oder war nie eine. Sie weiter mitzuzählen verzerrt die
 * Rangfolge zugunsten von etwas, das einmal aktuell war.
 */
export function raeumeAuf(
  protokoll: readonly Suchluecke[],
  jetzt = new Date()
): Suchluecke[] {
  const grenze = jetzt.getTime() - HALTBARKEIT_TAGE * 86_400_000
  return sortiert(
    protokoll.filter((eintrag) => {
      const zeit = Date.parse(eintrag.zuletzt)
      return Number.isFinite(zeit) && zeit >= grenze
    })
  )
}

/**
 * Das Protokoll als Text zum Kopieren.
 *
 * Bewusst schlicht und vollständig lesbar: Wer es abschickt, soll vorher sehen
 * können, was darin steht – Zeile für Zeile, ohne Kennungen, ohne alles, was
 * sich auf ein Gerät zurückführen ließe. Ein JSON mit Zeitstempeln wäre
 * maschinenfreundlicher und für den Menschen davor undurchsichtiger.
 */
export function alsText(protokoll: readonly Suchluecke[]): string {
  if (protokoll.length === 0) return ''
  return sortiert(protokoll)
    .map((eintrag) => `${String(eintrag.anzahl).padStart(3, ' ')}× ${eintrag.anfrage}`)
    .join('\n')
}

/**
 * Wie oft insgesamt erfolglos gesucht wurde.
 *
 * Nicht dasselbe wie die Anzahl der Einträge, und der Unterschied ist die
 * eigentliche Auskunft: fünfzehn Einträge mit je einem Treffer sind Rauschen,
 * drei Einträge mit je zwanzig sind eine Lücke.
 */
export function gesamtzahl(protokoll: readonly Suchluecke[]): number {
  return protokoll.reduce((summe, eintrag) => summe + eintrag.anzahl, 0)
}
