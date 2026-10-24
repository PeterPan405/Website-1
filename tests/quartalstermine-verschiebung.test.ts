/**
 * Die Gegenprobe vor dem Schreiben der Quartalstermine – Anlass in
 * `verschobeneZeiten()` (`scripts/quartalstermine-abrufen.ts`).
 *
 * Ausführen mit `npm test`.
 */
import {
  VERSCHIEBUNG_GRENZE,
  verschobeneZeiten,
} from '../scripts/quartalstermine-abrufen.ts'

let failed = 0
function pruefe(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) console.log(`OK   ${was}`)
  else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/* Die echten Werte vom 22. und 23.10.2026 – derselbe Tag, verschobene Stunde. */
const alt = {
  LMT: { '2026-07-23': '06:30', '2026-04-23': '06:36', '2026-01-29': '07:25' },
  CMCSA: { '2026-07-23': '06:06', '2026-04-23': '07:08', '2026-01-29': '07:08' },
  DECK: { '2026-07-23': '16:07', '2026-05-21': '16:06', '2026-01-29': '16:08' },
}
const verschoben = {
  LMT: {
    '2026-10-22': '10:26',
    '2026-07-23': '10:30',
    '2026-04-23': '10:36',
    '2026-01-29': '12:25',
  },
  CMCSA: {
    '2026-10-22': '11:05',
    '2026-07-23': '10:06',
    '2026-04-23': '11:08',
    '2026-01-29': '12:08',
  },
  DECK: {
    '2026-10-22': '20:09',
    '2026-07-23': '20:07',
    '2026-05-21': '20:06',
    '2026-01-29': '21:08',
  },
}
const befund = verschobeneZeiten(alt, verschoben)
pruefe(
  'der Fall vom 23.10.: alle neun bekannten Zeiten geändert',
  befund.verglichen === 9 && befund.abweichend === 9,
  JSON.stringify(befund)
)
pruefe(
  '… und das liegt über der Grenze',
  befund.abweichend / befund.verglichen > VERSCHIEBUNG_GRENZE
)
pruefe(
  'die Beispiele nennen Kürzel, Tag, alt und neu',
  befund.beispiele[0] === 'LMT 2026-07-23: 06:30 → 10:30',
  befund.beispiele[0]
)

const gesund = {
  LMT: { '2026-10-22': '06:26', ...alt.LMT },
  CMCSA: { '2026-10-22': '07:05', ...alt.CMCSA },
  DECK: { '2026-10-22': '16:09', ...alt.DECK },
}
const ruhig = verschobeneZeiten(alt, gesund)
pruefe(
  'ein gewöhnlicher Lauf: neue Meldungen zählen nicht, alte bleiben',
  ruhig.verglichen === 9 && ruhig.abweichend === 0,
  JSON.stringify(ruhig)
)
pruefe(
  'ein Titel ohne alten Stand wird nicht verglichen',
  verschobeneZeiten({}, verschoben).verglichen === 0
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
