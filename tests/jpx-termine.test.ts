/**
 * Die Terminliste der Tokioter Börse – und die vier Arten, sie falsch zu lesen.
 *
 * ## Was hier schiefgehen kann
 *
 * 1. **Ein Börsencode wird für ein Datum gehalten.** Beide stehen als blanke
 *    Zahl in der Tabelle. Toyotas Code 7203 ergibt als Seriendatum den
 *    24. September 1919 – und ein Datum aus dem Jahr 1919 sieht in einer
 *    Datenbank aus wie ein Datum.
 * 2. **Der Firmenname steht zweimal.** `会社名` japanisch, `Issue Name`
 *    lateinisch, und das japanische Feld kommt zuerst. Wer die erste passende
 *    Spalte nimmt, schreibt „トヨタ自動車" auf eine deutschsprachige Seite.
 * 3. **Die Adresse der Datei ändert sich.** Der Name trägt ein Datum
 *    (`kessan06_0807.xlsx`), und es sind zwei Dateien nebeneinander. Fest
 *    verdrahtet liefert diese Anbindung irgendwann still nichts mehr.
 * 4. **Ein Umbau der Datei sieht aus wie ein ruhiger Tag.** Ohne Fehler wäre
 *    eine leere Liste nicht von „heute meldet niemand" zu unterscheiden.
 */

import {
  JPX_TERMINSEITE,
  JpxOhneTabelle,
  parseTabelle,
  tabellenAdressen,
} from '@/lib/providers/jpx-termine'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/* ------------------------------------------------- Die Verweise der Seite */

/*
  Nachgebaut nach der echten Seite, abgerufen am 20. August 2026: zwei
  XLSX-Verweise, relativ notiert, dazwischen der übliche Rest einer
  Börsenseite. Die englische Fassung derselben Seite trug null Verweise –
  deshalb liest diese Anbindung die japanische.
*/
const SEITE = `
<div class="component-file">
  <a href="/listing/event-schedules/financial-announcement/tvdivq0000001ofb-att/kessan06_0807.xlsx"><img src="/common/icon_xls.gif" alt="XLS"></a>
  <a href="/listing/event-schedules/financial-announcement/tvdivq0000001ofb-att/kessan07_0807.xlsx"><img src="/common/icon_xls.gif" alt="XLS"></a>
  <a href="/listing/others/index.html">その他</a>
  <a href="/listing/event-schedules/financial-announcement/tvdivq0000001ofb-att/kessan06_0807.xlsx">noch einmal dieselbe</a>
</div>`

const adressen = tabellenAdressen(SEITE)

pruefen(
  'Beide Tabellen werden gefunden, jede einmal',
  adressen.length === 2,
  adressen.join(', ')
)

pruefen(
  'Die Adressen sind absolut',
  adressen[0] ===
    'https://www.jpx.co.jp/listing/event-schedules/financial-announcement/tvdivq0000001ofb-att/kessan06_0807.xlsx',
  adressen[0]
)

pruefen('Die HTML-Seite selbst ist keine Tabelle', !adressen.includes(JPX_TERMINSEITE))

pruefen(
  'Eine Seite ohne Tabellen ergibt nichts',
  tabellenAdressen('<a href="/english/index.html">English</a>').length === 0
)

/* ----------------------------------------------------------- Die Tabelle */

/*
  Echte Zeilen, gelesen am 20. August 2026 aus `kessan06_0807.xlsx`. Die
  Kopfzeile, die Spaltenfolge und die Schreibweise stammen aus der Datei
  selbst; erfunden ist nur die Toyota-Zeile, und zwar mit Toyotas echtem Code
  und echtem Geschäftsjahresende.
*/
const KOPF = [
  '決算発表予定日',
  'コード',
  '会社名',
  'Issue Name',
  '決算期末',
  '業種名',
  'Industry',
  '種別',
  'Fiscal Year/Quarter',
  '市場区分',
  'Market Segment',
]

const ZEILEN = [
  ['Scheduled Dates for Earnings Announcements'],
  [],
  KOPF,
  [
    '46206',
    '2753',
    'あみやき亭',
    'AMIYAKI TEI CO.,LTD.',
    '46477',
    '小売業',
    'Retail Trade',
    '第１四半期',
    'First quarter',
    'プライム',
    'Prime',
  ],
  [
    '46216',
    '7203',
    'トヨタ自動車',
    'TOYOTA MOTOR CORPORATION',
    '46477',
    '輸送用機器',
    'Transportation Equipment',
    '第１四半期',
    'First quarter',
    'プライム',
    'Prime',
  ],
  // Eine Zeile ohne Termin – die Börse führt sie, wir übernehmen sie nicht.
  [
    '',
    '6758',
    'ソニーグループ',
    'SONY GROUP CORPORATION',
    '46477',
    '',
    '',
    '',
    '',
    '',
    '',
  ],
  // Und die übliche Fußzeile.
  ['※ 予定は変更されることがあります。'],
]

const termine = parseTabelle(ZEILEN)

pruefen(
  'Zwei Termine, die Zeile ohne Tag fällt heraus',
  termine.length === 2,
  `${termine.length}`
)

const toyota = termine.find((t) => t.code === '7203')

pruefen('Toyota steht drin', toyota !== undefined)

pruefen(
  'Das Seriendatum wird zum Meldetag',
  toyota?.termin === '2026-07-13',
  `${toyota?.termin}`
)

pruefen(
  'Der lateinische Name gewinnt gegen den japanischen',
  toyota?.name === 'TOYOTA MOTOR CORPORATION',
  `${toyota?.name}`
)

pruefen(
  'Das Geschäftsjahresende wird mitgelesen',
  toyota?.periodenende === '2027-03-31',
  `${toyota?.periodenende}`
)

pruefen(
  'Der Börsencode bleibt ein Code und wird kein Datum',
  toyota?.code === '7203' && !/^\d{4}-/.test(toyota?.code ?? ''),
  `${toyota?.code}`
)

/*
  Die Gegenprobe zur Datumsschranke.

  Ohne sie würde jede Zahl zu einem Datum – und die Tabelle ist voll von
  Zahlen, die keine sind. Geprüft wird an der Stelle, an der es wehtäte: eine
  Terminspalte, in der versehentlich der Code steht.
*/
const VERTAUSCHT = [KOPF, ['7203', '7203', '', 'TOYOTA', '', '', '', '', '', '', '']]
pruefen(
  'Eine Zahl aus dem Codebereich wird nicht zum Meldetag',
  parseTabelle(VERTAUSCHT).length === 0,
  JSON.stringify(parseTabelle(VERTAUSCHT))
)

/* Textdaten kommen in älteren Fassungen der Datei vor. */
const ALSTEXT = [
  KOPF,
  ['2026/7/13', '7203', '', 'TOYOTA', '2027/3/31', '', '', '', '', '', ''],
]
pruefen(
  'Ein Textdatum wird auch gelesen',
  parseTabelle(ALSTEXT)[0]?.termin === '2026-07-13',
  `${parseTabelle(ALSTEXT)[0]?.termin}`
)

/*
  Und der Fall, um den es am Ende geht: Die Börse baut die Datei um.

  Das ist kein Tag ohne Termine, das ist ein Ausfall. Eine leere Liste wäre
  von einem ruhigen Tag nicht zu unterscheiden, und der nächtliche Lauf bliebe
  grün – eine Absicherung, die nie anschlägt, sieht aus wie Ruhe.
*/
let geworfen = false
try {
  parseTabelle([['Datum', 'Ticker', 'Name']])
} catch (fehler) {
  geworfen = fehler instanceof JpxOhneTabelle
}
pruefen('Eine umgebaute Datei wird beanstandet statt stillschweigend geleert', geworfen)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
