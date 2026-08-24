/**
 * Prüfungen für den abgeleiteten Meldetermin der Tokioter Börse.
 *
 * ## Der Irrtum, aus dem diese Ableitung entstanden ist
 *
 * Die Spalte `決算期末 / Fiscal Year-end` wurde zuerst für das Ende des
 * gemeldeten Quartals gehalten. Sie ist es nicht – sie nennt das Ende des
 * **Geschäftsjahres**. Wer beides verwechselt, rechnet für Hitachi einen
 * Abstand von **minus 245 Tagen** aus: Die Meldung läge vor dem Zeitraum, den
 * sie meldet.
 *
 * Genau diese negative Zahl hat den Irrtum aufgedeckt. Sie steht deshalb als
 * erste Prüfung hier: Ein Abstand kleiner als null ist kein Wert, sondern ein
 * Zeichen dafür, dass zwei Spalten vertauscht wurden.
 *
 * ## Was hier sonst geprüft wird
 *
 * Dass die vier Quartalsenden zum Geschäftsjahr passen – auch über den
 * Jahreswechsel, wo die naive Rechnung „Monat minus drei" bei 0 und −1 landet.
 * Dass ein abgeleiteter Tag nie auf ein Wochenende fällt. Und dass die
 * Verschiebung je Quartalsstelle überhaupt greift: Ohne sie wäre der
 * Jahresabschluss systematisch zwei Wochen zu früh angesetzt.
 */

import {
  abgeleiteteTermine,
  abstandJeStelle,
  meldemuster,
  quartalsenden,
  streuungJeStelle,
  type JpxTermin,
} from '@/lib/providers/jpx-termine'

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

function zeile(code: string, termin: string, gjEnde: string): JpxTermin {
  return { code, name: `Firma ${code}`, termin, periodenende: gjEnde }
}

/* ----------------------------------------------- Die vier Quartalsenden */

pruefe(
  'ein Geschäftsjahr zum 31. März hat die üblichen vier Enden',
  quartalsenden('2027-03-31').join(' ') === '2026-06-30 2026-09-30 2026-12-31 2027-03-31',
  quartalsenden('2027-03-31').join(' ')
)

/*
  Der Jahreswechsel ist die Stelle, an der die naive Rechnung bricht.

  Bei einem Geschäftsjahr zum 31. Januar ergibt „Monat minus neun" die Zahl
  −8. Wer daraus einen Monat macht, bekommt kein Datum, sondern Unsinn.
*/
pruefe(
  'ein Geschäftsjahr zum 31. Januar rechnet über den Jahreswechsel zurück',
  quartalsenden('2027-01-31').join(' ') === '2026-04-30 2026-07-31 2026-10-31 2027-01-31',
  quartalsenden('2027-01-31').join(' ')
)

pruefe(
  'der Februar bekommt seinen richtigen letzten Tag',
  quartalsenden('2027-02-28')[0] === '2026-05-31' &&
    quartalsenden('2028-02-29').at(-1) === '2028-02-29',
  `${quartalsenden('2027-02-28')[0]} / ${quartalsenden('2028-02-29').at(-1)}`
)

/* --------------------------------------------- Das Muster einer Zeile */

/*
  Der echte Fall: Hitachi, Geschäftsjahr bis 31. März 2027, gemeldet am
  29. Juli 2026. Das ist das erste Quartal, 29 Tage nach dessen Ende.
*/
const hitachi = meldemuster(zeile('6501', '2026-07-29', '2027-03-31'))

pruefe(
  'Hitachi wird dem ersten Quartal zugeordnet',
  hitachi?.stelle === 1 && hitachi?.quartalsende === '2026-06-30',
  JSON.stringify(hitachi)
)

pruefe(
  'und der Abstand ist positiv – 29 Tage, nicht minus 245',
  hitachi?.abstand === 29,
  String(hitachi?.abstand)
)

/*
  Die Gegenprobe zum Irrtum.

  Würde die Spalte als Periodenende gelesen, ergäbe sich der Abstand
  `2026-07-29` minus `2027-03-31` – also minus 245. Diese Prüfung hält fest,
  dass kein Weg durch die Funktion zu einer negativen Zahl führt.
*/
const alleMuster = [
  zeile('1000', '2026-07-29', '2027-03-31'),
  zeile('1001', '2026-10-30', '2027-03-31'),
  zeile('1002', '2027-01-29', '2027-03-31'),
  zeile('1003', '2027-05-12', '2027-03-31'),
  zeile('1004', '2026-09-11', '2026-12-31'),
].map((t) => meldemuster(t))

pruefe(
  'kein Abstand ist negativ',
  alleMuster.every((m) => m !== null && m.abstand > 0),
  alleMuster.map((m) => m?.abstand).join(', ')
)

pruefe(
  'die vier Quartale werden auseinandergehalten',
  alleMuster
    .slice(0, 4)
    .map((m) => m?.stelle)
    .join('') === '1234',
  alleMuster
    .slice(0, 4)
    .map((m) => m?.stelle)
    .join('')
)

/*
  Ein verrutschtes Datum wird verworfen, nicht gemittelt.

  Die Grenze fängt kein langsames Unternehmen – Quartalsenden liegen drei
  Monate auseinander, mehr als 92 Tage kann der Abstand strukturell nicht
  werden. Sie fängt ein `periodenende`, das beim Lesen der Tabelle verrutscht
  ist. Genau das ist hier schon passiert: Toyotas Börsencode 7203 wurde als
  Excel-Datum gelesen und ergab den 24. September 1919.

  Ohne diese Zeile liefe ein solcher Wert mit Zehntausenden Tagen in den
  Median und verschöbe alle abgeleiteten Termine.
*/
pruefe(
  'ein verrutschtes Geschäftsjahresende wird verworfen',
  meldemuster(zeile('7203', '2026-07-29', '1919-09-24')) === null,
  JSON.stringify(meldemuster(zeile('7203', '2026-07-29', '1919-09-24')))
)

/*
  Und die Gegenprobe: Ein Abstand knapp unter der Grenze bleibt drin. Sonst
  wäre nicht gezeigt, dass die Grenze an der richtigen Stelle sitzt.
*/
pruefe(
  'ein später, aber möglicher Abstand bleibt',
  meldemuster(zeile('9998', '2027-03-30', '2027-03-31'))?.abstand === 89,
  JSON.stringify(meldemuster(zeile('9998', '2027-03-30', '2027-03-31')))
)

pruefe(
  'eine Zeile ohne Geschäftsjahresende ergibt kein Muster',
  meldemuster({ code: '1', name: '', termin: '2026-07-29', periodenende: '' }) === null
)

/* ------------------------------------------- Abstand und Streuung je Stelle */

/*
  Ein Markt, in dem das erste Quartal nach 30 Tagen gemeldet wird und der
  Jahresabschluss nach 45. Genau diese Spreizung gibt es in Tokio, und sie
  ist der Grund, warum der eigene Abstand nicht unverändert auf alle vier
  Quartale übertragen werden darf.
*/
const MARKT: JpxTermin[] = [
  zeile('2001', '2026-07-30', '2027-03-31'),
  zeile('2002', '2026-07-30', '2027-03-31'),
  zeile('2003', '2026-07-31', '2027-03-31'),
  zeile('2004', '2027-05-15', '2027-03-31'),
  zeile('2005', '2027-05-15', '2027-03-31'),
  zeile('2006', '2027-05-16', '2027-03-31'),
]

const mediane = abstandJeStelle(MARKT)

pruefe(
  'der Median je Stelle wird getrennt gebildet',
  mediane.get(1) === 30 && mediane.get(4) === 45,
  `Q1 ${mediane.get(1)}, Q4 ${mediane.get(4)}`
)

pruefe(
  'die Streuung ist mindestens ein Tag – null wäre eine Behauptung',
  [...streuungJeStelle(MARKT).values()].every((wert) => wert >= 1),
  JSON.stringify([...streuungJeStelle(MARKT)])
)

/* --------------------------------------------------- Die Ableitung selbst */

/*
  Ein Unternehmen, das sein erstes Quartal nach 23 Tagen meldet – zehn Tage
  vor dem Markt. Sein Jahresabschluss darf deshalb nicht nach 23 Tagen
  angesetzt werden, sondern nach 23 plus der Spreizung des Marktes, also 38.
*/
const schnell = zeile('3001', '2026-07-23', '2027-03-31')
const abgeleitet = abgeleiteteTermine(schnell, mediane, '2026-08-24')

pruefe(
  'es entstehen vier Termine',
  abgeleitet.length === 4,
  `${abgeleitet.length}: ${abgeleitet.map((a) => a.erwartet).join(', ')}`
)

pruefe(
  'alle liegen in der Zukunft',
  abgeleitet.every((a) => a.erwartet > '2026-08-24'),
  abgeleitet.map((a) => a.erwartet).join(', ')
)

pruefe(
  'sie stehen aufsteigend',
  abgeleitet.every((a, i) => i === 0 || a.erwartet > abgeleitet[i - 1].erwartet),
  abgeleitet.map((a) => a.erwartet).join(', ')
)

const jahresabschluss = abgeleitet.find((a) => a.stelle === 4)

/*
  23 eigene Tage plus 15 Tage Spreizung ergeben den 8. Mai 2027 – und der ist
  ein Samstag. Erwartet wird deshalb der Freitag davor. Wer hier den 8. Mai
  stehen lässt, prüft die Verschiebung und übersieht, dass sie auf ein
  Wochenende zeigt.
*/
pruefe(
  'der Jahresabschluss ist um die Spreizung des Marktes nach hinten geschoben',
  jahresabschluss?.erwartet === '2027-05-07',
  `${jahresabschluss?.erwartet} statt 2027-05-07 (23 + 15 Tage nach dem 31. März, Samstag vorgezogen)`
)

/*
  Ohne die Verschiebung stünde dort der 23. April. Die Gegenprobe zeigt, dass
  die Verschiebung wirklich greift und nicht nur im Kommentar steht.
*/
const ohneVerschiebung = abgeleiteteTermine(schnell, new Map(), '2026-08-24').find(
  (a) => a.stelle === 4
)

pruefe(
  'ohne Marktwerte bleibt es beim eigenen Abstand – und das wäre zu früh',
  ohneVerschiebung?.erwartet === '2027-04-23',
  String(ohneVerschiebung?.erwartet)
)

/* ------------------------------------------------------ Kein Wochenende */

/*
  Über zwei Jahre und alle vier Quartale hinweg trifft ein fester Abstand
  zwangsläufig auch Samstage. Keine Börse meldet dann.
*/
const wochenendtreffer: string[] = []
for (let tag = 1; tag <= 28; tag++) {
  const stichtag = `2026-07-${String(tag).padStart(2, '0')}`
  for (const eintrag of abgeleiteteTermine(
    zeile('4001', stichtag, '2027-03-31'),
    mediane,
    '2026-08-24'
  )) {
    const wochentag = new Date(`${eintrag.erwartet}T00:00:00Z`).getUTCDay()
    if (wochentag === 0 || wochentag === 6) wochenendtreffer.push(eintrag.erwartet)
  }
}

pruefe(
  'kein abgeleiteter Termin fällt auf ein Wochenende',
  wochenendtreffer.length === 0,
  wochenendtreffer.slice(0, 5).join(', ')
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert`)
if (gescheitert > 0) process.exit(1)
