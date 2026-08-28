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
  FENSTER_BIS,
  FENSTER_VON,
  HOECHSTENS_VERSUCHE,
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

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
