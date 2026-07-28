/**
 * Datenmodell für den Börsenkalender.
 *
 * ## Was hier hineingehört – und was nicht
 *
 * Nur Termine, die **im Voraus feststehen und veröffentlicht sind**. Notenbanken
 * geben ihre Sitzungstermine ein Jahr im Voraus bekannt, Börsen ihre
 * Feiertage, Verfallstage folgen einer festen Regel, Wahltermine stehen im
 * Gesetz. All das lässt sich nachschlagen und belegen.
 *
 * Was nicht hineingehört: erwartete Termine. Wann genau ein einzelnes
 * Unternehmen seine Quartalszahlen vorlegt, kündigt es selbst wenige Wochen
 * vorher an – für fünfhundert Unternehmen ein Jahr im Voraus ist das schlicht
 * nicht bekannt. Für die Berichtssaison stehen deshalb **Zeitfenster** im
 * Kalender, und einzelne Termine nur dort, wo sie bestätigt sind. Ein Kalender,
 * der geratene Daten wie Fakten ausweist, ist schlimmer als einer mit Lücken:
 * Wer danach plant, verpasst den echten Termin.
 *
 * ## Warum jeder Eintrag eine Bedeutung braucht
 *
 * `bedeutung` ist Pflicht, nicht optional. Ein Datum allein hilft niemandem –
 * dieselbe Überlegung wie bei `whyItMatters` in den Tagesausgaben. Wer liest,
 * dass am 17. Dezember die EZB tagt, soll auch erfahren, was daran für sein
 * Tagesgeld hängt.
 */

export type TerminArt =
  /** Zinsentscheid oder geldpolitische Sitzung. */
  | 'notenbank'
  /** Handelsfreier Tag oder verkürzter Handel. */
  | 'boersenfeiertag'
  /** Wahl mit Wirkung auf die Märkte. */
  | 'wahl'
  /** Zeitfenster einer Berichtssaison oder ein bestätigter Einzeltermin. */
  | 'berichtssaison'
  /** Verfallstag von Terminkontrakten und Optionen. */
  | 'verfallstag'
  /** Konjunkturdaten mit fest angekündigtem Veröffentlichungstermin. */
  | 'konjunktur'

export interface TerminArtMeta {
  label: string
  /** Ein Satz, was diese Art von Termin überhaupt ist. */
  erklaerung: string
}

export const terminArtMeta: Record<TerminArt, TerminArtMeta> = {
  notenbank: {
    label: 'Notenbanken',
    erklaerung:
      'Zinsentscheide von EZB und Fed. Die Termine stehen ein Jahr im Voraus fest; was entschieden wird, nicht.',
  },
  berichtssaison: {
    label: 'Berichtssaison',
    erklaerung:
      'Wann die Unternehmen ihre Quartalszahlen vorlegen. Meist als Zeitfenster – den genauen Tag kündigt jedes Unternehmen selbst wenige Wochen vorher an.',
  },
  verfallstag: {
    label: 'Verfallstage',
    erklaerung:
      'An diesen Tagen laufen Terminkontrakte und Optionen aus. Der Handel ist dann oft unruhiger, ohne dass sich an den Unternehmen etwas geändert hätte.',
  },
  boersenfeiertag: {
    label: 'Börsenfeiertage',
    erklaerung:
      'Tage ohne oder mit verkürztem Handel. Wichtig für Order, die an einem bestimmten Tag ausgeführt werden sollen.',
  },
  wahl: {
    label: 'Wahlen',
    erklaerung:
      'Abstimmungen, deren Ausgang die Wirtschaftspolitik verändern kann – und die deshalb vorher schon in den Kursen stecken.',
  },
  konjunktur: {
    label: 'Konjunkturdaten',
    erklaerung:
      'Fest angekündigte Veröffentlichungen wie Inflationsraten oder Stimmungsindizes.',
  },
}

/** Reihenfolge der Filterschalter – nach Bedeutung, nicht alphabetisch. */
export const terminArtReihenfolge: TerminArt[] = [
  'notenbank',
  'berichtssaison',
  'verfallstag',
  'boersenfeiertag',
  'wahl',
  'konjunktur',
]

export interface Termin {
  /** Beginn im Format `JJJJ-MM-TT`. */
  datum: string
  /** Ende eines Zeitraums, sonst offen. Einschließlich. */
  bis?: string
  titel: string
  art: TerminArt
  /** Land oder Handelsplatz, z. B. „Deutschland“ oder „USA“. */
  ort?: string
  /** Uhrzeit in deutscher Zeit, wenn sie feststeht. */
  uhrzeit?: string
  /**
   * Was der Termin für Anlegerinnen und Anleger bedeutet.
   *
   * Pflichtfeld. Der eigentliche Zweck dieses Kalenders ist nicht, Daten
   * aufzulisten, sondern sie einzuordnen.
   */
  bedeutung: string
  /** Slugs verwandter Lernthemen. */
  themen?: string[]
  /** Symbole betroffener Kurse. */
  symbole?: string[]
  /**
   * Gesetzt, wenn der Termin abgeleitet ist statt bekannt gegeben.
   *
   * Alles andere in diesem Kalender steht fest: Ein Zinsentscheid ist ein
   * Jahr vorher terminiert, ein Verfallstag folgt einer Regel, ein Wahltermin
   * steht im Gesetz. Die erwarteten Quartalszahlen-Termine sind dagegen aus
   * dem bisherigen Meldemuster eines Unternehmens hochgerechnet.
   *
   * Der Unterschied gehört sichtbar gemacht. Ein geschätzter Termin, der
   * aussieht wie ein feststehender, ist schlechter als gar keiner – wer
   * danach handelt, verlässt sich auf eine Hochrechnung, ohne es zu wissen.
   */
  geschaetzt?: {
    /** Der tatsächliche Termin des Vorjahres, aus dem hochgerechnet wurde. */
    basis: string
    /** Wie weit das Muster bisher gestreut hat, in Tagen. */
    streuungTage: number
  }
  quelle: { label: string; url: string }
}
