/**
 * Denselben Wert in zwei Zeitfenstern – und was das über Renditeangaben sagt.
 *
 * ## Die Frage
 *
 * „Der Index hat 9 Prozent im Jahr gebracht" klingt nach einer Eigenschaft des
 * Index. Sie ist aber vor allem eine Aussage über den **Startpunkt**: Wer 2020
 * einstieg, sieht eine andere Zahl als wer 2022 einstieg, und beide Zahlen sind
 * richtig gerechnet.
 *
 * Diese Datei rechnet zwei frei gewählte Fenster für dieselbe Reihe und stellt
 * sie nebeneinander. Nicht, um eines zu küren – sondern damit der Abstand
 * sichtbar wird.
 *
 * ## Drei Ehrlichkeiten, die eingebaut sind
 *
 * **Der gewünschte Zeitraum ist nicht der gerechnete.** Wer den 1. Januar
 * angibt, bekommt den ersten Handelstag danach. Steht auf der Seite „1.1. bis
 * 31.12." und gerechnet wurde vom 2.1. bis 30.12., ist das eine kleine Lüge.
 * Deshalb gibt jeder Befund die **tatsächlichen** Eckdaten zurück.
 *
 * **Unter einem Jahr wird nicht hochgerechnet.** Ein Quartal mit 8 Prozent
 * ergibt hochgerechnet 36 Prozent im Jahr – eine Zahl, die niemand je
 * verdient hat und die wie eine Prognose aussieht. `jahresrendite` bleibt
 * darunter `null`.
 *
 * **Ein Fenster ohne Daten ist kein Fenster mit null Prozent.** Es kommt
 * `null` zurück, und die Oberfläche sagt, dass es die Reihe damals noch nicht
 * gab. Null Prozent wäre eine Behauptung über einen Zeitraum, über den nichts
 * bekannt ist.
 *
 * Ohne Importe, damit `tests/` das Modul direkt laden kann.
 */

/** Ein Punkt einer Kursreihe. */
export interface Kurspunkt {
  /** ISO-Datum. */
  t: string
  value: number
}

/** Was in einem Zeitfenster passiert ist. */
export interface Fensterbefund {
  /** Der erste Handelstag im Fenster – nicht das gewünschte Startdatum. */
  von: string
  /** Der letzte Handelstag im Fenster. */
  bis: string
  startwert: number
  endwert: number
  /** Veränderung über das ganze Fenster, in Prozent. */
  rendite: number
  /**
   * Auf ein Jahr gerechnet, in Prozent – oder `null`.
   *
   * `null` bei Fenstern unter `MINDEST_JAHRE`. Siehe dort und im
   * Kopfkommentar: Ein Quartal hochzurechnen erzeugt eine Zahl, die nie
   * jemand verdient hat.
   */
  jahresrendite: number | null
  /** Wie viele Kurspunkte im Fenster liegen. */
  punkte: number
  /** Kurspunkte je Kalendertag – die Auflösung des Fensters. */
  dichte: number
  /**
   * Der tiefste Rückgang vom vorherigen Höchststand, in Prozent – oder `null`.
   *
   * `null`, wenn die Reihe im Fenster zu grob aufgezeichnet ist. Siehe
   * `MINDEST_DICHTE`: Ein Rückgang aus Wochenwerten ist systematisch zu klein,
   * weil die Tiefs zwischen den Punkten liegen.
   */
  maxRueckgang: number | null
}

/** Ein Tag in Millisekunden. */
const TAG_MS = 86_400_000

/** Wie viele Tage ein Jahr im Mittel hat – mit Schaltjahren. */
const JAHR_TAGE = 365.2425

/**
 * Ab welcher Länge auf ein Jahr hochgerechnet wird.
 *
 * ## Warum nicht „mindestens ein Jahr"
 *
 * Weil das den Normalfall ausgeschlossen hätte. Ein Kalenderjahr misst
 * zwischen seinem **ersten und letzten Handelstag** rund 364 Tage – der
 * 2. Januar bis zum 30. Dezember sind 363. Das sind 0,995 Jahre, und mit einer
 * Grenze bei 1,0 hätte kein einziges Kalenderjahr eine Jahresrendite bekommen.
 *
 * Der erste Anlauf hatte genau diese Grenze, und die Prüfung „ein Jahr mit
 * 10 Prozent hat 10 Prozent Jahresrendite" hat sie gefunden.
 *
 * 0,9 Jahre sind 329 Tage. Ein Kalenderjahr liegt mit 364 klar darüber, auch
 * wenn Feiertage es an beiden Enden verkürzen; ein Halbjahr mit 182 Tagen
 * liegt klar darunter. Die Grenze trägt den guten Fall also nicht gerade eben,
 * sondern mit Abstand – das ist der Unterschied zu einer Wette.
 */
const MINDEST_JAHRE = 0.9

/**
 * Ab welcher Auflösung ein Rückgang ausgewiesen wird – Punkte je Kalendertag.
 *
 * ## Warum es diese Grenze braucht
 *
 * Der gespeicherte Kursbestand ist für ältere Jahre ausgedünnt: Der DAX hat
 * 2025 rund 146 Punkte, 2022 bis 2024 je 52 – also Wochenwerte – und 2021 nur
 * 20. Die **Rendite** überlebt das, weil sie nur die beiden Enden braucht.
 * Der **tiefste Rückgang** nicht: Er sucht das Tief zwischen zwei Hochs, und
 * bei Wochenwerten liegt jedes zweite Tief zwischen den Punkten.
 *
 * Ein solcher Wert wäre nicht ungenau, sondern in eine Richtung falsch – immer
 * zu klein. Zwei Zahlen in derselben Spalte, von denen eine aus Tages- und
 * eine aus Wochenwerten stammt, sehen vergleichbar aus und sind es nicht.
 *
 * Tageskurse ergeben rund 0,68 Punkte je Kalendertag (250 Handelstage im
 * Jahr), Wochenkurse 0,14. Die Grenze bei 0,3 hat zu beiden Seiten Abstand –
 * auch ein Jahr mit Lücken bleibt klar darüber.
 */
const MINDEST_DICHTE = 0.3

/**
 * Wie viel des gewünschten Zeitraums die Reihe abdecken muss.
 *
 * ## Der Fall, der das nötig gemacht hat
 *
 * Der gespeicherte Bestand reicht fünf Jahre zurück. Beim DAX beginnt er am
 * 17. August 2021 – und damit deckte das Fenster „2021" nur vom 17. August bis
 * zum 27. Dezember ab. Die Zeile stand mit der Überschrift „2021" da und nannte
 * eine Rendite, die in Wahrheit viereinhalb Monate umfasste.
 *
 * Die tatsächlichen Eckdaten standen darunter, und trotzdem war es falsch: Wer
 * eine Tabelle mit Jahreszahlen liest, liest Jahre. Ein Etikett, das die
 * Fußnote braucht, um nicht zu täuschen, ist ein falsches Etikett.
 *
 * 0,9 lässt Feiertage und ein spätes Jahresende durch und weist ein halbes
 * Jahr ab.
 */
const MINDEST_ABDECKUNG = 0.9

/**
 * Die Punkte innerhalb eines Fensters, Grenzen eingeschlossen.
 *
 * Verglichen wird als Zeichenkette. Bei ISO-Daten ist das dieselbe Ordnung wie
 * bei Zeitstempeln, und es kommt ohne `Date` aus – also ohne die Frage, in
 * welcher Zeitzone der Bau läuft.
 */
export function punkteImFenster(
  reihe: readonly Kurspunkt[],
  von: string,
  bis: string
): Kurspunkt[] {
  if (von > bis) return []
  return reihe.filter((punkt) => punkt.t >= von && punkt.t <= bis)
}

/**
 * Der tiefste Rückgang vom laufenden Höchststand, in Prozent (negativ).
 *
 * Nicht „Hoch minus Tief": Ein Tief **vor** dem Hoch hat niemand erlebt. Es
 * zählt nur, was man verloren hätte, wenn man am schlechtesten Tag eingestiegen
 * wäre – also der größte Abstand zu einem Höchststand, der vorher schon dastand.
 */
export function maxRueckgang(reihe: readonly Kurspunkt[]): number {
  let hoch = -Infinity
  let tiefster = 0

  for (const punkt of reihe) {
    if (punkt.value > hoch) hoch = punkt.value
    if (hoch > 0) {
      const rueckgang = ((punkt.value - hoch) / hoch) * 100
      if (rueckgang < tiefster) tiefster = rueckgang
    }
  }
  return tiefster
}

/**
 * Der Befund für ein Fenster – oder `null`, wenn die Reihe es nicht abdeckt.
 *
 * Zwei Punkte sind das Mindeste: Aus einem einzigen Kurs lässt sich keine
 * Veränderung bilden, und eine Reihe mit einem Punkt ist kein kurzes Fenster,
 * sondern ein leeres.
 */
export function fensterbefund(
  reihe: readonly Kurspunkt[],
  von: string,
  bis: string
): Fensterbefund | null {
  const punkte = punkteImFenster(reihe, von, bis)
  if (punkte.length < 2) return null

  const erster = punkte[0]
  const letzter = punkte[punkte.length - 1]
  if (!(erster.value > 0)) return null

  /*
    Deckt die Reihe das gewünschte Fenster überhaupt ab?

    Ein Fenster „2021", das erst im August beginnt, ist kein kurzes Jahr –
    es ist ein falsch beschriftetes. Siehe `MINDEST_ABDECKUNG`.
  */
  const gewuenscht =
    (Date.parse(`${bis}T00:00:00Z`) - Date.parse(`${von}T00:00:00Z`)) / TAG_MS
  const abgedeckt =
    (Date.parse(`${letzter.t}T00:00:00Z`) - Date.parse(`${erster.t}T00:00:00Z`)) / TAG_MS
  if (gewuenscht > 0 && abgedeckt / gewuenscht < MINDEST_ABDECKUNG) return null

  const rendite = ((letzter.value - erster.value) / erster.value) * 100

  /*
    Die Länge zählt in echten Tagen, nicht in Handelstagen.

    Ein Jahr hat rund 250 Handelstage, aber wie viele genau, hängt an den
    Feiertagen des jeweiligen Landes. Für „auf ein Jahr gerechnet" ist der
    Kalender die richtige Bezugsgröße – gefragt ist, wie lange das Geld
    gearbeitet hat, nicht an wie vielen Tagen die Börse offen war.
  */
  const tage =
    (Date.parse(`${letzter.t}T00:00:00Z`) - Date.parse(`${erster.t}T00:00:00Z`)) / TAG_MS
  const jahre = tage / JAHR_TAGE

  const jahresrendite =
    jahre >= MINDEST_JAHRE
      ? ((letzter.value / erster.value) ** (1 / jahre) - 1) * 100
      : null

  /*
    Die Dichte entscheidet, ob ein Rückgang ausgewiesen wird.

    `tage` kann null sein, wenn beide Punkte auf denselben Tag fallen – dann
    gibt es keine Dichte und auch keinen sinnvollen Rückgang.
  */
  const dichte = tage > 0 ? punkte.length / tage : 0

  return {
    von: erster.t,
    bis: letzter.t,
    startwert: erster.value,
    endwert: letzter.value,
    rendite,
    jahresrendite,
    punkte: punkte.length,
    dichte,
    maxRueckgang: dichte >= MINDEST_DICHTE ? maxRueckgang(punkte) : null,
  }
}

/** Ein benanntes Fenster, wie es auf der Seite steht. */
export interface Fenster {
  /** Wie es heißt, z. B. „2020" oder „letzte zwölf Monate". */
  label: string
  von: string
  bis: string
}

export interface Fenstervergleich {
  fenster: Fenster
  befund: Fensterbefund | null
}

/**
 * Mehrere Fenster für dieselbe Reihe.
 *
 * Fenster ohne Daten bleiben in der Liste – mit `befund: null`. Sie
 * herauszufiltern wäre die bequeme Lösung und die falsche: Dass es einen Wert
 * 2020 noch nicht gab, ist eine Auskunft und keine Lücke.
 */
export function vergleicheFenster(
  reihe: readonly Kurspunkt[],
  fenster: readonly Fenster[]
): Fenstervergleich[] {
  return fenster.map((eines) => ({
    fenster: eines,
    befund: fensterbefund(reihe, eines.von, eines.bis),
  }))
}

/**
 * Der Abstand zwischen bester und schlechtester Jahresrendite – die Aussage.
 *
 * `null`, wenn weniger als zwei Fenster eine Jahresrendite haben: Ein Abstand
 * braucht zwei Zahlen, und einer aus einer einzigen wäre null – was aussähe,
 * als machte der Startpunkt keinen Unterschied.
 */
export function spanneJahresrendite(
  vergleiche: readonly Fenstervergleich[]
): { von: number; bis: number; abstand: number } | null {
  const werte = vergleiche
    .map((eintrag) => eintrag.befund?.jahresrendite)
    .filter((wert): wert is number => typeof wert === 'number')

  if (werte.length < 2) return null

  const kleinste = Math.min(...werte)
  const groesste = Math.max(...werte)
  return { von: kleinste, bis: groesste, abstand: groesste - kleinste }
}

/**
 * Kalenderjahre als Fenster, jüngstes zuerst.
 *
 * `bis` ist bewusst der 31. Dezember und nicht der letzte Handelstag: Welcher
 * das war, weiß die Reihe, und `fensterbefund` gibt ihn zurück. Hier steht die
 * Absicht, dort das Ergebnis.
 */
export function jahresfenster(vonJahr: number, bisJahr: number): Fenster[] {
  const fenster: Fenster[] = []
  for (let jahr = bisJahr; jahr >= vonJahr; jahr--) {
    fenster.push({ label: String(jahr), von: `${jahr}-01-01`, bis: `${jahr}-12-31` })
  }
  return fenster
}
