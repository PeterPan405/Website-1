/**
 * Prüfungen für den EZB-Parser.
 *
 * Ausführen mit `npm test`. Läuft ohne Test-Framework über den Test-Runner von
 * Node und liest TypeScript direkt (`--experimental-strip-types`).
 *
 * Geprüft wird ausschließlich das Zerlegen der XML-Antwort, nicht der Abruf –
 * ein Test, der die EZB tatsächlich anfragt, würde bei jeder Störung dort
 * fehlschlagen und wäre damit kein Test dieses Codes. Die Beispieldaten sind
 * dem Originalformat nachgebildet, inklusive der Sonderfälle, an denen ein
 * solcher Parser erfahrungsgemäß scheitert.
 */

import { parseEcbEnvelope, seriesForCurrency } from '../lib/providers/ecb.ts'

let failed = 0
function check(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  const ok = a === e
  if (!ok) failed++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : `\n     erwartet ${e}\n     erhalten ${a}`}`
  )
}

// Tagesdatei im Originalformat der EZB: einfache Anfuehrungszeichen,
// Namensraum-Praefixe, selbstschliessende innere Cubes.
const daily = `<?xml version="1.0" encoding="UTF-8"?>
<gesmes:Envelope xmlns:gesmes="http://www.gesmes.org/xml/2002-08-01" xmlns="http://www.ecb.int/vocabulary/2002-08-01/eurofxref">
<gesmes:subject>Reference rates</gesmes:subject>
<gesmes:Sender><gesmes:name>European Central Bank</gesmes:name></gesmes:Sender>
<Cube><Cube time='2026-07-24'>
<Cube currency='USD' rate='1.0812'/>
<Cube currency='JPY' rate='168.42'/>
<Cube currency='CHF' rate='0.9385'/>
<Cube currency='GBP' rate='0.84215'/>
<Cube currency='CNY' rate='7.8134'/>
</Cube></Cube></gesmes:Envelope>`

const d = parseEcbEnvelope(daily)
check('Tagesdatei: ein Tag', d.length, 1)
check('Tagesdatei: Datum', d[0].date, '2026-07-24')
check('Tagesdatei: USD', d[0].rates.USD, 1.0812)
check('Tagesdatei: GBP mit 5 Stellen', d[0].rates.GBP, 0.84215)
check('Tagesdatei: Anzahl Waehrungen', Object.keys(d[0].rates).length, 5)

// Historie: mehrere Tage, von der EZB absteigend geliefert.
const hist = `<gesmes:Envelope><Cube>
<Cube time='2026-07-24'><Cube currency='USD' rate='1.0812'/><Cube currency='CHF' rate='0.9385'/></Cube>
<Cube time='2026-07-23'><Cube currency='USD' rate='1.0798'/><Cube currency='CHF' rate='0.9390'/></Cube>
<Cube time='2026-07-22'><Cube currency='USD' rate='1.0771'/><Cube currency='CHF' rate='0.9402'/></Cube>
</Cube></gesmes:Envelope>`

const h = parseEcbEnvelope(hist)
check('Historie: drei Tage', h.length, 3)
check(
  'Historie: aufsteigend sortiert',
  h.map((x) => x.date),
  ['2026-07-22', '2026-07-23', '2026-07-24']
)
check('Historie: kein Uebergreifen zwischen Tagen', h[1].rates.USD, 1.0798)
check(
  'Zeitreihe USD',
  seriesForCurrency(h, 'USD').map((p) => p.value),
  [1.0771, 1.0798, 1.0812]
)
check('Zeitreihe unbekannte Waehrung', seriesForCurrency(h, 'XXX'), [])

// Sonderfaelle
const na = `<Cube><Cube time='2026-07-24'><Cube currency='USD' rate='N/A'/><Cube currency='CHF' rate='0.9385'/></Cube></Cube>`
check('rate=N/A wird verworfen', parseEcbEnvelope(na)[0].rates, { CHF: 0.9385 })

const dq = `<Cube><Cube time="2026-07-24"><Cube currency="USD" rate="1.05"/></Cube></Cube>`
check('doppelte Anfuehrungszeichen', parseEcbEnvelope(dq)[0].rates.USD, 1.05)

check('leeres Dokument', parseEcbEnvelope(''), [])
check('HTML-Fehlerseite statt XML', parseEcbEnvelope('<html><body>503</body></html>'), [])

const gap = `<Cube><Cube time='2026-07-24'></Cube><Cube time='2026-07-23'><Cube currency='USD' rate='1.08'/></Cube></Cube>`
check(
  'Tag ohne Kurse faellt heraus',
  parseEcbEnvelope(gap).map((x) => x.date),
  ['2026-07-23']
)

console.log(
  failed === 0 ? '\nAlle Pruefungen bestanden' : `\n${failed} Pruefung(en) fehlgeschlagen`
)
process.exit(failed === 0 ? 0 : 1)
