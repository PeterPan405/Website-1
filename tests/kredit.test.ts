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
  auswerten,
  rateBeiLaufzeit,
  rateBeiTilgungssatz,
  restschuldNach,
  tilgungsplan,
  type Kreditparameter,
} from '../lib/kredit.ts'

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

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
