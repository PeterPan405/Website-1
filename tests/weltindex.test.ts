/**
 * Die Währungsaufteilung des Weltindex – und ob sie sagt, was sie sagt.
 *
 * ## Was hier schiefgehen kann
 *
 * 1. **Die Gewichte ergeben nicht hundert Prozent.** Sie sind aus einem PDF
 *    abgeschrieben; ein Zahlendreher fällt an keiner einzelnen Zeile auf, an
 *    der Summe schon.
 * 2. **Die Sammelposition wird stillschweigend verteilt.** „Übrige 12,78 %"
 *    auf die bekannten Währungen aufzuschlagen wäre bequem und würde eine
 *    Genauigkeit vortäuschen, die das Blatt nicht hergibt – auf einer Seite,
 *    die von Währungsanteilen handelt, der schlimmste Fehler.
 * 3. **Länder mit gleicher Währung werden nicht addiert.** Heute betrifft das
 *    niemanden. Sobald Deutschland in die Top 5 rutscht, muss die Zahl
 *    trotzdem stimmen – und dann denkt niemand mehr daran.
 * 4. **Die Gewichte stehen an zwei Stellen.** Der Fehler ist beim Bauen dieser
 *    Seite tatsächlich passiert; die Prüfung dazu steht unten.
 */

import { readdirSync, readFileSync } from 'node:fs'

import { indexZusammensetzung } from '@/data/index-zusammensetzung'
import {
  dollaranteil,
  gewichtGroesste,
  waehrungsanteile,
  weltindex,
  WELTINDEX_SYMBOL,
} from '@/lib/weltindex'

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
const laender = satz.laender
const groesste = satz.groesste ?? []

console.log(`${satz.quelle.label}, Stand ${satz.stand}\n`)
for (const a of waehrungsanteile()) {
  console.log(`  ${a.bezeichnung.padEnd(22)} ${a.prozent.toFixed(2).padStart(6)} %`)
}
console.log('')

/* ------------------------------------------------------------ Die Zahlen */

const summe = laender.reduce((s, l) => s + l.anteil, 0)
pruefen(
  'Die Ländergewichte ergeben 100 Prozent',
  Math.abs(summe - 100) < 0.5,
  `${summe.toFixed(2)} % – beim Abschreiben aus dem PDF ist eine Zahl verrutscht.`
)

pruefen(
  'Jedes Gewicht ist positiv',
  laender.every((l) => l.anteil > 0),
  'Ein Gewicht von null oder darunter wäre ein Lesefehler.'
)

/*
  Die Reihenfolge gilt für die Einzelländer, nicht für den Sammelposten.

  Der steht zuletzt, obwohl er mit 12,78 % größer ist als Frankreich mit 2,44 –
  er ist kein Land, und ihn nach Größe einzusortieren ließe ihn wie eines
  aussehen. Beim ersten Anlauf hat diese Prüfung genau daran angeschlagen.
*/
const einzeln = laender.filter((l) => !l.sammelposten)
pruefen(
  'Die Einzelländer stehen absteigend',
  einzeln.every((l, i) => i === 0 || einzeln[i - 1].anteil >= l.anteil),
  'Die Reihenfolge ist die des Factsheets – eine andere wäre ein Übertragungsfehler.'
)

/*
  Genau ein Sammelposten, und er ist der einzige ohne Währung.

  Beides zusammen ist die Zusicherung, auf der der Rest aufbaut: Was keine
  Währung hat, wird auch keiner zugeschlagen.
*/
pruefen(
  'Genau ein Sammelposten, und er hat keine Währung',
  laender.filter((l) => l.sammelposten).length === 1 &&
    laender.filter((l) => !l.waehrung).length === 1 &&
    laender.at(-1)?.sammelposten === true,
  'Sonst wäre entweder die Sammelposition verteilt oder ein Land ohne Währung.'
)

/* ------------------------------------------------- Die Zusammenfassung */

console.log('')

const anteile = waehrungsanteile()

pruefen(
  'Die Währungsanteile ergeben wieder 100 Prozent',
  Math.abs(anteile.reduce((s, a) => s + a.prozent, 0) - 100) < 0.5,
  'Beim Zusammenfassen darf nichts verlorengehen.'
)

pruefen(
  'Die Sammelposition bleibt eine eigene Position und steht zuletzt',
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
  dollaranteil() > 50 && dollaranteil() < 90,
  'Keine feste Zahl: Sie wandert mit dem Factsheet. Geprüft wird die Größenordnung –\n' +
    '     ein Wert außerhalb wäre ein Lesefehler und keine Marktbewegung.'
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
      { land: 'Frankreich', anteil: 2.44, waehrung: 'EUR' },
      { land: 'Deutschland', anteil: 2.2, waehrung: 'EUR' },
      { land: 'Übrige', anteil: 95.36, sammelposten: true },
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

const japan = laender.find((l) => l.land === 'Japan')?.anteil ?? 0
pruefen(
  'Die beiden größten Einzelwerte wiegen mehr als Japan',
  gewichtGroesste() > japan,
  `${gewichtGroesste().toFixed(2)} % gegen ${japan.toFixed(2)} % – wenn das nicht mehr\n` +
    '     stimmt, gehört der Satz auf der Seite geändert und nicht die Prüfung.'
)

pruefen(
  'Jeder Einzelwert hat Namen und Gewicht',
  groesste.length > 0 && groesste.every((e) => e.name.length > 1 && e.anteil > 0)
)

/*
  Die Rangfolge der Einzelwerte, und warum sie geprüft wird.

  Beim ersten Anlauf stand Apple an erster Stelle – aus dem Gedächtnis
  geschrieben, weil es das bekanntere Unternehmen ist. Das Blatt sagt seit
  Juli 2026 NVIDIA. Die Zahlen waren beide richtig, nur die Reihenfolge nicht,
  und auf der Seite steht „die zwei größten Unternehmen“ mit Namen.

  Eine falsche Rangfolge sieht auf keiner Seite falsch aus. Deshalb hier.
*/
pruefen(
  'Die Einzelwerte stehen absteigend',
  groesste.every((e, i) => i === 0 || groesste[i - 1].anteil >= e.anteil),
  `${groesste.map((e) => `${e.name} ${e.anteil}`).join(', ')} – die Reihenfolge ist die\n` +
    '     des Factsheets. Wer sie aus dem Gedächtnis schreibt, schreibt den Stand von vorgestern.'
)

/* ------------------------------------------------------- Die Herkunft */

console.log('')

pruefen(
  'Quelle und Adresse sind genannt',
  satz.quelle.label.length > 5 && satz.quelle.url.startsWith('https://'),
  'Eine Zahl ohne nachprüfbare Herkunft gehört nicht auf diese Website.'
)

pruefen(
  'Der Stichtag ist ein Tag und liegt nicht in der Zukunft',
  /^\d{4}-\d{2}-\d{2}$/.test(satz.stand) &&
    satz.stand <= new Date().toISOString().slice(0, 10),
  `stand = „${satz.stand}"`
)

/* --------------------------------- Die Gewichte stehen nur an einer Stelle */

console.log('')

/*
  Die Prüfung, die es ohne einen Fehler nicht gäbe.

  Beim Bauen der Währungsseite ist eine zweite Datei mit denselben
  Ländergewichten entstanden – `data/weltindex.ts` neben
  `data/index-zusammensetzung.ts`. Zwei Wahrheiten über dieselbe Sache, die
  beim nächsten Factsheet auseinandergelaufen wären, ohne dass es jemandem
  aufgefallen wäre: Beide Seiten hätten plausible Zahlen gezeigt, nur eben
  verschiedene.

  Gesucht wird deshalb im ganzen Datenbestand nach dem Dollargewicht. Es darf
  in genau einer Datei stehen.
*/
const usdGewicht = String(dollaranteil())
const fundstellen = readdirSync('data')
  .filter((name) => name.endsWith('.ts'))
  .filter((name) =>
    readFileSync(`data/${name}`, 'utf8').includes(`anteil: ${usdGewicht}`)
  )

pruefen(
  `Das Dollargewicht (${usdGewicht}) steht in genau einer Datei`,
  fundstellen.length === 1,
  `Gefunden in: ${fundstellen.join(', ') || 'keiner'}.\n` +
    '     Zwei Dateien mit denselben Gewichten laufen beim nächsten Factsheet\n' +
    '     auseinander, und beide Seiten sehen dabei plausibel aus.'
)

pruefen(
  'Die Seite liest dieselbe Zusammensetzung wie Marktseite und Lernthema',
  satz === indexZusammensetzung[WELTINDEX_SYMBOL],
  'Sonst gibt es die Doppelung wieder, nur eine Ebene höher.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
