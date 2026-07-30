/**
 * Prüfungen für RSS- und iCalendar-Ausgabe.
 *
 * Beide Formate scheitern still. Ein `&` in einer Überschrift macht einen
 * RSS-Feed ungültig, ein Komma in einem Termintitel zerlegt eine
 * iCalendar-Zeile in zwei Felder – und das Ergebnis ist keine Fehlermeldung,
 * sondern ein Newsreader, der nichts anzeigt, oder ein Kalender, der die Datei
 * wortlos verwirft.
 */

import {
  baueIcs,
  baueRss,
  falte,
  icsText,
  rfc822,
  xmlText,
  type Feedeintrag,
} from '../lib/feed.ts'

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

const kopf = {
  titel: 'IM Invests – Nachrichten',
  url: 'https://iminvests.de/news',
  beschreibung: 'Eingeordnete Meldungen',
  feedUrl: 'https://iminvests.de/feed.xml',
  sprache: 'de',
}

function eintrag(teil: Partial<Feedeintrag> = {}): Feedeintrag {
  return {
    titel: 'Ein Titel',
    url: 'https://iminvests.de/news/ein-titel',
    beschreibung: 'Ein Teaser.',
    datum: '2026-07-30T06:00:00+02:00',
    ...teil,
  }
}

console.log('\n— XML maskieren —')

/*
  Das Kaufmanns-Und ist der Fall, an dem RSS-Feeds regelmaessig scheitern. Eine
  Ueberschrift wie „Zinsen & Inflation“ macht die Datei ungueltig, und ein
  Newsreader zeigt dann nicht etwa den Fehler, sondern gar nichts.
*/
pruefe('das Kaufmanns-Und', xmlText('Zinsen & Inflation') === 'Zinsen &amp; Inflation')
pruefe('spitze Klammern', xmlText('<b>fett</b>') === '&lt;b&gt;fett&lt;/b&gt;')
pruefe('Anfuehrungszeichen', xmlText('sagt "ja"') === 'sagt &quot;ja&quot;')
/*
  Und zwar in dieser Reihenfolge: Wer erst `<` ersetzt und dann `&`, macht aus
  `&lt;` ein `&amp;lt;` — die Maskierung maskiert sich selbst.
*/
pruefe('keine doppelte Maskierung', xmlText('a & <b>') === 'a &amp; &lt;b&gt;')

pruefe('das Datum wird zu RFC 822', rfc822('2026-07-30T06:00:00+02:00').endsWith('GMT'))

console.log('\n— RSS —')

{
  const feed = baueRss(kopf, [eintrag({ titel: 'Zinsen & mehr' })])
  pruefe('beginnt mit der XML-Deklaration', feed.startsWith('<?xml version="1.0"'))
  pruefe('enthaelt genau ein item', feed.split('<item>').length === 2)
  pruefe('der Titel ist maskiert', feed.includes('<title>Zinsen &amp; mehr</title>'))
  pruefe('mit self-Link', feed.includes('rel="self"'))
  pruefe('und lastBuildDate', feed.includes('<lastBuildDate>'))
  /*
    Die Adresse dient zugleich als guid. Eine zweite Kennung koennte von der
    Adresse abweichen, und dann legt ein Newsreader denselben Artikel zweimal
    an.
  */
  pruefe(
    'die guid ist die Adresse',
    feed.includes('<guid isPermaLink="true">https://iminvests.de/news/ein-titel</guid>')
  )
}

pruefe(
  'ein leerer Feed bleibt gueltiges XML',
  baueRss(kopf, []).includes('</channel>') && !baueRss(kopf, []).includes('<item>')
)

pruefe(
  'die Kategorie steht nur, wenn es eine gibt',
  !baueRss(kopf, [eintrag()]).includes('<category>') &&
    baueRss(kopf, [eintrag({ kategorie: 'Märkte' })]).includes(
      '<category>Märkte</category>'
    )
)

console.log('\n— iCalendar maskieren —')

/*
  Komma und Semikolon trennen in iCalendar Werte. „Quartalszahlen, erwartet“
  ohne Maskierung ergibt zwei Felder, und der Kalender zeigt den halben Titel
  oder gar keinen.
*/
pruefe('Komma', icsText('Zahlen, erwartet') === 'Zahlen\\, erwartet')
pruefe('Semikolon', icsText('a; b') === 'a\\; b')
pruefe('Rueckwaertsstrich zuerst', icsText('a\\b') === 'a\\\\b')
pruefe('Zeilenumbruch', icsText('a\nb') === 'a\\nb')

console.log('\n— Zeilen falten —')

pruefe('kurze Zeilen bleiben', falte('SUMMARY:kurz').length === 1)
{
  const lang = 'SUMMARY:' + 'x'.repeat(200)
  const teile = falte(lang)
  pruefe('lange Zeilen werden geteilt', teile.length > 1)
  pruefe(
    'keine Teilzeile ist zu lang',
    teile.every((teil) => Buffer.from(teil, 'utf8').length <= 75)
  )
  pruefe(
    'Fortsetzungen beginnen mit Leerzeichen',
    teile.slice(1).every((teil) => teil.startsWith(' '))
  )
  pruefe(
    'nichts geht verloren',
    teile.map((t, i) => (i === 0 ? t : t.slice(1))).join('') === lang
  )
}
/*
  Gezaehlt wird in Bytes, nicht in Zeichen. Ein Umlaut belegt in UTF-8 zwei —
  eine Umbruchstelle mitten in seinen Bytes macht aus ihm zwei kaputte Zeichen.
*/
{
  const umlaute = 'SUMMARY:' + 'ä'.repeat(80)
  const teile = falte(umlaute)
  pruefe(
    'Umlaute werden nicht zerschnitten',
    teile.map((t, i) => (i === 0 ? t : t.slice(1))).join('') === umlaute
  )
  pruefe(
    'und die Byte-Grenze haelt trotzdem',
    teile.every((teil) => Buffer.from(teil, 'utf8').length <= 75)
  )
}

console.log('\n— iCalendar bauen —')

{
  const ics = baueIcs(
    'Börsenkalender',
    'Termine',
    [
      {
        uid: 'ezb-2026-09-10',
        datum: '2026-09-10',
        titel: 'EZB: Zinsentscheid',
        beschreibung: 'Der Rat tagt.',
        url: 'https://iminvests.de/kalender',
      },
    ],
    new Date('2026-07-30T12:00:00Z')
  )
  pruefe(
    'beginnt und endet richtig',
    ics.startsWith('BEGIN:VCALENDAR') && ics.trimEnd().endsWith('END:VCALENDAR')
  )
  pruefe('mit CRLF', ics.includes('\r\n'))
  pruefe('ein Ereignis', ics.split('BEGIN:VEVENT').length === 2)
  pruefe('als Ganztagstermin', ics.includes('DTSTART;VALUE=DATE:20260910'))
  /*
    Das Ende eines Ganztagstermins ist in iCalendar ausschliessend: Ein Termin
    an einem einzigen Tag endet am Folgetag. Wer hier denselben Tag einsetzt,
    erzeugt einen Termin ohne Dauer — manche Kalender zeigen ihn gar nicht.
  */
  pruefe('das Ende ist der Folgetag', ics.includes('DTEND;VALUE=DATE:20260911'))
  pruefe('der Titel ist maskiert', ics.includes('SUMMARY:EZB: Zinsentscheid'))
  pruefe('die Kennung bleibt stabil', ics.includes('UID:ezb-2026-09-10'))
  pruefe('haelt den Kalender nicht als belegt', ics.includes('TRANSP:TRANSPARENT'))
}

{
  const ics = baueIcs('K', 'B', [
    {
      uid: 'x',
      datum: '2026-09-10',
      bis: '2026-09-14',
      titel: 'Fenster',
      beschreibung: 'mehrtägig',
    },
  ])
  pruefe(
    'ein Zeitfenster endet einen Tag nach dem letzten',
    ics.includes('DTEND;VALUE=DATE:20260915')
  )
}

pruefe(
  'ein leerer Kalender bleibt gueltig',
  !baueIcs('K', 'B', []).includes('BEGIN:VEVENT')
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
