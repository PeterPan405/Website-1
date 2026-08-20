/**
 * Meldetermine der Quartalszahlen – Uhrzeit, Nähe und Lücke.
 *
 * ## Was hier schiefgehen kann
 *
 * 1. **Die Uhrzeit ist um eine Stunde falsch.** Zwischen New York und Berlin
 *    liegen nicht immer sechs Stunden: Beide stellen die Uhr um, aber an
 *    verschiedenen Tagen. Genau in das Fenster im März fällt die amerikanische
 *    Berichtssaison für das erste Quartal.
 * 2. **Eine Uhrzeit entsteht aus einem einzigen Zeitstempel.** Ein Unternehmen,
 *    das einmalig morgens statt abends gemeldet hat, bekäme daraus eine Zeit,
 *    die es nie wieder einhält – zu einem Tag, der ohnehin geschätzt ist.
 * 3. **Ein vergangener Termin steht als nächster da.** Ein Kalender, der einen
 *    Meldetag von letzter Woche als „erwartet" führt, ist schlimmer als einer
 *    ohne Angabe.
 * 4. **Die Lücke schweigt.** 711 der 1.029 Aktien haben keinen Termin. Ohne
 *    einen Satz dazu liest ein Besucher aus der Leerstelle etwas Falsches –
 *    und zwar still.
 */

import { marketDefinitions } from '@/data/markets'
import {
  BALD_TAGE,
  getQuartalsterminAbdeckung,
  getQuartalsterminbefund,
  getQuartalstermine,
  quartalsterminLuecke,
  uhrzeitsatz,
} from '@/lib/quartalstermine'
import {
  berlinerUhrzeit,
  newYorkerUhrzeit,
  sitzungslage,
  zonenversatzMinuten,
} from '@/lib/zonenzeit'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/* ------------------------------------------------------- Die Zeitzonen */

/*
  Der gemessene Zeitstempel aus der Quelle, nachgesehen am 20. August 2026 in
  der submissions-Datei der SEC: `2026-08-06T20:01:12.000Z`. Das sind 16:01 Uhr
  New Yorker Zeit – eine Minute nach Börsenschluss, also genau die Lage, die
  eine Ergebnismeldung hat.

  Diese Zeile ist der Beleg dafür, dass `acceptanceDateTime` echtes UTC ist und
  nicht New Yorker Zeit mit einem Z dahinter. Wäre Letzteres der Fall, stünde
  hier 20:01, und jede Uhrzeit dieser Website wäre um vier Stunden falsch.
*/
pruefen(
  'Die Annahmezeit der SEC ist UTC und wird richtig nach New York gerechnet',
  newYorkerUhrzeit('2026-08-06T20:01:12.000Z') === '16:01',
  `${newYorkerUhrzeit('2026-08-06T20:01:12.000Z')} statt 16:01`
)

pruefen(
  'Eine Meldung kurz vor Mitternacht UTC gehört noch zum Vortag in New York',
  newYorkerUhrzeit('2026-08-11T00:56:26.000Z') === '20:56',
  newYorkerUhrzeit('2026-08-11T00:56:26.000Z')
)

pruefen(
  'Und eine Morgenmeldung bleibt eine Morgenmeldung',
  newYorkerUhrzeit('2026-02-11T11:29:41.000Z') === '06:29',
  newYorkerUhrzeit('2026-02-11T11:29:41.000Z')
)

pruefen(
  'Die Lage zur Sitzung wird in New Yorker Zeit entschieden',
  sitzungslage('06:29') === 'vorboerse' &&
    sitzungslage('11:00') === 'handel' &&
    sitzungslage('16:01') === 'nachboerse'
)

pruefen(
  'Halb zehn ist schon Handel, kurz davor noch nicht',
  sitzungslage('09:29') === 'vorboerse' && sitzungslage('09:30') === 'handel'
)

pruefen(
  'Und Punkt sechzehn Uhr ist bereits nachbörslich',
  sitzungslage('15:59') === 'handel' && sitzungslage('16:00') === 'nachboerse'
)

console.log('')

/*
  Die Prüfung, um die es hier eigentlich geht.

  Ein Unternehmen meldet nach *seinem* Börsenschluss um 16:00 Uhr Ortszeit. Wie
  spät das in Deutschland ist, hängt vom Tag ab – und nicht bloß wegen der
  eigenen Sommerzeit, sondern weil Amerika **drei Wochen früher** umstellt als
  Europa. Vom zweiten Sonntag im März bis zum letzten sind es fünf Stunden
  Abstand statt sechs.

  In genau diese drei Wochen fällt jedes Jahr die amerikanische Berichtssaison
  für das erste Quartal. Wer stumpf sechs Stunden addiert, schreibt für jeden
  dieser Termine 22:00 Uhr hin, wo 21:00 Uhr richtig wäre.
*/
pruefen(
  'Im Sommer sind es sechs Stunden',
  berlinerUhrzeit('2026-08-26', '16:01')?.uhrzeit === '22:01',
  JSON.stringify(berlinerUhrzeit('2026-08-26', '16:01'))
)

pruefen(
  'Im Winter auch',
  berlinerUhrzeit('2027-02-24', '16:20')?.uhrzeit === '22:20',
  JSON.stringify(berlinerUhrzeit('2027-02-24', '16:20'))
)

pruefen(
  'Im Umstellungsfenster im März aber nur fünf',
  berlinerUhrzeit('2027-03-15', '16:00')?.uhrzeit === '21:00',
  JSON.stringify(berlinerUhrzeit('2027-03-15', '16:00')) +
    ' – Amerika stellt drei Wochen früher um als Europa, und genau dann meldet' +
    ' das erste Quartal.'
)

pruefen(
  'Das Kürzel folgt dem Tag, nicht der Gewohnheit',
  berlinerUhrzeit('2026-08-26', '16:01')?.kuerzel === 'MESZ' &&
    berlinerUhrzeit('2027-02-24', '16:20')?.kuerzel === 'MEZ' &&
    berlinerUhrzeit('2027-03-15', '16:00')?.kuerzel === 'MEZ'
)

pruefen(
  'Mitternacht in New York wird nicht zu einem Tagessprung',
  berlinerUhrzeit('2026-08-26', '00:00')?.uhrzeit === '06:00',
  JSON.stringify(berlinerUhrzeit('2026-08-26', '00:00')) +
    ' – bei `hour12: false` liefert Intl für Mitternacht die 24.'
)

pruefen(
  'Der Versatz stimmt in beide Richtungen',
  zonenversatzMinuten(new Date('2026-08-01T12:00:00Z'), 'Europe/Berlin') === 120 &&
    zonenversatzMinuten(new Date('2026-08-01T12:00:00Z'), 'America/New_York') === -240
)

pruefen(
  'Unbrauchbare Eingaben ergeben keine Uhrzeit',
  berlinerUhrzeit('nicht-ein-datum', '16:00') === null &&
    berlinerUhrzeit('2026-08-26', 'abends') === null &&
    sitzungslage('') === null &&
    newYorkerUhrzeit('kein Zeitpunkt') === ''
)

/* ---------------------------------------------------------- Der Satz */

console.log('')

pruefen(
  'Ohne belegte Zeit steht keine da',
  uhrzeitsatz({ erwartet: '2026-08-26', basis: '2025-08-27', streuungTage: 0 }) === null,
  'Eine erfundene Uhrzeit wäre hier besonders teuer.'
)

const satz = uhrzeitsatz({
  erwartet: '2026-08-26',
  basis: '2025-08-27',
  streuungTage: 0,
  newYorkerZeit: '16:20',
})

pruefen(
  'Der Satz nennt zuerst die Lage und dann die Minute',
  satz === 'nach dem US-Schluss – im Vorjahr 22:20 Uhr MESZ bei der Behörde eingegangen',
  String(satz)
)

/*
  Die Minute wird als das bezeichnet, was sie ist.

  Gemessen wird, wann die Börsenaufsicht die Meldung angenommen hat. Bei den
  meisten Unternehmen ist das der Augenblick der Veröffentlichung, bei manchen
  liegt ein Nachlauf dazwischen. Wer „um 22:20 Uhr veröffentlicht" schriebe,
  nähme dem Leser die Möglichkeit, das einzuordnen.
*/
pruefen(
  'Die Herkunft der Minute steht dabei',
  (satz ?? '').includes('bei der Behörde eingegangen'),
  String(satz)
)

/*
  Die Prüfung, die aus einer Zählung entstanden ist.

  Am 20. August 2026 lagen 30 der 1.142 gemessenen Zeiten mitten in der
  Handelssitzung: Citigroup um 10:08 Uhr, Ford um 12:08, Chubb um 12:19,
  Sempra um 10:51. Nachgesehen, was diese Häuser tatsächlich tun – sie melden
  vorbörslich. Was dort gemessen wurde, ist nicht die Pressemitteilung, sondern
  das Formular, das Stunden später nachgereicht wird.

  Ein Unternehmen dieser Größe meldet nicht um halb elf am Vormittag. Behauptet
  die Zahl das doch, misst sie etwas anderes als die Veröffentlichung – und
  dann ist Schweigen richtiger als eine Uhrzeit, die vier Stunden danebenliegt.
*/
pruefen(
  'Eine Zeit mitten in der Sitzung ergibt keinen Satz',
  uhrzeitsatz({
    erwartet: '2026-10-13',
    basis: '2025-10-14',
    streuungTage: 0,
    newYorkerZeit: '10:08',
  }) === null,
  'Citigroup reicht sein 8-K um 10:08 Uhr ein und meldet um 8:00 Uhr.'
)

/*
  Die Minute trägt ihre Herkunft mit sich.

  Ohne das Wort „im Vorjahr" wäre die Zeitangabe eine Zusage, die die Quelle
  nicht deckt – dieselbe Überlegung wie beim Tag, der `geschaetzt` trägt.
*/
pruefen('Und sie steht nie nackt da', (satz ?? '').includes('im Vorjahr'), String(satz))

/* ------------------------------------------------------ Der Befund */

console.log('')

/*
  Geprüft wird am echten Bestand und mit einem festen Stichtag.

  Fest, weil sonst nichts zu prüfen wäre: Ob ein Termin „bald" ist, hängt vom
  Tag ab, und ein Test an der Systemuhr prüft an zwei Wochen im Jahr etwas
  anderes als sonst. Echt, weil eine Lücke nur aus dem entsteht, was
  tatsächlich da ist.
*/
const aktien = marketDefinitions.filter((eintrag) => eintrag.kind === 'stock')
const STICHTAG = '2026-08-20'

const befunde = aktien
  .map((eintrag) => ({
    symbol: eintrag.symbol,
    befund: getQuartalsterminbefund(eintrag.symbol, STICHTAG),
  }))
  .filter((eintrag) => eintrag.befund !== null)

pruefen(
  'Es gibt überhaupt Befunde',
  befunde.length > 0,
  `${befunde.length} von ${aktien.length} Aktien`
)

pruefen(
  'Kein Befund liegt in der Vergangenheit',
  befunde.every((eintrag) => eintrag.befund!.erwartet >= STICHTAG),
  befunde
    .filter((eintrag) => eintrag.befund!.erwartet < STICHTAG)
    .slice(0, 5)
    .map((eintrag) => `${eintrag.symbol}: ${eintrag.befund!.erwartet}`)
    .join(', ')
)

pruefen(
  'Die Tageszahl passt zum Datum',
  befunde.every(
    (eintrag) =>
      eintrag.befund!.inTagen >= 0 &&
      eintrag.befund!.inTagen ===
        Math.round(
          (Date.parse(`${eintrag.befund!.erwartet}T00:00:00Z`) -
            Date.parse(`${STICHTAG}T00:00:00Z`)) /
            86_400_000
        )
  )
)

pruefen(
  '„bald“ heißt genau zwei Wochen – die Grenze eingeschlossen',
  befunde.every(
    (eintrag) => eintrag.befund!.bald === eintrag.befund!.inTagen <= BALD_TAGE
  )
)

/*
  Die Gegenprobe: Das Zeichen muss auch anschlagen können.

  Eine Absicherung, die nie anschlägt, sieht aus wie Ruhe – und ein Symbol, das
  bei keiner einzigen Aktie erscheint, wäre schlicht toter Code. Bei 318
  Unternehmen mit vier Quartalen im Jahr müsste an jedem beliebigen Stichtag
  etwa ein Achtel in den nächsten zwei Wochen melden.
*/
const bald = befunde.filter((eintrag) => eintrag.befund!.bald)
pruefen(
  'An einem beliebigen Stichtag melden einige Titel bald',
  bald.length > 0,
  `${bald.length} von ${befunde.length} – wäre es keiner, wäre das Zeichen toter Code.`
)

pruefen(
  'Aber nicht alle – sonst prüfte die Grenze nichts',
  bald.length < befunde.length,
  `${bald.length} von ${befunde.length}`
)

/* -------------------------------------------------------- Die Lücke */

console.log('')

const ohneBefund = aktien.filter(
  (eintrag) => getQuartalsterminbefund(eintrag.symbol, STICHTAG) === null
)

pruefen(
  'Jede Aktie ohne Termin bekommt einen Satz dazu',
  ohneBefund.every((eintrag) => {
    /*
      Zwei Fälle sehen von außen gleich aus und sind es nicht: gar kein
      Meldemuster (dann steht der Lückensatz da) und ein Muster, dessen
      Vorhersagen alle abgelaufen sind. Der zweite ist selten und heilt beim
      nächsten Abruf; er darf hier keine Lücke behaupten, die keine ist.
    */
    const luecke = quartalsterminLuecke(eintrag.symbol)
    return luecke !== null || getQuartalstermineFuer(eintrag.symbol).length > 0
  }),
  ohneBefund
    .filter((eintrag) => quartalsterminLuecke(eintrag.symbol) === null)
    .slice(0, 5)
    .map((eintrag) => eintrag.symbol)
    .join(', ')
)

function getQuartalstermineFuer(symbol: string): unknown[] {
  return getQuartalstermine().filter((termin) => termin.symbole?.includes(symbol))
}

pruefen(
  'Wo ein Termin steht, steht kein Lückensatz',
  befunde.every((eintrag) => quartalsterminLuecke(eintrag.symbol) === null),
  'Zwei Antworten auf dieselbe Frage sind eine zu viel.'
)

/*
  Alibaba ist der Fall, an dem die Lücke aufgefallen ist: Das Unternehmen legte
  am 20. August 2026 Zahlen vor, und auf der Seite stand nichts. Es ist bei der
  SEC geführt – aber als ausländischer Emittent, und die reichen kein 8-K mit
  Punkt 2.02 ein.

  Diese Prüfung darf gern eines Tages umschlagen: Sobald eine Quelle gefunden
  ist, die auch ausländische Emittenten deckt, hat Alibaba einen Termin, und
  dann gehört diese Zeile gestrichen statt repariert.
*/
pruefen(
  'Alibaba hat keinen Termin – und sagt warum',
  quartalsterminLuecke('alibaba') !== null,
  'Wenn das hier fehlschlägt, gibt es endlich eine Quelle für 6-K-Emittenten.'
)

pruefen(
  'Der Lückensatz nennt den Grund und nicht nur die Tatsache',
  (quartalsterminLuecke('alibaba') ?? '').includes('US-Börsenaufsicht'),
  quartalsterminLuecke('alibaba') ?? ''
)

pruefen(
  'Ein Index bekommt weder Termin noch Lückensatz',
  quartalsterminLuecke('dax') === null &&
    getQuartalsterminbefund('dax', STICHTAG) === null,
  'Ein Index legt keine Quartalszahlen vor.'
)

/* ---------------------------------------------------- Die Abdeckung */

console.log('')

const abdeckung = getQuartalsterminAbdeckung()

/*
  Die Zahl, die der Betreiber am 20. August 2026 wissen wollte: Wie
  vollständig ist das?

  Antwort damals: 318 von 1.029, und 302 davon aus den USA. Diese Prüfung hält
  nicht die Zahl fest – die soll ja steigen –, sondern dass die Seite sie
  überhaupt nennen kann. Eine Abdeckung von „158 Unternehmen" ohne den Nenner
  liest sich wie Vollständigkeit.
*/
pruefen(
  'Die Abdeckung nennt Zähler und Nenner',
  abdeckung.unternehmen > 0 &&
    abdeckung.aktienGesamt > abdeckung.unternehmen &&
    abdeckung.termine >= abdeckung.unternehmen,
  `${abdeckung.unternehmen} Unternehmen, ${abdeckung.termine} Termine, ` +
    `${abdeckung.aktienGesamt} Aktien im Katalog`
)

/*
  Und die Prüfung, die den stillen Datenausfall fängt: Kein Termin im Kalender
  darf in der Vergangenheit liegen. Ein Bestand, der eine Woche alt ist, führt
  vergangene Meldetage als „erwartet" – und genau das war am 1. August 2026 der
  Fall, weil der Abruf damals nur wöchentlich lief.
*/
const termine = getQuartalstermine()
const vergangen = termine.filter((termin) => termin.datum < STICHTAG)

pruefen(
  'Kein erwarteter Meldetag liegt vor dem Stichtag',
  vergangen.length === 0,
  `${vergangen.length} Termine, z. B. ${vergangen
    .slice(0, 3)
    .map((t) => `${t.titel} am ${t.datum}`)
    .join(', ')}`
)

pruefen(
  'Jeder Termin ist als geschätzt gekennzeichnet',
  termine.every((termin) => termin.geschaetzt !== undefined),
  'Ein geschätzter Termin, der aussieht wie ein feststehender, ist schlechter als gar keiner.'
)

/* ------------------------------------------- Die Uhrzeit im Kalender */

console.log('')

/*
  Hier lauert die Falle, vor der `AGENTS.md` warnt: **Eine Absicherung, die nie
  anschlägt, sieht aus wie Ruhe.**

  Die Annahmezeiten kommen aus einem Feld, das der Abruf erst seit dem
  20. August 2026 liest. Bis der nächtliche Lauf einmal durch ist, trägt kein
  einziger Termin eine Uhrzeit – und jede Prüfung der Form „alle Uhrzeiten sind
  richtig" wäre über eine leere Menge wahr. Sie stünde grün da und prüfte nichts.

  Deshalb zwei Dinge: Die Zahl wird ausgegeben, damit die leere Menge sichtbar
  ist statt still. Und dieselben Regeln laufen zusätzlich über einen
  handgeschriebenen Satz, der sie **verletzen muss** – so ist die Prüfung ab dem
  ersten Tag scharf und deckt den echten Bestand mit ab, sobald es ihn gibt.
*/
const mitUhrzeit = termine.filter((termin) => termin.uhrzeit)
console.log(
  `     (${mitUhrzeit.length} von ${termine.length} Terminen im Bestand tragen eine Uhrzeit)`
)

function traegtKuerzel(text: string): boolean {
  return /\b(MEZ|MESZ)\b/.test(text)
}

function abendsInDeutschland(text: string): boolean {
  if (!text.startsWith('nach dem US-Schluss')) return true
  const stunde = Number(/(\d{2}):\d{2} Uhr/.exec(text)?.[1] ?? '-1')
  // Von 21 Uhr abends bis 6 Uhr morgens – später als das meldet niemand.
  return stunde >= 21 || stunde <= 6
}

/*
  Der Gegenbeweis. „20:01 Uhr" ist genau das Ergebnis, das entsteht, wenn
  jemand den UTC-Zeitstempel der SEC für eine Ortszeit hält und die
  Zeitumrechnung ausfallen lässt: Die Lage stimmte dann noch, die Minute nicht
  mehr – beides für sich plausibel, nur zusammen falsch.
*/
pruefen(
  'Die Uhrzeitprüfung beanstandet, was sie beanstanden muss',
  !abendsInDeutschland('nach dem US-Schluss – im Vorjahr 20:01 Uhr MESZ') &&
    !traegtKuerzel('nach dem US-Schluss – im Vorjahr 22:01 Uhr'),
  'Ohne diesen Gegenbeweis wäre die Prüfung darunter über eine leere Menge wahr.'
)

pruefen(
  'Und lässt durch, was richtig ist',
  abendsInDeutschland('nach dem US-Schluss – im Vorjahr 22:01 Uhr MESZ') &&
    abendsInDeutschland('vor der US-Eröffnung – im Vorjahr 12:29 Uhr MESZ') &&
    traegtKuerzel('vor der US-Eröffnung – im Vorjahr 12:29 Uhr MESZ')
)

pruefen(
  'Jede Uhrzeit im Bestand trägt ein Zeitkürzel',
  mitUhrzeit.every((termin) => traegtKuerzel(termin.uhrzeit ?? '')),
  mitUhrzeit
    .filter((termin) => !traegtKuerzel(termin.uhrzeit ?? ''))
    .slice(0, 3)
    .map((termin) => termin.uhrzeit)
    .join(' | ')
)

pruefen(
  'Und jede nachbörsliche Meldung liegt in Deutschland am Abend',
  mitUhrzeit.every((termin) => abendsInDeutschland(termin.uhrzeit ?? '')),
  mitUhrzeit
    .filter((termin) => !abendsInDeutschland(termin.uhrzeit ?? ''))
    .slice(0, 3)
    .map((termin) => termin.uhrzeit)
    .join(' | ')
)

pruefen(
  'Kein Termin behauptet, mitten in der Sitzung gemeldet zu werden',
  mitUhrzeit.every(
    (termin) => !(termin.uhrzeit ?? '').includes('während des US-Handels')
  ),
  mitUhrzeit
    .filter((termin) => (termin.uhrzeit ?? '').includes('während des US-Handels'))
    .slice(0, 5)
    .map((termin) => `${termin.titel}: ${termin.uhrzeit}`)
    .join(' | ')
)

/*
  Und die Gegenprobe zur Zusage des Betreibers: „im Kalender soll dann immer
  stehen, um wie viel Uhr". „Immer" ist bei einer abgeleiteten Angabe nicht zu
  halten, aber „fast immer" schon – und ohne Zahl wäre das eine Behauptung.

  Gemessen am 20. August 2026: 1.142 von 1.205 Vorhersagen tragen eine Zeit,
  davon fallen 30 als Sitzungszeiten heraus. Bleiben rund 92 Prozent. Die
  Grenze steht bei 80: Sie lässt Schwankung zu und schlägt an, wenn die Quelle
  das Feld eines Tages nicht mehr liefert – dann fiele der Anteil auf null, und
  das wäre genau der stille Datenausfall, den niemand bemerkt.
*/
const anteil = termine.length > 0 ? mitUhrzeit.length / termine.length : 0
pruefen(
  'Die große Mehrheit der Termine nennt eine Uhrzeit',
  anteil >= 0.8,
  `${mitUhrzeit.length} von ${termine.length} = ${(anteil * 100).toFixed(1)} % – ` +
    'ein Sturz auf null hieße, die Quelle liefert das Feld nicht mehr.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
