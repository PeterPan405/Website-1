/**
 * Die Währungsaufteilung des Weltindex – und ob sie sagt, was sie sagt.
 *
 * ## Was hier schiefgehen kann
 *
 * 1. **Die Gewichte ergeben nicht hundert Prozent.** Sie sind aus einem PDF
 *    abgeschrieben; ein Zahlendreher fällt an keiner einzelnen Zeile auf, an
 *    der Summe schon. Diese Prüfung ist der Grund, warum die Summe nicht
 *    gerechnet, sondern geprüft wird.
 * 2. **Die Sammelposition wird stillschweigend verteilt.** „Übrige 12,78 %"
 *    auf die bekannten Währungen aufzuschlagen wäre bequem und würde eine
 *    Genauigkeit vortäuschen, die das Blatt nicht hergibt – auf einer Seite,
 *    die von Währungsanteilen handelt, der schlimmste Fehler.
 * 3. **Länder mit gleicher Währung werden nicht addiert.** Heute betrifft das
 *    niemanden. Sobald Deutschland in die Top 5 rutscht, muss die Zahl
 *    trotzdem stimmen – und dann denkt niemand mehr daran.
 */

import {
  WELTINDEX_GROESSTE,
  WELTINDEX_HERKUNFT,
  WELTINDEX_LAENDER,
} from '@/data/weltindex'
import { dollaranteil, gewichtGroesste, waehrungsanteile } from '@/lib/weltindex'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

console.log(`${WELTINDEX_HERKUNFT.index}, Stand ${WELTINDEX_HERKUNFT.stand}\n`)
for (const a of waehrungsanteile()) {
  console.log(`  ${a.bezeichnung.padEnd(20)} ${a.prozent.toFixed(2).padStart(6)} %`)
}
console.log('')

/* ------------------------------------------------------------ Die Zahlen */

const summe = WELTINDEX_LAENDER.reduce((s, l) => s + l.prozent, 0)
pruefen(
  'Die Ländergewichte ergeben 100 Prozent',
  Math.abs(summe - 100) < 0.01,
  `${summe.toFixed(2)} % – beim Abschreiben aus dem PDF ist eine Zahl verrutscht.`
)

pruefen(
  'Jedes Gewicht ist positiv',
  WELTINDEX_LAENDER.every((l) => l.prozent > 0),
  'Ein Gewicht von null oder darunter wäre ein Lesefehler.'
)

pruefen(
  'Die Länder stehen absteigend',
  WELTINDEX_LAENDER.slice(0, -1).every(
    (l, i) => i === 0 || WELTINDEX_LAENDER[i - 1].prozent >= l.prozent
  ),
  'Die Reihenfolge ist die des Factsheets – eine andere wäre ein Übertragungsfehler.'
)

/*
  Die Sammelposition steht zuletzt und ist die einzige ohne Währung.

  Beides zusammen ist die Zusicherung, auf der der Rest aufbaut: Was keine
  Währung hat, wird auch keiner zugeschlagen.
*/
pruefen(
  'Genau ein Eintrag ist nicht aufgeschlüsselt, und er steht zuletzt',
  WELTINDEX_LAENDER.filter((l) => l.waehrung === null).length === 1 &&
    WELTINDEX_LAENDER.at(-1)?.waehrung === null,
  'Sonst wäre entweder die Sammelposition verteilt oder ein Land ohne Währung.'
)

/* ------------------------------------------------- Die Zusammenfassung */

console.log('')

const anteile = waehrungsanteile()

pruefen(
  'Die Währungsanteile ergeben wieder 100 Prozent',
  Math.abs(anteile.reduce((s, a) => s + a.prozent, 0) - 100) < 0.01,
  'Beim Zusammenfassen darf nichts verlorengehen.'
)

pruefen(
  'Die Sammelposition bleibt eine eigene Position',
  anteile.filter((a) => a.waehrung === null).length === 1 &&
    anteile.at(-1)?.waehrung === null,
  'Sie auf die Währungen zu verteilen wäre eine Genauigkeit, die das Blatt nicht hergibt.'
)

pruefen(
  'Der Dollar ist der größte Anteil',
  anteile[0]?.waehrung === 'USD',
  'Sonst stimmt die Sortierung nicht – oder die Zahlen.'
)

pruefen(
  `Der Dollaranteil ist ${dollaranteil().toFixed(2)} Prozent`,
  Math.abs(dollaranteil() - 72.03) < 0.01,
  'Die Zahl aus dem Factsheet, unverändert.'
)

/*
  Die Gegenprobe zur Summierung gleicher Währungen.

  Heute liegt nur Frankreich im Euroraum, die Addition greift also an keinem
  echten Fall. Vorgelegt wird deshalb ein zweites Euroland – ohne diese Probe
  wäre nicht ausgeschlossen, dass die Funktion Länder überschreibt statt zu
  addieren.
*/
pruefen(
  'Zwei Länder derselben Währung werden addiert',
  (() => {
    const probe = waehrungsanteile([
      { land: 'Frankreich', prozent: 2.44, waehrung: 'EUR' },
      { land: 'Deutschland', prozent: 2.2, waehrung: 'EUR' },
      { land: 'Übrige', prozent: 95.36, waehrung: null },
    ])
    const eur = probe.find((a) => a.waehrung === 'EUR')
    return (
      eur !== undefined &&
      Math.abs(eur.prozent - 4.64) < 0.001 &&
      eur.laender.length === 2
    )
  })(),
  'Sonst gewinnt das zuletzt gelesene Land, und die Zahl ist zu klein.'
)

/* ------------------------------------------------- Die zweite Aussage */

console.log('')

pruefen(
  'Die beiden größten Einzelwerte wiegen mehr als Japan',
  gewichtGroesste() > (WELTINDEX_LAENDER.find((l) => l.land === 'Japan')?.prozent ?? 0),
  `${gewichtGroesste().toFixed(2)} % gegen Japan – wenn das nicht mehr stimmt, ` +
    'gehört der Satz auf der Seite geändert und nicht die Prüfung.'
)

pruefen(
  'Jeder Einzelwert hat Namen und Gewicht',
  WELTINDEX_GROESSTE.every((e) => e.name.length > 1 && e.prozent > 0)
)

/* ------------------------------------------------------- Die Herkunft */

console.log('')

pruefen(
  'Der Stichtag liegt vor dem Abruf',
  WELTINDEX_HERKUNFT.stand < WELTINDEX_HERKUNFT.abgerufenAm,
  `Stand ${WELTINDEX_HERKUNFT.stand}, abgerufen ${WELTINDEX_HERKUNFT.abgerufenAm} – ` +
    'ein Blatt kann nicht Daten aus der Zukunft des Abrufs enthalten.'
)

pruefen(
  'Quelle und Adresse sind genannt',
  WELTINDEX_HERKUNFT.quelle.length > 5 && WELTINDEX_HERKUNFT.url.startsWith('https://'),
  'Eine Zahl ohne nachprüfbare Herkunft gehört nicht auf diese Website.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
