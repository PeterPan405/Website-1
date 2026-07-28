/**
 * Prüfungen für die Optionsbewertung.
 *
 * Bei Black-Scholes hilft es wenig, einzelne Preise gegen getippte Sollwerte
 * zu halten – die hätte ich mit derselben Formel erzeugt, und ein
 * Vorzeichenfehler wäre in beiden. Geprüft wird deshalb gegen Eigenschaften,
 * die unabhängig von der Umsetzung gelten müssen:
 *
 * - **Put-Call-Parität.** Call minus Put muss exakt dem Kurs minus dem
 *   abgezinsten Basispreis entsprechen. Diese Beziehung folgt aus reiner
 *   Arbitrage und gilt in jedem Modell. Sie ist der schärfste Test.
 * - **Schranken.** Ein Optionspreis liegt nie unter dem inneren Wert und ein
 *   Call nie über dem Kurs des Basiswerts.
 * - **Monotonie.** Mehr Laufzeit, mehr Volatilität – mehr Prämie. Ein
 *   vertauschtes Vorzeichen im Exponenten bricht das sofort.
 * - **Grenzfälle.** Bei Restlaufzeit null bleibt der innere Wert übrig.
 * - **Delta-Bereiche.** Call-Delta zwischen 0 und 1, Put-Delta zwischen −1
 *   und 0, Theta negativ für Käufer.
 *
 * Dazu die Normalverteilung selbst, gegen bekannte Werte.
 */

import {
  gewinnschwelle,
  innererWert,
  normalverteilung,
  preis,
  sensitivitaeten,
  zeitwert,
  type Optionsparameter,
} from '../lib/optionen.ts'

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

const basis: Optionsparameter = {
  kurs: 100,
  basispreis: 100,
  jahre: 1,
  volatilitaetProzent: 20,
  zinsProzent: 3,
}

console.log('\n— Normalverteilung —')
nahe('N(0) = 0,5', normalverteilung(0), 0.5, 1e-9)
// Nicht 0,975: Das ist der gerundete Tabellenwert. Der wahre Wert von Φ(1,96)
// ist 0,97500210…, und die Näherung muss gegen ihn geprüft werden, nicht gegen
// die Rundung – sonst prüft der Test die eigene Ungenauigkeit.
nahe('N(1,96) ≈ 0,9750021', normalverteilung(1.96), 0.9750021048517795, 1e-6)
nahe('N(−1,96) ≈ 0,0249979', normalverteilung(-1.96), 0.0249978951482205, 1e-6)
nahe('N(1) ≈ 0,8413447', normalverteilung(1), 0.8413447460685429, 1e-6)
wahr('N ist monoton steigend', normalverteilung(0.5) < normalverteilung(0.6))

console.log('\n— Put-Call-Parität —')
for (const strike of [80, 100, 120]) {
  for (const jahre of [0.25, 1, 3]) {
    const p = { ...basis, basispreis: strike, jahre }
    const abgezinst = strike * Math.exp((-p.zinsProzent / 100) * jahre)
    nahe(
      `Strike ${strike}, ${jahre} Jahre`,
      preis('call', p) - preis('put', p),
      p.kurs - abgezinst,
      1e-6
    )
  }
}

console.log('\n— Schranken —')
for (const kurs of [70, 100, 130]) {
  const p = { ...basis, kurs }
  wahr(
    `Call bei Kurs ${kurs} nicht unter innerem Wert`,
    preis('call', p) >= innererWert('call', kurs, p.basispreis) - 1e-9
  )
  wahr(`Call bei Kurs ${kurs} nicht über dem Basiswert`, preis('call', p) <= kurs)
  /*
    Für den Put gilt die Schranke über den *abgezinsten* Basispreis.

    Ein europäischer Put darf unter seinem inneren Wert notieren, und das ist
    kein Rechenfehler: Wer ihn tief im Geld ausüben will, muss bis zum Verfall
    warten, und der Erlös von morgen ist heute weniger wert. Genau deshalb
    lohnt sich bei einem amerikanischen Put die vorzeitige Ausübung
    manchmal – bei einem Call ohne Dividende dagegen nie.
  */
  const untergrenzePut = Math.max(
    0,
    p.basispreis * Math.exp((-p.zinsProzent / 100) * p.jahre) - kurs
  )
  wahr(
    `Put bei Kurs ${kurs} nicht unter der abgezinsten Schranke`,
    preis('put', p) >= untergrenzePut - 1e-9
  )
  wahr(`Put bei Kurs ${kurs} nicht über dem Basispreis`, preis('put', p) <= p.basispreis)
}

console.log('\n— Monotonie —')
wahr(
  'mehr Laufzeit → teurerer Call',
  preis('call', { ...basis, jahre: 2 }) > preis('call', { ...basis, jahre: 1 })
)
wahr(
  'mehr Volatilität → teurerer Call',
  preis('call', { ...basis, volatilitaetProzent: 40 }) > preis('call', basis)
)
wahr(
  'mehr Volatilität → teurerer Put',
  preis('put', { ...basis, volatilitaetProzent: 40 }) > preis('put', basis)
)
wahr(
  'höherer Kurs → teurerer Call',
  preis('call', { ...basis, kurs: 110 }) > preis('call', basis)
)
wahr(
  'höherer Kurs → billigerer Put',
  preis('put', { ...basis, kurs: 110 }) < preis('put', basis)
)

console.log('\n— Grenzfall Verfall —')
nahe(
  'Call am Verfallstag, im Geld',
  preis('call', { ...basis, kurs: 120, jahre: 0 }),
  20,
  1e-9
)
nahe(
  'Call am Verfallstag, aus dem Geld',
  preis('call', { ...basis, kurs: 80, jahre: 0 }),
  0,
  1e-9
)
nahe(
  'Put am Verfallstag, im Geld',
  preis('put', { ...basis, kurs: 80, jahre: 0 }),
  20,
  1e-9
)

console.log('\n— Zeitwert —')
wahr('am Geld ist der Zeitwert die gesamte Prämie', zeitwert('call', basis) > 0)
nahe(
  'am Verfallstag kein Zeitwert mehr',
  zeitwert('call', { ...basis, kurs: 120, jahre: 0 }),
  0,
  1e-9
)
wahr(
  'weit im Geld ist der Zeitwert klein gegenüber dem inneren Wert',
  zeitwert('call', { ...basis, kurs: 200 }) <
    innererWert('call', 200, basis.basispreis) * 0.1
)

console.log('\n— Sensitivitäten —')
for (const kurs of [70, 100, 130]) {
  const call = sensitivitaeten('call', { ...basis, kurs })
  const put = sensitivitaeten('put', { ...basis, kurs })
  wahr(`Call-Delta bei ${kurs} zwischen 0 und 1`, call.delta > 0 && call.delta < 1)
  wahr(`Put-Delta bei ${kurs} zwischen −1 und 0`, put.delta > -1 && put.delta < 0)
  nahe(`Delta-Beziehung bei ${kurs}`, call.delta - put.delta, 1, 1e-9)
  wahr(`Gamma bei ${kurs} positiv`, call.gamma > 0)
  nahe(`Gamma für Call und Put gleich bei ${kurs}`, call.gamma, put.gamma, 1e-12)
  nahe(
    `Vega für Call und Put gleich bei ${kurs}`,
    call.vegaProProzentpunkt,
    put.vegaProProzentpunkt,
    1e-12
  )
}
wahr(
  'Theta eines gekauften Calls ist negativ',
  sensitivitaeten('call', basis).thetaProTag < 0
)
wahr(
  'Gamma ist am Geld am größten',
  sensitivitaeten('call', basis).gamma >
    sensitivitaeten('call', { ...basis, kurs: 150 }).gamma
)
wahr(
  'Zeitwertverfall beschleunigt sich zum Ende',
  Math.abs(sensitivitaeten('call', { ...basis, jahre: 1 / 12 }).thetaProTag) >
    Math.abs(sensitivitaeten('call', { ...basis, jahre: 1 }).thetaProTag)
)

console.log('\n— Gewinnschwelle —')
wahr(
  'Call: Schwelle liegt über dem Basispreis',
  gewinnschwelle('call', basis) > basis.basispreis
)
wahr(
  'Put: Schwelle liegt unter dem Basispreis',
  gewinnschwelle('put', basis) < basis.basispreis
)
nahe(
  'Call-Schwelle ist Basispreis plus Prämie',
  gewinnschwelle('call', basis),
  basis.basispreis + preis('call', basis),
  1e-12
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
