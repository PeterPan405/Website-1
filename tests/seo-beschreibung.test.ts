/**
 * Beschreibungen, deren Länge erst zur Bauzeit feststeht.
 *
 * ## Der Fall, aus dem das entstand
 *
 * Die Kartenbögen tragen den Titel ihres Lernthemas in der Beschreibung.
 * „Wie funktioniert der Markt“ ist vierzehn Zeichen länger als „ETF“ – und
 * genau fünf der vierunddreißig Themen rissen dadurch die Grenze von 160
 * Zeichen, die neunundzwanzig anderen nicht.
 *
 * Der bequeme Fehler wäre gewesen, den Satz so weit zu kürzen, dass er für die
 * heutigen Titel gerade passt. Das ist eine Wette auf den nächsten Titel, und
 * **eine Grenze, die den guten Tag gerade eben trägt, ist eine Wette.**
 *
 * ## Was hier geprüft wird
 *
 * 1. Der zusammengesetzte Satz überschreitet die Grenze nicht.
 * 2. Der erste Teil steht **immer** – auch wenn er allein zu lang ist. Eine
 *    leere Beschreibung wäre schlechter als eine zu lange: Die zu lange wird
 *    abgeschnitten angezeigt, die leere gar nicht.
 * 3. Die Gegenprobe: Bei kurzen Teilen werden alle genommen. Sonst könnte die
 *    Funktion einfach immer nur den ersten liefern und alle Prüfungen oben
 *    bestehen.
 */

import { BESCHREIBUNG_GRENZE, beschreibungAusTeilen } from '@/lib/seo'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

pruefen(
  'Kurze Teile werden alle genommen',
  beschreibungAusTeilen(['Eins.', 'Zwei.', 'Drei.']) === 'Eins. Zwei. Drei.',
  beschreibungAusTeilen(['Eins.', 'Zwei.', 'Drei.'])
)

/*
  Der Fall der Kartenbögen, nachgestellt: ein langer erster Teil, zwei kurze
  Zusätze. Der letzte passt nicht mehr und fällt weg – ohne dass der Satz
  mitten im Wort endet oder ein Komma stehen bleibt.
*/
const lang = beschreibungAusTeilen([
  `Begriffe und Prüffragen zum Thema ${'X'.repeat(60)} als Kartenbogen zum Ausdrucken.`,
  'Acht Karten je A4-Blatt, beidseitig.',
  'Vorder- und Rückseite stehen passend zueinander.',
])

pruefen(
  'Ein zu langer Zusatz fällt weg',
  !lang.includes('Vorder- und Rückseite'),
  `${lang.length} Zeichen: ${lang}`
)

pruefen(
  'Und der Satz endet trotzdem sauber',
  lang.endsWith('.'),
  lang.slice(-40) + ' – ein abgeschnittenes Komma wäre die schlechtere Kürzung.'
)

/*
  Die eigentliche Zusage der Funktion, über alle plausiblen Titellängen.

  Nicht ein Beispiel, sondern der ganze Bereich: Ein einzelner Testfall würde
  die Länge treffen, für die er geschrieben wurde – und das ist genau der
  Fehler, den diese Funktion abstellen soll.
*/
let ueberlang = 0
for (let laenge = 1; laenge <= 40; laenge++) {
  const satz = beschreibungAusTeilen([
    `Begriffe und Prüffragen zum Thema ${'X'.repeat(laenge)} als Kartenbogen zum Ausdrucken.`,
    'Acht Karten je A4-Blatt, beidseitig.',
    'Vorder- und Rückseite stehen passend zueinander.',
  ])
  if (satz.length > BESCHREIBUNG_GRENZE) ueberlang++
}

pruefen(
  'Kein Titel von 1 bis 40 Zeichen reißt die Grenze',
  ueberlang === 0,
  `${ueberlang} von 40 Längen liegen über ${BESCHREIBUNG_GRENZE} Zeichen.`
)

/*
  Der erste Teil steht auch dann, wenn er allein zu lang ist.

  Sonst käme bei einem sehr langen Namen eine leere Beschreibung heraus – und
  eine fehlende Beschreibung ist schlimmer als eine abgeschnittene.
*/
const nurEiner = beschreibungAusTeilen(['A'.repeat(200), 'Zusatz.'])
pruefen(
  'Ein überlanger erster Teil bleibt stehen',
  nurEiner.length === 200,
  `${nurEiner.length} – eine leere Beschreibung wäre die schlechtere Antwort.`
)

pruefen('Ohne Teile kommt nichts heraus', beschreibungAusTeilen([]) === '')

/*
  Die Gegenprobe zur Gegenprobe: Die Grenze muss wirken.

  Mit einer sehr kleinen Grenze darf nur der erste Teil übrig bleiben. Täte er
  es nicht, würde die Funktion die Grenze gar nicht ansehen – und alle
  Prüfungen oben gingen trotzdem durch.
*/
pruefen(
  'Eine enge Grenze lässt nur den ersten Teil übrig',
  beschreibungAusTeilen(['Eins.', 'Zwei.', 'Drei.'], 6) === 'Eins.',
  beschreibungAusTeilen(['Eins.', 'Zwei.', 'Drei.'], 6)
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
