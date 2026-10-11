/**
 * Ein kurzer Satz, der hängt, bekommt weitere Anläufe – **im Podcastlauf.**
 *
 * Ausführen mit `npm test`. Die eigentliche Prüfung steht in Python, in
 * `tests/stimme-anlaeufe-harness.py`: Sie führt die ausgelieferte Funktion
 * `sprich` aus `scripts/stimme-erzeugen.py` gegen ein Modell aus, das hängt.
 * Warum über echten Quelltext und nicht über eine Kopie, steht dort.
 *
 * ## Der Anlass
 *
 * Am 11. Oktober 2026 fiel die Folge des Tages aus – an einem Satz:
 *
 *     'Russland liefert künftig deutlich mehr Diesel an die USA.'
 *
 * 57 Zeichen, Punkt am Ende. Zu kurz zum Teilen, und sein Schlusszeichen
 * hatte er schon. Damit griff keine der beiden Rettungen, und nach einem
 * einzigen Anlauf war Schluss.
 *
 * `sprechstimme.py` hatte das am 10. August 2026 behoben und dazu
 * geschrieben, im Podcastskript stehe noch die widerlegte Begründung. Eine
 * Doppelung mit guter Begründung altert trotzdem – diese hatte nicht einmal
 * mehr eine. Wer eine zweite Stelle stehen lässt, schuldet ihr eine Prüfung,
 * die beide vergleicht. Das hier ist sie.
 *
 * ## Und ohne Python?
 *
 * Dann ist der Test **rot**, nicht übersprungen. Ein übersprungener Test sieht
 * aus wie ein bestandener, und genau diese Ruhe hat zwei Monate gehalten.
 * GitHub-Läufer bringen `python3` mit.
 */

import { spawnSync } from 'node:child_process'

const ergebnis = spawnSync('python3', ['-I', 'tests/stimme-anlaeufe-harness.py'], {
  encoding: 'utf8',
})

if (ergebnis.error) {
  console.log(`FEHL python3 ließ sich nicht starten: ${ergebnis.error.message}`)
  console.log('     Ohne Python keine Prüfung – und das gilt als Fehlschlag.')
  process.exit(1)
}

process.stdout.write(ergebnis.stdout)
if (ergebnis.stderr) process.stderr.write(ergebnis.stderr)
process.exit(ergebnis.status ?? 1)
