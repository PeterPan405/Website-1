/**
 * Die Gegenprobe der Aktienzahlen – Anlass in
 * `scripts/fundamentaldaten-gegenprobe.ts`.
 *
 * Ausführen mit `npm test`.
 */
import { gesprungen } from '../scripts/fundamentaldaten-gegenprobe.ts'

let failed = 0
function pruefe(was: string, bedingung: boolean): void {
  if (bedingung) console.log(`OK   ${was}`)
  else {
    failed++
    console.log(`FEHL ${was}`)
  }
}

const alt = {
  unternehmen: { 'SOLB.BR': { aktien: 109905660 }, AAPL: { aktien: 14594180000 } },
}
pruefe(
  'Solvay vom 24.10.2026: ein Hundertstel wird erkannt',
  gesprungen(alt, { unternehmen: { 'SOLB.BR': { aktien: 1099057 } } }).join() ===
    'SOLB.BR'
)
pruefe(
  'ein Split 10:1 bleibt erlaubt',
  gesprungen(alt, { unternehmen: { AAPL: { aktien: 145941800000 } } }).length === 0
)
pruefe(
  'Rückkäufe bleiben erlaubt',
  gesprungen(alt, { unternehmen: { AAPL: { aktien: 14200000000 } } }).length === 0
)
pruefe(
  'ein neuer Titel hat nichts zu vergleichen',
  gesprungen(alt, { unternehmen: { NEU: { aktien: 5 } } }).length === 0
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
