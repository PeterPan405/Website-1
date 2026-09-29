/**
 * PowerShell-Skripte mit Umlauten brauchen ein BOM.
 *
 * ## Der Fall vom 29. September 2026
 *
 * `werkzeuge/wissen-in-vault.ps1` entstand am selben Tag in einer
 * Cloud-Sitzung und war dort ausdrücklich nicht ausführbar – das steht so in
 * ihrem eigenen Kopf: „Dieses Skript ist in der Umgebung, in der es
 * geschrieben wurde, nicht ausführbar." Beim ersten Aufruf auf dem Rechner
 * des Betreibers brach es ab, und zwar nicht an seiner Aufgabe, sondern beim
 * **Parsen**:
 *
 *     Die Zeichenfolge hat kein Abschlusszeichen: ".
 *     Die schließende "}" fehlt im Anweisungsblock oder der Typdefinition.
 *
 * Die Ursache ist eine Eigenheit von **Windows PowerShell 5.1**, und nur von
 * ihr: Eine `.ps1` ohne Byte Order Mark liest sie in der ANSI-Codepage des
 * Systems, nicht als UTF-8. Aus `–` (drei Bytes in UTF-8) werden drei
 * Zeichen, aus `„` ebenso – und irgendwo in 27 betroffenen Zeilen entsteht
 * dabei etwas, das den Parser aus einer Zeichenkette wirft.
 *
 * PowerShell 7 (`pwsh`) hätte die Datei richtig gelesen. Auf diesem Rechner
 * ist sie nicht installiert (nachgesehen), und ein Skript, das eine zweite
 * Installation voraussetzt, ist auf dem Rechner, für den es gedacht ist,
 * kein Werkzeug.
 *
 * ## Warum das eine Prüfung wert ist
 *
 * Weil der Fehler **erst auf dem Zielrechner** auftritt und dort sofort
 * alles blockiert. Keine Sitzung, die nicht auf Windows läuft, kann ihn
 * sehen – und genau solche Sitzungen schreiben diese Skripte. Dieselbe Klasse
 * wie die Lehre in `AGENTS.md`: „Wo die einzige prüfbare Umgebung nicht die
 * ist, in der es kaputtgeht, ist ‚müsste jetzt gehen' keine Aussage."
 *
 * Reines ASCII braucht kein BOM – deshalb prüft diese Datei nicht stur alle
 * `.ps1`, sondern genau die, bei denen es darauf ankommt.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

let bestanden = 0
let gescheitert = 0

function pruefe(name: string, bedingung: boolean, hinweis?: string) {
  if (bedingung) {
    bestanden++
    console.log(`OK   ${name}`)
  } else {
    gescheitert++
    console.error(`FEHL ${name}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/** Alle `.ps1` im Baum, ohne `node_modules` und `out`. */
function skripteSuchen(ordner: string, gefunden: string[] = []): string[] {
  for (const name of readdirSync(ordner)) {
    if (['node_modules', 'out', '.git', '.next'].includes(name)) continue
    const pfad = join(ordner, name)
    if (statSync(pfad).isDirectory()) skripteSuchen(pfad, gefunden)
    else if (name.endsWith('.ps1')) gefunden.push(pfad)
  }
  return gefunden
}

const skripte = skripteSuchen('.')

/*
  Ohne diese Zeile wäre alles darunter grün, sobald jemand das letzte
  PowerShell-Skript umbenennt – und die Prüfung meldete Ruhe, wo sie nichts
  mehr ansieht. `[].every(…)` ist `true`.
*/
pruefe(
  'Es gibt überhaupt PowerShell-Skripte zu prüfen',
  skripte.length > 0,
  'Kein `.ps1` gefunden – dann prüft alles darunter nichts.'
)

const BOM = Buffer.from([0xef, 0xbb, 0xbf])

for (const pfad of skripte) {
  const roh = readFileSync(pfad)
  const hatBom = roh.subarray(0, 3).equals(BOM)
  const text = roh.toString('utf8')
  const umlautzeilen = text
    .split('\n')
    // eslint-disable-next-line no-control-regex
    .map((zeile, i) => ({ zeile, nr: i + 1 }))
    .filter(({ zeile }) => /[^\u0000-\u007F]/.test(zeile))

  if (umlautzeilen.length === 0) {
    pruefe(`${pfad}: reines ASCII, braucht kein BOM`, true)
    continue
  }

  pruefe(
    `${pfad}: ${umlautzeilen.length} Zeilen mit Sonderzeichen – und ein BOM davor`,
    hatBom,
    `Kein BOM. Windows PowerShell 5.1 liest die Datei dann als ANSI und bricht\n` +
      `     beim Parsen ab. Erste betroffene Zeile ${umlautzeilen[0].nr}: ` +
      `${umlautzeilen[0].zeile.trim().slice(0, 70)}\n` +
      `     Beheben: Datei mit BOM speichern, z. B.\n` +
      `     node -e "const f=require('fs'),p='${pfad.replace(/\\/g, '/')}';` +
      `const b=f.readFileSync(p);if(b[0]!==0xEF)f.writeFileSync(p,` +
      `Buffer.concat([Buffer.from([0xEF,0xBB,0xBF]),b]))"`
  )
}

/*
  Die Gegenprobe: Erkennt die Prüfung ein fehlendes BOM überhaupt?

  Eine Absicherung, die nie anschlägt, sieht aus wie Ruhe – und hier ist die
  Gefahr besonders greifbar, weil alle vorhandenen Dateien nach der Reparatur
  ein BOM haben und die Schleife oben damit nur noch grün meldet.
*/
const ohneBom = Buffer.from('Write-Host "Ein Gedankenstrich – und Umlaute: äöü"', 'utf8')
pruefe(
  'Ein Skript ohne BOM würde erkannt',
  !ohneBom.subarray(0, 3).equals(BOM) &&
    /[^\u0000-\u007F]/.test(ohneBom.toString('utf8')),
  'Die Erkennung greift nicht – dann meldet die Schleife oben immer grün.'
)

pruefe(
  'Ein Skript mit BOM gilt als in Ordnung',
  Buffer.concat([BOM, ohneBom]).subarray(0, 3).equals(BOM),
  'Die BOM-Erkennung stimmt nicht.'
)

console.log(`\n${bestanden} Prüfungen bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
