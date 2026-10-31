/**
 * Die Gegenprobe der Aktienzahlen – Anlass in
 * `scripts/fundamentaldaten-gegenprobe.ts`.
 *
 * Ausführen mit `npm test`.
 */
import { gesprungen, verschlechtert } from '../scripts/fundamentaldaten-gegenprobe.ts'

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

/* 31.10.2026: ältere ESEF-Abschlüsse statt der jüngsten. */
const vorher = {
  unternehmen: {
    'CPG.L': { waehrung: 'USD', umsatz: 46070000000, gewinn: 1868000000 },
    'LGEN.L': { waehrung: 'GBP', umsatz: 2167000000, gewinn: 592000000 },
    'INVE-B.ST': { waehrung: 'SEK', umsatz: 63196000000, gewinn: 113338000000 },
    'OK.L': { waehrung: 'GBP', umsatz: 1000, gewinn: 100 },
  },
}
const nachher = {
  unternehmen: {
    'CPG.L': { waehrung: 'GBP', umsatz: 25512000000, gewinn: 1113000000 },
    'LGEN.L': { waehrung: 'GBP', umsatz: -89294000000, gewinn: 2291000000 },
    'INVE-B.ST': { waehrung: 'SEK', umsatz: 40737000000, gewinn: 228065000000 },
    'OK.L': { waehrung: 'GBP', umsatz: 1100, gewinn: 120 },
  },
}
const schlechter = verschlechtert(vorher, nachher)
  .map((t) => t.k)
  .sort()
pruefe(
  'Compass (Währungswechsel), L&G (negativer Umsatz), Investor (Gewinn > 5× Umsatz) werden erkannt',
  schlechter.join() === 'CPG.L,INVE-B.ST,LGEN.L'
)
pruefe('ein unauffälliger neuer Abschluss wird übernommen', !schlechter.includes('OK.L'))
pruefe(
  'ein schon unplausibler Vorgänger wird nicht festgehalten',
  verschlechtert(
    { unternehmen: { X: { umsatz: -1 } } },
    { unternehmen: { X: { umsatz: 5 } } }
  ).length === 0
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
