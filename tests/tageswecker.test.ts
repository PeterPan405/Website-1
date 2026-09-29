/**
 * Prüfungen für den Wecker der Tagesausgabe.
 *
 * Ausführen mit `npm test`.
 *
 * Der Zweck dieser Datei ist der Satz aus `AGENTS.md`: *Eine Absicherung, die
 * nie anschlägt, sieht aus wie Ruhe. Wer eine baut, legt ihr etwas vor, das
 * sie beanstanden muss.* Deshalb steht hier zu **jeder** Bedingung ein Paar:
 * eine Lage, in der geweckt werden muss, und dieselbe Lage mit genau einer
 * geänderten Angabe, in der nicht geweckt werden darf.
 *
 * Ohne dieses Paar wäre ein Wecker, der immer `false` zurückgibt, von einem
 * richtigen nicht zu unterscheiden – und genau so ein Wecker wäre in der
 * Nacht auf den 28. August 2026 nicht aufgefallen.
 */

import {
  ABKUEHLUNG_S,
  ALARM_MINUTE,
  FENSTER_BIS,
  FENSTER_VON,
  HOECHSTENS_VERSUCHE,
  KONTINGENT_FENSTER_MIN,
  kontingentZurueck,
  NACH_KONTINGENT_MIN,
  nachKontingent,
  type Alarmlage,
  sollAlarmieren,
  sollWecken,
  type Weckerlage,
} from '../lib/tageswecker.ts'

let failed = 0
function check(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  const ok = a === e
  if (!ok) failed++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : `\n     erwartet ${e}\n     erhalten ${a}`}`
  )
}

/**
 * Die Lage, die wecken muss: mitten im Fenster, keine Ausgabe, kein Versuch.
 * Alle anderen Fälle entstehen daraus durch **eine** Änderung.
 */
const notlage: Weckerlage = {
  minuteUtc: 60, // 01:00 UTC
  ausgabeSteht: false,
  versuche: 0,
  sekundenSeitWeckruf: -1,
}

/* --------------------------------------------------- Der Fall, der zählt */

check('die Notlage weckt', sollWecken(notlage).wecken, true)
check('und sagt auch, warum', sollWecken(notlage).grund.includes('fehlt auf main'), true)

/* ------------------------------------------------------------- Das Fenster */

check(
  'vor dem Fenster wird nicht geweckt – die geplante Kette hat Vorrang',
  sollWecken({ ...notlage, minuteUtc: FENSTER_VON - 1 }).wecken,
  false
)
check(
  'auf die Minute genau im Fenster wird geweckt',
  sollWecken({ ...notlage, minuteUtc: FENSTER_VON }).wecken,
  true
)
check(
  'die letzte Minute des Fensters zählt noch',
  sollWecken({ ...notlage, minuteUtc: FENSTER_BIS - 1 }).wecken,
  true
)
check(
  'nach dem Fenster nicht mehr',
  sollWecken({ ...notlage, minuteUtc: FENSTER_BIS }).wecken,
  false
)
check(
  'mitten am Nachmittag erst recht nicht',
  sollWecken({ ...notlage, minuteUtc: 14 * 60 }).wecken,
  false
)
check(
  'kurz vor Mitternacht auch nicht',
  sollWecken({ ...notlage, minuteUtc: 23 * 60 + 59 }).wecken,
  false
)

/* --------------------------------------------------- Die Ausgabe des Tages */

check(
  'steht die Ausgabe, wird nicht geweckt',
  sollWecken({ ...notlage, ausgabeSteht: true }).wecken,
  false
)
check(
  'und die Begründung nennt den Grund beim Namen',
  sollWecken({ ...notlage, ausgabeSteht: true }).grund.includes('steht bereits'),
  true
)

/* ------------------------------------------------------------ Die Versuche */

check(
  'der zweite Weckruf ist erlaubt',
  sollWecken({ ...notlage, versuche: 1, sekundenSeitWeckruf: ABKUEHLUNG_S }).wecken,
  true
)
check(
  'der letzte erlaubte auch',
  sollWecken({
    ...notlage,
    versuche: HOECHSTENS_VERSUCHE - 1,
    sekundenSeitWeckruf: ABKUEHLUNG_S,
  }).wecken,
  true
)
check(
  'einer mehr nicht',
  sollWecken({
    ...notlage,
    versuche: HOECHSTENS_VERSUCHE,
    sekundenSeitWeckruf: ABKUEHLUNG_S,
  }).wecken,
  false
)

/* ---------------------------------------------------------- Die Abkühlung */

check(
  'gleich hinterher wird nicht noch einmal geweckt',
  sollWecken({ ...notlage, versuche: 1, sekundenSeitWeckruf: 60 }).wecken,
  false
)
check(
  'eine Sekunde vor Ablauf der Abkühlung noch nicht',
  sollWecken({ ...notlage, versuche: 1, sekundenSeitWeckruf: ABKUEHLUNG_S - 1 }).wecken,
  false
)
check(
  'mit Ablauf der Abkühlung wieder',
  sollWecken({ ...notlage, versuche: 1, sekundenSeitWeckruf: ABKUEHLUNG_S }).wecken,
  true
)

/* ------------------------------------------------------ Die Reihenfolge */

/**
 * Das Fenster wird **vor** allem anderen geprüft, und die Begründung sagt das
 * auch. Der Unterschied zählt im Protokoll: Ein Dauerlauf, der mittags
 * schweigt, soll erkennbar wegen der Uhrzeit schweigen und nicht wegen einer
 * Ausgabe, die zufällig auch dasteht. Sonst sähe ein Wecker, dessen Fenster
 * falsch gesetzt ist, genauso aus wie einer, der arbeitet.
 */
check(
  'außerhalb des Fensters entscheidet das Fenster, nicht die Ausgabe',
  sollWecken({ ...notlage, minuteUtc: 12 * 60, ausgabeSteht: false }).grund.includes(
    'Fensters'
  ),
  true
)

/* ============================================================ Der Alarm */

/**
 * Am 4. September 2026 fehlten Nachrichten und Folge – und der Wächter, der
 * genau das melden soll, ist nicht gelaufen. Er hängt an `schedule`.
 *
 * Deshalb dieselbe Behandlung wie beim Wecker: zu jeder Bedingung ein Fall,
 * den sie abweisen muss, und einer, den sie durchlassen muss. Ein Alarm, der
 * stumm bleibt, ist von einem, der nichts zu melden hat, sonst nicht zu
 * unterscheiden – und das war ja gerade das Problem.
 */
const alarmlage: Alarmlage = {
  minuteUtc: ALARM_MINUTE,
  ausgabeFehltSicher: true,
  schonAlarmiert: false,
}

check('genau zur Alarmminute wird gemeldet', sollAlarmieren(alarmlage).alarmieren, true)
check(
  'eine Minute davor noch nicht',
  sollAlarmieren({ ...alarmlage, minuteUtc: ALARM_MINUTE - 1 }).alarmieren,
  false
)

/*
  Nach oben offen: Der Wecker hört um FENSTER_BIS auf, der Alarm nicht. Dass
  die Zusage gerissen ist, bleibt meldenswert, auch wenn es zum Nachziehen zu
  spät ist – sonst erführe es der Betreiber wieder vom Telefon.
*/
check(
  'auch lange nach dem Weckfenster wird noch gemeldet',
  sollAlarmieren({ ...alarmlage, minuteUtc: FENSTER_BIS + 120 }).alarmieren,
  true
)

/*
  Der teure Fall. Eine unklare Antwort weckt lieber einmal zu viel, aber sie
  darf keine Mail auslösen: Ein Alarm, der gelegentlich grundlos kommt, wird
  nach der dritten Mail nicht mehr gelesen.
*/
check(
  'steht die Ausgabe, gibt es keinen Alarm',
  sollAlarmieren({ ...alarmlage, ausgabeFehltSicher: false }).alarmieren,
  false
)
check(
  'und ohne sicheren Befund ebenfalls nicht',
  sollAlarmieren({ ...alarmlage, ausgabeFehltSicher: false }).grund.includes('deuten'),
  true
)

check(
  'zweimal im selben Lauf wird nicht gemeldet',
  sollAlarmieren({ ...alarmlage, schonAlarmiert: true }).alarmieren,
  false
)

/*
  Die Reihenfolge, wie oben beim Wecker: Vor der Alarmminute entscheidet die
  Uhrzeit, nicht der Befund. Ein Alarm, dessen Minute falsch gesetzt ist, soll
  im Protokoll erkennbar an der Uhrzeit schweigen.
*/
check(
  'vor der Alarmminute entscheidet die Uhrzeit, nicht der Befund',
  sollAlarmieren({
    minuteUtc: 0,
    ausgabeFehltSicher: true,
    schonAlarmiert: true,
  }).grund.includes('Alarmminute'),
  true
)

/*
  Und die beiden dürfen nicht dasselbe sein. Es gibt eine Lage, in der geweckt
  wird und nicht alarmiert: früh am Morgen, die Ausgabe fehlt, aber die Frist
  ist noch nicht da. Wäre der Alarm nur ein zweiter Name für den Weckruf,
  fiele diese Prüfung.
*/
check(
  'früh am Morgen wird geweckt, aber nicht alarmiert',
  [
    sollWecken({ ...notlage, minuteUtc: ALARM_MINUTE - 60 }).wecken,
    sollAlarmieren({ ...alarmlage, minuteUtc: ALARM_MINUTE - 60 }).alarmieren,
  ],
  [true, false]
)

/* ------------------------------------------- Das Kontingent und seine Uhr */

/*
  Der Fall vom 27. September 2026: Das Wochenkontingent war aufgebraucht, der
  Agent nannte die Uhrzeit, zu der es zurückkommt – und der Wecker hatte acht
  Stunden davor aufgehört. Dieser Abschnitt ist dagegen gebaut.

  Zuerst das Lesen der Uhrzeit, wörtlich an der Meldung von damals.
*/
check(
  'die echte Meldung ergibt 13:00 UTC',
  kontingentZurueck("You've hit your weekly limit · resets 1pm (UTC)"),
  13 * 60
)
check('mit Minuten dahinter', kontingentZurueck('resets 1:30pm (UTC)'), 13 * 60 + 30)
check('Mitternacht ist 12am, nicht 12 Uhr', kontingentZurueck('resets 12am (UTC)'), 0)
check('Mittag ist 12pm', kontingentZurueck('resets 12pm (UTC)'), 12 * 60)
check('auch die 24-Stunden-Form', kontingentZurueck('resets 13:00 (UTC)'), 13 * 60)

/*
  Und die Gegenproben. **Ohne `UTC` wird nichts gelesen** – eine Stunde ohne
  Zeitzone umzurechnen wäre geraten, und ein geratener Termin weckt zur
  falschen Zeit. Alles Unlesbare ergibt `null`, und dann gilt allein das
  Fenster: Der Wecker wird dadurch nie *früher* still, nur nicht später laut.
*/
for (const [name, text] of [
  ['ohne UTC', 'resets 1pm'],
  ['ohne Uhrzeit', "You've hit your weekly limit"],
  ['nur Rauschen', 'rate limited (UTC)'],
  ['unmögliche Minute', 'resets 13:99 (UTC)'],
  ['unmögliche Stunde am Halbtag', 'resets 19pm (UTC)'],
  ['leer', ''],
  ['fehlt', null],
] as const) {
  check(`${name} ergibt keinen Termin`, kontingentZurueck(text), null)
}

/* Das Nachfenster: erst danach, und nicht endlos. */
const zurueck = 13 * 60
check('genau zur Rückkehr noch nicht', nachKontingent(zurueck, zurueck), false)
check(
  'nach der Toleranz schon',
  nachKontingent(zurueck + NACH_KONTINGENT_MIN, zurueck),
  true
)
check(
  'am Ende des Nachfensters nicht mehr',
  nachKontingent(zurueck + NACH_KONTINGENT_MIN + KONTINGENT_FENSTER_MIN, zurueck),
  false
)
check('ohne Termin nie', nachKontingent(zurueck + 60, null), false)

/*
  Und jetzt der ganze Fall, so wie er lief: 12:02 UTC, weit außerhalb des
  Fensters, Ausgabe fehlt. Vorher gab das „außerhalb des Fensters" und damit
  keine Nachrichten. Mit dem Termin wartet der Wecker – und weckt danach.
*/
const spaet = { ...notlage, minuteUtc: 12 * 60 + 2 }
check('um 12:02 ohne Termin: kein Weckruf', sollWecken(spaet).wecken, false)
check(
  'um 12:02 mit Termin 13:00: noch kein Weckruf',
  sollWecken({ ...spaet, kontingentZurueckMinute: zurueck }).wecken,
  false
)
check(
  'um 13:05 mit Termin 13:00: Weckruf',
  sollWecken({
    ...notlage,
    minuteUtc: zurueck + NACH_KONTINGENT_MIN,
    kontingentZurueckMinute: zurueck,
  }).wecken,
  true
)
check(
  'und die Begründung nennt das Kontingent',
  sollWecken({
    ...notlage,
    minuteUtc: zurueck + NACH_KONTINGENT_MIN,
    kontingentZurueckMinute: zurueck,
  }).grund.includes('Kontingent'),
  true
)

/*
  Die Bremsen gelten im Nachfenster genauso. Sonst wäre der Termin ein Weg,
  `HOECHSTENS_VERSUCHE` und die Abkühlung zu umgehen – und drei nutzlose
  Anläufe verbrauchen genau die drei, die es gibt.
*/
const imNachfenster = {
  ...notlage,
  minuteUtc: zurueck + NACH_KONTINGENT_MIN,
  kontingentZurueckMinute: zurueck,
}
check(
  'eine stehende Ausgabe weckt auch im Nachfenster nicht',
  sollWecken({ ...imNachfenster, ausgabeSteht: true }).wecken,
  false
)
check(
  'die Versuchsgrenze gilt auch im Nachfenster',
  sollWecken({ ...imNachfenster, versuche: HOECHSTENS_VERSUCHE }).wecken,
  false
)
check(
  'die Abkühlung gilt auch im Nachfenster',
  sollWecken({ ...imNachfenster, sekundenSeitWeckruf: ABKUEHLUNG_S - 1 }).wecken,
  false
)

/*
  Und das Fenster selbst bleibt, wie es war: Ein Termin darf es nicht
  verengen. Am Morgen wird geweckt, ob ein Kontingent gemeldet war oder nicht.
*/
check(
  'im Morgenfenster weckt es auch mit Termin',
  sollWecken({ ...notlage, kontingentZurueckMinute: zurueck }).wecken,
  true
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
