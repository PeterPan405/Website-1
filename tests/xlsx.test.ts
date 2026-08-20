/**
 * Der XLSX-Leser – geprüft gegen eine Datei, die ein fremdes Werkzeug geschrieben hat.
 *
 * ## Warum die Datei hier als Base64 steht
 *
 * Ein Leser, der gegen seinen eigenen Schreiber geprüft wird, prüft nur, ob
 * beide denselben Irrtum teilen. Die Datei unten hat Pythons `zipfile`
 * geschrieben – eine andere Umsetzung desselben Formats, aus einer anderen
 * Sprache. Wenn dieser Leser sie richtig liest, liest er ZIP und nicht sich
 * selbst.
 *
 * Nachgebaut ist der Aufbau der echten JPX-Terminliste `kessan06_0807.xlsx`,
 * einschließlich der vier Stellen, an denen ein naiver Leser danebengreift:
 *
 * 1. **Der Text steht nicht in der Zelle.** `t="s"` und eine Nummer – der Text
 *    liegt in `sharedStrings.xml`. Wer das übersieht, bekommt Indizes, die wie
 *    Daten aussehen.
 * 2. **Ein Eintrag kann zerfallen.** „AMIYAKI TEI CO.,LTD." steht als zwei
 *    `<t>` in einem `<si>`, weil ein Teil anders formatiert ist. Wer nur das
 *    erste nimmt, kürzt Firmennamen stillschweigend.
 * 3. **Eine fehlende Zelle verschiebt die Spalten.** Zeile 4 hat kein B und
 *    kein C. Ohne Auffüllen rutscht der Text in die Codespalte.
 * 4. **Nicht alles im ZIP ist komprimiert.** `sharedStrings.xml` liegt hier
 *    absichtlich mit Verfahren 0 vor.
 */

import { ausExcelDatum, blattZeilen, dateienImZip, ZipUnlesbar } from '@/lib/xlsx'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/** Von Pythons `zipfile` geschrieben, nicht von diesem Projekt. */
const XLSX_BASE64 = [
  'UEsDBBQAAAAIAA1fFF3uR1hmHwAAAB0AAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbLOxr8jNUShLLSrOzM+zVTLU',
  'M1Cyt7MJqSxILda3AwBQSwMEFAAAAAgADV8UXWU7KJsiAAAAIAAAAA8AAAB4bC93b3JrYm9vay54bWyzsa/IzVEo',
  'Sy0qzszPs1Uy1DNQsrezKc8vyk7Kz8/WtwMAUEsDBBQAAAAAAAAAIQDvBEw6xAEAAMQBAAAUAAAAeGwvc2hhcmVk',
  'U3RyaW5ncy54bWw8P3htbCB2ZXJzaW9uPSIxLjAiIGVuY29kaW5nPSJVVEYtOCIgc3RhbmRhbG9uZT0ieWVzIj8+',
  'Cjxzc3QgeG1sbnM9Imh0dHA6Ly9zY2hlbWFzLm9wZW54bWxmb3JtYXRzLm9yZy9zcHJlYWRzaGVldG1sLzIwMDYv',
  'bWFpbiIgY291bnQ9IjgiIHVuaXF1ZUNvdW50PSI4Ij4KPHNpPjx0Puaxuueul+eZuuihqOS6iOWumuaXpTwvdD48',
  'L3NpPgo8c2k+PHQ+44Kz44O844OJPC90Pjwvc2k+CjxzaT48dD7kvJrnpL7lkI08L3Q+PC9zaT4KPHNpPjx0Pklz',
  'c3VlIE5hbWU8L3Q+PC9zaT4KPHNpPjx0PuOBguOBv+OChOOBjeS6rTwvdD48L3NpPgo8c2k+PHI+PHQ+QU1JWUFL',
  'SSBURUkgQ08uPC90Pjwvcj48cj48dD4sTFRELjwvdD48L3I+PC9zaT4KPHNpPjx0PlRPWU9UQSBNT1RPUiBDT1JQ',
  'T1JBVElPTiAmYW1wOyBDTzwvdD48L3NpPgo8c2k+PHQ+44OI44Oo44K/6Ieq5YuV6LuKPC90Pjwvc2k+Cjwvc3N0',
  'PlBLAwQUAAAACAANXxRdwfydVx4BAACbAgAAGAAAAHhsL3dvcmtzaGVldHMvc2hlZXQxLnhtbHWS307DIBSH730K',
  'wr2DQv8YQ1ncqvFqXugegLS4NrbQAOn07WXVdJRkd5zzwfl9Adj2e+jBJI3ttCphssEQSFXrplOnEh4/Xu4fILBO',
  'qEb0WskS/kgLt/yOnbX5sq2UDvgBypawdW58RMjWrRyE3ehRKk8+tRmE86U5ITsaKZr50NAjgnGOBtEpyNncq4QT',
  'frDRZ2C8iW/Xl8VTAoErofX1xDFDE2eo/me7kCVrtg8ZWbMqZHRhyGdfDchiQPwVlDCbd6c5wXlkQf4yioxGCiSI',
  'SSOFkGU3FOiiQNcKSaxAZ1IQHCvQIKaIFEKW31BIF4U0UoinpfO0TvWdku/O+H2d5czxt9fDM9iB46ECe4acP3Lp',
  'B0no+vwMLf+K/wJQSwECFAMUAAAACAANXxRd7kdYZh8AAAAdAAAAEwAAAAAAAAAAAAAAgAEAAAAAW0NvbnRlbnRf',
  'VHlwZXNdLnhtbFBLAQIUAxQAAAAIAA1fFF1lOyibIgAAACAAAAAPAAAAAAAAAAAAAACAAVAAAAB4bC93b3JrYm9v',
  'ay54bWxQSwECFAMUAAAAAAAAACEA7wRMOsQBAADEAQAAFAAAAAAAAAAAAAAAgAGfAAAAeGwvc2hhcmVkU3RyaW5n',
  'cy54bWxQSwECFAMUAAAACAANXxRdwfydVx4BAACbAgAAGAAAAAAAAAAAAAAAgAGVAgAAeGwvd29ya3NoZWV0cy9z',
  'aGVldDEueG1sUEsFBgAAAAAEAAQABgEAAOkDAAAAAA==',
].join('')

const datei = Buffer.from(XLSX_BASE64, 'base64')

/* ------------------------------------------------------------ Das ZIP */

const dateien = dateienImZip(datei)

pruefen(
  'Alle vier Dateien werden gefunden',
  dateien.size === 4 &&
    dateien.has('xl/sharedStrings.xml') &&
    dateien.has('xl/worksheets/sheet1.xml'),
  [...dateien.keys()].join(', ')
)

pruefen(
  'Die unkomprimierte Datei wird gelesen',
  (dateien.get('xl/sharedStrings.xml')?.toString('utf8') ?? '').includes('AMIYAKI')
)

pruefen(
  'Die komprimierte Datei wird entpackt',
  (dateien.get('xl/worksheets/sheet1.xml')?.toString('utf8') ?? '').includes(
    '<sheetData>'
  )
)

/*
  Die Gegenprobe: Eine Absicherung, die nie anschlägt, sieht aus wie Ruhe.
  Ein Puffer ohne ZIP-Abschluss muss beanstandet werden – und zwar mit einer
  eigenen Fehlerklasse, damit der Aufrufer „keine Tabelle" von „Netz kaputt"
  unterscheiden kann.
*/
let geworfen = false
try {
  dateienImZip(Buffer.from('<html>Wartungsarbeiten</html>', 'utf8'))
} catch (fehler) {
  geworfen = fehler instanceof ZipUnlesbar
}
pruefen('Eine HTML-Seite statt einer Tabelle wird beanstandet', geworfen)

/* --------------------------------------------------------- Die Zeilen */

const zeilen = blattZeilen(datei)

pruefen('Vier Zeilen', zeilen.length === 4, `${zeilen.length}`)

pruefen(
  'Die Kopfzeile kommt aus der Zeichenkettentabelle',
  zeilen[0]?.[0] === '決算発表予定日' && zeilen[0]?.[1] === 'コード',
  JSON.stringify(zeilen[0])
)

pruefen(
  'Der zerfallene Firmenname wird zusammengesetzt',
  zeilen[1]?.[3] === 'AMIYAKI TEI CO.,LTD.',
  JSON.stringify(zeilen[1]?.[3])
)

pruefen(
  'Das kaufmännische Und wird aufgelöst',
  zeilen[2]?.[3] === 'TOYOTA MOTOR CORPORATION & CO',
  JSON.stringify(zeilen[2]?.[3])
)

pruefen(
  'Zahlen bleiben Zahlen',
  zeilen[1]?.[0] === '46206' && zeilen[1]?.[1] === '2753',
  JSON.stringify(zeilen[1])
)

pruefen(
  'Fehlende Zellen werden aufgefüllt statt zu verschieben',
  zeilen[3]?.length === 4 &&
    zeilen[3][0] === '46217' &&
    zeilen[3][1] === '' &&
    zeilen[3][2] === '' &&
    zeilen[3][3] === 'OHNE B UND C',
  JSON.stringify(zeilen[3])
)

/* ---------------------------------------------------- Das Seriendatum */

/*
  Die Zahl 46206 stammt aus der echten JPX-Datei und steht dort für den
  3. Juli 2026. Wer vom 31. Dezember 1899 aus rechnet, bekommt den 4. Juli –
  und wer am Vortag eines Meldetermins kauft, kauft in die Zahlen hinein.
*/
pruefen(
  '46206 ist der 3. Juli 2026',
  ausExcelDatum(46206) === '2026-07-03',
  `${ausExcelDatum(46206)}`
)
pruefen(
  '46477 ist der 31. März 2027',
  ausExcelDatum(46477) === '2027-03-31',
  `${ausExcelDatum(46477)}`
)

/* Gegenprobe: die Werte, die kein Datum sind, dürfen keins werden. */
pruefen('Leer ergibt kein Datum', ausExcelDatum(Number.NaN) === null)
pruefen('Null ergibt kein Datum', ausExcelDatum(0) === null)
pruefen(
  'Der Bereich um den erfundenen 29. Februar 1900 wird abgelehnt',
  ausExcelDatum(60) === null && ausExcelDatum(1) === null
)
pruefen(
  'Ab dem 1. März 1900 wird gerechnet',
  ausExcelDatum(61) === '1900-03-01',
  `${ausExcelDatum(61)}`
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
