/**
 * Prüfungen für den PDF-Erzeuger.
 *
 * ## Warum das mehr als eine Formsache ist
 *
 * Eine PDF-Datei ist die eine Sorte Ausgabe, die man nicht ansieht, bevor man
 * sie verschickt. Sie sieht im Zweifel aus wie eine Datei, hat die richtige
 * Größe und lässt sich trotzdem nicht öffnen – weil ein Byte-Versatz in der
 * Querverweistabelle um eins danebenliegt oder eine Klammer im Text die
 * Zeichenkette vorzeitig beendet hat.
 *
 * Diese Prüfungen gehen deshalb an den Aufbau: Kopf, Objektzahl,
 * Querverweistabelle, Ende. Dazu die zwei Stellen, an denen deutscher Text
 * einem PDF gefährlich wird – Umlaute und Klammern.
 */

import { erzeugePdf, type PdfZeile } from '../lib/pdf.ts'
import { alsPdfZeilen, bogen, neueZeile, type Werte } from '../lib/vermoegen.ts'

let bestanden = 0
let gescheitert = 0

function pruefe(name: string, bedingung: boolean, hinweis?: string) {
  if (bedingung) {
    bestanden++
    console.log(`OK   ${name}`)
  } else {
    gescheitert++
    console.error(`FEHL ${name}${hinweis ? ` – ${hinweis}` : ''}`)
  }
}

/** Die Datei als Zeichenkette – jedes Byte ist ein Zeichen. */
function alsText(bytes: Uint8Array): string {
  let text = ''
  for (const byte of bytes) text += String.fromCharCode(byte)
  return text
}

const einfach = erzeugePdf({
  titel: 'Ein Titel',
  untertitel: 'Ein Untertitel',
  fusszeile: 'im-invests.de',
  zeilen: [
    { art: 'unterueberschrift', text: 'Gruppe', betrag: '1.000,00 EUR' },
    { art: 'zeile', text: 'Ein Posten', betrag: '500,00 EUR', eingerueckt: true },
    { art: 'summe', text: 'Summe', betrag: '500,00 EUR' },
  ],
})
const text = alsText(einfach)

console.log('\n— Der Aufbau der Datei —')

pruefe('die Datei beginnt mit der PDF-Kennung', text.startsWith('%PDF-1.'))
pruefe('sie endet mit der Endmarke', text.trimEnd().endsWith('%%EOF'))
pruefe('sie enthält eine Querverweistabelle', text.includes('\nxref\n'))
pruefe('sie enthält einen Katalog', text.includes('/Type /Catalog'))
pruefe('sie enthält genau einen Seitenbaum', text.split('/Type /Pages').length === 2)
pruefe('sie enthält mindestens eine Seite', text.includes('/Type /Page '))
pruefe('das Seitenformat ist A4', text.includes('/MediaBox [0 0 595 842]'))

/*
  Die gefährlichste Stelle: Die Querverweistabelle nennt für jedes Objekt seine
  Byte-Position. Steht dort eine falsche Zahl, meldet der Betrachter „Datei
  beschädigt“ – und zwar erst beim Öffnen, nicht beim Erzeugen.
*/
const xrefStelle = text.indexOf('\nxref\n')
const eintraege = text
  .slice(xrefStelle)
  .split('\n')
  .filter((zeile) => /^\d{10} \d{5} [nf] $/.test(zeile))
const objektzahl = (text.match(/^\d+ 0 obj$/gm) ?? []).length

pruefe(
  'die Querverweistabelle hat einen Eintrag je Objekt plus den freien',
  eintraege.length === objektzahl + 1,
  `${eintraege.length} Einträge, ${objektzahl} Objekte`
)

let stimmen = 0
for (let nummer = 1; nummer <= objektzahl; nummer += 1) {
  const position = Number(eintraege[nummer].slice(0, 10))
  if (text.startsWith(`${nummer} 0 obj`, position)) stimmen += 1
}
pruefe(
  'jede genannte Position zeigt auf den Anfang ihres Objekts',
  stimmen === objektzahl,
  `${stimmen} von ${objektzahl}`
)

const startxref = Number(/startxref\n(\d+)/.exec(text)?.[1] ?? -1)
pruefe(
  'startxref zeigt auf die Querverweistabelle',
  text.startsWith('xref', startxref),
  `Position ${startxref}`
)

const laengen = [...text.matchAll(/<< \/Length (\d+) >>\nstream\n/g)]
let laengenStimmen = 0
for (const treffer of laengen) {
  const beginn = treffer.index + treffer[0].length
  const ende = text.indexOf('endstream', beginn)
  if (ende - beginn === Number(treffer[1])) laengenStimmen += 1
}
pruefe(
  'jede angegebene Stromlänge stimmt mit dem Inhalt überein',
  laengen.length > 0 && laengenStimmen === laengen.length,
  `${laengenStimmen} von ${laengen.length}`
)

console.log('\n— Deutscher Text —')

const heikel = alsText(
  erzeugePdf({
    titel: 'Vermögensübersicht',
    zeilen: [
      { art: 'zeile', text: 'Rürup (steuerlich gefördert)', betrag: '1,00 EUR' },
      { art: 'zeile', text: 'Größe – Straße', betrag: '2,00 EUR' },
      { art: 'hinweis', text: 'Ein Betrag in € und ein \\ Zeichen' },
    ],
  })
)

/*
  Klammern und der Rückstrich beenden in PDF eine Zeichenkette. Bleiben sie
  unmaskiert, ist ab dieser Stelle alles verschoben und die Datei kaputt – ein
  Fehler, den man an einer Zeile mit „(steuerlich gefördert)“ nicht erwartet.
*/
pruefe(
  'Klammern im Text sind maskiert',
  heikel.includes('\\(steuerlich gef') && heikel.includes('rdert\\)')
)
pruefe('der Rückstrich ist maskiert', heikel.includes('\\\\ Zeichen'))
pruefe(
  'Umlaute stehen als einzelne WinAnsi-Bytes da',
  heikel.includes(`Verm${String.fromCharCode(0xf6)}gens`),
  'ö als 0xF6'
)
pruefe(
  'das scharfe S ebenso',
  heikel.includes(`Stra${String.fromCharCode(0xdf)}e`),
  'ß als 0xDF'
)
pruefe(
  'das Eurozeichen wird auf seine WinAnsi-Position gelegt',
  heikel.includes(`in ${String.fromCharCode(0x80)} und`),
  '€ als 0x80'
)
pruefe(
  'der Gedankenstrich ebenso',
  heikel.includes(`e ${String.fromCharCode(0x96)} Stra`),
  '– als 0x96'
)
pruefe(
  'die Schriften sind als WinAnsi ausgezeichnet',
  heikel.includes('/WinAnsiEncoding')
)

console.log('\n— Der rechte Rand —')

/*
  Der Fehler, der diese Prüfung ausgelöst hat: Die Erklärungen unter den
  Gruppenüberschriften sind ganze Sätze und liefen als eine Zeile über den
  rechten Rand hinaus. Beim Ansehen der Datei fiel es nicht auf – beim
  Ausdrucken wäre der Satz dort abgeschnitten gewesen.

  Geprüft wird an den Textbefehlen selbst: Jede gesetzte Zeile beginnt mit
  ihrer x-Position, und aus Position plus geschätzter Breite ergibt sich, wo
  sie endet. Die Schätzung ist dieselbe wie beim Umbrechen, also stimmt die
  Prüfung mit dem überein, was das Modul tut.
*/
const langerHinweis =
  'Der heutige Rückkaufs- oder Anwartschaftswert. Bei der gesetzlichen Rente ' +
  'steht dieser Wert in der jährlichen Renteninformation, und zwar auf der ' +
  'zweiten Seite unter der Überschrift zur künftigen Entwicklung.'

const umbrochen = alsText(
  erzeugePdf({
    titel: 'Umbruch',
    zeilen: [
      { art: 'unterueberschrift', text: 'Gruppe' },
      { art: 'hinweis', text: langerHinweis },
    ],
  })
)

const hinweisZeilen = [...umbrochen.matchAll(/1 0 0 1 [\d.]+ [\d.]+ Tm \((.*?)\) Tj/g)]
  .map((treffer) => treffer[1])
  .filter((stueck) => stueck.length > 0 && langerHinweis.includes(stueck.slice(0, 12)))

pruefe(
  'ein langer Hinweis wird auf mehrere Zeilen verteilt',
  hinweisZeilen.length > 1,
  `${hinweisZeilen.length} Zeile(n)`
)
pruefe(
  'zusammengesetzt ergibt sich wieder der ganze Satz',
  hinweisZeilen.join(' ').length === langerHinweis.length,
  `${hinweisZeilen.join(' ').length} statt ${langerHinweis.length} Zeichen`
)

/* Die Umbruchbreite: 595 minus zweimal 52 Rand ergibt 491 Punkt. */
const ZU_BREIT = 491
function geschaetzt(text: string, groesse: number): number {
  let breite = 0
  for (const zeichen of text) {
    if ("iljtI.,;:!|'`".includes(zeichen)) breite += 0.3
    else if ('fr()[]/\\-'.includes(zeichen)) breite += 0.36
    else if ('mwMW'.includes(zeichen)) breite += 0.87
    else if (zeichen >= 'A' && zeichen <= 'Z') breite += 0.71
    else if (zeichen === ' ') breite += 0.28
    else breite += 0.56
  }
  return breite * groesse
}
pruefe(
  'keine Hinweiszeile ist breiter als der Satzspiegel',
  hinweisZeilen.every((stueck) => geschaetzt(stueck, 8) <= ZU_BREIT),
  hinweisZeilen
    .filter((stueck) => geschaetzt(stueck, 8) > ZU_BREIT)
    .map((stueck) => `${Math.round(geschaetzt(stueck, 8))}pt`)
    .join(', ')
)

/*
  Dieselbe Prüfung für den echten Bogen: Seine Erklärungen sind die längsten
  Texte im Dokument.
*/
const bogenText = alsText(
  erzeugePdf({
    titel: 'Vermögensübersicht',
    zeilen: alsPdfZeilen({ stichtag: '2026-07-29', weitereSpalten: 0 }),
  })
)
const zuBreit = [
  ...bogenText.matchAll(/\/F3 8 Tf 1 0 0 1 [\d.]+ [\d.]+ Tm \((.*?)\) Tj/g),
]
  .map((treffer) => treffer[1])
  .filter((stueck) => geschaetzt(stueck, 8) > ZU_BREIT)
pruefe(
  'auch im Vermögensbogen bleibt jede Zeile im Satzspiegel',
  zuBreit.length === 0,
  zuBreit.join(' / ')
)

console.log('\n— Das Signet und die Farben —')

const geschmueckt = alsText(
  erzeugePdf({
    titel: 'Vermögensübersicht',
    untertitel: 'Stichtag 29.07.2026',
    marke: 'IM Invests',
    fusszeile: 'im-invests.de',
    zeilen: [
      { art: 'unterueberschrift', text: 'Konten', betrag: '1.000,00 EUR', ton: 'navy' },
      { art: 'zeile', text: 'Girokonto', betrag: '600,00 EUR', eingerueckt: true },
      { art: 'zeile', text: 'Tagesgeld', betrag: '400,00 EUR', eingerueckt: true },
      { art: 'zeile', text: 'Festgeld', eingerueckt: true, schreiblinie: true },
      { art: 'summe', text: 'Summe', betrag: '1.000,00 EUR' },
      { art: 'abschluss', text: 'Nettovermögen', betrag: '1.000,00 EUR' },
    ],
  })
)

/*
  Das Logo wird als Pfad gezeichnet, nicht mehr als Bogen und Kreis.

  Die Pfaddaten stammen wörtlich aus `public/logo.svg`. Beim Übertragen kann
  genau zweierlei schiefgehen, und beides ergibt trotzdem eine gültige Datei:
  Der Maßstab stimmt nicht, oder die y-Achse ist nicht gespiegelt – SVG zählt
  nach unten, PDF nach oben. Sichtbar wird das erst auf dem Papier.

  Deshalb wird nachgerechnet, wo die Punkte landen: Ein Signet mit 40 Punkt
  Kantenlänge an der linken oberen Ecke des Satzspiegels muss vollständig in
  diesem Quadrat liegen. Bei fehlender Spiegelung läge es darunter, bei
  falschem Maßstab ragte es heraus.
*/
const RAND = 52
const KOPF = 842 - 46
const punkteImSignet = [...geschmueckt.matchAll(/^([\d.]+) ([\d.]+) m$/gm)].map(
  (treffer) => ({ x: Number(treffer[1]), y: Number(treffer[2]) })
)

const imKasten = punkteImSignet.filter(
  (punkt) =>
    punkt.x >= RAND - 0.5 &&
    punkt.x <= RAND + 40.5 &&
    punkt.y <= KOPF + 0.5 &&
    punkt.y >= KOPF - 40.5
)

pruefe(
  'das Signet liegt vollständig in seinem Quadrat',
  punkteImSignet.length > 0 && imKasten.length === punkteImSignet.length,
  `${imKasten.length} von ${punkteImSignet.length} Startpunkten im Kasten`
)

/*
  Ein zweiter Fehler, den die Lage allein nicht fängt: ein Pfad, von dem nur
  ein Teil ankommt. Die vier Figuren zusammen bestehen aus 145 Kurven; der
  Schriftzug kommt auf der ersten Seite dazu. Die Zahl steht hier als
  Untergrenze, damit ein zusätzlicher Feinschliff am Logo sie nicht bricht,
  eine halb übertragene Figur aber sehr wohl.
*/
const kurven = (geschmueckt.match(/ c\n/g) ?? []).length
pruefe('alle Kurven des Zeichens kommen an', kurven >= 145, `${kurven} Kurven`)

/*
  Der Schriftzug „IMI“ erscheint erst ab 34 Punkt Kantenlänge. Die erste Seite
  trägt das große Signet, jede weitere ein kleines – auf der zweiten darf der
  Schriftzug deshalb nicht auftauchen.
*/
const seitenStroeme = stroeme(geschmueckt)
const kurvenJeSeite = seitenStroeme.map((strom) => (strom.match(/ c\n/g) ?? []).length)
pruefe(
  'der Schriftzug steht nur im großen Signet',
  kurvenJeSeite.length >= 1 && kurvenJeSeite[0] > 145,
  `Kurven je Seite: ${kurvenJeSeite.join(', ')}`
)

/*
  Die Figuren werden gefüllt, nicht gestrichen. Vorher waren sie Striche mit
  runden Enden; stünde eine Logofarbe noch als Strichfarbe da, wäre ein Rest
  der alten Fassung stehen geblieben.
*/
for (const [name, farbe] of [
  ['Navy', '0.09 0.161 0.435'],
  ['Grau', '0.431 0.431 0.431'],
  ['Rot', '0.545 0.133 0.145'],
  ['Grün', '0.125 0.329 0.216'],
] as const) {
  pruefe(
    `${name} aus dem Logo wird als Fläche gesetzt`,
    geschmueckt.includes(`${farbe} rg`) && !geschmueckt.includes(`${farbe} RG`)
  )
}

pruefe('der Markenname steht im Kopf', geschmueckt.includes('(IM Invests) Tj'))
pruefe(
  'die Summe liegt auf einem Band, das Ergebnis in einem Kasten',
  (geschmueckt.match(/ re f\n/g) ?? []).length >= 3
)
pruefe(
  'Erklärungen stehen kursiv, alles andere gerade',
  geschmueckt.includes('/Helvetica-Oblique') &&
    geschmueckt.includes('/BaseFont /Helvetica /') &&
    geschmueckt.includes('/BaseFont /Helvetica-Bold ')
)
pruefe('keine Schreibmaschinenschrift mehr', !geschmueckt.includes('Courier'))

/*
  Rechtsbündige Beträge.

  PDF kennt keine Ausrichtung: Das Modul rechnet die Textbreite aus und
  verschiebt die Startposition entsprechend. Rechnet es falsch, steht der Betrag
  irgendwo – und weil eine PDF-Datei trotzdem gültig ist, fällt das erst auf dem
  Papier auf.

  Geprüft wird deshalb nicht die Startposition, sondern die Kante: Startposition
  plus Breite muss dort landen, wo die Spalte endet. Die Breiten stehen hier noch
  einmal, damit die Prüfung eine eigene Rechnung ist und nicht dieselbe.
*/
const BREITEN: Record<string, number> = {
  '0': 556,
  '1': 556,
  '2': 556,
  '3': 556,
  '4': 556,
  '5': 556,
  '6': 556,
  '7': 556,
  '8': 556,
  '9': 556,
  ' ': 278,
  '.': 278,
  ',': 278,
  '-': 333,
  E: 667,
  U: 722,
  R: 722,
}
function betragsbreite(inhalt: string, groesse: number): number {
  let summe = 0
  for (const zeichen of inhalt) summe += BREITEN[zeichen] ?? 0
  return (summe / 1000) * groesse
}

const gesetzt = [
  ...geschmueckt.matchAll(
    /\/(F\d) ([\d.]+) Tf 1 0 0 1 ([\d.]+) [\d.]+ Tm \(([\d.]+,\d\d EUR)\) Tj/g
  ),
].map((treffer) => ({
  groesse: Number(treffer[2]),
  betrag: treffer[4],
  kante: Number(treffer[3]) + betragsbreite(treffer[4], Number(treffer[2])),
}))

pruefe(
  'jeder Betrag steht rechtsbündig und keiner ragt über den Rand',
  gesetzt.length === 5 &&
    gesetzt.every((stelle) => stelle.kante <= 543.02 && stelle.kante >= 520),
  gesetzt.map((stelle) => `${stelle.betrag}→${stelle.kante.toFixed(2)}`).join(', ')
)

/*
  Und die eigentliche Spalte: Alle Posten stehen in derselben Größe und müssen
  deshalb auf denselben Punkt enden. Zwei Beträge unterschiedlicher Länge, die
  nicht bündig enden, sind der Fehler, den man beim Überfliegen einer Liste
  sofort sieht.
*/
const posten = gesetzt.filter((stelle) => stelle.groesse === 9.5)
const kanten = posten.map((stelle) => stelle.kante)
pruefe(
  'die Beträge der Posten enden alle auf demselben Punkt',
  posten.length >= 2 && Math.max(...kanten) - Math.min(...kanten) < 0.02,
  kanten.map((kante) => kante.toFixed(2)).join(', ')
)

console.log('\n— Mehrere Seiten —')

const viele: PdfZeile[] = []
for (let i = 0; i < 200; i += 1) {
  viele.push({ art: 'zeile', text: `Zeile ${i}`, betrag: '1.234,56 EUR' })
}
const lang = alsText(erzeugePdf({ titel: 'Lang', fusszeile: 'Fuß', zeilen: viele }))
const seitenzahl = (lang.match(/\/Type \/Page /g) ?? []).length

pruefe('lange Dokumente brechen auf mehrere Seiten um', seitenzahl > 1, `${seitenzahl}`)
pruefe(
  'der Seitenbaum zählt genauso viele Seiten',
  lang.includes(`/Count ${seitenzahl}`),
  `Count sollte ${seitenzahl} sein`
)
/*
  Gezählt wird der Anfang eines Stroms, nicht das Wort „stream“: In „endstream“
  steckt es ebenfalls, und die erste Fassung dieser Prüfung hat deshalb jede
  Seite doppelt gezählt.
*/
pruefe(
  'jede Seite hat einen eigenen Inhaltsstrom',
  (lang.match(/<< \/Length \d+ >>\nstream\n/g) ?? []).length === seitenzahl,
  `${(lang.match(/<< \/Length \d+ >>\nstream\n/g) ?? []).length} Ströme, ${seitenzahl} Seiten`
)
pruefe(
  'die Seitenzahl steht im Fuß',
  lang.includes(`Seite 1 von ${seitenzahl}`) &&
    lang.includes(`Seite ${seitenzahl} von ${seitenzahl}`)
)

console.log('\n— Der Vermögensbogen als PDF —')

const werte: Werte = {
  giro: [neueZeile(2_000, 'Girokonto Sparkasse'), neueZeile(800, 'Gemeinschaftskonto')],
  depot: [neueZeile(48_000)],
  hypothek: [neueZeile(180_000)],
}

const gefuellt = alsPdfZeilen({ werte, stichtag: '2026-07-29', weitereSpalten: 0 })
const gefuelltText = alsText(
  erzeugePdf({ titel: 'Vermögensübersicht', zeilen: gefuellt })
)

pruefe(
  'jede Gruppe steht als Überschrift im Dokument',
  bogen.every((gruppe) => gefuellt.some((z) => 'text' in z && z.text === gruppe.titel))
)
pruefe(
  'benannte Zeilen erscheinen mit ihrem Namen',
  gefuellt.some((z) => 'text' in z && z.text === 'Girokonto Sparkasse') &&
    gefuellt.some((z) => 'text' in z && z.text === 'Gemeinschaftskonto')
)
pruefe(
  'eine Zeile ohne Namen bekommt die Bezeichnung des Postens',
  gefuellt.some((z) => 'text' in z && z.text === 'Depot: Aktien und ETFs')
)
pruefe(
  'Beträge stehen mit Tausenderpunkt und Währung da',
  gefuellt.some((z) => 'betrag' in z && z.betrag === '48.000,00 EUR'),
  gefuellt
    .filter((z) => 'betrag' in z && z.betrag)
    .slice(0, 4)
    .map((z) => ('betrag' in z ? z.betrag : ''))
    .join(', ')
)
pruefe(
  'das Nettovermögen steht am Ende, und zwar als Kasten',
  gefuellt.at(-3)?.art === 'abschluss' &&
    gefuellt.some(
      (z) => z.art === 'abschluss' && z.text === 'Nettovermögen' && Boolean(z.betrag)
    )
)
pruefe(
  'Besitz bekommt den navyfarbenen, Schulden den roten Balken',
  bogen.every((gruppe) =>
    gefuellt.some(
      (z) =>
        z.art === 'unterueberschrift' &&
        z.text === gruppe.titel &&
        z.ton === (gruppe.art === 'besitz' ? 'navy' : 'rot')
    )
  )
)

/*
  Der leere Bogen ist zum Ausdrucken da. Er darf keine Zahl enthalten – sonst
  steht auf dem Blatt, das jemand mit der Hand ausfüllen will, schon ein Wert.
*/
const leer = alsPdfZeilen({ stichtag: '2026-07-29', weitereSpalten: 0 })
pruefe(
  'der leere Bogen enthält keinen einzigen Betrag',
  leer.every((z) => !('betrag' in z) || !z.betrag),
  leer
    .filter((z) => 'betrag' in z && z.betrag)
    .map((z) => ('betrag' in z ? z.betrag : ''))
    .join(', ')
)
pruefe(
  'stattdessen bekommt jeder Posten eine Linie zum Eintragen',
  leer.filter((z) => z.art === 'zeile' && z.schreiblinie).length ===
    bogen.reduce((summe, gruppe) => summe + gruppe.posten.length, 0)
)
pruefe(
  'im ausgefüllten Bogen steht keine solche Linie',
  gefuellt.every((z) => z.art !== 'zeile' || !z.schreiblinie)
)
pruefe(
  'er zeigt trotzdem alle Posten',
  bogen.every((gruppe) =>
    gruppe.posten.every((posten) =>
      leer.some((z) => 'text' in z && z.text === posten.label)
    )
  )
)
pruefe(
  'und lässt sich in ein PDF setzen',
  alsText(erzeugePdf({ titel: 'Leer', zeilen: leer })).startsWith('%PDF-')
)
pruefe('das gefüllte Dokument ist eine gültige Datei', gefuelltText.includes('%%EOF'))

/*
  Keine Fläche darf eine Schreiblinie zudecken.

  Der Fehler, der diese Prüfung ausgelöst hat: Der Kasten für das
  Nettovermögen reichte mit seiner Oberkante in die Zeile darüber und malte
  deren Schreiblinie zu. In der Datei stand die Linie – sie war nur nicht mehr
  zu sehen, und zwar an genau einer von drei Stellen. Auffallen konnte das nur
  im Ausdruck.

  Geprüft wird an der Reihenfolge im Inhaltsstrom: Was später gezeichnet wird,
  liegt oben. Eine Linie ist verdeckt, wenn eine danach gefüllte Fläche sie
  vollständig überspannt.

  Und zwar je Seite. Die erste Fassung dieser Prüfung sah die ganze Datei als
  einen Strom an und meldete prompt zwei Linien auf Seite 1 als verdeckt – von
  Flächen auf Seite 2, die zufällig auf derselben Höhe lagen.
*/
const leerText = alsText(erzeugePdf({ titel: 'Leer', zeilen: leer }))

/** Die Inhaltsströme der einzelnen Seiten. */
function stroeme(datei: string): string[] {
  return [...datei.matchAll(/<< \/Length (\d+) >>\nstream\n/g)].map((treffer) =>
    datei.slice(
      treffer.index + treffer[0].length,
      treffer.index + treffer[0].length + Number(treffer[1])
    )
  )
}

type Gemalt =
  | {
      art: 'flaeche'
      x: number
      y: number
      breite: number
      hoehe: number
      stelle: number
    }
  | { art: 'linie'; x1: number; x2: number; y: number; stelle: number }

const verdeckt: string[] = []
let linienGesamt = 0

for (const [nummer, strom] of stroeme(leerText).entries()) {
  const gemalt: Gemalt[] = []
  for (const treffer of strom.matchAll(
    /(?:([\d.-]+) ([\d.-]+) ([\d.-]+) ([\d.-]+) re f)|(?:[\d.]+ w ([\d.-]+) ([\d.-]+) m ([\d.-]+) ([\d.-]+) l S)/g
  )) {
    if (treffer[1] !== undefined) {
      gemalt.push({
        art: 'flaeche',
        x: Number(treffer[1]),
        y: Number(treffer[2]),
        breite: Number(treffer[3]),
        hoehe: Number(treffer[4]),
        stelle: treffer.index,
      })
    } else {
      gemalt.push({
        art: 'linie',
        x1: Number(treffer[5]),
        y: Number(treffer[6]),
        x2: Number(treffer[7]),
        stelle: treffer.index,
      })
    }
  }

  for (const stueck of gemalt) {
    if (stueck.art !== 'linie') continue
    linienGesamt += 1
    const daueber = gemalt.some(
      (oben) =>
        oben.art === 'flaeche' &&
        oben.stelle > stueck.stelle &&
        oben.x <= stueck.x1 &&
        oben.x + oben.breite >= stueck.x2 &&
        oben.y <= stueck.y &&
        oben.y + oben.hoehe >= stueck.y
    )
    if (daueber) verdeckt.push(`Seite ${nummer + 1}, y=${stueck.y}`)
  }
}

pruefe(
  'auf dem leeren Bogen deckt keine Fläche eine Linie zu',
  linienGesamt > 0 && verdeckt.length === 0,
  verdeckt.join(' / ')
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
