/**
 * Prüfungen für die Alterungsgrenze der Datenreihen.
 *
 * Ausführen mit `npm test`.
 *
 * Der aufschlussreichste Fall steht ganz unten: die echte Momentaufnahme vom
 * 31. Juli 2026, wie sie vor der Umstellung auf `HICP` aussah. `abgerufenAm`
 * war wenige Minuten alt, die Inflationsreihe sieben Monate. Genau diese
 * Kombination soll auffallen – sie ist der Grund, warum es das Modul gibt.
 */

import {
  alterInTagen,
  juengsterEintrag,
  letzterPunkt,
  pfad,
  pruefeReihenalter,
  REIHENGRENZEN,
  type Reihengrenze,
} from '../lib/reihen-alter.ts'

let failed = 0
function check(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  const ok = a === e
  if (!ok) failed++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : `\n     erwartet ${e}\n     erhalten ${a}`}`
  )
}

const JETZT = new Date('2026-07-31T08:00:00Z')

// ---------------------------------------------------------------- Datumsalter

check('Tagesdatum von gestern ist einen Tag alt', alterInTagen('2026-07-30', JETZT), 1)
check('Tagesdatum von heute ist null Tage alt', alterInTagen('2026-07-31', JETZT), 0)

/*
  Monatsangaben zählen ab dem Monatsende. Der Juniwert ist am 31. Juli genau
  einen Monat alt und nicht zwei – ab dem Monatsersten gerechnet bräuchte jede
  Monatsreihe eine um dreißig Tage weitere Grenze, und die Grenze verlöre ihre
  Aussage.
*/
check('Monatsangabe zählt ab Monatsende', alterInTagen('2026-06', JETZT), 30)
check('Monat des Vorjahres', alterInTagen('2025-12', JETZT), 211)
check('Jahresangabe zählt ab Jahresende', alterInTagen('2025', JETZT), 211)
check('Zeitstempel mit Uhrzeit', alterInTagen('2026-07-29T20:03:38.000Z', JETZT), 1)
check('Unlesbares gibt null', alterInTagen('neulich', JETZT), null)

// ------------------------------------------------------------------- Zugriffe

const bestandZinsen = {
  abgerufenAm: '2026-07-31T07:22:35.708Z',
  reihen: {
    leitzins: { aktuell: { t: '2026-07-31', wert: 2.4 } },
    inflation: { aktuell: { t: '2026-06', wert: 2.8 } },
  },
}

check(
  'pfad findet den Wert',
  pfad(bestandZinsen, 'reihen', 'leitzins', 'aktuell', 't'),
  '2026-07-31'
)
check(
  'pfad übersteht ein fehlendes Glied',
  pfad(bestandZinsen, 'reihen', 'gibtsnicht', 'aktuell', 't'),
  null
)
check(
  'pfad gibt null bei Zahl am Ende',
  pfad(bestandZinsen, 'reihen', 'leitzins', 'aktuell', 'wert'),
  null
)

const bestandKurse = {
  latest: {
    apple: { at: '2026-07-30T20:04:06.000Z' },
    sap: { at: '2026-07-31T03:59:58.000Z' },
    hängt: { at: '2024-01-02T10:00:00.000Z' },
  },
}
check(
  'juengsterEintrag nimmt den neuesten',
  juengsterEintrag(bestandKurse, 'latest', 'at'),
  '2026-07-31T03:59:58.000Z'
)
check('juengsterEintrag ohne Behälter', juengsterEintrag({}, 'latest', 'at'), null)

check(
  'letzterPunkt nimmt das Ende der Liste',
  letzterPunkt({ reihe: [{ d: '2026-07-30' }, { d: '2026-07-31' }] }, 'reihe', 'd'),
  '2026-07-31'
)
check('letzterPunkt bei leerer Liste', letzterPunkt({ reihe: [] }, 'reihe', 'd'), null)

// -------------------------------------------------------------------- Prüfung

const nurLeitzins: Reihengrenze[] = [
  {
    datei: 'test.json',
    reihe: 'Leitzins',
    takt: 'werktäglich',
    hoechstalterTage: 10,
    begruendung: 'Prüfung',
    neuester: (b) => pfad(b, 'aktuell'),
  },
]

check(
  'frischer Wert erzeugt keinen Befund',
  pruefeReihenalter(
    new Map([['test.json', { aktuell: '2026-07-28' }]]),
    JETZT,
    nurLeitzins
  ).length,
  0
)
check(
  'genau auf der Grenze ist noch in Ordnung',
  pruefeReihenalter(
    new Map([['test.json', { aktuell: '2026-07-21' }]]),
    JETZT,
    nurLeitzins
  ).length,
  0
)
check(
  'einen Tag über der Grenze schlägt an',
  pruefeReihenalter(
    new Map([['test.json', { aktuell: '2026-07-20' }]]),
    JETZT,
    nurLeitzins
  ).length,
  1
)

/*
  Eine fehlende Datei ist kein Befund: Der leere Ausgangszustand ist in diesem
  Projekt ein gültiger Zustand. Eine fehlende **Reihe** in einer vorhandenen
  Datei schon – dann hat die Quelle ihr Format geändert, und genau davor soll
  die Prüfung warnen.
*/
check(
  'fehlende Datei wird übergangen',
  pruefeReihenalter(new Map(), JETZT, nurLeitzins).length,
  0
)
check(
  'fehlende Reihe in vorhandener Datei ist ein Befund',
  pruefeReihenalter(new Map([['test.json', { etwasAnderes: 1 }]]), JETZT, nurLeitzins)
    .length,
  1
)

// ------------------------------------------------- Der Fall, um den es ging

/*
  Die Momentaufnahme vom 31. Juli 2026, wie sie vor der Umstellung aussah.
  Abgerufen um 07:16 desselben Tages – tadellos. Die Inflationsreihe endete im
  Dezember 2025, weil der Datensatz ICP zum 4. Februar 2026 eingestellt worden
  war und trotzdem weiter mit Statuscode 200 antwortete.
*/
const wieEsWar = new Map<string, unknown>([
  [
    'zinsen.json',
    {
      abgerufenAm: '2026-07-31T07:16:00.071Z',
      reihen: {
        leitzins: { aktuell: { t: '2026-07-31', wert: 2.4 } },
        inflation: { aktuell: { t: '2025-12', wert: 1.9 } },
        'inflation-de': { aktuell: { t: '2025-12', wert: 2 } },
      },
    },
  ],
])
const befundeAlt = pruefeReihenalter(wieEsWar, JETZT)
check('der eingestellte ICP-Datensatz fällt auf', befundeAlt.length, 2)
check(
  'der Leitzins daneben bleibt unbeanstandet',
  befundeAlt.some((b) => b.reihe.includes('Leitzins')),
  false
)
check('das gemeldete Alter stimmt', befundeAlt[0]?.alterTage, 211)

/* Und dieselbe Datei nach der Umstellung: kein Befund mehr. */
const wieEsIst = new Map<string, unknown>([
  [
    'zinsen.json',
    {
      abgerufenAm: '2026-07-31T07:22:35.708Z',
      reihen: {
        leitzins: { aktuell: { t: '2026-07-31', wert: 2.4 } },
        inflation: { aktuell: { t: '2026-06', wert: 2.8 } },
        'inflation-de': { aktuell: { t: '2026-06', wert: 2.4 } },
      },
    },
  ],
])
check(
  'nach der Umstellung ist alles frisch',
  pruefeReihenalter(wieEsIst, JETZT).length,
  0
)

// Jede Grenze braucht eine Begründung – sonst ist die Zahl geraten.
check(
  'jede Grenze ist begründet',
  REIHENGRENZEN.every((g) => g.begruendung.length > 40 && g.hoechstalterTage > 0),
  true
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfungen fehlgeschlagen.`
)
if (failed > 0) process.exit(1)
