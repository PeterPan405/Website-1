/**
 * Prüfungen für die Schätzung fehlender Länderkennzahlen.
 *
 * Bei einer Schätzung ist der gefährlichste Fehler nicht eine ungenaue Zahl,
 * sondern eine, die niemand als Schätzung erkennt. Die Rechnung selbst muss
 * deshalb zweierlei können: an bekannten Verhältnissen das Richtige treffen,
 * und dort abbrechen, wo die Grundlage fehlt.
 *
 * Der zweite Teil ist der wichtigere. Eine Regression liefert auf jede Eingabe
 * eine Zahl – auch auf drei Punkte, auch auf Unsinn. Mehrere Prüfungen hier
 * gelten deshalb dem Gegenteil eines Ergebnisses.
 */

import {
  passeAn,
  schaetze,
  typischerFehlerProzent,
  type Beobachtung,
} from '../lib/schaetzung.ts'

let failed = 0

function pruefe(name: string, bedingung: boolean) {
  if (!bedingung) failed++
  console.log(`${bedingung ? 'OK  ' : 'FEHL'} ${name}`)
}

function nahe(name: string, ist: number | null, soll: number, toleranz: number) {
  const ok = ist !== null && Math.abs(ist - soll) <= toleranz
  if (!ok) failed++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : ` – ${ist} statt ${soll} ± ${toleranz}`}`
  )
}

console.log('— Die Anpassung —')

/*
  Ein exaktes Potenzgesetz: y = 3 · x^0,8.

  Daran muss die Regression die Koeffizienten auf viele Stellen genau
  wiederfinden. Trifft sie hier nicht, stimmt die Rechnung nicht.
*/
const exakt: Beobachtung[] = Array.from({ length: 20 }, (_, i) => {
  const x = 1000 * (i + 1)
  return { x, y: 3 * x ** 0.8 }
})
{
  const modell = passeAn(exakt)
  pruefe('ein exaktes Potenzgesetz wird erkannt', modell !== null)
  nahe('der Exponent stimmt', modell?.b ?? null, 0.8, 1e-9)
  nahe('der Vorfaktor stimmt', Math.exp(modell?.a ?? 0), 3, 1e-6)
  nahe('die Bestimmtheit ist eins', modell?.bestimmtheit ?? null, 1, 1e-9)
  pruefe('die Zahl der Beobachtungen stimmt', modell?.beobachtungen === 20)
  pruefe(
    'die Spanne der Eingangswerte wird festgehalten',
    modell?.spanne.von === 1000 && modell?.spanne.bis === 20000
  )
}

{
  const modell = passeAn(exakt)!
  nahe('und die Schätzung trifft', schaetze(modell, 5000), 3 * 5000 ** 0.8, 1e-6)
}

console.log('\n— Wo die Rechnung abbrechen muss —')

pruefe('unter zehn Beobachtungen kein Modell', passeAn(exakt.slice(0, 9)) === null)
pruefe('bei genau zehn schon', passeAn(exakt.slice(0, 10)) !== null)

/*
  Null und negative Werte haben keinen Logarithmus. Sie dürfen die Anpassung
  nicht verunreinigen, sondern fallen heraus – und wenn dadurch zu wenige
  übrig bleiben, gibt es kein Modell.
*/
{
  const verunreinigt: Beobachtung[] = [
    ...exakt.slice(0, 12),
    { x: 0, y: 100 },
    { x: -5, y: 100 },
    { x: 1000, y: 0 },
    { x: Number.NaN, y: 100 },
  ]
  const modell = passeAn(verunreinigt)
  pruefe('unbrauchbare Paare fallen weg', modell?.beobachtungen === 12)
  nahe('und verfälschen den Exponenten nicht', modell?.b ?? null, 0.8, 1e-9)
}

pruefe(
  'zu wenige brauchbare Paare ergeben null',
  passeAn([...exakt.slice(0, 8), { x: 0, y: 1 }, { x: -1, y: 1 }, { x: 1, y: 0 }]) ===
    null
)

{
  const modell = passeAn(exakt)!
  pruefe('ein Eingangswert von null ergibt keine Schätzung', schaetze(modell, 0) === null)
  pruefe('ein negativer ebenso', schaetze(modell, -100) === null)
  pruefe('NaN ebenso', schaetze(modell, Number.NaN) === null)
}

{
  // Alle Eingangswerte gleich: Es gibt keine Steigung, die etwas bedeutet.
  const senkrecht: Beobachtung[] = Array.from({ length: 12 }, (_, i) => ({
    x: 500,
    y: 100 + i,
  }))
  pruefe('ohne Streuung im Eingang kein Modell', passeAn(senkrecht) === null)
}

console.log('\n— Der beigelegte Fehler —')

nahe('bei exakten Daten ist er null', typischerFehlerProzent(exakt), 0, 1e-6)
pruefe(
  'unter elf Beobachtungen kein Fehlermaß',
  typischerFehlerProzent(exakt.slice(0, 10)) === null
)

{
  /*
    Verrauschte Daten müssen einen Fehler ergeben, der größer als null und
    kleiner als hundert Prozent ist. Der Wert wird beim Weglassen gemessen,
    nicht an der Anpassung – sonst wäre er künstlich klein.
  */
  const rauschen: Beobachtung[] = exakt.map((p, i) => ({
    x: p.x,
    y: p.y * (i % 2 === 0 ? 1.15 : 0.87),
  }))
  const fehler = typischerFehlerProzent(rauschen)
  pruefe('verrauschte Daten ergeben einen Fehler über null', (fehler ?? 0) > 1)
  pruefe('und einen unter hundert Prozent', (fehler ?? 100) < 100)
}

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
