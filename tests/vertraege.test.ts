/**
 * Prüfungen für die Vertragsprüfung.
 *
 * Ausführen mit `npm test`.
 *
 * Geprüft wird ausschließlich das Auswerten der Antworten, nicht der Abruf.
 * Ein Test, der die EZB tatsächlich anfragt, schlüge bei jeder Störung dort
 * fehl und wäre damit kein Test dieses Codes – und aus dieser Umgebung heraus
 * ginge er ohnehin nicht durch den Proxy.
 *
 * Die Beispielantworten sind echten Antworten nachgebildet, einschließlich der
 * Fälle, an denen die Prüfung greifen soll: der eingestellten ICP-Reihe und
 * einer Twelve-Data-Fehlermeldung, die mit Statuscode 200 kommt.
 */

import { letzteSdmxBeobachtung, VERTRAEGE } from '../lib/vertraege.ts'

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

const JETZT = new Date('2026-07-31T08:00:00Z')

function vertrag(name: string) {
  const gefunden = VERTRAEGE.find((v) => v.name === name)
  if (!gefunden) throw new Error(`Vertrag „${name}“ fehlt`)
  return gefunden
}

// ------------------------------------------------------------- SDMX-Auswertung

const csvKopf =
  'KEY,FREQ,REF_AREA,ADJUSTMENT,ICP_ITEM,DATA_PROVIDER,ICP_SUFFIX,TIME_PERIOD,OBS_VALUE,OBS_STATUS'
const csvFrisch = `${csvKopf}\nHICP.M.U2.N.000000.4D0.ANR,M,U2,N,000000,4D0,ANR,2026-06,2.8,A`
const csvTot = `${csvKopf}\nICP.M.U2.N.000000.4.ANR,M,U2,N,000000,4,ANR,2025-12,1.9,A`

check('letzte Beobachtung wird gelesen', letzteSdmxBeobachtung(csvFrisch), {
  zeitraum: '2026-06',
  wert: '2.8',
})
check('ohne Datenzeile kommt null', letzteSdmxBeobachtung(csvKopf), null)
check('ohne die erwarteten Spalten kommt null', letzteSdmxBeobachtung('a,b\n1,2'), null)

// ------------------------------------------------- Der Fall, um den es ging

/*
  Die Antwort, die ICP bis zuletzt gab: Statuscode 200, gültiges CSV, echte
  Zahlen – und eine Reihe, die im Dezember 2025 endet. Genau das soll auffallen.
*/
const inflationEuroraum = vertrag('EZB · Inflation Euroraum')
check(
  'die frische HICP-Reihe hält den Vertrag',
  inflationEuroraum.pruefe(csvFrisch, JETZT),
  null
)
check(
  'die eingestellte ICP-Reihe bricht ihn',
  inflationEuroraum.pruefe(csvTot, JETZT) !== null,
  true
)
check(
  'und die Meldung nennt das Alter',
  (inflationEuroraum.pruefe(csvTot, JETZT) ?? '').includes('211 Tage'),
  true
)
check(
  'eine Antwort ohne Beobachtung bricht ihn ebenfalls',
  inflationEuroraum.pruefe(csvKopf, JETZT) !== null,
  true
)

// ------------------------------------------------------------- Wechselkurse

const fxFrisch =
  `<?xml version="1.0"?><gesmes:Envelope><Cube><Cube time='2026-07-30'>` +
  `<Cube currency='USD' rate='1.0812'/><Cube currency='CHF' rate='0.9331'/></Cube></Cube></gesmes:Envelope>`
const devisen = vertrag('EZB · Wechselkurse')
check('frische Tagesdatei hält', devisen.pruefe(fxFrisch, JETZT), null)
check(
  'fehlender US-Dollar bricht',
  devisen.pruefe(fxFrisch.replace(/currency='USD'/, "currency='XXX'"), JETZT) !== null,
  true
)
check(
  'alte Tagesdatei bricht',
  devisen.pruefe(fxFrisch.replace('2026-07-30', '2026-01-05'), JETZT) !== null,
  true
)

// ------------------------------------------------------------------- Yahoo

const yahoo = vertrag('Yahoo · Kursverlauf')
check(
  'erwartete Struktur hält',
  yahoo.pruefe('{"chart":{"result":[{"meta":{"regularMarketPrice":213.4}}]}}', JETZT),
  null
)
check(
  'umbenanntes Feld bricht',
  yahoo.pruefe('{"chart":{"result":[{"meta":{"preis":213.4}}]}}', JETZT) !== null,
  true
)
check('kein JSON bricht', yahoo.pruefe('<html>Fehler</html>', JETZT) !== null, true)

// -------------------------------------------------------------- Twelve Data

/*
  Twelve Data meldet ein erschöpftes Kontingent mit Statuscode 200 und einem
  `status`-Feld im Rumpf. Wer nur den Statuscode prüft, hält das für Erfolg –
  und schreibt eine leere Terminliste in den Bestand.
*/
const termine = vertrag('Twelve Data · Quartalstermine')
check(
  'gültige Terminliste hält',
  termine.pruefe('{"earnings":[{"date":"2026-10-29"}]}', JETZT),
  null
)
check(
  'Fehler mit Statuscode 200 bricht',
  termine.pruefe(
    '{"status":"error","message":"You have run out of API credits"}',
    JETZT
  ) !== null,
  true
)

// ------------------------------------------------------------------ Hygiene

check(
  'kein Vertrag trägt einen Schlüssel in der anzeigbaren Adresse',
  VERTRAEGE.every(
    (v) => !/apikey=[^&\s]/i.test(v.adresse) && !/crtfc_key=/i.test(v.adresse)
  ),
  true
)
check(
  'jeder Vertrag sagt, wofür die Quelle gebraucht wird',
  VERTRAEGE.every((v) => v.zweck.length > 20),
  true
)
check(
  'jeder Vertrag mit Schlüssel weiß, wie er die Adresse baut',
  VERTRAEGE.every((v) => !v.schluessel || typeof v.mitSchluessel === 'function'),
  true
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfungen fehlgeschlagen.`
)
if (failed > 0) process.exit(1)
