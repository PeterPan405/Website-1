/**
 * Prüfungen für die Vorabprüfung der Nachrichtenquellen.
 *
 * Ausführen mit `npm test`.
 *
 * Der Fall, um den es geht, ist nicht der Statuscode 404 – den sieht jeder.
 * Es ist die Seite, die mit 200 antwortet und nichts liefert: ein Gerüst aus
 * Menü und Fußzeile, weil der Inhalt per JavaScript nachkommt. Sie sieht in
 * jedem Protokoll wie ein Erfolg aus.
 */

import {
  FLIESSTEXT_AB,
  bewerte,
  datumsformen,
  istAktuell,
  lageJeRubrik,
  ohneQuelle,
  tagDavor,
  taugt,
  type Befund,
} from '../lib/quellenprobe.ts'
import { assertQuellenValid, nachrichtenquellen } from '../data/nachrichtenquellen.ts'

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

/* ------------------------------------------------------------------ Datum */

check('vier Schreibweisen je Tag', datumsformen('2026-07-31'), [
  '31.07.2026',
  '31.7.2026',
  '31. Juli 2026',
  '2026-07-31',
])
check('einstelliger Tag ohne führende Null', datumsformen('2026-03-05')[1], '5.3.2026')
check('der Tag davor', tagDavor('2026-08-01'), '2026-07-31')
check('über den Monatswechsel zurück', tagDavor('2026-03-01'), '2026-02-28')
check('über den Jahreswechsel zurück', tagDavor('2026-01-01'), '2025-12-31')

check(
  'heute wird gefunden',
  istAktuell('Stand: 31.07.2026, 9:15 Uhr', '2026-07-31'),
  true
)
check(
  'gestern zählt mit – der Sechs-Uhr-Lauf findet die Meldung vom Vorabend',
  istAktuell('veröffentlicht am 30. Juli 2026', '2026-07-31'),
  true
)
check(
  'vorgestern nicht mehr',
  istAktuell('veröffentlicht am 29. Juli 2026', '2026-07-31'),
  false
)

/* -------------------------------------------------------------- Bewertung */

const absatz =
  'Die Europäische Zentralbank hat den Leitzins unverändert gelassen und dabei ' +
  'auf die weiterhin gedämpfte Preisentwicklung im Euroraum verwiesen, die sich ' +
  'nach Einschätzung des Rates in den kommenden Quartalen fortsetzen dürfte. '

/** Eine Seite, wie sie aussieht, wenn sie funktioniert. */
const echterArtikel = [
  'EZB Pressemitteilung 31.07.2026',
  absatz.repeat(3),
  absatz.repeat(3),
  'Startseite Impressum Datenschutz',
].join('\n')

/** Dieselbe Seite, wenn ihr Inhalt per JavaScript nachkommt. */
const geruest = [
  'Startseite',
  'Über uns',
  'Presse',
  'Kontakt',
  'Impressum',
  'Datenschutz',
  'Navigation überspringen',
  'Alle Meldungen anzeigen',
].join('\n')

check(
  'ein Artikel ist brauchbar',
  bewerte(200, echterArtikel, '2026-07-31').urteil,
  'brauchbar'
)
check('404 ist stumm', bewerte(404, '', '2026-07-31').urteil, 'stumm')
check('ein Netzfehler ist stumm', bewerte(0, '', '2026-07-31').urteil, 'stumm')
check('ein Gerüst ist leer', bewerte(200, geruest, '2026-07-31').urteil, 'leer')
check(
  'ein Artikel von vorgestern ist alt',
  bewerte(200, echterArtikel.replace('31.07.2026', '20.07.2026'), '2026-07-31').urteil,
  'alt'
)

/*
  Die Sperrseite: wenig Fließtext plus ein Zustimmungshinweis. Muss als
  „gesperrt“ gemeldet werden und nicht als „leer“ – bei einer Sperre hilft
  keine andere Uhrzeit, sondern nur eine andere Quelle.
*/
const sperre = [
  'Wir und unsere Partner verarbeiten Daten.',
  'Cookie-Einstellungen',
  'Zustimmen und weiterlesen',
  'Bitte aktivieren Sie JavaScript.',
].join('\n')
check(
  'eine Zustimmungssperre wird als solche erkannt',
  bewerte(200, sperre, '2026-07-31').urteil,
  'gesperrt'
)

/*
  Der Gegenprobe-Fall: Ein echter Artikel *über* Datenschutz enthält das Wort
  „Einwilligung“ und ist trotzdem brauchbar. Das Sperrwort allein entscheidet
  nichts – erst zusammen mit fehlendem Fließtext.
*/
const artikelUeberCookies = [
  'Urteil zur Einwilligung 31.07.2026',
  absatz.repeat(3),
  'Der Bundesgerichtshof hat entschieden, dass eine Einwilligung ausdrücklich erteilt werden muss und eine vorangekreuzte Erklärung dafür nicht genügt, weil sie keine bewusste Entscheidung des Nutzers erkennen lässt. ',
  absatz.repeat(2),
].join('\n')
check(
  'ein Artikel über Einwilligungen ist keine Sperre',
  bewerte(200, artikelUeberCookies, '2026-07-31').urteil,
  'brauchbar'
)

/*
  Viel Text, aber alles kurze Zeilen: eine Schlagzeilenliste ohne Artikel. Sie
  überschreitet die Zeichenzahl und fällt trotzdem durch, weil der Anteil an
  Fließtext zu klein ist.
*/
const schlagzeilen = Array.from(
  { length: 90 },
  (_, i) => `Meldung ${i}: Kurse geben nach, Anleger bleiben vorsichtig 31.07.2026`
).join('\n')
const schlagzeilenBefund = bewerte(200, schlagzeilen, '2026-07-31')
check(
  'eine reine Schlagzeilenliste zählt nicht als Artikel',
  schlagzeilenBefund.urteil,
  'leer'
)
check('und ihr Fließtext ist null', schlagzeilenBefund.fliesstext, 0)
check(
  'die Schwelle liegt bei der Zeilenlänge',
  'x'.repeat(FLIESSTEXT_AB).length >= FLIESSTEXT_AB,
  true
)

const guterBefund = bewerte(200, echterArtikel, '2026-07-31')
check('brauchbar taugt', taugt(guterBefund), true)
check('leer taugt nicht', taugt(bewerte(200, geruest, '2026-07-31')), false)

/* ----------------------------------------------------------------- Lage */

function befundMit(urteil: Befund['urteil']): Befund {
  return { urteil, fliesstext: 0, gesamt: 0, aktuell: false, grund: '' }
}

const lagen = lageJeRubrik([
  { rubrik: 'Geldpolitik', adresse: 'https://a', befund: befundMit('brauchbar') },
  { rubrik: 'Geldpolitik', adresse: 'https://b', befund: befundMit('leer') },
  { rubrik: 'Rohstoffe', adresse: 'https://c', befund: befundMit('gesperrt') },
  { rubrik: 'Rohstoffe', adresse: 'https://d', befund: befundMit('alt') },
])

check('zwei Rubriken', lagen.length, 2)
check('die brauchbaren stehen je Rubrik', lagen[0].brauchbar, ['https://a'])
check('geprüft wird alles', lagen[1].geprueft.length, 2)
check('eine Rubrik steht ohne da', ohneQuelle(lagen), ['Rohstoffe'])
check('bei lauter brauchbaren keine Meldung', ohneQuelle([lagen[0]]), [])

/* ------------------------------------------------------------ Quellenliste */

check(
  'die gepflegte Liste hält ihre eigene Prüfung aus',
  (() => {
    assertQuellenValid(nachrichtenquellen)
    return 'ok'
  })(),
  'ok'
)
check(
  'jede Rubrik hat eine Ausweichquelle',
  nachrichtenquellen.every((r) => r.quellen.length >= 2),
  true
)

/* Und die Prüfung greift auch: */
function wirft(fn: () => void): string {
  try {
    fn()
    return 'kein Fehler'
  } catch (fehler) {
    return fehler instanceof Error ? fehler.message.split('\n')[0] : 'unbekannt'
  }
}
check(
  'eine Rubrik ohne Ausweichquelle wird abgewiesen',
  wirft(() =>
    assertQuellenValid([
      {
        rubrik: 'Allein',
        zweck: 'x',
        quellen: [{ name: 'a', adresse: 'https://a', wofuer: 'x', primaer: true }],
      },
    ])
  ),
  'Die Nachrichtenquellen sind fehlerhaft:'
)
check(
  'eine doppelte Adresse wird abgewiesen',
  wirft(() =>
    assertQuellenValid([
      {
        rubrik: 'Eins',
        zweck: 'x',
        quellen: [
          { name: 'a', adresse: 'https://a', wofuer: 'x', primaer: true },
          { name: 'b', adresse: 'https://b', wofuer: 'x', primaer: true },
        ],
      },
      {
        rubrik: 'Zwei',
        zweck: 'x',
        quellen: [
          { name: 'c', adresse: 'https://a', wofuer: 'x', primaer: true },
          { name: 'd', adresse: 'https://d', wofuer: 'x', primaer: true },
        ],
      },
    ])
  ),
  'Die Nachrichtenquellen sind fehlerhaft:'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
