/**
 * Prüfungen für die Kreditrechnung.
 *
 * Die aussagekräftigen Stellen sind die, an denen sich ein Fehler nicht durch
 * Hinsehen zeigt:
 *
 * - **Die Annuitätenformel gegen den simulierten Verlauf.** Zahlt man die
 *   berechnete Rate über die vorgesehene Laufzeit, muss der Kredit auf den
 *   Cent genau bei null landen. Ein Vorzeichenfehler im Exponenten oder eine
 *   vergessene Division durch zwölf bricht das sofort.
 * - **Der Zinssatz null.** Dort teilt die Formel durch null; der Sonderfall
 *   muss die schlichte Division liefern.
 * - **Die Rate unter dem Zins.** Dann wächst die Schuld. Der Plan darf nicht
 *   endlos laufen, sondern muss abbrechen.
 * - **Monotonie.** Längere Laufzeit heißt kleinere Rate und höhere
 *   Gesamtkosten – das ist die Aussage, die im Lerntext steht.
 */

import {
  anschlussvergleich,
  auswerten,
  rateBeiLaufzeit,
  rateBeiTilgungssatz,
  restschuldNach,
  sondertilgungswirkung,
  tilgungsplan,
  type Kreditparameter,
} from '../lib/kredit.ts'
import { baueTilgungsplanCsv } from '../lib/tilgungsplan-csv.ts'

let failed = 0

function nahe(name: string, actual: number, expected: number, toleranz = 1e-6) {
  const ok = Math.abs(actual - expected) <= toleranz
  if (!ok) failed++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : `\n     erwartet ${expected}\n     erhalten ${actual}`}`
  )
}

function wahr(name: string, bedingung: boolean) {
  if (!bedingung) failed++
  console.log(`${bedingung ? 'OK  ' : 'FEHL'} ${name}`)
}

const kredit: Kreditparameter = { summe: 200_000, zinsProzent: 4 }

console.log('\n— Annuität trifft die Laufzeit —')
for (const jahre of [5, 10, 20, 30]) {
  const rate = rateBeiLaufzeit(kredit, jahre)
  const plan = tilgungsplan(kredit, rate)
  wahr(`${jahre} Jahre → ${jahre * 12} Monate`, plan.length === jahre * 12)
  nahe(`${jahre} Jahre → Restschuld null`, plan[plan.length - 1].restschuld, 0, 1e-6)
}

console.log('\n— Zinssatz null —')
const zinslos: Kreditparameter = { summe: 12_000, zinsProzent: 0 }
nahe('12.000 auf 10 Jahre → 100 pro Monat', rateBeiLaufzeit(zinslos, 10), 100, 1e-9)
nahe(
  'ohne Zins sind die Gesamtkosten die Summe',
  auswerten(zinslos, 100).gesamtkosten,
  12_000,
  1e-6
)
nahe('… und die Zinsen null', auswerten(zinslos, 100).zinsenGesamt, 0, 1e-9)

console.log('\n— Rate deckt den Zins nicht —')
// 4 % auf 200.000 sind rund 667 im ersten Monat. Eine Rate von 500 tilgt nie.
const zuKlein = tilgungsplan(kredit, 500)
wahr('Plan bricht ab statt endlos zu laufen', zuKlein.length === 0)
wahr('Auswertung meldet null Monate', auswerten(kredit, 500).monate === 0)

console.log('\n— Monotonie —')
const kurz = auswerten(kredit, rateBeiLaufzeit(kredit, 10))
const lang = auswerten(kredit, rateBeiLaufzeit(kredit, 30))
wahr('längere Laufzeit → kleinere Rate', lang.rate < kurz.rate)
wahr('längere Laufzeit → höhere Gesamtkosten', lang.gesamtkosten > kurz.gesamtkosten)
wahr(
  'höherer Zins → höhere Gesamtkosten bei gleicher Laufzeit',
  auswerten(
    { ...kredit, zinsProzent: 6 },
    rateBeiLaufzeit({ ...kredit, zinsProzent: 6 }, 20)
  ).gesamtkosten > auswerten(kredit, rateBeiLaufzeit(kredit, 20)).gesamtkosten
)

console.log('\n— Zusammensetzung der Rate —')
const plan20 = tilgungsplan(kredit, rateBeiLaufzeit(kredit, 20))
wahr('erste Rate: Zins über Tilgung', plan20[0].zins > plan20[0].tilgung)
wahr(
  'letzte Rate: Tilgung über Zins',
  plan20[plan20.length - 1].tilgung > plan20[plan20.length - 1].zins
)
wahr(
  'Zinsanteil sinkt monoton',
  plan20.every((monat, i) => i === 0 || monat.zins <= plan20[i - 1].zins + 1e-9)
)
nahe(
  'erster Zins ist Summe mal Monatszins',
  plan20[0].zins,
  (kredit.summe * kredit.zinsProzent) / 100 / 12,
  1e-9
)

console.log('\n— Rate aus dem Tilgungssatz —')
// 4 % Zins plus 2 % Tilgung sind 6 % von 200.000 im Jahr, also 1.000 im Monat.
nahe('4 % Zins, 2 % Tilgung → 1.000', rateBeiTilgungssatz(kredit, 2), 1000, 1e-9)
wahr(
  'höhere Anfangstilgung → kürzere Laufzeit',
  auswerten(kredit, rateBeiTilgungssatz(kredit, 3)).monate <
    auswerten(kredit, rateBeiTilgungssatz(kredit, 2)).monate
)

console.log('\n— Restschuld —')
const rate2 = rateBeiTilgungssatz(kredit, 2)
wahr('nach 10 Jahren steht noch etwas offen', restschuldNach(kredit, rate2, 10) > 0)
wahr(
  'Restschuld sinkt mit der Zeit',
  restschuldNach(kredit, rate2, 15) < restschuldNach(kredit, rate2, 10)
)
nahe(
  'nach Ende der Laufzeit ist sie null',
  restschuldNach(kredit, rateBeiLaufzeit(kredit, 20), 20),
  0,
  1e-6
)
wahr(
  'höhere Anfangstilgung → niedrigere Restschuld nach 10 Jahren',
  restschuldNach(kredit, rateBeiTilgungssatz(kredit, 3), 10) <
    restschuldNach(kredit, rate2, 10)
)

console.log('\n— Summenprobe —')
const gepruefte = auswerten(kredit, rateBeiLaufzeit(kredit, 20))
const summeTilgung = plan20.reduce((s, m) => s + m.tilgung, 0)
nahe('alle Tilgungen ergeben die Darlehenssumme', summeTilgung, kredit.summe, 1e-6)
nahe(
  'Gesamtkosten sind Summe plus Zinsen',
  gepruefte.gesamtkosten,
  kredit.summe + gepruefte.zinsenGesamt,
  1e-9
)

/* ------------------------------------------------------- Sondertilgung */

/*
  Die Sondertilgung ist die Stelle, an der ein Rechner am leichtesten zu viel
  verspricht – und niemand rechnet nach.

  Geprüft wird deshalb gegen den Kredit **ohne** sie: Die Summe aller
  Zahlungen muss stimmen, die Laufzeit muss kürzer werden, und die Ersparnis
  darf nicht größer sein als das, was die getilgten Beträge über die
  Restlaufzeit überhaupt an Zinsen erzeugt hätten.
*/
console.log('\n— Sondertilgung —')

const rateStandard = rateBeiTilgungssatz(kredit, 2)
const mitSonder = tilgungsplan(kredit, rateStandard, 12 * 60, 5_000)
const ohneSonder = tilgungsplan(kredit, rateStandard)

wahr('mit Sondertilgung ist der Kredit früher weg', mitSonder.length < ohneSonder.length)

nahe(
  'alle Zahlungen ergeben zusammen die Darlehenssumme',
  mitSonder.reduce((s, m) => s + m.tilgung + m.sondertilgung, 0),
  kredit.summe,
  1e-6
)

wahr(
  'gezahlt wird nur im zwölften Monat des Jahres',
  mitSonder.every((m) => m.sondertilgung === 0 || m.monat % 12 === 0)
)

wahr(
  'ohne Sondertilgung steht überall null',
  ohneSonder.every((m) => m.sondertilgung === 0)
)

const wirkung = sondertilgungswirkung(kredit, rateStandard, 5_000)

wahr('die Zinsersparnis ist positiv', wirkung.zinsersparnis > 0)
wahr('der Kredit endet Jahre früher', wirkung.monateFrueher > 12)

/*
  Die Obergrenze der Ersparnis.

  Jeder sondergetilgte Euro erspart höchstens die Zinsen, die er bis zum
  regulären Ende erzeugt hätte – über 27 Jahre bei 3,8 % sind das rund 1,80 €
  je Euro. Liegt die gerechnete Ersparnis darüber, zählt die Rechnung etwas
  doppelt. Diese Prüfung ist der Grund, warum die Wirkung aus zwei echten
  Durchläufen kommt und nicht aus einer Näherungsformel.
*/
wahr(
  'jeder Euro erspart weniger, als er über die Restlaufzeit an Zinsen erzeugt hätte',
  wirkung.ersparnisJeEuro > 0 && wirkung.ersparnisJeEuro < 2
)

nahe(
  'eingezahlt wurde, was der Plan ausweist',
  wirkung.eingezahlt,
  mitSonder.reduce((s, m) => s + m.sondertilgung, 0),
  1e-9
)

wahr(
  'ohne Sondertilgung ändert sich nichts',
  sondertilgungswirkung(kredit, rateStandard, 0).zinsersparnis === 0 &&
    sondertilgungswirkung(kredit, rateStandard, 0).ersparnisJeEuro === 0
)

wahr(
  'eine Sondertilgung über der Restschuld tilgt nur, was offen ist',
  (() => {
    const plan = tilgungsplan(kredit, rateStandard, 12 * 60, 1_000_000)
    return (
      plan.every((m) => m.restschuld >= 0) &&
      Math.abs(plan.reduce((s, m) => s + m.tilgung + m.sondertilgung, 0) - kredit.summe) <
        1e-6
    )
  })()
)

wahr(
  'die Restschuld bei Bindungsende sinkt durch die Sondertilgung',
  restschuldNach(kredit, rateStandard, 10, 5_000) <
    restschuldNach(kredit, rateStandard, 10)
)

/* --------------------------------------------------------- Anschluss */

/*
  Verglichen wird bei gleicher Restlaufzeit, nicht bei gleicher Rate.

  Wer die Rate gleich lässt, verschiebt die Mehrkosten ans Ende der Laufzeit
  und sieht sie nicht. Die Prüfung hält deshalb fest, dass ein höherer Zins
  eine höhere Rate ergibt – und dass ein gleicher Zins keinen Unterschied
  macht. Ohne den zweiten Teil wäre nicht ausgeschlossen, dass die Rechnung
  immer etwas findet.
*/
console.log('\n— Anschlussfinanzierung —')

const rest10 = restschuldNach(kredit, rateStandard, 10)
const anschluss = anschlussvergleich(rest10, 3.8, 4.8, 17 * 12)

wahr('ein Prozentpunkt mehr kostet jeden Monat mehr', anschluss.mehrProMonat > 0)
nahe(
  'die Gesamtmehrkosten sind die Monatsdifferenz über die Restlaufzeit',
  anschluss.mehrGesamt,
  anschluss.mehrProMonat * 17 * 12,
  1e-6
)
nahe(
  'gleicher Zins, kein Unterschied',
  anschlussvergleich(rest10, 3.8, 3.8, 17 * 12).mehrProMonat,
  0,
  1e-9
)
wahr(
  'ein niedrigerer Anschlusszins entlastet',
  anschlussvergleich(rest10, 3.8, 2.8, 17 * 12).mehrProMonat < 0
)

/* --------------------------------------------------------------- CSV */

/*
  Die Datei entsteht im Browser – ein Fehler fiele in keiner Bauprüfung auf,
  sondern erst in der Tabellenkalkulation eines Besuchers.
*/
console.log('\n— Tilgungsplan als Datei —')

const csv = baueTilgungsplanCsv(mitSonder, {
  summe: kredit.summe,
  zinsProzent: kredit.zinsProzent,
  rate: rateStandard,
  sondertilgungProJahr: 5_000,
})
const zeilen = csv.trimEnd().split('\n')
const datenzeilen = zeilen.filter((z) => !z.startsWith('#') && !z.startsWith('Monat'))

nahe('je Monat eine Zeile', datenzeilen.length, mitSonder.length, 0)
wahr('die Kopfzeile nennt alle sechs Spalten', zeilen[3].split(';').length === 6)
wahr(
  'jede Zeile hat sechs Felder',
  datenzeilen.every((z) => z.split(';').length === 6)
)
wahr(
  'Zahlen mit Punkt, damit jede Weiterverarbeitung sie liest',
  datenzeilen.every((z) => !z.includes(','))
)
wahr(
  'die Annahmen stehen als Kommentar darüber',
  zeilen[0].startsWith('# Tilgungsplan') && zeilen[1].includes('Sondertilgung')
)
wahr(
  'ohne Sondertilgung sagt der Kopf das auch',
  baueTilgungsplanCsv(ohneSonder, {
    summe: kredit.summe,
    zinsProzent: kredit.zinsProzent,
    rate: rateStandard,
    sondertilgungProJahr: 0,
  }).includes('ohne Sondertilgung')
)
wahr(
  'das Kreditjahr zählt ab eins',
  datenzeilen[0].split(';')[1] === '1' && datenzeilen[12].split(';')[1] === '2'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
