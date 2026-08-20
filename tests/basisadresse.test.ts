/**
 * Wohin die Nachrichtenanfrage geht.
 *
 * ## Warum es diesen Schalter gibt
 *
 * Der Betreiber hat am 20. August 2026 nach einem Zwischendienst gefragt, der
 * Anfragen auf mehrere Anbieter verteilt. Statt einen Anbieter einzubauen, ist
 * die Basisadresse einstellbar geworden: ein Secret setzen, ein Secret
 * wegnehmen. Ohne die Variable ändert sich nichts.
 *
 * ## Was diese Prüfung festhält
 *
 * Drei Dinge, und das mittlere ist das wichtige:
 *
 * 1. **Nicht gesetzt heißt unverändert.** Ein Schalter, der im Ruhezustand
 *    etwas ändert, ist keiner.
 * 2. **Nur `https://`.** Über diese Verbindung geht der API-Schlüssel als
 *    `x-api-key` mit. Eine Adresse ohne Verschlüsselung gäbe ihn im Klartext
 *    weiter – und das darf keine Umgebungsvariable versehentlich können. Die
 *    Prüfung dagegen muss anschlagen; eine Absicherung, die nie anschlägt,
 *    sieht aus wie Ruhe.
 * 3. **Der Schrägstrich am Ende fällt weg**, aber ein Pfad bleibt stehen: Ein
 *    Zwischendienst darf unter einem Unterpfad liegen. Ohne das Kürzen
 *    entstünde `…//v1/messages`, und manche Server antworten darauf mit 404.
 */

import { basisadresse } from '../scripts/nachrichten-erzeugen.ts'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

const vorher = process.env.ANTHROPIC_BASE_URL

function mit(wert: string | undefined): string {
  if (wert === undefined) delete process.env.ANTHROPIC_BASE_URL
  else process.env.ANTHROPIC_BASE_URL = wert
  return basisadresse()
}

pruefen(
  'Nicht gesetzt: die Anthropic-Schnittstelle',
  mit(undefined) === 'https://api.anthropic.com',
  mit(undefined)
)

pruefen(
  'Leer gesetzt zählt wie nicht gesetzt',
  mit('') === 'https://api.anthropic.com' && mit('   ') === 'https://api.anthropic.com'
)

pruefen(
  'Eine gesetzte Adresse wird genommen',
  mit('https://gateway.example/anthropic') === 'https://gateway.example/anthropic',
  mit('https://gateway.example/anthropic')
)

pruefen(
  'Der Schrägstrich am Ende fällt weg',
  mit('https://gateway.example/') === 'https://gateway.example' &&
    mit('https://gateway.example/anthropic///') === 'https://gateway.example/anthropic',
  mit('https://gateway.example/anthropic///')
)

/*
  Die Gegenprobe.

  `basisadresse()` beendet den Prozess bei einer Adresse ohne Verschlüsselung.
  Genau deshalb läuft dieser Fall in einem eigenen Node-Aufruf: Ein Test, der
  `process.exit` auslöst, nimmt sonst alle folgenden Prüfungen mit – und ein
  grüner Lauf ohne diese Prüfung sähe aus wie ein bestandener.
*/
const { spawnSync } = await import('node:child_process')
const { fileURLToPath } = await import('node:url')
const { dirname, join } = await import('node:path')

const hier = dirname(fileURLToPath(import.meta.url))

for (const schlecht of [
  'http://gateway.example',
  'gateway.example',
  'ftp://gateway.example',
]) {
  const lauf = spawnSync(
    process.execPath,
    [
      '--experimental-strip-types',
      '--disable-warning=MODULE_TYPELESS_PACKAGE_JSON',
      '-e',
      `import('${join(hier, '..', 'scripts', 'nachrichten-erzeugen.ts').replace(/\\/g, '/')}')` +
        '.then((m) => { m.basisadresse(); console.log("DURCHGELASSEN") })',
    ],
    { env: { ...process.env, ANTHROPIC_BASE_URL: schlecht }, encoding: 'utf8' }
  )

  const ausgabe = `${lauf.stdout ?? ''}${lauf.stderr ?? ''}`
  pruefen(
    `„${schlecht}" wird abgelehnt`,
    lauf.status === 1 &&
      !ausgabe.includes('DURCHGELASSEN') &&
      ausgabe.includes('muss mit https:// beginnen'),
    `Status ${lauf.status}: ${ausgabe.slice(0, 200)}`
  )
}

if (vorher === undefined) delete process.env.ANTHROPIC_BASE_URL
else process.env.ANTHROPIC_BASE_URL = vorher

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
