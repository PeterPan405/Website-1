/**
 * Werte, die zu einem bekannten Termin veralten.
 *
 * ## Warum es dieses Verzeichnis gibt
 *
 * Auf dieser Website stehen drei Arten von Zahlen. Die erste kommt aus einer
 * Momentaufnahme und ist so frisch wie der letzte Abruf. Die zweite ist
 * abgeleitet und stimmt, solange die Rechnung stimmt. Die dritte steht als
 * Literal im Quelltext, weil sie aus einem Gesetz oder einer Bekanntmachung
 * stammt – und **die ist die gefährliche**: Sie ist heute richtig, wird zu
 * einem vorhersehbaren Termin falsch, und niemand merkt es.
 *
 * Der Basiszins für die Vorabpauschale ist das Musterbeispiel. Das
 * Bundesfinanzministerium gibt ihn jeden Januar neu bekannt. Bis dahin rechnet
 * der Steuerrechner mit dem Wert des Vorjahres weiter, der Build ist grün,
 * jede Prüfung ist grün, und das Ergebnis ist trotzdem falsch.
 *
 * Hier steht deshalb zu jedem solchen Wert, **für welches Jahr** er gilt und
 * **wo er herkommt**. `scripts/frische-pruefen.ts` hält das gegen das laufende
 * Jahr und meldet, was nachzutragen ist.
 *
 * ## Was hier nicht hineingehört
 *
 * Werte ohne Verfallsdatum. Der Abgeltungsteuersatz von 25 Prozent steht seit
 * 2009 im Gesetz, der Solidaritätszuschlag von 5,5 Prozent darauf ebenso. Sie
 * können sich ändern, aber nicht zu einem Termin, den man vorher kennt – bei
 * ihnen hilft kein Kalender, sondern nur Lesen.
 *
 * Und: **Bewusste Annahmen gehören auch nicht hierher.** Die 2,5 Prozent
 * Inflation im Lernthema sind keine veraltete Zahl, sondern eine gerundete
 * Annahme über dreißig Jahre; das steht in `lib/inflations-beispiele.ts` so
 * begründet. Eine aktuelle Rate wäre dort einen Monat lang richtig.
 */

export type Turnus = 'jaehrlich' | 'unbestimmt'

export interface Stichtagswert {
  /** Kennung, unter der das Prüfskript den Wert meldet. */
  id: string
  bezeichnung: string
  wert: number
  einheit: 'prozent' | 'euro'
  /** Das Jahr, für das dieser Wert bekanntgegeben wurde. */
  gilt: number
  /**
   * Wie oft er neu gesetzt wird.
   *
   * `jaehrlich` heißt: Ab Januar des Folgejahres ist der hier stehende Wert
   * überholt, und das Prüfskript sagt es. `unbestimmt` heißt: Er kann sich
   * ändern, aber nicht planbar – dann meldet die Prüfung nichts und es hilft
   * nur, die Quelle im Auge zu behalten.
   */
  turnus: Turnus
  quelle: { label: string; url: string }
  /** Wo der neue Wert zu finden ist, wenn dieser abgelaufen ist. */
  pflege: string
}

export const stichtagswerte: readonly Stichtagswert[] = [
  {
    id: 'basiszins',
    bezeichnung: 'Basiszins für die Vorabpauschale',
    wert: 2.53,
    einheit: 'prozent',
    gilt: 2025,
    turnus: 'jaehrlich',
    quelle: {
      label: 'Bundesfinanzministerium, Basiszins nach § 18 Absatz 4 InvStG',
      url: 'https://www.bundesfinanzministerium.de/',
    },
    pflege:
      'Das BMF veröffentlicht den Zins jeweils im Januar im Bundessteuerblatt. ' +
      'Er leitet sich aus der Rendite langfristiger deutscher Staatsanleihen zum ' +
      'ersten Börsentag des Jahres ab.',
  },
  {
    id: 'sparerpauschbetrag',
    bezeichnung: 'Sparerpauschbetrag je Person',
    wert: 1000,
    einheit: 'euro',
    gilt: 2023,
    /*
      Kein jährlicher Turnus: Der Betrag steht im Gesetz und wurde zuletzt 2023
      von 801 auf 1.000 Euro angehoben. Er läuft nicht ab – er ändert sich,
      wenn der Gesetzgeber ihn ändert, und das kündigt kein Kalender an.
    */
    turnus: 'unbestimmt',
    quelle: {
      label: '§ 20 Absatz 9 Einkommensteuergesetz',
      url: 'https://www.gesetze-im-internet.de/estg/__20.html',
    },
    pflege:
      'Ändert sich nur durch Gesetzesänderung. Der doppelte Betrag gilt für ' +
      'Zusammenveranlagte und wird daraus abgeleitet, nicht getrennt geführt.',
  },
]

/** Ein Wert über seine Kennung, oder `undefined`. */
export function stichtagswert(id: string): Stichtagswert | undefined {
  return stichtagswerte.find((eintrag) => eintrag.id === id)
}
