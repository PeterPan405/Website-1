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
  Spaltenfolge und die Schreibweise stammen aus der Datei selbst; erfunden ist
  nur die Toyota-Zeile, und zwar mit Toyotas echtem Code und echtem
  Geschäftsjahresende.

  Der Kopf ist hier auf **zwei Zeilen** verteilt – japanisch oben, englisch
  darunter. In der echten Datei steht beides in **einer** Zeile, mit einem
  Zeilenumbruch **innerhalb** der Zelle: `決算発表予定日\r\nScheduled Dates …`.
  Nachgemessen am selben Tag.

  Geprüft wird trotzdem die aufgeteilte Form, und zwar mit Absicht: Sie ist der
  härtere Fall. Wer sie besteht, besteht die zusammengefasste auch – und die
  Börse kann jederzeit von der einen zur anderen wechseln, ohne dass es jemand
  ankündigt.
*/
const KOPF_JA = ['決算発表予定日', 'コード', '会社名', '', '決算期末']
const KOPF_EN = ['Scheduled Dates for Earnings Announcements', '', '', 'Issue Name', '']

const ZEILEN = [
  ['東京証券取引所'],
  ['As of 2026/8/6'],
  [],
  KOPF_JA,
  KOPF_EN,
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

const tabelle = parseTabelle(ZEILEN)
const termine = tabelle.termine

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

pruefen(
  'Der Stand steht in der Datei und wird gelesen',
  tabelle.stand === '2026-08-06',
  `${tabelle.stand}`
)

/*
  Der zweizeilige Kopf ist der Punkt, an dem der erste Lauf halb danebengriff:
  Meldetag und Code kamen aus der englischen Zeile, Firmenname und
  Geschäftsjahresende standen in der japanischen und blieben leer. Der Lauf war
  dabei grün und las 3.209 Zeilen.
*/
pruefen(
  'Beide Kopfzeilen zusammen beschriften die Tabelle',
  tabelle.kopf[0]?.includes('決算発表予定日') &&
    tabelle.kopf[0]?.includes('Scheduled Dates') &&
    tabelle.kopf[3] === 'Issue Name',
  JSON.stringify(tabelle.kopf)
)

/*
  Die Gegenprobe zur Datumsschranke.

  Ohne sie würde jede Zahl zu einem Datum – und die Tabelle ist voll von
  Zahlen, die keine sind. Geprüft wird an der Stelle, an der es wehtäte: eine
  Terminspalte, in der versehentlich der Code steht.
*/
const VERTAUSCHT = [
  KOPF_JA,
  KOPF_EN,
  ['46216', '7203', 'トヨタ自動車', 'TOYOTA MOTOR CORPORATION', '46477'],
  // Dieselbe Zeile, aber im Terminfeld steht der Code. Sie muss herausfallen.
  ['6758', '6758', 'ソニーグループ', 'SONY GROUP CORPORATION', '46477'],
]
const vertauscht = parseTabelle(VERTAUSCHT).termine
pruefen(
  'Eine Zahl aus dem Codebereich wird nicht zum Meldetag',
  vertauscht.length === 1 && vertauscht[0].code === '7203',
  JSON.stringify(vertauscht)
)

/*
  Ein Code kann zweimal vorkommen – und beide Zeilen müssen durchkommen.

  Die Börse führt zwei Dateien nebeneinander. Ein Unternehmen kann in beiden
  stehen: mit einem zurückliegenden Tag in der einen und einem kommenden in der
  anderen. Die erste Fassung behielt je Code den früheren und verwarf den Rest –
  also den vergangenen, und der kommende fiel weg. Genau der, um den es geht.
*/
const ZWEIMAL = [
  KOPF_JA,
  KOPF_EN,
  ['46216', '7203', 'トヨタ自動車', 'TOYOTA MOTOR CORPORATION', '46477'],
  ['46308', '7203', 'トヨタ自動車', 'TOYOTA MOTOR CORPORATION', '46568'],
]
const beide = parseTabelle(ZWEIMAL).termine
pruefen(
  'Zwei Zeilen zu einem Code bleiben zwei',
  beide.length === 2 && beide[0].termin < beide[1].termin,
  JSON.stringify(beide.map((t) => t.termin))
)

/* Textdaten kommen in älteren Fassungen der Datei vor. */
const ALSTEXT = [
  KOPF_JA,
  KOPF_EN,
  ['2026/7/13', '7203', '', 'TOYOTA', '2027/3/31', '', '', '', '', '', ''],
]
pruefen(
  'Ein Textdatum wird auch gelesen',
  parseTabelle(ALSTEXT).termine[0]?.termin === '2026-07-13',
  `${parseTabelle(ALSTEXT).termine[0]?.termin}`
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

/*
  Der halbe Kopf – und warum er auch ein Ausfall ist.

  Nur die englische Zeile: Der Meldetag stünde da (`Scheduled Dates` passt),
  die Codespalte nicht (`コード` steht in der japanischen Zeile). Ohne diese
  Prüfung würde ab hier über feste Positionen geraten. Der Lauf muss stattdessen
  sagen, was er im Kopf gefunden hat.
*/
let halberKopf: Error | null = null
try {
  parseTabelle([KOPF_EN, ['46216', '7203', 'トヨタ自動車', 'TOYOTA MOTOR CORPORATION']])
} catch (fehler) {
  halberKopf = fehler as Error
}
pruefen(
  'Ein halber Kopf wird beanstandet und nennt, was erkannt wurde',
  halberKopf instanceof JpxOhneTabelle && halberKopf.message.includes('Scheduled Dates'),
  `${halberKopf?.message}`
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
