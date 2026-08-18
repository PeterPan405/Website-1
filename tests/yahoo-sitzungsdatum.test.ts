/**
 * Das Sitzungsdatum – und der Fehler, der ein Jahr lang unsichtbar war.
 *
 * ## Der Fall
 *
 * Yahoo liefert je Handelstag einen Unix-Zeitstempel: den Moment der
 * Börseneröffnung. Daraus wurde bisher mit `toISOString()` ein Datum – also
 * der Tag in **UTC**. Für Frankfurt und New York geht das gut, weil die
 * Eröffnung dort in derselben UTC-Kalenderwoche liegt wie vor Ort.
 *
 * Für Sydney nicht. 10:00 AEST sind 0:00 UTC – gerade noch derselbe Tag. Aber
 * 10:00 AEDT, also nach Beginn der australischen Sommerzeit, sind 23:00 UTC
 * **am Vortag**. Ab dem 5. Oktober 2025 wurde damit aus jeder Montagssitzung
 * ein Sonntag, aus jedem Freitag ein Donnerstag.
 *
 * Betroffen waren 31 Titel. Der Kurs stimmte jeweils, nur der Tag nicht.
 *
 * ## Was hier geprüft wird
 *
 * 1. **Der Fall, an dem es kaputtging** – Sydney rund um die Umstellung.
 * 2. **Die Fälle, an denen nie etwas kaputt war** – Frankfurt, New York,
 *    Tokio dürfen sich nicht bewegen. Eine Korrektur, die den Rest verschiebt,
 *    wäre schlimmer als der Fehler.
 * 3. **Die Rückfälle** – ohne Zeitzone, ohne alles.
 */

import { parseYahooChart, sitzungsdatum } from '@/lib/providers/yahoo'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/** Sekunden seit 1970 für einen UTC-Zeitpunkt. */
function utc(
  jahr: number,
  monat: number,
  tag: number,
  stunde = 0,
  minute = 0
): number {
  return Date.UTC(jahr, monat - 1, tag, stunde, minute) / 1000
}

/* ------------------------------------------------- Der Fall in Sydney */

/*
  Montag, 6. Oktober 2025, 10:00 Uhr Ortszeit in Sydney.

  Die australische Sommerzeit begann am 5. Oktober; Sydney steht damit auf
  UTC+11. Die Eröffnung liegt also am 5. Oktober um 23:00 UTC – und genau
  daraus wurde bisher der 5. Oktober, ein Sonntag.
*/
const montagAEDT = utc(2025, 10, 5, 23, 0)

pruefen(
  'Sydney in der Sommerzeit: aus 23:00 UTC am Sonntag wird Montag',
  sitzungsdatum(montagAEDT, 'Australia/Sydney') === '2025-10-06',
  `${sitzungsdatum(montagAEDT, 'Australia/Sydney')} – erwartet 2025-10-06.`
)

pruefen(
  'Die Gegenprobe: ohne Zeitzone kommt der alte, falsche Tag heraus',
  sitzungsdatum(montagAEDT) === '2025-10-05',
  'Sonst prüft der Fall darüber nichts – dann wäre die Zeitzone wirkungslos\n' +
    '     und das Ergebnis zufällig richtig.'
)

/*
  Und derselbe Wochentag zwei Wochen vorher, noch in der Winterzeit.

  Sydney steht auf UTC+10, die Eröffnung liegt um 0:00 UTC am selben Tag. Hier
  war das alte Verhalten schon richtig – die Korrektur darf daran nichts
  ändern.
*/
const montagAEST = utc(2025, 9, 22, 0, 0)
pruefen(
  'Sydney in der Winterzeit: der Tag bleibt, wie er war',
  sitzungsdatum(montagAEST, 'Australia/Sydney') === '2025-09-22' &&
    sitzungsdatum(montagAEST) === '2025-09-22',
  `mit Zeitzone ${sitzungsdatum(montagAEST, 'Australia/Sydney')}, ` +
    `ohne ${sitzungsdatum(montagAEST)}`
)

/*
  Neuseeland ist ganzjährig verschoben: UTC+12 im Winter, UTC+13 im Sommer.
  Die Eröffnung um 10:00 Ortszeit liegt immer am Vortag in UTC.
*/
pruefen(
  'Wellington: auch im Winter der richtige Tag',
  sitzungsdatum(utc(2025, 7, 6, 22, 0), 'Pacific/Auckland') === '2025-07-07',
  `${sitzungsdatum(utc(2025, 7, 6, 22, 0), 'Pacific/Auckland')} – erwartet 2025-07-07.`
)

/* -------------------------------- Die Börsen, an denen nichts kaputt war */

console.log('')

/*
  Der wichtigste Abschnitt.

  Eine Korrektur, die Sydney richtigstellt und dabei Frankfurt verschiebt,
  wäre ein schlechterer Zustand als vorher – 31 falsche Titel gegen tausend.
  Geprüft wird deshalb für jede große Börse, dass sich **nichts** ändert.
*/
const unveraendert: { was: string; sekunden: number; zone: string; tag: string }[] = [
  // Xetra, 9:00 MESZ = 7:00 UTC
  { was: 'Xetra im Sommer', sekunden: utc(2026, 6, 15, 7, 0), zone: 'Europe/Berlin', tag: '2026-06-15' },
  // Xetra, 9:00 MEZ = 8:00 UTC
  { was: 'Xetra im Winter', sekunden: utc(2026, 1, 15, 8, 0), zone: 'Europe/Berlin', tag: '2026-01-15' },
  // NYSE, 9:30 EDT = 13:30 UTC
  { was: 'New York im Sommer', sekunden: utc(2026, 6, 15, 13, 30), zone: 'America/New_York', tag: '2026-06-15' },
  // NYSE, 9:30 EST = 14:30 UTC
  { was: 'New York im Winter', sekunden: utc(2026, 1, 15, 14, 30), zone: 'America/New_York', tag: '2026-01-15' },
  // Tokio, 9:00 JST = 0:00 UTC – der knappste Fall ohne Sommerzeit
  { was: 'Tokio', sekunden: utc(2026, 6, 15, 0, 0), zone: 'Asia/Tokyo', tag: '2026-06-15' },
  // London, 8:00 BST = 7:00 UTC
  { was: 'London', sekunden: utc(2026, 6, 15, 7, 0), zone: 'Europe/London', tag: '2026-06-15' },
  // Hongkong, 9:30 HKT = 1:30 UTC
  { was: 'Hongkong', sekunden: utc(2026, 6, 15, 1, 30), zone: 'Asia/Hong_Kong', tag: '2026-06-15' },
  // São Paulo, 10:00 BRT = 13:00 UTC
  { was: 'São Paulo', sekunden: utc(2026, 6, 15, 13, 0), zone: 'America/Sao_Paulo', tag: '2026-06-15' },
]

for (const fall of unveraendert) {
  const mit = sitzungsdatum(fall.sekunden, fall.zone)
  const ohne = sitzungsdatum(fall.sekunden)
  pruefen(
    `${fall.was}: unverändert ${fall.tag}`,
    mit === fall.tag && ohne === fall.tag,
    `mit Zeitzone ${mit}, ohne ${ohne} – die Korrektur darf hier nichts bewegen.`
  )
}

/*
  Kryptowährungen handeln an sieben Tagen, und ihre Wochenenddaten sind
  richtig. Yahoo meldet sie in UTC – die Korrektur muss sie in Ruhe lassen.
*/
pruefen(
  'Bitcoin am Sonntag bleibt am Sonntag',
  sitzungsdatum(utc(2026, 6, 14, 0, 0), 'UTC') === '2026-06-14',
  'Krypto handelt an sieben Tagen; ein Sonntag ist dort kein Fehler.'
)

/* ------------------------------------------------------- Die Rückfälle */

console.log('')

pruefen(
  'Ohne Zeitzone greift der Versatz',
  sitzungsdatum(montagAEDT, undefined, 11 * 3600) === '2025-10-06',
  `${sitzungsdatum(montagAEDT, undefined, 11 * 3600)}`
)

/*
  Der Versatz darf um Stunden danebenliegen.

  Er stammt aus dem Moment des Abrufs und passt deshalb bei einer
  Fünf-Jahres-Reihe nur zur Hälfte der Punkte. Für ein Tagesdatum reicht das
  trotzdem: Die Sitzung beginnt um 10 Uhr Ortszeit, eine Stunde Fehler ändert
  den Tag nicht. Geprüft mit dem *falschen* Versatz von +10 auf einen
  Sommerzeit-Zeitstempel.
*/
pruefen(
  'Ein um eine Stunde falscher Versatz trifft den Tag trotzdem',
  sitzungsdatum(montagAEDT, undefined, 10 * 3600) === '2025-10-06',
  `${sitzungsdatum(montagAEDT, undefined, 10 * 3600)} – die Eröffnung liegt um 10 Uhr\n` +
    '     Ortszeit, da ist eine Stunde Spielraum nach beiden Seiten.'
)

pruefen(
  'Eine unbekannte Zeitzone wirft nicht, sondern fällt zurück',
  sitzungsdatum(montagAEDT, 'Mittelerde/Auenland', 11 * 3600) === '2025-10-06',
  'Ein Wurf hier hieße: keine Kursreihe für diesen Titel.'
)

pruefen(
  'Ohne Zeitzone und ohne Versatz bleibt es bei UTC',
  sitzungsdatum(montagAEDT, undefined, undefined) === '2025-10-05',
  'Das alte Verhalten – dokumentiert, damit klar ist, was der Rückfall kostet.'
)

/* ---------------------------------------- Die ganze Antwort, wie sie kommt */

console.log('')

/*
  Eine echte Antwort im Kleinen: zwei Sitzungen in Sydney zur Sommerzeit,
  dazu eine Dividende. Geprüft wird, dass die Zeitzone aus `meta` tatsächlich
  ankommt – die Funktion oben allein sagt darüber nichts.
*/
const antwort = JSON.stringify({
  chart: {
    result: [
      {
        meta: {
          exchangeTimezoneName: 'Australia/Sydney',
          gmtoffset: 39600,
          regularMarketPrice: 44.1,
          regularMarketTime: utc(2025, 10, 6, 6, 0),
        },
        timestamp: [utc(2025, 10, 5, 23, 0), utc(2025, 10, 6, 23, 0)],
        indicators: { quote: [{ close: [41.96, 41.89] }] },
        events: {
          dividends: { x: { amount: 0.5, date: utc(2025, 10, 5, 23, 0) } },
        },
      },
    ],
  },
})

const reihe = parseYahooChart(antwort)

pruefen(
  'Die Zeitzone aus meta kommt bei den Tagen an',
  reihe?.days.map((tag) => tag.date).join() === '2025-10-06,2025-10-07',
  `${reihe?.days.map((tag) => tag.date).join()} – erwartet 2025-10-06,2025-10-07.`
)

pruefen(
  'Und bei den Dividenden',
  reihe?.dividends[0]?.date === '2025-10-06',
  `${reihe?.dividends[0]?.date} – der Ex-Tag ist ein Tag an dieser Börse.`
)

pruefen(
  'Die Kurse bleiben, wie sie sind',
  reihe?.days.map((tag) => tag.close).join() === '41.96,41.89',
  'Verschoben wird das Datum, nicht der Kurs.'
)

/*
  Und die Gegenprobe: Fehlt `meta` ganz, darf die Reihe trotzdem entstehen.
  Ein Titel ohne Zeitzonenangabe ist ein alter Tag zu viel, aber keine
  fehlende Kursreihe.
*/
const ohneMeta = parseYahooChart(
  JSON.stringify({
    chart: {
      result: [
        {
          timestamp: [utc(2026, 6, 15, 7, 0)],
          indicators: { quote: [{ close: [100] }] },
        },
      ],
    },
  })
)
pruefen(
  'Ohne meta entsteht die Reihe trotzdem',
  ohneMeta?.days.length === 1 && ohneMeta.days[0].date === '2026-06-15',
  `${JSON.stringify(ohneMeta?.days)}`
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
