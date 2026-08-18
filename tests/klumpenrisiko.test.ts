/**
 * Klumpenrisiko – und ob die Seite rechnet, was sie behauptet.
 *
 * ## Was hier schiefgehen kann
 *
 * 1. **Die Gewichte der Top-Liste passen nicht zu ihrer Summe.** Das Blatt
 *    nennt beides. Ein Zahlendreher in einer Zeile fällt an keiner Zeile auf,
 *    an der Summe schon – und die Summe steht auf der Seite als Kernaussage.
 * 2. **Der Gleichgewichtsanteil wird falsch herum gerechnet.** Ein Faktor von
 *    66 und einer von 0,015 sehen beide nach einer Zahl aus. Nur einer ist
 *    die Antwort.
 * 3. **Die doppelte Aktiengattung wird stillschweigend als zwei Unternehmen
 *    gezählt.** Genau das ist der Fehler, den die Seite erklärt – ihn selbst
 *    zu machen wäre die peinlichste Art, ihn zu machen.
 * 4. **Die Branchengewichte ergeben nicht hundert Prozent.**
 * 5. **Es wird mehr gerechnet, als das Blatt hergibt.** Ein Herfindahl aus
 *    zehn von 1.282 Werten sähe aus wie eine Messung. Geprüft wird deshalb,
 *    dass die Bibliothek keinen anbietet.
 */

import { readFileSync } from 'node:fs'

import { type Einzelwert } from '@/data/index-zusammensetzung'
import {
  anteilGroesste,
  branchenDerGroessten,
  branchenNachGewicht,
  gleichgewichtProzent,
  klumpenbefund,
  klumpenbefundWeltindex,
  unternehmenGezaehlt,
} from '@/lib/klumpenrisiko'
import { weltindex } from '@/lib/weltindex'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

const satz = weltindex()
const werte = satz.groesste ?? []
const befund = klumpenbefundWeltindex()

console.log(`${satz.quelle.label}, Stand ${satz.stand}`)
console.log(
  `${befund.anzahlWerte} Werte, Gleichgewicht ${befund.gleichgewichtProzent.toFixed(3)} %\n`
)

/* ------------------------------------------------------- Die Top-Liste */

pruefen(
  'Zehn Einzelwerte sind hinterlegt',
  werte.length === 10,
  `${werte.length} – das Blatt nennt zehn. Weniger heißt, dass beim Übertragen eine Zeile fehlt.`
)

/*
  Die Summe steht im Blatt: „Total 26.41".

  Sie hier nachzurechnen ist die Gegenprobe zu jeder einzelnen Zeile. Eine
  halbe Zehntel Toleranz, weil das Blatt gerundete Einzelwerte ausweist und
  seine Summe aus den ungerundeten bildet.
*/
const summeOben = anteilGroesste()
pruefen(
  `Die zehn größten ergeben ${summeOben.toFixed(2)} Prozent`,
  Math.abs(summeOben - 26.41) < 0.1,
  'Das Blatt weist 26,41 % aus. Eine Abweichung ist ein Übertragungsfehler.'
)

pruefen(
  'Jeder Einzelwert hat Name, Branche und Marktwert',
  werte.every(
    (w: Einzelwert) =>
      w.name.length > 1 && (w.branche ?? '').length > 1 && (w.marktwertMrdUsd ?? 0) > 0
  ),
  'Eine Zeile ohne Branche fiele auf der Seite als leere Zelle auf – aber erst dort.'
)

/*
  Die Marktwerte müssen zu den Gewichten passen.

  Beide stehen im Blatt und sind unabhängig voneinander abgeschrieben. Wenn
  Gewicht und Marktwert dieselbe Rangfolge ergeben, ist keine Zeile verrutscht.
*/
const nachGewicht = [...werte].map((w) => w.name)
const nachMarktwert = [...werte]
  .sort((a, b) => (b.marktwertMrdUsd ?? 0) - (a.marktwertMrdUsd ?? 0))
  .map((w) => w.name)
pruefen(
  'Gewicht und Marktwert ergeben dieselbe Rangfolge',
  nachGewicht.join() === nachMarktwert.join(),
  'Sonst ist beim Abschreiben eine Zeile verrutscht – zwei Spalten, eine Quelle.'
)

/* ------------------------------------------------- Der Gleichgewichtsanteil */

console.log('')

pruefen(
  'Hundert Werte ergeben ein Prozent',
  Math.abs(gleichgewichtProzent(100) - 1) < 1e-9,
  'Der einfachste Fall, der die Richtung der Division festnagelt.'
)

pruefen(
  `Bei ${befund.anzahlWerte} Werten sind es ${befund.gleichgewichtProzent.toFixed(3)} Prozent`,
  befund.gleichgewichtProzent > 0.07 && befund.gleichgewichtProzent < 0.09,
  'Umgekehrt gerechnet käme 12,82 heraus – auch eine Zahl, nur nicht diese.'
)

pruefen(
  'Ein Index ohne Werte wirft',
  (() => {
    try {
      gleichgewichtProzent(0)
      return false
    } catch {
      return true
    }
  })(),
  'Ein stiller Rückfall auf Unendlich stünde als „∞-fach" auf der Seite.'
)

pruefen(
  `Der größte Wert wiegt das ${befund.faktorGroesster.toFixed(0)}-Fache`,
  befund.faktorGroesster > 20,
  'Die Kernaussage der Seite. Ein Faktor unter zwanzig wäre kein Klumpen mehr –\n' +
    '     dann gehört der Text geändert und nicht die Prüfung.'
)

/* --------------------------------------- Zehn Werte sind neun Unternehmen */

console.log('')

const unternehmen = unternehmenGezaehlt()
const mehrfach = unternehmen.filter((u) => u.gattungen > 1)

pruefen(
  `${werte.length} Werte sind ${unternehmen.length} Unternehmen`,
  unternehmen.length < werte.length,
  'Alphabet steht mit zwei Gattungen in der Liste. Sind beide Zahlen gleich,\n' +
    '     zählt die Funktion Gattungen statt Unternehmen – der Fehler, den die Seite erklärt.'
)

pruefen(
  'Die Gattungen werden addiert, nicht überschrieben',
  mehrfach.length > 0 &&
    Math.abs(
      mehrfach[0].anteil -
        werte
          .filter((w) => w.unternehmen === mehrfach[0].name)
          .reduce((s, w) => s + w.anteil, 0)
    ) < 1e-9,
  'Sonst gewinnt die zuletzt gelesene Gattung, und die Zahl ist zu klein.'
)

pruefen(
  'Beim Zusammenfassen geht kein Gewicht verloren',
  Math.abs(unternehmen.reduce((s, u) => s + u.anteil, 0) - summeOben) < 1e-9,
  'Die Summe über Unternehmen muss die Summe über Werte sein.'
)

/*
  Die Gegenprobe mit erfundenem Material.

  Im echten Bestand hat nur Alphabet zwei Gattungen. Ohne diese Probe wäre
  nicht ausgeschlossen, dass die Funktion bei drei Gattungen oder bei zwei
  verschiedenen Mehrfachnennungen etwas anderes tut.
*/
pruefen(
  'Drei Gattungen zweier Unternehmen werden richtig zusammengefasst',
  (() => {
    const probe = unternehmenGezaehlt([
      { name: 'X A', anteil: 3, unternehmen: 'X' },
      { name: 'Y', anteil: 2 },
      { name: 'X B', anteil: 1.5, unternehmen: 'X' },
      { name: 'X C', anteil: 0.5, unternehmen: 'X' },
    ])
    const x = probe.find((u) => u.name === 'X')
    return (
      probe.length === 2 &&
      x !== undefined &&
      x.gattungen === 3 &&
      Math.abs(x.anteil - 5) < 1e-9 &&
      probe[0].name === 'X'
    )
  })(),
  'Erwartet: zwei Unternehmen, X mit drei Gattungen und 5 %, X zuerst.'
)

/* ------------------------------------------------------------ Die Branchen */

console.log('')

const branchen = branchenNachGewicht()
const branchenSumme = branchen.reduce((s, b) => s + b.anteil, 0)

pruefen(
  `Die Branchengewichte ergeben ${branchenSumme.toFixed(2)} Prozent`,
  Math.abs(branchenSumme - 100) < 0.5,
  'Aus dem Blatt abgeschrieben; ein Zahlendreher fällt nur an der Summe auf.'
)

pruefen(
  'Die Branchen stehen absteigend',
  branchen.every((b, i) => i === 0 || branchen[i - 1].anteil >= b.anteil),
  'Sortiert wird in der Bibliothek – tut die Sortierung nichts, fällt es hier auf.'
)

pruefen(
  'Die Sortierung verändert die Datei nicht',
  (satz.branchen ?? [])[0]?.branche === 'Informationstechnologie' &&
    branchen !== satz.branchen,
  'Eine Sortierung an Ort und Stelle würde den Datenbestand beim Bauen umordnen.'
)

/*
  Jede Branche der Top-Liste muss es auch in der Branchentabelle geben.

  Beide sind von Hand aus demselben Blatt übertragen, in verschiedene
  Strukturen. Ein Tippfehler in einer Bezeichnung fiele sonst erst auf der
  Seite auf – als Satz „6 der 10 größten gehören zu … und diese Branchen
  wiegen 0,00 %".
*/
const obenAuf = branchenDerGroessten()
pruefen(
  'Jede Branche der Top-Liste steht auch in der Branchentabelle',
  obenAuf.every((o) => branchen.some((b) => b.branche === o.branche)),
  `Unbekannt: ${obenAuf
    .filter((o) => !branchen.some((b) => b.branche === o.branche))
    .map((o) => o.branche)
    .join(', ')}`
)

pruefen(
  'Beim Zählen der Branchen geht kein Wert verloren',
  obenAuf.reduce((s, o) => s + o.anzahl, 0) === werte.length,
  'Ein Wert ohne Branche würde stillschweigend übersprungen.'
)

console.log('')
for (const o of obenAuf) {
  const imIndex = branchen.find((b) => b.branche === o.branche)?.anteil ?? 0
  console.log(
    `  ${o.branche.padEnd(24)} ${String(o.anzahl).padStart(2)} von ${werte.length}   ` +
      `${o.anteil.toFixed(2).padStart(5)} % der Top-Liste, ${imIndex.toFixed(2).padStart(5)} % des Index`
  )
}

/* --------------------------------------------- Was nicht gerechnet wird */

console.log('')

/*
  Die Prüfung gegen den naheliegenden nächsten Schritt.

  Ein Herfindahl-Index über zehn von 1.282 Werten wäre in zwanzig Minuten
  gebaut, sähe aus wie eine Kennzahl und wäre eine Schätzung mit unbekanntem
  Fehler. Auf `/maerkte/waehrungen-im-weltindex` ist genau dieser Fehler
  schon einmal passiert – 86,4 % Dollar aus einem lückenhaften Bestand.
*/
const quelle = readFileSync('lib/klumpenrisiko.ts', 'utf8')
const ohneKommentare = quelle.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')

pruefen(
  'Die Bibliothek bietet kein Konzentrationsmaß über den ganzen Index an',
  !/herfindahl|gini|effektiveZahl/i.test(ohneKommentare),
  'Zehn von 1.282 Gewichten tragen kein solches Maß. Wer eines braucht, braucht die Gewichte.'
)

pruefen(
  'Die Gegenprobe: nach dem Strippen steht noch Code da',
  ohneKommentare.includes('export function klumpenbefund'),
  'Sonst prüft die Zeile darüber eine leere Zeichenkette.'
)

/* ----------------------------------------------------------- Die Ränder */

console.log('')

pruefen(
  'Ohne Einzelwerte wirft der Befund',
  (() => {
    try {
      klumpenbefund([], satz.kennzahlen)
      return false
    } catch {
      return true
    }
  })(),
  'Eine Seite über Klumpenrisiko mit leerer Tabelle wäre schlimmer als ein roter Bau.'
)

pruefen(
  'Ohne Kennzahlen wirft der Befund',
  (() => {
    try {
      klumpenbefund(werte, undefined)
      return false
    } catch {
      return true
    }
  })(),
  'Ohne die Zahl der Indexwerte gibt es keinen Gleichgewichtsanteil.'
)

pruefen(
  'Mittel und Median stehen im erwarteten Verhältnis',
  befund.mittelZuMedian > 1,
  `${befund.mittelZuMedian.toFixed(2)} – ein Mittelwert unter dem Median hieße, dass\n` +
    '     die beiden Zahlen vertauscht übertragen wurden.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
