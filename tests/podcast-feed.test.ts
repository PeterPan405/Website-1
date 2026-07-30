/**
 * Prüfungen für das Lesen des Podcast-Feeds.
 *
 * Der Abruf lässt sich hier nicht prüfen – dafür bräuchte es Spotify. Das
 * Zerlegen dagegen schon, und dort sitzen die Fallen: drei erlaubte
 * Schreibweisen für die Dauer, CDATA um jeden zweiten Text, doppelte Titel.
 */

import {
  dauerText,
  folgenSlug,
  leseDatum,
  leseDauer,
  leseFeed,
  nurText,
} from '../lib/podcast-feed.ts'

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

console.log('\n— Text —')

pruefe('entfernt CDATA', nurText('<![CDATA[Hallo]]>') === 'Hallo')
pruefe('entfernt Auszeichnung', nurText('<p>Ein <b>Wort</b></p>') === 'Ein Wort')
pruefe(
  'macht aus Absaetzen Leerzeichen',
  nurText('<p>Eins</p><p>Zwei</p>') === 'Eins Zwei'
)
pruefe('loest Entities auf', nurText('Zins &amp; Zinseszins') === 'Zins & Zinseszins')
pruefe('auch das Apostroph', nurText('L&#39;Or&amp;eal') === "L'Or&eal")

/*
  Umlaute als benannte Entity sind bei Podcast-Hostern der Regelfall, nicht die
  Ausnahme. Diese Pruefung gaebe es ohne einen echten Fehlversuch nicht: Der
  erste Testlauf gegen einen nachgebauten Feed schrieb „Finanzen
  verst&auml;ndlich erkl&auml;rt“ in den Bestand — die Kette aus einzelnen
  Ersetzungen kannte nur `&amp;`, `&lt;`, `&gt;` und `&quot;`.
*/
pruefe('deutsche Umlaute', nurText('verst&auml;ndlich') === 'verständlich')
pruefe('und das scharfe s', nurText('gro&szlig;e Summe') === 'große Summe')
pruefe(
  'Gedankenstrich und Auslassung',
  nurText('Zins &ndash; und mehr&hellip;') === 'Zins – und mehr…'
)
pruefe('sechzehnstellige Angabe', nurText('&#x20AC;100') === '€100')
/*
  Unbekanntes bleibt stehen, statt verschluckt zu werden. Eine Entity, die
  dieses Modul nicht kennt, ist immer noch lesbarer als eine Luecke.
*/
pruefe('unbekannte Entity bleibt', nurText('&foobar; Rest') === '&foobar; Rest')
/*
  Ein Durchgang statt einer Kette. `&amp;lt;` ist die korrekte Schreibweise fuer
  die Zeichenfolge `&lt;` — wer erst `&amp;` und danach `&lt;` ersetzt, macht
  daraus ein `<` und damit aus einem Text ueber HTML wieder HTML.
*/
pruefe('keine doppelte Aufloesung', nurText('&amp;lt;p&amp;gt;') === '&lt;p&gt;')

console.log('\n— Dauer —')

/*
  iTunes erlaubt drei Schreibweisen, und alle drei kommen vor. Wer nur eine
  liest, zeigt bei den anderen nichts oder – schlimmer – eine falsche Zahl:
  „30:30“ als Sekunden gelesen waere NaN, als Zahl 30.
*/
pruefe('liest blanke Sekunden', leseDauer('1830') === 1830)
pruefe('liest Minuten und Sekunden', leseDauer('30:30') === 1830)
pruefe('liest Stunden, Minuten, Sekunden', leseDauer('1:30:30') === 5430)
pruefe('leere Angabe ergibt nichts', leseDauer('') === null)
pruefe('fehlende Angabe ergibt nichts', leseDauer(undefined) === null)
pruefe('Unsinn ergibt nichts', leseDauer('etwa eine Stunde') === null)

pruefe('beschriftet Minuten', dauerText(1830) === '31 Min.')
pruefe('und Stunden', dauerText(5430) === '1 Std. 31 Min.')
pruefe('ohne Dauer keine Beschriftung', dauerText(null) === null)

console.log('\n— Datum —')

pruefe(
  'liest ein RFC-822-Datum',
  leseDatum('Tue, 28 Jul 2026 06:00:00 GMT') === '2026-07-28'
)
pruefe('unbrauchbares Datum ergibt nichts', leseDatum('demnaechst') === null)

console.log('\n— Slug —')

pruefe('schreibt Umlaute aus', folgenSlug('Zinsen erklärt') === 'zinsen-erklaert')
pruefe(
  'behaelt die Folgennummer',
  folgenSlug('#12 Der Zinseszins') === '12-der-zinseszins'
)
pruefe('laesst keinen Bindestrich am Ende', !folgenSlug('Was ist ein ETF?').endsWith('-'))

console.log('\n— Ganzer Feed —')

const feed = `<?xml version="1.0"?>
<rss><channel>
  <title>IM Invests</title>
  <item>
    <title><![CDATA[#2 Was ist eine Dividende?]]></title>
    <description><![CDATA[<p>Wir sprechen über <b>Ausschüttungen</b>.</p>]]></description>
    <pubDate>Tue, 28 Jul 2026 06:00:00 GMT</pubDate>
    <itunes:duration>32:10</itunes:duration>
    <link>https://open.spotify.com/episode/zwei</link>
  </item>
  <item>
    <title>#1 Warum überhaupt anlegen</title>
    <description>Die erste Folge.</description>
    <pubDate>Tue, 21 Jul 2026 06:00:00 GMT</pubDate>
    <itunes:duration>1805</itunes:duration>
    <link>https://open.spotify.com/episode/eins</link>
  </item>
  <item>
    <title></title>
    <description>Ohne Titel, faellt heraus.</description>
  </item>
</channel></rss>`

const folgen = leseFeed(feed)
pruefe('liest beide Folgen', folgen.length === 2, String(folgen.length))
pruefe('juengste zuerst', folgen[0].titel.startsWith('#2'))
pruefe('Titel ohne CDATA', folgen[0].titel === '#2 Was ist eine Dividende?')
pruefe(
  'Beschreibung ohne Auszeichnung',
  folgen[0].beschreibung === 'Wir sprechen über Ausschüttungen.'
)
pruefe('Datum umgesetzt', folgen[0].datum === '2026-07-28')
pruefe('Dauer aus Minuten und Sekunden', folgen[0].dauerSekunden === 1930)
pruefe('Dauer aus blanken Sekunden', folgen[1].dauerSekunden === 1805)
pruefe('Adresse uebernommen', folgen[0].url === 'https://open.spotify.com/episode/zwei')
/*
  Ein Eintrag ohne Titel hat keinen Slug und damit keine Adresse.
*/
pruefe(
  'ein Eintrag ohne Titel faellt heraus',
  folgen.every((f) => f.titel !== '')
)

/*
  Zwei Folgen mit demselben Titel gibt es. Ohne Zusatz ueberschriebe die
  zweite die erste – und eine Folge waere von der Website verschwunden.
*/
const doppelt = leseFeed(`<rss><channel>
  <item><title>Fragen und Antworten</title><pubDate>Tue, 28 Jul 2026 06:00:00 GMT</pubDate></item>
  <item><title>Fragen und Antworten</title><pubDate>Tue, 21 Jul 2026 06:00:00 GMT</pubDate></item>
</channel></rss>`)
pruefe('doppelte Titel ergeben zwei Folgen', doppelt.length === 2)
pruefe(
  'mit verschiedenen Slugs',
  doppelt[0].slug !== doppelt[1].slug,
  doppelt.map((f) => f.slug).join(',')
)

pruefe(
  'ein leerer Feed ergibt nichts',
  leseFeed('<rss><channel></channel></rss>').length === 0
)
pruefe('Unsinn ergibt nichts', leseFeed('keine Ahnung was das ist').length === 0)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
