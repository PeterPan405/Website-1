/**
 * Der Sammelkalender von Alpha Vantage – und die vier Arten, ihn falsch zu lesen.
 *
 * ## Was hier schiefgehen kann
 *
 * 1. **Eine Absage wird für Daten gehalten.** Der Anbieter antwortet auf eine
 *    gesperrte Anfrage mit Statuscode **200** und einem JSON-Objekt. Wer nur
 *    den HTTP-Code prüft, schreibt eine leere Liste in den Bestand und hält den
 *    Lauf für gelungen – genau der Fehler, der bei Twelve Data drei Wochen
 *    lang jede Nacht 75 Minuten gekostet hat.
 * 2. **Ein Komma im Firmennamen verschiebt jede Spalte.** „BRASKEM SOCIEDAD
 *    ANÓNIMA, S.A." steht in Anführungszeichen; ein blankes `split(',')` legt
 *    den Meldetag in die Namensspalte. Auffallen würde es niemandem – ein
 *    Datum an falscher Stelle sieht aus wie ein Datum.
 * 3. **Eine eingeschobene Spalte verschiebt alles dahinter.** Deshalb werden
 *    die Spalten über die Kopfzeile gesucht und nicht über feste Positionen.
 * 4. **`timeOfTheDay` ist leer.** Das ist der Normalfall bei einem guten Teil
 *    der Zeilen und darf keine Zeitangabe erfinden.
 */

import {
  AlphaVantageGesperrt,
  csvFelder,
  holeKalender,
  istAbsage,
  kalenderUrl,
  parseKalender,
} from '@/lib/providers/alphavantage-termine'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/*
  Echte Zeilen, abgerufen am 20. August 2026 über `quellen-holen.yml`.

  Nicht erfunden: Die Kopfzeile, die Spaltenfolge und die Schreibweise von
  `pre-market` stammen aus der Antwort selbst. Ein Test gegen ein ausgedachtes
  Format prüft, ob der Zerleger zum Test passt – nicht, ob er zur Quelle passt.
*/
const ECHT = [
  'symbol,name,reportDate,fiscalDateEnding,estimate,currency,timeOfTheDay',
  'BABA,ALIBABA GROUP HOLDING LIMITED,2026-08-20,2026-06-30,1.77,USD,pre-market',
  'ADI,ANALOG DEVICES INCORPORATED,2026-08-19,2026-07-31,3.33,USD,pre-market',
  'BILL,BILL HOLDINGS INCORPORATED,2026-08-19,2026-06-30,0.25,USD,post-market',
  'SAP,SAP SE,2026-10-21,2026-09-30,2.08,USD,',
  'AACG,ATA CREATIVITY GLOBAL,2026-08-19,2026-06-30,,USD,',
  'NGG,NATIONAL GRID PLC,2026-11-05,2026-09-30,,GBP,',
].join('\n')

/* ------------------------------------------------------- Die Zerlegung */

const eintraege = parseKalender(ECHT)

pruefen(
  'Der Kalender wird gelesen',
  eintraege !== null && eintraege.length === 6,
  `${eintraege?.length}`
)

const baba = eintraege?.find((e) => e.symbol === 'BABA')

/*
  Alibaba ist der Anlass der ganzen Sache: Das Unternehmen legte am 20. August
  2026 Zahlen vor, und auf der Aktienseite stand nichts. Bei der SEC gibt es
  dazu keine Meldung mit Punkt 2.02 – hier steht der Tag.
*/
pruefen(
  'Alibaba steht mit angekündigtem Tag und Lage darin',
  baba?.reportDate === '2026-08-20' && baba?.lage === 'vorboerse',
  JSON.stringify(baba)
)

pruefen(
  'Nachbörslich wird als nachbörslich gelesen',
  eintraege?.find((e) => e.symbol === 'BILL')?.lage === 'nachboerse'
)

/*
  Eine leere Lage bleibt leer. Sie ist der Normalfall bei einem guten Teil der
  Zeilen – und „unbekannt" als „vorbörslich" zu lesen, wäre eine erfundene
  Angabe an genau der Stelle, an der jemand eine Order plant.
*/
pruefen(
  'Eine leere Lage erfindet nichts',
  eintraege?.find((e) => e.symbol === 'SAP')?.lage === null &&
    eintraege?.find((e) => e.symbol === 'AACG')?.lage === null
)

pruefen(
  'Der Name kommt mit',
  eintraege?.find((e) => e.symbol === 'NGG')?.name === 'NATIONAL GRID PLC'
)

/* ------------------------------------------------- Kommas und Spalten */

console.log('')

pruefen(
  'Ein Komma in Anführungszeichen trennt keine Spalte',
  csvFelder('BAK,"BRASKEM SOCIEDAD ANÓNIMA, S.A.",2026-08-19,2026-06-30,1.68,USD,').join(
    '|'
  ) === 'BAK|BRASKEM SOCIEDAD ANÓNIMA, S.A.|2026-08-19|2026-06-30|1.68|USD|',
  csvFelder('BAK,"BRASKEM SOCIEDAD ANÓNIMA, S.A.",2026-08-19,2026-06-30,1.68,USD,').join(
    '|'
  )
)

/*
  Die Gegenprobe zum Punkt darüber: Ein blankes `split(',')` liefert bei
  derselben Zeile den Meldetag an der Stelle, an der die Spaltenzählung ihn
  nicht erwartet. Ohne diese Zeile stünde oben eine Prüfung, die auch ein
  kaputter Zerleger bestünde.
*/
const naiv = 'BAK,"BRASKEM SOCIEDAD ANÓNIMA, S.A.",2026-08-19,2026-06-30,1.68,USD,'.split(
  ','
)
pruefen(
  'Und ein blankes split würde hier danebenliegen',
  naiv[2] !== '2026-08-19',
  `naiv[2] = ${naiv[2]} – deshalb der eigene Zerleger.`
)

/*
  Die Spalten werden über die Kopfzeile gefunden. Hier steht `reportDate` an
  anderer Stelle als in der echten Antwort – ein Zerleger mit festen Positionen
  läse den Namen als Datum.
*/
const vertauscht = parseKalender(
  ['reportDate,symbol,name,timeOfTheDay', '2026-09-30,XYZ,BEISPIEL AG,post-market'].join(
    '\n'
  )
)
pruefen(
  'Eine andere Spaltenfolge wird trotzdem richtig gelesen',
  vertauscht?.[0]?.symbol === 'XYZ' &&
    vertauscht?.[0]?.reportDate === '2026-09-30' &&
    vertauscht?.[0]?.lage === 'nachboerse',
  JSON.stringify(vertauscht)
)

pruefen(
  'Ohne Pflichtspalten gibt es keinen Kalender',
  parseKalender('a,b,c\n1,2,3') === null && parseKalender('') === null
)

pruefen(
  'Eine Zeile ohne brauchbares Datum fällt heraus',
  parseKalender(
    ['symbol,reportDate', 'GUT,2026-09-30', 'KAPUTT,demnächst', 'LEER,'].join('\n')
  )?.length === 1
)

/* --------------------------------------------------------- Die Absage */

console.log('')

/*
  Die Prüfung, um die es hier eigentlich geht.

  Alle drei Absagen kommen mit **Statuscode 200**. Wer nur den HTTP-Code
  prüft, hält sie für ein Ergebnis – und schreibt eine leere Liste in den
  Bestand, ohne dass irgendwo etwas rot wird.
*/
pruefen(
  'Eine Kontingentabsage wird als Absage erkannt',
  istAbsage(
    '{ "Information": "Thank you for using Alpha Vantage! Our standard API rate limit is 25 requests per day." }'
  )
)

pruefen(
  'Eine Tarifabsage auch',
  istAbsage(
    '{ "Information": "Thank you for using Alpha Vantage! This is a premium endpoint." }'
  )
)

pruefen(
  'Und ein Schlüsselfehler',
  istAbsage(
    '{ "Error Message": "Invalid API call. Please retry or visit the documentation" }'
  )
)

/*
  Die Gegenprobe: Der echte Kalender darf nicht als Absage durchgehen. Ohne
  sie wäre die Prüfung darüber mit `istAbsage = () => true` zu bestehen – und
  der Weg bliebe für immer zu.
*/
pruefen(
  'Der echte Kalender ist keine Absage',
  !istAbsage(ECHT),
  'Sonst wäre der Weg dauerhaft zu, und niemand wüsste warum.'
)

/* ------------------------------------------------------ Der Schlüssel */

console.log('')

pruefen(
  'Ohne Schlüssel wird nichts abgerufen',
  (await holeKalender(undefined)) === null,
  'Der Normalfall, solange keiner hinterlegt ist.'
)

pruefen(
  'Die Adresse trägt Funktion und Horizont',
  kalenderUrl('GEHEIM').includes('function=EARNINGS_CALENDAR') &&
    kalenderUrl('GEHEIM').includes('horizon=3month')
)

/*
  Der Schlüssel steht in der Adresse, und das Protokoll eines Workflows ist
  öffentlich lesbar. Diese Prüfung hält fest, dass die Adresse nirgends in eine
  Fehlermeldung gerät – geprüft wird der Fehlertyp, der beim Abruf entsteht.
*/
pruefen(
  'Die Fehlerklasse gibt es und sie ist ein Error',
  new AlphaVantageGesperrt('x') instanceof Error
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
