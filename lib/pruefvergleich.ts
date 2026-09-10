/**
 * Das Urteil des Nachrichtenlaufs: Darf die Ausgabe hinaus?
 *
 * ## Die Frage, die hier gestellt wird – und die, die es vorher war
 *
 * Bis zum 10. September 2026 lautete die Frage vor dem Veröffentlichen:
 * *Ist irgendwo etwas rot?* Fiel eine von 126 Testdateien, `tsc`, `lint`,
 * der Bau, die Paketprüfung oder die Formatierung, wurde nichts geschrieben –
 * keine Ausgabe, keine Folge.
 *
 * Das hat in sieben Tagen drei Morgen gekostet:
 *
 *     04.09.  ein Test mit festem Stichtag, aus dem Bestand herausgealtert
 *     05.09.  zwei Prüfungen in derselben Datei, die sich widersprachen
 *     10.09.  die Paketprüfung zählte `&amp;` als vier Zeichen
 *
 * Keiner der drei Befunde hatte mit der Ausgabe des Tages zu tun. Zwei
 * standen schon rot, **bevor** sie geschrieben wurde; der dritte betraf sie
 * zwar, aber auf eine Weise, die kein Besucher je gesehen hätte.
 *
 * Der Betreiber hat entschieden: *Es darf nicht mehr vorkommen.*
 *
 * Deshalb lautet die Frage jetzt: **Hat die Ausgabe etwas kaputt gemacht?**
 * Gemessen wird zweimal – einmal vor dem Schreiben, einmal danach – und
 * verglichen wird Befund für Befund. Was schon vorher rot war, ist nicht die
 * Schuld der Ausgabe und hält sie nicht auf. Es wird trotzdem gemeldet, laut,
 * und der Lauf endet deswegen rot – **nach** dem Veröffentlichen.
 *
 * ## Was trotzdem immer blockiert
 *
 * Der Bau. Ein Stand, der nicht baut, kann nicht ausgeliefert werden, gleich
 * seit wann – ihn auf `main` zu schieben nützte nichts und schadete dem
 * nächsten, der bauen will.
 *
 * ## Warum hier nur die Entscheidung steht
 *
 * Dieselbe Bauart wie `lib/tageswecker.ts`: Die Tatsachen sammelt die Shell
 * (`scripts/pruefkette.sh`), das Urteil fällt diese Funktion, und
 * `tests/pruefvergleich.test.ts` legt ihr die drei Morgen von oben vor – jeden
 * so, wie er war, und jeden so, dass sie ihn abweisen **muss**, wenn die
 * Ausgabe wirklich schuld ist.
 */

/** Was eine einzelne Prüfung nach dem Lauf gemeldet hat. */
export interface Pruefergebnis {
  /** Ist die Prüfung durchgelaufen? */
  ok: boolean
  /**
   * Die einzelnen Beanstandungen, sofern die Prüfung welche benennt.
   *
   * `npm test` nennt die gescheiterten Dateien, `npm run pruefen` seine
   * Befunde. `tsc`, `lint`, `build` und `format` nennen nichts Vergleichbares
   * – dort entscheidet allein, ob sie schon vorher rot waren.
   */
  befunde: string[]
}

/** Alle Prüfungen eines Durchgangs, unter ihrem Namen. */
export type Pruefstand = Record<string, Pruefergebnis>

export interface Befund {
  pruefung: string
  text: string
}

export interface Urteil {
  /** Darf die Ausgabe auf `main`? */
  veroeffentlichen: boolean
  /** Was erst mit der Ausgabe rot geworden ist – das hält sie auf. */
  neu: Befund[]
  /** Was schon vorher rot war – wird gemeldet, hält aber nicht auf. */
  vorbestehend: Befund[]
  /** Ein Satz fürs Protokoll, warum so entschieden wurde. */
  grund: string
}

/**
 * Die Prüfungen, die immer bestehen müssen – gleich, ob sie vorher rot waren.
 *
 * Nur der Bau. Alles andere ist eine Aussage über den Code, die Ausgabe
 * ändert nichts daran; der Bau ist die Aussage darüber, ob es eine Website
 * gibt.
 */
export const MUSS_BESTEHEN: readonly string[] = ['build']

export function vergleiche(vorher: Pruefstand, nachher: Pruefstand): Urteil {
  const neu: Befund[] = []
  const vorbestehend: Befund[] = []

  for (const [name, jetzt] of Object.entries(nachher)) {
    if (jetzt.ok) continue
    const davor = vorher[name]

    /*
      Eine Prüfung ohne Einzelbefunde: Ob sie die Schuld der Ausgabe ist, sagt
      allein ihr Zustand davor. War sie schon rot, ist sie vorbestehend. Gibt
      es keinen Vorbefund, gilt sie als neu – im Zweifel streng.
    */
    if (jetzt.befunde.length === 0) {
      if (davor && !davor.ok) {
        vorbestehend.push({ pruefung: name, text: 'war schon vor der Ausgabe rot' })
      } else {
        neu.push({ pruefung: name, text: 'erst mit der Ausgabe rot geworden' })
      }
      continue
    }

    /*
      Mit Einzelbefunden wird jeder für sich verglichen. Ein Befund, der
      wortgleich schon im Vorbefund stand, ist vorbestehend; jeder andere ist
      neu. Fehlt der Vorbefund ganz, ist jeder Befund neu.
    */
    const bekannt = new Set(davor?.befunde ?? [])
    for (const text of jetzt.befunde) {
      ;(bekannt.has(text) ? vorbestehend : neu).push({ pruefung: name, text })
    }
  }

  const bauKaputt = MUSS_BESTEHEN.some((name) => nachher[name] && !nachher[name].ok)

  if (bauKaputt) {
    return {
      veroeffentlichen: false,
      neu,
      vorbestehend,
      grund:
        'der Bau läuft nicht durch – ein Stand, der nicht baut, wird nicht veröffentlicht, gleich seit wann',
    }
  }
  if (neu.length > 0) {
    return {
      veroeffentlichen: false,
      neu,
      vorbestehend,
      grund: `${neu.length} Befund(e) sind erst mit der Ausgabe entstanden – sie hat etwas kaputt gemacht`,
    }
  }
  if (vorbestehend.length > 0) {
    return {
      veroeffentlichen: true,
      neu,
      vorbestehend,
      grund: `alles Rote war schon vor der Ausgabe rot (${vorbestehend.length}) – sie wird veröffentlicht, der Lauf endet trotzdem rot`,
    }
  }
  return { veroeffentlichen: true, neu, vorbestehend, grund: 'alles grün' }
}
