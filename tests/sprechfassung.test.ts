/**
 * Prüfungen für die Sprechfassung des Podcasts.
 *
 * Die Regeln stammen aus der Arbeitsanweisung des von Hand geführten
 * Podcasts; jede Prüfung hier entspricht einem Punkt ihrer Checkliste.
 * Die Zahlwörter sind der heikelste Teil – ein falsches Zahlwort klingt
 * in der Vertonung plausibel und ist trotzdem eine falsche Zahl.
 */

import { readdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

import type { DailyEdition } from '../data/editions/types.ts'
import {
  baueFolge,
  folgennummer,
  ordnungszahl,
  sprechbar,
  zahlwort,
} from '../lib/sprechfassung.ts'

let gescheitert = 0
function pruefe(name: string, ist: unknown, soll: unknown) {
  const ok = JSON.stringify(ist) === JSON.stringify(soll)
  if (!ok) gescheitert++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : `\n     erwartet ${JSON.stringify(soll)}\n     erhalten ${JSON.stringify(ist)}`}`
  )
}

/* ------------------------------------------------------------- Zahlwörter */

pruefe('null', zahlwort(0), 'null')
pruefe('eins allein', zahlwort(1), 'eins')
pruefe('einundzwanzig', zahlwort(21), 'einundzwanzig')
pruefe('siebzehn', zahlwort(17), 'siebzehn')
pruefe('hundert', zahlwort(100), 'einhundert')
pruefe('500', zahlwort(500), 'fünfhundert')
pruefe(
  '26.068 – das Beispiel aus der Vorlage',
  zahlwort(26_068),
  'sechsundzwanzigtausendachtundsechzig'
)
pruefe('2026 als Jahreszahl', zahlwort(2026), 'zweitausendsechsundzwanzig')
pruefe(
  'eine Million zweihunderttausend',
  zahlwort(1_200_000),
  'eine Million zweihunderttausend'
)

pruefe('der 7. ist der siebte', ordnungszahl(7), 'siebte')
pruefe('der 1. ist der erste', ordnungszahl(1), 'erste')
pruefe('der 20. ist der zwanzigste', ordnungszahl(20), 'zwanzigste')
pruefe('der 31. ist der einunddreißigste', ordnungszahl(31), 'einunddreißigste')

/* --------------------------------------------------------- Sprechbarkeit */

pruefe(
  'Prozent mit Nachkommastellen, Ziffer für Ziffer',
  sprechbar('2,8 %'),
  'zwei Komma acht Prozent'
)
pruefe(
  'Punktestand aus der Vorlage',
  sprechbar('26.068,45 Punkte'),
  'sechsundzwanzigtausendachtundsechzig Komma vier fünf Punkte'
)
pruefe('S&P 500', sprechbar('Der S&P 500 stieg.'), 'Der S und P fünfhundert stieg.')
pruefe('Webadresse', sprechbar('auf iminvests.de'), 'auf iminvests punkt de')
pruefe(
  'Uhrzeit verbraucht ein folgendes „Uhr“',
  sprechbar('Um 01:22 Uhr lief die Meldung.'),
  'Um ein Uhr zweiundzwanzig lief die Meldung.'
)
pruefe('Datum vor der Zahlregel', sprechbar('der 7. August'), 'der siebte August')
pruefe(
  'Klammern werden zu Einschüben',
  sprechbar('bei 100 Punkten (+0,5 %)').includes('('),
  false
)

/* ----------------------------------------------------------- Die Folge */

pruefe('30.07. ist Folge 1', folgennummer('2026-07-30'), 1)
pruefe('06.08. ist Folge 6', folgennummer('2026-08-06'), 6)
pruefe('07.08. ist Folge 7', folgennummer('2026-08-07'), 7)
pruefe('10.08. (Montag) ist Folge 8', folgennummer('2026-08-10'), 8)

const dateien = readdirSync('data/editions').filter((n) =>
  /^\d{4}-\d{2}-\d{2}\.ts$/.test(n)
)
const juengste = dateien.sort().at(-1)!
const { edition } = (await import(pathToFileURL(`data/editions/${juengste}`).href)) as {
  edition: DailyEdition
}
const folge = baueFolge(edition)

pruefe(
  'Sprechtext beginnt mit der festen Begrüßung',
  folge.sprechtext.startsWith(
    'Guten Morgen und herzlich willkommen zum Marktupdate von IM Invests.'
  ),
  true
)
pruefe(
  'Sprechtext endet auf „viel Erfolg.“',
  folge.sprechtext.endsWith('viel Erfolg.'),
  true
)
/*
  Die Marke heißt **IM Invests**, nicht „IM Investments".

  Bis zum 9. August 2026 stand die längere Form an vier Stellen, darunter in
  Begrüßung und Abschluss jeder Folge – sie wurde also jeden Morgen zweimal
  laut ausgesprochen. Aufgefallen ist es dem Betreiber beim Hören einer
  Probe, nicht beim Lesen des Codes: Der falsche Name sieht plausibel aus,
  weil er wie eine ausgeschriebene Fassung des richtigen wirkt.

  Genau deshalb steht hier eine Prüfung und nicht nur eine Korrektur. Ein
  Name, der sich von selbst „vervollständigt", kommt zurück.
*/
pruefe(
  'Sprechtext nennt nirgends „IM Investments"',
  /IM Investments/.test(folge.sprechtext),
  false
)
pruefe('Fazit-Absatz vorhanden', folge.sprechtext.includes('Bleibt das Fazit.'), true)
pruefe('keine Ziffern im Sprechtext', /\d/.test(folge.sprechtext), false)
pruefe('keine Klammern im Sprechtext', /[()]/.test(folge.sprechtext), false)
pruefe('kein Prozentzeichen im Sprechtext', folge.sprechtext.includes('%'), false)
pruefe('Titel ohne Datum', /\d{1,2}\.\s*(August|Juli)/.test(folge.titel), false)
pruefe('Titel ohne „Marktupdate“', folge.titel.includes('Marktupdate'), false)
pruefe('Titel ohne Gedankenstrich', /[–—]/.test(folge.titel), false)
pruefe('mindestens drei Kapitel', folge.kapitel.length >= 3, true)
pruefe('erstes Kapitel ist die Begrüßung', folge.kapitel[0], 'Begrüßung und Überblick')
pruefe(
  'Beschreibung trägt den KI-Hinweis',
  folge.beschreibung.includes('Unterstützung von KI-Werkzeugen'),
  true
)
pruefe(
  'Beschreibung trägt den Haftungshinweis',
  folge.beschreibung.includes('keine Anlageberatung'),
  true
)
pruefe(
  'Beschreibung trägt den Kapitel-Platzhalter',
  folge.beschreibung.includes('[KAPITEL]'),
  true
)
pruefe('Wortzahl unter der Obergrenze', folge.wortzahl <= 740, true)
pruefe('Wortzahl gemeldet und plausibel', folge.wortzahl > 300, true)

console.log(
  gescheitert === 0
    ? '\nAlle Pruefungen bestanden'
    : `\n${gescheitert} Pruefung(en) fehlgeschlagen`
)
process.exit(gescheitert === 0 ? 0 : 1)
