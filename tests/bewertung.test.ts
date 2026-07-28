/**
 * Prüfungen für die drei Rechnungen aus `lib/bewertung.ts`.
 *
 * Zwei Fälle sind hier die eigentlichen Kandidaten für einen stillen Fehler:
 *
 * 1. **Wachstum über den Kapitalkosten.** Die Formel liefert dann eine
 *    negative Zahl, die wie ein Ergebnis aussieht. Ein Unternehmen, dessen
 *    Zahlungen ewig schneller wachsen als der Abzinsungssatz, hat keinen
 *    endlichen Wert – das ist kein Randfall, sondern die Stelle, an der eine
 *    Bewertung aufhört, eine Aussage zu sein.
 *
 * 2. **Brutto gegen netto.** Der Ertrag einer Tilgung ist steuerfrei, der
 *    einer Anlage nicht. Wer die beiden Zahlen ohne Umrechnung vergleicht,
 *    stellt eine Nettogröße neben eine Bruttogröße und kommt systematisch zum
 *    falschen Schluss – zugunsten der Anlage.
 */

import { ewigeRente, noetigeBruttorendite, schuldenquotenpfad } from '../lib/bewertung.ts'

let failed = 0

function gleich(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (!ok) failed++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : `\n     erwartet ${JSON.stringify(expected)}\n     erhalten ${JSON.stringify(actual)}`}`
  )
}

function nahe(name: string, actual: number, expected: number, toleranz = 0.01) {
  const ok = Math.abs(actual - expected) <= toleranz
  if (!ok) failed++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : ` – erwartet ${expected}, erhalten ${actual}`}`
  )
}

function wahr(name: string, bedingung: boolean) {
  if (!bedingung) failed++
  console.log(`${bedingung ? 'OK  ' : 'FEHL'} ${name}`)
}

console.log('— Der Barwert —')
// Eine Zahlung von 1 bei 7 % Kapitalkosten und 2 % Wachstum: 1 / 0,05 = 20.
nahe('Zahlung geteilt durch die Differenz', ewigeRente(1, 7, 2)!, 20)
nahe('ohne Wachstum ist es der Kehrwert des Zinses', ewigeRente(1, 5, 0)!, 20)
nahe('die Zahlung skaliert linear', ewigeRente(3, 7, 2)!, 60)
gleich('Wachstum gleich Kapitalkosten ergibt null', ewigeRente(1, 5, 5), null)
gleich('Wachstum über den Kapitalkosten ergibt null', ewigeRente(1, 5, 6), null)
{
  // Die Empfindlichkeit, um die es im Thema geht.
  const basis = ewigeRente(1, 7, 4)!
  const hoeher = ewigeRente(1, 7.5, 4)!
  const abweichung = ((hoeher - basis) / basis) * 100
  wahr('ein halber Punkt mehr kostet zweistellig', abweichung < -10 && abweichung > -20)
  /*
    Hier stand eine Pfeilfunktion als Bedingung.

    `wahr(name, () => …)` bekommt ein Funktionsobjekt, und das ist immer
    wahr – die Prüfung hätte jeden Wert bestanden. Genau die Sorte Fehler,
    gegen die Prüfungen eigentlich helfen sollen.
  */
  const flach = ewigeRente(1, 7, 1)!
  const flachHoeher = ewigeRente(1, 7.5, 1)!
  const flachAbweichung = ((flachHoeher - flach) / flach) * 100
  wahr(
    'und wirkt bei hohem Wachstum stärker',
    Math.abs(flachAbweichung) < Math.abs(abweichung)
  )
}

console.log('\n— Tilgen oder anlegen —')
// Bei 26,375 % Steuer muss aus 3 % netto ein Bruttowert von 4,07 % werden.
nahe(
  'drei Prozent Kredit brauchen gut vier Prozent brutto',
  noetigeBruttorendite(3, 26.375),
  4.075,
  0.005
)
nahe('ohne Steuer bleibt es dieselbe Zahl', noetigeBruttorendite(3, 0), 3)
wahr(
  'je höher der Kreditzins, desto größer der Abstand',
  noetigeBruttorendite(12, 26.375) - 12 > noetigeBruttorendite(3, 26.375) - 3
)

console.log('\n— Die Schuldenquote —')
{
  const gleichstand = schuldenquotenpfad(100, 3, 3, 10)
  wahr(
    'Zins gleich Wachstum lässt die Quote stehen',
    gleichstand.every((wert) => Math.abs(wert - 100) < 0.0001)
  )
}
{
  const sinkend = schuldenquotenpfad(100, 2, 3, 20)
  wahr('Zins unter Wachstum senkt die Quote', sinkend[20] < 100)
  wahr('und zwar ohne jeden Überschuss', sinkend[20] < 90)
}
{
  const steigend = schuldenquotenpfad(100, 5, 3, 20)
  wahr('Zins über Wachstum hebt die Quote', steigend[20] > 100)
}
{
  const pfad = schuldenquotenpfad(60, 4, 2, 5)
  gleich('ein Wert je Jahr, Startjahr eingeschlossen', pfad.length, 6)
  nahe('das erste Jahr ist die Startquote', pfad[0], 60)
  // 60 · (1,04/1,02)⁵ = 66,12
  nahe('und der Rest folgt dem Faktor', pfad[5], 66.12, 0.01)
}

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
