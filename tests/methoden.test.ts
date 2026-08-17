/**
 * Die Methodenseite hält, was sie verspricht.
 *
 * ## Warum gerade hier eine Prüfung nötig ist
 *
 * Eine Methodenseite **verspricht Nachvollziehbarkeit**. Eine Formel, die dort
 * steht und im Code anders lautet, ist schlimmer als gar keine Angabe: Sie ist
 * eine falsche Auskunft an jemanden, der ausdrücklich nachgesehen hat.
 *
 * Und abgetippte Zahlen laufen auseinander – das ist an diesem Tag zweimal
 * aufgefallen. Die Wortgrenzen der Podcastfolge standen an drei Stellen ohne
 * Kopplung; die `intro`-Grenze hat am 16. August 2026 in derselben Bauart eine
 * Tagesausgabe gekostet.
 *
 * ## Was geprüft wird
 *
 * 1. **Die Herkunft stimmt.** Jede genannte Datei gibt es, und sie exportiert
 *    die genannte Funktion. Ein umbenanntes `abstandZumHoch` fällt hier auf und
 *    nicht erst dem Leser.
 * 2. **Jedes Beispiel rechnet wirklich.** `beispiel()` ruft die echte Funktion
 *    auf. Läuft es durch und liefert etwas, ist die Zahl auf der Seite keine
 *    Behauptung, sondern ein Ergebnis.
 * 3. **Jede Kennzahl nennt ihre Vereinfachungen.** Nie leer – jede Kennzahl
 *    lässt etwas weg, und eine, die nichts wegzulassen behauptet, hat es nur
 *    nicht aufgeschrieben.
 */

import { existsSync, readFileSync } from 'node:fs'

import { METHODEN } from '@/lib/methoden'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

console.log(`${METHODEN.length} Methoden\n`)

pruefen(
  'Es gibt überhaupt Methoden',
  METHODEN.length >= 5,
  'Ohne Material prüft der Rest nichts.'
)

const slugs = new Set<string>()

for (const methode of METHODEN) {
  const name = methode.titel

  pruefen(
    `${name}: Kennung ist eindeutig`,
    !slugs.has(methode.slug),
    `„${methode.slug}" kommt zweimal vor – die Sprungmarken auf der Seite kollidieren.`
  )
  slugs.add(methode.slug)

  /* ------------------------------------------------ Die Herkunft stimmt */

  pruefen(
    `${name}: ${methode.herkunft.datei} gibt es`,
    existsSync(methode.herkunft.datei),
    'Die Seite verweist auf eine Datei, die nicht da ist.'
  )

  if (existsSync(methode.herkunft.datei)) {
    const quelltext = readFileSync(methode.herkunft.datei, 'utf8')
    const exportiert = new RegExp(
      `export (function|const) ${methode.herkunft.funktion}\\b`
    ).test(quelltext)
    pruefen(
      `${name}: ${methode.herkunft.funktion}() wird dort exportiert`,
      exportiert,
      `In ${methode.herkunft.datei} steht kein \`export … ${methode.herkunft.funktion}\`.\n` +
        '     Umbenannt? Dann gehört der Eintrag angepasst – die Seite verweist\n' +
        '     sonst auf eine Stelle, an der nichts gerechnet wird.'
    )
  }

  /* --------------------------------------- Das Beispiel rechnet wirklich */

  let beispiel: { eingabe: string; ergebnis: string } | null = null
  try {
    beispiel = methode.beispiel()
  } catch (fehler) {
    pruefen(`${name}: Beispiel läuft durch`, false, String(fehler))
  }

  if (beispiel) {
    pruefen(
      `${name}: Beispiel ergibt „${beispiel.ergebnis}"`,
      beispiel.ergebnis.trim().length > 0 &&
        beispiel.eingabe.trim().length > 0 &&
        !beispiel.ergebnis.includes('NaN') &&
        !beispiel.ergebnis.includes('Infinity') &&
        /*
          Und kein Ausweichergebnis.

          „keine Angabe" kam beim ersten Lauf tatsächlich heraus: Das
          Marktbreite-Beispiel hatte vier Reihen, die Funktion verlangt aber
          acht. Es zeigte damit nicht die Rechnung, sondern nur ihre
          Untergrenze – und die Prüfung winkte es durch, weil sie nur auf
          NaN und Leerzeichen sah.
        */
        !/keine Angabe|undefined|\[object/.test(beispiel.ergebnis) &&
        /*
          Auch keine internen Schlüssel. `aelter` stand wörtlich auf der Seite,
          weil das Beispiel `frische` direkt ausgegeben hat.
        */
        !/\baelter\b|\bfrisch\b(?!e)/.test(beispiel.ergebnis),
      `eingabe „${beispiel.eingabe}", ergebnis „${beispiel.ergebnis}"`
    )
  }

  /* -------------------------------- Jede Kennzahl nennt ihre Grenzen */

  pruefen(
    `${name}: nennt mindestens eine Vereinfachung`,
    methode.vereinfachungen.length > 0,
    'Jede Kennzahl lässt etwas weg. Eine, die nichts nennt, hat es nur nicht\n' +
      '     aufgeschrieben – und lässt den Leser glauben, sie sei genauer als sie ist.'
  )

  pruefen(
    `${name}: Formel, Quelle und Stichtag sind ausgefüllt`,
    methode.formel.trim().length > 0 &&
      methode.quelle.trim().length > 0 &&
      methode.stichtag.trim().length > 0,
    'Ein leeres Feld auf einer Methodenseite ist eine unbeantwortete Frage.'
  )
}

/* ----------------------------------------------------- Die Gegenprobe */

/*
  Die Prüfung „Funktion wird exportiert" muss auch scheitern können.

  Sie liest den Quelltext mit einem regulären Ausdruck. Wäre der so gebaut,
  dass er auf jeden Text passt, gingen alle Einträge durch und niemand merkte
  es. Hier bekommt sie einen Namen vorgelegt, den es nicht gibt.
*/
{
  const quelltext = readFileSync('lib/jahresspanne.ts', 'utf8')
  const erfunden = /export (function|const) gibtEsNichtUndSollAuffallen\b/.test(quelltext)
  pruefen(
    'Die Herkunftsprüfung erkennt einen erfundenen Namen nicht an',
    !erfunden,
    'Der reguläre Ausdruck passt auf alles – die Prüfung oben ist wertlos.'
  )
}

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
