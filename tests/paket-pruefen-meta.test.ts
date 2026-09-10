/**
 * Was die Paketprüfung zählt, wenn sie Länge misst.
 *
 * Ausführen mit `npm test`.
 *
 * ## Der Anlass
 *
 * Am 10. September 2026 stand morgens keine Ausgabe auf der Website. Nicht,
 * weil etwas fehlte – der Entwurf lag um 00:28 auf `nachrichten-entwurf` –,
 * sondern weil `npm run pruefen` einen Artikel abwies:
 *
 *     /news/wall-street-oelpreis-belastet-meta-rallye/:
 *     Meta-Description ist 164 Zeichen lang (erlaubt 160)
 *
 * Der Teaser war **exakt 160 Zeichen** lang. Er enthielt „S&P 500", und im
 * ausgelieferten HTML steht dort `&amp;` – vier Zeichen mehr. Gezählt wurde
 * das rohe Markup statt des Textes.
 *
 * ## Warum vier Prüfungen dieselbe Zahl trugen und trotzdem uneins waren
 *
 * `160` steht in `lib/news-validate.ts`, `lib/editions-validate.ts`,
 * `scripts/nachrichten-erzeugen.ts` und `scripts/paket-pruefen.ts`. Alle vier
 * sagen „160" – aber die ersten drei messen den **Text**, die vierte maß das
 * **HTML**. Die Zahl war gespiegelt, der Gegenstand nicht.
 *
 * Das ist der Satz aus `AGENTS.md` in einer Gestalt, die man leicht übersieht:
 * *Eine Doppelung mit guter Begründung altert trotzdem.* Wer vier Stellen
 * gleich hält, hält die Zahl gleich und vergisst zu fragen, wovon sie handelt.
 *
 * ## Warum es nicht früher aufgefallen ist
 *
 * Es braucht beides zugleich: einen Teaser knapp unter der Grenze **und** ein
 * `&` darin. Beides einzeln kommt oft vor, zusammen selten – aber „S&P 500"
 * steht in Börsennachrichten ständig. Ein Fehler, der auf sein Zusammentreffen
 * wartet, ist kein seltener Fehler, sondern ein fälliger.
 */

import { entwerte, metaAngaben } from '../scripts/paket-pruefen.ts'

let failed = 0
function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/* --------------------------------------------------- Der Fall vom 10.9. */

/** Der Teaser, an dem die Ausgabe hing – wortgleich aus dem Entwurf. */
const ECHT =
  'An der Wall Street drückte der hohe Ölpreis auf Dow und S&P 500. ' +
  'Ausgerechnet Meta legte laut mehreren Ticker-Meldungen am selben Tag ' +
  'an der Nasdaq deutlich zu.'

const IM_HTML = ECHT.replaceAll('&', '&amp;')

pruefen(
  'der Teaser selbst ist 160 Zeichen lang, also zulässig',
  ECHT.length === 160,
  `${ECHT.length} statt 160`
)

pruefen(
  'im HTML steht er mit 164 – das war die falsche Zahl',
  IM_HTML.length === 164,
  `${IM_HTML.length} statt 164`
)

pruefen(
  'entwertet ergibt er wieder 160',
  entwerte(IM_HTML).length === 160,
  `${entwerte(IM_HTML).length} statt 160`
)

pruefen('und wortgleich denselben Text', entwerte(IM_HTML) === ECHT)

/* ------------------------------------------- Die Grenze bleibt eine Grenze */

/*
  Die Gegenprobe zur Gegenprobe: Entwerten darf die Prüfung nicht weich
  machen. Ein Text, der **nach** dem Entwerten zu lang ist, muss zu lang
  bleiben – sonst hätte die Behebung von heute die Absicherung abgeschafft,
  die sie retten sollte.
*/
const ZU_LANG = 'x'.repeat(161)
pruefen(
  'ein wirklich zu langer Text bleibt zu lang',
  entwerte(ZU_LANG).length === 161 && entwerte(ZU_LANG).length > 160
)

const KNAPP_MIT_ENTITAET = 'S&amp;P '.repeat(20) + 'x'
pruefen(
  'auch mit vielen Entitäten wird nach dem Entwerten gemessen',
  entwerte(KNAPP_MIT_ENTITAET).length === 'S&P '.repeat(20).length + 1,
  `${entwerte(KNAPP_MIT_ENTITAET).length}`
)

/* ------------------------------------------------- Die Reihenfolge zählt */

/*
  `&amp;` muss **zuletzt** aufgelöst werden. Wer damit anfängt, macht aus dem
  geschriebenen `&amp;lt;` erst `&lt;` und dann `<` – aus Text wird Markup,
  und eine Prüfung, die Markup sucht, schlägt an der falschen Stelle an.
*/
pruefen(
  'ein geschriebenes &lt; bleibt Text und wird nicht zu Markup',
  entwerte('&amp;lt;') === '&lt;',
  entwerte('&amp;lt;')
)

pruefen(
  'die übrigen vier Entitäten kommen ebenfalls zurück',
  entwerte('&lt;a&gt; &quot;x&quot; &#x27;y&#x27;') === `<a> "x" 'y'`,
  entwerte('&lt;a&gt; &quot;x&quot; &#x27;y&#x27;')
)

/* ------------------------------------------- Und der Messweg selbst */

/*
  Die Prüfungen darüber gelten dem Entwerter. Sie blieben alle grün, wenn
  jemand den **Aufruf** in der Paketprüfung entfernte – der Fehler von heute
  wäre zurück, und nichts würde es sagen.

  Deshalb hier die Seite selbst: dasselbe HTML, das der Bau erzeugt, durch
  dieselbe Funktion, die die Paketprüfung benutzt.
*/
const SEITE =
  `<html><head><title>Wall Street: Ölpreis belastet, Meta-Rallye</title>` +
  `<meta name="description" content="${IM_HTML}" />` +
  `</head><body></body></html>`

const gemessen = metaAngaben(SEITE)

pruefen(
  'die Paketprüfung misst die Beschreibung mit 160, nicht mit 164',
  gemessen.beschreibung?.length === 160,
  `${gemessen.beschreibung?.length} – wird hier wieder 164 gezählt, ist der Aufruf ` +
    `von entwerte() aus der Messung gefallen und der 10. September wiederholt sich.`
)

pruefen('und liefert den Text, nicht das Markup', gemessen.beschreibung === ECHT)

pruefen(
  'der Titel kommt ebenfalls entwertet zurück',
  metaAngaben('<title>Dow &amp; Nasdaq</title>').titel === 'Dow & Nasdaq',
  String(metaAngaben('<title>Dow &amp; Nasdaq</title>').titel)
)

pruefen(
  'fehlt eine Angabe, kommt undefined statt einer leeren Zeichenkette',
  metaAngaben('<html></html>').titel === undefined &&
    metaAngaben('<html></html>').beschreibung === undefined
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
