/**
 * Das App-Icon trägt den Grundton der Website.
 *
 * ## Warum diese Prüfung existiert
 *
 * Der Betreiber wollte am 13. August 2026 das Symbol auf dem Homescreen leicht
 * beige statt weiß – „mit dem gleichen Ton wie der Hintergrund von der
 * Webseite". Damit hängt eine Bilddatei an einer CSS-Variablen, und das ist
 * die Sorte Abhängigkeit, die still verrottet: Wer `--c-canvas` in
 * `app/globals.css` ändert, denkt an das Stylesheet, an `LEISTENFARBE` in
 * `lib/theme.ts` vielleicht auch noch – aber nicht an ein PNG.
 *
 * Auffallen würde es dann erst jemandem, der beide Symbole auf seinem
 * Homescreen nebeneinander sieht. Genau so ist die Sache überhaupt
 * aufgekommen.
 *
 * Neu erzeugt wird das Icon mit:
 *
 *     python scripts/app-icon-faerben.py
 *
 * ## Warum das PNG hier von Hand gelesen wird
 *
 * Für eine einzige Farbe lohnt keine Bildbibliothek. Gebraucht wird das
 * **erste Pixel der ersten Zeile** – die linke obere Ecke, und die ist
 * Hintergrund.
 *
 * Das lässt sich ohne Entfilterung lesen, und zwar für **jeden** PNG-Filter:
 * Alle fünf beziehen sich auf den linken und den oberen Nachbarn, und für das
 * allererste Pixel sind beide null. `raw + 0` ist `raw`, bei Paeth ebenso
 * (`Paeth(0,0,0) = 0`). Was im Datenstrom steht, ist dort also bereits der
 * fertige Farbwert – unabhängig davon, womit der Encoder die Zeile gefiltert
 * hat.
 */

import { inflateSync } from 'node:zlib'
import { readFileSync } from 'node:fs'

const ICON = 'app/apple-icon.png'
const STILDATEI = 'app/globals.css'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis: string): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}\n     ${hinweis}`)
  }
}

/** Der Grundton des hellen Schemas – die erste Festlegung von `--c-canvas`. */
function grundton(): [number, number, number] {
  const treffer = readFileSync(STILDATEI, 'utf8').match(/--c-canvas:\s*#([0-9a-fA-F]{6})/)
  if (!treffer) throw new Error(`--c-canvas steht nicht in ${STILDATEI}.`)
  const wert = treffer[1]
  return [
    parseInt(wert.slice(0, 2), 16),
    parseInt(wert.slice(2, 4), 16),
    parseInt(wert.slice(4, 6), 16),
  ]
}

/** Kopfdaten und das linke obere Pixel eines PNG. */
function pngEcke(pfad: string) {
  const datei = readFileSync(pfad)

  const breite = datei.readUInt32BE(16)
  const hoehe = datei.readUInt32BE(20)
  const bittiefe = datei[24]
  const farbtyp = datei[25]
  const verschraenkt = datei[28]

  /*
    Alle IDAT-Blöcke aneinanderhängen, bevor entpackt wird.

    Ein PNG darf seinen Datenstrom auf mehrere IDAT verteilen, und die Blöcke
    sind Teile **eines** zlib-Stroms – jeder für sich ist unvollständig. Nur
    den ersten zu entpacken ginge bei kleinen Dateien gut und bei großen nicht.
  */
  const teile: Buffer[] = []
  let stelle = 8
  while (stelle < datei.length) {
    const laenge = datei.readUInt32BE(stelle)
    const art = datei.toString('ascii', stelle + 4, stelle + 8)
    if (art === 'IDAT') teile.push(datei.subarray(stelle + 8, stelle + 8 + laenge))
    if (art === 'IEND') break
    stelle += 12 + laenge
  }

  const roh = inflateSync(Buffer.concat(teile))

  // Byte 0 der ersten Zeile ist die Filterart, danach kommen die Farbwerte.
  // Warum das erste Pixel ungefiltert dasteht, steht im Kopf dieser Datei.
  return {
    breite,
    hoehe,
    bittiefe,
    farbtyp,
    verschraenkt,
    ecke: [roh[1], roh[2], roh[3]] as [number, number, number],
  }
}

const ton = grundton()
const icon = pngEcke(ICON)

console.log(
  `${ICON}: ${icon.breite}×${icon.hoehe}, Bittiefe ${icon.bittiefe}, Farbtyp ${icon.farbtyp}\n`
)

/*
  Die Annahmen der Ableseroutine zuerst – sie gilt nur für 8 Bit RGB ohne
  Verschränkung. Stimmt das nicht mehr, ist das Ergebnis darunter nicht falsch,
  sondern bedeutungslos, und das ist der schlechtere Fehler.
*/
pruefen(
  '8 Bit, RGB, nicht verschränkt',
  icon.bittiefe === 8 && icon.farbtyp === 2 && icon.verschraenkt === 0,
  `Bittiefe ${icon.bittiefe}, Farbtyp ${icon.farbtyp}, verschränkt ${icon.verschraenkt} – ` +
    'diese Prüfung liest nur 8-Bit-RGB. Wer das Format ändert, passt sie an.'
)

pruefen(
  'Apple-Icon ist 180×180',
  icon.breite === 180 && icon.hoehe === 180,
  `${icon.breite}×${icon.hoehe} – iOS erwartet 180×180 für apple-touch-icon.`
)

const alsHex = (f: number[]) =>
  '#' + f.map((x) => x.toString(16).padStart(2, '0')).join('')

pruefen(
  `Grund des App-Icons ist der Grundton der Website (${alsHex(ton)})`,
  icon.ecke.every((wert, i) => wert === ton[i]),
  `Das Icon hat ${alsHex(icon.ecke)}, --c-canvas ist ${alsHex(ton)}.\n` +
    '     Neu erzeugen mit: python scripts/app-icon-faerben.py'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
