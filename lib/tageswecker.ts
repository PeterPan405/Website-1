/**
 * Der Wecker für die Tagesausgabe.
 *
 * ## Warum es ihn gibt
 *
 * Am 27. und 28. August 2026 ist die Nachrichtenkette zweimal hintereinander
 * nicht angelaufen, und beide Male aus demselben Grund: GitHub hat die
 * geplanten Läufe der Nacht verworfen. Am 28. August blieb von `kurse.yml` –
 * einem Workflow mit einem Termin **alle fünf Minuten** – zwischen 00:00 und
 * 04:20 UTC genau ein einziger Lauf übrig. `quellen-pruefen.yml` (00:03 UTC)
 * lief gar nicht, der Wächter (03:11 UTC) auch nicht.
 *
 * Die Regel dazu steht seit langem in `AGENTS.md`: *Was zu einer bestimmten
 * Zeit passiert sein muss, darf nicht an `schedule` hängen.* Nur hing bisher
 * jeder Einstieg in den Tag genau daran.
 *
 * ## Woran es stattdessen hängt
 *
 * In derselben Nacht lief eine Sache durchgehend: der Kurs-Dauerlauf. Er ist
 * **ein einziger Job**, fünfeinhalb Stunden lang, der sich alle zwei Minuten
 * selbst weiterdreht und am Ende seinen Nachfolger startet. Ein laufender
 * Prozess kann nicht verworfen werden – er läuft ja schon.
 *
 * Dieser Wecker hängt deshalb dort mit drin: Der Dauerlauf fragt in jeder
 * fünften Runde, ob die Ausgabe des Tages schon auf `main` steht, und stößt
 * die Kette an, wenn sie fehlt.
 *
 * ## Was hier drinsteht und was nicht
 *
 * Hier steht **nur die Entscheidung**, als reine Funktion – damit sie prüfbar
 * ist. Ein Riegel, der nie zuschlägt, sieht aus wie Ruhe; deshalb liegt in
 * `tests/tageswecker.test.ts` zu jeder einzelnen Bedingung ein Fall, den sie
 * abweisen **muss**, und einer, den sie durchlassen muss.
 *
 * Das Beschaffen der einen Tatsache, die von außen kommt – steht die Ausgabe
 * auf `main`? – macht der Workflow selbst mit `curl`; `200` heißt sie steht,
 * `404` heißt sie fehlt, alles andere heißt „unklar" und weckt nicht.
 * `scripts/tagesausgabe-wecken.ts` reicht das hier herein.
 */

/** Was der Wecker wissen muss, um zu entscheiden. */
export interface Weckerlage {
  /** Minuten seit Mitternacht UTC, also 0 bis 1439. */
  minuteUtc: number
  /**
   * Steht die Ausgabe des Tages schon auf `main`?
   *
   * Gefragt wird `origin/main` von **jetzt**, nicht der Arbeitsordner: Der
   * Dauerlauf hat seinen Checkout beim Start gemacht und weiß von sich aus
   * nichts über den Fortgang der Nacht.
   */
  ausgabeSteht: boolean
  /** Wie oft dieser Dauerlauf in diesem Lauf schon geweckt hat. */
  versuche: number
  /**
   * Sekunden seit dem letzten Weckruf dieses Laufs.
   *
   * Negativ, wenn es noch keinen gab.
   */
  sekundenSeitWeckruf: number
  /**
   * Minute (UTC), zu der ein aufgebrauchtes Kontingent zurückkommt.
   *
   * Steht nur da, wenn der Agent ein `429` mit genannter Uhrzeit gemeldet
   * hat – siehe `NACH_KONTINGENT_MIN`. Fehlt sie, gilt allein das Fenster.
   */
  kontingentZurueckMinute?: number | null
}

/**
 * Liegt die Minute im Nachfenster eines zurückgekehrten Kontingents?
 *
 * Getrennt von `sollWecken`, damit sie für sich prüfbar ist – und weil die
 * Begründung im Protokoll eine andere ist als „im Fenster".
 */
export function nachKontingent(
  minuteUtc: number,
  zurueck: number | null | undefined
): boolean {
  if (zurueck === null || zurueck === undefined) return false
  const von = zurueck + NACH_KONTINGENT_MIN
  return minuteUtc >= von && minuteUtc < von + KONTINGENT_FENSTER_MIN
}

/**
 * Der Beginn des Fensters: 00:10 UTC.
 *
 * Nicht 00:00 – die geplante Kette darf ihre eigene Chance zuerst haben. Um
 * 00:09 UTC ist `quellen-sammeln.yml` an der Reihe; wer davor weckt, startet
 * denselben Lauf zweimal.
 */
export const FENSTER_VON = 10

/**
 * Das Ende des Fensters: 05:00 UTC, also 07:00 deutscher Zeit.
 *
 * Danach ist die Zusage von 6:00 Uhr ohnehin gerissen, und ein Weckruf
 * mitten am Tag würde nur die Kette in die Quere kommen, die dann längst von
 * Hand angestoßen ist.
 */
export const FENSTER_BIS = 300

/**
 * Höchstens drei Weckrufe je Dauerlauf.
 *
 * Drei, weil der Agent drei Anläufe hat. Ein vierter Versuch würde nichts
 * finden, was der dritte nicht schon gefunden hätte – dann liegt es nicht am
 * Anstoßen.
 */
export const HOECHSTENS_VERSUCHE = 3

/**
 * Eine halbe Stunde Abstand zwischen zwei Weckrufen.
 *
 * Die Kette braucht vom Anstoß bis zur fertigen Ausgabe rund fünfundzwanzig
 * Minuten (Quellen sammeln, Agent, Nachrichtenlauf). Wer früher nachlegt,
 * misst nicht das Ergebnis, sondern die eigene Ungeduld.
 */
export const ABKUEHLUNG_S = 1800

/**
 * Bis wann ein bekanntes Kontingentende das Fenster offen hält.
 *
 * ## Der Fall vom 27. September 2026
 *
 * Es gab keine Nachrichten, und zwar aus einem Grund, gegen den keine der
 * bestehenden Bremsen etwas kann: Das Wochenkontingent des Abonnements war
 * aufgebraucht. Der Agent antwortete dreimal mit
 *
 *     Statuscode  429
 *     Meldung     You've hit your weekly limit · resets 1pm (UTC)
 *
 * und `ANTHROPIC_API_KEY` ist nicht hinterlegt – Weg 2 der Rangfolge gibt es
 * also nicht. Damit war die Kette am Ende, wie vorgesehen: „Liefert keiner,
 * wird nichts geschrieben."
 *
 * **Nur war sie es nicht.** Das Kontingent kam um 13:00 UTC zurück. Der
 * Wecker hatte um 05:00 aufgehört (`FENSTER_BIS`), acht Stunden davor, und
 * danach hat niemand mehr gefragt. Gemerkt hat es der Betreiber auf der
 * Website.
 *
 * Bei `FENSTER_BIS` stand als Begründung, ein Weckruf mitten am Tag käme „der
 * Kette in die Quere, die dann längst von Hand angestoßen ist". Genau diese
 * Annahme ist der Fehler: Von Hand angestoßen hat niemand, und wer es täte,
 * wäre der Betreiber – der die Ausgabe gerade nicht hat.
 *
 * ## Warum das kein einfaches „Fenster länger" ist
 *
 * Weil den ganzen Tag alle zehn Minuten zu fragen die Bremse wäre, die es
 * nicht gibt: Solange das Kontingent leer ist, ändert kein Weckruf etwas, und
 * drei nutzlose Anläufe verbrauchen die drei, die `HOECHSTENS_VERSUCHE`
 * zulässt.
 *
 * **Ein 429 mit genannter Uhrzeit ist keine Absage, sondern ein Termin.** Der
 * Agent schreibt diese Uhrzeit auf, und der Wecker wartet bis dahin – dann
 * genau einmal, mit dieser Toleranz obendrauf, damit eine Minute Ungenauigkeit
 * beim Zurücksetzen nicht in eine weitere leere Anfrage läuft.
 */
export const NACH_KONTINGENT_MIN = 5

/**
 * Wie lange nach dem Kontingentende noch geweckt werden darf.
 *
 * Zwei Stunden. Danach ist der Tag so weit herum, dass eine Ausgabe von heute
 * Abend niemandem mehr etwas bringt – und wenn es in zwei Stunden nicht
 * geklappt hat, liegt es nicht am Kontingent.
 */
export const KONTINGENT_FENSTER_MIN = 120

/** Das Ergebnis der Entscheidung, mitsamt Begründung fürs Protokoll. */
export interface Weckentscheidung {
  wecken: boolean
  grund: string
}

/**
 * Soll die Kette jetzt geweckt werden?
 *
 * Die Reihenfolge der Prüfungen ist nicht beliebig: Zuerst das Fenster (das
 * schließt die meisten Runden ohne jede Nachfrage aus), dann die Tatsache,
 * die der Aufrufer teuer besorgen musste, dann die eigenen Bremsen.
 */
export function sollWecken(lage: Weckerlage): Weckentscheidung {
  const imFenster = lage.minuteUtc >= FENSTER_VON && lage.minuteUtc < FENSTER_BIS
  const nachher = nachKontingent(lage.minuteUtc, lage.kontingentZurueckMinute)

  if (!imFenster && !nachher) {
    return {
      wecken: false,
      grund:
        lage.kontingentZurueckMinute === null ||
        lage.kontingentZurueckMinute === undefined
          ? `außerhalb des Fensters (${FENSTER_VON}–${FENSTER_BIS} Minuten nach Mitternacht UTC)`
          : `außerhalb des Fensters und nicht im Nachfenster des Kontingents ` +
            `(zurück um Minute ${lage.kontingentZurueckMinute})`,
    }
  }
  if (lage.ausgabeSteht) {
    return { wecken: false, grund: 'die Ausgabe des Tages steht bereits auf main' }
  }
  if (lage.versuche >= HOECHSTENS_VERSUCHE) {
    return {
      wecken: false,
      grund: `schon ${lage.versuche} Weckrufe in diesem Lauf – mehr hilft nicht`,
    }
  }
  if (lage.sekundenSeitWeckruf >= 0 && lage.sekundenSeitWeckruf < ABKUEHLUNG_S) {
    return {
      wecken: false,
      grund: `der letzte Weckruf ist erst ${lage.sekundenSeitWeckruf} Sekunden her`,
    }
  }
  return {
    wecken: true,
    grund: nachher
      ? `das Kontingent ist seit Minute ${lage.kontingentZurueckMinute} zurück, ` +
        'und die Ausgabe des Tages fehlt weiter'
      : 'die Ausgabe des Tages fehlt auf main, und die Kette läuft nicht',
  }
}

/* ------------------------------------------------------------ Der Alarm */

/**
 * Die Minute, ab der eine fehlende Ausgabe gemeldet wird: 03:11 UTC.
 *
 * Dieselbe Uhrzeit, die `ausgabe-waechter.yml` als Cron trägt, und aus
 * demselben Grund: 5:11 Uhr deutscher Sommerzeit liegt **vor** der Zusage von
 * 6:00. Ein Alarm danach meldete, dass sie schon gebrochen ist.
 */
export const ALARM_MINUTE = 191

/**
 * Soll der Ausgabe-Wächter jetzt angestoßen werden?
 *
 * ## Warum das hier noch dazukommt
 *
 * Am 4. September 2026 fehlten Nachrichten und Folge, und **der Wächter, der
 * genau das melden soll, ist nicht gelaufen** – sein letzter Lauf war am Tag
 * davor. Er hängt an `schedule`, und GitHub verwirft geplante Läufe.
 *
 * Gemerkt hat es der Betreiber auf der Website. Damit ist genau der Fall
 * eingetreten, gegen den dieser Workflow gebaut wurde: der stille Fehler.
 *
 * **Ein Alarm, der an derselben Mechanik hängt wie das, was er überwacht, ist
 * keiner.** Der Wecker oben hängt seit dem 28. August am Dauerlauf; der Alarm
 * gehört aus demselben Grund dorthin. Der Cron im Wächter bleibt stehen – zwei
 * Wege sind hier richtig, und ein doppelter Lauf kostet vierzig Sekunden.
 *
 * ## Warum eine eigene Angabe statt `ausgabeSteht`
 *
 * Weil hier die **Umkehrung** von `ausgabeSteht` nicht taugt. Der Aufrufer
 * kennt drei Antworten – steht, fehlt, unklar –, und `sollWecken` bekommt die
 * dritte gar nicht erst zu sehen: `scripts/tagesausgabe-wecken.ts` weist sie
 * vorher ab. Wer hier `!ausgabeSteht` schriebe, müsste sich auf dieselbe
 * Vorprüfung verlassen, und ein Alarm darf sich nicht darauf verlassen, dass
 * jemand anders vorher aufgeräumt hat: Ein überflüssiger Anstoß ist billig,
 * eine überflüssige Mail nicht. Ein Alarm, der gelegentlich grundlos kommt,
 * wird nach der dritten Mail nicht mehr gelesen.
 */
export interface Alarmlage {
  /** Minuten seit Mitternacht UTC. */
  minuteUtc: number
  /**
   * Steht **sicher** fest, dass die Ausgabe fehlt?
   *
   * Nur bei einer gelesenen `404`. Eine Antwort, die niemand deuten kann,
   * ist kein Befund – siehe oben.
   */
  ausgabeFehltSicher: boolean
  /** Wurde in diesem Dauerlauf schon alarmiert? */
  schonAlarmiert: boolean
}

export interface Alarmentscheidung {
  alarmieren: boolean
  grund: string
}

export function sollAlarmieren(lage: Alarmlage): Alarmentscheidung {
  if (lage.minuteUtc < ALARM_MINUTE) {
    return {
      alarmieren: false,
      grund: `noch vor der Alarmminute (${ALARM_MINUTE} nach Mitternacht UTC)`,
    }
  }
  /*
    Nach oben offen bis zum Ende des Dauerlaufs.

    Der Wecker hört um 05:00 UTC auf, weil ein Anstoß danach nur noch der
    Kette in die Quere käme. Der Alarm hört dort **nicht** auf: Dass die
    Zusage gerissen ist, bleibt meldenswert, auch wenn es zum Nachziehen zu
    spät ist. Der Betreiber soll es von hier erfahren und nicht vom Telefon.
  */
  if (!lage.ausgabeFehltSicher) {
    return {
      alarmieren: false,
      grund: 'die Ausgabe steht, oder die Antwort war nicht zu deuten',
    }
  }
  if (lage.schonAlarmiert) {
    return { alarmieren: false, grund: 'in diesem Lauf ist der Alarm schon gestellt' }
  }
  return {
    alarmieren: true,
    grund: 'die Frist ist da und die Ausgabe fehlt – der Wächter wird angestoßen',
  }
}

/* ------------------------------------------- Das Kontingent und seine Uhr */

/**
 * Liest aus der Absage der Schnittstelle, wann das Kontingent zurückkommt.
 *
 * ## Warum aus dem Text und nicht aus einem Feld
 *
 * Weil die Uhrzeit nur im Text steht. Das Protokoll der Action nennt
 * `api_error_status: 429`; die Stunde steht allein in `result`, so wie am
 * 27. September 2026 wörtlich:
 *
 *     You've hit your weekly limit · resets 1pm (UTC)
 *
 * Gelesen wird deshalb genau diese Form – eine Stunde mit `am`/`pm` und
 * ausdrücklich `UTC` daneben. **Ohne das `UTC` wird nichts gelesen:** Eine
 * Stunde ohne Zeitzone in eine Minute nach Mitternacht UTC umzurechnen wäre
 * geraten, und ein geratener Termin weckt zur falschen Zeit.
 *
 * Gibt `null` zurück, wenn nichts Verlässliches dasteht. Das ist der
 * Regelfall bei jeder anderen Störung, und dann gilt allein das Fenster.
 */
export function kontingentZurueck(meldung: string | null | undefined): number | null {
  if (!meldung) return null
  if (!/\bUTC\b/i.test(meldung)) return null

  const treffer = /\bresets?\b[^0-9]{0,20}(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i.exec(
    meldung
  )
  if (!treffer) return null

  const stunde = Number(treffer[1])
  const minute = treffer[2] ? Number(treffer[2]) : 0
  const halb = treffer[3]?.toLowerCase()

  if (minute > 59) return null
  if (halb && (stunde < 1 || stunde > 12)) return null
  if (!halb && stunde > 23) return null

  let volleStunde = stunde
  if (halb === 'pm' && stunde !== 12) volleStunde += 12
  if (halb === 'am' && stunde === 12) volleStunde = 0

  return volleStunde * 60 + minute
}
