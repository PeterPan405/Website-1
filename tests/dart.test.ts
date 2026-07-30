/**
 * Prüfungen für das Auslesen der koreanischen Pflichtmeldungen.
 *
 * Der Abruf selbst lässt sich hier nicht prüfen – er braucht einen Schlüssel,
 * und ein Test, der eine fremde Schnittstelle anfragt, schlägt bei jeder
 * Störung dort fehl. Geprüft wird deshalb genau das, was ohne Netz prüfbar ist
 * und wo die Fehler sitzen: das Lesen der Beträge und das Finden der Posten.
 *
 * Die Beispiele stammen aus der Formatbeschreibung von Open DART: Beträge mit
 * Tausenderpunkten, negative Werte in runden Klammern, koreanische
 * Postennamen.
 */

import {
  findePosten,
  leseBetrag,
  leseVerzeichnis,
  werteAbschluss,
  type DartPosten,
} from '../scripts/dart-abrufen.ts'

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

console.log('\n— Beträge —')

pruefe(
  'liest eine Zahl mit Tausendertrennzeichen',
  leseBetrag('300,870,903,000,000') === 300870903000000
)
/*
  Der teuerste Fall: DART schreibt negative Beträge in runde Klammern. Wer das
  mit `Number()` liest, bekommt `NaN` – und ein `NaN` im Bestand sieht später
  aus wie eine Zahl, die es nicht gibt, statt wie eine, die falsch gelesen
  wurde.
*/
pruefe('liest einen negativen Betrag in Klammern', leseBetrag('(1,234,567)') === -1234567)
pruefe('kommt mit einem Minuszeichen klar', leseBetrag('-1,234') === -1234)
pruefe('liefert bei leerem Feld nichts', leseBetrag('') === null)
pruefe('liefert bei einem Strich nichts', leseBetrag('-') === null)
pruefe('liefert bei fehlendem Feld nichts', leseBetrag(undefined) === null)
pruefe('liefert bei Unsinn nichts', leseBetrag('k. A.') === null)
pruefe('nimmt die Null an', leseBetrag('0') === 0)

console.log('\n— Posten finden —')

const posten: DartPosten[] = [
  {
    account_id: 'ifrs-full_Revenue',
    account_nm: '수익(매출액)',
    sj_div: 'IS',
    thstrm_amount: '300,870,903,000,000',
  },
  {
    account_id: 'ifrs-full_ProfitLoss',
    account_nm: '당기순이익',
    sj_div: 'IS',
    thstrm_amount: '34,451,351,000,000',
  },
  {
    account_id: 'ifrs-full_Equity',
    account_nm: '자본총계',
    sj_div: 'BS',
    thstrm_amount: '402,192,032,000,000',
  },
]

pruefe(
  'findet ueber die Kennung',
  findePosten(posten, ['ifrs-full_Revenue']) === 300870903000000
)
pruefe(
  'nimmt die erste passende Kennung',
  findePosten(posten, ['gibtsnicht', 'ifrs-full_Equity']) === 402192032000000
)

/*
  Manche Gesellschaften vergeben eigene Kennungen. Dann bleibt nur der Name –
  und der steht auf Koreanisch.
*/
const eigenwillig: DartPosten[] = [
  { account_id: '-표준계정코드 미사용-', account_nm: '매출액', thstrm_amount: '1,000' },
]
pruefe(
  'faellt auf den Namen zurueck',
  findePosten(eigenwillig, ['ifrs-full_Revenue'], ['매출액']) === 1000
)
pruefe('ohne Treffer kommt nichts zurueck', findePosten(posten, ['gibtsnicht']) === null)

console.log('\n— Ganzer Abschluss —')

const kennzahlen = werteAbschluss(posten)
pruefe(
  'liest Umsatz, Gewinn und Eigenkapital',
  kennzahlen?.umsatz === 300870903000000 &&
    kennzahlen?.gewinn === 34451351000000 &&
    kennzahlen?.eigenkapital === 402192032000000
)
pruefe('setzt die Waehrung auf Won', kennzahlen?.waehrung === 'KRW')
/*
  Die Aktienzahl steht in einer anderen Meldung. Sie hier zu raten ergaebe
  einen falschen Boersenwert – lieber fehlt sie.
*/
pruefe('setzt keine geratene Aktienzahl', kennzahlen?.aktien === undefined)

/*
  Ohne eine einzige belegte Zahl entsteht kein Eintrag. Ein leerer Datensatz
  saehe im Bestand aus wie „geprueft, nichts gefunden“ – tatsaechlich hiesse er
  „nicht gelesen“.
*/
pruefe('ohne verwertbare Posten kein Eintrag', werteAbschluss([]) === null)
pruefe(
  'auch bei lauter leeren Betraegen kein Eintrag',
  werteAbschluss([{ account_id: 'ifrs-full_Revenue', thstrm_amount: '-' }]) === null
)

console.log('\n— Verzeichnis —')

const xml = `<result>
  <list><corp_code>00126380</corp_code><corp_name>삼성전자</corp_name><stock_code>005930</stock_code></list>
  <list><corp_code>00164779</corp_code><corp_name>SK하이닉스</corp_name><stock_code>000660</stock_code></list>
  <list><corp_code>00999999</corp_code><corp_name>Nicht boersennotiert</corp_name><stock_code> </stock_code></list>
</result>`
const verzeichnis = leseVerzeichnis(xml)
pruefe('ordnet Samsung zu', verzeichnis.get('005930') === '00126380')
pruefe('ordnet SK Hynix zu', verzeichnis.get('000660') === '00164779')
/*
  Nicht boersennotierte Gesellschaften haben ein leeres `stock_code`. Sie
  duerfen nicht in die Zuordnung geraten, sonst haenge irgendwann eine Zahl am
  falschen Kuerzel.
*/
pruefe(
  'laesst Gesellschaften ohne Boersenkuerzel weg',
  verzeichnis.size === 2,
  String(verzeichnis.size)
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
