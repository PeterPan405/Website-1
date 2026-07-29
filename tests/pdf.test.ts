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
  ...bogenText.matchAll(/\/F1 8 Tf 1 0 0 1 [\d.]+ [\d.]+ Tm \((.*?)\) Tj/g),
]
  .map((treffer) => treffer[1])
  .filter((stueck) => geschaetzt(stueck, 8) > ZU_BREIT)
pruefe(
  'auch im Vermögensbogen bleibt jede Zeile im Satzspiegel',
  zuBreit.length === 0,
  zuBreit.join(' / ')
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
  'das Nettovermögen steht am Ende',
  gefuellt.some(
    (z) => 'text' in z && z.text === 'NETTOVERMÖGEN' && 'betrag' in z && z.betrag
  )
)

/*
  Der leere Bogen ist zum Ausdrucken da. Er darf keine Zahl enthalten – sonst
  steht auf dem Blatt, das jemand mit der Hand ausfüllen will, schon ein Wert.
*/
const leer = alsPdfZeilen({ stichtag: '2026-07-29', weitereSpalten: 0 })
pruefe(
  'der leere Bogen enthält keinen einzigen Betrag',
  leer.every((z) => !('betrag' in z) || !z.betrag || /^[\s.]+$/.test(z.betrag)),
  leer
    .filter((z) => 'betrag' in z && z.betrag && !/^[\s.]+$/.test(z.betrag))
    .map((z) => ('betrag' in z ? z.betrag : ''))
    .join(', ')
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

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
