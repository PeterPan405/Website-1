/**
 * Schreibt die Kurse als kleine Datei, die der Browser nachladen kann.
 *
 * ## Warum es diese Datei gibt
 *
 * Bis August 2026 standen die Kurse ausschließlich im gebauten HTML. Jede
 * Kursänderung hieß damit: 1.524 Seiten neu bauen und übertragen, rund
 * dreizehn Minuten. Der Text auf diesen Seiten ändert sich nicht – nur eine
 * Zahl darin.
 *
 * Diese Datei löst das. Sie enthält nur, was sich häufig ändert: den zuletzt
 * gehandelten Preis je Instrument und die Devisenkurse. Rund 70 KB. Sie lässt
 * sich in Sekunden auf den Server legen, ohne irgendetwas zu bauen.
 *
 * ## Warum das HTML seinen Kurs trotzdem behält
 *
 * Weil ein Platzhalter schlechter wäre als ein alter Kurs. Die Seite kommt
 * mit dem Stand des letzten Baus – vollständig, lesbar, für Suchmaschinen
 * sichtbar – und der Browser ersetzt ihn, sobald er diese Datei gelesen hat.
 * Wer kein JavaScript ausführt, sieht den gebauten Stand; wer eines hat,
 * sieht den frischen. Niemand sieht ein leeres Feld.
 *
 * ## Warum sie nicht im Repository liegt
 *
 * Sie entsteht beim Bauen aus `data/snapshots/kurse-aktuell.json` und ist
 * damit eine Ableitung, kein Bestand. Zwei Dateien mit demselben Inhalt
 * versionieren heißt, sie irgendwann auseinanderlaufen zu lassen.
 *
 * Aufruf: npm run kurselive   (läuft automatisch vor jedem Bau)
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const QUELLE = 'data/snapshots/kurse-aktuell.json'
const ZIEL = 'public/kurse-live.json'

interface Kursstand {
  fetchedAt?: string | null
  latest?: Record<string, { value: number; at: string }>
  devisen?: Record<string, number>
}

const stand = JSON.parse(readFileSync(QUELLE, 'utf8')) as Kursstand

/*
  Bewusst dieselbe Form wie die Quelle, nur ohne alles Übrige. Wer die Datei
  im Browser öffnet, soll sie ohne Übersetzungstabelle verstehen – und wer
  hier etwas ergänzt, soll nicht zwei Formate im Kopf behalten müssen.
*/
const live = {
  fetchedAt: stand.fetchedAt ?? null,
  latest: stand.latest ?? {},
  devisen: stand.devisen ?? {},
}

mkdirSync('public', { recursive: true })
writeFileSync(ZIEL, JSON.stringify(live))

const anzahl = Object.keys(live.latest).length
const groesse = Buffer.byteLength(JSON.stringify(live))
console.log(
  `[kurselive] ${ZIEL}: ${anzahl} Instrumente, ${(groesse / 1024).toFixed(0)} KB, ` +
    `Stand ${live.fetchedAt ?? '—'}.`
)
