/**
 * Das Urteil des Nachrichtenlaufs, geprüft an den drei Morgen, die es
 * gekostet hat – und an den Fällen, in denen es **abweisen muss**.
 *
 * Ausführen mit `npm test`.
 *
 * ## Die Regel
 *
 * *Eine Absicherung, die nie anschlägt, sieht aus wie Ruhe.* Für jeden Fall,
 * in dem die Ausgabe durchgelassen wird, steht hier der Zwilling, in dem sie
 * es nicht wird – dieselbe Prüfung, nur dass sie **erst mit** der Ausgabe rot
 * geworden ist. Ließe `vergleiche()` beide durch, wäre der Riegel abgeschafft
 * statt verbessert.
 *
 * Dazu die Leseseite: `pruefstandLesen()` aus `scripts/pruefvergleich.ts`
 * gegen ein Verzeichnis, wie `scripts/pruefkette.sh` es hinterlässt. Der
 * Vergleich ist nur so gut wie das, was er zu lesen bekommt.
 */

import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { MUSS_BESTEHEN, vergleiche, type Pruefstand } from '@/lib/pruefvergleich'
import { PRUEFUNGEN, pruefstandLesen } from '../scripts/pruefvergleich.ts'

let failed = 0
function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

const gruen = { ok: true, befunde: [] as string[] }
const rot = (...befunde: string[]) => ({ ok: false, befunde })

/** Ein Durchgang, bei dem alles grün ist – der Ausgangspunkt jedes Falls. */
function allesGruen(): Pruefstand {
  return Object.fromEntries(PRUEFUNGEN.map((n) => [n, { ...gruen }]))
}

/* ------------------------------------------------------------ Alles grün */

{
  const u = vergleiche(allesGruen(), allesGruen())
  pruefen('alles grün → veröffentlichen', u.veroeffentlichen && u.grund === 'alles grün')
  pruefen('… ohne Befunde', u.neu.length === 0 && u.vorbestehend.length === 0)
}

/* ---------------------------------------------- 04.09. und 05.09.: der Test */

/*
  Beide Morgen sahen gleich aus: Eine Testdatei war rot, bevor die Ausgabe
  geschrieben wurde, und nach dem Schreiben immer noch – dieselbe Datei. Die
  Ausgabe hatte nichts damit zu tun.
*/
{
  const vorher = allesGruen()
  vorher.test = rot('tests/quartalstermine.test.ts')
  const nachher = allesGruen()
  nachher.test = rot('tests/quartalstermine.test.ts')

  const u = vergleiche(vorher, nachher)
  pruefen(
    '04./05.09.: dieselbe Testdatei vorher wie nachher rot → veröffentlichen',
    u.veroeffentlichen,
    u.grund
  )
  pruefen(
    '… als vorbestehend gemeldet',
    u.vorbestehend.length === 1 && u.neu.length === 0
  )
  pruefen(
    '… und der Grund sagt, dass der Lauf trotzdem rot endet',
    u.grund.includes('trotzdem rot'),
    u.grund
  )
}

/* Der Zwilling: Die Testdatei ist erst **mit** der Ausgabe rot geworden. */
{
  const nachher = allesGruen()
  nachher.test = rot('tests/quartalstermine.test.ts')

  const u = vergleiche(allesGruen(), nachher)
  pruefen(
    'Zwilling: dieselbe Datei, aber vorher grün → NICHT veröffentlichen',
    !u.veroeffentlichen,
    u.grund
  )
  pruefen(
    '… als neu gemeldet',
    u.neu.length === 1 && u.neu[0].text === 'tests/quartalstermine.test.ts'
  )
}

/* Und die Mischung: eine alte rote Datei und eine neue dazu. */
{
  const vorher = allesGruen()
  vorher.test = rot('tests/quartalstermine.test.ts')
  const nachher = allesGruen()
  nachher.test = rot('tests/quartalstermine.test.ts', 'tests/news.test.ts')

  const u = vergleiche(vorher, nachher)
  pruefen(
    'eine alte und eine neue rote Testdatei → NICHT veröffentlichen',
    !u.veroeffentlichen
  )
  pruefen(
    '… beide richtig einsortiert',
    u.vorbestehend.length === 1 &&
      u.vorbestehend[0].text === 'tests/quartalstermine.test.ts' &&
      u.neu.length === 1 &&
      u.neu[0].text === 'tests/news.test.ts'
  )
}

/* ------------------------------------------------ 10.09.: die Paketprüfung */

/*
  Die Beanstandung betraf die neue Artikelseite – im Vorbefund gab es sie
  nicht, sie **konnte** es nicht geben. Der Vergleich muss sie als neu
  einstufen; dass sie trotzdem nicht mehr blockiert, ist Sache von
  `metaBefunde()` in der Paketprüfung (dort ist sie eine Warnung geworden),
  nicht dieses Vergleichs.
*/
{
  const nachher = allesGruen()
  nachher.pruefen = rot('/news/wall-street-oelpreis-belastet-meta-rallye/: keine <h1>')

  const u = vergleiche(allesGruen(), nachher)
  pruefen(
    '10.09.: ein Befund an der neuen Seite → NICHT veröffentlichen',
    !u.veroeffentlichen
  )
  pruefen(
    '… als neu, weil im Vorbefund unbekannt',
    u.neu.length === 1 && u.vorbestehend.length === 0
  )
}

/* Vorbestehender Paketbefund an einer alten Seite, wortgleich. */
{
  const vorher = allesGruen()
  vorher.pruefen = rot('/lernen/alte-seite/: Tabelle ohne Kopfzelle (<th>)')
  const nachher = allesGruen()
  nachher.pruefen = rot('/lernen/alte-seite/: Tabelle ohne Kopfzelle (<th>)')

  const u = vergleiche(vorher, nachher)
  pruefen(
    'wortgleicher Paketbefund vorher wie nachher → veröffentlichen',
    u.veroeffentlichen,
    u.grund
  )
}

/* Ein Befund, der sich nur im Wortlaut unterscheidet, ist ein anderer. */
{
  const vorher = allesGruen()
  vorher.pruefen = rot('/lernen/alte-seite/: Tabelle ohne Kopfzelle (<th>)')
  const nachher = allesGruen()
  nachher.pruefen = rot('/lernen/alte-seite/: 2 mal <h1> – erlaubt ist genau eine')

  const u = vergleiche(vorher, nachher)
  pruefen(
    'anderer Wortlaut an derselben Seite → NICHT veröffentlichen',
    !u.veroeffentlichen
  )
}

/* ----------------------------------------------------- Der Bau blockiert immer */

{
  pruefen('der Bau steht in MUSS_BESTEHEN', MUSS_BESTEHEN.includes('build'))

  const vorher = allesGruen()
  vorher.build = rot()
  const nachher = allesGruen()
  nachher.build = rot()

  const u = vergleiche(vorher, nachher)
  pruefen(
    'Bau vorher wie nachher rot → trotzdem NICHT veröffentlichen',
    !u.veroeffentlichen
  )
  pruefen('… mit dem Bau als Grund', u.grund.includes('Bau'), u.grund)
  pruefen('… und dennoch als vorbestehend geführt', u.vorbestehend.length === 1)
}

/* ---------------------------------- Prüfungen ohne Einzelbefunde: tsc, lint */

{
  const vorher = allesGruen()
  vorher.tsc = rot()
  const nachher = allesGruen()
  nachher.tsc = rot()

  const u = vergleiche(vorher, nachher)
  pruefen('tsc vorher wie nachher rot → veröffentlichen', u.veroeffentlichen, u.grund)
  pruefen(
    '… als vorbestehend',
    u.vorbestehend.length === 1 && u.vorbestehend[0].pruefung === 'tsc'
  )
}

{
  const nachher = allesGruen()
  nachher.tsc = rot()

  const u = vergleiche(allesGruen(), nachher)
  pruefen('tsc erst nachher rot → NICHT veröffentlichen', !u.veroeffentlichen)
  pruefen('… als neu', u.neu.length === 1 && u.neu[0].pruefung === 'tsc')
}

/* ------------------------------------------------- Ohne Vorbefund: streng */

{
  const vorher: Pruefstand = {}
  const nachher = allesGruen()
  nachher.lint = rot()

  const u = vergleiche(vorher, nachher)
  pruefen('kein Vorbefund, lint rot → NICHT veröffentlichen', !u.veroeffentlichen)
}

{
  const vorher: Pruefstand = {}
  const nachher = allesGruen()
  nachher.test = rot('tests/x.test.ts')

  const u = vergleiche(vorher, nachher)
  pruefen('kein Vorbefund, Test rot → NICHT veröffentlichen', !u.veroeffentlichen)
}

/* Was vorher rot war und nachher grün ist, ist kein Befund mehr. */
{
  const vorher = allesGruen()
  vorher.test = rot('tests/x.test.ts')

  const u = vergleiche(vorher, allesGruen())
  pruefen(
    'vorher rot, nachher grün → alles grün',
    u.veroeffentlichen && u.grund === 'alles grün'
  )
}

/* ---------------------------------------- Die Leseseite: ein Verzeichnis */

/*
  Genau so, wie `pruefkette.sh` es hinterlässt: eine `.status`-Datei je
  Prüfung, `.befunde` für Test und Paketprüfung.
*/
{
  const dir = mkdtempSync(join(tmpdir(), 'pruefstand-'))
  for (const name of PRUEFUNGEN) writeFileSync(join(dir, `${name}.status`), '0\n')
  writeFileSync(join(dir, 'test.status'), '1\n')
  writeFileSync(join(dir, 'test.befunde'), 'tests/a.test.ts\ntests/b.test.ts\n\n')
  writeFileSync(join(dir, 'pruefen.status'), '1\n')
  writeFileSync(join(dir, 'pruefen.befunde'), '  /x/: keine <h1>  \n')

  const stand = pruefstandLesen(dir, true)
  pruefen('alle sechs Prüfungen gelesen', Object.keys(stand).length === PRUEFUNGEN.length)
  pruefen('grüne Prüfung als grün', stand.tsc.ok && stand.tsc.befunde.length === 0)
  pruefen(
    'rote Prüfung mit ihren Befunden, Leerzeilen entfernt',
    !stand.test.ok && stand.test.befunde.join('|') === 'tests/a.test.ts|tests/b.test.ts'
  )
  pruefen('Befunde werden getrimmt', stand.pruefen.befunde[0] === '/x/: keine <h1>')
}

/* Eine fehlende Statusdatei: im Vorbefund kein Eintrag, im Nachbefund rot. */
{
  const dir = mkdtempSync(join(tmpdir(), 'pruefstand-'))
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'tsc.status'), '0\n')

  const vorher = pruefstandLesen(dir, false)
  pruefen(
    'Vorbefund: nur die gelaufene Prüfung ist eingetragen',
    Object.keys(vorher).join() === 'tsc'
  )

  const nachher = pruefstandLesen(dir, true)
  pruefen(
    'Nachbefund: was nicht gelaufen ist, gilt als rot',
    Object.keys(nachher).length === PRUEFUNGEN.length && !nachher.build.ok
  )
  pruefen('… und blockiert damit', !vergleiche(vorher, nachher).veroeffentlichen)
}

/* ------------------------------------------- Das Protokoll von `npm test` */

/*
  Die Zeilen, die `pruefkette.sh` mit `awk` aus dem Testprotokoll zieht,
  werden hier mit demselben Ausdruck nachgestellt. Es ist keine Ausführung des
  Shellskripts – die Gegenprobe dafür steht im Pull Request –, sondern die
  Frage, ob die Form, die `scripts/tests-ausfuehren.mjs` schreibt, die ist,
  die dort erwartet wird.
*/
{
  const protokoll = [
    'OK   irgendwas',
    'FEHL tests/x.test.ts wird hier nur erwähnt',
    '',
    '125 von 126 Testdateien bestanden.',
    'Gescheitert:',
    '  tests/quartalstermine.test.ts',
  ].join('\n')

  const nachMarke = protokoll.split('\nGescheitert:\n')[1] ?? ''
  const gezogen = nachMarke
    .split('\n')
    .filter((z) => /^\s+tests\/\S+\.test\.ts\s*$/.test(z))
    .map((z) => z.trim())
  pruefen(
    'aus dem Testprotokoll kommt genau die gescheiterte Datei',
    gezogen.join() === 'tests/quartalstermine.test.ts',
    gezogen.join()
  )
}

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
