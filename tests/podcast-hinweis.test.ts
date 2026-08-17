/**
 * Der KI-Hinweis in alten YouTube-Beschreibungen.
 *
 * ## Der Fehler, der diese Datei ausgelöst hat
 *
 * Am 17. August 2026 wurde `KI_HINWEIS` zum zweiten Mal geändert. Die
 * Angleichung kannte aber nur **eine** frühere Fassung – die von vor dem
 * 6. August. Die Fassung dazwischen wäre durch das Raster gefallen:
 * `angeglichen()` hätte sie nicht erkannt, den Zweig „kein Hinweis vorhanden"
 * genommen und den neuen **davorgesetzt**.
 *
 * Das Ergebnis wären zwei Hinweise in einer Beschreibung gewesen, die einander
 * widersprechen – der eine sagt, ein Mensch prüfe vor der Veröffentlichung,
 * der andere sagt, es laufe automatisch. Auf vierzehn veröffentlichten Videos.
 *
 * ## Warum es keinen Test gab
 *
 * Weil die Funktion nicht prüfbar war. Sie stand zwischen einem
 * `process.exit(1)` und einem `fetch` an Googles Token-Endpunkt, beide auf
 * oberster Ebene: Wer sie importierte, startete den ganzen Lauf. Sie liegt
 * jetzt in `lib/podcast-hinweis.ts`.
 *
 * **Die Lehre:** Was entscheidet, gehört nach `lib/`. Eine Funktion, die man
 * nur im Ganzen ausführen kann, hat keinen Test – und bekommt auch keinen,
 * wenn es darauf ankommt.
 */

import { readFileSync } from 'node:fs'

import { angeglichen, FRUEHERE_HINWEISE, HAFTUNG_BEGINN } from '@/lib/podcast-hinweis'
import { KI_HINWEIS } from '@/lib/sprechfassung'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

const HAFTUNG =
  'Hinweis: Dieser Podcast dient ausschließlich der Information und ' +
  'Finanzbildung. Alle Angaben ohne Gewähr.'

function beschreibungMit(hinweis: string): string {
  return `Das Marktupdate vom 12. August.\n\n(0:00) Begrüßung\n\n${hinweis}\n\n${HAFTUNG}\n\n#Finanzen`
}

/* ------------------------------------------------- Jede frühere Fassung */

/*
  Der Kern: **jede** Fassung in der Liste muss erkannt werden, nicht nur die
  neueste. Eine Schleife statt zweier Einzelfälle – so deckt die Prüfung auch
  die dritte Fassung ab, die irgendwann dazukommt.
*/
for (const [i, frueher] of FRUEHERE_HINWEISE.entries()) {
  const vorher = beschreibungMit(frueher)
  const nachher = angeglichen(vorher)

  pruefen(`Frühere Fassung ${i + 1} wird erkannt`, nachher !== null, 'Kein Ergebnis.')
  if (nachher === null) continue

  pruefen(
    `Frühere Fassung ${i + 1} wird ersetzt, nicht ergänzt`,
    !nachher.includes(frueher),
    'Die alte Fassung steht noch da – zwei widersprüchliche Hinweise.'
  )
  pruefen(
    `Frühere Fassung ${i + 1} → heutiger Hinweis steht genau einmal`,
    nachher.split(KI_HINWEIS).length - 1 === 1,
    `${nachher.split(KI_HINWEIS).length - 1}-mal gefunden.`
  )
  pruefen(
    `Frühere Fassung ${i + 1}: der Rest bleibt unangetastet`,
    nachher.includes('(0:00) Begrüßung') &&
      nachher.includes(HAFTUNG) &&
      nachher.includes('#Finanzen'),
    'Kapitel, Haftung oder Hashtags sind verlorengegangen.'
  )
}

/* -------------------------------------------------------- Die drei Fälle */

pruefen(
  'Der heutige Hinweis bleibt unangetastet',
  angeglichen(beschreibungMit(KI_HINWEIS)) === null,
  'Ein zweiter Lauf darf nichts ändern – sonst ist er nicht wiederholbar.'
)

{
  const ohne = `Das Marktupdate vom 30. Juli.\n\n${HAFTUNG}`
  const nachher = angeglichen(ohne)
  pruefen(
    'Fehlt der Hinweis, kommt er vor den Haftungshinweis',
    nachher !== null &&
      nachher.indexOf(KI_HINWEIS) < nachher.indexOf(HAFTUNG_BEGINN) &&
      nachher.includes(HAFTUNG),
    String(nachher)
  )
}

{
  const nackt = 'Das Marktupdate vom 30. Juli.'
  const nachher = angeglichen(nackt)
  pruefen(
    'Ohne Haftungshinweis wird angehängt statt geraten',
    nachher !== null && nachher.startsWith(nackt) && nachher.includes(KI_HINWEIS),
    String(nachher)
  )
}

/* --------------------------------------- Die Kopplung an KI_HINWEIS selbst */

/*
  Die Prüfung, die den Fehler von oben beim nächsten Mal verhindert.

  Wer `KI_HINWEIS` ändert, ohne die bisherige Fassung in `FRUEHERE_HINWEISE`
  einzutragen, bekommt hier Bescheid – bevor der Lauf vierzehn Videos mit zwei
  widersprüchlichen Hinweisen versieht.

  Geprüft wird nicht der Wortlaut (der darf sich ändern), sondern **dass die
  Liste nicht leer ist und den heutigen Hinweis nicht enthält**. Stünde er
  darin, ersetzte sich der Lauf selbst durch sich selbst.
*/
pruefen(
  'Es gibt frühere Fassungen zum Nachziehen',
  FRUEHERE_HINWEISE.length >= 2,
  'Nach zwei Änderungen müssen zwei frühere Fassungen bekannt sein.'
)
pruefen(
  'Der heutige Hinweis steht nicht unter den früheren',
  !FRUEHERE_HINWEISE.includes(KI_HINWEIS),
  'Sonst ersetzt der Lauf den Hinweis durch sich selbst.'
)
pruefen(
  'Keine frühere Fassung verspricht eine menschliche Prüfung, die noch gilt',
  !KI_HINWEIS.includes('vor der Veröffentlichung von einem Menschen'),
  'Die Kette veröffentlicht ohne Halt – die Zusage träfe nicht zu.'
)

/* ------------------------------------------- Gegen den echten Bestand */

/*
  Die schärfste Prüfung: gegen die veröffentlichten Folgen.

  Die Fälle oben legen sich ihr Material selbst hin – sie prüfen, ob die
  Angleichung tut, was sie soll, aber nicht, ob die Liste **vollständig** ist.
  Ein Wortlaut, den es draußen wirklich gibt und den niemand eingetragen hat,
  fiele dort nicht auf.

  Hier steht er. `data/podcast-eigener-feed.json` führt jede veröffentlichte
  Folge mit ihrer Beschreibung; jeder KI-Hinweis darin muss entweder der
  heutige oder eine bekannte frühere Fassung sein.

  Nachgezählt am 17. August 2026: fünfzehn Folgen, acht davon mit Hinweis
  (10.–17. August), sieben ohne (30. Juli bis 7. August). Die sieben ohne sind
  kein Befund – für sie greift der dritte Zweig von `angeglichen()`.
*/
{
  const register = JSON.parse(readFileSync('data/podcast-eigener-feed.json', 'utf8')) as {
    folgen: { datum: string; beschreibung?: string }[]
  }

  const bekannt = [KI_HINWEIS, ...FRUEHERE_HINWEISE]
  const unbekannt: string[] = []
  let mitHinweis = 0

  for (const folge of register.folgen) {
    const zeilen = (folge.beschreibung ?? '')
      .split('\n')
      .filter((z) => z.startsWith('Hinweis:') && !z.includes('Anlageberatung'))
    if (zeilen.length === 0) continue
    mitHinweis++
    for (const zeile of zeilen) {
      if (!bekannt.some((b) => zeile.trim() === b)) {
        unbekannt.push(`${folge.datum}: ${zeile.slice(0, 90)}`)
      }
    }
  }

  pruefen(
    `Jeder Hinweis im Bestand ist bekannt (${mitHinweis} von ${register.folgen.length} Folgen tragen einen)`,
    unbekannt.length === 0,
    unbekannt.slice(0, 3).join('\n     ') +
      '\n     Diese Fassung gehört in FRUEHERE_HINWEISE – sonst setzt der Lauf' +
      '\n     den neuen Hinweis daneben statt ihn zu ersetzen.'
  )

  /*
    Die Gegenprobe: Es muss überhaupt Folgen mit Hinweis geben.

    Wären es null, wäre die Prüfung darüber erfüllt und hätte nichts gesehen –
    ein Mittelwert, der nichts findet, weil er nichts zu mitteln hat.
  */
  pruefen(
    'Es gibt Folgen mit Hinweis im Bestand',
    mitHinweis > 0,
    'Ohne Material prüft der Abgleich oben nichts.'
  )
}

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
