/**
 * Der Zeitstrahl – und die Aussage, die er tragen soll.
 *
 * ## Was hier schiefgehen kann
 *
 * 1. **Die Lehre der Seite stimmt nicht mehr.** „Nicht die Tiefe zählt,
 *    sondern die Dauer“ ist keine Meinung, sondern eine Auswertung von
 *    `data/crashes.ts`. Kommt ein Fall dazu, kann sie kippen – und dann darf
 *    sie nicht als Überschrift stehen bleiben.
 * 2. **Zahlen stehen zweimal da.** Rückgang und Erholungsdauer gehören in
 *    `data/crashes.ts`. Werden sie auf dem Strahl abgeschrieben, ist eine von
 *    beiden nach der nächsten Änderung falsch – und zwar die, die niemand
 *    mitliest.
 * 3. **Ein Einbruch fällt still heraus.** Fehlt zu einem Fall der Prosatext,
 *    wäre der bequeme Fehler, ihn nicht anzuzeigen. Der Strahl muss alle
 *    tragen.
 * 4. **Datum und Näherung stehen gleichrangig nebeneinander.** Ein Vertragstag
 *    ist nachprüfbar, eine Erholungsdauer nicht. Beides gleich zu setzen wäre
 *    die stille Behauptung, beides sei gleich sicher.
 */

import { kurseinbrueche } from '@/data/crashes'
import { GESCHICHTSEREIGNISSE } from '@/data/finanzgeschichte'
import {
  ARTEN,
  dauerText,
  erholungsbefund,
  nachJahrhundert,
  zeitstrahl,
} from '@/lib/finanzgeschichte'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

const punkte = zeitstrahl()

/* ---------------------------------------------------------- Vollständigkeit */

pruefen(
  'Jeder Einbruch steht auf dem Strahl',
  kurseinbrueche.every((einbruch) =>
    punkte.some((punkt) => punkt.art === 'einbruch' && punkt.jahr === einbruch.jahr)
  ),
  'Ein Fall ohne Prosatext darf nicht verschwinden – der Strahl trägt alle,\n' +
    '     notfalls mit der Auslöserzeile aus dem Bestand.'
)

pruefen(
  'Jedes Ereignis steht auf dem Strahl',
  GESCHICHTSEREIGNISSE.every((ereignis) =>
    punkte.some((punkt) => punkt.id === ereignis.id)
  )
)

pruefen(
  'Die Punkte stehen aufsteigend nach Jahr',
  punkte.every((punkt, index) => index === 0 || punkte[index - 1].jahr <= punkt.jahr),
  punkte.map((p) => p.jahr).join(', ')
)

const ids = punkte.map((punkt) => punkt.id)
pruefen(
  'Jede Kennung kommt einmal vor',
  new Set(ids).size === ids.length,
  'Doppelte Kennungen ergeben zwei Sprungmarken mit derselben Adresse.'
)

const artenIds = ARTEN.map((art) => art.id)
pruefen(
  'Jeder Punkt hat eine bekannte Art',
  punkte.every((punkt) => artenIds.includes(punkt.art)),
  punkte
    .filter((p) => !artenIds.includes(p.art))
    .map((p) => `${p.id}:${p.art}`)
    .join(', ')
)

pruefen(
  'Jede Art kommt vor',
  ARTEN.every((art) => punkte.some((punkt) => punkt.art === art.id)),
  'Eine Legende mit einem Eintrag, den es nicht gibt, erklärt nichts.'
)

for (const punkt of punkte) {
  const vollstaendig = punkt.was.trim().length > 60 && punkt.lehre.trim().length > 40
  if (!vollstaendig) {
    pruefen(
      `„${punkt.id}“ hat Beschreibung und Lehre`,
      false,
      `${punkt.was.length} / ${punkt.lehre.length}`
    )
  }
}

/* --------------------------------------------------- Eine Wahrheit je Zahl */

console.log('')

/*
  Die Einbruchszahlen dürfen nicht abgeschrieben sein.

  Geprüft wird gegen `data/crashes.ts`: Wenn dort jemand eine Erholungsdauer
  berichtigt, muss der Strahl folgen, ohne dass jemand ihn anfasst.
*/
for (const einbruch of kurseinbrueche) {
  const punkt = punkte.find((p) => p.art === 'einbruch' && p.jahr === einbruch.jahr)
  pruefen(
    `${einbruch.name}: Rückgang und Dauer kommen aus dem Bestand`,
    punkt?.einbruch?.rueckgangProzent === einbruch.rueckgangProzent &&
      punkt?.einbruch?.erholungJahre === einbruch.erholungJahre,
    `${punkt?.einbruch?.rueckgangProzent} / ${punkt?.einbruch?.erholungJahre} gegen ` +
      `${einbruch.rueckgangProzent} / ${einbruch.erholungJahre}`
  )
}

pruefen(
  'Nur Einbrüche tragen Einbruchszahlen',
  punkte.every((punkt) => punkt.art === 'einbruch' || punkt.einbruch === undefined),
  'Ein Vertragstag hat keine Falltiefe – eine dort wäre erfunden.'
)

pruefen(
  'Einbrüche stehen als Näherung, Ereignisse als Datum',
  punkte.every((punkt) =>
    punkt.art === 'einbruch'
      ? punkt.genauigkeit === 'naeherung'
      : punkt.genauigkeit === 'datum'
  ),
  'Bei 1929 liegen die gängigen Angaben zwischen gut fünfzehn und über\n' +
    '     fünfundzwanzig Jahren. Das neben einen Vertragstag zu setzen, ohne es zu\n' +
    '     kennzeichnen, wäre die Behauptung, beides sei gleich sicher.'
)

/* ------------------------------------------------------- Die Lehre der Seite */

console.log('')

const befund = erholungsbefund()

pruefen('Es gibt einen Befund', befund !== null)

if (befund) {
  /*
    Die Aussage der Seite in einem Satz: Der tiefste Einbruch ist nicht der
    längste. Wäre er es, müsste die Überschrift eine andere sein.
  */
  pruefen(
    'Der tiefste Fall ist nicht auch der schnellste',
    befund.tiefster.jahr !== befund.schnellster.jahr,
    `${befund.tiefster.name} ist beides – dann trägt die Seite ihre Lehre nicht.`
  )

  pruefen(
    'Tiefe bestimmt die Dauer nicht',
    !befund.tiefeBestimmtDauer,
    'Die Reihenfolge nach Falltiefe und die nach Erholungsdauer sind identisch\n' +
      '     geworden. Dann stimmt die Überschrift der Seite nicht mehr, und sie\n' +
      '     gehört umgeschrieben – nicht dieser Test angepasst.'
  )

  pruefen(
    'Es gibt zwei Fälle gleicher Tiefe mit ungleicher Dauer',
    befund.gleicheTiefe !== null,
    'Das ist der stärkste Beleg der Seite. Fällt er weg, muss die Seite ihre\n' +
      '     Aussage anders begründen – der Vergleich ist dann nur noch eine Tendenz.'
  )

  if (befund.gleicheTiefe) {
    const { a, b } = befund.gleicheTiefe
    console.log(
      `     ${a.name} und ${b.name}: beide ${a.rueckgangProzent} % – ` +
        `${dauerText(a.erholungJahre)} gegen ${dauerText(b.erholungJahre)}.`
    )
  }
}

/* ------------------------------------------------------------ Die Anzeige */

console.log('')

pruefen('Ein halbes Jahr steht als Monate da', dauerText(0.5) === '6 Monate')
pruefen('Ein Jahr steht im Singular', dauerText(1) === 'ein Jahr')
pruefen('Mehrere Jahre stehen mit Zahl', dauerText(25) === '25 Jahre')
pruefen('Nachkommastellen bleiben deutsch', dauerText(2.5) === '2,5 Jahre')

const jahrhunderte = nachJahrhundert(punkte)
pruefen(
  'Die Jahrhunderte stehen aufsteigend',
  jahrhunderte.every(
    (gruppe, index) =>
      index === 0 || jahrhunderte[index - 1].jahrhundert < gruppe.jahrhundert
  ),
  jahrhunderte.map((g) => g.jahrhundert).join(', ')
)

pruefen(
  'Kein Punkt geht bei der Gruppierung verloren',
  jahrhunderte.reduce((summe, gruppe) => summe + gruppe.punkte.length, 0) ===
    punkte.length
)

pruefen(
  'Ein Jahr landet in seinem Jahrhundert',
  nachJahrhundert([
    { ...punkte[0], id: 'x', jahr: 1900 },
    { ...punkte[0], id: 'y', jahr: 1999 },
    { ...punkte[0], id: 'z', jahr: 2000 },
  ])
    .map((gruppe) => `${gruppe.jahrhundert}:${gruppe.punkte.length}`)
    .join() === '1900:2,2000:1',
  'Die Grenze liegt bei den runden Hundertern – 1999 gehört zu 1900, nicht zu 2000.'
)

/* ----------------------------------------------------------- Die Gegenprobe */

console.log('')

/*
  Eine Absicherung, die nie anschlägt, sieht aus wie Ruhe.

  Deshalb bekommt `erholungsbefund()` hier einen Bestand vorgelegt, in dem
  „tiefer heißt länger“ tatsächlich gilt. Meldet er das nicht, prüft die
  Aussage oben niemand.
*/
const brav = erholungsbefund([
  { name: 'A', jahr: 1, rueckgangProzent: 10, erholungJahre: 1, ausloeser: '' },
  { name: 'B', jahr: 2, rueckgangProzent: 50, erholungJahre: 5, ausloeser: '' },
  { name: 'C', jahr: 3, rueckgangProzent: 80, erholungJahre: 20, ausloeser: '' },
])
pruefen(
  'Ein Bestand, in dem Tiefe die Dauer bestimmt, wird als solcher erkannt',
  brav?.tiefeBestimmtDauer === true,
  'Sonst meldet die Prüfung oben immer „widerlegt“, egal was in den Daten steht.'
)
pruefen('Und er hat keine zwei Fälle gleicher Tiefe', brav?.gleicheTiefe === null)

pruefen(
  'Ein einzelner Fall ergibt keinen Befund',
  erholungsbefund([kurseinbrueche[0]]) === null
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
