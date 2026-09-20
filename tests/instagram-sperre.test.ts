/**
 * Die Sperre gegen den Lauf, der die Lage jedes Mal verschlimmert.
 *
 * Ausführen mit `npm test`.
 *
 * ## Der Anlass
 *
 * Am 20. September 2026 lief `instagram-beitrag.yml` fünfmal und bekam jedes
 * Mal `400: Queue is full`. Im Protokoll stand jedes Mal der Satz, man solle
 * nicht noch einmal anstoßen, weil jeder Anstoß einen weiteren Eintrag in
 * dieselbe volle Warteschlange legt. Er band niemanden.
 *
 * ## Was hier geprüft wird
 *
 * Die Entscheidung, nicht das Holen und Schreiben der Marke. Sie braucht
 * weder Netz noch Dienst – nur eine Marke und ein Datum –, und genau deshalb
 * steht sie in `lib/instagram-sperre.ts` und nicht im Workflow.
 */

import {
  gesperrt,
  sperreLesen,
  sperreSchreiben,
  sperrhinweis,
} from '@/lib/instagram-sperre'

let failed = 0
function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/* ------------------------------------------------------------------ Lesen */

const marke = sperreLesen('2026-09-20\n400: Queue is full')
pruefen('eine Marke wird gelesen', marke?.tag === '2026-09-20')
pruefen('der Grund kommt mit', marke?.grund === '400: Queue is full')

pruefen(
  'eine Marke ohne Grund ist trotzdem eine',
  sperreLesen('2026-09-20')?.tag === '2026-09-20'
)

/*
  Eine unlesbare Marke darf **nichts** aufhalten. Sie wäre sonst ein Weg, den
  Ablauf versehentlich stillzulegen – und ein stillgelegter Ablauf sieht aus
  wie ein ruhiger.
*/
for (const [name, wert] of [
  ['leer', ''],
  ['nur Leerzeichen', '   \n  '],
  ['kein Datum', 'Queue is full'],
  ['halbes Datum', '2026-09\nQueue is full'],
  ['Unsinn', '<<kaputt>>'],
  ['null', null],
  ['undefined', undefined],
] as const) {
  pruefen(`„${name}" sperrt nichts`, sperreLesen(wert) === null)
}

/* --------------------------------------------------------------- Sperren */

const heute = sperreLesen(sperreSchreiben('2026-09-20', '400: Queue is full'))

pruefen('am Tag der vollen Warteschlange ist gesperrt', gesperrt(heute, '2026-09-20'))
pruefen(
  'am nächsten Tag läuft es ohne Zutun wieder an',
  !gesperrt(heute, '2026-09-21'),
  'Eine Sperre, die ein Mensch aufheben muss, wäre eine zweite Baustelle.'
)
pruefen('eine Marke von gestern hält heute nichts auf', !gesperrt(heute, '2026-09-19'))
pruefen('ohne Marke ist nichts gesperrt', !gesperrt(null, '2026-09-20'))

/*
  Eine Marke aus der Zukunft – falsch gestellte Uhr, von Hand geschrieben –
  darf nicht unbegrenzt sperren. Sie gilt für ihren Tag und sonst für keinen.
*/
const zukunft = sperreLesen(sperreSchreiben('2027-01-01', 'aus Versehen'))
pruefen('eine Marke aus der Zukunft sperrt heute nicht', !gesperrt(zukunft, '2026-09-20'))

/* ------------------------------------------------- Was geschrieben wird */

const geschrieben = sperreSchreiben('2026-09-20', '  400: Queue is full  \n')
pruefen(
  'die geschriebene Marke beginnt mit dem Tag',
  geschrieben.startsWith('2026-09-20\n')
)
pruefen('sie endet mit einem Zeilenumbruch', geschrieben.endsWith('\n'))
pruefen(
  'geschrieben und wieder gelesen ergibt dasselbe',
  sperreLesen(geschrieben)?.grund === '400: Queue is full'
)

const hinweis = sperrhinweis(heute!).join(' ')
pruefen('der Hinweis nennt die Abhilfe', hinweis.includes('Warteschlange leeren'))
pruefen('der Hinweis nennt den Grund des Dienstes', hinweis.includes('Queue is full'))

/* ------------------------------------------------------- Die Gegenprobe */

/*
  Eine Absicherung, die nie anschlägt, sieht aus wie Ruhe. Hier ist der Tag
  vom 20. September 2026, so wie er wirklich lief: fünf Läufe, fünfmal
  dieselbe Antwort. Der erste darf hinausgehen und scheitern – er ist der, der
  es herausfindet. Die vier danach dürfen es nicht.
*/
const LAEUFE = ['00:58', '04:52', '07:55', '08:55', '09:42']
let marker: string | null = null
const versucht: string[] = []

for (const uhrzeit of LAEUFE) {
  if (gesperrt(sperreLesen(marker), '2026-09-20')) continue
  versucht.push(uhrzeit)
  // Der Dienst antwortet mit „Queue is full" – der Lauf hinterlässt die Marke.
  marker = sperreSchreiben('2026-09-20', '400: Queue is full')
}

pruefen(
  `von fünf Läufen versucht es genau einer (${versucht.join(', ') || 'keiner'})`,
  versucht.length === 1 && versucht[0] === '00:58',
  'Am 20. September 2026 waren es fünf, und jeder machte die Warteschlange länger.'
)

/* Und am nächsten Morgen läuft es an, ohne dass jemand etwas zurücksetzt. */
pruefen(
  'am 21. September versucht es der erste Lauf wieder',
  !gesperrt(sperreLesen(marker), '2026-09-21')
)

if (failed) {
  console.log(`\n${failed} Prüfung(en) fehlgeschlagen.`)
  process.exit(1)
}
console.log('\nAlle Prüfungen bestanden.')
