/**
 * Wann die Zahlenkarte hinausgeht – frühestens 15 Uhr, nur freigegeben.
 *
 * Ausführen mit `npm test`. Anlass in `lib/zahlenkarten-wecker.ts`: Am
 * 15.10.2026 ging die erste Karte um 08:59 Uhr hinaus, weil ein „passt" als
 * „jetzt hochladen" gelesen wurde.
 *
 * Zu jeder Bedingung ein Paar: eine Lage, in der angestoßen werden muss, und
 * dieselbe Lage mit genau einer geänderten Angabe, in der es nicht darf.
 */
import { GET } from '@/app/instagram/zahlenkarte.txt/route'
import { aktuelleZahlenkarte } from '@/data/instagram-zahlenkarten'
import {
  AB_MINUTE,
  berlinJetzt,
  leseZahlenkarteText,
  sollZahlenkarteAnstossen,
  type Zahlenkartenlage,
} from '@/lib/zahlenkarten-wecker'

let failed = 0
function pruefe(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) console.log(`OK   ${was}`)
  else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/* Die Uhr: Berlin, nicht UTC – im Sommer zwei Stunden, im Winter eine. */
const sommer = berlinJetzt(new Date('2026-10-15T14:00:00Z'))
pruefe(
  '14:00 UTC im Oktober ist 16:00 in Berlin',
  sommer.minute === 16 * 60,
  JSON.stringify(sommer)
)
const winter = berlinJetzt(new Date('2026-11-15T14:00:00Z'))
pruefe(
  '14:00 UTC im November ist 15:00 in Berlin',
  winter.minute === 15 * 60,
  JSON.stringify(winter)
)
const mitternacht = berlinJetzt(new Date('2026-10-15T22:30:00Z'))
pruefe('22:30 UTC ist in Berlin schon der nächste Tag', mitternacht.tag === '2026-10-16')
pruefe(
  'der Morgen des 15.10. (08:59) liegt vor der Grenze',
  berlinJetzt(new Date('2026-10-15T06:59:00Z')).minute < AB_MINUTE
)

/* Die Entscheidung. */
const gut: Zahlenkartenlage = {
  tag: '2026-10-16',
  minute: 15 * 60,
  datum: '2026-10-16',
  freigabe: '2026-10-16',
  angestossenAm: '',
}
pruefe(
  '15:00, freigegeben, Karte von heute → anstoßen',
  sollZahlenkarteAnstossen(gut).anstossen
)
pruefe(
  'auch abends, wenn die Freigabe spät kam',
  sollZahlenkarteAnstossen({ ...gut, minute: 20 * 60 }).anstossen
)
for (const [was, lage] of [
  ['14:59 – eine Minute zu früh', { ...gut, minute: 15 * 60 - 1 }],
  ['08:59 – der Fall vom 15.10.', { ...gut, minute: 8 * 60 + 59 }],
  ['ohne Freigabe', { ...gut, freigabe: null }],
  ['Freigabe von gestern', { ...gut, freigabe: '2026-10-15' }],
  [
    'Website zeigt die Karte von gestern',
    { ...gut, datum: '2026-10-15', freigabe: '2026-10-15' },
  ],
  ['heute schon angestoßen', { ...gut, angestossenAm: '2026-10-16' }],
] as [string, Zahlenkartenlage][])
  pruefe(
    `nicht anstoßen: ${was}`,
    !sollZahlenkarteAnstossen(lage).anstossen,
    sollZahlenkarteAnstossen(lage).grund
  )
pruefe(
  'gestern angestoßen hält heute nicht auf',
  sollZahlenkarteAnstossen({ ...gut, angestossenAm: '2026-10-15' }).anstossen
)

/* Das Format: was die Route schreibt, liest der Wecker. */
const text = await (GET() as Response).text()
const gelesen = leseZahlenkarteText(text)
const karte = aktuelleZahlenkarte()!
pruefe('Zeile 1 ist der Tag der Karte', gelesen.datum === karte.datum, gelesen.datum)
pruefe(
  'Zeile 2 ist ihre Freigabe',
  gelesen.freigabe === (karte.freigabe ?? null),
  String(gelesen.freigabe)
)
pruefe(
  'ab Zeile 3 die Beschriftung',
  gelesen.beschriftung.startsWith(karte.text.split('\n')[0])
)
pruefe(
  'eine Beschriftung ohne Freigabezeile gilt als nicht freigegeben',
  leseZahlenkarteText('2026-10-16\nText').freigabe === null
)
pruefe(
  '„Freigabe: -" ist keine Freigabe',
  leseZahlenkarteText('2026-10-16\nFreigabe: -\nText').freigabe === null
)

/* Ausnahme vor 15 Uhr (04.11.2026): „Freigabe: … ab HH:MM". */
{
  const ab = leseZahlenkarteText('2026-11-04\nFreigabe: 2026-11-04 ab 10:30\nText')
  pruefe('„ab 10:30" wird gelesen', ab.freigabe === '2026-11-04' && ab.abMinute === 630)
  pruefe(
    'ohne „ab" gilt 15 Uhr',
    leseZahlenkarteText('2026-11-04\nFreigabe: 2026-11-04\nText').abMinute === 15 * 60
  )
  const lage = {
    tag: '2026-11-04',
    datum: '2026-11-04',
    freigabe: '2026-11-04',
    angestossenAm: '',
  }
  pruefe(
    'mit ab 10:30 stößt er um 10:31 an',
    sollZahlenkarteAnstossen({ ...lage, minute: 631, abMinute: 630 }).anstossen
  )
  pruefe(
    'mit ab 10:30 nicht um 10:29',
    !sollZahlenkarteAnstossen({ ...lage, minute: 629, abMinute: 630 }).anstossen
  )
  pruefe(
    'ohne ab nicht um 10:31',
    !sollZahlenkarteAnstossen({ ...lage, minute: 631 }).anstossen
  )
}

/* Zwei Seiten (05.11.2026): „seiten 2" in Zeile 2. */
{
  const z = leseZahlenkarteText('2026-11-05\nFreigabe: 2026-11-05 seiten 2\nText')
  pruefe(
    '„seiten 2" wird gelesen',
    z.freigabe === '2026-11-05' && z.seiten === 2 && z.abMinute === 15 * 60
  )
  const y = leseZahlenkarteText(
    '2026-11-05\nFreigabe: 2026-11-05 ab 10:30 seiten 2\nText'
  )
  pruefe('„ab" und „seiten" zusammen', y.abMinute === 630 && y.seiten === 2)
  pruefe(
    '„seiten 7" (Zahlenstrahl, 08.11.2026) wird gelesen',
    leseZahlenkarteText('2026-11-08\nFreigabe: 2026-11-08 seiten 7\nText').seiten === 7
  )
  pruefe(
    'ohne Angabe eine Seite',
    leseZahlenkarteText('2026-11-05\nFreigabe: 2026-11-05\nText').seiten === 1
  )
}

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
