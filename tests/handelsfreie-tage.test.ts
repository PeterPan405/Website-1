/**
 * Handelsfreie Tage – und ob der Befund einer ist.
 *
 * ## Was hier schiefgehen kann
 *
 * 1. **Eine Datenlücke wird zum Feiertag.** Der teuerste Fehler dieser Seite:
 *    Sie behauptet dann „Börse geschlossen“ an einem Handelstag, und nichts
 *    daran sieht falsch aus.
 * 2. **Ein verschobenes Datum wird ausgewertet.** Australien und Neuseeland
 *    haben in der Quelle null Freitage und stattdessen Sonntage. Wer das nicht
 *    abweist, veröffentlicht 32 „Feiertage“, von denen die Hälfte ganz normale
 *    Freitage sind.
 * 3. **Die Golf-Börsen werden mit den verschobenen in einen Topf geworfen.**
 *    Tadawul handelt Sonntag bis Donnerstag – das ist keine Verschiebung,
 *    sondern die Handelswoche. Eine Prüfung, die stur nach Montag bis Freitag
 *    fragt, wirft beides zusammen.
 * 4. **Die Wochentagsrechnung hängt an der Zeitzone des Bauservers.**
 */

import {
  boersenkuerzel,
  datumSitzt,
  nachWochentag,
  platzbefund,
  werktageZwischen,
  wochentagVon,
  WOCHE_MO_FR,
} from '@/lib/handelsfreie-tage'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/* --------------------------------------------------------- Der Wochentag */

pruefen('Der 17. August 2026 ist ein Montag', wochentagVon('2026-08-17') === 1)
pruefen('Der 16. August 2026 ist ein Sonntag', wochentagVon('2026-08-16') === 0)
pruefen('Ein unlesbares Datum ergibt null', wochentagVon('irgendwann') === null)

/*
  Die Zeitzonenprobe.

  `new Date('2026-08-17')` liest ISO-Daten als UTC, `new Date(2026, 7, 17)`
  als Ortszeit. Auf einem Bauserver westlich von Greenwich kippt die erste
  Variante um einen Tag zurück – und dann verschiebt sich die ganze
  Wochentagsrechnung. Geprüft wird deshalb ein Datum, das in beiden Fällen
  einen anderen Wochentag ergäbe.
*/
pruefen(
  'Die Wochentagsrechnung hängt nicht an der Zeitzone',
  wochentagVon('2026-01-01') === 4,
  `${wochentagVon('2026-01-01')} – der 1. Januar 2026 ist ein Donnerstag.\n` +
    '     Käme Mittwoch heraus, läse die Funktion das Datum als Ortszeit.'
)

/* ------------------------------------------------------- Die Handelswoche */

console.log('')

/** Baut eine Wochentagszählung aus benannten Tagen. */
function zaehlung(werte: Partial<Record<number, number>>): number[] {
  return Array.from({ length: 7 }, (_, i) => werte[i] ?? 0)
}

/*
  Die Zählung, die im Betrieb tatsächlich benutzt wird.

  Die Fälle unten arbeiten mit von Hand gesetzten Zahlen – das ist lesbar, aber
  es prüft `nachWochentag` nicht. Diese eine Probe schließt die Lücke: Eine
  volle Januarwoche muss je einen Montag bis Freitag ergeben und nichts sonst.
*/
pruefen(
  'nachWochentag zählt die Tage richtig',
  nachWochentag(werktageZwischen('2026-01-05', '2026-01-09')).join() ===
    zaehlung({ 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 }).join(),
  `${nachWochentag(werktageZwischen('2026-01-05', '2026-01-09')).join()}`
)

const gesund = zaehlung({ 1: 51, 2: 52, 3: 50, 4: 50, 5: 49 })
pruefen(
  'Ein gesunder Platz besteht die Prüfung',
  datumSitzt(gesund).gut && datumSitzt(gesund).woche.join() === WOCHE_MO_FR.join(),
  'Die Gegenprobe zur Abweisung: Sie darf nicht alles abweisen.'
)

/*
  Der Golf-Platz wird abgewiesen – und das ist Absicht.

  Tadawul handelt wirklich von Sonntag bis Donnerstag; das ist keine
  Verschiebung. Trotzdem wird er nicht ausgewertet, weil er von einem
  verschobenen Platz nicht zu unterscheiden ist: Neuseeland hat null Freitage
  und 48 Sonntage, Tadawul null Freitage und 50 Sonntage. An den
  Wochentagszahlen ist das dieselbe Verteilung.

  Der erste Anlauf suchte deshalb den bestbesetzten Block von fünf
  zusammenhängenden Tagen – und ließ Neuseeland durch. Diese Prüfung hat es
  gefunden. Kosten der strengeren Regel: keine. Tadawul führt hier vier
  Reihen, Katar zwei; beide liegen ohnehin unter der Mindestzahl.
*/
const golf = zaehlung({ 0: 50, 1: 51, 2: 50, 3: 51, 4: 51 })
pruefen(
  'Der Golf-Platz wird abgewiesen, weil er nicht zu unterscheiden ist',
  !datumSitzt(golf).gut,
  `Anteil Mo–Fr ${(datumSitzt(golf).anteilImBlock * 100).toFixed(0)} % –\n` +
    '     dieselbe Verteilung wie ein um zwei Tage verschobener Platz.'
)

/*
  Die Gegenprobe mit den echten Zahlen aus dem Bestand.

  Australien: 50/52/50/50 von Montag bis Donnerstag, 26 Freitage und 25
  Sonntage. Neuseeland: null Freitage, 48 Sonntage. Beides muss abgewiesen
  werden – und zwar mit denselben Zahlen, mit denen es am 18. August 2026
  aufgefallen ist.
*/
const australien = zaehlung({ 1: 50, 2: 52, 3: 50, 4: 50, 5: 26, 0: 25 })
const neuseeland = zaehlung({ 1: 52, 2: 52, 3: 50, 4: 47, 5: 0, 0: 48 })

pruefen(
  'Australien wird abgewiesen',
  !datumSitzt(australien).gut,
  `schwächster Tag ${(datumSitzt(australien).schwaechster * 100).toFixed(0)} % –\n` +
    '     halbe Freitage, halbe Sonntage. Ohne Abweisung stünden 32 „Feiertage“ auf der Seite.'
)

pruefen(
  'Neuseeland wird abgewiesen',
  !datumSitzt(neuseeland).gut,
  `schwächster Tag ${(datumSitzt(neuseeland).schwaechster * 100).toFixed(0)} %`
)

/*
  Und die Grenze selbst.

  Australien kommt auf genau 0,5 – eine Grenze bei „mindestens die Hälfte“
  trüge den kaputten Fall gerade eben. Geprüft wird deshalb, dass ein Platz
  knapp über der Hälfte immer noch abgewiesen wird.
*/
pruefen(
  'Ein Platz knapp über der Hälfte wird noch abgewiesen',
  !datumSitzt(zaehlung({ 1: 52, 2: 52, 3: 52, 4: 52, 5: 28 })).gut,
  '28 von 52 sind 54 % – eine Grenze bei genau 50 % wäre eine Wette.'
)

/* ----------------------------------------------------------- Die Werktage */

console.log('')

pruefen(
  'Eine volle Woche hat fünf Werktage',
  werktageZwischen('2026-08-17', '2026-08-23').length === 5,
  `${werktageZwischen('2026-08-17', '2026-08-23').join(', ')}`
)

pruefen(
  'Das Wochenende fehlt',
  !werktageZwischen('2026-08-17', '2026-08-23').includes('2026-08-22'),
  'Der 22. August 2026 ist ein Samstag.'
)

pruefen(
  'Eine eigene Wochenangabe wird befolgt',
  (() => {
    const nurMontage = werktageZwischen('2026-08-01', '2026-08-31', [1])
    return nurMontage.length === 5 && nurMontage.every((t) => wochentagVon(t) === 1)
  })(),
  'Der Parameter ist kein Etikett – ohne ihn käme die volle Woche zurück.'
)

pruefen(
  'Ein umgedrehter Zeitraum ergibt nichts',
  werktageZwischen('2026-08-23', '2026-08-17').length === 0
)

/* -------------------------------------------- Der Befund für einen Platz */

console.log('')

/** Baut Reihen: `luecken` je Reihe sind die Tage, die dieser Reihe fehlen. */
function reihen(anzahl: number, luecken: string[][] = []): Set<string>[] {
  const alle = werktageZwischen('2026-01-05', '2026-04-24')
  return Array.from({ length: anzahl }, (_, i) => {
    const fehlt = new Set(luecken[i] ?? [])
    return new Set(alle.filter((tag) => !fehlt.has(tag)))
  })
}

/*
  Ein Feiertag: Er fehlt in **jeder** Reihe.
*/
const feiertag = '2026-04-03'
const mitFeiertag = reihen(
  10,
  Array.from({ length: 10 }, () => [feiertag])
)
const befund = platzbefund(mitFeiertag, '2026-01-05', '2026-04-24')

pruefen(
  'Ein Tag, der in jeder Reihe fehlt, ist handelsfrei',
  befund.art === 'ausgewertet' &&
    befund.tage
      .filter((t) => t.art === 'handelsfrei')
      .map((t) => t.tag)
      .join() === feiertag,
  befund.art === 'ausgewertet'
    ? `${befund.tage.map((t) => `${t.tag}:${t.art}`).join(', ')}`
    : 'abgewiesen'
)

/*
  Der wichtigste Fall: Eine Lücke in **einer** Reihe ist kein Feiertag.

  Genau das passiert in Toronto an fünf kanadischen Feiertagen: 7 von 33
  Reihen tragen trotzdem einen Kurs, weil diese Titel auch in New York
  notieren. Ohne diese Unterscheidung stünden dort fünf falsche Feiertage –
  oder fünf echte fehlten.
*/
const eineLuecke = reihen(10, [['2026-02-10']])
const befund2 = platzbefund(eineLuecke, '2026-01-05', '2026-04-24')
pruefen(
  'Eine Lücke in einer einzigen Reihe ist kein Feiertag',
  befund2.art === 'ausgewertet' && befund2.tage.every((t) => t.art !== 'handelsfrei'),
  'Sonst wird jeder Datenausfall zu einer Börsenschließung.'
)

const teils = reihen(
  10,
  Array.from({ length: 7 }, () => ['2026-02-10'])
)
const befund3 = platzbefund(teils, '2026-01-05', '2026-04-24')
pruefen(
  'Fehlt der Tag der Mehrheit, aber nicht allen, heißt er „unklar“',
  befund3.art === 'ausgewertet' &&
    befund3.tage.some((t) => t.tag === '2026-02-10' && t.art === 'unklar'),
  befund3.art === 'ausgewertet'
    ? `${befund3.tage.map((t) => `${t.tag}:${t.art}(${t.mitKurs}/${t.geprueft})`).join(', ')}`
    : 'abgewiesen'
)

pruefen(
  'Zu wenige Reihen werden abgewiesen',
  (() => {
    const wenig = platzbefund(reihen(3), '2026-01-05', '2026-04-24')
    return wenig.art === 'abgewiesen' && wenig.grund === 'zuWenigReihen'
  })(),
  'Bei drei Reihen sähe ein einzelner Ausfall aus wie ein Feiertag.'
)

pruefen(
  'Ein verschobener Platz wird auch im Befund abgewiesen',
  (() => {
    /*
      Reihen, denen alle Freitage fehlen und die stattdessen Sonntage tragen –
      der australische Fall, nachgebaut.
    */
    const alle = werktageZwischen('2026-01-05', '2026-04-24')
    const ohneFreitag = alle.filter((t) => wochentagVon(t) !== 5)
    const sonntage = werktageZwischen('2026-01-04', '2026-04-26', [0])
    const verschoben = Array.from(
      { length: 10 },
      () => new Set([...ohneFreitag, ...sonntage])
    )
    const ergebnis = platzbefund(verschoben, '2026-01-05', '2026-04-24')
    return ergebnis.art === 'abgewiesen' && ergebnis.grund === 'datumVerschoben'
  })(),
  'Der Fall, an dem die Seite ohne Prüfung 32 erfundene Feiertage zeigte.'
)

/* ----------------------------------------------------- Das Börsenkürzel */

console.log('')

pruefen('BMW.DE liegt an der DE', boersenkuerzel('BMW.DE') === 'DE')
pruefen('7203.T liegt an der T', boersenkuerzel('7203.T') === 'T')
pruefen('AAPL ohne Endung ist US', boersenkuerzel('AAPL') === 'US')
pruefen(
  'BRK-B behält seinen Bindestrich',
  boersenkuerzel('BRK-B') === 'US',
  'Der Bindestrich ist keine Börsenendung – sonst landete Berkshire in „B“.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
