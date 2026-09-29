/**
 * Jede Kennzahl des Globus muss an allen drei Stellen ankommen.
 *
 * Ausführen mit `npm test`.
 *
 * ## Der Anlass
 *
 * Am 16. September 2026 hat der Betreiber gemeldet, dass die Eigentumsquote in
 * der Tafel zum angeklickten Land fehlt. Sie stand in `metriken`, färbte die
 * Karte ein und hatte eine Spalte in der Ländertabelle – nur die Tafel kannte
 * sie nicht.
 *
 * Drei von Hand gepflegte Listen, und nichts hielt sie gegeneinander:
 *
 *     lib/laender.ts                     metriken + wertFuer
 *     components/globus/GlobusAnsicht    wertVon (Karte) + Landtafel
 *     components/globus/Laendertabelle   die Spalten
 *
 * Aufgefallen ist es einem Menschen beim Draufsehen, nicht einer Prüfung. Und
 * es wäre auch weiter niemandem aufgefallen: Ein Land ohne Zeile sieht aus wie
 * ein Land ohne Angabe – genau der stille Fehler.
 *
 * ## Warum der Quelltext gelesen wird statt der Bauteile
 *
 * Die beiden Komponenten sind `.tsx` mit JSX. `node --experimental-strip-types`
 * übersetzt kein JSX, ein Import scheitert. Gelesen wird deshalb der Quelltext –
 * dasselbe Vorgehen wie in `tests/intro-grenze.test.ts`, das die Grenze aus
 * `scripts/paket-pruefen.ts` als Text holt.
 *
 * Das prüft weniger als ein echter Aufruf: Es sieht, **dass** das Feld
 * vorkommt, nicht wie es gerendert wird. Für den Fehler, um den es geht –
 * Kennzahl vergessen –, genügt das, und mehr verspricht die Datei nicht.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { metriken, wertFuer, type MetrikId } from '@/lib/laender'

let failed = 0
function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

const wurzel = join(import.meta.dirname, '..')
const lies = (pfad: string) => readFileSync(join(wurzel, pfad), 'utf8')

const ANSICHT = lies('components/globus/GlobusAnsicht.tsx')
const TABELLE = lies('components/globus/Laendertabelle.tsx')

/* Der Abschnitt, der die Tafel zum angeklickten Land baut. */
const tafelBeginn = ANSICHT.indexOf('function Landtafel(')
pruefen('die Landtafel ist im Quelltext auffindbar', tafelBeginn > 0)
const LANDTAFEL = ANSICHT.slice(tafelBeginn)

pruefen(`es gibt Kennzahlen (${metriken.length})`, metriken.length > 5)

for (const metrik of metriken) {
  /*
    `kurse` ist der eine begründete Sonderfall: Die Zahl wird aus `indizes`
    und `aktien` gerechnet und steht in einem eigenen Abschnitt der Tafel,
    nicht in der Kennzahlenliste. Sie trägt deshalb kein `feld`.
  */
  if (!metrik.feld) {
    pruefen(
      `„${metrik.label}" ohne Feld ist der bekannte Sonderfall`,
      metrik.id === 'kurse',
      `${metrik.id} hat kein feld – entweder eintragen oder hier begründen.`
    )
    continue
  }

  const zugriff = `land.${metrik.feld}`

  pruefen(
    `„${metrik.label}" färbt die Karte (${zugriff} in wertVon)`,
    ANSICHT.slice(0, tafelBeginn).includes(zugriff),
    'Ohne Zugriff bliebe die Karte für diese Kennzahl vollständig grau.'
  )
  pruefen(
    `„${metrik.label}" steht in der Landtafel`,
    LANDTAFEL.includes(zugriff),
    `${zugriff} fehlt in Landtafel – genau der Fall vom 16. September 2026.`
  )
  pruefen(
    `„${metrik.label}" hat eine Spalte in der Ländertabelle`,
    TABELLE.includes(zugriff),
    `${zugriff} fehlt in Laendertabelle.tsx.`
  )

  /* Und die Kennzahl muss überhaupt einen Wert liefern können. */
  pruefen(
    `wertFuer kennt „${metrik.id}"`,
    wertFuer(
      { [metrik.feld]: { wert: 42, zeitraum: '2025', quelle: 'x' } } as never,
      metrik.id
    ) !== undefined,
    'Ein fehlender case ergäbe undefined statt null oder Zahl.'
  )
}

/* -------------------------------------------- Die Gegenprobe zur Prüfung */

/*
  Ohne sie wäre oben nur gezeigt, dass nichts gefunden wird – nicht, dass
  etwas gefunden werden **kann**. Eine Kennzahl, die es nicht gibt, muss an
  allen drei Stellen durchfallen.
*/
const ERFUNDEN = 'land.gibtEsNichtImCode'
pruefen(
  'eine erfundene Kennzahl fällt in allen drei Listen durch',
  !ANSICHT.includes(ERFUNDEN) && !TABELLE.includes(ERFUNDEN)
)

/* Und `wertFuer` darf für eine unbekannte Kennung nichts erfinden. */
pruefen(
  'wertFuer liefert für eine unbekannte Kennung nichts',
  wertFuer({} as never, 'gibtEsNicht' as MetrikId) === undefined
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
