/**
 * Prüfungen für die zeitliche Einordnung im Börsenkalender.
 *
 * Der Anlass ist ein Bildschirmfoto vom 1. August 2026: Der Kalender stand mit
 * der Überschrift „Juli 2026“ und darunter „um den 30. Jul.“ – zwei Tage alt,
 * an der obersten Stelle der Seite. Der Termin war nicht stehengeblieben, er
 * war ein **Zeitraum** vom 30. Juli bis zum 5. August, dessen Anfang hinter uns
 * lag. Die Ansicht kannte nur „kommend“ und „vorbei“ und sortierte nach dem
 * Anfangstag.
 *
 * Geprüft wird deshalb der Unterschied zwischen den drei Zuständen und die
 * Frage, unter welcher Monatsüberschrift ein Termin erscheint.
 */

import { anzeigemonat, istVorbei, laeuftNoch } from '../lib/kalender-zeit.ts'

let bestanden = 0
let gescheitert = 0

function pruefe(name: string, bedingung: boolean, hinweis?: string) {
  if (bedingung) {
    bestanden++
    console.log(`OK   ${name}`)
  } else {
    gescheitert++
    console.error(`FEHL ${name}${hinweis ? ` – ${hinweis}` : ''}`)
  }
}

/** Der Fall aus dem Bildschirmfoto: CVS Health, Streuung sechs Tage. */
const cvs = { datum: '2026-07-30', bis: '2026-08-05' }
/** Mastercard am selben Tag, aber mit engem Muster – also ohne Zeitraum. */
const mastercard = { datum: '2026-07-30', bis: undefined }
/** Ein Termin, der erst beginnt. */
const kommend = { datum: '2026-08-04', bis: undefined }

const HEUTE = '2026-08-01'

console.log('\n— Was noch läuft —')

pruefe(
  'ein Zeitraum mit vergangenem Anfang und offenem Ende läuft',
  laeuftNoch(cvs, HEUTE)
)

pruefe(
  'ein Einzeltermin von vorgestern läuft nicht – er ist vorbei',
  !laeuftNoch(mastercard, HEUTE) && istVorbei(mastercard, HEUTE)
)

pruefe(
  'ein Zeitraum, der heute beginnt, läuft noch nicht',
  !laeuftNoch({ datum: HEUTE, bis: '2026-08-05' }, HEUTE),
  'sein Anfangstag ist die richtige Angabe, nicht seine Frist'
)

pruefe(
  'ein Zeitraum, dessen Ende heute ist, läuft noch',
  laeuftNoch({ datum: '2026-07-28', bis: HEUTE }, HEUTE),
  'der letzte Tag gehört dazu'
)

pruefe(
  'ein Zeitraum, dessen Ende gestern war, läuft nicht mehr',
  !laeuftNoch({ datum: '2026-07-28', bis: '2026-07-31' }, HEUTE)
)

console.log('\n— Was vorbei ist —')

pruefe('ein Zeitraum ist erst nach seinem Ende vorbei', !istVorbei(cvs, HEUTE))

pruefe(
  'ein Zeitraum mit Ende gestern ist vorbei',
  istVorbei({ datum: '2026-07-28', bis: '2026-07-31' }, HEUTE)
)

pruefe('ein kommender Termin ist nicht vorbei', !istVorbei(kommend, HEUTE))

console.log('\n— Ohne Datum aus dem Browser —')

/*
  Der Server hat kein „heute“. Ohne es darf nichts als vorbei oder laufend
  gelten, sonst unterscheidet sich das HTML vom Server und aus dem Browser.
*/
pruefe('ohne heute ist nichts vorbei', !istVorbei(mastercard, null))
pruefe('ohne heute läuft nichts', !laeuftNoch(cvs, null))
pruefe(
  'ohne heute bleibt der Anfangsmonat stehen',
  anzeigemonat(cvs, null) === '2026-07',
  'sonst weicht der Server vom Browser ab'
)

console.log('\n— Unter welcher Monatsüberschrift —')

pruefe(
  'ein laufender Zeitraum steht im laufenden Monat',
  anzeigemonat(cvs, HEUTE) === '2026-08',
  `bekam ${anzeigemonat(cvs, HEUTE)} – genau der Fehler aus dem Bildschirmfoto`
)

pruefe(
  'ein kommender Termin behält seinen eigenen Monat',
  anzeigemonat({ datum: '2026-09-15', bis: undefined }, HEUTE) === '2026-09'
)

pruefe(
  'ein Zeitraum, der erst im nächsten Monat beginnt, wird nicht vorgezogen',
  anzeigemonat({ datum: '2026-09-15', bis: '2026-09-22' }, HEUTE) === '2026-09'
)

pruefe(
  'ein vergangener Termin behält seinen Monat',
  anzeigemonat(mastercard, HEUTE) === '2026-07',
  'wer die Vergangenheit einblendet, sucht sie dort, wo sie stattfand'
)

pruefe(
  'ein laufender Zeitraum über einen Jahreswechsel landet im neuen Jahr',
  anzeigemonat({ datum: '2025-12-29', bis: '2026-01-05' }, '2026-01-02') === '2026-01'
)

console.log(`\n${bestanden} Prüfungen bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
