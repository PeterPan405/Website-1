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
 * ## Und wie groß das Signet in der Kachel steht
 *
 * Am 17. August 2026 kam der zweite Wunsch: Das Symbol solle so aussehen wie
 * „IM Capital" daneben – also mit deutlich mehr Rand. Das Verhältnis steht
 * seither als `SIGNETANTEIL` in `scripts/app-icon-faerben.py`.
 *
 * Eine Zahl in einem Skript und eine fertige PNG-Datei daneben: Das ist
 * dieselbe Bauart wie beim Grundton und geht auf dieselbe Weise auseinander.
 * Wer die Zahl ändert und das Skript nicht laufen lässt, hat ein Icon, das
 * seiner eigenen Beschreibung widerspricht – und sieht es nie, weil niemand
 * ein 180-Pixel-Bild nachmisst.
 *
 * Deshalb misst diese Prüfung nach.
 *
 * ## Warum das PNG hier von Hand gelesen wird
 *
 * Weil eine Bildbibliothek für zwei Zahlen keine Abhängigkeit wert ist – und
 * weil Pillow im Node-Testlauf ohnehin nicht zur Verfügung steht.
 *
 * Die Ecke allein käme ohne Entfilterung aus: Alle fünf PNG-Filter beziehen
 * sich auf den linken und den oberen Nachbarn, und für das allererste Pixel
 * sind beide null. Für den Kasten des Signets braucht es aber jede Zeile,
 * also die vollständige Entfilterung – sie steht unten in `pngLesen`.
 */

import { inflateSync } from 'node:zlib'
import { readFileSync } from 'node:fs'

const ICON = 'app/apple-icon.png'
const STILDATEI = 'app/globals.css'
const SKRIPT = 'scripts/app-icon-faerben.py'

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

/** Der Paeth-Prädiktor aus der PNG-Spezifikation. */
function paeth(links: number, oben: number, diagonal: number): number {
  const p = links + oben - diagonal
  const dl = Math.abs(p - links)
  const do_ = Math.abs(p - oben)
  const dd = Math.abs(p - diagonal)
  if (dl <= do_ && dl <= dd) return links
  if (do_ <= dd) return oben
  return diagonal
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
    roh,
  }
}

/**
 * Der Kasten, in dem das Signet liegt – in Pixeln vom Rand.
 *
 * Entfiltert wird zeilenweise nach der PNG-Spezifikation; jede Zeile beginnt
 * mit einem Byte für die Filterart. Ohne diesen Schritt wären alle Zeilen
 * außer der ersten Differenzen zu ihrem Vorgänger und ergäben einen Kasten,
 * der über das ganze Bild reicht – die Prüfung wäre grün und bedeutungslos.
 */
function signetkasten(
  roh: Buffer,
  breite: number,
  hoehe: number,
  grund: [number, number, number]
) {
  const kanal = 3
  const zeilenbytes = breite * kanal
  const bild = Buffer.alloc(zeilenbytes * hoehe)

  for (let y = 0; y < hoehe; y++) {
    const art = roh[y * (zeilenbytes + 1)]
    const quelle = y * (zeilenbytes + 1) + 1
    const ziel = y * zeilenbytes
    for (let i = 0; i < zeilenbytes; i++) {
      const wert = roh[quelle + i]
      const links = i >= kanal ? bild[ziel + i - kanal] : 0
      const oben = y > 0 ? bild[ziel - zeilenbytes + i] : 0
      const diagonal = y > 0 && i >= kanal ? bild[ziel - zeilenbytes + i - kanal] : 0
      let vorhersage = 0
      if (art === 1) vorhersage = links
      else if (art === 2) vorhersage = oben
      else if (art === 3) vorhersage = (links + oben) >> 1
      else if (art === 4) vorhersage = paeth(links, oben, diagonal)
      bild[ziel + i] = (wert + vorhersage) & 0xff
    }
  }

  /*
    Dieselbe Schwelle wie im Skript (Summe der drei Abstände über 40).

    Sie trennt Signet von Grund und lässt die Kantenglättung außen vor. Eine
    andere Schwelle hier ergäbe einen anderen Kasten als dort – und damit eine
    Prüfung, die etwas anderes misst, als sie zusichert.
  */
  let links = breite
  let oben = hoehe
  let rechts = -1
  let unten = -1
  for (let y = 0; y < hoehe; y++) {
    for (let x = 0; x < breite; x++) {
      const i = y * zeilenbytes + x * kanal
      const abstand =
        Math.abs(bild[i] - grund[0]) +
        Math.abs(bild[i + 1] - grund[1]) +
        Math.abs(bild[i + 2] - grund[2])
      if (abstand > 40) {
        if (x < links) links = x
        if (x > rechts) rechts = x
        if (y < oben) oben = y
        if (y > unten) unten = y
      }
    }
  }
  return { links, oben, rechts, unten, breite: rechts - links + 1 }
}

/** Liest `SIGNETANTEIL = 0.70` aus dem Skript, das das Icon erzeugt. */
function signetanteil(): number {
  const treffer = readFileSync(SKRIPT, 'utf8').match(/^SIGNETANTEIL\s*=\s*([\d.]+)/m)
  if (!treffer) {
    throw new Error(
      `SIGNETANTEIL steht nicht in ${SKRIPT}. Umbenannt? Dann gehört diese ` +
        'Prüfung angepasst – nicht gelöscht: Die Kopplung bleibt.'
    )
  }
  return Number(treffer[1])
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

/* ------------------------------------------------ Wie groß steht das Signet */

const anteil = signetanteil()
const kasten = signetkasten(icon.roh, icon.breite, icon.hoehe, ton)
const gemessen = kasten.breite / icon.breite

console.log(
  `\nSignet: ${kasten.breite} von ${icon.breite} Pixeln = ${(gemessen * 100).toFixed(1)} %, ` +
    `Rand ${kasten.links} Pixel (Skript sagt ${(anteil * 100).toFixed(0)} %)`
)

/*
  Eine Toleranz von einem Pixel, nicht mehr.

  Das Skript rundet auf ganze Pixel, und die Kantenglättung kann den
  gemessenen Kasten um einen Pixel verschieben. Zwei Pixel wären schon 1,1 %
  der Kachel – genug, um ein sichtbar verändertes Icon durchzuwinken.
*/
const toleranz = 2 / icon.breite

pruefen(
  `Das Signet nimmt ${(anteil * 100).toFixed(0)} % der Kachelbreite ein`,
  Math.abs(gemessen - anteil) <= toleranz,
  `Gemessen ${(gemessen * 100).toFixed(1)} %, ${SKRIPT} sagt ${(anteil * 100).toFixed(0)} %.\n` +
    '     Neu erzeugen mit: python scripts/app-icon-faerben.py'
)

pruefen(
  'Das Signet steht mittig',
  Math.abs(kasten.links - (icon.breite - 1 - kasten.rechts)) <= 1 &&
    Math.abs(kasten.oben - (icon.hoehe - 1 - kasten.unten)) <= 1,
  `Ränder links ${kasten.links}, rechts ${icon.breite - 1 - kasten.rechts}, ` +
    `oben ${kasten.oben}, unten ${icon.hoehe - 1 - kasten.unten}.`
)

/*
  Die Gegenprobe zur Entfilterung.

  Ohne sie prüfte alles oben an Datenmüll: Eine kaputte Entfilterung liefert
  wildes Rauschen, und Rauschen weicht überall vom Grund ab – der Kasten wäre
  dann das ganze Bild und der Anteil 100 %. Das fiele bei der Prüfung oben zwar
  auf, aber erst als „falscher Anteil", und man suchte am falschen Ende.

  Die Ecke ist bekanntermaßen Grund (das prüft die Zusicherung darüber), und
  die Mitte des Signets ist bekanntermaßen keiner.
*/
pruefen(
  'Die Entfilterung liefert ein Bild und kein Rauschen',
  kasten.links > 0 && kasten.breite < icon.breite,
  `Kasten ${kasten.links}…${kasten.rechts} bei Breite ${icon.breite} – reicht der\n` +
    '     Kasten über das ganze Bild, ist die Entfilterung kaputt, nicht das Icon.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
