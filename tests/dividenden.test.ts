/**
 * Prüfungen für die Auswertung der Dividendenreihen.
 *
 * Der Fehler, um den es hier geht, ist eine Zahl, die plausibel aussieht und
 * falsch ist: eine Rendite von 1,2 Prozent, weil von vier Quartalszahlungen
 * nur zwei in den Zeitraum fielen, oder ein erwarteter Termin, der sich mit
 * jedem Quartal weiter vom tatsächlichen entfernt. Beides fällt beim Ansehen
 * der Website nicht auf.
 */

import {
  jahresSummen,
  rhythmusLabel,
  vereinigeZahlungen,
  werteDividenden,
  type Zahlung,
} from '../lib/dividenden.ts'

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

const HEUTE = '2026-07-30'

/** Baut eine Reihe mit festem Abstand, jüngste Zahlung zuletzt. */
function reihe(
  letzterTag: string,
  abstand: number,
  anzahl: number,
  betrag: number
): Zahlung[] {
  const tage: Zahlung[] = []
  let zeit = Date.parse(`${letzterTag}T00:00:00Z`)
  for (let i = 0; i < anzahl; i += 1) {
    tage.push({ date: new Date(zeit).toISOString().slice(0, 10), amount: betrag })
    zeit -= abstand * 86400000
  }
  return tage.reverse()
}

console.log('\n— Rhythmus —')

const quartal = reihe('2026-05-08', 91, 12, 0.25)
const q = werteDividenden(quartal, 100, HEUTE)
pruefe(
  'vier Zahlungen im Jahr gelten als vierteljährlich',
  q?.rhythmus === 'quartalsweise',
  String(q?.rhythmus)
)
pruefe(
  'halbjährlich wird erkannt',
  werteDividenden(reihe('2026-06-01', 182, 6, 1), 100, HEUTE)?.rhythmus ===
    'halbjaehrlich'
)
pruefe(
  'jährlich wird erkannt',
  werteDividenden(reihe('2026-05-20', 365, 4, 3), 100, HEUTE)?.rhythmus === 'jaehrlich'
)
pruefe(
  'monatlich wird erkannt',
  werteDividenden(reihe('2026-07-01', 30, 24, 0.1), 100, HEUTE)?.rhythmus === 'monatlich'
)

/*
  Eine einzelne Zahlung ist kein Muster. Wer daraus einen Rhythmus ableitet,
  behauptet mehr, als die Daten hergeben.
*/
pruefe(
  'eine einzige Zahlung ergibt keinen Rhythmus',
  werteDividenden([{ date: '2026-03-02', amount: 2 }], 100, HEUTE)?.rhythmus ===
    'unregelmaessig'
)
pruefe(
  'und dann auch keinen erwarteten Termin',
  werteDividenden([{ date: '2026-03-02', amount: 2 }], 100, HEUTE)?.naechsterErwartet ===
    null
)
pruefe('ohne jede Zahlung kommt nichts zurück', werteDividenden([], 100, HEUTE) === null)

console.log('\n— Rendite —')

pruefe(
  'vier Quartalszahlungen von 0,25 bei Kurs 100 sind ein Prozent',
  Math.abs((q?.renditeProzent ?? 0) - 1) < 1e-9,
  String(q?.renditeProzent)
)
pruefe(
  'die Summe der zwölf Monate steht daneben',
  Math.abs((q?.summeZwoelfMonate ?? 0) - 1) < 1e-9
)
pruefe('und wie viele Zahlungen darin stecken', q?.zahlungenZwoelfMonate === 4)

/*
  Der Kern dieser Prüfung: Liegen nur zwei von vier Quartalszahlungen im
  Zeitraum – etwa weil ein Unternehmen erst vor einem halben Jahr mit der
  Ausschüttung begonnen hat –, dann ist die Summe unvollständig. Eine daraus
  gebildete Rendite wäre halb so groß und sähe trotzdem aus wie eine
  Eigenschaft der Aktie.
*/
const halbesJahr = werteDividenden(reihe('2026-06-15', 91, 2, 0.25), 100, HEUTE)
pruefe(
  'bei unvollständigem Jahr gibt es keine Rendite',
  halbesJahr?.renditeProzent === null,
  String(halbesJahr?.renditeProzent)
)
pruefe(
  'die Summe steht aber trotzdem da',
  Math.abs((halbesJahr?.summeZwoelfMonate ?? 0) - 0.5) < 1e-9
)
pruefe(
  'ohne Kurs keine Rendite',
  werteDividenden(quartal, null, HEUTE)?.renditeProzent === null
)
pruefe(
  'mit Kurs null keine Rendite',
  werteDividenden(quartal, 0, HEUTE)?.renditeProzent === null
)

/*
  Die Einheit kürzt sich heraus. Ein britischer Titel steht in Pence, seine
  Dividende auch – die Rendite ist deshalb dieselbe wie in Pfund gerechnet.
  Genau hier liegt der Unterschied zu Kurs-Gewinn- und Kurs-Buchwert-
  Verhältnis, wo die Bilanz in Pfund und der Kurs in Pence steht.
*/
const inPence = werteDividenden(reihe('2026-05-08', 91, 8, 25), 10000, HEUTE)
pruefe(
  'in Pence gerechnet ergibt dieselbe Rendite wie in Pfund',
  Math.abs((inPence?.renditeProzent ?? 0) - (q?.renditeProzent ?? 0)) < 1e-9,
  `${inPence?.renditeProzent} gegen ${q?.renditeProzent}`
)

console.log('\n— Erwarteter nächster Termin —')

pruefe(
  'er liegt in der Zukunft',
  (q?.naechsterErwartet ?? '') > HEUTE,
  String(q?.naechsterErwartet)
)
pruefe(
  'bei vierteljährlicher Zahlung etwa ein Quartal nach der letzten',
  q?.naechsterErwartet === '2026-08-07',
  String(q?.naechsterErwartet)
)
pruefe('die Grundlage der Schätzung wird genannt', Boolean(q?.schaetzungBasis))

/*
  Eine Reihe, deren letzte Zahlung lange zurückliegt, darf keinen Termin in
  der Vergangenheit ausgeben – sonst stünde im Kalender ein Datum, das schon
  vorbei ist, und der Leser hielte es für einen versäumten Termin.
*/
const alt = werteDividenden(reihe('2024-03-01', 91, 8, 0.25), 100, HEUTE)
pruefe(
  'auch bei alter Reihe liegt der geschätzte Termin in der Zukunft',
  (alt?.naechsterErwartet ?? '') > HEUTE,
  String(alt?.naechsterErwartet)
)

console.log('\n— Streuung und Beschriftung —')

pruefe('bei festem Abstand ist die Streuung null', q?.streuungTage === 0)
const schwankend: Zahlung[] = [
  { date: '2025-02-10', amount: 1 },
  { date: '2025-05-20', amount: 1 },
  { date: '2025-08-12', amount: 1 },
  { date: '2025-11-25', amount: 1 },
  { date: '2026-02-09', amount: 1 },
  { date: '2026-05-18', amount: 1 },
]
const s = werteDividenden(schwankend, 200, HEUTE)
pruefe(
  'bei schwankenden Abständen wird die Streuung ausgewiesen',
  (s?.streuungTage ?? 0) > 0,
  String(s?.streuungTage)
)
pruefe(
  'jeder Rhythmus hat eine deutsche Beschriftung',
  Object.values(rhythmusLabel).every((l) => l.length > 3)
)

console.log('\n— Jahressummen für die Verlaufsgrafik —')

/*
  Der eigentliche Fehler, gegen den diese Gruppe schützt: ein zu niedriger
  erster Balken. Das Abrufefenster beginnt Ende Juli; wer das angebrochene
  Jahr mitzählt, zeigt bei einem Quartalszahler zwei statt vier Zahlungen –
  und das sieht aus wie eine halbierte Dividende.
*/
const quartalsweise: Zahlung[] = []
for (let jahr = 2021; jahr <= 2026; jahr += 1) {
  for (const monat of ['02', '05', '08', '11']) {
    // Das Fenster beginnt am 30.07.2021 – davor gibt es keine Daten.
    if (jahr === 2021 && monat < '08') continue
    if (jahr === 2026 && monat > '05') continue
    quartalsweise.push({ date: `${jahr}-${monat}-15`, amount: 1 })
  }
}

const ohneFenster = jahresSummen(quartalsweise, null, HEUTE)
pruefe(
  'ohne bekanntes Fenster faellt das angebrochene erste Jahr weg',
  ohneFenster.jahre[0]?.jahr === 2022,
  String(ohneFenster.jahre[0]?.jahr)
)

const mitFenster = jahresSummen(quartalsweise, '2021-07-30', HEUTE)
pruefe(
  'mit bekanntem Fenster beginnt die Reihe im ersten vollen Jahr',
  mitFenster.jahre[0]?.jahr === 2022,
  String(mitFenster.jahre[0]?.jahr)
)
pruefe(
  'ein volles Jahr traegt alle vier Zahlungen',
  mitFenster.jahre[0]?.zahlungen === 4,
  String(mitFenster.jahre[0]?.zahlungen)
)
pruefe(
  'das laufende Jahr ist gekennzeichnet',
  mitFenster.jahre.at(-1)?.jahr === 2026 && mitFenster.jahre.at(-1)?.laufend === true
)
pruefe(
  'nur das laufende Jahr ist gekennzeichnet',
  mitFenster.jahre.filter((eintrag) => eintrag.laufend).length === 1
)

/*
  Allianz: ein Jahreszahler, dessen erste bekannte Zahlung im Mai 2022 liegt.
  Das Fenster beginnt aber im Juli 2021 – 2022 ist damit vollstaendig erfasst.
  Ohne den Fensterbeginn ginge dieser Balken verloren.
*/
const jaehrlich: Zahlung[] = [
  { date: '2022-05-05', amount: 10 },
  { date: '2023-05-08', amount: 11 },
  { date: '2024-05-13', amount: 13 },
  { date: '2025-05-12', amount: 15 },
  { date: '2026-05-08', amount: 17 },
]
pruefe(
  'beim Jahreszahler rettet der Fensterbeginn das erste volle Jahr',
  jahresSummen(jaehrlich, '2021-07-30', HEUTE).jahre[0]?.jahr === 2022,
  String(jahresSummen(jaehrlich, '2021-07-30', HEUTE).jahre[0]?.jahr)
)
pruefe(
  'ohne Fensterbeginn wird dasselbe Jahr vorsichtshalber verworfen',
  jahresSummen(jaehrlich, null, HEUTE).jahre[0]?.jahr === 2023
)
pruefe(
  'ein Fenster, das am 1. Januar beginnt, macht dieses Jahr vollstaendig',
  jahresSummen(jaehrlich, '2022-01-01', HEUTE).jahre[0]?.jahr === 2022
)

/*
  Eine ausgesetzte Dividende ist eine Aussage, keine Luecke: Das Jahr gehoert
  als Null in die Reihe, sonst wird aus der Aussetzung eine ununterbrochene
  Zahlungsreihe.
*/
const ausgesetzt: Zahlung[] = [
  { date: '2022-05-05', amount: 10 },
  { date: '2023-05-08', amount: 11 },
  // 2024 nichts – die Dividende wurde gestrichen.
  { date: '2025-05-12', amount: 5 },
  { date: '2026-05-08', amount: 6 },
]
const mitLuecke = jahresSummen(ausgesetzt, '2021-07-30', HEUTE)
pruefe(
  'ein ausgesetztes Jahr steht als Null in der Reihe',
  mitLuecke.jahre.some((eintrag) => eintrag.jahr === 2024 && eintrag.summe === 0)
)
pruefe(
  'die Reihe hat keine Luecke',
  mitLuecke.jahre.every(
    (eintrag, i) => i === 0 || eintrag.jahr === mitLuecke.jahre[i - 1].jahr + 1
  )
)

/*
  Ein Unternehmen, das erst spaeter mit der Ausschuettung beginnt, hat die
  Dividende in den Jahren davor nicht ausgesetzt – dort gab es keine. Fuehrende
  Nullen waeren eine Behauptung ueber eine Entscheidung, die niemand traf.
*/
const spaetStarter: Zahlung[] = [
  { date: '2025-03-10', amount: 2 },
  { date: '2026-03-09', amount: 3 },
]
pruefe(
  'fuehrende Nulljahre stehen nicht in der Reihe',
  jahresSummen(spaetStarter, '2021-07-30', HEUTE).jahre[0]?.jahr === 2025
)

/*
  „Laufend“ heisst „es fehlt noch etwas“, nicht „das Kalenderjahr ist nicht
  vorbei“. Bei Allianz stand sonst der hoechste Balken gestrichelt da: einmal
  im Jahr gezahlt, im Mai erledigt – und der Umriss behauptete trotzdem, es
  komme noch etwas.
*/
pruefe(
  'ein Jahreszahler ist nach seiner Zahlung fertig',
  jahresSummen(jaehrlich, '2021-07-30', HEUTE).jahre.at(-1)?.laufend === false
)
pruefe(
  'ein Quartalszahler mitten im Jahr dagegen nicht',
  mitFenster.jahre.at(-1)?.laufend === true
)
pruefe(
  'und dessen abgeschlossene Jahre gehen alle ins Wachstum ein',
  Math.abs((jahresSummen(jaehrlich, '2021-07-30', HEUTE).wachstumProzent ?? 0) - 14.2) <
    0.2,
  String(jahresSummen(jaehrlich, '2021-07-30', HEUTE).wachstumProzent)
)
pruefe(
  'das unfertige Jahr geht nicht ins Wachstum ein',
  jahresSummen(quartalsweise, '2021-07-30', HEUTE).wachstumProzent === 0,
  String(jahresSummen(quartalsweise, '2021-07-30', HEUTE).wachstumProzent)
)
/*
  Eine gestrichene Dividende ergibt minus hundert Prozent, nicht `null`. Das
  ist der Fall, in dem die Zahl am meisten zaehlt – wer sie hier verschweigt,
  verschweigt genau die schlechte Nachricht.
*/
const gestrichen = jahresSummen(
  [
    { date: '2022-05-05', amount: 10 },
    { date: '2023-05-08', amount: 11 },
    { date: '2024-05-13', amount: 6 },
    // 2025 gestrichen, 2026 ebenfalls nichts.
  ],
  '2021-07-30',
  HEUTE
)
pruefe(
  'eine gestrichene Dividende ergibt minus hundert Prozent',
  gestrichen.wachstumProzent === -100,
  String(gestrichen.wachstumProzent)
)
pruefe(
  'und das gestrichene Jahr steht als Null in der Reihe',
  gestrichen.jahre.some((eintrag) => eintrag.jahr === 2025 && eintrag.summe === 0)
)
/*
  Ein Quartalszahler, der 2025 angefangen hat: ein abgeschlossenes Jahr und ein
  laufendes. Aus einem einzigen Wert laesst sich keine Veraenderung bilden –
  eine Zahl waere hier erfunden.
*/
const einJahr: Zahlung[] = [
  { date: '2025-02-14', amount: 1 },
  { date: '2025-05-15', amount: 1 },
  { date: '2025-08-15', amount: 1 },
  { date: '2025-11-14', amount: 1 },
  { date: '2026-02-13', amount: 1 },
  { date: '2026-05-15', amount: 1 },
]
pruefe(
  'ein einziges abgeschlossenes Jahr ergibt keine Wachstumsrate',
  jahresSummen(einJahr, '2021-07-30', HEUTE).wachstumProzent === null,
  String(jahresSummen(einJahr, '2021-07-30', HEUTE).wachstumProzent)
)
pruefe(
  'ohne Zahlungen bleibt die Reihe leer',
  jahresSummen([], null, HEUTE).jahre.length === 0
)

console.log('\n— Zahlungen zusammenfuehren —')

/*
  Der Anlass: Qiagen. Die Firma schuettet in einer Waehrung aus und notiert in
  einer anderen; Yahoo rechnet zum Kurs des Abrufzeitpunkts um. Dieselbe
  Zahlung vom 30.01.2024 kam einmal als 1,2023765 und eine halbe Stunde spaeter
  als 1,2020993 zurueck – und `dividenden.json` aenderte sich deshalb bei jedem
  der zweiundvierzig Laeufe am Tag.
*/
const gespeichert: Zahlung[] = [
  { date: '2024-01-30', amount: 1.2023765 },
  { date: '2025-01-29', amount: 1.1835895 },
]
const wackelig: Zahlung[] = [
  { date: '2024-01-30', amount: 1.2020993 },
  { date: '2025-01-29', amount: 1.1833166 },
]

pruefe(
  'Wechselkursrauschen laesst den gespeicherten Betrag stehen',
  JSON.stringify(vereinigeZahlungen(gespeichert, wackelig)) ===
    JSON.stringify(gespeichert),
  JSON.stringify(vereinigeZahlungen(gespeichert, wackelig))
)

pruefe(
  'eine echte Korrektur kommt durch',
  vereinigeZahlungen(gespeichert, [{ date: '2024-01-30', amount: 1.35 }])[0].amount ===
    1.35
)

pruefe(
  'eine neue Zahlung kommt dazu',
  vereinigeZahlungen(gespeichert, [...wackelig, { date: '2026-01-28', amount: 1.2 }])
    .length === 3
)

/*
  Die neue Liste bestimmt, welche Zahlungen es gibt. Sonst stuende eine
  zurueckgezogene Zahlung fuer immer im Bestand.
*/
pruefe(
  'eine weggefallene Zahlung wird nicht wiederbelebt',
  vereinigeZahlungen(gespeichert, [wackelig[1]]).length === 1
)

pruefe(
  'das Ergebnis ist aufsteigend sortiert',
  vereinigeZahlungen(gespeichert, [
    { date: '2026-01-28', amount: 1.2 },
    { date: '2024-01-30', amount: 1.2020993 },
  ])
    .map((z) => z.date)
    .join(',') === '2024-01-30,2026-01-28'
)

pruefe(
  'ohne gespeicherten Stand kommt die neue Liste unveraendert zurueck',
  JSON.stringify(vereinigeZahlungen([], wackelig)) === JSON.stringify(wackelig)
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
